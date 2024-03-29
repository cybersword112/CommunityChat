// imports the image schema model to save a new image to our db
const Image = require('../models/imageModel')
// imports the cloudinary package to allow access to cloudinary methods
const cloudinary = require('cloudinary').v2
// for azure
// imports the client package to use the microsoft azure computer vision api
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient
// imports and allows us to create a new credentials object for authorizing access to azure api's
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials

// async function for handling upload of a single file, passing in next for the arguments means this is a middleware function and can send the request on to the next controller after the function completes.
const singleFileUpload = async (req, res, next) => {
  try{
    // for azure sets the environment variables
    const key = process.env.MS_COMPUTER_VISION_SUBSCRIPTION_KEY
    const endpoint = process.env.MS_COMPUTER_VISION_ENDPOINT
    // for azure creates a new computer vision client object
    const computerVisionClient = new ComputerVisionClient(
      new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }),
      endpoint
    )
    if(req.file !==( null || undefined)){
      // Upload image to cloudinary
      const image = await cloudinary.uploader.upload(req.file.path,{
        folder:'CommunityChat',
      })
      const imageUrl = image.secure_url
      const imageCloudinaryID = image.public_id

      // Analyze a URL image
      // for azure
      console.log('Analyzing objects in image...', imageUrl.split('/').pop())
      // for azure, analyzes and filters the image for adult or racycontent
      const adultCheck = (
        await computerVisionClient.analyzeImage(imageUrl, {
          visualFeatures: ['Adult']
        })
      ).adult
      // visualFeatures: ["ImageType","Faces","Adult","Categories","Color","Tags","Description","Objects","Brands"]
      // Print objects bounding box and confidence
      // for azure, filters content based on adult and offensive content scores.
      if(adultCheck.adultScore > .8 || adultCheck.racyScore > .8){
        console.log('post image denied due to content policy.')
        // sets the fileID back to null so it is not passed to the database
        req.fileID = null
        // deletes the cloudinary upload to prevent saving explicit content
        await cloudinary.uploader.destroy(imageCloudinaryID)
        // proceeds to next route method
        next()
      }else{
        // creates a new image model instance to be saved to the DB
        const file = await new Image({
          fileName: req.file.originalname,
          filePath: req.file.path,
          fileType: req.file.mimetype,
          fileSize: fileSizeFormatter(req.file.size, 2), // 0.00
          cloudinaryURL: imageUrl,
          cloudinaryID: imageCloudinaryID,
        })
        // sets the req properties so the next handler can access the fileID for saving the thread/post
        req.fileID = null
        // saves the file.
        let fileDoc = await file.save()
        // sets file id to id generated by mongodb
        req.fileID = fileDoc._id
        // passes to the next route handler
        next()
      }
  // handles logic if the image analysis with azure computer vision fails the adult check
    }else{
      console.log('no req.file in fileupload controller')
      req.fileID = null
      next()
    }
    // catches any promise based errors that occur in the above process
  }catch(error) {
    console.log(error)
    res.status(400).send(error.message)
  }
}
// const multipleFileUpload = async (req, res, next) => {
//   try{
//     let filesArray = []
//     req.files.forEach(element => {
//       const file = {
//         fileName: element.originalname,
//         filePath: element.path,
//         fileType: element.mimetype,
//         fileSize: fileSizeFormatter(element.size, 2)
//       }
//       filesArray.push(file)
//     })
//     const multipleFiles = new MultipleFile({
//       title: req.body.title,
//       files: filesArray
//     })
//     await multipleFiles.save()
//     res.status(201).send('Files Uploaded Successfully')
//   }catch(error) {
//     res.status(400).send(error.message)
//   }
// }

// handles the retrieval of images from the database, returns a list of all single images
const getSingleFiles = async (req, res, next) => {
  try{
    // finds all mongoose image schemas in the db
    const images = await Image.find()
    // sets the files all property of the request to the returned list
    req.filesAll = images
    // passes to the next route handler
    next()
  }catch(error) {
    // handles any response errors
    res.status(400).send(error.message)
  }
}
// handles the deletion of a single file 
const deleteSingleFiles = async (req, res, next) => {
  try{
    // checks that the image id is present in the request body
    if(req.body.imageId){
      // finds the image by the id
      const image = await Image.findById(req.body.imageId)
      // gets the images cloudinary id to handle deletion from cloudinary
      const imageCloudinaryID = image.cloudinaryID
      // deletes file from mongodb and from cloudinary
      await cloudinary.uploader.destroy(imageCloudinaryID)
      await Image.deleteOne({ _id:req.body.imageId })
      // sends request object to next route handler
      next()
    }else{
      // next handler if no file id available
      next()
    }
    // res.status(200).send(files)
  }catch(error) {
    res.status(400).send(error.message)
  }
}

// const getSingleImage = async (req, res, next) => {
//   try{
//     const image = await Image.find({ _id:req.query.imageID })
//     req.postImage = image
//     next()
//   }catch(error) {
//     res.status(400).send(error.message)
//   }
// }
// const getallMultipleFiles = async (req, res, next) => {
//   try{
//     const files = await MultipleFile.find()
//     res.status(200).send(files)
//   }catch(error) {
//     res.status(400).send(error.message)
//   }
// }

// returns the size of the file for storing the info in mongoDB
// this could probably be eliminated since cloudinary is in use now
const fileSizeFormatter = (bytes, decimal) => {
  if(bytes === 0){
    return '0 Bytes'
  }
  const dm = decimal || 2
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB']
  const index = Math.floor(Math.log(bytes) / Math.log(1000))
  return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index]

}
// exports the defined methods for use in the router
module.exports = {
  singleFileUpload,
  getSingleFiles,
  deleteSingleFiles,
}

// image: {
//   data: fs.readFileSync(path.join(__dirname , '..','public/uploads/' , req.file.filename)),
//   contentType: 'image/png'
// }