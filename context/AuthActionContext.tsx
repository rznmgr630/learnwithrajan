"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type AuthActionContextValue = {
  requestAuthentication: () => void;
};

type AuthPrompt = {
  returnTo: string;
};

const AuthActionContext = createContext<AuthActionContextValue | undefined>(undefined);

export function AuthActionProvider({ children }: { children: ReactNode }) {
  const [prompt, setPrompt] = useState<AuthPrompt | null>(null);

  const requestAuthentication = useCallback(() => {
    const returnTo = `${window.location.pathname}${window.location.search}`;
    setPrompt({ returnTo });
  }, []);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setPrompt(null);
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  const loginHref = prompt ? `/login?next=${encodeURIComponent(prompt.returnTo)}` : "/login";
  const registerHref = prompt ? `/register?next=${encodeURIComponent(prompt.returnTo)}` : "/register";

  return (
    <AuthActionContext.Provider value={{ requestAuthentication }}>
      {children}
      {prompt && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4" role="dialog" aria-modal="true" aria-labelledby="save-progress-title">
          <button type="button" aria-label="Close sign-in prompt" onClick={() => setPrompt(null)} className="absolute inset-0 cursor-default" />
          <section className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
            <h2 id="save-progress-title" className="text-xl font-semibold text-[var(--text)]">Save your progress</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Log in or create an account to pin content and mark lessons as completed.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={loginHref} onClick={() => setPrompt(null)} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-fg)] transition hover:brightness-110">Log in</Link>
              <Link href={registerHref} onClick={() => setPrompt(null)} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--elevated)]">Create account</Link>
            </div>
          </section>
        </div>
      )}
    </AuthActionContext.Provider>
  );
}

export function useAuthAction() {
  const context = useContext(AuthActionContext);
  if (!context) throw new Error("useAuthAction must be used within an AuthActionProvider");
  return context;
}
