//js
const express = require('express')

const loginController = require('../controllers/loginController')


const router = express.Router()

router.get('/register', loginController.registerView)
router.get('/', loginController.loginView)
router.get('/login', loginController.loginView)
router.post('/logout', loginController.logoutUser)

router.post('/register', loginController.registerUser)
router.post('/login', loginController.loginUser)

module.exports = router