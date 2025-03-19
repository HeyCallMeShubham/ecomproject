const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");
const {
  validateProduct,
  validateOrderCreation,
  validateCancelOrder,
} = require("../middleware/validationSeller");
const { authenticateUser } = require("../middleware/authMiddleware");

// Product routes
router.post(
  "/products",
  authenticateUser,
  validateProduct,
  sellerController.createProduct
);
router.put(
  "/products/:id",
  authenticateUser,
  validateProduct,
  sellerController.updateProduct
);
router.get(
  "/products/:id/installments",
  authenticateUser,
  sellerController.getInstallments
);

// Order routes
router.post(
  "/orders",
  authenticateUser,
  validateOrderCreation,
  sellerController.createSaveToPayOrder
);
// router.get('/orders/save-to-pay', authenticateUser, sellerController.getSellerOrders);
router.get(
  "/orders/save-to-pay/:sellerId",
  authenticateUser,
  sellerController.getSellerOrders
);

router.put(
  "/orders/:id/cancel",
  authenticateUser,
  validateCancelOrder,
  sellerController.cancelOrder
);

module.exports = router;
