// The collection: /blog lists the posts; each post renders through Post at
// its own path (posts/*.md, FACTS.md → "posts"). Both are pre-rendered.
import { raw } from "hono/html";
import { Section } from "../components";
import { content, postJsonLd } from "../content";
import { site, type Page } from "../site";

const index: Page = {
  path: "/blog",
  title: "Blog",
  description: `Notes and news from ${site.name}.`,
};

function Index() {
  return (
    <Section labelledBy="blog-title">
      <h1 id="blog-title" class="max-w-[12ch] text-section">{index.title}</h1>
      {content.posts.length === 0 ? (
        <p class="mt-8 max-w-xl text-lede text-ink-2">Nothing published yet.</p>
      ) : (
        <ol class="mt-block divide-y divide-line border-y border-line">
          {content.posts.map((p) => (
            <li class="grid gap-3 py-8 sm:grid-cols-[8rem_1fr] sm:gap-6">
              <time datetime={p.date} class="text-label uppercase text-ink-3">{p.date}</time>
              <div>
                <h2 class="text-title">
                  <a href={p.path} class="no-underline hover:underline">{p.title}</a>
                </h2>
                {p.description ? <p class="mt-3 max-w-prose text-ink-2">{p.description}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      )}
    </Section>
  );
}

export const Blog = { page: index, Body: Index };

/** One post, by path. */
export function postPage(post: (typeof content.posts)[number]): { page: Page; Body: () => any } {
  const page: Page = {
    path: post.path,
    title: post.title,
    description: post.description || `${post.title}, from ${site.name}.`,
    jsonLd: [postJsonLd(post, site.url, site.name)],
  };
  const Body = () => (
    <Section labelledBy="post-title">
      <p class="text-label uppercase text-ink-3">
        <time datetime={post.date}>{post.date}</time>
        {post.author ? ` · ${post.author}` : ""}
      </p>
      <h1 id="post-title" class="mt-4 max-w-[16ch] text-section">{post.title}</h1>
      <div class="prose mt-block max-w-prose">{raw(post.html)}</div>
      <p class="mt-block">
        <a href="/blog">All posts</a>
      </p>
    </Section>
  );
  return { page, Body };
}
