import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { pages, origin } from '../src/data/routes.js';

test('built routes have route-specific canonical/social metadata and indexing policy', () => {
  for (const [path, [, picture]] of Object.entries(pages)) {
    const html = readFileSync(`dist${path === '/' ? '/index.html' : path}`, 'utf8');
    assert.ok(html.includes(`rel="canonical" href="${origin}${path}"`), path);
    assert.ok(html.includes(`property="og:url" content="${origin}${path}"`), path);
    assert.ok(html.includes('name="twitter:card"'), path);
    assert.ok(existsSync(`public/img/${picture}.webp`), picture);
    assert.equal(html.includes('name="robots" content="noindex, nofollow"'), path === '/notes.html' || process.env.ALLOW_INDEXING !== 'true', path);
  }
  assert.match(readFileSync('dist/404.html', 'utf8'), /noindex, nofollow/);
});
