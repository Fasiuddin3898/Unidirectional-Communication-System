const cron = require('node-cron');
const Message = require('../models/Message');
const { sendReminderEmail } = require('../utils/emailService');

// Initialize the scheduler
const initScheduler = () => {
  // Initialize email service first
  require('../utils/emailService').initializeEmailService();

  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      console.log('Running reminder check...');
      
      // Find all active requester messages that haven't expired
      const pendingMessages = await Message.find({
        isRequesterMessage: true,
        expiresAt: { $gt: new Date() }
      })
      .populate('sender', 'email name')
      .populate('receiver', 'email name');

      // Send reminders for each pending message
      for (const message of pendingMessages) {
        // Only send reminder if less than 55 minutes have passed (to avoid last 5 min)
        const timeElapsed = Date.now() - message.createdAt;
        if (timeElapsed < 55 * 60 * 1000) {
          await sendReminderEmail(message);
        }
      }
    } catch (error) {
      console.error('Error in reminder scheduler:', error);
    }
  });

  console.log('Scheduler initialized - running every 5 minutes');
};

module.exports = initScheduler;