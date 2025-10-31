const WORD_DELAY_MS = 35;
const REVEAL_THRESHOLD = 0.35;

export function splitReveal(node: HTMLElement, delay = 0) {
  const text = node.textContent ?? '';
  node.textContent = '';
  const frag = document.createDocumentFragment();
  const words = text.split(/(\s+)/);
  words.forEach((w, i) => {
    const span = document.createElement('span');
    span.textContent = w;
    span.style.display = 'inline-block';
    span.style.opacity = '0';
    span.style.transform = 'translateY(14px)';
    span.style.transition = 'opacity .6s ease, transform .6s ease';
    span.style.transitionDelay = `${delay + i * WORD_DELAY_MS}ms`;
    frag.appendChild(span);
  });
  node.appendChild(frag);
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        node.querySelectorAll('span').forEach(s => {
          (s as HTMLElement).style.opacity = '1';
          (s as HTMLElement).style.transform = 'translateY(0)';
        });
        io.disconnect();
      }
    });
  }, { threshold: REVEAL_THRESHOLD });
  io.observe(node);
  return { destroy() { io.disconnect(); } };
}
