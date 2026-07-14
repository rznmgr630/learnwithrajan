"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "learnwithrajan.pinned";
const LOCAL_EVENT = "learnwithrajan.pinned.changed";

function serialize(ids: Set<string>): string {
  return JSON.stringify([...ids].sort());
}

function deserialize(raw: string): Set<string> | null {
  try {
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return null;
    return new Set(arr.filter((id): id is string => typeof id === "string"));
  } catch {
    return null;
  }
}

function getServerSnapshot(): string {
  return "[]";
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

export function usePinnedTracks() {
  const snapshot = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const pinned = useMemo(() => new Set(JSON.parse(snapshot) as string[]), [snapshot]);

  const togglePin = useCallback((id: string) => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const base = raw === null || raw === "" ? new Set<string>() : (deserialize(raw) ?? new Set<string>());
    const next = new Set(base);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    window.localStorage.setItem(STORAGE_KEY, serialize(next));
    emitLocal();
  }, []);

  const isPinned = useCallback((id: string) => pinned.has(id), [pinned]);

  return { pinned, togglePin, isPinned };
}
