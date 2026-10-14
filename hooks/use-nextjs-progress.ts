"use client";

import { useNumericProgress } from "@/hooks/use-numeric-progress";
import { NEXTJS_TOTAL_DAYS, seedNextjsCompletedDayNumbers } from "@/lib/nextjs-learning/nextjs-challenge-data";

export function useNextjsProgress() {
  return useNumericProgress({ id: "nextjs", total: NEXTJS_TOTAL_DAYS, legacyStorageKey: "learnwithrajan.nextjs.completed", initialValues: seedNextjsCompletedDayNumbers() });
}
