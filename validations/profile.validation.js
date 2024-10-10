const Joi = require('joi');

const profileValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    bio: Joi.string().required(),
    location: Joi.string().required(),
    age: Joi.number().required().min(15).max(80),
    gender: Joi.string().required().valid('Female', 'Male')
  }),
};

const changePasswordValidation = {
  body: Joi.object().keys({
    old_password: Joi.string().min(3).max(16).required().messages({
      'string.min': 'Password must be between 3 and 16 characters',
      'string.max': 'Password must be between 3 and 16 characters',
      'any.required': 'Old password is required'
    }),
    new_password: Joi.string().min(6).max(16).required().messages({
      'string.min': 'Password must be between 6 and 16 characters',
      'string.max': 'Password must be between 6 and 16 characters',
      'any.required': 'New password is required'
    }),
    confirm_password: Joi.string().valid(Joi.ref('new_password')).required().messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Confirm password is required'
    })
  })
};

module.exports = {
  profileValidation,
  changePasswordValidation,
}