// @ts-check
import { defineConfig } from 'astro/config';

import sanity from '@sanity/astro';
import react from '@astrojs/react';

import vercel from '@astrojs/vercel';

// https://astro.build/config
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

  adapter: vercel()
});