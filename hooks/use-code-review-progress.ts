"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { CodeReviewChallenge } from "@/lib/code-review/challenges";

function getSnapshot(storageKey: string, challenges: CodeReviewChallenge[]) {
  if (typeof window === "undefined") return "[]";
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return "[]";
  try {
    const ids = JSON.parse(raw) as unknown;
    if (!Array.isArray(ids)) return "[]";
    const validIds = new Set(challenges.map((challenge) => challenge.id));
    return JSON.stringify(ids.filter((id): id is number => typeof id === "number" && validIds.has(id)).sort((a, b) => a - b));
  } catch {
    return "[]";
  }
}

function subscribe(storageKey: string, localEvent: string, onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(localEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(localEvent, onStoreChange);
  };
}

export function useCodeReviewProgress(challenges: CodeReviewChallenge[], storageKey: string) {
  const localEvent = `${storageKey}.changed`;
  const snapshot = useSyncExternalStore(
    (onStoreChange) => subscribe(storageKey, localEvent, onStoreChange),
    () => getSnapshot(storageKey, challenges),
    () => "[]",
  );
  const completed = useMemo(() => new Set(JSON.parse(snapshot) as number[]), [snapshot]);

  const toggleCompleted = useCallback((id: number) => {
    const next = new Set(completed);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    window.localStorage.setItem(storageKey, JSON.stringify([...next].sort((a, b) => a - b)));
    window.dispatchEvent(new Event(localEvent));
  }, [completed, localEvent, storageKey]);

  return { completed, completedCount: completed.size, toggleCompleted };
}
