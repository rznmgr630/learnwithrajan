import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_11_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Dates are where code that works on your machine breaks in production, because a date can mean an instant, a local time, or a calendar date, and `Date` blurs all three.",
      np: "तपाईंको मेसिनमा चल्ने code production मा बिग्रने ठाउँ date हो, किनकि date ले क्षण, स्थानीय समय, वा पात्रोको मिति जनाउन सक्छ, र `Date` ले तीनै लाई धमिलो बनाउँछ।",
      jp: "日付は、自分の環境で動くコードが本番で壊れる場所です。日付は瞬間・ローカル時刻・暦の日付のどれも意味しうるのに、`Date` はその3つを曖昧にします。",
    },
    {
      en: "In Day 11 we cover:\n• <b>Instants</b> — UTC milliseconds, local versus UTC getters, and Date's mutability\n• <b>Parsing and formatting</b> — ISO 8601 in, `Intl.DateTimeFormat` out, and the date-only trap\n• <b>Timezones</b> — DST, why adding 24 hours is not tomorrow, and the Temporal types",
      np: "Day 11 मा: <b>Instant</b> (UTC millisecond, स्थानीय vs UTC getter, Date को mutability), <b>Parsing र formatting</b> (ISO 8601 भित्र, `Intl.DateTimeFormat` बाहिर, date-मात्र को पासो), <b>Timezone</b> (DST, 24 घण्टा थप्नु किन भोलि होइन, र Temporal type)।",
      jp: "Day 11では: <b>瞬間</b>（UTCミリ秒、ローカルとUTCのゲッター、Dateのミュータブル性）、<b>解析と書式化</b>（入力はISO 8601、出力は `Intl.DateTimeFormat`、日付だけの罠）、<b>タイムゾーン</b>（DST、24時間足しても明日にならない理由、Temporalの型）を扱います。",
    },
  ],
  sections: [
    {
      title: { en: "Four rules", np: "चार नियम", jp: "4つの規則" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>1.</b> Store instants in UTC. <b>2.</b> Never calculate a timezone by hand. <b>3.</b> Decide whether you mean a calendar date or a moment in time, and say so in the type. <b>4.</b> Use `Intl.DateTimeFormat` for display, and Temporal where your runtime supports it.",
            np: "<b>1.</b> क्षण UTC मा राख्नुहोस्। <b>2.</b> Timezone हातले कहिल्यै गणना नगर्नुहोस्। <b>3.</b> तपाईंले पात्रोको मिति भन्न खोज्नुभएको हो कि क्षण, निर्णय गरी type मै बताउनुहोस्। <b>4.</b> प्रदर्शनका लागि `Intl.DateTimeFormat`, र runtime ले समर्थन गरे Temporal प्रयोग गर्नुहोस्।",
            jp: "<b>1.</b> 瞬間はUTCで保存する。<b>2.</b> タイムゾーンを手計算しない。<b>3.</b> 暦の日付か瞬間かを決め、それを型で表す。<b>4.</b> 表示には `Intl.DateTimeFormat`、ランタイムが対応していればTemporalを使う。",
          },
        },
      ],
    },
  ],
};
