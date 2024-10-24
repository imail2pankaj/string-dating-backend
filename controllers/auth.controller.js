const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');

const AppError = require('../utils/ApiError');
const config = require('../config/cfg');
const { findUserByEmail, saveUser, comparePassword, findUser } = require('../services/user.service');
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

    const cookieOption = {
      httpOnly: true,
      domain: config.env === 'production' ? '.testthatsite.site' : "localhost",
      secure: config.env === 'production',
      sameSite: 'lax',
      maxAge: config.jwt.accessExpirationDays * 24 * 60 * 60 * 1000
    }

    res.cookie('accessToken', accessToken, cookieOption);
    res.cookie('refreshToken', refreshToken, cookieOption);

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

  const { email, password, name, gender, username } = req.body;

  try {

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      throw new AppError(httpStatus.CONFLICT, "Email is already registered.")
    }

    const existingUsername = await findUser({ username });

    if (existingUsername) {
      throw new AppError(httpStatus.CONFLICT, "Username is not available, please choose another.")
    }

    await saveUser({ email, password, name, gender, username })

    return res
      .status(httpStatus.CREATED)
      .json({ message: "User registered successfully" })

  } catch (error) {

    return res
      .status(error.statusCode)
      .json({ message: error.message });
  }

}


const connect = async (req, res) => {

  const { nick_name } = req.body;

  try {

    let user = await findUser({ username: nick_name });

    if (!user) {
      const userData = {
        email: `${nick_name}@example.com`,
        username: nick_name,
        password: nick_name,
        name: nick_name,
        gender: "Female",
      }
      user = await saveUser(userData)
    }


    const accessToken = await generateAuthTokens(user)
    const refreshToken = await generateAuthRefreshTokens(user)

    const safeUser = { ...user.get() };
    delete safeUser.password;

    const cookieOption = {
      httpOnly: true,
      domain: config.env === 'production' ? '.testthatsite.site' : "localhost",
      secure: config.env === 'production',
      sameSite: 'lax',
      maxAge: config.jwt.accessExpirationDays * 24 * 60 * 60 * 1000
    }

    res.cookie('accessToken', accessToken, cookieOption);
    res.cookie('refreshToken', refreshToken, cookieOption);

    return res
      .status(httpStatus.OK)
      .json({ user: safeUser, accessToken, message: "Logged in successfully" });

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

module.exports = {
  login,
  signup,
  connect,
  refreshToken,
  me,
}