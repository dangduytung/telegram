// Load env config
require('dotenv').config()

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 8080;

// Import modules
const start = require('./start')
const sendMessage = require('./send-message')

// Configurations
app.use(bodyParser.json());

app.post('/', async (req, res) => {
  // console.log('BODY', req.body)
  console.log('text : ' + req.body.message.text)
  console.log('callback_query : ' + req.body.callback_query)

  // Check if Telegram message
  if (req.body && (req.body.message || req.body.callback_query)) {
    
    // Get message object
    var message = {}
    if (req.body.message) {
      message = req.body.message
    }

    // Callback query depends on request
    if (req.body.callback_query) {
      message = req.body.callback_query.message
      message.data = req.body.callback_query.data

      // Answer callback query
      sendMessage({
        callback_query_id: req.body.callback_query.id
      }, 'answerCallbackQuery')
    }

    // Build context
    const ctx = {
      request: null // await get(`request:${message.chat.id}`) -> See part 2
    }

    // Request is either current state if set or message text
    ctx.request = ctx.request || message.text

    // Match text request
    if (ctx.request.match('/start(.*)')) {
      await start(message, ctx)
    }
  }

  // Send default message
  res.end('This is the ExampleBot API.')
});

// Listening
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});