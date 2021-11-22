const bot = require('../bot');
const joe = require('../execution/traderjoe');
const getNormalTime = require('../util/datetime');

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
            let message = `Retrieval Time: ${getNormalTime()}\n\n`;
            while (i < len) {
                message += `<b>${arr[i++]} OHM:</b>\nBuy Price: ${
                    arr[i++]
                }\nSell Price: ${arr[i++]}\n\n`;
            }
            bot.telegram
                .sendMessage(ctx.chat.id, message, {
                    parse_mode: 'HTML',
                })
                .catch((err) => console.error(err));
        } catch (error) {
            bot.telegram
                .sendMessage(ctx.chat.id, `Error in getting data: ${error}`, {})
                .catch((err) => console.error(err));
        }
    }

    await bot.telegram
        .sendMessage(ctx.chat.id, `Joe has stopped.`, {})
        .catch((err) => console.error(err));
});
