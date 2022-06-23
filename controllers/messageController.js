const Message = require('../models/messageModel')
const Thread = require('../models/threadModel')

let threadId

const messagesView = async (req, res) => {
  try{
    threadId = req.params.threadId
    const messages = await Message.find({ threadId:threadId })
    const thread = await Thread.findById(threadId)
    console.log(thread)

    res.render('forum-single',{
      thread:thread,
      info:messages,
      activeUser:req.user,
      threadId:threadId,
    })
    // .then((messages) => {
    // // let messagesObj = messages.map(item=>item.user.toObject())
    //   console.log(messages, threadId, req.user)
    //   res.render('forum-single',{
    //     info:messages,
    //     activeUser:req.user,
    //     threadId:threadId,
    //   })
    // })
  }catch(err){
    console.log(err)
  }
}

const addMessage = async (req, res) => {
  const { message } = req.body
  let { user } = req.body
  const { threadId } = req.body
  // console.log(user)
  if (!user || !message || !threadId) {
    // console.log(threadId, message, postedBy)
    console.log('Fill empty fields')
  }
  else {
    try{
      console.log( req.body.user )
      user = JSON.parse(req.body.user)
      console.log( user.username )

      const newMessage = new Message({
        threadId:threadId,
        message:message,
        user:user,
      })
      const thread = await Thread.findById(threadId)
      thread.messages.push(newMessage)
      await newMessage.save()
      res.redirect(`/messages/${threadId}`)
    }catch(err){
      console.log(err)
    }
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