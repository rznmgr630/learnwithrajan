import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_18_LESSONS: LessonDay = {
  day: 18,
  title: "Optimistic UI",
  totalMinutes: 68,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "nextjs-day18-optimistic-ui",
      title: "Optimistic Updates and useOptimistic",
      durationMinutes: 17,
      explanation: `
An optimistic UI updates the interface immediately, before the server confirms that a mutation succeeded. The idea is simple: when the application has a reasonable expectation that an operation will succeed, show the expected result immediately instead of making the user wait for the network round trip.

Imagine a todo application. Without an optimistic update:

\`\`\`text
Click "Complete"
      |
      v
Wait for server
      |
      v
Server responds
      |
      v
Todo becomes completed
\`\`\`

With an optimistic update:

\`\`\`text
Click "Complete"
      |
      +------------------+
      |                  |
      v                  v
Update UI now       Server mutation
      |                  |
      |                  v
      |             success/failure
      |                  |
      +--------<---------+
\`\`\`

React provides \`useOptimistic\` for representing an optimistic version of state while an action is in progress.

A simplified example:

\`\`\`tsx
"use client";

import { useOptimistic } from "react";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

const [optimisticTodos, updateOptimisticTodos] =
  useOptimistic(todos, (currentTodos, updatedTodo) =>
    currentTodos.map((todo) =>
      todo.id === updatedTodo.id
        ? { ...todo, completed: updatedTodo.completed }
        : todo
    )
  );
\`\`\`

The optimistic state is not the database truth. It is a temporary UI representation while the real mutation is running.

### When optimistic UI works well

Optimistic updates are most useful when:

- The expected result is easy to predict.
- The operation is usually successful.
- The action is small and reversible.
- Waiting for the server would make the UI feel slow.

Todo completion, liking a post, toggling a preference, or reordering a list can often be good candidates.

`,
      diagram: `
              User action
                  |
          +-------+-------+
          |               |
          v               v
     Optimistic UI     Server Action
          |               |
          |          +----+----+
          |          |         |
          |        success   failure
          |          |         |
          +----------+         |
                     |         |
                     v         v
                  Confirm   Rollback
`,
      codeExample: {
        title: "Optimistically toggling a todo",
        code: `"use client";

import { useOptimistic, startTransition } from "react";

type Todo = {
  id: string;
  completed: boolean;
};

export function TodoItem({
  todo,
  updateTodo,
}: {
  todo: Todo;
  updateTodo: (id: string, completed: boolean) => Promise<void>;
}) {
  const [optimisticTodo, setOptimisticTodo] =
    useOptimistic(todo);

  function toggle() {
    const nextCompleted = !todo.completed;

    startTransition(async () => {
      setOptimisticTodo({
        ...todo,
        completed: nextCompleted,
      });

      await updateTodo(todo.id, nextCompleted);
    });
  }

  return (
    <button onClick={toggle}>
      {optimisticTodo.completed ? "Completed" : "Complete"}
    </button>
  );
}`,
      },
      keyTakeaways: [
        "Optimistic UI shows an expected result before server confirmation.",
        "useOptimistic provides temporary optimistic state.",
        "Optimistic state is not the source of truth.",
        "The server still determines whether the mutation actually succeeded.",
        "Optimistic UI can make fast interactions feel significantly more responsive.",
      ],
      commonMistakes: [
        "Treating optimistic state as permanent database state.",
        "Using optimistic updates for operations with unpredictable outcomes.",
        "Ignoring what should happen when the server rejects the mutation.",
        "Forgetting that multiple rapid actions can complicate optimistic state.",
      ],
      quiz: [
        {
          question: "What is optimistic UI?",
          options: [
            "Waiting for the server before showing any change",
            "Showing the expected result before server confirmation",
            "Disabling JavaScript",
            "Caching every request forever",
          ],
          correctIndex: 1,
          explanation:
            "Optimistic UI immediately reflects the expected result while the server operation is pending.",
        },
      ],
    },
    {
      id: "nextjs-day18-pending-error",
      title: "Pending States and Error Handling",
      durationMinutes: 16,
      explanation: `
Optimistic UI does not eliminate the need for pending and error states. The user should still receive feedback when an operation is being processed, especially for actions that take longer than expected.

For example, a todo can temporarily display a changed checkbox while the request is pending. You may also disable repeated interactions or show a subtle status indicator.

A useful mental model is:

\`\`\`text
Idle
 |
 v
Pending + optimistic
 |             |
 | success     | failure
 v             v
Confirmed    Rollback/error
\`\`\`

### Error handling

Suppose the user marks a todo complete but the database rejects the mutation. The optimistic UI must be corrected.

There are two common strategies:

1. Roll the affected item back to its previous state.
2. Refetch/revalidate the authoritative data and let the server result replace the optimistic state.

The second approach can be useful when the mutation affects more than one piece of data or when the server performs business logic that changes the final result.

For example:

\`\`\`ts
try {
  await updateTodo(todo.id, true);
} catch {
  // Show an error and restore authoritative state.
}
\`\`\`

The exact implementation depends on how the mutation and data fetching are structured.

### Pending does not always mean "disable everything"

A good UX usually disables only the interaction that would create a duplicate or conflicting request. A todo list should not necessarily become completely unusable because one todo is being updated.
`,
      diagram: `
User clicks
   |
   v
Optimistic change
   |
   v
Pending
   |
 +--+-----------+
 |              |
Success       Failure
 |              |
 v              v
Keep          Roll back
change        + error
`,
      codeExample: {
        title: "A mutation with explicit failure handling",
        code: `async function completeTodo(id: string) {
  try {
    await updateTodoOnServer(id);

    // Keep optimistic state.
  } catch (error) {
    // Restore authoritative state.
    // Show a user-safe error message.
    console.error(error);
  }
}`,
      },
      keyTakeaways: [
        "Optimistic interactions still need pending and failure states.",
        "A failed mutation requires rollback or authoritative re-synchronization.",
        "Do not disable unrelated parts of the interface unnecessarily.",
        "Error messages should be useful to the user without exposing internal details.",
      ],
      commonMistakes: [
        "Ignoring failed mutations because the UI already changed.",
        "Showing a server stack trace to the user.",
        "Disabling the entire application for one pending operation.",
      ],
      quiz: [
        {
          question: "What should happen after an optimistic mutation fails?",
          options: [
            "Keep the fake state forever",
            "Rollback or synchronize with authoritative server state",
            "Delete the application",
            "Ignore the error",
          ],
          correctIndex: 1,
          explanation:
            "The UI must be brought back into agreement with the authoritative server state.",
        },
      ],
    },
    {
      id: "nextjs-day18-rollback",
      title: "Rollback Strategies and Keeping UI Consistent",
      durationMinutes: 17,
      explanation: `
Rollback means restoring the UI when an optimistic mutation does not succeed. The simplest rollback stores or derives the previous state and returns to it after failure.

For a single todo:

\`\`\`text
Before: completed = false
Optimistic: completed = true
Server fails
Rollback: completed = false
\`\`\`

However, real applications can have multiple mutations happening at the same time. Imagine the user quickly completes three todos. If request A finishes after request B, simply applying responses in arrival order can create confusing state.

This is why optimistic systems need a clear source of truth.

### Source of truth

The database/server state should remain authoritative:

\`\`\`text
Database
   |
   v
Authoritative server state
   |
   v
Application data
   |
   v
Optimistic UI
\`\`\`

Optimistic state is a temporary projection (a UI representation) of what we expect the server state to become.

### Revalidation as a recovery strategy

Sometimes the safest recovery strategy is to revalidate or refetch the relevant data. Instead of trying to manually reconstruct every possible state transition, let the server provide the current truth.

For example:

\`\`\`text
Optimistic update
      |
      v
Server mutation fails
      |
      v
Revalidate/refetch
      |
      v
Authoritative state
      |
      v
UI corrected
\`\`\`

This is especially useful when a mutation has side effects.

### UX considerations

Optimistic UI should feel honest. Do not make a destructive action appear permanently successful before the server confirms it. For operations such as deleting important data, consider confirmation, undo, or a clear pending state.

Also consider accessibility. Screen-reader users should receive meaningful status updates when an action succeeds or fails.
`,
      diagram: `
                 Database
                    |
                    v
             Server truth
                    |
                    v
              Application
                    |
          +---------+---------+
          |                   |
          v                   v
      Normal UI         Optimistic UI
                              |
                           temporary
                              |
                        mutation result
                              |
                   +----------+----------+
                   |                     |
                 success               failure
                   |                     |
                 keep               rollback/refetch
`,
      codeExample: {
        title: "Simple rollback pattern",
        code: `const previousCompleted = todo.completed;

// 1. Optimistically update UI
setTodo({
  ...todo,
  completed: true,
});

try {
  await updateTodoOnServer(todo.id, true);
} catch {
  // 2. Restore the previous value
  setTodo({
    ...todo,
    completed: previousCompleted,
  });
}`,
      },
      keyTakeaways: [
        "Rollback restores the UI after an optimistic mutation fails.",
        "The server/database remains the authoritative source of truth.",
        "Revalidation can be safer than manually reconstructing complex state.",
        "Concurrent mutations require careful handling.",
        "UX and accessibility should remain clear even when the UI is optimistic.",
      ],
      commonMistakes: [
        "Assuming requests always finish in the order they started.",
        "Treating optimistic state as authoritative.",
        "Trying to manually repair complicated state when refetching would be safer.",
        "Forgetting accessibility feedback for async status changes.",
      ],
      quiz: [
        {
          question: "What is the authoritative source of truth in a typical optimistic application?",
          options: ["Temporary UI state", "Database/server state", "CSS", "Browser history"],
          correctIndex: 1,
          explanation:
            "Optimistic state is temporary; the persisted server state is authoritative.",
        },
      ],
    },
    {
      id: "nextjs-day18-optimistic-architecture",
      title: "Designing a Reliable Optimistic Experience",
      durationMinutes: 13,
      explanation: `
Optimistic UI should be treated as a product and architecture decision, not just a React hook.

Before making an action optimistic, ask:

1. Can the expected result be predicted?
2. Is the operation usually successful?
3. Can the change be rolled back?
4. What should happen if the server rejects it?
5. Can multiple actions happen concurrently?
6. Does the mutation affect other data?
7. Is the action destructive?

For a todo completion toggle, the answers are usually straightforward. For a payment, permission change, or irreversible deletion, an optimistic interaction may require much more careful UX.

A robust architecture often looks like:

\`\`\`text
User action
    |
    v
Optimistic state
    |
    +--------------------+
    |                    |
    v                    v
Server Action       Pending UI
    |
    +--> Validate
    +--> Authorize
    +--> Mutate
    |
    v
Success / Failure
    |
 +--+----------------+
 |                   |
 v                   v
Confirm            Rollback/
                   Revalidate
\`\`\`

The goal is not simply to make the application appear faster. The goal is to reduce perceived latency while keeping the interface consistent with the real server state.
`,
      diagram: `
Fast UX
  +
Server truth
  +
Failure recovery
  +
Clear status
  |
  v
Reliable optimistic experience
`,
      codeExample: {
        title: "Choosing optimistic behavior",
        code: `// Good candidate:
// "Mark todo complete"
// The expected result is predictable and reversible.

// More caution needed:
// "Delete account"
// The operation is destructive and
// the consequences are much larger.

function shouldUseOptimisticUI(operation: {
  predictable: boolean;
  reversible: boolean;
  destructive: boolean;
}) {
  return (
    operation.predictable &&
    operation.reversible &&
    !operation.destructive
  );
}`,
      },
      keyTakeaways: [
        "Optimistic UI is a UX and architecture decision.",
        "Predictable and reversible operations are usually easier to make optimistic.",
        "Destructive operations require more careful design.",
        "A good optimistic architecture has a clear recovery path.",
        "The objective is lower perceived latency without losing correctness.",
      ],
      commonMistakes: [
        "Adding optimistic updates everywhere just because they feel fast.",
        "Ignoring destructive or irreversible operations.",
        "Not designing the failure state before implementing the optimistic state.",
      ],
      quiz: [
        {
          question: "Which operation is usually easier to make optimistic?",
          options: [
            "Irreversible account deletion",
            "Todo completion toggle",
            "Changing legal ownership",
            "Sending a payment",
          ],
          correctIndex: 1,
          explanation:
            "A todo completion toggle is usually predictable and reversible.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What does useOptimistic represent?",
      options: [
        "Permanent database state",
        "Temporary optimistic UI state",
        "A database transaction",
        "A server cache",
      ],
      correctIndex: 1,
      explanation:
        "useOptimistic helps represent a temporary expected state while an action is in progress.",
    },
    {
      question: "What should happen when an optimistic mutation fails?",
      options: [
        "Keep the incorrect UI forever",
        "Rollback or synchronize with server state",
        "Ignore the server",
        "Delete the cache permanently",
      ],
      correctIndex: 1,
      explanation:
        "The UI must eventually agree with authoritative server state.",
    },
    {
      question: "Which is an important optimistic UI consideration?",
      options: [
        "Failure recovery",
        "Removing validation",
        "Ignoring accessibility",
        "Exposing server errors",
      ],
      correctIndex: 0,
      explanation:
        "Optimistic interactions need a clear strategy for failure and recovery.",
    },
  ],

  project: {
    name: "Real-Time-Feeling Todo Application",
    goal: "Build a responsive todo application using optimistic updates while keeping server state authoritative.",
    brief: `
Build a todo application where completing and uncompleting a todo feels immediate.

Use useOptimistic for the visual update, a Server Action for the actual mutation, and a clear recovery strategy for failures. The application should distinguish between temporary optimistic state and persisted server state.
`,
    steps: [
      "Create a list of persisted todos.",
      "Add a Server Action for toggling completion.",
      "Use useOptimistic for immediate visual feedback.",
      "Show a subtle pending state for the active todo.",
      "Handle server failure.",
      "Rollback the todo or revalidate authoritative data after failure.",
      "Prevent conflicting duplicate interactions where necessary.",
      "Display a safe user-facing error message.",
      "Test multiple rapid todo interactions.",
    ],
    acceptance: [
      "Todo completion appears immediately.",
      "The real mutation still happens on the server.",
      "Failed mutations do not leave incorrect permanent UI state.",
      "The user can understand when an action is pending.",
      "The database/server remains the source of truth.",
      "The UI remains usable while another todo is updating.",
    ],
    stretch: [
      "Add optimistic todo creation.",
      "Add optimistic deletion with an undo action.",
      "Handle multiple concurrent mutations safely.",
      "Add accessible status announcements.",
      "Measure perceived interaction latency.",
    ],
  },
};
