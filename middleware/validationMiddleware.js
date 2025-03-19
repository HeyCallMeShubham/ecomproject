const { body, validationResult } = require('express-validator');

exports.validateOrderCreation = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('userId').notEmpty().withMessage('User ID is required'),
  body('payment_type').isIn(['save_to_pay','one_time']).withMessage('Invalid payment type'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validatePayment = [
  body('orderId').notEmpty().withMessage('Order ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
