"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { GIT_TOTAL_DAYS, seedGitCompletedDayNumbers } from "@/lib/git-learning/git-challenge-data";

const STORAGE_KEY = "learnwithrajan.git7.completed";
const LOCAL_EVENT = "learnwithrajan.git7.changed";

function serialize(done: Set<number>): string {
  return JSON.stringify([...done].sort((a, b) => a - b));
}

function deserialize(raw: string): Set<number> | null {
  try {
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return null;
    return new Set(
      arr.filter((n): n is number => typeof n === "number" && n >= 1 && n <= GIT_TOTAL_DAYS),
    );
  } catch {
    return null;
  }
}

function getServerSnapshot(): string {
  return serialize(seedGitCompletedDayNumbers());
}

function getClientSnapshot(): string {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return getServerSnapshot();
  const parsed = deserialize(raw);
  if (!parsed) return getServerSnapshot();
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

export function useGit7Progress() {
  const snapshot = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const completed = useMemo(() => new Set(JSON.parse(snapshot) as number[]), [snapshot]);

  const completedCount = completed.size;
  const percent = useMemo(
    () => Math.round((Math.min(completedCount, GIT_TOTAL_DAYS) / GIT_TOTAL_DAYS) * 100),
    [completedCount],
  );

  const toggleDay = useCallback((day: number) => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const base =
      raw === null || raw === "" ? seedGitCompletedDayNumbers() : deserialize(raw) ?? seedGitCompletedDayNumbers();
    const next = new Set(base);
    if (next.has(day)) next.delete(day);
    else next.add(day);
    window.localStorage.setItem(STORAGE_KEY, serialize(next));
    emitLocal();
  }, []);

  const isDone = useCallback((d: number) => completed.has(d), [completed]);

  return { completed, completedCount, percent, toggleDay, isDone };
}
