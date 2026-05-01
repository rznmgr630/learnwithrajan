import type { JapaneseWeeklyTest } from "@/lib/japanese-learning/types";
import { buildWeek1N3SubTests } from "@/lib/japanese-learning/n3/n3-week1-subtests";
import { buildWeek2N3SubTests } from "@/lib/japanese-learning/n3/n3-week2-subtests";
import { buildWeek3N3SubTests } from "@/lib/japanese-learning/n3/n3-week3-subtests";
import { buildWeek4N3SubTests } from "@/lib/japanese-learning/n3/n3-week4-subtests";

export const N3_WEEKLY_JLPT_TESTS: JapaneseWeeklyTest[] = [
  {
    id: "jn3-w1",
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
      en: "Five JLPT N3-style papers · 20 questions each · Grammar Topics 1–7",
      np: "पाँच वटा JLPT N3 शैलीका पेपर · प्रत्येकमा २० प्रश्न · व्याकरण विषय १–७",
      jp: "JLPT N3形式のペーパーが5枚 · 各20問 · 文法トピック1–7",
    },
    coversDayRange: [1, 7],
    intro: {
      en: "Week 1 has five mock exams (Test 1–5). Each has 20 MCQs covering vocabulary, grammar, reading, and listening. Topics: 〜てある (result-state), relative clauses / noun modification, のに (unexpected result/complaint), ために (purpose/cause), ように (so that/goal), conditionals (と/ば/たら/なら), はずだ/べきだ (expectation/obligation). Test 1 is easiest — difficulty increases with each paper.",
      np: "हप्ता १ मा पाँच मॉक परीक्षाहरू छन् (टेस्ट १–५)। प्रत्येकमा शब्दभण्डार, व्याकरण, पढाइ र सुन्ने समेटेर २० MCQ छन्। विषयहरू: てある, सापेक्ष उपवाक्य, のに, ために, ように, सर्त रूपहरू, はずだ/べきだ। टेस्ट १ सबैभन्दा सहज।",
      jp: "第1週は5つの模試（テスト1〜5）です。語彙・文法・読解・聴解の計20問。てある、関係節・名詞修飾、のに（逆接・不満）、ために（目的・原因）、ように（目標・依頼）、条件形（と/ば/たら/なら）、はずだ・べきだが中心。テスト1が最易、以降難しくなります。",
    },
    closingNote: {
      en: "Aim for 70%+ on first attempt. If ために/ように distinction still trips you up, write five sentence pairs using both with different verb types — volitional vs non-volitional.",
      np: "पहिलो प्रयासमा ७०%+ लक्ष्य गर्नुहोस्। ために/ようにमा अझ अलमल छ भने, इच्छात्मक र गैर-इच्छात्मक क्रिया दुवैसँग पाँच वाक्य जोडी लेख्नुहोस्।",
      jp: "初回で70%以上を目標に。ために/ようにの区別に迷うなら、意志動詞・非意志動詞それぞれ5文ずつ作って比べてください。",
    },
    sections: [],
    subTests: buildWeek1N3SubTests(),
  },
  {
    id: "jn3-w2",
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
      en: "Five JLPT N3-style papers · 20 questions each · Grammar Topics 8–14",
      np: "पाँच वटा JLPT N3 शैलीका पेपर · प्रत्येकमा २० प्रश्न · व्याकरण विषय ८–१४",
      jp: "JLPT N3形式のペーパーが5枚 · 各20問 · 文法トピック8–14",
    },
    coversDayRange: [8, 14],
    intro: {
      en: "Week 2 has five mock exams (Test 1–5). Topics: そうだ/らしい/ようだ (appearance/hearsay), と思う/と言う/と聞く (quoting/reporting), ながら (simultaneous actions), あいだに/うちに (while/before too late), ばかり/だけ/しか (limiting expressions), ことがある/ことにする/ことになる (experience/decision/circumstance), potential forms. Test 5 reaches near full N3 difficulty for these patterns.",
      np: "हप्ता २ मा पाँच मॉक परीक्षाहरू छन्। विषयहरू: そうだ/らしい/ようだ, と思う/と言う/と聞く, ながら, あいだに/うちに, ばかり/だけ/しか, ことがある/ことにする/ことになる, सम्भाव्यता रूपहरू। टेस्ट ५ N3 स्तरको कठिन।",
      jp: "第2週も5つの模試。そうだ・らしい・ようだ、と思う・と言う・と聞く、ながら、あいだに・うちに、ばかり・だけ・しか、ことがある・ことにする・ことになる、可能形が中心。テスト5はほぼN3レベルの難度です。",
    },
    closingNote: {
      en: "Confused about そうだ vs らしい vs ようだ? Write three sentences about the same uncertain situation using all three — the evidence source contrast becomes clear.",
      np: "そうだ vs らしい vs ようだमा अलमल छ? एउटै अनिश्चित स्थिति प्रयोग गरेर तीनवटा वाक्य लेख्नुहोस् — साक्ष्य स्रोतको भिन्नता स्पष्ट हुन्छ।",
      jp: "そうだ・らしい・ようだが混乱するなら、同じ不確かな状況で3文を書き比べると証拠源の違いがはっきりします。",
    },
    sections: [],
    subTests: buildWeek2N3SubTests(),
  },
  {
    id: "jn3-w3",
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
      en: "Five JLPT N3-style papers · 20 questions each · Grammar Topics 15–21",
      np: "पाँच वटा JLPT N3 शैलीका पेपर · प्रत्येकमा २० प्रश्न · व्याकरण विषय १५–२१",
      jp: "JLPT N3形式のペーパーが5枚 · 各20問 · 文法トピック15–21",
    },
    coversDayRange: [15, 21],
    intro: {
      en: "Week 3 has five mock exams (Test 1–5). Topics: honorific forms (お〜になる/ご〜になる), humble forms (お〜する/ご〜する), てもらう/てあげる/てくれる (giving/receiving actions), ところ (just about to / in the middle of / just finished), ば〜ほど/ほど/くらい (extent/degree), ものだ/ものの (natural/although), として/にとって (as/from the perspective of). Test 5 is hardest with mixed keigo and functional grammar discriminations.",
      np: "हप्ता ३ मा पाँच मॉक परीक्षाहरू छन्। विषयहरू: उच्च भाषा (お〜になる/ご〜になる), नम्र भाषा (お〜する/ご〜する), てもらう/てあげる/てくれる, ところ, ほど/くらい, ものだ/ものの, として/にとって। टेस्ट ५ मिश्रित केइगो र कार्यात्मक व्याकरण पहिचानसहित सबैभन्दा कठिन।",
      jp: "第3週も5つの模試。尊敬語（お〜になる・ご〜になる）、謙譲語（お〜する・ご〜する）、てもらう・てあげる・てくれる、ところ、ほど・くらい、ものだ・ものの、として・にとってが中心。テスト5は敬語と機能文法の識別で最難。",
    },
    closingNote: {
      en: "Struggling with てもらう vs てくれる? Remember: もらう = I receive; くれる = someone gives to me (in-group). Draw an arrow diagram with giver and receiver to clarify direction.",
      np: "てもらう vs てくれるमा समस्या? याद गर्नुहोस्: もらう = म पाउँछु; くれる = कोही मलाई दिन्छ। दिशा स्पष्ट गर्न दाता र प्राप्तकर्तासहित तीर रेखाचित्र कोर्नुहोस्।",
      jp: "てもらうとてくれるで迷うなら：もらう=私が受け取る、くれる=誰かが私（内側）に与える、と覚えましょう。与え手→受け手の矢印図を書いて方向を確認してください。",
    },
    sections: [],
    subTests: buildWeek3N3SubTests(),
  },
  {
    id: "jn3-w4",
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
      en: "Five JLPT N3-style papers · 20 questions each · Grammar Topics 22–28 + sprint",
      np: "पाँच वटा JLPT N3 शैलीका पेपर · प्रत्येकमा २० प्रश्न · व्याकरण विषय २२–२८ + स्प्रिन्ट",
      jp: "JLPT N3形式のペーパーが5枚 · 各20問 · 文法トピック22–28＋スプリント",
    },
    coversDayRange: [22, 28],
    intro: {
      en: "Week 4 has five mock exams (Test 1–5). Topics: によって/によっては (by/depending on), おかげで/せいで/ために — cause and effect (positive/negative/neutral), complex sentence combining, reading strategies (discourse markers, topic sentences), listening sprint, vocabulary sprint, full mock mindset. Test 5 reaches near-JLPT N3 difficulty — the hardest paper of the course.",
      np: "हप्ता ४ मा पाँच मॉक परीक्षाहरू छन्। विषयहरू: によって/によっては, おかげで/せいで/ために (कारण-प्रभाव), जटिल वाक्य संयोजन, पढाइ रणनीतिहरू, सुन्ने स्प्रिन्ट, शब्दभण्डार स्प्रिन्ट। टेस्ट ५ पाठ्यक्रमको सबैभन्दा कठिन।",
      jp: "第4週も5つの模試。によって・によっては、おかげで・せいで・ために（因果関係）、複文構成、読解戦略（談話マーカー・トピックセンテンス）、聴解スプリント、語彙スプリントが中心。テスト5はコース最難でほぼJLPT N3レベルです。",
    },
    closingNote: {
      en: "The final boss of N3 cause-effect: おかげで = positive thanks, せいで = negative blame, のために = neutral cause. Drill: write the same event with all three — the nuance difference becomes obvious.",
      np: "N3 कारण-प्रभावको अन्तिम चुनौती: おかげで = सकारात्मक कृतज्ञता, せいで = नकारात्मक दोष, のために = तटस्थ कारण। अभ्यास: एउटै घटना तिनैसँग लेख्नुहोस् — ニュアンスको भिन्नता स्पष्ट हुन्छ।",
      jp: "N3因果関係の最終難関：おかげで=感謝、せいで=非難、のために=中立的原因。同じ出来事を3つすべてで書き比べると違いが明確になります。",
    },
    sections: [],
    subTests: buildWeek4N3SubTests(),
  },
];
