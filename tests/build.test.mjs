import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { pages, origin, indexablePaths, serializeJsonLd, structuredData } from '../src/data/routes.js';
import { site } from '../src/data/site.js';
import { shelves } from '../src/data/library.js';
import { works } from '../src/data/works.js';

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
  assert.equal(Object.keys(pages).length, 14);
  assert.equal(pages['/'].image, '/og/home-v2.jpg');
  assert.equal(pages['/'].card.picture, 'p-speaking');
  assert.match(pages['/'].imageAlt, /smiling in a light grey suit, in natural colour/);
  assert.ok(existsSync('public/og/home-v1.jpg'), 'preserve the previously shared homepage card');
  assert.equal(site.brand, 'Chuka Dele');
  assert.equal(site.fullName, 'Chukwuka Dele-Oyeleru');
  assert.equal(pages['/'].title, 'Chuka Dele | Strategy & Operations');
  assert.match(pages['/'].description, /Strategy and operations, based in Manchester/);
  for (const property of ['image', 'imageAlt']) {
    assert.equal(new Set(Object.values(pages).map(page => page[property])).size, 13, `unique ${property}`);
  }
  assert.match(pages['/library.html'].contextualDescription, /Books, essays, talks and listening/);
  assert.doesNotMatch(pages['/library.html'].contextualDescription, /films/i);
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
    assert.match(page.contextualDescription, contribution);
    assert.ok(page.contextualTitle.includes(page.card.heading), id);
    assert.doesNotMatch(`${page.contextualTitle} ${page.contextualDescription} ${page.card.lines.join(' ')}`, /\d|%|×/);
  }
  for (const page of Object.values(pages)) {
    assert.ok(page.title.includes(site.brand));
    assert.equal(page.description, page.contextualDescription);
  }
  const [person, website] = structuredData('/', site)['@graph'];
  assert.equal(person.name, 'Chukwuka Dele-Oyeleru');
  assert.equal(website.name, 'Chuka Dele');
  assert.deepEqual(person.alternateName, [site.brand, site.name]);
  assert.equal(new Set(Object.values(pages).map(page => page.title)).size, 14);
  assert.equal(new Set(Object.values(pages).map(page => page.description)).size, 14);
  assert.equal(indexablePaths.length, 12);
  assert.ok(!indexablePaths.includes('/notes.html'));
});

test('Surface Talent distinguishes the internship from post-internship release hardening', () => {
  const surfaceTalent = works.find(work => work.id === 'surface-talent');
  assert.ok(surfaceTalent);
  assert.ok(surfaceTalent.line.length <= 100, 'keep the homepage summary comparable to the other work summaries');
  assert.doesNotMatch(JSON.stringify(surfaceTalent), /testimonial|amazon|gift|blockquote|[“”]|"quote"/i);
  assert.equal(surfaceTalent.when, '15 June to 4 September 2026');
  assert.match(surfaceTalent.scope, /reliability and handover/);
  assert.match(surfaceTalent.brief.at(-1), /internship ended on 4 September.*production-verified on 8 October/);

  const reliability = surfaceTalent.parts.find(part => part.word === 'Reliability');
  assert.ok(reliability);
  assert.match(reliability.title, /release discipline/);
  assert.match(reliability.steps.map(([, text]) => text).join(' '), /fail|uncertain|review|release/i);

  const outcome = surfaceTalent.parts.find(part => part.word === 'Outcome');
  assert.ok(outcome);
  assert.equal(outcome.title, 'Outcome');
  assert.deepEqual(outcome.list, [
    ['Hiring process', 'Assessment and interview analysis supported a hiring process that ended with an August start.'],
    ['Website', 'The client reported that the website generated Surface Talent’s first external inbound enquiry, which became an exclusive retainer.'],
  ]);
  assert.ok(!Object.hasOwn(outcome, 'result'));
  const decisions = surfaceTalent.parts.find(part => part.word === 'Decisions');
  assert.match(decisions?.steps.map(([, text]) => text).join(' ') || '', /candidate moves forward[^.]*recruiter[’']s call/i);
});

test('source JSON-LD safely round-trips closing scripts and HTML-significant characters', () => {
  const hostile = '</script><script>alert("test")</script>&<>\u2028\u2029';
  const graph = structuredData('/about.html', { ...site, fullName: hostile, brand: hostile });
  graph['@graph'][2].description = hostile;
  const serialized = serializeJsonLd(graph);
  assert.doesNotMatch(serialized, /[<>&\u2028\u2029]/);
  assert.deepEqual(JSON.parse(serialized), graph);
  assert.equal(structuredData('/404.html', site), null);
});

test('source Library keeps eight owner notes with verified book page/edition citations and exact talk timestamps', () => {
  const volumes = shelves.flatMap(shelf => shelf.volumes);
  assert.equal(volumes.length, 8);
  assert.equal(new Set(volumes.map(volume => volume.id)).size, 8);
  for (const volume of volumes) {
    assert.equal(volume.paragraphs.length, 2);
    assert.ok(volume.paragraphs.every(paragraph => paragraph.trim().length > 0));
    assert.ok(volume.quote.text && volume.quote.locator);
    for (const url of [volume.href, volume.quote.source]) assert.equal(new URL(url).protocol, 'https:');
  }
  const note = title => volumes.find(volume => volume.title === title);
  assert.match(note('The Alchemist').paragraphs.join(' '), /Tangier.*Maktub/);
  assert.match(note('Zero to One').paragraphs.join(' '), /2015/);
  assert.match(note('Founders').paragraphs.join(' '), /2025/);
  const verifiedQuotes = {
    "The Alchemist": {
      "text": "And, when you want something, all the universe conspires in helping you to achieve it.",
      "source": "https://paulocoelhoblog.com/2018/12/27/44-paulo-coelho-quotes-on-love-life-and-friendship/",
      "locator": "p. 23",
      "edition": "HarperCollins / PerfectBound, July 2005, ISBN 0-06-088269-7"
    },
    "Zero to One": {
      "text": "But every time we create something new, we go from 0 to 1.",
      "source": "https://www.penguinrandomhouse.ca/books/234730/zero-to-one-by-peter-thiel-with-blake-masters/9780804139298/excerpt",
      "locator": "p. 1",
      "edition": "Crown Business, 2014, ISBN 9780804139298"
    },
    "The Hard Thing About Hard Things": {
      "text": "There’s no recipe for really complicated, dynamic situations.",
      "source": "https://a16z.com/books/the-hard-thing-about-hard-things/",
      "locator": "p. ix",
      "edition": "HarperBusiness, 2014, ISBN 9780062273208"
    },
    "The Almanack of Naval Ravikant": {
      "text": "When you find the right thing to do, when you find the right people to work with, invest deeply.",
      "source": "https://navalmanack.s3.amazonaws.com/Eric-Jorgenson_The-Almanack-of-Naval-Ravikant_Final.pdf#page=48",
      "locator": "p. 48",
      "edition": "Magrathea Publishing, 2020, official author PDF"
    },
    "Become Someone For Whom Success Is Inevitable": {
      "text": "Volume negates luck.",
      "source": "https://www.youtube.com/watch?v=Gk8EGWoGnEQ&t=811",
      "locator": "13:31"
    },
    "Are You Destined to Deal?": {
      "text": "It means that you need to be there for the client whenever they need you.",
      "source": "https://www.youtube.com/watch?v=RpUJfW4WTKw&t=417",
      "locator": "6:57"
    }
  };
  for (const [title, quote] of Object.entries(verifiedQuotes)) {
    assert.deepEqual(note(title).quote, quote, title);
  }
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
      description: page.description, 'og:type': 'website', 'og:site_name': site.brand,
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
    assert.deepEqual(robots.map(item => item.content), page.noindex || path === '/notes.html' || process.env.ALLOW_INDEXING !== 'true' ? ['noindex, nofollow'] : [], path);
    const scripts = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
    assert.equal(scripts.length, 1, path);
    assert.doesNotMatch(scripts[0][1], /[<>&\u2028\u2029]/);
    const graph = JSON.parse(scripts[0][1]);
    assert.deepEqual(graph, structuredData(path, site), path);
    const [person, website, webpage] = graph['@graph'];
    assert.equal(person.name, 'Chukwuka Dele-Oyeleru');
    assert.equal(website.name, 'Chuka Dele');
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
      const matches = links.filter(link => link.href === `${href}?v=c-mark-v2` && link.rel === rel && link.sizes === sizes && (!type || link.type === type));
      assert.equal(matches.length, 1, `${path}: ${href}`);
      assert.deepEqual(readFileSync(`dist${href}`), readFileSync(`public${href}`));
    }
  }
  const missing = head(readFileSync('dist/404.html', 'utf8'));
  assert.equal(meta(missing, 'robots'), 'noindex, nofollow');
  assert.match(missing, /<title>Chuka Dele<\/title>/);
  for (const key of ['og:title', 'twitter:title', 'og:site_name']) assert.equal(meta(missing, key), site.brand);
  for (const key of ['description', 'og:description', 'twitter:description']) assert.equal(meta(missing, key), site.fullName);
  assert.ok(!elements(missing, 'link').some(link => link.rel === 'canonical'));
  assert.doesNotMatch(missing, /application\/ld\+json/);
});

test('rendered Library contains eight complete notes and linked quotations before JavaScript', () => {
  const html = readFileSync('dist/library.html', 'utf8');
  const volumes = shelves.flatMap(shelf => shelf.volumes);
  const articles = [...html.matchAll(/<article\b[^>]*data-library-note[^>]*>([\s\S]*?)<\/article>/g)];
  assert.equal(articles.length, 8);
  for (const volume of volumes) {
    const article = articles.find(([markup]) => attributes(markup.slice(0, markup.indexOf('>') + 1)).id === volume.id)?.[0];
    assert.ok(article, volume.title);
    const paragraphs = [...article.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map(([, text]) => decode(text));
    assert.equal(volume.paragraphs.length, 2);
    for (const paragraph of volume.paragraphs) assert.equal(paragraphs.filter(text => text === paragraph).length, 1);
    assert.ok(paragraphs.includes('“' + volume.quote.text + '”'));
    const links = elements(article, 'a');
    assert.equal(links.filter(link => link.href === volume.href).length, 1);
    assert.equal(links.filter(link => link.href === volume.quote.source).length, 1);
    assert.ok(decode(article).includes(volume.quote.locator));
    assert.ok(elements(html, 'a').some(link => link.href === 'library.html#' + volume.id && link['aria-controls'] === volume.id));
    assert.doesNotMatch(article.slice(0, article.indexOf('>')), /\shidden(?:\s|=|>)/);
  }
  assert.equal([...html.matchAll(/<dialog\b[^>]*\sdata-library-drawer(?:\s|=|>)/g)].length, 1);
  assert.doesNotMatch(html, /data-(?:why|quote)=/);
});
