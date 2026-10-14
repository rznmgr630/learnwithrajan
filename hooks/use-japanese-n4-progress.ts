"use client";

import { useCallback } from "react";
import { useNumericProgress } from "@/hooks/use-numeric-progress";
import { useUserProgress } from "@/hooks/use-user-progress";
import { JP_N4_TOTAL_DAYS, JP_N4_WEEKLY_TEST_TOTAL, N4_WEEKLY_TEST_IDS, seedJapaneseN4CompletedDayNumbers } from "@/lib/japanese-learning/n4/japanese-n4-data";

const weeklyIds = new Set(N4_WEEKLY_TEST_IDS);

export function useJapaneseN4Progress() {
  const isWeeklyId = useCallback((value: unknown): value is string => typeof value === "string" && weeklyIds.has(value), []);
  const dayProgress = useNumericProgress({ id: "japanese-n4", total: JP_N4_TOTAL_DAYS, legacyStorageKey: "learnwithrajan.japaneseN4.completed", initialValues: seedJapaneseN4CompletedDayNumbers() });
  const { values: weeklyCompleted, toggle: toggleWeeklyTest } = useUserProgress<string>({ id: "japanese-n4-weekly-tests", legacyStorageKey: "learnwithrajan.japaneseN4.weeklyTestsCompleted", isValid: isWeeklyId });
  return { ...dayProgress, weeklyCompleted, weeklyTestsCompletedCount: weeklyCompleted.size, weeklyTestTotal: JP_N4_WEEKLY_TEST_TOTAL, toggleWeeklyTest, isWeeklyTestDone: (id: string) => weeklyCompleted.has(id) };
}
