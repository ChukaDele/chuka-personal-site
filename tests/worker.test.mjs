import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import worker from '../worker/index.mjs';
import { redirects } from '../src/data/routes.js';

const sha = 'a'.repeat(40);
const seen = [];
const env = {
  DEPLOY_SHA: sha,
  ALLOW_INDEXING: 'true',
  ASSETS: { async fetch(request) {
    const path = new URL(request.url).pathname;
    seen.push(path);
    if (path === '/missing' || path === '/missing.html') return new Response('Missing', { status: 404 });
    return new Response(request.method === 'HEAD' ? null : path === '/404.html' ? 'Page not found' : path, { headers: { 'Content-Type': path.endsWith('.html') ? 'text/html' : 'application/octet-stream', 'Cache-Control': 'public, max-age=31536000, immutable' } });
  } },
};
const fetch = (path, overrides = {}, init = {}) => worker.fetch(new Request(`https://chukadele.com${path}`, init), { ...env, ...overrides });

test('every legacy route redirects directly with query and provenance', async () => {
  for (const [from, to] of Object.entries(redirects)) {
    for (const suffix of ['', '/']) {
      const response = await fetch(`${from}${suffix}?ref=test`);
      assert.equal(response.status, 308, from);
      assert.equal(response.headers.get('Location'), `${to}?ref=test`);
      assert.equal(response.headers.get('X-Deploy-SHA'), sha);
    }
  }
});
test('root maps to index; .html URLs stay files; immutable asset cache survives', async () => {
  seen.length = 0;
  const root = await fetch('/');
  assert.equal(await root.text(), '/index.html');
  assert.match(root.headers.get('Cache-Control'), /must-revalidate/);
  const page = await fetch('/about.html');
  assert.equal(page.status, 200);
  assert.equal(await page.text(), '/about.html');
  const asset = await fetch('/assets/app.js');
  assert.match(asset.headers.get('Cache-Control'), /immutable/);
  assert.equal(asset.headers.get('X-Deploy-SHA'), sha);
});
test('indexing requires canonical HTTPS origin and explicit runtime promotion', async () => {
  for (const host of ['https://preview.workers.dev', 'http://chukadele.com', 'https://www.chukadele.com', 'https://chukadele.com:444']) {
    const response = await worker.fetch(new Request(`${host}/about.html`), env);
    assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, nofollow');
  }
  assert.equal((await fetch('/about.html')).headers.get('X-Robots-Tag'), null);
  assert.equal((await fetch('/about.html', { ALLOW_INDEXING: 'false' })).headers.get('X-Robots-Tag'), 'noindex, nofollow');
  assert.equal((await fetch('/notes.html')).headers.get('X-Robots-Tag'), 'noindex, nofollow');
  assert.match(await (await fetch('/robots.txt', { ALLOW_INDEXING: 'false' })).text(), /Disallow: \//);
  assert.doesNotMatch(await (await fetch('/sitemap.xml', { ALLOW_INDEXING: 'false' })).text(), /<loc>/);
  const sitemap = await (await fetch('/sitemap.xml')).text();
  assert.match(sitemap, /https:\/\/chukadele.com\/work-etap.html/);
  assert.doesNotMatch(sitemap, /notes|404/);
});
test('404, HEAD, rejected methods and errors retain security and provenance', async () => {
  const missing = await fetch('/missing');
  assert.equal(missing.status, 404);
  assert.equal((await fetch('/404.html')).status, 404);
  assert.equal(await missing.text(), 'Page not found');
  assert.equal((await fetch('/about.html', {}, { method: 'HEAD' })).body, null);
  const method = await fetch('/', {}, { method: 'POST' });
  assert.equal(method.status, 405);
  const error = await fetch('/', { ASSETS: { fetch() { throw new Error('Unavailable'); } } });
  assert.equal(error.status, 503);
  for (const response of [missing, method, error]) {
    assert.equal(response.headers.get('X-Deploy-SHA'), sha);
    assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, nofollow');
    assert.equal(response.headers.get('X-Frame-Options'), 'DENY');
    assert.equal(response.headers.get('Content-Security-Policy'), "frame-ancestors 'none'");
    assert.equal(response.headers.get('Strict-Transport-Security'), 'max-age=31536000; includeSubDomains');
    assert.equal(response.headers.get('Permissions-Policy'), 'camera=(), microphone=(), geolocation=()');
    assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
    assert.equal(response.headers.get('Referrer-Policy'), 'strict-origin-when-cross-origin');
  }
});
test('missing or abbreviated provenance fails closed', async () => {
  for (const DEPLOY_SHA of [undefined, '', 'abcdef0']) assert.equal((await fetch('/', { DEPLOY_SHA })).status, 503);
});
test('Cloudflare routes assets through wrapper without URL normalization or SPA fallback', () => {
  const config = JSON.parse(readFileSync(new URL('../wrangler.jsonc', import.meta.url)));
  assert.equal(config.assets.run_worker_first, true);
  assert.equal(config.assets.html_handling, 'none');
  assert.equal(config.assets.not_found_handling, 'none');
});
