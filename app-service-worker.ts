import { Protocol } from "puppeteer";
import { parentPort, workerData } from "worker_threads";
import { WebCrawler } from "./src/crawler";
import { CookieScrapper, PageScrapper, UrlScrapper } from "./src/scrappers";
import { PageResult } from "./src/types/page-result";
import { Scrapper } from "./src/types/scrapper";


parentPort.once('message', (message) => {
  console.log(message);
});

const { delay, urls } = workerData;

async function execute() {
  console.time("crawl");
  
  const cookieScrapper: Scrapper<Protocol.Network.Cookie[]> = new CookieScrapper(delay);
  const urlScrapper: Scrapper<string[]> = new UrlScrapper();
  const pageScrapper: Scrapper<PageResult> = new PageScrapper(cookieScrapper, urlScrapper);
  const crawlers = urls.map(url => new WebCrawler(url, pageScrapper).crawl());
  await Promise.all(crawlers);

  console.timeEnd("crawl");
  console.log("End");
}

execute();