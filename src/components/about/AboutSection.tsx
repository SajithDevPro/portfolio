import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { PROFILE_IMAGE, TELEMETRY_STATS } from '../../data/portfolioData';
import { WindowChrome } from '../common/WindowChrome';
import { ActiveNode } from '../../types';

interface AboutSectionProps {
  onNavigate: (node: ActiveNode) => void;
  onOpenResume?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onNavigate: _onNavigate,
  onOpenResume
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [copiedUplink, setCopiedUplink] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll-linked transforms (Requirement 1)
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 10, y: -y * 10 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleCopyUplink = () => {
    navigator.clipboard?.writeText('elara.vance.robotics@genesis.engineering');
    setCopiedUplink(true);
    setTimeout(() => setCopiedUplink(false), 2400);
  };

  return (
    <motion.section
      ref={sectionRef}
      id="about"
      aria-label="About Elara Vance"
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
          <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
          <span className="font-body text-xs text-[var(--accent-cyan)] font-semibold tracking-wide truncate">
            01 · Profile &amp; Background
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] font-body text-[11px] font-medium shrink-0 border border-[var(--border-subtle)]">
          Verified
        </span>
      </div>

      {/* Section Title */}
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
          Engineer Profile
        </h2>
        <p className="font-body text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed">
          Architectural background, robotics research achievements, and active engineering capabilities.
        </p>
      </div>

      {/* Main Grid: Biometric Frame (Left) + System Readout & Specs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Assembling Portrait in Hexagonal / Circuit Frame */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-lg overflow-hidden">
            <WindowChrome
              title="elara_portrait.jpg"
              icon="photo_camera"
              tag="PORTRAIT"
            />

            {/* Interactive Portrait Box with 3D Tilt */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative p-6 sm:p-8 flex flex-col items-center justify-center bg-[var(--bg-surface-subtle)] overflow-hidden"
              style={{
                perspective: '1000px',
              }}
            >
              {/* Corner Circuit Brackets */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[var(--accent-cyan)]/50" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[var(--accent-cyan)]/50" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[var(--accent-cyan)]/50" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[var(--accent-cyan)]/50" />

              {/* Hexagonal Image Frame with dynamic tilt */}
              <div
                className="relative w-64 h-64 sm:w-72 sm:h-72 transition-transform duration-200 ease-out"
                style={{
                  transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                }}
              >
                {/* Outer SVG Circuit Stroke */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_10px_rgba(56,189,248,0.35)]"
                  viewBox="0 0 100 100"
                >
                  <polygon
                    points="50,2 93,25 93,75 50,98 7,75 7,25"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeDasharray="300"
                    strokeDashoffset="0"
                    className="text-[var(--accent-cyan)] opacity-70"
                  />
                  <circle cx="50" cy="2" r="1.5" fill="var(--accent-cyan)" />
                  <circle cx="93" cy="25" r="1.5" fill="var(--accent-violet)" />
                  <circle cx="93" cy="75" r="1.5" fill="var(--accent-cyan)" />
                  <circle cx="50" cy="98" r="1.5" fill="var(--accent-violet)" />
                  <circle cx="7" cy="75" r="1.5" fill="var(--accent-violet)" />
                  <circle cx="7" cy="25" r="1.5" fill="var(--accent-cyan)" />
                </svg>

                {/* Hexagon Clipped Image Container */}
                <div className="absolute inset-2 clip-hex overflow-hidden bg-[var(--bg-surface-elevated)]">
                  <img
                    src={PROFILE_IMAGE}
                    alt="Elara Vance Cybernetic Engineer"
                    className="w-full h-full object-cover object-center filter grayscale contrast-110 hover:grayscale-0 transition-all duration-700"
                  />

                  {/* Scanline overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--accent-cyan)]/10 to-transparent opacity-40 pointer-events-none" />
                </div>

                {/* Bottom telemetry overlay badge */}
                <div className="absolute bottom-4 right-4 z-10 px-2.5 py-1 rounded-full bg-[var(--bg-surface)]/95 border border-[var(--border-subtle)] font-body text-[11px] text-[var(--accent-cyan)] font-medium">
                  Seattle, WA
                </div>
              </div>

              {/* Identity Verification Status */}
              <div className="mt-5 w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] font-body text-xs text-[var(--text-secondary)]">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-[var(--accent-cyan)]">
                    verified
                  </span>
                  <span>Autonomous Robotics Architect</span>
                </span>
                <span className="text-[var(--accent-cyan)] font-semibold text-[11px]">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Structured System Spec Sheet & Telemetry */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* System Spec Sheet Readout */}
          <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-md flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <span className="font-display font-bold text-sm tracking-wide text-[var(--accent-cyan)]">
                Engineer Specifications
              </span>
              <span className="font-body text-xs text-[var(--text-muted)]">
                EV-ROBOTICS
              </span>
            </div>

            <div className="flex flex-col gap-3 font-body text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">Full Name</span>
                <span className="text-[var(--text-primary)] font-semibold">Elara Vance</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">Specialization</span>
                <span className="text-[var(--accent-cyan)] font-medium">
                  Software Systems Engineer (Robotics &amp; Edge ML)
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">Education</span>
                <span className="text-[var(--text-primary)]">
                  B.S. Software Engineering, Robotics Focus
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">Core Focus</span>
                <span className="text-[var(--text-primary)]">
                  Autonomous Kinematics &amp; Edge Tensor Inference
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)]">Location</span>
                <span className="text-[var(--text-primary)]">
                  Seattle, WA (Open to Relocation &amp; Remote)
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between py-2">
                <span className="text-[var(--text-secondary)]">Availability</span>
                <span className="text-[var(--accent-cyan)] font-semibold">
                  Open for Robotics &amp; Embodied AI Roles (2025/2026)
                </span>
              </div>
            </div>
          </div>

          {/* Real Telemetry Performance Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TELEMETRY_STATS.map((stat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col gap-2 relative overflow-hidden group hover:border-[var(--accent-cyan)]/40 transition-colors shadow-sm"
              >
                <div className="flex items-center justify-between text-[var(--text-secondary)] text-xs font-body">
                  <span className="font-medium">{stat.label}</span>
                  <span className="material-symbols-outlined text-[16px] text-[var(--text-muted)] group-hover:text-[var(--accent-cyan)] transition-colors">
                    {stat.icon}
                  </span>
                </div>

                <div className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                  {stat.value}
                </div>

                <div className="font-body text-xs text-[var(--text-secondary)] leading-snug">
                  {stat.subtext}
                </div>

                {/* Progress power meter */}
                <div className="w-full h-1.5 bg-[var(--bg-surface-elevated)] rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-violet)] rounded-full"
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Philosophy Statement */}
          <div className="p-4 rounded-xl bg-[var(--bg-surface-subtle)] border border-[var(--accent-violet)]/20 flex items-start gap-3">
            <span className="material-symbols-outlined text-lg text-[var(--accent-violet)] shrink-0 mt-0.5">
              psychology
            </span>
            <div className="flex flex-col gap-1">
              <span className="font-body text-xs font-semibold text-[var(--accent-violet)] tracking-wide">
                Engineering Philosophy
              </span>
              <p className="font-body text-xs sm:text-sm text-[var(--text-secondary)] italic leading-relaxed">
                "We do not simply write code; we grant machines perception, deterministic balance, and embodied intent."
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                if (onOpenResume) {
                  onOpenResume();
                } else {
                  alert('Resume spec sheet ready.');
                }
              }}
              className="min-h-[46px] flex-1 px-5 py-2.5 rounded-lg bg-[var(--accent-cyan)]/10 hover:bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/40 font-body font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">description</span>
              <span>View Resume Spec Sheet</span>
            </button>

            <button
              onClick={handleCopyUplink}
              className="min-h-[46px] flex-1 px-5 py-2.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-cyan)]/40 text-[var(--text-primary)] font-body font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-base text-[var(--accent-cyan)]">
                {copiedUplink ? 'check_circle' : 'content_copy'}
              </span>
              <span>{copiedUplink ? 'Email Copied!' : 'Copy Direct Email'}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
