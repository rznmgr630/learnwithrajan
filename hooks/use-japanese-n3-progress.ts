"use client";

import { useCallback } from "react";
import { useNumericProgress } from "@/hooks/use-numeric-progress";
import { useUserProgress } from "@/hooks/use-user-progress";
import { JP_N3_TOTAL_DAYS, JP_N3_WEEKLY_TEST_TOTAL, N3_WEEKLY_TEST_IDS, seedJapaneseN3CompletedDayNumbers } from "@/lib/japanese-learning/n3/japanese-n3-data";

const weeklyIds = new Set(N3_WEEKLY_TEST_IDS);

export function useJapaneseN3Progress() {
  const isWeeklyId = useCallback((value: unknown): value is string => typeof value === "string" && weeklyIds.has(value), []);
  const dayProgress = useNumericProgress({ id: "japanese-n3", total: JP_N3_TOTAL_DAYS, legacyStorageKey: "learnwithrajan.japaneseN3.completed", initialValues: seedJapaneseN3CompletedDayNumbers() });
  const { values: weeklyCompleted, toggle: toggleWeeklyTest } = useUserProgress<string>({ id: "japanese-n3-weekly-tests", legacyStorageKey: "learnwithrajan.japaneseN3.weeklyTestsCompleted", isValid: isWeeklyId });
  return { ...dayProgress, weeklyCompleted, weeklyTestsCompletedCount: weeklyCompleted.size, weeklyTestTotal: JP_N3_WEEKLY_TEST_TOTAL, toggleWeeklyTest, isWeeklyTestDone: (id: string) => weeklyCompleted.has(id) };
}
