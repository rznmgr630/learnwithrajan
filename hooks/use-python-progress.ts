"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { PYTHON_TOTAL_DAYS } from "@/lib/python-learning/python-challenge-data";

const STORAGE_KEY = "learnwithrajan.python.completed";
const LOCAL_EVENT = "learnwithrajan.python.changed";

function getServerSnapshot(): string {
  return "[]";
}

function getClientSnapshot(): string {
  return window.localStorage.getItem(STORAGE_KEY) ?? getServerSnapshot();
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

export function usePythonProgress() {
  const snapshot = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const completed = useMemo(() => {
    try {
      const values = JSON.parse(snapshot) as unknown;
      return new Set(Array.isArray(values) ? values.filter((day): day is number => typeof day === "number" && day >= 1 && day <= PYTHON_TOTAL_DAYS) : []);
    } catch {
      return new Set<number>();
    }
  }, [snapshot]);
  const completedCount = completed.size;
  const percent = Math.round((completedCount / PYTHON_TOTAL_DAYS) * 100);
  const toggleDay = useCallback((day: number) => {
    const next = new Set(completed);
    if (next.has(day)) next.delete(day);
    else next.add(day);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    window.dispatchEvent(new Event(LOCAL_EVENT));
  }, [completed]);

  return { completedCount, percent, toggleDay, isDone: (day: number) => completed.has(day) };
}
