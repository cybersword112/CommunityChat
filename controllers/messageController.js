const Message = require('../models/messageModel')
const Thread = require('../models/threadModel')

let threadId

module.exports = {
  // renders messages page
  messagesView : async (req, res) => {
    try{
      threadId = req.params.threadId
      const messages = await Message.find({ threadId:threadId }).sort({ date:1 })
      const thread = await Thread.findOneAndUpdate({ _id:threadId }, { $inc: { views: 1 } })
      res.render('forum-single',{
        thread:thread,
        info:messages,
        user:req.user,
        threadId:threadId,
      })
    }catch(err){
      console.log(err);
    }
  },
  addMessage : async (req, res) => {
    const { message } = req.body
    let { user, bIsAnonPost } = req.body
    const { threadId } = req.body
    if (!user || !message || !threadId) {
      console.log('Fill empty fields')
    }
    else {
      try{
        user = JSON.parse(req.body.user)
        if(bIsAnonPost === 'on'){
          bIsAnonPost = true
        } else {
          bIsAnonPost = false
        }
        const newMessage = new Message({
          threadId:threadId,
          message:message,
          user:user,
          bIsAnonPost:bIsAnonPost,
        })
        const thread = await Thread.findById(threadId)
        thread.messages.push(newMessage)
        await thread.save()
        await newMessage.save()
        res.redirect(`/messages/${threadId}`)
      }catch(err){
        console.log(err)
      }
    }
  },
  deleteMessage : (req,res) => {
    Message.findOneAndDelete({ _id:req.body.id })
      .then(() => {
        res.sendStatus(200)
      } )
      .catch((err) => console.log(err))
  },
}
