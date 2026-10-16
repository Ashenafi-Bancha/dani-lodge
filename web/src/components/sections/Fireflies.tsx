'use client';

import { useEffect, useRef } from 'react';

interface Fly {
  x: number;
  y: number;
  r: number;
  speed: number;
  phase: number;
  drift: number;
}

/**
 * A few dozen fireflies on a 2D canvas: much lighter than WebGL, so phones get
 * them too. Only animates while on screen; still for reduced motion.
 */
export default function Fireflies({ count = 38 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const flies: Fly[] = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: 0.25 + Math.random() * 0.75,
      r: 1 + Math.random() * 2.2,
      speed: 0.00015 + Math.random() * 0.0004,
      phase: Math.random() * Math.PI * 2,
      drift: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const f of flies) {
        f.y -= f.speed;
        if (f.y < 0.15) f.y = 1;
        const x = (f.x + Math.sin(t * 0.0003 + f.drift) * 0.03) * width;
        const y = f.y * height;
        const glow = 0.25 + 0.75 * Math.max(0, Math.sin(t * 0.0012 + f.phase));
        const g = ctx.createRadialGradient(x, y, 0, x, y, f.r * 7);
        g.addColorStop(0, `rgba(255, 226, 150, ${0.9 * glow})`);
        g.addColorStop(1, 'rgba(255, 226, 150, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, f.r * 7, 0, Math.PI * 2);
        ctx.fill();
      }
      if (running) frame = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        frame = requestAnimationFrame(draw);
      } else if (!entry.isIntersecting) {
        running = false;
        cancelAnimationFrame(frame);
      }
    });

    resize();
    observer.observe(canvas);
    window.addEventListener('resize', resize);
    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [count]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}
