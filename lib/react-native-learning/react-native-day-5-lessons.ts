import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_5_LESSONS = normalizePastedLessonDay({
  day: 5,
  title: "Navigation",
  totalMinutes: 45,
  difficulty: "Beginner",
  lessons: [
    {
      id: "rn5-expo-router",
      title: "Expo Router and file-based routing",
      durationMinutes: 7,
      explanation: `<b>Expo Router</b> provides file-based routing for Expo applications. A file or directory in the app's routing structure represents a route in the application.

For this track, Expo Router is the default navigation solution because it gives a predictable project structure, typed route support, and a straightforward way to connect URLs and screens.`,
      diagram: `app/
 |
 +-- index.tsx        -> /
 +-- settings.tsx     -> /settings
 +-- profile/
       +-- [id].tsx   -> /profile/:id`,
      codeExample: `// app/index.tsx
export default function HomeScreen() {
  return <Text>Home</Text>;
}

// app/settings.tsx
export default function SettingsScreen() {
  return <Text>Settings</Text>;
}

// Navigate
import { Link } from "expo-router";

<Link href="/settings">Settings</Link>`,
      keyTakeaways: [
        "Expo Router uses the file system as the route definition.",
        "The app directory maps to navigable screens and route groups.",
        "Expo Router is the default navigation approach for this track.",
      ],
      commonMistakes: [
        "Treating route files as ordinary components without considering URL structure.",
        "Putting unrelated reusable UI into the routing directory.",
      ],
      quiz: [
        {
          question: "What does Expo Router primarily use to define routes?",
          options: ["File structure", "CSS selectors"],
          answer: "File structure",
        },
      ],
    },
    {
      id: "rn5-react-navigation",
      title: "React Navigation underneath Expo Router",
      durationMinutes: 5,
      explanation: `Expo Router is built on top of <b>React Navigation</b>. React Navigation provides the underlying navigation primitives and navigator implementations.

Use Expo Router as the default application-level routing model in this track. Direct React Navigation can still be appropriate when a project needs direct control over navigator configuration or is not using Expo Router.`,
      diagram: `Your screens/routes
       |
       v
Expo Router
       |
       v
React Navigation
       |
       v
Native navigation behavior`,
      codeExample: `// Expo Router
import { Stack } from "expo-router";

export default function Layout() {
  return <Stack />;
}

// Direct React Navigation projects
// can create their own NavigationContainer
// and navigator hierarchy.`,
      keyTakeaways: [
        "Expo Router and React Navigation are related, not competing independent stacks.",
        "Expo Router uses React Navigation underneath.",
        "Know both concepts so you can debug the underlying navigation system.",
      ],
      commonMistakes: [
        "Assuming Expo Router completely replaces React Navigation concepts.",
      ],
      quiz: [
        {
          question: "What library is Expo Router built on?",
          options: ["React Navigation", "Redux"],
          answer: "React Navigation",
        },
      ],
    },
    {
      id: "rn5-navigators",
      title: "Stack, tabs, drawers, and nesting",
      durationMinutes: 7,
      explanation: `A <b>stack navigator</b> represents screens pushed on top of one another. A <b>tab navigator</b> represents primary sections that users can switch between. A <b>drawer navigator</b> provides a side navigation surface.

Real applications often nest these patterns. For example, a tab can contain a stack so that one tab has its own detail-screen history.`,
      diagram: `Root
 |
 +-- Tabs
 |    |
 |    +-- Home Stack
 |    |    +-- Home
 |    |    +-- Details
 |    |
 |    +-- Settings
 |
 +-- Drawer (optional app shell)`,
      codeExample: `// Conceptual Expo Router structure
app/
  _layout.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    settings.tsx
    details/
      [id].tsx`,
      keyTakeaways: [
        "Stacks model hierarchical screen history.",
        "Tabs model major application sections.",
        "Nesting lets each section have its own navigation history.",
      ],
      commonMistakes: [
        "Creating deeply nested navigators without a clear information architecture.",
        "Using tabs for every screen instead of primary sections.",
      ],
      quiz: [
        {
          question: "Which navigator pattern is naturally suited to screen history?",
          options: ["Stack", "Drawer"],
          answer: "Stack",
        },
      ],
    },
    {
      id: "rn5-typed-routes",
      title: "Typed routes and safe parameters",
      durationMinutes: 6,
      explanation: `Navigation parameters are data passed from one route to another. <b>Typed routes</b> let TypeScript help catch invalid route names and parameter shapes during development.

Prefer explicit, small route parameters. A route should generally receive identifiers or compact navigation state rather than large objects that can become stale or difficult to serialize.`,
      diagram: `Screen A
   |
   | href="/users/42"
   v
Route /users/[id]
   |
   v
id: string`,
      codeExample: `// app/users/[id].tsx
import { useLocalSearchParams } from "expo-router";

export default function UserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <Text>User: {id}</Text>;
}`,
      keyTakeaways: [
        "Route parameters should have predictable shapes.",
        "TypeScript can catch many navigation mistakes before runtime.",
        "Prefer passing IDs over large mutable objects.",
      ],
      commonMistakes: [
        "Passing an entire database object through navigation.",
        "Ignoring the possibility that route parameters are strings or serialized values.",
      ],
      quiz: [
        {
          question: "Why type route parameters?",
          options: ["To catch invalid data shapes earlier", "To increase image resolution"],
          answer: "To catch invalid data shapes earlier",
        },
      ],
    },
    {
      id: "rn5-modals",
      title: "Route-based modals vs Modal components",
      durationMinutes: 5,
      explanation: `A modal can be represented as part of navigation or displayed directly with React Native's <code>Modal</code> component.

A <b>route-based modal</b> is useful when the modal is a real destination with its own URL/deep-link semantics or navigation behavior. A <b>Modal component</b> is useful for temporary UI such as a small confirmation or picker that does not need to become a navigation destination.`,
      diagram: `Modal decision

Is it a destination?
       |
   +---+---+
   |       |
  yes      no
   |       |
route     Modal
modal     component`,
      codeExample: `// Route-based concept
app/
  _layout.tsx
  settings.tsx
  edit-profile.tsx

// Component modal
<Modal visible={visible} transparent>
  <Confirmation />
</Modal>`,
      keyTakeaways: [
        "Not every temporary overlay needs to become a route.",
        "Use route-based modals when navigation/deep linking semantics matter.",
        "Use Modal for local temporary UI.",
      ],
      commonMistakes: [
        "Using navigation for every tiny popup.",
        "Using a local Modal when the UI really represents a navigable destination.",
      ],
      quiz: [
        {
          question: "When is a route-based modal especially useful?",
          options: ["When it is a real destination", "For every tooltip"],
          answer: "When it is a real destination",
        },
      ],
    },
    {
      id: "rn5-deep-links",
      title: "Deep linking and universal links",
      durationMinutes: 7,
      explanation: `<b>Deep linking</b> opens a specific screen from an external URL or application event. A notification might open a message detail screen, for example.

On iOS, universal links connect normal HTTPS URLs to an installed application. Android has its own app-linking mechanisms. The important architecture is: external URL → route resolution → specific screen → validated parameters.`,
      diagram: `https://example.com/messages/123
             |
             v
       OS link handling
             |
             v
        React Native
             |
             v
      route /messages/123
             |
             v
       Message detail`,
      codeExample: `// Example route
app/
  messages/
    [id].tsx

// External URL:
// https://example.com/messages/123
//
// Route receives id = "123"`,
      keyTakeaways: [
        "Deep links can open a specific screen directly.",
        "Universal links use HTTPS URLs associated with the application.",
        "Always validate route parameters before using them.",
      ],
      commonMistakes: [
        "Assuming every incoming URL is trusted.",
        "Handling a deep link only when the app is already open.",
      ],
      quiz: [
        {
          question: "What is the main purpose of a deep link?",
          options: ["Open a specific application destination", "Change the device font"],
          answer: "Open a specific application destination",
        },
      ],
    },
    {
      id: "rn5-state-persistence",
      title: "Navigation state persistence",
      durationMinutes: 5,
      explanation: `Navigation state can sometimes be persisted so users can return to the part of an application they were using after a restart.

Persistence should be treated as recoverable state, not permanent truth. Routes may change between releases, authentication may expire, and stored navigation state may no longer be valid.`,
      diagram: `Navigation state
      |
      v
serialize
      |
      v
persistent storage
      |
    restart
      |
      v
restore + validate
      |
      v
current navigation tree`,
      codeExample: `// Conceptual flow
const savedState = await storage.getItem("navigation-state");

if (savedState) {
  const parsed = JSON.parse(savedState);
  // Validate before restoring.
}`,
      keyTakeaways: [
        "Persisted navigation state can improve continuity.",
        "Stored navigation state can become stale or invalid.",
        "Restore only after validation and current-app checks.",
      ],
      commonMistakes: [
        "Treating persisted navigation state as guaranteed valid.",
      ],
      quiz: [
        {
          question: "Should persisted navigation state always be trusted?",
          options: ["Yes", "No"],
          answer: "No",
        },
      ],
    },
    {
      id: "rn5-headers",
      title: "Headers and platform-specific behavior",
      durationMinutes: 3,
      explanation: `Navigation headers can be customized, hidden, or configured differently for different screens. Platform conventions can differ, so a header that looks correct on one platform should be tested on the other.

Keep navigation configuration close to the route or navigator that owns it, rather than scattering header decisions throughout unrelated components.`,
      diagram: `Navigator
   |
   +-- screen options
        |
        +-- title
        +-- header visibility
        +-- custom header
        +-- platform-specific behavior`,
      codeExample: `import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Home" }}
      />
      <Stack.Screen
        name="details"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}`,
      keyTakeaways: [
        "Headers are part of navigation configuration.",
        "Headers can be customized or hidden per screen.",
        "Test platform-specific navigation behavior on both platforms.",
      ],
      commonMistakes: [
        "Building a completely custom header before understanding native navigator behavior.",
      ],
      quiz: [
        {
          question: "Where should screen-specific header options usually live?",
          options: ["In the owning navigator/route configuration", "In unrelated API clients"],
          answer: "In the owning navigator/route configuration",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is Expo Router's routing model?",
      options: ["File-based routing", "Database-based routing"],
      answer: "File-based routing",
    },
    {
      question: "What library is underneath Expo Router?",
      options: ["React Navigation", "Express"],
      answer: "React Navigation",
    },
    {
      question: "Which navigator models hierarchical screen history?",
      options: ["Stack", "Tab"],
      answer: "Stack",
    },
    {
      question: "What should be validated when restoring persisted navigation state?",
      options: ["The stored state is still valid for the current app", "Only the screen color"],
      answer: "The stored state is still valid for the current app",
    },
  ],
  project: {
    name: "Deep-linkable tab application",
    goal: "Build a small multi-screen application with nested navigation, typed parameters, a modal destination, and a deep link.",
    brief: "Create a tab-based application where one tab contains a stack. Add a detail screen with a typed route parameter and configure a deep link that opens a screen three levels deep.",
    steps: [
      "Create the root navigation structure with tabs.",
      "Give one tab its own stack.",
      "Add a list screen, detail screen, and nested sub-detail screen.",
      "Use typed route parameters for the detail ID.",
      "Add a route-based modal for editing.",
      "Configure a deep link to the nested screen.",
      "Test the link from a cold app launch and while the app is already running.",
    ],
    acceptance: [
      "The application has tabs.",
      "One tab opens a nested stack.",
      "Route parameters are typed.",
      "The modal can be represented as a navigation destination.",
      "A deep link opens the intended screen three levels deep.",
      "Navigation behavior is tested after a fresh application launch.",
    ],
    stretch: [
      "Persist navigation state across app restarts.",
      "Add platform-specific header configuration.",
      "Add a notification-like entry point that opens the same deep-linked screen.",
    ],
  },
});
