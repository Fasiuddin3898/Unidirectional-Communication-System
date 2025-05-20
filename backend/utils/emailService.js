const nodemailer = require('nodemailer');
const EmailConfig = require('../models/EmailConfig');
const User = require('../models/User');

let transporter = null;

const initializeEmailService = async () => {
  try {
    // Get the first email config (you might want to add logic to select specific config)
    const config = await EmailConfig.findOne().sort({ createdAt: -1 });
    
    if (!config) {
      throw new Error('No email configuration found in database');
    }

    transporter = nodemailer.createTransport({
      service: config.service,
      auth: {
        user: config.email,
        pass: config.password
      }
    });

    console.log('Email service initialized with database configuration');
  } catch (error) {
    console.error('Failed to initialize email service:', error);
  }
};

/**
 * Send reminder email to responder
 * @param {Object} message - The Message document with populated sender and receiver
 */
const sendReminderEmail = async (message) => {
  try {
    if (!transporter) {
      await initializeEmailService();
    }

    // Populate sender and receiver if not already populated
    const msg = await Message.findById(message._id)
      .populate('sender', 'email name')
      .populate('receiver', 'email name');

    const mailOptions = {
      from: `"Communication System" <${msg.sender.email}>`,
      to: msg.receiver.email,
      subject: 'Reminder: Pending Response Required',
      text: `You have a pending message from ${msg.sender.name} that requires your response within the next hour.\n\nMessage: ${msg.content}\n\nPlease respond promptly.`,
      html: `<p>You have a pending message from ${msg.sender.name} that requires your response within the next hour.</p>
             <p><strong>Message:</strong> ${msg.content}</p>
             <p>Please respond promptly.</p>`
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${msg.receiver.email}`);
    
    // Update message with reminder info
    msg.lastReminderSent = new Date();
    msg.reminderCount += 1;
    await msg.save();
    
    return true;
  } catch (error) {
    console.error('Error sending reminder email:', error);
    return false;
  }
};

module.exports = { initializeEmailService, sendReminderEmail };