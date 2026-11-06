import { Button, Section } from "../components";
import type { Page } from "../site";

/** A page that could not be made (the database away, say), in the site's own layout. */
export const errorPage = (path: string): Page => ({ path, title: "Try again", description: "This page could not be loaded just now.", canonical: false });

export function ServerError({ retry }: { retry: string | null }) {
  return (
    <Section labelledBy="error-title">
      <h1 id="error-title" class="max-w-[16ch] text-section">This page did not load</h1>
      <p class="mt-6 max-w-md text-lede text-ink-2">Please try again in a moment.</p>
      {retry ? (
        <div class="mt-10">
          <Button href={retry}>Try again</Button>
        </div>
      ) : null}
    </Section>
  );
}
