const Payment =require( "../models/Payment")

exports.getPayments=async(req,res)=>{
    try {
        const payments = await Payment.find({ book: req.query.id })
        res.status(200).json({
            success: true,
            status: 200,
            data: payments
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: error.message
        })
    }
}

exports.createPayment=async(req,res)=>{
    try {
        const newPayment = new Payment({
            name: req.body.name,
            user: req.user.id,
            book: req.query.id
        })

        const payment = await newPayment.save()

        res.status(200).json({
            success: true,
            status: 200,
            data: payment,
            message: 'Payment created.'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: error.message
        })
    }
}

exports.updatePayment=async(req,res)=>{
    try {
        const payment = await Payment.findByIdAndUpdate(req.query.id, {
            $set: {
                name : req.body.name,
            }
        },
            { new: true }
        )

        return res.status(200).json({
            success: true,
            status: 200,
            data: payment,
            message: 'Payment updated.'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: error.message
        })
    }
}

exports.deletePayment=async(req,res)=>{
    try {
        await Payment.findByIdAndDelete(req.query.id)
        return res.status(200).json({
            success: true,
            status: 200,
            data: {},
            message : 'Payment deleted.'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: error.message
        })
    }
}