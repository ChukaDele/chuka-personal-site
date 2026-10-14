import { defineConfig } from '@playwright/test';

const qaPort = Number(process.env.QA_PORT || 8799);
const qaOrigin = `http://127.0.0.1:${qaPort}`;

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 1,
  timeout: 45_000,
  expect: { timeout: 8_000 },
  outputDir: 'test-results/site-quality',
  reporter: [
    ['line'],
    ['json', { outputFile: 'test-results/site-quality/results.json' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: qaOrigin,
    browserName: 'chromium',
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run qa:preview',
    url: `${qaOrigin}/`,
    reuseExistingServer: false,
    timeout: 120_000,
    stdout: 'ignore',
    stderr: 'ignore',
  },
  projects: [
    { name: 'desktop-1440x900', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile-390x844', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: 'short-desktop-1280x720', use: { viewport: { width: 1280, height: 720 } } },
  ],
});
