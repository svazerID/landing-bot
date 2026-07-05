# 🖥️ Svazer The Great

**Svazer The Great** is a personal digital portfolio and ecosystem showcase for **Svazer The Great**.  
It showcases projects, logbook entries, system architecture, and more—built with **Astro + React** and powered by **Sanity.io** as a headless CMS.

![Svazer The Great Preview](https://cdn.svazer.eu.cc/file/adef03f6.jpeg) <!-- optional placeholder -->

---

## 🚀 Quick Start

```bash
# 1️⃣ Clone the repo
git clone https://github.com/svazerID/landing-bot.git
cd landing-bot

# 2️⃣ Install dependencies
npm install

# 3️⃣ Set up environment variables (see .env.example)
cp .env.example .env
# Fill in SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_TOKEN

# 4️⃣ Start the dev server
npm run dev
```

Open <http://localhost:4321> to see the site in action.

---

## 🛠️ Technology Stack

| Category      | Tech / Library                                   |
|---------------|--------------------------------------------------|
| **Framework** | [Astro 4.x](https://astro.build) (with React)   |
| **UI Library**| [React](https://reactjs.org) (`@astrojs/react`) |
| **Styling**   | CSS Modules + Custom CSS (`src/styles/`)        |
| **CMS**       | [Sanity.io](https://www.sanity.io) (`@sanity/astro`) |
| **TypeScript**| For type‑safe code (`tsconfig.json`)            |
| **Icons**     | [Lucide React](https://lucide.dev)              |
| **Deployment**| Optimized for Vercel (`@astrojs/vercel`)        |
| **Node**      | `>=22.12.0`                                     |

---

## 📂 Project Structure

```
Svazer Corp./
├── .git/
├── .vscode/
├── docs/
│   ├── audit.md
│   ├── brand_interview.md
│   ├── moodboard.md
│   └── wireframe.md
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── project.js
│   ├── redline-running.png
│   ├── retro-circuit.png
│   ├── script.js
│   └── setlists-md.png
├── src/
│   ├── components/     # Reusable React components (ProjectPanel, ReadingTile, …)
│   ├── layouts/        # Layout components (HomeLayout.astro)
│   ├── pages/          # Astro pages (index.astro, logbook/[slug].astro, …)
│   ├── schema/         # Sanity schema types (project.ts, logbookEntry.ts, …)
│   ├── styles/         # CSS modules & global styles
│   └── utils/          # Utility files (sanity client setup)
├── .gitignore
├── AGENTS.md
├── astro.config.mjs
├── check_projects.cjs
├── package-lock.json
├── package.json
├── sanity.cli.ts
├── sanity.config.ts
└── tsconfig.json
```

**Key files**
- `astro.config.mjs` – Astro configuration
- `sanity.config.ts` – Sanity studio configuration
- `package.json` – Dependencies & npm scripts
- `tsconfig.json` – TypeScript configuration
- `src/pages/index.astro` – Homepage (fetches data from Sanity)
- `src/components/ProjectPanel.astro` – Project showcase component
- `src/components/ReadingTile.astro` – “Currently reading” widget

---

## 🛠️ Development Commands

| Command                | Description                              |
|------------------------|------------------------------------------|
| `npm install`          | Install dependencies                     |
| `npm run dev`          | Start dev server (`localhost:4321`)      |
| `npm run build`        | Build production bundle (`dist/`)        |
| `npm run preview`      | Preview production build locally         |
| `npx astro ...`        | Run any Astro CLI command                |

> **Note:** No test script is defined; testing is done manually or via external CI.

---

## 🚀 Deployment (Vercel)

1. Push the repository to GitHub / GitLab / Bitbucket.  
2. Import the project in Vercel.  
3. Vercel auto‑detects the Astro build and deploys it.  

**Environment variables required in Vercel:**

| Variable               | Description                              |
|------------------------|------------------------------------------|
| `SANITY_PROJECT_ID`    | Your Sanity project ID                   |
| `SANITY_DATASET`       | Dataset name (usually `production`)      |
| `SANITY_API_TOKEN`     | Token with read (and optionally write) access |

---

## 📄 License

This project is private and proprietary to **Svazer The Great.**  
All rights reserved. Unauthorized copying, modification, or distribution is prohibited.

---

*Made with ❤️ by the Svazer The Great team.*
