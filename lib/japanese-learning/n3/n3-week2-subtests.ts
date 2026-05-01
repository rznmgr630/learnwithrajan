/**
 * Week 2 · Days 8–14 · N3 Grammar Topics 8–14 · five JLPT N3-style papers.
 * Test 1 = easiest (recognition) → Test 5 = hardest (inference + mixed forms).
 * Topics: そうだ/らしい/ようだ, quoting と思う/と言う/と聞く, ながら, あいだに/うちに,
 *         ばかり/だけ/しか, ことがある/ことにする/ことになる, potential forms
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
    ["「そうだ」（伝聞）の意味は？", ["I heard that… (hearsay)", "it looks like…", "I decided to…", "I must…"], 0, "〜そうだ = hearsay (heard from someone)."],
    ["「らしい」の意味は？", ["it seems / apparently (indirect evidence)", "it looks like (direct)", "I heard that", "I decided"], 0, "〜らしい = based on indirect evidence or hearsay."],
    ["「ながら」の使い方は？", ["doing two actions simultaneously", "before doing", "after doing", "instead of doing"], 0, "〜ながら = while doing (simultaneous actions)."],
    ["「ばかり」の意味は？", ["only / nothing but / just finished", "a little", "not at all", "often"], 0, "〜ばかり = only; or just done."],
    ["「ことになる」の意味は？", ["it has been decided (external decision)", "I decided", "I want to", "I should"], 0, "〜ことになる = external decision / circumstance leads to outcome."],
  ],
  // Test 2 — usage
  [
    ["「雨が降るそうです」の意味は？", ["I heard it will rain.", "It looks like it will rain.", "It might rain.", "It will definitely rain."], 0, ""],
    ["「彼女は来ないらしい」の意味は？", ["It seems she won't come (indirect evidence).", "She said she won't come.", "She definitely won't come.", "She might come."], 0, ""],
    ["「音楽を聞きながら勉強します」の「ながら」は？", ["Simultaneous: studying while listening to music.", "Sequential: first music, then study.", "Contrast: music instead of study.", "Purpose: study in order to listen."], 0, ""],
    ["「日本語しか話せません」の意味は？", ["I can speak only Japanese (nothing else).", "I can speak Japanese and more.", "I cannot speak Japanese.", "I sometimes speak Japanese."], 0, "〜しか〜ない = only (limiting + negation)."],
    ["「来週、東京に出張することになりました」の意味は？", ["It has been decided I'll go on a business trip (external).", "I decided to go on a trip.", "I want to go on a trip.", "I should go on a trip."], 0, ""],
  ],
  // Test 3 — collocation
  [
    ["「ようだ」と「らしい」の違いで正しいのは？", ["ようだ = direct observation; らしい = indirect/hearsay evidence.", "No difference.", "らしい = direct observation.", "ようだ = hearsay."], 0, ""],
    ["「だけ」と「ばかり」の違いは？", ["だけ = only (neutral limit); ばかり = only (excessive / negatively nuanced).", "Both are identical.", "ばかり is for amounts only.", "だけ is negative only."], 0, ""],
    ["「ことにする」は何を表す？", ["Speaker's deliberate personal decision.", "External circumstance / decision.", "Expectation.", "Obligation."], 0, "〜ことにする = personal decision."],
    ["「うちに」の意味は？", ["while (within the time when the condition holds)", "after", "because", "although"], 0, "〜うちに = while (before the state changes)."],
    ["「あいだに」の意味は？", ["during the interval (something happens)", "before", "after", "in order to"], 0, "〜あいだに = during (a bounded time period)."],
  ],
  // Test 4 — nuance
  [
    ["「〜そうだ」（伝聞）と「〜ようだ」の識別ポイントは？", ["そうだ = hearsay from others; ようだ = speaker's own observation/inference.", "Both are hearsay.", "ようだ is stronger certainty.", "そうだ is direct observation."], 0, ""],
    ["「ことになる」と「ことにする」の違いは？", ["ことになる = external/circumstances; ことにする = personal decision.", "No difference.", "ことにする = external.", "ことになる = personal decision."], 0, ""],
    ["「ばかりいる」（悪い意味）の使い方として自然なのは？", ["ゲームばかりしている = does nothing but play games (excess).", "本ばかり読んでいる = reads books only (positive).", "ばかり is always positive.", "しか and ばかり mean the same."], 0, ""],
    ["「〜たことがある」と「〜たことにする」の違いは？", ["たことがある = past experience; たことにする = pretend it happened.", "Both express past.", "たことにする = have done.", "たことがある = future."], 0, ""],
    ["「しか〜ない」の強調点は？", ["Implies only X, and nothing else (exclusive + negative).", "X is the most common.", "X and others exist.", "Positive selection."], 0, ""],
  ],
  // Test 5 — integration
  [
    ["「彼は成功するらしい」の根拠として自然なのは？", ["Indirect evidence — e.g. heard from colleagues.", "Direct first-hand observation.", "Hearsay from close friend only.", "Absolute certainty."], 0, ""],
    ["「音楽を聞きながら走るのは危険だ」の文構造は？", ["ながら (simultaneous) + danger judgment.", "ために (purpose) + danger.", "のに (contrast) + result.", "ので (cause) + fact."], 0, ""],
    ["「若いうちに、たくさん経験を積むべきだ」の「うちに」は？", ["while young (before youth ends)", "after being young", "because of youth", "despite youth"], 0, ""],
    ["「彼女は泣いてばかりいる」の含意は？", ["She does nothing but cry (excessive, usually negative).", "She cries sometimes.", "She cried once.", "She rarely cries."], 0, ""],
    ["「来月から海外赴任することになりました」は誰の決断？", ["External decision (company / circumstances).", "Speaker's own decision.", "Listener's decision.", "Unknown."], 0, "ことになりました = external / situation-driven decision."],
  ],
];

// ─── GRAMMAR ──────────────────────────────────────────────────────────────────
const GRAMMAR_BLOCKS: McqPoolRow[][] = [
  // Test 1
  [
    ["明日は晴れる（　）です。（hearsay）", ["そう", "よう", "みたい", "らしい"], 0, "〜そうです（伝聞）= I heard it will be sunny."],
    ["彼は忙し（　）です。（indirect evidence）", ["らしい", "そう", "はず", "べき"], 0, "〜らしい = seems busy (indirect evidence)."],
    ["音楽を聞き（　）、勉強します。", ["ながら", "てから", "ために", "ので"], 0, "〜ながら = while listening."],
    ["宿題（　）やっていません。（only homework, negative）", ["しか", "だけ", "ばかり", "ほど"], 0, "〜しか〜ない = only (exclusive + negative)."],
    ["来月、転職する（　）になりました。", ["こと", "ため", "よう", "はず"], 0, "〜ことになりました = external decision."],
    ["週末は映画を見る（　）にしています。", ["こと", "ため", "はず", "べき"], 0, "〜ことにしています = personal routine decision."],
  ],
  // Test 2
  [
    ["部長が来る（　）聞きました。", ["と", "が", "を", "で"], 0, "〜と聞きました = I heard that (quoting)."],
    ["料理をし（　）テレビを見ます。", ["ながら", "てから", "のに", "ので"], 0, "〜ながら = while cooking."],
    ["子どもが寝ている（　）に、洗濯をします。", ["あいだ", "うち", "ため", "ほど"], 0, "〜あいだに = during the time the child is sleeping."],
    ["若い（　）に、いろんな経験をしてください。", ["うち", "あいだ", "ため", "ほど"], 0, "〜うちに = while still young."],
    ["500円（　）持っていません。（only 500 yen）", ["しか", "だけ", "ばかり", "ほど"], 0, "500円しか〜ない = have only 500 yen."],
    ["日本に行った（　）があります。（experience）", ["こと", "もの", "ため", "はず"], 0, "〜ことがあります = past experience."],
  ],
  // Test 3
  [
    ["彼は失敗した（　）言っていました。", ["と", "が", "の", "で"], 0, "〜と言っていました = was saying that."],
    ["病気の（　）に、無理をしないでください。", ["うち", "あいだ", "ため", "のに"], 0, "〜のうちに or 〜あいだに = while sick."],
    ["甘い物（　）食べています。（excessive）", ["ばかり", "しか", "だけ", "ほど"], 0, "〜ばかり = nothing but sweet things (excess)."],
    ["車で行く（　）にしました。（decision）", ["こと", "ため", "はず", "べき"], 0, "〜ことにしました = decided to."],
    ["今年から禁煙する（　）になりました。（external）", ["こと", "ため", "はず", "よう"], 0, "〜ことになりました = it was decided."],
    ["この漢字が読め（　）ようになりました。", ["る", "た", "ない", "て"], 0, "〜読めるようになりました = came to be able to read."],
  ],
  // Test 4
  [
    ["彼女は海外留学する（　）だと聞きました。", ["らしい", "そう", "はず", "べき"], 0, "〜らしい = apparently she will study abroad."],
    ["歩き（　）スマホを使うのは危険です。", ["ながら", "てから", "のに", "ので"], 0, "歩きながら = while walking."],
    ["子どもが起きない（　）に、静かにしてください。", ["うち", "あいだ", "ため", "のに"], 0, "〜うちに = while the child has not yet woken."],
    ["この店には現金（　）使えません。（only cash）", ["しか", "だけ", "ばかり", "ほど"], 0, "現金しか〜ない = only cash accepted."],
    ["毎朝6時に起きる（　）にしています。", ["こと", "ため", "はず", "べき"], 0, "〜ことにしています = deliberate daily routine."],
    ["日本語が上手に話せる（　）、嬉しいです。", ["ように", "ほど", "ので", "から"], 0, "〜ように + なる = came to be able to."],
  ],
  // Test 5
  [
    ["「〜そうだ」（伝聞）と「〜ようだ」の使い分けは？", ["そうだ = reported hearsay; ようだ = speaker's own inference.", "Same.", "ようだ is stronger.", "そうだ is direct observation."], 0, ""],
    ["「ことになる」と「ことにする」の識別ポイントは？", ["ことになる = external/result; ことにする = deliberate personal choice.", "Same.", "ことにする = external.", "ことになる = personal."], 0, ""],
    ["「しか〜ない」と「だけ」の意味的差は？", ["しか〜ない = exclusive negative (only X); だけ = neutral (only X).", "No difference.", "だけ is stronger negation.", "しか is positive."], 0, ""],
    ["「あいだに」と「うちに」の違いは？", ["あいだに = during a bounded period; うちに = while a state still holds (before it changes).", "Both are identical.", "うちに = after.", "あいだに = before."], 0, ""],
    ["「ながら」（逆接）の例として正しいのは？", ["知りながら、言わなかった = even though he knew, he didn't say.", "勉強しながら = while studying (simultaneous).", "ながら is always simultaneous.", "ながら cannot express contrast."], 0, "〜ながら can also mean 'even though' in literary style."],
  ],
];

// ─── READING ─────────────────────────────────────────────────────────────────
const READING_BLOCKS: McqPoolRow[][] = [
  // Test 1
  [
    ["【文】明日は大雨が降るそうです。傘を持っていきます。\n「そうです」の根拠は？", ["Hearsay — heard from weather forecast or someone.", "Speaker's direct observation.", "Logical expectation.", "Personal wish."], 0, ""],
    ["【文】彼はまだ寝ているらしいです。\n根拠は直接見ましたか？", ["No — indirect evidence or hearsay.", "Yes — speaker saw him sleeping.", "Unknown.", "Speaker woke him up."], 0, ""],
    ["【文】音楽を聞きながらジョギングしています。\n何を同時にしていますか。", ["Jogging while listening to music.", "Jogging then listening to music.", "Listening to music alone.", "Jogging alone."], 0, ""],
    ["【文】コーヒーしか飲みません。\n意味は？", ["Drinks only coffee, nothing else.", "Drinks coffee and other things.", "Doesn't drink coffee.", "Sometimes drinks coffee."], 0, ""],
    ["【文】来月から部署が変わることになりました。\n誰が決めましたか？", ["External decision (company/circumstances).", "Speaker decided.", "Listener decided.", "No one decided."], 0, ""],
  ],
  // Test 2
  [
    ["【文】彼女は優しい人らしく、みんなに好かれています。\n「らしく」は何を表す？", ["Indirect evidence: she seems to be a kind person.", "Direct observation.", "Hearsay.", "Speculation only."], 0, ""],
    ["【文】子どもが寝ているあいだに、夕食の準備をしました。\nいつ準備しましたか？", ["While the child was sleeping.", "Before the child slept.", "After the child woke up.", "The child prepared dinner."], 0, ""],
    ["【文】若いうちに、色々な国を旅してみたいです。\n「うちに」の意味は？", ["While still young (before youth ends).", "After becoming young.", "Because of youth.", "Despite youth."], 0, ""],
    ["【文】甘い物ばかり食べていると、体に悪いです。\n「ばかり」のニュアンスは？", ["Eating nothing but sweets (excessive, negative nuance).", "Eating sweets occasionally.", "Sweets are good for health.", "Sweets are the only safe food."], 0, ""],
    ["【文】毎朝ウォーキングをすることにしました。\n誰が決めましたか？", ["Speaker's own deliberate decision.", "External circumstance.", "Doctor's order.", "Company policy."], 0, ""],
  ],
  // Test 3
  [
    ["【文】社長が来週退職するそうです。どこで聞きましたか？\n最も自然な答えは？", ["I heard from colleagues (hearsay).", "I saw him at the office.", "He told me directly (direct quote).", "I guessed."], 0, ""],
    ["【文】走りながら電話するのは、非常に危険です。\n何が危険ですか？", ["Talking on the phone while running.", "Running alone.", "Talking on the phone alone.", "Neither alone."], 0, ""],
    ["【文】夏休みのうちに、日本語の本を10冊読みます。\n「うちに」は何を表す？", ["Within the time frame of summer vacation (before it ends).", "After summer vacation.", "Because of summer vacation.", "Despite summer vacation."], 0, ""],
    ["【文】この仕事は田中さんにしか頼めません。\n意味は？", ["Only Tanaka-san can be asked for this (no one else).", "Tanaka-san is one of several who can be asked.", "Anyone but Tanaka-san.", "Tanaka-san was asked already."], 0, ""],
    ["【文】来年から新プロジェクトを担当することになりました。\n何が外部決定を示す？", ["〜ことになりました (external/circumstantial decision).", "〜ことにしました (personal decision).", "〜はずです (expectation).", "〜べきです (obligation)."], 0, ""],
  ],
  // Test 4
  [
    ["【文】彼女は海外で働いたことがあります。\n意味は？", ["She has the experience of working abroad.", "She is currently working abroad.", "She will work abroad.", "She has never worked abroad."], 0, ""],
    ["【文】子供のころ、ピアノを弾いたことがありましたが、今はもう弾けません。\n現在の状況は？", ["No longer able to play piano.", "Still plays piano daily.", "Just started learning piano.", "Never played piano."], 0, ""],
    ["【文】100円しか持っていません。バスに乗れますか。\n答えとして正しいのは？", ["Depends on fare — 100 yen may or may not be enough.", "Yes, always enough.", "No, 100 yen is too much.", "100 yen is not allowed on buses."], 0, ""],
    ["【文】先輩に言われたことを、そのまま部長に伝えました。\n「言われた」は何形か？", ["Passive — was told (by senior).", "Active — told the senior.", "Causative — made the senior say.", "Potential — could say."], 0, ""],
    ["【文】毎日30分読書することにしています。\n話者のスタンスは？", ["Deliberate personal habit/decision.", "External obligation.", "Unexpected circumstance.", "Logical expectation."], 0, ""],
  ],
  // Test 5
  [
    ["【文】彼はいつも音楽を聞きながら仕事をしています。それで集中できているらしい。\n二つの文法の機能は？", ["ながら (simultaneous) + らしい (indirect inference).", "ために (purpose) + そうだ (hearsay).", "のに (contrast) + はずだ (expectation).", "ので (cause) + べきだ (obligation)."], 0, ""],
    ["【文】子どもが起きないうちに食事の準備をしておいてください。\n「うちに」と「ておく」の組み合わせが示すのは？", ["Prepare in advance while the child is still asleep (before it changes).", "Prepare after the child wakes.", "Prepare because the child woke.", "Prepare instead of waking the child."], 0, ""],
    ["【文】甘い物ばかり食べて、野菜をほとんど食べない子どもを見て、親は心配している。\n「ばかり」が示す問題は？", ["Child eats nothing but sweets (unhealthy excess).", "Child eats too many vegetables.", "Child is healthy.", "Child eats balanced meals."], 0, ""],
    ["【文】会議で、私が議長を務めることになりました。\n誰の意思か？", ["External decision or group consensus.", "Speaker's personal wish.", "Listener's request.", "Written regulation."], 0, ""],
    ["【文】彼が成功したのは、才能だけでなく、努力のおかげだ。\n「だけでなく」は何を強調する？", ["Not just talent but also effort (additive emphasis).", "Only talent (exclusive).", "Effort alone (no talent).", "Neither talent nor effort."], 0, ""],
  ],
];

// ─── LISTENING MCQs ───────────────────────────────────────────────────────────
const LISTENING_MCQ_BLOCKS: McqPoolRow[][] = [
  // Test 1
  [
    ["（聴解）「田中さんが転職するそうです」の情報源は？", ["Hearsay (heard from someone else).", "Direct observation.", "Speaker's inference.", "Official announcement."], 0, ""],
    ["（聴解）「歩きながらスマホを見るのは危ない」の「ながら」は？", ["Simultaneous actions (walking + phone).", "Sequential (walk then phone).", "Contrast.", "Purpose."], 0, ""],
    ["（聴解）「現金しか使えません」の意味は？", ["Only cash can be used (no card/other).", "Cash and card are OK.", "No cash accepted.", "Cash is not required."], 0, ""],
    ["（聴解）「来年から海外支社に行くことになりました」は誰の決断？", ["External/company decision.", "Speaker's own choice.", "Friend's suggestion.", "Random assignment."], 0, ""],
  ],
  // Test 2
  [
    ["（聴解）「彼女が来ないらしい」と「来ないそうだ」の違いは？", ["らしい = indirect inference; そうだ = explicit hearsay.", "Same meaning.", "そうだ = inference.", "らしい = direct observation."], 0, ""],
    ["（聴解）「赤ちゃんが寝ているあいだに掃除しました」は何をしましたか？", ["Cleaned while baby was sleeping.", "Cleaned before baby slept.", "Cleaned after baby woke.", "Baby cleaned the room."], 0, ""],
    ["（聴解）「若いうちに挑戦すべきだ」の意味は？", ["Should try while still young (before youth ends).", "Should try after becoming experienced.", "Should try because of youth.", "Should not try when young."], 0, ""],
    ["（聴解）「甘い物ばかり食べている」のニュアンスは？", ["Eats nothing but sweets (excessively).", "Eats sweets sometimes.", "Avoids sweets.", "Eats sweets and health food equally."], 0, ""],
  ],
  // Test 3
  [
    ["（聴解）「音楽を聴きながら走ります」は二つの動作を同時にする？", ["Yes — running and listening at the same time.", "No — first music then running.", "Running then music.", "Neither at the same time."], 0, ""],
    ["（聴解）「あの店には駐車場がないらしい」は確かな情報ですか？", ["Not certain — indirect/hearsay evidence.", "Certain — speaker verified.", "Definitely has parking.", "Unknown."], 0, ""],
    ["（聴解）「毎日運動することにしました」は外部決定？内部決定？", ["Internal/personal deliberate decision.", "External decision.", "Obligation.", "Expectation."], 0, ""],
    ["（聴解）「ペンしか持っていません」は何を強調する？", ["Only a pen, nothing else (exclusive + negative).", "Has many pens.", "Pen is optional.", "Has pen and pencil."], 0, ""],
  ],
  // Test 4
  [
    ["（聴解）「日本に行ったことがあります」の意味は？", ["Have the experience of going to Japan.", "Going to Japan now.", "Will go to Japan.", "Never went to Japan."], 0, ""],
    ["（聴解）「勉強しながらテレビを見るのは集中できない」の問題は？", ["Cannot concentrate doing both simultaneously.", "Can concentrate on TV alone.", "Studying is easy.", "TV helps concentration."], 0, ""],
    ["（聴解）「子どものうちに外国語を習うのがいい」の「うちに」は？", ["While still a child (before growing up).", "After childhood.", "Because of childhood.", "Despite childhood."], 0, ""],
    ["（聴解）「海外赴任することになりました」の「ことになりました」は何を示す？", ["External/circumstantial decision.", "Personal voluntary decision.", "Command.", "Expectation."], 0, ""],
  ],
  // Test 5
  [
    ["（聴解）「そうだ」「らしい」「ようだ」を聞き分けるポイントは？", ["そうだ = explicit hearsay; らしい = indirect inference; ようだ = speaker's direct observation/inference.", "All the same.", "ようだ = hearsay.", "らしい = direct observation."], 0, ""],
    ["（聴解）「ことになる」と「ことにする」を聞き分ける手がかりは？", ["ことになる = passive/external; ことにする = active/personal choice.", "Both are passive.", "ことにする is external.", "No difference."], 0, ""],
    ["（聴解）「ばかり」と「しか〜ない」の使い分けは？", ["ばかり = only (often excessive); しか〜ない = only (exclusive, requires negative verb).", "Both require negative.", "ばかり requires negative.", "No difference."], 0, ""],
    ["（聴解）「あいだ」と「うち」の違いを選びなさい。", ["あいだ = bounded period both sides; うち = while state holds (before it changes).", "Same.", "うち = after.", "あいだ = before."], 0, ""],
  ],
];

export function buildWeek2N3SubTests(): JapaneseWeeklySubTest[] {
  return buildN3FivePaperWeek({
    weekPrefix: "jn3-w2",
    vocabBlocks: VOCAB_BLOCKS,
    grammarBlocks: GRAMMAR_BLOCKS,
    readingBlocks: READING_BLOCKS,
    listeningMcqBlocks: LISTENING_MCQ_BLOCKS,
    listeningIntroForTest: (testNum, tid): JapaneseWeeklyTestItem =>
      n3ListeningIntro(
        `${tid}-l-intro`,
        `聴解（N3 Week 2 · Test ${testNum}）：「そうだ/らしい/ようだ」「ながら」「うちに/あいだに」「ばかり/しか」「ことになる/ことにする」などを含む会話・場面問題です。`,
        testNum <= 2
          ? "ゆっくりした会話を1回聞き、伝聞・推量・同時動作の表現をメモしてください。"
          : testNum <= 4
            ? "自然なスピードで2回聞き、そうだ・らしい・ながら・うちに・ことになる/ことにするを識別してください。"
            : "通常スピードで1回のみ聞き、すべての文法ポイントをリアルタイムで識別してください。",
        [8, 9, 10, 11, 12],
      ),
    paperSubtitle: {
      en: `JLPT N3 Week 2 Test — Grammar Topics 8–14`,
      np: `JLPT N3 हप्ता २ परीक्षा — व्याकरण विषय ८–१४`,
      jp: `JLPT N3 第2週テスト · 文法トピック8–14`,
    },
    paperIntro:
      "語彙・漢字から始め、文法・読解・聴解の順に解いてください。Test 1が最も易しく、Test 5が最も難しいです。",
  });
}
