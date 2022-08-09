const express = require('express')

const homeController = require('../controllers/homeController')
const filecontroller = require('../controllers/fileController')
const { ensureAuth } = require('../authMiddleware/protect')
const { upload } = require('../config/multerconfig')

const router = express.Router()
router.get('/',filecontroller.getSingleFiles,homeController.homeView)
router.put('/addOneLike',ensureAuth,homeController.addLikeThread)
router.put('/addOneDisLike',ensureAuth,homeController.addDisLikeThread)
router.post('/addThread',ensureAuth,upload.single('post_image'), filecontroller.singleFileUpload,homeController.addThread)
router.get('/about',homeController.aboutView)


// router.post('/',homeController.homeView)
router.delete('/',ensureAuth,filecontroller.deleteSingleFiles,homeController.deleteThread)

module.exports = router
