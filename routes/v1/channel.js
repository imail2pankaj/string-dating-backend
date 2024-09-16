const express = require('express');

const validate = require('../../middlewares/validate');

const {
  joinChannel,
} = require('../../controllers/channel.controller');

const authenticateJWT = require('../../middlewares/authenticateJWT');

// const {
//   loginValidation,
//   signupValidation
// } = require('../../validations/auth.validation');

const router = express.Router()

router.post('/join-channel', authenticateJWT, joinChannel)

module.exports = router;