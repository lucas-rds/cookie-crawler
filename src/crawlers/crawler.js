const pageCrawler = require("./page-crawler");
const puppeteer = require("puppeteer");
const { saveIntoDB } = require("../database/database");

const CHUNK_SIZE = 100;

// const crawlSlices = async (urls, alreadyProcessedUrls, browser, options) => {
//   const resolvedCawlers = [];
//   const notProcessedUrls = urls.filter(
//     url => !alreadyProcessedUrls.includes(url)
//   );

//   let counter = CHUNK_SIZE;
//   for (let index = 0; index < notProcessedUrls.length; index += CHUNK_SIZE) {
//     let slice = notProcessedUrls.slice(index, index + CHUNK_SIZE);
//     console.log(
//       `\tchunks: ${(counter += slice.length)}/${notProcessedUrls.length}`
//     );
//     const crawlers = slice.map(url => pageCrawler.crawl(url, browser, options));
//     const crawledPages = await Promise.all(crawlers);
//     resolvedCawlers.push(...crawledPages);
//   }

//   return resolvedCawlers;
// };

const crawlSlicesSync = async (urls, browser, options) => {
  const crawlers = urls.map(url =>
    pageCrawler.crawl(url, browser, options)
      .then(response => {
        saveIntoDB(response)
        return response;
      })
  );
  return await Promise.all(crawlers);
};

const crawlSlicesConcurrent = async (
  originalUrls,
  browser,
  options
) => {
  const urls = [...originalUrls]
  const resolvedCawlers = [];
  async function chain(promise) {
    const url = urls.shift();
    if (url) {
      await promise;
      return chain(
        pageCrawler
          .crawl(url, browser, options)
          .then(response => {
            resolvedCawlers.push(response);
            return response;
          })
          .then(response => {
            const page = { ...response, childrenUrls: [...new Set(response.childrenUrls)] }
            saveIntoDB(page)
            return page;
          })
          .catch(e => console.log(e))
      );
    }
    return promise;
  }

  const promises = new Array(5).fill(Promise.resolve());
  await Promise.all(promises.map(chain));

  return resolvedCawlers;
};

const getScrappedPagesChildrenUrls = crawledPages => {
  return [...new Set(crawledPages
    .filter(crawled => crawled && crawled.childrenUrls)
    .flatMap(crawled => crawled.childrenUrls))];
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

  const processedUrls = new Set();

  alreadyProcessedUrls = url => !processedUrls.has(url);
  rightDomain = url => url.includes("r7.com")
  do {
    urls = urls
      .filter(alreadyProcessedUrls)
    // .filter(rightDomain);

    console.log(urls);
    crawledPages = await crawlSlicesConcurrent(
      urls,
      browser,
      options
    );
    crawlResult = crawlResult.concat(crawledPages);
    urls.forEach(url => processedUrls.add(url));
    urls = getScrappedPagesChildrenUrls(crawledPages);

    console.log("urls.length:", urls.length);
  } while (urls && urls.length);

  console.log(`
    Browser open pages: ${(await browser.pages()).length}
  `);
  await browser.close();

  return crawlResult;
};

module.exports = {
  crawl
};
