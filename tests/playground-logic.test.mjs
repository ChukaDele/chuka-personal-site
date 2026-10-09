import test from 'node:test';
import assert from 'node:assert/strict';
import { createSnake, turnSnake, stepSnake, freeCells, snakeInterval, createBreakout, stepBreakout, clearBrick, contact } from '../src/scripts/playground-logic.js';
import { createSessions, deviceBest } from '../src/scripts/playground-session.js';

test('Snake rejects reverse and a second turn before the next tick', () => {
  const s = createSnake();
  assert.equal(turnSnake(s, 'left'), false);
  assert.equal(turnSnake(s, 'up'), true);
  assert.equal(turnSnake(s, 'left'), false);
  stepSnake(s);
  assert.deepEqual(s.body[0], { x: 5, y: 8 });
  assert.equal(turnSnake(s, 'left'), true);
  stepSnake(s); assert.deepEqual(s.body[0], { x: 4, y: 8 });
});

test('Snake permits departing tail but rejects occupied body and walls', () => {
  const s = createSnake();
  s.body = [{ x: 2, y: 2 }, { x: 2, y: 3 }, { x: 1, y: 3 }, { x: 1, y: 2 }]; s.direction = 'left';
  stepSnake(s); assert.equal(s.phase, 'playing'); assert.deepEqual(s.body[0], { x: 1, y: 2 });
  s.direction = 'right'; stepSnake(s); assert.equal(s.phase, 'lost');
  const wall = createSnake(); wall.body[0] = { x: 17, y: 9 }; stepSnake(wall);
  assert.equal(wall.phase, 'lost');
  const frozen = structuredClone(wall); stepSnake(wall); assert.deepEqual(wall, frozen);
});

test('portals keep direction, check entry and exit collisions, and allow a departing tail exit', () => {
  const make = () => { const s = createSnake(); s.portals = [{ x: 6, y: 9 }, { x: 12, y: 12 }]; return s; };
  const s = make(); stepSnake(s);
  assert.deepEqual(s.body[0], { x: 12, y: 12 }); assert.equal(s.direction, 'right');
  stepSnake(s); assert.deepEqual(s.body[0], { x: 13, y: 12 });
  const blocked = make(); blocked.body[1] = { x: 12, y: 12 }; stepSnake(blocked); assert.equal(blocked.phase, 'lost');
  const entry = make(); entry.body[1] = { x: 6, y: 9 }; stepSnake(entry); assert.equal(entry.phase, 'lost');
  const tail = make(); tail.body[2] = { x: 12, y: 12 }; stepSnake(tail); assert.equal(tail.phase, 'playing');
});

test('every third mark relocates to distinct free cells; food stays free across random selections', () => {
  for (const random of [() => 0, () => .5, () => .999999, () => 1]) {
    const s = createSnake(), old = structuredClone(s.portals);
    s.score = 2; s.food = { x: 6, y: 9 }; stepSnake(s, random);
    assert.equal(s.score, 3); assert.equal(s.body.length, 4); assert.equal(s.portalRevision, 1);
    assert.equal(new Set(s.portals.map(p => `${p.x},${p.y}`)).size, 2);
    for (const p of s.portals) assert.ok(![...s.body, s.food, ...old].some(q => q.x === p.x && q.y === p.y));
    assert.ok(![...s.body, ...s.portals].some(p => p.x === s.food.x && p.y === s.food.y));
  }
});

test('crowded board terminates selection, wins, and a fresh game resets score and speed', () => {
  const s = createSnake(); s.size = 3; s.portals = [{ x: 0, y: 2 }, { x: 1, y: 2 }];
  s.food = { x: 2, y: 0 }; s.body = [{ x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }];
  stepSnake(s, () => { throw new Error('no random rejection loop'); });
  assert.equal(s.phase, 'won'); assert.equal(s.food, null); assert.equal(s.score, 1);
  assert.deepEqual(freeCells(1, [{ x: 0, y: 0 }]), []);
  assert.equal(snakeInterval({ score: 999 }), 100);
  assert.equal(snakeInterval(createSnake()), 210); assert.equal(createSnake().score, 0);
});

test('charged orthogonal neighbours chain once, score each brick once, and preserve diagonal bricks', () => {
  const s = createBreakout(), hit = s.bricks.find(b => b.row === 1 && b.col === 2);
  clearBrick(s, hit);
  assert.equal(s.bricks.filter(b => !b.alive).length, 8); assert.equal(s.score, 80);
  assert.equal(s.bricks.find(b => b.row === 0 && b.col === 1).alive, true);
  clearBrick(s, hit); assert.equal(s.score, 80);
  for (const b of s.bricks) clearBrick(s, b);
  assert.equal(s.phase, 'won'); assert.equal(s.score, 400);
});

test('circle contacts resolve faces, corners and embedding without false corner hits', () => {
  const rect = { x: 10, y: 10, w: 20, h: 10 };
  assert.equal(contact({ x: 6, y: 6 }, rect), null);
  const c = contact({ x: 7, y: 7 }, rect); assert.ok(c.nx < 0 && c.ny < 0);
  assert.deepEqual(contact({ x: 9, y: 15 }, rect), { nx: -1, ny: 0, depth: 4 });
  assert.ok(Number.isFinite(contact({ x: 20, y: 15 }, rect).depth));
});

test('ball strikes bricks from sides and corners, resolves wall corners, and does not tunnel at long dt', () => {
  for (const ball of [{ x: 12, y: 40, vx: 230, vy: 0 }, { x: 14, y: 28, vx: 160, vy: 160 }]) {
    const s = createBreakout(); s.ball = ball; stepBreakout(s, .02);
    assert.ok(s.score >= 10); assert.ok(s.ball.vx < 0 || s.ball.vy < 0);
  }
  const wall = createBreakout(); wall.ball = { x: 5, y: 5, vx: -100, vy: -100 }; stepBreakout(wall, .02);
  assert.ok(wall.ball.x >= 5 && wall.ball.y >= 5 && wall.ball.vx > 0 && wall.ball.vy > 0);
  const s = createBreakout(); s.ball = { x: 40, y: 160, vx: 0, vy: -240 }; stepBreakout(s, 100);
  assert.equal(s.score, 10); assert.ok(s.ball.vy > 0);
  const paused = structuredClone(s); stepBreakout(s, NaN); assert.deepEqual(s, paused);
});

test('paddle aims left, centre and right; movement and pointer targets clamp', () => {
  for (const offset of [-35, 0, 35]) {
    const s = createBreakout(); s.ball = { x: s.paddle + offset, y: 320, vx: 0, vy: 230 };
    stepBreakout(s, .02); assert.ok(s.ball.vy < 0); assert.equal(Math.sign(s.ball.vx), Math.sign(offset));
  }
  const s = createBreakout(); stepBreakout(s, .05, 0, -100); assert.equal(s.paddle, 42);
  stepBreakout(s, .05, 0, 999); assert.equal(s.paddle, 438);
  stepBreakout(s, .05, -1); assert.ok(s.paddle < 438);
});

test('physical impact on the final brick wins and freezes physics', () => {
  const s = createBreakout();
  s.bricks.forEach((b, i) => { b.alive = i === 0; }); s.score = 390;
  s.ball = { x: 40, y: 57, vx: 0, vy: -230 };
  stepBreakout(s, .02); assert.equal(s.phase, 'won'); assert.equal(s.score, 400);
  const won = structuredClone(s); stepBreakout(s, .05, 1); assert.deepEqual(s, won);
});

test('near-full third mark retains portals when no replacement pair fits', () => {
  const s = createSnake(); s.size = 3; s.score = 2;
  s.portals = [{ x: 0, y: 2 }, { x: 1, y: 2 }];
  s.food = { x: 2, y: 0 }; s.body = [{ x: 1, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }];
  const portals = structuredClone(s.portals); stepSnake(s, () => 0);
  assert.equal(s.score, 3); assert.equal(s.phase, 'playing');
  assert.deepEqual(s.food, { x: 2, y: 2 }); assert.deepEqual(s.portals, portals);
});

test('three misses require explicit new serves, then game over; restart is a fresh complete board', () => {
  const s = createBreakout();
  for (let lives = 2; lives >= 0; lives--) {
    s.phase = 'playing'; s.ball.y = 366; s.ball.vy = 230; stepBreakout(s, .02);
    assert.equal(s.lives, lives); assert.equal(s.phase, lives ? 'serve' : 'lost');
    const still = structuredClone(s); stepBreakout(s, 1); assert.deepEqual(s, still);
  }
  const fresh = createBreakout(); assert.equal(fresh.lives, 3); assert.equal(fresh.score, 0); assert.equal(fresh.bricks.filter(b => b.alive).length, 40);
});

test('session ownership pauses previous game and interruptions never start a game', () => {
  const sessions = createSessions(), events = [];
  const a = { pause: reason => { events.push(['a', reason]); sessions.release(a); } };
  const b = { pause: reason => { events.push(['b', reason]); sessions.release(b); } };
  sessions.start(a); sessions.start(b); assert.deepEqual(events, [['a', 'Other game started.']]);
  sessions.interrupt('hidden'); sessions.interrupt('visible');
  assert.deepEqual(events, [['a', 'Other game started.'], ['b', 'hidden']]);
});

test('best score survives blocked getter/write, rejects corrupt data and stays monotonic', () => {
  const blocked = deviceBest('x', () => { throw new Error('blocked'); });
  blocked.update(10); blocked.update(5); assert.equal(blocked.value, 10); assert.equal(blocked.persistent, false);
  const writes = [], stored = deviceBest('x', () => ({ getItem: () => '20', setItem: (...args) => writes.push(args) }));
  stored.update(10); stored.update(30); stored.update(Infinity); assert.deepEqual(writes, [['x', '30']]);
  const readonly = deviceBest('x', () => ({ getItem: () => 'bad', setItem: () => { throw new Error('quota'); } }));
  assert.equal(readonly.value, 0); readonly.update(40); assert.equal(readonly.value, 40); assert.equal(readonly.persistent, false);
});
