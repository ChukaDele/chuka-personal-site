// Only the draft route imports this module. Native range keys remain browser-owned.
export function enhancePlayground(root) {
  const find = selector => root.querySelector(selector);
  const colour = find('#colour-range');
  const spacing = find('#spacing-range');
  const poster = find('[data-poster]');
  const toggle = find('[data-ink-toggle]');
  const bound = (input, fallback) => {
    const number = Number(input.value);
    const value = Number.isFinite(number) ? Math.min(Number(input.max), Math.max(Number(input.min), number)) : fallback;
    input.value = String(value);
    return value;
  };
  const sync = () => {
    const reveal = bound(colour, 50);
    const rhythm = bound(spacing, .02);
    find('[data-reveal]').style.setProperty('--reveal', `${reveal}%`);
    find('#colour-output').value = `${reveal}%`;
    colour.setAttribute('aria-valuetext', `${reveal}% colour revealed`);
    poster.style.setProperty('--spacing', `${rhythm}em`);
    find('#spacing-output').value = `${rhythm.toFixed(2)} em`;
    spacing.setAttribute('aria-valuetext', `${rhythm.toFixed(2)} em`);
    poster.dataset.copper = String(toggle.getAttribute('aria-pressed') === 'true');
  };
  colour.addEventListener('input', sync);
  spacing.addEventListener('input', sync);
  find('[data-colour-reset]').addEventListener('click', () => { colour.value = '50'; sync(); });
  toggle.addEventListener('click', () => {
    toggle.setAttribute('aria-pressed', String(toggle.getAttribute('aria-pressed') !== 'true'));
    sync();
  });
  find('[data-type-reset]').addEventListener('click', () => {
    spacing.value = '.02'; toggle.setAttribute('aria-pressed', 'false'); sync();
  });
  sync();
  root.querySelectorAll('[data-controls]').forEach(control => { control.hidden = false; });
  return sync;
}
