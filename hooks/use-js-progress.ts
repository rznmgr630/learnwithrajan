"use client";

import { useNumericProgress } from "@/hooks/use-numeric-progress";
import { JS_TOTAL_DAYS, seedJsCompletedDayNumbers } from "@/lib/js-learning/js-challenge-data";

export function useJsProgress() {
  return useNumericProgress({ id: "javascript", total: JS_TOTAL_DAYS, legacyStorageKey: "learnwithrajan.js.completed", initialValues: seedJsCompletedDayNumbers() });
}
