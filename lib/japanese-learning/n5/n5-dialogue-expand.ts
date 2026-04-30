import type { JapaneseDialogueLine } from "@/lib/japanese-learning/types";
import { N5_MINNA_PRACTICE_TAIL, N5_SPRINT_PRACTICE_TAIL } from "@/lib/japanese-learning/n5/n5-lesson-dialogue-tails";

/** Extra classroom lines to reach 20+ turns — polite textbook tone (N4 / fallback only). */
const FILLER: JapaneseDialogueLine[] = [
  {
    speaker: "先生",
    ja: "はい、みなさん、しずかにしてください。",
    reading: "Hai, minasan, shizuka ni shite kudasai.",
    en: "OK everyone, please be quiet for a moment.",
  },
  {
    speaker: "生徒A",
    ja: "きょうのレッスンはなんですか。",
    reading: "Kyō no ressun wa nan desu ka.",
    en: "What is today’s lesson about?",
  },
  {
    speaker: "先生",
    ja: "きょうはたんごとかいわのれんしゅうです。",
    reading: "Kyō wa tango to kaiwa no renshū desu.",
    en: "Today is vocabulary and conversation practice.",
  },
  {
    speaker: "生徒B",
    ja: "ちょっとしつもんしてもいいですか。",
    reading: "Chotto shitsumon shite mo ii desu ka.",
    en: "May I ask a small question?",
  },
  { speaker: "先生", ja: "はい、どうぞ。", reading: "Hai, dōzo.", en: "Yes, go ahead." },
  {
    speaker: "生徒B",
    ja: "このことばのよみかたをもういちどおしえてください。",
    reading: "Kono kotoba no yomikata o mō ichido oshiete kudasai.",
    en: "Please teach me the reading of this word again.",
  },
  {
    speaker: "先生",
    ja: "はい、きいてください。CDをかけます。",
    reading: "Hai, kiite kudasai. Shīdī o kakemasu.",
    en: "OK, listen. I will play the CD.",
  },
  { speaker: "生徒A", ja: "はい、ききます！", reading: "Hai, kikimasu!", en: "Yes, I will listen carefully!" },
  {
    speaker: "生徒B",
    ja: "スピードがはやいですね。",
    reading: "Supīdo ga hayai desu ne.",
    en: "The speed is fast, isn’t it?",
  },
  {
    speaker: "先生",
    ja: "では、もういちど、ゆっくりききましょう。",
    reading: "Dewa, mō ichido, yukkuri kikimashō.",
    en: "Then let’s listen once more, slowly.",
  },
  {
    speaker: "生徒A",
    ja: "すこしわかりました。",
    reading: "Sukoshi wakarimashita.",
    en: "I understand a little now.",
  },
  {
    speaker: "生徒B",
    ja: "わたしはまだむずかしいです。",
    reading: "Watashi wa mada muzukashii desu.",
    en: "It is still hard for me.",
  },
  {
    speaker: "先生",
    ja: "だいじょうぶです。たくさんれんしゅうしましょう。",
    reading: "Daijōbu desu. Takusan renshū shimashō.",
    en: "It’s OK — let’s practise a lot.",
  },
  {
    speaker: "生徒A",
    ja: "ともだちとえいごではなしました。",
    reading: "Tomodachi to eigo de hanashimashita.",
    en: "I spoke with my friend in English earlier.",
  },
  {
    speaker: "生徒B",
    ja: "じゃあ、にほんごでもはなしてみましょう。",
    reading: "Jā, Nihongo demo hanashite mimashō.",
    en: "Well then let’s try speaking Japanese too.",
  },
  {
    speaker: "先生",
    ja: "いいですね。ペアになってれんしゅうしてください。",
    reading: "Ii desu ne. Pea ni natte renshū shite kudasai.",
    en: "Nice — pair up and practise, please.",
  },
  { speaker: "生徒A", ja: "はじめます。", reading: "Hajimemasu.", en: "Let’s begin." },
  {
    speaker: "生徒B",
    ja: "よろしくおねがいします。",
    reading: "Yoroshiku onegaishimasu.",
    en: "Nice to work with you.",
  },
  {
    speaker: "先生",
    ja: "じかんです。またあした。",
    reading: "Jikan desu. Mata ashita.",
    en: "That’s time for today — see you tomorrow.",
  },
  {
    speaker: "みんな",
    ja: "ありがとうございました！",
    reading: "Arigatō gozaimashita!",
    en: "Thank you very much!",
  },
  {
    speaker: "先生",
    ja: "しゅくだいはじしょのページです。",
    reading: "Shukudai wa jisho no pēji desu.",
    en: "Homework is on the textbook page we marked.",
  },
  {
    speaker: "生徒A",
    ja: "ノートにもかきます。",
    reading: "Nōto ni mo kakimasu.",
    en: "I will copy them into my notebook too.",
  },
  {
    speaker: "生徒B",
    ja: "えいじょうしょうにはないですか。",
    reading: "Eijōshō ni wa nai desu ka.",
    en: "Is it not on the whiteboard?",
  },
];

const MIN_LINES = 21;

/** Ensures every lesson script exceeds twenty lines (strict “more than 20”). */
export function ensureDialogueAtLeastTwentyLines(seed: JapaneseDialogueLine[]): JapaneseDialogueLine[] {
  if (seed.length >= MIN_LINES) return seed;
  const need = MIN_LINES - seed.length;
  return [...seed, ...FILLER.slice(0, need)];
}

/**
 * N5 only: append chapter-aligned practice lines (grammar / particles per Minna lesson)
 * instead of the shared generic classroom filler.
 */
export function buildN5DialogueLines(
  seed: JapaneseDialogueLine[],
  minnaLesson: number | null,
  courseDay: number,
): JapaneseDialogueLine[] {
  const tail =
    minnaLesson !== null
      ? (N5_MINNA_PRACTICE_TAIL[minnaLesson] ?? [])
      : (N5_SPRINT_PRACTICE_TAIL[courseDay] ?? []);
  const merged = [...seed, ...tail];
  if (merged.length >= MIN_LINES) return merged;
  const need = MIN_LINES - merged.length;
  return [...merged, ...FILLER.slice(0, need)];
}
