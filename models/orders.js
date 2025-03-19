const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    total_amount: {
      type: Number,
      required: true,
    },
    purchase_type: {
      type: String,
      enum: ["save_to_pay", "one_time"],
      required: true,
    },
    down_payment_amount: {
      type: Number,
      required: true,
    },
    payment_type: {
      type: String,
      enum: ['save_to_pay', 'one_time'], // Only these values should be allowed
      required: true,
    },
    
    installments: [
      {
        amount: { type: Number, required: true },
        due_date: { type: Date, required: true },
        status: { type: String, default: "pending" },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "completed", "canceled"],
      required: true,
      default: "pending",
    },
    sellerId: {
      // New field to track the seller of the product
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller", // Assuming you have a Seller model
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);

