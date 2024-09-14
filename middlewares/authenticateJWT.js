const httpStatus = require('http-status');
const config = require('../config/cfg');
const jwt = require('jsonwebtoken');

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // Extract token (assuming it's in the format "Bearer <token>")
    const token = authHeader.split(' ')[1];

    // Verify the token using the secret key
    jwt.verify(token, config.jwt.secret, (err, user) => {

      if (err) {
        return res.status(httpStatus.FORBIDDEN).json({ message: "Forbidden" });
      }

      req.user = user.sub;
      next();
    });
  } else {
    return res.status(httpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
  }
};

module.exports = authenticateJWT;