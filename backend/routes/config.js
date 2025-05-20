const express = require('express');
const EmailConfig = require('../models/EmailConfig');
const { protect } = require('../controllers/auth');
const router = express.Router();

// POST /api/config/email - Set up email configuration
router.post('/email', protect, async (req, res) => {
  try {
    // Delete any existing config for this user
    await EmailConfig.deleteMany({ createdBy: req.user.id });

    const config = await EmailConfig.create({
      service: req.body.service || 'gmail',
      email: req.body.email,
      password: req.body.password,
      createdBy: req.user.id
    });

    // Reinitialize email service with new config
    require('../utils/emailService').initializeEmailService();

    res.status(201).json({ status: 'success', data: { config } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
});

module.exports = router;