// The pages of the site, in nav order. Each module exports `page` (route,
// title, description) and `Body` (the <main> content). Add a page: create
// src/pages/<name>.tsx with the same shape and list it here; it becomes a
// route on the machine and a pre-rendered HTML file at publish.
import type { FC } from "hono/jsx";
import type { Page } from "../site";
import { Home } from "./home";

export interface PageModule {
  page: Page;
  Body: FC;
}

const modules: PageModule[] = [Home];

export const pages: (Page & { Body: FC })[] = modules.map((m) => ({ ...m.page, Body: m.Body }));
