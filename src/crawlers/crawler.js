const pageCrawler = require("./page-crawler");

const puppeteer = require("puppeteer");

const getScrappedPagesChildrenUrls = crawledPages => {
  return crawledPages
    .filter(crawled => crawled && crawled.data && crawled.data.childrenUrls)
    .flatMap(({ data }) => data.childrenUrls);
};
const crawlPages = () => {
  const crawlers = urls.map(url => pageCrawler.crawl(url, browser, options));
  crawledPages = await Promise.all(crawlers);
}

const crawl = async (urlsToCrawl, options) => {
  let crawlResult = [];
  let urls = [...urlsToCrawl];
  let crawledPages;
  const browser = await puppeteer.launch();

  do {

    crawlResult.push(...crawledPages);
    urls = getScrappedPagesChildrenUrls(crawledPages);
    console.log(urls.length);
  } while (urls && urls.length);

  await browser.close();

  return crawlResult;
};

module.exports = {
  crawl
};
