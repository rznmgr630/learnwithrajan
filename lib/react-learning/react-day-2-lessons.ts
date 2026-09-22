import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_2_LESSONS: LessonDay = {
  day: 2,
  title: "Props, data flow, and reusable components",
  totalMinutes: 50,
  difficulty: "Beginner",
  lessons: [
    {
      id: "what-are-props",
      title: "Props — passing data into components",
      durationMinutes: 10,
      explanation: `<b>Props</b> (short for properties — data passed from one React component to another) let you make components reusable.\n\nYesterday you created components that displayed fixed values:\n\n\`\`\`tsx\nfunction UserProfile() {\n  return (\n    <section>\n      <h2>Rajan</h2>\n      <p>Software Engineer</p>\n    </section>\n  );\n}\n\`\`\`\n\nThis works, but the component can only display Rajan's information.\n\nWhat if you want to display Sita's profile too?\n\nInstead of creating another component with almost the same code, pass the data into the component using props.\n\n---\n\n### 1. Basic — passing a prop\n\n\`\`\`tsx\nfunction UserProfile(props) {\n  return <h2>{props.name}</h2>;\n}\n\nfunction App() {\n  return <UserProfile name="Rajan" />;\n}\n\`\`\`\n\nHere:\n\n\`\`\`text\n<UserProfile name="Rajan" />\n                 │\n                 ↓\n              props\n                 │\n                 ↓\n       UserProfile component\n                 │\n                 ↓\n              Rajan\n\`\`\`\n\nThe value \`"Rajan"\` is passed into the component as a prop named \`name\`.\n\nInside the component, you can read it with:\n\n\`\`\`tsx\nprops.name\n\`\`\`\n\n---\n\n### 2. Props are inputs\n\nThink of a component like a function.\n\nA normal JavaScript function receives arguments:\n\n\`\`\`ts\nfunction greet(name: string) {\n  return \`Hello, \${name}\`;\n}\n\`\`\`\n\nA React component receives props:\n\n\`\`\`tsx\nfunction Greeting(props) {\n  return <h1>Hello, {props.name}</h1>;\n}\n\`\`\`\n\nThe idea is similar:\n\n\`\`\`text\nFunction\n   ↓\nInput → Output\n\nReact component\n   ↓\nProps → UI\n\`\`\`\n\n---\n\n### 3. Props can contain different types\n\nProps are not limited to strings.\n\nYou can pass:\n\n\`\`\`tsx\n<UserProfile\n  name="Rajan"\n  age={28}\n  isAvailable={true}\n/>\n\`\`\`\n\nInside the component:\n\n\`\`\`tsx\nfunction UserProfile(props) {\n  return (\n    <section>\n      <h2>{props.name}</h2>\n      <p>Age: {props.age}</p>\n      <p>{props.isAvailable ? "Available" : "Unavailable"}</p>\n    </section>\n  );\n}\n\`\`\`\n\nNotice that JavaScript values use curly braces.\n\nUse:\n\n\`\`\`tsx\nage={28}\n\`\`\`\n\nnot:\n\n\`\`\`tsx\nage="28"\n\`\`\`\n\nThe second version passes the string \`"28"\`, not the number \`28\`.\n\n---\n\n### 4. Props are read-only\n\nProps should be treated as <b>read-only</b> (data that a component should not directly change).\n\nDo not do this:\n\n\`\`\`tsx\nfunction UserProfile(props) {\n  props.name = "Someone else";\n\n  return <h2>{props.name}</h2>;\n}\n\`\`\`\n\nA component receives props and uses them to describe its UI.\n\nLater, when you learn state, you will see how data can change safely in React.`,
      diagram: `Props flow from parent to child\n\n        Parent\n          │\n          │ name="Rajan"\n          │ role="Engineer"\n          ↓\n      Child Component\n          │\n          ↓\n        UI output\n\nProps are inputs.\nParent → Child`,
      codeExample: {
        title: "Passing props into a component",
        code: `function UserProfile(props: {
  name: string;
  role: string;
}) {
  return (
    <section>
      <h2>{props.name}</h2>
      <p>{props.role}</p>
    </section>
  );
}

function App() {
  return (
    <>
      <UserProfile
        name="Rajan"
        role="Software Engineer"
      />

      <UserProfile
        name="Sita"
        role="Product Designer"
      />
    </>
  );
}`,
      },
      keyTakeaways: [
        "<b>Props</b> are data passed from a parent component to a child component.",
        "Props make components reusable because the same component can display different data.",
        "Props can contain strings, numbers, booleans, objects, arrays, functions and other values.",
        "Use curly braces when passing JavaScript values such as numbers or booleans.",
        "Props should be treated as <b>read-only</b> by the receiving component.",
      ],
      commonMistakes: [
        "<b>Hard-coding data inside reusable components</b> — pass changing data as props instead.",
        "<b>Passing numbers as strings</b> — use `age={28}` when the component expects a number.",
        "<b>Trying to modify props</b> — props are inputs to the component and should not be changed directly.",
        "<b>Forgetting that props come from the parent</b> — the child receives the values; it does not own the original data.",
      ],
      quiz: [
        {
          question: "What are props?",
          options: [
            "CSS rules",
            "Data passed into a component",
            "Database records",
            "Browser events",
          ],
          correctIndex: 1,
          explanation: "Props are inputs passed from a parent component to a child component.",
        },
        {
          question: "Which passes a number instead of a string?",
          options: [
            "<User age=\"28\" />",
            "<User age={28} />",
            "<User age=\"number:28\" />",
            "<User age=[28] />",
          ],
          correctIndex: 1,
          explanation: "Curly braces let you pass the JavaScript number 28.",
        },
        {
          question: "Should a child component directly change its props?",
          options: [
            "Yes, always",
            "Only strings",
            "No, props should be treated as read-only",
            "Only in TypeScript",
          ],
          correctIndex: 2,
          explanation: "Props are inputs to a component and should be treated as read-only.",
        },
      ],
    },
    {
      id: "destructuring-props",
      title: "Destructuring props and TypeScript prop types",
      durationMinutes: 10,
      explanation: `<b>Destructuring</b> (extracting values from an object or array into variables) makes props easier to read.\n\nYou can write:\n\n\`\`\`tsx\nfunction UserProfile(props) {\n  return <h2>{props.name}</h2>;\n}\n\`\`\`\n\nOr destructure the props directly:\n\n\`\`\`tsx\nfunction UserProfile({ name }) {\n  return <h2>{name}</h2>;\n}\n\`\`\`\n\nBoth receive the same prop.\n\n---\n\n### 1. Basic — destructuring\n\nSuppose the component receives:\n\n\`\`\`tsx\n<UserProfile\n  name="Rajan"\n  role="Software Engineer"\n  location="Tokyo"\n/>\n\`\`\`\n\nYou can write:\n\n\`\`\`tsx\nfunction UserProfile({ name, role, location }) {\n  return (\n    <section>\n      <h2>{name}</h2>\n      <p>{role}</p>\n      <p>{location}</p>\n    </section>\n  );\n}\n\`\`\`\n\nThis is often easier to read than repeating \`props.\` everywhere.\n\n---\n\n### 2. TypeScript — describe the props\n\nIn a TypeScript React project, define the shape of the props.\n\nA <b>type</b> (a TypeScript description of the shape and types of a value) can describe the component's inputs:\n\n\`\`\`tsx\ntype UserProfileProps = {\n  name: string;\n  role: string;\n  location: string;\n};\n\`\`\`\n\nThen use it:\n\n\`\`\`tsx\nfunction UserProfile({\n  name,\n  role,\n  location,\n}: UserProfileProps) {\n  return (\n    <section>\n      <h2>{name}</h2>\n      <p>{role}</p>\n      <p>{location}</p>\n    </section>\n  );\n}\n\`\`\`\n\nNow TypeScript can catch incorrect props.\n\nFor example:\n\n\`\`\`tsx\n<UserProfile\n  name="Rajan"\n  role="Software Engineer"\n  location={123}\n/>\n\`\`\`\n\nTypeScript will report an error because \`location\` should be a string.\n\n---\n\n### 3. Optional props\n\nSometimes a prop is optional.\n\nUse \`?\`:\n\n\`\`\`tsx\ntype UserProfileProps = {\n  name: string;\n  role: string;\n  bio?: string;\n};\n\`\`\`\n\nNow this is valid:\n\n\`\`\`tsx\n<UserProfile\n  name="Rajan"\n  role="Software Engineer"\n/>\n\`\`\`\n\nBut you need to handle the missing value.\n\n\`\`\`tsx\nfunction UserProfile({ name, role, bio }: UserProfileProps) {\n  return (\n    <section>\n      <h2>{name}</h2>\n      <p>{role}</p>\n      {bio && <p>{bio}</p>}\n    </section>\n  );\n}\n\`\`\`\n\n---\n\n### 4. Default values\n\nYou can provide a default value while destructuring:\n\n\`\`\`tsx\nfunction UserProfile({\n  name,\n  role = "Software Engineer",\n}: UserProfileProps) {\n  return (\n    <section>\n      <h2>{name}</h2>\n      <p>{role}</p>\n    </section>\n  );\n}\n\`\`\`\n\nIf the parent does not provide \`role\`, the component uses the default value.\n\nDo not make every prop optional just to avoid TypeScript errors. Make a prop optional only when the component genuinely supports the missing value.`,
      diagram: `Props object\n\n{\n  name: "Rajan",\n  role: "Software Engineer",\n  location: "Tokyo"\n}\n          │\n          ↓\n     Destructuring\n          │\n    ┌─────┼─────┐\n    ↓     ↓     ↓\n  name   role  location\n    │     │      │\n    └─────┴──────┘\n           ↓\n        Component`,
      codeExample: {
        title: "Typed and destructured props",
        code: `type UserProfileProps = {
  name: string;
  role: string;
  location: string;
  bio?: string;
};

function UserProfile({
  name,
  role,
  location,
  bio,
}: UserProfileProps) {
  return (
    <section>
      <h2>{name}</h2>
      <p>{role}</p>
      <p>{location}</p>

      {bio && <p>{bio}</p>}
    </section>
  );
}

function App() {
  return (
    <UserProfile
      name="Rajan"
      role="Software Engineer"
      location="Tokyo"
      bio="I build backend and full-stack applications."
    />
  );
}`,
      },
      keyTakeaways: [
        "<b>Destructuring</b> makes component props easier to read.",
        "TypeScript lets you define exactly which props a component expects.",
        "Use `?` for a prop only when the prop is genuinely optional.",
        "Default values can be provided during destructuring.",
        "Typed props catch incorrect data before it reaches the browser.",
      ],
      commonMistakes: [
        "<b>Making every prop optional</b> — this weakens TypeScript and hides missing-data problems.",
        "<b>Using `any` for props</b> — `any` removes useful type checking. Define the actual prop types.",
        "<b>Forgetting to type new props</b> — update the props type when the component gains a new input.",
        "<b>Confusing a missing prop with an empty string</b> — these are different values and can require different behavior.",
      ],
      quiz: [
        {
          question: "What does destructuring do with props?",
          options: [
            "Deletes the props",
            "Extracts values from the props object",
            "Sends props to the server",
            "Converts props to CSS",
          ],
          correctIndex: 1,
          explanation: "Destructuring lets you directly extract values such as `name` from the props object.",
        },
        {
          question: "What does `bio?: string` mean?",
          options: [
            "bio must be a number",
            "bio is optional and, when provided, must be a string",
            "bio can never be used",
            "bio is always null",
          ],
          correctIndex: 1,
          explanation: "The `?` makes the prop optional while `string` defines its type.",
        },
        {
          question: "Why type component props?",
          options: [
            "To make CSS faster",
            "To help TypeScript catch incorrect component inputs",
            "To replace React",
            "To create database tables",
          ],
          correctIndex: 1,
          explanation: "Prop types document and check the data a component expects.",
        },
      ],
    },
    {
      id: "passing-objects-arrays",
      title: "Passing objects and arrays as props",
      durationMinutes: 9,
      explanation: `Props can contain complete objects and arrays. This becomes important when your UI is driven by real application data.\n\nInstead of passing five separate values:\n\n\`\`\`tsx\n<UserCard\n  name="Rajan"\n  role="Software Engineer"\n  location="Tokyo"\n  avatar="/rajan.png"\n  available={true}\n/>\n\`\`\`\n\nYou can sometimes pass one object:\n\n\`\`\`tsx\nconst user = {\n  name: "Rajan",\n  role: "Software Engineer",\n  location: "Tokyo",\n  avatar: "/rajan.png",\n  available: true,\n};\n\n<UserCard user={user} />\n\`\`\`\n\n---\n\n### 1. Passing an object\n\nType the object shape:\n\n\`\`\`tsx\ntype User = {\n  id: number;\n  name: string;\n  role: string;\n  location: string;\n};\n\`\`\`\n\nThen type the component prop:\n\n\`\`\`tsx\ntype UserCardProps = {\n  user: User;\n};\n\nfunction UserCard({ user }: UserCardProps) {\n  return (\n    <article>\n      <h2>{user.name}</h2>\n      <p>{user.role}</p>\n      <p>{user.location}</p>\n    </article>\n  );\n}\n\`\`\`\n\n---\n\n### 2. Passing an array\n\nYou can also pass arrays.\n\n\`\`\`tsx\nconst skills = ["React", "Node.js", "Laravel"];\n\n<SkillList skills={skills} />\n\`\`\`\n\nType the array:\n\n\`\`\`tsx\ntype SkillListProps = {\n  skills: string[];\n};\n\`\`\`\n\nThen render it:\n\n\`\`\`tsx\nfunction SkillList({ skills }: SkillListProps) {\n  return (\n    <ul>\n      {skills.map((skill) => (\n        <li key={skill}>{skill}</li>\n      ))}\n    </ul>\n  );\n}\n\`\`\`\n\n---\n\n### 3. Objects and arrays keep the parent in control\n\nThe parent owns the data:\n\n\`\`\`text\nApp\n │\n │ user object\n │ skills array\n ↓\nProfileCard\n │\n ├── UserDetails\n └── SkillList\n\`\`\`\n\nThe children receive what they need.\n\nThis creates a predictable direction for data:\n\n\`\`\`text\nParent\n  ↓\n  props\n  ↓\nChild\n\`\`\`\n\nThis is called <b>one-way data flow</b> (data moving through the component tree in a predictable direction from parent to child).\n\nYou will use this idea throughout React.`,
      diagram: `One-way data flow\n\n        App\n       /   \\\n      ↓     ↓\n   user    skills\n      │     │\n      ↓     ↓\n Profile  SkillList\n    Card\n      │\n      ↓\n     UI\n\nData moves downward:\nParent → Child`,
      codeExample: {
        title: "Passing structured data",
        code: `type User = {
  id: number;
  name: string;
  role: string;
};

type ProfileCardProps = {
  user: User;
  skills: string[];
};

function ProfileCard({
  user,
  skills,
}: ProfileCardProps) {
  return (
    <article>
      <h2>{user.name}</h2>
      <p>{user.role}</p>

      <ul>
        {skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </article>
  );
}

const user = {
  id: 1,
  name: "Rajan",
  role: "Software Engineer",
};

const skills = ["React", "Node.js", "Laravel"];

function App() {
  return (
    <ProfileCard
      user={user}
      skills={skills}
    />
  );
}`,
      },
      keyTakeaways: [
        "Props can contain objects and arrays.",
        "Type structured props with TypeScript so their shape is clear.",
        "<b>One-way data flow</b> means data normally moves from parent components down to child components.",
        "A parent can pass only the data a child needs instead of making the child fetch or create unrelated data.",
        "This predictable data flow makes components easier to understand and reuse.",
      ],
      commonMistakes: [
        "<b>Passing unrelated data everywhere</b> — give a child the smallest useful set of data it needs.",
        "<b>Mutating an object or array received through props</b> — treat props as read-only.",
        "<b>Forgetting stable keys when rendering an array prop</b> — the same list key rules from Day 1 still apply.",
        "<b>Duplicating the same data in multiple children</b> — keep shared data at the appropriate parent level and pass it down.",
      ],
      quiz: [
        {
          question: "Can a prop contain an object?",
          options: [
            "No",
            "Only in JavaScript, not TypeScript",
            "Yes",
            "Only when using state",
          ],
          correctIndex: 2,
          explanation: "Props can contain objects, arrays and many other JavaScript values.",
        },
        {
          question: "What is one-way data flow?",
          options: [
            "Data normally moving from parent to child",
            "Data moving randomly between components",
            "Only data coming from a database",
            "CSS moving between elements",
          ],
          correctIndex: 0,
          explanation: "React's normal data flow passes values from parent components down through props.",
        },
        {
          question: "Who normally owns the data passed as props?",
          options: [
            "The browser",
            "The child automatically",
            "The parent component or another higher-level owner",
            "CSS",
          ],
          correctIndex: 2,
          explanation: "The component passing the prop is normally responsible for the source data.",
        },
      ],
    },
    {
      id: "children-prop",
      title: "The children prop and component composition",
      durationMinutes: 9,
      explanation: `React gives components a special prop called <b>children</b> when you place content between the opening and closing component tags.\n\nFor example:\n\n\`\`\`tsx\n<Card>\n  <h2>Hello</h2>\n  <p>Welcome to my application.</p>\n</Card>\n\`\`\`\n\nThe content between \`<Card>\` and \`</Card>\` becomes the \`children\` prop.\n\n---\n\n### 1. Basic — using children\n\n\`\`\`tsx\ntype CardProps = {\n  children: React.ReactNode;\n};\n\nfunction Card({ children }: CardProps) {\n  return (\n    <section className="card">\n      {children}\n    </section>\n  );\n}\n\`\`\`\n\nNow you can put different content inside the same card:\n\n\`\`\`tsx\n<Card>\n  <h2>Profile</h2>\n  <p>Software Engineer</p>\n</Card>\n\n<Card>\n  <h2>Skills</h2>\n  <p>React, Node.js and Laravel</p>\n</Card>\n\`\`\`\n\nThe wrapper controls the structure while the parent controls the content.\n\n---\n\n### 2. What is React.ReactNode?\n\n\`React.ReactNode\` is a TypeScript type that represents content React can render.\n\nIt can include things such as:\n\n- JSX elements\n- strings\n- numbers\n- arrays of renderable content\n- \`null\`\n- fragments\n\nYou do not need to memorize every possible ReactNode value today.\n\nFor now, remember:\n\n\`\`\`tsx\nchildren: React.ReactNode;\n\`\`\`\n\nmeans the component can receive renderable React content.\n\n---\n\n### 3. Composition with children\n\nThis is another form of <b>composition</b>.\n\nInstead of making a Card component know everything that will appear inside it, the Card provides the container and accepts content from its parent.\n\nThink:\n\n\`\`\`text\nParent decides WHAT\n       ↓\n     children\n       ↓\nComponent decides HOW to wrap/display it\n\`\`\`\n\nThis pattern becomes very useful for layouts, modals, cards, panels and reusable UI containers.`,
      diagram: `Children flow into a component\n\n<Card>\n  <h2>Profile</h2>\n  <p>Engineer</p>\n</Card>\n       │\n       ↓\n   children prop\n       │\n       ↓\n     Card\n       │\n       ↓\n<section className="card">\n  {children}\n</section>\n\nParent controls the content.\nCard controls the wrapper.`,
      codeExample: {
        title: "Reusable Card with children",
        code: `type CardProps = {
  children: React.ReactNode;
};

function Card({ children }: CardProps) {
  return (
    <section className="card">
      {children}
    </section>
  );
}

function App() {
  return (
    <main>
      <Card>
        <h2>Profile</h2>
        <p>Software Engineer</p>
      </Card>

      <Card>
        <h2>Skills</h2>
        <p>React, Node.js, Laravel</p>
      </Card>
    </main>
  );
}`,
      },
      keyTakeaways: [
        "<b>children</b> is a special prop containing content placed between a component's opening and closing tags.",
        "`React.ReactNode` is a TypeScript type for content React can render.",
        "The parent can control the content while the child controls the surrounding structure.",
        "The children pattern is useful for reusable containers such as cards, panels, layouts and modals.",
        "Composition is often better than creating many specialized wrapper components.",
      ],
      commonMistakes: [
        "<b>Forgetting to render `children`</b> — receiving children does not automatically display them.",
        "<b>Using children when a named prop is clearer</b> — use a normal prop when the data has a specific meaning such as `title` or `user`.",
        "<b>Typing children as `string`</b> — children can be JSX and other renderable values, so `React.ReactNode` is usually more appropriate.",
      ],
      quiz: [
        {
          question: "Where does the `children` prop come from?",
          options: [
            "From CSS",
            "From content placed between a component's opening and closing tags",
            "From the browser URL",
            "From npm",
          ],
          correctIndex: 1,
          explanation: "Content inside `<Card>...</Card>` becomes the Card component's children prop.",
        },
        {
          question: "What does `React.ReactNode` represent?",
          options: [
            "Only strings",
            "Only HTML elements",
            "Content that React can render",
            "Only numbers",
          ],
          correctIndex: 2,
          explanation: "ReactNode covers the kinds of values React can render as children.",
        },
        {
          question: "What is a common use for children?",
          options: [
            "Reusable wrapper components",
            "Database migrations",
            "CSS compilation",
            "HTTP authentication",
          ],
          correctIndex: 0,
          explanation: "Children are especially useful for reusable containers such as cards, panels and layouts.",
        },
      ],
    },
    {
      id: "props-vs-state-preview",
      title: "Props vs state — understand the difference before learning state",
      durationMinutes: 7,
      explanation: `You will learn <b>state</b> in detail later, but it is important to understand one distinction now.\n\n<b>Props</b> are values passed into a component by its parent.\n\n<b>State</b> is data a component manages itself and can update over time.\n\nFor now, think about them like this:\n\n\`\`\`text\nProps\nParent\n  ↓\nChild\n\nState\nComponent\n  ↕\nOwn changing data\n\`\`\`\n\n---\n\n### 1. Props are inputs\n\n\`\`\`tsx\nfunction User({ name }: { name: string }) {\n  return <h2>{name}</h2>;\n}\n\n<User name="Rajan" />\n\`\`\`\n\nThe parent decides the value passed into the component.\n\n---\n\n### 2. State belongs to the component\n\nLater you will write something like:\n\n\`\`\`tsx\nconst [count, setCount] = useState(0);\n\`\`\`\n\nThe component owns the current \`count\` value and can request an update through \`setCount\`.\n\nYou do not need to learn \`useState\` today. The important thing is the conceptual difference.\n\n---\n\n### 3. A simple comparison\n\n\`\`\`text\nProps\n─────\nPassed in\nUsually controlled by parent\nRead by child\n\nState\n─────\nManaged by component\nCan change over time\nChanging state causes React to render again\n\`\`\`\n\nThis distinction will become much more important when you build interactive applications.\n\nFor Day 2, focus on props and one-way data flow. State comes next.`,
      diagram: `Props vs State\n\nProps\nParent ─────────→ Child\n        data\n\nState\nComponent\n    ↕\nchanging value\n\nProps are inputs.\nState is component-managed changing data.`,
      codeExample: {
        title: "Conceptual comparison",
        code: `// Props
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}</h1>;
}

function App() {
  return <Greeting name="Rajan" />;
}

// State comes later:
// const [count, setCount] = useState(0);`,
      },
      keyTakeaways: [
        "<b>Props</b> are inputs passed from a parent to a child component.",
        "<b>State</b> is data managed by a component that can change over time.",
        "Props and state are related, but they solve different problems.",
        "Do not use state just because data exists; use it when the component needs to manage changing data.",
        "You will learn `useState` in detail later.",
      ],
      commonMistakes: [
        "<b>Calling every variable state</b> — a normal constant is not React state.",
        "<b>Changing props to make a component interactive</b> — state or callbacks are used for controlled changes.",
        "<b>Learning state before understanding props</b> — clear parent-to-child data flow makes state easier to understand later.",
      ],
      quiz: [
        {
          question: "What are props?",
          options: [
            "Inputs passed into a component",
            "Only database values",
            "CSS variables",
            "Browser storage",
          ],
          correctIndex: 0,
          explanation: "Props are inputs passed from a parent component to a child component.",
        },
        {
          question: "What is state?",
          options: [
            "Data managed by a component that can change over time",
            "Only data received from an API",
            "A CSS property",
            "An HTML attribute",
          ],
          correctIndex: 0,
          explanation: "State is component-managed data that can change and cause the UI to update.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is the main purpose of props?",
      options: [
        "To pass data into components",
        "To write CSS",
        "To create databases",
        "To start Vite",
      ],
      correctIndex: 0,
      explanation: "Props let parent components pass data into child components.",
    },
    {
      question: "Which syntax passes a JavaScript boolean?",
      options: [
        "<User available=\"true\" />",
        "<User available={true} />",
        "<User available=\"boolean\" />",
        "<User available=[true] />",
      ],
      correctIndex: 1,
      explanation: "Curly braces pass the JavaScript boolean value true.",
    },
    {
      question: "Should a component directly mutate its props?",
      options: [
        "Yes",
        "Only strings",
        "No",
        "Only in development",
      ],
      correctIndex: 2,
      explanation: "Props should be treated as read-only inputs.",
    },
    {
      question: "What does destructuring props do?",
      options: [
        "Extracts values from the props object",
        "Deletes props",
        "Sends props to an API",
        "Converts props into CSS",
      ],
      correctIndex: 0,
      explanation: "Destructuring lets you directly access selected values from the props object.",
    },
    {
      question: "What does `bio?: string` mean?",
      options: [
        "bio is required",
        "bio is optional and must be a string when provided",
        "bio must be a number",
        "bio can only be null",
      ],
      correctIndex: 1,
      explanation: "The question mark makes the property optional.",
    },
    {
      question: "What is one-way data flow?",
      options: [
        "Data normally moving from parent to child",
        "Data moving randomly between components",
        "Data only coming from a database",
        "Data moving only through CSS",
      ],
      correctIndex: 0,
      explanation: "React normally passes data downward from parent components through props.",
    },
    {
      question: "What is the `children` prop?",
      options: [
        "A special prop containing content placed inside a component",
        "A database field",
        "A CSS selector",
        "A browser event",
      ],
      correctIndex: 0,
      explanation: "Content between `<Component>` and `</Component>` becomes the children prop.",
    },
    {
      question: "Which type is commonly used for React children in TypeScript?",
      options: [
        "string only",
        "number only",
        "React.ReactNode",
        "HTMLElement only",
      ],
      correctIndex: 2,
      explanation: "React.ReactNode represents content that React can render.",
    },
    {
      question: "What is the difference between props and state?",
      options: [
        "Props are parent-provided inputs; state is component-managed changing data",
        "They are exactly the same",
        "Props are only CSS values",
        "State can never change",
      ],
      correctIndex: 0,
      explanation: "Props are inputs from a parent, while state is managed by the component and can change over time.",
    },
    {
      question: "Which approach usually makes a component reusable?",
      options: [
        "Hard-coding all of its data",
        "Accepting appropriate data through props",
        "Changing the DOM manually",
        "Using random values",
      ],
      correctIndex: 1,
      explanation: "Props allow the same component to display different data.",
    },
  ],
  project: {
    name: "Reusable Team Member Directory",
    goal: "Build a reusable team member directory that uses props, TypeScript prop types, destructuring, objects, arrays, children, and one-way data flow.",
    brief: "Create a small React application called <b>Team Directory</b>. The parent component should own an array of team members and pass each member's data into reusable components. The application should display a profile card for each team member with their name, role, location, skills and availability. Use a reusable `Card` component with `children` for the surrounding layout.",
    steps: [
      "Create a `TeamMember` TypeScript type with `id`, `name`, `role`, `location`, `skills`, and `available` fields.",
      "Create an array containing at least three team members in `App.tsx`.",
      "Create a reusable `TeamMemberCard` component that receives one team member through props.",
      "Destructure the props inside `TeamMemberCard` instead of repeatedly using `props.member`.",
      "Create a `SkillList` component that receives a `skills` array as a typed prop and renders the skills with `map()`.",
      "Use the team member's stable `id` as the key when rendering the team member cards.",
      "Use conditional rendering to display either `Available` or `Currently unavailable` based on the `available` prop.",
      "Create a reusable `Card` component that accepts `children: React.ReactNode` and use it to wrap each team member profile.",
      "Keep the team member data in the parent and pass it downward through props. Do not duplicate the same data inside the child components.",
    ],
    acceptance: [
      "At least three team members are displayed.",
      "The same `TeamMemberCard` component is reused for every team member.",
      "The team member information is passed through typed props.",
      "Props are destructured inside the child components.",
      "Skills are rendered from an array using `map()` and stable keys.",
      "Availability is rendered conditionally from the `available` value.",
      "A reusable `Card` component receives and renders `children`.",
      "The application has no React key warnings.",
      "The project uses TypeScript types instead of `any` for the component props.",
      "The child components do not directly mutate their props.",
    ],
    stretch: [
      "Create a `SocialLinks` component that receives an array of social links.",
      "Add an optional `bio` prop and display it only when it exists.",
      "Add a `role` default value for a team member when it is not provided.",
      "Create a reusable `Badge` component that receives `children` and a status type.",
      "Render the team members from a separate `team.ts` data file and import the data into `App.tsx`.",
    ],
  },
};
