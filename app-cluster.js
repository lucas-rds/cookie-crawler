const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const crawler = require("./src/crawler");
const dealWithArgs = require("./args-dealer");

if (cluster.isMaster) {
  const { delay, urls } = dealWithArgs();

  for (let i = 0; i < numCPUs; i++) {
    if (urls.length) {
      const worker = cluster.fork();
      worker.send({ delay, urls: [urls.pop()] });
    }
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  process.on("message", function({ delay, urls }) {
    (async () => {
      console.time(`crawl-${process.pid}`);
      const options = {
        cookiesWaitForTime: Number(delay)
      };

      const crawlers = urls.map(url => crawler.crawl(url, options));
      await Promise.all(crawlers);
      console.log(`Worker ${process.pid} started`);

      console.timeEnd(`crawl-${process.pid}`);
      console.log("End");
      process.exit(0);
    })();
  });
}
