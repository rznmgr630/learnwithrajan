export interface ReactNativeFinalQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

function question(
  prompt: string,
  correct: string,
  distractors: [string, string, string],
  correctIndex: number,
  explanation: string,
): ReactNativeFinalQuizQuestion {
  const options = [...distractors];
  options.splice(correctIndex, 0, correct);
  return { question: prompt, options, correctIndex, explanation };
}

export const REACT_NATIVE_DAY_3_FINAL_QUIZ = [
  question("Which component is the basic layout container in React Native?", "View", ["Text", "Image", "Modal"], 2, "View is the basic container used to group and lay out React Native UI."),
  question("Which component must wrap normal text content?", "Text", ["View", "ScrollView", "Image"], 0, "React Native text must be rendered inside a Text component."),
  question("Which component handles press interactions and exposes pressed state?", "Pressable", ["Image", "StatusBar", "SectionList"], 3, "Pressable handles touch interactions and can expose whether it is currently pressed."),
  question("What is React Native's default Flexbox direction?", "column", ["row", "grid", "inline"], 1, "React Native lays children out vertically by default because flexDirection defaults to column."),
  question("Which hook responds when the available window size changes?", "useWindowDimensions", ["useColorScheme", "useEffect", "useRoute"], 1, "useWindowDimensions returns current window dimensions and updates when they change."),
  question("Why should a large data collection usually avoid ScrollView?", "ScrollView renders all children at once", ["ScrollView cannot contain Text", "ScrollView works only on iOS", "ScrollView disables Flexbox"], 3, "ScrollView mounts all of its children, which can be expensive for large collections."),
  question("What problem does safe-area handling prevent?", "Important UI overlapping system-controlled areas", ["JavaScript type errors", "Slow database queries", "Missing route parameters"], 0, "Safe-area handling keeps important content clear of status bars, notches, and navigation areas."),
  question("Which API selects values based on iOS or Android?", "Platform.select", ["StyleSheet.create", "useState", "FlatList"], 2, "Platform.select chooses a value for the active platform."),
  question("Which component displays an image from a local file or URI?", "Image", ["Text", "View", "Pressable"], 3, "Image renders local and remote image sources."),
  question("When should a modal often become a navigation destination?", "When it needs route or deep-link semantics", ["Whenever it contains text", "Whenever it has a background color", "Whenever it uses Flexbox"], 1, "A navigation modal is appropriate when the interface is a meaningful route or deep-link destination."),
];

export const REACT_NATIVE_DAY_4_FINAL_QUIZ = [
  question("Is StyleSheet.create required for React Native styling?", "No", ["Yes", "Only on Android", "Only with Expo"], 2, "StyleSheet.create is an organization tool, not a requirement."),
  question("Which React Native style property is written correctly?", "backgroundColor", ["background-color", "background_color", "BackgroundColor"], 0, "React Native style properties use JavaScript camelCase names."),
  question("What is the main benefit of named styles?", "They improve organization and reuse", ["They create browser CSS files", "They enable CSS selectors", "They remove JavaScript"], 3, "Named styles make larger components easier to read, reuse, and maintain."),
  question("How should pressed-state styling commonly be implemented?", "With Pressable's pressed state", ["With :active CSS", "With a CSS selector", "With an HTML class"], 1, "Pressable exposes interaction state without browser pseudo-classes."),
  question("What is a design token?", "A named design value", ["A navigation screen", "A React component", "A database row"], 1, "Design tokens name reusable decisions such as colors, spacing, and radii."),
  question("Which hook reads the system light or dark preference?", "useColorScheme", ["useWindowDimensions", "useFonts", "useRouter"], 3, "useColorScheme reports the current system color scheme."),
  question("Which hook provides the current window width?", "useWindowDimensions", ["useColorScheme", "useLayout", "useViewport"], 0, "useWindowDimensions provides responsive window measurements."),
  question("Which property is especially important for Android shadows?", "elevation", ["shadowRadius", "boxShadow", "filter"], 2, "Android commonly uses elevation for its native shadow model."),
  question("Why should the main UI wait for custom fonts?", "To avoid a flash of fallback text", ["To enable navigation", "To create route parameters", "To start Metro"], 3, "Waiting prevents text from visibly switching from a fallback font to the intended font."),
  question("What does an inset represent in an edge-to-edge layout?", "Space needed around system UI", ["A font family", "A database index", "A component prop type"], 1, "Insets describe space needed to keep content clear of system-controlled areas."),
];

export const REACT_NATIVE_DAY_5_FINAL_QUIZ = [
  question("What routing model does Expo Router use?", "File-based routing", ["Database routing", "CSS routing", "Server-only routing"], 2, "Expo Router maps files and folders to application routes."),
  question("Which library powers Expo Router underneath?", "React Navigation", ["Express", "Redux", "Next.js"], 0, "Expo Router builds its file-based experience on React Navigation."),
  question("Which navigator models hierarchical screen history?", "Stack", ["Tab", "Drawer", "Modal component"], 3, "A stack pushes screens on top of previous screens and supports back navigation."),
  question("What are tabs best suited for?", "Major application sections", ["Every detail screen", "Database tables", "Font loading"], 1, "Tabs provide persistent access to major areas of an application."),
  question("What does [id].tsx represent?", "A dynamic route parameter", ["A fixed CSS class", "A database file", "An Android-only screen"], 1, "Square brackets identify a dynamic segment in Expo Router."),
  question("Why should route parameters still be validated?", "A typed string can still contain an invalid value", ["TypeScript disables navigation", "Parameters are always numbers", "Validation creates routes"], 3, "Type safety describes the value's shape, while validation checks whether its content is acceptable."),
  question("When is a route-based modal useful?", "When the modal is a navigation destination", ["When it only changes color", "When it contains one Text", "When it has no route meaning"], 0, "Route-based modals fit interfaces that belong in navigation history or deep links."),
  question("What does a deep link do?", "Opens a specific destination inside the app", ["Only opens the home screen", "Creates a StyleSheet", "Loads a custom font"], 2, "Deep links take users directly to a particular route."),
  question("What should happen before persisted navigation state is restored?", "The saved state should be validated", ["Every route should be deleted", "The app should disable Back", "The theme should reset"], 3, "Stored routes can become outdated, so saved state must be validated first."),
  question("Why test navigation on both iOS and Android?", "Platform conventions and behavior can differ", ["React works only on iOS", "Android has no headers", "Expo Router has different file names"], 1, "Headers, gestures, transitions, and system behavior can differ by platform."),
];

export const REACT_NATIVE_DAY_6_FINAL_QUIZ = [
  question("Which component is designed for a virtualized one-dimensional list?", "FlatList", ["View", "Text", "Modal"], 2, "FlatList renders a useful window of list items instead of mounting the whole collection."),
  question("When is SectionList useful?", "When items are organized into groups", ["When displaying one image", "When loading a font", "When changing themes"], 0, "SectionList adds grouped data and section headers to a virtualized list."),
  question("Which prop gives list items stable identities?", "keyExtractor", ["onEndReached", "refreshing", "renderSectionHeader"], 3, "keyExtractor returns the stable key React uses to track each item."),
  question("What is virtualization?", "Keeping only a useful window of UI mounted", ["Encrypting list data", "Converting JavaScript to CSS", "Saving every item to storage"], 1, "Virtualization reduces active UI work by mounting only the needed list window."),
  question("When does this track recommend FlashList?", "When the list is larger than a screenful", ["For every single Text", "Only for empty lists", "Only on iOS"], 1, "FlashList is the track's preferred default once a list grows beyond roughly one screenful."),
  question("What is pagination?", "Loading a large dataset in smaller batches", ["Animating every row", "Changing app themes", "Creating native modules"], 3, "Pagination divides large datasets into smaller pages or batches."),
  question("What should prevent duplicate onEndReached requests?", "Loading and has-more guards", ["A larger font", "A Modal", "A route group"], 0, "The loader should stop when a request is active or no more pages remain."),
  question("What state applies when a request succeeds with zero items?", "Empty", ["Error", "Loading forever", "Crashed"], 2, "An empty state means the request succeeded but returned no content."),
  question("What can make a virtualized list slow?", "Expensive item components and images", ["Stable IDs", "Using TypeScript", "Having a list title"], 3, "Virtualization cannot remove expensive rendering, image, or calculation work inside each row."),
  question("What should happen before optimizing list performance?", "Measure with realistic data and devices", ["Add memo everywhere", "Assume 60 FPS", "Remove every image"], 1, "Profiling with realistic workloads identifies the actual bottleneck."),
];
