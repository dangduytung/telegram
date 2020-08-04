const sendMessage = require("../api/send-message");
const { hkeys, set, hdel, del, hget } = require("../redis/redis");
const Reminder = require("../model/reminder");
const Constants = require("../utils/constants");
const CronManager = require("../cron/cron-manager");    //localhost
// const Action = require("../loop/action");

var keyHsetReminderObj;
var keySetCtxRequest;

// Processes messages matching /delete
module.exports = async (message, ctx) => {
  try {
    const chatId = message.chat.id;

    keySetCtxRequest = Constants.replaceOne(
      Constants.KEY_SET_CTX_REQUEST,
      chatId
    );
    keyHsetReminderObj = Constants.replaceOne(
      Constants.KEY_HSET_REMINDER_OBJ,
      chatId
    );

    // Get all existing reminders
    const reminderKeys = await hkeys(keyHsetReminderObj);

    /** STEP 1 */
    if (ctx.request === Constants.COMMAND_DELETE) {
      if (reminderKeys.length >= 1) {
        // Create printable list for reminder set
        const reminderPrint = await Promise.all(
          reminderKeys.map(async (key) => {
            // Get details of reminder
            const reminder = Object.setPrototypeOf(
              JSON.parse(await hget(keyHsetReminderObj, key)),
              Reminder.prototype
            );

            // Return printable list entry
            return `\n${
              reminderKeys.indexOf(key) + 1
            }) ${reminder.getName()} (${reminder.getSchedule()})`;
          })
        );

        await sendMessage({
          chat_id: chatId,
          text: `Which ⏰ reminder would you like to delete?${reminderPrint}`,
        });

        // Set state
        set(keySetCtxRequest, Constants.STATE_REMINDER_DELETE_SELECT);
      } else {
        await sendMessage({
          chat_id: chatId,
          text: `You do not have any reminder yet. Use ${Constants.COMMAND_NEW} to add one.`,
        });
      }
    }

    /** STEP 2 */
    if (ctx.request === Constants.STATE_REMINDER_DELETE_SELECT) {
      await sendMessage({
        chat_id: chatId,
        text: `You haven chosen reminder number ${message.text} to be deleted.`,
      });

      // Get key by index
      const reminderKey = reminderKeys[message.text - 1];
      const reminder = Object.setPrototypeOf(
        JSON.parse(await hget(keyHsetReminderObj, reminderKey)),
        Reminder.prototype
      );

      // Delete field in hashset
      const deleted = await hdel(keyHsetReminderObj, reminderKey);

      if (deleted === 1) {
        await CronManager.stopCronJob(chatId, reminder);       //localhost

        // Using time interval
        // await Action.actionReminder(Constants.DB_ACTION.DELETE, reminder);

        await sendMessage({
          chat_id: chatId,
          text: `Reminder ${reminder.getName()} has been deleted.`,
        });
      } else {
        await sendMessage({
          chat_id: chatId,
          text: "Nothing has been deleted.",
        });
      }

      // Delete request state
      await del(keySetCtxRequest);
    }
  } catch (e) {
    console.log(e);

    keyHsetReminderObj = null;

    if (keySetCtxRequest) {
      await del(keySetCtxRequest);
    }
  }
};
