const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  
  name: { type: String, required: true },
  price: { type: Number, required: true },
  is_save_to_pay_enabled: { type: Boolean, default: false },
  minimum_installment_amount: { type: Number, required: true },
  maximum_duration: { type: Number, required: true },
  duration_type: { type: String, enum: ['Days', 'Weeks', 'Months'], required: true },
  down_payment_percentage: { type: Number, default: 0 },
  interest_rate: { type: Number, default: 0 },
  seller_id:{type: String, required: true}

});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;
