const express = require('express')

const {
    homeView,
} = require('../controllers/homeController')

const { protectRoute } = require('../auth/protect')

const router = express.Router();

router.get('/home',homeView)

module.exports = router;
