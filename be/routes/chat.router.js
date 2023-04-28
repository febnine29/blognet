const express  = require('express');
const router = express.Router()

const chatController = require('../controller/chat.controller')

router.get('/getChatList=:id', chatController.getChatList)
router.post('/getById', chatController.getById)
router.post('/getLatestMessage', chatController.getLastestMessage)
router.post('/create', chatController.create)
router.post('/delete', chatController.delete)
module.exports = router