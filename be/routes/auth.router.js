const express = require("express")
const router = express.Router()

const authController = require("../controller/auth.controller")

router.post("/register", authController.register)
router.post("/login", authController.login)
router.get("/getUserId=:id", authController.getUserById)
router.get("/getAllUsersId", authController.getAllUsersId)
router.post("/updateAvaUserid=:id", authController.updateAva)

module.exports = router