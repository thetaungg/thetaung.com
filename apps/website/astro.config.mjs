// @ts-check
import { defineConfig } from 'astro/config';
import process from 'node:process';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import svgr from 'vite-plugin-svgr';

// https://astro.build/config
export default defineConfig({
    site: process.env.PUBLIC_SITE_URL || 'http://localhost:4321',
    integrations: [react(), mdx(), sitemap()],
    vite: {
        plugins: [svgr()],
    },
    markdown: {
        shikiConfig: {
            theme: 'github-dark',
        },
    },
    build: {
        // Inline all CSS into the HTML so no render-blocking stylesheet requests are needed.
        inlineStylesheets: 'always',
    },
});
