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

module.exports = {
  profileValidation
}