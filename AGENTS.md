# AGENTS.md

Guidance for AI coding agents working on this repository.

This is the personal portfolio of **Svazer The Great**, live at
[svazer.us.ci](https://svazer.us.ci). The homepage lists 14 projects; each one
renders as a panel with a screenshot in a mock device frame, linking to the live
project and to a detail page on this site.

Also read [`README.md`](README.md) for the project overview and the list of
live URLs. This file covers what an agent needs to change code without breaking
things.

---

## Stack — the real one

| Layer | Actually used |
| --- | --- |
| Framework | Astro 6 (`astro@^6.1.8`) |
| SSR adapter | `@astrojs/cloudflare` — **not** Vercel |
| UI | React 19 via `@astrojs/react`, but **no `.tsx` files exist yet** |
| Styling | `src/styles/global.css` + scoped `<style>` blocks in `.astro` files. **No CSS Modules** |
| CMS | Sanity — project `gwlcf911`, dataset `production`, studio at `/studio` |
| Icons | [Lucide](https://lucide.dev) loaded from unpkg as a `<script>`, used via `data-lucide="name"` attributes |
| Animation | [GSAP 3.12](https://gsap.com) + ScrollTrigger and ScrollToPlugin, loaded from cdnjs in the layouts |
| Deploy | Cloudflare Workers, built from `main` |
| Node | `>=22.12.0` |

If a task seems to call for a framework feature this repo does not use
(Vercel adapter, CSS Modules, `lucide-react` package, Sanity env vars), stop and
check the actual files first — those assumptions are stale and were wrong in an
earlier version of this document.

---

## Commands

```bash
npm install         # no lockfile in this repo, see "Trap: lockfile" below
npm run dev         # dev server on http://localhost:4321
npm run build       # renders OG cards, then builds into dist/
npm run generateOG  # only regenerate public/og/*.png
npm run preview     # preview the build
npx astro ...       # any Astro CLI command
```

`npm run build` runs `scripts/generate-og.mjs` first, which renders the
social preview images into `public/og/`. It reads the same static `projects`
array as the homepage, so a newly added project gets a card automatically.
Commit the generated PNGs; the build also regenerates them, but Cloudflare
builds from the repo and the cards should be inspectable in a diff.

There is **no test script** and no test framework installed for app code.
`@playwright/test` is a devDependency but no test files exist in the repo.

---

## Open Graph and Twitter cards

Every page renders `src/components/SeoMeta.astro` from its layout. It emits
`og:*`, `twitter:*` and `<link rel="canonical">`.

| Page | Image |
| --- | --- |
| `/` | `/og/default.png` |
| `/projects/<slug>` | `/og/<slug>.png` |
| logbook entry with a hero image | that image, cropped 1200×630 |
| logbook, resume, 404 | `/og/default.png` |
| 404 | also `noindex`, no canonical |

The canonical origin lives in `src/utils/site.ts` (**not** `Astro.url`). On
Cloudflare the request URL is the internal worker address, so deriving URLs from
it would emit the wrong domain.

Do not hand-write cards. To change their look, edit the SVG builders in
`scripts/generate-og.mjs` and re-run `npm run generateOG`. If a project is
renamed, delete `public/og/` first so stale files do not linger.

---

## Verification loop

Because there are no tests, changes are verified by building and then looking at
the rendered HTML.

```bash
npm run build
```

A build must exit `0`. Then, to inspect the real output locally:

```bash
rm -rf .wrangler          # required, see "Trap: wrangler" below
cd dist/server
npx wrangler dev entry.mjs --port 4399 --ip 127.0.0.1
```

Serve on port 4399 and drive it with Playwright or `curl`. Useful checks:

- Panel count and order: `document.querySelectorAll('.app-panel')`
- Which frame each panel uses: `.glass-iphone` vs `.glass-browser`
- That images actually load: `naturalWidth > 0`, not just that a URL is present
- Detail pages return 200: `curl -o /dev/null -w "%{http_code}" /projects/<slug>`

After deploying, re-check on the live domain. Cloudflare serves the previous
version until the new build finishes, so a stale result immediately after a push
is normal — poll again rather than concluding the deploy failed.

---

## Project data lives in two places

This is the most common source of bugs in this repo.

| File | Contains |
| --- | --- |
| `src/pages/index.astro` | `projects` array (~line 24) driving the homepage panels |
| `src/pages/projects/[slug].astro` | The same array (~line 21) **plus** a `bodyRaw` string per slug |
| `src/pages/gallery.astro` | The same array again, for the screenshot wall at `/gallery` |

Both arrays are hardcoded and **override** whatever Sanity returns:

```js
// Override with static data for bot portfolio
projects = [ ... ];
```

So edits to Sanity content will not show up on the homepage or detail pages.
Change the arrays in these two files.

When adding or renaming a project:

1. Add/edit the entry in **all three** files, keeping them identical.
2. Add a `bodyRaw` branch in `[slug].astro` keyed by the same slug.
3. Add a screenshot to `public/projects/`.
4. Run `npm run build` and verify the panel count went up correctly.

Entry shape:

```js
{
  title: "Zerpaste",
  description: "One or two sentences shown on the panel.",
  slug: { current: "zerpaste" },
  projectUrl: "https://zerpaste.svazer.workers.dev",
  themeHex: "#0a0f20",      // panel background tint
  device: "iphone",         // "iphone" or "browser"
  homepageImage: "/projects/zerpaste.jpg"
}
```

`[slug].astro` also injects fixed metadata (`role`, `year`, `stack`, `status`)
for every project, and redirects to `/404` when the slug is unknown.

---

## Screenshots

One JPEG per project in `public/projects/`, quality 88. PNG was tried and came
out larger, so do not "optimize" back to PNG.

These same JPEGs feed the social cards: `scripts/generate-og.mjs` crops each one
into the right half of the 1200×630 image. A bad screenshot therefore also
produces a bad preview card.

| `device` | Capture size | Frame |
| --- | --- | --- |
| `"browser"` | desktop, roughly 1280–1500 px wide | `.glass-browser`, `16/10` |
| `"iphone"` | mobile, exactly **430×932** | `.glass-iphone`, `9/19.5`, max-width 320 px |

A desktop screenshot in an iPhone frame is cropped badly. If you switch a
project to `device: "iphone"`, retake the screenshot at mobile width.

When capturing, wait until the page stops changing before taking the shot, or
the image shows a loading state. Some source sites are image-heavy and need a
few seconds.

---

## Writing style for user-facing copy

Project descriptions and `bodyRaw` are written from what the live site actually
contains, not from guesses. Open the site, read its headings and feature list,
then write.

Do not invent domains, endpoint counts, or feature names. If a site cannot be
reached, say so instead of writing plausible-sounding copy.

Project titles must match the site's own title. Confirm from the page `<title>`
or `<h1>`. An earlier entry was titled from an old internal name and was wrong.

Commit messages in this repo are plain sentences without Conventional Commit
prefixes.

---

## Traps

### Trap: lockfile

`package-lock.json` is **intentionally not committed** and is in `.gitignore`.
Adding it breaks the Cloudflare build during `npm clean-install` with the
misleading error `npm error Exit handler never called!`.

Do not run anything that commits a lockfile. If npm creates one locally, leave
it ignored.

### Trap: wrangler config collision

`wrangler dev` fails with *"Found both a user configuration file ... and a
deploy configuration file"* if `.wrangler/` exists in the repo root. Delete it
before running:

```bash
rm -rf .wrangler
```

### Trap: Sanity may be unreachable

`sanityClient.fetch` calls in `index.astro`, `logbook/*` and `projects/[slug]`
are wrapped in `try/catch`. From some networks the Sanity API returns 403. This
is harmless — the page falls back to the static arrays and `logbookEntries`
stays empty. Do not treat it as a regression.

### Trap: `main` is `display: contents`

`global.css` sets `main { display: contents }` so the homepage sections can
participate in the scroll-snap parent. A new page that wraps its content in
`<main class="...">` therefore loses its own `max-width` and padding, and the
content stretches edge to edge.

Use a plain `<div>` as the page wrapper instead (see `src/pages/gallery.astro`).
This is the earlier bug where the gallery title did not line up with the grid.

### Trap: prerender is disabled

Every data page sets `export const prerender = false`. The build output is a
Worker (`dist/server/entry.mjs`) plus assets, not static HTML. Opening
`dist/client/index.html` will not show the site.

---

## Repository layout

```
src/
  components/   ProjectPanel, Gallery, Manifesto, ReadingTile, Footer,
                CodeSnippet, PortableText, SeoMeta (og/twitter/canonical)
  layouts/      HomeLayout.astro (homepage), MagazineLayout.astro (detail pages)
  pages/
    index.astro              homepage + project array
    projects/[slug].astro    detail pages + duplicate array + bodyRaw
    logbook/index.astro      logbook listing (from Sanity)
    logbook/[slug].astro     logbook entry
    gallery.astro            screenshot wall of all 14 projects
    resume.astro
    studio/[...index].astro  embedded Sanity Studio
    sitemap.xml.ts           dynamic sitemap
    404.astro
  schema/       Sanity types: project, logbookEntry, siteSettings, blockContent
  styles/       global.css
  utils/        sanity.ts (client + image URL builder), site.ts (canonical origin)
public/
  projects/     14 project screenshots
  og/           generated social cards, one per page/project
  script.js     homepage behaviour, loaded by HomeLayout
  project.js    detail-page behaviour, loaded by MagazineLayout
scripts/        generate-og.mjs (renders public/og via sharp)
docs/           brand interview, moodboard, wireframe, audit
```

Conventions that match what is already there:

- Components are `.astro` files, even when they contain markup that could be
  React. Only add `.tsx` if React state is genuinely needed.
- Per-component styles go in a scoped `<style>` block inside the `.astro` file.
- Shared tokens and typography go in `src/styles/global.css`.
- Data fetch happens in page frontmatter and is passed down as props.
- Scroll animations use GSAP loaded from CDN in `HomeLayout` and
  `MagazineLayout`. There is no local GSAP dependency; do not add one.

---

## License

MIT, see [`LICENSE`](LICENSE). The projects showcased on the site are separate
works with their own terms.
