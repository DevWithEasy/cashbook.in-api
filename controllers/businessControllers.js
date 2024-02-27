const Book = require( "../models/Book")
const Category = require( "../models/Category")
const Contact = require( "../models/Contact")
const Entry = require( "../models/Transection")
const History = require( "../models/History")
const Payment = require( "../models/Payment")
const User = require( "../models/User")
const Business = require("../models/Business")

exports.getBusiness = async (req, res) => {
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

exports.createBusiness = async (req, res) => {
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

exports.updateBusiness = async (req, res) => {
    try {

        await Business.findByIdAndUpdate(req.params.id, {
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
        const business = await Business.findById(req.params.id)
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

exports.deleteBusiness = async (req, res) => {
    try {
        const business =  await Business.findById(req.params.id)

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

        await Business.findByIdAndDelete(req.params.id)

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

exports.getInfo = async (req, res) => {
    try {

        const books = await Book.find({ business: req.params.id })

        let entryCount = 0

        await Promise.all(books.map(async (book) => {
            const entries = await Entry.find({ book : book._id}).count()
            entryCount = entryCount + entries
        }))

        return res.status(200).json({
            success: true,
            status: 200,
            data: {
                books : books.length,
                entries : entryCount
            },
            message: "Successfully Changed"
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}

exports.memberConfirm = async (req, res) => {
    try {
        const findUser =  await User.findById(req.user.id)
        const user = await User.findOne({ email: req.query.email })

        if (user) {
            const userRole = {
                user: user._id,
                role: req.query.role,
                createdAt : Date.now()
            }

            await Business.findByIdAndUpdate(req.query.business, {
                $push: {
                    teams: userRole
                }
            })

            const business = await Business.findById(req.query.business)
            .populate('user')
            .populate({
                path: 'teams',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })

            return res.status(200).json({
                success: true,
                status: 200,
                invite : false,
                data : business,
                message: "Team member added Successfully"
            })
        } else {
            const business = await Business.findById(req.query.business)

            const token = jwt.sign({ business: req.query.business, role: req.query.role }, process.env.JWT_SECRET)

            const url = `http://localhost:3000/invite?token=${token}&email=${req.query.email}&business=${business.name}&name=${findUser?.name}`

            sendInviteAccout(process.env.EMAIL, req.query.email, business.name, url)

            return res.status(200).json({
                success: true,
                invite : true,
                status: 200,
                data : {},
                message: "Invitation send Successfully."
            })
        }

    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}

exports.memberOwnerChange = async (req, res) => {
    try {
        await Business.updateOne({
            _id: req.body.b_id,
            'teams._id': req.body.t_id
        },
            {
                $set: {
                    'user' : req.body.u_id,
                    'teams.$.user': req.user.id
                }
            }
        )

        const business = await Business.findById(req.body.b_id)
            .populate('user')
            .populate({
                path: 'teams',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })

        return res.status(200).json({
            success: true,
            status: 200,
            data: business,
            message: "Successfully Changed"
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}

exports.memberVerify = async (req, res) => {
    try {
        const user = await User.findOne({email : req.query.email})
        
        return res.status(200).json({
            success: true,
            status: 200,
            find : user ? true : false,
            data: user,
            message: "Successfully Changed"
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}

exports.memberRoleChange = async (req, res) => {
    try {
        
        await Business.updateOne({
            _id: req.body.b_id,
            'teams._id': req.body.t_id
        },
            {
                $set: {
                    'teams.$.role': req.body.role
                }
            }
        )

        const business = await Business.findById(req.body.b_id)
            .populate('user')
            .populate({
                path: 'teams',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })

        return res.status(200).json({
            success: true,
            status: 200,
            data: business,
            message: "Successfully Changed"
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
        await Business.updateOne({
            _id: req.body.b_id,
        },
            {
                $pull: {
                    teams: {
                        '_id' : req.body.t_id
                    }
                }
            }
        )

        const business = await Business.findById(req.body.b_id)
            .populate('user')
            .populate({
                path: 'teams',
                populate: {
                    path: 'user',
                    model: 'User'
                }
            })

        return res.status(200).json({
            success: true,
            status: 200,
            data: business,
            message: "Successfully Changed"
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            message: err.message
        })
    }
}