require('dotenv/config');
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get the token from the request headers
    const token = req.headers.authorization;
  
    // If token is not provided, return an error
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.KEY);
  
      // Attach the decoded user ID to the request object
      req.user = { userId: decoded.userId };
  
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(401).json({ message: 'Invalid token' });
    }
};
module.exports = authMiddleware;