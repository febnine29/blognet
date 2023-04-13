const express  = require('express');
const router = express.Router()

const likesController = require('../controller/likes.controller')

router.get('/getAllLikes', likesController.getAll)
router.post('/like', likesController.create)
router.delete('/unLikePostId=:id', likesController.delete)
module.exports = router