require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_API_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

/** ----------------------------- */

// Listen for any kind of message. There are different kinds of
// messages.
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // send a message to the chat acknowledging receipt of their message
  // bot.sendMessage(chatId, "Message received : " + text);
});

/** ----------------------------- */

// Listener (handler) for telegram's /bookmark event
bot.onText(/\/bookmark/, (msg, match) => {
  const chatId = msg.chat.id;
  const url = match.input.split(" ")[1];
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  if (url === undefined) {
    bot.sendMessage(chatId, "Please provide URL of article!");
    return;
  }

  bot.sendMessage(chatId, "URL has been successfully saved!");
});

// Normal Keyboard : Listener (handler) for showcasing different keyboard layout
bot.onText(/\/keyboard/, (msg) => {
  bot.sendMessage(msg.chat.id, "Alternative keyboard layout", {
    reply_markup: {
      keyboard: [["Sample text", "Second sample"], ["Keyboard"], ["I'm robot"]],
      resize_keyboard: true,
      one_time_keyboard: true,
      force_reply: true,
    },
  });
});

/** ----------------------------- */

// Inline Keyboard : Listener (handler) for telegram's /label event
bot.onText(/\/label/, (msg, match) => {
  const chatId = msg.chat.id;
  const url = match.input.split(" ")[1];

  if (url === undefined) {
    bot.sendMessage(chatId, "Please provide URL of article!");
    return;
  }

  bot.sendMessage(chatId, "URL has been successfully saved!", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Development",
            callback_data: "development",
          },
          {
            text: "Lifestyle",
            callback_data: "lifestyle",
          },
          {
            text: "Other",
            callback_data: "other",
          },
        ],
      ],
    },
  });
});

// Listener (handler) for callback data from /label command
bot.on("callback_query", (callbackQuery) => {
  const message = callbackQuery.message;
  const category = callbackQuery.data;

  bot.sendMessage(
    message.chat.id,
    `URL has been labeled with category "${category}"`
  );
});

/** ----------------------------- */

// Data Requests : Keyboard layout for requesting phone number access
const requestPhoneKeyboard = {
  reply_markup: {
    one_time_keyboard: true,
    keyboard: [
      [
        {
          text: "My phone number",
          request_contact: true,
          one_time_keyboard: true,
        },
      ],
      ["Cancel"],
    ],
  },
};

// Listener (handler) for retrieving phone number
bot.onText(/\/phone/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Can we get access to your phone number?",
    requestPhoneKeyboard
  );
});

/** ----------------------------- */