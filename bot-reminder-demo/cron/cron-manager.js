const Utils = require('../utils/utils')
const CronJob = require('./cron-job')

async function startCronJob(chatId, reminder) {
    // Parse time to cron expression
    let cronTime = Utils.generate_cron_by_time(reminder.getSchedule());
    
    // console.log(`cronTime ${cronTime}`)

    // Active cron expression
    if (cronTime) CronJob.jobStart(chatId, reminder.getId(), cronTime, reminder.getName())
}

async function stopCronJob(chatId, reminder) {
    CronJob.jobStop(chatId, reminder.getId())
}

module.exports.startCronJob = startCronJob
module.exports.stopCronJob = stopCronJob
