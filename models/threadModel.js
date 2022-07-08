const mongoose = require('mongoose')

const ThreadSchema = new mongoose.Schema({
  topic:{
    type:String,
    required:true
  },
  content:{
    type:String,
  },
  tags:{
    type:Array,
    required:true,
    default:[]
  },
  postedBy:{
    type:String,
    default:'Anonymous'
  },
  microsoftId: {
    type: String,
    required: true,
  },
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
  views:{
    type:Number,
    default:0
  },
  messages:{
    type:Array,
    default:[],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  location: {
    type:Array,
    default:[]
  },
  range: {
    type:String,
    default:'2'
  }
})

const Thread = mongoose.model('Thread',ThreadSchema)
module.exports = Thread