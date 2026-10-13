import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: 'lenis-browser.spec.mjs',
  timeout: 30_000,
  expect: { timeout: 12_000 },
  retries: 1,
  reporter: 'line',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'webkit-desktop', use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4321',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: false,
    timeout: 90_000,
  },
});
