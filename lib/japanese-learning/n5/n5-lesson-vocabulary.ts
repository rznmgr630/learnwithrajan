import { UI_STRINGS } from "@/lib/i18n/catalog";
import type { LocalizedString } from "@/lib/i18n/types";
import { N5_VOCAB_BY_LESSON, N5_VOCAB_SPRINT } from "@/lib/japanese-learning/n5/n5-vocab-data";

/** Minna-style table: S.N., rōmaji, kana, kanji (or —), meaning (EN/NP/JP), example sentence. */
export function n5VocabularyTableRows(minnaLesson: number | null, courseDay: number): LocalizedString[][] {
  const tuples =
    minnaLesson !== null ? (N5_VOCAB_BY_LESSON[minnaLesson] ?? []) : (N5_VOCAB_SPRINT[courseDay] ?? []);
  return tuples.map((t, idx) => {
    const [romaji, kana, kanji, en, np, jp, example] = t;
    return [
      String(idx + 1),
      romaji,
      kana,
      kanji.trim() === "" ? "—" : kanji,
      { en, np, jp },
      example,
    ];
  });
}

export function n5VocabularyTableHeaders(): LocalizedString[] {
  return [
    UI_STRINGS["jpDetail.vocabColSn"],
    UI_STRINGS["jpDetail.vocabColRomaji"],
    UI_STRINGS["jpDetail.vocabColKana"],
    UI_STRINGS["jpDetail.vocabColKanji"],
    UI_STRINGS["jpDetail.vocabColMeaning"],
    UI_STRINGS["jpDetail.vocabColExample"],
  ];
}

export function n5VocabularySectionTitle(): LocalizedString {
  return UI_STRINGS["jpDetail.vocabularySection"];
}

export function n5VocabularySectionCaption(ref: string): LocalizedString {
  return {
    en: `${UI_STRINGS["jpDetail.vocabularyCaption"].en} (${ref})`,
    np: `${UI_STRINGS["jpDetail.vocabularyCaption"].np} (${ref})`,
    jp: `${UI_STRINGS["jpDetail.vocabularyCaption"].jp}（${ref}）`,
  };
}
