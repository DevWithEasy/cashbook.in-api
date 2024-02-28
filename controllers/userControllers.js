const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { sendOTPLoginAccout, sendOTPCreateAccout } = require('../utils/verifiaction-Email')
const Business = require('../models/Business')
const Book = require('../models/Book')
const Transection = require('../models/Transection')
const Verification = require('../models/Veification')
const Payment = require('../models/Payment')
const generateOTP = require('../utils/generateOTP')

exports.sendOTP = async (req, res) => {
    try {
        const { email } = (req.query)
        const findUser = await User.findOne({ email: email })
        const findCode = await Verification.findOne({ email: email })
        const otp_number = generateOTP()
        const otp_hash = await bcrypt.hash((otp_number).toString(), 10)

        if (!findCode) {
            const verify = new Verification({
                email: email,
                code: otp_hash
            })

            await verify.save()

            if (findUser) {
                sendOTPLoginAccout(process.env.EMAIL, email, otp_number)
            } else {
                sendOTPCreateAccout(process.env.EMAIL, email, otp_number)
            }

            return res.status(200).json({
                success: true,
                status: 200,
                message: "OTP send successfully."
            })
        } else {
            await Verification.updateOne({ email: email }, {
                $set: {
                    code: otp_hash,
                    expired: Date.now() + 21600000
                }
            })

            if (findUser) {
                sendOTPLoginAccout(process.env.EMAIL, email, otp_number)
            } else {
                sendOTPCreateAccout(process.env.EMAIL, email, otp_number)
            }

            return res.status(200).json({
                success: true,
                status: 200,
                message: "OTP send successfully."
            })
        }


    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Internal server error"
        })
    }
}

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = (req.query)
        const findOTP = await Verification.findOne({ email: email })

        const valid = await bcrypt.compare(otp, findOTP.code)

        if (!valid) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "OTP Not Found."
            })
        }
        const finduser = await User.findOne({ email: email })
        if (!finduser) {

            const newUser = new User({
                email: email,
                name: '',
                number: '',
                image: {
                    public_id: '',
                    url: ''
                }
            })

            const user = await newUser.save()

            const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET)

            await Verification.deleteOne({ email: email })

            return res.status(200).json({
                success: true,
                status: 200,
                data: user,
                message: "Successfully signin",
                token
            })
        } else {

            await Verification.deleteOne({ email: email })

            const token = await jwt.sign({ id: finduser._id }, process.env.JWT_SECRET)

            return res.status(200).json({
                success: true,
                status: 200,
                data: finduser,
                message: "Successfully signin",
                token
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Internal server error"
        })
    }
}

exports.accountConfirm = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user.id, {
            $set: {
                name: req.body.name
            }
        },
            { new: true }
        )

        const newBusiness = new Business({
            name: req.body.check ? req.body.name : req.body.businessName,
            user: req.user.id,
            books: [],
            category: 13,
            type: 6,
            teams: [],
            address: '',
            stuffs: 0,
            phone: '',
            email: '',
            payment: ''
        })

        await newBusiness.save()

        const business = await Business.findById(newBusiness._id)
            .populate('user')
            .populate({
                path: 'teams',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })

        const newBook = new Book({
            name: 'Business Book',
            user: req.user.id,
            business: business._id
        })

        const book = await newBook.save()

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
            success: true,
            status: 200,
            data: {
                user: user._doc,
                business: business._doc,
                book: book._doc
            },
            businessId: business._id,
            message: "Account setup successfully",
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Internal server error"
        })
    }
}

exports.invitionAccept = async (req, res) => {
    try {
        const { email, otp } = req.query
        const { token } = req.body

        const findOTP = await Verification.findOne({ email: email })

        const valid = await bcrypt.compare(otp, findOTP.code)

        if (!valid) {
            return res.status(404).json({
                success: false,
                status: 404,
                message: "OTP Not Found."
            })
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
            if (err) return res.status(403).json({
                success: false,
                status: 403,
                message: "Token is not valid."
            })

            const newUser = new User({
                email: email,
                name: '',
                number: '',
                image: {
                    public_id: '',
                    url: ''
                }
            })

            const user = await newUser.save()

            const userRole = {
                user: user._id,
                role: data.role,
                createdAt: Date.now()
            }

            await Business.findByIdAndUpdate(data.business, {
                $push: {
                    teams: userRole
                }
            })

            const newToken = await jwt.sign({ id: user._id }, process.env.JWT_SECRET)

            await Verification.deleteOne({ email: email })

            return res.status(200).json({
                success: true,
                status: 200,
                data: user,
                message: "Successfully signin",
                token: newToken
            })

        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Internal server error"
        })
    }
}

exports.checking = async (req, res) => {
    try {
        const { id } = req.user

        const user = await User.findOne({ _id: id })

        const businesses = await Business.find({
            $or: [
                { user: id },
                { teams: { $elemMatch: { user: id } } }
            ]
        })
            .populate('user')
            .populate({
                path: 'teams',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })

        const books = await Book.find({ user: id })

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

        return res.status(200).json({
            success: true,
            status: 200,
            data: {
                user,
                businesses,
                books: booksWithTotals
            },
            businessId: businesses.length > 0 ? businesses[0]._id : null,
            message: "Successfully signin"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            status: 500,
            message: "Internal server error"
        })
    }
}

exports.uploadImage = async (req, res) => {
    try {
        await initDatabase()
        const user = await User.findOne({ "_id": req.body.id })
        if (user.image.public_id) {
            await cloudinary.uploader.destroy(user.image.public_id)
        }
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'cashbook/users'
        })
        await User.updateOne({ "_id": req.body.id }, {
            $set: {
                "image.public_id": result.public_id,
                "image.url": result.url
            }
        })
        const update = await User.findOne({ "_id": req.body.id })
        res.status(200).json({
            success: false,
            status: 200,
            data: update,
            message: "Profile photo successfully uploaded"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: error.message
        })
    }
}