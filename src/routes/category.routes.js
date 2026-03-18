const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/category.controller");

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

router.get("/categories", categoryController.getCategories);
router.get("/categories/:id", categoryController.getCategoryById);
router.get("/categories/slug/:slug", categoryController.getCategoryBySlug);

router.post("/categories", auth, admin, categoryController.createCategory);
router.put("/categories/:id", auth, admin, categoryController.updateCategory);
router.delete(
  "/categories/:id",
  auth,
  admin,
  categoryController.deleteCategory,
);

module.exports = router;
