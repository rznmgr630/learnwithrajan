/**
 * JLPT N5-style course finale: five separate papers (Tests 1–5), same UX as weekly unit tests.
 * Papers follow JLPT sections split across sittings: 語彙 → 文法 → 読解 → 聴解 (+ mixed review).
 */

import type {
  JapaneseWeeklySubTest,
  JapaneseWeeklyTest,
  JapaneseWeeklyTestItem,
} from "@/lib/japanese-learning/types";
import { youtubeClipsForMinnaLesson, youtubeClipsForSprintDay } from "@/lib/japanese-learning/n5-youtube-links";

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
  id: "jn5-full-p4-l-intro",
  scenario:
    "聴解：本試験では音声のみ再生されます。ここでは参考として短い動画を埋め込み、語感を確認してから場面問題へ進みます。",
  instruction:
    "クリップを一度再生し、敬語・依頼・数字に注意してください。続く問題は場面理解レベルの確認です。",
  youtubeVideos: [
    ...youtubeClipsForMinnaLesson(8),
    ...youtubeClipsForMinnaLesson(15),
    ...youtubeClipsForSprintDay(29),
  ].slice(0, 5),
  embedVideoId: YT_EMBED_ID,
};

const PAPER_1: JapaneseWeeklySubTest = {
  id: "jn5-full-paper-1",
  label: "Test 1",
  subtitle: {
    en: "Language knowledge (script & vocabulary) · 10 items",
    np: "भाषा ज्ञान (लिपि र शब्दभण्डार) · १० प्रश्न",
    jp: "言語知識（文字・語彙）· 10問",
  },
  intro:
    "語彙・漢字の読みと意味に慣れてから、文法・読解に進みましょう。",
  sections: [
    {
      title: "言語知識（文字・語彙）",
      blurb: "漢字の読み・語彙 · 10問",
      items: [
        mc(
          "jn5-full-p1-v-1",
          "「食べる」の読みとして正しいのはどれか。",
          ["たべる", "たべます", "たべない", "たべた"],
          0,
          "辞書形の読みは たべる。",
        ),
        mc(
          "jn5-full-p1-v-2",
          "「小学校」の読みとして自然なのはどれか。",
          ["しょうがっこう", "ちいさながっこう", "しょうがく", "がくしょう"],
          0,
          "小学校 = しょうがっこう。",
        ),
        mc(
          "jn5-full-p1-v-3",
          "「写真を撮る」の「撮る」の読みはどれか。",
          ["とる", "うつる", "うつす", "える"],
          0,
          "撮る（とる）take a photo.",
        ),
        mc(
          "jn5-full-p1-v-4",
          "「便利」の意味に最も近いのはどれか。",
          ["convenient", "beautiful", "expensive", "dangerous"],
          0,
          "便利 = convenient.",
        ),
        mc(
          "jn5-full-p1-v-5",
          "「渡す」の読みとして適切なのはどれか。",
          ["わたす", "わたる", "とおす", "とおる"],
          0,
          "渡す = hand over / pass.",
        ),
        mc(
          "jn5-full-p1-v-6",
          "「先生」の読みとして自然なのはどれか。",
          ["せんせい", "せいせん", "せんしょう", "せいしょう"],
          0,
          "",
        ),
        mc(
          "jn5-full-p1-v-7",
          "「駅」の読みとして適切なのはどれか。",
          ["えき", "いき", "えぎ", "えけ"],
          0,
          "",
        ),
        mc(
          "jn5-full-p1-v-8",
          "「毎日」の意味に最も近いのは？",
          ["every day", "every week", "once a month", "yesterday only"],
          0,
          "",
        ),
        mc(
          "jn5-full-p1-v-9",
          "「新しい」の反対語として適切なのは？",
          ["古い", "高い", "安い", "長い"],
          0,
          "",
        ),
        mc(
          "jn5-full-p1-v-10",
          "「会社員」の意味に最も近いのは？",
          ["company employee", "student", "doctor", "shop owner"],
          0,
          "",
        ),
      ],
    },
  ],
};

const PAPER_2: JapaneseWeeklySubTest = {
  id: "jn5-full-paper-2",
  label: "Test 2",
  subtitle: {
    en: "Language knowledge (grammar) · 10 items",
    np: "भाषा ज्ञान (व्याकरण) · १० प्रश्न",
    jp: "言語知識（文法）· 10問",
  },
  intro: "助詞・活用・丁寧形を確認します。",
  sections: [
    {
      title: "言語知識（文法）",
      blurb: "文の文法形式 · 10問",
      items: [
        mc(
          "jn5-full-p2-g-1",
          "わたし（　）イギリスからきました。",
          ["は", "が", "を", "に"],
          0,
          "自己紹介で話題を示す は。",
        ),
        mc(
          "jn5-full-p2-g-2",
          "コーヒー（　）のみます。",
          ["を", "が", "は", "で"],
          0,
          "飲むの目的語に を。",
        ),
        mc(
          "jn5-full-p2-g-3",
          "こうえん（　）サッカーをします。",
          ["で", "に", "を", "が"],
          0,
          "広い場所での活動に で.",
        ),
        mc(
          "jn5-full-p2-g-4",
          "あしたテニスを（　）。",
          ["します", "して", "した", "しない"],
          0,
          "ます形の予定：します。",
        ),
        mc(
          "jn5-full-p2-g-5",
          "きょうはかぜを（　）ので、やすみます。",
          ["ひいた", "ひく", "ひいて", "ひかない"],
          0,
          "風邪をひいたので — past reason.",
        ),
        mc(
          "jn5-full-p2-g-6",
          "このドアは静かに（　）。",
          ["しめてください", "しめます", "しめて", "しめないでください"],
          0,
          "Please close quietly — てください.",
        ),
        mc(
          "jn5-full-p2-g-7",
          "にほんご（　）べんきょうしています。",
          ["を", "が", "で", "に"],
          0,
          "",
        ),
        mc(
          "jn5-full-p2-g-8",
          "きょうしつ（　）だれがいますか。",
          ["に", "を", "で", "が"],
          0,
          "",
        ),
        mc(
          "jn5-full-p2-g-9",
          "わたしはまいあさコーヒーを（　）。",
          ["のみます", "のんで", "のんだ", "のまないで"],
          0,
          "",
        ),
        mc(
          "jn5-full-p2-g-10",
          "あしたはやい（　）、きょうはねます。",
          ["ので", "から", "のに", "でも"],
          0,
          "",
        ),
      ],
    },
  ],
};

const PAPER_3: JapaneseWeeklySubTest = {
  id: "jn5-full-paper-3",
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
          "jn5-full-p3-r-1",
          "【文】きょうはあめです。かさをもっていきます。\n筆者がするのはどれに近いか。",
          ["Take an umbrella.", "Stay home.", "Buy shoes.", "Swim."],
          0,
          "",
        ),
        mc(
          "jn5-full-p3-r-2",
          "【文】このレストランはすしがおいしいです。でもねだんはちょっとたかいです。\nたかいと言っているのは主に何か。",
          ["Price.", "Sushi quality.", "Chef.", "Location."],
          0,
          "ねだんはたかい = the price is high.",
        ),
        mc(
          "jn5-full-p3-r-3",
          "【文】せんせいは「じしょをみてもいいです」と言いました。\nがくせいに許可されているのは？",
          ["Using a dictionary.", "Talking loudly.", "Eating in class.", "Using phones."],
          0,
          "見てもいいです = may look.",
        ),
        mc(
          "jn5-full-p3-r-4",
          "【文】あしたはやすみです。でもしごとがあります。\n筆者のあしたは？",
          ["Has work despite a day off label / holiday nuance.", "Completely free.", "Will travel.", "Will study only."],
          0,
          "でもしごとが — contrast.",
        ),
        mc(
          "jn5-full-p3-r-5",
          "【文】このみちはあぶないです。くるまにちゅういしてください。\nアドバイスは？",
          ["Watch out for cars — dangerous road.", "Drive faster.", "Walk in the road.", "Ignore traffic."],
          0,
          "",
        ),
        mc(
          "jn5-full-p3-r-6",
          "【文】きのうはひまでした。テレビをみました。\nきのう何をしましたか。",
          ["Watched TV.", "Went abroad.", "Cooked dinner.", "Ran a marathon."],
          0,
          "",
        ),
        mc(
          "jn5-full-p3-r-7",
          "【文】わたしはまいあさ7じにおきます。\n筆者はいつおきますか。",
          ["At 7:00 every morning.", "At noon.", "At midnight.", "No fixed time."],
          0,
          "",
        ),
        mc(
          "jn5-full-p3-r-8",
          "【文】このへやはしずかで、べんきょうしやすいです。\nへやの様子は？",
          ["Quiet and easy to study in.", "Noisy and crowded.", "Too dark.", "Very expensive."],
          0,
          "",
        ),
        mc(
          "jn5-full-p3-r-9",
          "【文】ともだちはあしたえきでわたしをまちます。\nだれがまちますか。",
          ["My friend waits for me.", "I wait for my friend at home.", "No one waits.", "Teacher waits."],
          0,
          "",
        ),
        mc(
          "jn5-full-p3-r-10",
          "【文】このケーキはおいしいですが、ちょっとたかいです。\n内容に合うのは？",
          ["It is tasty but a little expensive.", "It is cheap and bad.", "It is free and small.", "It is not food."],
          0,
          "",
        ),
      ],
    },
  ],
};

const PAPER_4: JapaneseWeeklySubTest = {
  id: "jn5-full-paper-4",
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
        mc(
          "jn5-full-p4-l-1",
          "（聴解スタイル）店員「いちまんえんになります。」いちばん近いのは？",
          ["The total is 10,000 yen.", "It is free.", "Discount 10%.", "Closed."],
          0,
          "",
        ),
        mc(
          "jn5-full-p4-l-2",
          "（聴解スタイル）「もうすこしやすいのはありますか。」きいているのは？",
          ["Asking if something cheaper is available.", "Asking for directions.", "Complaining about staff.", "Ordering dessert."],
          0,
          "",
        ),
        mc(
          "jn5-full-p4-l-3",
          "（聴解スタイル）「まどをあけてください。」依頼は？",
          ["Please open the window.", "Please close the window.", "Please buy a window.", "Please clean the room."],
          0,
          "",
        ),
        mc(
          "jn5-full-p4-l-4",
          "（聴解スタイル）「バスはまだきていません。」意味は？",
          ["The bus has not arrived yet.", "The bus already left long ago.", "The bus is full.", "No buses exist."],
          0,
          "",
        ),
        mc(
          "jn5-full-p4-l-5",
          "（聴解スタイル）「ここでしゃしんをとってもいいですか。」話者は何をしたい？",
          ["Ask permission to take photos here.", "Buy a camera.", "Delete a photo.", "Call a taxi."],
          0,
          "",
        ),
        mc(
          "jn5-full-p4-l-6",
          "（聴解スタイル）「しつれいですが、おなまえは？」何を聞いている？",
          ["The person's name.", "The person's age.", "The price.", "The train time."],
          0,
          "",
        ),
        mc(
          "jn5-full-p4-l-7",
          "（聴解スタイル）「あしたは9じにしゅうごうです。」何時に集合？",
          ["9 o'clock.", "8 o'clock.", "10 o'clock.", "No set time."],
          0,
          "",
        ),
        mc(
          "jn5-full-p4-l-8",
          "（聴解スタイル）「このへやはきんえんです。」ルールは？",
          ["No smoking in this room.", "Smoking required.", "Eating is forbidden.", "Talking is forbidden."],
          0,
          "",
        ),
        mc(
          "jn5-full-p4-l-9",
          "（聴解スタイル）「レシートはこちらです。」場面は？",
          ["Receiving a receipt after payment.", "Getting homework.", "Receiving a train pass.", "Receiving an ID card."],
          0,
          "",
        ),
        mc(
          "jn5-full-p4-l-10",
          "（聴解スタイル）「おさきにどうぞ。」に最も近いのは？",
          ["Please go first.", "Stop immediately.", "Come back tomorrow.", "Wait outside."],
          0,
          "",
        ),
      ],
    },
  ],
};

const PAPER_5: JapaneseWeeklySubTest = {
  id: "jn5-full-paper-5",
  label: "Test 5",
  subtitle: {
    en: "Listening wrap-up + mixed review · 10 items",
    np: "सुन्ने समाप्ति र मिश्रित पुनरावलोकन · १० प्रश्न",
    jp: "聴解後半＋総合確認 · 10問",
  },
  intro: "聴解の続きと、試験直前の総復習問題です。",
  sections: [
    {
      title: "聴解（後半）",
      blurb: "場面理解 · 2問",
      items: [
        mc(
          "jn5-full-p5-l-3",
          "（聴解スタイル）「きょうしつでケータイをつかわないでください。」意味は？",
          ["Do not use phones in the classroom.", "Please call the teacher.", "Phones are required.", "Open the window."],
          0,
          "",
        ),
        mc(
          "jn5-full-p5-l-4",
          "（聴解スタイル）「えきはこちらですか。」場面は？",
          ["Asking if the station is this way.", "Buying a ticket.", "Announcing delay.", "Hotel check-in."],
          0,
          "",
        ),
      ],
    },
    {
      title: "総合ミニチェック",
      blurb: "語彙・文法おさらい · 8問",
      items: [
        mc(
          "jn5-full-p5-m-1",
          "「べんきょうします」の丁寧い形（ます形）として正しいのは？",
          ["べんきょうします", "べんきょうする", "べんきょうした", "べんきょうしない"],
          0,
          " polite present = 〜します.",
        ),
        mc(
          "jn5-full-p5-m-2",
          "「きのう」の意味に最も近いのは？",
          ["yesterday", "today", "tomorrow", "last year"],
          0,
          "",
        ),
        mc(
          "jn5-full-p5-m-3",
          "たんご「てがみ」の意味は？",
          ["letter (mail)", "telephone", "stamp only", "teacher"],
          0,
          "",
        ),
        mc(
          "jn5-full-p5-m-4",
          "「これはわたしのかさです。」に近い英文は？",
          ["This is my umbrella.", "That is your bag.", "Give me water.", "Where is the station?"],
          0,
          "",
        ),
        mc(
          "jn5-full-p5-m-5",
          "「あした」の意味に最も近いのは？",
          ["tomorrow", "yesterday", "today", "this week"],
          0,
          "",
        ),
        mc(
          "jn5-full-p5-m-6",
          "「にほんごをべんきょうしています。」の意味は？",
          ["I am studying Japanese.", "I teach Japanese.", "I forgot Japanese.", "I sell Japanese books."],
          0,
          "",
        ),
        mc(
          "jn5-full-p5-m-7",
          "「〜ません」の形は主に何を表す？",
          ["Negative polite form.", "Past tense only.", "Question marker.", "Command form."],
          0,
          "",
        ),
        mc(
          "jn5-full-p5-m-8",
          "「きっぷをかいます。」で正しい訳は？",
          ["I buy a ticket.", "I borrow a ticket.", "I throw away a ticket.", "I draw a ticket."],
          0,
          "",
        ),
      ],
    },
  ],
};

/** Full-course JLPT N5 mock — five papers (Tests 1–5). */
export const N5_FULL_LEVEL_MOCK_EXAM: JapaneseWeeklyTest = {
  id: "jn5-full-mock",
  weekLabel: {
    en: "Course",
    np: "पाठ्यक्रम",
    jp: "コース",
  },
  title: {
    en: "JLPT N5 · Full mock exam",
    np: "JLPT N5 · पूर्ण मॉक परीक्षा",
    jp: "JLPT N5 · 総合模試",
  },
  subtitle: {
    en: "Five papers · vocabulary · grammar · reading · listening · mixed review",
    np: "पाँच वटा पेपर · शब्दभण्डार · व्याकरण · पढाइ · सुन्ने · मिश्रित पुनरावलोकन",
    jp: "5枚のペーパー · 語彙 · 文法 · 読解 · 聴解 · 総合確認",
  },
  coversDayRange: [1, 30],
  intro: {
    en: "This full mock has five separate papers (Test 1–5). Each uses a distinct question set—work through them in order, submit to score, then switch tabs. Order follows JLPT-style flow: vocabulary → grammar → reading → listening (split across two papers) plus a short mixed review on Paper 5. Answers stay hidden until you submit the current paper.",
    np: "यो पूर्ण मॉकमा पाँच छुट्टै पेपरहरू छन् (टेस्ट १–५)। प्रत्येकमा फरक प्रश्न सेट छ — क्रममा पूरा गर्नुहोस्, स्कोर हेर्न पेश गर्नुहोस्, अनि ट्याब बदल्नुहोस्। क्रम JLPT जस्तै छ: शब्दभण्डार → व्याकरण → पढाइ → सुन्ने (दुई पेपरमा बाँडिएको) र पाँचौं पेपरमा छोटो मिश्रित पुनरावलोकन। हालको पेपर पेश नगरेसम्म उत्तर लुकेको हुन्छ।",
    jp: "総合模試は5つのペーパー（テスト1〜5）に分かれています。問題セットはそれぞれ異なります。順に受け、提出してスコアを確認してから次のタブへ。構成は JLPT に近い流れ（語彙→文法→読解→聴解を2枚に分割）で、テスト5の最後に総合ミニチェックがあります。いま開いているペーパーを提出するまで正答は表示されません。",
  },
  closingNote: {
    en: "Listening sections still pair best with textbook audio — repeat until you can shadow comfortably. On exam day you usually get one play per clip; practise note-taking from the first listen.",
    np: "सुन्ने खण्डहरू पाठ्यपुस्तकको अडियोसँग राम्रो जान्छन् — आरामले छायाँ गर्न सक्नुहुन्छ भने दोहोर्याउनुहोस्। परीक्षामा प्रायः क्लिप एक पटक मात्र बज्छ; पहिलो सुन्नेमै नोट लिन अभ्यास गर्नुहोस्।",
    jp: "聴解は教科書CDの音声と併用すると効果的です。本番では多くの場合一度きりの再生です。最初の再生からメモを取る癖をつけましょう。",
  },
  sections: [],
  subTests: [PAPER_1, PAPER_2, PAPER_3, PAPER_4, PAPER_5],
};
