const cron = require('node-cron');
const User = require('../models/userSchema'); // Mongoose model for User
const { getGeminiReminder } = require('../utils/geminiServices'); // custom Gemini API wrapper


const autoPrompt = () => {
  cron.schedule("* * * * *", async () => {
    console.log("⏰ Running autoPrompt cron job every minute...");
    
    try {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // "HH:mm"

      const users = await User.find({ "health.doseSchedule.time": currentTime });

      for (let user of users) {
        const doses = user.health.doseSchedule.filter(d => d.time === currentTime);

        for (let dose of doses) {
          const reminder = await getGeminiReminder(user.name, dose.medicine, dose.dosage);
          console.log(`[Reminder for ${user.name}]: ${reminder}`);
          // TODO: Push via email/notification/socket
        }
      }
    } catch (error) {
      console.error("⛔ Error running autoPrompt cron job:", error);
    }
  });
};

module.exports = autoPrompt;


