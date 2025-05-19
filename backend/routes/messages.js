const express = require('express');
const Message = require('../models/Message');
const Request = require('../models/Request');
const { protect } = require('../controllers/auth');
const router = express.Router();

// Send message (Type A only)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'A') {
      return res.status(403).json({ status: 'fail', message: 'Only requesters can initiate messages' });
    }

    const request = await Request.findOne({
      _id: req.body.requestId,
      requester: req.user.id,
      status: 'accepted'
    });

    if (!request) {
      return res.status(404).json({ status: 'fail', message: 'No accepted request found' });
    }

    // Delete any previous messages from requester (maintain unidirectional flow)
    await Message.deleteMany({
      request: req.body.requestId,
      isRequesterMessage: true
    });

    const message = await Message.create({
      request: req.body.requestId,
      sender: req.user.id,
      content: req.body.content,
      isRequesterMessage: true,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour expiration
    });

    res.status(201).json({ status: 'success', data: { message } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
});

// Respond to message (Type B only)
router.post('/:id/respond', protect, async (req, res) => {
  try {
    if (req.user.role !== 'B') {
      return res.status(403).json({ status: 'fail', message: 'Only responders can respond' });
    }

    const request = await Request.findOne({
      _id: req.params.id,
      responder: req.user.id,
      status: 'accepted'
    });

    if (!request) {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'Request not found or not accepted' 
      });
    }

    // Delete requester's previous message when responder replies
    await Message.deleteMany({
      request: req.params.id,
      isRequesterMessage: true
    });

    const response = await Message.create({
      request: req.params.id,
      sender: req.user.id,
      content: req.body.content,
      isRequesterMessage: false
    });

    res.status(201).json({ status: 'success', data: { message: response } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
});

// Get messages for a request (with automatic cleanup)
router.get('/:requestId', protect, async (req, res) => {
  try {
    // First verify the request exists and is accepted
    const request = await Request.findOne({
      _id: req.params.requestId,
      $or: [
        { requester: req.user.id },
        { responder: req.user.id }
      ],
      status: 'accepted'
    }).populate('requester responder', 'name role');

    if (!request) {
      return res.status(404).json({ 
        status: 'fail', 
        message: 'Request not found or not accepted' 
      });
    }

    // Automatically delete expired requester messages
    await Message.deleteMany({
      request: req.params.requestId,
      isRequesterMessage: true,
      expiresAt: { $lt: new Date() }
    });

    const messages = await Message.find({ request: req.params.requestId })
      .populate('sender', 'name role')
      .sort('createdAt');

    // Calculate time left for response (if responder)
    let timeLeft = 0;
    if (req.user.role === 'B') {
      const requesterMessage = await Message.findOne({
        request: req.params.requestId,
        isRequesterMessage: true
      });
      
      if (requesterMessage) {
        timeLeft = Math.max(0, requesterMessage.expiresAt - Date.now());
      }
    }

    res.status(200).json({ 
      status: 'success', 
      data: { 
        messages,
        request,
        timeLeft,
        isRequester: req.user.role === 'A'
      } 
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
});

module.exports = router;