const httpStatus = require('http-status');
const config = require('../config/cfg');
const jwt = require('jsonwebtoken');

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  // const authHeader = req.headers.authorization;

  const token = req.cookies.accessToken;

  if (token) {

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