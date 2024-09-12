const jwt = require('jsonwebtoken')
const config = require('../config/config.js')
// import encrypt from './encrypt.js';

/**
 * Generates a token
 * @param {Object} user - user object
 */
const generateToken = (user = '') => {
  try {
    // Gets expiration time
    const expiration = config.jwt.accessExpirationMinutes

    // returns signed and encrypted token
    return jwt.sign(
      {
        data: {
          _id: user
        },
        exp: expiration
      },
      config.jwt.secret
    )
  } catch (error) {
    throw error
  }
}

module.exports = generateToken