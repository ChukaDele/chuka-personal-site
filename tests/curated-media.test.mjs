import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
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

test('approved source or delivery MP4 hashes and full-aspect WebP dimensions survive integration', async () => {
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
      assert.equal(createHash('sha256').update(bytes).digest('hex'), m.deliverySha256 ?? m.sourceSha256, m.id);
      const v = videos.find(v => v.src === m.src);
      assert.ok(v?.label && v?.caption && v?.poster);
      assert.equal(v.width, m.width);
      assert.equal(v.height, m.height);
      assert.ok(Math.abs(image.width / image.height - m.width / m.height) < .01);
    }
  }
});

test('only Lateral uses the approved delivery derivative; every video stays below 25 MiB', () => {
  const sourceHashes = {
    'H-V1': 'fc6e2ea9fc9008c490e971073ebb716faffb316d710794411ad1e41bb0f95e0a',
    'I-V1': '0b7c5317adffc61384fd88a95f458cfd20291ae981c457886ed52daf2a60a620',
    'E-V1': '46b83857d6910fa75dee0f3bd567866e3799f227997fd30e073e81a06958b537',
    'R-V2': '4fe365159fac9846090aa1e79c14adb5c377ce1ced0dd8bb5c60cad6d7dfb7c4',
  };
  for (const m of media.filter(m => m.kind === 'video')) {
    assert.equal(m.sourceSha256, sourceHashes[m.id], `${m.id} approved source`);
    const bytes = readFileSync(new URL(`../public/video/${m.src}.mp4`, import.meta.url));
    assert.ok(bytes.length < 25 * 1024 * 1024, `${m.id} below 25 MiB`);
    if (m.id === 'R-V2') {
      assert.equal(m.deliverySha256, 'b539ff7fd1ab02d60c9ed54ec96923a412bcd344b8bc9924236ef87a91d1aa04');
      assert.equal(m.deliveryBytes, 11192609);
      assert.equal(bytes.length, m.deliveryBytes);
      assert.equal(m.sourceBytes, 40806875);
    } else {
      assert.equal(m.deliverySha256, undefined, `${m.id} remains original bytes`);
    }
  }
});

test('Bredge excludes the unsupported first-month engagement delivery claim', () => {
  const bredge = work('the-bredge');
  assert.ok(bredge.setting.facts.every(([label]) => label !== 'Pace'));
  assert.doesNotMatch(JSON.stringify(bredge), /most engagements|first[\s-]+month|30[\s-]+days/i);
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
  assert.doesNotMatch(tag, /autoplay|loop/i);
  // The native muted attribute also sets defaultMuted, without a JS playback owner.
  assert.match(tag, /muted=\{p.video.defaultMuted\}/);
  assert.equal(work('honeycoin').parts.find(p => p.video).video.defaultMuted, true);
  assert.equal(work('etap').parts.find(p => p.video).video.defaultMuted, false);
  assert.equal(media.find(m => m.id === 'H-V1').defaultMuted, true);
  assert.equal(media.find(m => m.id === 'E-V1').defaultMuted, false);
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
  assert.equal(client.video.caption, 'Full 30-second Rvysion studio presentation of the Lateral Frontiers website.');
  assert.doesNotMatch(work('rvysion').shotNote + client.video.caption, /not authenticated|led strategy|designers and engineers/);
  assert.equal(media.find(m => m.id === 'R-V2').duration, 30);
  assert.match(work('rvysion').parts.find(p => p.word === 'Venture').result[1], /Rayna UI/);
  const etap = work('etap').parts.find(p => p.video).video;
  assert.match(etap.caption, /Co-presenting with a colleague.*12-second excerpt, original 00:05 to 00:17.*audio retained/);
  assert.equal(media.find(m => m.id === 'E-V1').sourceSha256, '46b83857d6910fa75dee0f3bd567866e3799f227997fd30e073e81a06958b537');
  for (const id of ['honeycoin', 'idara']) assert.match(work(id).parts.find(p => p.video).video.caption, /Studio presentation.*not reported results.*Chuka.*studio/i);
  assert.match(work('the-bredge').shotNote, /Illustrative figures.*not client data or reported results/);
  assert.match(work('the-bredge').shots[0][1], /illustrative figures.*not client data or reported results/);
});

test('ETAP automatic captions and transcript preserve source wording, extent and metadata', () => {
  const c = media.find(m => m.id === 'E-V1').captions;
  const v = work('etap').parts.find(p => p.video).video;
  assert.equal(c.sourceURL, 'https://www.youtube.com/watch?v=2c5S8CDZwIM');
  assert.equal(c.automatic, true);
  assert.deepEqual([c.originalStartMs, c.originalEndMs, c.excerptStartMs, c.excerptEndMs], [5000, 17000, 0, 12000]);
  for (const key of ['src', 'language', 'label', 'transcript', 'sourceURL']) assert.equal(v.captions[key], c[key]);
  assert.equal(c.language, 'en');
  assert.equal(c.label, 'English (automatic)');
  const expected = [
    [0, 1600, 'time and intact am my driver sticking to'],
    [1600, 3400, 'the rout or taking detour that are not'],
    [3400, 5040, 'necessary how can I cut full cost and'],
    [5040, 6759, 'increase the lifespan of my V how can we'],
    [6759, 9559, 'reduce down time run through your mind'],
    [9559, 12000, 'every day this is where EAB telematics'],
  ];
  assert.deepEqual(c.cues.map(q => [q.startMs, q.endMs, q.text]), expected);
  for (const q of c.cues) {
    assert.ok(q.startMs >= 0 && q.endMs <= 12000 && q.startMs < q.endMs);
    assert.ok(q.sourceSegments.every(s => s.startMs < 17000 && s.endMs > 5000));
    assert.equal(q.startMs, Math.max(0, q.sourceSegments[0].startMs - 5000));
    assert.equal(q.endMs, Math.min(12000, q.sourceSegments.at(-1).endMs - 5000));
    assert.equal(q.text, q.sourceSegments.map(s => s.text).join('').trim());
  }
  const stamp = ms => new Date(ms).toISOString().slice(11, 23);
  assert.equal(read(`../public/${c.src}`), 'WEBVTT\n\n' + expected.map(([a, b, text]) => `${stamp(a)} --> ${stamp(b)}\n${text}`).join('\n\n') + '\n');
  const transcript = read(`../public/${c.transcript}`);
  assert.equal(transcript.split('\n\n')[1], expected.map(([, , text]) => text).join('\n') + '\n');
  assert.match(transcript, /English transcript \(automatic\)/);
  assert.ok(transcript.includes(c.sourceURL));
  const renderer = read('../src/pages/work-[id].astro');
  assert.match(renderer, /p.video.captions && <track kind="captions" src=\{p.video.captions.src\} srclang=\{p.video.captions.language\} label=\{p.video.captions.label\}/);
  assert.match(renderer, /English automatic captions/);
  assert.match(renderer, /href=\{p.video.captions.transcript\}>plain text transcript \(automatic\)/);
  assert.doesNotMatch(renderer + transcript, /human.verified/i);
});

const captionSource = new URL('../.launch-input/approved-project-media/etap-publisher-auto-captions.json3', import.meta.url);
test('local recovered publisher source matches the caption provenance and retained segments', { skip: !existsSync(captionSource) }, () => {
  const raw = readFileSync(captionSource);
  const c = media.find(m => m.id === 'E-V1').captions;
  assert.equal(createHash('sha256').update(raw).digest('hex'), c.sourceSha256);
  const events = JSON.parse(raw).events.filter(e => e.segs?.some(s => s.utf8.trim()));
  const segments = events.flatMap((e, i) => e.segs.map((s, j) => ({
    text: s.utf8,
    startMs: e.tStartMs + (s.tOffsetMs ?? 0),
    endMs: j + 1 < e.segs.length ? e.tStartMs + (e.segs[j + 1].tOffsetMs ?? 0) : Math.min(e.tStartMs + e.dDurationMs, events[i + 1]?.tStartMs ?? Infinity),
  }))).filter(s => s.text.trim() && s.startMs < 17000 && s.endMs > 5000);
  assert.deepEqual(c.cues.flatMap(q => q.sourceSegments), segments);
});
