import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_5_LESSONS: LessonDay = {
  day: 5,
  title: "Forms, Controlled Inputs, and Form State",
  totalMinutes: 60,
  difficulty: "Beginner",
  lessons: [
    {
      id: "r5-controlled-inputs",
      title: "Controlled inputs",
      durationMinutes: 12,
      explanation: `
A <b>controlled input</b> is a form element whose displayed value is controlled by React state.

Instead of letting the browser be the only source of truth, React stores the value:

<code>const [name, setName] = useState("");</code>

Then the input receives that value:

<code>value={name}</code>

And changes update the state:

<code>onChange={(event) =&gt; setName(event.target.value)}</code>

The flow is:

<b>Input event → state update → component render → input receives new value</b>

Controlled inputs make form data available to the component at all times. This is useful when validation, conditional UI, previews, formatting, or submission logic depends on what the user entered.
      `,
      diagram: `
User types
    ↓
onChange
    ↓
setName(...)
    ↓
React state changes
    ↓
component renders
    ↓
value={name}
    ↓
input displays latest value
      `,
      codeExample: {
        title: "A controlled text input",
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
        placeholder="Enter your name"
      />
    </label>
  );
}
        `,
      },
      keyTakeaways: [
        "Controlled inputs use React state as their source of truth.",
        "The value prop controls what the input displays.",
        "onChange updates state when the user edits the input.",
        "Controlled forms make current input values available to the component.",
      ],
      commonMistakes: [
        "Providing value without an onChange handler and making the field effectively read-only.",
        "Using a different state value than the one passed to value.",
        "Forgetting that input event values are strings.",
      ],
      quiz: [
        {
          question: "What makes an input controlled?",
          options: [
            "It uses React state for its value",
            "It has a placeholder",
            "It is inside a div",
            "It uses CSS",
          ],
          correctIndex: 0,
          explanation:
            "A controlled input receives its value from React state and updates that state through events.",
        },
        {
          question: "Which event is normally used for text input changes?",
          options: ["onClick", "onChange", "onLoad", "onFocusOnly"],
          correctIndex: 1,
          explanation:
            "React's onChange handler is used to respond to changes in text input values.",
        },
      ],
    },
    {
      id: "r5-form-events",
      title: "Form submission and preventDefault",
      durationMinutes: 12,
      explanation: `
HTML forms have browser behavior that occurs when a user submits them. A normal browser form submission can navigate or reload the page.

In a React application, you will often handle submission yourself.

Use <code>onSubmit</code> on the <code>&lt;form&gt;</code> element and call:

<code>event.preventDefault()</code>

This prevents the browser's default submission behavior.

The handler can then:
1. read the current state
2. validate the values
3. send data to an API later
4. show a success message
5. reset the form

Submit buttons should normally use <code>type="submit"</code> when they submit the form.
      `,
      diagram: `
<form>
   ↓
user clicks Submit
   ↓
onSubmit(event)
   ↓
preventDefault()
   ↓
validate
   ↓
submit/process data
      `,
      codeExample: {
        title: "Handling form submission",
        code: `
import { FormEvent, useState } from "react";

export function ContactForm() {
  const [email, setEmail] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log("Submitted:", email);
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

      <button type="submit">Submit</button>
    </form>
  );
}
        `,
      },
      keyTakeaways: [
        "Use onSubmit on the form instead of relying only on a button click.",
        "preventDefault() prevents the browser's default form submission behavior.",
        "Use type='submit' for the form's submit button.",
        "Submission logic can validate, transform, or send the current state.",
      ],
      commonMistakes: [
        "Handling form submission only with onClick on the button.",
        "Forgetting preventDefault when the application should handle the submission.",
        "Putting submit behavior on a button but not understanding the form event.",
      ],
      quiz: [
        {
          question: "Why is preventDefault() commonly used in React forms?",
          options: [
            "To stop React from rendering",
            "To stop the browser's default form submission behavior",
            "To clear all state",
            "To disable validation",
          ],
          correctIndex: 1,
          explanation:
            "preventDefault() prevents the browser's built-in submit action so React can handle the form.",
        },
        {
          question: "Where should normal React form submission logic live?",
          options: [
            "onSubmit on the form",
            "Only on a paragraph",
            "Inside CSS",
            "Only in useState",
          ],
          correctIndex: 0,
          explanation:
            "The form's onSubmit handler is the appropriate place to handle submission.",
        },
      ],
    },
    {
      id: "r5-multiple-fields",
      title: "Managing multiple fields",
      durationMinutes: 12,
      explanation: `
A real form usually has several fields.

You can use one state object for related form values:

<code>const [form, setForm] = useState({ name: "", email: "" });</code>

When updating one field, preserve the other fields:

<code>setForm(previous =&gt; ({ ...previous, name: event.target.value }));</code>

For many fields, a shared change handler can use the input's <code>name</code> attribute.

The important connection is:

<b>HTML name → state property</b>

This keeps the form predictable and avoids creating a separate handler for every field.
      `,
      diagram: `
<input name="name" />
       ↓
event.target.name = "name"
       ↓
{
  ...previous,
  [name]: value
}
       ↓
form state
      `,
      codeExample: {
        title: "One handler for multiple fields",
        code: `
import { ChangeEvent, useState } from "react";

type FormValues = {
  name: string;
  email: string;
};

export function SignupForm() {
  const [form, setForm] = useState<FormValues>({
    name: "",
    email: "",
  });

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  return (
    <form>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
      />

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        type="email"
      />
    </form>
  );
}
        `,
      },
      keyTakeaways: [
        "A form with related fields can use one state object.",
        "The name attribute can identify which state property should change.",
        "Use computed property syntax [name] when updating dynamic object keys.",
        "Use the functional updater when building the next object from previous state.",
      ],
      commonMistakes: [
        "Replacing the entire form object when updating one field.",
        "Using an input name that does not match the state property.",
        "Forgetting to spread the previous object.",
      ],
      quiz: [
        {
          question: "Why use ...previous when updating one property in a form object?",
          options: [
            "To preserve the other form fields",
            "To clear the form",
            "To disable TypeScript",
            "To submit the form",
          ],
          correctIndex: 0,
          explanation:
            "Spreading previous preserves the existing fields while replacing the selected property.",
        },
        {
          question: "What does [name]: value do inside an object literal?",
          options: [
            "Creates a dynamic property name",
            "Deletes the name property",
            "Creates a CSS selector",
            "Calls the name function",
          ],
          correctIndex: 0,
          explanation:
            "Computed property syntax lets the value of name determine which object property is updated.",
        },
      ],
    },
    {
      id: "r5-checkbox-select",
      title: "Checkboxes, selects, and different input types",
      durationMinutes: 12,
      explanation: `
Not every form control uses the <code>value</code> property in the same way.

For a checkbox, the important property is:

<code>checked</code>

Use:

<code>checked={accepted}</code>

and update it with:

<code>setAccepted(event.target.checked)</code>

For a select element, the selected option is represented by <code>value</code>.

Different controls therefore map to different DOM properties:
- text input → value
- textarea → value
- select → value
- checkbox → checked

Understanding this prevents a lot of beginner form bugs.
      `,
      diagram: `
Text input     → event.target.value
Textarea       → event.target.value
Select         → event.target.value
Checkbox       → event.target.checked
      `,
      codeExample: {
        title: "Checkbox and select",
        code: `
import { useState } from "react";

export function PreferencesForm() {
  const [accepted, setAccepted] = useState(false);
  const [role, setRole] = useState("backend");

  return (
    <form>
      <label>
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
        />
        Accept terms
      </label>

      <label>
        Role
        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
        >
          <option value="backend">Backend</option>
          <option value="frontend">Frontend</option>
          <option value="fullstack">Full-stack</option>
        </select>
      </label>
    </form>
  );
}
        `,
      },
      keyTakeaways: [
        "Checkboxes use checked for controlled state.",
        "Text inputs, textareas, and selects normally use value.",
        "Use event.target.checked for checkbox state.",
        "The same controlled-input idea applies across different form controls.",
      ],
      commonMistakes: [
        "Using checked for a text input.",
        "Reading checkbox state from event.target.value.",
        "Using an uncontrolled select while expecting React state to be the source of truth.",
      ],
      quiz: [
        {
          question: "Which property controls a checkbox?",
          options: ["value", "checked", "selectedText", "active"],
          correctIndex: 1,
          explanation: "Controlled checkboxes use the checked property.",
        },
        {
          question: "What should you read from a checkbox change event?",
          options: [
            "event.target.checked",
            "event.target.value only",
            "event.target.text",
            "event.target.selected",
          ],
          correctIndex: 0,
          explanation:
            "event.target.checked gives the checkbox's boolean checked state.",
        },
      ],
    },
    {
      id: "r5-validation",
      title: "Basic client-side validation",
      durationMinutes: 12,
      explanation: `
<b>Client-side validation</b> means checking form input in the browser before processing or sending it.

Validation improves the user experience, but it is not a security boundary. A server must validate submitted data again.

Start with simple rules:
- required fields
- minimum or maximum length
- valid email shape
- matching values
- allowed selections

For small forms, validation can be represented with an errors object.

Example:

<code>{ name: "Name is required", email: "Enter a valid email" }</code>

The UI can then render only the errors that exist.

Avoid making validation overly complex at this stage. First understand the data flow.
      `,
      diagram: `
Form state
   ↓
validate()
   ↓
errors object
   ↓
┌───────────────┐
│ valid         │ → submit/process
│ invalid       │ → show errors
└───────────────┘
      `,
      codeExample: {
        title: "Simple validation",
        code: `
type FormValues = {
  name: string;
  email: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(form: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!form.name.trim()) {
    errors.name = "Name is required";
  }

  if (!form.email.includes("@")) {
    errors.email = "Enter a valid email";
  }

  return errors;
}
        `,
      },
      keyTakeaways: [
        "Client-side validation checks data before processing it in the browser.",
        "Server-side validation is still required for security and correctness.",
        "An errors object can keep validation messages organized.",
        "Keep validation rules explicit and easy to understand.",
      ],
      commonMistakes: [
        "Treating client-side validation as a security mechanism.",
        "Showing errors before the user has meaningfully interacted with the form without a reason.",
        "Putting all validation logic directly into JSX.",
      ],
      quiz: [
        {
          question: "Is client-side validation enough to protect an API?",
          options: [
            "Yes",
            "No, the server must validate too",
            "Only for POST requests",
            "Only in TypeScript",
          ],
          correctIndex: 1,
          explanation:
            "Users can bypass browser validation, so the server must validate incoming data.",
        },
        {
          question: "What is a useful structure for multiple validation messages?",
          options: [
            "An errors object",
            "A CSS class only",
            "A random string",
            "A DOM node",
          ],
          correctIndex: 0,
          explanation:
            "An errors object provides a predictable place to store field-specific validation messages.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is a controlled input?",
      options: [
        "An input whose value is controlled by React state",
        "An input that cannot be clicked",
        "An input controlled only by CSS",
        "An input without a value",
      ],
      correctIndex: 0,
      explanation:
        "Controlled inputs receive their current value or checked state from React state.",
    },
    {
      question: "Which event is normally used to handle form submission?",
      options: ["onChange", "onSubmit", "onMouseMove", "onRender"],
      correctIndex: 1,
      explanation: "The form's onSubmit handler is used for submission logic.",
    },
    {
      question: "Why call event.preventDefault() in many React forms?",
      options: [
        "To prevent React state from changing",
        "To prevent the browser's default submit behavior",
        "To remove the form",
        "To stop TypeScript",
      ],
      correctIndex: 1,
      explanation:
        "It prevents the browser's normal form submission behavior so the application can handle it.",
    },
    {
      question: "Which property is normally used for a controlled checkbox?",
      options: ["value", "checked", "text", "selected"],
      correctIndex: 1,
      explanation: "Checkboxes are controlled through their checked property.",
    },
    {
      question: "What does the name attribute help with in a shared change handler?",
      options: [
        "It identifies which field should be updated",
        "It submits the form automatically",
        "It changes CSS",
        "It creates a React key",
      ],
      correctIndex: 0,
      explanation:
        "The name can match a property in the form state object.",
    },
    {
      question: "What should happen when updating one field in an object-based form state?",
      options: [
        "Replace the entire object with one field",
        "Preserve the other fields and update the selected property",
        "Mutate the object directly",
        "Delete all fields",
      ],
      correctIndex: 1,
      explanation:
        "Spread the previous object and replace only the field being changed.",
    },
    {
      question: "What is client-side validation?",
      options: [
        "Validation performed in the browser",
        "Validation performed only by the database",
        "Validation performed by CSS",
        "Validation performed by Git",
      ],
      correctIndex: 0,
      explanation:
        "Client-side validation happens in the browser before data is processed or sent.",
    },
    {
      question: "Why must a server validate data even if the frontend validates it?",
      options: [
        "The browser cannot display errors",
        "Clients can bypass frontend validation",
        "React cannot use forms",
        "TypeScript automatically removes validation",
      ],
      correctIndex: 1,
      explanation:
        "Frontend code runs on the client and can be bypassed, so the server must enforce its own rules.",
    },
  ],
  project: {
    name: "Profile Registration Form",
    goal: "Build a complete controlled React form with multiple fields, validation, and a clean submission flow.",
    brief:
      "Create a profile registration form for a developer. The form should collect a name, email, role, city, short bio, and terms acceptance. Use <b>controlled inputs, an object-based form state, onSubmit, preventDefault, checkbox state, select state, and basic client-side validation</b>.",
    steps: [
      "Create a FormValues type containing name, email, role, city, bio, and acceptedTerms.",
      "Store all form values in one useState object.",
      "Create a shared handleChange function for text inputs and the select field.",
      "Handle the checkbox separately using event.target.checked.",
      "Submit the form through onSubmit and call preventDefault().",
      "Create a validate function that checks required fields, a basic email rule, bio length, and terms acceptance.",
      "Store validation messages in an errors object and display each message near the relevant field.",
      "When the form is valid, display a small success message or profile preview using the submitted state.",
    ],
    acceptance: [
      "All text inputs are controlled by React state.",
      "The role select is controlled and updates the form state.",
      "The terms checkbox uses checked and event.target.checked.",
      "Submitting the form does not reload or navigate the page.",
      "Invalid fields show clear validation messages.",
      "The server-validation limitation is understood: this project only demonstrates client-side validation.",
    ],
    stretch: [
      "Add a character counter for the bio using a derived value.",
      "Disable submission while required fields are obviously incomplete.",
      "Add a reset button that restores the initial form state.",
      "Extract a reusable FormField component without moving the form state out of the parent.",
    ],
  },
};
