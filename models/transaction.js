const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  payment_date: { type: Date, required: true },
  status: { type: String, enum: ['Paid', 'Pending'], default: 'Paid' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
