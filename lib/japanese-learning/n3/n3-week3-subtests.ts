/**
 * Week 3 · Days 15–21 · N3 Grammar Topics 15–21 · five JLPT N3-style papers.
 * Test 1 = easiest (recognition) → Test 5 = hardest (inference + mixed forms).
 * Topics: Honorifics (尊敬語), Humble (謙譲語), てもらう/てあげる/てくれる,
 *         ところ, ば〜ほど/ほど/くらい, ものだ/ものの, として/にとって
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
    ["「お〜になる」の意味は？", ["honorific form (subject does action respectfully)", "humble form", "passive form", "causative form"], 0, "尊敬語: お〜になる = honorific action by respected person."],
    ["「お〜する / ご〜する」の用法は？", ["humble form (speaker lowers themselves)", "honorific form", "passive form", "potential form"], 0, "謙譲語: お〜する = humble action by speaker."],
    ["「てもらう」の方向は？", ["Speaker/subject receives benefit of action done by someone else.", "Speaker gives benefit.", "Third party gives.", "No direction."], 0, "〜てもらう = have someone do it for me."],
    ["「てあげる」の方向は？", ["Speaker gives benefit of action to someone else.", "Speaker receives benefit.", "Third party receives.", "Unknown."], 0, "〜てあげる = do for someone else."],
    ["「ものだ」の意味は？", ["natural expectation / that's how things are", "decided by speaker", "hearsay", "obligation"], 0, "〜ものだ = natural course / that's the way things are."],
  ],
  // Test 2 — usage
  [
    ["「先生がお帰りになりました」の文法は？", ["Honorific (尊敬語) — teacher returned.", "Humble — I returned.", "Passive — was returned.", "Causative — made return."], 0, ""],
    ["「お荷物をお持ちします」の文法は？", ["Humble (謙譲語) — I will carry your luggage.", "Honorific — you will carry.", "Passive.", "Causative."], 0, ""],
    ["「友達に手伝ってもらいました」の意味は？", ["Had a friend help me (received benefit).", "Helped a friend.", "A friend was helped by someone.", "The friend helped himself."], 0, ""],
    ["「ところだ」（just about to）の意味は？", ["about to do / on the verge of", "just finished", "in the middle of", "decided to"], 0, "Verb plain-present + ところ = about to do."],
    ["「にとって」の意味は？", ["from the perspective of / for (a person)", "by means of", "depending on", "because of"], 0, "〜にとって = from the standpoint of."],
  ],
  // Test 3 — collocation
  [
    ["「〜ほど」の意味として適切なのは？", ["to the degree/extent that", "only", "just", "about"], 0, "〜ほど = to the extent of."],
    ["「ものの」の用法は？", ["Concessive although (formal/written)", "Cause", "Purpose", "Condition"], 0, "〜ものの = although (concessive, formal)."],
    ["「として」の意味は？", ["as / in the capacity of", "because of", "despite", "after"], 0, "〜として = as / in the role of."],
    ["「てくれる」の方向は？", ["Someone does the action for the speaker (gift to speaker).", "Speaker does for someone else.", "Third party gives to fourth.", "Speaker receives from no one."], 0, "〜てくれる = someone does for me (benefit to speaker)."],
    ["「〜ているところだ」の意味は？", ["in the middle of (ongoing action right now)", "about to do", "just finished", "decided to do"], 0, "〜ているところ = in the midst of doing."],
  ],
  // Test 4 — nuance
  [
    ["「尊敬語」と「謙譲語」の違いで正しいのは？", ["尊敬語 elevates the other person; 謙譲語 lowers the speaker.", "Both elevate the other person.", "謙譲語 elevates the other person.", "Both lower the speaker."], 0, ""],
    ["「てもらう」「てあげる」「てくれる」の方向の識別は？", ["もらう = receive; あげる = give (to non-in-group); くれる = give (to in-group/speaker).", "All mean the same.", "あげる = receive.", "くれる = give to stranger."], 0, ""],
    ["「ものだ」と「ものの」の違いは？", ["ものだ = natural/expected; ものの = although (concessive).", "Same.", "ものの = natural.", "ものだ = concessive."], 0, ""],
    ["「ほど」と「くらい」の違いは？", ["ほど is more formal/literary; くらい is more colloquial, also means 'about'.", "Same.", "くらい is more formal.", "ほど means 'about'."], 0, ""],
    ["「として」と「にとって」の違いは？", ["として = in the capacity/role of; にとって = from the perspective/standpoint of.", "Same.", "にとって = capacity.", "として = perspective."], 0, ""],
  ],
  // Test 5 — integration
  [
    ["「知らなかったとはいえ、ものの、謝るべきだ」で「ものの」の機能は？", ["Concessive: although (he didn't know), he should apologize.", "Cause: because he didn't know.", "Purpose: in order not to know.", "Condition: if he didn't know."], 0, ""],
    ["「先生がおっしゃいました」と「先生に言いました」の違いは？", ["おっしゃいました = honorific (teacher spoke); 言いました = plain (speaker spoke).", "No difference.", "おっしゃいました is humble.", "言いました is honorific."], 0, ""],
    ["「食べるほど太る」の構造は？", ["The more you eat, the more you gain (ほど = extent/proportion).", "Eat in order to gain weight.", "Eat although you gain weight.", "Eat and gain weight simultaneously."], 0, "〜ほど = proportional degree."],
    ["「親友にとって、正直さが一番大切だ」の「にとって」の機能は？", ["Perspective: from a close friend's standpoint, honesty is most important.", "Capacity: acting as a close friend.", "Cause: because of a close friend.", "Condition: if a close friend."], 0, ""],
    ["「ただいま準備しているところです」の文法は？", ["〜ているところ = in the middle of preparing right now.", "〜たところ = just finished.", "〜るところ = about to.", "〜たばかり = just did."], 0, ""],
  ],
];

// ─── GRAMMAR ──────────────────────────────────────────────────────────────────
const GRAMMAR_BLOCKS: McqPoolRow[][] = [
  // Test 1
  [
    ["先生がお帰り（　）なりました。（honorific）", ["に", "に", "を", "が"], 0, "お帰りになりました = honorific for 帰りました."],
    ["資料をお持ち（　）します。（humble）", ["し", "に", "を", "が"], 0, "お持ちします = humble for 持ちます."],
    ["友達に手伝っ（　）もらいました。", ["て", "に", "が", "を"], 0, "手伝ってもらいました = had a friend help me."],
    ["今、食事をし（　）いるところです。", ["て", "ており", "てから", "てみ"], 0, "〜ているところ = in the middle of eating."],
    ["子どもに（　）、この映画は難しすぎる。", ["とって", "として", "ために", "ように"], 0, "〜にとって = for (from child's perspective)."],
    ["大人（　）、責任を持つべきだ。", ["として", "にとって", "ために", "ほど"], 0, "〜として = as an adult (in the capacity of)."],
  ],
  // Test 2
  [
    ["先生が来て（　）くれました。", ["くれ", "もらい", "あげ", "いただき"], 0, "〜てくれました = teacher did for me/us (benefit to in-group)."],
    ["友達に本を貸し（　）あげました。", ["て", "に", "を", "が"], 0, "〜てあげました = lent book to friend (gave benefit)."],
    ["今、資料を確認し（　）ところです。", ["ている", "てある", "ておく", "てから"], 0, "〜ているところ = in the middle of confirming."],
    ["試験まであと5分という（　）に、鉛筆が折れた。", ["ところ", "うち", "あいだ", "ため"], 0, "〜というところに = at that moment / just when."],
    ["練習する（　）、うまくなります。", ["ほど", "だけ", "ばかり", "から"], 0, "〜ほど〜 = the more you practice, the better."],
    ["勉強した（　）、成果が出ませんでした。", ["ものの", "ので", "から", "ため"], 0, "〜ものの = although studied (concessive)."],
  ],
  // Test 3
  [
    ["部長がお話し（　）なりました。", ["に", "を", "が", "で"], 0, "お話しになりました = honorific for 話しました."],
    ["荷物をお運び（　）いたします。（humble）", ["し", "に", "を", "が"], 0, "お運びいたします = very humble for 運びます."],
    ["先生に手紙を書い（　）もらいました。", ["て", "に", "が", "を"], 0, "書いてもらいました = had teacher write."],
    ["今、シャワーを浴び（　）ところです。", ["ている", "てある", "ておく", "てから"], 0, "〜ているところ = in the middle of showering."],
    ["子ども（　）、このルールは複雑だ。", ["にとって", "として", "ために", "ほど"], 0, "〜にとって = from child's perspective."],
    ["医者（　）、患者の命を第一に考えるべきだ。", ["として", "にとって", "ために", "ほど"], 0, "〜として = as a doctor (capacity/role)."],
  ],
  // Test 4
  [
    ["先生が「明日は休みです」と（　）いました。（honorific say）", ["おっしゃって", "言って", "いって", "申して"], 0, "おっしゃっていました = honorific for 言っていました."],
    ["私が部長に（　）します。（humble explain）", ["ご説明", "お説明", "説明して", "説明される"], 0, "ご説明します = humble for 説明します."],
    ["泣く（　）涙が出なかった。", ["ほど", "だけ", "ばかり", "くらい"], 0, "泣くほど = to the extent of crying."],
    ["努力した（　）、結果はよくなかった。", ["ものの", "ので", "から", "ため"], 0, "〜ものの = although (concessive, formal)."],
    ["教師（　）、学生の可能性を信じることが大切だ。", ["として", "にとって", "ために", "ほど"], 0, "〜として = as a teacher (role)."],
    ["あなた（　）、これは難しい問題です。", ["にとって", "として", "ために", "ほど"], 0, "〜にとって = from your perspective."],
  ],
  // Test 5
  [
    ["「てもらう」「てあげる」「てくれる」の識別問題：先生に宿題を直し（　）もらった。", ["て", "に", "が", "を"], 0, "直してもらった = had teacher correct (received benefit)."],
    ["「先生が説明してくださいました」は何形か？", ["Honorific くださる form of てくれる.", "Humble form.", "Passive.", "Causative."], 0, "〜てくださる = honorific of てくれる."],
    ["「ただいま確認中でございます」の謙譲表現は？", ["でございます = very humble copula.", "です = normal.", "ます = polite only.", "だ = plain."], 0, ""],
    ["「知っているほどではないが、少しは分かる」の「ほど」は？", ["Degree: not to the extent of knowing fully, but understands a little.", "Hearsay.", "Purpose.", "Concessive."], 0, ""],
    ["「教授として尊敬されているにとって、責任は重い」の誤りは？", ["にとって should attach to a person noun, not the professor-as-subject here; として is correct here.", "として is wrong.", "Both are correct.", "Neither should be used."], 0, "として = capacity; にとって = perspective of a person."],
  ],
];

// ─── READING ─────────────────────────────────────────────────────────────────
const READING_BLOCKS: McqPoolRow[][] = [
  // Test 1
  [
    ["【文】部長がお帰りになりました。\nこの表現は何ですか？", ["Honorific (尊敬語) — the manager returned.", "Humble — I returned.", "Passive.", "Plain past."], 0, ""],
    ["【文】資料をお持ちします。\nこの表現は何ですか？", ["Humble (謙譲語) — I will carry the documents.", "Honorific — you will carry.", "Passive.", "Potential."], 0, ""],
    ["【文】友達にケーキを作ってあげました。\n誰が誰のために作りましたか？", ["Speaker made cake for friend.", "Friend made cake for speaker.", "Third party made cake.", "Unknown."], 0, ""],
    ["【文】今、会議をしているところです。\nどんな状況ですか？", ["In the middle of the meeting right now.", "Meeting just ended.", "About to start the meeting.", "Meeting was cancelled."], 0, ""],
    ["【文】初心者にとって、この楽器は難しい。\n誰にとって難しいか？", ["For beginners.", "For experts.", "For everyone.", "For no one."], 0, ""],
  ],
  // Test 2
  [
    ["【文】先生が丁寧に説明してくださいました。\n意味は？", ["The teacher kindly explained for us (honorific くださる).", "We explained for the teacher.", "Teacher was explained to.", "I explained."], 0, ""],
    ["【文】部下にレポートを書いてもらいました。\n誰が書きましたか？", ["A subordinate wrote it for me.", "I wrote for the subordinate.", "Both wrote together.", "No one wrote."], 0, ""],
    ["【文】ちょうど食べ終わったところです。\n何が分かりますか？", ["Just finished eating.", "About to eat.", "In the middle of eating.", "Haven't started eating."], 0, ""],
    ["【文】走れば走るほど速くなります。\n意味は？", ["The more you run, the faster you get.", "Run in order to get fast.", "Although you run, you don't get fast.", "Run once and you'll be fast."], 0, ""],
    ["【文】勉強したものの、試験に落ちてしまった。\n「ものの」の機能は？", ["Concessive: although studied, failed.", "Cause: studied therefore failed.", "Condition: if studied, failed.", "Purpose: studied in order to fail."], 0, ""],
  ],
  // Test 3
  [
    ["【文】田中部長がお見えになりました。\nどういう意味ですか？", ["Manager Tanaka has arrived (honorific form of 来る).", "I arrived at Manager Tanaka's office.", "Manager Tanaka was seen by someone.", "Manager Tanaka is looking for someone."], 0, ""],
    ["【文】ご案内いたします。こちらへどうぞ。\n何をしていますか？", ["Humbly guiding/leading (very humble 謙譲語).", "Asking for guidance.", "Refusing to guide.", "Casually showing the way."], 0, ""],
    ["【文】今、ちょうど出発しようとしているところです。\n状況は？", ["About to depart right now.", "Just departed.", "In the middle of a long departure process.", "Decided to depart."], 0, ""],
    ["【文】外国人にとって、日本語の敬語は複雑です。\n「にとって」の意味は？", ["From the perspective of foreigners.", "In the capacity of foreigners.", "Because of foreigners.", "For the benefit of foreigners."], 0, ""],
    ["【文】医師として、患者の情報を守ることが義務だ。\n「として」の意味は？", ["In the capacity/role of a doctor.", "From the perspective of a doctor.", "Because of being a doctor.", "For the sake of a doctor."], 0, ""],
  ],
  // Test 4
  [
    ["【文】親切にも、先輩が手伝ってくれました。\n「くれました」の意味は？", ["The senior kindly did it for me (benefit to speaker).", "I helped the senior.", "The senior was helped by someone.", "Third person helped."], 0, ""],
    ["【文】疲れているものの、仕事を続けます。\n意味は？", ["Although tired, will continue working.", "Because tired, will continue.", "If tired, will continue.", "In order to be tired, working."], 0, ""],
    ["【文】泣くほど嬉しかった。\n意味は？", ["Was so happy I could cry.", "Cried because I was unhappy.", "Cried for a purpose.", "Happy only a little."], 0, ""],
    ["【文】子どもにとって、遊ぶことは学びである。\nこの文の主張は？", ["For children, play is learning.", "Children should not play.", "Adults and children learn equally.", "Play has no educational value."], 0, ""],
    ["【文】社員として、会社のルールを守る責任がある。\nこの文の意味は？", ["As an employee, you are responsible for following company rules.", "Because you are an employee, the rules do not apply.", "Employees have no obligations.", "The rules are optional."], 0, ""],
  ],
  // Test 5
  [
    ["【文】先生がおっしゃったことを、そのまま伝えました。\n「おっしゃった」は何ですか？", ["Honorific form of 言う (the teacher said).", "Humble form of 言う.", "Passive of 言う.", "Plain form of 言う."], 0, ""],
    ["【文】頑張ったものの、なかなか上達しない。どうすればいいのか。\n話者の悩みは？", ["Struggling because despite effort, no improvement.", "Not trying hard enough.", "Don't know how to try.", "Don't want to improve."], 0, ""],
    ["【文】知れば知るほど、日本語の奥深さがわかる。\n「ば〜ほど」の意味は？", ["The more you know, the more you understand Japanese depth.", "Know a little and understand.", "Know nothing and understand more.", "Knowing doesn't help."], 0, ""],
    ["【文】子育てをする親にとって、睡眠不足は深刻な問題だ。\n「にとって」の機能は？", ["From the perspective of parents raising children.", "In the capacity of parents.", "Because of child-rearing.", "If parents raise children."], 0, ""],
    ["【文】ただいま部長がご確認中でいらっしゃいます。\nこの文に使われている敬語の種類は？", ["Both 尊敬語 (いらっしゃいます) and honorific prefix ご.", "謙譲語 (humble forms).", "Plain form.", "No keigo used."], 0, ""],
  ],
];

// ─── LISTENING MCQs ───────────────────────────────────────────────────────────
const LISTENING_MCQ_BLOCKS: McqPoolRow[][] = [
  // Test 1
  [
    ["（聴解）「先生がいらっしゃいました」の意味は？", ["Teacher arrived (honorific form of いる/来る).", "I arrived.", "Teacher was made to arrive.", "Teacher might arrive."], 0, ""],
    ["（聴解）「お荷物をお持ちします」は丁寧ですか？", ["Yes — humble form (謙譲語).", "No — plain form.", "Neutral.", "Rude."], 0, ""],
    ["（聴解）「友達に助けてもらいました」の意味は？", ["Had a friend help me.", "Helped a friend.", "A friend was helped by someone.", "I helped myself."], 0, ""],
    ["（聴解）「今、報告書を書いているところです」の状況は？", ["In the middle of writing the report.", "Just finished.", "About to start.", "Decided to write."], 0, ""],
  ],
  // Test 2
  [
    ["（聴解）「社長がお話しになっています」の文法は？", ["Honorific 〜になっている (ongoing honorific action).", "Humble ongoing.", "Passive.", "Causative."], 0, ""],
    ["（聴解）「ご報告申し上げます」の謙譲度は？", ["Very humble (申し上げる = highest humble for 言う/報告する).", "Normal polite.", "Honorific.", "Plain."], 0, ""],
    ["（聴解）「先生に教えていただきました」の意味は？", ["Had teacher teach me (humble-honorific もらう form).", "I taught the teacher.", "Teacher was taught.", "I taught myself."], 0, ""],
    ["（聴解）「〜ものの」はどんな意味ですか？", ["Although / even though (concessive, formal).", "Because.", "If.", "In order to."], 0, ""],
  ],
  // Test 3
  [
    ["（聴解）「てもらう」「てあげる」「てくれる」の方向を選びなさい。（もらう）", ["Receive benefit from someone else.", "Give benefit to someone.", "Give to stranger.", "No direction."], 0, ""],
    ["（聴解）「練習すればするほど上手になる」の「ほど」の意味は？", ["Proportional: the more you practice, the better.", "Only by practicing.", "Just practicing.", "About practicing."], 0, ""],
    ["（聴解）「専門家として意見を言います」の「として」は？", ["In the capacity/role of an expert.", "From the perspective of an expert.", "Because of being an expert.", "For the sake of experts."], 0, ""],
    ["（聴解）「子どもにとって、これは大切な経験です」の「にとって」は？", ["From the perspective of children.", "In the role of children.", "Because of children.", "For the children's task."], 0, ""],
  ],
  // Test 4
  [
    ["（聴解）「尊敬語」と「謙譲語」を聞き分けるポイントは？", ["尊敬語 elevates the other person's action; 謙譲語 lowers the speaker's action.", "Both elevate.", "Both lower.", "No difference."], 0, ""],
    ["（聴解）「先生に褒めてもらいました」と「先生が褒めてくれました」の違いは？", ["Both mean teacher praised me; もらう focuses on receiving; くれる focuses on the giver.", "もらう = I praised the teacher.", "くれる = mutual praise.", "No difference."], 0, ""],
    ["（聴解）「たところ」と「ているところ」の違いは？", ["たところ = just completed; ているところ = in the middle of.", "Both = just completed.", "Both = ongoing.", "Same meaning."], 0, ""],
    ["（聴解）「として」と「にとって」を選びなさい。（医者（　）、患者が最優先だ）", ["にとって = from doctor's perspective.", "として = in doctor's role.", "Both work equally here.", "Neither works."], 0, "医者にとって = from doctor's perspective; 医者として = as a doctor (role)."],
  ],
  // Test 5
  [
    ["（聴解）「おっしゃる」「いらっしゃる」「なさる」「ご覧になる」はどの種類の敬語？", ["All 尊敬語 (honorific forms).", "All 謙譲語.", "Mixed.", "Not keigo."], 0, ""],
    ["（聴解）「申す」「参る」「いたす」「拝見する」はどの種類の敬語？", ["All 謙譲語 (humble forms).", "All 尊敬語.", "Mixed.", "Not keigo."], 0, ""],
    ["（聴解）「泣くほど嬉しかった」と「泣くくらい嬉しかった」の違いは？", ["ほど is more formal/literary; くらい is more colloquial.", "ほど is stronger.", "くらい is more formal.", "Same in all registers."], 0, ""],
    ["（聴解）「ものの」が表すのは？", ["Concessive although (formal register).", "Cause (because).", "Sequence (and then).", "Condition (if)."], 0, ""],
  ],
];

export function buildWeek3N3SubTests(): JapaneseWeeklySubTest[] {
  return buildN3FivePaperWeek({
    weekPrefix: "jn3-w3",
    vocabBlocks: VOCAB_BLOCKS,
    grammarBlocks: GRAMMAR_BLOCKS,
    readingBlocks: READING_BLOCKS,
    listeningMcqBlocks: LISTENING_MCQ_BLOCKS,
    listeningIntroForTest: (testNum, tid): JapaneseWeeklyTestItem =>
      n3ListeningIntro(
        `${tid}-l-intro`,
        `聴解（N3 Week 3 · Test ${testNum}）：敬語（尊敬語・謙譲語）、てもらう/てあげる/てくれる、ところ、ほど/くらい、ものの、として/にとってを含む会話・場面問題です。`,
        testNum <= 2
          ? "ゆっくりした会話を1回聞き、尊敬語・謙譲語・ところ・ほど・ものの・として・にとっての表現をメモしてください。"
          : testNum <= 4
            ? "自然なスピードで2回聞き、すべての敬語形式と文法ポイントを識別してください。"
            : "通常スピードで1回のみ聞き、すべての文法ポイントをリアルタイムで識別してください。",
        [15, 16, 17, 18, 19],
      ),
    paperSubtitle: {
      en: `JLPT N3 Week 3 Test — Grammar Topics 15–21`,
      np: `JLPT N3 हप्ता ३ परीक्षा — व्याकरण विषय १५–२१`,
      jp: `JLPT N3 第3週テスト · 文法トピック15–21`,
    },
    paperIntro:
      "語彙・漢字から始め、文法・読解・聴解の順に解いてください。Test 1が最も易しく、Test 5が最も難しいです。",
  });
}
