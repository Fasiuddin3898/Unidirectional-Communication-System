const mongoose = require('mongoose');

const emailConfigSchema = new mongoose.Schema({
  service: {
    type: String,
    default: 'gmail'
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const EmailConfig = mongoose.model('EmailConfig', emailConfigSchema);
module.exports = EmailConfig;