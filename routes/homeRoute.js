// requires express so I have access to its router
const express = require('express')

// imports homecontroller for the router to have access to its methods
const homeController = require('../controllers/homeController')
// imports the filecontroller so that router has access to its methods
const filecontroller = require('../controllers/fileController')
// imports ensureAuth so router can verify authorized access to the route
const { ensureAuth } = require('../authMiddleware/protect')
// imports upload from my multer configuration to handle file uploads
const { upload } = require('../config/multerconfig')

// sets router to use the express router
const router = express.Router()

// handles get reqs to the home root path retrieves pictures and then renders the home page/thread page
router.get('/',filecontroller.getSingleFiles,homeController.homeView)
// handles put requests for adding a like/dislike to a certain thread
router.put('/addOneLike',ensureAuth,homeController.addLikeThread)
router.put('/addOneDisLike',ensureAuth,homeController.addDisLikeThread)
// handles post request for adding a thread, ensures the user is logged in, uploads the image if present, first to the file system (fs) and then to cloudinary, then finally the addthread method saves the thread to mongoDB
router.post('/addThread',ensureAuth,upload.single('post_image'), filecontroller.singleFileUpload, homeController.addThread)
// handles get requests for the about route
router.get('/about',homeController.aboutView)


// handles delete requests for the selected thread if the user is valid
router.delete('/',ensureAuth,filecontroller.deleteSingleFiles,homeController.deleteThread)
// exports the router for use in the main app file
module.exports = router
