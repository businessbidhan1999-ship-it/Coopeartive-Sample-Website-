"use client";
// src/lib/i18n-context.tsx
// Simple context-based i18n — no external dependency.
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { en } from "./translations/en";
import { ne } from "./translations/ne";
import type { Translations } from "./translations/en";

type Lang = "en" | "ne";
const STORAGE_KEY = "rmcl-lang";

const translations: Record<Lang, Translations> = { en, ne };

interface I18nContextValue {
  t: Translations;
  lang: Lang;
  toggle: () => void;
}

const I18nContext = createContext<I18nContextValue>({
  t: en,
  lang: "en",
  toggle: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "ne" || stored === "en") setLang(stored);
  }, []);

  const toggle = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === "en" ? "ne" : "en";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <I18nContext.Provider value={{ t: translations[lang], lang, toggle }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useLanguage() {
  return useContext(I18nContext);
}
