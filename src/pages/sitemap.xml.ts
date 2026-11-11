import type { APIRoute } from 'astro';
import { sanityClient } from '../utils/sanity';

export const prerender = false;

const SITE = 'https://svazer.us.ci';

// Project slugs are read from the same static list the homepage uses, so the
// sitemap cannot drift when a project is added or renamed.
const PROJECT_SLUGS = [
  'alsya-api',
  'svazer-cdn',
  'svazer-ai',
  'media-downloader-api',
  'svazer-playlist',
  'zerdonghua',
  'zeranime',
  'zermovie',
  'zerdrakor',
  'gtwbot',
  'takina',
  'zerpaste',
  'svazer-prd',
  'semantika',
];

const STATIC_PATHS = ['', '/logbook', '/resume'];

type Entry = { loc: string; lastmod?: string; changefreq?: string; priority?: string };

function xml(entries: Entry[]) {
  const urls = entries
    .map((e) => {
      const parts = [`    <loc>${SITE}${e.loc}</loc>`];
      if (e.lastmod) parts.push(`    <lastmod>${e.lastmod}</lastmod>`);
      if (e.changefreq) parts.push(`    <changefreq>${e.changefreq}</changefreq>`);
      if (e.priority) parts.push(`    <priority>${e.priority}</priority>`);
      return `  <url>\n${parts.join('\n')}\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export const GET: APIRoute = async () => {
  const entries: Entry[] = [
    { loc: '', changefreq: 'weekly', priority: '1.0' },
    { loc: '/logbook', changefreq: 'weekly', priority: '0.8' },
    { loc: '/resume', changefreq: 'monthly', priority: '0.7' },
    { loc: '/gallery', changefreq: 'monthly', priority: '0.7' },
  ];

  for (const slug of PROJECT_SLUGS) {
    entries.push({ loc: `/projects/${slug}`, changefreq: 'monthly', priority: '0.6' });
  }

  // Logbook entries come from Sanity. If the API is unreachable the catch keeps
  // the sitemap valid rather than returning a 500, so search engines still get
  // every static URL.
  try {
    const posts: { slug?: { current?: string }; publishedAt?: string }[] =
      await sanityClient.fetch(
        `*[_type == "logbookEntry" && defined(slug.current)] | order(publishedAt desc) {slug, publishedAt}`
      );

    for (const post of posts) {
      const slug = post.slug?.current;
      if (!slug) continue;
      entries.push({
        loc: `/logbook/${slug}`,
        lastmod: post.publishedAt ? post.publishedAt.slice(0, 10) : undefined,
        changefreq: 'yearly',
        priority: '0.5',
      });
    }
  } catch (error) {
    console.error('sitemap: failed to load logbook entries from Sanity', error);
  }

  return new Response(xml(entries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
