# Hamza's Technical Site

## Site philosophy

1. Share meaningful progress. Write posts about common ideas that come up in conversation that I want to explain to my friends/coworkers.

2. Use of AI coding tools - kind of old school perspective to start out. I probably will learn that its unhelpfully slow to do things manually, but this is more of an exercise in training my brain for now, so I will try to do most of my work on this site "by hand". Probably will use claude code for tedious things.

## Usage

This is a static site generator: plain Node.js, no framework, two dependencies (`marked` for Markdown, `gray-matter` for frontmatter).

```
npm install       # once
npm run build     # generates dist/ from content/
npm run serve     # serves dist/ at http://localhost:4000
npm run dev       # build + serve + auto-rebuild and browser refresh on save
```

`npm run dev` watches `content/`, `templates/`, `public/`, and `build.js`. On any change it rebuilds `dist/` and pushes a live-reload event to any open browser tab, so editing a post or template just requires hitting save.

**Writing a post**: add a Markdown file to `content/posts/`, e.g. `content/posts/2026-03-01-my-post.md`:

```markdown
---
title: "My Post"
date: 2026-03-01
description: "One-sentence summary shown in post lists."
---

Post body in Markdown here.
```

The filename's leading date is stripped to make the URL slug (`/blog/my-post/`); the `date` in frontmatter controls sort order and the displayed date. Both files-with-date-prefix and without work — the slug just comes from the filename.

**Images**: drop files in `public/images/` and reference them in Markdown as `/images/filename.png`. Everything in `public/` is copied into `dist/` as-is.

To control an image's size, use a raw HTML `<img>` tag instead of `![]()` syntax — Markdown passes raw HTML through untouched:

```html
<img src="/images/diagram.png" alt="Diagram" width="400">
```

Images are centered and capped at the post's width automatically (`width` just sets a preferred size; it'll still shrink on narrow screens since `max-width: 100%` and `height: auto` are applied in `public/styles.css`).

**YouTube embeds**: put a shortcode on its own line, using either a bare video ID or a full URL (`watch?v=`, `youtu.be/`, or `/embed/` links all work):

```
{% youtube dQw4w9WgXcQ %}
```

Renders as a responsive 16:9 embed (privacy-enhanced `youtube-nocookie.com`).

**Home page**: edit `content/home.md`.

**Featured posts**: add a `thumbnail` to any post's frontmatter, then list its slug under `featured` in `content/home.md`'s frontmatter, in the order you want the cards to appear:

```yaml
# content/posts/2026-03-01-my-post.md
---
title: "My Post"
date: 2026-03-01
description: "..."
thumbnail: cover.png
---
```

```yaml
# content/home.md
---
title: Home
featured:
  - my-post
  - another-post-slug
---
```

`thumbnail` can be a bare filename (resolved to `/images/<post-slug>/<filename>`, matching the per-post image folders already in use) or an absolute path starting with `/`. A post without a `thumbnail` still shows a featured card, just without an image. An unknown slug in `featured` is skipped with a console warning at build time.

**Layout/styling**: `templates/layout.js` has the HTML templates (home, blog index, post); `public/styles.css` has the styles.

Sample posts and the home page currently contain lorem ipsum — replace freely.

## Deployment

Hosted on GitHub Pages at [hamzasayedali.com](https://hamzasayedali.com), served straight from this repo. `.github/workflows/deploy.yml` builds `dist/` and publishes it via GitHub Actions on every push to `main`. `public/CNAME` holds the custom domain, so it's copied into every build automatically — no need to touch GitHub's Pages settings again after the initial setup.