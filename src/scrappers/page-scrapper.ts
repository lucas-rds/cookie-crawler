import { Page, Protocol } from "puppeteer";
import { PageResult } from "../types/page-result";
import { Scrapper } from "../types/scrapper";

export class PageScrapper implements Scrapper<PageResult> {
  constructor(
    private cookieScrapper: Scrapper<Protocol.Network.Cookie[]>,
    private urlScrapper: Scrapper<string[]>
  ) {}

  async scrap(page: Page): Promise<PageResult> {
    const cookies: Protocol.Network.Cookie[] = await this.cookieScrapper.scrap(page);
    const childrenUrls: string[] = await this.urlScrapper.scrap(page);
    
    const results: PageResult = { url: page.url(), cookies, childrenUrls };
    return results;
  };
}