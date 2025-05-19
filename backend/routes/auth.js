const express = require('express');
const { check, validationResult } = require('express-validator');
const authController = require('../controllers/auth');

const router = express.Router();

// @route   GET /users/me
// @desc    Get current user
router.get('/users/me', authController.protect, authController.getMe);

// @route   POST /register
// @desc    Register user
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 8 characters').isLength({ min: 8 }),
    check('role', 'Role must be either A or B').isIn(['A', 'B'])
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  authController.register
);

// @route   POST /login
// @desc    Login user
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.login
);

module.exports = router;