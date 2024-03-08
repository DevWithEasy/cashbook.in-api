const Transection = require("../models/Transection")
const History = require("../models/History")
const Category = require("../models/Category")
const Contact = require("../models/Contact")
const Payment = require("../models/Payment")

exports.createTransection = async (req, res) => {
    try {
        const payments = await Payment.find({ book: req.params.bookId, name: 'Cash' })
        const newEntry = new Transection({
            user: req.user.id,
            book: req.params.bookId,
            amount: req.body.amount,
            remark: req.body.remark,
            entryType: req.body.type,
            contact: req.body.contact || null,
            category: req.body.category || null,
            payment: req.body.payment || payments[0]._id,
            createdAt: req.body.createdAt,
        })

        await newEntry.save()

        const entry = await Transection.findById(newEntry._id)
            .populate('user')
            .populate('payment')
            .populate('category')
            .populate('contact')

        res.status(200).json({
            success: true,
            status: 200,
            data: entry,
            message: "Transection created successfully"
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}

exports.getTransectionDetails = async (req, res) => {
    try {
        const entry = await Transection.findById(req.params.id)
            .populate('contact', 'name type')
            .populate('category', 'name')
            .populate('payment', 'name')
            .populate('user', 'name')

        const histories = await History.find({ entry: req.params.id })
            .populate('user', 'name')

        res.status(200).json({
            success: true,
            status: 200,
            data: {
                ...entry._doc,
                histories
            },
            message: "Transection updated successfully"
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}

exports.updateTransection = async (req, res) => {
    try {
        const findEntry = await Transection.findOne({ "_id": req.params.id })

        const newHistory = new History({
            user: req.user.id,
            entry: req.params.id,
            from: findEntry.amount,
            to: req.body.amount,
            remark: req.body.reason
        })

        await Transection.findByIdAndUpdate(req.params.id, {
            $set: {
                amount: req.body.amount,
                entryType: req.body.type,
                remark: req.body.remark,
                contact: req.body.contact || null,
                category: req.body.category || null,
                payment: req.body.payment || null,
            }
        },
            { new: true }
        )

        await newHistory.save()

        const entry = await Transection.findOne({ "_id": req.params.id })
            .populate('user')
            .populate('payment')
            .populate('category')
            .populate('contact')

        return res.status(200).json({
            success: true,
            status: 200,
            data: entry,
            message: "Transection updated successfully"
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}

exports.deleteTransection = async (req, res) => {
    try {
        await Transection.deleteOne({ _id: req.params.id })
        await History.deleteMany({ entry: req.params.id })

        res.status(200).json({
            success: true,
            status: 200,
            message: "Transection deleted successfully"
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}

exports.getAllTransection = async (req, res) => {
    try {
        const entries = await Transection.find({ "book": req.params.bookId })
            .populate('user')
            .populate('payment')
            .populate('category')
            .populate('contact')

        // const data = []

        // await Promise.all(
        //     entries.map(async(entry)=>{
        //         const category = await Category.findById(entry._doc.category).select('name')
        //         const contact = await Contact.findById(entry._doc.contact).select('name type')
        //         const payment = await Payment.findById(entry._doc.payment).select('name')
        //         data.push({
        //             ...entry._doc,
        //             contact,
        //             category,
        //             payment
        //         })
        //     })
        // )

        return res.status(200).json({
            success: true,
            status: 200,
            data: entries,
            message: "Successfully created"
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}

exports.deleteManyTransection = async (req, res) => {
    try {
        await Promise.all(
            req.body.entries.map(async (id) => {

                await Transection.findByIdAndDelete(id)

                const findHistories = await History.find({ entry: id })

                if (findHistories.length === 0) {
                    return
                } else {
                    findHistories.forEach(async (history) => {
                        await History.findByIdAndDelete(history._id)
                    })
                }
            })
        )

        return res.status(200).json({
            success: true,
            status: 200,
            data: {},
            message: "Successfully created"
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}

exports.moveTransection = async (req, res) => {
    try {

        await Promise.all(
            req.body.entries.map(async (id) => {
                await Transection.findByIdAndUpdate(id, {
                    $set: {
                        book: req.query.to
                    }
                })
            })
        )

        return res.status(200).json({
            success: true,
            status: 200,
            data: {},
            message: "Successfully created"
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}

exports.copyTransection = async (req, res) => {
    try {

        await Promise.all(
            req.body.entries.map(async (id) => {
                const findEntry = await Transection.findById(id)

                const newEntry = new Transection({
                    book: req.query.to,
                    user: req.user.id,
                    amount: findEntry.amount,
                    remark: findEntry.remark,
                    category: findEntry.category,
                    payment: findEntry.payment,
                    contact: findEntry.contact,
                    entryType: findEntry.entryType
                })

                await newEntry.save()

                const findHistories = await History.find({ entry: id })

                if (findHistories.length === 0) {
                    return
                } else {
                    findHistories.forEach(async (history) => {
                        const newHistory = new History({
                            entry: newEntry._id,
                            from: history.from,
                            to: history.to,
                            remark: history.remark,
                            createdAt: history.createdAt,
                            updatedAt: history.updatedAt,
                        })
                        await newHistory.save()
                    })
                }
            })
        )

        return res.status(200).json({
            success: true,
            status: 200,
            data: {},
            message: "Successfully created"
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}
exports.oppositeTransection = async (req, res) => {
    try {
        console.log(req.body)
        await Promise.all(
            req.body.entries.map(async (id) => {
                const findEntry = await Transection.findById(id)

                const newEntry = new Transection({
                    book: req.query.to,
                    user: req.user.id,
                    amount: findEntry.amount,
                    remark: findEntry.remark,
                    category: findEntry.category,
                    payment: findEntry.payment,
                    contact: findEntry.contact,
                    entryType: findEntry.entryType === 'cash_in' ? 'cash_out' : 'cash_in',
                })

                await newEntry.save()

                const findHistories = await History.find({ entry: id })

                if (findHistories.length === 0) {
                    return
                } else {
                    findHistories.forEach(async (history) => {
                        const newHistory = new History({
                            entry: newEntry._id,
                            from: history.from,
                            to: history.to,
                            remark: history.remark,
                            createdAt: history.createdAt,
                            updatedAt: history.updatedAt,
                        })
                        await newHistory.save()
                    })
                }
            })
        )

        return res.status(200).json({
            success: true,
            status: 200,
            data: {},
            message: "Successfully created"
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}

exports.importTransection = async (req, res) => {
    try {
        const data = []
        await Promise.all(

            req.body.entries.map(async (entry) => {

                const categoryPromise = Category.findOne({ name: entry.category, book: req.params.bookId })
                const paymentPromise = Payment.findOne({ name: entry.payment, book: req.params.bookId })

                const [category, payment] = await Promise.all([categoryPromise, paymentPromise]);

                let newCat = null;
                let newPay = null;

                if (!category) {
                    const newCategory = new Category({
                        name: entry.category,
                        user: req.user.id,
                        book: req.params.bookId
                    });

                    if (!entry.category) {
                        return newCat = undefined
                    } else {
                        newCat = await newCategory.save();
                    }
                }

                if (!payment) {
                    const newPayment = new Payment({
                        name: entry.payment,
                        user: req.user.id,
                        book: req.params.bookId
                    });

                    if (!entry.payment) {
                        newCat = undefined
                    } else {
                        newPay = await newPayment.save();
                    }
                }

                const categoryStatus = !entry.category ? null : category ? category._id : newCat ? newCat._id : null;
                const paymentStatus = !entry.payment ? null : payment ? payment._id : newPay ? newPay._id : null;

                console.log(categoryStatus,paymentStatus)

                const newEntry = new Transection({
                    book: req.params.bookId,
                    user: req.user.id,
                    amount: entry.amount,
                    remark: entry.remark,
                    category: categoryStatus,
                    payment: paymentStatus,
                    contact: null,
                    entryType: entry.entryType,
                });

                await newEntry.save()
            })
        );
        
        return res.status(200).json({
            success: true,
            status: 200,
            data: {},
            message: "Successfully imported"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        });
    }
};
