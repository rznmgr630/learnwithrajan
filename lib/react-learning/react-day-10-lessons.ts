import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_10_LESSONS: LessonDay = {
  day: 10,
  title: "Forms and React Actions",
  totalMinutes: 60,
  difficulty: "Beginner",
  lessons: [
    {
      id: "r10-controlled",
      title: "Controlled form inputs",
      durationMinutes: 12,
      explanation: `
A <b>controlled input</b> is an input whose current value is controlled by React state.

The flow is:

<b>state → value → input → onChange → state</b>

This makes React the source of truth for the current input value and makes validation and conditional UI straightforward.
      `,
      diagram: `
React state
    │
    ↓ value
  <input>
    │
    ↓ onChange
React state
      `,
      codeExample: {
        title: "Controlled input",
        code: `
import { useState } from "react";

export function NameForm() {
  const [name, setName] = useState("");

  return (
    <label>
      Name
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
    </label>
  );
}
        `,
      },
      keyTakeaways: [
        "Controlled inputs keep their value in React state.",
        "value displays the state value.",
        "onChange updates state when the user edits the input.",
        "Controlled inputs make validation straightforward.",
      ],
      commonMistakes: [
        "Providing value without onChange for an editable input.",
        "Accidentally mixing controlled and uncontrolled behavior.",
        "Duplicating the same input value in multiple state variables.",
      ],
      quiz: [
        {
          question: "What controls a controlled input?",
          options: ["React state", "CSS", "The database", "The URL"],
          correctIndex: 0,
          explanation: "React state is the source of truth for the value.",
        },
        {
          question: "What normally updates controlled input state?",
          options: ["onChange", "onClick only", "className", "key"],
          correctIndex: 0,
          explanation: "onChange receives edits and updates the state.",
        },
      ],
    },
    {
      id: "r10-submit",
      title: "Form submission and validation",
      durationMinutes: 12,
      explanation: `
Use the <code>form</code> element for user-submitted data.

The <code>onSubmit</code> handler runs when the form is submitted.

Browsers normally perform a navigation when a form submits. In a client-side React application, you commonly call <code>event.preventDefault()</code> when you want to handle submission in JavaScript.

Validation should happen before sending invalid data to your application or API.
      `,
      diagram: `
Input
  ↓
Form submit
  ↓
validate
 ├── invalid → errors
 └── valid → submit
      `,
      codeExample: {
        title: "Form submission",
        code: `
import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.includes("@")) {
      return;
    }

    console.log("Submit:", email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      <button type="submit">Sign in</button>
    </form>
  );
}
        `,
      },
      keyTakeaways: [
        "Use form and onSubmit for submission.",
        "preventDefault() prevents default browser navigation when needed.",
        "Validate input before submitting.",
        "Use semantic labels and suitable input types.",
      ],
      commonMistakes: [
        "Putting submission logic only on a button onClick.",
        "Forgetting type='submit'.",
        "Showing errors without clearly associating them with fields.",
      ],
      quiz: [
        {
          question: "Which event handles form submission?",
          options: ["onSubmit", "onRender", "onMount", "onInputOnly"],
          correctIndex: 0,
          explanation: "onSubmit is the appropriate form submission event.",
        },
        {
          question: "Why call preventDefault()?",
          options: [
            "To stop default form navigation",
            "To stop React rendering",
            "To disable JavaScript",
            "To clear localStorage",
          ],
          correctIndex: 0,
          explanation: "preventDefault prevents the browser's normal form submission behavior.",
        },
      ],
    },
    {
      id: "r10-fields",
      title: "Managing multiple form fields",
      durationMinutes: 12,
      explanation: `
Forms often contain several fields.

You can keep each field in separate state variables, or keep related fields in one typed state object.

When using an object, update it immutably so other fields are preserved.

The important idea is that each input should have one clear source of truth.
      `,
      diagram: `
Form state
 ┌───────────────┐
 │ name          │
 │ email         │
 │ role          │
 └───────────────┘
      ↑
    inputs
      `,
      codeExample: {
        title: "Multiple fields",
        code: `
import { useState } from "react";

type FormData = {
  name: string;
  email: string;
};

export function ProfileForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
  });

  function updateField(
    field: keyof FormData,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <form>
      <input
        name="name"
        value={form.name}
        onChange={(event) =>
          updateField("name", event.target.value)
        }
      />

      <input
        name="email"
        type="email"
        value={form.email}
        onChange={(event) =>
          updateField("email", event.target.value)
        }
      />
    </form>
  );
}
        `,
      },
      keyTakeaways: [
        "Related fields can be represented by one typed state object.",
        "Spread preserves existing fields during updates.",
        "keyof restricts field names to valid keys.",
        "Every controlled input needs a predictable state value.",
      ],
      commonMistakes: [
        "Replacing the whole form object when updating one field.",
        "Using arbitrary field names without type checking.",
        "Keeping duplicated state for the same form value.",
      ],
      quiz: [
        {
          question: "Why spread the current form object?",
          options: [
            "To preserve other fields",
            "To delete other fields",
            "To submit automatically",
            "To create a database",
          ],
          correctIndex: 0,
          explanation: "Spread copies existing fields before replacing the changed field.",
        },
        {
          question: "What does keyof FormData provide?",
          options: [
            "A union of valid property names",
            "All property values",
            "A React component",
            "A browser event",
          ],
          correctIndex: 0,
          explanation: "keyof produces the valid keys of the TypeScript type.",
        },
      ],
    },
    {
      id: "r10-uncontrolled",
      title: "Uncontrolled inputs and refs",
      durationMinutes: 12,
      explanation: `
An <b>uncontrolled input</b> keeps its current value in the DOM rather than React state.

A <b>ref</b> is a persistent reference that can point to a DOM element or store a value between renders.

Uncontrolled inputs can be useful when you do not need React to know every keystroke. FormData is another convenient way to read submitted values.

Controlled:
<b>React state owns the value.</b>

Uncontrolled:
<b>The DOM owns the value.</b>
      `,
      diagram: `
Controlled:
React state ↔ input

Uncontrolled:
React ──ref──→ DOM input
      `,
      codeExample: {
        title: "Uncontrolled form with FormData",
        code: `
export function SearchForm() {
  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const query = formData.get("query");

    console.log(query);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="query" defaultValue="" />
      <button type="submit">Search</button>
    </form>
  );
}
        `,
      },
      keyTakeaways: [
        "Uncontrolled inputs keep their current value in the DOM.",
        "defaultValue provides an initial value.",
        "FormData can read submitted values.",
        "Use controlled inputs when React needs the value during editing.",
      ],
      commonMistakes: [
        "Switching an input between controlled and uncontrolled modes.",
        "Using refs when normal state is simpler.",
        "Assuming defaultValue stays synchronized with state.",
      ],
      quiz: [
        {
          question: "Where does an uncontrolled input keep its current value?",
          options: ["The DOM", "Only React state", "The database", "CSS"],
          correctIndex: 0,
          explanation: "The DOM owns the current value.",
        },
        {
          question: "What does defaultValue provide?",
          options: [
            "An initial value",
            "A permanently controlled value",
            "A database default",
            "A CSS value",
          ],
          correctIndex: 0,
          explanation: "defaultValue initializes an uncontrolled form control.",
        },
      ],
    },
    {
      id: "r10-async",
      title: "Async submission and pending UI",
      durationMinutes: 12,
      explanation: `
Form submissions often involve asynchronous work such as an API request.

The important mental model is:

<b>submit → validate → pending → success/error</b>

Users need feedback while asynchronous work is happening. Disable duplicate submissions when appropriate, show a pending state, and display useful errors.

React also supports modern form action patterns in current React environments. The exact APIs can vary by framework, so understand the underlying form lifecycle before relying on framework-specific helpers.
      `,
      diagram: `
Submit
  ↓
Validate
  ↓
Pending
 ├── success
 └── error
      `,
      codeExample: {
        title: "Async submission pattern",
        code: `
import { useState } from "react";

export function ContactForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] =
    useState<"idle" | "pending" | "success" | "error">("idle");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!email.includes("@")) {
      setStatus("error");
      return;
    }

    setStatus("pending");

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <button type="submit" disabled={status === "pending"}>
        {status === "pending" ? "Sending..." : "Send"}
      </button>

      {status === "success" && <p>Sent successfully.</p>}
      {status === "error" && <p>Something went wrong.</p>}
    </form>
  );
}
        `,
      },
      keyTakeaways: [
        "Async forms should represent pending, success, and error states.",
        "Prevent duplicate submissions when appropriate.",
        "Validate before starting expensive asynchronous work.",
        "Keep API behavior separate from presentation where practical.",
      ],
      commonMistakes: [
        "Leaving the submit button active during an async request.",
        "Showing no feedback while waiting.",
        "Ignoring failed requests.",
      ],
      quiz: [
        {
          question: "Why show a pending state?",
          options: [
            "To tell the user work is in progress",
            "To hide all errors",
            "To prevent React from rendering",
            "To change the URL",
          ],
          correctIndex: 0,
          explanation: "Pending feedback communicates that the submission is being processed.",
        },
        {
          question: "What should happen when an async submission fails?",
          options: [
            "Show useful error feedback",
            "Silently ignore it",
            "Reload the page always",
            "Disable the whole app",
          ],
          correctIndex: 0,
          explanation: "Users should receive clear feedback when submission fails.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is a controlled input?",
      options: [
        "An input whose value is controlled by React state",
        "An input controlled by CSS",
        "An input controlled by a database",
        "An input with no value",
      ],
      correctIndex: 0,
      explanation: "React state is the source of truth for a controlled input.",
    },
    {
      question: "Which event is used for form submission?",
      options: ["onSubmit", "onMount", "onRender", "onRoute"],
      correctIndex: 0,
      explanation: "onSubmit handles form submission.",
    },
    {
      question: "Why use preventDefault()?",
      options: [
        "To prevent default browser form navigation",
        "To stop React",
        "To clear state",
        "To disable inputs",
      ],
      correctIndex: 0,
      explanation: "It prevents the browser's default form submission behavior.",
    },
    {
      question: "What is an uncontrolled input?",
      options: [
        "An input whose current value is owned by the DOM",
        "An input with no browser behavior",
        "An input owned by CSS",
        "An input that cannot submit",
      ],
      correctIndex: 0,
      explanation: "The DOM owns the current value of an uncontrolled input.",
    },
    {
      question: "What does defaultValue do?",
      options: [
        "Sets the initial value of an uncontrolled input",
        "Continuously controls the value",
        "Submits the form",
        "Validates the input",
      ],
      correctIndex: 0,
      explanation: "defaultValue provides an initial value.",
    },
    {
      question: "What is FormData useful for?",
      options: [
        "Reading submitted form values",
        "Creating React components",
        "Styling inputs",
        "Managing routes",
      ],
      correctIndex: 0,
      explanation: "FormData provides access to submitted form fields.",
    },
    {
      question: "Why show pending UI?",
      options: [
        "To communicate that asynchronous work is in progress",
        "To hide errors",
        "To prevent all rendering",
        "To replace validation",
      ],
      correctIndex: 0,
      explanation: "Pending feedback tells the user that work is happening.",
    },
    {
      question: "What is a good async form flow?",
      options: [
        "Validate → pending → success/error",
        "Submit → ignore result",
        "Reload → validate",
        "Error → submit again automatically forever",
      ],
      correctIndex: 0,
      explanation: "A clear lifecycle makes asynchronous form behavior predictable.",
    },
  ],
  project: {
    name: "Profile Registration Form",
    goal: "Build a complete React profile registration form with validation and asynchronous submission feedback.",
    brief: "Create a semantic form for Rajan's profile containing name, email, role, location, bio, and availability. Practice controlled inputs, validation, FormData concepts, and pending/success/error UI.",
    steps: [
      "Create typed form state for name, email, role, location, bio, and availability.",
      "Use controlled inputs for the main fields.",
      "Use suitable HTML input types and semantic labels.",
      "Validate required fields and email format on submit.",
      "Display field or form-level validation feedback.",
      "Simulate an asynchronous API request.",
      "Show Sending... while the request is pending.",
      "Show a success message after a successful submission.",
      "Show an error message when the simulated request fails.",
    ],
    acceptance: [
      "The form contains all required profile fields.",
      "Inputs are controlled by React state.",
      "Submitting invalid data shows useful validation feedback.",
      "The submit button is disabled while the request is pending.",
      "The user sees success or error feedback after submission.",
      "The form uses semantic HTML and accessible labels.",
    ],
    stretch: [
      "Add password and confirm-password validation.",
      "Add a character counter for the bio.",
      "Reset the form after successful submission.",
      "Replace the simulated request with a real API endpoint.",
      "Create reusable Field and ErrorMessage components.",
    ],
  },
};
