const cloudinary = require('cloudinary').v2

function cloudConfig(){
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET ,
    secure: true,
  })
  console.log('cloudinary configged')
}

module.exports = cloudConfig

