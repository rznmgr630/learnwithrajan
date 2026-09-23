import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_4_LESSONS = normalizePastedLessonDay({
  day: 4,
  title: "Styling",
  totalMinutes: 45,
  difficulty: "Beginner",
  lessons: [
    {
      id: "rn4-style-sheet",
      title: "StyleSheet.create and React Native styles",
      durationMinutes: 6,
      explanation: `<b>StyleSheet.create</b> is React Native's built-in helper for defining styles in one place. It is useful for organization, reuse, and keeping component code readable, but it is <b>not required</b>. React Native also accepts plain style objects and inline styles.

The important mental model is that React Native styles are JavaScript objects that describe native view properties. They are not CSS text files.

<code>StyleSheet.create()</code> can make a style definition easier to organize, but it does not turn React Native into a browser CSS engine.`,
      diagram: `Component
  |
  +-- style={{ padding: 16 }}
  |
  +-- style={styles.card}
              |
              +-- StyleSheet.create({...})
              |
              v
        React Native style system
              |
              v
        Native view properties`,
      codeExample: `import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
});

export function ProfileCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Rajan</Text>
    </View>
  );
}

// Inline styles are also valid:
<Text style={{ fontSize: 18 }}>Hello</Text>`,
      keyTakeaways: [
        "StyleSheet.create is useful but optional.",
        "Styles are JavaScript objects, not browser CSS.",
        "Reusable named styles usually make larger components easier to maintain.",
      ],
      commonMistakes: [
        "Thinking every React Native style must be created with StyleSheet.create.",
        "Assuming React Native supports every CSS property.",
      ],
      quiz: [
        {
          question: "Is StyleSheet.create required for React Native styling?",
          options: ["Yes", "No"],
          answer: "No",
        },
      ],
    },
    {
      id: "rn4-no-cascade",
      title: "No CSS cascade, inheritance, or pseudo-classes",
      durationMinutes: 6,
      explanation: `React Native does not use the browser's normal CSS cascade. A child does not automatically receive arbitrary styles from its parent.

Some text-related properties can behave like inherited values, but you should not build your styling architecture around browser-style inheritance.

React Native also does not provide browser CSS pseudo-classes such as <code>:hover</code> or <code>:focus</code>. Interaction states are normally represented with component state, Pressable callbacks, or style functions.`,
      diagram: `Web CSS
Parent style
     |
     +--> cascade/inheritance
     |
Child may receive styles

React Native
Parent style
     |
     X  no general CSS cascade
     |
Child gets its own style
     |
     +--> state/props can change style`,
      codeExample: `import { Pressable, Text } from "react-native";
import { useState } from "react";

export function Button() {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{
        padding: 16,
        opacity: pressed ? 0.6 : 1,
      }}
    >
      <Text>Press me</Text>
    </Pressable>
  );
}`,
      keyTakeaways: [
        "Do not expect browser CSS cascade behavior.",
        "Do not rely on arbitrary parent-to-child style inheritance.",
        "Use component state or Pressable style callbacks for interaction states.",
      ],
      commonMistakes: [
        "Trying to write :hover or :focus selectors.",
        "Expecting a parent View's color or spacing rules to style every descendant.",
      ],
      quiz: [
        {
          question: "How should you normally implement a pressed visual state?",
          options: ["Use :active CSS", "Use Pressable state/style behavior"],
          answer: "Use Pressable state/style behavior",
        },
      ],
    },
    {
      id: "rn4-styling-options",
      title: "Styling approaches",
      durationMinutes: 7,
      explanation: `You can style React Native applications in several ways.

<b>Inline styles</b> are convenient for small, dynamic values.

<b>StyleSheet</b> is the built-in approach and is useful for structured, reusable styles.

<b>styled-components</b> provides a component-based styling abstraction.

<b>NativeWind</b> brings a Tailwind-style utility approach to React Native. In this learning track, NativeWind is the default styling approach so that the project can use utility classes while still learning the underlying React Native style model.`,
      diagram: `Styling choices

Inline styles
    |
StyleSheet
    |
styled-components
    |
NativeWind  <-- track default`,
      codeExample: `// StyleSheet
const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
  },
});

// NativeWind
<View className="rounded-xl p-4">
  <Text className="text-xl font-bold">Profile</Text>
</View>`,
      keyTakeaways: [
        "Understand the native style model even when using a styling abstraction.",
        "NativeWind is the default styling approach for this track.",
        "Choose one consistent styling strategy within a project.",
      ],
      commonMistakes: [
        "Using several styling systems randomly in the same codebase.",
        "Learning Tailwind utilities without understanding the underlying native layout behavior.",
      ],
      quiz: [
        {
          question: "Which styling approach is the default for this track?",
          options: ["styled-components", "NativeWind", "Inline styles only"],
          answer: "NativeWind",
        },
      ],
    },
    {
      id: "rn4-theme",
      title: "Design tokens, themes, and dark mode",
      durationMinutes: 7,
      explanation: `A <b>design token</b> is a named value representing a design decision, such as a spacing value, color, radius, or font size.

A theme object groups these tokens so the application can consistently support light and dark appearances.

React Native provides <code>useColorScheme</code> for reading the device's current color-scheme preference. A real application can use that value to select a theme and can also provide an explicit user override.`,
      diagram: `useColorScheme()
       |
       +---- "light" ----> lightTheme
       |
       +---- "dark" -----> darkTheme
                         |
                         v
                  shared components
                  use theme tokens`,
      codeExample: `import { useColorScheme } from "react-native";

const themes = {
  light: {
    background: "#ffffff",
    text: "#111111",
  },
  dark: {
    background: "#111111",
    text: "#ffffff",
  },
};

export function Screen() {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? themes.dark : themes.light;

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Text style={{ color: theme.text }}>Hello</Text>
    </View>
  );
}`,
      keyTakeaways: [
        "Tokens make design decisions reusable.",
        "A theme centralizes light/dark values.",
        "useColorScheme reads the system color-scheme preference.",
      ],
      commonMistakes: [
        "Hard-coding colors in every component.",
        "Assuming system dark mode automatically fixes every custom component.",
      ],
      quiz: [
        {
          question: "What is a design token?",
          options: ["A named reusable design value", "A navigation route"],
          answer: "A named reusable design value",
        },
      ],
    },
    {
      id: "rn4-responsive",
      title: "Responsive design without media queries",
      durationMinutes: 6,
      explanation: `React Native does not use browser media queries as the primary responsive-layout mechanism.

Use percentage dimensions when appropriate, and use <code>useWindowDimensions</code> when the component needs the current window size. You can build a small <b>breakpoint hook</b> (a hook that maps dimensions to layout categories) when larger layouts need different structures.`,
      diagram: `Window dimensions
      |
      v
useWindowDimensions()
      |
      +--> width < breakpoint --> compact
      |
      +--> width >= breakpoint -> expanded`,
      codeExample: `import { useWindowDimensions } from "react-native";

export function useIsTabletLayout() {
  const { width } = useWindowDimensions();
  return width >= 768;
}

function Dashboard() {
  const isWide = useIsTabletLayout();

  return (
    <View style={{ flexDirection: isWide ? "row" : "column" }}>
      <Sidebar />
      <Content />
    </View>
  );
}`,
      keyTakeaways: [
        "Use dimensions and layout primitives instead of browser media queries.",
        "useWindowDimensions updates when the window dimensions change.",
        "Breakpoints should describe meaningful layout changes, not arbitrary device names.",
      ],
      commonMistakes: [
        "Hard-coding layouts for specific phone models.",
        "Using Dimensions.get once when the component needs to react to window changes.",
      ],
      quiz: [
        {
          question: "Which hook is useful for responsive layouts that react to window-size changes?",
          options: ["useWindowDimensions", "useColorScheme"],
          answer: "useWindowDimensions",
        },
      ],
    },
    {
      id: "rn4-shadow",
      title: "Shadows and elevation",
      durationMinutes: 5,
      explanation: `Shadows have platform differences.

On iOS, React Native shadow behavior is controlled mainly through properties such as <code>shadowColor</code>, <code>shadowOffset</code>, <code>shadowOpacity</code>, and <code>shadowRadius</code>.

Android uses <code>elevation</code> for its native elevation/shadow model. The visual result is not identical to iOS, so production designs should be tested on both platforms.`,
      diagram: `Card
 |
 +-- iOS ----> shadowColor
 |             shadowOffset
 |             shadowOpacity
 |             shadowRadius
 |
 +-- Android -> elevation`,
      codeExample: `const styles = StyleSheet.create({
  card: {
    borderRadius: 16,

    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,

    // Android
    elevation: 4,
  },
});`,
      keyTakeaways: [
        "iOS and Android do not render shadows through exactly the same mechanism.",
        "Use elevation for Android.",
        "Test visual effects on both platforms.",
      ],
      commonMistakes: [
        "Expecting one shadow configuration to look identical on both platforms.",
      ],
      quiz: [
        {
          question: "Which property is the common Android elevation mechanism?",
          options: ["shadowRadius", "elevation"],
          answer: "elevation",
        },
      ],
    },
    {
      id: "rn4-fonts",
      title: "Custom fonts with expo-font",
      durationMinutes: 5,
      explanation: `Custom fonts can be loaded with <code>expo-font</code>. The application should make sure the font is available before rendering UI that depends on it.

Otherwise, users can briefly see fallback typography before the custom font becomes available. This visual transition is commonly called <b>flash of unstyled text</b> (a short period where fallback styling is displayed).`,
      diagram: `App startup
   |
   v
Load font
   |
   +---- not ready ----> loading/splash UI
   |
   +---- ready ---------> render app`,
      codeExample: `import { useFonts } from "expo-font";

export function App() {
  const [loaded] = useFonts({
    Inter: require("./assets/fonts/Inter-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return <RootNavigator />;
}`,
      keyTakeaways: [
        "Load custom fonts before depending on them in the main UI.",
        "Fallback typography can cause a visible style flash.",
        "Coordinate font loading with your startup/splash strategy.",
      ],
      commonMistakes: [
        "Rendering the whole application before fonts are ready.",
        "Forgetting to test font loading on a cold start.",
      ],
      quiz: [
        {
          question: "Why wait for a custom font to load?",
          options: ["To prevent fallback typography from briefly appearing", "To enable navigation"],
          answer: "To prevent fallback typography from briefly appearing",
        },
      ],
    },
    {
      id: "rn4-edge",
      title: "Edge-to-edge layouts on Android",
      durationMinutes: 3,
      explanation: `Modern Android layouts increasingly use an <b>edge-to-edge</b> model where application content can extend behind system bars. That means safe-area and inset handling are part of layout correctness, not just visual polish.

React Native's Android behavior has continued to evolve, so this topic should be treated as version-sensitive. For the current track, pay particular attention to the Android edge-to-edge changes around React Native 0.86 and test the exact version used by the project.`,
      diagram: `System status/navigation areas
        |
        v
+---------------------------+
| content can reach edges   |
|                           |
|     application UI        |
|                           |
+---------------------------+
        |
   safe-area/insets
   keep important UI clear`,
      codeExample: `import { SafeAreaView } from "react-native-safe-area-context";

export function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Content />
    </SafeAreaView>
  );
}`,
      keyTakeaways: [
        "Edge-to-edge means content can occupy areas behind system bars.",
        "Insets must be handled deliberately for important controls and content.",
        "Android behavior is version-sensitive; test on the actual React Native version.",
      ],
      commonMistakes: [
        "Assuming edge-to-edge is only a visual issue.",
        "Ignoring safe-area insets around headers, buttons, and bottom controls.",
      ],
      quiz: [
        {
          question: "Why do edge-to-edge layouts make insets important?",
          options: ["Content can extend behind system bars", "They disable navigation"],
          answer: "Content can extend behind system bars",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Is StyleSheet.create mandatory?",
      options: ["Yes", "No"],
      answer: "No",
    },
    {
      question: "What is the default styling approach in this track?",
      options: ["NativeWind", "CSS modules"],
      answer: "NativeWind",
    },
    {
      question: "Which hook reads the current window dimensions?",
      options: ["useWindowDimensions", "useColorScheme"],
      answer: "useWindowDimensions",
    },
    {
      question: "Which Android property is used for native elevation?",
      options: ["elevation", "shadowRadius"],
      answer: "elevation",
    },
  ],
  project: {
    name: "Theme-aware responsive screen",
    goal: "Build a small screen that demonstrates reusable styling, theming, responsive behavior, platform-aware shadows, and custom fonts.",
    brief: "Create a profile/settings screen using the track's default styling approach. Add light/dark themes, responsive layout behavior, a custom font, and platform-appropriate card elevation/shadows.",
    steps: [
      "Create shared design tokens for spacing, colors, radii, and typography.",
      "Create light and dark theme objects.",
      "Use useColorScheme to select the active theme.",
      "Create a responsive layout using useWindowDimensions.",
      "Add a card with iOS shadow properties and Android elevation.",
      "Load a custom font with expo-font.",
      "Verify the screen on both iOS and Android.",
    ],
    acceptance: [
      "The screen supports light and dark appearance.",
      "The layout changes appropriately as the window width changes.",
      "The card has platform-appropriate shadow behavior.",
      "The custom font is loaded before the main UI depends on it.",
      "No browser CSS pseudo-classes or cascade assumptions are used.",
    ],
    stretch: [
      "Add a user-controlled theme toggle that persists across app restarts.",
      "Apply the theme consistently to every screen without requiring a full remount.",
      "Create a reusable breakpoint hook and theme provider.",
    ],
  },
});
