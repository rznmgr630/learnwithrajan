import type { N5LessonSpec } from "@/lib/japanese-learning/n5/build-japanese-detail";
import { mkN3Lesson as mk } from "@/lib/japanese-learning/n3/n3-lesson-factory";

/** Days 8–14 — Week 2 N3 grammar */
export const JP_N3_PART2: N5LessonSpec[] = [
  // Day 8: そうだ vs らしい vs ようだ
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "田中", ja: "空が暗くなってきましたね。雨が降りそうですよ。", reading: "Sora ga kuraku natte kimashita ne. Ame ga furiso desu yo.", en: { en: "The sky is getting dark. It looks like it's going to rain.", np: "आकाश अँध्यारो हुन थालेको छ। पानी पर्ने जस्तो छ।", jp: "空が暗くなってきましたね。雨が降りそうですよ。" } },
      { speaker: "鈴木", ja: "ニュースでは明日も雨が降るそうですよ。", reading: "Nyūsu de wa ashita mo ame ga furu sō desu yo.", en: { en: "I heard on the news that it will also rain tomorrow.", np: "समाचारमा भोलि पनि पानी पर्छ भन्छ।", jp: "ニュースでは明日も雨が降るそうですよ。" } },
      { speaker: "田中", ja: "そうですか。風が強いので、台風が来るらしいですね。", reading: "Sō desu ka. Kaze ga tsuyoi node, taifū ga kuru rashii desu ne.", en: { en: "Is that so? The wind is strong, so apparently a typhoon is coming.", np: "त्यसो हो? हावा बलियो छ, त्यसैले टाइफुन आउँछ रे।", jp: "そうですか。風が強いので、台風が来るらしいですね。" } },
      { speaker: "鈴木", ja: "はい、このようす見ると台風のようですね。", reading: "Hai, kono yōsu o miru to taifū no yō desu ne.", en: { en: "Yes, looking at this situation, it does seem like a typhoon.", np: "हो, यो अवस्था हेर्दा टाइफुन जस्तो लाग्छ।", jp: "はい、このようすを見ると台風のようですね。" } },
      { speaker: "田中", ja: "傘を持っていったほうがよさそうですね。", reading: "Kasa o motte itta hō ga yosasō desu ne.", en: { en: "It seems like it would be better to take an umbrella.", np: "छाता लिएर जाने नै राम्रो जस्तो छ।", jp: "傘を持っていったほうがよさそうですね。" } },
    ],
    particles: [
      { particle: "〜そうだ (appearance)", note: { en: "Speaker's direct visual/sensory impression: 雨が降りそう = looks like it will rain (I see dark clouds). Verb stem + そう; Adj stem + そう.", np: "वक्ताको प्रत्यक्ष दृश्य/इन्द्रिय छाप: 雨が降りそう = पानी पर्ने जस्तो (कालो बादल देख्छु)।", jp: "話し手の直接的な視覚・感覚的印象：雨が降りそう（暗い雲を見て）。動詞語幹＋そう。" } },
      { particle: "〜そうだ (hearsay)", note: { en: "Reports information heard from another source: 明日雨が降るそうだ = I heard it will rain tomorrow (from news/someone).", np: "अर्को स्रोतबाट सुनिएको जानकारी रिपोर्ट गर्छ: 明日雨が降るそうだ = भोलि पानी पर्छ रे।", jp: "伝聞：別の情報源から聞いた情報を伝える。明日雨が降るそうだ（ニュース等で聞いた）。" } },
      { particle: "〜らしい vs 〜ようだ", note: { en: "らしい = indirect evidence/hearsay; ようだ = speaker's observation/inference. らしい can express typicality too.", np: "らしい = अप्रत्यक्ष प्रमाण/भनाइ; ようだ = वक्ताको अवलोकन/अनुमान।", jp: "らしい＝間接的根拠・伝聞；ようだ＝話し手の観察・推論。らしいは典型性も表せる。" } },
    ],
    grammarBullets: [
      {
        en: "〜そうだ (appearance): verb stem / i-adj stem / na-adj stem + そう(だ). Direct perception. Cannot be used with 知らない, よい (irregular: よさそう).",
        np: "〜そうだ (दृश्य): क्रिया स्टेम / i-adj स्टेम / na-adj स्टेम + そう। प्रत्यक्ष अनुभूति।",
        jp: "見た目のそう：動詞語幹・形容詞語幹＋そう。直接知覚。知らない・よい（よさそう）は不規則。",
      },
      { en: "〜そうだ (hearsay): plain form + そうだ. Reports what speaker heard from external source.", np: "〜そうだ (भनाइ): सादा रूप + そうだ। वक्ताले बाहिरी स्रोतबाट सुनेको कुरा।", jp: "伝聞のそうだ：普通形＋そうだ。外部情報源から聞いたことを伝える。" },
      { en: "〜らしい: inference from indirect clues, or hearsay; also expresses what is typical: 子どもらしい = child-like. 〜ようだ: speaker's direct inference from observable evidence.", np: "〜らしい: अप्रत्यक्ष सुराकबाट अनुमान, वा भनाइ; विशिष्टता: 子どもらしい। 〜ようだ: वक्ताको प्रत्यक्ष अनुमान।", jp: "らしい：間接的な手がかりからの推測・伝聞。典型性も（子どもらしい）。ようだ：観察可能な証拠からの話し手の直接的推論。" },
    ],
    mcqs: [
      {
        question: { en: "Which sentence uses appearance-そうだ correctly?", np: "कुन वाक्यमा दृश्य-そうだ सही प्रयोग भएको छ?", jp: "見た目のそうだを正しく使っている文はどれか？" },
        choices: ["明日雨が降るそうです。（hearsay）", "このケーキはおいしそうです。", "台風が来るらしいです。（indirect）", "彼は元気なようです。（inference）"],
        correctIndex: 1,
        explanation: { en: "おいしそう = looks delicious — direct visual impression of the cake. Correct appearance-そう.", np: "おいしそう = स्वादिष्ट देखिन्छ — केकको प्रत्यक्ष दृश्य छाप।", jp: "おいしそう＝ケーキを見た直接的印象。見た目のそうの正しい使い方。" },
      },
      {
        question: { en: "Which correctly reports hearsay?", np: "कुन वाक्यले भनाइलाई सही रिपोर्ट गर्छ?", jp: "伝聞を正しく表している文はどれか？" },
        choices: ["雨が降りそうです。", "空が暗くなったようです。", "先生が明日休むそうです。", "この料理はおいしいらしいです。（indirect evidence, not hearsay strictly）"],
        correctIndex: 2,
        explanation: { en: "先生が明日休むそうです — plain form (休む) + そうだ = hearsay, reporting information heard from someone.", np: "先生が明日休むそうです — सादा रूप + そうだ = भनाइ, कसैबाट सुनिएको जानकारी।", jp: "先生が明日休むそうです＝普通形＋そうだ：伝聞。誰かから聞いた情報の報告。" },
      },
    ],
    listening: {
      scenario: { en: "Weather report and conversation mixing appearance-そう (直接), hearsay-そう, らしい, and ようだ.", np: "मौसम रिपोर्ट र कुराकानीमा दृश्य-そう, भनाइ-そう, らしい र ようだ मिश्रण।", jp: "天気予報と会話で、見た目のそう・伝聞そう・らしい・ようだが混在する場面。" },
      instruction: { en: "Each time you hear a conjecture marker, classify it: VS=visual-そう, HS=hearsay-そう, R=らしい, Y=ようだ.", np: "हरेकपटक अनुमान चिन्ह सुन्दा वर्गीकृत गर्नुहोस्: VS=दृश्य-そう, HS=भनाइ-そう, R=らしい, Y=ようだ।", jp: "推測マーカーを聞くたびにVS・HS・R・Yに分類する。" },
      keyPhrases: ["〜そうです（見た目）", "〜そうです（伝聞）", "〜らしいです", "〜ようです"],
      studyTip: { en: "Key test: Can you replace it with 'it looks like' (appearance) or 'I heard that' (hearsay)? This disambiguates the two そうだ.", np: "मुख्य परीक्षण: 'जस्तो देखिन्छ' (दृश्य) वा 'मैले सुनेँ' (भनाइ) ले प्रतिस्थापन गर्न सकिन्छ? यसले दुई そうだ छुट्याउँछ।", jp: "「見た感じ」で置き換えられるか（見た目）、「聞いた話では」で置き換えられるか（伝聞）で2つのそうを判別できる。" },
    },
  }),

  // Day 9: と思う / と言う / と聞く
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "中村", ja: "田中さんは明日来ないと思います。", reading: "Tanaka-san wa ashita konai to omoimasu.", en: { en: "I think Tanaka-san won't come tomorrow.", np: "तानाका जी भोलि आउनुहुन्न भन्ने सोच्छु।", jp: "田中さんは明日来ないと思います。" } },
      { speaker: "高橋", ja: "彼は「明日は用事がある」と言っていましたよ。", reading: "Kare wa 'ashita wa yōji ga aru' to itte imashita yo.", en: { en: "He said 'I have something to do tomorrow'.", np: "उनले 'भोलि काम छ' भन्नुभएको थियो।", jp: "彼は「明日は用事がある」と言っていましたよ。" } },
      { speaker: "中村", ja: "田中さんが仕事を辞めると聞きましたが、本当ですか。", reading: "Tanaka-san ga shigoto o yameru to kikimashita ga, hontō desu ka.", en: { en: "I heard that Tanaka-san is going to quit work, is that true?", np: "तानाका जी काम छोड्दै हुनुहुन्छ भनेर सुनेँ, साँचो हो?", jp: "田中さんが仕事を辞めると聞きましたが、本当ですか？" } },
      { speaker: "高橋", ja: "そうらしいですね。転職すると決めたと言っていました。", reading: "Sō rashii desu ne. Tenshoku suru to kimeta to itte imashita.", en: { en: "Apparently so. He said he decided to change jobs.", np: "त्यस्तो रे। नोकरी परिवर्तन गर्ने निर्णय गरेको भन्नुभएको थियो।", jp: "そうらしいですね。転職すると決めたと言っていました。" } },
      { speaker: "中村", ja: "いつ辞めるかと聞きましたが、まだ分からないと言っていました。", reading: "Itsu yameru ka to kikimashita ga, mada wakaranai to itte imashita.", en: { en: "I asked when he'd quit, but he said he doesn't know yet.", np: "कहिले छोड्छौ भनेर सोधेँ, तर अझ थाहा छैन भन्नुभयो।", jp: "いつ辞めるかと聞きましたが、まだ分からないと言っていました。" } },
    ],
    particles: [
      { particle: "〜と思う", note: { en: "Expresses speaker's opinion or belief: 彼は来ないと思う. For others' ongoing thoughts use: 〜と思っている.", np: "वक्ताको मत वा विश्वास व्यक्त गर्छ: 彼は来ないと思う। अरूको जारी विचारका लागि: 〜と思っている।", jp: "話し手の意見・考え：彼は来ないと思う。他者の継続的な考えはと思っている。" } },
      { particle: "〜と言う / と言っている", note: { en: "Quotes what someone said: 彼は「来る」と言った. For ongoing/reported speech: 来ると言っている.", np: "कसैले भनेको कुरा उद्धृत गर्छ। जारी/रिपोर्ट गरिएको भाषणका लागि: と言っている।", jp: "発言の引用。継続的・報告的な発話にはと言っている。" } },
      { particle: "〜と聞く / と聞いた", note: { en: "Reports what speaker heard: 辞めると聞いた = I heard that he'll quit. Indirect question: いつ辞めるかと聞いた.", np: "वक्ताले सुनेको कुरा रिपोर्ट गर्छ। अप्रत्यक्ष प्रश्न: いつ辞めるかと聞いた।", jp: "聞いた内容の報告：辞めると聞いた。間接疑問文：いつ辞めるかと聞いた。" } },
    ],
    grammarBullets: [
      { en: "Quoted speech uses plain form before と: 彼は「来る」と言った / 来ないと思う. The と is a quoting particle, not conditional.", np: "उद्धृत भाषणले と अगाडि सादा रूप प्रयोग गर्छ। यो と उद्धरण कण हो, सर्त होइन।", jp: "引用の普通形＋と：彼は「来る」と言った。このとは条件形ではなく引用の助詞。" },
      { en: "Indirect questions embed yes/no or wh-questions: 来るかどうかと聞いた (yes/no); どこに行くかと聞いた (wh-question).", np: "अप्रत्यक्ष प्रश्नहरूले हो/होइन वा wh-प्रश्नहरू समेट्छन्।", jp: "間接疑問文：来るかどうかと聞いた（yes/no）；どこに行くかと聞いた（wh疑問）。" },
      { en: "〜と思っている (continuous): expresses someone else's ongoing belief. 〜と思う is for speaker's opinion right now.", np: "〜と思っている (निरन्तर): अरूको जारी विश्वास। 〜と思う वक्ताको अहिलेको मत।", jp: "と思っている（継続）：他者の継続的な考えを表す。と思うは話し手の現在の意見。" },
    ],
    mcqs: [
      {
        question: { en: "How do you report 'She said she was tired'?", np: "'उनले थकित भएँ भन्नुभयो' कसरी रिपोर्ट गर्छन्?", jp: "「彼女は疲れたと言いました」を正しく言うのはどれか？" },
        choices: ["彼女は「疲れた」と言いました。", "彼女は疲れたと言います。（present）", "彼女が疲れると言いました。（will be tired）", "彼女は疲れると思いました。（I thought）"],
        correctIndex: 0,
        explanation: { en: "彼女は「疲れた」と言いました — direct/indirect quote with 言う in past tense.", np: "彼女は「疲れた」と言いました — 言う भूतकालमा प्रत्यक्ष/अप्रत्यक्ष उद्धरण।", jp: "彼女は「疲れた」と言いました＝言うの過去形で発言を引用。" },
      },
      {
        question: { en: "How do you say 'I heard he is going to Tokyo'?", np: "'उनी टोकियो जाँदै हुनुहुन्छ भनेर सुनेँ' कसरी भन्छन्?", jp: "「彼が東京に行くと聞きました」として正しいのはどれか？" },
        choices: ["彼が東京に行くと聞きました。", "彼が東京に行くと思いました。", "彼が東京に行ったと言いました。（past, went）", "彼が東京に行くかと言いました。（awkward）"],
        correctIndex: 0,
        explanation: { en: "〜と聞きました = I heard that〜. The plain form 行く before と is correct for current/future action.", np: "〜と聞きました = मैले सुनेँ कि〜। と अगाडि सादा रूप 行く वर्तमान/भविष्यका लागि सही।", jp: "と聞きました＝〜と聞いた。行く（現在・未来）＋と聞きました。" },
      },
    ],
    listening: {
      scenario: { en: "Office gossip: people report what someone said, heard, or thinks using the three quoting patterns.", np: "अफिस गप: मानिसहरूले कसैले के भन्यो, के सुन्यो वा के सोच्छ रिपोर्ट गर्छन्।", jp: "職場の会話：誰かの発言・聞いた話・考えを三つの引用パターンで報告する場面。" },
      instruction: { en: "Identify the quoting verb (思う/言う/聞く) and the embedded content — write a summary in English.", np: "उद्धरण क्रिया (思う/言う/聞く) र समाविष्ट सामग्री पहिचान गर्नुहोस्।", jp: "引用動詞（思う・言う・聞く）と埋め込み内容を特定し、英語で要約を書く。" },
      keyPhrases: ["〜と思います", "〜と言っていました", "〜と聞きました", "〜かどうか聞いた"],
      studyTip: { en: "Practice converting direct speech into indirect speech: 「来る」と言った → 来ると言った. Crucial JLPT N3 skill.", np: "प्रत्यक्ष भाषणलाई अप्रत्यक्ष भाषणमा रूपान्तरण: 「来る」と言った → 来ると言った। महत्त्वपूर्ण JLPT N3 सीप।", jp: "直接話法を間接話法に変換：「来る」と言った→来ると言った。JLPT N3必須スキル。" },
    },
  }),

  // Day 10: 〜ながら
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "田中", ja: "音楽を聴きながら勉強しています。", reading: "Ongaku o kikinagara benkyō shite imasu.", en: { en: "I study while listening to music.", np: "सङ्गीत सुन्दैगर्दा पढ्छु।", jp: "音楽を聴きながら勉強しています。" } },
      { speaker: "鈴木", ja: "集中できますか。私は歩きながら考えることが好きです。", reading: "Shūchū dekimasu ka. Watashi wa arukinagara kangaeru koto ga suki desu.", en: { en: "Can you concentrate? I like thinking while walking.", np: "ध्यान केन्द्रित गर्न सकिन्छ? मलाई हिँड्दाहिँड्दै सोच्न मन लाग्छ।", jp: "集中できますか？私は歩きながら考えるのが好きです。" } },
      { speaker: "田中", ja: "はい、テレビを見ながらご飯を食べるのが日課です。", reading: "Hai, terebi o minagara gohan o taberu no ga nikka desu.", en: { en: "Yes, eating while watching TV is my daily routine.", np: "हो, टेलिभिजन हेर्दैगर्दा खाना खाने मेरो दैनिक बानी हो।", jp: "はい、テレビを見ながらご飯を食べるのが日課です。" } },
      { speaker: "鈴木", ja: "ながらスマホは危ないですよ。歩きながらスマホを見ないようにしています。", reading: "Nagara sumaho wa abunai desu yo. Aruki nagara sumaho o minai yō ni shite imasu.", en: { en: "Using your phone while walking is dangerous. I make sure not to look at my phone while walking.", np: "हिँड्दाहिँड्दै फोन हेर्नु खतरनाक छ। हिँड्दा फोन नहेर्ने कोसिस गर्छु।", jp: "ながらスマホは危険ですよ。歩きながらスマホを見ないようにしています。" } },
      { speaker: "田中", ja: "確かに。言いながら私もやってしまいます。", reading: "Tashika ni. Iinagara watashi mo yatte shimaimasu.", en: { en: "You're right. Even as I say this, I do it too.", np: "ठीक हो। भन्दैगर्दा म पनि गरिहाल्छु।", jp: "確かに。言いながら私もやってしまいます。" } },
    ],
    particles: [
      { particle: "〜ながら (simultaneous actions)", note: { en: "Two actions happening at the same time by the same subject: Verb stem + ながら. The ながら action is secondary.", np: "एउटै विषयले एकसाथ दुई कार्य गर्दछ: क्रिया स्टेम + ながら। ながら कार्य गौण हो।", jp: "同一主語が同時に二つの行動：動詞語幹＋ながら。ながら節は副次的な行動。" } },
      { particle: "ながら (contrast/despite)", note: { en: "Advanced use: expresses a concessive meaning — 知りながら言わない = knowing but not saying (contrast).", np: "उन्नत प्रयोग: रियायती अर्थ व्यक्त गर्छ — 知りながら言わない = जान्दाजान्दै नभन्नु।", jp: "逆接用法（上級）：知りながら言わない＝知っているのに言わない（対比）。" } },
      { particle: "same subject requirement", note: { en: "〜ながら requires both actions to have the SAME subject. Cannot be used when subjects differ.", np: "〜ながら ले दुवै कार्यहरूको विषय एउटै हुनु आवश्यक छ। विषयहरू भिन्न भएमा प्रयोग गर्न सकिन्न।", jp: "ながらは主語が同一でなければならない。異主語には使えない。" } },
    ],
    grammarBullets: [
      { en: "Formation: Verb stem (masu-stem) + ながら + main verb. The ながら verb is ongoing/background; main verb is the focused action.", np: "निर्माण: क्रिया स्टेम (masu-स्टेम) + ながら + मुख्य क्रिया। ながら क्रिया जारी/पृष्ठभूमि; मुख्य क्रिया केन्द्रित कार्य।", jp: "形成：動詞語幹（ます形の語幹）＋ながら＋主動詞。ながら動詞は継続・背景；主動詞が主焦点。" },
      { en: "Negative ながら: 〜ないながら is very rare. Instead, use 〜ないで for 'without doing': 音楽を聴かないで勉強する.", np: "नकारात्मक ながら: 〜ないながら धेरै दुर्लभ छ। बरु 〜ないで 'बिना गरी' का लागि: 音楽を聴かないで勉強する।", jp: "否定ながら：ないながらは稀。代わりに「〜ないで（〜せずに）」を使う：音楽を聴かないで勉強する。" },
      { en: "Progressive nuance: when the ながら verb is a state (いる、ある、知る), it often carries a contrast/concessive nuance.", np: "प्रगतिशील बारीकता: जब ながら क्रिया अवस्था (いる、ある、知る) हो, यसले प्राय: विरोधाभास/रियायती बारीकता बोकाउँछ।", jp: "ながら節が状態動詞（いる・ある・知る）のとき、しばしば逆接・譲歩のニュアンスをもつ。" },
    ],
    mcqs: [
      {
        question: { en: "Which sentence correctly uses 〜ながら?", np: "कुन वाक्यमा 〜ながら सही प्रयोग भएको छ?", jp: "〜ながらを正しく使っている文はどれか？" },
        choices: ["テレビを見ながら、弟が宿題をした。（different subjects）", "コーヒーを飲みながら新聞を読みます。", "音楽を聴きたいながら勉強する。（wrong stem）", "走ながら話す。（no い sound off stem）"],
        correctIndex: 1,
        explanation: { en: "コーヒーを飲みながら新聞を読みます — same subject, both drinking and reading, correct ながら.", np: "コーヒーを飲みながら新聞を読みます — एउटै विषय, पिउँदैगर्दा पढ्दै, सही ながら।", jp: "コーヒーを飲みながら新聞を読みます＝同一主語、同時行動、正しいながらの使い方。" },
      },
      {
        question: { en: "Choose the sentence where ながら expresses contrast (despite knowing):", np: "ながら ले विरोधाभास (जान्दाजान्दै) व्यक्त गर्ने वाक्य छान्नुहोस्:", jp: "ながらが逆接（知りながら）を表す文はどれか？" },
        choices: ["音楽を聴きながら踊る。", "知りながら教えてくれない。", "歩きながら電話する。", "食べながら話す。"],
        correctIndex: 1,
        explanation: { en: "知りながら教えてくれない = knows but won't tell — contrast/despite usage of ながら.", np: "知りながら教えてくれない = जान्दाजान्दै भन्दैन — ながら को विरोधाभास प्रयोग।", jp: "知りながら教えてくれない＝知っているのに教えない（逆接のながら）。" },
      },
    ],
    listening: {
      scenario: { en: "People describe their daily habits involving simultaneous actions, some natural (eating while watching TV) and one problematic (phone while driving).", np: "मानिसहरू एकसाथ कार्यहरू समावेश गर्ने दैनिक बानीहरू वर्णन गर्छन्।", jp: "同時行動を含む日課を描写する場面（食事中のTV視聴など。運転中のスマホは問題例）。" },
      instruction: { en: "List all ながら pairs: (action1) ながら (action2). Note which is the main focus.", np: "सबै ながら जोडीहरू सूचीबद्ध गर्नुहोस्: (कार्य1) ながら (कार्य2)। मुख्य फोकस के हो नोट गर्नुहोस्।", jp: "ながらのペアをすべて列挙：（行動1）ながら（行動2）。主焦点を記録。" },
      keyPhrases: ["〜ながら", "同時に", "ながらスマホ", "知りながら"],
      studyTip: { en: "Check: same subject? Yes → ながら OK. The background action uses masu-stem, not て-form.", np: "जाँच: एउटै विषय? हो → ながら ठीक। पृष्ठभूमि कार्यले masu-स्टेम प्रयोग गर्छ, て-रूप होइन।", jp: "確認：同一主語？→ならながらOK。背景行動は動詞語幹（ます形の語幹）でて形は使わない。" },
    },
  }),

  // Day 11: 〜あいだに / 〜うちに
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "佐藤", ja: "先生が話しているあいだに、ノートを取ってください。", reading: "Sensei ga hanashite iru aida ni, nōto o totte kudasai.", en: { en: "Please take notes while the teacher is speaking.", np: "शिक्षक बोल्दाबोल्दैको बीचमा, नोट लिनुहोस्।", jp: "先生が話しているあいだに、ノートを取ってください。" } },
      { speaker: "生徒", ja: "わかりました。若いうちに、たくさん勉強しておきます。", reading: "Wakarimashita. Wakai uchi ni, takusan benkyō shite okimasu.", en: { en: "Understood. While I'm young, I'll study a lot.", np: "बुझेँ। जवान छँदासम्म, धेरै पढेर राख्छु।", jp: "わかりました。若いうちに、たくさん勉強しておきます。" } },
      { speaker: "佐藤", ja: "いいですね。熱いうちに食べないと冷めてしまいますよ。", reading: "Ii desu ne. Atsui uchi ni tabenai to samete shimaimasu yo.", en: { en: "Good. If you don't eat while it's hot, it'll get cold.", np: "राम्रो। तातो छँदासम्म नखाएको खण्डमा चिसो हुनेछ।", jp: "いいですね。熱いうちに食べないと冷めてしまいますよ。" } },
      { speaker: "生徒", ja: "あなたが寝ているあいだに、宿題をやっておきました。", reading: "Anata ga nete iru aida ni, shukudai o yatte okimashita.", en: { en: "While you were sleeping, I finished the homework.", np: "तपाईं सुत्दाको बेला, गृहकार्य गरिसकेँ।", jp: "あなたが寝ているあいだに、宿題をやっておきました。" } },
      { speaker: "佐藤", ja: "忘れないうちに、メモしておいてください。", reading: "Wasurenai uchi ni, memo shite oite kudasai.", en: { en: "Please make a note before you forget.", np: "बिर्सनुभन्दा पहिले, नोट गरेर राख्नुहोस्।", jp: "忘れないうちに、メモしておいてください。" } },
    ],
    particles: [
      { particle: "〜あいだ（に）", note: { en: "During an interval: action B happens while action/state A is ongoing. A can be a change or a state: 先生が話しているあいだに = while the teacher is talking.", np: "अन्तरालमा: कार्य/अवस्था A जारी रहँदा कार्य B हुन्छ। A परिवर्तन वा अवस्था हुन सक्छ।", jp: "期間中：AのあいだにBが起こる。Aは状態・動作いずれも可：先生が話しているあいだに。" } },
      { particle: "〜うちに", note: { en: "While a condition still holds / before it changes: 若いうちに = while still young (before getting old). Implies urgency.", np: "अवस्था अझ कायम छँदासम्म / परिवर्तन हुनुभन्दा पहिले: 若いうちに = जवान छँदासम्म।", jp: "条件が変わらないうちに：若いうちに＝老いる前に、今のうちに（緊急性の示唆）。" } },
      { particle: "あいだ vs うちに", note: { en: "Key difference: あいだに focuses on a time window; うちに adds urgency/opportunity (before the condition changes).", np: "मुख्य भिन्नता: あいだに समय सञ्झ्यालमा केन्द्रित; うちに परिवर्तन हुनुअघि तत्कालता/अवसर जोड्छ।", jp: "違い：あいだには時間的窓；うちには変化が起こる前の緊急性・機会を強調する。" } },
    ],
    grammarBullets: [
      { en: "〜あいだに: [Vて+いる / N+の / Adj] + あいだに + secondary action. The main and sub-actions may have different subjects.", np: "〜あいだに: [Vて+いる / N+の / Adj] + あいだに + गौण कार्य। मुख्य र उप-कार्यका विषयहरू भिन्न हुन सक्छन्।", jp: "あいだに：[Vている・Nの・Adj]＋あいだに＋副次行動。主節と副節で主語が異なってもよい。" },
      { en: "〜うちに: positive form + うちに (while condition holds); negative form + うちに (before the negative happens): 忘れないうちに = before forgetting.", np: "〜うちに: सकारात्मक + うちに (अवस्था कायम); नकारात्मक + うちに (नकारात्मक हुनुभन्दा पहिले): 忘れないうちに।", jp: "うちに：肯定形＋うちに（条件が続く間）；否定形＋うちに（否定が起こる前）：忘れないうちに。" },
      { en: "Compare: あいだに = neutral during; うちに = opportunity-framed while/before. うちに often implies 'do it now or miss the chance'.", np: "तुलना: あいだに = तटस्थ दौरान; うちに = अवसर-फ्रेम गरिएको बेला/भन्दा पहिले। うちに प्राय: 'अहिले गर वा मौका गुम' बुझाउँछ।", jp: "比較：あいだに＝中立的「〜の間」；うちに＝機会を意識した「〜の間に・うちに」。うちには「今やらないと機会を逃す」の含意が多い。" },
    ],
    mcqs: [
      {
        question: { en: "Which best uses あいだに?", np: "कुन वाक्यले あいだに सबैभन्दा राम्रोसँग प्रयोग गर्छ?", jp: "あいだにを最もよく使っている文はどれか？" },
        choices: ["熱いうちに食べてください。", "若いうちに旅行してください。", "あなたが料理しているあいだに、掃除をします。", "忘れないうちにメモして。"],
        correctIndex: 2,
        explanation: { en: "あなたが料理しているあいだに — while you are cooking (ongoing state A), I'll clean (action B). Different subjects OK.", np: "あなたが料理しているあいだに — तपाईं खाना पकाउँदाको बेला (जारी अवस्था A), म सफा गर्छु (कार्य B)।", jp: "あなたが料理しているあいだに＝Aの進行中にBが起こる。異主語OK。あいだにの典型例。" },
      },
      {
        question: { en: "Which best shows the urgency nuance of うちに?", np: "कुन वाक्यले うちに को तात्कालिकता बारीकता राम्रोसँग देखाउँछ?", jp: "うちにの緊急性・機会のニュアンスを最もよく示す文はどれか？" },
        choices: ["雨が降っているあいだに傘を貸して。", "覚えているうちに復習しておこう。", "先生が話しているあいだに質問する。", "彼が来たあいだに話した。"],
        correctIndex: 1,
        explanation: { en: "覚えているうちに復習しておこう — while still remembering (before forgetting), review now. Classic urgency-うちに.", np: "覚えているうちに復習しておこう — अझ सम्झेको छँदासम्म (बिर्सनुभन्दा पहिले), अहिले नै पुनरावलोकन गरौँ।", jp: "覚えているうちに復習しておこう＝忘れる前に、今のうちに復習（機会・緊急性のうちに）。" },
      },
    ],
    listening: {
      scenario: { en: "Instructions given for doing things during/before a time window — mix of あいだに (neutral duration) and うちに (opportunity).", np: "समय सञ्झ्यालमा/भन्दा पहिले कार्यहरू गर्नका लागि निर्देशनहरू — あいだに र うちに को मिश्रण।", jp: "あいだに（中立的期間）とうちに（機会）の混在した指示を聞く場面。" },
      instruction: { en: "Label each: A=あいだに (neutral duration), U=うちに (urgency). Note what condition/state sets the window.", np: "प्रत्येक लेबल गर्नुहोस्: A=あいだに (तटस्थ अवधि), U=うちに (तात्कालिकता)।", jp: "A＝あいだに（中立）、U＝うちに（緊急）とラベル付け。どんな条件が時間的窓を設定しているかも確認。" },
      keyPhrases: ["〜あいだに", "〜うちに", "忘れないうちに", "若いうちに"],
      studyTip: { en: "Ask yourself: 'Is there a sense of urgency or missed opportunity?' → うちに. 'Neutral time window?' → あいだに.", np: "आफैलाई सोध्नुहोस्: 'तात्कालिकता वा गुमेको अवसरको भावना छ?' → うちに। 'तटस्थ समय सञ्झ्याल?' → あいだに।", jp: "「緊急性・機会を逃す感覚がある？」→うちに。「中立的な時間的窓？」→あいだに。" },
    },
  }),

  // Day 12: ばかり / だけ / しか
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "中村", ja: "あなたはいつも甘いものばかり食べていますね。", reading: "Anata wa itsumo amai mono bakari tabete imasu ne.", en: { en: "You're always eating nothing but sweets.", np: "तपाईं सधैं मीठो चिज मात्रै खाइरहनुहुन्छ।", jp: "あなたはいつも甘いものばかり食べていますね。" } },
      { speaker: "田中", ja: "そんなことないですよ。でも好きなものだけ食べたいです。", reading: "Sonna koto nai desu yo. Demo suki na mono dake tabetai desu.", en: { en: "That's not true. But I do want to eat only things I like.", np: "त्यस्तो होइन। तर मनपर्ने चिज मात्र खान मन लाग्छ।", jp: "そんなことないですよ。でも好きなものだけ食べたいです。" } },
      { speaker: "中村", ja: "野菜を100グラムしか食べていないじゃないですか。", reading: "Yasai o hyaku guramu shika tabete inai ja nai desu ka.", en: { en: "You've only eaten 100 grams of vegetables, haven't you?", np: "तरकारी केवल १०० ग्राम मात्र खानुभयो नि।", jp: "野菜を100グラムしか食べていないじゃないですか。" } },
      { speaker: "田中", ja: "来たばかりなので、まだお腹がすいていないんです。", reading: "Kita bakari na node, mada onaka ga suite inai n desu.", en: { en: "I just arrived, so I'm not hungry yet.", np: "भर्खरै आएकोले, अझ भोक लागेको छैन।", jp: "来たばかりなので、まだお腹が空いていないんです。" } },
      { speaker: "中村", ja: "そうですか。でも健康のためには野菜だけじゃなく、タンパク質も必要ですよ。", reading: "Sō desu ka. Demo kenkō no tame ni wa yasai dake ja naku, tanpakushitsu mo hitsuyō desu yo.", en: { en: "Is that so? But for your health, you need not only vegetables but also protein.", np: "त्यसो हो? तर स्वास्थ्यका लागि तरकारी मात्रै नभई, प्रोटिन पनि आवश्यक छ।", jp: "そうですか。でも健康のためには野菜だけじゃなく、タンパク質も必要ですよ。" } },
    ],
    particles: [
      { particle: "〜ばかり (only/just)", note: { en: "Focuses on a dominant/exclusive action or state (often critical tone): 甘いものばかり = nothing but sweets. Also: Vた+ばかり = just did.", np: "प्रभावी/एकमात्र कार्य वा अवस्थामा केन्द्रित (प्राय: आलोचनात्मक): 甘いものばかり। साथै: Vた+ばかり = भर्खरै गर्यो।", jp: "支配的・排他的行動への集中（批判的トーン多め）：甘いものばかり。Vたばかり＝したところ。" } },
      { particle: "〜だけ (only/just — neutral)", note: { en: "Neutral limitation: 好きなものだけ = only things I like (no critical nuance). だけじゃなく = not only.", np: "तटस्थ सीमा: 好きなものだけ = मनपर्ने चिज मात्र (आलोचनात्मक बारीकता छैन)। だけじゃなく = मात्र होइन।", jp: "中立的限定：好きなものだけ（批判的ニュアンスなし）。だけじゃなく＝だけでなく。" } },
      { particle: "〜しか〜ない (only/nothing but — negative form)", note: { en: "Restrictive with negative predicate: しか always requires a negative verb. 100グラムしか食べていない = ate only 100g (with disappointment).", np: "नकारात्मक विधेयसँग प्रतिबन्धात्मक: しか ले सधैं नकारात्मक क्रिया आवश्यक गर्छ। 100グラムしか食べていない = केवल 100g खायो।", jp: "しかは必ず否定述語と共に：100グラムしか食べていない（少なさへの失望）。" } },
    ],
    grammarBullets: [
      { en: "ばかり: implies the exclusive action/thing is overdone or problematic. Also Vた+ばかり (just did) is neutral.", np: "ばかり: अनन्य कार्य/चिज अत्यधिक वा समस्यापूर्ण बुझाउँछ। Vた+ばかり (भर्खरै) तटस्थ छ।", jp: "ばかり：排他的行動が過剰・問題的であることを示唆。Vたばかり（したところ）は中立。" },
      { en: "だけ: neutral limitation. だけでなく / だけじゃなく = not only X but also Y.", np: "だけ: तटस्थ सीमा। だけでなく / だけじゃなく = X मात्र होइन Y पनि।", jp: "だけ：中立的限定。だけでなく・だけじゃなく＝XだけでなくYも。" },
      { en: "しか: always with negative predicate. Emphasises insufficiency or restriction from the speaker's perspective: 3人しか来なかった = only 3 came (too few).", np: "しか: सधैं नकारात्मक विधेय। वक्ताको दृष्टिकोणबाट कमी वा प्रतिबन्धमा जोड: 3人しか来なかった = केवल 3 जना आए।", jp: "しか：常に否定述語。話し手からみた不十分さ・制限の強調：3人しか来なかった（少なすぎる）。" },
    ],
    mcqs: [
      {
        question: { en: "Which sentence uses しか correctly?", np: "कुन वाक्यमा しか सही प्रयोग भएको छ?", jp: "しかを正しく使っている文はどれか？" },
        choices: ["お金が1000円しかあります。", "お金が1000円しかありません。", "お金だけ1000円あります。", "お金ばかり1000円です。"],
        correctIndex: 1,
        explanation: { en: "しか must be followed by a negative: 1000円しかありません = I only have 1000 yen (insufficient).", np: "しか ले नकारात्मक पछ्याउनुपर्छ: 1000円しかありません = मसँग केवल 1000 येन मात्र छ।", jp: "しかは否定述語と共に：1000円しかありません（少なすぎる）。" },
      },
      {
        question: { en: "Which uses ばかり for 'just arrived'?", np: "कुन वाक्यले 'भर्खरै आयो' का लागि ばかり प्रयोग गर्छ?", jp: "「来たばかり」を正しく表している文はどれか？" },
        choices: ["日本に来るばかりです。", "日本に来たばかりです。", "日本にしか来ません。", "日本にだけ来ました。"],
        correctIndex: 1,
        explanation: { en: "Vたばかり = just did: 日本に来たばかりです = I just came to Japan.", np: "Vたばかり = भर्खरै गर्यो: 日本に来たばかりです = म भर्खरै जापान आएँ।", jp: "Vたばかり＝したばかり：日本に来たばかりです＝到着したところ。" },
      },
    ],
    listening: {
      scenario: { en: "Friends discuss eating habits; one overuses one food (ばかり criticism), one restricts themselves (しか complaint), one moderately limits (だけ neutral).", np: "साथीहरू खाने बानीबारे छलफल गर्छन्; एकले एउटै खाना मात्र खान्छ (ばかり), एकले सीमित (しか), एकले मध्यम (だけ)।", jp: "食習慣を話し合う場面：ばかり（批判）・しか（制限への不満）・だけ（中立的限定）の使い分け。" },
      instruction: { en: "Classify each limiting expression: B=ばかり (excessive/critical), S=しか (negative restriction), D=だけ (neutral limit).", np: "प्रत्येक सीमित अभिव्यक्ति वर्गीकृत गर्नुहोस्: B=ばかり, S=しか, D=だけ।", jp: "制限表現を分類：B＝ばかり（過剰・批判）、S＝しか（否定的制限）、D＝だけ（中立限定）。" },
      keyPhrases: ["〜ばかり", "〜だけ", "〜しか〜ない", "Vたばかり"],
      studyTip: { en: "Memory trick: しか always needs 〜ない. ばかり often implies criticism. だけ is the neutral 'only'.", np: "स्मृति चाल: しか ले सधैं 〜ない चाहिन्छ। ばかり प्राय: आलोचना बुझाउँछ। だけ तटस्थ 'मात्र'।", jp: "覚え方：しかは必ずない；ばかりはしばしば批判含む；だけは中立的「のみ」。" },
    },
  }),

  // Day 13: ことがある / ことにする / ことになる
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "田中", ja: "ときどき遅刻することがあります。", reading: "Tokidoki chikoku suru koto ga arimasu.", en: { en: "There are times when I'm occasionally late.", np: "कहिलेकाहीं ढिला हुने हुन्छ।", jp: "ときどき遅刻することがあります。" } },
      { speaker: "鈴木", ja: "そうですか。来月から早く来ることにしますか。", reading: "Sō desu ka. Raigetsu kara hayaku kuru koto ni shimasu ka.", en: { en: "I see. Will you decide to come early starting next month?", np: "त्यसो हो। अर्को महिनाबाट चाँडो आउने निर्णय गर्छन् कि?", jp: "そうですか。来月から早く来ることにしますか？" } },
      { speaker: "田中", ja: "はい、来月から毎日早起きすることにしました。", reading: "Hai, raigetsu kara mainichi hayaoki suru koto ni shimashita.", en: { en: "Yes, I decided to wake up early every day starting next month.", np: "हो, अर्को महिनाबाट हरेक दिन बिहान चाँडो उठ्ने निर्णय गरेँ।", jp: "はい、来月から毎日早起きすることにしました。" } },
      { speaker: "鈴木", ja: "実は私も転勤することになりました。東京から大阪へ。", reading: "Jitsu wa watashi mo tenkin suru koto ni narimashita. Tōkyō kara Ōsaka e.", en: { en: "Actually, it's been decided that I'll be transferred too. From Tokyo to Osaka.", np: "वास्तवमा, मलाई पनि सरुवा हुने भयो। टोकियोबाट ओसाका।", jp: "実は私も転勤することになりました。東京から大阪へ。" } },
      { speaker: "田中", ja: "えっ、大変ですね。頑張ることにしましょう。", reading: "E, taihen desu ne. Ganbaru koto ni shimashō.", en: { en: "Oh, that's tough. Let's decide to do our best.", np: "ओह, गाह्रो छ। मिहेनत गर्ने निर्णय गरौँ।", jp: "えっ、大変ですね。お互い頑張ることにしましょう。" } },
    ],
    particles: [
      { particle: "〜ことがある", note: { en: "Expresses occasional occurrence (present): ことがあります = sometimes happens. Past experience: Vた+ことがある = have done X before.", np: "कहिलेकाहीं घटना (वर्तमान): ことがあります। भूत अनुभव: Vた+ことがある = पहिले X गरेको छ।", jp: "時々の出来事（現在）：ことがあります。過去経験：Vたことがある＝〜したことがある。" } },
      { particle: "〜ことにする", note: { en: "Speaker's own decision/resolution: 早起きすることにした = decided to wake up early (my choice).", np: "वक्ताको आफ्नै निर्णय/संकल्प: 早起きすることにした = बिहान चाँडो उठ्ने निर्णय गरेँ।", jp: "話し手自身の決断・方針：早起きすることにした（自分の選択）。" } },
      { particle: "〜ことになる", note: { en: "External/circumstantial decision — happens to/is decided by circumstances: 転勤することになった = it has been decided that I'll transfer (not my own choice).", np: "बाह्य/परिस्थितिजन्य निर्णय: 転勤することになった = सरुवा हुने भयो (मेरो आफ्नै रोजाइ होइन)।", jp: "外部・状況的決定：転勤することになった（自分の意志でない決定）。" } },
    ],
    grammarBullets: [
      { en: "ことがある (occasional occurrence): dictionary form + ことがある. For past experience: past form + ことがある.", np: "ことがある (कहिलेकाहीं): शब्दकोश रूप + ことがある। भूत अनुभवका लागि: भूत रूप + ことがある।", jp: "ことがある（時々）：辞書形＋ことがある。過去経験は過去形＋ことがある。" },
      { en: "ことにする (personal decision): expresses the speaker actively choosing. ことにしている = have an ongoing policy/habit (decided and now always do).", np: "ことにする (व्यक्तिगत निर्णय): वक्ता सक्रिय रूपमा रोज्दै। ことにしている = जारी नीति/बानी।", jp: "ことにする（個人的決断）：話し手が積極的に選ぶ。ことにしている＝継続的方針・習慣。" },
      { en: "ことになる (external decision): expresses that circumstances/others have determined the outcome. ことになっている = it is expected/scheduled to happen.", np: "ことになる (बाह्य निर्णय): परिस्थिति/अरूले नतिजा निर्धारण गरेको। ことになっている = हुने तालिकामा।", jp: "ことになる（外部決定）：状況・他者が結果を決めた。ことになっている＝予定・規定。" },
    ],
    mcqs: [
      {
        question: { en: "Which expresses a personal decision?", np: "कुन वाक्यले व्यक्तिगत निर्णय व्यक्त गर्छ?", jp: "個人的な決断を表すのはどれか？" },
        choices: ["転勤することになりました。", "転勤することがあります。", "転勤することにしました。", "転勤することでしょう。"],
        correctIndex: 2,
        explanation: { en: "ことにしました = I decided to transfer (my own active decision). ことになりました = it was decided (external).", np: "ことにしました = मैले सरुवा गर्ने निर्णय गरेँ (आफ्नै)। ことになりました = निर्णय भयो (बाह्य)।", jp: "ことにしました＝自分で決めた（主体的決断）。ことになりました＝外部的に決まった。" },
      },
      {
        question: { en: "Which uses ことがある for past experience?", np: "कुन वाक्यले भूत अनुभवका लागि ことがある प्रयोग गर्छ?", jp: "ことがあるを過去経験に使っている文はどれか？" },
        choices: ["富士山に登ることがあります。（occasional）", "富士山に登ったことがあります。", "富士山に登ることにしました。", "富士山に登ることになりました。"],
        correctIndex: 1,
        explanation: { en: "Vたことがある = have done X before (experience): 富士山に登ったことがあります.", np: "Vたことがある = पहिले X गरेको छ (अनुभव): 富士山に登ったことがあります।", jp: "Vたことがある＝〜した経験がある：富士山に登ったことがあります。" },
      },
    ],
    listening: {
      scenario: { en: "Colleagues announce decisions and changes — distinguish whose decision it is (ことにする=own; ことになる=external).", np: "सहकर्मीहरू निर्णय र परिवर्तनहरू घोषणा गर्छन् — निर्णय कसको हो भिन्न गर्नुहोस्।", jp: "同僚が決断・変化を伝える場面。ことにする（自分の決断）かことになる（外部的決定）かを判別する。" },
      instruction: { en: "Identify: Own decision (ことにする) or External decision (ことになる)? Also note any ことがある (occasional) forms.", np: "पहिचान गर्नुहोस्: आफ्नै निर्णय (ことにする) वा बाह्य निर्णय (ことになる)? ことがある रूपहरू पनि नोट गर्नुहोस्।", jp: "自分の決断（ことにする）か外部的決定（ことになる）かを判別。ことがある（時々）も確認。" },
      keyPhrases: ["〜ことにしました", "〜ことになりました", "〜ことがあります", "〜ことにしています"],
      studyTip: { en: "Quick test: 'Did the speaker choose this freely?' → ことにする. 'Did circumstances or others decide it?' → ことになる.", np: "छिटो परीक्षण: 'वक्ताले स्वतन्त्र रूपमा छान्यो?' → ことにする। 'परिस्थिति वा अरूले निर्णय गर्यो?' → ことになる।", jp: "確認：「話し手が自由に選んだ？」→ことにする。「状況・他者が決めた？」→ことになる。" },
    },
  }),

  // Day 14: Potential form advanced
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "先生", ja: "皆さん、今日は可能形の応用を学びます。", reading: "Minasan, kyō wa kanōkei no ōyō o manabimasu.", en: { en: "Everyone, today we'll learn the advanced application of potential forms.", np: "सबैजना, आज सम्भाव्य रूपको उन्नत प्रयोग सिक्छौँ।", jp: "皆さん、今日は可能形の応用を学びます。" } },
      { speaker: "生徒A", ja: "先生、「ここで写真を撮れます」と「ここで写真が撮れます」の違いは何ですか。", reading: "Sensei, koko de shashin o toremasu to koko de shashin ga toremasu no chigai wa nan desu ka.", en: { en: "Teacher, what is the difference between 'can take photos here' with を and with が?", np: "गुरु, 'यहाँ फोटो खिच्न सकिन्छ' मा を र が को फरक के हो?", jp: "先生、「ここで写真を撮れます」と「ここで写真が撮れます」の違いは何ですか？" } },
      { speaker: "先生", ja: "可能形では、目的語をが/をどちらも使えますが、がが自然なことが多いです。", reading: "Kanōkei de wa, mokutekigo o ga / o dochira mo tsukaemasu ga, ga ga shizen na koto ga ōi desu.", en: { en: "In potential form, both が and を can be used for the object, but が is often more natural.", np: "सम्भाव्य रूपमा, वस्तुका लागि が र を दुवै प्रयोग गर्न सकिन्छ, तर が प्राय: बढी स्वाभाविक।", jp: "可能形では目的語にが・をどちらも使えますが、がの方が自然なことが多いです。" } },
      { speaker: "生徒B", ja: "「泳げる」と「泳ぐことができる」は同じですか。", reading: "'Oyogeru' to 'oyogu koto ga dekiru' wa onaji desu ka.", en: { en: "Is 泳げる (can swim) the same as 泳ぐことができる?", np: "'泳げる' र '泳ぐことができる' एउटै हो?", jp: "「泳げる」と「泳ぐことができる」は同じですか？" } },
      { speaker: "先生", ja: "ほぼ同じです。ただ、ことができるの方がより文語的で丁寧です。", reading: "Hobo onaji desu. Tada, koto ga dekiru no hō ga yori bungoteki de teinei desu.", en: { en: "Almost the same. However, ことができる is more formal and written-style.", np: "लगभग एउटै। तर ことができる बढी औपचारिक र लिखित शैलीको।", jp: "ほぼ同じです。ただ、ことができるの方がより書き言葉的で丁寧な表現です。" } },
    ],
    particles: [
      { particle: "Potential form (〜られる / 〜える)", note: { en: "Group 1 (u-verbs): change u→える: 書く→書ける. Group 2 (ru-verbs): add られる: 食べる→食べられる. する→できる; 来る→来られる.", np: "1ग्रुप (u-क्रिया): u→える: 書く→書ける। 2ग्रुप: られる: 食べる→食べられる। する→できる; 来る→来られる।", jp: "1グループ（う動詞）：語尾をえる：書く→書ける。2グループ：られる：食べる→食べられる。する→できる；来る→来られる。" } },
      { particle: "が vs を with potential", note: { en: "With potential forms, the direct object can be marked by either が or を: 日本語が話せる / 日本語を話せる. が is more common in speech.", np: "सम्भाव्य रूपसँग, प्रत्यक्ष वस्तु が वा を ले मार्क गर्न सकिन्छ। が बोलचालमा बढी सामान्य।", jp: "可能形では目的語にが・をどちらも可。がの方が口語では多い。" } },
      { particle: "〜ことができる (formal potential)", note: { en: "More formal/written equivalent of potential: 泳ぐことができます = can swim (formal). Same meaning as 泳げます.", np: "सम्भाव्यको थप औपचारिक/लिखित समकक्ष: 泳ぐことができます (औपचारिक)।", jp: "可能形のより書き言葉的な表現：泳ぐことができます＝泳げます（より丁寧・文語）。" } },
    ],
    grammarBullets: [
      { en: "Potential form changes: Group 1 く→ける, ぐ→げる, す→せる, つ→てる, ぬ→ねる, ぶ→べる, む→める, る→れる, う→える.", np: "सम्भाव्य रूप परिवर्तन: Group 1 く→ける, ぐ→げる, す→せる, etc।", jp: "可能形の変化：1グループ：く→ける、ぐ→げる、す→せる、つ→てる、ぬ→ねる、ぶ→べる、む→める、る→れる、う→える。" },
      { en: "Negative potential: 〜られない (Group 2) / 〜えない (Group 1): 食べられない / 書けない. Subject often marked by は when negated.", np: "नकारात्मक सम्भाव्य: 〜られない / 〜えない: 食べられない / 書けない। विषय प्राय: は ले मार्क।", jp: "否定可能：られない（2グループ）・えない（1グループ）：食べられない・書けない。否定では主語にはが多い。" },
      { en: "Colloquial shortening: Group 2 potential: 食べられる → 食べれる (ら抜き言葉 — ra-dropping). Common in speech but non-standard.", np: "बोलचाल छोटकरी: 食べられる → 食べれる (ら抜き言葉)। बोलचालमा सामान्य तर अमानक।", jp: "口語の短縮：食べられる→食べれる（ら抜き言葉）。話し言葉では多いが非標準。" },
    ],
    mcqs: [
      {
        question: { en: "What is the potential form of 書く?", np: "書く को सम्भाव्य रूप के हो?", jp: "書くの可能形はどれか？" },
        choices: ["書かれる（passive）", "書かせる（causative）", "書ける（potential）", "書こう（volitional）"],
        correctIndex: 2,
        explanation: { en: "書く (Group 1 u-verb): く→ける = 書ける (can write). Potential form.", np: "書く (Group 1): く→ける = 書ける (लेख्न सक्छ)।", jp: "書く（1グループ）：く→ける＝書ける（可能形）。" },
      },
      {
        question: { en: "Which is more formal: 読める or 読むことができる?", np: "कुन बढी औपचारिक: 読める वा 読むことができる?", jp: "より丁寧・文語的なのはどちらか？読める、または読むことができる？" },
        choices: ["読める（more formal）", "読むことができる（more formal）", "Both are equally formal.", "Neither is formal."],
        correctIndex: 1,
        explanation: { en: "ことができる is the more formal, written-style expression. 読める is the colloquial potential form.", np: "ことができる थप औपचारिक, लिखित शैली। 読める बोलचाल सम्भाव्य रूप।", jp: "ことができるの方がより書き言葉的・丁寧な表現。読めるは口語的な可能形。" },
      },
    ],
    listening: {
      scenario: { en: "Job interview where candidates explain what they can and cannot do using various potential forms.", np: "नोकरी अन्तर्वार्ता जहाँ उम्मेदवारहरूले विभिन्न सम्भाव्य रूपहरू प्रयोग गरेर के गर्न सक्छन् र के गर्न सक्दैनन् बताउँछन्।", jp: "就職面接で候補者がさまざまな可能形を使って能力・非能力を説明する場面。" },
      instruction: { en: "For each potential form heard: write the base verb and note: can or cannot? Which form (short potential / ことができる)?", np: "प्रत्येक सम्भाव्य रूप सुनेर: आधार क्रिया लेख्नुहोस् र नोट गर्नुहोस्: सक्छ वा सक्दैन?", jp: "聞こえた可能形ごとに：基本動詞を書き、できる・できないを記録。形式も（短縮可能・ことができる）確認。" },
      keyPhrases: ["〜ことができます", "〜えます", "〜られます（可能）", "〜ができません"],
      studyTip: { en: "Drill all Group 1 verbs: remove u and add える. Exceptions: する→できる; 来る→来られる. Write 10 pairs.", np: "सबै Group 1 क्रियाहरू अभ्यास: u हटाएर える जोड्नुहोस्। अपवाद: する→できる; 来る→来られる।", jp: "1グループ全体のドリル：語尾のuを取ってえるを付ける。例外：する→できる；来る→来られる。10ペア書いて定着させる。" },
    },
  }),
];
