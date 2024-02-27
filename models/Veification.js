const mongoose =require('mongoose')

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

const Verification = mongoose.model('Verification',verifySchema)
module.exports = Verification