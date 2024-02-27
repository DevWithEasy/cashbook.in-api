const Entry =require("../model/Entry") 
const History= require("../model/History") 

exports.createTransection = async (req, res) => {
    try {

        const newEntry = new Entry({
            user: req.user.id,
            book: req.query.id,
            amount: req.body.amount,
            remark: req.body.remark,
            entryType: req.body.type,
            contact: req.body.contact || null,
            category: req.body.category || null,
            payment: req.body.payment || null,
            createdAt: req.body.createdAt,
        })

        await newEntry.save()

        const entry = await Entry.findById(newEntry._id)
        .populate('user')
        .populate('payment')
        .populate('category')
        .populate('contact')

        res.status(200).json({
            success: true,
            status: 200,
            data: entry,
            message: "Entry created successfully"
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}

exports.getTransectionDetails = async (req, res) => {
    try {
        const entry = await Entry.findById(req.query.id)
            .populate('contact','name')
            .populate('category','name')
            .populate('payment','name')
            .populate('user', 'name')

        const histories = await History.find({ entry: req.query.id })
        res.status(200).json({
            success: true,
            status: 200,
            data: {
                ...entry._doc,
                histories
            },
            message: "Entry updated successfully"
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
        const findEntry = await Entry.findOne({ "_id": req.query.id })

        const newHistory = new History({
            entry: req.query.id,
            from: findEntry.amount,
            to: req.body.amount,
            remark: req.body.reason
        })

        await Entry.findByIdAndUpdate(req.query.id, {
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

        const entry = await Entry.findOne({ "_id": req.query.id })
        .populate('user')
        .populate('payment')
        .populate('category')
        .populate('contact')

        return res.status(200).json({
            success: true,
            status: 200,
            data: entry,
            message: "Entry updated successfully"
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
        await Entry.deleteOne({ _id: req.query.id })
        await History.deleteMany({entry : req.query.id})

        res.status(200).json({
            success: true,
            status: 200,
            message: "Entry deleted successfully"
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
    try{
        const entries = await Entry.find({"book" : req.query.id}).populate('user')

        const data = []

        await Promise.all(
            entries.map(async(entry)=>{
                const category = await Category.findById(entry._doc.category).select('name')
                const contact = await Contact.findById(entry._doc.contact).select('name type')
                const payment = await Payment.findById(entry._doc.payment).select('name')
                data.push({
                    ...entry._doc,
                    contact,
                    category,
                    payment
                })
            })
        )
        
        return res.status(200).json({
            success : true,
            status:200,
            data : data,
            message:"Successfully created"
        })
    }catch(err){
        res.status(500).json({
            success : false,
            status:500,
            message:err.message
        })
    }
}

exports.deleteManyTransection = async (req, res) => {
    try {
        await Promise.all(
            req.body.entries.map(async (id) => {

                await Entry.findByIdAndDelete(id)

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
                await Entry.findByIdAndUpdate(id, {
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
                const findEntry = await Entry.findById(id)

                const newEntry = new Entry({
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
                const findEntry = await Entry.findById(id)

                const newEntry = new Entry({
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