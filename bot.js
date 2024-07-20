require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const { Telegraf, Markup } = require('telegraf');

const app = express();

let allowedUsernames = [];
try {
    allowedUsernames = JSON.parse(fs.readFileSync('./allowed-users.json', 'utf8'));
} catch (error) {
    console.error('Error reading allowed-users.json:', error);
}

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use((bot, next) => {
    const username = bot.from.username;
    if (allowedUsernames.includes(username)) {
        return next(); 
    } else {
        bot.reply('Sorry, you are not authorized to use this bot.');
        return;
    }
});

bot.start((bot) => {
    bot.reply('Did you forget ?', Markup.keyboard([
        ['I forgot !']
    ]).resize());
});

bot.hears('I forgot !', (bot) => {
    const photoPath = path.join(__dirname, `photos/${getRandomInt(1, 16)}.jpg`);
    bot.replyWithPhoto({ source: photoPath }, {caption: 'I love you !!! ❤️'})
});

bot.hears('I miss you', (bot) => {
    bot.reply('I miss you too, my beautiful love ❤️')
});


bot.launch();

app.use(express.json());


app.post('/webhook', (req, res) => {
    bot.handleUpdate(req.body);
    res.sendStatus(200);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const setWebhook = async () => {
    try {
        const webhookUrl = `https://${process.env.PROJECT_DOMAIN}.glitch.me/webhook`;
        const response = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/setWebhook?url=${webhookUrl}`);
        const result = await response.json();
        console.log('Webhook set:', result);
    } catch (error) {
        console.error('Error setting webhook:', error);
    }
};

setWebhook();


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}