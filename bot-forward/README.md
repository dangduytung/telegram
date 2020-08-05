### Telegram chatbot forward
Because Telegram chatbot API webhook need `SSL` to forward message. So we can using subdomain Vercel to forward message to EC2

```bash
Chatbot > Vercel > Amazon EC2 (non SSL) > Chatbot
```

### Install dependencies
```bash
npm i --save dotenv body-parser express node-fetch
```

### Environment Variables
* File `.env` for localhost
```js
URL_FORWARD=XXXXX               # Url EC2 Post
```

* File `vercel.json` for Vercel
```json
{
    "version": 2,
    "env": {
      "URL_FORWARD": "@tungdd_bot_url_forward"
    },
    "builds": [{ "src": "index.js", "use": "@now/node-server" }],
    "routes": [
      {
        "src": "/",
        "dest": "/index.js",
        "methods": ["GET"]
      },
      {
        "src": "/test",
        "dest": "/index.js",
        "methods": ["GET"]
      },
      {
        "src": "/",
        "dest": "/index.js",
        "methods": ["POST"]
      }
    ]
}
```

* Add environment variables to Vercel
```bash
vercel secrets add tungdd_bot_url_forward XXXXX         # Add Url EC2 Post
vercel secrets list                                     # Show list
vercel secrets rename [old-name] [new-name]             # Rename
vercel secrets remove [secret-name]                     # Remove
```

### Deploy to Vercel
```bash
vercel --prod
```