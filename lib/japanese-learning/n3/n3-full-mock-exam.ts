/**
 * JLPT N3-style course finale: five separate papers (Tests 1–5).
 * Covers all 28-day curriculum (N3 grammar topics 1–25 + sprint days 26–28).
 */

import type {
  JapaneseWeeklySubTest,
  JapaneseWeeklyTest,
  JapaneseWeeklyTestItem,
} from "@/lib/japanese-learning/types";
import { youtubeClipsForN3Lesson, youtubeClipsForN3SprintDay } from "@/lib/japanese-learning/n3/n3-youtube-links";

const YT_EMBED_ID = "dPjxIuJZiZc";

function mc(
  id: string,
  prompt: string,
  choices: string[],
  correctIndex: number,
  explanation?: string,
): Extract<JapaneseWeeklyTestItem, { kind: "mcq" }> {
  return { kind: "mcq", id, prompt, choices, correctIndex, explanation };
}

const listeningIntroP4: JapaneseWeeklyTestItem = {
  kind: "listeningIntro",
  id: "jn3-full-p4-l-intro",
  scenario:
    "聴解：本試験では音声のみ再生されます。ここでは短い動画を参考として埋め込み、語感を確認してから場面問題へ進みます。",
  instruction:
    "クリップを一度再生し、敬語・因果表現・逆接マーカーに注意してください。続く問題は場面理解レベルの確認です。",
  youtubeVideos: [
    ...youtubeClipsForN3Lesson(8),
    ...youtubeClipsForN3Lesson(22),
    ...youtubeClipsForN3SprintDay(26),
  ].slice(0, 5),
  embedVideoId: YT_EMBED_ID,
};

const PAPER_1: JapaneseWeeklySubTest = {
  id: "jn3-full-paper-1",
  label: "Test 1",
  subtitle: {
    en: "Language knowledge (script & vocabulary) · 10 items",
    np: "भाषा ज्ञान (लिपि र शब्दभण्डार) · १० प्रश्न",
    jp: "言語知識（文字・語彙）· 10問",
  },
  intro: "N3レベルの語彙・漢字の読みと意味を確認します。",
  sections: [
    {
      title: "言語知識（文字・語彙）",
      blurb: "漢字の読み・語彙 · 10問",
      items: [
        mc("jn3-full-p1-v-1", "「準備してある」の意味として正しいのは？", ["Preparations have been made (result-state).", "Someone is preparing.", "Will prepare later.", "Accidentally prepared."], 0, "〜てある = deliberate result-state."),
        mc("jn3-full-p1-v-2", "「おかげで」の感情的ニュアンスは？", ["Gratitude — thanks to (positive cause).", "Blame — because of (negative).", "Neutral cause.", "Contrast."], 0, "〜おかげで = positive gratitude."),
        mc("jn3-full-p1-v-3", "「せいで」の感情的ニュアンスは？", ["Blame/resentment — because of (negative cause).", "Gratitude.", "Neutral.", "Surprise."], 0, "〜せいで = negative blame."),
        mc("jn3-full-p1-v-4", "「による」の意味として適切なのは？", ["due to / based on / by", "despite", "in order to", "although"], 0, "〜による = due to / by (formal form of によって)."),
        mc("jn3-full-p1-v-5", "「にとって」の意味は？", ["from the perspective of", "in the capacity of", "because of", "depending on"], 0, "〜にとって = from the standpoint of."),
        mc("jn3-full-p1-v-6", "「ものの」の意味は？", ["although (concessive, formal)", "because", "in order to", "if"], 0, "〜ものの = although (written/formal concessive)."),
        mc("jn3-full-p1-v-7", "「ところだ」（これから）の意味は？", ["about to do", "just finished", "in the middle of", "decided to"], 0, "V-plain-present + ところ = about to do."),
        mc("jn3-full-p1-v-8", "「ことにする」と「ことになる」の違いは？", ["にする = personal decision; になる = external/circumstantial decision.", "Same.", "になる = personal.", "にする = external."], 0, ""),
        mc("jn3-full-p1-v-9", "「はずがない」の意味は？", ["There is no way it could be true.", "It should be true.", "It is expected.", "It is possible."], 0, "〜はずがない = impossible / cannot be."),
        mc("jn3-full-p1-v-10", "「〜ないように」の意味は？", ["so as not to / in order not to", "because not", "although not", "if not"], 0, "〜ないように = goal of non-occurrence."),
      ],
    },
  ],
};

const PAPER_2: JapaneseWeeklySubTest = {
  id: "jn3-full-paper-2",
  label: "Test 2",
  subtitle: {
    en: "Language knowledge (grammar) · 10 items",
    np: "भाषा ज्ञान (व्याकरण) · १० प्रश्न",
    jp: "言語知識（文法）· 10問",
  },
  intro: "N3レベルの文法形式を確認します。",
  sections: [
    {
      title: "言語知識（文法）",
      blurb: "文の文法形式 · 10問",
      items: [
        mc("jn3-full-p2-g-1", "電気が消し（　）あります。（result-state）", ["て", "に", "が", "で"], 0, "消してあります = light has been turned off (deliberate result)."),
        mc("jn3-full-p2-g-2", "試験に合格する（　）、毎日練習しています。", ["ために", "ように", "のに", "ので"], 0, "合格するために = volitional purpose."),
        mc("jn3-full-p2-g-3", "友達の助け（　）、無事に終わりました。", ["のおかげで", "のせいで", "によって", "のために"], 0, "〜のおかげで = thanks to friend's help."),
        mc("jn3-full-p2-g-4", "場合（　）、例外もあります。", ["によっては", "によって", "のために", "のおかげで"], 0, "〜によっては = in some cases."),
        mc("jn3-full-p2-g-5", "先生がお話し（　）なりました。（honorific）", ["に", "を", "が", "で"], 0, "お話しになりました = honorific form."),
        mc("jn3-full-p2-g-6", "資料をご確認（　）ください。（humble request）", ["ください", "いたし", "なさって", "なさい"], 0, "ご確認ください = please check (respectful request)."),
        mc("jn3-full-p2-g-7", "今、報告書を書い（　）ところです。", ["ている", "てある", "てから", "てしまう"], 0, "〜ているところ = in the middle of writing."),
        mc("jn3-full-p2-g-8", "練習する（　）、うまくなりますよ。", ["ほど", "だけ", "ばかり", "くらい"], 0, "〜ほど = the more you practice (proportional)."),
        mc("jn3-full-p2-g-9", "彼は絶対来る（　）です。（expectation）", ["はず", "べき", "よう", "らしい"], 0, "〜はずです = logical expectation."),
        mc("jn3-full-p2-g-10", "国（　）、文化が大きく異なります。", ["によって", "のために", "おかげで", "のせいで"], 0, "〜によって = varies depending on country."),
      ],
    },
  ],
};

const PAPER_3: JapaneseWeeklySubTest = {
  id: "jn3-full-paper-3",
  label: "Test 3",
  subtitle: {
    en: "Reading · 10 items",
    np: "पढाइ · १० प्रश्न",
    jp: "読解 · 10問",
  },
  intro: "短い文章から要点を拾います。",
  sections: [
    {
      title: "読解",
      blurb: "内容理解 · 10問",
      items: [
        mc(
          "jn3-full-p3-r-1",
          "【文】明日の発表の資料がもう準備してあります。\n「してある」の意図は？",
          ["Documents are ready for tomorrow (deliberate result-state).", "Will prepare tomorrow.", "Someone is preparing now.", "Accidentally prepared."],
          0,
          "〜てある = deliberate preparation, result remains.",
        ),
        mc(
          "jn3-full-p3-r-2",
          "【文】先生のご指導のおかげで、N3に合格できました。\n感情は？",
          ["Deep gratitude — passed thanks to teacher's guidance.", "Blame — teacher's fault.", "Neutral.", "Surprise."],
          0,
          "〜のおかげで = gratitude for positive cause.",
        ),
        mc(
          "jn3-full-p3-r-3",
          "【文】彼の一言のせいで、チームの雰囲気が悪くなった。\n誰の責任か？",
          ["His remark caused the bad atmosphere.", "Team caused the problem.", "No one is responsible.", "Weather caused it."],
          0,
          "〜のせいで = blame / negative cause.",
        ),
        mc(
          "jn3-full-p3-r-4",
          "【文】人によって、学習方法の好みが違います。\n意味は？",
          ["Learning style preferences differ depending on the person.", "Everyone learns the same way.", "Only one learning method works.", "Method doesn't matter."],
          0,
          "〜によって = depends on the person (variation).",
        ),
        mc(
          "jn3-full-p3-r-5",
          "【文】努力したものの、結果はよくなかった。\n「ものの」の機能は？",
          ["Concessive: although (effort) → (bad result).", "Cause: effort caused bad result.", "Condition: if effort.", "Purpose: in order to fail."],
          0,
          "〜ものの = although (formal concessive).",
        ),
        mc(
          "jn3-full-p3-r-6",
          "【文】音楽を聞きながら、走っています。\n二つの動作は？",
          ["Running and listening simultaneously.", "First music, then running.", "Running only.", "Listening only."],
          0,
          "〜ながら = simultaneous actions.",
        ),
        mc(
          "jn3-full-p3-r-7",
          "【文】若いうちに、海外経験を積むべきだ。\n意味は？",
          ["Should gain overseas experience while still young.", "Should wait until older.", "Age doesn't matter.", "Overseas experience is unnecessary."],
          0,
          "〜うちに = while (before the state changes); べきだ = should.",
        ),
        mc(
          "jn3-full-p3-r-8",
          "【文】先輩に手伝ってもらいました。\nだれが助けましたか？",
          ["Senior helped me (I received the benefit).", "I helped the senior.", "Third party helped.", "No one helped."],
          0,
          "〜てもらいました = had senior help me.",
        ),
        mc(
          "jn3-full-p3-r-9",
          "【文】彼女が来ないらしい。\n「らしい」の根拠は？",
          ["Indirect inference / hearsay evidence.", "Direct personal observation.", "Absolute certainty.", "Guess with no basis."],
          0,
          "〜らしい = indirect evidence or hearsay.",
        ),
        mc(
          "jn3-full-p3-r-10",
          "【文】プロとして、常に最善を尽くすべきだ。\n「として」の意味は？",
          ["In the capacity/role of a professional.", "From the perspective of a professional.", "Because of being a professional.", "Despite being a professional."],
          0,
          "〜として = as / in the role of.",
        ),
      ],
    },
  ],
};

const PAPER_4: JapaneseWeeklySubTest = {
  id: "jn3-full-paper-4",
  label: "Test 4",
  subtitle: {
    en: "Listening · intro + 10 questions",
    np: "सुन्ने · परिचय र १० प्रश्न",
    jp: "聴解 · 準備＋10問",
  },
  intro: "クリップと場面問題の前半です。",
  sections: [
    {
      title: "聴解（前半）",
      blurb: "準備・場面理解 · 11アイテム（内紹介1）",
      items: [
        listeningIntroP4,
        mc("jn3-full-p4-l-1", "（聴解スタイル）「先生がいらっしゃいました」の敬語の種類は？", ["尊敬語 (honorific form of いる/来る).", "謙譲語 (humble).", "Plain form.", "Passive."], 0, "いらっしゃる = honorific for いる・来る・行く."),
        mc("jn3-full-p4-l-2", "（聴解スタイル）「ご説明いたします」の敬語は？", ["謙譲語 (humble — speaker explains humbly).", "尊敬語 (honorific).", "Plain.", "Passive."], 0, "ご〜いたす = humble form (謙譲語)."),
        mc("jn3-full-p4-l-3", "（聴解スタイル）「友達に助けてもらいました」の意味は？", ["Had a friend help me (received benefit).", "Helped a friend.", "A friend helped someone else.", "No one helped."], 0, "〜てもらいました = received the benefit of friend's action."),
        mc("jn3-full-p4-l-4", "（聴解スタイル）「渋滞のせいで遅れました」の原因と感情は？", ["Traffic jam (negative cause) → lateness (negative result) with blame.", "Thanks to traffic.", "Neutral cause.", "Positive result."], 0, "〜のせいで = negative blame."),
        mc("jn3-full-p4-l-5", "（聴解スタイル）「先輩のおかげで乗り越えられました」の意味は？", ["Overcame thanks to senior's help.", "Senior caused the problem.", "Overcame despite senior.", "Senior overcame the problem."], 0, "〜のおかげで = gratitude."),
        mc("jn3-full-p4-l-6", "（聴解スタイル）「勉強すればするほど楽しくなる」の意味は？", ["The more you study, the more enjoyable it becomes.", "Study in order to have fun.", "Although you study, it's not fun.", "Study once and enjoy forever."], 0, "〜ば〜ほど = the more… the more."),
        mc("jn3-full-p4-l-7", "（聴解スタイル）「今、ちょうど食事をしているところです」の状況は？", ["In the middle of eating right now.", "Just finished eating.", "About to eat.", "Decided to eat."], 0, "〜ているところ = in the midst of ongoing action."),
        mc("jn3-full-p4-l-8", "（聴解スタイル）「地域によって方言が違います」の「によって」は？", ["Variation depending on region.", "Passive agent.", "Negative cause.", "Thanks to region."], 0, "〜によって = varies by."),
        mc("jn3-full-p4-l-9", "（聴解スタイル）「努力したのに認められなかった」の話者の感情は？", ["Frustration / complaint at unexpected lack of recognition.", "Satisfaction.", "Gratitude.", "Certainty."], 0, "〜のに = unexpected result + complaint."),
        mc("jn3-full-p4-l-10", "（聴解スタイル）「彼は来るはずだ」の確信の根拠は？", ["Logical expectation based on evidence/schedule.", "Personal wish.", "Hearsay.", "Direct command."], 0, "〜はずだ = logical expectation."),
      ],
    },
  ],
};

const PAPER_5: JapaneseWeeklySubTest = {
  id: "jn3-full-paper-5",
  label: "Test 5",
  subtitle: {
    en: "Listening wrap-up + mixed review · 10 items",
    np: "सुन्ने समाप्ति र मिश्रित पुनरावलोकन · १० प्रश्न",
    jp: "聴解後半＋総合確認 · 10問",
  },
  intro: "聴解の続きと、N3全範囲の総復習問題です。",
  sections: [
    {
      title: "聴解（後半）",
      blurb: "場面理解 · 2問",
      items: [
        mc(
          "jn3-full-p5-l-1",
          "（聴解スタイル）「場合によっては、追加費用が発生します」の意味は？",
          ["In some cases, additional costs may arise.", "Additional costs always arise.", "No additional costs ever.", "All cases are the same."],
          0,
          "〜によっては = in some cases (partial variation).",
        ),
        mc(
          "jn3-full-p5-l-2",
          "（聴解スタイル）「健康のために、毎日運動するようにしています」の文法は？",
          ["のために = purpose/cause; ように + しています = making a conscious effort.", "のために = thanks to; ように = condition.", "のために = blame; ようにしている = result.", "Same as てある."],
          0,
          "〜のために = for the sake of; 〜ようにしている = ongoing conscious effort.",
        ),
      ],
    },
    {
      title: "総合ミニチェック（N3全範囲）",
      blurb: "語彙・文法おさらい · 8問",
      items: [
        mc(
          "jn3-full-p5-m-1",
          "「てある」の主な用法として正しいのは？",
          ["Deliberate result-state: something has been done and remains.", "Ongoing action.", "Accidental completion.", "Future plan."],
          0,
          "〜てある = result of deliberate action.",
        ),
        mc(
          "jn3-full-p5-m-2",
          "「〜のに」（逆接）の感情的特徴は？",
          ["Complaint or surprise at unexpected contrary result.", "Neutral contrast.", "Positive outcome.", "Causal connection."],
          0,
          "〜のに = unexpected result with complaint/surprise nuance.",
        ),
        mc(
          "jn3-full-p5-m-3",
          "「おかげで」「せいで」「のために（原因）」の感情ニュアンスの対応で正しいのは？",
          ["おかげで=positive; せいで=negative; のために=neutral", "All positive.", "All negative.", "All neutral."],
          0,
          "",
        ),
        mc(
          "jn3-full-p5-m-4",
          "「〜ようだ」と「〜らしい」の証拠源の違いは？",
          ["ようだ = speaker's direct observation/inference; らしい = indirect evidence or hearsay.", "Both direct observation.", "Both hearsay.", "らしい = direct; ようだ = hearsay."],
          0,
          "",
        ),
        mc(
          "jn3-full-p5-m-5",
          "「として」と「にとって」の使い分けで正しいのは？",
          ["として = in the role/capacity of; にとって = from the perspective of.", "Same meaning.", "にとって = role.", "として = perspective."],
          0,
          "",
        ),
        mc(
          "jn3-full-p5-m-6",
          "「〜ものの」の用法として正しいのは？",
          ["Formal concessive: although (written register).", "Casual contrast.", "Cause-effect.", "Condition."],
          0,
          "〜ものの = formal/written although.",
        ),
        mc(
          "jn3-full-p5-m-7",
          "N3読解で「逆接マーカー」として機能するのは？",
          ["しかし、ところが、けれど、にもかかわらず", "したがって、だから、そのため", "また、さらに、しかも", "つまり、すなわち"],
          0,
          "",
        ),
        mc(
          "jn3-full-p5-m-8",
          "「尊敬語」の代表的な動詞として正しいのは？",
          ["いらっしゃる（いる/来る/行く）、おっしゃる（言う）、なさる（する）", "申す（言う）、参る（来る/行く）、いたす（する）", "Both sets are 尊敬語.", "Neither set is keigo."],
          0,
          "尊敬語: いらっしゃる・おっしゃる・なさる. 謙譲語: 申す・参る・いたす.",
        ),
      ],
    },
  ],
};

/** Full-course JLPT N3 mock — five papers (Tests 1–5). */
export const N3_FULL_LEVEL_MOCK_EXAM: JapaneseWeeklyTest = {
  id: "jn3-full-mock",
  weekLabel: {
    en: "Course",
    np: "पाठ्यक्रम",
    jp: "コース",
  },
  title: {
    en: "JLPT N3 · Full mock exam",
    np: "JLPT N3 · पूर्ण मॉक परीक्षा",
    jp: "JLPT N3 · 総合模試",
  },
  subtitle: {
    en: "Five papers · vocabulary · grammar · reading · listening · mixed review",
    np: "पाँच वटा पेपर · शब्दभण्डार · व्याकरण · पढाइ · सुन्ने · मिश्रित पुनरावलोकन",
    jp: "5枚のペーパー · 語彙 · 文法 · 読解 · 聴解 · 総合確認",
  },
  coversDayRange: [1, 28],
  intro: {
    en: "This full mock has five separate papers (Test 1–5). Each uses a distinct question set covering N3 grammar patterns including 〜てある, conditionals (と/ば/たら/なら), ために/ように, のに, はずだ/べきだ, そうだ/らしい/ようだ, ながら, うちに/あいだに, ばかり/だけ/しか, ことになる/ことにする, keigo (honorific and humble forms), てもらう/てあげる/てくれる, ところ, ほど/くらい, ものの, として/にとって, によって/によっては, おかげで/せいで/ために. Work through in order, submit to score, then switch tabs. Paper 5 includes comprehensive review of all N3 grammar.",
    np: "यो पूर्ण मॉकमा पाँच छुट्टै पेपरहरू छन् (टेस्ट १–५)। प्रत्येकमा N3 व्याकरण ढाँचाहरू समेटेर फरक प्रश्न सेट छन् — てある, सर्त रूपहरू, ために/ように, のに, はずだ/べきだ, そうだ/らしい/ようだ, ながら, うちに/あいだに, ばかり/だけ/しか, ことになる/ことにする, केइगो, てもらう/てあげる/てくれる, ところ, ほど/くらい, ものの, として/にとって, によって/によっては, おかげで/せいで/ために। क्रममा पूरा गर्नुहोस्।",
    jp: "総合模試は5枚（テスト1〜5）に分かれています。てある、条件形（と/ば/たら/なら）、ために/ように、のに、はずだ/べきだ、そうだ/らしい/ようだ、ながら、うちに/あいだに、ばかり/だけ/しか、ことになる/ことにする、敬語（尊敬語・謙譲語）、てもらう/てあげる/てくれる、ところ、ほど/くらい、ものの、として/にとって、によって/によっては、おかげで/せいで/ためにをカバー。順に受け提出してスコアを確認してから次へ。テスト5は全N3文法の総合チェックです。",
  },
  closingNote: {
    en: "N3 reading requires quickly identifying discourse markers (contrast: しかし/ところが; cause: したがって/そのため; addition: また/さらに; paraphrase: つまり/すなわち). If you scored under 60% on Papers 3 or 4, drill reading with a focus on the first sentence of each paragraph — it almost always carries the main claim.",
    np: "N3 पढाइमा डिस्कोर्स मार्करहरू छिट्टै पहिचान गर्न आवश्यक छ। पेपर ३ वा ४ मा ६०% भन्दा कम भए, प्रत्येक अनुच्छेदको पहिलो वाक्यमा ध्यान केन्द्रित गरेर पढाइ अभ्यास गर्नुहोस्।",
    jp: "N3読解では談話マーカーの素早い識別が必要です（逆接: しかし/ところが、順接: したがって/そのため、添加: また/さらに、言い換え: つまり/すなわち）。ペーパー3または4で60%以下なら、各段落の冒頭文に注目した速読練習を重点的に行ってください。",
  },
  sections: [],
  subTests: [PAPER_1, PAPER_2, PAPER_3, PAPER_4, PAPER_5],
};
