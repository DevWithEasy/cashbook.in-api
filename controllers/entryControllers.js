const Entry =require("../model/Entry") 
const History= require("../model/History") 

export const createEntry = async (req, res) => {
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

export const getEntryDetails = async (req, res) => {
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

export const updateEntry = async (req, res) => {
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

export const deleteEntry = async (req, res) => {
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