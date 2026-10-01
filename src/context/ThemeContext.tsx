import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type PortfolioTheme =
  | 'studio'      // Studio Slate (Refined Dark Slate & Cyan)
  | 'light'       // Daylight Paper (Clean Daylight White & Slate Blue)
  | 'champagne'   // Champagne & Cashmere (Ultra-luxury Warm Ivory, Bronze & Espresso)
  | 'amber'       // Warm Amber & Sand (Cozy Sunset Bronze & Gold)
  | 'forest'      // Nordic Emerald (Calm Deep Pine, Jade & Teal)
  | 'amethyst'    // Royal Amethyst (Velvet Plum, Rose Gold & Violet)
  | 'abyss'       // Pacific Abyss (Deep Oceanic Navy & Bioluminescent Cyan)
  | 'midnight';   // Midnight Obsidian (Deep Cosmic Carbon & Electric Neon)

export type FontStyle = 'friendly' | 'modern' | 'reading' | 'editorial';
export type BackgroundStyle = 'constellation' | 'ambient' | 'mesh' | 'minimal';

export interface ThemeMeta {
  id: PortfolioTheme;
  label: string;
  short: string;
  tag: string;
  icon: string;
  desc: string;
  isLight: boolean;
  accentColor: string;
  previewBg: string;
}

export const THEME_LIST: ThemeMeta[] = [
  {
    id: 'studio',
    label: 'Studio Slate',
    short: 'Slate',
    tag: 'RECOMMENDED',
    icon: 'palette',
    desc: 'Warm ergonomic dark slate with cyan & violet ambient glow',
    isLight: false,
    accentColor: '#38BDF8',
    previewBg: '#0C1017',
  },
  {
    id: 'champagne',
    label: 'Champagne & Cashmere',
    short: 'Cashmere',
    tag: 'ULTRA LUXURY',
    icon: 'hotel_class',
    desc: 'Bespoke warm ivory, polished bronze, espresso typography & gold warmth',
    isLight: true,
    accentColor: '#B45309',
    previewBg: '#FDFBF7',
  },
  {
    id: 'light',
    label: 'Daylight Paper',
    short: 'Daylight',
    tag: 'CLEAN LIGHT',
    icon: 'light_mode',
    desc: 'Clean daylight white for sunny environments & reading clarity',
    isLight: true,
    accentColor: '#0284C7',
    previewBg: '#F8FAFC',
  },
  {
    id: 'amber',
    label: 'Warm Amber & Sand',
    short: 'Amber',
    tag: 'COZY WARMTH',
    icon: 'wb_sunny',
    desc: 'Comforting bronze & golden sunset palette with honey amber radiance',
    isLight: false,
    accentColor: '#F59E0B',
    previewBg: '#14110E',
  },
  {
    id: 'forest',
    label: 'Nordic Emerald',
    short: 'Emerald',
    tag: 'CALM & MINT',
    icon: 'forest',
    desc: 'Serene deep pine & sage greens with gentle teal luminance',
    isLight: false,
    accentColor: '#10B981',
    previewBg: '#091411',
  },
  {
    id: 'amethyst',
    label: 'Royal Amethyst',
    short: 'Amethyst',
    tag: 'ROYAL VELVET',
    icon: 'auto_awesome',
    desc: 'Deep royal plum obsidian, rose quartz & luminous lilac sheen',
    isLight: false,
    accentColor: '#C678DD',
    previewBg: '#0E0914',
  },
  {
    id: 'abyss',
    label: 'Pacific Abyss',
    short: 'Abyss',
    tag: 'DEEP OCEAN',
    icon: 'water_drop',
    desc: 'Subsea oceanic midnight with bioluminescent electric teal & foam white',
    isLight: false,
    accentColor: '#06B6D4',
    previewBg: '#050F17',
  },
  {
    id: 'midnight',
    label: 'Midnight Obsidian',
    short: 'Midnight',
    tag: 'DEEP SPACE',
    icon: 'dark_mode',
    desc: 'Pure deep cosmic space with titanium surfaces & neon laser accents',
    isLight: false,
    accentColor: '#00D4FF',
    previewBg: '#06090F',
  },
];

interface ThemeContextType {
  theme: PortfolioTheme;
  fontStyle: FontStyle;
  backgroundStyle: BackgroundStyle;
  toastMessage: string | null;
  setTheme: (theme: PortfolioTheme) => void;
  setFontStyle: (font: FontStyle) => void;
  setBackgroundStyle: (bg: BackgroundStyle) => void;
  toggleTheme: () => void;
  toggleFont: () => void;
  toggleBackground: () => void;
  showToast: (msg: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'studio',
  fontStyle: 'friendly',
  backgroundStyle: 'constellation',
  toastMessage: null,
  setTheme: () => {},
  setFontStyle: () => {},
  setBackgroundStyle: () => {},
  toggleTheme: () => {},
  toggleFont: () => {},
  toggleBackground: () => {},
  showToast: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Theme initialization
  const [theme, setThemeState] = useState<PortfolioTheme>(() => {
    try {
      const saved = localStorage.getItem('genesis_portfolio_theme') as PortfolioTheme;
      if (saved && THEME_LIST.some((t) => t.id === saved)) {
        return saved;
      }
    } catch {}
    return 'studio';
  });

  // Font style initialization (Friendly Outfit by default)
  const [fontStyle, setFontStyleState] = useState<FontStyle>(() => {
    try {
      const saved = localStorage.getItem('genesis_portfolio_font') as FontStyle;
      if (saved && ['friendly', 'modern', 'reading', 'editorial'].includes(saved)) {
        return saved;
      }
    } catch {}
    return 'friendly';
  });

  // Background style initialization (Cosmic Constellation Canvas by default for premium feel)
  const [backgroundStyle, setBackgroundStyleState] = useState<BackgroundStyle>(() => {
    try {
      const saved = localStorage.getItem('genesis_portfolio_bg') as BackgroundStyle;
      if (saved && ['constellation', 'ambient', 'mesh', 'minimal'].includes(saved)) {
        return saved;
      }
    } catch {}
    return 'constellation';
  });

  const applyThemeAttributes = (t: PortfolioTheme) => {
    document.documentElement.setAttribute('data-theme', t);
    const meta = THEME_LIST.find((item) => item.id === t);
    if (meta?.isLight) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  };

  const setTheme = (next: PortfolioTheme) => {
    setThemeState(next);
    try {
      localStorage.setItem('genesis_portfolio_theme', next);
    } catch {}
    applyThemeAttributes(next);
    const meta = THEME_LIST.find((m) => m.id === next);
    if (meta) {
      showToast(`Theme: ${meta.label}`);
    }
  };

  const setFontStyle = (next: FontStyle) => {
    setFontStyleState(next);
    try {
      localStorage.setItem('genesis_portfolio_font', next);
    } catch {}
    document.documentElement.setAttribute('data-font', next);
    const fontNames: Record<FontStyle, string> = {
      friendly: 'Friendly & Warm (Outfit)',
      modern: 'Clean & Modern (Jakarta)',
      reading: 'Comfort Reading (DM Sans)',
      editorial: 'Luxury Editorial (Cormorant)',
    };
    showToast(`Font: ${fontNames[next]}`);
  };

  const setBackgroundStyle = (next: BackgroundStyle) => {
    setBackgroundStyleState(next);
    try {
      localStorage.setItem('genesis_portfolio_bg', next);
    } catch {}
    document.documentElement.setAttribute('data-bg', next);
    const bgNames: Record<BackgroundStyle, string> = {
      constellation: 'Cosmic Constellation Canvas (Interactive)',
      ambient: 'Atmospheric Aurora Glow',
      mesh: 'Architectural Blueprint Grid',
      minimal: 'Velvet Minimal Matte',
    };
    showToast(`Canvas: ${bgNames[next]}`);
  };

  const toggleTheme = () => {
    const sequence: PortfolioTheme[] = THEME_LIST.map((t) => t.id);
    const currentIndex = sequence.indexOf(theme);
    const nextTheme = sequence[(currentIndex + 1) % sequence.length];
    setTheme(nextTheme);
  };

  const toggleFont = () => {
    const sequence: FontStyle[] = ['friendly', 'modern', 'reading', 'editorial'];
    const currentIndex = sequence.indexOf(fontStyle);
    const nextFont = sequence[(currentIndex + 1) % sequence.length];
    setFontStyle(nextFont);
  };

  const toggleBackground = () => {
    const sequence: BackgroundStyle[] = ['constellation', 'ambient', 'mesh', 'minimal'];
    const currentIndex = sequence.indexOf(backgroundStyle);
    const nextBg = sequence[(currentIndex + 1) % sequence.length];
    setBackgroundStyle(nextBg);
  };

  // Keyboard accessibility shortcuts (T = theme, F = font, B = canvas)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input, textarea, or contentEditable
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 't' || e.key === 'T') {
        if (!e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          toggleTheme();
        }
      } else if (e.key === 'f' || e.key === 'F') {
        if (!e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          toggleFont();
        }
      } else if (e.key === 'b' || e.key === 'B') {
        if (!e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          toggleBackground();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme, fontStyle, backgroundStyle]);

  useEffect(() => {
    applyThemeAttributes(theme);
    document.documentElement.setAttribute('data-font', fontStyle);
    document.documentElement.setAttribute('data-bg', backgroundStyle);
  }, [theme, fontStyle, backgroundStyle]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        fontStyle,
        backgroundStyle,
        toastMessage,
        setTheme,
        setFontStyle,
        setBackgroundStyle,
        toggleTheme,
        toggleFont,
        toggleBackground,
        showToast,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
