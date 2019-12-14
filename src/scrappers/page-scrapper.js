const cookiesScrapper = require("./cookies-scrapper");
const urlScrapper = require("./url-scrapper");

const defaultOptions = {
  cookies: true,
  cookiesWaitForTime: 0,
  childrenUrls: true
};

const scrap = async (browser, url, userOptions) => {
  let cookies;
  let childrenUrls;

  const options = { ...defaultOptions, ...userOptions };

  const page = await browser.newPage();
  await page.goto(url);

  if (options.cookies) {
    cookies = await cookiesScrapper.scrap(page, options.cookiesWaitForTime);
  }

  if (options.childrenUrls) {
    childrenUrls = await urlScrapper.scrap(page, options);
  }

  return { cookies, childrenUrls };
};

module.exports = {
  scrap
};
