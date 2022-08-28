// imports thread model for use with creating new threads per the request
const Thread = require('../models/threadModel')

// function used to calculate the distance between two coordinates in miles
function getDistance(origin, destination) {
  // return distance in meters
  let lon1 = toRadian(origin[1]),
    lat1 = toRadian(origin[0]),
    lon2 = toRadian(destination[1]),
    lat2 = toRadian(destination[0])
  // difference in latitude and longitude
  let deltaLat = lat2 - lat1
  let deltaLon = lon2 - lon1
  // equation for calculating distance between points on the curvatture of the earth, not exactly correct but close enough for my purpose.
  let a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2)
  let c = 2 * Math.asin(Math.sqrt(a))
  let EARTH_RADIUS = 6371
  let meters =  c * EARTH_RADIUS * 1000
  // converts distance to miles
  let miles = meters/1609.34
  return miles
}
// used to convert degrees to radians
function toRadian(degree) {
  return degree*Math.PI/180
}
// the methods to be exported and made use of by the router
module.exports = {
  // renders home page
  homeView : async (req, res) => {
    try{
      // finds all threads
      let threads = await Thread.find({}).sort({ date: -1 })
      // sets up user location var
      let userLocation = null
      // checks if location is present in the request
      if(req.cookies.location){
        // assigns user location and then converts to a number for use in location evaluation
        userLocation = req.cookies.location.split(',').map(item => item=Number(item))
        // filters threads by user location and view distance
        threads =  threads.filter(item => {
          return ( getDistance(item.location,userLocation) <= Number(item.range) ) || (String(item.range) === 'Global')
        })
      }else{
        // filters to global threads
        threads = threads.filter(item => {
          return (String(item.range) === 'Global')
        })
      }
      // gets the image list from the previous middleware
      let imageList = Array.from(req.filesAll)
      // renders the threads page and inputs data for the template
      await res.render('index',{
        threads:threads,
        images:imageList,
        user:req.user,
        location:userLocation,
      })
    }catch(err){res.send({ 'error':err }) }
  },
  // renders the about page
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
      // destructers these variables from the request
      const { topic, postedBy, content } = req.body
      // destructures the variables from the request
      let { tags, bIsAnonPost, location,range } = req.body
      // ensures user and topic are present
      if (!topic || !postedBy) {
        console.log('Fill empty fields')
      }
      else {
        // processes and splits tags by the comma
        tags = tags ? tags.split(',') : tags
        // checks if user wants anonymous to be shown on the post 
        bIsAnonPost = bIsAnonPost === 'on' ? true : false
        // checks if location is present and if so converts string to number, if false makes no changes
        location = location ? location.split(',').map(item => item = Number(item)) : location
        // checks if post has a visibility range, if so converts to string
        range = range ? String(range) : range
        console.log(req.body)
        // creates a new thread to be saved in the database
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
        // saves the thread
        await newThread.save()
        console.log('thread saved')
        // refreshes
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
      // finds the thread and deletes from the db
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
// adds a like to the thread
  addLikeThread : async (req,res) => {
    try {
      // destructures the request body
      const { threadID } = req.body
      // finds and updates threads to increase number of likes
      await Thread.findOneAndUpdate({ _id:threadID } , { $inc:{ likes:+1 } })
      res.sendStatus(200)
    }catch(err){console.log(err)}
  },
// same as above for adding dislikes to a thread
  addDisLikeThread : async (req,res) => {
    try {
      // destructures the req body for thread id
      const { threadID } = req.body
      // increments the dislike count on our thread per the request from our client
      await Thread.findOneAndUpdate({ _id:threadID } , { $inc:{ dislikes: +1 } })
      res.sendStatus(200)
    }catch(err){console.log(err)}
  },
}
