const express = require('express');

const validate = require('../../middlewares/validate');

const {
  joinChannel,
  getChannels,
} = require('../../controllers/channel.controller');

const authenticateJWT = require('../../middlewares/authenticateJWT');

// const {
//   loginValidation,
//   signupValidation
// } = require('../../validations/auth.validation');

const router = express.Router()

router.get('/list', getChannels)
router.post('/join-channel', authenticateJWT, joinChannel)

module.exports = router;