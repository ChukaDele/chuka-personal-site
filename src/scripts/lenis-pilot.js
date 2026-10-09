import { isLenisPilotEligible } from './lenis-pilot-policy.js';
import 'lenis/dist/lenis.css';

/**
 * A/B experiment only. The production site remains native unless a reviewer
 * deliberately appends ?lenis-preview=1 and meets the desktop eligibility gate.
 */
export async function startLenisPilot({ gsap, ScrollTrigger }) {
  const desktop = matchMedia('(min-width: 1100px)');
  const hover = matchMedia('(hover: hover)');
  const finePointer = matchMedia('(pointer: fine)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const eligible = () => isLenisPilotEligible({
    search: location.search,
    viewportWidth: innerWidth,
    hasHover: hover.matches,
    hasFinePointer: finePointer.matches,
    maxTouchPoints: navigator.maxTouchPoints || 0,
    reducedMotion: reducedMotion.matches,
  });

  if (!eligible()) return;

  // Keep Lenis out of the default bundle and out of touch/reduced-motion sessions.
  const { default: Lenis } = await import('lenis');
  if (!eligible()) return;

  const lenis = new Lenis({
    autoRaf: false,
    smoothWheel: true,
    syncTouch: false,
    anchors: false,
    respectReducedMotion: true,
    allowNestedScroll: false,
    prevent: (node) => Boolean(node.closest?.(
      'dialog, [role="dialog"], .library-drawer, .library-reading, .prints, .sketch, .top nav, [data-lenis-prevent]'
    )),
  });
  root.dataset.scrollPilot = 'lenis-preview';

  // One animation clock for GSAP ScrollTrigger and Lenis. Do not change
  // ticker lag smoothing globally: other site motion owns that preference.
  const frame = (time) => lenis.raf(time * 1000);
  const updateTriggers = () => ScrollTrigger.update();
  lenis.on('scroll', updateTriggers);
  gsap.ticker.add(frame);

  // The letter form and other dialogs must retain native nested scrolling.
  let locked;
  const updateOverlayState = () => {
    const next = root.classList.contains('menu-open') || document.querySelector('dialog[open]') !== null;
    if (next === locked) return;
    locked = next;
    if (next) lenis.stop();
    else lenis.start();
  };
  const overlayObserver = new MutationObserver(updateOverlayState);
  overlayObserver.observe(root, { attributes: true, attributeFilter: ['class'] });
  document.querySelectorAll('dialog').forEach((dialog) => {
    overlayObserver.observe(dialog, { attributes: true, attributeFilter: ['open'] });
  });
  updateOverlayState();

  let destroyed = false;
  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    desktop.removeEventListener('change', onCapabilities);
    hover.removeEventListener('change', onCapabilities);
    finePointer.removeEventListener('change', onCapabilities);
    reducedMotion.removeEventListener('change', onCapabilities);
    removeEventListener('pagehide', destroy);
    overlayObserver.disconnect();
    gsap.ticker.remove(frame);
    lenis.off('scroll', updateTriggers);
    lenis.destroy();
    delete root.dataset.scrollPilot;
    ScrollTrigger.refresh();
  };
  const onCapabilities = () => { if (!eligible()) destroy(); };
  [desktop, hover, finePointer, reducedMotion].forEach((mql) =>
    mql.addEventListener('change', onCapabilities)
  );
  addEventListener('pagehide', destroy, { once: true });
  ScrollTrigger.refresh();
}
