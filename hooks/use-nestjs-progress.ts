"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { NESTJS_TOTAL_DAYS } from "@/lib/nestjs-learning/nestjs-challenge-data";

const STORAGE_KEY = "learnwithrajan.nestjs.completed";
const LOCAL_EVENT = "learnwithrajan.nestjs.changed";

function serialize(done: Set<number>): string {
  return JSON.stringify([...done].sort((a, b) => a - b));
}

function deserialize(raw: string): Set<number> | null {
  try {
    const value = JSON.parse(raw) as unknown;
    if (!Array.isArray(value)) return null;
    return new Set(value.filter((day): day is number => typeof day === "number" && day >= 1 && day <= NESTJS_TOTAL_DAYS));
  } catch {
    return null;
  }
}

function getServerSnapshot(): string {
  return "[]";
}

function getClientSnapshot(): string {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw && deserialize(raw) ? raw : getServerSnapshot();
}

function subscribe(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(LOCAL_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(LOCAL_EVENT, onStoreChange);
  };
}

export function useNestjsProgress() {
  const snapshot = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const completed = useMemo(() => new Set(JSON.parse(snapshot) as number[]), [snapshot]);
  const completedCount = completed.size;
  const percent = Math.round((completedCount / NESTJS_TOTAL_DAYS) * 100);
  const toggleDay = useCallback((day: number) => {
    const next = new Set(completed);
    if (next.has(day)) next.delete(day);
    else next.add(day);
    window.localStorage.setItem(STORAGE_KEY, serialize(next));
    window.dispatchEvent(new Event(LOCAL_EVENT));
  }, [completed]);

  return { completedCount, percent, toggleDay, isDone: (day: number) => completed.has(day) };
}
