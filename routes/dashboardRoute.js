const express = require('express')
const { protectRoute } = require('../authMiddleware/protect')
const { dashboardView } = require('../controllers/dashboardController')

const router = express.Router()

router.get('/',protectRoute,dashboardView)

module.exports = router
