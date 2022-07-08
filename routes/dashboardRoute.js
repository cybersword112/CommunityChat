const express = require('express')
const { ensureAuth } = require('../authMiddleware/protect')
const dashboardController = require('../controllers/dashboardController')
const router = express.Router()

router.get('/',ensureAuth,dashboardController.getDashboardView)

module.exports = router
