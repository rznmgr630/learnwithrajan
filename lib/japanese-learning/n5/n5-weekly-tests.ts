import type { JapaneseWeeklyTest } from "@/lib/japanese-learning/types";
import { buildWeek1SubTests } from "@/lib/japanese-learning/n5/n5-week1-subtests";
import { buildWeek2SubTests } from "@/lib/japanese-learning/n5/n5-week2-subtests";
import { buildWeek3SubTests } from "@/lib/japanese-learning/n5/n5-week3-subtests";
import { buildWeek4SubTests } from "@/lib/japanese-learning/n5/n5-week4-subtests";
import { buildWeek5SubTests } from "@/lib/japanese-learning/n5/n5-week5-subtests";

export const N5_WEEKLY_JLPT_TESTS: JapaneseWeeklyTest[] = [
  {
    id: "jn5-w1",
    weekLabel: {
      en: "Week 1",
      np: "हप्ता १",
      jp: "第1週",
    },
    title: {
      en: "Unit tests · Recap (Days 1–7)",
      np: "युनिट टेस्ट · पुनरावलोकन (दिन १–७)",
      jp: "ユニットテスト · 復習（Day 1–7）",
    },
    subtitle: {
      en: "Five JLPT N5-style papers · 20 questions each · Minna Lessons 1–7",
      np: "पाँच वटा JLPT N5 शैलीका पेपर · प्रत्येकमा २० प्रश्न · मिन्ना पाठ १–७",
      jp: "JLPT N5形式のペーパーが5枚 · 各20問 · 第1–7課",
    },
    coversDayRange: [1, 7],
    intro: {
      en: "Week 1 includes five separate mock exams (Test 1–5). Each paper has 20 scored multiple-choice items covering vocabulary & kanji, grammar, reading, and listening (with a short embedded clip plus links). The five tests use different question sets — complete one at a time and submit to see your score and explanations.",
      np: "हप्ता १ मा पाँच छुट्टै नक्कली परीक्षाहरू छन् (टेस्ट १–५)। प्रत्येक पेपरमा शब्दभण्डार र कांजी, व्याकरण, पढाइ र सुन्ने समेटेर २० बहुविकल्प प्रश्नहरू छन् (छोटो इम्बेड क्लिप र लिंक सहित)। पाँच टेस्टमा फरक प्रश्न सेटहरू छन् — एकपटकमा एक पूरा गर्नुहोस् र स्कोर तथा व्याख्या हेर्न पेश गर्नुहोस्।",
      jp: "第1週は5つの模試（テスト1〜5）があります。各ペーパーは語彙・漢字、文法、読解、聴解の選択式20問です（短い埋め込みクリップとリンク付き）。テストごとに問題セットが異なります。1つずつ受け、提出するとスコアと解説が表示されます。",
    },
    closingNote: {
      en: "Aim for roughly 70% on first try when you self-grade. If you miss several items in one section, re-open those Minna lessons and shadow the audio again before Week 2.",
      np: "आफै ग्रेड गर्दा पहिलो प्रयासमा लगभग ७०% लक्ष्य गर्नुहोस्। एउटै खण्डमा धेरै चुक्नुभयो भने, हप्ता २ अगाडि ती मिन्ना पाठहरू फेरि खोल्नुहोस् र अडियो छायाँ गर्नुहोस्।",
      jp: "自己採点では最初に約70%を目安に。あるセクションで多く外したら、第2週に入る前に該当するみんなのレッスンを開き直し、音声をシャドーイングしてください。",
    },
    sections: [],
    subTests: buildWeek1SubTests(),
  },
  {
    id: "jn5-w2",
    weekLabel: {
      en: "Week 2",
      np: "हप्ता २",
      jp: "第2週",
    },
    title: {
      en: "Unit tests · Recap (Days 8–14)",
      np: "युनिट टेस्ट · पुनरावलोकन (दिन ८–१४)",
      jp: "ユニットテスト · 復習（Day 8–14）",
    },
    subtitle: {
      en: "Five JLPT N5-style papers · 20 questions each · Minna Lessons 8–14",
      np: "पाँच वटा JLPT N5 शैलीका पेपर · प्रत्येकमा २० प्रश्न · मिन्ना पाठ ८–१४",
      jp: "JLPT N5形式のペーパーが5枚 · 各20問 · 第8–14課",
    },
    coversDayRange: [8, 14],
    intro: {
      en: "Week 2 includes five separate mock exams (Test 1–5), each with distinct questions. Topics include i/na adjectives, comparisons, ～てください, and ～ている. Same submission flow as Week 1.",
      np: "हप्ता २ मा पाँच छुट्टै नक्कली परीक्षाहरू छन् (टेस्ट १–५), प्रत्येकमा फरक प्रश्नहरू। विषयहरूमा i/na विशेषण, तुलना, ～てください, र ～ている समेटिएका छन्। हप्ता १ जस्तै पेश गर्ने प्रवाह।",
      jp: "第2週も5つの模試（テスト1〜5）で、問題セットはそれぞれ異なります。い・な形容詞、比較、～てください、～ているなど。提出の流れは第1週と同じです。",
    },
    closingNote: {
      en: "Weak on adjective conjugation? Drill present ↔ past ↔ negative on paper before Week 3.",
      np: "विशेषण संयोग कमजोर छ? हप्ता ३ अगाडि वर्तमान ↔ भूत ↔ नकारात्मक कागजमा अभ्यास गर्नुहोस्।",
      jp: "形容詞の活用が弱ければ、第3週の前に現在・過去・否定を紙に書いて反復してください。",
    },
    sections: [],
    subTests: buildWeek2SubTests(),
  },
  {
    id: "jn5-w3",
    weekLabel: {
      en: "Week 3",
      np: "हप्ता ३",
      jp: "第3週",
    },
    title: {
      en: "Unit tests · Recap (Days 15–21)",
      np: "युनिट टेस्ट · पुनरावलोकन (दिन १५–२१)",
      jp: "ユニットテスト · 復習（Day 15–21）",
    },
    subtitle: {
      en: "Five JLPT N5-style papers · 20 questions each · Minna Lessons 15–21",
      np: "पाँच वटा JLPT N5 शैलीका पेपर · प्रत्येकमा २० प्रश्न · मिन्ना पाठ १५–२१",
      jp: "JLPT N5形式のペーパーが5枚 · 各20問 · 第15–21課",
    },
    coversDayRange: [15, 21],
    intro: {
      en: "Week 3 includes five separate mock exams (Test 1–5). Focus areas: permission / prohibition, なくてもいい／なければならない, てから, past experience (～たことがある), and とおもう — each test uses a different pool of items.",
      np: "हप्ता ३ मा पाँच छुट्टै नक्कली परीक्षाहरू छन्। फोकस: अनुमति/निषेध, なくてもいい／なければならない, てから, भूत अनुभव (～たことがある), र とおもう — प्रत्येक टेस्टमा फरक प्रश्न पूल।",
      jp: "第3週も5つの模試。許可・禁止、なくてもいい／なければならない、てから、経験（～たことがある）、とおもうなどが中心で、テストごとに問題プールが異なります。",
    },
    closingNote: {
      en: "If と-condition or とおもう trips you up, rewrite five sentences from your notes into negative and past forms.",
      np: "と-condition वा とおもうमा समस्या छ भने, आफ्ना नोटबाट पाँच वाक्य नकार र भूत रूपमा फेरि लेख्नुहोस्।",
      jp: "と条件やとおもうでつまずく場合は、ノートの文を5つ選び、否定形と過去形に書き換えて練習してください。",
    },
    sections: [],
    subTests: buildWeek3SubTests(),
  },
  {
    id: "jn5-w4",
    weekLabel: {
      en: "Week 4",
      np: "हप्ता ४",
      jp: "第4週",
    },
    title: {
      en: "Unit tests · Recap (Days 22–28)",
      np: "युनिट टेस्ट · पुनरावलोकन (दिन २२–२८)",
      jp: "ユニットテスト · 復習（Day 22–28）",
    },
    subtitle: {
      en: "Five JLPT N5-style papers · 20 questions each · Minna Lessons 22–25 + sprint",
      np: "पाँच वटा JLPT N5 शैलीका पेपर · प्रत्येकमा २० प्रश्न · मिन्ना पाठ २२–२५ + स्प्रिन्ट",
      jp: "JLPT N5形式のペーパーが5枚 · 各20問 · 第22–25課＋スプリント",
    },
    coversDayRange: [22, 28],
    intro: {
      en: "Week 4 includes five separate mock exams (Test 1–5). Content blends とき／ばあい, たら／もし, てあげる／くれる／もらう, relative clauses before nouns, and sprint-style listening — five distinct papers.",
      np: "हप्ता ४ मा पाँच छुट्टै नक्कली परीक्षाहरू छन्। सामग्रीमा とき／ばあい, たら／もし, てあげる／くれる／もらう, संज्ञाअघिको उपवाक्य, र स्प्रिन्ट शैलीको सुन्ने समेटिएको छ — पाँच फरक पेपरहरू।",
      jp: "第4週も5つの模試。とき／ばあい、たら／もし、てあげる／くれる／もらう、名詞を修飾する節、スプリント聴解などが混ざった5枚別問題です。",
    },
    closingNote: {
      en: "Missed とき or たら sets? Write five minimal pairs (same noun, different clause type) from your notes.",
      np: "とき वा たら सेटमा चुक्नुभयो? आफ्ना नोटबाट नामको एउटै तर फरक उपवाक्य प्रकारका पाँच जोडी लेख्नुहोस्।",
      jp: "ときやたらで迷う場合は、ノートから名詞は同じで節の型だけ違う最小ペアを5組書いてください。",
    },
    sections: [],
    subTests: buildWeek4SubTests(),
  },
  {
    id: "jn5-w5",
    weekLabel: {
      en: "Week 5",
      np: "हप्ता ५",
      jp: "第5週",
    },
    title: {
      en: "Unit tests · Final sprint (Days 29–30)",
      np: "युनिट टेस्ट · अन्तिम स्प्रिन्ट (दिन २९–३०)",
      jp: "ユニットテスト · 最終スプリント（Day 29–30）",
    },
    subtitle: {
      en: "Five JLPT N5-style papers · 20 questions each",
      np: "पाँच वटा JLPT N5 शैलीका पेपर · प्रत्येकमा २० प्रश्न",
      jp: "JLPT N5形式のペーパーが5枚 · 各20問",
    },
    coversDayRange: [29, 30],
    intro: {
      en: "Week 5 includes five separate mock exams (Test 1–5). Each has 20 scored multiple-choice items covering vocabulary & kanji, grammar, reading, and listening (with a short embedded clip plus links). Complete one test at a time — submit to see your score and explanations.",
      np: "हप्ता ५ मा पाँच छुट्टै नक्कली परीक्षाहरू छन्। प्रत्येकमा शब्दभण्डार र कांजी, व्याकरण, पढाइ र सुन्ने समेटेर २० बहुविकल्प प्रश्नहरू छन् (छोटो इम्बेड क्लिप र लिंक सहित)। एकपटकमा एक टेस्ट पूरा गर्नुहोस् — स्कोर र व्याख्याका लागि पेश गर्नुहोस्।",
      jp: "第5週も5つの模試です。各20問は語彙・漢字、文法、読解、聴解（埋め込みクリップとリンク付き）。1つずつ受け、提出するとスコアと解説が表示されます。",
    },
    closingNote: {
      en: "Before a real JLPT, sit one timed external mock from a publisher; these five papers are for breadth and self-check only.",
      np: "वास्तविक JLPT अगाडि प्रकाशकको समयबद्ध बाहिरी मॉक एक पटक बस्नुहोस्; यी पाँच पेपर विस्तार र आत्मजाँचका लागि मात्र हुन्।",
      jp: "本番JLPTの前に出版社などの時間付き模試を1回受けることをおすすめします。この5枚は幅広い確認とセルフチェック用です。",
    },
    sections: [],
    subTests: buildWeek5SubTests(),
  },
];
