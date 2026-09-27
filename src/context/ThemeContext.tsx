import React, { createContext, useContext, useState, useEffect } from 'react';

export type PortfolioTheme = 'studio' | 'light' | 'amber' | 'forest' | 'midnight';
export type FontStyle = 'friendly' | 'modern' | 'reading';
export type BackgroundStyle = 'ambient' | 'mesh' | 'minimal';

interface ThemeContextType {
  theme: PortfolioTheme;
  fontStyle: FontStyle;
  backgroundStyle: BackgroundStyle;
  setTheme: (theme: PortfolioTheme) => void;
  setFontStyle: (font: FontStyle) => void;
  setBackgroundStyle: (bg: BackgroundStyle) => void;
  toggleTheme: () => void;
  toggleFont: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'studio',
  fontStyle: 'friendly',
  backgroundStyle: 'ambient',
  setTheme: () => {},
  setFontStyle: () => {},
  setBackgroundStyle: () => {},
  toggleTheme: () => {},
  toggleFont: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme initialization
  const [theme, setThemeState] = useState<PortfolioTheme>(() => {
    try {
      const saved = localStorage.getItem('genesis_portfolio_theme') as PortfolioTheme;
      if (saved && ['studio', 'light', 'amber', 'forest', 'midnight'].includes(saved)) {
        return saved;
      }
    } catch {}
    return 'studio';
  });

  // Font style initialization (Friendly Outfit by default)
  const [fontStyle, setFontStyleState] = useState<FontStyle>(() => {
    try {
      const saved = localStorage.getItem('genesis_portfolio_font') as FontStyle;
      if (saved && ['friendly', 'modern', 'reading'].includes(saved)) {
        return saved;
      }
    } catch {}
    return 'friendly';
  });

  // Background style initialization (Warm ambient glow by default)
  const [backgroundStyle, setBackgroundStyleState] = useState<BackgroundStyle>(() => {
    try {
      const saved = localStorage.getItem('genesis_portfolio_bg') as BackgroundStyle;
      if (saved && ['ambient', 'mesh', 'minimal'].includes(saved)) {
        return saved;
      }
    } catch {}
    return 'ambient';
  });

  const setTheme = (next: PortfolioTheme) => {
    setThemeState(next);
    try {
      localStorage.setItem('genesis_portfolio_theme', next);
    } catch {}
    applyThemeAttributes(next);
  };

  const setFontStyle = (next: FontStyle) => {
    setFontStyleState(next);
    try {
      localStorage.setItem('genesis_portfolio_font', next);
    } catch {}
    document.documentElement.setAttribute('data-font', next);
  };

  const setBackgroundStyle = (next: BackgroundStyle) => {
    setBackgroundStyleState(next);
    try {
      localStorage.setItem('genesis_portfolio_bg', next);
    } catch {}
    document.documentElement.setAttribute('data-bg', next);
  };

  const toggleTheme = () => {
    const sequence: PortfolioTheme[] = ['studio', 'light', 'amber', 'forest', 'midnight'];
    const currentIndex = sequence.indexOf(theme);
    const nextTheme = sequence[(currentIndex + 1) % sequence.length];
    setTheme(nextTheme);
  };

  const toggleFont = () => {
    const sequence: FontStyle[] = ['friendly', 'modern', 'reading'];
    const currentIndex = sequence.indexOf(fontStyle);
    const nextFont = sequence[(currentIndex + 1) % sequence.length];
    setFontStyle(nextFont);
  };

  const applyThemeAttributes = (t: PortfolioTheme) => {
    document.documentElement.setAttribute('data-theme', t);
    if (t === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

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
        setTheme,
        setFontStyle,
        setBackgroundStyle,
        toggleTheme,
        toggleFont,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
