import type { N5LessonSpec } from "@/lib/japanese-learning/build-japanese-detail";
import { mkLesson as mk } from "@/lib/japanese-learning/n5-lesson-factory";

/** Days 1–7 — Minna I Lessons 1–7 (split across files for maintainability). */
export const JP_N5_PART1: N5LessonSpec[] = [
  mk({
    minnaLesson: 1,
    dialogue: [
      {
        ja: "はじめまして。ワットです。イギリスじんです。",
        reading: "Hajimemashite. Watto desu. Igirisujin desu.",
        en: "Nice to meet you. I’m Watt. I’m British.",
      },
      {
        ja: "どうぞよろしくおねがいします。",
        reading: "Dōzo yoroshiku onegaishimasu.",
        en: "Pleased to meet you / please treat me well.",
      },
    ],
    particles: [
      { particle: "は", note: "Topic marker: X は Y です = “As for X, it is Y.”" },
      { particle: "か", note: "Question particle at the end of polite questions." },
      { particle: "の", note: "Connects nouns: イギリスじん = “British person”." },
    ],
    grammarBullets: [
      "Copula です for polite statements; drop for casual later.",
      "だれですか / なんですか for “who / what” information questions.",
      "国籍・occupation pattern: Xじんです · Xです as identification.",
    ],
    grammarTable: {
      caption: "Basic patterns",
      headers: ["Pattern", "Meaning"],
      rows: [
        ["A は B です。", "A is B."],
        ["A は B ですか。", "Is A B?"],
      ],
    },
    mcqs: [
      {
        question: "Choose the natural introduction:",
        choices: [
          "わたしはイギリスじんです。",
          "わたしイギリスじんです。",
          "わたしがイギリスじんですか。",
          "わたしもイギリスじんですか。",
        ],
        correctIndex: 0,
        explanation: "Topic は + です is the textbook polite pattern.",
      },
      {
        question: "Which sentence is a yes/no question?",
        choices: [
          "がくせいです。",
          "がくせいですか。",
          "がくせいじゃありません。",
          "がくせいでした。",
        ],
        correctIndex: 1,
      },
    ],
    listening: {
      scenario:
        "Two classmates introduce names and countries after class; names repeat slowly.",
      instruction:
        "Listen twice; note each speaker’s country word (〜じん). Ignore fillers like ええと.",
      keyPhrases: ["はじめまして", "〜じんです", "どうぞよろしく"],
      studyTip: "Shadow at 0.9× speed from textbook audio if available.",
    },
  }),
  mk({
    minnaLesson: 2,
    dialogue: [
      {
        ja: "これはじしょです。あれはびょういんです。",
        reading: "Kore wa jisho desu. Are wa byōin desu.",
        en: "This is a dictionary. That (over there) is a hospital.",
      },
      {
        ja: "それはいくらですか。",
        reading: "Sore wa ikura desu ka.",
        en: "How much is that?",
      },
    ],
    particles: [
      { particle: "これ・それ・あれ", note: "Demonstratives by distance from speaker/listener." },
      { particle: "この・その・あの + N", note: "Which thing — near me / near you / away." },
      { particle: "も", note: "Also / too — replaces は when adding another topic." },
    ],
    grammarBullets: [
      "これは〜です vs この〜は〜です (pronoun vs noun modifier).",
      "いくらですか for prices; 〜えん with numbers.",
    ],
    mcqs: [
      {
        question: "Ask “How much is this?” politely:",
        choices: ["これはいくらです。", "これはいくらですか。", "これいくら。", "これがいくらですか。"],
        correctIndex: 1,
      },
      {
        question: "Talk about something near the listener:",
        choices: ["これ", "それ", "あれ", "どれ"],
        correctIndex: 1,
      },
    ],
    listening: {
      scenario: "Shop dialogue: clerk points at items with これ／それ and states prices.",
      instruction: "Catch numbers + えん; notice polite store endings です.",
      keyPhrases: ["いくら", "えん", "それ"],
    },
  }),
  mk({
    minnaLesson: 3,
    dialogue: [
      {
        ja: "つくえのうえにほんがあります。",
        reading: "Tsukue no ue ni hon ga arimasu.",
        en: "There is a book on the desk.",
      },
      {
        ja: "かばんのなかにケータイがありますか。",
        reading: "Kaban no naka ni kētai ga arimasu ka.",
        en: "Is there a phone in the bag?",
      },
    ],
    particles: [
      { particle: "に", note: "Location of existence with ある／いる (flat surface / container)." },
      { particle: "が", note: "Introduces new information in existence sentences." },
      { particle: "の", note: "Possession / modification: つくえのうえ." },
    ],
    grammarBullets: [
      "ある for inanimate things; いる for people/animals (preview later lessons).",
      "Place words: うえ／した／なか／となり / まえ / うしろ.",
    ],
    mcqs: [
      {
        question: "Choose the natural existence sentence:",
        choices: [
          "つくえにほんです。",
          "つくえにほんがあります。",
          "つくえでほんがあります。",
          "つくえがほんがあります。",
        ],
        correctIndex: 1,
      },
      {
        question: "Particle after location for あります:",
        choices: ["は", "が", "に", "を"],
        correctIndex: 2,
      },
    ],
    listening: {
      scenario: "Room description: several items with position words.",
      instruction: "Map items to locations (うえ／なか／となり).",
      keyPhrases: ["あります", "に", "のうえ"],
    },
  }),
  mk({
    minnaLesson: 4,
    dialogue: [
      {
        ja: "まいにちジムでべんきょうします。きのうはビールをのみました。",
        reading: "Mainichi jimu de benkyō shimasu. Kinō wa bīru o nomimashita.",
        en: "I study at the gym every day. Yesterday I drank beer.",
      },
    ],
    particles: [
      { particle: "を", note: "Direct object marker with transitive verbs." },
      { particle: "で", note: "Means / place of action: ジムで." },
      { particle: "に", note: "Time points (some uses): future lessons refine." },
    ],
    grammarBullets: [
      "ます／ません／ました／ませんでした — polite present/past and negative.",
      "まいにち／ときどき type frequency adverbs before verb.",
    ],
    grammarTable: {
      headers: ["Form", "Use"],
      rows: [
        ["Vます", "present affirmative polite"],
        ["Vません", "present negative polite"],
        ["Vました", "past affirmative polite"],
      ],
    },
    mcqs: [
      {
        question: "Past affirmative of のむ:",
        choices: ["のみます", "のみません", "のみました", "のみませんでした"],
        correctIndex: 2,
      },
      {
        question: "Object marker with たべます:",
        choices: ["は", "が", "を", "に"],
        correctIndex: 2,
      },
    ],
    listening: {
      scenario: "Daily routine monologue with yesterday contrast.",
      instruction: "Mark which actions are today vs きのう.",
      keyPhrases: ["ます", "ました", "きのう"],
    },
  }),
  mk({
    minnaLesson: 5,
    dialogue: [
      {
        ja: "あしたオフィスへいきます。ちかてつでいきます。",
        reading: "Ashita ofisu e ikimasu. Chikatetsu de ikimasu.",
        en: "Tomorrow I’ll go to the office. I’ll go by subway.",
      },
    ],
    particles: [
      { particle: "へ", note: "Direction toward (similar overlap with に for movement)." },
      { particle: "で", note: "Means of movement: train / foot / car." },
      { particle: "と", note: "Together-with / companion." },
    ],
    grammarBullets: [
      "いく／くる／かえる as movement verbs with destination / origin.",
      "Time expressions before predicate: あした／きょう／きのう.",
    ],
    mcqs: [
      {
        question: "Natural sentence for “go by bus”:",
        choices: [
          "バスでいきます。",
          "バスにいきます。",
          "バスへいきます。",
          "バスをいきます。",
        ],
        correctIndex: 0,
      },
      {
        question: "へ marks:",
        choices: ["topic", "goal direction", "reason", "past tense"],
        correctIndex: 1,
      },
    ],
    listening: {
      scenario: "Friend explains commute method and tomorrow plan.",
      instruction: "Identify destination word + transport particle で.",
      keyPhrases: ["へ", "で", "あした"],
    },
  }),
  mk({
    minnaLesson: 6,
    dialogue: [
      {
        ja: "コーヒーをのみます。パンをたべます。レストランでコーヒーをのみます。",
        reading: "Kōhī o nomimasu. Pan o tabemasu. Resutoran de kōhī o nomimasu.",
        en: "I drink coffee. I eat bread. I drink coffee at a restaurant.",
      },
    ],
    particles: [
      { particle: "を", note: "Direct object — marks thing acted upon." },
      { particle: "で", note: "Location where action happens (eat/drink/study)." },
    ],
    grammarBullets: [
      "Transitive verb frames: NP を Vます.",
      "Contrast で vs に for location (action vs existence).",
    ],
    mcqs: [
      {
        question: "Correct particle: みず___のみます。",
        choices: ["は", "が", "を", "で"],
        correctIndex: 2,
      },
      {
        question: "Eat at home:",
        choices: ["いえでパンをたべます。", "いえにパンをたべます。", "いえへパンをたべます。", "いえがパンをたべます。"],
        correctIndex: 0,
      },
    ],
    listening: {
      scenario: "Ordering simple food/drink in a café.",
      instruction: "Catch item nouns + を／で.",
      keyPhrases: ["をのみます", "で", "ください"],
    },
  }),
  mk({
    minnaLesson: 7,
    dialogue: [
      {
        ja: "ともだちにケーキをあげました。せんせいにほんをもらいました。",
        reading: "Tomodachi ni kēki o agemashita. Sensei ni hon o moraimashita.",
        en: "I gave a cake to a friend. I received a book from the teacher.",
      },
    ],
    particles: [
      { particle: "に", note: "Recipient/source person for give/receive verbs." },
      { particle: "を", note: "Thing given/received." },
    ],
    grammarBullets: [
      "あげます／もらいます distinction by viewpoint (giving vs receiving).",
      "もう〜ました — already completed nuance.",
    ],
    mcqs: [
      {
        question: "“I received flowers from my mother.” Natural verb:",
        choices: ["あげました", "もらいました", "くれました", "あげます"],
        correctIndex: 1,
      },
      {
        question: "Person marker with もらいます (from someone):",
        choices: ["を", "に", "で", "へ"],
        correctIndex: 1,
      },
    ],
    listening: {
      scenario: "Short story about gifts exchanged after a trip.",
      instruction: "Track who gives what to whom.",
      keyPhrases: ["あげました", "もらいました", "に"],
    },
  }),
];
