import mongoose from 'mongoose';

const bookSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    business: {
        type: mongoose.Types.ObjectId,
        ref: 'Business'
    },
    members: {
        type: [
            {
                role  : {
                    type: String,
                },
                user  : {
                    type: mongoose.Types.ObjectId,
                    ref: 'User'
                },
                createdAt : {
                    type : Date,
                    required : true,
                    default : Date.now()
                }
            }
        ],
        default: []
    },
}, {
    timestamps: true
})

const Book = mongoose.models.Book || mongoose.model('Book', bookSchema)
export default Book