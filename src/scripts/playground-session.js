// One explicit run owner. Interruptions clear input and never resume automatically.
export function createSessions() {
  let active = null;
  return {
    start(session) {
      if (active && active !== session) active.pause('Other game started.');
      active = session;
    },
    release(session) { if (active === session) active = null; },
    interrupt(reason) { if (active) active.pause(reason); },
  };
}
export function deviceBest(key, getStorage = () => window.localStorage) {
  let best = 0, persistent = true;
  try {
    const value = Number(getStorage().getItem(key));
    if (Number.isSafeInteger(value) && value >= 0) best = value;
  } catch { persistent = false; }
  return {
    get value() { return best; },
    get persistent() { return persistent; },
    update(score) {
      if (!Number.isSafeInteger(score) || score <= best) return;
      best = score;
      try { getStorage().setItem(key, String(best)); } catch { persistent = false; }
    },
  };
}
