const { createTransection, getTransectionDetails, updateTransection, deleteTransection, getAllTransection, deleteManyTransection, copyTransection, moveTransection, oppositeTransection } = require('../controllers/transectionControllers')

const router = require('express').Router()

router.post('/:bookId',createTransection)
.get('/all/:bookId',getAllTransection)
.get('/:id',getTransectionDetails)
.put('/:id',updateTransection)
.delete('/:id',deleteTransection)
.delete('/delete-many',deleteManyTransection)
.put('/copy',copyTransection)
.put('/move',moveTransection)
.put('/opposite',oppositeTransection)


module.exports = router