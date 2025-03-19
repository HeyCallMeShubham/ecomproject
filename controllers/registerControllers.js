const Register = require('../models/register');  // Assuming Register is your user model

exports.register = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Check if user exists
        const existingUser = await Register.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Create a new user and save to database (password in plain text)
        const newUser = new Register({
            email,
            password,  // Store the plain password directly
            role
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
