const express  = require('express');
const router = express.Router()

const childrenCmtController = require('../controller/childrenCmt.controller')

router.get('/', childrenCmtController.getAll)
router.get('/cmt=:id', childrenCmtController.getCommentById)
router.post('/', childrenCmtController.create)
router.put('/:id', childrenCmtController.update)
router.post('/', childrenCmtController.delete)
module.exports = router