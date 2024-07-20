require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Telegraf, Markup } = require('telegraf');

let allowedUsernames = [];
try {
    allowedUsernames = JSON.parse(fs.readFileSync('./allowed-users.json', 'utf8'));
} catch (error) {
    console.error('Error reading allowed-users.json:', error);
}

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use((ctx, next) => {
    const username = ctx.from.username;
    if (allowedUsernames.includes(username)) {
        return next(); 
    } else {
        ctx.reply('Sorry, you are not authorized to use this bot.');
        return;
    }
});

bot.start((ctx) => {
    ctx.reply('Did you forget ?', Markup.keyboard([
        ['I forgot !']
    ]).resize());
});

bot.hears('I forgot !', (ctx) => {
    const photoPath = path.join(__dirname, `photos/${getRandomInt(1, 16)}.jpg`);
    ctx.replyWithPhoto({ source: photoPath }, {caption: 'I love you !!! ❤️'})
});

bot.hears('I miss you', (ctx) => {
    ctx.reply('I miss you too, my beautiful love ❤️')
});


if (process.env.NODE_ENV === 'production') {
    bot.launch({
        webhook: {
            domain: process.env.HEROKU_APP_URL,
            port: process.env.PORT
        }
    });
} else {
    bot.launch();
}

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}