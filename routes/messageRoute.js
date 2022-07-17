const express = require('express')
const messageController = require('../controllers/messageController')
const filecontroller = require('../controllers/fileController')

const { ensureAuth } = require('../authMiddleware/protect')
const router = express.Router()

router.get('/:threadId',ensureAuth,messageController.messagesView)

router.post('/',messageController.addMessage)
router.delete('/',messageController.deleteMessage)
router.put('/addLike',messageController.addLike)
router.put('/addDislike',messageController.addDislike)

module.exports = router