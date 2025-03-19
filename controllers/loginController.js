const jwt = require("jsonwebtoken");
const Register = require("../models/register"); // Import the register model

// Login route
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await Register.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare the entered password directly (plain text comparison)
    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token (including user role in the payload)
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // User ID and Role as payload
      process.env.JWT_SECRET, // Your secret key
      { expiresIn: "1h" } // Token expiry
    );

    // Send back the token in the response
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
