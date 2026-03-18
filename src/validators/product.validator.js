const { body } = require("express-validator");

exports.createProductValidator = [
  body("name").notEmpty().withMessage("Name is required"),

  body("slug").notEmpty().withMessage("Slug is required"),

  body("image").optional().isString().withMessage("Image must be a string"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("status")
    .optional()
    .isBoolean()
    .withMessage("Status must be true or false"),

  body("categoryId")
    .optional({ nullable: true, checkFalsy: true })
    .isInt()
    .withMessage("Category ID must be an integer"),
];

exports.updateProductValidator = [
  body("name").optional().isString().withMessage("Name must be a string"),

  body("slug").optional().isString().withMessage("Slug must be a string"),

  body("image").optional().isString().withMessage("Image must be a string"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("status")
    .optional()
    .isBoolean()
    .withMessage("Status must be true or false"),

  body("categoryId")
    .optional({ nullable: true, checkFalsy: true })
    .isInt()
    .withMessage("Category ID must be an integer"),
];
