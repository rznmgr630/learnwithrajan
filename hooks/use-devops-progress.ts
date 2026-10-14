"use client";

import { useNumericProgress } from "@/hooks/use-numeric-progress";
import { DEVOPS_TOTAL_DAYS, seedDevopsCompletedDayNumbers } from "@/lib/devops-learning/devops-challenge-data";

export function useDevopsProgress() {
  return useNumericProgress({ id: "devops", total: DEVOPS_TOTAL_DAYS, legacyStorageKey: "learnwithrajan.devops91.completed", initialValues: seedDevopsCompletedDayNumbers() });
}
