const express = require('express');

const router = express.Router()

const auth = require('./auth.js');
const user = require('./user.js');
const channel = require('./channel.js');

router.use('/auth', auth);
router.use('/user', user);
router.use('/channel', channel);

module.exports = router;