import type { QAFlashcardItem } from "@/lib/qa-flashcards-types";

export const JAPANESE_INTERVIEW_QA: QAFlashcardItem[] = [
  {
    id: 1,
    questionEn: "{自己|じこ}{紹介|しょうかい}をお{願|ねが}いします。(Jiko shōkai o onegai shimasu.)",
    questionNe: "कृपया आफ्नो परिचय दिनुहोस्।",
    answerEn:
      "はじめまして。{私|わたし}の{名前|なまえ}はラジャン・ミドゥン・マガルです。ネパールの{出身|しゅっしん}で、{今|いま}はカトマンズに{住|す}んでいます。ソフトウェアエンジニアとして{働|はたら}いています。よろしくお{願|ねが}いします。",
    answerNe:
      "नमस्ते, मेरो नाम राजन मिडुन मगर हो। म नेपालको गुल्मीको हुँ, हाल काठमाडौंमा बस्छु। म सफ्टवेयर इन्जिनियरको रूपमा काम गर्छु। तपाईंलाई भेट्न पाउँदा खुसी लाग्यो।",
  },
  {
    id: 2,
    questionEn: "{生年月日|せいねんがっぴ}はいつですか。(Seinengappi wa itsu desu ka.)",
    questionNe: "तपाईंको जन्ममिति कहिले हो?",
    answerEn: "1997{年|ねん}10{月|がつ}11{日|にち}です。",
    answerNe: "सन् १९९७ अक्टोबर ११ हो।",
  },
  {
    id: 3,
    questionEn: "{誕生日|たんじょうび}はいつですか。(Tanjōbi wa itsu desu ka.)",
    questionNe: "तपाईंको जन्मदिन कहिले हो?",
    answerEn: "10{月|がつ}11{日|にち}です。",
    answerNe: "अक्टोबर ११ हो।",
  },
  {
    id: 4,
    questionEn: "{何歳|なんさい}ですか。（おいくつですか。）(Nansai desu ka. / Oikutsu desu ka.)",
    questionNe: "तपाईं कति वर्षको हुनुभयो?",
    answerEn: "{私|わたし}は28{歳|さい}です。",
    answerNe: "म २८ वर्षको हुँ।",
  },
  {
    id: 5,
    questionEn: "ご{家族|かぞく}は{何人|なんにん}ですか。(Go-kazoku wa nannin desu ka.)",
    questionNe: "तपाईंको परिवारमा कति जना छन्?",
    answerEn: "{家族|かぞく}は{四人|よにん}です。",
    answerNe: "परिवारमा ४ जना छन्।",
  },
  {
    id: 6,
    questionEn:
      "{家族|かぞく}に{誰|だれ}がいますか。（{誰|だれ}と{住|す}んでいますか。）(Kazoku ni dare ga imasu ka.)",
    questionNe: "परिवारमा को-को हुनुहुन्छ? (कोसँग बस्नुहुन्छ?)",
    answerEn: "{父|ちち}と{母|はは}と{妻|つま}と{私|わたし}がいます。{子供|こども}はいません。",
    answerNe: "बुबा, आमा, श्रीमती र म — यति जना छौं। सन्तान छैनन्।",
  },
  {
    id: 7,
    questionEn: "{結婚|けっこん}していますか。(Kekkon shite imasu ka.)",
    questionNe: "तपाईंको विवाह भएको छ?",
    answerEn: "はい、{結婚|けっこん}しています。",
    answerNe: "हो, मेरो विवाह भएको छ।",
  },
  {
    id: 8,
    questionEn: "{子供|こども}は{何人|なんにん}いますか。(Kodomo wa nannin imasu ka.)",
    questionNe: "तपाईंका छोराछोरी कति जना छन्?",
    answerEn: "いいえ、まだ{子供|こども}はいません。",
    answerNe: "छैन, अहिलेसम्म सन्तान छैनन्।",
  },
  {
    id: 9,
    questionEn: "{今|いま}、{何|なに}をしていますか。(Ima, nani o shite imasu ka.)",
    questionNe: "अहिले तपाईं के गर्दै हुनुहुन्छ?",
    answerEn:
      "ソフトウェアエンジニアとして{働|はたら}きながら、{日本語|にほんご}を{勉強|べんきょう}しています。",
    answerNe: "म सफ्टवेयर इन्जिनियरको काम गर्दै जापानी भाषा पढ्दै छु।",
  },
  {
    id: 10,
    questionEn: "{仕事|しごと}をしたことがありますか。(Shigoto o shita koto ga arimasu ka.)",
    questionNe: "तपाईंले काम गर्नुभएको अनुभव छ?",
    answerEn: "はい、あります。{今|いま}はソフトウェアエンジニアとして{働|はたら}いています。",
    answerNe: "छ, अहिले म सफ्टवेयर इन्जिनियरको रूपमा काम गर्दै छु।",
  },
  {
    id: 11,
    questionEn: "{日本語|にほんご}は{難|むずか}しいですか。(Nihongo wa muzukashii desu ka.)",
    questionNe: "जापानी भाषा सिक्न गाह्रो छ?",
    answerEn:
      "{少|すこ}し{難|むずか}しいですが、{面白|おもしろ}いです。{私|わたし}はまだ{初心者|しょしんしゃ}で、1{年間|ねんかん}{勉強|べんきょう}しています。",
    answerNe: "अलिकति गाह्रो छ, तर रमाइलो छ। म अझै सुरुवाती (beginner) तहमा छु, १ वर्षदेखि पढ्दै छु।",
  },
  {
    id: 12,
    questionEn: "お{父|とう}さんの{名前|なまえ}は{何|なん}ですか。(Otōsan no namae wa nan desu ka.)",
    questionNe: "तपाईंको बुबाको नाम के हो?",
    answerEn: "{父|ちち}の{名前|なまえ}はラム・バハドゥル・ミドゥンです。",
    answerNe: "मेरो बुबाको नाम राम बहादुर मिडुन हो।",
  },
  {
    id: 13,
    questionEn:
      "{弟|おとうと}（{妹|いもうと}）の{名前|なまえ}は{何|なん}ですか。(Otōto/Imōto no namae wa nan desu ka.)",
    questionNe: "तपाईंको भाइ/बहिनीको नाम के हो?",
    answerEn: "{弟|おとうと}も{妹|いもうと}もいません。",
    answerNe: "मेरो भाइ वा बहिनी छैनन्।",
  },
  {
    id: 14,
    questionEn:
      "あなたは{大学|だいがく}を{卒業|そつぎょう}しましたか。(Anata wa daigaku o sotsugyō shimashita ka.)",
    questionNe: "तपाईंले ब्याचलर (कलेज) सक्नुभयो?",
    answerEn:
      "はい、{卒業|そつぎょう}しました。コンピューターサイエンス・アンド・インフォメーションテクノロジー（CSIT）を{専攻|せんこう}しました。",
    answerNe: "हो, मैले पूरा गरें। मैले CSIT (Computer Science and Information Technology) मा स्नातक गरेको हुँ।",
  },
  {
    id: 15,
    questionEn: "なぜ{日本|にほん}へ{行|い}きたいですか。(Naze Nihon e ikitai desu ka.)",
    questionNe: "तपाईं किन जापान जान चाहनुहुन्छ?",
    answerEn:
      "ソフトウェアエンジニアとして、{日本|にほん}でIT{技術|ぎじゅつ}を{学|まな}んで{働|はたら}きたいからです。",
    answerNe: "मलाई सफ्टवेयर इन्जिनियरको रूपमा जापानमा IT प्रविधि सिकेर काम गर्ने इच्छा छ, त्यसैले।",
  },
];

export const JAPANESE_INTERVIEW_QA_COUNT = JAPANESE_INTERVIEW_QA.length;
