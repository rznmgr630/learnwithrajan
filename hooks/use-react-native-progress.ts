"use client";

import { useNumericProgress } from "@/hooks/use-numeric-progress";
import { REACT_NATIVE_TOTAL_DAYS, seedReactNativeCompletedDayNumbers } from "@/lib/react-native-learning/react-native-challenge-data";

export function useReactNativeProgress() {
  return useNumericProgress({ id: "react-native", total: REACT_NATIVE_TOTAL_DAYS, legacyStorageKey: "learnwithrajan.react-native.completed", initialValues: seedReactNativeCompletedDayNumbers() });
}
