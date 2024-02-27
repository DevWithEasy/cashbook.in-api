const Book = require("../models/Book")
const Transection = require("../models/Transection")
const Payment = require("../models/Payment")

exports.createBook = async(req,res)=>{
    try{
        const newBook = new Book({
            ...req.body,
            user : req.user.id,
            business : req.query.id
        })
        const book = await newBook.save()

        await Business.findByIdAndUpdate(req.query.id,{$push : {books : book._id}})

        const payments = ['Cash','Online']
        payments.forEach(async(payment)=>{
            const newPayment = new Payment({
                name : payment,
                book : book._id,
                user : req.user.id
            })
            await newPayment.save()
        })

        return res.status(200).json({
            success : "success",
            status:200,
            data : {
                ...Book._doc,
                stock : 0
            },
            message:"Successfully Created"
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            status:500,
            message:err.message
        })
    }
}

exports.getBooks = async(req,res)=>{
    try {
        const books = await Book.find({"business" : req.query.id})
        
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
                stock : totalCashIn-totalCashOut
            };
        }))

        res.status(200).json({
            success : true,
            status:200,
            data : booksWithTotals
        })
    } catch (err) {
        res.status(500).json({
            success : false,
            status:500,
            message:err.message
        })
    }
}

exports.getBook = async(req,res)=>{
    try {
        const book = await Book.findOne({"_id" : req.query.id})
        const entries = await Transection.find({book: book._id}).sort({createdAt: -1})
        res.status(200).json({
            success : "success",
            status:200,
            data : {...book._doc,entries}
        })
    } catch (err) {
        res.status(500).json({
            success : false,
            status:500,
            message:err.message
        })
    }
}

exports.updateBook = async(req,res)=>{
    try {
        const book = await Book.findByIdAndUpdate(req.query.id,
        {
            name : req.body.name
        },
        {
            new : true
        }
        )
        return res.status(200).json({
            success : "success",
            status:200,
            data : book,
            message : "Successfully updated."
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            status:500,
            message:error.message
        })
    }
}

exports.deleteBook = async(req,res)=>{
    try {
        const book = await Book.findById(req.query.id)
        
        await Contact.deleteMany({"book" : (req.query.id)})

        await Payment.deleteMany({"book" : (req.query.id)})

        await Transection.deleteMany({"book" : (req.query.id)})

        await Book.deleteOne({"_id" : req.query.id})

        await Business.findByIdAndUpdate(book.business,{
            $pull : {
                books : req.query.id
            }
        })

        return res.status(200).json({
            success : "success",
            status:200,
            data: {},
            message : "Successfully deleted."
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            status:500,
            message:err.message
        })
    }
}

exports.moveBook=async(req,res)=>{
    try {
        const book = await Book.findByIdAndUpdate(req.query.id,{
            business : req.query.to
        },
        {new : true}
        )

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
        })
    }
}

exports.copyBook=async(req,res)=>{
    try {
        console.log(req.query.id,req.body)

        return res.status(200).json({
            success: true,
            status: 200,
            data: {},
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

exports.memberAdd=async(req,res)=>{
    try {

        const userRole = {
            user: req.body.user,
            role: req.body.role,
            createdAt : Date.now()
        }

        await Book.findByIdAndUpdate(req.body.book, {
            $push: {
                teams: userRole
            }
        })

        const book = await Book.findById(req.body.book)

        return res.status(200).json({
            success: true,
            status: 200,
            invite : false, 
            data : book,
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

exports.memberRemove=async(req,res)=>{
    try {
        console.log(req.query.id,req.body)

        return res.status(200).json({
            success: true,
            status: 200,
            data: {},
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

exports.memberRoleUpdate=async(req,res)=>{
    try {
        console.log(req.query.id,req.body)

        return res.status(200).json({
            success: true,
            status: 200,
            data: {},
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