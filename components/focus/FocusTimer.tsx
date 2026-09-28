"use client";

import { useState } from "react";
import { type FocusMode, useFocusTimer } from "@/components/focus/FocusTimerProvider";

const modes: { id: FocusMode; label: string; subtitle: string }[] = [
  { id: "focus", label: "Focus", subtitle: "Deep work" },
  { id: "shortBreak", label: "Short break", subtitle: "Reset" },
  { id: "longBreak", label: "Long break", subtitle: "Recharge" },
];
const defaultDurations: Record<FocusMode, number> = { focus: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 };

function formatTime(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function FocusTimer() {
  const { mode, remainingSeconds, isRunning, completedFocusSessions, start, pause, reset, selectMode, getRunningMode, requestNotifications } = useFocusTimer();
  const [task, setTask] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [runningMode, setRunningMode] = useState<FocusMode | null>(null);
  const activeMode = modes.find((item) => item.id === mode)!;
  const canReset = isRunning || remainingSeconds !== defaultDurations[mode];

  async function handleStart() {
    const activeMode = getRunningMode();
    if (activeMode) {
      setRunningMode(activeMode);
      return;
    }
    await startTimer();
  }

  async function startTimer() {
    start();
    if (!("Notification" in window) || Notification.permission === "default") {
      const permission = await requestNotifications();
      if (permission === "denied") setNotificationMessage("Notifications are blocked. Enable them in your browser settings to get timer alerts.");
      if (permission === "unsupported") setNotificationMessage("This browser does not support notifications.");
    }
  }

  return (
    <main className="relative isolate min-h-[calc(100vh-3.5rem)] overflow-hidden px-4 py-10 sm:px-6 sm:py-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_38%),radial-gradient(circle_at_0%_85%,#a855f71c,transparent_30%)]" />
      <section className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Focus room</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">Make space for what matters.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[var(--muted)]">Your timer keeps running when you study elsewhere in the app. We will alert you when the session is over.</p>
      </section>

      <section className="mx-auto mt-10 max-w-xl rounded-[2rem] border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_86%,transparent)] p-4 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-8">
        <div className="grid grid-cols-3 gap-1 rounded-2xl bg-[var(--elevated)] p-1">
          {modes.map((item) => <button key={item.id} type="button" onClick={() => selectMode(item.id)} className={`cursor-pointer rounded-xl px-2 py-3 text-sm font-medium transition ${mode === item.id ? "bg-[var(--surface)] text-[var(--text)] shadow-sm" : "text-[var(--muted)] hover:text-[var(--text)]"}`}><span className="block">{item.label}</span><span className="mt-0.5 block text-[10px] font-normal text-[var(--faint)]">{item.subtitle}</span></button>)}
        </div>

        <div className="py-10 text-center sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{activeMode.label} session</p>
          <time className="mt-3 block font-mono text-7xl font-semibold tracking-[-0.08em] text-[var(--text)] sm:text-8xl" aria-live="polite">{formatTime(remainingSeconds)}</time>
          <p className="mt-4 text-sm text-[var(--muted)]">{task ? `Working on: ${task}` : "Name one thing to focus on."}</p>
        </div>

        <div className="flex justify-center gap-3">
          <button type="button" onClick={isRunning ? pause : handleStart} className="min-w-40 cursor-pointer rounded-2xl bg-[var(--accent)] px-7 py-4 text-base font-semibold text-[var(--accent-fg)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]">{isRunning ? "Pause" : remainingSeconds === 0 ? "Start again" : `Start ${activeMode.label.toLowerCase()}`}</button>
          <button type="button" onClick={reset} disabled={!canReset} className="cursor-pointer rounded-2xl border border-[var(--border)] px-5 py-4 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--elevated)] hover:text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-40">Reset</button>
        </div>
        {notificationMessage && <p className="mx-auto mt-4 max-w-sm text-center text-xs leading-5 text-amber-600 dark:text-amber-300">{notificationMessage}</p>}

        <div className="mt-8 border-t border-[var(--border)] pt-5">
          <label className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--faint)]" htmlFor="focus-task">Today&apos;s task</label>
          <input id="focus-task" value={task} onChange={(event) => setTask(event.target.value)} placeholder="e.g. Finish the React lesson" className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--elevated)] px-4 py-3 text-sm text-[var(--text)] outline-none transition placeholder:text-[var(--faint)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--glow)]" />
        </div>
      </section>

      <p className="mx-auto mt-7 flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs text-[var(--muted)]"><span className="h-2 w-2 rounded-full bg-[var(--accent)]" /> {completedFocusSessions} focus {completedFocusSessions === 1 ? "session" : "sessions"} completed</p>
      {runningMode && <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="timer-conflict-title"><div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl"><p className="text-sm font-semibold text-[var(--accent)]">Timer already running</p><h2 id="timer-conflict-title" className="mt-2 text-xl font-semibold text-[var(--text)]">{modes.find((item) => item.id === runningMode)?.label} is still running.</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Do you want to start this {activeMode.label.toLowerCase()} timer too?</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setRunningMode(null)} className="rounded-xl px-4 py-2 text-sm font-medium text-[var(--muted)] hover:bg-[var(--elevated)]">Cancel</button><button type="button" onClick={() => { setRunningMode(null); void startTimer(); }} className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-fg)]">Start anyway</button></div></div></div>}
    </main>
  );
}
