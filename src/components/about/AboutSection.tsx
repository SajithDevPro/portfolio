import React, { useState } from 'react';
import { PROFILE_IMAGE, TELEMETRY_STATS } from '../../data/portfolioData';
import { WindowChrome } from '../common/WindowChrome';
import { ActiveNode } from '../../types';

interface AboutSectionProps {
  onNavigate: (node: ActiveNode) => void;
  onOpenResume?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onNavigate,
  onOpenResume
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [copiedUplink, setCopiedUplink] = useState(false);

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
    <section
      id="about"
      aria-label="About Elara Vance"
      className="relative w-full py-8 sm:py-14 flex flex-col gap-8"
    >
      {/* Node Marker Header */}
      <div className="flex items-center justify-between px-3.5 py-1.5 rounded-full bg-[#12161C]/80 border border-[#00D4FF]/20 backdrop-blur-md max-w-lg">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
          <span className="font-code text-xs text-[#00D4FF] uppercase tracking-wider truncate">
            01 // PROFILE &amp; BACKGROUND
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-[#182028] text-[#5B6B75] font-code text-[11px] font-medium shrink-0">
          Verified
        </span>
      </div>

      {/* Section Title */}
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#EAF2F5]">
          ENGINEER PROFILE
        </h2>
        <p className="font-body text-sm sm:text-base text-[#5B6B75] max-w-2xl">
          Architectural background, robotics research achievements, and active engineering capabilities.
        </p>
      </div>

      {/* Main Grid: Biometric Frame (Left) + System Readout & Specs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Assembling Portrait in Hexagonal / Circuit Frame */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-xl bg-[#12161C] border border-[#00D4FF]/20 shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden">
            <WindowChrome
              title="elara_portrait.jpg"
              icon="photo_camera"
              tag="PORTRAIT"
            />

            {/* Interactive Portrait Box with 3D Tilt */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative p-6 sm:p-8 flex flex-col items-center justify-center bg-[#0B0F13] overflow-hidden"
              style={{
                perspective: '1000px'
              }}
            >
              {/* Corner Circuit Brackets */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#00D4FF]" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#00D4FF]" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#00D4FF]" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#00D4FF]" />

              {/* Hexagonal Image Frame with dynamic tilt */}
              <div
                className="relative w-64 h-64 sm:w-72 sm:h-72 transition-transform duration-200 ease-out"
                style={{
                  transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`
                }}
              >
                {/* Outer SVG Circuit Stroke that draws itself */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_12px_rgba(0,212,255,0.6)]"
                  viewBox="0 0 100 100"
                >
                  <polygon
                    points="50,2 93,25 93,75 50,98 7,75 7,25"
                    fill="none"
                    stroke="#00D4FF"
                    strokeWidth="1.5"
                    strokeDasharray="300"
                    strokeDashoffset="0"
                    className="animate-pulse"
                  />
                  <circle cx="50" cy="2" r="1.5" fill="#00D4FF" />
                  <circle cx="93" cy="25" r="1.5" fill="#7B61FF" />
                  <circle cx="93" cy="75" r="1.5" fill="#00D4FF" />
                  <circle cx="50" cy="98" r="1.5" fill="#FF9F45" />
                  <circle cx="7" cy="75" r="1.5" fill="#7B61FF" />
                  <circle cx="7" cy="25" r="1.5" fill="#00D4FF" />
                </svg>

                {/* Hexagon Clipped Image Container */}
                <div className="absolute inset-2 clip-hex overflow-hidden bg-[#182028]">
                  <img
                    src={PROFILE_IMAGE}
                    alt="Elara Vance Cybernetic Engineer"
                    className="w-full h-full object-cover object-center filter grayscale contrast-110 hover:grayscale-0 transition-all duration-700"
                  />

                  {/* Scanline overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00D4FF]/10 to-transparent opacity-40 pointer-events-none" />
                </div>

                {/* Bottom telemetry overlay badge */}
                <div className="absolute bottom-4 right-4 z-10 px-2 py-0.5 rounded bg-[#0A0E12]/90 border border-[#00D4FF]/30 font-code text-[10px] text-[#00D4FF]">
                  LAT: 47.6062° N
                </div>
              </div>

              {/* Synapse Verification Hash */}
              <div className="mt-5 w-full flex items-center justify-between px-3 py-1.5 rounded bg-[#12161C] border border-[#182028] font-code text-[11px] text-[#5B6B75]">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[13px] text-[#00D4FF]">
                    fingerprint
                  </span>
                  SYNAPSE_HASH: 0x9B4E...A1F0
                </span>
                <span className="text-[#00D4FF] font-semibold">SIG_VERIFIED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Structured System Spec Sheet & Telemetry */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* System Spec Sheet Readout */}
          <div className="p-6 rounded-xl bg-[#12161C] border border-[#00D4FF]/20 shadow-md flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#182028] pb-3">
              <span className="font-display font-semibold text-sm tracking-wider uppercase text-[#00D4FF]">
                ENGINEER SPECIFICATIONS
              </span>
              <span className="font-code text-[11px] text-[#5B6B75]">
                REF: EV-ROBOTICS
              </span>
            </div>

            <div className="flex flex-col gap-3 font-code text-xs">
              <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-[#182028]">
                <span className="text-[#5B6B75] uppercase tracking-wider">FULL NAME</span>
                <span className="text-[#EAF2F5] font-semibold">ELARA VANCE</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-[#182028]">
                <span className="text-[#5B6B75] uppercase tracking-wider">ROLE</span>
                <span className="text-[#00D4FF] font-medium">
                  Software Systems Engineer (Robotics &amp; Edge ML)
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-[#182028]">
                <span className="text-[#5B6B75] uppercase tracking-wider">EDUCATION</span>
                <span className="text-[#EAF2F5]">
                  B.S. Software Engineering, Robotics Focus
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-[#182028]">
                <span className="text-[#5B6B75] uppercase tracking-wider">CORE FOCUS</span>
                <span className="text-[#EAF2F5]">
                  Autonomous Kinematics &amp; Edge Tensor Inference
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-[#182028]">
                <span className="text-[#5B6B75] uppercase tracking-wider">LOCATION</span>
                <span className="text-[#5B6B75]">
                  Seattle, WA (Open to Relocation &amp; Remote)
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between py-1.5">
                <span className="text-[#5B6B75] uppercase tracking-wider">AVAILABILITY</span>
                <span className="text-[#FF9F45] font-semibold">
                  ACCEPTING ROBOTICS &amp; EMBODIED AI ROLES (2025/2026)
                </span>
              </div>
            </div>
          </div>

          {/* Real Telemetry Performance Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TELEMETRY_STATS.map((stat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#12161C] border border-[#00D4FF]/15 flex flex-col gap-2 relative overflow-hidden group hover:border-[#00D4FF]/40 transition-colors"
              >
                <div className="flex items-center justify-between text-[#5B6B75] text-[11px] font-code">
                  <span>{stat.label}</span>
                  <span className="material-symbols-outlined text-[15px] text-[#00D4FF]">
                    {stat.icon}
                  </span>
                </div>

                <div className="font-display text-xl sm:text-2xl font-bold text-[#EAF2F5]">
                  {stat.value}
                </div>

                <div className="font-body text-xs text-[#5B6B75] leading-snug">
                  {stat.subtext}
                </div>

                {/* Progress power meter */}
                <div className="w-full h-1 bg-[#0B0F13] rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-[#00D4FF] to-[#7B61FF] rounded-full"
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Philosophy Statement */}
          <div className="p-4 rounded-xl bg-[#0B0F13] border border-[#7B61FF]/20 flex items-start gap-3">
            <span className="material-symbols-outlined text-lg text-[#7B61FF] shrink-0 mt-0.5">
              psychology
            </span>
            <div className="flex flex-col gap-1">
              <span className="font-code text-[11px] text-[#7B61FF] uppercase tracking-wider">
                ENGINEERING PHILOSOPHY
              </span>
              <p className="font-body text-xs sm:text-sm text-[#EAF2F5]/80 italic leading-relaxed">
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
                  alert('Resume PDF downloaded: Elara_Vance_Software_Systems_Engineer.pdf');
                }
              }}
              className="min-h-[46px] flex-1 px-5 py-2.5 rounded-lg bg-[#FF9F45] hover:bg-[#ffb066] text-[#2E1500] font-display font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(255,159,69,0.3)] active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>DOWNLOAD RESUME (PDF)</span>
            </button>

            <button
              onClick={handleCopyUplink}
              className="min-h-[46px] flex-1 px-5 py-2.5 rounded-lg bg-[#182028] hover:bg-[#202934] border border-[#00D4FF]/30 hover:border-[#00D4FF] text-[#00D4FF] font-display font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">
                {copiedUplink ? 'check_circle' : 'content_copy'}
              </span>
              <span>{copiedUplink ? 'EMAIL COPIED TO CLIPBOARD' : 'COPY DIRECT EMAIL'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
