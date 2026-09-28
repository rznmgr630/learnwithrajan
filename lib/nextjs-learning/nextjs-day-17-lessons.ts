import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_17_LESSONS: LessonDay = {
  day: 17,
  title: "Forms",
  totalMinutes: 78,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "nextjs-day17-html-forms",
      title: "HTML Forms and the Browser Form Model",
      durationMinutes: 15,
      explanation: `
Before using React Hook Form, Zod, or Server Actions, understand the HTML form itself. A form is a browser-native mechanism for collecting user input and submitting it.

A basic form looks like:

\`\`\`tsx
<form action="/signup" method="post">
  <label>
    Name
    <input name="name" />
  </label>

  <label>
    Email
    <input name="email" type="email" />
  </label>

  <button type="submit">Create account</button>
</form>
\`\`\`

The \`name\` attribute is important because it identifies the field when the form is serialized. Without a useful name, the server may not receive the field in the way you expect.

HTML also provides basic browser validation:

\`\`\`tsx
<input
  name="email"
  type="email"
  required
/>
\`\`\`

This can improve user experience, but it is not a security boundary. A user can bypass browser validation and send data directly to your server.

### Controlled and uncontrolled inputs

React can control input values through state:

\`\`\`tsx
const [email, setEmail] = useState("");

<input
  value={email}
  onChange={(event) => setEmail(event.target.value)}
/>
\`\`\`

This gives React direct control over the input state.

For many server-driven forms, however, you can allow the browser to manage the input and let the submitted FormData become the source of truth:

\`\`\`tsx
<form action={registerUser}>
  <input name="email" />
  <button type="submit">Register</button>
</form>
\`\`\`

Understanding this distinction helps you choose the simplest form architecture for the problem.
`,
      diagram: `
User
 |
 v
HTML Form
 |
 +--> input[name="email"]
 +--> input[name="password"]
 +--> button[type="submit"]
 |
 v
FormData
 |
 v
Server Action
`,
      codeExample: {
        title: "A native form with useful field names",
        code: `export default function SignupForm() {
  return (
    <form>
      <label>
        Name
        <input name="name" required />
      </label>

      <label>
        Email
        <input
          name="email"
          type="email"
          required
        />
      </label>

      <label>
        Password
        <input
          name="password"
          type="password"
          minLength={8}
          required
        />
      </label>

      <button type="submit">
        Create account
      </button>
    </form>
  );
}`,
      },
      keyTakeaways: [
        "HTML forms are the foundation for web form handling.",
        "The name attribute identifies submitted fields.",
        "Browser validation improves UX but cannot be trusted for security.",
        "Controlled inputs keep values in React state.",
        "Server-driven forms can often use native form behavior directly.",
      ],
      commonMistakes: [
        "Forgetting name attributes.",
        "Using browser validation as the only validation layer.",
        "Making every input controlled when it does not need to be.",
        "Ignoring labels and accessible form structure.",
      ],
      quiz: [
        {
          question: "Why is the name attribute important?",
          options: [
            "It controls CSS colors",
            "It identifies a form field in submitted form data",
            "It creates a database column",
            "It starts a Server Action",
          ],
          correctIndex: 1,
          explanation:
            "The name identifies the field when form data is submitted.",
        },
      ],
    },
    {
      id: "nextjs-day17-server-action-forms",
      title: "Server Actions + Forms and Form State",
      durationMinutes: 17,
      explanation: `
Next.js forms become especially useful when combined with Server Actions. Instead of creating a separate API endpoint for every simple form mutation, the form can invoke a server-side action.

For example:

\`\`\`tsx
<form action={registerUser}>
  <input name="name" />
  <input name="email" type="email" />
  <button type="submit">Register</button>
</form>
\`\`\`

The action can receive FormData:

\`\`\`ts
"use server";

export async function registerUser(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");

  // Validate and persist.
}
\`\`\`

A real form also needs state. Users should know whether submission is in progress and whether the operation succeeded or failed.

For example, a client component can use a form-status hook to access pending information:

\`\`\`tsx
"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending}>
      {pending ? "Creating..." : "Create account"}
    </button>
  );
}
\`\`\`

The form itself can remain responsible for submission while a small client component handles interactive pending UI.

### Why isolate client state?

You do not need to turn the entire page into a Client Component just because one submit button needs pending state. A small client boundary can handle the interactive part while the rest of the form remains server-oriented.
`,
      diagram: `
Server Component
      |
      v
    <form>
      |
      +--> Inputs
      |
      +--> Client SubmitButton
                |
                v
             pending
      |
      v
 Server Action
`,
      codeExample: {
        title: "Server Action form with a pending submit button",
        code: `// actions/register.ts
"use server";

export async function registerUser(formData: FormData) {
  const email = formData.get("email");

  if (typeof email !== "string") {
    return { success: false, error: "Email is required." };
  }

  // Persist user...

  return { success: true };
}

// SubmitButton.tsx
"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Creating account..." : "Create account"}
    </button>
  );
}`,
      },
      keyTakeaways: [
        "Server Actions integrate naturally with forms.",
        "FormData provides submitted field values to the action.",
        "Pending state communicates that a mutation is running.",
        "A small Client Component can provide interactive form behavior without converting the entire page to a client component.",
      ],
      commonMistakes: [
        "Disabling the entire page instead of only the controls that need pending behavior.",
        "Forgetting to handle a failed action result.",
        "Making every form component a Client Component unnecessarily.",
      ],
      quiz: [
        {
          question: "What does useFormStatus help you detect?",
          options: [
            "Database schema",
            "Whether a parent form submission is pending",
            "Current URL",
            "Server memory",
          ],
          correctIndex: 1,
          explanation:
            "useFormStatus provides status information about the associated form submission.",
        },
      ],
    },
    {
      id: "nextjs-day17-zod-validation",
      title: "Zod, Validation, and Field Errors",
      durationMinutes: 18,
      explanation: `
As forms become larger, manually checking every field can become repetitive. Zod is a schema validation library that lets you describe the expected shape of data and validate input against that schema.

For example:

\`\`\`ts
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});
\`\`\`

The schema describes the expected input. You can then parse the incoming data:

\`\`\`ts
const result = registerSchema.safeParse({
  name,
  email,
  password,
});

if (!result.success) {
  console.log(result.error.flatten());
}
\`\`\`

\`safeParse\` is useful for form handling because it returns a result rather than immediately throwing.

### FormData and Zod

FormData values can be strings or files, so you usually normalize the values before validating them:

\`\`\`ts
const input = {
  name: formData.get("name"),
  email: formData.get("email"),
  password: formData.get("password"),
};

const result = registerSchema.safeParse(input);
\`\`\`

If the schema fails, return field-specific errors:

\`\`\`ts
if (!result.success) {
  return {
    success: false,
    fieldErrors: result.error.flatten().fieldErrors,
  };
}
\`\`\`

This gives the UI enough information to show an error next to the appropriate field.

### Validation should be shared carefully

Client-side schemas can improve immediate feedback, while server-side validation remains authoritative. If you share a schema between client and server, make sure the schema itself does not contain server-only dependencies or secrets.
`,
      diagram: `
FormData
   |
   v
Normalize values
   |
   v
Zod schema
   |
 +--+----------------+
 |                   |
Valid              Invalid
 |                   |
 v                   v
Mutation          fieldErrors
                     |
                     v
                    UI
`,
      codeExample: {
        title: "Zod validation inside a Server Action",
        code: `import { z } from "zod";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is too short."),
  email: z.string().email("Invalid email."),
  password: z.string().min(8, "Password is too short."),
});

export async function registerUser(formData: FormData) {
  const result = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return {
      success: false,
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = result.data;

  // Create the user here.

  return {
    success: true,
    message: \`Account created for \${name}.\`,
  };
}`,
      },
      keyTakeaways: [
        "Zod lets you describe and validate data with schemas.",
        "safeParse is useful when validation failures are expected application results.",
        "Server-side Zod validation protects the mutation boundary.",
        "Field errors allow the UI to associate messages with specific inputs.",
        "Client validation can improve UX, but server validation remains authoritative.",
      ],
      commonMistakes: [
        "Validating only in the browser.",
        "Assuming a TypeScript type validates runtime input.",
        "Passing raw FormData values into code that expects normalized application data.",
        "Showing all validation errors as one generic message when field-level feedback would be clearer.",
      ],
      quiz: [
        {
          question: "What does Zod primarily provide?",
          options: [
            "Runtime data validation through schemas",
            "Database hosting",
            "CSS compilation",
            "Browser routing",
          ],
          correctIndex: 0,
          explanation:
            "Zod provides schemas that can validate runtime data.",
        },
      ],
    },
    {
      id: "nextjs-day17-react-hook-form",
      title: "React Hook Form and Choosing a Form Architecture",
      durationMinutes: 15,
      explanation: `
React Hook Form is a library designed to simplify form state and validation in React applications. It is particularly useful when forms contain many fields, conditional fields, client-side interactions, or complex validation flows.

A basic React Hook Form setup looks like:

\`\`\`tsx
"use client";

import { useForm } from "react-hook-form";

type FormValues = {
  name: string;
  email: string;
};

export function ProfileForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("name", {
          required: "Name is required",
        })}
      />

      {errors.name && <p>{errors.name.message}</p>}

      <input
        {...register("email", {
          required: "Email is required",
        })}
      />

      {errors.email && <p>{errors.email.message}</p>}

      <button disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
\`\`\`

React Hook Form is client-side form state management. It does not replace server-side validation.

A common architecture for a production form can therefore be:

\`\`\`text
React Hook Form
      |
      | client UX
      v
Zod / client validation
      |
      v
Server Action
      |
      | authoritative validation
      v
Zod / server validation
      |
      v
Database
\`\`\`

Do not automatically add React Hook Form to every form. For a small server-driven form, native HTML forms plus Server Actions may be simpler. For complex interactive forms, React Hook Form can provide useful control over field state, touched state, dirty state, submission state, and client-side validation.
`,
      diagram: `
Simple form:
HTML
  |
Server Action
  |
Database

Complex interactive form:
React Hook Form
  |
Client validation
  |
Server Action
  |
Server validation
  |
Database
`,
      codeExample: {
        title: "React Hook Form with field errors",
        code: `"use client";

import { useForm } from "react-hook-form";

type Values = {
  email: string;
};

export function EmailForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>();

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <input
        type="email"
        {...register("email", {
          required: "Email is required.",
        })}
      />

      {errors.email && (
        <p>{errors.email.message}</p>
      )}

      <button type="submit">Continue</button>
    </form>
  );
}`,
      },
      keyTakeaways: [
        "React Hook Form manages complex client-side form state.",
        "It is especially useful for large or highly interactive forms.",
        "React Hook Form does not replace server-side validation.",
        "Simple forms may not need a form library.",
        "A production architecture can combine React Hook Form, Zod, Server Actions, and database validation.",
      ],
      commonMistakes: [
        "Adding React Hook Form to every form regardless of complexity.",
        "Treating client-side React Hook Form validation as the security boundary.",
        "Duplicating complex business rules in both client and server code without a clear reason.",
      ],
      quiz: [
        {
          question: "What problem does React Hook Form primarily solve?",
          options: [
            "Database replication",
            "Client-side React form state and handling",
            "Server hosting",
            "API versioning",
          ],
          correctIndex: 1,
          explanation:
            "React Hook Form provides tools for managing form state and interactions in React.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What is the server's role in form validation?",
      options: [
        "It is the authoritative validation boundary",
        "It only displays CSS",
        "It is optional if HTML required is present",
        "It only runs React hooks",
      ],
      correctIndex: 0,
      explanation:
        "The server must validate submitted data because client-side validation can be bypassed.",
    },
    {
      question: "What does Zod provide?",
      options: [
        "Runtime schema validation",
        "A database",
        "A React renderer",
        "A browser",
      ],
      correctIndex: 0,
      explanation: "Zod provides runtime validation through schemas.",
    },
    {
      question: "What is a field error?",
      options: [
        "An error associated with a specific input field",
        "A database connection",
        "A CSS class",
        "A server port",
      ],
      correctIndex: 0,
      explanation:
        "Field errors let the UI show validation feedback beside the relevant input.",
    },
    {
      question: "When is React Hook Form particularly useful?",
      options: [
        "For every static HTML page",
        "For complex interactive forms and client-side form state",
        "Only for database migrations",
        "Only for server rendering",
      ],
      correctIndex: 1,
      explanation:
        "React Hook Form is useful when a form needs substantial client-side state and interaction management.",
    },
  ],

  project: {
    name: "Complete User Registration Form",
    goal: "Build a production-style registration form using Server Actions, Zod, and appropriate form state management.",
    brief: `
Build a registration experience with name, email, password, and password confirmation.

Use server-side Zod validation as the authoritative validation layer. Use React Hook Form when it adds value for client-side state and immediate feedback. Return field-level errors from the server and provide clear pending and success states.
`,
    steps: [
      "Create name, email, password, and confirm-password fields.",
      "Add accessible labels and useful input types.",
      "Create a Zod registration schema.",
      "Validate submitted data on the server.",
      "Check password and confirmation consistency.",
      "Return fieldErrors for invalid fields.",
      "Create the user only after validation succeeds.",
      "Add pending submission feedback.",
      "Display server-side field errors beside the relevant inputs.",
      "Display a safe success message after registration.",
      "Prevent duplicate submissions while the request is pending.",
    ],
    acceptance: [
      "All required fields are validated on the server.",
      "Invalid email addresses are rejected.",
      "Weak passwords are rejected.",
      "Password confirmation must match.",
      "Field-specific errors are displayed clearly.",
      "The submit button communicates pending state.",
      "Successful registration produces a safe success result.",
      "Client-side validation does not replace server-side validation.",
    ],
    stretch: [
      "Add password strength feedback.",
      "Add email availability checking.",
      "Hash the password before persistence.",
      "Add rate limiting concepts for registration attempts.",
      "Add an email verification workflow.",
    ],
  },
};
