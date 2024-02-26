const { getBooks, updateBook, deleteBook, getBook, moveBook, copyBook, memberAdd, memberRemove, memberRoleUpdate } = require('../controllers/bookControllers')

const router = require('express').Router()

router.post('/:businessId',getBook)
.get('/:businessId',getBooks)
.put('/:id',updateBook)
.delete('/:id',deleteBook)
.put('/move',moveBook)
.put('/copy',copyBook)
.put('/member/add',memberAdd)
.put('/member/delete',memberRemove)
.put('/member/update',memberRoleUpdate)



module.exports = router