/** Outline rows for the React programming syllabus (reference curriculum). */

export type ReactLessonRow = {
  title: string;
  /** Display duration when known, e.g. "5m 36s", "1h" */
  duration?: string;
};

export type ReactModuleOutline = {
  id: string;
  title: string;
  /** Total section length shown in source materials, e.g. "58m", "1h" */
  sectionDuration: string;
  lessons: ReactLessonRow[];
};
