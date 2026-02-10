// @ts-check
import { defineConfig } from 'astro/config';
import process from 'node:process';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
    site: process.env.PUBLIC_SITE_URL || 'http://localhost:4321',
    integrations: [react(), mdx(), sitemap()],
    markdown: {
        shikiConfig: {
            theme: 'github-dark',
        },
    },
});
