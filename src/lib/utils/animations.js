// Modern animation actions for SvelteKit

// Intersection fade/slide-up reveal (on scroll)
export function reveal(node, { delay = 0, duration = 500, y = 32, once = true } = {}) {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    node.style.opacity = '1';
    node.style.transform = 'translateY(0)';
    return { destroy() {} };
  }
  
  node.style.opacity = '0';
  node.style.transform = `translateY(${y}px)`;
  node.style.willChange = 'opacity, transform';
  
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      node.style.transition = `opacity ${duration}ms cubic-bezier(.6,0,.4,1), transform ${duration}ms cubic-bezier(.6,0,.4,1)`;
      setTimeout(() => {
        node.style.opacity = '1';
        node.style.transform = 'translateY(0)';
        node.style.willChange = 'auto';
      }, delay);
      if (once) observer.disconnect();
    }
  }, { threshold: 0.12 });
  observer.observe(node);
  return {
    destroy() { observer.disconnect(); }
  };
}

// Alias for backward compatibility
export const revealOnScroll = reveal;

// Group stagger reveal (children only)
export function staggerReveal(node, opts = {}) {
  const children = Array.from(node.children);
  children.forEach((el, i) => reveal(el, { ...opts, delay: (opts.delay || 0) + (opts.stagger || 60) * i }));
}

// 3D hover tilt (tilts on mouse movement)
export function tilt(node, { max = 15, scale = 1.04, speed = 300 } = {}) {
  // Check for reduced motion preference and mobile
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth <= 768;
  
  if (prefersReducedMotion || isMobile) {
    return { destroy() {} };
  }
  
  node.style.transition = `transform ${speed}ms cubic-bezier(.23,1.23,.56,1)`;
  node.style.willChange = 'transform';
  
  let rafId;
  const pointermove = (e) => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const rect = node.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const tiltX = (max / 2 - x * max);
      const tiltY = (y * max - max / 2);
      node.style.transform = `perspective(600px) scale(${scale}) rotateX(${tiltY}deg) rotateY(${tiltX}deg)`;
    });
  };
  const reset = () => {
    cancelAnimationFrame(rafId);
    node.style.transform = `perspective(600px) scale(1)`;
    node.style.willChange = 'auto';
  };
  node.addEventListener('pointermove', pointermove);
  node.addEventListener('pointerleave', reset);
  return {
    destroy() {
      cancelAnimationFrame(rafId);
      node.removeEventListener('pointermove', pointermove);
      node.removeEventListener('pointerleave', reset);
    }
  };
}

// Magnetic/attract (subtle following on mouse move, e.g. for buttons)
export function magnetic(node, { strength = 0.28, threshold = 110 } = {}) {
  const onMouseMove = e => {
    const rect = node.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const d = Math.sqrt(dx*dx + dy*dy);
    if (d < threshold) {
      node.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    }
  };
  const onMouseLeave = () => node.style.transform = '';
  window.addEventListener('mousemove', onMouseMove);
  node.addEventListener('mouseleave', onMouseLeave);
  return {
    destroy() {
      window.removeEventListener('mousemove', onMouseMove);
      node.removeEventListener('mouseleave', onMouseLeave);
    }
  };
}

// Parallax effect (moves at different speed on scroll)
export function parallax(node, { intensity = 30 } = {}) {
  function onScroll() {
    const rect = node.getBoundingClientRect(),
          winHeight = window.innerHeight;
    if (rect.top < winHeight && rect.bottom > 0) {
      const progress = (rect.top + rect.height/2 - winHeight/2) / winHeight;
      node.style.transform = `translateY(${progress * intensity}px)`;
    }
  }
  window.addEventListener('scroll', onScroll);
  return {
    destroy() { window.removeEventListener('scroll', onScroll); }
  };
}

// Typewriter effect for text (for headline/hero etc.)
export function typewriter(node, { text, speed = 40, loop = false } = {}) {
  let txt = text || node.textContent, pos = 0;
  node.textContent = '';
  let running = true;
  function write() {
    if (!running) return;
    if (pos < txt.length) {
      node.textContent += txt[pos++];
      setTimeout(write, speed);
    } else if (loop) {
      setTimeout(() => { node.textContent = ''; pos = 0; write(); }, 700);
    }
  }
  write();
  return { destroy() { running = false; } };
}

// Morphing animated blob (for backgrounds/hero/avatars)
export function morphBlob(node, { duration = 6500, scale = 1.2 } = {}) {
  let frame;
  function animate(now) {
    const r1 = 80, r2 = 100, phi = now/750;
    const path = `M${100+r1*Math.cos(phi)},${100+r1*Math.sin(phi)} 
      C${100+r2*Math.cos(phi+1)},${100+r2*Math.sin(phi+1)}, 
      ${100+r2*Math.cos(phi+2)},${100+r2*Math.sin(phi+2)}, 
      ${100+r1*Math.cos(phi+3.14)},${100+r1*Math.sin(phi+3.14)} Z`;
    node.setAttribute('d', path);
    frame = requestAnimationFrame(animate);
  }
  frame = requestAnimationFrame(animate);
  return { destroy() { cancelAnimationFrame(frame); } };
}

// Button ripple effect
export function ripple(node) {
  node.style.position = 'relative';
  node.style.overflow = 'hidden';
  function createRipple(e) {
    const circle = document.createElement('span');
    const diameter = Math.max(node.clientWidth, node.clientHeight);
    circle.style.width = circle.style.height = diameter + 'px';
    circle.style.left = (e.offsetX - diameter/2) + 'px';
    circle.style.top = (e.offsetY - diameter/2) + 'px';
    circle.style.position = 'absolute';
    circle.style.borderRadius = '50%';
    circle.style.background = 'rgba(255, 255, 255, 0.4)';
    circle.style.pointerEvents = 'none';
    circle.style.transform = 'scale(0)';
    circle.style.transition = 'transform 0.5s, opacity 0.5s';
    node.appendChild(circle);
    requestAnimationFrame(() => { circle.style.transform = 'scale(1)'; });
    setTimeout(() => { circle.style.opacity = '0'; setTimeout(() => node.removeChild(circle), 500)}, 350);
  }
  node.addEventListener('pointerdown', createRipple);
  return { destroy() { node.removeEventListener('pointerdown', createRipple); } };
}

// Sparkle trail (for call-to-action hover/focus)
export function sparkleTrail(node) {
  function sparkle(e) {
    for (let i=0;i<12;++i) {
      const s = document.createElement('span');
      s.style.position = 'absolute';
      s.style.pointerEvents = 'none';
      s.style.left = (e.offsetX + Math.random()*32-16) + 'px';
      s.style.top = (e.offsetY + Math.random()*16-8) + 'px';
      s.style.width = s.style.height = (Math.random() * 6 + 4) + 'px';
      s.style.background = `linear-gradient(45deg,#fff,${Math.random()<0.6?'#ff61d7':'#1351FF'})`;
      s.style.opacity = '1';
      s.style.borderRadius = '100%';
      s.style.zIndex = 10;
      s.style.transition = 'all .65s cubic-bezier(.54,-0.12,.56,1.32)';
      node.appendChild(s);
      setTimeout(() => {
        s.style.top = (parseFloat(s.style.top)+16*(Math.random()<0.5?1:-1))+'px';
        s.style.opacity = '0';
      }, 32);
      setTimeout(() => node.removeChild(s), 700);
    }
  }
  node.addEventListener('pointerenter', sparkle);
  node.addEventListener('focus', sparkle);
  return { destroy() {
    node.removeEventListener('pointerenter', sparkle);
    node.removeEventListener('focus', sparkle);
  }};
}

// Particle explosion on click
export function particleExplode(node) {
  function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.borderRadius = '50%';
    particle.style.background = 'var(--voyage-blue)';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 3;
    const lifetime = 1000 + Math.random() * 500;
    
    document.body.appendChild(particle);
    
    let startTime = Date.now();
    
    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / lifetime;
      
      if (progress >= 1) {
        particle.remove();
        return;
      }
      
      const distance = velocity * elapsed / 16;
      const x = parseFloat(particle.style.left) + Math.cos(angle) * velocity;
      const y = parseFloat(particle.style.top) + Math.sin(angle) * velocity + (progress * 2);
      
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.opacity = 1 - progress;
      
      requestAnimationFrame(animate);
    }
    
    animate();
  }
  
  function handleClick(e) {
    const rect = node.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    for (let i = 0; i < 12; i++) {
      setTimeout(() => createParticle(x, y), i * 20);
    }
  }
  
  node.addEventListener('click', handleClick);
  
  return {
    destroy() {
      node.removeEventListener('click', handleClick);
    }
  };
}

// Morphing background gradient
export function morphGradient(node, { colors = ['#1351FF', '#6A38FF', '#FFD339'], speed = 3000 } = {}) {
  let currentIndex = 0;
  
  const animate = () => {
    const nextIndex = (currentIndex + 1) % colors.length;
    const gradient = `linear-gradient(135deg, ${colors[currentIndex]}, ${colors[nextIndex]})`;
    node.style.background = gradient;
    currentIndex = nextIndex;
  };
  
  const interval = setInterval(animate, speed);
  animate();
  
  return {
    destroy() {
      clearInterval(interval);
    }
  };
}

// Smoothly scroll the page to a target element or selector
export function smoothScroll(target, { offset = 0, behavior = 'smooth' } = {}) {
  if (typeof window === 'undefined') return;
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return;
  const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior });
}
