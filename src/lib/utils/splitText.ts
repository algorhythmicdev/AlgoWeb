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
    span.style.transitionDelay = `${delay + i * 35}ms`;
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
  }, { threshold: 0.35 });
  io.observe(node);
  return { destroy() { io.disconnect(); } };
}
