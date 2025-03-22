const Product = require("../models/product");
const Order = require("../models/orders");
const mongoose = require("mongoose");

// Create a product with Save to Pay options
exports.createProduct = async (req, res) => {
  try {
    
    
    
    const {
      name,
      price,
      is_save_to_pay_enabled,
      minimum_installment_amount,
      maximum_duration,
      duration_type,
      down_payment_percentage,
      interest_rate,
      seller_id,
    } = req.body;



    const product = new Product({
      name,
      price,
      is_save_to_pay_enabled,
      minimum_installment_amount,
      maximum_duration,
      duration_type,
      down_payment_percentage,
      interest_rate,
      seller_id,
    });

    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating product", error: err.message });
  }
};

// Update Save to Pay product settings
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }



    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });



    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }



    res.json({ message: "Product updated successfully", product });
  
  
  
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating product", error: err.message });
  }
};

// Get installment details for a product
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

    const installmentDetails = {
      downPayment: product.price * (product.down_payment_percentage / 100),
      installmentAmount:
        (product.price -
          product.price * (product.down_payment_percentage / 100) +
          product.price * (product.interest_rate / 100)) /
        product.maximum_duration,
      totalAmount:
        product.price + product.price * (product.interest_rate / 100),
      numberOfInstallments: product.maximum_duration,
      interestRate: product.interest_rate,
      durationType: product.duration_type,
    };

    res.json(installmentDetails);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error fetching product installments",
        error: err.message,
      });
  }
};

// Create a Save to Pay order
exports.createSaveToPayOrder = async (req, res) => {
  try {
    const {
      productId,
      userId,
      sellerId,
      quantity,
      payment_method,
      installment_details,
      total_price,
    } = req.body;

    // Validate if all required fields are provided
    if (
      !productId ||
      !userId ||
      !sellerId ||
      !quantity ||
      !payment_method ||
      !total_price
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validate if Save to Pay is enabled for the product
    if (!product.is_save_to_pay_enabled) {
      return res
        .status(400)
        .json({ message: "Save to Pay is not enabled for this product" });
    }

    // Calculate installment details
    const downPaymentAmount =
      product.price * (product.down_payment_percentage / 100);
    const totalInterest = product.price * (product.interest_rate / 100);
    const totalAmount = product.price + totalInterest;
    const installmentAmount =
      (totalAmount - downPaymentAmount) / product.maximum_duration;

    if (installmentAmount < product.minimum_installment_amount) {
      return res
        .status(400)
        .json({ message: "Installment amount is below the minimum required" });
    }

    // Generate payment schedule for installments
    const paymentSchedule = Array.from(
      { length: product.maximum_duration },
      (_, i) => ({
        due_date: new Date().setMonth(new Date().getMonth() + i),
        amount: installmentAmount,
        status: "pending",
      })
    );

    // Create a new order
    const order = new Order({
      product_id: productId,
      customer_id: userId,
      sellerId,
      total_amount: totalAmount,
      purchase_type: "save_to_pay",
      down_payment_amount: downPaymentAmount,
      installments: paymentSchedule,
      status: "pending",
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

// Get Save to Pay orders for a seller

exports.getSellerOrders = async (req, res) => {
  try {
    const { sellerId } = req.params; // Extract sellerId from URL parameters
    
    console.log("Fetching orders for sellerId:", sellerId);  // Log sellerId

    // Validate if sellerId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ message: "Invalid seller ID" });
    }

    // Fetch orders that belong to the seller and have the purchase_type of "save_to_pay"
    const orders = await Order.find({
      sellerId, // Match sellerId field in orders
      purchase_type: "save_to_pay", // Only fetch save-to-pay orders
    });

    console.log("Orders found:", orders);  // Log orders array

    // If orders are found, return them as JSON response
    res.json(orders);

  } catch (err) {
    // In case of any errors, respond with an error message and status 500
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};


// Cancel a Save to Pay order
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate order ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status: "Cancelled" },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error cancelling order", error: err.message });
  }
};
