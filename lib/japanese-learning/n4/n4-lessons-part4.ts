import type { N5LessonSpec } from "@/lib/japanese-learning/n5/build-japanese-detail";
import { mkN4Lesson as mk } from "@/lib/japanese-learning/n4/n4-lesson-factory";

/** Days 22–28 — Minna II Lessons 47–50 + N4 Sprint Days 26–28 */
export const JP_N4_PART4: N5LessonSpec[] = [
  mk({
    minnaLesson: 47,
    dialogue: [
      { speaker: "部長", ja: "田中さん、新入社員を案内させましょう。", reading: "Buchō: Tanaka-san, shinnyu-shain o annai sasemasho.", en: { en: "Manager: Let me have Tanaka guide the new employees.", np: "म्यानेजर: टानाकालाई नयाँ कर्मचारीहरूलाई मार्गदर्शन गराउँछु।", jp: "部長：田中さんに新入社員を案内させましょう。" } },
      { speaker: "田中", ja: "わかりました。何時から始めさせましょうか。", reading: "Tanaka: Wakarimashita. Nanji kara hajimesasemasho ka.", en: { en: "Tanaka: Understood. From what time shall I have them start?", np: "टानाका: बुझें। कति बजेबाट सुरु गराउने?", jp: "田中：わかりました。何時から始めさせましょうか。" } },
      { speaker: "部長", ja: "9時から始めてください。新入社員には書類を全部読ませてください。", reading: "Buchō: Ku-ji kara hajimete kudasai. Shinnyu-shain ni wa shorui o zenbu yomasete kudasai.", en: { en: "Manager: Please start at 9. Have the new employees read all the documents.", np: "म्यानेजर: ९ बजेबाट सुरु गर्नुहोस्। नयाँ कर्मचारीहरूलाई सबै कागजात पढाउनुहोस्।", jp: "部長：9時から始めてください。新入社員には書類を全部読ませてください。" } },
      { speaker: "田中", ja: "資料のコピーをさせてもらいますか。", reading: "Tanaka: Shiryō no kopī o sasete moraimasu ka.", en: { en: "Tanaka: May I have them make copies of the materials?", np: "टानाका: के उनीहरूलाई सामग्रीको प्रतिलिपि बनाउन दिनुहुन्छ?", jp: "田中：資料のコピーをさせてもらえますか。" } },
      { speaker: "部長", ja: "もちろんです。必要な準備を全部させてください。", reading: "Buchō: Mochiron desu. Hitsuyō na junbi o zenbu sasete kudasai.", en: { en: "Manager: Of course. Please have them do all the necessary preparations.", np: "म्यानेजर: अवश्य। उनीहरूलाई सबै आवश्यक तयारी गर्न लगाउनुहोस्।", jp: "部長：もちろんです。必要な準備をすべてさせてください。" } },
    ],
    particles: [
      { particle: "causative 〜させる / 〜かせる", note: { en: "Causative voice: make/let someone do. Group 2: 〜させる. Group 1: 〜かせる (行く→行かせる). Irregular: する→させる, くる→こさせる.", np: "कारण आवाज: कसैलाई गर्न लगाउनु/दिनु। Group 2: 〜させる। Group 1: 〜かせる। अनियमित: する→させる।", jp: "使役：〜させる（〜かせる）。2グループ：〜させる。1グループ：〜かせる（行く→行かせる）。" } },
      { particle: "〜させてもらう / 〜させてください", note: { en: "Request to be allowed: 〜させてください = please let me do. 〜させてもらいます = I'll have you let me do.", np: "अनुमति माग्ने: 〜させてください = मलाई गर्न दिनुहोस्। 〜させてもらいます = गर्न दिनुहुन्छ।", jp: "許可の依頼：〜させてください（〜させてほしい）・〜させてもらいます。" } },
    ],
    grammarBullets: [
      { en: "Causative forms: Group 1 (u→a+せる: 書く→書かせる), Group 2 (remove る+させる: 食べる→食べさせる).", np: "कारण रूपहरू: Group 1 (u→a+せる), Group 2 (る हटाएर + させる)।", jp: "使役形：1グループ（u→a＋せる：書く→書かせる）、2グループ（る→させる：食べる→食べさせる）。" },
      { en: "Make vs let: context determines meaning — a parent 食べさせる (feeds/makes eat), or 食べさせてあげる (lets eat).", np: "गर्न लगाउनु र दिनु: सन्दर्भले अर्थ निर्धारण गर्छ।", jp: "「させる」はmakeとletの両方の意味になる。文脈が意味を決める。" },
    ],
    mcqs: [
      {
        question: { en: "Causative form of 飲む (to drink):", np: "飲む को कारण रूप:", jp: "飲むの使役形は？" },
        choices: ["飲ませる", "飲まれる", "飲んでいる", "飲みさせる"],
        correctIndex: 0,
        explanation: { en: "Group 1: u→a+せる: 飲む(む→ま) → 飲ませる.", np: "Group 1: u→a+せる: 飲む(む→ま) → 飲ませる।", jp: "1グループ：む→ま＋せる＝飲ませる。" },
      },
      {
        question: { en: "I asked to be allowed to use the computer. Correct form:", np: "मैले कम्प्युटर प्रयोग गर्न अनुमति माग्ें। सही रूप:", jp: "コンピュータを使わせてもらいました。正しい形は？" },
        choices: ["使わせられました。", "使わせてもらいました。", "使われました。", "使ってもらいました。"],
        correctIndex: 1,
        explanation: { en: "〜させてもらいました = I received permission to do = was allowed to do.", np: "〜させてもらいました = गर्न अनुमति पाएँ।", jp: "〜させてもらいました：〜する許可をもらった（させてもらう）。" },
      },
    ],
    listening: {
      scenario: { en: "A training session: senior staff assign tasks to new employees using causative forms.", np: "तालिम सत्र: वरिष्ठ कर्मचारीहरूले नयाँ कर्मचारीहरूलाई कारण रूप प्रयोग गरेर कार्य सुम्पन्छन्।", jp: "研修：先輩が新入社員に使役形でタスクを割り当てる。" },
      instruction: { en: "Note who is causing whom to do what. Use the format: [causer] made/let [person] do [action].", np: "कसले कसलाई के गराउँदैछ नोट गर्नुहोस्।", jp: "「誰が誰に何をさせているか」をメモ：[使役者]が[人]に[動作]をさせる。" },
      keyPhrases: ["〜させる", "〜させてください", "〜させてもらう", "〜させます"],
    },
  }),

  mk({
    minnaLesson: 48,
    dialogue: [
      { speaker: "大木", ja: "子供のころ、親に野菜をたくさん食べさせられました。", reading: "Ōki: Kodomo no koro, oya ni yasai o takusan tabesaseraremashita.", en: { en: "When I was a child, I was made to eat lots of vegetables by my parents.", np: "बच्चा हुँदा, मलाई बाबुआमाले धेरै तरकारी खुवाउनु भएको थियो।", jp: "子供のころ、親にたくさん野菜を食べさせられました。" } },
      { speaker: "三田", ja: "私もそうでした。毎日ピアノを弾かされました。", reading: "Mita: Watashi mo sō deshita. Mainichi piano o hikasaremashita.", en: { en: "Me too. I was forced to play piano every day.", np: "म पनि। मलाई हरेक दिन पियानो बजाउन बाध्य गरिन्थ्यो।", jp: "私もそうでした。毎日ピアノを弾かされました。" } },
      { speaker: "大木", ja: "嫌でしたか。", reading: "Ōki: Iya deshita ka.", en: { en: "Did you hate it?", np: "के तपाईंलाई नराम्रो लाग्थ्यो?", jp: "嫌でしたか。" } },
      { speaker: "三田", ja: "最初は嫌でしたが、今は感謝しています。あのころ一生懸命練習させられたおかげで、今は上手に弾けます。", reading: "Mita: Saisho wa iya deshita ga, ima wa kansha shite imasu. Ano koro isshōkenmei renshū saserareta okage de, ima wa jōzu ni hikemasu.", en: { en: "At first I hated it, but now I'm grateful. Thanks to being made to practice hard, I can play well now.", np: "पहिले नराम्रो लाग्थ्यो, तर अहिले कृतज्ञ छु। कडा अभ्यास गराइएको कारण, अहिले राम्रोसँग बजाउन सक्छु।", jp: "最初は嫌でしたが、今は感謝しています。一生懸命練習させられたおかげで、今は上手に弾けます。" } },
    ],
    particles: [
      { particle: "causative-passive 〜させられる", note: { en: "Be made to do / forced to do against one's will. Group 2: 〜させられる. Group 1: 〜かされる (contraction) or 〜わされる.", np: "गर्न बाध्य गरिनु / इच्छाविरुद्ध। Group 2: 〜させられる। Group 1: 〜かされる।", jp: "使役受け身「〜させられる」：（本意でなく）〜させられる。2グループ：〜させられる。1グループ：〜かされる。" } },
    ],
    grammarBullets: [
      { en: "Formation: causative + passive. Group 2: させ+られる = させられる. Group 1 (2-step or short form).", np: "गठन: कारण + निष्क्रिय। Group 2: させ+られる = させられる। Group 1 (2-चरण वा छोटो रूप)।", jp: "使役受け身の作り方：使役形＋受け身。2グループ：させ＋られる＝させられる。" },
      { en: "Nuance: forced to do something unpleasant. Often signals complaint or retrospective gratitude.", np: "बाध्य गरिएको अप्रिय कार्य। प्रायः गुनासो वा पछाडि फर्केर कृतज्ञता व्यक्त गर्छ।", jp: "ニュアンス：不本意な行為を強いられる。愚痴や（振り返っての）感謝を表すことが多い。" },
    ],
    mcqs: [
      {
        question: { en: "Causative-passive of 書く (to write):", np: "書く को कारण-निष्क्रिय रूप:", jp: "書くの使役受け身形は？" },
        choices: ["書かれる", "書かせる", "書かされる", "書かれさせる"],
        correctIndex: 2,
        explanation: { en: "Group 1 short causative-passive: 書く → 書かせられる → contracted 書かされる.", np: "Group 1 छोटो कारण-निष्क्रिय: 書く → 書かされる।", jp: "1グループ短縮形：書く→書かせられる→書かされる。" },
      },
      {
        question: { en: "I was forced to stay late at work. Correct expression:", np: "मलाई काममा ढिलो सम्म बस्न बाध्य गरियो। सही अभिव्यक्ति:", jp: "残業させられました。正しい表現は？" },
        choices: ["残業させました。", "残業させられました。", "残業されました。", "残業してもらいました。"],
        correctIndex: 1,
        explanation: { en: "〜させられました = was made to (do unwillingly) — causative-passive past.", np: "〜させられました = बाध्य गरियो — कारण-निष्क्रिय भूतकाल।", jp: "〜させられました：（不本意に）〜させられた——使役受け身の過去形。" },
      },
    ],
    listening: {
      scenario: { en: "Two adults reminisce about strict upbringings using causative-passive forms.", np: "दुई वयस्कले कारण-निष्क्रिय रूप प्रयोग गरेर कठोर बाल्यकाल सम्झन्छन्।", jp: "2人の大人が使役受け身を使って厳しかった幼少期を振り返る。" },
      instruction: { en: "Note each causative-passive. Was the speaker grateful or resentful in the end?", np: "प्रत्येक कारण-निष्क्रिय नोट गर्नुहोस्। अन्तमा वक्ता कृतज्ञ थियो वा रुष्ट?", jp: "使役受け身をメモ。最終的に話し手は感謝しているか、不満を持っているか確認。" },
      keyPhrases: ["〜させられる", "〜かされる", "仕方なく", "おかげで"],
    },
  }),

  mk({
    minnaLesson: 49,
    dialogue: [
      { speaker: "研究者", ja: "この問題は思ったほど難しくないはずです。", reading: "Kenkyūsha: Kono mondai wa omotta hodo muzukashikunai hazu desu.", en: { en: "Researcher: This problem should not be as difficult as expected.", np: "शोधकर्ता: यो समस्या अपेक्षाजति गाह्रो हुनुहुँदैन।", jp: "研究者：この問題は思ったほど難しくないはずです。" } },
      { speaker: "助手", ja: "そうですか。でも、以前のデータと違うというのはどういうことですか。", reading: "Joshu: Sō desu ka. Demo, izen no dēta to chigau to iu no wa dō iu koto desu ka.", en: { en: "Assistant: Is that so? But what does it mean that it differs from the previous data?", np: "सहायक: के त्यसो हो? तर अघिल्लो डेटाभन्दा फरक भन्नुको अर्थ के हो?", jp: "助手：そうですか。でも、以前のデータと違うというのはどういうことですか。" } },
      { speaker: "研究者", ja: "測定誤差があったはずです。もう一度測り直せば分かるはずです。", reading: "Kenkyūsha: Sokuteigosa ga atta hazu desu. Mō ichido hakari naoseba wakaru hazu desu.", en: { en: "Researcher: There must have been measurement error. If we remeasure, it should become clear.", np: "शोधकर्ता: मापन त्रुटि भएको हुनुपर्छ। फेरि मापन गरे स्पष्ट हुनुपर्छ।", jp: "研究者：測定誤差があったはずです。もう一度測り直せばわかるはずです。" } },
      { speaker: "助手", ja: "わかりました。では、もう一度実験してみます。", reading: "Joshu: Wakarimashita. De wa, mō ichido jikken shite mimasu.", en: { en: "Assistant: Understood. Then I'll try the experiment once more.", np: "सहायक: बुझें। त्यसो भए, एक पटक फेरि प्रयोग गरेर हेर्छु।", jp: "助手：わかりました。では、もう一度実験してみます。" } },
    ],
    particles: [
      { particle: "〜はずです", note: { en: "Should be / expected to be: speaker has logical reason to expect X. 難しくないはずです = should not be difficult.", np: "हुनुपर्छ / अपेक्षित: वक्तासँग X अपेक्षा गर्ने तार्किक कारण छ।", jp: "「〜はずです」：当然そうであるはず・論理的根拠に基づく期待。" } },
      { particle: "〜というのは", note: { en: "The thing called / what is meant by: introduces definition or clarification.", np: "भनिने / जसको अर्थ: परिभाषा वा स्पष्टीकरण परिचय गराउँछ।", jp: "「〜というのは」：〜というのの意味は・〜とはどういうことか（説明・定義）。" } },
      { particle: "〜ほど", note: { en: "To the extent of / as much as: 思ったほど難しくない = not as difficult as I thought.", np: "जतिसम्म / जत्तिको: 思ったほど難しくない = मैले सोचेजति गाह्रो छैन।", jp: "「〜ほど」：〜のくらい・〜ほど〜ない（思ったほど難しくない）。" } },
    ],
    grammarBullets: [
      { en: "〜はずです vs 〜でしょう: はず is based on logical deduction; でしょう is intuition.", np: "〜はずです र 〜でしょう: はず तार्किक निष्कर्षमा, でしょう अन्तर्ज्ञानमा।", jp: "〜はずですと〜でしょうの違い：はずは論理的推論、でしょうは直感。" },
      { en: "Negative expectation: 〜ないはずです = should not be. 〜なかったはずです = should not have been.", np: "नकारात्मक अपेक्षा: 〜ないはずです = हुनुहुँदैन। 〜なかったはずです = भएको हुनुहुँदैन।", jp: "否定の期待：〜ないはずです（そうでないはず）・〜なかったはずです（そうでなかったはず）。" },
    ],
    mcqs: [
      {
        question: { en: "She said she would come, so she should be here soon. Correct form:", np: "उनले आउने भनिन्, त्यसैले चाँडै यहाँ आउनुपर्छ। सही रूप:", jp: "彼女は来ると言っていた、だからもうすぐ来るはずです。正しい形は？" },
        choices: ["来るかもしれません。", "来るはずです。", "来るでしょう。", "来るそうです。"],
        correctIndex: 1,
        explanation: { en: "〜はずです = logical expectation based on what was said — certain from the speaker's logic.", np: "〜はずです = भनिएको आधारमा तार्किक अपेक्षा।", jp: "〜はずです：言ったことに基づく論理的な期待。" },
      },
      {
        question: { en: "Not as big as I thought. Correct form:", np: "मैले सोचेजति ठूलो छैन। सही रूप:", jp: "思ったほど大きくない。正しい形は？" },
        choices: ["思ったより大きい。", "思ったほど大きくない。", "思ったので大きい。", "思っていたほど大きいです。"],
        correctIndex: 1,
        explanation: { en: "〜ほど〜ない = not to the extent of; 思ったほど大きくない = not as big as expected.", np: "〜ほど〜ない = अपेक्षाजति छैन।", jp: "〜ほど〜ない：〜のくらいには〜でない。思ったほど大きくない。" },
      },
    ],
    listening: {
      scenario: { en: "A science programme: two researchers discuss unexpected results using はずです and ほど comparisons.", np: "विज्ञान कार्यक्रम: दुई शोधकर्ताले はずです र ほど तुलना प्रयोग गरेर अप्रत्याशित परिणामहरू छलफल गर्छन्।", jp: "科学番組：研究者2人がはずですとほどを使って予期しない結果を議論する。" },
      instruction: { en: "Note every はずです and ほど comparison. What was expected vs what was found?", np: "प्रत्येक はずです र ほど तुलना नोट गर्नुहोस्।", jp: "はずですとほどの比較をメモ。期待と実際の差を確認。" },
      keyPhrases: ["〜はずです", "〜ほど", "〜というのは", "思ったより"],
    },
  }),

  mk({
    minnaLesson: 50,
    dialogue: [
      { speaker: "田中", ja: "今学期でみんなの日本語IIが終わりますね。一年間お世話になりました。", reading: "Tanaka: Kongakki de Minna no Nihongo II ga owarimasu ne. Ichinenkang o-sewa ni narimashita.", en: { en: "This semester Minna no Nihongo II ends. Thank you for everything this year.", np: "यस सेमेस्टरमा Minna no Nihongo II सकिन्छ। यस वर्षभर धन्यवाद।", jp: "今学期でみんなの日本語IIが終わりますね。一年間お世話になりました。" } },
      { speaker: "先生", ja: "皆さんよく頑張りました。JLPT N4は難しいですが、きっと合格できるはずです。", reading: "Sensei: Minasan yoku ganbarimashita. JLPT N4 wa muzukashii desu ga, kitto gōkaku dekiru hazu desu.", en: { en: "Everyone worked very hard. JLPT N4 is difficult but you should surely be able to pass.", np: "सबैले धेरै मेहनत गर्नुभयो। JLPT N4 गाह्रो छ तर तपाईंहरू पक्कै उत्तीर्ण हुन सक्नुहुन्छ।", jp: "皆さんよく頑張りました。JLPT N4は難しいですが、きっと合格できるはずです。" } },
      { speaker: "学生B", ja: "先生のおかげで、日本語がたくさん話せるようになりました。", reading: "Gakusei B: Sensei no okage de, Nihongo ga takusan hanaseru yō ni narimashita.", en: { en: "Thanks to you sensei, we've become able to speak a lot of Japanese.", np: "गुरुको कृपाले, हामी धेरै जापानी बोल्न सक्ने भयौं।", jp: "先生のおかげで、日本語がたくさん話せるようになりました。" } },
      { speaker: "先生", ja: "これからも日本語を使うようにしてください。上手になるためには、続けることが大切です。", reading: "Sensei: Korekara mo Nihongo o tsukau yō ni shite kudasai. Jōzu ni naru tame ni wa, tsuzukeru koto ga taisetsu desu.", en: { en: "Please continue to use Japanese. To get better, continuing is the key.", np: "आगामी दिनमा पनि जापानी प्रयोग गर्नुहोस्। राम्रो बन्नका लागि, जारी राख्नु नै कुञ्जी हो।", jp: "これからも日本語を使うようにしてください。上手になるためには、続けることが大切です。" } },
      { speaker: "田中", ja: "わかりました。これからも頑張ります！", reading: "Tanaka: Wakarimashita. Korekara mo ganbarimasu!", en: { en: "Understood. We'll keep trying!", np: "बुझें। हामी प्रयास गर्दै रहनेछौं!", jp: "わかりました。これからも頑張ります！" } },
    ],
    particles: [
      { particle: "Review: conditional forms", note: { en: "〜ば (if), 〜たら (when/if), 〜ても (even if). Each carries different nuance and register.", np: "समीक्षा: सर्त रूपहरू — 〜ば (यदि), 〜たら (जब/यदि), 〜ても (भए पनि)।", jp: "条件形の復習：〜ば（もし）・〜たら（〜したとき）・〜ても（たとえ〜でも）。" } },
      { particle: "Review: passive & causative", note: { en: "〜られる (passive), 〜させる (causative), 〜させられる (causative-passive).", np: "समीक्षा: निष्क्रिय र कारण — 〜られる, 〜させる, 〜させられる।", jp: "受け身・使役の復習：〜られる（受け身）・〜させる（使役）・〜させられる（使役受け身）。" } },
    ],
    grammarBullets: [
      { en: "Core N4 grammar lattice: potential, passive, causative, causative-passive, conditionals, hearsay, appearance.", np: "मुख्य N4 व्याकरण जाल: संभाव्य, निष्क्रिय, कारण, कारण-निष्क्रिय, सर्त, भनाइ, देखिने।", jp: "N4文法の骨格：可能・受け身・使役・使役受け身・条件・伝聞・推量。" },
      { en: "Key distinctions to nail for JLPT N4: てしまう (completion), ておく (prep), てみる (try), てある (resultant state).", np: "JLPT N4 का लागि मुख्य भिन्नताहरू: てしまう, ておく, てみる, てある।", jp: "JLPT N4で押さえるポイント：てしまう・ておく・てみる・てある。" },
    ],
    mcqs: [
      {
        question: { en: "Which sentence contains a causative-passive?", np: "कुन वाक्यमा कारण-निष्क्रिय छ?", jp: "使役受け身を含む文はどれか？" },
        choices: [
          "先生が学生に本を読ませました。",
          "学生は先生に本を読まされました。",
          "先生は本を読まれました。",
          "学生が本を読みました。",
        ],
        correctIndex: 1,
        explanation: { en: "読まされました = was made to read — causative-passive (Group 1 short form).", np: "読まされました = पढ्न बाध्य गरियो — कारण-निष्क्रिय।", jp: "読まされました：1グループ短縮使役受け身。" },
      },
      {
        question: { en: "Which form expresses 'I tried doing yoga and it was refreshing'?", np: "कुन रूपले 'मैले योग गर्ने प्रयास गरें र ताजगी महसुस भयो' व्यक्त गर्छ?", jp: "「ヨガをやってみたら、すっきりした」の〜てみたに使われている文法は？" },
        choices: [
          "〜てしまう (completed by accident)",
          "〜ておく (do in advance)",
          "〜てみる (try doing)",
          "〜てある (resultant state)",
        ],
        correctIndex: 2,
        explanation: { en: "〜てみる = try doing (and see the result): やってみたら = when I tried doing it.", np: "〜てみる = प्रयास गर्नु (र परिणाम हेर्नु): やってみたら = गर्दा।", jp: "〜てみる：試しにやってみる。やってみたら＝試してみたところ。" },
      },
    ],
    listening: {
      scenario: { en: "End-of-course reflection: students and teacher review all grammar patterns covered, with natural examples.", np: "कोर्सको अन्त चिन्तन: विद्यार्थी र शिक्षक सबै व्याकरण ढाँचाहरू प्राकृतिक उदाहरणसहित समीक्षा गर्छन्।", jp: "コース終了の振り返り：生徒と教師がカバーした文法パターンを自然な例文で復習する。" },
      instruction: { en: "This is an integration drill. For each sentence you hear, identify the grammar pattern.", np: "यो एकीकरण अभ्यास हो। प्रत्येक वाक्यका लागि व्याकरण ढाँचा पहिचान गर्नुहोस्।", jp: "統合ドリル：聞こえた文ごとに文法パターンを特定する。" },
      keyPhrases: ["〜ようになった", "〜てしまった", "〜ておく", "〜させられた"],
    },
  }),

  // Sprint Days 26–28
  mk({
    minnaLesson: null,
    bookRef: "JLPT N4 Sprint · Day 26",
    dialogue: [
      { speaker: "コーチ", ja: "今日はN4の文法を総復習しましょう。", reading: "Kyō wa N4 no bunpō o sōfukushū shimashō.", en: { en: "Today let's do a comprehensive grammar review of N4.", np: "आज N4 को व्याकरणको सम्पूर्ण समीक्षा गरौं।", jp: "今日はN4の文法を総復習しましょう。" } },
      { speaker: "学習者", ja: "受け身と使役がまだ少し難しいです。", reading: "Ukemi to shieki ga mada sukoshi muzukashii desu.", en: { en: "The passive and causative are still a little difficult.", np: "निष्क्रिय र कारण रूप अझै अलिकति गाह्रो छ।", jp: "受け身と使役がまだ少し難しいです。" } },
      { speaker: "コーチ", ja: "大丈夫です。パターンさえ覚えれば、使えるようになりますよ。", reading: "Daijōbu desu. Patān sae oboereba, tsukaeru yō ni narimasu yo.", en: { en: "It's fine. As long as you memorise the patterns, you'll be able to use them.", np: "ठीक छ। ढाँचाहरू सम्झे मात्र, प्रयोग गर्न सक्ने हुनुहुन्छ।", jp: "大丈夫です。パターンさえ覚えれば、使えるようになりますよ。" } },
      { speaker: "学習者", ja: "はい、もっと練習するようにします。", reading: "Hai, motto renshū suru yō ni shimasu.", en: { en: "Yes, I'll try to practice more.", np: "हो, म अझ बढी अभ्यास गर्ने प्रयास गर्छु।", jp: "はい、もっと練習するようにします。" } },
    ],
    particles: [
      { particle: "Sprint: passive summary", note: { en: "〜れる/〜られる. G1: u→a+れる. G2: る→られる. Irregular: する→される, くる→こられる.", np: "निष्क्रिय सारांश। Group 1: u→a+れる. Group 2: る→られる।", jp: "受け身まとめ：G1→a段＋れる、G2→られる、不規則：される・こられる。" } },
      { particle: "Sprint: causative summary", note: { en: "〜かせる/〜させる. G1: u→a+せる. G2: る→させる. Irregular: する→させる, くる→こさせる.", np: "कारण सारांश। Group 1: u→a+せる. Group 2: る→させる।", jp: "使役まとめ：G1→a段＋せる、G2→させる、不規則：させる・こさせる。" } },
    ],
    grammarBullets: [
      { en: "Sprint Day 26 focus: verb form drills — passive, causative, causative-passive — all three in one session.", np: "स्प्रिन्ट दिन २६: क्रिया रूप अभ्यास — निष्क्रिय, कारण, कारण-निष्क्रिय — एकै सत्रमा।", jp: "スプリントDay26：動詞形ドリル——受け身・使役・使役受け身の3つを一気に練習。" },
      { en: "Drill pattern: take a base verb, produce all three forms in a row.", np: "अभ्यास ढाँचा: आधार क्रिया लिएर क्रममा तीनवटै रूप बनाउनु।", jp: "ドリルパターン：基本動詞を取り、3形を一気に作る練習。" },
    ],
    mcqs: [
      {
        question: { en: "Produce all three forms of 書く: passive / causative / causative-passive:", np: "書く का तीन रूप बनाउनुहोस्: निष्क्रिय / कारण / कारण-निष्क्रिय:", jp: "書くの3形：受け身・使役・使役受け身は？" },
        choices: [
          "書かれる / 書かせる / 書かされる",
          "書ける / 書かせる / 書かれる",
          "書かれる / 書ける / 書かせられる",
          "書かれる / 書かせる / 書いてもらう",
        ],
        correctIndex: 0,
        explanation: { en: "書かれる (passive) / 書かせる (causative) / 書かされる (causative-passive, short form).", np: "書かれる (निष्क्रिय) / 書かせる (कारण) / 書かされる (कारण-निष्क्रिय)।", jp: "書かれる（受け身）・書かせる（使役）・書かされる（使役受け身短縮形）。" },
      },
      {
        question: { en: "Which form means 'was made to read'?", np: "कुन रूपले 'पढ्न बाध्य गरियो' भन्छ?", jp: "「読まされた」の意味は？" },
        choices: ["読まれた (passive)", "読ませた (causative)", "読まされた (causative-passive)", "読んだ (plain past)"],
        correctIndex: 2,
        explanation: { en: "読まされた = causative-passive — was forced to read (unwillingly).", np: "読まされた = कारण-निष्क्रिय — पढ्न बाध्य गरियो (अनिच्छासाथ)।", jp: "読まされた：使役受け身——不本意に読まされた。" },
      },
    ],
    listening: {
      scenario: { en: "N4 sprint listening drill: news-style audio with passive constructions and conditional clauses.", np: "N4 स्प्रिन्ट सुन्ने अभ्यास: निष्क्रिय निर्माण र सर्त उपवाक्यहरूसहित समाचार शैलीको अडियो।", jp: "N4スプリント聴解ドリル：受け身と条件節を含むニュース風音声。" },
      instruction: { en: "Pull out every passive and conditional form. Write them down before moving to test papers.", np: "प्रत्येक निष्क्रिय र सर्त रूप निकाल्नुहोस्। परीक्षा कागजातमा जानुअघि लेख्नुहोस्।", jp: "受け身と条件節をすべて抜き出し、テスト前にメモを固める。" },
      keyPhrases: ["〜られる", "〜させる", "〜たら", "〜ても"],
    },
  }),

  mk({
    minnaLesson: null,
    bookRef: "JLPT N4 Sprint · Day 27",
    dialogue: [
      { speaker: "練習者", ja: "今日は聴解の練習をしましょう。", reading: "Kyō wa chōkai no renshū o shimashō.", en: { en: "Today let's practice listening comprehension.", np: "आज श्रवण बोध अभ्यास गरौं।", jp: "今日は聴解の練習をしましょう。" } },
      { speaker: "パートナー", ja: "いいですね。聴解が苦手なので、もっと練習しなければなりません。", reading: "Ii desu ne. Chōkai ga nigate na no de, motto renshū shinakereba narimasen.", en: { en: "Good idea. Since I'm bad at listening, I must practice more.", np: "राम्रो विचार। श्रवण मलाई कमजोर भएकाले, अझ बढी अभ्यास गर्नैपर्छ।", jp: "いいですね。聴解が苦手なので、もっと練習しなければなりません。" } },
      { speaker: "練習者", ja: "N4の聴解には、会話の文脈を素早く理解することが大切です。", reading: "N4 no chōkai ni wa, kaiwa no bunmyaku o subayaku rikai suru koto ga taisetsu desu.", en: { en: "For N4 listening, it's important to quickly understand the context of conversations.", np: "N4 को श्रवणका लागि, वार्तालापको सन्दर्भ छिट्टै बुझ्न सक्नु महत्त्वपूर्ण छ।", jp: "N4の聴解には、会話の文脈を素早く理解することが大切です。" } },
    ],
    particles: [
      { particle: "Sprint: listening strategies", note: { en: "For N4 listening: key phrases to catch — purpose (ために), result (てしまった), hearsay (そうです/らしい), inference (ようです).", np: "N4 सुनाइका लागि: मुख्य वाक्यांशहरू — उद्देश्य (ために), परिणाम (てしまった), भनाइ (そうです/らしい), अनुमान (ようです)।", jp: "N4聴解の鍵：ために（目的）・てしまった（完了）・そうです/らしい（伝聞）・ようです（推量）。" } },
    ],
    grammarBullets: [
      { en: "Sprint Day 27: listening focus — context traps (hearsay vs observation markers), request levels, obligation expressions.", np: "स्प्रिन्ट दिन २७: सुनाइ फोकस — सन्दर्भ जाल, अनुरोध स्तर, दायित्व अभिव्यक्ति।", jp: "スプリントDay27：聴解フォーカス——文脈のわな（伝聞vs観察）・依頼の丁寧さ・義務表現。" },
    ],
    mcqs: [
      {
        question: { en: "In listening, how do you distinguish でしょう from かもしれません?", np: "सुनाइमा, でしょう र かもしれません कसरी फरक गर्नुहुन्छ?", jp: "聴解でしょうとかもしれませんの聞き分け方は？" },
        choices: [
          "Both mean the same thing.",
          "でしょう = probably (more certain); かもしれません = maybe (less certain).",
          "でしょう = definitely; かもしれません = probably.",
          "でしょう is past tense; かもしれません is present tense.",
        ],
        correctIndex: 1,
        explanation: { en: "でしょう expresses moderate-to-high certainty; かもしれません expresses lower possibility.", np: "でしょう मध्यम-उच्च निश्चितता; かもしれません कम सम्भावना।", jp: "でしょうは中程度〜高い確信；かもしれませんは低い可能性。" },
      },
      {
        question: { en: "You hear: 田中さんが来るそうです. What is the source of this information?", np: "तपाईंले सुन्नुभयो: 田中さんが来るそうです. यस जानकारीको स्रोत के हो?", jp: "田中さんが来るそうですが聞こえた。情報源は？" },
        choices: ["The speaker saw Tanaka coming.", "The speaker heard it from someone.", "The speaker is guessing.", "The speaker is warning."],
        correctIndex: 1,
        explanation: { en: "〜そうです (hearsay) = information heard from an external source, not direct observation.", np: "〜そうです (भनाइ) = बाह्य स्रोतबाट सुनिएको जानकारी, प्रत्यक्ष अवलोकन होइन।", jp: "〜そうです（伝聞）：直接見たのではなく、誰かから聞いた情報。" },
      },
    ],
    listening: {
      scenario: { en: "Mixed N4 listening drill: short conversations using all four conjecture markers (でしょう, かもしれません, はずです, らしい).", np: "मिश्रित N4 सुनाइ अभ्यास: सबै चार अनुमान मार्करहरू प्रयोग गरेर छोटा वार्तालापहरू।", jp: "N4総合聴解ドリル：推量マーカー4種（でしょう・かもしれません・はずです・らしい）を使った短い会話。" },
      instruction: { en: "After each clip, identify: which conjecture marker was used and what was the certainty level?", np: "प्रत्येक क्लिपपछि पहिचान गर्नुहोस्: कुन अनुमान मार्कर प्रयोग भयो र निश्चितता स्तर के थियो?", jp: "各クリップの後：どの推量マーカーが使われ、確信度はどのくらいかを確認。" },
      keyPhrases: ["でしょう", "かもしれません", "はずです", "らしい"],
    },
  }),

  mk({
    minnaLesson: null,
    bookRef: "JLPT N4 Sprint · Day 28",
    dialogue: [
      { speaker: "受験者", ja: "明日いよいよJLPT N4の試験です。準備はできていますか。", reading: "Jūkensha: Ashita iyo iyo JLPT N4 no shiken desu. Junbi wa dekite imasu ka.", en: { en: "Candidate: Tomorrow is finally the JLPT N4 exam. Are you prepared?", np: "परीक्षार्थी: भोलि अन्तमा JLPT N4 परीक्षा छ। तपाईं तयार हुनुहुन्छ?", jp: "受験者：明日いよいよJLPT N4の試験です。準備はできていますか。" } },
      { speaker: "友人", ja: "はい、やるべきことはやっておきました。あとは落ち着いて臨むだけです。", reading: "Yūjin: Hai, yarubeki koto wa yatte okimashita. Ato wa ochitsuite nozomudake desu.", en: { en: "Friend: Yes, I've done what needs to be done. All that's left is to stay calm and take it.", np: "साथी: हो, गर्नुपर्ने काम गरिसकें। बाँकी शान्त भएर परीक्षा दिने मात्र हो।", jp: "友人：はい、やるべきことはやっておきました。あとは落ち着いて臨むだけです。" } },
      { speaker: "受験者", ja: "そうですね。諦めなければ、きっと合格できるはずです。", reading: "Jūkensha: Sō desu ne. Akiramenakereba, kitto gōkaku dekiru hazu desu.", en: { en: "Candidate: True. As long as you don't give up, you should surely pass.", np: "परीक्षार्थी: सही छ। हार नमाने सम्म, पक्कै उत्तीर्ण हुनुपर्छ।", jp: "受験者：そうですね。諦めなければ、きっと合格できるはずです。" } },
    ],
    particles: [
      { particle: "Sprint: exam mindset", note: { en: "Day 28 is about consolidating confidence: all N4 forms reviewed, listening primed, kanji ready.", np: "दिन २८ आत्मविश्वास बलियो बनाउनको बारेमा हो: सबै N4 रूपहरू समीक्षा, सुनाइ तयार, कांजी तयार।", jp: "Day28：自信の定着——N4の全形の復習・聴解の準備・漢字の最終確認。" } },
    ],
    grammarBullets: [
      { en: "Sprint Day 28: final mock mindset — time management, question-order strategy, skip-and-return on hard items.", np: "स्प्रिन्ट दिन २८: अन्तिम मॉक मानसिकता — समय व्यवस्थापन, प्रश्न-क्रम रणनीति, गाह्रो प्रश्न छोडेर फर्कनु।", jp: "スプリントDay28：模試の心構え——時間配分・問題順序の戦略・難問のスキップ＆戻り。" },
      { en: "Last review: N4 kanji vocabulary — pitch and context clues often decide the right answer.", np: "अन्तिम समीक्षा: N4 कांजी शब्दभण्डार — पिच र सन्दर्भ सुराकहरू प्रायः सही जवाफ निर्धारण गर्छन्।", jp: "最終復習：N4漢字語彙——ピッチとコンテキストのヒントが正解を決めることが多い。" },
    ],
    mcqs: [
      {
        question: { en: "Best strategy when you don't know a listening answer:", np: "सुनाइको जवाफ थाहा नभएमा उत्तम रणनीति:", jp: "聴解の答えが分からないときの最善策は？" },
        choices: [
          "Skip the question and never return.",
          "Mark a guess, flag it, and move on — come back if time allows.",
          "Stop the exam and ask the examiner.",
          "Close your eyes and concentrate for 2 minutes.",
        ],
        correctIndex: 1,
        explanation: { en: "In timed exams: mark a best guess, move on, and revisit if time permits.", np: "समयबद्ध परीक्षामा: उत्तम अनुमान चिनो लगाउनुहोस्, अघि बढ्नुहोस्, समय भएमा फर्कनुहोस्।", jp: "時間制限のある試験では：最善の推測にマークし、先に進む。時間が余れば戻る。" },
      },
      {
        question: { en: "Which N4 grammar is tested most heavily in reading comprehension?", np: "पढाइ बुझाइमा कुन N4 व्याकरण सबैभन्दा बढी परीक्षण गरिन्छ?", jp: "読解で最も頻出のN4文法は？" },
        choices: [
          "Numbers and counters",
          "Conditionals, て-form compounds, conjecture markers",
          "Hiragana recognition",
          "Katakana only",
        ],
        correctIndex: 1,
        explanation: { en: "N4 reading comprehension heavily tests conditionals (ば/たら/ても), te-form patterns, and conjecture markers.", np: "N4 पढाइ बुझाइमा सर्त, て-रूप ढाँचा, र अनुमान मार्करहरू भारी परीक्षण हुन्छन्।", jp: "N4読解では条件（ば・たら・ても）・て形複合・推量マーカーが頻出。" },
      },
    ],
    listening: {
      scenario: { en: "Final N4 sprint: a timed 5-clip mock. Each clip uses a different N4 grammar pattern. Identify the pattern in each.", np: "अन्तिम N4 स्प्रिन्ट: समयबद्ध ५-क्लिप मॉक। प्रत्येक क्लिप फरक N4 व्याकरण ढाँचा प्रयोग गर्छ।", jp: "N4最終スプリント：5クリップの時間制限付きモック。各クリップで異なるN4文法パターンを使用。" },
      instruction: { en: "For each clip: write the grammar pattern, key vocab, and your answer before revealing it.", np: "प्रत्येक क्लिपका लागि: व्याकरण ढाँचा, मुख्य शब्दभण्डार, र जवाफ प्रकट गर्नुअघि लेख्नुहोस्।", jp: "各クリップ：文法パターン・主要語彙・答えを答え合わせ前にメモする。" },
      keyPhrases: ["全パターン復習", "聴解戦略", "時間管理", "合格"],
    },
  }),
];
