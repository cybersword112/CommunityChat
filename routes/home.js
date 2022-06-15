const express = require('express')

const {
  homeView,
} = require('../controllers/homeController')

const { protectRoute } = require('../auth/protect')

const router = express.Router()

router.get('/',protectRoute,homeView)

module.exports = router
