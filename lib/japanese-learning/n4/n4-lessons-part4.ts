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
        question: { en: "Causative form of 食べる (to eat):", np: "食べる को कारण रूप:", jp: "食べるの使役形は？" },
        choices: ["食べさせる", "食べられる", "食べせる", "食べかせる"],
        correctIndex: 0,
        explanation: { en: "Group 2: remove る then add させる: 食べる → 食べさせる.", np: "Group 2: る हटाएर させる थप्नु: 食べる → 食べさせる।", jp: "2グループ：る→させる＝食べさせる。" },
      },
      {
        question: { en: "'Please let me try it' — which is correct?", np: "'मलाई प्रयास गर्न दिनुहोस्' — कुन सही छ?", jp: "「試させてください」の正しい形は？" },
        choices: ["試させてください", "試させられてください", "試してもらいます", "試させていただく"],
        correctIndex: 0,
        explanation: { en: "〜させてください = please let me do. Direct polite request for permission.", np: "〜させてください = मलाई गर्न दिनुहोस्। अनुमतिको विनम्र अनुरोध।", jp: "〜させてください：〜することを許可してください（許可の依頼）。" },
      },
      {
        question: { en: "What does 集まります mean?", np: "集まります को अर्थ के हो?", jp: "「集まります」の意味は？" },
        choices: ["to gather / come together", "to separate / part", "to live long", "to collect money"],
        correctIndex: 0,
        explanation: { en: "集まります (atsumаrimasu) = to gather, to assemble. Opposite: 別れます (to part).", np: "集まります = भेला हुनु, एकत्रित हुनु। विपरीत: 別れます।", jp: "集まります（あつまります）：集合する、集まる。反対：別れます。" },
      },
      {
        question: { en: "天気予報 means:", np: "天気予報 को अर्थ:", jp: "「天気予報」の意味は？" },
        choices: ["weather forecast", "newspaper headline", "temperature record", "climate change"],
        correctIndex: 0,
        explanation: { en: "天気 (tenki) = weather, 予報 (yohō) = forecast. 天気予報 = weather forecast.", np: "天気 = मौसम, 予報 = पूर्वानुमान। 天気予報 = मौसम पूर्वानुमान।", jp: "天気（てんき）＝weather、予報（よほう）＝forecast。合わせて天気予報。" },
      },
      {
        question: { en: "怖い means:", np: "怖い को अर्थ:", jp: "「怖い」の意味は？" },
        choices: ["scary / frightening", "delicious", "lonely", "strange"],
        correctIndex: 0,
        explanation: { en: "怖い (kowai) = scary, frightening. い-adjective used to describe fear.", np: "怖い (kowai) = डरलाग्दो, भयानक। い-विशेषण।", jp: "怖い（こわい）：恐ろしい、こわいと感じる。い形容詞。" },
      },
      {
        question: { en: "人口 means:", np: "人口 को अर्थ:", jp: "「人口」の意味は？" },
        choices: ["population", "person's mouth", "entrance for people", "human voice"],
        correctIndex: 0,
        explanation: { en: "人口 (jinkō) = population. 人 (person) + 口 (mouth/count) → number of people.", np: "人口 (jinkō) = जनसंख्या। 人 (मान्छे) + 口 (मुख/गणना) → मान्छेको संख्या।", jp: "人口（じんこう）：ある地域の人の数（人数）。" },
      },
      {
        question: { en: "〜によると is used to:", np: "〜によると प्रयोग हुन्छ:", jp: "「〜によると」の使い方は？" },
        choices: ["quote a source ('according to ~')", "give a reason ('because of ~')", "show contrast ('even though ~')", "make a request ('please ~')"],
        correctIndex: 0,
        explanation: { en: "〜によると = according to ~. Used to cite a source of information: 天気予報によると…", np: "〜によると = ~ अनुसार। जानकारीको स्रोत उद्धृत गर्न: 天気予報によると…", jp: "〜によると：情報の出所を示す。「天気予報によると〜」のように使う。" },
      },
      {
        question: { en: "音がします / 声がします means:", np: "音がします / 声がします को अर्थ:", jp: "「音がします・声がします」の意味は？" },
        choices: ["there is a sound / I hear a voice", "the sound is loud", "to make a sound intentionally", "sounds strange"],
        correctIndex: 0,
        explanation: { en: "〜がします = there is a ~ / I sense a ~. 音がします = I hear a sound; 声がします = I hear a voice; 味がします = it has a taste.", np: "〜がします = ~ छ / ~ महसुस हुन्छ। 音がします = आवाज सुनिन्छ।", jp: "〜がします：音・声・味などを感じる表現。音がします＝音が聞こえる。" },
      },
      {
        question: { en: "Choose the kanji for 'cosmetics':", np: "'सौन्दर्य प्रसाधन' को लागि कांजी छान्नुहोस्:", jp: "「化粧品」の読み方は？" },
        choices: ["けしょうひん", "かしょうひん", "けしょひん", "かそうひん"],
        correctIndex: 0,
        explanation: { en: "化粧品 (keshōhin) = cosmetics. 化粧 (keshō) = makeup, 品 (hin) = goods/product.", np: "化粧品 (keshōhin) = सौन्दर्य प्रसाधन। 化粧 = मेकअप, 品 = सामान।", jp: "化粧品（けしょうひん）：化粧（けしょう）＋品（ひん）＝化粧品。" },
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
      {
        question: { en: "Causative-passive of 飲む (to drink) — Group 1 short form:", np: "飲む को कारण-निष्क्रिय छोटो रूप:", jp: "飲むの使役受け身（短縮形）は？" },
        choices: ["飲まされる", "飲まれる", "飲ませられる", "飲まれさせる"],
        correctIndex: 0,
        explanation: { en: "飲む → 飲ませられる → short form 飲まされる. Group 1 u→a+される.", np: "飲む → 飲ませられる → छोटो रूप 飲まされる।", jp: "飲む→飲ませられる→短縮：飲まされる（1グループ）。" },
      },
      {
        question: { en: "The nuance of 〜させられる is:", np: "〜させられる को भाव हो:", jp: "「〜させられる」のニュアンスは？" },
        choices: ["doing something willingly", "being forced to do something against one's will", "allowing someone to do something", "doing something for someone's benefit"],
        correctIndex: 1,
        explanation: { en: "〜させられる = be made to do / forced to do — typically expresses reluctance or complaint.", np: "〜させられる = गर्न बाध्य गरिनु — प्रायः अनिच्छा वा गुनासो व्यक्त गर्छ।", jp: "〜させられる：不本意に何かをさせられる——不満・愚痴のニュアンス。" },
      },
      {
        question: { en: "感謝 (kansha) means:", np: "感謝 को अर्थ:", jp: "「感謝」の意味は？" },
        choices: ["gratitude / appreciation", "effort / hard work", "dislike / hatred", "memory / recollection"],
        correctIndex: 0,
        explanation: { en: "感謝 (kansha) = gratitude. 感謝しています = I am grateful.", np: "感謝 (kansha) = कृतज्ञता। 感謝しています = म कृतज्ञ छु।", jp: "感謝（かんしゃ）：ありがたく思うこと。感謝しています＝感謝している。" },
      },
      {
        question: { en: "一生懸命 (isshōkenmei) means:", np: "一生懸命 को अर्थ:", jp: "「一生懸命」の意味は？" },
        choices: ["with all one's effort / as hard as possible", "slowly and carefully", "all of a sudden", "from the beginning"],
        correctIndex: 0,
        explanation: { en: "一生懸命 = with all one's might, as hard as possible. 一生懸命練習する = to practice as hard as possible.", np: "一生懸命 = पूरा मेहनतसाथ, जति सक्दो। 一生懸命練習する = जति सक्दो कडा अभ्यास गर्नु।", jp: "一生懸命（いっしょうけんめい）：全力で・できる限り頑張る様子。" },
      },
      {
        question: { en: "おかげで is used to:", np: "おかげで प्रयोग हुन्छ:", jp: "「おかげで」の使い方は？" },
        choices: ["express gratitude for a positive result ('thanks to ~')", "express blame for a negative result", "introduce a reason for a request", "show a time relationship"],
        correctIndex: 0,
        explanation: { en: "おかげで = thanks to ~ (positive outcome). 練習のおかげで上手になった = thanks to practice I improved.", np: "おかげで = ~ को कारणले (सकारात्मक परिणाम)।", jp: "おかげで：（良い結果の原因を示す）〜のおかげで上手になった。" },
      },
      {
        question: { en: "仕方なく means:", np: "仕方なく को अर्थ:", jp: "「仕方なく」の意味は？" },
        choices: ["reluctantly / having no choice", "eagerly / voluntarily", "by chance / accidentally", "repeatedly / over and over"],
        correctIndex: 0,
        explanation: { en: "仕方なく (shikata naku) = reluctantly, having no choice. Often pairs with causative-passive.", np: "仕方なく = अनिच्छासाथ, कुनै उपाय नभएर।", jp: "仕方なく（しかたなく）：他に選択肢がなく、不本意ながら。使役受け身と相性がよい。" },
      },
      {
        question: { en: "How do you say 'I was forced to speak in front of everyone'?", np: "सबैको अगाडि बोल्न बाध्य गरियो — कसरी भन्ने?", jp: "「みんなの前で話させられた」の形は？" },
        choices: ["みんなの前で話させた。", "みんなの前で話させられた。", "みんなの前で話された。", "みんなの前で話してもらった。"],
        correctIndex: 1,
        explanation: { en: "話させられた = causative-passive of 話す (Group 1): 話す → 話させられた (was made to speak).", np: "話させられた = 話す को कारण-निष्क्रिय (Group 1): बोल्न बाध्य गरियो।", jp: "話させられた：話す（1グループ）の使役受け身。不本意に話させられた。" },
      },
      {
        question: { en: "Read the kanji: 野菜", np: "कांजी पढ्नुहोस्: 野菜", jp: "「野菜」の読み方は？" },
        choices: ["やさい", "のさい", "やすい", "やまい"],
        correctIndex: 0,
        explanation: { en: "野菜 (yasai) = vegetables. 野 (ya/no) = field, 菜 (sai) = greens/vegetable.", np: "野菜 (yasai) = तरकारी। 野 = खेत, 菜 = हरियो सब्जी।", jp: "野菜（やさい）：野（の・や）＋菜（な・さい）＝野菜（やさい）。" },
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
      {
        question: { en: "〜はずです vs 〜でしょう — key difference:", np: "〜はずです र 〜でしょう — मुख्य भिन्नता:", jp: "〜はずですと〜でしょうの違いは？" },
        choices: ["はず = logical deduction; でしょう = gut feeling / guess", "はず = past tense; でしょう = future", "はず = polite; でしょう = casual", "They mean exactly the same thing"],
        correctIndex: 0,
        explanation: { en: "はずです is based on logical evidence or prior information. でしょう is a soft guess or intuition.", np: "はずです = तार्किक प्रमाणमा आधारित। でしょう = अन्तर्ज्ञान वा अनुमान।", jp: "はずです：論理的根拠による推論。でしょう：直感・柔らかい推量。" },
      },
      {
        question: { en: "〜ないはずです means:", np: "〜ないはずです को अर्थ:", jp: "「〜ないはずです」の意味は？" },
        choices: ["should not be / is not expected to be", "probably is not", "must not do", "I don't think it is"],
        correctIndex: 0,
        explanation: { en: "〜ないはずです = should not be, not expected to be. Based on logical reasoning: 難しくないはずです = should not be difficult.", np: "〜ないはずです = हुनु हुँदैन / अपेक्षित छैन। तार्किक: 難しくないはずです = गाह्रो हुनुहुँदैन।", jp: "〜ないはずです：論理的に〜でないはずだ。難しくないはずです＝難しくないと考えられる。" },
      },
      {
        question: { en: "〜というのは is used to:", np: "〜というのは प्रयोग हुन्छ:", jp: "「〜というのは」の使い方は？" },
        choices: ["introduce a definition or explanation ('what is meant by ~')", "express hearsay ('I heard that ~')", "give a reason ('it is because ~')", "make a comparison ('similar to ~')"],
        correctIndex: 0,
        explanation: { en: "〜というのは introduces a clarification or definition: 以前のデータと違うというのは = what does it mean that it differs?", np: "〜というのは परिभाषा वा स्पष्टीकरण परिचय गराउँछ।", jp: "〜というのは：〜とはどういうことか（説明・定義の導入）。" },
      },
      {
        question: { en: "問題 (mondai) means:", np: "問題 को अर्थ:", jp: "「問題」の意味は？" },
        choices: ["problem / question / issue", "answer / solution", "experiment / test", "data / information"],
        correctIndex: 0,
        explanation: { en: "問題 (mondai) = problem, question, issue. Used in tests (問題1) and daily life.", np: "問題 (mondai) = समस्या, प्रश्न, मुद्दा।", jp: "問題（もんだい）：解決すべき事柄・テストの設問。" },
      },
      {
        question: { en: "実験 (jikken) means:", np: "実験 को अर्थ:", jp: "「実験」の意味は？" },
        choices: ["experiment / test (scientific)", "lesson / class", "result / outcome", "observation / discovery"],
        correctIndex: 0,
        explanation: { en: "実験 (jikken) = scientific experiment. 実験する = to conduct an experiment.", np: "実験 (jikken) = वैज्ञानिक प्रयोग। 実験する = प्रयोग गर्नु।", jp: "実験（じっけん）：科学的な試み。実験する＝実験を行う。" },
      },
      {
        question: { en: "Read the kanji: 測定", np: "कांजी पढ्नुहोस्: 測定", jp: "「測定」の読み方は？" },
        choices: ["そくてい", "はかてい", "そくじょう", "はかじょう"],
        correctIndex: 0,
        explanation: { en: "測定 (sokutei) = measurement. 測 (soku/haka) = measure, 定 (tei/sada) = determine/fix.", np: "測定 (sokutei) = मापन। 測 = मापन गर्नु, 定 = निर्धारण।", jp: "測定（そくてい）：測る（はかる）＋定める（さだめる）＝計測すること。" },
      },
      {
        question: { en: "誤差 (gosa) means:", np: "誤差 को अर्थ:", jp: "「誤差」の意味は？" },
        choices: ["measurement error / margin of error", "difference in opinion", "calculation result", "experimental method"],
        correctIndex: 0,
        explanation: { en: "誤差 (gosa) = error, margin of error. 誤 (go) = mistake, 差 (sa) = difference.", np: "誤差 (gosa) = त्रुटि, मापन त्रुटि। 誤 = गल्ती, 差 = फरक।", jp: "誤差（ごさ）：測定などの誤り・ズレ。誤（ご）＋差（さ）。" },
      },
      {
        question: { en: "Read the kanji: 研究者", np: "कांजी पढ्नुहोस्: 研究者", jp: "「研究者」の読み方は？" },
        choices: ["けんきゅうしゃ", "けんきゅうじゃ", "けんきゅうもの", "けいきゅうしゃ"],
        correctIndex: 0,
        explanation: { en: "研究者 (kenkyūsha) = researcher. 研究 (kenkyū) = research, 者 (sha) = person.", np: "研究者 (kenkyūsha) = शोधकर्ता। 研究 = अनुसन्धान, 者 = व्यक्ति।", jp: "研究者（けんきゅうしゃ）：研究（けんきゅう）＋者（しゃ）＝研究する人。" },
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
      {
        question: { en: "〜てしまいました expresses:", np: "〜てしまいました व्यक्त गर्छ:", jp: "「〜てしまいました」の意味は？" },
        choices: ["accidentally did / regrettably completed", "did in advance / prepared", "tried doing", "still doing"],
        correctIndex: 0,
        explanation: { en: "〜てしまう = completion with regret or unintentional action. 食べてしまった = ate it all up (regrettably).", np: "〜てしまう = पछुतोसाथ सम्पन्न वा अनजानमा गरेको कार्य।", jp: "〜てしまう：完了（後悔・意図しない行為）。食べてしまった＝全部食べてしまった。" },
      },
      {
        question: { en: "〜ておく means:", np: "〜ておく को अर्थ:", jp: "「〜ておく」の意味は？" },
        choices: ["to do something in advance / prepare for later", "to try doing something", "to finish doing completely", "to continue doing"],
        correctIndex: 0,
        explanation: { en: "〜ておく = do in advance for future benefit. 準備しておく = prepare (for later use).", np: "〜ておく = पछि उपयोगका लागि अघि नै गर्नु। 準備しておく = तयारी गरेर राख्नु।", jp: "〜ておく：後のために前もって行動する。準備しておく＝前もって準備する。" },
      },
      {
        question: { en: "〜てある means:", np: "〜てある को अर्थ:", jp: "「〜てある」の意味は？" },
        choices: ["something has been done (resultant state, intentional)", "something was done accidentally", "doing something for someone else", "trying to do something"],
        correctIndex: 0,
        explanation: { en: "〜てある = the resultant state of an intentional action. 窓が開けてある = the window has been opened (and is open).", np: "〜てある = जानाजानी गरिएको कार्यको परिणामी अवस्था। 窓が開けてある = झ्याल खोलिएको छ।", jp: "〜てある：意図的な行為の結果が残っている状態。窓が開けてある＝（誰かが）開けた状態。" },
      },
      {
        question: { en: "お世話になりました is used to:", np: "お世話になりました प्रयोग हुन्छ:", jp: "「お世話になりました」の使い方は？" },
        choices: ["thank someone for their care / support over time", "apologise for causing trouble", "ask for a favour politely", "congratulate someone on an achievement"],
        correctIndex: 0,
        explanation: { en: "お世話になりました = thank you for everything / for taking care of me. Standard farewell/gratitude phrase.", np: "お世話になりました = सबै कुराका लागि धन्यवाद / हेरविचार गर्नुभएकोमा। विदाइ वा कृतज्ञता अभिव्यक्तिको मानक वाक्यांश।", jp: "お世話になりました：長期間の支援・ケアへの感謝。別れ際によく使う。" },
      },
      {
        question: { en: "〜ようになる means:", np: "〜ようになる को अर्थ:", jp: "「〜ようになる」の意味は？" },
        choices: ["came to be able to / reached the point of doing", "decided to do from now on", "was made to do", "is supposed to do"],
        correctIndex: 0,
        explanation: { en: "〜ようになる = gradual change to a new state — came to be able to. 話せるようになった = came to be able to speak.", np: "〜ようになる = क्रमिक परिवर्तन — ... हुन सकिने भयो। 話せるようになった = बोल्न सक्ने भयो।", jp: "〜ようになる：段階的な変化。〜できるようになった＝〜できる状態になった。" },
      },
      {
        question: { en: "〜ためには means:", np: "〜ためには को अर्थ:", jp: "「〜ためには」の意味は？" },
        choices: ["in order to / for the purpose of", "because of / due to", "even if / regardless of", "when / at the time of"],
        correctIndex: 0,
        explanation: { en: "〜ためには = in order to. 上手になるためには続けることが大切 = in order to improve, continuing is important.", np: "〜ためには = ... का लागि / उद्देश्यले। 上手になるためには = राम्रो हुनका लागि।", jp: "〜ためには：〜という目的を達成するには。上手になるためには続けることが大切。" },
      },
      {
        question: { en: "Read the kanji: 合格", np: "कांजी पढ्नुहोस्: 合格", jp: "「合格」の読み方は？" },
        choices: ["ごうかく", "あいかく", "ごうかつ", "あいがく"],
        correctIndex: 0,
        explanation: { en: "合格 (gōkaku) = passing (an exam). 合格する = to pass. JLPT N4に合格する = to pass JLPT N4.", np: "合格 (gōkaku) = उत्तीर्ण हुनु। JLPT N4に合格する = JLPT N4 उत्तीर्ण हुनु।", jp: "合格（ごうかく）：試験などに通ること。JLPT N4に合格する。" },
      },
      {
        question: { en: "Read the kanji: 続ける", np: "कांजी पढ्नुहोस्: 続ける", jp: "「続ける」の読み方は？" },
        choices: ["つづける", "つつける", "ぞくける", "ぞくする"],
        correctIndex: 0,
        explanation: { en: "続ける (tsuzukeru) = to continue. 続 (tsuzuku/zoku) = continue/sequel. Group 2 verb.", np: "続ける (tsuzukeru) = जारी राख्नु। Group 2 क्रिया।", jp: "続ける（つづける）：2グループ動詞。続く＋ける＝続ける（継続する）。" },
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
