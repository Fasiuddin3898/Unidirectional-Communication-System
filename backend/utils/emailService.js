const nodemailer = require('nodemailer');

// Create transporter using .env credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS // Use app password if 2FA enabled
  }
});

/**
 * Send reminder email to responder
 * @param {Object} message - Message document with populated receiver
 */
const sendReminderEmail = async (message) => {
  try {
    const mailOptions = {
      from: `"Communication System" <${process.env.GMAIL_USER}>`,
      to: message.receiver.email,
      subject: 'Reminder: Pending Response Required',
      text: `You have a pending message from ${message.sender.name}.\n\n` +
            `Message: ${message.content}\n\n` +
            `Please respond within the hour.`,
      html: `<p>You have a pending message from ${message.sender.name}.</p>
             <p><strong>Message:</strong> ${message.content}</p>
             <p>Please respond within the hour.</p>`
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reminder sent to ${message.receiver.email}`);
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

module.exports = { sendReminderEmail };