import React, { useState } from 'react';
import { ActiveNode } from '../../types';

interface FloatingDockProps {
  onNavigate: (node: ActiveNode) => void;
  onOpenTerminalModal?: () => void;
  onOpenChatModal?: () => void;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  onNavigate,
  onOpenTerminalModal,
  onOpenChatModal,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const dockItems = [
    {
      id: 'ai_chat',
      label: 'AI Chatbot (Trained on my work)',
      shortLabel: 'AI Chat',
      icon: 'voice_chat',
      action: onOpenChatModal,
      isExternal: false,
      isSpecial: true,
    },
    {
      id: 'github',
      label: 'GitHub (Open-source repositories)',
      shortLabel: 'GitHub',
      icon: 'code_blocks',
      href: 'https://github.com/elaravance',
      isExternal: true,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn (Professional network)',
      shortLabel: 'LinkedIn',
      icon: 'hub',
      href: 'https://linkedin.com/in/elaravance',
      isExternal: true,
    },
    {
      id: 'contact',
      label: 'Direct Contact Form',
      shortLabel: 'Contact',
      icon: 'mail',
      action: () => onNavigate('contact'),
      isExternal: false,
      accent: true,
    },
  ];

  return (
    <footer className="fixed bottom-3 inset-x-0 z-40 flex justify-center px-4 pointer-events-none pb-safe">
      <nav
        aria-label="Quick Access Dock"
        className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-[#0B0F13]/90 backdrop-blur-2xl rounded-full border border-[#00D4FF]/25 shadow-[0_8px_32px_rgba(0,0,0,0.7)] shadow-[0_0_20px_rgba(0,212,255,0.12)] transition-all duration-300"
      >
        {dockItems.map((item, idx) => {
          const isHovered = hoveredIndex === idx;

          const content = (
            <div
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer min-h-[38px] ${
                item.accent
                  ? 'text-[#FF9F45] bg-[#FF9F45]/15 hover:bg-[#FF9F45]/25 border border-[#FF9F45]/40 shadow-[0_0_12px_rgba(255,159,69,0.3)]'
                  : item.isSpecial
                  ? 'text-[#00D4FF] bg-[#00D4FF]/15 hover:bg-[#00D4FF]/25 border border-[#00D4FF]/50 shadow-[0_0_14px_rgba(0,212,255,0.35)]'
                  : 'text-[#EAF2F5]/85 hover:text-[#00D4FF] hover:bg-[#12161C] border border-[#182028] hover:border-[#00D4FF]/30'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">
                {item.icon}
              </span>
              <span className="font-code text-xs font-medium tracking-wide">
                {item.shortLabel}
              </span>

              {/* Tooltip on Hover / Focus */}
              {isHovered && (
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-[#12161C] border border-[#00D4FF]/40 text-[#EAF2F5] font-code text-[10px] whitespace-nowrap shadow-lg pointer-events-none z-50">
                  {item.label}
                </div>
              )}
            </div>
          );

          if (item.isExternal) {
            return (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                aria-label={item.label}
                className="transition-transform duration-150 inline-block focus:outline-none hover:scale-105 active:scale-95"
              >
                {content}
              </a>
            );
          }

          return (
            <button
              key={item.id}
              onClick={item.action}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              aria-label={item.label}
              className="transition-transform duration-150 inline-block focus:outline-none hover:scale-105 active:scale-95"
            >
              {content}
            </button>
          );
        })}
      </nav>
    </footer>
  );
};
