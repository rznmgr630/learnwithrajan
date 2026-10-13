"use client";

import type { ReactNode } from "react";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { FocusTimerProvider } from "@/components/focus/FocusTimerProvider";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider><LocaleProvider><FocusTimerProvider>{children}</FocusTimerProvider></LocaleProvider></AuthProvider>
    </ThemeProvider>
  );
}
