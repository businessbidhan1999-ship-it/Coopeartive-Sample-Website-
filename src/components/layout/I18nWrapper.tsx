"use client";
// src/components/layout/I18nWrapper.tsx
// Client-side wrapper that provides i18n context to the entire app.
import { I18nProvider } from "@/lib/i18n-context";

export function I18nWrapper({ children }: { children: React.ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>;
}
