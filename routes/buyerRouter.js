const express = require("express");
const router = express.Router();
const buyerController = require("../controllers/buyerController");
const {
  validateOrderCreation,
  validatePayment,
} = require("../middleware/validationMiddleware");
const { authenticateUser } = require("../middleware/authMiddleware"); 

// Route to fetch installment details of a product
router.get(
  "/products/:id/installments",
  authenticateUser,
  buyerController.getInstallments
);

// Route to create a new Save to Pay order
router.post(
  "/orders",
  authenticateUser,
  validateOrderCreation,
  buyerController.createOrder
);

// Route to get installment schedule for an order
router.get(
  "/orders/:id/installments",
  authenticateUser,
  buyerController.getInstallmentSchedule
);

// Route to process a payment for an installment
router.post(
  "/payments",
  authenticateUser,
  validatePayment,
  buyerController.processPayment
);

module.exports = router;
