const puppeteer = require("puppeteer");
const pageScrapper = require("./scrappers/page-scrapper");

const crawl = async (url, scrapOptions) => {
  let browser;

  if (scrapOptions.browser) {
    browser = scrapOptions.browser;
  } else {
    browser = await puppeteer.launch();
  }

  const scrappedPage = await pageScrapper.scrap(browser, url, scrapOptions);

  await browser.close();
  return [ url, scrappedPage ];
};

module.exports = {
  crawl
};
