import type { JapaneseWeeklyTest } from "@/lib/japanese-learning/types";
import { buildWeek1N4SubTests } from "@/lib/japanese-learning/n4/n4-week1-subtests";
import { buildWeek2N4SubTests } from "@/lib/japanese-learning/n4/n4-week2-subtests";
import { buildWeek3N4SubTests } from "@/lib/japanese-learning/n4/n4-week3-subtests";
import { buildWeek4N4SubTests } from "@/lib/japanese-learning/n4/n4-week4-subtests";

export const N4_WEEKLY_JLPT_TESTS: JapaneseWeeklyTest[] = [
  {
    id: "jn4-w1",
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
      en: "Five JLPT N4-style papers · 20 questions each · Minna II Lessons 26–32",
      np: "पाँच वटा JLPT N4 शैलीका पेपर · प्रत्येकमा २० प्रश्न · मिन्ना II पाठ २६–३२",
      jp: "JLPT N4形式のペーパーが5枚 · 各20問 · 第26–32課",
    },
    coversDayRange: [1, 7],
    intro: {
      en: "Week 1 has five mock exams (Test 1–5). Each has 20 MCQs covering vocabulary & kanji, grammar, reading, and listening. Topics: てしまいました・のに (regret), ておきます (preparation), てくれませんか／もらえませんか (requests), ていただけませんか・ほしい (very polite requests), すぎる・やすい・にくい (excess/ease/difficulty), ようになります・ことができます (change/formal ability), んです・んですか (explanation). Test 1 is easiest — difficulty increases with each paper.",
      np: "हप्ता १ मा पाँच मॉक परीक्षाहरू छन् (टेस्ट १–५)। प्रत्येकमा शब्दभण्डार र कांजी, व्याकरण, पढाइ र सुन्ने समेटेर २० MCQ छन्। विषयहरू: てしまいました・のに (पछुतो), ておきます (तयारी), てくれませんか／もらえませんか (अनुरोध), ていただけませんか・ほしい (अत्यन्त विनम्र अनुरोध), すぎる・やすい・にくい, ようになります・ことができます, んです。",
      jp: "第1週は5つの模試（テスト1〜5）です。語彙・漢字・文法・読解・聴解の計20問。てしまいました・のに、ておきます、てくれませんか／もらえませんか、ていただけませんか・ほしい、すぎる・やすい・にくい、ようになります・ことができます、んです／んですかが中心。テスト1が最易、以降難しくなります。",
    },
    closingNote: {
      en: "Aim for 70%+ on first attempt. If てもらう/てくれる/てあげる direction still trips you up, draw a quick giver→receiver arrow diagram before moving to Week 2.",
      np: "पहिलो प्रयासमा ७०%+ लक्ष्य गर्नुहोस्। てもらう/てくれる/てあげる दिशा अझ अलमल गर्छ भने, हप्ता २ अगाडि द्रुत दाता→प्राप्तकर्ता तीर रेखाचित्र बनाउनुहोस्।",
      jp: "初回で70%以上を目安に。てもらう・てくれる・てあげるの方向が混乱するなら、第2週に入る前に「与え手→受け手」の矢印図を書いて整理してください。",
    },
    sections: [],
    subTests: buildWeek1N4SubTests(),
  },
  {
    id: "jn4-w2",
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
      en: "Five JLPT N4-style papers · 20 questions each · Minna II Lessons 33–39",
      np: "पाँच वटा JLPT N4 शैलीका पेपर · प्रत्येकमा २० प्रश्न · मिन्ना II पाठ ३३–३९",
      jp: "JLPT N4形式のペーパーが5枚 · 各20問 · 第33–39課",
    },
    coversDayRange: [8, 14],
    intro: {
      en: "Week 2 has five mock exams (Test 1–5). Topics: と思っています・たことがある, てみます・ことにします・ことになりました, でしょう・かもしれません, なければなりません・なくてもいい・はずです, そうです (hearsay)・らしい, ようです・みたいです. Test 5 reaches near full N4 difficulty for these patterns.",
      np: "हप्ता २ मा पाँच मॉक परीक्षाहरू छन्। विषयहरू: と思っています・たことがある, てみます・ことにします・ことになりました, でしょう・かもしれません, なければなりません・なくてもいい・はずです, そうです(भनिन्छ)・らしい, ようです・みたいです।",
      jp: "第2週も5つの模試。と思っています・たことがある、てみます・ことにします・ことになりました、でしょう・かもしれません、なければなりません・なくてもいい・はずです、そうです（伝聞）・らしい、ようです・みたいですが中心。テスト5はほぼN4レベルの難度です。",
    },
    closingNote: {
      en: "Confused about でしょう vs らしい vs ようです? Write three sentences with the same uncertain fact using all three — the contrast becomes clear.",
      np: "でしょう vs らしい vs ようですमा अलमल छ? एउटै अनिश्चित तथ्य प्रयोग गरेर तीनवटा वाक्य लेख्नुहोस् — भिन्नता स्पष्ट हुन्छ।",
      jp: "でしょう・らしい・ようですが混乱するなら、同じ不確かな事実で3文を書き比べると違いがはっきりします。",
    },
    sections: [],
    subTests: buildWeek2N4SubTests(),
  },
  {
    id: "jn4-w3",
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
      en: "Five JLPT N4-style papers · 20 questions each · Minna II Lessons 40–46",
      np: "पाँच वटा JLPT N4 शैलीका पेपर · प्रत्येकमा २० प्रश्न · मिन्ना II पाठ ४०–४६",
      jp: "JLPT N4形式のペーパーが5枚 · 各20問 · 第40–46課",
    },
    coversDayRange: [15, 21],
    intro: {
      en: "Week 3 has five mock exams (Test 1–5). Topics: ていく・てくる (directional te-form), ば conditional・ばいい・ばよかった, たら conditional, ても・たとえ〜ても・どんなに〜ても (even if/no matter how), ように purpose/request, ために purpose/cause, passive 〜られる・〜れる. Test 5 is hardest with mixed conditional and passive discriminations.",
      np: "हप्ता ३ मा पाँच मॉक परीक्षाहरू छन्। विषयहरू: ていく・てくる (दिशात्मक), ば/たら/ても सर्त, ように/ために उद्देश्य, passive 〜られる・〜れる। टेस्ट ५ सर्त र passive भेदभावसहित सबैभन्दा कठिन।",
      jp: "第3週も5つの模試。ていく・てくる（方向）、ば/たら/ても条件、ように・ためにの目的・依頼、passive〜られる・〜れるが中心。テスト5は条件とpassiveの識別が混じり最難。",
    },
    closingNote: {
      en: "Struggling with ば vs たら? Remember: ば is used for reversible/general conditions; たら implies sequential time or single events. Write three minimal pairs.",
      np: "ば vs たらमा समस्या? याद गर्नुहोस्: ば उल्टाउन मिल्ने/सामान्य सर्तका लागि; たら क्रमिक समय वा एकल घटनाका लागि। तीन न्यूनतम जोडी लेख्नुहोस्।",
      jp: "ばとたらで迷うなら：ばは可逆・一般条件、たらは時系列や単発の出来事に使う、と覚えましょう。最小ペアを3組書いて確認を。",
    },
    sections: [],
    subTests: buildWeek3N4SubTests(),
  },
  {
    id: "jn4-w4",
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
      en: "Five JLPT N4-style papers · 20 questions each · Minna II Lessons 47–50 + sprint",
      np: "पाँच वटा JLPT N4 शैलीका पेपर · प्रत्येकमा २० प्रश्न · मिन्ना II पाठ ४७–५० + स्प्रिन्ट",
      jp: "JLPT N4形式のペーパーが5枚 · 各20問 · 第47–50課＋スプリント",
    },
    coversDayRange: [22, 28],
    intro: {
      en: "Week 4 has five mock exams (Test 1–5). Topics: causative 〜させる・させてもらう・させてください, causative-passive 〜させられる, はずです (logical expectation), というのは・ほど, full-course review and verb-form drills. Test 5 reaches near-JLPT N4 difficulty — the hardest paper of the course.",
      np: "हप्ता ४ मा पाँच मॉक परीक्षाहरू छन्। विषयहरू: causative 〜させる・させてもらう, causative-passive 〜させられる, はずです, というのは・ほど, पूर्ण पाठ्यक्रम समीक्षा र क्रिया-रूप अभ्यास। टेस्ट ५ पाठ्यक्रमको सबैभन्दा कठिन — JLPT N4 नजिक।",
      jp: "第4週も5つの模試。使役〜させる・させてもらう、使役受け身〜させられる、はずです、というのは・ほど、総合復習と動詞形ドリルが中心。テスト5はコース最難で、ほぼJLPT N4レベルです。",
    },
    closingNote: {
      en: "Causative-passive is the final boss of N4. Drill: eat → 食べる → 食べさせる → 食べさせられる. Ten verbs written three ways — that is your checklist.",
      np: "causative-passive N4 को अन्तिम ठूलो चुनौती हो। अभ्यास: खाना → 食べる → 食べさせる → 食べさせられる। दश क्रिया तीन तरिकाले — त्यो तपाईंको सूची।",
      jp: "使役受け身はN4の最終難関。食べる→食べさせる→食べさせられるを動詞10個で書き分ける練習がチェックリストになります。",
    },
    sections: [],
    subTests: buildWeek4N4SubTests(),
  },
];
