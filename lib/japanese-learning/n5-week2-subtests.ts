/**
 * Week 2 · Days 8–14 · Minna L8–L14 · five JLPT-style papers.
 */

import type { JapaneseWeeklySubTest, JapaneseWeeklyTestItem } from "@/lib/japanese-learning/types";
import {
  buildJlptFivePaperWeek,
  listeningIntroEmbedded,
  type McqPoolRow,
} from "@/lib/japanese-learning/n5-subtest-shared";

const VOCAB_BLOCKS: McqPoolRow[][] = [
  [
    ["「上手」の読みは？", ["じょうず", "じょうし", "うえて", "かみて"], 0, ""],
    ["「下手」の読みは？", ["へた", "した", "へだ", "てか"], 0, ""],
    ["「きれい」な名詞のつなぎは？", ["な", "い", "の", "に"], 0, ""],
    ["「おいしい」の否定（いま）は？", ["おいしくないです", "おいしいないです", "おいしくなかったです", "おいしいじゃないです"], 0, ""],
    ["「～がすきです」の「すき」の意味は？", ["like / fond of", "dislike", "must", "can"], 0, ""],
  ],
  [
    ["「くらい」と「ぐらい」について正しいのは？", ["Both used for approximate degree", "Only くらい exists", "Only for time", "Never in N5"], 0, ""],
    ["「まじめ」の意味に近いのは？", ["serious / diligent", "funny", "lazy", "noisy"], 0, ""],
    ["「げんき」の反対に近いのは？", ["ふげんきイメージ（無気力）", "always happy", "always tired word", "sleep"], 0, ""],
    ["「～について」の意味は？", ["about / concerning", "until", "because", "although"], 0, ""],
    ["「さんぽします」の漢字イメージとして近いのは？", ["walk / stroll", "run", "swim", "drive only"], 0, ""],
  ],
  [
    ["「デパート」の語源として自然なのは？", ["department store (loanword)", "fish market", "library", "hospital"], 0, ""],
    ["「セール」の意味は？", ["sale / discount event", "cell", "seal", "sail"], 0, ""],
    ["「やすい」（価格）の反対は？", ["たかい", "おおきい", "ちいさい", "あたらしい"], 0, ""],
    ["「おもい」（重い）の意味は？", ["heavy", "interesting", "light", "fast"], 0, ""],
    ["「あたたかい」の季節として多いのは？", ["spring image often", "only winter", "never summer", "only night"], 0, ""],
  ],
  [
    ["「コーヒー」と「コーラ」のカテゴリとして近いのは？", ["drinks", "furniture", "countries", "verbs"], 0, ""],
    ["「パン」の意味は？", ["bread", "pan", "plate", "pen"], 0, ""],
    ["「ケーキ」の場面として多いのは？", ["birthday / cafe", "train ticket", "exam", "hospital"], 0, ""],
    ["「ケータイ」の意味は？", ["mobile phone", "hotel", "ticket", "kitchen"], 0, ""],
    ["「ノートパソコン」は？", ["laptop", "notebook paper only", "bag", "train pass"], 0, ""],
  ],
  [
    ["「れいぞうこ」の意味は？", ["refrigerator", "freezer room", "library", "rice cooker"], 0, ""],
    ["「レストラン」でよく使うのは？", ["メニュー／おかいけい", "じこしょうかいのみ", "あいさつだけ", "けん"], 0, ""],
    ["「バーゲン」のニュアンスは？", ["bargain sale", "burger", "bag", "bar"], 0, ""],
    ["「ひろい」（広い）の反対は？", ["せまい", "おおきい", "ちいさい", "ながい"], 0, ""],
    ["「たのしい」の過去のよみは？", ["たのしかった", "たのしいだった", "たのしくなかった", "たのしません"], 0, ""],
  ],
];

const GRAMMAR_BLOCKS: McqPoolRow[][] = [
  [
    ["このへやはしずか（　）へやです。", ["な", "に", "だ", "く"], 0, ""],
    ["ケーキはあまいです。おちゃは（　）。", ["あまくないです", "あまいです", "あまくてです", "あまくなかったです"], 0, ""],
    ["コーヒーを（　）ください。", ["のみ", "のんで", "のみます", "のみません"], 1, ""],
    ["まどを（　）ください。", ["あけて", "あけます", "あけた", "あける"], 0, ""],
    ["ドアが（　）。（開いた状態）", ["あいています", "あけます", "あけました", "あける"], 0, ""],
    ["テレビを（　）ください。", ["みて", "みます", "みた", "みる"], 0, ""],
  ],
  [
    ["このシャツはやすいです。でも（　）です。", ["ちいさい", "おおきい", "あかい", "あつい"], 0, "文脈で対比."],
    ["もうすこし（　）ください。", ["やすくして", "やすいで", "やすくて", "やすかった"], 0, ""],
    ["えいがを（　）から、ねむいです。", ["みた", "みて", "みます", "みる"], 0, ""],
    ["コーヒーを（　）、ケーキもたべます。", ["のみます", "のんで", "のみました", "のみません"], 1, ""],
    ["このケーキは（　）です。（過去）", ["おいしかったです", "おいしいです", "おいしくないです", "おいしくてです"], 0, ""],
    ["ストレスが（　）から、ねむれません。", ["ある", "ない", "あった", "なかった"], 0, ""],
  ],
  [
    ["あめが（　）から、いえにいます。", ["ふる", "ふった", "ふって", "ふらない"], 0, ""],
    ["きょうはあついです。ビールを（　）。", ["のみます", "のみません", "のみました", "のみ"], 0, ""],
    ["このパソコンはおそいです。あたらしいのが（　）。", ["ほしいです", "ほしかったです", "ほしくないです", "ほしくありません"], 0, ""],
    ["そのバッグは（　）ですね。", ["きれい", "きれいな", "きれくない", "きれかった"], 0, ""],
    ["このみちは（　）です。", ["みじかい", "みじかくない", "みじかかった", "みじかくて"], 0, ""],
    ["このセーターはやわらかいです。（　）です。", ["あたたかい", "つめたい", "おもい", "あつい"], 0, ""],
  ],
  [
    ["パンを（　）から、けっこうおなかがいっぱいです。", ["たべて", "たべます", "たべた", "たべる"], 0, ""],
    ["ソファはやわらかいです。イスは（　）。", ["かたいです", "やわらかいです", "あかいです", "あおいです"], 0, ""],
    ["このコートは（　）です。（軽い）", ["かるい", "おもい", "せまい", "ひろい"], 0, ""],
    ["わたしはにほんごがすきです。えいごは（　）。", ["すきじゃないです", "すきです", "すきではありませんです", "すきました"], 0, ""],
    ["このみずは（　）です。（冷たい）", ["つめたい", "あつい", "あたたかい", "ぬるい"], 0, ""],
    ["デパートはにぎやかです。としょかんは（　）。", ["しずかです", "にぎやかです", "あついです", "ひろいです"], 0, ""],
  ],
  [
    ["このケーキはあまり（　）。", ["あまくないです", "あまいです", "あまくありません", "あまそうです"], 0, ""],
    ["わたしはスポーツ（　）じょうずです。", ["が", "は", "を", "に"], 0, ""],
    ["えいがはおもしろかったです。ほんは（　）。", ["おもしろくなかったです", "おもしろいです", "おもしろくないです", "おもしろかったです"], 0, ""],
    ["このコーヒーはあついです。ちょっと（　）。", ["のみます", "のみません", "のみました", "のみ"], 0, ""],
    ["パーティーはたのしかったです。でもつかれました。だからもう（　）。", ["ねます", "ねません", "ねました", "ねない"], 0, ""],
    ["このカバンはやすいです。でも（　）です。", ["おもい", "かるい", "あたらしい", "ふるい"], 0, ""],
  ],
];

const READING_BLOCKS: McqPoolRow[][] = [
  [
    ["【文】このシャツはやすいです。でもちいさいです。\n内容は？", ["Cheap but small.", "Big.", "Expensive.", "Free."], 0, ""],
    ["【文】コーヒーはあついです。ちょっとまちます。\n筆者は？", ["Coffee hot — will wait.", "Will drink fast.", "Will add ice only.", "Throw away."], 0, ""],
    ["【文】わたしはスポーツがじょうずです。やきゅうがすきです。\nスポーツは？", ["Good at sports — likes baseball.", "Hates all sports.", "Only studies.", "Never played."], 0, ""],
    ["【文】このケーキはおいしいです。でもたかいです。\nケーキは？", ["Tasty but expensive.", "Cheap.", "Bad.", "Free."], 0, ""],
    ["【文】きょうはさむいです。セーターをきます。\nきょうは？", ["Cold — wears sweater.", "Hot.", "Rain.", "Wind only."], 0, ""],
  ],
  [
    ["【文】このへやはひろいです。でもせまいへやもあります。\nビルは？", ["Some rooms wide, some narrow.", "All tiny.", "All huge.", "No rooms."], 0, ""],
    ["【文】わたしはおんがくがすきです。クラシックをよくききます。\nすきなものは？", ["Music — listens to classical.", "Only rock.", "Never listens.", "Hates music."], 0, ""],
    ["【文】このみちはながいです。でもみじかいみちもあります。\nこのエリアは？", ["Mix of long and short roads.", "Only highway.", "Only river.", "Only tunnel."], 0, ""],
    ["【文】このパンはあたらしいです。おいしいです。\nパンは？", ["Fresh and tasty.", "Stale.", "Salty.", "Free."], 0, ""],
    ["【文】わたしはかんごしになりたいです。だいがくでべんきょうしています。\n目標は？", ["Wants to be nurse — studying at uni.", "Wants to drive taxi.", "Retired.", "Chef."], 0, ""],
  ],
  [
    ["【文】このコートはあたたかいです。でもおもいです。\nコートは？", ["Warm but heavy.", "Light.", "Thin.", "Cheap."], 0, ""],
    ["【文】わたしはドイツごがすきです。でもまだじょうずじゃありません。\n実力は？", ["Likes German — not skilled yet.", "Fluent.", "Never studied.", "Native."], 0, ""],
    ["【文】このえいがはながいです。でもおもしろいです。\n映画は？", ["Long but interesting.", "Short.", "Boring.", "Silent."], 0, ""],
    ["【文】このレストランはしずかです。でもサービスはよくありません。\nレストランは？", ["Quiet but service not great.", "Loud.", "Perfect.", "Closed."], 0, ""],
    ["【文】わたしはピアノがへたです。でもれんしゅうします。\n態度は？", ["Bad at piano — will practice.", "Concert pianist.", "Never tries.", "Hates piano."], 0, ""],
  ],
  [
    ["【文】このジュースはつめたいです。あついひにはいいです。\nジュースは？", ["Cold — good on hot days.", "Hot drink.", "Frozen solid.", "Expired."], 0, ""],
    ["【文】このパソコンははやいです。でもおそいパソコンもあります。\nオフィスは？", ["Some PCs fast, some slow.", "All broken.", "No PCs.", "Only tablets."], 0, ""],
    ["【文】わたしはおちゃがすきです。コーヒーはあまりすきじゃありません。\n飲み物は？", ["Prefers tea over coffee.", "Only coffee.", "Only juice.", "Never drinks."], 0, ""],
    ["【文】このみちはあぶないです。でもみじかいです。\n安全は？", ["Dangerous but short route.", "Safe highway.", "River.", "Tunnel only."], 0, ""],
    ["【文】このケーキはあまいです。でもだいじょうぶです。（少量）\n筆者は？", ["Sweet — OK with small amount.", "Will eat whole cake.", "Allergic.", "Hates sugar."], 0, ""],
  ],
  [
    ["【文】このバッグはきれいです。でもやすいです。\nバッグは？", ["Pretty and cheap.", "Ugly.", "Broken.", "Heavy."], 0, ""],
    ["【文】わたしはビールがすきです。でもきょうはのみません。\nきょうは？", ["Likes beer — not drinking today.", "Drinking many.", "Never liked beer.", "Alcoholic."], 0, ""],
    ["【文】このホテルのへやはひろいです。でもちょっとひどいです。\nへやは？", ["Wide room — bit bad quality.", "Tiny suite.", "Perfect.", "Outside."], 0, ""],
    ["【文】このセーターはやわらかいです。でもちいさいです。\nセーターは？", ["Soft but small.", "Rough.", "Huge.", "Plastic."], 0, ""],
    ["【文】このえいがはおもしろくなかったです。でもともだちはわらいました。\n映画は？", ["Speaker bored — friends laughed.", "Everyone cried.", "Nobody watched.", "Award-winning."], 0, ""],
  ],
];

const LISTENING_MCQ_BLOCKS: McqPoolRow[][] = [
  [
    ["（聴解）「このシャツはやすいですね。」あとで自然なのは？", ["でもちょっとちいさいです。", "でもただしいです。", "でもおおきいです。", "でもみじかいです。"], 0, ""],
    ["（聴解）「もうすこしやすくなりますか。」場面は？", ["Negotiating price.", "Asking weight.", "Asking color.", "Asking age."], 0, ""],
    ["（聴解）「まどをしめてください。」意味は？", ["Please close the window.", "Open window.", "Break glass.", "Buy curtains."], 0, ""],
    ["（聴解）「このケーキはおいしいです。」感想として近いのは？", ["Positive taste.", "Hates cake.", "Allergic reaction.", "Too salty."], 0, ""],
  ],
  [
    ["（聴解）「コーヒーをのんでください。」依頼は？", ["Please drink coffee.", "Please make coffee.", "Please buy beans.", "Please sell machine."], 0, ""],
    ["（聴解）「きょうはあついですね。」天気は？", ["Hot today.", "Cold.", "Snow.", "Wind."], 0, ""],
    ["（聴解）「このバッグはおもいです。」意味は？", ["Bag is heavy.", "Bag is light.", "Bag is cheap.", "Bag is red."], 0, ""],
    ["（聴解）「テレビをみてもいいですか。」返答として自然なのは？", ["はい、みてもいいです。", "いいえ、みます。", "はい、みません。", "いいえ、みてください。"], 0, ""],
  ],
  [
    ["（聴解）「えいがはながかったです。」感想は？", ["Movie was long.", "Movie was short.", "No movie.", "Only trailer."], 0, ""],
    ["（聴解）「このへやはしずかです。」へやは？", ["Quiet room.", "Noisy.", "Dark.", "Hot kitchen."], 0, ""],
    ["（聴解）「パンをかいました。」あとで？", ["Bought bread.", "Baked train.", "Sold house.", "Lost job."], 0, ""],
    ["（聴解）「ケーキはあまいです。」ケーキは？", ["Sweet cake.", "Spicy.", "Sour.", "Bitter."], 0, ""],
  ],
  [
    ["（聴解）「このみちはみじかいです。」道は？", ["Short road.", "Long river.", "Wide building.", "Tall tree."], 0, ""],
    ["（聴解）「レストランはにぎやかです。」場面は？", ["Busy restaurant.", "Empty park.", "Quiet library.", "Closed shop."], 0, ""],
    ["（聴解）「わたしはスポーツがすきです。」内容は？", ["Likes sports.", "Hates sports.", "Player.", "Referee."], 0, ""],
    ["（聴解）「このジュースはつめたいです。」飲み物は？", ["Cold juice.", "Hot tea.", "Warm milk.", "Ice cream only."], 0, ""],
  ],
  [
    ["（聴解）「このコートはあたたかいです。」コートは？", ["Warm coat.", "Thin shirt.", "Wet umbrella.", "Small hat."], 0, ""],
    ["（聴解）「デパートはひろいです。」デパートは？", ["Spacious department store.", "Tiny kiosk.", "Outdoor park.", "Train."], 0, ""],
    ["（聴解）「このパソコンはおそいです。」パソコンは？", ["Slow PC.", "Fast PC.", "Broken TV.", "New phone."], 0, ""],
    ["（聴解）「おちゃをのみます。」飲むものは？", ["Tea.", "Wine.", "Soup.", "Oil."], 0, ""],
  ],
];

function listeningIntroW2(testNum: number, tid: string): JapaneseWeeklyTestItem {
  const a = Math.min(14, 8 + testNum);
  const b = Math.min(14, 10 + testNum);
  return listeningIntroEmbedded(
    `${tid}-l-intro`,
    "聴解（Week 2）：形容詞・リクエスト・状態（～ている）を意識してください。Minna L8–L14。",
    "クリップを一度聞いてから、聴解問題に答えてください。",
    [a, b, 14],
    undefined,
  );
}

export function buildWeek2SubTests(): JapaneseWeeklySubTest[] {
  return buildJlptFivePaperWeek({
    weekPrefix: "jn5-w2",
    vocabBlocks: VOCAB_BLOCKS,
    grammarBlocks: GRAMMAR_BLOCKS,
    readingBlocks: READING_BLOCKS,
    listeningMcqBlocks: LISTENING_MCQ_BLOCKS,
    listeningIntroForTest: listeningIntroW2,
    paperSubtitle: "JLPT N5-style · 20 questions · Minna Lessons 8–14 · Days 8–14",
    paperIntro:
      "Week 2 の五つのペーパーは別問題です。い・な形容詞、くて・てください、ている などを確認します。提出後に正答とスコアが表示されます。",
  });
}
