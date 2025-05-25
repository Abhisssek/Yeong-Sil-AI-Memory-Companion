const jwt = require('jsonwebtoken');
const User = require('../models/userSchema'); // Adjust the path as necessary

// Replace with your actual secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const authMiddleware = async (req, res, next) => {
  // Get token from Authorization header
  const token = req.cookies.token 
//   console.log('Token:', token);
  

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    // Attach user info to the request object
    // req.user = decoded;
    // Optionally, you can fetch user details from the database here
    const user = await User.findById(decoded.id);
    req.user = user;

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = authMiddleware;
