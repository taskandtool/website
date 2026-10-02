#!/usr/bin/env node
// The page as a visitor sees it, at desktop and phone width:
// `npm run shots` (the home page) or `npm run shots -- /services`.
// Obscura renders the dev service on this machine (localhost:3000): the
// desktop shot directly, the phone shot through a 390px frame, since Obscura
// takes no viewport size. Writes uploads/<name>-1280.png and -390.png, ready
// for create_deliverables.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const path = process.argv[2] || "/";
const name = path === "/" ? "home" : path.replace(/^\/|\/$/g, "").replace(/\//g, "-");
const url = `http://localhost:3000${path}`;
mkdirSync("uploads", { recursive: true });

const shoot = (target, file) =>
  execFileSync("obscura", ["fetch", target, "--allow-private-network", "--timeout", "30", "--screenshot", file, "--quiet"], { stdio: "inherit" });

shoot(url, `uploads/${name}-1280.png`);
writeFileSync("uploads/_phone.html", `<!doctype html><body style="margin:0"><iframe src="${url}" width="390" height="2400" style="border:0;display:block"></iframe></body>`);
shoot(`file://${resolve("uploads/_phone.html")}`, `uploads/${name}-390.png`);
console.log(`uploads/${name}-1280.png\nuploads/${name}-390.png`);
