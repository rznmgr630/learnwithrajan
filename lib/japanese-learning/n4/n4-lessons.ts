import type { N5LessonSpec } from "@/lib/japanese-learning/n5/build-japanese-detail";
import { JP_N4_PART1 } from "@/lib/japanese-learning/n4/n4-lessons-part1";
import { JP_N4_PART2 } from "@/lib/japanese-learning/n4/n4-lessons-part2";
import { JP_N4_PART3 } from "@/lib/japanese-learning/n4/n4-lessons-part3";
import { JP_N4_PART4 } from "@/lib/japanese-learning/n4/n4-lessons-part4";

/** All 28 N4 lesson specs — Days 1–28 (Minna II L26–50 + sprint). */
export const JP_N4_LESSON_SPECS: N5LessonSpec[] = [
  ...JP_N4_PART1, // Days 1–7  (L26–32)
  ...JP_N4_PART2, // Days 8–14 (L33–39)
  ...JP_N4_PART3, // Days 15–21 (L40–46)
  ...JP_N4_PART4, // Days 22–28 (L47–50 + sprint)
];
