const cron = require('node-cron');
const Message = require('../models/Message');
const { sendReminderEmail } = require('../utils/emailService');

const initScheduler = () => {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      const pendingMessages = await Message.find({
        isRequesterMessage: true,
        expiresAt: { $gt: new Date() }, // Not expired yet
        lastReminderSent: { 
          $lt: new Date(Date.now() - 5 * 60 * 1000) // Not reminded in last 5 mins
        }
      })
      .populate('sender', 'name email')
      .populate('receiver', 'email');

      for (const message of pendingMessages) {
        const success = await sendReminderEmail(message);
        if (success) {
          message.lastReminderSent = new Date();
          message.reminderCount += 1;
          await message.save();
        }
      }
    } catch (error) {
      console.error('Scheduler error:', error);
    }
  });
};

module.exports = initScheduler;