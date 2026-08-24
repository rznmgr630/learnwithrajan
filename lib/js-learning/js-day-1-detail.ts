import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_1_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "JavaScript was created in 1995 to make web pages interactive, and now runs everywhere: browsers, servers, mobile and desktop apps.\n\nDay 1 is about what JavaScript is and how it actually runs your code, before you write any of it.",
      np: "JavaScript 1995 मा web page लाई interactive बनाउन बनाइएको थियो, अहिले यो सबैतिर चल्छ: browser, server, mobile र desktop app।\n\nDay 1 JavaScript के हो र यसले तपाईंको code कसरी चलाउँछ भन्ने बारे हो, code लेख्नुअघि।",
      jp: "JavaScriptは1995年にWebページを対話的にするために作られ、今ではブラウザ・サーバー・モバイル・デスクトップとどこでも動きます。\n\nDay 1では、コードを書く前に、JavaScriptとは何か、そしてコードが実際にどう動くのかを学びます。",
    },
    {
      en: "In Day 1 we cover:\n• <b>History and advantages</b> — who made it, and why it spread\n• <b>Execution context</b> — the memory and code components\n• <b>Two phases</b> — memory creation, then code execution\n• <b>The call stack</b> — how function contexts stack up and unwind",
      np: "Day 1 मा: इतिहास र फाइदा, execution context, दुई phase (memory creation र code execution), र call stack।",
      jp: "Day 1では: 歴史と利点、実行コンテキスト、2つのフェーズ（メモリ生成と実行）、コールスタックを扱います。",
    },
  ],
  sections: [
    {
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "ZvbzSrg0afE", title: "How JavaScript Works Behind the Scenes" },
        { type: "youtube", videoId: "iLWTnMzWtj4", title: "Execution Context and the Call Stack" },
      ],
    },
    {
      title: { en: "A short history", np: "छोटो इतिहास", jp: "短い歴史" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>Brendan Eich</b> created JavaScript at Netscape in <b>1995</b>. Microsoft followed with JScript in 1996, and in 1997 the language was standardised as <b>ECMAScript</b> — the specification that defines how JavaScript should behave. <b>Node.js</b> took it to the server in 2009, and <b>ES6 (2015)</b> brought the modern features most code uses today.",
            np: "<b>Brendan Eich</b> ले 1995 मा Netscape मा JavaScript बनाए। 1996 मा Microsoft ले JScript ल्यायो, र 1997 मा भाषा <b>ECMAScript</b> को रूपमा standardise भयो। <b>Node.js</b> ले 2009 मा यसलाई server सम्म पुर्‍यायो, र <b>ES6 (2015)</b> ले आजका आधुनिक feature ल्यायो।",
            jp: "<b>Brendan Eich</b> が1995年にNetscapeでJavaScriptを作りました。1996年にMicrosoftがJScriptを出し、1997年に<b>ECMAScript</b>として標準化。2009年に<b>Node.js</b>がサーバーへ広げ、<b>ES6（2015年）</b>が現代的な機能をもたらしました。",
          },
        },
      ],
    },
    {
      title: { en: "How your code actually runs", np: "तपाईंको code वास्तवमा कसरी चल्छ", jp: "コードは実際にどう動くのか" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Every program runs inside an <b>execution context</b>, which has a <b>memory component</b> (variables and functions) and a <b>code component</b> (the thread of execution). It works in two phases: memory creation gives every variable `undefined` and stores each function, then code execution runs the lines in order. Calling a function creates a new context on the <b>call stack</b>, and returning pops it off.",
            np: "हरेक program <b>execution context</b> भित्र चल्छ, जसमा <b>memory component</b> (variable र function) र <b>code component</b> (thread of execution) हुन्छन्। यो दुई phase मा काम गर्छ: memory creation ले हरेक variable लाई `undefined` दिन्छ र function राख्छ, त्यसपछि code execution ले line क्रमैसँग चलाउँछ। Function call गर्दा <b>call stack</b> मा नयाँ context बन्छ, र return गर्दा हट्छ।",
            jp: "すべてのプログラムは<b>実行コンテキスト</b>の中で動きます。そこには<b>メモリコンポーネント</b>（変数と関数）と<b>コードコンポーネント</b>（実行のスレッド）があります。動きは2フェーズ: メモリ生成で各変数に `undefined` を入れて関数を保存し、次に実行フェーズが行を順に走らせます。関数を呼ぶと<b>コールスタック</b>に新しいコンテキストが積まれ、returnで取り除かれます。",
          },
        },
      ],
    },
  ],
};
