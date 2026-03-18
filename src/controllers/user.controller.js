const userService = require("../services/user.service")

exports.register = async (req, res, next) => {
  try {

    const user = await userService.register(req.body)

    res.status(201).json(user)

  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {

    const data = await userService.login(req.body)

    res.json(data)

  } catch (error) {
    next(error)
  }
}