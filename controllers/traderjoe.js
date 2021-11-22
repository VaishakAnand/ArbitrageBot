const bot = require('../bot');
const joe = require('../execution/traderjoe');
const getNormalTime = require('../util/datetime');

let plsStop = false;
let messageId = null;
let alertLimit = 33500.0;

bot.command('/stopjoe', async (ctx) => {
    console.log('Stopping joe');
    plsStop = true;
    messageId = null;
    await bot.telegram.sendMessage(ctx.chat.id, 'I will stop Joe', {});
});

const sendJoeData = async (ctx) => {
    try {
        if (plsStop) {
            return;
        }

        console.log('Running');
        let arr = await joe(['0.3', '0.35', '0.4'], 'wsOHM', 'MIM');
        let len = arr.length;
        let i = 0;
        let isAlert = false;
        let message = `Retrieval Time: ${getNormalTime()}\n\n`;
        while (i < len) {
            const amountOfOhm = arr[i++];
            const buyPrice = arr[i++];
            const sellPrice = arr[i++];
            if (!isAlert && sellPrice != null) {
                isAlert = parseFloat(sellPrice) > alertLimit;
            }
            message += `<b>${amountOfOhm} OHM:</b>\nBuy Price: ${buyPrice}\nSell Price: ${sellPrice}\n\n`;
        }
        if (isAlert) {
            message = '<b>ALERT</b> @Vforvitagen\n' + message;
        }

        if (messageId == null) {
            await bot.telegram
                .sendMessage(ctx.chat.id, message, {
                    parse_mode: 'HTML',
                })
                .then((messageDetails) => {
                    messageId = messageDetails.message_id;
                })
                .catch((err) => console.error(err));
        } else if (isAlert) {
            await bot.telegram
                .sendMessage(ctx.chat.id, message, {
                    parse_mode: 'HTML',
                })
                .catch((err) => console.error(err));
        } else {
            await bot.telegram
                .editMessageText(ctx.chat.id, messageId, undefined, message, {
                    parse_mode: 'HTML',
                })
                .catch((err) => console.error(err));
        }
    } catch (error) {
        console.error(error);
    }

    var a = setTimeout(() => sendJoeData(ctx), 10000);
};

bot.command('/tradingjoe', async (ctx) => {
    console.log('Received!');
    plsStop = false;
    sendJoeData(ctx);
});

bot.command('/setjoealert', async (ctx) => {
    console.log('Setting alert');
    const args = ctx.update.message.text.split(' ');
    if (args.length != 2) {
        bot.telegram.sendMessage(
            ctx.chat.id,
            'Please input the correct format!\nE.g: /setjoealert 30000',
            {}
        );
    } else {
        alertLimit = parseFloat(args[1]);
    }
});
