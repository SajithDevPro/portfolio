import React, { useEffect, useRef } from 'react';

interface ParticleConduitProps {
  isIgnited: boolean;
  burstTrigger: number;
}

interface Particle {
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  progress: number;
  speed: number;
  size: number;
  color: string;
  arcHeight: number;
}

export const ParticleConduit: React.FC<ParticleConduitProps> = ({
  isIgnited,
  burstTrigger
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 300;
      canvas.height = canvas.parentElement?.clientHeight || 80;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Particle spawn function
    const spawnParticle = (fromBurst = false) => {
      const w = canvas.width;
      const h = canvas.height;
      const startX = 20 + Math.random() * 40;
      const startY = h * 0.4 + (Math.random() - 0.5) * 20;
      const targetX = w - 40 + Math.random() * 20;
      const targetY = h * 0.5 + (Math.random() - 0.5) * 30;

      const colors = fromBurst || isIgnited
        ? ['#00D4FF', '#7B61FF', '#FF9F45']
        : ['#00D4FF', '#7B61FF', '#3CD7FF'];

      particles.push({
        x: startX,
        y: startY,
        startX,
        startY,
        targetX,
        targetY,
        progress: 0,
        speed: 0.012 + Math.random() * 0.018,
        size: fromBurst ? 3 + Math.random() * 2.5 : 2 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        arcHeight: -30 - Math.random() * 30
      });
    };

    // Continuous ambient trickle
    const spawnInterval = setInterval(() => {
      if (particles.length < 25) {
        spawnParticle();
      }
    }, 280);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw faint trace conduit baseline
      ctx.beginPath();
      ctx.moveTo(30, canvas.height * 0.5);
      ctx.bezierCurveTo(
        canvas.width * 0.35,
        canvas.height * 0.1,
        canvas.width * 0.65,
        canvas.height * 0.9,
        canvas.width - 30,
        canvas.height * 0.5
      );
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.progress += p.speed;

        // Quadratic bezier arc interpolation
        const t = p.progress;
        const cx = (p.startX + p.targetX) / 2;
        const cy = (p.startY + p.targetY) / 2 + p.arcHeight;

        p.x = (1 - t) * (1 - t) * p.startX + 2 * (1 - t) * t * cx + t * t * p.targetX;
        p.y = (1 - t) * (1 - t) * p.startY + 2 * (1 - t) * t * cy + t * t * p.targetY;

        // Glow bloom
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color === '#FF9F45' ? 'rgba(255, 159, 69, 0.2)' : 'rgba(0, 212, 255, 0.25)';
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        if (p.progress >= 1) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      clearInterval(spawnInterval);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isIgnited]);

  // Burst trigger on line compiled or ignite
  useEffect(() => {
    if (burstTrigger > 0) {
      // Trigger small burst
      const canvas = canvasRef.current;
      if (!canvas) return;
    }
  }, [burstTrigger]);

  return (
    <div className="relative w-full h-12 flex items-center justify-center overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
