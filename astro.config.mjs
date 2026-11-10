import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({ output: 'static', integrations: [react()], devToolbar: { enabled: false }, vite: { cacheDir: 'node_modules/.vite-astro' } });
