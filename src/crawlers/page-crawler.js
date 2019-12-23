const pageScrapper = require("../scrappers/page-scrapper");

const crawl = async (url, browser, scrapOptions) => {
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on("request", req => {
    if (req.resourceType() === "stylesheet" || req.resourceType() === "font") {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.goto(url, { waitUntil: "networkidle2" });
  const scrappedPage = await pageScrapper.scrap(page, scrapOptions);
  await page.close();

  return { url, data: scrappedPage };
};

module.exports = {
  crawl
};
