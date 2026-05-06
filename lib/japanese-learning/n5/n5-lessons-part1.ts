import type { N5LessonSpec } from "@/lib/japanese-learning/n5/build-japanese-detail";
import { mkLesson as mk } from "@/lib/japanese-learning/n5/n5-lesson-factory";

/** Days 1–7 — Minna I Lessons 1–7 (split across files for maintainability). */
export const JP_N5_PART1: N5LessonSpec[] = [
  mk({
    minnaLesson: 1,
    dialogue: [
      {
        ja: "はじめまして。ワットです。イギリスじんです。",
        reading: "Hajimemashite. Watto desu. Igirisujin desu.",
        en: "Nice to meet you. I'm Watt. I'm British.",
      },
      {
        ja: "どうぞよろしくおねがいします。",
        reading: "Dōzo yoroshiku onegaishimasu.",
        en: "Pleased to meet you / please treat me well.",
      },
    ],
    particles: [
      { particle: "は", note: { en: "Topic marker: X は Y です = 'As for X, it is Y.'", np: "विषय सूचक: X は Y です = 'X को सन्दर्भमा, Y हो।'", jp: "主題助詞：Xは Yです＝「Xについて言えば、Yです」" } },
      { particle: "か", note: { en: "Question particle at the end of polite questions.", np: "विनम्र प्रश्नको अन्तमा राखिने प्रश्नवाचक शब्द।", jp: "丁寧な疑問文の文末に置く疑問の助詞。" } },
      { particle: "の", note: { en: "Connects nouns: イギリスじん = 'British person'.", np: "नामहरू जोड्छ: イギリスじん = 'बेलायती व्यक्ति'।", jp: "名詞をつなぐ助詞：イギリスじん＝「イギリス人」。" } },
    ],
    grammarBullets: [
      { en: "Copula です for polite statements; drop for casual later.", np: "विनम्र कथनका लागि です (copula); अनौपचारिकमा पछि हटाइन्छ।", jp: "丁寧な文の述語「です」は、くだけた話し方では省略されます。" },
      { en: "だれですか / なんですか for 'who / what' information questions.", np: "だれですか / なんですか — 'को हो / के हो' भन्ने जानकारी प्रश्न।", jp: "「だれですか」「なんですか」は「誰・何」を尋ねる疑問文。" },
      { en: "Nationality/occupation pattern: Xじんです · Xです as identification.", np: "राष्ट्रियता/पेसा ढाँचा: Xじんです · Xです पहिचानका लागि।", jp: "国籍・職業の言い方：Xじんです・Xですで自己紹介する。" },
    ],
    grammarTable: {
      caption: { en: "Basic patterns", np: "आधारभूत ढाँचाहरू", jp: "基本パターン" },
      headers: [{ en: "Pattern", np: "ढाँचा", jp: "パターン" }, { en: "Meaning", np: "अर्थ", jp: "意味" }],
      rows: [
        ["A は B です。", { en: "A is B.", np: "A, B हो।", jp: "AはBです。" }],
        ["A は B ですか。", { en: "Is A B?", np: "A, B हो?", jp: "AはBですか。" }],
      ],
    },
    mcqs: [
      {
        question: { en: "Choose the natural introduction:", np: "स्वाभाविक परिचय छान्नुहोस्:", jp: "自然な自己紹介を選んでください：" },
        choices: [
          "わたしはイギリスじんです。",
          "わたしイギリスじんです。",
          "わたしがイギリスじんですか。",
          "わたしもイギリスじんですか。",
        ],
        correctIndex: 0,
        explanation: { en: "Topic は + です is the textbook polite pattern.", np: "विषय は + です पाठ्यपुस्तकको विनम्र ढाँचा हो।", jp: "主題助詞は＋ですは教科書の丁寧体の定番パターンです。" },
      },
      {
        question: { en: "Which sentence is a yes/no question?", np: "कुन वाक्य हाँ/होइन प्रश्न हो?", jp: "どれがはい・いいえで答える疑問文ですか？" },
        choices: [
          "がくせいです。",
          "がくせいですか。",
          "がくせいじゃありません。",
          "がくせいでした。",
        ],
        correctIndex: 1,
        explanation: { en: "Adding か to a polite statement turns it into a yes/no question.", np: "विनम्र कथनमा か थप्दा हाँ/होइन प्रश्न बन्छ।", jp: "丁寧な文末に「か」をつけると、はい・いいえの疑問文になります。" },
      },
    ],
    listening: {
      scenario: { en: "Two classmates introduce names and countries after class; names repeat slowly.", np: "कक्षापछि दुई सहपाठीहरू आफ्नो नाम र देश परिचय दिन्छन्; नामहरू ढिलो दोहोरिन्छन्।", jp: "放課後、クラスメートが名前と出身国を紹介し合う。名前はゆっくりくり返される。" },
      instruction: { en: "Listen twice; note each speaker's country word (〜じん). Ignore fillers like ええと.", np: "दुई पटक सुन्नुहोस्; प्रत्येक वक्ताको देश शब्द (〜じん) नोट गर्नुहोस्। ええと जस्ता फिलर शब्द बेवास्ता गर्नुहोस्।", jp: "2回聞いて、各話者の国籍（〜じん）をメモしましょう。「ええと」などのフィラーは無視。" },
      keyPhrases: ["はじめまして", "〜じんです", "どうぞよろしく"],
      studyTip: { en: "Shadow at 0.9× speed from textbook audio if available.", np: "पाठ्यपुस्तकको अडियो उपलब्ध भएमा ०.९× गतिमा छायाँ गर्नुहोस्।", jp: "教科書の音声がある場合は0.9倍速でシャドーイングしましょう。" },
      qna: {
        situation: {
          en: "Two students meet for the first time after Japanese class. Listen carefully and answer the questions.",
          np: "जापानी कक्षापछि दुई विद्यार्थी पहिलो पटक भेट्छन्। ध्यानले सुन्नुहोस् र प्रश्नहरूको उत्तर दिनुहोस्।",
          jp: "日本語のクラスのあと、ふたりの学生がはじめて会います。よく聞いて、しつもんに答えてください。",
        },
        script:
          "たなか：はじめまして。たなかです。がくせいです。どうぞよろしくおねがいします。" +
          "スミス：はじめまして。スミスです。アメリカじんです。こちらこそ、どうぞよろしくおねがいします。" +
          "たなか：スミスさんは、がくせいですか。" +
          "スミス：いいえ、わたしはかいしゃいんです。たなかさんは？" +
          "たなか：わたしはがくせいです。にほんじんです。",
        transcript:
          "たなか：はじめまして。たなかです。がくせいです。どうぞよろしくおねがいします。\n" +
          "スミス：はじめまして。スミスです。アメリカじんです。こちらこそ、どうぞよろしくおねがいします。\n" +
          "たなか：スミスさんは、がくせいですか。\n" +
          "スミス：いいえ、わたしはかいしゃいんです。たなかさんは？\n" +
          "たなか：わたしはがくせいです。にほんじんです。",
        questions: [
          {
            question: {
              en: "What nationality is Smith?",
              np: "स्मिथसान कुन देशको हुन्?",
              jp: "スミスさんはどこのくにのひとですか。",
            },
            choices: [
              { en: "にほんじん", np: "जापानी", jp: "にほんじん" },
              { en: "アメリカじん", np: "अमेरिकी", jp: "アメリカじん" },
              { en: "イギリスじん", np: "बेलायती", jp: "イギリスじん" },
              { en: "ブラジルじん", np: "ब्राजिली", jp: "ブラジルじん" },
            ],
            correctIndex: 1,
            explanation: {
              en: "Smith says 「アメリカじんです」— 'I am American.' The particle は marks the topic; じん means 'person from ~'.",
              np: "स्मिथले 「アメリカじんです」 भन्छन् — 'म अमेरिकी हुँ।' は ले विषय जनाउँछ; じん को अर्थ '~ देशको मान्छे' हो।",
              jp: "スミスさんは「アメリカじんです」と言っています。「は」は主題助詞で、「じん」は「〜国の人」を意味します。",
            },
          },
          {
            question: {
              en: "What is Smith's occupation?",
              np: "स्मिथसानको पेसा के हो?",
              jp: "スミスさんのしごとはなんですか。",
            },
            choices: [
              { en: "がくせい", np: "विद्यार्थी", jp: "がくせい" },
              { en: "せんせい", np: "शिक्षक", jp: "せんせい" },
              { en: "かいしゃいん", np: "कम्पनी कर्मचारी", jp: "かいしゃいん" },
              { en: "いしゃ", np: "डाक्टर", jp: "いしゃ" },
            ],
            correctIndex: 2,
            explanation: {
              en: "Smith answers 「いいえ、わたしはかいしゃいんです」— 'No, I am a company employee.' いいえ negates the yes/no question asking if Smith is a student.",
              np: "स्मिथले 「いいえ、わたしはかいしゃいんです」 जवाफ दिन्छन् — 'होइन, म कम्पनी कर्मचारी हुँ।' いいえ ले विद्यार्थी हो/होइन भन्ने प्रश्नलाई नकार्छ।",
              jp: "スミスさんは「いいえ、わたしはかいしゃいんです」と答えています。「いいえ」はがくせいかどうかの質問を否定しています。",
            },
          },
          {
            question: {
              en: "What is Tanaka's occupation?",
              np: "तानाकासानको पेसा के हो?",
              jp: "たなかさんのしごとはなんですか。",
            },
            choices: [
              { en: "かいしゃいん", np: "कम्पनी कर्मचारी", jp: "かいしゃいん" },
              { en: "せんせい", np: "शिक्षक", jp: "せんせい" },
              { en: "いしゃ", np: "डाक्टर", jp: "いしゃ" },
              { en: "がくせい", np: "विद्यार्थी", jp: "がくせい" },
            ],
            correctIndex: 3,
            explanation: {
              en: "Tanaka introduces himself with 「がくせいです」at the very start, and confirms again at the end 「わたしはがくせいです」.",
              np: "तानाकाले सुरुमै 「がくせいです」 भनेर परिचय दिन्छन्, र अन्तमा फेरि 「わたしはがくせいです」 भनेर पुष्टि गर्छन्।",
              jp: "たなかさんは最初に「がくせいです」と自己紹介し、最後に「わたしはがくせいです」と確認しています。",
            },
          },
        ],
      },
    },
  }),
  mk({
    minnaLesson: 2,
    dialogue: [
      {
        ja: "これはじしょです。あれはびょういんです。",
        reading: "Kore wa jisho desu. Are wa byoin desu.",
        en: "This is a dictionary. That (over there) is a hospital.",
      },
      {
        ja: "それはいくらですか。",
        reading: "Sore wa ikura desu ka.",
        en: "How much is that?",
      },
    ],
    particles: [
      { particle: "これ・それ・あれ", note: { en: "Demonstratives by distance from speaker/listener.", np: "वक्ता/श्रोताबाट दूरी अनुसार संकेतवाचक शब्दहरू।", jp: "話し手・聞き手からの距離で使い分ける指示語。" } },
      { particle: "この・その・あの + N", note: { en: "Which thing — near me / near you / away.", np: "कुन वस्तु — मेरो नजिक / तपाईंको नजिक / टाढा।", jp: "どの物か — 私の近く・あなたの近く・離れたところ。" } },
      { particle: "も", note: { en: "Also / too — replaces は when adding another topic.", np: "पनि — अर्को विषय थप्दा は को ठाउँमा आउँछ।", jp: "「も」は「は」の代わりに使い、別の話題を追加する。" } },
    ],
    grammarBullets: [
      { en: "これは〜です vs この〜は〜です (pronoun vs noun modifier).", np: "これは〜です र この〜は〜です को फरक (सर्वनाम बनाम संज्ञा संशोधक)।", jp: "「これは〜です」と「この〜は〜です」の違い（代名詞 vs 名詞修飾語）。" },
      { en: "いくらですか for prices; 〜えん with numbers.", np: "मूल्यका लागि いくらですか; संख्यासँग 〜えん।", jp: "値段は「いくらですか」で聞き、数字に「〜円」をつける。" },
    ],
    mcqs: [
      {
        question: { en: "Ask 'How much is this?' politely:", np: "'यो कति हो?' विनम्र रूपमा सोध्नुहोस्:", jp: "丁寧に値段を聞くには：" },
        choices: ["これはいくらです。", "これはいくらですか。", "これいくら。", "これがいくらですか。"],
        correctIndex: 1,
        explanation: { en: "Adding か turns the statement into a polite question.", np: "か थप्दा कथन विनम्र प्रश्न बन्छ।", jp: "文末に「か」をつけると丁寧な疑問文になります。" },
      },
      {
        question: { en: "Talk about something near the listener:", np: "श्रोताको नजिककोबारे कुरा गर्नुहोस्:", jp: "聞き手の近くのものを指すには：" },
        choices: ["これ", "それ", "あれ", "どれ"],
        correctIndex: 1,
        explanation: { en: "それ refers to things near the listener, これ near the speaker, あれ away from both.", np: "それ श्रोताको नजिककालागि, これ वक्ताको नजिककालागि, あれ दुवैबाट टाढाकालागि।", jp: "それは聞き手の近く、これは話し手の近く、あれは両者から離れた物を指す。" },
      },
    ],
    listening: {
      scenario: { en: "Shop dialogue: clerk points at items with これ／それ and states prices.", np: "पसलको संवाद: कर्मचारीले これ／それ ले सामान देखाउँछ र मूल्य भन्छ।", jp: "店内会話：店員がこれ・それで商品を指して値段を言う。" },
      instruction: { en: "Catch numbers + えん; notice polite store endings です.", np: "संख्या + えん पक्रनुहोस्; पसलको विनम्र ending です मा ध्यान दिनुहोस्।", jp: "数字＋円を聞き取り、丁寧な語尾「です」に注目しましょう。" },
      keyPhrases: ["いくら", "えん", "それ"],
    },
  }),
  mk({
    minnaLesson: 3,
    dialogue: [
      {
        ja: "つくえのうえにほんがあります。",
        reading: "Tsukue no ue ni hon ga arimasu.",
        en: "There is a book on the desk.",
      },
      {
        ja: "かばんのなかにケータイがありますか。",
        reading: "Kaban no naka ni ketai ga arimasu ka.",
        en: "Is there a phone in the bag?",
      },
    ],
    particles: [
      { particle: "に", note: { en: "Location of existence with ある／いる.", np: "ある／いる सँग अस्तित्वको स्थान।", jp: "ある・いるの存在文における場所を示す助詞。" } },
      { particle: "が", note: { en: "Introduces new information in existence sentences.", np: "अस्तित्व वाक्यमा नयाँ जानकारी परिचय गराउँछ।", jp: "存在文で新情報を導入する助詞。" } },
      { particle: "の", note: { en: "Possession / modification: つくえのうえ (top of desk).", np: "स्वामित्व / संशोधन: つくえのうえ (मेजको माथि)।", jp: "所有・修飾：つくえのうえ（机の上）。" } },
    ],
    grammarBullets: [
      { en: "ある for inanimate things; いる for people/animals (covered fully in L10).", np: "ある निर्जीव वस्तुका लागि; いる मानिस/जनावरका लागि (L10 मा पूर्ण रूपमा)।", jp: "「ある」は無生物、「いる」は人や動物（L10で詳しく）。" },
      { en: "Position words: うえ／した／なか／となり／まえ／うしろ.", np: "स्थान शब्दहरू: うえ／した／なか／となり／まえ／うしろ।", jp: "位置を表す言葉：うえ・した・なか・となり・まえ・うしろ。" },
    ],
    mcqs: [
      {
        question: { en: "Choose the natural existence sentence:", np: "स्वाभाविक अस्तित्व वाक्य छान्नुहोस्:", jp: "自然な存在文を選んでください：" },
        choices: [
          "つくえにほんです。",
          "つくえにほんがあります。",
          "つくえでほんがあります。",
          "つくえがほんがあります。",
        ],
        correctIndex: 1,
        explanation: { en: "Location に + subject が + あります is the standard existence frame.", np: "स्थान に + कर्ता が + あります मानक अस्तित्व ढाँचा हो।", jp: "場所に＋主語が＋あります が存在文の基本構造です。" },
      },
      {
        question: { en: "Particle after location for あります:", np: "あります को लागि स्थानपछि जोड्ने शब्द:", jp: "あります の前の場所に付く助詞は：" },
        choices: ["は", "が", "に", "を"],
        correctIndex: 2,
        explanation: { en: "Place に marks where things exist — に not で because nothing is moving.", np: "वस्तु कहाँ छ भन्न に; वस्तु चलिरहेको छैन त्यसैले で होइन।", jp: "存在の場所はに。「で」は動作の場所なので使えない。" },
      },
    ],
    listening: {
      scenario: { en: "Room description: several items placed at various locations.", np: "कोठाको वर्णन: विभिन्न स्थानमा राखिएका धेरै सामानहरू।", jp: "部屋の説明：さまざまな場所に置かれた複数の物。" },
      instruction: { en: "Map each item to its location (うえ／なか／となり).", np: "प्रत्येक सामानलाई स्थानसँग मिलाउनुहोस् (うえ／なか／となり)।", jp: "各物と場所（うえ・なか・となり）を対応させましょう。" },
      keyPhrases: ["あります", "に", "のうえ"],
    },
  }),
  mk({
    minnaLesson: 4,
    dialogue: [
      {
        ja: "まいにちジムでべんきょうします。きのうはビールをのみました。",
        reading: "Mainichi jimu de benkyo shimasu. Kino wa biru o nomimashita.",
        en: "I study at the gym every day. Yesterday I drank beer.",
      },
    ],
    particles: [
      { particle: "を", note: { en: "Direct object marker with transitive verbs.", np: "संक्रमक क्रियासँग प्रत्यक्ष कर्म सूचक।", jp: "他動詞と使う直接目的語を示す格助詞。" } },
      { particle: "で", note: { en: "Place of action: ジムで (at the gym).", np: "क्रियाको स्थान: ジムで (जिममा)।", jp: "動作が行われる場所：ジムで。" } },
      { particle: "に", note: { en: "Time point (e.g. specific clock times): refined in later lessons.", np: "समय बिन्दु (जस्तै विशिष्ट घडीको समय): पछिका पाठमा थप।", jp: "時点（例：特定の時刻）を示す。後の課で詳しく学ぶ。" } },
    ],
    grammarBullets: [
      { en: "ます／ません／ました／ませんでした — polite present/past affirmative/negative.", np: "ます／ません／ました／ませんでした — विनम्र वर्तमान/भूत अनुकूलात्मक/नकारात्मक।", jp: "ます・ません・ました・ませんでした——丁寧体の現在・過去・肯定・否定。" },
      { en: "Frequency adverbs like まいにち／ときどき precede the verb.", np: "まいにち／ときどき जस्ता आवृत्ति क्रियाविशेषण क्रिया अघि आउँछ।", jp: "「まいにち」「ときどき」など頻度の副詞は動詞の前に置く。" },
    ],
    grammarTable: {
      headers: [{ en: "Form", np: "रूप", jp: "形" }, { en: "Use", np: "प्रयोग", jp: "用途" }],
      rows: [
        ["Vます", { en: "present affirmative polite", np: "विनम्र वर्तमान अनुकूलात्मक", jp: "丁寧体・現在肯定" }],
        ["Vません", { en: "present negative polite", np: "विनम्र वर्तमान नकारात्मक", jp: "丁寧体・現在否定" }],
        ["Vました", { en: "past affirmative polite", np: "विनम्र भूत अनुकूलात्मक", jp: "丁寧体・過去肯定" }],
      ],
    },
    mcqs: [
      {
        question: { en: "Past affirmative of のむ:", np: "のむ को भूत अनुकूलात्मक:", jp: "「のむ」の過去肯定形は：" },
        choices: ["のみます", "のみません", "のみました", "のみませんでした"],
        correctIndex: 2,
        explanation: { en: "Past polite affirmative: verb stem + ました.", np: "भूत विनम्र अनुकूलात्मक: क्रिया मूल + ました।", jp: "丁寧体の過去肯定：動詞の語幹＋ました。" },
      },
      {
        question: { en: "Object marker with たべます:", np: "たべます सँग कर्म सूचक:", jp: "「たべます」の目的格助詞は：" },
        choices: ["は", "が", "を", "に"],
        correctIndex: 2,
        explanation: { en: "を marks the direct object of action verbs.", np: "を क्रियाको प्रत्यक्ष कर्म चिन्ह लगाउँछ।", jp: "「を」は動作動詞の直接目的語を示す。" },
      },
    ],
    listening: {
      scenario: { en: "Daily routine monologue with a yesterday contrast.", np: "हिजोसँग तुलना गरिएको दैनिक दिनचर्याको एकालाप।", jp: "きのうと対比させた日課のモノローグ。" },
      instruction: { en: "Note which actions are today (ます) vs yesterday (ました).", np: "कुन क्रियाहरू आज (ます) र कुन हिजो (ました) हो नोट गर्नुहोस्।", jp: "今日の行動（ます）ときのうの行動（ました）を聞き分けましょう。" },
      keyPhrases: ["ます", "ました", "きのう"],
    },
  }),
  mk({
    minnaLesson: 5,
    dialogue: [
      {
        ja: "あしたオフィスへいきます。ちかてつでいきます。",
        reading: "Ashita ofisu e ikimasu. Chikatetsu de ikimasu.",
        en: "Tomorrow I'll go to the office. I'll go by subway.",
      },
    ],
    particles: [
      { particle: "へ", note: { en: "Direction toward a destination (overlaps with に for movement).", np: "गन्तव्यतर्फ दिशा (movement को लागि に सँग आंशिक overlap)।", jp: "目的地への方向を示す（移動の「に」と重複する場合がある）。" } },
      { particle: "で", note: { en: "Means of transport: train, bus, foot, car.", np: "यातायातको साधन: ट्रेन, बस, खुट्टा, कार।", jp: "交通手段：電車・バス・徒歩・車など。" } },
      { particle: "と", note: { en: "Companion — with someone.", np: "साथी — कसैसँग।", jp: "同伴者を示す——誰かと一緒に。" } },
    ],
    grammarBullets: [
      { en: "いく／くる／かえる are movement verbs that take destination or origin.", np: "いく／くる／かえる गन्तव्य वा उत्पत्तिसँगको आवागमन क्रियाहरू हुन्।", jp: "いく・くる・かえる——目的地または出発地を伴う移動動詞。" },
      { en: "Time words like あした／きょう／きのう come before the predicate.", np: "あした／きょう／きのう जस्ता समय शब्दहरू विधेय अघि आउँछन्।", jp: "あした・きょう・きのうなどの時間語は述語の前に置く。" },
    ],
    mcqs: [
      {
        question: { en: "Natural sentence for 'go by bus':", np: "'बसले जाने' स्वाभाविक वाक्य:", jp: "「バスで行く」の自然な文は：" },
        choices: [
          "バスでいきます。",
          "バスにいきます。",
          "バスへいきます。",
          "バスをいきます。",
        ],
        correctIndex: 0,
        explanation: { en: "で marks the means (transport used). に and へ mark direction, not the vehicle.", np: "で साधन (प्रयोग गरिएको यातायात) चिन्ह लगाउँछ। に र へ दिशा चिन्ह लगाउँछन्, सवारी साधन होइन।", jp: "「で」は手段（乗り物）を示す。「に」「へ」は方向で、乗り物ではない。" },
      },
      {
        question: { en: "へ marks:", np: "へ चिन्ह लगाउँछ:", jp: "「へ」が示すのは：" },
        choices: [{ en: "topic", np: "विषय", jp: "話題" }, { en: "goal direction", np: "लक्ष्य दिशा", jp: "目標の方向" }, { en: "reason", np: "कारण", jp: "理由" }, { en: "past tense", np: "भूतकाल", jp: "過去時制" }],
        correctIndex: 1,
        explanation: { en: "へ indicates direction toward a destination.", np: "へ गन्तव्यतर्फको दिशा देखाउँछ।", jp: "「へ」は目的地への方向を示す。" },
      },
    ],
    listening: {
      scenario: { en: "A friend explains their commute method and tomorrow's plan.", np: "साथीले आउजाउको तरिका र भोलिको योजना बताउँछ।", jp: "友だちが通勤の手段とあしたの計画を説明する。" },
      instruction: { en: "Identify the destination word and transport particle で.", np: "गन्तव्य शब्द र यातायात जोड्ने शब्द で पहिचान गर्नुहोस्।", jp: "目的地の語と交通手段の「で」を聞き取りましょう。" },
      keyPhrases: ["へ", "で", "あした"],
    },
  }),
  mk({
    minnaLesson: 6,
    dialogue: [
      {
        ja: "コーヒーをのみます。パンをたべます。レストランでコーヒーをのみます。",
        reading: "Kohi o nomimasu. Pan o tabemasu. Resutoran de kohi o nomimasu.",
        en: "I drink coffee. I eat bread. I drink coffee at a restaurant.",
      },
    ],
    particles: [
      { particle: "を", note: { en: "Direct object — marks the thing acted upon.", np: "प्रत्यक्ष कर्म — काम गरिने वस्तु चिन्ह लगाउँछ।", jp: "直接目的語——動作の対象となるものをマークする。" } },
      { particle: "で", note: { en: "Location where an action happens (eat / drink / study).", np: "क्रिया हुने स्थान (खाने/पिउने/पढ्ने)।", jp: "動作が行われる場所（食べる・飲む・勉強するなど）。" } },
    ],
    grammarBullets: [
      { en: "Transitive verb frames: [NP を] Vます.", np: "संक्रमक क्रिया ढाँचा: [NP を] Vます।", jp: "他動詞の構文：[名詞句を]Vます。" },
      { en: "で (action location) vs に (existence location) — key distinction.", np: "で (क्रिया स्थान) र に (अस्तित्व स्थान) — मुख्य भेद।", jp: "「で」（動作の場所）と「に」（存在の場所）の使い分け——重要。" },
    ],
    mcqs: [
      {
        question: { en: "Correct particle: みず___ のみます。", np: "सही जोड्ने शब्द: みず___ のみます。", jp: "正しい助詞：みず___のみます。" },
        choices: ["は", "が", "を", "で"],
        correctIndex: 2,
        explanation: { en: "を marks the thing being drunk — the direct object of のむ.", np: "を पिइने वस्तु — のむ को प्रत्यक्ष कर्म — चिन्ह लगाउँछ।", jp: "「を」は飲む対象（直接目的語）を示す。" },
      },
      {
        question: { en: "Eat at home:", np: "घरमा खाने:", jp: "「家でパンを食べます」を正しく言うと：" },
        choices: ["いえでパンをたべます。", "いえにパンをたべます。", "いえへパンをたべます。", "いえがパンをたべます。"],
        correctIndex: 0,
        explanation: { en: "で marks the place where eating happens; に would mean 'going to / existence at the house'.", np: "で खाने ठाउँ चिन्ह लगाउँछ; に ले 'घरतर्फ जाने / घरमा अवस्थान' भन्छ।", jp: "「で」は動作の場所；「に」だと「家に行く・家にいる」の意味になる。" },
      },
    ],
    listening: {
      scenario: { en: "Ordering simple food and drink in a cafe.", np: "क्याफेमा साधारण खाना र पेय अर्डर गर्ने।", jp: "カフェで簡単な食べ物・飲み物を注文する。" },
      instruction: { en: "Catch item nouns, then the particles を and で.", np: "वस्तु नामहरू, त्यसपछि जोड्ने शब्द を र で पक्रनुहोस्।", jp: "物の名詞と助詞「を」「で」を聞き取りましょう。" },
      keyPhrases: ["をのみます", "で", "ください"],
    },
  }),
  mk({
    minnaLesson: 7,
    dialogue: [
      {
        ja: "ともだちにケーキをあげました。せんせいにほんをもらいました。",
        reading: "Tomodachi ni keki o agemashita. Sensei ni hon o moraimashita.",
        en: "I gave a cake to a friend. I received a book from the teacher.",
      },
    ],
    particles: [
      { particle: "に", note: { en: "Recipient (for あげる) or source (for もらう) person.", np: "प्राप्तकर्ता (あげるका लागि) वा स्रोत (もらうका लागि) व्यक्ति।", jp: "あげる・もらうなどの授受動詞で受け手または渡し手を示す。" } },
      { particle: "を", note: { en: "The thing given or received.", np: "दिइएको वा पाइएको वस्तु।", jp: "あげる・もらうの対象となる物を示す。" } },
    ],
    grammarBullets: [
      { en: "あげます (I/we give outward) vs もらいます (I/we receive) — viewpoint is key.", np: "あげます (बाहिरतर्फ दिने) र もらいます (पाउने) — दृष्टिकोण महत्त्वपूर्ण छ।", jp: "あげます（外向きに与える）ともらいます（受け取る）——視点が重要。" },
      { en: "もう〜ました — already-completed nuance.", np: "もう〜ました — पहिले नै पूरा भएको भाव।", jp: "もう〜ました——すでに完了したことを示すニュアンス。" },
    ],
    mcqs: [
      {
        question: { en: "'I received flowers from my mother.' Natural verb:", np: "'आमाबाट फूल पाएँ।' स्वाभाविक क्रिया:", jp: "「母から花を受け取った」の自然な動詞は：" },
        choices: ["あげました", "もらいました", "くれました", "あげます"],
        correctIndex: 1,
        explanation: { en: "もらいました = speaker received (inward direction). あげました = speaker gave (outward).", np: "もらいました = वक्ताले पायो (भित्रतर्फ)। あげました = वक्ताले दियो (बाहिरतर्फ)।", jp: "もらいました＝話し手が受け取る（内向き）。あげました＝話し手が与える（外向き）。" },
      },
      {
        question: { en: "Particle marking the giver with もらいます:", np: "もらいます सँग दिने व्यक्ति चिन्ह लगाउने जोड्ने शब्द:", jp: "「もらいます」で渡し手を示す助詞は：" },
        choices: ["を", "に／から", "で", "へ"],
        correctIndex: 1,
        explanation: { en: "Both に and から mark the giver with もらう; から emphasises the source more naturally.", np: "に र から दुवैले もらう सँग दिने व्यक्ति चिन्ह लगाउँछन्; から स्रोतलाई बढी स्वाभाविक रूपमा जोड दिन्छ।", jp: "「に」も「から」も使えるが、「から」のほうが出所を強調する。" },
      },
    ],
    listening: {
      scenario: { en: "Short story about gifts exchanged after a trip.", np: "यात्रापछि उपहार आदानप्रदानबारे छोटो कथा।", jp: "旅行後に贈り物を交換する短いストーリー。" },
      instruction: { en: "Track who gives what to whom (subject に object を あげる／もらう).", np: "कसले के लाई कसलाई दिन्छ पछ्याउनुहोस् (subject に object を あげる／もらう)।", jp: "誰が誰に何をあげる／もらうかを追いかけましょう。" },
      keyPhrases: ["あげました", "もらいました", "に"],
    },
  }),
];
