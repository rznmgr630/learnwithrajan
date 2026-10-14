"use client";

import { useNumericProgress } from "@/hooks/use-numeric-progress";
import { NESTJS_TOTAL_DAYS } from "@/lib/nestjs-learning/nestjs-challenge-data";

export function useNestjsProgress() {
  return useNumericProgress({ id: "nestjs", total: NESTJS_TOTAL_DAYS, legacyStorageKey: "learnwithrajan.nestjs.completed" });
}
