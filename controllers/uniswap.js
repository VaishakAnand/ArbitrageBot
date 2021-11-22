const puppeteer = require('puppeteer');

const url = 'https://app.uniswap.org/#/swap';

let imported = false;

const price = async (amount, token) => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
        });
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
        );

        console.log('Getting data from Uniswap');

        await page.goto(url, {
            waitUntil: 'networkidle2',
        });

        if (!imported) {
            await importToken(page, token);
            imported = true;
        } else {
            await selectToken(page, token);
        }

        await getPrice(page, '0.3');

        await browser.close();
    } catch (error) {
        console.error(error);
    }
};

const importToken = async (page, token) => {
    // click select token button
    await page.click(
        '#swap-currency-output > div > div.sc-33m4yg-4.hzRLOF > button'
    );
    // type in search for token
    await page.type('input#token-search-input', token);

    // Import token
    await page.waitForSelector(
        'body > reach-portal:nth-child(8) > div:nth-child(3) > div > div > div > div > div:nth-child(3) > div:nth-child(1) > div > div > div.sc-1x3jvxb-0.bCYeRt > button'
    );
    await page.click(
        'body > reach-portal:nth-child(8) > div:nth-child(3) > div > div > div > div > div:nth-child(3) > div:nth-child(1) > div > div > div.sc-1x3jvxb-0.bCYeRt > button'
    );

    // click import confirmation
    await page.waitForSelector(
        'body > reach-portal > div:nth-child(3) > div > div > div > div > div.sc-1kykgp9-2.bBlzxc > button'
    );
    await page.click(
        'body > reach-portal > div:nth-child(3) > div > div > div > div > div.sc-1kykgp9-2.bBlzxc > button'
    );
};

const selectToken = async (page, token) => {
    await page.click(
        '#swap-currency-output > div > div.sc-33m4yg-4.hzRLOF > button'
    );
    // type in search for token
    await page.type('input#token-search-input', token);

    await page.waitForSelector(
        'body > reach-portal:nth-child(8) > div:nth-child(3) > div > div > div > div > div:nth-child(3) > div:nth-child(1) > div > div > div'
    );
    await page.click(
        'body > reach-portal:nth-child(8) > div:nth-child(3) > div > div > div > div > div:nth-child(3) > div:nth-child(1) > div > div > div'
    );
};

const getPrice = async (page, amount) => {
    await page.waitForSelector(
        '#swap-currency-output > div > div.sc-33m4yg-4.hzRLOF > input',
        { visible: true }
    );

    await page.click(
        '#swap-currency-output > div > div.sc-33m4yg-4.hzRLOF > input'
    );
    console.log('CLCUEKDE');
    // await page.type(
    //     '#swap-currency-output > div > div.sc-33m4yg-4.hzRLOF > input',
    //     amount, {delay: 100}
    // );
    // await page.$$eval(
    //     'input.token-amount-input',
    //     (elem, amount) => {
    //         console.log(amount);
    //         elem[1].value = amount;
    //     },
    //     amount
    // );
    // await page.type(
    //     '#swap-currency-output > div > div.sc-33m4yg-4.hzRLOF > input',
    //     amount
    // );

    // await new Promise((resolve) => setTimeout(resolve, 3000));
    await page.waitForSelector(
        '#swap-currency-input > div > div.sc-33m4yg-5.sc-33m4yg-6.fucKMh.iipmPE > div > div > div > span'
    );
    let price = await page.$$eval(
        '#swap-currency-input > div > div.sc-33m4yg-5.sc-33m4yg-6.fucKMh.iipmPE > div > div > div > span',
        (elem) => elem[0].textContent
    );
    console.log(price);
};
