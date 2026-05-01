import type { N5LessonSpec } from "@/lib/japanese-learning/n5/build-japanese-detail";
import { mkN3Lesson as mk } from "@/lib/japanese-learning/n3/n3-lesson-factory";

/** Days 1–7 — Week 1 N3 grammar */
export const JP_N3_PART1: N5LessonSpec[] = [
  // Day 1: 〜てある
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "田中", ja: "あ、テーブルに花が飾ってありますね。", reading: "A, tēburu ni hana ga kazatte arimasu ne.", en: { en: "Oh, flowers have been arranged on the table.", np: "आँ, टेबलमा फूल सजाइएको छ।", jp: "あ、テーブルに花が飾られていますね。" } },
      { speaker: "山田", ja: "はい、パーティーのために準備してあります。", reading: "Hai, pātī no tame ni junbi shite arimasu.", en: { en: "Yes, it has been prepared for the party.", np: "हो, पार्टीका लागि तयारी गरिएको छ।", jp: "はい、パーティーのために準備してあります。" } },
      { speaker: "田中", ja: "ドアも開けてありますよ。お客さんが来やすいように。", reading: "Doa mo akete arimasu yo. Okyakusan ga kiyasui yō ni.", en: { en: "The door has also been opened, so guests can enter easily.", np: "ढोका पनि खोलिएको छ, पाहुनाहरू सजिलैसँग आउन सकुन भनेर।", jp: "ドアも開けてありますよ。お客様が入りやすいように。" } },
      { speaker: "山田", ja: "飲み物もテーブルに並べてあります。", reading: "Nomimono mo tēburu ni narabete arimasu.", en: { en: "Drinks have also been lined up on the table.", np: "पेय पदार्थहरू पनि टेबलमा राखिएको छ।", jp: "飲み物もテーブルに並べてあります。" } },
      { speaker: "田中", ja: "すごいですね。いつ準備したんですか。", reading: "Sugoi desu ne. Itsu junbi shita n desu ka.", en: { en: "That's impressive. When did you prepare?", np: "राम्रो छ। कहिले तयारी गर्नुभयो?", jp: "すごいですね。いつ準備されたんですか？" } },
      { speaker: "山田", ja: "午前中にやっておきました。てあるとておくは少し違うんです。", reading: "Gozenchū ni yatte okimashita. Te aru to te oku wa sukoshi chigau n desu.", en: { en: "I did it this morning. テある and ておく are a little different.", np: "बिहान गरेँ। てある र ておく थोरै फरक छन्।", jp: "午前中にやっておきました。てあるとておくは少し違うんです。" } },
    ],
    particles: [
      { particle: "〜てある", note: { en: "State resulting from someone's prior deliberate action: ドアが開けてある = the door is (in an) opened (state).", np: "कसैको जानाजान कार्यको फलस्वरूप अवस्था: ドアが開けてある = ढोका खोलिएको अवस्थामा छ।", jp: "誰かの意図的な行為の結果として残る状態：ドアが開けてある。" } },
      { particle: "〜ておく", note: { en: "Action done in advance for future benefit: 準備しておく = prepare ahead of time.", np: "भविष्यको लागि अग्रिम गरिएको कार्य: 準備しておく = अगाडि नै तयारी गर्नु।", jp: "将来に備えて事前に行う：準備しておく。" } },
      { particle: "が (subject of てある)", note: { en: "In 〜てある constructions the item acted upon becomes the subject marked by が.", np: "〜てある निर्माणमा जसमाथि काम गरिएको थियो त्यो が ले मार्क हुन्छ।", jp: "てあるの構文では行為の対象がが格になる。" } },
    ],
    grammarBullets: [
      { en: "〜てある: transitive verb て-form + ある → describes a resulting state. Compare: 窓が開けてある (state: opened by someone) vs 窓が開いている (state: open, no agent implied).", np: "〜てある: सकर्मक क्रिया て-रूप + ある → फलस्वरूप अवस्था। तुलना: 窓が開けてある vs 窓が開いている।", jp: "〜てある：他動詞て形+ある→結果状態を表す。窓が開けてある（誰かが開けた状態）vs 窓が開いている（単なる状態）。" },
      { en: "Only transitive verbs (他動詞) can take 〜てある. 自動詞 (intransitive) use 〜ている for states.", np: "केवल सकर्मक क्रिया (他動詞) ले 〜てある लिन सक्छ। 自動詞ले अवस्थाका लागि 〜ている प्रयोग गर्छ।", jp: "てあるを取れるのは他動詞のみ。自動詞の状態はていると表す。" },
      { en: "Key contrast: ておく emphasises the preparation action; てある emphasises the resulting state left behind.", np: "मुख्य भिन्नता: ておく तयारी कार्यलाई जोड दिन्छ; てある पछाडि रहेको अवस्थालाई।", jp: "ておくは準備行為を強調；てあるは残された状態を強調する点が異なる。" },
    ],
    grammarTable: {
      caption: { en: "〜てある vs 〜ている vs 〜ておく", np: "〜てある vs 〜ている vs 〜ておく", jp: "〜てある・〜ている・〜ておく の比較" },
      headers: [{ en: "Form", np: "रूप", jp: "形" }, { en: "Focus", np: "केन्द्र", jp: "焦点" }, { en: "Example", np: "उदाहरण", jp: "例" }],
      rows: [
        ["〜てある", { en: "resulting state (agent implicit)", np: "फलस्वरूप अवस्था (कर्ता निहित)", jp: "結果状態（誰かがやった）" }, "花が飾ってある"],
        ["〜ている", { en: "current state or ongoing action", np: "हालको अवस्था वा जारी कार्य", jp: "現在の状態・継続行為" }, "窓が開いている"],
        ["〜ておく", { en: "preparation for future", np: "भविष्यका लागि तयारी", jp: "将来に備える準備" }, "準備しておく"],
      ],
    },
    mcqs: [
      {
        question: { en: "Which sentence correctly uses 〜てある?", np: "कुन वाक्यमा 〜てある सही प्रयोग भएको छ?", jp: "てあるを正しく使っている文はどれか？" },
        choices: ["ドアが開いてある。", "ドアを開けてある。", "ドアが開けてある。", "ドアを開いてある。"],
        correctIndex: 2,
        explanation: { en: "〜てある requires a transitive verb with が marking the object-turned-subject: ドアが開けてある.", np: "〜てある ले सकर्मक क्रिया चाहिन्छ र が ले object-turned-subject: ドアが開けてある।", jp: "てあるは他動詞＋がで目的語が主語になる：ドアが開けてある。" },
      },
      {
        question: { en: "Which expresses preparation done in advance?", np: "कुन वाक्यले अग्रिम तयारी व्यक्त गर्छ?", jp: "事前の準備を表すのはどれか？" },
        choices: ["資料を作ってある。", "資料を作っておいた。", "資料が作っている。", "資料は作る。"],
        correctIndex: 1,
        explanation: { en: "〜ておく/ておいた expresses preparation. 〜てある focuses on the resulting state.", np: "〜ておく/ておいた ले तयारी व्यक्त गर्छ। 〜てある ले फलस्वरूप अवस्थामा जोड दिन्छ।", jp: "ておいた＝準備完了の行為。てあるは結果状態。" },
      },
    ],
    listening: {
      scenario: { en: "Someone enters a room and comments on the state of things left prepared for a guest visit.", np: "कोही कोठामा प्रवेश गर्छ र अतिथिको भ्रमणका लागि तयार गरिएका वस्तुहरूको अवस्थामा टिप्पणी गर्छ।", jp: "訪問客のために準備された部屋に入り、置かれた状態についてコメントする場面。" },
      instruction: { en: "Listen for 〜てある phrases and identify what has been prepared and for whom.", np: "〜てある वाक्यांशहरू सुन्नुहोस् र के कसका लागि तयारी भएको छ पहिचान गर्नुहोस्।", jp: "てあるのフレーズに注目し、何が誰のために準備されているか確認。" },
      keyPhrases: ["〜てあります", "〜てある", "〜ておきました", "が〜てある"],
      studyTip: { en: "Draw a quick table: left column = thing prepared, right column = てある phrase. This reinforces the state-focus.", np: "छोटो तालिका बनाउनुहोस्: बायाँ स्तम्भ = तयार गरिएको वस्तु, दायाँ = てある वाक्यांश।", jp: "左列＝準備されたもの、右列＝てあるのフレーズで表を作ると状態焦点が定着する。" },
    },
  }),

  // Day 2: Relative clauses (noun modification)
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "佐藤", ja: "昨日食べたラーメンは本当においしかった。", reading: "Kinō tabeta rāmen wa hontō ni oishikatta.", en: { en: "The ramen I ate yesterday was really delicious.", np: "हिजो खाएको रामेन साँच्चै मिठो थियो।", jp: "昨日食べたラーメンは本当においしかったです。" } },
      { speaker: "木村", ja: "どこのお店？私が知っている店ですか。", reading: "Doko no omise? Watashi ga shitte iru mise desu ka.", en: { en: "Which restaurant? Is it the one I know?", np: "कुन पसल? मैले चिनेको पसल हो?", jp: "どこのお店ですか？私が知っているお店ですか？" } },
      { speaker: "佐藤", ja: "駅の近くに新しくできた店です。先月オープンしたばかりの店ですよ。", reading: "Eki no chikaku ni atarashiku dekita mise desu. Sengetsu ōpun shita bakari no mise desu yo.", en: { en: "It's a new shop that opened near the station. It's the shop that just opened last month.", np: "स्टेशन नजिक नयाँ खुलेको पसल हो। गत महिना मात्र खुलेको पसल हो।", jp: "駅の近くに新しくできたお店です。先月オープンしたばかりのお店ですよ。" } },
      { speaker: "木村", ja: "そこで働いている人は親切ですか。", reading: "Soko de hataraite iru hito wa shinsetsu desu ka.", en: { en: "Are the people working there kind?", np: "त्यहाँ काम गर्ने मानिसहरू दयालु छन्?", jp: "そこで働いている人たちは親切ですか？" } },
      { speaker: "佐藤", ja: "はい、一緒に来た友達も気に入りましたよ。", reading: "Hai, issho ni kita tomodachi mo ki ni irimashita yo.", en: { en: "Yes, the friend who came with me also liked it.", np: "हो, सँगै आएको साथीलाई पनि मन परेको थियो।", jp: "はい、一緒に来た友人も気に入っていましたよ。" } },
      { speaker: "木村", ja: "今度連れて行ってください。食べたいものが多そうです。", reading: "Kondo tsurete itte kudasai. Tabetai mono ga ōsasō desu.", en: { en: "Please take me there next time. There seem to be many things I want to eat.", np: "अर्को पटक लिएर जानुस् कि। खान मन लाग्ने धेरै चिजहरू होलान्।", jp: "今度連れて行ってください。食べたいものがたくさんありそうです。" } },
    ],
    particles: [
      { particle: "Verb (plain form) + Noun", note: { en: "Japanese relative clauses: verb/adj plain form directly precedes the modified noun — 食べた [ラーメン], 知っている [店].", np: "जापानी सापेक्ष खण्ड: क्रिया/विशेषण सादा रूप सिधै संशोधित संज्ञा अगाडि आउँछ।", jp: "日本語の関係節：動詞・形容詞の普通形が名詞を直接修飾する。" } },
      { particle: "の (nominalizer in relative clauses)", note: { en: "の can replace noun in relative clause context when the referent is clear: 先月来たの = the one who came last month.", np: "のले संदर्भ स्पष्ट हुँदा संज्ञाको ठाउँमा आउन सक्छ।", jp: "指示対象が明らかな場合、関係節の名詞の代わりにのを使える。" } },
      { particle: "が (subject of relative clause)", note: { en: "Inside a relative clause, the subject is marked by が (not は): 私が知っている店.", np: "सापेक्ष खण्डभित्र, विषय が ले मार्क हुन्छ (は होइन)।", jp: "関係節の中の主語はが格（はではない）：私が知っている店。" } },
    ],
    grammarBullets: [
      { en: "Relative clause structure: [S が V (plain)] + N. The entire clause modifies the noun following it.", np: "सापेक्ष खण्ड संरचना: [S が V (सादा)] + N। सम्पूर्ण खण्डले पछिल्लो संज्ञा संशोधन गर्छ।", jp: "関係節の構造：[SがV（普通形）]+N。節全体が後続の名詞を修飾する。" },
      { en: "Tense in relative clauses is independent of the main clause tense: 昨日食べた店は今も有名です.", np: "सापेक्ष खण्डमा काल मुख्य खण्डको कालसँग स्वतन्त्र: 昨日食べた店は今も有名です।", jp: "関係節のテンスは主節と独立している：昨日食べた店は今も有名です。" },
      { en: "Both noun-modifying adjectives and verbs can head relative clauses: 大きい犬 / 走っている犬.", np: "संज्ञा-संशोधन विशेषण र क्रिया दुवैले सापेक्ष खण्ड सुरु गर्न सक्छ।", jp: "形容詞も動詞も関係節の先頭になれる：大きい犬・走っている犬。" },
    ],
    mcqs: [
      {
        question: { en: "How do you say 'the book that my friend recommended'?", np: "'साथीले सिफारिस गरेको किताब' कसरी भन्छन्?", jp: "「友達が勧めてくれた本」の日本語として正しいのは？" },
        choices: ["友達に勧める本", "友達が勧めてくれた本", "友達を勧めた本", "友達の勧めた本"],
        correctIndex: 1,
        explanation: { en: "Inside the relative clause, 友達 is subject marked by が, and the verb is plain past form.", np: "सापेक्ष खण्डभित्र 友達 が ले विषय चिन्ह लगाइएको र क्रिया सादा भूत रूपमा।", jp: "関係節内の主語はが：友達が勧めてくれた本。" },
      },
      {
        question: { en: "Which is a correct relative clause construction?", np: "कुन सही सापेक्ष खण्ड निर्माण हो?", jp: "正しい関係節の構造はどれか？" },
        choices: ["公園を走っている犬は可愛い。", "公園は走っている犬が可愛い。", "可愛い犬は公園を走っている。", "公園で走っている犬は可愛い。"],
        correctIndex: 3,
        explanation: { en: "公園で走っている犬は可愛い = The dog running in the park is cute — correct particle で for location of action.", np: "公園で走っている犬は可愛い = पार्कमा दौडिरहेको कुकुर प्यारो छ — で कार्य स्थानको लागि सही।", jp: "公園で走っている犬は可愛い：で＝場所の助詞として正しい。" },
      },
    ],
    listening: {
      scenario: { en: "Two people discuss a film they watched and describe the characters using relative clauses.", np: "दुई जना आफूले हेरेको चलचित्र छलफल गर्छन् र सापेक्ष खण्ड प्रयोग गरेर पात्रहरूको वर्णन गर्छन्।", jp: "見た映画について話し、関係節を使って登場人物を描写する場面。" },
      instruction: { en: "Identify each relative clause and the noun it modifies. Write down the structure: [clause] + noun.", np: "प्रत्येक सापेक्ष खण्ड र यसले संशोधन गर्ने संज्ञा पहिचान गर्नुहोस्।", jp: "関係節とその修飾する名詞を特定し、[節]+名詞の構造を書き取ってください。" },
      keyPhrases: ["〜た人", "〜ている場所", "〜な映画", "〜で有名な"],
      studyTip: { en: "Practice: take 5 nouns and construct a relative clause for each one.", np: "अभ्यास: ५ संज्ञाहरू लिनुहोस् र प्रत्येकका लागि सापेक्ष खण्ड बनाउनुहोस्।", jp: "名詞5つを選び、それぞれに関係節を作る練習が効果的。" },
    },
  }),

  // Day 3: 〜のに
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "中村", ja: "あんなに練習したのに、試験に落ちてしまいました。", reading: "Anna ni renshū shita noni, shiken ni ochite shimaimashita.", en: { en: "Even though I practiced so much, I failed the exam.", np: "यति धेरै अभ्यास गरेको भए पनि, परीक्षामा फेल भएँ।", jp: "あんなに練習したのに、試験に落ちてしまいました。" } },
      { speaker: "高橋", ja: "残念ですね。真剣にやったのに、残念ですよ。", reading: "Zannen desu ne. Shinken ni yatta noni, zannen desu yo.", en: { en: "That's too bad. After working so seriously, what a shame.", np: "दुखद छ। यति गम्भीरतापूर्वक गरेको भए पनि, कस्तो दुर्भाग्य।", jp: "残念ですね。真剣に取り組んだのに、惜しいですね。" } },
      { speaker: "中村", ja: "でも次は合格するために、もっと頑張ります。", reading: "Demo tsugi wa gōkaku suru tame ni, motto ganbarimasu.", en: { en: "But I'll work harder in order to pass next time.", np: "तर अर्को पटक पास हुनका लागि, थप मिहेनत गर्छु।", jp: "でも次は合格するために、もっと頑張ります。" } },
      { speaker: "高橋", ja: "そういえば、あの電気をつけたのに消えてしまいます。", reading: "Sō ieba, ano denki o tsuketa noni kiete shimaimasu.", en: { en: "Come to think of it, I turn on that light but it keeps going out.", np: "हाँ, त्यो बत्ती बालेको भए पनि निभिरहन्छ।", jp: "そういえば、あの電灯をつけたのにすぐ消えてしまうんです。" } },
      { speaker: "中村", ja: "修理が必要ですね。直すために業者を呼びましょう。", reading: "Shūri ga hitsuyō desu ne. Naosu tame ni gyōsha o yobimashō.", en: { en: "You need a repair. Let's call a technician to fix it.", np: "मर्मत आवश्यक छ। ठिक गर्नका लागि मिस्त्री बोलाउँ।", jp: "修理が必要ですね。直すために業者を呼びましょう。" } },
    ],
    particles: [
      { particle: "〜のに (unexpected result)", note: { en: "Expresses frustration/surprise at an outcome contrary to expectation: 練習したのに試験に落ちた = practiced but still failed.", np: "अपेक्षाको विपरीत परिणाममा निराशा/अचम्म व्यक्त गर्छ।", jp: "期待と反する結果に対する失望・驚き：練習したのに試験に落ちた。" } },
      { particle: "〜のに (purpose)", note: { en: "Expresses purpose with noun or noun-like form: このカメラは写真を撮るのに使います = I use this camera for taking photos.", np: "संज्ञा वा संज्ञा-जस्तो रूपसँग उद्देश्य व्यक्त गर्छ।", jp: "名詞的形式で目的を表す：このカメラは写真を撮るのに使います。" } },
      { particle: "のに vs ために", note: { en: "Purpose のに focuses on utility/means; ために focuses on goal/aim. のに cannot follow nouns directly.", np: "उद्देश्य のに उपयोगिता/साधनमा केन्द्रित; ために लक्ष्य/उद्देश्यमा।", jp: "目的のに＝手段・利用；ために＝目標・狙い。のには直接名詞に続かない。" } },
    ],
    grammarBullets: [
      { en: "Contrastive 〜のに: plain form + のに + clause expressing disappointment. Speaker expected a different result.", np: "विरोधाभासी 〜のに: सादा रूप + のに + निराशा व्यक्त गर्ने खण्ड। वक्ताले फरक परिणाम अपेक्षा गरेको थियो।", jp: "逆接のに：普通形＋のに＋失望を表す節。話し手は別の結果を期待していた。" },
      { en: "Purpose 〜のに: verb dictionary form + のに + expression of use/need: 開けるのに鍵が要ります = You need a key to open it.", np: "उद्देश्य 〜のに: क्रिया शब्दकोश रूप + のに + प्रयोग/आवश्यकता अभिव्यक्ति।", jp: "目的のに：動詞辞書形＋のに＋使用・必要の表現：開けるのに鍵が要ります。" },
      { en: "The two のに are distinguished by context: complaint register uses contrastive のに; neutral utility statements use purpose のに.", np: "दुई のに सन्दर्भले भिन्न हुन्छ: गुनासो दर्ताले विरोधाभासी のに प्रयोग गर्छ; तटस्थ उपयोगिता कथनले उद्देश्य のに।", jp: "二つのにはコンテクストで区別：不満表現＝逆接のに；中立的な手段表現＝目的のに。" },
    ],
    mcqs: [
      {
        question: { en: "Which sentence uses 〜のに for unexpected result?", np: "कुन वाक्यमा 〜のに अप्रत्याशित परिणामका लागि प्रयोग भएको छ?", jp: "予想外の結果にのにを使っている文はどれか？" },
        choices: ["電話するのに5分かかります。", "お金があるのに使いません。", "走るのにいい靴が必要です。", "日本語を勉強するのに教材が要ります。"],
        correctIndex: 1,
        explanation: { en: "お金があるのに使いません = Has money but doesn't spend it — unexpected/contrary to expectation.", np: "お金があるのに使いません = पैसा छ भए पनि खर्च गर्दैन — अप्रत्याशित।", jp: "お金があるのに使わない＝持っているのに使わないという逆接・不満のに。" },
      },
      {
        question: { en: "Which uses のに for purpose?", np: "कुन वाक्यमा のに उद्देश्यका लागि प्रयोग भएको छ?", jp: "目的のにを使っている文はどれか？" },
        choices: ["毎日練習したのに上手くなりません。", "お金を使いすぎたのに後悔しました。", "このナイフは肉を切るのに使います。", "知っているのに教えてくれない。"],
        correctIndex: 2,
        explanation: { en: "このナイフは肉を切るのに使います = This knife is used for cutting meat — purpose のに.", np: "このナイフは肉を切るのに使います = यो चाकु मासु काट्नका लागि प्रयोग गर्छ — उद्देश्य のに।", jp: "このナイフは肉を切るのに使います＝目的・用途を表す目的のに。" },
      },
    ],
    listening: {
      scenario: { en: "A student complains about a disappointing outcome despite hard work, using 〜のに.", np: "एक विद्यार्थीले कडा परिश्रम भए पनि निराशाजनक परिणाममा गुनासो गर्छ।", jp: "努力したにもかかわらず残念な結果になった学生の不満を聞く場面。" },
      instruction: { en: "Identify every のに clause — decide if it expresses surprise/complaint or purpose.", np: "प्रत्येक のに खण्ड पहिचान गर्नुहोस् — आश्चर्य/गुनासो वा उद्देश्य व्यक्त गर्छ कि भन्ने निर्णय गर्नुहोस्।", jp: "のに節を全て特定し、逆接（不満・驚き）か目的かを判断してください。" },
      keyPhrases: ["〜のに（逆接）", "〜のに（目的）", "意外にも", "期待していたのに"],
      studyTip: { en: "Tip: contrastive のに often follows an emotion verb or implies a complaint. Purpose のに typically follows with 使う、要る、必要.", np: "टिप: विरोधाभासी のに प्राय: भावना क्रिया पछि आउँछ। उद्देश्य のに प्राय: 使う、要る、必要 पछि आउँछ।", jp: "逆接のには感情動詞や不満に続くことが多い。目的のには使う・要る・必要などと共起する。" },
    },
  }),

  // Day 4: 〜ために
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "田中", ja: "健康のために毎朝ジョギングしています。", reading: "Kenkō no tame ni maiasa jogingu shite imasu.", en: { en: "I jog every morning for the sake of my health.", np: "स्वास्थ्यका लागि हरेक बिहान जगिङ गर्छु।", jp: "健康のために毎朝ジョギングしています。" } },
      { speaker: "鈴木", ja: "いいですね。試験に合格するためにも勉強していますか。", reading: "Ii desu ne. Shiken ni gōkaku suru tame ni mo benkyō shite imasu ka.", en: { en: "That's great. Are you also studying in order to pass the exam?", np: "राम्रो छ। परीक्षा पास गर्नका लागि पनि पढ्दै हुनुहुन्छ?", jp: "それは素晴らしいですね。試験に合格するために勉強もしていますか？" } },
      { speaker: "田中", ja: "はい。大雨のために電車が止まってしまいました。", reading: "Hai. Ōame no tame ni densha ga tomatte shimaimashita.", en: { en: "Yes. The train stopped because of the heavy rain.", np: "हो। ठूलो वर्षाका कारण रेल रोकियो।", jp: "はい。大雨のために電車が止まってしまいました。" } },
      { speaker: "鈴木", ja: "それは大変でしたね。病気のために休んだ人もいましたか。", reading: "Sore wa taihen deshita ne. Byōki no tame ni yasunda hito mo imashita ka.", en: { en: "That must have been tough. Were there also people who took time off due to illness?", np: "कस्तो गाह्रो। बिरामीका कारण बिदा लिने मानिसहरू पनि थिए?", jp: "それは大変でしたね。病気のために休んだ方もいましたか？" } },
      { speaker: "田中", ja: "はい、いました。でも未来のために前進しなければなりません。", reading: "Hai, imashita. Demo mirai no tame ni zenshin shinakereba narimasen.", en: { en: "Yes, there were. But we must move forward for the future.", np: "हो, थिए। तर भविष्यका लागि अगाडि बढ्नैपर्छ।", jp: "はい、いましたよ。でも将来のために前進しなければなりません。" } },
    ],
    particles: [
      { particle: "〜ために (purpose)", note: { en: "N + の + ために or Vる + ために = for the purpose of, in order to: 健康のために / 合格するために.", np: "N + の + ために वा Vる + ために = उद्देश्यका लागि: 健康のために / 合格するために।", jp: "N＋の＋ために、またはVる＋ために＝目的：健康のために・合格するために。" } },
      { particle: "〜ために (cause/reason)", note: { en: "N + の + ために or V plain + ために = due to, because of (often negative result): 大雨のために電車が止まった.", np: "N + の + ために वा V सादा + ために = कारणले (प्राय: नकारात्मक): 大雨のために電車が止まった।", jp: "N＋の＋ために、またはV普通形＋ために＝原因（否定的結果が多い）：大雨のために電車が止まった。" } },
      { particle: "ために vs のに vs ように", note: { en: "ために = goal or cause; のに = utility/means or complaint; ように = manner/gradual intent.", np: "ために = लक्ष्य वा कारण; のに = उपयोगिता/उपाय वा गुनासो; ように = तरिका/क्रमिक इरादा।", jp: "ために＝目的・原因；のに＝手段・逆接；ように＝様子・漸進的意図。" } },
    ],
    grammarBullets: [
      { en: "Purpose ために: [Noun の / Vる-form] + ために + action. The subject of main clause and sub-clause usually differ or goal is external.", np: "उद्देश्य ために: [Noun の / Vる-form] + ために + कार्य। मुख्य र उप-खण्डका विषयहरू भिन्न हुन्छन् वा लक्ष्य बाह्य हुन्छ।", jp: "目的のために：[名詞の・Vる形]＋ために＋行動。主節と副節の主語が異なる場合や外的目標に多い。" },
      { en: "Cause ために: [Noun の / V plain] + ために. Results are often unavoidable or regretted: 事故のために遅れました.", np: "कारण ために: [Noun の / V सादा] + ために। परिणाम प्राय: अपरिहार्य वा पछुतोपूर्ण: 事故のために遅れました।", jp: "原因のために：[名詞の・V普通形]＋ために。結果は避けられない・残念なことが多い。" },
      { en: "Disambiguation: ために after a volitional verb + action = purpose; ために after a non-volitional event + unexpected result = cause.", np: "भिन्नता: ため after इच्छाशक्ति क्रिया + कार्य = उद्देश्य; ため after अनैच्छिक घटना + अप्रत्याशित = कारण।", jp: "区別：意志動詞＋行動→目的；非意志的出来事＋予期せぬ結果→原因。" },
    ],
    mcqs: [
      {
        question: { en: "Which sentence uses ために for purpose?", np: "कुन वाक्यमा ために उद्देश्यका लागि प्रयोग भएको छ?", jp: "ためにを目的に使っている文はどれか？" },
        choices: ["台風のために飛行機が欠航した。", "病気のために仕事を休んだ。", "日本語を上達させるために毎日練習する。", "大雪のために道路が閉鎖された。"],
        correctIndex: 2,
        explanation: { en: "日本語を上達させるために — volitional goal (purpose). The others use ために for cause (bad weather, illness).", np: "日本語を上達させるために — ऐच्छिक लक्ष्य (उद्देश्य)। बाँकीले ために कारणका लागि प्रयोग गर्छन्।", jp: "日本語を上達させるために＝意志的目標（目的）。他は自然災害・病気など原因。" },
      },
      {
        question: { en: "Which sentence uses ために for cause/reason?", np: "कुन वाक्यमा ために कारणका लागि प्रयोग भएको छ?", jp: "ためにを原因・理由に使っている文はどれか？" },
        choices: ["健康のために野菜を食べます。", "勉強するために図書館に行く。", "将来のために貯金します。", "事故のために電車が遅れました。"],
        correctIndex: 3,
        explanation: { en: "事故のために電車が遅れました — accident caused delay; this is the cause usage.", np: "事故のために電車が遅れました — दुर्घटनाले ढिलाइ गर्यो; कारण प्रयोग।", jp: "事故のために電車が遅れました＝事故という原因による遅延。" },
      },
    ],
    listening: {
      scenario: { en: "A person explains their daily routine with purpose-ために and another discusses disrupted plans due to cause-ために (bad weather).", np: "एक व्यक्ति उद्देश्य-ために सँग दैनिक दिनचर्या र कारण-ために (खराब मौसम) ले बाधित योजनाहरू बताउँछ।", jp: "目的のためにで日課を説明し、原因のために（悪天候）で計画中断を話す場面。" },
      instruction: { en: "Distinguish between purpose ために (goal-directed) and cause ために (uncontrollable event).", np: "उद्देश्य ために (लक्ष्य-निर्देशित) र कारण ために (अनियन्त्रित घटना) भिन्न गर्नुहोस्।", jp: "目的ために（意志的）と原因ために（非意志的出来事）を聞き分けてください。" },
      keyPhrases: ["〜するために", "〜のために（目的）", "〜のために（原因）", "〜せいで（原因）"],
      studyTip: { en: "Ask: 'Did someone choose this action?' If yes → purpose. 'Did an event cause this outcome?' If yes → cause.", np: "सोध्नुहोस्: 'कसैले यो कार्य रोजेको हो?' हो भने → उद्देश्य। 'घटनाले यो नतिजा निम्त्यायो?' हो भने → कारण।", jp: "「誰かがこの行動を選んだか？」→目的；「出来事がこの結果を引き起こしたか？」→原因。" },
    },
  }),

  // Day 5: 〜ように
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "先生", ja: "毎日少しずつ練習するようにしてください。", reading: "Mainichi sukoshi zutsu renshū suru yō ni shite kudasai.", en: { en: "Please make sure to practice a little every day.", np: "हरेक दिन थोरै-थोरै अभ्यास गर्ने गर्नुहोस्।", jp: "毎日少しずつ練習するようにしてください。" } },
      { speaker: "生徒", ja: "はい、先生。もっと上手になれるようにがんばります。", reading: "Hai, sensei. Motto jōzu ni nareru yō ni ganbarimasu.", en: { en: "Yes, teacher. I'll do my best so that I can become better.", np: "हो, गुरु। थप राम्रो हुन सकूँ भनेर मिहेनत गर्छु।", jp: "はい、先生。もっと上手になれるようにがんばります。" } },
      { speaker: "先生", ja: "聞こえるように大きな声で読んでください。", reading: "Kikoeru yō ni ōkina koe de yonde kudasai.", en: { en: "Please read in a loud voice so that it can be heard.", np: "सुनिने गरी ठूलो आवाजमा पढ्नुहोस्।", jp: "聞こえるように大きな声で読んでください。" } },
      { speaker: "生徒", ja: "わかりました。忘れないようにノートに書きます。", reading: "Wakarimashita. Wasurenai yō ni nōto ni kakimasu.", en: { en: "Understood. I'll write it in my notebook so as not to forget.", np: "बुझेँ। बिर्सने नगरौँ भनेर नोटबुकमा लेख्छु।", jp: "わかりました。忘れないようにノートに書きます。" } },
      { speaker: "先生", ja: "よかった。試験に合格できるようになるといいですね。", reading: "Yokatta. Shiken ni gōkaku dekiru yō ni naru to ii desu ne.", en: { en: "Good. It would be nice if you could come to be able to pass the exam.", np: "राम्रो। परीक्षा पास गर्न सक्ने भइयो भने हुन्थ्यो।", jp: "よかったです。試験に合格できるようになるといいですね。" } },
    ],
    particles: [
      { particle: "〜ように (purpose/goal)", note: { en: "Expresses purpose or goal, especially with potential/non-volitional verbs: 聞こえるように大きく話す = speak loudly so it can be heard.", np: "उद्देश्य वा लक्ष्य व्यक्त गर्छ, विशेषत: सम्भाव्य/अनैच्छिक क्रियाहरूसँग।", jp: "目的・目標を表す、特に可能・非意志動詞と共に：聞こえるように大きく話す。" } },
      { particle: "〜ようにする", note: { en: "Makes a conscious effort to do/not do: 毎日運動するようにしています = I make sure to exercise every day.", np: "सचेत प्रयास गर्छ/गर्दैन: 毎日運動するようにしています = म हरेक दिन व्यायाम गर्न कोसिस गर्छु।", jp: "意識的な努力：毎日運動するようにしています。" } },
      { particle: "〜ようになる", note: { en: "Expresses a change of state or acquired ability: 泳げるようになった = came to be able to swim.", np: "अवस्था परिवर्तन वा अर्जित क्षमता व्यक्त गर्छ: 泳げるようになった।", jp: "状態変化・能力の習得：泳げるようになった。" } },
    ],
    grammarBullets: [
      { en: "〜ように (purpose): Used when the subject of the main clause ≠ sub-clause, or with non-volitional/potential verbs. Contrast ために (volitional goal, same subject).", np: "〜ように (उद्देश्य): मुख्य र उप-खण्डका विषयहरू फरक हुँदा वा अनैच्छिक/सम्भाव्य क्रियाहरूसँग।", jp: "〜ように（目的）：主節と副節の主語が異なる場合、または非意志・可能動詞と共に。ために（意志的・同主語）と対比。" },
      { en: "〜ようにする: ongoing effort or policy. Often used in advice: もっと野菜を食べるようにしてください.", np: "〜ようにする: जारी प्रयास वा नीति। प्राय: सल्लाहमा: もっと野菜を食べるようにしてください।", jp: "ようにする：継続的努力・方針。アドバイスに多い：もっと野菜を食べるようにしてください。" },
      { en: "〜ようになる: marks the point of change — before, impossible/unlikely; now, possible/usual. Used with potential forms.", np: "〜ようになる: परिवर्तनको बिन्दु — पहिले, असम्भव; अहिले, सम्भव। सम्भाव्य रूपसँग।", jp: "ようになる：変化の転換点。以前は不可能・なかった→今は可能・習慣。可能形と共に多用。" },
    ],
    mcqs: [
      {
        question: { en: "Choose the correct ように sentence for purpose:", np: "उद्देश्यका लागि सही ように वाक्य छान्नुहोस्:", jp: "目的を表すようにの文として正しいのはどれか？" },
        choices: ["試験に合格するように勉強します。（ために more natural）", "聞こえるように大きく話してください。", "行くようにしています。（habit, not purpose）", "上手になるようにです。（incomplete）"],
        correctIndex: 1,
        explanation: { en: "聞こえるように — potential verb (聞こえる) + ように = purpose form with non-volitional verb.", np: "聞こえるように — सम्भाव्य क्रिया + ように = अनैच्छिक क्रियासँग उद्देश्य रूप।", jp: "聞こえるように＝可能動詞＋ようにで非意志的目的を表す正しい形。" },
      },
      {
        question: { en: "Which best expresses an acquired change of ability?", np: "अर्जित क्षमता परिवर्तन कुन वाक्यले राम्रोसँग व्यक्त गर्छ?", jp: "能力の変化（習得）を表す文はどれか？" },
        choices: ["泳ぐようにします。", "泳げるようになりました。", "泳ぐようです。", "泳がないようにしています。"],
        correctIndex: 1,
        explanation: { en: "泳げるようになりました = came to be able to swim — ようになる marks acquired ability.", np: "泳げるようになりました = पौडी खेल्न सक्ने भएँ — ようになる अर्जित क्षमता।", jp: "泳げるようになりました＝ようになる：能力習得の変化点。" },
      },
    ],
    listening: {
      scenario: { en: "A teacher gives instructions using 〜ようにしてください and students respond with 〜ようになります promises.", np: "एक शिक्षकले 〜ようにしてください प्रयोग गरेर निर्देशन दिन्छन् र विद्यार्थीहरूले 〜ようになります वाचा गर्छन्।", jp: "先生がようにしてくださいで指示し、学生がようになりますと応える場面。" },
      instruction: { en: "Note: (1) ようにする = conscious effort, (2) ようになる = change result, (3) ように alone = purpose/goal.", np: "ध्यान दिनुहोस्: (1) ようにする = सचेत प्रयास, (2) ようになる = परिवर्तन परिणाम, (3) ように एक्लै = उद्देश्य।", jp: "(1)ようにする＝意識的努力、(2)ようになる＝変化結果、(3)ように単独＝目的。" },
      keyPhrases: ["〜ようにしてください", "〜ようになりました", "〜ないように", "〜ように（目的）"],
      studyTip: { en: "Practice by converting ために sentences into ように equivalents and noting where they differ.", np: "ために वाक्यहरूलाई ように समकक्षमा रूपान्तरण गरेर फरक नोट गर्ने अभ्यास गर्नुहोस्।", jp: "ために文をようにに変換し、違いを確認する練習が効果的。" },
    },
  }),

  // Day 6: Four conditionals compared
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "Aさん", ja: "春になると桜が咲きますね。", reading: "Haru ni naru to sakura ga sakimasu ne.", en: { en: "When spring comes, the cherry blossoms bloom, don't they.", np: "वसन्त आउँदा चेरी फुल फुल्छ नि।", jp: "春になると桜が咲きますね。" } },
      { speaker: "Bさん", ja: "ええ。もし時間があれば、一緒に見に行きませんか。", reading: "Ee. Moshi jikan ga areba, issho ni mi ni ikimasen ka.", en: { en: "Yes. If you have time, wouldn't you like to go see them together?", np: "हो। यदि समय भएमा, सँगै हेर्न जाने हैन र?", jp: "ええ。もし時間があれば、一緒に見に行きませんか？" } },
      { speaker: "Aさん", ja: "行けたら行きたいですが、来週は忙しいかもしれません。", reading: "Iketa ra ikitai desu ga, raishū wa isogashii kamo shiremasen.", en: { en: "I'd like to go if I can, but I might be busy next week.", np: "जान सकेको भए जान चाहन्थेँ, तर अर्को हप्ता व्यस्त हुन सक्छु।", jp: "行けたら行きたいですが、来週は忙しいかもしれません。" } },
      { speaker: "Bさん", ja: "週末なら、もう少し空いているんじゃないですか。", reading: "Shūmatsu nara, mō sukoshi aite iru n ja nai desu ka.", en: { en: "If it's the weekend, you might be a bit freer, right?", np: "सप्ताहन्तमा भए, अलिकति खाली हुन सक्ला नि?", jp: "週末なら、もう少し余裕があるんじゃないですか。" } },
      { speaker: "Aさん", ja: "そうですね、週末ならいいかもしれません。", reading: "Sō desu ne, shūmatsu nara ii kamo shiremasen.", en: { en: "You're right, if it's the weekend, it might be fine.", np: "हो नि, सप्ताहन्त भएको खण्डमा राम्रो हुन सक्छ।", jp: "そうですね、週末ならいいかもしれません。" } },
    ],
    particles: [
      { particle: "〜と (conditional)", note: { en: "Natural consequence / invariable result: 春になると桜が咲く. Cannot be used for requests, advice, or speaker's will.", np: "स्वाभाविक परिणाम / अपरिवर्तनीय: 春になると桜が咲く। अनुरोध, सल्लाह वा इच्छाका लागि प्रयोग गर्न सकिन्न।", jp: "自然な結果・必然的帰結：春になると桜が咲く。依頼・忠告・話し手の意志には使えない。" } },
      { particle: "〜ば (conditional)", note: { en: "General / reversible condition: もし時間があれば. Often used with ～いい, ～よかった. Adj: 高ければ / Vば: 食べれば.", np: "सामान्य / उल्टाउन मिल्ने सर्त। प्राय: 〜いい, 〜よかった सँग। Adj: 高ければ / Vば: 食べれば।", jp: "一般的・可逆条件。〜いい・よかったと共に多用。形容詞は高ければ、動詞は食べれば。" } },
      { particle: "〜たら (conditional)", note: { en: "Sequential: if/when something happens first, then another happens: 帰ったら電話してください. More concrete/temporal.", np: "क्रमिक: पहिले केही भएपछि अर्को: 帰ったら電話してください। थप ठोस/कालिक।", jp: "順次的：帰ったら電話してください。時間的前後関係が明確。" } },
    ],
    grammarBullets: [
      { en: "〜なら: topic-based conditional — 'if it's the case of X, then…': 週末なら大丈夫. Often a response to something just said.", np: "〜なら: विषय-आधारित सर्त — 'यदि X को कुरा हो भने...': 週末なら大丈夫। प्राय: भर्खर भनिएको कुराको प्रतिक्रिया।", jp: "〜なら：話題提示型条件「Xの話なら〜」。週末なら大丈夫。直前の発話に対する応答に多用。" },
      { en: "Summary: と=automatic; ば=general; たら=sequential/time; なら=topic/comment on stated premise.", np: "सारांश: と=स्वचालित; ば=सामान्य; たら=क्रमिक/कालिक; なら=विषय/भनिएको आधारमा टिप्पणी।", jp: "まとめ：と＝自動的；ば＝一般的；たら＝順次・時間；なら＝話題提示・前提への応答。" },
      { en: "Restrictions: と cannot precede requests/commands/offers; ば cannot easily express speaker's decisions about specific future events.", np: "प्रतिबन्ध: と ले अनुरोध/आदेश/प्रस्ताव अगाडि आउन सक्दैन; ば ले भविष्यका विशिष्ट घटनाबारे वक्ताको निर्णय सजिलैसँग व्यक्त गर्न सक्दैन।", jp: "制限：と＝依頼・命令・申し出の前置きに使えない；ば＝特定未来の話し手の決断には使いにくい。" },
    ],
    grammarTable: {
      caption: { en: "Four Japanese Conditionals", np: "चार जापानी सर्त रूपहरू", jp: "日本語の4つの条件形" },
      headers: [{ en: "Form", np: "रूप", jp: "形" }, { en: "Use", np: "प्रयोग", jp: "用法" }, { en: "Example", np: "उदाहरण", jp: "例" }],
      rows: [
        ["〜と", { en: "automatic / invariable", np: "स्वचालित", jp: "自動的・必然" }, "春になると暖かい"],
        ["〜ば", { en: "general / reversible", np: "सामान्य", jp: "一般的・可逆" }, "早く起きれば間に合う"],
        ["〜たら", { en: "sequential / temporal", np: "क्रमिक", jp: "順次・時間的" }, "着いたら連絡して"],
        ["〜なら", { en: "topic / premise comment", np: "विषय / आधार टिप्पणी", jp: "話題提示" }, "週末なら暇だよ"],
      ],
    },
    mcqs: [
      {
        question: { en: "Which conditional is WRONG for a request?", np: "अनुरोधका लागि कुन सर्त गलत छ?", jp: "依頼に使えないのはどれか？" },
        choices: ["〜たら (帰ったら電話して)", "〜ば (暇なら来てください)", "〜なら (東京に行くなら案内する)", "〜と (暑くなると泳ぎに行って)"],
        correctIndex: 3,
        explanation: { en: "〜と cannot precede requests or commands — this is its key restriction.", np: "〜と ले अनुरोध वा आदेश अगाडि आउन सक्दैन — यो यसको मुख्य प्रतिबन्ध हो।", jp: "〜とは依頼・命令の前に使えない。これが最大の制限。" },
      },
      {
        question: { en: "Which conditional best fits: 'If you're going to Tokyo, I'll give you directions'?", np: "'तपाईं टोकियो जाँदै हुनुहुन्छ भने, बाटो देखाउँछु' भन्नका लागि कुन सर्त उपयुक्त छ?", jp: "「東京に行くなら案内します」に最も合う条件形はどれか？" },
        choices: ["〜と", "〜ば", "〜たら", "〜なら"],
        correctIndex: 3,
        explanation: { en: "〜なら = given the premise you mentioned (going to Tokyo), I'll do X. Topic-based conditional.", np: "〜なら = तपाईंले भन्नुभएको आधारमा (टोकियो जाँदै), म X गर्छु। विषय-आधारित सर्त।", jp: "〜なら＝あなたが言った前提（東京行き）に基づく応答。話題提示型条件。" },
      },
    ],
    listening: {
      scenario: { en: "Two friends plan an outing, naturally switching between と/ば/たら/なら conditionals as the conversation flows.", np: "दुई साथीहरू बाहिर निस्कने योजना बनाउँछन्, स्वाभाविक रूपमा と/ば/たら/なら सर्तहरू बीच स्विच गर्दै।", jp: "友人が外出計画を立てながら、と・ば・たら・ならをスムーズに使い分ける場面。" },
      instruction: { en: "Tag each conditional you hear with: A=と, B=ば, C=たら, D=なら. Count how many of each type appear.", np: "प्रत्येक सर्त सुनेर ट्याग गर्नुहोस्: A=と, B=ば, C=たら, D=なら। प्रत्येक प्रकार कति आउँछ गन्नुहोस्।", jp: "聞こえた条件形をA＝と、B＝ば、C＝たら、D＝ならとタグ付けし、各タイプの出現数を数える。" },
      keyPhrases: ["〜と（自動）", "〜ば（一般）", "〜たら（順次）", "〜なら（話題）"],
      studyTip: { en: "Make a 'minimal pair' card: same sentence with all four forms — check which feel natural and which are ungrammatical.", np: "'न्यूनतम जोडी' कार्ड बनाउनुहोस्: सबै चार रूपसँग एउटै वाक्य — कुन स्वाभाविक र कुन अव्याकरणिक छ जाँच गर्नुहोस्।", jp: "同じ文に4形式を当てはめる「最小ペア」カードで、自然・不自然を確認すると定着する。" },
    },
  }),

  // Day 7: はずだ / べきだ
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "山本", ja: "田中さんはもう来ているはずですよ。メールで確認しましたから。", reading: "Tanaka-san wa mō kite iru hazu desu yo. Mēru de kakunin shimashita kara.", en: { en: "Tanaka-san should already be here. I confirmed by email.", np: "तानाका जी आइसक्नु भएको हुनुपर्छ। इमेलबाट पुष्टि गरेको थिएँ।", jp: "田中さんはもう来ているはずですよ。メールで確認しましたから。" } },
      { speaker: "佐藤", ja: "あれ、いないですね。約束を守るべきですよね。", reading: "Are, inai desu ne. Yakusoku o mamoru beki desu yo ne.", en: { en: "Hmm, they're not here. They should keep their promises, right?", np: "हम्म, छैनन् नि। वाचा पालन गर्नु पर्छ नि।", jp: "あれ、いないですね。約束は守るべきですよね。" } },
      { speaker: "山本", ja: "電車が遅れているはずです。最近よく遅れていますから。", reading: "Densha ga okurete iru hazu desu. Saikin yoku okurete imasu kara.", en: { en: "The train must be running late. It's been running late a lot recently.", np: "रेल ढिला भएको हुनुपर्छ। हालसालै धेरैपटक ढिलाइ हुँदैछ।", jp: "電車が遅れているはずです。最近よく遅れていますから。" } },
      { speaker: "佐藤", ja: "でも急いで来るべきでしたね。大事な会議ですから。", reading: "Demo isoide kuru beki deshita ne. Daiji na kaigi desu kara.", en: { en: "But they should have hurried to come. It's an important meeting.", np: "तर हतार गरेर आउनु पर्थ्यो नि। महत्त्वपूर्ण बैठक हो।", jp: "でも急いで来るべきでしたね。大事な会議ですから。" } },
      { speaker: "山本", ja: "そうですね。しばらく待つべきでしょう。", reading: "Sō desu ne. Shibaraku matsu beki deshō.", en: { en: "You're right. We should probably wait a while.", np: "हो नि। अलिकति पर्खनु पर्छ होला।", jp: "そうですね。しばらく待つべきでしょう。" } },
    ],
    particles: [
      { particle: "〜はずだ", note: { en: "Logical expectation based on evidence or reasoning: 来ているはずだ = should be here (I have good reason to think so).", np: "प्रमाण वा तर्कमा आधारित तार्किक अपेक्षा: 来ているはずだ = यहाँ हुनुपर्छ।", jp: "根拠に基づく論理的期待：来ているはずだ＝そう考えるだけの根拠がある。" } },
      { particle: "〜べきだ", note: { en: "Moral obligation / strong advice: 約束を守るべきだ = one should keep promises. Stronger than 〜ほうがいい.", np: "नैतिक दायित्व / कडा सल्लाह: 約束を守るべきだ = वाचा पालन गर्नु पर्छ। 〜ほうがいい भन्दा कडा।", jp: "道義的義務・強い忠告：約束を守るべきだ。〜ほうがいいより強い。" } },
      { particle: "はずがない", note: { en: "Logical impossibility: そんなことがあるはずがない = that can't possibly be true (no logical basis for it).", np: "तार्किक असम्भवता: そんなことがあるはずがない = त्यस्तो हुन सक्दैन।", jp: "論理的不可能性：そんなことがあるはずがない＝あり得ない（根拠から否定）。" } },
    ],
    grammarBullets: [
      { en: "〜はずだ: speaker's confident belief based on available evidence. Pattern: Plain form + はずだ. For negative expectation: はずがない.", np: "〜はずだ: उपलब्ध प्रमाणमा आधारित वक्ताको आत्मविश्वासपूर्ण विश्वास। ढाँचा: सादा रूप + はずだ।", jp: "はずだ：根拠に基づく話し手の確信。普通形＋はずだ。否定はずがない。" },
      { en: "〜べきだ: strong moral obligation. べきではない = should not. べきだった = should have (past regret).", np: "〜べきだ: कडा नैतिक दायित्व। べきではない = गर्नु हुँदैन। べきだった = गर्नु पर्थ्यो (भूत पछुतो)।", jp: "べきだ：強い道義的義務。べきではない＝すべきでない。べきだった＝すべきだった（後悔）。" },
      { en: "Compared: はずだ = expectation/logical deduction; べきだ = obligation/moral judgment. They describe different relationships to the proposition.", np: "तुलना: はずだ = अपेक्षा/तार्किक निष्कर्ष; べきだ = दायित्व/नैतिक निर्णय।", jp: "比較：はずだ＝期待・論理的推論；べきだ＝義務・道徳的判断。命題との関係が異なる。" },
    ],
    mcqs: [
      {
        question: { en: "Which sentence uses はずだ correctly?", np: "कुन वाक्यमा はずだ सही प्रयोग भएको छ?", jp: "はずだを正しく使っている文はどれか？" },
        choices: ["毎日練習するはずだ。（obligation nuance stronger）", "彼は今日来るはずです。（logical expectation from evidence）", "来るべきはずです。（redundant）", "行くはずがあります。（unnatural）"],
        correctIndex: 1,
        explanation: { en: "彼は今日来るはずです = He should come today (based on prior arrangement/evidence). Correct はずだ usage.", np: "彼は今日来るはずです = उनी आज आउनुपर्छ (पूर्व व्यवस्था/प्रमाणमा आधारित)।", jp: "彼は今日来るはずです＝根拠に基づく論理的期待。はずだの正しい使い方。" },
      },
      {
        question: { en: "Which sentence best expresses moral obligation with べきだ?", np: "कुन वाक्यले べきだ सँग नैतिक दायित्व राम्रोसँग व्यक्त गर्छ?", jp: "べきだで道義的義務を最もよく表す文はどれか？" },
        choices: ["約束を守るはずです。", "約束を守るべきです。", "約束を守るようです。", "約束を守ってしまいました。"],
        correctIndex: 1,
        explanation: { en: "約束を守るべきです = One should keep promises — べきだ expresses moral obligation/strong advice.", np: "約束を守るべきです = वाचा पालन गर्नु पर्छ — べきだ ले नैतिक दायित्व व्यक्त गर्छ।", jp: "約束を守るべきです＝べきだ：道義的義務・強い忠告。" },
      },
    ],
    listening: {
      scenario: { en: "A manager discusses a team member's lateness, using はずだ for expectations and べきだ for obligations.", np: "एक प्रबन्धकले टोली सदस्यको ढिलाइबारे छलफल गर्छन्, अपेक्षाका लागि はずだ र दायित्वका लागि べきだ प्रयोग गर्दै।", jp: "管理職がチームメンバーの遅刻を話し合う場面。はずだで期待、べきだで義務を使う。" },
      instruction: { en: "Track: every はずだ = expectation (E), every べきだ = obligation (O). Is the tone critical or understanding?", np: "ट्र्याक गर्नुहोस्: प्रत्येक はずだ = अपेक्षा (E), प्रत्येक べきだ = दायित्व (O)। स्वर आलोचनात्मक वा समझदार छ?", jp: "はずだ＝期待（E）、べきだ＝義務（O）とタグ付け。トーンは批判的か理解的か判断。" },
      keyPhrases: ["〜はずです", "〜べきです", "〜べきでした", "〜はずがない"],
      studyTip: { en: "Create sentence pairs: same fact expressed with はずだ (evidence-based) and べきだ (duty-based) — feel the difference.", np: "वाक्य जोडी बनाउनुहोस्: एउटै तथ्य はずだ (प्रमाण-आधारित) र べきだ (कर्तव्य-आधारित) सँग — भिन्नता महसुस गर्नुहोस्।", jp: "同じ事実をはずだ（根拠ベース）とべきだ（義務ベース）で言い表す練習で違いが実感できる。" },
    },
  }),
];
