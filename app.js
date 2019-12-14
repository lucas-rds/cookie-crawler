const crawler = require("./src/crawler");
const puppeteer = require("puppeteer");

(async () => {
  const url = process.argv[2];
  const delay = process.argv[3] || 1000;
  if(!url){
    throw new Error('Please provide a valid url');
  }

  const browser = await puppeteer.launch();
  await crawler.crawl(url, {
    cookiesWaitForTime: Number(delay),
    browser
  });
  await browser.close();

  console.log('End');
})();
