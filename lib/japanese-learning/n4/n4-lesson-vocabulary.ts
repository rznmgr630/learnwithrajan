import { UI_STRINGS } from "@/lib/i18n/catalog";
import type { LocalizedString } from "@/lib/i18n/types";
import type { VocabRow } from "@/lib/japanese-learning/types";
import { N4_VOCAB_BY_LESSON } from "@/lib/japanese-learning/n4/n4-vocab-data";

export function n4VocabularyRows(minnaLesson: number | null): VocabRow[] {
  if (minnaLesson === null) return [];
  const tuples = N4_VOCAB_BY_LESSON[minnaLesson] ?? [];
  return tuples.map((t, idx) => {
    const [romaji, kana, kanji, en, np, jp, example] = t;
    return {
      sn: idx + 1,
      word: kana,
      romaji,
      kanji: kanji.trim() === "" ? undefined : kanji,
      meaning: { en, np, jp },
      example,
    };
  });
}

export function n4VocabularyTableRows(minnaLesson: number | null): LocalizedString[][] {
  if (minnaLesson === null) return [];
  const tuples = N4_VOCAB_BY_LESSON[minnaLesson] ?? [];
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

export function n4VocabularyTableHeaders(): LocalizedString[] {
  return [
    UI_STRINGS["jpDetail.vocabColSn"],
    UI_STRINGS["jpDetail.vocabColRomaji"],
    UI_STRINGS["jpDetail.vocabColKana"],
    UI_STRINGS["jpDetail.vocabColKanji"],
    UI_STRINGS["jpDetail.vocabColMeaning"],
    UI_STRINGS["jpDetail.vocabColExample"],
  ];
}

export function n4VocabularySectionTitle(): LocalizedString {
  return UI_STRINGS["jpDetail.vocabularySection"];
}

export function n4VocabularySectionCaption(ref: string): LocalizedString {
  return {
    en: `${UI_STRINGS["jpDetail.vocabularyCaption"].en} (${ref})`,
    np: `${UI_STRINGS["jpDetail.vocabularyCaption"].np} (${ref})`,
    jp: `${UI_STRINGS["jpDetail.vocabularyCaption"].jp}（${ref}）`,
  };
}
