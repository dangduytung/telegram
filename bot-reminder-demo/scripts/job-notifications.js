const fetch = require('node-fetch')

const jobNotification = async () => {
  const body = {
    token: process.env.TELEGRAM_TOKEN
  }

  await fetch('https://5460ed528602.ngrok.io', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
}

jobNotification()
