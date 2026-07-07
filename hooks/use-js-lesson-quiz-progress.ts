"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "learnwithrajan.js.lessonQuiz";
const LOCAL_EVENT = "learnwithrajan.js.lessonQuiz.changed";

export interface QuizResult {
  score: number;
  total: number;
  completed: true;
}

type QuizResultMap = Record<string, QuizResult>;

function deserialize(raw: string): QuizResultMap {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    const out: QuizResultMap = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (
        typeof value === "object" &&
        value !== null &&
        typeof (value as QuizResult).score === "number" &&
        typeof (value as QuizResult).total === "number"
      ) {
        out[key] = { score: (value as QuizResult).score, total: (value as QuizResult).total, completed: true };
      }
    }
    return out;
  } catch {
    return {};
  }
}

function getServerSnapshot(): string {
  return "{}";
}

function getClientSnapshot(): string {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return "{}";
  return JSON.stringify(deserialize(raw));
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

/** quizId format: `${trackAndDay}.${lessonId or "final"}`, e.g. "js-day-1.variables" or "js-day-1.final". */
export function useJsLessonQuizProgress() {
  const snapshot = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const results: QuizResultMap = JSON.parse(snapshot);

  const recordResult = useCallback((quizId: string, score: number, total: number) => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const base = raw ? deserialize(raw) : {};
    const next: QuizResultMap = { ...base, [quizId]: { score, total, completed: true } };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    emitLocal();
  }, []);

  const clearResult = useCallback((quizId: string) => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const base = raw ? deserialize(raw) : {};
    const next = { ...base };
    delete next[quizId];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    emitLocal();
  }, []);

  const getResult = useCallback((quizId: string) => results[quizId], [results]);

  return { results, recordResult, clearResult, getResult };
}
