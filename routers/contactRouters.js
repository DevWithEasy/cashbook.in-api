const { createContact, getContacts, updateContact, deleteContact } = require('../controllers/contactControllers')

const router = require('express').Router()

router.post('/:bookId',createContact)
.get('/:bookId',getContacts)
.put('/:id',updateContact)
.delete('/:id',deleteContact)


module.exports = router