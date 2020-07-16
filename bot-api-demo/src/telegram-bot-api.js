require("dotenv").config();
const TG = require("telegram-bot-api");

const api = new TG({
  token: process.env.TELEGRAM_API_TOKEN,
});

api.getMe().then(console.log).catch(console.err);


// Define your message provider
const mp = new TG.GetUpdateMessageProvider()

// Set message provider and start API
api.setMessageProvider(mp)
api.start()
.then(() => {
    console.log('API is started')
})
.catch(console.err)

// Receive messages via event callback
api.on('update', update => {

    // update object is defined at
    // https://core.telegram.org/bots/api#update
    // console.log(update);

    let chat_id = update.message.chat.id;
    // console.log('chat_id : ' + chat_id);
    let text = update.message.text;
    text = 'telegram-bot-api received : ' + text;
    
    api.sendMessage({
        chat_id : chat_id,
        text : text
    })
})

