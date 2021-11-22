require('dotenv').config();
const Telegraf = require('telegraf');

const bot = new Telegraf.Telegraf(process.env.BOT_TOKEN);
bot.launch();

module.exports = bot;
