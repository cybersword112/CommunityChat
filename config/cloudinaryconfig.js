// imports cloudinary api package that provides methods for interacting with cloudinary
const cloudinary = require('cloudinary').v2

// exported function to call on our main server file to configure and connect to cloudinary
// actual upload logic is handled by the file controller
function cloudConfig(){
  // accecpts configuration arguments for cloudinary connection
  cloudinary.config({
    // unique cloud name to connect to
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    // cloudinary api key
    api_key: process.env.CLOUDINARY_API_KEY,
    // cloudinary api secret
    api_secret: process.env.CLOUDINARY_API_SECRET,
    // ensures the urls generated are using https protocal for secure connections
    secure: true,
  })
  console.log('cloudinary configured')
}
// exports config function to be ran from my main index.js server file
module.exports = cloudConfig

