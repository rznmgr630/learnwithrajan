import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_10_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Regular expressions turn text problems into patterns: validating input, pulling fields out of a line, and rewriting matches on the fly.",
      np: "Regular expression ले पाठका समस्यालाई pattern मा बदल्छ: input प्रमाणित गर्नु, line बाट field निकाल्नु, र match लाई तत्कालै पुनर्लेखन गर्नु।",
      jp: "正規表現はテキストの問題をパターンに変えます。入力の検証、1行からのフィールド抽出、一致箇所のその場での書き換えなどです。",
    },
    {
      en: "In Day 10 we cover:\n• <b>Syntax</b> — flags, character classes, quantifiers and anchors\n• <b>Structure</b> — greedy versus lazy, capture groups, backreferences and lookarounds\n• <b>APIs</b> — match, matchAll, exec, replace with a function, and the ReDoS trap",
      np: "Day 10 मा: <b>Syntax</b> (flag, character class, quantifier, anchor), <b>संरचना</b> (greedy vs lazy, capture group, backreference, lookaround), <b>API</b> (match, matchAll, exec, function सँग replace, र ReDoS को पासो)।",
      jp: "Day 10では: <b>構文</b>（フラグ・文字クラス・量指定子・アンカー）、<b>構造</b>（貪欲と遅延・キャプチャグループ・後方参照・先読み）、<b>API</b>（match・matchAll・exec・関数付きreplace、そしてReDoSの罠）を扱います。",
    },
  ],
  sections: [
    {
      title: { en: "Before you ship a pattern", np: "Pattern पठाउनुअघि", jp: "パターンを出す前に" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Anchor patterns you use for validation, prefer lazy quantifiers when matching delimited chunks, and name your capture groups once a pattern has more than two. Reused `/g` regexes carry a `lastIndex`, so create a fresh one inside loops. Finally, look hard at nested quantifiers such as `(a+)+` before running a pattern on input you do not control.",
            np: "Validation का लागि प्रयोग गर्ने pattern लाई anchor गर्नुहोस्, सीमांकित टुक्रा match गर्दा lazy quantifier रोज्नुहोस्, र pattern मा दुई भन्दा धेरै group भएपछि तिनलाई नाम दिनुहोस्। पुनः प्रयोग गरिएका `/g` regex ले `lastIndex` बोक्छन्, त्यसैले loop भित्र नयाँ बनाउनुहोस्। अन्तमा, आफूले नियन्त्रण नगर्ने input मा pattern चलाउनुअघि `(a+)+` जस्ता nested quantifier राम्ररी हेर्नुहोस्।",
            jp: "検証に使うパターンにはアンカーを付け、区切られた塊に一致させるときは遅延量指定子を選び、グループが3つ以上になったら名前を付けましょう。使い回した `/g` の正規表現は `lastIndex` を持つので、ループ内では新しく作ります。最後に、制御できない入力にパターンを走らせる前に `(a+)+` のような入れ子の量指定子をよく確認してください。",
          },
        },
      ],
    },
  ],
};
