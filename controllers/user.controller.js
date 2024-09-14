const httpStatus = require('http-status');
const AppError = require('../utils/ApiError');
const config = require('../config/cfg');
const { findUserByEmail, saveUser, comparePassword, findUsers, findUser } = require('../services/user.service');
const { generateAuthTokens } = require('../services/token.service');
const ApiError = require('../utils/ApiError');
const { Op } = require('sequelize');

const users = async (req, res) => {

  try {

    const users = await findUsers({id: {[Op.ne]: req.user.id}});

    return res
      .status(httpStatus.OK)
      .json(users);

  } catch (error) {

    return res
      .status(error.statusCode)
      .json({ message: error.message });

  }

}

const userByUsername = async (req, res) => {

  const { username } = req.params;

  try {

    const user = await findUser({ username: username });

    if (!user) {
      throw new ApiError(404, 'User not found')
    }

    return res
      .status(httpStatus.OK)
      .json(user);

  } catch (error) {

    return res
      .status(error.statusCode)
      .json({ message: error.message });

  }

}

module.exports = {
  users,
  userByUsername
}