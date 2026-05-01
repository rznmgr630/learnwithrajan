import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 8 — Layout: Dimensions, orientation, Flexbox toolkit + diagram. */
export const REACT_NATIVE_DAY_8_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Layout** lessons compressed: introduction, **Dimensions**, **orientation**, full **Flexbox** surface (direction, justify/align, wrap/alignContent, flexBasis/grow/shrink, absolute positioning). Includes **Exercise** checkpoints.",
                                          np: "Flex र स्थितिमान।",
      jp: "レイアウト章に相当：**寸法・向き変更・Flex 全套** と演習の指針。",
    },
  ],
  sections: [
    {
      title: { en: "Layout — introduction", np: "रूपरेखा", jp: "Layout（イントロ）" },
      blocks: [
        { type: "diagram", id: "react-native-flexbox-mobile" },
      ],
    },
    {
      title: { en: "Dimensions", np: "Dimensions", jp: "Dimensions" },
      blocks: [
        {
          type: "code",
          title: { en: "Prefer hooks for rotation", np: "आकार", jp: "useWindowDimensions" },
          code: `import { useWindowDimensions, View } from 'react-native';

export function AdaptiveColumns() {
  const { width } = useWindowDimensions();
  const columns = width >= 680 ? 2 : 1;
  return (
    <View style={{ flexDirection: columns === 2 ? 'row' : 'column', flex: 1 }}>
      {/* children */}
    </View>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Detecting Orientation Changes",
                                                np: "अभिमुख परिवर्तन",
        jp: "Detecting Orientation Changes",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`useWindowDimensions`** re-renders on rotation—combine with **`Dimensions.addEventListener`** only if profiling shows hook gaps.**Lock orientation** (`app.json`/native plist) when designs cannot adapt.",
                                                              np: "घुम्ने व्यवस्थापन।",
            jp: "**向きロック** と **ウィンドウ幅に追随するレイアウト**のどちらを取るかを設計で決める。",
          },
        },
      ],
    },
    {
      title: {
        en: "Flexbox — Direction",
                                                np: "Flex दिशा",
        jp: "Flexbox · Direction",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Default column** stacking—explicitly set **`flexDirection: 'row'`** for horizontally aligned chips.",
                                                                np: "पंक्तिमा।",
              jp: "既定は縦並び。**row** で横並びヘッダ等。",
          },
        },
      ],
    },
    {
      title: {
        en: "Flexbox — justifyContent, alignItems and alignSelf",
                                                np: "जस्ट एलाइन्स",
        jp: "Flexbox · justifyContent / alignItems / alignSelf",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**justifyContent** spaces along primary axis—**alignItems** cross-axis for all children.**alignSelf** overrides per child.",
                                                                  np: "एक छोर विशेष छुटकारा।",
              jp: "主軸は **justify**、交差軸全体は **alignItems**。**alignSelf** でだけ外す子もあり。",
          },
        },
      ],
    },
    {
      title: {
        en: "Flexbox — flexWrap and alignContent",
                                                  np: "wrap",
        jp: "Flexbox · flexWrap / alignContent",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`flexWrap: 'wrap'`** + **`alignContent: 'stretch' | 'flex-start'`** distributes wrapped rows—the classic tag-cloud layout tweak.",
                                                                      np: "बहु लाइन।",
              jp: "折り返し行の **`alignContent`** で段のまとまりが変わる。",
          },
        },
      ],
    },
    {
      title: {
        en: "Flexbox — flexBasis, flexGrow and flexShrink",
                                                  np: "flex संख्या",
        jp: "Flexbox · flexBasis · flexGrow · flexShrink",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Gallery thumb sizing sketch",
                                                                      np: "थम्ब फ्लेक्स",
            jp: "サムネの伸び縮み",
          },
          code: `const tile = {
  flexBasis: '48%',
  flexGrow: 1,
  flexShrink: 1,
};`,
        },
      ],
    },
    {
      title: {
        en: "Absolute and Relative Positioning",
                                                  np: "स्थान अपेक्षाकृत",
        jp: "Absolute and Relative Positioning",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`position: 'absolute'`** pins within nearest positioned **`relative`** ancestor—prefer flex when possible because absolute overlays complicate parity across platforms.",
            np: "जरुरी छेउमा मात्र absolute।",
            jp: "オーバーレイだけ absolute。基本は flex の方が安全。",
          },
        },
      ],
    },
    {
      title: { en: "Exercises", np: "अभ्यास", jp: "Exercises（演習）" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Recreate syllabus grid exercises: uneven columns, vertically centered badges, pinned corner affordances—all without wrestling WebView quirks.",
                                                                              np: "ग्रेड कार्ड।",
            jp: "講義のような **段差グリッド**、**縦センター** を StyleSheet と Flex だけで。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "`%` widths weird on Android?",
                                                np: "% अजीब?",
        jp: "% 幅が Android でおかしい",
      },
      answer: {
        en: "**Parent must have bounded width**. Use **`flex`** ratios or **`useWindowDimensions`** math when `%` behaves unexpectedly.",
                                                                              np: "बाउंडेड प्यारेन्ट चाहिए।",
        jp: "親に**確定した幅**。困ったら **`flex` 比率**か **幅計算**。",
      },
    },
  ],
};
