/**
 * Week 2 · Days 8–14 · Minna II L33–39 · five JLPT N4-style papers.
 * Focus: intention, experience, try/decide, conjecture, obligation, hearsay, appearance.
 */

import type { JapaneseWeeklySubTest, JapaneseWeeklyTestItem } from "@/lib/japanese-learning/types";
import {
  buildN4FivePaperWeek,
  n4ListeningIntro,
  type McqPoolRow,
} from "@/lib/japanese-learning/n4/n4-subtest-shared";

const VOCAB_BLOCKS: McqPoolRow[][] = [
  [
    ["「転職する」の意味は？", ["Change jobs", "Retire", "Get promoted", "Work overtime"], 0, ""],
    ["「試してみる」の意味は？", ["Try doing to see the result", "Refuse to try", "Forget to try", "Must try"], 0, ""],
    ["「決める」の意味は？", ["Decide", "Cancel", "Postpone", "Forget"], 0, ""],
    ["「必ず」の意味は？", ["Without fail / certainly", "Maybe", "Sometimes", "Rarely"], 0, ""],
    ["「雰囲気」の意味は？", ["Atmosphere / vibe", "Weather forecast", "Noise level", "Distance"], 0, ""],
  ],
  [
    ["「経験がある」とは？", ["Have experience / have done before", "No experience", "Want experience", "Lost experience"], 0, ""],
    ["「おそらく」の意味は？", ["Probably / likely", "Definitely", "Never", "Suddenly"], 0, ""],
    ["「資料」の意味は？", ["Documents / materials", "Equipment", "Building", "Tools only"], 0, ""],
    ["「きっと」の意味は？", ["Surely / certainly", "Perhaps", "Rarely", "Accidentally"], 0, ""],
    ["「正直に言うと」の機能は？", ["Introduce an honest/frank admission", "Disagree", "Change topic", "Give command"], 0, ""],
  ],
  [
    ["「でしょう」と「かもしれません」の確信度：高い方は？", ["〜でしょう", "〜かもしれません", "Both the same", "Neither expresses certainty"], 0, ""],
    ["「そうです」（伝聞）のあとに来る形は？", ["Plain form + そうです", "て形 + そうです", "ます形 + そうです", "ない形 + そうです"], 0, ""],
    ["「らしい」には二つの用法がある。一つは？", ["Hearsay/inference AND 'typical of'", "Only hearsay", "Only appearance", "Only obligation"], 0, ""],
    ["「はずです」の特徴は？", ["Based on logical deduction", "Based on guessing only", "Based on direct evidence", "Based on hearsay"], 0, ""],
    ["「〜ようです」と「〜みたいです」の差は？", ["ようです is more formal", "みたいです is more formal", "No difference", "ようです is casual only"], 0, ""],
  ],
  [
    ["「〜ことになりました」vs「〜ことにしました」：外部決定を表すのは？", ["〜ことになりました", "〜ことにしました", "Both", "Neither"], 0, ""],
    ["「〜たことがある」の時制は？", ["Unspecified past experience", "Future experience", "Present habit", "Immediate past"], 0, ""],
    ["「てみる」のニュアンスは？", ["Exploratory trial — try to see the result", "Completed action", "Preparation", "Prohibition"], 0, ""],
    ["「結婚するそうです」の情報源は？", ["Heard from someone (hearsay)", "Speaker saw directly", "Speaker is certain", "Logical deduction"], 0, ""],
    ["「〜と思っています」は何を表す？", ["Ongoing intention/thought", "Momentary thought", "Past memory", "Completed decision"], 0, ""],
  ],
  [
    ["「〜なければならない」のくだけた形は？", ["〜なきゃ / 〜ないといけない", "〜てしまう", "〜てある", "〜てくる"], 0, ""],
    ["「医者に言われた」は何形？", ["受け身（passive）", "使役（causative）", "使役受け身", "可能（potential）"], 0, ""],
    ["「彼女はいつも遅刻するらしい」の意味は？", ["It seems she's always late (based on impression/evidence)", "She's never late", "She hates being late", "She was late once"], 0, ""],
    ["「いつも元気そうですね」の「そう」は何形？", ["Appearance (様態) — looks healthy", "Hearsay (伝聞)", "Obligation", "Past tense"], 0, ""],
    ["「ようにしてください」の意味は？", ["Please try to do / make effort to do", "You must do (strict)", "You may do (permission)", "Don't do"], 0, ""],
  ],
];

const GRAMMAR_BLOCKS: McqPoolRow[][] = [
  [
    ["転職しよう（　）思っています。", ["と", "が", "で", "に"], 0, ""],
    ["日本に行っ（　）があります。", ["たこと", "てこと", "ること", "るの"], 0, ""],
    ["新しい料理を作っ（　）みます。", ["て", "から", "ので", "が"], 0, ""],
    ["大阪に転勤する（　）になりました。", ["こと", "よう", "ため", "ほど"], 0, ""],
    ["雨が降る（　）しれません。", ["かも", "よう", "はず", "だけ"], 0, ""],
    ["明日会議に出席しなけれ（　）なりません。", ["ば", "て", "が", "で"], 0, ""],
  ],
  [
    ["彼女が結婚する（　）です。（hearsay）", ["そう", "よう", "みたい", "らしい"], 0, ""],
    ["彼は疲れている（　）です。（appearance/casual）", ["みたい", "そう", "はず", "らしい"], 0, ""],
    ["薬を飲まなく（　）いけません。", ["ては", "ても", "てから", "ている"], 0, ""],
    ["もっと練習する（　）にします。", ["こと", "よう", "ため", "ほど"], 0, ""],
    ["先生は学生が理解できる（　）、ゆっくり話します。", ["ように", "ために", "ので", "から"], 0, ""],
    ["この問題は思った（　）難しくないはずです。", ["ほど", "より", "くらい", "だけ"], 0, ""],
  ],
  [
    ["彼女に荷物を持っ（　）もらいました。", ["て", "から", "ので", "が"], 0, ""],
    ["部長に連絡する（　）になりました。", ["こと", "よう", "ため", "ほど"], 0, ""],
    ["もし時間があれ（　）、手伝います。", ["ば", "たら", "ても", "から"], 0, ""],
    ["佐藤さんは優しい人（　）しい。（typical of）", ["ら", "そう", "よう", "みたい"], 0, ""],
    ["毎日ジョギングする（　）にしています。", ["よう", "こと", "ため", "ほど"], 0, ""],
    ["試験に合格でき（　）はずです。（logical expectation）", ["る", "た", "ない", "て"], 0, ""],
  ],
  [
    ["食べ（　）みたら、おいしかったです。", ["て", "から", "ない", "ている"], 0, ""],
    ["彼は必ず来る（　）です。（strong logical expectation）", ["はず", "そう", "らしい", "みたい"], 0, ""],
    ["お酒を飲ん（　）はいけません。", ["では", "ては", "ても", "でも"], 0, ""],
    ["日本語が話せる（　）になりました。", ["よう", "こと", "ため", "ほど"], 0, ""],
    ["田中さんが来る（　）に言いました。", ["よう", "こと", "ため", "ほど"], 0, ""],
    ["彼女は毎朝走る（　）にしています。", ["よう", "こと", "ため", "ほど"], 0, ""],
  ],
  [
    ["「書かれた」は何形？（passive）", ["受け身", "使役", "使役受け身", "可能"], 0, ""],
    ["「読ませた」は何形？（causative）", ["使役", "受け身", "使役受け身", "可能"], 0, ""],
    ["「飲まされた」は何形？（causative-passive）", ["使役受け身", "受け身", "使役", "可能"], 0, ""],
    ["「食べてみました」の「て」の機能は？", ["Trial/attempt form", "Completion", "Preparation", "Direction"], 0, ""],
    ["「なくてもいい」と「なければならない」の関係は？", ["One negates obligation; the other affirms it", "Both affirm obligation", "Both negate obligation", "No relation"], 0, ""],
    ["「〜たら」vs「〜ば」: 最も大きい違いは？", ["たら also means 'when (after)', ば is purely conditional", "No difference", "ば is more formal always", "たら is past tense only"], 0, ""],
  ],
];

const READING_BLOCKS: McqPoolRow[][] = [
  [
    ["【文】転職しようと思っています。まだ決めていません。\n状態は？", ["Thinking of switching jobs but undecided.", "Already changed jobs.", "Will never change.", "Forced to change."], 0, ""],
    ["【文】日本に行ったことがあります。\n意味は？", ["Has visited Japan before.", "Is currently in Japan.", "Will visit Japan.", "Never visited Japan."], 0, ""],
    ["【文】この料理を食べてみました。おいしかったです。\n何をしましたか。", ["Tried eating the dish — found it tasty.", "Refused to eat.", "Cooked the dish.", "Ordered it."], 0, ""],
    ["【文】会議に出席しなければなりません。\n意味は？", ["Must attend the meeting.", "Don't have to attend.", "May attend.", "Should not attend."], 0, ""],
    ["【文】雨が降るかもしれません。傘を持っていきます。\n行動の理由は？", ["Possible rain — taking umbrella precaution.", "Certain rain.", "No rain expected.", "Umbrella is fashionable."], 0, ""],
  ],
  [
    ["【文】田中さんが来るはずです。電話で確認しました。\n確信度は？", ["Logically expected (confirmed by phone).", "Pure guess.", "Hearsay only.", "Speaker is unsure."], 0, ""],
    ["【文】佐藤さんは優しいらしいですね。みんながそう言っています。\n情報源は？", ["General impression / hearsay from others.", "Direct observation.", "Logical deduction.", "Official announcement."], 0, ""],
    ["【文】毎日運動するようにしています。健康のためです。\n何のために運動しますか。", ["For health — makes effort daily.", "Just for fun.", "Forced by doctor.", "No reason."], 0, ""],
    ["【文】この映画は思ったほど怖くありませんでした。\n映画について何が分かりましたか。", ["Less scary than expected.", "Very scary.", "Not a horror film.", "Speaker didn't watch."], 0, ""],
    ["【文】プロジェクトが終わったら、みんなでお祝いをしましょう。\n条件は？", ["After the project ends.", "Before starting.", "If boss approves.", "When it rains."], 0, ""],
  ],
  [
    ["【文】試験に合格できるように、毎日勉強しています。\n目的は？", ["To be able to pass the exam.", "Just a habit.", "Because bored.", "Teacher's order."], 0, ""],
    ["【文】彼が結婚するそうです。来月だそうですよ。\n情報の種類は？", ["Hearsay — heard from someone.", "Direct knowledge.", "Official announcement.", "Guess."], 0, ""],
    ["【文】たとえ失敗しても、諦めません。\n筆者の態度は？", ["Won't give up even if failing.", "Will give up if failing.", "Doesn't care about outcome.", "Expects to succeed."], 0, ""],
    ["【文】子供のころ野菜を食べさせられました。\n表現の特徴は？", ["Was forced to eat (causative-passive).", "Volunteered to eat.", "Liked vegetables.", "Refused to eat."], 0, ""],
    ["【文】日本語が上手になるように、毎日練習します。\n「なるように」の意味は？", ["So that I become better (purpose).", "Because I am already good.", "While becoming better.", "Although getting better."], 0, ""],
  ],
  [
    ["【文】部長に頼まれて、資料を全部読みました。\n「頼まれて」は何形？", ["Passive (was asked/requested by).", "Causative.", "Plain past.", "Te-form only."], 0, ""],
    ["【文】これを食べてみることにしました。\n決定の種類は？", ["Personal decision to try eating.", "Forced to try.", "Already decided by others.", "No decision needed."], 0, ""],
    ["【文】もし時間があれば手伝います。なければ、できません。\n構造は？", ["Conditional ば — if/then.", "Simply listing tasks.", "Causal のでから.", "Hearsay そうです."], 0, ""],
    ["【文】毎日薬を飲まなくてはいけません。でも、寝る前には飲まなくてもいいです。\n両文の関係は？", ["Obligation vs. non-obligation contrast.", "Both are permissions.", "Both are prohibitions.", "Both are suggestions."], 0, ""],
    ["【文】佐藤さんは本当に優しい人らしいですね。いつもそう言われています。\n「らしい」の意味は？", ["Typical of / characteristic of Sato-san.", "Hearsay only.", "Appearance only.", "Logical expectation."], 0, ""],
  ],
  [
    ["【文】健康のために運動しています。そのために早起きするようにしています。\n「ように」vs「ために」の差は？", ["ために = purpose; ように = effort/manner toward a goal", "Same meaning", "ために is polite; ように is casual", "Both express prohibition"], 0, ""],
    ["【文】彼女に仕事を手伝ってもらいました。\n誰が誰を手伝いましたか。", ["She helped the speaker (speaker received help).", "Speaker helped her.", "They helped each other.", "Nobody helped."], 0, ""],
    ["【文】先生が学生に宿題をさせました。\n「させました」は？", ["Causative — teacher had/made students do homework.", "Passive — students were acted on.", "Causative-passive.", "Simple past."], 0, ""],
    ["【文】毎朝ジョギングをするようにしたら、体調がよくなりました。\n因果関係は？", ["Daily jogging improved health.", "Jogging made things worse.", "No connection.", "Health improved before jogging."], 0, ""],
    ["【文】「〜ことになった」vs「〜ことにした」: この二つの違いを確認してください。筆者はどちらを使いましたか。\n筆者は外部の決定を報告していました。", ["〜ことになった (external/circumstantial decision)", "〜ことにした (personal decision)", "Both used equally", "Neither used"], 0, ""],
  ],
];

const LISTENING_MCQ_BLOCKS: McqPoolRow[][] = [
  [
    ["（聴解）「転職しようと思っています」の現在形の意味は？", ["Currently planning a job change.", "Already changed jobs.", "Will never change.", "Forced to change."], 0, ""],
    ["（聴解）「日本に行ったことがあります」の意味は？", ["Has been to Japan before.", "Is in Japan now.", "Will go to Japan.", "Has never been."], 0, ""],
    ["（聴解）「かもしれません」の使い場は？", ["Uncertain possibility.", "Definite fact.", "Obligation.", "Request."], 0, ""],
    ["（聴解）「〜ようにしてください」の意味は？", ["Please try to do / make effort.", "Must do.", "Cannot do.", "Did already."], 0, ""],
  ],
  [
    ["（聴解）「結婚するそうです」と「結婚するらしいです」の差は？", ["そうです = hearsay; らしい = inference/impression", "Same meaning", "らしい is more certain", "そうです is more formal"], 0, ""],
    ["（聴解）「〜はずです」はどんな確信？", ["Logical expectation based on known facts.", "Pure guess.", "Hearsay from others.", "No certainty at all."], 0, ""],
    ["（聴解）「〜てみます」は何を表す？", ["Try doing to see the result.", "Completed action.", "Preparation.", "Prohibition."], 0, ""],
    ["（聴解）「出席しなければなりません」の意味は？", ["Must attend.", "Don't need to attend.", "May attend.", "Will probably attend."], 0, ""],
  ],
  [
    ["（聴解）「食べてみたら美味しかった」の流れは？", ["Tried eating → found delicious.", "Refused to eat.", "Cooked and ate.", "Ordered delivery."], 0, ""],
    ["（聴解）「思ったほど難しくない」の意味は？", ["Not as difficult as expected.", "More difficult than expected.", "Exactly as expected.", "Cannot judge."], 0, ""],
    ["（聴解）「〜たことがある」は何を聞き取るべきか？", ["Whether something has been experienced before.", "When it was experienced.", "Why it was experienced.", "Who experienced it."], 0, ""],
    ["（聴解）「ことにした」vs「ことになった」：自分の決断は？", ["ことにした (own decision)", "ことになった (external decision)", "No difference", "Both are orders"], 0, ""],
  ],
  [
    ["（聴解）「彼女は疲れているみたいです」の確信度は？", ["Casual observation-based inference.", "Certain knowledge.", "Hearsay.", "Strong logical deduction."], 0, ""],
    ["（聴解）「たとえ雨でも行きます」の意味は？", ["Will go even if it rains.", "Won't go if it rains.", "Will go only if sunny.", "Depends on rain amount."], 0, ""],
    ["（聴解）「〜ように言いました」は何を表す？", ["Reported instruction (told someone to).", "Direct command.", "Hearsay.", "Prohibition."], 0, ""],
    ["（聴解）「健康のために運動する」の「ために」の機能は？", ["Purpose / for the sake of.", "Cause / because.", "Condition.", "Hearsay."], 0, ""],
  ],
  [
    ["（聴解）「書かされました」は何形？", ["Causative-passive (was forced to write).", "Passive (was written).", "Causative (made write).", "Plain past."], 0, ""],
    ["（聴解）「試験に合格できるように練習します」の「ように」は？", ["Purpose — so that I can pass.", "While passing.", "Because I passed.", "Hearsay about passing."], 0, ""],
    ["（聴解）「〜てあります」の意味は？", ["Resultant state — something has been done (and remains).", "Someone is doing it.", "Preparation action.", "Accidental completion."], 0, ""],
    ["（聴解）話し手は「〜そうです」と「〜ようです」を混同していた。区別は？", ["そうです=hearsay; ようです=observation-based inference", "Both hearsay", "Both observation", "No distinction possible"], 0, ""],
  ],
];

export function buildWeek2N4SubTests(): JapaneseWeeklySubTest[] {
  return buildN4FivePaperWeek({
    weekPrefix: "jn4-w2",
    vocabBlocks: VOCAB_BLOCKS,
    grammarBlocks: GRAMMAR_BLOCKS,
    readingBlocks: READING_BLOCKS,
    listeningMcqBlocks: LISTENING_MCQ_BLOCKS,
    listeningIntroForTest: (testNum, tid): JapaneseWeeklyTestItem =>
      n4ListeningIntro(
        `${tid}-l-intro`,
        `聴解（N4 Week 2 · Test ${testNum}）：Minna II L33–39 の表現──と思っています・たことがある・てみる・でしょう・かもしれません・はずです・そうです・らしい・ようです・みたいです。`,
        testNum <= 2
          ? "2回聞き、意図（と思っています）と経験（たことがある）の表現をメモしてください。"
          : testNum <= 4
            ? "1回聞き、各推量マーカーの確信度の違いに注意してください。"
            : "通常スピード1回：すべての推量・義務・目的表現をリアルタイムで識別。",
        [33, 34, 35, 36, 37],
      ),
    paperSubtitle: {
      en: "JLPT N4 Week 2 Test — Minna II Lessons 33–39",
      np: "JLPT N4 हप्ता २ परीक्षा — मिन्ना II पाठ ३३–३९",
      jp: "JLPT N4 第2週テスト · みんなの日本語II 第33–39課",
    },
    paperIntro:
      "Test 1 が最も易しく Test 5 が最も難しい。推量・義務・目的・伝聞などのマーカーを区別することに集中してください。",
  });
}
