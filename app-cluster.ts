import cluster from "cluster";
import { cpus } from "os";
import { WebCrawler } from "./src/crawler";
import { ArgsReader, Args } from './args-reader';
import { Protocol } from "puppeteer";
import { Scrapper } from "./src/types/scrapper";
import { CookieScrapper, PageScrapper, UrlScrapper } from "./src/scrappers";
import { PageResult } from "./src/types/page-result";

const numCPUs = cpus().length;

if (cluster.isMaster) {
  const { delay, urls }: Args = new ArgsReader().read();

  for (let i = 0; i < numCPUs; i++) {
    if (urls.length) {
      const worker = cluster.fork();
      worker.send({ delay, urls: [urls.pop()] });
    }
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  process.on("message", function ({ delay, urls }) {
    (async () => {
      console.time(`crawl-${process.pid}`);

      const cookieScrapper: Scrapper<Protocol.Network.Cookie[]> = new CookieScrapper(delay);
      const urlScrapper: Scrapper<string[]> = new UrlScrapper();
      const pageScrapper: Scrapper<PageResult> = new PageScrapper(cookieScrapper, urlScrapper);
      const crawlers = urls.map(url => new WebCrawler(url, pageScrapper).crawl());
      await Promise.all(crawlers);
      console.log(`Worker ${process.pid} started`);

      console.timeEnd(`crawl-${process.pid}`);
      console.log("End");
      process.exit(0);
    })();
  });
}
