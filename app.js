const crawler = require("./src/crawlers/crawler");
const scrapToFile = require("./src/io/scrap-to-file");
const dealWithArgs = require("./args-dealer");


(async () => {
  let { delay, urls } = dealWithArgs();

  console.time("crawl");
  const options = {
    cookiesWaitForTime: Number(delay)
  };

  const result = await crawler.crawl(urls, options);
  await scrapToFile.write(result);

  console.timeEnd("crawl");
})();
