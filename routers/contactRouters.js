const { createContact, getContacts, updateContact, deleteContact } = require('../controllers/contactControllers')
const authenticated = require('../middleware/authenticated')

const router = require('express').Router()

router.post('/:bookId',authenticated,createContact)
.get('/:bookId',authenticated,getContacts)
.put('/:id',authenticated,updateContact)
.delete('/:id',authenticated,deleteContact)


module.exports = router