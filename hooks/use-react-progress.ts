"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { REACT_TOTAL_DAYS, seedReactCompletedDayNumbers } from "@/lib/react-learning/react-challenge-data";

const STORAGE_KEY = "learnwithrajan.react.completed";
const LOCAL_EVENT = "learnwithrajan.react.changed";
const DAY_SHIFT_VERSION_KEY = "learnwithrajan.react.day-shift-version";
const DAY_SHIFT_VERSION = "26";

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
  if (savedVersion !== "3") shifted = new Set([...shifted].map((day) => (day >= 3 ? day + 1 : day)));
  if (savedVersion !== "4") shifted = new Set([...shifted].map((day) => (day >= 4 ? day + 1 : day)));
  if (savedVersion !== "5") shifted = new Set([...shifted].map((day) => (day >= 5 ? day + 1 : day)));
  if (savedVersion !== "6") shifted = new Set([...shifted].map((day) => (day >= 6 ? day + 1 : day)));
  if (savedVersion !== "7") shifted = new Set([...shifted].map((day) => (day >= 7 ? day + 1 : day)));
  if (savedVersion !== "8") shifted = new Set([...shifted].map((day) => (day >= 8 ? day + 1 : day)));
  if (savedVersion !== "9") shifted = new Set([...shifted].map((day) => (day >= 9 ? day + 1 : day)));
  if (savedVersion !== "10") shifted = new Set([...shifted].map((day) => (day >= 10 ? day + 1 : day)));
  if (savedVersion !== "11") shifted = new Set([...shifted].map((day) => (day >= 11 ? day + 1 : day)));
  if (savedVersion !== "12") shifted = new Set([...shifted].map((day) => (day >= 12 ? day + 1 : day)));
  if (savedVersion !== "13") shifted = new Set([...shifted].map((day) => (day >= 13 ? day + 1 : day)));
  if (savedVersion !== "14") shifted = new Set([...shifted].map((day) => (day >= 14 ? day + 1 : day)));
  if (savedVersion !== "15") shifted = new Set([...shifted].map((day) => (day >= 15 ? day + 1 : day)));
  if (savedVersion !== "16") shifted = new Set([...shifted].map((day) => (day >= 16 ? day + 1 : day)));
  if (savedVersion !== "17") shifted = new Set([...shifted].map((day) => (day >= 17 ? day + 1 : day)));
  if (savedVersion !== "18") shifted = new Set([...shifted].map((day) => (day >= 18 ? day + 1 : day)));
  if (savedVersion !== "19") shifted = new Set([...shifted].map((day) => (day >= 19 ? day + 1 : day)));
  if (savedVersion !== "20") {
    shifted = new Set([...shifted].flatMap((day) => {
      const replacements: Record<number, number> = {
        20: 12,
        21: 3,
        22: 4,
        23: 14,
        24: 8,
        25: 18,
        26: 13,
      };
      return [replacements[day] ?? (day >= 27 ? day - 7 : day)];
    }));
  }

  if (savedVersion !== "21") shifted = new Set([...shifted].map((day) => (day >= 26 ? day + 1 : day)));
  if (savedVersion !== "22") shifted = new Set([...shifted].map((day) => (day >= 27 ? day + 1 : day)));
  if (savedVersion !== "23") shifted = new Set([...shifted].map((day) => (day >= 28 ? day + 1 : day)));
  if (savedVersion !== "24") shifted = new Set([...shifted].map((day) => (day >= 29 ? day + 1 : day)));
  if (savedVersion !== "25") shifted = new Set([...shifted].map((day) => (day >= 30 ? day + 1 : day)));
  if (savedVersion !== DAY_SHIFT_VERSION) {
    shifted = new Set([...shifted].flatMap((day) => {
      if (day === 32) return [17];
      if (day === 33) return [22];
      return [day >= 34 ? day - 2 : day];
    }));
  }

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
