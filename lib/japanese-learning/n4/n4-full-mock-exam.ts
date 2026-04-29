/**
 * JLPT N4-style course finale: five separate papers (Tests 1–5).
 * Covers all 28-day curriculum (Minna II L26–50 + sprint).
 */

import type {
  JapaneseWeeklySubTest,
  JapaneseWeeklyTest,
  JapaneseWeeklyTestItem,
} from "@/lib/japanese-learning/types";
import { youtubeClipsForMinnaIILesson, youtubeClipsForN4SprintDay } from "@/lib/japanese-learning/n4/n4-youtube-links";

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
  id: "jn4-full-p4-l-intro",
  scenario:
    "聴解：本試験では音声のみ再生されます。ここでは短い動画を参考として埋め込み、語感を確認してから場面問題へ進みます。",
  instruction:
    "クリップを一度再生し、丁寧な依頼・許可・推量表現に注意してください。続く問題は場面理解レベルの確認です。",
  youtubeVideos: [
    ...youtubeClipsForMinnaIILesson(33),
    ...youtubeClipsForMinnaIILesson(46),
    ...youtubeClipsForN4SprintDay(27),
  ].slice(0, 5),
  embedVideoId: YT_EMBED_ID,
};

const PAPER_1: JapaneseWeeklySubTest = {
  id: "jn4-full-paper-1",
  label: "Test 1",
  subtitle: {
    en: "Language knowledge (script & vocabulary) · 10 items",
    np: "भाषा ज्ञान (लिपि र शब्दभण्डार) · १० प्रश्न",
    jp: "言語知識（文字・語彙）· 10問",
  },
  intro: "N4レベルの語彙・漢字の読みと意味を確認します。",
  sections: [
    {
      title: "言語知識（文字・語彙）",
      blurb: "漢字の読み・語彙 · 10問",
      items: [
        mc("jn4-full-p1-v-1", "「準備」の読みとして正しいのはどれか。", ["じゅんび", "じゅんべい", "しゅんび", "すんび"], 0, "準備 = じゅんび preparation."),
        mc("jn4-full-p1-v-2", "「連絡」の読みとして自然なのはどれか。", ["れんらく", "れんろく", "れいらく", "れんかく"], 0, "連絡 = れんらく contact/notification."),
        mc("jn4-full-p1-v-3", "「片付ける」の意味に最も近いのはどれか。", ["to tidy up / put away", "to break apart", "to study hard", "to take a photo"], 0, "片付ける = to clean up, put in order."),
        mc("jn4-full-p1-v-4", "「経験」の読みはどれか。", ["けいけん", "けいかん", "きょうけん", "きょうかん"], 0, "経験 = けいけん experience."),
        mc("jn4-full-p1-v-5", "「増える」の読みとして適切なのはどれか。", ["ふえる", "ましえる", "ぞうえる", "たすける"], 0, "増える = ふえる to increase."),
        mc("jn4-full-p1-v-6", "「注意」の意味に最も近いのは？", ["caution / attention", "celebration", "regret", "permission"], 0, "注意 = ちゅうい caution."),
        mc("jn4-full-p1-v-7", "「相談」の読みとして正しいのは？", ["そうだん", "そうたん", "さいだん", "しょうだん"], 0, "相談 = そうだん consultation."),
        mc("jn4-full-p1-v-8", "「残念」の意味として最も近いのは？", ["unfortunate / regrettable", "joyful", "relaxed", "confused"], 0, "残念 = ざんねん what a pity."),
        mc("jn4-full-p1-v-9", "「急ぐ」の意味はどれか。", ["to hurry", "to wait", "to sleep", "to stop"], 0, "急ぐ = いそぐ to hurry."),
        mc("jn4-full-p1-v-10", "「便利」の反対語に最も近いのは？", ["不便", "不安", "不満", "不思議"], 0, "不便 = ふべん inconvenient ↔ 便利 convenient."),
      ],
    },
  ],
};

const PAPER_2: JapaneseWeeklySubTest = {
  id: "jn4-full-paper-2",
  label: "Test 2",
  subtitle: {
    en: "Language knowledge (grammar) · 10 items",
    np: "भाषा ज्ञान (व्याकरण) · १० प्रश्न",
    jp: "言語知識（文法）· 10問",
  },
  intro: "N4レベルの文法形式を確認します。",
  sections: [
    {
      title: "言語知識（文法）",
      blurb: "文の文法形式 · 10問",
      items: [
        mc("jn4-full-p2-g-1", "荷物をまとめ（　）から、出発しましょう。", ["て", "てから", "ので", "から"], 1, "てから = after doing — sequential action."),
        mc("jn4-full-p2-g-2", "このシャツは洗い（　）です。", ["やすい", "にくい", "すぎる", "ような"], 0, "洗いやすい = easy to wash （〜やすい）."),
        mc("jn4-full-p2-g-3", "彼女はピアノが弾ける（　）なりました。", ["ように", "ために", "から", "のに"], 0, "弾けるようになりました = has come to be able to play (gradual change)."),
        mc("jn4-full-p2-g-4", "田中さんは来（　）と思っています。", ["る", "ない", "なかった", "るだろう"], 0, "来ると思っています = I think (he) will come."),
        mc("jn4-full-p2-g-5", "薬を飲んでみ（　）が、治りませんでした。", ["ました", "て", "たり", "れば"], 0, "飲んでみましたが = tried taking medicine but…"),
        mc("jn4-full-p2-g-6", "雨が降る（　）、傘を持っていきます。", ["かもしれないので", "でしょう", "ようです", "らしい"], 0, "〜かもしれないので = because it might rain."),
        mc("jn4-full-p2-g-7", "先生が生徒に教科書を読ま（　）。", ["せました", "れました", "もらいました", "てもらいました"], 0, "読ませました = made the student read （causative）."),
        mc("jn4-full-p2-g-8", "私は兄に部屋を掃除さ（　）。", ["せられました", "れました", "もらいました", "てくれました"], 0, "掃除させられました = was made to clean by older brother （causative-passive）."),
        mc("jn4-full-p2-g-9", "明日は晴れる（　）です。", ["はず", "ため", "ほど", "だけ"], 0, "晴れるはずです = it should be sunny （logical expectation）."),
        mc("jn4-full-p2-g-10", "この問題は難しい（　）、諦めません。", ["けれど", "なのに", "から", "ので"], 0, "難しいけれど = although it is difficult."),
      ],
    },
  ],
};

const PAPER_3: JapaneseWeeklySubTest = {
  id: "jn4-full-paper-3",
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
          "jn4-full-p3-r-1",
          "【文】会議が終わってから、資料を片付けておきました。\n「片付けておく」の意図は？",
          ["Tidied up in preparation for next time.", "Threw away the documents.", "Will tidy up later.", "Asked someone else to tidy up."],
          0,
          "〜ておく = to do something in advance/for future use.",
        ),
        mc(
          "jn4-full-p3-r-2",
          "【文】山田さんは毎日運動するようになりました。\n文の意味は？",
          ["Yamada-san has come to exercise every day (gradual change).", "Yamada-san has always exercised.", "Yamada-san stopped exercising.", "Yamada-san is told to exercise."],
          0,
          "〜ようになりました = came to (gradual change).",
        ),
        mc(
          "jn4-full-p3-r-3",
          "【文】このコースは難しすぎて、ついていけません。\n筆者の状況は？",
          ["The course is too difficult to keep up with.", "The course is very easy.", "The course was cancelled.", "The course just started."],
          0,
          "難しすぎて = too difficult; ついていけない = cannot keep up.",
        ),
        mc(
          "jn4-full-p3-r-4",
          "【文】明日の天気は雨かもしれません。傘を持っていったほうがいいです。\nアドバイスは？",
          ["Take an umbrella since it might rain.", "No umbrella needed.", "Stay home tomorrow.", "Check the weather later."],
          0,
          "かもしれません = might; 〜ほうがいい = had better.",
        ),
        mc(
          "jn4-full-p3-r-5",
          "【文】母が私に野菜を食べさせました。\nだれが何をしましたか。",
          ["Mother made me eat vegetables.", "I made my mother eat vegetables.", "Mother asked me to buy vegetables.", "I offered to cook vegetables for mother."],
          0,
          "〜させました = made someone do something (causative).",
        ),
        mc(
          "jn4-full-p3-r-6",
          "【文】子どもたちは先生に長い文章を読まされました。\nだれに何をさせられましたか。",
          ["Children were made to read a long passage by the teacher.", "Teacher was made to read by children.", "Children asked the teacher to read.", "Teacher read alone voluntarily."],
          0,
          "〜させられました = causative-passive: were made to.",
        ),
        mc(
          "jn4-full-p3-r-7",
          "【文】彼は日本語の試験に合格できるはずです。毎日練習しています。\n筆者の見解は？",
          ["He should be able to pass based on his daily practice.", "He will definitely fail.", "He might not study enough.", "He has already passed."],
          0,
          "〜はずです = logical expectation based on evidence.",
        ),
        mc(
          "jn4-full-p3-r-8",
          "【文】もし時間があれば、一緒に映画を見ませんか。\n誘いの条件は？",
          ["If you have time, come watch a movie together.", "I want to go to the movies alone.", "The movie is only for children.", "There is no time to see a movie."],
          0,
          "もし〜ば = if; conditional invitation.",
        ),
        mc(
          "jn4-full-p3-r-9",
          "【文】たとえ雨が降っても、試合は行われます。\n試合はどうなりますか。",
          ["The match will go on even if it rains.", "The match will be cancelled if it rains.", "The match depends on the weather.", "The match is indoors only."],
          0,
          "たとえ〜ても = even if.",
        ),
        mc(
          "jn4-full-p3-r-10",
          "【文】健康のために、毎朝30分歩くようにしています。\n筆者が心がけていることは？",
          ["Making an effort to walk 30 minutes every morning for health.", "Walking only on weekends.", "Running for one hour daily.", "Resting as much as possible."],
          0,
          "〜ようにしています = making a conscious effort to do.",
        ),
      ],
    },
  ],
};

const PAPER_4: JapaneseWeeklySubTest = {
  id: "jn4-full-paper-4",
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
        mc("jn4-full-p4-l-1", "（聴解スタイル）「窓を開けていただけませんか。」最も丁寧な表現はどれか。", ["〜ていただけませんか", "〜てくれる？", "〜てください", "〜てもらえる？"], 0, "〜ていただけませんか is the most formal/polite request form."),
        mc("jn4-full-p4-l-2", "（聴解スタイル）「来週の会議には参加できるはずです。」意味は？", ["Should be able to attend next week's meeting.", "Definitely cannot attend.", "Will skip the meeting.", "Has already attended."], 0, "〜はずです = logical expectation."),
        mc("jn4-full-p4-l-3", "（聴解スタイル）「薬を飲めば、よくなりますよ。」何が改善しますか。", ["Health should improve if medicine is taken.", "Medicine has no effect.", "You will feel worse.", "Must see a doctor first."], 0, "〜ば〜 conditional: if you take medicine, you'll get better."),
        mc("jn4-full-p4-l-4", "（聴解スタイル）「部長に報告書を書かされました。」誰が書きましたか。", ["I was made to write the report by the manager.", "The manager wrote it.", "A colleague wrote it voluntarily.", "No one wrote it."], 0, "書かされました = causative-passive: was made to write."),
        mc("jn4-full-p4-l-5", "（聴解スタイル）「コーヒーは飲みすぎると体に悪いそうです。」意味は？", ["I heard that drinking too much coffee is bad for health.", "Coffee is always healthy.", "You should drink more coffee.", "Coffee has no effect on health."], 0, "〜そうです = hearsay; 飲みすぎる = drink too much."),
        mc("jn4-full-p4-l-6", "（聴解スタイル）「締め切りまでに資料を用意しておいてください。」なぜておく？", ["To prepare the documents in advance before the deadline.", "To store documents after the deadline.", "To delete the documents.", "To send the documents after reading."], 0, "〜ておく = prepare something in advance."),
        mc("jn4-full-p4-l-7", "（聴解スタイル）「子どもに野菜を食べさせるのが大変です。」大変なことは？", ["Getting the child to eat vegetables.", "Cooking vegetables.", "Buying vegetables.", "Storing vegetables."], 0, "食べさせる = make eat (causative)."),
        mc("jn4-full-p4-l-8", "（聴解スタイル）「この映画は何度見ても飽きません。」意味は？", ["I never get tired of this movie no matter how many times I watch it.", "The movie is too long.", "I have seen it only once.", "The movie is boring."], 0, "何度〜ても = no matter how many times."),
        mc("jn4-full-p4-l-9", "（聴解スタイル）「電車が遅れたので、会議に間に合いませんでした。」原因は？", ["The train was late.", "He overslept.", "The meeting was cancelled.", "He forgot the meeting."], 0, "〜ので = because (cause: train delay)."),
        mc("jn4-full-p4-l-10", "（聴解スタイル）「もう少しゆっくり話していただけますか。」何を頼んでいるか。", ["Asking to speak more slowly.", "Asking to speak louder.", "Asking to stop talking.", "Asking to speak in English."], 0, "〜ていただけますか = polite request."),
      ],
    },
  ],
};

const PAPER_5: JapaneseWeeklySubTest = {
  id: "jn4-full-paper-5",
  label: "Test 5",
  subtitle: {
    en: "Listening wrap-up + mixed review · 10 items",
    np: "सुन्ने समाप्ति र मिश्रित पुनरावलोकन · १० प्रश्न",
    jp: "聴解後半＋総合確認 · 10問",
  },
  intro: "聴解の続きと、N4全範囲の総復習問題です。",
  sections: [
    {
      title: "聴解（後半）",
      blurb: "場面理解 · 2問",
      items: [
        mc(
          "jn4-full-p5-l-1",
          "（聴解スタイル）「先生に作文を直してもらいました。」誰が何をしましたか。",
          ["The teacher corrected my composition for me.", "I corrected the teacher's composition.", "The teacher told me to correct it myself.", "No correction was done."],
          0,
          "直してもらいました = had (someone) correct for me; 先生に = by/from teacher.",
        ),
        mc(
          "jn4-full-p5-l-2",
          "（聴解スタイル）「このボタンを押せば、ドアが開きます。」どうするとドアが開く？",
          ["Press this button.", "Pull the door handle.", "Insert a key.", "Type a code."],
          0,
          "ボタンを押せば = if you press the button (ば conditional).",
        ),
      ],
    },
    {
      title: "総合ミニチェック（N4全範囲）",
      blurb: "語彙・文法おさらい · 8問",
      items: [
        mc(
          "jn4-full-p5-m-1",
          "「てしまいました」の主な用法として正しいのは？",
          ["Expressing regret or completion of an action.", "Expressing a polite request.", "Expressing a possibility.", "Expressing an obligation."],
          0,
          "〜てしまいました = completed (often with regret).",
        ),
        mc(
          "jn4-full-p5-m-2",
          "「〜にくい」の意味として正しいのは？",
          ["Difficult to do", "Easy to do", "Used to do", "Stopped doing"],
          0,
          "〜にくい = difficult / hard to do.",
        ),
        mc(
          "jn4-full-p5-m-3",
          "「〜ことになりました」の意味として最も近いのは？",
          ["It has been decided that… (external decision)", "I decided to…", "I want to…", "I should…"],
          0,
          "〜ことになりました = it has been decided (often by circumstances or others).",
        ),
        mc(
          "jn4-full-p5-m-4",
          "「〜ようです」と「〜らしいです」の違いは？",
          ["〜ようです = speaker's direct observation; 〜らしいです = hearsay/indirect evidence", "Both mean the same thing.", "〜らしいです = direct observation; 〜ようです = hearsay", "〜ようです is only for weather."],
          0,
          "ようです = based on what speaker directly perceives; らしいです = based on hearsay or indirect info.",
        ),
        mc(
          "jn4-full-p5-m-5",
          "「させてください」の意味は？",
          ["Please let me do…", "Please make me do…", "I was made to do…", "I want you to do…"],
          0,
          "〜させてください = please allow me to do (polite request for permission to act).",
        ),
        mc(
          "jn4-full-p5-m-6",
          "「食べれば食べるほど太ります」の「ほど」の用法は？",
          ["The more… the more… (proportional increase)", "Only as much as needed", "About / approximately", "Too much"],
          0,
          "〜ば〜ほど = the more… the more…",
        ),
        mc(
          "jn4-full-p5-m-7",
          "「〜んです」と「〜ます」の使い分けで正しいのはどれか。",
          ["〜んです explains or seeks explanation; 〜ます is a neutral statement.", "Both are identical in all contexts.", "〜んです is only for questions.", "〜ます is more formal in all cases."],
          0,
          "〜んです (んだ) = explanatory tone; adds 'you see' nuance.",
        ),
        mc(
          "jn4-full-p5-m-8",
          "「passive形（〜られる）」の基本的な用法は？",
          ["To describe an action done TO the subject, often with negative nuance.", "To express the subject doing the action.", "To express permission.", "To express a wish."],
          0,
          "受け身（passive）= the subject receives the action, often implying inconvenience.",
        ),
      ],
    },
  ],
};

/** Full-course JLPT N4 mock — five papers (Tests 1–5). */
export const N4_FULL_LEVEL_MOCK_EXAM: JapaneseWeeklyTest = {
  id: "jn4-full-mock",
  weekLabel: {
    en: "Course",
    np: "पाठ्यक्रम",
    jp: "コース",
  },
  title: {
    en: "JLPT N4 · Full mock exam",
    np: "JLPT N4 · पूर्ण मॉक परीक्षा",
    jp: "JLPT N4 · 総合模試",
  },
  subtitle: {
    en: "Five papers · vocabulary · grammar · reading · listening · mixed review",
    np: "पाँच वटा पेपर · शब्दभण्डार · व्याकरण · पढाइ · सुन्ने · मिश्रित पुनरावलोकन",
    jp: "5枚のペーパー · 語彙 · 文法 · 読解 · 聴解 · 総合確認",
  },
  coversDayRange: [1, 28],
  intro: {
    en: "This full mock has five separate papers (Test 1–5). Each uses a distinct question set covering N4 grammar patterns from Minna no Nihongo II (Lessons 26–50) including passive, causative, causative-passive, conditionals, and hearsay expressions. Work through them in order, submit to score, then switch tabs. Paper 5 includes a comprehensive review of all N4 grammar. Answers stay hidden until you submit the current paper.",
    np: "यो पूर्ण मॉकमा पाँच छुट्टै पेपरहरू छन् (टेस्ट १–५)। प्रत्येकमा मिन्ना नो निहोन्गो II (पाठ २६–५०) का N4 व्याकरण ढाँचाहरू समेटेर फरक प्रश्न सेट छन् — passive, causative, causative-passive, सर्त र भनिन्छ भाव। क्रममा पूरा गर्नुहोस्, स्कोरका लागि पेश गर्नुहोस्। पेपर ५ मा सबै N4 व्याकरणको समीक्षा छ।",
    jp: "総合模試は5枚（テスト1〜5）に分かれています。みんなの日本語II（第26〜50課）のN4文法（passive・使役・使役受け身・条件・伝聞等）をカバー。順に受け提出してスコアを確認してから次へ。テスト5は全N4文法の総合チェックです。提出前は正答非表示。",
  },
  closingNote: {
    en: "Listening sections still pair best with Minna II audio. On exam day you get one play per clip; practise note-taking from the first listen. Causative and passive forms are always heavily tested — review your verb conjugation tables if you scored under 60% on Papers 2 or 4.",
    np: "सुन्ने खण्डहरू मिन्ना II अडियोसँग राम्रो जान्छन्। परीक्षामा प्रायः क्लिप एक पटक मात्र बज्छ; पहिलो सुन्नेमै नोट लिन अभ्यास गर्नुहोस्। causative र passive रूपहरू सधैं धेरै परीक्षणमा हुन्छन् — पेपर २ वा ४ मा ६०% भन्दा कम भए क्रिया-संयोग तालिका हेर्नुहोस्।",
    jp: "聴解はみんなのII CDとセットで。本番は各クリップ一度きりなのでメモを取る練習を。使役・受け身は必ず出るので、ペーパー2または4で60%以下なら動詞活用表を見直してください。",
  },
  sections: [],
  subTests: [PAPER_1, PAPER_2, PAPER_3, PAPER_4, PAPER_5],
};
