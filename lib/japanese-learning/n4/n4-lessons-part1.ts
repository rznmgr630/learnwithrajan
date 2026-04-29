import type { N5LessonSpec } from "@/lib/japanese-learning/n5/build-japanese-detail";
import { mkN4Lesson as mk } from "@/lib/japanese-learning/n4/n4-lesson-factory";

/** Days 1–7 — Minna II Lessons 26–32 */
export const JP_N4_PART1: N5LessonSpec[] = [
  mk({
    minnaLesson: 26,
    dialogue: [
      { speaker: "田中", ja: "あ、大変！コップを落としてしまいました。", reading: "A, taihen! Koppu o otoshite shimaimashita.", en: { en: "Oh no! I dropped the cup.", np: "अरे, के भो! मैले कप झारेँ।", jp: "あらたいへん！コップを落としてしまいました。" } },
      { speaker: "鈴木", ja: "大丈夫ですか。けがはありませんか。", reading: "Daijōbu desu ka. Kega wa arimasen ka.", en: { en: "Are you OK? You're not hurt?", np: "ठीक हुनुहुन्छ? चोट लागेन नि?", jp: "大丈夫ですか？けがはしていませんか。" } },
      { speaker: "田中", ja: "はい、でも、コップが割れてしまいました。", reading: "Hai, demo, koppu ga warete shimaimashita.", en: { en: "Yes, but the cup broke.", np: "हो, तर कप फुटेको छ।", jp: "はい、でもコップが割れてしまいました。" } },
      { speaker: "鈴木", ja: "気にしないでください。よくあることですよ。", reading: "Ki ni shinai de kudasai. Yoku aru koto desu yo.", en: { en: "Don't worry. It happens to everyone.", np: "चिन्ता नगर्नुहोस्। यस्तो हुन्छ नै।", jp: "気にしないでください。誰にでもよくあることですよ。" } },
      { speaker: "田中", ja: "すみません。後で新しいコップを買ってきます。", reading: "Sumimasen. Ato de atarashii koppu o katte kimasu.", en: { en: "I'm sorry. I'll come back later and buy a new cup.", np: "माफ गर्नुहोस्। पछि नयाँ कप किनेर ल्याउँछु।", jp: "すみません。あとで新しいコップを買ってきます。" } },
      { speaker: "鈴木", ja: "本当に大丈夫ですよ。そんなことしなくていいです。", reading: "Hontō ni daijōbu desu yo. Sonna koto shinakute ii desu.", en: { en: "Really, it's fine. You don't need to do that.", np: "साँच्चै ठीक छ। त्यसो गर्न पर्दैन।", jp: "本当に大丈夫ですよ。そこまでしなくていいです。" } },
    ],
    particles: [
      { particle: "〜てしまいました", note: { en: "Expresses completed action (often with regret or surprise): dropped and it broke.", np: "सम्पन्न कार्य (प्रायः पछुतो वा अचम्मसँग) व्यक्त गर्छ।", jp: "動作の完了（多くは後悔や驚き）を表す：落として割れてしまった。" } },
      { particle: "のに", note: { en: "Contrast or unexpected result: despite expectation, the outcome was different.", np: "विरोधाभास वा अप्रत्याशित परिणाम: अपेक्षाको विपरीत।", jp: "期待に反する結果・逆接：〜のに（なのに）。" } },
      { particle: "ことがあります", note: { en: "'it sometimes happens that…' — general occurrence frame.", np: "कहिलेकाहीं हुने घटना व्यक्त गर्छ।", jp: "「〜ことがあります」: 一般的に起こることを表す。" } },
    ],
    grammarBullets: [
      { en: "〜てしまいます / 〜てしまいました: action completed (often unintentional or regrettable). Casual: 〜ちゃう / 〜ちゃった.", np: "〜てしまいます: कार्य सम्पन्न (प्रायः अनजान वा पछुतो)। अनौपचारिक: 〜ちゃう।", jp: "〜てしまいます／〜てしまいました：動作の完了（多くは意図せず、または残念に）。くだけた形：〜ちゃう。" },
      { en: "〜てしまいましたか → can also mean: 'Did you accidentally…?' in questions.", np: "प्रश्नमा: 'के तपाईंले गल्तीले गर्नुभयो...?'", jp: "疑問文では「誤って〜しましたか」の意にもなる。" },
      { en: "Regret nuance: if action harms the speaker, て-form + しまう emphasises the damage.", np: "पछुतो: वक्तालाई नोक्सान भएमा て + しまう क्षतिलाई जोड दिन्छ।", jp: "後悔のニュアンス：話し手に不利な場合、て形＋しまうは損失を強調する。" },
    ],
    grammarTable: {
      caption: { en: "〜てしまう patterns", np: "〜てしまう ढाँचाहरू", jp: "〜てしまうのパターン" },
      headers: [{ en: "Pattern", np: "ढाँचा", jp: "パターン" }, { en: "Meaning", np: "अर्थ", jp: "意味" }],
      rows: [
        ["Vて＋しまいました", { en: "completed (often with regret)", np: "सम्पन्न (प्रायः पछुतो)", jp: "完了（後悔を伴うことが多い）" }],
        ["Vて＋しまいます", { en: "will end up doing (inevitable)", np: "गरिनेछ (अपरिहार्य)", jp: "（結果として）〜することになる" }],
        ["〜ちゃった (casual)", { en: "whoops, I did it", np: "अनजानमा भयो", jp: "うっかりやってしまった（くだけた）" }],
      ],
    },
    mcqs: [
      {
        question: { en: "Which sentence uses 〜てしまいました for accidental completion?", np: "कुन वाक्यमा 〜てしまいました अनजान सम्पन्नताका लागि प्रयोग गरिएको छ?", jp: "〜てしまいましたを意図しない完了に使っている文はどれか？" },
        choices: [
          "宿題をしてしまいました。（意図的）",
          "財布を忘れてしまいました。",
          "ご飯を食べてしまいましたか。（質問）",
          "日本語を勉強してしまいます。",
        ],
        correctIndex: 1,
        explanation: { en: "Forgetting one's wallet is an unintentional completed act — classic 〜てしまいました use.", np: "पर्स बिर्सनु अनजान सम्पन्न कार्य हो।", jp: "財布を忘れるのは意図しない完了の典型例。" },
      },
      {
        question: { en: "Casual equivalent of 〜てしまいました in speech:", np: "बोलीमा 〜てしまいました को अनौपचारिक रूप:", jp: "会話での〜てしまいましたのくだけた形は？" },
        choices: ["〜てしまいます", "〜ちゃった", "〜てください", "〜ておいた"],
        correctIndex: 1,
        explanation: { en: "〜ちゃった is the casual contraction of 〜てしまった.", np: "〜ちゃった, 〜てしまった को अनौपचारिक रूप हो।", jp: "〜ちゃったは〜てしまったのくだけた縮約形。" },
      },
    ],
    listening: {
      scenario: { en: "Someone spills tea at a café and apologises to the staff; staff reassures them.", np: "क्याफेमा कोहीले चिया पोख्छ र कर्मचारीसँग माफी माग्छ; कर्मचारीले आश्वस्त पार्छ।", jp: "カフェで紅茶をこぼして店員に謝る場面。店員が安心させる。" },
      instruction: { en: "Listen for てしまいました and related apology phrases. Note the recovery turn (大丈夫です).", np: "てしまいました र सम्बन्धित माफी वाक्यांश सुन्नुहोस्। पुनर्स्थापना मोड (大丈夫です) नोट गर्नुहोस्।", jp: "てしまいましたと謝罪フレーズに注目。フォロー発話（大丈夫です）をメモ。" },
      keyPhrases: ["てしまいました", "すみません", "大丈夫です", "気にしないで"],
      studyTip: { en: "Shadow at 0.9× speed. Pause and repeat each てしまった fragment.", np: "०.९× गतिमा छायाँ गर्नुहोस्। प्रत्येक てしまった अंश रोकेर दोहोर्याउनुहोस्।", jp: "0.9倍速でシャドーイング。てしまったのかたまりごとに止めて繰り返す。" },
    },
  }),

  mk({
    minnaLesson: 27,
    dialogue: [
      { speaker: "山田", ja: "旅行の前に何か準備しておきますか。", reading: "Ryokō no mae ni nanika junbi shite okimasu ka.", en: { en: "Are you preparing anything before the trip?", np: "यात्राभन्दा अघि केही तयारी गर्दै हुनुहुन्छ?", jp: "旅行の前に何か準備しておきますか。" } },
      { speaker: "木村", ja: "はい、ホテルを予約しておきます。", reading: "Hai, hoteru o yoyaku shite okimasu.", en: { en: "Yes, I'll book the hotel in advance.", np: "हो, होटल अग्रिम बुक गर्छु।", jp: "はい、ホテルを事前に予約しておきます。" } },
      { speaker: "山田", ja: "地図も印刷しておいたほうがいいですよ。", reading: "Chizu mo insatsu shite oita hō ga ii desu yo.", en: { en: "You should also print out a map in advance.", np: "नक्सा पनि अग्रिम प्रिन्ट गरेर राख्नु राम्रो हुन्छ।", jp: "地図も印刷しておいたほうがいいですよ。" } },
      { speaker: "木村", ja: "そうですね。切符も買っておきましょう。", reading: "Sō desu ne. Kippu mo katte okimashō.", en: { en: "You're right. Let's buy the tickets in advance too.", np: "ठीक हो। टिकट पनि अग्रिम किनेर राखौं।", jp: "そうですね。切符も事前に買っておきましょう。" } },
      { speaker: "山田", ja: "スマホのバッテリーも充電しておきます。", reading: "Sumaho no batterī mo jūden shite okimasu.", en: { en: "I'll also charge the phone battery beforehand.", np: "मोबाइलको ब्याट्री पनि अग्रिम चार्ज गरेर राख्छु।", jp: "スマホのバッテリーも事前に充電しておきます。" } },
      { speaker: "木村", ja: "準備ができたら、一緒に出発しましょう。", reading: "Junbi ga dekitara, issho ni shuppatsu shimashō.", en: { en: "When we're ready, let's depart together.", np: "तयारी भएपछि, सँगै हिँडौं।", jp: "準備ができたら、一緒に出発しましょう。" } },
    ],
    particles: [
      { particle: "〜ておきます", note: { en: "Do something in advance / as preparation: I'll book it now so it's ready.", np: "अग्रिम/तयारीस्वरूप केही गर्नु: पहिले नै बुकिङ गर्छु।", jp: "事前準備として〜しておく：今のうちに予約しておく。" } },
      { particle: "〜ていきます / 〜てきます", note: { en: "〜ていく: action that moves away from speaker. 〜てくる: action that moves toward or returns.", np: "〜ていく: वक्ताबाट टाढा जाने कार्य। 〜てくる: वक्तातिर फर्कने कार्य।", jp: "〜ていく：話し手から離れていく動作。〜てくる：話し手に向かってくる・戻ってくる動作。" } },
      { particle: "〜ておいたほうがいい", note: { en: "It's better to do X in advance — strong recommendation.", np: "अग्रिम X गर्नु राम्रो हुन्छ — दृढ सिफारिस।", jp: "「〜ておいたほうがいい」：事前にしておくことを強く勧める。" } },
    ],
    grammarBullets: [
      { en: "〜ておきます: prepare in advance; the result stands ready for later use.", np: "〜ておきます: अग्रिम तयारी; परिणाम पछि उपयोगका लागि तयार हुन्छ।", jp: "〜ておきます：あらかじめ準備する、後で使えるよう結果を残しておく。" },
      { en: "〜ていきます: I will go and do / action begins here and continues away.", np: "〜ていきます: यहाँबाट सुरू भएर टाढा सम्म जारी रहने कार्य।", jp: "〜ていきます：ここから始まり、そのまま離れていく動作。" },
      { en: "〜てきます: I'll go and come back / action begins elsewhere then returns.", np: "〜てきます: अन्यत्र गएर फर्किने कार्य।", jp: "〜てきます：別のところへ行って戻ってくる動作。" },
    ],
    grammarTable: {
      caption: { en: "Directional て-form patterns", np: "दिशात्मक て-रूप ढाँचाहरू", jp: "方向のて形パターン" },
      headers: [{ en: "Form", np: "रूप", jp: "形" }, { en: "Meaning", np: "अर्थ", jp: "意味" }],
      rows: [
        ["〜ておきます", { en: "do in advance", np: "अग्रिम गर्नु", jp: "事前にしておく" }],
        ["〜ていきます", { en: "go and do (away)", np: "गएर गर्नु", jp: "〜していく（離れる）" }],
        ["〜てきます", { en: "go, do, and return", np: "गई गरेर फर्कनु", jp: "〜してくる（戻ってくる）" }],
      ],
    },
    mcqs: [
      {
        question: { en: "Which expresses doing something in preparation?", np: "कुन वाक्यले तयारीस्वरूप केही गर्नु व्यक्त गर्छ?", jp: "準備として何かをすることを表す文はどれか？" },
        choices: [
          "切符を買ってしまいました。",
          "切符を買っておきました。",
          "切符を買ってもいいですか。",
          "切符を買っていました。",
        ],
        correctIndex: 1,
        explanation: { en: "〜ておきました means 'bought it in advance (so it's ready).'", np: "〜ておきました 'अग्रिम किनेको (ताकि तयार छ)' भन्छ।", jp: "〜ておきましたは「事前に買ってあった（準備済み）」を意味する。" },
      },
      {
        question: { en: "I'll go to the convenience store and come back. Use the correct form:", np: "कन्भिनियन्स स्टोर गएर फर्किन्छु। सही रूप छान्नुहोस्:", jp: "コンビニへ行って戻ってくる。正しい形は？" },
        choices: ["コンビニへ行ってきます。", "コンビニへ行っておきます。", "コンビニへ行ってしまいます。", "コンビニへ行っています。"],
        correctIndex: 0,
        explanation: { en: "〜ていきます would mean leaving without returning; 〜てきます means go and come back.", np: "〜ていきます फर्किने भाव छैन; 〜てきます गएर फर्किने भाव दिन्छ।", jp: "〜ていきますは戻ってこない、〜てきますは行って戻ることを表す。" },
      },
    ],
    listening: {
      scenario: { en: "Two friends plan a road trip, checking off preparation tasks: booking, packing, charging devices.", np: "दुई साथीले सडक यात्रा योजना बनाउँछन्, तयारी कार्यहरू जाँच्छन्: बुकिङ, प्याकिङ, उपकरण चार्जिङ।", jp: "友人二人がドライブ旅行を計画し、宿の予約・荷造り・充電などの準備作業を確認し合う。" },
      instruction: { en: "Listen for ておきます and the sequence of preparations. Does each item end up ready?", np: "ておきます र तयारीको क्रम सुन्नुहोस्। प्रत्येक वस्तु तयार भयो?", jp: "ておきますと準備の順序に注目。各アイテムが整っているかメモする。" },
      keyPhrases: ["ておきます", "予約しておく", "買っておく", "充電しておく"],
    },
  }),

  mk({
    minnaLesson: 28,
    dialogue: [
      { speaker: "田中", ja: "すみません、窓を開けてくれませんか。", reading: "Sumimasen, mado o akete kuremasen ka.", en: { en: "Excuse me, could you open the window?", np: "माफ गर्नुहोस्, के झ्याल खोलिदिनुहुन्छ?", jp: "すみません、窓を開けてもらえますか。" } },
      { speaker: "山本", ja: "はい、いいですよ。少し暑いですね。", reading: "Hai, ii desu yo. Sukoshi atsui desu ne.", en: { en: "Sure, of course. It's a bit hot, isn't it?", np: "हो, हुन्छ नि। अलिकति गर्मी छ, होइन र?", jp: "はい、いいですよ。少し暑いですね。" } },
      { speaker: "田中", ja: "ありがとうございます。それから、この資料をコピーしてもらえませんか。", reading: "Arigatō gozaimasu. Sorekara, kono shiryō o kopī shite moraemasen ka.", en: { en: "Thank you. Also, could you copy this document for me?", np: "धन्यवाद। त्यसैगरी, के यो कागजात कपि गरिदिनुहुन्छ?", jp: "ありがとうございます。それから、この資料をコピーしていただけませんか。" } },
      { speaker: "山本", ja: "もちろんです。何枚コピーしますか。", reading: "Mochiron desu. Nan-mai kopī shimasu ka.", en: { en: "Of course. How many copies?", np: "हुन्छ। कति प्रतिलिपि चाहिन्छ?", jp: "もちろんです。何枚コピーしますか。" } },
      { speaker: "田中", ja: "二十枚お願いします。助かります。", reading: "Ni-jū-mai onegai shimasu. Tasukarimasu.", en: { en: "Twenty copies please. You're a lifesaver.", np: "बीस प्रतिलिपि चाहिन्छ। धेरै सहयोग भयो।", jp: "二十枚お願いします。本当に助かります。" } },
    ],
    particles: [
      { particle: "〜てくれませんか", note: { en: "Request: 'Won't you do X for me?' — slightly softer than 〜てください.", np: "अनुरोध: 'के तपाईं मेरोलागि X गर्नुहुन्न?' — 〜てください भन्दा अलि नरम।", jp: "依頼「〜してくれませんか」：〜てくださいよりやや柔らかい頼み方。" } },
      { particle: "〜てもらえませんか", note: { en: "Request: 'Could I have you do X?' — even more indirect and polite.", np: "अनुरोध: 'के मैले तपाईंलाई X गराउन सक्छु?' — अझ अप्रत्यक्ष र विनम्र।", jp: "「〜てもらえませんか」：さらに間接的で丁寧な依頼。" } },
      { particle: "それから", note: { en: "And then / furthermore — adds a sequential or additional point.", np: "त्यसपछि / थप — क्रमिक वा थप बिन्दु जोड्छ।", jp: "「それから」：それに加えて・次に。" } },
    ],
    grammarBullets: [
      { en: "Request escalation: 〜てください → 〜てくれませんか → 〜てもらえませんか (progressively more polite).", np: "अनुरोध क्रम: 〜てください → 〜てくれませんか → 〜てもらえませんか (क्रमशः विनम्र)।", jp: "依頼の丁寧さの段階：〜てください→〜てくれませんか→〜てもらえませんか。" },
      { en: "〜てくれませんか: speaker asks listener to do something for the speaker's benefit.", np: "〜てくれませんか: वक्ताको फाइदाका लागि श्रोतालाई अनुरोध।", jp: "〜てくれませんか：話し手の利益のために聞き手に何かを頼む。" },
      { en: "Adding でしょうか makes requests even softer: 〜てもらえないでしょうか.", np: "でしょうか थप्दा अनुरोध अझ नरम हुन्छ।", jp: "でしょうかを加えるとさらに柔らかくなる：〜てもらえないでしょうか。" },
    ],
    mcqs: [
      {
        question: { en: "Which is the most polite request form?", np: "सबैभन्दा विनम्र अनुरोध रूप कुन हो?", jp: "最も丁寧な依頼の形はどれか？" },
        choices: ["〜てください", "〜てくれませんか", "〜てもらえませんか", "〜てもいいですか"],
        correctIndex: 2,
        explanation: { en: "〜てもらえませんか is more indirect, making it the most polite of the three.", np: "〜てもらえませんか अझ अप्रत्यक्ष छ, त्यसैले सबैभन्दा विनम्र हो।", jp: "〜てもらえませんかが最も間接的で丁寧。" },
      },
      {
        question: { en: "Friend asks you to carry the bag. Natural form:", np: "साथीले झोला बोक्न भन्छ। स्वाभाविक रूप:", jp: "友達が荷物を持ってほしいと頼む。自然な形は？" },
        choices: ["荷物を持ってくれませんか。", "荷物を持っていただけませんか。", "荷物を持ってください。", "荷物を持ってくれました。"],
        correctIndex: 0,
        explanation: { en: "Between friends, 〜てくれませんか is natural; 〜ていただけませんか is used for superiors.", np: "साथीहरू बिच 〜てくれませんか स्वाभाविक; वरिष्ठहरूलागि 〜ていただけませんか।", jp: "友達同士なら〜てくれませんかが自然；目上には〜ていただけませんかを使う。" },
      },
    ],
    listening: {
      scenario: { en: "An office scene: one colleague asks another several small favors in sequence.", np: "कार्यालय दृश्य: एक सहकर्मीले अर्कोसँग क्रमशः धेरै सानो सहयोग माग्छ।", jp: "オフィスの場面：同僚に小さな頼みごとを次々とする。" },
      instruction: { en: "Note which request form is used each time. Does the level of politeness shift?", np: "प्रत्येक पटक कुन अनुरोध रूप प्रयोग गरिन्छ नोट गर्नुहोस्। विनम्रताको स्तर परिवर्तन हुन्छ?", jp: "そのたびにどの依頼形が使われているかメモ。丁寧さのレベルに変化があるか？" },
      keyPhrases: ["てくれませんか", "てもらえませんか", "いいですよ", "もちろんです"],
    },
  }),

  mk({
    minnaLesson: 29,
    dialogue: [
      { speaker: "学生", ja: "先生、もう少しゆっくり話していただけませんか。", reading: "Sensei, mō sukoshi yukkuri hanashite itadakemasen ka.", en: { en: "Teacher, could you please speak a little more slowly?", np: "सर, के अलिकति ढिलो बोलिदिनुहुन्छ?", jp: "先生、もう少しゆっくり話していただけますか。" } },
      { speaker: "先生", ja: "もちろんです。こうですか。", reading: "Mochiron desu. Kō desu ka.", en: { en: "Of course. Like this?", np: "हुन्छ। यसरी हो?", jp: "もちろんです。こんな感じでいいですか。" } },
      { speaker: "学生", ja: "はい、ありがとうございます。もう一度説明していただけますか。", reading: "Hai, arigatō gozaimasu. Mō ichido setsumei shite itadakemasu ka.", en: { en: "Yes, thank you. Could you explain it once more?", np: "हो, धन्यवाद। एकपटक फेरि व्याख्या गरिदिनुहुन्छ?", jp: "はい、ありがとうございます。もう一度説明していただけますか。" } },
      { speaker: "先生", ja: "いいですよ。それから、宿題についても質問がありますか。", reading: "Ii desu yo. Sorekara, shukudai ni tsuite mo shitsumon ga arimasu ka.", en: { en: "Sure. Also, do you have any questions about the homework?", np: "हुन्छ। त्यसैगरी, गृहकार्यबारे पनि कुनै प्रश्न छ?", jp: "いいですよ。それから、宿題についても質問はありますか。" } },
      { speaker: "学生", ja: "はい、ページ15の問題を手伝ってほしいです。", reading: "Hai, pēji jū-go no mondai o tetsudatte hoshii desu.", en: { en: "Yes, I want you to help me with the problem on page 15.", np: "हो, पृष्ठ १५ को प्रश्नमा सहयोग चाहिन्छ।", jp: "はい、15ページの問題を手伝っていただきたいです。" } },
    ],
    particles: [
      { particle: "〜ていただけませんか", note: { en: "Very polite request to a superior: 'Would you kindly do X for me?'", np: "वरिष्ठलाई अत्यन्त विनम्र अनुरोध: 'के तपाईं कृपया मेरोलागि X गर्नुहुन्छ?'", jp: "目上への非常に丁寧な依頼：「〜していただけませんか」。" } },
      { particle: "〜てほしい", note: { en: "Want someone to do X: speaker wants listener's action (〜てほしいです formal).", np: "कोहीले X गरोस् भन्ने इच्छा: वक्ता श्रोताको कार्य चाहन्छ।", jp: "「〜てほしい」：話し手が聞き手の行為を望む。丁寧形：〜てほしいです。" } },
      { particle: "〜について", note: { en: "Concerning / regarding: links a topic to an inquiry.", np: "बारेमा / सम्बन्धमा: विषयलाई सोधपुछसँग जोड्छ।", jp: "「〜について」：〜に関して。話題をつなぐ。" } },
    ],
    grammarBullets: [
      { en: "〜ていただけませんか is the most formal request form in standard classroom Japanese.", np: "〜ていただけませんか मानक कक्षाकोठाको जापानीमा सबैभन्दा औपचारिक अनुरोध रूप हो।", jp: "〜ていただけませんかは教室の日本語で最も改まった依頼形。" },
      { en: "〜てほしい vs 〜てもらいたい: both want someone's action; 〜てほしい is slightly more direct.", np: "〜てほしい र 〜てもらいたい दुवैले कसैको कार्य चाहन्छ; 〜てほしい अलि बढी प्रत्यक्ष।", jp: "〜てほしい と〜てもらいたい：どちらも他者の行為を望む。〜てほしいはやや直接的。" },
      { en: "Person + に + 〜てほしい: marks WHO you want to act for you.", np: "व्यक्ति + に + 〜てほしい: कसले कार्य गरोस् भन्ने चिनो।", jp: "人に〜てほしい：誰に行ってほしいかをにで示す。" },
    ],
    mcqs: [
      {
        question: { en: "Most appropriate when asking a professor for help:", np: "प्राध्यापकसँग सहयोग माग्दा सबैभन्दा उचित:", jp: "教授にお願いするときに最も適切な形は？" },
        choices: ["助けてください。", "助けてくれない？", "助けていただけませんか。", "助けてもらいたい。"],
        correctIndex: 2,
        explanation: { en: "〜ていただけませんか is the highest-register request form, suitable for professors.", np: "〜ていただけませんか सर्वोच्च शिष्टाचार अनुरोध रूप, प्राध्यापकका लागि उपयुक्त।", jp: "〜ていただけませんかは最も格式のある依頼形で、教授に適している。" },
      },
      {
        question: { en: "I want my mother to come to the concert. Correct form:", np: "म चाहन्छु कि मेरी आमा कन्सर्टमा आउनुहोस्। सही रूप:", jp: "母にコンサートに来てほしい。正しい形は？" },
        choices: ["母がコンサートに来てほしいです。", "母はコンサートに来てほしいです。", "母にコンサートに来てほしいです。", "母でコンサートに来てほしいです。"],
        correctIndex: 2,
        explanation: { en: "Person に + 〜てほしい: に marks the person whose action you desire.", np: "व्यक्ति に + 〜てほしい: に ले कार्य इच्छित व्यक्ति चिनो लगाउँछ।", jp: "人に〜てほしい：にで誰の行為を望むかを示す。" },
      },
    ],
    listening: {
      scenario: { en: "Student consultation: a student approaches a teacher after class with requests to re-explain content and check homework.", np: "विद्यार्थी परामर्श: एक विद्यार्थी कक्षापछि सामग्री पुन: व्याख्या र गृहकार्य जाँच्नका लागि शिक्षककहाँ जान्छ।", jp: "授業後の相談：学生が教師に内容の再説明と宿題確認を求める。" },
      instruction: { en: "Listen for ていただけませんか and てほしい. Note who is more formal and why.", np: "ていただけませんか र てほしい सुन्नुहोस्। कुन अझ औपचारिक छ र किन, नोट गर्नुहोस्।", jp: "ていただけませんかとてほしいに注目。どちらが格式高く、なぜか確認。" },
      keyPhrases: ["ていただけませんか", "てほしい", "もう一度", "説明"],
    },
  }),

  mk({
    minnaLesson: 30,
    dialogue: [
      { speaker: "中村", ja: "このケーキ、甘すぎませんか。", reading: "Kono kēki, amasugimassen ka.", en: { en: "Isn't this cake too sweet?", np: "यो केक धेरै गुलियो भएन र?", jp: "このケーキ、甘すぎませんか。" } },
      { speaker: "林", ja: "そうですか。私はちょうどいいと思いますが。", reading: "Sō desu ka. Watashi wa chōdo ii to omoimasu ga.", en: { en: "Really? I think it's just right.", np: "हो र? मलाई त ठिक्क मिठो लाग्यो।", jp: "そうですか。私にはちょうどいいと思いますが。" } },
      { speaker: "中村", ja: "コーヒーも苦すぎます。砂糖を入れましょうか。", reading: "Kōhī mo nigasugimasu. Satō o iremashō ka.", en: { en: "The coffee is too bitter too. Shall we add sugar?", np: "कफी पनि धेरै तितो छ। चिनी हालौं?", jp: "コーヒーも苦すぎます。砂糖を入れましょうか。" } },
      { speaker: "林", ja: "私はコーヒーはそのままで飲みやすいですよ。", reading: "Watashi wa kōhī wa sono mama de nomiyasui desu yo.", en: { en: "For me, the coffee is easy to drink as it is.", np: "मेरोलागि त कफी यसैगरी पिउन सजिलो छ।", jp: "私はコーヒーはそのままで飲みやすいですよ。" } },
      { speaker: "中村", ja: "そうですね。甘いものを食べすぎると体によくないですね。", reading: "Sō desu ne. Amai mono o tabesugiru to karada ni yokunai desu ne.", en: { en: "True. Eating too many sweets isn't good for your health.", np: "ठीक हो। मीठो धेरै खाँदा स्वास्थ्यलाई राम्रो हुँदैन।", jp: "そうですね。甘いものを食べすぎると体によくないですよね。" } },
    ],
    particles: [
      { particle: "〜すぎる", note: { en: "Too much / excessive: V-stem or adj-stem + すぎる. Adj-i: 高すぎる; Adj-na: 静かすぎる; V: 食べすぎる.", np: "अत्यधिक: V-stem वा adj-stem + すぎる। adj-i: 高すぎる; adj-na: 静かすぎる; V: 食べすぎる।", jp: "「〜すぎる」：度が過ぎる。V語幹・形容詞語幹＋すぎる。い形：高すぎる；な形：静かすぎる；V：食べすぎる。" } },
      { particle: "〜やすい / 〜にくい", note: { en: "V-stem + やすい = easy to do; V-stem + にくい = hard to do.", np: "V-stem + やすい = गर्न सजिलो; V-stem + にくい = गर्न गाह्रो।", jp: "V語幹＋やすい：しやすい；V語幹＋にくい：しにくい。" } },
    ],
    grammarBullets: [
      { en: "〜すぎる conjugates like a verb: すぎる → すぎます / すぎません / すぎた.", np: "〜すぎる क्रियाझैं संयोजन हुन्छ: すぎる → すぎます / すぎません / すぎた।", jp: "〜すぎる は動詞型に活用：すぎます・すぎません・すぎた。" },
      { en: "〜やすい and 〜にくい take い-adjective endings: 飲みやすい / 飲みにくい.", np: "〜やすい र 〜にくい, い-विशेषण ending लिन्छन्: 飲みやすい / 飲みにくい।", jp: "〜やすいと〜にくいはい形容詞型：飲みやすい・飲みにくい。" },
      { en: "Pair with と to express consequence of excess: 食べすぎると太ります (if eat too much → get fat).", np: "अत्यधिकताको परिणाम व्यक्त गर्न と सँग प्रयोग: 食べすぎると太ります।", jp: "食べすぎると太ります：「〜すぎると〜」で過度の結果を表す。" },
    ],
    grammarTable: {
      caption: { en: "〜すぎる patterns", np: "〜すぎる ढाँचाहरू", jp: "〜すぎるのパターン" },
      headers: [{ en: "Base", np: "आधार", jp: "語基" }, { en: "Too-form", np: "अत्यधिक रूप", jp: "すぎる形" }],
      rows: [
        ["高い (expensive)", { en: "高すぎる (too expensive)", np: "धेरै महंगो", jp: "高すぎる" }],
        ["食べる (eat)", { en: "食べすぎる (overeat)", np: "धेरै खानु", jp: "食べすぎる" }],
        ["静か (quiet)", { en: "静かすぎる (too quiet)", np: "धेरै शान्त", jp: "静かすぎる" }],
      ],
    },
    mcqs: [
      {
        question: { en: "This bag is too heavy. Choose the correct form:", np: "यो झोला धेरै गह्रौं छ। सही रूप छान्नुहोस्:", jp: "このかばんは重すぎる。正しい形はどれか？" },
        choices: ["重いすぎます。", "重すぎます。", "重くすぎます。", "重なすぎます。"],
        correctIndex: 1,
        explanation: { en: "For い-adj: drop い → add すぎる: 重い → 重すぎる.", np: "い-adj को लागि: い हटाउनुहोस् → すぎる थप्नुहोस्: 重い → 重すぎる।", jp: "い形容詞：語尾のいを取り、すぎるを付ける：重い→重すぎる。" },
      },
      {
        question: { en: "This textbook is hard to read. Correct phrase:", np: "यो पाठ्यपुस्तक पढ्न गाह्रो छ। सही वाक्यांश:", jp: "この教科書は読みにくい。正しい表現は？" },
        choices: ["読みやすいです。", "読みにくいです。", "読むにくいです。", "読いにくいです。"],
        correctIndex: 1,
        explanation: { en: "V-stem (読み) + にくい = hard to read.", np: "V-stem (読み) + にくい = पढ्न गाह्रो।", jp: "V語幹（読み）＋にくい：読みにくい。" },
      },
    ],
    listening: {
      scenario: { en: "Two colleagues review restaurant options, commenting on food being too spicy, too sweet, or easy/hard to eat.", np: "दुई सहकर्मीले रेस्टुरेन्ट विकल्पहरू समीक्षा गर्छन्, खाना धेरै पिरो, धेरै मिठो वा खान सजिलो/गाह्रोबारे टिप्पणी गर्छन्।", jp: "同僚2人がレストランを検討。料理が辛すぎる、甘すぎる、食べやすい・食べにくいなどと話す。" },
      instruction: { en: "Catch every すぎる and やすい/にくい form. Note the food item with each.", np: "प्रत्येक すぎる र やすい/にくい रूप समाउनुहोस्। प्रत्येकसँग खाना नोट गर्नुहोस्।", jp: "すぎる・やすい・にくいの形をすべて聞き取り、それぞれの食べ物とセットでメモ。" },
      keyPhrases: ["〜すぎる", "〜やすい", "〜にくい", "ちょうどいい"],
    },
  }),

  mk({
    minnaLesson: 31,
    dialogue: [
      { speaker: "佐藤", ja: "日本語が話せるようになりましたか。", reading: "Nihongo ga hanaseru yō ni narimashita ka.", en: { en: "Have you become able to speak Japanese?", np: "जापानी भाषा बोल्न सक्ने भयो?", jp: "日本語が話せるようになりましたか。" } },
      { speaker: "キム", ja: "はい、少し話せるようになりました。", reading: "Hai, sukoshi hanaseru yō ni narimashita.", en: { en: "Yes, I've become able to speak a little.", np: "हो, अलिकति बोल्न सक्ने भएको छु।", jp: "はい、少し話せるようになりました。" } },
      { speaker: "佐藤", ja: "漢字を読むことができますか。", reading: "Kanji o yomu koto ga dekimasu ka.", en: { en: "Can you read kanji?", np: "कान्जी पढ्न सक्नुहुन्छ?", jp: "漢字を読むことはできますか。" } },
      { speaker: "キム", ja: "N5の漢字は読めるようになりました。N4はまだ少し難しいです。", reading: "N go no kanji wa yomeru yō ni narimashita. N yon wa mada sukoshi muzukashii desu.", en: { en: "I've become able to read N5 kanji. N4 is still a bit difficult.", np: "N5 का कान्जी पढ्न सक्ने भएको छु। N4 अझै अलिकति गाह्रो छ।", jp: "N5の漢字は読めるようになりました。N4はまだ少し難しいです。" } },
      { speaker: "佐藤", ja: "毎日練習すれば、きっとできるようになりますよ。", reading: "Mainichi renshū sureba, kitto dekiru yō ni narimasu yo.", en: { en: "If you practice every day, you'll surely become able to do it.", np: "दिनहुँ अभ्यास गर्नुभयो भने, निश्चय नै सक्ने हुनुहुन्छ।", jp: "毎日練習すれば、きっとできるようになりますよ。" } },
    ],
    particles: [
      { particle: "〜ようになります", note: { en: "Come to be able to do / a change in state over time: 話せるようになる.", np: "क्रमशः केही गर्न सक्षम हुन: 話せるようになる।", jp: "「〜ようになる」：時間をかけて変化し、できるようになる。" } },
      { particle: "〜ことができます", note: { en: "Formal ability expression: 読むことができます = can read.", np: "औपचारिक क्षमता अभिव्यक्ति: 読むことができます = पढ्न सक्छु।", jp: "「〜ことができます」：能力の改まった表現。" } },
      { particle: "〜ようになりました", note: { en: "Past: I have come to be able to / I didn't use to, but now I can.", np: "भूतकाल: पहिले गर्न सक्दिनथेँ, अब गर्न सक्छु।", jp: "「〜ようになりました」：以前はできなかったが今はできるようになった変化。" } },
    ],
    grammarBullets: [
      { en: "〜ようになる: gradual change — often takes plain-form verb: 食べるようになる, 起きられるようになる.", np: "〜ようになる: क्रमिक परिवर्तन — प्रायः सामान्य क्रिया रूप लिन्छ।", jp: "〜ようになる：段階的な変化。普通形動詞をとることが多い：食べるようになる。" },
      { en: "〜ことができる: formal ability (potential form is more natural in conversation).", np: "〜ことができる: औपचारिक क्षमता (संभावित रूप बोलचालमा अझ स्वाभाविक)।", jp: "〜ことができる：改まった能力表現（口語では可能形の方が自然）。" },
      { en: "〜なくなります: the opposite — stopped doing / no longer does.", np: "〜なくなります: विपरीत — बन्द गर्यो / अब गर्दैन।", jp: "〜なくなります：反対の変化——しなくなる・できなくなる。" },
    ],
    mcqs: [
      {
        question: { en: "She gradually came to like vegetables. Choose correct form:", np: "उनी क्रमशः तरकारी मन पर्न थाली। सही रूप:", jp: "彼女は野菜が好きになってきた。正しい形は？" },
        choices: [
          "野菜が好きになってきました。",
          "野菜が好きになりました。",
          "野菜が好きになるようになりました。",
          "野菜が好きようになりました。",
        ],
        correctIndex: 2,
        explanation: { en: "〜ようになりました expresses the gradual change in state (came to like).", np: "〜ようになりました क्रमिक परिवर्तन (मन पर्न थाल्नु) व्यक्त गर्छ।", jp: "〜ようになりましたは状態の段階的変化（好きになってきた）を表す。" },
      },
      {
        question: { en: "Formal way to say 'I can swim':", np: "'म पौडी खेल्न सक्छु' को औपचारिक तरिका:", jp: "「泳げます」の改まった言い方は？" },
        choices: ["泳げます。", "泳ぐことができます。", "泳いでいます。", "泳ぐようになります。"],
        correctIndex: 1,
        explanation: { en: "〜ことができます is the formal ability expression.", np: "〜ことができます औपचारिक क्षमता अभिव्यक्ति हो।", jp: "〜ことができますが改まった能力表現。" },
      },
    ],
    listening: {
      scenario: { en: "Language school interview: a student describes how their Japanese ability has changed since starting the course.", np: "भाषा विद्यालय अन्तर्वार्ता: एक विद्यार्थीले कोर्स सुरू भएदेखि जापानी क्षमता कसरी परिवर्तन भयो वर्णन गर्छ।", jp: "語学学校の面談：コースを始めてから日本語力がどう変わったかを説明する。" },
      instruction: { en: "Listen for ようになりました and ことができます. What specifically changed?", np: "ようになりました र ことができます सुन्नुहोस्। विशेष रूपमा के परिवर्तन भयो?", jp: "ようになりましたとことができますに注目。何が具体的に変化したかをメモ。" },
      keyPhrases: ["ようになりました", "ことができます", "以前は", "今は"],
    },
  }),

  mk({
    minnaLesson: 32,
    dialogue: [
      { speaker: "マリア", ja: "田中さん、どうしたんですか。顔色が悪いですね。", reading: "Tanaka-san, dō shita n desu ka. Kaojiro ga warui desu ne.", en: { en: "Tanaka-san, what happened? You look pale.", np: "तनाका-सान, के भयो? अनुहार फिक्का देखिन्छ।", jp: "田中さん、どうしたんですか。顔色が悪いですね。" } },
      { speaker: "田中", ja: "昨日、少し飲みすぎたんです。", reading: "Kinō, sukoshi nomisugita n desu.", en: { en: "I drank a little too much yesterday.", np: "हिजो अलिकति धेरै पिएँ।", jp: "昨日、少し飲みすぎてしまったんです。" } },
      { speaker: "マリア", ja: "そうなんですか。大変でしたね。", reading: "Sō na n desu ka. Taihen deshita ne.", en: { en: "Is that so? That must have been tough.", np: "हो र? कठिन भयो होला नि।", jp: "そうなんですか。それは大変でしたね。" } },
      { speaker: "田中", ja: "実は、仕事がうまくいかなくて、気晴らしにお酒を飲んでしまったんです。", reading: "Jitsu wa, shigoto ga umaku ikanakute, kibara shi ni osake o nonde shimatta n desu.", en: { en: "Actually, work wasn't going well and I drank to unwind.", np: "वास्तवमा, काम राम्रोसँग भएन र मन हल्का गर्न रक्सी पिएँ।", jp: "実は、仕事がうまくいかなくて、気晴らしにお酒を飲んでしまったんです。" } },
      { speaker: "マリア", ja: "そういうことがあったんですね。ゆっくり休んでください。", reading: "Sō iu koto ga atta n desu ne. Yukkuri yasunde kudasai.", en: { en: "I see. Please take it easy and rest.", np: "त्यस्तो भएको रहेछ। राम्रोसँग आराम गर्नुहोस्।", jp: "そういうことがあったんですね。ゆっくり休んでください。" } },
    ],
    particles: [
      { particle: "〜んです / 〜んですか", note: { en: "Explanation: ん (contracted の) + です gives context or seeks explanation. Common in conversation.", np: "व्याख्या: ん (संकुचित の) + です सन्दर्भ दिन्छ वा व्याख्या खोज्छ। बोलचालमा सामान्य।", jp: "「〜んです」：背景・理由の説明。「〜んですか」：説明を求める疑問。" } },
      { particle: "実は (jitsu wa)", note: { en: "Actually / to tell the truth — introduces a revelation or correction.", np: "वास्तवमा — प्रकाशन वा सुधार परिचय गराउँछ।", jp: "「実は」：実情・本音を打ち明けるときの前置き。" } },
    ],
    grammarBullets: [
      { en: "〜んです explains WHY: 遅れたんです = the reason I'm late is… (seeking understanding from listener).", np: "〜んです किन व्याख्या गर्छ: 遅れたんです = म ढिला भएको कारण हो… (श्रोताबाट समझ खोज्दै)।", jp: "〜んですは理由を説明する：遅れたんです＝遅れた理由は…（聞き手の理解を求める）。" },
      { en: "〜んですか asks for explanation: どうしたんですか = What happened? / What's your reason?", np: "〜んですか व्याख्या सोध्छ: どうしたんですか = के भयो? / तपाईंको कारण के हो?", jp: "〜んですかは説明を求める：どうしたんですか＝どういう事情で？" },
      { en: "Pattern: plain form + んです; polite: 〜んです; casual 〜なんです / 〜なんだ.", np: "ढाँचा: सामान्य रूप + んです; विनम्र: 〜んです; अनौपचारिक: 〜なんです / 〜なんだ।", jp: "パターン：普通形＋んです；丁寧：〜んです；くだけた：〜なんです・〜なんだ。" },
    ],
    mcqs: [
      {
        question: { en: "Which sentence uses 〜んです to give an explanation?", np: "कुन वाक्यमा व्याख्याका लागि 〜んです प्रयोग गरिएको छ?", jp: "〜んですを説明のために使っている文はどれか？" },
        choices: [
          "明日、学校に行きます。",
          "頭が痛いんです。だから学校を休みます。",
          "学校を休んでいます。",
          "明日は休みます。",
        ],
        correctIndex: 1,
        explanation: { en: "頭が痛いんです = my head hurts (that's WHY I'm absent) — giving the reason.", np: "頭が痛いんです = टाउको दुखेको हो (त्यसैले अनुपस्थित हुँ) — कारण दिँदै।", jp: "頭が痛いんです：頭が痛い（だから休む）という理由の説明。" },
      },
      {
        question: { en: "A friend looks worried. You ask what happened. Best phrase:", np: "साथी चिन्तित देखिन्छ। के भयो सोध्नुहोस्। उत्तम वाक्यांश:", jp: "友達が心配そうにしている。何があったか聞く。最適な言い方は？" },
        choices: ["どうですか。", "どうしたんですか。", "大丈夫ですか。", "なぜですか。"],
        correctIndex: 1,
        explanation: { en: "どうしたんですか asks 'What happened (please explain)' using the explanatory んです frame.", np: "どうしたんですか 'के भयो (कृपया व्याख्या गर्नुहोस्)' सोध्छ।", jp: "どうしたんですかは「んです」を使って事情説明を求める。" },
      },
    ],
    listening: {
      scenario: { en: "A friend calls late at night sounding upset. The speaker uses 〜んです to explain the work stress.", np: "एक साथी रातमा ढिलो परेशान आवाजमा फोन गर्छ। वक्ता 〜んです प्रयोग गरेर कामको तनाव व्याख्या गर्छ।", jp: "友人が夜遅く落ち込んだ様子で電話してくる。話し手は〜んですを使い仕事のストレスを説明する。" },
      instruction: { en: "Note every 〜んです / 〜んですか. Does it give info or ask for info each time?", np: "प्रत्येक 〜んです / 〜んですका नोट गर्नुहोस्। प्रत्येक पटक यसले जानकारी दिन्छ वा माग्छ?", jp: "〜んです・〜んですかをすべてメモ。そのたびに情報を与えているか求めているか確認。" },
      keyPhrases: ["〜んです", "〜んですか", "どうした", "実は"],
    },
  }),
];
