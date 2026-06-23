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
        japanese: "いいえ、{学生|がくせい}じゃありません。{私|わたし}は{会社員|かいしゃいん}です。IMCのしゃいんです。",
        reading: "Iie, gakusei ja arimasen. Watashi wa kaishain desu. IMC no shain desu.",
        english: { en: "No, I am not a student. I am a company employee — at IMC.", np: "होइन, म विद्यार्थी होइन। म कम्पनी कर्मचारी हुँ — IMC मा।" },
      },
      {
        speaker: "A",
        japanese: "そうですか。IMCは{日本|にほん}の{会社|かいしゃ}ですか。",
        reading: "Sō desu ka. IMC wa Nihon no kaisha desu ka?",
        english: { en: "I see. Is IMC a Japanese company?", np: "अच्छा। IMC जापानको कम्पनी हो?" },
      },
      {
        speaker: "B",
        japanese: "はい、{日本|にほん}の{会社|かいしゃ}です。たなかさんのおしごとは？",
        reading: "Hai, Nihon no kaisha desu. Tanaka-san no o-shigoto wa?",
        english: { en: "Yes, it is a Japanese company. And your job, Tanaka?", np: "हो, जापानको कम्पनी हो। तानाकाजीको काम के हो?" },
      },
      {
        speaker: "A",
        japanese: "{私|わたし}は{先生|せんせい}です。{東京大学|とうきょうだいがく}の{先生|せんせい}です。",
        reading: "Watashi wa sensei desu. Tōkyō Daigaku no sensei desu.",
        english: { en: "I am a teacher. A teacher at Tokyo University.", np: "म शिक्षक हुँ। टोकियो विश्वविद्यालयको शिक्षक हुँ।" },
      },
      {
        speaker: "B",
        japanese: "すごいですね。{私|わたし}もとうきょうです。",
        reading: "Sugoi desu ne. Watashi mo Tōkyō desu.",
        english: { en: "That's impressive. I am also in Tokyo.", np: "राम्रो छ! म पनि टोकियोमा छु।" },
      },
      {
        speaker: "A",
        japanese: "それはいいですね。どうぞよろしくおねがいします。",
        reading: "Sore wa ii desu ne. Dōzo yoroshiku onegai shimasu.",
        english: { en: "That's great. Pleased to meet you.", np: "राम्रो भयो। भेट भएर खुशी लाग्यो।" },
      },
      {
        speaker: "B",
        japanese: "こちらこそ、どうぞよろしくおねがいします。",
        reading: "Kochira koso, dōzo yoroshiku onegai shimasu.",
        english: { en: "Likewise, pleased to meet you too.", np: "मलाई पनि भेट भएर खुशी लाग्यो।" },
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
        japanese: "すみません、それはなんですか。",
        reading: "Sumimasen, sore wa nan desu ka?",
        english: { en: "Excuse me, what is that?", np: "माफ गर्नुस्, त्यो के हो?" },
      },
      {
        speaker: "B",
        japanese: "これはくつです。{日本|にほん}のです。",
        reading: "Kore wa kutsu desu. Nihon no desu.",
        english: { en: "This is shoes. They are Japanese.", np: "यो जुता हो। जापानको हो।" },
      },
      {
        speaker: "A",
        japanese: "いくらですか。",
        reading: "Ikura desu ka?",
        english: { en: "How much is it?", np: "कति पर्छ?" },
      },
      {
        speaker: "B",
        japanese: "にせんごひゃくえんです。",
        reading: "Nisen gohyaku-en desu.",
        english: { en: "It is two thousand five hundred yen.", np: "दुई हजार पाँच सय येन हो।" },
      },
      {
        speaker: "A",
        japanese: "あのかばんもいくらですか。",
        reading: "Ano kaban mo ikura desu ka?",
        english: { en: "How much is that bag over there too?", np: "ऊ त्यो झोला पनि कति हो?" },
      },
      {
        speaker: "B",
        japanese: "あれはさんぜんえんです。いいかばんですよ。",
        reading: "Are wa sanzen-en desu. Ii kaban desu yo.",
        english: { en: "That is three thousand yen. It is a nice bag.", np: "ऊ त्यो तीन हजार येन हो। राम्रो झोला हो।" },
      },
      {
        speaker: "A",
        japanese: "このかさはやまださんのですか。",
        reading: "Kono kasa wa Yamada-san no desu ka?",
        english: { en: "Is this umbrella Yamada's?", np: "यो छाता यामाडाजीको हो?" },
      },
      {
        speaker: "B",
        japanese: "いいえ、ちがいます。やまださんのじゃありません。わたしのです。",
        reading: "Iie, chigaimasu. Yamada-san no ja arimasen. Watashi no desu.",
        english: { en: "No, it isn't. It's not Yamada's. It's mine.", np: "होइन। यामाडाजीको होइन। मेरो हो।" },
      },
      {
        speaker: "A",
        japanese: "そうですか。これは{日本|にほん}のかさですか。",
        reading: "Sō desu ka. Kore wa Nihon no kasa desu ka?",
        english: { en: "I see. Is this a Japanese umbrella?", np: "अच्छा। यो जापानको छाता हो?" },
      },
      {
        speaker: "B",
        japanese: "いいえ、フランスのかさです。でも、とてもいいですよ。",
        reading: "Iie, Furansu no kasa desu. Demo, totemo ii desu yo.",
        english: { en: "No, it's a French umbrella. But it's very nice.", np: "होइन, फ्रान्सको छाता हो। तर धेरै राम्रो छ।" },
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
  {
    id: 3,
    title: "Lesson 3 — ここ・そこ・あそこ (Places, Floors & Prices)",
    intro: [
      {
        en: "In this lesson you learn place pronouns: ここ (here), そこ (there), あそこ (over there), and どこ (where?). You also learn their polite equivalents: こちら/そちら/あちら/どちら.",
        np: "यस पाठमा ठाउँ जनाउने शब्दहरू सिक्नुहुनेछ: ここ (यहाँ), そこ (त्यहाँ), あそこ (उ त्यहाँ) र どこ (कहाँ?)। यिनको विनम्र रूप: こちら/そちら/あちら/どちら पनि सिक्नुहुनेछ।",
      },
      {
        en: "You will practice asking which floor something is on (なんかいですか) and asking prices (いくらですか) in a department store setting.",
        np: "डिपार्टमेन्ट स्टोरको परिस्थितिमा कुन तल्लामा छ (なんかいですか) र कति पर्छ (いくらですか) सोध्न अभ्यास गर्नुहुनेछ।",
      },
      {
        en: "N1のN2 shows origin or ownership: 日本の車 = Japanese car. The prefix お adds politeness to nouns (お国, おなまえ).",
        np: "N1のN2 ले उत्पत्ति वा सम्बन्ध देखाउँछ: 日本の車 = जापानी गाडी। お prefix ले noun लाई विनम्र बनाउँछ (お国, おなमे)।",
      },
    ],
    youtubeVideoId: {
      en: "RqDs_jctpls",
      np: "828aTz6WxgI",
    },
    youtubeVideoIdPart2: {
      en: "bxXTb8I8IEQ",
      np: "ZmFmdRIY3J8",
    },
    youtubeTitle: "Minna no Nihongo · Lesson 3 — Grammar",
    conversation: [
      {
        speaker: "A",
        japanese: "すみません、くつうりばはなんかいですか。",
        reading: "Sumimasen, kutsu-uriba wa nan-gai desu ka?",
        english: { en: "Excuse me, what floor is the shoe department?", np: "माफ गर्नुस्, जुता बेच्ने ठाउँ कति तल्लामा छ?" },
      },
      {
        speaker: "B",
        japanese: "ごかいでございます。エレベーターはあちらでございます。",
        reading: "Go-kai de gozaimasu. Erebētā wa achira de gozaimasu.",
        english: { en: "It is on the fifth floor. The elevator is that way.", np: "पाँचौँ तल्लामा छ। एलिवेटर त्यतातिर छ।" },
      },
      {
        speaker: "A",
        japanese: "ありがとうございます。ネクタイうりばもなんかいですか。",
        reading: "Arigatō gozaimasu. Nekutai-uriba mo nan-gai desu ka?",
        english: { en: "Thank you. What floor is the necktie department too?", np: "धन्यवाद। टाई बेच्ने ठाउँ पनि कति तल्लामा छ?" },
      },
      {
        speaker: "B",
        japanese: "ネクタイはさんかいでございます。",
        reading: "Nekutai wa san-kai de gozaimasu.",
        english: { en: "Neckties are on the third floor.", np: "टाई तेस्रो तल्लामा छ।" },
      },
      {
        speaker: "A",
        japanese: "あのう、このネクタイはなんのくにのですか。",
        reading: "Anou, kono nekutai wa nan no kuni no desu ka?",
        english: { en: "Um, which country is this necktie from?", np: "इ... यो टाई कुन देशको हो?" },
      },
      {
        speaker: "B",
        japanese: "{日本|にほん}のです。とてもいいですよ。",
        reading: "Nihon no desu. Totemo ii desu yo.",
        english: { en: "It is Japanese. It is very nice.", np: "जापानको हो। धेरै राम्रो छ।" },
      },
      {
        speaker: "A",
        japanese: "そうですか。このネクタイをみせてください。",
        reading: "Sō desu ka. Kono nekutai wo misete kudasai.",
        english: { en: "I see. Please show me this necktie.", np: "अच्छा। यो टाई देखाउनुस् न।" },
      },
      {
        speaker: "B",
        japanese: "はい、どうぞ。さんぜんえんでございます。",
        reading: "Hai, dōzo. San-zen-en de gozaimasu.",
        english: { en: "Yes, here you go. It is 3,000 yen.", np: "हजुर, लिनुस्। तीन हजार येन हो।" },
      },
      {
        speaker: "A",
        japanese: "じゃ、このネクタイをください。",
        reading: "Ja, kono nekutai wo kudasai.",
        english: { en: "Then I'll take this necktie, please.", np: "ल त, यो टाई दिनुस्।" },
      },
      {
        speaker: "B",
        japanese: "ありがとうございます。またおこしくださいませ。",
        reading: "Arigatō gozaimasu. Mata o-koshi kudasaimase.",
        english: { en: "Thank you very much. Please come again.", np: "धन्यवाद। फेरि आउनुस्।" },
      },
    ],
    grammar: [
      {
        number: 1,
        name: { en: "ここ / そこ / あそこ / どこ — Place pronouns (casual)", np: "ここ / そこ / あそこ / どこ — ठाउँ जनाउने Pronoun (सामान्य)" },
        meaning: {
          en: "These words point to places. ここ = near speaker, そこ = near listener, あそこ = far from both, どこ = where? Pattern: N1 は ここ/そこ/あそこ です (N1 is here/there/over there).",
          np: "यी शब्दले ठाउँ देखाउँछन्। ここ = वक्ताको नजिक, そこ = श्रोताको नजिक, あそこ = दुवैबाट टाढा, どこ = कहाँ? Pattern: N1 は ここ/そこ/あそこ です।",
        },
        whereWeUse: [
          { en: "N1 は ここ です — N1 is here (near speaker)", np: "N1 は ここ です — N1 यहाँ छ (वक्ताको नजिक)" },
          { en: "N1 は そこ です — N1 is there (near listener)", np: "N1 は そこ です — N1 त्यहाँ छ (श्रोताको नजिक)" },
          { en: "N1 は あそこ です — N1 is over there (far)", np: "N1 は あそこ です — N1 ऊ त्यहाँ छ (टाढा)" },
          { en: "Reverse: ここ は N1 です — Here is N1", np: "उल्टो: ここ は N1 です — यहाँ N1 छ" },
        ],
        examples: [
          {
            japanese: "きょうしつはここです。",
            reading: "Kyōshitsu wa koko desu.",
            english: { en: "The classroom is here.", np: "कक्षाकोठा यहाँ छ।" },
            scenario: { en: "Pointing at nearby place", np: "नजिकको ठाउँ देखाउँदा" },
          },
          {
            japanese: "しょくどうはそこですか。",
            reading: "Shokudō wa soko desu ka?",
            english: { en: "Is the dining hall there?", np: "चमेनागृह त्यहाँ छ?" },
            scenario: { en: "Asking about a place near the listener", np: "श्रोताको नजिकको ठाउँ सोध्दा" },
          },
          {
            japanese: "うけつけはあそこです。",
            reading: "Uketsuke wa asoko desu.",
            english: { en: "The reception is over there.", np: "सोधपूछ कक्ष ऊ त्यहाँ छ।" },
            scenario: { en: "Pointing at a far place", np: "टाढाको ठाउँ देखाउँदा" },
          },
        ],
      },
      {
        number: 2,
        name: { en: "こちら / そちら / あちら / どちら — Polite direction/place words", np: "こちら / そちら / あちら / どちら — विनम्र दिशा/ठाउँ शब्द" },
        meaning: {
          en: "Polite equivalents: ここ→こちら, そこ→そちら, あそこ→あちら, どこ→どちら. Use in formal/shop settings. Also used to ask which country or company someone is from.",
          np: "विनम्र समकक्ष: ここ→こちら, そこ→そちら, あそこ→あちら, どこ→どちら। दोकान वा औपचारिक परिस्थितिमा प्रयोग गरिन्छ। कुन देश वा कम्पनीको हो भन्न पनि प्रयोग हुन्छ।",
        },
        whereWeUse: [
          { en: "Shop/office staff uses こちら/そちら/あちら instead of ここ/そこ/あそこ", np: "दोकान/कार्यालयमा ここ/そこ/あそこ को सट्टा こちら/そちら/あちら" },
          { en: "どちら ですか — Where (polite) / Which one? (choice)", np: "どちら ですか — कहाँ (विनम्र) / कुन? (छनोट)" },
          { en: "お国はどちらですか — What country are you from? (formal)", np: "お国はどちらですか — हजुर कहाँको हो? (औपचारिक)" },
        ],
        examples: [
          {
            japanese: "エレベーターはこちらでございます。",
            reading: "Erebētā wa kochira de gozaimasu.",
            english: { en: "The elevator is this way.", np: "लिफ्ट यतातिर छ।" },
            scenario: { en: "Staff directing a customer (formal)", np: "कर्मचारीले ग्राहकलाई बाटो देखाउँदा (औपचारिक)" },
          },
          {
            japanese: "お国はどちらですか。ネパールです。",
            reading: "O-kuni wa dochira desu ka? — Nepāru desu.",
            english: { en: "Where are you from? — I am from Nepal.", np: "हजुर कहाँको हो? — नेपाल हो।" },
            scenario: { en: "Asking nationality politely", np: "विनम्र रूपमा राष्ट्रियता सोध्दा" },
          },
          {
            japanese: "会社はどちらですか。",
            reading: "Kaisha wa dochira desu ka?",
            english: { en: "Which company are you with?", np: "कुन कम्पनीमा हुनुहुन्छ?" },
            scenario: { en: "Asking about someone's company politely", np: "कम्पनीबारे विनम्र रूपमा सोध्दा" },
          },
        ],
      },
      {
        number: 3,
        name: { en: "N は なんかい ですか — What floor is N?", np: "N は なんかい ですか — N कति तल्लामा छ?" },
        meaning: {
          en: "〜かい (floor counter) is used to count building floors. なんかい = which/what floor. Floors: いっかい (1F), にかい (2F), さんがい (3F), よんかい (4F), ごかい (5F), ちか (basement).",
          np: "〜かい ले भवनका तल्लाहरू गन्छ। なんかい = कति तला? तल्लाहरू: いっかい (1F), にかい (2F), さんがい (3F), よんかい (4F), ごかい (5F), ちか (भुइँतला/basement)।",
        },
        whereWeUse: [
          { en: "Asking which floor in a department store or building", np: "डिपार्टमेन्ट स्टोर वा भवनमा तल्ला सोध्दा" },
          { en: "Answering with: N は 〜かい です/でございます", np: "उत्तर: N は 〜かい です/でございます" },
        ],
        examples: [
          {
            japanese: "くつうりばはなんかいですか。ごかいでございます。",
            reading: "Kutsu-uriba wa nan-gai desu ka? — Go-kai de gozaimasu.",
            english: { en: "What floor is the shoe department? — Fifth floor.", np: "जुता बेच्ने ठाउँ कति तल्लामा? — पाँचौँ तल्लामा।" },
            scenario: { en: "Department store inquiry", np: "डिपार्टमेन्ट स्टोरमा सोध्दा" },
          },
          {
            japanese: "しょくどうはちかです。",
            reading: "Shokudō wa chika desu.",
            english: { en: "The dining hall is in the basement.", np: "चमेनागृह भुइँतलामा छ।" },
            scenario: { en: "Basement location", np: "भुइँतलाको ठेगाना" },
          },
        ],
      },
      {
        number: 4,
        name: { en: "N1 の N2 — Origin / affiliation (Country/Company + Product)", np: "N1 の N2 — उत्पत्ति / सम्बन्ध (देश/कम्पनी + वस्तु)" },
        meaning: {
          en: "の connects nouns showing origin, material, or type. Used for country-of-origin: 日本の車 (Japanese car), or company affiliation. This extends の from Lesson 2 into origin contexts.",
          np: "の ले उत्पत्ति, सामग्री वा प्रकार देखाउँदै noun जोड्छ। देश-उत्पत्तिमा: 日本の車 (जापानी गाडी), वा कम्पनी सम्बन्धमा। Lesson 2 को の को विस्तार हो।",
        },
        whereWeUse: [
          { en: "Country の product: これは 日本の 車 です", np: "देश の वस्तु: これは 日本の 車 です" },
          { en: "Company の product or person: NTCの でんわ", np: "कम्पनी の वस्तु/व्यक्ति: NTCの でんわ" },
        ],
        examples: [
          {
            japanese: "これはにほんのくるまです。",
            reading: "Kore wa Nihon no kuruma desu.",
            english: { en: "This is a Japanese car.", np: "यो जापानको गाडी हो।" },
            scenario: { en: "Country of origin", np: "उत्पत्ति देश" },
          },
          {
            japanese: "これはアメリカのくるまです。",
            reading: "Kore wa Amerika no kuruma desu.",
            english: { en: "This is an American car.", np: "यो अमेरिकाको गाडी हो।" },
            scenario: { en: "Different country of origin", np: "अर्को देशको उत्पत्ति" },
          },
          {
            japanese: "これはドイツのくつです。",
            reading: "Kore wa Doitsu no kutsu desu.",
            english: { en: "These are German shoes.", np: "यो जर्मनीको जुता हो।" },
            scenario: { en: "Product + country", np: "वस्तु + देश" },
          },
        ],
      },
      {
        number: 5,
        name: { en: "お〜 prefix — Polite / honorific nouns", np: "お〜 prefix — विनम्र/सम्मानजनक Noun" },
        meaning: {
          en: "Adding お (or ご) before a noun makes it polite/respectful. Common in formal speech and service settings. Examples: 国→お国, 名前→おなまえ, 酒→お酒. NOT used for all nouns — learn word by word.",
          np: "Noun अगाडि お (वा ご) थप्दा विनम्र/सम्मानजनक बन्छ। औपचारिक र सेवा-परिस्थितिमा सामान्य छ। उदाहरण: 国→お国, 名前→おなまえ, 酒→お酒। सबै noun मा प्रयोग हुँदैन — एक-एक गरी सिक्नुस्।",
        },
        whereWeUse: [
          { en: "Formal questions: お名前は? お国はどちら?", np: "औपचारिक प्रश्न: お名前は? お国はどちら?" },
          { en: "Service/shop staff speech: おいくらでございますか", np: "दोकान/सेवामा: おいくराでございますか" },
        ],
        examples: [
          {
            japanese: "おくにはどちらですか。",
            reading: "O-kuni wa dochira desu ka?",
            english: { en: "What country are you from? (polite)", np: "हजुर कहाँको हो? (विनम्र)" },
            scenario: { en: "Polite nationality question", np: "विनम्र राष्ट्रियता प्रश्न" },
          },
          {
            japanese: "おなまえはなんですか。",
            reading: "O-namae wa nan desu ka?",
            english: { en: "What is your name? (polite)", np: "हजुरको नाम के हो? (विनम्र)" },
            scenario: { en: "Polite name question", np: "विनम्र नाम प्रश्न" },
          },
        ],
      },
    ],
    particles: [],
    vocabulary: buildVocab(3),
    mcqs: [
      {
        question: { en: "Which word means 'here' near the speaker (casual)?", np: "वक्ताको नजिक 'यहाँ' जनाउने शब्द (सामान्य) कुन हो?" },
        choices: ["ここ", "そこ", "あそこ", "どこ"],
        correctIndex: 0,
        explanation: { en: "ここ = here (near speaker). そこ = there (near listener). あそこ = over there (far). どこ = where?", np: "ここ = यहाँ (वक्ताको नजिक)। そこ = त्यहाँ (श्रोताको नजिक)। あそこ = ऊ त्यहाँ (टाढा)। どこ = कहाँ?" },
      },
      {
        question: { en: "Which is the polite form of そこ?", np: "そこ को विनम्र रूप कुन हो?" },
        choices: ["そちら", "こちら", "あちら", "どちら"],
        correctIndex: 0,
        explanation: { en: "そちら is the polite equivalent of そこ (there, near the listener). こちら = polite ここ, あちら = polite あそこ, どちら = polite どこ.", np: "そちら, そこ को विनम्र रूप हो (त्यहाँ, श्रोताको नजिक)। こちら = ここ को विनम्र, あちら = あそこ को विनम्र, どちら = どこ को विनम्र।" },
      },
      {
        question: { en: "Fill the blank: トイレは _____ ですか。 (Where is the toilet?)", np: "खाली भर्नुस्: トイレは _____ ですか। (शौचालय कहाँ छ?)" },
        choices: ["どこ", "ここ", "どちら", "あそこ"],
        correctIndex: 0,
        explanation: { en: "どこ is the casual question word for place (where?). どちら is also correct but more polite/formal. In a simple casual question, どこ is standard.", np: "どこ ले सामान्य ठाउँ सोध्छ। どちら पनि सही छ तर बढी विनम्र। सामान्य प्रश्नमा どこ मानक हो।" },
      },
      {
        question: { en: "When do you use どちら instead of どこ?", np: "どこ को सट्टा どちら कहिले प्रयोग गर्ने?" },
        choices: [
          { en: "When asking about a company, school or country politely", np: "कम्पनी, विद्यालय वा देशको बारेमा विनम्र रूपमा सोध्दा" },
          { en: "When asking about toilet location", np: "शौचालयको ठेगाना सोध्दा" },
          { en: "When pointing at a nearby object", np: "नजिकको वस्तु देखाउँदा" },
          { en: "When counting floors in a building", np: "भवनको तल्ला गन्दा" },
        ],
        correctIndex: 0,
        explanation: { en: "どちら is used politely to ask about a person's company, school, or country of origin. It replaces どこ in formal contexts.", np: "どちら ले कम्पनी, विद्यालय वा देशको बारेमा विनम्र रूपमा सोध्छ। औपचारिक परिस्थितिमा どこ को सट्टा प्रयोग हुन्छ।" },
      },
      {
        question: { en: "What does なんかいですか mean?", np: "なんかいですか को अर्थ के हो?" },
        choices: [
          { en: "What floor is it?", np: "कति तल्लामा छ?" },
          { en: "How many people are there?", np: "कति जना छन्?" },
          { en: "How much does it cost?", np: "कति पर्छ?" },
          { en: "When does it open?", np: "कहिले खुल्छ?" },
        ],
        correctIndex: 0,
        explanation: { en: "なん (what/how many) + かい (floor counter) + ですか = What floor is it? Used in department stores and buildings.", np: "なん (के/कति) + かい (तल्ला गणना) + ですか = कति तल्लामा छ? डिपार्टमेन्ट स्टोर र भवनमा प्रयोग।" },
      },
      {
        question: { en: "How do you say 'The dining hall is in the basement'?", np: "चमेनागृह भुइँतलामा छ — कसरी भनिन्छ?" },
        choices: [
          "しょくどうはちかです",
          "しょくどうはいっかいです",
          "しょくどうはあそこです",
          "しょくどうはさんかいです",
        ],
        correctIndex: 0,
        explanation: { en: "ちか (地下) = basement. いっかい = 1st floor. あそこ = over there (not a floor). さんかい = 3rd floor.", np: "ちか (地下) = भुइँतला/basement। いっかい = पहिलो तल्ला। あそこ = ऊ त्यहाँ (तल्ला होइन)। さんかい = तेस्रो तल्ला।" },
      },
      {
        question: { en: "これはにほんのくつです — What does this sentence mean?", np: "これはにほんのくつです — यस वाक्यको अर्थ के हो?" },
        choices: [
          { en: "These are Japanese shoes.", np: "यो जापानको जुता हो।" },
          { en: "These are my shoes.", np: "यो मेरो जुता हो।" },
          { en: "Japan has shoes.", np: "जापानमा जुता छ।" },
          { en: "These shoes are expensive.", np: "यो जुता महँगो छ।" },
        ],
        correctIndex: 0,
        explanation: { en: "にほんの connects Japan (origin) to くつ (shoes): Japanese shoes. の here shows country of origin.", np: "にほんの ले जापान (उत्पत्ति) र くつ (जुता) जोड्छ: जापानको जुता। यहाँ の ले देश-उत्पत्ति देखाउँछ।" },
      },
      {
        question: { en: "What is the polite form of desu used in shops?", np: "दोकानमा प्रयोग हुने です को विनम्र रूप के हो?" },
        choices: ["でございます", "ですよ", "でしょう", "ですね"],
        correctIndex: 0,
        explanation: { en: "でございます is the very polite (humble/formal) equivalent of です, used by shop staff and in formal service contexts.", np: "でございます, です को अत्यन्त विनम्र (humble/formal) समकक्ष हो। दोकानका कर्मचारी र औपचारिक सेवामा प्रयोग हुन्छ।" },
      },
      {
        question: { en: "Which expression means 'please show me this'?", np: "'यो देखाउनुस्' भन्न कुन अभिव्यक्ति प्रयोग गरिन्छ?" },
        choices: [
          "これをみせてください",
          "これをください",
          "これはなんですか",
          "これはいくらですか",
        ],
        correctIndex: 0,
        explanation: { en: "みせてください = please show (me). をください = please give me. なんですか = what is this? いくらですか = how much?", np: "みせてください = देखाउनुस्। をください = दिनुस्। なんですか = के हो? いくらですか = कति पर्छ?" },
      },
      {
        question: { en: "How do you add polite honorific prefix to 国 (くに)?", np: "国 (くに) मा विनम्र prefix कसरी थपिन्छ?" },
        choices: ["おくに", "ごくに", "くにお", "くにさん"],
        correctIndex: 0,
        explanation: { en: "お + 国 = おくに. The prefix お is added before the noun to make it polite/respectful. Used in formal questions like おくにはどちらですか.", np: "お + 国 = おくに। Noun अगाडि お थप्दा विनम्र बन्छ। औपचारिक प्रश्नमा: おくにはどちらですか।" },
      },
    ],
  },
  {
    id: 4,
    title: "Lesson 4 — まいにち の せいかつ (Daily Routine & Time)",
    intro: [
      {
        en: "In this lesson you learn polite verb forms: V ます (present/future), V ません (negative), V ました (past), and V ませんでした (past negative). You also practice daily routine verbs like おきます (wake up), はたらきます (work), ねます (sleep).",
        np: "यस पाठमा विनम्र Verb रूपहरू सिक्नुहुनेछ: V ます (वर्तमान/भविष्य), V ません (नकार), V ました (भूत), र V ませんでした (भूत नकार)। दैनिक जीवनका Verb जस्तै おきます (उठ्छु), はたらきます (काम गर्छु), ねます (सुत्छु) पनि अभ्यास गरिन्छ।",
      },
      {
        en: "You will use the object marker を to say what you do (コーヒーをのみます), and 〜から〜まで to express time ranges (くじから ごじまで).",
        np: "Object marker を प्रयोग गरेर के गर्छौ भन्न (コーヒーをのみます), र समयको दायरा 〜から〜まで (くじから ごじまで) अभिव्यक्त गर्न सिक्नुहुनेछ।",
      },
      {
        en: "Key time words: 今 (now), 〜時/〜分/半 for clock times, 午前/午後 for AM/PM, 朝/昼/晩/夜 for parts of the day, and all seven weekdays plus 何曜日 (what day?).",
        np: "मुख्य समय शब्दहरू: 今 (अहिले), 〜時/〜分/半 घडीको समयको लागि, 午前/午後 AM/PM को लागि, 朝/昼/晩/夜 दिनका भागहरूको लागि, र सातै वारहरू सहित 何曜日 (कुन बार?)।",
      },
    ],
    youtubeVideoId: {
      en: "Y2cAUmUN1oU",
      np: "UsWFQM-0SYk",
    },
    youtubeVideoIdPart2: {
      en: "s9JtHvqO8zA",
      np: "tyP_uYY7TtM",
    },
    youtubeTitle: "Minna no Nihongo · Lesson 4 — Grammar",
    conversation: [
      {
        speaker: "A",
        japanese: "まいにちなんじにおきますか。",
        reading: "Mainichi nan-ji ni okimasu ka?",
        english: { en: "What time do you get up every day?", np: "हजुर हरेक दिन कति बजे उठ्नुहुन्छ?" },
      },
      {
        speaker: "B",
        japanese: "しちじにおきます。そして、はちじからしごとをします。",
        reading: "Shichi-ji ni okimasu. Soshite, hachi-ji kara shigoto wo shimasu.",
        english: { en: "I get up at 7. Then I work from 8 o'clock.", np: "सात बजे उठ्छु। अनि आठ बजेदेखि काम गर्छु।" },
      },
      {
        speaker: "A",
        japanese: "しごとはなんじにおわりますか。",
        reading: "Shigoto wa nan-ji ni owarimasu ka?",
        english: { en: "What time does work finish?", np: "काम कति बजे सकिन्छ?" },
      },
      {
        speaker: "B",
        japanese: "ごじにおわります。きのうはろくじにおわりました。たいへんでしたね。",
        reading: "Go-ji ni owarimasu. Kinō wa roku-ji ni owarimashita. Taihen deshita ne.",
        english: { en: "It finishes at 5. Yesterday it finished at 6. That was tough.", np: "पाँच बजे सकिन्छ। हिजो छ बजे सकियो। गाह्रो थियो हगी।" },
      },
      {
        speaker: "A",
        japanese: "きのうはなにをしましたか。",
        reading: "Kinō wa nani wo shimashita ka?",
        english: { en: "What did you do yesterday?", np: "हिजो के गर्नुभयो?" },
      },
      {
        speaker: "B",
        japanese: "{図書館|としょかん}でにほんごをべんきょうしました。",
        reading: "Toshokan de Nihongo wo benkyō shimashita.",
        english: { en: "I studied Japanese at the library.", np: "पुस्तकालयमा जापानिज पढें।" },
      },
      {
        speaker: "A",
        japanese: "そうですか。よるはなにをしますか。",
        reading: "Sō desu ka. Yoru wa nani wo shimasu ka?",
        english: { en: "I see. What do you do in the evening?", np: "अच्छा। बेलुका के गर्नुहुन्छ?" },
      },
      {
        speaker: "B",
        japanese: "テレビをみます。そして、じゅうにじごろねます。",
        reading: "Terebi wo mimasu. Soshite, jūni-ji goro nemasu.",
        english: { en: "I watch TV. Then I sleep around midnight.", np: "टिभी हेर्छु। अनि बाह्र बजेतिर सुत्छु।" },
      },
      {
        speaker: "A",
        japanese: "{私|わたし}はまいにちはちじにねます。あしたもはたらきますか。",
        reading: "Watashi wa mainichi hachi-ji ni nemasu. Ashita mo hatarakimasu ka?",
        english: { en: "I sleep at 8 every day. Do you work tomorrow too?", np: "म हरेक दिन आठ बजे सुत्छु। भोलि पनि काम गर्नुहुन्छ?" },
      },
      {
        speaker: "B",
        japanese: "はい、はたらきます。げつようびからきんようびまではたらきます。",
        reading: "Hai, hatarakimasu. Getsu-yōbi kara kin-yōbi made hatarakimasu.",
        english: { en: "Yes, I do. I work from Monday to Friday.", np: "हो, काम गर्छु। सोमबारदेखि शुक्रबारसम्म काम गर्छु।" },
      },
    ],
    grammar: [
      {
        number: 1,
        name: { en: "V ます — Polite non-past (present / future)", np: "V ます — विनम्र वर्तमान/भविष्य" },
        meaning: {
          en: "ます is the polite ending for verbs in present or future tense. It expresses habits (I drink coffee every day) and intentions (I will study tomorrow). Pattern: [verb stem] + ます.",
          np: "ます विनम्र Verb को वर्तमान वा भविष्य काल हो। बानी (हरेक दिन कफी पिउँछु) र इरादा (भोलि पढ्छु) दुवैमा प्रयोग हुन्छ। Pattern: [verb stem] + ます।",
        },
        whereWeUse: [
          { en: "Daily habits: まいにち コーヒーをのみます — I drink coffee every day", np: "दैनिक बानी: まいにち コーヒーをのみます — हरेक दिन कफी पिउँछु" },
          { en: "Future plans: あした としょかんにいきます — I will go to the library tomorrow", np: "भविष्य योजना: あした としょかんにいきます — भोलि पुस्तकालय जान्छु" },
          { en: "Negative: V ません — I don't / won't …", np: "नकार: V ません — गर्दिनँ / जाँदिनँ…" },
        ],
        examples: [
          {
            japanese: "まいあさろくじにおきます。",
            reading: "Mai-asa roku-ji ni okimasu.",
            english: { en: "I wake up at six every morning.", np: "हरेक बिहान छ बजे उठ्छु।" },
            scenario: { en: "Daily morning routine", np: "दैनिक बिहानको दिनचर्या" },
          },
          {
            japanese: "あしたはたらきません。やすみです。",
            reading: "Ashita hatarakimasen. Yasumi desu.",
            english: { en: "I won't work tomorrow. It's a day off.", np: "भोलि काम गर्दिनँ। बिदा छ।" },
            scenario: { en: "Negative — day off", np: "नकार — बिदाको दिन" },
          },
          {
            japanese: "きょうとしょかんでべんきょうします。",
            reading: "Kyō toshokan de benkyō shimasu.",
            english: { en: "Today I will study at the library.", np: "आज पुस्तकालयमा पढ्छु।" },
            scenario: { en: "Today's plan", np: "आजको योजना" },
          },
        ],
      },
      {
        number: 2,
        name: { en: "V ました / V ませんでした — Polite past", np: "V ました / V ませんでした — विनम्र भूतकाल" },
        meaning: {
          en: "ました is the polite past tense (did). ませんでした is the polite past negative (did not). Use these to talk about completed actions yesterday, last week, etc.",
          np: "ました विनम्र भूतकाल हो (गरे/गयौँ)। ませんでした विनम्र भूत नकार हो (गरिनँ)। हिजो, गत हप्ता आदिका सम्पन्न कार्यहरूको लागि प्रयोग गर्नुस्।",
        },
        whereWeUse: [
          { en: "きのう テレビをみました — I watched TV yesterday", np: "きのう テレビをみました — हिजो टिभी हेरें" },
          { en: "おととい べんきょうしませんでした — I didn't study the day before yesterday", np: "おととい べんきょうしませんでした — अस्ती पढिनँ" },
          { en: "〜ましたか — Did you …? (past question)", np: "〜ましたか — गर्नुभयो? (भूत प्रश्न)" },
        ],
        examples: [
          {
            japanese: "きのうきんこうにいきました。",
            reading: "Kinō ginkō ni ikimashita.",
            english: { en: "I went to the bank yesterday.", np: "हिजो बैंक गएँ।" },
            scenario: { en: "Past action — yesterday", np: "भूत कार्य — हिजो" },
          },
          {
            japanese: "おとといはやすみませんでした。",
            reading: "Ototoi wa yasumimasen deshita.",
            english: { en: "I didn't rest the day before yesterday.", np: "अस्ती आराम गरिनँ।" },
            scenario: { en: "Past negative", np: "भूत नकार" },
          },
          {
            japanese: "きのうべんきょうしましたか。はい、としょかんでしました。",
            reading: "Kinō benkyō shimashita ka? — Hai, toshokan de shimashita.",
            english: { en: "Did you study yesterday? — Yes, I did it at the library.", np: "हिजो पढ्नुभयो? — हो, पुस्तकालयमा पढें।" },
            scenario: { en: "Past question and answer", np: "भूत प्रश्न र उत्तर" },
          },
        ],
      },
      {
        number: 3,
        name: { en: "〜から 〜まで — From ~ to / until ~", np: "〜から 〜まで — देखि ~ सम्म" },
        meaning: {
          en: "から marks the starting point (from), まで marks the end point (to / until). Use with time or place. They can be used together or separately.",
          np: "から ले सुरु बिन्दु (देखि) चिन्हित गर्छ, まで ले अन्त बिन्दु (सम्म) चिन्हित गर्छ। समय वा ठाउँसँग प्रयोग हुन्छ। सँगै वा अलग-अलग प्रयोग गर्न सकिन्छ।",
        },
        whereWeUse: [
          { en: "くじから ごじまで はたらきます — I work from 9 to 5", np: "くじから ごじまで はたらきます — नौ बजेदेखि पाँच बजेसम्म काम गर्छु" },
          { en: "から alone: くじから しごとを します — work starts from 9", np: "から मात्र: くじから しごとをします — नौ बजेदेखि काम सुरु हुन्छ" },
          { en: "まで alone: ごじまで べんきょうします — study until 5", np: "まで मात्र: ごじまで べんきょうします — पाँच बजेसम्म पढ्छु" },
        ],
        examples: [
          {
            japanese: "くじからごじまではたらきます。",
            reading: "Ku-ji kara go-ji made hatarakimasu.",
            english: { en: "I work from 9 to 5.", np: "नौ बजेदेखि पाँच बजेसम्म काम गर्छु।" },
            scenario: { en: "Work hours", np: "कामको समय" },
          },
          {
            japanese: "げつようびからきんようびまでしごとをします。",
            reading: "Getsu-yōbi kara kin-yōbi made shigoto wo shimasu.",
            english: { en: "I work from Monday to Friday.", np: "सोमबारदेखि शुक्रबारसम्म काम गर्छु।" },
            scenario: { en: "Weekly work schedule", np: "साताको काम तालिका" },
          },
          {
            japanese: "ごごじゅうじまでべんきょうしました。",
            reading: "Gogo jū-ji made benkyō shimashita.",
            english: { en: "I studied until 10 PM.", np: "रात दश बजेसम्म पढें।" },
            scenario: { en: "Study until a time (past)", np: "एक समयसम्म पढाइ (भूत)" },
          },
        ],
      },
    ],
    particles: [
      {
        particle: "に",
        romaji: "ni",
        name: { en: "に — Time / target marker", np: "に — समय / लक्ष्य marker" },
        meaning: {
          en: "に marks the specific time an action occurs (at 7 o'clock, on Tuesday) and the target/destination of movement. For time: [time] に [verb]. Days and clock times require に; まいにち, きょう, あした do NOT take に.",
          np: "に ले कार्य हुने सटीक समय (सात बजे, मंगलबार) र गन्तव्य चिन्हित गर्छ। समयको लागि: [समय] に [verb]। दिन र घडीको समयमा に चाहिन्छ; तर まいにち, きょう, あした मा に लाग्दैन।",
        },
        examples: [
          {
            japanese: "しちじにおきます。",
            reading: "Shichi-ji ni okimasu.",
            english: { en: "I get up at 7 o'clock.", np: "सात बजे उठ्छु।" },
            scenario: { en: "Clock time + に", np: "घडीको समय + に" },
          },
          {
            japanese: "かようびにやすみます。",
            reading: "Kayōbi ni yasumimasu.",
            english: { en: "I rest on Tuesday.", np: "मंगलबार आराम गर्छु।" },
            scenario: { en: "Day of week + に", np: "बारको नाम + に" },
          },
          {
            japanese: "ごぜんくじからごごごじまではたらきます。",
            reading: "Gozen ku-ji kara gogo go-ji made hatarakimasu.",
            english: { en: "I work from 9 AM to 5 PM.", np: "बिहान नौ बजेदेखि दिउँसो पाँच बजेसम्म काम गर्छु।" },
            scenario: { en: "Time range without に (から/まで)", np: "समय दायरामा に लाग्दैन (から/まで)" },
          },
        ],
      },
      {
        particle: "を",
        romaji: "wo",
        name: { en: "を — Object marker", np: "を — Object marker" },
        meaning: {
          en: "を (wo) marks the direct object of an action verb — the thing being acted on. Pattern: [Subject] は [Object] を [Verb]. を only appears with action verbs, never with です.",
          np: "を (wo) ले action verb को direct object चिन्हित गर्छ — जुन वस्तुमा कार्य हुन्छ। Pattern: [Subject] は [Object] を [Verb]। को केवल action verb सँग आउँछ, です सँग हुँदैन।",
        },
        examples: [
          {
            japanese: "あさ、コーヒーをのみます。",
            reading: "Asa, kōhī wo nomimasu.",
            english: { en: "In the morning I drink coffee.", np: "बिहान कफी पिउँछु।" },
            scenario: { en: "Morning drink habit", np: "बिहानको पेय बानी" },
          },
          {
            japanese: "まいにちにほんごをべんきょうします。",
            reading: "Mainichi Nihongo wo benkyō shimasu.",
            english: { en: "I study Japanese every day.", np: "हरेक दिन जापानिज पढ्छु।" },
            scenario: { en: "Study habit", np: "पढाइको बानी" },
          },
          {
            japanese: "きのうテレビをみませんでした。",
            reading: "Kinō terebi wo mimasen deshita.",
            english: { en: "I didn't watch TV yesterday.", np: "हिजो टिभी हेरिनँ।" },
            scenario: { en: "Past negative with object", np: "Object सहित भूत नकार" },
          },
        ],
      },
      {
        particle: "と",
        romaji: "to",
        name: { en: "と — And (connecting nouns)", np: "と — र (Noun जोड्न)" },
        meaning: {
          en: "と connects two or more nouns with 'and' in an exhaustive list. Unlike や (which implies 'and others'), と lists exactly what is mentioned. Pattern: N1 と N2 (と N3…).",
          np: "と ले दुई वा बढी noun लाई 'र' को अर्थमा सम्पूर्ण सूचीमा जोड्छ। や (अरू पनि छन् भन्ने संकेत) भन्दा फरक, と ले जे उल्लेख गरिएको छ त्यही मात्र जोड्छ। Pattern: N1 と N2 (と N3…)।",
        },
        examples: [
          {
            japanese: "まいにちコーヒーとこうちゃをのみます。",
            reading: "Mainichi kōhī to kōcha wo nomimasu.",
            english: { en: "I drink coffee and tea every day.", np: "हरेक दिन कफी र चिया पिउँछु।" },
            scenario: { en: "Listing two drinks", np: "दुई पेय सूचीबद्ध गर्दा" },
          },
          {
            japanese: "どようびとにちようびはやすみます。",
            reading: "Doyōbi to nichiyōbi wa yasumimasu.",
            english: { en: "I rest on Saturday and Sunday.", np: "शनि र आइतबार आराम गर्छु।" },
            scenario: { en: "Two days off", np: "दुई बिदाका दिन" },
          },
          {
            japanese: "としょかんでにほんごとえいごをべんきょうします。",
            reading: "Toshokan de Nihongo to Eigo wo benkyō shimasu.",
            english: { en: "I study Japanese and English at the library.", np: "पुस्तकालयमा जापानिज र अंग्रेजी पढ्छु।" },
            scenario: { en: "Two languages studied together", np: "एकसाथ दुई भाषा" },
          },
        ],
      },
    ],
    vocabulary: buildVocab(4),
    mcqs: [
      {
        question: { en: "Which sentence means 'I wake up at 7 every morning'?", np: "हरेक बिहान सात बजे उठ्छु — कुन वाक्यले यो भन्छ?" },
        choices: [
          "まいあさしちじにおきます",
          "まいあさしちじにねます",
          "きのうしちじにおきました",
          "しちじにおきませんでした",
        ],
        correctIndex: 0,
        explanation: { en: "まいあさ = every morning, しちじに = at 7 o'clock, おきます = wake up (present habit). ねます = sleep. ました = past.", np: "まいあさ = हरेक बिहान, しちじに = सात बजे, おきます = उठ्छु (वर्तमान बानी)। ねます = सुत्छु। ました = भूतकाल।" },
      },
      {
        question: { en: "What is the past form of はたらきます?", np: "はたらきます को भूतकाल रूप के हो?" },
        choices: ["はたらきました", "はたらきません", "はたらきますか", "はたらきませんでした"],
        correctIndex: 0,
        explanation: { en: "ます → ました changes present to polite past (did). ません is negative. ませんでした is past negative.", np: "ます → ました ले वर्तमानलाई विनम्र भूतमा (गरें) बदल्छ। ません नकार हो। ませんでした भूत नकार।" },
      },
      {
        question: { en: "Choose the correct sentence: 'I didn't study yesterday.'", np: "सही वाक्य छान्नुस्: 'हिजो पढिनँ।'" },
        choices: [
          "きのうべんきょうしませんでした",
          "きのうべんきょうしました",
          "きのうべんきょうします",
          "きのうべんきょうしませんか",
        ],
        correctIndex: 0,
        explanation: { en: "ませんでした = polite past negative (did not do). しました = did. します = present/future. しませんか = invitation (won't you?).", np: "ませんでした = विनम्र भूत नकार (गरिनँ)। しました = गरें। します = गर्छु। しませんか = निमन्त्रणा।" },
      },
      {
        question: { en: "What does を mark in a sentence?", np: "वाक्यमा を ले के चिन्हित गर्छ?" },
        choices: [
          { en: "The direct object of an action verb", np: "Action verb को direct object" },
          { en: "The location of an action", np: "कार्यको स्थान" },
          { en: "The time of an action", np: "कार्यको समय" },
          { en: "The subject of a sentence", np: "वाक्यको subject" },
        ],
        correctIndex: 0,
        explanation: { en: "を marks the direct object — what is being done. E.g. コーヒーをのみます: を marks コーヒー as the thing being drunk.", np: "を ले direct object — के गरिँदैछ भन्ने — चिन्हित गर्छ। जस्तै: コーヒーをのみます मा コーヒー लाई を ले चिन्हित गर्छ।" },
      },
      {
        question: { en: "Fill the blank: わたしは コーヒー _____ のみます。", np: "खाली भर्नुस्: わたしは コーヒー _____ のみます।" },
        choices: ["を", "は", "が", "に"],
        correctIndex: 0,
        explanation: { en: "を is the object marker used with action verbs. Here のみます (drink) acts on コーヒー, so を is correct.", np: "を action verb सँग object चिन्हित गर्छ। यहाँ のみます (पिउँछु) ले コーヒー मा कार्य गर्छ, त्यसैले を सही छ।" },
      },
      {
        question: { en: "What does くじから ごじまで mean?", np: "くじから ごじまで को अर्थ के हो?" },
        choices: [
          { en: "From 9 o'clock to 5 o'clock", np: "नौ बजेदेखि पाँच बजेसम्म" },
          { en: "At 9 and at 5", np: "नौ बजे र पाँच बजे" },
          { en: "Before 9 and after 5", np: "नौ बजे अघि र पाँच बजे पछि" },
          { en: "Around 9 to around 5", np: "लगभग नौ बजेदेखि लगभग पाँच बजेसम्म" },
        ],
        correctIndex: 0,
        explanation: { en: "から = from (start point), まで = to/until (end point). くじから ごじまで = from 9 to 5.", np: "から = देखि (सुरु बिन्दु), まで = सम्म (अन्त बिन्दु)। くじから ごじまで = नौ बजेदेखि पाँच बजेसम्म।" },
      },
      {
        question: { en: "Which word is the correct way to say 'from Monday to Friday'?", np: "'सोमबारदेखि शुक्रबारसम्म' कसरी भनिन्छ?" },
        choices: [
          "げつようびからきんようびまで",
          "げつようびまできんようびから",
          "きんようびからげつようびまで",
          "げつようびとまできんようび",
        ],
        correctIndex: 0,
        explanation: { en: "Start (から) comes before end (まで): げつようびから (from Monday) + きんようびまで (to Friday). The order cannot be reversed.", np: "सुरु (から) अन्त (まで) अघि आउँछ: げつようびから (सोमबारदेखि) + きんようびまで (शुक्रबारसम्म)। क्रम उल्टो हुँदैन।" },
      },
      {
        question: { en: "What does と do in コーヒーとこうちゃ?", np: "コーヒーとこうちゃ मा と ले के गर्छ?" },
        choices: [
          { en: "Connects two nouns with 'and'", np: "दुई noun लाई 'र' ले जोड्छ" },
          { en: "Shows where something is", np: "कुनै कुरा कहाँ छ भन्छ" },
          { en: "Marks the object of drinking", np: "पिउने वस्तु चिन्हित गर्छ" },
          { en: "Asks a question", np: "प्रश्न सोध्छ" },
        ],
        correctIndex: 0,
        explanation: { en: "と connects nouns with 'and' in an exhaustive list. コーヒーとこうちゃ = coffee and tea (those two, nothing else implied).", np: "と ले noun लाई 'र' को अर्थमा सम्पूर्ण सूचीमा जोड्छ। コーヒーとこうちゃ = कफी र चिया (ती दुई मात्र)।" },
      },
      {
        question: { en: "なんようびですか is asking about…?", np: "なんようびですか ले के सोध्छ?" },
        choices: [
          { en: "What day of the week it is", np: "आज कुन बार हो" },
          { en: "What time it is", np: "कति बजे भयो" },
          { en: "Which floor something is on", np: "कुन तल्लामा छ" },
          { en: "How many people there are", np: "कति जना छन्" },
        ],
        correctIndex: 0,
        explanation: { en: "何曜日 (なんようび) = what day of the week. 何時 = what time. 何階 = which floor. 何人 = how many people.", np: "何曜日 (なんようび) = कुन बार। 何時 = कति बज्यो। 何階 = कति तल्ला। 何人 = कति जना।" },
      },
      {
        question: { en: "Which is the correct expression when something was tough/hard?", np: "कुनै कुरा गाह्रो भएको व्यक्त गर्न कुन अभिव्यक्ति सही छ?" },
        choices: ["たいへんですね", "おねがいします", "かしこまりました", "えーと"],
        correctIndex: 0,
        explanation: { en: "たいへんですね expresses sympathy — 'That's tough/hard, isn't it?'. おねがいします = please / I ask you. かしこまりました = certainly (formal). えーと = well, let me see (filler).", np: "たいへんですね सहानुभूति व्यक्त गर्छ — 'गाह्रो छ हगी।' おねगいします = कृपया। かしこまりました = निश्चय (औपचारिक)। えーと = अं... (सोच्दा भन्ने)।" },
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════════════
  // LESSON 5 — こうつう と いどう (Transport & Movement)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 5,
    title: "Lesson 5 — こうつう と いどう (Transport & Movement)",
    intro: [
      {
        en: "In this lesson you learn how to talk about going places: where you go, how you get there, and how often you go.",
        np: "यस पाठमा तपाई कहाँ जानुहुन्छ, कसरी जानुहुन्छ र कति पटक जानुहुन्छ भनेर कुरा गर्न सिक्नुहुनेछ।",
      },
      {
        en: "The particle へ (e) marks the destination — 'toward'. The particle で (de) marks the means of transport — 'by'.",
        np: "Particle へ (ए) गन्तव्य चिन्ह गर्छ — 'तर्फ'। Particle で (दे) यातायातको साधन चिन्ह गर्छ — 'ले'।",
      },
      {
        en: "Frequency adverbs like よく (often), たいてい (usually), and ときどき (sometimes) come before the verb. あまり and ぜんぜん always pair with a negative verb.",
        np: "Frequency adverbs जस्तै よく (प्राय:), たいてい (सामान्यतया), र ときどき (कहिलेकाहीँ) verb अगाडि आउँछन्। あまり र ぜんぜん सधैं negative verb सँग प्रयोग हुन्छन्।",
      },
    ],
    youtubeVideoId: { en: "kCVhyuUEMkM", np: "kCVhyuUEMkM" },
    youtubeTitle: "Minna no Nihongo · Lesson 5 — Grammar",
    conversation: [
      {
        speaker: "A",
        japanese: "たなかさん、{週末|しゅうまつ}はどこへいきますか。",
        reading: "Tanaka-san, shūmatsu wa doko e ikimasu ka?",
        english: { en: "Tanaka, where are you going this weekend?", np: "तानाकाजी, यो शनिबार-आइतबार कहाँ जानुहुन्छ?" },
      },
      {
        speaker: "B",
        japanese: "かぞくと{海|うみ}へいきます。",
        reading: "Kazoku to umi e ikimasu.",
        english: { en: "I'm going to the sea with my family.", np: "परिवारसँग समुद्रतर्फ जाँदैछु।" },
      },
      {
        speaker: "A",
        japanese: "いいですね。どうやっていきますか。",
        reading: "Ii desu ne. Dō yatte ikimasu ka?",
        english: { en: "That sounds nice! How are you getting there?", np: "राम्रो! कसरी जानुहुन्छ?" },
      },
      {
        speaker: "B",
        japanese: "{車|くるま}でいきます。スミスさんは？",
        reading: "Kuruma de ikimasu. Sumisu-san wa?",
        english: { en: "By car. What about you, Smith?", np: "कारले जाँदैछु। स्मिथजी, तपाई?" },
      },
      {
        speaker: "A",
        japanese: "{私|わたし}は{図書館|としょかん}へいきます。いつも{電車|でんしゃ}でひとりでいきます。",
        reading: "Watashi wa toshokan e ikimasu. Itsumo densha de hitori de ikimasu.",
        english: { en: "I'm going to the library. I always go alone by train.", np: "म पुस्तकालय जाँदैछु। सधैं एक्लै रेलले जान्छु।" },
      },
      {
        speaker: "B",
        japanese: "よく{図書館|としょかん}へいきますか。",
        reading: "Yoku toshokan e ikimasu ka?",
        english: { en: "Do you go to the library often?", np: "पुस्तकालय प्राय: जानुहुन्छ?" },
      },
      {
        speaker: "A",
        japanese: "はい、よくいきます。にちようびはたいてい{図書館|としょかん}です。",
        reading: "Hai, yoku ikimasu. Nichiyōbi wa taitei toshokan desu.",
        english: { en: "Yes, I go often. Sundays are usually at the library.", np: "हो, प्राय: जान्छु। आइतबार सामान्यतया पुस्तकालयमा हुन्छु।" },
      },
      {
        speaker: "B",
        japanese: "そうですか。{私|わたし}はあまり{図書館|としょかん}へいきません。",
        reading: "Sō desu ka. Watashi wa amari toshokan e ikimasen.",
        english: { en: "I see. I don't go to the library very often.", np: "हो र। म पुस्तकालय धेरै जाँदिनँ।" },
      },
      {
        speaker: "A",
        japanese: "こんどいっしょにいきませんか。",
        reading: "Kondo issho ni ikimasen ka?",
        english: { en: "Why don't we go together next time?", np: "अर्को पटक सँगै जाउँ न?" },
      },
      {
        speaker: "B",
        japanese: "いいですね。ぜひいきましょう。",
        reading: "Ii desu ne. Zehi ikimashō.",
        english: { en: "That sounds great. Let's definitely go!", np: "राम्रो! जरुर जाउँ।" },
      },
    ],
    grammar: [
      {
        number: 1,
        name: { en: "[Place] へ いきます / きます / かえります", np: "[ठाउँ] へ いきます / きます / かえります" },
        meaning: {
          en: "Use へ (e) to mark the destination. いきます = go (away from speaker), きます = come (toward speaker), かえります = return home.",
          np: "Destination चिन्ह गर्न へ प्रयोग गर्नुस्। いきます = जानु (वक्ताबाट टाढा), きます = आउनु (वक्ततर्फ), かえります = घर फर्कनु।",
        },
        whereWeUse: [
          { en: "Stating where you are going: がっこうへいきます (I go to school).", np: "कहाँ जाँदैछौ भन्न: がっこうへいきます।" },
          { en: "Asking where someone is going: どこへいきますか (Where are you going?).", np: "कहाँ जाँदैछौ सोध्न: どこへいきますか।" },
          { en: "かえります always refers to returning to one's own home/base — not just any location.", np: "かえります सधैं आफ्नै घर/ठाउँ फर्कनलाई प्रयोग हुन्छ।" },
        ],
        examples: [
          {
            japanese: "{私|わたし}は{学校|がっこう}へいきます。",
            reading: "Watashi wa gakkō e ikimasu.",
            english: { en: "I go to school.", np: "म विद्यालय जान्छु।" },
            scenario: { en: "Morning routine", np: "बिहानको दैनिकी" },
          },
          {
            japanese: "{先生|せんせい}がきます。",
            reading: "Sensei ga kimasu.",
            english: { en: "The teacher is coming.", np: "शिक्षक आउँदैछन्।" },
            scenario: { en: "Classroom announcement", np: "कक्षाकोठामा सूचना" },
          },
          {
            japanese: "{毎晩|まいばん}{家|いえ}へかえります。",
            reading: "Maiban ie e kaerimasu.",
            english: { en: "I return home every evening.", np: "म हरेक साँझ घर फर्कन्छु।" },
            scenario: { en: "Daily schedule", np: "दैनिक तालिका" },
          },
        ],
      },
      {
        number: 2,
        name: { en: "[Transport] で いきます — means of transport", np: "[यातायात] で いきます — साधन" },
        meaning: {
          en: "Use で (de) to say how you travel — by bus, by train, on foot etc. で marks the means or instrument.",
          np: "कसरी यात्रा गर्नुहुन्छ — बसले, रेलले, पैदल आदि भन्न で प्रयोग गर्नुस्। で साधन वा उपकरण चिन्ह गर्छ।",
        },
        whereWeUse: [
          { en: "Means of transport: バスでいきます (I go by bus).", np: "यातायात साधन: バスでいきます।" },
          { en: "Asking how someone travels: どうやっていきますか (How do you get there?).", np: "कसरी जानुहुन्छ सोध्न: どうやっていきますか।" },
          { en: "On foot uses あるいて — no で needed: あるいていきます (I go on foot).", np: "पैदल जाँदा あるいて प्रयोग हुन्छ — で चाहिँदैन: あるいていきます।" },
        ],
        examples: [
          {
            japanese: "{電車|でんしゃ}でいきます。",
            reading: "Densha de ikimasu.",
            english: { en: "I go by train.", np: "रेलले जान्छु।" },
            scenario: { en: "Explaining your commute", np: "यात्राको बारेमा भन्दा" },
          },
          {
            japanese: "タクシーで{空港|くうこう}へいきます。",
            reading: "Takushī de kūkō e ikimasu.",
            english: { en: "I go to the airport by taxi.", np: "ट्याक्सीले विमानस्थल जान्छु।" },
            scenario: { en: "Travel plans", np: "यात्राको योजना" },
          },
          {
            japanese: "あるいてえきへいきます。",
            reading: "Aruite eki e ikimasu.",
            english: { en: "I walk to the station.", np: "पैदल स्टेसन जान्छु।" },
            scenario: { en: "Short distance", np: "नजिकको दूरी" },
          },
        ],
      },
      {
        number: 3,
        name: { en: "Frequency: よく · たいてい · ときどき · あまり〜ません · ぜんぜん〜ません", np: "आवृत्ति: よく · たいてい · ときどき · あまり〜ません · ぜんぜん〜ません" },
        meaning: {
          en: "Place frequency adverbs before the verb. よく (often) → たいてい (usually) → ときどき (sometimes) → あまり〜ません (not very often) → ぜんぜん〜ません (not at all). Important: あまり and ぜんぜん must be followed by a negative verb.",
          np: "Frequency adverbs verb अगाडि राख्नुस्। よく (प्राय:) → たいてい (सामान्यतया) → ときどき (कहिलेकाहीँ) → あまり〜ません (धेरै होइन) → ぜんぜん〜ません (बिल्कुल होइन)। महत्त्वपूर्ण: あまり र ぜんぜん पछि negative verb चाहिन्छ।",
        },
        whereWeUse: [
          { en: "よく、たいてい、ときどき pair with positive verbs: よくいきます (I often go).", np: "よく、たいてい、ときどき positive verb सँग: よくいきます।" },
          { en: "あまり MUST pair with negative: あまりいきません (I don't go very often).", np: "あまり negative verb सँग मात्र: あまりいきません।" },
          { en: "ぜんぜん MUST pair with negative: ぜんぜんいきません (I don't go at all).", np: "ぜんぜん negative verb सँग मात्र: ぜんぜんいきません।" },
        ],
        examples: [
          {
            japanese: "よく{図書館|としょかん}へいきます。",
            reading: "Yoku toshokan e ikimasu.",
            english: { en: "I often go to the library.", np: "म प्राय: पुस्तकालय जान्छु।" },
            scenario: { en: "Talking about habits", np: "बानी बारेमा कुरा गर्दा" },
          },
          {
            japanese: "あまりバスでいきません。",
            reading: "Amari basu de ikimasen.",
            english: { en: "I don't go by bus very often.", np: "म बसले धेरै जाँदिनँ।" },
            scenario: { en: "Describing rare habits", np: "बिरलै गर्ने कुरा" },
          },
          {
            japanese: "ぜんぜん{電車|でんしゃ}にのりません。",
            reading: "Zenzen densha ni norimasen.",
            english: { en: "I don't ride the train at all.", np: "म बिल्कुल रेल चढ्दिनँ।" },
            scenario: { en: "Strong negation", np: "पूर्ण अस्वीकार" },
          },
        ],
      },
    ],
    particles: [
      {
        particle: "へ",
        romaji: "e",
        name: { en: "Direction particle", np: "दिशा Particle" },
        meaning: { en: "Marks the destination or direction of movement — 'to', 'toward'.", np: "गति वा दिशाको गन्तव्य चिन्ह गर्छ — 'तर्फ', 'मा'।" },
        examples: [
          {
            japanese: "{学校|がっこう}へいきます。",
            reading: "Gakkō e ikimasu.",
            english: { en: "I go to school.", np: "म विद्यालय जान्छु।" },
            scenario: { en: "Destination of movement", np: "गतिको गन्तव्य" },
          },
          {
            japanese: "{東京|とうきょう}へきます。",
            reading: "Tōkyō e kimasu.",
            english: { en: "I come to Tokyo.", np: "म टोकियो आउँछु।" },
            scenario: { en: "Coming toward a place", np: "ठाउँतर्फ आउँदा" },
          },
          {
            japanese: "{家|うち}へかえります。",
            reading: "Uchi e kaerimasu.",
            english: { en: "I return home.", np: "म घर फर्कन्छु।" },
            scenario: { en: "Going back home", np: "घर फर्कँदा" },
          },
        ],
      },
      {
        particle: "で",
        romaji: "de",
        name: { en: "Means particle (transport)", np: "साधन Particle (यातायात)" },
        meaning: { en: "Marks the means or method of getting somewhere — 'by', 'using'.", np: "कुनै ठाउँ पुग्ने साधन वा तरिका चिन्ह गर्छ — 'ले', 'द्वारा'।" },
        examples: [
          {
            japanese: "バスでいきます。",
            reading: "Basu de ikimasu.",
            english: { en: "I go by bus.", np: "म बसले जान्छु।" },
            scenario: { en: "Naming the transport", np: "यातायात बताउँदा" },
          },
          {
            japanese: "ちかてつで{駅|えき}へいきます。",
            reading: "Chikatetsu de eki e ikimasu.",
            english: { en: "I go to the station by subway.", np: "सबवेले स्टेसन जान्छु।" },
            scenario: { en: "Combined で and へ", np: "で र へ सँगसँगै" },
          },
          {
            japanese: "タクシーで{空港|くうこう}へいきます。",
            reading: "Takushī de kūkō e ikimasu.",
            english: { en: "I go to the airport by taxi.", np: "ट्याक्सीले विमानस्थल जान्छु।" },
            scenario: { en: "Travel scenario", np: "यात्राको परिस्थिति" },
          },
        ],
      },
    ],
    vocabulary: buildVocab(5),
    mcqs: [
      {
        question: { en: "Which particle marks the destination of movement?", np: "गतिको गन्तव्य चिन्ह गर्ने particle कुन हो?" },
        choices: [
          { en: "へ — direction marker (to, toward)", np: "へ — दिशा particle (तर्फ)" },
          { en: "で — means marker (by, using)", np: "で — साधन particle (ले)" },
          { en: "を — object marker", np: "を — कर्म particle" },
          { en: "は — topic marker", np: "は — Topic particle" },
        ],
        correctIndex: 0,
        explanation: { en: "へ (e) marks the destination — がっこうへいきます (I go to school). で marks the means — バスでいきます (I go by bus).", np: "へ गन्तव्य चिन्ह गर्छ — がっこうへいきます। で साधन चिन्ह गर्छ — バスでいきます।" },
      },
      {
        question: { en: "Which particle marks how you travel — the means of transport?", np: "यातायातको साधन बताउने particle कुन हो?" },
        choices: [
          { en: "で — means of transport (by)", np: "で — यातायात साधन (ले)" },
          { en: "へ — direction (toward)", np: "へ — दिशा (तर्फ)" },
          { en: "に — time/location", np: "に — समय/ठाउँ" },
          { en: "から — starting point (from)", np: "から — प्रारम्भ (बाट)" },
        ],
        correctIndex: 0,
        explanation: { en: "で marks the means: バスで (by bus), でんしゃで (by train), くるまで (by car). へ marks direction: がっこうへ (to school).", np: "で साधन चिन्ह गर्छ: バスで, でんしゃで, くるまで। へ दिशा चिन्ह गर्छ: がっこうへ।" },
      },
      {
        question: { en: "What does たいてい mean?", np: "たいてい को अर्थ के हो?" },
        choices: [
          { en: "Usually / generally", np: "सामान्यतया" },
          { en: "Often / frequently", np: "प्राय:" },
          { en: "Sometimes", np: "कहिलेकाहीँ" },
          { en: "Not at all", np: "बिल्कुल होइन" },
        ],
        correctIndex: 0,
        explanation: { en: "Frequency scale: よく (often) > たいてい (usually) > ときどき (sometimes) > あまり〜ません (not very often) > ぜんぜん〜ません (not at all).", np: "आवृत्तिको क्रम: よく > たいてい > ときどき > あまり〜ません > ぜんぜん〜ません।" },
      },
      {
        question: { en: "ぜんぜん must always be followed by…?", np: "ぜんぜん पछि सधैं के आउनु पर्छ?" },
        choices: [
          { en: "A negative verb (〜ません / 〜ない)", np: "Negative verb (〜ません / 〜ない)" },
          { en: "A positive verb (〜ます)", np: "Positive verb (〜ます)" },
          { en: "An adjective", np: "Adjective" },
          { en: "A noun", np: "Noun" },
        ],
        correctIndex: 0,
        explanation: { en: "ぜんぜん〜ません = not at all. ぜんぜんいきません (I don't go at all). Same rule for あまり〜ません. Both MUST pair with a negative verb.", np: "ぜんぜん〜ません = बिल्कुल होइन। ぜんぜんいきません = बिल्कुल जाँदिनँ। あまり को पनि यही नियम।" },
      },
      {
        question: { en: "どうやっていきますか is asking about…?", np: "どうやっていきますか ले के सोध्छ?" },
        choices: [
          { en: "How you get there (means of transport)", np: "कसरी जानुहुन्छ (यातायातको साधन)" },
          { en: "Where you are going", np: "कहाँ जानुहुन्छ" },
          { en: "When you are going", np: "कहिले जानुहुन्छ" },
          { en: "With whom you are going", np: "कससँग जानुहुन्छ" },
        ],
        correctIndex: 0,
        explanation: { en: "どうやって = how / by what means. It asks for the method of transport. どこへ = where. いつ = when. だれと = with whom.", np: "どうやって = कसरी / कुन साधनले। यातायात सोध्छ। どこへ = कहाँ। いつ = कहिले। だれと = कससँग।" },
      },
      {
        question: { en: "ひとりでいきます means…?", np: "ひとりでいきます को अर्थ के हो?" },
        choices: [
          { en: "I go alone / by myself", np: "म एक्लै जान्छु" },
          { en: "I go with one person", np: "म एक जनासँग जान्छु" },
          { en: "I go together with everyone", np: "म सबैसँगै जान्छु" },
          { en: "I go first", np: "म पहिले जान्छु" },
        ],
        correctIndex: 0,
        explanation: { en: "ひとりで = alone / by oneself. ひとり = one person. で here marks the manner (by oneself). Contrast: ともだちといきます (go with a friend).", np: "ひとりで = एक्लै। ひとり = एक जना। で यहाँ तरिका चिन्ह गर्छ। Contrast: ともだちといきます (साथीसँग जानु)।" },
      },
      {
        question: { en: "What is the difference between いきます and かえります?", np: "いきます र かえります को फरक के हो?" },
        choices: [
          { en: "いきます = go (to any place); かえります = return to one's own home/base", np: "いきます = जानु (जुनसुकै ठाउँ); かえります = आफ्नै घर/ठाउँ फर्कनु" },
          { en: "いきます = go fast; かえります = go slowly", np: "いきます = छिटो जानु; かえります = बिस्तारै जानु" },
          { en: "Both mean the same thing", np: "दुवैको एउटै अर्थ छ" },
          { en: "いきます = come; かえります = go", np: "いきます = आउनु; かえります = जानु" },
        ],
        correctIndex: 0,
        explanation: { en: "いきます = go (away from speaker's base). きます = come (toward speaker). かえります = return to one's home or starting point — always implies going BACK.", np: "いきます = जानु (वक्ताबाट टाढा)। きます = आउनु (वक्ततर्फ)। かえります = आफ्नो घर/प्रारम्भ ठाउँमा फर्कनु — सधैं 'फर्कनु' बुझाउँछ।" },
      },
      {
        question: { en: "Fill in the blank: ___でがっこうへいきます。(I go to school by bus.)", np: "खाली ठाउँ भर्नुस्: ___でがっこうへいきます。(बसले विद्यालय जान्छु।)" },
        choices: ["バス", "へ", "よく", "うち"],
        correctIndex: 0,
        explanation: { en: "バスでがっこうへいきます = I go to school by bus. バス (bus) + で (by means of) + がっこうへ (to school) + いきます (go).", np: "バスでがっこうへいきます = बसले विद्यालय जान्छु। バス + で (साधन) + がっこうへ (विद्यालयतर्फ) + いきます।" },
      },
      {
        question: { en: "よくいきます tells us the speaker goes…?", np: "よくいきます ले वक्ता कति पटक जान्छ भन्छ?" },
        choices: [
          { en: "Often / frequently", np: "प्राय: / बारम्बार" },
          { en: "Sometimes", np: "कहिलेकाहीँ" },
          { en: "Never", np: "कहिल्यै होइन" },
          { en: "Not very often", np: "धेरै होइन" },
        ],
        correctIndex: 0,
        explanation: { en: "よく = often / frequently. It sits at the top of the frequency scale above たいてい (usually) and ときどき (sometimes).", np: "よく = प्राय: / बारम्बार। यो frequency scale मा सबैभन्दा माथि छ — たいてい र ときどき भन्दा माथि।" },
      },
      {
        question: { en: "Which sentence is grammatically correct?", np: "कुन वाक्य व्याकरणिक रूपमा सही छ?" },
        choices: [
          { en: "あまりいきません (I don't go very often)", np: "あまりいきません (धेरै जाँदिनँ)" },
          { en: "あまりいきます (I go not very often)", np: "あまりいきます (धेरै जाँदिनँ — गलत)" },
          { en: "ぜんぜんいきます (I don't go at all)", np: "ぜんぜんいきます (बिल्कुल जाँदिनँ — गलत)" },
          { en: "あまりよくいきます (I go often not much)", np: "あまりよくいきます (गलत)" },
        ],
        correctIndex: 0,
        explanation: { en: "あまり and ぜんぜん MUST pair with negative verbs (〜ません). あまりいきません ✓. ぜんぜんいきません ✓. Using them with 〜ます (positive) is a grammar error.", np: "あまり र ぜんぜん सधैं negative verb (〜ません) सँग आउनु पर्छ। あまりいきません ✓। ぜんぜんいきません ✓। Positive verb सँग प्रयोग गर्नु गल्ती हो।" },
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════════════
  // LESSON 6 — たべものと のみもの (Food, Drink & Invitations)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 6,
    title: "Lesson 6 — たべもの と のみもの (Food, Drink & Invitations)",
    intro: [
      {
        en: "In this lesson you learn to talk about eating and drinking: what you eat, where you eat, and how to invite someone to join you.",
        np: "यस पाठमा खाना र पिउने बारे कुरा गर्न सिक्नुहुनेछ: के खानुहुन्छ, कहाँ खानुहुन्छ, र कसैलाई सँगसँगै आउन कसरी निम्तो दिने।",
      },
      {
        en: "The particle で (de) marks where an action takes place — 'at' or 'in'. The particle を (o) marks the direct object of a verb — the thing you eat, drink, or buy.",
        np: "Particle で क्रिया हुने ठाउँ चिन्ह गर्छ — 'मा'। Particle を verb को direct object चिन्ह गर्छ — के खानुहुन्छ, पिउनुहुन्छ, वा किन्नुहुन्छ।",
      },
      {
        en: "To invite someone: 〜ませんか (won't you...?). To suggest: 〜ましょう (let's...) or 〜ましょうか (shall we...?).",
        np: "कसैलाई निम्त्याउन: 〜ませんか (जाउँ न?)। सुझाव दिन: 〜ましょう (जाउँ) वा 〜ましょうか (जाउँ कि?)।",
      },
    ],
    youtubeVideoId: { en: "hYbMa7PmMNw", np: "hYbMa7PmMNw" },
    youtubeTitle: "Minna no Nihongo · Lesson 6 — Grammar",
    conversation: [
      {
        speaker: "A",
        japanese: "たなかさん、{昼休|ひるやす}みに いっしょに ランチを たべませんか。",
        reading: "Tanaka-san, hiruyasumi ni issho ni ranchi o tabemasen ka?",
        english: { en: "Tanaka, would you like to have lunch together during the break?", np: "तानाकाजी, दिउँसो विश्राममा सँगसँगै खाना खाउँ न?" },
      },
      {
        speaker: "B",
        japanese: "もちろん。どこで たべますか。",
        reading: "Mochiron. Doko de tabemasu ka?",
        english: { en: "Of course! Where shall we eat?", np: "अवश्य! कहाँ खाने?" },
      },
      {
        speaker: "A",
        japanese: "{駅|えき}の まえに レストランが あります。あそこは どうですか。",
        reading: "Eki no mae ni resutoran ga arimasu. Asoko wa dō desu ka?",
        english: { en: "There's a restaurant in front of the station. How about there?", np: "स्टेसनको अगाडि एउटा रेस्टुरेन्ट छ। त्यहाँ जाउँ?" },
      },
      {
        speaker: "B",
        japanese: "いいですね。そこで たべましょう。なにを たべますか。",
        reading: "Ii desu ne. Soko de tabemashō. Nani o tabemasu ka?",
        english: { en: "Sounds good! Let's eat there. What are you going to eat?", np: "राम्रो! त्यहीँ खाउँ। के खाने?" },
      },
      {
        speaker: "A",
        japanese: "{私|わたし}は パスタを たべます。たなかさんは？",
        reading: "Watashi wa pasuta o tabemasu. Tanaka-san wa?",
        english: { en: "I'll have pasta. What about you, Tanaka?", np: "म पास्ता खान्छु। तानाकाजी?" },
      },
      {
        speaker: "B",
        japanese: "{私|わたし}は さかなを たべます。のみものは なにに しますか。",
        reading: "Watashi wa sakana o tabemasu. Nomimono wa nani ni shimasu ka?",
        english: { en: "I'll have fish. What will you have to drink?", np: "म माछा खान्छु। पिउने के लिन्छौ?" },
      },
      {
        speaker: "A",
        japanese: "コーヒーを のみます。たなかさんは？",
        reading: "Kōhī o nomimasu. Tanaka-san wa?",
        english: { en: "I'll have coffee. And you?", np: "म कफी पिउँछु। तपाई?" },
      },
      {
        speaker: "B",
        japanese: "{私|わたし}は こうちゃに します。あとで いっしょに こうえんへ いきませんか。",
        reading: "Watashi wa kōcha ni shimasu. Atode issho ni kōen e ikimasen ka?",
        english: { en: "I'll go with black tea. Shall we go to the park together afterwards?", np: "म कालो चिया लिन्छु। पछि सँगसँगै पार्क जाउँ न?" },
      },
      {
        speaker: "A",
        japanese: "いいですね。でも、ちょっと しごとが あります。",
        reading: "Ii desu ne. Demo, chotto shigoto ga arimasu.",
        english: { en: "That sounds nice. But I have a bit of work to do.", np: "राम्रो! तर, मलाई अलिकति काम छ।" },
      },
      {
        speaker: "B",
        japanese: "そうですか。じゃあ、また こんど いきましょう。",
        reading: "Sō desu ka. Jā, mata kondo ikimashō.",
        english: { en: "I see. Well then, let's go another time.", np: "हो र। ठीक छ, अर्को पटक जाउँ।" },
      },
    ],
    grammar: [
      {
        number: 1,
        name: { en: "[Place] で [Object] を [Verb] — action at a location", np: "[ठाउँ] で [Object] を [Verb] — ठाउँमा क्रिया" },
        meaning: {
          en: "Use で (de) to mark WHERE an action happens — 'at the restaurant', 'at school'. Combine with を to say what you do there.",
          np: "क्रिया कहाँ हुन्छ चिन्ह गर्न で प्रयोग गर्नुस् — 'रेस्टुरेन्टमा', 'विद्यालयमा'। को को संगसंगै के गर्नुहुन्छ भन्न।",
        },
        whereWeUse: [
          { en: "Location of eating/drinking: レストランでパスタをたべます (I eat pasta at the restaurant).", np: "खाना/पिउने ठाउँ: レストランでパスタをたべます।" },
          { en: "Location of studying/working: としょかんでべんきょうをします (I study at the library).", np: "पढ्ने/काम गर्ने ठाउँ: としょかんでべんきょうをします।" },
          { en: "Note: で here means PLACE of action — different from Day 5's で for transport means.", np: "注意: यो で क्रियाको ठाउँ — Day 5 को यातायात で भन्दा फरक।" },
        ],
        examples: [
          {
            japanese: "レストランで パスタを たべます。",
            reading: "Resutoran de pasuta o tabemasu.",
            english: { en: "I eat pasta at the restaurant.", np: "रेस्टुरेन्टमा पास्ता खान्छु।" },
            scenario: { en: "Lunch plans", np: "दिउँसो खानाको योजना" },
          },
          {
            japanese: "カフェで コーヒーを のみます。",
            reading: "Kafe de kōhī o nomimasu.",
            english: { en: "I drink coffee at the café.", np: "क्याफेमा कफी पिउँछु।" },
            scenario: { en: "Morning routine", np: "बिहानको दैनिकी" },
          },
          {
            japanese: "うちで しょくじを つくります。",
            reading: "Uchi de shokuji o tsukurimasu.",
            english: { en: "I make a meal at home.", np: "घरमा खाना बनाउँछु।" },
            scenario: { en: "Home cooking", np: "घरमा खाना पकाउँदा" },
          },
        ],
      },
      {
        number: 2,
        name: { en: "〜ませんか — Invitation 'Won't you...?'", np: "〜ませんか — निम्तो 'जाउँ न?'" },
        meaning: {
          en: "Add ませんか to the verb stem to invite someone politely. It literally means 'Won't you...?' and is softer than a direct request.",
          np: "Verb stem मा ませんか जोडेर विनम्र निम्तो दिन्छ। शाब्दिक अर्थ 'जाउँ न?' — सिधा अनुरोध भन्दा नम्र।",
        },
        whereWeUse: [
          { en: "Inviting to eat together: いっしょにたべませんか (Won't you eat with me?).", np: "सँगसँगै खान निम्त्याउन: いっしょにたべませんか।" },
          { en: "Inviting to go somewhere: いっしょにいきませんか (Won't you come with me?).", np: "सँगसँगै जान: いっしょにいきませんか।" },
          { en: "Polite refusal uses ちょっと: ちょっと... (a little [difficult] — implies sorry, can't).", np: "नम्र अस्वीकार: ちょっと... (अलिकति... — माफ गर्नुहोस् बुझिन्छ)।" },
        ],
        examples: [
          {
            japanese: "いっしょに ランチを たべませんか。",
            reading: "Issho ni ranchi o tabemasen ka?",
            english: { en: "Won't you have lunch with me?", np: "सँगसँगै खाना खाउँ न?" },
            scenario: { en: "Lunch invitation", np: "खानाको निम्तो" },
          },
          {
            japanese: "こうえんへ いきませんか。",
            reading: "Kōen e ikimasen ka?",
            english: { en: "Won't you come to the park?", np: "पार्क जाउँ न?" },
            scenario: { en: "After-work suggestion", np: "काम पछिको सुझाव" },
          },
          {
            japanese: "コーヒーを のみませんか。",
            reading: "Kōhī o nomimasen ka?",
            english: { en: "Won't you have some coffee?", np: "कफी पिउँ न?" },
            scenario: { en: "Casual offer", np: "अनौपचारिक प्रस्ताव" },
          },
        ],
      },
      {
        number: 3,
        name: { en: "〜ましょう / 〜ましょうか — 'Let's...' / 'Shall we...?'", np: "〜ましょう / 〜ましょうか — 'जाउँ' / 'जाउँ कि?'" },
        meaning: {
          en: "〜ましょう (masho) = 'Let's do it!' — a confident proposal. 〜ましょうか (masho ka) = 'Shall we...?' — a softer, checking suggestion.",
          np: "〜ましょう = 'जाउँ!' — आत्मविश्वासपूर्ण प्रस्ताव। 〜ましょうか = 'जाउँ कि?' — नरम, सोध्ने प्रकारको सुझाव।",
        },
        whereWeUse: [
          { en: "Confirming a plan: そこでたべましょう (Let's eat there).", np: "योजना पक्का गर्न: そこでたべましょう (त्यहीँ खाउँ)।" },
          { en: "Suggesting: 〜ましょうか (Shall we...?) — leaves it open for the other person.", np: "सुझाव दिन: 〜ましょうか — अर्को व्यक्तिलाई निर्णय गर्ने ठाउँ दिन्छ।" },
          { en: "Response to 〜ませんか invitation: そうしましょう (Yes, let's!) — the natural reply.", np: "〜ませんか को जवाफमा: そうしましょう (हो, जाउँ!) — स्वाभाविक उत्तर।" },
        ],
        examples: [
          {
            japanese: "そこで たべましょう。",
            reading: "Soko de tabemashō.",
            english: { en: "Let's eat there.", np: "त्यहीँ खाउँ।" },
            scenario: { en: "Agreeing on a place", np: "ठाउँमा सहमत हुँदा" },
          },
          {
            japanese: "また こんど いきましょう。",
            reading: "Mata kondo ikimashō.",
            english: { en: "Let's go another time.", np: "अर्को पटक जाउँ।" },
            scenario: { en: "Deferring plans", np: "योजना पर सार्दा" },
          },
          {
            japanese: "コーヒーを のみましょうか。",
            reading: "Kōhī o nomimashō ka?",
            english: { en: "Shall we have some coffee?", np: "कफी पिउँ कि?" },
            scenario: { en: "Soft suggestion", np: "नरम सुझाव" },
          },
        ],
      },
    ],
    particles: [
      {
        particle: "で",
        romaji: "de",
        name: { en: "Location particle (place of action)", np: "ठाउँ Particle (क्रियाको ठाउँ)" },
        meaning: { en: "Marks WHERE an action takes place — 'at', 'in'. Different from transport で (by bus etc.) — this で is about the place the activity happens.", np: "क्रिया कहाँ हुन्छ चिन्ह गर्छ — 'मा'। यातायातको で भन्दा फरक — यो で क्रियाको ठाउँको बारेमा हो।" },
        examples: [
          {
            japanese: "レストランで たべます。",
            reading: "Resutoran de tabemasu.",
            english: { en: "I eat at the restaurant.", np: "रेस्टुरेन्टमा खान्छु।" },
            scenario: { en: "Place of eating", np: "खाने ठाउँ" },
          },
          {
            japanese: "としょかんで べんきょうします。",
            reading: "Toshokan de benkyō shimasu.",
            english: { en: "I study at the library.", np: "पुस्तकालयमा पढ्छु।" },
            scenario: { en: "Place of study", np: "पढ्ने ठाउँ" },
          },
          {
            japanese: "うちで コーヒーを のみます。",
            reading: "Uchi de kōhī o nomimasu.",
            english: { en: "I drink coffee at home.", np: "घरमा कफी पिउँछु।" },
            scenario: { en: "Home activity", np: "घरमा क्रिया" },
          },
        ],
      },
      {
        particle: "を",
        romaji: "o",
        name: { en: "Object marker particle", np: "Object Particle" },
        meaning: { en: "Marks the direct object of a verb — the thing being eaten, drunk, bought, or made.", np: "Verb को direct object चिन्ह गर्छ — जे खाइन्छ, पिइन्छ, किनिन्छ, वा बनाइन्छ।" },
        examples: [
          {
            japanese: "コーヒーを のみます。",
            reading: "Kōhī o nomimasu.",
            english: { en: "I drink coffee.", np: "म कफी पिउँछु।" },
            scenario: { en: "Direct object of drink", np: "पिउने वस्तु" },
          },
          {
            japanese: "パンを たべます。",
            reading: "Pan o tabemasu.",
            english: { en: "I eat bread.", np: "म रोटी खान्छु।" },
            scenario: { en: "Direct object of eat", np: "खाने वस्तु" },
          },
          {
            japanese: "ほんを かいます。",
            reading: "Hon o kaimasu.",
            english: { en: "I buy a book.", np: "म किताब किन्छु।" },
            scenario: { en: "Direct object of buy", np: "किन्ने वस्तु" },
          },
        ],
      },
    ],
    vocabulary: buildVocab(6),
    mcqs: [
      {
        question: { en: "Which particle marks WHERE an action takes place?", np: "क्रिया कहाँ हुन्छ चिन्ह गर्ने particle कुन हो?" },
        choices: [
          { en: "で — location of action (at, in)", np: "で — क्रियाको ठाउँ (मा)" },
          { en: "へ — direction (toward)", np: "へ — दिशा (तर्फ)" },
          { en: "に — time or destination", np: "に — समय वा गन्तव्य" },
          { en: "の — possession", np: "の — स्वामित्व" },
        ],
        correctIndex: 0,
        explanation: { en: "で marks the place of action: レストランでたべます (eat at the restaurant). へ marks direction. This で is different from transport で (バスで = by bus).", np: "で क्रियाको ठाउँ चिन्ह गर्छ: レストランでたべます। へ दिशा चिन्ह गर्छ। यो で यातायात で भन्दा फरक।" },
      },
      {
        question: { en: "What does the particle を do in 'コーヒーをのみます'?", np: "'コーヒーをのみます' मा particle を ले के गर्छ?" },
        choices: [
          { en: "Marks coffee as the direct object (the thing being drunk)", np: "कफीलाई direct object (पिइने वस्तु) चिन्ह गर्छ" },
          { en: "Marks where the drinking happens", np: "पिउने ठाउँ चिन्ह गर्छ" },
          { en: "Marks the direction of movement", np: "गतिको दिशा चिन्ह गर्छ" },
          { en: "Marks the time of drinking", np: "पिउने समय चिन्ह गर्छ" },
        ],
        correctIndex: 0,
        explanation: { en: "を marks the direct object — the thing the verb acts on. コーヒーをのみます: coffee is what is being drunk. Other examples: パンをたべます, ほんをかいます.", np: "を direct object चिन्ह गर्छ। コーヒーをのみます: कफी पिइन्छ। अन्य: パンをたべます, ほんをかいます।" },
      },
      {
        question: { en: "How do you invite someone to eat lunch with you?", np: "कसैलाई दिउँसो खाना सँगसँगै खान कसरी निम्त्याउँछौ?" },
        choices: [
          { en: "いっしょにランチをたべませんか", np: "いっしょにランチをたべませんか" },
          { en: "いっしょにランチをたべます", np: "いっしょにランチをたべます" },
          { en: "いっしょにランチをたべましょう", np: "いっしょにランチをたべましょう" },
          { en: "いっしょにランチをたべません", np: "いっしょにランチをたべません" },
        ],
        correctIndex: 0,
        explanation: { en: "〜ませんか is the invitation form — 'Won't you...?'. 〜ましょう means 'Let's...' (used after both agree). 〜ません is a negative statement, not an invitation.", np: "〜ませんか निम्तो हो — 'जाउँ न?'। 〜ましょう = 'जाउँ' (दुवै सहमत भएपछि)। 〜ません negative statement हो।" },
      },
      {
        question: { en: "What does 〜ましょう express?", np: "〜ましょう ले के व्यक्त गर्छ?" },
        choices: [
          { en: "A confident proposal: 'Let's do it!'", np: "आत्मविश्वासपूर्ण प्रस्ताव: 'गरौँ!'" },
          { en: "A question: 'Do you...?'", np: "प्रश्न: 'गर्नुहुन्छ?'" },
          { en: "A polite refusal", np: "नम्र अस्वीकार" },
          { en: "A past action", np: "भूतकालको क्रिया" },
        ],
        correctIndex: 0,
        explanation: { en: "〜ましょう = 'Let's...!' — a confident joint suggestion. 〜ましょうか = 'Shall we...?' — softer. ませんか = 'Won't you...?' — an invitation.", np: "〜ましょう = 'गरौँ!' — आत्मविश्वासपूर्ण। 〜ましょうか = 'गरौँ कि?' — नरम। ませんか = 'गर्नु हुन्न र?' — निम्तो।" },
      },
      {
        question: { en: "のみます takes which particle for the thing being drunk?", np: "पिइने वस्तुका लागि のみます ले कुन particle लिन्छ?" },
        choices: ["を", "へ", "で", "に"],
        correctIndex: 0,
        explanation: { en: "Direct-object verbs like のみます, たべます, かいます all take を: コーヒーをのみます, パンをたべます, ほんをかいます.", np: "のみます, たべます, かいます जस्ता direct-object verbs ले を लिन्छन्: コーヒーをのみます, パンをたべます।" },
      },
      {
        question: { en: "たべます means…?", np: "たべます को अर्थ के हो?" },
        choices: [
          { en: "Eat (polite present)", np: "खानु (विनम्र वर्तमान)" },
          { en: "Drink (polite present)", np: "पिउनु (विनम्र वर्तमान)" },
          { en: "Buy (polite present)", np: "किन्नु (विनम्र वर्तमान)" },
          { en: "Cook (polite present)", np: "पकाउनु (विनम्र वर्तमान)" },
        ],
        correctIndex: 0,
        explanation: { en: "たべます = eat. のみます = drink. かいます = buy. つくります = make/cook. All are polite (〜ます) forms.", np: "たべます = खानु। のみます = पिउनु। かいます = किन्नु। つくります = बनाउनु। सबै विनम्र (〜ます) रूप।" },
      },
      {
        question: { en: "もちろん means…?", np: "もちろん को अर्थ के हो?" },
        choices: [
          { en: "Of course!", np: "अवश्य!" },
          { en: "Maybe / perhaps", np: "शायद" },
          { en: "A little bit", np: "अलिकति" },
          { en: "That's right", np: "ठीक छ" },
        ],
        correctIndex: 0,
        explanation: { en: "もちろん = of course / naturally. It's used to enthusiastically agree. ちょっと = a little (also used as a soft refusal: ちょっと... = 'it's a bit difficult...').", np: "もちろん = अवश्य। सहर्ष सहमत हुन प्रयोग हुन्छ। ちょっと = अलिकति (नम्र अस्वीकारमा पनि: ちょっと... = 'अलि गाह्रो...')।" },
      },
      {
        question: { en: "Fill in the blank: レストラン___ランチをたべます。", np: "खाली ठाउँ भर्नुस्: レストラン___ランチをたべます।" },
        choices: ["で", "へ", "を", "が"],
        correctIndex: 0,
        explanation: { en: "レストランでランチをたべます = I eat lunch at the restaurant. で marks the place of action here — different from transport (バスで = by bus).", np: "レストランでランチをたべます = रेस्टुरेन्टमा दिउँसो खाना खान्छु। यो で क्रियाको ठाउँ — यातायात で (バスで) भन्दा फरक।" },
      },
      {
        question: { en: "ひるやすみ means…?", np: "ひるやすみ को अर्थ के हो?" },
        choices: [
          { en: "Lunch break", np: "दिउँसोको विश्राम" },
          { en: "Lunchtime meal", np: "दिउँसोको खाना" },
          { en: "Morning break", np: "बिहानको विश्राम" },
          { en: "Evening rest", np: "साँझको विश्राम" },
        ],
        correctIndex: 0,
        explanation: { en: "ひるやすみ = lunch break / noon rest (昼休み). ひる = noon/daytime; やすみ = rest/break. ひるごはん = the lunch meal itself.", np: "ひるやすみ = दिउँसोको विश्राम (昼休み)। ひる = दिउँसो; やすみ = विश्राम। ひるごはん = दिउँसोको खाना।" },
      },
      {
        question: { en: "あとで means…?", np: "あとで को अर्थ के हो?" },
        choices: [
          { en: "Later / after that", np: "पछि / त्यसपछि" },
          { en: "Before that", np: "त्यसभन्दा पहिले" },
          { en: "Right now", np: "अहिले नै" },
          { en: "Together", np: "सँगसँगै" },
        ],
        correctIndex: 0,
        explanation: { en: "あとで = later / after that. あとでコーヒーをのみましょう = Let's have coffee later. いま = now. まえに = before. いっしょに = together.", np: "あとで = पछि / त्यसपछि। あとでコーヒーをのみましょう = पछि कफी पिउँ। いま = अहिले। まえに = पहिले। いっしょに = सँगसँगै।" },
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════════════
  // LESSON 7 — プレゼント (Gifts, Giving & Receiving)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 7,
    title: "Lesson 7 — プレゼント (Gifts, Giving & Receiving)",
    intro: [
      {
        en: "In this lesson you learn the three verbs for giving and receiving — あげます, もらいます, and くれます — and how to use them with the particles に and から.",
        np: "यस पाठमा दिने र पाउने तीन verb — あげます, もらいます, र くれます — र ती particle に र から सँग कसरी प्रयोग गर्ने सिक्नुहुनेछ।",
      },
      {
        en: "あげます = I/someone gives TO another person. もらいます = I/someone RECEIVES from another person. くれます = someone gives TO me (or my in-group).",
        np: "あげます = म/कोही अर्को व्यक्तिलाई दिन्छ। もらいます = म/कोही अर्को व्यक्तिबाट पाउँछ। くれます = कोहीले मलाई दिन्छ।",
      },
      {
        en: "Key particles: に marks the recipient (to whom), から marks the source (from whom).",
        np: "मुख्य particle: に पाउने व्यक्ति चिन्ह गर्छ (कसलाई), から दिने स्रोत चिन्ह गर्छ (कसबाट)।",
      },
    ],
    youtubeVideoId: { en: "RQlOsHLDfCE", np: "RQlOsHLDfCE" },
    youtubeTitle: "Minna no Nihongo · Lesson 7 — Grammar",
    conversation: [
      {
        speaker: "A",
        japanese: "きのう スミスさんの たんじょうびでしたね。だれかに プレゼントを もらいましたか。",
        reading: "Kinō Sumisu-san no tanjōbi deshita ne. Dare ka ni purezento o moraimashita ka?",
        english: { en: "Yesterday was your birthday, wasn't it, Smith? Did you receive a present from anyone?", np: "हिजो तपाईको जन्मदिन थियो हैन, स्मिथजी? कसैबाट उपहार पाउनुभयो?" },
      },
      {
        speaker: "B",
        japanese: "はい、かのじょから {花|はな}と カードを もらいました。",
        reading: "Hai, kanojo kara hana to kādo o moraimashita.",
        english: { en: "Yes, I received flowers and a card from my girlfriend.", np: "हो, प्रेमिकाबाट फूल र कार्ड पाएँ।" },
      },
      {
        speaker: "A",
        japanese: "いいですね。スミスさんは だれかに なにか あげましたか。",
        reading: "Ii desu ne. Sumisu-san wa dare ka ni nani ka agemashita ka?",
        english: { en: "That's lovely! Did you give anything to anyone?", np: "राम्रो! तपाईले पनि कसैलाई केही दिनुभयो?" },
      },
      {
        speaker: "B",
        japanese: "はい、かぞくに チョコレートを あげました。{母|はは}に {花|はな}も あげました。",
        reading: "Hai, kazoku ni chokoreeto o agemashita. Haha ni hana mo agemashita.",
        english: { en: "Yes, I gave chocolate to my family. I also gave flowers to my mother.", np: "हो, परिवारलाई चकलेट दिएँ। आमालाई फूल पनि दिएँ।" },
      },
      {
        speaker: "A",
        japanese: "すてきですね。たんじょうびは たのしかったですか。",
        reading: "Suteki desu ne. Tanjōbi wa tanoshikatta desu ka?",
        english: { en: "How lovely! Was the birthday fun?", np: "कति राम्रो! जन्मदिन मजाले बित्यो?" },
      },
      {
        speaker: "B",
        japanese: "はい、とても たのしかったです。ともだちも きてくれました。",
        reading: "Hai, totemo tanoshikatta desu. Tomodachi mo kite kuremashita.",
        english: { en: "Yes, it was very fun! My friends also came for me.", np: "हो, एकदम मजा भयो! साथीहरू पनि आइदिए।" },
      },
      {
        speaker: "A",
        japanese: "クリスマスには なにを あげる つもりですか。",
        reading: "Kurisumasu ni wa nani o ageru tsumori desu ka?",
        english: { en: "What are you planning to give for Christmas?", np: "क्रिसमसमा के दिने विचार छ?" },
      },
      {
        speaker: "B",
        japanese: "かのじょに ゆびわを あげたいです。でも まだ かっていません。",
        reading: "Kanojo ni yubiwa o agetai desu. Demo mada katte imasen.",
        english: { en: "I want to give my girlfriend a ring. But I haven't bought it yet.", np: "प्रेमिकालाई औंठी दिन चाहन्छु। तर अझै किनेको छैन।" },
      },
      {
        speaker: "A",
        japanese: "もう えらびましたか。",
        reading: "Mō erabimashita ka?",
        english: { en: "Have you already chosen one?", np: "पहिले नै रोज्नुभयो?" },
      },
      {
        speaker: "B",
        japanese: "いいえ、まだです。いっしょに えらんでくれませんか。",
        reading: "Iie, mada desu. Issho ni erande kuremasen ka?",
        english: { en: "No, not yet. Would you help me choose one?", np: "होइन, अझै। सँगसँगै रोजिदिनु हुन्न?" },
      },
    ],
    grammar: [
      {
        number: 1,
        name: { en: "[Person] に [Object] を あげます — give to someone", np: "[व्यक्ति] に [वस्तु] を あげます — कसैलाई दिनु" },
        meaning: {
          en: "Use あげます when I (or someone) gives something TO another person outside my group. に marks the recipient.",
          np: "जब म (वा कोही) अर्को व्यक्तिलाई केही दिन्छ तब あげます प्रयोग गर्नुस्। に पाउने व्यक्ति चिन्ह गर्छ।",
        },
        whereWeUse: [
          { en: "Giving to a friend: ともだちにプレゼントをあげます (I give a present to my friend).", np: "साथीलाई दिन: ともだちにプレゼントをあげます।" },
          { en: "Giving to family: ははにはなをあげました (I gave flowers to my mother).", np: "परिवारलाई दिन: ははにはなをあげました।" },
          { en: "Never use あげます when the receiver is yourself — use もらいます instead.", np: "आफू पाउने भए あげます प्रयोग नगर्नुस् — もらいます प्रयोग गर्नुस्।" },
        ],
        examples: [
          {
            japanese: "ともだちに プレゼントを あげます。",
            reading: "Tomodachi ni purezento o agemasu.",
            english: { en: "I give a present to my friend.", np: "साथीलाई उपहार दिन्छु।" },
            scenario: { en: "Giving a gift", np: "उपहार दिँदा" },
          },
          {
            japanese: "{母|はは}に {花|はな}を あげました。",
            reading: "Haha ni hana o agemashita.",
            english: { en: "I gave flowers to my mother.", np: "आमालाई फूल दिएँ।" },
            scenario: { en: "Past giving", np: "भूतकालमा दिएको" },
          },
          {
            japanese: "かれしに カードを あげます。",
            reading: "Kareshi ni kādo o agemasu.",
            english: { en: "I give a card to my boyfriend.", np: "प्रेमीलाई कार्ड दिन्छु।" },
            scenario: { en: "Occasion gift", np: "विशेष अवसरमा" },
          },
        ],
      },
      {
        number: 2,
        name: { en: "[Person] から [Object] を もらいます — receive from someone", np: "[व्यक्ति] から [वस्तु] を もらいます — कसैबाट पाउनु" },
        meaning: {
          en: "Use もらいます when I (or someone) receives something FROM another person. から marks the source — who gave it.",
          np: "जब म (वा कोही) अर्को व्यक्तिबाट केही पाउँछ तब もらいます प्रयोग गर्नुस्। から स्रोत चिन्ह गर्छ — कसले दियो।",
        },
        whereWeUse: [
          { en: "Receiving from a friend: ともだちからはなをもらいました (I received flowers from my friend).", np: "साथीबाट पाउन: ともだちからはなをもらいました।" },
          { en: "に can also replace から as the source: ともだちにもらいました = same meaning.", np: "に ले पनि कसबाट भन्न सकिन्छ: ともだちにもらいました = एउटै अर्थ।" },
          { en: "Ask 'from whom': だれからもらいましたか (Who did you receive it from?).", np: "कसबाट सोध्न: だれからもらいましたか।" },
        ],
        examples: [
          {
            japanese: "かのじょから {花|はな}を もらいました。",
            reading: "Kanojo kara hana o moraimashita.",
            english: { en: "I received flowers from my girlfriend.", np: "प्रेमिकाबाट फूल पाएँ।" },
            scenario: { en: "Birthday gift received", np: "जन्मदिनमा पाएको" },
          },
          {
            japanese: "{父|ちち}から ワインを もらいます。",
            reading: "Chichi kara wain o moraimasu.",
            english: { en: "I receive wine from my father.", np: "बुबाबाट वाइन पाउँछु।" },
            scenario: { en: "Receiving from family", np: "परिवारबाट पाउँदा" },
          },
          {
            japanese: "だれから もらいましたか。",
            reading: "Dare kara moraimashita ka?",
            english: { en: "Who did you receive it from?", np: "कसबाट पाउनुभयो?" },
            scenario: { en: "Asking the source", np: "स्रोत सोध्दा" },
          },
        ],
      },
      {
        number: 3,
        name: { en: "もう〜ました / まだ〜ていません — Already / Not yet", np: "もう〜ました / まだ〜ていません — पहिले नै / अझै होइन" },
        meaning: {
          en: "もう (mō) + past verb = already done. まだ (mada) + negative = not yet. These are used to describe whether an action has been completed.",
          np: "もう + past verb = पहिले नै गरिसक्यो। まだ + negative = अझै गरेको छैन। कुनै काम भयो कि भएन भन्न प्रयोग हुन्छ।",
        },
        whereWeUse: [
          { en: "もうたべました (I've already eaten) — use past tense after もう.", np: "もうたべました = पहिले नै खाइसकेँ — もう पछि past tense।" },
          { en: "まだたべていません (I haven't eaten yet) — use negative て-form after まだ.", np: "まだたべていません = अझै खाइसकेको छैन — まだ पछि negative て-form।" },
          { en: "もうかいましたか? (Have you bought it already?) / いいえ、まだです (No, not yet).", np: "もうかいましたか? / いいえ、まだです — प्रश्न र उत्तर।" },
        ],
        examples: [
          {
            japanese: "もう たべました。",
            reading: "Mō tabemashita.",
            english: { en: "I've already eaten.", np: "पहिले नै खाइसकेँ।" },
            scenario: { en: "Action already completed", np: "काम पहिले नै सकिएको" },
          },
          {
            japanese: "まだ かっていません。",
            reading: "Mada katte imasen.",
            english: { en: "I haven't bought it yet.", np: "अझै किनेको छैन।" },
            scenario: { en: "Action not yet done", np: "काम अझै नभएको" },
          },
          {
            japanese: "もう えらびましたか。いいえ、まだです。",
            reading: "Mō erabimashita ka? Iie, mada desu.",
            english: { en: "Have you chosen already? — No, not yet.", np: "पहिले नै रोज्नुभयो? — होइन, अझै।" },
            scenario: { en: "Question and reply", np: "प्रश्न र उत्तर" },
          },
        ],
      },
    ],
    particles: [
      {
        particle: "に",
        romaji: "ni",
        name: { en: "Recipient particle (giving)", np: "पाउने Particle (दिँदा)" },
        meaning: { en: "Marks the RECIPIENT of a gift — who receives it. Used with あげます and くれます. Also used with もらいます (alternate to から).", np: "उपहार पाउने व्यक्ति चिन्ह गर्छ। あげます र くれます सँग प्रयोग हुन्छ। もらいます सँग पनि (から को विकल्प)।" },
        examples: [
          {
            japanese: "ともだちに プレゼントを あげます。",
            reading: "Tomodachi ni purezento o agemasu.",
            english: { en: "I give a present to my friend.", np: "साथीलाई उपहार दिन्छु।" },
            scenario: { en: "Recipient of giving", np: "दिने क्रियाको पाउने" },
          },
          {
            japanese: "{母|はは}に カードを あげました。",
            reading: "Haha ni kādo o agemashita.",
            english: { en: "I gave a card to my mother.", np: "आमालाई कार्ड दिएँ।" },
            scenario: { en: "Giving to family", np: "परिवारलाई दिँदा" },
          },
          {
            japanese: "だれに あげましたか。",
            reading: "Dare ni agemashita ka?",
            english: { en: "Who did you give it to?", np: "कसलाई दिनुभयो?" },
            scenario: { en: "Asking the recipient", np: "पाउने व्यक्ति सोध्दा" },
          },
        ],
      },
      {
        particle: "から",
        romaji: "kara",
        name: { en: "Source particle (receiving)", np: "स्रोत Particle (पाउँदा)" },
        meaning: { en: "Marks the SOURCE of a received item — who gave it. Used with もらいます. Also means 'from' for places and 'because' in some contexts.", np: "पाइएको वस्तुको स्रोत चिन्ह गर्छ — कसले दियो। もらいます सँग प्रयोग हुन्छ। ठाउँमा 'बाट' र कारणमा 'किनभने' को अर्थ पनि।" },
        examples: [
          {
            japanese: "かのじょから {花|はな}を もらいました。",
            reading: "Kanojo kara hana o moraimashita.",
            english: { en: "I received flowers from my girlfriend.", np: "प्रेमिकाबाट फूल पाएँ।" },
            scenario: { en: "Source of gift", np: "उपहारको स्रोत" },
          },
          {
            japanese: "{父|ちち}から てがみを もらいます。",
            reading: "Chichi kara tegami o moraimasu.",
            english: { en: "I receive a letter from my father.", np: "बुबाबाट पत्र पाउँछु।" },
            scenario: { en: "Receiving from family", np: "परिवारबाट पाउँदा" },
          },
          {
            japanese: "だれから もらいましたか。",
            reading: "Dare kara moraimashita ka?",
            english: { en: "Who did you receive it from?", np: "कसबाट पाउनुभयो?" },
            scenario: { en: "Asking the source", np: "स्रोत सोध्दा" },
          },
        ],
      },
    ],
    vocabulary: buildVocab(7),
    mcqs: [
      {
        question: { en: "Which verb means 'I give something to someone else (outside my group)'?", np: "आफ्नो समूह बाहिरको कसैलाई दिनलाई कुन verb प्रयोग गर्नुहुन्छ?" },
        choices: [
          { en: "あげます — give (outward, to others)", np: "あげます — दिनु (अरूलाई)" },
          { en: "もらいます — receive", np: "もらいます — पाउनु" },
          { en: "くれます — give to me", np: "くれます — मलाई दिनु" },
          { en: "おくります — send", np: "おくります — पठाउनु" },
        ],
        correctIndex: 0,
        explanation: { en: "あげます = give outward (I/someone gives to another person). くれます = give TO me/my group. もらいます = receive. The viewpoint changes which verb you use.", np: "あげます = बाहिर दिनु (म/कोही अर्को व्यक्तिलाई दिन्छ)। くれます = मलाई दिनु। もらいます = पाउनु। दृष्टिकोण अनुसार verb फरक हुन्छ।" },
      },
      {
        question: { en: "Which particle marks the source in 'I received flowers FROM my girlfriend'?", np: "'म प्रेमिकाबाट फूल पाएँ' मा कुन particle स्रोत चिन्ह गर्छ?" },
        choices: [
          { en: "から — from (source)", np: "から — बाट (स्रोत)" },
          { en: "に — to (recipient)", np: "に — लाई (पाउने)" },
          { en: "で — at / by means of", np: "で — मा / ले" },
          { en: "へ — toward", np: "へ — तर्फ" },
        ],
        correctIndex: 0,
        explanation: { en: "かのじょからはなをもらいました = I received flowers FROM my girlfriend. から marks the source (giver). に marks the recipient in giving (ともだちにあげます).", np: "かのじょからはなをもらいました। から = स्रोत (दिने)। に = पाउने (ともだちにあげます)।" },
      },
      {
        question: { en: "What is the difference between あげます and くれます?", np: "あげます र くれます को फरक के हो?" },
        choices: [
          { en: "あげます = I give to others; くれます = others give to ME", np: "あげます = म अरूलाई दिन्छु; くれます = अरूले मलाई दिन्छन्" },
          { en: "あげます = I receive; くれます = I give", np: "あげます = म पाउँछु; くれます = म दिन्छु" },
          { en: "Both mean the same thing", np: "दुवैको एउटै अर्थ" },
          { en: "あげます is polite; くれます is casual", np: "あげます विनम्र; くれます अनौपचारिक" },
        ],
        correctIndex: 0,
        explanation: { en: "あげます = give outward (speaker → others). くれます = give inward (others → speaker/my group). もらいます = receive (speaker ← others). The 'direction' determines which verb.", np: "あげます = बाहिर दिनु (वक्ता → अरू)। くれます = भित्र दिनु (अरू → वक्ता)। もらいます = पाउनु। 'दिशा' अनुसार verb छानिन्छ।" },
      },
      {
        question: { en: "Which particle marks the recipient in 'I give a present TO my friend'?", np: "'म साथीलाई उपहार दिन्छु' मा कुन particle पाउने व्यक्ति चिन्ह गर्छ?" },
        choices: [
          { en: "に — to (recipient)", np: "に — लाई (पाउने)" },
          { en: "から — from (source)", np: "から — बाट (स्रोत)" },
          { en: "を — object marker", np: "を — Object marker" },
          { en: "と — with / and", np: "と — सँग / र" },
        ],
        correctIndex: 0,
        explanation: { en: "ともだちにプレゼントをあげます: に marks who receives (friend). から marks who gives (source). を marks what is given (present).", np: "ともだちにプレゼントをあげます: に = पाउने (साथी)। から = दिने (स्रोत)। を = दिइने वस्तु (उपहार)।" },
      },
      {
        question: { en: "もうたべました means…?", np: "もうたべました को अर्थ के हो?" },
        choices: [
          { en: "I have already eaten", np: "पहिले नै खाइसकेँ" },
          { en: "I haven't eaten yet", np: "अझै खाइसकेको छैन" },
          { en: "I will eat later", np: "पछि खान्छु" },
          { en: "I want to eat", np: "खान मन छ" },
        ],
        correctIndex: 0,
        explanation: { en: "もう + past verb = already completed. もうたべました = already ate. まだ + negative = not yet: まだたべていません = haven't eaten yet.", np: "もう + past verb = पहिले नै सकियो। もうたべました = पहिले नै खाइसकेँ। まだ + negative = अझै होइन: まだたべていません।" },
      },
      {
        question: { en: "まだたべていません means…?", np: "まだたべていません को अर्थ के हो?" },
        choices: [
          { en: "I haven't eaten yet", np: "अझै खाइसकेको छैन" },
          { en: "I already ate", np: "पहिले नै खाइसकेँ" },
          { en: "I don't like eating", np: "खान मन पर्दैन" },
          { en: "I eat sometimes", np: "कहिलेकाहीँ खान्छु" },
        ],
        correctIndex: 0,
        explanation: { en: "まだ + negative て-form = not yet. まだたべていません = haven't eaten yet. もうたべました = already ate. いいえ、まだです = No, not yet (short reply).", np: "まだ + negative て-form = अझै होइन। まだたべていません = अझै खाइसकेको छैन। もうたべました = पहिले नै खाइसकेँ।" },
      },
      {
        question: { en: "たんじょうび means…?", np: "たんじょうび को अर्थ के हो?" },
        choices: [
          { en: "Birthday", np: "जन्मदिन" },
          { en: "Christmas", np: "क्रिसमस" },
          { en: "Wedding anniversary", np: "विवाह वर्षगाँठ" },
          { en: "New Year", np: "नयाँ वर्ष" },
        ],
        correctIndex: 0,
        explanation: { en: "たんじょうび = birthday (誕生日). クリスマス = Christmas. けっこんきねんび = wedding anniversary. おしょうがつ = New Year.", np: "たんじょうび = जन्मदिन। クリスマス = क्रिसमस। けっこんきねんび = विवाह वर्षगाँठ। おしょうがつ = नयाँ वर्ष।" },
      },
      {
        question: { en: "Fill in the blank: かのじょ___はなをもらいました。(I received flowers FROM my girlfriend.)", np: "खाली ठाउँ भर्नुस्: かのじょ___はなをもらいました।(प्रेमिकाबाट फूल पाएँ।)" },
        choices: ["から", "に", "で", "へ"],
        correctIndex: 0,
        explanation: { en: "かのじょからはなをもらいました = I received flowers from my girlfriend. から marks the source/giver in もらいます sentences.", np: "かのじょからはなをもらいました = प्रेमिकाबाट फूल पाएँ। から = स्रोत/दिने व्यक्ति — もらいます वाक्यमा।" },
      },
      {
        question: { en: "Fill in the blank: おかあさん___プレゼントをあげました。(I gave a present TO my mother.)", np: "खाली ठाउँ भर्नुस्: おかあさん___プレゼントをあげました।(आमालाई उपहार दिएँ।)" },
        choices: ["に", "から", "で", "と"],
        correctIndex: 0,
        explanation: { en: "おかあさんにプレゼントをあげました = I gave a present to my mother. に marks the recipient in あげます sentences.", np: "おかあさんにプレゼントをあげました = आमालाई उपहार दिएँ। に = पाउने व्यक्ति — あげます वाक्यमा।" },
      },
      {
        question: { en: "What does だれから mean?", np: "だれから को अर्थ के हो?" },
        choices: [
          { en: "From whom", np: "कसबाट" },
          { en: "To whom", np: "कसलाई" },
          { en: "With whom", np: "कससँग" },
          { en: "For whom", np: "कसका लागि" },
        ],
        correctIndex: 0,
        explanation: { en: "だれから = from whom (who gave it). だれに = to whom (who received it). だれと = with whom. だれのために = for whom.", np: "だれから = कसबाट (कसले दियो)। だれに = कसलाई (कसले पायो)। だれと = कससँग। だれのために = कसका लागि।" },
      },
    ],
  },
];

export function getLessonPage(id: number): N5LessonPageData | undefined {
  return N5_LESSON_PAGES.find((l) => l.id === id);
}
