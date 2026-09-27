import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { INTERESTS } from '../../data/portfolioData';
import { ActiveNode } from '../../types';

interface InterestsSectionProps {
  onNavigate: (node: ActiveNode) => void;
}

export const InterestsSection: React.FC<InterestsSectionProps> = ({ onNavigate }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll-linked physical depth transforms (Requirement 1)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const rawScale = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [0.93, 1, 1, 0.96]);
  const rawY = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [40, 0, 0, -25]);
  const rawRotateX = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [3, 0, 0, -2]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.16, 0.84, 1], [0.35, 1, 1, 0.45]);

  const scale = shouldReduceMotion ? 1 : rawScale;
  const y = shouldReduceMotion ? 0 : rawY;
  const rotateX = shouldReduceMotion ? 0 : rawRotateX;
  const opacity = rawOpacity;

  return (
    <motion.section
      ref={sectionRef}
      id="interests"
      aria-label="Interests & Human Peripherals"
      style={{
        scale,
        y,
        rotateX,
        opacity,
        transformPerspective: 1200,
      }}
      className="relative w-full py-8 sm:py-14 flex flex-col gap-8"
    >
      {/* Node Marker Header */}
      <div className="flex items-center justify-between px-3.5 py-1.5 rounded-full bg-[#12161C]/80 border border-[#7B61FF]/20 backdrop-blur-md max-w-lg">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#7B61FF] animate-pulse" />
          <span className="font-code text-xs text-[#7B61FF] uppercase tracking-wider truncate">
            04 // RESEARCH &amp; LAB INTERESTS
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-[#182028] text-[#5B6B75] font-code text-[11px] font-medium shrink-0 border border-[#182028]">
          Exploration
        </span>
      </div>

      {/* Section Title */}
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#EAF2F5]">
          RESEARCH &amp; INTERESTS
        </h2>
        <p className="font-body text-sm sm:text-base text-[#5B6B75] max-w-2xl">
          The exploratory side beyond production code: hardware ergonomics, emergent flocking physics, high-speed manual flight, and modular sound synthesis.
        </p>
      </div>

      {/* Satellite Cards Grid with Violet / Cyan Accents (Amber Removed per Rule 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {INTERESTS.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-violet)]/45 transition-all duration-300 p-5 flex flex-col gap-4 overflow-hidden shadow-md hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:-translate-y-1"
          >
            {/* Ambient Radial Accent on Hover */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-[var(--accent-violet)]/10 rounded-full blur-2xl group-hover:bg-[var(--accent-violet)]/20 transition-all pointer-events-none" />

            {/* Header Icon + Tag */}
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)] group-hover:text-[var(--accent-violet)] group-hover:border-[var(--accent-violet)]/40 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
              </div>
              <span className="font-code text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
                {item.tag}
              </span>
            </div>

            {/* Title & Short Phrase */}
            <div className="flex flex-col gap-1">
              <h3 className="font-display text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors">
                {item.title}
              </h3>
              <span className="font-code text-xs text-[var(--accent-cyan)]/85">
                {item.phrase}
              </span>
            </div>

            {/* Description */}
            <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed mt-auto pt-1">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Terminal Connector Bridge */}
      <div className="flex items-center justify-center pt-4">
        <button
          onClick={() => onNavigate('contact')}
          className="flex items-center gap-2 text-xs font-code text-[#00D4FF] hover:text-[#EAF2F5] transition-colors cursor-pointer"
        >
          <span>PROCEED TO CONTACT FORM ›</span>
          <span className="material-symbols-outlined text-sm">arrow_downward</span>
        </button>
      </div>
    </motion.section>
  );
};
