import mongoose from 'mongoose';

const contactSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    type:{
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

const Contact = mongoose.models.Contact || mongoose.model('Contact',contactSchema)
export default Contact