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
      <div className="flex items-center justify-between px-3.5 py-1.5 rounded-full bg-[#12161C]/80 border border-[#7B61FF]/20 backdrop-blur-md max-w-lg">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#7B61FF] animate-pulse" />
          <span className="font-code text-xs text-[#7B61FF] uppercase tracking-wider truncate">
            02 // SKILLS &amp; ARCHITECTURES
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-[#182028] text-[#5B6B75] font-code text-[11px] font-medium shrink-0 border border-[#182028]">
          3 Core Areas
        </span>
      </div>

      {/* Section Title */}
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#EAF2F5]">
          CORE SKILLS &amp; DOMAINS
        </h2>
        <p className="font-body text-sm sm:text-base text-[#5B6B75] max-w-2xl">
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
              className={`group relative rounded-2xl bg-[#12161C] border transition-all duration-300 flex flex-col overflow-hidden cursor-pointer shadow-lg ${
                isSelected
                  ? 'border-[#00D4FF]/80 shadow-[0_0_24px_rgba(0,212,255,0.18)] transform -translate-y-1.5'
                  : 'border-[#182028] hover:border-[#00D4FF]/35 hover:-translate-y-1'
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
                    <span className="font-code text-[11px] text-[#7B61FF] uppercase tracking-wider">
                      {module.subtitle}
                    </span>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-[#EAF2F5] mt-1 group-hover:text-[#00D4FF] transition-colors">
                      {module.title}
                    </h3>
                  </div>

                  {/* Animated Module Icon (Muted slate by default, illuminated on hover/select) */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-300 ${
                      isSelected
                        ? 'bg-[#00D4FF]/10 border-[#00D4FF]/60 text-[#00D4FF] scale-110 shadow-[0_0_12px_rgba(0,212,255,0.3)]'
                        : 'bg-[#182028] border-[#182028] text-[#5B6B75] group-hover:text-[#00D4FF] group-hover:border-[#00D4FF]/30'
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
                <p className="font-body text-xs sm:text-sm text-[#EAF2F5]/80 leading-relaxed">
                  {module.description}
                </p>

                {/* Concrete Architectural Highlights */}
                <div className="flex flex-col gap-2 pt-2 border-t border-[#182028]">
                  <span className="font-code text-[10px] text-[#5B6B75] uppercase tracking-wider">
                    VALIDATED EXPERTISE
                  </span>
                  <ul className="flex flex-col gap-1.5 font-body text-xs text-[#EAF2F5]/75">
                    {module.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2">
                        <span className="text-[#00D4FF] font-code text-xs mt-0.5">›</span>
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
                      className="px-2 py-0.5 rounded bg-[#0B0F13] text-[#EAF2F5]/80 border border-[#182028] font-code text-[11px]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Power / Signal Meter */}
                <div className="mt-auto pt-3 border-t border-[#182028] flex flex-col gap-1.5">
                  <div className="flex items-center justify-between font-code text-[11px]">
                    <span className="text-[#5B6B75]">POWER_INDEX: {module.signalPower}</span>
                    <span className="text-[#00D4FF] font-semibold">{module.competencyLevel}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0B0F13] rounded-full overflow-hidden p-0.5 border border-[#182028]">
                    <div
                      className="h-full bg-gradient-to-r from-[#00D4FF] via-[#7B61FF] to-[#00D4FF] rounded-full transition-all duration-700 ease-out"
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
