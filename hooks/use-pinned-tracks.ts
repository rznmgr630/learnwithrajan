"use client";

import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthAction } from "@/context/AuthActionContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { db } from "@/lib/firebase";

const STORAGE_KEY = "learnwithrajan.pinned";

function legacyPinnedTracks() {
  try {
    const values = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as unknown;
    return Array.isArray(values) ? values.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [];
  }
}

export function usePinnedTracks() {
  const { user } = useAuth();
  const { requestAuthentication } = useAuthAction();
  const { showToast } = useToast();
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const pinned = useMemo(() => new Set(pinnedIds), [pinnedIds]);

  useEffect(() => {
    if (!db || !user) {
      const timeout = window.setTimeout(() => setPinnedIds([]), 0);
      return () => window.clearTimeout(timeout);
    }

    const pinnedRef = doc(db, "users", user.uid, "learning", "pinnedTracks");
    return onSnapshot(pinnedRef, (snapshot) => {
      const stored = snapshot.data()?.ids;
      if (Array.isArray(stored)) {
        setPinnedIds(stored.filter((value): value is string => typeof value === "string"));
        return;
      }

      const migrated = legacyPinnedTracks();
      setPinnedIds(migrated);
      if (migrated.length > 0) void setDoc(pinnedRef, { ids: migrated, updatedAt: Date.now() });
    });
  }, [user]);

  const togglePin = useCallback(async (id: string) => {
    if (!user || !db) {
      requestAuthentication();
      return;
    }

    const wasPinned = pinned.has(id);
    const next = new Set(pinned);
    if (wasPinned) next.delete(id);
    else next.add(id);
    const ids = [...next].sort();
    setPinnedIds(ids);

    try {
      await setDoc(doc(db, "users", user.uid, "learning", "pinnedTracks"), { ids, updatedAt: Date.now() });
      showToast(wasPinned ? "Removed from pinned" : "Added to pinned");
    } catch {
      setPinnedIds([...pinned]);
      showToast("Could not save pin");
    }
  }, [pinned, requestAuthentication, showToast, user]);

  const isPinned = useCallback((id: string) => pinned.has(id), [pinned]);

  return { pinned, togglePin, isPinned, isAuthenticated: Boolean(user) };
}
