const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import your User model

// Get all users (example route)
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    // Assuming you have authentication middleware that adds user to req
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;