//js
const express = require('express')

const {
  registerView,
  loginView,
  registerUser,
  loginUser,
  logoutUser,
} = require('../controllers/loginController')


const router = express.Router()

router.get('/register', registerView)
router.get('/', loginView)
router.get('/login', loginView)
router.post('/logout', logoutUser)

router.post('/register',registerUser)
router.post('/login', loginUser)

module.exports = router