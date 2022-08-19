const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
  threadId: {
    type: String,
    required: true,
  },
  message:{
    type:String,
    required:true
  },
  user:{},
  bIsAnonPost:{
    type:Boolean,
    default:false
  },
  likes:{
    type:Number,
    default:0
  },
  dislikes:{
    type:Number,
    default:0
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

const Message = mongoose.model('Message',MessageSchema)
module.exports = Message