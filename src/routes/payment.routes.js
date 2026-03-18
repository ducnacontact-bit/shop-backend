const express = require("express")
const router = express.Router()

const paymentController = require("../controllers/payment.controller")

router.post("/payment/:orderId", paymentController.createPayment)

module.exports = router