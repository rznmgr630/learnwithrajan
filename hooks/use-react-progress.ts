"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { REACT_TOTAL_DAYS, seedReactCompletedDayNumbers } from "@/lib/react-learning/react-challenge-data";

const STORAGE_KEY = "learnwithrajan.react.completed";
const LOCAL_EVENT = "learnwithrajan.react.changed";
const DAY_SHIFT_VERSION_KEY = "learnwithrajan.react.day-shift-version";
const DAY_SHIFT_VERSION = "3";

function serialize(done: Set<number>): string {
  return JSON.stringify([...done].sort((a, b) => a - b));
}

function deserialize(raw: string): Set<number> | null {
  try {
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return null;
    return new Set(
      arr.filter((n): n is number => typeof n === "number" && n >= 0 && n <= REACT_TOTAL_DAYS),
    );
  } catch {
    return null;
  }
}

function getServerSnapshot(): string {
  return serialize(seedReactCompletedDayNumbers());
}

function getClientSnapshot(): string {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return getServerSnapshot();
  const parsed = deserialize(raw);
  if (!parsed) return getServerSnapshot();

  const savedVersion = window.localStorage.getItem(DAY_SHIFT_VERSION_KEY);
  let shifted = parsed;

  if (savedVersion !== "2") shifted = new Set([...shifted].map((day) => (day >= 2 ? day + 1 : day)));
  if (savedVersion !== DAY_SHIFT_VERSION) shifted = new Set([...shifted].map((day) => (day >= 3 ? day + 1 : day)));

  if (savedVersion !== DAY_SHIFT_VERSION) {
    window.localStorage.setItem(STORAGE_KEY, serialize(shifted));
    window.localStorage.setItem(DAY_SHIFT_VERSION_KEY, DAY_SHIFT_VERSION);
    return serialize(shifted);
  }

  return serialize(parsed);
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) onStoreChange();
  };
  const onLocal = () => onStoreChange();

  window.addEventListener("storage", onStorage);
  window.addEventListener(LOCAL_EVENT, onLocal);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(LOCAL_EVENT, onLocal);
  };
}

function emitLocal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(LOCAL_EVENT));
  }
}

export function useReactProgress() {
  const snapshot = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const completed = useMemo(() => new Set(JSON.parse(snapshot) as number[]), [snapshot]);

  const completedCount = completed.has(0) ? completed.size - 1 : completed.size;
  const percent = useMemo(
    () => Math.round((Math.min(completedCount, REACT_TOTAL_DAYS) / REACT_TOTAL_DAYS) * 100),
    [completedCount],
  );

  const toggleDay = useCallback((day: number) => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const base =
      raw === null || raw === "" ? seedReactCompletedDayNumbers() : deserialize(raw) ?? seedReactCompletedDayNumbers();
    const next = new Set(base);
    if (next.has(day)) next.delete(day);
    else next.add(day);
    window.localStorage.setItem(STORAGE_KEY, serialize(next));
    emitLocal();
  }, []);

  const isDone = useCallback((d: number) => completed.has(d), [completed]);

  return { completed, completedCount, percent, toggleDay, isDone };
}
