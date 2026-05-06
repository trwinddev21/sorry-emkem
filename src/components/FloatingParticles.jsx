import { useEffect, useRef } from 'react';
import './FloatingParticles.css';

const EMOJIS = ['🍵', '🌿', '🐾', '🐱', '🐶', '💚', '✨', '🌸', '🍃', '⭐', '💛', '🌼', '🐾', '🍵'];

function createParticle(container) {
  const el = document.createElement('div');
  el.className = 'particle';
  el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

  const x = Math.random() * 100;
  const duration = 6 + Math.random() * 8;
  const delay = Math.random() * 6;
  const size = 16 + Math.random() * 20;
  const drift = (Math.random() - 0.5) * 80;

  el.style.cssText = `
    left: ${x}%;
    bottom: -60px;
    font-size: ${size}px;
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    --drift: ${drift}px;
  `;

  container.appendChild(el);

  const cleanup = setTimeout(() => {
    el.remove();
  }, (duration + delay + 1) * 1000);

  return cleanup;
}

export default function FloatingParticles() {
  const containerRef = useRef(null);
  const timersRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial burst
    for (let i = 0; i < 12; i++) {
      const id = createParticle(container);
      timersRef.current.push(id);
    }

    // Continuous spawn
    const interval = setInterval(() => {
      const id = createParticle(container);
      timersRef.current.push(id);
    }, 1200);

    return () => {
      clearInterval(interval);
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  return <div ref={containerRef} className="particles-container" aria-hidden="true" />;
}
