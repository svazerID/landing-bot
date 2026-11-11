// Site origin used to build canonical and Open Graph URLs.
//
// Astro.url cannot be trusted for this: on Cloudflare the request URL is the
// internal worker address, not svazer.us.ci. Keeping the canonical origin here
// means og:url and <link rel="canonical"> always point at the public domain.
export const SITE = 'https://svazer.us.ci';
export const SITE_NAME = 'Svazer The Great';
export const SITE_TAGLINE = 'Digital Ecosystem';
