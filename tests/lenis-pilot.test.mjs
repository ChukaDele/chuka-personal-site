import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isLenisPilotEligible } from '../src/scripts/lenis-pilot-policy.js';

const desktop = {
  search: '?lenis-preview=1',
  viewportWidth: 1440,
  hasHover: true,
  hasFinePointer: true,
  maxTouchPoints: 0,
  reducedMotion: false,
};

test('Lenis is never enabled during ordinary visits', () => {
  assert.equal(isLenisPilotEligible({ ...desktop, search: '' }), false);
  assert.equal(isLenisPilotEligible({ ...desktop, search: '?lenis-preview=0' }), false);
  assert.equal(isLenisPilotEligible({ ...desktop, search: '?lenis-preview=true' }), false);
});

test('Lenis pilot accepts an explicit fine-pointer desktop opt-in', () => {
  assert.equal(isLenisPilotEligible(desktop), true);
});

test('mobile, touch hardware, coarse pointers and reduced motion remain native', () => {
  const changes = [
    { viewportWidth: 1099 },
    { viewportWidth: 390 },
    { maxTouchPoints: 1 },
    { hasHover: false },
    { hasFinePointer: false },
    { reducedMotion: true },
  ];
  for (const change of changes) {
    assert.equal(isLenisPilotEligible({ ...desktop, ...change }), false, JSON.stringify(change));
  }
});

test('Lenis is loaded only through the explicitly gated pilot', () => {
  const site = readFileSync(new URL('../src/scripts/site.js', import.meta.url), 'utf8');
  const pilot = readFileSync(new URL('../src/scripts/lenis-pilot.js', import.meta.url), 'utf8');
  assert.match(site, /get\('lenis-preview'\) === '1'/);
  assert.match(site, /import\('\.\/lenis-pilot\.js'\)/);
  assert.doesNotMatch(site, /from ['"]lenis['"]/);
  assert.match(pilot, /await import\('lenis'\)/);
  assert.match(pilot, /lenis\.destroy\(\)/);
  assert.match(pilot, /ScrollTrigger\.update\(\)/);
  assert.match(pilot, /reducedMotion\.matches/);
  assert.match(pilot, /prevent: \(node\)/);
});
