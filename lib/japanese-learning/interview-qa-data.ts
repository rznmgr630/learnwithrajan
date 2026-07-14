import type { QAFlashcardItem } from "@/lib/qa-flashcards-types";

export const JAPANESE_INTERVIEW_QA: QAFlashcardItem[] = [
  {
    id: 1,
    questionEn: "{自己|じこ}{紹介|しょうかい}をお{願|ねが}いします。(Jiko shōkai o onegai shimasu.)",
    questionNe: "कृपया आफ्नो परिचय दिनुहोस्।",
    answerEn:
      "はじめまして。{私|わたし}の{名前|なまえ}は◯◯です。ネパールから{来|き}ました。よろしくお{願|ねが}いします。",
    answerNe: "नमस्ते, मेरो नाम ◯◯ हो। म नेपालबाट आएको हुँ। तपाईंलाई भेट्न पाउँदा खुसी लाग्यो।",
  },
  {
    id: 2,
    questionEn: "{生年月日|せいねんがっぴ}はいつですか。(Seinengappi wa itsu desu ka.)",
    questionNe: "तपाईंको जन्ममिति कहिले हो?",
    answerEn: "◯{年|ねん}◯{月|がつ}◯{日|にち}です。",
    answerNe: "◯ साल ◯ महिना ◯ गते हो।",
  },
  {
    id: 3,
    questionEn: "{誕生日|たんじょうび}はいつですか。(Tanjōbi wa itsu desu ka.)",
    questionNe: "तपाईंको जन्मदिन कहिले हो?",
    answerEn: "◯{月|がつ}◯{日|にち}です。(उदाहरण: 7{月|がつ}17{日|にち}です。)",
    answerNe: "◯ महिना ◯ गते हो।",
  },
  {
    id: 4,
    questionEn: "{何歳|なんさい}ですか。（おいくつですか。）(Nansai desu ka. / Oikutsu desu ka.)",
    questionNe: "तपाईं कति वर्षको हुनुभयो?",
    answerEn: "{私|わたし}は◯◯{歳|さい}です。",
    answerNe: "म ◯◯ वर्षको हुँ।",
  },
  {
    id: 5,
    questionEn: "ご{家族|かぞく}は{何人|なんにん}ですか。(Go-kazoku wa nannin desu ka.)",
    questionNe: "तपाईंको परिवारमा कति जना छन्?",
    answerEn: "{家族|かぞく}は◯{人|にん}です。",
    answerNe: "परिवारमा ◯ जना छन्।",
  },
  {
    id: 6,
    questionEn:
      "{家族|かぞく}に{誰|だれ}がいますか。（{誰|だれ}と{住|す}んでいますか。）(Kazoku ni dare ga imasu ka.)",
    questionNe: "परिवारमा को-को हुनुहुन्छ? (कोसँग बस्नुहुन्छ?)",
    answerEn: "{父|ちち}と{母|はは}と{兄|あに}と…がいます。",
    answerNe: "बुबा, आमा, दाजु … हुनुहुन्छ।",
  },
  {
    id: 7,
    questionEn: "{結婚|けっこん}していますか。(Kekkon shite imasu ka.)",
    questionNe: "तपाईंको विवाह भएको छ?",
    answerEn: "はい、{結婚|けっこん}しています。／ いいえ、{独身|どくしん}です。",
    answerNe: "हो, विवाह भएको छ। / छैन, म अविवाहित हुँ।",
  },
  {
    id: 8,
    questionEn: "{子供|こども}は{何人|なんにん}いますか。(Kodomo wa nannin imasu ka.)",
    questionNe: "तपाईंका छोराछोरी कति जना छन्?",
    answerEn: "◯{人|にん}います。／ いいえ、いません。",
    answerNe: "◯ जना छन्। / छैनन्।",
  },
  {
    id: 9,
    questionEn: "{今|いま}、{何|なに}をしていますか。(Ima, nani o shite imasu ka.)",
    questionNe: "अहिले तपाईं के गर्दै हुनुहुन्छ?",
    answerEn: "{日本語|にほんご}を{勉強|べんきょう}しています。",
    answerNe: "म जापानी भाषा पढ्दै छु।",
  },
  {
    id: 10,
    questionEn: "{仕事|しごと}をしたことがありますか。(Shigoto o shita koto ga arimasu ka.)",
    questionNe: "तपाईंले काम गर्नुभएको अनुभव छ?",
    answerEn: "はい、あります。／ いいえ、ありません。",
    answerNe: "छ। / छैन।",
  },
  {
    id: 11,
    questionEn: "{日本語|にほんご}は{難|むずか}しいですか。(Nihongo wa muzukashii desu ka.)",
    questionNe: "जापानी भाषा सिक्न गाह्रो छ?",
    answerEn: "{少|すこ}し{難|むずか}しいですが、{面白|おもしろ}いです。",
    answerNe: "अलिकति गाह्रो छ, तर रमाइलो छ।",
  },
  {
    id: 12,
    questionEn: "お{父|とう}さんの{名前|なまえ}は{何|なん}ですか。(Otōsan no namae wa nan desu ka.)",
    questionNe: "तपाईंको बुबाको नाम के हो?",
    answerEn: "{父|ちち}の{名前|なまえ}は◯◯です。",
    answerNe: "मेरो बुबाको नाम ◯◯ हो।",
  },
  {
    id: 13,
    questionEn:
      "{弟|おとうと}（{妹|いもうと}）の{名前|なまえ}は{何|なん}ですか。(Otōto/Imōto no namae wa nan desu ka.)",
    questionNe: "तपाईंको भाइ/बहिनीको नाम के हो?",
    answerEn: "{弟|おとうと}の{名前|なまえ}は◯◯です。",
    answerNe: "मेरो भाइको नाम ◯◯ हो।",
  },
  {
    id: 14,
    questionEn:
      "あなたは{大学|だいがく}を{卒業|そつぎょう}しましたか。(Anata wa daigaku o sotsugyō shimashita ka.)",
    questionNe: "तपाईंले ब्याचलर (कलेज) सक्नुभयो?",
    answerEn: "はい、{卒業|そつぎょう}しました。／ いいえ、まだです。",
    answerNe: "हो, सकें। / अझै सकेको छैन।",
  },
  {
    id: 15,
    questionEn: "なぜ{日本|にほん}へ{行|い}きたいですか。(Naze Nihon e ikitai desu ka.)",
    questionNe: "तपाईं किन जापान जान चाहनुहुन्छ?",
    answerEn: "{日本|にほん}で{勉強|べんきょう}して、{技術|ぎじゅつ}を{学|まな}びたいからです。",
    answerNe: "जापानमा पढेर सीप सिक्न चाहन्छु त्यसैले।",
  },
];

export const JAPANESE_INTERVIEW_QA_COUNT = JAPANESE_INTERVIEW_QA.length;
