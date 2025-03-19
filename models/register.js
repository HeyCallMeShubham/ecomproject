const mongoose = require('mongoose');

// Define the register schema
const registerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true // Ensure email is unique
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['buyer', 'seller', 'admin'], // Example roles
    }
});

// Avoid model redefinition error
const Register = mongoose.models.Register || mongoose.model('Register', registerSchema);

module.exports = Register;
