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
      let userLocation = null
      if(req.cookies.location){
        userLocation = req.cookies.location.split(',').map(item => item=Number(item))
        threads =  threads.filter(item => {
          return ( getDistance(item.location,userLocation) <= Number(item.range) ) || (String(item.range) === 'Global')
        })
      }else{
        threads = threads.filter(item => {
          return (String(item.range) === 'Global')
        })
      }
      let imageList = Array.from(req.filesAll)
      await res.render('index',{
        threads:threads,
        images:imageList,
        user:req.user,
        location:userLocation,
      })
    }catch(err){res.send({ 'error':err }) }
  },
  aboutView : async (req,res) => {
    try{
      res.render('about')
    }catch(error){
      console.log(error)
    }
  },
  // adds thread to database
  addThread : async (req,res) => {
    try{
      const { topic, postedBy, content } = req.body
      let { tags, bIsAnonPost, location,range } = req.body
      if (!topic || !postedBy) {
        console.log('Fill empty fields')
      }
      else {
        tags = tags ? tags.split(',') : tags
        bIsAnonPost = bIsAnonPost === 'on' ? true : false
        location = location ? location.split(',').map(item => item = Number(item)) : location
        range = range ? String(range) : range
        console.log(req.body)
        const newThread = await new Thread({
          topic,
          content,
          postedBy,
          tags,
          bIsAnonPost,
          location,
          range,
          imageID:req.fileID
        })
        console.log(newThread)
        await newThread.save()
        console.log('thread saved')
        res.redirect('/home')
      }
    }catch(err){
      console.log(err)
      res.sendStatus(403)
    }
  },
  // deletes thread from database
  deleteThread : (req,res) => {
    try{
      console.log(req.body)
      Thread.findOneAndDelete({ _id:req.body.id })
        .then(() => {
          res.sendStatus(200)
        } )
        .catch((err) => console.log(err))
    }catch(err){
      console.log(err)
    }
  },

  addLikeThread : async (req,res) => {
    try {
      const { threadID } = req.body
      await Thread.findOneAndUpdate({ _id:threadID } , { $inc:{ likes:+1 } })
      res.sendStatus(200)
    }catch(err){console.log(err)}
  },

  addDisLikeThread : async (req,res) => {
    try {
      const { threadID } = req.body
      await Thread.findOneAndUpdate({ _id:threadID } , { $inc:{ dislikes: +1 } })
      res.sendStatus(200)
    }catch(err){console.log(err)}
  },
}
