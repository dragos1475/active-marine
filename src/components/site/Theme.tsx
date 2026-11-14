import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type SiteTheme = "light" | "medium" | "dark";
export const THEME_STORAGE_KEY = "am-site-theme";
export function isSiteTheme(value: unknown): value is SiteTheme {
  return value === "light" || value === "medium" || value === "dark";
}

const ThemeContext = createContext<{ theme: SiteTheme; setTheme: (theme: SiteTheme) => void }>({ theme: "light", setTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, updateTheme] = useState<SiteTheme>("light");
  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (isSiteTheme(stored)) updateTheme(stored);
    } catch { /* Light remains available if storage is blocked. */ }
  }, []);
  useEffect(() => {
    document.documentElement.dataset['theme'] = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  const setTheme = (next: SiteTheme) => {
    updateTheme(next);
    try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch { /* The current page still changes theme. */ }
  };
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useSiteTheme() { return useContext(ThemeContext); }