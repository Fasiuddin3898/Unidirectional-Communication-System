const express = require('express');
const Request = require('../models/Request');
const User = require('../models/User');
const { protect } = require('../controllers/auth');
const router = express.Router();

// Create requests for ALL responders (Type A only)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'A') {
      return res.status(403).json({ status: 'fail', message: 'Only requesters can create requests' });
    }

    // Delete any existing pending requests from this requester
    await Request.deleteMany({
      requester: req.user.id,
      status: 'pending'
    });

    // Create new requests for all responders
    const responders = await User.find({ role: 'B' });
    const requests = await Promise.all(
      responders.map(responder => 
        Request.create({
          requester: req.user.id,
          responder: responder._id,
          status: 'pending'
        })
      )
    );

    res.status(201).json({ status: 'success', data: { requests } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
});

// Get requests for current user
router.get('/my-requests', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'A') {
      query.requester = req.user.id;
    } else {
      query.responder = req.user.id;
    }
    
    const requests = await Request.find(query)
      .populate('requester responder', 'name email role')
      .sort('-createdAt');

    res.status(200).json({ status: 'success', data: { requests } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
});

// Accept request (Type B only)
router.patch('/:id/accept', protect, async (req, res) => {
  try {
    if (req.user.role !== 'B') {
      return res.status(403).json({ status: 'fail', message: 'Only responders can accept requests' });
    }

    const request = await Request.findOneAndUpdate(
      { 
        _id: req.params.id, 
        responder: req.user.id, 
        status: 'pending' 
      },
      { 
        status: 'accepted',
        acceptedAt: Date.now(),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
      },
      { new: true }
    ).populate('requester', 'name email');

    if (!request) {
      return res.status(404).json({ status: 'fail', message: 'Request not found or already processed' });
    }

    res.status(200).json({ status: 'success', data: { request } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
});

// Reject request (Type B only)
router.patch('/:id/reject', protect, async (req, res) => {
  try {
    if (req.user.role !== 'B') {
      return res.status(403).json({ status: 'fail', message: 'Only responders can reject requests' });
    }

    const request = await Request.findOneAndUpdate(
      { 
        _id: req.params.id, 
        responder: req.user.id, 
        status: 'pending' 
      },
      { status: 'rejected' },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ status: 'fail', message: 'Request not found or already processed' });
    }

    res.status(200).json({ status: 'success', data: { request } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
});

module.exports = router;