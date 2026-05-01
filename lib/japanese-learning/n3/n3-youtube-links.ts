/**
 * YouTube search links for JLPT N3 grammar lessons and sprint days.
 */

export type YoutubeClip = { url: string; title: string };

function n3GrammarSearch(lesson: number, topic: string): YoutubeClip {
  return {
    url:
      "https://www.youtube.com/results?search_query=" +
      encodeURIComponent(`JLPT N3 grammar lesson ${lesson} ${topic} Japanese`),
    title: `YouTube search · JLPT N3 Lesson ${lesson} (${topic})`,
  };
}

function n3JpSearch(lesson: number, jpTopic: string): YoutubeClip {
  return {
    url:
      "https://www.youtube.com/results?search_query=" +
      encodeURIComponent(`日本語 N3 文法 第${lesson}回 ${jpTopic}`),
    title: `YouTube search · N3文法 第${lesson}回 (${jpTopic})`,
  };
}

function n3EnglishSearch(lesson: number): YoutubeClip {
  return {
    url:
      "https://www.youtube.com/results?search_query=" +
      encodeURIComponent(`JLPT N3 grammar lesson ${lesson} conversation listening`),
    title: `YouTube search · N3 Lesson ${lesson} (English query)`,
  };
}

const LESSON_TOPICS: Record<number, string> = {
  1: "てある resulting state",
  2: "relative clauses noun modification",
  3: "のに unexpected result complaint",
  4: "ために purpose cause reason",
  5: "ように so that in order to",
  6: "conditionals と ば たら なら",
  7: "はずだ べきだ expectation obligation",
  8: "そうだ らしい ようだ appearance",
  9: "と思う と言う と聞く quoting reporting",
  10: "ながら while doing simultaneously",
  11: "あいだに うちに while before too late",
  12: "ばかり だけ しか limiting expressions",
  13: "ことがある ことにする ことになる",
  14: "potential form advanced できる contexts",
  15: "honorific お〜になる ご〜になる keigo",
  16: "humble お〜する ご〜する kenjōgo",
  17: "てもらう てあげる てくれる giving receiving",
  18: "ところ just about just finished middle of",
  19: "ば〜ほど ほど くらい extent degree",
  20: "ものだ ものの natural although",
  21: "として にとって as perspective of",
  22: "によって によっては depending due to",
  23: "ために せいで おかげで cause effect",
  24: "complex sentences combining patterns",
  25: "N3 reading strategies discourse markers",
};

const LESSON_JP_TOPICS: Record<number, string> = {
  1: "てある",
  2: "名詞修飾・関係節",
  3: "のに",
  4: "ために",
  5: "ように",
  6: "条件形 と・ば・たら・なら",
  7: "はずだ・べきだ",
  8: "そうだ・らしい・ようだ",
  9: "引用 と思う・と言う・と聞く",
  10: "ながら",
  11: "あいだに・うちに",
  12: "ばかり・だけ・しか",
  13: "ことがある・ことにする・ことになる",
  14: "可能形 できる・できない",
  15: "尊敬語 お〜になる・ご〜になる",
  16: "謙譲語 お〜する・ご〜する",
  17: "てもらう・てあげる・てくれる",
  18: "ところ",
  19: "ば〜ほど・ほど・くらい",
  20: "ものだ・ものの",
  21: "として・にとって",
  22: "によって・によっては",
  23: "ために・せいで・おかげで",
  24: "複文 複数文型の組み合わせ",
  25: "N3読解戦略",
};

/** Listening clips for N3 grammar lessons 1–25. */
export function youtubeClipsForN3Lesson(lesson: number): YoutubeClip[] {
  const topic = LESSON_TOPICS[lesson] ?? `topic ${lesson}`;
  const jpTopic = LESSON_JP_TOPICS[lesson] ?? `第${lesson}回`;
  return [
    n3GrammarSearch(lesson, topic),
    n3JpSearch(lesson, jpTopic),
    n3EnglishSearch(lesson),
  ];
}

/** N3 sprint days 26–28 — listening-heavy searches. */
export function youtubeClipsForN3SprintDay(day: number): YoutubeClip[] {
  const queries = [
    `JLPT N3 listening practice day ${day}`,
    `JLPT N3 聴解 練習 中級`,
    `Japanese intermediate N3 listening comprehension`,
    `日本語 N3 文法 復習`,
  ];
  return queries.map((q, i) => ({
    url: "https://www.youtube.com/results?search_query=" + encodeURIComponent(q),
    title: `YouTube search · ${["N3 Timed drill", "JP N3 listening", "N3 Mixed", "N3 Grammar review"][i]}`,
  }));
}
