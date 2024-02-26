const { demo } = require('../controllers/demoControllers')

const router = require('express').Router()

router.post('/send-otp',demo)
.post('/verify-otp',demo)
.post('/account-confirm',demo)
.post('/invitition-accept',demo)
.get('/checking',demo)


module.exports = router