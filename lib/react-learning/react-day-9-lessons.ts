import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_9_LESSONS: LessonDay = {
  day: 9,
  title: "Context and Shared State",
  totalMinutes: 60,
  difficulty: "Beginner",
  lessons: [
    {
      id: "r9-context",
      title: "Why Context exists",
      durationMinutes: 12,
      explanation: `
Sometimes many components need the same value.

<b>Prop drilling</b> means passing props through intermediate components only so a deeper component can receive them.

<b>Context</b> lets a component read a value provided by a parent context provider without manually passing it through every intermediate component.

Context is useful for values shared across a component subtree. It is not automatically a replacement for every state-management solution.
      `,
      diagram: `
App
 │
 ↓
Layout
 │
 ↓
Sidebar
 │
 ↓
Profile
 │
 └── reads Context
      `,
      codeExample: {
        title: "Creating context",
        code: `
import { createContext, useContext } from "react";

const ThemeContext = createContext<"light" | "dark">("light");

function ThemeLabel() {
  const theme = useContext(ThemeContext);
  return <p>Theme: {theme}</p>;
}
        `,
      },
      keyTakeaways: [
        "Context provides values to components in a subtree.",
        "Context can avoid unnecessary prop drilling.",
        "useContext reads the nearest matching provider value.",
        "Context is not a replacement for every kind of state.",
      ],
      commonMistakes: [
        "Putting every application value into Context.",
        "Using Context just because props exist.",
        "Forgetting that consumers must be under the provider.",
      ],
      quiz: [
        {
          question: "What problem can Context help solve?",
          options: [
            "Prop drilling",
            "CSS specificity",
            "Database indexing",
            "HTTP caching",
          ],
          correctIndex: 0,
          explanation: "Context can avoid passing shared values through intermediate components.",
        },
        {
          question: "What Hook reads Context?",
          options: ["useContext", "useMemo", "useId", "useRef"],
          correctIndex: 0,
          explanation: "useContext reads the current context value.",
        },
      ],
    },
    {
      id: "r9-provider",
      title: "Creating and providing context",
      durationMinutes: 12,
      explanation: `
A context usually has three parts:

1. Create the context.
2. Provide a value above components that need it.
3. Read the value with useContext.

A <b>provider</b> is the boundary that makes a context value available to descendants.

Keep the provider near the part of the tree that actually needs the shared value.
      `,
      diagram: `
ThemeProvider
    │
    ├── Header
    ├── Sidebar
    └── Profile
          │
          └── useContext()
      `,
      codeExample: {
        title: "Providing a theme",
        code: `
import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<Theme>("light");

function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value="dark">
      {children}
    </ThemeContext.Provider>
  );
}

function Page() {
  const theme = useContext(ThemeContext);
  return <main data-theme={theme}>Profile</main>;
}
        `,
      },
      keyTakeaways: [
        "A provider makes a context value available to descendants.",
        "Provider scope should match the feature that needs the value.",
        "useContext reads the nearest provider value.",
        "Context can be strongly typed with TypeScript.",
      ],
      commonMistakes: [
        "Wrapping the entire app when only one feature needs the context.",
        "Using unsafe undefined context values.",
        "Creating duplicate contexts for the same concept.",
      ],
      quiz: [
        {
          question: "What does a provider do?",
          options: [
            "Makes a context value available to descendants",
            "Creates a database",
            "Starts an HTTP server",
            "Changes browser history",
          ],
          correctIndex: 0,
          explanation: "A provider establishes the value descendants can read.",
        },
        {
          question: "Who can read a provider's value?",
          options: [
            "Descendants under that provider",
            "Any browser tab",
            "Only the provider",
            "Only the root",
          ],
          correctIndex: 0,
          explanation: "Context values are available within the provider subtree.",
        },
      ],
    },
    {
      id: "r9-state",
      title: "Context with state",
      durationMinutes: 12,
      explanation: `
Context and state solve different parts of a problem.

State stores changing data. Context provides that data to components that need it.

A common pattern is:

<b>Provider owns state → Context exposes state and actions → descendants consume it</b>

For example, a ThemeProvider can own the current theme and expose a function for changing it.
      `,
      diagram: `
ThemeProvider
 ├── state(theme)
 │
 └── Context value
       ├── theme
       └── toggleTheme()
             │
             ↓
      Descendants
      `,
      codeExample: {
        title: "Context + state",
        code: `
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext =
  createContext<ThemeContextValue | null>(null);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  function toggleTheme() {
    setTheme((current) =>
      current === "light" ? "dark" : "light",
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return value;
}
        `,
      },
      keyTakeaways: [
        "State can live inside a context provider.",
        "A context value can expose both data and actions.",
        "A custom Hook can provide a cleaner consumer API.",
        "The provider becomes the owner of the shared state.",
      ],
      commonMistakes: [
        "Putting unrelated state into the same provider.",
        "Exposing unnecessary implementation details.",
        "Using nullable context without a clear runtime check.",
      ],
      quiz: [
        {
          question: "What can a Context + state pattern expose?",
          options: [
            "Shared state and related actions",
            "Only CSS",
            "Only server state",
            "Only static data",
          ],
          correctIndex: 0,
          explanation: "A provider can expose state and functions that operate on it.",
        },
        {
          question: "Why can a custom useTheme Hook help?",
          options: [
            "It centralizes context access and validation",
            "It removes React",
            "It prevents rendering",
            "It replaces TypeScript",
          ],
          correctIndex: 0,
          explanation: "A custom Hook can hide implementation details and validate provider usage.",
        },
      ],
    },
    {
      id: "r9-scope",
      title: "Choosing what belongs in Context",
      durationMinutes: 12,
      explanation: `
Context works best for values genuinely shared across a meaningful part of the component tree.

Common examples include theme, authenticated user information, locale, and feature-level settings.

Context is usually unnecessary for state used by one component, simple parent-child communication, temporary form input, or values that can easily be passed through a small tree.

Use the simplest communication mechanism that keeps data flow clear.
      `,
      diagram: `
One child needs value
       ↓
      props

Many descendants need value
       ↓
     Context
      `,
      codeExample: {
        title: "Keep local state local",
        code: `
import { useState } from "react";

function SearchBox() {
  const [query, setQuery] = useState("");

  return (
    <input
      value={query}
      onChange={(event) => setQuery(event.target.value)}
    />
  );
}
        `,
      },
      keyTakeaways: [
        "Context should solve a real sharing problem.",
        "Local state should stay local when possible.",
        "Props are often clearer for simple parent-child communication.",
        "Feature-level providers can keep shared state scoped.",
      ],
      commonMistakes: [
        "Creating global Context for every piece of state.",
        "Hiding simple data flow unnecessarily.",
        "Assuming Context automatically improves performance.",
      ],
      quiz: [
        {
          question: "When is Context useful?",
          options: [
            "When many descendants need the same value",
            "For every local input",
            "For every component prop",
            "Only for API requests",
          ],
          correctIndex: 0,
          explanation: "Context is useful when a value is shared across a subtree.",
        },
        {
          question: "Should every state value go into Context?",
          options: ["Yes", "No", "Only strings", "Only numbers"],
          correctIndex: 1,
          explanation: "Local state should remain local when it does not need sharing.",
        },
      ],
    },
    {
      id: "r9-design",
      title: "Context updates and provider design",
      durationMinutes: 12,
      explanation: `
When a context value changes, components that consume that context can render again.

Provider design therefore matters.

Avoid putting many unrelated, frequently changing values into one giant context. Focused contexts can make dependencies clearer.

Context should make sharing clearer, not become one global dumping ground for application state.
      `,
      diagram: `
Large AppContext
 ├── user
 ├── theme
 ├── search
 ├── modal
 └── settings

        ↓

Focused contexts

UserContext
ThemeContext
SettingsContext
      `,
      codeExample: {
        title: "Focused context",
        code: `
type User = {
  id: string;
  name: string;
};

type UserContextValue = {
  user: User | null;
  signOut: () => void;
};

// Authentication concerns can live here.
// Theme and unrelated state can have separate providers.
        `,
      },
      keyTakeaways: [
        "Consumers respond when the context value they use changes.",
        "Focused contexts can make dependencies clearer.",
        "Avoid turning one Context into a global dumping ground.",
        "Provider boundaries are part of component architecture.",
      ],
      commonMistakes: [
        "Creating one huge context for the whole application.",
        "Putting high-frequency unrelated state into one context.",
        "Assuming Context is always the best performance solution.",
      ],
      quiz: [
        {
          question: "Why can focused contexts be useful?",
          options: [
            "They separate unrelated concerns",
            "They remove all rendering",
            "They eliminate state",
            "They make CSS global",
          ],
          correctIndex: 0,
          explanation: "Focused contexts keep related shared state together.",
        },
        {
          question: "What is a poor Context design?",
          options: [
            "One huge context containing unrelated application state",
            "A focused ThemeContext",
            "A focused UserContext",
            "A feature-level provider",
          ],
          correctIndex: 0,
          explanation: "A giant context can hide dependencies and couple unrelated concerns.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What problem does Context commonly solve?",
      options: ["Prop drilling", "CSS specificity", "Database indexing", "HTTP status codes"],
      correctIndex: 0,
      explanation: "Context can avoid passing shared values through intermediate components.",
    },
    {
      question: "Which Hook reads Context?",
      options: ["useContext", "useState", "useEffect", "useMemo"],
      correctIndex: 0,
      explanation: "useContext reads the current context value.",
    },
    {
      question: "What does a provider do?",
      options: [
        "Makes a context value available to descendants",
        "Creates a server",
        "Writes CSS",
        "Fetches an API automatically",
      ],
      correctIndex: 0,
      explanation: "A provider supplies a value that descendants can consume.",
    },
    {
      question: "Can Context work together with useState?",
      options: ["Yes", "No", "Only with numbers", "Only on the server"],
      correctIndex: 0,
      explanation: "A provider can own state and expose it through Context.",
    },
    {
      question: "Which is a good candidate for Context?",
      options: [
        "Theme shared across many descendants",
        "One local input value",
        "A temporary loop variable",
        "One button's hover state",
      ],
      correctIndex: 0,
      explanation: "A shared theme is a common Context use case.",
    },
    {
      question: "Should all state go into Context?",
      options: ["Yes", "No", "Only strings", "Only objects"],
      correctIndex: 1,
      explanation: "Keep local state local when it does not need to be shared.",
    },
    {
      question: "Why use a custom context Hook?",
      options: [
        "To centralize context access and validation",
        "To replace React",
        "To remove components",
        "To avoid TypeScript",
      ],
      correctIndex: 0,
      explanation: "A custom Hook can expose a clean API and validate provider usage.",
    },
    {
      question: "What is a common Context design problem?",
      options: [
        "One giant context containing unrelated state",
        "A focused ThemeContext",
        "A feature-level provider",
        "A typed UserContext",
      ],
      correctIndex: 0,
      explanation: "A giant context can couple unrelated state.",
    },
  ],
  project: {
    name: "Theme and User Context",
    goal: "Build a small application using focused Context providers for shared theme and user information.",
    brief: "Create a dashboard with a theme switcher and user profile. Deeply nested components should consume shared values without prop drilling.",
    steps: [
      "Create a typed ThemeContext.",
      "Create a ThemeProvider with theme state and toggleTheme.",
      "Create a useTheme custom Hook.",
      "Create a typed UserContext with user and signOut.",
      "Create a UserProvider and useUser Hook.",
      "Build nested Header, Sidebar, Profile, and Settings components that consume the contexts.",
      "Keep unrelated local UI state outside Context.",
    ],
    acceptance: [
      "Deeply nested components can read the theme without receiving it as a prop.",
      "A child component can change the theme through Context.",
      "User information is available through UserContext.",
      "Context values and custom Hooks are correctly typed.",
      "Theme and user concerns use separate contexts.",
    ],
    stretch: [
      "Persist the selected theme to localStorage.",
      "Add a language context.",
      "Add login/logout simulation.",
      "Create an AppProviders component.",
    ],
  },
};
