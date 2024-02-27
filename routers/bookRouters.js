const { getBooks, updateBook, deleteBook, getBook, moveBook, copyBook, memberAdd, memberRemove, memberRoleUpdate, createBook } = require('../controllers/bookControllers')
const authenticated = require('../middleware/authenticated')

const router = require('express').Router()

router.post('/:businessId',authenticated,createBook)
.get('/:businessId',authenticated,getBooks)
.put('/:id',authenticated,updateBook)
.delete('/:id',authenticated,deleteBook)
.put('/move',authenticated,moveBook)
.put('/copy',authenticated,copyBook)
.put('/member/add',authenticated,memberAdd)
.put('/member/delete',authenticated,memberRemove)
.put('/member/update',authenticated,memberRoleUpdate)



module.exports = router