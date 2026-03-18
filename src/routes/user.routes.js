const express = require("express")
const router = express.Router()

const userController = require("../controllers/user.controller")
const loginLimiter = require("../middleware/loginLimiter")
router.post("/auth/register", userController.register)

router.post("/auth/login",loginLimiter, userController.login)

module.exports = router