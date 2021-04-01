import { Protocol } from "puppeteer";

export interface PageResult {
    url: string;
    cookies: Protocol.Network.Cookie[];
    childrenUrls: string[];
}
