const express  = require('express');
const router = express.Router()

const chatController = require('../controller/chat.controller')

router.get('/getChatList=:id', chatController.getChatList)
router.get('/getConversation=:id', chatController.getConversation)
router.post('/checkMessageExist', chatController.checkMessageExist)
router.get('/getLatestMessage=:id', chatController.getLastestMessage)
router.post('/create', chatController.create)
router.post('/delete', chatController.delete)
module.exports = router