const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");

router.post("/admin/login", adminController.adminLogin);

module.exports = router;
