/** Data for the N5 lesson accordion drawer content. */

import { N5_VOCAB_BY_LESSON } from "@/lib/japanese-learning/n5/n5-vocab-data";
import type { FuriganaString } from "@/lib/japanese-learning/furigana";

export type { FuriganaString };

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
        name: {
          en: "〜じ — Telling the time (special readings: 4, 7, 9)",
          np: "〜じ — समय भन्ने तरिका (विशेष पठन: ४, ७, ९)",
        },
        meaning: {
          en: "To say o'clock, attach じ (時) after the number. Most numbers are regular — いちじ, にじ, さんじ, ごじ, ろくじ, はちじ, じゅうじ. But <b>three numbers change their reading</b> and must be memorised: <b>4 = よじ</b> (not しじ), <b>7 = しちじ</b> (not ななじ), <b>9 = くじ</b> (not きゅうじ).",
          np: "o'clock भन्न number को पछि じ (時) लगाउनुस्। धेरैजसो numbers सामान्य हुन्छन् — いちじ, にじ, さんじ, ごじ, ろくじ, はちじ, じゅうじ। तर <b>तीनवटाको पठन फरक हुन्छ</b> र याद गर्नुपर्छ: <b>४ = よじ</b> (しじ होइन), <b>७ = しちじ</b> (ななじ होइन), <b>９ = くじ</b> (きゅうじ होइन)।",
        },
        whereWeUse: [
          {
            en: "4 o'clock → よじ — まいにち よじに おきます (I wake up at 4 every day)",
            np: "४ बजे → よじ — まいにち よじに おきます (हरेक दिन चार बजे उठ्छु)",
          },
          {
            en: "7 o'clock → しちじ — しちじに しごとを します (I work at 7 o'clock)",
            np: "७ बजे → しちじ — しちじに しごとをします (सात बजे काम गर्छु)",
          },
          {
            en: "9 o'clock → くじ — くじから ごじまで はたらきます (I work from 9 to 5)",
            np: "९ बजे → くじ — くじから ごじまで はたらきます (नौ बजेदेखि पाँच बजेसम्म काम गर्छु)",
          },
        ],
        examples: [
          {
            japanese: "まいにちよじにおきます。",
            reading: "Mainichi yo-ji ni okimasu.",
            english: { en: "I wake up at 4 o'clock every day.", np: "हरेक दिन चार बजे उठ्छु।" },
            scenario: { en: "4 o'clock → よじ (not しじ)", np: "४ बजे → よじ (しじ होइन)" },
          },
          {
            japanese: "しちじにしごとをします。",
            reading: "Shichi-ji ni shigoto wo shimasu.",
            english: { en: "I start work at 7 o'clock.", np: "सात बजे काम गर्छु।" },
            scenario: { en: "7 o'clock → しちじ (not ななじ)", np: "७ बजे → しちじ (ななじ होइन)" },
          },
          {
            japanese: "くじからごじまではたらきます。",
            reading: "Ku-ji kara go-ji made hatarakimasu.",
            english: { en: "I work from 9 to 5.", np: "नौ बजेदेखि पाँच बजेसम्म काम गर्छु।" },
            scenario: { en: "9 o'clock → くじ (not きゅうじ)", np: "९ बजे → くじ (きゅうじ होइन)" },
          },
        ],
      },
      {
        number: 2,
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
        number: 3,
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
        number: 4,
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
    youtubeVideoId: { en: "rA9yXCEx668", np: "zqEJ-gJ-9wk" },
    youtubeVideoIdPart2: { en: "fKqLrgODeNM" },
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
        name: { en: "で particle — two uses: place of action & means of transport", np: "で particle — दुई प्रयोग: क्रियाको ठाउँ र यातायातको साधन" },
        meaning: {
          en: "<b>1st use (place of action):</b> で marks WHERE an action happens. Pattern: [place] で [verb]. <b>2nd use (means of transport):</b> で marks HOW you travel. Pattern: [transport] で いきます.",
          np: "<b>पहिलो प्रयोग (क्रियाको ठाउँ):</b> で क्रिया हुने ठाउँ चिन्ह गर्छ। Pattern: [ठाउँ] で [verb]। <b>दोस्रो प्रयोग (यातायातको साधन):</b> で यातायातको साधन चिन्ह गर्छ। Pattern: [यातायात] で いきます।",
        },
        whereWeUse: [
          { en: "1st — place: がっこうでべんきょうします (study at school)", np: "पहिलो — ठाउँ: がっこうでべんきょうします (विद्यालयमा पढ्छु)" },
          { en: "2nd — transport: バスでいきます (go by bus)", np: "दोस्रो — साधन: バスでいきます (बसले जान्छु)" },
          { en: "The same particle で does both jobs — context tells you which meaning applies", np: "एउटै particle で ले दुवै काम गर्छ — context ले अर्थ छुट्याउँछ" },
        ],
        examples: [
          {
            japanese: "レストランでコーヒーをのみます。",
            reading: "Resutoran de kōhī o nomimasu.",
            english: { en: "I drink coffee at the restaurant.", np: "रेस्टुरेन्टमा कफी पिउँछु।" },
            scenario: { en: "1st use — place of action", np: "पहिलो — क्रियाको ठाउँ" },
          },
          {
            japanese: "{電車|でんしゃ}でいきます。",
            reading: "Densha de ikimasu.",
            english: { en: "I go by train.", np: "रेलले जान्छु।" },
            scenario: { en: "2nd use — means of transport", np: "दोस्रो — यातायातको साधन" },
          },
          {
            japanese: "タクシーで{空港|くうこう}へいきます。",
            reading: "Takushī de kūkō e ikimasu.",
            english: { en: "I go to the airport by taxi.", np: "ट्याक्सीले विमानस्थल जान्छु।" },
            scenario: { en: "Transport + destination combined", np: "साधन र गन्तव्य सँगसँगै" },
          },
        ],
      },
      {
        number: 2,
        name: { en: "[Place] へ いきます/きます/かえります — direction of movement", np: "[ठाउँ] へ いきます/きます/かえります — गतिको दिशा" },
        meaning: {
          en: "へ (e) marks the destination — the place you are heading toward. いきます = go (away from speaker), きます = come (toward speaker), かえります = return to one's own home.",
          np: "へ (ए) गन्तव्य चिन्ह गर्छ — कहाँ जाँदैछौ। いきます = जानु (वक्ताबाट टाढा), きます = आउनु (वक्तातर्फ), かえります = आफ्नै घर फर्कनु।",
        },
        whereWeUse: [
          { en: "Going somewhere: がっこうへいきます — I go to school", np: "कहीँ जाँदा: がっこうへいきます — विद्यालय जान्छु" },
          { en: "Coming: せんせいがきます — The teacher is coming", np: "आउँदा: せんせいがきます — शिक्षक आउँदैछन्" },
          { en: "Returning home: うちへかえります — I return home", np: "घर फर्कँदा: うちへかえります — घर फर्कन्छु" },
        ],
        examples: [
          {
            japanese: "がっこうへいきます。",
            reading: "Gakkō e ikimasu.",
            english: { en: "I go to school.", np: "म विद्यालय जान्छु।" },
            scenario: { en: "Destination — school", np: "गन्तव्य — विद्यालय" },
          },
          {
            japanese: "どこへいきますか。",
            reading: "Doko e ikimasu ka?",
            english: { en: "Where are you going?", np: "कहाँ जानुहुन्छ?" },
            scenario: { en: "Asking destination", np: "गन्तव्य सोध्दा" },
          },
          {
            japanese: "うちへかえります。",
            reading: "Uchi e kaerimasu.",
            english: { en: "I return home.", np: "म घर फर्कन्छु।" },
            scenario: { en: "Going back home", np: "घर फर्कँदा" },
          },
        ],
      },
      {
        number: 3,
        name: { en: "と particle — and (listing) / with (companion)", np: "と particle — र (सूची) / सँग (साथी)" },
        meaning: {
          en: "と has two related jobs: (1) <b>connecting nouns</b> — コーヒーとこうちゃ (coffee and tea); (2) <b>marking the companion</b> — ともだちといきます (I go with a friend). ひとりで (alone) is the contrasting expression.",
          np: "と को दुई प्रयोग: (1) <b>noun जोड्न</b> — コーヒーとこうちゃ (कफी र चिया); (2) <b>साथी चिन्ह गर्न</b> — ともだちといきます (साथीसँग जान्छु)। ひとりで (एक्लै) यसको विपरीत अभिव्यक्ति हो।",
        },
        whereWeUse: [
          { en: "List two items: コーヒーとこうちゃ — coffee and tea", np: "दुई वस्तु सूचीमा: コーヒーとこうちゃ — कफी र चिया" },
          { en: "Go with someone: ともだちといきます — I go with a friend", np: "कसैसँग जाँदा: ともだちといきます — साथीसँग जान्छु" },
          { en: "Go alone: ひとりでいきます — (ひとりで uses で, not と)", np: "एक्लै जाँदा: ひとりでいきます — (ひとりで मा で चाहिन्छ, と होइन)" },
        ],
        examples: [
          {
            japanese: "ともだちといきます。",
            reading: "Tomodachi to ikimasu.",
            english: { en: "I go with a friend.", np: "साथीसँग जान्छु।" },
            scenario: { en: "Companion — going with someone", np: "साथी — कोहीसँग जाँदा" },
          },
          {
            japanese: "コーヒーとこうちゃをのみます。",
            reading: "Kōhī to kōcha o nomimasu.",
            english: { en: "I drink coffee and black tea.", np: "कफी र कालो चिया पिउँछु।" },
            scenario: { en: "Listing — two drinks", np: "सूची — दुई पेय" },
          },
          {
            japanese: "ひとりでいきます。",
            reading: "Hitori de ikimasu.",
            english: { en: "I go alone.", np: "एक्लै जान्छु।" },
            scenario: { en: "Going alone (ひとりで)", np: "एक्लै जाँदा" },
          },
        ],
      },
      {
        number: 4,
        name: { en: "いつ — When (question word)", np: "いつ — कहिले (प्रश्नवाचक शब्द)" },
        meaning: {
          en: "いつ = 'when'. Use it to ask about time generally — not a specific clock hour. The answer is a day, date, or time period. Important: いつ does NOT take the particle に.",
          np: "いつ = 'कहिले'। सामान्य समयबारे सोध्न — सटीक घडीको समय होइन। उत्तरमा बार, मिति वा समय अवधि हुन सक्छ। ध्यान: いつ सँग に particle लाग्दैन।",
        },
        whereWeUse: [
          { en: "いつ いきますか — When are you going?", np: "いつ いきますか — कहिले जानुहुन्छ?" },
          { en: "いつ かえりますか — When do you return?", np: "いつ かえりますか — कहिले फर्कनुहुन्छ?" },
          { en: "Note: clock times use に (しちじに) but いつ does NOT take に", np: "घडीको समयमा に लाग्छ (しちじに) तर いつ मा に लाग्दैन" },
        ],
        examples: [
          {
            japanese: "いつ いきますか。",
            reading: "Itsu ikimasu ka?",
            english: { en: "When are you going?", np: "कहिले जानुहुन्छ?" },
            scenario: { en: "Asking when", np: "कहिले सोध्दा" },
          },
          {
            japanese: "あした いきます。",
            reading: "Ashita ikimasu.",
            english: { en: "I am going tomorrow.", np: "भोलि जान्छु।" },
            scenario: { en: "Answering いつ", np: "いつ को जवाफ" },
          },
        ],
      },
      {
        number: 5,
        name: { en: "どうやって — How / By what means", np: "どうやって — कसरी / कुन तरिकाले" },
        meaning: {
          en: "どうやって = 'how' or 'by what means'. Use it to ask HOW someone travels or gets somewhere. The answer pairs with で: バスで (by bus), でんしゃで (by train), あるいて (on foot — no で).",
          np: "どうやって = 'कसरी'। कोही कसरी यात्रा गर्छ वा कहीँ पुग्छ सोध्न प्रयोग गर्नुस्। उत्तरमा で प्रयोग हुन्छ: バスで, でんしゃで, आदि। पैदल: あるいて (で छैन)।",
        },
        whereWeUse: [
          { en: "Asking means: どうやって いきますか — How do you get there?", np: "साधन सोध्न: どうやって いきますか — कसरी जानुहुन्छ?" },
          { en: "Answer with transport で: バスでいきます — I go by bus", np: "यातायात で सँग उत्तर: バスでいきます — बसले जान्छु" },
          { en: "On foot: あるいていきます — no で needed", np: "पैदल: あるいていきます — で चाहिँदैन" },
        ],
        examples: [
          {
            japanese: "どうやって いきますか。",
            reading: "Dō yatte ikimasu ka?",
            english: { en: "How do you get there?", np: "कसरी जानुहुन्छ?" },
            scenario: { en: "Asking about transport means", np: "यातायातको साधन सोध्दा" },
          },
          {
            japanese: "{電車|でんしゃ}でいきます。",
            reading: "Densha de ikimasu.",
            english: { en: "I go by train.", np: "रेलले जान्छु।" },
            scenario: { en: "Answering どうやって", np: "どうやって को जवाफ" },
          },
          {
            japanese: "あるいていきます。",
            reading: "Aruite ikimasu.",
            english: { en: "I walk there.", np: "पैदल जान्छु।" },
            scenario: { en: "On foot — no で", np: "पैदल — で छैन" },
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
    youtubeVideoId: { en: "bF8pOPGOav4", np: "1Cjf5eoer5Q" },
    youtubeVideoIdPart2: { en: "eiwajswYBvU" },
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
        name: { en: "V てください / V て — polite vs casual requests", np: "V てください / V て — विनम्र र अनौपचारिक अनुरोध" },
        meaning: {
          en: "て-form + ください = polite request ('Please do…'). て-form alone = casual request used with close friends or family. The て-form is the verb's connective form; it is the same for both.",
          np: "て-form + ください = विनम्र अनुरोध ('गर्नुहोस् / दिनुहोस्')। て-form मात्र = अनौपचारिक अनुरोध — घनिष्ठ साथी वा परिवारसँग। て-form दुवैमा एउटै हुन्छ।",
        },
        whereWeUse: [
          { en: "Polite: たべてください — Please eat (to a guest / superior)", np: "विनम्र: たべてください — खानुहोस् (पाहुना वा माथिल्लोलाई)" },
          { en: "Casual: たべて — Eat! (to a friend / younger person)", np: "अनौपचारिक: たべて — खा! (साथी वा सानोलाई)" },
          { en: "Both use the same て-form — only the ending changes", np: "दुवैमा एउटै て-form — अन्त्य मात्र फरक हुन्छ" },
        ],
        examples: [
          {
            japanese: "これを たべてください。",
            reading: "Kore o tabete kudasai.",
            english: { en: "Please eat this.", np: "यो खानुहोस्।" },
            scenario: { en: "Polite request to a guest", np: "पाहुनालाई विनम्र अनुरोध" },
          },
          {
            japanese: "ちょっと まってください。",
            reading: "Chotto matte kudasai.",
            english: { en: "Please wait a moment.", np: "एक छिन पर्खनुहोस्।" },
            scenario: { en: "Polite — asking someone to wait", np: "विनम्र — पर्खन भन्दा" },
          },
          {
            japanese: "みて！",
            reading: "Mite!",
            english: { en: "Look! / Watch!", np: "हेर!" },
            scenario: { en: "Casual request — te-form alone", np: "अनौपचारिक — て-form मात्र" },
          },
        ],
      },
      {
        number: 2,
        name: { en: "V ましょう / V ましょうか — Let's… / Shall we…?", np: "V ましょう / V ましょうか — जाउँ / जाउँ कि?" },
        meaning: {
          en: "〜ましょう = 'Let's…' — confident proposal to do something together. 〜ましょうか = 'Shall we…?' — softer, leaving the decision open. Both use the verb stem.",
          np: "〜ましょう = 'जाउँ' — सँगसँगै केही गर्ने आत्मविश्वासी प्रस्ताव। 〜ましょうか = 'जाउँ कि?' — नरम, निर्णय खुला राख्ने। दुवै verb stem बाट बन्छन्।",
        },
        whereWeUse: [
          { en: "いきましょう — Let's go", np: "いきましょう — जाउँ" },
          { en: "たべましょう — Let's eat", np: "たべましょう — खाउँ" },
          { en: "～ましょうか — milder, asking Shall we?: いきましょうか — Shall we go?", np: "〜ましょうか — नरम प्रश्न: いきましょうか — जाउँ कि?" },
        ],
        examples: [
          {
            japanese: "そこで たべましょう。",
            reading: "Soko de tabemashō.",
            english: { en: "Let's eat there.", np: "त्यहीँ खाउँ।" },
            scenario: { en: "Agreeing on a plan", np: "योजनामा सहमत हुँदा" },
          },
          {
            japanese: "また こんど いきましょう。",
            reading: "Mata kondo ikimashō.",
            english: { en: "Let's go another time.", np: "अर्को पटक जाउँ।" },
            scenario: { en: "Deferring a plan", np: "योजना पर सार्दा" },
          },
          {
            japanese: "コーヒーを のみましょうか。",
            reading: "Kōhī o nomimashō ka?",
            english: { en: "Shall we have some coffee?", np: "कफी पिउँ कि?" },
            scenario: { en: "Soft suggestion", np: "नरम सुझाव" },
          },
        ],
      },
      {
        number: 3,
        name: { en: "N を V — object marker を", np: "N を V — कर्म marker を" },
        meaning: {
          en: "を (o) marks the DIRECT OBJECT of an action — the thing being eaten, drunk, watched, read, bought, etc. Pattern: [noun] を [verb]. を is never stressed in speech.",
          np: "を ले कार्यको प्रत्यक्ष कर्म चिन्ह गर्छ — के खाइन्छ, पिइन्छ, हेरिन्छ, पढिन्छ, किनिन्छ, आदि। Pattern: [noun] を [verb]। बोल्दा を मा जोड नदिनुस्।",
        },
        whereWeUse: [
          { en: "コーヒーをのみます — drink coffee (を marks coffee as the thing drunk)", np: "コーヒーをのみます — कफी पिउँछु (を ले कफी कर्म हो)" },
          { en: "テレビをみます — watch TV", np: "テレビをみます — टिभी हेर्छु" },
          { en: "サッカーをします — play soccer (N をします = do/play N)", np: "サッカーをします — फुटबल खेल्छु (N をします = N गर्छु)" },
        ],
        examples: [
          {
            japanese: "コーヒーを のみます。",
            reading: "Kōhī o nomimasu.",
            english: { en: "I drink coffee.", np: "कफी पिउँछु।" },
            scenario: { en: "Drinking — を for object", np: "पिउँदा — कर्म को लागि を" },
          },
          {
            japanese: "テレビを みます。",
            reading: "Terebi o mimasu.",
            english: { en: "I watch TV.", np: "टिभी हेर्छु।" },
            scenario: { en: "Watching — を for object", np: "हेर्दा — कर्म को लागि を" },
          },
          {
            japanese: "こうえんで サッカーを します。",
            reading: "Kōen de sakkā o shimasu.",
            english: { en: "I play soccer at the park.", np: "पार्कमा फुटबल खेल्छु।" },
            scenario: { en: "N をします + place で", np: "N をします + ठाउँ で" },
          },
        ],
      },
      {
        number: 4,
        name: { en: "N で V — place of action (2nd use of で)", np: "N で V — क्रियाको ठाउँ (で को दोस्रो प्रयोग)" },
        meaning: {
          en: "で marks WHERE the action happens — 'at', 'in'. This is different from the Chapter 5 use (transport means). Context — if で follows a place name it means location; if it follows a vehicle it means transport.",
          np: "で ले क्रिया हुने ठाउँ चिन्ह गर्छ — 'मा'। यो Chapter 5 को प्रयोग (यातायात साधन) भन्दा फरक हो। Context: で ले ठाउँ अनुसरण गर्छ भने ठाउँ, गाडी अनुसरण गर्छ भने साधन।",
        },
        whereWeUse: [
          { en: "レストランでたべます — eat at the restaurant (place of action)", np: "レストランでたべます — रेस्टुरेन्टमा खान्छु (क्रियाको ठाउँ)" },
          { en: "がっこうでべんきょうします — study at school", np: "がっこうでべんきょうします — विद्यालयमा पढ्छु" },
          { en: "Contrast: バスでいきます — go BY bus (transport); うちでたべます — eat AT home (place)", np: "तुलना: バスでいきます — बसले (साधन); うちでたべます — घरमा (ठाउँ)" },
        ],
        examples: [
          {
            japanese: "レストランで パスタを たべます。",
            reading: "Resutoran de pasuta o tabemasu.",
            english: { en: "I eat pasta at the restaurant.", np: "रेस्टुरेन्टमा पास्ता खान्छु।" },
            scenario: { en: "Place of eating", np: "खाने ठाउँ" },
          },
          {
            japanese: "としょかんで べんきょうします。",
            reading: "Toshokan de benkyō shimasu.",
            english: { en: "I study at the library.", np: "पुस्तकालयमा पढ्छु।" },
            scenario: { en: "Place of studying", np: "पढ्ने ठाउँ" },
          },
          {
            japanese: "こうえんで しゃしんを とります。",
            reading: "Kōen de shashin o torimasu.",
            english: { en: "I take photos at the park.", np: "पार्कमा फोटो खिच्छु।" },
            scenario: { en: "Activity at a place", np: "ठाउँमा गतिविधि" },
          },
        ],
      },
      {
        number: 5,
        name: { en: "何 (なに/なん) — what (question word)", np: "何 (なに/なん) — के (प्रश्नवाचक शब्द)" },
        meaning: {
          en: "何 = 'what'. Read なに before を/が/も; read なん before counter words (じ, かい, ようび). Common question patterns: なにをしますか (what will you do?), なんじですか (what time is it?), なんようびですか (what day is it?).",
          np: "何 = 'के'। を/が/も अगाडि なに पढ्नुस्; counter words (じ, かい, ようび) अगाडि なん पढ्नुस्। सामान्य प्रश्न: なにをしますか (के गर्नुहुन्छ?), なんじですか (कति बजे?), なんようびですか (कुन बार?)।",
        },
        whereWeUse: [
          { en: "なにをしますか — What will you do?", np: "なにをしますか — के गर्नुहुन्छ?" },
          { en: "なんじですか — What time is it?", np: "なんじですか — कति बज्यो?" },
          { en: "なんようびですか — What day of the week is it?", np: "なんようびですか — आज कुन बार हो?" },
        ],
        examples: [
          {
            japanese: "なにを たべますか。",
            reading: "Nani o tabemasu ka?",
            english: { en: "What will you eat?", np: "के खानुहुन्छ?" },
            scenario: { en: "Asking what to eat", np: "के खाने सोध्दा" },
          },
          {
            japanese: "なんじに いきますか。",
            reading: "Nan-ji ni ikimasu ka?",
            english: { en: "What time are you going?", np: "कति बजे जानुहुन्छ?" },
            scenario: { en: "Asking the time of departure", np: "जाने समय सोध्दा" },
          },
          {
            japanese: "きょうは なんようびですか。",
            reading: "Kyō wa nan-yōbi desu ka?",
            english: { en: "What day is it today?", np: "आज कुन बार हो?" },
            scenario: { en: "Asking the day", np: "बार सोध्दा" },
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
    youtubeVideoId: { en: "K0mndPgSRHc", np: "U8GSSAK53hc" },
    youtubeVideoIdPart2: { en: "Q5FbKkaoj6A" },
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
        name: { en: "に particle — recipient of giving, sending, teaching, calling", np: "に particle — दिने, पठाउने, सिकाउने, फोन गर्ने कार्यको प्राप्तकर्ता" },
        meaning: {
          en: "に marks the RECIPIENT — the person who receives the action. It works with: あげます (give to), おくります (send to), おしえます (teach to), かします (lend to), でんわをかけます (call someone). Pattern: [person] に [object] を [verb].",
          np: "に ले प्राप्तकर्ता चिन्ह गर्छ — कसले कार्य पाउँछ। यी verb सँग काम गर्छ: あげます (दिन), おくります (पठाउन), おしえます (सिकाउन), かします (सापटी दिन), でんわをかけます (फोन गर्न)। Pattern: [व्यक्ति] に [वस्तु] を [verb]।",
        },
        whereWeUse: [
          { en: "Giving: ともだちにプレゼントをあげます — I give a present to my friend", np: "दिँदा: ともだちにプレゼントをあげます — साथीलाई उपहार दिन्छु" },
          { en: "Sending: ははにてがみをおくります — I send a letter to my mother", np: "पठाउँदा: ははにてがみをおくります — आमालाई चिठी पठाउँछु" },
          { en: "Calling: がっこうにでんわをかけます — I call the school", np: "फोन गर्दा: がっこうにでんわをかけます — विद्यालयमा फोन गर्छु" },
        ],
        examples: [
          {
            japanese: "ともだちに プレゼントを あげます。",
            reading: "Tomodachi ni purezento o agemasu.",
            english: { en: "I give a present to my friend.", np: "साथीलाई उपहार दिन्छु।" },
            scenario: { en: "に — recipient of giving", np: "に — दिने कार्यको प्राप्तकर्ता" },
          },
          {
            japanese: "{母|はは}に てがみを おくります。",
            reading: "Haha ni tegami o okurimasu.",
            english: { en: "I send a letter to my mother.", np: "आमालाई चिठी पठाउँछु।" },
            scenario: { en: "に — recipient of sending", np: "に — पठाउने कार्यको प्राप्तकर्ता" },
          },
          {
            japanese: "がっこうに でんわを かけます。",
            reading: "Gakkō ni denwa o kakemasu.",
            english: { en: "I make a phone call to the school.", np: "विद्यालयमा फोन गर्छु।" },
            scenario: { en: "に — person/place being called", np: "に — फोन गरिने व्यक्ति/ठाउँ" },
          },
        ],
      },
      {
        number: 2,
        name: { en: "から particle — source of receiving", np: "から particle — पाउने स्रोत" },
        meaning: {
          en: "から marks the SOURCE — the person you receive something FROM. It works with もらいます (receive). Pattern: [person] から [object] を もらいます. Note: に can also replace から with もらいます, but から is more natural.",
          np: "から ले स्रोत चिन्ह गर्छ — कसबाट पाउँछौ। もらいます सँग काम गर्छ। Pattern: [व्यक्ति] から [वस्तु] を もらいます। ध्यान: に ले पनि から को सट्टा हुन सक्छ तर から अधिक स्वाभाविक।",
        },
        whereWeUse: [
          { en: "ともだちからプレゼントをもらいます — I receive a present from my friend", np: "ともだちからプレゼントをもらいます — साथीबाट उपहार पाउँछु" },
          { en: "ははからはなをもらいました — I received flowers from my mother (past)", np: "ははからはなをもらいました — आमाबाट फूल पाएँ (भूतकाल)" },
        ],
        examples: [
          {
            japanese: "ともだちから プレゼントを もらいます。",
            reading: "Tomodachi kara purezento o moraimasu.",
            english: { en: "I receive a present from my friend.", np: "साथीबाट उपहार पाउँछु।" },
            scenario: { en: "から — source of gift", np: "から — उपहारको स्रोत" },
          },
          {
            japanese: "{母|はは}から {花|はな}を もらいました。",
            reading: "Haha kara hana o moraimashita.",
            english: { en: "I received flowers from my mother.", np: "आमाबाट फूल पाएँ।" },
            scenario: { en: "から — past receiving", np: "から — भूतकालमा पाएको" },
          },
        ],
      },
      {
        number: 3,
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
        number: 4,
        name: { en: "もう〜ました / まだ〜です — already done / not yet", np: "もう〜ました / まだ〜です — पहिले नै भयो / अझै भएको छैन" },
        meaning: {
          en: "もう + past verb = 'already (done)'. まだです = 'not yet' (short answer). In a question: もう〜ましたか = 'Have you already…?'. Yes answer: はい、もう〜ました. No answer: いいえ、まだです.",
          np: "もう + past verb = 'पहिले नै (भयो)'। まだです = 'अझै होइन' (छोटो उत्तर)। प्रश्नमा: もう〜ましたか = 'पहिले नै...भयो?'। हो: はい、もう〜ました। होइन: いいえ、まだです।",
        },
        whereWeUse: [
          { en: "もう ごはんをたべましたか — Have you already eaten? (खाना खाइसक्नुभयो?)", np: "もう ごはんをたべましたか — खाना खाइसक्नुभयो?" },
          { en: "Yes: はい、もうたべました — Yes, I have already eaten", np: "हो: はい、もうたべました — हो, खाइसकें" },
          { en: "No: いいえ、まだです — No, not yet", np: "होइन: いいえ、まだです — होइन, अझै खाइनँ" },
        ],
        examples: [
          {
            japanese: "もう ごはんを たべましたか。",
            reading: "Mō gohan o tabemashita ka?",
            english: { en: "Have you already eaten? (खाना खाइसक्नुभयो?)", np: "खाना खाइसक्नुभयो?" },
            scenario: { en: "Asking if someone already ate", np: "खाना खाइसक्यो सोध्दा" },
          },
          {
            japanese: "はい、もう たべました。",
            reading: "Hai, mō tabemashita.",
            english: { en: "Yes, I have already eaten.", np: "हो, खाइसकें।" },
            scenario: { en: "Confirming already done", np: "पहिले नै भयो भन्दा" },
          },
          {
            japanese: "いいえ、まだです。",
            reading: "Iie, mada desu.",
            english: { en: "No, not yet.", np: "होइन, अझै।" },
            scenario: { en: "Not yet done", np: "अझै भएको छैन" },
          },
        ],
      },
      {
        number: 5,
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
  // ─── WEEK 2 ───────────────────────────────────────────────────────────────
  {
    id: 8,
    title: "Lesson 8 — い・な けいようし (Adjectives)",
    intro: [
      {
        en: "In this lesson you learn two types of Japanese adjectives: い-adjectives (おいしい, あたらしい) and な-adjectives (きれい, しずか). Both can describe nouns or act as sentence predicates.",
        np: "यस पाठमा जापानी भाषाका दुई प्रकारका विशेषणहरू सिक्नुहुनेछ: い-विशेषण (おいしい, あたらしい) र な-विशेषण (きれい, しずか)। दुवैले noun अगाडि र predicate रूपमा प्रयोग हुन्छन्।",
      },
      {
        en: "い-adjectives conjugate by changing their い ending: negative → くない、past → かった、past-neg → くなかった. な-adjectives follow the noun pattern: negative → じゃありません、past → でした.",
        np: "い-विशेषणको い ending फेरिन्छ: नकार → くない、भूत → かった、भूत-नकार → くなかった। な-विशेषण Noun जस्तो: नकार → じゃありません、भूत → でした।",
      },
      {
        en: "Before a noun: い-adj attaches directly (あたらしいかばん), but な-adj needs な (きれいなへや). Use とても for 'very' and あまり only with negatives for 'not very'.",
        np: "Noun अगाडि: い-adj सिधै जोडिन्छ (あたらしいかばん), तर な-adj ले な चाहिन्छ (きれいなへや)। 'धेरै' को लागि とても, नकारसँग 'त्यति होइन' को लागि あまり।",
      },
    ],
    youtubeVideoId: { en: "J6E5VTFtXAs" },
    youtubeVideoIdPart2: { en: "6HCkKy_VTFU" },
    youtubeTitle: "Minna no Nihongo · Lesson 8 — Grammar",
    conversation: [
      {
        speaker: "A",
        japanese: "このへやはとてもひろいですね。",
        reading: "Kono heya wa totemo hiroi desu ne.",
        english: { en: "This room is very spacious, isn't it.", np: "यो कोठा धेरै ठूलो छ, हगि।" },
      },
      {
        speaker: "B",
        japanese: "そうですね。でも、すこしくらいです。",
        reading: "Sō desu ne. Demo, sukoshi kurai desu.",
        english: { en: "Yes. But it is a little dark.", np: "हो। तर अलिकति अँध्यारो छ।" },
      },
      {
        speaker: "A",
        japanese: "そのかばんはあたらしいですか。",
        reading: "Sono kaban wa atarashii desu ka?",
        english: { en: "Is that bag new?", np: "त्यो झोला नयाँ हो?" },
      },
      {
        speaker: "B",
        japanese: "いいえ、あたらしくないです。ふるいですが、きれいです。",
        reading: "Iie, atarashiku nai desu. Furui desu ga, kirei desu.",
        english: { en: "No, it is not new. It is old but pretty.", np: "होइन, नयाँ होइन। पुरानो छ तर राम्रो छ।" },
      },
      {
        speaker: "A",
        japanese: "たかかったですか。",
        reading: "Takakatta desu ka?",
        english: { en: "Was it expensive?", np: "महँगो थियो?" },
      },
      {
        speaker: "B",
        japanese: "いいえ、やすかったです。セールでかいました。",
        reading: "Iie, yasukatta desu. Sēru de kaimashita.",
        english: { en: "No, it was cheap. I bought it on sale.", np: "होइन, सस्तो थियो। सेलमा किनें।" },
      },
    ],
    grammar: [
      {
        number: 1,
        name: { en: "い-adj — positive / negative / past / past-neg", np: "い-विशेषण — सकारात्मक / नकारात्मक / भूत / भूत-नकार" },
        meaning: {
          en: "い-adj ends in い. Remove い to get the stem, then attach the ending. Positive: [adj]い + です. Negative: [stem]くないです. Past: [stem]かったです. Past-neg: [stem]くなかったです.",
          np: "い-adj, い मा समाप्त हुन्छ। い हटाएर stem पाइन्छ। सकारात्मक: [adj]い + です। नकार: [stem]くないです। भूत: [stem]かったです। भूत-नकार: [stem]くなかったです।",
        },
        whereWeUse: [
          { en: "おいしい → neg: おいしくないです", np: "おいしい → नकार: おいしくないです" },
          { en: "おいしい → past: おいしかったです", np: "おいしい → भूत: おいしかったです" },
          { en: "おいしい → past-neg: おいしくなかったです", np: "おいしい → भूत-नकार: おいしくなかったです" },
        ],
        examples: [
          {
            japanese: "このりょうりはおいしいです。",
            reading: "Kono ryōri wa oishii desu.",
            english: { en: "This dish is delicious.", np: "यो खाना मिठो छ।" },
            scenario: { en: "Positive い-adj predicate", np: "सकारात्मक い-adj predicate" },
          },
          {
            japanese: "このりょうりはおいしくないです。",
            reading: "Kono ryōri wa oishiku nai desu.",
            english: { en: "This dish is not delicious.", np: "यो खाना मिठो छैन।" },
            scenario: { en: "Negative い-adj", np: "नकारात्मक い-adj" },
          },
          {
            japanese: "そのケーキはおいしかったです。",
            reading: "Sono kēki wa oishikatta desu.",
            english: { en: "That cake was delicious.", np: "त्यो केक मिठो थियो।" },
            scenario: { en: "Past い-adj", np: "भूत い-adj" },
          },
        ],
      },
      {
        number: 2,
        name: { en: "な-adj — positive / negative / past / past-neg", np: "な-विशेषण — सकारात्मक / नकारात्मक / भूत / भूत-नकार" },
        meaning: {
          en: "な-adj behave like nouns with です. Positive: [adj]です. Negative: [adj]じゃありません. Past: [adj]でした. Past-neg: [adj]じゃありませんでした. KEY: きれい ends in い but is a な-adj — a common mistake.",
          np: "な-adj, Noun जस्तै です सँग। सकारात्मक: [adj]です। नकार: [adj]じゃありません। भूत: [adj]でした। भूत-नकार: [adj]じゃありませんでした। महत्त्वपूर्ण: きれい, い मा अन्त्य भए पनि な-adj हो।",
        },
        whereWeUse: [
          { en: "きれい → neg: きれいじゃありません", np: "きれい → नकार: きれいじゃありません" },
          { en: "きれい → past: きれいでした", np: "きれい → भूत: きれいでした" },
          { en: "しずか → past-neg: しずかじゃありませんでした", np: "しずか → भूत-नकार: しずかじゃありませんでした" },
        ],
        examples: [
          {
            japanese: "このへやはきれいです。",
            reading: "Kono heya wa kirei desu.",
            english: { en: "This room is clean/pretty.", np: "यो कोठा सफा/राम्रो छ।" },
            scenario: { en: "Positive な-adj predicate", np: "सकारात्मक な-adj predicate" },
          },
          {
            japanese: "このへやはきれいじゃありません。",
            reading: "Kono heya wa kirei ja arimasen.",
            english: { en: "This room is not clean.", np: "यो कोठा सफा छैन।" },
            scenario: { en: "Negative な-adj", np: "नकारात्मक な-adj" },
          },
          {
            japanese: "そのこうえんはしずかでした。",
            reading: "Sono kōen wa shizuka deshita.",
            english: { en: "That park was quiet.", np: "त्यो पार्क शान्त थियो।" },
            scenario: { en: "Past な-adj", np: "भूत な-adj" },
          },
        ],
      },
      {
        number: 3,
        name: { en: "[い-adj]+N  vs  [な-adj]+な+N — pre-noun position", np: "[い-adj]+N  vs  [な-adj]+な+N — Noun अगाडि विशेषण" },
        meaning: {
          en: "Before a noun, い-adj attach directly (あたらしいかばん). な-adj require な (きれいなへや). This な is NOT the copula — it links the な-adj to the noun.",
          np: "Noun अगाडि い-adj सिधै जोडिन्छ (あたらしいかばん)। な-adj ले な चाहिन्छ (きれいなへや)। यो な Copula होइन — な-adj लाई Noun सँग जोड्ने particle हो।",
        },
        whereWeUse: [
          { en: "い-adj + noun: おいしい + ケーキ = おいしいケーキ", np: "い-adj + noun: おいしい + ケーキ = おいしいケーキ" },
          { en: "な-adj + な + noun: きれい + な + へや = きれいなへや", np: "な-adj + な + noun: きれい + な + へや = きれいなへや" },
          { en: "Good → いい (pre-noun stays いい; negated/past use よ- stem)", np: "Good → いい (Noun अगाडि いい; conjugated रूप よ- stem)" },
        ],
        examples: [
          {
            japanese: "あたらしいかばんをかいました。",
            reading: "Atarashii kaban o kaimashita.",
            english: { en: "I bought a new bag.", np: "नयाँ झोला किनें।" },
            scenario: { en: "い-adj directly before noun", np: "Noun अगाडि い-adj" },
          },
          {
            japanese: "きれいなへやですね。",
            reading: "Kirei na heya desu ne.",
            english: { en: "What a clean room!", np: "सफा कोठा छ, हगि!" },
            scenario: { en: "な-adj + な before noun", np: "Noun अगाडि な-adj + な" },
          },
          {
            japanese: "しずかなとしょかんでべんきょうします。",
            reading: "Shizuka na toshokan de benkyō shimasu.",
            english: { en: "I study at a quiet library.", np: "शान्त पुस्तकालयमा पढ्छु।" },
            scenario: { en: "な-adj modifying a place noun", np: "ठाउँको Noun अगाडि な-adj" },
          },
        ],
      },
      {
        number: 4,
        name: { en: "とても / あまり — degree adverbs", np: "とても / あまり — मात्रा जनाउने शब्द" },
        meaning: {
          en: "とても (very) intensifies positive or negative adjectives. あまり (not very) is used ONLY with negative forms. Never say あまりおいしいです — always pair あまり with a negative: あまりおいしくないです.",
          np: "とても (धेरै) सकारात्मक वा नकारात्मक विशेषण दुवैमा। あまり (त्यति होइन) नकारात्मक रूपसँग मात्र। あまりおいしいです कहिल्यै नभन्नुस् — सधैं あまり + नकार: あまりおいしくないです।",
        },
        whereWeUse: [
          { en: "とても + positive adj: とてもおいしいです (very delicious)", np: "とても + सकारात्मक: とてもおいしいです (धेरै मिठो)" },
          { en: "あまり + negative adj: あまりおいしくないです (not very delicious)", np: "あまり + नकारात्मक: あまりおいしくないです (त्यति मिठो छैन)" },
          { en: "あまり + な-adj negative: あまりしずかじゃないです", np: "あまり + な-adj नकार: あまりしずかじゃないです" },
        ],
        examples: [
          {
            japanese: "このケーキはとてもおいしいです。",
            reading: "Kono kēki wa totemo oishii desu.",
            english: { en: "This cake is very delicious.", np: "यो केक धेरै मिठो छ।" },
            scenario: { en: "とても with positive い-adj", np: "सकारात्मक い-adj सँग とても" },
          },
          {
            japanese: "このえいがはあまりおもしろくないです。",
            reading: "Kono eiga wa amari omoshiroku nai desu.",
            english: { en: "This movie is not very interesting.", np: "यो चलचित्र त्यति रोचक छैन।" },
            scenario: { en: "あまり with negative い-adj", np: "नकारात्मक い-adj सँग あまり" },
          },
          {
            japanese: "そのまちはとてもにぎやかです。",
            reading: "Sono machi wa totemo nigiyaka desu.",
            english: { en: "That town is very lively.", np: "त्यो सहर धेरै चहलपहल छ।" },
            scenario: { en: "とても with な-adj", np: "な-adj सँग とても" },
          },
        ],
      },
      {
        number: 5,
        name: { en: "いい (good) — irregular conjugation", np: "いい (राम्रो) — अनियमित conjugation" },
        meaning: {
          en: "いい uses よ- as the conjugation stem, NOT い-. Negative: よくない. Past: よかった. Past-neg: よくなかった. Only the plain positive form is いい; all other forms come from よ-.",
          np: "いい को conjugation stem, い- होइन, よ- हो। नकार: よくない। भूत: よかった। भूत-नकार: よくなかった। Plain positive मात्र いい; बाँकी सब よ- बाट।",
        },
        whereWeUse: [
          { en: "positive: いいです (it's good)", np: "सकारात्मक: いいです (राम्रो छ)" },
          { en: "negative: よくないです (it's not good)", np: "नकारात्मक: よくないです (राम्रो छैन)" },
          { en: "past: よかったです (it was good)", np: "भूत: よかったです (राम्रो थियो)" },
        ],
        examples: [
          {
            japanese: "てんきがよくなかったです。",
            reading: "Tenki ga yoku nakatta desu.",
            english: { en: "The weather was not good.", np: "मौसम राम्रो थिएन।" },
            scenario: { en: "Past-negative: よくなかった", np: "भूत-नकार: よくなかった" },
          },
          {
            japanese: "きのうのえいがはよかったです。",
            reading: "Kinō no eiga wa yokatta desu.",
            english: { en: "Yesterday's movie was good.", np: "हिजोको चलचित्र राम्रो थियो।" },
            scenario: { en: "Past: よかった", np: "भूत: よかった" },
          },
          {
            japanese: "このかばんはいいですね。",
            reading: "Kono kaban wa ii desu ne.",
            english: { en: "This bag is nice, isn't it.", np: "यो झोला राम्रो छ, हगि।" },
            scenario: { en: "Positive stays いい (not よい)", np: "Positive, いい नै रहन्छ (よい होइन)" },
          },
        ],
      },
    ],
    particles: [
      {
        particle: "が",
        romaji: "ga",
        name: { en: "Subject marker (adj / weather / feelings)", np: "कर्ता Marker (विशेषण / मौसम / भावना)" },
        meaning: {
          en: "が marks the grammatical subject — particularly in sentences about weather, feelings, and descriptions. It highlights new or contrastive information, while は marks the ongoing topic.",
          np: "が ले व्याकरणिक subject चिन्ह गर्छ — विशेष गरी मौसम, भावना र वर्णनका वाक्यमा। नयाँ वा contrast information उजागर गर्छ, जबकि は ongoing topic हो।",
        },
        examples: [
          {
            japanese: "てんきがいいです。",
            reading: "Tenki ga ii desu.",
            english: { en: "The weather is nice.", np: "मौसम राम्रो छ।" },
            scenario: { en: "が marking weather as subject", np: "मौसमलाई subject चिन्ह" },
          },
          {
            japanese: "このへやはひろいですが、くらいです。",
            reading: "Kono heya wa hiroi desu ga, kurai desu.",
            english: { en: "This room is spacious, but dark.", np: "यो कोठा ठूलो छ, तर अँध्यारो छ।" },
            scenario: { en: "が as 'but' connector between clauses", np: "खण्डहरू जोड्ने が" },
          },
        ],
      },
    ],
    vocabulary: buildVocab(8),
    mcqs: [
      {
        question: { en: "What is the negative form of おいしい?", np: "おいしい को नकारात्मक रूप के हो?" },
        choices: ["おいしくないです", "おいしいじゃないです", "おいしくないます", "おいしいではないです"],
        correctIndex: 0,
        explanation: { en: "い-adj negative = [stem]くないです. Remove い → おいし + くない + です.", np: "い-adj नकार = [stem]くないです। い हटाउनुस् → おいし + くない + です।" },
      },
      {
        question: { en: "What is the past form of やすい?", np: "やすい को भूत रूप के हो?" },
        choices: ["やすかったです", "やすいでした", "やすくでした", "やすかったます"],
        correctIndex: 0,
        explanation: { en: "い-adj past = [stem]かったです. Remove い → やす + かった + です = やすかったです.", np: "い-adj भूत = [stem]かったです। い हटाउनुस् → やす + かった + です = やすかったです।" },
      },
      {
        question: { en: "How do you say 'a quiet room' in Japanese?", np: "'शान्त कोठा' जापानीमा कसरी भनिन्छ?" },
        choices: ["しずかなへや", "しずかいへや", "しずかへや", "しずかのへや"],
        correctIndex: 0,
        explanation: { en: "な-adj before a noun requires な: しずか + な + へや = しずかなへや.", np: "Noun अगाडि な-adj ले な चाहिन्छ: しずか + な + へや = しずかなへや।" },
      },
      {
        question: { en: "Which word is a な-adjective even though it ends in い?", np: "い मा अन्त्य भए पनि कुन शब्द な-विशेषण हो?" },
        choices: ["きれい", "あたらしい", "おいしい", "おおきい"],
        correctIndex: 0,
        explanation: { en: "きれい is a な-adj despite ending in い — a classic trap. あたらしい, おいしい, おおきい are genuine い-adj.", np: "きれい な-adj हो भले पनि い मा अन्त्य — सामान्य गल्ती। あたらしい, おいしい, おおきい सच्चा い-adj।" },
      },
      {
        question: { en: "Complete: このへやは _____ きれいです。(This room is VERY clean.)", np: "पूरा गर्नुस्: このへやは _____ きれいです।" },
        choices: ["とても", "あまり", "あまりも", "ぜんぜん"],
        correctIndex: 0,
        explanation: { en: "とても (very) pairs with positive forms. あまり pairs ONLY with negatives.", np: "とても (धेरै) सकारात्मक रूपसँग। あまり नकारसँग मात्र।" },
      },
      {
        question: { en: "The past negative of いい is…?", np: "いい को भूत नकारात्मक रूप के हो?" },
        choices: ["よくなかったです", "いいくなかったです", "いくなかったです", "よいじゃなかったです"],
        correctIndex: 0,
        explanation: { en: "いい is irregular. Its stem is よ-. Past-neg = よくなかった + です.", np: "いい अनियमित। Stem = よ-। भूत-नकार = よくなかった + です।" },
      },
      {
        question: { en: "Which sentence correctly uses あまり?", np: "あまり सही प्रयोग भएको वाक्य कुन हो?" },
        choices: [
          "このえいがはあまりおもしろくないです",
          "このえいがはあまりおもしろいです",
          "このえいがはあまりです",
          "このえいがはとてもあまりおもしろいです",
        ],
        correctIndex: 0,
        explanation: { en: "あまり must pair with a NEGATIVE form. あまりおもしろくない is correct; あまりおもしろい is wrong.", np: "あまり नकारात्मक रूपसँग मात्र। あまりおもしろくない सही; あまりおもしろい गलत।" },
      },
      {
        question: { en: "What does きれいなへや mean?", np: "きれいなへや को अर्थ के हो?" },
        choices: [
          { en: "A clean/pretty room", np: "सफा/राम्रो कोठा" },
          { en: "A clean person", np: "सफा मान्छे" },
          { en: "The room is clean (predicate)", np: "कोठा सफा छ (predicate)" },
          { en: "A very clean room", np: "धेरै सफा कोठा" },
        ],
        correctIndex: 0,
        explanation: { en: "きれいな + へや = 'clean/pretty room'. な links the な-adj to the noun it modifies (pre-noun position).", np: "きれいな + へや = 'सफा/राम्रो कोठा'। な ले な-adj लाई modify हुने Noun सँग जोड्छ।" },
      },
      {
        question: { en: "What is the past-negative of ふるい?", np: "ふるい को भूत-नकारात्मक रूप के हो?" },
        choices: ["ふるくなかったです", "ふるくないでした", "ふるいじゃなかったです", "ふるかったじゃないです"],
        correctIndex: 0,
        explanation: { en: "い-adj past-neg = [stem]くなかった + です. ふるい → ふるくなかったです.", np: "い-adj भूत-नकार = [stem]くなかった + です। ふるい → ふるくなかったです।" },
      },
      {
        question: { en: "Which adjective type adds な directly before a noun?", np: "कुन प्रकारको विशेषणले Noun अगाडि な थप्छ?" },
        choices: [
          { en: "な-adjectives (e.g. きれい, しずか, げんき)", np: "な-विशेषण (जस्तै きれい, しずか, げんき)" },
          { en: "い-adjectives (e.g. おおきい, たかい)", np: "い-विशेषण (जस्तै おおきい, たかい)" },
          { en: "All adjectives add な", np: "सबै विशेषणले な थप्छन्" },
          { en: "No adjective needs な", np: "कुनैले な थप्दैन" },
        ],
        correctIndex: 0,
        explanation: { en: "な-adj need な when modifying nouns: きれいな+N. い-adj attach without な: おおきい+N.", np: "な-adj ले Noun modify गर्दा な चाहिन्छ। い-adj ले な बिना जोडिन्छ।" },
      },
    ],
  },
  {
    id: 9,
    title: "Lesson 9 — すき・きらい・じょうず (Preferences & Hobbies)",
    intro: [
      {
        en: "In this lesson you learn to express likes, dislikes, and abilities using the が particle. すきです (like), きらいです (dislike), じょうずです (skilled at), へたです (poor at), and わかります (understand) all take が as their subject marker.",
        np: "यस पाठमा が Particle प्रयोग गरी मनपर्ने, नमनपर्ने र क्षमता बताउन सिक्नुहुनेछ। すきです (मनपर्छ), きらいです (मनपर्दैन), じょうずです (दक्ष), へたです (कमजोर), र わかります (बुझ्छु) — सबैले が प्रयोग गर्छन्।",
      },
      {
        en: "Use どんな to ask 'what kind of?' and から to give a reason: 〜から、〜 means 'because 〜, 〜'. You also learn the たい form: V-stem + たいです expresses a personal desire.",
        np: "'कस्तो?' सोध्न どんな र कारण दिन から प्रयोग गर्नुस्: 〜から、〜 = 'किनभने 〜'। साथै たい form: V-stem + たいです ले व्यक्तिगत इच्छा जनाउँछ।",
      },
      {
        en: "Note: じょうずです describes skill in a humble or objective way. When praising the listener's skill, use お上手ですね instead — using じょうずです about yourself is natural, but about the listener sounds condescending.",
        np: "नोट: じょうずです क्षमता वस्तुनिष्ठ रूपमा बताउँछ। श्रोताको तारिफ गर्दा お上手ですね भन्नुस् — आफ्नो बारेमा じょうずです स्वाभाविक, तर श्रोताको बारेमा घमण्डी लाग्न सक्छ।",
      },
    ],
    youtubeVideoId: { en: "dFfEMWr_4kE" },
    youtubeVideoIdPart2: { en: "g4LHsVU4TrY" },
    youtubeTitle: "Minna no Nihongo · Lesson 9 — Grammar",
    conversation: [
      {
        speaker: "A",
        japanese: "どんなスポーツがすきですか。",
        reading: "Donna supōtsu ga suki desu ka?",
        english: { en: "What kind of sport do you like?", np: "तपाईलाई कस्तो खेल मनपर्छ?" },
      },
      {
        speaker: "B",
        japanese: "サッカーがすきです。でも、じょうずじゃありません。",
        reading: "Sakkā ga suki desu. Demo, jōzu ja arimasen.",
        english: { en: "I like soccer. But I am not skilled at it.", np: "मलाई फुटबल मनपर्छ। तर दक्ष छैन।" },
      },
      {
        speaker: "A",
        japanese: "にほんごがわかりますか。",
        reading: "Nihongo ga wakarimasu ka?",
        english: { en: "Do you understand Japanese?", np: "तपाईलाई जापानी भाषा बुझिन्छ?" },
      },
      {
        speaker: "B",
        japanese: "すこしわかります。もっとべんきょうしたいです。",
        reading: "Sukoshi wakarimasu. Motto benkyō shitai desu.",
        english: { en: "I understand a little. I want to study more.", np: "अलिकति बुझिन्छ। थप पढ्न चाहन्छु।" },
      },
      {
        speaker: "A",
        japanese: "りょうりはじょうずですか。",
        reading: "Ryōri wa jōzu desu ka?",
        english: { en: "Are you good at cooking?", np: "खाना पकाउन दक्ष हुनुहुन्छ?" },
      },
      {
        speaker: "B",
        japanese: "いいえ、へたです。にほんりょうりをならいたいです。",
        reading: "Iie, heta desu. Nihon ryōri o naraitai desu.",
        english: { en: "No, I am poor at it. I want to learn Japanese cooking.", np: "होइन, कमजोर छु। जापानी खाना सिक्न चाहन्छु।" },
      },
    ],
    grammar: [
      {
        number: 1,
        name: { en: "N が すきです / きらいです — Likes and dislikes", np: "N が すきです / きらいです — मनपर्ने र नमनपर्ने" },
        meaning: {
          en: "すき (like) and きらい (dislike) are な-adj. The thing liked/disliked is marked with が, NOT を. Pattern: [topic] は [thing] が すき/きらい です.",
          np: "すき (मनपर्छ) र きらい (मनपर्दैन) な-adj हुन्। मनपर्ने/नमनपर्ने वस्तु が ले चिन्ह गरिन्छ, を ले होइन। Pattern: [topic] は [thing] が すき/きらい です।",
        },
        whereWeUse: [
          { en: "Likes: わたしは サッカーが すきです (I like soccer)", np: "मनपर्छ: わたしは サッカーが すきです" },
          { en: "Dislikes: わたしは にんじんが きらいです (I dislike carrots)", np: "नमनपर्छ: わたしは にんじんが きらいです" },
          { en: "Question: なにが すきですか (What do you like?)", np: "प्रश्न: なにが すきですか" },
        ],
        examples: [
          {
            japanese: "わたしはおんがくがすきです。",
            reading: "Watashi wa ongaku ga suki desu.",
            english: { en: "I like music.", np: "मलाई सङ्गीत मनपर्छ।" },
            scenario: { en: "Stating a like", np: "मनपर्ने बताउँदा" },
          },
          {
            japanese: "やまださんはやさいがきらいです。",
            reading: "Yamada-san wa yasai ga kirai desu.",
            english: { en: "Yamada dislikes vegetables.", np: "यामाडाजीलाई तरकारी मनपर्दैन।" },
            scenario: { en: "Stating a dislike about someone", np: "अरूको नमनपर्ने" },
          },
          {
            japanese: "どんなおんがくがすきですか。",
            reading: "Donna ongaku ga suki desu ka?",
            english: { en: "What kind of music do you like?", np: "तपाईलाई कस्तो सङ्गीत मनपर्छ?" },
            scenario: { en: "Asking about preferences with どんな", np: "どんな सँग मनपर्ने सोध्दा" },
          },
        ],
      },
      {
        number: 2,
        name: { en: "N が じょうずです / へたです — Skill and ability", np: "N が じょうずです / へたです — दक्षता र क्षमता" },
        meaning: {
          en: "じょうず (skilled/good at) and へた (poor at) are な-adj. The skill is marked by が. To describe YOUR OWN skill, use じょうず/へた freely. To praise the LISTENER's skill, use お上手ですね (more polite).",
          np: "じょうず (दक्ष) र へた (कमजोर) な-adj हुन्। सीप が ले। आफ्नो बारेमा じょうず/へた स्वतन्त्र रूपमा। श्रोताको तारिफ गर्दा お上手ですね (बढी विनम्र)।",
        },
        whereWeUse: [
          { en: "Self: わたしは ピアノが じょうずです (I am good at piano)", np: "आफ्नो: わたしは ピアノが じょうずです" },
          { en: "Self: わたしは りょうりが へたです (I am poor at cooking)", np: "आफ्नो: わたしは りょうりが へたです" },
          { en: "Praise listener: ピアノがお上手ですね (You are skilled at piano)", np: "श्रोता तारिफ: ピアノがお上手ですね" },
        ],
        examples: [
          {
            japanese: "かのじょはダンスがじょうずです。",
            reading: "Kanojo wa dansu ga jōzu desu.",
            english: { en: "She is good at dancing.", np: "उनी नाचमा दक्ष छिन्।" },
            scenario: { en: "じょうず about a third person", np: "तेस्रो व्यक्तिको बारेमा じょうず" },
          },
          {
            japanese: "わたしはえがへたです。",
            reading: "Watashi wa e ga heta desu.",
            english: { en: "I am poor at drawing.", np: "म चित्र कोर्न कमजोर छु।" },
            scenario: { en: "へた about oneself", np: "आफ्नो बारेमा へた" },
          },
          {
            japanese: "にほんごがおじょうずですね。",
            reading: "Nihongo ga o-jōzu desu ne.",
            english: { en: "You are skilled at Japanese!", np: "हजुर जापानी भाषामा दक्ष हुनुहुन्छ!" },
            scenario: { en: "Polite praise using お上手", np: "お上手 प्रयोग गरी विनम्र तारिफ" },
          },
        ],
      },
      {
        number: 3,
        name: { en: "N が わかります — understand N", np: "N が わかります — N बुझिन्छ" },
        meaning: {
          en: "わかります (understand) takes が for what is understood. Pattern: [person] は [thing] が わかります. Contrast with できます (can do) which also takes が.",
          np: "わかります (बुझ्छु) ले बुझिने वस्तु が ले चिन्ह गर्छ। Pattern: [व्यक्ति] は [वस्तु] が わかります। できます (सक्छु) सँग तुलना — यसले पनि が लिन्छ।",
        },
        whereWeUse: [
          { en: "Language: わたしは えいごが わかります (I understand English)", np: "भाषा: わたしは えいごが わかります" },
          { en: "Question: にほんごが わかりますか (Do you understand Japanese?)", np: "प्रश्न: にほんごが わかりますか" },
          { en: "Partial: すこし わかります (I understand a little)", np: "आंशिक: すこし わかります" },
        ],
        examples: [
          {
            japanese: "えいごがわかります。",
            reading: "Eigo ga wakarimasu.",
            english: { en: "I understand English.", np: "मलाई अङ्ग्रेजी बुझिन्छ।" },
            scenario: { en: "Understanding a language", np: "भाषा बुझिने" },
          },
          {
            japanese: "すこしわかります。",
            reading: "Sukoshi wakarimasu.",
            english: { en: "I understand a little.", np: "अलिकति बुझिन्छ।" },
            scenario: { en: "Partial understanding", np: "आंशिक बुझाइ" },
          },
          {
            japanese: "にほんごがぜんぜんわかりません。",
            reading: "Nihongo ga zenzen wakarimasen.",
            english: { en: "I do not understand Japanese at all.", np: "जापानी भाषा बिल्कुल बुझिँदैन।" },
            scenario: { en: "No understanding with ぜんぜん", np: "ぜんぜん सँग शून्य बुझाइ" },
          },
        ],
      },
      {
        number: 4,
        name: { en: "V-stem たいです — want to do V", np: "V-stem たいです — V गर्न चाहन्छु" },
        meaning: {
          en: "Attach たい to the verb stem (ます-form minus ます) to say 'I want to do V'. たい is an い-adj: its negative is たくない, past is たかった. Use only for the speaker's own desires — not for third persons.",
          np: "Verb stem (ます-form मा ます हटाएर) मा たい थप्दा 'V गर्न चाहन्छु' भन्ने अर्थ हुन्छ। たい, い-adj हो: नकार = たくない, भूत = たかった। वक्ताको आफ्नो इच्छाका लागि मात्र — तेस्रो व्यक्तिको लागि होइन।",
        },
        whereWeUse: [
          { en: "Want to eat: たべます → stem たべ + たい = たべたいです", np: "खान चाहनु: たべます → stem たべ + たい = たべたいです" },
          { en: "Want to go: いきます → stem いき + たい = いきたいです", np: "जान चाहनु: いきます → stem いき + たい = いきたいです" },
          { en: "Past: いきたかったです (I wanted to go)", np: "भूत: いきたかったです (जान चाहेको थिएँ)" },
        ],
        examples: [
          {
            japanese: "にほんへいきたいです。",
            reading: "Nihon e ikitai desu.",
            english: { en: "I want to go to Japan.", np: "जापान जान चाहन्छु।" },
            scenario: { en: "Desire to travel", np: "यात्रा गर्ने इच्छा" },
          },
          {
            japanese: "すしをたべたいです。",
            reading: "Sushi o tabetai desu.",
            english: { en: "I want to eat sushi.", np: "सुशी खान चाहन्छु।" },
            scenario: { en: "Desire to eat specific food", np: "खाने इच्छा" },
          },
          {
            japanese: "もっとにほんごをべんきょうしたいです。",
            reading: "Motto Nihongo o benkyō shitai desu.",
            english: { en: "I want to study Japanese more.", np: "थप जापानी पढ्न चाहन्छु।" },
            scenario: { en: "Desire to study more", np: "थप पढ्ने इच्छा" },
          },
        ],
      },
      {
        number: 5,
        name: { en: "〜から、〜 — Reason + Result", np: "〜から、〜 — कारण + परिणाम" },
        meaning: {
          en: "から at the end of a clause means 'because'. Pattern: [reason clause] から、[result clause]. The reason clause uses plain or polite verb forms. から is placed directly after the reason.",
          np: "Clause को अन्तमा から को अर्थ 'किनभने' हो। Pattern: [कारण clause] から、[परिणाम clause]। कारण clause मा plain वा polite verb। कारण ठ्याक्कै पछि から।",
        },
        whereWeUse: [
          { en: "Reason → result: にほんごがすきだから、まいにちべんきょうします", np: "कारण → परिणाम: にほんごがすきだから、まいにちべんきょうします" },
          { en: "Adjective reason: さむいから、うちにいます", np: "विशेषण कारण: さむいから、うちにいます" },
          { en: "Question: どうしてですか (Why?) — answer with から", np: "प्रश्न: どうしてですか — から ले जवाफ दिनुस्" },
        ],
        examples: [
          {
            japanese: "さむいから、うちにいます。",
            reading: "Samui kara, uchi ni imasu.",
            english: { en: "Because it is cold, I am at home.", np: "जाडो भएकाले घरमा छु।" },
            scenario: { en: "Weather reason", np: "मौसम कारण" },
          },
          {
            japanese: "にほんごがすきだから、まいにちべんきょうします。",
            reading: "Nihongo ga suki dakara, mainichi benkyō shimasu.",
            english: { en: "Because I like Japanese, I study every day.", np: "जापानी मनपर्ने भएकाले, हरेक दिन पढ्छु।" },
            scenario: { en: "Preference as reason", np: "मनपर्ने कारण" },
          },
          {
            japanese: "むずかしいから、もっとれんしゅうします。",
            reading: "Muzukashii kara, motto renshū shimasu.",
            english: { en: "Because it is difficult, I will practice more.", np: "गाह्रो भएकाले थप अभ्यास गर्छु।" },
            scenario: { en: "Difficulty as reason", np: "कठिनाइ कारण" },
          },
        ],
      },
    ],
    particles: [
      {
        particle: "が",
        romaji: "ga",
        name: { en: "Subject of preference / ability / understanding", np: "मनपर्ने / क्षमता / बुझाइको Subject" },
        meaning: {
          en: "With すき/きらい/じょうず/へた/わかります, the thing liked/disliked/skilled-at/understood is marked by が, not を. This が marks what the adjective or verb is about.",
          np: "すき/きらい/じょうず/へた/わかります सँग मनपर्ने/नमनपर्ने/दक्ष/कमजोर/बुझिने वस्तु が ले चिन्ह गरिन्छ, を ले होइन।",
        },
        examples: [
          {
            japanese: "わたしはおんがくがすきです。",
            reading: "Watashi wa ongaku ga suki desu.",
            english: { en: "I like music.", np: "मलाई सङ्गीत मनपर्छ।" },
            scenario: { en: "が marking the liked thing", np: "मनपर्ने वस्तु が ले" },
          },
          {
            japanese: "かれはえいごがわかります。",
            reading: "Kare wa eigo ga wakarimasu.",
            english: { en: "He understands English.", np: "उनलाई अङ्ग्रेजी बुझिन्छ।" },
            scenario: { en: "が marking what is understood", np: "बुझिने वस्तु が ले" },
          },
        ],
      },
    ],
    vocabulary: buildVocab(9),
    mcqs: [
      {
        question: { en: "Which particle marks the thing you like in すきです sentences?", np: "すきです वाक्यमा मनपर्ने वस्तु कुन Particle ले चिन्ह गर्छ?" },
        choices: ["が", "を", "は", "に"],
        correctIndex: 0,
        explanation: { en: "With すき/きらい/じょうず/へた, the thing is marked by が, not を. わたしは サッカーが すきです.", np: "すき/きらい/じょうず/へた सँग वस्तु が ले, को ले होइन। わたしは サッカーが すきです।" },
      },
      {
        question: { en: "How do you say 'I want to eat sushi'?", np: "'म सुशी खान चाहन्छु' कसरी भनिन्छ?" },
        choices: ["すしをたべたいです", "すしがたべたいです", "すしをたべますたい", "すしをたべたくです"],
        correctIndex: 0,
        explanation: { en: "V-stem たいです: たべ (stem) + たい = たべたい. The object stays を: すしをたべたいです.", np: "V-stem たいです: たべ (stem) + たい = たべたい। Object は を नै: すしをたべたいです।" },
      },
      {
        question: { en: "What does じょうずじゃありません mean?", np: "じょうずじゃありません को अर्थ के हो?" },
        choices: [
          { en: "Not skilled at it", np: "दक्ष छैन" },
          { en: "Very skilled", np: "धेरै दक्ष" },
          { en: "Skilled in the past", np: "पहिले दक्ष थिए" },
          { en: "Want to be skilled", np: "दक्ष हुन चाहन्छु" },
        ],
        correctIndex: 0,
        explanation: { en: "じょうず is a な-adj. Negative = じゃありません. So じょうずじゃありません = 'not skilled'.", np: "じょうず, な-adj हो। नकार = じゃありません। अतः じょうずじゃありません = 'दक्ष छैन'।" },
      },
      {
        question: { en: "Fill the blank: さむい___、うちにいます。(Because it's cold, I'm home.)", np: "खाली भर्नुस्: さむい___、うちにいます।" },
        choices: ["から", "ので", "が", "に"],
        correctIndex: 0,
        explanation: { en: "から placed after the reason clause means 'because'. さむいから = because it is cold.", np: "कारण clause पछि から = 'किनभने'। さむいから = जाडो भएकाले।" },
      },
      {
        question: { en: "What does どんなスポーツがすきですか mean?", np: "どんなスポーツがすきですか को अर्थ के हो?" },
        choices: [
          { en: "What kind of sport do you like?", np: "तपाईलाई कस्तो खेल मनपर्छ?" },
          { en: "Do you like sports?", np: "तपाईलाई खेल मनपर्छ?" },
          { en: "How many sports do you like?", np: "तपाईलाई कति खेल मनपर्छन्?" },
          { en: "Which sport are you good at?", np: "तपाई कुन खेलमा दक्ष हुनुहुन्छ?" },
        ],
        correctIndex: 0,
        explanation: { en: "どんな = what kind of. どんなスポーツ = what kind of sport. が すきですか = do you like?", np: "どんな = कस्तो। どんなスポーツ = कस्तो खेल। が すきですか = मनपर्छ?" },
      },
      {
        question: { en: "Which sentence is NOT natural Japanese?", np: "कुन वाक्य स्वाभाविक जापानी होइन?" },
        choices: [
          "わたしはえいごをわかります",
          "わたしはえいごがわかります",
          "えいごがわかりますか",
          "すこしわかります",
        ],
        correctIndex: 0,
        explanation: { en: "わかります takes が, not を. わたしはえいごをわかります is wrong. The correct form is わたしはえいごがわかります.", np: "わかります, が लिन्छ, को लाई होइन। わたしはえいごをわかります गलत। सही: わたしはえいごがわかります।" },
      },
      {
        question: { en: "たべたくないです means…?", np: "たべたくないです को अर्थ के हो?" },
        choices: [
          { en: "I don't want to eat", np: "खान मन छैन" },
          { en: "I want to eat", np: "खान मन छ" },
          { en: "I didn't eat", np: "खाइनँ" },
          { en: "I ate", np: "खाएँ" },
        ],
        correctIndex: 0,
        explanation: { en: "たい is an い-adj. Its negative = たくない. たべたくないです = do not want to eat.", np: "たい, い-adj हो। नकार = たくない। たべたくないです = खान मन छैन।" },
      },
      {
        question: { en: "Which is correct: 'I like cooking' in Japanese?", np: "'मलाई खाना पकाउन मनपर्छ' जापानीमा कसरी?" },
        choices: [
          "わたしはりょうりがすきです",
          "わたしはりょうりをすきです",
          "わたしはすきがりょうりです",
          "わたしはりょうりにすきです",
        ],
        correctIndex: 0,
        explanation: { en: "The liked thing uses が: りょうりが すきです. を is wrong here.", np: "मनपर्ने वस्तुमा が: りょうりが すきです। यहाँ を गलत।" },
      },
      {
        question: { en: "How do you express 'I want to learn Japanese'?", np: "'म जापानी सिक्न चाहन्छु' कसरी भनिन्छ?" },
        choices: [
          "にほんごをならいたいです",
          "にほんごがならいたいです",
          "にほんごをならいます",
          "にほんごをならいたくない",
        ],
        correctIndex: 0,
        explanation: { en: "V-stem たい: ならいます → ならい + たい = ならいたいです. Object is を.", np: "V-stem たい: ならいます → ならい + たい = ならいたいです। Object = を।" },
      },
      {
        question: { en: "What is the correct way to praise someone else's Japanese skill?", np: "अरूको जापानी भाषाको तारिफ गर्ने सही तरिका कुन हो?" },
        choices: [
          { en: "にほんごがお上手ですね", np: "にほんごがお上手ですね" },
          { en: "にほんごがじょうずですね", np: "にほんごがじょうずですね" },
          { en: "にほんごがすきですね", np: "にほんごがすきですね" },
          { en: "にほんごがわかりますね", np: "にほんごがわかりますね" },
        ],
        correctIndex: 0,
        explanation: { en: "Use お上手ですね when praising the listener's skill — more polite than just じょうずですね.", np: "श्रोताको तारिफ गर्दा お上手ですね — じょうずですね भन्दा बढी विनम्र।" },
      },
    ],
  },
  {
    id: 10,
    title: "Lesson 10 — います・あります (Existence & Location)",
    intro: [
      {
        en: "In this lesson you learn two existence verbs: います for animate beings (people, animals) and あります for inanimate things. The pattern N は [place] に います/あります states WHERE something exists.",
        np: "यस पाठमा दुई existence verb सिक्नुहुनेछ: います जीवित प्राणीहरूका लागि (मान्छे, जनावर) र あります निर्जीव वस्तुका लागि। Pattern: N は [ठाउँ] に います/あります — वस्तु कहाँ छ।",
      },
      {
        en: "The reverse pattern [place] に N が います/あります states WHAT exists in a place. Position words (うえ/した/まえ/うしろ/となり/なか/そと/ちかく) combine with の and a noun to pinpoint location.",
        np: "उल्टो pattern: [ठाउँ] に N が います/あります — ठाउँमा के/को छ। Position शब्दहरू (うえ/した/まえ/うしろ/となり/なか/そと/ちかく) + の + noun = सटीक ठेगाना।",
      },
      {
        en: "Use に for the static location of existence (where something IS). Do not confuse with で (the place where an ACTION happens).",
        np: "Existence को static location को लागि に (वस्तु कहाँ छ)। で (जहाँ कार्य हुन्छ) सँग नमिसाउनुस्।",
      },
    ],
    youtubeVideoId: { en: "U4nHSu5oa90" },
    youtubeVideoIdPart2: { en: "oVCkv9CYGCA" },
    youtubeTitle: "Minna no Nihongo · Lesson 10 — Grammar",
    conversation: [
      {
        speaker: "A",
        japanese: "ねこはどこにいますか。",
        reading: "Neko wa doko ni imasu ka?",
        english: { en: "Where is the cat?", np: "बिरालो कहाँ छ?" },
      },
      {
        speaker: "B",
        japanese: "にわにいます。きがありますね。",
        reading: "Niwa ni imasu. Ki ga arimasu ne.",
        english: { en: "It is in the garden. There is a tree, isn't there.", np: "बगैचामा छ। रूख पनि छ, हगि।" },
      },
      {
        speaker: "A",
        japanese: "つくえのうえになにがありますか。",
        reading: "Tsukue no ue ni nani ga arimasu ka?",
        english: { en: "What is on top of the desk?", np: "टेबलको माथि के छ?" },
      },
      {
        speaker: "B",
        japanese: "ほんとペンがあります。",
        reading: "Hon to pen ga arimasu.",
        english: { en: "There are books and a pen.", np: "किताब र कलम छन्।" },
      },
      {
        speaker: "A",
        japanese: "じむしょにやまださんがいますか。",
        reading: "Jimusho ni Yamada-san ga imasu ka?",
        english: { en: "Is Yamada in the office?", np: "कार्यालयमा यामाडाजी हुनुहुन्छ?" },
      },
      {
        speaker: "B",
        japanese: "いいえ、いません。となりのへやにいます。",
        reading: "Iie, imasen. Tonari no heya ni imasu.",
        english: { en: "No, not here. He is in the next room.", np: "होइन, हुनुहुन्न। छेउको कोठामा हुनुहुन्छ।" },
      },
    ],
    grammar: [
      {
        number: 1,
        name: { en: "います vs あります — animate vs inanimate existence", np: "います vs あります — जीवित vs निर्जीव अस्तित्व" },
        meaning: {
          en: "います: living beings that move by themselves — people, animals. あります: things that do not move on their own — objects, plants (plants are borderline but use あります). Both are used with に for location.",
          np: "います: आफैं चल्न सक्ने जीवित प्राणी — मान्छे, जनावर। あります: आफैं नचल्ने वस्तु — सामान, बिरुवा। दुवैले location को लागि に प्रयोग गर्छन्।",
        },
        whereWeUse: [
          { en: "Person/animal: せんせいが います (a teacher is here)", np: "मान्छे/जनावर: せんせいが います" },
          { en: "Object: つくえが あります (there is a desk)", np: "वस्तु: つくえが あります" },
          { en: "Plant (boundary): にわに きが あります (there is a tree in the garden)", np: "बिरुवा (सीमा): にわに きが あります" },
        ],
        examples: [
          {
            japanese: "こうえんにこどもがいます。",
            reading: "Kōen ni kodomo ga imasu.",
            english: { en: "There are children in the park.", np: "पार्कमा बच्चाहरू छन्।" },
            scenario: { en: "います with people", np: "मान्छेसँग います" },
          },
          {
            japanese: "へやにテレビがあります。",
            reading: "Heya ni terebi ga arimasu.",
            english: { en: "There is a TV in the room.", np: "कोठामा टिभी छ।" },
            scenario: { en: "あります with an object", np: "वस्तुसँग あります" },
          },
          {
            japanese: "びょういんにいしゃがいます。",
            reading: "Byōin ni isha ga imasu.",
            english: { en: "There is a doctor in the hospital.", np: "अस्पतालमा डाक्टर हुनुहुन्छ।" },
            scenario: { en: "います with professional person", np: "व्यावसायिक व्यक्तिसँग います" },
          },
        ],
      },
      {
        number: 2,
        name: { en: "N は [place] に います/あります — WHERE something exists", np: "N は [ठाउँ] に います/あります — वस्तु कहाँ छ" },
        meaning: {
          en: "When the topic N is known and you state WHERE it is: N は [place] に います/あります. The place is marked by に. Pattern: ねこは にわに います (the cat is in the garden).",
          np: "Topic N थाहा भएको हुँदा कहाँ छ बताउँदा: N は [ठाउँ] に います/あります। ठाउँ に ले। Pattern: ねこは にわに います।",
        },
        whereWeUse: [
          { en: "Where is the cat? ねこは にわに います (The cat is in the garden)", np: "बिरालो कहाँ छ? ねこは にわに います" },
          { en: "Where is Yamada? やまださんは じむしょに います", np: "यामाडाजी कहाँ? やまださんは じむしょに います" },
          { en: "Negative: ここに いません (not here)", np: "नकार: ここに いません (यहाँ छैन)" },
        ],
        examples: [
          {
            japanese: "いぬはにわにいます。",
            reading: "Inu wa niwa ni imasu.",
            english: { en: "The dog is in the garden.", np: "कुकुर बगैचामा छ।" },
            scenario: { en: "Animal location", np: "जनावरको ठेगाना" },
          },
          {
            japanese: "さいふはかばんのなかにあります。",
            reading: "Saifu wa kaban no naka ni arimasu.",
            english: { en: "The wallet is inside the bag.", np: "पर्स झोलाको भित्र छ।" },
            scenario: { en: "Object location using position word", np: "Position शब्द प्रयोगी वस्तुको ठेगाना" },
          },
          {
            japanese: "やまださんはとなりのへやにいます。",
            reading: "Yamada-san wa tonari no heya ni imasu.",
            english: { en: "Yamada is in the next room.", np: "यामाडाजी छेउको कोठामा हुनुहुन्छ।" },
            scenario: { en: "Person location", np: "व्यक्तिको ठेगाना" },
          },
        ],
      },
      {
        number: 3,
        name: { en: "[place] に N が います/あります — WHAT exists in a place", np: "[ठाउँ] に N が います/あります — ठाउँमा के छ" },
        meaning: {
          en: "When introducing a new entity, put the place first: [place] に [new N] が います/あります. The place is given as context, then が introduces the new existence information.",
          np: "नयाँ entity परिचय गराउँदा ठाउँ पहिले: [ठाउँ] に [नयाँ N] が います/あります। ठाउँ context को रूपमा, अनि が ले नयाँ existence जानकारी।",
        },
        whereWeUse: [
          { en: "New info: こうえんに こどもが います (There are children in the park)", np: "नयाँ जानकारी: こうえんに こどもが います" },
          { en: "What is there: つくえの うえに なにが ありますか", np: "त्यहाँ के छ: つくえの うえに なにが ありますか" },
          { en: "Answer: ほんが あります (There is a book)", np: "जवाफ: ほんが あります" },
        ],
        examples: [
          {
            japanese: "つくえのうえにほんがあります。",
            reading: "Tsukue no ue ni hon ga arimasu.",
            english: { en: "There is a book on the desk.", np: "टेबलको माथि किताब छ।" },
            scenario: { en: "Introducing a new object", np: "नयाँ वस्तु परिचय" },
          },
          {
            japanese: "どこにねこがいますか。",
            reading: "Doko ni neko ga imasu ka?",
            english: { en: "Where is the cat? (lit. In where does the cat exist?)", np: "कहाँ बिरालो छ?" },
            scenario: { en: "Asking where using this pattern", np: "यो pattern ले कहाँ सोध्दा" },
          },
          {
            japanese: "ほんのよこにえんぴつがあります。",
            reading: "Hon no yoko ni enpitsu ga arimasu.",
            english: { en: "There is a pencil beside the book.", np: "किताबको छेउमा पेन्सिल छ।" },
            scenario: { en: "Using position word よこ (beside)", np: "Position शब्द よこ सहित" },
          },
        ],
      },
      {
        number: 4,
        name: { en: "Position words — うえ/した/まえ/うしろ/となり/なか/そと/ちかく", np: "Position शब्दहरू — माथि/तल/अगाडि/पछाडि/छेउ/भित्र/बाहिर/नजिक" },
        meaning: {
          en: "Position words describe relative location. Pattern: [noun] の [position] に. They cannot stand alone — they need の + a reference noun. Example: つくえのうえに = on top of the desk.",
          np: "Position शब्दहरूले सापेक्ष ठेगाना बताउँछन्। Pattern: [noun] の [position] に। एक्लो प्रयोग हुँदैन — の + reference noun चाहिन्छ। जस्तै: つくえのうえに = टेबलको माथि।",
        },
        whereWeUse: [
          { en: "うえ (above/on top): ほんのうえに (on the book)", np: "うえ (माथि): ほんのうえに" },
          { en: "した (below/under): つくえのしたに (under the desk)", np: "した (तल): つくえのしたに" },
          { en: "となり (next to): ぎんこうのとなりに (next to the bank)", np: "となり (छेउ): ぎんこうのとなりに" },
        ],
        examples: [
          {
            japanese: "ほんはつくえのうえにあります。",
            reading: "Hon wa tsukue no ue ni arimasu.",
            english: { en: "The book is on top of the desk.", np: "किताब टेबलको माथि छ।" },
            scenario: { en: "うえ — on top of", np: "うえ — माथि" },
          },
          {
            japanese: "ねこはソファのしたにいます。",
            reading: "Neko wa sofā no shita ni imasu.",
            english: { en: "The cat is under the sofa.", np: "बिरालो सोफाको तल छ।" },
            scenario: { en: "した — under", np: "した — तल" },
          },
          {
            japanese: "ゆうびんきょくはぎんこうのとなりにあります。",
            reading: "Yūbinkyoku wa ginkō no tonari ni arimasu.",
            english: { en: "The post office is next to the bank.", np: "हुलाक घर बैंकको छेउमा छ।" },
            scenario: { en: "となり — next to", np: "となり — छेउमा" },
          },
        ],
      },
      {
        number: 5,
        name: { en: "に (existence location) vs で (action location)", np: "に (अस्तित्वको ठेगाना) vs で (कार्यको ठेगाना)" },
        meaning: {
          en: "KEY distinction: に marks WHERE something EXISTS (static). で marks WHERE an ACTION takes place (dynamic). います/あります always use に. Action verbs (たべる, はたらく, etc.) use で.",
          np: "महत्त्वपूर्ण भिन्नता: に ले वस्तु कहाँ छ (static) चिन्ह गर्छ। で ले कार्य कहाँ हुन्छ (dynamic) चिन्ह गर्छ। います/あります सधैं に। Action verb (たべる, はたらく आदि) で।",
        },
        whereWeUse: [
          { en: "Existence (に): こうえんに います (existing in the park)", np: "अस्तित्व (に): こうえんに います" },
          { en: "Action (で): こうえんで あそびます (playing in the park)", np: "कार्य (で): こうえんで あそびます" },
          { en: "Both: こうえんに います。こうえんで あそびます。", np: "दुवै: こうえんに います। こうえんで あそびます।" },
        ],
        examples: [
          {
            japanese: "かれはにほんにいます。",
            reading: "Kare wa Nihon ni imasu.",
            english: { en: "He is in Japan.", np: "उनी जापानमा छन्।" },
            scenario: { en: "に for static existence", np: "Static अस्तित्वको लागि に" },
          },
          {
            japanese: "かれはにほんではたらきます。",
            reading: "Kare wa Nihon de hatarakimasu.",
            english: { en: "He works in Japan.", np: "उनी जापानमा काम गर्छन्।" },
            scenario: { en: "で for action location", np: "कार्यको ठेगानाको लागि で" },
          },
          {
            japanese: "としょかんにほんがあります。としょかんでよみます。",
            reading: "Toshokan ni hon ga arimasu. Toshokan de yomimasu.",
            english: { en: "There are books in the library. I read at the library.", np: "पुस्तकालयमा किताब छन्। पुस्तकालयमा पढ्छु।" },
            scenario: { en: "に and で in the same context", np: "एउटै context मा に र で" },
          },
        ],
      },
    ],
    particles: [
      {
        particle: "に",
        romaji: "ni",
        name: { en: "Location of existence", np: "अस्तित्वको ठेगाना" },
        meaning: {
          en: "に marks the static location where something EXISTS. Used with います and あります. Different from で (place of action). Think: に = 'at/in' (being), で = 'at/in' (doing).",
          np: "に ले वस्तु कहाँ अवस्थित छ चिन्ह गर्छ। います र あります सँग प्रयोग। で (कार्यको ठेगाना) भन्दा भिन्न। सम्झनुस्: に = 'मा' (छ), で = 'मा' (गर्छ)।",
        },
        examples: [
          {
            japanese: "かいしゃにだれがいますか。",
            reading: "Kaisha ni dare ga imasu ka?",
            english: { en: "Who is at the company?", np: "कम्पनीमा को हुनुहुन्छ?" },
            scenario: { en: "に for existence location", np: "अस्तित्वको ठेगानाको लागि に" },
          },
          {
            japanese: "つくえのうえにほんがあります。",
            reading: "Tsukue no ue ni hon ga arimasu.",
            english: { en: "There is a book on the desk.", np: "टेबलको माथि किताब छ।" },
            scenario: { en: "に with position word", np: "Position शब्दसँग に" },
          },
        ],
      },
      {
        particle: "が",
        romaji: "ga",
        name: { en: "Subject of existence", np: "अस्तित्वको Subject" },
        meaning: {
          en: "が marks the subject of います/あります — the thing that exists. In existence sentences, the subject is typically new information introduced with が.",
          np: "が ले います/あります को subject चिन्ह गर्छ — अवस्थित हुने वस्तु। Existence वाक्यमा subject प्रायः が ले परिचय गराइने नयाँ जानकारी हो।",
        },
        examples: [
          {
            japanese: "こうえんにこどもがいます。",
            reading: "Kōen ni kodomo ga imasu.",
            english: { en: "There are children in the park.", np: "पार्कमा बच्चाहरू छन्।" },
            scenario: { en: "が introducing new subject (children)", np: "が ले नयाँ subject (बच्चा) परिचय" },
          },
          {
            japanese: "いぬがいません。",
            reading: "Inu ga imasen.",
            english: { en: "There is no dog.", np: "कुकुर छैन।" },
            scenario: { en: "Negative existence with が", np: "नकारात्मक अस्तित्वमा が" },
          },
        ],
      },
    ],
    vocabulary: buildVocab(10),
    mcqs: [
      {
        question: { en: "Which verb do you use for animate beings (people, animals)?", np: "जीवित प्राणीहरू (मान्छे, जनावर) को लागि कुन verb प्रयोग गर्नुहुन्छ?" },
        choices: ["います", "あります", "あります", "おります"],
        correctIndex: 0,
        explanation: { en: "います is for animate beings that can move on their own (people, animals). あります is for inanimate objects.", np: "います, आफैं चल्न सक्ने जीवित प्राणीका लागि (मान्छे, जनावर)। あります, निर्जीव वस्तुका लागि।" },
      },
      {
        question: { en: "Fill the blank: さいふは かばんのなか___あります。", np: "खाली भर्नुस्: さいふは かばんのなか___あります।" },
        choices: ["に", "で", "を", "が"],
        correctIndex: 0,
        explanation: { en: "に marks the static location of existence. あります uses に: かばんのなかに = inside the bag.", np: "に ले अस्तित्वको static location चिन्ह गर्छ। あります, に प्रयोग गर्छ।" },
      },
      {
        question: { en: "What is the negative of います?", np: "います को नकारात्मक रूप के हो?" },
        choices: ["いません", "いないです", "いくない", "いますじゃない"],
        correctIndex: 0,
        explanation: { en: "The polite negative of います is いません. (あります → ありません)", np: "います को विनम्र नकार = いません। (あります → ありません)" },
      },
      {
        question: { en: "Which particle marks WHERE an action takes place?", np: "कार्य कहाँ हुन्छ चिन्ह गर्ने Particle कुन हो?" },
        choices: ["で", "に", "が", "を"],
        correctIndex: 0,
        explanation: { en: "で marks the place where an action occurs. に marks where something EXISTS. としょかんでよみます (read at library) vs としょかんにいます (exist at library).", np: "で ले कार्यको ठेगाना। に ले अस्तित्वको ठेगाना। としょかんでよみます vs としょかんにいます।" },
      },
      {
        question: { en: "どこにねこがいますか — What does this mean?", np: "どこにねこがいますか — यसको अर्थ के हो?" },
        choices: [
          { en: "Where is the cat?", np: "बिरालो कहाँ छ?" },
          { en: "Is there a cat?", np: "बिरालो छ?" },
          { en: "What is the cat doing?", np: "बिरालो के गर्दैछ?" },
          { en: "Whose cat is it?", np: "बिरालो कसको हो?" },
        ],
        correctIndex: 0,
        explanation: { en: "どこ = where, に = location particle, ねこが = cat (subject), いますか = exists?. Meaning: where does the cat exist?", np: "どこ = कहाँ, に = location, ねこが = बिरालो (subject), いますか = छ? — बिरालो कहाँ छ?" },
      },
      {
        question: { en: "Which position word means 'next to'?", np: "'छेउमा' जनाउने position शब्द कुन हो?" },
        choices: ["となり", "うえ", "した", "なか"],
        correctIndex: 0,
        explanation: { en: "となり = next to (neighboring position). うえ = above/on top. した = below. なか = inside.", np: "となり = छेउमा। うえ = माथि। した = तल। なか = भित्र।" },
      },
      {
        question: { en: "Which sentence correctly says 'There is a dog in the garden'?", np: "'बगैचामा कुकुर छ' भन्ने सही वाक्य कुन हो?" },
        choices: [
          "にわにいぬがいます",
          "にわでいぬがいます",
          "にわにいぬがあります",
          "にわはいぬにいます",
        ],
        correctIndex: 0,
        explanation: { en: "Dog (animate) → います. Location → に. Pattern: にわに(location に) いぬが(subject が) います.", np: "कुकुर (जीवित) → います। Location → に। Pattern: にわに いぬが います।" },
      },
      {
        question: { en: "Complete: つくえの___にほんがあります。(There is a book ON TOP of the desk.)", np: "पूरा गर्नुस्: つくえの___にほんがあります।" },
        choices: ["うえ", "した", "なか", "まえ"],
        correctIndex: 0,
        explanation: { en: "うえ = above/on top. つくえのうえに = on top of the desk.", np: "うえ = माथि। つくえのうえに = टेबलको माथि।" },
      },
      {
        question: { en: "Use あります or います: テレビは へやの___にあります。", np: "あります वा います: テレビは へやの___にあります।" },
        choices: [
          { en: "なか (inside) — テレビはへやのなかにあります", np: "なか (भित्र) — テレビはへやのなかにあります" },
          { en: "なか — テレビはへやのなかにいます", np: "なか — テレビはへやのなかにいます" },
          { en: "そと — テレビはへやのそとにあります", np: "そと — テレビはへやのそとにあります" },
          { en: "うえ — テレビはへやのうえにいます", np: "うえ — テレビはへやのうえにいます" },
        ],
        correctIndex: 0,
        explanation: { en: "TV is inanimate → あります. なか = inside. テレビはへやのなかにあります = the TV is inside the room.", np: "TV निर्जीव → あります। なか = भित्र। テレビはへやのなかにあります।" },
      },
      {
        question: { en: "What is the difference between に and で in location contexts?", np: "Location context मा に र で को फरक के हो?" },
        choices: [
          { en: "に = where something EXISTS; で = where an ACTION happens", np: "に = वस्तु कहाँ छ; で = कार्य कहाँ हुन्छ" },
          { en: "に = where an action happens; で = where something exists", np: "に = कार्य कहाँ हुन्छ; で = वस्तु कहाँ छ" },
          { en: "Both have the same meaning", np: "दुवैको एउटै अर्थ" },
          { en: "に is formal; で is casual", np: "に औपचारिक; で अनौपचारिक" },
        ],
        correctIndex: 0,
        explanation: { en: "に: static location of existence (います/あります). で: location of a dynamic action (たべる/はたらく).", np: "に: static अस्तित्वको ठेगाना (います/あります)। で: dynamic कार्यको ठेगाना (たべる/はたらく)।" },
      },
    ],
  },
  {
    id: 11,
    title: "Lesson 11 — かずと りょう (Counters & Quantities)",
    intro: [
      {
        en: "In this lesson you learn two counting systems: native Japanese counting (ひとつ、ふたつ、みっつ… for general objects up to ten) and sino-Japanese counter words (〜本 for long objects, 〜枚 for flat objects, 〜台 for machines, 〜匹 for animals).",
        np: "यस पाठमा दुई गणना प्रणाली सिक्नुहुनेछ: जापानी मौलिक गणना (ひとつ、ふたつ、みっつ… सामान्य वस्तुका लागि दश सम्म) र Sino-Japanese counter शब्दहरू (〜本 लामो वस्तुका लागि, 〜枚 पातलो वस्तुका लागि, 〜台 मेसिनका लागि, 〜匹 जनावरका लागि)।",
      },
      {
        en: "The counter goes after the quantity in Japanese: ケーキを ひとつ ください (one cake please) or ビールを さんぼん ください (three bottles of beer please). Pay attention to sound changes: いっぽん/にほん/さんぼん.",
        np: "जापानीमा counter, quantity पछि: ケーキを ひとつ ください (एउटा केक दिनुस्) वा ビールを さんぼん ください (तीन बोतल बियर दिनुस्)। ध्वनि परिवर्तनमा ध्यान: いっぽん/にほん/さんぼん।",
      },
      {
        en: "To ask 'how many?', use いくつ for native counting or the counter-specific question word: 何本/何枚/何台/何匹.",
        np: "'कति?' सोध्न: मौलिक गणनाको लागि いくつ, वा counter-specific प्रश्न शब्द: 何本/何枚/何台/何匹।",
      },
    ],
    youtubeVideoId: { en: "nqUVYQwOkIY" },
    youtubeVideoIdPart2: { en: "qhX1YEKQC28" },
    youtubeTitle: "Minna no Nihongo · Lesson 11 — Grammar",
    conversation: [
      {
        speaker: "A",
        japanese: "りんごをいくつかいますか。",
        reading: "Ringo o ikutsu kaimasu ka?",
        english: { en: "How many apples will you buy?", np: "स्याउ कति किन्नुहुन्छ?" },
      },
      {
        speaker: "B",
        japanese: "みっつかいます。それから、ケーキをひとつかいます。",
        reading: "Mittsu kaimasu. Sorekara, kēki o hitotsu kaimasu.",
        english: { en: "I will buy three. And then one cake.", np: "तिनवटा किन्छु। अनि एउटा केक पनि।" },
      },
      {
        speaker: "A",
        japanese: "ビールはなんぼんのみましたか。",
        reading: "Bīru wa nanbon nomimashita ka?",
        english: { en: "How many bottles of beer did you drink?", np: "बियर कति बोतल पिउनुभयो?" },
      },
      {
        speaker: "B",
        japanese: "さんぼんのみました。",
        reading: "Sanbon nomimashita.",
        english: { en: "I drank three bottles.", np: "तीन बोतल पिएँ।" },
      },
      {
        speaker: "A",
        japanese: "すみません、きってをごまいください。",
        reading: "Sumimasen, kitte o gomai kudasai.",
        english: { en: "Excuse me, five stamps please.", np: "माफ गर्नुस्, पाँच वटा टिकट दिनुस्।" },
      },
      {
        speaker: "B",
        japanese: "はい、ごまいですね。いちまいひゃくえんです。",
        reading: "Hai, gomai desu ne. Ichimai hyaku-en desu.",
        english: { en: "Yes, five stamps. One hundred yen each.", np: "हो, पाँचवटा। एउटाको एक सय येन।" },
      },
    ],
    grammar: [
      {
        number: 1,
        name: { en: "Native Japanese counting — ひとつ through とお", np: "मौलिक जापानी गणना — ひとつ देखि とお सम्म" },
        meaning: {
          en: "Japanese has a native counting series for general objects up to ten. These can be used for most countable things when you don't know the specific counter. いくつ = how many (native).",
          np: "सामान्य वस्तुहरूको लागि दश सम्म जापानीको मौलिक गणना श्रृङ्खला छ। Specific counter थाहा नभएको बेला यी प्रयोग गर्न सकिन्छ। いくつ = कति वटा (मौलिक)।",
        },
        whereWeUse: [
          { en: "1–10: ひとつ ふたつ みっつ よっつ いつつ むっつ ななつ やっつ ここのつ とお", np: "१–१०: ひとつ ふたつ みっつ よっつ いつつ むっつ ななつ やっつ ここのつ とお" },
          { en: "General objects: りんごをみっつください (three apples)", np: "सामान्य वस्तु: りんごをみっつください" },
          { en: "Question: いくつかいましたか (how many did you buy?)", np: "प्रश्न: いくつかいましたか" },
        ],
        examples: [
          {
            japanese: "ケーキをふたつください。",
            reading: "Kēki o futatsu kudasai.",
            english: { en: "Two cakes please.", np: "दुईवटा केक दिनुस्।" },
            scenario: { en: "Ordering food with native counter", np: "मौलिक counter ले खाना अर्डर गर्दा" },
          },
          {
            japanese: "りんごをいくつかいましたか。みっつかいました。",
            reading: "Ringo o ikutsu kaimashita ka? — Mittsu kaimashita.",
            english: { en: "How many apples did you buy? — I bought three.", np: "कति स्याउ किन्नुभयो? — तीनवटा किनें।" },
            scenario: { en: "Asking and answering quantity", np: "मात्रा सोध्दा र जवाफ दिँदा" },
          },
          {
            japanese: "みかんをやっつたべました。",
            reading: "Mikan o yattsu tabemashita.",
            english: { en: "I ate eight mandarin oranges.", np: "आठवटा सुन्तला खाएँ।" },
            scenario: { en: "Large native count", np: "ठूलो मौलिक गणना" },
          },
        ],
      },
      {
        number: 2,
        name: { en: "〜本 (ほん) — counter for long thin objects", np: "〜本 (ほん) — लामो पातलो वस्तुका लागि counter" },
        meaning: {
          en: "〜本 counts long, cylindrical or thin objects: bottles, pens, bananas, trees, films. Important sound changes: 1 = いっぽん、2 = にほん、3 = さんぼん、6 = ろっぽん、8 = はっぽん、10 = じゅっぽん.",
          np: "〜本 ले लामो, बेलनाकार वा पातलो वस्तु गन्छ: बोतल, कलम, केरा, रूख, चलचित्र। ध्वनि परिवर्तन: 1 = いっぽん、2 = にほん、3 = さんぼん、6 = ろっぽん、8 = はっぽん、10 = じゅっぽん।",
        },
        whereWeUse: [
          { en: "Bottles: ビールをさんぼんのみました (drank three bottles of beer)", np: "बोतल: ビールをさんぼんのみました" },
          { en: "Pens: ペンをにほんかいました (bought two pens)", np: "कलम: ペンをにほんかいました" },
          { en: "Question: なんぼんかいましたか (how many [long things]?)", np: "प्रश्न: なんぼんかいましたか" },
        ],
        examples: [
          {
            japanese: "ビールをいっぽんください。",
            reading: "Bīru o ippon kudasai.",
            english: { en: "One bottle of beer please.", np: "एक बोतल बियर दिनुस्।" },
            scenario: { en: "いっぽん (1 bottle)", np: "いっぽん (१ बोतल)" },
          },
          {
            japanese: "えんぴつをさんぼんかいました。",
            reading: "Enpitsu o sanbon kaimashita.",
            english: { en: "I bought three pencils.", np: "तीनवटा पेन्सिल किनें।" },
            scenario: { en: "さんぼん (3 pencils)", np: "さんぼん (३ पेन्सिल)" },
          },
          {
            japanese: "なんぼんのみましたか。ろっぽんのみました。",
            reading: "Nanbon nomimashita ka? — Roppon nomimashita.",
            english: { en: "How many bottles did you drink? — I drank six.", np: "कति बोतल पिउनुभयो? — छ बोतल पिएँ।" },
            scenario: { en: "ろっぽん (6 bottles)", np: "ろっぽん (६ बोतल)" },
          },
        ],
      },
      {
        number: 3,
        name: { en: "〜枚 (まい) — counter for flat thin objects", np: "〜枚 (まい) — पातलो flat वस्तुका लागि counter" },
        meaning: {
          en: "〜枚 counts flat, thin objects: paper, stamps, shirts, photographs, plates. Regular reading: いちまい、にまい、さんまい… No major sound changes unlike 〜本. Question: なんまい.",
          np: "〜枚 ले पातलो, flat वस्तु गन्छ: कागज, टिकट, सर्ट, फोटो, थाल। नियमित: いちまい、にまい、さんまい… 〜本 जस्तो ध्वनि परिवर्तन छैन। प्रश्न: なんまい।",
        },
        whereWeUse: [
          { en: "Stamps: きってをごまいください (five stamps)", np: "टिकट: きってをごまいください" },
          { en: "Shirts: シャツをさんまいかいました (bought three shirts)", np: "सर्ट: シャツをさんまいかいました" },
          { en: "Question: なんまいありますか (how many flat things are there?)", np: "प्रश्न: なんまいありますか" },
        ],
        examples: [
          {
            japanese: "かみをにまいください。",
            reading: "Kami o nimai kudasai.",
            english: { en: "Two sheets of paper please.", np: "दुई पाना कागज दिनुस्।" },
            scenario: { en: "にまい (2 sheets)", np: "にまい (२ पाना)" },
          },
          {
            japanese: "しゃしんをじゅうまいとりました。",
            reading: "Shashin o jūmai torimashita.",
            english: { en: "I took ten photos.", np: "दश वटा फोटो खिचें।" },
            scenario: { en: "じゅうまい (10 photos)", np: "じゅうまい (१० फोटो)" },
          },
          {
            japanese: "なんまいかいましたか。",
            reading: "Nanmai kaimashita ka?",
            english: { en: "How many did you buy?", np: "कति वटा किन्नुभयो?" },
            scenario: { en: "Asking with なんまい", np: "なんまい ले सोध्दा" },
          },
        ],
      },
      {
        number: 4,
        name: { en: "〜台 (だい) and 〜匹 (ひき) — machines and animals", np: "〜台 (だい) र 〜匹 (ひき) — मेसिन र जनावर" },
        meaning: {
          en: "〜台 counts machines and vehicles: cars, computers, TVs, bikes. 〜匹 counts small animals: cats, dogs, fish, insects. Sound changes for 〜匹: 1 = いっぴき、3 = さんびき、6 = ろっぴき、8 = はっぴき.",
          np: "〜台 ले मेसिन र सवारी साधन गन्छ: कार, कम्प्युटर, टिभी, साइकल। 〜匹 ले सानो जनावर गन्छ: बिरालो, कुकुर, माछा, किरा। 〜匹 ध्वनि परिवर्तन: 1 = いっぴき、3 = さんびき।",
        },
        whereWeUse: [
          { en: "Machines (〜台): パソコンをいちだいかいました (bought one PC)", np: "मेसिन (〜台): パソコンをいちだいかいました" },
          { en: "Animals (〜匹): ねこをにひきかっています (keeping two cats)", np: "जनावर (〜匹): ねこをにひきかっています" },
          { en: "Question: なんだい/なんびき", np: "प्रश्न: なんだい/なんびき" },
        ],
        examples: [
          {
            japanese: "くるまをいちだいかいました。",
            reading: "Kuruma o ichidai kaimashita.",
            english: { en: "I bought one car.", np: "एउटा कार किनें।" },
            scenario: { en: "いちだい (1 machine)", np: "いちだい (१ मेसिन)" },
          },
          {
            japanese: "ねこをいっぴきかっています。",
            reading: "Neko o ippiki katte imasu.",
            english: { en: "I keep one cat.", np: "एउटा बिरालो पालेको छु।" },
            scenario: { en: "いっぴき (1 small animal)", np: "いっぴき (१ सानो जनावर)" },
          },
          {
            japanese: "いぬをなんびきかっていますか。",
            reading: "Inu o nanbiki katte imasu ka?",
            english: { en: "How many dogs do you keep?", np: "कति वटा कुकुर पाल्नुभएको छ?" },
            scenario: { en: "なんびき question", np: "なんびき प्रश्न" },
          },
        ],
      },
      {
        number: 5,
        name: { en: "N を [counter] ください — ordering and requesting", np: "N を [counter] ください — अर्डर र अनुरोध" },
        meaning: {
          en: "The counter word slots after the object in the ordering pattern: [object] を [number + counter] ください. The object is marked by を, the counter follows the number directly.",
          np: "अर्डरको pattern मा counter, object पछि: [object] を [नम्बर + counter] ください। Object, を ले चिन्हित; counter, नम्बर पछि सिधै।",
        },
        whereWeUse: [
          { en: "Food: りんごをみっつください (three apples please)", np: "खाना: りんごをみっつください" },
          { en: "Drinks: コーヒーをふたつください (two coffees please)", np: "पेय: コーヒーをふたつください" },
          { en: "Bottles: ビールをさんぼんください (three beers please)", np: "बोतल: ビールをさんぼんください" },
        ],
        examples: [
          {
            japanese: "コーヒーをひとつおねがいします。",
            reading: "Kōhī o hitotsu onegai shimasu.",
            english: { en: "One coffee please.", np: "एउटा कफी अनुरोध गर्छु।" },
            scenario: { en: "Polite ordering in a café", np: "कफेमा विनम्र अर्डर" },
          },
          {
            japanese: "ビールをさんぼんください。",
            reading: "Bīru o sanbon kudasai.",
            english: { en: "Three beers please.", np: "तीन बोतल बियर दिनुस्।" },
            scenario: { en: "Ordering with 〜本 counter", np: "〜本 counter ले अर्डर" },
          },
          {
            japanese: "きってをごまいとふうとうをさんまいください。",
            reading: "Kitte o gomai to fūtō o sanmai kudasai.",
            english: { en: "Five stamps and three envelopes please.", np: "पाँच टिकट र तीन खाम दिनुस्।" },
            scenario: { en: "Multiple items with と", np: "と ले धेरै वस्तु" },
          },
        ],
      },
    ],
    particles: [],
    vocabulary: buildVocab(11),
    mcqs: [
      {
        question: { en: "Which native Japanese counter means 'three'?", np: "जापानीको मौलिक गणनामा 'तीन' कसरी भनिन्छ?" },
        choices: ["みっつ", "みつ", "さんつ", "さんこ"],
        correctIndex: 0,
        explanation: { en: "Native Japanese: ひとつ(1)、ふたつ(2)、みっつ(3)、よっつ(4)、いつつ(5).", np: "मौलिक जापानी: ひとつ(१)、ふたつ(२)、みっつ(३)、よっつ(४)、いつつ(५)।" },
      },
      {
        question: { en: "Which counter is used for bottles of beer?", np: "बियरको बोतल गन्न कुन counter प्रयोग हुन्छ?" },
        choices: ["〜本", "〜枚", "〜台", "〜匹"],
        correctIndex: 0,
        explanation: { en: "〜本 (ほん) counts long objects including bottles. Beer bottles = ビールをさんぼん.", np: "〜本 (ほん) ले बोतल सहित लामो वस्तु गन्छ। बियरको बोतल = ビールをさんぼん।" },
      },
      {
        question: { en: "How do you say 'one bottle' using 〜本?", np: "〜本 प्रयोग गरी 'एक बोतल' कसरी भनिन्छ?" },
        choices: ["いっぽん", "いちほん", "ひとつほん", "いちぽん"],
        correctIndex: 0,
        explanation: { en: "1 with 〜本 = いっぽん (double consonant p). にほん (2), さんぼん (3).", np: "〜本 सँग 1 = いっぽん (double p)। にほん (२), さんぼん (३)।" },
      },
      {
        question: { en: "Which counter is for flat thin objects like stamps and paper?", np: "टिकट र कागज जस्ता flat पातलो वस्तुका लागि कुन counter हो?" },
        choices: ["〜枚", "〜本", "〜台", "〜匹"],
        correctIndex: 0,
        explanation: { en: "〜枚 (まい) counts flat, thin objects: stamps (きって), paper (かみ), shirts (シャツ).", np: "〜枚 (まい) ले flat, पातलो वस्तु गन्छ: टिकट, कागज, सर्ट।" },
      },
      {
        question: { en: "How do you order 'three beers' using 〜本?", np: "〜本 प्रयोग गरी 'तीन बियर' कसरी अर्डर गर्ने?" },
        choices: [
          "ビールをさんぼんください",
          "ビールをみっつください",
          "ビールをさんほんください",
          "ビールをさんぼんいます",
        ],
        correctIndex: 0,
        explanation: { en: "さんぼん = 3 long things (b sound after さん). Pattern: ビールを さんぼん ください.", np: "さんぼん = ३ वटा लामो वस्तु (さん पछि b ध्वनि)। Pattern: ビールを さんぼん ください।" },
      },
      {
        question: { en: "Which counter is used for machines and cars?", np: "मेसिन र कारका लागि कुन counter हो?" },
        choices: ["〜台", "〜本", "〜枚", "〜匹"],
        correctIndex: 0,
        explanation: { en: "〜台 (だい) counts machines and vehicles: car (くるま), TV (テレビ), computer (パソコン).", np: "〜台 (だい) ले मेसिन र सवारी साधन: कार, टिभी, कम्प्युटर।" },
      },
      {
        question: { en: "What does いくつありますか mean?", np: "いくつありますか को अर्थ के हो?" },
        choices: [
          { en: "How many are there?", np: "कति वटा छन्?" },
          { en: "Where are they?", np: "कहाँ छन्?" },
          { en: "What is there?", np: "के छ?" },
          { en: "How much do they cost?", np: "कति पर्छन्?" },
        ],
        correctIndex: 0,
        explanation: { en: "いくつ = how many (native Japanese). あります = exist. So いくつありますか = how many are there?", np: "いくつ = कति वटा (मौलिक जापानी)। あります = छ। अतः いくつありますか = कति वटा छन्?" },
      },
      {
        question: { en: "How do you say 'five stamps please'?", np: "'पाँच टिकट दिनुस्' कसरी भनिन्छ?" },
        choices: [
          "きってをごまいください",
          "きってをいつつください",
          "きってをごほんください",
          "きってをごだいください",
        ],
        correctIndex: 0,
        explanation: { en: "Stamps are flat → 〜枚. Five = ご. きってをごまいください = five stamps please.", np: "टिकट flat → 〜枚। पाँच = ご। きってをごまいください = पाँच टिकट दिनुस्।" },
      },
      {
        question: { en: "Fill the blank: ねこをさん___かっています。(keeping three cats)", np: "खाली भर्नुस्: ねこをさん___かっています।" },
        choices: ["びき", "ぼん", "まい", "だい"],
        correctIndex: 0,
        explanation: { en: "〜匹 for small animals. さん + ひき → さんびき (b sound after さん). Three cats = さんびき.", np: "〜匹 सानो जनावरका लागि। さん + ひき → さんびき। तीन बिरालो = さんびき।" },
      },
      {
        question: { en: "Native Japanese counter for 'eight'?", np: "'आठ' को लागि मौलिक जापानी counter के हो?" },
        choices: ["やっつ", "はちつ", "やつ", "やtsu"],
        correctIndex: 0,
        explanation: { en: "Native Japanese eight = やっつ. Full list: ひとつ ふたつ みっつ よっつ いつつ むっつ ななつ やっつ ここのつ とお.", np: "मौलिक जापानी आठ = やっつ। सूची: ひとつ ふたつ みっつ よっつ いつつ むっつ ななつ やっつ ここのつ とお।" },
      },
    ],
  },
  {
    id: 12,
    title: "Lesson 12 — くらべる (Comparison)",
    intro: [
      {
        en: "In this lesson you learn how to compare things in Japanese. Use A は B より [adj] to say A is more [adj] than B, and A と B と どちらが [adj] ですか to ask 'which of A and B is more [adj]?'.",
        np: "यस पाठमा जापानीमा तुलना गर्न सिक्नुहुनेछ। A は B より [adj] — 'B भन्दा A बढी [adj] छ', र A と B と どちらが [adj] ですか — 'A र B मध्ये कुन बढी [adj] छ?' सोध्न।",
      },
      {
        en: "To say 'the most [adj] in a group', use [group] で いちばん [adj]. You also learn past-tense forms for both い and な adjectives, and the question どうでしたか (how was it?).",
        np: "'समूहमा सबभन्दा [adj]' भन्न: [समूह] で いちばん [adj]। साथै い र な दुवै विशेषणको भूत-काल र प्रश्न どうでしたか (कस्तो थियो?) सिक्नुहुनेछ।",
      },
      {
        en: "When comparing two things equally, use A も B も [adj] (both A and B are [adj]). When they differ, add adjective + ほうが to highlight the winner.",
        np: "दुई वस्तु बराबर भए: A も B も [adj] (A र B दुवै [adj] छन्)। फरक भए: adj + ほうが ले 'बढी' भएको थाहा पाइन्छ।",
      },
    ],
    youtubeVideoId: { en: "Xq_CGhOMc1Q" },
    youtubeVideoIdPart2: { en: "7DYaL10t9oM" },
    youtubeTitle: "Minna no Nihongo · Lesson 12 — Grammar",
    conversation: [
      {
        speaker: "A",
        japanese: "とうきょうとおおさかとどちらがおおきいですか。",
        reading: "Tōkyō to Ōsaka to dochira ga ōkii desu ka?",
        english: { en: "Which is bigger, Tokyo or Osaka?", np: "टोक्यो र ओसाका मध्ये कुन ठूलो छ?" },
      },
      {
        speaker: "B",
        japanese: "とうきょうのほうがおおきいです。",
        reading: "Tōkyō no hō ga ōkii desu.",
        english: { en: "Tokyo is bigger.", np: "टोक्यो ठूलो छ।" },
      },
      {
        speaker: "A",
        japanese: "にほんでいちばんたかいやまはなんですか。",
        reading: "Nihon de ichiban takai yama wa nan desu ka?",
        english: { en: "What is the tallest mountain in Japan?", np: "जापानमा सबभन्दा अग्लो पहाड कुन हो?" },
      },
      {
        speaker: "B",
        japanese: "ふじさんがいちばんたかいです。",
        reading: "Fujisan ga ichiban takai desu.",
        english: { en: "Mt Fuji is the tallest.", np: "फुजी पहाड सबभन्दा अग्लो छ।" },
      },
      {
        speaker: "A",
        japanese: "きのうのパーティーはどうでしたか。",
        reading: "Kinō no pātī wa dō deshita ka?",
        english: { en: "How was yesterday's party?", np: "हिजोको पार्टी कस्तो थियो?" },
      },
      {
        speaker: "B",
        japanese: "とてもたのしかったです。りょうりもおいしかったです。",
        reading: "Totemo tanoshikatta desu. Ryōri mo oishikatta desu.",
        english: { en: "It was very fun. The food was delicious too.", np: "धेरै रमाइलो थियो। खाना पनि मिठो थियो।" },
      },
    ],
    grammar: [
      {
        number: 1,
        name: { en: "A は B より [adj] — A is more [adj] than B", np: "A は B より [adj] — B भन्दा A बढी [adj]" },
        meaning: {
          en: "より means 'than' in comparisons. Pattern: A は B より [adj] です. A is the topic (は), B is the baseline (より). The adjective describes A relative to B. No need to say 'more' — the structure implies it.",
          np: "より को अर्थ तुलनामा 'भन्दा'। Pattern: A は B より [adj] です। A = topic (は), B = आधार (より)। विशेषणले A लाई B सँग सापेक्ष वर्णन गर्छ।",
        },
        whereWeUse: [
          { en: "Size: とうきょうは おおさかより おおきいです (Tokyo is bigger than Osaka)", np: "आकार: とうきょうは おおさかより おおきいです" },
          { en: "Price: このかばんは あのかばんより たかいです (this bag is more expensive than that one)", np: "मूल्य: このかばんは あのかばんより たかいです" },
          { en: "な-adj: でんしゃは バスより べんりです (train is more convenient than bus)", np: "な-adj: でんしゃは バスより べんりです" },
        ],
        examples: [
          {
            japanese: "なつはふゆよりあついです。",
            reading: "Natsu wa fuyu yori atsui desu.",
            english: { en: "Summer is hotter than winter.", np: "गर्मी, जाडो भन्दा तातो हुन्छ।" },
            scenario: { en: "Seasonal comparison with い-adj", np: "मौसम तुलना い-adj ले" },
          },
          {
            japanese: "このへやはあのへやよりしずかです。",
            reading: "Kono heya wa ano heya yori shizuka desu.",
            english: { en: "This room is quieter than that room.", np: "यो कोठा त्यो कोठा भन्दा शान्त छ।" },
            scenario: { en: "Comparison with な-adj", np: "な-adj ले तुलना" },
          },
          {
            japanese: "でんしゃはバスよりはやいです。",
            reading: "Densha wa basu yori hayai desu.",
            english: { en: "The train is faster than the bus.", np: "ट्रेन बस भन्दा छिटो छ।" },
            scenario: { en: "Transport comparison", np: "सवारी साधन तुलना" },
          },
        ],
      },
      {
        number: 2,
        name: { en: "A と B と どちらが [adj] ですか — Which of A or B is more [adj]?", np: "A と B と どちらが [adj] ですか — A र B मध्ये कुन बढी [adj]?" },
        meaning: {
          en: "To ask 'which of two things is more X?', list both with と と, then ask どちらが [adj] ですか. Answer with [winner] の ほうが [adj] です to say 'the [winner] side is [adj]'.",
          np: "'दुई वस्तुमध्ये कुन बढी X?' सोध्न: दुवैलाई と と ले सूचीकृत गर्नुस्, अनि どちらが [adj] ですか। जवाफ: [winner] の ほうが [adj] です।",
        },
        whereWeUse: [
          { en: "Question: にほんごと えいごと どちらが むずかしいですか", np: "प्रश्न: にほんごと えいごと どちらが むずかしいですか" },
          { en: "Answer: にほんごのほうが むずかしいです (Japanese is more difficult)", np: "जवाफ: にほんごのほうが むずかしいです" },
          { en: "If equal: どちらも おなじです (both are the same)", np: "बराबर भए: どちらも おなじです" },
        ],
        examples: [
          {
            japanese: "なつとふゆとどちらがすきですか。",
            reading: "Natsu to fuyu to dochira ga suki desu ka?",
            english: { en: "Which do you prefer, summer or winter?", np: "गर्मी र जाडोमध्ये कुन मनपर्छ?" },
            scenario: { en: "Preference comparison question", np: "प्राथमिकता तुलना प्रश्न" },
          },
          {
            japanese: "なつのほうがすきです。",
            reading: "Natsu no hō ga suki desu.",
            english: { en: "I prefer summer.", np: "गर्मी मनपर्छ।" },
            scenario: { en: "Answering with ほうが", np: "ほうが ले जवाफ" },
          },
          {
            japanese: "バスとでんしゃとどちらがはやいですか。",
            reading: "Basu to densha to dochira ga hayai desu ka?",
            english: { en: "Which is faster, the bus or the train?", np: "बस र ट्रेनमध्ये कुन छिटो छ?" },
            scenario: { en: "Transport comparison question", np: "सवारी साधन तुलना प्रश्न" },
          },
        ],
      },
      {
        number: 3,
        name: { en: "[group] で いちばん [adj] — the most [adj] in a [group]", np: "[समूह] で いちばん [adj] — [समूह] मा सबभन्दा [adj]" },
        meaning: {
          en: "いちばん means 'number one / most'. The group is marked by で. Pattern: [group] で いちばん [adj] (noun) = the most [adj] [noun] in [group]. Used to pick out the superlative from a set.",
          np: "いちばん को अर्थ 'सबभन्दा'। समूह で ले चिन्ह। Pattern: [समूह] で いちばん [adj] = [समूह] मा सबभन्दा [adj]। समूहबाट सर्वोत्कृष्ट छान्न प्रयोग।",
        },
        whereWeUse: [
          { en: "Superlative adj: このみせで いちばん おいしい りょうりは なんですか", np: "Superlative: このみせで いちばん おいしい りょうりは なんですか" },
          { en: "Country: せかいで いちばん おおきいくには どこですか", np: "देश: せかいで いちばん おおきいくには どこですか" },
          { en: "Person: クラスで いちばん せが たかいのは だれですか", np: "व्यक्ति: クラスで いちばん せが たかいのは だれですか" },
        ],
        examples: [
          {
            japanese: "にほんでいちばんたかいやまはふじさんです。",
            reading: "Nihon de ichiban takai yama wa Fujisan desu.",
            english: { en: "The tallest mountain in Japan is Mt Fuji.", np: "जापानमा सबभन्दा अग्लो पहाड फुजी हो।" },
            scenario: { en: "Superlative in a country", np: "देशभित्र सर्वोत्कृष्ट" },
          },
          {
            japanese: "クラスでいちばんはやくはしれるのはだれですか。",
            reading: "Kurasu de ichiban hayaku hashireru no wa dare desu ka?",
            english: { en: "Who can run the fastest in the class?", np: "कक्षामा सबभन्दा छिटो दौड्न सक्ने को हो?" },
            scenario: { en: "Superlative person", np: "सर्वोत्कृष्ट व्यक्ति" },
          },
          {
            japanese: "このみせでいちばんにんきのりょうりはなんですか。",
            reading: "Kono mise de ichiban ninki no ryōri wa nan desu ka?",
            english: { en: "What is the most popular dish in this restaurant?", np: "यो रेस्टुरेन्टमा सबभन्दा लोकप्रिय खाना के हो?" },
            scenario: { en: "Superlative with noun modifier", np: "Noun modifier सँग सर्वोत्कृष्ट" },
          },
        ],
      },
      {
        number: 4,
        name: { en: "Past forms of adjectives — review", np: "विशेषणका भूत रूपहरू — समीक्षा" },
        meaning: {
          en: "Review from L8: い-adj past = [stem]かったです (おいしかった). な-adj past = [adj]でした (しずかでした). Past-neg い: [stem]くなかったです. Past-neg な: [adj]じゃありませんでした. These appear in comparison contexts.",
          np: "L8 को स्मरण: い-adj भूत = [stem]かったです। な-adj भूत = [adj]でした। भूत-नकार い: [stem]くなかったです। भूत-नकार な: [adj]じゃありませんでした। तुलना context मा प्रयोग।",
        },
        whereWeUse: [
          { en: "Past positive い: りょこうは たのしかったです (the trip was fun)", np: "भूत सकारात्मक い: りょこうは たのしかったです" },
          { en: "Past positive な: ホテルは きれいでした (the hotel was clean)", np: "भूत सकारात्मक な: ホテルは きれいでした" },
          { en: "Review question: どうでしたか (how was it?)", np: "समीक्षा प्रश्न: どうでしたか" },
        ],
        examples: [
          {
            japanese: "きのうのりょこうはどうでしたか。",
            reading: "Kinō no ryokō wa dō deshita ka?",
            english: { en: "How was yesterday's trip?", np: "हिजोको यात्रा कस्तो थियो?" },
            scenario: { en: "Asking with どうでしたか", np: "どうでしたか ले सोध्दा" },
          },
          {
            japanese: "たのしかったですが、つかれました。",
            reading: "Tanoshikatta desu ga, tsukaremashita.",
            english: { en: "It was fun, but I got tired.", np: "रमाइलो थियो तर थकाइ लाग्यो।" },
            scenario: { en: "Past い-adj + contrast が", np: "भूत い-adj + contrast が" },
          },
          {
            japanese: "ホテルはあまりきれいじゃありませんでした。",
            reading: "Hoteru wa amari kirei ja arimasen deshita.",
            english: { en: "The hotel was not very clean.", np: "होटल त्यति सफा थिएन।" },
            scenario: { en: "Past-negative な-adj", np: "भूत-नकार な-adj" },
          },
        ],
      },
      {
        number: 5,
        name: { en: "どのN が いちばん [adj] ですか — Which N is most [adj]?", np: "どのN が いちばん [adj] ですか — कुन N सबभन्दा [adj] छ?" },
        meaning: {
          en: "When selecting the most [adj] from a set of three or more, use どの + N. Pattern: [set] で どの N が いちばん [adj] ですか. Answer: [N] が いちばん [adj] です.",
          np: "तीन वा बढी वस्तुमध्ये सबभन्दा [adj] छान्न どの + N। Pattern: [set] で どの N が いちばん [adj] ですか। जवाफ: [N] が いちばん [adj] です।",
        },
        whereWeUse: [
          { en: "From a menu: どのりょうりが いちばん おいしいですか (which dish is most delicious?)", np: "मेनुबाट: どのりょうりが いちばん おいしいですか" },
          { en: "From a group: このなかで どれが いちばん やすいですか (which of these is cheapest?)", np: "समूहबाट: このなかで どれが いちばん やすいですか" },
          { en: "Answer: Aがいちばん…です", np: "जवाफ: Aがいちばん…です" },
        ],
        examples: [
          {
            japanese: "このなかでどれがいちばんやすいですか。",
            reading: "Kono naka de dore ga ichiban yasui desu ka?",
            english: { en: "Which of these is the cheapest?", np: "यी मध्ये कुन सबभन्दा सस्तो छ?" },
            scenario: { en: "Selecting from a set with どれ", np: "どれ ले सेटबाट छान्दा" },
          },
          {
            japanese: "このかばんがいちばんやすいです。",
            reading: "Kono kaban ga ichiban yasui desu.",
            english: { en: "This bag is the cheapest.", np: "यो झोला सबभन्दा सस्तो छ।" },
            scenario: { en: "Superlative answer", np: "सर्वोत्कृष्ट जवाफ" },
          },
          {
            japanese: "スポーツのなかでどれがいちばんすきですか。",
            reading: "Supōtsu no naka de dore ga ichiban suki desu ka?",
            english: { en: "Among sports, which do you like most?", np: "खेलहरूमध्ये कुन सबभन्दा मनपर्छ?" },
            scenario: { en: "Preference superlative", np: "प्राथमिकता सर्वोत्कृष्ट" },
          },
        ],
      },
    ],
    particles: [],
    vocabulary: buildVocab(12),
    mcqs: [
      {
        question: { en: "Which pattern means 'A is more [adj] than B'?", np: "'A, B भन्दा बढी [adj] छ' भन्ने pattern कुन हो?" },
        choices: [
          "A は B より [adj] です",
          "A が B より [adj] です",
          "A も B より [adj] です",
          "A と B より [adj] です",
        ],
        correctIndex: 0,
        explanation: { en: "The comparison pattern is: A は B より [adj] です. A is the topic (は), B is the baseline (より).", np: "तुलना pattern: A は B より [adj] です। A = topic (は), B = आधार (より)।" },
      },
      {
        question: { en: "How do you ask 'Which is bigger, Tokyo or Osaka?'", np: "'टोक्यो र ओसाकामध्ये कुन ठूलो छ?' कसरी सोधिन्छ?" },
        choices: [
          "とうきょうとおおさかとどちらがおおきいですか",
          "とうきょうかおおさかのほうがおおきいですか",
          "とうきょうよりおおさかはどちらですか",
          "とうきょうとおおさかはいちばんおおきいですか",
        ],
        correctIndex: 0,
        explanation: { en: "Two-item comparison: A と B と どちらが [adj] ですか. Both items are listed with と と.", np: "दुई-वस्तु तुलना: A と B と どちらが [adj] ですか। दुवै と と ले।" },
      },
      {
        question: { en: "What does いちばん mean?", np: "いちばん को अर्थ के हो?" },
        choices: [
          { en: "The most / number one", np: "सबभन्दा / नम्बर एक" },
          { en: "More than", np: "भन्दा बढी" },
          { en: "Less than", np: "भन्दा कम" },
          { en: "Both equally", np: "दुवै बराबर" },
        ],
        correctIndex: 0,
        explanation: { en: "いちばん = number one / most. Used for superlatives: [group]で いちばん [adj].", np: "いちばん = नम्बर एक / सबभन्दा। Superlative को लागि: [समूह]で いちばん [adj]।" },
      },
      {
        question: { en: "Which particle marks the group in superlative sentences?", np: "Superlative वाक्यमा समूह चिन्ह गर्ने Particle कुन हो?" },
        choices: ["で", "に", "を", "が"],
        correctIndex: 0,
        explanation: { en: "で marks the scope/group: にほんで いちばん たかいやま = tallest mountain IN Japan.", np: "で ले scope/समूह: にほんで いちばん たかいやま = जापानमा सबभन्दा अग्लो पहाड।" },
      },
      {
        question: { en: "Translate: なつはふゆよりあついです。", np: "अनुवाद गर्नुस्: なつはふゆよりあついです।" },
        choices: [
          { en: "Summer is hotter than winter.", np: "गर्मी जाडो भन्दा तातो हुन्छ।" },
          { en: "Winter is hotter than summer.", np: "जाडो गर्मी भन्दा तातो हुन्छ।" },
          { en: "Summer and winter are both hot.", np: "गर्मी र जाडो दुवै तातो छन्।" },
          { en: "It is the hottest in summer.", np: "गर्मीमा सबभन्दा तातो हुन्छ।" },
        ],
        correctIndex: 0,
        explanation: { en: "なつ (summer) は topic, ふゆ (winter) より = than winter, あつい = hot. Summer is hotter than winter.", np: "なつ (गर्मी) は topic, ふゆ (जाडो) より = भन्दा, あつい = तातो। गर्मी जाडो भन्दा तातो।" },
      },
      {
        question: { en: "How do you answer 'which of two do you prefer' in Japanese?", np: "'दुई वस्तुमध्ये कुन मनपर्छ' को जवाफ कसरी दिने?" },
        choices: [
          { en: "[winner] の ほうが すきです", np: "[winner] の ほうが すきです" },
          { en: "[winner] が いちばん すきです", np: "[winner] が いちばん すきです" },
          { en: "[winner] より すきです", np: "[winner] より すきです" },
          { en: "[winner] は すきです", np: "[winner] は すきです" },
        ],
        correctIndex: 0,
        explanation: { en: "After a どちらが…ですか question, answer with [winner] の ほうが [adj] です.", np: "どちらが…ですか प्रश्न पछि जवाफ: [winner] の ほうが [adj] です।" },
      },
      {
        question: { en: "What does どうでしたか mean?", np: "どうでしたか को अर्थ के हो?" },
        choices: [
          { en: "How was it?", np: "कस्तो थियो?" },
          { en: "How is it?", np: "कस्तो छ?" },
          { en: "What happened?", np: "के भयो?" },
          { en: "Where did you go?", np: "कहाँ गएको थियो?" },
        ],
        correctIndex: 0,
        explanation: { en: "どう = how. でした = was (past polite copula). どうでしたか = how was it?", np: "どう = कस्तो। でした = थियो (भूत विनम्र copula)। どうでしたか = कस्तो थियो?" },
      },
      {
        question: { en: "What is the past form of きれい (な-adj)?", np: "きれい (な-adj) को भूत रूप के हो?" },
        choices: ["きれいでした", "きれいかったです", "きれいくなかった", "きれいじゃないでした"],
        correctIndex: 0,
        explanation: { en: "な-adj past = [adj] + でした. きれい + でした = きれいでした.", np: "な-adj भूत = [adj] + でした। きれい + でした = きれいでした।" },
      },
      {
        question: { en: "Fill: にほんでいちばん___やまはふじさんです。(The tallest mountain in Japan is Mt Fuji.)", np: "भर्नुस्: にほんでいちばん___やまはふじさんです।" },
        choices: ["たかい", "たかく", "たかい な", "たかくて"],
        correctIndex: 0,
        explanation: { en: "いちばん + い-adj (plain form) + noun. いちばん + たかい + やま = the tallest mountain.", np: "いちばん + い-adj (plain form) + noun। いちばん + たかい + やま = सबभन्दा अग्लो पहाड।" },
      },
      {
        question: { en: "When comparing two things equally, use…", np: "दुई वस्तु बराबर भए के प्रयोग गर्ने?" },
        choices: [
          { en: "どちらも おなじです", np: "どちらも おなじです" },
          { en: "どちらが おなじです", np: "どちらが おなじです" },
          { en: "どちらは おなじです", np: "どちらは おなじです" },
          { en: "いちばん おなじです", np: "いちばん おなじです" },
        ],
        correctIndex: 0,
        explanation: { en: "どちらも = both. おなじ = same. どちらも おなじです = both are the same.", np: "どちらも = दुवै। おなじ = बराबर। どちらも おなじです = दुवै बराबर छन्।" },
      },
    ],
  },
  {
    id: 13,
    title: "Lesson 13 — ほしい・たい・もくてき (Wants & Purpose)",
    intro: [
      {
        en: "In this lesson you learn to express what you WANT (noun) and what you WANT TO DO (verb). N が ほしいです says 'I want N'. V-stem たいです says 'I want to do V'. Both use が for the target.",
        np: "यस पाठमा के चाहिएको छ (Noun) र के गर्न चाहिन्छ (Verb) व्यक्त गर्न सिक्नुहुनेछ। N が ほしいです = 'मलाई N चाहिन्छ'। V-stem たいです = 'V गर्न चाहन्छु'।",
      },
      {
        en: "You also learn the purpose pattern V-stem + に + movement verb: にほんへいきます (go to Japan) can be extended to にほんりょうりをならいに にほんへいきます (go to Japan to learn Japanese cooking).",
        np: "साथै उद्देश्य pattern: V-stem + に + movement verb: にほんへいきます लाई → にほんりょうりをならいに にほんへいきます (जापानी खाना सिक्न जापान जान्छु) मा विस्तार।",
      },
      {
        en: "The question word どんな means 'what kind of' — どんなN が ほしいですか (what kind of N do you want?). ほしい is an い-adj, so it conjugates like one.",
        np: "प्रश्न शब्द どんな = 'कस्तो' — どんなN が ほしいですか (कस्तो N चाहिन्छ?)। ほしい, い-adj हो — त्यसैले त्यसैगरी conjugate।",
      },
    ],
    youtubeVideoId: { en: "JriNbAXfwEM" },
    youtubeVideoIdPart2: { en: "0n7Hsd9J-LQ" },
    youtubeTitle: "Minna no Nihongo · Lesson 13 — Grammar",
    conversation: [
      {
        speaker: "A",
        japanese: "なにがほしいですか。",
        reading: "Nani ga hoshii desu ka?",
        english: { en: "What do you want?", np: "तपाईलाई के चाहिन्छ?" },
      },
      {
        speaker: "B",
        japanese: "あたらしいパソコンがほしいです。",
        reading: "Atarashii pasokon ga hoshii desu.",
        english: { en: "I want a new computer.", np: "मलाई नयाँ कम्प्युटर चाहिन्छ।" },
      },
      {
        speaker: "A",
        japanese: "なつやすみになにをしたいですか。",
        reading: "Natsuyasumi ni nani o shitai desu ka?",
        english: { en: "What do you want to do during summer vacation?", np: "गर्मी बिदामा के गर्न चाहनुहुन्छ?" },
      },
      {
        speaker: "B",
        japanese: "うみへおよぎにいきたいです。",
        reading: "Umi e oyogi ni ikitai desu.",
        english: { en: "I want to go to the sea to swim.", np: "पौड्न समुद्रमा जान चाहन्छु।" },
      },
      {
        speaker: "A",
        japanese: "どんなおみやげがほしいですか。",
        reading: "Donna omiyage ga hoshii desu ka?",
        english: { en: "What kind of souvenir do you want?", np: "कस्तो उपहार चाहिन्छ?" },
      },
      {
        speaker: "B",
        japanese: "にほんのおかしがほしいです。",
        reading: "Nihon no okashi ga hoshii desu.",
        english: { en: "I want Japanese sweets.", np: "जापानी मिठाई चाहिन्छ।" },
      },
    ],
    grammar: [
      {
        number: 1,
        name: { en: "N が ほしいです — I want N", np: "N が ほしいです — मलाई N चाहिन्छ" },
        meaning: {
          en: "ほしい (want / desire for a noun) is an い-adj. The wanted noun is marked by が. Pattern: [topic は] [thing] が ほしいです. To ask: なに が ほしいですか. Like たい, use only for the speaker's own wants.",
          np: "ほしい (Noun इच्छा) il-adj हो। चाहिने वस्तु が ले। Pattern: [topic は] [वस्तु] が ほしいです। सोध्न: なに が ほしいですか। たい जस्तै, वक्ताको मात्र इच्छाका लागि।",
        },
        whereWeUse: [
          { en: "Thing: あたらしいくるまがほしいです (I want a new car)", np: "वस्तु: あたらしいくるまがほしいです" },
          { en: "Negative: ほしくないです (I don't want it)", np: "नकार: ほしくないです" },
          { en: "どんな question: どんなNがほしいですか (what kind of N do you want?)", np: "どんな प्रश्न: どんなNがほしいですか" },
        ],
        examples: [
          {
            japanese: "あたらしいパソコンがほしいです。",
            reading: "Atarashii pasokon ga hoshii desu.",
            english: { en: "I want a new computer.", np: "नयाँ कम्प्युटर चाहिन्छ।" },
            scenario: { en: "Wanting a gadget", np: "उपकरण चाहँदा" },
          },
          {
            japanese: "なにもほしくないです。",
            reading: "Nani mo hoshiku nai desu.",
            english: { en: "I don't want anything.", np: "केही पनि चाहिँदैन।" },
            scenario: { en: "Negative ほしい with なにも", np: "なにも सँग नकारात्मक ほしい" },
          },
          {
            japanese: "どんなプレゼントがほしいですか。",
            reading: "Donna purezento ga hoshii desu ka?",
            english: { en: "What kind of present do you want?", np: "कस्तो उपहार चाहिन्छ?" },
            scenario: { en: "どんな preference question", np: "どんな प्राथमिकता प्रश्न" },
          },
        ],
      },
      {
        number: 2,
        name: { en: "V-stem + に + movement verb — purpose of movement", np: "V-stem + に + movement verb — आन्दोलनको उद्देश्य" },
        meaning: {
          en: "To express the PURPOSE of going/coming, use V-stem + に + movement verb (いく/くる/かえる). Pattern: [place] へ [V-stem] に いきます. The に signals purpose: going IN ORDER TO do V.",
          np: "जाने/आउने उद्देश्य व्यक्त गर्न: V-stem + に + movement verb (いく/くる/かえる)। Pattern: [ठाउँ] へ [V-stem] に いきます। に ले उद्देश्य: V गर्न जान्छु।",
        },
        whereWeUse: [
          { en: "To swim: うみへ あそびに いきます (go to the sea to play)", np: "पौड्न: うみへ あそびに いきます" },
          { en: "To study: としょかんへ べんきょうしに いきます (go to library to study)", np: "पढ्न: としょかんへ べんきょうしに いきます" },
          { en: "To buy: デパートへ かいものに いきます (go to department store to shop)", np: "किन्न: デパートへ かいものに いきます" },
        ],
        examples: [
          {
            japanese: "うみへおよぎにいきます。",
            reading: "Umi e oyogi ni ikimasu.",
            english: { en: "I go to the sea to swim.", np: "पौड्न समुद्रमा जान्छु।" },
            scenario: { en: "Purpose with おようぎ (swim)", np: "おようぎ (पौड्ने) उद्देश्य" },
          },
          {
            japanese: "デパートへかいものにいきました。",
            reading: "Depāto e kaimono ni ikimashita.",
            english: { en: "I went to the department store to shop.", np: "किनमेल गर्न डिपार्टमेन्ट स्टोर गएँ।" },
            scenario: { en: "Past purpose movement", np: "भूतकालीन उद्देश्य आन्दोलन" },
          },
          {
            japanese: "としょかんへほんをかりにいきます。",
            reading: "Toshokan e hon o kari ni ikimasu.",
            english: { en: "I go to the library to borrow books.", np: "किताब उधारो लिन पुस्तकालय जान्छु।" },
            scenario: { en: "Purpose: borrowing books", np: "उद्देश्य: किताब उधारो" },
          },
        ],
      },
      {
        number: 3,
        name: { en: "V-stem たいです vs N が ほしいです — desire comparison", np: "V-stem たいです vs N が ほしいです — इच्छा तुलना" },
        meaning: {
          en: "Key distinction: たいです follows a VERB stem (want to DO something). ほしいです follows a NOUN (want a THING). Both use が for the target/object. Both are い-adj in conjugation. Both for speaker only.",
          np: "महत्त्वपूर्ण भिन्नता: たいです VERB stem पछि (काम गर्न चाहन्छु)। ほしいです NOUN पछि (वस्तु चाहिन्छ)। दुवैले target/object को लागि が। दुवै conjugation मा い-adj। दुवै वक्ताको मात्र।",
        },
        whereWeUse: [
          { en: "Want a thing (ほしい): あたらしいくるまがほしいです", np: "वस्तु चाहनु (ほしい): あたらしいくるまがほしいです" },
          { en: "Want to do (たい): うみへいきたいです", np: "काम गर्न चाहनु (たい): うみへいきたいです" },
          { en: "Both negated: ほしくないです / いきたくないです", np: "दुवै नकार: ほしくないです / いきたくないです" },
        ],
        examples: [
          {
            japanese: "あたらしいくるまがほしいです。でも、かいたくないです。",
            reading: "Atarashii kuruma ga hoshii desu. Demo, kaitaku nai desu.",
            english: { en: "I want a new car. But I don't want to buy one.", np: "नयाँ कार चाहिन्छ। तर किन्न चाहिँदैन।" },
            scenario: { en: "ほしい vs たい contrast", np: "ほしい vs たい विरोधाभास" },
          },
          {
            japanese: "なにがほしいですか。",
            reading: "Nani ga hoshii desu ka?",
            english: { en: "What do you want (thing)?", np: "तपाईलाई के चाहिन्छ (वस्तु)?" },
            scenario: { en: "Asking about wanted things", np: "चाहिने वस्तु सोध्दा" },
          },
          {
            japanese: "なにをしたいですか。",
            reading: "Nani o shitai desu ka?",
            english: { en: "What do you want to do?", np: "के गर्न चाहनुहुन्छ?" },
            scenario: { en: "Asking about desired actions", np: "इच्छित कार्य सोध्दा" },
          },
        ],
      },
      {
        number: 4,
        name: { en: "どんな + N — What kind of N?", np: "どんな + N — कस्तो N?" },
        meaning: {
          en: "どんな is a pre-noun interrogative meaning 'what kind of'. Pattern: どんな + N + が ほしいですか (what kind of N do you want?). Unlike どの (which selects from a known set), どんな asks about type/quality.",
          np: "どんな, Noun अगाडिको प्रश्नवाचक शब्द जसको अर्थ 'कस्तो'। Pattern: どんな + N + が ほしいですか। どの (थाहा भएको सेटबाट छान्दा) भन्दा फरक — どんな ले प्रकार/गुण सोध्छ।",
        },
        whereWeUse: [
          { en: "Desired item: どんなNがほしいですか (what kind of N do you want?)", np: "चाहिने वस्तु: どんなNがほしいですか" },
          { en: "Food: どんなりょうりがすきですか (what kind of food do you like?)", np: "खाना: どんなりょうりがすきですか" },
          { en: "Person: どんなひとがすきですか (what kind of person do you like?)", np: "व्यक्ति: どんなひとがすきですか" },
        ],
        examples: [
          {
            japanese: "どんなおんがくがすきですか。",
            reading: "Donna ongaku ga suki desu ka?",
            english: { en: "What kind of music do you like?", np: "कस्तो सङ्गीत मनपर्छ?" },
            scenario: { en: "Type preference", np: "प्रकार प्राथमिकता" },
          },
          {
            japanese: "どんなしごとをしたいですか。",
            reading: "Donna shigoto o shitai desu ka?",
            english: { en: "What kind of work do you want to do?", np: "कस्तो काम गर्न चाहनुहुन्छ?" },
            scenario: { en: "Career aspiration", np: "करियर आकांक्षा" },
          },
          {
            japanese: "どんなひとがすきですか。",
            reading: "Donna hito ga suki desu ka?",
            english: { en: "What kind of person do you like?", np: "कस्तो मान्छे मनपर्छ?" },
            scenario: { en: "Preference about people", np: "मान्छेको बारेमा प्राथमिकता" },
          },
        ],
      },
      {
        number: 5,
        name: { en: "Negative of ほしい and たい — ほしくない / たくない", np: "ほしい र たい को नकार — ほしくない / たくない" },
        meaning: {
          en: "Both ほしい and たい are い-adj so their negatives follow い-adj rules. ほしい negative: ほしくない(です). たい negative: たくない(です). Past: ほしかった / たかった. Past-neg: ほしくなかった / たくなかった.",
          np: "ほしい र たい दुवै い-adj भएकाले नकार い-adj नियम अनुसार। ほしい नकार: ほしくない(です)। たい नकार: たくない(です)। भूत: ほしかった / たかった। भूत-नकार: ほしくなかった / たくなかった।",
        },
        whereWeUse: [
          { en: "Negative: いきたくないです (I don't want to go)", np: "नकार: いきたくないです" },
          { en: "Negative ほしい: なにもほしくないです (I don't want anything)", np: "नकार ほしい: なにもほしくないです" },
          { en: "Past: あのえいがをみたかったです (I wanted to see that movie)", np: "भूत: あのえいがをみたかったです" },
        ],
        examples: [
          {
            japanese: "きょうはどこにもいきたくないです。",
            reading: "Kyō wa doko ni mo ikitaku nai desu.",
            english: { en: "I don't want to go anywhere today.", np: "आज कतै जान मन छैन।" },
            scenario: { en: "Negative たい with どこにも", np: "どこにも सँग नकारात्मक たい" },
          },
          {
            japanese: "そのかばんはほしくなかったです。",
            reading: "Sono kaban wa hoshiku nakatta desu.",
            english: { en: "I didn't want that bag.", np: "त्यो झोला चाहिएको थिएन।" },
            scenario: { en: "Past-negative ほしい", np: "भूत-नकार ほしい" },
          },
          {
            japanese: "ずっとにほんへいきたかったです。",
            reading: "Zutto Nihon e ikitakatta desu.",
            english: { en: "I always wanted to go to Japan.", np: "सधैं जापान जान चाहेको थिएँ।" },
            scenario: { en: "Past たい expressing long-held desire", np: "लामो समयदेखिको इच्छा भूत たい" },
          },
        ],
      },
    ],
    particles: [
      {
        particle: "が",
        romaji: "ga",
        name: { en: "Subject of desire (ほしい)", np: "इच्छाको Subject (ほしい)" },
        meaning: {
          en: "With ほしいです, the desired object/noun is marked by が. Pattern: [thing] が ほしいです. This が is the same subject marker seen with すき/きらい — it marks what the desire targets.",
          np: "ほしいです सँग चाहिने वस्तु/Noun が ले चिन्ह। Pattern: [वस्तु] が ほしいです। यो が, すき/きらい सँग देखिने त्यही subject marker — इच्छाले के लक्षित गर्छ चिन्ह।",
        },
        examples: [
          {
            japanese: "あたらしいかばんがほしいです。",
            reading: "Atarashii kaban ga hoshii desu.",
            english: { en: "I want a new bag.", np: "नयाँ झोला चाहिन्छ।" },
            scenario: { en: "が marking the desired noun", np: "が ले चाहिने Noun" },
          },
          {
            japanese: "なにがほしいですか。",
            reading: "Nani ga hoshii desu ka?",
            english: { en: "What do you want?", np: "के चाहिन्छ?" },
            scenario: { en: "なに が in a want question", np: "इच्छा प्रश्नमा なに が" },
          },
        ],
      },
    ],
    vocabulary: buildVocab(13),
    mcqs: [
      {
        question: { en: "Which sentence says 'I want a new car'?", np: "'मलाई नयाँ कार चाहिन्छ' भन्ने वाक्य कुन हो?" },
        choices: [
          "あたらしいくるまがほしいです",
          "あたらしいくるまをほしいです",
          "あたらしいくるまにほしいです",
          "あたらしいくるまはほしいです",
        ],
        correctIndex: 0,
        explanation: { en: "ほしいです takes が for the desired noun. あたらしいくるまが ほしいです.", np: "ほしいです, チャहिने Noun को लागि が। あたらしいくるまが ほしいです।" },
      },
      {
        question: { en: "What does うみへおよぎにいきます mean?", np: "うみへおよぎにいきます को अर्थ के हो?" },
        choices: [
          { en: "I go to the sea to swim", np: "पौड्न समुद्रमा जान्छु" },
          { en: "I swim in the sea", np: "समुद्रमा पौड्छु" },
          { en: "I want to swim in the sea", np: "समुद्रमा पौड्न चाहन्छु" },
          { en: "I went to the sea yesterday", np: "हिजो समुद्रमा गएँ" },
        ],
        correctIndex: 0,
        explanation: { en: "V-stem + に + movement verb = going FOR THE PURPOSE of V. おようぎ (stem of およぐ) に いきます = go to swim.", np: "V-stem + に + movement verb = V को उद्देश्यले जाने। おようぎ (およぐ को stem) に いきます = पौड्न जान्छु।" },
      },
      {
        question: { en: "What is the difference between ほしい and たい?", np: "ほしい र たい को फरक के हो?" },
        choices: [
          { en: "ほしい = want a THING (noun); たい = want to DO (verb)", np: "ほしい = वस्तु चाहिन्छ (noun); たい = गर्न चाहन्छु (verb)" },
          { en: "ほしい = want to DO; たい = want a THING", np: "ほしい = गर्न चाहन्छु; たい = वस्तु चाहिन्छ" },
          { en: "Both mean the same thing", np: "दुवैको अर्थ उही" },
          { en: "ほしい is past tense; たい is present", np: "ほしい भूतकाल; たい वर्तमान" },
        ],
        correctIndex: 0,
        explanation: { en: "ほしい follows a noun (want a THING). たい follows a verb stem (want to DO). Both conjugate as い-adj.", np: "ほしい, Noun पछि (वस्तु चाहिन्छ)। たい, Verb stem पछि (गर्न चाहन्छु)। दुवै い-adj।" },
      },
      {
        question: { en: "How do you say 'I don't want to go'?", np: "'म जान चाहिँदैन' कसरी भनिन्छ?" },
        choices: ["いきたくないです", "いきほしくないです", "いきたいじゃないです", "いきくないです"],
        correctIndex: 0,
        explanation: { en: "たい is an い-adj. Negative of たい = たくない. いき (stem) + たくない + です = いきたくないです.", np: "たい, い-adj। नकार = たくない। いき (stem) + たくない + です = いきたくないです।" },
      },
      {
        question: { en: "Fill the blank: どんな___がほしいですか。(What kind of ___ do you want?)", np: "खाली भर्नुस्: どんな___がほしいですか।" },
        choices: [
          { en: "Any noun (e.g. プレゼント, くるま)", np: "कुनै Noun (जस्तै プレゼント, くるま)" },
          { en: "Verb stem", np: "Verb stem" },
          { en: "Adjective", np: "विशेषण" },
          { en: "Particle", np: "Particle" },
        ],
        correctIndex: 0,
        explanation: { en: "どんな modifies nouns. どんな + [noun] が ほしいですか = what kind of [noun] do you want?", np: "どんな ले Noun modify गर्छ। どんな + [Noun] が ほしいですか।" },
      },
      {
        question: { en: "What is the purpose-of-movement pattern?", np: "आन्दोलनको उद्देश्य pattern के हो?" },
        choices: [
          { en: "[place] へ [V-stem] に いきます", np: "[ठाउँ] へ [V-stem] に いきます" },
          { en: "[place] を [V-stem] に いきます", np: "[ठाउँ] を [V-stem] に いきます" },
          { en: "[place] で [V-stem] が いきます", np: "[ठाउँ] で [V-stem] が いきます" },
          { en: "[place] に [V-stem] が いきます", np: "[ठाउँ] に [V-stem] が いきます" },
        ],
        correctIndex: 0,
        explanation: { en: "Purpose: [place] へ [V-stem] に [movement verb]. The に signals 'in order to'. うみへ あそびに いきます.", np: "उद्देश्य: [ठाउँ] へ [V-stem] に [movement verb]। に ले 'को लागि'। うみへ あそびに いきます।" },
      },
      {
        question: { en: "Which is correct: 'I went to the library to study'?", np: "'पढ्न पुस्तकालय गएँ' को सही जापानी कुन हो?" },
        choices: [
          "としょかんへべんきょうしにいきました",
          "としょかんでべんきょうにいきました",
          "としょかんをべんきょうしにいきました",
          "としょかんにべんきょうたいいきました",
        ],
        correctIndex: 0,
        explanation: { en: "Purpose: としょかん(library)へ + べんきょうし(study stem)に + いきました(went). All correct particles.", np: "उद्देश्य: としょかん(पुस्तकालय)へ + べんきょうし(पढ्ने stem)に + いきました(गएँ)।" },
      },
      {
        question: { en: "Past tense of ほしい?", np: "ほしい को भूत रूप के हो?" },
        choices: ["ほしかったです", "ほしいでした", "ほしくでした", "ほしかったます"],
        correctIndex: 0,
        explanation: { en: "ほしい is an い-adj. Past = [stem]かった + です. ほし + かった + です = ほしかったです.", np: "ほしい, い-adj। भूत = [stem]かった + です। ほし + かった + です = ほしかったです।" },
      },
      {
        question: { en: "What is どんな used for?", np: "どんな कसको लागि प्रयोग हुन्छ?" },
        choices: [
          { en: "Asking 'what kind of' (type/quality)", np: "'कस्तो' (प्रकार/गुण) सोध्न" },
          { en: "Asking 'which one' from a set", np: "सेटबाट 'कुन' सोध्न" },
          { en: "Asking 'how many'", np: "'कति' सोध्न" },
          { en: "Asking 'where'", np: "'कहाँ' सोध्न" },
        ],
        correctIndex: 0,
        explanation: { en: "どんな = what kind of. It asks about type or quality, not a specific item from a set (that's どの/どれ).", np: "どんな = कस्तो। प्रकार वा गुण सोध्छ, सेटबाट specific वस्तु होइन (त्यो どの/どれ)।" },
      },
      {
        question: { en: "Which particle marks the object when using V-stem たいです?", np: "V-stem たいです प्रयोग गर्दा object कुन Particle ले चिन्ह गर्छ?" },
        choices: ["を", "が", "に", "は"],
        correctIndex: 0,
        explanation: { en: "With たいです, the object of the verb keeps を: すしをたべたいです. Only the が is for すき/きらい/ほしい type adjectives.", np: "たいです सँग verb को object, を नै: すしをたべたいです। が, すき/きらい/ほしい type adj को लागि।" },
      },
    ],
  },
  {
    id: 14,
    title: "Lesson 14 — てください・ています (て-form)",
    intro: [
      {
        en: "In this lesson you learn the te-form (て-form) of verbs — the most important building block in Japanese grammar. It is used to make requests (てください), describe ongoing actions or states (ています), and connect verbs.",
        np: "यस पाठमा Verb को て-form सिक्नुहुनेछ — जापानी व्याकरणको सबभन्दा महत्त्वपूर्ण आधार। अनुरोध (てください), जारी कार्य वा अवस्था (ています), र Verb जोड्न प्रयोग।",
      },
      {
        en: "て-form construction rules depend on verb group: Group 1 (u-verbs) — the final kana changes sound; Group 2 (ru-verbs) — drop る, add て; Irregular — する → して、くる → きて.",
        np: "て-form बनाउने नियम Verb group अनुसार: Group 1 (u-verb) — अन्तिम kana परिवर्तन; Group 2 (ru-verb) — る हटाएर て; Irregular — する → して、くる → きて।",
      },
      {
        en: "ています has two main meanings: an action in progress (いま よんでいます — reading now) and a resulting state (けっこんしています — is married, i.e. got married and the state continues).",
        np: "ています को दुई मुख्य अर्थ: जारी कार्य (いま よんでいます — अहिले पढ्दैछु) र resulting state (けっこんしています — विवाहित छ — विवाह भएको र अवस्था जारी)।",
      },
    ],
    youtubeVideoId: { en: "rjIB-PPVQZY" },
    youtubeVideoIdPart2: { en: "2a3ZWlFcFM8" },
    youtubeTitle: "Minna no Nihongo · Lesson 14 — Grammar",
    conversation: [
      {
        speaker: "A",
        japanese: "すみません、しずかにしてください。",
        reading: "Sumimasen, shizuka ni shite kudasai.",
        english: { en: "Excuse me, please be quiet.", np: "माफ गर्नुस्, शान्त रहिदिनुस्।" },
      },
      {
        speaker: "B",
        japanese: "すみません。いまなにをしていますか。",
        reading: "Sumimasen. Ima nani o shite imasu ka?",
        english: { en: "Sorry. What are you doing now?", np: "माफ गर्नुस्। अहिले के गर्दैहुनुहुन्छ?" },
      },
      {
        speaker: "A",
        japanese: "しゅくだいをしています。てつだってください。",
        reading: "Shukudai o shite imasu. Tetsudatte kudasai.",
        english: { en: "I am doing homework. Please help me.", np: "गृहकार्य गर्दैछु। मद्दत गरिदिनुस्।" },
      },
      {
        speaker: "B",
        japanese: "もうたべましたか。",
        reading: "Mō tabemashita ka?",
        english: { en: "Have you already eaten?", np: "खाइसक्नुभयो?" },
      },
      {
        speaker: "A",
        japanese: "いいえ、まだたべていません。",
        reading: "Iie, mada tabete imasen.",
        english: { en: "No, I haven't eaten yet.", np: "होइन, अझै खाएको छैन।" },
      },
      {
        speaker: "B",
        japanese: "いっしょにたべましょう。はやくきてください。",
        reading: "Issho ni tabemashō. Hayaku kite kudasai.",
        english: { en: "Let's eat together. Please come quickly.", np: "सँगै खाउँ। छिटो आइदिनुस्।" },
      },
    ],
    grammar: [
      {
        number: 1,
        name: { en: "て-form construction rules (all three groups)", np: "て-form बनाउने नियमहरू (तीनै समूह)" },
        meaning: {
          en: "Group 2 (eru/iru verbs): drop る, add て. Group 1 (all others): change final kana → く→いて、ぐ→いで、す→して、つ/る/う→って、ぬ/ぶ/む→んで. Exception: いく→いって. Irregular: する→して、くる→きて.",
          np: "Group 2 (eru/iru verb): る हटाएर て। Group 1: अन्तिम kana → く→いて、ぐ→いで、す→して、つ/る/う→って、ぬ/ぶ/む→んで। Exception: いく→いって। Irregular: する→して、くる→きて।",
        },
        whereWeUse: [
          { en: "Group 2: たべる→たべて、みる→みて、おきる→おきて", np: "Group 2: たべる→たべて、みる→みて、おきる→おきて" },
          { en: "Group 1 -く: かく→かいて、きく→きいて (いく exception: いく→いって)", np: "Group 1 -く: かく→かいて、きく→きいて (いく exception: いって)" },
          { en: "Group 1 -う/つ/る: かう→かって、まつ→まって、とる→とって", np: "Group 1 -う/つ/る: かう→かって、まつ→まって、とる→とって" },
        ],
        examples: [
          {
            japanese: "たべる → たべて ／ みる → みて",
            reading: "taberu → tabete / miru → mite",
            english: { en: "Group 2: drop る, add て", np: "Group 2: る हटाएर て" },
            scenario: { en: "Group 2 conjugation", np: "Group 2 conjugation" },
          },
          {
            japanese: "かく → かいて ／ いく → いって",
            reading: "kaku → kaite / iku → itte",
            english: { en: "Group 1 -く: く → いて (except いく → いって)", np: "Group 1 -く: く → いて (いく → いって exception)" },
            scenario: { en: "Group 1 -く with exception", np: "Group 1 -く र exception" },
          },
          {
            japanese: "する → して ／ くる → きて",
            reading: "suru → shite / kuru → kite",
            english: { en: "Irregular verbs", np: "अनियमित Verb" },
            scenario: { en: "Irregular て-form", np: "अनियमित て-form" },
          },
        ],
      },
      {
        number: 2,
        name: { en: "V-て + ください — polite request 'please do V'", np: "V-て + ください — विनम्र अनुरोध 'V गरिदिनुस्'" },
        meaning: {
          en: "Attach ください to the て-form to make a polite request. Pattern: [V-て] ください. To ask politely: [て-form] + ください. For commands, use more directly (てください), for softer request add すみません first.",
          np: "て-form मा ください थप्दा विनम्र अनुरोध। Pattern: [V-て] ください। नरम अनुरोधको लागि पहिले すみません।",
        },
        whereWeUse: [
          { en: "Direction: みぎへ まがってください (please turn right)", np: "दिशा: みぎへ まがってください" },
          { en: "Hurry: はやく きてください (please come quickly)", np: "हतार: はやく きてください" },
          { en: "Help: てつだってください (please help me)", np: "मद्दत: てつだってください" },
        ],
        examples: [
          {
            japanese: "ここになまえをかいてください。",
            reading: "Koko ni namae o kaite kudasai.",
            english: { en: "Please write your name here.", np: "यहाँ नाम लेखिदिनुस्।" },
            scenario: { en: "Administrative request", np: "प्रशासनिक अनुरोध" },
          },
          {
            japanese: "しずかにしてください。",
            reading: "Shizuka ni shite kudasai.",
            english: { en: "Please be quiet.", np: "शान्त रहिदिनुस्।" },
            scenario: { en: "Manner request", np: "व्यवहार अनुरोध" },
          },
          {
            japanese: "もういちどいってください。",
            reading: "Mō ichi-do itte kudasai.",
            english: { en: "Please say it one more time.", np: "अझ एकपटक भनिदिनुस्।" },
            scenario: { en: "Classroom request", np: "कक्षाकोठाको अनुरोध" },
          },
        ],
      },
      {
        number: 3,
        name: { en: "V-て + います — ongoing action (progressive)", np: "V-て + います — जारी कार्य (progressive)" },
        meaning: {
          en: "V-て + います describes an action in progress right now. Pattern: [subject] は [V-て] います. Question: なにを しています か. This use is equivalent to English '-ing'. Negative: V-て + いません.",
          np: "V-て + います ले अहिले जारी कार्य बताउँछ। Pattern: [subject] は [V-て] います। प्रश्न: なにを しています か। अङ्ग्रेजीको '-ing' जस्तै। नकार: V-て + いません।",
        },
        whereWeUse: [
          { en: "Reading: いまほんをよんでいます (reading a book now)", np: "पढ्दैछु: いまほんをよんでいます" },
          { en: "Working: かいしゃではたらいています (working at a company)", np: "काम गर्दैछु: かいしゃではたらいています" },
          { en: "Negative: まだたべていません (not eating yet)", np: "नकार: まだたべていません" },
        ],
        examples: [
          {
            japanese: "いまにほんごをべんきょうしています。",
            reading: "Ima Nihongo o benkyō shite imasu.",
            english: { en: "I am studying Japanese now.", np: "अहिले जापानी पढ्दैछु।" },
            scenario: { en: "Ongoing study", np: "जारी पढाइ" },
          },
          {
            japanese: "かのじょはでんわをしています。",
            reading: "Kanojo wa denwa o shite imasu.",
            english: { en: "She is on the phone.", np: "उनी फोनमा छिन्।" },
            scenario: { en: "Action in progress", np: "जारी कार्य" },
          },
          {
            japanese: "まだしゅくだいをしていません。",
            reading: "Mada shukudai o shite imasen.",
            english: { en: "I haven't done the homework yet.", np: "अझै गृहकार्य गरेको छैन।" },
            scenario: { en: "Negative progressive with まだ", np: "まだ सँग नकारात्मक progressive" },
          },
        ],
      },
      {
        number: 4,
        name: { en: "V-て + います — resulting state", np: "V-て + います — resulting state (परिणामी अवस्था)" },
        meaning: {
          en: "ています also describes a STATE resulting from a completed action. Examples: しっています (I know — have come to know and the state continues), けっこんしています (is married — got married, state continues), すんでいます (lives in — settled and stays).",
          np: "ています ले पूरा भएको कार्यबाट परिणामी STATE पनि बताउँछ। जस्तै: しっています (थाहा छ), けっこんしています (विवाहित छ), すんでいます (बस्छ)।",
        },
        whereWeUse: [
          { en: "Knowledge: しっています (I know) / しりません (I don't know — NOT しっていません)", np: "ज्ञान: しっています / शिरません (know/don't know)" },
          { en: "Marital status: けっこんしています (is married)", np: "वैवाहिक अवस्था: けっこんしています" },
          { en: "Residence: とうきょうにすんでいます (lives in Tokyo)", np: "निवास: とうきょうにすんでいます" },
        ],
        examples: [
          {
            japanese: "やまださんはとうきょうにすんでいます。",
            reading: "Yamada-san wa Tōkyō ni sunde imasu.",
            english: { en: "Yamada lives in Tokyo.", np: "यामाडाजी टोक्योमा बस्नुहुन्छ।" },
            scenario: { en: "Residence (resulting state)", np: "निवास (resulting state)" },
          },
          {
            japanese: "かれはもうけっこんしています。",
            reading: "Kare wa mō kekkon shite imasu.",
            english: { en: "He is already married.", np: "उनी पहिले नै विवाहित छन्।" },
            scenario: { en: "Marital state", np: "वैवाहिक अवस्था" },
          },
          {
            japanese: "このことばをしっていますか。",
            reading: "Kono kotoba o shitte imasu ka?",
            english: { en: "Do you know this word?", np: "यो शब्द थाहा छ?" },
            scenario: { en: "Knowledge state — しっています", np: "ज्ञान अवस्था — しっています" },
          },
        ],
      },
      {
        number: 5,
        name: { en: "もう + past vs まだ + negative — already / not yet", np: "もう + भूत vs まだ + नकार — पहिले नै / अझै" },
        meaning: {
          en: "もう (already) pairs with a PAST positive verb: もうたべました (already ate). まだ (still / not yet) pairs with NEGATIVE: まだたべていません (haven't eaten yet). KEY: もう + negative means 'not anymore'.",
          np: "もう (पहिले नै) PAST positive verb सँग: もうたべました। まだ (अझै) NEGATIVE सँग: まだたべていません। KEY: もう + नकार = 'अब होइन' (not anymore)।",
        },
        whereWeUse: [
          { en: "Already done: もうしゅくだいをしました (already did homework)", np: "पहिले नै: もうしゅくだいをしました" },
          { en: "Not yet: まだしゅくだいをしていません (haven't done homework yet)", np: "अझै: まだしゅくだいをしていません" },
          { en: "Not anymore: もうたべません (I won't eat anymore)", np: "अब होइन: もうたべません" },
        ],
        examples: [
          {
            japanese: "もうたべましたか。",
            reading: "Mō tabemashita ka?",
            english: { en: "Have you already eaten?", np: "खाइसक्नुभयो?" },
            scenario: { en: "Asking with もう", np: "もう ले सोध्दा" },
          },
          {
            japanese: "いいえ、まだたべていません。",
            reading: "Iie, mada tabete imasen.",
            english: { en: "No, I haven't eaten yet.", np: "होइन, अझै खाएको छैन।" },
            scenario: { en: "まだ + negative ています", np: "まだ + नकारात्मक ています" },
          },
          {
            japanese: "はい、もうたべました。",
            reading: "Hai, mō tabemashita.",
            english: { en: "Yes, I already ate.", np: "हो, पहिले नै खाएँ।" },
            scenario: { en: "もう + past tense", np: "もう + भूतकाल" },
          },
        ],
      },
    ],
    particles: [
      {
        particle: "て",
        romaji: "te",
        name: { en: "て-form (connector / request / progressive marker)", np: "て-form (जोडक / अनुरोध / progressive marker)" },
        meaning: {
          en: "The て-form is not a particle but a verb form. It connects verbs (V-て V = do V and then V), makes requests (V-てください), and combines with います to form progressive/state structures.",
          np: "て-form Particle होइन तर Verb form हो। Verb जोड्छ (V-て V = V गरेर V), अनुरोध गर्छ (V-てください), र います सँग मिलाएर progressive/state बनाउँछ।",
        },
        examples: [
          {
            japanese: "はやくきてください。",
            reading: "Hayaku kite kudasai.",
            english: { en: "Please come quickly.", np: "छिटो आइदिनुस्।" },
            scenario: { en: "てください request", np: "てください अनुरोध" },
          },
          {
            japanese: "いまよんでいます。",
            reading: "Ima yonde imasu.",
            english: { en: "I am reading now.", np: "अहिले पढ्दैछु।" },
            scenario: { en: "ています progressive", np: "ています progressive" },
          },
        ],
      },
    ],
    vocabulary: buildVocab(14),
    mcqs: [
      {
        question: { en: "What is the て-form of たべる (Group 2)?", np: "たべる (Group 2) को て-form के हो?" },
        choices: ["たべて", "たべって", "たべいて", "たべnte"],
        correctIndex: 0,
        explanation: { en: "Group 2: drop る, add て. たべる → drop る → たべ + て = たべて.", np: "Group 2: る हटाएर て। たべる → る हटाउनुस् → たべ + て = たべて।" },
      },
      {
        question: { en: "What is the て-form of かく (write)?", np: "かく (लेख्नु) को て-form के हो?" },
        choices: ["かいて", "かって", "かくて", "かnde"],
        correctIndex: 0,
        explanation: { en: "Group 1 -く: く → いて. かく → かいて.", np: "Group 1 -く: く → いて। かく → かいて।" },
      },
      {
        question: { en: "What is the て-form of いく (go)?", np: "いく (जानु) को て-form के हो?" },
        choices: ["いって", "いいて", "いくて", "いんで"],
        correctIndex: 0,
        explanation: { en: "いく is an exception: いく → いって (not いいて). This is the only -く verb that uses って instead of いて.", np: "いく exception: いく → いって (いいて होइन)। -く verb मध्ये त्यसको मात्र って।" },
      },
      {
        question: { en: "What does てください do?", np: "てください ले के गर्छ?" },
        choices: [
          { en: "Makes a polite request: please do V", np: "विनम्र अनुरोध: V गरिदिनुस्" },
          { en: "Describes an ongoing action", np: "जारी कार्य बताउँछ" },
          { en: "Expresses a past completed action", np: "भूतकालीन पूरा कार्य बताउँछ" },
          { en: "Expresses desire to do V", np: "V गर्ने इच्छा बताउँछ" },
        ],
        correctIndex: 0,
        explanation: { en: "V-て + ください = please do V (polite request). E.g. かいてください = please write.", np: "V-て + ください = V गरिदिनुस् (विनम्र अनुरोध)। जस्तै: かいてください = लेखिदिनुस्।" },
      },
      {
        question: { en: "What does いまほんをよんでいます mean?", np: "いまほんをよんでいます को अर्थ के हो?" },
        choices: [
          { en: "I am reading a book now (ongoing action)", np: "अहिले किताब पढ्दैछु (जारी कार्य)" },
          { en: "I read a book (past)", np: "किताब पढें (भूत)" },
          { en: "I want to read a book", np: "किताब पढ्न चाहन्छु" },
          { en: "Please read a book", np: "किताब पढिदिनुस्" },
        ],
        correctIndex: 0,
        explanation: { en: "V-て + います = action in progress. よんで (te-form of よむ) + います = am reading.", np: "V-て + います = जारी कार्य। よんで (よむ को て-form) + います = पढ्दैछु।" },
      },
      {
        question: { en: "Which sentence says 'I haven't eaten yet'?", np: "'अझै खाएको छैन' भन्ने वाक्य कुन हो?" },
        choices: [
          "まだたべていません",
          "もうたべていません",
          "まだたべませんでした",
          "もうたべませんでした",
        ],
        correctIndex: 0,
        explanation: { en: "まだ (not yet) + negative ています form. まだ + たべて + いません = haven't eaten yet.", np: "まだ (अझै) + नकारात्मक ています। まだ + たべて + いません = अझै खाएको छैन।" },
      },
      {
        question: { en: "What is the て-form of する?", np: "する को て-form के हो?" },
        choices: ["して", "すて", "すって", "するて"],
        correctIndex: 0,
        explanation: { en: "する is irregular. Its て-form is して (not すて or すって).", np: "する अनियमित। て-form = して (すて वा すって होइन)।" },
      },
      {
        question: { en: "とうきょうにすんでいます means…?", np: "とうきょうにすんでいます को अर्थ के हो?" },
        choices: [
          { en: "Lives in Tokyo (resulting state)", np: "टोक्योमा बस्छ (resulting state)" },
          { en: "Is going to Tokyo", np: "टोक्यो जाँदैछ" },
          { en: "Went to Tokyo", np: "टोक्यो गयो" },
          { en: "Is studying in Tokyo", np: "टोक्योमा पढ्दैछ" },
        ],
        correctIndex: 0,
        explanation: { en: "すんでいます = lives (resulting state of having moved). とうきょうに = in Tokyo.", np: "すんでいます = बस्छ (resulting state of having moved)। とうきょうに = टोक्योमा।" },
      },
      {
        question: { en: "What is the て-form of のむ (drink)?", np: "のむ (पिउनु) को て-form के हो?" },
        choices: ["のんで", "のいで", "のって", "のmて"],
        correctIndex: 0,
        explanation: { en: "Group 1 -む: む → んで. のむ → のんで.", np: "Group 1 -む: む → んで। のむ → のんで।" },
      },
      {
        question: { en: "What does もうたべました mean?", np: "もうたべました को अर्थ के हो?" },
        choices: [
          { en: "I already ate", np: "पहिले नै खाएँ" },
          { en: "I haven't eaten yet", np: "अझै खाएको छैन" },
          { en: "I am eating now", np: "अहिले खाँदैछु" },
          { en: "I will eat soon", np: "छिट्टै खान्छु" },
        ],
        correctIndex: 0,
        explanation: { en: "もう (already) + past verb たべました (ate). = already ate. Contrast: まだたべていません = haven't eaten yet.", np: "もう (पहिले नै) + भूत verb たべました (खाएँ)। = पहिले नै खाएँ। विरोधाभास: まだたべていません = अझै खाएको छैन।" },
      },
    ],
  },
];

export function getLessonPage(id: number): N5LessonPageData | undefined {
  return N5_LESSON_PAGES.find((l) => l.id === id);
}
