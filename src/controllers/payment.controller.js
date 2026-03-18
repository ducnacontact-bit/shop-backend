const paymentService = require("../services/payment.service")

async function createPayment(req, res, next) {
  try {
    const { orderId } = req.params

    const payment = await paymentService.createPayment(orderId)

    res.json(payment)

  } catch (err) {
    next(err)
  }
}

module.exports = {
  createPayment
}