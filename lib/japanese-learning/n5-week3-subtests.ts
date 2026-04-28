/**
 * Week 3 · Days 15–21 · Minna L15–L21 · five JLPT-style papers.
 */

import type { JapaneseWeeklySubTest, JapaneseWeeklyTestItem } from "@/lib/japanese-learning/types";
import {
  buildJlptFivePaperWeek,
  listeningIntroEmbedded,
  type McqPoolRow,
} from "@/lib/japanese-learning/n5-subtest-shared";

const VOCAB_BLOCKS: McqPoolRow[][] = [
  [
    ["「禁止」の読みは？", ["きんし", "きんじ", "きし", "きんい"], 0, ""],
    ["「たばこ」の意味は？", ["tobacco / cigarette", "sugar", "table", "bag"], 0, ""],
    ["「きけん」の漢字として多いのは？", ["危険", "帰建", "期限", "喜剣"], 0, ""],
    ["「めいれい」の意味に近いのは？", ["order / command (noun sense)", "name", "mail", "meeting"], 0, ""],
    ["「そうじする」は何の動作？", ["cleaning", "cooking", "driving", "swimming"], 0, ""],
  ],
  [
    ["「けいけん（経験）」の読みは？", ["けいけん", "けいげん", "けんけん", "げいけん"], 0, ""],
    ["「～たことがあります」は何を表す？", ["past experience", "future plan", "obligation", "prohibition"], 0, ""],
    ["「おもう」の基本の意味は？", ["think / feel", "run", "buy", "sleep"], 0, ""],
    ["「という」の用法として多いのは？", ["quotation / called / content clause", "only time", "only place", "never N5"], 0, ""],
    ["「じゆう」の意味は？", ["freedom / free time nuance", "ten", "heavy", "weak"], 0, ""],
  ],
  [
    ["「ルール」のカタカナとして自然なのは？", ["ルール", "レール", "ロール", "リール"], 0, ""],
    ["「マーク」の場面として多いのは？", ["symbol / sign / label", "market only", "mask only", "park"], 0, ""],
    ["「～なくてもいいです」は？", ["don't have to", "must not", "please do", "cannot"], 0, ""],
    ["「～なければなりません」は？", ["must / have to", "may", "want", "like"], 0, ""],
    ["「メモ」の意味は？", ["memo / note", "memo pad brand only", "metal", "melon"], 0, ""],
  ],
  [
    ["「あんない」の意味は？", ["guidance / information desk sense", "darkness", "answer", "case"], 0, ""],
    ["「せつめい」の意味は？", ["explanation", "section", "promise", "seminar"], 0, ""],
    ["「れんしゅう」の意味は？", ["practice", "lecture", "license", "rent"], 0, ""],
    ["「テスト」の前によくするのは？", ["べんきょうする", "ねるだけ", "たべない", "さんぽしない"], 0, ""],
    ["「しけん」と「テスト」の語感の違いとして近いのは？", ["Both can mean exam in learner contexts", "never overlap", "only しけん is English", "only テスト is formal"], 0, ""],
  ],
  [
    ["「けんこう」の意味は？", ["health", "study", "ticket", "building"], 0, ""],
    ["「やくそく」の意味は？", ["promise / appointment", "medicine", "role", "speed"], 0, ""],
    ["「やめる」の意味は？", ["stop / quit", "start", "run", "buy"], 0, ""],
    ["「つぎ」の意味は？", ["next", "last", "always", "never"], 0, ""],
    ["「じかんわり」のイメージは？", ["timetable / schedule grid", "clock shop", "time machine", "hourglass only"], 0, ""],
  ],
];

const GRAMMAR_BLOCKS: McqPoolRow[][] = [
  [
    ["ここではタバコを（　）。", ["すってはいけません", "すってもいいです", "すってください", "すわってください"], 0, ""],
    ["じしょを（　）もいいです。", ["つかって", "つかいます", "つかっては", "つかわなくて"], 0, ""],
    ["シャワーを（　）、ねます。", ["あびてから", "あびて", "あびるから", "あびましたから"], 0, ""],
    ["あしたはあめが（　）とおもいます。", ["ふる", "ふった", "ふって", "ふらない"], 0, ""],
    ["にほんごを（　）ことができます。", ["はなす", "はなします", "はなして", "はなした"], 0, ""],
    ["パーティーには（　）もいいです。", ["こなくて", "こないで", "こない", "こなかった"], 0, "こなくてもいい."],
  ],
  [
    ["けいたいを（　）いけません。", ["みては", "みても", "みる", "みた"], 0, "みてはいけません。"],
    ["こうえんであそんでも（　）。", ["いいです", "だめです", "いけません", "ありません"], 0, ""],
    ["きょうはやすんでも（　）。", ["いいです", "だめです", "いけません", "ありません"], 0, "やすんでもいい."],
    ["レポートを（　）なければなりません。", ["ださ", "だします", "だして", "だした"], 0, ""],
    ["だれにも（　）なくてもいいです。", ["いわなくて", "いわないで", "いわなく", "いわない"], 0, ""],
    ["このドアを（　）ください。", ["あけないで", "あけて", "あけます", "あけた"], 0, "あけないでください."],
  ],
  [
    ["にほんへいったことが（　）。", ["あります", "います", "です", "ます"], 0, ""],
    ["スキーをしたことが（　）。", ["ありません", "いません", "ません", "です"], 0, ""],
    ["わたしはこれがだいすきだと（　）。", ["おもいます", "おもうます", "おもってます", "おもった"], 0, ""],
    ["あしたははれるだろうと（　）。", ["おもいます", "おもうます", "おもってます", "おもっています"], 0, ""],
    ["スキーを（　）ことがあります。", ["した", "します", "して", "する"], 0, "したことがある."],
    ["せんせいはテストがむずかしいと（　）。", ["おっしゃっていました", "おっしゃいました", "おっしゃってました", "おっしゃりました"], 0, ""],
  ],
  [
    ["えいがをみたあとで（　）。", ["ねました", "ねます", "ねる", "ねて"], 0, ""],
    ["べんきょうしてから（　）。", ["ねます", "ねました", "ねる", "ねて"], 0, ""],
    ["コーヒーをのむまえに（　）。", ["パンをたべます", "パンをたべました", "パンをたべて", "パンをたべる"], 0, ""],
    ["パソコンを（　）なくてはいけません。", ["つかわ", "つかい", "つかって", "つかった"], 0, ""],
    ["きょうはつかれているので、はやく（　）。", ["ねます", "ねました", "ねて", "ねる"], 0, ""],
    ["このへやではしゃべっては（　）。", ["いけません", "いいです", "ありません", "です"], 0, ""],
  ],
  [
    ["そうじが（　）から、やすみます。", ["おわった", "おわって", "おわります", "おわる"], 0, ""],
    ["メールを（　）から、でかけます。", ["おくって", "おくります", "おくった", "おくる"], 0, ""],
    ["ケーキを（　）ことがあります。", ["つくった", "つくります", "つくって", "つくる"], 0, ""],
    ["そらみちがきけんですから（　）。", ["ちゅういしてください", "ちゅういします", "ちゅういして", "ちゅういした"], 0, ""],
    ["わたしはそれがだいじだと（　）。", ["おもいます", "おもうます", "おもってます", "おもった"], 0, ""],
    ["きょうはテストがありませんから（　）。", ["あんしんです", "あんしんしました", "あんしんします", "あんしんして"], 0, ""],
  ],
];

const READING_BLOCKS: McqPoolRow[][] = [
  [
    ["【文】せんせいはがくせいに「きょうしつではケータイをつかわないでください」と言いました。\nルールは？", ["No phones in classroom.", "Phones OK.", "Only calls.", "Only games."], 0, ""],
    ["【文】わたしはにほんへいったことがあります。おおさかへいきました。\n経験は？", ["Has been to Japan — Osaka.", "Never left country.", "Only dreams.", "Only map."], 0, ""],
    ["【文】きょうはつかれているので、はやくねます。\nきょうは？", ["Tired — will sleep early.", "Will party.", "Will run.", "Will cook."], 0, ""],
    ["【文】このみちはきけんです。ちゅういしてください。\n文書の目的は？", ["Warn danger — be careful.", "Invite climb.", "Sell tickets.", "Close road forever."], 0, ""],
    ["【文】わたしはけんこうのためにさんぽします。\n目的は？", ["Health — walks.", "Shopping.", "English study.", "Driving."], 0, ""],
  ],
  [
    ["【文】パーティーのあとでそうじします。\nあとでするのは？", ["Clean after party.", "Cook before party.", "Cancel party.", "Sleep only."], 0, ""],
    ["【文】わたしはじぶんでケーキをつくったことがあります。\n経験は？", ["Has made cake before.", "Never cooks.", "Professional baker.", "Allergic."], 0, ""],
    ["【文】せんせいはテストがかんたんだとおもっています。\nせんせいの考えは？", ["Teacher thinks test is easy.", "Teacher thinks impossible.", "Students agree.", "No test."], 0, ""],
    ["【文】きょうはじゆうじかんがあります。びょうきなのでやすみます。\nきょうは？", ["Free time — resting sick.", "Working overtime.", "Travelling.", "Exam."], 0, ""],
    ["【文】ここではけいたいをみてはいけません。\n禁止されているのは？", ["Looking at phone screen.", "Reading book.", "Writing notes.", "Drinking water."], 0, ""],
  ],
  [
    ["【文】わたしはおおさかじゃなくてとうきょうへいきました。\nいった場所は？", ["Tokyo (not Osaka).", "Osaka only.", "Kyoto.", "Nara."], 0, ""],
    ["【文】メールをおくってからでかけます。\n順番は？", ["Send mail then leave.", "Leave then mail.", "Never mail.", "Delete mail."], 0, ""],
    ["【文】わたしはあめがすきだとおもいます。\n内容は？", ["Speaker thinks they like rain.", "Hates rain.", "Weather forecast.", "Umbrella sale."], 0, ""],
    ["【文】このルールはやさしいです。でもまもることがむずかしいです。\nルールは？", ["Easy wording — hard to obey.", "Impossible text.", "No rule.", "Only for kids."], 0, ""],
    ["【文】けんこうのためにタバコをやめます。\nするのは？", ["Quit smoking for health.", "Start smoking.", "Buy cigarettes.", "Sell lighter."], 0, ""],
  ],
  [
    ["【文】わたしはそうじがきらいです。でもきょうはします。\n態度は？", ["Dislikes cleaning — doing today.", "Loves cleaning.", "Never cleans.", "Professional cleaner."], 0, ""],
    ["【文】テストのあとでレポートをださなければなりません。\n義務は？", ["Must submit report after test.", "Optional.", "Before test.", "Never submit."], 0, ""],
    ["【文】せんせいはがくせいにやくそくをまもってほしいと言いました。\nせんせいは？", ["Wants students to keep promises.", "Cancel promises.", "Forget rules.", "Leave school."], 0, ""],
    ["【文】わたしはまだにほんごがじょうずじゃないとおもいます。\n自己評価は？", ["Thinks Japanese not skilled yet.", "Fluent.", "Native.", "Never studied."], 0, ""],
    ["【文】きょうはじかんがありません。だからメモをかきます。\n行動は？", ["No time — takes notes.", "Free day.", "Sleep.", "Travel."], 0, ""],
  ],
  [
    ["【文】このビルではタバコをすってはいけません。\n場所は？", ["No smoking in building.", "Smoking zone.", "Only outside Japan.", "Always OK."], 0, ""],
    ["【文】わたしはパーティーにいくことができませんでした。\n結果は？", ["Could not go to party.", "Went happily.", "Hosted party.", "Forgot party."], 0, ""],
    ["【文】びょうきなのでレポートをだしません。\n理由は？", ["Sick — won't submit.", "Lazy.", "Submitted early.", "Lost report."], 0, ""],
    ["【文】せんせいはテストがむずかしいとおもっています。\nテストは？", ["Teacher finds test difficult.", "Teacher finds easy.", "No test.", "Students wrote test."], 0, ""],
    ["【文】わたしはやくそくをわすれました。ごめんなさいと言いました。\n状況は？", ["Forgot promise — apologized.", "Kept promise.", "Never promised.", "Angry friend."], 0, ""],
  ],
];

const LISTENING_MCQ_BLOCKS: McqPoolRow[][] = [
  [
    ["（聴解）「ここではタバコをすってはいけません。」禁止は？", ["No smoking here.", "Sit here.", "Buy tobacco.", "Wash hands."], 0, ""],
    ["（聴解）「じしょをつかってもいいです。」許可は？", ["Dictionary OK.", "Phone OK.", "Food OK.", "Music OK."], 0, ""],
    ["（聴解）「パーティーのあとでそうじします。」あとで？", ["Clean after party.", "Party before clean.", "No party.", "Only dance."], 0, ""],
    ["（聴解）「あしたはあめがふるとおもいます。」内容は？", ["Think it will rain tomorrow.", "Sure sunny.", "Snow.", "Typhoon ended."], 0, ""],
  ],
  [
    ["（聴解）「テストはむずかしくなかったです。」感想は？", ["Test was not difficult.", "Test impossible.", "No test.", "Skipped."], 0, ""],
    ["（聴解）「けんこうのためにあるきます。」理由は？", ["For health — walk.", "For money.", "For friend.", "For exam."], 0, ""],
    ["（聴解）「メールをおくってください。」依頼は？", ["Please send mail.", "Please delete.", "Please print.", "Please ignore."], 0, ""],
    ["（聴解）「やくそくをまもってください。」意味は？", ["Keep your promise.", "Break promise.", "Forget name.", "Buy gift."], 0, ""],
  ],
  [
    ["（聴解）「にほんへいったことがありますか。」質問は？", ["Ask past experience of visiting Japan.", "Ask height.", "Ask age.", "Ask salary."], 0, ""],
    ["（聴解）「そうじがおわりました。」あとで？", ["Cleaning finished.", "Cleaning started.", "No cleaning.", "Lost keys."], 0, ""],
    ["（聴解）「きょうはやすんでいいです。」許可は？", ["May rest today.", "Must work.", "Must run.", "Must cook."], 0, ""],
    ["（聴解）「レポートをださなければなりません。」義務は？", ["Must submit report.", "May skip.", "Never submit.", "Burn report."], 0, ""],
  ],
  [
    ["（聴解）「わたしはそれがだいじだとおもいます。」内容は？", ["Speaker thinks it matters.", "Speaker ignores.", "Speaker forgot.", "Speaker jokes."], 0, ""],
    ["（聴解）「みちがきけんです。」注意は？", ["Road dangerous.", "Road closed forever.", "Road free.", "Road fast."], 0, ""],
    ["（聴解）「けいたいをみないでください。」依頼は？", ["Don't look at phone.", "Look at menu.", "Buy phone.", "Charge phone."], 0, ""],
    ["（聴解）「パーティーにはこなくてもいいです。」意味は？", ["Don't have to come to party.", "Must come.", "Party cancelled.", "Party moved."], 0, ""],
  ],
  [
    ["（聴解）「ビールをのむまえにタバコをやめます。」順番は？", ["Quit smoking before drinking beer.", "Smoke more.", "Only juice.", "Never beer."], 0, ""],
    ["（聴解）「せんせいはテストがかんたんだと言いました。」せんせいは？", ["Teacher said test is easy.", "Teacher said impossible.", "No teacher.", "No test."], 0, ""],
    ["（聴解）「そらみちがきけんですからゆっくりあるいてください。」注意は？", ["Mountain path dangerous — walk slowly.", "Run.", "Fly.", "Swim."], 0, ""],
    ["（聴解）「わたしはおおさかへいったことがありません。」経験は？", ["Never been to Osaka.", "Often visits Osaka.", "Lives in Osaka.", "Osaka born."], 0, ""],
  ],
];

function listeningIntroW3(testNum: number, tid: string): JapaneseWeeklyTestItem {
  const a = Math.min(21, 15 + testNum);
  const b = Math.min(21, 17 + testNum);
  return listeningIntroEmbedded(
    `${tid}-l-intro`,
    "聴解（Week 3）：許可・禁止・義務・経験・意見（とおもう）を意識してください。Minna L15–L21。",
    "クリップを一度聞いてから答えてください。",
    [a, b, 21],
    undefined,
  );
}

export function buildWeek3SubTests(): JapaneseWeeklySubTest[] {
  return buildJlptFivePaperWeek({
    weekPrefix: "jn5-w3",
    vocabBlocks: VOCAB_BLOCKS,
    grammarBlocks: GRAMMAR_BLOCKS,
    readingBlocks: READING_BLOCKS,
    listeningMcqBlocks: LISTENING_MCQ_BLOCKS,
    listeningIntroForTest: listeningIntroW3,
    paperSubtitle: {
      en: "JLPT N5-style · 20 questions · Minna Lessons 15–21 · Days 15–21",
      np: "JLPT N5 शैली · २० प्रश्न · मिन्ना पाठ १५–२१ · दिन १५–२१",
      jp: "JLPT N5形式 · 20問 · 第15–21課 · Day 15–21",
    },
    paperIntro:
      "Week 3 の五つのペーパーは別問題です。禁止・許可・なくてもいい・なければならない・経験・引用のとおもう を練習します。",
  });
}
