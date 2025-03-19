const jwt = require('jsonwebtoken');
const User = require('../models/register');  // Assuming you have a User model

// Middleware to authenticate a user
const authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Expecting the token to be sent in the Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Access denied, token is missing' });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by the ID stored in the token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach the user to the request object so it's available in the controller
    req.user = user;
    next();  // Pass the request to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { authenticateUser };
