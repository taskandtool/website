# A contact form that writes to the project's database

The recipe for the most common dynamic route. It runs the same way on the
machine and at the edge. It needs `DATABASE_URL`: the project's managed
Postgres, granted to this app (the owner's Settings; ask with
`request_capability("postgres", why)` when it is missing).

## 1. The table

The website writes leads; a CRM in the project owns them once it exists.
The table name is literal and shared, so use exactly `leads`:

```sql
create table if not exists leads (
  id          bigserial primary key,
  name        text not null,
  email       text not null,
  phone       text,
  message     text,
  source      text not null default 'website',
  page        text,
  created_at  timestamptz not null default now()
);
```

Run it once from this machine (the `database` skill has the connection
mechanics), or from the route on first use with `create table if not exists`.

## 2. The route (in `src/app.tsx`, below the page loop)

```tsx
import { sql } from "./db";
import { render } from "./layout";
import { Thanks } from "./pages/thanks";   // a listed page with path "/thanks"

app.post("/contact", async (c) => {
  const form = await c.req.parseBody();
  const s = (k: string) => (typeof form[k] === "string" ? (form[k] as string).trim() : "");
  // A honeypot field real people never see (hidden with CSS, no aria); bots fill it.
  if (s("company_website")) return c.redirect("/thanks", 303);
  const name = s("name"), email = s("email");
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return c.html(render(Contact.page, <Contact.Body error="Please add your name and a valid email." />), 422);
  }
  await sql(c.env)`
    insert into leads (name, email, phone, message, page)
    values (${name}, ${email}, ${s("phone") || null}, ${s("message") || null}, ${c.req.header("referer") || null})`;
  return c.redirect("/thanks", 303);
});
```

Redirect after POST, so a refresh never resubmits. The thank-you page is
a normal listed page, pre-rendered at publish.

## 3. The form (in the contact page's `Body`)

```tsx
<form method="post" action="/contact" class="mt-block grid max-w-xl gap-6">
  <label class="grid gap-2 text-base font-semibold">
    Name
    <input name="name" required autocomplete="name"
      class="h-12 rounded-control border border-line-strong bg-canvas px-4 font-normal" />
  </label>
  <label class="grid gap-2 text-base font-semibold">
    Email
    <input name="email" type="email" required autocomplete="email"
      class="h-12 rounded-control border border-line-strong bg-canvas px-4 font-normal" />
  </label>
  <label class="grid gap-2 text-base font-semibold">
    What do you need?
    <textarea name="message" rows={5}
      class="rounded-control border border-line-strong bg-canvas px-4 py-3 font-normal"></textarea>
  </label>
  <div class="hidden" aria-hidden="true">
    <label>Company website <input name="company_website" tabindex={-1} autocomplete="off" /></label>
  </div>
  <button type="submit"
    class="inline-flex min-h-12 items-center justify-center rounded-control bg-accent px-5 text-base font-semibold text-accent-ink hover:bg-accent-hover">
    Send the message
  </button>
</form>
```

Native constraint validation does the client side; the route does the
server side. Errors are a diagnosis plus a recovery, next to the form.

## 4. Telling the owner

On the machine, a scheduled job can email new leads to the owner
(`/schedule-job` with `send_email` from `tools/taskandtool.py`). At the
edge the route only writes the row; the job, or a CRM in the project that
reads `leads`, does the rest. Say plainly which of these is in place.

## 5. At the edge

`DATABASE_URL` reaches the Worker as a binding when the owner granted the
project's database to this app; `serving_status()` and `list_connections()`
in `tools/taskandtool.py` show what is granted. Publish with the `ship`
skill; the form works on the edge copy the same way it did here.
