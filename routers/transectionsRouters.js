const { createTransection, getTransectionDetails, updateTransection, deleteTransection, getAllTransection, deleteManyTransection, copyTransection, moveTransection, oppositeTransection, importTransection } = require('../controllers/transectionControllers')
const authenticated = require('../middleware/authenticated')

const router = require('express').Router()

router.post('/:bookId',authenticated,createTransection)
.get('/all/:bookId',authenticated,getAllTransection)
.get('/:id',authenticated,getTransectionDetails)
.put('/delete-many',authenticated,deleteManyTransection)
.put('/:id',authenticated,updateTransection)
.delete('/:id',authenticated,deleteTransection)
.put('/copy',authenticated,copyTransection)
.put('/move',authenticated,moveTransection)
.put('/opposite',authenticated,oppositeTransection)
.post('/import/:bookId',authenticated,importTransection)



module.exports = router