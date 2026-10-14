"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

type AuthRequiredLinkProps = {
  href: string;
  className: string;
  children: ReactNode;
};

export function AuthRequiredLink({ href, className, children }: AuthRequiredLinkProps) {
  const { user, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const loginHref = `/login?next=${encodeURIComponent(href)}`;
  const registerHref = `/register?next=${encodeURIComponent(href)}`;

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  if (user) {
    return <Link href={href} className={className}>{children}</Link>;
  }

  return (
    <>
      <div
        role="link"
        tabIndex={isLoading ? -1 : 0}
        onClick={() => !isLoading && setIsOpen(true)}
        onKeyDown={(event) => {
          if (!isLoading && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
        className={`${className} cursor-pointer`}
      >
        {children}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4" role="dialog" aria-modal="true" aria-labelledby="auth-required-title">
          <button type="button" aria-label="Close sign-in prompt" onClick={() => setIsOpen(false)} className="absolute inset-0 cursor-default" />
          <section className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
            <h2 id="auth-required-title" className="text-xl font-semibold text-[var(--text)]">Unlock Code Review Challenges</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Please log in or create an account to view this content.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={loginHref} className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-fg)] transition hover:brightness-110">Log in</Link>
              <Link href={registerHref} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--elevated)]">Create account</Link>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
