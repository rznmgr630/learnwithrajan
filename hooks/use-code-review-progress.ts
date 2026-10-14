"use client";

import { useCallback, useMemo } from "react";
import { useUserProgress } from "@/hooks/use-user-progress";
import type { CodeReviewChallenge } from "@/lib/code-review/challenges";

export function useCodeReviewProgress(challenges: CodeReviewChallenge[], storageKey: string) {
  const allowedIds = useMemo(() => new Set(challenges.map((challenge) => challenge.id)), [challenges]);
  const isValid = useCallback((value: unknown): value is number => typeof value === "number" && allowedIds.has(value), [allowedIds]);
  const { values: completed, toggle: toggleCompleted } = useUserProgress<number>({
    id: storageKey.replace("learnwithrajan.code-review.", "code-review-").replace(".completed", ""),
    legacyStorageKey: storageKey,
    isValid,
  });
  return { completed, completedCount: completed.size, toggleCompleted };
}
