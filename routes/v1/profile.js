const express = require('express');

const validate = require('../../middlewares/validate');

const {
  profileUpdate,
  me,
} = require('../../controllers/profile.controller');

const {
  profileValidation
} = require('../../validations/profile.validation');

const authenticateJWT = require('../../middlewares/authenticateJWT');

const router = express.Router()

router.post('/update', [validate(profileValidation), authenticateJWT], profileUpdate)
router.get('/me', authenticateJWT, me)

module.exports = router;