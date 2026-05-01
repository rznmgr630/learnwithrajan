import type { N5LessonSpec } from "@/lib/japanese-learning/n5/build-japanese-detail";
import { JP_N3_PART1 } from "@/lib/japanese-learning/n3/n3-lessons-part1";
import { JP_N3_PART2 } from "@/lib/japanese-learning/n3/n3-lessons-part2";
import { JP_N3_PART3 } from "@/lib/japanese-learning/n3/n3-lessons-part3";
import { JP_N3_PART4 } from "@/lib/japanese-learning/n3/n3-lessons-part4";

/** All 28 N3 lesson specs — Days 1–28 (N3 Grammar topics + sprint). */
export const JP_N3_LESSON_SPECS: N5LessonSpec[] = [
  ...JP_N3_PART1, // Days 1–7  (〜てある through はずだ/べきだ)
  ...JP_N3_PART2, // Days 8–14 (そうだ/らしい through potential forms)
  ...JP_N3_PART3, // Days 15–21 (Honorifics through として/にとって)
  ...JP_N3_PART4, // Days 22–28 (によって through full mock mindset)
];
