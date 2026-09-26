import React from 'react';
import { EMBLEM_IMAGE, PROFILE_IMAGE } from '../../data/portfolioData';
import { ActiveNode } from '../../types';

interface HeaderProps {
  activeNode: ActiveNode;
  onNavigate: (node: ActiveNode) => void;
  onOpenResume?: () => void;
  onOpenChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeNode,
  onNavigate,
  onOpenResume,
  onOpenChat,
}) => {
  const nodeDisplayNames: Record<ActiveNode, string> = {
    hero: 'Home',
    about: 'Profile',
    skills: 'Skills',
    projects: 'Projects',
    interests: 'Research',
    contact: 'Contact'
  };

  const nodeDescriptions: Record<ActiveNode, string> = {
    hero: 'Home — Introduction & 3D Interactive Model',
    about: 'Profile — Engineering background, bio & telemetry',
    skills: 'Skills — Robotics, Edge AI & Cloud architectures',
    projects: 'Projects — Interactive hardware & software schematics',
    interests: 'Research — Lab experiments, hardware synthesis & interests',
    contact: 'Contact — Direct message form & email'
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#0A0E12]/85 backdrop-blur-xl border-b border-[#00D4FF]/15 transition-all">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Zone 1: Clear Human Identity & Genesis Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-[#12161C] border border-[#00D4FF]/30 p-1 group-hover:border-[#00D4FF] transition-colors">
              <img
                src={EMBLEM_IMAGE}
                alt="Genesis Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-sm tracking-wider text-[#EAF2F5] group-hover:text-[#00D4FF] transition-colors">
                  ELARA VANCE
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-code bg-[#12161C] text-[#00D4FF] border border-[#00D4FF]/25">
                  GENESIS
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-code text-[#5B6B75]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping-subtle absolute inline-flex h-full w-full rounded-full bg-[#00D4FF] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00D4FF]"></span>
                </span>
                <span>Robotics &amp; AI Engineer</span>
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Trace Navigation Links (Desktop) - Self-Explanatory (Requirement 4) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {(['hero', 'about', 'skills', 'projects', 'interests', 'contact'] as ActiveNode[]).map((node) => {
            const isActive = activeNode === node;
            const labels: Record<ActiveNode, string> = {
              hero: 'HOME',
              about: 'PROFILE',
              skills: 'SKILLS',
              projects: 'PROJECTS',
              interests: 'RESEARCH',
              contact: 'CONTACT'
            };
            return (
              <button
                key={node}
                onClick={() => onNavigate(node)}
                title={nodeDescriptions[node]}
                className={`transition-colors text-xs font-code tracking-wider uppercase relative py-1 cursor-pointer ${
                  isActive
                    ? 'text-[#00D4FF] font-semibold drop-shadow-[0_0_8px_rgba(0,212,255,0.7)]'
                    : 'text-[#5B6B75] hover:text-[#EAF2F5]'
                }`}
              >
                {labels[node]}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00D4FF] to-[#7B61FF] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Active Section Indicator & Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex flex-col items-end pr-1 text-right">
            <span className="font-code text-[10px] text-[#5B6B75] uppercase tracking-wider">
              CURRENT SECTION
            </span>
            <span className="font-code text-xs text-[#00D4FF] font-semibold">
              {nodeDisplayNames[activeNode]}
            </span>
          </div>

          {/* Gemini AI Co-Pilot Button */}
          {onOpenChat && (
            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00D4FF]/10 hover:bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40 font-code text-xs font-medium transition-all active:scale-95 shadow-[0_0_12px_rgba(0,212,255,0.25)] cursor-pointer"
              title="Chat with an AI trained on Elara's background and engineering projects"
            >
              <span className="material-symbols-outlined text-sm animate-pulse">voice_chat</span>
              <span className="hidden xs:inline">ASK AI ASSISTANT</span>
            </button>
          )}

          {/* Quick Resume Spec Button */}
          {onOpenResume && (
            <button
              onClick={onOpenResume}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#182028] hover:bg-[#202934] text-[#EAF2F5] border border-[#00D4FF]/25 font-code text-xs font-medium transition-all active:scale-95 cursor-pointer"
              title="View full resume spec sheet"
            >
              <span className="material-symbols-outlined text-sm text-[#00D4FF]">description</span>
              <span>RESUME / CV</span>
            </button>
          )}

          {/* Profile mini avatar */}
          <button
            onClick={() => onNavigate('about')}
            className="relative flex items-center justify-center p-0.5 rounded-full bg-[#182028] border border-[#00D4FF]/40 shadow-[0_0_10px_rgba(0,212,255,0.3)] hover:border-[#00D4FF] transition-all cursor-pointer"
            title="View Engineer Profile"
          >
            <img
              src={PROFILE_IMAGE}
              alt="Elara Vance"
              className="w-7 h-7 rounded-full object-cover"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-[#00D4FF] rounded-full ring-2 ring-[#0A0E12]" />
          </button>
        </div>
      </div>
    </header>
  );
};
