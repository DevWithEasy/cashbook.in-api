const mongoose =require('mongoose')

const historySchema = mongoose.Schema({
    entry:{
        type:mongoose.Types.ObjectId,
        ref:'Entry'
    },
    from:{
        type:Number,
        required:true
    },
    to:{
        type:Number,
        required:true
    },
    remark : {
        type:String
    }
},{
    timestamps:true
})

const History = mongoose.model('History',historySchema)
module.exports = History