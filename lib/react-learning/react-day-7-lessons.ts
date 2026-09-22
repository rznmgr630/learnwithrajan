import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_7_LESSONS: LessonDay = {
  day: 7,
  title: "Conditional Rendering, Lists, and UI States",
  totalMinutes: 60,
  difficulty: "Beginner",
  lessons: [
    {
      id: "r7-conditional",
      title: "Conditional rendering",
      durationMinutes: 12,
      explanation: `
<b>Conditional rendering</b> means showing different UI depending on data.

React uses normal JavaScript for many conditional rendering patterns.

Common patterns include:
- ternary expressions for two alternatives
- logical AND for showing something only when a condition is true
- early returns for larger component-level conditions
- regular if statements before returning JSX

For example:

<code>{isLoggedIn ? &lt;Dashboard /&gt; : &lt;Login /&gt;}</code>

The important principle is that the UI should be a predictable result of the current data.
      `,
      diagram: `
props / state
     ↓
condition
  ↙     ↘
true     false
 ↓         ↓
UI A      UI B
      `,
      codeExample: {
        title: "Conditional UI",
        code: `
type UserStatusProps = {
  isLoggedIn: boolean;
};

export function UserStatus({
  isLoggedIn,
}: UserStatusProps) {
  return (
    <section>
      {isLoggedIn ? (
        <p>Welcome back!</p>
      ) : (
        <p>Please sign in.</p>
      )}
    </section>
  );
}
        `,
      },
      keyTakeaways: [
        "Conditional rendering uses JavaScript logic to choose UI.",
        "Ternaries are useful for two clear alternatives.",
        "Logical AND is useful for rendering something only when a condition is true.",
        "Early returns are useful when an entire component should render a different result.",
      ],
      commonMistakes: [
        "Using deeply nested ternaries that are hard to read.",
        "Forgetting that 0 can appear when using certain && expressions.",
        "Putting complicated business logic directly inside JSX.",
      ],
      quiz: [
        {
          question: "Which operator is commonly used for two alternative UI branches?",
          options: ["Ternary ?", "Assignment =", "Optional chaining ?.", "Spread ..."],
          correctIndex: 0,
          explanation:
            "The ternary operator is useful when you need to choose between two UI results.",
        },
        {
          question: "What does {isAdmin && <AdminPanel />} mean?",
          options: [
            "Always render AdminPanel",
            "Render AdminPanel when isAdmin is truthy",
            "Never render AdminPanel",
            "Render only when isAdmin is a string",
          ],
          correctIndex: 1,
          explanation:
            "Logical AND evaluates the right-hand expression when the condition is truthy.",
        },
      ],
    },
    {
      id: "r7-empty-states",
      title: "Loading, empty, error, and success states",
      durationMinutes: 12,
      explanation: `
Real applications often have values that are temporarily unavailable.

Useful data states include:

<b>Loading</b> — data is being requested.

<b>Empty</b> — the request completed but there is no data.

<b>Error</b> — the request failed.

<b>Success</b> — data exists and can be displayed.

These states should be designed explicitly instead of leaving users with a blank screen.

For small components, you can use early returns or conditional expressions.

React can also render <code>null</code> when a component should render nothing.
      `,
      diagram: `
Data state
   │
   ├── loading → Loading UI
   ├── error   → Error UI
   ├── empty   → Empty UI
   └── success → Content UI
      `,
      codeExample: {
        title: "An empty state",
        code: `
type SkillListProps = {
  skills: string[];
};

export function SkillList({ skills }: SkillListProps) {
  if (skills.length === 0) {
    return <p>No skills added yet.</p>;
  }

  return (
    <ul>
      {skills.map((skill) => (
        <li key={skill}>{skill}</li>
      ))}
    </ul>
  );
}
        `,
      },
      keyTakeaways: [
        "null can be returned when a component should render nothing.",
        "Loading, error, empty, and success are different UI states.",
        "Explicit states prevent confusing blank interfaces.",
        "An empty array is different from data that has not loaded yet.",
      ],
      commonMistakes: [
        "Showing a blank screen when data is empty.",
        "Treating loading and empty as the same state.",
        "Assuming optional values always exist.",
      ],
      quiz: [
        {
          question: "What does returning null mean?",
          options: [
            "Render nothing",
            "Reload the page",
            "Throw an error",
            "Render the text null",
          ],
          correctIndex: 0,
          explanation:
            "Returning null tells React that the component should render no UI.",
        },
        {
          question: "Which state means the request completed but there is no data?",
          options: ["Loading", "Error", "Empty", "Success with data"],
          correctIndex: 2,
          explanation:
            "An empty state means the operation completed but there is nothing to display.",
        },
      ],
    },
    {
      id: "r7-lists",
      title: "Rendering lists with stable keys",
      durationMinutes: 12,
      explanation: `
React commonly renders collections with JavaScript's <code>map()</code>.

Each sibling item needs a <b>key</b>. A key gives React a stable identity for that item across renders.

Prefer a stable ID from the data:

<code>{todos.map(todo =&gt; &lt;Todo key={todo.id} /&gt;)}</code>

Avoid using the array index as a key when items can be inserted, removed, or reordered.

Keys are not mainly about removing warnings. They help React understand which item is which when the list changes.

A key should be:
- stable
- unique among siblings
- tied to the item identity
      `,
      diagram: `
items
  ↓
map()
  ↓
item.id → key
  ↓
React tracks identity
      `,
      codeExample: {
        title: "Stable list keys",
        code: `
type Todo = {
  id: string;
  title: string;
};

export function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
        `,
      },
      keyTakeaways: [
        "Use map() to transform arrays into JSX.",
        "Each sibling list item needs a key.",
        "Stable IDs are usually the best keys.",
        "Keys help React preserve item identity when lists change.",
      ],
      commonMistakes: [
        "Using random values as keys.",
        "Using array indexes for dynamic lists.",
        "Using the same key for multiple sibling items.",
      ],
      quiz: [
        {
          question: "Why does React need keys for list items?",
          options: [
            "To style the item",
            "To track item identity across renders",
            "To send the item to a server",
            "To make map() work in JavaScript",
          ],
          correctIndex: 1,
          explanation:
            "Keys help React identify list items when the collection changes.",
        },
        {
          question: "Which is usually the best key?",
          options: [
            "Math.random()",
            "The current array index",
            "A stable unique ID from the data",
            "Date.now()",
          ],
          correctIndex: 2,
          explanation:
            "A stable unique ID represents the identity of the item.",
        },
      ],
    },
    {
      id: "r7-derived-rendering",
      title: "Derived data and readable rendering logic",
      durationMinutes: 12,
      explanation: `
JSX should describe the UI, but large amounts of complicated logic inside JSX can make components difficult to understand.

A good approach is to calculate simple derived values before the return statement.

For example:

<code>const visibleTodos = todos.filter(...);</code>

Then JSX focuses on displaying <code>visibleTodos</code>.

You can also extract repeated or complicated UI into a component.

The goal is not to remove all logic from components. The goal is to keep the relationship between data and UI easy to read.

A useful rule:

<b>Prepare data first → render the prepared data second.</b>
      `,
      diagram: `
Props / State
     ↓
prepare data
     ↓
derived values
     ↓
JSX
     ↓
UI
      `,
      codeExample: {
        title: "Prepare data before JSX",
        code: `
type Todo = {
  id: number;
  title: string;
  done: boolean;
};

export function TodoList({ todos }: { todos: Todo[] }) {
  const pendingTodos = todos.filter((todo) => !todo.done);

  return (
    <section>
      <h2>Pending: {pendingTodos.length}</h2>

      <ul>
        {pendingTodos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </section>
  );
}
        `,
      },
      keyTakeaways: [
        "Prepare complex derived data before JSX when it improves readability.",
        "Keep JSX focused on describing the UI.",
        "Extract genuinely reusable or complex UI into components.",
        "Readable rendering logic is easier to maintain.",
      ],
      commonMistakes: [
        "Putting long chains of filtering and conditions directly inside JSX.",
        "Creating tiny components for every line of markup.",
        "Duplicating rendering logic in several places.",
      ],
      quiz: [
        {
          question: "Why prepare derived data before JSX?",
          options: [
            "To make rendering logic easier to read",
            "To stop React rendering",
            "To avoid TypeScript",
            "Because React cannot use filter()",
          ],
          correctIndex: 0,
          explanation:
            "Calculating derived values before the return can make the JSX much clearer.",
        },
        {
          question: "Should every line of JSX become its own component?",
          options: [
            "Yes",
            "No, components should have meaningful responsibilities",
            "Only in TypeScript",
            "Only for lists",
          ],
          correctIndex: 1,
          explanation:
            "Over-componentization can make code harder to follow.",
        },
      ],
    },
    {
      id: "r7-render-model",
      title: "How props and state drive rendering",
      durationMinutes: 12,
      explanation: `
By this point, the main React rendering model should be clear.

A component's output is based on its current inputs:

<b>props + state → JSX → UI</b>

When state changes, React renders again with the new state.

When a parent renders, its children may render again as part of the normal rendering process.

This does not mean React blindly recreates the entire browser DOM. React calculates the new UI representation and applies the necessary DOM changes.

The most useful mental model is:

<b>Do not manually tell the DOM every step. Describe what the UI should look like for the current data.</b>

This is the foundation for the rest of React.
      `,
      diagram: `
Props ───────┐
             ↓
          Component
             ↑
State ───────┘
             ↓
            JSX
             ↓
      React updates DOM
      `,
      codeExample: {
        title: "State determines the UI",
        code: `
import { useState } from "react";

export function StatusPanel() {
  const [online, setOnline] = useState(false);

  return (
    <section>
      <p>
        Status: {online ? "Online" : "Offline"}
      </p>

      <button
        type="button"
        onClick={() => setOnline((previous) => !previous)}
      >
        Toggle status
      </button>
    </section>
  );
}
        `,
      },
      keyTakeaways: [
        "Props and state influence rendered UI.",
        "State changes cause React to render with new data.",
        "React applies necessary DOM updates instead of requiring manual DOM manipulation.",
        "Declarative rendering means describing the desired UI for the current data.",
      ],
      commonMistakes: [
        "Manually changing DOM nodes for normal React UI updates.",
        "Thinking every render recreates every DOM node.",
        "Forgetting that UI should follow current props and state.",
      ],
      quiz: [
        {
          question: "What is a useful simplified React rendering model?",
          options: [
            "props + state → JSX → UI",
            "CSS → database → JSX",
            "DOM → props only",
            "HTML → Git → state",
          ],
          correctIndex: 0,
          explanation:
            "A component's rendered output is determined by its current props and state.",
        },
        {
          question: "Does a React render mean the entire DOM is recreated?",
          options: [
            "Yes",
            "No, React applies the necessary DOM changes",
            "Only for TypeScript",
            "Only in production",
          ],
          correctIndex: 1,
          explanation:
            "React calculates the updated UI and applies the necessary changes to the DOM.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Which is a common way to conditionally render one of two UI branches?",
      options: [
        "Ternary operator",
        "CSS only",
        "Database query",
        "Git branch",
      ],
      correctIndex: 0,
      explanation:
        "The ternary operator is a common pattern for two UI alternatives.",
    },
    {
      question: "What can a component return to render nothing?",
      options: ["undefined only", "null", "false only", "An empty CSS file"],
      correctIndex: 1,
      explanation:
        "Returning null tells React to render no UI for that component.",
    },
    {
      question: "Which set describes common data UI states?",
      options: [
        "Loading, error, empty, success",
        "HTML, CSS, JS, SQL",
        "Open, close, push, pull",
        "Start, stop, pause, delete",
      ],
      correctIndex: 0,
      explanation:
        "Loading, error, empty, and success are useful states for data-driven interfaces.",
    },
    {
      question: "Why are stable keys important?",
      options: [
        "They style list items",
        "They identify list items across renders",
        "They submit forms",
        "They create state",
      ],
      correctIndex: 1,
      explanation:
        "Stable keys help React preserve item identity when a list changes.",
    },
    {
      question: "Which is usually a good key?",
      options: [
        "Math.random()",
        "A stable unique item ID",
        "Date.now()",
        "Always the array index",
      ],
      correctIndex: 1,
      explanation:
        "A stable unique ID is tied to the item's identity.",
    },
    {
      question: "Why calculate derived data before JSX?",
      options: [
        "To make rendering logic easier to read",
        "To stop React rendering",
        "To avoid TypeScript",
        "To remove all state",
      ],
      correctIndex: 0,
      explanation:
        "Preparing derived values before the return can keep JSX focused on presentation.",
    },
    {
      question: "What generally drives a component's rendered output?",
      options: [
        "Props and state",
        "Only CSS",
        "Only the URL",
        "Only localStorage",
      ],
      correctIndex: 0,
      explanation:
        "Props and state are primary inputs into a component's rendered UI.",
    },
    {
      question: "What does declarative UI mean?",
      options: [
        "Describe what the UI should look like for current data",
        "Manually modify every DOM node",
        "Avoid JavaScript",
        "Write only CSS",
      ],
      correctIndex: 0,
      explanation:
        "Declarative UI focuses on describing the desired result rather than manually performing every DOM operation.",
    },
  ],
  project: {
    name: "Todo Dashboard",
    goal: "Build a data-driven dashboard that handles conditional UI, lists, empty states, and derived rendering.",
    brief:
      "Create a Todo Dashboard that displays tasks, filters them by status, shows an empty state when necessary, and displays derived information. Practice <b>conditional rendering, empty states, stable keys, derived values, and readable rendering logic</b>.",
    steps: [
      "Create a Todo type with id, title, completed, and priority.",
      "Store an initial todo list in state.",
      "Create a filter state with all, active, and completed options.",
      "Calculate visible todos from the current list and filter instead of storing visibleTodos separately.",
      "Render each todo with map() and use the todo id as the key.",
      "Show a clear empty-state message when no todos match the selected filter.",
      "Show total, completed, and remaining counts using derived values.",
      "Use conditional rendering to display appropriate UI for each state.",
    ],
    acceptance: [
      "The dashboard renders todos with stable keys.",
      "Changing the filter changes the displayed list.",
      "The visible list is derived from state instead of duplicated in another state variable.",
      "An empty state appears when no todos match the selected filter.",
      "Summary counts are calculated from the todo data.",
      "Rendering logic is readable and does not contain unnecessary nested conditions.",
    ],
    stretch: [
      "Add a priority filter.",
      "Add a completed/active toggle for each todo.",
      "Extract TodoItem, TodoList, FilterBar, and TodoSummary components.",
      "Add simulated loading and error states.",
    ],
  },
};
