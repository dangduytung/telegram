const sendMessage = require("../api/send-message");
const { hkeys, hget } = require("../redis/redis");
const Reminder = require("../model/reminder");
const Utils = require("../utils/utils");
const Constants = require("../utils/constants");

var $chatId;
var $ARR_DATA = [];
var $timeZoneOffsetGMT7 = 0;

async function init(message) {
  let currentDate = new Date();
  
  $timeZoneOffsetGMT7 = currentDate.getTimezoneOffset() / 60 + 7;

  console.log(`currentDate : ${currentDate}, ${currentDate.getTimezoneOffset()}, $timeZoneOffsetGMT7 : ${$timeZoneOffsetGMT7} `);

  $ARR_DATA = [];

  $chatId = message.chat.id;
  console.log(`$chatId : ${$chatId}`)

  const keyHsetReminderObj = Constants.replaceOne(
    Constants.KEY_HSET_REMINDER_OBJ,
    $chatId
  );

  // Get all existing reminders
  const reminderKeys = await hkeys(keyHsetReminderObj);

  // console.log("reminderKeys : " + JSON.stringify(reminderKeys));

  if (reminderKeys.length >= 1) {
    await Promise.all(
      reminderKeys.map(async (key) => {
        // console.log("key : " + key);

        // Get details of reminder
        const reminder = Object.setPrototypeOf(
          JSON.parse(await hget(keyHsetReminderObj, key)),
          Reminder.prototype
        );

        // console.log(JSON.stringify(reminder))
        if (reminder) {
          $ARR_DATA.push(reminder);
        }
      })
    );

    console.log(`$ARR_DATA : ${JSON.stringify($ARR_DATA)}`);

    // await sendMessage({
    //   chat_id: chatId,
    //   parse_mode: "html",
    //   text: `Active cron ok!`,
    // });
  } else {
    // await sendMessage({
    //   chat_id: chatId,
    //   text: `You do not have any reminder yet. Use ${Constants.COMMAND_NEW} to add one.`,
    // });
  }
}

async function actionReminder(action, reminder) {
  console.log(`action ${action}, reminder : ${JSON.stringify(reminder)}`);

  switch (action) {
    case Constants.DB_ACTION.NEW:
      $ARR_DATA.push(reminder);
      break;

    case Constants.DB_ACTION.EDIT:
      let oldReminder = $ARR_DATA.find(function (item) {
        return item.getId() === reminder.getId();
      });

      /** Update reminder */
      if (oldReminder != null) {
        oldReminder.setName(reminder.getName());
        oldReminder.setSchedule(reminder.getSchedule());
        oldReminder.setScheduleStandard(reminder.getScheduleStandard());
      }

      break;

    case Constants.DB_ACTION.DELETE:
      $ARR_DATA = $ARR_DATA.filter(function (item) {
        return item.getId() != reminder.getId();
      });

      break;

    default:
      break;
  }
}

async function loop() {
  let currentDate = new Date();

  let timeArr = Utils.parse_date_to_str(new Date(currentDate.getTime() + $timeZoneOffsetGMT7 * 60 * 60 * 1000));

  console.log(`time_month ${timeArr[0]}`);
  // console.log(`time_day ${timeArr[1]}`);
  // console.log(`time_hour ${timeArr[2]}`);

  $ARR_DATA.map(async (item) => {
    let standardFormat = item.getScheduleStandard();
    // console.log(`standardFormat ${standardFormat}`);
    if (
      standardFormat &&
      (standardFormat === timeArr[0] ||
        standardFormat === timeArr[1] ||
        standardFormat === timeArr[2])
    ) {
      console.log(`Matching time ${standardFormat}, $chatId ${$chatId}, reminder: ${item.getName()}`);

      await sendMessage({
        chat_id: $chatId,
        text: `Reminder: ${item.getName()}`,
      });
    }
  });
}

module.exports.init = init;
module.exports.actionReminder = actionReminder;
module.exports.loop = loop;
