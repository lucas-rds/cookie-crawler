import { WebCrawler } from "./src/crawler";
import scrapToFile from "./src/io/scrap-to-file";
import { ArgsReader, Args } from './args-reader';
import { PageScrapper } from "./src/scrappers/page-scrapper";
import { Scrapper } from "./src/types/scrapper";
import { Protocol } from "puppeteer";
import { CookieScrapper } from "./src/scrappers/cookies-scrapper";
import { UrlScrapper } from "./src/scrappers/url-scrapper";

(async () => {
  const args: Args = new ArgsReader().read();

  console.time('crawl');

  const cookieScrapper: Scrapper<Protocol.Network.Cookie[]> = new CookieScrapper(args.delay);
  const urlScrapper: Scrapper<string[]> = new UrlScrapper();
  const pageScrapper: PageScrapper = new PageScrapper(cookieScrapper, urlScrapper);

  const crawlers = args.urls.map(url => new WebCrawler(url, pageScrapper).crawl());
  
  await Promise.all(crawlers);

  console.timeEnd('crawl');
})();
