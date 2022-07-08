const express = require('express')

const {
  messagesView,
  addMessage,
  deleteMessage,
} = require('../controllers/messageController')

const { protectRoute } = require('../authMiddleware/protect')

const router = express.Router()

router.get('/:threadId',protectRoute,messagesView)

router.post('/',protectRoute,addMessage)
router.delete('/',protectRoute,deleteMessage)

module.exports = router