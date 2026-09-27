import React, { useState, useRef, useEffect } from 'react';
import { useTheme, PortfolioTheme, FontStyle, BackgroundStyle } from '../../context/ThemeContext';

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

  const themes: {
    id: PortfolioTheme;
    label: string;
    tag: string;
    icon: string;
    desc: string;
    colorPreview: string;
  }[] = [
    {
      id: 'studio',
      label: 'Studio Slate',
      tag: 'RECOMMENDED',
      icon: 'palette',
      desc: 'Warm ergonomic dark slate with soft ambient lighting',
      colorPreview: 'bg-[#131A26] border-[#38BDF8]',
    },
    {
      id: 'light',
      label: 'Daylight Paper',
      tag: 'WARM LIGHT',
      icon: 'light_mode',
      desc: 'Clean, warm daylight mode for sunny environments & easy reading',
      colorPreview: 'bg-[#FFFFFF] border-[#0284C7]',
    },
    {
      id: 'amber',
      label: 'Warm Amber',
      tag: 'COZY WARMTH',
      icon: 'wb_sunny',
      desc: 'Comforting bronze & golden sunset palette with soft amber glow',
      colorPreview: 'bg-[#1E1A16] border-[#F59E0B]',
    },
    {
      id: 'forest',
      label: 'Nordic Emerald',
      tag: 'CALM & MINT',
      icon: 'forest',
      desc: 'Serene dark pine & sage greens with gentle teal radiance',
      colorPreview: 'bg-[#101F1B] border-[#10B981]',
    },
    {
      id: 'midnight',
      label: 'Midnight Obsidian',
      tag: 'HIGH CONTRAST',
      icon: 'dark_mode',
      desc: 'Deep cosmic space with electric neon accents',
      colorPreview: 'bg-[#0C111A] border-[#00D4FF]',
    },
  ];

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
      tag: 'MOST FRIENDLY',
      desc: 'Soft rounded geometry, warm curves, exceptionally inviting & human',
      fontFamily: "'Outfit', sans-serif",
    },
    {
      id: 'modern',
      label: 'Clean & Modern',
      sample: 'Plus Jakarta Sans',
      tag: 'CONTEMPORARY',
      desc: 'Balanced, crisp studio grotesque designed for digital clarity',
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
  ];

  const bgOptions: {
    id: BackgroundStyle;
    label: string;
    icon: string;
    desc: string;
  }[] = [
    {
      id: 'ambient',
      label: 'Ambient Glow',
      icon: 'blur_on',
      desc: 'Soft atmospheric multi-color light auras that flow gently behind content',
    },
    {
      id: 'mesh',
      label: 'Subtle Grid Mesh',
      icon: 'grid_4x4',
      desc: 'Fine architectural blueprint grid for an engineering aesthetic',
    },
    {
      id: 'minimal',
      label: 'Clean Minimal',
      icon: 'check_box_outline_blank',
      desc: 'Distraction-free pure backdrop with smooth subtle vignette',
    },
  ];

  const currentTheme = themes.find((t) => t.id === theme) || themes[0];
  const currentFont = fontOptions.find((f) => f.id === fontStyle) || fontOptions[0];

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-cyan)]/50 text-[var(--text-primary)] font-body text-xs font-medium transition-all active:scale-95 cursor-pointer shadow-sm group"
        title="Customize Theme, Friendly Font, and Background"
      >
        <span className="material-symbols-outlined text-[17px] text-[var(--accent-cyan)] group-hover:rotate-45 transition-transform duration-300">
          palette
        </span>
        {!compact && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium">
            <span className="text-[var(--text-primary)] font-semibold">{currentTheme.label}</span>
            <span className="text-[var(--border-strong)]">·</span>
            <span className="text-[var(--accent-cyan)] text-[11px]">{currentFont.sample.split(' ')[0]}</span>
          </div>
        )}
        <span className="material-symbols-outlined text-[14px] text-[var(--text-muted)]">
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {/* Dropdown Customizer Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-strong)] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.45)] z-50 animate-fadeIn backdrop-blur-2xl">
          {/* Header & Tabs */}
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[var(--accent-cyan)]">
                tune
              </span>
              <span className="text-xs font-display font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Display &amp; Style
              </span>
            </div>
            <div className="flex bg-[var(--bg-surface-elevated)] p-0.5 rounded-lg border border-[var(--border-subtle)]">
              <button
                onClick={() => setActiveTab('theme')}
                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                  activeTab === 'theme'
                    ? 'bg-[var(--accent-cyan)] text-[var(--bg-page)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Theme
              </button>
              <button
                onClick={() => setActiveTab('font')}
                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                  activeTab === 'font'
                    ? 'bg-[var(--accent-cyan)] text-[var(--bg-page)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Font Style
              </button>
              <button
                onClick={() => setActiveTab('bg')}
                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                  activeTab === 'bg'
                    ? 'bg-[var(--accent-cyan)] text-[var(--bg-page)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Background
              </button>
            </div>
          </div>

          {/* Tab 1: Themes */}
          {activeTab === 'theme' && (
            <div className="flex flex-col gap-1.5">
              <div className="text-[11px] text-[var(--text-muted)] px-1 mb-0.5">
                Choose a color palette tailored for reading comfort:
              </div>
              {themes.map((t) => {
                const active = t.id === theme;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer ${
                      active
                        ? 'bg-[var(--accent-cyan)]/15 text-[var(--text-primary)] border border-[var(--accent-cyan)]/50 shadow-sm'
                        : 'hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-transparent'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[19px] mt-0.5 ${
                        active ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {t.icon}
                    </span>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-[var(--text-primary)]">
                          {t.label}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] font-mono border border-[var(--border-subtle)]">
                            {t.tag}
                          </span>
                          {active && (
                            <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">
                        {t.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Tab 2: Font Styles (User-Friendly) */}
          {activeTab === 'font' && (
            <div className="flex flex-col gap-2">
              <div className="text-[11px] text-[var(--text-muted)] px-1 mb-0.5">
                Select a user-friendly typeface style for headers &amp; body:
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
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] font-mono font-bold">
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

          {/* Tab 3: Background Styles */}
          {activeTab === 'bg' && (
            <div className="flex flex-col gap-1.5">
              <div className="text-[11px] text-[var(--text-muted)] px-1 mb-0.5">
                Adjust background lighting and atmospheric mood:
              </div>
              {bgOptions.map((b) => {
                const active = b.id === backgroundStyle;
                return (
                  <button
                    key={b.id}
                    onClick={() => setBackgroundStyle(b.id)}
                    className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer ${
                      active
                        ? 'bg-[var(--accent-cyan)]/15 text-[var(--text-primary)] border border-[var(--accent-cyan)]/50 shadow-sm'
                        : 'hover:bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-transparent'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[19px] mt-0.5 ${
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
                        {active && (
                          <span className="material-symbols-outlined text-[16px] text-[var(--accent-cyan)]">
                            check_circle
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        {b.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Footer note */}
          <div className="mt-2.5 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] text-[var(--text-muted)] px-1">
            <span>Preferences saved locally</span>
            <button
              onClick={() => {
                setTheme('studio');
                setFontStyle('friendly');
                setBackgroundStyle('ambient');
              }}
              className="text-[var(--accent-cyan)] hover:underline cursor-pointer"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
