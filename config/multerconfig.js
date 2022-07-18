const multer = require('multer')
// -------------------multer-s3--------
// var express = require('express'),
//     aws = require('aws-sdk'),
//     bodyParser = require('body-parser'),
//     multer = require('multer'),
//     multerS3 = require('multer-s3');

// aws.config.update({
//     secretAccessKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
//     accessKeyId: 'XXXXXXXXXXXXXXX',
//     region: 'us-east-1'
// });

// var app = express(),
//     s3 = new aws.S3();

// app.use(bodyParser.json());

// var upload = multer({
//     storage: multerS3({
//         s3: s3,
//         acl: 'public-read',
//         bucket: 'bucket-name',
//         key: function (req, file, cb) {
//             console.log(file);
//             cb(null, file.originalname); //use Date.now() for unique file keys
//         }
//     })
// });

// //open in browser to see upload form
// app.get('/', function (req, res) {
//     res.sendFile(__dirname + '/index.html');//index.html is inside node-cheat
// });

// //use by upload form
// app.post('/upload', upload.array('upl', 25), function (req, res, next) {
//     res.send({
//         message: "Uploaded!",
//         urls: req.files.map(function(file) {
//             return {url: file.location, name: file.key, type: file.mimetype, size: file.size};
//         })
//     });
// });
  
// app.listen(3000, function () {
//     console.log('Example app listening on port 3000!');
// });
// ------------------

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
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