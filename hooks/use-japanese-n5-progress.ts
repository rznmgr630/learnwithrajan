"use client";

import { useCallback } from "react";
import { useNumericProgress } from "@/hooks/use-numeric-progress";
import { useUserProgress } from "@/hooks/use-user-progress";
import { JP_TOTAL_DAYS, JP_WEEKLY_TEST_TOTAL, N5_WEEKLY_TEST_IDS, seedJapaneseN5CompletedDayNumbers } from "@/lib/japanese-learning/n5/japanese-n5-data";

const weeklyIds = new Set(N5_WEEKLY_TEST_IDS);

export function useJapaneseN5Progress() {
  const isWeeklyId = useCallback((value: unknown): value is string => typeof value === "string" && weeklyIds.has(value), []);
  const dayProgress = useNumericProgress({ id: "japanese-n5", total: JP_TOTAL_DAYS, legacyStorageKey: "learnwithrajan.japaneseN5.completed", initialValues: seedJapaneseN5CompletedDayNumbers() });
  const { values: weeklyCompleted, toggle: toggleWeeklyTest } = useUserProgress<string>({ id: "japanese-n5-weekly-tests", legacyStorageKey: "learnwithrajan.japaneseN5.weeklyTestsCompleted", isValid: isWeeklyId });
  return { ...dayProgress, weeklyCompleted, weeklyTestsCompletedCount: weeklyCompleted.size, weeklyTestTotal: JP_WEEKLY_TEST_TOTAL, toggleWeeklyTest, isWeeklyTestDone: (id: string) => weeklyCompleted.has(id) };
}
