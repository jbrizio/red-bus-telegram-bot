# red-bus-telegram-bot
Telegram bot created with Node.js that inform the available balance of any card.

![Preview](https://s3.amazonaws.com/red-bus-telegram-bot/telegram-bot.png)

## Table of Contents
- [Installation](#installation)
- [Stack](#stack)
- [Contributing](#contributing)

## Installation
1.  Create your own bot using Telegram's [BotFather](https://core.telegram.org/bots#3-how-do-i-create-a-bot) and grab your token
2.  Clone this repository
3.  Go to the folder using `cd ~/red-bus-telegram-bot`
4.  Run  `npm install`
5.  Set `process.env.BOT_TOKEN` to the value, you've got from the BotFather
6.  Run  `npm start` 
7.  Find your bot created before on Telegram and press the button `/start` to initialize the wizard

**Note:** The endpoint used to connect with the services of Red Bus, was taken from the [Mobile App](https://github.com/ModernizacionMuniCBA/Cuanto-tengo) "Cuanto Tengo". For security reasons, this was set using environment variable.

## Stack
- [Node.js](https://nodejs.org/) - JavaScript runtime environment
- [Telegraf](https://telegraf.js.org/) - Modern Telegram bot framework
- [Request](https://www.npmjs.com/package/request) - Simplified HTTP client

## Contributing
Pull requests are always welcome!
