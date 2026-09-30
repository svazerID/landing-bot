import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sanity from '@sanity/astro';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [
    sanity({
      projectId: "gwlcf911",
      dataset: "production",
      useCdn: false,
      studioBasePath: '/studio',
      apiVersion: '2024-04-20'
    }),
    react()
  ],
  adapter: cloudflare()
});
