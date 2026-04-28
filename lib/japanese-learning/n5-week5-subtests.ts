/**
 * Week 5: five JLPT N5-style papers (Test 1–5), each with 20 scored MCQs.
 */

import type { JapaneseWeeklySubTest, JapaneseWeeklyTestItem } from "@/lib/japanese-learning/types";
import {
  buildJlptFivePaperWeek,
  listeningIntroEmbedded,
  type McqPoolRow,
} from "@/lib/japanese-learning/n5-subtest-shared";

/** Five vocab/kanji-style questions per exam (25 unique across all tests). */
const VOCAB_BLOCKS: McqPoolRow[][] = [
  [
    ["「学生」の読みは？", ["がくせい", "がくしょう", "がくじん", "がくちょう"], 0, "学生 = がくせい (student). 学 = study; 生 = life/person."],
    ["「今日」は？", ["きょう", "きんょう", "あした", "きのう"], 0, "今日 is an irregular reading — こんにち (used in こんにちは) but きょう as a standalone word for “today.”"],
    ["「私」の読みは？", ["わたし", "わたくし", "われ", "わた"], 0, "私 reads わたし in everyday speech. わたくし is the formal/humble variant used in business."],
    ["「電話」のよみは？", ["でんわ", "てんわ", "でんば", "てんば"], 0, "電 (electricity / でん) + 話 (speech / わ) → でんわ (telephone)."],
    ["「写真」は？", ["しゃしん", "しゃしょう", "せっしん", "さっしん"], 0, "写 (to copy/capture) + 真 (true/real) → しゃしん (photograph). Remember: 写真をとります = to take a photo."],
  ],
  [
    ["「勉強する」の意味に近いのは？", ["study", "eat", "sleep", "run"], 0, "勉強 = study (べんきょう). Adding する makes it a verb: べんきょうします (I study)."],
    ["「寒い」の反対に近いのは？", ["あつい", "おおきい", "ちいさい", "つめたい"], 0, "寒い (さむい) = cold (weather). The opposite for weather is 暑い (あつい = hot). 冷たい (つめたい) = cold to the touch."],
    ["「買う」の意味は？", ["to buy", "to sell", "to read", "to write"], 0, "買う (かう) = to buy. Its opposite 売る (うる) = to sell. Pair them: 買います ↔ 売ります."],
    ["「駅」の読みは？", ["えき", "いき", "えい", "えけ"], 0, "駅 (えき) = station. Common in place names: 東京駅, 渋谷駅. Also: 駅前 (えきまえ) = in front of the station."],
    ["「水」の読みは？", ["みず", "みずうみ", "かわ", "あめ"], 0, "水 = みず (water noun). As a kanji radical it appears in 海 (sea), 泳 (swim), 洗 (wash). The on'yomi すい appears in 水曜日 (すいようび, Wednesday)."],
  ],
  [
    ["「時間」の読みは？", ["じかん", "ときかん", "じこん", "じげん"], 0, "時間 (じかん) = time / duration. 時 alone reads じ for o'clock (三時 = さんじ). 時間がありますか = Do you have time?"],
    ["「車」の読みは？", ["くるま", "ちゃ", "しゃ", "じどう"], 0, "車 (くるま) = car. The on'yomi しゃ appears in 電車 (でんしゃ, train) and 自転車 (じてんしゃ, bicycle)."],
    ["「先生」の読みは？", ["せんせい", "せんせ", "しょうせい", "せいせん"], 0, "先生 (せんせい) = teacher / doctor. Also used as a respectful title when addressing teachers, doctors, and lawyers."],
    ["「友だち」の「だち」の部分は？", ["ともだち", "ゆうち", "ともち", "ゆうだち"], 0, "友だち is often written 友達. 友 (とも) = friend; the full word is ともだち. Using を: ともだちをつくります (make friends)."],
    ["「会社」の読みは？", ["かいしゃ", "かいしょう", "かいじゃ", "がいしゃ"], 0, "会社 (かいしゃ) = company / office. 会 = meet; 社 = organization. 会社員 (かいしゃいん) = company employee."],
  ],
  [
    ["「何」の読みは？", ["なん／なに", "なみ", "なんい", "なんじ"], 0, "何 reads なん before consonants (なんですか) and なに before vowels or alone (なにをしますか). Both are correct in many contexts."],
    ["「木曜日」は？", ["もくようび", "きようび", "みずようび", "どようび"], 0, "木曜日 (もくようび) = Thursday. Days of the week use the five elements: 月火水木金土日 (moon, fire, water, wood, gold, earth, sun)."],
    ["「旅行」の読みは？", ["りょこう", "りょこ", "りょうこう", "りょきょう"], 0, "旅行 (りょこう) = travel / trip. 旅 (たび) alone = journey. 旅行します = to travel; 旅行者 = traveller."],
    ["「料理」の読みは？", ["りょうり", "りょうりょう", "りょうい", "りょり"], 0, "料理 (りょうり) = cooking / dish. りょうりをします = to cook. 日本料理 (にほんりょうり) = Japanese cuisine."],
    ["「映画」の読みは？", ["えいが", "えが", "えいぎょう", "えいき"], 0, "映画 (えいが) = movie / film. 映画館 (えいがかん) = cinema. 映画をみます = to watch a movie."],
  ],
  [
    ["「病院」の読みは？", ["びょういん", "びょうえん", "びょうい", "びょういんい"], 0, "病院 (びょういん) = hospital. Note the long vowel びょう. Minimal-pair trap: びよういん (beauty salon) sounds similar — listen carefully to the pitch."],
    ["「天気」の読みは？", ["てんき", "てんぎ", "てんきょう", "てんけい"], 0, "天気 (てんき) = weather. 天気予報 (てんきよほう) = weather forecast. お天気は？ is a common conversation starter."],
    ["「新しい」の意味は？", ["new", "old", "big", "small"], 0, "新しい (あたらしい) = new. Its opposite is 古い (ふるい) = old. 新しいです → past negative: 新しくなかったです."],
    ["「家族」の読みは？", ["かぞく", "かそく", "かぞう", "かぞっく"], 0, "家族 (かぞく) = family. 家 (いえ／うち) = home; 族 = tribe/group. Used as a group noun: 家族がいます (I have family)."],
    ["「学校」の読みは？", ["がっこう", "がっこ", "がくこう", "がっこお"], 0, "学校 (がっこう) = school. Note the double-k sound (っ) before こう. 学 appears in many study words: 学生, 勉強, 大学."],
  ],
];

const GRAMMAR_BLOCKS: McqPoolRow[][] = [
  [
    ["わたし（　）田中です。", ["は", "が", "を", "に"], 0, "Topic は."],
    ["これは本（　）。", ["です", "だ", "である", "ます"], 0, "Polite copula です."],
    ["きのう映画（　）見ました。", ["を", "が", "は", "に"], 0, "Object を."],
    ["そこ（　）いすがあります。", ["に", "で", "を", "が"], 0, "Existence location に."],
    ["バス（　）がっこうへいきます。", ["で", "に", "を", "と"], 0, "Means で."],
    ["だれ（　）いきますか。", ["と", "が", "を", "に"], 0, "Accompaniment と."],
  ],
  [
    ["このケーキは（　）です。", ["おいしい", "おいしく", "おいしかった", "おいしくない"], 0, "い-adjective predicate: base form ends in い (おいしい)."],
    ["静か（　）へやです。", ["な", "に", "だ", "く"], 0, "な-adj + な + noun."],
    ["窓を（　）ください。", ["あけて", "あけます", "あけた", "あける"], 0, "てください."],
    ["もうすこし（　）してください。", ["やすく", "やすい", "やすかった", "やすくて"], 0, "い-adjective adverb form: やすい → やすく + してください."],
    ["雨が（　）から、いえにいます。", ["ふる", "ふった", "ふって", "ふらない"], 0, "Reason がふるから."],
    ["おちゃを（　）ください。", ["のみ", "のんで", "のみます", "のんだ"], 1, "のんでください."],
  ],
  [
    ["ここではタバコを（　）。", ["すってはいけません", "すってもいいです", "すってください", "すいません"], 0, "Prohibition: ～てはいけません."],
    ["あしたは（　）とおもいます。", ["はれる", "はれます", "はれている", "はれた"], 0, "Plain form before とおもう."],
    ["日本語を（　）ことができます。", ["はなす", "はなします", "はなして", "はなした"], 0, "ことができる requires the dictionary form."],
    ["きのうのパーティー（　）よかったです。", ["は", "が", "を", "に"], 1, "が often with よかった for evaluation."],
    ["どうしてきょうしつに（　）の？", ["こない", "こなかった", "こないで", "こなかったの"], 0, "Casual explanation pattern."],
    ["まちがえたら（　）。", ["もういちどします", "もういちどして", "もういちどした", "もういちどする"], 0, "たら conditional."],
  ],
  [
    ["パンを（　）あげました。", ["やいて", "やきます", "やいた", "やく"], 0, "てあげる."],
    ["にほんごを（　）もらいました。（先生に）", ["おしえて", "おしえます", "おしえた", "おしえる"], 0, "て-form + もらいました."],
    ["だれ（　）きましたか。", ["と", "が", "を", "に"], 0, "と for “with whom”."],
    ["スーパー（　）かいものをします。", ["で", "に", "を", "へ"], 0, "Activity location で."],
    ["これは（　）ほんですか。", ["どんな", "なん", "いつ", "どこ"], 0, "どんな + noun."],
    ["まいにちたくさん（　）。", ["べんきょうします", "べんきょうして", "べんきょうした", "べんきょうする"], 0, "Polite habit."],
  ],
  [
    ["もうすこし（　）てください。", ["ちいさくし", "ちいさい", "ちいさく", "ちいさかった"], 0, "Adverb + してください."],
    ["ドアが（　）。", ["あいています", "あきます", "あけます", "あきました"], 0, "Result state ている."],
    ["かさを（　）いきます。", ["もって", "もちます", "もった", "もつ"], 0, "ていく preparation."],
    ["ねむれません。ストレス（　）おおきいです。", ["が", "で", "を", "に"], 0, "Subject が before adjective predicate."],
    ["コーヒーを（　）みませんか。", ["のみ", "のんで", "のみます", "のみました"], 1, "のんでみませんか invite."],
    ["おそく（　）すみません。", ["なって", "なります", "なった", "なる"], 0, "てすみません."],
  ],
];

const READING_BLOCKS: McqPoolRow[][] = [
  [
    ["【文】きょうはあついです。コーラをのみます。\n筆者がするのはどれに近いか。", ["Drink cola because it is hot.", "Will not drink.", "Will cook.", "Will sleep."], 0, ""],
    ["【文】あしたテストがあります。きょうはよくねます。\n筆者のきょうのようすは？", ["Will sleep well tonight.", "Will not study.", "Will skip test.", "Will travel."], 0, ""],
    ["【文】このバッグはやすいです。でもおもいです。\n正しい内容は？", ["Cheap but heavy.", "Expensive and light.", "Heavy so cannot buy.", "Free."], 0, ""],
    ["【文】あめがふります。かさをもっていきます。\n次にすることは？", ["Take an umbrella.", "Go swimming.", "Open window.", "Skip school."], 0, ""],
    ["【文】ともだちにメールをおくりました。へんじがありません。\n今のようすは？", ["Waiting for a reply.", "Got a reply.", "Will not send mail.", "Deleted friend."], 0, ""],
  ],
  [
    ["【文】きのうレストランへいきました。すしをたべました。\nたべたものは？", ["Sushi.", "Ramen.", "Bread.", "Curry."], 0, ""],
    ["【文】でんしゃはあしたストライキです。バスでいきます。\n筆者はどうする？", ["Take the bus.", "Take the train.", "Walk only.", "Stay home."], 0, ""],
    ["【文】このとしょかんはしずかです。べんきょうにいいです。\nとしょかんは？", ["Quiet and good for study.", "Noisy.", "Closed.", "Expensive."], 0, ""],
    ["【文】ちちはいましごとです。ばんごはんはつくりません。\nこんばんは？", ["Father is working; no dinner cooked (by father).", "Father cooks.", "No work.", "Eating out only."], 0, ""],
    ["【文】かぞくとパーティーをします。ケーキをかいました。\nケーキは？", ["Bought for the party.", "Will not eat.", "Made at home only.", "Forgot."], 0, ""],
  ],
  [
    ["【文】スマホをなくしました。あたらしいのをかいます。\nあとでするのは？", ["Buy a new phone.", "Find old one only.", "Borrow forever.", "Never use phone."], 0, ""],
    ["【文】しけんはあしたです。きょうはよるおそくまでべんきょうします。\nきょうは？", ["Study late tonight.", "Do not study.", "Finished study.", "Sleep early."], 0, ""],
    ["【文】このみちはあぶないです。ゆっくりあるいてください。\nアドバイスは？", ["Walk slowly — dangerous road.", "Run.", "Drive fast.", "Ignore."], 0, ""],
    ["【文】きょうはかぜです。かいしゃをやすみます。\nきょうは？", ["Take day off work due to cold.", "Go to office.", "Study abroad.", "Exercise."], 0, ""],
    ["【文】このホテルはべッドがやわらかいです。よくねられました。\n感想は？", ["Soft bed — slept well.", "Hard bed.", "No bed.", "Too noisy."], 0, ""],
  ],
  [
    ["【文】せんせいは「じしょをみてもいいです」と言いました。\nメモとして正しいのは？", ["Dictionary use allowed.", "Dictionary forbidden.", "Talk loudly.", "Leave early."], 0, ""],
    ["【文】あしたでんきがきえます。ろうそくをかいました。\nりゆうは？", ["Power outage tomorrow — bought candles.", "Birthday cake.", "Camping.", "Gift."], 0, ""],
    ["【文】このパソコンはおそいです。あたらしいのがほしいです。\n筆者は？", ["Wants new PC — slow old one.", "Happy with speed.", "Cannot type.", "No internet."], 0, ""],
    ["【文】すみません、みちをおしえてください。\nきいてるのは？", ["Asking directions.", "Ordering food.", "Buying ticket.", "Complaining."], 0, ""],
    ["【文】あしたはやすみです。でもしごとがあります。\nじじつは？", ["Has work tomorrow despite holiday.", "Free all day.", "Travels.", "Sick."], 0, ""],
  ],
  [
    ["【文】このコーヒーはすっぱいです。おかしいです。\n筆者は？", ["Coffee tastes sour — odd.", "Loves it.", "Sweet.", "Cold only."], 0, ""],
    ["【文】こどもがねています。しずかにしてください。\nいわれているのは？", ["Be quiet — child sleeping.", "Speak louder.", "Play music.", "Leave room."], 0, ""],
    ["【文】あしたあめがふるそうです。かさをもっていきます。\nちゅういしているのは？", ["Rain expected — take umbrella.", "Sunny.", "Snow.", "Wind only."], 0, ""],
    ["【文】このチケットはきょうだけです。あしたはつかえません。\nルールは？", ["Valid today only.", "Valid tomorrow.", "Never valid.", "Free forever."], 0, ""],
    ["【文】かれはにほんごがじょうずです。べんきょうしています。\n内容は？", ["Good at Japanese — studies.", "Does not study.", "Beginner only.", "Hates Japanese."], 0, ""],
  ],
];

const LISTENING_MCQ_BLOCKS: McqPoolRow[][] = [
  [
    ["アナウンス：「しけんはじまります。」いちばん近いのは？", ["The exam is starting.", "The exam ended.", "Break time.", "No exam."], 0, ""],
    ["店員：「いちまんえんになります。」意味は？", ["It costs 10,000 yen.", "It is free.", "Discount only.", "Wrong price."], 0, ""],
    ["「もういちどいってください。」相手は？", ["Ask to repeat.", "Ask to stop.", "Ask to leave.", "Ask to pay."], 0, ""],
    ["「えきはこちらですか。」きいてるのは？", ["Asking if station is this way.", "Buying ticket.", "Train delay.", "Hotel."], 0, ""],
  ],
  [
    ["「かいものかごはこちらです。」場面は？", ["Shopping basket location.", "Restaurant menu.", "Train gate.", "Hospital."], 0, ""],
    ["「おさきにどうぞ。」意味は？", ["After you / go ahead.", "Stop.", "Wait forever.", "Pay first."], 0, ""],
    ["「いまからあめがふります。」天気は？", ["Rain will start.", "Sunny.", "Snow.", "Wind stops."], 0, ""],
    ["「バスはおくれています。」なにがおこった？", ["Bus is delayed.", "Bus is early.", "No bus.", "Bus full."], 0, ""],
  ],
  [
    ["「きょうはやすみです。」いちばん近いのは？", ["Today is a holiday / closed.", "Today is busy.", "Open late.", "Exam day."], 0, ""],
    ["「このみちはとおりません。」意味は？", ["This road does not go through.", "Fast road.", "Free road.", "New road."], 0, ""],
    ["「でんわありがとう。」場面は？", ["Thanking for a call.", "Hung up angry.", "Wrong number only.", "Selling phone."], 0, ""],
    ["「きっぷはこちらでどうぞ。」きいてるのは？", ["Here is your ticket.", "No ticket.", "Refund only.", "Lost ticket."], 0, ""],
  ],
  [
    ["「すみません、いまいそがしいです。」意味は？", ["Sorry, busy now.", "Happy to talk.", "Come in.", "Free time."], 0, ""],
    ["「けっこんおめでとうございます。」場面は？", ["Wedding congratulations.", "Birthday.", "Graduation.", "New job."], 0, ""],
    ["「きょうしつでケータイをつかわないでください。」ルールは？", ["No phones in class.", "Phones required.", "Call teacher.", "Silent mode only."], 0, ""],
    ["「このバスはえきまえにとまります。」バスは？", ["Stops in front of station.", "Express no stops.", "Airport only.", "Hotel."], 0, ""],
  ],
  [
    ["「けさはかぜがつよいです。」天気は？", ["Strong wind this morning.", "Rain.", "Snow.", "Hot."], 0, ""],
    ["「このパンはあたらしいです。」場面は？", ["Bread is fresh.", "Bread is old.", "No bread.", "Sweet bread only."], 0, ""],
    ["「ちょっとまってください。」意味は？", ["Please wait a moment.", "Go now.", "Hurry.", "Stop forever."], 0, ""],
    ["「予約はいっぱいです。」レストランは？", ["Fully booked.", "Empty.", "Closed forever.", "Cheap."], 0, ""],
  ],
];

function listeningIntroWeek5(testNum: number, tid: string): JapaneseWeeklyTestItem {
  const lesson = Math.min(25, testNum * 5);
  return listeningIntroEmbedded(
    `${tid}-l-intro`,
    "聴解：ミニ会話・場面語をイメージしてください。下の埋め込みはサンプルクリップです（実試験では音声のみのことが多いです）。",
    "Short clipを一度聞き、次に選択肢へ。番号・料金・許可／禁止に注意してください。",
    [lesson],
    29,
  );
}

export function buildWeek5SubTests(): JapaneseWeeklySubTest[] {
  return buildJlptFivePaperWeek({
    weekPrefix: "jn5-w5",
    vocabBlocks: VOCAB_BLOCKS,
    grammarBlocks: GRAMMAR_BLOCKS,
    readingBlocks: READING_BLOCKS,
    listeningMcqBlocks: LISTENING_MCQ_BLOCKS,
    listeningIntroForTest: listeningIntroWeek5,
    paperSubtitle: "Full JLPT N5-style · 20 questions · Days 29–30 sprint review",
    paperIntro:
      "このペーパーは語彙・漢字・文法・読解・聴解をまとめています。提出後に正答と解説が表示されます。聴解は埋め込みクリップ＋リンクで繰り返し聞いてください。",
  });
}
