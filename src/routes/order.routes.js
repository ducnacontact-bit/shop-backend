const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

router.post("/orders", orderController.createOrder);

router.get("/orders", auth, admin, orderController.getOrders);

router.get("/orders/:id", orderController.getOrderById);

router.patch(
  "/orders/:id/status",
  auth,
  admin,
  orderController.updateOrderStatus,
);

router.put("/orders/:id", auth, admin, orderController.updateOrder);

module.exports = router;
