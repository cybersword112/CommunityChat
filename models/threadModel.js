const mongoose = require('mongoose')

const ThreadSchema = new mongoose.Schema({
  topic:{
    type:String,
    required:true
  },
  postedBy:{
    type:String,
    default:'Anonymous'
  },
  likes:{
    type:Number,
    default:0
  },
  dislikes:{
    type:Number,
    default:0
  },
  messages:{
    type:Array,
    default:[],
  }
})

const Thread = mongoose.model('Thread',ThreadSchema)
module.exports = Thread