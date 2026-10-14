"use client";

import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useAuthAction } from "@/context/AuthActionContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { db } from "@/lib/firebase";

type ProgressValue = number | string;

type UserProgressOptions<T extends ProgressValue> = {
  id: string;
  initialValues?: Iterable<T>;
  legacyStorageKey?: string;
  isValid: (value: unknown) => value is T;
};

function readLegacyValues<T extends ProgressValue>(storageKey: string | undefined, isValid: (value: unknown) => value is T) {
  if (!storageKey || typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const values = JSON.parse(raw) as unknown;
    return Array.isArray(values) ? new Set(values.filter(isValid)) : null;
  } catch {
    return null;
  }
}

export function useUserProgress<T extends ProgressValue>({ id, initialValues = [], legacyStorageKey, isValid }: UserProgressOptions<T>) {
  const { user } = useAuth();
  const { requestAuthentication } = useAuthAction();
  const { showToast } = useToast();
  const [values, setValues] = useState<Set<T>>(() => new Set(initialValues));

  useEffect(() => {
    if (!db || !user) return;

    const progressRef = doc(db, "users", user.uid, "learningProgress", id);
    return onSnapshot(progressRef, (snapshot) => {
      const stored = snapshot.data()?.values;
      if (Array.isArray(stored)) {
        setValues(new Set(stored.filter(isValid)));
        return;
      }

      const migrated = readLegacyValues(legacyStorageKey, isValid);
      if (migrated) setValues(migrated);
      if (migrated) void setDoc(progressRef, { values: [...migrated], updatedAt: Date.now() });
    });
  }, [id, isValid, legacyStorageKey, user]);

  const toggle = useCallback(async (value: T) => {
    if (!user || !db) {
      requestAuthentication();
      return;
    }

    const wasCompleted = values.has(value);
    const next = new Set(values);
    if (wasCompleted) next.delete(value);
    else next.add(value);
    setValues(next);

    try {
      await setDoc(doc(db, "users", user.uid, "learningProgress", id), { values: [...next], updatedAt: Date.now() });
      showToast(wasCompleted ? "Marked as incomplete" : "Marked as complete");
    } catch {
      setValues(values);
      showToast("Could not save progress");
    }
  }, [id, requestAuthentication, showToast, user, values]);

  return { values, toggle, isAuthenticated: Boolean(user) };
}
