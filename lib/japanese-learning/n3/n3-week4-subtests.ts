/**
 * Week 4 · Days 22–28 · N3 Grammar Topics 22–28 + sprint · five JLPT N3-style papers.
 * Test 1 = easiest (recognition) → Test 5 = hardest (inference + mixed forms).
 * Topics: によって/によっては, おかげで/せいで/ために (cause-effect),
 *         complex sentences, reading strategies, listening sprint,
 *         vocabulary sprint, full mock mindset
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
    ["「によって」の意味として適切なのは？", ["by / depending on / due to", "despite", "in order to", "while"], 0, "〜によって = by (agent) / due to / depending on."],
    ["「おかげで」の意味は？", ["thanks to (positive cause)", "because of (negative cause)", "despite", "in order to"], 0, "〜おかげで = thanks to (positive result)."],
    ["「せいで」の意味は？", ["because of / due to (negative cause)", "thanks to", "despite", "in order to"], 0, "〜せいで = because of (negative result)."],
    ["「によっては」の意味は？", ["depending on the case", "always", "never", "sometimes only"], 0, "〜によっては = depending on (varies by case)."],
    ["「ために」（原因）の用法として正しいのは？", ["because of (cause leading to result, neutral)", "in order to (purpose)", "despite", "while"], 0, "〜ために = cause/reason (when leading to result)."],
  ],
  // Test 2 — usage
  [
    ["「努力のおかげで合格できた」の意味は？", ["Thanks to effort, managed to pass.", "Because of effort, failed.", "Despite effort, passed.", "Effort had no effect."], 0, ""],
    ["「雨のせいで試合が中止になった」の意味は？", ["The game was cancelled because of rain (negative).", "The game was saved thanks to rain.", "Despite rain, the game continued.", "Rain caused a good result."], 0, ""],
    ["「地域によって言葉が違う」の「によって」は？", ["Depending on the region (variation by case).", "Due to the region (negative cause).", "Thanks to the region.", "Despite the region."], 0, ""],
    ["「先生によって教え方が違います」の意味は？", ["Teaching styles differ depending on the teacher.", "Teachers all teach the same way.", "A teacher was different.", "Depends on the subject."], 0, ""],
    ["「ために」（原因）と「のために」（目的）の識別ポイントは？", ["Context + preceding verb form: plain past → cause; dict form → purpose.", "Always same meaning.", "のために = cause always.", "ために = purpose always."], 0, ""],
  ],
  // Test 3 — collocation
  [
    ["「〜によっては〜ないこともある」の構造の意味は？", ["Depending on the case, it may not apply.", "Always does not apply.", "Never applies.", "Applied in all cases."], 0, ""],
    ["「彼のおかげで助かりました」の含意は？", ["Positive: he helped and I was saved.", "Negative: he caused trouble.", "Neutral: he was present.", "I helped him."], 0, ""],
    ["「君のせいで失敗した」の含意は？", ["Negative blame: failure was your fault.", "Positive: you helped me succeed.", "Neutral: coincidence.", "I failed by myself."], 0, ""],
    ["「火事によって家が焼けた」の「によって」は？", ["Agent/cause: the house burned due to fire.", "Depends on the fire.", "Thanks to the fire.", "Despite the fire."], 0, "によって (cause/agent passive)."],
    ["「人によって意見が違う」の「によって」は？", ["Variation depending on person.", "Due to a person (negative).", "Thanks to a person.", "Passive agent."], 0, ""],
  ],
  // Test 4 — nuance discrimination
  [
    ["「おかげで」「せいで」「ために」の感情的ニュアンスの違いは？", ["おかげで = positive thanks; せいで = negative blame; ために = neutral cause.", "All positive.", "All negative.", "All neutral."], 0, ""],
    ["「によって」（受け身の動作主）と「によって」（変化）の区別は？", ["Agent of passive: ○○によって…される; Variation: ○○によって違う.", "No difference.", "Both are passive agents.", "Both are variation."], 0, ""],
    ["「先生のおかげで理解できた」と「先生のせいで困った」の感情は？", ["おかげで = gratitude; せいで = resentment/blame.", "Both gratitude.", "Both blame.", "Both neutral."], 0, ""],
    ["「によっては」と「によって」の違いは？", ["によっては = in some cases (partial/conditional variation); によって = due to / by / depending on (general).", "Same.", "によっては = always.", "によって = conditional only."], 0, ""],
    ["複文を作るとき「が」（逆接）と「けれど」と「ものの」の差は？", ["ものの is most formal; けれど is mid-formal; が is the lightest contrast.", "All the same.", "が is most formal.", "けれど = concessive only."], 0, ""],
  ],
  // Test 5 — integration
  [
    ["「病気のために欠席した」の「ために」は目的か原因か？", ["Cause — missed due to illness.", "Purpose — missed in order to be sick.", "Condition.", "Contrast."], 0, "Plain past + ために = cause; dict-form = purpose."],
    ["「練習したおかげで優勝できた」の論理構造は？", ["Positive cause (練習) → positive result (優勝) using おかげで.", "Negative cause → positive result.", "Positive cause → negative result.", "Neutral cause → result."], 0, ""],
    ["「不注意のせいで事故が起きた」の論理構造は？", ["Negative cause (不注意) → negative result (事故) using せいで.", "Positive cause → accident.", "Neutral cause.", "Accident → carelessness."], 0, ""],
    ["「国によっては、これは違法だ」は何を示す？", ["In some countries (not all) this is illegal.", "Everywhere this is illegal.", "Nowhere is this illegal.", "Unknown legality."], 0, ""],
    ["N3読解で「逆接マーカー」として機能するのはどれか、すべて選べ。", ["が、けれど、ものの、しかし、ところが、にもかかわらず", "したがって、そのため、だから", "つまり、すなわち", "また、さらに"], 0, ""],
  ],
];

// ─── GRAMMAR ──────────────────────────────────────────────────────────────────
const GRAMMAR_BLOCKS: McqPoolRow[][] = [
  // Test 1
  [
    ["この絵は有名な画家（　）描かれました。（passive agent）", ["によって", "のおかげで", "のせいで", "のために"], 0, "〜によって = by (passive agent)."],
    ["先生のご指導（　）、合格できました。", ["のおかげで", "のせいで", "によって", "のために"], 0, "〜のおかげで = thanks to teacher's guidance."],
    ["彼女が遅刻した（　）、会議が始められなかった。", ["せいで", "おかげで", "によって", "ために"], 0, "〜せいで = because of (negative result)."],
    ["国（　）、文化が大きく異なります。", ["によって", "のために", "おかげで", "のせいで"], 0, "〜によって = depending on the country."],
    ["場合（　）、例外もあります。", ["によっては", "によって", "のために", "のおかげで"], 0, "〜によっては = in some cases."],
    ["病気（　）、試験を受けられなかった。（neutral cause）", ["のために", "のおかげで", "のせいで", "によって"], 0, "〜のために = due to illness (neutral cause + negative result)."],
  ],
  // Test 2
  [
    ["この法律は国（　）異なります。", ["によって", "のために", "のおかげで", "のせいで"], 0, "〜によって = differs by country."],
    ["友達の助け（　）、引っ越しができました。", ["のおかげで", "のせいで", "によって", "ために"], 0, "〜のおかげで = thanks to friend's help."],
    ["弟の不注意（　）、花瓶が割れてしまった。", ["のせいで", "のおかげで", "によって", "ために"], 0, "〜のせいで = because of younger brother's carelessness."],
    ["条件（　）、価格が変わります。", ["によっては", "によって", "のために", "のおかげで"], 0, "〜によっては = in some conditions."],
    ["厳しい練習（　）、大会で優勝できました。", ["のおかげで", "のせいで", "によって", "ために"], 0, ""],
    ["台風（　）、多くの家が被害を受けた。", ["のために", "のおかげで", "のせいで", "の"], 0, "台風のために = due to the typhoon (neutral cause)."],
  ],
  // Test 3
  [
    ["建物は地震（　）倒れました。（agent）", ["によって", "のおかげで", "のせいで", "ために"], 0, "〜によって = due to earthquake (cause/agent)."],
    ["彼のアドバイス（　）、うまくいきました。", ["のおかげで", "のせいで", "によって", "ために"], 0, "〜のおかげで = thanks to his advice."],
    ["彼の失言（　）、チームの雰囲気が悪くなった。", ["のせいで", "のおかげで", "によって", "ために"], 0, "〜のせいで = because of his slip of the tongue."],
    ["人（　）、反応が違います。", ["によって", "のために", "のおかげで", "のせいで"], 0, "〜によって = reactions differ by person."],
    ["時期（　）、価格が高くなることもあります。", ["によっては", "によって", "のために", "のおかげで"], 0, ""],
    ["アクセスのしやすさ（　）、利用者数が変わります。", ["によって", "のために", "のおかげで", "のせいで"], 0, ""],
  ],
  // Test 4
  [
    ["「おかげで」と「のために（原因）」の感情的差は？", ["おかげで = positive (gratitude); のために = neutral (can be negative too).", "No difference.", "のために = positive.", "おかげで = neutral."], 0, ""],
    ["「せいで」と「おかげで」の使い分け問題：\n失敗した（　）、落ち込んでいます。（negative cause）", ["のせいで", "のおかげで", "によって", "ために"], 0, ""],
    ["「文化（　）、礼儀の示し方は異なる」の（　）は？", ["によって", "のために", "のおかげで", "のせいで"], 0, "〜によって (variation) =礼儀の示し方は文化によって異なる."],
    ["「場合（　）は、追加料金がかかります」の（　）は？", ["によって", "のために", "のおかげで", "のせいで"], 0, "場合によっては = in some cases."],
    ["受け身文で動作主を表す格助詞は？", ["によって", "が", "を", "に"], 0, "〜によって = by (passive agent in formal/written Japanese)."],
    ["「混雑（　）電車が遅れました」の（　）は？", ["のために", "のおかげで", "のせいで", "によって"], 0, "混雑のために = due to congestion (neutral cause)."],
  ],
  // Test 5
  [
    ["「日照り（　）、農作物に被害が出た」の（　）は？", ["のために", "のおかげで", "のせいで", "によって"], 0, "日照りのために = due to drought (neutral/formal cause)."],
    ["「先生の励まし（　）、続けることができた」の（　）は？", ["のおかげで", "のせいで", "のために", "によって"], 0, ""],
    ["「彼の計画の甘さ（　）、プロジェクトが失敗した」の（　）は？", ["のせいで", "のおかげで", "のために", "によって"], 0, ""],
    ["「契約内容（　）異なりますので、ご確認ください」の（　）は？", ["によって", "のために", "のおかげで", "のせいで"], 0, "〜によって (variation) = differs depending on contract."],
    ["「解釈（　）は、違う結論になることもある」の（　）は？", ["によっては", "によって", "のために", "のおかげで"], 0, "〜によっては (partial variation) = depending on interpretation."],
  ],
];

// ─── READING ─────────────────────────────────────────────────────────────────
const READING_BLOCKS: McqPoolRow[][] = [
  // Test 1
  [
    ["【文】この橋は有名な建築家によって設計されました。\n「によって」は何を表す？", ["Passive agent: designed by a famous architect.", "Variation: differs by architect.", "Cause: because of architect.", "Thanks to the architect."], 0, ""],
    ["【文】先輩のおかげで、就職活動がうまくいきました。\n感情は？", ["Gratitude — the senior's help led to success.", "Blame — the senior caused problems.", "Neutral.", "Indifference."], 0, ""],
    ["【文】彼のミスのせいで、プロジェクトが遅れた。\n感情は？", ["Negative blame — his mistake caused delay.", "Gratitude.", "Neutral.", "Positive."], 0, ""],
    ["【文】国によって、休日の数が違います。\n何が異なる？", ["Number of holidays varies by country.", "Number of holidays is the same everywhere.", "Holidays are always the same.", "Countries have no holidays."], 0, ""],
    ["【文】場合によっては、例外が認められることもあります。\n意味は？", ["In some cases, exceptions may be allowed.", "Exceptions are always allowed.", "No exceptions are ever allowed.", "All cases are exceptions."], 0, ""],
  ],
  // Test 2
  [
    ["【文】毎日の練習のおかげで、ピアノが上手になりました。\n原因と結果は？", ["Practice (positive cause) → improvement (positive result).", "Practice → failure.", "No effort → improvement.", "Random improvement."], 0, ""],
    ["【文】夜更かしのせいで、朝起きられなかった。\n原因と結果は？", ["Staying up late (negative cause) → couldn't wake up (negative result).", "Staying up late → woke up refreshed.", "Sleep → couldn't wake.", "No cause."], 0, ""],
    ["【文】工場の騒音のために、近隣住民が困っている。\n「のために」の意味は？", ["Neutral cause: residents troubled because of factory noise.", "Thanks to noise.", "Purpose: make residents troubled.", "Contrast."], 0, ""],
    ["【文】地域によって方言が異なります。\n文の意味は？", ["Dialects differ depending on the region.", "Dialects are the same everywhere.", "Only one dialect exists.", "Region determines dialect direction."], 0, ""],
    ["【文】状況によっては、無理に話し合いをする必要はない。\n意味は？", ["In some situations, forcing a discussion is unnecessary.", "Always need to discuss.", "Never need to discuss.", "Situation is always the same."], 0, ""],
  ],
  // Test 3
  [
    ["【文】祖母の手料理のおかげで、元気になりました。\n意味は？", ["Recovered thanks to grandmother's home cooking.", "Got sick because of grandmother's cooking.", "Grandmother recovered.", "Neutral cause of recovery."], 0, ""],
    ["【文】忘れ物のせいで、仕事に大きな支障が出ました。\n問題の原因は？", ["Forgetting something caused major work disruption.", "Work disruption led to forgetting things.", "Work was fine despite forgetting.", "No disruption."], 0, ""],
    ["【文】この結果は、多くの人の努力によって実現しました。\n「によって」は？", ["Agent/means: realized through many people's efforts.", "Variation by person.", "Thanks to effort (おかげで nuance).", "Cause of negative result."], 0, ""],
    ["【文】N3の読解問題では、逆接マーカーに注意することが重要だ。\n逆接マーカーの例として正しいのは？", ["しかし、ところが、けれど、にもかかわらず", "したがって、そのため、だから", "また、さらに、しかも", "つまり、すなわち"], 0, ""],
    ["【文】順接マーカーに注意することも大切だ。順接マーカーの例は？", ["したがって、そのため、だから、それで", "しかし、ところが、けれど", "また、さらに", "つまり、すなわち"], 0, ""],
  ],
  // Test 4
  [
    ["【文】彼女のサポートがなければ、ここまで来られなかったでしょう。\nこの文が示す感情は？", ["Deep gratitude (implies おかげで relationship).", "Blame.", "Indifference.", "Resentment."], 0, ""],
    ["【文】天気によっては、イベントが中止になることもあります。\n意味は？", ["Depending on weather, the event might be cancelled.", "Event is always cancelled due to weather.", "Weather never affects the event.", "Event is guaranteed."], 0, ""],
    ["【文】私の不注意のせいで、皆さんにご迷惑をおかけしました。\nここでの謝罪の構造は？", ["Negative cause (my carelessness) → negative result (trouble for everyone).", "Positive cause → trouble.", "Neutral cause.", "No cause stated."], 0, ""],
    ["【文】この習慣は地域によって大きく異なります。しかし、基本的な価値観は共通しています。\n「しかし」の機能は？", ["Contrast connector: habits vary BUT core values are shared.", "Cause connector.", "Addition connector.", "Result connector."], 0, ""],
    ["【文】N3の文章には「つまり」「すなわち」などの言い換え表現も多い。何を示す？", ["Paraphrase/clarification markers (in other words).", "Contrast markers.", "Cause-effect markers.", "Addition markers."], 0, ""],
  ],
  // Test 5
  [
    ["【文】地道な努力のおかげで夢を実現できたと、受賞者はスピーチで述べた。\nこの文に使われている機能は？", ["おかげで (positive cause → positive result) + quoted speech.", "せいで + hearsay.", "によって (agent) + opinion.", "ために (purpose) + result."], 0, ""],
    ["【文】アクセス方法によっては、割引が適用されないこともあります。\n何について注意を促していますか？", ["Discount may not apply depending on access method.", "Discount always applies.", "No discount exists.", "Access is always discounted."], 0, ""],
    ["【文】台風の影響のために交通機関が麻痺した。その後、当局によって迅速な対応が取られた。\n二つの「によって」の機能を答えよ。", ["のために = neutral cause; によって = passive agent of official response.", "Both are passive agents.", "Both are variation.", "のために = purpose; によって = cause."], 0, ""],
    ["【文】N3読解では、段落の冒頭文（トピックセンテンス）を見つけることが速読の鍵だ。\nこの戦略の目的は？", ["Identify the main idea quickly by finding the topic sentence.", "Read every word carefully.", "Ignore the first sentence.", "Focus only on the last sentence."], 0, ""],
    ["【文】文章中の「おかげで」「せいで」「によって」「ために」を見分けることは、N3読解で因果関係を正確に把握するために欠かせない。\nなぜこれらを区別する必要があるか？", ["They signal different cause-effect relationships with different emotional nuances.", "They all mean the same thing.", "They are interchangeable.", "Only one of them is correct in any context."], 0, ""],
  ],
];

// ─── LISTENING MCQs ───────────────────────────────────────────────────────────
const LISTENING_MCQ_BLOCKS: McqPoolRow[][] = [
  // Test 1
  [
    ["（聴解）「先生のおかげで合格しました」の意味は？", ["Passed thanks to the teacher (positive cause + gratitude).", "Failed because of the teacher.", "Teacher passed the exam.", "Neutral result."], 0, ""],
    ["（聴解）「渋滞のせいで遅刻しました」の原因は？", ["Traffic jam (negative cause → negative result).", "Rain (positive cause).", "Train delay.", "No cause."], 0, ""],
    ["（聴解）「国によって法律が違います」の「によって」は？", ["Variation by country.", "Passive agent.", "Negative cause.", "Positive cause."], 0, ""],
    ["（聴解）「場合によっては中止になります」の意味は？", ["In some cases, it may be cancelled.", "Always cancelled.", "Never cancelled.", "All cases are the same."], 0, ""],
  ],
  // Test 2
  [
    ["（聴解）「おかげで」と「せいで」の感情的差は？", ["おかげで = positive/gratitude; せいで = negative/blame.", "Both positive.", "Both negative.", "Same."], 0, ""],
    ["（聴解）「台風のために電車が止まった」の「のために」の感情は？", ["Neutral cause (neither gratitude nor blame).", "Positive thanks.", "Strong blame.", "Purpose."], 0, ""],
    ["（聴解）「この建物は100年前に有名な建築家によって建てられました」の「によって」は？", ["Passive agent (built by a famous architect).", "Variation.", "Negative cause.", "Thanks to."], 0, ""],
    ["（聴解）N3聴解で「逆接」を示す表現はどれですか？", ["しかし、でも、ところが、けれど", "そのため、だから、したがって", "また、さらに", "つまり、すなわち"], 0, ""],
  ],
  // Test 3
  [
    ["（聴解）「友達の協力のおかげで無事に終わりました」の因果関係は？", ["Friend's cooperation (positive) → successful completion (positive).", "Friend caused failure.", "Neutral result.", "No cooperation."], 0, ""],
    ["（聴解）「彼のうそのせいでトラブルになった」の因果関係は？", ["His lie (negative) → trouble (negative).", "His lie → success.", "No connection.", "Positive cause."], 0, ""],
    ["（聴解）「地域によって食文化が異なる」の「によって」の用法は？", ["Variation depending on region.", "Passive agent.", "Negative cause.", "Thanks to region."], 0, ""],
    ["（聴解）N3読解で「したがって/そのため」が示す関係は？", ["Cause → result (therefore / as a result).", "Contrast.", "Addition.", "Concession."], 0, ""],
  ],
  // Test 4
  [
    ["（聴解）「によって」が受け身の動作主を示す文として正しいのは？", ["この絵は田中さんによって描かれた。", "田中さんによっては、絵が違う。", "田中さんのせいで絵が汚れた。", "田中さんのおかげで絵が完成した。"], 0, "受け身 + によって = passive with agent."],
    ["（聴解）「時間帯によっては混雑します」の意味は？", ["In some time slots it gets crowded (partial variation).", "Always crowded.", "Never crowded.", "All times are the same."], 0, ""],
    ["（聴解）「努力したのに報われなかった」の「のに」が示す気持ちは？", ["Complaint/frustration at unexpected negative result.", "Gratitude.", "Approval.", "Certainty."], 0, ""],
    ["（聴解）N3文章読解でトピックセンテンスを見つける方法は？", ["It's usually the first sentence of a paragraph that states the main idea.", "It's always the last sentence.", "It's always the middle sentence.", "Topic sentences don't exist in Japanese."], 0, ""],
  ],
  // Test 5
  [
    ["（聴解）「おかげで」「せいで」「のために（原因）」「によって」を聞き分けるポイントは？", ["おかげで = positive thanks; せいで = negative blame; のために = neutral cause; によって = agent/variation.", "All the same.", "All negative.", "All positive."], 0, ""],
    ["（聴解）「によって」の多義性（受け身の動作主・変化・手段）を場面から識別する方法は？", ["Look at the surrounding sentence structure: passive verb → agent; 違う/異なる → variation; method → means.", "All uses are identical.", "Only one use exists.", "Context doesn't matter."], 0, ""],
    ["（聴解）N3聴解の問題では、発話の「主旨」を問う問題が多い。主旨を聞き取るコツは？", ["Focus on the final statement or the stance shift after contrast markers.", "Focus only on the first sentence.", "Ignore contrast markers.", "Memorize every word."], 0, ""],
    ["（聴解）「順接」マーカーと「逆接」マーカーをすべて正しく対応させているのは？", ["順接: したがって/だから; 逆接: しかし/けれど/ところが", "順接: しかし; 逆接: だから", "両方同じ", "順接マーカーは日本語に存在しない"], 0, ""],
  ],
];

export function buildWeek4N3SubTests(): JapaneseWeeklySubTest[] {
  return buildN3FivePaperWeek({
    weekPrefix: "jn3-w4",
    vocabBlocks: VOCAB_BLOCKS,
    grammarBlocks: GRAMMAR_BLOCKS,
    readingBlocks: READING_BLOCKS,
    listeningMcqBlocks: LISTENING_MCQ_BLOCKS,
    listeningIntroForTest: (testNum, tid): JapaneseWeeklyTestItem =>
      n3ListeningIntro(
        `${tid}-l-intro`,
        `聴解（N3 Week 4 · Test ${testNum}）：「によって/によっては」「おかげで/せいで/ために（原因）」「複文・読解戦略・リスニングスプリント」などを含む総合問題です。`,
        testNum <= 2
          ? "ゆっくりした会話を1回聞き、因果関係の表現と逆接・順接マーカーをメモしてください。"
          : testNum <= 4
            ? "自然なスピードで2回聞き、おかげで・せいで・によって・ために・逆接マーカーをすべて識別してください。"
            : "通常スピードで1回のみ聞き、すべての文法・談話マーカーをリアルタイムで識別してください。",
        [22, 23, 24, 25],
        26,
      ),
    paperSubtitle: {
      en: `JLPT N3 Week 4 Test — Grammar Topics 22–28 + sprint`,
      np: `JLPT N3 हप्ता ४ परीक्षा — व्याकरण विषय २२–२८ + स्प्रिन्ट`,
      jp: `JLPT N3 第4週テスト · 文法トピック22–28＋スプリント`,
    },
    paperIntro:
      "語彙・漢字から始め、文法・読解・聴解の順に解いてください。Test 1が最も易しく、Test 5が最も難しいです。",
  });
}
