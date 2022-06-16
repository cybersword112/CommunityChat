const express = require('express')

const {
  homeView,
  addThread,
  deleteThread,
} = require('../controllers/homeController')

const { protectRoute } = require('../auth/protect')

const router = express.Router()

router.get('/',protectRoute,homeView)
router.post('/',protectRoute,addThread)
router.delete('/',protectRoute,deleteThread)

module.exports = router
