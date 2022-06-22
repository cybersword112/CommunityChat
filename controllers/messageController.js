const Message = require('../models/messageModel')
const Thread = require('../models/threadModel')

let threadId;

const messagesView = (req, res) => {
  threadId = req.params.threadId
  const messages = Message.find({ threadId:threadId })
    .then((messages) => {
      // let messagesObj = messages.map(item=>item.user.toObject())
      // console.log(messages)
      res.render('messages',{
        info:messages,
        activeUser:req.user,
        threadId:threadId,
      })
    })
}

const addMessage = async (req, res) => {
  const { message} = req.body
  let {user} = req.body
  const { threadId } = req.body
  // console.log(user)
  if (!user || !message || !threadId) {
    // console.log(threadId, message, postedBy)
    console.log('Fill empty fields')
  }
  else {
    console.log( req.body.user )
    console.log( user.username )

    const newMessage = new Message({
      threadId:threadId,
      message:message,
      user:user,
    })
    const thread = await Thread.findById(threadId)
    thread.messages.push(newMessage)
    newMessage
      .save()
      .then(res.redirect(`/messages/${threadId}`))

      // .then(res.redirect('/messages/:threadId'))
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