import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://chukadele.com',
  build: { assets: 'assets', format: 'file', inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
  // Opt-in local/preview fixture: no route or fixture import in a plain build.
  integrations: process.env.UI_STRESS_QA === 'true' ? [{
    name: 'mobile-stress-preview',
    hooks: {
      'astro:config:setup': ({ injectRoute }) => injectRoute({
        pattern: '/__qa/mobile/[state]',
        entrypoint: './src/qa/mobile.astro',
      }),
    },
  }] : [],
  vite: { build: { sourcemap: false } },
});
