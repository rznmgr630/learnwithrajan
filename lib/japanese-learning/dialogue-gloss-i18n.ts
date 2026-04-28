import type { Locale } from "@/lib/i18n/types";
import type { LocalizedString } from "@/lib/i18n/types";
import { pickLocalized } from "@/lib/i18n/pick";

/**
 * Nepali + Japanese glosses for scripted N5 dialogue lines keyed by the English `en` string.
 * Keys must match lesson data exactly (including curly apostrophes).
 */
const DIALOGUE_GLOSS_I18N: Record<string, { np: string; jp: string }> = {
  "Nice to meet you. I’m Watt. I’m British.": { np: "तपाईंसँग भेटेर खुसी लाग्यो। म वाट हुँ। म बेलायती हुँ।", jp: "はじめまして。ワットと申します。イギリス出身です。" },
  "Pleased to meet you / please treat me well.": { np: "भेटेर खुसी लाग्यो / अबदेखि राम्रोसँग हेरिदिनुहोला।", jp: "お会いできてうれしいです。これからよろしくお願いします。" },
  "This is a dictionary. That (over there) is a hospital.": { np: "यो शब्दकोश हो। त्यो (टाढा) अस्पताल हो।", jp: "これは辞書です。あちらは病院です。" },
  "How much is that?": { np: "त्यो कति हो?", jp: "それはいくらですか。（意味）" },
  "There is a book on the desk.": { np: "डेस्कमाथि एउटा किताब छ।", jp: "机のうえに本があります。" },
  "Is there a phone in the bag?": { np: "झोलाभित्र फोन छ?", jp: "かばんの中に携帯がありますか。" },
  "I study at the gym every day. Yesterday I drank beer.": { np: "म प्रत्येक दिन जिममा पढ्छु। हिजो बियर खाएँ।", jp: "毎日ジムで勉強します。きのうはビールを飲みました。" },
  "Tomorrow I’ll go to the office. I’ll go by subway.": { np: "भोलि कार्यालय जान्छु। सबवेले जान्छु।", jp: "あしたオフィスへ行きます。地下鉄で行きます。" },
  "I drink coffee. I eat bread. I drink coffee at a restaurant.": { np: "म कफी पिउँछु। म रोटी खान्छु। रेस्टुरेन्टमा कफी पिउँछु।", jp: "コーヒーを飲みます。パンを食べます。レストランでコーヒーを飲みます。" },
  "I gave a cake to a friend. I received a book from the teacher.": { np: "मैले साथीलाई केक दिएँ। शिक्षकबाट किताब पाएँ।", jp: "友だちにケーキをあげました。先生から本をもらいました。" },
  "This PC is new. That bag is pretty/clean.": { np: "यो पिसी नयाँ छ। त्यो झोला सफा/राम्रो देखिन्छ।", jp: "このパソコンは新しいです。そのバッグはきれいです。" },
  "I like soccer. I’m good at piano. I understand English.": { np: "मलाई फुटबल मन पर्छ। पियानो उत्तम छ। अङ्ग्रेजी बुझ्छु।", jp: "サッカーが好きです。ピアノが上手です。英語が分かります。" },
  "Children are in the yard. There’s a cup on the table.": { np: "बच्चाहरू अंगनमा छन्। टेबलमाथि गिलास छ।", jp: "子どもが庭にいます。テーブルのうえにコップがあります。" },
  "One cake, please. I drank three bottles of beer.": { np: "एउटा केक दिनुहोस्। मैले बियरका तीन बोतल पिएँ।", jp: "ケーキを一つください。ビールを三本飲みました。" },
  "Yesterday I was free. The hot spring side was cheaper.": { np: "हिजो फुर्सद थियो। हट स्प्रिङतिर सस्तो थियो।", jp: "きのうは暇でした。温泉のほうが安かったです。" },
  "I want a guitar. I want to cook a meal. Tomorrow I’ll go to watch a movie.": { np: "मलाई गितार चाहिन्छ। खाना बनाउन चाहन्छु। भोलि चलचित्र हेर्न जान्छु।", jp: "ギターがほしいです。食事を作りたいです。あした映画を見に行きます。" },
  "Already brushed your teeth? Please close the door. I’m making a copy.": { np: "पहिले नै दाँत माझिसकेको? ढोका बन्द गर्नुहोस्। म प्रतिलिपि गर्दैछु।", jp: "もう歯を磨きましたか。ドアを閉めてください。コピーを取っています。" },
  "May I take photos? You must not smoke here.": { np: "फोटो लिन पाइन्छ? यहाँ धुम्रपान निषेध छ।", jp: "写真を撮ってもいいですか。ここではタバコを吸ってはいけません。" },
  "After showering I sleep. Because I was sick I took a day off.": { np: "नुहाएपछि सुत्छु। बिरामी भएकाले बिदा लिएँ।", jp: "シャワーを浴びてから寝ます。病気だったので休みました。" },
  "You don’t have to take the bus. Please don’t run in the hallway. Please don’t come home late.": { np: "बस चढ्नै पर्दैन। करिडोरमा दौडनुहोस् न। ढिलो घर नफर्कनुहोस्।", jp: "バスに乗らなくてもいいです。廊下を走らないでください。遅く帰らないでください。" },
  "I can speak Japanese. She can play the piano. I read a book before sleeping.": { np: "म जापानी बोल्न सक्छु। उनी पियानो बजाउन सक्छिन्। सुत्नुअघि किताब पढ्छु。", jp: "日本語を話すことができます。彼女はピアノをひくことができます。寝る前に本を読みます。" },
  "I’ve been to Kyoto before. I came to like studying more.": { np: "म पहिले क्योटो गएको छु। अध्ययन मन पर्न थाल्यो。", jp: "京都に行ったことがあります。勉強がもっと好きになりました。" },
  "Today’s a day off. There’s a test tomorrow (plain). Really?": { np: "आज विदा छ। भोलि परीक्षा छ (साधारण बोली)। साँच्चै?", jp: "きょうは休みだ。あしたテストがあるんだ。そうなの？" },
  "I think it will rain tomorrow. I think Yamada is an engineer.": { np: "भोलि पानी पर्ला जस्तो लाग्छ। यामाडा इन्जिनियर हुनुहुन्छ जस्तो लाग्छ。", jp: "あしたは雨だと思います。ヤマダさんはエンジニアだと思います。" },
  "This is a picture the teacher drew. There’s someone who bought a big pen.": { np: "यो शिक्षकले कोरेको चित्र हो। ठूलो कलम किनेको कोही छन्。", jp: "これは先生が描いた絵です。大きいペンを買った人がいます。" },
  "When I’m free I go to the gym. When it rains I study at home.": { np: "फुर्सद हुँदा जिम जान्छु। पानी पर्दा घरमै पढ्छु。", jp: "ひまなときにジムへ行きます。雨が降るときは家で勉強します。" },
  "I made a cake for a friend. I had the teacher send an email (for me).": { np: "मैले साथीलाई केक बनाइदिएँ। शिक्षकले मेरो लागि इमेल पठाइदिनुभयो。", jp: "友だちにケーキを作ってあげました。先生にメールを送ってもらいました。" },
  "If we’re free let’s play games. Even if it rains I’ll go.": { np: "फुर्सद भए खेल खेलौँ। पानी परे पनि जान्छु。", jp: "ひまだったらゲームをしましょう。雨でも行きます。" },
  "Let’s reorganise every grammar pattern covered so far. Pace matters on the test.": { np: "अहिलेसम्मका ग्रामर फेरि मिलाऔँ। परीक्षामा गति महत्त्वपूर्ण छ。", jp: "これまで並べた文型を一度になおしましょう。テストではペースが重要です。" },
  "When using the answer sheet, read the choices carefully before answering. Taking notes for when you can't listen again is also important.": { np: "उत्तर पत्र प्रयोग गर्दा, जवाफअघि विकल्प ध्यानपूर्वक पढ्नुहोस्। फेरि सुन्न नमिल्दा नोट लिनु पनि महत्त्वपूर्ण छ。", jp: "マークシートでは選択肢をよく読んでから答えましょう。もう一度聞けないときのためにメモを取ることも大切です。" },
  "During spare moments, check kanji readings and stroke order in a dictionary. Handwriting practice on your own is also important.": { np: "फुर्सदमा शब्दकोशमा कान्जीको पढाइ र लेख्ने क्रम जाँच गर्नुहोस्। आफैले हस्तलेखन अभ्यास गर्नु पनि महत्त्वपूर्ण छ।", jp: "すきま時間に、辞書で漢字の読み方と書き順を確認します。自分で手書き練習をすることも大切です。" },
  "When reading a passage, first look for connectors. Once you spot 'however' or 'therefore,' the flow of the text becomes clear.": { np: "पाठ पढ्दा पहिले जोड्ने शब्दहरू खोज्नुहोस्। ‘तर’ वा ‘त्यसकारण’ देखियो भने धार बुझिन्छ。", jp: "文章を読むときは、まず接続詞を探しましょう。「しかし」や「だから」が見えたら流れが分かります。" },
  "Finally, set a timer and take a full mock test. If it goes well, don't forget to register for the actual N5 exam!": { np: "अन्त्यमा टाइमर राखेर पुरै अभ्यास परीक्षा दिनुहोस्। राम्रो भयो भने वास्तविक N5 दर्ता नबिर्सनुहोस्！", jp: "最後にタイマーをセットして模擬試験に挑戦しましょう。うまくいったら本番のN5の申し込みも忘れずに！" },
  "OK everyone, please be quiet for a moment.": { np: "सबैजना, कृपया एकछिन शान्त बस्नुहोस्।", jp: "はい、みなさん、しずかにしてください。" },
  "What is today’s lesson about?": { np: "आजको पाठ के हो?", jp: "きょうのレッスンは何ですか。" },
  "Today is vocabulary and conversation practice.": { np: "आज शब्द र संवाद अभ्यास छ।", jp: "きょうは単語と会話の練習です。" },
  "May I ask a small question?": { np: "सानो प्रश्न सोध्न पाइन्छ?", jp: "ちょっと質問してもいいですか。" },
  "Yes, go ahead.": { np: "हुन्छ, गर्नुहोस्।", jp: "はい、どうぞ。" },
  "Please teach me the reading of this word again.": { np: "यो शब्दको उच्चारण फेरि सिकाइदिनुहोस्。", jp: "この言葉の読み方をもう一度教えてください。" },
  "OK, listen. I will play the CD.": { np: "हुन्छ, सुननुहोस्। सीडी बजाउँछु।", jp: "はい、聞いてください。CDをかけます。" },
  "Yes, I will listen carefully!": { np: "हुन्छ, ध्यानले सुन्छु！", jp: "はい、ききます！" },
  "The speed is fast, isn’t it?": { np: "गति छिटो छ हैन?", jp: "スピードが速いですね。" },
  "Then let’s listen once more, slowly.": { np: "फेरि एकपटक बिस्तै सुनौँ।", jp: "では、もう一度ゆっくり聞きましょう。" },
  "I understand a little now.": { np: "अलिकति बुझेँ।", jp: "すこしわかりました。" },
  "It is still hard for me.": { np: "मेरो लागि अझै गाह्रो छ।", jp: "わたしはまだむずかしいです。" },
  "It’s OK — let’s practise a lot.": { np: "ठिक छ — धेरै अभ्यास गरौँ。", jp: "だいじょうぶです。たくさん練習しましょう。" },
  "I spoke with my friend in English earlier.": { np: "साथीसँग अङ्ग्रेजीमा कुरा गरेँ。", jp: "友だちと英語ではなしました。" },
  "Well then let’s try speaking Japanese too.": { np: "त्यसोभए जापानीमा पनि बोलेर हेरौँ।", jp: "じゃあ、日本語でも話してみましょう。" },
  "Nice — pair up and practise, please.": { np: "राम्रो — जोडी बनाई अभ्यास गर्नुहोस्。", jp: "いいですね。ペアになって練習してください。" },
  "Let’s begin.": { np: "सुरु गरौँ。", jp: "はじめます。" },
  "Nice to work with you.": { np: "सँगै काम गर्न उत्साहित छु。", jp: "よろしくお願いします。" },
  "That’s time for today — see you tomorrow.": { np: "समय भयो। भोलि भेटौँ。", jp: "時間です。またあした。" },
  "Thank you very much!": { np: "धेरै धन्यवाद!", jp: "ありがとうございました！" },
  "Homework is on the textbook page we marked.": { np: "गृहकार्य पाठ्यपुस्तकमा चिन्ह लगाएको पृष्ठमा छ।", jp: "宿題は教科書で印をつけたページです。" },
  "I will copy them into my notebook too.": { np: "नोटबुकमा पनि लेख्छु।", jp: "ノートにも書きます。" },
  "Is it not on the whiteboard?": { np: "ह्वाइटबोर्डमा छैन?", jp: "黒板にはありませんか。" },
};

/** Resolves dialogue third-line gloss for the current UI locale. */
export function resolveDialogueGloss(en: LocalizedString, locale: Locale): string {
  if (typeof en !== "string") return pickLocalized(en, locale);
  if (locale === "en") return en;
  const row = DIALOGUE_GLOSS_I18N[en];
  if (!row) return en;
  return locale === "np" ? row.np : row.jp;
}
