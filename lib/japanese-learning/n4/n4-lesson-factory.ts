import type { N5LessonSpec } from "@/lib/japanese-learning/n5/build-japanese-detail";

export const MINNA_II_BOOK = "Minna no Nihongo II";

export function mkN4Lesson(
  spec: Omit<N5LessonSpec, "bookRef"> & { bookRef?: string },
): N5LessonSpec {
  return { bookRef: spec.bookRef ?? MINNA_II_BOOK, ...spec };
}
