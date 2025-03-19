const Product = require("../models/product");
const Order = require("../models/orders");
const Transaction = require("../models/transaction");
const mongoose = require("mongoose");

// Fetch installment details of a product
exports.getInstallments = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Calculate installment details
    const downPayment = product.price * (product.down_payment_percentage / 100);
    const totalInterest = product.price * (product.interest_rate / 100);
    const totalAmount = product.price + totalInterest;
    const installmentAmount =
      (totalAmount - downPayment) / product.maximum_duration;

    res.json({
      downPayment,
      totalAmount,
      installmentAmount,
      numberOfInstallments: product.maximum_duration,
      interestRate: product.interest_rate,
      durationType: product.duration_type,
    });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error fetching installment details",
        error: err.message,
      });
  }
};

// Create a Save to Pay order
exports.createOrder = async (req, res) => {
  try {
    const {
      productId,
      userId,
      payment_type,
      total_installments,
      down_payment_amount,
      first_payment_due_date,
    } = req.body;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check Save to Pay eligibility
    if (!product.is_save_to_pay_enabled) {
      return res
        .status(400)
        .json({ message: "Save to Pay is not enabled for this product" });
    }

    // Get sellerId from product
    const sellerId = product.sellerId;

    // Calculate installment details
    const installmentAmount =
      (product.price - down_payment_amount) / total_installments;

    // Generate installment schedule
    const installments = Array.from({ length: total_installments }, (_, i) => ({
      amount: installmentAmount,
      due_date: new Date(first_payment_due_date).setMonth(
        new Date(first_payment_due_date).getMonth() + i
      ),
      status: "Pending",
    }));

    const order = new Order({
      productId,
      userId,
      payment_type,
      total_installments,
      down_payment_amount,
      first_payment_due_date,
      purchase_type: "save_to_pay", // Set default purchase_type if not provided
      sellerId, // Automatically set sellerId
      installments,
    });

    await order.save();
    res
      .status(201)
      .json({ message: "Save to Pay order created successfully", order });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating order", error: err.message });
  }
};

// Fetch installment schedule for an order
exports.getInstallmentSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate order ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order.installments);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error fetching order installments",
        error: err.message,
      });
  }
};

// Process payment for an installment
exports.processPayment = async (req, res) => {
  try {
    const { orderId, amount, paymentDate } = req.body;

    // Validate order ID
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Find pending installment
    const installment = order.installments.find(
      (i) => i.amount === amount && i.status === "Pending"
    );
    if (!installment) {
      return res
        .status(404)
        .json({
          message: "Pending installment not found for the given amount",
        });
    }

    installment.status = "Paid";
    await order.save();

    // Record transaction
    const transaction = new Transaction({
      orderId,
      amount,
      payment_date: paymentDate,
    });
    await transaction.save();

    res.status(200).json({ message: "Payment processed successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error processing payment", error: err.message });
  }
};
