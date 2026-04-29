/**
 * Curated YouTube search links aligned with Minna no Nihongo II lessons (L26–L50).
 */

export type YoutubeClip = { url: string; title: string };

function minnaIISearch(lesson: number, jpTitle: string): YoutubeClip {
  return {
    url:
      "https://www.youtube.com/results?search_query=" +
      encodeURIComponent(`みんなの日本語 第${lesson}課 ${jpTitle}`),
    title: `YouTube search · Minna II Lesson ${lesson} (${jpTitle})`,
  };
}

function englishSearchN4(lesson: number): YoutubeClip {
  return {
    url:
      "https://www.youtube.com/results?search_query=" +
      encodeURIComponent(`Minna no Nihongo II Lesson ${lesson} conversation listening`),
    title: `YouTube search · Minna II Lesson ${lesson} (English query)`,
  };
}

/** Listening clips for Minna II Lessons 26–50. */
export function youtubeClipsForMinnaIILesson(lesson: number): YoutubeClip[] {
  return [
    minnaIISearch(lesson, "会話"),
    minnaIISearch(lesson, "聞く"),
    englishSearchN4(lesson),
    {
      url:
        "https://www.youtube.com/results?search_query=" +
        encodeURIComponent(`JLPT N4 grammar lesson ${lesson} Japanese`),
      title: `YouTube search · JLPT N4 grammar Lesson ${lesson}`,
    },
  ];
}

/** N4 sprint days 26–28 — listening-heavy searches. */
export function youtubeClipsForN4SprintDay(day: number): YoutubeClip[] {
  const queries = [
    `JLPT N4 listening practice day ${day}`,
    `JLPT N4 聴解 練習`,
    `Japanese intermediate listening comprehension N4`,
    `みんなの日本語 N4 復習`,
  ];
  return queries.map((q, i) => ({
    url: "https://www.youtube.com/results?search_query=" + encodeURIComponent(q),
    title: `YouTube search · ${["Timed drill", "JP listening", "Mixed N4", "Minna N4 review"][i]}`,
  }));
}
