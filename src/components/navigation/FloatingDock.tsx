import React, { useState } from 'react';
import { ActiveNode } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface FloatingDockProps {
  onNavigate: (node: ActiveNode) => void;
  onOpenTerminalModal?: () => void;
  onOpenChatModal?: () => void;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  onNavigate,
  onOpenTerminalModal: _onOpenTerminalModal,
  onOpenChatModal,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const {
    theme,
    fontStyle,
    backgroundStyle,
    toggleTheme,
    toggleFont,
    toggleBackground,
  } = useTheme();

  const themeNames: Record<string, { label: string; short: string; icon: string }> = {
    studio: { label: 'Studio Slate', short: 'Slate', icon: 'palette' },
    champagne: { label: 'Champagne & Cashmere', short: 'Cashmere', icon: 'hotel_class' },
    light: { label: 'Daylight Paper', short: 'Daylight', icon: 'light_mode' },
    amber: { label: 'Warm Amber', short: 'Amber', icon: 'wb_sunny' },
    forest: { label: 'Nordic Emerald', short: 'Emerald', icon: 'forest' },
    amethyst: { label: 'Royal Amethyst', short: 'Amethyst', icon: 'auto_awesome' },
    abyss: { label: 'Pacific Abyss', short: 'Abyss', icon: 'water_drop' },
    midnight: { label: 'Midnight Obsidian', short: 'Midnight', icon: 'dark_mode' },
  };

  const currentThemeInfo = themeNames[theme] || themeNames.studio;

  const fontNames: Record<string, { label: string; short: string }> = {
    friendly: { label: 'Friendly (Outfit)', short: 'Friendly' },
    modern: { label: 'Modern (Jakarta)', short: 'Modern' },
    reading: { label: 'Reading (DM Sans)', short: 'Reading' },
    editorial: { label: 'Editorial (Cormorant)', short: 'Editorial' },
  };

  const currentFontInfo = fontNames[fontStyle] || fontNames.friendly;

  const bgNames: Record<string, { label: string; short: string; icon: string }> = {
    constellation: { label: 'Cosmic Constellation Canvas', short: 'Constellation', icon: 'grain' },
    ambient: { label: 'Atmospheric Aurora Glow', short: 'Aurora', icon: 'blur_on' },
    mesh: { label: 'Architectural Blueprint Grid', short: 'Grid', icon: 'grid_4x4' },
    minimal: { label: 'Velvet Minimal Matte', short: 'Matte', icon: 'check_box_outline_blank' },
  };

  const currentBgInfo = bgNames[backgroundStyle] || bgNames.constellation;

  const dockItems = [
    {
      id: 'ai_chat',
      label: 'AI Assistant (Ask about my work)',
      shortLabel: 'AI Chat',
      icon: 'voice_chat',
      action: onOpenChatModal,
      isExternal: false,
      isSpecial: true,
    },
    {
      id: 'theme_toggle',
      label: `Switch Theme (Active: ${currentThemeInfo.label} — Press 'T')`,
      shortLabel: currentThemeInfo.short,
      icon: currentThemeInfo.icon,
      action: toggleTheme,
      isExternal: false,
      isTheme: true,
    },
    {
      id: 'font_toggle',
      label: `Switch Font Style (Active: ${currentFontInfo.label} — Press 'F')`,
      shortLabel: currentFontInfo.short,
      icon: 'font_download',
      action: toggleFont,
      isExternal: false,
      isFont: true,
    },
    {
      id: 'canvas_toggle',
      label: `Switch Canvas (Active: ${currentBgInfo.label} — Press 'B')`,
      shortLabel: currentBgInfo.short,
      icon: currentBgInfo.icon,
      action: toggleBackground,
      isExternal: false,
      isCanvas: true,
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
        className="pointer-events-auto flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-[var(--bg-surface)]/92 backdrop-blur-2xl rounded-full border border-[var(--border-subtle)] shadow-[0_12px_36px_rgba(0,0,0,0.35)] transition-all duration-300 max-w-[calc(100vw-24px)] overflow-x-auto"
      >
        {dockItems.map((item, idx) => {
          const isHovered = hoveredIndex === idx;

          const content = (
            <div
              className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer min-h-[38px] shrink-0 ${
                item.accent
                  ? 'text-[var(--accent-violet)] bg-[var(--accent-violet)]/15 hover:bg-[var(--accent-violet)]/25 border border-[var(--accent-violet)]/40 shadow-sm'
                  : item.isSpecial
                  ? 'text-[var(--accent-cyan)] bg-[var(--accent-cyan)]/15 hover:bg-[var(--accent-cyan)]/25 border border-[var(--accent-cyan)]/50 shadow-sm'
                  : item.isTheme
                  ? 'text-[var(--accent-amber)] bg-[var(--accent-amber)]/12 hover:bg-[var(--accent-amber)]/22 border border-[var(--accent-amber)]/35 shadow-sm'
                  : item.isFont
                  ? 'text-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10 hover:bg-[var(--accent-cyan)]/20 border border-[var(--accent-cyan)]/30 shadow-sm'
                  : item.isCanvas
                  ? 'text-[var(--accent-violet)] bg-[var(--accent-violet)]/10 hover:bg-[var(--accent-violet)]/20 border border-[var(--accent-violet)]/30 shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {item.icon}
              </span>
              <span className="font-body text-xs font-semibold tracking-normal hidden sm:inline">
                {item.shortLabel}
              </span>

              {/* Tooltip on Hover / Focus */}
              {isHovered && (
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] text-[var(--text-primary)] font-body text-[11px] font-medium whitespace-nowrap shadow-lg pointer-events-none z-50">
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
              className="transition-transform duration-150 inline-block focus:outline-none hover:scale-105 active:scale-95 cursor-pointer"
            >
              {content}
            </button>
          );
        })}
      </nav>
    </footer>
  );
};
