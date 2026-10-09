import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../src/scripts/site.js', import.meta.url), 'utf8');
// Execute the production lifecycle itself, without GSAP or a browser/build.
const lifecycle = source.slice(source.indexOf('let videoPageActive'), source.indexOf('/* ---------- sound:'));
const flush = async () => { for (let i = 0; i < 5; i++) await Promise.resolve(); };
function harness({ reduced = false, hidden = false, visible = false, reject = false } = {}) {
  const page = new EventTarget(), document = new EventTarget(), motionPreference = new EventTarget();
  document.hidden = hidden;
  motionPreference.matches = reduced;
  const video = new EventTarget();
  Object.assign(video, { paused: true, ended: false, muted: false, preload: 'none', calls: [], visible });
  video.getBoundingClientRect = () => ({ width: 400, height: 300, left: 0, right: 400,
    top: video.visible ? 100 : 900, bottom: video.visible ? 400 : 1200 });
  video.play = () => {
    video.calls.push({ muted: video.muted, preload: video.preload });
    if (reject) return Promise.reject(new Error('Autoplay denied'));
    video.paused = false;
    queueMicrotask(() => video.dispatchEvent(new Event('play')));
    return Promise.resolve();
  };
  video.pause = () => {
    if (video.paused) return;
    video.paused = true;
    queueMicrotask(() => video.dispatchEvent(new Event('pause')));
  };
  const context = { $$: () => [video], document, motionPreference, innerHeight: 800, innerWidth: 1000,
    addEventListener: page.addEventListener.bind(page) };
  runInNewContext(lifecycle, context);
  return { video, sync: () => runInNewContext('syncVideos()', context),
    hidden(value) { document.hidden = value; document.dispatchEvent(new Event('visibilitychange')); },
    reduced(value) { motionPreference.matches = value; motionPreference.dispatchEvent(new Event('change')); },
    page(type) { page.dispatchEvent(new Event(type)); } };
}

test('owner supersession 2026-10-09: fetch/play starts only in view, muted, with preload none', async () => {
  const h = harness();
  h.sync();
  assert.equal(h.video.calls.length, 0);
  assert.equal(h.video.preload, 'none');
  h.video.visible = true;
  h.sync(); h.sync();
  await flush();
  assert.deepEqual(h.video.calls, [{ muted: true, preload: 'none' }]);
  h.video.visible = false; h.sync();
  assert.equal(h.video.paused, true);
  await flush();
  h.video.visible = true; h.sync();
  await flush();
  assert.equal(h.video.calls.length, 2);
});

test('hidden document and page lifecycle pause and gate autoplay', async () => {
  const h = harness({ visible: true, hidden: true });
  assert.equal(h.video.calls.length, 0);
  h.hidden(false); await flush();
  h.hidden(true); await flush();
  assert.equal(h.video.paused, true);
  h.sync(); assert.equal(h.video.calls.length, 1);
  h.hidden(false); await flush();
  h.page('pagehide'); await flush();
  assert.equal(h.video.paused, true);
  h.page('pageshow'); await flush();
  assert.equal(h.video.calls.length, 3);
});

test('native pause persists through repeated visibility checks; native unmute stays user-controlled', async () => {
  const h = harness({ visible: true }); await flush();
  h.video.muted = false; h.sync();
  assert.equal(h.video.muted, false);
  h.video.pause(); await flush();
  h.sync(); h.hidden(true); h.hidden(false); await flush();
  assert.equal(h.video.calls.length, 1);
  await h.video.play(); await flush();
  assert.equal(h.video.paused, false);
  h.video.visible = false; h.sync(); await flush();
  h.video.visible = true; h.sync(); await flush();
  assert.equal(h.video.calls.at(-1).muted, true, 'automatic resumption is silent');
});

test('reduced motion permits muted native play but never automatically resumes it', async () => {
  const h = harness({ visible: true, reduced: true });
  h.sync(); assert.equal(h.video.calls.length, 0);
  await h.video.play(); await flush(); h.sync();
  assert.equal(h.video.paused, false);
  assert.equal(h.video.calls[0].muted, true);
  h.hidden(true); await flush(); h.hidden(false); await flush();
  assert.equal(h.video.calls.length, 1);
  h.reduced(false); await flush();
  assert.equal(h.video.paused, false);
  h.reduced(true); await flush(); h.sync();
  assert.equal(h.video.paused, true);
});

test('finished and rejected playback never retry on every scroll or loop', async () => {
  const h = harness({ visible: true }); await flush();
  h.video.ended = true; h.video.paused = true;
  h.sync(); assert.equal(h.video.calls.length, 1);
  const denied = harness({ visible: true, reject: true }); await flush();
  denied.sync(); assert.equal(denied.video.calls.length, 1);
});

test('late play events are stopped offscreen and existing scroll/resize handlers own checks', async () => {
  const h = harness({ visible: true });
  h.video.visible = false; await flush();
  assert.equal(h.video.paused, true);
  assert.match(source, /tick = 0; syncVideos\(\); reveals\.forEach/);
  assert.match(source, /rz = 0; syncVideos\(\); reveals\.forEach/);
});

test('visibility cancellation of pending play does not become a manual pause', async () => {
  const h = harness();
  const play = h.video.play;
  let cancel;
  h.video.play = () => {
    h.video.paused = false;
    return new Promise((resolve, reject) => { cancel = reject; });
  };
  h.video.visible = true; h.sync();
  h.video.visible = false; h.sync();
  cancel(Object.assign(new Error('Paused before ready'), { name: 'AbortError' }));
  await flush();
  h.video.play = play;
  h.video.visible = true; h.sync(); await flush();
  assert.equal(h.video.paused, false);
  assert.equal(h.video.calls.length, 1);
});
