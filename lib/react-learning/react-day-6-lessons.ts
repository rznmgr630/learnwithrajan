import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_6_LESSONS: LessonDay = {
  day: 6,
  title: "Props, Component Communication, and Composition",
  totalMinutes: 60,
  difficulty: "Beginner",
  lessons: [
    {
      id: "r6-props",
      title: "Props: passing data to components",
      durationMinutes: 12,
      explanation: `
<b>Props</b> (short for properties) are values passed from a parent component to a child component.

Props are how components communicate data downward.

For example, a parent can render <code>&lt;Profile name="Rajan" city="Tokyo" /&gt;</code>. The Profile component receives those values as an object.

Props should be treated as read-only by the receiving component. If a child needs to request a change, the parent can pass a function as a prop.

Think of props as inputs to a component:

<b>Parent → props → Child</b>

This makes components reusable because the same component can display different data depending on the props it receives.
      `,
      diagram: `
Parent
  │
  │ name="Rajan"
  │ city="Tokyo"
  ↓
Profile
  │
  ├── name
  └── city
      `,
      codeExample: {
        title: "Typed props",
        code: `
type ProfileProps = {
  name: string;
  city: string;
};

function Profile({ name, city }: ProfileProps) {
  return (
    <article>
      <h2>{name}</h2>
      <p>{city}</p>
    </article>
  );
}

export function App() {
  return <Profile name="Rajan" city="Tokyo" />;
}
        `,
      },
      keyTakeaways: [
        "Props are values passed from a parent to a child.",
        "Props make components reusable and configurable.",
        "A child should treat props as read-only.",
        "TypeScript can describe the shape of props.",
      ],
      commonMistakes: [
        "Trying to modify a prop directly.",
        "Using unclear prop names.",
        "Using any instead of describing the actual prop types.",
      ],
      quiz: [
        {
          question: "What are props used for?",
          options: [
            "Passing data from a parent to a child",
            "Changing CSS only",
            "Replacing all state",
            "Creating database tables",
          ],
          correctIndex: 0,
          explanation:
            "Props are the standard way for a parent to provide data to a child component.",
        },
        {
          question: "Can a child directly modify a prop?",
          options: ["Yes", "No", "Only strings", "Only arrays"],
          correctIndex: 1,
          explanation:
            "Props should be treated as read-only by the receiving component.",
        },
      ],
    },
    {
      id: "r6-children",
      title: "The children prop and composition",
      durationMinutes: 12,
      explanation: `
React has a special prop called <code>children</code>. It represents whatever JSX is placed between a component's opening and closing tags.

For example:

<code>&lt;Card&gt;Hello&lt;/Card&gt;</code>

The Card component can render that content through <code>children</code>.

This is called <b>composition</b> (building larger components by combining smaller components).

Instead of making Card know every possible piece of content it might display, the parent decides what goes inside it.

This makes reusable components flexible without creating many special-purpose props.
      `,
      diagram: `
<Card>
   ↓
children
   ↓
┌───────────────────┐
│ Profile content   │
│ Buttons            │
│ Images             │
└───────────────────┘
      `,
      codeExample: {
        title: "Reusable Card with children",
        code: `
import type { ReactNode } from "react";

type CardProps = {
  title: string;
  children: ReactNode;
};

export function Card({ title, children }: CardProps) {
  return (
    <section>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}

export function Profile() {
  return (
    <Card title="Profile">
      <p>Rajan Magar</p>
      <p>Software Engineer</p>
    </Card>
  );
}
        `,
      },
      keyTakeaways: [
        "children represents nested JSX passed into a component.",
        "ReactNode is a common TypeScript type for renderable React content.",
        "Composition lets parents control what reusable components contain.",
        "children can be more flexible than many specialized props.",
      ],
      commonMistakes: [
        "Forgetting to render children.",
        "Using an unnecessarily narrow children type.",
        "Creating many props when composition would be simpler.",
      ],
      quiz: [
        {
          question: "What does children represent?",
          options: [
            "The component's CSS",
            "The JSX nested inside the component",
            "The component's state",
            "Only text",
          ],
          correctIndex: 1,
          explanation:
            "children represents the content placed between a component's opening and closing tags.",
        },
        {
          question: "What is composition?",
          options: [
            "Combining smaller components to build larger UI",
            "Writing CSS only",
            "Deleting components",
            "Changing browser settings",
          ],
          correctIndex: 0,
          explanation:
            "Composition is a core React pattern for combining reusable components.",
        },
      ],
    },
    {
      id: "r6-callbacks",
      title: "Passing functions as props",
      durationMinutes: 12,
      explanation: `
Props can contain functions as well as normal data.

A parent can pass a callback (a function supplied to another component to be called later) to a child.

This lets the child communicate an action back to the parent without directly modifying the parent's state.

The pattern is:

<b>Parent owns state → Parent passes callback → Child calls callback → Parent updates state</b>

This is also related to <b>lifting state up</b> (moving shared state to the closest common parent that needs to control it).
      `,
      diagram: `
Parent
  │
  │ onDelete()
  ↓
Child
  │
  │ click
  ↓
onDelete()
  │
  ↓
Parent updates state
      `,
      codeExample: {
        title: "Callback prop",
        code: `
type DeleteButtonProps = {
  onDelete: () => void;
};

function DeleteButton({ onDelete }: DeleteButtonProps) {
  return (
    <button type="button" onClick={onDelete}>
      Delete
    </button>
  );
}

export function Todo() {
  function handleDelete() {
    console.log("Delete requested");
  }

  return <DeleteButton onDelete={handleDelete} />;
}
        `,
      },
      keyTakeaways: [
        "Functions can be passed through props.",
        "A child can call a callback to notify its parent about an action.",
        "The parent normally owns state that multiple components need to coordinate.",
        "Lifting state up creates a shared source of truth.",
      ],
      commonMistakes: [
        "Calling the callback during rendering instead of passing the function.",
        "Trying to modify parent state directly from the child.",
        "Putting shared state in one child when several components need it.",
      ],
      quiz: [
        {
          question: "How can a child notify a parent about an action?",
          options: [
            "By directly modifying the parent's state",
            "By calling a callback passed as a prop",
            "By changing CSS",
            "By reloading the page",
          ],
          correctIndex: 1,
          explanation:
            "The parent can pass a function prop that the child calls when an action occurs.",
        },
        {
          question: "What does lifting state up mean?",
          options: [
            "Moving shared state to a suitable common parent",
            "Moving state into CSS",
            "Deleting state",
            "Putting state in every child",
          ],
          correctIndex: 0,
          explanation:
            "Shared state is moved upward so the components that need it can use one source of truth.",
        },
      ],
    },
    {
      id: "r6-component-design",
      title: "Designing reusable components",
      durationMinutes: 12,
      explanation: `
Good React component design is not about making every tiny piece its own component.

A useful component usually has:
- a clear responsibility
- a predictable prop interface
- minimal internal state
- reusable behavior or presentation
- a meaningful composition boundary

For example:

<code>ProfilePage → ProfileHeader + SkillList + ContactCard</code>

Each child should receive only the data or callbacks it needs.

A strong component tree makes data flow easy to understand:

<b>State lives where it is needed, props flow down, callbacks communicate actions upward.</b>
      `,
      diagram: `
ProfilePage
   │
   ├── ProfileHeader
   │       └── name, city
   │
   ├── SkillList
   │       └── skills
   │
   └── ContactCard
           └── email, onContact
      `,
      codeExample: {
        title: "Component composition",
        code: `
type ProfileHeaderProps = {
  name: string;
  city: string;
};

function ProfileHeader({ name, city }: ProfileHeaderProps) {
  return (
    <header>
      <h1>{name}</h1>
      <p>{city}</p>
    </header>
  );
}

type SkillListProps = {
  skills: string[];
};

function SkillList({ skills }: SkillListProps) {
  return (
    <ul>
      {skills.map((skill) => (
        <li key={skill}>{skill}</li>
      ))}
    </ul>
  );
}

export function ProfilePage() {
  const skills = ["Node.js", "React", "Laravel"];

  return (
    <main>
      <ProfileHeader name="Rajan Magar" city="Tokyo" />
      <SkillList skills={skills} />
    </main>
  );
}
        `,
      },
      keyTakeaways: [
        "Components should have clear responsibilities.",
        "Props define how a component receives external data and behavior.",
        "Composition is useful for building larger interfaces from smaller pieces.",
        "Avoid passing unrelated application state through every component.",
      ],
      commonMistakes: [
        "Creating components with too many unrelated responsibilities.",
        "Passing the entire application state to every child.",
        "Creating abstractions before there is a real repeated pattern.",
      ],
      quiz: [
        {
          question: "What should a reusable component generally have?",
          options: [
            "A clear responsibility and predictable interface",
            "Every piece of application state",
            "Many unrelated behaviors",
            "No props ever",
          ],
          correctIndex: 0,
          explanation:
            "A clear responsibility and prop interface make components easier to reuse and maintain.",
        },
        {
          question: "Where should shared state usually live?",
          options: [
            "In a random child",
            "At a suitable common parent",
            "In CSS",
            "In every component separately",
          ],
          correctIndex: 1,
          explanation:
            "A common parent can provide one source of truth to multiple children.",
        },
      ],
    },
    {
      id: "r6-data-flow",
      title: "Understanding one-way data flow",
      durationMinutes: 12,
      explanation: `
React follows a simple data-flow model.

Normally, data flows down the component tree through props:

<b>Parent → Child → Grandchild</b>

When a child needs to cause a change, it does not directly reach into the parent's state. Instead, the parent provides a callback.

This gives you:

<b>Data down, actions up.</b>

This predictable flow is one reason React applications can be easier to reason about as they grow.

When debugging, ask:
1. Where does this state live?
2. Which component owns it?
3. Which components receive it as props?
4. Which callback can request changes?
      `,
      diagram: `
             Parent state
                  │
             props ↓
             ┌────┴────┐
             ↓         ↓
          Child A   Child B
             │         │
             └── callbacks ──→ Parent
      `,
      codeExample: {
        title: "Data down, action up",
        code: `
import { useState } from "react";

function ToggleButton({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button type="button" onClick={onToggle}>
      {enabled ? "Disable" : "Enable"}
    </button>
  );
}

export function Settings() {
  const [enabled, setEnabled] = useState(false);

  return (
    <section>
      <p>{enabled ? "Enabled" : "Disabled"}</p>

      <ToggleButton
        enabled={enabled}
        onToggle={() => setEnabled((previous) => !previous)}
      />
    </section>
  );
}
        `,
      },
      keyTakeaways: [
        "React normally uses one-way data flow.",
        "Parents pass data down through props.",
        "Children communicate actions upward through callback props.",
        "Knowing where state lives makes debugging component communication easier.",
      ],
      commonMistakes: [
        "Expecting props to automatically update the parent.",
        "Trying to access a parent component's local state directly.",
        "Creating multiple independent copies of shared state.",
      ],
      quiz: [
        {
          question: "What is the common React data-flow phrase?",
          options: [
            "Data down, actions up",
            "State everywhere",
            "DOM first, state later",
            "CSS down, props up",
          ],
          correctIndex: 0,
          explanation:
            "Props carry data downward while callbacks allow children to request actions upward.",
        },
        {
          question: "Why is one-way data flow useful?",
          options: [
            "It makes relationships between state, props, and UI easier to understand",
            "It removes JavaScript",
            "It prevents components from rendering",
            "It makes every component global",
          ],
          correctIndex: 0,
          explanation:
            "Predictable data flow makes component behavior easier to trace and debug.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What are props?",
      options: [
        "Inputs passed to a component",
        "Browser cookies",
        "CSS rules",
        "Database records",
      ],
      correctIndex: 0,
      explanation:
        "Props are inputs passed from a parent component to a child component.",
    },
    {
      question: "Should a child directly modify props?",
      options: ["Yes", "No", "Only objects", "Only arrays"],
      correctIndex: 1,
      explanation:
        "Props should be treated as read-only by the component receiving them.",
    },
    {
      question: "What does children contain?",
      options: [
        "Only the component name",
        "Nested JSX content",
        "Only state",
        "Only CSS",
      ],
      correctIndex: 1,
      explanation:
        "children represents the JSX nested inside a component.",
    },
    {
      question: "How can a child request a parent state change?",
      options: [
        "Mutate the parent's state",
        "Call a callback passed through props",
        "Use CSS",
        "Reload the browser",
      ],
      correctIndex: 1,
      explanation:
        "The parent can pass a callback function that the child invokes when an action occurs.",
    },
    {
      question: "What is lifting state up?",
      options: [
        "Moving shared state to a suitable common parent",
        "Deleting all state",
        "Putting state into CSS",
        "Duplicating state across children",
      ],
      correctIndex: 0,
      explanation:
        "Lifting state up creates a shared source of truth in a common parent.",
    },
    {
      question: "What is ReactNode commonly used for?",
      options: [
        "Renderable React content",
        "Only numbers",
        "Only DOM nodes",
        "A CSS property",
      ],
      correctIndex: 0,
      explanation:
        "ReactNode is commonly used when a component accepts normal renderable React content.",
    },
    {
      question: "Which direction do normal props flow?",
      options: [
        "Child to parent",
        "Parent to child",
        "Browser to server only",
        "Sibling to sibling automatically",
      ],
      correctIndex: 1,
      explanation:
        "React's normal data flow passes props from parent to child.",
    },
    {
      question: "What is a useful React data-flow model?",
      options: [
        "Data down, actions up",
        "State everywhere",
        "DOM first, state later",
        "CSS down, props up",
      ],
      correctIndex: 0,
      explanation:
        "Parents provide data through props and children can request changes through callbacks.",
    },
  ],
  project: {
    name: "Reusable Profile Dashboard",
    goal: "Build a component tree that demonstrates props, children, callback props, and one-way data flow.",
    brief:
      "Create a profile dashboard made from reusable components. A parent should own the profile data and pass it to children through props. Include a reusable Card using <b>children</b> and an action button that communicates back to the parent through a callback prop.",
    steps: [
      "Create a ProfileDashboard component that owns the profile data and skills.",
      "Create ProfileHeader with typed name, role, and city props.",
      "Create SkillList with a typed skills array prop.",
      "Create a reusable Card component that accepts a title and children.",
      "Create ContactButton with an onContact callback prop.",
      "Keep contact state in the parent and update it when the child calls the callback.",
      "Compose the page as ProfileDashboard → ProfileHeader, SkillList, Card, and ContactButton.",
    ],
    acceptance: [
      "All child components receive correctly typed props.",
      "Card renders arbitrary nested JSX through children.",
      "ContactButton does not own the parent's contact state.",
      "Clicking ContactButton updates information displayed by the parent.",
      "The component tree has clear responsibilities and predictable data flow.",
    ],
    stretch: [
      "Add an Edit Profile button using a callback prop.",
      "Create a reusable Badge component.",
      "Render multiple Card instances with different children.",
      "Add a second profile and reuse the same components with different props.",
    ],
  },
};
