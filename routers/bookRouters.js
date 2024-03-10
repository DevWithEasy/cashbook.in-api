const { getBooks, updateBook, deleteBook, getBook, moveBook, copyBook, memberAdd, memberRemove, memberRoleUpdate, createBook } = require('../controllers/bookControllers')
const authenticated = require('../middleware/authenticated')

const router = require('express').Router()

router.post('/:businessId',authenticated,createBook)
.get('/:businessId',authenticated,getBooks)
.put('/:id',authenticated,updateBook)
.delete('/:id',authenticated,deleteBook)
.post('/member/add',authenticated,memberAdd)
.post('/member/delete',authenticated,memberRemove)
.post('/member/update',authenticated,memberRoleUpdate)
.put('/move/:id',authenticated,moveBook)
.put('/copy/:id',authenticated,copyBook)



module.exports = router