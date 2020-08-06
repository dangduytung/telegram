// Load env config
require('dotenv').config()

/** Localhost */
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 3001;

// Import modules
const Constants = require('./utils/constants')
const { get } = require('./redis/redis')

const init = require('./init')
const sendMessage = require('./api/send-message')
const start = require('./command/start')
const newReminder = require('./command/new-reminder')
const listReminders = require('./command/list-reminders')
const deleteReminder = require('./command/delete-reminder')
const editReminder = require('./command/edit-reminder')
const about = require('./command/about.js')

// const Action = require('./loop/action')

/** Match command regex expression */
const COMMAND_LIST_REGEX = Constants.COMMAND_LIST + Constants.REGEX_ALL;
const COMMAND_NEW_REGEX = Constants.COMMAND_NEW + Constants.REGEX_ALL;
const COMMAND_EDIT_REGEX = Constants.COMMAND_EDIT + Constants.REGEX_ALL;
const COMMAND_DELETE_REGEX = Constants.COMMAND_DELETE + Constants.REGEX_ALL;
const COMMAND_START_REGEX = Constants.COMMAND_START + Constants.REGEX_ALL;
const COMMAND_ABOUT_REGEX = Constants.COMMAND_ABOUT + Constants.REGEX_ALL;

// Configurations
app.use(bodyParser.json());

// Init if have keys on redis (case reboot app)
init();

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to reminder bot demo");
});

app.get("/test", (req, res) => {
  res.send("Test ok");
});

app.post("/post", (req, res) => {
  res.send("Post ok");
});

app.post('/', async (req, res) => {
// module.exports = async (req, res) => {
  // console.log('BODY', req.body)
  if (req.body.message) {
    console.log('input : ' + req.body.message.text)
  }
  if (req.body.callback_query) {
    console.log('callback_query : ' + JSON.stringify(req.body.callback_query))
  }

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

    const keyRequest = Constants.replaceOne(Constants.KEY_SET_CTX_REQUEST, message.chat.id);

    // Build context
    const ctx = {
      request: await get(keyRequest)
      // request : null
    }

    // Request is either current state if set or message text
    ctx.request = ctx.request || message.text

    // Match text request
    if (ctx.request.match(COMMAND_START_REGEX)) {
      await start(message, ctx)
    }

    if (ctx.request.match(COMMAND_NEW_REGEX)) {
      await newReminder(message, ctx)
    }

    if (ctx.request.match(COMMAND_DELETE_REGEX)) {
      await deleteReminder(message, ctx)
    }

    if (ctx.request.match(COMMAND_EDIT_REGEX)) {
      await editReminder(message, ctx)
    }

    if (ctx.request.match(COMMAND_LIST_REGEX)) {
      await listReminders(message, ctx)
    }

    if (ctx.request.match(COMMAND_ABOUT_REGEX)) {
      await about(message, ctx)
    }
  }

  // Send default message
  res.end('This is the ReminderBot Telegram.')
});

// Listening
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});