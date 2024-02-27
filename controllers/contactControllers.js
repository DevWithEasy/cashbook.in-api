const Contact = require("../models/Contact")

exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({ book: req.params.bookId })
        res.status(200).json({
            success: true,
            status: 200,
            data: contacts
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: error.message
        })
    }
}

exports.createContact = async (req, res) => {
    try {
        const newContact = new Contact({
            name: req.body.name,
            phone: req.body.phone,
            type: req.body.type,
            user: req.user.id,
            book: req.params.bookId
        })

        const contact = await newContact.save()

        res.status(200).json({
            success: true,
            status: 200,
            data: contact
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: error.message
        })
    }
}

exports.updateContact = async (req, res) => {
    try {

        const contact = await Contact.findByIdAndUpdate(req.params.bookId, {
            $set: {
                name : req.body.name,
                phone : req.body.phone,
                type : req.body.type,
            }
        },
            { new: true }
        )

        return res.status(200).json({
            success: true,
            status: 200,
            data: contact,
            message: 'Contact updated.'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: error.message
        })
    }
}

exports.deleteContact = async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.bookId)
        return res.status(200).json({
            success: true,
            status: 200,
            data: {},
            message : 'Contact deleted.'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: error.message
        })
    }
}