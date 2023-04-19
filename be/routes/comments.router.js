const express  = require('express');
const router = express.Router()

const commentsController = require('../controller/comments.controller')

router.get('/', commentsController.getAll)
router.get('/cmt=:id', commentsController.getCommentById)
router.post('/', commentsController.create)
router.put('/:id', commentsController.update)
router.delete('/', commentsController.delete)
module.exports = router