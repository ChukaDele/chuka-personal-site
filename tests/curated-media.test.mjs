import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { works } from '../src/data/works.js';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const media = JSON.parse(read('../docs/curated-media.json'));
const meta = JSON.parse(read('../src/data/img.json'));
const work = id => works.find(w => w.id === id);
const images = w => [w.shot, ...w.shots.map(([s]) => s), ...w.parts.flatMap(p => (p.shots || []).map(([s]) => s))];
const videos = works.flatMap(w => w.parts.flatMap(p => p.video ? [p.video] : []));

test('only the narrowed whitelist is integrated, once each, without duplicate galleries', () => {
  assert.deepEqual(media.map(m => m.id).sort(), ['S-I1', 'S-I2', 'H-I2', 'H-I3', 'H-V1', 'I-I1', 'I-V1', 'E-V1', 'B-I2', 'R-I2', 'R-V2'].sort());
  const references = [...works.flatMap(images), ...videos.map(v => v.poster)];
  for (const m of media) assert.equal(references.filter(n => n === m.name).length, 1, m.id);
  for (const w of works) assert.equal(new Set(images(w)).size, images(w).length, w.id);
  assert.deepEqual(images(work('surface-talent')), ['surface-home-20261009', 'surface-1', 'surface-2', 'surface-candidates-20261009']);
  assert.deepEqual(images(work('honeycoin')), ['honey-1', 'honeycoin-product-13', 'honeycoin-product-15']);
  assert.deepEqual(images(work('idara')), ['idara-product-08']);
  assert.deepEqual(images(work('rvysion')), ['lateral-product-14']);
  assert.deepEqual(images(work('etap')), ['etap-1', 'etap-event', 'etap-2']);
  assert.deepEqual(images(work('the-bredge')), ['bredge-2', 'bredge-3']);
  assert.deepEqual(readdirSync(new URL('../public/video/', import.meta.url)).sort(), media.filter(m => m.kind === 'video').map(m => `${m.src}.mp4`).sort());
});

test('approved MP4 bytes and full-aspect WebP dimensions survive integration', async () => {
  for (const m of media) {
    const image = await sharp(new URL(`../public/img/${m.name}.webp`, import.meta.url).pathname).metadata();
    assert.equal(image.format, 'webp');
    assert.equal(image.width, meta[m.name].w);
    assert.equal(image.height, meta[m.name].h);
    assert.equal(image.width, m.imageWidth, `${m.id} approved image width`);
    assert.equal(image.height, m.imageHeight, `${m.id} approved image height`);
    if (meta[m.name].sm) {
      const small = await sharp(new URL(`../public/img/${m.name}-900.webp`, import.meta.url).pathname).metadata();
      assert.equal(small.width, 900);
      assert.ok(Math.abs(small.height - image.height * 900 / image.width) <= 1, m.id);
    }
    if (m.kind === 'video') {
      const bytes = readFileSync(new URL(`../public/video/${m.src}.mp4`, import.meta.url));
      assert.equal(createHash('sha256').update(bytes).digest('hex'), m.sourceSha256, m.id);
      const v = videos.find(v => v.src === m.src);
      assert.ok(v?.label && v?.caption && v?.poster);
      assert.equal(v.width, m.width);
      assert.equal(v.height, m.height);
      assert.ok(Math.abs(image.width / image.height - m.width / m.height) < .01);
    }
  }
});

test('Part video contract is responsive, labelled and manual-play even with reduced motion', () => {
  const renderer = read('../src/pages/work-[id].astro');
  const tag = renderer.match(/<video\b[^>]*>/)[0];
  assert.match(tag, /\bcontrols\b/);
  assert.match(tag, /\bplaysinline\b/);
  assert.match(tag, /preload="metadata"/);
  assert.match(tag, /poster=\{`img\/\$\{p.video.poster\}.webp`\}/);
  assert.match(tag, /aria-label=\{p.video.label\}/);
  assert.match(tag, /aria-describedby=/);
  assert.doesNotMatch(tag, /autoplay|loop|muted/i);
  assert.match(renderer, /<figcaption id=\{`\$\{w.id\}-\$\{p.word\}-video-caption`\}/);
  assert.match(read('../src/styles/global.css'), /\.case-video video\{[^}]*width:100%;height:auto;object-fit:contain/);
  // No JS playback owner: reduced-motion users retain the static poster until intentional play.
  assert.doesNotMatch(read('../src/scripts/site.js'), /\bvideo\b|case-video/);
});

test('captions separate presentation figures, personal role, studio authorship and dated evidence', () => {
  const surface = work('surface-talent');
  assert.match(surface.shotNote, /Public staging capture, 9 October 2026; not production proof/);
  const shots = surface.parts.find(p => p.word === 'Interface').shots;
  assert.ok(shots.slice(0, 2).every(([, c]) => c.includes('22 September 2026')));
  assert.match(shots[2][1], /9 October 2026.*empty.*not production proof/);
  assert.doesNotMatch(JSON.stringify(surface), /"quote"|gift|testimonial/i);
  const client = work('rvysion').parts.find(p => p.word === 'Client');
  assert.match(client.text, /I led strategy and the project for the Lateral Frontiers rebrand and new website/);
  assert.match(client.text, /studio designers and engineers delivered the design and build/);
  assert.equal(media.find(m => m.id === 'R-V2').duration, 30);
  assert.match(work('rvysion').parts.find(p => p.word === 'Venture').result[1], /Rayna UI/);
  const etap = work('etap').parts.find(p => p.video).video;
  assert.match(etap.caption, /Co-presenting with a colleague.*12-second excerpt, original 00:05 to 00:17.*audio retained/);
  assert.equal(media.find(m => m.id === 'E-V1').sourceSha256, '46b83857d6910fa75dee0f3bd567866e3799f227997fd30e073e81a06958b537');
  for (const id of ['honeycoin', 'idara']) assert.match(work(id).parts.find(p => p.video).video.caption, /Studio presentation.*not reported results.*Chuka.*studio/i);
  assert.match(work('the-bredge').shotNote, /Illustrative figures.*not client data or reported results/);
  assert.match(work('the-bredge').shots[0][1], /illustrative figures.*not client data or reported results/);
});
