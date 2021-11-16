require('dotenv').config();
const Telegraf = require('telegraf');
const joe = require('./controllers/traderjoe');

const bot = new Telegraf.Telegraf(process.env.BOT_TOKEN);

let plsStop = false;

bot.command('/stopjoe', async (ctx) => {
    console.log('Stopping joe');
    plsStop = true;
    await bot.telegram.sendMessage(ctx.chat.id, 'Stopping Joe', {});
});

bot.command('/tradingjoe', async (ctx) => {
    plsStop = false;
    var timer = setInterval(async () => {
        if (plsStop) {
            clearInterval(timer);
        }
        console.log('Running');
        let arr = [];
        try {
            arr = await joe(['0.25', '0.3', '0.35', '0.4'], 'wsOHM', 'MIM');
            let len = arr.length;
            let i = 0;
            let message = '';
            while (i < len) {
                message += `<b>${arr[i++]} OHM:</b>\nBuy Price: ${
                    arr[i++]
                }\nSell Price: ${arr[i++]}\n\n`;
            }
            await bot.telegram.sendMessage(ctx.chat.id, message, {
                parse_mode: 'HTML',
            });
        } catch (error) {
            awaitbot.telegram.sendMessage(ctx.chat.id, "Error in getting data", {});
        }
    }, 30000);
});

module.exports = bot;
