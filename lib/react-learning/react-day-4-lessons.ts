import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_4_LESSONS: LessonDay = {
  day: 4,
  title: "State and Re-rendering",
  totalMinutes: 60,
  difficulty: "Beginner",
  lessons: [
    {
      id: "r4-state-basics",
      title: "What state is and why React needs it",
      durationMinutes: 12,
      explanation: `
<b>State</b> is data that belongs to a component and can change over time.

Examples:
- whether a menu is open
- the current input value
- the selected tab
- a counter value
- whether a modal is visible

In normal JavaScript, changing a variable does not automatically tell React to update the browser. React state gives a component a way to store changing data and request a new render.

The important idea is:

<b>State changes → React renders the component again → React updates the DOM where necessary</b>

State is not the same thing as a normal local variable. A normal variable is recreated whenever the component function runs. React state survives between renders.

A state variable has two important parts:
1. The current value.
2. A setter function used to request a state update.

The most common API for local state is <code>useState</code>, a React Hook (a React function that lets a component use a React feature).
      `,
      diagram: `
User interaction
      ↓
setState(...)
      ↓
React schedules an update
      ↓
Component renders again
      ↓
New JSX is calculated
      ↓
React updates the necessary DOM
      `,
      codeExample: {
        title: "A simple counter",
        code: `
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Count: {count}</p>

      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </section>
  );
}
        `,
      },
      keyTakeaways: [
        "State stores data that can change during a component's lifetime.",
        "useState returns the current state value and a setter function.",
        "Calling the setter asks React to render the component again.",
        "State survives component re-renders, unlike ordinary local variables.",
      ],
      commonMistakes: [
        "Using a normal variable when the UI needs to react to changes.",
        "Trying to modify state directly instead of using its setter.",
        "Thinking that state is the same as a regular JavaScript variable.",
      ],
      quiz: [
        {
          question: "Why do React components use state?",
          options: [
            "To store data that can change and affect the UI",
            "To replace JavaScript variables completely",
            "To create CSS classes",
            "To make every component global",
          ],
          correctIndex: 0,
          explanation:
            "State stores changing data that can cause the component UI to update.",
        },
        {
          question: "What does useState return?",
          options: [
            "A component and a prop",
            "The current value and a setter function",
            "Only the current value",
            "Only a setter function",
          ],
          correctIndex: 1,
          explanation:
            "useState returns a pair: the current state value and a function for updating it.",
        },
      ],
    },
    {
      id: "r4-usestate",
      title: "Using useState correctly",
      durationMinutes: 12,
      explanation: `
The basic form of <code>useState</code> is:

<code>const [value, setValue] = useState(initialValue);</code>

The first item is the current state value. The second item is the setter.

The initial value is used when the component is first created. For example:

<code>const [name, setName] = useState("Rajan");</code>

When the state changes, React schedules another render.

State can hold many JavaScript values:
- strings
- numbers
- booleans
- arrays
- objects

Keep state as simple as possible. Store the minimum information needed to calculate the UI rather than storing values that can be derived from other state.
      `,
      diagram: `
useState("Rajan")
      ↓
┌───────────────┐
│ value         │ → "Rajan"
│ setValue      │ → function that updates it
└───────────────┘
      ↓
setValue("Alex")
      ↓
component renders again
      `,
      codeExample: {
        title: "Different kinds of state",
        code: `
import { useState } from "react";

export function Settings() {
  const [name, setName] = useState("Rajan");
  const [age, setAge] = useState(28);
  const [enabled, setEnabled] = useState(true);

  return (
    <section>
      <p>{name}</p>
      <p>{age}</p>
      <p>{enabled ? "Enabled" : "Disabled"}</p>

      <button onClick={() => setName("Alex")}>
        Change name
      </button>
    </section>
  );
}
        `,
      },
      keyTakeaways: [
        "useState can store any normal JavaScript value.",
        "The initial value is used for the initial render.",
        "Use the setter returned by useState to update state.",
        "Prefer minimal state and derive other values when possible.",
      ],
      commonMistakes: [
        "Calling useState conditionally.",
        "Creating duplicate state for information that can be calculated.",
        "Using state when a constant value would be enough.",
      ],
      quiz: [
        {
          question: "Which variable is the setter in this code: const [name, setName] = useState('Rajan')?",
          options: ["name", "useState", "setName", "Rajan"],
          correctIndex: 2,
          explanation: "setName is the setter function returned by useState.",
        },
        {
          question: "Which is a good rule for state?",
          options: [
            "Store every value in state",
            "Store the minimum changing data needed by the UI",
            "Never use arrays in state",
            "Only store strings",
          ],
          correctIndex: 1,
          explanation:
            "Minimal state makes components easier to reason about and avoids unnecessary duplicated data.",
        },
      ],
    },
    {
      id: "r4-state-updates",
      title: "State updates and functional updates",
      durationMinutes: 12,
      explanation: `
State updates are not simply assignments to a normal variable.

When the next state depends on the previous state, use the <b>functional update</b> form:

<code>setCount(previousCount =&gt; previousCount + 1)</code>

This tells React how to calculate the next value from the previous value.

This is especially important when making multiple updates based on the same state value.

Think of these two forms differently:

<code>setCount(count + 1)</code>
means "set the next value to this calculated value."

<code>setCount(previousCount =&gt; previousCount + 1)</code>
means "take the latest previous value and calculate the next value from it."

The functional form is the safer pattern whenever the new state depends on the old state.
      `,
      diagram: `
previous state
      ↓
functional updater
      ↓
next state

0 → previous + 1 → 1
1 → previous + 1 → 2
2 → previous + 1 → 3
      `,
      codeExample: {
        title: "Updating from previous state",
        code: `
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  function incrementThreeTimes() {
    setCount((previous) => previous + 1);
    setCount((previous) => previous + 1);
    setCount((previous) => previous + 1);
  }

  return (
    <section>
      <p>{count}</p>
      <button onClick={incrementThreeTimes}>
        +3
      </button>
    </section>
  );
}
        `,
      },
      keyTakeaways: [
        "State updates should go through the setter.",
        "Use a functional update when the next state depends on the previous state.",
        "Functional updates make chained state calculations explicit.",
        "Do not assume a state variable changes immediately after calling its setter.",
      ],
      commonMistakes: [
        "Using count + 1 repeatedly when each update depends on the previous value.",
        "Expecting the state variable to change immediately inside the same function.",
        "Trying to mutate React state directly.",
      ],
      quiz: [
        {
          question: "Which form is best when the next state depends on the previous state?",
          options: [
            "setCount(count)",
            "setCount(count + 1)",
            "setCount(previous => previous + 1)",
            "count = count + 1",
          ],
          correctIndex: 2,
          explanation:
            "The functional updater receives the previous state and calculates the next state from it.",
        },
        {
          question: "Does calling a state setter immediately change the local state variable in the current function?",
          options: [
            "Yes, always",
            "No",
            "Only for strings",
            "Only in development",
          ],
          correctIndex: 1,
          explanation:
            "A setter schedules a state update; the current render's state value does not become a new value halfway through the same function.",
        },
      ],
    },
    {
      id: "r4-objects-arrays",
      title: "Updating objects and arrays in state",
      durationMinutes: 12,
      explanation: `
Objects and arrays in state should be treated as immutable (not directly changed after creation).

Do not mutate an object like this:

<code>user.name = "Alex";</code>

Instead, create a new object:

<code>setUser(previous =&gt; ({ ...previous, name: "Alex" }));</code>

For arrays, create a new array with methods such as:
- <code>map()</code> for changing items
- <code>filter()</code> for removing items
- spread syntax for adding items
- <code>slice()</code> when you need a portion without mutation

React relies heavily on reference changes (whether a value is a different object/array reference) to reason about updates.
      `,
      diagram: `
State object
    ↓
create a new object
    ↓
{ ...previous, changed: value }
    ↓
setState(newObject)
    ↓
React renders again
      `,
      codeExample: {
        title: "Updating an object and array",
        code: `
import { useState } from "react";

export function ProfileEditor() {
  const [profile, setProfile] = useState({
    name: "Rajan",
    city: "Tokyo",
  });

  const [skills, setSkills] = useState(["Node.js", "React"]);

  function changeCity() {
    setProfile((previous) => ({
      ...previous,
      city: "Osaka",
    }));
  }

  function addSkill() {
    setSkills((previous) => [...previous, "TypeScript"]);
  }

  return (
    <section>
      <p>{profile.name}</p>
      <p>{profile.city}</p>
      <p>{skills.join(", ")}</p>

      <button onClick={changeCity}>Change city</button>
      <button onClick={addSkill}>Add skill</button>
    </section>
  );
}
        `,
      },
      keyTakeaways: [
        "Treat objects and arrays in state as immutable.",
        "Use object spread to create updated objects.",
        "Use map, filter, spread, or other non-mutating patterns for arrays.",
        "Create a new reference when changing an object or array in state.",
      ],
      commonMistakes: [
        "Calling array.push() directly on an array stored in state.",
        "Changing an object property directly.",
        "Forgetting to preserve unchanged object properties with spread syntax.",
      ],
      quiz: [
        {
          question: "Which is the safer way to update a user's city?",
          options: [
            "user.city = 'Osaka'",
            "setUser({ ...user, city: 'Osaka' })",
            "user = { city: 'Osaka' }",
            "user.city('Osaka')",
          ],
          correctIndex: 1,
          explanation:
            "Creating a new object with spread syntax avoids mutating the existing state object.",
        },
        {
          question: "Which pattern adds an item without mutating the existing array?",
          options: [
            "items.push(newItem)",
            "items.add(newItem)",
            "[...items, newItem]",
            "items = items + newItem",
          ],
          correctIndex: 2,
          explanation:
            "Spread syntax creates a new array containing the previous items and the new item.",
        },
      ],
    },
    {
      id: "r4-derived-state",
      title: "Derived values and avoiding unnecessary state",
      durationMinutes: 12,
      explanation: `
Not every value displayed by a component needs its own state.

A <b>derived value</b> is a value calculated from existing props or state.

For example, if you have a list of products, you do not need separate state for <code>productCount</code> if it can always be calculated as:

<code>products.length</code>

Storing both creates duplicated state. Duplicated state can become inconsistent.

A useful question is:

<b>"Can I calculate this value from props, state, or constants during rendering?"</b>

If yes, you often do not need another state variable.

This is one of the most important habits to develop before learning more advanced React APIs.
      `,
      diagram: `
products state
      ↓
products.length
      ↓
derived count

products state
      ↓
products.filter(...)
      ↓
derived visible products
      `,
      codeExample: {
        title: "Calculate instead of duplicating state",
        code: `
import { useState } from "react";

export function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, title: "Learn React", done: true },
    { id: 2, title: "Practice state", done: false },
  ]);

  const completedCount = todos.filter((todo) => todo.done).length;

  return (
    <section>
      <p>Completed: {completedCount}</p>

      {todos.map((todo) => (
        <p key={todo.id}>
          {todo.title}: {todo.done ? "Done" : "Pending"}
        </p>
      ))}
    </section>
  );
}
        `,
      },
      keyTakeaways: [
        "Derived values can usually be calculated during rendering.",
        "Avoid storing duplicated state.",
        "Keep the source of truth in one place.",
        "Ask whether a value can be calculated before adding another useState call.",
      ],
      commonMistakes: [
        "Creating state for values that are directly calculated from other state.",
        "Maintaining two pieces of state that represent the same information.",
        "Updating duplicated state in multiple places and allowing it to become inconsistent.",
      ],
      quiz: [
        {
          question: "What is a derived value?",
          options: [
            "A value calculated from existing data",
            "A value stored only in localStorage",
            "A value that must always use useState",
            "A value created by CSS",
          ],
          correctIndex: 0,
          explanation:
            "Derived values are calculated from existing props, state, or constants.",
        },
        {
          question: "Why should duplicated state usually be avoided?",
          options: [
            "React cannot store two values",
            "It can become inconsistent with the source data",
            "State cannot contain numbers",
            "It makes JSX invalid",
          ],
          correctIndex: 1,
          explanation:
            "Duplicated state creates multiple sources of truth that can get out of sync.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What causes React to render a component again when local state changes?",
      options: [
        "Changing a CSS class",
        "Calling the state setter",
        "Changing a normal local variable",
        "Calling console.log",
      ],
      correctIndex: 1,
      explanation:
        "Calling a state setter schedules an update that causes React to render the component again.",
    },
    {
      question: "What does the first value from useState represent?",
      options: [
        "The current state value",
        "The next state value",
        "The component name",
        "The DOM node",
      ],
      correctIndex: 0,
      explanation: "The first returned value is the current state for that render.",
    },
    {
      question: "What does the second value from useState represent?",
      options: [
        "A CSS class",
        "A setter function",
        "A component",
        "A DOM reference",
      ],
      correctIndex: 1,
      explanation: "The second returned value is the function used to request a state update.",
    },
    {
      question: "When should you prefer a functional state update?",
      options: [
        "When the next value depends on the previous value",
        "Only when using strings",
        "Only when rendering lists",
        "Never",
      ],
      correctIndex: 0,
      explanation:
        "Functional updates receive the previous state and calculate the next state from it.",
    },
    {
      question: "Which operation mutates an array?",
      options: [
        "map()",
        "filter()",
        "push()",
        "slice()",
      ],
      correctIndex: 2,
      explanation: "push() changes the existing array, so it should not be used directly on state arrays.",
    },
    {
      question: "How should you normally update an object stored in state?",
      options: [
        "Change its property directly",
        "Create a new object containing the updated property",
        "Delete the object",
        "Convert it to a string",
      ],
      correctIndex: 1,
      explanation:
        "Creating a new object makes the state update explicit and avoids direct mutation.",
    },
    {
      question: "What is the source of truth?",
      options: [
        "The duplicated value shown in several places",
        "The single piece of data from which related values are derived",
        "The browser URL",
        "The CSS file",
      ],
      correctIndex: 1,
      explanation:
        "Keeping one source of truth reduces synchronization problems.",
    },
    {
      question: "Which is usually unnecessary state?",
      options: [
        "A menu's open/closed status",
        "The current form input value",
        "A count that can be calculated from an existing array",
        "The selected tab",
      ],
      correctIndex: 2,
      explanation:
        "If a value can always be calculated from existing data, storing it separately can create duplicated state.",
    },
  ],
  project: {
    name: "Interactive Profile Manager",
    goal: "Build a small profile editor that uses local state and immutable updates.",
    brief:
      "Create a React + TypeScript profile manager where the user can edit a name, change a city, toggle work availability, add skills, and see derived information such as the total number of skills. This project is practice for <b>useState, state updates, functional updates, objects, arrays, immutability, and derived values</b>.",
    steps: [
      "Create a ProfileManager component with profile state containing name, city, and available.",
      "Create an input for editing the profile name and update the state with onChange.",
      "Add a button that toggles the available value using a functional state update.",
      "Create a skills array in state and add a new skill without mutating the original array.",
      "Display the number of skills using skills.length instead of storing a separate skillCount state.",
      "Use object spread syntax when changing one property of the profile object.",
      "Keep the component simple and do not add effects, routing, external APIs, or global state.",
    ],
    acceptance: [
      "The profile name can be changed from an input.",
      "The availability message changes when the toggle button is clicked.",
      "A new skill can be added without mutating the existing array.",
      "The skill count is derived from skills.length and is not stored separately.",
      "The application has no React warnings related to the state implementation.",
    ],
    stretch: [
      "Add a Remove button for each skill using filter().",
      "Add a city selector and update the profile object immutably.",
      "Add a reset button that restores the original profile state.",
      "Create a reusable SkillList component while keeping the state in the parent.",
    ],
  },
};
