/** Data for the N5 lesson accordion drawer content. */

import { N5_VOCAB_BY_LESSON } from "@/lib/japanese-learning/n5/n5-vocab-data";

/** A string that may contain {kanji|reading} notation for furigana rendering. */
export type FuriganaString = string;

export type ConversationLine = {
  speaker: "A" | "B";
  japanese: FuriganaString;
  reading: string;
  english: string;
};

export type GrammarExample = {
  japanese: FuriganaString;
  reading: string;
  english: string;
  scenario: string;
};

export type GrammarPoint = {
  number: number;
  name: string;
  meaning: string;
  whereWeUse: string[];
  examples: GrammarExample[];
};

export type VocabRow = {
  sn: number;
  word: string;
  romaji: string;
  kanji?: string;
  meaning: string;
  example: string;
};

function buildVocab(minnaLesson: number): VocabRow[] {
  return (N5_VOCAB_BY_LESSON[minnaLesson] ?? []).map((t, idx) => {
    const [romaji, kana, kanji, en, , , example] = t;
    return {
      sn: idx + 1,
      word: kana,
      romaji,
      kanji: kanji.trim() === "" ? undefined : kanji,
      meaning: en,
      example,
    };
  });
}

export type LessonMcq = {
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
};

export type N5LessonPageData = {
  id: number;
  title: string;
  intro: string[];
  youtubeUrl: string;
  youtubeTitle: string;
  conversation: ConversationLine[];
  grammar: GrammarPoint[];
  vocabulary: VocabRow[];
  mcqs: LessonMcq[];
};

export const N5_LESSON_PAGES: N5LessonPageData[] = [
  {
    id: 1,
    title: "Lesson 1 — じこしょうかい (Self-Introduction)",
    intro: [
      "In this lesson you learn the most important pattern in Japanese: X は Y です — used to say who you are, where you are from, and what you do.",
      "The particle は (wa) marks the topic of the sentence, and です (desu) is the polite way to say 'is / am / are'.",
      "Start every first meeting with はじめまして and close with どうぞよろしくおねがいします.",
    ],
    youtubeUrl:
      "https://www.youtube.com/results?search_query=guruba+nepali+japanese+N5+%E3%81%AF+lesson+1",
    youtubeTitle: "Guruba Nepali — N5 Lesson 1 (YouTube search)",
    conversation: [
      {
        speaker: "A",
        japanese: "はじめまして。{私|わたし}はたなかです。",
        reading: "Hajimemashite. Watashi wa Tanaka desu.",
        english: "Nice to meet you. I am Tanaka.",
      },
      {
        speaker: "B",
        japanese: "はじめまして。{私|わたし}はスミスです。アメリカじんです。",
        reading: "Hajimemashite. Watashi wa Sumisu desu. Amerikajin desu.",
        english: "Nice to meet you. I am Smith. I am American.",
      },
      {
        speaker: "A",
        japanese: "スミスさんは{学生|がくせい}ですか。",
        reading: "Sumisu-san wa gakusei desu ka?",
        english: "Are you a student, Smith?",
      },
      {
        speaker: "B",
        japanese: "いいえ、{学生|がくせい}じゃありません。{私|わたし}は{会社員|かいしゃいん}です。",
        reading: "Iie, gakusei ja arimasen. Watashi wa kaishain desu.",
        english: "No, I am not a student. I am a company employee.",
      },
      {
        speaker: "A",
        japanese: "そうですか。{私|わたし}は{先生|せんせい}です。",
        reading: "So desu ka. Watashi wa sensei desu.",
        english: "I see. I am a teacher.",
      },
      {
        speaker: "A",
        japanese: "どうぞよろしくおねがいします。",
        reading: "Dozo yoroshiku onegai shimasu.",
        english: "Pleased to meet you. Please treat me well.",
      },
    ],
    grammar: [
      {
        number: 1,
        name: "Identity Particle — は (wa)",
        meaning:
          "は marks the TOPIC of the sentence. In identity sentences (X は Y です) it answers 'What is X?' — it can be a name, nationality, or occupation.",
        whereWeUse: [
          "Self-introduction: わたし は _____ です  (I am _____)",
          "Talking about others: [name]さん は _____ です  ([name] is _____)",
          "Yes/no questions: _____ は _____ ですか？  (Is _____ _____?)",
        ],
        examples: [
          {
            japanese: "{私|わたし}はたなかです。",
            reading: "Watashi wa Tanaka desu.",
            english: "I am Tanaka.",
            scenario: "Scenario 1 — Giving your own name (self-introduction)",
          },
          {
            japanese: "スミスさんはアメリカじんです。",
            reading: "Sumisu-san wa Amerikajin desu.",
            english: "Smith is American.",
            scenario: "Scenario 2 — Stating someone's nationality",
          },
          {
            japanese: "スミスさんは{学生|がくせい}ですか。",
            reading: "Sumisu-san wa gakusei desu ka?",
            english: "Is Smith a student?",
            scenario: "Scenario 3 — Asking about someone's occupation (yes/no question)",
          },
        ],
      },
    ],
    vocabulary: buildVocab(1),
    mcqs: [
      {
        question: "Which particle marks the topic of a Japanese sentence?",
        choices: ["は", "が", "を", "に"],
        correctIndex: 0,
        explanation:
          "は (wa) is the topic marker. In X は Y です, は marks X as what the sentence is about.",
      },
      {
        question: "Fill the blank: わたし _____ たなかです。",
        choices: ["は", "が", "を", "も"],
        correctIndex: 0,
        explanation:
          "は marks わたし as the topic — 'As for me, I am Tanaka.'",
      },
      {
        question: "How do you say 'I am a student' in polite Japanese?",
        choices: [
          "わたしはがくせいです",
          "わたしがくせいます",
          "がくせいはわたしです",
          "わたしはがくせいあります",
        ],
        correctIndex: 0,
        explanation:
          "わたし は がくせい です = topic (I) + identity (student) + polite copula (desu).",
      },
      {
        question: "What does はじめまして mean?",
        choices: ["Nice to meet you", "Thank you very much", "Good morning", "Excuse me"],
        correctIndex: 0,
        explanation:
          "はじめまして is only said when meeting someone for the FIRST time.",
      },
      {
        question: "What is the role of です in わたしはがくせいです？",
        choices: [
          "Polite copula — 'is / am / are'",
          "Question particle",
          "Topic marker",
          "Past tense marker",
        ],
        correctIndex: 0,
        explanation:
          "です is the polite form of the copula (to be). It ends polite identity statements.",
      },
      {
        question: "How do you turn 'がくせいです' into a yes/no question?",
        choices: ["がくせいですか", "がくせいですは", "かがくせいです", "がくせいかです"],
        correctIndex: 0,
        explanation:
          "Add か at the very end after です to form a polite yes/no question.",
      },
      {
        question: "Which sentence means 'Smith is American'?",
        choices: [
          "スミスさんはアメリカじんです",
          "スミスさんがアメリカじんですか",
          "アメリカじんはスミスさんです",
          "スミスさんはアメリカじんあります",
        ],
        correctIndex: 0,
        explanation:
          "X は Y です = X is Y. は marks the topic (スミスさん), です links to the identity.",
      },
      {
        question: "What is the kanji for 'I' (わたし)?",
        choices: ["私", "先", "生", "学"],
        correctIndex: 0,
        explanation:
          "私 (わたし) means 'I' or 'me'. It is one of the first kanji introduced in N5.",
      },
      {
        question: "What does どうぞよろしくおねがいします mean?",
        choices: [
          "Pleased to meet you / please treat me well",
          "Thank you very much",
          "Good evening",
          "See you later",
        ],
        correctIndex: 0,
        explanation:
          "Said at the end of introductions — a polite request for a good ongoing relationship.",
      },
      {
        question: "Which kanji means 'student'?",
        choices: ["学生", "先生", "会社員", "私"],
        correctIndex: 0,
        explanation:
          "学生 (がくせい) = 学 (study) + 生 (person / life) = student.",
      },
    ],
  },
];

export function getLessonPage(id: number): N5LessonPageData | undefined {
  return N5_LESSON_PAGES.find((l) => l.id === id);
}
