import { WebCrawler } from "./src/crawler";
import { ArgsReader, Args } from './args-reader';
import { Scrapper } from "./src/types/scrapper";
import { Protocol } from "puppeteer";
import { CookieScrapper, PageScrapper, UrlScrapper } from "./src/scrappers";
import { PageResult } from "./src/types/page-result";

(async () => {
  const args: Args = new ArgsReader().read();

  console.time('crawl');

  const cookieScrapper: Scrapper<Protocol.Network.Cookie[]> = new CookieScrapper(args.delay);
  const urlScrapper: Scrapper<string[]> = new UrlScrapper();
  const pageScrapper: Scrapper<PageResult> = new PageScrapper(cookieScrapper, urlScrapper);

  const crawlers = args.urls.map(url => new WebCrawler(url, pageScrapper).crawl());
  
  await Promise.all(crawlers);

  console.timeEnd('crawl');
})();
