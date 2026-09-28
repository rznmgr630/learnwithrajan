import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_16_LESSONS: LessonDay = {
  day: 16,
  title: "Server Actions",
  totalMinutes: 72,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "nextjs-day16-server-actions",
      title: "Server Actions and use server",
      durationMinutes: 16,
      explanation: `
Server Actions are asynchronous server-side functions that can be called from supported React and Next.js UI interactions. They are useful when the browser needs to ask the server to perform a mutation, such as creating a record, updating a profile, deleting a comment, or submitting a form.

The important idea is that the function itself runs on the server. You do not need to expose every mutation as a manually written REST endpoint just to let your UI call it.

For example, a server action can be defined in a dedicated server file:

\`\`\`ts
// app/actions/users.ts
"use server";

export async function createUser(formData: FormData) {
  const name = formData.get("name");

  if (typeof name !== "string" || !name.trim()) {
    return { success: false, error: "Name is required." };
  }

  // Database mutation would happen here.
  console.log("Creating user:", name);

  return { success: true };
}
\`\`\`

The \`"use server"\` directive tells Next.js that the exported function is intended to be executed on the server. Server Actions are therefore a good place for operations that need trusted server-side access.

You can also define a server action inside a Server Component file, but the action itself must be marked appropriately. Keeping actions in a separate actions/ directory is often easier to organize as an application grows.

### Server Action vs normal function

A normal function is simply a JavaScript function. A Server Action participates in the React/Next.js server-action mechanism and can be invoked through supported action APIs and form action attributes.

Do not think of Server Actions as magic database functions. They are still application code. You must validate input, handle failures, authorize the operation, and perform the mutation safely.

### Why mutations belong on the server

Consider changing a user's email address. The browser can send the requested value, but the server must decide whether the current user is actually allowed to make that change.

A useful flow is:

\`\`\`text
User interaction
      |
      v
Client / Form
      |
      v
Server Action
      |
      +--> Authentication
      |
      +--> Authorization
      |
      +--> Validation
      |
      +--> Database mutation
      |
      v
Result
\`\`\`

The browser should not be trusted to decide whether a mutation is allowed.
`,
      diagram: `
Browser
  |
  | submit / action call
  v
Server Action
  |
  +--> Validate input
  +--> Check permissions
  +--> Mutate database
  |
  v
Result returned to UI
`,
      codeExample: {
        title: "A basic Server Action",
        code: `// app/actions/todos.ts
"use server";

export async function createTodo(formData: FormData) {
  const title = formData.get("title");

  if (typeof title !== "string" || title.trim().length < 3) {
    return {
      success: false,
      error: "Title must contain at least 3 characters.",
    };
  }

  // await db.todo.create({ data: { title } });

  return {
    success: true,
    message: "Todo created.",
  };
}`,
      },
      keyTakeaways: [
        "Server Actions are server-side functions designed for supported UI mutations and interactions.",
        "\"use server\" marks server action code for server execution.",
        "Server Actions are especially useful for mutations.",
        "Authentication, authorization, and validation still belong in the server-side logic.",
        "A Server Action does not remove the need for proper security and error handling.",
      ],
      commonMistakes: [
        "Trusting values sent by the browser without validation.",
        "Assuming a Server Action automatically authorizes the current user.",
        "Putting sensitive credentials into client-side code.",
        "Using Server Actions for every possible read operation without considering the application's data-fetching architecture.",
      ],
      quiz: [
        {
          question: "Where does a Server Action execute?",
          options: ["Only in the browser", "On the server", "Inside CSS", "Inside the database"],
          correctIndex: 1,
          explanation: "Server Actions are designed to execute server-side.",
        },
        {
          question: "What does \"use server\" communicate?",
          options: [
            "The function should be treated as CSS",
            "The code is intended for server execution",
            "The page should be static",
            "The browser should cache the function",
          ],
          correctIndex: 1,
          explanation: "\"use server\" is the directive used for Server Action/server-only execution semantics.",
        },
      ],
    },
    {
      id: "nextjs-day16-form-actions",
      title: "Form Actions, Mutations, and Progressive Enhancement",
      durationMinutes: 17,
      explanation: `
Server Actions work particularly well with HTML forms. A form can submit a FormData payload to an action without requiring you to manually build a JSON request for every simple mutation.

For example:

\`\`\`tsx
// app/todos/page.tsx
import { createTodo } from "@/app/actions/todos";

export default function TodoPage() {
  return (
    <form action={createTodo}>
      <input name="title" placeholder="Todo title" />
      <button type="submit">Add todo</button>
    </form>
  );
}
\`\`\`

When the form is submitted, the browser form fields become FormData and the server action receives them.

This is different from manually writing:

\`\`\`ts
await fetch("/api/todos", {
  method: "POST",
  body: JSON.stringify({ title }),
});
\`\`\`

Both approaches can be useful, but Server Actions can make mutations feel closer to normal function calls while still executing on the server.

### Mutation

A mutation changes data. Examples include:

- Creating a user
- Updating a profile
- Creating a post
- Deleting a comment
- Marking a notification as read

A read asks for information; a mutation changes information.

### Progressive enhancement

Progressive enhancement means the application should provide a useful experience using fundamental web capabilities, while richer JavaScript behavior can improve the experience when available.

A normal HTML form already knows how to submit data. Server Actions can integrate with that form model so the application does not have to reinvent every form submission as a client-side fetch.

For example, start with:

\`\`\`tsx
<form action={createTodo}>
  <input name="title" />
  <button type="submit">Create</button>
</form>
\`\`\`

Then later add pending UI, client-side validation, optimistic updates, or richer error presentation where necessary.

This layered approach helps you distinguish the core mutation from the user experience around that mutation.
`,
      diagram: `
HTML Form
   |
   | FormData
   v
Server Action
   |
   +--> Validate
   +--> Authorize
   +--> Mutate
   |
   v
Result
   |
   v
Updated UI
`,
      codeExample: {
        title: "Submitting a form directly to a Server Action",
        code: `// app/actions/profile.ts
"use server";

export async function updateProfile(formData: FormData) {
  const displayName = formData.get("displayName");

  if (typeof displayName !== "string" || !displayName.trim()) {
    return { success: false, error: "Display name is required." };
  }

  // await db.user.update(...);

  return { success: true };
}

// app/profile/page.tsx
import { updateProfile } from "@/app/actions/profile";

export default function ProfilePage() {
  return (
    <form action={updateProfile}>
      <label>
        Display name
        <input name="displayName" />
      </label>

      <button type="submit">Save profile</button>
    </form>
  );
}`,
      },
      keyTakeaways: [
        "Forms can submit directly to Server Actions.",
        "FormData is a convenient representation of submitted form fields.",
        "Mutations change application data.",
        "Progressive enhancement starts with a functional web interaction and adds richer behavior when useful.",
        "A Server Action should contain the trusted mutation logic rather than relying on the browser.",
      ],
      commonMistakes: [
        "Using an input without a name and expecting it to appear in FormData.",
        "Treating client-side validation as a security boundary.",
        "Returning sensitive server information in an error.",
        "Forgetting that a mutation can fail even when the form itself is valid.",
      ],
      quiz: [
        {
          question: "What object commonly contains submitted HTML form fields?",
          options: ["FormData", "URLConfig", "ReactNode", "HeadersOnly"],
          correctIndex: 0,
          explanation: "HTML form submissions can be represented as FormData.",
        },
        {
          question: "Which operation is a mutation?",
          options: ["Displaying a post", "Creating a post", "Reading a product", "Rendering a heading"],
          correctIndex: 1,
          explanation: "Creating a post changes application data, so it is a mutation.",
        },
      ],
    },
    {
      id: "nextjs-day16-validation-errors",
      title: "Server Validation, Errors, and Action Results",
      durationMinutes: 16,
      explanation: `
Validation is the process of checking whether input satisfies the rules required by your application. Server-side validation is essential because the server must not trust data just because a browser sent it.

For example, a registration action might check:

\`\`\`ts
const email = formData.get("email");

if (typeof email !== "string" || !email.includes("@")) {
  return {
    success: false,
    error: "Please provide a valid email address.",
  };
}
\`\`\`

This validation protects the server even if someone bypasses your UI and sends a request manually.

### Validation layers

Client-side validation improves user experience because errors can appear quickly. Server-side validation protects application correctness and security.

A common architecture is:

\`\`\`text
User
 |
 v
Client validation
 |       \
 | valid  \ invalid
 v         v
Server   Show error
 |
 v
Server validation
 |       \
 | valid  \ invalid
 v         v
Mutation  Return error
\`\`\`

Never rely only on the first validation layer.

### Returning errors

For expected validation failures, returning structured data is often more useful than throwing a generic error.

For example:

\`\`\`ts
return {
  success: false,
  fieldErrors: {
    email: "Enter a valid email address.",
    password: "Password must be at least 8 characters.",
  },
};
\`\`\`

The UI can then map those errors to the appropriate fields.

Unexpected failures, such as a database outage, should be handled separately from normal validation errors. You should log enough information on the server for debugging while returning a safe message to the user.

### Authorization

Validation answers "Is this input valid?" Authorization answers "Is this user allowed to perform this operation?"

For example:

\`\`\`ts
if (!session?.user) {
  return { success: false, error: "Authentication required." };
}

if (session.user.id !== requestedUserId) {
  return { success: false, error: "You are not allowed to update this user." };
}
\`\`\`

These checks belong close to the mutation logic because the server is the final authority.
`,
      diagram: `
                    Server Action
                         |
             +-----------+-----------+
             |                       |
          Validate                Authorize
             |                       |
          invalid                  denied
             |                       |
             +----------+------------+
                        |
                    safe mutation
                        |
                        v
                     Database
`,
      codeExample: {
        title: "Structured validation result",
        code: `"use server";

type ActionResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      fieldErrors?: Record<string, string>;
      error?: string;
    };

export async function registerUser(
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get("email");
  const password = formData.get("password");

  const fieldErrors: Record<string, string> = {};

  if (typeof email !== "string" || !email.includes("@")) {
    fieldErrors.email = "Enter a valid email.";
  }

  if (typeof password !== "string" || password.length < 8) {
    fieldErrors.password = "Password must be at least 8 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      fieldErrors,
    };
  }

  // Perform authenticated/authorized mutation here.

  return {
    success: true,
    message: "Registration completed.",
  };
}`,
      },
      keyTakeaways: [
        "Server-side validation is mandatory for trusted application logic.",
        "Client-side validation is mainly a user-experience improvement.",
        "Validation and authorization solve different problems.",
        "Structured action results make expected form errors easier to display.",
        "Unexpected server failures should not expose internal implementation details.",
      ],
      commonMistakes: [
        "Trusting HTML required attributes as the only validation.",
        "Checking authorization only in the client UI.",
        "Returning database error details directly to users.",
        "Treating every expected validation error as an unexpected exception.",
      ],
      quiz: [
        {
          question: "Why is server-side validation necessary?",
          options: [
            "Because browsers cannot display forms",
            "Because the server cannot trust client input",
            "Because TypeScript validates database records",
            "Because CSS requires it",
          ],
          correctIndex: 1,
          explanation:
            "Any client can potentially bypass browser validation, so the server must validate input itself.",
        },
        {
          question: "What question does authorization answer?",
          options: [
            "Is the email syntactically valid?",
            "Is the CSS correct?",
            "Is this user allowed to perform this operation?",
            "Is the page static?",
          ],
          correctIndex: 2,
          explanation:
            "Authorization determines whether an authenticated user has permission to perform an operation.",
        },
      ],
    },
    {
      id: "nextjs-day16-action-architecture",
      title: "Designing Reliable Server Action Mutations",
      durationMinutes: 13,
      explanation: `
A Server Action is only one part of a mutation architecture. In a production application, it should usually coordinate validation, authentication, authorization, business rules, persistence, and cache/UI updates.

A useful mental model is:

\`\`\`text
Form / UI
   |
   v
Server Action
   |
   +--> Parse input
   +--> Validate
   +--> Authenticate
   +--> Authorize
   +--> Business rules
   +--> Database transaction
   +--> Revalidate affected UI
   |
   v
Safe result
\`\`\`

Do not put every piece of application logic into one huge action. As an application grows, extract reusable business logic into services or domain functions.

For example:

\`\`\`ts
"use server";

export async function createPost(formData: FormData) {
  const input = parseCreatePostInput(formData);

  if (!input.success) {
    return input;
  }

  const session = await requireSession();

  const post = await postService.create({
    authorId: session.user.id,
    title: input.data.title,
    content: input.data.content,
  });

  return {
    success: true,
    postId: post.id,
  };
}
\`\`\`

The action coordinates the request, while the service contains reusable business logic.

When a mutation changes data shown on another page, the application may also need to refresh or revalidate the affected UI. This is where the cache and revalidation concepts from earlier days become important.

The most important production principle is: a Server Action is not a substitute for architecture. It is a server-side entry point into your application's mutation flow.
`,
      diagram: `
UI
 |
 v
Server Action
 |
 +--> Input parsing
 +--> Validation
 +--> Auth/AuthZ
 |
 v
Service Layer
 |
 v
Repository / ORM
 |
 v
Database
 |
 v
Revalidation
 |
 v
Updated UI
`,
      codeExample: {
        title: "Thin Server Action",
        code: `"use server";

export async function createPost(formData: FormData) {
  const input = parseCreatePostInput(formData);

  if (!input.success) {
    return input;
  }

  const session = await requireSession();

  const post = await postService.create({
    authorId: session.user.id,
    title: input.data.title,
    content: input.data.content,
  });

  return {
    success: true,
    postId: post.id,
  };
}

// The action coordinates the workflow.
// Validation and business logic can live
// in reusable server-side modules.`,
      },
      keyTakeaways: [
        "Server Actions are entry points, not an entire application architecture.",
        "Keep actions understandable and avoid turning them into huge functions.",
        "Authentication and authorization should happen before sensitive mutations.",
        "Reusable business logic can live in service/domain modules.",
        "Mutations may require UI revalidation after data changes.",
      ],
      commonMistakes: [
        "Putting database queries, validation, authorization, and all business rules into one enormous action.",
        "Assuming a successful database mutation automatically updates every cached page.",
        "Forgetting authorization because the button is hidden from unauthorized users.",
      ],
      quiz: [
        {
          question: "What is a good responsibility for a Server Action?",
          options: [
            "Coordinate a server-side mutation workflow",
            "Replace the database",
            "Store CSS",
            "Handle every piece of business logic in one function",
          ],
          correctIndex: 0,
          explanation:
            "A Server Action can coordinate input handling, authorization, business logic, persistence, and the resulting UI update.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What is a Server Action primarily useful for?",
      options: [
        "Changing server-side application data from supported UI interactions",
        "Styling components",
        "Replacing TypeScript",
        "Creating CSS animations",
      ],
      correctIndex: 0,
      explanation: "Server Actions are especially useful for server-side mutations.",
    },
    {
      question: "Why must Server Actions validate input?",
      options: [
        "Because browser input can be bypassed or manipulated",
        "Because HTML cannot have inputs",
        "Because React requires it for rendering",
        "Because databases cannot store strings",
      ],
      correctIndex: 0,
      explanation:
        "The server is the trusted boundary, so it must validate data independently of client-side checks.",
    },
    {
      question: "Which is an authorization check?",
      options: [
        "Checking whether an email contains @",
        "Checking whether a user owns the record they are editing",
        "Checking whether a password has 8 characters",
        "Checking whether a title is empty",
      ],
      correctIndex: 1,
      explanation:
        "Authorization determines whether the current user is permitted to perform an operation.",
    },
    {
      question: "What does progressive enhancement mean in this context?",
      options: [
        "Starting with a functional web interaction and adding richer behavior when useful",
        "Disabling JavaScript permanently",
        "Only using client-side fetch",
        "Removing HTML forms",
      ],
      correctIndex: 0,
      explanation:
        "Progressive enhancement starts with a solid baseline interaction and layers richer behavior on top.",
    },
    {
      question: "What should happen when a normal validation error occurs?",
      options: [
        "Expose the database stack trace",
        "Return structured, user-safe validation information",
        "Delete the user's account",
        "Ignore the error",
      ],
      correctIndex: 1,
      explanation:
        "Expected validation failures should be represented in a way the UI can safely display.",
    },
  ],

  project: {
    name: "Server Action Todo Manager",
    goal: "Build a todo manager using Server Actions for server-side mutations.",
    brief: `
Create a small todo application where users can create, complete, and delete todos.

Use Server Actions for the mutations. Keep validation on the server and return structured results for expected errors. The project should demonstrate the difference between a browser interaction and trusted server-side mutation logic.
`,
    steps: [
      "Create a todo list page.",
      "Create a Server Action for adding a todo.",
      "Read the title from FormData.",
      "Validate the title on the server.",
      "Create a Server Action for completing a todo.",
      "Create a Server Action for deleting a todo.",
      "Return structured success and error results.",
      "Add authentication/authorization checks conceptually or through your chosen auth layer.",
      "Revalidate the affected UI after mutations.",
      "Keep reusable business logic outside the action when it starts becoming complex.",
    ],
    acceptance: [
      "Todos can be created through a form.",
      "Todo creation is handled by a Server Action.",
      "Invalid titles are rejected server-side.",
      "Complete and delete mutations are also server-side.",
      "Expected errors can be displayed safely.",
      "The UI reflects successful mutations.",
      "No sensitive server credentials are exposed to client code.",
    ],
    stretch: [
      "Add pending UI.",
      "Add optimistic todo creation.",
      "Add field-level validation.",
      "Add database persistence with Prisma or Drizzle.",
      "Add authentication and per-user todo ownership.",
    ],
  },
};
