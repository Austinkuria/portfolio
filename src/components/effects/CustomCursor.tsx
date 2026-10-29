'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

interface TrailPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  maxAge: number;
  size: number;
  color: string;
}

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorWrapperRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === 'dark';

  // Mount only on client to ensure 100% hydration matching
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Only disable if device purely has coarse pointer with no fine pointer available
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(pointer: coarse)').matches &&
      !window.matchMedia('(pointer: fine)').matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    const wrapper = cursorWrapperRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!canvas || !wrapper || !ring || !dot) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mouse = { x: -100, y: -100 };
    const lastPoint = { x: -100, y: -100, time: 0 };
    const points: TrailPoint[] = [];

    let isHovered = false;
    let isMouseDown = false;
    let isOverInput = false;
    let isVisible = false;
    let animationFrameId: number;

    // Set canvas dimensions
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Neon palettes
    const lightNeonPalette = [
      'rgba(29, 78, 216, ',
      'rgba(2, 132, 199, ',
      'rgba(67, 56, 202, ',
      'rgba(109, 40, 217, ',
      'rgba(190, 24, 93, ',
    ];

    const darkNeonPalette = [
      'rgba(6, 182, 212, ',
      'rgba(59, 130, 246, ',
      'rgba(168, 85, 247, ',
      'rgba(236, 72, 153, ',
      'rgba(99, 102, 241, ',
    ];

    const updateVisualStates = () => {
      const isDarkMode = resolvedTheme === 'dark';

      if (isOverInput) {
        wrapper.style.opacity = '0';
        return;
      }

      if (isVisible) {
        wrapper.style.opacity = '1';
      }

      // Sizing scales: perfectly concentric around (0, 0)
      const ringScale = isMouseDown ? 0.85 : isHovered ? 1.35 : 1;
      const dotScale = isMouseDown ? 0.75 : isHovered ? 0.85 : 1;

      ring.style.transform = `translate(-50%, -50%) scale(${ringScale})`;
      dot.style.transform = `translate(-50%, -50%) scale(${dotScale})`;

      if (isDarkMode) {
        ring.style.border = isHovered
          ? '2.5px solid #60a5fa'
          : '2px solid rgba(255, 255, 255, 0.95)';
        ring.style.backgroundColor = isHovered
          ? 'rgba(59, 130, 246, 0.25)'
          : 'rgba(255, 255, 255, 0.08)';
        ring.style.boxShadow = isHovered
          ? '0 0 22px rgba(59, 130, 246, 0.85), 0 0 35px rgba(168, 85, 247, 0.5)'
          : '0 0 12px rgba(56, 189, 248, 0.5)';
        dot.style.backgroundColor = isHovered ? '#60a5fa' : '#ffffff';
      } else {
        ring.style.border = isHovered
          ? '2.5px solid #1d4ed8'
          : '2px solid #090d16';
        ring.style.backgroundColor = isHovered
          ? 'rgba(37, 99, 235, 0.2)'
          : 'rgba(9, 13, 22, 0.08)';
        ring.style.boxShadow = isHovered
          ? '0 0 20px rgba(29, 78, 216, 0.7), 0 0 32px rgba(109, 40, 217, 0.4)'
          : '0 0 10px rgba(2, 132, 199, 0.35)';
        dot.style.backgroundColor = isHovered ? '#1d4ed8' : '#090d16';
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Hardware-speed transform: move the unified cursor to exact mouse coordinates
      wrapper.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;

      if (!isVisible) {
        isVisible = true;
        wrapper.style.opacity = '1';
        canvas.style.opacity = '1';
      }

      const target = e.target as HTMLElement | null;
      if (target) {
        isOverInput = !!target.closest('input, textarea, [contenteditable="true"]');
        isHovered = !!target.closest(
          'a, button, [role="button"], [role="link"], .cursor-pointer, select, summary'
        );
      } else {
        isOverInput = false;
        isHovered = false;
      }

      updateVisualStates();

      // Neon trail points
      const now = performance.now();
      const dx = mouse.x - lastPoint.x;
      const dy = mouse.y - lastPoint.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 4 || (now - lastPoint.time) > 30) {
        const palette = resolvedTheme === 'dark' ? darkNeonPalette : lightNeonPalette;
        const color = palette[Math.floor(Math.random() * palette.length)];
        const speed = Math.min(dist / 4, 12);

        points.push({
          x: mouse.x,
          y: mouse.y,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          age: 0,
          maxAge: isHovered ? 30 : 22,
          size: isHovered ? 6 + speed : 4 + speed * 0.7,
          color,
        });

        if (dist > 8 || isHovered) {
          const count = isHovered ? 2 : 1;
          for (let s = 0; s < count; s++) {
            points.push({
              x: mouse.x + (Math.random() - 0.5) * 10,
              y: mouse.y + (Math.random() - 0.5) * 10,
              vx: (Math.random() - 0.5) * 2.0,
              vy: (Math.random() - 0.5) * 2.0 - 0.3,
              age: 0,
              maxAge: 16 + Math.random() * 10,
              size: 2 + Math.random() * 2.5,
              color: palette[Math.floor(Math.random() * palette.length)],
            });
          }
        }

        lastPoint.x = mouse.x;
        lastPoint.y = mouse.y;
        lastPoint.time = now;
      }
    };

    const handleMouseDown = () => {
      isMouseDown = true;
      updateVisualStates();
    };

    const handleMouseUp = () => {
      isMouseDown = false;
      updateVisualStates();
    };

    const handleMouseLeave = () => {
      isVisible = false;
      wrapper.style.opacity = '0';
      canvas.style.opacity = '0';
      points.length = 0;
    };

    const handleMouseEnter = () => {
      isVisible = true;
      wrapper.style.opacity = '1';
      canvas.style.opacity = '1';
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (points.length > 0) {
        for (let i = points.length - 1; i >= 0; i--) {
          const p = points[i];
          p.age++;
          p.x += p.vx;
          p.y += p.vy;
          if (p.age >= p.maxAge) {
            points.splice(i, 1);
          }
        }

        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1];
          const curr = points[i];
          const segDist = Math.hypot(curr.x - prev.x, curr.y - prev.y);

          if (segDist < 55) {
            const life = 1 - curr.age / curr.maxAge;
            const alpha = life * (isHovered ? 0.95 : 0.85);

            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(curr.x, curr.y);
            ctx.lineWidth = Math.max(curr.size * life * (isHovered ? 1.3 : 1.0), 1.6);
            ctx.strokeStyle = `${curr.color}${alpha.toFixed(3)})`;
            ctx.shadowBlur = (isHovered ? 18 : 12) * life;
            ctx.shadowColor = `${curr.color}0.95)`;
            ctx.stroke();
          }
        }

        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          const life = 1 - p.age / p.maxAge;
          const alpha = life * (isHovered ? 0.95 : 0.85);
          const currentSize = Math.max(p.size * life * 0.85, 1.2);

          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
          ctx.shadowBlur = (isHovered ? 20 : 12) * life;
          ctx.shadowColor = `${p.color}0.95)`;
          ctx.fillStyle = `${p.color}${alpha.toFixed(3)})`;
          ctx.fill();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mounted, resolvedTheme]);

  // Guard against SSR hydration mismatches: render only after mounting on client
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* 1. Neon Trail Hardware-Accelerated Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9998] select-none transition-opacity duration-300"
        style={{ opacity: 0 }}
      />

      {/* 2. Unified Concentric Cursor: Ring + Dot Locked to the Exact Same Center */}
      <div
        ref={cursorWrapperRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] select-none will-change-transform"
        style={{
          width: 0,
          height: 0,
          opacity: 0,
          transform: 'translate3d(-100px, -100px, 0)',
          transition: 'opacity 0.15s ease',
        }}
      >
        {/* Outer Concentric Follower Circle */}
        <div
          ref={ringRef}
          className="pointer-events-none absolute left-0 top-0 rounded-full transition-[border,background-color,box-shadow,transform] duration-150 ease-out"
          style={{
            width: '38px',
            height: '38px',
            border: isDark ? '2px solid rgba(255, 255, 255, 0.95)' : '2px solid #090d16',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(9, 13, 22, 0.08)',
            boxShadow: isDark
              ? '0 0 12px rgba(56, 189, 248, 0.5)'
              : '0 0 10px rgba(2, 132, 199, 0.35)',
            transform: 'translate(-50%, -50%) scale(1)',
          }}
        />

        {/* Inner Concentric Precision Dot */}
        <div
          ref={dotRef}
          className="pointer-events-none absolute left-0 top-0 rounded-full transition-[background-color,transform] duration-150 ease-out"
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: isDark ? '#ffffff' : '#090d16',
            border: isDark ? '1px solid rgba(56, 189, 248, 0.8)' : '1px solid #ffffff',
            boxShadow: isDark
              ? '0 0 8px rgba(255, 255, 255, 0.9)'
              : '0 0 8px rgba(29, 78, 216, 0.7)',
            transform: 'translate(-50%, -50%) scale(1)',
          }}
        />
      </div>
    </>
  );
}
