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
];
