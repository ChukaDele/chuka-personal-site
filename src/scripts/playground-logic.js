// Original classic-inspired mechanics. No DOM, clocks, storage or rendering.
export const DIRECTIONS = { up: [0, -1], right: [1, 0], down: [0, 1], left: [-1, 0] };
const same = (a, b) => a && b && a.x === b.x && a.y === b.y;
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

export function freeCells(size, occupied) {
  const cells = [];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    if (!occupied.some(p => same(p, { x, y }))) cells.push({ x, y });
  }
  return cells;
}
const choose = (cells, random) => cells.length ? cells[Math.min(cells.length - 1, Math.floor(clamp(random(), 0, 1) * cells.length))] : null;

export function createSnake() {
  return { size: 18, body: [{ x: 5, y: 9 }, { x: 4, y: 9 }, { x: 3, y: 9 }],
    direction: 'right', queued: null, food: { x: 9, y: 9 },
    portals: [{ x: 4, y: 4 }, { x: 13, y: 13 }], portalRevision: 0, score: 0, phase: 'playing' };
}
export function turnSnake(s, direction) {
  if (s.phase !== 'playing' || s.queued || !DIRECTIONS[direction] || direction === s.direction) return false;
  const a = DIRECTIONS[s.direction], b = DIRECTIONS[direction];
  if (a[0] + b[0] === 0 && a[1] + b[1] === 0) return false;
  s.queued = direction;
  return true;
}
export const snakeInterval = s => Math.max(100, 210 - s.score * 4);

export function stepSnake(s, random = Math.random) {
  if (s.phase !== 'playing') return;
  s.direction = s.queued || s.direction; s.queued = null;
  const [dx, dy] = DIRECTIONS[s.direction];
  let head = { x: s.body[0].x + dx, y: s.body[0].y + dy };
  const portal = s.portals.findIndex(p => same(p, head));
  const eating = same(head, s.food);
  // The departing tail is legal only on a non-growing move, including portal exits.
  const occupied = eating ? s.body : s.body.slice(0, -1);
  if (head.x < 0 || head.y < 0 || head.x >= s.size || head.y >= s.size || occupied.some(p => same(p, head))) {
    s.phase = 'lost'; return;
  }
  if (portal !== -1) head = { ...s.portals[1 - portal] };
  if (occupied.some(p => same(p, head))) { s.phase = 'lost'; return; }
  s.body.unshift(head);
  if (!eating) { s.body.pop(); return; }
  s.score++;
  s.food = choose(freeCells(s.size, [...s.body, ...s.portals]), random);
  if (!s.food) { s.phase = 'won'; return; }
  if (s.score % 3 === 0) {
    // Both new positions differ from the old pair. Never spawn on body or food.
    const cells = freeCells(s.size, [...s.body, s.food, ...s.portals]);
    if (cells.length >= 2) {
      const a = choose(cells, random);
      const b = choose(cells.filter(p => !same(p, a)), random);
      s.portals = [a, b]; s.portalRevision++;
    }
  }
}

export const ARENA = { width: 480, height: 360, paddleY: 326, paddleWidth: 84, paddleHeight: 10, radius: 5 };
function serve(s) { s.ball = { x: s.paddle, y: 310, vx: 115, vy: -205 }; }
export function createBreakout() {
  const s = { paddle: 240, ball: null, score: 0, lives: 3, phase: 'playing', bricks: [] };
  for (let row = 0; row < 5; row++) for (let col = 0; col < 8; col++) {
    s.bricks.push({ row, col, x: 17 + col * 56, y: 32 + row * 25, w: 54, h: 19,
      charged: (row === 1 && (col === 2 || col === 3)) || (row === 3 && col === 5), alive: true });
  }
  serve(s); return s;
}
export function clearBrick(s, brick) {
  const pending = [brick];
  while (pending.length) {
    const hit = pending.pop();
    if (!hit.alive) continue;
    hit.alive = false; s.score += 10;
    if (hit.charged) pending.push(...s.bricks.filter(b => b.alive && Math.abs(b.row - hit.row) + Math.abs(b.col - hit.col) === 1));
  }
  if (s.bricks.every(b => !b.alive)) s.phase = 'won';
}
// Circle/rectangle contact normal, including corners and the rare embedded case.
export function contact(ball, rect, radius = ARENA.radius) {
  const x = clamp(ball.x, rect.x, rect.x + rect.w), y = clamp(ball.y, rect.y, rect.y + rect.h);
  const dx = ball.x - x, dy = ball.y - y, length = Math.hypot(dx, dy);
  if (length >= radius) return null;
  if (length > 0) return { nx: dx / length, ny: dy / length, depth: radius - length };
  const sides = [
    { nx: -1, ny: 0, depth: ball.x - rect.x + radius },
    { nx: 1, ny: 0, depth: rect.x + rect.w - ball.x + radius },
    { nx: 0, ny: -1, depth: ball.y - rect.y + radius },
    { nx: 0, ny: 1, depth: rect.y + rect.h - ball.y + radius },
  ];
  return sides.sort((a, b) => a.depth - b.depth)[0];
}
export function stepBreakout(s, seconds, movement = 0, target = null) {
  if (s.phase !== 'playing' || !Number.isFinite(seconds)) return;
  // At most 50ms and 1/240s per collision step: <1.1px travel vs a 5px radius.
  const dt = clamp(seconds, 0, .05), count = Math.ceil(dt * 240);
  for (let i = 0; i < count && s.phase === 'playing'; i++) {
    const h = dt / count, b = s.ball, r = ARENA.radius;
    s.paddle = clamp(Number.isFinite(target) ? target : s.paddle + clamp(movement, -1, 1) * 310 * h, 42, 438);
    b.x += b.vx * h; b.y += b.vy * h;
    if (b.x < r) { b.x = r; b.vx = Math.abs(b.vx); }
    if (b.x > ARENA.width - r) { b.x = ARENA.width - r; b.vx = -Math.abs(b.vx); }
    if (b.y < r) { b.y = r; b.vy = Math.abs(b.vy); }
    const paddleHit = contact(b, { x: s.paddle - 42, y: ARENA.paddleY, w: 84, h: 10 });
    if (b.vy > 0 && b.y < ARENA.paddleY + 5 && paddleHit) {
      const aim = clamp((b.x - s.paddle) / 42, -1, 1);
      b.y = ARENA.paddleY - r; b.vx = aim * 210;
      b.vy = -Math.sqrt(250 ** 2 - b.vx ** 2);
    }
    for (const brick of s.bricks) {
      if (!brick.alive) continue;
      const c = contact(b, brick);
      if (!c) continue;
      b.x += c.nx * (c.depth + .001); b.y += c.ny * (c.depth + .001);
      const dot = b.vx * c.nx + b.vy * c.ny;
      if (dot < 0) { b.vx -= 2 * dot * c.nx; b.vy -= 2 * dot * c.ny; }
      clearBrick(s, brick); break;
    }
    if (s.phase === 'playing' && b.y > ARENA.height + r) {
      s.lives--; s.phase = s.lives ? 'serve' : 'lost'; serve(s);
    }
  }
}
