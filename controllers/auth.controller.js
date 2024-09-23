const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');

const AppError = require('../utils/ApiError');
const config = require('../config/cfg');
const { findUserByEmail, saveUser, comparePassword } = require('../services/user.service');
const { generateAuthTokens, generateAuthRefreshTokens } = require('../services/token.service');
const ApiError = require('../utils/ApiError');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await findUserByEmail(email);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found")
    }

    await comparePassword(password, user.password);

    const accessToken = await generateAuthTokens(user)
    const refreshToken = await generateAuthRefreshTokens(user)

    const safeUser = { ...user.get() };
    delete safeUser.password;

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: config.env === 'production' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: config.env === 'production' });
    // res.cookie('user', JSON.stringify(safeUser), { httpOnly: true, secure: config.env === 'production' });

    return res
      .status(httpStatus.OK)
      .json({ user: safeUser, accessToken, message: "Logged in successfully" });

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

const refreshToken = async (req, res) => {

  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(403).json({ message: "Forbidden" });
  }

  jwt.verify(refreshToken, config.jwt.secret, async (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const accessToken = await generateAuthRefreshTokens(user);
    return res.json({ accessToken });
  });

}


module.exports = {
  login,
  signup,
  refreshToken,
}