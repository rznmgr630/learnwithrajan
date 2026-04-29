/**
 * Week 1 · Days 1–7 · Minna II L26–32 · five JLPT N4-style papers.
 * Test 1 = easiest (recognition) → Test 5 = hardest (inference + mixed forms).
 */

import type { JapaneseWeeklySubTest, JapaneseWeeklyTestItem } from "@/lib/japanese-learning/types";
import {
  buildN4FivePaperWeek,
  n4ListeningIntro,
  type McqPoolRow,
} from "@/lib/japanese-learning/n4/n4-subtest-shared";

// ─── VOCAB ────────────────────────────────────────────────────────────────────
// T1: basic recognition (L26–28 core words)
// T2: slightly broader (L26–30)
// T3: collocations and usage context (L26–32)
// T4: nuance and word choice
// T5: near-synonyms + full-week integration

const VOCAB_BLOCKS: McqPoolRow[][] = [
  // Test 1 — recognition
  [
    ["「てしまいました」の基本的な意味は？", ["completed (often with regret)", "about to do", "want to do", "tried doing"], 0, ""],
    ["「準備しておく」の「ておく」の意味は？", ["do in advance", "do by accident", "do slowly", "finish doing"], 0, ""],
    ["「お願いします」に近い意味は？", ["please / I ask of you", "sorry", "thank you", "goodbye"], 0, ""],
    ["「もちろん」の意味は？", ["of course", "maybe", "perhaps", "never"], 0, ""],
    ["「ゆっくり」の意味は？", ["slowly / at ease", "quickly", "loudly", "quietly only"], 0, ""],
  ],
  // Test 2 — basic usage
  [
    ["「甘すぎる」の「すぎる」の意味は？", ["too much / excessive", "just enough", "slightly", "not at all"], 0, ""],
    ["「飲みやすい」の意味は？", ["easy to drink", "hard to drink", "drunk already", "want to drink"], 0, ""],
    ["「できるようになる」の意味は？", ["come to be able to", "try to do", "finish doing", "decide to do"], 0, ""],
    ["「説明する」の意味は？", ["explain / describe", "listen", "ask", "refuse"], 0, ""],
    ["「気にしない」の意味は？", ["don't worry / not concerned", "take care of", "be afraid", "ignore physically"], 0, ""],
  ],
  // Test 3 — collocation and context
  [
    ["「ちょうどいい」の使い方として自然なのは？", ["The temperature is just right.", "The book is too big.", "The road is too long.", "The price is unknown."], 0, ""],
    ["「大変でしたね」の場面として適切なのは？", ["Responding to someone's hardship", "Praising a gift", "Ordering food", "Introducing yourself"], 0, ""],
    ["「助かります」の意味に近いのは？", ["That's a great help.", "That's difficult.", "I'm tired.", "Please wait."], 0, ""],
    ["「何枚」で数えるものとして適切なのは？", ["Papers / flat items", "People", "Long objects", "Small round objects"], 0, ""],
    ["「くれませんか」の場面として最も自然なのは？", ["Asking a friend a favour", "Ordering at a restaurant (direct)", "Telling a stranger off", "Giving a formal lecture"], 0, ""],
  ],
  // Test 4 — nuance and near-synonym
  [
    ["「てくれませんか」と「てもらえませんか」の違いは？", ["もらえませんか is slightly more indirect/polite", "No difference", "くれませんか is more formal", "Both are rude"], 0, ""],
    ["「実は」の機能として正しいのは？", ["Introduces a revelation or correction", "Ends a sentence", "Marks a question", "Expresses regret"], 0, ""],
    ["「ようになりました」と「ことができます」の差として正しいのは？", ["ようになりました marks gradual change; ことができます is static ability", "Both mean the same", "ことができます is casual only", "ようになりました is negative only"], 0, ""],
    ["「んです / んですか」の主な機能は？", ["Give or seek explanation / background", "Mark past tense", "Ask permission", "Express surprise only"], 0, ""],
    ["「どうしたんですか」の意味は？", ["What happened / what's wrong?", "Where are you going?", "What time is it?", "Did you finish?"], 0, ""],
  ],
  // Test 5 — integration + inference
  [
    ["「落としてしまいました」の「て」の機能は？", ["Connective て-form + しまう (completion/regret)", "Plain past", "Imperative", "Conditional"], 0, ""],
    ["「充電しておきます」の「ておき」の機能は？", ["Preparation for later use", "Accidental completion", "Trial action", "Gradual change"], 0, ""],
    ["「もう少しゆっくり話していただけませんか」は何の表現か？", ["Very polite request (to a superior)", "Plain command", "Prohibition", "Hearsay"], 0, ""],
    ["「飲みにくい」のnegative nuance: something is difficult to drink BECAUSE it is…", ["Bitter / thick / unpleasant in some way", "Perfectly balanced", "Delicious", "Free"], 0, ""],
    ["「ようになりました」で話しているのは？", ["A change that happened over time", "An immediate decision", "A hearsay report", "A regretful accident"], 0, ""],
  ],
];

// ─── GRAMMAR ──────────────────────────────────────────────────────────────────
const GRAMMAR_BLOCKS: McqPoolRow[][] = [
  // Test 1 — basic particle fills (familiar patterns)
  [
    ["コップを落とし（　）ました。", ["て", "てしまい", "ておき", "てみ"], 1, "落としてしまいました."],
    ["旅行の前に、ホテルを予約し（　）ます。", ["てしまい", "ておき", "てもらい", "てみ"], 1, "予約しておきます."],
    ["窓を開け（　）くれませんか。", ["て", "てから", "ない", "ている"], 0, "開けてくれませんか."],
    ["先生、もう少しゆっくり話し（　）いただけませんか。", ["て", "ない", "てから", "ている"], 0, "話していただけませんか."],
    ["このケーキは甘（　）。", ["すぎます", "くなります", "すぎません", "くないです"], 0, "甘すぎます."],
    ["日本語が話せる（　）になりました。", ["ように", "こと", "ために", "ほど"], 0, "話せるようになりました."],
  ],
  // Test 2 — broader fill
  [
    ["バスが来なかった（　）、歩いていきました。", ["ので", "から", "が", "ようで"], 0, "ので＝because (objective)."],
    ["窓を開け（　）くれませんか。", ["て", "ない", "てから", "ている"], 0, ""],
    ["この本は読み（　）です。（hard to read）", ["にくい", "やすい", "すぎる", "ません"], 0, "読みにくいです."],
    ["転職しよう（　）思っています。", ["と", "が", "で", "に"], 0, "転職しようと思っています."],
    ["友達が結婚する（　）です。（hearsay）", ["そう", "よう", "みたい", "らしい"], 0, "〜そうです hearsay."],
    ["遅れてすみません。電車が遅延した（　）です。", ["ん", "の", "こと", "ため"], 0, "〜んです explanation."],
  ],
  // Test 3 — mixed N4 patterns
  [
    ["食べ（　）みてください。", ["て", "てから", "ておき", "ている"], 0, "食べてみてください."],
    ["夏休みはハワイに行く（　）にします。", ["こと", "ため", "よう", "ほど"], 0, "〜ことにします."],
    ["雨が降る（　）しれません。", ["かも", "よう", "はず", "だけ"], 0, "かもしれません."],
    ["毎日薬を飲まなく（　）いけません。", ["ては", "ても", "てから", "ている"], 0, "〜なくてはいけません."],
    ["料理が上手に（　）になりました。", ["なる", "できる", "なれる", "できよう"], 0, "なるようになりました."],
    ["先生はどうした（　）ですか。", ["ん", "の", "こと", "から"], 0, "どうしたんですか."],
  ],
  // Test 4 — conditional + complex
  [
    ["もし時間があれ（　）、来てください。", ["ば", "たら", "ても", "ので"], 0, "〜ば conditional."],
    ["宿題が終わっ（　）、出かけましょう。", ["たら", "ても", "ていく", "てしまう"], 0, "〜たら sequential."],
    ["たとえ高く（　）、買いたいです。", ["ても", "ば", "たら", "から"], 0, "〜ても even if."],
    ["日本語が上手になる（　）、毎日練習します。", ["ように", "ために", "ほど", "から"], 0, "〜ように purpose."],
    ["彼女に本を読（　）られました。（passive）", ["まれ", "ませ", "まえ", "みれ"], 0, "読まれました."],
    ["親に野菜を食べ（　）られました。（causative-passive）", ["させ", "かせ", "まれ", "られ"], 0, "食べさせられました."],
  ],
  // Test 5 — advanced inference
  [
    ["「書かれる」は何形か？", ["受け身（passive）", "使役（causative）", "使役受け身", "可能（potential）"], 0, ""],
    ["「食べさせる」は何形か？", ["使役（causative）", "受け身（passive）", "使役受け身", "て形"], 0, ""],
    ["「飲まされた」は何形か？", ["使役受け身（causative-passive）", "受け身", "使役", "て形"], 0, ""],
    ["この問題は思っ（　）ほど難しくないはずです。", ["た", "て", "ている", "てい"], 0, "思ったほど."],
    ["もっと練習する（　）にしてください。", ["よう", "ため", "こと", "ほど"], 0, "〜ようにしてください."],
    ["田中さんが来る（　）です。（logical expectation）", ["はず", "よう", "みたい", "らしい"], 0, "〜はずです."],
  ],
];

// ─── READING ─────────────────────────────────────────────────────────────────
const READING_BLOCKS: McqPoolRow[][] = [
  // Test 1 — simple sentences
  [
    ["【文】コップを落としてしまいました。\n意味は？", ["Accidentally dropped the cup.", "Want to drop the cup.", "Will drop the cup.", "Did not drop the cup."], 0, ""],
    ["【文】旅行の前にホテルを予約しておきました。\nしたことは？", ["Booked the hotel in advance.", "Forgot to book.", "Arrived at the hotel.", "Cancelled the booking."], 0, ""],
    ["【文】窓を開けてくれませんか。\n何を頼んでいますか。", ["Open the window (as a favour).", "Close the window.", "Look out the window.", "Break the window."], 0, ""],
    ["【文】もう少しゆっくり話していただけませんか。\n誰に話しかけていますか。", ["To a person in authority (teacher/senior).", "To a child.", "To themselves.", "To no one."], 0, ""],
    ["【文】このケーキは甘すぎます。\nケーキの問題は？", ["Too sweet.", "Not sweet enough.", "Too expensive.", "Too large."], 0, ""],
  ],
  // Test 2 — short passages
  [
    ["【文】日本語が少し話せるようになりました。でもまだ難しいです。\n学習者の現状は？", ["Making progress but still finds Japanese difficult.", "Already fluent.", "Gave up learning.", "Studying other language."], 0, ""],
    ["【文】遅れてすみません。電車が遅延したんです。\n遅れた理由は？", ["Train was delayed.", "Overslept.", "Forgot the time.", "Went to the wrong place."], 0, ""],
    ["【文】旅行の前に地図を印刷しておいたほうがいいですよ。\nアドバイスの内容は？", ["Print a map in advance.", "Buy a new phone.", "Book a hotel.", "Cancel the trip."], 0, ""],
    ["【文】このペンは書きやすいです。でも色が薄いです。\nでものあとで言いたいのは？", ["Contrast — easy to write but light ink.", "Good pen overall.", "Too expensive.", "Cannot write with it."], 0, ""],
    ["【文】先生がゆっくり話してくれたので、よくわかりました。\nよく分かった理由は？", ["Teacher spoke slowly.", "Used a dictionary.", "Already knew it.", "Watched a video."], 0, ""],
  ],
  // Test 3 — inference needed
  [
    ["【文】毎日練習したら、できるようになりましたよ。\nどうして上手になれましたか。", ["Daily practice led to improvement.", "Got a textbook.", "Moved to Japan.", "Took a test."], 0, ""],
    ["【文】転職しようと思っていますが、まだ決めていません。\n筆者の状態は？", ["Considering a job change but not decided.", "Already changed jobs.", "Happy with current job.", "Retired."], 0, ""],
    ["【文】彼はいつも元気です。病気になることがありません。\n彼の健康状態は？", ["Always healthy, never sick.", "Often sick.", "Sometimes tired.", "Resting now."], 0, ""],
    ["【文】佐藤さんが結婚するそうです。来月だそうですよ。\nこの情報の性質は？", ["Hearsay — heard from someone.", "Speaker's personal opinion.", "Official announcement.", "Guess only."], 0, ""],
    ["【文】このコーヒーは苦すぎて飲めません。砂糖を入れましょう。\n提案の理由は？", ["Coffee too bitter — needs sugar.", "Sugar already added.", "Want sweeter coffee.", "Coffee is too hot."], 0, ""],
  ],
  // Test 4 — paragraph inference
  [
    ["【文】健康のために毎朝ジョギングしています。雨が降っても続けます。\n筆者の態度は？", ["Committed even in bad weather.", "Quits when it rains.", "Only jogs in summer.", "Dislikes running."], 0, ""],
    ["【文】昨日、銀行が強盗に襲われました。私も呼ばれて話しました。\n筆者は何をしましたか。", ["Was questioned by police (passive).", "Robbed the bank.", "Worked at the bank.", "Watched from far away."], 0, ""],
    ["【文】もし時間があれば、山に行きたいと思っています。\n意味は？", ["Intends to go hiking if available time.", "Will definitely go.", "Hates mountains.", "Went already."], 0, ""],
    ["【文】たとえ試験に失敗しても、諦めません。\n筆者の気持ちは？", ["Will not give up even if failing.", "Will give up after one failure.", "Very confident of passing.", "Not concerned."], 0, ""],
    ["【文】親に毎日ピアノを弾かされました。最初は嫌でしたが、今は感謝しています。\n今の気持ちは？", ["Grateful now, despite past reluctance.", "Still hates piano.", "Never practiced.", "Wants to quit."], 0, ""],
  ],
  // Test 5 — complex passage with multiple inference
  [
    ["【文】この問題は思ったほど難しくないはずです。再測定すれば分かるはずです。\n研究者の確信は？", ["Logical expectation (はず) — not pure guesswork.", "Absolute certainty.", "Complete uncertainty.", "Hearsay from colleague."], 0, ""],
    ["【文】子供のころ野菜を食べさせられました。嫌でしたが体に良かったはずです。\n表現の特徴は？", ["Causative-passive (forced) + はず (logical retrospective conclusion).", "Voluntary eating.", "Future plan.", "Current habit."], 0, ""],
    ["【文】健康のため、毎日30分歩くようにしています。でも仕事が忙しい日はできません。\n何が課題か？", ["Busy work days break the routine.", "Never walks at all.", "Too healthy already.", "Walking is too easy."], 0, ""],
    ["【文】「飲んではいけません」と医者に言われました。\nこの表現は何を表しますか？", ["Prohibition — must not drink.", "Obligation — must drink.", "Permission — may drink.", "Suggestion — might drink."], 0, ""],
    ["【文】新入社員に書類を全部読ませました。それから、コピーもさせました。\n上司は何をしましたか？", ["Had employees (causative) read and copy documents.", "Read the documents themselves.", "Refused to let employees read.", "Forgot to assign tasks."], 0, ""],
  ],
];

// ─── LISTENING MCQs ───────────────────────────────────────────────────────────
const LISTENING_MCQ_BLOCKS: McqPoolRow[][] = [
  // Test 1 — simple word recognition
  [
    ["（聴解）「コップを落としてしまいました。」意味は？", ["Accidentally dropped the cup.", "Want a cup.", "Bought a cup.", "Found a cup."], 0, ""],
    ["（聴解）「準備しておきます。」意味は？", ["Will prepare in advance.", "Already prepared.", "Cannot prepare.", "Forgot to prepare."], 0, ""],
    ["（聴解）「もちろんです」に返すのとして自然なのは？", ["ありがとうございます。", "いいえ、違います。", "どうぞ遠慮なく。", "そうかもしれません。"], 0, ""],
    ["（聴解）「ゆっくり話してください」は何をお願いしていますか。", ["Speak slowly please.", "Speak loudly.", "Speak quickly.", "Speak formally."], 0, ""],
  ],
  // Test 2 — context identification
  [
    ["（聴解）「この料理は辛すぎます。」場面に合うのは？", ["Complaining food is too spicy.", "Ordering spicy food.", "Cooking spicy food.", "Praising the food."], 0, ""],
    ["（聴解）「てくれませんか」はどんな場面で使う？", ["Asking a friend a favour.", "Giving an order to a subordinate.", "Refusing a request.", "Saying goodbye."], 0, ""],
    ["（聴解）「そうなんですか」に合う返答は？", ["New information received with interest.", "Complete disagreement.", "Expressing anger.", "Giving a command."], 0, ""],
    ["（聴解）「日本語が話せるようになりました」の意味は？", ["Came to be able to speak Japanese.", "Was already able.", "Will never speak.", "Stopped speaking."], 0, ""],
  ],
  // Test 3 — grammar in context
  [
    ["（聴解）「転職しようと思っています」の意図は？", ["Currently intending to change jobs.", "Already changed jobs.", "No intention to change.", "Forced to change."], 0, ""],
    ["（聴解）「たことがあります」は何を表す？", ["Past experience (have done before).", "Ongoing state.", "Future plan.", "Obligation."], 0, ""],
    ["（聴解）「雨が降るかもしれません」の確信度は？", ["Low possibility (might rain).", "Certain it will rain.", "Rain is impossible.", "Speaker doesn't care."], 0, ""],
    ["（聴解）「毎日薬を飲まなくてはいけません」は何の意味？", ["Must take medicine every day.", "Don't need to take medicine.", "Can skip medicine.", "Medicine optional."], 0, ""],
  ],
  // Test 4 — conditional + passive discrimination
  [
    ["（聴解）「もし時間があれば来てください」の条件は？", ["If you have time.", "If it's raining.", "If you want food.", "If you are tired."], 0, ""],
    ["（聴解）「先生に呼ばれました」は何形か？", ["Passive — was called by the teacher.", "Causative — made someone call.", "Plain past.", "Potential — can call."], 0, ""],
    ["（聴解）「たとえ高くても買います」のニュアンスは？", ["Will buy regardless of price.", "Will buy only if cheap.", "Price doesn't matter (will NOT buy).", "Wants price reduction."], 0, ""],
    ["（聴解）「日本語が上手になるように練習します」の目的は？", ["Practice with the goal of improving.", "Practice without purpose.", "Already good enough.", "Wants to quit practice."], 0, ""],
  ],
  // Test 5 — fast mixed discrimination
  [
    ["（聴解）「食べさせられました」は何形か？", ["Causative-passive — was forced to eat.", "Passive — was eaten.", "Causative — made eat.", "Potential — can eat."], 0, ""],
    ["（聴解）「思ったほど難しくない」の意味は？", ["Not as difficult as expected.", "Much more difficult than expected.", "Exactly as expected.", "No comparison possible."], 0, ""],
    ["（聴解）「するように言いました」は何を表す？", ["Indirect reported instruction.", "Direct command.", "Hearsay.", "Permission."], 0, ""],
    ["（聴解）「健康のため」と「健康のために」の違いは？", ["のために adds the purpose nuance more explicitly.", "No difference.", "ため is negative; ために is positive.", "Only のために is correct."], 0, ""],
  ],
];

export function buildWeek1N4SubTests(): JapaneseWeeklySubTest[] {
  return buildN4FivePaperWeek({
    weekPrefix: "jn4-w1",
    vocabBlocks: VOCAB_BLOCKS,
    grammarBlocks: GRAMMAR_BLOCKS,
    readingBlocks: READING_BLOCKS,
    listeningMcqBlocks: LISTENING_MCQ_BLOCKS,
    listeningIntroForTest: (testNum, tid): JapaneseWeeklyTestItem =>
      n4ListeningIntro(
        `${tid}-l-intro`,
        `聴解（N4 Week 1 · Test ${testNum}）：Minna II L26–32 の会話を中心に，「てしまいました」「ておきます」「〜てくれませんか」「〜んです」などの表現が登場します。`,
        testNum <= 2
          ? "ゆっくりした会話を1回聞き、各話者の依頼・完了表現をメモしてください。"
          : testNum <= 4
            ? "自然なスピードで2回聞き、依頼の丁寧さのレベルとてしまいました・ておく・〜んですの使用をメモしてください。"
            : "通常スピードで1回のみ聞き、すべての文法ポイントをリアルタイムで識別してください。",
        [26, 27, 28, 29, 30],
      ),
    paperSubtitle: {
      en: `JLPT N4 Week 1 Test — Minna II Lessons 26–32`,
      np: `JLPT N4 हप्ता १ परीक्षा — मिन्ना II पाठ २६–३२`,
      jp: `JLPT N4 第1週テスト · みんなの日本語II 第26–32課`,
    },
    paperIntro:
      "語彙・漢字から始め、文法・読解・聴解の順に解いてください。Test 1が最も易しく、Test 5が最も難しいです。",
  });
}
