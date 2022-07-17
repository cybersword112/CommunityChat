const Message = require('../models/messageModel')
const Thread = require('../models/threadModel')
const Image = require('../models/imageModel')

let threadId
module.exports = {
  // renders messages page
  messagesView : async (req, res) => {
    try{
      threadId = req.params.threadId
      const messages = await Message.find({ threadId:threadId }).sort({ date:1 })
      const thread = await Thread.findOneAndUpdate({ _id:threadId }, { $inc: { views: 1 } })
      let image
      if(thread.imageID !== null){
        console.log('imageID is not null in messagesView')
        image = await Image.findById(thread.imageID)
      }
      console.log(image)
      res.render('forum-single',{
        thread:thread,
        info:messages,
        image:image,
        user:req.user,
        threadId:threadId,
      })
    }catch(err){
      console.log(err)
    }
  },
  addMessage : async (req, res) => {
    const { message ,threadId } = req.body
    let { user, bIsAnonPost} = req.body
    // console.log(user)
    if (!user || !message || !threadId) {
      console.log(threadId, message, user)
      console.log('Fill empty fields')
    }
    else {
      try{
        user = JSON.parse(req.body.user)
        bIsAnonPost = bIsAnonPost ==='on' ? true : false
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

  deleteMessage : async (req,res) => {
    try{
      await Message.findOneAndDelete({ _id:req.body.id })
      res.sendStatus(200)
    }catch(err){
      console.log(err)
    }
  },
  addLike: async (req,res) => {
    console.log(req.body)
    try{
      await Message.findOneAndUpdate({ _id:req.body.id },{ $inc:{ likes:+1 } })
      res.sendStatus(200)
    }catch(err){
      console.log(err)
    }
  },
  addDislike: async (req,res) => {
    try{
      await Message.findOneAndUpdate({ _id:req.body.id },{ $inc:{ dislikes:+1 } })
      res.sendStatus(200)
    }catch(err){
      console.log(err)
    }
  }

}