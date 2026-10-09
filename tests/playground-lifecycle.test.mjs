import test from 'node:test';
import assert from 'node:assert/strict';
import { enhancePlayground } from '../src/scripts/playground.js';

// Minimal native EventTarget adapter: exercise production listeners and rAF ownership,
// inspect visible DOM/canvas output, and expose no test hooks in the shipped code.
class Element extends EventTarget {
  constructor() { super(); this.hidden = false; this.dataset = {}; this.captured = new Set(); }
  setPointerCapture(id) { this.captured.add(id); }
  hasPointerCapture(id) { return this.captured.has(id); }
  releasePointerCapture(id) { this.captured.delete(id); }
  focus(options) { this.focusOptions = options; }
  getBoundingClientRect() { return { top: 450, bottom: 700 }; }
}
function game(kind) {
  const section = new Element(), elements = new Map(), canvas = new Element();
  section.dataset.game = kind;
  for (const key of ['status', 'score', 'best', 'storage', 'detail', 'start', 'pause', 'restart', 'controls']) elements.set(`[data-${key}]`, new Element());
  Object.assign(canvas, { width: kind === 'snake' ? 432 : 480, height: kind === 'snake' ? 432 : 360 });
  canvas.getBoundingClientRect = () => ({ left: 0, top: 0, bottom: 432, right: 480, width: 480, height: 432 });
  const draws = [];
  canvas.getContext = () => new Proxy({}, { get: (_, name) => (...args) => { if (name === 'fillRect') draws.push(args); }, set: () => true });
  elements.set('canvas', canvas);
  const directions = (kind === 'snake' ? ['up', 'left', 'down', 'right'] : ['left', 'right']).map(direction => {
    const e = new Element(); e.dataset.direction = direction; return e;
  });
  section.querySelector = key => elements.get(key);
  section.querySelectorAll = () => directions;
  section.contains = el => el === section || [...elements.values(), ...directions].includes(el);
  return { section, canvas, directions, get: key => elements.get(`[data-${key}]`),
    paddle: () => draws.findLast(a => a[1] === 326)?.[0] };
}
const fire = (target, type, props = {}) => {
  const event = new Event(type, { cancelable: true }); Object.assign(event, props); target.dispatchEvent(event); return event;
};

test('actual adapter: explicit start, focused keys, hold/drag cancellation, all pause paths, restart and teardown', t => {
  const originals = new Map();
  const set = (key, value) => { originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key)); Object.defineProperty(globalThis, key, { value, configurable: true, writable: true }); };
  let dispose = () => {};
  t.after(() => { dispose(); for (const [key, descriptor] of originals) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; } });
  const win = new EventTarget(), doc = new EventTarget(), motion = new EventTarget();
  const scrolls = [];
  Object.assign(win, { innerWidth: 1000, innerHeight: 1000, matchMedia: () => motion, scrollBy: options => scrolls.push(options) });
  Object.defineProperty(win, 'localStorage', { get: () => { throw new Error('blocked'); } });
  doc.hidden = false;
  const frames = new Map(), observers = []; let next = 0, now = 0;
  class Observer { constructor(callback) { this.callback = callback; observers.push(this); } observe() {} disconnect() { this.disconnected = true; } }
  win.IntersectionObserver = Observer;
  set('window', win); set('document', doc); set('IntersectionObserver', Observer);
  set('getComputedStyle', () => ({ getPropertyValue: () => 'serif' }));
  set('requestAnimationFrame', callback => { frames.set(++next, callback); return next; });
  set('cancelAnimationFrame', id => frames.delete(id));
  const advance = (steps = 1) => { for (let i = 0; i < steps; i++) { now += 50; const queued = [...frames.values()]; frames.clear(); queued.forEach(fn => fn(now)); } };
  const snake = game('snake'), breakout = game('breakout');
  dispose = enhancePlayground({ querySelectorAll: () => [snake.section, breakout.section] });
  assert.equal(frames.size, 0); assert.match(snake.get('status').textContent, /Ready/);
  assert.match(breakout.get('storage').textContent, /storage unavailable/);
  // Reproduce native Start scrolling the upper board out of view. Rects move
  // synchronously with the immediate scroll, as they do in the browser.
  let boardTop = -328.789, controlsBottom = 371.875 + 240;
  snake.canvas.getBoundingClientRect = () => ({ left: 0, right: 432, width: 432, height: 432, top: boardTop, bottom: boardTop + 432 });
  snake.get('controls').getBoundingClientRect = () => ({ bottom: controlsBottom });
  win.scrollBy = options => { scrolls.push(options); boardTop -= options.top; controlsBottom -= options.top; };
  fire(snake.get('start'), 'click'); assert.equal(frames.size, 1);
  assert.equal(boardTop, 12); assert.ok(controlsBottom <= win.innerHeight - 12);
  assert.equal(scrolls.at(-1).behavior, 'instant');
  assert.deepEqual(snake.canvas.focusOptions, { preventScroll: true });
  boardTop = 500; controlsBottom = 1200;
  fire(snake.get('restart'), 'click');
  assert.equal(controlsBottom, 988); assert.ok(boardTop >= 12);
  const alreadyVisible = scrolls.length;
  fire(snake.get('restart'), 'click');
  assert.equal(scrolls.length, alreadyVisible, 'leave an already visible board and controls in place');
  fire(snake.get('pause'), 'click');
  win.innerHeight = 500; boardTop = -180; controlsBottom = 520;
  fire(snake.get('pause'), 'click');
  assert.equal(boardTop, 12); assert.ok(controlsBottom > win.innerHeight);
  win.visualViewport = { offsetTop: 20, height: 400 };
  boardTop = -100; controlsBottom = 600;
  fire(snake.get('restart'), 'click'); assert.equal(boardTop, 32);
  const positioned = scrolls.length;
  advance(); assert.equal(scrolls.length, positioned, 'animation does not reclaim page scrolling');
  delete win.visualViewport; win.innerHeight = 1000;
  win.scrollBy = options => scrolls.push(options);
  assert.equal(fire(snake.section, 'keydown', { key: 'ArrowUp' }).defaultPrevented, true);
  assert.equal(fire(win, 'keydown', { key: 'ArrowUp' }).defaultPrevented, false);
  fire(breakout.get('start'), 'click'); assert.equal(frames.size, 1);
  assert.match(snake.get('status').textContent, /Other game started/);
  advance(2);
  const right = breakout.directions[1], initial = breakout.paddle();
  fire(right, 'pointerdown', { pointerId: 1, button: 0 }); advance(); assert.ok(breakout.paddle() > initial);
  fire(right, 'pointercancel', { pointerId: 1 }); const cancelled = breakout.paddle(); advance(); assert.equal(breakout.paddle(), cancelled);
  fire(breakout.canvas, 'pointerdown', { pointerId: 2, button: 0, clientX: 400 }); advance(); assert.equal(breakout.paddle(), 358);
  fire(breakout.canvas, 'pointercancel', { pointerId: 2 });
  fire(breakout.canvas, 'pointermove', { pointerId: 2, clientX: 20 }); advance(); assert.equal(breakout.paddle(), 358);
  fire(breakout.section, 'keydown', { key: 'ArrowLeft' }); advance(); assert.ok(breakout.paddle() < 358);
  fire(win, 'blur'); assert.equal(frames.size, 0); assert.equal(breakout.get('pause').textContent, 'Resume');
  fire(win, 'focus'); assert.equal(frames.size, 0);
  const paused = breakout.paddle(); fire(breakout.get('pause'), 'click'); advance(2); assert.equal(breakout.paddle(), paused);
  fire(right, 'pointerdown', { pointerId: 3, button: 0 }); fire(breakout.get('pause'), 'click');
  assert.equal(right.hasPointerCapture(3), false);
  fire(breakout.get('pause'), 'click'); advance(2); assert.equal(breakout.paddle(), paused);
  fire(breakout.get('restart'), 'click'); advance(); assert.equal(breakout.paddle(), 198); assert.equal(breakout.get('score').textContent, '0');
  for (const interrupt of [
    () => { doc.hidden = true; fire(doc, 'visibilitychange'); },
    () => fire(win, 'pagehide'),
    () => fire(breakout.section, 'focusout', { relatedTarget: null }),
    () => observers[1].callback([{ isIntersecting: false }]),
    () => fire(motion, 'change'),
    () => fire(breakout.section, 'keydown', { key: 'Escape' }),
  ]) {
    interrupt(); assert.equal(frames.size, 0); assert.match(breakout.get('status').textContent, /Paused/);
    doc.hidden = false; fire(doc, 'visibilitychange'); fire(win, 'pageshow'); assert.equal(frames.size, 0);
    fire(breakout.get('pause'), 'click'); assert.equal(frames.size, 1);
  }
  fire(breakout.get('restart'), 'click');
  for (let i = 0; i < 1000 && frames.size; i++) advance();
  assert.match(breakout.get('status').textContent, /Life lost/);
  assert.match(breakout.get('detail').textContent, /2 lives/);
  fire(breakout.get('pause'), 'click'); assert.match(breakout.get('detail').textContent, /2 lives/);
  breakout.canvas.getBoundingClientRect = () => ({ width: 480, height: 360, top: 1100, bottom: 1460, right: 480, left: 0 });
  advance(); assert.equal(frames.size, 0); assert.match(breakout.get('status').textContent, /left view/);
  fire(snake.get('pause'), 'click'); advance(100);
  assert.match(snake.get('status').textContent, /Game over/); assert.equal(snake.get('start').textContent, 'Play again');
  fire(snake.get('start'), 'click'); assert.equal(snake.get('score').textContent, '0'); assert.equal(frames.size, 1);
  dispose(); assert.ok(observers.every(o => o.disconnected));
  fire(snake.get('pause'), 'click'); assert.equal(frames.size, 0);
});
