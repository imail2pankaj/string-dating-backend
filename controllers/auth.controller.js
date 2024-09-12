const httpStatus = require('http-status');
const AppError = require('../utils/ApiError');
const config = require('../config/cfg');
const { findUserByEmail, saveUser, comparePassword } = require('../services/user.service');
const { generateAuthTokens } = require('../services/token.service');
const ApiError = require('../utils/ApiError');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await findUserByEmail(email);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found")
    }

    await comparePassword(password, user.password);

    const token = await generateAuthTokens(user)

    const safeUser = { ...user.get() }; 
    delete safeUser.password;

    res.cookie('token', token.token, { httpOnly: true, secure: config.env === 'production' });

    return res
      .status(httpStatus.OK)
      .json({ user: safeUser, token, message: "Logged in successfully" });

  } catch (error) {

    return res
      .status(error.statusCode)
      .json({ message: error.message });

  }

}

const signup = async (req, res) => {

  const { email, password, name, gender } = req.body;

  try {

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      throw new AppError(httpStatus.CONFLICT, "Email is already registered.")
    }

    await saveUser({ email, password, name, gender })

    return res
      .status(httpStatus.CREATED)
      .json({ message: "User registered successfully" })

  } catch (error) {

    return res
      .status(error.statusCode)
      .json({ message: error.message });
  }

}


module.exports = {
  login,
  signup,
}