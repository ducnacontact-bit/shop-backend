const orderService = require("../services/order.service")

exports.createOrder = async (req, res, next) => {
  try {

    const order = await orderService.createOrder(req.body)

    res.status(201).json(order)

  } catch (error) {
    next(error)
  }
}

exports.getOrders = async (req, res, next) => {
  try {

    const orders = await orderService.getOrders()

    res.json(orders)

  } catch (error) {
    next(error)
  }
}

exports.getOrderById = async (req, res, next) => {
  try {

    const order = await orderService.getOrderById(req.params.id)

    res.json(order)

  } catch (error) {
    next(error)
  }
}

exports.updateOrderStatus = async (req, res, next) => {
  try {

    const { status } = req.body

    const order = await orderService.updateOrderStatus(req.params.id, status)

    res.json(order)

  } catch (error) {
    next(error)
  }
}

exports.updateOrder = async (req, res, next) => {
  try {

    const order = await orderService.updateOrder(
      req.params.id,
      req.body
    )

    res.json(order)

  } catch (error) {
    next(error)
  }
}