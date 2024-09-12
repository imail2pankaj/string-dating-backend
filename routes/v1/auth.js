const express = require('express');

const validate = require('../../middlewares/validate');

const {
  login,
  signup,
} = require('../../controllers/auth.controller');

const {
  loginValidation,
  signupValidation
} = require('../../validations/auth.validation');

const router = express.Router()

router.post('/login', validate(loginValidation), login)
router.post('/signup', validate(signupValidation), signup)

module.exports = router;