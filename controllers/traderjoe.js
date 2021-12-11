const bot = require('../bot');
const joe = require('../execution/traderjoe');
const getNormalTime = require('../util/datetime');

let plsStop = false;
let messageId = null;
let sellAlertLimit = 33500.0;
let buyAlertLimit = 100.0;

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
        let arr = await joe(['0.3', '0.35', '0.4'], 'gOHM', 'MIM');
        let i = 0;
        let isSellAlert = false;
        let isBuyAlert = false;
        let alertPrice = [];

        let message = `Retrieval Time: ${getNormalTime()}\n\n`;
        while (i < arr.length) {
            let amountOfOhm = arr[i++];
            let buyPrice = arr[i++];
            let sellPrice = arr[i++];
            if (!isSellAlert && sellPrice != null) {
                isSellAlert = parseFloat(sellPrice) >= sellAlertLimit;
                if (isSellAlert) {
                    alertPrice.push(buyPrice, sellPrice);
                }
            }
            if (!isBuyAlert && !isSellAlert && buyPrice != null) {
                isBuyAlert = parseFloat(buyPrice) <= buyAlertLimit;
                if (isBuyAlert) {
                    alertPrice.push(buyPrice, sellPrice);
                }
            }

            message += `<b>${amountOfOhm} OHM:</b>\nBuy Price: ${buyPrice}\nSell Price: ${sellPrice}\n\n`;
            amountOfOhm = null;
            buyPrice = null;
            sellPrice = null;
        }
        arr = null;

        if (messageId == null && !plsStop) {
            await bot.telegram
                .sendMessage(ctx.chat.id, message, {
                    parse_mode: 'HTML',
                })
                .then((messageDetails) => {
                    messageId = messageDetails.message_id;
                })
                .catch((err) => console.error(err));
        } else {
            await bot.telegram
                .editMessageText(ctx.chat.id, messageId, undefined, message, {
                    parse_mode: 'HTML',
                })
                .catch((err) => console.error(err));
        }

        if (isSellAlert || isBuyAlert) {
            let alertMessage = `<b>${
                isSellAlert ? 'SELL' : 'BUY'
            } ALERT</b> @Vforvitagen\nBuy Price: ${
                alertPrice[0]
            }\nSell Price: ${alertPrice[1]}`;

            await bot.telegram
                .sendMessage(ctx.chat.id, alertMessage, {
                    parse_mode: 'HTML',
                })
                .catch((err) => console.error(err));
        }

        alertPrice = null;
        message = null;
    } catch (error) {
        console.error(error);
    }

    setImmediate(() => sendJoeData(ctx));
};

bot.command('/tradingjoe', async (ctx) => {
    console.log('Received!');
    plsStop = false;
    sendJoeData(ctx);
});

bot.command('/sellalert', async (ctx) => {
    console.log('Setting sell alert');
    const args = ctx.update.message.text.split(' ');
    if (args.length != 2) {
        bot.telegram.sendMessage(
            ctx.chat.id,
            'Please input the correct format!\nE.g: /sellalert 30000',
            {}
        );
    } else {
        sellAlertLimit = parseFloat(args[1]);
        bot.telegram.sendMessage(
            ctx.chat.id,
            `Set the sell alert floor to ${sellAlertLimit}`,
            {}
        );
    }
});

bot.command('/buyalert', async (ctx) => {
    console.log('Setting buy alert');
    const args = ctx.update.message.text.split(' ');
    if (args.length != 2) {
        bot.telegram.sendMessage(
            ctx.chat.id,
            'Please input the correct format!\nE.g: /buyalert 3000',
            {}
        );
    } else {
        buyAlertLimit = parseFloat(args[1]);
        bot.telegram.sendMessage(
            ctx.chat.id,
            `Set the buy alert ceiling to ${buyAlertLimit}`,
            {}
        );
    }
});
