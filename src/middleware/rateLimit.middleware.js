const rateLimit = require("express-rate-limit")

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // tối đa 100 request
  message: {
    message: "Too many requests, please try again later"
  }
})

module.exports = limiter