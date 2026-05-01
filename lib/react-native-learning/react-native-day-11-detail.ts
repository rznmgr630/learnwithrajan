import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 11 — Lists: FlatList patterns + exercises (Account, Listings, etc.). */
export const REACT_NATIVE_DAY_11_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Lists** chapter: **FlatList**, extracted screen components, **separators**, **selection**, **swipes**, **delete**, **pull-to-refresh**—plus exercise titles **Account / Icon / ListItem / Listings**.",
                                                                                np: "सूची अभ्यास।",
      jp: "**FlatList** 一式と演習（Account / Listings 等）に相当。",
    },
  ],
  sections: [
    {
      title: { en: "Introduction", np: "परिचय", jp: "Introduction" },
      blocks: [
        { type: "diagram", id: "react-native-list-windowing" },
      ],
    },
    {
      title: { en: "FlatList", np: "FlatList", jp: "FlatList" },
      blocks: [
        {
          type: "code",
          title: {
            en: "Stable renderItem + keyExtractor",
                                                                            np: "स्थिर कुञ्जी",
            jp: "renderItem と keyExtractor",
          },
          code: `import { FlatList, ListRenderItem, Text, View } from 'react-native';

type Row = { id: string; title: string };

export function CatalogList({ data }: { data: Row[] }) {
  const renderItem: ListRenderItem<Row> = ({ item }) => (
    <View style={{ padding: 16 }}>
      <Text>{item.title}</Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      initialNumToRender={12}
      windowSize={7}
    />
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Extracting the Screen Component",
                                                                            np: "स्क्रिन अर्काइभ",
        jp: "Extracting the Screen Component",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`MessagesScreen`** pattern: **`Screen` scaffold** wraps **`FlatList` props** separately from **header/footer** composers—helps tests target pure list logic.",
                                                                              np: "परिशुद्ध परीक्षण।",
            jp: "画面ラッパとリスト本体を分けてテストしやすくする。",
          },
        },
      ],
    },
    {
      title: { en: "Separators", np: "Separator", jp: "Separators" },
      blocks: [
        {
          type: "code",
          title: {
            en: "`ItemSeparatorComponent` vs borderBottom",
                                                                              np: "सीमा",
            jp: "区切りの選び方",
          },
          code: `import { FlatList, StyleSheet, View } from 'react-native';

<FlatList
  ItemSeparatorComponent={() => (
    <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#eee' }} />
  )}
/>`,
        },
      ],
    },
    {
      title: {
        en: "Handling Selections",
                                                                              np: "चयन",
        jp: "Handling Selections",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Track **`selectedId` in parent** or reducer—**controlled highlight** avoids storing row components in state.",
                                                                              np: "id मात्र।",
            jp: "選択状態は ID のみ。**行コンポーネント自体を state に入れない**。",
          },
        },
      ],
    },
    {
      title: {
        en: "Handling Swipes",
                                                                              np: "स्वाइप",
        jp: "Handling Swipes",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Classic pattern: **`react-native-gesture-handler` + Reanimated** or **`Swipeable` from RNGH** tutorial flows—isolate gesture root per row for perf.",
                                                                              np: "पंक्तिमा धेरै भार।",
              jp: "行ごとにジェスチャー境界を。**RNGH/Reanimated** の講義パターン。",
          },
        },
      ],
    },
    {
      title: {
        en: "Deleting an Item",
                                                                              np: "मेटाइ",
        jp: "Deleting an Item",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Optimistic UI**: remove locally, enqueue API delete, reconcile on failure with snackbar undo.",
                                                                              np: "अनडु।",
            jp: "楽観的削除＋失敗時ロールバックまたは undo。",
          },
        },
      ],
    },
    {
      title: {
        en: "Implementing Pull to Refresh",
                                                                              np: "तान्न रिफ्रेस",
        jp: "Implementing Pull to Refresh",
      },
      blocks: [
        {
          type: "code",
          title: { en: "`refreshControl` bridge", np: "रिफ्रेस", jp: "RefreshControl" },
          code: `import { useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';

// inside component
const [refreshing, setRefreshing] = useState(false);
const onRefresh = async () => {
  setRefreshing(true);
  try {
    await refetchRemote();
  } finally {
    setRefreshing(false);
  }
};

// prop on FlatList
refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}`,
        },
      ],
    },
    {
      title: {
        en: "Exercises — Planning the Account Screen",
                                                                              np: "खाता",
        jp: "Exercises · Planning the Account Screen",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Wireframe-first**: grouped settings rows with chevrons, avatar slot, logout row—defer navigation wiring until Tabs land.",
                                                                              np: "पसल पछि।",
              jp: "グループ見出し・アバター・ログアウト行を先に紙またはコンポ。**ナビはタブ編で**。",
          },
        },
      ],
    },
    {
      title: {
        en: "Exercises — Icon, ListItem, Account & Listings",
                                                                              np: "जोडा",
        jp: "Exercises · Icon / ListItem / Account / Listings",
      },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Building the Icon Component** wraps vector icon sizing + tint props.",
                                                                              np: "आइकन।",
              jp: "**Icon コンポーネント**：サイズと色 props。",
            },
            {
              en: "**Extending the ListItem** adds leading icon, subtitle, trailing chevron/state.",
                                                                              np: "लिस्टआइटम।",
              jp: "**ListItem 拡張**：左アイコン・サブテキスト・chevron。",
            },
            {
              en: "**Building the Account Screen** + **Building the Listings Screen** stitches navigators upcoming in Part 2.",
                                                                              np: "नेभ धागा।",
              jp: "**Account / Listings** は Part 2 のナビで接続前提。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Avoid `ScrollView + map`?",
                                                np: "स्क्रल म्याप?",
        jp: "ScrollView で map は？",
      },
      answer: {
        en: "Large datasets **must virtualize**—`ScrollView` mounts every child.**`FlatList`/`FlashList`** for feed-like content.",
                                                                              np: "वर्चुअल।",
        jp: "件数が多いなら **`FlatList`（または FlashList）** 必須。",
      },
    },
  ],
};
