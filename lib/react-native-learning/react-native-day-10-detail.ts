import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 10 — Styling chapter + condensed component exercises + UI libs. */
export const REACT_NATIVE_DAY_10_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Styling** topics: borders, shadows, spacing, typography encapsulation, icons, organizing styles.**Exercises**: button component, improved welcome, cards, listings details, improved view-image—conceptually chunked here.**UI Libraries** callout wraps the day.",
                                                                                np: "शैली अभ्यास।",
      jp: "スタイル編（線・影・余白・文字・カプセル化・アイコン・整理）と演習相当、**UI ライブラリ**の注意点。",
    },
  ],
  sections: [
    {
      title: { en: "Introduction", np: "परिचय", jp: "Introduction" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "RN styling is **JS objects** + **StyleSheet.create** + **flex**—no inheritance cascade. Document **token maps** early so web designers can reason about parity.",
                                                                                np: "टोकन पहिले।",
            jp: "継承なし。**デザイントークン**を先に決めると Web チームと会話しやすい。",
          },
        },
      ],
    },
    {
      title: { en: "Borders", np: "सीमा", jp: "Borders" },
      blocks: [
        {
          type: "code",
          title: { en: "Radius + hairline", np: "दायरा", jp: "角丸と境界線" },
          code: `const card = {
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: '#e5e7eb',
  borderRadius: 16,
};`,
        },
      ],
    },
    {
      title: { en: "Shadows", np: "छाया", jp: "Shadows" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "iOS uses **`shadowColor`/`shadowOffset`/`shadowOpacity`/`shadowRadius`**—Android prefers **`elevation`**. Consider **`Platform.select`** helper from Day 7.",
                                                                                np: "उपकरण भिन्न।",
            jp: "iOS は shadow 一式、Android は **elevation**。**Platform.select** が定番。",
          },
        },
      ],
    },
    {
      title: {
        en: "Paddings and Margins",
                                                                              np: "प्याडिंग",
        jp: "Paddings and Margins",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`gap`** (newer RN) reduces nested `margin` hacks for horizontal lists.**`padding*`** handles inner bleed while **`margin*`** separates siblings.",
                                                                                np: "gap प्रयोग।",
            jp: "**gap** で余白を簡潔に。内側は **padding**、兄弟間は **margin**。",
          },
        },
      ],
    },
    {
      title: { en: "Styling Text", np: "टेक्स्ट शैली", jp: "Styling Text" },
      blocks: [
        {
          type: "code",
          title: { en: "Line height + letter spacing", np: "वाक्य घनत्व", jp: "行間" },
          code: `const body = {
  fontSize: 16,
  lineHeight: 22,
  letterSpacing: -0.1,
};`,
        },
      ],
    },
    {
      title: {
        en: "Encapsulating Styles",
                                                                              np: "शैली क्याप्सुल",
        jp: "Encapsulating Styles",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`StyleSheet.flatten`** occasionally merges conditional arrays—prefer helper functions returning style arrays for theme switching.",
                                                                                np: "सार्व गतिक।",
            jp: "テーマ切替は **関数で style 配列**を返すと読みやすい。",
          },
        },
      ],
    },
    {
      title: { en: "Icons", np: "आइकन", jp: "Icons" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`@expo/vector-icons`** bundles Material/Ionicons—match icon weight to typography weight for visual harmony.",
                                                                                np: "भरिएको सेट।",
            jp: "**@expo/vector-icons** が手早い。線の太さを文字と揃える。",
          },
        },
      ],
    },
    {
      title: {
        en: "Platform-specific Code (styling)",
                                                                              np: "प्लेटफर्म शैली",
        jp: "Platform-specific Code",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Material vs HIG spacing differs—use **design tokens per platform** when brand guidelines demand it.",
                                                                                np: "हिग मटेरियल।",
            jp: "Material / HIG で余白が違うときは **OS 別トークン**。",
          },
        },
      ],
    },
    {
      title: {
        en: "Organizing Styles",
                                                                              np: "फाइल गुच्छा",
        jp: "Organizing Styles",
      },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`ComponentName.styles.ts`** colocates large apps—**`theme/spacing.ts`** centralizes numbers.",
                                                                                np: "थिम केन्द्र।",
              jp: "大規模は **styles ファイル分離** + **theme** 集約。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Exercises (condensed)", np: "अभ्यास", jp: "Exercises" },
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "**Building the Button Component** — primary/secondary variants + disabled opacity.",
                                                                                np: "बटन।",
              jp: "**Button コンポーネント**：primary/secondary・無効化。",
            },
            {
              en: "**Improving the Welcome Screen** — gradient/image overlay + spacing rhythm.",
                                                                                np: "स्वागत।",
              jp: "**ウェルカム改善**：余白のリズムと背景。",
            },
            {
              en: "**Building the Card Component** + **Listing Details** + **ListItem** + **View Image** polish.",
                                                                                np: "कार्ड।",
              jp: "**Card / Listing 詳細 / ListItem / View Image** の仕上げ。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "UI Libraries", np: "UI लाइब्रेरी", jp: "UI Libraries" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**React Native Paper**, **NativeBase**, **Tamagui** trade bundle size & theming ergonomics—prototype with tokens first, lock library after navigation decisions.",
                                                                                np: "लाइब्रेरी पछि।",
            jp: "**Paper / NativeBase / Tamagui** 等はバンドルとテーマのトレードオフ。**ナビ設計の後**に固定が無難。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Shadow missing on Android?",
                                                np: "एन्ड्रोइड छाया?",
        jp: "Android で影が出ない",
      },
      answer: {
        en: "Use **`elevation`** + ensure parent backgrounds not transparent bugs—test on physical devices (emulator GPU quirks).",
                                                                                np: "elevation।",
        jp: "**elevation** と背景色。実機で確認。",
      },
    },
  ],
};
