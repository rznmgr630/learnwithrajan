import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_3_LESSONS: LessonDay = {
  day: 3,
  title: "Events, event handlers, and user interaction",
  totalMinutes: 50,
  difficulty: "Beginner",
  lessons: [
    {
      id: "react-events",
      title: "Understanding events in React",
      durationMinutes: 9,
      explanation: `<b>An event</b> (something that happens in the browser, such as a click, typing, submitting a form, or moving the mouse) is how your React application responds to user interaction.

In normal browser JavaScript, you may write:

\`\`\`ts
button.addEventListener("click", handleClick);
\`\`\`

React uses event handler props instead:

\`\`\`tsx
<button onClick={handleClick}>Click me</button>
\`\`\`

The important idea is that you pass a function to the event handler.

---

### 1. Basic — handling a click

\`\`\`tsx
function App() {
  function handleClick() {
    console.log("Button clicked");
  }

  return <button onClick={handleClick}>Click me</button>;
}
\`\`\`

Notice that we write:

\`\`\`tsx
onClick={handleClick}
\`\`\`

not:

\`\`\`tsx
onClick={handleClick()}
\`\`\`

The first version gives React the function so React can call it when the event happens.

The second version calls the function immediately while rendering.

---

### 2. Common React events

You will use event handlers frequently:

\`\`\`tsx
<button onClick={handleClick}>Click</button>

<input onChange={handleChange} />

<form onSubmit={handleSubmit}>
  ...
</form>

<input onFocus={handleFocus} />

<input onBlur={handleBlur} />

<div onMouseEnter={handleMouseEnter}>
  ...
</div>
\`\`\`

The event name uses <b>camelCase</b> (writing multiple words with the first letter of each later word capitalized).

For example:

\`\`\`text
onclick       ❌
onClick       ✅

onsubmit      ❌
onSubmit      ✅

onchange      ❌
onChange      ✅
\`\`\`

---

### 3. Intermediate — the event handler receives an event object

React passes information about the event to your handler.

\`\`\`tsx
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  console.log(event);
}
\`\`\`

The <b>event object</b> (an object containing information about what happened) can tell you things such as which element triggered the event.

For an input:

\`\`\`tsx
function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  console.log(event.target.value);
}
\`\`\`

Here, \`event.target\` is the element that triggered the event, and \`value\` contains the input's current value.

You do not need to memorize every event type today. Understand the pattern first.

---

### 4. Important — handlers should describe an action

Prefer clear names:

\`\`\`tsx
function handleSave() {
  // save something
}

function handleDelete() {
  // delete something
}

function handleSearch() {
  // search something
}
\`\`\`

Names such as \`handleClick\` are fine for simple examples, but names that describe the actual action become easier to understand in larger applications.`,
      diagram: `User interaction

User clicks button
        │
        ↓
Browser creates event
        │
        ↓
React calls onClick handler
        │
        ↓
handleClick()
        │
        ↓
Your application logic

The same pattern works for typing,
submitting forms, focus, blur and more.`,
      codeExample: {
        title: "Handling a button click",
        code: `function App() {
  function handleSave() {
    console.log("Saving profile...");
  }

  return (
    <button onClick={handleSave}>
      Save Profile
    </button>
  );
}`,
      },
      keyTakeaways: [
        "React handles browser events through event handler props such as <b>onClick</b> and <b>onChange</b>.",
        "Pass the function to the handler; do not call it during rendering.",
        "React event names normally use <b>camelCase</b>.",
        "Event handlers receive an <b>event object</b> when you need information about the event.",
        "Use clear handler names such as <b>handleSave</b> and <b>handleDelete</b>.",
      ],
      commonMistakes: [
        "<b>Calling the handler during render</b> — `onClick={handleClick()}` runs the function immediately. Use `onClick={handleClick}`.",
        "<b>Using lowercase event names</b> — React uses names such as `onClick`, `onChange` and `onSubmit`.",
        "<b>Putting complex logic directly inside JSX</b> — move meaningful event logic into a named handler.",
      ],
      quiz: [
        {
          question: "Which is the correct way to pass a click handler?",
          options: [
            "onClick={handleClick}",
            "onClick={handleClick()}",
            "onclick={handleClick}",
            "click={handleClick}",
          ],
          correctIndex: 0,
          explanation: "Pass the function itself so React can call it when the click happens.",
        },
        {
          question: "What is an event object?",
          options: [
            "A CSS file",
            "An object containing information about the event",
            "A React component",
            "A database record",
          ],
          correctIndex: 1,
          explanation: "The event object provides information about what happened and which element triggered it.",
        },
        {
          question: "Which event is commonly used when the value of an input changes?",
          options: [
            "onClick",
            "onChange",
            "onDelete",
            "onRender",
          ],
          correctIndex: 1,
          explanation: "React uses onChange for responding to changes in form input values.",
        },
      ],
    },
    {
      id: "event-parameters",
      title: "Passing arguments to event handlers",
      durationMinutes: 8,
      explanation: `Sometimes an event handler needs extra information.

For example, imagine a list of users:

\`\`\`tsx
const users = [
  { id: 101, name: "Rajan" },
  { id: 102, name: "Sita" },
];
\`\`\`

You may want to delete a specific user.

You cannot write:

\`\`\`tsx
onClick={handleDelete}
\`\`\`

if the handler needs the user's ID and your function does not otherwise have access to it.

Instead, create a small function that calls your handler:

\`\`\`tsx
<button onClick={() => handleDelete(user.id)}>
  Delete
</button>
\`\`\`

The arrow function is created for the click handler and calls \`handleDelete\` when the user clicks.

---

### 1. Basic — passing an ID

\`\`\`tsx
function handleDelete(userId: number) {
  console.log("Delete user:", userId);
}

<button onClick={() => handleDelete(101)}>
  Delete
</button>
\`\`\`

The important difference is:

\`\`\`tsx
onClick={handleDelete}
\`\`\`

versus:

\`\`\`tsx
onClick={() => handleDelete(101)}
\`\`\`

The second version gives you control over the arguments.

---

### 2. Rendering a list

\`\`\`tsx
const users = [
  { id: 101, name: "Rajan" },
  { id: 102, name: "Sita" },
];

function UserList() {
  function handleDelete(userId: number) {
    console.log("Delete:", userId);
  }

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name}

          <button onClick={() => handleDelete(user.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
\`\`\`

Each button gets the ID belonging to its own user.

---

### 3. Why not use a function call directly?

This is wrong:

\`\`\`tsx
<button onClick={handleDelete(user.id)}>
  Delete
</button>
\`\`\`

That calls \`handleDelete\` while React is rendering the component.

Use:

\`\`\`tsx
<button onClick={() => handleDelete(user.id)}>
  Delete
</button>
\`\`\`

Now the function runs when the click happens.

---

### 4. Avoid unnecessary wrappers

If your handler does not need additional arguments, pass it directly:

\`\`\`tsx
<button onClick={handleSave}>
  Save
</button>
\`\`\`

Use an arrow function when you need to pass additional values:

\`\`\`tsx
<button onClick={() => handleDelete(user.id)}>
  Delete
</button>
\`\`\`

This distinction will become very important when you start building interactive lists and forms.`,
      diagram: `List item

User
{id: 101}
   │
   ↓
Delete button
   │
   │ click
   ↓
() => handleDelete(user.id)
   │
   ↓
handleDelete(101)
   │
   ↓
Application logic`,
      codeExample: {
        title: "Passing a user ID to a handler",
        code: `const users = [
  { id: 101, name: "Rajan" },
  { id: 102, name: "Sita" },
];

function UserList() {
  function handleDelete(userId: number) {
    console.log("Delete user:", userId);
  }

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name}

          <button onClick={() => handleDelete(user.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}`,
      },
      keyTakeaways: [
        "Use an arrow function when an event handler needs additional arguments.",
        "`onClick={handleDelete}` passes the function directly.",
        "`onClick={() => handleDelete(user.id)}` waits until the click and then passes the ID.",
        "Do not call an event handler directly during rendering.",
        "Use the simplest handler form that solves the problem.",
      ],
      commonMistakes: [
        "<b>Calling the handler during render</b> — `onClick={handleDelete(user.id)}` executes immediately.",
        "<b>Wrapping every handler unnecessarily</b> — if no extra arguments are needed, pass the handler directly.",
        "<b>Using the wrong item's ID</b> — inside `map()`, use the current item's data such as `user.id`.",
      ],
      quiz: [
        {
          question: "How do you pass a user's ID to a click handler?",
          options: [
            "onClick={handleDelete(user.id)}",
            "onClick={() => handleDelete(user.id)}",
            "onClick=handleDelete(user.id)",
            "onClick={user.id}",
          ],
          correctIndex: 1,
          explanation: "The arrow function waits for the click and then calls the handler with the user's ID.",
        },
        {
          question: "When should you pass a handler directly?",
          options: [
            "When it needs no additional arguments",
            "Only when using TypeScript",
            "Only for forms",
            "Never",
          ],
          correctIndex: 0,
          explanation: "Use the direct function reference when React already provides everything the handler needs.",
        },
      ],
    },
    {
      id: "forms-and-inputs",
      title: "Handling inputs and form submission",
      durationMinutes: 10,
      explanation: `Forms are one of the most common places where React events are used.

A form may contain:

\`\`\`text
Input
Select
Checkbox
Textarea
Submit button
\`\`\`

The browser already knows how forms work. React lets you connect those browser events to your application logic.

---

### 1. Basic — reading an input event

\`\`\`tsx
function SearchBox() {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
  }

  return (
    <input
      type="text"
      placeholder="Search..."
      onChange={handleChange}
    />
  );
}
\`\`\`

Every time the user changes the input, React calls \`handleChange\`.

The current text is available through:

\`\`\`tsx
event.target.value
\`\`\`

---

### 2. Submitting a form

A form normally uses \`onSubmit\`:

\`\`\`tsx
function LoginForm() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log("Form submitted");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" />
      <button type="submit">Log in</button>
    </form>
  );
}
\`\`\`

<b>preventDefault()</b> (a browser method that prevents the browser's default action) is commonly used when React needs to handle the submission itself.

Without it, the browser can perform its normal form submission behavior, which may reload or navigate the page.

---

### 3. Why use a submit handler?

You could put an \`onClick\` on the button, but that does not represent the whole form.

Prefer:

\`\`\`tsx
<form onSubmit={handleSubmit}>
  ...
  <button type="submit">Save</button>
</form>
\`\`\`

This means the form is responsible for submission.

It also works when the user submits the form using the keyboard.

---

### 4. Intermediate — reading multiple fields

\`\`\`tsx
function SignupForm() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    console.log(formData.get("name"));
    console.log(formData.get("email"));
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" />
      <input name="email" type="email" />

      <button type="submit">
        Create Account
      </button>
    </form>
  );
}
\`\`\`

\`FormData\` (a browser API for reading form field values) can be useful when you want to read the form at submission time.

You will later learn controlled inputs and React state, which are useful when the UI needs to continuously track input values.`,
      diagram: `User types
    │
    ↓
<input onChange={...} />
    │
    ↓
change event
    │
    ↓
handleChange(event)
    │
    ↓
event.target.value


Form submission

User clicks Submit
        │
        ↓
<form onSubmit={...}>
        │
        ↓
handleSubmit(event)
        │
        ↓
event.preventDefault()
        │
        ↓
Your application logic`,
      codeExample: {
        title: "Handling a form submission",
        code: `function LoginForm() {
  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    console.log({ email, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input name="email" type="email" />
      </label>

      <label>
        Password
        <input name="password" type="password" />
      </label>

      <button type="submit">
        Log in
      </button>
    </form>
  );
}`,
      },
      keyTakeaways: [
        "Use <b>onChange</b> to respond to input changes.",
        "Use <b>onSubmit</b> on the form rather than relying only on the submit button's click event.",
        "`event.preventDefault()` prevents the browser's default form submission behavior.",
        "`event.target.value` gives the current value of an input event.",
        "`FormData` can read form fields when the form is submitted.",
      ],
      commonMistakes: [
        "<b>Using `onClick` as the only form submission mechanism</b> — use `onSubmit` on the `<form>` so keyboard submission also works.",
        "<b>Forgetting `preventDefault()`</b> when you want React to handle the submission without the browser navigating or reloading.",
        "<b>Forgetting `name` attributes</b> when using `FormData` — the field name is used to retrieve its value.",
      ],
      quiz: [
        {
          question: "Which event should normally be used on a form?",
          options: [
            "onClick",
            "onSubmit",
            "onForm",
            "onSend",
          ],
          correctIndex: 1,
          explanation: "The form's onSubmit event represents submission of the form.",
        },
        {
          question: "What does `event.preventDefault()` do?",
          options: [
            "Stops React from rendering",
            "Prevents the browser's default action",
            "Deletes the form",
            "Clears every input",
          ],
          correctIndex: 1,
          explanation: "It prevents the browser's normal default behavior for that event.",
        },
        {
          question: "What can `event.target.value` provide for an input?",
          options: [
            "The input's current value",
            "The database ID",
            "The CSS class",
            "The React component name",
          ],
          correctIndex: 0,
          explanation: "For an input change event, target.value contains the current input value.",
        },
      ],
    },
    {
      id: "event-propagation",
      title: "Event propagation and stopping events",
      durationMinutes: 8,
      explanation: `Events do not always stay on the exact element where they happen.

<b>Event propagation</b> (the way an event travels through elements involved in the event) is an important browser concept.

For example:

\`\`\`tsx
<div onClick={() => console.log("Card")}>
  <button onClick={() => console.log("Button")}>
    Save
  </button>
</div>
\`\`\`

If you click the button, both handlers can run.

The click starts at the button and then moves upward through its ancestors.

This is commonly called <b>bubbling</b> (an event moving from the target element toward its parent elements).

---

### 1. Basic — bubbling

Consider:

\`\`\`text
<div>
  <button>Save</button>
</div>
\`\`\`

If both have click handlers:

\`\`\`text
Click button
    ↓
Button handler
    ↓
Parent div handler
\`\`\`

This can be useful, but sometimes you do not want the parent handler to run.

---

### 2. Stopping propagation

You can call:

\`\`\`tsx
event.stopPropagation();
\`\`\`

Example:

\`\`\`tsx
function Card() {
  function handleCardClick() {
    console.log("Card clicked");
  }

  function handleButtonClick(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.stopPropagation();

    console.log("Button clicked");
  }

  return (
    <div onClick={handleCardClick}>
      <button onClick={handleButtonClick}>
        Delete
      </button>
    </div>
  );
}
\`\`\`

Now clicking the button does not continue to the card's click handler.

---

### 3. Do not stop propagation everywhere

\`stopPropagation()\` is a specific tool.

Do not automatically add it to every event.

If the parent handler is supposed to know about the child interaction, let the event bubble.

Use it when the parent and child have separate interaction behavior and the child should not trigger the parent action.

---

### 4. Bubbling vs capturing

The browser event system has two main propagation phases:

\`\`\`text
Capturing phase
Parent
  ↓
Child
  ↓
Target
  ↑
Bubbling phase
\`\`\`

You will most commonly work with bubbling events in React.

You do not need to build complicated event propagation systems at this stage. Understand what bubbling is and know that \`stopPropagation()\` can prevent an event from continuing upward.`,
      diagram: `Event propagation

<div onClick={card}>
    │
    │
    └── <button onClick={button}>
              │
              │ click
              ↓
        Button handler
              │
              ↓
        Parent handler
              │
              ↓
        Card handler

stopPropagation()
        │
        ↓
Stops the event from
continuing to the parent`,
      codeExample: {
        title: "Stopping a button click from reaching its parent",
        code: `function Card() {
  function handleCardClick() {
    console.log("Open card");
  }

  function handleDelete(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.stopPropagation();

    console.log("Delete item");
  }

  return (
    <div onClick={handleCardClick}>
      <h2>Rajan's Profile</h2>

      <button onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
}`,
      },
      keyTakeaways: [
        "<b>Event propagation</b> describes how an event travels through related elements.",
        "<b>Bubbling</b> means an event can move from the target toward parent elements.",
        "Use `event.stopPropagation()` when a child event should not trigger a parent handler.",
        "Do not use `stopPropagation()` everywhere; use it only when the interaction requires it.",
        "Most everyday React event handling uses the bubbling phase.",
      ],
      commonMistakes: [
        "<b>Thinking only the clicked element can receive the event</b> — parent handlers can also run because of bubbling.",
        "<b>Using `stopPropagation()` everywhere</b> — this can make event behavior harder to understand.",
        "<b>Confusing `stopPropagation()` with `preventDefault()`</b> — one controls propagation, while the other prevents a default browser action.",
      ],
      quiz: [
        {
          question: "What is event bubbling?",
          options: [
            "An event moving from the target toward parent elements",
            "A CSS animation",
            "A React state update",
            "A network request",
          ],
          correctIndex: 0,
          explanation: "Bubbling describes an event moving upward through parent elements.",
        },
        {
          question: "What does `stopPropagation()` do?",
          options: [
            "Prevents the browser from submitting a form",
            "Stops an event from continuing through propagation",
            "Stops React from rendering",
            "Deletes the event",
          ],
          correctIndex: 1,
          explanation: "It prevents the event from continuing to other propagation targets such as parent handlers.",
        },
        {
          question: "How is `stopPropagation()` different from `preventDefault()`?",
          options: [
            "They are exactly the same",
            "stopPropagation controls event propagation; preventDefault prevents a default browser action",
            "preventDefault controls CSS",
            "stopPropagation submits forms",
          ],
          correctIndex: 1,
          explanation: "They solve different problems: propagation versus the browser's default behavior.",
        },
      ],
    },
    {
      id: "event-driven-component",
      title: "Putting event handling together",
      durationMinutes: 7,
      explanation: `Now combine the ideas from today.

A real component may need to:

- Display data
- Respond to clicks
- Read input values
- Submit a form
- Pass IDs to handlers
- Prevent default browser behavior
- Decide whether an event should bubble

The important React pattern is:

\`\`\`text
UI
 ↓
User interaction
 ↓
Event handler
 ↓
Application logic
\`\`\`

For example:

\`\`\`tsx
function ProfileActions() {
  function handleEdit() {
    console.log("Edit profile");
  }

  function handleDelete() {
    console.log("Delete profile");
  }

  return (
    <div>
      <button onClick={handleEdit}>
        Edit
      </button>

      <button onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
}
\`\`\`

The component describes both the UI and the behavior connected to the UI.

---

### 1. Keep handlers readable

If an event handler becomes large, move complex application logic into a separate function.

For example:

\`\`\`tsx
function validateProfile() {
  // validation logic
}

function saveProfile() {
  // API or business logic
}

function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (!validateProfile()) {
    return;
  }

  saveProfile();
}
\`\`\`

This makes the event handler easy to understand.

---

### 2. Event handlers are not state

Today you are learning how to respond to events.

You may notice that clicking a button does not automatically change what appears on the screen.

For example:

\`\`\`tsx
function App() {
  function handleClick() {
    console.log("Clicked");
  }

  return <button onClick={handleClick}>Click</button>;
}
\`\`\`

The click happens, but the UI does not remember anything.

That is because we have not introduced <b>state</b> (data that React remembers for a component and that can trigger a new render when it changes).

State is the main topic of Day 4.

For now, understand this distinction:

\`\`\`text
Event
  ↓
Runs a handler

State
  ↓
Stores changing component data
  ↓
Can cause the UI to update
\`\`\`

This distinction will make the next day much easier.`,
      diagram: `React interaction model

          Component UI
               │
               ↓
        User interaction
               │
               ↓
          React event
               │
               ↓
        Event handler
               │
        ┌──────┴──────┐
        ↓             ↓
   App logic       State update
                      │
                      ↓
                New UI render

Day 3 focus:
events + handlers

Day 4 focus:
state + UI updates`,
      codeExample: {
        title: "A small interactive profile",
        code: `function ProfileActions() {
  function handleEdit() {
    console.log("Edit profile");
  }

  function handleDelete() {
    console.log("Delete profile");
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    console.log("Profile submitted");
  }

  return (
    <section>
      <button onClick={handleEdit}>
        Edit
      </button>

      <button onClick={handleDelete}>
        Delete
      </button>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" />

        <button type="submit">
          Save
        </button>
      </form>
    </section>
  );
}`,
      },
      keyTakeaways: [
        "A React application connects UI elements to behavior through <b>event handlers</b>.",
        "Keep event handlers focused on responding to the interaction.",
        "Move complex validation or business logic into separate functions when needed.",
        "Events trigger functions; <b>state</b> stores changing component data and can cause the UI to update.",
        "Day 3 is about events. Day 4 will build on this with state.",
      ],
      commonMistakes: [
        "<b>Expecting a normal variable to update the UI</b> — changing a regular variable does not tell React to render again.",
        "<b>Putting all application logic inside JSX</b> — named handlers are easier to read and maintain.",
        "<b>Mixing `preventDefault()` and `stopPropagation()`</b> — they solve different problems.",
      ],
      quiz: [
        {
          question: "What is the main purpose of an event handler?",
          options: [
            "To respond to a user or browser event",
            "To create a database",
            "To compile TypeScript",
            "To style an element",
          ],
          correctIndex: 0,
          explanation: "An event handler contains the logic that should run when an event occurs.",
        },
        {
          question: "Does changing a normal JavaScript variable automatically update React UI?",
          options: [
            "Yes, always",
            "No, a normal variable does not tell React to render again",
            "Only in CSS",
            "Only with Vite",
          ],
          correctIndex: 1,
          explanation: "React state is used when changing data should cause the component UI to update.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Which prop handles a button click in React?",
      options: [
        "onclick",
        "onClick",
        "click",
        "handleClick",
      ],
      correctIndex: 1,
      explanation: "React uses the camelCase event handler prop `onClick`.",
    },
    {
      question: "What should you normally write when passing a click handler?",
      options: [
        "onClick={handleClick}",
        "onClick={handleClick()}",
        "onclick=handleClick",
        "onClick=\"handleClick\"",
      ],
      correctIndex: 0,
      explanation: "Passing the function reference lets React call it when the click occurs.",
    },
    {
      question: "How can you pass an ID to a handler?",
      options: [
        "onClick={handleDelete(user.id)}",
        "onClick={() => handleDelete(user.id)}",
        "onClick={user.id}",
        "onClick=handleDelete(user.id)",
      ],
      correctIndex: 1,
      explanation: "The arrow function waits until the event occurs and then calls the handler with the ID.",
    },
    {
      question: "Which event is normally used to handle a form submission?",
      options: [
        "onClick",
        "onSubmit",
        "onForm",
        "onSend",
      ],
      correctIndex: 1,
      explanation: "Use `onSubmit` on the form to represent the form submission.",
    },
    {
      question: "What does `event.preventDefault()` do?",
      options: [
        "Stops React rendering",
        "Prevents the browser's default action",
        "Stops all JavaScript",
        "Deletes the event",
      ],
      correctIndex: 1,
      explanation: "It prevents the browser from performing its normal default behavior for the event.",
    },
    {
      question: "What does event bubbling mean?",
      options: [
        "The event moves from the target toward parent elements",
        "The event becomes a network request",
        "The event changes CSS",
        "The event creates state",
      ],
      correctIndex: 0,
      explanation: "Bubbling allows an event to move upward through parent elements.",
    },
    {
      question: "Which method stops an event from continuing to parent handlers?",
      options: [
        "preventDefault()",
        "stopPropagation()",
        "stopEvent()",
        "cancelRender()",
      ],
      correctIndex: 1,
      explanation: "`stopPropagation()` prevents the event from continuing through propagation.",
    },
    {
      question: "Which statement is correct?",
      options: [
        "stopPropagation() and preventDefault() do exactly the same thing",
        "stopPropagation controls propagation; preventDefault prevents a default browser action",
        "preventDefault changes React state",
        "stopPropagation submits forms",
      ],
      correctIndex: 1,
      explanation: "The two methods solve different problems.",
    },
    {
      question: "What does `event.target.value` commonly provide for an input?",
      options: [
        "The input's current value",
        "The component name",
        "The database ID",
        "The CSS selector",
      ],
      correctIndex: 0,
      explanation: "For an input event, target.value contains the current input value.",
    },
    {
      question: "What is the difference between an event and state?",
      options: [
        "They are exactly the same",
        "An event represents something that happened; state stores changing component data",
        "State is only for CSS",
        "Events are database records",
      ],
      correctIndex: 1,
      explanation: "Events trigger handlers, while state stores changing data that can affect the rendered UI.",
    },
  ],
  project: {
    name: "Interactive Profile Manager",
    goal: "Build a small interactive profile page that practices React event handling without using React state yet.",
    brief: "Create a React application with a profile form and action buttons. Practice <b>onClick, onChange, onSubmit, event objects, passing arguments, preventDefault(), event bubbling and stopPropagation()</b>. The project should focus on event handling; do not add `useState` yet.",
    steps: [
      "Create a reusable `ProfileActions` component and render it from `App`.",
      "Display a profile for Rajan Magar with an Edit button and Delete button.",
      "Create `handleEdit()` and `handleDelete()` handlers and connect them to the buttons with `onClick`.",
      "Create a `skills` list and render each skill with `map()`.",
      "Add a Delete button beside each skill and pass the skill ID or skill name to `handleDeleteSkill()` using an arrow function.",
      "Create a profile form with `name`, `email` and `bio` inputs.",
      "Add an `onSubmit` handler to the form and call `event.preventDefault()` so the browser does not perform its default form submission.",
      "Read the submitted values using `FormData` and log the values to the console.",
      "Add a clickable profile card with a child button. Make the card log `Open profile` when clicked, but make the child button log `Delete profile` without triggering the card click by using `event.stopPropagation()`.",
      "Use clear handler names such as `handleEdit`, `handleDelete`, `handleSubmit` and `handleDeleteSkill`.",
    ],
    acceptance: [
      "The page displays a profile and interactive Edit and Delete buttons.",
      "Clicking Edit logs an edit message without reloading the page.",
      "Clicking a skill's Delete button logs the correct skill ID or name.",
      "Submitting the profile form does not reload the page and logs the submitted form values.",
      "The profile card click handler works when clicking the card.",
      "The child Delete button does not trigger the profile card's click handler because propagation is stopped.",
      "No React state, effects, router, API or external state library is used.",
    ],
    stretch: [
      "Add a Cancel button that uses its own event handler.",
      "Add a checkbox and handle its `onChange` event.",
      "Create a reusable `ActionButton` component that receives its label and `onClick` handler through props.",
      "Create a nested card structure and experiment with bubbling to see which handlers run.",
      "Open the browser DevTools console and verify every event handler yourself.",
    ],
  },
};
