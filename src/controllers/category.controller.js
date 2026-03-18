const categoryService = require("../services/category.service");

// CREATE
exports.createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

// GET ALL
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

// GET ONE BY ID
exports.getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json(category);
  } catch (err) {
    next(err);
  }
};

// GET ONE BY SLUG
exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await categoryService.getCategoryBySlug(slug);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json(category);
  } catch (err) {
    next(err);
  }
};

// UPDATE
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "No data to update",
      });
    }

    const category = await categoryService.updateCategory(id, req.body);
    res.json(category);
  } catch (err) {
    next(err);
  }
};

// DELETE
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);

    res.json({
      message: "Category deleted",
    });
  } catch (err) {
    next(err);
  }
};
