// requires the express framework for node, necessary here for the router
const express = require('express')
// imports the message controller to access its methods
const messageController = require('../controllers/messageController')
// imports the ensureAuth method from our authentication middleware, used to ensure user is logged in when visiting a route, if not they are kicked to login screen
const { ensureAuth } = require('../authMiddleware/protect')

// sets router as express.router this will handle our requests and call the appropriate controller methods on the request
const router = express.Router()

// handles a get function containing a threadid query to render the requested threads comments page, ensures users are logged in as well
router.get('/:threadId',ensureAuth,messageController.messagesView)
// handles post requests for the current comments page
router.post('/',messageController.addMessage)
// handles delete requests for comments on the current page
router.delete('/',messageController.deleteMessage)
// handles adding likes and dislikes to the current comments page
router.put('/addLike',messageController.addLike)
router.put('/addDislike',messageController.addDislike)

// exports the router to be used in our main index.js app file
module.exports = router