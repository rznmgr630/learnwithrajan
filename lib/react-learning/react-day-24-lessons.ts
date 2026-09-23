import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_24_LESSONS: LessonDay = {
  day: 24,
  title: "TypeScript for React",
  totalMinutes: 60,
  difficulty: "Beginner",
  lessons: [
    {
      id: "react-day-24-lesson-1",
      title: "Typed Component Props",
      durationMinutes: 12,
      explanation: `TypeScript makes component contracts explicit. Props should describe what a component accepts and, when useful, which combinations are valid. Union types are especially useful for variants because they prevent invalid values while keeping the API readable.`,
      diagram: `ButtonProps
├── variant: "primary" | "secondary"
├── disabled?: boolean
└── children: ReactNode`,
      codeExample: {
        title: "Typed component props",
        code: `type ButtonProps = {
  variant: "primary" | "secondary";
  disabled?: boolean;
  children: React.ReactNode;
};

function Button({ variant, disabled = false, children }: ButtonProps) {
  return (
    <button disabled={disabled} data-variant={variant}>
      {children}
    </button>
  );
}`,
      },
      keyTakeaways: ["Props are a public contract.", "Literal unions prevent unsupported variants.", "Optional props should have sensible defaults."],
      commonMistakes: ["Using string for every variant.", "Making every prop optional.", "Using any to avoid type errors."],
      quiz: [
        {
          question: "What does a literal union provide?",
          options: ["A fixed set of allowed values", "A database schema", "A CSS reset", "A runtime API call"],
          correctIndex: 0,
          explanation: "Literal unions constrain values such as button variants.",
        },
      ],
    },
    {
      id: "react-day-24-lesson-2",
      title: "Generics for Reusable Components",
      durationMinutes: 12,
      explanation: `Generics let a component preserve the type of the data it receives. A generic List<T> can accept strings, users, projects, or any other item type while keeping the render function correctly typed. This avoids copying nearly identical components for each data type.`,
      diagram: `List<T>
 ↓
items: T[]
render: (item: T) => ReactNode
 ↓
List<User>
List<Project>`,
      codeExample: {
        title: "Generic List",
        code: `type ListProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
};

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}`,
      },
      keyTakeaways: ["Generics preserve relationships between inputs and outputs.", "A generic component can support many data types.", "Use stable domain keys in real lists."],
      commonMistakes: ["Adding generics where a simple type is enough.", "Losing the generic by casting to any.", "Using array indexes as keys for reorderable data."],
      quiz: [
        {
          question: "What is the main benefit of List<T>?",
          options: ["It preserves the item type across the component API", "It removes React", "It makes all values strings", "It disables checking"],
          correctIndex: 0,
          explanation: "The generic keeps the item type connected to renderItem.",
        },
      ],
    },
    {
      id: "react-day-24-lesson-3",
      title: "Discriminated Unions",
      durationMinutes: 12,
      explanation: `A discriminated union models related states using a shared literal property such as status. TypeScript can narrow the state after checking that discriminator. This is ideal for async UI because loading, success, and error states often have different available data.`,
      diagram: `AsyncState<T>
├── status: "loading"
├── status: "success" + data
└── status: "error" + message`,
      codeExample: {
        title: "Async state union",
        code: `type AsyncState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

function Message({ state }: { state: AsyncState<string> }) {
  if (state.status === "success") return <p>{state.data}</p>;
  if (state.status === "error") return <p>{state.message}</p>;
  return <p>Loading…</p>;
}`,
      },
      keyTakeaways: ["Discriminators enable safe narrowing.", "Each state can carry only the data it needs.", "Unions model state combinations explicitly."],
      commonMistakes: ["Making every property optional instead of modeling states.", "Accessing data before checking status.", "Using boolean flags that allow impossible combinations."],
      quiz: [
        {
          question: "What is the discriminator in the example?",
          options: ["status", "data", "message", "T"],
          correctIndex: 0,
          explanation: "status tells TypeScript which union member is active.",
        },
      ],
    },
    {
      id: "react-day-24-lesson-4",
      title: "Typed Events, Refs, and Children",
      durationMinutes: 12,
      explanation: `React events and refs can be typed precisely. For inputs, React.ChangeEvent<HTMLInputElement> describes the event. useRef<HTMLInputElement | null> describes a DOM reference. React.ReactNode is useful for children because children can contain text, elements, fragments, and more.`,
      diagram: `input event
  ↓
ChangeEvent<HTMLInputElement>

useRef
  ↓
HTMLInputElement | null`,
      codeExample: {
        title: "Typed input and ref",
        code: `import { useRef, type ChangeEvent } from "react";

function SearchBox() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
  }

  return <input ref={inputRef} onChange={handleChange} />;
}`,
      },
      keyTakeaways: ["Type the event target precisely.", "Refs to DOM nodes can be null initially.", "ReactNode is broad enough for normal children content."],
      commonMistakes: ["Using any for events.", "Assuming refs are never null.", "Using HTML element types that do not match the actual element."],
      quiz: [
        {
          question: "What type fits an input change event?",
          options: ["ChangeEvent<HTMLInputElement>", "MouseEvent<HTMLDivElement>", "string", "EventTargetOnly"],
          correctIndex: 0,
          explanation: "ChangeEvent<HTMLInputElement> describes changes from an input element.",
        },
      ],
    },
    {
      id: "react-day-24-lesson-5",
      title: "Strict TypeScript and Avoiding any",
      durationMinutes: 12,
      explanation: `Strict TypeScript catches more mistakes early. unknown is safer than any when you truly do not know a value because it forces you to narrow or validate it before use. In React applications, strong types are especially useful at boundaries such as API data, component props, forms, state, and reusable components.`,
      diagram: `unknown
  ↓ validate / narrow
known type
  ↓
safe usage

any
  ↓
bypasses checking`,
      codeExample: {
        title: "Unknown instead of any",
        code: `function parseValue(value: unknown) {
  if (typeof value === "string") {
    return value.trim();
  }

  return String(value);
}`,
      },
      keyTakeaways: ["Prefer strict checking.", "Use unknown at uncertain boundaries.", "Validate external data before trusting its shape."],
      commonMistakes: ["Using any to silence errors.", "Casting external data without validation.", "Disabling strict mode to make code compile."],
      quiz: [
        {
          question: "Why is unknown safer than any?",
          options: ["It requires narrowing before unsafe use", "It disables checking", "It converts values to strings", "It is always a number"],
          correctIndex: 0,
          explanation: "unknown prevents arbitrary operations until the value is narrowed.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is a good type for React children?",
      options: ["React.ReactNode", "number only", "string only", "any"],
      correctIndex: 0,
      explanation: "ReactNode represents common renderable React content.",
    },
    {
      question: "What does a discriminated union help with?",
      options: ["Safe state narrowing", "CSS compilation", "HTTP caching", "Image compression"],
      correctIndex: 0,
      explanation: "A discriminator lets TypeScript narrow union members.",
    },
    {
      question: "What does a generic preserve?",
      options: ["Type relationships", "CSS variables", "Network speed", "DOM layout"],
      correctIndex: 0,
      explanation: "Generics keep data types connected across an API.",
    },
    {
      question: "What should you prefer to any at uncertain boundaries?",
      options: ["unknown plus validation/narrowing", "Ignore the value", "Disable TypeScript", "Convert everything to string"],
      correctIndex: 0,
      explanation: "unknown keeps type checking active until the value is understood.",
    },
  ],
  project: {
    name: "Type-Safe Component Library",
    goal: "Build reusable React components with strong TypeScript APIs.",
    brief: "Create a small component library that uses literal unions, generics, discriminated unions, typed events, refs, and strict TypeScript.",
    steps: [
      "Create a Button with a literal-union variant prop.",
      "Create an Input with typed change events and a typed DOM ref.",
      "Create a generic List<T> component.",
      "Model async UI with AsyncState<T>.",
      "Build an AsyncStateView that safely narrows each state.",
      "Enable strict TypeScript and remove unnecessary any usage.",
      "Keep public component APIs small and explicit.",
    ],
    acceptance: [
      "Invalid button variants are rejected by TypeScript.",
      "List<T> preserves the item type.",
      "AsyncState narrows safely by status.",
      "Events and refs use precise types.",
      "The project passes strict TypeScript checking without unnecessary any.",
    ],
    stretch: [
      "Build a generic DataTable.",
      "Explore polymorphic component typing.",
      "Create a small locally shared component package.",
    ],
  },
};
