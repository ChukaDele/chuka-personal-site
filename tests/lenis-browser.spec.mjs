import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Bypass the optional first-visit introduction for deterministic interaction QA.
  await page.addInitScript(() => sessionStorage.setItem('seen', '1'));
});

const pilotState = (page) => page.evaluate(() => document.documentElement.dataset.scrollPilot || '');

test('normal visits keep native document scrolling', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => pilotState(page)).toBe('');
  await page.mouse.wheel(0, 900);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(50);
});

test('explicit desktop opt-in initializes and scrolls correctly', async ({ page }) => {
  await page.goto('/?lenis-preview=1', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => pilotState(page)).toBe('lenis-preview');
  await page.mouse.wheel(0, 900);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(50);

  await page.evaluate(() => {
    const anchor = document.createElement('a');
    // <base href="/"> makes a bare fragment discard the opt-in query.
    anchor.href = location.pathname + location.search + '#work';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  });
  await expect.poll(() => page.evaluate(() => location.hash)).toBe('#work');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
});

test('opening and closing the contact dialog retains usable scrolling', async ({ page }) => {
  await page.goto('/?lenis-preview=1', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => pilotState(page)).toBe('lenis-preview');
  // Desktop menu-letter is intentionally hidden; use the visible hero CTA.
  await page.locator('#top button[data-letter="hello"]').click();
  await expect(page.locator('#letter')).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(page.locator('#letter')).not.toHaveAttribute('open', '');
  await page.mouse.wheel(0, 900);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(50);
});

test('reduced-motion preference prevents opt-in and tears down live', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?lenis-preview=1', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => pilotState(page)).toBe('');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect.poll(() => pilotState(page)).toBe('lenis-preview');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => pilotState(page)).toBe('');
});

test('narrow viewports never smooth scrolling and resize destroys active pilot', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?lenis-preview=1', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => pilotState(page)).toBe('');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect.poll(() => pilotState(page)).toBe('lenis-preview');
  await page.setViewportSize({ width: 1000, height: 900 });
  await expect.poll(() => pilotState(page)).toBe('');
});
