const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');

const config = require('../config/cfg');
const { findUserByEmail, saveUser, comparePassword, findUser } = require('../services/user.service');
const { generateAuthTokens, generateAuthRefreshTokens } = require('../services/token.service');
const ApiError = require('../utils/ApiError');


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
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized access.")
    }

    existingUser.first_name = first_name;
    existingUser.last_name = last_name;
    existingUser.gender = gender;
    existingUser.age = age;
    existingUser.location = location;
    existingUser.bio = bio;
    await existingUser.update();

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
}