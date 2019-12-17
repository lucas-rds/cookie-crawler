const { parentPort, workerData } = require("worker_threads");
const crawler = require("./src/crawler");

parentPort.once('message', (message) => {
  console.log(message);
});

const { delay, urls } = workerData;

async function execute() {
  console.time("crawl");
  const options = {
    cookiesWaitForTime: Number(delay)
  };

  const crawlers = urls.map(url => crawler.crawl(url, options));
  await Promise.all(crawlers);

  console.timeEnd("crawl");
  console.log("End");
}

execute();