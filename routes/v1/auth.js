const express = require('express');

const validate = require('../../middlewares/validate');

const {
  login,
  signup,
  refreshToken,
  me,
  connect,
} = require('../../controllers/auth.controller');

const {
  loginValidation,
  signupValidation,
  connectValidation
} = require('../../validations/auth.validation');

const authenticateJWT = require('../../middlewares/authenticateJWT');

const router = express.Router()

router.post('/login', validate(loginValidation), login)
router.post('/connect', validate(connectValidation), connect)
router.post('/signup', validate(signupValidation), signup)
router.post('/token', refreshToken)
router.get('/me', authenticateJWT, me)

module.exports = router;