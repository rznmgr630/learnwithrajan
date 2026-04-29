import type { N5LessonSpec } from "@/lib/japanese-learning/n5/build-japanese-detail";
import { mkN4Lesson as mk } from "@/lib/japanese-learning/n4/n4-lesson-factory";

/** Days 15–21 — Minna II Lessons 40–46 */
export const JP_N4_PART3: N5LessonSpec[] = [
  mk({
    minnaLesson: 40,
    dialogue: [
      { speaker: "林", ja: "田中さんはどこへ行ってきたんですか。", reading: "Tanaka-san wa doko e itte kita n desu ka.", en: { en: "Where did you go and come back from, Tanaka-san?", np: "तनाका-सान, तपाईं कहाँ गएर फर्कनुभयो?", jp: "田中さん、どこへ行って戻ってきたのですか？" } },
      { speaker: "田中", ja: "駅まで歩いていきました。バスが来なかったので。", reading: "Eki made aruite ikimashita. Basu ga konakatta no de.", en: { en: "I walked to the station. Since the bus didn't come.", np: "म हिँडेर स्टेशनसम्म गएँ। बस आएन।", jp: "バスが来なかったので、駅まで歩いて行きました。" } },
      { speaker: "林", ja: "雨が降ってきましたね。傘を持っていきましたか。", reading: "Ame ga futte kimashita ne. Kasa o motte ikimashita ka.", en: { en: "It's started raining. Did you take an umbrella?", np: "पानी पर्न थाल्यो है। छाता लिएर जानुभयो?", jp: "雨が降ってきましたね。傘を持っていきましたか？" } },
      { speaker: "田中", ja: "いいえ、忘れてきてしまいました。すぐ止むでしょう。", reading: "Iie, wasurete kite shimaimashita. Sugu yamu deshō.", en: { en: "No, I forgot it. It'll probably stop soon.", np: "होइन, बिर्सेर आएँ। चाँडै बन्द होला।", jp: "いいえ、忘れてきてしまいました。すぐ止むでしょう。" } },
      { speaker: "林", ja: "私の傘を持っていきますか。", reading: "Watashi no kasa o motte ikimasu ka.", en: { en: "Do you want to take my umbrella?", np: "मेरो छाता लिएर जानुहुन्छ?", jp: "私の傘を持っていきますか？" } },
    ],
    particles: [
      { particle: "〜ていく", note: { en: "Action that moves away from the current point and continues. 歩いていく = go on walking (away).", np: "हालको बिन्दुबाट टाढा सर्ने कार्य। 歩いていく = हिँड्दै जानु।", jp: "「〜ていく」：現在地から離れながら続く動作。歩いていく＝歩いて（あちらへ）行く。" } },
      { particle: "〜てくる", note: { en: "Action that comes toward the current point or returns. 雨が降ってくる = rain has started coming down.", np: "हालको बिन्दुतिर सर्ने वा फर्कने कार्य। 雨が降ってくる = पानी पर्न थाल्यो।", jp: "「〜てくる」：現在地に向かう・戻ってくる動作。雨が降ってきた＝雨が降り始めた。" } },
    ],
    grammarBullets: [
      { en: "Direction pair: ていく (away) / てくる (toward). Think of the speaker as fixed point.", np: "दिशा जोडी: ていく (टाढा) / てくる (नजिक)। वक्तालाई स्थिर बिन्दु सोच्नुहोस्।", jp: "方向の対：ていく（離れる）/ てくる（近づく）。話し手を基点として考える。" },
      { en: "てきた can mark change over time: 分かってきた = (it has come to be understood) — gradual development.", np: "てきた क्रमिक परिवर्तन बुझाउन सक्छ: 分かってきた = (बुझिन थाल्यो) — क्रमिक विकास।", jp: "てきたは時間的変化も表す：分かってきた＝だんだん分かってきた（段階的変化）。" },
    ],
    mcqs: [
      {
        question: { en: "New students are arriving at the school. Correct form:", np: "नयाँ विद्यार्थीहरू विद्यालयमा आउँदैछन्। सही रूप:", jp: "新入生が学校にやって来ている。正しい形は？" },
        choices: ["来ていきます。", "来てきます。", "来ています。", "やってきています。"],
        correctIndex: 3,
        explanation: { en: "やってきています = are coming (moving toward speaker's location).", np: "やってきています = आउँदैछन् (वक्ताको स्थानतिर)।", jp: "やってきています：話し手の方向に向かって来ている。" },
      },
      {
        question: { en: "I will bring the report to the meeting. (carry and go there):", np: "म रिपोर्ट बैठकमा लिएर जान्छु। (बोकेर त्यहाँ जानु):", jp: "報告書を会議に持っていく。正しい形は？" },
        choices: ["報告書を持ってきます。", "報告書を持っていきます。", "報告書を持ってきました。", "報告書を持っていました。"],
        correctIndex: 1,
        explanation: { en: "持っていきます = carry and go (away from current position).", np: "持っていきます = बोकेर जानु (हालको स्थानबाट)।", jp: "持っていきます：現在地から離れて持って行く。" },
      },
    ],
    listening: {
      scenario: { en: "A travel vlog in Japanese: narrator describes movements using ていく and てくる as the scenery changes.", np: "जापानीमा ट्राभल भ्लग: दृश्य परिवर्तन हुँदा वर्णनकर्ता ていく र てくる प्रयोग गरेर गतिविधि वर्णन गर्छ।", jp: "旅行ブログ動画：景色が変わる中、ていく・てくるで移動を描写するナレーション。" },
      instruction: { en: "Each time you hear ていく or てくる, note the action and direction.", np: "ていく वा てくる सुन्दा, कार्य र दिशा नोट गर्नुहोस्।", jp: "ていく・てくるが聞こえるたびに動作と方向をメモ。" },
      keyPhrases: ["ていきます", "てきます", "〜始める", "だんだん"],
    },
  }),

  mk({
    minnaLesson: 41,
    dialogue: [
      { speaker: "中田", ja: "もし時間があれば、一緒に映画に行きませんか。", reading: "Moshi jikan ga areba, issho ni eiga ni ikimasen ka.", en: { en: "If you have time, shall we go to the movies together?", np: "यदि समय छ भने, सँगै फिल्म हेर्न जाऔँ?", jp: "もし時間があれば、一緒に映画に行きませんか？" } },
      { speaker: "佐野", ja: "いいですね。何時までに来ればいいですか。", reading: "Ii desu ne. Nanji made ni kureba ii desu ka.", en: { en: "Sounds good. What time should I be there?", np: "राम्रो छ। कति बजेसम्म पुग्नु पर्छ?", jp: "いいですね。何時までに来ればよいですか？" } },
      { speaker: "中田", ja: "6時に来てくれれば十分です。早く来なくてもいいですよ。", reading: "Roku-ji ni kite kureba jūbun desu. Hayaku konakute mo ii desu yo.", en: { en: "If you come at 6 it's enough. You don't have to come early.", np: "६ बजे आउनुभयो भने पुग्छ। चाँडो आउनुपर्दैन।", jp: "６時に来てくれれば十分です。早く来なくても構いませんよ。" } },
      { speaker: "佐野", ja: "わかりました。チケットを買っておけばいいですか。", reading: "Wakarimashita. Chiketto o katte okeba ii desu ka.", en: { en: "I see. Should I buy the tickets in advance?", np: "बुझेँ। टिकट अगावै किनेर राखूँ?", jp: "わかりました。チケットをあらかじめ買っておけばいいですか？" } },
      { speaker: "中田", ja: "はい、買っておけば安心ですね。", reading: "Hai, katte okeba anshin desu ne.", en: { en: "Yes, it's reassuring if you buy them in advance.", np: "हो, अगावै किनेर राख्नुभयो भने निश्चिन्त हुन्छ।", jp: "はい、事前に買っておけば安心ですね。" } },
    ],
    particles: [
      { particle: "〜ば conditional", note: { en: "If/when X, then Y: 〜ば = standard conditional. Verbs: Group 1 e-form + ば. Adj: い → ければ.", np: "यदि X भए, Y: 〜ば = मानक सर्त। Group 1 क्रिया: e-form + ば। Adj: い → ければ।", jp: "「〜ば」条件：〜すれば。動詞（グループ1）：e段＋ば。い形容詞：い→ければ。" } },
      { particle: "〜ばいい", note: { en: "All you need to do is X / it's fine if you do X: 来ればいい = you just need to come.", np: "तपाईंले केवल X गर्नुपर्छ / X गरे हुन्छ: 来ればいい = तपाईंले केवल आउनु पर्छ।", jp: "「〜ばいい」：〜すればそれで十分。来ればいい＝来ればよい。" } },
    ],
    grammarBullets: [
      { en: "〜ば form: Group 1 (u→e+ば: 書く→書けば), Group 2 (remove る + れば: 食べる→食べれば), irregular (する→すれば, くる→くれば).", np: "〜ば रूप: Group 1 (u→e+ば), Group 2 (る हटाएर + れば), अनियमित (する→すれば, くる→くれば)।", jp: "〜ば形：1グループ（u→e＋ば：書く→書けば）、2グループ（る→れば：食べる→食べれば）、不規則（する→すれば・くる→くれば）。" },
      { en: "〜ばよかった: I wish I had done X (past regret): 来ればよかった = I should have come.", np: "〜ばよかった: X गर्नुपर्थ्यो (भूतकाल पछुतो): 来ればよかった = आउनु पर्थ्यो।", jp: "〜ばよかった：〜すればよかった（後悔）。来ればよかった＝来るべきだった。" },
    ],
    mcqs: [
      {
        question: { en: "〜ば form of 飲む (to drink):", np: "飲む को 〜ば रूप:", jp: "飲む の〜ば形は？" },
        choices: ["飲んば", "飲めば", "飲むば", "飲みば"],
        correctIndex: 1,
        explanation: { en: "Group 1: u-vowel row → e-vowel row + ば: 飲む(む→め) → 飲めば.", np: "Group 1: u-स्वर → e-स्वर + ば: 飲む(む→め) → 飲めば।", jp: "1グループ：む→め＋ば＝飲めば。" },
      },
      {
        question: { en: "〜ば form of 食べる (to eat):", np: "食べる को 〜ば रूप:", jp: "食べる の〜ば形は？" },
        choices: ["食べれば", "食べば", "食べれ", "食べるば"],
        correctIndex: 0,
        explanation: { en: "Group 2: remove る → add れば: 食べる → 食べれば.", np: "Group 2: る हटाउनुहोस् → れば थप्नुहोस्: 食べる → 食べれば।", jp: "2グループ：る→れば＝食べれば。" },
      },
    ],
    listening: {
      scenario: { en: "A customer service call: representative gives conditions using 〜ば for service eligibility.", np: "ग्राहक सेवा कल: प्रतिनिधिले सेवा योग्यताका लागि 〜ば प्रयोग गरेर सर्तहरू दिन्छ।", jp: "カスタマーサービスの電話：担当者がサービスの条件を〜ばで説明する。" },
      instruction: { en: "Note each 〜ば condition and what outcome follows. List them in order.", np: "प्रत्येक 〜ば सर्त र त्यसपछिको नतिजा नोट गर्नुहोस्।", jp: "〜ばの条件と結果をセットにしてメモ。" },
      keyPhrases: ["〜ば", "〜ればいい", "すれば", "くれば"],
    },
  }),

  mk({
    minnaLesson: 42,
    dialogue: [
      { speaker: "西田", ja: "部長に話したら、どうなりますか。", reading: "Buchō ni hanashitara, dō narimasu ka.", en: { en: "If I talk to the manager, what will happen?", np: "म म्यानेजरसँग कुरा गरें भने के हुन्छ?", jp: "部長に話したら、どうなりますか？" } },
      { speaker: "山口", ja: "許可してくれるかもしれません。プロジェクトが終わったら、お祝いをしましょう。", reading: "Kyoka shite kureru kamoshiremasen. Purojekuto ga owattara, oiwai o shimashō.", en: { en: "Maybe they'll give permission. When the project ends, let's celebrate.", np: "सायद अनुमति दिनुहोला। प्रोजेक्ट सकिएपछि, जश्न मनाऔँ।", jp: "許可してくれるかもしれません。プロジェクトが終わったら、お祝いをしましょう。" } },
      { speaker: "西田", ja: "いいですね。春になったら、花見パーティーをしましょう。", reading: "Ii desu ne. Haru ni nattara, hanami pātī o shimashō.", en: { en: "Sounds good. When spring comes, let's have a cherry-blossom viewing party.", np: "राम्रो छ। वसन्त आएपछि, चेरी फूल हेर्ने पार्टी गरौँ।", jp: "いいですね。春になったら、花見パーティーをしましょう。" } },
      { speaker: "山口", ja: "もし雨が降ったら、室内でやりましょう。", reading: "Moshi ame ga futtara, shitsunai de yarimashō.", en: { en: "If it rains, let's do it indoors.", np: "यदि पानी पर्यो भने, भित्र गरौँ।", jp: "もし雨が降ったら、室内でやりましょう。" } },
    ],
    particles: [
      { particle: "〜たら conditional", note: { en: "If/when X happens (more flexible than ば; applies to a single hypothetical or timed sequence).", np: "यदि/जब X हुन्छ (ば भन्दा बढी लचिलो; एकल काल्पनिक वा समयबद्ध क्रमका लागि)।", jp: "「〜たら」条件：〜したら（ば条件より柔軟；単発の仮定・時間的な順序）。" } },
    ],
    grammarBullets: [
      { en: "〜たら vs 〜ば: 〜たら can express 'when (after) X' while 〜ば is more strictly 'if X'.", np: "〜たら र 〜ば: 〜たら 'X पछि/जब' व्यक्त गर्न सक्छ जबकि 〜ば बढी कडाईसँग 'यदि X' हो।", jp: "〜たらと〜ばの違い：〜たらは「〜したとき」も表せる。〜ばは純粋な条件。" },
      { en: "Counterfactual with たら: もし〜たら: もし雨が降ったら / if it rains (hypothetical scenario).", np: "काल्पनिक तर: もし〜たら: もし雨が降ったら / यदि पानी पर्यो (काल्पनिक परिदृश्य)।", jp: "仮定：もし〜たら＝もし雨が降ったら（仮定の場面）。" },
    ],
    mcqs: [
      {
        question: { en: "When the homework is done, let's eat. Correct form:", np: "गृहकार्य सकिएपछि खाऊँ। सही रूप:", jp: "宿題が終わったら、ご飯を食べましょう。正しい形は？" },
        choices: ["宿題が終われば、ご飯を食べましょう。", "宿題が終わったら、ご飯を食べましょう。", "宿題が終わると、ご飯を食べましょう。", "宿題が終わるなら、ご飯を食べましょう。"],
        correctIndex: 1,
        explanation: { en: "〜たら is natural for 'when X is done, do Y' (sequential events).", np: "〜たら 'X सकिएपछि Y गर्नु' (क्रमिक घटना) का लागि स्वाभाविक।", jp: "〜たらは「〜し終わったらYする」という時間的な順序に自然。" },
      },
      {
        question: { en: "〜たら form of 来る (to come):", np: "来る को 〜たら रूप:", jp: "来るの〜たら形は？" },
        choices: ["来たら", "来れば", "来るたら", "来いたら"],
        correctIndex: 0,
        explanation: { en: "来る past form is 来た, so 来たら.", np: "来る को भूत रूप 来た हो, त्यसैले 来たら।", jp: "来るの過去形は来た＋ら＝来たら。" },
      },
    ],
    listening: {
      scenario: { en: "Friends plan a weekend outing using たら conditions for weather and schedules.", np: "साथीहरूले मौसम र तालिकाका लागि たら सर्त प्रयोग गरेर सप्ताहान्त भ्रमण योजना बनाउँछन्।", jp: "友人たちがたら条件を使って週末の予定を立てる場面。" },
      instruction: { en: "Note the conditions (〜たら) and the plans that follow (〜しましょう / 〜します).", np: "सर्तहरू (〜たら) र त्यसपछिका योजनाहरू (〜しましょう / 〜します) नोट गर्नुहोस्।", jp: "〜たらの条件と、それに続く計画（〜しましょう・〜します）をセットでメモ。" },
      keyPhrases: ["〜たら", "もし", "〜しましょう", "そのとき"],
    },
  }),

  mk({
    minnaLesson: 43,
    dialogue: [
      { speaker: "松本", ja: "たとえ高くても、このかばんを買いたいです。", reading: "Tatoe takakute mo, kono kaban o kaitai desu.", en: { en: "Even if it's expensive, I want to buy this bag.", np: "महंगो भए पनि, यो झोला किन्न चाहन्छु।", jp: "たとえ高くても、このかばんを買いたいです。" } },
      { speaker: "田村", ja: "本当ですか。いくらですか。", reading: "Hontō desu ka. Ikura desu ka.", en: { en: "Really? How much is it?", np: "साँच्चै? कति पर्छ?", jp: "本当ですか。おいくらですか？" } },
      { speaker: "松本", ja: "5万円です。でも、どんなに高くても後悔しないと思います。", reading: "Go-man-en desu. Demo, donna ni takakute mo kōkai shinai to omoimasu.", en: { en: "¥50,000. But no matter how expensive it is, I don't think I'll regret it.", np: "५०,००० येन। तर जतिसुकै महंगो भए पनि, पछुतो हुँदैन भन्ने लाग्छ।", jp: "５万円です。でも、どんなに高くても後悔しないと思います。" } },
      { speaker: "田村", ja: "そうですか。たとえ給料が減っても買いますか。", reading: "Sō desu ka. Tatoe kyūryō ga hette mo kaimasu ka.", en: { en: "I see. Even if your salary is cut, would you buy it?", np: "हो र। तलब घटे पनि किन्नुहुन्छ?", jp: "そうですか。たとえ給料が減っても買いますか？" } },
      { speaker: "松本", ja: "はい、この品質なら絶対に買います。", reading: "Hai, kono hinshitsu nara zettai ni kaimasu.", en: { en: "Yes, with this quality, I'll definitely buy it.", np: "हो, यो गुणस्तर भएको भए अवश्य किन्छु।", jp: "はい、この品質なら絶対に買います。" } },
    ],
    particles: [
      { particle: "〜ても", note: { en: "Even if X / even though X: 高くても = even if expensive.", np: "यद्यपि X / भले पनि X: 高くても = महंगो भए पनि।", jp: "「〜ても」：たとえ〜でも・〜であっても。高くても＝高くても構わない。" } },
      { particle: "たとえ〜ても", note: { en: "Even supposing that / even if (hypothetical): emphasises the even-if aspect more strongly.", np: "मानाँ कि 〜भए पनि (काल्पनिक): 'भले पनि' पक्षलाई बढी जोड दिन्छ।", jp: "「たとえ〜ても」：仮定の「たとえ〜であっても」を強調する。" } },
    ],
    grammarBullets: [
      { en: "〜ても formation: い-adj → drop い + くても; な-adj → + でも; Noun + でも; V て-form + も.", np: "〜ても गठन: い-adj → い हटाएर + くても; な-adj → + でも; Noun + でも; V て-form + も।", jp: "〜ての作り方：い形容詞→い→くても；な形容詞→でも；名詞＋でも；V て形＋も。" },
      { en: "どんなに〜ても = no matter how: どんなに高くても = no matter how expensive.", np: "どんなに〜ても = जतिसुकै भए पनि: どんなに高くても = जतिसुकै महंगो भए पनि।", jp: "「どんなに〜ても」：いくら〜であっても（どれだけ〜でも）。" },
    ],
    mcqs: [
      {
        question: { en: "Even if it rains, I will go. Correct form:", np: "पानी परे पनि म जान्छु। सही रूप:", jp: "雨が降っても行きます。正しい形は？" },
        choices: ["雨が降れば行きます。", "雨が降っても行きます。", "雨が降ったら行きます。", "雨が降るなら行きません。"],
        correctIndex: 1,
        explanation: { en: "〜ても = even if — the result is unchanged regardless of the condition.", np: "〜ても = भए पनि — सर्त जेसुकै भए नतिजा परिवर्तन हुँदैन।", jp: "〜ても：条件に関わらず結果が変わらない「たとえ〜であっても」。" },
      },
      {
        question: { en: "〜ても form of 静かだ (quiet):", np: "静かだ को 〜ても रूप:", jp: "静かだの〜ても形は？" },
        choices: ["静かくても", "静かでも", "静かても", "静かだても"],
        correctIndex: 1,
        explanation: { en: "な-adj: remove だ → add でも: 静か + でも = 静かでも.", np: "な-adj: だ हटाउनुहोस् → でも थप्नुहोस्: 静か + でも = 静かでも।", jp: "な形容詞：だ→でも＝静かでも。" },
      },
    ],
    listening: {
      scenario: { en: "A debate about priorities: speakers use 〜ても to express unconditional commitment to their goals.", np: "प्राथमिकताबारे बहस: वक्ताहरूले 〜ても प्रयोग गरेर आफ्नो लक्ष्यप्रति बिनासर्त प्रतिबद्धता व्यक्त गर्छन्।", jp: "優先事項についての議論：〜てもを使って目標への無条件のこだわりを表明する。" },
      instruction: { en: "Note each 〜ても: what condition is being dismissed, and what is the maintained outcome?", np: "प्रत्येक 〜ても नोट गर्नुहोस्: कुन सर्त खारेज गरिएको छ, र नतिजा के हो?", jp: "〜てもをメモ：無視される条件と維持される結果をセットで書く。" },
      keyPhrases: ["〜ても", "たとえ", "どんなに", "それでも"],
    },
  }),

  mk({
    minnaLesson: 44,
    dialogue: [
      { speaker: "野口", ja: "日本語が上手になるように、毎日練習しています。", reading: "Nihongo ga jōzu ni naru yō ni, mainichi renshū shite imasu.", en: { en: "I practice every day so that I'll get better at Japanese.", np: "जापानी भाषामा राम्रो हुन, म प्रतिदिन अभ्यास गर्छु।", jp: "日本語が上手になるように、毎日練習しています。" } },
      { speaker: "丸山", ja: "素晴らしいですね。声が聞こえるように大きく話してください。", reading: "Subarashii desu ne. Koe ga kikoeru yō ni ōkiku hanashite kudasai.", en: { en: "That's wonderful. Please speak loudly so your voice can be heard.", np: "अद्भुत छ। आवाज सुनिने गरी जोरले बोल्नुहोस्।", jp: "素晴らしいですね。声が聞こえるように大きく話してください。" } },
      { speaker: "野口", ja: "わかりました。それから、先生は学生が理解できるように、ゆっくり話してくださいます。", reading: "Wakarimashita. Sorekara, sensei wa gakusei ga rikai dekiru yō ni, yukkuri hanashite kudasaimasu.", en: { en: "Understood. Also, the teacher speaks slowly so that students can understand.", np: "बुझेँ। साथै, शिक्षकले विद्यार्थीहरूले बुझ्न सकून् भनेर बिस्तारै बोल्नुहुन्छ।", jp: "わかりました。また、先生は学生が理解できるようにゆっくり話してくださいます。" } },
      { speaker: "丸山", ja: "いい先生ですね。日本語が話せるようになるように頑張ってください。", reading: "Ii sensei desu ne. Nihongo ga hanaseru yō ni naru yō ni ganbatte kudasai.", en: { en: "What a good teacher. Please do your best to become able to speak Japanese.", np: "कति राम्रो शिक्षक। जापानी बोल्न सक्ने हुन मिहेनत गर्नुहोस्।", jp: "いい先生ですね。日本語が話せるようになるよう頑張ってください。" } },
    ],
    particles: [
      { particle: "〜ように (purpose)", note: { en: "So that / in order that: 聞こえるように大きく話す = speak loudly so it can be heard.", np: "ताकि / यसका लागि: 聞こえるように大きく話す = सुनिने गरी जोरले बोल्नु।", jp: "「〜ように」（目的）：〜できるように・〜するように。聞こえるように大きく話す。" } },
      { particle: "〜ように (request)", note: { en: "Please try to: 早く来るようにしてください = please try to come early.", np: "कृपया प्रयास गर्नुहोस्: 早く来るようにしてください = कृपया चाँडो आउने प्रयास गर्नुहोस्।", jp: "「〜ように」（依頼）：〜するようにしてください・〜するよう努めてください。" } },
    ],
    grammarBullets: [
      { en: "〜ために (purpose for volitional acts) vs 〜ように (purpose for achieving a state).", np: "〜ために (इरादायुक्त कार्यका लागि उद्देश्य) र 〜ように (अवस्था प्राप्त गर्न उद्देश्य)।", jp: "〜ために（意志的行為の目的）と〜ように（状態達成の目的）の違い。" },
      { en: "〜するように言いました: told someone to do X (indirect command/request).", np: "〜するように言いました: कसैलाई X गर्न भन्यो (अप्रत्यक्ष आदेश/अनुरोध)।", jp: "〜するように言いました：〜するよう指示した（間接的な命令・依頼の伝達）。" },
    ],
    mcqs: [
      {
        question: { en: "Study hard so you can pass the exam. Correct form:", np: "परीक्षा पास गर्न सकोस् भनेर कडा मिहेनत गर्नुहोस्। सही रूप:", jp: "試験に合格できるように、よく勉強してください。正しい形は？" },
        choices: [
          "試験に合格するために、よく勉強してください。",
          "試験に合格できるように、よく勉強してください。",
          "試験に合格するよう、よく勉強してください。",
          "試験に合格したら、よく勉強してください。",
        ],
        correctIndex: 1,
        explanation: { en: "〜ように is used when the purpose is a state/ability: 合格できるように.", np: "〜ように अवस्था/क्षमताको उद्देश्यमा प्रयोग: 合格できるように।", jp: "〜ようには状態・能力の達成を目的とする場合に使う：合格できるように。" },
      },
      {
        question: { en: "I told him to call me. Correct form:", np: "मैले उनलाई मलाई फोन गर्न भनें। सही रूप:", jp: "彼に電話するように言いました。正しい形は？" },
        choices: ["電話してほしいと言いました。", "電話するように言いました。", "電話しなさいと言いました。", "電話するように話しました。"],
        correctIndex: 1,
        explanation: { en: "〜するように言いました = told (someone) to do (indirect reported request).", np: "〜するように言いました = (कसैलाई) गर्न भन्यो (अप्रत्यक्ष प्रतिवेदित अनुरोध)।", jp: "〜するように言いました：（間接的に）〜するよう伝えた。" },
      },
    ],
    listening: {
      scenario: { en: "A teacher addresses students before a test: setting expectations using 〜ように.", np: "शिक्षकले परीक्षाअघि विद्यार्थीहरूलाई 〜ように प्रयोग गरेर अपेक्षाहरू राख्छ।", jp: "テスト前の教師の話：〜ようにを使って期待を伝える。" },
      instruction: { en: "Note each 〜ように: is it expressing purpose or a polite request?", np: "प्रत्येक 〜ように नोट गर्नुहोस्: यो उद्देश्य वा विनम्र अनुरोध व्यक्त गर्दैछ?", jp: "〜ようにをメモ：目的か丁寧な依頼か確認。" },
      keyPhrases: ["〜ように", "〜するように言う", "〜できるように", "ために"],
    },
  }),

  mk({
    minnaLesson: 45,
    dialogue: [
      { speaker: "岡田", ja: "健康のために、毎朝ジョギングをしています。", reading: "Kenkō no tame ni, maiasa jogingu o shite imasu.", en: { en: "For health reasons, I jog every morning.", np: "स्वास्थ्यका लागि, म हरेक बिहान जगिङ गर्छु।", jp: "健康のために、毎朝ジョギングをしています。" } },
      { speaker: "沢田", ja: "えらいですね。私は寒いので、冬はやめてしまいます。", reading: "Erai desu ne. Watashi wa samui no de, fuyu wa yamete shimaimasu.", en: { en: "That's admirable. Because it's cold, I quit during winter.", np: "सराहनीय छ। चिसो भएकोले, म जाडोमा छाडिदिन्छु।", jp: "えらいですね。私は寒いので、冬はやめてしまいます。" } },
      { speaker: "岡田", ja: "健康のためですから、寒くても続けたほうがいいですよ。", reading: "Kenkō no tame desu kara, samukute mo tsuzuketa hō ga ii desu yo.", en: { en: "Since it's for health, you should continue even if it's cold.", np: "स्वास्थ्यको लागि भएकाले, चिसो भए पनि जारी राख्नु राम्रो।", jp: "健康のためですから、寒くても続けたほうがいいですよ。" } },
      { speaker: "沢田", ja: "そうですね。風邪をひかないように、気をつけます。", reading: "Sō desu ne. Kaze o hikanai yō ni, ki o tsukemasu.", en: { en: "True. I'll be careful not to catch a cold.", np: "ठीक छ। रुघाखोकी नलागोस् भनेर ख्याल गर्छु।", jp: "そうですね。風邪をひかないように、気をつけます。" } },
    ],
    particles: [
      { particle: "〜ために (purpose)", note: { en: "For the purpose of / in order to: 健康のために = for the sake of health.", np: "उद्देश्यका लागि: 健康のために = स्वास्थ्यको लागि।", jp: "「〜ために」（目的）：健康のために＝健康のため。" } },
      { particle: "〜ので / 〜から (reason)", note: { en: "〜ので: because (objective, softer). 〜から: because (subjective, stronger). Both give reasons.", np: "〜ので: किनभने (वस्तुनिष्ठ, नरम)। 〜から: किनभने (व्यक्तिपरक, बलियो)। दुवैले कारण दिन्छन्।", jp: "〜ので（客観的・柔らかい理由）と〜から（主観的・強い理由）の違い。" } },
    ],
    grammarBullets: [
      { en: "〜ために can also mean 'because of' with nouns: 工事のために道が混んでいます = because of construction, the road is congested.", np: "〜ために संज्ञासँग 'कारणले' पनि बुझाउन सक्छ: 工事のために = निर्माणका कारणले।", jp: "〜ためには名詞と使うと「〜が原因で」の意味にも：工事のために道が混んでいる。" },
      { en: "ので vs から: ので is more logical/objective; から is more direct/assertive.", np: "のでとから: ので अधिक तार्किक/वस्तुनिष्ठ; から बढी प्रत्यक्ष/दृढ।", jp: "のでは論理的・客観的；からは直接的・主張が強い。" },
    ],
    mcqs: [
      {
        question: { en: "I'm studying to pass the exam. 〜ために is used for:", np: "म परीक्षा पास गर्नका लागि अध्ययन गर्दैछु। 〜ために प्रयोग हुन्छ:", jp: "試験に合格するために勉強している。〜ためにの用法は？" },
        choices: ["Expressing regret", "Expressing purpose / goal", "Expressing hearsay", "Expressing obligation"],
        correctIndex: 1,
        explanation: { en: "〜ために here expresses the purpose behind studying.", np: "〜ために यहाँ अध्ययन पछाडिको उद्देश्य व्यक्त गर्छ।", jp: "〜ために：ここでは勉強の目的を表す。" },
      },
      {
        question: { en: "Which reason form is more objective and suitable for formal writing?", np: "कुन कारण रूप बढी वस्तुनिष्ठ र औपचारिक लेखनका लागि उपयुक्त छ?", jp: "より客観的で改まった文章に適した理由表現はどれか？" },
        choices: ["〜から", "〜ので", "〜だから", "〜くて"],
        correctIndex: 1,
        explanation: { en: "〜ので is considered more objective and is preferred in formal contexts.", np: "〜ので बढी वस्तुनिष्ठ मानिन्छ र औपचारिक सन्दर्भमा रुचाइन्छ।", jp: "〜のでは客観的と見なされ、改まった場面で好まれる。" },
      },
    ],
    listening: {
      scenario: { en: "A health podcast: host explains daily routines and the reasons/purposes behind them.", np: "स्वास्थ्य पोडकास्ट: होस्टले दैनिक दिनचर्या र ती पछाडिका कारण/उद्देश्यहरू व्याख्या गर्छ।", jp: "健康ポッドキャスト：ホストが日課とその理由・目的を説明する。" },
      instruction: { en: "Note each ために (purpose/cause) and のでから (reason) to see which frame is used.", np: "प्रत्येक ために (उद्देश्य/कारण) र のでから (कारण) नोट गर्नुहोस्।", jp: "ために（目的・原因）とのでから（理由）をメモ。どちらが使われているか確認。" },
      keyPhrases: ["〜ために", "〜ので", "〜から", "健康"],
    },
  }),

  mk({
    minnaLesson: 46,
    dialogue: [
      { speaker: "記者", ja: "昨日、銀行が強盗に襲われました。", reading: "Kinō, ginkō ga gōtō ni osowaremashita.", en: { en: "Yesterday, the bank was attacked by robbers.", np: "हिजो, बैंकमा डकैतीको आक्रमण भयो।", jp: "昨日、銀行が強盗に襲われました。" } },
      { speaker: "目撃者", ja: "私もそこにいたんです。突然大きな声が聞こえました。", reading: "Watashi mo soko ni ita n desu. Totsuzen ōkina koe ga kikoemashita.", en: { en: "I was there too. Suddenly I heard a loud voice.", np: "म पनि त्यहाँ थिएँ। अचानक ठूलो आवाज सुनिएको थियो।", jp: "私もそこにいました。突然大きな声が聞こえました。" } },
      { speaker: "記者", ja: "あなたは警察に呼ばれましたか。", reading: "Anata wa keisatsu ni yobaremashita ka.", en: { en: "Were you called by the police?", np: "तपाईंलाई प्रहरीले बोलाएको थियो?", jp: "あなたは警察に呼ばれましたか？" } },
      { speaker: "目撃者", ja: "はい、警察官に詳しく説明を求められました。とても怖かったです。", reading: "Hai, keisatsukan ni kuwashiku setsumei o motomeraremashita. Totemo kowakatta desu.", en: { en: "Yes, I was asked by the officer to give a detailed explanation. It was very scary.", np: "हो, प्रहरी अधिकारीले मलाई विस्तृत विवरण दिन आग्रह गर्नुभयो। धेरै डरलाग्दो थियो।", jp: "はい、警察官に詳しい説明を求められました。とても怖かったです。" } },
    ],
    particles: [
      { particle: "passive 〜られる / 〜れる", note: { en: "Passive voice: action done to subject by agent (に). Group 2: 〜られる. Group 1: 〜れる. 呼ばれる = be called.", np: "निष्क्रिय आवाज: विषयमा (に) एजेन्टद्वारा गरिएको कार्य। Group 2: 〜られる। Group 1: 〜れる। 呼ばれる = बोलाइनु।", jp: "受け身：〜に（エージェント）によって〜される。2グループ：〜られる。1グループ：〜れる。呼ばれる＝呼ばれる。" } },
    ],
    grammarBullets: [
      { en: "Passive formation: Group 1 (u→a+れる: 書く→書かれる), Group 2 (remove る + られる: 食べる→食べられる), irregular (する→される, くる→こられる).", np: "निष्क्रिय गठन: Group 1 (u→a+れる), Group 2 (る हटाएर + られる), अनियमित (する→される, くる→こられる)।", jp: "受け身の作り方：1グループ（u→a＋れる）、2グループ（る→られる）、不規則（する→される・くる→こられる）。" },
      { en: "Direct passive: A は B に verb-passive. Direct action done TO the subject by B.", np: "प्रत्यक्ष निष्क्रिय: A は B に verb-passive। B द्वारा A मा सिधै गरिएको कार्य।", jp: "直接受け身：AはBにVられる。BによってAに直接行われる動作。" },
      { en: "Indirect passive: nuisance passive — action affects speaker indirectly (often unpleasant).", np: "अप्रत्यक्ष निष्क्रिय: कार्यले वक्तालाई अप्रत्यक्ष प्रभाव पार्छ (प्रायः अप्रिय)।", jp: "間接受け身（迷惑の受け身）：行為が間接的・迷惑的に話し手に影響する。" },
    ],
    mcqs: [
      {
        question: { en: "Passive form of 食べる (to eat):", np: "食べる को निष्क्रिय रूप:", jp: "食べるの受け身形は？" },
        choices: ["食べれる", "食べられる", "食べさせる", "食べてもらう"],
        correctIndex: 1,
        explanation: { en: "Group 2: remove る + られる: 食べる → 食べられる.", np: "Group 2: る हटाएर + られる: 食べる → 食べられる।", jp: "2グループ：る→られる＝食べられる。" },
      },
      {
        question: { en: "The letter was written by the teacher. Correct passive sentence:", np: "पत्र शिक्षकद्वारा लेखिएको थियो। सही निष्क्रिय वाक्य:", jp: "手紙は先生によって書かれました。正しい受け身文は？" },
        choices: [
          "先生は手紙を書きました。",
          "手紙は先生に書かれました。",
          "手紙が先生で書かれました。",
          "先生に手紙が書きました。",
        ],
        correctIndex: 1,
        explanation: { en: "Passive: 手紙 (subject) は 先生 (agent) に 書かれました.", np: "निष्क्रिय: 手紙 (कर्ता) は 先生 (एजेन्ट) に 書かれました।", jp: "受け身：手紙（主語）は先生（エージェント）に書かれました。" },
      },
    ],
    listening: {
      scenario: { en: "A news report about a stadium event: passive constructions describe what happened to the players and crowd.", np: "स्टेडियम कार्यक्रमबारे समाचार रिपोर्ट: निष्क्रिय निर्माणले खेलाडी र भिडमा के भयो वर्णन गर्छ।", jp: "スタジアムのイベントに関するニュースレポート：選手や観客に何が起きたかを受け身で描写する。" },
      instruction: { en: "Note each passive form: who acted (に), and who received the action.", np: "प्रत्येक निष्क्रिय रूप नोट गर्नुहोस्: कसले कार्य गर्यो (に), र कसले प्राप्त गर्यो।", jp: "受け身形をメモ：エージェント（に）と行為を受けた人を確認。" },
      keyPhrases: ["〜られました", "〜れました", "〜に", "受け身"],
    },
  }),
];
