const express  = require('express');
const router = express.Router()

const postsController = require('../controller/posts.controller')

router.get('/getAllPosts', postsController.getAll)
router.get('/getPostId=:id', postsController.getById)
router.get('/getPostByUserId=:userId', postsController.getByUserId)
router.get('/getPostMostLikes', postsController.getPostMostLikes)
router.post('/createPost', postsController.create)
router.put('/updatePostId=:id', postsController.update)
router.put('/isLiked=:id', postsController.updateIsLiked)
router.delete('/deletePostId=:id', postsController.delete)
router.get('/search', postsController.searchByDescript);
module.exports = router