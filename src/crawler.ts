import { Crawler } from "./types/crawler";

import { PageResult } from "./types/page-result";
import { Scrapper } from "./types/scrapper";
import { Browser, launch } from "puppeteer";

export class WebCrawler implements Crawler {
  constructor(
    private url: string,
    private pageScrapper: Scrapper<PageResult>,
    private browser?: Browser
  ) { }

  async crawl(): Promise<PageResult> {
    this.browser = this.browser ?? await launch();

    const page = await this.browser.newPage();
    await page.goto(this.url);

    const result: PageResult = await this.pageScrapper.scrap(page);

    await this.browser.close();

    return result;
  }
}
