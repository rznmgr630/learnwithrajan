import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 6 — Fundamental Concepts: View, Text, Image + deeper API notes + nearby primitives. */
export const REACT_NATIVE_DAY_6_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Core components** are host-backed: **`View`**, **`Text`**, **`Image`**. Each section below includes a **prop reference table** (most-used API surface) plus patterns—verify edge props on **reactnative.dev** when your SDK bumps.",
                                    np: "View, Text, Image — प्रप तालिका सहित।",
      jp: "**View / Text / Image** ごとに **主要 props の早見表** と実装例を並べています。SDK 更新時は **reactnative.dev** で最終確認を。",
    },
  ],
  sections: [
    {
      title: {
        en: "Core Components and APIs — overview",
                                    np: "कोर उपकरण",
        jp: "Core Components と API（概要）",
      },
      blocks: [
        { type: "diagram", id: "react-native-component-tree" },
        {
          type: "paragraph",
          text: {
            en: "Every screen composes **`View`** (flex/Yoga layout) and **`Text`** nodes. **`Image`** is a leaf that needs **explicit dimensions or flex** — unlike the DOM, there is **no intrinsic size** from “auto width” for remote JPEGs until the native decoder finishes.",
                                          np: "दूर टेक्स्ट आकार स्थिर चाहिए।",
            jp: "レイアウトは **flex（Yoga）**。**ネット画像はサイズ明示**がほぼ必須。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Rough web mental map (RN is still not the DOM)",
            np: "Web सँग तुलना",
            jp: "Web との粗略な対応",
          },
          headers: [
            { en: "Web habit", np: "वेब रीत", jp: "Web での癖" },
            { en: "React Native analogue", np: "RN मिल्दो", jp: "RN での側面" },
          ],
          rows: [
            [
              { en: "`<div>` wrapper", np: "`div`", jp: "`div` コンテナ" },
              { en: "**`View`** — hosts layout, **must not contain bare text**", np: "View ले टेक्स्ट बिन छोराइ", jp: "**View** は生文字列禁止（**Text** で包む）" },
            ],
            [
              { en: "`<span>` inline text run", np: "`span`", jp: "`span` 文言" },
              { en: "**`Text`** — nested **`Text`** inherits parent style", np: "भित्र Text", jp: "**Text** はネストで部分的に太字・色変更" },
            ],
            [
              { en: "`<img src>`", np: "`img`", jp: "`img`" },
              { en: "**`Image`** **`source`** + **`resizeMode`** + explicit **`style` size/flex**", np: "`source`/`resizeMode`", jp: "**`Image`**：`source`、`resizeMode`、サイズ" },
            ],
          ],
        },
      ],
    },
    {
      title: { en: "View", np: "View", jp: "View" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`View`** maps to **`UIView` / `android.view.View`**. Children order + flex props determine placement.**Only `Text` can render glyphs** directly—putting a string beside `<View>...</View>` is invalid JSX in RN.",
                                          np: "स्ट्रिङ टेक्स्टमा मात्र।",
            jp: "文字は必ず **`Text` ツリー配下**。`View` は配置とタッチ伝播のための箱。",
          },
        },
        {
          type: "table",
          caption: {
            en: "**`View`** — props you will actually reach for (not every edge prop)",
            np: "View प्रप सारांश",
            jp: "View の主な props",
          },
          headers: [
            { en: "Prop", np: "प्रप", jp: "Prop" },
            { en: "Role", np: "भूमिका", jp: "役割" },
          ],
          rows: [
            [
              { en: "**`style`**", np: "`style`", jp: "**`style`**" },
              {
                en: "**`ViewStyle`**: flex (`flex`, `flexDirection`, `flexGrow`/`Shrink`/`Basis`), box model (`width`/`height`, `%`, `margin`/`padding`), alignment (`justifyContent`, `alignItems`, `alignSelf`), positioning (`position`, `top`/`left`/`right`/`bottom`), border/background/`opacity`/`overflow`/`zIndex`/`gap`. Layout deep-dive → Day 8.",
                                                                          np: "फ्लेक्स दिन ८।",
                jp: "寸法・flex・位置・境界・背景など。**詳細は Day 8**。",
              },
            ],
            [
              { en: "**`accessible`**, **`accessibilityLabel`**, **`accessibilityHint`**, **`accessibilityRole`**, **`accessibilityState`**, **`accessibilityValue`**", np: "a11y", jp: "a11y" },
              {
                en: "Screen-reader narration: label/hint describe UI; **`role`** (`'none'|'button'|'header'`…); **`state`** (`disabled`, `selected`, `busy`…); **`value`** steps for sliders-like semantics.",
                                                                          np: "भ्वाइसअभिमुख।",
                jp: "読み上げ用。**`accessibilityActions`** + **`onAccessibilityAction`** でカスタム操作も追加可。",
              },
            ],
            [
              {
                en: "**`accessibilityActions`**, **`onAccessibilityAction`**, **`accessibilityLiveRegion`**",
                                                                              np: "क्रिया",
                jp: "追加アクション／無視フラグなど",
              },
              {
                en: "**Custom rotor / menu actions** (e.g. “Delete”).**`liveRegion`** for polite/async announcements (`'none'|'polite'|'assertive'`).",
                                                                          np: "लाइभ।",
                jp: "動的更新の読み上げタイミングに **`liveRegion`**。",
              },
            ],
            [
              {
                en: "**`accessibilityElementsHidden`**, **`importantForAccessibility`**, **`accessibilityViewIsModal`**",
                                                                              np: "iOS/एन्ड्रोइड",
                jp: "子の無視・モーダル相当",
              },
              {
                en: "Hide subtree from assistive tech or mark container as modal overlay (platform naming differs—read native docs per OS).",
                                                                          np: "प्लेटफर्म पढ्नुहोस्।",
                jp: "OS ごとに意味が微妙に違うので **該当 OS のドキュメント**を見る。",
              },
            ],
            [
              { en: "**`accessibilityIgnoresInvertColors`** (iOS)", np: "इनभर्ट", jp: "スマートインバート" },
              {
                en: "Keep brand colors/logos legible when **Smart Invert** is on.",
                                                                          np: "लोगो।",
                jp: "画像・アイコンに隣接する **`Image`** とセットで検討。",
              },
            ],
            [
              { en: "**`hitSlop`**, **`pressRetentionOffset`**", np: "हिट्सलप?", jp: "`View` に？" },
              {
                en: "**Not on bare `View`—they belong to `Pressable`, `Touchable*`, buttons.** Listed here because tutorials stack hit areas on wrappers.",
                                                                          np: "थिच वर्गमा ।",
                jp: "タッチ拡張は **`Pressable` / Touchable**。",
              },
            ],
            [
              { en: "**`nativeID`**, **`id`**", np: "पहिचान", jp: "DOM/ネイティブ id" },
              {
                en: "**`nativeID`**: stable string for native test drivers / automation.**`id`**: mainly web target—ignore on mobile unless using RN Web.",
                                                                          np: "परीक्षण यन्त्र।",
                jp: "**E2E** で要素を掴むなら **`nativeID` / `testID`** を使い分け。",
              },
            ],
            [
              { en: "**`onLayout`**", np: "माप", jp: "`onLayout`" },
              {
                en: "Fires with **`{nativeEvent:{layout:{x,y,width,height}}}`** after mount/layout pass—gateway to **`measure`**-style workflows without refs when acceptable.",
                                                                          np: "चौडाइ गणना।",
                jp: "動的幅・高さの計算・アニメ開始位置の取得に常用。",
              },
            ],
            [
              {
                en: "**`pointerEvents`**: **`'auto'|'box-none'|'box-only'|'none'`**",
                                                                              np: "टच पासथ्रु।",
                jp: "`pointerEvents`",
              },
              {
                en: "**`'box-none'`** — parent ignores hits, children capture.**`'box-only'`** — inverse.**`'none'`** — blocks subtree.**Default `'auto'`.",
                                                                          np: "ओभरले।",
                jp: "オーバーレイ組み時に **`box-none`** が定番パターン。",
              },
            ],
            [
              { en: "**`collapsable`** (Android, default **true**)", np: "कोल्याप्स", jp: "collapsable" },
              {
                en: "Optimizer may remove “no-op” views—set **`false`** when debugging layout or when removal breaks backgrounds/borders.",
                                                                          np: "डिबग।",
                jp: "レイアウトが消える・背景が消えるとき **`false`**。",
              },
            ],
            [
              { en: "**`removeClippedSubviews`**", np: "क्लिप", jp: "クリップ除去" },
              {
                en: "**Android list perf aid**—can cause visual glitches if children expect to paint outside bounds; test scrollers carefully.",
                                                                          np: "स्क्रोलर।",
                jp: "**`ScrollView`/`FlatList` 内**でチラつくときは切る・`false` を試す。",
              },
            ],
            [
              {
                en: "**`needsOffscreenAlphaCompositing`**, **`shouldRasterizeIOS`**, **`renderToHardwareTextureAndroid`**",
                                                                              np: "लेयर",
                jp: "合成・ラスタライズ",
              },
              {
                en: "Advanced transparency / shadow artifacts—enable only when profiling shows benefit (can hurt memory).",
                                                                          np: "प्रोफाइल।",
                jp: "影・半透明の不具合の最終手段扱い。**メモリ悪化**に注意。",
              },
            ],
            [
              {
                en: "**Responder system**: **`onStartShouldSetResponder`**, **`onMoveShouldSetResponder`**, captures, bubbles (many props)",
                                                                              np: "जेस्चर",
                jp: "レスポンダ",
              },
              {
                en: "Low-level touch negotiation before **`Pressable`/`PanResponder`**—prefer higher-level APIs unless building custom gestures.",
                                                                          np: "PanResponder।",
                jp: "カスタムジェスチャは **`react-native-gesture-handler`** へ（後の章）。",
              },
            ],
            [
              { en: "**`focusable`**, **`tabIndex`** (Android TV / web parity)", np: "फोकस", jp: "フォーカス" },
              {
                en: "Focus order for remotes/keyboard—ignore until building TV/web hybrid builds.",
                                                                          np: "टिभी।",
                jp: "TV / RN Web 対応時に登場。",
              },
            ],
            [
              { en: "**`testID`**", np: "टेस्ट", jp: "testID" },
              {
                en: "**RNTL selectors / Detox`-ish` lookups**—deterministic stable strings per screen variant.",
                                                                          np: "स्थिर लेबुल।",
                jp: "**テスト**用。本番ログに出ないようビルド切替も検討。",
              },
            ],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "**Highlights**: root screens almost always start with **`flex:1` `View`**. Overlay stacks **`pointerEvents='box-none'`**. Android-only gremlins **`collapsable`**/**`removeClippedSubviews`**.",
                                                                          np: "मुख्य छाप।",
              jp: "まず **`flex:1`** と **`pointerEvents`** を体に覚えさせる。**Android だけの挙動**は実機確認。",
          },
        },
        {
          type: "code",
          title: {
            en: "Card shell + flex column growth",
                                                                      np: "कार्ड घोल।",
            jp: "カードと縦フレックス",
          },
          code: `import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

export function CardShell({ children }: { children: ReactNode }) {
  return <View style={styles.shell}>{children}</View>;
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    padding: 16,
    // Use gap (supported on modern RN/Expo) or marginBottom between children as fallback
    gap: 12,
    flexGrow: 0,
    flexShrink: 1,
  },
});`,
        },
        {
          type: "code",
          title: {
            en: "Overlay row: sibling stays touchable underneath",
                                                                              np: "पदार्थ टच।",
            jp: "`pointerEvents: 'box-none'` の例",
          },
          code: `import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function HeroWithBadge({
  title,
  onPressBadge,
}: {
  title: string;
  onPressBadge: () => void;
}) {
  return (
    <View style={{ height: 120, justifyContent: 'center' }}>
      <TouchableOpacity accessibilityRole="button" onPress={() => alert('backdrop')}>
        <Text>{title}</Text>
      </TouchableOpacity>

      <View style={{ ...StyleSheet.absoluteFillObject }} pointerEvents="box-none">
        <TouchableOpacity
          accessibilityLabel="Dismiss"
          hitSlop={12}
          style={{ alignSelf: 'flex-end', margin: 8 }}
          onPress={onPressBadge}>
          <Text>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}`,
        },
      ],
    },
    {
      title: { en: "Text", np: "Text", jp: "Text" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`Text`** participates in typography and gestures— **`onPress`** turns a substring into inline press targets without nesting a `TouchableOpacity`. Parent `Text` merges styles into nested runs unless overridden.",
                                                                              np: "थिच टेक्स्ट मा संभव।",
            jp: "ネスト **`Text`** は親の `fontSize` 等を引き継ぎ。**`onPress`** でインラインタップも可。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`numberOfLines`** plus **`ellipsizeMode`** (`'head' | 'middle' | 'tail' | 'clip'`) truncates subtitles—`'tail'` is the usual mental model. Pair with **`lineHeight`** for predictable wrap rhythm.",
                                                                              np: "... अन्त ट्रन्केट।",
              jp: "**`numberOfLines` と `lineHeight`** で一覧の二行説明などを統一。",
            },
            {
              en: "**`selectable`** — long-press highlight/copy on platforms that support it (disclaimers, help blocks).",
                                                                              np: "प्रतिलिपि UX।",
              jp: "利用規約ブロックなどに **`selectable`**。",
            },
            {
              en: "**`allowFontScaling`** (defaults to **`true`**) respects **Dynamic Type / accessibility**. Avoid globally disabling scaling; prefer layouts that grow.",
                                                                              np: "महत्त्वपूर्ण स्केल।",
              jp: "**システムの文字サイズ**に追随（極端に詰める UI は見直す）。",
            },
            {
              en: "**`maxFontSizeMultiplier`** — caps how huge text grows under extreme accessibility font sizes.",
                                                                              np: "ऊपरी सीमा।",
              jp: "見出しだけ最大倍率を抑えたいときの **`maxFontSizeMultiplier`**。",
            },
            {
              en: "**`adjustsFontSizeToFit`** + **`minimumFontScale`** (common on iOS) shrinks headings to fit badges—verify Android parity.",
                                                                              np: "ब्याज डिभाइस।",
              jp: "**バッジ内の自動縮小**はプラットフォーム差を確認。",
            },
          ],
        },
        {
          type: "table",
          caption: {
            en: "**`Text`** — props (typography lives in **`style` → `TextStyle`**, not scattered props)",
            np: "Text प्रप सारांश",
            jp: "Text の主な props",
          },
          headers: [
            { en: "Prop", np: "प्रप", jp: "Prop" },
            { en: "Role", np: "भूमिका", jp: "役割" },
          ],
          rows: [
            [
              { en: "**`children`** / nested **`Text`**", np: "बच्चा", jp: "`children`" },
              {
                en: "**String / element tree**. Nested **`Text`** inherits **`fontSize`, `fontWeight`, `fontFamily`, `color`, `textDecorationLine`, `letterSpacing`, `fontVariant`, `writingDirection`** until overridden.",
                                                                          np: "विरासत टेक्स्ट।",
                jp: "ネストごとに **太字・色・下線・字間** などを変えられる。",
              },
            ],
            [
              { en: "**`style`**", np: "`style`", jp: "**`style`**" },
              {
                en: "**`TextStyle`**: `fontSize`, `fontWeight`, `fontStyle`, `fontFamily`, `lineHeight`, `letterSpacing`, `textAlign`, `textAlignVertical` (Android), `textDecorationLine`/`Style`/`Color`, `textTransform`, `color`, `backgroundColor`, `padding`/`margin`, `width`/`maxWidth`, `flex`, `includeFontPadding` (Android), `userSelect` (web), etc.",
                                                                          np: "थप शैली दिन १०।",
                jp: "タイポは **`TextStyle`** に集約。詳細は **Day 10 Styling** でも。",
              },
            ],
            [
              { en: "**`numberOfLines`**", np: "लाइन सीमा", jp: "行数" },
              {
                en: "Positive int **caps lines**; combine with **`ellipsizeMode`** for tail/head/middle clipping vs full **`clip`** without ellipsis.",
                                                                          np: "अटु चयन।",
                jp: "一覧のタイトル・サブタイトルで必須級。",
              },
            ],
            [
              { en: "**`ellipsizeMode`**", np: "छिनौटि", jp: "省略位置" },
              {
                en: "**`'head' | 'middle' | 'tail' | 'clip'`** — where ellipsis appears; **`clip`** hard-cuts glyphs without `…`.",
                                                                          np: "टेल सामान्य।",
                jp: "日本語・英語混在でも **`tail`** が無難なことが多い。",
              },
            ],
            [
              { en: "**`allowFontScaling`**", np: "डाइन टाइप ", jp: "Dynamic Type" },
              {
                en: "**`true` default** respects OS accessibility font sliders—prefer responsive layout over global disable.",
                                                                          np: "पहुँच।",
                jp: "`false` にするのは最終手段。**レイアウトで吸収**。",
              },
            ],
            [
              { en: "**`maxFontSizeMultiplier`**", np: "उच्चत्तम गुना", jp: "最大倍率" },
              {
                en: "**Upper bound multiplier** versus default body size—e.g. `1.2` caps captions while body scales freely elsewhere.",
                                                                          np: "क्याप्सन ।",
                jp: "キャプションだけ伸びすぎないように **`1.5`** のようにキャップする。",
              },
            ],
            [
              {
                en: "**`adjustsFontSizeToFit`**, **`minimumFontScale`** (iOS‑friendly; still test Android)",
                                                                              np: "अटफिट ",
                jp: "自動縮小",
              },
              {
                en: "**`adjustsFontSizeToFit`** shrinks text inside box; **`minimumFontScale`** floor (fraction of original). **Verify Android** rendering when designers demand pixel-perfect chips.",
                                                                          np: "अन्ड्रोइड जाँच।",
                jp: "チップやバナー。**Android での見え方は必ず実機**。",
              },
            ],
            [
              { en: "**`selectable`**", np: "छान्न प्रतिलिपि", jp: "選択・コピー" },
              {
                en: "**Long-press select / copy UX** On where supported—not a replacement for **Share** sheets for secrets.",
                                                                          np: "गोप्य सावधान।",
                jp: "規約・長文説明向き。",
              },
            ],
            [
              { en: "**`selectionColor`**", np: "हाइलाइट रङ", jp: "選択色" },
              {
                en: "Highlight color for selected text when **`selectable`** active.",
                                                                          np: "ब्रान्ड रङ।",
                jp: "ブランドに合わせた **`selectionColor`**。",
              },
            ],
            [
              { en: "**`onPress`**, **`onLongPress`**", np: "थिच", jp: "タップ" },
              {
                en: "**Inline pressables** without wrapping **`TouchableOpacity`**—also **`delayLongPress`**, **`pressRetentionOffset`** for gesture tuning.",
                                                                          np: "टचवल।",
                jp: "段落中のリンク・「もっと見る」に。**`Pressable` の代替ではない**（大きいターゲットは Pressable）。",
              },
            ],
            [
              { en: "**`suppressHighlighting`** (iOS)", np: "हाइलाइट बन्द", jp: "ハイライト抑制" },
              {
                en: "Disables default grey highlight on press—use when custom feedback already exists.",
                                                                          np: "कस्टम प्रतिक्रिया।",
                jp: "独自の押下演出があるとき重複を避ける。",
              },
            ],
            [
              { en: "**`onTextLayout`**", np: "लाइन मेट्रिक", jp: "行レイアウト" },
              {
                en: "Callback with **line frames**—use for “read more” overflow detection (`lines.length`).",
                                                                          np: "...थप फैलाइ।",
                jp: "「全文表示」トリガーを計測。**パフォーマンス**は過剰計測に注意。",
              },
            ],
            [
              {
                en: "**`lineBreakStrategy`** (iOS), **`textBreakStrategy`**/**`hyphenationFrequency`** (Android), **`dataDetectorType`** (Android)",
                                                                              np: "लाइन तोडाइ",
                jp: "改行戦略など",
              },
              {
                en: "**Locale-aware breaking / link auto-detect**. Mostly polish—ship defaults unless typography bugs appear on device.",
                                                                          np: "पोलिश।",
                jp: "**日本語折り返し問題**がある端末だけ触るイメージ。",
              },
            ],
            [
              {
                en: "**`accessible`**, **`accessibility*` family**, **`disabled`**, **`id`**, **`nativeID`**, **`testID`**",
                                                                              np: "साझेदारी विवरण",
                jp: "共通系",
              },
              {
                en: "Same accessibility affordances as **`View`**.**`disabled`** greys interaction for nested pressables on some platforms.",
                                                                          np: "बन्द।",
                jp: "**`View` と同じ a11y プロパティ**が使える。",
              },
            ],
            [
              { en: "**`onLayout`**", np: "माप", jp: "`onLayout`" },
              {
                en: "Like **`View`**, gives bounding box after layout—rare for `Text` but useful for measuring rich blocks.",
                                                                          np: "दुर्लभ।",
                jp: "リッチテキストの高さ測定にたまに使う。",
              },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Nested emphasis + truncation",
                                                                              np: "नेस्ट टेक्स्ट",
            jp: "ネスト・省略",
          },
          code: `import { Text } from 'react-native';

export function PriceSnippet({ headline, cents }: { headline: string; cents: number }) {
  return (
    <Text style={{ fontSize: 18, fontWeight: '600' }}>
      {headline}{' '}
      <Text style={{ fontWeight: '400', color: '#0a7' }}>\${cents}</Text>
    </Text>
  );
}

<Text numberOfLines={2} ellipsizeMode="tail" style={{ lineHeight: 20 }}>
  {longDescriptionFromApi}
</Text>`,
        },
        {
          type: "code",
          title: {
            en: "Inline actionable link styling",
                                                                              np: "थिच पङ्क्ति।",
            jp: "インラインの tap",
          },
          code: `import { Linking, Text } from 'react-native';

<Text style={{ fontSize: 15, color: '#334155' }}>
  Read{' '}
  <Text accessibilityRole="link" style={{ color: '#2563eb' }} onPress={() => Linking.openURL('https://expo.dev')}>
    Expo docs
  </Text>{' '}
  before shipping permissions.
</Text>`,
        },
      ],
    },
    {
      title: { en: "Image", np: "Image", jp: "Image" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**`source` shapes**: `{ uri: string }` for remote assets, **`require('../x.png')`** for bundled static files. Provide **`width` + `height` in `style`** (or **`aspectRatio`** with one explicit axis), or remote images can flash **zero-height** placeholders until decode completes.",
                                                                              np: "अज्ञात आकार।",
              jp: "ネット画像はサイズ未定だとレイアウトがジャンプしがち。**`aspectRatio`** や固定の高さで抑える。",
          },
        },
        {
          type: "table",
          caption: {
            en: "**`resizeMode`** cheat sheet — think “how bitmap fills its box”",
                                                                              np: "resizeMode टेबुल",
            jp: "`resizeMode` の意味",
          },
          headers: [
            { en: "Value", np: "मान", jp: "値" },
            { en: "Behavior sketch", np: "संक्षेप व्यवहार", jp: "ざっくり動き" },
          ],
          rows: [
            [
              { en: "`cover` (default-ish for photos)", np: "`cover`", jp: "`cover`" },
              {
                en: "Scale uniformly, **clips overflow** — hero banners, thumbnails that should stay filled.",
                                                                              np: "पुरिइ क्लिप।",
                jp: "**はみ出しをトリミング**して枠いっぱい（ヒーロー画像向き）",
              },
            ],
            [
              { en: "`contain`", np: "`contain`", jp: "`contain`" },
              {
                en: "Entire image visible, **letterboxes** unused space.",
                                                                              np: "पुरा छवि फोइ।",
                jp: "画像全体を見せる。**余白が出る**ことがある（ロゴ・アイコン向き）",
              },
            ],
            [
              { en: "`stretch`", np: "`stretch`", jp: "`stretch`" },
              {
                en: "Distorts aspect ratio — mostly useful for patterned fills, rarely product photos.",
                                                                              np: "बिग्राइस।",
                jp: "**縦横比が崩れる** — 写真には基本使わない",
              },
            ],
            [
              { en: "`repeat` (platform-specific availability)", np: "`repeat`", jp: "`repeat`" },
              {
                en: "Tiles image like CSS `background-repeat` when supported.",
                                                                              np: "टाइल।",
                jp: "タイル状（対応プラットフォームのみ）",
              },
            ],
            [
              { en: "`center`", np: "`center`", jp: "`center`" },
              {
                en: "Centers bitmap without resizing — pair with **`overflow: hidden`** slices when needed.",
                                                                              np: "मध्य स्थिर।",
                jp: "拡大縮小しないで中央配置",
              },
            ],
          ],
        },
        {
          type: "table",
          caption: {
            en: "**`Image`** — props + static helpers (SDK may add fields—check your version)",
            np: "Image प्रप सारांश",
            jp: "Image の主な props",
          },
          headers: [
            { en: "Prop / API", np: "प्रप", jp: "Prop / API" },
            { en: "Role", np: "भूमिका", jp: "役割" },
          ],
          rows: [
            [
              { en: "**`source`**", np: "`source`", jp: "**`source`**" },
              {
                en: "**`ImageSource`**: `{ uri, headers?, cache?, width?, height? }` vs **`require(id)`**. Optional **`width`/`height` in source** hints decode on some pipelines—still set **`style` bounds**.",
                                                                          np: "दुई स्वरूप ।",
                jp: "リモートは **`{ uri }`**、静的は **`require`**。**`headers`** で認証付き CDN など。",
              },
            ],
            [
              { en: "**`style`**", np: "`style`", jp: "**`style`**" },
              {
                en: "**`ImageStyle`** — **`width`, `height`, `aspectRatio`, `flex*`**, **`borderRadius`/`borderWidth`, `opacity`, `tintColor`** (overlap with prop), **`resizeMode`** can also ride in style historically—prefer **`resizeMode` prop** for clarity.",
                                                                          np: "आकार सर्वप्रथम।",
                jp: "枠サイズ **`style` が主役**。未定義だとレイアウトジャンプしやすい。",
              },
            ],
            [
              { en: "**`resizeMode`**", np: "`resizeMode`", jp: "**`resizeMode`**" },
              {
                en: "See **`resizeMode`** table above: **`cover` · `contain` · `stretch` · `repeat` · `center`**. Default behavior varies slightly by platform baseline—explicitly pick one.",
                                                                          np: "स्पष्ट।",
                jp: "写真ヒーローは多く **`cover`**、ロゴは **`contain`**。",
              },
            ],
            [
              { en: "**`resizeMethod`** (Android)", np: "`resizeMethod`", jp: "**`resizeMethod`** (Android)" },
              {
                en: "**`'auto' | 'resize' | 'scale'`** — Android decode/scaling strategy for huge bitmaps; tune when you hit **OOM** or jank on big camera JPEGs.",
                                                                          np: "मेमोरी।",
                jp: "巨大画像で **メモリ・カクつき**があるときに試す。",
              },
            ],
            [
              { en: "**`defaultSource`**", np: "`defaultSource`", jp: "**`defaultSource`**" },
              {
                en: "**Bundled `require` thumbnail** while **`uri`** fetch/decodes—pairs with **`fadeDuration`**. Reduces white flashes.",
                                                                          np: "थम्ब।",
                jp: "リストのプレースホルダに有効。",
              },
            ],
            [
              { en: "**`fadeDuration`** (Android, ms)", np: "`fadeDuration`", jp: "**`fadeDuration`**" },
              {
                en: "Cross-fade when bitmap ready—`0` snaps instantly (helpful for chat bubbles).",
                                                                          np: "स्मूथ।",
                jp: "ちらつき対策とトレードオフ。",
              },
            ],
            [
              { en: "**`loadingIndicatorSource`** (Android)", np: "लोडर", jp: "インジケータ画像" },
              {
                en: "Built-in spinner asset while loading—optional when you do not render your own **`ActivityIndicator`** overlay.",
                                                                          np: "वैकल्पिक।",
                jp: "自前スピナーと二重にならないようどちらかに寄せる。",
              },
            ],
            [
              { en: "**`progressiveRenderingEnabled`** (Android)", np: "प्रगतिशील", jp: "プログレッシブ" },
              {
                en: "**JPEG incremental paint** toggle—experiment on slow radios for perceived speed vs visual pop-in.",
                                                                          np: "पर्सेन्ड धारणा ।",
                jp: "体感速度とのトレードオフ。",
              },
            ],
            [
              { en: "**`blurRadius`**", np: "`blurRadius`", jp: "**`blurRadius`**" },
              {
                en: "**CPU blur radius** applied at decode—not a substitute for redesigned assets if budget matters.",
                                                                          np: "CPU।",
                jp: "サムネぼかし。**大きな値は重い**。",
              },
            ],
            [
              { en: "**`tintColor`** prop / style", np: "`tintColor`", jp: "**`tintColor`**" },
              {
                en: "**Template / single-mask artwork** tinting.**Vector (`react-native-svg`)** may be preferable for scalable icons.",
                                                                          np: "आइकन।",
                jp: "**単色アイコンPNG** と相性よし。複雑な写真には向かない。",
              },
            ],
            [
              { en: "**`capInsets`** (iOS Nine-patch style `{top,right,bottom,left}`)", np: "क्यापइन्सेट", jp: "**`capInsets`**" },
              {
                en: "**Stretch only center slice**—great for bordered chat bubbles/button skins without distortion.",
                                                                          np: "बटन छाल।",
                jp: "**可変幅の吹き出し背景**など iOS で常用。Androidは **`9-patch`**/`draw9patch` と役割分担。",
              },
            ],
            [
              {
                en: "**`onLoad`**, **`onLoadStart`**, **`onLoadEnd`**, **`onError`**, **`onPartialLoad`** (iOS gradual JPEG)",
                                                                              np: "जीवन्तचक्र",
                jp: "ライフサイクル",
              },
              {
                en: "**`onLoad`** exposes **`nativeEvent`** (often **`width`/`height`/`uri`**) for layout/analytics.**`onError`** surfaces platform failures—avoid noisy logs.",
                                                                          np: "लग माप कम।",
                jp: "**`onLoad`** で実寸を確認。**`ActivityIndicator`** と状態を同期。",
              },
            ],
            [
              {
                en: "**`accessible`**, **`accessibilityLabel`**, **`accessibilityHint`**, **`accessibilityIgnoresInvertColors`**, **`accessibilityState`**, **`testID`**",
                                                                              np: "a11y",
                jp: "a11y / testID",
              },
              {
                en: "**Screen reader copy** separate from captions—paired with **`Image`** inside buttons use **`accessible={false}`** on decorative art to avoid duplication.",
                                                                          np: "सजावट छुटाइ।",
                jp: "隣に **`Text` がある**とき二重読みに注意して **`accessible`** を調整。",
              },
            ],
            [
              { en: "**`crossOrigin`** (RN Web)", np: "CORb", jp: "`crossOrigin`" },
              {
                en: "Canvas/CORS interplay when bridging to DOM—mobile native builds ignore.",
                                                                          np: "वेब।",
                jp: "**RN Web / 同一オリジン**の話。**モバイル不要**。",
              },
            ],
            [
              { en: "**`forwardedRef`** / **`ref` (host ref)**", np: "`ref`", jp: "**`ref`**" },
              {
                en: "Imperative focus/measure wrappers—prefer declarative **`style`** unless bridging native modules demands ref.",
                                                                          np: "दुर्लभ।",
                jp: "**通常いらない**。ブラウザ的な DOM 触りとは別世界。",
              },
            ],
            [
              {
                en: "**Static `Image.prefetch(url)`**, **`Image.getSize(uri,success,fail)`**, **`Image.resolveAssetSource(source)`**",
                                                                              np: "स्थिर विधिहरू ",
                jp: "静的メソッド",
              },
              {
                en: "**Prefetch** primes network cache.**`getSize`** sizes before render.**`resolveAssetSource`** maps **`require`** to **`{uri,width,height,scale}`** for bridging logic/tests.",
                                                                          np: "पिक्सेल माप ",
                jp: "**`prefetch`** は一覧前に。**`resolveAssetSource`** はメタ取得。",
              },
            ],
            [
              {
                en: "**`Image.queryCache`**, **`abortPrefetch`** — cache introspection/control (availability varies)",
                                                                              np: "क्याश",
                jp: "キャッシュ系（バージョン注意）",
              },
              {
                en: "Inspect or cancel prefetches—only when debugging networking / offline lists; confirm API existence in RN release changelog.",
                                                                          np: "चेन्ज्लग ",
                jp: "製品コードより **デバッグ・問題調査向き**。changelog で有無確認。",
              },
            ],
            [
              { en: "**`ImageBackground` component** (not a prop)", np: "इमेज BG", jp: "**`ImageBackground`**" },
              {
                en: "Same **`Image`** props **`+`** **`imageStyle`** + **`imageRef`** wrapper that **supports child overlays**.",
                                                                          np: "बच्चा।",
                jp: "背景＋グラデ＋`**Text`** を載せたいとき。",
              },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Remote URI + bounded box + loaders",
                                                                              np: "URI लोडर",
            jp: "リモート + ロードイベント",
          },
          code: `import { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';

export function RemoteHero({ uri }: { uri: string }) {
  const [pending, setPending] = useState(true);

  return (
    <View style={{ aspectRatio: 16 / 9, width: '100%', backgroundColor: '#e5e7eb' }}>
      {pending ? <ActivityIndicator style={{ marginTop: 40 }} /> : null}

      <Image
        accessibilityIgnoresInvertColors
        accessibilityLabel="Listing hero"
        source={{ uri }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
        onLoadStart={() => setPending(true)}
        onLoadEnd={() => setPending(false)}
        onError={(e) => console.warn('[Image]', e.nativeEvent.error)}
      />
    </View>
  );
}`,
        },
        {
          type: "code",
          title: {
            en: "Local `require` + density (`@2x` / `@3x`) folders",
                                                                              np: "स्थानीय आइकन।",
            jp: "バンドル画像と `@2x`",
          },
          code: `import { Image } from 'react-native';

// Metro resolves density-specific files beside icon.png automatically.
export function BrandMark() {
  return (
    <Image
      source={require('../../assets/icons/app-icon.png')}
      style={{ width: 56, height: 56 }}
      resizeMode="contain"
    />
  );
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "**Recap**: the **Image prop table** above is the canonical cheat sheet—reuse **`onLoad*` + `onError`** (see remote example) and pair **`aspectRatio`/fixed heights** before relying on prefetch tricks.",
                                                                              np: "तालिका मुख्य।",
              jp: "追加の細部は **上の表** を参照。**リモート例** と **`resizeMode` 表** をセットで読むと流れが掴める。",
          },
        },
      ],
    },
    {
      title: {
        en: "Neighboring core components (next lessons)",
                                                                              np: "अर्को पाठहरू",
        jp: "隣のコアコンポーネント",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Syllabus chapters **Touchables**, **Button**, **Alert**, **Platform-specific Code** reuse these primitives—you already saw **`ActivityIndicator`** above paired with **`Image`** loading states.**`ScrollView`** wraps large vertical content (not virtualized).**`Modal`**, **`TextInput`**, **`Switch`**, **`Pressable`** come in dedicated days—conceptually everything still nests inside **`View/Text/Image` trees.**",
                                                                              np: "गतिविधि अस्क्रोल थप।",
            jp: "この後の **`Touchable` / `Button` / `ScrollView`** も、この三種の箱と文字との組み合わせです。",
          },
        },
        {
          type: "table",
          caption: {
            en: "**`ScrollView`** — key props (see also **Day 11 · `FlatList`**) ",
                                                                              np: "ScrollView",
            jp: "ScrollView の主な props",
          },
          headers: [
            { en: "Prop", np: "प्रप", jp: "Prop" },
            { en: "Role", np: "भूमिका", jp: "役割" },
          ],
          rows: [
            [
              { en: "**`contentContainerStyle`**", np: "`contentContainerStyle`", jp: "**`contentContainerStyle`**" },
              {
                en: "**Styles the inner content wrapper** (padding, `flexGrow`, `minHeight`)—**not** the outer scroll viewport **`style`**.",
                                                                          np: "बाहिर भित्र।",
                jp: "**中身**の flex / 余白。**外枠**は **`style`**。",
              },
            ],
            [
              { en: "**`horizontal`**, **`pagingEnabled`**, **`snapToInterval`**", np: "पेजिङ", jp: "横・スナップ " },
              {
                en: "**Carousel-style** horizontal paging; pair **`decelerationRate`** with UX expectations.",
                                                                          np: "कारुसेल ।",
                jp: "**横スクロール**のカルセル向け。",
              },
            ],
            [
              {
                en: "**`keyboardDismissMode`**, **`keyboardShouldPersistTaps`**, **`showsVerticalScrollIndicator`**",
                                                                              np: "किबोर्ड",
                jp: "キーボード／インジケータ",
              },
              {
                en: "**`keyboardDismissMode`** (`'none'|'on-drag'|'interactive'` iOS) hides keyboard on scroll.**`keyboardShouldPersistTaps`** (`'never'|'always'|'handled'`) stops scroll container from eating **`TextInput`** taps.",
                                                                          np: "ट्याप खाइ।",
                jp: "フォームで **タップが効かない**ときはここを疑う。",
              },
            ],
            [
              {
                en: "**`refreshControl`**, **`stickyHeaderIndices`** (iOS), **`scrollEventThrottle`**",
                                                                              np: "रिफ्रेस ",
                jp: "リフレッシュ等",
              },
              {
                en: "**Pull-to-refresh** via **`RefreshControl`**.**`scrollEventThrottle`** (e.g. `16`) feeds animated header collapse from **`onScroll`** without killing JS thread.",
                                                                          np: "थ्रोटल।",
                jp: "**`onScroll` 連動アニメ**は throttle 必須級。",
              },
            ],
            [
              { en: "**`nestedScrollEnabled`** (Android nesting)", np: "नेस्टेड", jp: "`nestedScrollEnabled` " },
              {
                en: "Allow child scrollers inside parent—prefer **single scroll owner** when layout allows.",
                                                                          np: "दुर्लभ।",
                jp: "二重スクロールは避ける。**どうしても**のとき Android 設定。",
              },
            ],
          ],
        },
        {
          type: "table",
          caption: {
            en: "**`KeyboardAvoidingView`** — props that matter daily",
                                                                              np: "KAV ",
            jp: "KeyboardAvoidingView",
          },
          headers: [
            { en: "Prop", np: "प्रप", jp: "Prop" },
            { en: "Role", np: "भूमिका", jp: "役割" },
          ],
          rows: [
            [
              { en: "**`behavior`** (`'padding' | 'position' | 'height'`)", np: "`behavior`", jp: "**`behavior`** " },
              {
                en: "**iOS `'padding'`** common; **`'height'`** shrinks subtree—test with **`KeyboardAvoidingView` wrapping `ScrollView`** vs header overlap.",
                                                                          np: "परीक्षण।",
                jp: "OS と画面構成で変更。**一覧は試行錯誤**になりがち。",
              },
            ],
            [
              { en: "**`keyboardVerticalOffset`**", np: "`offset`", jp: "**`keyboardVerticalOffset`** " },
              {
                en: "Compensates **fixed/stack headers/status bar heights** (`headerHeight`). Calibrate device-by-device snapshot.",
                                                                          np: "हेडर।",
                jp: "**ヘッダ分のずれ補正**がほぼ必須。",
              },
            ],
            [
              { en: "**`enabled`**", np: "`enabled`", jp: "**`enabled`** " },
              {
                en: "Toggle avoidance dynamically when **modal overlays** temporarily own focus.",
                                                                          np: "मोडल।",
                jp: "モーダル表示中は **`false`** にする構成もあり。",
              },
            ],
          ],
        },
        {
          type: "table",
          caption: {
            en: "**`ActivityIndicator`** — props",
                                                                              np: "लोडर प्रप ",
            jp: "ActivityIndicator",
          },
          headers: [
            { en: "Prop", np: "प्रप", jp: "Prop" },
            { en: "Role", np: "भूमिका", jp: "役割" },
          ],
          rows: [
            [
              { en: "**`animating`**", np: "`animating`", jp: "**`animating`** " },
              {
                en: "**`true` spins**, **`false` hides**—pair with suspense/fetch booleans.",
                                                                          np: "बुलियन लोडिंग ",
                jp: "データ取得フラグと同期。",
              },
            ],
            [
              { en: "**`color`**", np: "`color`", jp: "**`color`**（主に iOS/Android） ", },
              {
                en: "**Spinner tint on iOS/Android** (`PlatformColor` okay). ",
                                                                          np: "ब्रन्ड टिन्ट ",
                jp: "ブランド色に合わせる。 ",
              },
            ],
            [
              { en: "**`size`** (`'small' | 'large'`) · **includes platform defaults** ", np: "`size`", jp: "**`size`** " },
              {
                en: "Quick sizing—custom spinners (**Lottie**) replace when brand demands non-native shapes.",
                                                                          np: "लोत्ति ",
                jp: "大きさだけでは足りないなら **Lottie** に。 ",
              },
            ],
            [
              { en: "**`hidesWhenStopped`** (Boolean, iOS default behavior tie-in)", np: "लुकाइ", jp: "`hidesWhenStopped` " },
              {
                en: "Stop animating when `animating` false—mirrors native idle chrome removal.",
                                                                          np: "चुपचाप। ",
                jp: "止まったとき視覚的に消したいときに true。 ",
              },
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Why `<div>` crashes?",
                                        np: "div किन फुट्छ?",
        jp: "div が使えない",
      },
      answer: {
        en: "RN JSX only knows **registered host components**. Use **`View`** for generic containers.",
                                        np: "View प्रयोग।",
        jp: "ネイティブに登録された要素だけ。**View** で代用。",
      },
    },
    {
      question: {
        en: "Remote `Image` height collapsed to zero?",
                                                                np: "उचाइ शून्य?",
        jp: "画像の高さがゼロ",
      },
      answer: {
        en: "Give **`height`/`width`**, **`flex`**, or **`aspectRatio`**.**`Dimensions`/`useWindowDimensions`** help compute percentages. Zero-size parents also collapse children.",
                                                                              np: "अभिभावक स्वास्थ जाँच गर्नुहोस्।",
        jp: "`style` で寸法または `aspectRatio` を与える。親がサイズゼロだと子も潰れる。",
      },
    },
    {
      question: {
        en: "`Text` nested inside another `Text` not bold?",
                                                                      np: "फन्ट?",
        jp: "ネスト Text が太字にならない",
      },
      answer: {
        en: "**Inheritance works down the subtree** until a child resets `fontWeight`. On Android/Web parity tests, **`fontFamily` mixing** occasionally blocks synthetic bold—supply explicit **`fontFamily` file per weight**.",
                                                                              np: "फन्ट परिवार स्थिर कर।",
        jp: "`fontFamily` と `fontWeight` の組み合わせは OS で差が出やすい。太字用のフォントファイルを明示すると安定。",
      },
    },
  ],
};
