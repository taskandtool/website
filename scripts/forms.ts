// Forms from chat: the forms skill's command (src/forms/cli.ts) with this
// site's database and zone. `--help` for usage.
import { formsCli } from "../src/forms/cli";
import { site } from "../src/site";
import { withDb } from "./db";

await formsCli(process.argv.slice(2), { withDb, source: "website", timeZone: site.timeZone });
