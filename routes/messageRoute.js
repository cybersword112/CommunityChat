const express = require('express')
const messageController =  require('../controllers/messageController')
const { ensureAuth } = require('../authMiddleware/protect')
const router = express.Router()

router.get('/:threadId',ensureAuth, messageController.messagesView)
router.post('/',messageController.addMessage)
router.delete('/',messageController.deleteMessage)

module.exports = router