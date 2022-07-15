const Thread = require('../models/threadModel')

function getDistance(origin, destination) {
  // return distance in meters
  let lon1 = toRadian(origin[1]),
    lat1 = toRadian(origin[0]),
    lon2 = toRadian(destination[1]),
    lat2 = toRadian(destination[0])

  let deltaLat = lat2 - lat1
  let deltaLon = lon2 - lon1

  let a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2)
  let c = 2 * Math.asin(Math.sqrt(a))
  let EARTH_RADIUS = 6371
  let meters =  c * EARTH_RADIUS * 1000
  let miles = meters/1609.34
  return miles
}
function toRadian(degree) {
  return degree*Math.PI/180
}

module.exports = {
  // renders home page
  homeView : async (req, res) => {
    try{
      let threads = await Thread.find({}).sort({ date: -1 })
      console.log(req.cookies.location)
      if(req.cookies.location){
        console.log('has location available in cookie')
        const userLocation = req.cookies.location.split(',').map(item => item=Number(item))
        threads = threads.filter(item => {
          return ( getDistance(item.location,userLocation) <= Number(item.range) ) || (String(item.range) === 'Global')
        })
      }else{
        threads = threads.filter(item => {
          return (String(item.range) === 'Global')
        })
      }
      res.render('index',{
        threads:threads,
        user:req.user,
      })
      console.log('passed home render')
    }catch(err){res.send({ 'error':err }) }

  },
  // adds thread to database
  addThread : async (req,res) => {
    try{
      console.log(req.cookies)
      const { topic, postedBy, content } = req.body
      let { tags, bIsAnonPost, location,range } = req.body
      if (!topic || !postedBy) {
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
        if(location){
          location = location.split(',').map(item => item = Number(item))
        }
        if(range){
          range = String(range)
        }
        console.log(req.file)
        const newThread = new Thread({
          topic,
          content,
          postedBy,
          tags,
          bIsAnonPost,
          location,
          range,
          imagePath:'something'
        })
        console.log(newThread)
        await newThread.save()
        res.redirect('/home')
      }
    }catch(err){
      console.log(err)
    }
  },
  // deletes thread from database
  deleteThread : (req,res) => {
    try{
      // console.log(req.body)
      if(req.user.username === req.body.postedBy){
        Thread.findOneAndDelete({ _id:req.body.id })
          .then(() => {
            res.sendStatus(200)
          } )
          .catch((err) => console.log(err))
      }else{
        res.sendStatus(403)
      }
    }catch(err){
      console.log(err)
    }
  },

  addLikeThread : async (req,res) => {
    try {
      const { threadID, promptS } = req.body
      await Thread.findOneAndUpdate({ _id:threadID } , { $inc:{ likes:+1 } })
      res.sendStatus(200)
    }catch(err){console.log(err)}
  },

  addDisLikeThread : async (req,res) => {
    try {
      const { threadID, promptS } = req.body
      await Thread.findOneAndUpdate({ _id:threadID } , { $inc:{ dislikes: +1 } })
      res.sendStatus(200)
    }catch(err){console.log(err)}
  },
}

// // --------not in use---------
// const renderLocalThreads = async (req,res) => {
//   console.log('renderThreads')
//   console.log(req)
//   try{
//     console.log('req' + req.body)
//     const userLocation = req.body.location.split(',').map(item => item=Number(item))
//     let threads = await Thread.find({}).sort({ date: -1 })
//     threads = threads.filter(item => {
//       return ( getDistance(item.location,userLocation) <= Number(item.range) ) || (String(item.range) === 'Global')
//     })
//     console.log('passed thread local filter, before render')
//     res.render('index',{
//       threads:threads,
//       user:req.user,
//     })
//     console.log('passed local thread render')
//   }catch(err){res.send({ 'error':err }) }
// }

// // adds thread to database from local screen
// // ------not in use
// const addLocalThread = async (req, res) => {
//   const { topic, postedBy, content } = req.body
//   let { tags, bIsAnonPost, location,range } = req.body
//   if (!topic || !postedBy || !content ) {
//     console.log('Fill empty fields')
//   }
//   else {
//     if(tags){
//       tags = tags.split(',')
//     }
//     if(bIsAnonPost === 'on'){
//       bIsAnonPost = true
//     } else {
//       bIsAnonPost = false
//     }
//     if(location){
//       location = location.split(',').map(item => item = Number(item))
//     }
//     if(range){
//       range = String(range)
//     }
//     // console.log(location,range)
//     const newThread = new Thread({
//       topic,
//       content,
//       postedBy,
//       tags,
//       bIsAnonPost,
//       location,
//       range,
//     })
//     newThread
//       .save()
//       .then(res.redirect('/renderLocalThreads'))
//       .catch((err) => console.log(err))
//   }
// }