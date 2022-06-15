const express = require('express')

const {
    mainView,
} = require('../controllers/mainController')

const { protectRoute } = require('../auth/protect')

const router = express.Router()

router.get('/main',protectRoute)

module.exports = router;