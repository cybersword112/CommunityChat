const express = require('express')
const homeController = require('../controllers/homeController')
const { ensureAuth } = require('../authMiddleware/protect')
const router = express.Router()

router.get('/',ensureAuth,homeController.homeView)
router.put('/addOneLike',homeController.addLikeThread)
router.put('/addOneDisLike',homeController.addDisLikeThread)
router.post('/addThread',homeController.addThread)
// router.get('/renderLocalThreads',protectRoute,addLocalThread)
router.post('/',homeController.homeView)
router.delete('/',homeController.deleteThread)

module.exports = router
