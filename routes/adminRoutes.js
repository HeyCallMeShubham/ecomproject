const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Get platform-wide Save to Pay statistics
router.get('/save-to-pay/stats', adminController.getPlatformStats);

// Get all Save to Pay orders
router.get('/save-to-pay/orders', adminController.getAdminOrders);

// Approve a Save to Pay order
router.put('/save-to-pay/orders/:id/approve', adminController.approveOrder);

// Reject a Save to Pay order
router.put('/save-to-pay/orders/:id/reject', adminController.rejectOrder);

// Get all users
router.get('/users', adminController.getUsers);

// Disable a user
router.put('/users/:id/disable', adminController.disableUser);

// Get all products
router.get('/products', adminController.getProducts);

// Delete a product
router.delete('/products/:id', adminController.deleteProduct);

module.exports = router;
