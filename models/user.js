const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/mini-project-1')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    posts:{
        type:
        [{type:mongoose.Schema.Types.ObjectId,
        ref:'post'
        }]}
})

module.exports = mongoose.model('User', userSchema)