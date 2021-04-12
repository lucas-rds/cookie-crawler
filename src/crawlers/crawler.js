const pageCrawler = require("./page-crawler");
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const { saveIntoDB } = require("../database/database");
const { fileLogger } = require("../logger");

puppeteer.use(StealthPlugin())

const CHUNK_SIZE = 100;


// const crawlSlices = async (urls, alreadyProcessedUrls, browser, options) => {
//   const resolvedCawlers = [];
//   const notProcessedUrls = urls.filter(
//     url => !alreadyProcessedUrls.includes(url)
//   );

//   let counter = CHUNK_SIZE;
//   for (let index = 0; index < notProcessedUrls.length; index += CHUNK_SIZE) {
//     let slice = notProcessedUrls.slice(index, index + CHUNK_SIZE);
//     console.log(
//       `\tchunks: ${(counter += slice.length)}/${notProcessedUrls.length}`
//     );
//     const crawlers = slice.map(url => pageCrawler.crawl(url, browser, options));
//     const crawledPages = await Promise.all(crawlers);
//     resolvedCawlers.push(...crawledPages);
//   }

//   return resolvedCawlers;
// };

const crawlSlicesSync = async (urls, browser, options) => {
  const crawlers = urls.map(url =>
    pageCrawler.crawl(url, browser, options)
      .then(response => {
        saveIntoDB(response)
        return response;
      })
  );
  return await Promise.all(crawlers);
};

const crawlSlicesConcurrent = async (
  originalUrls,
  browser,
  options
) => {
  const urls = [...originalUrls]
  const resolvedCawlers = [];
  async function chain(promise) {
    const url = urls.shift();
    if (url) {
      await promise;
      return chain(
        pageCrawler
          .crawl(url, browser, options)
          .then(response => {
            resolvedCawlers.push(response);
            return response;
          })
          .then(response => {
            const page = { ...response, childrenUrls: [...new Set(response.childrenUrls)] }
            return saveIntoDB(page)
          })
          .then(page => {
            fileLogger.info(page);
            return page;
          })
          .catch(e => {
            fileLogger.error(e);
            console.log(e)
          })
      );
    }
    return promise;
  }

  const promises = new Array(5).fill(Promise.resolve());
  await Promise.all(promises.map(chain));

  return resolvedCawlers;
};



const login = async (browser, username, password) => {

  try {
    const page = await browser.newPage();

    await page.goto("https://g1.globo.com/", { waitUntil: ["load", "networkidle0", "networkidle2"] });

    await page.click('a.barra-item-servico.barra-botao-entrar.barra-base-btn');
    await page.waitForSelector('iframe');

    const elementHandle = await page.$('iframe[title="reCAPTCHA"]');
    const frame = await elementHandle.contentFrame();

    await frame.waitForSelector('.recaptcha-checkbox-border');

    const usernameInput = await page.waitForSelector('input[name="login"]');
    await usernameInput.type(username);

    const passwordInput = await page.waitForSelector('input[name="password"]');
    await passwordInput.type(password);

    await frame.click('.recaptcha-checkbox-border');
    await frame.waitForSelector(".recaptcha-checkbox-checked", { timeout: 100000 });

    await page.waitForTimeout(300);

    await page.waitForSelector('button[type="submit"]');
    await page.click('button[type="submit"]');

    console.log("Logged in")
    await page.close();
  } catch (err) {
    console.error(err)
    return false;
  }

  return true;
}

const crawl = async (urlsToCrawl, options) => {
  let crawlResult = [];
  let urls = [...urlsToCrawl];
  let crawledPages;
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--disable-gpu",
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      "--window-size=1920x1080"
    ]
  });

  // await login(browser, options.username, options.password);

  const processedUrls = new Set();
  const alreadyProcessedUrls = url => !processedUrls.has(url);
  const correctDomain = url => options.domain ? url.includes(options.domain) : true;
  const getScrappedPagesChildrenUrls = crawledPages => [...new Set(crawledPages
    .filter(crawled => crawled && crawled.childrenUrls)
    .flatMap(crawled => crawled.childrenUrls))];

  do {
    urls = urls
      .filter(alreadyProcessedUrls)
      .filter(correctDomain);

    console.log(urls);
    crawledPages = await crawlSlicesConcurrent(
      urls,
      browser,
      options
    );
    crawlResult = crawlResult.concat(crawledPages);
    urls.forEach(url => processedUrls.add(url));
    urls = getScrappedPagesChildrenUrls(crawledPages);

    console.log("urls.length:", urls.length);
  } while (urls && urls.length);

  console.log(`
    Browser open pages: ${(await browser.pages()).length}
  `);
  await browser.close();

  return crawlResult;
};

module.exports = {
  crawl
};
