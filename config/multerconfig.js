// imports the multer package for handling the raw data provided to the server by a client request.
const multer = require('multer')
// defines the location for node to store the file passed by the request.
let storage = multer.diskStorage({
  // sets the file destination for storage, in our case this is a temporary storage used to then pass the file to our cloudinary storage and the database
  destination: function (req, file, cb) {
    // callback function, and path for destination
    cb(null, './public/uploads')
  },
  // tells multer what the file name should be
  filename: function (req, file, cb) {
    // callback function for naming file
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
  },
})

// this code goes inside the object passed to multer()
// filters the filetypes to those listed here, if other type, will not handle file.
function fileFilter (req, file, cb) {
  // file types to accept
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg'
  || file.mimetype === 'image/jpeg' || file.mimetype ==='image/gif'){
    cb(null, true)
    // else return false and not handle file
  }else {
    cb(null, false)
  }
}
// configure multer using the parameters defined above
const upload = multer({
  storage:storage,
  limits:{ fileSize:5000000 },
  fileFilter:fileFilter,
})
// exports the upload functionality to be used in our file controller
module.exports = { upload }