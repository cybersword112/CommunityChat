// requires the express framework for node, necessary here for the router
const express = require('express')
// imports the login controller to use its methods when users are the root path to login or register
const loginController = require('../controllers/loginController')

// sets our router to use the express rout handler
const router = express.Router()

// handles get requests for the registration page, calls the register view method
router.get('/register', loginController.registerView)
// handles get requests to the root path and displays the login page
router.get('/', loginController.loginView)
// same as above, this needs to be corrected.
// *some redirects and references are to this route while by default users go to the root path
router.get('/login', loginController.loginView)
// handles logout post requests
router.post('/logout', loginController.logoutUser)
// handles post request for registering a new user
router.post('/register', loginController.registerUser)
// handles post requests for logging in an existing user, maybe needs to be a PUT?
router.post('/login', loginController.loginUser)

// exports this router for use in the main app file
module.exports = router