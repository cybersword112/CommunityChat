const multer = require('multer')

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
  },
})

// this code goes inside the object passed to multer()
function fileFilter (req, file, cb) {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg'
  || file.mimetype === 'image/jpeg' || file.mimetype ==='image/gif'){
    cb(null, true)
  }else {
    cb(null, false)
  }
}

const upload = multer({
  storage:storage,
  limits:{ fileSize:5000000 },
  fileFilter:fileFilter,
})

module.exports = { upload }