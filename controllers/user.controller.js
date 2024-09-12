const httpStatus = require('http-status');
const AppError = require('../utils/ApiError');
const config = require('../config/cfg');
const { findUserByEmail, saveUser, comparePassword, findUsers } = require('../services/user.service');
const { generateAuthTokens } = require('../services/token.service');
const ApiError = require('../utils/ApiError');

const users = async (req, res) => {

  try {

    const users = await findUsers();

    return res
      .status(httpStatus.OK)
      .json(users);

  } catch (error) {
console.log(error)
    return res
      .status(error.statusCode)
      .json({ message: error.message });

  }

}

module.exports = {
  users,
}