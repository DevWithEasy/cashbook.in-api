const { createPayment, getPayments, updatePayment, deletePayment } = require('../controllers/paymentControllers')
const authenticated = require('../middleware/authenticated')

const router = require('express').Router()

router.post('/:bookId',authenticated,createPayment)
.get('/:bookId',authenticated,getPayments)
.put('/:id',authenticated,updatePayment)
.delete('/:id',authenticated,deletePayment)


module.exports = router