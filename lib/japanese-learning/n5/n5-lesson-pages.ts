/** Data for the N5 lesson accordion drawer content. */

import { N5_VOCAB_BY_LESSON } from "@/lib/japanese-learning/n5/n5-vocab-data";

/** A string that may contain {kanji|reading} notation for furigana rendering. */
export type FuriganaString = string;

/** Localized string where only `en` is required; falls back to `en` for missing locales. */
export type L10n = string | { en: string; np?: string; jp?: string };

export type ConversationLine = {
  speaker: "A" | "B";
  japanese: FuriganaString;
  reading: string;
  english: L10n;
};

export type GrammarExample = {
  japanese: FuriganaString;
  reading: string;
  english: L10n;
  scenario: L10n;
};

export type GrammarPoint = {
  number: number;
  name: L10n;
  meaning: L10n;
  whereWeUse: L10n[];
  examples: GrammarExample[];
};

export type VocabRow = {
  sn: number;
  word: string;
  romaji: string;
  kanji?: string;
  meaning: L10n;
  example: string;
};

function buildVocab(minnaLesson: number): VocabRow[] {
  return (N5_VOCAB_BY_LESSON[minnaLesson] ?? []).map((t, idx) => {
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

export type ParticleEntry = {
  particle: string;
  romaji: string;
  name: L10n;
  meaning: L10n;
  examples: GrammarExample[];
};

export type LessonMcq = {
  question: L10n;
  choices: L10n[];
  correctIndex: number;
  explanation: L10n;
};

export type N5LessonPageData = {
  id: number;
  title: string;
  intro: L10n[];
  /** YouTube video IDs per locale. Falls back to `en` when a locale has no entry. */
  youtubeVideoId: { en: string; np?: string; jp?: string };
  /** Optional second video (Part 2) — shown as a Part 1 / Part 2 toggle in the Grammar accordion. */
  youtubeVideoIdPart2?: { np?: string; en?: string };
  youtubeTitle: string;
  conversation: ConversationLine[];
  grammar: GrammarPoint[];
  particles: ParticleEntry[];
  vocabulary: VocabRow[];
  mcqs: LessonMcq[];
};

export const N5_LESSON_PAGES: N5LessonPageData[] = [
  {
    id: 1,
    title: "Lesson 1 — じこしょうかい (Self-Introduction)",
    intro: [
      {
        en: "In this lesson you learn the most important pattern in Japanese: X は Y です — used to say who you are, where you are from, and what you do.",
        np: "यस पाठमा जापानी भाषाको सबैभन्दा महत्त्वपूर्ण Pattern सिक्नुहुनेछ: X は Y です — आफ्नो नाम, देश र पेसा बताउन प्रयोग गरिन्छ।",
      },
      {
        en: "The particle は (wa) marks the topic of the sentence, and です (desu) is the polite way to say 'is / am / are'.",
        np: "Particle は (वा) वाक्यको Topic चिन्ह गर्छ, र です (देस्) विनम्र 'हो / हुँ / छ' भन्ने अर्थ दिन्छ।",
      },
      {
        en: "Start every first meeting with はじめまして and close with どうぞよろしくおねがいします.",
        np: "पहिलो भेटमा सधैं はじめまして बाट सुरु गर्नुस् र どうぞよろしくおねがいします ले समाप्त गर्नुस्।",
      },
    ],
    youtubeVideoId: {
      en: "1JephUxTHxg",
      np: "0p55wZhPkM0",
    },
    youtubeVideoIdPart2: {
      en: "dPjxIuJZiZc",
      np: "TuKne6-DrZc",
    },
    youtubeTitle: "Minna no Nihongo · Lesson 1 — Grammar",
    conversation: [
      {
        speaker: "A",
        japanese: "はじめまして。{私|わたし}はたなかです。",
        reading: "Hajimemashite. Watashi wa Tanaka desu.",
        english: { en: "Nice to meet you. I am Tanaka.", np: "पहिलो भेट भयो। म तानाका हुँ।" },
      },
      {
        speaker: "B",
        japanese: "はじめまして。{私|わたし}はスミスです。アメリカじんです。",
        reading: "Hajimemashite. Watashi wa Sumisu desu. Amerikajin desu.",
        english: { en: "Nice to meet you. I am Smith. I am American.", np: "पहिलो भेट भयो। म स्मिथ हुँ। म अमेरिकी हुँ।" },
      },
      {
        speaker: "A",
        japanese: "スミスさんは{学生|がくせい}ですか。",
        reading: "Sumisu-san wa gakusei desu ka?",
        english: { en: "Are you a student, Smith?", np: "स्मिथजी, तपाई विद्यार्थी हुनुहुन्छ?" },
      },
      {
        speaker: "B",
        japanese: "いいえ、{学生|がくせい}じゃありません。{私|わたし}は{会社員|かいしゃいん}です。",
        reading: "Iie, gakusei ja arimasen. Watashi wa kaishain desu.",
        english: { en: "No, I am not a student. I am a company employee.", np: "होइन, म विद्यार्थी होइन। म कम्पनी कर्मचारी हुँ।" },
      },
      {
        speaker: "A",
        japanese: "そうですか。{私|わたし}は{先生|せんせい}です。",
        reading: "So desu ka. Watashi wa sensei desu.",
        english: { en: "I see. I am a teacher.", np: "अच्छा। म शिक्षक हुँ।" },
      },
      {
        speaker: "A",
        japanese: "どうぞよろしくおねがいします。",
        reading: "Dozo yoroshiku onegai shimasu.",
        english: { en: "Pleased to meet you. Please treat me well.", np: "भेट भएर खुशी लाग्यो। कृपया मलाई राम्रोसँग हेरिदिनुस्।" },
      },
    ],
    grammar: [
      {
        number: 1,
        name: { en: "N₁ は N₂ です — Identity statement", np: "N₁ は N₂ です — परिचय वाक्य" },
        meaning: {
          en: "は marks N₁ as the topic; です is the polite copula (is / am / are). The pattern X は Y です states that X IS Y — a name, nationality, or occupation.",
          np: "は ले N₁ लाई Topic बनाउछ; です विनम्र Copula हो (हो/हुँ)। X は Y です = X, Y हो — नाम, राष्ट्रियता वा पेसाको लागि। (वातासीवा … देस् = म … हुँ)",
        },
        whereWeUse: [
          { en: "Name: わたし は [name] です", np: "नाम: वातासी は [नाम] देस्" },
          { en: "Nationality: わたし は [country]じん です", np: "राष्ट्रियता: वातासी は [देश]जिन् देस्" },
          { en: "Occupation: わたし は [job] です", np: "पेसा: वातासी は [काम] देस्" },
        ],
        examples: [
          {
            japanese: "{私|わたし}はやまだです。",
            reading: "Watashi wa Yamada desu.",
            english: { en: "I am Yamada.", np: "म यामाडा हुँ।" },
            scenario: { en: "Scenario 1 — Stating your name", np: "दृश्य १ — नाम बताउने" },
          },
          {
            japanese: "{私|わたし}は{学生|がくせい}です。",
            reading: "Watashi wa gakusei desu.",
            english: { en: "I am a student.", np: "म विद्यार्थी हुँ।" },
            scenario: { en: "Scenario 2 — Stating your occupation", np: "दृश्य २ — पेसा बताउने" },
          },
          {
            japanese: "{私|わたし}は{医者|いしゃ}です。",
            reading: "Watashi wa isha desu.",
            english: { en: "I am a doctor.", np: "म डाक्टर हुँ।" },
            scenario: { en: "Scenario 3 — Another occupation", np: "दृश्य ३ — अर्को पेसा" },
          },
        ],
      },
      {
        number: 2,
        name: {
          en: "N₁ は N₂ じゃありません / ではありません — Negation",
          np: "N₁ は N₂ じゃありません / ではありません — नकारात्मक",
        },
        meaning: {
          en: "Negates an identity statement: N₁ is NOT N₂. じゃありません is conversational; ではありません is more formal. Short form: じゃないです / ではないです.",
          np: "Identity statement को नकारात्मक रूप। じゃありません बोलचालमा; ではありません औपचारिकमा। Short form: じゃないです / ではないです। (ज्या आरीमासेन् / देवा आरीमासेन् = होइन)",
        },
        whereWeUse: [
          { en: "Conversational: わたし は [N₂] じゃありません", np: "बोलचाल: वातासी は [N₂] ज्या आरीमासेन्" },
          { en: "Formal: わたし は [N₂] ではありません", np: "औपचारिक: वातासी は [N₂] देवा आरीमासेन्" },
          { en: "Short form (casual): じゃないです / ではないです", np: "Short form: ज्या नाईदेस् / देवा नाईदेस्" },
        ],
        examples: [
          {
            japanese: "{私|わたし}はたなかじゃありません。",
            reading: "Watashi wa Tanaka ja arimasen.",
            english: { en: "I am not Tanaka.", np: "म तानाका होइन।" },
            scenario: { en: "Scenario 1 — Denying your name", np: "दृश्य १ — नाम अस्वीकार" },
          },
          {
            japanese: "{私|わたし}は{学生|がくせい}じゃありません。",
            reading: "Watashi wa gakusei ja arimasen.",
            english: { en: "I am not a student.", np: "म विद्यार्थी होइन।" },
            scenario: { en: "Scenario 2 — Denying your occupation", np: "दृश्य २ — पेसा अस्वीकार" },
          },
          {
            japanese: "{私|わたし}は{医者|いしゃ}ではありません。",
            reading: "Watashi wa isha dewa arimasen.",
            english: { en: "I am not a doctor (formal).", np: "म डाक्टर होइन (औपचारिक)।" },
            scenario: { en: "Scenario 3 — Formal negation with ではありません", np: "दृश्य ३ — औपचारिक नकार" },
          },
        ],
      },
      {
        number: 3,
        name: {
          en: "さん・ちゃん・くん・さま — Honorific name suffixes",
          np: "さん・ちゃん・くん・さま — आदरसूचक Suffix",
        },
        meaning: {
          en: "Suffixes added after a person's name to show respect or affection. NEVER use them with your own name.",
          np: "व्यक्तिको नामको पछाडी जोड्ने suffix। आफ्नो नाममा कहिल्यै प्रयोग नगर्नुस्। (सान, च्यान, कुन, सामा — व्यक्तिको पछाडी 'जी' जस्तो प्रयोग गरिन्छ)",
        },
        whereWeUse: [
          { en: "さん (san) — general respect for any adult, male or female (Mr. / Ms.)", np: "さん (सान) — सबैको लागि सामान्य आदर (जी)" },
          { en: "ちゃん (chan) — affectionate, used for girls and young children", np: "ちゃん (च्यान) — केटी र बच्चाको लागि, प्रेमपूर्वक" },
          { en: "くん (kun) — for boys or male juniors / subordinates", np: "くん (कुन) — केटा वा जुनियर पुरुषको लागि" },
          { en: "さま (sama) — very formal or high-status (おうさま = king, かみさま = god)", np: "さま (सामा) — धेरै औपचारिक (राजा, भगवानको लागि)" },
        ],
        examples: [
          {
            japanese: "やまださん",
            reading: "Yamada-san",
            english: { en: "Mr. / Ms. Yamada", np: "यामाडाजी" },
            scenario: { en: "Scenario 1 — さん: general respect suffix", np: "दृश्य १ — सान: सामान्य आदर" },
          },
          {
            japanese: "きたはらちゃん",
            reading: "Kitahara-chan",
            english: { en: "Kitahara (affectionate — girl or child)", np: "किताहारा (प्रेमपूर्वक — केटी/बच्चा)" },
            scenario: { en: "Scenario 2 — ちゃん: for girls and children", np: "दृश्य २ — च्यान: केटी र बच्चाको लागि" },
          },
          {
            japanese: "きむらくん",
            reading: "Kimura-kun",
            english: { en: "Kimura (for a boy or junior male)", np: "किमुरा (केटा वा जुनियर पुरुष)" },
            scenario: { en: "Scenario 3 — くん: for boys and male juniors", np: "दृश्य ३ — कुन: केटा र जुनियरको लागि" },
          },
        ],
      },
      {
        number: 4,
        name: { en: "〜人（じん）— Nationality suffix", np: "〜人（じん）— राष्ट्रियता Suffix" },
        meaning: {
          en: "Add じん after a country name to form the word for a national of that country.",
          np: "देशको नामको पछाडी じん जोड्दा त्यो देशको नागरिक भन्ने अर्थ हुन्छ। (कुनै देशको नामको पछाडी जिन् आउदा त्यो देशको नागरिक हन्छ)",
        },
        whereWeUse: [
          { en: "[country] + じん = person from that country", np: "[देश] + じん = त्यो देशको नागरिक" },
          { en: "Use with は N です to state nationality: わたしは [country]じんです", np: "राष्ट्रियता बताउन: वातासीवा [देश]じんです" },
        ],
        examples: [
          {
            japanese: "{日本|にほん} → {日本人|にほんじん}",
            reading: "Nihon → Nihonjin",
            english: { en: "Japan → Japanese person", np: "जापान → जापानी व्यक्ति" },
            scenario: { en: "Scenario 1 — Japanese nationality", np: "दृश्य १ — जापानी राष्ट्रियता" },
          },
          {
            japanese: "ネパール → ネパール{人|じん}",
            reading: "Nepāru → Nepārujin",
            english: { en: "Nepal → Nepalese person", np: "नेपाल → नेपाली व्यक्ति" },
            scenario: { en: "Scenario 2 — Nepalese nationality", np: "दृश्य २ — नेपाली राष्ट्रियता" },
          },
          {
            japanese: "{私|わたし}はネパール{人|じん}です。",
            reading: "Watashi wa Nepārujin desu.",
            english: { en: "I am Nepalese.", np: "म नेपाली हुँ।" },
            scenario: { en: "Scenario 3 — Full sentence using じん", np: "दृश्य ३ — पूर्ण वाक्यमा じん प्रयोग" },
          },
        ],
      },
      {
        number: 5,
        name: { en: "〜か — Question particle", np: "〜か — प्रश्न Particle" },
        meaning: {
          en: "Adding か at the end of a polite statement (after です) turns it into a yes/no question. No rising intonation marker is needed in writing.",
          np: "विनम्र statement (です) को पछाडी か जोड्दा हाँ/होइन प्रश्न बन्छ। (か → आउदा Question (?) हुन्छ)",
        },
        whereWeUse: [
          { en: "Yes/no question: [statement です] + か", np: "हाँ/होइन प्रश्न: [statement です] + か" },
          { en: "Information question: だれ / なに / どこ… + ですか", np: "जानकारी प्रश्न: だれ / なに / どこ… + ですका" },
        ],
        examples: [
          {
            japanese: "あなたは{学生|がくせい}ですか。",
            reading: "Anata wa gakusei desu ka?",
            english: { en: "Are you a student?", np: "तपाई विद्यार्थी हुनुहुन्छ?" },
            scenario: { en: "Scenario 1 — Yes/no question about occupation", np: "दृश्य १ — पेसाबारे हाँ/होइन प्रश्न" },
          },
          {
            japanese: "あの{人|ひと}はだれですか。",
            reading: "Ano hito wa dare desu ka?",
            english: { en: "Who is that person?", np: "त्यो मान्छे को हो?" },
            scenario: { en: "Scenario 2 — Information question using だれ", np: "दृश्य २ — だれ प्रयोग गरी जानकारी प्रश्न" },
          },
          {
            japanese: "{私|わたし}は{学生|がくせい}です。あなたも{学生|がくせい}ですか。",
            reading: "Watashi wa gakusei desu. Anata mo gakusei desu ka?",
            english: { en: "I am a student. Are you also a student?", np: "म विद्यार्थी हुँ। तपाई पनि विद्यार्थी हुनुहुन्छ?" },
            scenario: { en: "Scenario 3 — Question following a statement", np: "दृश्य ३ — statement पछि प्रश्न" },
          },
        ],
      },
      {
        number: 6,
        name: {
          en: "あの人は だれですか / あの方は どなたですか — Who (informal vs polite)",
          np: "あの人は だれですか / あの方は どなたですか — को (साधारण / विनम्र)",
        },
        meaning: {
          en: "Both mean 'who is that person?' but at different politeness levels. だれ is everyday/informal; どなた is polite/formal. Similarly あの人 (informal) vs あの方 (polite).",
          np: "दुवैको अर्थ 'त्यो मान्छे को हो?' तर礼节अलग। だれ साधारण/अनौपचारिक; どなた विनम्र/औपचारिक। (informal मा दारे / polite formal मा दोनाता)",
        },
        whereWeUse: [
          { en: "Informal: あの人は だれですか (casual context)", np: "साधारण: あの人は だれですか (अनौपचारिक)" },
          { en: "Polite/formal: あの方は どなたですか (about a senior or respected person)", np: "विनम्र: あの方は どなたですか (वरिष्ठ व्यक्तिको बारेमा)" },
        ],
        examples: [
          {
            japanese: "あの{人|ひと}はだれですか。",
            reading: "Ano hito wa dare desu ka?",
            english: { en: "Who is that person? (informal)", np: "त्यो मान्छे को हो? (साधारण)" },
            scenario: { en: "Scenario 1 — Casual: asking who someone is", np: "दृश्य १ — अनौपचारिक: को हो सोध्ने" },
          },
          {
            japanese: "あのかたはどなたですか。",
            reading: "Ano kata wa donata desu ka?",
            english: { en: "Who is that person? (polite)", np: "त्यो व्यक्ति को हुनुहुन्छ? (विनम्र)" },
            scenario: { en: "Scenario 2 — Polite: asking about a respected person", np: "दृश्य २ — विनम्र: वरिष्ठबारे सोध्ने" },
          },
          {
            japanese: "すみません、あのかたはどなたですか。",
            reading: "Sumimasen, ano kata wa donata desu ka?",
            english: { en: "Excuse me, who is that person?", np: "माफ गर्नुस्, त्यो व्यक्ति को हुनुहुन्छ?" },
            scenario: { en: "Scenario 3 — Politely asking a third person's identity", np: "दृश्य ३ — विनम्रतापूर्वक परिचय सोध्ने" },
          },
        ],
      },
      {
        number: 7,
        name: { en: "も — Also / Too", np: "も — पनि" },
        meaning: {
          en: "も replaces は to mean 'also' or 'too'. When the same predicate applies to a second subject, swap は for も.",
          np: "も ले は लाई replace गरेर 'पनि' भन्ने अर्थ दिन्छ। जब एउटै predicate धेरै topics मा लागू हुन्छ। (कुनै पनि क्रमामा Same आउदा も प्रयोग गरिन्छ)",
        },
        whereWeUse: [
          { en: "X は Y です。Z も Y です → Z is ALSO Y", np: "X は Y です। Z も Y です → Z पनि Y हो" },
          { en: "Replace は (not other particles) with も on the added subject", np: "दोस्रो subject मा は को सट्टा も राख्ने" },
        ],
        examples: [
          {
            japanese: "{私|わたし}は{学生|がくせい}です。やまださんも{学生|がくせい}です。",
            reading: "Watashi wa gakusei desu. Yamada-san mo gakusei desu.",
            english: { en: "I am a student. Yamada is also a student.", np: "म विद्यार्थी हुँ। यामाडा पनि विद्यार्थी हो।" },
            scenario: { en: "Scenario 1 — も with same occupation", np: "दृश्य १ — एउटै पेसामा も" },
          },
          {
            japanese: "スミスさんはアメリカじんです。ジョンさんもアメリカじんです。",
            reading: "Sumisu-san wa Amerikajin desu. Jon-san mo Amerikajin desu.",
            english: { en: "Smith is American. John is also American.", np: "स्मिथ अमेरिकी हो। जोन पनि अमेरिकी हो।" },
            scenario: { en: "Scenario 2 — も with same nationality", np: "दृश्य २ — एउटै राष्ट्रियतामा も" },
          },
          {
            japanese: "たなかさんは{学生|がくせい}です。{私|わたし}も{学生|がくせい}です。",
            reading: "Tanaka-san wa gakusei desu. Watashi mo gakusei desu.",
            english: { en: "Tanaka is a student. I am also a student.", np: "तानाका विद्यार्थी हो। म पनि विद्यार्थी हुँ।" },
            scenario: { en: "Scenario 3 — も with first-person subject", np: "दृश्य ३ — पहिलो पुरुषमा も" },
          },
        ],
      },
      {
        number: 8,
        name: { en: "N₁ の N₂ — Possession / Belonging", np: "N₁ の N₂ — सम्बन्ध / अधिकार" },
        meaning: {
          en: "の connects two nouns: N₁ の N₂ means 'N₁'s N₂' or 'N₂ of N₁'. Works like the English apostrophe-s ('s).",
          np: "の ले दुई noun जोड्छ: N₁ の N₂ = N₁ को N₂। Nepali को 'को' जस्तै। (N₁ の N₂ → को)",
        },
        whereWeUse: [
          { en: "Possession: [owner] の [thing] → owner's thing", np: "अधिकार: [मालिक] の [चीज] → मालिकको चीज" },
          { en: "Affiliation: [organization] の [role] → role at that organization", np: "सम्बद्धता: [संस्था] の [पद] → संस्थाको पद" },
          { en: "Description: [category] の [item] → item from that category", np: "वर्णन: [श्रेणी] の [वस्तु]" },
        ],
        examples: [
          {
            japanese: "{私|わたし}はIMCの{医者|いしゃ}です。",
            reading: "Watashi wa IMC no isha desu.",
            english: { en: "I am a doctor at IMC.", np: "म IMC को डाक्टर हुँ।" },
            scenario: { en: "Scenario 1 — の showing affiliation (organization + role)", np: "दृश्य १ — संस्था र पद" },
          },
          {
            japanese: "{山田|やまだ}さんは{東京|とうきょう}{大学|だいがく}の{先生|せんせい}です。",
            reading: "Yamada-san wa Tokyo Daigaku no sensei desu.",
            english: { en: "Yamada is a teacher at Tokyo University.", np: "यामाडाजी Tokyo University को Teacher हुनुहुन्छ।" },
            scenario: { en: "Scenario 2 — の with institution and title", np: "दृश्य २ — संस्था र पदवी" },
          },
          {
            japanese: "これは{私|わたし}のほんです。",
            reading: "Kore wa watashi no hon desu.",
            english: { en: "This is my book.", np: "यो मेरो किताब हो।" },
            scenario: { en: "Scenario 3 — の showing personal possession", np: "दृश्य ३ — व्यक्तिगत अधिकार" },
          },
        ],
      },
      {
        number: 9,
        name: { en: "〜歳（さい）— Age counter", np: "〜歳（さい）— उमेर Counter" },
        meaning: {
          en: "さい is the counter for years of age. 何歳（なんさい）= 'how old?'. The polite/formal form is おいくつ.",
          np: "さい उमेर गन्ने counter हो। 何歳（नान्साई）= 'कति वर्ष?' भन्ने अर्थ। विनम्र रूप: おいくつ। (साई — उमेर जान्न प्रयोग गरिन्छ)",
        },
        whereWeUse: [
          { en: "Casual: なんさい ですか (How old are you?)", np: "साधारण: नान्साई देसका? (कति वर्षको हुनुहुन्छ?)" },
          { en: "Polite: おいくつ ですか (How old are you? — respectful)", np: "विनम्र: ओइकुचु देसका? (उमेर कति हो? — सम्मानजनक)" },
          { en: "Request: ねんれいを おしえてください (Please tell me your age)", np: "अनुरोध: नेनरेई ओसिएते कुवासाई (उमेर बताउनुहोस्)" },
        ],
        examples: [
          {
            japanese: "あなたはなんさいですか。",
            reading: "Anata wa nan-sai desu ka?",
            english: { en: "How old are you?", np: "तपाई कति वर्षको हुनुहुन्छ?" },
            scenario: { en: "Scenario 1 — Casual way to ask age", np: "दृश्य १ — साधारण तरिकाले उमेर सोध्ने" },
          },
          {
            japanese: "おいくつですか。",
            reading: "Oikutsu desu ka?",
            english: { en: "How old are you? (polite)", np: "उमेर कति हो? (विनम्र)" },
            scenario: { en: "Scenario 2 — Polite way to ask age", np: "दृश्य २ — विनम्र तरिकाले उमेर सोध्ने" },
          },
          {
            japanese: "{山田|やまだ}さんはいまおいくつですか。",
            reading: "Yamada-san wa ima oikutsu desu ka?",
            english: { en: "How old is Yamada now?", np: "यामाडाजी अहिले कति वर्षको हुनुभयो?" },
            scenario: { en: "Scenario 3 — Asking about someone else's age", np: "दृश्य ३ — अरुको उमेर सोध्ने" },
          },
        ],
      },
    ],
    particles: [
      {
        particle: "は",
        romaji: "wa",
        name: { en: "Topic marker", np: "Topic Marker" },
        meaning: {
          en: "Marks what the sentence is about (the topic). Does NOT mark the subject — it marks the topic. Pronounced 'wa', not 'ha'.",
          np: "वाक्यको Topic (विषय) चिन्ह गर्छ। Subject होइन — Topic हो। 'HA' नभनेर 'WA' भनिन्छ।",
        },
        examples: [
          {
            japanese: "{私|わたし}はたなかです。",
            reading: "Watashi wa Tanaka desu.",
            english: { en: "I am Tanaka. (topic = I)", np: "म तानाका हुँ। (topic = म)" },
            scenario: { en: "Stating identity", np: "पहिचान बताउने" },
          },
          {
            japanese: "スミスさんは{学生|がくせい}ですか。",
            reading: "Sumisu-san wa gakusei desu ka?",
            english: { en: "Is Smith a student? (topic = Smith)", np: "स्मिथजी विद्यार्थी हुनुहुन्छ? (topic = स्मिथजी)" },
            scenario: { en: "Topic in a question", np: "प्रश्नमा Topic" },
          },
        ],
      },
      {
        particle: "か",
        romaji: "ka",
        name: { en: "Question particle", np: "प्रश्न Particle" },
        meaning: {
          en: "Placed at the end of a polite statement (after です) to turn it into a yes/no question. No question mark needed in written Japanese.",
          np: "विनम्र statement (です) को अन्तमा जोड्दा हाँ/होइन प्रश्न बन्छ। लिखित जापानीमा '?' नलेखे हुन्छ।",
        },
        examples: [
          {
            japanese: "{学生|がくせい}ですか。",
            reading: "Gakusei desu ka?",
            english: { en: "Are you a student?", np: "तपाई विद्यार्थी हुनुहुन्छ?" },
            scenario: { en: "Yes/no question", np: "हाँ/होइन प्रश्न" },
          },
          {
            japanese: "{日本人|にほんじん}ですか。",
            reading: "Nihonjin desu ka?",
            english: { en: "Are you Japanese?", np: "तपाई जापानी हुनुहुन्छ?" },
            scenario: { en: "Nationality question", np: "राष्ट्रियता प्रश्न" },
          },
        ],
      },
      {
        particle: "も",
        romaji: "mo",
        name: { en: "Also / Too", np: "पनि" },
        meaning: {
          en: "Replaces は (never stacks on top of it) to mean 'also' or 'too'. When the same predicate applies to a second topic, use も instead of は.",
          np: "は को सट्टा राखेर 'पनि' भन्ने अर्थ दिन्छ। दोस्रो topic मा は हटाएर も राख्ने।",
        },
        examples: [
          {
            japanese: "{私|わたし}は{学生|がくせい}です。やまださんも{学生|がくせい}です。",
            reading: "Watashi wa gakusei desu. Yamada-san mo gakusei desu.",
            english: { en: "I am a student. Yamada is also a student.", np: "म विद्यार्थी हुँ। यामाडा पनि विद्यार्थी हो।" },
            scenario: { en: "Same predicate, second topic", np: "दोस्रो topic मा पनि" },
          },
          {
            japanese: "スミスさんもアメリカじんです。",
            reading: "Sumisu-san mo Amerikajin desu.",
            english: { en: "Smith is also American.", np: "स्मिथजी पनि अमेरिकी हो।" },
            scenario: { en: "Same nationality", np: "एउटै राष्ट्रियता" },
          },
        ],
      },
      {
        particle: "の",
        romaji: "no",
        name: { en: "Possession / Belonging", np: "सम्बन्ध / को" },
        meaning: {
          en: "Connects two nouns: N₁ の N₂ = N₁'s N₂. Works exactly like the Nepali 'को'. The first noun modifies or owns the second.",
          np: "दुई noun जोड्छ: N₁ の N₂ = N₁ को N₂। Nepali 'को' जस्तै काम गर्छ।",
        },
        examples: [
          {
            japanese: "{私|わたし}のほん",
            reading: "Watashi no hon",
            english: { en: "My book", np: "मेरो किताब" },
            scenario: { en: "Personal possession", np: "व्यक्तिगत अधिकार" },
          },
          {
            japanese: "{私|わたし}はIMCの{医者|いしゃ}です。",
            reading: "Watashi wa IMC no isha desu.",
            english: { en: "I am a doctor at IMC.", np: "म IMC को डाक्टर हुँ।" },
            scenario: { en: "Affiliation", np: "संस्थागत सम्बद्धता" },
          },
        ],
      },
    ],
    vocabulary: buildVocab(1),
    mcqs: [
      {
        question: { en: "Which particle marks the topic of a Japanese sentence?", np: "कुन Particle ले जापानी वाक्यको Topic चिन्ह गर्छ?" },
        choices: ["は", "が", "を", "に"],
        correctIndex: 0,
        explanation: { en: "は (wa) is the topic marker. In X は Y です, は marks X as what the sentence is about.", np: "は (वा) Topic marker हो। X は Y です मा, は ले X लाई वाक्यको विषय बनाउँछ।" },
      },
      {
        question: { en: "Fill the blank: わたし _____ たなかです。", np: "खाली ठाउँ भर्नुस्: わたし _____ たなかです।" },
        choices: ["は", "が", "を", "も"],
        correctIndex: 0,
        explanation: { en: "は marks わたし as the topic — 'As for me, I am Tanaka.'", np: "は ले わたし लाई Topic बनाउँछ — 'मको बारेमा, म तानाका हुँ।'" },
      },
      {
        question: { en: "How do you say 'I am a student' in polite Japanese?", np: "विनम्र जापानीमा 'म विद्यार्थी हुँ' कसरी भन्ने?" },
        choices: [
          "わたしはがくせいです",
          "わたしがくせいます",
          "がくせいはわたしです",
          "わたしはがくせいあります",
        ],
        correctIndex: 0,
        explanation: { en: "わたし は がくせい です = topic (I) + identity (student) + polite copula (desu).", np: "わたし は がくせい です = Topic (म) + Identity (विद्यार्थी) + विनम्र Copula (देस्)।" },
      },
      {
        question: { en: "What does はじめまして mean?", np: "はじめまして को अर्थ के हो?" },
        choices: [
          { en: "Nice to meet you", np: "पहिलो भेटमा नमस्कार" },
          { en: "Thank you very much", np: "धेरै धन्यवाद" },
          { en: "Good morning", np: "शुभ बिहानी" },
          { en: "Excuse me", np: "माफ गर्नुस्" },
        ],
        correctIndex: 0,
        explanation: { en: "はじめまして is only said when meeting someone for the FIRST time.", np: "はじめまして पहिलो पटक भेट हुँदा मात्र भनिन्छ।" },
      },
      {
        question: { en: "What is the role of です in わたしはがくせいです？", np: "わたしはがくせいです मा です को भूमिका के हो?" },
        choices: [
          { en: "Polite copula — 'is / am / are'", np: "विनम्र Copula — 'हो / हुँ / छ'" },
          { en: "Question particle", np: "प्रश्न Particle" },
          { en: "Topic marker", np: "Topic Marker" },
          { en: "Past tense marker", np: "Past tense marker" },
        ],
        correctIndex: 0,
        explanation: { en: "です is the polite form of the copula (to be). It ends polite identity statements.", np: "です Copula (हुनु) को विनम्र रूप हो। यसले विनम्र Identity statement समाप्त गर्छ।" },
      },
      {
        question: { en: "How do you turn 'がくせいです' into a yes/no question?", np: "'がくせいです' लाई हाँ/होइन प्रश्नमा कसरी बदल्ने?" },
        choices: ["がくせいですか", "がくせいですは", "かがくせいです", "がくせいかです"],
        correctIndex: 0,
        explanation: { en: "Add か at the very end after です to form a polite yes/no question.", np: "です को पछाडी か जोड्दा विनम्र हाँ/होइन प्रश्न बन्छ।" },
      },
      {
        question: { en: "Which sentence means 'Smith is American'?", np: "'स्मिथ अमेरिकी हो' भन्ने वाक्य कुन हो?" },
        choices: [
          "スミスさんはアメリカじんです",
          "スミスさんがアメリカじんですか",
          "アメリカじんはスミスさんです",
          "スミスさんはアメリカじんあります",
        ],
        correctIndex: 0,
        explanation: { en: "X は Y です = X is Y. は marks the topic (スミスさん), です links to the identity.", np: "X は Y です = X, Y हो। は ले Topic (スミスさん) चिन्ह गर्छ, です ले Identity जोड्छ।" },
      },
      {
        question: { en: "What is the kanji for 'I' (わたし)?", np: "'म' (わたし) को Kanji के हो?" },
        choices: ["私", "先", "生", "学"],
        correctIndex: 0,
        explanation: { en: "私 (わたし) means 'I' or 'me'. It is one of the first kanji introduced in N5.", np: "私 (わたし) को अर्थ 'म' हो। यो N5 मा सिकाइने पहिलो Kanji मध्येको एक हो।" },
      },
      {
        question: { en: "What does どうぞよろしくおねがいします mean?", np: "どうぞよろしくおねがいします को अर्थ के हो?" },
        choices: [
          { en: "Pleased to meet you / please treat me well", np: "भेट भएर खुशी / कृपया राम्रोसँग हेरिदिनुस्" },
          { en: "Thank you very much", np: "धेरै धन्यवाद" },
          { en: "Good evening", np: "शुभ साँझ" },
          { en: "See you later", np: "पछि भेटौंला" },
        ],
        correctIndex: 0,
        explanation: { en: "Said at the end of introductions — a polite request for a good ongoing relationship.", np: "परिचयको अन्तमा भनिन्छ — राम्रो सम्बन्धको विनम्र अनुरोध।" },
      },
      {
        question: { en: "Which kanji means 'student'?", np: "कुन Kanji को अर्थ 'विद्यार्थी' हो?" },
        choices: ["学生", "先生", "会社員", "私"],
        correctIndex: 0,
        explanation: { en: "学生 (がくせい) = 学 (study) + 生 (person / life) = student.", np: "学生 (がकसेई) = 学 (पढ्नु) + 生 (मान्छे / जीवन) = विद्यार्थी।" },
      },
    ],
  },
  {
    id: 2,
    title: "Lesson 2 — これ・それ・あれ (Demonstratives & Shopping)",
    intro: [
      {
        en: "In this lesson you learn to point at things using これ (this), それ (that), and あれ (that over there). You also learn to ask prices with いくらですか and to say whose something is using の.",
        np: "यस पाठमा वस्तु देखाउन これ (यो), それ (त्यो), अनि あれ (ऊ त्यो टाढा) सिक्नुहुनेछ। साथै いくらですか ले मूल्य सोध्न र の ले स्वामित्व बताउन पनि सिक्नुहुनेछ।",
      },
      {
        en: "The pre-noun forms この/その/あの must be followed directly by a noun — they cannot stand alone like これ/それ/あれ.",
        np: "この/その/あの ले सधैं noun अगाडि आउनु पर्छ — यिनीहरू これ/それ/あれ जस्तै एक्लै प्रयोग हुँदैनन्।",
      },
      {
        en: "Use そうです to confirm something is correct and ちがいます to politely say it is not.",
        np: "कुनै कुरा सही भएको पुष्टि गर्न そうです र नभएको भन्न ちがいます विनम्र रूपमा प्रयोग गर्नुस्।",
      },
    ],
    youtubeVideoId: {
      en: "d6UnRexUg5A",
      np: "-kqNsxOAjsU",
    },
    youtubeVideoIdPart2: {
      en: "qZ8Q5hL-ws8",
    },
    youtubeTitle: "Minna no Nihongo · Lesson 2 — Grammar",
    conversation: [
      {
        speaker: "A",
        japanese: "すみません、それはいくらですか。",
        reading: "Sumimasen, sore wa ikura desu ka?",
        english: { en: "Excuse me, how much is that?", np: "माफ गर्नुस्, त्यो कति हो?" },
      },
      {
        speaker: "B",
        japanese: "ごひゃくえんです。",
        reading: "Gohyaku-en desu.",
        english: { en: "It is five hundred yen.", np: "पाँच सय येन हो।" },
      },
      {
        speaker: "A",
        japanese: "あのかばんはいくらですか。",
        reading: "Ano kaban wa ikura desu ka?",
        english: { en: "How much is that bag over there?", np: "ऊ त्यो झोला कति हो?" },
      },
      {
        speaker: "B",
        japanese: "さんぜんえんです。",
        reading: "Sanzen-en desu.",
        english: { en: "It is three thousand yen.", np: "तीन हजार येन हो।" },
      },
      {
        speaker: "A",
        japanese: "このかさはやまださんのですか。",
        reading: "Kono kasa wa Yamada-san no desu ka?",
        english: { en: "Is this umbrella Yamada's?", np: "यो छाता यामाडाजीको हो?" },
      },
      {
        speaker: "B",
        japanese: "いいえ、ちがいます。わたしのです。",
        reading: "Iie, chigaimasu. Watashi no desu.",
        english: { en: "No, it isn't. It's mine.", np: "होइन, मेरो हो।" },
      },
    ],
    grammar: [
      {
        number: 1,
        name: { en: "これ / それ / あれ は N です", np: "यो / त्यो / ऊत्यो + N हो" },
        meaning: {
          en: "Use これ (near speaker), それ (near listener), あれ (far from both) as standalone pronouns to identify things.",
          np: "これ (वक्ताको नजिक), それ (श्रोताको नजिक), あれ (दुवैबाट टाढा) — वस्तु पहिचान गर्न standalone pronoun रूपमा प्रयोग गरिन्छ।",
        },
        whereWeUse: [
          { en: "Pointing at an object to say what it is", np: "वस्तु देखाएर के हो भन्दा" },
          { en: "Asking about something with ですか", np: "ですか ले सोध्दा" },
        ],
        examples: [
          {
            japanese: "これはほんです。",
            reading: "Kore wa hon desu.",
            english: { en: "This is a book.", np: "यो किताब हो।" },
            scenario: { en: "Object near speaker", np: "वक्ताको नजिकको वस्तु" },
          },
          {
            japanese: "それはなんですか。",
            reading: "Sore wa nan desu ka?",
            english: { en: "What is that?", np: "त्यो के हो?" },
            scenario: { en: "Asking about object near listener", np: "श्रोताको नजिकको वस्तुबारे सोध्दा" },
          },
          {
            japanese: "あれはびょういんです。",
            reading: "Are wa byōin desu.",
            english: { en: "That over there is a hospital.", np: "ऊ त्यो अस्पताल हो।" },
            scenario: { en: "Pointing at a far object", np: "टाढाको वस्तु देखाउँदा" },
          },
        ],
      },
      {
        number: 2,
        name: { en: "この / その / あの + Noun — Demonstrative adjectives", np: "この / その / あの + Noun — देखाउने Adjective" },
        meaning: {
          en: "この/その/あの attach directly before a noun to point at a specific thing. Key rule: they CANNOT stand alone — a noun must always follow. Contrast: これ/それ/あれ are standalone pronouns; この/その/あの are adjectives that need a noun.",
          np: "この/その/あの सधैं noun अगाडि राखेर त्यो विशेष वस्तु देखाउँछ। मुख्य नियम: एक्लै प्रयोग हुँदैन — पछाडि noun अनिवार्य छ। तुलना: これ/それ/あれ एक्लो Pronoun हुन्; この/その/あの Adjective हुन् — noun चाहिन्छ।",
        },
        whereWeUse: [
          { en: "この + [N] は [N] です — This [N] is [N]  (near speaker)", np: "この + [N] は [N] です — यो [N] हो (वक्ताको नजिक)" },
          { en: "その + [N] は [N] です — That [N] is [N]  (near listener)", np: "その + [N] は [N] です — त्यो [N] हो (श्रोताको नजिक)" },
          { en: "あの + [N] は [N] です — That [N] over there is [N]  (far)", np: "あの + [N] は [N] です — ऊ त्यो [N] हो (टाढा)" },
          { en: "Contrast: これはほんです (pronoun alone) vs このほんは～ (adjective + noun)", np: "तुलना: これはほんです (pronoun एक्लै) vs このほんは～ (adjective + noun)" },
        ],
        examples: [
          {
            japanese: "このほんはじしょです。",
            reading: "Kono hon wa jisho desu.",
            english: { en: "This book is a dictionary.", np: "यो किताब शब्दकोश हो।" },
            scenario: { en: "この + noun — identifying a near object", np: "この + noun — नजिकको वस्तु पहिचान" },
          },
          {
            japanese: "そのかばんはいくらですか。",
            reading: "Sono kaban wa ikura desu ka?",
            english: { en: "How much is that bag?", np: "त्यो झोला कति हो?" },
            scenario: { en: "その + noun — price inquiry for listener's object", np: "その + noun — श्रोताको वस्तुको मूल्य सोध्दा" },
          },
          {
            japanese: "あのビルはなんですか。",
            reading: "Ano biru wa nan desu ka?",
            english: { en: "What is that building over there?", np: "ऊ त्यो भवन के हो?" },
            scenario: { en: "あの + noun — asking about a far object", np: "あの + noun — टाढाको वस्तुबारे सोध्दा" },
          },
        ],
      },
      {
        number: 3,
        name: { en: "だれの N ですか — Whose N is it?", np: "को को N हो? — स्वामित्व सोध्न" },
        meaning: {
          en: "だれ (who) + の (possession marker) before a noun to ask whose something is. Answer with [person]の です.",
          np: "だれ (को) + の (स्वामित्व चिन्ह) noun अगाडि राखेर स्वामित्व सोध्न। उत्तरमा [व्यक्ति]の です।",
        },
        whereWeUse: [
          { en: "Asking whose something is", np: "कुनै वस्तु कसको हो भनी सोध्दा" },
          { en: "Answering with [person]の です", np: "[व्यक्ति]の です ले उत्तर दिँदा" },
        ],
        examples: [
          {
            japanese: "これはだれのかばんですか。",
            reading: "Kore wa dare no kaban desu ka?",
            english: { en: "Whose bag is this?", np: "यो झोला कसको हो?" },
            scenario: { en: "Asking ownership", np: "स्वामित्व सोध्दा" },
          },
          {
            japanese: "やまださんのです。",
            reading: "Yamada-san no desu.",
            english: { en: "It is Yamada's.", np: "यामाडाजीको हो।" },
            scenario: { en: "Stating ownership", np: "स्वामित्व बताउँदा" },
          },
          {
            japanese: "このとけいはだれのですか。",
            reading: "Kono tokei wa dare no desu ka?",
            english: { en: "Whose watch is this?", np: "यो घडी कसको हो?" },
            scenario: { en: "Ownership of a watch", np: "घडीको स्वामित्व" },
          },
        ],
      },
      {
        number: 4,
        name: { en: "そうです / ちがいます — Confirming or Correcting", np: "सही / गलत — पुष्टि वा सुधार" },
        meaning: {
          en: "そうです = 'That's right' (polite confirmation). ちがいます = 'That's wrong / different' (polite correction). Use instead of simple はい/いいえ when confirming facts.",
          np: "そうです = 'ठीक छ' (विनम्र पुष्टि)। ちがいます = 'होइन / फरक छ' (विनम्र सुधार)। सामान्य तथ्य पुष्टि/खण्डन गर्दा はい/いいえ को सट्टा प्रयोग।",
        },
        whereWeUse: [
          { en: "Confirming a fact someone states about an object", np: "वस्तुको बारेमा भनिएको कुरा पुष्टि गर्दा" },
          { en: "Politely correcting a wrong assumption", np: "गलत अनुमान विनम्र रूपमा सुधार्दा" },
        ],
        examples: [
          {
            japanese: "それはじしょですか。そうです。",
            reading: "Sore wa jisho desu ka? — Sō desu.",
            english: { en: "Is that a dictionary? — Yes, it is.", np: "त्यो शब्दकोश हो? — हो।" },
            scenario: { en: "Confirming identity", np: "पुष्टि गर्दा" },
          },
          {
            japanese: "これはやまださんのですか。いいえ、ちがいます。",
            reading: "Kore wa Yamada-san no desu ka? — Iie, chigaimasu.",
            english: { en: "Is this Yamada's? — No, it isn't.", np: "यो यामाडाजीको हो? — होइन।" },
            scenario: { en: "Correcting a wrong assumption", np: "गलत अनुमान सुधार्दा" },
          },
        ],
      },
      {
        number: 5,
        name: { en: "N は [person]の です — It belongs to [person]", np: "N, [व्यक्ति]को हो — स्वामित्व बताउन" },
        meaning: {
          en: "The pattern N は [person]の です shortens [person]の N です by dropping the repeated noun. Common in conversation after the context is established.",
          np: "[व्यक्ति]の N です को सट्टा noun दोहोर्याउनु पर्दैन। Context स्पष्ट भइसकेपछि कुराकानीमा यो छोटो pattern धेरै प्रयोग हुन्छ।",
        },
        whereWeUse: [
          { en: "Stating ownership without repeating the noun", np: "Noun दोहोर्याउनु नपरी स्वामित्व बताउँदा" },
          { en: "Answering だれの questions concisely", np: "だれの प्रश्नको संक्षिप्त उत्तर दिँदा" },
        ],
        examples: [
          {
            japanese: "このかさはわたしのです。",
            reading: "Kono kasa wa watashi no desu.",
            english: { en: "This umbrella is mine.", np: "यो छाता मेरो हो।" },
            scenario: { en: "Claiming ownership", np: "स्वामित्व दाबी गर्दा" },
          },
          {
            japanese: "そのペンはスミスさんのです。",
            reading: "Sono pen wa Sumisu-san no desu.",
            english: { en: "That pen is Smith's.", np: "त्यो कलम स्मिथजीको हो।" },
            scenario: { en: "Attributing ownership to another", np: "अर्कालाई स्वामित्व दिँदा" },
          },
        ],
      },
    ],
    particles: [
      {
        particle: "の",
        romaji: "no",
        name: { en: "Possession / Connection", np: "स्वामित्व / सम्बन्ध" },
        meaning: {
          en: "Connects two nouns: N₁ の N₂ = N₁'s N₂. Also used at sentence end (N は [person]の です) to mean 'it belongs to [person]' by dropping the repeated noun.",
          np: "दुई noun जोड्छ: N₁ の N₂ = N₁ को N₂। वाक्यको अन्तमा noun हटाएर N は [व्यक्ति]の です — 'त्यो [व्यक्ति]को हो' भन्न पनि प्रयोग हुन्छ।",
        },
        examples: [
          {
            japanese: "これはやまださんのかばんです。",
            reading: "Kore wa Yamada-san no kaban desu.",
            english: { en: "This is Yamada's bag.", np: "यो यामाडाजीको झोला हो।" },
            scenario: { en: "Possession with の", np: "の ले स्वामित्व" },
          },
          {
            japanese: "そのかさはわたしのです。",
            reading: "Sono kasa wa watashi no desu.",
            english: { en: "That umbrella is mine.", np: "त्यो छाता मेरो हो।" },
            scenario: { en: "Shortened possession at sentence end", np: "वाक्यको अन्तमा छोटो स्वामित्व" },
          },
        ],
      },
      {
        particle: "も",
        romaji: "mo",
        name: { en: "Also / Too", np: "पनि" },
        meaning: {
          en: "Replaces は to add the same predicate to a second topic — 'also / too'. Works with demonstratives too: これも、それも、あれも.",
          np: "は को सट्टा राखेर दोस्रो topic मा पनि उही बात लागू गर्छ। Demonstrative सँग पनि: これも、それも、あれも।",
        },
        examples: [
          {
            japanese: "これもにほんごのほんです。",
            reading: "Kore mo nihongo no hon desu.",
            english: { en: "This is also a Japanese book.", np: "यो पनि जापानी किताब हो।" },
            scenario: { en: "Also with demonstrative", np: "Demonstrative सँग 'पनि'" },
          },
          {
            japanese: "それもやまださんのですか。",
            reading: "Sore mo Yamada-san no desu ka?",
            english: { en: "Is that also Yamada's?", np: "त्यो पनि यामाडाजीको हो?" },
            scenario: { en: "Confirming additional ownership", np: "थप स्वामित्व पुष्टि" },
          },
        ],
      },
    ],
    vocabulary: buildVocab(2),
    mcqs: [
      {
        question: { en: "Which word means 'this' (near the speaker)?", np: "वक्ताको नजिकको वस्तु देखाउन कुन शब्द प्रयोग हुन्छ?" },
        choices: ["これ", "それ", "あれ", "どれ"],
        correctIndex: 0,
        explanation: { en: "これ refers to something near the speaker. それ = near listener, あれ = far from both, どれ = which one?", np: "これ ले वक्ताको नजिकको वस्तु जनाउँछ। それ = श्रोताको नजिक, あれ = दुवैबाट टाढा, どれ = कुन?" },
      },
      {
        question: { en: "Fill the blank: _____ かさはやまださんのです。(That umbrella [near you] is Yamada's.)", np: "खाली भर्नुस्: _____ かさはやまださんのです।" },
        choices: ["その", "この", "あの", "どの"],
        correctIndex: 0,
        explanation: { en: "その is the pre-noun form of それ — used for objects near the listener. この = near speaker, あの = far.", np: "その, それ को pre-noun form हो — श्रोताको नजिकको noun अगाडि। この = वक्ताको नजिक, あの = टाढा।" },
      },
      {
        question: { en: "How do you politely say 'That's wrong' in Japanese?", np: "जापानीमा विनम्र रूपमा 'होइन / गलत छ' कसरी भनिन्छ?" },
        choices: ["ちがいます", "そうです", "ありません", "いいです"],
        correctIndex: 0,
        explanation: { en: "ちがいます means 'that's different / wrong' — a polite correction. そうです is the confirmation ('that's right').", np: "ちがいます = 'फरक छ / होइन' — विनम्र सुधार। そうです = 'ठीक छ' पुष्टि।" },
      },
      {
        question: { en: "Which particle marks possession (like 'of' or ''s') in Japanese?", np: "जापानीमा स्वामित्व (को / को) जनाउने Particle कुन हो?" },
        choices: ["の", "は", "を", "に"],
        correctIndex: 0,
        explanation: { en: "の connects two nouns to show possession or relationship: わたしの = my/mine, やまださんの = Yamada's.", np: "の ले दुई noun जोड्छ: わたしの = मेरो, やまださんの = यामाडाजीको।" },
      },
      {
        question: { en: "What does いくらですか mean?", np: "いくらですか को अर्थ के हो?" },
        choices: [
          { en: "How much is it?", np: "यो कति हो?" },
          { en: "What is this?", np: "यो के हो?" },
          { en: "Where is this?", np: "यो कहाँ छ?" },
          { en: "When is this?", np: "यो कहिले हो?" },
        ],
        correctIndex: 0,
        explanation: { en: "いくら = how much (price). ですか makes it a polite question: How much is it?", np: "いくら = कति (मूल्य)। ですか ले विनम्र प्रश्न बनाउँछ: कति पर्छ?" },
      },
      {
        question: { en: "Translate: これもにほんごのほんです。", np: "अनुवाद गर्नुस्: これもにほんごのほんです।" },
        choices: [
          { en: "This is also a Japanese book.", np: "यो पनि जापानी किताब हो।" },
          { en: "This is a Japanese book.", np: "यो जापानी किताब हो।" },
          { en: "That is a Japanese book too.", np: "त्यो पनि जापानी किताब हो।" },
          { en: "This is not a Japanese book.", np: "यो जापानी किताब होइन।" },
        ],
        correctIndex: 0,
        explanation: { en: "も replaces は to mean 'also'. これも = this too. にほんごの = Japanese (language modifier).", np: "も ले は को ठाउँ लिएर 'पनि' अर्थ दिन्छ। これも = यो पनि।" },
      },
      {
        question: { en: "Which pattern do you use to say 'this umbrella is mine'?", np: "'यो छाता मेरो हो' भन्न कुन pattern प्रयोग हुन्छ?" },
        choices: [
          "このかさはわたしのです",
          "これはわたしのかさです",
          "わたしはこのかさです",
          "このかさがわたしはです",
        ],
        correctIndex: 0,
        explanation: { en: "このかさはわたしのです uses [N は person の です] — the noun (かさ) is not repeated after の because context is clear.", np: "[N は person の です] pattern — の पछि noun दोहोर्याउनु पर्दैन किनकि context स्पष्ट छ।" },
      },
      {
        question: { en: "What is the kanji for 'dictionary' (じしょ)?", np: "'शब्दकोश' (じしょ) को Kanji के हो?" },
        choices: ["辞書", "雑誌", "本", "辞典"],
        correctIndex: 0,
        explanation: { en: "辞書 (じしょ) = 辞 (words/resign) + 書 (write/book) = dictionary.", np: "辞書 (जिशो) = 辞 (शब्द) + 書 (लेख्नु/किताब) = शब्दकोश।" },
      },
      {
        question: { en: "A shopkeeper says いらっしゃいませ. What does it mean?", np: "पसलेले いらっしゃいませ भन्यो। यसको अर्थ के हो?" },
        choices: [
          { en: "Welcome (to the shop)", np: "स्वागत छ (पसलमा)" },
          { en: "Thank you very much", np: "धेरै धन्यवाद" },
          { en: "Please come again", np: "फेरि आउनुस्" },
          { en: "Excuse me", np: "माफ गर्नुस्" },
        ],
        correctIndex: 0,
        explanation: { en: "いらっしゃいませ is a formal greeting used by shop staff to welcome customers.", np: "いらっしゃいませ पसलका कर्मचारीले ग्राहकलाई स्वागत गर्न भन्ने विनम्र अभिवादन हो।" },
      },
      {
        question: { en: "Fill the blank: _____ はだれのですか。 (Whose is that over there?)", np: "खाली भर्नुस्: _____ はだれのですか। (ऊ त्यो कसको हो?)" },
        choices: ["あれ", "これ", "それ", "どれ"],
        correctIndex: 0,
        explanation: { en: "あれ = that over there (far from both speaker and listener). これ = near speaker, それ = near listener.", np: "あれ = ऊ त्यो (दुवैबाट टाढा)। これ = वक्ताको नजिक, それ = श्रोताको नजिक।" },
      },
    ],
  },
];

export function getLessonPage(id: number): N5LessonPageData | undefined {
  return N5_LESSON_PAGES.find((l) => l.id === id);
}
