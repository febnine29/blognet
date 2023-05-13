const express = require("express")
const router = express.Router()

const followController = require("../controller/follow.controller")

router.post("/checkRelation", followController.checkRelation)
router.post("/setfollow", followController.setFollowed)
router.post("/unfollow", followController.unFollowed)
router.post("/getFollowed", followController.getFollowed)
router.post("/getFollowers", followController.getFollowers)
router.get("/getMostFollowed", followController.getMostFollowed)
module.exports = router