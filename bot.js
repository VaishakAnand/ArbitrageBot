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

    while (!plsStop) {
        console.log('Running');
        try {
            let arr = await joe(['0.25', '0.3', '0.35', '0.4'], 'wsOHM', 'MIM');
            let len = arr.length;
            let i = 0;
            let message = '';
            while (i < len) {
                message += `<b>${arr[i++]} OHM:</b>\nBuy Price: ${
                    arr[i++]
                }\nSell Price: ${arr[i++]}\n\n`;
            }
            await bot.telegram
                .sendMessage(ctx.chat.id, message, {
                    parse_mode: 'HTML',
                })
                .catch((err) => console.error(err));
        } catch (error) {
            await bot.telegram
                .sendMessage(ctx.chat.id, `Error in getting data: ${error}`, {})
                .catch((err) => console.error(err));
        }
    }

    await bot.telegram
        .sendMessage(ctx.chat.id, `Joe has stopped.`, {})
        .catch((err) => console.error(err));
});

module.exports = bot;
