const sendMessage = require("../api/send-message");
const { hkeys, set, get, hset, del, hget } = require("../redis/redis");
const Reminder = require("../model/reminder");
const Constants = require("../utils/constants");
const Utils = require("../utils/utils")
const CronManager = require("../cron/cron-manager");
// const Action = require("../loop/action");

var keyHsetReminderObj;
var keySetCtxRequest;
var keySetReminderObj;

// Processes messages matching /edit
module.exports = async (message, ctx) => {
  try {
    const chatId = message.chat.id;

    keySetCtxRequest = Constants.replaceOne(
      Constants.KEY_SET_CTX_REQUEST,
      chatId
    );

    keySetReminderObj = Constants.replaceOne(
      Constants.KEY_SET_REMINDER_OBJ,
      chatId
    );

    keyHsetReminderObj = Constants.replaceOne(
      Constants.KEY_HSET_REMINDER_OBJ,
      chatId
    );

    // Get all existing reminders
    const reminderKeys = await hkeys(keyHsetReminderObj);

    /** STEP 1 */
    if (ctx.request === Constants.COMMAND_EDIT) {
      if (reminderKeys) {
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
          text: `Which ⏰ reminder would you like to edit?${reminderPrint}`,
        });

        // Set state
        await set(keySetCtxRequest, Constants.STATE_REMINDER_EDIT_SELECT);
      } else {
        await sendMessage({
          chat_id: chatId,
          text: `You do not have any reminder yet. Use ${Constants.COMMAND_NEW} to add one.`,
        });
      }
    }

    /** STEP 2 */
    if (ctx.request === Constants.STATE_REMINDER_EDIT_SELECT) {
      // Get key by index
      const reminderKey = reminderKeys[message.text - 1];
      const reminder = Object.setPrototypeOf(
        JSON.parse(await hget(keyHsetReminderObj, reminderKey)),
        Reminder.prototype
      );

      await sendMessage({
        chat_id: chatId,
        text: `Enter a new content remind for ${reminder.getName()}:`,
      });

      // Set state
      await set(keySetCtxRequest, Constants.STATE_REMINDER_EDIT_NAME);

      // Save key of current reminder
      await set(keySetReminderObj, reminderKey);
    }

    /** STEP 3 */
    if (ctx.request === Constants.STATE_REMINDER_EDIT_NAME) {
      await sendMessage({
        chat_id: chatId,
        text: `The new content remind is: ${message.text}`,
      });

      // Get reminder edit key
      const reminderKey = await get(keySetReminderObj);

      // Get reminder from hashset and update name
      const reminder = Object.setPrototypeOf(
        JSON.parse(await hget(keyHsetReminderObj, reminderKey)),
        Reminder.prototype
      );
      reminder.setName(message.text);
      await hset(keyHsetReminderObj, reminderKey, JSON.stringify(reminder));

      // Ask for the interval
      await sendMessage({
        chat_id: chatId,
        parse_mode: "html",
        text:
          `Select the new reminder 📆 schedule:\n` +
          Constants.CONTENT_REMINDER_SCHEDULE,
      });

      // Set state
      await set(keySetCtxRequest, Constants.STATE_REMINDER_EDIT_SCHEDULE);
    }

    /** STEP 4 */
    if (ctx.request === Constants.STATE_REMINDER_EDIT_SCHEDULE) {
      await sendMessage({
        chat_id: chatId,
        text: `The new schedule is: ${message.text}`,
      });

      // Get reminder edit key
      const reminderKey = await get(keySetReminderObj);

      // Get reminder from hashset and update schedule
      const reminder = Object.setPrototypeOf(
        JSON.parse(await hget(keyHsetReminderObj, reminderKey)),
        Reminder.prototype
      );
      reminder.setSchedule(message.text);
      reminder.setScheduleStandard(Utils.generate_str_by_time(reminder.getSchedule()));

      // console.log(JSON.stringify(reminder))

      await hset(keyHsetReminderObj, reminderKey, JSON.stringify(reminder));

      await sendMessage({
        chat_id: chatId,
        text: "Your reminder has been ✅ updated!",
      });

      // Del reminder edit
      await del(keySetReminderObj);

      // Delete request state
      await del(keySetCtxRequest);

      // Active cron localhost
      await CronManager.startCronJob(chatId, reminder);

      // Using time interval
      // await Action.actionReminder(Constants.DB_ACTION.EDIT, reminder);
    }
  } catch (e) {
    console.error(e);

    keyHsetReminderObj = null;

    if (keySetReminderObj) {
      await del(keySetReminderObj);
    }

    if (keySetCtxRequest) {
      await del(keySetCtxRequest);
    }
  }
};
