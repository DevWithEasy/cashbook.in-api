const mongoose =require('mongoose')

const categorySchema = mongoose.Schema({
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

const Category = mongoose.model('Category',categorySchema)
module.exports = Category