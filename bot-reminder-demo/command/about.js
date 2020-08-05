const sendMessage = require('../api/send-message')

// Processes messages matching /about
module.exports = async (message) => {
  const chatId = message.chat.id

  let text = 'ReminderBot is a Telegram bot that reminds you of whatever you scheduled.'
  text += '\nIf you have any feedback submit it to https://github.com/dangduytung/telegram/tree/master/bot-reminder-demo'

  await sendMessage({
    chat_id: chatId,
    text: text
  })
}