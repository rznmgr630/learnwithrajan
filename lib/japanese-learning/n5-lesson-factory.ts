import type { N5LessonSpec } from "@/lib/japanese-learning/build-japanese-detail";

export const MINNA_BOOK = "Minna no Nihongo I";

export function mkLesson(
  spec: Omit<N5LessonSpec, "bookRef"> & { bookRef?: string },
): N5LessonSpec {
  return { bookRef: spec.bookRef ?? MINNA_BOOK, ...spec };
}
