import type { N5LessonSpec } from "@/lib/japanese-learning/n5/build-japanese-detail";
import { mkN4Lesson as mk } from "@/lib/japanese-learning/n4/n4-lesson-factory";

/** Days 8–14 — Minna II Lessons 33–39 */
export const JP_N4_PART2: N5LessonSpec[] = [
  mk({
    minnaLesson: 33,
    dialogue: [
      { speaker: "ホセ", ja: "今、何を考えているんですか。", reading: "Ima, nani o kangaete iru n desu ka.", en: { en: "What are you thinking about now?", np: "तपाईं अहिले के सोच्दै हुनुहुन्छ?", jp: "今、何について考えているのですか。" } },
      { speaker: "吉田", ja: "転職しようと思っています。", reading: "Tenshoku shiyō to omotteimasu.", en: { en: "I'm thinking of changing jobs.", np: "म जागिर बदल्ने सोच्दैछु।", jp: "転職しようと考えています。" } },
      { speaker: "ホセ", ja: "えっ、本当ですか。前に転職したことがありますか。", reading: "E, hontō desu ka. Mae ni tenshoku shita koto ga arimasu ka.", en: { en: "What? Really? Have you changed jobs before?", np: "अरे, साँच्चि? तपाईंले पहिले कहिल्यै जागिर बदल्नुभएको छ?", jp: "えっ、本当ですか。以前に転職した経験がありますか。" } },
      { speaker: "吉田", ja: "はい、学生の時に一度アルバイトを変えたことがあります。", reading: "Hai, gakusei no toki ni ichido arubaito o kaeta koto ga arimasu.", en: { en: "Yes, I once changed part-time jobs when I was a student.", np: "हो, विद्यार्थी हुँदा मैले एकपटक पार्ट-टाइम जागिर बदलेको थिएँ।", jp: "はい、学生のころに一度アルバイトを変えたことがあります。" } },
      { speaker: "ホセ", ja: "そうですか。よく考えてから決めた方がいいですよ。", reading: "Sō desu ka. Yoku kangaete kara kimeta hō ga ii desu yo.", en: { en: "I see. It's better to think it over carefully before deciding.", np: "अच्छा। निर्णय गर्नुभन्दा पहिले राम्रोसँग सोच्नु नै उचित हुन्छ।", jp: "そうですか。よく考えてから決めたほうがいいですよ。" } },
    ],
    particles: [
      { particle: "〜と思っています", note: { en: "Ongoing intention or thought: 転職しようと思っています = I am (currently) thinking of changing jobs.", np: "जारी इरादा वा सोचाइ: 転職しようと思っています = (हाल) जागिर परिवर्तन गर्ने सोचमा छु।", jp: "現在進行する意志・考え：転職しようと思っています。" } },
      { particle: "〜たことがあります", note: { en: "Have done / experience: one has experienced doing X before.", np: "अनुभव: पहिले X गरेको छु।", jp: "経験「〜たことがあります」：過去に〜した経験がある。" } },
      { particle: "〜てから", note: { en: "After doing X: よく考えてから決める = decide after thinking carefully.", np: "X गरेपछि: よく考えてから決める = राम्रोसँग सोचेपछि निर्णय गर्नु।", jp: "「〜てから」：〜した後で。よく考えてから決める。" } },
    ],
    grammarBullets: [
      { en: "〜と思っています (V-volitional + と思っています): ongoing intention, contrasts with 〜と思います (momentary thought).", np: "〜と思っています (V-iccha + と思っています): जारी इरादा, 〜と思います (क्षणिक विचार) सँग भिन्न।", jp: "〜と思っています：継続中の意思。〜と思います（瞬間的な考え）との違いに注意。" },
      { en: "〜たことがあります: ever/never frame for completed experiences — time is unspecified.", np: "〜たことがあります: कहिले/कहिल्यै नभएको ढाँचा सम्पन्न अनुभवका लागि — समय अनिर्दिष्ट।", jp: "〜たことがあります：経験の有無を表す。時期は特定しない。" },
      { en: "V-ようと思っています: I intend to do: 食べようと思っています = I'm thinking of eating.", np: "V-よう + と思っています: गर्ने इरादा छ: 食べようと思っています = खाने सोचमा छु।", jp: "V意向形＋と思っています：〜しようとしている（意図）。" },
    ],
    mcqs: [
      {
        question: { en: "Which expresses ongoing intention to travel?", np: "यात्रा गर्ने जारी इरादा कुनले व्यक्त गर्छ?", jp: "旅行するという現在の意図を表す文は？" },
        choices: ["旅行すると思います。", "旅行しようと思っています。", "旅行したことがあります。", "旅行しています。"],
        correctIndex: 1,
        explanation: { en: "V-volitional + と思っています expresses current ongoing intention.", np: "V-iccha + と思っています जारी इरादा व्यक्त गर्छ।", jp: "意向形＋と思っていますが現在の意図を表す。" },
      },
      {
        question: { en: "I have eaten sushi before. Correct form:", np: "मैले अघि सुशी खाएको छु। सही रूप:", jp: "寿司を食べたことがある。正しい形は？" },
        choices: ["寿司を食べます。", "寿司を食べていました。", "寿司を食べたことがあります。", "寿司を食べましょう。"],
        correctIndex: 2,
        explanation: { en: "〜たことがあります marks a past experience that has occurred at least once.", np: "〜たことがあります कम्तीमा एकपटक भएको अनुभव चिनो लगाउँछ।", jp: "〜たことがありますは少なくとも一度経験したことを表す。" },
      },
    ],
    listening: {
      scenario: { en: "Two colleagues chat about career plans; one shares past experiences and current intentions.", np: "दुई सहकर्मी क्यारियर योजनाबारे कुरा गर्छन्; एकले पुरानो अनुभव र हालको इरादा साझा गर्छ।", jp: "同僚2人がキャリアについて話す。過去の経験と現在の意図を共有する場面。" },
      instruction: { en: "Listen for たことがあります (experience) and と思っています (intention). Note the difference.", np: "たことがあります (अनुभव) र と思っています (इरादा) सुन्नुहोस्। फरक नोट गर्नुहोस्।", jp: "たことがあります（経験）とと思っています（意図）に注目。違いをメモ。" },
      keyPhrases: ["たことがあります", "と思っています", "てから", "一度"],
    },
  }),

  mk({
    minnaLesson: 34,
    dialogue: [
      { speaker: "アナ", ja: "この料理、食べてみてもいいですか。", reading: "Kono ryōri, tabete mite mo ii desu ka.", en: { en: "May I try eating this dish?", np: "के म यो खाना खाएर हेर्न सक्छु?", jp: "この料理、食べてみてもいいですか。" } },
      { speaker: "松田", ja: "どうぞ。辛くないので食べてみてください。", reading: "Dōzo. Karakunai no de tabete mite kudasai.", en: { en: "Go ahead. It's not spicy so please try it.", np: "खानुहोस् न। पिरो छैन, त्यसैले खाएर हेर्नुहोस्।", jp: "どうぞ。辛くないので、ぜひ食べてみてください。" } },
      { speaker: "アナ", ja: "おいしいですね。私もこれを作ってみることにします。", reading: "Oishii desu ne. Watashi mo kore o tsukutte miru koto ni shimasu.", en: { en: "It's delicious! I've decided I'll also try making this.", np: "कस्तो मिठो! मैले पनि यो बनाएर हेर्ने निर्णय गरेँ।", jp: "おいしいですね。私もこれを作ってみることにします。" } },
      { speaker: "松田", ja: "いいですね。レシピを送っておきます。", reading: "Ii desu ne. Reshipi o okutte okimasu.", en: { en: "Great. I'll send you the recipe in advance.", np: "राम्रो कुरा! म अघि नै रेसिपी पठाइदिन्छु।", jp: "いいですね。レシピを前もって送っておきます。" } },
      { speaker: "アナ", ja: "ありがとうございます。週末に挑戦してみます。", reading: "Arigatō gozaimasu. Shūmatsu ni chōsen shite mimasu.", en: { en: "Thank you. I'll give it a try this weekend.", np: "धन्यवाद। म यो सप्ताहन्तमा प्रयास गर्छु।", jp: "ありがとうございます。週末に挑戦してみます。" } },
    ],
    particles: [
      { particle: "〜てみます", note: { en: "Try doing: attempt an action to see the result. 食べてみる = try eating (and see).", np: "प्रयास गर्नु: परिणाम हेर्न कार्य प्रयास गर्नु। 食べてみる = खाएर हेर्नु।", jp: "「〜てみる」：試しにやってみる・結果を確かめる。食べてみる＝食べて確かめる。" } },
      { particle: "〜ことにします", note: { en: "Decide to do: a firm personal decision made by the speaker.", np: "गर्ने निर्णय गर्नु: वक्ताको दृढ व्यक्तिगत निर्णय।", jp: "「〜ことにします」：話し手が決めた個人的な決定。" } },
      { particle: "〜ことになりました", note: { en: "Turned out / it was decided (by circumstances, not a personal choice).", np: "भयो / परिस्थितिले निर्णय भयो (व्यक्तिगत छनोट नभई)।", jp: "「〜ことになりました」：状況・外部の力による決定（自分の意志ではない）。" } },
    ],
    grammarBullets: [
      { en: "〜てみます: I'll try (and see what happens). Adds exploratory nuance to any verb.", np: "〜てみます: (के हुन्छ हेर्न) प्रयास गर्छु। जुनसुकै क्रियामा अन्वेषण भाव थप्छ।", jp: "〜てみます：試しにやってみる（結果を確かめる）。どの動詞にも探索のニュアンスを加える。" },
      { en: "〜ことにします vs 〜ことになりました: the first is my choice, the second is what happened/was decided.", np: "〜ことにします र 〜ことになりました: पहिलो मेरो छनोट, दोस्रो परिस्थितिले भएको।", jp: "〜ことにします（自分の決定）vs 〜ことになりました（状況・他者による決定）。" },
    ],
    mcqs: [
      {
        question: { en: "I'll try the new coffee flavour (to see if I like it):", np: "नयाँ कफी फ्लेभर प्रयास गर्छु (मन पर्छ हेर्न):", jp: "新しいコーヒーの味を試してみる表現は？" },
        choices: ["新しいコーヒーを飲みます。", "新しいコーヒーを飲んでみます。", "新しいコーヒーを飲むことにします。", "新しいコーヒーを飲んでしまいます。"],
        correctIndex: 1,
        explanation: { en: "〜てみます marks a trial action to see what it's like.", np: "〜てみます कस्तो छ हेर्न प्रयास कार्य चिनो लगाउँछ।", jp: "〜てみますは試行を表す。" },
      },
      {
        question: { en: "She decided to quit smoking. It was her own decision:", np: "उनले सुर्ती छोड्ने निर्णय गरिन्। यो उनकै निर्णय थियो:", jp: "彼女は禁煙すると自分で決めた。正しい形は？" },
        choices: ["タバコを吸わないことになりました。", "タバコを吸わないことにしました。", "タバコを吸わないようになりました。", "タバコを吸わないみたいです。"],
        correctIndex: 1,
        explanation: { en: "〜ことにしました = I/she personally decided. 〜ことになりました = it was decided (externally).", np: "〜ことにしました = व्यक्तिगत निर्णय। 〜ことになりました = बाह्य रूपमा निर्णय भयो।", jp: "〜ことにしました：本人の決断。〜ことになりました：外部・状況による決定。" },
      },
    ],
    listening: {
      scenario: { en: "A cooking show: host encourages viewers to try each recipe step and shares decisions about the menu.", np: "खाना पकाउने कार्यक्रम: होस्टले दर्शकलाई प्रत्येक रेसिपी चरण प्रयास गर्न प्रोत्साहित गर्छ।", jp: "料理番組：ホストが各レシピのステップを試すよう促し、メニューの決断を語る。" },
      instruction: { en: "Count each てみます (try) and each ことにします (decide) you hear.", np: "प्रत्येक てみます (प्रयास) र ことにします (निर्णय) गन्नुहोस्।", jp: "てみます（試す）とことにします（決める）をそれぞれ数えながら聞く。" },
      keyPhrases: ["てみます", "ことにします", "挑戦", "試してみる"],
    },
  }),

  mk({
    minnaLesson: 35,
    dialogue: [
      { speaker: "田村", ja: "明日の試験はどうでしょうか。難しいでしょうか。", reading: "Ashita no shiken wa dō deshō ka. Muzukashii deshō ka.", en: { en: "I wonder about tomorrow's exam. I suppose it'll be difficult?", np: "भोलिको परीक्षाको बारेमा के होला? गाह्रो होला कि?", jp: "明日の試験はどうでしょうか。難しいでしょうか。" } },
      { speaker: "高橋", ja: "そうですね。かなり難しいかもしれません。", reading: "Sō desu ne. Kanari muzukashii kamoshiremasen.", en: { en: "Hmm, it might be quite difficult.", np: "हो नि, काफी गाह्रो हुन सक्छ।", jp: "そうですね。かなり難しいかもしれません。" } },
      { speaker: "田村", ja: "でも、田中先生はやさしいから、大丈夫でしょう。", reading: "Demo, Tanaka-sensei wa yasashii kara, daijōbu deshō.", en: { en: "But since Tanaka-sensei is kind, it'll probably be fine.", np: "तर तनाका सर दयालु हुनुहुन्छ, त्यसैले ठीक होला।", jp: "でも、田中先生は優しいから、大丈夫でしょう。" } },
      { speaker: "高橋", ja: "それは分かりません。難しいかもしれませんよ。", reading: "Sore wa wakarimasen. Muzukashii kamoshiremasen yo.", en: { en: "That's hard to say. It might still be difficult.", np: "त्यो भन्न गाह्रो छ। फेरि पनि गाह्रो हुन सक्छ।", jp: "それはわかりません。難しいかもしれませんよ。" } },
      { speaker: "田村", ja: "よく勉強しておいたほうがいいですね。", reading: "Yoku benkyō shite oita hō ga ii desu ne.", en: { en: "It's better to study well in advance, isn't it.", np: "अघि नै राम्रोसँग पढ्नु नै उचित हुन्छ, हैन र।", jp: "よく勉強しておいたほうがいいですね。" } },
    ],
    particles: [
      { particle: "〜でしょう", note: { en: "Conjecture or polite assertion: 'it probably is / I suppose'. Based on evidence or intuition.", np: "अनुमान वा विनम्र दावी: 'सम्भवतः ... हो / म सोच्छु'। साक्ष्य वा अन्तर्ज्ञानमा आधारित।", jp: "「〜でしょう」：推量・丁寧な断定。証拠や直感に基づく。" } },
      { particle: "〜かもしれません", note: { en: "Possibility: 'might / may be'. Lower certainty than でしょう.", np: "सम्भावना: 'हुन सक्छ'। でしょう भन्दा कम निश्चितता।", jp: "「〜かもしれません」：可能性。でしょうより確信度が低い。" } },
    ],
    grammarBullets: [
      { en: "Certainty scale: 〜です (certain) → 〜でしょう (probably) → 〜かもしれません (maybe) → 〜でしょうか (wondering).", np: "निश्चितता मापदण्ड: 〜です → 〜でしょう → 〜かもしれません → 〜でしょうか।", jp: "確信度の順：〜です＞〜でしょう＞〜かもしれません＞〜でしょうか。" },
      { en: "〜でしょう can also ask for confirmation (falling tone) or genuine wonder (rising tone) in spoken Japanese.", np: "〜でしょう बोलीमा पुष्टि (अवरोही स्वर) वा वास्तविक आश्चर्य (उच्च स्वर) सोध्न सक्छ।", jp: "話し言葉では〜でしょうは確認（下降調）や真の疑問（上昇調）にも使われる。" },
    ],
    mcqs: [
      {
        question: { en: "You're uncertain but think it might rain. Best expression:", np: "तपाईं अनिश्चित हुनुहुन्छ तर पानी पर्न सक्छ सोच्नुहुन्छ। उत्तम अभिव्यक्ति:", jp: "不確かだが雨が降るかもしれないと思う。最適な表現は？" },
        choices: ["雨が降ります。", "雨が降るでしょう。", "雨が降るかもしれません。", "雨が降りました。"],
        correctIndex: 2,
        explanation: { en: "〜かもしれません = maybe / might — low certainty conjecture.", np: "〜かもしれません = हुन सक्छ — कम निश्चितता अनुमान।", jp: "〜かもしれません＝確信が低い可能性の表現。" },
      },
      {
        question: { en: "You're quite sure the meeting ends at 5. Natural form:", np: "तपाईं काफी निश्चित हुनुहुन्छ कि बैठक ५ बजे सकिन्छ। स्वाभाविक रूप:", jp: "会議が5時に終わると確信に近い。自然な表現は？" },
        choices: ["5時に終わります。", "5時に終わるかもしれません。", "5時に終わるでしょう。", "5時に終わってしまいます。"],
        correctIndex: 2,
        explanation: { en: "〜でしょう = probably — moderate-to-high confidence conjecture.", np: "〜でしょう = सम्भवतः — मध्यम-उच्च विश्वास अनुमान।", jp: "〜でしょう＝おそらく——中程度から高めの確信の推量。" },
      },
    ],
    listening: {
      scenario: { en: "Two students speculate about an exam result before it's released.", np: "दुई विद्यार्थीले परिणाम प्रकाशित हुनुभन्दा पहिले परीक्षा नतिजाबारे अनुमान गर्छन्।", jp: "2人の学生が発表前に試験結果を推測し合う。" },
      instruction: { en: "Note each でしょう and かもしれません. Whose prediction is more certain?", np: "प्रत्येक でしょう र かもしれません नोट गर्नुहोस्। कसको भविष्यवाणी बढी निश्चित छ?", jp: "でしょうとかもしれませんをメモ。どちらの予測が確信度が高いか？" },
      keyPhrases: ["でしょう", "かもしれません", "きっと", "たぶん"],
    },
  }),

  mk({
    minnaLesson: 36,
    dialogue: [
      { speaker: "上司", ja: "明日の会議には必ず出席しなければなりません。", reading: "Ashita no kaigi ni wa kanarazu shusseki shinakereba narimasen.", en: { en: "You must attend tomorrow's meeting without fail.", np: "तपाईंले भोलिको बैठकमा अनिवार्य रूपमा उपस्थित हुनैपर्छ।", jp: "明日の会議には必ず出席しなければなりません。" } },
      { speaker: "社員", ja: "わかりました。何時間かかるんですか。", reading: "Wakarimashita. Nan-jikan kakaru n desu ka.", en: { en: "Understood. How long will it take?", np: "बुझें। कति घण्टा लाग्छ?", jp: "わかりました。何時間かかるのですか。" } },
      { speaker: "上司", ja: "3時間はかかるはずです。", reading: "San-jikan wa kakaru hazu desu.", en: { en: "It's expected to take about three hours.", np: "करिब तीन घण्टा लाग्ने अपेक्षा छ।", jp: "3時間はかかるはずです。" } },
      { speaker: "社員", ja: "資料を全部読まなければなりませんか。", reading: "Shiryō o zenbu yomanakereba narimasen ka.", en: { en: "Do I have to read all the documents?", np: "के मैले सबै कागजात पढ्नैपर्छ?", jp: "資料を全部読まなければなりませんか。" } },
      { speaker: "上司", ja: "はい、全部読んでおいてほしいです。でも、最後のページは読まなくてもいいです。", reading: "Hai, zenbu yonde oite hoshii desu. Demo, saigo no pēji wa yomanaくte mo ii desu.", en: { en: "Yes, I want you to read them all. But you don't have to read the last page.", np: "हो, म चाहन्छु कि तपाईंले सबै पढ्नुहोस्। तर अन्तिम पृष्ठ पढ्नु पर्दैन।", jp: "はい、全部読んでおいてほしいです。でも、最後のページは読まなくてもいいです。" } },
    ],
    particles: [
      { particle: "〜なければなりません", note: { en: "Must do / have to: strong obligation. Also: 〜なくてはいけません (same meaning).", np: "गर्नैपर्छ / अनिवार्य: कडा दायित्व। साथै: 〜なくてはいけません (एउटै अर्थ)।", jp: "「〜なければなりません」：強い義務。〜なくてはいけませんと同義。" } },
      { particle: "〜なくてもいいです", note: { en: "Don't have to / no need to do: negates obligation.", np: "गर्नु पर्दैन: दायित्व नकार्छ।", jp: "「〜なくてもいいです」：義務の否定。しなくて構わない。" } },
      { particle: "〜はずです", note: { en: "Expected to / should be: logical expectation based on known facts.", np: "अपेक्षित / हुनुपर्छ: ज्ञात तथ्यमा आधारित तार्किक अपेक्षा।", jp: "「〜はずです」：既知の事実に基づく論理的な期待・当然そうであるはず。" } },
    ],
    grammarBullets: [
      { en: "〜なければなりません contracts to 〜なきゃ (very casual) or 〜ないといけない (casual-polite).", np: "〜なければなりません → 〜なきゃ (धेरै अनौपचारिक) वा 〜ないといけない (अनौपचारिक-विनम्र)।", jp: "〜なければなりません→〜なきゃ（超くだけた）・〜ないといけない（くだけた丁寧）。" },
      { en: "〜はずです: speaker is logically certain but doesn't have direct proof — contrast with 〜でしょう (intuition).", np: "〜はずです: वक्तालाई तार्किक निश्चितता छ तर प्रत्यक्ष प्रमाण छैन — 〜でしょう (अन्तर्ज्ञान) सँग तुलना।", jp: "〜はずです：論理的確信（直接証拠はない）。〜でしょう（直感）との対比。" },
    ],
    mcqs: [
      {
        question: { en: "Which sentence expresses obligation?", np: "कुन वाक्यले दायित्व व्यक्त गर्छ?", jp: "義務を表す文はどれか？" },
        choices: [
          "パスポートを持ってきてもいいです。",
          "パスポートを持ってこなくてもいいです。",
          "パスポートを持ってこなければなりません。",
          "パスポートを持ってくるかもしれません。",
        ],
        correctIndex: 2,
        explanation: { en: "〜なければなりません = must bring — strong obligation.", np: "〜なければなりません = ल्याउनैपर्छ — कडा दायित्व।", jp: "〜なければなりません：強い義務表現。" },
      },
      {
        question: { en: "No need to bring a dictionary. Correct phrase:", np: "शब्दकोश ल्याउनु पर्दैन। सही वाक्यांश:", jp: "辞書を持ってこなくていい。正しい表現は？" },
        choices: ["辞書を持ってきてください。", "辞書を持ってこなければなりません。", "辞書を持ってこなくてもいいです。", "辞書を持ってこないでしょう。"],
        correctIndex: 2,
        explanation: { en: "〜なくてもいいです = don't have to / no need to.", np: "〜なくてもいいです = पर्दैन / आवश्यक छैन।", jp: "〜なくてもいいです＝しなくて構わない・必要ない。" },
      },
    ],
    listening: {
      scenario: { en: "Company orientation: manager lists what new staff must and need not do on the first day.", np: "कम्पनी ओरिएन्टेसन: प्रबन्धकले नयाँ कर्मचारीहरूले पहिलो दिन के गर्नैपर्छ र के पर्दैन सूची बनाउँछ।", jp: "会社のオリエンテーション：初日に必須・不要なことを管理職が列挙する。" },
      instruction: { en: "Make two columns: must do (なければならない) vs don't have to (なくてもいい).", np: "दुई स्तम्भ बनाउनुहोस्: गर्नैपर्छ (なければならない) र पर्दैन (なくてもいい)।", jp: "2列にメモ：しなければならない vs しなくてもいい。" },
      keyPhrases: ["なければなりません", "なくてもいいです", "はずです", "必ず"],
    },
  }),

  mk({
    minnaLesson: 37,
    dialogue: [
      { speaker: "医者", ja: "毎日薬を飲まなくてはいけません。", reading: "Mainichi kusuri o nomanakute wa ikemasen.", en: { en: "You must take your medicine every day.", np: "तपाईंले हरेक दिन औषधि खानैपर्छ।", jp: "毎日薬を飲まなくてはいけません。" } },
      { speaker: "患者", ja: "食事の前に飲まなければなりませんか。", reading: "Shokuji no mae ni nomanakereba narimasen ka.", en: { en: "Do I have to take it before meals?", np: "के मैले खाना खानुभन्दा पहिले खानैपर्छ?", jp: "食事の前に飲まなければなりませんか。" } },
      { speaker: "医者", ja: "いいえ、食事の後でいいです。寝る前には飲まなくてもいいです。", reading: "Iie, shokuji no ato de ii desu. Neru mae ni wa nomanaくte mo ii desu.", en: { en: "No, after meals is fine. You don't have to take it before bed.", np: "होइन, खाना खाएपछि ठीक छ। सुत्नुभन्दा पहिले खानु पर्दैन।", jp: "いいえ、食事の後でいいです。寝る前には飲まなくてもいいです。" } },
      { speaker: "患者", ja: "わかりました。お酒を飲んでもいいですか。", reading: "Wakarimashita. Osake o nonde mo ii desu ka.", en: { en: "I understand. Is it okay to drink alcohol?", np: "बुझें। के रक्सी पिउन हुन्छ?", jp: "わかりました。お酒を飲んでもいいですか。" } },
      { speaker: "医者", ja: "お酒は飲んではいけません。それから、毎日運動するようにしてください。", reading: "Osake wa nonde wa ikemasen. Sorekara, mainichi undō suru yō ni shite kudasai.", en: { en: "You must not drink alcohol. Also, please try to exercise every day.", np: "रक्सी पिउनु हुँदैन। साथै, हरेक दिन व्यायाम गर्ने प्रयास गर्नुहोस्।", jp: "お酒は飲んではいけません。それから、毎日運動するようにしてください。" } },
    ],
    particles: [
      { particle: "〜なくてはいけません", note: { en: "Must do / have to (same meaning as 〜なければなりません but slightly softer).", np: "गर्नैपर्छ (〜なければなりません जस्तै अर्थ तर अलि नरम)।", jp: "「〜なくてはいけません」：義務（〜なければなりませんと同義、やや柔らかい）。" } },
      { particle: "〜てはいけません", note: { en: "Must not do / prohibited: 飲んではいけません = must not drink.", np: "गर्नु हुँदैन: 飲んではいけません = पिउनु हुँदैन।", jp: "「〜てはいけません」：禁止。飲んではいけません＝飲むことは禁じられている。" } },
      { particle: "〜ようにしてください", note: { en: "Please try to do / please make effort to: 運動するようにしてください.", np: "कृपया प्रयास गर्नुहोस् / कृपया प्रयत्न गर्नुहोस्।", jp: "「〜ようにしてください」：〜するよう努めてください。" } },
    ],
    grammarBullets: [
      { en: "Obligation vs prohibition: 〜なければなりません = must. 〜てはいけません = must not.", np: "दायित्व र निषेध: 〜なければなりません = गर्नैपर्छ। 〜てはいけません = गर्नु हुँदैन।", jp: "義務と禁止：〜なければなりません（しなければ）vs〜てはいけません（してはならない）。" },
      { en: "〜ようにしてください: softer than a direct command; used by doctors, teachers.", np: "〜ようにしてください: प्रत्यक्ष आदेश भन्दा नरम; डाक्टर, शिक्षकले प्रयोग गर्छन्।", jp: "〜ようにしてください：直接命令より柔らかい。医師・教師がよく使う。" },
    ],
    mcqs: [
      {
        question: { en: "Prohibited action in this medical context:", np: "यस चिकित्सा सन्दर्भमा निषेधित कार्य:", jp: "この医療の文脈で禁止されている行為は？" },
        choices: ["薬を飲む", "お酒を飲む", "運動する", "食事をする"],
        correctIndex: 1,
        explanation: { en: "お酒は飲んではいけません = must not drink alcohol — this is the prohibition in the dialogue.", np: "お酒は飲んではいけません = रक्सी पिउनु हुँदैन — संवादमा यो निषेध हो।", jp: "お酒は飲んではいけません：会話中の禁止事項。" },
      },
      {
        question: { en: "Softest way to tell a student to review notes daily:", np: "विद्यार्थीलाई दैनिक नोट पुनरावलोकन गर्न सबैभन्दा नरम तरिका:", jp: "学生に毎日ノートを見直すよう穏やかに伝える。最適な表現は？" },
        choices: [
          "毎日ノートを見てください。",
          "毎日ノートを見なければなりません。",
          "毎日ノートを見るようにしてください。",
          "毎日ノートを見てはいけません。",
        ],
        correctIndex: 2,
        explanation: { en: "〜ようにしてください is the softest form — 'please try to do'.", np: "〜ようにしてください सबैभन्दा नरम रूप — 'कृपया प्रयास गर्नुहोस्'।", jp: "〜ようにしてくださいが最も柔らかい依頼・努力を促す形。" },
      },
    ],
    listening: {
      scenario: { en: "Doctor gives post-operation instructions covering what the patient must, may, and must not do.", np: "डाक्टरले शल्यक्रियापछिको निर्देशन दिन्छ: के गर्नैपर्छ, के गर्न सकिन्छ, के गर्नु हुँदैन।", jp: "手術後の注意事項：医師が患者に必須・許可・禁止事項を説明する。" },
      instruction: { en: "Sort into three lists: must (なければならない), OK (てもいい), prohibited (てはいけない).", np: "तीन सूचीमा वर्गीकरण गर्नुहोस्: अनिवार्य, ठीक छ, निषेध।", jp: "3つに仕分け：必須（なければならない）・許可（てもいい）・禁止（てはいけない）。" },
      keyPhrases: ["なくてはいけません", "てはいけません", "ようにしてください", "てもいいです"],
    },
  }),

  mk({
    minnaLesson: 38,
    dialogue: [
      { speaker: "田中", ja: "佐藤さんが結婚するそうです。", reading: "Satō-san ga kekkon suru sō desu.", en: { en: "I heard that Sato-san is getting married.", np: "मैले सुनें कि साटो-सान विवाह गर्दैछन्।", jp: "佐藤さんが結婚するそうです。" } },
      { speaker: "鈴木", ja: "えっ、そうなんですか！誰に聞いたんですか。", reading: "E, sō na n desu ka! Dare ni kiita n desu ka.", en: { en: "What! Is that so? Who did you hear that from?", np: "अरे! साँच्चि हो? तपाईंले कसबाट सुन्नुभयो?", jp: "えっ、そうなんですか！誰に聞いたのですか。" } },
      { speaker: "田中", ja: "林さんが言っていました。来月だそうですよ。", reading: "Hayashi-san ga itte imashita. Raigetsu da sō desu yo.", en: { en: "Hayashi-san said so. Apparently it's next month.", np: "हयाशी-सानले भन्नुभएको थियो। सुनाइ अनुसार अर्को महिना हो।", jp: "林さんが言っていました。来月だそうですよ。" } },
      { speaker: "鈴木", ja: "そうですか。佐藤さんらしいですね。突然ですね。", reading: "Sō desu ka. Satō-san rashii desu ne. Totsuzen desu ne.", en: { en: "Is that so. That's just like Sato-san. How sudden.", np: "अच्छा। यो साटो-सानलाई नै सुहाउँछ। कति अचानक।", jp: "そうですか。佐藤さんらしいですね。突然ですね。" } },
      { speaker: "田中", ja: "招待状をもらいましたか。", reading: "Shōtaijō o moraimashita ka.", en: { en: "Did you get an invitation?", np: "के तपाईंले निमन्त्रणापत्र पाउनुभयो?", jp: "招待状をもらいましたか。" } },
    ],
    particles: [
      { particle: "〜そうです (hearsay)", note: { en: "Hearsay: I heard that…  / It seems… (information from an external source). Plain form + そうです.", np: "भनाइ सुनाइ: मैले सुनें कि… / लाग्छ… (बाह्य स्रोतबाट जानकारी)। सामान्य रूप + そうです।", jp: "伝聞「〜そうです」：〜と聞いた・〜らしい。普通形＋そうです。" } },
      { particle: "〜らしい", note: { en: "Appears to be / it seems (based on evidence or general impression). More subjective than hearsay そうです.", np: "देखिन्छ / लाग्छ (साक्ष्य वा सामान्य ठानाइमा आधारित)। भनाइ そうです भन्दा बढी व्यक्तिपरक।", jp: "「〜らしい」：証拠・印象に基づく推量。伝聞のそうですより主観的。" } },
    ],
    grammarBullets: [
      { en: "Hearsay そうです vs appearance そうです: 雨が降るそうです (I heard) ≠ 雨が降りそうです (looks like it will rain).", np: "भनाइ そうです र आकृति そうです: 雨が降るそうです (सुनें) ≠ 雨が降りそうです (पर्ला जस्तो)।", jp: "伝聞そうです vs 様態そうです：雨が降るそうです（聞いた）≠雨が降りそうです（今にも降りそう）。" },
      { en: "〜らしい also means 'typical of': 佐藤さんらしい = that's just like Sato-san.", np: "〜らしい को अर्थ 'विशिष्ट पनि': 佐藤さんらしい = त्यो साटो-सान जस्तै हो।", jp: "〜らしいは「〜に典型的」の意味にも：佐藤さんらしい＝佐藤さんのよう。" },
    ],
    mcqs: [
      {
        question: { en: "He apparently doesn't eat fish (hearsay). Correct form:", np: "ऊले सुनाइ अनुसार माछा खाँदैन। सही रूप:", jp: "彼は魚を食べないらしい（伝聞）。正しい形は？" },
        choices: ["魚を食べないらしいです。", "魚を食べなさそうです。", "魚を食べないそうです。", "魚を食べないみたいです。"],
        correctIndex: 2,
        explanation: { en: "Hearsay そうです: plain negative form + そうです → 食べないそうです.", np: "भनाइ そうです: सामान्य नकारात्मक रूप + そうです → 食べないそうです।", jp: "伝聞そうです：普通否定形＋そうです→食べないそうです。" },
      },
      {
        question: { en: "Which use of らしい means 'typical of'?", np: "らしい को कुन प्रयोगले 'विशिष्ट' बुझाउँछ?", jp: "らしいの「〜に典型的」の意味で使われているのは？" },
        choices: ["雨が降るらしい。", "田中さんらしい答えだ。", "難しいらしい。", "来ないらしい。"],
        correctIndex: 1,
        explanation: { en: "田中さんらしい = that's typical of Tanaka-san.", np: "田中さんらしい = त्यो टानाका-सानलाई सुहाउँछ।", jp: "田中さんらしい＝田中さんに典型的・田中さんっぽい。" },
      },
    ],
    listening: {
      scenario: { en: "Office gossip: two employees share news they've heard about a colleague's promotion.", np: "कार्यालयमा: दुई कर्मचारी सहकर्मीको बढुवाबारे सुनेको समाचार साझा गर्छन्।", jp: "職場の噂話：同僚の昇進について聞いた情報を2人が共有する。" },
      instruction: { en: "Note each 〜そうです and 〜らしい. Is the source specified each time?", np: "प्रत्येक 〜そうです र 〜らしい नोट गर्नुहोस्। प्रत्येक पटक स्रोत उल्लेख छ?", jp: "〜そうですと〜らしいをメモ。そのたびに情報源が明示されているか確認。" },
      keyPhrases: ["〜そうです", "〜らしい", "聞いた", "〜んですか"],
    },
  }),

  mk({
    minnaLesson: 39,
    dialogue: [
      { speaker: "川口", ja: "この花、何の花ですか。バラみたいですね。", reading: "Kono hana, nan no hana desu ka. Bara mitai desu ne.", en: { en: "What kind of flower is this? It looks like a rose.", np: "यो कस्तो फूल हो? गुलाब जस्तो देखिन्छ नि।", jp: "この花、何の花ですか。バラみたいですね。" } },
      { speaker: "森", ja: "そうですね。バラのようですが、実はボタンです。", reading: "Sō desu ne. Bara no yō desu ga, jitsu wa botan desu.", en: { en: "Yes, it does look like a rose, but it's actually a peony.", np: "हो, गुलाब जस्तो देखिन्छ, तर वास्तवमा यो पियोनी हो।", jp: "そうですね。バラのようですが、実はボタンです。" } },
      { speaker: "川口", ja: "へえ、そうなんですか。すごく大きいですね。バラより大きいようです。", reading: "Hē, sō na n desu ka. Sugoku ōkii desu ne. Bara yori ōkii yō desu.", en: { en: "Oh really? It's very big. It looks bigger than a rose.", np: "ओहो, साँच्चि? यो त धेरै ठूलो छ। गुलाब भन्दा ठूलो देखिन्छ।", jp: "へえ、そうなんですか。すごく大きいですね。バラより大きいようです。" } },
      { speaker: "森", ja: "ええ。そして、とてもいい香りがするみたいですよ。", reading: "Ē. Soshite, totemo ii kaori ga suru mitai desu yo.", en: { en: "Yes, and apparently it has a very nice fragrance.", np: "हो, र यसमा धेरै राम्रो सुगन्ध आउँछ जस्तो लाग्छ।", jp: "ええ。そして、とてもいい香りがするみたいですよ。" } },
    ],
    particles: [
      { particle: "〜ようです", note: { en: "Seems / appears to be (objective inference from observation). Plain form + ようです.", np: "देखिन्छ / लाग्छ (अवलोकनबाट वस्तुनिष्ठ अनुमान)। सामान्य रूप + ようです।", jp: "「〜ようです」：客観的な観察に基づく推量。普通形＋ようです。" } },
      { particle: "〜みたいです", note: { en: "Looks like / seems (more colloquial and subjective than ようです). Plain form + みたいです.", np: "देखिन्छ / जस्तो (ようです भन्दा बढी बोलचाल र व्यक्तिपरक)।", jp: "「〜みたいです」：〜ようですより口語的・主観的な推量。" } },
    ],
    grammarBullets: [
      { en: "〜ようです vs 〜みたいです: similar meaning; ようです is more formal/written, みたいです is conversational.", np: "〜ようです र 〜みたいです: समान अर्थ; ようです बढी औपचारिक/लिखित, みたいです बोलचाल।", jp: "〜ようですと〜みたいです：ほぼ同義。ようですは改まった・書き言葉、みたいですは口語。" },
      { en: "Compare: らしい (based on hearsay/evidence), ようだ (inference from observation), みたいだ (casual inference).", np: "तुलना: らしい (भनाइ/साक्ष्यमा आधारित), ようだ (अवलोकनबाट अनुमान), みたいだ (अनौपचारिक अनुमान)।", jp: "らしい（伝聞・証拠）、ようだ（観察による推量）、みたいだ（くだけた推量）の比較。" },
    ],
    mcqs: [
      {
        question: { en: "He looks tired (based on what you observe). Casual expression:", np: "ऊ थकित देखिन्छ (तपाईंले देखेका आधारमा)। अनौपचारिक अभिव्यक्ति:", jp: "彼は疲れているように見える（観察から）。口語的表現は？" },
        choices: ["疲れているそうです。", "疲れているようです。", "疲れているみたいです。", "疲れているらしいです。"],
        correctIndex: 2,
        explanation: { en: "〜みたいです is the casual form for appearance-based inference.", np: "〜みたいです देखिने अनुमानका लागि अनौपचारिक रूप हो।", jp: "〜みたいですは観察に基づく推量の口語形。" },
      },
      {
        question: { en: "Formal version of 'it seems to be raining outside':", np: "'बाहिर पानी पर्दै जस्तो छ' को औपचारिक संस्करण:", jp: "「外で雨が降っているようだ」の改まった形は？" },
        choices: ["外は雨が降っているみたいです。", "外は雨が降っているようです。", "外は雨が降っているそうです。", "外は雨が降っているかもしれません。"],
        correctIndex: 1,
        explanation: { en: "〜ようです is the more formal version of appearance-based inference.", np: "〜ようです देखिने अनुमानको बढी औपचारिक संस्करण हो।", jp: "〜ようですが観察に基づく推量の改まった形。" },
      },
    ],
    listening: {
      scenario: { en: "A nature documentary in Japanese: narrator describes unfamiliar plants using ようです and みたいです.", np: "जापानीमा प्रकृति वृत्तचित्र: वर्णनकर्ताले ようです र みたいです प्रयोग गरेर अपरिचित बिरुवाहरू वर्णन गर्छ।", jp: "日本語の自然ドキュメンタリー：ナレーターがようです・みたいですを使って見知らぬ植物を描写する。" },
      instruction: { en: "Notice the contrast between ようです (formal) and みたいです (casual) usage.", np: "ようです (औपचारिक) र みたいです (अनौपचारिक) बिचको भिन्नता ध्यान दिनुहोस्।", jp: "ようです（改まった）とみたいです（くだけた）の使い分けに注目。" },
      keyPhrases: ["〜ようです", "〜みたいです", "観察", "推量"],
    },
  }),
];
