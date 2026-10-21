import { ARENA, createSnake, turnSnake, stepSnake, snakeInterval, createBreakout, stepBreakout } from './playground-logic.js';
import { createSessions, deviceBest } from './playground-session.js';

export function enhancePlayground(root) {
  const lifetime = new AbortController(), signal = lifetime.signal;
  const sessions = createSessions(), disposers = [];
  const listen = (el, name, handler) => el.addEventListener(name, handler, { signal });
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  root.querySelectorAll('[data-game]').forEach(section => {
    const snake = section.dataset.game === 'snake';
    const find = s => section.querySelector(s);
    const canvas = find('canvas'), ctx = canvas.getContext('2d');
    if (!ctx) { find('[data-status]').textContent = 'Canvas is unavailable in this browser.'; return; }
    const make = snake ? createSnake : createBreakout;
    let state = make(), mode = 'ready', frame = 0, previous = null, elapsed = 0, drag = null, target = null;
    const keys = new Set(), holds = new Map(), captures = new Map();
    const best = deviceBest(`playground-${section.dataset.game}-best-v1`);
    const start = find('[data-start]'), pause = find('[data-pause]'), restart = find('[data-restart]');
    const ink = '#25231f', paper = '#eee8db', copper = '#91472f';
    const clearInput = () => {
      keys.clear(); holds.clear(); target = null;
      if (drag !== null && canvas.hasPointerCapture(drag)) canvas.releasePointerCapture(drag);
      drag = null;
      for (const [id, button] of captures) if (button.hasPointerCapture(id)) button.releasePointerCapture(id);
      captures.clear();
    };
    const visible = () => {
      const r = canvas.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
    };
    function paint() {
      ctx.fillStyle = paper; ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (snake) {
        const cell = canvas.width / state.size;
        ctx.strokeStyle = '#d5cdbc'; ctx.lineWidth = 1;
        for (let i = 1; i < state.size; i++) {
          ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, canvas.height);
          ctx.moveTo(0, i * cell); ctx.lineTo(canvas.width, i * cell); ctx.stroke();
        }
        state.portals.forEach((p, i) => {
          ctx.strokeStyle = copper; ctx.lineWidth = 2;
          ctx.strokeRect(p.x * cell + 2, p.y * cell + 2, cell - 4, cell - 4);
          ctx.fillStyle = copper; ctx.font = `bold ${cell * .65}px sans-serif`; ctx.textAlign = 'center';
          ctx.fillText(i ? 'B' : 'A', (p.x + .5) * cell, (p.y + .73) * cell);
        });
        if (state.food) {
          ctx.fillStyle = copper; ctx.beginPath();
          ctx.arc((state.food.x + .5) * cell, (state.food.y + .5) * cell, cell * .27, 0, Math.PI * 2); ctx.fill();
        }
        state.body.forEach((p, i) => {
          ctx.fillStyle = ink; ctx.fillRect(p.x * cell + 3, p.y * cell + 3, cell - 6, cell - 6);
          if (!i) { ctx.fillStyle = paper; ctx.fillRect(p.x * cell + 8, p.y * cell + 8, 4, 4); }
        });
      } else {
        state.bricks.filter(b => b.alive).forEach(b => {
          ctx.fillStyle = b.charged ? copper : ink; ctx.fillRect(b.x, b.y, b.w, b.h);
          if (b.charged) { ctx.fillStyle = paper; ctx.font = '16px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('+', b.x + b.w / 2, b.y + 15); }
        });
        ctx.fillStyle = ink; ctx.fillRect(state.paddle - ARENA.paddleWidth / 2, ARENA.paddleY, ARENA.paddleWidth, ARENA.paddleHeight);
        ctx.fillStyle = copper; ctx.beginPath(); ctx.arc(state.ball.x, state.ball.y, ARENA.radius, 0, Math.PI * 2); ctx.fill();
      }
      if (mode !== 'running') {
        ctx.fillStyle = 'rgba(238,232,219,.94)'; ctx.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
        ctx.fillStyle = ink; ctx.textAlign = 'center';
        ctx.font = `26px ${getComputedStyle(section).getPropertyValue('--display') || 'serif'}`;
        ctx.fillText(mode === 'ready' ? 'Your move.' : mode === 'paused' ? 'Paused.' : state.phase === 'won' ? 'Board cleared.' : 'Game over.', canvas.width / 2, canvas.height / 2 + 9);
      }
    }
    function sync(message) {
      best.update(state.score);
      find('[data-score]').textContent = String(state.score);
      find('[data-best]').textContent = String(best.value);
      find('[data-storage]').textContent = best.persistent ? 'Best on this device' : 'Best this visit · storage unavailable';
      find('[data-detail]').textContent = snake
        ? `Portals A ↔ B · ${state.portals.map(p => `column ${p.x + 1}, row ${p.y + 1}`).join(' ↔ ')}. ${state.score % 3 ? 3 - state.score % 3 : 3} marks until relocation.`
        : `${state.lives} lives · ${state.bricks.filter(b => b.alive).length} bricks left`;
      start.hidden = mode === 'running' || mode === 'paused';
      start.textContent = mode === 'over' ? 'Play again' : 'Start';
      pause.disabled = mode === 'ready' || mode === 'over';
      pause.textContent = mode === 'paused' ? 'Resume' : 'Pause';
      restart.disabled = mode === 'ready';
      if (message) find('[data-status]').textContent = message;
    }
    const session = {
      pause(reason = '') {
        clearInput();
        if (mode !== 'running') return;
        mode = 'paused'; cancelAnimationFrame(frame); previous = null; elapsed = 0;
        sessions.release(session); sync(`Paused. ${reason} Choose Resume to continue.`); paint();
      },
    };
    function positionForPlay() {
      const board = canvas.getBoundingClientRect(), controls = find('[data-controls]').getBoundingClientRect();
      const viewport = window.visualViewport;
      const top = (viewport?.offsetTop ?? 0) + 12;
      const bottom = (viewport?.offsetTop ?? 0) + (viewport?.height ?? window.innerHeight) - 12;
      const end = Math.max(board.bottom, controls.bottom);
      // Include controls when they fit. Otherwise keep the board's top visible;
      // this one-time alignment never takes ownership of subsequent page scrolling.
      const delta = end - board.top > bottom - top
        ? board.top - top
        : Math.min(Math.max(0, end - bottom), board.top - top);
      if (delta) window.scrollBy({ top: delta, left: 0, behavior: 'instant' });
    }
    function run(fresh = false) {
      if (document.hidden) return;
      if (fresh || mode === 'over') state = make();
      if (state.phase === 'serve') state.phase = 'playing';
      clearInput(); sessions.start(session); mode = 'running'; previous = null; elapsed = 0;
      cancelAnimationFrame(frame);
      sync('Playing. Escape pauses.');
      positionForPlay(); canvas.focus({ preventScroll: true });
      if (!visible()) { session.pause('Board left view.'); return; }
      paint(); frame = requestAnimationFrame(tick);
    }
    function tick(time) {
      if (mode !== 'running') return;
      if (document.hidden || !visible()) { session.pause('Board left view.'); return; }
      const dt = previous === null ? 0 : Math.min(50, Math.max(0, time - previous)); previous = time;
      const oldScore = state.score, revision = state.portalRevision;
      if (snake) {
        elapsed += dt;
        if (elapsed >= snakeInterval(state)) { elapsed -= snakeInterval(state); stepSnake(state); }
      } else {
        const inputs = [...keys, ...holds.values()];
        const movement = Number(inputs.includes('right')) - Number(inputs.includes('left'));
        stepBreakout(state, dt / 1000, movement, target);
      }
      if (state.phase === 'serve') { session.pause('Life lost.'); return; }
      if (state.phase !== 'playing') {
        mode = 'over'; clearInput(); sessions.release(session);
        sync(`${state.phase === 'won' ? 'Board cleared!' : 'Game over.'} Score ${state.score}. Choose Play again.`); paint(); return;
      }
      if (state.score !== oldScore) sync(snake && revision !== state.portalRevision ? 'Mark collected. Portals moved; check A and B.' : `Score ${state.score}.`);
      paint(); frame = requestAnimationFrame(tick);
    }
    listen(start, 'click', () => run());
    listen(pause, 'click', () => mode === 'running' ? session.pause() : run());
    listen(restart, 'click', () => run(true));
    const directionKeys = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' };
    listen(section, 'keydown', e => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'Escape' && mode === 'running') { e.preventDefault(); session.pause(); return; }
      const direction = directionKeys[e.key];
      if (mode !== 'running' || !direction || (!snake && !['left', 'right'].includes(direction))) return;
      e.preventDefault();
      if (snake) { if (!e.repeat) turnSnake(state, direction); }
      else { keys.add(direction); target = null; }
    });
    listen(section, 'keyup', e => { const direction = directionKeys[e.key]; if (direction) keys.delete(direction); });
    listen(section, 'focusout', e => { if (!section.contains(e.relatedTarget)) session.pause('Focus left the game.'); });
    section.querySelectorAll('[data-direction]').forEach(button => {
      const direction = button.dataset.direction;
      if (snake) listen(button, 'click', () => { if (mode === 'running') turnSnake(state, direction); });
      else {
        listen(button, 'pointerdown', e => {
          if (mode !== 'running' || e.button !== 0) return;
          holds.set(e.pointerId, direction); target = null; captures.set(e.pointerId, button); button.setPointerCapture(e.pointerId);
        });
        const release = e => { holds.delete(e.pointerId); captures.delete(e.pointerId); };
        for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) listen(button, event, release);
        listen(button, 'click', e => {
          if (mode === 'running' && e.detail === 0) { state.paddle = Math.max(42, Math.min(438, state.paddle + (direction === 'left' ? -24 : 24))); target = null; }
        });
      }
    });
    if (!snake) {
      const aim = e => { const r = canvas.getBoundingClientRect(); target = (e.clientX - r.left) / r.width * ARENA.width; };
      listen(canvas, 'pointerdown', e => {
        if (mode !== 'running' || e.button !== 0 || drag !== null) return;
        canvas.focus({ preventScroll: true }); drag = e.pointerId; canvas.setPointerCapture(drag); aim(e);
      });
      listen(canvas, 'pointermove', e => { if (e.pointerId === drag && mode === 'running') aim(e); });
      for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) listen(canvas, event, e => {
        if (drag === e.pointerId) { drag = null; target = null; }
      });
    }
    let observer;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => { if (!entries[0].isIntersecting) session.pause('Board left view.'); });
      observer.observe(canvas);
    }
    disposers.push(() => { cancelAnimationFrame(frame); clearInput(); observer?.disconnect(); });
    find('[data-controls]').hidden = false;
    sync('Ready. Choose Start to play.'); paint();
  });
  listen(window, 'blur', () => sessions.interrupt('Window lost focus.'));
  listen(window, 'pagehide', () => sessions.interrupt('Page left.'));
  listen(document, 'visibilitychange', () => { if (document.hidden) sessions.interrupt('Tab hidden.'); });
  listen(motion, 'change', () => sessions.interrupt('Motion preference changed.'));
  const dispose = () => { sessions.interrupt(); lifetime.abort(); disposers.forEach(fn => fn()); };
  listen(document, 'astro:before-swap', dispose);
  return dispose;
}
