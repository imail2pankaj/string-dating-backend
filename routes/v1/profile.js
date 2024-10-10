const express = require('express');

const validate = require('../../middlewares/validate');

const {
  me,
  profileUpdate,
  changePassword,
} = require('../../controllers/profile.controller');

const {
  profileValidation,
  changePasswordValidation,
} = require('../../validations/profile.validation');

const authenticateJWT = require('../../middlewares/authenticateJWT');

const router = express.Router()

router.post('/update', [validate(profileValidation), authenticateJWT], profileUpdate)
router.post('/change-password', [validate(changePasswordValidation), authenticateJWT], changePassword)
router.get('/me', authenticateJWT, me)

module.exports = router;