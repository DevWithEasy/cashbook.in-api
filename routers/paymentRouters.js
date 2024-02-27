const { createPayment, getPayments, updatePayment, deletePayment } = require('../controllers/paymentControllers')

const router = require('express').Router()

router.post('/:bookId',createPayment)
.get('/:bookId',getPayments)
.put('/:id',updatePayment)
.delete('/:id',deletePayment)


module.exports = router