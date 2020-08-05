const sendMessage = require("../api/send-message");
const Action = require("./action");

var currentTimeMonth = null;
var currentTimeDay = null;
var currentTimeHour = null;

module.exports = async (message) => {
  const chatId = message.chat.id;

  setInterval(async () => {
    parseDateToStr(new Date());

    // console.log(`currentTimeMonth ${currentTimeMonth}`)
    // console.log(`currentTimeDay ${currentTimeDay}`)
    // console.log(`currentTimeHour ${currentTimeHour}`)

    if (Action.ARR_TYPE_MONTH.length > 0) {
      Action.ARR_TYPE_MONTH.map((reminder) => {
        if (currentTimeMonth === reminder.getSchedule()) {
          console.log(`Active month ${currentTimeMonth}`);

          sendMessageByLoop(chatId, reminder);
        }
      });
    }

    if (Action.ARR_TYPE_DAY.length > 0) {
      Action.ARR_TYPE_DAY.map((reminder) => {
        if (currentTimeDay === reminder.getSchedule()) {
          console.log(`Active day ${currentTimeDay}`);

          sendMessageByLoop(chatId, reminder);
        }
      });
    }

    console.log(`${JSON.stringify(Action.ARR_TYPE_HOUR)}`)

    if (Action.ARR_TYPE_HOUR.length > 0) {
      Action.ARR_TYPE_HOUR.map((reminder) => {
        console.log(`${currentTimeHour} and ${reminder.getSchedule()}`)
        if (currentTimeHour === reminder.getSchedule()) {
          console.log(`Active hour ${currentTimeHour}`);

          sendMessageByLoop(chatId, reminder);
        }
      });
    }
  }, 1000);
};

async function sendMessageByLoop(chatId, reminder) {
  await sendMessage({
    chat_id: chatId,
    text: `Reminder: ${reminder.getName()}`,
  });
}

function parseDateToStr(date) {
  let dd = addPrefixTime(date.getDate());
  let mm = addPrefixTime(date.getMonth() + 1);
  // let yyyy = date.getFullYear();
  let hh = addPrefixTime(date.getHours());
  let mi = addPrefixTime(date.getMinutes());
  let ss = addPrefixTime(date.getSeconds());

  currentTimeMonth = dd + "." + mm + " " + hh + ":" + mi + ":" + ss;
  currentTimeDay = dd + " " + hh + ":" + mi + ":" + ss;
  currentTimeHour = hh + ":" + mi + ":" + ss;
}

function addPrefixTime(param) {
  return param < 10 ? "0" + param : param;
}
