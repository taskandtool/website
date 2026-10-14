// What the site takes from visitors and what the team reads of it: forms
// (a contact form, an order, a survey, a paid appointment: a booking and a
// payment are steps of a form), the booking pages at /book, Stripe's webhook,
// and the private /admin: every submission in one place, a booking made at
// /book among them. Every one reads the project's database
// (DATABASE_URL: a Worker binding in production, the env in dev); a site
// without one serves its pages as before; its forms and /book answer 404,
// /admin says so (503), and Stripe gets 503 and delivers again.
//
// The code under src/data, admin, forms, booking, payments and customers is the skills'
// (each skill's SKILL.md says how to use it); this file only mounts it.
// Mounted in src/app.tsx below the pages, so a page of the same path wins.
import { Hono, type Context, type MiddlewareHandler } from "hono";
import type { Child } from "hono/jsx";
import { teamOnly, type TeamVars } from "./admin/guard";
import { AdminLayout, type NavItem } from "./admin/layout";
import { bookingAdmin, peopleRoutes, typeRoutes } from "./booking/admin";
import { confirmFormBooking } from "./booking/confirm";
import { bookingStep } from "./booking/form-step";
import { emailSend, emailSender, notifyBooking, type BookingNotice } from "./booking/notify";
import { bookingPages } from "./booking/public";
import { envOf, envVar } from "./data/env";
import type { Db } from "./data/db";
import { fromNeon } from "./data/neon";
import { afterResponse, sendEmail } from "./data/send";
import { formsAdmin } from "./forms/admin";
import { formRoutes } from "./forms/routes";
import { BOOKING_PAGE, completePaidSubmission, recordNotified } from "./forms/store";
import { formatSlot } from "./booking/slots";
import { Layout, render } from "./layout";
import { paymentsAdmin } from "./payments/admin";
import { paymentStep } from "./payments/form-step";
import { stripeFrom } from "./payments/stripe";
import { stripeWebhook } from "./payments/webhook";
import { site } from "./site";

/** This app's slug, stored on every row it writes. */
const SOURCE = "website";
const CSS = "/site.css";

const hasDb = (c: Context) => !!envVar(c, "DATABASE_URL");
const getDb = (c: Context) => fromNeon(envVar(c, "DATABASE_URL"));
/** The domain in a calendar invite's UID, one for every invite so a booking is one event: the site's address once set. */
const DOMAIN = site.url ? new URL(site.url).host : "localhost";
/** The booker's confirmation with its calendar invite, through the owner's sender, after the response. */
const confirm = (c: Context, e: BookingNotice) => afterResponse(c, notifyBooking(emailSend(envOf(c)), e, { domain: DOMAIN }));
/** The booking pages' address for a manage link: the site's own once set, else this request's host (a visitor's). */
const BOOK = site.url ? `${site.url.replace(/\/$/, "")}/book` : null;

/**
 * A booking made at /book, or by the team on the Schedule, is a submission
 * too, so the team reads every booking where it reads every form. Once per
 * booking: one that already belongs to a submission (a form's booking step)
 * is left alone. `page` is where it was made; null for the team's. The new
 * submission's id, or null when there was none to make.
 */
export async function bookingSubmission(db: Db, e: Pick<BookingNotice, "booking" | "type" | "host">, page: string | null): Promise<string | null> {
  const b = e.booking;
  const notes = typeof b.answers.notes === "string" ? b.answers.notes : undefined;
  const data = JSON.stringify({ service: e.type.name, with: e.host.name, ...(notes ? { notes } : {}) });
  const [made] = await db.sql<{ id: string }>`
    with made as (
      insert into submissions (form_key, name, email, phone, data, source, page, status, completed_at)
      select ${BOOKING_PAGE.key}, ${b.name}, ${b.email}, ${b.phone}, ${data}::jsonb, ${SOURCE}, ${page}, 'new', now()
      where exists (select 1 from bookings where id = ${b.id}::bigint and submission_id is null)
      returning id)
    update bookings set submission_id = made.id from made where bookings.id = ${b.id}::bigint
    returning made.id::text as id`;
  return made?.id ?? null;
}

/**
 * Whoever takes a booking made at /book hears of it (team mail: Task & Tool
 * email reaches them when they can open this site in Task & Tool), and the
 * submission keeps who it reached. The team's own bookings tell nobody.
 */
async function tellHost(c: Context, db: Db, id: string, e: BookingNotice): Promise<void> {
  const b = e.booking;
  const to = [e.host.email!];
  const when = formatSlot({ start: b.starts_at, end: b.ends_at }, e.host.time_zone || site.timeZone);
  const sent = await sendEmail(envOf(c), {
    to,
    subject: `New booking: ${e.type.name} with ${b.name || b.email}`,
    text: `${b.name || b.email} booked ${e.type.name} with ${e.host.name}.\n\n${when}\n\n${new URL(`/admin/submissions/${id}`, c.req.url).href}`,
    replyTo: b.email,
    team: true,
  });
  await recordNotified(db, id, to, sent);
}

/**
 * Every change is told to the booker; a new booking is filed with the
 * submissions too (`page` is where it was made). Told first, so a filing
 * that fails (the caller logs it) never stops the confirmation; the booking
 * stands either way. A booking made at /book tells its host (`tellHost`).
 * `dbOf` is the project's database unless a test gives its own.
 */
export const filed = (page: (e: BookingNotice) => string | null, dbOf: (c: Context) => Db = getDb) => async (c: Context, e: BookingNotice) => {
  confirm(c, e);
  if (e.event !== "booked") return;
  const db = dbOf(c);
  const where = page(e);
  const id = await bookingSubmission(db, e, where);
  if (id && where && e.host.email) afterResponse(c, tellHost(c, db, id, e));
};

/** No database yet: these paths do not exist. */
const needsDb: MiddlewareHandler = async (c, next) => (hasDb(c) ? next() : c.notFound());

/** A form's or a booking's page in the site's own layout. */
const Shell = ({ children }: { children?: Child }) => <section class="mx-auto max-w-xl px-4 py-12">{children}</section>;
const page = (path: string, title: string, body: Child) => render({ path, title, description: title }, <Shell>{body}</Shell>);

const business = new Hono();

// Stripe's events: the only thing that marks a payment paid. Each app that
// takes payments has its own endpoint (stripe_events dedupes an event two
// apps both receive). Stripe reaches dev at `taskandtool.py inbound-url /hooks/stripe` and
// production at this site's address; the payments skill's setup says how.
// A form that ends in payment is complete once it is paid, and its booking
// is confirmed then (Stripe delivers again if the send fails).
business.post("/hooks/stripe", async (c, next) => (hasDb(c) ? next() : c.text("waiting for the database", 503)));
business.route(
  "/",
  stripeWebhook(getDb, {
    afterPaid: async (c, paymentId) => {
      const id = await completePaidSubmission(getDb(c), paymentId);
      if (!id) return;
      const sent = await confirmFormBooking(getDb(c), id, emailSender(envOf(c)), { domain: DOMAIN, manageBase: BOOK });
      if (sent.status === "failed") throw new Error(`booking confirmation for submission ${id}: ${sent.error}`);
    },
  }),
);

// Forms, with the booking and payment steps a form may have.
business.use("/forms/*", needsDb);
business.route(
  "/",
  formRoutes(getDb, {
    source: SOURCE,
    page: async (c, title, body) => String(await page(c.req.path, title, body)),
    steps: {
      booking: bookingStep(getDb, { source: SOURCE }),
      payment: paymentStep(getDb, (c) => stripeFrom(envOf(c)), { source: SOURCE }),
    },
    // A booking in a form is confirmed when the whole form is done.
    onComplete: (c, id) =>
      afterResponse(c, confirmFormBooking(getDb(c), id, emailSender(envOf(c)), { domain: DOMAIN, manageBase: BOOK ?? new URL("/book", c.req.url).href })),
  }),
);

// Booking on its own: /book lists what can be booked, /book/<slug> books it.
business.use("/book", needsDb);
business.use("/book/*", needsDb);
business.route(
  "/book",
  bookingPages(getDb, {
    base: "/book",
    domain: DOMAIN,
    css: CSS,
    source: SOURCE,
    Page: ({ title, path, children }) => (
      <Layout page={{ path: path ?? "/book", canonical: path !== null, title, description: title }}>
        <Shell>{children}</Shell>
      </Layout>
    ),
    onBooked: filed((e) => `/book/${e.type.slug}`),
  }),
);

// The team's side, private: Task & Tool lets only the team reach /admin
// (add-private-path, which setup.sh declares) and teamOnly answers 404 to
// anyone else. Submissions (every form and booking, a booking rescheduled or
// cancelled and a payment refunded from its submission), the week's
// Schedule (and booking for someone), the Services people can book, and the
// Team who take them (hours, time off). Forms are changed by asking the AI.
const sections = { schedule: "/admin/schedule", services: "/admin/services", team: "/admin/team" };
const nav: NavItem[] = [
  { href: "/admin/submissions", label: "Submissions" },
  { href: sections.schedule, label: "Schedule" },
  { href: sections.services, label: "Services" },
  { href: sections.team, label: "Team" },
  { href: "/", label: "View site" },
];
const toSubmission = (id: string | null) => (id ? { href: `/admin/submissions/${id}`, label: "Back to the submission" } : null);
const admin = new Hono<{ Variables: TeamVars }>();
admin.use("*", teamOnly());
admin.use("*", async (c, next) =>
  hasDb(c)
    ? next()
    : c.html(
        <AdminLayout title="Submissions" css={CSS} nav={nav} current="/admin/submissions" user={c.get("user")}>
          <p class="max-w-prose">
            This site has no database yet, so its forms and booking page are switched off. Ask the AI to set one up, and what people send
            shows up here.
          </p>
        </AdminLayout>,
        503,
      ),
);
admin.get("/", (c) => c.redirect("/admin/submissions"));
// Calendar sync and reminders are scheduled jobs the CRM runs; this site has none.
const team = { css: CSS, source: SOURCE, nav, timeZone: site.timeZone, sections, manageBase: BOOK ?? undefined, calendars: false };
admin.route(
  "/schedule",
  bookingAdmin(getDb, {
    ...team, base: sections.schedule,
    onBooked: filed(() => null),
    returnTo: (b) => toSubmission(b.submission_id),
  }),
);
admin.route("/services", typeRoutes(getDb, { ...team, base: sections.services }));
admin.route("/team", peopleRoutes(getDb, { ...team, base: sections.team }));
// A payment opens from its submission; the list is not in the nav, and one
// paid for anything else (a booking's deposit) refunds from its own page.
admin.route(
  "/payments",
  paymentsAdmin(getDb, {
    base: "/admin/payments", css: CSS, timeZone: site.timeZone, nav,
    returnTo: (p) => toSubmission(p.ref_type === "submission" ? p.ref_id : null),
  }),
);
admin.route(
  "/submissions",
  formsAdmin(getDb, {
    base: "/admin/submissions", css: CSS, timeZone: site.timeZone, nav,
    links: { booking: (id) => `/admin/schedule/${id}`, payment: (id) => `/admin/payments/${id}` },
  }),
);
business.route("/admin", admin);

export default business;
