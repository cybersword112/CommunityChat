

const Thread = require('../models/threadModel') 
// renders home page
const homeView = (req, res) => {
  const threads = Thread.find({}).sort({ date: -1 })
    .then((threads) => {
      res.render('index',{
        threads:threads,
        user:req.user,
      })
    })
}
// adds thread to database
const addThread = (req, res) => {
  const { topic, postedBy, content } = req.body
  let { tags, bIsAnonPost } = req.body
  if (!topic || !postedBy || !content ) {
    console.log('Fill empty fields')
  }
  else {
    if(tags){
      tags = tags.split(',')
    }
    if(bIsAnonPost === 'on'){
      bIsAnonPost = true
    } else {
      bIsAnonPost = false
    }
    const newThread = new Thread({
      topic,
      content,
      postedBy,
      tags,
      bIsAnonPost,
    })
    newThread
      .save()
      .then(res.redirect('/home'))
      .catch((err) => console.log(err))
  }
}
// deletes thread from database
const deleteThread = (req,res) => {
  console.log(req.body)
  Thread.findOneAndDelete({ _id:req.body.id })
    .then(() => {
      res.sendStatus(200)
    } )
    .catch((err) => console.log(err))
}
// exports
module.exports = {
  homeView,
  addThread,
  deleteThread,
}