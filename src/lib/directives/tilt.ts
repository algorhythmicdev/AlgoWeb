export function tilt(node: HTMLElement, { max = 6 } = {}) {
  const media = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
  let rect = node.getBoundingClientRect();
  let active = false;

  function updateRect() {
    rect = node.getBoundingClientRect();
  }

  function onMove(event: PointerEvent) {
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.transform = `perspective(800px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) translateY(-2px)`;
  }

  function onLeave() {
    node.style.transform = '';
  }

  function enable() {
    if (active) return;
    active = true;
    updateRect();
    window.addEventListener('resize', updateRect);
    node.addEventListener('pointermove', onMove, { passive: true });
    node.addEventListener('pointerleave', onLeave);
  }

  function disable() {
    if (!active) return;
    active = false;
    window.removeEventListener('resize', updateRect);
    node.removeEventListener('pointermove', onMove);
    node.removeEventListener('pointerleave', onLeave);
    node.style.transform = '';
  }

  if (!media || !media.matches) {
    enable();
  }

  function onChange(event: MediaQueryListEvent) {
    if (event.matches) {
      disable();
    } else {
      enable();
    }
  }

  media?.addEventListener('change', onChange);

  return {
    destroy() {
      disable();
      media?.removeEventListener('change', onChange);
    }
  };
}
