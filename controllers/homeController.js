

const Thread = require('../models/threadModel')
// renders home page
const homeView = async (req, res) => {
  console.log('homeView')
  try{
    let cookies = req.cookies
    const userLocation = cookies.location.split(',').map(item => item=Number(item))
    let threads = await Thread.find({}).sort({ date: -1 })

    threads = threads.filter(item => {
      return ( getDistance(item.location,userLocation) <= Number(item.range) ) || (String(item.range) == 'Global')
    })
    console.log(threads)
    res.render('index',{
      threads:threads,
      user:req.user,
    })
  }catch(err){res.send({'error':err}) }

}

// adds thread to database
const addThread = async (req, res) => {
  const { topic, postedBy, content } = req.body
  let { tags, bIsAnonPost, location,range } = req.body
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
    if(location){
      location = location.split(',').map(item => item = Number(item))
    }
    if(range){
      range = String(range)
    }
    // console.log(location,range)
    const newThread = new Thread({
      topic,
      content,
      postedBy,
      tags,
      bIsAnonPost,
      location,
      range,
    })
    newThread
      .save()
      .then(res.redirect('/home'))
      .catch((err) => console.log(err))
  }
}

// deletes thread from database
const deleteThread = (req,res) => {
  try{
    // console.log(req.body)
    if(req.user.name === req.body.postedBy){
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
}

const addLikeThread = async (req,res) => {
  try {
    const { threadID, promptS } = req.body
    console.log(threadID,promptS)
    await Thread.findOneAndUpdate({ _id:threadID } , { $inc:{ likes:+1 } })
    res.sendStatus(200)
  }catch(err){console.log(err)}
}

const addDisLikeThread = async (req,res) => {
  try {
    const { threadID, promptS } = req.body
    console.log(threadID,promptS)
    await Thread.findOneAndUpdate({ _id:threadID } , { $inc:{ dislikes: +1 } })
    res.sendStatus(200)
  }catch(err){console.log(err)}
}

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



// exports
module.exports = {
  homeView,
  addThread,
  deleteThread,
  addLikeThread,
  addDisLikeThread,
}