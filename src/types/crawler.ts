import { PageResult } from "./page-result";

export interface Crawler {
    crawl(): Promise<PageResult>;
}
