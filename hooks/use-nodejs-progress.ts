"use client";

import { useNumericProgress } from "@/hooks/use-numeric-progress";
import { NODEJS_TOTAL_DAYS, seedNodejsCompletedDayNumbers } from "@/lib/nodejs-learning/nodejs-challenge-data";

export function useNodejsProgress() {
  return useNumericProgress({ id: "nodejs", total: NODEJS_TOTAL_DAYS, minimum: 0, legacyStorageKey: "learnwithrajan.nodejs.completed", initialValues: seedNodejsCompletedDayNumbers() });
}
