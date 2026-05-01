"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { NODEJS_TOTAL_DAYS, seedNodejsCompletedDayNumbers } from "@/lib/nodejs-learning/nodejs-challenge-data";

const STORAGE_KEY = "learnwithrajan.nodejs.completed";
const LOCAL_EVENT = "learnwithrajan.nodejs.changed";

function serialize(done: Set<number>): string {
  return JSON.stringify([...done].sort((a, b) => a - b));
}

function deserialize(raw: string): Set<number> | null {
  try {
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return null;
    return new Set(
      arr.filter((n): n is number => typeof n === "number" && n >= 1 && n <= NODEJS_TOTAL_DAYS),
    );
  } catch {
    return null;
  }
}

function getServerSnapshot(): string {
  return serialize(seedNodejsCompletedDayNumbers());
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

export function useNodejsProgress() {
  const snapshot = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const completed = useMemo(() => new Set(JSON.parse(snapshot) as number[]), [snapshot]);

  const completedCount = completed.size;
  const percent = useMemo(
    () => Math.round((Math.min(completedCount, NODEJS_TOTAL_DAYS) / NODEJS_TOTAL_DAYS) * 100),
    [completedCount],
  );

  const toggleDay = useCallback((day: number) => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const base =
      raw === null || raw === "" ? seedNodejsCompletedDayNumbers() : deserialize(raw) ?? seedNodejsCompletedDayNumbers();
    const next = new Set(base);
    if (next.has(day)) next.delete(day);
    else next.add(day);
    window.localStorage.setItem(STORAGE_KEY, serialize(next));
    emitLocal();
  }, []);

  const isDone = useCallback((d: number) => completed.has(d), [completed]);

  return { completed, completedCount, percent, toggleDay, isDone };
}
