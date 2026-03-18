const variantService = require("../services/variant.service");

exports.createVariant = async (req, res, next) => {
  try {
    const variant = await variantService.createVariant(req.body);
    res.status(201).json(variant);
  } catch (err) {
    next(err);
  }
};

exports.getVariants = async (req, res, next) => {
  try {
    const variants = await variantService.getVariants();
    res.json(variants);
  } catch (err) {
    next(err);
  }
};

// GET BY PRODUCT ID (admin)
exports.getVariantsByProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const variants = await variantService.getVariantsByProduct(id);
    res.json(variants);
  } catch (err) {
    next(err);
  }
};

// GET BY PRODUCT SLUG (user)
exports.getVariantsBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const variants = await variantService.getVariantsBySlug(slug);
    res.json(variants);
  } catch (err) {
    next(err);
  }
};

exports.getVariantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const variant = await variantService.getVariantById(id);

    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    res.json(variant);
  } catch (err) {
    next(err);
  }
};

exports.updateVariant = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No data to update" });
    }

    const variant = await variantService.updateVariant(id, req.body);
    res.json(variant);
  } catch (err) {
    next(err);
  }
};

exports.deleteVariant = async (req, res, next) => {
  try {
    const { id } = req.params;
    await variantService.deleteVariant(id);
    res.json({ message: "Variant deleted" });
  } catch (err) {
    if (err.code === "P2003") {
      return res.status(400).json({
        message: "Cannot delete variant because it is already used in orders",
      });
    }

    next(err);
  }
};
