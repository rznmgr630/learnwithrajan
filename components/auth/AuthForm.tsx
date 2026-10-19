"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, type MouseEvent, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, reload, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { authModeHref, safeReturnPath } from "@/lib/auth-redirect";

type AuthMode = "login" | "register";
const resendCooldownMs = 2 * 60 * 1000;

function resendCooldownKey(email: string) {
  return `email-verification-resend:${email.trim().toLowerCase()}`;
}

function passwordResetCooldownKey(email: string) {
  return `password-reset:${email.trim().toLowerCase()}`;
}

function formatCooldown(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

const authErrors: Record<string, string> = {
  "auth/email-already-in-use": "An account already uses this email address.",
  "auth/invalid-credential": "Your email or password is incorrect.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/weak-password": "Use a password with at least 6 characters.",
};

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const { user, isLoading, refreshAuthState } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [verificationNotice, setVerificationNotice] = useState("");
  const [canResendVerification, setCanResendVerification] = useState(false);
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState(0);
  const [isPasswordResetMode, setIsPasswordResetMode] = useState(false);
  const [passwordResetCooldownSeconds, setPasswordResetCooldownSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLogin = mode === "login";
  const returnPath = () => safeReturnPath(typeof window === "undefined" ? "" : window.location.search);
  const switchAuthMode = (event: MouseEvent<HTMLAnchorElement>) => {
    const next = returnPath();
    if (next === "/learn") return;
    event.preventDefault();
    router.push(authModeHref(isLogin ? "register" : "login", next));
  };

  useEffect(() => {
    if (user && !isLoading && !isSubmitting && !verificationNotice) {
      window.location.replace(returnPath());
    }
  }, [isLoading, isSubmitting, router, user, verificationNotice]);

  useEffect(() => {
    if (!email.trim()) return;

    const key = resendCooldownKey(email);
    const updateCooldown = () => {
      const expiresAt = Number(window.localStorage.getItem(key));
      const seconds = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setResendCooldownSeconds(seconds);
      if (seconds === 0) window.localStorage.removeItem(key);
    };

    const timeout = window.setTimeout(updateCooldown, 0);
    const interval = window.setInterval(updateCooldown, 1000);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [email]);

  useEffect(() => {
    if (!email.trim()) return;

    const key = passwordResetCooldownKey(email);
    const updateCooldown = () => {
      const expiresAt = Number(window.localStorage.getItem(key));
      const seconds = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setPasswordResetCooldownSeconds(seconds);
      if (seconds === 0) window.localStorage.removeItem(key);
    };

    const timeout = window.setTimeout(updateCooldown, 0);
    const interval = window.setInterval(updateCooldown, 1000);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [email]);

  function startResendCooldown(emailAddress: string) {
    window.localStorage.setItem(resendCooldownKey(emailAddress), String(Date.now() + resendCooldownMs));
    setResendCooldownSeconds(resendCooldownMs / 1000);
  }

  function startPasswordResetCooldown(emailAddress: string) {
    window.localStorage.setItem(passwordResetCooldownKey(emailAddress), String(Date.now() + resendCooldownMs));
    setPasswordResetCooldownSeconds(resendCooldownMs / 1000);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setVerificationNotice("");
    setCanResendVerification(false);

    if (!auth) {
      setError("Firebase is not configured yet. Please try again later.");
      return;
    }

    if (!isLogin && password.length < 6) {
      setError("Use a password with at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const credential = isLogin
        ? await signInWithEmailAndPassword(auth, email, password)
        : await createUserWithEmailAndPassword(auth, email, password);

      if (!isLogin) {
        await updateProfile(credential.user, { displayName: fullName });
        await sendEmailVerification(credential.user);
        await signOut(auth);
        startResendCooldown(email);
        setFullName("");
        setEmail("");
        setPassword("");
        setVerificationNotice("We sent a verification email. Verify your email address, then sign in.");
        return;
      }

      await reload(credential.user);
      if (!credential.user.emailVerified) {
        await signOut(auth);
        setCanResendVerification(true);
        setError("Verify your email address before signing in. Check your inbox for the verification link.");
        return;
      }

      const sessionResponse = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: await credential.user.getIdToken(true) }),
      });

      if (!sessionResponse.ok) {
        const session = await sessionResponse.json().catch(() => null);
        throw new Error(session?.error ?? "Unable to create a secure session.");
      }

      await refreshAuthState();
      window.location.assign(returnPath());
    } catch (caughtError) {
      const code = caughtError instanceof Error ? caughtError.message.match(/auth\/[\w-]+/)?.[0] : undefined;
      setError(code ? authErrors[code] ?? "We could not sign you in. Please try again." : caughtError instanceof Error ? caughtError.message : "We could not sign you in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function resendVerificationEmail() {
    if (!auth || resendCooldownSeconds > 0) return;

    setError("");
    setIsSubmitting(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      await reload(credential.user);

      if (credential.user.emailVerified) {
        await signOut(auth);
        setCanResendVerification(false);
        setError("Your email address is already verified. Sign in again.");
        return;
      }

      await sendEmailVerification(credential.user);
      await signOut(auth);
      startResendCooldown(email);
      setEmail("");
      setPassword("");
      setCanResendVerification(true);
      setVerificationNotice("We sent a new verification email. Verify your email address before signing in.");
    } catch (caughtError) {
      const code = caughtError instanceof Error ? caughtError.message.match(/auth\/[\w-]+/)?.[0] : undefined;
      setError(code ? authErrors[code] ?? "We could not resend the verification email. Please try again." : "We could not resend the verification email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function requestPasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!auth || passwordResetCooldownSeconds > 0) return;

    if (!email.trim()) {
      setError("Enter your email address to reset your password.");
      return;
    }

    setError("");
    setVerificationNotice("");
    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      startPasswordResetCooldown(email);
      setPassword("");
      setVerificationNotice("We sent a password reset email. Check your inbox to continue.");
    } catch (caughtError) {
      const code = caughtError instanceof Error ? caughtError.message.match(/auth\/[\w-]+/)?.[0] : undefined;
      setError(code ? authErrors[code] ?? "We could not send a password reset email. Please try again." : "We could not send a password reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if ((isLoading || user) && !isSubmitting && !verificationNotice) {
    return <main className="min-h-screen" />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl sm:p-8">
        <Link href="/" className="text-sm font-semibold text-[var(--accent)] hover:underline">Learn with Rajan</Link>
        <h1 className="mt-6 text-2xl font-bold text-[var(--text)]">{isPasswordResetMode ? "Reset your password" : isLogin ? "Welcome back" : "Create your account"}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{isPasswordResetMode ? "Enter your email and we’ll send a reset link." : isLogin ? "Sign in to continue learning." : "Save your place as you learn."}</p>

        <form className="mt-7 space-y-5" onSubmit={isPasswordResetMode ? requestPasswordReset : handleSubmit}>
          {!isLogin && (
            <label className="block text-sm font-medium text-[var(--text)]">
              Full name
              <input type="text" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} required className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-[var(--text)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--glow)]" />
            </label>
          )}
          <label className="block text-sm font-medium text-[var(--text)]">
            Email address
            <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-[var(--text)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--glow)]" />
          </label>
          {!isPasswordResetMode && <label className="block text-sm font-medium text-[var(--text)]">
            Password
            <span className="relative mt-2 block">
              <input type={showPassword ? "text" : "password"} autoComplete={isLogin ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={isLogin ? undefined : 6} className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 pr-14 text-[var(--text)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--glow)]" />
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 grid w-11 place-items-center text-[var(--muted)] transition hover:text-[var(--accent)]">
                {showPassword ? <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A10.7 10.7 0 0 1 12 4c5 0 9.3 3.3 10 8-0.3 1.8-1.3 3.4-2.7 4.7M6.1 6.1C3.8 7.5 2.3 9.6 2 12c0.7 4.7 5 8 10 8 1.3 0 2.6-0.2 3.7-0.7" /></svg> : <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>}
              </button>
            </span>
          </label>}
          {isLogin && !isPasswordResetMode && <button type="button" onClick={() => { setError(""); setVerificationNotice(""); setIsPasswordResetMode(true); }} disabled={isSubmitting} className="-mt-2 block text-sm font-medium text-[var(--accent)] hover:underline disabled:cursor-not-allowed disabled:opacity-60">Forgot password?</button>}
          {error && <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-300">{error}</p>}
          {canResendVerification && !isPasswordResetMode && <button type="button" onClick={resendVerificationEmail} disabled={isSubmitting || resendCooldownSeconds > 0} className="text-sm font-medium text-[var(--accent)] hover:underline disabled:cursor-not-allowed disabled:opacity-60">{resendCooldownSeconds > 0 ? `Resend available in ${formatCooldown(resendCooldownSeconds)}` : "Resend verification email"}</button>}
          <button type="submit" disabled={isSubmitting || (isPasswordResetMode && passwordResetCooldownSeconds > 0)} className="w-full rounded-lg bg-[var(--accent)] px-4 py-2.5 font-semibold text-[var(--accent-fg)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? "Please wait..." : isPasswordResetMode && passwordResetCooldownSeconds > 0 ? `Send reset link in ${formatCooldown(passwordResetCooldownSeconds)}` : isPasswordResetMode ? "Send reset link" : isLogin ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          {isPasswordResetMode ? <button type="button" onClick={() => { setError(""); setIsPasswordResetMode(false); }} className="font-medium text-[var(--accent)] hover:underline">Back to sign in</button> : <>{isLogin ? "New here? " : "Already have an account? "}<Link href={isLogin ? "/register" : "/login"} onClick={switchAuthMode} className="font-medium text-[var(--accent)] hover:underline">{isLogin ? "Create an account" : "Sign in"}</Link></>}
        </p>
      </section>
      {verificationNotice && <div role="status" className="fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-3 rounded-xl border border-blue-500/30 bg-[var(--surface)] p-4 text-sm text-[var(--text)] shadow-2xl"><span className="mt-0.5 text-blue-500">✓</span><p>{verificationNotice}</p><button type="button" onClick={() => setVerificationNotice("")} aria-label="Close message" className="text-[var(--muted)] hover:text-[var(--text)]">×</button></div>}
    </main>
  );
}
