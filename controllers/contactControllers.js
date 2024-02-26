const Contact = require("../model/Contact")

export const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({ book: req.query.id })
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

export const createContact = async (req, res) => {
    try {
        const newContact = new Contact({
            name: req.body.name,
            phone: req.body.phone,
            type: req.body.type,
            user: req.user.id,
            book: req.query.id
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

export const updateContact = async (req, res) => {
    try {

        const contact = await Contact.findByIdAndUpdate(req.query.id, {
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

export const deleteContact = async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.query.id)
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