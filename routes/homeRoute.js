const express = require('express')

const {
  homeView,
  addThread,
  deleteThread,
  addLikeThread,
  addDisLikeThread
} = require('../controllers/homeController')

const { protectRoute } = require('../auth/protect')

const router = express.Router()
router.get('/',protectRoute,homeView)
router.put('/addOneLike',protectRoute,addLikeThread)
router.put('/addOneDisLike',protectRoute,addDisLikeThread)
router.post('/',protectRoute,addThread)
router.delete('/',protectRoute,deleteThread)

module.exports = router
