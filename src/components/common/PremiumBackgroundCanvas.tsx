import React, { useEffect, useRef } from 'react';
import { useTheme, PortfolioTheme } from '../../context/ThemeContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  pulseSpeed: number;
  pulseOffset: number;
}

export const PremiumBackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, backgroundStyle } = useTheme();

  // Mouse coordinates with smooth interpolation
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number; active: boolean }>({
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    active: false,
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;

      clearTimeout(timeout);
      // Soft deactivate after 4 seconds of inactivity
      timeout = setTimeout(() => {
        mouseRef.current.active = false;
      }, 4000);
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.targetX = e.touches[0].clientX;
        mouseRef.current.targetY = e.touches[0].clientY;
        mouseRef.current.active = true;
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isPaused = false;

    // Cap pixel ratio to 1.5 to guarantee buttery smooth 60fps on 4K / Retina / mobile
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    setCanvasSize();

    // Helper: get theme colors
    const getThemeColors = (t: PortfolioTheme) => {
      switch (t) {
        case 'champagne':
          return {
            primary: '180, 83, 9',      // warm amber bronze
            secondary: '154, 52, 18',    // terracotta bronze
            accent: '217, 119, 6',       // warm gold
            isLight: true,
          };
        case 'light':
          return {
            primary: '2, 132, 199',      // ocean blue
            secondary: '99, 102, 241',   // indigo
            accent: '217, 119, 6',       // amber
            isLight: true,
          };
        case 'amber':
          return {
            primary: '245, 158, 11',     // amber
            secondary: '251, 113, 133',  // coral rose
            accent: '251, 191, 36',      // golden
            isLight: false,
          };
        case 'forest':
          return {
            primary: '16, 185, 129',     // emerald
            secondary: '6, 182, 212',    // teal
            accent: '251, 191, 36',      // gold
            isLight: false,
          };
        case 'amethyst':
          return {
            primary: '198, 120, 221',    // luminous amethyst
            secondary: '224, 108, 117',  // rose quartz
            accent: '246, 193, 119',     // champagne gold
            isLight: false,
          };
        case 'abyss':
          return {
            primary: '6, 182, 212',      // electric cyan
            secondary: '20, 184, 166',   // bioluminescent teal
            accent: '56, 189, 248',      // sky azure
            isLight: false,
          };
        case 'midnight':
          return {
            primary: '0, 212, 255',      // laser cyan
            secondary: '123, 97, 255',   // laser purple
            accent: '255, 159, 69',      // laser amber
            isLight: false,
          };
        case 'studio':
        default:
          return {
            primary: '56, 189, 248',     // sky cyan
            secondary: '129, 140, 248',  // violet
            accent: '251, 191, 36',      // warm amber
            isLight: false,
          };
      }
    };

    // Mobile check to adjust density for maximum performance
    const isMobile = width < 768;
    const particleCount = isMobile ? 22 : 45;
    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (isMobile ? 0.25 : 0.35),
          vy: (Math.random() - 0.5) * (isMobile ? 0.25 : 0.35),
          radius: Math.random() * 1.5 + 0.8,
          baseAlpha: Math.random() * 0.3 + 0.2,
          alpha: 0.25,
          pulseSpeed: Math.random() * 0.015 + 0.008,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    initParticles();

    const handleResize = () => {
      setCanvasSize();
      initParticles();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Handle tab visibility to pause animations and conserve battery
    const handleVisibilityChange = () => {
      isPaused = document.hidden;
      if (!isPaused) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    let time = 0;
    let lastTime = performance.now();

    // Render loop
    const render = (now: number) => {
      if (isPaused) return;

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      time += delta;

      // Smooth mouse lerping
      const mouse = mouseRef.current;
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.1;
        mouse.y += (mouse.targetY - mouse.y) * 0.1;
      }

      ctx.clearRect(0, 0, width, height);

      const colors = getThemeColors(theme);
      const isLight = colors.isLight;

      // MODE 1: CONSTELLATION (Interactive physics & luminous neural links)
      if (backgroundStyle === 'constellation') {
        // Cursor proximity spotlight (gentle, stationary, follows mouse softly)
        if (mouse.active && mouse.x > 0 && mouse.y > 0) {
          const radialGlow = ctx.createRadialGradient(
            mouse.x,
            mouse.y,
            0,
            mouse.x,
            mouse.y,
            isMobile ? 160 : 220
          );
          radialGlow.addColorStop(0, `rgba(${colors.primary}, ${isLight ? 0.07 : 0.11})`);
          radialGlow.addColorStop(0.5, `rgba(${colors.secondary}, ${isLight ? 0.02 : 0.04})`);
          radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = radialGlow;
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, isMobile ? 160 : 220, 0, Math.PI * 2);
          ctx.fill();
        }

        const maxLineDist = isMobile ? 95 : 125;

        // Update & draw particles
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Gentle mouse gravity
          if (mouse.active) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150 && dist > 10) {
              const force = (150 - dist) / 150;
              p.x -= (dx / dist) * force * 0.4;
              p.y -= (dy / dist) * force * 0.4;
            }
          }

          p.x += p.vx;
          p.y += p.vy;

          // Wrap edges smoothly
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Pulsing opacity
          p.alpha = p.baseAlpha + Math.sin(time * p.pulseSpeed * 60 + p.pulseOffset) * 0.12;
          const clampedAlpha = Math.max(0.1, Math.min(0.65, p.alpha));

          // Draw node
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${colors.primary}, ${clampedAlpha * (isLight ? 0.7 : 0.9)})`;
          ctx.fill();

          // Connect nearby particles with subtle threads
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;

            // Fast box bounding check before hypot
            if (Math.abs(dx) > maxLineDist || Math.abs(dy) > maxLineDist) continue;

            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxLineDist) {
              const lineAlpha = (1 - dist / maxLineDist) * 0.18 * (isLight ? 0.55 : 0.8);
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(${colors.primary}, ${lineAlpha})`;
              ctx.lineWidth = 0.75;
              ctx.stroke();
            }
          }

          // Connect to mouse if close
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            if (Math.abs(dx) < 130 && Math.abs(dy) < 130) {
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 130) {
                const lineAlpha = (1 - dist / 130) * 0.28 * (isLight ? 0.6 : 0.85);
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(${colors.secondary}, ${lineAlpha})`;
                ctx.lineWidth = 0.85;
                ctx.stroke();
              }
            }
          }
        }
      }

      // MODE 2: ATMOSPHERIC AURORA (Luminous fluid undulations & caustics)
      else if (backgroundStyle === 'ambient') {
        const cx1 = width * 0.35 + Math.sin(time * 0.4) * (width * 0.1);
        const cy1 = height * 0.28 + Math.cos(time * 0.3) * (height * 0.08);
        const r1 = Math.min(width, height) * 0.45;

        const grad1 = ctx.createRadialGradient(cx1, cy1, 0, cx1, cy1, r1);
        grad1.addColorStop(0, `rgba(${colors.primary}, ${isLight ? 0.09 : 0.14})`);
        grad1.addColorStop(0.6, `rgba(${colors.secondary}, ${isLight ? 0.03 : 0.06})`);
        grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad1;
        ctx.fillRect(0, 0, width, height);

        const cx2 = width * 0.72 + Math.cos(time * 0.35) * (width * 0.1);
        const cy2 = height * 0.65 + Math.sin(time * 0.4) * (height * 0.1);
        const r2 = Math.min(width, height) * 0.48;

        const grad2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, r2);
        grad2.addColorStop(0, `rgba(${colors.secondary}, ${isLight ? 0.07 : 0.12})`);
        grad2.addColorStop(0.5, `rgba(${colors.accent}, ${isLight ? 0.02 : 0.05})`);
        grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad2;
        ctx.fillRect(0, 0, width, height);

        // Subtle floating bokeh dust motes
        const dustCount = isMobile ? 12 : 20;
        for (let i = 0; i < dustCount; i++) {
          const px = (Math.sin(time * 0.2 + i * 1.5) * 0.5 + 0.5) * width;
          const py = (Math.cos(time * 0.18 + i * 2.1) * 0.5 + 0.5) * height;
          const pRadius = (Math.sin(time * 0.8 + i) * 0.4 + 1.1) * 1.6;
          ctx.beginPath();
          ctx.arc(px, py, pRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${colors.primary}, ${isLight ? 0.12 : 0.22})`;
          ctx.fill();
        }
      }

      // MODE 3: ARCHITECTURAL BLUEPRINT GRID (Clean static blueprint grid, NO moving beam)
      else if (backgroundStyle === 'mesh') {
        const step = isMobile ? 40 : 48;
        const gridAlpha = isLight ? 0.045 : 0.085;

        ctx.strokeStyle = `rgba(${colors.primary}, ${gridAlpha})`;
        ctx.lineWidth = 0.75;

        // Vertical lines
        for (let x = 0; x < width; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y < height; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Highlight nearest grid intersection near mouse (smooth and interactive, NO moving scanline)
        if (mouse.active && mouse.x > 0 && mouse.y > 0) {
          const nearestX = Math.round(mouse.x / step) * step;
          const nearestY = Math.round(mouse.y / step) * step;
          ctx.fillStyle = `rgba(${colors.primary}, ${isLight ? 0.35 : 0.65})`;
          ctx.beginPath();
          ctx.arc(nearestX, nearestY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // MODE 4: VELVET MINIMAL (Deep matte with corner light caustics)
      else if (backgroundStyle === 'minimal') {
        // Soft corner vignette
        const grad = ctx.createRadialGradient(
          width / 2,
          height / 2,
          Math.min(width, height) * 0.3,
          width / 2,
          height / 2,
          Math.max(width, height) * 0.8
        );
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(1, isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(0, 0, 0, 0.35)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Soft cursor spotlight if active
        if (mouse.active && mouse.x > 0 && mouse.y > 0) {
          const spot = ctx.createRadialGradient(
            mouse.x,
            mouse.y,
            0,
            mouse.x,
            mouse.y,
            isMobile ? 180 : 240
          );
          spot.addColorStop(0, `rgba(${colors.primary}, ${isLight ? 0.04 : 0.06})`);
          spot.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = spot;
          ctx.fillRect(0, 0, width, height);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [theme, backgroundStyle]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* HTML5 Canvas Engine */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ mixBlendMode: theme === 'champagne' || theme === 'light' ? 'multiply' : 'screen' }}
      />

      {/* Atmospheric Radial Color Accents (Blended soft backdrops, completely static, no animation) */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[520px] rounded-full blur-3xl opacity-60 pointer-events-none transition-colors duration-700"
        style={{
          background: `radial-gradient(ellipse at center, var(--accent-cyan) 0%, var(--accent-violet) 40%, transparent 70%)`,
          opacity: theme === 'champagne' || theme === 'light' ? 0.15 : 0.20,
        }}
      />

      <div
        className="absolute top-[35%] -right-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-40 pointer-events-none transition-colors duration-700"
        style={{
          background: `radial-gradient(circle at center, var(--accent-violet) 0%, transparent 65%)`,
          opacity: theme === 'champagne' || theme === 'light' ? 0.10 : 0.15,
        }}
      />

      <div
        className="absolute top-[68%] -left-40 w-[550px] h-[550px] rounded-full blur-3xl opacity-40 pointer-events-none transition-colors duration-700"
        style={{
          background: `radial-gradient(circle at center, var(--accent-amber) 0%, transparent 65%)`,
          opacity: theme === 'champagne' || theme === 'light' ? 0.10 : 0.14,
        }}
      />

      {/* Bespoke Luxury Micro-Grain Overlay to eliminate digital banding */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.035] contrast-125"
        aria-hidden="true"
      >
        <filter id="canvas-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#canvas-grain)" />
      </svg>
    </div>
  );
};
