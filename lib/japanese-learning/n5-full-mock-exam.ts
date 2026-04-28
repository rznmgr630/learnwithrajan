/**
 * Single comprehensive JLPT N5-style mock covering Days 1–30 / all units.
 * Paper layout mirrors JLPT sections: 語彙 → 文法 → 読解 → 聴解 (20 scored MCQs + clip).
 */

import type { JapaneseWeeklyTest, JapaneseWeeklyTestItem } from "@/lib/japanese-learning/types";
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

const listeningIntro: JapaneseWeeklyTestItem = {
  kind: "listeningIntro",
  id: "jn5-full-l-intro",
  scenario:
    "聴解：本試験では音声のみ再生されます。ここでは参考として短い動画を埋め込み、語感を確認してから場面問題へ進みます。",
  instruction:
    "クリップを一度再生し、敬語・依頼・数字に注意してください。続く四問はミニ会話レベルの理解です。",
  youtubeVideos: [
    ...youtubeClipsForMinnaLesson(8),
    ...youtubeClipsForMinnaLesson(15),
    ...youtubeClipsForSprintDay(29),
  ].slice(0, 5),
  embedVideoId: YT_EMBED_ID,
};

/** Full-course JLPT N5 mock — one sitting, all skill areas. */
export const N5_FULL_LEVEL_MOCK_EXAM: JapaneseWeeklyTest = {
  id: "jn5-full-mock",
  weekLabel: "Course",
  title: "JLPT N5 · Full mock exam",
  subtitle: "Overall level · vocabulary · kanji · grammar · reading · listening",
  coversDayRange: [1, 30],
  intro:
    "総合模試です。JLPT N5の問題構成に近い順で並べています（言語知識〈文字・語彙〉→言語知識〈文法〉→読解→聴解）。「提出」まで正答は表示されません。",
  closingNote:
    "リスニングは本番では一回のみ再生のことが多いので、最初からメモを取る癖をつけましょう。",
  sections: [
    {
      title: "言語知識（文字・語彙）",
      blurb: "漢字の読み・語彙 · 5問",
      items: [
        mc(
          "jn5-full-v-1",
          "「食べる」の読みとして正しいのはどれか。",
          ["たべる", "たべます", "たべない", "たべた"],
          0,
          "辞書形の読みは たべる。",
        ),
        mc(
          "jn5-full-v-2",
          "「小学校」の読みとして自然なのはどれか。",
          ["しょうがっこう", "ちいさながっこう", "しょうがく", "がくしょう"],
          0,
          "小学校 = しょうがっこう。",
        ),
        mc(
          "jn5-full-v-3",
          "「写真を撮る」の「撮る」の読みはどれか。",
          ["とる", "うつる", "うつす", "える"],
          0,
          "撮る（とる）take a photo.",
        ),
        mc(
          "jn5-full-v-4",
          "「便利」の意味に最も近いのはどれか。",
          ["convenient", "beautiful", "expensive", "dangerous"],
          0,
          "便利 = convenient.",
        ),
        mc(
          "jn5-full-v-5",
          "「渡す」の読みとして適切なのはどれか。",
          ["わたす", "わたる", "とおす", "とおる"],
          0,
          "渡す = hand over / pass.",
        ),
      ],
    },
    {
      title: "言語知識（文法）",
      blurb: "文の文法形式 · 6問",
      items: [
        mc(
          "jn5-full-g-1",
          "わたし（　）イギリスからきました。",
          ["は", "が", "を", "に"],
          0,
          "自己紹介で話題を示す は。",
        ),
        mc(
          "jn5-full-g-2",
          "コーヒー（　）のみます。",
          ["を", "が", "は", "で"],
          0,
          "飲むの目的語に を。",
        ),
        mc(
          "jn5-full-g-3",
          "こうえん（　）サッカーをします。",
          ["で", "に", "を", "が"],
          0,
          "広い場所での活動に で.",
        ),
        mc(
          "jn5-full-g-4",
          "あしたテニスを（　）。",
          ["します", "して", "した", "しない"],
          0,
          "ます形の予定：します。",
        ),
        mc(
          "jn5-full-g-5",
          "きょうはかぜを（　）ので、やすみます。",
          ["ひいた", "ひく", "ひいて", "ひかない"],
          0,
          "風邪をひいたので — past reason.",
        ),
        mc(
          "jn5-full-g-6",
          "このドアは静かに（　）。",
          ["しめてください", "しめます", "しめて", "しめないでください"],
          0,
          "Please close quietly — てください.",
        ),
      ],
    },
    {
      title: "読解",
      blurb: "内容理解 · 5問",
      items: [
        mc(
          "jn5-full-r-1",
          "【文】きょうはあめです。かさをもっていきます。\n筆者がするのはどれに近いか。",
          ["Take an umbrella.", "Stay home.", "Buy shoes.", "Swim."],
          0,
          "",
        ),
        mc(
          "jn5-full-r-2",
          "【文】このレストランはすしがおいしいです。でもねだんはちょっとたかいです。\nたかいと言っているのは主に何か。",
          ["Price.", "Sushi quality.", "Chef.", "Location."],
          0,
          "ねだんはたかい = the price is high.",
        ),
        mc(
          "jn5-full-r-3",
          "【文】せんせいは「じしょをみてもいいです」と言いました。\nがくせいに許可されているのは？",
          ["Using a dictionary.", "Talking loudly.", "Eating in class.", "Using phones."],
          0,
          "見てもいいです = may look.",
        ),
        mc(
          "jn5-full-r-4",
          "【文】あしたはやすみです。でもしごとがあります。\n筆者のあしたは？",
          ["Has work despite a day off label / holiday nuance.", "Completely free.", "Will travel.", "Will study only."],
          0,
          "でもしごとが — contrast.",
        ),
        mc(
          "jn5-full-r-5",
          "【文】このみちはあぶないです。くるまにちゅういしてください。\nアドバイスは？",
          ["Watch out for cars — dangerous road.", "Drive faster.", "Walk in the road.", "Ignore traffic."],
          0,
          "",
        ),
      ],
    },
    {
      title: "聴解",
      blurb: "リスニング · 4問（＋準備・クリップ）",
      items: [
        listeningIntro,
        mc(
          "jn5-full-l-1",
          "（聴解スタイル）店員「いちまんえんになります。」いちばん近いのは？",
          ["The total is 10,000 yen.", "It is free.", "Discount 10%.", "Closed."],
          0,
          "",
        ),
        mc(
          "jn5-full-l-2",
          "（聴解スタイル）「もうすこしやすいのはありますか。」きいているのは？",
          ["Asking if something cheaper is available.", "Asking for directions.", "Complaining about staff.", "Ordering dessert."],
          0,
          "",
        ),
        mc(
          "jn5-full-l-3",
          "（聴解スタイル）「きょうしつでケータイをつかわないでください。」意味は？",
          ["Do not use phones in the classroom.", "Please call the teacher.", "Phones are required.", "Open the window."],
          0,
          "",
        ),
        mc(
          "jn5-full-l-4",
          "（聴解スタイル）「えきはこちらですか。」場面は？",
          ["Asking if the station is this way.", "Buying a ticket.", "Announcing delay.", "Hotel check-in."],
          0,
          "",
        ),
      ],
    },
  ],
};
