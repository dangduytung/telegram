const sendMessage = require("../api/send-message");
const { hkeys, hget } = require("../redis/redis");
const Reminder = require("../model/reminder");
const Utils = require("../utils/utils");
const Constants = require("../utils/constants");

var keyHsetReminderObj;

// Processes messages matching /list
module.exports = async (message) => {
  try {
    const chatId = message.chat.id;

    keyHsetReminderObj = Constants.replaceOne(
      Constants.KEY_HSET_REMINDER_OBJ,
      chatId
    );

    // Get all existing reminders
    const reminderKeys = await hkeys(keyHsetReminderObj);

    // console.log("reminderKeys : " + JSON.stringify(reminderKeys));

    if (reminderKeys.length >= 1) {
      // Create printable list for reminder set
      const reminderPrint = await Promise.all(
        reminderKeys.map(async (key) => {
          // console.log("key : " + key);

          // Get details of reminder
          const reminder = Object.setPrototypeOf(
            JSON.parse(await hget(keyHsetReminderObj, key)),
            Reminder.prototype
          );

          console.log(JSON.stringify(reminder));

          // Parse time to cron expression
          let cronTime = Utils.generate_cron_by_time(reminder.getSchedule());

          // Return printable list entry
          return `\n${
            reminderKeys.indexOf(key) + 1
          }) ${reminder.getName()} (${reminder.getSchedule()} ~ cron : <b>${cronTime}</b>)`;
        })
      );

      await sendMessage({
        chat_id: chatId,
        parse_mode: "html",
        text: `Here are your registered reminders:${reminderPrint}`,
      });
    } else {
      await sendMessage({
        chat_id: chatId,
        text: `You do not have any reminder yet. Use ${Constants.COMMAND_NEW} to add one.`,
      });
    }
  } catch (e) {
    console.error(e);
    keyHsetReminderObj = null;
  }
};
