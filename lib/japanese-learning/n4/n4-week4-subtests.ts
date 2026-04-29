/**
 * Week 4 · Days 22–28 · Minna II L47–50 + N4 Sprint · five JLPT N4-style papers.
 * Focus: causative, causative-passive, はず/ほど, full N4 grammar integration.
 * Test 1 = elementary review; Test 5 = near JLPT N4 difficulty.
 */

import type { JapaneseWeeklySubTest, JapaneseWeeklyTestItem } from "@/lib/japanese-learning/types";
import {
  buildN4FivePaperWeek,
  n4ListeningIntro,
  type McqPoolRow,
} from "@/lib/japanese-learning/n4/n4-subtest-shared";

const VOCAB_BLOCKS: McqPoolRow[][] = [
  [
    ["「使役」とは何形か？", ["Causative — make/let someone do", "Passive", "Potential", "Plain form"], 0, ""],
    ["「受け身」とは何形か？", ["Passive — be acted upon by someone", "Causative", "Causative-passive", "Plain form"], 0, ""],
    ["「〜はずです」の意味は？", ["Should be / expected (logical)", "Maybe", "Definitely", "Hearsay"], 0, ""],
    ["「〜ほど〜ない」の意味は？", ["Not to the extent of / not as … as", "More than", "Exactly as", "Will not reach"], 0, ""],
    ["「準備ができた」の意味は？", ["Is ready / preparation complete", "Not ready", "Starting preparation", "Gave up preparing"], 0, ""],
  ],
  [
    ["「させてもらう」の意味は？", ["Receive permission to do", "Force someone to do", "Be forced to do", "Decided to do"], 0, ""],
    ["「〜ことになる」vs「〜ことにする」：外部決定は？", ["〜ことになる (decided by circumstances)", "〜ことにする (own decision)", "Neither", "Both are external"], 0, ""],
    ["「後悔する」の意味は？", ["Regret", "Feel glad", "Be surprised", "Be angry"], 0, ""],
    ["「臨む」の意味は？", ["Face / attend to something (with attitude)", "Avoid", "Ignore", "Rest"], 0, ""],
    ["「合格する」の意味は？", ["Pass (exam/test)", "Fail", "Withdraw", "Apply"], 0, ""],
  ],
  [
    ["「使役受け身」の形は？", ["Causative + passive combined", "Passive only", "Causative only", "Potential only"], 0, ""],
    ["「〜ほど〜ない」の前の形は？", ["た形 + ほど", "て形 + ほど", "ない形 + ほど", "ます形 + ほど"], 0, ""],
    ["「〜させていただく」（very formal）の意味は？", ["I humbly request to be allowed to do", "I force you to do", "I was made to do", "I will definitely do"], 0, ""],
    ["「〜されます / 〜られます」の違いは？", ["〜されます=irregular passive (する); 〜られます=G2 passive / potential", "No difference", "〜されます=causative; 〜られます=passive", "Both are causatives"], 0, ""],
    ["「〜というのは」の機能は？", ["Introduces a definition/explanation", "Marks a question", "Expresses regret", "Marks completion"], 0, ""],
  ],
  [
    ["「G1 使役受け身 短縮形」：書く → ？", ["書かされる", "書かれる", "書かせる", "書かれさせる"], 0, ""],
    ["「G2 使役受け身」：食べる → ？", ["食べさせられる", "食べられる", "食べさせる", "食べされる"], 0, ""],
    ["「させてください」の場面は？", ["Politely requesting permission to do something", "Ordering someone", "Forcing someone", "Complaining"], 0, ""],
    ["「〜てしまう」（完了・後悔）の縮約形は？", ["〜ちゃう / 〜ちゃった", "〜ておく", "〜てくる", "〜ていく"], 0, ""],
    ["「はずです」と「でしょう」の共通点は？", ["Both express conjecture/expectation", "Both are hearsay", "Both are past tense", "Both express obligation"], 0, ""],
  ],
  [
    ["N4 頻出：「食べられる」の二義（ambiguity）は？", ["Passive AND potential", "Passive AND causative", "Potential AND causative", "One meaning only"], 0, ""],
    ["「〜させてもらいたい」と「〜させていただきたい」の差は？", ["いただきたい is more humble/formal (keigo)", "No difference", "もらいたい is more formal", "Both extremely casual"], 0, ""],
    ["「〜なくてはいけない」vs「〜なければならない」: どちらが書き言葉に多い？", ["〜なければならない", "〜なくてはいけない", "Both equally formal", "Both are informal only"], 0, ""],
    ["「〜ことになっています」の意味は？", ["It is established/arranged that (current standing rule)", "Personal decision", "Hearsay", "Logical expectation"], 0, ""],
    ["「〜ようになる」と「〜ようにする」の差は？", ["なる=gradual natural change; する=volitional effort", "なる=volitional; する=natural", "Same", "なる=past; する=future"], 0, ""],
  ],
];

const GRAMMAR_BLOCKS: McqPoolRow[][] = [
  [
    ["先生が学生に宿題をし（　）ました。（causative）", ["させ", "され", "させられ", "させて"], 0, "させました."],
    ["私は親に野菜を食べ（　）られました。（causative-passive）", ["させ", "されて", "され", "させて"], 0, "食べさせられました."],
    ["この問題は思った（　）難しくないはずです。", ["ほど", "より", "くらい", "だけ"], 0, "思ったほど."],
    ["田中さんは来る（　）です。（logical expectation）", ["はず", "よう", "みたい", "らしい"], 0, "はずです."],
    ["コンピューターを使わ（　）てもらいました。", ["せ", "れ", "させ", "られ"], 0, "使わせてもらいました."],
    ["先生に宿題を出す（　）に言われました。", ["よう", "こと", "ため", "ほど"], 0, "ように言われました."],
  ],
  [
    ["子供のころ毎日練習（　）られました。（causative-passive: G2）", ["させ", "され", "させて", "させれ"], 0, "させられました."],
    ["書類を全部読（　）てください。（causative — make/let read）", ["ませ", "まれ", "まえ", "まあ"], 0, "読ませてください."],
    ["電車が来る（　）です。もうすぐ着くはずです。", ["はず", "よう", "みたい", "らしい"], 0, ""],
    ["今まで経験した中で、これが一番難しかった（　）です。（should have been）", ["はず", "よう", "みたい", "らしい"], 0, ""],
    ["新入社員に仕事を（　）せてみました。", ["やら", "やれ", "やり", "やら"], 0, "やらせてみました."],
    ["この本はあの本（　）面白くないはずです。", ["ほど", "より", "だけ", "くらい"], 0, "〜ほど〜ない."],
  ],
  [
    ["先生に発音を直（　）れました。（passive）", ["さ", "せ", "させ", "させて"], 0, "直されました."],
    ["彼女は部長に残業（　）させられました。", ["を", "が", "に", "で"], 0, "残業を or 残業させられた."],
    ["使わ（　）てもらうことにしました。", ["せ", "れ", "させ", "られ"], 0, "使わせてもらう."],
    ["私はいつも会議の前に資料を読（　）ておきます。", ["ん", "め", "み", "も"], 0, "読んでおきます."],
    ["もし合格できなけれ（　）、もう一度挑戦します。", ["ば", "たら", "ても", "から"], 0, "〜ば条件."],
    ["先生（　）学生に宿題をさせました。（agent marking causative）", ["が", "は", "に", "で"], 0, "先生が学生に."],
  ],
  [
    ["上司（　）報告書を書かされました。（causative-passive agent に）", ["に", "が", "は", "を"], 0, "上司に書かされました."],
    ["部長は新人（　）仕事を教えさせました。（causative subject）", ["に", "が", "は", "で"], 0, "新人に教えさせました."],
    ["試験に合格でき（　）はずです。諦めないでください。", ["る", "た", "ない", "ている"], 0, "合格できるはずです."],
    ["「〜ようにする」の ように の前の形は？", ["Plain/dict form", "て形", "ます形", "た形"], 0, ""],
    ["「〜ことになっています」は規則や取り決めを表す。例文：", ["8時に来ることになっています", "8時に来ることにしました", "8時に来るはずです", "8時に来るようです"], 0, ""],
    ["「〜させていただきます」は何形か（丁寧度）？", ["Very formal/humble causative request", "Casual causative", "Prohibition", "Obligation"], 0, ""],
  ],
  [
    ["G1動詞「切る（きる）」の使役受け身（短縮）は？", ["切らされる", "切られる", "切らせる", "切れる"], 0, ""],
    ["「食べさせてもらいました」の構造を分析すると？", ["Causative + てもらう (was allowed to eat)", "Passive + てもらう", "Causative-passive alone", "Simple past"], 0, ""],
    ["「〜はずだったのに、〜なかった」の意味は？", ["Expected but didn't happen (disappointed expectation)", "Planned and succeeded", "Hearsay that was true", "Obligation fulfilled"], 0, ""],
    ["「〜ようになっている」（社会的取り決め）の例：", ["学校では8時から授業が始まるようになっています", "毎日勉強するようにしています", "日本語が話せるようになりました", "読むように言いました"], 0, ""],
    ["「〜ところです」（just about to / just did / in the middle of）: 「今食べているところです」の意味は？", ["In the middle of eating right now", "Just finished eating", "About to eat", "Finished long ago"], 0, ""],
    ["「〜てしまっていた」（had already completed — regret in retrospect）の例：", ["宿題を忘れてしまっていた", "宿題をしておいた", "宿題をしてみた", "宿題をさせた"], 0, ""],
  ],
];

const READING_BLOCKS: McqPoolRow[][] = [
  [
    ["【文】先生が学生に宿題をさせました。\n「させました」は？", ["Causative — teacher had students do homework.", "Passive.", "Causative-passive.", "Plain past."], 0, ""],
    ["【文】親に野菜を食べさせられました。\n「食べさせられました」は？", ["Causative-passive — was forced to eat.", "Causative.", "Passive.", "Potential."], 0, ""],
    ["【文】この問題は思ったほど難しくないはずです。\n「はず」の確信は？", ["Logical expectation (not a guess).", "Hearsay.", "Appearance.", "No certainty."], 0, ""],
    ["【文】コンピューターを使わせてもらいました。\n意味は？", ["Was allowed to use the computer.", "Forced to use it.", "Used it alone.", "Couldn't use it."], 0, ""],
    ["【文】先生に宿題を出すように言われました。\n「言われました」は？", ["Passive — was told by teacher.", "Causative.", "Causative-passive.", "Plain past."], 0, ""],
  ],
  [
    ["【文】今まで一番難しかった試験だったはずです。でも合格できました。\nはずと結果は？", ["Expected difficult, but still passed.", "Expected easy, failed.", "Expected and was correct.", "No expectation."], 0, ""],
    ["【文】新入社員に仕事を教えさせてみました。効果がありましたか。\n「させてみました」の機能は？", ["Causative + trial (had them try doing).", "Passive + trial.", "Causative-passive.", "Simple past."], 0, ""],
    ["【文】子供のころ、毎日ピアノを練習させられました。今は感謝しています。\n現在の気持ちは？", ["Grateful now after being forced to practice.", "Still resentful.", "Never practiced.", "Doesn't remember."], 0, ""],
    ["【文】この仕事はあの仕事ほど大変ではないはずです。\nどちらが大変？", ["The other job is (expected to be) harder.", "This job is harder.", "Both equally hard.", "Both easy."], 0, ""],
    ["【文】学生に資料を読ませておきました。準備は万端です。\n複合形の意味は？", ["Causative + ておく: had them read in advance (prep).", "Passive + ておく.", "Causative-passive.", "Plain past."], 0, ""],
  ],
  [
    ["【文】部長に残業させられましたが、おかげで仕事が終わりました。\n感情は？", ["Forced but the outcome was positive.", "Happy to do overtime.", "Refused overtime.", "Didn't finish the work."], 0, ""],
    ["【文】資料を全部読んでおくように上司に言われました。\nどんな指示？", ["Passive instruction to read in advance.", "Personal decision to read.", "Causative order.", "Hearsay about reading."], 0, ""],
    ["【文】「〜ことになっています」と「〜ことにしています」の例を読んで判断：\n「学校では制服を着ることになっています」は？", ["External rule/arrangement (not personal decision).", "Personal habit.", "Hearsay.", "Logical expectation."], 0, ""],
    ["【文】仕事が忙しかったが、諦めずに続けた結果、合格できた。\n「諦めずに」の意味は？", ["Without giving up.", "After giving up.", "Before giving up.", "Because gave up."], 0, ""],
    ["【文】「食べさせてもらいました」の構造解析：", ["Causative (させる) + て-form + もらう (receive permission)", "Passive + もらう", "Causative-passive + もらう", "Simple te-form"], 0, ""],
  ],
  [
    ["【文】先生が学生に自由にスピーチをさせてくれました。\n「させてくれました」は？", ["Benevolent causative (teacher let students freely speak).", "Passive.", "Causative-passive.", "Obligation."], 0, ""],
    ["【文】この計画は思ったほど時間がかからないはずです。でも確認が必要です。\n論理構造は？", ["はず=logical expectation but still needs verification.", "Definite statement.", "Hearsay.", "No logic — pure guess."], 0, ""],
    ["【文】新人に任せたら、予想外に上手くいったという報告を受けた。\n「という」の機能は？", ["Report marker (indirect quotation).", "Direction marker.", "Obligation.", "Purpose."], 0, ""],
    ["【文】私は社長に直接話させていただくことにしました。\n全体の意味は？", ["Humbly requested permission to speak directly with president.", "Was forced to speak.", "Spoke without asking.", "Couldn't speak."], 0, ""],
    ["【文】「〜はずだったのに、実際は違った」という逆接文の例を見る：試験は簡単なはずだったのに、とても難しかった。\n意味は？", ["Expected easy but was actually difficult (disappointed expectation).", "Expected difficult and was difficult.", "No expectation.", "Hearsay about difficulty."], 0, ""],
  ],
  [
    ["【文】子供に自由に遊ばせてあげることが大切です。「させてあげる」は？", ["Benevolent causative (let do for someone's benefit).", "Causative-passive.", "Passive.", "Forced causative."], 0, ""],
    ["【文】「させていただく」の keigo スケールでの位置は？", ["Most humble/polite causative request form.", "Casual causative.", "Prohibition.", "Obligation marker."], 0, ""],
    ["【文】この仕事は私が思ったほど簡単ではありませんでした。実際は〜ほど〜なかった構文。\n構文の確認：", ["ほど=degree comparison (not as easy as thought)", "ほど=hearsay marker", "ほど=obligation", "ほど=purpose"], 0, ""],
    ["【文】上司が新人に仕事を「させてみた」ところ、意外と上手だったという報告があった。\n構造は？", ["Causative + trial (have someone try to see the result).", "Causative-passive.", "Passive + trial.", "Simple trial only."], 0, ""],
    ["【文】「〜ようになっている」（社会的・制度的取り決め）と「〜ようにしている」（個人的努力）の区別：\n「毎朝6時に起きるようにしている」は？", ["Personal voluntary effort/habit.", "Social rule.", "Legal requirement.", "Logical expectation."], 0, ""],
  ],
];

const LISTENING_MCQ_BLOCKS: McqPoolRow[][] = [
  [
    ["（聴解）「食べさせました」の形は？", ["Causative — made/let eat.", "Passive.", "Causative-passive.", "Plain past."], 0, ""],
    ["（聴解）「読まされました」の形は？", ["Causative-passive — was forced to read.", "Passive.", "Causative.", "Simple past."], 0, ""],
    ["（聴解）「はずです」の意味は？", ["Logical expectation.", "Hearsay.", "Appearance.", "Guess."], 0, ""],
    ["（聴解）「ほど〜ない」の意味は？", ["Not to the extent of / not as … as.", "More than.", "Exactly as.", "Always."], 0, ""],
  ],
  [
    ["（聴解）「使わせてもらいました」の意味は？", ["Was allowed to use.", "Forced to use.", "Used alone.", "Couldn't use."], 0, ""],
    ["（聴解）「させていただきます」のニュアンスは？", ["Very polite/humble permission request.", "Casual permission.", "Command.", "Prohibition."], 0, ""],
    ["（聴解）「残業させられた」は何を表す？", ["Was forced to do overtime (unwilling).", "Chose to do overtime.", "Allowed to do overtime.", "Enjoyed overtime."], 0, ""],
    ["（聴解）「合格できるはずです」の確信の根拠は？", ["Logical deduction (knows facts).", "Pure hope.", "Hearsay.", "Appearance."], 0, ""],
  ],
  [
    ["（聴解）「宿題をさせてみました」の複合形の意味は？", ["Causative + trial: had them try doing homework.", "Passive + trial.", "Causative-passive.", "Simple past."], 0, ""],
    ["（聴解）「〜ことになっています」の場面は？", ["Established rule/arrangement.", "Personal decision.", "Hearsay.", "Logical expectation."], 0, ""],
    ["（聴解）「食べさせてあげました」は何の形？", ["Benevolent causative (let eat for their benefit).", "Forced causative.", "Passive.", "Causative-passive."], 0, ""],
    ["（聴解）「読まされたおかげで」の意味の流れは？", ["Was forced to read + as a result (positive outcome).", "Refused to read.", "Read voluntarily.", "Forgot to read."], 0, ""],
  ],
  [
    ["（聴解）複合構文「〜てしまっていた」の意味は？", ["Had already completed (with regret in retrospect).", "Is still doing.", "About to do.", "Never did."], 0, ""],
    ["（聴解）「〜ようになっている」vs「〜ようにしている」：制度は？", ["〜ようになっている (established/societal arrangement)", "〜ようにしている (personal effort)", "Both same", "Both are personal"], 0, ""],
    ["（聴解）G1動詞の使役受け身短縮形：飲む → ？", ["飲まされる", "飲まれる", "飲ませる", "飲める"], 0, ""],
    ["（聴解）「〜はずだったのに」の意味は？", ["Expected X but it didn't happen (regret/disappointment).", "Expected and achieved.", "No expectation.", "Hearsay."], 0, ""],
  ],
  [
    ["（聴解）「させていただく」と「させてもらう」の差は？", ["いただく is humble/formal; もらう is neutral/casual", "No difference", "もらう is more formal", "Both extremely casual"], 0, ""],
    ["（聴解）「〜ているところです」の意味は？", ["Currently in the middle of doing.", "Just finished.", "About to start.", "Finished long ago."], 0, ""],
    ["（聴解）「〜ておいてもらいました」の複合構造は？", ["ておく (prep) + てもらう (receive favour) — had it done in advance for me", "Passive only", "Causative only", "Causative-passive"], 0, ""],
    ["（聴解）「思ったほど難しくなかったのに、合格できなかった」の逆接は？", ["のに=unexpected result (despite easier than expected, failed)", "のでthe reason", "たらconditional", "てもeven if"], 0, ""],
  ],
];

export function buildWeek4N4SubTests(): JapaneseWeeklySubTest[] {
  return buildN4FivePaperWeek({
    weekPrefix: "jn4-w4",
    vocabBlocks: VOCAB_BLOCKS,
    grammarBlocks: GRAMMAR_BLOCKS,
    readingBlocks: READING_BLOCKS,
    listeningMcqBlocks: LISTENING_MCQ_BLOCKS,
    listeningIntroForTest: (testNum, tid): JapaneseWeeklyTestItem =>
      n4ListeningIntro(
        `${tid}-l-intro`,
        `聴解（N4 Week 4 · Test ${testNum}）：Minna II L47–50 ＋ N4スプリント──使役・使役受け身・はずです・ほど・複合形。`,
        testNum <= 2
          ? "2回聞き、使役（させる）と使役受け身（させられる）をメモしてください。"
          : testNum <= 4
            ? "1回で使役/受け身/使役受け身の区別と、はずvs他の推量マーカーを識別。"
            : "通常スピード1回：全N4文法ポイントをリアルタイム識別——これが模試最終確認です。",
        [47, 48, 49, 50],
        26,
      ),
    paperSubtitle: {
      en: "JLPT N4 Week 4 Test — Minna II Lessons 47–50 + Sprint",
      np: "JLPT N4 हप्ता ४ परीक्षा — मिन्ना II पाठ ४७–५० + स्प्रिन्ट",
      jp: "JLPT N4 第4週テスト · みんなの日本語II 第47–50課 ＋ スプリント",
    },
    paperIntro:
      "Test 1 から Test 5 で難易度が段階的に上がります。Test 5 は本番 JLPT N4 と同等レベルです。使役・受け身・使役受け身・はずです・複合形を中心に確認してください。",
  });
}
