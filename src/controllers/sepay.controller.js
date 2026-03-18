const sepayService = require("../services/sepay.service")

exports.webhook = async (req, res, next) => {

  try {

    console.log("SePay webhook:", req.body)

    const result = await sepayService.handleWebhook(req.body)

    res.json(result)

  } catch (err) {
    next(err)
  }

}