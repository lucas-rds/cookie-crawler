const pageCrawler = require("./page-crawler");
const puppeteer = require("puppeteer");

const CHUNK_SIZE = 20;

const getScrappedPagesChildrenUrls = crawledPages => {
  return crawledPages
    .filter(crawled => crawled && crawled.data && crawled.data.childrenUrls)
    .flatMap(({ data }) => data.childrenUrls);
};

const crawlSlices = async (urls, alreadyProcessedUrls, browser, options) => {
  const resolvedCawlers = [];
  const notProcessedUrls = urls.filter(
    url => !alreadyProcessedUrls.includes(url)
  );

  let counter = CHUNK_SIZE;
  for (let index = 0; index < notProcessedUrls.length; index += CHUNK_SIZE) {
    let slice = notProcessedUrls.slice(index, index + CHUNK_SIZE);
    console.log(
      `\tchunks: ${(counter += slice.length)}/${notProcessedUrls.length}`
    );
    const crawlers = slice.map(url => pageCrawler.crawl(url, browser, options));
    const crawledPages = await Promise.all(crawlers);
    resolvedCawlers.push(...crawledPages);
  }

  return resolvedCawlers;
};

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
      "--window-size=1920x1080"
    ]
  });

  const alreadyProcessedUrls = [];

  do {
    crawledPages = await crawlSlices(
      urls,
      alreadyProcessedUrls,
      browser,
      options
    );
    crawlResult.push(...crawledPages);
    alreadyProcessedUrls.push(...urls);
    urls = getScrappedPagesChildrenUrls(crawledPages);

    console.log(urls.length);
  } while (urls && urls.length);

  await browser.close();

  return crawlResult;
};

module.exports = {
  crawl
};
