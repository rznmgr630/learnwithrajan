import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 14 — Additional improvements + snippets + wrap Part 1. */
export const REACT_NATIVE_DAY_14_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Additional Improvements**: chevrons, long text truncation, polishing messages screens, revisiting imports, flexible widths, flexible architecture commentary, **`CategoryPickerItem`**, renaming consistency, **`Custom Snippets`**, **Course Wrap Up** before Part 2.",
                                                                                       np: "पार्ट१ बन्द।",
      jp: "追加の仕上げ（chevron・長文・アーキテクチャ・スニペットなど）と **Part 1 ラップ**。",
    },
  ],
  sections: [
    {
      title: {
        en: "Introduction",
                                                                                       np: "परिचय",
        jp: "Introduction",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "These micro-lessons shave UX rough edges—a strong bridge before jumping into cameras and navigation stacks.",
                                                                              np: "नेभअघि।",
              jp: "ナイティブ・ナビ編の直前で UI の角を削るフェーズです。",
          },
        },
      ],
    },
    {
      title: {
        en: "Adding Chevrons",
                                                                                       np: "चेभ्रोन",
        jp: "Adding Chevrons",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`Ionicons` chevron-forward** aligns with **`justifyContent: 'space-between'`** rows—reuse `AppListItemTrailing` helpers.",
                                                                              np: "ट्रेलिङ।",
              jp: "右端のアイコンは **space-between** とセットで並べやすい。",
          },
        },
      ],
    },
    {
      title: {
        en: "Handling Long Text",
                                                                                       np: "लामो पाठ्य",
        jp: "Handling Long Text",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "`numberOfLines` + ellipsis",
                                                                              np: "एलिप्सिस",
            jp: "ellipsis",
          },
          code: `<Text numberOfLines={2} ellipsizeMode="tail">
  {description}
</Text>`,
        },
      ],
    },
    {
      title: {
        en: "Improving the Messages Screen",
                                                                                       np: "मेसेज स्क्रिन",
        jp: "Improving the Messages Screen",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Search bar + segmented control** combos often share list headers—invert list data when filters change.",
                                                                              np: "फिल्टर।",
              jp: "検索フィルターで **フラットリストの data を差し替え**。",
          },
        },
      ],
    },
    {
      title: {
        en: "Fixing the Auto Import Issue",
                                                                                       np: "इम्पोर्ट",
        jp: "Fixing the Auto Import Issue",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Reiterate **TS path parity** (`tsconfig.baseUrl`, `metro.config`).**Restart TS server + Metro** after alias edits.",
                                                                              np: "पुन प्रारम्भ।",
              jp: "エイリアス変更後は **TS Server と Metro を再起動**が鉄則。",
          },
        },
      ],
    },
    {
      title: {
        en: "Input Components with Dynamic Width",
                                                                                       np: "डाइनामिक चौडाइ",
        jp: "Input Components with Dynamic Width",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`measure` + layout events** shrink chips horizontally while preserving min tap targets (**44 px** heuristic).",
                                                                              np: "गोल डल।",
              jp: "**onLayout / flexGrow** で可変幅。タップ域は確保。",
          },
        },
      ],
    },
    {
      title: {
        en: "Flexible Architecture",
                                                                                       np: "लचिलो संरचना",
        jp: "Flexible Architecture",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Boundaries: **`/presentation`**, **`/domain/adapters`**, **`/data/api`** layering keeps screens dumb while enabling future web hydration.",
                                                                              np: "परब मोटो छुटाइ।",
              jp: "**画面・ドメイン・データ** で責務分離。**将来 Web とも共通化**しやすい。",
          },
        },
      ],
    },
    {
      title: {
        en: "Building the CategoryPickerItem Component",
                                                                                       np: "श्रेणी पिकर",
        jp: "Building the CategoryPickerItem Component",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Icon + badge + selectable state**—pair with Yup enum + Formik **`setFieldValue`** when tapping categories.",
                                                                              np: "चयन।",
              jp: "タップで **setFieldValue**。**Yup enum** と揃える。",
          },
        },
      ],
    },
    {
      title: {
        en: "Revisiting Components' Names",
                                                                                       np: "नाम पुष्टि",
        jp: "Revisiting Components' Names",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**PascalCase** screen names differentiate route components vs **`useXxxScreen` hooks.** Document naming conventions in README for teammates.",
                                                                              np: "README।",
              jp: "**Screen 后缀** と **hook 前缀** で役割が読みやすくなるように README で約束する。",
          },
        },
      ],
    },
    {
      title: {
        en: "Custom Snippets",
                                                                                       np: "अंशहरू",
        jp: "Custom Snippets",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "VS Code snippet excerpt",
                                                                              np: "स्निपेट JSON",
            jp: ".vscode にスニペット",
          },
          code: `// .vscode/react-native.code-snippets
{
  "rn-screen-scaffold": {
    "prefix": "rn-screen",
    "body": [
      "import { View, Text } from 'react-native';",
      "",
      "export function $1Screen() {",
      "  return (",
      "    <View style={{ flex: 1 }}>",
      "      <Text>$2</Text>",
      "    </View>",
      "  );",
      "}",
    ],
    "description": "React Native screen scaffold"
  }
}`,
        },
      ],
    },
    {
      title: {
        en: "Course Wrap Up · The Ultimate React Native: Part 2",
                                                                              np: "अर्को भाग",
        jp: "Course Wrap Up / Part 2 へ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Part 2 picks up**: native APIs, navigators, networking, offline, auth, notifications, shipping—resume at **Day 15** in this track.",
                                                                              np: "दिन१५मा।",
            jp: "Part 2 は **Day 15** から：**ネイティブ・ナビ・API・オフライン・認証・通知・配布**。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Ship Part 1 to stores?",
                                                          np: "अझै?",
        jp: "Part 1 だけでリリース？",
      },
      answer: {
        en: "**POC/demo yes**, production storefronts rarely ship without Navigation + Networking + Offline guardrails tackled in Part 2.",
                                                                              np: "खोइ नेभ।",
              jp: "デモなら可。実運用は後半の機能がほぼ必須になります。",
      },
    },
  ],
};
