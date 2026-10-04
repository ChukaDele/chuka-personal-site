import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { pages, origin, indexablePaths, serializeJsonLd, structuredData } from '../src/data/routes.js';
import { site } from '../src/data/site.js';

const decode = value => value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (_, entity) => {
  if (entity[0] === '#') return String.fromCodePoint(entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1)));
  return { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' }[entity.toLowerCase()];
});
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key, decode(value)]));
const elements = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, 'g'))].map(([value]) => attributes(value));
function meta(html, key) {
  const matches = elements(html, 'meta').filter(item => item.name === key || item.property === key);
  assert.equal(matches.length, 1, `exactly one ${key}`);
  return matches[0].content;
}
const head = html => html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/)[1];

test('source metadata preserves the approved identity and accurate route distinctions', () => {
  assert.equal(Object.keys(pages).length, 13);
  assert.equal(pages['/'].image, '/og/home-v2.jpg');
  assert.equal(pages['/'].card.picture, 'p-speaking');
  assert.match(pages['/'].imageAlt, /smiling in a light grey suit, in natural colour/);
  assert.ok(existsSync('public/og/home-v1.jpg'), 'preserve the previously shared homepage card');
  assert.equal(pages['/'].title, 'Chuka Dele-Oyeleru | Strategy & Operations');
  assert.equal(pages['/'].description, 'Strategy and operations, based in Manchester. I diagnose problems, design how work should run, and build what it needs. Explore my work.');
  for (const property of ['title', 'description', 'image', 'imageAlt']) {
    assert.equal(new Set(Object.values(pages).map(page => page[property])).size, 13, `unique ${property}`);
  }
  assert.match(pages['/library.html'].description, /Books, essays, talks and listening/);
  assert.doesNotMatch(pages['/library.html'].description, /films/i);
  const contributions = {
    etap: /enterprise channel.*claims handoffs.*Ghana/,
    idara: /led.*product and service team.*rebuild/,
    'surface-talent': /MBA internship.*built the operating foundation/,
    honeycoin: /led delivery.*peer app redesign and business platform/,
    rvysion: /co-founder.*designed commercial and operating systems/,
    'the-bredge': /building.*operating model.*offer, service architecture and go-to-market/,
  };
  for (const [id, contribution] of Object.entries(contributions)) {
    const page = pages[`/work-${id}.html`];
    assert.match(page.description, contribution);
    assert.ok(page.title.includes(page.card.heading), id);
    assert.doesNotMatch(`${page.title} ${page.description} ${page.card.lines.join(' ')}`, /\d|%|×/);
  }
  for (const page of Object.values(pages)) assert.ok(page.title.includes(site.name));
  assert.equal(indexablePaths.length, 12);
  assert.ok(!indexablePaths.includes('/notes.html'));
});

test('source JSON-LD safely round-trips closing scripts and HTML-significant characters', () => {
  const hostile = '</script><script>alert("test")</script>&<>\u2028\u2029';
  const graph = structuredData('/about.html', { ...site, name: hostile });
  graph['@graph'][2].description = hostile;
  const serialized = serializeJsonLd(graph);
  assert.doesNotMatch(serialized, /[<>&\u2028\u2029]/);
  assert.deepEqual(JSON.parse(serialized), graph);
  assert.equal(structuredData('/404.html', site), null);
});

test('source social assets are distinct, small, decodable JPEGs at the declared size', async () => {
  const hashes = new Set();
  for (const page of Object.values(pages)) {
    const bytes = readFileSync(`public${page.image}`);
    assert.equal(bytes.readUInt16BE(0), 0xffd8);
    const actual = await sharp(bytes).metadata();
    assert.equal(actual.format, 'jpeg');
    assert.equal(page.imageType, 'image/jpeg');
    assert.equal(actual.width, 1200);
    assert.equal(actual.height, 630);
    assert.equal(actual.width, page.imageWidth);
    assert.equal(actual.height, page.imageHeight);
    assert.ok(bytes.length < 150_000, `${page.image}: ${bytes.length} bytes`);
    await sharp(bytes).raw().toBuffer(); // Decode pixels, not just the file header.
    assert.ok(existsSync(`public/img/${page.card.picture}.webp`));
    hashes.add(createHash('sha256').update(bytes).digest('hex'));
  }
  assert.equal(hashes.size, 13);
});

test('source icons include vector, PNG sizes, and real multi-size ICO bitmaps', async () => {
  const svg = readFileSync('public/favicon.svg', 'utf8');
  assert.match(svg, /viewBox="0 0 64 64"/);
  assert.match(svg, /#1b1917/);
  assert.match(svg, /#f0ab88/);
  for (const size of [32, 48, 192, 512, 180]) {
    const file = size === 180 ? 'apple-touch-icon.png' : `favicon-${size}.png`;
    const actual = await sharp(`public/${file}`).metadata();
    assert.equal(actual.format, 'png');
    assert.equal(actual.width, size);
    assert.equal(actual.height, size);
    const pixels = await sharp(`public/${file}`).raw().toBuffer();
    assert.ok(new Set(pixels).size > 10, `${file} is not blank`);
  }
  const ico = readFileSync('public/favicon.ico');
  assert.equal(ico.readUInt16LE(0), 0);
  assert.equal(ico.readUInt16LE(2), 1);
  assert.equal(ico.readUInt16LE(4), 3);
  let end = 54;
  [16, 32, 48].forEach((size, i) => {
    const entry = 6 + i * 16;
    assert.equal(ico[entry], size);
    assert.equal(ico[entry + 1], size);
    assert.equal(ico.readUInt16LE(entry + 6), 32);
    const length = ico.readUInt32LE(entry + 8), offset = ico.readUInt32LE(entry + 12);
    assert.equal(offset, end);
    assert.equal(ico.readUInt32LE(offset), 40);
    assert.equal(ico.readInt32LE(offset + 4), size);
    assert.equal(ico.readInt32LE(offset + 8), size * 2);
    assert.equal(length, 40 + size * size * 4 + Math.ceil(size / 32) * 4 * size);
    end = offset + length;
  });
  assert.equal(end, ico.length);
});

// Controller runs once against a preview build, then against ALLOW_INDEXING=true.
// Deliberately do not launch a build, browser, network request or server here.
test(`rendered metadata, JSON-LD and indexing (${process.env.ALLOW_INDEXING === 'true' ? 'production' : 'preview'})`, () => {
  for (const [path, page] of Object.entries(pages)) {
    const html = head(readFileSync(`dist${path === '/' ? '/index.html' : path}`, 'utf8'));
    const titles = [...html.matchAll(/<title>([\s\S]*?)<\/title>/g)];
    assert.equal(titles.length, 1, path);
    assert.equal(decode(titles[0][1]), page.title, path);
    const expected = {
      description: page.description, 'og:type': 'website', 'og:site_name': site.name,
      'og:locale': 'en_GB', 'og:title': page.title, 'og:description': page.description,
      'og:url': `${origin}${path}`, 'og:image': `${origin}${page.image}`,
      'og:image:type': page.imageType, 'og:image:width': '1200', 'og:image:height': '630',
      'og:image:alt': page.imageAlt, 'twitter:card': 'summary_large_image',
      'twitter:title': page.title, 'twitter:description': page.description,
      'twitter:image': `${origin}${page.image}`, 'twitter:image:alt': page.imageAlt,
    };
    for (const [key, value] of Object.entries(expected)) assert.equal(meta(html, key), value, `${path}: ${key}`);
    const links = elements(html, 'link');
    assert.deepEqual(links.filter(link => link.rel === 'canonical').map(link => link.href), [`${origin}${path}`]);
    assert.doesNotMatch(html, /name="twitter:(?:site|creator)"/);
    const robots = elements(html, 'meta').filter(item => item.name === 'robots');
    assert.deepEqual(robots.map(item => item.content), path === '/notes.html' || process.env.ALLOW_INDEXING !== 'true' ? ['noindex, nofollow'] : [], path);
    const scripts = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
    assert.equal(scripts.length, 1, path);
    assert.doesNotMatch(scripts[0][1], /[<>&\u2028\u2029]/);
    const graph = JSON.parse(scripts[0][1]);
    assert.deepEqual(graph, structuredData(path, site), path);
    const [person, website, webpage] = graph['@graph'];
    assert.equal(person.name, site.name);
    assert.equal(person.jobTitle, 'Strategy & Operations');
    assert.deepEqual(person.sameAs, [site.linkedin]);
    assert.equal(person.image, `${origin}/press/chuka-dele-oyeleru-speaking.jpg`);
    assert.equal(website.url, `${origin}/`);
    assert.equal(webpage['@type'], path === '/about.html' ? 'ProfilePage' : 'WebPage');
    assert.doesNotMatch(scripts[0][1], /"(?:worksFor|alumniOf|hasOfferCatalog|review|aggregateRating|availableChannel)"/);
    assert.deepEqual(readFileSync(`dist${page.image}`), readFileSync(`public${page.image}`));
    for (const [href, rel, sizes, type] of [
      ['/favicon.ico', 'icon', '16x16 32x32 48x48'],
      ['/favicon.svg', 'icon', 'any', 'image/svg+xml'],
      ['/favicon-32.png', 'icon', '32x32', 'image/png'],
      ['/favicon-48.png', 'icon', '48x48', 'image/png'],
      ['/favicon-192.png', 'icon', '192x192', 'image/png'],
      ['/favicon-512.png', 'icon', '512x512', 'image/png'],
      ['/apple-touch-icon.png', 'apple-touch-icon', '180x180'],
    ]) {
      const matches = links.filter(link => link.href === href && link.rel === rel && link.sizes === sizes && (!type || link.type === type));
      assert.equal(matches.length, 1, `${path}: ${href}`);
      assert.deepEqual(readFileSync(`dist${href}`), readFileSync(`public${href}`));
    }
  }
  const missing = head(readFileSync('dist/404.html', 'utf8'));
  assert.equal(meta(missing, 'robots'), 'noindex, nofollow');
  assert.match(missing, /<title>Page not found · Chuka Dele-Oyeleru<\/title>/);
  assert.ok(!elements(missing, 'link').some(link => link.rel === 'canonical'));
  assert.doesNotMatch(missing, /application\/ld\+json/);
});
