const express = require('express');

const validate = require('../../middlewares/validate');

const {
  users,
  userByUsername,
} = require('../../controllers/user.controller');
const authenticateJWT = require('../../middlewares/authenticateJWT');

// app.get('/protected', authenticateJWT, (req, res) => {
//   res.send(`Hello ${req.user.name}, this is a protected route`);
// });

const router = express.Router()

router.get('/', authenticateJWT, users)
// router.get('/', users)
router.get('/:username', userByUsername)

module.exports = router;