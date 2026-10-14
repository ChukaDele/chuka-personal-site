import { pages, origin, indexablePaths } from '../src/data/routes.js';
import { pathToFileURL } from 'node:url';

const SHA = /^[0-9a-f]{40}$/;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

export function assertDeploySha(headers, expectedSha, path = '/') {
  const actual = headers.get('x-deploy-sha');
  assert(actual === expectedSha, `${path}: X-Deploy-SHA ${actual || '<missing>'} does not equal ${expectedSha}`);
}

function decodeHtml(value) {
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (_match, entity) => {
    if (entity[0] === '#') {
      return String.fromCodePoint(entity[1].toLowerCase() === 'x' ? Number.parseInt(entity.slice(2), 16) : Number(entity.slice(1)));
    }
    return { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' }[entity.toLowerCase()];
  });
}

function one(html, pattern, label) {
  const matches = [...html.matchAll(pattern)];
  assert(matches.length === 1, `expected one ${label}, found ${matches.length}`);
  return decodeHtml(matches[0][1]);
}

async function get(url, expectedSha, expectedStatus = 200) {
  let response;
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(20_000) });
      break;
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 250));
    }
  }
  if (!response) throw new Error(`${url.href}: fetch failed: ${lastError?.cause?.message || lastError?.message || 'unknown transport error'}`);
  assert(response.status === expectedStatus, `${url.pathname}: expected HTTP ${expectedStatus}, got ${response.status}`);
  assertDeploySha(response.headers, expectedSha, url.pathname);
  return response;
}

async function runSmoke({ expectedSha }) {
  assert(SHA.test(expectedSha), 'Supply an explicit lowercase 40-character release SHA with --sha.');
  const base = new URL(origin);
  const checked = [];

  for (const [path, metadata] of Object.entries(pages)) {
    const response = await get(new URL(path, base), expectedSha);
    assert((response.headers.get('content-type') || '').includes('text/html'), `${path}: expected HTML content type`);
    for (const header of ['strict-transport-security', 'content-security-policy', 'x-content-type-options', 'referrer-policy']) {
      assert(response.headers.has(header), `${path}: missing ${header}`);
    }
    const html = await response.text();
    assert(one(html, /<title>([\s\S]*?)<\/title>/g, `${path} title`) === metadata.title, `${path}: wrong title`);
    assert(one(html, /<meta name="description" content="([^"]+)"/g, `${path} description`) === metadata.description, `${path}: wrong description`);
    assert(one(html, /<link rel="canonical" href="([^"]+)"/g, `${path} canonical`) === `${origin}${path}`, `${path}: wrong canonical`);
    assert(one(html, /<meta property="og:url" content="([^"]+)"/g, `${path} og:url`) === `${origin}${path}`, `${path}: wrong og:url`);
    const ogImage = one(html, /<meta property="og:image" content="([^"]+)"/g, `${path} og:image`);
    assert(ogImage === `${origin}${metadata.image}`, `${path}: wrong og:image`);
    checked.push(path);
  }

  for (const image of new Set(Object.values(pages).map(page => page.image))) {
    const response = await get(new URL(image, base), expectedSha);
    assert((response.headers.get('content-type') || '').startsWith('image/jpeg'), `${image}: expected JPEG content type`);
  }

  const robots = await get(new URL('/robots.txt', base), expectedSha);
  const robotsBody = await robots.text();
  assert(/User-agent:\s*\*/i.test(robotsBody) && /Allow:\s*\//i.test(robotsBody), 'robots.txt does not allow canonical crawling');
  assert(robotsBody.includes(`${origin}/sitemap.xml`), 'robots.txt does not name the canonical sitemap');

  const sitemap = await get(new URL('/sitemap.xml', base), expectedSha);
  assert((sitemap.headers.get('content-type') || '').includes('application/xml'), 'sitemap has wrong content type');
  const sitemapBody = await sitemap.text();
  for (const path of indexablePaths) assert(sitemapBody.includes(`<loc>${origin}${path}</loc>`), `sitemap missing ${path}`);
  assert(!sitemapBody.includes('/notes.html') && !sitemapBody.includes('/404.html'), 'sitemap includes a noindex route');

  const missingPath = `/qa-smoke-missing-${expectedSha.slice(0, 12)}`;
  const missing = await get(new URL(missingPath, base), expectedSha, 404);
  assert(missing.headers.get('x-robots-tag') === 'noindex, nofollow', '404 response is indexable');
  assert(/href="\/"[^>]*>Return home<\/a>/.test(await missing.text()), '404 recovery link is missing');

  const redirect = await get(new URL('/index.html', base), expectedSha, 308);
  assert(redirect.headers.get('location') === '/', '/index.html does not redirect to /');

  return {
    status: 'LIVE_SHA_SMOKE_PASS',
    base_url: base.href,
    release_sha: expectedSha,
    checked_html_routes: checked.length,
    checked_og_assets: new Set(Object.values(pages).map(page => page.image)).size,
    owner_acceptance: 'NOT_TESTED',
    wcag_certification: 'NOT_CLAIMED',
    deployment_protection: 'NOT_TESTED',
  };
}

function parseArgs(args) {
  const value = flag => {
    const at = args.indexOf(flag);
    return at === -1 ? undefined : args[at + 1];
  };
  return { expectedSha: value('--sha') };
}

async function main() {
  const input = parseArgs(process.argv.slice(2));
  try {
    const report = await runSmoke(input);
    console.log(JSON.stringify(report, null, 2));
  } catch (error) {
    console.error(JSON.stringify({
      status: 'LIVE_SHA_SMOKE_FAIL',
      release_sha: input.expectedSha || '<missing>',
      error: error.message,
      owner_acceptance: 'NOT_TESTED',
      deployment_protection: 'NOT_TESTED',
    }, null, 2));
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
