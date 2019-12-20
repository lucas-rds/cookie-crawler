const crawler = require("./src/crawlers/crawler");
const scrapToFile = require("./src/io/scrap-to-file");
const dealWithArgs = require("./args-dealer");


(async () => {
  // let { delay, urls } = dealWithArgs();

  let delay = 0
  let urls = ["https://www.r7.com/"]

  console.time("crawl");
  const options = {
    cookiesWaitForTime: Number(delay)
  };

  const result = await crawler.crawl(urls, options);
  await scrapToFile.write(result);

  console.timeEnd("crawl");
})();
