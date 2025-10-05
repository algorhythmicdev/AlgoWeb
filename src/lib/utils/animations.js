// Modern animation actions for SvelteKit

// @ts-nocheck

// Enhanced intersection reveal with exciting animations
export function reveal(node, {
  delay = 0,
  duration = 800,
  y = 50,
  x = 0,
  scale = 0.95,
  once = true,
  animationType = 'slideUp',
  threshold = 0.1
} = {}) {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    node.style.opacity = '1';
    node.style.transform = 'translateY(0) translateX(0) scale(1) rotate(0deg)';
    return { destroy() {} };
  }
  
  // Set initial state based on animation type
  const initialStates = {
    slideUp: { opacity: '0', transform: `translateY(${y}px) scale(${scale})` },
    slideDown: { opacity: '0', transform: `translateY(-${y}px) scale(${scale})` },
    slideLeft: { opacity: '0', transform: `translateX(${x}px) scale(${scale})` },
    slideRight: { opacity: '0', transform: `translateX(-${x}px) scale(${scale})` },
    scaleIn: { opacity: '0', transform: `scale(${scale})` },
    flipIn: { opacity: '0', transform: `perspective(400px) rotateY(-90deg) scale(${scale})` },
    elasticIn: { opacity: '0', transform: `scale(0.3) translateY(${y}px)` },
    diagonal: { opacity: '0', transform: `translate(-${x}px, ${y}px) rotate(-10deg) scale(${scale})` },
    reverseDiagonal: { opacity: '0', transform: `translate(${x}px, ${y}px) rotate(10deg) scale(${scale})` }
  };
  
  const initialState = initialStates[animationType] || initialStates.slideUp;
  
  node.style.opacity = initialState.opacity;
  node.style.transform = initialState.transform;
  node.style.willChange = 'opacity, transform';
  
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      node.style.transition = `opacity ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      
      setTimeout(() => {
        node.style.opacity = '1';
        
        // Set final state based on animation type
        const finalStates = {
          slideUp: 'translateY(0) scale(1)',
          slideDown: 'translateY(0) scale(1)',
          slideLeft: 'translateX(0) scale(1)',
          slideRight: 'translateX(0) scale(1)',
          scaleIn: 'scale(1)',
          flipIn: 'perspective(400px) rotateY(0deg) scale(1)',
          elasticIn: 'scale(1) translateY(0)',
          diagonal: 'translate(0, 0) rotate(0deg) scale(1)',
          reverseDiagonal: 'translate(0, 0) rotate(0deg) scale(1)'
        };
        
        node.style.transform = finalStates[animationType] || finalStates.slideUp;
        node.style.willChange = 'auto';
        
        // Add glassy effect after animation
        if (node.classList.contains('glass-card') || node.classList.contains('surface')) {
          node.style.boxShadow = '0 20px 40px rgba(19, 81, 255, 0.15)';
        }
      }, delay);
      
      if (once) observer.disconnect();
    }
  }, { threshold });
  
  observer.observe(node);
  return {
    destroy() { observer.disconnect(); }
  };
}

// Alias for backward compatibility
export const revealOnScroll = reveal;

// Enhanced group stagger reveal with varied animations
export function staggerReveal(node, opts = {}) {
  const children = Array.from(node.children);
  const animationTypes = ['slideUp', 'slideLeft', 'slideRight', 'scaleIn', 'elasticIn', 'diagonal', 'reverseDiagonal'];
  
  children.forEach((el, i) => {
    const animationType = opts.animationType || animationTypes[i % animationTypes.length];
    const staggerDelay = (opts.delay || 0) + (opts.stagger || 100) * i;
    
    // Add glassy effect classes
    if (el.classList.contains('card') || el.classList.contains('feature') || el.classList.contains('item')) {
      el.classList.add('glass-card');
    }
    
    reveal(el, { 
      ...opts, 
      delay: staggerDelay,
      animationType,
      duration: opts.duration || 800,
      y: opts.y || 50,
      x: opts.x || 30,
      scale: opts.scale || 0.9
    });
  });
}

// Enhanced 3D hover tilt with glassy effects
export function tilt(node, { max = 15, scale = 1.04, speed = 300, glow = true } = {}) {
  // Check for reduced motion preference and mobile
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth <= 768;
  
  if (prefersReducedMotion || isMobile) {
    return { destroy() {} };
  }
  
  node.style.transition = `transform ${speed}ms cubic-bezier(.23,1.23,.56,1), box-shadow ${speed}ms cubic-bezier(.23,1.23,.56,1)`;
  node.style.willChange = 'transform, box-shadow';
  
  // Add glassy effect classes
  if (!node.classList.contains('glass-card')) {
    node.classList.add('glass-card');
  }
  
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
      
      if (glow) {
        const glowIntensity = Math.abs(tiltX) + Math.abs(tiltY);
        node.style.boxShadow = `0 20px 40px rgba(19, 81, 255, ${0.1 + glowIntensity * 0.02}), 0 0 20px rgba(106, 56, 255, ${0.05 + glowIntensity * 0.01})`;
      }
    });
  };
  
  const reset = () => {
    cancelAnimationFrame(rafId);
    node.style.transform = `perspective(600px) scale(1)`;
    node.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
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

// Enhanced magnetic effect with glassy appeal
export function magnetic(node, { strength = 0.28, threshold = 110, glow = true, scale = 1.05 } = {}) {
  const onMouseMove = e => {
    const rect = node.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const d = Math.sqrt(dx*dx + dy*dy);
    
    if (d < threshold) {
      const moveX = dx * strength;
      const moveY = dy * strength;
      const currentScale = 1 + (1 - d / threshold) * (scale - 1);
      
      node.style.transform = `translate(${moveX}px, ${moveY}px) scale(${currentScale})`;
      
      if (glow) {
        const glowIntensity = (1 - d / threshold) * 0.3;
        node.style.boxShadow = `0 15px 30px rgba(19, 81, 255, ${glowIntensity}), 0 0 20px rgba(106, 56, 255, ${glowIntensity * 0.5})`;
      }
    }
  };
  
  const onMouseLeave = () => {
    node.style.transform = '';
    node.style.boxShadow = '';
  };
  
  // Add transition for smooth effects
  node.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  
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
    const cycle = (now % duration) / duration;
    const phi = cycle * Math.PI * 2;
    const center = 100;
    const r1 = 80 * scale;
    const r2 = 100 * scale;
    const path = `M${center + r1 * Math.cos(phi)},${center + r1 * Math.sin(phi)}
      C${center + r2 * Math.cos(phi + 1)},${center + r2 * Math.sin(phi + 1)},
      ${center + r2 * Math.cos(phi + 2)},${center + r2 * Math.sin(phi + 2)},
      ${center + r1 * Math.cos(phi + Math.PI)},${center + r1 * Math.sin(phi + Math.PI)} Z`;
    node.setAttribute('d', path);
    node.style.transform = `scale(${scale})`;
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
