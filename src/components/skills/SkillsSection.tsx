import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { SKILL_MODULES } from '../../data/portfolioData';
import { WindowChrome } from '../common/WindowChrome';
import { ActiveNode } from '../../types';

interface SkillsSectionProps {
  onNavigate: (node: ActiveNode) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ onNavigate }) => {
  const [activeModuleId, setActiveModuleId] = useState<string>('skill-robotics');
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll-linked physical tile depth transforms (Requirement 1)
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
      id="skills"
      aria-label="Skills & Architectures"
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
      <div className="flex items-center justify-between px-3.5 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] backdrop-blur-md max-w-lg">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-violet)] animate-pulse" />
          <span className="font-body text-xs text-[var(--accent-violet)] font-semibold tracking-wide truncate">
            02 · Skills &amp; Architectures
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] font-body text-[11px] font-medium shrink-0 border border-[var(--border-subtle)]">
          3 Core Areas
        </span>
      </div>

      {/* Section Title */}
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Core Skills &amp; Domains
        </h2>
        <p className="font-body text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed">
          Hardware-software co-design modules docked directly to physical platforms and edge infrastructure.
        </p>
      </div>

      {/* 3 Pillar Module Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {SKILL_MODULES.map((module) => {
          const isSelected = activeModuleId === module.id;

          return (
            <div
              key={module.id}
              onClick={() => setActiveModuleId(module.id)}
              className={`group relative rounded-2xl bg-[var(--bg-surface)] border transition-all duration-300 flex flex-col overflow-hidden cursor-pointer shadow-lg ${
                isSelected
                  ? 'border-[var(--accent-cyan)] shadow-md transform -translate-y-1.5'
                  : 'border-[var(--border-subtle)] hover:border-[var(--accent-cyan)]/45 hover:-translate-y-1'
              }`}
            >
              {/* Window Chrome with macOS traffic lights */}
              <WindowChrome
                title={`${module.category}_stack.md`}
                icon={
                  module.iconType === 'servo'
                    ? 'precision_manufacturing'
                    : module.iconType === 'neural'
                    ? 'neurology'
                    : 'cloud'
                }
                tag={module.category.toUpperCase()}
              />

              <div className="p-6 flex flex-col gap-5 flex-1">
                {/* Header with animated custom vector icon */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="font-code text-[11px] text-[var(--accent-violet)] uppercase tracking-wider font-semibold">
                      {module.subtitle}
                    </span>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--text-primary)] mt-1 group-hover:text-[var(--accent-cyan)] transition-colors">
                      {module.title}
                    </h3>
                  </div>

                  {/* Animated Module Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-300 ${
                      isSelected
                        ? 'bg-[var(--accent-cyan)]/15 border-[var(--accent-cyan)]/60 text-[var(--accent-cyan)] scale-110 shadow-sm'
                        : 'bg-[var(--bg-surface-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)] group-hover:text-[var(--accent-cyan)] group-hover:border-[var(--accent-cyan)]/40'
                    }`}
                  >
                    {module.iconType === 'servo' && (
                      <svg className="w-6 h-6 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2.5 2.5M16.5 16.5L19 19M19 5l-2.5 2.5M7.5 16.5L5 19" />
                      </svg>
                    )}
                    {module.iconType === 'neural' && (
                      <svg className="w-6 h-6 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="6" cy="6" r="2" />
                        <circle cx="18" cy="6" r="2" />
                        <circle cx="12" cy="12" r="2" />
                        <circle cx="6" cy="18" r="2" />
                        <circle cx="18" cy="18" r="2" />
                        <path d="M8 6h8M6 8l4 3M18 8l-4 3M6 16l4-3M18 16l-4-3M8 18h8" />
                      </svg>
                    )}
                    {module.iconType === 'cluster' && (
                      <svg className="w-6 h-6 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="2" width="20" height="8" rx="2" />
                        <rect x="2" y="14" width="20" height="8" rx="2" />
                        <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="3" />
                        <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="3" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Explanatory Body */}
                <p className="font-body text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {module.description}
                </p>

                {/* Concrete Architectural Highlights */}
                <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border-subtle)]">
                  <span className="font-code text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
                    VALIDATED EXPERTISE
                  </span>
                  <ul className="flex flex-col gap-1.5 font-body text-xs text-[var(--text-secondary)]">
                    {module.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2">
                        <span className="text-[var(--accent-cyan)] font-code text-xs mt-0.5">›</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Chips List */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {module.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-0.5 rounded-md bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] font-code text-[11px]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Power / Signal Meter */}
                <div className="mt-auto pt-3 border-t border-[var(--border-subtle)] flex flex-col gap-1.5">
                  <div className="flex items-center justify-between font-code text-[11px]">
                    <span className="text-[var(--text-muted)]">POWER_INDEX: {module.signalPower}</span>
                    <span className="text-[var(--accent-cyan)] font-semibold">{module.competencyLevel}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--bg-surface-subtle)] rounded-full overflow-hidden p-0.5 border border-[var(--border-subtle)]">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--accent-cyan)] via-[var(--accent-violet)] to-[var(--accent-cyan)] rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${module.competencyLevel}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fast Path to Projects CTA */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => onNavigate('projects')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#182028] hover:bg-[#202934] border border-[#00D4FF]/25 hover:border-[#00D4FF] text-[#00D4FF] font-code text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <span>VIEW FEATURED PROJECTS</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </motion.section>
  );
};
