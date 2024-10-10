const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const config = require('../config/cfg');
const { findUserByEmail, saveUser, comparePassword, findUser, updateUser } = require('../services/user.service');
const { generateAuthTokens, generateAuthRefreshTokens } = require('../services/token.service');
const AppError = require('../utils/ApiError');


const me = async (req, res) => {

  const userId = req.user.id

  try {

    const existingUser = await findUser({ id: userId });

    if (!existingUser) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access.")
    }

    return res
      .status(httpStatus.OK)
      .json(existingUser)

  } catch (error) {

    return res
      .status(error.statusCode)
      .json({ message: error.message });
  }

}

const profileUpdate = async (req, res) => {

  const userId = req.user.id

  const { first_name, last_name, gender, age, location, bio } = req.body

  try {

    const existingUser = await findUser({ id: userId });

    if (!existingUser) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access.")
    }

    const values = {
      first_name,
      last_name,
      gender,
      age,
      location,
      bio,
    }

    await updateUser(values, userId)

    return res
      .status(httpStatus.OK)
      .json(existingUser)

  } catch (error) {

    return res
      .status(error.statusCode)
      .json({ message: error.message });
  }

}

const changePassword = async (req, res) => {

  const userId = req.user.id

  const { old_password, new_password, confirm_password } = req.body

  try {

    const existingUser = await findUser({ id: userId });

    if (!existingUser) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access.")
    }

    await comparePassword(old_password, existingUser.password)

    const values = {
      password: await bcrypt.hash(new_password, 10)
    }

    await updateUser(values, userId)

    return res
      .status(httpStatus.OK)
      .json(existingUser)

  } catch (error) {

    return res
      .status(error.statusCode)
      .json({ message: error.message });
  }

}

module.exports = {
  me,
  profileUpdate,
  changePassword,
}