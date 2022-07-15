const multer = require('multer')
const path = require('path')

let storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,'uploads')
  },
  filename: function(req,file,cb){
    cb(null,file.originalname)
  }
})

// this code goes inside the object passed to multer()
function fileFilter (req, file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/

  // Check ext
  const extname =  filetypes.test(path.extname(file.originalname).toLowerCase())
  // Check mime
  const mimetype = filetypes.test(file.mimetype)

  if(mimetype && extname){
    return cb(null,true)
  } else {
    cb('Error: Images Only!')
  }
}

const upload = multer({
  storage:storage,
  limits:{ fileSize:5000000 },
  fileFilter:fileFilter,
})

module.exports = { upload }