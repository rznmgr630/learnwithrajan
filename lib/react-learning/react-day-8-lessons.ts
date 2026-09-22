import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_8_LESSONS: LessonDay = {
  day: 8,
  title: "useReducer and State Machines",
  totalMinutes: 60,
  difficulty: "Beginner",
  lessons: [
    {
      id: "r8-reducer",
      title: "Why useReducer exists",
      durationMinutes: 12,
      explanation: `
<b>useReducer</b> is a React Hook for managing state when state transitions (the rules that change state) are easier to describe as actions than as many independent setState calls.

A <b>reducer</b> is a pure function that receives the current state and an action, then returns the next state.

The basic model is:

<b>current state + action → reducer → next state</b>

useReducer is especially useful when several related state values change together or when a feature has many explicit transitions.
      `,
      diagram: `
Current State
     │
     │ dispatch(action)
     ↓
   Reducer
     │
     ↓
Next State
     │
     ↓
    UI
      `,
      codeExample: {
        title: "A simple reducer",
        code: `
import { useReducer } from "react";

type State = { count: number };

type Action =
  | { type: "increment" }
  | { type: "decrement" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
  }
}

export function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <section>
      <p>{state.count}</p>
      <button type="button" onClick={() => dispatch({ type: "increment" })}>
        +
      </button>
      <button type="button" onClick={() => dispatch({ type: "decrement" })}>
        -
      </button>
    </section>
  );
}
        `,
      },
      keyTakeaways: [
        "useReducer manages state through actions and a reducer.",
        "A reducer calculates the next state from current state and an action.",
        "dispatch sends an action to the reducer.",
        "useReducer is useful when state transitions have several related rules.",
      ],
      commonMistakes: [
        "Calling dispatch with a state value instead of an action.",
        "Mutating the existing state inside the reducer.",
        "Using useReducer for trivial state that useState already handles clearly.",
      ],
      quiz: [
        {
          question: "What does a reducer return?",
          options: ["The next state", "A React component", "A DOM node", "A Promise"],
          correctIndex: 0,
          explanation: "A reducer returns the next state.",
        },
        {
          question: "What does dispatch do?",
          options: [
            "Sends an action to the reducer",
            "Changes CSS",
            "Creates a component",
            "Fetches an API automatically",
          ],
          correctIndex: 0,
          explanation: "dispatch sends an action describing an event or transition.",
        },
      ],
    },
    {
      id: "r8-actions",
      title: "Designing actions and reducer state",
      durationMinutes: 12,
      explanation: `
An <b>action</b> describes what happened or what should happen. It can contain a <b>payload</b>, which is additional data required by the reducer.

In TypeScript, a discriminated union (a union identified by a common property such as type) is useful for action definitions.

Components should mainly describe events by dispatching actions. The reducer contains the state transition rules.
      `,
      diagram: `
User event
    │
    ↓
dispatch(action)
    │
    ↓
Reducer
    │
    ↓
New state
      `,
      codeExample: {
        title: "Typed actions",
        code: `
type Todo = {
  id: string;
  title: string;
};

type State = {
  todos: Todo[];
};

type Action =
  | { type: "add"; payload: Todo }
  | { type: "remove"; payload: { id: string } }
  | { type: "clear" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add":
      return { todos: [...state.todos, action.payload] };

    case "remove":
      return {
        todos: state.todos.filter(
          (todo) => todo.id !== action.payload.id,
        ),
      };

    case "clear":
      return { todos: [] };
  }
}
        `,
      },
      keyTakeaways: [
        "Actions describe events or requested state transitions.",
        "payload carries additional action data.",
        "Discriminated unions make action handling safer.",
        "Reducer cases should describe explicit state transitions.",
      ],
      commonMistakes: [
        "Using vague action types.",
        "Putting unrelated business logic into components.",
        "Putting unnecessary application state into action payloads.",
      ],
      quiz: [
        {
          question: "What is a payload?",
          options: [
            "Data carried by an action",
            "A CSS class",
            "A React Hook",
            "A component name",
          ],
          correctIndex: 0,
          explanation: "A payload contains additional data needed by an action.",
        },
        {
          question: "Why use a discriminated union for actions?",
          options: [
            "It lets TypeScript distinguish action variants",
            "It makes CSS faster",
            "It replaces React",
            "It creates API routes",
          ],
          correctIndex: 0,
          explanation: "The type field lets TypeScript narrow each action.",
        },
      ],
    },
    {
      id: "r8-immutable",
      title: "Immutable state updates",
      durationMinutes: 12,
      explanation: `
Reducers should not mutate existing state.

<b>Mutation</b> means changing an existing object or array in place.

Instead, create a new object or array containing the updated values.

For arrays, common patterns are:
- add → spread
- remove → filter
- transform → map

For objects, spread the old object and replace the changed property.
      `,
      diagram: `
Old state
   │
   │ reducer
   ↓
New object/array
   │
   ↓
Updated UI
      `,
      codeExample: {
        title: "Immutable updates",
        code: `
function addTodo(todos: string[], title: string): string[] {
  return [...todos, title];
}

function removeTodo(
  todos: string[],
  title: string,
): string[] {
  return todos.filter((todo) => todo !== title);
}

function setOnline(user: { name: string; online: boolean }) {
  return {
    ...user,
    online: true,
  };
}
        `,
      },
      keyTakeaways: [
        "Do not mutate reducer state directly.",
        "Create new objects and arrays for updates.",
        "Spread, map, and filter are common immutable update tools.",
        "Immutable updates make state transitions predictable.",
      ],
      commonMistakes: [
        "Using push() on a state array.",
        "Assigning directly to a state property.",
        "Mutating nested objects without creating required new references.",
      ],
      quiz: [
        {
          question: "Which is an immutable way to add an item?",
          options: [
            "todos.push(item)",
            "[...todos, item]",
            "todos.length = 0",
            "todos[0] = item",
          ],
          correctIndex: 1,
          explanation: "The spread expression creates a new array.",
        },
        {
          question: "What does mutation mean?",
          options: [
            "Changing an existing value in place",
            "Creating a new object",
            "Rendering JSX",
            "Dispatching an action",
          ],
          correctIndex: 0,
          explanation: "Mutation changes an existing object or array directly.",
        },
      ],
    },
    {
      id: "r8-machine",
      title: "Thinking in state machines",
      durationMinutes: 12,
      explanation: `
A <b>state machine</b> models a defined set of states and explicit transitions between them.

For example:

<code>idle → loading → success</code>

or:

<code>idle → loading → error</code>

This can be clearer than several unrelated booleans that allow invalid combinations.

useReducer is a natural fit because actions represent events and the reducer controls the transitions.
      `,
      diagram: `
             ┌──────────┐
             │   idle   │
             └────┬─────┘
                  │ FETCH
                  ↓
             ┌──────────┐
             │ loading  │
             └───┬───┬──┘
                 │   │
          SUCCESS│   │ERROR
                 ↓   ↓
             success error
      `,
      codeExample: {
        title: "Explicit request states",
        code: `
type RequestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; message: string };

type Action =
  | { type: "fetch" }
  | { type: "success"; data: string[] }
  | { type: "error"; message: string };

function reducer(
  state: RequestState,
  action: Action,
): RequestState {
  switch (action.type) {
    case "fetch":
      return { status: "loading" };
    case "success":
      return { status: "success", data: action.data };
    case "error":
      return { status: "error", message: action.message };
  }
}
        `,
      },
      keyTakeaways: [
        "A state machine defines explicit states and transitions.",
        "A status union can prevent invalid state combinations.",
        "Actions represent events that cause transitions.",
        "useReducer is useful for state with meaningful transitions.",
      ],
      commonMistakes: [
        "Representing mutually exclusive states with many booleans.",
        "Allowing every action in every state without considering transitions.",
        "Making a state machine more complicated than necessary.",
      ],
      quiz: [
        {
          question: "What does a state machine define?",
          options: [
            "States and allowed transitions",
            "Only CSS",
            "Database indexes",
            "HTTP headers",
          ],
          correctIndex: 0,
          explanation: "A state machine models states and the events that move between them.",
        },
        {
          question: "Why are explicit statuses useful?",
          options: [
            "They can prevent confusing combinations of state",
            "They remove TypeScript",
            "They replace the DOM",
            "They make requests synchronous",
          ],
          correctIndex: 0,
          explanation: "A single status can represent mutually exclusive states clearly.",
        },
      ],
    },
    {
      id: "r8-choice",
      title: "useReducer vs useState",
      durationMinutes: 12,
      explanation: `
useReducer is not a replacement for useState.

Use <b>useState</b> when state is simple and its update logic is straightforward.

Use <b>useReducer</b> when several values change together, many events affect the same state, or explicit transition rules make the feature easier to understand.

A useful question is:

<b>Would explicit actions and centralized transition rules make this state easier to understand?</b>

If not, useState may be clearer.
      `,
      diagram: `
Simple state
    ↓
 useState

Related transitions
    ↓
useReducer
      `,
      codeExample: {
        title: "Simple state should stay simple",
        code: `
import { useState } from "react";

export function SearchBox() {
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
        "useState and useReducer solve related but different problems.",
        "Simple state should stay simple.",
        "useReducer is useful when transitions become numerous or related.",
        "Reducers should remain pure.",
      ],
      commonMistakes: [
        "Using useReducer for every boolean or input.",
        "Assuming more code is automatically better.",
        "Putting API calls inside reducers.",
      ],
      quiz: [
        {
          question: "When is useState often better?",
          options: [
            "For simple state with straightforward updates",
            "For every complex workflow",
            "Only for API requests",
            "Never",
          ],
          correctIndex: 0,
          explanation: "Simple state is often clearer with useState.",
        },
        {
          question: "Should a reducer perform an API request?",
          options: [
            "Yes",
            "No, reducers should remain pure",
            "Only GET requests",
            "Only in production",
          ],
          correctIndex: 1,
          explanation: "Reducers should calculate state without side effects.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What does useReducer provide?",
      options: [
        "State, dispatch, and reducer-based transitions",
        "Only CSS",
        "Only routing",
        "Only API calls",
      ],
      correctIndex: 0,
      explanation: "useReducer manages state through a reducer and dispatch.",
    },
    {
      question: "What is a reducer?",
      options: [
        "A pure function that calculates next state",
        "A CSS component",
        "A browser API",
        "A database query",
      ],
      correctIndex: 0,
      explanation: "A reducer receives state and an action and returns next state.",
    },
    {
      question: "What does dispatch do?",
      options: [
        "Sends an action to the reducer",
        "Changes the DOM manually",
        "Creates a route",
        "Fetches data automatically",
      ],
      correctIndex: 0,
      explanation: "dispatch sends an action describing an event.",
    },
    {
      question: "What is a payload?",
      options: [
        "Additional data carried by an action",
        "A component",
        "A Hook",
        "A CSS selector",
      ],
      correctIndex: 0,
      explanation: "A payload contains data required by an action.",
    },
    {
      question: "Which is an immutable array update?",
      options: [
        "items.push(value)",
        "[...items, value]",
        "items[0] = value",
        "items.length = 0",
      ],
      correctIndex: 1,
      explanation: "Spread creates a new array.",
    },
    {
      question: "What does a state machine model?",
      options: [
        "States and transitions",
        "Only components",
        "Only database tables",
        "Only CSS",
      ],
      correctIndex: 0,
      explanation: "A state machine explicitly describes states and allowed transitions.",
    },
    {
      question: "Which is a good reason to use useReducer?",
      options: [
        "Many related state transitions need centralized rules",
        "Every boolean requires it",
        "It removes JavaScript",
        "It automatically handles APIs",
      ],
      correctIndex: 0,
      explanation: "useReducer is useful when state has several related transitions.",
    },
    {
      question: "Should a reducer perform API requests?",
      options: [
        "Yes",
        "No, reducers should remain pure",
        "Only GET requests",
        "Only in development",
      ],
      correctIndex: 1,
      explanation: "Reducers should calculate state without side effects.",
    },
  ],
  project: {
    name: "Request State Manager",
    goal: "Build a small dashboard that uses useReducer to model a predictable request workflow.",
    brief: "Create a request-state component with explicit <b>idle, loading, success, and error</b> states. Use a reducer and typed actions to control transitions.",
    steps: [
      "Create a RequestState union with idle, loading, success, and error states.",
      "Create typed actions for starting, succeeding, and failing a request.",
      "Create a reducer that handles each action.",
      "Use useReducer in the component.",
      "Add buttons that simulate loading, success, and error transitions.",
      "Render different UI for each request state.",
      "Keep the reducer pure.",
    ],
    acceptance: [
      "The component has explicit idle, loading, success, and error states.",
      "All reducer actions are typed.",
      "State transitions do not mutate existing state.",
      "The UI changes according to the current request status.",
      "The reducer contains no side effects.",
    ],
    stretch: [
      "Add a retry action.",
      "Store response data in the success state.",
      "Add a request counter.",
      "Replace simulated actions with a real API request.",
    ],
  },
};
