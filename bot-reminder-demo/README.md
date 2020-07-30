### ReminderBotDemo
Based on `https://janikvonrotz.ch/2020/01/18/build-a-stateful-serverless-telegram-bot-part-1/`, `https://github.com/janikvonrotz/hydrome-bot`

### Install dependencies
```bash
npm i axios bluebird body-parser cron dotenv express node-fetch redis --save
```

### Redis
Use redis cloud trial [https://redislabs.com](https://redislabs.com)<br>
We have endpoint redis `host:port` and `password` -> Create environment variables in file `.env` is `REDIS_URI=redis://password@hos:port/0`<br>

Test connection :
```bash
npm install -g redis-cli
rdcli -h your.redis.host -a your.redis.password -p your.redis.port
```

Test commands :
```bash
redis> ping                     # Response : PONG
redis> keys *
redis> get {key}
redis> hgetall {hashkey}
```
You can reference redis commands here [https://redis.io/commands](https://redis.io/commands)

### Ngrok (for localhost)
Run ngrok.exe
```bash
ngrok http {port}               # Get link online to forward http://localhost:port and user http://localhost:4040/inspect/http to check
```

### Vercel
* Create file `vercel.json` and `.vercelignore`
* Command environment variables:
```bash
vercel secrets add tungdd_bot_redis_uri ***
vercel secrets add tungdd_bot_telegram_token ***
vercel secrets list             # Check environment variables
vercel secrets rename [old-name] [new-name]
vercel secrets remove [secret-name]
```
* File `vercel.json` has param `env`, `routes`, `builds`
* File `.vercelignore` similar `.gitignore` : Add some files, folders don't need upload to vercel.
```bash
printf ".env\nnode_modules\README.md" >> .vercelignore          # Add content to file `.vercelignore`
```

### Telegram Webhook
Use Postmand to set webhook : receive message's telegram bot > ngrok > localhost
```javascript
https://api.telegram.org/bot{TOKEN}/setWebhook?url=https://{id}.ngrok.io
```

### Bot commands description
In @BotFather `/setcommands`<br>
Add commands description like below:
> start - Say "Hi" first
> about - Introduce about Reminder Bot
> list - Show list schedule reminders
> new - Create a new schedule reminder
> edit - Edit a schedule reminder
> delete - Delete a schedule reminder

### Cron job
[https://www.npmjs.com/package/cron](https://www.npmjs.com/package/cron). CronJob expression is : `* * * * * *`
* Seconds: 0-59
* Minutes: 0-59
* Hours: 0-23
* Day of Month: 1-31
* Months: 0-11 (Jan-Dec)
* Day of Week: 0-6 (Sun-Sat)

### Run
```bash
npm start               # Localhost
```

Command:
```bash
/list
/new
/edit
/delete
/start
/about
```