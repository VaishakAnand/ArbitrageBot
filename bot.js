require('dotenv').config();
const Telegraf = require('telegraf');
const joe = require('./controllers/traderjoe');

const bot = new Telegraf.Telegraf(process.env.BOT_TOKEN);

let plsStop = false;

bot.command('/stopjoe', async (ctx) => {
    plsStop = true;
});

bot.command('/tradingjoe', async (ctx) => {
    plsStop = false;
    var timer = setInterval(async () => {
        if (plsStop) {
            clearInterval(timer);
        }
        console.log('Running');
        let arr = await joe(['0.25', '0.3', '0.35', '0.4'], 'wsOHM', 'MIM');
        let len = arr.length;
        let i = 0;
        let message = '';
        while (i < len) {
            message += `<b>${arr[i++]} OHM:</b>\nBuy Price: ${
                arr[i++]
            }\nSell Price: ${arr[i++]}\n\n`;
        }
        bot.telegram.sendMessage(ctx.chat.id, message, { parse_mode: 'HTML' });
    }, 30000);
});

module.exports = bot;
