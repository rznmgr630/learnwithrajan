import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_9_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Text is where JavaScript's details show through: methods that never mutate, template literals that build strings from expressions, and a UTF-16 model that makes `\"👍\".length` equal 2.",
      np: "पाठमै JavaScript का विवरण देखिन्छन्: कहिल्यै mutate नगर्ने method, expression बाट string बनाउने template literal, र `\"👍\".length` लाई 2 बनाउने UTF-16 model।",
      jp: "テキストにはJavaScriptの細部が現れます。決して変更しないメソッド、式から文字列を組み立てるテンプレートリテラル、そして `\"👍\".length` を2にするUTF-16のモデルです。",
    },
    {
      en: "In Day 9 we cover:\n• <b>Strings</b> — immutability and the everyday method set\n• <b>Template literals</b> — interpolation, multiline, and tagged templates\n• <b>Unicode</b> — code units versus code points, `normalize()` and `localeCompare()`",
      np: "Day 9 मा: <b>String</b> (immutability र दैनिक method), <b>Template literal</b> (interpolation, multiline, tagged template), <b>Unicode</b> (code unit vs code point, normalize र localeCompare)।",
      jp: "Day 9では: <b>文字列</b>（イミュータビリティと日常的なメソッド）、<b>テンプレートリテラル</b>（埋め込み・複数行・タグ付き）、<b>Unicode</b>（コードユニットとコードポイント、normalizeとlocaleCompare）を扱います。",
    },
  ],
  sections: [
    {
      title: { en: "Why Unicode matters here", np: "यहाँ Unicode किन महत्वपूर्ण छ", jp: "ここでUnicodeが重要な理由" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`.length` counts UTF-16 code units, so an emoji counts as two and `split(\"\")` can cut one in half. Spread the string or use `for...of` to walk code points, `normalize()` before comparing text a user typed, and `localeCompare()` whenever the sort order will be read by a person.",
            np: "`.length` ले UTF-16 code unit गन्छ, त्यसैले emoji दुई गनिन्छ र `split(\"\")` ले एउटालाई दुई टुक्रा पार्न सक्छ। Code point मा घुम्न string spread गर्नुहोस् वा `for...of` प्रयोग गर्नुहोस्, user ले टाइप गरेको पाठ तुलना गर्नुअघि `normalize()` गर्नुहोस्, र क्रम मानिसले पढ्ने भए `localeCompare()` प्रयोग गर्नुहोस्।",
            jp: "`.length` はUTF-16のコードユニットを数えるため、絵文字は2と数えられ、`split(\"\")` は1文字を割ってしまうことがあります。コードポイントをたどるにはスプレッドか `for...of` を使い、ユーザーが入力したテキストの比較前には `normalize()`、並び順を人が読むなら `localeCompare()` を使いましょう。",
          },
        },
      ],
    },
  ],
};
