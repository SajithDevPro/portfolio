import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [hoverType, setHoverType] = useState<'cyan' | 'violet' | 'amber'>('cyan');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices or if reduced motion is requested
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('button, a, input, textarea, [data-interactive="true"]');
      if (interactive) {
        setIsHovered(true);
        if (interactive.closest('.group') || interactive.tagName === 'A') {
          setHoverType('violet');
        } else if (interactive.classList.contains('bg-[#FF9F45]') || interactive.id.includes('spark') || interactive.id.includes('init')) {
          setHoverType('amber');
        } else {
          setHoverType('cyan');
        }
      } else {
        setIsHovered(false);
        setHoverType('cyan');
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    let animationFrameId: number;
    const updateTrail = () => {
      setTrailPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.22,
        y: prev.y + (pos.y - prev.y) * 0.22
      }));
      animationFrameId = requestAnimationFrame(updateTrail);
    };
    animationFrameId = requestAnimationFrame(updateTrail);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [pos.x, pos.y, isVisible]);

  if (!isVisible) return null;

  const colorConfig = {
    cyan: {
      dot: 'bg-[#00D4FF] shadow-[0_0_10px_#00D4FF]',
      ring: 'border-[#00D4FF] shadow-[0_0_15px_rgba(0,212,255,0.4)]'
    },
    violet: {
      dot: 'bg-[#7B61FF] shadow-[0_0_10px_#7B61FF]',
      ring: 'border-[#7B61FF] shadow-[0_0_15px_rgba(123,97,255,0.4)]'
    },
    amber: {
      dot: 'bg-[#FF9F45] shadow-[0_0_10px_#FF9F45]',
      ring: 'border-[#FF9F45] shadow-[0_0_15px_rgba(255,159,69,0.5)]'
    }
  }[hoverType];

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {/* Center pinpoint */}
      <div
        className={`fixed w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-150 ${colorConfig.dot}`}
        style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      />
      {/* Trailing ring */}
      <div
        className={`fixed rounded-full border transition-all duration-75 transform -translate-x-1/2 -translate-y-1/2 ${
          colorConfig.ring
        } ${isHovered ? 'w-9 h-9 scale-110 bg-[#00D4FF]/5' : 'w-6 h-6'}`}
        style={{ left: `${trailPos.x}px`, top: `${trailPos.y}px` }}
      />
    </div>
  );
};
