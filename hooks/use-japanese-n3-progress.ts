"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  JP_N3_TOTAL_DAYS,
  JP_N3_WEEKLY_TEST_TOTAL,
  N3_WEEKLY_TEST_IDS,
  seedJapaneseN3CompletedDayNumbers,
} from "@/lib/japanese-learning/n3/japanese-n3-data";

const STORAGE_KEY = "learnwithrajan.japaneseN3.completed";
const WEEKLY_STORAGE_KEY = "learnwithrajan.japaneseN3.weeklyTestsCompleted";
const LOCAL_EVENT = "learnwithrajan.japaneseN3.changed";

function serialize(done: Set<number>): string {
  return JSON.stringify([...done].sort((a, b) => a - b));
}

function deserialize(raw: string): Set<number> | null {
  try {
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return null;
    return new Set(
      arr.filter((n): n is number => typeof n === "number" && n >= 1 && n <= JP_N3_TOTAL_DAYS),
    );
  } catch {
    return null;
  }
}

const ALLOWED_WEEKLY_IDS = new Set(N3_WEEKLY_TEST_IDS);

function serializeWeekly(done: Set<string>): string {
  return JSON.stringify([...done].sort());
}

function deserializeWeekly(raw: string): Set<string> | null {
  try {
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return null;
    return new Set(arr.filter((id): id is string => typeof id === "string" && ALLOWED_WEEKLY_IDS.has(id)));
  } catch {
    return null;
  }
}

function getServerSnapshot(): string {
  return serialize(seedJapaneseN3CompletedDayNumbers());
}

function getClientSnapshot(): string {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return getServerSnapshot();
  const parsed = deserialize(raw);
  if (!parsed) return getServerSnapshot();
  return serialize(parsed);
}

function getWeeklyServerSnapshot(): string {
  return serializeWeekly(new Set());
}

function getWeeklyClientSnapshot(): string {
  const raw = window.localStorage.getItem(WEEKLY_STORAGE_KEY);
  if (!raw) return getWeeklyServerSnapshot();
  const parsed = deserializeWeekly(raw);
  if (!parsed) return getWeeklyServerSnapshot();
  return serializeWeekly(parsed);
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const onStorage = (event: StorageEvent) => {
    if (
      event.key === STORAGE_KEY ||
      event.key === WEEKLY_STORAGE_KEY ||
      event.key === null
    ) {
      onStoreChange();
    }
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

export function useJapaneseN3Progress() {
  const snapshot = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const weeklySnapshot = useSyncExternalStore(subscribe, getWeeklyClientSnapshot, getWeeklyServerSnapshot);

  const completed = useMemo(() => new Set(JSON.parse(snapshot) as number[]), [snapshot]);
  const weeklyCompleted = useMemo(() => new Set(JSON.parse(weeklySnapshot) as string[]), [weeklySnapshot]);

  const completedCount = completed.size;
  const percent = useMemo(
    () => Math.round((Math.min(completedCount, JP_N3_TOTAL_DAYS) / JP_N3_TOTAL_DAYS) * 100),
    [completedCount],
  );

  const weeklyTestsCompletedCount = weeklyCompleted.size;

  const toggleDay = useCallback((day: number) => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const base =
      raw === null || raw === ""
        ? seedJapaneseN3CompletedDayNumbers()
        : deserialize(raw) ?? seedJapaneseN3CompletedDayNumbers();
    const next = new Set(base);
    if (next.has(day)) next.delete(day);
    else next.add(day);
    window.localStorage.setItem(STORAGE_KEY, serialize(next));
    emitLocal();
  }, []);

  const toggleWeeklyTest = useCallback((weekTestId: string) => {
    if (typeof window === "undefined") return;
    if (!ALLOWED_WEEKLY_IDS.has(weekTestId)) return;
    const raw = window.localStorage.getItem(WEEKLY_STORAGE_KEY);
    const base = raw === null || raw === "" ? new Set<string>() : deserializeWeekly(raw) ?? new Set<string>();
    const next = new Set(base);
    if (next.has(weekTestId)) next.delete(weekTestId);
    else next.add(weekTestId);
    window.localStorage.setItem(WEEKLY_STORAGE_KEY, serializeWeekly(next));
    emitLocal();
  }, []);

  const isDone = useCallback((d: number) => completed.has(d), [completed]);
  const isWeeklyTestDone = useCallback((id: string) => weeklyCompleted.has(id), [weeklyCompleted]);

  return {
    completed,
    completedCount,
    percent,
    toggleDay,
    isDone,
    weeklyTestsCompletedCount,
    weeklyTestTotal: JP_N3_WEEKLY_TEST_TOTAL,
    toggleWeeklyTest,
    isWeeklyTestDone,
  };
}
