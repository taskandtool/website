import { Button, Section } from "../components";
import type { Page } from "../site";

const page: Page = {
  path: "/404",
  title: "Page not found",
  description: "There is no page at this address.",
};

function Body() {
  return (
    <Section labelledBy="nf-title">
      <p class="text-label uppercase text-ink-3">404</p>
      <h1 id="nf-title" class="mt-4 max-w-[12ch] text-section">There is no page here.</h1>
      <p class="mt-6 max-w-md text-lede text-ink-2">
        The address may have changed, or the link was wrong. The home page has everything.
      </p>
      <div class="mt-10">
        <Button href="/">Go to the home page</Button>
      </div>
    </Section>
  );
}

export const NotFound = { page, Body };
