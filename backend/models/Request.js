const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  responder: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;