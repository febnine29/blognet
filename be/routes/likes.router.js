const express  = require('express');
const router = express.Router()

const likesController = require('../controller/posts.controller')

router.get('/getAllLikes', postsController.getAll)
router.get('/getPostId=:id', postsController.getById)
router.post('/createPost', postsController.create)
router.put('/updatePostId=:id', postsController.update)
router.delete('/deletePostId=:id', postsController.delete)
module.exports = router