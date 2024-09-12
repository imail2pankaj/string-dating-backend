const bcrypt = require('bcrypt');

const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { generateUsername } = require('../utils/functions');

const findUserByEmail = async (email) => {
  const existingUser = await User.findOne({ where: { email } });

  return existingUser;
}

const findUsers = async () => {
  const users = await User.findAll({
    attributes: ['id', 'first_name','last_name','username','email','gender'],
  });

  return users;
}

const comparePassword = async (password, hashedPassword) => {
  const isMatched = await bcrypt.compare(password, hashedPassword);

  if (!isMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid email or password")
  }

  return isMatched
}

const saveUser = async ({ email, password, name, gender }) => {
  const names = name.split(" ");

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    return await User.create({
      email,
      gender,
      username: generateUsername(name),
      first_name: names[0],
      last_name: names.length > 0 ? names[1] : "",
      password: hashedPassword,
    })
  } catch (error) {
    console.log(error)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message)
  }
}


module.exports = {
  comparePassword,
  findUserByEmail,
  saveUser,
  findUsers,
}