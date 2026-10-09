import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { works } from '../src/data/works.js';

const read = path => readFileSync(new URL(path, import.meta.url));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const ledger = JSON.parse(read('../docs/curated-media.json'));
const rvysion = works.find(w => w.id === 'rvysion');
const refs = p => [...(p.shots || []).map(([name]) => name), ...(p.video ? [p.video.src, p.video.poster] : [])];

test('Rvysion client evidence belongs only to its named account, once each', () => {
  assert.equal(rvysion.shot, undefined);
  assert.deepEqual(rvysion.shots, []);
  const expected = {
    'Lateral Frontiers: rebrand and new website': ['lateral-product-14', 'lateral-product-07', 'lateral-product-07-poster'],
    'Voxtell: earlier website and redesign': ['voxtell-website-comparison'],
    'Rayna UI: the studio’s own design system': ['rayna-1', 'rayna-2'],
  };
  for (const [title, names] of Object.entries(expected)) {
    const parts = rvysion.parts.filter(p => p.title === title);
    assert.equal(parts.length, 1, title);
    assert.deepEqual(refs(parts[0]), names);
    for (const name of names) assert.equal(rvysion.parts.flatMap(refs).filter(n => n === name).length, 1, name);
  }
  const rayna = rvysion.parts.find(p => p.word === 'Venture');
  assert.doesNotMatch(JSON.stringify(rayna), /Voxtell|Lateral/i);
  assert.match(rayna.steps[0][1], /Helped move internal opportunities/);
  assert.deepEqual(rayna.result, ['11,000+', 'users of Rayna UI, one of the studio’s own products.']);
  for (const p of rvysion.parts.filter(p => ['Client', 'Website', 'Venture'].includes(p.word))) {
    assert.match(p.text, /studio designers and engineers delivered the design and build/);
  }
  assert.match(rvysion.parts.find(p => p.word === 'Commercial').result[1], /studio client base.*22% more revenue opportunities within six months/);
  assert.deepEqual(rvysion.parts.find(p => p.word === 'Operating').result, ['12%', 'lower studio operating expenses.']);
});

test('all six cases retain their own project media and exactly four native films', () => {
  const allowed = {
    etap: /^(etap-)/, idara: /^(idara-)/, 'surface-talent': /^(surface-)/,
    honeycoin: /^(honey-|honeycoin-)/, rvysion: /^(lateral-|voxtell-|rayna-)/, 'the-bredge': /^(bredge-)/,
  };
  assert.deepEqual(works.map(w => w.id).sort(), Object.keys(allowed).sort());
  for (const w of works) {
    const names = [w.shot, ...refs(w), ...w.parts.flatMap(refs)].filter(Boolean);
    for (const name of names) assert.match(name, allowed[w.id], `${w.id}: ${name}`);
    assert.equal(new Set(names).size, names.length, w.id);
  }
  assert.deepEqual(works.flatMap(w => w.parts.flatMap(p => p.video ? [p.video.src] : [])).sort(),
    ['etap-fleet-review-excerpt', 'honeycoin-product-07', 'idara-product-07', 'lateral-product-07']);
  assert.equal(works.find(w => w.id === 'the-bredge').fig, 'In build');
  assert.match(read('../src/pages/work.astro').toString(), /others still in build/);
});

test('approved comparison and restored Rayna derivatives retain exact bytes', () => {
  const expected = {
    'voxtell-website-comparison': ['b5fea76fc877168f15bd1f934e18f50bc02a7a84f34939bab0ce2d43bdef4656', '6bfce9b3bdf83c0424da9f51121be2b0030759c91379110c8a73c71d0cddbf11'],
    'rayna-1': ['a23e9b3dc7d8fd8cf7a95934dc72a9a9d4e74be56d8995de8f48a2284ed077bd', 'bef3089ab4ba642d59cd399019afa5e5705a53bee87101a88cf50348d3862136'],
    'rayna-2': ['74ad84b08a427df25a0215ae7be0936e1c9c0b0e3a7c8a91deca99de07ed9770'],
  };
  for (const [name, [full, small]] of Object.entries(expected)) {
    const entry = ledger.find(m => m.name === name);
    assert.equal(entry.deliverySha256, full);
    assert.equal(hash(read(`../public/img/${name}.webp`)), full);
    assert.equal(entry.smallDeliverySha256, small);
    if (small) assert.equal(hash(read(`../public/img/${name}-900.webp`)), small);
    assert.equal(entry.sourceType, 'Studio presentation');
  }
  assert.equal(ledger.find(m => m.id === 'R-I1').sourceSha256, '4cce147dbdae6bfa2f5c9073cf8c3aa49dcd9ac9cb02ded53d92d0b43b003767');
});

const local = new URL('../.launch-input/rvysion-update-20261009/', import.meta.url);
test('local R-I1 receipt matches approved original and copied full-aspect derivatives', { skip: !existsSync(local) }, () => {
  const receipt = JSON.parse(readFileSync(new URL('voxtell-selection.json', local)));
  assert.equal(receipt.status, 'OWNER_APPROVED');
  assert.equal(hash(readFileSync(new URL('voxtell-product-08.avif', local))), receipt.sha256);
  const entry = ledger.find(m => m.id === receipt.id);
  assert.equal(entry.sourceSha256, receipt.sha256);
  assert.deepEqual([entry.imageWidth, entry.imageHeight], [receipt.width, receipt.height]);
  const voxtell = rvysion.parts.find(p => p.word === 'Website');
  assert.equal(voxtell.shots[0][1], receipt.caption);
  assert.ok(voxtell.text.includes(receipt.role));
  for (const suffix of ['', '-900']) assert.deepEqual(read(`../public/img/voxtell-website-comparison${suffix}.webp`), readFileSync(new URL(`voxtell-website-comparison${suffix}.webp`, local)));
});

test('comparison uses the existing uncropped image component across the section width', () => {
  assert.equal(rvysion.parts.find(p => p.word === 'Website').shotsFullWidth, true);
  const renderer = read('../src/pages/work-[id].astro').toString();
  assert.match(renderer, /p.shotsFullWidth \? ' full-width'/);
  assert.match(renderer, /\.shots\.full-width\s*\{ grid-template-columns: minmax\(0, 1fr\);/);
  assert.match(renderer, /p.shotsFullWidth \? '\(max-width:820px\) 92vw, 80vw'/);
  assert.match(read('../src/styles/global.css').toString(), /\.shots img\{height:auto;object-fit:initial;filter:none\}/);
});
