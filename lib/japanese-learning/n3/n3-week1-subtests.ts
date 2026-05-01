/**
 * Week 1 · Days 1–7 · N3 Grammar Topics 1–7 · five JLPT N3-style papers.
 * Test 1 = easiest (recognition) → Test 5 = hardest (inference + mixed forms).
 * Topics: てある, relative clauses, のに, ために, ように, conditionals, はずだ/べきだ
 */

import type { JapaneseWeeklySubTest, JapaneseWeeklyTestItem } from "@/lib/japanese-learning/types";
import {
  buildN3FivePaperWeek,
  n3ListeningIntro,
  type McqPoolRow,
} from "@/lib/japanese-learning/n3/n3-subtest-shared";

// ─── VOCAB ────────────────────────────────────────────────────────────────────
const VOCAB_BLOCKS: McqPoolRow[][] = [
  // Test 1 — recognition
  [
    ["「てある」の基本的な意味は？", ["resulting state (done for a purpose)", "ongoing action", "accidental completion", "future plan"], 0, "〜てある = the result of a deliberate action remains."],
    ["「準備してある」の意味は？", ["preparations have been made", "I am preparing", "I will prepare", "I forgot to prepare"], 0, "〜してある = has been done and the result is there."],
    ["「ために」で表すのは？", ["purpose or cause/reason", "condition", "contrast", "hearsay"], 0, "〜ために = for the purpose of / because of."],
    ["「ように」の主な意味は？", ["so that / in order to", "because", "although", "as if"], 0, "〜ように = goal or manner direction."],
    ["「はずだ」の意味は？", ["expectation / should be", "possibility", "obligation", "command"], 0, "〜はずだ = logical expectation based on evidence."],
  ],
  // Test 2 — basic usage
  [
    ["「窓が開けてある」は何を表す？", ["Window has been left open (by someone).", "Window is being opened.", "Window will be opened.", "Window broke open."], 0, "てある = result-state of deliberate action."],
    ["「試験に合格するために」の「ために」は？", ["purpose (in order to pass)", "cause (because of)", "time (at the time of)", "contrast"], 0, "Verb dict-form + ために = purpose."],
    ["「病気にならないように」の意味は？", ["so as not to get sick", "because I got sick", "although I am sick", "if I get sick"], 0, "〜ないように = so that … not."],
    ["「のに」（逆接）の用法として正しいのは？", ["Unexpected or contradictory result", "Same-direction cause", "Purpose", "Condition"], 0, "〜のに = unexpected result / complaint."],
    ["「べきだ」の意味は？", ["should / ought to (moral obligation)", "probably will", "want to", "was forced to"], 0, "〜べきだ = moral or social obligation."],
  ],
  // Test 3 — collocation and context
  [
    ["「ドアに鍵がかけてある」の場面として自然なのは？", ["The door has been locked (by someone).", "Someone is locking the door right now.", "The door is unlocked.", "The door is broken."], 0, ""],
    ["「健康のために運動します」の「ために」の用法は？", ["purpose (in order to be healthy)", "cause (because of health)", "contrast", "condition"], 0, "名詞 + のために = for the sake of."],
    ["「彼は来るはずだ」は何を表す？", ["He should come (speaker expects it).", "He must come (command).", "He might come.", "He came."], 0, ""],
    ["「ば」条件形の特徴として正しいのは？", ["General / reversible conditions", "Single past event", "Permission", "Hearsay"], 0, "〜ば = reversible or general condition."],
    ["「たら」条件形の特徴として正しいのは？", ["Sequential event or single completed condition", "General truth", "Command", "Negation"], 0, "〜たら = sequential or single event condition."],
  ],
  // Test 4 — nuance and near-synonym
  [
    ["「てある」と「ている」の違いで正しいのは？", ["てある focuses on result-state from deliberate action; ている focuses on ongoing state or process.", "Both mean the same.", "ている is result-only.", "てある is for ongoing actions."], 0, ""],
    ["「ように」（目的）と「ために」（目的）の違いは？", ["ために uses volitional verb; ように uses potential or non-volitional verb.", "No difference.", "ように is negative only.", "ために is for nouns only."], 0, ""],
    ["「のに」（逆接）と「けれど」の違いは？", ["のに carries more complaint/surprise nuance.", "No difference.", "けれど is stronger negation.", "のに is positive contrast."], 0, ""],
    ["「はずだ」と「べきだ」の違いは？", ["はずだ = expectation; べきだ = obligation.", "Both mean obligation.", "べきだ = prediction.", "はずだ = command."], 0, ""],
    ["「なら」条件の特徴として正しいのは？", ["Topic-based condition (given that / if it is true that)", "Sequential event", "General truth", "Irreversible change"], 0, "〜なら = topic-conditional (suppositional)."],
  ],
  // Test 5 — integration + inference
  [
    ["「報告書が書いてある」の意味として最も正しいのは？", ["The report has been written and remains (result-state).", "Someone is writing the report now.", "The report will be written.", "The report was accidentally written."], 0, ""],
    ["「速く走れるように毎日練習する」の構造は？", ["ように (goal) + non-volitional potential verb 走れる.", "ために (purpose) + volitional verb.", "のに (unexpected) + adjective.", "ので (cause) + result."], 0, ""],
    ["「一生懸命勉強したのに、落ちてしまった」の「のに」の機能は？", ["Complaint about unexpected failure despite effort.", "Cause: studied → passed.", "Purpose: study in order to fail.", "Condition: if I study, I fail."], 0, ""],
    ["「プロの医者が言ったのだから、正しいはずだ」の論拠は？", ["Logical expectation from professional authority.", "Hearsay from a stranger.", "Personal preference.", "Command from a superior."], 0, ""],
    ["「学生なら、もっと勉強すべきだ」の含意は？", ["Given you are a student, you ought to study more.", "Because you studied, you became a student.", "Although you are a student, you cannot study.", "After being a student, you should study."], 0, ""],
  ],
];

// ─── GRAMMAR ──────────────────────────────────────────────────────────────────
const GRAMMAR_BLOCKS: McqPoolRow[][] = [
  // Test 1
  [
    ["ドアが開け（　）います。（result-state）", ["てあり", "ており", "てしまい", "てみ"], 0, "開けてあります = has been left open (deliberate result)."],
    ["試験に合格する（　）、毎日勉強します。", ["ために", "ように", "のに", "ので"], 0, "合格するために = in order to pass (volitional purpose)."],
    ["忘れない（　）メモしておきます。", ["ように", "ために", "のに", "ので"], 0, "忘れないように = so as not to forget (potential/non-volitional)."],
    ["時間があれ（　）、手伝いますよ。", ["ば", "たら", "なら", "ので"], 0, "〜ば = general conditional."],
    ["彼は来る（　）です。（expectation）", ["はず", "べき", "よう", "らしい"], 0, "〜はずです = logical expectation."],
    ["医者に行く（　）です。（obligation）", ["べき", "はず", "よう", "ため"], 0, "〜べきです = should / ought to."],
  ],
  // Test 2
  [
    ["花が飾っ（　）あります。", ["て", "に", "が", "で"], 0, "飾ってあります = flowers have been arranged (result)."],
    ["健康（　）ために、野菜を食べます。", ["の", "が", "で", "に"], 0, "健康のために = for the sake of health."],
    ["先生に聞ける（　）、質問をまとめておきます。", ["ように", "ために", "のに", "から"], 0, "聞けるように = so that I can ask (potential + ように)."],
    ["宿題をした（　）、先生に褒められませんでした。", ["のに", "ので", "から", "けれど"], 0, "〜のに = despite doing homework, wasn't praised (complaint)."],
    ["電車なら、20分で（　）はずです。", ["着ける", "着けた", "着かない", "着こう"], 0, "〜はずです + potential = should be able to arrive."],
    ["規則を守る（　）です。", ["べき", "はず", "よう", "みたい"], 0, "〜べきです = ought to follow the rules."],
  ],
  // Test 3
  [
    ["薬が準備し（　）あります。", ["て", "が", "に", "で"], 0, "準備してあります = medicine has been prepared."],
    ["試験に受かる（　）頑張ります。", ["ために", "ように", "のに", "のは"], 0, "試験に受かるために = volitional purpose."],
    ["間違えない（　）気をつけています。", ["ように", "ために", "のに", "ので"], 0, "間違えないように = so as not to make mistakes."],
    ["あれほど練習した（　）、優勝できなかった。", ["のに", "ので", "から", "ため"], 0, "〜のに = unexpected failure despite practice."],
    ["今日中に終わる（　）です。（expectation）", ["はず", "べき", "よう", "らしい"], 0, ""],
    ["毎日復習する（　）です。（should）", ["べき", "はず", "よう", "みたい"], 0, ""],
  ],
  // Test 4
  [
    ["この料理は子どもでも食べられる（　）作りました。", ["ように", "ために", "のに", "ので"], 0, "食べられるように = so that even children can eat it."],
    ["医者に行った（　）、薬をもらいませんでした。", ["のに", "ので", "から", "ため"], 0, "〜のに = despite going to the doctor (complaint)."],
    ["雨が降れ（　）試合は中止します。", ["ば", "たら", "なら", "ので"], 0, "〜ば = if it rains (general condition)."],
    ["君が行か（　）、僕が行く。", ["ないなら", "なければ", "なくて", "ないで"], 0, "〜ないなら = given that you won't go."],
    ["新幹線で行け（　）、3時間で着くはずです。", ["ば", "たら", "なら", "で"], 0, "〜ば = if you go by Shinkansen."],
    ["もっと丁寧に話す（　）です。（obligation）", ["べき", "はず", "よう", "かも"], 0, ""],
  ],
  // Test 5
  [
    ["「メモが貼ってある」と「メモが貼られている」の違いは？", ["てある = deliberate result by agent; られている = passive state (agent may be unknown).", "No difference.", "られている = accidental.", "てある = ongoing action."], 0, ""],
    ["「ように」と「ために」を使い分けるポイントは？", ["ために after volitional verb; ように after potential/non-volitional or stative verb.", "Same usage.", "ように is for negatives only.", "ために is for adjectives."], 0, ""],
    ["「のに」（逆接）が示す感情は？", ["Disappointment or complaint at unexpected result.", "Neutral contrast.", "Positive surprise.", "Permission."], 0, ""],
    ["「はずがない」の意味は？", ["There is no way it could be true (strong negation of expectation).", "It is expected.", "It should not happen.", "It is possible."], 0, "〜はずがない = impossible / cannot be."],
    ["「べきではない」の意味は？", ["Should not / ought not to.", "Should definitely do.", "Expected not to.", "Will not."], 0, "〜べきではない = ought not to."],
  ],
];

// ─── READING ─────────────────────────────────────────────────────────────────
const READING_BLOCKS: McqPoolRow[][] = [
  // Test 1
  [
    ["【文】冷蔵庫に飲み物が入れてある。\n意味は？", ["Drinks have been put in the fridge (by someone).", "Drinks are being put in.", "The fridge is empty.", "Drinks will be put in later."], 0, ""],
    ["【文】健康のために毎日運動しています。\n「のために」は何を表す？", ["Purpose — for the sake of health.", "Cause — because of health.", "Contrast.", "Condition."], 0, ""],
    ["【文】忘れないようにメモを書きます。\n何のために書く？", ["So as not to forget.", "Because I forgot.", "Although I remember.", "After forgetting."], 0, ""],
    ["【文】あんなに勉強したのに、試験に落ちてしまった。\n話者の気持ちは？", ["Disappointed and frustrated.", "Happy with the result.", "Indifferent.", "Proud."], 0, ""],
    ["【文】彼女はもう家に着いているはずです。\n話者の根拠は何？", ["Logical expectation based on time/schedule.", "Personal wish.", "Hearsay.", "Command."], 0, ""],
  ],
  // Test 2
  [
    ["【文】部屋がきれいに掃除してあります。\nしたのは誰ですか？", ["Someone (deliberately) cleaned the room.", "No one cleaned it.", "The room cleaned itself.", "I am cleaning right now."], 0, ""],
    ["【文】試験に合格するために一生懸命勉強します。\n勉強の目的は？", ["To pass the exam.", "Because of the exam.", "Despite the exam.", "After the exam."], 0, ""],
    ["【文】毎日練習するようにしています。\n何を目指している？", ["Making a conscious effort to practice every day.", "Forced to practice.", "Already practiced.", "Will practice once."], 0, ""],
    ["【文】彼は優しいのに、なぜか嫌われている。\n文の特徴は？", ["Unexpected result despite positive trait.", "Expected result.", "Cause and effect.", "Condition."], 0, ""],
    ["【文】今日中に仕上がるはずです。\n話者は何を伝えている？", ["Logical expectation of completion today.", "Absolute certainty.", "Uncertainty.", "Command to finish."], 0, ""],
  ],
  // Test 3
  [
    ["【文】資料が印刷してあります。発表の準備ができています。\n「してある」が表すのは？", ["Documents have been printed (deliberate, ready-state).", "Someone is printing now.", "Documents need to be printed.", "Documents were accidentally printed."], 0, ""],
    ["【文】体重を減らすために食事制限をしています。\n「ために」の働きは？", ["Purpose: in order to lose weight.", "Cause: because of weight loss.", "Time: while losing weight.", "Condition: if weight reduces."], 0, ""],
    ["【文】どんなに頑張ったのに、認めてもらえなかった。\n話者が訴えたいことは？", ["Unfair result despite hard effort.", "Fair outcome.", "Expected disappointment.", "No effort was made."], 0, ""],
    ["【文】医者に診てもらえば、原因がわかるはずです。\n「はずです」の根拠は？", ["Logical inference from going to a doctor.", "Hearsay from a friend.", "Personal wish.", "Absolute certainty."], 0, ""],
    ["【文】社会人として、時間を守るべきです。\n「べきです」が表す意味は？", ["Moral/social obligation.", "Prediction.", "Expectation.", "Wish."], 0, ""],
  ],
  // Test 4
  [
    ["【文】夕食の準備が全部してあります。後は食べるだけです。\n状況は？", ["Everything is ready; just need to eat.", "Nothing is prepared.", "They are preparing now.", "They forgot to prepare."], 0, ""],
    ["【文】試験まで時間がないのに、まだ遊んでいる。\n話者の感情は？", ["Frustration / concern that they are wasting time.", "Admiration.", "Approval.", "Indifference."], 0, ""],
    ["【文】もし問題があれば、すぐに連絡してください。\n「あれば」の条件は？", ["If there is a problem (general condition).", "After there is a problem.", "Because there is a problem.", "Despite a problem."], 0, ""],
    ["【文】彼ならきっと解決できるはずです。\n「なら」の機能は？", ["Topic conditional — given that it's him.", "Sequential event.", "Hearsay.", "Command."], 0, ""],
    ["【文】人の悪口を言うべきではありません。\n意味は？", ["You should not speak ill of others.", "You should speak ill of others.", "It's expected to speak ill of others.", "It's possible to speak ill of others."], 0, ""],
  ],
  // Test 5
  [
    ["【文】ここに名前が書いてあるということは、誰かが来たはずだ。\n推論の構造は？", ["Result-state (書いてある) as evidence for logical expectation (はずだ).", "Hearsay + wish.", "Condition + obligation.", "Contrast + negation."], 0, ""],
    ["【文】子どもでも読めるように、平仮名で書きました。\n「読めるように」の意味は？", ["So that even children can read (potential + ように).", "Because children can read.", "Although children can read.", "If children can read."], 0, ""],
    ["【文】準備は完璧にしたのに、当日は雨で中止になった。\n筆者が感じているのは？", ["Frustration at perfect prep being wasted due to rain.", "Relief that it was cancelled.", "Indifference.", "Joy at the rain."], 0, ""],
    ["【文】この分野のプロが言うのだから、正しいはずがない、などということはない。\nどういう意味か？", ["Since a professional says it, there's no reason it could be wrong.", "A professional must be wrong.", "It's possible the professional is wrong.", "The professional has not spoken."], 0, ""],
    ["【文】約束を守るべきだというのは、社会の基本だ。\n「べきだ」の用法の特徴は？", ["べきだ expresses a normative social obligation.", "べきだ expresses hearsay.", "べきだ expresses prediction.", "べきだ expresses a wish."], 0, ""],
  ],
];

// ─── LISTENING MCQs ───────────────────────────────────────────────────────────
const LISTENING_MCQ_BLOCKS: McqPoolRow[][] = [
  // Test 1
  [
    ["（聴解）「地図が貼ってあります」の意味は？", ["A map has been posted (deliberate result).", "Someone is posting a map.", "The map fell.", "There is no map."], 0, ""],
    ["（聴解）「健康のために」はどんな意味？", ["for the sake of health (purpose)", "because of health (cause)", "although healthy", "if healthy"], 0, ""],
    ["（聴解）「忘れないように」の意味は？", ["so as not to forget", "because I forgot", "after forgetting", "if I forget"], 0, ""],
    ["（聴解）「来るはずです」の確信度は？", ["logical expectation (should come)", "certain (will definitely come)", "mere wish", "direct command"], 0, ""],
  ],
  // Test 2
  [
    ["（聴解）「資料が準備してある」から、会議は始まれますか。", ["Yes — preparations are complete (result-state).", "No — still preparing.", "Unknown.", "After the meeting."], 0, ""],
    ["（聴解）「ために」と「ように」の使い分けで正しいのは？", ["ために: volitional purpose; ように: potential/non-volitional goal.", "No difference.", "ように is for negatives.", "ために is for adjectives."], 0, ""],
    ["（聴解）「頑張ったのに」はどんな気持ちを示す？", ["Complaint/frustration at unexpected result.", "Gratitude.", "Approval.", "Certainty."], 0, ""],
    ["（聴解）「来るべきだ」の意味は？", ["ought to come (moral/social obligation)", "expected to come", "will probably come", "wants to come"], 0, ""],
  ],
  // Test 3
  [
    ["（聴解）「ドアに鍵がかけてある」状況はどれですか。", ["The door has been deliberately locked.", "The door is being locked now.", "The door is broken.", "No key exists."], 0, ""],
    ["（聴解）「雨が降れば、試合は中止です」の条件は？", ["If it rains (general condition ば).", "After it rains.", "Because it rained.", "Despite the rain."], 0, ""],
    ["（聴解）「間に合うはずがない」の意味は？", ["There is no way we'll make it in time.", "We should make it.", "We might make it.", "We must make it."], 0, ""],
    ["（聴解）「学生なら勉強すべきだ」の「なら」は？", ["Topic conditional (given that you are a student).", "Temporal (when you are a student).", "Causal (because you are a student).", "Contrast (although a student)."], 0, ""],
  ],
  // Test 4
  [
    ["（聴解）「明日の準備がしてある」はどういう意味ですか。", ["Tomorrow's preparations are done and ready.", "We are preparing for tomorrow.", "Nothing is prepared.", "We will prepare tomorrow."], 0, ""],
    ["（聴解）「速く泳げるように練習します」の「ように」の意味は？", ["so that I can swim fast (potential goal)", "in order to swim fast (volitional purpose)", "because I can swim fast", "after swimming fast"], 0, ""],
    ["（聴解）「そんなにお金があるのに、どうして使わないの？」の気持ちは？", ["Surprise and mild reproach at unexpected thriftiness.", "Admiration for saving money.", "Envy.", "Approval."], 0, ""],
    ["（聴解）「医者に行くべきでした」の意味は？", ["Should have gone to the doctor (past obligation unmet).", "Expected to go to the doctor.", "Did go to the doctor.", "Will go to the doctor."], 0, ""],
  ],
  // Test 5
  [
    ["（聴解）「てある」と「ている」を聞き分けるポイントは？", ["てある = deliberate result-state; ている = ongoing action or state.", "Both sound identical.", "てある is for negatives.", "ている is for result only."], 0, ""],
    ["（聴解）「来るはずだったのに、来なかった」の意味は？", ["Expected to come but didn't (disappointed expectation).", "Came as expected.", "Might not come.", "Must come."], 0, ""],
    ["（聴解）「プロとして恥ずかしくない行動をすべきだ」の「べきだ」の機能は？", ["normative obligation for a professional", "prediction of behavior", "hearsay about behavior", "wish for behavior"], 0, ""],
    ["（聴解）「準備ができているはずなのに、うまくいかない」の感情は？", ["Frustration at unexpected failure despite readiness.", "Satisfaction.", "Indifference.", "Certainty of success."], 0, ""],
  ],
];

export function buildWeek1N3SubTests(): JapaneseWeeklySubTest[] {
  return buildN3FivePaperWeek({
    weekPrefix: "jn3-w1",
    vocabBlocks: VOCAB_BLOCKS,
    grammarBlocks: GRAMMAR_BLOCKS,
    readingBlocks: READING_BLOCKS,
    listeningMcqBlocks: LISTENING_MCQ_BLOCKS,
    listeningIntroForTest: (testNum, tid): JapaneseWeeklyTestItem =>
      n3ListeningIntro(
        `${tid}-l-intro`,
        `聴解（N3 Week 1 · Test ${testNum}）：N3文法の「てある」「ために/ように」「のに」「はずだ/べきだ」「条件形（ば/たら/なら）」を含む会話・場面問題です。`,
        testNum <= 2
          ? "ゆっくりした会話を1回聞き、結果状態・目的・逆接の表現をメモしてください。"
          : testNum <= 4
            ? "自然なスピードで2回聞き、てある・ために・ように・のに・はずだ・べきだの使用をメモしてください。"
            : "通常スピードで1回のみ聞き、すべての文法ポイントをリアルタイムで識別してください。",
        [1, 2, 3, 4, 5],
      ),
    paperSubtitle: {
      en: `JLPT N3 Week 1 Test — Grammar Topics 1–7`,
      np: `JLPT N3 हप्ता १ परीक्षा — व्याकरण विषय १–७`,
      jp: `JLPT N3 第1週テスト · 文法トピック1–7`,
    },
    paperIntro:
      "語彙・漢字から始め、文法・読解・聴解の順に解いてください。Test 1が最も易しく、Test 5が最も難しいです。",
  });
}
