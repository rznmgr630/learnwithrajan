import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 9 — Welcome / View Image screens & refactoring mindset. */
export const REACT_NATIVE_DAY_9_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Project-style sections: **Building the Welcome Screen**, **Building the View Image Screen**, **Refactoring**, **A Quick Note**—matching course build-along arcs.",
                                                                              np: "स्क्रिन अभ्यास।",
      jp: "**ウェルカム画面・画像詳細・リファクタ** に相当する演習日。",
    },
  ],
  sections: [
    {
      title: {
        en: "Building the Welcome Screen",
                                                  np: "स्वागत स्क्रिन",
        jp: "Building the Welcome Screen",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Logo + CTAs scaffold",
                                                                      np: "CTA घटक।",
            jp: "ヒーローと CTA の骨組み",
          },
          code: `import { Image, StyleSheet, Text, View } from 'react-native';

export function WelcomeScreen({
  onLogin,
  onRegister,
}: {
  onLogin: () => void;
  onRegister: () => void;
}) {
  return (
    <View style={styles.shell}>
      <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.tagline}>Marketplace starter</Text>

      {/* swap TouchableOpacity wrappers for syllabus buttons */}
      <View style={{ marginTop: 32, gap: 12 }} />
      {/* ... */}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', backgroundColor: '#f9fafb' },
  logo: { width: '100%', height: 140 },
  tagline: { marginTop: 12, fontSize: 22, fontWeight: '700' },
});`,
        },
      ],
    },
    {
      title: {
        en: "Building the View Image Screen",
                                                  np: "फोटो स्क्रिन",
        jp: "Building the View Image Screen",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Stack syllabus pattern: **`Image`** hero, metadata row (**`Text`**), actions row (**`TouchableOpacity`**). Persist selected listing ID via **route params + typed navigation**.",
                                                                              np: "प्याराम।",
              jp: "ルートパラムで一覧→詳細。上部に大画像、下部に説明・アクションを Flex で。",
          },
        },
      ],
    },
    {
      title: { en: "Refactoring", np: "रीफ्याक्टर", jp: "Refactoring" },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Extract **`Screen` shell** wrappers for shared padding/status-bar spacing.**Move colors** into `theme.ts` literals—design tokens parity with web Sass variables.",
                                                                              np: "थिम र स्केल।",
              jp: "Screen 共通ラッパ、カラーは theme に集約。",
            },
            {
              en: "**Prop drilling vs context** stays tiny until Navigation module—defer global stores.",
                                                                              np: "कन्टेक्स्ट धीरै।",
              jp: "ナビ導入まではコンテキストを増やさない。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "A Quick Note", np: "संक्षिप्ट नोट", jp: "A Quick Note" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Keep **`SafeAreaProvider`** scaffolding ready—courses often postpone until Tabs + device notches collide with headers.",
                                                                              np: "सेफ क्षेत्र।",
              jp: "ノッチ環境では **Safe Area** が後から必須。余裕があれば先に用意。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Where do assets live?",
                                                np: "एसेट कहाँ?",
        jp: "画像の置き場所",
      },
      answer: {
        en: "Common pattern: **`/assets`** with **typed `require`**—Expo **`assetBundlePatterns`** guards missing files at build.",
                                                                              np: "assets फोल्डर।",
        jp: "`/assets`。ビルドで取り込みを検証。**expo-router** は `public/` との棲み分けに注意。",
      },
    },
  ],
};
