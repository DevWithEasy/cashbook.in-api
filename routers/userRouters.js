const { accountConfirm, checking, invitionAccept, sendOTP, uploadImage, verifyOTP } =require('../controllers/userControllers'
) 
const router = require('express').Router()

router.post('/send-otp',sendOTP)
.post('/verify-otp',verifyOTP)
.post('/account-confirm',accountConfirm)
.post('/invitition-accept',invitionAccept)
.get('/checking',checking)
.put('/upload',uploadImage)


module.exports = router