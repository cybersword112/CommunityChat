const Thread = require('../models/threadModel')


const homeView = (req, res) => {
  const threads = Thread.find({})
    .then((threads) => {
      res.render('home',{
        threads:threads,
        user:req.user,
      })
    })
}

const addThread = (req, res) => {
  const { topic, postedBy } = req.body
  if (!topic || !postedBy) {
    console.log('Fill empty fields')
  }
  else {
    const newThread = new Thread({
      topic,
      postedBy
    })
    newThread
      .save()
      .then(res.redirect('/home'))
      .catch((err) => console.log(err))
  }
}

const deleteThread = (req,res) => {
  console.log(req.body)
  Thread.findOneAndDelete({ _id:req.body.id})
    .then(() => {
      res.sendStatus(200)
    } )
    .catch((err) => console.log(err))
}

module.exports = {
  homeView,
  addThread,
  deleteThread,
}