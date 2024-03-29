const mongoose =require('mongoose')

const transectionSchema = mongoose.Schema({
    book:{
        type:mongoose.Types.ObjectId,
        ref:"Book",
        required : true
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required : true
    },
    amount :{
        type : Number,
        required :true
    },
    remark : {
        type : String
    },
    contact :{
        type:mongoose.Types.ObjectId,
        ref:'Contact',
        default : null
    },
    category :{
        type:mongoose.Types.ObjectId,
        ref:'Category',
        default : null
    },
    payment :{
        type:mongoose.Types.ObjectId,
        ref:'Payment',
        default : null
    },
    entryType :{
        type : String,
        enum : ["cash_in","cash_out"]
    }

},{
    timestamps:true
})

const Transection = mongoose.model('Transection',transectionSchema)
module.exports = Transection