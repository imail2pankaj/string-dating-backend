const Joi = require('joi');

const signupValidation = {
  body: Joi.object().keys({
    username: Joi.string().required().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_]+$/, "User name should be combination of alphanumeric and underscores."),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
    gender: Joi.string().required().valid('Female', 'Male')
  }),
};

const loginValidation = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const connectValidation = {
  body: Joi.object().keys({
    nick_name: Joi.string().required().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_]+$/, "Nick name should be combination of alphanumeric and underscores."),
  }),
};


module.exports = {
  loginValidation,
  signupValidation,
  connectValidation,
}