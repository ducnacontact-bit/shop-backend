const express = require("express");
const router = express.Router();

const variantController = require("../controllers/variant.controller");

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

router.post("/variants", auth, admin, variantController.createVariant);

router.get("/variants", variantController.getVariants);
router.get("/variants/:id", variantController.getVariantById);

router.get("/products/:id/variants", variantController.getVariantsByProduct);
router.get(
  "/products/slug/:slug/variants",
  variantController.getVariantsBySlug,
);

router.put("/variants/:id", auth, admin, variantController.updateVariant);
router.delete("/variants/:id", auth, admin, variantController.deleteVariant);

module.exports = router;
