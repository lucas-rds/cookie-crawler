import { Page } from "puppeteer";
import { Scrapper } from "../types/scrapper";

export class UrlScrapper implements Scrapper<string[]>{
  async scrap(page: Page): Promise<string[]> {
    const urls = await page.$$eval("a", anchors =>
      anchors
        .map((anchor: HTMLLinkElement) => anchor.href)
        .filter(href => href && href.includes("http"))
    );

    return urls;
  };
}


