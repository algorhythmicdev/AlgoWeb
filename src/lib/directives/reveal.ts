export function reveal(node: HTMLElement, { y = 12, dur = 240 } = {}) {
  const prefersReduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  node.style.opacity = '0';
  node.style.transform = `translateY(${y}px)`;
  node.style.transition = `opacity ${dur}ms var(--ease), transform ${dur}ms var(--ease)`;

  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      node.style.opacity = '1';
      node.style.transform = 'translateY(0)';
      io.disconnect();
    }
  }, { threshold: .15 });
  io.observe(node);
  return { destroy() { io.disconnect(); } };
}
