export type SurvivalPhrase = {
  phrase: string;
  romaji: string;
  meaning_en: string;
  meaning_np: string;
};

export type SurvivalPhraseCategory = {
  id: number;
  category: string;
  phrases: SurvivalPhrase[];
};

export const SURVIVAL_PHRASE_CATEGORIES: SurvivalPhraseCategory[] = [
  {
    id: 1,
    category: "Everyday Survival Phrases",
    phrases: [
      { phrase: "たすけてください", romaji: "tasukete kudasai", meaning_en: "Please help me", meaning_np: "कृपया सहयोग गर्नुहोस्" },
      { phrase: "なまえはなんですか。", romaji: "namae wa nan desu ka", meaning_en: "What is your name?", meaning_np: "तपाईंको नाम के हो?" },
      { phrase: "よろしくおねがいします。", romaji: "yoroshiku onegaishimasu", meaning_en: "Nice to meet you", meaning_np: "चिनजान भएकोमा खुशी लाग्यो" },
      { phrase: "またね。", romaji: "matane", meaning_en: "See you later", meaning_np: "फेरि भेटौंला" },
      { phrase: "またあした。", romaji: "mata ashita", meaning_en: "See you tomorrow", meaning_np: "भोलि भेटौंला" },
      { phrase: "れんらくするね。", romaji: "renraku suru ne", meaning_en: "I'll text you", meaning_np: "म तपाईंलाई सम्पर्क गर्छु" },
      { phrase: "すごい！", romaji: "sugoi!", meaning_en: "Amazing", meaning_np: "अचम्म!" },
      { phrase: "おめでとう。", romaji: "omedetou", meaning_en: "Congratulations", meaning_np: "बधाई छ" },
      { phrase: "がんばって。", romaji: "ganbatte", meaning_en: "Good luck", meaning_np: "शुभकामना" },
      { phrase: "気をつけて。", romaji: "ki o tsukete", meaning_en: "Take care", meaning_np: "ख्याल राख्नुहोस्" },
      { phrase: "でんわしてね。", romaji: "denwa shite ne", meaning_en: "Call me", meaning_np: "मलाई फोन गर्नुहोस्" },
      { phrase: "おつかれさま。", romaji: "otsukaresama", meaning_en: "Thank you for your hard work", meaning_np: "धेरै मिहिनेत गर्नुभयो" },
      { phrase: "おかげさまで。", romaji: "okagesama de", meaning_en: "Thanks to you", meaning_np: "तपाईंको कृपाले" },
      { phrase: "わかりましたか。", romaji: "wakarimashita ka", meaning_en: "Did you understand?", meaning_np: "बुझ्नुभयो?" },
      { phrase: "びっくりした！", romaji: "bikkuri shita!", meaning_en: "I'm surprised", meaning_np: "म छक्क परें!" },
      { phrase: "まだです。", romaji: "mada desu", meaning_en: "Not yet", meaning_np: "अझै भएको छैन" },
      { phrase: "もういちど。", romaji: "mou ichido", meaning_en: "Once more", meaning_np: "फेरि एकपटक" },
      { phrase: "すぐに。", romaji: "sugu ni", meaning_en: "Immediately", meaning_np: "तुरुन्तै" },
      { phrase: "どうしよう。", romaji: "dou shiyou", meaning_en: "What should I do?", meaning_np: "के गरौं?" },
      { phrase: "まってください。", romaji: "matte kudasai", meaning_en: "Please wait", meaning_np: "पर्खनुहोस्" },
      { phrase: "むりをしないでください。", romaji: "muri o shinaide kudasai", meaning_en: "Don't force it", meaning_np: "जबर्जस्ती नगर्नुहोस्" },
      { phrase: "おもったよりむずかしいです。", romaji: "omotta yori muzukashii desu", meaning_en: "It's harder than I thought", meaning_np: "सोचेको भन्दा गाह्रो छ" },
      { phrase: "ネパールからきたばかりです。", romaji: "nepāru kara kita bakari desu", meaning_en: "I just came from Nepal", meaning_np: "नेपाल बाट भखरै आएको हो" },
      { phrase: "すぐにいきます。", romaji: "sugu ni ikimasu", meaning_en: "I'll go immediately", meaning_np: "म तुरुन्तै जान्छु" },
    ],
  },
  {
    id: 2,
    category: "Daily Conversation Phrases",
    phrases: [
      { phrase: "こんにちは、げんきですか？", romaji: "konnichiwa, genki desu ka?", meaning_en: "Hello, how are you?", meaning_np: "नमस्ते, तपाईं कस्तो हुनुहुन्छ?" },
      { phrase: "はい、げんきです。あなたは？", romaji: "hai, genki desu. anata wa?", meaning_en: "Yes, I'm fine. How about you?", meaning_np: "हो, म ठिक छु। तपाईं नि?" },
      { phrase: "げんきです。がんばりましょう。", romaji: "genki desu. ganbarimashou.", meaning_en: "I'm fine. Let's do our best.", meaning_np: "म ठिक छु। मिहिनेत गरौं।" },
      { phrase: "そうですね。がんばりましょう。", romaji: "sou desu ne. ganbarimashou.", meaning_en: "That's right, let's do our best.", meaning_np: "हो नि, मिहिनेत गरौं।" },
      { phrase: "あしたはやすみですか？", romaji: "ashita wa yasumi desu ka?", meaning_en: "Is tomorrow a day off?", meaning_np: "भोलि बिदा हो?" },
      { phrase: "はい、あしたはやすみです。", romaji: "hai, ashita wa yasumi desu.", meaning_en: "Yes, tomorrow is a holiday.", meaning_np: "हो, भोलि बिदा हो।" },
      { phrase: "あしたはなにをしますか？", romaji: "ashita wa nani o shimasu ka?", meaning_en: "What will you do tomorrow?", meaning_np: "भोलि तपाईं के गर्नुहुन्छ?" },
      { phrase: "かいものにいくよていです。", romaji: "kaimono ni iku yotei desu.", meaning_en: "I am planning to go shopping.", meaning_np: "म किनमेल गर्न जाने योजना छ।" },
      { phrase: "よければ、いっしょにいきませんか？", romaji: "yokereba, issho ni ikimasen ka?", meaning_en: "If you don't mind, would you like to go with me?", meaning_np: "यदि मन छ भने, मसँगै जाने हो?" },
      { phrase: "いいですね。いきましょう。", romaji: "ii desu ne. ikimashou.", meaning_en: "Okay, let's go.", meaning_np: "ठिक छ, जाऔं।" },
      { phrase: "じゅういちじに、とうきょうえきでどうですか？", romaji: "juuichiji ni, toukyou eki de dou desu ka?", meaning_en: "How about at Tokyo Station at 11 o'clock?", meaning_np: "११ बजे टोकियो स्टेशनमा कस्तो होला?" },
      { phrase: "わかりました。とうきょうえきですね。", romaji: "wakarimashita. toukyou eki desu ne.", meaning_en: "Okay, at Tokyo Station.", meaning_np: "बुझें, टोकियो स्टेशनमा है।" },
    ],
  },
  {
    id: 3,
    category: "Feelings & Reactions",
    phrases: [
      { phrase: "おしえてください", romaji: "oshiete kudasai", meaning_en: "Please tell me", meaning_np: "कृपया भन्नुहोस्" },
      { phrase: "しんじられません", romaji: "shinjiraremasen", meaning_en: "I can't believe it", meaning_np: "मलाई पत्याउनै सकिन" },
      { phrase: "なるほど、よくわかりました", romaji: "naruhodo, yoku wakarimashita", meaning_en: "I see, I understand now", meaning_np: "ए हो, अब राम्ररी बुझें" },
      { phrase: "おかえりなさい", romaji: "okaerinasai", meaning_en: "Welcome back", meaning_np: "फर्केर आउनुभएकोमा स्वागत छ" },
      { phrase: "どこへ行きますか", romaji: "doko e ikimasu ka", meaning_en: "Where are you going?", meaning_np: "तपाईं कहाँ जाँदै हुनुहुन्छ?" },
      { phrase: "どっちにしますか", romaji: "docchi ni shimasu ka", meaning_en: "Which one will you choose?", meaning_np: "तपाईं कुन छान्नुहुन्छ?" },
      { phrase: "つかえますか？", romaji: "tsukaemasu ka", meaning_en: "Can I use it?", meaning_np: "म यो प्रयोग गर्न सक्छु?" },
      { phrase: "わすれました", romaji: "wasuremashita", meaning_en: "I forgot", meaning_np: "म बिर्सें" },
      { phrase: "いいですね", romaji: "ii desu ne", meaning_en: "That's nice", meaning_np: "राम्रो छ नि" },
      { phrase: "やった、うれしいです", romaji: "yatta, ureshii desu", meaning_en: "Yay, I'm happy", meaning_np: "वाह, म खुशी छु" },
      { phrase: "よかったです", romaji: "yokatta desu", meaning_en: "I'm glad", meaning_np: "मलाई खुशी लाग्यो" },
      { phrase: "おめでとうございます", romaji: "omedetou gozaimasu", meaning_en: "Congratulations", meaning_np: "बधाई छ" },
      { phrase: "ざんねんです", romaji: "zannen desu", meaning_en: "That's too bad", meaning_np: "दुःखको कुरा हो" },
      { phrase: "かなしいです", romaji: "kanashii desu", meaning_en: "I am sad", meaning_np: "म दुःखी छु" },
      { phrase: "おこってます", romaji: "okottemasu", meaning_en: "I am angry", meaning_np: "म रिसाएको छु" },
      { phrase: "とてもつかれました", romaji: "totemo tsukaremashita", meaning_en: "I am very tired", meaning_np: "म धेरै थाकें" },
      { phrase: "しんぱいしています", romaji: "shinpai shiteimasu", meaning_en: "I am worried", meaning_np: "म चिन्तित छु" },
      { phrase: "しんぱいしないで", romaji: "shinpai shinaide", meaning_en: "Don't worry", meaning_np: "चिन्ता नगर्नुहोस्" },
      { phrase: "きんちょうします", romaji: "kinchou shimasu", meaning_en: "I'm nervous", meaning_np: "म नर्भस भएको छु" },
      { phrase: "なかないでください", romaji: "nakanaide kudasai", meaning_en: "Please don't cry", meaning_np: "कृपया नरुनुहोस्" },
      { phrase: "おもしろいです", romaji: "omoshiroi desu", meaning_en: "That's funny", meaning_np: "रमाइलो छ" },
    ],
  },
  {
    id: 4,
    category: "Greetings, Wishes & Classroom Phrases",
    phrases: [
      { phrase: "入ってもいいですか、先生", romaji: "haitte mo ii desu ka, sensei", meaning_en: "May I come in, sir?", meaning_np: "भित्र आउन सक्छु, सर?" },
      { phrase: "出てもいいですか、先生", romaji: "dete mo ii desu ka, sensei", meaning_en: "May I go out, sir?", meaning_np: "बाहिर जान सक्छु, सर?" },
      { phrase: "いただきます", romaji: "itadakimasu", meaning_en: "Said before eating", meaning_np: "खाना खानुअघि भनिने" },
      { phrase: "ごちそうさまでした", romaji: "gochisousama deshita", meaning_en: "Said after eating", meaning_np: "खाना खाइसकेपछि भनिने" },
      { phrase: "お誕生日おめでとうございます", romaji: "otanjoubi omedetou gozaimasu", meaning_en: "Happy Birthday", meaning_np: "जन्मदिनको शुभकामना" },
      { phrase: "ご結婚おめでとうございます", romaji: "gokekkon omedetou gozaimasu", meaning_en: "Happy Married Life", meaning_np: "विवाहको शुभकामना" },
      { phrase: "新年あけましておめでとうございます", romaji: "shinnen akemashite omedetou gozaimasu", meaning_en: "Happy New Year", meaning_np: "नयाँ वर्षको शुभकामना" },
      { phrase: "旅の道中お気をつけてください", romaji: "tabi no douchuu o-ki o tsukete kudasai", meaning_en: "Have a Safe Journey", meaning_np: "यात्रा सुरक्षित होस्" },
      { phrase: "安全な旅行をしてください", romaji: "anzen na ryokou o shite kudasai", meaning_en: "Have a Safe Travel", meaning_np: "सुरक्षित यात्रा गर्नुहोस्" },
      { phrase: "飛行機が無事に目的地に着きますように", romaji: "hikouki ga buji ni mokutekichi ni tsukimasu you ni", meaning_en: "Have a Safe Flight", meaning_np: "उडान सुरक्षित र सफल होस्" },
      { phrase: "気をつけてください", romaji: "ki o tsukete kudasai", meaning_en: "Take care", meaning_np: "ख्याल राख्नुहोस्" },
      { phrase: "お久しぶりですね／しばらくですね", romaji: "ohisashiburi desu ne / shibaraku desu ne", meaning_en: "Been a Long Time", meaning_np: "धेरै समयपछि भेटियो नि" },
      { phrase: "良い一日を過ごしてください", romaji: "yoi ichinichi o sugoshite kudasai", meaning_en: "Have a Good Day", meaning_np: "शुभ दिन होस्" },
      { phrase: "静かにしてください", romaji: "shizuka ni shite kudasai", meaning_en: "Silent Please", meaning_np: "कृपया शान्त रहनुहोस्" },
      { phrase: "携帯をいじらないでください", romaji: "keitai o ijiranaide kudasai", meaning_en: "Don't Mess With Your Mobile", meaning_np: "मोबाइल नचलाउनुहोस्" },
    ],
  },
];
