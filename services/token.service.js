const { User } = require('../models');

const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/cfg.js');
const ApiError = require('../utils/ApiError.js');

const generateToken = (user, expires) => {
  const payload = {
    sub: user,
    iat: moment().unix(),
    exp: expires.unix()
  };
  return jwt.sign(payload, config.jwt.secret);
};


const verifyToken = async (token) => {
  try {
    const payload = jwt.verify(token, config.jwt.secret);

    const user = await User.findById(payload.sub.id)

    if (!user) {
      throw new ApiError(404, 'Token not found');
    }
    return user;
  } catch (error) {
    throw new ApiError("400", error.message)
  }
};

const generateAuthTokens = async (user) => {

  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');

  const accessToken = generateToken(user, accessTokenExpires);

  return {
    token: accessToken,
    expires: accessTokenExpires.toDate(),
  };
};

module.exports = {
  verifyToken,
  generateToken,
  generateAuthTokens
}