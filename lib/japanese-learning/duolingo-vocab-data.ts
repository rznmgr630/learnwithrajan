export type DuolingoExample = {
  ja: string;
  en: string;
  np: string;
};

export type DuolingoWord = {
  word: string;
  meaning_en: string;
  meaning_np: string;
  examples: DuolingoExample[];
};

export type DuolingoDay = {
  day: number;
  words: DuolingoWord[];
};

export const DUOLINGO_DAYS: DuolingoDay[] = [
  {
    day: 1,
    words: [
      {
        word: "ホーム",
        meaning_en: "Platform",
        meaning_np: "प्लेटफर्म",
        examples: [{ ja: "ホームはあそこです。", en: "The platform is over there.", np: "प्लेटफर्म त्यहाँ छ।" }],
      },
      {
        word: "改札口",
        meaning_en: "Ticket gate",
        meaning_np: "टिकट गेट",
        examples: [{ ja: "改札口は一階です。", en: "The ticket gate is on the first floor.", np: "टिकट गेट पहिलो तलामा छ।" }],
      },
      {
        word: "終点",
        meaning_en: "Final stop",
        meaning_np: "अन्तिम स्टप",
        examples: [{ ja: "ここは終点ですか。", en: "Is this the final stop?", np: "यो अन्तिम स्टप हो?" }],
      },
      {
        word: "上野公園",
        meaning_en: "Ueno Park",
        meaning_np: "उएनो पार्क",
        examples: [{ ja: "上野公園はいいです。", en: "Ueno Park is nice.", np: "उएनो पार्क राम्रो छ।" }],
      },
      {
        word: "浅草",
        meaning_en: "Asakusa (place name)",
        meaning_np: "असाकुसा",
        examples: [],
      },
      {
        word: "えっと、紅茶を四つください",
        meaning_en: "Um, four black teas, please",
        meaning_np: "उम, चार कालो चिया दिनुहोस्",
        examples: [],
      },
      {
        word: "電子レンジ",
        meaning_en: "Microwave",
        meaning_np: "माइक्रोवेभ",
        examples: [{ ja: "まだ電子レンジはありません。", en: "I still don't have a microwave.", np: "अझै माइक्रोवेभ छैन।" }],
      },
      {
        word: "たぶん",
        meaning_en: "Probably",
        meaning_np: "सायद",
        examples: [{ ja: "たぶんベッドを買います。", en: "I will probably buy a bed.", np: "सायद बेड किन्छु।" }],
      },
    ],
  },
  {
    day: 2,
    words: [
      {
        word: "新しい掃除機があります",
        meaning_en: "I have a new vacuum cleaner",
        meaning_np: "मसँग नयाँ भ्याकुम क्लिनर छ",
        examples: [],
      },
      {
        word: "リビング",
        meaning_en: "Living room",
        meaning_np: "बस्ने कोठा",
        examples: [{ ja: "リビングはどうですか。", en: "How's the living room?", np: "बस्ने कोठा कस्तो छ?" }],
      },
      {
        word: "明るい",
        meaning_en: "Well-lit, bright",
        meaning_np: "उज्यालो",
        examples: [{ ja: "とても明るいです。", en: "It's very well lit.", np: "धेरै उज्यालो छ।" }],
      },
      {
        word: "キッチン",
        meaning_en: "Kitchen",
        meaning_np: "भान्साकोठा",
        examples: [],
      },
      {
        word: "自販機",
        meaning_en: "Vending machine",
        meaning_np: "भेन्डिङ मेसिन",
        examples: [],
      },
      {
        word: "ロマンスドラマ",
        meaning_en: "Romance drama",
        meaning_np: "रोमान्स नाटक",
        examples: [{ ja: "ロマンスドラマがまあまあです。", en: "Romance dramas are so-so.", np: "रोमान्स नाटक ठीकठाक छ।" }],
      },
      {
        word: "コメディ",
        meaning_en: "Comedy",
        meaning_np: "कमेडी",
        examples: [{ ja: "コメディはちょっと。", en: "I don't really like comedies.", np: "कमेडी त्यति मन पर्दैन।" }],
      },
      {
        word: "ファンタジー",
        meaning_en: "Fantasy",
        meaning_np: "फ्यान्टासी",
        examples: [],
      },
      {
        word: "ホラー",
        meaning_en: "Horror",
        meaning_np: "हरर",
        examples: [],
      },
      {
        word: "ミステリ",
        meaning_en: "Mystery",
        meaning_np: "मिस्ट्री",
        examples: [],
      },
      {
        word: "バレーボール",
        meaning_en: "Volleyball",
        meaning_np: "भलिबल",
        examples: [],
      },
      {
        word: "カフェ",
        meaning_en: "Cafe",
        meaning_np: "क्याफे",
        examples: [],
      },
    ],
  },
  {
    day: 3,
    words: [
      {
        word: "コインロッカー",
        meaning_en: "Storage lockers",
        meaning_np: "सामान राख्ने लकर",
        examples: [{ ja: "コインロッカーはありません。", en: "There are no storage lockers.", np: "यहाँ लकर छैन।" }],
      },
      {
        word: "コンセント",
        meaning_en: "Outlet/socket",
        meaning_np: "बिजुली सकेट",
        examples: [],
      },
      {
        word: "地下",
        meaning_en: "Underground level",
        meaning_np: "भुइँतल",
        examples: [{ ja: "ATMは地下です。", en: "The ATM is underground.", np: "ATM भुइँतलामा छ।" }],
      },
      {
        word: "お手洗い",
        meaning_en: "Restroom",
        meaning_np: "शौचालय",
        examples: [],
      },
      {
        word: "動画",
        meaning_en: "Videos",
        meaning_np: "भिडियो",
        examples: [{ ja: "おもしろい動画を見ます。", en: "I watch funny videos.", np: "म रमाइलो भिडियो हेर्छु।" }],
      },
      {
        word: "晴れ",
        meaning_en: "Sunny",
        meaning_np: "घाम लागेको",
        examples: [],
      },
      {
        word: "大好き",
        meaning_en: "Love, to love",
        meaning_np: "धेरै मन पर्नु",
        examples: [{ ja: "ケーキが大好きです。", en: "I love cake.", np: "मलाई केक धेरै मन पर्छ।" }],
      },
      {
        word: "ちゃんと",
        meaning_en: "Make sure / properly",
        meaning_np: "राम्ररी / ध्यानपूर्वक",
        examples: [{ ja: "ちゃんと昼ごはんも食べよう。", en: "Make sure to eat lunch too.", np: "दिउँसोको खाना पनि राम्ररी खाऊ।" }],
      },
    ],
  },
  {
    day: 4,
    words: [
      {
        word: "はたらく",
        meaning_en: "To work",
        meaning_np: "काम गर्नु",
        examples: [],
      },
      {
        word: "丸",
        meaning_en: "Circle",
        meaning_np: "गोलो",
        examples: [{ ja: "でかい大きな円を描いて。", en: "Draw a big circle.", np: "ठूलो गोलो कोर्नुहोस्।" }],
      },
      {
        word: "ヘッド",
        meaning_en: "Cleaning head (of a vacuum)",
        meaning_np: "मेसिनको टाउको",
        examples: [],
      },
      {
        word: "ハンドル",
        meaning_en: "Handle",
        meaning_np: "समाउने भाग",
        examples: [],
      },
      {
        word: "たまりだす",
        meaning_en: "To start accumulating",
        meaning_np: "जम्मा हुन थाल्नु",
        examples: [],
      },
      {
        word: "角",
        meaning_en: "Corner",
        meaning_np: "कुना",
        examples: [],
      },
      {
        word: "モップ",
        meaning_en: "Mop",
        meaning_np: "पोछा",
        examples: [],
      },
      {
        word: "ラグ",
        meaning_en: "Rag / floor cloth",
        meaning_np: "कपडा",
        examples: [],
      },
      {
        word: "交換する",
        meaning_en: "To replace / swap",
        meaning_np: "बदल्नु / परिवर्तन गर्नु",
        examples: [],
      },
      {
        word: "吸い込む",
        meaning_en: "To suck in (air/dust)",
        meaning_np: "तान्नु",
        examples: [],
      },
      {
        word: "乾く",
        meaning_en: "To dry",
        meaning_np: "सुक्नु",
        examples: [],
      },
      {
        word: "拭き掃除",
        meaning_en: "Wiping clean with a wet cloth",
        meaning_np: "भिजेको कपडाले पुछ्नु",
        examples: [],
      },
      {
        word: "乾拭き",
        meaning_en: "Dry wiping",
        meaning_np: "सुख्खा पुछाइ",
        examples: [],
      },
      {
        word: "便器",
        meaning_en: "Toilet bowl",
        meaning_np: "कमोड",
        examples: [],
      },
      {
        word: "手洗い台",
        meaning_en: "Handwash basin",
        meaning_np: "हातमुख धुने बेसिन",
        examples: [],
      },
      {
        word: "蛇口",
        meaning_en: "Tap / faucet",
        meaning_np: "धारो",
        examples: [],
      },
      {
        word: "人感センサー",
        meaning_en: "Human presence sensor",
        meaning_np: "मानव उपस्थिति सेन्सर",
        examples: [],
      },
      {
        word: "流す",
        meaning_en: "To flush / wash away",
        meaning_np: "बगाउनु",
        examples: [],
      },
    ],
  },
  {
    day: 5,
    words: [
      {
        word: "家事",
        meaning_en: "Housework",
        meaning_np: "घरको काम",
        examples: [],
      },
      {
        word: "はじめてです",
        meaning_en: "It's my first time",
        meaning_np: "पहिलो पटक हो",
        examples: [],
      },
      {
        word: "おすすめは何ですか",
        meaning_en: "What do you recommend?",
        meaning_np: "के सुझाव दिनुहुन्छ?",
        examples: [],
      },
      {
        word: "カードで払いですか",
        meaning_en: "Can I pay by card?",
        meaning_np: "कार्डले तिर्न सकिन्छ?",
        examples: [],
      },
      {
        word: "もう一度おねがいします",
        meaning_en: "One more time, please",
        meaning_np: "एकपटक फेरि गर्नुहोस्",
        examples: [],
      },
      {
        word: "やばくない？",
        meaning_en: "Isn't that crazy?",
        meaning_np: "अचम्मको होइन?",
        examples: [],
      },
      {
        word: "信じられない",
        meaning_en: "I can't believe it",
        meaning_np: "विश्वास गर्न सकिन्न",
        examples: [],
      },
      {
        word: "嘘でしょ？",
        meaning_en: "Are you kidding me?",
        meaning_np: "झुट होइन?",
        examples: [],
      },
      {
        word: "ありえない！",
        meaning_en: "No way!",
        meaning_np: "हुनै सक्दैन!",
        examples: [],
      },
      {
        word: "え、マジで",
        meaning_en: "Wait, seriously?",
        meaning_np: "के साँच्चिकै?",
        examples: [],
      },
      {
        word: "ほっといてください",
        meaning_en: "Leave me alone",
        meaning_np: "मलाई एक्लै छोड्नुहोस्",
        examples: [{ ja: "おねがいですからほっといてください。", en: "Please leave me alone.", np: "कृपया मलाई एक्लै छोड्नुहोस्।" }],
      },
      {
        word: "お持ち帰りできますか",
        meaning_en: "Can I take this to go?",
        meaning_np: "यो लिएर जान सकिन्छ?",
        examples: [],
      },
      {
        word: "お会計おねがいします",
        meaning_en: "Can I get the bill, please?",
        meaning_np: "बिल दिनुहोस् न",
        examples: [],
      },
    ],
  },
  {
    day: 6,
    words: [
      {
        word: "どんな感じになりましたか",
        meaning_en: "How did it turn out?",
        meaning_np: "कस्तो भयो?",
        examples: [],
      },
      {
        word: "まあまあでおきました",
        meaning_en: "It turned out okay",
        meaning_np: "ठीकठाक भयो",
        examples: [],
      },
      {
        word: "彼女のことを心配しています",
        meaning_en: "I worry about her",
        meaning_np: "म उनको बारेमा चिन्तित छु",
        examples: [],
      },
      {
        word: "町で会いました",
        meaning_en: "Met in town",
        meaning_np: "सहरमा भेट भयो",
        examples: [],
      },
      {
        word: "スマホの電池が切れそうです",
        meaning_en: "Phone battery is about to die",
        meaning_np: "मोबाइलको ब्याट्री सकिन लाग्यो",
        examples: [],
      },
      {
        word: "ちょっと待ってください",
        meaning_en: "Wait a sec",
        meaning_np: "अलिकति पर्खनुहोस्",
        examples: [],
      },
    ],
  },
  {
    day: 7,
    words: [
      {
        word: "紹介します",
        meaning_en: "To introduce",
        meaning_np: "परिचय गर्नु",
        examples: [],
      },
      {
        word: "案内します",
        meaning_en: "To guide, show around",
        meaning_np: "गाइड गर्नु",
        examples: [],
      },
      {
        word: "説明します",
        meaning_en: "To explain",
        meaning_np: "व्याख्या गर्नु",
        examples: [],
      },
      {
        word: "調べます",
        meaning_en: "To check, investigate",
        meaning_np: "अनुसन्धान गर्नु",
        examples: [],
      },
      {
        word: "弱い",
        meaning_en: "Weak",
        meaning_np: "कमजोर",
        examples: [],
      },
      {
        word: "交番",
        meaning_en: "Police box",
        meaning_np: "प्रहरी बक्स",
        examples: [],
      },
      {
        word: "計画",
        meaning_en: "Plan",
        meaning_np: "योजना",
        examples: [],
      },
      {
        word: "お知らせ",
        meaning_en: "Notice / announcement",
        meaning_np: "सूचना",
        examples: [],
      },
      {
        word: "スケジュール",
        meaning_en: "Schedule",
        meaning_np: "तालिका",
        examples: [],
      },
      {
        word: "相談します",
        meaning_en: "To consult, discuss",
        meaning_np: "परामर्श गर्नु",
        examples: [],
      },
      {
        word: "決めます",
        meaning_en: "To decide",
        meaning_np: "निर्णय गर्नु",
        examples: [],
      },
      {
        word: "集めます／まとめます",
        meaning_en: "To gather / collect",
        meaning_np: "जम्मा गर्नु",
        examples: [],
      },
      {
        word: "戻ります",
        meaning_en: "To go back, return",
        meaning_np: "फर्कनु",
        examples: [],
      },
      {
        word: "出発します",
        meaning_en: "To depart",
        meaning_np: "प्रस्थान गर्नु",
        examples: [],
      },
      {
        word: "到着します",
        meaning_en: "To arrive",
        meaning_np: "आइपुग्नु",
        examples: [],
      },
      {
        word: "ただいま",
        meaning_en: "I'm home",
        meaning_np: "म आएँ",
        examples: [],
      },
    ],
  },
  {
    day: 8,
    words: [
      {
        word: "発音",
        meaning_en: "Pronunciation",
        meaning_np: "उच्चारण",
        examples: [],
      },
      {
        word: "もうしわけありません",
        meaning_en: "I am very sorry / Please excuse me",
        meaning_np: "म माफी माग्छु",
        examples: [],
      },
      {
        word: "国連",
        meaning_en: "United Nations",
        meaning_np: "संयुक्त राष्ट्र संघ",
        examples: [],
      },
      {
        word: "調査",
        meaning_en: "Investigation, survey",
        meaning_np: "अनुसन्धान",
        examples: [],
      },
      {
        word: "収入",
        meaning_en: "Income",
        meaning_np: "आय",
        examples: [],
      },
      {
        word: "理由",
        meaning_en: "Reason",
        meaning_np: "कारण",
        examples: [],
      },
      {
        word: "基本的",
        meaning_en: "Standard, basic",
        meaning_np: "आधारभूत",
        examples: [],
      },
      {
        word: "つまらない",
        meaning_en: "Boring",
        meaning_np: "उबाउलो",
        examples: [],
      },
      {
        word: "おかげさまで",
        meaning_en: "Thanks to you (set phrase)",
        meaning_np: "तपाईंको कृपाले",
        examples: [],
      },
      {
        word: "聞きましょう",
        meaning_en: "Let's ask / listen",
        meaning_np: "सोधौँ / सुनौँ",
        examples: [],
      },
      {
        word: "もっと",
        meaning_en: "More",
        meaning_np: "अझ बढी",
        examples: [{ ja: "もっと大きいのを買いましょう！", en: "Let's buy a bigger one!", np: "अझ ठूलो किनौँ!" }],
      },
      {
        word: "しょっぱい",
        meaning_en: "Salty",
        meaning_np: "नुनिलो",
        examples: [],
      },
      {
        word: "コーラ",
        meaning_en: "Cola",
        meaning_np: "कोला",
        examples: [],
      },
      {
        word: "とんかつ",
        meaning_en: "Pork cutlets",
        meaning_np: "सुँगुरको कटलेट",
        examples: [],
      },
      {
        word: "でも",
        meaning_en: "But, though, however",
        meaning_np: "तर",
        examples: [],
      },
      {
        word: "かっこいい",
        meaning_en: "Cool, stylish",
        meaning_np: "कुल / स्टाइलिश",
        examples: [],
      },
      {
        word: "ライオン",
        meaning_en: "Lion",
        meaning_np: "सिंह",
        examples: [],
      },
      {
        word: "ガーデニング",
        meaning_en: "Gardening",
        meaning_np: "बगैँचा",
        examples: [],
      },
      {
        word: "料理",
        meaning_en: "Cooking",
        meaning_np: "खाना पकाउनु",
        examples: [{ ja: "料理は楽しいです。", en: "Cooking is fun.", np: "खाना पकाउनु रमाइलो छ।" }],
      },
      {
        word: "ストレッチ",
        meaning_en: "Stretches",
        meaning_np: "स्ट्रेच",
        examples: [],
      },
    ],
  },
];
