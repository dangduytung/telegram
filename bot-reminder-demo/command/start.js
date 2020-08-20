const sendMessage = require('../api/send-message')

// Processes messages matching /start
module.exports = async (message) => {
  const chatId = message.chat.id

  await sendMessage({
    chat_id: chatId,
    text: '🙋 Hi one, I am ReminderBot. Let me know if I should remind you of something.'
  })
}