import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { PROJECTS } from '../../data/portfolioData';
import { WindowChrome } from '../common/WindowChrome';
import { Project, ActiveNode } from '../../types';

interface ProjectsSectionProps {
  onNavigate: (node: ActiveNode) => void;
  selectedProjectSlug?: string | null;
  onSelectProject?: (slug: string | null) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  onNavigate,
  selectedProjectSlug,
  onSelectProject,
}) => {
  const [filter, setFilter] = useState<'all' | 'robotics' | 'ai_ml' | 'cloud'>('all');
  const [internalSlug, setInternalSlug] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll-linked depth transforms (Requirement 1)
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

  const activeSlug = selectedProjectSlug !== undefined ? selectedProjectSlug : internalSlug;
  const setActiveSlug = (slug: string | null) => {
    if (onSelectProject) {
      onSelectProject(slug);
    } else {
      setInternalSlug(slug);
    }
  };

  const selectedProject = PROJECTS.find((p) => p.slug === activeSlug);

  const filteredProjects = PROJECTS.filter((p) => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  const currentIndex = selectedProject
    ? PROJECTS.findIndex((p) => p.id === selectedProject.id)
    : 0;

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + PROJECTS.length) % PROJECTS.length;
    setActiveSlug(PROJECTS[prevIdx].slug);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % PROJECTS.length;
    setActiveSlug(PROJECTS[nextIdx].slug);
  };

  // PAGE B: Dedicated Project Deep-Dive Node
  if (selectedProject) {
    return (
      <motion.section
        ref={sectionRef}
        id="project-detail"
        aria-label={`Project: ${selectedProject.title}`}
        style={{
          scale,
          y,
          rotateX,
          opacity,
          transformPerspective: 1200,
        }}
        className="relative w-full py-8 sm:py-14 flex flex-col gap-8 animate-fadeIn"
      >
        {/* Navigation & Breadcrumb Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => setActiveSlug(null)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#182028] hover:bg-[#202934] border border-[#00D4FF]/25 text-[#00D4FF] font-code text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer group active:scale-95"
          >
            <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            <span>BACK TO ALL PROJECTS</span>
          </button>

          {/* Prev / Next controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#12161C] hover:bg-[#182028] border border-[#182028] hover:border-[#00D4FF]/30 text-[#EAF2F5] font-code text-xs transition-colors cursor-pointer"
              title="Previous project"
            >
              <span className="material-symbols-outlined text-sm">navigate_before</span>
              <span className="hidden sm:inline">PREV</span>
            </button>
            <span className="font-code text-xs text-[#5B6B75] px-2">
              {currentIndex + 1} / {PROJECTS.length}
            </span>
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#12161C] hover:bg-[#182028] border border-[#182028] hover:border-[#00D4FF]/30 text-[#EAF2F5] font-code text-xs transition-colors cursor-pointer"
              title="Next project"
            >
              <span className="hidden sm:inline">NEXT</span>
              <span className="material-symbols-outlined text-sm">navigate_next</span>
            </button>
          </div>
        </div>

        {/* Master Project Spec Sheet Card */}
        <div className="rounded-2xl bg-[#12161C] border border-[#00D4FF]/20 shadow-[0_16px_48px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col">
          <WindowChrome
            title={`schematic_${selectedProject.slug}.v4`}
            icon="memory"
            tag={selectedProject.categoryLabel.toUpperCase()}
          />

          {/* Responsive WebP Visual with Lazy Loading (Requirement 4) */}
          <div className="relative w-full h-[260px] sm:h-[380px] lg:h-[440px] bg-[#0B0F13] overflow-hidden">
            <picture>
              {selectedProject.imageMobile && (
                <source media="(max-width: 640px)" srcSet={selectedProject.imageMobile} type="image/webp" />
              )}
              <source srcSet={selectedProject.image} type="image/webp" />
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center filter contrast-105"
              />
            </picture>
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#12161C] via-[#12161C]/40 to-transparent" />

            {/* Float Info Banner */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[var(--bg-surface)] text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/35 font-code text-xs w-fit shadow-sm">
                {selectedProject.categoryLabel}
              </span>
              <h1 className="font-display text-2xl sm:text-4xl font-bold text-[#EAF2F5]">
                {selectedProject.title}
              </h1>
              <p className="font-body text-sm sm:text-base text-[#EAF2F5]/90 max-w-2xl">
                {selectedProject.tagline}
              </p>
            </div>
          </div>

          {/* Structured Spec-Sheet Readout Grid */}
          <div className="p-6 sm:p-8 flex flex-col gap-8 bg-[#12161C]">
            {/* Telemetry Hardware/Control Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-[#0B0F13] border border-[#00D4FF]/15">
              {selectedProject.specs.map((spec, sIdx) => (
                <div key={sIdx} className="flex flex-col gap-1">
                  <span className="font-code text-[10px] text-[#5B6B75] uppercase tracking-wider">
                    {spec.label}
                  </span>
                  <span className="font-display font-bold text-sm sm:text-base text-[#00D4FF]">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Problem & Approach (Cleaned Amber -> Violet/Cyan) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-[#0B0F13]/60 border border-[#182028] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-code text-[#7B61FF]">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  <span className="font-semibold uppercase tracking-wider">PROBLEM STATEMENT</span>
                </div>
                <p className="font-body text-sm text-[#EAF2F5]/85 leading-relaxed">
                  {selectedProject.problem}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#0B0F13]/60 border border-[#182028] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-code text-[#00D4FF]">
                  <span className="material-symbols-outlined text-sm">psychology</span>
                  <span className="font-semibold uppercase tracking-wider">ARCHITECTURAL APPROACH</span>
                </div>
                <p className="font-body text-sm text-[#EAF2F5]/85 leading-relaxed">
                  {selectedProject.approach}
                </p>
              </div>
            </div>

            {/* My Role & Quantitative Result */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-[#0B0F13]/60 border border-[#182028] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-code text-[#5B6B75]">
                  <span className="material-symbols-outlined text-sm">badge</span>
                  <span className="font-semibold uppercase tracking-wider text-[#EAF2F5]/90">ENGINEERING ROLE</span>
                </div>
                <p className="font-body text-sm text-[#EAF2F5]/85 leading-relaxed">
                  {selectedProject.role}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#0B0F13]/60 border border-[#182028] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-code text-[#00D4FF]">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  <span className="font-semibold uppercase tracking-wider">MEASURED RESULT</span>
                </div>
                <p className="font-body text-sm text-[#EAF2F5]/85 leading-relaxed">
                  {selectedProject.result}
                </p>
              </div>
            </div>

            {/* Tech Stack Chips */}
            <div className="flex flex-col gap-3">
              <span className="font-code text-xs text-[#5B6B75] uppercase tracking-wider">
                DEPLOYED_STACK
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedProject.stack.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded bg-[#0B0F13] text-[#00D4FF] border border-[#00D4FF]/20 font-code text-xs font-medium shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons (Amber replaced with Cyan/Slate) */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[#182028]">
              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="px-5 py-2.5 rounded-lg bg-[#182028] hover:bg-[#202934] border border-[#00D4FF]/25 hover:border-[#00D4FF] text-[#00D4FF] font-display font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
                >
                  <span className="material-symbols-outlined text-base">code_blocks</span>
                  <span>VIEW REPOSITORY</span>
                </a>
              )}

              <button
                onClick={() => onNavigate('contact')}
                className="px-5 py-2.5 rounded-lg bg-[#182028] hover:bg-[#202934] border border-[#00D4FF]/40 hover:border-[#00D4FF] text-[#00D4FF] hover:text-[#EAF2F5] font-display font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined text-base">mail</span>
                <span>DISCUSS ARCHITECTURE</span>
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    );
  }

  // PAGE A: Projects Index (Module Grid Node)
  return (
    <motion.section
      ref={sectionRef}
      id="projects"
      aria-label="Projects Schematics"
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
      <div className="flex items-center justify-between px-3.5 py-1.5 rounded-full bg-[#12161C]/80 border border-[#00D4FF]/15 backdrop-blur-md max-w-lg">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
          <span className="font-code text-xs text-[#00D4FF] uppercase tracking-wider truncate">
            03 // FEATURED PROJECTS &amp; SCHEMATICS
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-[#182028] text-[#5B6B75] font-code text-[11px] font-medium shrink-0 border border-[#182028]">
          Index
        </span>
      </div>

      {/* Header and Segmented Toggle Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#EAF2F5]">
            ENGINEERING PROJECTS
          </h2>
          <p className="font-body text-sm sm:text-base text-[#5B6B75] max-w-xl">
            Selected physical robotics platforms, quantized neural vision models, and distributed edge infrastructure.
          </p>
        </div>

        {/* Segmented Filter Toggle with Sliding Indicator */}
        <div className="flex items-center p-1 rounded-xl bg-[#12161C] border border-[#182028] backdrop-blur-md shadow-inner">
          {(
            [
              { id: 'all', label: 'ALL' },
              { id: 'robotics', label: 'ROBOTICS' },
              { id: 'ai_ml', label: 'AI/ML' },
              { id: 'cloud', label: 'CLOUD' },
            ] as const
          ).map((item) => {
            const isActive = filter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setFilter(item.id)}
                className={`px-3 sm:px-4 py-1.5 rounded-lg font-code text-xs tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[var(--accent-cyan)] text-[var(--bg-page)] font-bold shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => setActiveSlug(project.slug)}
            className="group relative rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-cyan)]/45 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-[0_12px_36px_rgba(0,0,0,0.25)] hover:-translate-y-1.5 cursor-pointer"
          >
            <WindowChrome
              title={`${project.slug}.md`}
              icon="terminal"
              tag={project.category.toUpperCase()}
              actionText="VIEW ›"
            />

            {/* Thumbnail with Responsive WebP & Lazy Loading */}
            <div className="relative w-full h-48 sm:h-56 bg-[var(--bg-surface-subtle)] overflow-hidden">
              <picture>
                {project.imageMobile && (
                  <source media="(max-width: 640px)" srcSet={project.imageMobile} type="image/webp" />
                )}
                <source srcSet={project.image} type="image/webp" />
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-surface)] via-[var(--bg-surface)]/30 to-transparent" />

              {/* Curiosity Gap One-Line Result Banner */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-[var(--bg-surface)]/95 border border-[var(--accent-cyan)]/35 font-code text-[11px] text-[var(--accent-cyan)] font-medium backdrop-blur-md">
                  {project.outcome}
                </span>
                <span className="font-code text-[10px] text-[var(--text-primary)] bg-[var(--bg-surface-elevated)]/90 px-2 py-0.5 rounded border border-[var(--border-subtle)] group-hover:border-[var(--accent-cyan)]/40 transition-colors">
                  DETAILS ›
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 sm:p-6 flex flex-col gap-4 flex-1">
              <div className="flex flex-col gap-1.5">
                <h3 className="font-display text-lg sm:text-xl font-bold text-[#EAF2F5] group-hover:text-[#00D4FF] transition-colors">
                  {project.title}
                </h3>
                <p className="font-body text-xs sm:text-sm text-[#5B6B75] line-clamp-2">
                  {project.tagline}
                </p>
              </div>

              {/* Tech Stack Chips */}
              <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                {project.stack.slice(0, 3).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-[#0B0F13] text-[#EAF2F5]/75 border border-[#182028] font-code text-[11px]"
                  >
                    {tech}
                  </span>
                ))}
                {project.stack.length > 3 && (
                  <span className="px-1.5 py-0.5 text-[#5B6B75] font-code text-[11px]">
                    +{project.stack.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};
