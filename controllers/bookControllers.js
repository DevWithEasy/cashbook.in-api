const Book = require("../models/Book")
const Transection = require("../models/Transection")
const Payment = require("../models/Payment")
const Business = require("../models/Business")
const Contact = require("../models/Contact")
const Category = require("../models/Category")

exports.createBook = async (req, res) => {
    try {
        const newBook = new Book({
            ...req.body,
            user: req.user.id,
            business: req.params.businessId
        })

        await newBook.save()

        const book = await Book.findById(newBook._id)
            .populate('user')
            .populate({
                path: 'members',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })

        await Business.findByIdAndUpdate(req.params.businessId, { $push: { books: book._id } })

        const payments = ['Cash', 'Online']
        payments.forEach(async (payment) => {
            const newPayment = new Payment({
                name: payment,
                book: book._id,
                user: req.user.id
            })
            await newPayment.save()
        })



        return res.status(200).json({
            success: "success",
            status: 200,
            data: {
                ...Book._doc,
                stock: 0
            },
            message: "Successfully Created"
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}

exports.getBooks = async (req, res) => {
    try {
        const books = await Book.find({ "business": req.params.businessId })
            .populate('user')
            .populate({
                path: 'members',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })

        const booksWithTotals = await Promise.all(books.map(async (book) => {
            const cashIn = await Transection.aggregate([
                { $match: { book: book._id, entryType: "cash_in" } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]);

            const cashOut = await Transection.aggregate([
                { $match: { book: book._id, entryType: "cash_out" } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ])

            const totalCashIn = cashIn.length > 0 ? cashIn[0].total : 0
            const totalCashOut = cashOut.length > 0 ? cashOut[0].total : 0

            return {
                ...book.toJSON(),
                stock: totalCashIn - totalCashOut
            };
        }))

        res.status(200).json({
            success: true,
            status: 200,
            data: booksWithTotals
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}

exports.getBook = async (req, res) => {
    try {
        const book = await Book.findOne({ "_id": req.query.id })
            .populate('user')
            .populate({
                path: 'members',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
        const entries = await Transection.find({ book: book._id }).sort({ createdAt: -1 })
        res.status(200).json({
            success: "success",
            status: 200,
            data: { ...book._doc, entries }
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}

exports.updateBook = async (req, res) => {
    try {
        await Book.findByIdAndUpdate(req.params.id,
            {
                name: req.body.name
            }
        )

        const book = await Book.findById(req.params.id)
            .populate('user')
            .populate({
                path: 'members',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })

        return res.status(200).json({
            success: "success",
            status: 200,
            data: book,
            message: "Successfully updated."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: error.message
        })
    }
}

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)

        await Contact.deleteMany({ "book": (req.params.id) })

        await Payment.deleteMany({ "book": (req.params.id) })

        await Transection.deleteMany({ "book": (req.params.id) })

        await Book.deleteOne({ "_id": req.params.id })

        await Business.findByIdAndUpdate(book.business, {
            $pull: {
                books: req.params.id
            }
        })

        return res.status(200).json({
            success: "success",
            status: 200,
            data: {},
            message: "Successfully deleted."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: error.message
        })
    }
}

exports.moveBook = async (req, res) => {
    try {
        const findBook = await Book.findById(req.params.id);

        await Promise.all(findBook.members.map(async (member) => {
            const findBusiness = await Business.find({
                $and: [
                    { _id: req.query.to },
                    { teams: { $elemMatch: { user: member.user } } }
                ]
            })

            if (findBusiness.length === 0) {
                await Business.findByIdAndUpdate(req.query.to, {
                    $push: {
                        teams: {
                            role: 'Staff',
                            user: member.user
                        }
                    }
                })
            }
        }))

        const book = await Book.findByIdAndUpdate(req.params.id, {
            business: req.query.to
        },
            { new: true }
        )

        await Business.findByIdAndUpdate(req.query.to, {
            $pull: {
                books: req.params.id
            }
        })

        return res.status(200).json({
            success: true,
            status: 200,
            data: book,
            message: "Successfully moved."
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        });
    }
};


exports.copyBook = async (req, res) => {
    try {
        const {name,fields} = req.body.values

        const findbook = Book.findById(req.params.id)

        const findEntries = Transection.find({book : req.params.id})

        const findCategories = Category.find({book : req.params.id})

        const findPayments = Payment.find({book : req.params.id})

        const findContacts = Contact.find({book : req.params.id})

        const [book,entries,categories,payments,contacts] = await Promise.all([findbook,findEntries,findCategories,findPayments,findContacts])

        console.log(book,entries, req.body)

        const newBook = new Book({
            name : name,
            business : book.business,
            user : req.user.id
        })

        const saveBook = await newBook.save()

        if(fields.includes('members')){
            Promise.all(
                book.members.map(async(member)=>{
                    await Book.findByIdAndUpdate(saveBook._id,{
                        $push : {
                            members : {
                                role : member.role,
                                user : member.user
                            }
                        }
                    })
                })
            )
        }

        if(fields.includes('category')){
            Promise.all(
                categories.map(async(category)=>{
                    const newCategory = new Category({
                        name : category.name,
                        book : category.book,
                        user : req.user.id
                    })
                    await newCategory.save()
                })
            )
        }

        if(fields.includes('contact')){
            Promise.all(
                contacts.map(async(contact)=>{
                    const newContact = new Contact({
                        name : contact.name,
                        phone : contact.phone,
                        type : contact.type,
                        book : contact.book,
                        user : req.user.id
                    })
                    await newContact.save()
                })
            )
        }

        if(fields.includes('payment')){
            Promise.all(
                payments.map(async(payment)=>{
                    const newPayment = new Payment({
                        name : payment.name,
                        book : payment.book,
                        user : req.user.id
                    })
                    await newPayment.save()
                })
            )
        }

        const finalBook = await Book.findById(saveBook._id)
        .populate('user')
        .populate({
            path: 'members',
            populate: {
                path: 'user',
                model: 'User'
            }
        })

        return res.status(200).json({
            success: true,
            status: 200,
            data: finalBook,
            message: "Successfully copied."
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}

exports.memberAdd = async (req, res) => {
    try {

        const userRole = {
            user: req.body.member,
            role: req.body.role,
            createdAt: Date.now()
        }

        await Book.findByIdAndUpdate(req.body.book, {
            $push: {
                members: userRole
            }
        })

        const book = await Book.findById(req.body.book)
            .populate('user')
            .populate({
                path: 'members',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })

        return res.status(200).json({
            success: true,
            status: 200,
            invite: false,
            data: book,
            message: "Team member added Successfully"
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}

exports.memberRemove = async (req, res) => {
    try {

        await Book.findByIdAndUpdate(req.body.book, {
            $pull: {
                members: {
                    '_id': req.body.member
                }
            }
        })

        const book = await Book.findById(req.body.book)
            .populate('user')
            .populate({
                path: 'members',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })
        return res.status(200).json({
            success: true,
            status: 200,
            data: book,
            message: "Successfully copied."
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}

exports.memberRoleUpdate = async (req, res) => {
    try {

        await Book.updateOne(
            {
                _id: req.body.book,
                'members._id': req.body.member
            },
            {
                $set: {
                    'members.$.role': req.body.role
                }
            }
        )


        const book = await Book.findById(req.body.book)
            .populate('user')
            .populate({
                path: 'members',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })

        return res.status(200).json({
            success: true,
            status: 200,
            data: book,
            message: "Successfully copied."
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}