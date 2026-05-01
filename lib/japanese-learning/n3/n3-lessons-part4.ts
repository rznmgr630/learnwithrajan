import type { N5LessonSpec } from "@/lib/japanese-learning/n5/build-japanese-detail";
import { mkN3Lesson as mk } from "@/lib/japanese-learning/n3/n3-lesson-factory";

/** Days 22–28 — Week 4 N3 grammar */
export const JP_N3_PART4: N5LessonSpec[] = [
  // Day 22: によって / によっては
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "田中", ja: "文化によって習慣が違いますね。", reading: "Bunka ni yotte shūkan ga chigaimasu ne.", en: { en: "Customs differ depending on the culture.", np: "संस्कृति अनुसार चलनहरू फरक हुन्छन्।", jp: "文化によって習慣が違いますね。" } },
      { speaker: "山田", ja: "そうですね。場合によっては例外もあります。", reading: "Sō desu ne. Baai ni yotte wa reigai mo arimasu.", en: { en: "That's right. In some cases there are exceptions too.", np: "हो नि। अवस्था अनुसार अपवादहरू पनि छन्।", jp: "そうですね。場合によっては例外もあります。" } },
      { speaker: "田中", ja: "この問題は状況によって判断が変わります。", reading: "Kono mondai wa jōkyō ni yotte handan ga kawarimasu.", en: { en: "Judgment on this issue changes depending on the situation.", np: "यो समस्यामा अवस्था अनुसार निर्णय फरक हुन्छ।", jp: "この問題は状況によって判断が変わります。" } },
      { speaker: "山田", ja: "その法律は国によって決められています。", reading: "Sono hōritsu wa kuni ni yotte kimerarete imasu.", en: { en: "That law is determined by the country.", np: "त्यो कानून देशले निर्धारण गर्छ।", jp: "その法律は国によって決められています。" } },
      { speaker: "田中", ja: "人によっては反対する人もいるかもしれません。", reading: "Hito ni yotte wa hantai suru hito mo iru kamo shiremasen.", en: { en: "Depending on the person, there may be those who oppose it.", np: "व्यक्ति अनुसार विरोध गर्ने मानिसहरू पनि हुन सक्छन्।", jp: "人によっては反対する人もいるかもしれません。" } },
    ],
    particles: [
      { particle: "〜によって (depending on)", note: { en: "Expresses variation/difference depending on the factor: 文化によって = depending on the culture. The factor is in によって.", np: "कारकमा निर्भर भिन्नता: 文化によって = संस्कृति अनुसार।", jp: "要因による変化・差異：文化によって＝文化次第で。要因がによってに入る。" } },
      { particle: "〜によって (by / due to)", note: { en: "Expresses means/agent (especially in passive): 法律によって決められた = decided by law. Similar to で but more formal.", np: "साधन/कर्ता (विशेषगरी passive मा): 法律によって決められた = कानूनले निर्धारण।", jp: "手段・動作主（特に受け身文で）：法律によって決められた。でより書き言葉的・フォーマル。" } },
      { particle: "〜によっては (in some cases)", note: { en: "Partial depending: 場合によっては = depending on the case (some cases). によっては emphasises partial scope.", np: "आंशिक निर्भरता: 場合によっては = अवस्था अनुसार (केही अवस्थाहरूमा)।", jp: "部分的に依存：場合によっては＝場合によって（一部の場合において）。によっては部分的範囲を強調。" } },
    ],
    grammarBullets: [
      { en: "〜によって: N + によって. Three uses: (1) depending on, (2) by/through (agent or means), (3) because of (cause in formal writing).", np: "〜によって: N + によって। तीन प्रयोग: (1) अनुसार, (2) द्वारा/मार्फत, (3) कारण (औपचारिक लेखनमा)।", jp: "によって：N＋によって。3用法：(1)〜次第で（依存）、(2)〜で・〜によって（手段・動作主）、(3)〜が原因で（原因：文語）。" },
      { en: "〜によっては: adds partial scope — not ALL cases, but IN SOME cases. Used with phrases like 場合によっては, 人によっては.", np: "〜によっては: आंशिक दायरा जोड्छ — सबै अवस्थाहरू होइन, तर केही अवस्थाहरूमा।", jp: "によっては：部分的範囲を加える。全てではなく一部の場合に。場合によっては・人によっては等と共に。" },
      { en: "Passive + によって: 発明された by 誰々 / 決定された by 何々. によって marks the agent in passive sentences formally.", np: "Passive + によって: 発明された + 誰々によって। によって ले passive वाक्यमा औपचारिक रूपमा कर्ता चिन्ह लगाउँछ।", jp: "受け身＋によって：発明された〜によって。受け身文で動作主をフォーマルに示す。" },
    ],
    mcqs: [
      {
        question: { en: "Which correctly uses によって for 'depending on'?", np: "कुन वाक्यले 'अनुसार' का लागि によって सही प्रयोग गर्छ?", jp: "「〜次第で」の意味でによってを正しく使っている文はどれか？" },
        choices: ["この本は人によって書かれました。（agent in passive）", "天気によって予定が変わります。", "場所によっては危険です。（によっては partial）", "事故によって道が混んでいます。（cause）"],
        correctIndex: 1,
        explanation: { en: "天気によって予定が変わります = Depending on the weather, the plan changes. Correct depending-on usage.", np: "天気によって予定が変わります = मौसम अनुसार योजना फेरिन्छ।", jp: "天気によって予定が変わります＝天気次第で予定が変わる。依存のによっての正しい使い方。" },
      },
      {
        question: { en: "Which uses によっては for partial scope?", np: "कुन वाक्यले आंशिक दायराका लागि によっては प्रयोग गर्छ?", jp: "によっては（部分的範囲）を使っている文はどれか？" },
        choices: ["地震によって建物が壊れた。（cause）", "人によっては反対する人もいる。", "その製品は日本で作られた。（location）", "天気によって決まります。（depending on）"],
        correctIndex: 1,
        explanation: { en: "人によっては反対する人もいる = Depending on the person, some people oppose — partial scope によっては.", np: "人によっては反対する人もいる = व्यक्ति अनुसार विरोध गर्ने पनि छन् — आंशिक दायरा によっては।", jp: "人によっては反対する人もいる＝によっては：一部の人は反対する（部分的範囲）。" },
      },
    ],
    listening: {
      scenario: { en: "Discussion about how policies differ by region/country and how individual reactions vary.", np: "नीतिहरू क्षेत्र/देश अनुसार कसरी फरक हुन्छन् र व्यक्तिगत प्रतिक्रियाहरू कसरी फरक हुन्छन् भन्ने छलफल।", jp: "地域・国によって政策が異なること、個人の反応が様々であることを議論する場面。" },
      instruction: { en: "Identify each によって/によっては and classify: D=depending, A=agent/means, P=partial.", np: "प्रत्येक によって/によっては पहिचान गर्नुहोस् र वर्गीकृत गर्नुहोस्: D=अनुसार, A=कर्ता/साधन, P=आंशिक।", jp: "によって・によっては：D（依存）・A（動作主・手段）・P（部分的）に分類する。" },
      keyPhrases: ["〜によって（違います）", "〜によって（決められた）", "〜によっては", "場合によって"],
      studyTip: { en: "Test: 'Is there variation?' → depending-on によって. 'Is something created/decided BY X?' → agent/means によって.", np: "परीक्षण: 'भिन्नता छ?' → अनुसार によって। 'X द्वारा सिर्जना/निर्णय?' → कर्ता/साधन によって।", jp: "確認：「ばらつきがあるか？」→依存のによって。「Xによって作られた・決められた？」→動作主・手段のによって。" },
    },
  }),

  // Day 23: ために / せいで / おかげで
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "田中", ja: "みなさんのおかげで、プロジェクトが成功しました。", reading: "Minasan no okage de, purojekuto ga seikō shimashita.", en: { en: "Thanks to everyone, the project succeeded.", np: "सबैको सहयोगका कारण, परियोजना सफल भयो।", jp: "みなさんのおかげで、プロジェクトが成功しました。" } },
      { speaker: "山田", ja: "いいえ、田中さんのリーダーシップのおかげですよ。", reading: "Iie, Tanaka-san no rīdāshippu no okage desu yo.", en: { en: "No, it's thanks to Tanaka-san's leadership.", np: "होइन, तानाका जीको नेतृत्वका कारण।", jp: "いいえ、田中さんのリーダーシップのおかげですよ。" } },
      { speaker: "田中", ja: "台風のせいで、昨日の試合が中止になりました。", reading: "Taifū no sei de, kinō no shiai ga chūshi ni narimashita.", en: { en: "Because of the typhoon, yesterday's match was cancelled.", np: "टाइफुनका कारण, हिजोको खेल रद्द भयो।", jp: "台風のせいで、昨日の試合が中止になりました。" } },
      { speaker: "山田", ja: "そうですね。寒さのせいで体調が悪くなりました。", reading: "Sō desu ne. Samusa no sei de taichō ga waruku narimashita.", en: { en: "That's right. I felt unwell because of the cold.", np: "हो नि। चिसोका कारण स्वास्थ्य बिग्रियो।", jp: "そうですね。寒さのせいで体調が悪くなりました。" } },
      { speaker: "田中", ja: "あなたの助けのおかげで、ここまで来られました。", reading: "Anata no tasuke no okage de, koko made koraremashita.", en: { en: "Thanks to your help, I was able to come this far.", np: "तपाईंको सहयोगका कारण, यहाँसम्म आउन सकेँ।", jp: "あなたの助けのおかげで、ここまで来られました。" } },
    ],
    particles: [
      { particle: "〜おかげで (thanks to — positive)", note: { en: "Positive cause: 先生のおかげで合格した = passed thanks to the teacher. The cause is beneficial.", np: "सकारात्मक कारण: 先生のおかげで合格した = शिक्षकका कारण पास भएँ।", jp: "ポジティブな原因：先生のおかげで合格した。原因が利益をもたらす。" } },
      { particle: "〜せいで (because of — negative)", note: { en: "Negative cause (blame): 雨のせいで試合が中止 = match cancelled because of rain. Assigns blame/responsibility.", np: "नकारात्मक कारण (दोष): 雨のせいで試合が中止 = वर्षाका कारण खेल रद्द। दोष/जिम्मेवारी।", jp: "否定的原因（責任付与）：雨のせいで試合が中止。原因に責任を帰す。" } },
      { particle: "〜ために (neutral cause)", note: { en: "Neutral cause (formal): 大雨のために電車が止まった. Neither blaming nor grateful — just stating cause.", np: "तटस्थ कारण (औपचारिक): 大雨のために電車が止まった। न दोष न कृतज्ञता।", jp: "中立的な原因（書き言葉）：大雨のために電車が止まった。責任も感謝もなく、ただ原因を述べる。" } },
    ],
    grammarBullets: [
      { en: "Cause-effect nuance triangle: おかげで = positive; せいで = negative/blame; ために = neutral/formal. Choose based on speaker's attitude toward the cause.", np: "कारण-प्रभाव बारीकता त्रिकोण: おかげで = सकारात्मक; せいで = नकारात्मक/दोष; ために = तटस्थ/औपचारिक।", jp: "因果ニュアンスの三角形：おかげで＝肯定；せいで＝否定・責任；ために＝中立・書き言葉。原因への態度で選ぶ。" },
      { en: "おかげで vs おかげで (ironically negative): せいで can be replaced by おかげで sarcastically: あなたのおかげで失敗した = 'thanks to you' I failed (ironic).", np: "おかげで vs せいで: せいで लाई おかげで व्यंग्यात्मक रूपमा प्रतिस्थापन गर्न सकिन्छ।", jp: "おかげでの皮肉用法：あなたのおかげで失敗した（皮肉）。せいでと同義の皮肉表現。" },
      { en: "All three are causal expressions: N+の+おかげで/せいで/ために; V plain+おかげで/せいで/ために.", np: "तिनै कारण अभिव्यक्तिहरू हुन्: N+の+おかげで/せいで/ために; V सादा+おかげで/せいで/ために।", jp: "3つとも因果表現：N＋の＋おかげで・せいで・ために；V普通形＋おかげで・せいで・ために。" },
    ],
    mcqs: [
      {
        question: { en: "Which correctly uses おかげで for gratitude?", np: "कुन वाक्यले कृतज्ञताका लागि おかげで सही प्रयोग गर्छ?", jp: "感謝を表すおかげでを正しく使っている文はどれか？" },
        choices: ["台風のおかげで試合が中止になった。（blame→せいで better）", "みんなのおかげで成功できました。", "遅刻のおかげで叱られました。（blame→せいで better）", "雨のおかげで傘が必要です。（neutral→ために better）"],
        correctIndex: 1,
        explanation: { en: "みんなのおかげで成功できました = succeeded thanks to everyone — positive cause, correct おかげで.", np: "みんなのおかげで成功できました = सबैका कारण सफल भएँ — सकारात्मक कारण, सही おかげで।", jp: "みんなのおかげで成功できました＝良い原因（感謝）→おかげでの正しい使い方。" },
      },
      {
        question: { en: "Which uses せいで for blame?", np: "कुन वाक्यले दोषका लागि せいで प्रयोग गर्छ?", jp: "せいで（責任付与）を使っている文はどれか？" },
        choices: ["友達のおかげで試験に合格した。（positive）", "努力のおかげで上達した。（positive）", "大雨のせいで電車が止まりました。", "先生のおかげで合格できた。（positive）"],
        correctIndex: 2,
        explanation: { en: "大雨のせいで電車が止まりました = the train stopped because of heavy rain — negative, blaming the rain.", np: "大雨のせいで電車が止まりました = ठूलो वर्षाका कारण रेल रोकियो — नकारात्मक, वर्षालाई दोष।", jp: "大雨のせいで電車が止まりました＝大雨に責任を帰す否定的原因→せいでの正しい使い方。" },
      },
    ],
    listening: {
      scenario: { en: "End-of-year speech mixing thanks (おかげで) and complaints (せいで) about the year's events.", np: "वर्षको घटनाहरूबारे धन्यवाद (おかげで) र गुनासो (せいで) मिश्रित वर्षान्त भाषण।", jp: "1年の出来事について感謝（おかげで）と不満（せいで）が混在する年末スピーチ。" },
      instruction: { en: "Tag each: G=おかげで (grateful), B=せいで (blame), N=ために (neutral). Note the emotional tone.", np: "प्रत्येक ट्याग: G=おかげで (कृतज्ञ), B=せいで (दोष), N=ために (तटस्थ)।", jp: "G＝おかげで（感謝）、B＝せいで（責任付与）、N＝ために（中立）とタグ付け。感情的トーンも確認。" },
      keyPhrases: ["〜のおかげで", "〜のせいで", "〜のために（原因）", "おかげさまで"],
      studyTip: { en: "Ask: 'Am I grateful or blaming?' Grateful → おかげで. Blaming → せいで. Neutral report → ために.", np: "सोध्नुहोस्: 'म कृतज्ञ छु वा दोष लगाउँदैछु?' कृतज्ञ → おかげで। दोष → せいで। तटस्थ → ために।", jp: "確認：「感謝か責任付与か？」感謝→おかげで。責任付与→せいで。中立的報告→ために。" },
    },
  }),

  // Day 24: Complex sentences
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "先生", ja: "今日は複数の文法パターンを組み合わせる練習をします。", reading: "Kyō wa fukusū no bunpō patān o kumiawaseru renshū o shimasu.", en: { en: "Today we'll practice combining multiple grammar patterns.", np: "आज धेरै व्याकरण ढाँचाहरू मिलाउने अभ्यास गर्छौँ।", jp: "今日は複数の文法パターンを組み合わせる練習をします。" } },
      { speaker: "生徒A", ja: "ために練習しているのに、なかなか上達しないことがあります。", reading: "Tame ni renshū shite iru noni, nakanaka jōtatsu shinai koto ga arimasu.", en: { en: "Although I practice in order to improve, sometimes I don't progress.", np: "सुधारका लागि अभ्यास गरिरहेको भए पनि, कहिलेकाहीं प्रगति नहुने हुन्छ।", jp: "上達するために練習しているのに、なかなか上達しないことがあります。" } },
      { speaker: "先生", ja: "練習すればするほど上手くなるはずですよ。", reading: "Renshū sureba suru hodo umaku naru hazu desu yo.", en: { en: "The more you practice, the better you should get.", np: "जति अभ्यास गर्यो, उति राम्रो हुनुपर्छ।", jp: "練習すればするほど上手くなるはずですよ。" } },
      { speaker: "生徒B", ja: "友達のおかげで、うちにいながら日本語を学べるようになりました。", reading: "Tomodachi no okage de, uchi ni inagara nihongo o manaberu yō ni narimashita.", en: { en: "Thanks to my friend, I've come to be able to learn Japanese while staying home.", np: "साथीका कारण, घरमा बस्दैगर्दा जापानी सिक्न सक्ने भएँ।", jp: "友達のおかげで、家にいながら日本語を学べるようになりました。" } },
      { speaker: "先生", ja: "素晴らしい。日本語というものは、使えば使うほど自然になるものです。", reading: "Subarashii. Nihongo to iu mono wa, tsukaeba tsukau hodo shizen ni naru mono desu.", en: { en: "Wonderful. Japanese, by nature, becomes more natural the more you use it.", np: "अद्भुत। जापानी भनेको जति प्रयोग गर्यो, उति स्वाभाविक हुने चिज हो।", jp: "素晴らしい。日本語というものは、使えば使うほど自然になるものです。" } },
    ],
    particles: [
      { particle: "Combining grammar (N3 integration)", note: { en: "N3 sentences often chain multiple patterns: ために+のに, ながら+ようになる, おかげで+はずだ. Reading and speaking fluency requires recognizing combined structures.", np: "N3 वाक्यहरूले प्राय: धेरै ढाँचाहरू श्रृंखलाबद्ध गर्छन्। पढाइ र बोलाइ प्रवाहिताका लागि संयुक्त संरचनाहरू पहिचान।", jp: "N3文では複数のパターンを組み合わせることが多い。読解・会話の流暢さには複合構造の認識が必要。" } },
      { particle: "Sentence-final patterns", note: { en: "Complex sentences often end with: はずだ, べきだ, ようになる, ものだ, ことになる — mark these as anchors when reading.", np: "जटिल वाक्यहरू प्राय: समाप्त हुन्छन्: はずだ, べきだ, ようになる, ものだ — पढ्दा यिनीहरूलाई लंगर बिन्दुको रूपमा।", jp: "複文の文末：はずだ・べきだ・ようになる・ものだ・ことになるが多い。読解時にこれらをアンカーにする。" } },
      { particle: "Scope of modification", note: { en: "In complex sentences, determine what modifies what: 昨日来た学生のおかげで = the student who came yesterday + おかげで.", np: "जटिल वाक्यहरूमा, के ले के संशोधन गर्छ निर्धारण गर्नुहोस्।", jp: "複文での修飾関係：昨日来た学生のおかげで＝昨日来た（学生を修飾）＋おかげで。" } },
    ],
    grammarBullets: [
      { en: "Strategy 1: Identify the sentence-final predicate first (anchor), then work backwards to find subjects and modifiers.", np: "रणनीति 1: पहिले वाक्य-अन्तिम विधेय पहिचान गर्नुहोस् (लंगर), त्यसपछि पछाडि काम गर्दै विषयहरू र संशोधकहरू फेला पार्नुहोस्।", jp: "戦略1：まず文末の述語（アンカー）を特定し、主語・修飾語を逆方向に探す。" },
      { en: "Strategy 2: Parse each clause boundary marked by て-form, のに, ながら, や, も. Each marks a clause junction.", np: "रणनीति 2: て-रूप, のに, ながら, や, も ले चिन्ह लगाइएका खण्ड सीमाहरू पार्स गर्नुहोस्।", jp: "戦略2：て形・のに・ながら・や・もで示される節境界をパースする。" },
      { en: "Strategy 3: For passive/causative in complex sentences, trace the arrows: who does what to whom.", np: "रणनीति 3: जटिल वाक्यहरूमा passive/causative का लागि, तीरहरू ट्रेस गर्नुहोस्: कसले के कसलाई गर्छ।", jp: "戦略3：受け身・使役を含む複文では「誰が何を誰にするか」の矢印を追う。" },
    ],
    mcqs: [
      {
        question: { en: "Parse this sentence: 友達のおかげで上手になれたのに、試験に落ちてしまいました。 What is the main contrast?", np: "यो वाक्य पार्स गर्नुहोस्: मुख्य विरोधाभास के हो?", jp: "友達のおかげで上手になれたのに、試験に落ちてしまいました。主な逆接の意味は？" },
        choices: ["Thanks to a friend but failed the exam (contrast)", "Failed because of a friend (blame)", "Succeeded and passed (positive)", "No contrast — simple statement"],
        correctIndex: 0,
        explanation: { en: "おかげで = good cause (friend helped improve); のに = but contrary result (still failed). Classic N3 compound contrast.", np: "おかげで = राम्रो कारण (साथीले सुधार्न मद्दत); のに = तर विपरीत परिणाम (अझ पनि फेल)।", jp: "おかげで＝良い原因（友達のおかげで上達）；のに＝しかし逆の結果（試験に落ちた）。N3複合逆接の典型。" },
      },
      {
        question: { en: "In the sentence 勉強すればするほど、わかるようになるはずだ, what is the core claim?", np: "'勉強すればするほど、わかるようになるはずだ' मा मुख्य दावा के हो?", jp: "勉強すればするほど、わかるようになるはずだ。この文の核心的な主張は？" },
        choices: ["The more you study, the more you should come to understand (proportional + logical expectation)", "You must study more", "You understand because you studied (simple cause)", "Studying is not enough"],
        correctIndex: 0,
        explanation: { en: "ば〜ほど = proportional increase; ようになる = acquired change; はずだ = logical expectation. Three N3 patterns combined.", np: "ば〜ほど = आनुपातिक; ようになる = अर्जित परिवर्तन; はずだ = तार्किक अपेक्षा। तीन N3 ढाँचाहरू संयुक्त।", jp: "ば〜ほど（比例）＋ようになる（変化）＋はずだ（論理的期待）。3つのN3パターンの組み合わせ。" },
      },
    ],
    listening: {
      scenario: { en: "A natural conversation with multiple N3 grammar forms chained together — students identify each pattern.", np: "धेरै N3 व्याकरण रूपहरू एकसाथ श्रृंखलाबद्ध भएको स्वाभाविक कुराकानी।", jp: "複数のN3文法形式が連鎖した自然な会話。各パターンを特定する練習。" },
      instruction: { en: "Each time you hear an N3 pattern, write it down: のに / ために / ながら / はずだ / べきだ / ようになる / ものだ / によって. Try to catch 5+ patterns.", np: "N3 ढाँचा सुन्दा लेख्नुहोस्। 5+ ढाँचाहरू समात्ने कोसिस गर्नुहोस्।", jp: "N3パターンが出るたびに書き取る：のに・ために・ながら・はずだ・べきだ・ようになる・ものだ・によって。5個以上キャッチを目標に。" },
      keyPhrases: ["複合文", "〜のに〜はずだ", "〜ながら〜ようになる", "〜おかげで〜ものだ"],
      studyTip: { en: "Read one N3 reading passage per day. Underline each grammar form. Translate the whole sentence, not just parts.", np: "हरेक दिन एउटा N3 पठन अनुच्छेद पढ्नुहोस्। प्रत्येक व्याकरण रूपमा रेखा कोर्नुहोस्।", jp: "毎日N3読解文を1題読み、各文法形式に下線を引く。全文を訳す（部分的でなく）。" },
    },
  }),

  // Day 25: N3 reading strategies
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "先生", ja: "N3の読解では、まず全体の構造を把握することが大切です。", reading: "N3 no dokkai de wa, mazu zentai no kōzō o haaku suru koto ga taisetsu desu.", en: { en: "In N3 reading comprehension, it's important to first grasp the overall structure.", np: "N3 पठन बोधमा, पहिले समग्र संरचना बुझ्नु महत्त्वपूर्ण छ।", jp: "N3の読解では、まず全体の構造を把握することが大切です。" } },
      { speaker: "生徒A", ja: "接続詞はどのように使われますか。例えば、しかし、一方、そのため。", reading: "Setsuzokushi wa dono yō ni tsukawa remasu ka. Tatoeba, shikashi, ippō, sonotame.", en: { en: "How are conjunctions used? For example, しかし, 一方, そのため.", np: "संयोजकहरू कसरी प्रयोग हुन्छन्? उदाहरणका लागि, しかし, 一方, そのため।", jp: "接続詞はどのように使われますか？たとえば、しかし・一方・そのため。" } },
      { speaker: "先生", ja: "接続詞は段落の関係を示します。しかし＝対比、そのため＝因果、一方＝対照。", reading: "Setsuzokushi wa dantaku no kankei o shimeshimasu. Shikashi＝taihi, sonotame＝inka, ippō＝taishō.", en: { en: "Conjunctions show the relationship between paragraphs: しかし=contrast, そのため=cause, 一方=on the other hand.", np: "संयोजकहरूले अनुच्छेदहरूको सम्बन्ध देखाउँछन्: しかし=विरोध, そのため=कारण, 一方=अर्कोतिर।", jp: "接続詞は段落の関係を示す：しかし＝対比、そのため＝因果、一方＝対照。" } },
      { speaker: "生徒B", ja: "指示語の「これ」「それ」「あれ」は何を指しているか探すことも重要ですね。", reading: "Shijigo no 'kore' 'sore' 'are' wa nani o sashite iru ka sagasu koto mo jūyō desu ne.", en: { en: "Finding what demonstratives like これ、それ、あれ refer to is also important.", np: "この, त्यो, उ जस्ता प्रदर्शनात्मकहरूले के जनाउँछन् भन्ने खोज्नु पनि महत्त्वपूर्ण।", jp: "指示語「これ・それ・あれ」が何を指すか探すことも重要ですね。" } },
      { speaker: "先生", ja: "その通りです。指示語のアンテナを張ることで読解力が上がりますよ。", reading: "Sono tōri desu. Shijigo no antena o haru koto de dokkai ryoku ga agarimasu yo.", en: { en: "Exactly. By being alert to demonstratives, your reading comprehension will improve.", np: "ठीक छ। प्रदर्शनात्मकहरूमा सतर्क रहनाले पठन बोध सुधार्छ।", jp: "その通りです。指示語のアンテナを張ることで読解力が上がりますよ。" } },
    ],
    particles: [
      { particle: "接続詞 (discourse connectors)", note: { en: "しかし = however/but (contrast); そのため = therefore (result); 一方 = on the other hand; したがって = consequently; また = also/furthermore.", np: "शब्दार्थ सम्पर्क: しかし = तथापि; そのため = त्यसैले; 一方 = अर्कोतिर; したがって = फलस्वरूप।", jp: "談話マーカー：しかし（対比）・そのため（結果）・一方（対照）・したがって（結論）・また（追加）。" } },
      { particle: "指示語 (demonstratives in text)", note: { en: "こ=near speaker, そ=near listener/just mentioned, あ=distant/both know. In text: このXY = the XY just described; それ = the thing just mentioned.", np: "こ=वक्ताको नजिक, そ=भर्खर उल्लेख, あ=दूरी। पाठमा: このXY = भर्खरै वर्णित XY।", jp: "こ＝話し手に近い、そ＝聞き手寄り・直前言及、あ＝遠い・双方既知。文中でのそれ＝直前に述べたもの。" } },
      { particle: "Topic markers and focus", note: { en: "は marks the topic/theme; が marks new information or focus. In reading: は often signals a shift in topic.", np: "は विषय/थीम चिन्ह; が नयाँ जानकारी वा फोकस। पठनमा: は प्राय: विषय परिवर्तन संकेत।", jp: "は＝話題・テーマ提示；が＝新情報・焦点。読解では、はが話題転換を示すことが多い。" } },
    ],
    grammarBullets: [
      { en: "Reading strategy 1: Scan for discourse markers first (しかし, したがって, 一方) to map the text's logical structure before reading in full.", np: "पठन रणनीति 1: पूर्ण पठन गर्नुभन्दा पहिले पाठको तार्किक संरचना मानचित्रण गर्न पहिले शब्दार्थ सम्पर्कहरू स्क्यान गर्नुहोस्।", jp: "読解戦略1：しかし・したがって・一方などの談話マーカーを先にスキャンし、文章の論理構造をマッピングしてから全文を読む。" },
      { en: "Reading strategy 2: For each demonstrative (この、その、あれ、こう), find its referent in the preceding text.", np: "पठन रणनीति 2: प्रत्येक प्रदर्शनात्मक (この、その、あれ) का लागि, पूर्ववर्ती पाठमा यसको संदर्भ फेला पार्नुहोस्।", jp: "読解戦略2：指示語（この・その・あれ・こう）ごとに、直前のテキストからその指示対象を探す。" },
      { en: "Reading strategy 3: Identify the author's main claim (筆者の主張) — often stated at the end of introduction or at paragraph conclusions.", np: "पठन रणनीति 3: लेखकको मुख्य दावा पहिचान गर्नुहोस् — प्राय: परिचय अन्त्यमा वा अनुच्छेद निष्कर्षहरूमा।", jp: "読解戦略3：筆者の主張を特定する。多くの場合、序文の末尾か各段落の結論部分に述べられている。" },
    ],
    mcqs: [
      {
        question: { en: "In a reading passage, しかし introduces:", np: "पठन अनुच्छेदमा, しかし परिचय गराउँछ:", jp: "読解文でしかしが導くのはどれか？" },
        choices: ["A supporting example", "A contrast or opposing idea", "A cause-effect relationship", "A summary"],
        correctIndex: 1,
        explanation: { en: "しかし = however/but — introduces a contrast or opposing idea to what was said before.", np: "しかし = तथापि — पहिले भनिएकोसँग विरोध वा विरोधाभासी विचार परिचय गराउँछ।", jp: "しかし＝しかしながら・でも：前の内容と対比・反論する内容を導く。" },
      },
      {
        question: { en: "In the sentence それは大切なことです, what does それ refer to?", np: "それは大切なことです मा, それ ले के जनाउँछ?", jp: "「それは大切なことです」のそれは何を指すか？" },
        choices: ["Something far from both speaker and listener", "Something just mentioned in the previous sentence", "Something near the speaker only", "Something unknown"],
        correctIndex: 1,
        explanation: { en: "そ-words (それ、その、そこ) typically refer to something just mentioned or something in the listener's domain — in written text, the immediately preceding content.", np: "そ-शब्दहरू (それ、その) सामान्यतः भर्खरै उल्लेख गरिएको वा श्रोताको क्षेत्रमा जनाउँछन्।", jp: "そ系指示語（それ・その・そこ）は通常、直前に述べた内容または聞き手の領域のものを指す。" },
      },
    ],
    listening: {
      scenario: { en: "A reading comprehension exercise with discourse markers and demonstratives — practice identifying structure.", np: "शब्दार्थ सम्पर्क र प्रदर्शनात्मकहरूसँग पठन बोध अभ्यास।", jp: "談話マーカーと指示語を含む読解練習。構造把握の練習。" },
      instruction: { en: "Read a short passage aloud, then: (1) underline all connectors, (2) circle all demonstratives, (3) identify the main claim.", np: "छोटो अनुच्छेद जोरले पढ्नुहोस्, त्यसपछि: (1) सबै संयोजकहरूमा रेखा, (2) सबै प्रदर्शनात्मकहरूमा गोलो, (3) मुख्य दावा पहिचान।", jp: "短い文章を音読し、(1)接続詞に下線、(2)指示語に丸、(3)主張を特定する。" },
      keyPhrases: ["しかし", "そのため", "一方", "したがって"],
      studyTip: { en: "Practice the 3-step method: connectors → demonstratives → main claim, for every N3 reading exercise.", np: "3-चरण विधि अभ्यास: संयोजक → प्रदर्शनात्मक → मुख्य दावा, हरेक N3 पठन अभ्यासका लागि।", jp: "3ステップ法を全N3読解問題に適用：接続詞→指示語→筆者の主張。" },
    },
  }),

  // Day 26: Sprint — N3 listening strategy
  mk({
    minnaLesson: null,
    bookRef: "N3 Sprint",
    dialogue: [
      { speaker: "先生", ja: "聴解では、文脈と推測が大切です。完全に聞き取れなくても諦めないでください。", reading: "Chōkai de wa, bunmyaku to suioku ga taisetsu desu. Kanzen ni kiki-torenakute mo akirame nai de kudasai.", en: { en: "In listening, context and inference are important. Don't give up even if you can't hear everything.", np: "सुन्नेमा, सन्दर्भ र अनुमान महत्त्वपूर्ण छ। सबै सुन्न नसकेको भए पनि हार नमान्नुहोस्।", jp: "聴解では、文脈と推測が大切です。完全に聞き取れなくても諦めないでください。" } },
      { speaker: "生徒", ja: "分からない言葉があっても、前後の文脈から意味を推測します。", reading: "Wakaranai kotoba ga atte mo, zengo no bunmyaku kara imi o suisoku shimasu.", en: { en: "Even if there are words I don't understand, I'll infer the meaning from context.", np: "नबुझेको शब्द भए पनि, सन्दर्भबाट अर्थ अनुमान गर्छु।", jp: "分からない言葉があっても、前後の文脈から意味を推測します。" } },
      { speaker: "先生", ja: "そうです。聴解では、話者の感情や意図も読み取ることが重要です。", reading: "Sō desu. Chōkai de wa, washa no kanjō ya ito mo yomitoru koto ga jūyō desu.", en: { en: "That's right. In listening, it's also important to read the speaker's emotions and intentions.", np: "हो। सुन्नेमा, वक्ताको भावना र उद्देश्य पनि बुझ्नु महत्त्वपूर्ण छ।", jp: "そうです。聴解では、話者の感情や意図も読み取ることが重要です。" } },
      { speaker: "生徒", ja: "トーンやイントネーションから感情が分かりますね。", reading: "Tōn ya intonēshon kara kanjō ga wakarimasu ne.", en: { en: "We can understand emotions from tone and intonation.", np: "स्वर र उच्चारणबाट भावना बुझ्न सकिन्छ।", jp: "トーンやイントネーションから感情がわかりますね。" } },
      { speaker: "先生", ja: "その通りです。今日は様々なシナリオで実践練習しましょう。", reading: "Sono tōri desu. Kyō wa samazama na shinario de jissen renshū shimashō.", en: { en: "Exactly. Today let's do practical practice with various scenarios.", np: "ठीक हो। आज विभिन्न परिस्थितिहरूमा व्यावहारिक अभ्यास गरौँ।", jp: "その通りです。今日はさまざまなシナリオで実践練習しましょう。" } },
    ],
    particles: [
      { particle: "Inference strategies", note: { en: "Key phrases for inference: ということは = meaning that / in other words; つまり = in short; 要するに = in summary.", np: "अनुमानका मुख्य वाक्यांशहरू: ということは = यसको मतलब; つまり = संक्षेपमा; 要するに = सारांशमा।", jp: "推論キーフレーズ：ということは＝つまり；つまり＝言い換えると；要するに＝要約すると。" } },
      { particle: "Hedging expressions", note: { en: "N3 hedging: どちらかといえば = if I had to choose; むしろ = rather; あえて = deliberately/even so.", np: "N3 हेजिङ: どちらかといえば = छान्नु परेमा; むしろ = बरु; あえて = जानाजान।", jp: "N3の婉曲表現：どちらかといえば＝どちらかと言うと；むしろ＝どちらかと言えばむしろ；あえて＝意図的に。" } },
      { particle: "Speaker's intent markers", note: { en: "Surprise: あれ / えっ. Disagreement: でも / しかし. Agreement: そうですね / なるほど. Doubt: でも本当に? / そうかな。", np: "आश्चर्य: あれ / えっ। असहमति: でも / しかし। सहमति: そうですね / なるほど।", jp: "驚き：あれ・えっ。反論：でも・しかし。同意：そうですね・なるほど。疑念：でも本当に？・そうかな。" } },
    ],
    grammarBullets: [
      { en: "N3 Listening strategy 1: Before the audio plays, read the question and options. This primes your brain to listen for specific information.", np: "N3 सुन्ने रणनीति 1: अडियो बज्नुभन्दा पहिले, प्रश्न र विकल्पहरू पढ्नुहोस्।", jp: "N3聴解戦略1：音声再生前に設問と選択肢を読む。特定情報への注意が高まる。" },
      { en: "N3 Listening strategy 2: Focus on the final part of each turn — Japanese speakers often put the most important information last.", np: "N3 सुन्ने रणनीति 2: प्रत्येक पालीको अन्तिम भागमा ध्यान दिनुहोस् — जापानी वक्ताहरू प्राय: सबैभन्दा महत्त्वपूर्ण जानकारी अन्तमा राख्छन्।", jp: "N3聴解戦略2：各発話の最後部分に注目。日本語話者は最重要情報を最後に置くことが多い。" },
      { en: "N3 Listening strategy 3: Use the process of elimination for difficult questions. If a choice contradicts something you heard, cross it out.", np: "N3 सुन्ने रणनीति 3: गाह्रो प्रश्नहरूका लागि उन्मूलनको प्रक्रिया प्रयोग गर्नुहोस्।", jp: "N3聴解戦略3：難問には消去法を使う。聞こえた内容と矛盾する選択肢を消していく。" },
    ],
    mcqs: [
      {
        question: { en: "What does つまり signal in spoken Japanese?", np: "बोलिने जापानीमा つまり ले के संकेत गर्छ?", jp: "会話でつまりが示すのは何か？" },
        choices: ["A new topic introduction", "A restatement or summary of what was just said", "A question about the listener's understanding", "An expression of surprise"],
        correctIndex: 1,
        explanation: { en: "つまり = in other words / that is to say — signals a restatement or clarification of the previous point.", np: "つまり = अर्थात / अर्को शब्दमा — भर्खर भनिएको बिन्दुको पुनर्कथन वा स्पष्टीकरण।", jp: "つまり＝言い換えると・要するに。直前の発言の言い換え・明確化を示す。" },
      },
      {
        question: { en: "What is the best strategy when you don't understand a word in the listening section?", np: "सुन्ने खण्डमा एउटा शब्द नबुझेमा सबैभन्दा राम्रो रणनीति के हो?", jp: "聴解セクションで単語が分からない時の最善策はどれか？" },
        choices: ["Stop and give up", "Use context from surrounding sentences to infer meaning", "Guess randomly", "Ask the examiner"],
        correctIndex: 1,
        explanation: { en: "Use context inference — surrounding sentences, speaker tone, and prior knowledge help you infer unfamiliar words.", np: "सन्दर्भ अनुमान प्रयोग — वरिपरिका वाक्यहरू, वक्ताको स्वर, र पूर्व ज्ञानले अपरिचित शब्दहरू अनुमान गर्न मद्दत।", jp: "文脈推測を使う：前後の文・話者のトーン・予備知識を活かして未知語を推測する。" },
      },
    ],
    listening: {
      scenario: { en: "Sprint listening practice — various N3-level spoken scenarios covering office situations, instructions, and daily conversations.", np: "स्प्रिन्ट सुन्ने अभ्यास — कार्यालय अवस्था, निर्देशन र दैनिक कुराकानी समेटेर N3 स्तरका विभिन्न बोलिने परिस्थितिहरू।", jp: "スプリント聴解練習：オフィス・指示・日常会話など、N3レベルの様々な場面。" },
      instruction: { en: "Listen once. Write: (1) topic of conversation, (2) key N3 grammar patterns heard, (3) speaker's emotional tone.", np: "एकपटक सुन्नुहोस्। लेख्नुहोस्: (1) कुराकानीको विषय, (2) सुनिएका मुख्य N3 व्याकरण ढाँचाहरू, (3) वक्ताको भावनात्मक स्वर।", jp: "1回聴いて書く：(1)会話の話題、(2)聞こえたN3文法パターン、(3)話者の感情的トーン。" },
      keyPhrases: ["つまり", "ということは", "むしろ", "どちらかといえば"],
      studyTip: { en: "Shadow daily: find a 2-3 minute Japanese podcast or YouTube clip. Listen once, then shadow phrase by phrase at 0.8× speed.", np: "दैनिक छायाँ: २-३ मिनेटको जापानी पडकास्ट वा YouTube क्लिप फेला पार्नुहोस्। एकपटक सुन्नुहोस्, त्यसपछि ०.८× गतिमा वाक्यांश-वाक्यांश छायाँ गर्नुहोस्।", jp: "毎日シャドーイング：2〜3分の日本語ポッドキャスト・YouTube動画を1回聴き、0.8倍速でフレーズごとにシャドーイングする。" },
    },
  }),

  // Day 27: Sprint — N3 vocabulary sprint
  mk({
    minnaLesson: null,
    bookRef: "N3 Sprint",
    dialogue: [
      { speaker: "田中", ja: "N3の語彙は幅広いですね。どうやって覚えていますか。", reading: "N3 no goi wa habahiroi desu ne. Dō yatte oboete imasu ka.", en: { en: "N3 vocabulary is wide-ranging. How do you memorize it?", np: "N3 को शब्दावली व्यापक छ। कसरी याद गर्नुहुन्छ?", jp: "N3の語彙は幅広いですね。どうやって覚えていますか？" } },
      { speaker: "山田", ja: "文脈の中で覚えるようにしています。単語だけ覚えても忘れてしまうことがあります。", reading: "Bunmyaku no naka de oboeru yō ni shite imasu. Tango dake oboete mo wasurete shimau koto ga arimasu.", en: { en: "I try to memorize in context. Sometimes just memorizing words makes you forget them.", np: "सन्दर्भमा याद गर्न कोसिस गर्छु। शब्द मात्र याद गरेको भए पनि बिर्सिने हुन्छ।", jp: "文脈の中で覚えるようにしています。単語だけ覚えても忘れてしまうことがあります。" } },
      { speaker: "田中", ja: "なるほど。同義語や反対語も一緒に学ぶべきですね。", reading: "Naruhodo. Dōgigo ya hantaigo mo issho ni manabu beki desu ne.", en: { en: "I see. We should also learn synonyms and antonyms together.", np: "बुझेँ। समानार्थी र विपरीतार्थी शब्दहरू पनि सँगै सिक्नु पर्छ।", jp: "なるほど。同義語や反対語も一緒に学ぶべきですね。" } },
      { speaker: "山田", ja: "そうですね。感情を表す言葉や社会問題に関する語彙も大切です。", reading: "Sō desu ne. Kanjō o arawasu kotoba ya shakai mondai ni kansuru goi mo taisetsu desu.", en: { en: "That's right. Words expressing emotions and vocabulary related to social issues are also important.", np: "हो नि। भावना व्यक्त गर्ने शब्दहरू र सामाजिक समस्याहरूसँग सम्बन्धित शब्दावली पनि महत्त्वपूर्ण।", jp: "そうですね。感情を表す言葉や社会問題に関する語彙も大切です。" } },
      { speaker: "田中", ja: "語彙を増やせば増やすほど、N3が易しく感じられるはずです。", reading: "Goi o fuyaseba fuyasu hodo, N3 ga yasashiku kanjirareru hazu desu.", en: { en: "The more vocabulary you build, the easier N3 should feel.", np: "जति शब्दावली बढायो, N3 उति सजिलो लाग्नुपर्छ।", jp: "語彙を増やせば増やすほど、N3が易しく感じられるはずです。" } },
    ],
    particles: [
      { particle: "Emotion vocabulary (N3 level)", note: { en: "感動する (be moved), 後悔する (regret), 不安になる (become anxious), 安心する (be relieved), 緊張する (be nervous).", np: "भावना शब्दावली: 感動する (प्रभावित), 後悔する (पछुतो), 不安になる (चिन्तित), 安心する (राहत)।", jp: "感情語彙：感動する・後悔する・不安になる・安心する・緊張する。" } },
      { particle: "Social vocabulary (N3 level)", note: { en: "社会問題 (social issues), 環境問題 (environmental issues), 少子化 (declining birthrate), 高齢化 (aging population), 格差 (gap/disparity).", np: "सामाजिक शब्दावली: 社会問題, 環境問題, 少子化, 高齢化, 格差।", jp: "社会語彙：社会問題・環境問題・少子化・高齢化・格差。" } },
      { particle: "Collocations to learn", note: { en: "Learn verbs + nouns together: 問題を解決する, 計画を立てる, 目標を達成する, 意見を述べる, 結論を出す.", np: "क्रिया + संज्ञा सँगै सिक्नुहोस्: 問題を解決する, 計画を立てる, 目標を達成する।", jp: "コロケーション：問題を解決する・計画を立てる・目標を達成する・意見を述べる・結論を出す。" } },
    ],
    grammarBullets: [
      { en: "Build vocabulary in semantic clusters: emotions, society, environment, technology, health. Review 20 words per cluster.", np: "अर्थगत समूहमा शब्दावली निर्माण: भावना, समाज, वातावरण, प्रविधि, स्वास्थ्य। प्रत्येक समूहमा २० शब्द।", jp: "意味的クラスターで語彙を整理：感情・社会・環境・技術・健康。各クラスター20語を復習。" },
      { en: "Use spaced repetition: review new words at 1-day, 3-day, 1-week, 2-week intervals. Apps like Anki help automate this.", np: "स्पेस्ड रिपिटिशन प्रयोग: नयाँ शब्दहरू 1-दिन, 3-दिन, 1-हप्ता, 2-हप्ता अन्तरालमा पुनरावलोकन।", jp: "分散学習：新単語を1日後・3日後・1週間後・2週間後に復習。Ankiなどのアプリが効果的。" },
      { en: "Study collocations, not just individual words. 問題 appears with: 解決する, 起きる, 抱える, 対処する — each combination has different nuance.", np: "व्यक्तिगत शब्दहरू मात्र होइन, collocation हरू अध्ययन। 問題 + 解決する, 起きる, 抱える, 対処する — प्रत्येक संयोजनमा फरक बारीकता।", jp: "単語単独ではなくコロケーションで学ぶ。問題＋解決する・起きる・抱える・対処する、各組み合わせに異なるニュアンス。" },
    ],
    mcqs: [
      {
        question: { en: "What does 後悔する mean?", np: "後悔する को अर्थ के हो?", jp: "後悔するの意味は？" },
        choices: ["To be relieved", "To regret / feel remorse", "To be nervous", "To be moved emotionally"],
        correctIndex: 1,
        explanation: { en: "後悔する = to regret, to feel remorse about something done or not done.", np: "後悔する = पछुतो गर्नु, गरेको वा नगरेको कुराबारे खेद।", jp: "後悔する＝したこと・しなかったことを悔やむ、後悔する。" },
      },
      {
        question: { en: "What does 少子化 mean in a social context?", np: "सामाजिक सन्दर्भमा 少子化 को अर्थ के हो?", jp: "社会的文脈での少子化の意味は？" },
        choices: ["An aging population", "A declining birth rate / fewer children", "Population growth", "Youth unemployment"],
        correctIndex: 1,
        explanation: { en: "少子化 = declining birth rate, a trend where fewer children are being born — major social issue in Japan.", np: "少子化 = घट्दो जन्म दर — जापानमा प्रमुख सामाजिक समस्या।", jp: "少子化＝出生率の低下、生まれる子供の数が減る傾向。日本の主要な社会問題。" },
      },
    ],
    listening: {
      scenario: { en: "News-style report on a social issue (environment/aging) using N3 vocabulary — students note key terms.", np: "N3 शब्दावली प्रयोग गरेर सामाजिक समस्या (वातावरण/वृद्धावस्था) मा समाचार-शैलीको रिपोर्ट।", jp: "N3語彙を使った社会問題（環境・高齢化）に関するニュース形式のレポートを聞く。" },
      instruction: { en: "Write down every N3 vocabulary item you recognize. After listening, look up any terms you missed.", np: "आफूले चिनेका हरेक N3 शब्दावली लेख्नुहोस्। सुनेपछि, छुटेका शब्दहरू खोज्नुहोस्।", jp: "聞き取れたN3語彙を全て書き取る。リスニング後、聞き取れなかった語を調べる。" },
      keyPhrases: ["社会問題", "環境問題", "高齢化社会", "格差"],
      studyTip: { en: "Read one NHK Web Easy (やさしい日本語) article per day — it's written at N3-N4 level with furigana.", np: "हरेक दिन एउटा NHK Web Easy (やさしい日本語) लेख पढ्नुहोस् — N3-N4 स्तरमा furigana सहित लेखिएको।", jp: "NHK Web Easy（やさしい日本語）を毎日1記事読む。N3〜N4レベルでふりがな付き。" },
    },
  }),

  // Day 28: Sprint — full mock mindset & review
  mk({
    minnaLesson: null,
    bookRef: "N3 Sprint",
    dialogue: [
      { speaker: "先生", ja: "いよいよ最終日ですね。今日は試験の心構えについて話しましょう。", reading: "Iyoiyo saishūbi desu ne. Kyō wa shiken no kokorogamae ni tsuite hanashimashō.", en: { en: "It's finally the last day. Today let's talk about exam mindset.", np: "अन्तिम दिन आयो। आज परीक्षाको मानसिकताबारे कुरा गरौँ।", jp: "いよいよ最終日ですね。今日は試験の心構えについて話しましょう。" } },
      { speaker: "生徒", ja: "緊張するはずですが、練習のおかげで自信がついてきました。", reading: "Kinchō suru hazu desu ga, renshū no okage de jishin ga tsuite kimashita.", en: { en: "I should be nervous, but thanks to practice, I've gained confidence.", np: "घबराउनुपर्छ, तर अभ्यासका कारण आत्मविश्वास बढेको छ।", jp: "緊張するはずですが、練習のおかげで自信がついてきました。" } },
      { speaker: "先生", ja: "そうですね。諦めないことが大切です。難しい問題にぶつかったとき、次に進むべきです。", reading: "Sō desu ne. Akiramenai koto ga taisetsu desu. Muzukashii mondai ni butsukatta toki, tsugi ni susumu beki desu.", en: { en: "That's right. Not giving up is important. When you hit a difficult question, you should move on.", np: "हो नि। हार नमान्नु महत्त्वपूर्ण। गाह्रो प्रश्नमा पुग्दा, अर्को प्रश्नमा जानु पर्छ।", jp: "そうですね。諦めないことが大切です。難しい問題にぶつかったとき、次に進むべきです。" } },
      { speaker: "生徒", ja: "時間配分もものによって変わりますね。語彙は速く、読解は時間をかけるべきですか。", reading: "Jikan haibun mo mono ni yotte kawarimasu ne. Goi wa hayaku, dokkai wa jikan o kakeru beki desu ka.", en: { en: "Time allocation varies depending on the section. Should vocabulary be fast and reading take more time?", np: "समय बाँडफाँड पनि खण्ड अनुसार फरक हुन्छ। शब्दावली छिटो र पठन बढी समय लिनुपर्छ?", jp: "時間配分もものによって変わりますね。語彙は速く、読解は時間をかけるべきですか？" } },
      { speaker: "先生", ja: "そうです。諦めずに最後まで頑張ることにしましょう。皆さんを応援しています。", reading: "Sō desu. Akiramezu ni saigo made ganbaru koto ni shimashō. Minasan o ōen shite imasu.", en: { en: "That's right. Let's commit to doing our best till the end without giving up. I'm cheering you all on.", np: "हो। हार नमानी अन्त्यसम्म मिहेनत गर्ने निर्णय गरौँ। म सबैलाई प्रोत्साहन गर्दैछु।", jp: "そうです。諦めずに最後まで頑張ることにしましょう。みなさんを応援しています。" } },
    ],
    particles: [
      { particle: "Exam day mindset", note: { en: "Time management: vocab 15%, grammar 25%, reading 35%, listening 25%. Skip stuck questions; return later.", np: "समय व्यवस्थापन: शब्दावली 15%, व्याकरण 25%, पठन 35%, सुन्ने 25%। अड्केको प्रश्न छोड्ने; पछि फर्कने।", jp: "時間配分：語彙15%・文法25%・読解35%・聴解25%。詰まった問題は飛ばして後で戻る。" } },
      { particle: "Review weak points", note: { en: "Before the exam: review grammar you know but mix up (のに vs ために, そうだ hearsay vs appearance). Write 2 example sentences for each.", np: "परीक्षाभन्दा पहिले: जानेको तर मिसाउने व्याकरण समीक्षा। प्रत्येकका लागि २ उदाहरण वाक्य लेख्नुहोस्।", jp: "試験前：知っているが混同しがちな文法を復習（のにvsために・伝聞vs見た目のそうだ）。各2例文を書く。" } },
      { particle: "Trust the process", note: { en: "28 days of N3 study covers the core grammar. Trust your preparation. On exam day: breathe, read carefully, eliminate wrong answers.", np: "N3 अध्ययनका 28 दिनले मुख्य व्याकरण समेट्छ। आफ्नो तयारीमा विश्वास। परीक्षामा: सास लिनुहोस्, ध्यानले पढ्नुहोस्।", jp: "28日のN3学習でコア文法はカバー済み。準備を信じる。試験当日：深呼吸・丁寧に読む・誤答を消去する。" } },
    ],
    grammarBullets: [
      { en: "Final review checklist: 〜てある, relative clauses, のに, ために, ように, conditionals (と/ば/たら/なら), はずだ/べきだ — can you produce 1 example sentence each?", np: "अन्तिम समीक्षा सूची: 〜てある, सापेक्ष खण्ड, のに, ために, ように, सर्तहरू — प्रत्येकका लागि 1 उदाहरण वाक्य बनाउन सक्नुहुन्छ?", jp: "最終確認チェックリスト：てある・関係節・のに・ために・ように・条件形（と/ば/たら/なら）・はずだ/べきだ。各1例文が言えるか？" },
      { en: "Week 2-3 review: そうだ/らしい/ようだ, quoting, ながら, あいだに/うちに, ばかり/だけ/しか, ことにする/ことになる, potential forms, keigo/kenjōgo.", np: "हप्ता 2-3 समीक्षा: そうだ/らしい/ようだ, उद्धरण, ながら, あいだに/うちに, ばかり/だけ/しか, keigo/kenjōgo।", jp: "第2〜3週の復習：そうだ・らしい・ようだ、引用、ながら、あいだに・うちに、ばかり・だけ・しか、ことにする・ことになる、可能形、敬語・謙譲語。" },
      { en: "Week 4 review: によって, おかげで/せいで/ために, complex sentences, reading strategies, listening strategies, advanced vocabulary (社会・感情).", np: "हप्ता 4 समीक्षा: によって, おかげで/せいで/ために, जटिल वाक्यहरू, पठन/सुन्ने रणनीतिहरू, उन्नत शब्दावली।", jp: "第4週の復習：によって・おかげで/せいで/ために・複合文・読解戦略・聴解戦略・応用語彙（社会・感情）。" },
    ],
    mcqs: [
      {
        question: { en: "What is the best approach when you encounter a difficult question during the JLPT N3?", np: "JLPT N3 मा गाह्रो प्रश्न सामना गर्दा सबैभन्दा राम्रो दृष्टिकोण के हो?", jp: "JLPT N3で難しい問題に当たった時の最善の対応はどれか？" },
        choices: ["Spend as much time as needed to solve it", "Skip it and come back to it later if time permits", "Always choose the longest answer", "Leave it blank"],
        correctIndex: 1,
        explanation: { en: "Skip difficult questions and return later — this ensures you don't lose easy points by spending too long on hard ones.", np: "गाह्रो प्रश्नहरू छोड्नुहोस् र पछि फर्कनुहोस् — यसले सजिलो बिन्दुहरू गुमाउनु नपर्ने सुनिश्चित।", jp: "難問は飛ばして後で戻る。難問に時間をかけすぎて易問を落とさないようにする。" },
      },
      {
        question: { en: "Which N3 grammar pattern expresses 'the more X, the more Y'?", np: "कुन N3 व्याकरण ढाँचाले 'जति X उति Y' व्यक्त गर्छ?", jp: "「XすればするほどY」というN3文法パターンはどれか？" },
        choices: ["〜ものの", "〜によって", "〜ば〜ほど", "〜うちに"],
        correctIndex: 2,
        explanation: { en: "〜ば〜ほど expresses proportional increase: the more X happens, the more Y follows.", np: "〜ば〜ほど आनुपातिक वृद्धि व्यक्त गर्छ: जति X हुन्छ, उति Y हुन्छ।", jp: "〜ば〜ほど＝比例増加：XすればするほどYになる。" },
      },
    ],
    listening: {
      scenario: { en: "A final comprehensive listening exercise covering multiple N3 grammar forms, vocabulary, and discourse markers in a natural conversation.", np: "स्वाभाविक कुराकानीमा धेरै N3 व्याकरण रूपहरू, शब्दावली र शब्दार्थ सम्पर्कहरू समेटेर अन्तिम व्यापक सुन्ने अभ्यास।", jp: "複数のN3文法形式・語彙・談話マーカーを含む自然な会話の総合聴解練習。" },
      instruction: { en: "This is your final timed practice. Listen ONCE only. Answer all questions without replaying. Then check your answers.", np: "यो तपाईंको अन्तिम समयबद्ध अभ्यास हो। एकपटक मात्र सुन्नुहोस्। पुनः बजाए बिना सबै प्रश्नको उत्तर दिनुहोस्।", jp: "最終タイム練習：1回のみ聴く。巻き戻しなしで全問回答。その後で答え合わせをする。" },
      keyPhrases: ["N3総復習", "時間配分", "諦めない", "自信を持って"],
      studyTip: { en: "On the real JLPT day: eat well, sleep enough the night before, arrive early. The exam tests what you know — trust your 28 days of preparation.", np: "वास्तविक JLPT दिन: राम्रोसँग खाना खानुहोस्, अघिल्लो रात पर्याप्त निद्रा, चाँडो पुग्नुहोस्। परीक्षाले तपाईंको ज्ञान परीक्षण गर्छ — तपाईंको 28 दिनको तयारीमा विश्वास।", jp: "本番当日：しっかり食事・前夜は十分睡眠・早めに会場へ。試験はあなたの知識を試す。28日間の準備を信じる。" },
    },
  }),
];
