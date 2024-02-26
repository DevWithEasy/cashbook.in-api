const Book = require( "../model/Book")
const Business = require( "../model/Business")
const Category = require( "../model/Category")
const Contact = require( "../model/Contact")
const Entry = require( "../model/Entry")
const History = require( "../model/History")
const Payment = require( "../model/Payment")
const User = require( "../model/User")

export const getBusiness = async (req, res) => {
    try {
        const bussinesses = await Business.find({ user: req.user.id })
            .populate('user')
            .populate({
                path: 'teams',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })

        const books = await Book.find({ business: req.query.id })

        res.status(200).json({
            success: true,
            status: 200,
            data: {
                bussinesses,
                books
            }
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}

export const createBusiness = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id })
        const newBusiness = new Business({
            name: req.body.name,
            user: req.user.id,
            books: [],
            category: req.body.category,
            type: req.body.type,
            teams: [],
            address: '',
            stuffs: 0,
            phone: '',
            email: user.email
        })

        await newBusiness.save()

        const business = await Business.findById(newBusiness._id).populate('user')

        res.status(200).json({
            success: true,
            status: 200,
            data: business,
            message: 'Business created successfully'
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}

export const updateBusiness = async (req, res) => {
    try {

        await Business.findByIdAndUpdate(req.query.id, {
            $set: {
                name: req.body.name,
                address: req.body.address,
                stuffs: req.body.stuffs,
                phone: req.body.phone,
                email: req.body.email,
                category: req.body.category,
                type: req.body.type,
            }
        }
        )
        const business = await Business.findById(req.query.id)
            .populate('user')
            .populate({
                path: 'teams',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })

        res.status(200).json({
            success: "success",
            status: 200,
            data: business,
            message: 'Successfully Updated.'
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}

export const deleteBusiness = async (req, res) => {
    try {
        const business =  await Business.findById(req.query.id)

        await Promise.all(
            business.books.map(async(book)=>{
                const entries = await Entry.find({book : book})

                entries.forEach(async(entry)=>{
                    await History.deleteMany({entry : entry})
                })

                await Entry.deleteMany({book : book})

                await Category.deleteMany({book : book})

                await Payment.deleteMany({book : book})

                await Contact.deleteMany({book : book})

                await Book.findByIdAndDelete(book)
            })
        )

        await Business.findByIdAndDelete(req.query.id)

        res.status(200).json({
            success: true,
            status: 200,
            data: {},
            message : 'Successfully Deleted.'
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}