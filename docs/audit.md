# Inside a Head — Comprehensive Site Audit

A full-spectrum review of your portfolio/studio website covering technology, architecture, security, performance, SEO, design, and marketing.

---

## 🏗️ Architecture & Technology

### What's Working Well
- **Astro + Sanity + Vercel** is an excellent stack for a portfolio — SSR for fresh content, great DX, and zero-config deployments.
- **View Transitions** (`ClientRouter`) give the site an app-like SPA feel without the complexity of a SPA framework.
- **GSAP animations** are high-quality and performant. The scroll-triggered background transitions and parallax effects are impressive.
- **Sanity Studio embedded at `/studio`** means you can update content from any device — this is a huge win for maintainability.

### Issues Found

#### 🔴 Critical: Sanity Project ID Exposed in Client Code
Your Sanity `projectId: 'gwlcf911'` appears in **three places** — sanity.ts, sanity.config.ts, and astro.config.mjs. While Sanity project IDs are semi-public by design, your client is configured with `useCdn: false`, meaning every page load hits Sanity's API directly. Anyone can query your dataset.

#### 🔴 Critical: No Error Handling for Failed Sanity Fetches
In index.astro, if Sanity is down, the entire homepage will crash with a 500 error. There are no `try/catch` blocks around any of the `sanityClient.fetch()` calls.

#### 🟡 CDN Scripts via `unpkg` and `cdnjs`
You're loading **5 external scripts** from CDNs on every page:
- `https://unpkg.com/lucide@latest` — **`@latest` is dangerous** in production. A breaking change could crash your site at any time.
- `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js`
- `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollToPlugin.min.js`

#### 🟡 `package.json` Name is `cyan-comet`
The package name is still `"cyan-comet"` from a template. Not a bug, but unprofessional if anyone inspects your build.

---

## 🔒 Security

| Finding | Severity | Details |
|---------|----------|---------|
| **npm vulnerabilities** | Moderate | `js-yaml < 3.14.2` prototype pollution via `@vercel/frameworks` → `sanity`. Run `npm audit fix --force` cautiously, or wait for upstream patches. |
| **No CSP headers** | Medium | No Content-Security-Policy is set. Since you load external scripts (CDNs, Spotify iframe), a strict CSP would protect against XSS injection. |
| **Sanity Studio publicly accessible** | Low | `/studio` is open to anyone who finds the URL. Consider adding authentication or at least documenting this as intentional. |
| **External image from `npcdn.net`** | Low | The shoe image on the homepage loads from `cdn1.npcdn.net` — if this CDN goes down or the link breaks, your bento grid will have a broken image. Host it locally or in Sanity. |

---

## ⚡ Performance

### Current Bottlenecks

1. **5 render-blocking CDN scripts** in `<head>` — Lucide, GSAP (3 files). These block First Contentful Paint.
2. **No image optimization** — Project hero images from Sanity are served at full resolution. Astro's `<Image />` component or Sanity's URL builder with `?w=1200&auto=format` could cut image payloads by 60–80%.
3. **Google Fonts loaded via `@import`** in CSS — This is a cascading blocking request. Use `<link rel="preconnect">` + `<link>` in the `<head>` instead for faster font loading.
4. **Spotify iframe** loads on the homepage even if the user never scrolls to it.
5. **No `<link rel="preload">` for critical assets** — The hero section depends on fonts loading first.

---

## 🔍 SEO & Discoverability

### Missing Essentials

| Item | Status | Impact |
|------|--------|--------|
| **404 page** | ❌ Missing | Broken links show a raw error. Create `src/pages/404.astro` |
| **robots.txt** | ❌ Missing | Search engines have no crawling guidance |
| **sitemap.xml** | ❌ Missing | Google can't efficiently discover your pages. Use `@astrojs/sitemap` |
| **Open Graph tags** | ⚠️ Partial | `<meta name="description">` exists, but no `og:image`, `og:type`, `og:url`, or Twitter cards |
| **Canonical URLs** | ❌ Missing | No `<link rel="canonical">` on any page |
| **Structured data (JSON-LD)** | ❌ Missing | No schema.org markup for Person, CreativeWork, or Article |
| **Favicon** | ✅ Present | Both `.ico` and `.svg` exist |

---

## 🎨 Design & UX

### Strengths
- **Strong brand identity** — The "Swiss Industrial" typography and monochromatic palette with accent colors per project is cohesive and memorable.
- **Magazine editorial layout** for project pages is a standout differentiator vs. typical portfolios.
- **"Museum of My Mess" bento grid** — The personal touches (athletics, reading, gear) humanize the brand.
- **Custom cursor** with `mix-blend-mode: difference` is elegant and functional.
- **Manifesto** (now with glassmorphism) adds brand depth.

---

## 📈 Marketing & Positioning

### What's Strong
- The **"Studio"** framing (not "portfolio") is intentional and creates a premium brand. 
- The **Manifesto** is a powerful trust/identity builder.
- **GitHub contribution graph** embedded live adds credibility.
- **Logbook** demonstrates continuous activity and expertise.

---

## 🛠️ Code Quality

### Issues
1. **`global.css` is 1900+ lines** in a single file — This is hard to maintain.
2. **`script.js` and `project.js` are vanilla JS in `/public`** — These bypass Astro's module system entirely.
3. **TypeScript types are weak** — Heavy use of `any` throughout.
4. **Hardcoded project color map** in [slug].astro duplicates what's already in the Sanity `themeHex` field.

---

## 📋 Priority Action Items

### Immediate (Do This Week)
1. ⬜ Pin Lucide to a specific version (change `@latest` → `@0.460.0`)
2. ⬜ Add try/catch around all Sanity fetches with fallback UI
3. ⬜ Create a 404 page (`src/pages/404.astro`)
4. ⬜ Add a contact method (email link, Calendly, or form)
5. ⬜ Fix the Instagram footer link (add real URL or remove)

### Short-term (Next Sprint)
6. ⬜ Add `robots.txt` and install `@astrojs/sitemap`
7. ⬜ Add Open Graph + Twitter Card meta tags to both layouts
8. ⬜ Use env variables for Sanity config
9. ⬜ Add `<link rel="preconnect">` for Google Fonts and Sanity CDN
10. ⬜ Host the shoe image locally or in Sanity (remove npcdn dependency)

### Medium-term (Polish Phase)
11. ⬜ Split `global.css` into modular files
12. ⬜ Move `script.js`/`project.js` into Astro's module system
13. ⬜ Add image optimization (Sanity URL params or Astro `<Image>`)
14. ⬜ Add analytics (Vercel Analytics or Plausible)
15. ⬜ Improve accessibility (conditional cursor hiding, focus traps, focus styles)
16. ⬜ Add RSS feed for Logbook
