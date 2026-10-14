"use client";

import { useNumericProgress } from "@/hooks/use-numeric-progress";
import { LARAVEL_TOTAL_DAYS, seedLaravelCompletedDayNumbers } from "@/lib/laravel-learning/laravel-challenge-data";

export function useLaravelProgress() {
  return useNumericProgress({ id: "laravel", total: LARAVEL_TOTAL_DAYS, minimum: 0, legacyStorageKey: "learnwithrajan.laravel.completed", initialValues: seedLaravelCompletedDayNumbers() });
}
