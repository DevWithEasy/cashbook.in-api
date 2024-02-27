const mongoose =require('mongoose')

const paymentSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    book:{
        type:mongoose.Types.ObjectId,
        ref:'Book'
    }
},{
    timestamps:true
})

const Payment = mongoose.model('Payment',paymentSchema)
module.exports = Payment