/**
 * Week 1 · Days 1–7 · Minna L1–L7 · five JLPT-style papers (distinct question sets).
 */

import type { JapaneseWeeklySubTest, JapaneseWeeklyTestItem } from "@/lib/japanese-learning/types";
import {
  buildJlptFivePaperWeek,
  listeningIntroEmbedded,
  type McqPoolRow,
} from "@/lib/japanese-learning/n5-subtest-shared";

const VOCAB_BLOCKS: McqPoolRow[][] = [
  [
    ["「はじめまして」の場面として正しいのは？", ["First meeting someone", "Saying goodbye forever", "Ordering food", "Asking the time"], 0, ""],
    ["「これ」の意味は？", ["this one (near me)", "that one (near you)", "that over there", "which"], 0, ""],
    ["「いくらですか。」で聞いているのは？", ["price", "time", "place", "name"], 0, ""],
    ["「あります」は何を表す？", ["Inanimate existence", "Animate existence", "Ability", "Past tense"], 0, ""],
    ["「ゼロ」の読みとして自然なのは？", ["れい", "ぜろ", "まる", "いち"], 1, ""],
  ],
  [
    ["「わたし」のひらがなは？", ["わたし", "わたくし", "ぼく", "おれ"], 0, ""],
    ["「せんせい」の意味に近いのは？", ["teacher", "student", "doctor only", "friend"], 0, ""],
    ["「がくせい」の漢字として適切なのは？", ["学生", "学会", "学制", "学科"], 0, ""],
    ["「えん」（お金）をつかう場面は？", ["これはさいしょえんです。", "これはさいしょうです。", "これはさいです。", "これはえんです。"], 0, "円の単位."],
    ["「ひゃくえん」の「ひゃく」は？", ["100", "1000", "10", "10000"], 0, ""],
  ],
  [
    ["「おはようございます」の使用時間帯として自然なのは？", ["Morning", "Midnight only", "Only before sleep", "Never"], 0, ""],
    ["「ありがとう」の意味は？", ["thank you", "sorry", "excuse me", "goodbye"], 0, ""],
    ["「さようなら」は？", ["goodbye", "hello", "please", "thanks"], 0, ""],
    ["「よろしく」の語感として近いのは？", ["nice to work with you / regards", "see you tomorrow", "how much", "where"], 0, ""],
    ["「ちょっと」のニュアンスとして多いのは？", ["a little / somewhat", "always", "never", "only yes"], 0, ""],
  ],
  [
    ["「テーブル」のカタカナは？", ["テーブル", "ターブル", "ティーブル", "トーブル"], 0, ""],
    ["「ノート」の意味は？", ["notebook", "notice", "north", "not"], 0, ""],
    ["「ペン」はどんな語？", ["loanword from English", "pure native Japanese", "only kanji", "only counter"], 0, ""],
    ["「えいご」の意味は？", ["English (language)", "England only", "picture", "movie"], 0, ""],
    ["「にほんご」の意味は？", ["Japanese language", "Japanese person only", "Japan travel", "nihonji"], 0, ""],
  ],
  [
    ["「まいにち」の意味は？", ["every day", "never", "once", "tomorrow"], 0, ""],
    ["「ことば」の意味は？", ["word / language", "person", "country", "food"], 0, ""],
    ["「じこしょうかい」で言う内容として適切なのは？", ["Name, country, job, etc.", "Only prices", "Only weather", "Only kanji"], 0, ""],
    ["「がっこう」の読みは？", ["がっこう", "がくこう", "がっこ", "がくこ"], 0, ""],
    ["「かいだん」の場面は？", ["stairs / conversation stepping topic", "only elevator", "only ticket", "only train"], 0, ""],
  ],
];

const GRAMMAR_BLOCKS: McqPoolRow[][] = [
  [
    ["わたし（　）ミラーです。", ["は", "が", "を", "に"], 0, ""],
    ["これはほん（　）。", ["です", "だ", "ます", "ない"], 0, ""],
    ["つくえのうえ（　）ほんがあります。", ["に", "で", "を", "が"], 0, ""],
    ["きょうしつ（　）だんごがいます。", ["に", "で", "は", "と"], 0, ""],
    ["えいごを（　）べんきょうします。", ["を", "が", "は", "に"], 0, ""],
    ["なんじ（　）いきますか。", ["に", "で", "を", "へ"], 0, ""],
  ],
  [
    ["みずを（　）のみます。", ["を", "が", "は", "に"], 0, ""],
    ["こうえん（　）さんぽします。", ["で", "に", "を", "が"], 0, ""],
    ["バス（　）がっこうへいきます。", ["で", "に", "を", "と"], 0, ""],
    ["ともだち（　）えいがをみます。", ["と", "が", "を", "に"], 0, ""],
    ["ごご（　）ひまです。", ["は", "が", "を", "に"], 0, ""],
    ["おかねが（　）。", ["ありません", "です", "ます", "ないです"], 0, ""],
  ],
  [
    ["みずを（　）ください。", ["のみ", "のんで", "のみます", "のんだ"], 1, "のんでください."],
    ["きょうはあついです。ジュースを（　）。", ["のみます", "のみません", "のみました", "のみ"], 0, ""],
    ["あしたテスト（　）あります。", ["が", "を", "に", "で"], 0, ""],
    ["デパート（　）かいものをします。", ["で", "に", "を", "へ"], 0, ""],
    ["だれ（　）あいましたか。", ["に", "で", "を", "が"], 0, ""],
    ["おなかが（　）から、パンをたべます。", ["すきました", "すいて", "すく", "すき"], 1, ""],
  ],
  [
    ["おとうさん（　）ほんをもらいました。", ["から／に", "を", "が", "で"], 0, ""],
    ["ともだちにケーキを（　）。", ["あげました", "もらいました", "くれました", "いました"], 0, ""],
    ["せんせい（　）えんぴつをかしました。", ["に", "が", "を", "で"], 0, ""],
    ["わたしはプレゼントを（　）。", ["わたしました", "もらいました", "いました", "ありました"], 0, ""],
    ["かれはノートを（　）。「彼があげる」", ["くれました", "もらいました", "あげました", "しました"], 2, ""],
    ["わたしはかれにチョコを（　）。「私があげる」", ["あげました", "もらいました", "くれました", "しました"], 0, ""],
  ],
  [
    ["みじかいじかん（　）べんきょうしました。", ["で", "に", "を", "が"], 0, ""],
    ["このへやはしずか（　）。", ["です", "な", "に", "く"], 0, ""],
    ["そこにいすが（　）。", ["あります", "います", "ありました", "いました"], 0, ""],
    ["ねこがそこに（　）。", ["います", "あります", "です", "ます"], 0, ""],
    ["コーヒーとケーキを（　）。", ["ちゅうもんします", "ちゅうもんして", "ちゅうもんしました", "ちゅうもん"], 0, ""],
    ["レストランでケーキを（　）。", ["たべます", "たべません", "たべました", "たべ"], 0, ""],
  ],
];

const READING_BLOCKS: McqPoolRow[][] = [
  [
    ["【文】きょうはあめです。いえにいます。\nいちばん近い内容は？", ["Staying home because of rain.", "Going swimming.", "Buying a car.", "Flying."], 0, ""],
    ["【文】わたしはにほんごのがくせいです。\n筆者は？", ["Student of Japanese.", "Japanese teacher.", "Driver.", "Chef."], 0, ""],
    ["【文】このほんはやすいです。でもおもいです。\nでものあとで言いたいのは？", ["Contrast — cheap but heavy.", "Cheap and light.", "Free.", "Bad book."], 0, ""],
    ["【文】えきのまえでともだちをまちます。\nどこで？", ["In front of station.", "Inside train.", "Under bridge.", "At airport."], 0, ""],
    ["【文】コーヒーをのみます。ケーキもたべます。\nNote food pairing — question: 筆者は何を飲む？", ["Coffee.", "Water only.", "Tea only.", "Juice only."], 0, ""],
  ],
  [
    ["【文】デパートへいきました。かばんをかいました。\nかったものは？", ["Bag.", "Shoes only.", "Hat only.", "Car."], 0, ""],
    ["【文】きのうはひまでした。テレビをみました。\nきのうは？", ["Had free time — watched TV.", "Worked all day.", "Travelled abroad.", "Studied only."], 0, ""],
    ["【文】このみちはみじかいです。あるいてがっこうへいきます。\nれんしょうとして近いのは？", ["Walk to school — short road.", "Drive only.", "Take plane.", "Swim."], 0, ""],
    ["【文】ともだちとえいがをみました。おもしろかったです。\n感想は？", ["Movie was interesting.", "Movie was boring.", "Did not watch.", "Slept."], 0, ""],
    ["【文】おかあさんにケーキをつくってもらいました。\nだれがつくった？", ["Mother made it (for speaker).", "Speaker made for mother.", "Shop only.", "Nobody."], 0, ""],
  ],
  [
    ["【文】おとうさんはしごとです。ばんごはんはわたしがつくります。\nこんばんのばあい？", ["Speaker cooks dinner.", "Father cooks.", "Eat out only.", "Skip meal."], 0, ""],
    ["【文】このパンはあたらしいです。おいしいです。\nパンは？", ["Fresh and tasty.", "Old.", "Salty only.", "Free."], 0, ""],
    ["【文】あしたはやすみです。でもアルバイトがあります。\nあしたは？", ["Has part-time despite day off label nuance.", "Completely free.", "Exam.", "Trip."], 0, ""],
    ["【文】かさをわすれました。かえります。\nあとですることは？", ["Go back (for umbrella).", "Buy ice cream.", "Run marathon.", "Sleep."], 0, ""],
    ["【文】わたしはメールをおくりました。へんじがありません。\nいまは？", ["Waiting for reply.", "Got reply.", "Will not use mail.", "Deleted account."], 0, ""],
  ],
  [
    ["【文】このノートはやすいです。でもちいさいです。\n内容は？", ["Cheap but small.", "Big.", "Expensive.", "Free gift."], 0, ""],
    ["【文】きょうはかぜです。ねます。\nきょうは？", ["Will sleep — cold.", "Will party.", "Will drive.", "Will cook."], 0, ""],
    ["【文】えきでばすをまちます。ともだちがきます。\nまっているのは？", ["Waiting for friend at station.", "Waiting for train only.", "Selling tickets.", "Lost."], 0, ""],
    ["【文】このペンはあかいです。かわいいです。\nペンは？", ["Red and cute.", "Blue.", "Broken.", "Heavy."], 0, ""],
    ["【文】ばんごはんはパンです。ジュースのみます。\nNote meal — question: 飲むものは？", ["Juice.", "Coffee only.", "Tea only.", "Water only."], 0, ""],
  ],
  [
    ["【文】あしたテストがあります。きょうはよくねます。\nきょうのじゅんびは？", ["Sleep early to prepare.", "Party.", "Travel.", "Skip study."], 0, ""],
    ["【文】このへやはあたたかいです。サッカーをみます。\nへやは？", ["Warm room.", "Cold.", "Outside.", "Dark."], 0, ""],
    ["【文】わたしはプレゼントをあげます。ともだちはうれしいです。\nだれがうれしい？", ["Friend is happy.", "Speaker only.", "Teacher.", "Nobody."], 0, ""],
    ["【文】おみやげをかいます。かぞくにあげます。\nおみやげはだれに？", ["To family.", "To boss only.", "To stranger.", "Keep all."], 0, ""],
    ["【文】このみちはあぶないです。ゆっくりあるきます。\nちゅういしているのは？", ["Dangerous road — walk slowly.", "Safe highway.", "Run.", "Ignore."], 0, ""],
  ],
];

const LISTENING_MCQ_BLOCKS: McqPoolRow[][] = [
  [
    ["（聴解）店員「これはさんびゃくえんです。」意味は？", ["¥300.", "¥3000.", "¥30.", "Free."], 0, ""],
    ["（聴解）「すみません、トイレはどこですか。」場面は？", ["Asking restroom location.", "Buying toilet.", "Cleaning job.", "Hotel checkout."], 0, ""],
    ["（聴解）「いってらっしゃい。」に返すのとして自然なのは？", ["いってきます。", "おかえりなさい。", "おやすみなさい。", "ごちそうさま。"], 0, ""],
    ["（聴解）「このかさはいくらですか。」きいているのは？", ["Umbrella price.", "Umbrella color.", "Owner name.", "Weather forecast."], 0, ""],
  ],
  [
    ["（聴解）「メニューをみせてください。」場面は？", ["Ask to see menu.", "Pay bill.", "Cook food.", "Wash dishes."], 0, ""],
    ["（聴解）「ここではけいたいをつかわないでください。」ルールは？", ["No phones here.", "Phones required.", "Speak loudly.", "Open window."], 0, ""],
    ["（聴解）「バスはじゃまになります。」意味に近いのは？", ["Bus is arriving / coming.", "Bus stopped forever.", "No bus.", "Train only."], 0, ""],
    ["（聴解）「おつりはこちらです。」場面は？", ["Here is your change.", "Here is ticket.", "Discount.", "Refund."], 0, ""],
  ],
  [
    ["（聴解）「きょうはやすみです。」意味は？", ["Today is closed / holiday.", "Today is busy.", "Tomorrow only.", "Never open."], 0, ""],
    ["（聴解）「このみちはとおりません。」意味は？", ["This road doesn't go through.", "Fast road.", "Highway.", "Bridge."], 0, ""],
    ["（聴解）「おねがいします。」場面として多いのは？", ["Request / please.", "Goodbye.", "Angry shout.", "Ignoring."], 0, ""],
    ["（聴解）「かばんをわすれました。」あとでするのは？", ["Forgot bag — need to recover.", "Bought bag.", "Sold bag.", "Threw bag."], 0, ""],
  ],
  [
    ["（聴解）「もうすこしやすくなりますか。」きいているのは？", ["Ask if price can drop.", "Ask weight.", "Ask color.", "Ask name."], 0, ""],
    ["（聴解）「おきゃくさん、こちらへどうぞ。」場面は？", ["Staff guiding customer.", "Friend fight.", "Teacher exam.", "Doctor surgery."], 0, ""],
    ["（聴解）「あしたあめがふります。」天気は？", ["Rain tomorrow.", "Sunny tomorrow.", "Snow tomorrow.", "Wind stops."], 0, ""],
    ["（聴解）「えきはあちらです。」意味は？", ["Station is that way.", "Station closed.", "Station expensive.", "Station food."], 0, ""],
  ],
  [
    ["（聴解）「おさきにどうぞ。」意味は？", ["After you.", "Stop.", "Go faster.", "Pay me."], 0, ""],
    ["（聴解）「みぎにまがってください。」あんないは？", ["Turn right.", "Turn left.", "Go straight forever.", "U-turn."], 0, ""],
    ["（聴解）「このボールペンはひゃくえんです。」値段は？", ["¥100.", "¥1000.", "¥10.", "Free."], 0, ""],
    ["（聴解）「まどをしめてください。」依頼は？", ["Please close the window.", "Open window.", "Break window.", "Buy window."], 0, ""],
  ],
];

function listeningIntroW1(testNum: number, tid: string): JapaneseWeeklyTestItem {
  const a = Math.min(7, testNum + 1);
  const b = Math.min(7, testNum + 3);
  return listeningIntroEmbedded(
    `${tid}-l-intro`,
    "聴解（Week 1）：Minna L1–L7 のあいさつ・数字・場所・あげる／もらうの場面を意識してください。",
    "短いクリップを一度聞き、続く四問に答えてください。",
    [a, b, 7],
    undefined,
  );
}

export function buildWeek1SubTests(): JapaneseWeeklySubTest[] {
  return buildJlptFivePaperWeek({
    weekPrefix: "jn5-w1",
    vocabBlocks: VOCAB_BLOCKS,
    grammarBlocks: GRAMMAR_BLOCKS,
    readingBlocks: READING_BLOCKS,
    listeningMcqBlocks: LISTENING_MCQ_BLOCKS,
    listeningIntroForTest: listeningIntroW1,
    paperSubtitle: {
      en: "JLPT N5-style · 20 questions · Minna Lessons 1–7 · Days 1–7",
      np: "JLPT N5 शैली · २० प्रश्न · मिन्ना पाठ १–७ · दिन १–७",
      jp: "JLPT N5形式 · 20問 · 第1–7課 · Day 1–7",
    },
    paperIntro:
      "Week 1 の五つのペーパーはそれぞれ別の問題セットです（Test 1〜5）。語彙・漢字・文法・読解・聴解の順です。提出後に正答とスコアが表示されます。",
  });
}
