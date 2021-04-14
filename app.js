const crawler = require("./src/crawlers/crawler");
const scrapToFile = require("./src/io/scrap-to-file");
const dealWithArgs = require("./args-dealer");
const { connect, disconnect } = require("./src/database/database");

(async () => {
  let { delay, urls, domain, username, password, groupName, poolSize } = dealWithArgs();
  await connect();

  // let delay = 0
  // let urls = ["http://localhost:3000/A-1.html"]
  // let urls = ["https://www.r7.com/"]

  console.time("crawl");
  const options = {
    cookiesWaitForTime: Number(delay),
    domain,
    username,
    password,
    groupName,
    poolSize
  };

  console.log(urls);
  await crawler.crawl(urls, options);

  console.timeEnd("crawl");
  await disconnect();
})();
