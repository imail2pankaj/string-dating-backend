const Joi = require('joi');

const signupValidation = {
  body: Joi.object().keys({
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


module.exports = {
  loginValidation,
  signupValidation
}