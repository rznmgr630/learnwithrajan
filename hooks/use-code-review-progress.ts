"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { CODE_REVIEW_CHALLENGES } from "@/lib/code-review/challenges";

const STORAGE_KEY = "learnwithrajan.code-review.completed";
const LOCAL_EVENT = "learnwithrajan.code-review.changed";

function getSnapshot() {
  if (typeof window === "undefined") return "[]";
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return "[]";
  try {
    const ids = JSON.parse(raw) as unknown;
    if (!Array.isArray(ids)) return "[]";
    const validIds = new Set(CODE_REVIEW_CHALLENGES.map((challenge) => challenge.id));
    return JSON.stringify(ids.filter((id): id is number => typeof id === "number" && validIds.has(id)).sort((a, b) => a - b));
  } catch {
    return "[]";
  }
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

export function useCodeReviewProgress() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const completed = useMemo(() => new Set(JSON.parse(snapshot) as number[]), [snapshot]);

  const toggleCompleted = useCallback((id: number) => {
    const next = new Set(completed);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next].sort((a, b) => a - b)));
    window.dispatchEvent(new Event(LOCAL_EVENT));
  }, [completed]);

  return { completed, completedCount: completed.size, toggleCompleted };
}
