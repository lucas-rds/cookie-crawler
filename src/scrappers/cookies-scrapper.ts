import { Protocol, Page } from "puppeteer";
import { Scrapper } from "../types/scrapper";

export class CookieScrapper implements Scrapper<Protocol.Network.Cookie[]> {
  constructor(private waitTime: number = 0) { }

  async scrap(page: Page): Promise<Protocol.Network.Cookie[]> {
    if (this.waitTime) {
      await page.waitForTimeout(this.waitTime);
    }
    const pageCookies = await page.cookies();

    const pageUrl = page.url();
    pageCookies.forEach(cookie => {
      console.log(`cookie found in ${pageUrl}: ${cookie.name} | ${cookie.value} | ${cookie.domain}`);
    });
    return pageCookies;
  };
}

