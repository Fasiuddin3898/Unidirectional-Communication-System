const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  request: {
    type: mongoose.Schema.ObjectId,
    ref: 'Request',
    required: true
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  isRequesterMessage: {
    type: Boolean,
    required: true
  },
  expiresAt: {
    type: Date,
    index: { expires: 0 } // TTL index for automatic deletion
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better performance
messageSchema.index({ request: 1, createdAt: 1 });
messageSchema.index({ isRequesterMessage: 1, expiresAt: 1 });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;