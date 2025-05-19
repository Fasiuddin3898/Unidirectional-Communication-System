const Message = require('../models/Message');
const Request = require('../models/Request');
const User = require('../models/User');
const createError = require('http-errors');
const nodemailer = require('nodemailer');
const { EMAIL_USERNAME, EMAIL_PASSWORD, FRONTEND_URL } = require('../config');

// Create transporter for emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD
  }
});

// Replace the existing sendMessage with this new createMessage function
exports.createMessage = async (req, res, next) => {
  try {
    const request = await Request.findById(req.body.requestId);
    
    if (!request) {
      return res.status(404).json({
        status: 'fail',
        message: 'Request not found'
      });
    }

    // Check permissions
    if (req.user.role === 'A' && !request.requester.equals(req.user._id)) {
      return res.status(403).json({
        status: 'fail',
        message: 'Not authorized'
      });
    }

    if (req.user.role === 'B' && !request.responder.equals(req.user._id)) {
      return res.status(403).json({
        status: 'fail',
        message: 'Not authorized'
      });
    }

    // For Type A messages, set expiration
    let expiresAt = null;
    if (req.user.role === 'A') {
      expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    }

    const message = await Message.create({
      request: request._id,
      sender: req.user._id,
      content: req.body.content,
      isRequesterMessage: req.user.role === 'A',
      expiresAt
    });

    // Schedule reminder emails if this is a Type A message
    if (req.user.role === 'A') {
      scheduleReminders(request._id, message._id, request.responder);
    }

    // Populate sender info for response
    await message.populate('sender');

    res.status(201).json({
      status: 'success',
      data: {
        message
      }
    });
  } catch (err) {
    next(err);
  }
};

// Example controller code (backend)
exports.getMessages = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.requestId)
      .populate('requester responder');
    
    if (!request) {
      return res.status(404).json({
        status: 'fail',
        message: 'Request not found'
      });
    }

    // Check if user is part of this request
    if (req.user.role === 'A' && !request.requester.equals(req.user._id)) {
      return res.status(403).json({
        status: 'fail',
        message: 'Not authorized'
      });
    }

    if (req.user.role === 'B' && !request.responder.equals(req.user._id)) {
      return res.status(403).json({
        status: 'fail',
        message: 'Not authorized'
      });
    }

    // Get ALL messages for this request (frontend will handle filtering)
    const messages = await Message.find({ request: request._id })
      .populate('sender')
      .sort('createdAt');

    // Calculate time left based on the latest requester message
    let timeLeft = null;
    if (req.user.role === 'B' && request.status === 'accepted') {
      const latestRequesterMessage = await Message.findOne({
        request: request._id,
        isRequesterMessage: true
      }).sort('-createdAt');

      if (latestRequesterMessage && latestRequesterMessage.expiresAt) {
        timeLeft = latestRequesterMessage.expiresAt - Date.now();
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        messages,
        request,
        isRequester: req.user.role === 'A',
        timeLeft: timeLeft > 0 ? timeLeft : 0
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.respondToMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    
    // Find the latest message from Type A user in this request
    const lastMessage = await Message.findOne({
      request: req.params.id,
      isRequesterMessage: true // Only look for requester messages
    }).sort('-createdAt');
    
    if (!lastMessage) {
      throw createError(404, 'No message found to respond to');
    }
    
    // Check if response is within 1 hour of message expiration
    if (lastMessage.expiresAt < new Date()) {
      throw createError(400, 'Response time expired');
    }
    
    // Create response message
    const response = await Message.create({
      request: req.params.id,
      sender: req.user._id,
      content,
      isRequesterMessage: false
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        message: response
      }
    });
  } catch (err) {
    next(err);
  }
};

// Helper function to schedule reminder emails
function scheduleReminders(requestId, messageId, responderId) {
  const reminderInterval = setInterval(async () => {
    try {
      // Check if message still exists and hasn't been responded to
      const messageExists = await Message.exists({ _id: messageId });
      if (!messageExists) {
        clearInterval(reminderInterval);
        return;
      }
      
      // Check if response has been sent
      const responseExists = await Message.exists({ 
        request: requestId,
        sender: responderId,
        createdAt: { $gt: new Date(Date.now() - 60 * 60 * 1000) }
      });
      
      if (responseExists) {
        clearInterval(reminderInterval);
        return;
      }
      
      // Get responder details
      const responder = await User.findById(responderId);
      const requester = await User.findOne({ 
        _id: (await Request.findById(requestId)).requester 
      });
      
      // Send reminder email
      await transporter.sendMail({
        from: `UniComm System <${EMAIL_USERNAME}>`,
        to: responder.email,
        subject: 'Reminder: You have a pending message to respond to',
        html: `
          <p>Hello ${responder.name},</p>
          <p>You have received a message from ${requester.name} that requires your response.</p>
          <p>Please respond within the next hour to keep the communication active.</p>
          <p><a href="${FRONTEND_URL}/messages/${requestId}">Click here to respond</a></p>
          <p>Thank you,</p>
          <p>UniComm Team</p>
        `
      });
      
      console.log(`Reminder sent to ${responder.email}`);
    } catch (err) {
      console.error('Error sending reminder:', err);
    }
  }, 5 * 60 * 1000); // Every 5 minutes
}