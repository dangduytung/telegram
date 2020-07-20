### Telegram chatbot vs ngrok 
Receive message localhost

### Install dependencies
```
$ npm i dotenv express axios body-parser --save;
```

### Bot
`Set up chat bot`
`Save Telegram token to .env`

### Ngrok
Windows :<br> 
Go to `https://ngrok.com` > download `ngrok.zip`
```
1. Unzip to install
2. Connect your account         # Double click ngrok.exe
    $ ngrok authtoken XXXX
3. Fire it up                   # https://ngrok.com/docs
    $ ngrok http 80             # Will see Forwarding from ngrok.io to localhost
4. [http://localhost:4040/inspect/http](http://localhost:4040/inspect/http)       # Admin all requests to ngrok
```

### Telegram > Ngrok
Use API setWebhook ([https://core.telegram.org/bots/api#setwebhook](https://core.telegram.org/bots/api#setwebhook)) to forward message from Chatbot to ngrok
`https://api.telegram.org/bot{TOKEN}/setWebhook?url=https://{id}.ngrok.io`<br>
Check set Webhook completed:<br>
`https://api.telegram.org/bot{TOKEN}/getWebhookInfo`

Finished forwarding Telegram > Ngrok > Localhost

### Test
```
$ node index.js                 # Chat 'hello bot'
```