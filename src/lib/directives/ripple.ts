export function ripple(node: HTMLElement) {
  const media = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
  let reduced = media?.matches ?? false;

  function click(event: MouseEvent) {
    if (reduced) return;
    const rect = node.getBoundingClientRect();
    const element = document.createElement('span');
    const diameter = Math.max(rect.width, rect.height);
    element.className = 'ripple';
    element.style.left = `${event.clientX - rect.left - diameter / 2}px`;
    element.style.top = `${event.clientY - rect.top - diameter / 2}px`;
    element.style.width = element.style.height = `${diameter}px`;
    node.appendChild(element);
    setTimeout(() => element.remove(), 450);
  }

  function enable() {
    node.addEventListener('click', click);
  }

  function disable() {
    node.removeEventListener('click', click);
  }

  if (!node.style.position) {
    node.style.position = 'relative';
  }
  if (getComputedStyle(node).position === 'static') {
    node.style.position = 'relative';
  }
  node.style.overflow = 'hidden';

  if (!reduced) {
    enable();
  }

  function onChange(event: MediaQueryListEvent) {
    reduced = event.matches;
    if (reduced) {
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
