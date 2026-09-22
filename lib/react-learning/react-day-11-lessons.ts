import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_11_LESSONS: LessonDay = {
  day: 11,
  title: "Custom Hooks and Composition Patterns",
  totalMinutes: 60,
  difficulty: "Beginner",
  lessons: [
    {
      id: "r11-custom-hooks",
      title: "What a custom Hook really is",
      durationMinutes: 12,
      explanation: `
A <b>custom Hook</b> is simply a JavaScript or TypeScript function whose name starts with <code>use</code> and that can call other React Hooks.

There is no special magic involved.

For example, if three components all need the same logic for tracking a browser window's width, you can move that logic into a reusable <code>useWindowWidth()</code> Hook.

The important distinction is:

<b>Custom Hooks share logic, not state.</b>

If two components call the same custom Hook, each component gets its own Hook state.
      `,
      diagram: `
Component A ──→ useWindowWidth()
                    │
                    └── its own Hook state

Component B ──→ useWindowWidth()
                    │
                    └── its own Hook state

Same logic
Different state
      `,
      codeExample: {
        title: "A simple custom Hook",
        code: `
import { useState } from "react";

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  function toggle() {
    setValue((current) => !current);
  }

  return [value, toggle] as const;
}

export function Menu() {
  const [open, toggle] = useToggle();

  return (
    <button type="button" onClick={toggle}>
      {open ? "Close" : "Open"}
    </button>
  );
}
        `,
      },
      keyTakeaways: [
        "A custom Hook is a function that can call other Hooks.",
        "Custom Hook names should start with use.",
        "Custom Hooks extract reusable stateful logic.",
        "Calling a custom Hook does not create shared state between components.",
      ],
      commonMistakes: [
        "Thinking a custom Hook automatically creates global state.",
        "Naming a Hook without the use prefix.",
        "Putting reusable UI markup inside a Hook instead of extracting logic.",
      ],
      quiz: [
        {
          question: "What is a custom Hook?",
          options: [
            "A function that can call React Hooks",
            "A special React component",
            "A CSS utility",
            "A database function",
          ],
          correctIndex: 0,
          explanation: "A custom Hook is a function used to reuse Hook-based logic.",
        },
        {
          question: "Do two components calling the same custom Hook automatically share state?",
          options: ["Yes", "No", "Only in production", "Only with TypeScript"],
          correctIndex: 1,
          explanation: "Each component gets its own Hook state. The logic is shared, not the state.",
        },
      ],
    },
    {
      id: "r11-reusable-hooks",
      title: "Building reusable Hooks",
      durationMinutes: 12,
      explanation: `
A good custom Hook hides implementation details and exposes a small API (the values and functions its caller needs).

Common examples include:

- <code>useToggle</code> — boolean state and a toggle function
- <code>useDebounce</code> — delay a rapidly changing value
- <code>useLocalStorage</code> — synchronize state with localStorage
- <code>useMediaQuery</code> — react to a CSS media query

The Hook should focus on one reusable piece of behavior rather than becoming a giant utility that does everything.
      `,
      diagram: `
Component
   │
   ↓
Custom Hook
   │
   ├── React state
   ├── Effects
   ├── Browser APIs
   └── reusable logic
   │
   ↓
Small returned API
      `,
      codeExample: {
        title: "useDebounce",
        code: `
import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delayMs: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debouncedValue;
}

export function Search({ query }: { query: string }) {
  const debouncedQuery = useDebounce(query, 300);

  return <p>Searching for: {debouncedQuery}</p>;
}
        `,
      },
      keyTakeaways: [
        "A custom Hook should usually have one clear responsibility.",
        "Return only the values and functions the component needs.",
        "Generic Hooks can work with different TypeScript types.",
        "A Hook can compose other Hooks such as useState and useEffect.",
      ],
      commonMistakes: [
        "Creating a custom Hook that contains unrelated features.",
        "Returning implementation details that callers do not need.",
        "Forgetting cleanup when the Hook creates timers or subscriptions.",
      ],
      quiz: [
        {
          question: "What is a good custom Hook API?",
          options: [
            "A small set of useful values and functions",
            "Every internal variable",
            "The entire component",
            "Only JSX",
          ],
          correctIndex: 0,
          explanation: "A small API keeps the Hook easy to understand and reuse.",
        },
        {
          question: "Why does useDebounce clean up its timer?",
          options: [
            "To prevent an old timer from updating state after it is no longer needed",
            "To make CSS faster",
            "To create shared state",
            "To prevent TypeScript errors",
          ],
          correctIndex: 0,
          explanation: "Cleanup prevents stale timers from continuing after dependencies change or the component unmounts.",
        },
      ],
    },
    {
      id: "r11-return-shape",
      title: "Returning tuples vs objects",
      durationMinutes: 10,
      explanation: `
A custom Hook can return a tuple (an ordered collection of values) or an object.

A tuple is useful when the returned values have a simple, familiar relationship, such as <code>[value, setValue]</code>.

An object is often clearer when a Hook returns several values with different meanings.

Choose the return shape based on readability for the caller.
      `,
      diagram: `
useToggle()
   │
   ├── tuple → [value, toggle]
   │
   └── object → { value, toggle, reset }

Choose the shape that makes
the caller easiest to understand.
      `,
      codeExample: {
        title: "Tuple and object APIs",
        code: `
function useToggleTuple(initial = false) {
  // return [value, toggle]
}

function useToggleObject(initial = false) {
  // return { value, toggle, reset }
}

// Tuple:
const [open, toggle] = useToggleTuple();

// Object:
const { value: open, toggle, reset } = useToggleObject();
        `,
      },
      keyTakeaways: [
        "Tuples work well for small positional APIs.",
        "Objects make larger Hook APIs self-documenting.",
        "Choose based on how the Hook will be consumed.",
        "Consistent naming makes custom Hooks easier to use.",
      ],
      commonMistakes: [
        "Returning a long tuple whose positions are hard to remember.",
        "Using an object with vague property names.",
        "Choosing a return shape without considering the caller.",
      ],
      quiz: [
        {
          question: "When is a tuple often a good choice?",
          options: [
            "For a small, familiar set of ordered values",
            "For ten unrelated values",
            "Only for API responses",
            "Only for components",
          ],
          correctIndex: 0,
          explanation: "Small positional APIs such as value/toggle can be concise as tuples.",
        },
        {
          question: "What is an advantage of returning an object?",
          options: [
            "Named properties make larger APIs clearer",
            "It prevents rendering",
            "It creates global state",
            "It removes TypeScript",
          ],
          correctIndex: 0,
          explanation: "Named properties make the meaning of each returned value explicit.",
        },
      ],
    },
    {
      id: "r11-compound",
      title: "Compound components",
      durationMinutes: 12,
      explanation: `
A <b>compound component</b> is a group of components designed to work together as one API.

For example:

<code>&lt;Tabs&gt;&lt;Tabs.Tab /&gt;&lt;/Tabs&gt;</code>

The parent component provides the shared behavior while child components provide the individual pieces of the UI.

This pattern can make complex components expressive for their consumers.
      `,
      diagram: `
<Tabs>
  │
  ├── <Tabs.List>
  │     ├── <Tabs.Tab>
  │     └── <Tabs.Tab>
  │
  └── <Tabs.Panel>

Parent owns shared behavior.
Children represent individual pieces.
      `,
      codeExample: {
        title: "Compound component API",
        code: `
type TabProps = {
  children: React.ReactNode;
};

function Tabs({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}

function Tab({ children }: TabProps) {
  return (
    <button type="button">
      {children}
    </button>
  );
}

Tabs.Tab = Tab;

export function Example() {
  return (
    <Tabs>
      <Tabs.Tab>Profile</Tabs.Tab>
      <Tabs.Tab>Settings</Tabs.Tab>
    </Tabs>
  );
}
        `,
      },
      keyTakeaways: [
        "Compound components form a coordinated component API.",
        "The parent can own shared behavior and state.",
        "Child components represent specific pieces of the UI.",
        "This pattern can make reusable components expressive.",
      ],
      commonMistakes: [
        "Building a compound API when a simple component would be clearer.",
        "Making child components depend on undocumented parent behavior.",
        "Adding complexity without a real reuse requirement.",
      ],
      quiz: [
        {
          question: "What is a compound component?",
          options: [
            "A group of components designed to work together",
            "A component with no props",
            "A browser API",
            "A custom CSS file",
          ],
          correctIndex: 0,
          explanation: "Compound components create a coordinated component API.",
        },
        {
          question: "Who commonly owns shared behavior in a compound component pattern?",
          options: [
            "The parent component",
            "Only CSS",
            "The browser",
            "The database",
          ],
          correctIndex: 0,
          explanation: "The parent commonly coordinates state and behavior for its child components.",
        },
      ],
    },
    {
      id: "r11-headless",
      title: "Headless components, render props, and slots",
      durationMinutes: 14,
      explanation: `
A <b>headless component</b> provides behavior or state without forcing a particular visual design. The caller controls the markup and styling.

A <b>render prop</b> is a function passed to a component so the component can provide data to the caller's rendering function. Hooks replaced many render-prop use cases because Hooks let logic be reused directly.

A <b>slot</b> is a named place where a caller can provide content, commonly through props such as <code>header</code> or <code>footer</code>.

Use these patterns when they improve composition. Do not use a pattern simply because it is available.
      `,
      diagram: `
Headless logic
      │
      ├── state
      ├── behavior
      └── accessibility logic
      │
      ↓
Caller controls
markup + styling
      `,
      codeExample: {
        title: "Headless-style component",
        code: `
type ToggleProps = {
  children: (value: {
    open: boolean;
    toggle: () => void;
  }) => React.ReactNode;
};

// The idea:
// <Toggle>
//   {({ open, toggle }) => (
//     <button onClick={toggle}>
//       {open ? "Close" : "Open"}
//     </button>
//   )}
// </Toggle>

// In modern React, a custom Hook often gives
// a simpler API for this same reusable behavior.
        `,
      },
      keyTakeaways: [
        "Headless components separate behavior from presentation.",
        "Render props pass reusable state or behavior into a rendering function.",
        "Hooks replaced many render-prop use cases.",
        "Named slot props can make component composition explicit.",
        "Choose the simplest composition pattern that fits the problem.",
      ],
      commonMistakes: [
        "Using render props when a custom Hook would be simpler.",
        "Creating headless abstractions without reusable behavior.",
        "Using many named slots when children composition is enough.",
      ],
      quiz: [
        {
          question: "What does headless mean in component design?",
          options: [
            "Behavior without forcing a visual presentation",
            "A component without JavaScript",
            "A component without state",
            "A server-only component",
          ],
          correctIndex: 0,
          explanation: "Headless components provide behavior while leaving presentation to the caller.",
        },
        {
          question: "What pattern did Hooks replace in many situations?",
          options: [
            "Render props",
            "HTML forms",
            "CSS selectors",
            "Array methods",
          ],
          correctIndex: 0,
          explanation: "Custom Hooks often provide a simpler way to reuse logic than render props.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is a custom Hook?",
      options: [
        "A function that can call other Hooks",
        "A CSS component",
        "A database query",
        "A special HTML element",
      ],
      correctIndex: 0,
      explanation: "Custom Hooks are functions for reusing Hook-based logic.",
    },
    {
      question: "Why must custom Hook names start with use?",
      options: [
        "It follows the Hook convention and lets Hook linting identify them",
        "It makes CSS work",
        "It creates shared state",
        "It is required by TypeScript",
      ],
      correctIndex: 0,
      explanation: "The naming convention lets React's Hook rules and lint tooling recognize Hook functions.",
    },
    {
      question: "Do custom Hooks automatically share state?",
      options: ["Yes", "No", "Only with Context", "Only in production"],
      correctIndex: 1,
      explanation: "Each component calling a Hook gets its own state.",
    },
    {
      question: "What is a good reason to create a custom Hook?",
      options: [
        "Several components share the same stateful logic",
        "A component has any state at all",
        "You want fewer files",
        "You want to avoid JSX",
      ],
      correctIndex: 0,
      explanation: "Custom Hooks are useful when stateful behavior is reused.",
    },
    {
      question: "When is a tuple a useful Hook return type?",
      options: [
        "For a small, familiar ordered API",
        "For many unrelated values",
        "Only for arrays from APIs",
        "Never",
      ],
      correctIndex: 0,
      explanation: "Small APIs such as value/toggle are often clear as tuples.",
    },
    {
      question: "What is a compound component?",
      options: [
        "A group of coordinated components forming one API",
        "A component with no children",
        "A CSS utility",
        "A browser API",
      ],
      correctIndex: 0,
      explanation: "Compound components are designed to work together.",
    },
    {
      question: "What is a headless component?",
      options: [
        "A behavior-focused component that leaves presentation to the caller",
        "A component without JavaScript",
        "A component without state",
        "A component that cannot render",
      ],
      correctIndex: 0,
      explanation: "Headless components separate behavior from visual presentation.",
    },
    {
      question: "When should you leave logic inline?",
      options: [
        "When it is simple and not meaningfully reused",
        "Never",
        "Only when using TypeScript",
        "Only in production",
      ],
      correctIndex: 0,
      explanation: "Not every small piece of logic needs an abstraction.",
    },
  ],
  project: {
    name: "Reusable Tabs and Hooks",
    goal: "Build a reusable tabs component and extract shared behavior into custom Hooks.",
    brief: "Create a small profile/settings interface that demonstrates custom Hooks, a compound component API, and composition. Keep the reusable logic separate from presentation.",
    steps: [
      "Create a useToggle Hook that returns a boolean and a toggle function.",
      "Create a useDebounce Hook that accepts a generic value and delay.",
      "Create a reusable Tabs component with a compound API such as Tabs, Tabs.List, Tabs.Tab, and Tabs.Panel.",
      "Keep the selected tab state inside the Tabs component.",
      "Allow the caller to provide the tab content and styling.",
      "Use the useToggle Hook for a collapsible profile section.",
      "Use useDebounce for a small settings/search input.",
      "Keep simple one-off logic inline instead of extracting every expression into a Hook.",
    ],
    acceptance: [
      "The custom Hooks follow the use... naming convention.",
      "The Hooks contain reusable logic rather than reusable JSX.",
      "Each component calling a custom Hook has independent Hook state.",
      "The Tabs API is composable and readable.",
      "The caller controls the visual presentation of the reusable behavior.",
      "The project does not create unnecessary abstractions.",
    ],
    stretch: [
      "Make the Tabs component keyboard accessible.",
      "Add a useLocalStorage Hook for remembering the selected tab.",
      "Add disabled tabs.",
      "Expose both controlled and uncontrolled Tabs modes.",
      "Experiment with a headless Tabs implementation where the caller controls all markup.",
    ],
  },
};
