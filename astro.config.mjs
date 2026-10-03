import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://chukadele.com',
  build: { assets: 'assets', format: 'file', inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
  vite: { build: { sourcemap: false } },
});
