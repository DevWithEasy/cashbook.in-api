import mongoose from 'mongoose';

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

const Payment = mongoose.models.Payment || mongoose.model('Payment',paymentSchema)
export default Payment