"use client";

import { useCallback, useMemo } from "react";
import { useUserProgress } from "@/hooks/use-user-progress";

type NumericProgressOptions = {
  id: string;
  total: number;
  legacyStorageKey: string;
  initialValues?: Iterable<number>;
  minimum?: number;
};

export function useNumericProgress({ id, total, legacyStorageKey, initialValues = [], minimum = 1 }: NumericProgressOptions) {
  const isValid = useCallback((value: unknown): value is number => typeof value === "number" && value >= minimum && value <= total, [minimum, total]);
  const { values: completed, toggle } = useUserProgress<number>({
    id,
    initialValues,
    legacyStorageKey,
    isValid,
  });
  const completedCount = completed.size;
  const percent = useMemo(() => Math.round((Math.min(completedCount, total) / total) * 100), [completedCount, total]);
  const isDone = useCallback((day: number) => completed.has(day), [completed]);

  return { completed, completedCount, percent, toggleDay: toggle, isDone };
}
