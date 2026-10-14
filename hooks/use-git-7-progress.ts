"use client";

import { useNumericProgress } from "@/hooks/use-numeric-progress";
import { GIT_TOTAL_DAYS, seedGitCompletedDayNumbers } from "@/lib/git-learning/git-challenge-data";

export function useGit7Progress() {
  return useNumericProgress({ id: "git", total: GIT_TOTAL_DAYS, legacyStorageKey: "learnwithrajan.git7.completed", initialValues: seedGitCompletedDayNumbers() });
}
