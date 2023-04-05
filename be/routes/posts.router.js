const express  = require('express');
const router = express.Router()

const postsController = require('../controller/posts.controller')

router.get('/getAllPosts', postsController.getAll)
router.get('/getPostId=:id', postsController.getById)
router.post('/createPost', postsController.create)
router.put('/updatePostId=:id', postsController.update)
router.delete('/deletePostId=:id', postsController.delete)
module.exports = router