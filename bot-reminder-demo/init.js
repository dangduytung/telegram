const { keys, hkeys, hget } = require("./redis/redis");
const Constants = require("./utils/constants");
const Reminder = require("./model/reminder");
const CronManager = require("./cron/cron-manager");

const INIT = 'init'
module.exports = async () => {
  try {
    let reminder = null;
    let allKeys = await keys("*");
    console.log(allKeys);

    let keyCheck = Constants.replaceOne(Constants.KEY_HSET_REMINDER_OBJ, "");

    allKeys.map(async (keyHsetReminderObj) => {
      if (keyHsetReminderObj.indexOf(keyCheck) > -1) {
        // console.log(keyHsetReminderObj);
        let chatId = keyHsetReminderObj.substring(
          0,
          keyHsetReminderObj.length - keyCheck.length
        );
        // console.log(chatId);
        const reminderKeys = await hkeys(keyHsetReminderObj);

        if (reminderKeys.length >= 1) {
          reminderKeys.map(async (key) => {
            reminder = Object.setPrototypeOf(
              JSON.parse(await hget(keyHsetReminderObj, key)),
              Reminder.prototype
            );
            console.log(INIT + ' ' + JSON.stringify(reminder));

            // Start cron job
            CronManager.startCronJob(chatId, reminder);
          });
        }
      }
    });
  } catch (e) {
    console.error(e);
  }
};
