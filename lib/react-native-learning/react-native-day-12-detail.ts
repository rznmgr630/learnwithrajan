import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 12 — Input components: TextInput, Switch, Picker, Modal patterns. */
export const REACT_NATIVE_DAY_12_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Input Components**: **TextInput**, pretty styling, extracting defaults, **Switch**, **Picker** + custom picker, **Modal**, showing items, selections.",
                                                                                  np: "इन्पुटहरू।",
      jp: "入力系：**TextInput / Switch / Picker / Modal** と項目表示・選択。",
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
            en: "**Keyboard avoiding** + **hitSlop affordances** matter as much as the widget—you will compose hooks on Day 13 forms.",
                                                                              np: "किबोर्ड।",
            jp: "キーボード退避やタップ領域が実用の鍵。フォームとは Day 13 で接続。",
          },
        },
      ],
    },
    {
      title: { en: "TextInput", np: "TextInput", jp: "TextInput" },
      blocks: [
        {
          type: "code",
          title: {
            en: "Controlled field sketch",
                                                                              np: "नियन्त्रित",
            jp: "controlled 例",
          },
          code: `import { useState } from 'react';
import { TextInput, View } from 'react-native';

export function EmailField({
  label,
}: {
  label: string;
}) {
  const [value, setValue] = useState('');
  return (
    <View>
      {/* render label */}
      <TextInput
        value={value}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={setValue}
        placeholder={label}
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      />
    </View>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Building a Pretty TextInput",
                                                                              np: "सुन्दर इन्पुट",
        jp: "Building a Pretty TextInput",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Animated border color** tied to **`onFocus/onBlur`** + optional floating labels—courses often refactor into **`AppTextInput`** with icon slots.",
                                                                              np: "फोकस घटना।",
            jp: "**フォーカスで枠線色**。**AppTextInput** に抽出。",
          },
        },
      ],
    },
    {
      title: {
        en: "Extracting the Default Styles",
                                                                              np: "पूर्वनिर्धारित",
        jp: "Extracting the Default Styles",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "`defaultProps` successor = wrapper",
                                                                              np: "रापर",
            jp: "共通デフォルト",
          },
          code: `import { StyleSheet } from 'react-native';

// theme/inputs.ts
export const defaults = {
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderRadius: 10,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: '#d4d4d8',
};`,
        },
      ],
    },
    {
      title: {
        en: "Switch",
                                                                                  np: "Switch",
        jp: "Switch",
      },
      blocks: [
        {
          type: "code",
          title: { en: "Boolean toggles", np: "अनआफ", jp: "オンオフ" },
          code: `import { Switch, View } from 'react-native';

<Switch value={notifications} onValueChange={setNotifications} />`,
        },
      ],
    },
    {
      title: { en: "Picker", np: "Picker", jp: "Picker" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`@react-native-picker/picker`** exposes native spinners—platform chrome differs massively; always snapshot both OSes.",
                                                                              np: "दुई खिच्ड।",
              jp: "**@react-native-picker/picker**。OS で見え方が大きく違うので両方で確認。",
          },
        },
      ],
    },
    {
      title: {
        en: "Building a Custom Picker",
                                                                              np: "अनुकूलित",
        jp: "Building a Custom Picker",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Modal + ScrollView/FlatList** simulates searchable pickers—a good bridge before **RN Paper Menu** integrations.",
                                                                              np: "मोडल सूची।",
              jp: "検索つき選択は **Modal + リスト** で自作しやすい。",
          },
        },
      ],
    },
    {
      title: { en: "Modal", np: "Modal", jp: "Modal" },
      blocks: [
        {
          type: "code",
          title: { en: "`transparent` overlays", np: "आवरण", jp: "透明オーバーレイ" },
          code: `import { Modal, Pressable, Text, View } from 'react-native';

<Modal transparent animationType="slide" visible={open} onRequestClose={close}>
  <Pressable style={{ flex: 1, backgroundColor: '#00000055' }} onPress={close} />
  <View style={{ backgroundColor: '#fff', padding: 16 }}>
    <Text>Select an option…</Text>
  </View>
</Modal>`,
        },
      ],
    },
    {
      title: {
        en: "Showing Picker Items",
                                                                                 np: "वस्तुहरू",
        jp: "Showing Picker Items",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`map` deterministic keys** (`value` slug) avoids RN reconciliation warnings.",
                                                                              np: "कुञ्जी स्थिर।",
            jp: "項目は **安定した key** で map。",
          },
        },
      ],
    },
    {
      title: {
        en: "Handling Selections",
                                                                                 np: "छान्ने",
        jp: "Handling Selections",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Lift selection to **screen-level state**, pass **`onSelectOption`** downwards—later Formik adapters reuse the same callbacks.",
                                                                              np: "माथिल्लो स्थितिमा।",
            jp: "**画面 state** に載せ、`onSelect` を下ろす。**Formik と後で統合**。",
          },
        },
      ],
    },
    {
      title: { en: "A Quick Note", np: "संक्षिप्ट", jp: "A Quick Note" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Placeholder colors** clash on dark backgrounds—courses revisit **Listing Edit Screen** tweaks after theme decisions.",
                                                                              np: "प्लेसहोल्डर रङ।",
              jp: "プレースホルダー色はダークでも読めるように後で再調整。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Autocomplete password managers?",
                                                  np: "पास?",
        jp: "パスワードオートフィルは？",
      },
      answer: {
        en: "Set **`textContentType`** / **`passwordRules`** (`iOS`) and **`importantForAutofill`** (`Android`).",
                                                                                  np: "मञ्च गुण।",
        jp: "プラットフォームの **textContentType** などをセット。",
      },
    },
  ],
};
