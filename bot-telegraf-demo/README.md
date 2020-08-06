## Tutorial article
https://medium.com/@nico26deo/build-a-telegram-bot-quiz-with-node-js-dc9bb8ee78d8

### Localhost
* Create file `.env` with Telegram Bot Token
`BOT_TOKEN = XXXXX:YYYYYYYYYYYYYYYYYYY`

### BotFather
```js
https://t.me/botfather or @BotFather
/newbot
Choose a name bot
Choose a username
Copy token
```

### Install library
```bash
npm init                        # Generate package.json
npm i --save telegraf
npm i --save axios
npm i --save dotenv
```

### Run
```bash
node app.js
```

### /quiz tof
The following endpoints can be utilized:
1. GET: https://quiz.revolut1on.com/api/tof-quiz-list
Returns the requested all of true or false quiz.
2. GET: https://quiz.revolut1on.com/api/tof-quiz-random
Returns the requested one true or false quiz at random.
3. GET: https://quiz.revolut1on.com/api/tof-quiz/{{id-tof-quiz}}
Returns the requested one true or false quiz as per id.
4. GET: https://quiz.revolut1on.com/img/tof/{{image-name}}
Returns the requested image based on the image name, the image name can be checked in response when requesting a quiz.
5. POST: https://quiz.revolut1on.com/api/tof-answer
form: {id_telegram: {{id-telegream}}, answer: {{true or false}}, ‘tofquiz_id’: {{id-tof-quiz}}}
We can send the answer through this endpoint, make sure the id tof quiz is correct.
