const express = require('express');

const router = express.Router()

const auth = require('./auth.js');
const user = require('./user.js');

router.use('/auth', auth);
router.use('/user', user);

module.exports = router;