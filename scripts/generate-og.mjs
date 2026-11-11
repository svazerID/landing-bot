// Renders the 1200x630 Open Graph / Twitter preview cards into public/og/.
// Run automatically before `astro build` (see package.json) and manually with
// `npm run og`. Safe to re-run: output is deterministic, so unchanged cards
// produce identical files.
//
// Source of truth is the same two hardcoded arrays the pages use, so a new
// project gets a card without touching this file. If you rename a project,
// delete public/og/ and re-run.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'public', 'og');
const SCREENSHOT_DIR = path.join(ROOT, 'public', 'projects');

const W = 1200;
const H = 630;

// Text block occupies the left half; the screenshot only shows to the right of
// it, so no gradient has to fight the copy for contrast.
const TEXT_COLUMN = 620;
const TEXT_WIDTH = TEXT_COLUMN - 180;

const SITE = 'Svazer The Great';
const TAGLINE = 'Digital Ecosystem';

const escapeXml = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

// Generous per-glyph estimate so a font mismatch can only make text narrower,
// never let it run into the screenshot column. DejaVu Sans Bold runs ~0.60em
// for mixed case after letter-spacing.
const GLYPH_RATIO = 0.68;
const approxWidth = (text, size) => text.length * size * GLYPH_RATIO;

function wrap(text, size, maxWidth) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (approxWidth(next, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Extracts `projects = [ ... ];` from an .astro frontmatter block. */
async function readProjects(relPath) {
  const src = await readFile(path.join(ROOT, relPath), 'utf8');
  // The first "projects = [" is the empty declaration before the Sanity fetch;
  // the real list follows the override comment.
  const marker = 'projects = [';
  const overrideAt = src.indexOf('// Override with static data');
  const start = src.indexOf(marker, overrideAt === -1 ? 0 : overrideAt);
  if (start === -1) throw new Error(`No static projects array in ${relPath}`);

  // Walk brackets so a stray "];" further down cannot truncate the array.
  let depth = 0;
  let end = -1;
  for (let i = start + marker.length - 1; i < src.length; i++) {
    const ch = src[i];
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end === -1) throw new Error(`Unterminated projects array in ${relPath}`);
  const literal = src.slice(start + marker.length - 1, end);
  // The array is plain data, so evaluating it in a module scope is safe here.
  return new Function(`return ${literal};`)();
}

function baseDefs(accent) {
  return `
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0b0b12" />
        <stop offset="0.55" stop-color="${accent}" />
        <stop offset="1" stop-color="#08080d" />
      </linearGradient>
      <radialGradient id="glow" cx="0.82" cy="0.12" r="0.75">
        <stop offset="0" stop-color="${accent}" stop-opacity="0.85" />
        <stop offset="1" stop-color="${accent}" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#000" stop-opacity="0.95" />
        <stop offset="0.72" stop-color="#000" stop-opacity="0.55" />
        <stop offset="1" stop-color="#000" stop-opacity="0" />
      </linearGradient>
      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.045" stroke-width="1" />
      </pattern>
    </defs>`;
}

/** Frame: darkened project screenshot on the right, text block on the left. */
function projectCard({ title, description, themeHex, homepageImage, screenshotPath }) {
  const accent = themeHex || '#1c0d22';
  const upperTitle = title.toUpperCase();

  // Prefer one line. If the title cannot fit even at the smallest single-line
  // size, drop to two lines at a smaller size instead of shrinking word-fit.
  let titleSize = 82;
  while (titleSize > 56 && approxWidth(upperTitle, titleSize) > TEXT_WIDTH) titleSize -= 2;

  let titleLines;
  if (approxWidth(upperTitle, titleSize) <= TEXT_WIDTH) {
    titleLines = [upperTitle];
  } else {
    titleSize = 68;
    titleLines = wrap(upperTitle, titleSize, TEXT_WIDTH);
    // Keep every word: shrink until the wrap fits two lines.
    while (titleLines.length > 2 && titleSize > 44) {
      titleSize -= 2;
      titleLines = wrap(upperTitle, titleSize, TEXT_WIDTH);
    }
  }

  // Two description lines, ellipsised, sitting above the footer rule.
  const descLines = wrap(description, 28, TEXT_WIDTH);
  if (descLines.length > 2) {
    descLines.length = 2;
    descLines[1] = `${descLines[1].replace(/[,.;:\s]+$/, '')}...`;
  }

  const lineHeight = Math.round(titleSize * 1.08);
  const titleTop = titleLines.length === 2 ? 262 : 300;
  const titleSvg = titleLines
    .map(
      (line, i) =>
        `<text x="88" y="${titleTop + i * lineHeight}" font-family="DejaVu Sans, Helvetica, Arial, sans-serif" font-size="${titleSize}" font-weight="700" fill="#ffffff" letter-spacing="-1.5">${escapeXml(line)}</text>`
    )
    .join('');

  const descTop = titleTop + titleLines.length * lineHeight + 22;
  const descSvg = descLines
    .map(
      (line, i) =>
        `<text x="90" y="${descTop + i * 42}" font-family="DejaVu Sans, Helvetica, Arial, sans-serif" font-size="28" fill="#c9c9d6">${escapeXml(line)}</text>`
    )
    .join('');

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${baseDefs(accent)}
  <rect width="${W}" height="${H}" fill="#08080d" />
  ${screenshotPath ? `<image href="${screenshotPath}" x="${TEXT_COLUMN}" y="0" width="${W - TEXT_COLUMN}" height="${H}" preserveAspectRatio="xMidYMid slice" opacity="0.6" />` : ''}
  <rect x="${TEXT_COLUMN - 4}" y="0" width="${W - TEXT_COLUMN + 4}" height="${H}" fill="url(#fade)" />
  <rect x="0" y="0" width="${TEXT_COLUMN}" height="${H}" fill="url(#bg)" />
  <rect x="0" y="0" width="${TEXT_COLUMN}" height="${H}" fill="url(#grid)" />
  <rect width="10" height="${H}" fill="${accent}" />
  <text x="90" y="150" font-family="DejaVu Sans Mono, monospace" font-size="22" fill="#8d8da3" letter-spacing="4">${escapeXml(SITE.toUpperCase())}</text>
  <rect x="88" y="178" width="56" height="3" fill="#ffffff" opacity="0.5" />
  ${titleSvg}
  ${descSvg}
  <rect x="88" y="${H - 96}" width="${TEXT_COLUMN - 176}" height="1" fill="#ffffff" opacity="0.12" />
  <text x="90" y="${H - 58}" font-family="DejaVu Sans Mono, monospace" font-size="20" fill="#8d8da3" letter-spacing="2">svazer.us.ci</text>
  <text x="${W - 64}" y="${H - 58}" text-anchor="end" font-family="DejaVu Sans Mono, monospace" font-size="20" fill="#c9c9d6" letter-spacing="2">${escapeXml(TAGLINE.toUpperCase())}</text>
</svg>`;
}

/** Default site card, used by every page without a dedicated image. */
function siteCard(projectCount, domainCount) {
  const accent = '#1c0d22';
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${baseDefs(accent)}
  <rect width="${W}" height="${H}" fill="url(#bg)" />
  <rect width="${W}" height="${H}" fill="url(#grid)" />
  <rect width="${W}" height="${H}" fill="url(#glow)" opacity="0.7" />
  <text x="90" y="200" font-family="DejaVu Sans, Helvetica, Arial, sans-serif" font-size="104" font-weight="700" fill="#ffffff" letter-spacing="-3">SVAZER</text>
  <text x="90" y="310" font-family="DejaVu Sans, Helvetica, Arial, sans-serif" font-size="104" font-weight="700" fill="#ffffff" letter-spacing="-3" opacity="0.62">THE GREAT</text>
  <rect x="90" y="360" width="72" height="3" fill="#ffffff" opacity="0.5" />
  <text x="90" y="430" font-family="DejaVu Sans, Helvetica, Arial, sans-serif" font-size="32" fill="#c9c9d6">${escapeXml(`Building ${projectCount} live products across ${domainCount} domains.`)}</text>
  <text x="90" y="${H - 60}" font-family="DejaVu Sans Mono, monospace" font-size="22" fill="#8d8da3" letter-spacing="2">svazer.us.ci</text>
  <text x="${W - 90}" y="${H - 60}" text-anchor="end" font-family="DejaVu Sans Mono, monospace" font-size="22" fill="#8d8da3" letter-spacing="2">${escapeXml(TAGLINE.toUpperCase())}</text>
</svg>`;
}

async function renderScreenshot(homepageImage) {
  if (!homepageImage) return null;
  const file = path.join(ROOT, 'public', homepageImage.replace(/^\//, ''));
  try {
    // Crop to the card ratio and dim it so the text stays readable.
    const buf = await sharp(file)
      .resize(W, H, { fit: 'cover', position: 'top' })
      .modulate({ brightness: 0.62, saturation: 0.85 })
      .png()
      .toBuffer();
    return `data:image/png;base64,${buf.toString('base64')}`;
  } catch (error) {
    console.warn(`  screenshot missing for ${homepageImage}: ${error.message}`);
    return null;
  }
}

async function writeCard(name, svg) {
  const out = path.join(OUT_DIR, `${name}.png`);
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
  return out;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const projects = await readProjects('src/pages/index.astro');
  const projectCount = projects.length;
  const domainCount = new Set(
    projects.map((p) => {
      try {
        return new URL(p.projectUrl).hostname;
      } catch {
        return null;
      }
    }).filter(Boolean)
  ).size;

  const written = [];

  written.push(await writeCard('default', siteCard(projectCount, domainCount)));

  for (const project of projects) {
    const slug = project.slug?.current;
    if (!slug) continue;
    const screenshotPath = await renderScreenshot(project.homepageImage);
    const svg = projectCard({ ...project, screenshotPath });
    written.push(await writeCard(slug, svg));
    process.stdout.write(`  og/${slug}.png\n`);
  }

  // GitHub actions / CI should not fail the build if a card cannot render.
  process.stdout.write(`rendered ${written.length} OG cards into public/og/\n`);
}

main().catch((error) => {
  console.error('OG card rendering failed:', error);
  process.exit(1);
});
