const crawler = require("./src/crawler");
const scrapToFile = require("./src/io/scrap-to-file");
const dealWithArgs = require('./args-dealer');

(async () => {
  const { delay, urls } = dealWithArgs();

  console.time('crawl');
  const options = {
    cookiesWaitForTime: Number(delay)
  };

  const crawlers = urls.map(url => crawler.crawl(url, options));
  const scrappedPages = await Promise.all(crawlers);
  await scrapToFile.write(scrappedPages);

  console.timeEnd('crawl');
})();
