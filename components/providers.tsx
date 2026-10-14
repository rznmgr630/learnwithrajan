"use client";

import type { ReactNode } from "react";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { FocusTimerProvider } from "@/components/focus/FocusTimerProvider";
import { AuthActionProvider } from "@/context/AuthActionContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider><ToastProvider><AuthActionProvider><LocaleProvider><FocusTimerProvider>{children}</FocusTimerProvider></LocaleProvider></AuthActionProvider></ToastProvider></AuthProvider>
    </ThemeProvider>
  );
}
