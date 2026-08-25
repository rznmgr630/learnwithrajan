import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_8_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "`Set` and `Map` are the two collections JavaScript added for jobs plain objects and arrays handle awkwardly: holding unique values, and keying data by something other than a string.",
      np: "`Set` र `Map` ती दुई collection हुन् जुन JavaScript ले साधारण object र array ले असजिलोसँग गर्ने काम — अद्वितीय value राख्नु, र string बाहेकको कुराले data key गर्नु — का लागि थप्यो।",
      jp: "`Set` と `Map` は、普通のオブジェクトや配列では扱いにくい仕事 — 一意な値を保持すること、文字列以外でデータにキーを付けること — のためにJavaScriptが追加した2つのコレクションです。",
    },
    {
      en: "In Day 8 we cover:\n• <b>Map</b> — any value as a key, `set`/`get`/`has`, and counting patterns\n• <b>Set</b> — unique values, deduping an array, and membership checks\n• How both compare with objects and arrays, and when each one fits",
      np: "Day 8 मा: <b>Map</b> (जुनसुकै key, set/get/has, गन्ती), <b>Set</b> (अद्वितीय value, dedupe, सदस्यता जाँच), र यी object र array सँग कसरी तुलना हुन्छन्।",
      jp: "Day 8では: <b>Map</b>（任意のキー、set/get/has、集計）、<b>Set</b>（一意な値、重複排除、存在確認）、そしてオブジェクトや配列との使い分けを学びます。",
    },
  ],
  sections: [
    {
      title: { en: "Choosing between them", np: "कुन छान्ने", jp: "使い分け" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Reach for a <b>Map</b> when keys are dynamic or are not strings — an object, a DOM node, a number. Reach for a <b>Set</b> when you only care whether a value is present, or need duplicates gone. Both keep insertion order, both expose `.size`, and both are iterable with `for...of`.",
            np: "Key dynamic वा string नभएको बेला — object, DOM node, number — <b>Map</b> प्रयोग गर्नुहोस्। Value छ कि छैन मात्र मतलब हुँदा वा duplicate हटाउनुपर्दा <b>Set</b>। दुबैले insertion order राख्छन्, दुबैसँग `.size` छ, र दुबै `for...of` ले iterate हुन्छन्।",
            jp: "キーが動的だったり文字列でないとき（オブジェクト・DOMノード・数値）は<b>Map</b>を、値の有無だけが問題だったり重複を消したいときは<b>Set</b>を選びます。どちらも挿入順を保ち、`.size` を持ち、`for...of` で反復できます。",
          },
        },
      ],
    },
  ],
};
