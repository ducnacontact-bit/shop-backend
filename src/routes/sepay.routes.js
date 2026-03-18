const express = require("express");
const router = express.Router();

const sepayController = require("../controllers/sepay.controller");

router.post("/sepay-webhook", sepayController.webhook);

module.exports = router;
