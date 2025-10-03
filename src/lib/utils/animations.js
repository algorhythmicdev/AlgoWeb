/**
 * Advanced Animation Utilities
 * Complex, modern animations for AlgoRhythmics
 */

/**
 * Stagger reveal animation
 * Usage: <div use:staggerReveal={{ delay: 100 }}>
 */
export function staggerReveal(node, { delay = 100, duration = 800 } = {}) {
  const children = node.children;
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Array.from(children).forEach((child, index) => {
            setTimeout(() => {
              child.style.opacity = '1';
              child.style.transform = 'translateY(0) scale(1)';
            }, index * delay);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  
  // Set initial state
  Array.from(children).forEach(child => {
    child.style.opacity = '0';
    child.style.transform = 'translateY(40px) scale(0.95)';
    child.style.transition = `all ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
  });
  
  observer.observe(node);
  
  return {
    destroy() {
      observer.disconnect();
    }
  };
}

/**
 * Morphing background gradient
 * Usage: <div use:morphGradient>
 */
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

/**
 * Particle explosion on hover
 * Usage: <button use:particleExplode>
 */
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

/**
 * 3D tilt effect
 * Usage: <div use:tilt>
 */
export function tilt(node, { max = 15, speed = 300 } = {}) {
  let rect = node.getBoundingClientRect();
  
  function handleMouseMove(e) {
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const tiltX = (y - 0.5) * max;
    const tiltY = -(x - 0.5) * max;
    
    node.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
  }
  
  function handleMouseLeave() {
    node.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }
  
  function handleMouseEnter() {
    rect = node.getBoundingClientRect();
  }
  
  node.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
  node.style.transformStyle = 'preserve-3d';
  
  node.addEventListener('mouseenter', handleMouseEnter);
  node.addEventListener('mousemove', handleMouseMove);
  node.addEventListener('mouseleave', handleMouseLeave);
  
  return {
    destroy() {
      node.removeEventListener('mouseenter', handleMouseEnter);
      node.removeEventListener('mousemove', handleMouseMove);
      node.removeEventListener('mouseleave', handleMouseLeave);
    }
  };
}

/**
 * Smooth scroll with easing
 */
export function smoothScroll(target) {
  const element = document.querySelector(target);
  if (!element) return;
  
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

// Original animations from before
export { typewriter, revealOnScroll, magnetic, parallax } from './animations-original';
