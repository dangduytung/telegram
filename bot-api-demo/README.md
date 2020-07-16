### Tutorial Telegram API
Demo some library for Telegram API
```
https://www.npmjs.com/package/node-telegram-bot-api
https://www.npmjs.com/package/telegram-bot-api
```

### Installation
```
npm i --save dotenv
npm i --save node-telegram-bot-api
npm i --save telegram-bot-api
```

### Registering a new bot
Go to t.me/botfather
```
/newbot                                                     # Then enter Bot name and username to receive token
```

### TELEGRAM API
Reference docs : https://core.telegram.org/bots/api<br>
Making request : https://api.telegram.org/bot<token>/METHOD_NAME
```
https://api.telegram.org/bot<token>/getMe
https://api.telegram.org/bot<token>/getUpdates              
```

### Environment Variables
Set token to file .env in root folder                       # TELEGRAM_API_TOKEN=XXXXXXX:YYYYYYYYYYYYYY

### Run
```
npm start or node src/node-telegram-bot-api.js
node src/telegram-bot-api.js
```