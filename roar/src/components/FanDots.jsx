'use client';

import { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

export default function FanDots({ count, teamColor }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const dotsRef = useRef([]);

  // Generate dots once
  const dotCount = Math.min(count, 400); // render 400 max, represent more

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize dots
    if (dotsRef.current.length === 0) {
      const rect = canvas.getBoundingClientRect();
      for (let i = 0; i < dotCount; i++) {
        dotsRef.current.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          radius: Math.random() * 2 + 1,
          baseAlpha: Math.random() * 0.5 + 0.3,
          pulseSpeed: Math.random() * 0.02 + 0.005,
          pulseOffset: Math.random() * Math.PI * 2,
          color: Math.random() > 0.5 ? teamColor || '#EC1C24' : '#004BA0',
        });
      }
    }

    let time = 0;
    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      dotsRef.current.forEach(dot => {
        const alpha = dot.baseAlpha + Math.sin(time * dot.pulseSpeed + dot.pulseOffset) * 0.3;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
        ctx.fill();

        // Glow for brighter dots
        if (alpha > 0.6) {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = dot.color;
          ctx.globalAlpha = 0.05;
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1;
      time++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [dotCount, teamColor]);

  const formattedCount = useMemo(() => count.toLocaleString(), [count]);

  return (
    <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden"
      style={{ background: 'rgba(10, 10, 15, 0.8)' }}>
      
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Overlay with count */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="text-center"
        >
          <div className="text-5xl md:text-6xl font-black animate-count-up"
            style={{ fontFamily: 'Outfit, sans-serif' }}>
            {formattedCount}
          </div>
          <div className="text-sm tracking-widest uppercase mt-2"
            style={{ color: 'var(--color-text-secondary)' }}>
            fans live now
          </div>
        </motion.div>
      </div>

      {/* Radial glow overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, transparent 30%, rgba(10,10,15,0.7) 100%)`,
        }}
      />
    </div>
  );
}
