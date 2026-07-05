# Inside Project - AGENTS.md

This file provides essential information for AI coding agents working on the Inside project.

## Project Overview

Inside is a personal digital portfolio and ecosystem showcase for Svazer Corp. It showcases various projects, logbook entries, and system architecture details. The site is built with Astro and React, pulling dynamic content from Sanity.io as a headless CMS.

## Technology Stack

- **Framework**: Astro 4.x (with React integration)
- **UI Library**: React (via @astrojs/react)
- **Styling**: CSS Modules / Custom CSS (in `src/styles/`)
- **Headless CMS**: Sanity.io (via @sanity/astro)
- **TypeScript**: For type safety
- **Icons**: Lucide React (via `lucide-react` package)
- **Deployment**: Optimized for Vercel (via @astrojs/vercel)
- **Node Engine**: Requires Node.js >=22.12.0

## Project Structure

```
/src
  /components     # Reusable React components (ProjectPanel, ReadingTile, etc.)
  /layouts        # Layout components (HomeLayout.astro)
  /pages          # Astro pages (index.astro, logbook/[slug].astro, etc.)
  /schema         # Sanity schema types (logbookEntry.ts, project.ts, etc.)
  /styles         # CSS modules and global styles
  /utils          # Utility files (sanity client setup)
/public           # Static assets (favicons, images)
/docs             # Documentation (brand interview, moodboard, wireframes)
```

Key files:
- `astro.config.mjs` - Astro configuration
- `sanity.config.ts` - Sanity studio configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `src/pages/index.astro` - Homepage with data fetching from Sanity
- `src/components/ProjectPanel.astro` - Project showcase component
- `src/components/ReadingTile.astro` - Currently reading widget

## Build and Test Commands

Install dependencies:
```bash
npm install
```

Development server:
```bash
npm run dev
```

Production build:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

Run Astro CLI commands:
```bash
npx astro ...
```

Note: There are no explicit test commands defined in package.json. Testing strategy appears to be manual verification or external testing.

## Development Conventions

### File Naming
- Astro components: `.astro` extension
- React components: `.tsx` (though currently using .astro for components with React syntax)
- TypeScript: `.ts` for utilities, schema
- CSS modules: `.module.css`

### Styling
- Uses CSS modules for component-scoped styles (e.g., `ProjectPanel.module.css`)
- Global styles in `src/styles/global.css`
- CSS variables for theming (defined in CSS)

### Data Fetching
- Data fetched from Sanity.io using `sanityClient` utility (`src/utils/sanity.ts`)
- Uses Sanity GROQ queries
- Data fetched in page components (e.g., index.astro) and passed to child components as props

### Components
- Reusable components are in `src/components/`
- Layouts in `src/layouts/`
- Pages use frontmatter (`---`) for data fetching and layout wrapping

### Sanity Schema
- Located in `src/schema/`
- Defines document types like `project`, `logbookEntry`, `siteSettings`
- Uses TypeScript for type safety

## Deployment

The project is configured for Vercel deployment via `@astrojs/vercel` adapter.
To deploy:
1. Push to GitHub/GitLab/Bitbucket
2. Import project in Vercel
3. Vercel will detect Astro configuration and build automatically

Ensure Sanity.io project ID and dataset are set in environment variables:
- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_TOKEN` (if required for preview)

## Known Information

- The site showcases various software projects built by Svazer Corp.
- Features a logbook section for updates/logs
- Includes a "museum" section with tech stats and gear
- Uses retro/cyberpunk aesthetic with neon colors and animated elements
- Integrates Spotify embed for music playlist
- Includes GitHub contribution graph simulation

## Important Notes

- The homepage overrides Sanity-fetched projects with static data for portfolio display (see lines 24-106 in index.astro)
- Logbook data is fetched from Sanity and displayed chronologically
- The site uses Prerendering disabled (`prerender = false`) for dynamic data fetching
- Lucide icons are used via `data-lucide` attributes in HTML (see icons in homepage)

For any development work, ensure Node.js >=22.12.0 is installed.