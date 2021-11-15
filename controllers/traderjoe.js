const puppeteer = require('puppeteer');

const map = {
    wsOHM: '.token-item-0x8CD309e14575203535EF120b5b0Ab4DDeD0C2073',
    MIM: '.token-item-0x130966628846BFd36ff31a822705796e8cb8C18D',
};

const price = async (amounts, token1, token2) => {
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
    });
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
    );

    await page.goto('https://traderjoexyz.com/#/trade', {
        waitUntil: 'networkidle2',
    });

    const dropdown = await page.$$('span.sc-ugnQR');
    await dropdown[0].click();

    await page.type('#token-search-input', token1);
    let opt = await page.$$(map[token1]);
    await opt[0].click();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await dropdown[1].click();
    await page.type('#token-search-input', token2, { delay: 100 });

    opt = await page.$$(map[token2]);
    await opt[0].click();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const ex = await page.$$('input.token-amount-input');

    for (let i = 0; i < amounts.length; i++) {
        for (let j = 0; j < 4; j++) {
            await ex[0].press('Backspace');
        }
        const amount = amounts[i];
        await ex[0].type(amount);

        let buyPrice = '';
        while (buyPrice == '') {
            buyPrice = await ex[1].evaluate((el) => el.getAttribute('value'));
        }
        console.log('BuyPrice:', amount, token1, 'for', buyPrice, token2);

        await page.click('.sc-bXGyLb');

        let sellPrice = amount;
        while (sellPrice == amount) {
            sellPrice = await ex[0].evaluate((el) => el.getAttribute('value'));
        }
        console.log('SellPrice:', sellPrice, token2, 'for', amount, token1);

        await page.click('.sc-bXGyLb');
        // await new Promise((resolve) => setTimeout(resolve, 500));
    }

    await browser.close();
};

// price(['0.25', '0.3', '0.35', '0.4'], 'wsOHM', 'MIM');
module.exports = price;
