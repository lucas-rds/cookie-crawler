import { Page } from "puppeteer";

export interface Scrapper<T> {
    scrap(page?: Page): Promise<T> | T;
}
