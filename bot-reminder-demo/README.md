### ReminderBotDemo
Based on [https://janikvonrotz.ch/2020/01/18/build-a-stateful-serverless-telegram-bot-part-1](https://janikvonrotz.ch/2020/01/18/build-a-stateful-serverless-telegram-bot-part-1), [https://github.com/janikvonrotz/hydrome-bot](https://github.com/janikvonrotz/hydrome-bot)

**Flow of App:**
> Chatbot > Vercel (SSL) > EC2 (non SSL) > Chatbot

* Using Telegram API webhook to forward message from Chatbot to Vercel -> EC2
* Using Redis cloud DB for save schedules
* Using ngrok for test localhost
* Using cron job for notifications

### Amazon EC2
* Using Amazon EC2 Ubuntu free tier for server running **ReminderBot**
* Setup Amazon EC2 by follow [https://hackernoon.com/tutorial-creating-and-managing-a-node-js-server-on-aws-part-1-d67367ac5171](https://hackernoon.com/tutorial-creating-and-managing-a-node-js-server-on-aws-part-1-d67367ac5171)
* Using **Nginx** to route public port `80` forward internal port of Nodejs Application

### Redis
* Use redis cloud trial [https://redislabs.com](https://redislabs.com)
* We have endpoint redis `host:port` and `password`
* Create environment variables in file **.env** is: `REDIS_URI=redis://password@hos:port/0`

Test connection:
```bash
npm install -g redis-cli
rdcli -h your.redis.host -a your.redis.password -p your.redis.port
```

Test commands:
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
ngrok http {port}
```
`It will generate link forward to http://localhost:port and monitoring: http://localhost:4040/inspect/http`

### Telegram API Webhook
Use Postmand to set webhook: Receive message's telegram bot > ngrok > url
```javascript
https://api.telegram.org/bot{TOKEN}/setWebhook?url=XXXXX        # Ngrok localhost (free) is https://{id}.ngrok.io 
```

### Bot commands description
In @BotFather `/setcommands`<br>
Add commands description like below:
> start - Say "Hi" first<br>
> about - Introduce about Reminder Bot<br>
> list - Show list schedule reminders<br>
> new - Create a new schedule reminder<br>
> edit - Edit a schedule reminder<br>
> delete - Delete a schedule reminder<br>

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
pm2 start index.js      # Run on EC2
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

### Log
* Using pm2 [https://www.npmjs.com/package/pm2](https://www.npmjs.com/package/pm2) for logging, monitoring Nodejs app

```bash
tail -f /var/log/nginx/*.log            # Log nginx
pm2 list                                # List all app running on EC2
pm2 monit                               # Log ReminderBot
```