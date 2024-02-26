const { demo } = require('../controllers/demoControllers')

const router = require('express').Router()

router.post('/',demo)
.get('/:id',demo)
.get('/',demo)
.put('/:id',demo)
.delete('/:id',demo)


module.exports = router