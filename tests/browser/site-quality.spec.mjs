import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { execFileSync } from 'node:child_process';
import { pages, origin, indexablePaths } from '../../src/data/routes.js';
import { site } from '../../src/data/site.js';

const deploySha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const desktopProject = 'desktop-1440x900';

function watchRuntime(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  return errors;
}

async function expectNoHorizontalOverflow(page, path) {
  const geometry = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(geometry.document, `${path}: document overflow ${JSON.stringify(geometry)}`).toBeLessThanOrEqual(geometry.viewport + 1);
  expect(geometry.body, `${path}: body overflow ${JSON.stringify(geometry)}`).toBeLessThanOrEqual(geometry.viewport + 1);
}

test.describe('Worker-aware route matrix', () => {
  for (const [path, metadata] of Object.entries(pages)) {
    test(`${path} has canonical metadata, provenance and bounded layout`, async ({ page }) => {
      const runtimeErrors = watchRuntime(page);
      const response = await page.goto(path, { waitUntil: 'load' });
      expect(response?.status()).toBe(200);
      expect(response?.headers()['x-deploy-sha']).toBe(deploySha);
      expect(response?.headers()['x-robots-tag']).toBe('noindex, nofollow');
      await expect(page).toHaveTitle(metadata.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', metadata.description);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${origin}${path}`);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `${origin}${path}`);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `${origin}${metadata.image}`);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
      await expectNoHorizontalOverflow(page, path);
      await page.evaluate(async () => {
        const pause = () => new Promise(resolve => setTimeout(resolve, 20));
        for (let top = 0; top < document.documentElement.scrollHeight; top += Math.max(innerHeight * 0.8, 320)) {
          scrollTo(0, top);
          await pause();
        }
        scrollTo(0, document.documentElement.scrollHeight);
        await pause();
      });
      await expectNoHorizontalOverflow(page, `${path} after scroll`);
      await page.waitForTimeout(100);
      expect(runtimeErrors, `${path}: browser runtime errors`).toEqual([]);
    });
  }
});

test('key internal links and keyboard focus work', async ({ page }, testInfo) => {
  const runtimeErrors = watchRuntime(page);
  await page.goto('/', { waitUntil: 'load' });
  const hrefs = await page.locator('header a, footer a').evaluateAll(links => [...new Set(links
    .map(link => link.getAttribute('href'))
    .filter(href => href && !href.startsWith('http') && !href.startsWith('mailto:')))]);
  for (const href of hrefs) {
    const response = await page.request.get(new URL(href, page.url()).href);
    expect(response.ok(), `${href}: HTTP ${response.status()}`).toBeTruthy();
  }

  await page.locator('body').click({ position: { x: 2, y: 2 } });
  await page.keyboard.press('Tab');
  await expect(page.locator('a.name')).toBeFocused();
  const focus = await page.locator('a.name').evaluate(element => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return { outline: style.outlineStyle, width: Number.parseFloat(style.outlineWidth), visible: rect.width > 0 && rect.height > 0 };
  });
  expect(focus.visible).toBeTruthy();
  expect(focus.outline).not.toBe('none');
  expect(focus.width).toBeGreaterThanOrEqual(2);

  if (testInfo.project.name === 'mobile-390x844') {
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Menu' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: 'Close' })).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Tab');
    const work = page.getByRole('navigation', { name: 'Site' }).getByRole('link', { name: 'Work' });
    await expect(work).toBeFocused();
    await Promise.all([
      page.waitForURL(/\/work\.html$/, { waitUntil: 'load' }),
      page.keyboard.press('Enter'),
    ]);
  } else {
    const work = page.getByRole('navigation', { name: 'Site' }).getByRole('link', { name: 'Work' });
    await work.focus();
    await Promise.all([
      page.waitForURL(/\/work\.html$/, { waitUntil: 'load' }),
      page.keyboard.press('Enter'),
    ]);
  }
  await expect(page).toHaveURL(/\/work\.html$/);
  const caseLink = page.locator('main a[href="work-etap.html"]').first();
  await caseLink.focus();
  await expect(caseLink).toBeFocused();
  await Promise.all([
    page.waitForURL(/\/work-etap\.html$/, { waitUntil: 'load' }),
    page.keyboard.press('Enter'),
  ]);
  await expect(page).toHaveURL(/\/work-etap\.html$/);
  expect(runtimeErrors).toEqual([]);
});

test('404 has real status and keyboard-operable recovery', async ({ page }) => {
  const response = await page.goto('/missing-from-quality-gate', { waitUntil: 'load' });
  expect(response?.status()).toBe(404);
  expect(response?.headers()['x-robots-tag']).toBe('noindex, nofollow');
  const recovery = page.getByRole('link', { name: 'Return home' });
  await recovery.focus();
  await expect(recovery).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/$/);
});

test('reduced motion is honoured by CSS and video playback', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work-honeycoin.html', { waitUntil: 'load' });
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBeTruthy();
  const motion = await page.locator('.arr').first().evaluate(element => {
    const style = getComputedStyle(element);
    return { animation: style.animationName, transitionMs: Number.parseFloat(style.transitionDuration) * 1000 };
  });
  expect(motion.animation).toBe('none');
  expect(motion.transitionMs).toBeLessThanOrEqual(1);
  const videos = page.locator('video');
  for (let index = 0; index < await videos.count(); index += 1) {
    expect(await videos.nth(index).evaluate(video => video.paused && video.muted)).toBeTruthy();
  }
});

test('primary contact resolves to a valid mailto and real clipboard copy', async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name !== desktopProject, 'One real browser execution is sufficient for the shared contact implementation.');
  await page.goto('/', { waitUntil: 'load' });
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: new URL(page.url()).origin });
  const mail = page.locator('a.mail').first();
  const href = await mail.getAttribute('href');
  expect(href).toBe(`mailto:${site.email}`);
  expect(new URL(href).pathname).toBe(site.email);

  const trigger = page.getByRole('button', { name: 'Just saying hello' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Dear Chuka,' });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel('What is on your mind').fill('A browser quality check.');
  await dialog.getByLabel('Signed').fill('QA Visitor');
  await dialog.getByLabel('Where I should reply').fill('qa@example.com');
  await dialog.getByRole('button', { name: /copy the letter/i }).click();
  await expect(dialog.getByRole('button', { name: new RegExp(`copied.*${site.email}`) })).toBeVisible();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('Dear Chuka,');
  expect(copied).toContain('A browser quality check.');
  expect(copied).toContain('QA Visitor');
  expect(copied).toContain('qa@example.com');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('serious and critical axe findings are absent on representative routes', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'short-desktop-1280x720', 'Desktop and mobile axe runs cover the same document semantics.');
  for (const path of ['/', '/work.html', '/library.html']) {
    await page.goto(path, { waitUntil: 'load' });
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const serious = results.violations.filter(item => ['serious', 'critical'].includes(item.impact));
    expect(serious, `${path}: ${serious.map(item => `${item.id} (${item.nodes.length})`).join(', ')}`).toEqual([]);
  }
});

test('robots, sitemap and OG assets are served through the Worker', async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== desktopProject, 'Network contracts are viewport-independent.');
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(robots.headers()['x-deploy-sha']).toBe(deploySha);
  expect(await robots.text()).toMatch(/Disallow:\s*\//);

  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).not.toContain('<loc>');

  for (const path of indexablePaths) expect(pages[path]).toBeTruthy();
  for (const image of new Set(Object.values(pages).map(page => page.image))) {
    const response = await request.get(image);
    expect(response.status(), image).toBe(200);
    expect(response.headers()['content-type'], image).toMatch(/^image\/jpeg/);
    expect(response.headers()['x-deploy-sha'], image).toBe(deploySha);
  }
});
