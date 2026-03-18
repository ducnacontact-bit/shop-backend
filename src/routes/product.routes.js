const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");

const {
  createProductValidator,
  updateProductValidator,
} = require("../validators/product.validator");

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

router.get("/products", productController.getProducts);
router.get("/products/slug/:slug", productController.getProductBySlug);
router.get("/products/:id", productController.getProductById);

router.post(
  "/products",
  auth,
  admin,
  createProductValidator,
  productController.createProduct,
);

router.put(
  "/products/:id",
  auth,
  admin,
  updateProductValidator,
  productController.updateProduct,
);

router.delete("/products/:id", auth, admin, productController.deleteProduct);

module.exports = router;
