const cron = require("cron");
const sendMessage = require("../api/send-message");

var MAP_JOBS = new Map();

async function jobStart (chatId, id, cronTime, content) {
  
  // Check exist job
  var job = MAP_JOBS.get(chatId + id);
  if (job) {
    console.log(`Stop job ${chatId + id} before create new job`);
    job.stop();
  }

  // New job
  job = new cron.CronJob({
    cronTime: cronTime,
    onTick: function () {
      console.log(content);

      sendMessage({
        chat_id: chatId,
        text: `Reminder: ${content}`,
      });
    },
    start: true,
    timeZone: "Asia/Ho_Chi_Minh",
  });

  job.start();

  // Finished save to map
  MAP_JOBS.set(chatId + id, job);

  // console.log(MAP_JOBS);
};

async function jobStop (chatId, id) {
  // Check exist job
  var job = MAP_JOBS.get(chatId + id);
  if (job) {
    console.log(`Stop job ${chatId + id} because delete schedule`);
    job.stop();
  }
}

module.exports.jobStart = jobStart
module.exports.jobStop = jobStop