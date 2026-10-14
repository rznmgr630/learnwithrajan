"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

type ToastContextValue = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const isRemoval = message === "Removed from pinned" || message === "Marked as incomplete";

  const showToast = useCallback((nextMessage: string) => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setMessage(nextMessage);
    timeoutRef.current = window.setTimeout(() => setMessage(null), 3000);
  }, []);

  useEffect(() => () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && <div role="status" aria-live="polite" className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-medium text-[var(--text)] shadow-xl"><span className={`grid h-5 w-5 place-items-center rounded-full ${message.startsWith("Could not") ? "bg-red-500/15 text-red-500" : isRemoval ? "bg-amber-500/15 text-amber-500" : "bg-emerald-500/15 text-emerald-500"}`}><svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{message.startsWith("Could not") ? <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6m0-6-6 6" /></> : isRemoval ? <path d="M5 12h14" /> : <path d="m5 12 4 4L19 6" />}</svg></span>{message}</div>}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}
