const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^([a-z0-9_\-\.]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'seller', 'buyer'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Disabled'],
    default: 'Active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // Optionally include more fields like address, phone number, etc.
});

// Pre-save hook to update the `updatedAt` field whenever the user is updated
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
