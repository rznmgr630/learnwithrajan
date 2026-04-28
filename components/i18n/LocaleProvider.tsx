"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Locale } from "@/lib/i18n/types";
import { translateUi, translateUiParams, type UiStringKey } from "@/lib/i18n/catalog";
import { htmlLangForLocale } from "@/lib/i18n/pick";
import { readStoredLocale, writeStoredLocale } from "@/lib/i18n/storage";

export type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: UiStringKey) => string;
  tParams: (key: UiStringKey, params: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = readStoredLocale();
    // Hydration: server rendered with default `en`; align with localStorage after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync from localStorage after mount only
    if (stored) setLocaleState(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = htmlLangForLocale(locale);
    writeStoredLocale(locale);
  }, [locale, mounted]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
  }, []);

  const t = useCallback((key: UiStringKey) => translateUi(key, locale), [locale]);

  const tParams = useCallback(
    (key: UiStringKey, params: Record<string, string | number>) => translateUiParams(key, locale, params),
    [locale],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t, tParams }),
    [locale, setLocale, t, tParams],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
