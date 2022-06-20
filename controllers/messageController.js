const Message = require('../models/messageModel')
const Thread = require('../models/threadModel')

let threadId;

const messagesView = (req, res) => {
  threadId = req.params.threadId
  const messages = Message.find({ threadId:threadId })
    .then((messages) => {

      res.render('messages',{
        info:messages,
        user:req.user._id,
        thread:threadId,
      })
    })
}

const addMessage = async (req, res) => {
  const {threadId , message ,postedBy } = req.body
  if (!postedBy || !message || !threadId) {
    // console.log(threadId, message, postedBy)
    console.log('Fill empty fields')
  }
  else {
    const newMessage = new Message({
      threadId,
      message,
      postedBy
    })
    const thread = await Thread.findById(threadId)
    thread.messages.push(newMessage)
    newMessage
      .save()
      .then(res.redirect('/messages/:threadId'))
      .catch((err) => console.log(err))
  }
}

const deleteMessage = (req,res) => {
  console.log(req.body)
  Message.findOneAndDelete({ _id:req.body.id })
    .then(() => {
      res.sendStatus(200)
    } )
    .catch((err) => console.log(err))
}

module.exports = {
  messagesView,
  addMessage,
  deleteMessage,
}