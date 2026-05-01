import type { RoadmapDayDetail } from "@/lib/challenge-data";

/** Day 7 — Touchables · Pressable · Button · Alert · StyleSheet · platform code + prop tables. */
export const REACT_NATIVE_DAY_7_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Touch targets** wrap **`View`/`Text`**. This day adds **prop reference tables** for **`TouchableOpacity`**, **`TouchableHighlight`**, **`TouchableWithoutFeedback`**, **`Pressable`**, **`Button`**, **`Alert`**, plus **`StyleSheet` static helpers**—then **`Platform.select`** patterns.",
                                    np: "टच प्रप तालिकाहरू।",
      jp: "**Touchable / Pressable / Button / Alert / StyleSheet** の主な props と静的 API を表で整理します。",
    },
  ],
  sections: [
    {
      title: { en: "Touchables — shared mental model", np: "टच साझा ", jp: "Touchables の共通点" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "All **`Touchable*`** components expose a **similar touch contract**: **`onPress`**, optional **`onPressIn` / `onPressOut` / `onLongPress`**, **`delay*`** knobs, **`hitSlop`** / **`pressRetentionOffset`**, **`disabled`**, **`accessibility*`**, **`testID`**.**`activeOpacity`/`underlayColor`** differ per subtype.",
                                          np: "मुख्य उपचार ।",
              jp: "まず **`onPress` と hit 領域**が共通。**見た目のフィードバック**だけが種類で異なる。",
          },
        },
        {
          type: "table",
          caption: {
            en: "**`TouchableOpacity`** — opacity dip on press (default **0.2** fade)",
                                              np: "Opacity प्रप ",
            jp: "TouchableOpacity の主な props",
          },
          headers: [
            { en: "Prop", np: "प्रप", jp: "Prop" },
            { en: "Role", np: "भूमिका", jp: "役割" },
          ],
          rows: [
            [
              { en: "**`activeOpacity`**", np: "`activeOpacity`", jp: "**`activeOpacity`**" },
              {
                en: "**Opacity during press** (default ~**0.2**). Tune for brand—`1` disables visual dip.",
                                                                          np: "दृश्य टन्न।",
                jp: "押下時の薄さ。**`1`** でフェードほぼなし（通常はやらない）。",
              },
            ],
            [
              { en: "**`onPress`**, **`onPressIn`**, **`onPressOut`**", np: "थप ", jp: "タップ系列" },
              {
                en: "**Primary tap** vs **finger down/up** callbacks—great for ripple timing / haptics on **`onPressIn`**.",
                                                                          np: "ह्याप्टिक।",
                jp: "**`onPressIn`** で即時フィードバックするパターンあり。",
              },
            ],
            [
              {
                en: "**`onLongPress`**, **`delayLongPress`** (default **500** ms)",
                                                                              np: "लामो थिचाइ",
                jp: "長押し",
              },
              {
                en: "**Context menus / destructive confirm** triggers—coordinate with **`ActionSheet`** on iOS if needed.",
                                                                          np: "मेनू।",
                jp: "**`delayLongPress`** を短くすると誤長押しが増える。",
              },
            ],
            [
              { en: "**`disabled`**", np: "`disabled`", jp: "**`disabled`**" },
              {
                en: "Blocks interaction + often dims via opacity pipeline—combine with **`accessibilityState={{ disabled:true }}`** for SR.",
                                                                          np: "पहुँच बन्द ।",
                jp: "無効時は **`accessibilityState.disabled`** と見た目を揃える。",
              },
            ],
            [
              { en: "**`hitSlop`**", np: "`hitSlop`", jp: "**`hitSlop`**" },
              {
                en: "**Unified number or `{top,left,bottom,right}` inset** widening tap area without resizing layout visuals.",
                                                                          np: "टच विस्तार ",
                jp: "アイコンが小さいとき **`top:12` のように拡張。**",
              },
            ],
            [
              { en: "**`pressRetentionOffset`**", np: "`pressRetentionOffset`", jp: "**`pressRetentionOffset`**" },
              {
                en: "How far finger may drift before canceling **`onPress`** on scroll parents—helps sloppy taps near list edges.",
                                                                          np: "ड्रिफ्ट।",
                jp: "スクロール中の微妙なずれ許容に。",
              },
            ],
            [
              {
                en: "**`delayPressIn`**, **`delayPressOut`**, **`unstable_pressDelay` (experimental)**",
                                                                              np: "विलम्ब",
                jp: "ディレイ類",
              },
              {
                en: "**Gesture choreography** vs scroll recognizers—increase **`delayPressIn`** when **`ScrollView`** steals taps.",
                                                                          np: "स्क्रल ।",
                jp: "**`ScrollView` 内のボタン**で反応しないとき調整対象になりがち。",
              },
            ],
            [
              { en: "**`style`**, **`tvParallaxProperties`** (Apple TV)", np: "`style` / TV ", jp: "`style`・TV向け  " },
              {
                en: "Layout/styling wraps children—remember **minimum 44×44 pt** heuristic for primary actions.",
                                                                          np: "४४ टोमा।",
                jp: "タップ **`44pt` 四方** が指針。",
              },
            ],
            [
              {
                en: "**`accessible`**, **`accessibilityRole`**, **`accessibilityLabel`**, **`accessibilityHint`**, **`accessibilityState`**, **`testID`**",
                                                                              np: "a11y",
                jp: "a11y / testID",
              },
              {
                en: "**Button semantics** (`accessibilityRole='button'`) beats generic **'text'** for custom rows.",
                                                                          np: "भूमिका बटन।",
                jp: "**カスタム行**でも **`role='button'`** を明示。",
              },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Opacity vs highlight",
                                                np: "प्रतिक्रिया",
            jp: "Opacity とハイライト",
          },
          code: `import { Text, TouchableOpacity, TouchableHighlight } from 'react-native';

export function RowChrome({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <>
      <TouchableOpacity activeOpacity={0.6} onPress={onPress} style={{ padding: 16 }}>
        <Text>{label}</Text>
      </TouchableOpacity>

      <TouchableHighlight underlayColor="#ddd" onPress={onPress}>
        <Text style={{ padding: 16 }}>{label}</Text>
      </TouchableHighlight>
    </>
  );
}`,
        },
        {
          type: "table",
          caption: {
            en: "**`TouchableHighlight`** / **`TouchableWithoutFeedback`** — extra props vs Opacity",
                                                np: "Highlight",
            jp: "Highlight / WithoutFeedback の差分",
          },
          headers: [
            { en: "Component · prop", np: "घटक", jp: "種類 / Prop" },
            { en: "Notes", np: "नोट", jp: "メモ" },
          ],
          rows: [
            [
              { en: "**`TouchableHighlight`** — **`underlayColor`** (required for visible feedback)", np: "`underlayColor`", jp: "Highlight" },
              {
                en: "**`activeOpacity`** still applies.**`underlayStyle`** adjusts highlight layer.**Child must accept style ref** underneath.",
                                                                          np: "अदृश्य हाइलाइट?",
                jp: "**子が単独 `Text`** だけだとハイライトが見えにくい — **`View` で包む**ことも。",
              },
            ],
            [
              { en: "**`TouchableWithoutFeedback`**", np: "प्रतिक्रिया बिहाय ", jp: "WithoutFeedback  " },
              {
                en: "**No default visual highlight** — only use when you animate feedback yourself (**Scale**, **Ripple**) or tapping transparent overlays.**Requires exactly one React child.**",
                                                                          np: "एक छोरो।",
                jp: "**子は 1 つだけ**。自作アニメとセット。",
              },
            ],
          ],
        },
      ],
    },
    {
      title: { en: "Pressable — prop essentials", np: "Pressable", jp: "Pressable（推奨の足場）" },
      blocks: [
        {
          type: "table",
          caption: {
            en: "**`Pressable`** — superset-ish API (`android_ripple`, hover, pressed state)",
                                                                          np: "Pressable ",
            jp: "Pressable の主な props",
          },
          headers: [
            { en: "Prop / pattern", np: "प्रप", jp: "Prop" },
            { en: "Role", np: "भूमिका", jp: "役割" },
          ],
          rows: [
            [
              { en: "**`children` as `(state)=>ReactNode`**", np: "अवस्थिति ", jp: "render prop" },
              {
                en: "**`state.pressed`**, **`focused`**, **`hovered`** (where supported)—theme buttons without juggling multiple wrappers.",
                                                                          np: "थिम।",
                jp: "**`(pressed)=>`** で見た目分岐。**モダンパターンの中心**。",
              },
            ],
            [
              {
                en: "**`style`**, **`disabled`**, **`hitSlop`**, **`pressRetentionOffset`**, **`delayLongPress`**",
                                                                              np: "साझा",
                jp: "Touchable と共通",
              },
              {
                en: "**Same ergonomics as `Touchable*`** plus style function support.",
                                                                          np: "मिलाइ।",
                jp: "移行時はほぼ置き換え可。",
              },
            ],
            [
              {
                en: "**`android_ripple`**: `{color,borderless,foreground,radius}`",
                                                                              np: "रिपल ",
                jp: "`android_ripple`",
              },
              {
                en: "Material ripple—**respect parent clipping** (**`overflow:'hidden'`** on container if ripple bleeds oddly).",
                                                                          np: "क्लिप।",
                jp: "**クリップ問題**があるとき親の **`overflow`** を確認。",
              },
            ],
            [
              {
                en: "**`disabled` styling** (`style`/`children` reacts) vs **`opacity` wrappers** legacy pattern",
                                                                              np: "असक्षम ध्वस्त",
                jp: "無効の見せ方",
              },
              {
                en: "**`accessibilityState={{disabled:true}}`** still required manually when you fake disabled visuals.",
                                                                          np: "पहुँच ",
                jp: "視覚だけ無効にしない。**アクセシビリティと同期**。",
              },
            ],
          ],
        },
      ],
    },
    {
      title: { en: "Button", np: "Button", jp: "Button" },
      blocks: [
        {
          type: "table",
          caption: {
            en: "**`Button`** — limited cross‑platform shim (few props)",
                                                                      np: "Button प्रप ",
            jp: "Button の props（少ない）",
          },
          headers: [
            { en: "Prop", np: "प्रप", jp: "Prop" },
            { en: "Role", np: "भूमिका", jp: "役割" },
          ],
          rows: [
            [
              { en: "**`title`** (**required**, string)", np: "`title`", jp: "**`title`**" },
              { en: "Visible label—not rich text (**no nested span analog**); use **`Pressable`+`Text`** for typography control.", np: "सादा।", jp: "リッチ不可。**本番は Pressable**。 " },
            ],
            [
              { en: "**`onPress`**", np: "`onPress`", jp: "**`onPress`**" },
              { en: "Tap handler—no **`hitSlop`/`ripple` granularity** baked in.", np: "सीमित।", jp: "細かい hit 調整なし。", },
            ],
            [
              { en: "**`color`** (mostly Android text color semantic; tint varies)", np: "`color` ", jp: "`color` ", },
              {
                en: "Quick prototype accent—cannot express gradient borders etc.",
                np: "प्रोटो।",
                jp: "プロトのみ。**ブランド調整には不向き**。",
              },
            ],
            [
              { en: "**`disabled`**", np: "`disabled`", jp: "**`disabled`**" },
              { en: "Boolean gate—paired platform greys.**Still wire `accessibilityState`.**", np: "अस्पष्ट। ", jp: "灰色化。a11y 同期。", },
            ],
            [
              { en: "**`accessibilityLabel`**, **`testID`**", np: "a11y ", jp: "a11y / testID ", },
              { en: "**Minimum hooks** compared to **`Pressable`**. **`accessibilityHint`** unsupported directly—upgrade wrapper component.", np: "कम。", jp: "hint まで要るなら Pressable。", },
            ],
            [
              { en: "**`touchSoundDisabled`** (Android)", np: "आवाज ", jp: "タップ音 を切る Android ", },
              {
                en: "Disable default click tone for kiosk / studio builds.",
                np: "किशोका। ",
                jp: "キオスクやスタジオ向けでタップ音を切るときに。",
              },
            ],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "**Production apps swap `Button`** for **`Pressable`/`Touchable` + themed `Text`/`Image`** to control padding, loaders, ripple, typography, and **`minHeight` parity**.",
                                          np: "थिम बटन।",
            jp: "本番は **自作 Button コンポーネント** がほぼ必須。",
          },
        },
      ],
    },
    {
      title: { en: "Alert", np: "Alert", jp: "Alert" },
      blocks: [
        {
          type: "table",
          caption: {
            en: "**`Alert.alert(title, message?, buttons?, options?, type?)`**",
                                                      np: "Alert हस्ताक्षर",
            jp: "Alert.alert の形",
          },
          headers: [
            { en: "Arg / field", np: "तर्क", jp: "引数・項目" },
            { en: "Role", np: "भूमिका", jp: "役割" },
          ],
          rows: [
            [
              { en: "**`title`** (string)", np: "शिर्षक ", jp: "タイトル " },
              { en: "**Bold headline row** (`Alert.prompt` differs—iOS‑only historically).", np: "हेड。", jp: "主見出し。", },
            ],
            [
              { en: "**`message`** optional string/multiline explanation", np: "संदेश। ", jp: "本文・複数行可。", },
              { en: "Detail copy—stay concise; defer long legal text to **modal screens**.", np: "संक्षिप्त। ", jp: "長文は画面へ。", },
            ],
            [
              {
                en: "**`buttons`**: **`{ text, onPress?, style? }[]`** — **`style`**: **`'default'|'cancel'|'destructive'`** (**iOS** maps destructive red)",
                                                                              np: "बटन। ",
                jp: "ボタン配列 ",
              },
              {
                en: "**At least one button** recommended.**`'cancel'`** should appear once—OS may reorder (**iOS anchors cancel** visually). `'destructive'` signals irreversible (**Delete** flows). Android ignores some style nuances—still set for readability.",
                                                                          np: "अन्ड्रोइड भिन्न।",
                jp: "**Android と見た目差**あり。**取消は 1 つ**。",
              },
            ],
            [
              {
                en: "**`options`**: **`{ cancelable?:boolean, userInterfaceStyle?, onDismiss? }`** (subset platform-specific)",
                                                                              np: "`options` ",
                jp: "`options`",
              },
              {
                en: "**`cancelable`** (Android): backdrop dismiss.**`userInterfaceStyle`** (iOS 13+): light/dark sheet.**`onDismiss`**: fires when dismissed (outside tap etc., platform-dependent).",
                                                                          np: "बाहिर ट्याप ",
                jp: "**外側タップで閉じるか** は UX 要件で決める。**`onDismiss`** で状態戻し。",
              },
            ],
            [
              { en: "**`Alert.prompt` (legacy iOS pattern)** username/password dialogs", np: "अग्रइन। ", jp: "prompt（限定） ", },
              { en: "**Prefer bespoke modals/`TextInput` screens** cross‑platform.", np: "आधुनिक। ", jp: "モダンは自分の Modal。", },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Cross‑platform prompts",
                                                        np: "चेतावनी",
            jp: "ダイアログ例",
          },
          code: `import { Alert, Platform } from 'react-native';

export function confirmDelete(onYes: () => void) {
  const message = 'This cannot be undone.';
  if (Platform.OS === 'ios') {
    Alert.alert('Delete item?', message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onYes },
    ]);
  } else {
    Alert.alert('Delete item?', message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: onYes },
    ]);
  }
}`,
        },
      ],
    },
    {
      title: { en: "StyleSheet", np: "StyleSheet", jp: "StyleSheet" },
      blocks: [
        {
          type: "table",
          caption: {
            en: "**`StyleSheet` static helpers / methods**",
                                          np: "StyleSheet स्थिर ",
            jp: "StyleSheet の静的 API",
          },
          headers: [
            { en: "API", np: "API", jp: "API" },
            { en: "Role", np: "भूमिका", jp: "役割" },
          ],
          rows: [
            [
              { en: "**`create(object)`**", np: "`create`", jp: "**`create`**", },
              {
                en: "Registers **`number` IDs** validated at creation—**mistyped keys flagged early** vs inline objects **every render** churn.",
                                                                          np: "बेलीडे प्रमाणीकरण ",
                jp: "誤プロパティ検知・再レンダー時のオブジェクト再生成回避。",
              },
            ],
            [
              { en: "**`compose(a,b)`**", np: "`compose` ", jp: "**`compose`**", },
              { en: "Merge arrays / objects when layering theme + variant (**right overrides left semantics** check docs).", np: "केन्द्र। ", jp: "テーマ＋状態の結合。", },
            ],
            [
              { en: "**`flatten(style)`**", np: "`flatten` ", jp: "**`flatten`**", },
              { en: "**Resolve `[styles.row, pressed && styles.bump]`** to single object (**profile before hot paths).**", np: "मेट्रिस। ", jp: "結合済みオブジェクトへ（多用注意）。 ", },
            ],
            [
              { en: "**`absoluteFill`** / **`absoluteFillObject`**", np: "पूरा टप। ", jp: "**`absoluteFillObject`** ", },
              { en: "**`{position:'absolute', top/left/bottom/right:0}` shortcut** overlay gradients/skeletons.", np: "ओभर्लए। ", jp: "オーバーレイ定番。", },
            ],
            [
              { en: "**`hairlineWidth`**", np: "हेअर लाइन् ", jp: "**`hairlineWidth`** ", },
              { en: "**1 physical pixel-ish border baseline** respecting screen density—not always literally 1 px DP.", np: "साँचो पिक्सेल। ", jp: "細境界線。", },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Hoist static objects",
                                                              np: "स्थिर वस्तु",
            jp: "静的スタイル",
          },
          code: `import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  title: { fontSize: 18, fontWeight: '600' },
});

export function Row({ title }: { title: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}`,
        },
      ],
    },
    {
      title: {
        en: "Platform-specific Code",
                                    np: "प्लेटफर्म कोड",
        jp: "Platform-specific Code",
      },
      blocks: [
        {
          type: "table",
          caption: {
            en: "**`Platform`** — runtime fields & helpers",
                                                                      np: "Platform",
            jp: "Platform の使いどころ",
          },
          headers: [
            { en: "API", np: "API", jp: "API" },
            { en: "Role", np: "भूमिका", jp: "役割" },
          ],
          rows: [
            [
              { en: "**`Platform.OS`** `'ios' | 'android' | 'web'`", np: "`OS`", jp: "**`Platform.OS`**", },
              { en: "Branch logic—pair with **`Platform.select`** to avoid repeated `if` ladders.", np: "शाखा। ", jp: "OS 分岐の基本。", },
            ],
            [
              { en: "**`Platform.Version`**", np: "`Version`", jp: "**`Version`**", },
              { en: "Numeric/string OS version—use sparingly; prefer **feature detection** or **API availability** checks when possible.", np: "सावधान। ", jp: "バージョン分岐は最後の手段に。", },
            ],
            [
              { en: "**`Platform.select({ ios: x, android: y, default: z })`**", np: "`select`", jp: "**`Platform.select`**", },
              { en: "Inline object pick per OS—great for **shadow vs elevation** maps.", np: "छाया। ", jp: "影・マージン差の定番。", },
            ],
            [
              { en: "**`PlatformColor('systemBlue')` / `DynamicColorIOS`** (advanced theming)", np: "रङ सिस्टम ", jp: "システム色 ", },
              { en: "Respect **native palette** & dark mode—ensure fallback on Android when API missing.", np: "फलब्याक। ", jp: "ダークモード対応の上級テーマ。", },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Platform.select + file suffixes",
                                    np: ".ios/.android",
            jp: "Platform.select と拡張子",
          },
          code: `import { Platform, StyleSheet } from 'react-native';

const shadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  android: { elevation: 4 },
});`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "`Pressable` vs touchables?",
                                        np: "Pressable?",
        jp: "Pressable は？",
      },
      answer: {
        en: "**`Pressable`** adds **render‑prop state**, **Android ripple config**, and **web hover** affordances—**default choice for new components** unless you need the exact legacy highlight look.",
                                        np: "Pressable नयाँ।",
        jp: "**新規は Pressable 優先**。**Highlight の見た目だけ**残すなら Touchable。",
      },
    },
  ],
};
