import type { N5LessonSpec } from "@/lib/japanese-learning/n5/build-japanese-detail";

export const MINNA_III_BOOK = "Minna no Nihongo Intermediate";

export function mkN3Lesson(
  spec: Omit<N5LessonSpec, "bookRef"> & { bookRef?: string },
): N5LessonSpec {
  return { bookRef: spec.bookRef ?? MINNA_III_BOOK, ...spec };
}
