/**
 * Explicit, desktop-only opt-in. This must never modify normal site scrolling.
 * A touch-capable device stays native even when a trackpad is connected.
 */
export function isLenisPilotEligible({
  search = '',
  viewportWidth = 0,
  hasHover = false,
  hasFinePointer = false,
  maxTouchPoints = 0,
  reducedMotion = false,
} = {}) {
  return new URLSearchParams(search).get('lenis-preview') === '1'
    && viewportWidth >= 1100
    && hasHover
    && hasFinePointer
    && maxTouchPoints === 0
    && !reducedMotion;
}
