const { demo } = require('../controllers/demoControllers')

const router = require('express').Router()

router.get('/',demo)


module.exports = router