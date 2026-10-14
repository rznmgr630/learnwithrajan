"use client";

import type { ReactNode } from "react";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { FocusTimerProvider } from "@/components/focus/FocusTimerProvider";
import { AuthActionProvider } from "@/context/AuthActionContext";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider><AuthActionProvider><LocaleProvider><FocusTimerProvider>{children}</FocusTimerProvider></LocaleProvider></AuthActionProvider></AuthProvider>
    </ThemeProvider>
  );
}
