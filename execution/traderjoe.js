const puppeteer = require('puppeteer');

const map = {
    wsOHM: '.token-item-0x8CD309e14575203535EF120b5b0Ab4DDeD0C2073',
    MIM: '.token-item-0x130966628846BFd36ff31a822705796e8cb8C18D',
};

const price = async (amounts, token1, token2) => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
        const page = await browser.newPage();

        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
        });
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
        );

        console.log('Getting data from Joe');

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

        // [amount, buyPrice, sellPrice]
        let arr = [];

        for (let i = 0; i < amounts.length; i++) {
            for (let j = 0; j < 4; j++) {
                await ex[0].press('Backspace');
            }
            const amount = amounts[i];
            await ex[0].type(amount);

            // Invert price
            await page.waitForSelector('button.sc-krvtoX');
            await page.click('button.sc-krvtoX');

            let buyPrice = '';
            let sellPrice = '';

            // Get price text
            const [price] = await page.$x("//div[contains(., 'MIM per')]");
            if (price) {
                sellPrice = await price.evaluate(
                    (e1) => e1.textContent.match(/\d+\.?\d* MIM per wsOHM/g)[0]
                );
            }

            // Middle invert tokens
            await page.click('.sc-bXGyLb');

            // Invert price
            await page.click('button.sc-krvtoX');

            const [nextprice] = await page.$x("//div[contains(., 'MIM per')]");
            if (nextprice) {
                buyPrice = await nextprice.evaluate(
                    (e1) => e1.textContent.match(/\d+\.?\d* MIM per wsOHM/g)[0]
                );
            }

            // Middle invert tokens
            await page.click('.sc-bXGyLb');
            arr.push(amount, buyPrice, sellPrice);
        }

        await browser.close();
        return arr;
    } catch (error) {
        await browser.close();
        throw error;
    }
};

module.exports = price;
