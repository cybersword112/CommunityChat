const Thread = require('../models/threadModel')


const homeView = (req, res) => {
  const threads = Thread.find()
    .then((_)=> {
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

module.exports = {
  homeView,
  addThread,
}