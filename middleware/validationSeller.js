// validationMiddleware.js
const { body, param, validationResult } = require('express-validator');

exports.validateProduct = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('seller_id').notEmpty().withMessage('Seller ID is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validateOrderCreation = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('userId').notEmpty().withMessage('User ID is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validateCancelOrder = [
  param('id').notEmpty().withMessage('Order ID is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
