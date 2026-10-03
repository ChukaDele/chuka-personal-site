import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const place = () => { const t = location.hash.length > 1 ? document.getElementById(location.hash.slice(1)) : null; scrollTo({ top: t ? t.getBoundingClientRect().top + scrollY - 20 : 0, behavior: 'instant' }); };
if (location.hash.length > 1) { place(); addEventListener('load', place, { once: true }); }
const ARROW = '<svg viewBox="0 0 20 14" aria-hidden="true"><path d="M1 7h17M12 1l6 6-6 6"/></svg>';
$$('.arr').forEach((a) => (a.innerHTML = ARROW + ARROW));

/* ---------- sound: real recordings only, dropped into /audio. Nothing synthesised. ---------- */
const files = JSON.parse(document.body.dataset.audio || '[]');
const sound = {
  on: false, els: {},
  get(name) {
    if (this.els[name] !== undefined) return this.els[name];
    const f = files.find((x) => x.startsWith(name + '.'));
    const el = f ? new Audio('audio/' + f) : null;
    if (el && (name === 'room' || name === 'music' || name === 'scratch')) el.loop = true;
    return (this.els[name] = el);
  },
  play(name, vol = 0.6) { if (!this.on) return; const el = this.get(name); if (!el) return; el.volume = vol; if (!el.loop) el.currentTime = 0; el.play().catch(() => {}); },
  fade(name, to, t = 0.4) { const el = this.get(name); if (el) gsap.to(el, { volume: to, duration: t, onComplete: () => { if (to === 0) el.pause(); } }); },
  toggle(v) {
    this.on = v; try { sessionStorage.setItem('sound', v ? '1' : '0'); } catch (e) {}
    if (v) { this.play('room', 0); this.fade('room', 0.35, 1.2); this.play('music', 0); this.fade('music', 0.25, 2); }
    else ['room', 'music', 'scratch'].forEach((n) => this.fade(n, 0, 0.5));
  },
};
const snd = $('#snd');
if (snd) snd.addEventListener('click', () => { sound.toggle(!sound.on); snd.setAttribute('aria-pressed', String(sound.on)); snd.textContent = sound.on ? 'Sound on' : 'Sound off'; });
let scratchT = 0;
function scratch() { if (!sound.on) return; const el = sound.get('scratch'); if (!el) return; if (el.paused) sound.play('scratch', 0.4); else el.volume = 0.4; clearTimeout(scratchT); scratchT = setTimeout(() => sound.fade('scratch', 0, 0.3), 220); }

/* ---------- the fill grows from where the cursor enters ---------- */
document.addEventListener('pointerenter', (e) => {
  const t = e.target; if (!t.classList || !t.classList.contains('fill')) return;
  const r = t.getBoundingClientRect();
  t.style.setProperty('--mx', e.clientX - r.left + 'px'); t.style.setProperty('--my', e.clientY - r.top + 'px');
  t.style.setProperty('--d', 2.3 * Math.max(r.width, r.height) + 'px');
}, true);

/* ---------- hand-drawn circles draw themselves when they arrive ---------- */
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((en) => en.forEach((e) => e.isIntersecting && e.target.classList.add('seen')), { threshold: 0.7 });
  $$('[data-see]').forEach((e) => io.observe(e));
} else $$('[data-see]').forEach((e) => e.classList.add('seen'));

/* ---------- a picture held back in monochrome: it takes colour where it is touched, and its people move ---------- */
const mk = () => document.createElement('canvas');
const settled = new Promise((r) => { const later = () => setTimeout(r, document.documentElement.classList.contains('first') ? 3600 : 1400); if (document.readyState === 'complete') later(); else addEventListener('load', later, { once: true }); });
function Reveal(c, o) {
  const x = c.getContext('2d'), B = new Image(), T = new Image(), m = mk(), mx = m.getContext('2d'), t = mk(), tx = t.getContext('2d');
  const self = this, G = {}, view = o.view || [0, 0, 1, 1];
  let n = 0, done = {}, raf = 0, clock = 0, live = 0, lt = 0, spr = [], soft = null, grown = 0, inkCyc = -1, run = 0, bloomed = false;
  const coarse = matchMedia('(hover: none)').matches && o.touch !== false && !o.focus;
  // Native canvas dimensions exist before the images and cover geometry are ready.
  const imagesReady = () => n >= 2 && [B, T].every((im) => im.complete && im.naturalWidth > 0 && im.naturalHeight > 0);
  const ready = () => imagesReady() && [c.width, c.height, G.k, G.iw, G.ih].every((v) => Number.isFinite(v) && v > 0) && [G.ox, G.oy].every(Number.isFinite);
  function geo() { const w = c.width, h = c.height, iw = T.naturalWidth, ih = T.naturalHeight, vw = (view[2] - view[0]) * iw, vh = (view[3] - view[1]) * ih;
    G.k = Math.max(w / vw, h / vh); G.ox = (w - vw * G.k) * o.fx - view[0] * iw * G.k; G.oy = (h - vh * G.k) * o.fy - view[1] * ih * G.k; G.iw = iw; G.ih = ih; }
  const cover = (ctx, img) => ctx.drawImage(img, G.ox, G.oy, G.iw * G.k, G.ih * G.k);
  function dab(px, py, r) { if (!ready() || ![px, py, r].every(Number.isFinite) || r <= 0) return; const g = mx.createRadialGradient(px, py, r * 0.3, px, py, r); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)'); mx.fillStyle = g; mx.beginPath(); mx.arc(px, py, r, 0, 7); mx.fill(); }
  const at = (p) => [G.ox + p[0] * G.iw * G.k, G.oy + p[1] * G.ih * G.k, p[2] * G.iw * G.k];
  function feather(k) { const kx = k.getContext('2d'), sw = k.width, sh = k.height; kx.globalCompositeOperation = 'destination-in'; kx.translate(sw / 2, sh / 2); kx.scale(1, sh / sw);
    const g = kx.createRadialGradient(0, 0, sw * 0.26, 0, 0, sw * 0.5); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)'); kx.fillStyle = g; kx.fillRect(-sw / 2, -sw / 2, sw, sw); return k; }
  function cut(img, f, whole) { const sw = Math.max(2, Math.ceil(f[2] / 50 * G.iw * G.k)), sh = Math.max(2, Math.ceil(f[3] / 50 * G.ih * G.k)), k = mk(); k.width = sw; k.height = sh;
    if (whole) k.getContext('2d').drawImage(img, 0, 0, sw, sh);
    else k.getContext('2d').drawImage(img, (f[0] - f[2]) / 100 * G.iw, (f[1] - f[3]) / 100 * G.ih, f[2] / 50 * G.iw, f[3] / 50 * G.ih, 0, 0, sw, sh);
    return feather(k); }
  // everything that is not the subject is held out of focus: the picture is shrunk and enlarged again, which softens it in every browser
  function soften() { const w = c.width, h = c.height; let src = null;
    [o.blur, o.blur / 2.6, 1].forEach((d) => { const k = mk(), kx = k.getContext('2d'); k.width = Math.max(2, Math.ceil(w / d)); k.height = Math.max(2, Math.ceil(h / d)); kx.imageSmoothingQuality = 'high';
      if (!src) { kx.scale(1 / d, 1 / d); cover(kx, B); } else kx.drawImage(src, 0, 0, k.width, k.height); src = k; });
    soft = src; }
  let cutDone = false;
  function build() { geo(); if (!ready()) return; if (o.blur) soften(); spr = []; cutDone = false; settled.then(() => requestAnimationFrame(sprites)); }
  function sprites() { if (cutDone || !ready()) return; cutDone = true;
    spr = (o.people || []).map((f) => { const kb = cut(B, f), kt = cut(T, f);
      const q = { b: kb, t: kt, w: kb.width, h: kb.height, px: G.ox + f[0] / 100 * G.iw * G.k, py: G.oy + (f[1] + f[3]) / 100 * G.ih * G.k, amp: f[4], sp: f[5], ph: f[6], bob: f[7] || 0, scr: f[8] || 0, br: f[9] || 0, ink: !!o.ink, alts: [] };
      ((o.redraws || {})[f[10]] || []).forEach((a) => { const im = new Image(); im.onload = () => q.alts.push({ k: cut(im, f, true), every: a.every, hold: a.hold, at: a.at }); im.src = a.src; });
      return q; }); }
  function people(ctx, key) { const u = c.width / 1400;
    spr.forEach((q) => { const a = Math.sin(clock * q.sp + q.ph);
      if (q.scr) {
        // a writing hand stays planted. the fingers carry the pen: a slow sweep along the line from the wrist, small strokes for the letters,
        // short rests between words, then an unhurried lift back to the margin. nothing jumps.
        const cyc = (clock * 0.07 + q.ph * 0.16) % 1, rp = (cyc * 4) % 1, on = rp < 0.8, run = on ? rp / 0.8 : 1 - (rp - 0.8) / 0.2, e = run * run * (3 - 2 * run);
        const word = Math.min(1, Math.max(0, Math.sin(clock * 2.1 + q.ph) * 2 + 1.2)), lift = on ? 0 : Math.sin((rp - 0.8) / 0.2 * Math.PI);
        // the pen travels along the line of writing (the sheet slopes a little up to the right), with small strokes for the letters
        const reach = q.w * 0.2 * q.scr / 5, along = (e - 0.5) * reach + (on ? Math.sin(clock * 9.5 + q.ph) * q.w * 0.012 * word : 0);
        inkCyc = q.ink ? cyc : inkCyc;
        ctx.save(); ctx.translate(q.px - q.w / 2 + along, q.py - q.h / 2 - along * 0.1 - lift * 1.4 * u); ctx.drawImage(q[key], 0, -q.h / 2);
        ctx.restore(); return; }
      const dx = 0, dy = Math.sin(clock * q.sp * 2 + q.ph) * q.bob * u; ctx.save();
      ctx.translate(q.px + dx, q.py + dy);
      ctx.rotate(q.scr ? 0 : a * q.amp); if (q.br) ctx.scale(1 + a * q.br * 0.25, 1 + a * q.br);
      ctx.drawImage(q[key], -q.w / 2, -q.h);
      if (key === 't') q.alts.forEach((al) => { const tt = (clock + al.every - al.at) % al.every; if (tt < al.hold) { ctx.globalAlpha = Math.min(1, tt / 0.35, (al.hold - tt) / 0.35); ctx.drawImage(al.k, -q.w / 2, -q.h); ctx.globalAlpha = 1; } });
      ctx.restore(); }); }
  function inkOn(ctx) { if (!o.ink || inkCyc < 0) return; const [x0, y0, x1, y1] = o.ink, X0 = G.ox + x0 * G.iw * G.k, Y0 = G.oy + y0 * G.ih * G.k, Wd = (x1 - x0) * G.iw * G.k, Ht = (y1 - y0) * G.ih * G.k;
    ctx.save(); ctx.strokeStyle = 'rgba(52,36,24,.62)'; ctx.lineWidth = Math.max(0.7, Ht * 0.032); ctx.lineCap = 'round'; ctx.setLineDash([Wd * 0.13, Wd * 0.045, Wd * 0.2, Wd * 0.05, Wd * 0.09, Wd * 0.045]); ctx.globalAlpha = inkCyc > 0.95 ? (1 - inkCyc) / 0.05 : 1;
    for (let r = 0; r < 4; r++) { const rp = Math.min(1, Math.max(0, inkCyc * 4 - r) / 0.8); if (rp <= 0) continue; const len = rp * Wd * (r === 3 ? 0.6 : 1), y = Y0 + Ht * (r + 0.5) / 4; ctx.beginPath();
      for (let xx = 0; xx <= len; xx += 1.5) ctx.lineTo(X0 + xx, y - 0.1 * xx + Math.sin(xx * 1.9 + r * 2.1) * Ht * 0.014);
      ctx.stroke(); }
    ctx.restore(); }
  function render() { if (!ready()) return; const w = c.width, h = c.height;
    x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, w, h); if (soft) x.drawImage(soft, 0, 0); else cover(x, B); if (!o.afterColour) people(x, 'b');
    tx.globalCompositeOperation = 'source-over'; tx.clearRect(0, 0, w, h); tx.drawImage(m, 0, 0); tx.globalCompositeOperation = 'source-in'; cover(tx, T); tx.globalCompositeOperation = 'source-atop'; inkOn(tx); people(tx, 't');
    x.drawImage(t, 0, 0); }
  const kick = () => { if (!live && !raf) raf = requestAnimationFrame(() => { raf = 0; render(); }); };
  function loop(id, now) { if (!live || id !== run) return; requestAnimationFrame((t) => loop(id, t)); if (now - lt < (innerWidth <= 820 ? 50 : 33)) return; lt = now; clock = now / 1000; render(); }
  let want = false; const go = () => { if (want && !live) { live = 1; const id = ++run; requestAnimationFrame((t) => loop(id, t)); } };
  // on a touch screen there is no cursor to paint with, so the colour arrives by itself, one patch after another
  function bloom() { if (bloomed || !ready()) return; bloomed = true; const ps = o.patches || [];
    if (reduce) { ps.forEach((q) => dab(...at(q))); kick(); return; }
    ps.forEach((q, i) => { const t0 = performance.now() + 500 + i * 420; const step = (now) => { const k = Math.min(1, Math.max(0, (now - t0) / 900)); if (k > 0) { const a = at(q); dab(a[0], a[1], a[2] * (0.35 + 0.65 * k * (2 - k))); kick(); } if (k < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }); }
  this.play = (on) => { if (reduce || !(o.people || []).length) return; want = on; if (on) settled.then(go); else live = 0; };
  this.size = () => { const r = c.getBoundingClientRect(); if (!imagesReady()) return; const d = Math.min(devicePixelRatio || 1, 1.5), w = Math.round(r.width * d), h = Math.round(r.height * d);
    if (![w, h].every((v) => Number.isFinite(v) && v > 0)) return;
    if (!ready() || w !== c.width || h !== c.height) { c.width = m.width = t.width = w; c.height = m.height = t.height = h; done = {}; grown = 0; build(); if (!ready()) return; (o.seeds || []).forEach((p) => dab(...at(p))); if (coarse) { if (bloomed) (o.patches || []).forEach((q) => dab(...at(q))); else settled.then(bloom); } self.scroll(); }
    render(); };
  this.scroll = () => { if (!ready()) return; const r = c.getBoundingClientRect(), vh = innerHeight, p = (vh - r.top) / (vh * 0.5 + r.height * 0.85); if (!Number.isFinite(p)) return;
    // one subject comes into focus and colour as the page is scrolled to it
    if (o.focus) { const f = o.focus, t = Math.min(1, Math.max(0, (p - 0.22) / 0.45)); if (t > grown + 0.02 || (t === 1 && grown < 1)) { grown = t; dab(...at([f[0], f[1], f[2] + (f[3] - f[2]) * t])); kick(); } }
    if (!coarse) (o.patches || []).forEach((q, i) => { if (!done[i] && p > 0.34 + i * 0.07) { done[i] = 1; dab(...at(q)); kick(); } }); };
  B.onload = T.onload = () => { n++; self.size(); };
  T.onerror = () => { if (B.complete && B.naturalWidth) { T.onerror = null; T.src = B.src; } };
  const small = innerWidth <= 820, load = () => { B.src = (small && o.baseSm) || o.base; T.src = (small && o.topSm) || o.top; };
  if (c.hasAttribute('data-lazy') && 'IntersectionObserver' in window) { const lo = new IntersectionObserver((en) => { if (en[0].isIntersecting) { lo.disconnect(); load(); } }, { rootMargin: '150% 0px' }); lo.observe(c); } else load();
  if (o.touch === false) c.style.cursor = 'default'; else c.addEventListener('pointermove', (e) => { if (!ready()) return; const r = c.getBoundingClientRect(); if (!Number.isFinite(r.width) || r.width <= 0) return; const k = c.width / r.width; dab((e.clientX - r.left) * k, (e.clientY - r.top) * k, c.width * (o.rad || 0.1)); kick(); scratch(); });
  if ('IntersectionObserver' in window) new IntersectionObserver((en) => self.play(en[0].isIntersecting), { threshold: 0.03 }).observe(c); else self.play(true);
}
const reveals = $$('canvas[data-reveal]').map((c) => new Reveal(c, JSON.parse(c.dataset.reveal)));
let tick = 0;
addEventListener('scroll', () => { if (!tick) tick = requestAnimationFrame(() => { tick = 0; reveals.forEach((r) => r.scroll()); }); }, { passive: true });
let rz = 0;
addEventListener('resize', () => { if (!rz) rz = requestAnimationFrame(() => { rz = 0; reveals.forEach((r) => r.size()); }); });

/* ---------- the scroll: a sheet of paper unrolls from the foot of the screen and carries you to the next page ---------- */
const sheetEl = $('#sheet'), label = $('p', sheetEl), word = $('.w', sheetEl), quill = $('.quill', sheetEl), flat = $('.flat', sheetEl);
let sheet = null;
// three.js is only needed for the rolling sheet between pages. it is fetched when a page change is likely (a link is hovered, touched or focused),
// or once the page has been idle for a while; a page that is arriving by the sheet needs it straight away, and has it cached.
let wantSheet; const sheetReady = new Promise((done) => { let asked = false; wantSheet = () => { if (asked) return; asked = true; import('./sheet.js').then((m) => { sheet = m.make($('canvas', sheetEl)); done(); }, done); };
  if (document.documentElement.classList.contains('arriving')) wantSheet();
  else addEventListener('load', () => setTimeout(() => ('requestIdleCallback' in window ? requestIdleCallback(wantSheet, { timeout: 4000 }) : wantSheet()), 6000), { once: true }); });
const soon = (ms) => Promise.race([sheetReady, new Promise((r) => setTimeout(r, ms))]);
const root = document.documentElement;
const inkFont = () => (document.fonts && document.fonts.load ? document.fonts.load('80px "Reenie Beanie"').catch(() => {}) : Promise.resolve());
inkFont();
/* a quill writes the name of the page on the sheet: the word appears under the nib as it travels, the pen rocks with each letter, then lifts away */
const ink = $('.ink', sheetEl), swash = $('.swash', sheetEl);
function write(name, sign, pace = 1) {
  ink.classList.toggle('sign', !!sign); gsap.set(swash, { clipPath: 'inset(-80% 0 -80% 100%)' }); word.textContent = name; gsap.set(label, { opacity: 1 });
  const n = Math.max(3, name.length), st = { p: 0 }, w = word.offsetWidth, tip = quill.getBoundingClientRect().width * 0.083;
  const put = () => { const p = st.p, lift = Math.abs(Math.sin(p * n * Math.PI));
    gsap.set(word, { clipPath: `inset(-40% ${(1 - p) * 100}% -40% 0)` });
    gsap.set(quill, { x: p * w - tip, y: -lift * 7, rotation: -4 + lift * 7 }); };
  gsap.set(quill, { opacity: 1 }); put();
  const tl = gsap.timeline().to(st, { p: 1, duration: Math.min(1.5, 0.45 + n * 0.06) * (sign ? 1.05 : pace), ease: 'power1.inOut', onUpdate: () => { put(); scratch(); } });
  // signing: the pen sweeps back under the word in one stroke
  if (sign) { const sw = { p: 0 }; tl.to(quill, { y: w * 0.06 + 8, rotation: -2, duration: 0.15 }).to(sw, { p: 1, duration: 0.42, ease: 'power2.inOut', onUpdate: () => { gsap.set(swash, { clipPath: `inset(-80% 0 -80% ${(1 - sw.p) * 100}%)` }); gsap.set(quill, { x: (1 - sw.p * 0.98) * w - tip }); scratch(); } }); }
  return tl.to(quill, { x: '+=46', y: '-=60', rotation: 14, opacity: 0, duration: 0.3, ease: 'power2.in' });
}
const written = (name) => { ink.classList.remove('sign'); word.textContent = name; gsap.set(word, { clipPath: 'none' }); gsap.set(quill, { opacity: 0 }); gsap.set(label, { opacity: 1 }); };
const paper = () => { if (sheet) { sheet.fit(); sheet.u.uEdge.value = 1.2; sheet.u.uLift.value = 0; sheet.draw(); gsap.set(flat, { y: 0, yPercent: -100 }); } else gsap.set(flat, { y: 0, yPercent: 0 }); };
function liftAway(delay) {
  const done = () => { sheetEl.classList.remove('on'); gsap.set(label, { opacity: 0 }); sound.play('settle', 0.5); };
  const tl = gsap.timeline({ onComplete: done, delay }).to(label, { opacity: 0, duration: 0.2 });
  if (sheet) tl.to(sheet.u.uLift, { value: 1.25, duration: 0.5, ease: 'power2.inOut', onUpdate: sheet.draw }, 0.1);
  else tl.to(flat, { yPercent: -100, duration: 0.6, ease: 'power3.inOut' }, 0.1);
  return tl;
}
function unrollTo(href, name) {
  if (reduce) { location.href = href; return; }
  // the pen writes each page's name. the first time in a visit it takes its time; after that it is brisk, so moving around never feels slow
  let again = false; try { again = sessionStorage.getItem('wrote') === '1'; sessionStorage.setItem('wrote', '1'); sessionStorage.setItem('sheet', name || ''); } catch (e) {}
  const pace = again ? 0.42 : 0.62, up = again ? 0.42 : 0.55;
  sheetEl.classList.add('on'); gsap.set(label, { opacity: 0 }); sound.play('unroll', 0.6);
  const tl = gsap.timeline({ onComplete: () => { location.href = href; } });
  if (sheet) { sheet.fit(); sheet.u.uLift.value = 0; sheet.u.uEdge.value = -0.06; gsap.set(flat, { y: 0, yPercent: 100 });
    tl.to(sheet.u.uEdge, { value: 1.16, duration: up, ease: 'power2.out', onUpdate: sheet.draw });
  } else tl.fromTo(flat, { y: 0, yPercent: 100 }, { yPercent: 0, duration: up, ease: 'power3.inOut' });
  const at0 = again ? 0.2 : 0.3;
  tl.add(() => { inkFont().then(() => write(name || '', false, pace)); }, at0).to({}, { duration: Math.min(1.5, 0.45 + Math.max(3, (name || '').length) * 0.06) * pace + (again ? 0.22 : 0.4) }, at0);
  setTimeout(() => { sheetEl.classList.remove('on'); gsap.set(label, { opacity: 0 }); }, 6000);
}
function arrive() {
  let name = null;
  try { name = sessionStorage.getItem('sheet'); sessionStorage.removeItem('sheet'); } catch (e) {}
  if (name === null || reduce) { root.classList.remove('arriving'); return 0; }
  sheetEl.classList.add('on'); gsap.set(flat, { y: 0, yPercent: 0 }); written(name); root.classList.remove('arriving');
  soon(900).then(() => { paper(); liftAway(0.1); }); return 0.45;
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href]'); if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
  const href = a.getAttribute('href'); if (!/^[\w-]+\.html(#.*)?$/.test(href)) return;
  const here = (location.pathname.split('/').pop() || 'index.html'); if (href.split('#')[0] === here) return;
  e.preventDefault(); unrollTo(href, a.dataset.name || a.textContent.trim().split('\n')[0]);
});
const fetched = new Set();
const prefetch = (e) => { const a = e.target.closest && e.target.closest('a[href]'); if (!a) return; const href = a.getAttribute('href'); if (!/^[\w-]+\.html(#.*)?$/.test(href)) return; const u = href.split('#')[0]; wantSheet();
  if (fetched.has(u)) return; fetched.add(u); const l = document.createElement('link'); l.rel = 'prefetch'; l.href = u; document.head.appendChild(l); };
document.addEventListener('pointerenter', prefetch, true); document.addEventListener('touchstart', prefetch, { passive: true, capture: true });
addEventListener('pageshow', (e) => { if (e.persisted) { sheetEl.classList.remove('on'); gsap.set(label, { opacity: 0 }); } });

/* ---------- arriving: by the scroll from another page, or for the first time, when the pen signs the sheet before it lifts ---------- */
let wait = arrive(), heroIn = null;
if (!wait && root.classList.contains('first') && !reduce) {
  const name = sheetEl.dataset.sign || 'Chuka';
  sheetEl.classList.add('on'); gsap.set(flat, { y: 0, yPercent: 0 }); gsap.set(label, { opacity: 0 }); root.classList.remove('first');
  // the signature takes about two seconds. any tap or key lifts the sheet at once
  let started = false, gone = false, tl = null;
  const off = () => { removeEventListener('pointerdown', skip, true); removeEventListener('keydown', skip, true); };
  const leave = (d) => { if (gone) return; gone = true; off(); liftAway(d); };
  function skip() { if (tl) tl.kill(); gsap.set(quill, { opacity: 0 }); if (heroIn) heroIn.progress(1); leave(0); }
  const start = () => { if (started || gone) return; started = true; tl = write(name, true); tl.eventCallback('onComplete', () => leave(0.2)); };
  addEventListener('pointerdown', skip, true); addEventListener('keydown', skip, true);
  inkFont().then(start); setTimeout(start, 1000);
  wait = 2;
} else root.classList.remove('first');
/* ---------- motion: every section composes itself as it is scrolled into frame. nothing already on screen is hidden first ---------- */
const ease = 'power3.out';
ScrollTrigger.config({ ignoreMobileResize: true });
function motion() {
  root.classList.add('mo');
  const first = $('.plate'), vh = innerHeight;
  const below = (el) => el && el.getBoundingClientRect().top > vh * 0.92;
  // the opening plate is never held back. when the sheet lifts off it, the words settle into place; on an ordinary load they are simply there
  if (first && wait) heroIn = gsap.from($$('.cap > *', first), { y: 22, duration: 0.7, ease, stagger: 0.05, delay: wait + 0.1, clearProps: 'transform' });
  // full-bleed pictures drift against the scroll, on screens with room for it
  gsap.matchMedia().add('(min-width: 821px)', () => {
    $$('.plate img.still').forEach((img) => { gsap.set(img, { scale: 1.1 }); gsap.fromTo(img, { yPercent: -3.5 }, { yPercent: 3.5, ease: 'none', scrollTrigger: { trigger: img.closest('.plate'), start: 'top bottom', end: 'bottom top', scrub: 0.6 } }); });
  });
  // each section: its rule draws across, the word rises, the content follows in order
  $$('.part').forEach((part) => {
    if (!below(part)) { part.classList.add('in'); return; }
    const word = $(':scope > .vword', part), body = $(':scope > .body', part), kids = body ? [...body.children] : [];
    gsap.timeline({ scrollTrigger: { trigger: part, start: 'top 92%', once: true, onEnter: () => part.classList.add('in') } })
      .from(word, { clipPath: 'inset(0 0 100% 0)', duration: 0.7, ease }, 0)
      .from(kids, { y: 16, opacity: 0, duration: 0.6, ease, stagger: 0.06, clearProps: 'transform,opacity' }, 0);
  });
  // sketches draw themselves stroke by stroke; their labels follow
  $$('.sketch svg').forEach((svg) => {
    if (!below(svg)) return;
    const lines = $$('path, circle, rect', svg).filter((el) => !el.closest('.flag, defs') && !el.getAttribute('stroke-dasharray') && el.getTotalLength), flags = $$('.flag', svg);
    lines.forEach((el) => { const L = el.getTotalLength(); el.style.strokeDasharray = L; el.style.strokeDashoffset = L; });
    gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 88%', once: true } })
      .to(lines, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut', stagger: 0.05 })
      .from($$('text', svg), { opacity: 0, duration: 0.4, stagger: 0.04 }, 0.2)
    if (flags.length) gsap.from(flags, { opacity: 0, duration: 0.6, stagger: 0.15, scrollTrigger: { trigger: svg, start: 'top 88%', once: true }, delay: 0.5 });
  });
  // handwriting is written on, left to right
  $$('.note').forEach((n) => { if ((first && first.contains(n)) || n.closest('.pulled') || !below(n)) return; gsap.from(n, { clipPath: 'inset(-20% 100% -20% 0)', duration: 0.9, ease: 'power1.inOut', clearProps: 'clipPath', scrollTrigger: { trigger: n, start: 'top 92%', once: true } }); });
  $$('.result b').forEach((b) => below(b) && gsap.from(b, { scale: 0.94, opacity: 0, duration: 0.5, ease, clearProps: 'transform,opacity', scrollTrigger: { trigger: b, start: 'top 90%', once: true } }));
  $$('.prints').forEach((pr) => below(pr) && gsap.from($$('.print-p', pr), { y: 40, opacity: 0, rotation: (i) => (i % 2 ? 7 : -7), duration: 0.7, ease, stagger: 0.07, clearProps: 'transform,opacity', scrollTrigger: { trigger: pr, start: 'top 88%', once: true } }));
  // later plates and the foot of the page
  $$('.plate').slice(1).forEach((pl) => { if (!below(pl)) return; const tl = gsap.timeline({ scrollTrigger: { trigger: pl, start: 'top 80%', once: true } });
    tl.from($('.vword', pl), { clipPath: 'inset(0 0 0 100%)', duration: 0.8, ease }).from($$('.cap > *', pl), { y: 18, opacity: 0, duration: 0.6, ease, stagger: 0.06, clearProps: 'transform,opacity' }, 0.1); });
  $$('.end').forEach((end) => below(end) && gsap.from($$('.cap2 > *, .next > *', end), { y: 16, opacity: 0, duration: 0.6, ease, stagger: 0.06, clearProps: 'transform,opacity', scrollTrigger: { trigger: end, start: 'top 95%', once: true } }));
  addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
}
if (!reduce) motion();
try { sessionStorage.setItem('seen', '1'); } catch (e) {}

/* ---------- small things: a drawing that rests when it is off screen, sketches that say when there is more to the side, bios that copy ---------- */
if ('IntersectionObserver' in window) { const dio = new IntersectionObserver((en) => en.forEach((e) => e.target.classList.toggle('off', !e.isIntersecting))); $$('.drawn').forEach((d) => dio.observe(d)); }
$$('.sketch').forEach((sk) => { const set = () => sk.classList.toggle('more', sk.scrollWidth - sk.clientWidth - sk.scrollLeft > 12); set(); sk.addEventListener('scroll', set, { passive: true }); addEventListener('resize', set); });
document.addEventListener('click', (e) => { const b = e.target.closest('[data-copy-bio]'); if (!b) return; const text = $('[data-bio]', b.parentElement).textContent, lab = b.firstChild;
  const say = (t) => { lab.textContent = t + ' '; setTimeout(() => { lab.textContent = 'Copy this bio '; }, 2200); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => say('Copied'), () => say('Select the text to copy it')); else say('Select the text to copy it'); });

/* ---------- the shelf: a volume comes off the shelf and turns to show its cover ---------- */
$$('[data-case]').forEach((box) => {
  const books = $$('[data-book]', box), pk = $('[data-pk]', box), pt = $('[data-pt]', box), pb = $('[data-pb]', box), pw = $('[data-pw]', box), pl = $('[data-pl]', box), plt = $('[data-plt]', box), idle = [pk.textContent, pt.textContent, pb.textContent];
  const verb = { Book: 'Find the book', Talk: 'Watch it', Podcast: 'Listen', Essays: 'Read the essays' };
  const touch = matchMedia('(hover: none), (max-width: 820px)').matches, back = $('[data-pback]', box);
  if (back) back.addEventListener('click', () => pull(null));
  let cur = null, intent = 0;
  const pull = (b) => { if (cur === b) return; if (cur) cur.classList.remove('on'); cur = b; box.classList.toggle('has', !!b); if (back) back.hidden = !b;
    if (b) { b.classList.add('on'); sound.play('tap', 0.4); pk.textContent = b.dataset.kind; pt.textContent = b.dataset.title; pb.textContent = b.dataset.by;
      pw.textContent = b.dataset.why; pw.hidden = false; const pq = $('[data-pq]', box); if (pq) { pq.textContent = b.dataset.quote || ''; pq.hidden = !b.dataset.quote; } pl.href = b.dataset.href; plt.textContent = verb[b.dataset.kind] || 'Open'; pl.hidden = false;
      if (!reduce) { gsap.fromTo([pk, pt, pb], { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out', stagger: 0.04, overwrite: true }); gsap.fromTo(pw, { clipPath: 'inset(-20% 100% -20% 0)' }, { clipPath: 'inset(-20% 0% -20% 0)', duration: 0.6, ease: 'power1.inOut', delay: 0.1, overwrite: true }); gsap.fromTo(pl, { opacity: 0 }, { opacity: 1, duration: 0.3, overwrite: true }); } }
    else { [pk.textContent, pt.textContent, pb.textContent] = idle; pw.hidden = true; pl.hidden = true; const pq = $('[data-pq]', box); if (pq) pq.hidden = true; } };
  books.forEach((b) => {
    let was = null;
    // a short pause before a book comes out, so brushing past the spines does not set them all moving
    b.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'mouse') return; clearTimeout(intent); intent = setTimeout(() => pull(b), 130); });
    b.addEventListener('pointerleave', () => clearTimeout(intent));
    b.addEventListener('pointerdown', () => { was = cur; });
    b.addEventListener('focus', () => pull(b));
    b.addEventListener('click', (e) => { if (e.detail === 0) { pull(b); pl.focus(); return; } pull(was === b && !matchMedia('(hover:hover)').matches ? null : b); was = null; });
  });
  document.addEventListener('keydown', (e) => { if (e.key !== 'Escape') return; const back = document.activeElement === pl ? cur : null; if (back) back.focus(); else pull(null); });
  // on a touch screen the first volume comes out by itself when the shelf arrives, so the shelf shows what it does
  if (touch && 'IntersectionObserver' in window) { const sio = new IntersectionObserver((en) => { if (en[0].isIntersecting) { sio.disconnect(); setTimeout(() => { if (!cur) pull(books[0]); }, 500); } }, { threshold: 0.4 }); sio.observe($('.bookcase', box)); }
});

/* ---------- phone menu: a full screen of its own. the page behind is out of reach while it is open, and Back closes it ---------- */
const menuBtn = $('.menu-btn'), navEl = $('#site-nav');
if (menuBtn && navEl) {
  const behind = [$('#main'), $('.foot')]; let leaving = false;
  const isOpen = () => root.classList.contains('menu-open');
  const setMenu = (open, viaBack) => { if (open === isOpen()) return;
    menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.textContent = open ? 'Close' : 'Menu'; root.classList.toggle('menu-open', open); behind.forEach((el) => { if (el) el.inert = open; });
    try { if (open) history.pushState({ menu: 1 }, ''); else if (!viaBack && history.state && history.state.menu) history.back(); } catch (e) {}
    if (open && !reduce) gsap.fromTo($$('a, button', navEl), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out', stagger: 0.03, clearProps: 'all' }); };
  menuBtn.addEventListener('click', () => setMenu(!isOpen()));
  // a link leaves the menu on screen until the sheet covers it; the letter button closes it first
  navEl.addEventListener('click', (e) => { if (e.target.closest('button')) setMenu(false); else if (e.target.closest('a') && isOpen()) { leaving = true; try { if (history.state && history.state.menu) history.back(); } catch (err) {} } });
  addEventListener('popstate', () => { if (!leaving) setMenu(false, true); });
  addEventListener('pageshow', (e) => { if (e.persisted) { leaving = false; setMenu(false, true); } });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) { setMenu(false); menuBtn.focus(); } });
  matchMedia('(min-width: 821px)').addEventListener('change', () => setMenu(false));
}

/* ---------- the letter: one form that asks each visitor only what their kind of visit needs ---------- */
const letter = $('#letter');
if (letter) {
  const form = $('form', letter), fields = $('[data-fields]', letter), nextStep = $('[data-next]', letter), compose = $('[data-compose]', letter), sent = $('[data-sent]', letter);
  const endpoint = letter.dataset.endpoint || '', how = $('[data-how]', letter), sendLabel = $('[data-send]', letter);
  how.textContent = endpoint ? 'Your details are used to reply to you, and for nothing else.' : `This opens your own email with the letter written out, addressed to ${letter.dataset.mail}. Your details are used to reply to you, and for nothing else.`;
  // one question per line; [field name, label, kind]
  const paths = {
    hiring: { subject: 'A role', q: [['role', 'The role'], ['company', 'The company'], ['needs', 'What it needs in the first ninety days', 'long'], ['when', 'When you want someone in place']], next: 'I will reply within 24 hours, with my CV and where I am on timing.' },
    project: { subject: 'Something that needs building', q: [['stuck', 'What is getting stuck', 'long'], ['company', 'The company'], ['team', 'The size of the team'], ['when', 'When it needs to be moving']], next: 'I will reply within 24 hours, with questions or a time to talk it through.' },
    press: { subject: 'Speaking or press', q: [['event', 'The event or publication'], ['date', 'The date'], ['format', 'The format: talk, panel, podcast, interview'], ['room', 'Who will be in the room, or reading']], next: 'I will reply within 24 hours, with availability. Bios and portraits are on the Press page.' },
    hello: { subject: 'Hello', q: [['note', 'What is on your mind', 'long']], next: 'I read everything that arrives, and reply within 24 hours.' },
  };
  const kept = {}, auto = { role: 'organization-title', company: 'organization' }; let shown = null;
  const grow = (t) => { t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; };
  const show = (k) => { const p = paths[k]; if (!p || k === shown) return; shown = k; $$('textarea', fields).forEach((t) => { kept[t.name] = t.value; });
    fields.innerHTML = p.q.map(([n, l, kind]) => `<label class="line"><span>${l}</span><textarea name="${n}" rows="${kind === 'long' ? 2 : 1}" autocomplete="${auto[n] || 'off'}" autocapitalize="sentences" enterkeyhint="${kind === 'long' ? 'enter' : 'next'}" required aria-describedby="err-${n}"></textarea><em class="err" id="err-${n}" role="alert" data-err="${n}"></em></label>`).join('');
    nextStep.textContent = p.next; $$('textarea', fields).forEach((t) => { if (kept[t.name]) t.value = kept[t.name]; grow(t); t.addEventListener('input', () => { grow(t); setErr(t.name, ''); }); });
    // a single-line answer moves on with Enter, like any form
    $$('textarea[rows="1"]', fields).forEach((t) => t.addEventListener('keydown', (e) => { if (e.key !== 'Enter') return; e.preventDefault(); const all = $$('textarea, input:not([type="radio"]), select', compose), nx = all[all.indexOf(t) + 1]; if (nx) nx.focus(); }));
    if (!reduce && letter.open) gsap.from($$('.line', fields), { y: 8, opacity: 0, duration: 0.25, ease: 'power3.out', stagger: 0.03, clearProps: 'transform,opacity' }); };

  // phone: Google's libphonenumber rules, fetched the first time the letter is opened
  const country = form.elements.country, phone = form.elements.phone; let lib = null, countries = [];
  const guess = () => { const r = (navigator.language || '').split('-')[1]; if (r && r.length === 2) return r.toUpperCase(); try { const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; if (tz === 'Africa/Lagos') return 'NG'; if (tz.startsWith('America/')) return 'US'; } catch (e) {} return 'GB'; };
  // the country picker: a flag and a code on the line, and a list on the same paper to choose from
  const flagOf = (c) => String.fromCodePoint(...[...c].map((ch) => 127397 + ch.charCodeAt(0))), esc = (t) => t.replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  const ccBtn = $('[data-cc]', letter), ccPop = $('[data-cc-pop]', letter), ccQ = $('[data-cc-q]', letter), ccList = $('[data-cc-list]', letter); let ccAt = -1;
  const rowOf = (c) => countries.find((x) => x[0] === c);
  const setCountry = (c) => { const row = rowOf(c); if (!row) return; country.value = c; $('[data-cc-flag]', letter).textContent = flagOf(c); $('[data-cc-code]', letter).textContent = '+' + row[2]; ccBtn.setAttribute('aria-label', `Country calling code: ${row[1]}, +${row[2]}`); };
  const ccMark = (i) => { const items = $$('[role="option"]', ccList); if (!items.length) { ccAt = -1; ccQ.removeAttribute('aria-activedescendant'); return; } ccAt = (i + items.length) % items.length; items.forEach((el, k) => el.classList.toggle('act', k === ccAt)); items[ccAt].scrollIntoView({ block: 'nearest' }); ccQ.setAttribute('aria-activedescendant', items[ccAt].id); };
  const ccDraw = (q) => { const k = q.trim().toLowerCase().replace(/^\+/, ''); const rows = countries.filter(([c, n, code]) => !k || n.toLowerCase().includes(k) || code.startsWith(k) || c.toLowerCase() === k);
    ccList.innerHTML = rows.map(([c, n, code]) => `<li role="option" id="cc-${c}" data-c="${c}" aria-selected="${c === country.value}"><span class="flag" aria-hidden="true">${flagOf(c)}</span><span class="n">${esc(n)}</span><span class="d">+${code}</span></li>`).join('') || '<li class="none">No country matches that.</li>';
    ccMark(Math.max(0, k ? 0 : rows.findIndex((r) => r[0] === country.value))); };
  const ccOpen = async (on) => { if (on && !countries.length) await loadPhone(); if (on && !countries.length) return; ccPop.hidden = !on; ccBtn.setAttribute('aria-expanded', String(on));
    if (on) { ccQ.value = ''; ccDraw(''); if (matchMedia('(hover:hover)').matches) ccQ.focus({ preventScroll: true }); ccPop.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); } };
  const ccPick = (c) => { setCountry(c); ccOpen(false); phone.dispatchEvent(new Event('input')); phone.focus({ preventScroll: true }); };
  ccBtn.addEventListener('click', () => ccOpen(ccPop.hidden));
  ccBtn.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown' && ccPop.hidden) { e.preventDefault(); ccOpen(true); } });
  ccList.addEventListener('click', (e) => { const li = e.target.closest('[data-c]'); if (li) ccPick(li.dataset.c); });
  ccQ.addEventListener('input', () => ccDraw(ccQ.value));
  ccQ.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown') { e.preventDefault(); ccMark(ccAt + 1); } else if (e.key === 'ArrowUp') { e.preventDefault(); ccMark(ccAt - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); const it = $$('[role="option"]', ccList)[ccAt]; if (it) ccPick(it.dataset.c); } else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); ccOpen(false); ccBtn.focus(); } else if (e.key === 'Tab') ccOpen(false); });
  letter.addEventListener('click', (e) => { if (!ccPop.hidden && !e.target.closest('[data-cc-pop], [data-cc]')) ccOpen(false); });
  const loadPhone = () => lib || (lib = import('libphonenumber-js/min').then((m) => { let names = { of: (c) => c }; try { names = new Intl.DisplayNames([navigator.language || 'en'], { type: 'region' }); } catch (e) { try { names = new Intl.DisplayNames(['en'], { type: 'region' }); } catch (e2) {} }
    countries = m.getCountries().map((c) => { let n = c; try { n = names.of(c) || c; } catch (e) {} return [c, n, m.getCountryCallingCode(c)]; }).sort((a, b) => a[1].localeCompare(b[1])); const pick = guess(); setCountry(rowOf(pick) ? pick : 'GB');
    phone.addEventListener('input', () => { const v = phone.value; if (v.trim().startsWith('+')) { const p = m.parsePhoneNumberFromString(v); if (p && p.country) setCountry(p.country); }
      const typed = new m.AsYouType(country.value).input(v); if (v.length >= (phone.dataset.len || 0)) phone.value = typed; phone.dataset.len = phone.value.length; setErr('phone', ''); });
    return m; }).catch(() => null));
  const setErr = (name, msg) => { const el = $(`[data-err="${name}"]`, letter); if (el) el.textContent = msg; const input = form.elements[name]; if (input && input.setAttribute) input.setAttribute('aria-invalid', msg ? 'true' : 'false'); };
  ['name', 'email'].forEach((n) => form.elements[n].addEventListener('input', () => setErr(n, '')));
  // nothing goes out half empty: every question on the chosen path, a name and an address are needed. only the phone number is optional
  const check = async () => { let ok = true; const name = form.elements.name.value.trim(), email = form.elements.email.value.trim(); let tel = '';
    paths[form.path.value].q.forEach(([n]) => { const v = (form.elements[n].value || '').trim(); setErr(n, v ? '' : 'This line is still empty. A few words will do.'); if (!v) ok = false; });
    setErr('name', ''); setErr('email', ''); setErr('phone', '');
    if (!name) { setErr('name', 'Please sign it, so I know who to answer.'); ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setErr('email', email ? 'That address does not look complete.' : 'I need an address to reply to.'); ok = false; }
    if (phone.value.trim()) { const m = await loadPhone(); const p = m && m.parsePhoneNumberFromString(phone.value, country.value);
      if (m && !(p && p.isValid())) { setErr('phone', `That does not look like a full number for ${(rowOf(country.value) || [])[1] || 'that country'}. Check it, or leave it out.`); ok = false; } else tel = p ? p.formatInternational() : phone.value.trim(); }
    if (!ok) { const bad = $('[aria-invalid="true"]', letter); if (bad) { bad.focus({ preventScroll: true }); bad.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' }); } }
    return ok ? { name, email, tel } : null; };
  const body = (who) => { const p = paths[form.path.value]; const lines = p.q.map(([n, l]) => { const v = (form.elements[n].value || '').trim(); return v ? `${l}:\n${v}` : ''; }).filter(Boolean);
    return ['Dear Chuka,', '', ...lines.flatMap((x) => [x, '']), who.name, who.email, who.tel].filter((x, i, a) => x !== '' || a[i - 1] !== '').join('\n').trim(); };
  const thank = (who, viaMail) => { compose.hidden = true; sent.hidden = false; letter.classList.add('is-sent'); form.scrollTop = 0;
    $('[data-thanks]', sent).textContent = `Thank you, ${who.name.split(/\s+/)[0]}.`;
    $('[data-sent-line]', sent).textContent = viaMail ? 'Your letter is written out in your email. Press send there and it reaches me.' : 'Your letter is on its way.';
    sent.focus({ preventScroll: true });
    // the note arrives quietly; only the signature is written
    if (!reduce) { gsap.fromTo($$('.hand:not(.sign), .btns', sent), { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: 'power3.out', stagger: 0.08, clearProps: 'transform,opacity' });
      gsap.fromTo($('.sign', sent), { clipPath: 'inset(-30% 100% -30% 0)' }, { clipPath: 'inset(-30% 0% -30% 0)', duration: 0.7, ease: 'power1.inOut', delay: 0.35 }); } scratch(); };
  const open = (k) => { compose.hidden = false; sent.hidden = true; letter.classList.remove('is-sent', 'closing'); const r = $(`input[value="${k}"]`, form) || $('input[name="path"]', form); r.checked = true; show(r.value); loadPhone();
    if (letter.showModal) letter.showModal(); else letter.setAttribute('open', '');
    form.scrollTop = 0; $$('textarea', fields).forEach(grow); // measured once the letter is on screen, so every line has its height
    const first = $('textarea', fields); if (first && matchMedia('(hover:hover)').matches) first.focus({ preventScroll: true }); };
  let closing = 0;
  const shut = () => { if (!letter.open || closing) return; if (reduce) { letter.close(); return; } letter.classList.add('closing'); closing = setTimeout(() => { closing = 0; letter.classList.remove('closing'); letter.close(); }, 190); };
  letter.addEventListener('cancel', (e) => { e.preventDefault(); if (!ccPop.hidden) { ccOpen(false); ccBtn.focus(); return; } shut(); });
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-letter]'); if (b) { e.preventDefault(); open(b.dataset.letter); }
    if (e.target.closest('[data-close]') || e.target === letter) shut(); });
  form.addEventListener('change', (e) => { if (e.target.name === 'path') show(e.target.value); });
  const copyBtn = $('[data-copy]', letter);
  if (copyBtn) copyBtn.addEventListener('click', async () => { const who = await check(); if (!who) return; const text = body(who);
    const done = () => { copyBtn.textContent = `copied. send it to ${letter.dataset.mail}`; }, fail = () => { copyBtn.textContent = `could not copy. write to ${letter.dataset.mail}`; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fail); else fail(); });
  form.addEventListener('submit', async (e) => { e.preventDefault(); const who = await check(); if (!who) return; const p = paths[form.path.value], text = body(who);
    if (endpoint) { sendLabel.textContent = 'Sending'; try { const answers = Object.fromEntries(p.q.map(([n]) => [n, (form.elements[n].value || '').trim()]));
        const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ reason: p.subject, ...answers, name: who.name, email: who.email, phone: who.tel, letter: text }) });
        if (!res.ok) throw new Error(String(res.status)); sendLabel.textContent = 'Send it'; thank(who, false);
      } catch (err) { sendLabel.textContent = 'Send it'; $('[data-how]', letter).textContent = `That did not go through. Use "copy the letter" and send it to ${letter.dataset.mail}.`; }
    } else { location.href = `mailto:${letter.dataset.mail}?subject=${encodeURIComponent(p.subject)}&body=${encodeURIComponent(text)}`; thank(who, true); } });
}
