const pageScrapper = require("../scrappers/page-scrapper");

const crawl = async (url, browser, scrapOptions) => {
  const scrappedPage = await pageScrapper.scrap(browser, url, scrapOptions);
  return { url, data: scrappedPage };
};

module.exports = {
  crawl
};
