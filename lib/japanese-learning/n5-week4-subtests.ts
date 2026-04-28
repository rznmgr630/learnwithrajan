/**
 * Week 4 · Days 22–28 · Minna L22–L25 + sprint · five JLPT-style papers (distinct sets).
 */

import type { JapaneseWeeklySubTest, JapaneseWeeklyTestItem } from "@/lib/japanese-learning/types";
import {
  buildJlptFivePaperWeek,
  listeningIntroEmbedded,
  type McqPoolRow,
} from "@/lib/japanese-learning/n5-subtest-shared";

const VOCAB_BLOCKS: McqPoolRow[][] = [
  [
    ["「留学生」の読みは？", ["りゅうがくせい", "りゅうこくせい", "りょうがくせい", "りゅうがくじょう"], 0, ""],
    ["「時」（～とき）の意味に近いのは？", ["when / at the time that", "because", "although", "if only"], 0, ""],
    ["「もし」のニュアンスは？", ["if (hypothesis)", "because", "after", "never"], 0, ""],
    ["「場合」の読みは？", ["ばあい", "ばあいい", "じょうきょう", "じき"], 0, ""],
    ["「予約」の読みは？", ["よやく", "よやくう", "よやくん", "よやくし"], 0, ""],
  ],
  [
    ["「連絡する」の意味は？", ["to contact / get in touch", "to cook", "to drive only", "to forget"], 0, ""],
    ["「空港」の読みは？", ["くうこう", "くうきょう", "くうこ", "くうこく"], 0, ""],
    ["「荷物」の読みは？", ["にもつ", "にもち", "にもず", "にもく"], 0, ""],
    ["「届く」と「届ける」で正しいのは？", ["届く＝arrive; 届ける＝deliver", "same meaning", "both mean eat", "both mean sleep"], 0, ""],
    ["「運転する」の意味は？", ["to drive", "to swim", "to sing only", "to sleep"], 0, ""],
  ],
  [
    ["「〜ほうがいい」のニュアンスは？", ["had better / it would be better to", "must not ever", "never mind", "only past"], 0, ""],
    ["「無料」の意味は？", ["free of charge", "heavy", "broken", "slow"], 0, ""],
    ["「込む」（電車が〜）のイメージは？", ["crowded", "empty", "fast only", "late only"], 0, ""],
    ["「遅れる」の反対の動きに近いのは？", ["はやくつく", "おくれる", "ねる", "かう"], 0, ""],
    ["「招待」の読みは？", ["しょうたい", "しょうだい", "しょうたいい", "じょうたい"], 0, ""],
  ],
  [
    ["「準備」の読みは？", ["じゅんび", "じゅんぴ", "すんび", "じゅんびょう"], 0, ""],
    ["「説明」の読みは？", ["せつめい", "せつび", "せつみょう", "せつめん"], 0, ""],
    ["「返事」の読みは？", ["へんじ", "へんし", "へんじつ", "へんみ"], 0, ""],
    ["「忘れ物」の場面は？", ["left something behind", "bought too much", "lost passport forever", "won lottery"], 0, ""],
    ["「送別会」のイメージは？", ["farewell party", "birthday only", "wedding only", "exam"], 0, ""],
  ],
  [
    ["「留守」の意味に近いのは？", ["not at home / away", "always home", "kitchen", "library"], 0, ""],
    ["「冷蔵庫」の意味は？", ["refrigerator", "elevator", "station", "ticket"], 0, ""],
    ["「引っ越す」の意味は？", ["to move (house)", "to pull rope only", "to quit job only", "to swim"], 0, ""],
    ["「散らかっている」のイメージは？", ["messy / scattered", "very clean", "empty room", "quiet"], 0, ""],
    ["「片づける」の意味は？", ["to tidy up", "to break", "to forget", "to rain"], 0, ""],
  ],
];

const GRAMMAR_BLOCKS: McqPoolRow[][] = [
  [
    ["にほんへ（　）とき、パスポートがひつようです。", ["いく", "いった", "いって", "いき"], 0, "いくとき."],
    ["あめが（　）、うちでゆっくりします。", ["ふったら", "ふると", "ふって", "ふらないと"], 0, "たら."],
    ["ともだちにケーキを（　）。「私が相手にあげる」", ["つくってあげました", "つくってもらいました", "つくってくれました", "つくられました"], 0, ""],
    ["これはわたしが（　）ほんです。", ["よんだ", "よみます", "よんで", "よむ"], 0, "連体修飾."],
    ["でんしゃに（　）まえにチケットをかいます。", ["のる", "のって", "のった", "のり"], 0, "のるまえに."],
    ["もしあしたあめが（　）、いえにいます。", ["ふったら", "ふるなら", "ふって", "ふらない"], 0, ""],
  ],
  [
    ["かぞくが（　）とき、パーティーします。", ["くる", "きた", "きて", "こない"], 0, "くるとき."],
    ["びょうきの（　）、がっこうをやすみました。", ["とき", "あと", "まえ", "うえ"], 0, ""],
    ["せんせいにレポートを（　）。「提出する」", ["わたしました", "もらいました", "くれました", "あげました"], 0, "わたす／だす."],
    ["これはわたしが（　）しゃしんです。", ["とった", "とります", "とって", "とる"], 0, ""],
    ["えきへ（　）みちをしつもんしました。", ["いく", "いった", "いって", "いき"], 0, "いくみち."],
    ["えきに（　）ら、バスをおります。", ["ついた", "つく", "ついて", "つき"], 0, "ついたら."],
  ],
  [
    ["パーティーに（　）びょうきになりました。", ["いくまえに", "いったあとで", "いくとき", "いけば"], 1, "あとで."],
    ["にもつが（　）までまちます。", ["とどく", "とどける", "とどけて", "とどいた"], 0, ""],
    ["ともだちがケーキを（　）。「友だちが私のために」", ["つくってくれました", "つくってあげました", "つくってもらいました", "つくりました"], 0, ""],
    ["これはさきほど（　）メールです。", ["きた", "くる", "きます", "きて"], 0, "きた modifying noun."],
    ["あめが（　）も、でかけます。", ["ふって", "ふったら", "ふると", "ふらない"], 0, "ても."],
    ["じこが（　）、そうだんしてください。", ["あったら", "あると", "あって", "あった"], 0, ""],
  ],
  [
    ["にほんに（　）ばあい、ビザがひつようです。", ["いく", "いった", "いって", "いき"], 0, "いくばあい."],
    ["このボタンを（　）とドアがあきます。", ["おす", "おして", "おした", "おさない"], 0, "おすと."],
    ["わたしはちちにばいくを（　）。「私がもらう」", ["かってもらいました", "かってあげました", "かってくれました", "かいました"], 0, ""],
    ["テストが（　）、うれしいです。", ["おわったら", "おわると", "おわって", "おわらない"], 0, ""],
    ["そらみちが（　）、ちゅういしてください。", ["きけんな", "きけんに", "きけんだ", "きけん"], 0, ""],
    ["けさはそうじを（　）から、そうじきをつかいました。", ["おわって", "おわった", "おわる", "おわらない"], 0, ""],
  ],
  [
    ["ともだちがわたしのへやを（　）。「友だちが私のために」", ["そうじしてくれました", "そうじしてあげました", "そうじしてもらいました", "そうじしました"], 0, ""],
    ["えいがを（　）あとでネタバレします。", ["みた", "みる", "みて", "みます"], 0, "みたあとで."],
    ["あしたはやすみです。でもあめが（　）、いえでべんきょうします。", ["ふったら", "ふると", "ふって", "ふらない"], 0, ""],
    ["これはせんせいが（　）ほんです。", ["おすすめした", "おすすめする", "おすすめして", "おすすめします"], 0, ""],
    ["パソコンが（　）、みせにもちこみます。", ["こわれたら", "こわれると", "こわれて", "こわれた"], 0, ""],
    ["バスに（　）、カードをタッチしてください。", ["のるとき", "のったとき", "のってとき", "のりとき"], 0, ""],
  ],
];

const READING_BLOCKS: McqPoolRow[][] = [
  [
    ["【文】あしたはやすみです。でもあめがふったら、いえでべんきょうします。\nあしたよくあるのは？", ["休みだが雨なら家で勉強。", "必ず外へ。", "雨なら永久中止。", "勉強自体が嫌い。"], 0, ""],
    ["【文】にほんへいくときはパスポートがひつようです。\nパスポートは？", ["出国・来日などで必要な場合がある。", "いらない。", "駅だけ。", "コンビニだけ。"], 0, ""],
    ["【文】ともだちがわたしのためにケーキをつくってくれました。\nケーキは？", ["Friend made cake for the speaker.", "Speaker made for friend.", "Bought at store only.", "Cancelled."], 0, ""],
    ["【文】これはわたしがきのうよんだほんです。\nほんは？", ["Speaker read it yesterday.", "Speaker will read tomorrow.", "Teacher's book only.", "Unread."], 0, ""],
    ["【文】もしじかんがあったら、レストランへいきます。\nいくのは？", ["If there's time — go to restaurant.", "Never go.", "Always busy.", "Only breakfast."], 0, ""],
  ],
  [
    ["【文】でんしゃがおくれたのでタクシーにのりました。\n理由は？", ["Train late — took taxi.", "Train early.", "No money.", "Walking."], 0, ""],
    ["【文】びょうきのときはがっこうをやすみました。\nやすみは？", ["When sick — absent.", "Always absent.", "Never absent.", "Teacher absent only."], 0, ""],
    ["【文】にもつがとどくまでいえでまちます。\n行動は？", ["Wait home until package arrives.", "Go out immediately.", "Cancel order.", "Forget."], 0, ""],
    ["【文】ちちにくるまをかってもらいました。\nだれがあげた？", ["Someone gave/bought car for speaker (father involved).", "Speaker bought for father only.", "Stranger free.", "Rented bike."], 0, ""],
    ["【文】このみちはよるはきけんです。\n注意は？", ["Dangerous at night.", "Safe always.", "Closed forever.", "River."], 0, ""],
  ],
  [
    ["【文】パーティーのあとでへやをそうじしました。\n順番は？", ["Party then cleaning.", "Clean before party.", "No party.", "Only shop."], 0, ""],
    ["【文】わたしはそらみちをあるくのがすきです。\n内容は？", ["Likes walking mountain paths.", "Hates walking.", "Only drives.", "Never outdoors."], 0, ""],
    ["【文】このホテルはよやくがひつようです。\nホテルは？", ["Reservation required.", "Walk-in only.", "Free.", "Closed."], 0, ""],
    ["【文】えきのアナウンスで「のりおくれにごちゅうい」。筆者へのアドバイスは？", ["Don't miss train.", "Leave luggage.", "Train cancelled.", "Buy candy."], 0, ""],
    ["【文】あめがふってもかさをわすれました。\n状況は？", ["Rain — forgot umbrella.", "Sunny.", "Has umbrella.", "Stayed home."], 0, ""],
  ],
  [
    ["【文】ともだちがわたしのへやをそうじしてくれました。\nソウジは？", ["Friend cleaned speaker's room for them.", "Speaker cleaned friend's.", "Paid cleaner.", "Messier."], 0, ""],
    ["【文】このケーキはわたしがつくったものです。\nケーキは？", ["Speaker made it.", "Store bought.", "Teacher made.", "Frozen only."], 0, ""],
    ["【文】じこがあったらすぐにけいさつにれんらくしてください。\n指示は？", ["If accident — contact police.", "Ignore.", "Run away only.", "Post online."], 0, ""],
    ["【文】きょうはくうきょうへこんなかです。\n空港は？", ["Crowded today.", "Empty.", "Closed.", "Only cargo."], 0, ""],
    ["【文】バスはこのえきまえにとまります。\nバスは？", ["Stops in front of station.", "Express no stops.", "Wrong city.", "Airport only."], 0, ""],
  ],
  [
    ["【文】メールをおくったあとでわすれものにきづきました。\nメールは？", ["Sent mail — then noticed forgotten item.", "Never sent.", "Deleted.", "Spam."], 0, ""],
    ["【文】よていがかわったのでともだちにれんらくしました。\n理由は？", ["Plan changed — contacted friend.", "No change.", "Lost phone.", "Forgot friend."], 0, ""],
    ["【文】このみちはつうきんじかんがながいです。\nみちは？", ["Commute time long on this route.", "Short always.", "No road.", "Only bike."], 0, ""],
    ["【文】パソコンがこわれたのでみせにもちこみました。\nPCは？", ["Broken — brought to shop.", "New.", "Left at cafe.", "Gift."], 0, ""],
    ["【文】もしあしたはれだったらピクニックにいきます。\n条件は？", ["If sunny tomorrow — picnic.", "Always rain.", "Never picnic.", "Night picnic."], 0, ""],
  ],
];

const LISTENING_MCQ_BLOCKS: McqPoolRow[][] = [
  [
    ["（聴解）アナウンス「のりおくれにごちゅういください。」近い意味は？", ["Mind missing your train.", "Leave luggage on platform.", "Train cancelled.", "Buy bento."], 0, ""],
    ["（聴解）「いったときにまたきてください。」場面は？", ["Come again when you visit next time.", "Never return.", "Wrong shop.", "Exam."], 0, ""],
    ["（聴解）「にもつがとどきました。」あとで？", ["Package arrived.", "Package lost forever.", "Never ordered.", "Returned empty."], 0, ""],
    ["（聴解）「もしあしたあめだったら…」話し手は？", ["Hypothesizing about tomorrow's rain.", "Sure sunny.", "Talking past.", "Weather forecast ended."], 0, ""],
  ],
  [
    ["（聴解）「えきまえでバスをまちます。」行動は？", ["Wait for bus in front of station.", "Fly.", "Swim.", "Sleep."], 0, ""],
    ["（聴解）「わたしがつくったケーキです。」だれがつくった？", ["Speaker made cake.", "Friend forced.", "Shop only.", "Teacher."], 0, ""],
    ["（聴解）「かぞくがくるからそうじします。」理由は？", ["Cleaning because family comes.", "Cleaning after they leave.", "No visitors.", "Party cancelled."], 0, ""],
    ["（聴解）「よやくはいっぱいです。」レストランは？", ["Fully booked.", "Empty.", "Cheap.", "Open 24h."], 0, ""],
  ],
  [
    ["（聴解）「てつだってくれてありがとう。」場面は？", ["Thanking someone for helping.", "Refusing help.", "Asking price.", "Complaining."], 0, ""],
    ["（聴解）「このほんはわたしがよんだほんです。」について？", ["Book speaker read.", "Book unread.", "Library rule.", "Teacher's only."], 0, ""],
    ["（聴解）「くうこうへはこのバスでいけますか。」きいているのは？", ["Asking if bus goes to airport.", "Buying plane.", "Flight delay.", "Hotel."], 0, ""],
    ["（聴解）「じこがあったらけいさつにでんわしてください。」指示は？", ["If accident — call police.", "Ignore.", "Run.", "Selfie."], 0, ""],
  ],
  [
    ["（聴解）「あめがふったらいえにいましょう。」提案は？", ["If rain — stay home.", "Always go out.", "Never rain.", "Swim."], 0, ""],
    ["（聴解）「ともだちにえいがのチケットをもらいました。」だれがもらった？", ["Speaker received tickets from friend.", "Speaker gave tickets.", "Stranger paid.", "Lost tickets."], 0, ""],
    ["（聴解）「このみちはよるはあぶないです。」注意は？", ["Dangerous at night.", "Safe.", "Closed.", "Highway only."], 0, ""],
    ["（聴解）「パーティーのじゅんびをてつだってくれませんか。」依頼は？", ["Ask help preparing party.", "Cancel party.", "Buy cake only.", "Leave early."], 0, ""],
  ],
  [
    ["（聴解）「にもつをおくっておきました。」意味は？", ["Sent luggage ahead / shipped.", "Forgot luggage.", "Broke luggage.", "Lost key."], 0, ""],
    ["（聴解）「でんしゃがおくれています。」状況は？", ["Train delayed.", "Train early.", "No train.", "Express."], 0, ""],
    ["（聴解）「ちちにくるまをかってもらいました。」イメージは？", ["Got father to buy car / father bought for speaker.", "Bought for father.", "Stole car.", "Rent."], 0, ""],
    ["（聴解）「このへやはわたしがそうじしたへやです。」そうじは？", ["Speaker cleaned the room.", "Room never cleaned.", "Cleaner only.", "Messy."], 0, ""],
  ],
];

function listeningIntroW4(testNum: number, tid: string): JapaneseWeeklyTestItem {
  const lessons = [22, 23, 24, 25];
  const a = lessons[(testNum - 1) % 4];
  const b = lessons[testNum % 4];
  return listeningIntroEmbedded(
    `${tid}-l-intro`,
    "聴解（Week 4）：とき／ばあい／たら／てあげる・くれる・もらう／連体修飾を意識してください。Minna L22–L25 とスプリント聴解。",
    "クリップを一度聞いてから、聴解四問に答えてください。",
    [a, b, 25],
    27,
  );
}

export function buildWeek4SubTests(): JapaneseWeeklySubTest[] {
  return buildJlptFivePaperWeek({
    weekPrefix: "jn5-w4",
    vocabBlocks: VOCAB_BLOCKS,
    grammarBlocks: GRAMMAR_BLOCKS,
    readingBlocks: READING_BLOCKS,
    listeningMcqBlocks: LISTENING_MCQ_BLOCKS,
    listeningIntroForTest: listeningIntroW4,
    paperSubtitle: {
      en: "JLPT N5-style · 20 questions · Minna Lessons 22–25 · Days 22–28",
      np: "JLPT N5 शैली · २० प्रश्न · मिन्ना पाठ २२–२५ · दिन २२–२८",
      jp: "JLPT N5形式 · 20問 · 第22–25課 · Day 22–28",
    },
    paperIntro:
      "Week 4 の五つのペーパーは別問題です。とき・ばあい・たら・もし・授受（あげる／くれる／もらう）・名詞を修飾する節を確認します。",
  });
}
