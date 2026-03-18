const productService = require("../services/product.service");
const { validationResult } = require("express-validator");

// CREATE
exports.createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await productService.createProduct(req.body);

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// GET ALL
exports.getProducts = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;

    const products = await productService.getProducts({
      page,
      limit,
      search,
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
};

// GET ONE BY SLUG
exports.getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await productService.getProductBySlug(slug);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

// GET ONE BY ID
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await productService.getProductById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

// UPDATE
exports.updateProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "No data to update",
      });
    }

    const product = await productService.updateProduct(id, req.body);

    res.json(product);
  } catch (error) {
    next(error);
  }
};

// DELETE
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    await productService.deleteProduct(id);

    res.json({
      message: "Product deleted",
    });
  } catch (error) {
    if (error.code === "P2003") {
      return res.status(400).json({
        message:
          "Cannot delete product because it or its variants are already used in orders",
      });
    }

    next(error);
  }
};
