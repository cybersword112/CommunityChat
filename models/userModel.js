const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  microsoftId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  date:{
    type:Date,
    default:Date.now,
  }
})

const User = mongoose.model('User', UserSchema)
module.exports = User