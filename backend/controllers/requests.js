const Request = require('../models/Request');
const User = require('../models/User');
const createError = require('http-errors');

exports.createRequest = async (req, res, next) => {
  try {
    // Get all Type B users
    const responders = await User.find({ role: 'B' });
    
    if (responders.length === 0) {
      throw createError(404, 'No responders found');
    }
    
    // Create requests for all responders
    const requests = responders.map(responder => ({
      requester: req.user._id,
      responder: responder._id
    }));
    
    await Request.insertMany(requests);
    
    res.status(201).json({
      status: 'success',
      message: 'Requests sent to all responders'
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyRequests = async (req, res, next) => {
  try {
    let requests;
    if (req.user.role === 'A') {
      requests = await Request.find({ requester: req.user._id }).populate('responder', 'name email');
    } else {
      requests = await Request.find({ responder: req.user._id }).populate('requester', 'name email');
    }
    
    res.status(200).json({
      status: 'success',
      results: requests.length,
      data: {
        requests
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.acceptRequest = async (req, res, next) => {
  try {
    const request = await Request.findOneAndUpdate(
      { 
        _id: req.params.id, 
        responder: req.user._id,
        status: 'pending'
      },
      { status: 'accepted' },
      { new: true }
    );
    
    if (!request) {
      throw createError(404, 'Request not found or already processed');
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        request
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.rejectRequest = async (req, res, next) => {
  try {
    const request = await Request.findOneAndUpdate(
      { 
        _id: req.params.id, 
        responder: req.user._id,
        status: 'pending'
      },
      { status: 'rejected' },
      { new: true }
    );
    
    if (!request) {
      throw createError(404, 'Request not found or already processed');
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        request
      }
    });
  } catch (err) {
    next(err);
  }
};