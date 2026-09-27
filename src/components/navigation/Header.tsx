import React from 'react';
import { EMBLEM_IMAGE, PROFILE_IMAGE } from '../../data/portfolioData';
import { ActiveNode } from '../../types';
import { ThemeSwitcher } from '../common/ThemeSwitcher';

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
    <header className="fixed top-0 inset-x-0 z-40 bg-[var(--bg-page)]/85 backdrop-blur-xl border-b border-[var(--border-subtle)] transition-all">
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Zone 1: Clear Human Identity & Genesis Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--bg-surface)] border border-[var(--border-strong)] p-1 group-hover:border-[var(--accent-cyan)] transition-colors shadow-sm">
              <img
                src={EMBLEM_IMAGE}
                alt="Genesis Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-sm tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors">
                  Elara Vance
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-code bg-[var(--bg-surface-elevated)] text-[var(--accent-cyan)] border border-[var(--border-subtle)]">
                  Genesis
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-body text-[var(--text-secondary)]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping-subtle absolute inline-flex h-full w-full rounded-full bg-[var(--accent-cyan)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--accent-cyan)]"></span>
                </span>
                <span>Robotics &amp; AI Systems Engineer</span>
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Trace Navigation Links (Desktop) - User-Friendly Title Case */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {(['hero', 'about', 'skills', 'projects', 'interests', 'contact'] as ActiveNode[]).map((node) => {
            const isActive = activeNode === node;
            const labels: Record<ActiveNode, string> = {
              hero: 'Home',
              about: 'Profile',
              skills: 'Skills',
              projects: 'Projects',
              interests: 'Research',
              contact: 'Contact'
            };
            return (
              <button
                key={node}
                onClick={() => onNavigate(node)}
                title={nodeDescriptions[node]}
                className={`transition-colors text-xs sm:text-sm font-body font-medium relative py-1 cursor-pointer ${
                  isActive
                    ? 'text-[var(--accent-cyan)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {labels[node]}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-violet)] rounded-full shadow-[0_0_8px_var(--accent-cyan)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Active Section Indicator & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* User-Friendly Theme Switcher */}
          <ThemeSwitcher />

          {/* Gemini AI Assistant Button */}
          {onOpenChat && (
            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-cyan)]/10 hover:bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/35 font-body text-xs font-semibold transition-all active:scale-95 shadow-sm cursor-pointer"
              title="Chat with an AI trained on Elara's background and engineering projects"
            >
              <span className="material-symbols-outlined text-sm animate-pulse">voice_chat</span>
              <span className="hidden xs:inline">Ask AI</span>
            </button>
          )}

          {/* Quick Resume Spec Button */}
          {onOpenResume && (
            <button
              onClick={onOpenResume}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)] font-body text-xs font-medium transition-all active:scale-95 cursor-pointer shadow-sm"
              title="View full resume spec sheet"
            >
              <span className="material-symbols-outlined text-sm text-[var(--accent-cyan)]">description</span>
              <span>Resume</span>
            </button>
          )}

          {/* Profile mini avatar */}
          <button
            onClick={() => onNavigate('about')}
            className="relative flex items-center justify-center p-0.5 rounded-full bg-[var(--bg-surface)] border border-[var(--accent-cyan)]/40 shadow-sm hover:border-[var(--accent-cyan)] transition-all cursor-pointer"
            title="View Engineer Profile"
          >
            <img
              src={PROFILE_IMAGE}
              alt="Elara Vance"
              className="w-7 h-7 rounded-full object-cover"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-[var(--accent-cyan)] rounded-full ring-2 ring-[var(--bg-page)]" />
          </button>
        </div>
      </div>
    </header>
  );
};
