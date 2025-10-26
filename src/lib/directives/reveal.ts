export function reveal(node: HTMLElement, { y = 14, dur = 260 } = {}) {
  const media = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
  let cleanup: (() => void) | null = null;

  function setup() {
    node.style.opacity = '0';
    node.style.transform = `translateY(${y}px)`;
    node.style.transition = `opacity ${dur}ms var(--ease), transform ${dur}ms var(--ease)`;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.style.opacity = '1';
        node.style.transform = 'translateY(0)';
        observer.disconnect();
      }
    }, { threshold: 0.18 });

    observer.observe(node);

    return () => {
      observer.disconnect();
      node.style.opacity = '';
      node.style.transform = '';
      node.style.transition = '';
    };
  }

  if (!media || !media.matches) {
    cleanup = setup();
  }

  function onChange(event: MediaQueryListEvent) {
    if (event.matches) {
      cleanup?.();
      cleanup = null;
    } else if (!cleanup) {
      cleanup = setup();
    }
  }

  media?.addEventListener('change', onChange);

  return {
    destroy() {
      cleanup?.();
      cleanup = null;
      media?.removeEventListener('change', onChange);
    }
  };
}
