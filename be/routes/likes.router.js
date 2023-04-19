const express  = require('express');
const router = express.Router()

const likesController = require('../controller/likes.controller')

router.get('/getLikes=:id', likesController.getLikes)
router.post('/like', likesController.create)
router.delete('/unLike', likesController.delete)
module.exports = router