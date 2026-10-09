import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { enhancePlayground } from '../src/scripts/playground.js';
import { pages, indexablePaths } from '../src/data/routes.js';
import { site } from '../src/data/site.js';
import worker from '../worker/index.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url));
const page = read('src/pages/playground.astro').toString();
const receipt = JSON.parse(read('docs/playground-media.json'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

test('draft controls update artwork, clamp bounds, reset independently and restore page state', () => {
  // EventTarget exercises the actual listeners without introducing a DOM dependency.
  const elements = new Map();
  for (const selector of ['#colour-range', '#spacing-range', '[data-poster]', '[data-ink-toggle]', '[data-reveal]', '#colour-output', '#spacing-output', '[data-colour-reset]', '[data-type-reset]']) {
    const attributes = new Map();
    elements.set(selector, Object.assign(new EventTarget(), {
      dataset: {}, style: new Map(),
      setAttribute: (name, value) => attributes.set(name, value),
      getAttribute: name => attributes.get(name),
    }));
    elements.get(selector).style.setProperty = elements.get(selector).style.set;
  }
  const get = selector => elements.get(selector);
  const colour = get('#colour-range');
  const spacing = get('#spacing-range');
  Object.assign(colour, { min: '0', max: '100', value: '50' });
  Object.assign(spacing, { min: '-0.02', max: '0.12', value: '0.02' });
  const controls = [{ hidden: true }, { hidden: true }];
  const sync = enhancePlayground({ querySelector: get, querySelectorAll: () => controls });
  const fire = (selector, type = 'click') => get(selector).dispatchEvent(new Event(type));
  assert.ok(controls.every(control => !control.hidden));
  assert.equal(get('[data-reveal]').style.get('--reveal'), '50%');
  for (const [input, expected] of [['-5', '0%'], ['100', '100%'], ['150', '100%'], ['37', '37%']]) {
    colour.value = input; fire('#colour-range', 'input');
    assert.equal(get('[data-reveal]').style.get('--reveal'), expected);
    assert.equal(get('#colour-output').value, expected);
  }
  for (const [input, expected] of [['-1', '-0.02 em'], ['1', '0.12 em'], ['0.07', '0.07 em']]) {
    spacing.value = input; fire('#spacing-range', 'input');
    assert.equal(get('#spacing-output').value, expected);
  }
  fire('[data-ink-toggle]');
  assert.equal(get('[data-poster]').dataset.copper, 'true');
  assert.equal(get('[data-ink-toggle]').getAttribute('aria-pressed'), 'true');
  fire('[data-ink-toggle]');
  assert.equal(get('[data-poster]').dataset.copper, 'false');
  fire('[data-ink-toggle]');
  fire('[data-colour-reset]');
  assert.equal(colour.value, '50');
  assert.equal(spacing.value, '0.07');
  assert.equal(get('[data-poster]').dataset.copper, 'true');
  fire('[data-type-reset]');
  assert.equal(spacing.value, '0.02');
  assert.equal(get('[data-poster]').style.get('--spacing'), '0.02em');
  assert.equal(get('[data-poster]').dataset.copper, 'false');
  colour.value = '81'; spacing.value = '0.1'; sync();
  assert.equal(get('#colour-output').value, '81%');
  assert.equal(get('#spacing-output').value, '0.10 em');
  assert.match(page, /addEventListener\('pageshow', sync\)/);
});

test('draft has explicit metadata, stays outside navigation and sitemap with indexing enabled', async () => {
  const metadata = pages['/playground.html'];
  assert.equal(metadata.noindex, true);
  assert.match(metadata.title, /Playground.*Draft/);
  assert.notEqual(metadata.description, pages['/'].description);
  assert.equal(metadata.image, '/og/home-v2.jpg');
  assert.ok(!indexablePaths.includes('/playground.html'));
  assert.doesNotMatch(JSON.stringify([site.nav, site.all]), /playground|studio.projects/i);
  const env = { ALLOW_INDEXING: 'true', DEPLOY_SHA: 'a'.repeat(40), ASSETS: { fetch: async () => new Response('draft') } };
  const response = await worker.fetch(new Request('https://chukadele.com/playground.html'), env);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, nofollow');
  const sitemap = await worker.fetch(new Request('https://chukadele.com/sitemap.xml'), env);
  assert.doesNotMatch(await sitemap.text(), /playground/);
  assert.match(read('src/layouts/Base.astro').toString(), /metadata\?\.noindex/);
  assert.match(page, /<Base noindex>/);
});

test('approved distinct motion and unchanged JPEG posters match their receipts', async () => {
  const sourceHashes = ['024e1d2b2315daa06ef90c8ec7343ce29e2fe8db74053019bac6be4cff503154', 'afc7eedbcab9d087d17cfa8585c46afc744c23821561871547235a7fe3bac1da'];
  const deliveryHashes = ['39f86fbc1060c5bacec08a89fc2710b4bb947fe83319c02c47305fa41a9690c0', sourceHashes[1]];
  const caseMedia = read('docs/curated-media.json').toString();
  assert.equal(receipt.length, 2);
  assert.equal(readdirSync('public/playground').length, 4);
  for (const [i, m] of receipt.entries()) {
    assert.equal(m.status, 'OWNER_APPROVED_FOR_PLAYGROUND_DRAFT_ONLY');
    assert.equal(m.sourceSha256, sourceHashes[i]);
    assert.equal(m.deliverySha256, deliveryHashes[i]);
    for (const [path, sha, bytes] of [[m.delivery, m.deliverySha256, m.deliveryBytes], [m.poster, m.posterSha256, m.posterBytes]]) {
      const data = read(`public${path}`);
      assert.equal(data.length, bytes);
      assert.equal(hash(data), sha);
    }
    assert.equal(m.sourceDurationSeconds, m.deliveryDurationSeconds);
    assert.equal(m.deliveryDurationSeconds, i === 0 ? 4.041667 : 10);
    const poster = await sharp(read(`public${m.poster}`)).metadata();
    assert.equal(poster.format, 'jpeg');
    assert.ok(Math.abs(poster.width / poster.height - m.width / m.height) < .01);
    assert.ok(!caseMedia.includes(m.slug));
  }
});

test('four studies use accessible defaults, existing artwork and the shared video lifecycle', () => {
  assert.equal((page.match(/<section /g) || []).length, 4);
  assert.equal((page.match(/Draft interaction study/g) || []).length, 2);
  assert.equal((page.match(/Studio motion/g) || []).length, 2);
  assert.equal((page.match(/<video controls playsinline muted preload="none" width=/g) || []).length, 2);
  assert.doesNotMatch(page, /\bloop\b|\bautoplay\b|object-fit:cover/);
  assert.match(page, /name="jerome-mono"/);
  assert.match(page, /name="jerome-tint"/);
  assert.match(page, /Dürer.*1514.*Colour added/);
  assert.equal((page.match(/data-controls hidden/g) || []).length, 2);
  assert.match(page, /--reveal:50%/);
  assert.match(page, /prefers-reduced-motion:reduce/);
  assert.doesNotMatch(read('src/scripts/playground.js').toString(), /\.play\(|\.pause\(|keydown|preventDefault|requestAnimationFrame/);
  assert.match(read('src/scripts/site.js').toString(), /const videos = \$\$\('video'\)/);
});
