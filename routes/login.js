//js
const express = require('express');

const {
    registerView,
    loginView,
    registerUser,
    loginUser,
} = require('../controllers/loginController')

const {
    mainView,
} = require('../controllers/mainController')

const { protectRoute } = require('../auth/protect')

const { dashboardView } = require('../controllers/dashboardController')

const router = express.Router();

router.get('/register', registerView);
router.get('/login', loginView);
router.get('/main',protectRoute)

router.get('/dashboard',protectRoute,dashboardView)
router.post('/register',registerUser)
router.post('/login', loginUser)

module.exports = router;