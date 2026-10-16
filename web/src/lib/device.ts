/**
 * Decides whether this device should get the WebGL hero. Phones, slow
 * connections, data-saver mode, weak CPUs and reduced-motion users all get
 * the still photo instead, which is also what loads first for everyone.
 */
export function canRunHeroScene(): boolean {
  if (typeof window === 'undefined') return false;
  // For testing on any machine: add ?scene=force to the page address
  const forced = new URLSearchParams(window.location.search).get('scene') === 'force';
  if (forced) return hasWebGL();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (!window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches) return false;

  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) return false;
  if (nav.connection?.effectiveType && /(^|-)(2g|3g)$/.test(nav.connection.effectiveType)) return false;
  if ((nav.hardwareConcurrency ?? 8) < 4) return false;
  if ((nav.deviceMemory ?? 8) < 4) return false;

  return hasWebGL();
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}
