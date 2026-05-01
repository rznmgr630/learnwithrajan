import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 2 — What is React Native · Expo deep dive · bridge diagram. */
export const REACT_NATIVE_DAY_2_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Aligns with **What is React Native** + **Expo**: same mental model lectures use before diving into `create-expo-app`.",
      np: "RN र Expo।",
      jp: "**RN とは** と **Expo の役割** を整理します。",
    },
  ],
  sections: [
    {
      title: {
        en: "What is React Native",
        np: "React Native के हो",
        jp: "What is React Native",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**One React tree**, two binaries: JavaScript renders **Host Components** mapped to UIView/AndroidView hierarchies via the **Fabric / Legacy bridge** abstraction. Gestures hit native recognizers while JS updates props—keep work **async** off the JS thread spikes.",
            np: "रूख एक, नेटिव दुई छेउ।",
            jp: "React のツリーが **プラットフォーム固有のウィジェット** に割り当てられます。**JS スレッドを塞がない**こと。",
          },
        },
        { type: "diagram", id: "react-native-bridge-architecture" },
        {
          type: "code",
          title: { en: "Native-driven root", np: "रूट उदाहरण", jp: "ルートの例" },
          code: `import { View, Text, StatusBar } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <Text>Native root view owns safe areas next.</Text>
    </View>
  );
}`,
        },
      ],
    },
    {
      title: { en: "Expo", np: "Expo", jp: "Expo" },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Managed workflow**: `create-expo-app` + `expo install` aligns native SDK bumps with JS packages—you avoid hand-editing `Podfile` until you truly need **`expo prebuild`** / bare escape hatches.",
              np: "expo install ले संस्करण मेल खान्छ।",
              jp: "**expo install** でネイティブ依存のバージョンを揃えやすい。**prebuild/bare** は必要になったら。",
            },
            {
              en: "**Expo Router** vs classic **React Navigation**—courses often stick to Navigation docs first for mental clarity; Expo Router stacks file-based conventions on top.",
              np: "नेभ प्रथम फाइलआधारीत पछि।",
              jp: "講座ではまず **React Navigation** が多い。**Expo Router** はファイル規約レイヤです。",
            },
            {
              en: "**EAS** (later days) abstracts credentials + CI build profiles—the same codebase targets dev, preview, and production channels.",
              np: "EAS ले प्रोफाइल राख्छ।",
              jp: "後半の **EAS** でチャネルごとのビルドが整理されます。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Is Flutter “better”?",
        np: "Flutter राम्रो?",
        jp: "Flutter の方が？",
      },
      answer: {
        en: "Different trade-offs: RN **reuses web React skills**, huge ecosystem.**Pick per team familiarity** plus native module maturity for your peripherals.",
        np: "React ज्ञान पुन प्रयोग — टोली अनुसार।",
        jp: "**React が使える**のが強み。要件とチーム習熟で決めます。",
      },
    },
  ],
};
