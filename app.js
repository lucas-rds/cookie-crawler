const crawler = require("./src/crawler");
const scrapToFile = require("./src/io/scrap-to-file");
const minimist = require("minimist");

const dealWithArgs = () => {
  try {
    const args = minimist(process.argv.slice(2));
    const urls = args._.filter(param => param && param.includes("http"));
    if (args.help || args.h || !urls.length) {
      throw new Error();
    }
    return { urls: urls, delay: args.delay || 0 };
  } catch (error) {
    console.log(`
    Usage
      $ node app.js --delay 1000 https://google.com https://github.com/

    Options
      --delay Time waited in the page before fetching the cookies`);

    return process.exit(0);
  }
};

(async () => {
  const { delay, urls } = dealWithArgs();

  const options = {
    cookiesWaitForTime: Number(delay)
  };

  const crawlers = urls.map(url => crawler.crawl(url, options));
  const scrappedPages = await Promise.all(crawlers);
  await scrapToFile.write(scrappedPages);

  console.log("End");
})();
