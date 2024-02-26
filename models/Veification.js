import mongoose from 'mongoose';

const verifySchema = mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    expired:{
        type : Date,
        default : Date.now() + 21600000
    }
},{
    timestamps:true
})

const Verification = mongoose.models.Verification || mongoose.model('Verification',verifySchema)
export default Verification