"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export type FocusMode = "focus" | "shortBreak" | "longBreak";

type SavedTimer = {
  mode: FocusMode;
  endsAt: number | null;
  remainingSeconds: number;
  isRunning: boolean;
  completedFocusSessions: number;
};

type FocusTimerContextValue = SavedTimer & {
  start: () => void;
  pause: () => void;
  reset: () => void;
  selectMode: (mode: FocusMode) => void;
  getRunningMode: () => FocusMode | null;
  requestNotifications: () => Promise<NotificationPermission | "unsupported">;
};

const STORAGE_KEY = "learn-with-rajan:focus-timer";
const DURATIONS: Record<FocusMode, number> = { focus: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 };
const FocusTimerContext = createContext<FocusTimerContextValue | null>(null);

function readTimer(): SavedTimer {
  const initial = { mode: "focus" as FocusMode, endsAt: null, remainingSeconds: DURATIONS.focus, isRunning: false, completedFocusSessions: 0 };
  if (typeof window === "undefined") return initial;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initial;
    const parsed = JSON.parse(stored) as SavedTimer;
    if (!Object.hasOwn(DURATIONS, parsed.mode)) return initial;
    if (parsed.isRunning && parsed.endsAt) {
      return { ...parsed, remainingSeconds: Math.max(0, Math.ceil((parsed.endsAt - Date.now()) / 1000)) };
    }
    return parsed;
  } catch {
    return initial;
  }
}

function notify(mode: FocusMode) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(mode === "focus" ? "Focus session complete" : "Break complete", {
      body: mode === "focus" ? "Take a well-earned break." : "Ready for your next focus session?",
      icon: "/favicon.ico",
    });
  }
}

function playBell(context: AudioContext) {
  const now = context.currentTime;
  [523.25, 659.25].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, now + index * 0.22);
    gain.gain.linearRampToValueAtTime(0.12, now + index * 0.22 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.22 + 1.2);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(now + index * 0.22);
    oscillator.stop(now + index * 0.22 + 1.25);
  });
}

function isSameTimer(left: SavedTimer, right: SavedTimer) {
  return left.mode === right.mode && left.endsAt === right.endsAt && left.remainingSeconds === right.remainingSeconds && left.isRunning === right.isRunning && left.completedFocusSessions === right.completedFocusSessions;
}

export function FocusTimerProvider({ children }: { children: ReactNode }) {
  const [timer, setTimer] = useState<SavedTimer>({ mode: "focus", endsAt: null, remainingSeconds: DURATIONS.focus, isRunning: false, completedFocusSessions: 0 });
  const timersByMode = useRef<Partial<Record<FocusMode, SavedTimer>>>({});
  const audioContext = useRef<AudioContext | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setTimer(readTimer());
      setIsHydrated(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const syncTimer = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const savedTimer = readTimer();
      setTimer((current) => isSameTimer(current, savedTimer) ? current : savedTimer);
    };
    window.addEventListener("storage", syncTimer);
    return () => window.removeEventListener("storage", syncTimer);
  }, [isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timer));
  }, [isHydrated, timer]);

  useEffect(() => {
    if (!isHydrated) return;
    if (!timer.isRunning || !timer.endsAt) return;
    const tick = () => {
      const remainingSeconds = Math.max(0, Math.ceil((timer.endsAt! - Date.now()) / 1000));
      if (remainingSeconds === 0) {
        notify(timer.mode);
        if (audioContext.current) playBell(audioContext.current);
        setTimer((current) => ({
          ...current,
          endsAt: null,
          isRunning: false,
          remainingSeconds: 0,
          completedFocusSessions: current.completedFocusSessions + (current.mode === "focus" ? 1 : 0),
        }));
        return;
      }
      setTimer((current) => current.remainingSeconds === remainingSeconds ? current : { ...current, remainingSeconds });
    };
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [isHydrated, timer.endsAt, timer.isRunning, timer.mode]);

  const selectMode = useCallback((mode: FocusMode) => {
    setTimer((current) => {
      timersByMode.current[current.mode] = current;
      const saved = timersByMode.current[mode];
      if (!saved) return { ...current, mode, endsAt: null, isRunning: false, remainingSeconds: DURATIONS[mode] };
      const remainingSeconds = saved.isRunning && saved.endsAt ? Math.max(0, Math.ceil((saved.endsAt - Date.now()) / 1000)) : saved.remainingSeconds;
      return { ...saved, remainingSeconds };
    });
  }, []);

  const start = useCallback(() => {
    if (!audioContext.current) audioContext.current = new AudioContext();
    void audioContext.current.resume();
    setTimer((current) => {
      (Object.keys(timersByMode.current) as FocusMode[]).forEach((savedMode) => {
        if (savedMode === current.mode) return;
        const saved = timersByMode.current[savedMode];
        if (!saved?.isRunning) return;
        timersByMode.current[savedMode] = {
          ...saved,
          endsAt: null,
          isRunning: false,
          remainingSeconds: DURATIONS[savedMode],
        };
      });
      const remainingSeconds = current.remainingSeconds || DURATIONS[current.mode];
      return { ...current, remainingSeconds, isRunning: true, endsAt: Date.now() + remainingSeconds * 1000 };
    });
  }, []);

  const pause = useCallback(() => {
    setTimer((current) => ({ ...current, isRunning: false, endsAt: null }));
  }, []);

  const reset = useCallback(() => {
    setTimer((current) => ({ ...current, endsAt: null, isRunning: false, remainingSeconds: DURATIONS[current.mode] }));
  }, []);

  const getRunningMode = useCallback(() => {
    const candidates = { ...timersByMode.current, [timer.mode]: timer };
    return (Object.keys(DURATIONS) as FocusMode[]).find((mode) => mode !== timer.mode && candidates[mode]?.isRunning) ?? null;
  }, [timer]);

  const requestNotifications = useCallback(async () => {
    if (!("Notification" in window)) return "unsupported" as const;
    return Notification.requestPermission();
  }, []);

  const value = useMemo(() => ({ ...timer, start, pause, reset, selectMode, getRunningMode, requestNotifications }), [timer, start, pause, reset, selectMode, getRunningMode, requestNotifications]);
  return <FocusTimerContext.Provider value={value}>{children}</FocusTimerContext.Provider>;
}

export function useFocusTimer() {
  const context = useContext(FocusTimerContext);
  if (!context) throw new Error("useFocusTimer must be used inside FocusTimerProvider");
  return context;
}
