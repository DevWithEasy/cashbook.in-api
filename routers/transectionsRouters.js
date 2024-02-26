const { demo } = require('../controllers/demoControllers')

const router = require('express').Router()

router.post('/:bookId',demo)
.get('/all/:bookId',demo)
.get('/:id',demo)
.put('/:id',demo)
.delete('/:id',demo)
.delete('/delete-many',demo)
.put('/copy',demo)
.put('/move',demo)
.put('/opposte',demo)


module.exports = router