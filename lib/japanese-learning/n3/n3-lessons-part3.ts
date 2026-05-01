import type { N5LessonSpec } from "@/lib/japanese-learning/n5/build-japanese-detail";
import { mkN3Lesson as mk } from "@/lib/japanese-learning/n3/n3-lesson-factory";

/** Days 15–21 — Week 3 N3 grammar */
export const JP_N3_PART3: N5LessonSpec[] = [
  // Day 15: Honorific forms
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "部長", ja: "山田部長はもうお帰りになりましたか。", reading: "Yamada buchō wa mō okaeri ni narimashita ka.", en: { en: "Has Director Yamada already gone home?", np: "यामाडा विभाग प्रमुख पहिले नै घर फर्कनु भयो?", jp: "山田部長はもうお帰りになりましたか？" } },
      { speaker: "社員", ja: "はい、1時間前にお帰りになりました。", reading: "Hai, ichijikan mae ni okaeri ni narimashita.", en: { en: "Yes, he went home an hour ago.", np: "हो, एक घण्टा अगाडि घर फर्कनु भयो।", jp: "はい、1時間前にお帰りになりました。" } },
      { speaker: "部長", ja: "田中先生はご存知ですか。このプロジェクトについて。", reading: "Tanaka sensei wa gozonji desu ka. Kono purojekuto ni tsuite.", en: { en: "Is Professor Tanaka aware of this? About this project.", np: "तानाका गुरु थाहा पाउनुहुन्छ? यो परियोजनाबारे।", jp: "田中先生はご存知ですか？このプロジェクトについて。" } },
      { speaker: "社員", ja: "はい、先生はすでにご覧になっていらっしゃいます。", reading: "Hai, sensei wa sudeni goran ni natte irasshaimasu.", en: { en: "Yes, the professor has already reviewed it.", np: "हो, गुरु पहिले नै हेर्नु भइसक्नुभयो।", jp: "はい、先生はすでにご覧になっていらっしゃいます。" } },
      { speaker: "部長", ja: "ありがとう。では私もご連絡をいたします。", reading: "Arigatō. Dewa watashi mo gorenraku o itashimasu.", en: { en: "Thank you. Then I'll also get in touch.", np: "धन्यवाद। त्यसो भए म पनि सम्पर्क गर्छु।", jp: "ありがとう。では私もご連絡をいたします。" } },
    ],
    particles: [
      { particle: "お〜になる (honorific)", note: { en: "Honors the subject's action: お帰りになる = goes home (honorific for 3rd party or superior). Pattern: お + verb stem + になる.", np: "विषयको कार्यलाई सम्मान: お帰りになる = घर फर्कनुहुन्छ (सम्मानपूर्वक)।", jp: "相手の動作を敬う：お帰りになる。形：お＋動詞語幹＋になる。" } },
      { particle: "ご〜になる (honorific Sino-Japanese)", note: { en: "Used with Sino-Japanese (音読み) verb stems: ご覧になる (look/see), ご存知 (know), ご利用になる (use).", np: "सिनो-जापानी क्रिया स्टेमसँग: ご覧になる (हेर्नु), ご存知 (थाहा हुनु)।", jp: "漢語動詞語幹に使う：ご覧になる（見る）・ご存知（知っている）・ご利用になる（使う）。" } },
      { particle: "いらっしゃる / おいでになる", note: { en: "Super-honorific for ある/いる/行く/来る: 先生はいらっしゃいます = the teacher is here.", np: "ある/いる/行く/来る को अत्यन्त सम्मानपूर्वक रूप: 先生はいらっしゃいます।", jp: "ある・いる・行く・来るの尊敬語：先生はいらっしゃいます。" } },
    ],
    grammarBullets: [
      { en: "Honorific (尊敬語 sonkeigo): used to elevate the actions of the person you're speaking TO or ABOUT (superior). Never used for oneself.", np: "सम्मानजनक (尊敬語): जससँग वा जसबारे बोल्दै हुनुहुन्छ (वरिष्ठ) उनको कार्य उठाउन। आफ्नै लागि कहिल्यै प्रयोग गरिन्न।", jp: "尊敬語：話し相手や話題の人物（目上）の行動を高める。自分には使わない。" },
      { en: "Common honorific substitutions: 言う→おっしゃる, 食べる/飲む→召し上がる, いる→いらっしゃる, くれる→くださる.", np: "सामान्य सम्मानजनक प्रतिस्थापन: 言う→おっしゃる, 食べる/飲む→召し上がる, いる→いらっしゃる।", jp: "尊敬語の特殊形：言う→おっしゃる、食べる・飲む→召し上がる、いる→いらっしゃる、くれる→くださる。" },
      { en: "Pattern: お + Japanese-origin verb stem + になる; ご + Sino-Japanese stem + になる (or irregular forms above).", np: "ढाँचा: お + जापानी मूल क्रिया स्टेम + になる; ご + सिनो-जापानी स्टेम + になる।", jp: "形：お＋和語動詞語幹＋になる；ご＋漢語語幹＋になる（または上記特殊形）。" },
    ],
    mcqs: [
      {
        question: { en: "Which is the correct honorific for 先生が読む?", np: "先生が読む को सही सम्मानजनक के हो?", jp: "先生が読むの尊敬語として正しいのはどれか？" },
        choices: ["先生がお読みします。（humble — wrong direction）", "先生がお読みになります。", "先生が読まれます。（passive form — less precise）", "先生が読ませます。（causative）"],
        correctIndex: 1,
        explanation: { en: "お読みになります — お + 読み (verb stem) + になります: correct honorific pattern for teacher's action.", np: "お読みになります — お + 読み (क्रिया स्टेम) + になります: शिक्षकको कार्यको सही सम्मानजनक।", jp: "お読みになります＝お＋読み＋になる。先生の動作への正しい尊敬語。" },
      },
      {
        question: { en: "Which is the honorific equivalent of 先生が来ます?", np: "先生が来ます को सम्मानजनक समकक्ष के हो?", jp: "先生が来ますの尊敬語はどれか？" },
        choices: ["先生がいらっしゃいます。", "先生がまいります。（humble）", "先生がおります。（humble for いる）", "先生が来られます。（passive-based, less preferred）"],
        correctIndex: 0,
        explanation: { en: "いらっしゃいます is the honorific for いる/来る/行く — used for the teacher's coming.", np: "いらっしゃいます = いる/来る/行く को सम्मानजनक — शिक्षकको आगमनका लागि।", jp: "いらっしゃいます＝いる・来る・行くの尊敬語。先生が来ることへの敬意。" },
      },
    ],
    listening: {
      scenario: { en: "Department store staff address customers using sonkeigo, and supervisor uses it about VIP guests.", np: "डिपार्टमेन्ट स्टोर कर्मचारीहरूले ग्राहकहरूलाई sonkeigo प्रयोग गरेर सम्बोधन गर्छन्।", jp: "デパートのスタッフがお客様に尊敬語で対応し、上司がVIPゲストについて話す場面。" },
      instruction: { en: "Count sonkeigo forms: お〜になる, ご〜になる, special forms (いらっしゃる, おっしゃる, 召し上がる).", np: "sonkeigo रूपहरू गन्नुहोस्: お〜になる, ご〜になる, विशेष रूपहरू।", jp: "尊敬語の形式を数える：お〜になる・ご〜になる・特殊形（いらっしゃる・おっしゃる・召し上がる）。" },
      keyPhrases: ["お〜になる", "ご〜になる", "いらっしゃいます", "おっしゃいます"],
      studyTip: { en: "Make a 3-column table: Plain | Honorific (sonkeigo) | Humble (kenjōgo). Fill it for 10 key verbs.", np: "3-स्तम्भ तालिका: सादा | सम्मानजनक (sonkeigo) | नम्र (kenjōgo)। 10 मुख्य क्रियाहरूका लागि भर्नुहोस्।", jp: "3列表：普通形・尊敬語・謙譲語を主要動詞10個で埋める練習が効果的。" },
    },
  }),

  // Day 16: Humble forms
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "社員", ja: "先生、明日の会議のことをご連絡申し上げます。", reading: "Sensei, ashita no kaigi no koto o gorenraku mōshiagemasu.", en: { en: "Professor, I would like to inform you about tomorrow's meeting.", np: "गुरु, भोलिको बैठकबारे जानकारी दिन चाहन्छु।", jp: "先生、明日の会議のことをご連絡申し上げます。" } },
      { speaker: "先生", ja: "ありがとうございます。何時ですか。", reading: "Arigatō gozaimasu. Nanji desu ka.", en: { en: "Thank you. What time?", np: "धन्यवाद। कति बजे?", jp: "ありがとうございます。何時ですか？" } },
      { speaker: "社員", ja: "午後2時でございます。私がご案内いたします。", reading: "Gogo niji de gozaimasu. Watashi ga goannai itashimasu.", en: { en: "It's 2 PM. I will guide you.", np: "दिउँसो 2 बजे। म नै बाटो देखाउँछु।", jp: "午後2時でございます。私がご案内いたします。" } },
      { speaker: "先生", ja: "わかりました。では明日参ります。", reading: "Wakarimashita. Dewa ashita mairimasu.", en: { en: "Understood. I'll come tomorrow then.", np: "बुझेँ। त्यसो भए भोलि आउँछु।", jp: "わかりました。では明日参ります。" } },
      { speaker: "社員", ja: "はい、お待ち申し上げております。", reading: "Hai, omachi mōshiagete orimasu.", en: { en: "Yes, we will be humbly awaiting you.", np: "हो, हामी विनम्रतापूर्वक प्रतीक्षामा छौँ।", jp: "はい、お待ち申し上げております。" } },
    ],
    particles: [
      { particle: "お〜する (humble)", note: { en: "Humbles the speaker's action done for/to the listener: お待ちする = I (humbly) wait. Pattern: お + verb stem + する.", np: "श्रोताका लागि/प्रति गरिएको वक्ताको कार्यलाई नम्र: お待ちする = म (नम्रतापूर्वक) पर्खन्छु।", jp: "聞き手のためにする話し手の行動を謙る：お待ちする。形：お＋動詞語幹＋する。" } },
      { particle: "ご〜する / ご〜いたす (humble Sino-Japanese)", note: { en: "ご + Sino-Japanese stem + する/いたす: ご連絡する (contact), ご案内いたします (guide).", np: "ご + सिनो-जापानी स्टेम + する/いたす: ご連絡する (सम्पर्क), ご案内いたします (बाटो देखाउनु)।", jp: "ご＋漢語語幹＋する・いたす：ご連絡する・ご案内いたします。" } },
      { particle: "Special humble forms", note: { en: "いる→おる, 言う→申す, 食べる/飲む→いただく, する→いたす, 行く/来る→参る, もらう→いただく.", np: "विशेष नम्र रूपहरू: いる→おる, 言う→申す, 食べる→いただく, する→いたす, 行く/来る→参る।", jp: "謙譲語の特殊形：いる→おる、言う→申す、食べる・飲む→いただく、する→いたす、行く・来る→参る、もらう→いただく。" } },
    ],
    grammarBullets: [
      { en: "Humble (謙譲語 kenjōgo): lowers the speaker's own actions to show respect. Only used for the speaker's own actions.", np: "नम्र (謙譲語 kenjōgo): सम्मान देखाउन वक्ताका आफ्नै कार्यहरूलाई घटाउँछ। वक्ताका आफ्नै कार्यहरूका लागि मात्र।", jp: "謙譲語：敬意を示すために話し手自身の行動をへりくだらせる。話し手自身の動作にのみ使う。" },
      { en: "Polite copula: です→でございます in very formal contexts: 2時でございます.", np: "विनम्र copula: औपचारिक सन्दर्भमा です→でございます: 2時でございます।", jp: "丁寧なコピュラ：高度にフォーマルな場面ではです→でございます：2時でございます。" },
      { en: "〜申し上げる: extra humble form combining 申す (humble for 言う) + 上げる (give up to). Used in very formal writing/speech.", np: "〜申し上げる: अत्यन्त नम्र रूप। धेरै औपचारिक लेखन/भाषणमा।", jp: "〜申し上げる：申す（言うの謙譲語）＋上げる（やりもらい上方向）。非常に丁寧な文書・スピーチで使う。" },
    ],
    mcqs: [
      {
        question: { en: "Which is the correct humble form for 私が行きます?", np: "私が行きます को सही नम्र रूप के हो?", jp: "私が行きますの謙譲語として正しいのはどれか？" },
        choices: ["私がいらっしゃいます。（honorific — wrong direction）", "私が参ります。", "私がおいでになります。（honorific）", "私が行かれます。（passive）"],
        correctIndex: 1,
        explanation: { en: "参ります (mairimasu) is the humble form of 行く/来る, used for the speaker's own movement.", np: "参ります = 行く/来る को नम्र रूप, वक्ताको आफ्नै आन्दोलनका लागि।", jp: "参ります＝行く・来るの謙譲語。話し手自身の移動に使う。" },
      },
      {
        question: { en: "Which is the humble form for saying 'I will explain'?", np: "'म व्याख्या गर्छु' भन्नका लागि नम्र रूप के हो?", jp: "「ご説明いたします」に対応する謙譲形として最も適切なのはどれか？" },
        choices: ["ご説明になります。（honorific）", "ご説明いたします。", "お説明されます。（honorific passive）", "説明されます。（passive）"],
        correctIndex: 1,
        explanation: { en: "ご説明いたします = ご + Sino-Japanese stem + いたす (humble する). Correct humble form.", np: "ご説明いたします = ご + सिनो-जापानी स्टेम + いたす (नम्र する)। सही नम्र रूप।", jp: "ご説明いたします＝ご＋漢語語幹＋いたす（するの謙譲語）。正しい謙譲語。" },
      },
    ],
    listening: {
      scenario: { en: "Customer service call where the agent uses kenjōgo throughout for their own actions and sonkeigo for the customer.", np: "ग्राहक सेवा कल जहाँ एजेन्टले आफ्नै कार्यका लागि kenjōgo र ग्राहकका लागि sonkeigo प्रयोग गर्छ।", jp: "カスタマーサービスの電話で、エージェントが自分の行動に謙譲語、顧客の行動に尊敬語を使う場面。" },
      instruction: { en: "Track: agent's actions (humble form) vs customer's actions (honorific form). Mark HM=humble, HR=honorific.", np: "ट्र्याक: एजेन्टका कार्यहरू (नम्र) vs ग्राहकका कार्यहरू (सम्मानजनक)। HM=humble, HR=honorific।", jp: "エージェントの行動（謙譲語：HM）と顧客の行動（尊敬語：HR）を記録する。" },
      keyPhrases: ["お〜いたします", "ご〜いたします", "参ります", "申し上げます"],
      studyTip: { en: "Rule: Humble = lower MY actions. Honorific = raise THEIR actions. Never mix the direction.", np: "नियम: नम्र = मेरो कार्य घटाउनु। सम्मानजनक = उनको कार्य उठाउनु। दिशा कहिल्यै मिश्रण नगर्नु।", jp: "原則：謙譲語＝自分の行動をへりくだらせる；尊敬語＝相手の行動を高める。方向を混同しない。" },
    },
  }),

  // Day 17: てもらう / てあげる / てくれる advanced
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "田中", ja: "先輩に仕事を教えてもらいました。とても助かりました。", reading: "Senpai ni shigoto o oshiete moraimashita. Totemo tasukarimashita.", en: { en: "I had my senior teach me the work. It was a great help.", np: "सिनियरले काम सिकाउनु भयो। धेरै उपकार भयो।", jp: "先輩に仕事を教えてもらいました。とても助かりました。" } },
      { speaker: "鈴木", ja: "いいですね。私は後輩に資料を作ってあげましたよ。", reading: "Ii desu ne. Watashi wa kōhai ni shiryō o tsukutte agemashita yo.", en: { en: "That's nice. I made documents for my junior.", np: "राम्रो। मैले जुनियरलाई कागजपत्र बनाइदिएँ।", jp: "いいですね。私は後輩に資料を作ってあげましたよ。" } },
      { speaker: "田中", ja: "先輩は本当によくしてくれますね。いつも助けてくれます。", reading: "Senpai wa hontō ni yoku shite kuremasu ne. Itsumo tasukete kuremasu.", en: { en: "My senior is really good to me. They always help me.", np: "सिनियर साँच्चै राम्रो गर्नुहुन्छ। सधैं सहयोग गर्नुहुन्छ।", jp: "先輩は本当によくしてくれますね。いつも助けてくれます。" } },
      { speaker: "鈴木", ja: "子供のころ、親に本を読んでもらうのが好きでした。", reading: "Kodomo no koro, oya ni hon o yonde morau no ga suki deshita.", en: { en: "When I was a child, I liked having my parents read to me.", np: "बच्चामा, आमाबाबाले किताब पढिदिनु मनपर्थ्यो।", jp: "子供のころ、親に本を読んでもらうのが好きでした。" } },
      { speaker: "田中", ja: "先生に推薦状を書いていただきました。とてもありがたかったです。", reading: "Sensei ni suisenjō o kaite itadakimashita. Totemo arigatakatta desu.", en: { en: "I had my professor write a letter of recommendation for me. I was very grateful.", np: "गुरुले सिफारिस पत्र लेखिदिनु भयो। धेरै कृतज्ञ थिएँ।", jp: "先生に推薦状を書いていただきました。とてもありがたかったです。" } },
    ],
    particles: [
      { particle: "〜てもらう (receive a favor)", note: { en: "Speaker (or in-group) receives a favor: 先輩に教えてもらった = had senior teach me. The favor-giver is marked by に.", np: "वक्ता (वा इन-ग्रुप) सुविधा पाउँछ: 先輩に教えてもらった = सिनियरले सिकाइदिए।", jp: "話し手（または内集団）が恩恵を受ける：先輩に教えてもらった。恩恵提供者はに格。" } },
      { particle: "〜てあげる (do a favor for someone)", note: { en: "Speaker does a favor FOR another: 後輩に作ってあげた = made for my junior. Can sound condescending if overused.", np: "वक्ताले अर्काका लागि सुविधा गर्छ: 後輩に作ってあげた। अत्यधिक प्रयोगमा अहंकारी लाग्न सक्छ।", jp: "話し手が他者のために恩恵行動：後輩に作ってあげた。使いすぎると恩着せがましく聞こえることも。" } },
      { particle: "〜てくれる (someone does a favor for me)", note: { en: "Third party does a favor FOR the speaker (or in-group): 先輩が助けてくれる = senior helps me. The giver is subject.", np: "तेस्रो पक्षले वक्ता (वा इन-ग्रुप) का लागि सुविधा गर्छ: 先輩が助けてくれる।", jp: "第三者が話し手（または内集団）のために行動：先輩が助けてくれる。恩恵提供者が主語。" } },
    ],
    grammarBullets: [
      { en: "Direction summary: てもらう = I receive (agent in に); てあげる = I give (recipient in に); てくれる = they give to me (giver is subject).", np: "दिशा सारांश: てもらう = म पाउँछु; てあげる = म दिन्छु; てくれる = उनले मलाई दिन्छन्।", jp: "方向まとめ：てもらう＝私が受ける（にが恩恵者）；てあげる＝私が与える（にが受益者）；てくれる＝彼らが私に与える（が格が恩恵者）。" },
      { en: "Polite versions: てもらう→ていただく; てくれる→てくださる. Used for superiors: 先生に書いていただいた.", np: "विनम्र संस्करण: てもらう→ていただく; てくれる→てくださる। वरिष्ठहरूका लागि।", jp: "丁寧形：てもらう→ていただく；てくれる→てくださる。目上の人への使い方：先生に書いていただいた。" },
      { en: "Nuance: てあげる can imply condescension if used toward equals/superiors. In those cases, use てもらう from the recipient's perspective.", np: "बारीकता: てあげる समकक्ष/वरिष्ठहरूप्रति अहंकार बुझाउन सक्छ। ती अवस्थामा, प्राप्तकर्ताको दृष्टिकोणबाट てもらう प्रयोग गर्नुहोस्।", jp: "注意：てあげるは対等・目上には恩着せがましく聞こえることがある。その場合は受け手側のてもらうで表現する。" },
    ],
    mcqs: [
      {
        question: { en: "Choose the correct sentence: 'My friend helped me move'", np: "'साथीले मलाई सर्न सहयोग गर्यो' को सही वाक्य छान्नुहोस्:", jp: "「友達が引越しを手伝ってくれた」の正しい文はどれか？" },
        choices: ["友達に引越しを手伝ってあげた。（I helped friend）", "友達が引越しを手伝ってくれた。", "友達に引越しを手伝ってもらった。（I had friend help）", "友達が引越しを手伝ってもらった。（wrong subject）"],
        correctIndex: 1,
        explanation: { en: "友達が手伝ってくれた = friend (subject) did the helping for me (speaker). くれる = third party helps me.", np: "友達が手伝ってくれた = साथी (विषय) ले मलाई सहयोग गर्यो। くれる = तेस्रो पक्षले मलाई सहयोग।", jp: "友達が手伝ってくれた＝友達（主語）が話し手のために手伝う。くれる＝第三者が話し手に恩恵行動。" },
      },
      {
        question: { en: "Which is the polite form of 先生に説明してもらう?", np: "先生に説明してもらう को विनम्र रूप के हो?", jp: "先生に説明してもらうの丁寧形はどれか？" },
        choices: ["先生に説明してあげる。（wrong direction）", "先生に説明していただく。", "先生が説明してくださる。", "Both B and C are correct polite forms."],
        correctIndex: 3,
        explanation: { en: "Both ていただく (humble てもらう) and てくださる (honorific てくれる) are correct polite forms for receiving benefit from a superior.", np: "ていただく (नम्र てもらう) र てくださる (सम्मानजनक てくれる) दुवै वरिष्ठबाट सुविधा पाउनका लागि सही।", jp: "ていただく（てもらうの謙譲形）とてくださる（てくれるの尊敬形）はどちらも目上から恩恵を受ける丁寧な表現として正しい。" },
      },
    ],
    listening: {
      scenario: { en: "Family members and coworkers describe favors done for each other, mixing all three giving/receiving forms.", np: "परिवारका सदस्यहरू र सहकर्मीहरूले एकअर्काका लागि गरेका सुविधाहरू वर्णन गर्छन्।", jp: "家族・同僚がお互いにした恩恵行動を三つの授受動詞で表現する場面。" },
      instruction: { en: "For each てもらう/てあげる/てくれる: draw an arrow showing the direction of the favor (giver → receiver).", np: "प्रत्येक てもらう/てあげる/てくれる का लागि: सुविधाको दिशा देखाउने तीर खिच्नुहोस्।", jp: "てもらう・てあげる・てくれるそれぞれで恩恵の方向を示す矢印を書く（与え手→受け手）。" },
      keyPhrases: ["〜てもらいました", "〜てあげました", "〜てくれました", "〜ていただきました"],
      studyTip: { en: "The direction of benefit: てもらう and てくれる both mean 'I receive benefit', but てもらう focuses on the recipient (I), てくれる focuses on the giver (they).", np: "सुविधाको दिशा: てもらう र てくれる दुवैको अर्थ 'म सुविधा पाउँछु' हो, तर てもらう प्राप्तकर्तामा, てくれる दाताले केन्द्रित।", jp: "方向：てもらうもてくれるも「私が恩恵を受ける」が、てもらうは受益者（私）視点、てくれるは恩恵提供者（彼ら）視点。" },
    },
  }),

  // Day 18: 〜ところ
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "田中", ja: "ちょうど出かけるところでした。どうしましたか。", reading: "Chōdo dekakeru tokoro deshita. Dō shimashita ka.", en: { en: "I was just about to go out. What's the matter?", np: "भर्खरै बाहिर जाँदै थिएँ। के भयो?", jp: "ちょうど出かけるところでした。どうしましたか？" } },
      { speaker: "鈴木", ja: "すみません。今ちょうど昼ご飯を食べているところです。", reading: "Sumimasen. Ima chōdo hirugohan o tabete iru tokoro desu.", en: { en: "I'm sorry. I'm right in the middle of eating lunch.", np: "माफ गर्नुस्। अहिले ठीक बीचमा खाना खाँदैछु।", jp: "すみません。今ちょうど昼ご飯を食べているところです。" } },
      { speaker: "田中", ja: "そうですか。ちょうど食べ終わったところですか。", reading: "Sō desu ka. Chōdo tabe owatta tokoro desu ka.", en: { en: "Is that so? Did you just finish eating?", np: "त्यसो हो। खाना भर्खरै सकेको?", jp: "そうですか。ちょうど食べ終わったところですか？" } },
      { speaker: "鈴木", ja: "いいえ、まだ食べているところです。後で連絡します。", reading: "Iie, mada tabete iru tokoro desu. Ato de renraku shimasu.", en: { en: "No, I'm still in the middle of eating. I'll contact you later.", np: "होइन, अझ खाँदैछु। पछि सम्पर्क गर्छु।", jp: "いいえ、まだ食べているところです。後で連絡します。" } },
      { speaker: "田中", ja: "わかりました。今読んでいるところの本が終わったら電話してください。", reading: "Wakarimashita. Ima yonde iru tokoro no hon ga owattara denwa shite kudasai.", en: { en: "Understood. Please call me when the book you're reading right now is finished.", np: "बुझेँ। अहिले पढिरहनुभएको किताब सकिएपछि फोन गर्नुहोस्।", jp: "わかりました。今読んでいるところの本が終わったら電話してください。" } },
    ],
    particles: [
      { particle: "〜るところだ (about to)", note: { en: "Just about to do: 出かけるところだ = just about to go out. Dictionary form + ところだ.", np: "भर्खरै गर्ने: 出かけるところだ = भर्खरै बाहिर जाँदैछु। शब्दकोश रूप + ところだ।", jp: "まさにこれからしようとしている：出かけるところだ。辞書形＋ところだ。" } },
      { particle: "〜ているところだ (in the middle of)", note: { en: "Right in the middle of action: 食べているところだ = in the middle of eating. て-form + いるところだ.", np: "कार्यको बीचमा: 食べているところだ = खाना खाँदाको बीचमा। て-रूप + いるところだ।", jp: "行動の真っ最中：食べているところだ。て形＋いるところだ。" } },
      { particle: "〜たところだ (just finished)", note: { en: "Just completed: 食べたところだ = just finished eating. Past form + ところだ.", np: "भर्खरै सक्यो: 食べたところだ = भर्खरै खाना सकेको। भूत रूप + ところだ।", jp: "したばかり：食べたところだ。過去形＋ところだ。" } },
    ],
    grammarBullets: [
      { en: "Three ところ forms show the three stages of an action: before (〜るところ), during (〜ているところ), just after (〜たところ).", np: "तीन ところ रूपहरूले कार्यका तीन चरणहरू देखाउँछन्: अगाडि, बीचमा, भर्खरै पछाडि।", jp: "3つのところ形で行動の3段階を表す：前（るところ）・最中（ているところ）・直後（たところ）。" },
      { en: "ところ can also be a regular noun meaning 'place', 'part', or 'point': 良いところ = good part/good place. Context determines meaning.", np: "ところ सामान्य संज्ञा पनि हो जसको अर्थ 'ठाउँ', 'भाग', वा 'बिन्दु': 良いところ = राम्रो भाग।", jp: "ところは「場所」「部分」「点」を表す普通名詞でもある：良いところ＝いい部分・いい場所。文脈で意味が決まる。" },
      { en: "に by itself is NOT added: ~ているところです (not ~ているところにいます). The copula です follows directly.", np: "に एक्लै थपिन्न: ~ているところです (not ~ているところにいます)।", jp: "に単独では付かない：〜ているところです（〜ているところにいますは不自然）。直接ですが続く。" },
    ],
    mcqs: [
      {
        question: { en: "Which means 'just about to leave'?", np: "'भर्खरै छोड्न लागेको' कुन भन्छ?", jp: "「まさに出ようとしているところ」を表す文はどれか？" },
        choices: ["出たところです。（just left）", "出ているところです。（in the middle of leaving）", "出るところです。（just about to leave）", "出ようとしているところです。（redundant volitional）"],
        correctIndex: 2,
        explanation: { en: "出るところです = just about to go out. Dictionary form + ところ = about to do.", np: "出るところです = भर्खरै बाहिर जाँदैछु। शब्दकोश रूप + ところ = गर्न लाग्नु।", jp: "出るところです＝まさに出ようとしているところ。辞書形＋ところ＝これからする直前。" },
      },
      {
        question: { en: "Which sentence means 'I just finished reading'?", np: "'भर्खरै पढिसकेँ' कुन वाक्य हो?", jp: "「読み終わったところです」として正しいのはどれか？" },
        choices: ["読んでいるところです。", "読むところです。", "読んだところです。", "読もうとしているところです。"],
        correctIndex: 2,
        explanation: { en: "読んだところです — past form + ところ = just completed the action of reading.", np: "読んだところです — भूत रूप + ところ = भर्खरै पढेको सकियो।", jp: "読んだところです＝過去形＋ところ：読み終わった直後。" },
      },
    ],
    listening: {
      scenario: { en: "Phone calls interrupting people mid-action — each person describes where they are in their activity using ところ.", np: "मानिसहरूलाई काम गर्दाको बीचमा फोन आउँछ — प्रत्येक व्यक्ति ところ प्रयोग गरेर आफ्नो गतिविधिबारे बताउँछ।", jp: "行動の途中で電話がかかってくる場面。各人がところを使って活動状況を説明する。" },
      instruction: { en: "Classify each ところ: B=before (about to), M=middle (in progress), A=after (just finished).", np: "प्रत्येक ところ वर्गीकृत गर्नुहोस्: B=अगाडि, M=बीचमा, A=पछाडि।", jp: "ところをB（前）・M（最中）・A（直後）に分類する。" },
      keyPhrases: ["〜るところ", "〜ているところ", "〜たところ", "ちょうど〜ところ"],
      studyTip: { en: "Visualize a timeline: 出る-ところ | —[activity]— | 出た-ところ. Practice all three with one verb (e.g. 食べる).", np: "टाइमलाइन कल्पना गर्नुहोस्: 出る-ところ | —[गतिविधि]— | 出た-ところ। एउटा क्रियासँग तिनै वटा अभ्यास (जस्तै 食べる)।", jp: "タイムラインのイメージ：出るところ|（動作中）|出たところ。1つの動詞で3つ全ての形を練習する（例：食べる）。" },
    },
  }),

  // Day 19: ば〜ほど / ほど / くらい
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "山田", ja: "日本語は練習すればするほど上手くなりますよ。", reading: "Nihongo wa renshū sureba suru hodo umaku narimasu yo.", en: { en: "The more you practice Japanese, the better you'll get.", np: "जापानी भाषा जति अभ्यास गर्यो, उति राम्रो हुन्छ।", jp: "日本語は練習すればするほど上手くなりますよ。" } },
      { speaker: "田中", ja: "そうですね。頭が痛いほど難しいです、でも楽しい。", reading: "Sō desu ne. Atama ga itai hodo muzukashii desu, demo tanoshii.", en: { en: "That's right. It's difficult to the point of a headache, but fun.", np: "हो नि। टाउको दुख्ने जति गाह्रो छ, तर रमाइलो।", jp: "そうですね。頭が痛いほど難しいですが、楽しいです。" } },
      { speaker: "山田", ja: "一年くらい勉強すれば、かなり話せるようになりますよ。", reading: "Ichinen kurai benkyō sureba, kanari hanaseru yō ni narimasu yo.", en: { en: "If you study for about a year, you'll be able to speak quite well.", np: "एक वर्ष जति पढेको खण्डमा, धेरै राम्रोसँग बोल्न सकिन्छ।", jp: "1年くらい勉強すれば、かなり話せるようになりますよ。" } },
      { speaker: "田中", ja: "ありがとうございます。毎日3時間くらいは練習しています。", reading: "Arigatō gozaimasu. Mainichi sanjikan kurai wa renshū shite imasu.", en: { en: "Thank you. I practice about 3 hours every day.", np: "धन्यवाद। हरेक दिन ३ घण्टा जति अभ्यास गर्छु।", jp: "ありがとうございます。毎日3時間くらいは練習しています。" } },
      { speaker: "山田", ja: "すごいですね。やればやるほど結果が出ますよ。", reading: "Sugoi desu ne. Yareba yaru hodo kekka ga demasu yo.", en: { en: "That's impressive. The more you do it, the more results you'll see.", np: "अद्भुत! जति गर्यो, उति नतिजा आउँछ।", jp: "すごいですね。やればやるほど結果が出ますよ。" } },
    ],
    particles: [
      { particle: "〜ば〜ほど (the more… the more…)", note: { en: "Proportional increase: Vば + V + ほど: 練習すればするほど = the more you practice. The verb repeats.", np: "आनुपातिक वृद्धि: Vば + V + ほど: 練習すればするほど = जति अभ्यास गर्यो उति। क्रिया दोहोरिन्छ।", jp: "比例増加：Vば＋V＋ほど：練習すればするほど。動詞を繰り返す。" } },
      { particle: "〜ほど (to the extent / so much that)", note: { en: "Indicates degree: 頭が痛いほど難しい = so difficult it gives a headache (extent).", np: "मात्रा बुझाउँछ: 頭が痛いほど難しい = टाउको दुख्ने जति गाह्रो।", jp: "程度を示す：頭が痛いほど難しい＝頭が痛くなるほど難しい。" } },
      { particle: "〜くらい / ぐらい (about / approximately)", note: { en: "Approximation: 一年くらい = about one year. More casual than 〜ほど for degree.", np: "अनुमान: 一年くらい = एक वर्ष जति। मात्राका लागि 〜ほど भन्दा बढी अनौपचारिक।", jp: "概数・程度：1年くらい＝だいたい1年。程度ではほどより口語的。" } },
    ],
    grammarBullets: [
      { en: "〜ば〜ほど pattern: conditional ば-form + same verb (plain) + ほど: 食べればもっと食べるほど太る = the more you eat, the fatter you get.", np: "〜ば〜ほど ढाँचा: सर्त ば-रूप + एउटै क्रिया (सादा) + ほど।", jp: "ば〜ほどパターン：条件ば形＋同一動詞（普通形）＋ほど：食べれば食べるほど太る。" },
      { en: "ほど for degree: [A/V] + ほど + [B]: expresses B to the extent of A. Often with extreme/surprising degree.", np: "मात्राका लागि ほど: [A/V] + ほど + [B]: A को हदसम्म B। प्राय: अतिरेकी/आश्चर्यजनक मात्रासँग।", jp: "程度のほど：[A/V]＋ほど＋[B]：Aの程度のほど（極端・驚く程度と共に多い）。" },
      { en: "くらい for approximation: N/counter + くらい. Also used for minimum/humble: 電話くらいしてください = at least call me.", np: "अनुमानका लागि くらい: N/काउन्टर + くらい। न्यूनतम/नम्रताका लागि पनि: 電話くらいしてください।", jp: "くらいの概数：N・数量詞＋くらい。最低限・謙遜：電話くらいしてください（せめて電話して）。" },
    ],
    mcqs: [
      {
        question: { en: "Complete: 考えれば_____、難しくなります。", np: "पूरा गर्नुहोस्: 考えれば_____、難しくなります。", jp: "( )に入るのはどれか？考えれば_____、難しくなります。" },
        choices: ["考えるほど", "考えるだけ", "考えるから", "考えるので"],
        correctIndex: 0,
        explanation: { en: "考えれば考えるほど = the more you think, the harder it gets. ば〜ほど pattern.", np: "考えれば考えるほど = जति सोच्यो उति गाह्रो। ば〜ほど ढाँचा।", jp: "考えれば考えるほど＝ば〜ほどパターン：考えれば＋考える＋ほど。" },
      },
      {
        question: { en: "Which uses くらい for approximation?", np: "कुन वाक्यले अनुमानका लागि くらい प्रयोग गर्छ?", jp: "くらいを概数・近似に使っている文はどれか？" },
        choices: ["泣くほど悲しい。（degree ほど）", "5分くらい待ってください。", "すればするほどできる。（ば〜ほど）", "これくらい難しい。（this level/degree）"],
        correctIndex: 1,
        explanation: { en: "5分くらい待ってください = please wait about 5 minutes — くらい for approximate time.", np: "5分くらい待ってください = ५ मिनेट जति पर्खनुहोस् — अनुमानित समयका लागि くらい।", jp: "5分くらい待ってください＝くらいで概数の時間を表す。" },
      },
    ],
    listening: {
      scenario: { en: "Motivational talk using the ば〜ほど pattern, and descriptions of extent using ほど and approximations with くらい.", np: "ば〜ほど ढाँचा, मात्राका लागि ほど र अनुमानका लागि くらい प्रयोग गरेको प्रेरणादायक भाषण।", jp: "ば〜ほどパターン、程度のほど、くらいの概数を混在させたモチベーショナルトークを聞く場面。" },
      instruction: { en: "Each time you hear ほど or くらい, note: is it (1) ば〜ほど proportional, (2) ほど extent, or (3) くらい approximation?", np: "प्रत्येकपटक ほど वा くらい सुन्दा नोट गर्नुहोस्: (1) ば〜ほど, (2) ほど मात्रा, वा (3) くらい अनुमान?", jp: "ほどかくらいを聞くたびに：(1)ば〜ほど比例、(2)ほど程度、(3)くらい概数を分類する。" },
      keyPhrases: ["〜ば〜ほど", "〜ほど（程度）", "〜くらい（近似）", "〜ほど〜ない（比較否定）"],
      studyTip: { en: "Practice ば〜ほど with 3 different verbs: 勉強する, 食べる, 練習する. Write the pattern out and check the ば-form.", np: "3 फरक क्रियाहरूसँग ば〜ほど अभ्यास: 勉強する, 食べる, 練習する।", jp: "ば〜ほどを3つの動詞で練習：勉強する・食べる・練習する。ば形を書いて確認。" },
    },
  }),

  // Day 20: ものだ / ものの
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "先生", ja: "昔は手紙を書くものでしたが、今はメールですね。", reading: "Mukashi wa tegami o kaku mono deshita ga, ima wa mēru desu ne.", en: { en: "It used to be natural to write letters, but now it's email.", np: "पहिले चिठी लेख्ने चलन थियो, तर अब इमेल।", jp: "昔は手紙を書くものでしたが、今はメールですね。" } },
      { speaker: "生徒", ja: "勉強したものの、なかなか覚えられません。", reading: "Benkyō shita mono no, nakanaka oboerare masen.", en: { en: "Although I studied, I can't seem to remember.", np: "पढेको भए पनि, याद गर्न सकिएन।", jp: "勉強したものの、なかなか覚えられません。" } },
      { speaker: "先生", ja: "そうですよね。外国語は毎日練習するものですよ。", reading: "Sō desu yo ne. Gaikokugo wa mainichi renshū suru mono desu yo.", en: { en: "That's right. Foreign languages are (naturally) practiced every day.", np: "हो नि। विदेशी भाषा हरेक दिन अभ्यास गर्ने चिज हो।", jp: "そうですよね。外国語は毎日練習するものですよ。" } },
      { speaker: "生徒", ja: "わかりました。努力はしてみたものの、まだ難しいです。", reading: "Wakarimashita. Doryoku wa shite mita mono no, mada muzukashii desu.", en: { en: "Understood. Although I've tried my best, it's still difficult.", np: "बुझेँ। मिहेनत गरेको भए पनि, अझ गाह्रो छ।", jp: "わかりました。努力はしてみたものの、まだ難しいです。" } },
      { speaker: "先生", ja: "言葉というものは、使えば使うほど上手くなるものです。", reading: "Kotoba to iu mono wa, tsukaeba tsukau hodo umaku naru mono desu.", en: { en: "Language is something that naturally improves the more you use it.", np: "भाषा भनेको जति प्रयोग गर्यो, उति राम्रो हुने चिज हो।", jp: "言葉というものは、使えば使うほど上手くなるものです。" } },
    ],
    particles: [
      { particle: "〜ものだ (it's natural / general truth)", note: { en: "Expresses general truth, natural expectation, or nostalgic custom: 昔は〜ものだ = it used to be natural to…; 人は間違えるものだ = it's natural for people to make mistakes.", np: "सामान्य सत्य, स्वाभाविक अपेक्षा वा नस्टाल्जिक रीति: 昔は〜ものだ = पहिले... गर्ने चलन थियो।", jp: "一般的真実・自然な期待・懐かしい慣習：昔は〜ものだ；人は間違えるものだ＝人は間違えて当然。" } },
      { particle: "〜ものの (although / despite)", note: { en: "Concessive conjunction: action/fact A happened, but contrary result B follows: 勉強したものの成績が上がらない = although I studied, grades didn't improve.", np: "रियायती संयोजन: कार्य A भयो, तर विपरीत परिणाम B: 勉強したものの成績が上がらない।", jp: "逆接接続：Aしたものの、Bという予想外の結果：勉強したものの成績が上がらない。" } },
      { particle: "〜というものだ (it is what something is)", note: { en: "Defines or explains the essential nature: 言葉というものは = as for what language is, it is something that…", np: "सार वा प्रकृति परिभाषा/व्याख्या: 言葉というものは = भाषा भनेको जे हो...", jp: "本質・定義：言葉というものは＝言葉とはそもそも〜するものだ。" } },
    ],
    grammarBullets: [
      { en: "ものだ (general truth): V/Adj plain + ものだ. Often used with past nostalgia (ものでした) or to express what is considered natural/expected.", np: "ものだ (सामान्य सत्य): V/Adj सादा + ものだ। प्राय: भूत नस्टाल्जिया वा स्वाभाविक/अपेक्षित व्यक्त गर्न।", jp: "ものだ（一般的真実）：V/Adj普通形＋ものだ。過去の懐古（ものでした）や自然・期待の表現に使う。" },
      { en: "ものの (although): Vた / adj / N + ものの + contrary result. More formal than が or けれど.", np: "ものの (यद्यपि): Vた / adj / N + ものの + विपरीत परिणाम। が वा けれど भन्दा बढी औपचारिक।", jp: "ものの（逆接）：Vた・adj・N＋ものの＋逆の結果。がやけれどよりフォーマル。" },
      { en: "Distinguish: ものだ = truth/expectation; ものの = concession/contrast; ものか = strong rhetorical negation (I would never do X!).", np: "भिन्नता: ものだ = सत्य/अपेक्षा; ものの = रियायत/विरोध; ものか = कडा अलंकारिक नकार।", jp: "区別：ものだ＝真実・期待；ものの＝逆接・譲歩；ものか＝強い修辞的否定（〜するものか！）。" },
    ],
    mcqs: [
      {
        question: { en: "Which correctly expresses a general truth with ものだ?", np: "कुन वाक्यले ものだ सँग सामान्य सत्य सही व्यक्त गर्छ?", jp: "ものだで一般的真実を正しく表している文はどれか？" },
        choices: ["試験に合格したものだ。（nostalgia — past habitual, ok but less common)", "人は失敗から学ぶものだ。", "彼は来るものです。（will come — wrong usage）", "頑張ったものの、疲れた。（concessive ものの）"],
        correctIndex: 1,
        explanation: { en: "人は失敗から学ぶものだ = It is natural that people learn from mistakes — general truth with ものだ.", np: "人は失敗から学ぶものだ = मानिसहरू गल्तीबाट सिक्ने स्वाभाविक हो — ものだ सँग सामान्य सत्य।", jp: "人は失敗から学ぶものだ＝人は失敗から学ぶのが当然だ。一般的真実のものだ。" },
      },
      {
        question: { en: "Which correctly uses ものの for concession?", np: "कुन वाक यले रियायतका लागि ものの सही प्रयोग गर्छ?", jp: "ものの（逆接・譲歩）を正しく使っている文はどれか？" },
        choices: ["急いだものの、電車に乗れた。（positive result — unusual）", "努力したものの、結果が出なかった。", "勉強するものだ。（general truth）", "来るものか！（rhetorical negation）"],
        correctIndex: 1,
        explanation: { en: "努力したものの結果が出なかった = although I made effort, no results. Concessive ものの.", np: "努力したものの結果が出なかった = मिहेनत गरेको भए पनि नतिजा आएन। रियायती ものの।", jp: "努力したものの結果が出なかった＝努力したが逆の結果。逆接のものの。" },
      },
    ],
    listening: {
      scenario: { en: "An older teacher reflects on how things used to be (ものでした) and students respond with ものの (despite their efforts).", np: "एक वरिष्ठ शिक्षकले पहिले कस्तो थियो (ものでした) प्रतिबिम्बित गर्छन् र विद्यार्थीहरूले ものの (मिहेनत भए पनि) सँग जवाफ दिन्छन्।", jp: "ベテラン先生が昔のことを回顧（ものでした）し、学生がものの（努力したけれど）で応じる場面。" },
      instruction: { en: "Mark: T=ものだ (general truth/nostalgic), C=ものの (concessive/contrast). Note the emotional tone of each.", np: "चिन्ह: T=ものだ (सामान्य सत्य/नस्टाल्जिया), C=ものの (रियायत/विरोध)।", jp: "T＝ものだ（一般的真実・懐古）、C＝ものの（逆接）とマーク。感情的トーンも確認。" },
      keyPhrases: ["〜ものだ", "〜ものでした", "〜ものの", "というものだ"],
      studyTip: { en: "ものの vs のに (contrastive): ものの is formal written; のに is more emotional/spoken. Both express contrast/disappointment.", np: "ものの vs のに: ものの औपचारिक लिखित; のに बढी भावनात्मक/बोलिने। दुवैले विरोध/निराशा व्यक्त गर्छन्।", jp: "ものの（書き言葉・フォーマル）vs のに（話し言葉・感情的）：どちらも逆接・失望を表すが文体が異なる。" },
    },
  }),

  // Day 21: として / にとって
  mk({
    minnaLesson: null,
    bookRef: "N3 Grammar Guide",
    dialogue: [
      { speaker: "田中", ja: "私は学生として、日本語を真剣に学んでいます。", reading: "Watashi wa gakusei to shite, nihongo o shinken ni manande imasu.", en: { en: "As a student, I am seriously learning Japanese.", np: "विद्यार्थीको हैसियतमा, म गम्भीरतापूर्वक जापानी सिक्दैछु।", jp: "私は学生として、日本語を真剣に学んでいます。" } },
      { speaker: "山田", ja: "日本語の学習は、私にとって大切な目標です。", reading: "Nihongo no gakushū wa, watashi ni totte taisetsu na mokuhyō desu.", en: { en: "Japanese language learning is an important goal for me.", np: "जापानी भाषा सिकाइ मेरो लागि महत्त्वपूर्ण लक्ष्य हो।", jp: "日本語の学習は、私にとって大切な目標です。" } },
      { speaker: "田中", ja: "教師として、生徒に分かりやすく教えたいと思います。", reading: "Kyōshi to shite, seito ni wakari yasuku oshietai to omoimasu.", en: { en: "As a teacher, I want to teach students in a way that's easy to understand.", np: "शिक्षकको हैसियतमा, विद्यार्थीहरूलाई बुझ्न सजिलो तरिकाले पढाउन चाहन्छु।", jp: "教師として、生徒にわかりやすく教えたいと思います。" } },
      { speaker: "山田", ja: "子供にとって、遊びは勉強と同じくらい大切ですね。", reading: "Kodomo ni totte, asobi wa benkyō to onaji kurai taisetsu desu ne.", en: { en: "For children, play is just as important as studying.", np: "बालबालिकाको लागि, खेल अध्ययन जति नै महत्त्वपूर्ण छ।", jp: "子供にとって、遊びは勉強と同じくらい大切ですね。" } },
      { speaker: "田中", ja: "大人として、責任感を持つことが重要です。", reading: "Otona to shite, sekininkan o motsu koto ga jūyō desu.", en: { en: "As an adult, it's important to have a sense of responsibility.", np: "वयस्कको हैसियतमा, जिम्मेवारीको भावना राख्नु महत्त्वपूर्ण छ।", jp: "大人として、責任感を持つことが重要です。" } },
    ],
    particles: [
      { particle: "〜として (as / in the capacity of)", note: { en: "Describes the role, capacity, or status in which the subject acts: 学生として = as a student (in that role).", np: "विषयले कार्य गर्ने भूमिका, क्षमता वा स्थिति वर्णन गर्छ: 学生として = विद्यार्थीको हैसियतमा।", jp: "主語が行動する役割・立場・資格：学生として＝学生という立場で。" } },
      { particle: "〜にとって (from the perspective of / for)", note: { en: "Expresses the perspective, standpoint, or relevance to someone: 私にとって = for me / from my perspective.", np: "कसैका लागि दृष्टिकोण, धारणा, वा प्रासंगिकता: 私にとって = मेरो लागि / मेरो दृष्टिकोणबाट।", jp: "ある人から見た立場・評価：私にとって＝私の観点から見て。" } },
      { particle: "として vs にとって", note: { en: "として = role/capacity/means. にとって = evaluation from a particular standpoint. 医者として = as a doctor (role); 医者にとって = from a doctor's perspective.", np: "として = भूमिका/क्षमता/साधन। にとって = विशेष धारणाबाट मूल्यांकन।", jp: "として＝役割・立場・手段；にとって＝特定の立場からの評価。医者として（役割）・医者にとって（医者の観点）。" } },
    ],
    grammarBullets: [
      { en: "〜として: N + として. The noun indicates the capacity/role: 友達として助ける = help as a friend; プレゼントとして = as a gift.", np: "〜として: N + として। संज्ञाले क्षमता/भूमिका बुझाउँछ: 友達として助ける = साथीको हैसियतमा सहयोग।", jp: "として：N＋として。名詞が立場・資格を示す：友達として助ける・プレゼントとして（贈り物として）。" },
      { en: "〜にとって: N + にとって. Evaluates from that person's viewpoint: 子供にとって公平ですか = Is it fair for children?", np: "〜にとって: N + にとって। त्यस व्यक्तिको दृष्टिकोणबाट मूल्यांकन: 子供にとって公平ですか।", jp: "にとって：N＋にとって。その人の観点から評価する：子供にとって公平ですか。" },
      { en: "として can also mark a means/method: 薬として使う = use as medicine; 証拠として提出する = submit as evidence.", np: "として ले साधन/तरिका पनि चिन्ह लगाउन सक्छ: 薬として使う = औषधिको रूपमा प्रयोग।", jp: "としては手段・方法も表す：薬として使う・証拠として提出する。" },
    ],
    mcqs: [
      {
        question: { en: "Which correctly uses として?", np: "कुन वाक्यमा として सही प्रयोग भएको छ?", jp: "としてを正しく使っている文はどれか？" },
        choices: ["私にとって教師として働いています。（confused usage）", "彼女は先生として有名です。", "学生は勉強にとって大切です。（wrong の direction）", "私にとってとして行きます。（nonsense）"],
        correctIndex: 1,
        explanation: { en: "彼女は先生として有名です = She is famous as a teacher — として marks her role as teacher.", np: "彼女は先生として有名です = उनी शिक्षकको रूपमा प्रसिद्ध छिन् — として ले शिक्षकको भूमिका चिन्ह लगाउँछ।", jp: "彼女は先生として有名です＝先生という立場で有名。としての正しい使い方。" },
      },
      {
        question: { en: "Which correctly uses にとって?", np: "कुन वाक्यमा にとって सही प्रयोग भएको छ?", jp: "にとってを正しく使っている文はどれか？" },
        choices: ["仕事として大切です。（role: として）", "子供にとって、野菜は苦手です。", "先生として評価が高い。（role: として）", "友達として話しました。（role: として）"],
        correctIndex: 1,
        explanation: { en: "子供にとって野菜は苦手です = For children, vegetables are disliked — にとって marks the perspective.", np: "子供にとって野菜は苦手です = बालबालिकाको लागि, तरकारी मनपर्दैन — にとって दृष्टिकोण चिन्ह।", jp: "子供にとって野菜は苦手です＝子供の観点から野菜が苦手。にとっての正しい使い方。" },
      },
    ],
    listening: {
      scenario: { en: "Panel discussion where each speaker identifies their role (として) and shares their perspective (にとって) on the topic.", np: "प्यानल छलफल जहाँ प्रत्येक वक्ताले आफ्नो भूमिका (として) पहिचान गर्छ र विषयमा आफ्नो दृष्टिकोण (にとって) साझा गर्छ।", jp: "各発言者が自分の役割（として）を示し、話題への立場（にとって）を述べるパネルディスカッション。" },
      instruction: { en: "For each として or にとって: record the noun (role or viewpoint holder) and the predicate that follows.", np: "प्रत्येक として वा にとって का लागि: संज्ञा (भूमिका वा दृष्टिकोण धारक) र पछ्याउने विधेय रेकर्ड गर्नुहोस्।", jp: "としてまたはにとってが出るたびに：名詞（役割・立場者）とそれに続く述語を記録する。" },
      keyPhrases: ["〜として", "〜にとって", "〜という立場で", "〜の観点から"],
      studyTip: { en: "Test: 'Is this about the role they play?' → として. 'Is this about their personal perspective/evaluation?' → にとって.", np: "परीक्षण: 'यो उनले निभाउने भूमिकाबारे हो?' → として। 'यो उनको व्यक्तिगत दृष्टिकोण/मूल्यांकनबारे हो?' → にとって।", jp: "確認：「これは果たしている役割について？」→として。「これは個人的な観点・評価について？」→にとって。" },
    },
  }),
];
