import { JP_N5_PART1 } from "@/lib/japanese-learning/n5/n5-lessons-part1";
import { JP_N5_PART2 } from "@/lib/japanese-learning/n5/n5-lessons-part2";

/** Thirty lesson payloads aligned with `JP_N5_DAY_TITLES` / roadmap order in `japanese-n5-data.ts`. */
export const JP_N5_LESSON_SPECS = [...JP_N5_PART1, ...JP_N5_PART2];
