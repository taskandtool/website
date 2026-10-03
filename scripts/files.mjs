// Every file under a folder, for the scripts that scan src/ and dist/.
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export const walk = (dir) =>
  readdirSync(dir).flatMap((e) => {
    const p = join(dir, e);
    return e === "node_modules" ? [] : statSync(p).isDirectory() ? walk(p) : [p];
  });
