/**
 * Curated YouTube links aligned with Minna no Nihongo lesson searches + one verified Lesson 1 clip.
 * Channels rotate visibility — replace IDs anytime with videos that match your textbook edition.
 */

export type YoutubeClip = { url: string; title: string };

/** Featured clips where stable URLs exist; otherwise use guided search links (still opens useful results). */
const MINNA_LESSON: Record<number, YoutubeClip[]> = {
  1: [
    {
      url: "https://www.youtube.com/watch?v=dPjxIuJZiZc",
      title: "Speaking practice · Minna no Nihongo · Lesson 1",
    },
    {
      url: "https://www.youtube.com/results?search_query=" + encodeURIComponent("みんなの日本語 第1課 聞く 会話"),
      title: "YouTube search · みんなの日本語 第1課 (listening & dialogue)",
    },
  ],
};

function minnaSearch(lesson: number, jpTitle: string): YoutubeClip {
  return {
    url:
      "https://www.youtube.com/results?search_query=" +
      encodeURIComponent(`みんなの日本語 第${lesson}課 ${jpTitle}`),
    title: `YouTube search · Minna Lesson ${lesson} (${jpTitle})`,
  };
}

function englishSearch(lesson: number): YoutubeClip {
  return {
    url:
      "https://www.youtube.com/results?search_query=" +
      encodeURIComponent(`Minna no Nihongo Lesson ${lesson} conversation listening`),
    title: `YouTube search · Minna Lesson ${lesson} (English query)`,
  };
}

/** Listening clips for textbook Days 1–25 that track Minna lessons — combines JP search + EN search + featured Lesson 1 clip. */
export function youtubeClipsForMinnaLesson(lesson: number): YoutubeClip[] {
  const preset = MINNA_LESSON[lesson];
  if (preset && preset.length > 0) return preset;
  return [
    minnaSearch(lesson, "会話"),
    minnaSearch(lesson, "聞く"),
    englishSearch(lesson),
  ];
}

/** JLPT N5 sprint days — listening-heavy searches without Minna lesson glue. */
export function youtubeClipsForSprintDay(day: number): YoutubeClip[] {
  const queries = [
    `JLPT N5 listening practice ${day}`,
    `JLPT N5 聴解 ${day}`,
    `Japanese beginner listening comprehension practice`,
  ];
  return queries.map((q, i) => ({
    url: "https://www.youtube.com/results?search_query=" + encodeURIComponent(q),
    title: `YouTube search · ${["Timed drill", "Japanese query", "Mixed beginner"][i]}`,
  }));
}
