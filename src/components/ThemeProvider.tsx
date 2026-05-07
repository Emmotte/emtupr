import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';
type Style = 'vulfpeck' | 'classic';

interface ThemeProviderProps {
  children: React.ReactNode;
}

interface ThemeProviderState {
  theme: Theme;
  style: Style;
  toggleTheme: () => void;
  setStyle: (style: Style) => void;
}

const initialState: ThemeProviderState = {
  theme: 'dark',
  style: 'vulfpeck',
  toggleTheme: () => null,
  setStyle: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('ui-theme') as Theme;
    return saved || 'dark';
  });

  const [style, setStyleState] = useState<Style>(() => {
    const saved = localStorage.getItem('style-preference') as Style;
    return saved || 'vulfpeck';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('ui-theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('style-vulfpeck', 'style-classic');
    root.classList.add(`style-${style}`);
    localStorage.setItem('style-preference', style);
  }, [style]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setStyle = (newStyle: Style) => {
    setStyleState(newStyle);
  };

  return (
    <ThemeProviderContext.Provider value={{ theme, style, toggleTheme, setStyle }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeProviderContext);
