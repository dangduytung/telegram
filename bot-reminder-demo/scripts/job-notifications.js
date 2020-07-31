const fetch = require('node-fetch')

const jobNotification = async () => {
  const body = {
    token: process.env.TELEGRAM_TOKEN
  }

  await fetch('https://b0604aa5d3ca.ngrok.io', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
}

jobNotification()
