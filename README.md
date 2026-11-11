# Svazer The Great

Personal portfolio and project showcase for **Svazer The Great**, live at
[svazer.us.ci](https://svazer.us.ci).

The homepage lists 14 projects rendered as alternating panels, each in a mock
device frame: a browser window for desktop-oriented sites, an iPhone for
mobile-first ones. Each panel links to the live project and to a detail page on
this site.

Beyond the homepage, the site also has a logbook (`/logbook`), a resume
(`/resume`), and an embedded Sanity Studio (`/studio`).

---

## Live sites

| Site | URL |
| --- | --- |
| Portfolio | <https://svazer.us.ci> |
| Repository | <https://github.com/svazerID/landing-bot> |

---

## Projects shown

| # | Project | Live URL | Frame |
| --- | --- | --- | --- |
| 01 | Alsya API | <https://alsya.svazer.eu.cc> | browser |
| 02 | Svazer CDN | <https://cdn.svazer.eu.cc> | browser |
| 03 | Svazer AI | <https://ai.svazer.eu.cc> | iPhone |
| 04 | Media Downloader API | <https://download.svazer.us.ci> | browser |
| 05 | Svazer Playlist | <https://spotify-playlist.svazer.us.ci> | iPhone |
| 06 | ZerDonghua | <https://donghua.svazer.us.ci> | browser |
| 07 | ZerAnime | <https://anime.svazer.us.ci> | browser |
| 08 | Zermovie | <https://movie.svazer.us.ci> | browser |
| 09 | ZerDrakor | <https://drakor.svazer.us.ci> | browser |
| 10 | Svazer Bot Gateway | <https://gtwbot.svazer.us.ci> | browser |
| 11 | Takina MD | <https://takina.svazer.eu.cc> | iPhone |
| 12 | Zerpaste | <https://zerpaste.svazer.workers.dev> | iPhone |
| 13 | SvazerPRD | <https://prd.svazer.us.ci> | iPhone |
| 14 | Semantika | <https://semantika.svazer.us.ci> | iPhone |

---

## Tech stack

| Layer | What is used |
| --- | --- |
| Framework | [Astro 6](https://astro.build) |
| UI | [React 19](https://react.dev) via `@astrojs/react` |
| Styling | Plain CSS (`src/styles/global.css`) plus scoped `<style>` blocks |
| CMS | [Sanity.io](https://www.sanity.io) — project `gwlcf911`, dataset `production` |
| Icons | [Lucide](https://lucide.dev) loaded from unpkg via `data-lucide` attributes |
| Deploy | Cloudflare Workers through `@astrojs/cloudflare` |
| Node | `>=22.12.0` |

Astro is configured with SSR (no prerendering) and the Cloudflare adapter, so the
build output is a Worker entry plus static assets, not a plain static folder.

---

## Getting started

```bash
git clone https://github.com/svazerID/landing-bot.git
cd landing-bot

# note: this repo intentionally has no lockfile, see the section below
npm install

npm run dev        # http://localhost:4321
```

There are no environment variables to set for a normal local run. The Sanity
project ID and dataset are hardcoded in `astro.config.mjs` and
`src/utils/sanity.ts`.

If the Sanity API is unreachable (for example a 403 from a restricted network),
the pages fall back to the static project data in `src/pages/index.astro`, so
the site still renders correctly.

### Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server on port 4321 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |
| `npx astro ...` | Any Astro CLI command |

There is no test script. Verification is done by building and then checking the
rendered output in a browser.

---

## Project structure

```
landing-bot/
├── public/
│   ├── projects/          # 14 project screenshots (JPEG)
│   ├── favicon.svg, favicon.ico
│   └── project.js, script.js
├── src/
│   ├── components/        # ProjectPanel, Gallery, Manifesto, ReadingTile, ...
│   ├── layouts/           # HomeLayout, MagazineLayout
│   ├── pages/
│   │   ├── index.astro            # homepage + project data
│   │   ├── projects/[slug].astro  # project detail pages
│   │   ├── logbook/               # logbook listing + entries
│   │   ├── resume.astro
│   │   ├── studio/[...index].astro
│   │   └── 404.astro
│   ├── schema/            # Sanity document types
│   ├── styles/global.css
│   └── utils/sanity.ts    # Sanity client + image URL builder
├── docs/                  # brand notes, moodboard, wireframe, audit
├── astro.config.mjs
├── sanity.config.ts
└── package.json
```

### Where the project data lives

Project data is defined twice and the two copies must stay in sync:

- `src/pages/index.astro` — the `projects` array driving the homepage panels
- `src/pages/projects/[slug].astro` — the same array, plus a `bodyRaw` string
  per slug for the detail page

When adding or renaming a project, update both files. Each entry looks like:

```js
{
  title: "Zerpaste",
  description: "...",
  slug: { current: "zerpaste" },
  projectUrl: "https://zerpaste.svazer.workers.dev",
  themeHex: "#0a0f20",      // panel background tint
  device: "iphone",         // or "browser"
  homepageImage: "/projects/zerpaste.jpg"
}
```

### Screenshots

Each project has one screenshot in `public/projects/`, stored as JPEG at quality
88 (PNG was tried and produced noticeably larger files for these images).

- `device: "browser"` — desktop capture, roughly 1280–1500 px wide. Rendered in
  a frame with a `16/10` aspect ratio.
- `device: "iphone"` — mobile capture at **430×932**. The frame uses a `9/19.5`
  aspect ratio, so a desktop screenshot placed here gets heavily cropped.

When retaking a screenshot, wait for the page content to settle before
capturing, otherwise the frame shows a loading state.

---

## Deployment (Cloudflare)

The site runs on Cloudflare Workers via `@astrojs/cloudflare`, deployed from the
`main` branch of this repository.

Build settings used by Cloudflare:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output | `dist/` (Worker + assets) |
| Node version | 22 or newer |

### Why there is no lockfile

`package-lock.json` is deliberately **not committed** and is listed in
`.gitignore`.

A committed lockfile caused the Cloudflare build to fail during
`npm clean-install` with the misleading error `npm error Exit handler never
called!`. The lockfile had been generated on a machine pointed at a private npm
mirror, so the build server could not resolve the dependency URLs. The file was
removed before (commit `02e7fb0`) for the same reason, so it stays out.

Cloudflare therefore resolves dependencies from `package.json` on every build.
Do not re-add the lockfile.

---

## License

Released under the [MIT License](LICENSE).

The MIT license covers the code in this repository. The third-party projects
listed above (Alsya API, ZerAnime, Takina MD, and the rest) are separate works
with their own terms, and the project screenshots in `public/projects/` are
captures of those third-party sites.
