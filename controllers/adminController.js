const Order = require('../models/orders');
const Product = require('../models/product');
const User = require('../models/user'); // Assuming there's a User model for managing users

// Get platform-wide Save to Pay statistics
exports.getPlatformStats = async (req, res) => {
  try {
    // Get the total number of Save to Pay orders
    const totalOrders = await Order.countDocuments({ payment_type: 'Save to Pay' });

    // Get the total sales amount for Save to Pay orders
    const totalSales = await Order.aggregate([
      { $match: { payment_type: 'Save to Pay' } },
      { $group: { _id: null, totalAmount: { $sum: '$total_amount' } } },
    ]);

    // Prepare the statistics
    const stats = {
      totalOrders,
      totalSales: totalSales[0]?.totalAmount || 0,
    };


    res.json(stats);

    

  } catch (err) {
    res.status(500).json({ message: 'Error fetching statistics', error: err.message });
  }
};

// Get all Save to Pay orders for admin view
exports.getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find({ payment_type: 'Save to Pay' }).populate('productId').populate('userId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
};

// Approve a Save to Pay order
exports.approveOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Update order status to 'Approved'
    order.status = 'Approved';
    await order.save();

    res.json({ message: 'Order approved successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Error approving order', error: err.message });
  }
};

// Reject a Save to Pay order
exports.rejectOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Update order status to 'Rejected'
    order.status = 'Rejected';
    await order.save();

    res.json({ message: 'Order rejected successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting order', error: err.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find(); // Assuming User model exists
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

// Disable a user
exports.disableUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Set user status to 'Disabled'
    user.status = 'Disabled';
    await user.save();

    res.json({ message: 'User disabled successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Error disabling user', error: err.message });
  }
};

// Get all products listed on the platform
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
};

// Delete a product by its ID
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
};
