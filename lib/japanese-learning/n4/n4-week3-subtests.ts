/**
 * Week 3 · Days 15–21 · Minna II L40–46 · five JLPT N4-style papers.
 * Focus: directional て-form, ば/たら/ても conditionals, ように, ため, passive voice.
 */

import type { JapaneseWeeklySubTest, JapaneseWeeklyTestItem } from "@/lib/japanese-learning/types";
import {
  buildN4FivePaperWeek,
  n4ListeningIntro,
  type McqPoolRow,
} from "@/lib/japanese-learning/n4/n4-subtest-shared";

const VOCAB_BLOCKS: McqPoolRow[][] = [
  [
    ["「進む」の意味は？", ["Advance / move forward", "Step back", "Turn around", "Stop"], 0, ""],
    ["「続ける」の意味は？", ["Continue / keep doing", "Stop suddenly", "Start new", "Give up"], 0, ""],
    ["「目的」の意味は？", ["Purpose / goal", "Method", "Result", "Place"], 0, ""],
    ["「条件」の意味は？", ["Condition / requirement", "Decision", "Outcome", "Permission"], 0, ""],
    ["「努力する」の意味は？", ["Make an effort / try hard", "Give up easily", "Rest", "Refuse"], 0, ""],
  ],
  [
    ["「発展する」の意味は？", ["Develop / progress", "Decline", "Stop", "Reverse"], 0, ""],
    ["「受け身」とは？", ["Passive voice — being acted upon", "Active voice", "Causative voice", "Potential voice"], 0, ""],
    ["「使役」とは？", ["Causative — making/letting someone do", "Passive", "Potential", "Plain form"], 0, ""],
    ["「ために」で使う場合、前に来る動詞は？", ["Plain/dictionary form", "て形", "ます形", "ない形"], 0, ""],
    ["「ようにする」の意味は？", ["Make effort to do / try to make it so", "Definitely will", "Cannot do", "Was forced to"], 0, ""],
  ],
  [
    ["「〜ていく」vs「〜てくる」の基本的な違いは？", ["ていく=away; てくる=toward/returning", "ていく=toward; てくる=away", "No difference", "Both mean returning"], 0, ""],
    ["「もし〜ば」の「もし」の機能は？", ["Adds hypothetical/conditional emphasis", "Changes the verb form", "Makes it polite", "Negates the condition"], 0, ""],
    ["「たとえ〜ても」の「たとえ」の機能は？", ["Strengthens even-if emphasis", "Weakens the condition", "Changes to past", "Negates"], 0, ""],
    ["「どんなに〜ても」の意味は？", ["No matter how much", "Just a little", "Only sometimes", "Definitely"], 0, ""],
    ["「〜られる」（受け身）の主語は？", ["Recipient of action", "Performer of action", "Both equally", "Neither"], 0, ""],
  ],
  [
    ["受け身文「Aは Bに Vられた」のBは？", ["The agent who performs the action", "The subject who receives", "The object", "The location"], 0, ""],
    ["使役文「Aは Bに Vさせた」のBは？", ["The person made/allowed to act", "The agent who caused", "The observer", "The location"], 0, ""],
    ["「食べさせた」と「食べさせられた」の主要な違いは？", ["させた=made to eat (causative); させられた=was made to eat (causative-passive)", "Same", "させられた is polite させた", "させた is passive"], 0, ""],
    ["「〜ように言う」の構造は？", ["Plain form + ように言う", "て形 + ように言う", "ない形 + ように言う", "た形 + ように言う"], 0, ""],
    ["「健康のために」の「ために」の品詞は？", ["Purpose marker (postposition)", "Verb", "Adjective", "Noun suffix"], 0, ""],
  ],
  [
    ["「間接受け身（迷惑）」の特徴は？", ["Action affects speaker indirectly/negatively", "Speaker performs action", "Speaker is neutral", "Speaker benefits"], 0, ""],
    ["「〜ような」の用法として正しいのは？", ["Modifies a noun (N4-like / resembling)", "Ends a sentence only", "Only in questions", "Only in negatives"], 0, ""],
    ["「〜ために」（原因）の例として正しいのは？", ["工事のために道が混んでいる (because of construction)", "健康のために走る (for health = purpose)", "遅れたために怒られた (because was late)", "A and C"], 2, ""],
    ["「条件節」で最も文語的なのは？", ["〜ば", "〜たら", "〜ても", "〜と"], 0, ""],
    ["「〜させてもらう」の意味は？", ["Receive permission to do (request to be allowed)", "Force someone to do", "Be forced to do", "Already did"], 0, ""],
  ],
];

const GRAMMAR_BLOCKS: McqPoolRow[][] = [
  [
    ["雨が降っ（　）きました。（started raining — toward now）", ["て", "ておき", "てから", "てしまい"], 0, "降ってきました."],
    ["もし天気が良けれ（　）、出かけます。", ["ば", "たら", "ても", "から"], 0, "〜ば conditional."],
    ["宿題が終わっ（　）、映画を見ましょう。", ["たら", "ば", "ても", "ので"], 0, "〜たら sequential."],
    ["たとえ疲れ（　）、最後まで頑張ります。", ["ても", "ば", "たら", "から"], 0, "〜ても even if."],
    ["日本語が上手になる（　）、毎日練習します。", ["ように", "ために", "ほど", "から"], 0, "〜ように purpose."],
    ["手紙は先生（　）書かれました。（passive agent）", ["に", "で", "を", "が"], 0, "受け身のに."],
  ],
  [
    ["新しい道具を持っ（　）いきます。（take and go away）", ["て", "てから", "ておき", "ている"], 0, "持っていきます."],
    ["田中さんは会議に呼（　）れました。（passive）", ["ば", "て", "ません", "ませ"], 0, "呼ばれました."],
    ["先生が学生に本を読（　）させました。（causative）", ["ま", "め", "み", "も"], 0, "読ませました."],
    ["健康の（　）、毎朝ジョギングします。", ["ために", "ように", "ほど", "から"], 0, "〜ために purpose."],
    ["疲れ（　）も、続けます。", ["て", "ている", "てから", "た"], 0, "疲れても."],
    ["勉強する（　）に言いました。", ["よう", "こと", "ため", "ほど"], 0, "〜ように言う."],
  ],
  [
    ["荷物を駅まで持っ（　）もらいました。（received the favour）", ["て", "から", "ながら", "ている"], 0, ""],
    ["毎日練習する（　）にしています。", ["よう", "こと", "ため", "ほど"], 0, ""],
    ["彼は上司に叱（　）れました。（passive）", ["ら", "ら", "ら", "ら"], 0, "叱られました."],
    ["もし彼女が来（　）、教えてください。", ["たら", "ば", "ても", "から"], 0, "〜たら conditional."],
    ["寒く（　）も、毎朝走ります。", ["て", "た", "ている", "てから"], 0, "寒くても."],
    ["日本語を話せる（　）になりたいです。", ["よう", "こと", "ため", "ほど"], 0, ""],
  ],
  [
    ["親に野菜を食べ（　）られました。（causative-passive）", ["させ", "さし", "させる", "され"], 0, "食べさせられました."],
    ["子供に宿題をし（　）ました。（causative — let/made）", ["させ", "されて", "させられて", "される"], 0, "させました."],
    ["電車が遅延し（　）ために、遅れました。（cause）", ["た", "て", "てから", "たら"], 0, "遅延したために."],
    ["彼女は毎日日本語を勉強する（　）に努めています。", ["よう", "こと", "ため", "ほど"], 0, ""],
    ["この仕事は難し（　）も、やり遂げます。", ["くて", "くても", "くば", "くたら"], 0, "難しくても."],
    ["学生が理解できる（　）、先生はゆっくり話します。", ["ように", "ために", "ので", "から"], 0, ""],
  ],
  [
    ["「書かせられた」は何形か？(causative-passive short: G1)", ["使役受け身（G1短縮）", "受け身", "使役", "可能"], 0, ""],
    ["「受け身+ために」の構造例：洪水（　）家が壊された（　）でひどかった。", ["に・ため", "で・から", "が・ので", "に・ので"], 0, "洪水に…ために."],
    ["「食べられる」は2通りの解釈が可能。それは？", ["Passive (was eaten) AND potential (can eat)", "Passive only", "Potential only", "Causative only"], 0, ""],
    ["「〜ようにする」vs「〜ようになる」の差は？", ["する=make effort (volitional); なる=gradual change (non-volitional)", "Same", "なる is polite する", "する=change; なる=effort"], 0, ""],
    ["「健康のためになる」の「になる」の品詞的機能は？", ["Become → good for health", "Make someone healthy", "Force to be healthy", "Suppose to be healthy"], 0, ""],
    ["週3で運動する（　）にしています — 自発的な習慣目標", ["よう", "こと", "ため", "ほど"], 0, ""],
  ],
];

const READING_BLOCKS: McqPoolRow[][] = [
  [
    ["【文】雨が降ってきました。急いで帰りましょう。\n「降ってきた」の意味は？", ["Rain started (came toward speaker).", "Rain stopped.", "Rain will start.", "Rain never came."], 0, ""],
    ["【文】もし時間があれば、一緒に行きましょう。\n条件は？", ["If there's time.", "If it rains.", "If tired.", "If hungry."], 0, ""],
    ["【文】宿題が終わったら、出かけましょう。\n順序は？", ["Homework first, then go out.", "Go out first.", "Both at same time.", "No connection."], 0, ""],
    ["【文】日本語が上手になるように、毎日練習します。\n目的は？", ["To become better at Japanese.", "Just for fun.", "Teacher required it.", "No purpose."], 0, ""],
    ["【文】先生に褒められました。\n「褒められました」は？", ["Passive — was praised by teacher.", "Causative.", "Causative-passive.", "Plain past."], 0, ""],
  ],
  [
    ["【文】健康のために毎朝運動しています。体調がよくなりました。\n運動の効果は？", ["Health improved.", "No change.", "Got worse.", "Became tired."], 0, ""],
    ["【文】たとえ失敗しても、諦めません。もう一度挑戦します。\n筆者の態度は？", ["Won't give up; will try again.", "Will give up.", "Doesn't care.", "Expects failure."], 0, ""],
    ["【文】荷物を駅まで持っていきます。\n「持っていく」の意味は？", ["Carry and go (away from speaker).", "Carry and come back.", "Already carried.", "Will not carry."], 0, ""],
    ["【文】子供のころ、ピアノを弾かされました。\n「弾かされました」は何形？", ["Causative-passive — forced to play.", "Causative.", "Passive.", "Plain past."], 0, ""],
    ["【文】先生が学生に問題を解かせました。\n「解かせました」は？", ["Causative — teacher had students solve.", "Passive — students were solved.", "Plain past.", "Potential."], 0, ""],
  ],
  [
    ["【文】毎日練習するようにしたら、上手になりました。\nどういう変化が起きましたか。", ["Made effort to practice daily → improved.", "Didn't practice → failed.", "Practiced once → improved.", "No change."], 0, ""],
    ["【文】日本語が話せるようになるように、先生はゆっくり話してくれます。\n先生の行動の目的は？", ["So students can become able to speak.", "Because teacher speaks slowly naturally.", "Forced by school.", "No purpose stated."], 0, ""],
    ["【文】工事のために道が混んでいます。\n「ために」の意味は？", ["Because of (cause) — not purpose here.", "Purpose — in order to.", "Condition.", "Obligation."], 0, ""],
    ["【文】先生に遅刻しないように言われました。\n「言われました」は何形？", ["Passive — was told by teacher.", "Causative.", "Causative-passive.", "Plain past."], 0, ""],
    ["【文】彼女は毎朝6時に起きるようにしています。\n「ようにしています」の意味は？", ["Makes effort to wake up at 6.", "Always wakes at exactly 6.", "Was ordered to wake at 6.", "Wishes to wake at 6."], 0, ""],
  ],
  [
    ["【文】もし明日天気が良ければ、ピクニックに行きましょう。悪ければ、家で映画を見ましょう。\n計画の構造は？", ["Two ば-conditions with matching plans.", "Simple statement.", "Request to stay home.", "Obligation to go out."], 0, ""],
    ["【文】学生は毎日宿題をするように先生に言われました。\n受け身と〜ようにの組み合わせの意味は？", ["Students were instructed by teacher to do homework.", "Students told teacher.", "Teacher did homework.", "No instruction given."], 0, ""],
    ["【文】彼は突然大きな声で叫ばれて、びっくりしました。\n「叫ばれて」は何形？", ["Passive (nuisance — affected by someone shouting).", "Causative.", "Causative-passive.", "Plain te-form."], 0, ""],
    ["【文】健康のためには、やりたくないことでも続けることが大切です。\n「やりたくないことでも」の「でも」は？", ["Even if/though (tough even-if frame).", "Hearsay marker.", "Obligation.", "Conditional ば."], 0, ""],
    ["【文】子供たちに自由に遊ばせてあげました。\n「遊ばせて」は何形？", ["Causative — let the children play (benevolent).", "Passive.", "Causative-passive.", "Simple past."], 0, ""],
  ],
  [
    ["【文】新入社員に書類を読ませ、その後コピーをさせた上司の行動の文法は？", ["Causative (させる) — had employees do tasks.", "Passive.", "Causative-passive.", "Potential."], 0, ""],
    ["【文】「食べられる」が「食べさせられる」と異なる点は？", ["食べられる=passive/potential; 食べさせられる=causative-passive", "Both are passive only", "Both are potential", "食べられる=causative"], 0, ""],
    ["【文】「毎日運動するように言いました」と「毎日運動しなければならないと言いました」の違いは？", ["ように=indirect advice/request; しなければ=direct obligation statement", "Both are exactly the same", "ように is more forceful", "しなければ is softer"], 0, ""],
    ["【文】道が混んでいるので、電車で行くことにしました。\n「ことにしました」の意味は？", ["Personal decision made (own choice).", "External circumstance decided.", "Logical expectation.", "Hearsay."], 0, ""],
    ["【文】「もし忙しければ手伝わなくてもいいです」の文で義務の否定はどこ？", ["なくてもいいです = no obligation to help.", "もし忙しければ = condition.", "手伝う = the action.", "The entire sentence."], 0, ""],
  ],
];

const LISTENING_MCQ_BLOCKS: McqPoolRow[][] = [
  [
    ["（聴解）「雨が降ってきました」の「てきた」の意味は？", ["Rain started coming (toward speaker)", "Rain stopped", "Rain will come later", "Rain went away"], 0, ""],
    ["（聴解）「もし時間があれば来てください」の条件は？", ["If you have time.", "If it rains.", "If you feel like it.", "If you are hungry."], 0, ""],
    ["（聴解）「先生に褒められました」の形は？", ["Passive — was praised", "Causative", "Active", "Plain past"], 0, ""],
    ["（聴解）「ようにしてください」の意味は？", ["Please try to do / make effort", "Must do", "Cannot do", "Did it"], 0, ""],
  ],
  [
    ["（聴解）「たとえ雨でも行きます」のニュアンスは？", ["Will go regardless of rain.", "Won't go if it rains.", "Only goes when sunny.", "Undecided."], 0, ""],
    ["（聴解）「食べさせました」の形は？", ["Causative — made/let someone eat", "Passive", "Causative-passive", "Simple past"], 0, ""],
    ["（聴解）「健康のために」と「日本語上手になるように」の違いは？", ["ために=purpose for nouns/volitional acts; ように=purpose toward a state/ability", "Same", "ために=cause; ように=manner", "No difference"], 0, ""],
    ["（聴解）「もし〜ば」の「もし」の機能は？", ["Adds hypothetical emphasis", "Changes verb form", "Makes polite", "Negates"], 0, ""],
  ],
  [
    ["（聴解）「荷物を持っていきます」の「ていく」は？", ["Move away from speaker (carry and go)", "Move toward speaker", "Already done", "Preparation"], 0, ""],
    ["（聴解）「読まされました」の形は？", ["Causative-passive — was forced to read", "Passive — was read", "Causative — made read", "Plain past"], 0, ""],
    ["（聴解）「宿題が終わったら遊べます」の構造は？", ["たら conditional — when homework done, can play", "ば condition", "ても even if", "ので because"], 0, ""],
    ["（聴解）「先生に来るように言われました」の文に含まれる形は？", ["Passive + ように indirect instruction", "Causative only", "Causative-passive", "Simple past"], 0, ""],
  ],
  [
    ["（聴解）「どんなに疲れても頑張ります」の「どんなに〜ても」は？", ["No matter how tired, will persist.", "Only if not tired.", "Will stop when tired.", "Depending on tiredness."], 0, ""],
    ["（聴解）「食べられる」は何通りの解釈が可能か？", ["Two: passive AND potential", "One: only passive", "One: only potential", "Three"], 0, ""],
    ["（聴解）「日本語が話せるようになるように練習します」の「ようになるように」の意味は？", ["Practice so that (gradually) one can speak", "Practice while speaking", "Practice because one can speak", "Practice after speaking"], 0, ""],
    ["（聴解）「でも」の聴解での判断：「疲れてもやります」と「コーヒーでも飲みますか」の違いは？", ["〜ても=even if; 〜でも=or something like (suggestion)", "Same meaning", "Both are even-if", "Both are suggestions"], 0, ""],
  ],
  [
    ["（聴解）複合形「させてもらいました」の意味は？", ["I received permission to do (was allowed to do)", "I forced someone to do", "I was forced to do", "I already did voluntarily"], 0, ""],
    ["（聴解）「工事のために道が混んでいる」の「ために」の判断は？", ["Cause (because of construction), not purpose", "Purpose (in order to build)", "Condition", "Obligation"], 0, ""],
    ["（聴解）「彼女に〜てほしい」と「彼女に〜てもらいたい」の差は？", ["ほしい=slightly more direct/emotional; もらいたい=more indirect", "No difference", "ほしい=formal; もらいたい=casual", "もらいたい=stronger demand"], 0, ""],
    ["（聴解）「なくてもいい」と「なくてはいけない」の区別を聴解でどうつける？", ["なくてもいい=no obligation; なくてはいけない=must do", "Both same", "Both=must do", "Both=optional"], 0, ""],
  ],
];

export function buildWeek3N4SubTests(): JapaneseWeeklySubTest[] {
  return buildN4FivePaperWeek({
    weekPrefix: "jn4-w3",
    vocabBlocks: VOCAB_BLOCKS,
    grammarBlocks: GRAMMAR_BLOCKS,
    readingBlocks: READING_BLOCKS,
    listeningMcqBlocks: LISTENING_MCQ_BLOCKS,
    listeningIntroForTest: (testNum, tid): JapaneseWeeklyTestItem =>
      n4ListeningIntro(
        `${tid}-l-intro`,
        `聴解（N4 Week 3 · Test ${testNum}）：Minna II L40–46 ──ていく/てくる・ば/たら/ても条件・ように目的・ために目的/原因・受け身。`,
        testNum <= 2
          ? "2回聞き、条件節の種類（ば/たら/ても）と受け身をメモしてください。"
          : testNum <= 4
            ? "1回で条件節と受け身の区別、ように vs ために の違いを識別してください。"
            : "通常スピード1回：受け身・使役・条件・目的をすべてリアルタイムで識別。",
        [40, 41, 42, 43, 44],
      ),
    paperSubtitle: {
      en: "JLPT N4 Week 3 Test — Minna II Lessons 40–46",
      np: "JLPT N4 हप्ता ३ परीक्षा — मिन्ना II पाठ ४०–४६",
      jp: "JLPT N4 第3週テスト · みんなの日本語II 第40–46課",
    },
    paperIntro:
      "Test 1 から Test 5 にかけて難易度が上がります。条件節（ば・たら・ても）と受け身・使役の区別に集中してください。",
  });
}
