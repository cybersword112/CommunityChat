const express = require('express')

const {
  homeView,
  addThread,
} = require('../controllers/homeController')

const { protectRoute } = require('../auth/protect')

const router = express.Router()

router.get('/',protectRoute,homeView)
router.post('/',protectRoute,addThread)

module.exports = router
