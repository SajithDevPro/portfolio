import React, { useState, useRef, useEffect } from 'react';
import {
  useTheme,
  PortfolioTheme,
  FontStyle,
  BackgroundStyle,
  THEME_LIST,
} from '../../context/ThemeContext';

export const ThemeSwitcher: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const {
    theme,
    fontStyle,
    backgroundStyle,
    setTheme,
    setFontStyle,
    setBackgroundStyle,
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'theme' | 'font' | 'bg'>('theme');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fontOptions: {
    id: FontStyle;
    label: string;
    sample: string;
    tag: string;
    desc: string;
    fontFamily: string;
  }[] = [
    {
      id: 'friendly',
      label: 'Friendly & Warm',
      sample: 'Outfit + DM Sans',
      tag: 'DEFAULT & INVITING',
      desc: 'Soft rounded geometry, human apertures, exceptionally approachable',
      fontFamily: "'Outfit', sans-serif",
    },
    {
      id: 'modern',
      label: 'Clean & Modern',
      sample: 'Plus Jakarta Sans',
      tag: 'PRECISION TECH',
      desc: 'Balanced studio grotesque designed for executive clarity & speed',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    },
    {
      id: 'reading',
      label: 'Comfort Reading',
      sample: 'DM Sans',
      tag: 'EASY ON EYES',
      desc: 'Generous x-height & wide open apertures for effortless skimming',
      fontFamily: "'DM Sans', sans-serif",
    },
    {
      id: 'editorial',
      label: 'Luxury Editorial Serif',
      sample: 'Cormorant Garamond',
      tag: 'HIGH-END LUXURY',
      desc: 'Refined classical serif headlines paired with modern body prose',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
    },
  ];

  const bgOptions: {
    id: BackgroundStyle;
    label: string;
    tag: string;
    icon: string;
    desc: string;
  }[] = [
    {
      id: 'constellation',
      label: 'Cosmic Constellation Canvas',
      tag: 'INTERACTIVE 60FPS',
      icon: 'grain',
      desc: 'Floating stars and neural physics nodes that connect and respond to cursor movement',
    },
    {
      id: 'ambient',
      label: 'Atmospheric Aurora Glow',
      tag: 'FLUID CHROMATIC',
      icon: 'blur_on',
      desc: 'Silky multi-layer flowing chromatic auroras with floating bokeh dust motes',
    },
    {
      id: 'mesh',
      label: 'Architectural Blueprint Grid',
      tag: 'ENGINEERING',
      icon: 'grid_4x4',
      desc: 'Fine precision laser coordinate grid with a soft scanning beam',
    },
    {
      id: 'minimal',
      label: 'Velvet Minimal Matte',
      tag: 'DISTRACTION-FREE',
      icon: 'check_box_outline_blank',
      desc: 'Clean, deep matte luxury backdrop with subtle corner lighting caustics',
    },
  ];

  const currentTheme = THEME_LIST.find((t) => t.id === theme) || THEME_LIST[0];
  const currentFont = fontOptions.find((f) => f.id === fontStyle) || fontOptions[0];

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-cyan)]/50 text-[var(--text-primary)] font-body text-xs font-medium transition-all active:scale-95 cursor-pointer shadow-sm group"
        title="Customize Theme, Typography, and Background Canvas (Press T for Theme, F for Font, B for Canvas)"
      >
        <span
          className="w-2.5 h-2.5 rounded-full ring-2 ring-[var(--border-subtle)] group-hover:scale-110 transition-transform"
          style={{ backgroundColor: currentTheme.accentColor }}
        />
        {!compact && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium">
            <span className="text-[var(--text-primary)] font-semibold">{currentTheme.label}</span>
            <span className="text-[var(--border-strong)]">·</span>
            <span className="text-[var(--accent-cyan)] text-[11px]">{currentFont.sample.split(' ')[0]}</span>
          </div>
        )}
        <span className="material-symbols-outlined text-[14px] text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {/* Dropdown Customizer Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-84 sm:w-96 max-h-[85vh] overflow-y-auto rounded-2xl bg-[var(--bg-surface)]/98 border border-[var(--border-strong)] p-3.5 shadow-[0_24px_60px_rgba(0,0,0,0.5)] z-50 animate-fadeIn backdrop-blur-2xl">
          {/* Header & Tabs */}
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5 mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[var(--accent-cyan)]">
                tune
              </span>
              <span className="text-xs font-display font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Display &amp; Aesthetics
              </span>
            </div>
            <div className="flex bg-[var(--bg-surface-elevated)] p-0.5 rounded-lg border border-[var(--border-subtle)]">
              <button
                onClick={() => setActiveTab('theme')}
                className={`px-2.5 py-1 rounded-md text-[10.5px] font-semibold transition-all cursor-pointer ${
                  activeTab === 'theme'
                    ? 'bg-[var(--accent-cyan)] text-[var(--bg-page)] shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Themes ({THEME_LIST.length})
              </button>
              <button
                onClick={() => setActiveTab('font')}
                className={`px-2.5 py-1 rounded-md text-[10.5px] font-semibold transition-all cursor-pointer ${
                  activeTab === 'font'
                    ? 'bg-[var(--accent-cyan)] text-[var(--bg-page)] shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Typography
              </button>
              <button
                onClick={() => setActiveTab('bg')}
                className={`px-2.5 py-1 rounded-md text-[10.5px] font-semibold transition-all cursor-pointer ${
                  activeTab === 'bg'
                    ? 'bg-[var(--accent-cyan)] text-[var(--bg-page)] shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Canvas
              </button>
            </div>
          </div>

          {/* TAB 1: 8 CURATED PREMIUM THEMES */}
          {activeTab === 'theme' && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] px-1 mb-1">
                <span>Select a color palette:</span>
                <span className="text-[10px] font-mono text-[var(--accent-cyan)]">Shortcut: Press 'T'</span>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {THEME_LIST.map((t) => {
                  const active = t.id === theme;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-all cursor-pointer ${
                        active
                          ? 'bg-[var(--accent-cyan)]/15 text-[var(--text-primary)] border border-[var(--accent-cyan)]/50 shadow-sm'
                          : 'hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-transparent'
                      }`}
                    >
                      {/* Theme color swatch preview */}
                      <div
                        className="w-7 h-7 rounded-lg border border-white/20 flex items-center justify-center shrink-0 shadow-xs"
                        style={{ backgroundColor: t.previewBg }}
                      >
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: t.accentColor }}
                        />
                      </div>

                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-semibold text-[var(--text-primary)]">
                            {t.label}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] font-mono border border-[var(--border-subtle)]">
                              {t.tag}
                            </span>
                            {active && (
                              <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
                            )}
                          </div>
                        </div>
                        <span className="text-[10.5px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                          {t.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: 4 USER-FRIENDLY TYPOGRAPHY STYLES */}
          {activeTab === 'font' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] px-1 mb-0.5">
                <span>Select a typeface style:</span>
                <span className="text-[10px] font-mono text-[var(--accent-cyan)]">Shortcut: Press 'F'</span>
              </div>

              {fontOptions.map((f) => {
                const active = f.id === fontStyle;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFontStyle(f.id)}
                    className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                      active
                        ? 'bg-[var(--accent-cyan)]/15 text-[var(--text-primary)] border border-[var(--accent-cyan)]/50 shadow-sm'
                        : 'hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-transparent'
                    }`}
                  >
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className="text-sm font-bold text-[var(--text-primary)]"
                          style={{ fontFamily: f.fontFamily }}
                        >
                          {f.label}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] font-mono font-bold">
                            {f.tag}
                          </span>
                          {active && (
                            <span className="material-symbols-outlined text-[16px] text-[var(--accent-cyan)]">
                              check_circle
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        className="text-xs text-[var(--text-primary)]/90 mt-1 font-medium tracking-normal"
                        style={{ fontFamily: f.fontFamily }}
                      >
                        Sample: "Robotics &amp; AI Systems Engineering for Human Good"
                      </div>
                      <span className="text-[10.5px] text-[var(--text-muted)] mt-1">
                        {f.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* TAB 3: 4 CANVAS ATMOSPHERES */}
          {activeTab === 'bg' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] px-1 mb-0.5">
                <span>Select dynamic canvas mode:</span>
                <span className="text-[10px] font-mono text-[var(--accent-cyan)]">Shortcut: Press 'B'</span>
              </div>

              {bgOptions.map((b) => {
                const active = b.id === backgroundStyle;
                return (
                  <button
                    key={b.id}
                    onClick={() => setBackgroundStyle(b.id)}
                    className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                      active
                        ? 'bg-[var(--accent-cyan)]/15 text-[var(--text-primary)] border border-[var(--accent-cyan)]/50 shadow-sm'
                        : 'hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-transparent'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] mt-0.5 ${
                        active ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {b.icon}
                    </span>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[var(--text-primary)]">
                          {b.label}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] font-mono border border-[var(--border-subtle)]">
                            {b.tag}
                          </span>
                          {active && (
                            <span className="material-symbols-outlined text-[16px] text-[var(--accent-cyan)]">
                              check_circle
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)] mt-1">
                        {b.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Footer controls & Shortcuts helper */}
          <div className="mt-3 pt-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10.5px] text-[var(--text-muted)] px-1">
            <span className="flex items-center gap-1">
              <span className="px-1 py-0.2 rounded bg-[var(--bg-surface-elevated)] font-mono text-[9px] border border-[var(--border-subtle)]">T</span>
              <span>Theme</span>
              <span className="px-1 py-0.2 rounded bg-[var(--bg-surface-elevated)] font-mono text-[9px] border border-[var(--border-subtle)] ml-1">F</span>
              <span>Font</span>
              <span className="px-1 py-0.2 rounded bg-[var(--bg-surface-elevated)] font-mono text-[9px] border border-[var(--border-subtle)] ml-1">B</span>
              <span>Canvas</span>
            </span>
            <button
              onClick={() => {
                setTheme('studio');
                setFontStyle('friendly');
                setBackgroundStyle('constellation');
              }}
              className="text-[var(--accent-cyan)] hover:underline cursor-pointer font-medium"
            >
              Reset Defaults
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
