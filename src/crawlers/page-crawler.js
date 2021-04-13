const pageScrapper = require("../scrappers/page-scrapper");

const crawl = async (url, browser, scrapOptions) => {
  try {
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on("request", req => {
      if (req.resourceType() === "stylesheet" || req.resourceType() === "font") {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, { waitUntil: ["load", "networkidle0", "networkidle2"], timeout: 200000 });
    const scrappedPage = await pageScrapper.scrap(page, scrapOptions);
    await page.close();

    return { ...scrappedPage, url };

  } catch (err) {
    throw { url, message: err.message, stack: err.stack }
  }
};

module.exports = {
  crawl
};
