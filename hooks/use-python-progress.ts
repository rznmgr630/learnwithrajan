"use client";

import { useNumericProgress } from "@/hooks/use-numeric-progress";
import { PYTHON_TOTAL_DAYS } from "@/lib/python-learning/python-challenge-data";

export function usePythonProgress() {
  return useNumericProgress({ id: "python", total: PYTHON_TOTAL_DAYS, legacyStorageKey: "learnwithrajan.python.completed" });
}
