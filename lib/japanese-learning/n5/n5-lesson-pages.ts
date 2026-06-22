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
  /** YouTube video IDs per locale. Falls back to `en` when a locale has no entry. */
  youtubeVideoId: { en: string; np?: string; jp?: string };
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
    youtubeVideoId: {
      en: "dPjxIuJZiZc",
      np: "0p55wZhPkM0",
    },
    youtubeTitle: "Minna no Nihongo · Lesson 1 — Grammar",
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
        name: "N₁ は N₂ です — Identity statement",
        meaning:
          "は marks N₁ as the topic; です is the polite copula (is / am / are). The full pattern X は Y です states that X IS Y — a name, nationality, or occupation. (Nepali: वातासीवा ... देस् = म ... हुँ)",
        whereWeUse: [
          "Name: わたし は [name] です",
          "Nationality: わたし は [country]じん です",
          "Occupation: わたし は [job] です",
        ],
        examples: [
          {
            japanese: "{私|わたし}はやまだです。",
            reading: "Watashi wa Yamada desu.",
            english: "I am Yamada.",
            scenario: "Scenario 1 — Stating your name",
          },
          {
            japanese: "{私|わたし}は{学生|がくせい}です。",
            reading: "Watashi wa gakusei desu.",
            english: "I am a student.",
            scenario: "Scenario 2 — Stating your occupation",
          },
          {
            japanese: "{私|わたし}は{医者|いしゃ}です。",
            reading: "Watashi wa isha desu.",
            english: "I am a doctor.",
            scenario: "Scenario 3 — Another occupation",
          },
        ],
      },
      {
        number: 2,
        name: "N₁ は N₂ じゃありません / ではありません — Negation",
        meaning:
          "Negates an identity statement: N₁ is NOT N₂. じゃありません is conversational; ではありません is more formal. Short form: じゃないです / ではないです. (Nepali: ज्या आरीमासेन् / देवा आरीमासेन् = होइन)",
        whereWeUse: [
          "Conversational: わたし は [N₂] じゃありません",
          "Formal: わたし は [N₂] ではありません",
          "Short form (casual): じゃないです / ではないです",
        ],
        examples: [
          {
            japanese: "{私|わたし}はたなかじゃありません。",
            reading: "Watashi wa Tanaka ja arimasen.",
            english: "I am not Tanaka.",
            scenario: "Scenario 1 — Denying your name",
          },
          {
            japanese: "{私|わたし}は{学生|がくせい}じゃありません。",
            reading: "Watashi wa gakusei ja arimasen.",
            english: "I am not a student.",
            scenario: "Scenario 2 — Denying your occupation",
          },
          {
            japanese: "{私|わたし}は{医者|いしゃ}じゃありません。",
            reading: "Watashi wa isha ja arimasen.",
            english: "I am not a doctor.",
            scenario: "Scenario 3 — Formal negation with ではありません",
          },
        ],
      },
      {
        number: 3,
        name: "さん・ちゃん・くん・さま — Honorific name suffixes",
        meaning:
          "Suffixes added after a person's name to show respect or affection. NEVER use them with your own name. (Nepali: सान, च्यान, कुन, सामा — व्यक्तिको पछाडी जि भन्दा प्रयोग गरिन्छ)",
        whereWeUse: [
          "さん (san) — general respect for any adult, male or female (Mr. / Ms.)",
          "ちゃん (chan) — affectionate, used for girls and young children",
          "くん (kun) — for boys or male juniors / subordinates",
          "さま (sama) — very formal or high-status (おうさま = king, かみさま = god)",
        ],
        examples: [
          {
            japanese: "やまださん",
            reading: "Yamada-san",
            english: "Mr. / Ms. Yamada",
            scenario: "Scenario 1 — さん: general respect suffix",
          },
          {
            japanese: "きたはらちゃん",
            reading: "Kitahara-chan",
            english: "Kitahara (affectionate — girl or child)",
            scenario: "Scenario 2 — ちゃん: for girls and children",
          },
          {
            japanese: "きむらくん",
            reading: "Kimura-kun",
            english: "Kimura (for a boy or junior male)",
            scenario: "Scenario 3 — くん: for boys and male juniors",
          },
        ],
      },
      {
        number: 4,
        name: "〜人（じん）— Nationality suffix",
        meaning:
          "Add じん after a country name to form the word for a national of that country. (Nepali: कुनै देशको नामको पछाडी जिन् आउदा त्यो देशको नागरिक हन्छ)",
        whereWeUse: [
          "[country] + じん = person from that country",
          "Use with は N です to state nationality: わたしは [country]じんです",
        ],
        examples: [
          {
            japanese: "{日本|にほん} → {日本人|にほんじん}",
            reading: "Nihon → Nihonjin",
            english: "Japan → Japanese person",
            scenario: "Scenario 1 — Japanese nationality",
          },
          {
            japanese: "ネパール → ネパール{人|じん}",
            reading: "Nepāru → Nepārujin",
            english: "Nepal → Nepalese person",
            scenario: "Scenario 2 — Nepalese nationality",
          },
          {
            japanese: "{私|わたし}はネパール{人|じん}です。",
            reading: "Watashi wa Nepārujin desu.",
            english: "I am Nepalese.",
            scenario: "Scenario 3 — Full sentence using じん",
          },
        ],
      },
      {
        number: 5,
        name: "〜か — Question particle",
        meaning:
          "Adding か at the end of a polite statement (after です) turns it into a yes/no question. No rising intonation marker is needed in writing. (Nepali: か → आउदा Question (?) हुन्छ)",
        whereWeUse: [
          "Yes/no question: [statement です] + か",
          "Information question: だれ / なに / どこ… + ですか",
        ],
        examples: [
          {
            japanese: "あなたは{学生|がくせい}ですか。",
            reading: "Anata wa gakusei desu ka?",
            english: "Are you a student?",
            scenario: "Scenario 1 — Yes/no question about occupation",
          },
          {
            japanese: "あの{人|ひと}はだれですか。",
            reading: "Ano hito wa dare desu ka?",
            english: "Who is that person?",
            scenario: "Scenario 2 — Information question using だれ",
          },
          {
            japanese: "{私|わたし}は{学生|がくせい}です。あなたも{学生|がくせい}ですか。",
            reading: "Watashi wa gakusei desu. Anata mo gakusei desu ka?",
            english: "I am a student. Are you also a student?",
            scenario: "Scenario 3 — Question following a statement",
          },
        ],
      },
      {
        number: 6,
        name: "あの人は だれですか / あの方は どなたですか — Who (informal vs polite)",
        meaning:
          "Both mean 'who is that person?' but at different politeness levels. だれ is everyday/informal; どなた is polite/formal. Similarly あの人 (informal) vs あの方 (polite). (Nepali: informal मा दारे / polite formal मा दोनाता)",
        whereWeUse: [
          "Informal: あの人は だれですか (casual context)",
          "Polite/formal: あの方は どなたですか (about a senior or respected person)",
        ],
        examples: [
          {
            japanese: "あの{人|ひと}はだれですか。",
            reading: "Ano hito wa dare desu ka?",
            english: "Who is that person? (informal)",
            scenario: "Scenario 1 — Casual: asking who someone is",
          },
          {
            japanese: "あのかたはどなたですか。",
            reading: "Ano kata wa donata desu ka?",
            english: "Who is that person? (polite)",
            scenario: "Scenario 2 — Polite: asking about a respected person",
          },
          {
            japanese: "すみません、あのかたはどなたですか。",
            reading: "Sumimasen, ano kata wa donata desu ka?",
            english: "Excuse me, who is that person?",
            scenario: "Scenario 3 — Politely asking a third person's identity",
          },
        ],
      },
      {
        number: 7,
        name: "も — Also / Too",
        meaning:
          "も replaces は to mean 'also' or 'too'. When the same predicate applies to a second subject, swap は for も. (Nepali: कुनै पनि क्रमामा Same आउदा も प्रयोग गरिन्छ)",
        whereWeUse: [
          "X は Y です。Z も Y です → Z is ALSO Y",
          "Replace は (not other particles) with も on the added subject",
        ],
        examples: [
          {
            japanese: "{私|わたし}は{学生|がくせい}です。やまださんも{学生|がくせい}です。",
            reading: "Watashi wa gakusei desu. Yamada-san mo gakusei desu.",
            english: "I am a student. Yamada is also a student.",
            scenario: "Scenario 1 — も with same occupation",
          },
          {
            japanese: "スミスさんはアメリカじんです。ジョンさんもアメリカじんです。",
            reading: "Sumisu-san wa Amerikajin desu. Jon-san mo Amerikajin desu.",
            english: "Smith is American. John is also American.",
            scenario: "Scenario 2 — も with same nationality",
          },
          {
            japanese: "たなかさんは{学生|がくせい}です。{私|わたし}も{学生|がくせい}です。",
            reading: "Tanaka-san wa gakusei desu. Watashi mo gakusei desu.",
            english: "Tanaka is a student. I am also a student.",
            scenario: "Scenario 3 — も with first-person subject",
          },
        ],
      },
      {
        number: 8,
        name: "N₁ の N₂ — Possession / Belonging",
        meaning:
          "の connects two nouns: N₁ の N₂ means 'N₁'s N₂' or 'N₂ of N₁'. Works like the English apostrophe-s ('s). (Nepali: N₁ の N₂（の）→ को)",
        whereWeUse: [
          "Possession: [owner] の [thing] → owner's thing",
          "Affiliation: [organization] の [role] → role at that organization",
          "Description: [category] の [item] → item from that category",
        ],
        examples: [
          {
            japanese: "{私|わたし}はIMCの{医者|いしゃ}です。",
            reading: "Watashi wa IMC no isha desu.",
            english: "I am a doctor at IMC.",
            scenario: "Scenario 1 — の showing affiliation (organization + role)",
          },
          {
            japanese: "{山田|やまだ}さんは{東京|とうきょう}{大学|だいがく}の{先生|せんせい}です。",
            reading: "Yamada-san wa Tokyo Daigaku no sensei desu.",
            english: "Yamada is a teacher at Tokyo University.",
            scenario: "Scenario 2 — の with institution and title",
          },
          {
            japanese: "これは{私|わたし}のほんです。",
            reading: "Kore wa watashi no hon desu.",
            english: "This is my book.",
            scenario: "Scenario 3 — の showing personal possession",
          },
        ],
      },
      {
        number: 9,
        name: "〜歳（さい）— Age counter",
        meaning:
          "さい is the counter for years of age. 何歳（なんさい）= 'how old?'. The polite/formal form is おいくつ. (Nepali: साई (उमेर) — उमेर जान्न प्रयोग गरिन्छ)",
        whereWeUse: [
          "Casual: なんさい ですか (How old are you?)",
          "Polite: おいくつ ですか (How old are you? — respectful)",
          "Request: ねんれいを おしえてください (Please tell me your age)",
        ],
        examples: [
          {
            japanese: "あなたはなんさいですか。",
            reading: "Anata wa nan-sai desu ka?",
            english: "How old are you?",
            scenario: "Scenario 1 — Casual way to ask age",
          },
          {
            japanese: "おいくつですか。",
            reading: "Oikutsu desu ka?",
            english: "How old are you? (polite)",
            scenario: "Scenario 2 — Polite way to ask age",
          },
          {
            japanese: "{山田|やまだ}さんはいまおいくつですか。",
            reading: "Yamada-san wa ima oikutsu desu ka?",
            english: "How old is Yamada now?",
            scenario: "Scenario 3 — Asking about someone else's age",
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
