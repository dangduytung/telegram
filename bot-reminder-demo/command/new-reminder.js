const uuid = require("uuid");
const sendMessage = require("../api/send-message");
const { set, del, get, hset, incr } = require("../redis/redis");
const Reminder = require("../model/reminder");
const Constants = require("../utils/constants");
const Utils = require("../utils/utils")
const CronManager = require("../cron/cron-manager");
// const Action = require("../loop/action");

var keySetCtxRequest;
var keySetReminderObj;
var keyHsetReminderObj;

// Processes messages matching /new
module.exports = async (message, ctx) => {
  try {
    // Set some ids
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

    console.log(`text : ${message.text}`);
    console.log(`ctx : ${JSON.stringify(ctx)}`);

    /** STEP 1 */
    if (ctx.request === Constants.COMMAND_NEW) {
      // Send message
      await sendMessage({
        chat_id: chatId,
        text: "Content remind:",
      });

      // Set state
      await set(keySetCtxRequest, Constants.STATE_REMINDER_NEW_NAME);
    }

    /** STEP 2 */
    if (ctx.request === Constants.STATE_REMINDER_NEW_NAME) {
      await sendMessage({
        chat_id: chatId,
        text: `Your reminder content is: ${message.text}`,
      });

      // Create new reminder and store content
      const reminder = new Reminder(uuid.v4(), message.text);
      await set(keySetReminderObj, JSON.stringify(reminder));

      // Ask for the interval
      await sendMessage({
        chat_id: chatId,
        parse_mode: "html",
        text: `Schedule reminder ?\n` + Constants.CONTENT_REMINDER_SCHEDULE,
      });

      // Set state
      await set(keySetCtxRequest, Constants.STATE_REMINDER_NEW_SCHEDULE);
    }

    /** STEP 3 */
    if (ctx.request === Constants.STATE_REMINDER_NEW_SCHEDULE) {
      await sendMessage({
        chat_id: chatId,
        text: `You have set time to remind: ${message.text}`,
      });

      // Get reminder edit
      var reminder = Object.setPrototypeOf(
        JSON.parse(await get(keySetReminderObj)),
        Reminder.prototype
      );

      // Set schedule
      reminder.setSchedule(message.text);
      reminder.setScheduleStandard(Utils.generate_str_by_time(reminder.getSchedule()));

      // Generate Id
      const reminderKey = await incr(Constants.KEY_GENERATE_ID);

      // Save reminder
      await hset(keyHsetReminderObj, reminderKey, JSON.stringify(reminder));

      await sendMessage({
        chat_id: chatId,
        text: "Your reminder has been saved!",
      });

      // Del reminder edit
      await del(keySetReminderObj);

      // Delete request state
      await del(keySetCtxRequest);

      // Active cron localhost
      await CronManager.startCronJob(chatId, reminder);

      // Using time interval
      // await Action.actionReminder(Constants.DB_ACTION.NEW, reminder);
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
