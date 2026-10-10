// What the site takes from visitors and what the team reads of it: forms
// (a contact form, an order, a survey, a paid appointment: a booking and a
// payment are steps of a form), the booking pages at /book, Stripe's webhook,
// and the private /admin. Every one reads the project's database
// (DATABASE_URL: a Worker binding in production, the env in dev); a site
// without one serves its pages as before and answers 404 here (503 to
// Stripe, which then delivers again).
//
// The code under src/data, admin, forms, booking and payments is the skills'
// (each skill's SKILL.md says how to use it); this file only mounts it.
// Mounted in src/app.tsx below the pages, so a page of the same path wins.
import { Hono, type Context, type MiddlewareHandler } from "hono";
import type { Child } from "hono/jsx";
import { teamOnly, type TeamVars } from "./admin/guard";
import type { NavItem } from "./admin/layout";
import { bookingAdmin } from "./booking/admin";
import { confirmFormBooking } from "./booking/confirm";
import { bookingStep } from "./booking/form-step";
import { emailSend, emailSender, notifyBooking, type BookingNotice } from "./booking/notify";
import { bookingPages } from "./booking/public";
import { envOf, envVar } from "./data/env";
import { fromNeon } from "./data/neon";
import { afterResponse } from "./data/send";
import { formsAdmin } from "./forms/admin";
import { formRoutes } from "./forms/routes";
import { completePaidSubmission } from "./forms/store";
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
    adminPath: "/admin/forms",
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
    onBooked: confirm,
  }),
);

// The team's side, private: Task & Tool lets only the team reach /admin
// (add-private-path, which setup.sh declares) and teamOnly answers 404 to
// anyone else. One nav across the sections.
const nav: NavItem[] = [
  { href: "/admin/forms/submissions", label: "Submissions" },
  { href: "/admin/forms", label: "Forms" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/bookings/schedule", label: "Schedule" },
  { href: "/admin/bookings/types", label: "What can be booked" },
  { href: "/admin/bookings/people", label: "People and hours" },
  { href: "/admin/payments", label: "Payments" },
];
const admin = new Hono<{ Variables: TeamVars }>();
admin.use("*", teamOnly());
admin.use("*", async (c, next) =>
  hasDb(c) ? next() : c.text("This site has no database yet. Ask the AI to set one up, and the forms, bookings and payments appear here.", 503),
);
admin.get("/", (c) => c.redirect("/admin/forms/submissions"));
admin.route(
  "/forms",
  formsAdmin(getDb, {
    base: "/admin/forms", css: CSS, timeZone: site.timeZone, source: SOURCE, nav,
    links: { booking: (id) => `/admin/bookings/${id}`, payment: (id) => `/admin/payments/${id}` },
  }),
);
admin.route(
  "/bookings",
  bookingAdmin(getDb, {
    base: "/admin/bookings", css: CSS, source: SOURCE, nav, timeZone: site.timeZone,
    manageBase: BOOK ?? undefined,
    // Calendar sync and reminders are scheduled jobs the CRM runs; this site has none.
    calendars: false,
    onBooked: confirm,
  }),
);
admin.route("/payments", paymentsAdmin(getDb, { base: "/admin/payments", css: CSS, timeZone: site.timeZone, nav }));
business.route("/admin", admin);

export default business;
