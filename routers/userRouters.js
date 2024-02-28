const { accountConfirm, checking, invitionAccept, sendOTP, uploadImage, verifyOTP } =require('../controllers/userControllers'
) 
const authenticated = require('../middleware/authenticated')
const router = require('express').Router()

router.post('/send-otp',sendOTP)
.post('/verify-otp',verifyOTP)
.post('/account-confirm',authenticated,accountConfirm)
.post('/invitation-accept',invitionAccept)
.get('/checking',authenticated,checking)
.put('/upload',authenticated,uploadImage)


module.exports = router