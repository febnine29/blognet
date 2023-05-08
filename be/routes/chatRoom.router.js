const express = require('express');
const router = express.Router()

const chatRoomRouter = require('../controller/chatRoom.controller')
router.get('/getAllChatRooms', chatRoomRouter.getAllChatRooms)
router.get('/getChatRoomId=:id', chatRoomRouter.getChatRoomById)
router.post('/create', chatRoomRouter.create)
router.delete('/delete=:id', chatRoomRouter.delete)
module.exports = router