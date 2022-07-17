const express = require('express')

const homeController = require('../controllers/homeController')
const filecontroller = require('../controllers/fileController')
const { ensureAuth } = require('../authMiddleware/protect')
const { upload } = require('../config/multerconfig')

const router = express.Router()
router.get('/',ensureAuth,filecontroller.getSingleFiles,homeController.homeView)
router.put('/addOneLike',homeController.addLikeThread)
router.put('/addOneDisLike',homeController.addDisLikeThread)
router.post('/addThread',upload.single('post_image'), filecontroller.singleFileUpload,homeController.addThread)


router.post('/',homeController.homeView)
router.delete('/',homeController.deleteThread)

module.exports = router
