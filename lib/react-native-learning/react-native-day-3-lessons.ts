import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_3_LESSONS = normalizePastedLessonDay({
  day: 3,
  title: "Core components and layout",
  totalMinutes: 60,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "core-components",
      title: "View, Text, Image, ScrollView, and Pressable",
      durationMinutes: 12,
      explanation: `<b>Core components are the primitives of React Native UI.</b> <code>View</code> is the general layout container. <code>Text</code> renders text. <code>Image</code> displays images. <code>ScrollView</code> provides scrolling for bounded content. <code>Pressable</code> handles press interaction and pressed-state behavior.

Unlike the web, these are not HTML elements. They are React Native components backed by the native rendering system.

Use ScrollView for content that is reasonably bounded. Very large lists should use virtualization-oriented list components, which the syllabus covers later.`,
      diagram: `<pre>Screen
├─ View
│  ├─ Image
│  ├─ Text
│  └─ Pressable
└─ ScrollView
   └─ content</pre>`,
      codeExample: `<pre><code class="language-tsx">import { Image, Pressable, ScrollView, Text, View } from "react-native";

&lt;ScrollView&gt;
  &lt;View&gt;
    &lt;Image source={{ uri: "https://example.com/avatar.jpg" }}
      style={{ width: 96, height: 96 }} /&gt;
    &lt;Text&gt;Rajan&lt;/Text&gt;
    &lt;Pressable onPress={() =&gt; {}}&gt;
      &lt;Text&gt;Follow&lt;/Text&gt;
    &lt;/Pressable&gt;
  &lt;/View&gt;
&lt;/ScrollView&gt;</code></pre>`,
      keyTakeaways: ['View is the general container.', 'Text renders text.', 'Image renders images.', 'ScrollView handles bounded scrolling.', 'Pressable handles press interactions.'],
      commonMistakes: ['Putting raw text directly in View.', 'Using ScrollView for huge lists.', 'Treating RN primitives as HTML elements.'],
      quiz: [{'question': 'Which component should contain text?', 'answer': 'Text.'}, {'question': 'When is ScrollView a poor choice?', 'answer': 'For very large/unbounded lists where virtualization is needed.'}]
    },
    {
      id: "flexbox-text",
      title: "Text rules and Flexbox in React Native",
      durationMinutes: 13,
      explanation: `<b>React Native layout is heavily based on Flexbox, but the defaults differ from the web.</b> Text content must be inside <code>Text</code>; a raw string cannot simply be placed in a View.

The most important Flexbox difference is that <code>flexDirection</code> defaults to <b>column</b>. Siblings therefore stack vertically unless you choose <code>row</code>.

React Native does not have the browser's CSS cascade. Styles are applied through the React Native styling system. Numeric dimensions and spacing are normally expressed as numbers rather than strings such as <code>16px</code>.

Become comfortable with <code>flexDirection</code>, <code>justifyContent</code>, <code>alignItems</code>, <code>flex</code>, <code>gap</code>, <code>flexWrap</code>, and <code>alignSelf</code>.`,
      diagram: `<pre>Default:
View
├─ A
├─ B
└─ C

flexDirection: "row"
View → A | B | C</pre>`,
      codeExample: `<pre><code class="language-tsx">const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  content: {
    flex: 1,
  },
});</code></pre>`,
      keyTakeaways: ['Text belongs inside Text.', 'flexDirection defaults to column.', 'RN does not use browser CSS cascade.', 'Numeric style values are normal.', 'Parent-child Flexbox relationships solve most basic layouts.'],
      commonMistakes: ['Expecting row as the default.', 'Writing 16px for ordinary RN numeric styles.', 'Expecting CSS selectors/cascade.', 'Using absolute positioning for layouts Flexbox can handle.'],
      quiz: [{'question': 'What is the default flexDirection?', 'answer': 'column.'}, {'question': 'Can raw text be directly inside View?', 'answer': 'No; use Text.'}]
    },
    {
      id: "safe-area",
      title: "Safe areas, notches, home indicators, and system UI",
      durationMinutes: 11,
      explanation: `<b>Mobile screens are not simply rectangles available for arbitrary content.</b> Notches, camera cutouts, status areas, rounded corners, and home indicators can overlap application UI.

A <b>safe area</b> is the region where important content can be placed without being obstructed by system UI or device features. React Native has <code>SafeAreaView</code>; <code>react-native-safe-area-context</code> provides more flexible safe-area inset access for application layouts.

An <b>inset</b> is the amount of protected space from an edge. Safe-area handling is contextual: a background image might intentionally extend behind system UI while interactive controls remain inside safe insets.`,
      diagram: `<pre>┌─────────────────────┐
│ notch / status area │
│ ┌─────────────────┐ │
│ │  safe content   │ │
│ └─────────────────┘ │
│   home indicator    │
└─────────────────────┘</pre>`,
      codeExample: `<pre><code class="language-tsx">import { SafeAreaView, Text } from "react-native";

export function Screen() {
  return (
    &lt;SafeAreaView style={{ flex: 1 }}&gt;
      &lt;Text&gt;Profile&lt;/Text&gt;
    &lt;/SafeAreaView&gt;
  );
}</code></pre>`,
      keyTakeaways: ['System UI affects usable screen space.', 'Safe areas protect important content.', 'safe-area-context provides flexible inset access.', 'Not every visual must stay inside the safe area.'],
      commonMistakes: ['Assuming all devices have the same insets.', 'Using arbitrary padding instead of safe-area information.', 'Testing only on a rectangular emulator.'],
      quiz: [{'question': 'Why do safe areas matter?', 'answer': 'They prevent important content from being obstructed by device and system UI.'}]
    },
    {
      id: "dimensions-platform",
      title: "Dimensions, useWindowDimensions, and platform-specific code",
      durationMinutes: 12,
      explanation: `<code>Dimensions</code> provides window/screen dimension information. However, dimensions can change because of rotation, resizing, foldables, or other window changes.

<code>useWindowDimensions</code> is the reactive hook for responsive UI: when the window dimensions change, the component can render again using the new values.

For platform differences, use <code>Platform.OS</code> for the current platform and <code>Platform.select</code> for selecting small platform-specific values. When the implementation itself differs substantially, React Native can resolve files such as <code>Profile.ios.tsx</code> and <code>Profile.android.tsx</code>.

Prefer shared code when behavior is shared. Use platform-specific code when the platform genuinely requires it.`,
      diagram: `<pre>Responsive UI
├─ useWindowDimensions → reactive size
├─ Platform.OS → ios/android
├─ Platform.select → small value differences
└─ .ios.tsx / .android.tsx → different implementations</pre>`,
      codeExample: `<pre><code class="language-tsx">import { Platform, useWindowDimensions, View } from "react-native";

export function Card() {
  const { width } = useWindowDimensions();
  const compact = width &lt; 400;

  return (
    &lt;View
      style={[
        { padding: compact ? 12 : 20 },
        Platform.select({
          ios: { marginTop: 8 },
          android: { marginTop: 4 },
        }),
      ]}
    /&gt;
  );
}</code></pre>`,
      keyTakeaways: ['Dimensions gives dimension information.', 'useWindowDimensions is reactive.', 'Platform.OS identifies the platform.', 'Platform.select is useful for small differences.', 'Platform-specific files fit substantially different implementations.'],
      commonMistakes: ['Reading dimensions once and assuming they never change.', 'Using Platform.OS for every tiny style difference.', 'Creating separate files when a shared component is clearer.'],
      quiz: [{'question': 'Why use useWindowDimensions for responsive UI?', 'answer': 'It updates when the current window dimensions change.'}, {'question': 'When should platform-specific files be used?', 'answer': 'When the implementation itself is meaningfully different.'}]
    },
    {
      id: "keyboard-modal",
      title: "KeyboardAvoidingView and native versus navigator-based modals",
      durationMinutes: 12,
      explanation: `<b>The software keyboard is a first-class mobile layout problem.</b> A form can look perfect until the keyboard opens and covers the focused input or submit button.

<code>KeyboardAvoidingView</code> helps adjust a layout when the keyboard appears. Real forms may also need scrolling, focused-input handling, safe-area insets, and platform-specific behavior.

A React Native <code>Modal</code> provides a native modal presentation. A <b>navigator-based modal</b> is a navigation route presented with modal behavior and therefore participates in navigation state.

Use a native Modal for focused transient presentation when it does not need to be a navigation destination. Use a navigator modal when the UI is conceptually a route in the application's navigation architecture.`,
      diagram: `<pre>Form
├─ input
├─ input ← keyboard
└─ button
      ↓
KeyboardAvoidingView
      ↓
adjusted layout

Modal choices:
Native Modal → transient presentation
Navigator modal → navigation route</pre>`,
      codeExample: `<pre><code class="language-tsx">import { KeyboardAvoidingView, Platform, TextInput, View } from "react-native";

export function Form() {
  return (
    &lt;KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    &gt;
      &lt;View style={{ flex: 1, justifyContent: "center", padding: 24 }}&gt;
        &lt;TextInput placeholder="Email" /&gt;
        &lt;TextInput placeholder="Password" secureTextEntry /&gt;
      &lt;/View&gt;
    &lt;/KeyboardAvoidingView&gt;
  );
}</code></pre>`,
      keyTakeaways: ['The keyboard changes usable mobile layout.', 'KeyboardAvoidingView can adjust layouts when it appears.', 'Complex forms may need scrolling and focused-input handling.', 'Modal is a native modal presentation.', 'Navigator-based modal is a navigation route.'],
      commonMistakes: ['Testing forms only with the keyboard closed.', 'Assuming one keyboard configuration works for every screen.', 'Using a navigation route for tiny transient UI.', 'Using native Modal when the screen should be part of navigation state.'],
      quiz: [{'question': 'Why is the keyboard a first-class layout concern?', 'answer': 'It can cover a large portion of the screen and make inputs/actions inaccessible.'}, {'question': 'What is the conceptual difference between Modal and navigator modal?', 'answer': 'Modal is a transient presentation; a navigator modal is a route in navigation state presented modally.'}]
    },
  ],
  finalQuiz: [{'question': 'Name the five core components introduced.', 'answer': 'View, Text, Image, ScrollView, Pressable.'}, {'question': 'Why must text be inside Text?', 'answer': 'React Native does not use the browser DOM text model; text is rendered through Text.'}, {'question': 'What is the default flexDirection?', 'answer': 'column.'}, {'question': 'Why are safe areas important?', 'answer': 'Notches, system bars, rounded corners, and home indicators can overlap application content.'}, {'question': 'Dimensions vs useWindowDimensions?', 'answer': 'Dimensions provides dimension information; useWindowDimensions is reactive when the window changes.'}, {'question': 'Three ways to handle platform differences?', 'answer': 'Platform.OS, Platform.select, and .ios.tsx/.android.tsx files.'}, {'question': 'Why use KeyboardAvoidingView?', 'answer': 'The software keyboard can cover focused inputs or important controls, so the layout may need to adjust.'}],
  project: {'name': 'Responsive Profile Screen', 'goal': 'Build a profile screen that works across iOS and Android with different window sizes and safe-area requirements.', 'brief': 'Build a screen with an avatar, name, bio, Follow button, scrollable content, and a small modal. Use core components, Flexbox, safe-area handling, responsive dimensions, and one clean platform-specific difference.', 'steps': ['Build the profile using View, Text, Image, ScrollView, and Pressable.', 'Use Flexbox for the main layout.', 'Add safe-area handling.', 'Use useWindowDimensions for a narrow layout.', 'Add one platform-specific style or behavior.', 'Add a small native Modal.', 'Test iOS and Android.', 'Change the available window size and verify the layout responds.', 'If you add TextInput, test with the keyboard open.'], 'acceptance': ['All five core components are used appropriately.', 'No raw text is directly inside View.', 'Main layout uses Flexbox.', 'Safe-area handling protects important content.', 'Responsive behavior works at different widths.', 'A platform-specific difference is implemented cleanly.', 'The modal works.', 'The screen remains usable with the keyboard when an input exists.'], 'stretch': ['Create a genuinely platform-specific .ios.tsx/.android.tsx component.', 'Add an editable bio with keyboard-aware scrolling.', 'Test on a physical device.', 'Let a background image extend behind system UI while keeping controls inside safe insets.']}
});
