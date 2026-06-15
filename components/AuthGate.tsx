"use client";

import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { TodoPage } from "@/components/TodoPage";

type Mode = "signin" | "signup";

export function AuthGate() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) { setChecking(false); return; }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setError("");
    setInfo("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name.trim() } },
        });
        if (error) {
          setError(error.message);
        } else if (data.user && !data.session) {
          // Email confirmation required
          setInfo("Check your email and click the confirmation link, then sign in.");
          setMode("signin");
          setName("");
          setPassword("");
        } else {
          // Auto-confirmed (email confirmation disabled in Supabase)
          setInfo("Account created! Signing you in…");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Check your connection and try again.");
    }

    setLoading(false);
  }

  // No supabase configured → skip auth entirely
  if (!supabase) {
    return <TodoPage userId="local" userName="You" onSignOut={undefined} />;
  }

  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <svg className="h-6 w-6 animate-spin text-[var(--accent)]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  if (user) {
    const userName = (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "You";
    return <TodoPage userId={user.id} userName={userName} onSignOut={signOut} />;
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-8 py-10 shadow-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color-mix(in_oklab,var(--accent)_12%,var(--surface))] text-[var(--accent)]">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </span>
            <h1 className="mt-4 text-xl font-semibold text-[var(--text)]">Daily Planner</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {mode === "signup" ? "Create your account" : "Sign in to your planner"}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="mb-6 flex rounded-xl border border-[var(--border)] bg-[var(--elevated)] p-1">
            {(["signin", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); setInfo(""); }}
                className={[
                  "flex-1 rounded-lg py-2 text-sm font-medium transition",
                  mode === m
                    ? "bg-[var(--surface)] text-[var(--text)] shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--text)]",
                ].join(" ")}
              >
                {m === "signin" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          {/* Info / Error */}
          {info && (
            <div className="mb-4 rounded-xl border border-[color-mix(in_oklab,var(--accent)_30%,var(--border))] bg-[color-mix(in_oklab,var(--accent)_8%,var(--surface))] px-4 py-3 text-sm text-[var(--accent)]">
              {info}
            </div>
          )}
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-500">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <Field
                label="Full name"
                type="text"
                value={name}
                onChange={setName}
                placeholder="Rajan Magar"
                required
                autoComplete="name"
              />
            )}
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              required
              autoComplete={mode === "signup" ? "email" : "username"}
            />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              required
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--accent-fg)] transition hover:opacity-90 disabled:opacity-60"
            >
              {loading && (
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}
              {mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--elevated)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--faint)] focus:border-[var(--accent)] focus:outline-none transition"
      />
    </div>
  );
}
