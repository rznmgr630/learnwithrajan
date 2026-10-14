"use client";

import { useNumericProgress } from "@/hooks/use-numeric-progress";
import { REACT_TOTAL_DAYS, seedReactCompletedDayNumbers } from "@/lib/react-learning/react-challenge-data";

export function useReactProgress() {
  return useNumericProgress({ id: "react", total: REACT_TOTAL_DAYS, minimum: 0, legacyStorageKey: "learnwithrajan.react.completed", initialValues: seedReactCompletedDayNumbers() });
}
