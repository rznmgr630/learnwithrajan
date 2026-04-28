"use client";

import { createContext, useContext, useLayoutEffect, useState } from "react";

type Theme = "dark" | "light";

const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

function applyThemeToDocument(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useLayoutEffect(() => {
    try {
      const stored = localStorage.getItem("theme") as Theme | null;
      const resolved: Theme = stored === "dark" ? "dark" : "light";
      applyThemeToDocument(resolved);
      setTheme(resolved);
    } catch {
      applyThemeToDocument("light");
    }
  }, []);

  function toggle() {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      applyThemeToDocument(next);
      return next;
    });
  }

  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  return useContext(ThemeCtx);
}
