const Image = require('../models/imageModel')
let fs = require('fs')
let path = require('path')
const cloudinary = require('cloudinary').v2

const singleFileUpload = async (req, res, next) => {
  try{

    console.log(req.user)

    if(req.file !== null){

      console.log(req.file)

      const image = await cloudinary.uploader.upload(req.file.path,{
        folder:'CommunityChat',
      })
      const imageUrl = image.secure_url
      const imageCloudinaryID = image.public_id

      const file = await new Image({
        fileName: req.file.originalname,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2), // 0.00
        cloudinaryURL: imageUrl,
        cloudinaryID: imageCloudinaryID,
      })

      req.fileID = null
      let fileDoc = await file.save()
      req.fileID = fileDoc._id
      next()
    }else{
      console.log('no req.file in fileupload controller')
      req.fileID = null
      next()
    }
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

const getSingleFiles = async (req, res, next) => {
  try{
    const images = await Image.find()
    // res.status(200).send(files)
    req.filesAll = images
    next()
  }catch(error) {
    res.status(400).send(error.message)
  }
}

const deleteSingleFiles = async (req, res, next) => {
  try{
    if(req.body.imageId){
      const image = await Image.findById(req.body.imageId)
      const imageCloudinaryID = image.cloudinaryID
      await cloudinary.uploader.destroy(imageCloudinaryID)
      await Image.deleteOne({ _id:req.body.imageId })
      next()
    }else{
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

const fileSizeFormatter = (bytes, decimal) => {
  if(bytes === 0){
    return '0 Bytes'
  }
  const dm = decimal || 2
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB']
  const index = Math.floor(Math.log(bytes) / Math.log(1000))
  return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index]

}

module.exports = {
  singleFileUpload,
  getSingleFiles,
  deleteSingleFiles,
}

// image: {
//   data: fs.readFileSync(path.join(__dirname , '..','public/uploads/' , req.file.filename)),
//   contentType: 'image/png'
// }