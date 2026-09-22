import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_1_LESSONS: LessonDay = {
  day: 1,
  title: "JSX, elements, and your first component",
  totalMinutes: 45,
  difficulty: "Beginner",
  lessons: [
    {
      id: "what-is-react",
      title: "What React is and how it builds the UI",
      durationMinutes: 8,
      explanation: `<b>React</b> (a JavaScript library for building user interfaces) helps you describe what the screen should look like.\n\nInstead of manually changing the browser's DOM (Document Object Model — the browser's tree of HTML elements), you describe the UI in React components.\n\n---\n\n### 1. Basic — React's job\n\nImagine you have this data:\n\n\`\`\`ts\nconst userName = "Rajan";\n\`\`\`\n\nYou want the browser to show:\n\n\`\`\`text\nWelcome, Rajan\n\`\`\`\n\nIn React, you describe that UI:\n\n\`\`\`tsx\n<h1>Welcome, {userName}</h1>\n\`\`\`\n\nReact takes that description and makes the necessary changes to the browser.\n\nYou do not normally need to write:\n\n\`\`\`js\ndocument.querySelector("h1").textContent = "Welcome, Rajan";\n\`\`\`\n\nThat is <b>imperative</b> code (code that tells the computer exactly which steps to perform).\n\nReact encourages a <b>declarative</b> style (you describe what the UI should look like, and React handles the steps needed to update it).\n\n---\n\n### 2. Intermediate — React's basic flow\n\nThink about React like this:\n\n\`\`\`text\nData\n  ↓\nComponent\n  ↓\nReact elements\n  ↓\nReact compares the new UI with the previous UI\n  ↓\nNecessary DOM changes\n  ↓\nBrowser screen\n\`\`\`\n\nA <b>React element</b> (a JavaScript value that describes what should appear in the UI) is not the same thing as a browser DOM element.\n\nFor example:\n\n\`\`\`tsx\n<h1>Hello</h1>\n\`\`\`\n\nThis describes an element for React. React later uses that description when updating the browser.\n\n---\n\n### 3. Important — React is not the whole frontend stack\n\nReact itself mainly gives you the UI layer.\n\nIt does not automatically give you:\n\n\`\`\`text\nReact\n ├── Router\n ├── Database\n ├── API client\n ├── Authentication\n ├── Styling system\n └── Build tool\n\`\`\`\n\nThose are handled by other tools that you will learn later.\n\nFor the first 14 days, focus on React itself.`,
      diagram: `The basic React idea\n\n        Data\n          │\n          ↓\n     React Component\n          │\n          ↓\n    React element tree\n          │\n          ↓\n      React updates\n          │\n          ↓\n       Browser DOM\n          │\n          ↓\n        Screen\n\nReact describes the UI.\nThe browser displays the UI.`,
      codeExample: {
        title: "Describing a simple UI",
        code: `const userName = "Rajan";

function Welcome() {
  return <h1>Welcome, {userName}</h1>;
}

// React renders the component.
// The browser eventually displays:
//
// Welcome, Rajan`,
      },
      keyTakeaways: [
        "<b>React</b> is a JavaScript library for building user interfaces.",
        "<b>Declarative</b> means you describe what the UI should look like instead of manually changing every DOM element.",
        "A <b>React element</b> is a JavaScript description of part of the UI.",
        "React handles the necessary <b>DOM</b> updates for you.",
        "React is the UI layer; routing, data fetching, authentication and other concerns are separate tools.",
      ],
      commonMistakes: [
        "<b>Thinking React is a complete framework</b> — React mainly handles the UI. Routing, data fetching and other concerns are added separately.",
        "<b>Thinking JSX is already a DOM element</b> — JSX describes UI; React uses that description to update the browser.",
        "<b>Trying to manually update the DOM everywhere</b> — React is designed so you normally describe the UI instead.",
      ],
      quiz: [
        {
          question: "What is React mainly used for?",
          options: [
            "Building user interfaces",
            "Managing SQL databases",
            "Running Linux servers",
            "Replacing JavaScript",
          ],
          correctIndex: 0,
          explanation: "React is a JavaScript library for building user interfaces.",
        },
        {
          question: "What does declarative UI mean?",
          options: [
            "You manually update every DOM node",
            "You describe what the UI should look like",
            "You never use JavaScript",
            "You write only CSS",
          ],
          correctIndex: 1,
          explanation: "React lets you describe the desired UI while React handles the update steps.",
        },
        {
          question: "What is the DOM?",
          options: [
            "A JavaScript package manager",
            "The browser's tree of HTML elements",
            "A React component",
            "A TypeScript compiler",
          ],
          correctIndex: 1,
          explanation: "DOM stands for Document Object Model and represents the page's elements in the browser.",
        },
      ],
    },
    {
      id: "jsx-basics",
      title: "JSX — writing UI inside JavaScript",
      durationMinutes: 10,
      explanation: `<b>JSX</b> (JavaScript XML — a syntax that lets you write UI that looks similar to HTML inside JavaScript or TypeScript) is the syntax you will use most often when writing React components.\n\nJSX looks like HTML, but it is not HTML.\n\n---\n\n### 1. Basic — your first JSX\n\n\`\`\`tsx\nconst element = <h1>Hello World</h1>;\n\`\`\`\n\nYou can also put JavaScript expressions inside JSX using curly braces:\n\n\`\`\`tsx\nconst name = "Rajan";\n\nconst element = <h1>Hello, {name}</h1>;\n\`\`\`\n\nThe part inside \`{ }\` is a JavaScript <b>expression</b> (code that produces a value).\n\nYou can use:\n\n\`\`\`tsx\n<h1>{name}</h1>\n<p>{2 + 3}</p>\n<p>{user.name}</p>\n<p>{items.length}</p>\n\`\`\`\n\n---\n\n### 2. JSX is not HTML\n\nThese look similar:\n\n\`\`\`html\n<h1 class="title">Hello</h1>\n\`\`\`\n\nand:\n\n\`\`\`tsx\n<h1 className="title">Hello</h1>\n\`\`\`\n\nBut JSX follows JavaScript rules for many attributes.\n\nCommon differences:\n\n\`\`\`text\nHTML                 JSX\n────────────────────────────────\nclass                className\nfor                  htmlFor\nonclick              onClick\nonchange             onChange\ntabindex              tabIndex\n\`\`\`\n\nReact usually uses <b>camelCase</b> (writing multiple words with the first letter of each later word capitalized) for DOM properties and event names.\n\n---\n\n### 3. JSX needs one root\n\nThis is not valid:\n\n\`\`\`tsx\nreturn (\n  <h1>Hello</h1>\n  <p>Welcome</p>\n);\n\`\`\`\n\nThe two elements need one parent:\n\n\`\`\`tsx\nreturn (\n  <div>\n    <h1>Hello</h1>\n    <p>Welcome</p>\n  </div>\n);\n\`\`\`\n\nBut adding a \`div\` just to satisfy JSX is not always necessary.\n\nUse a <b>Fragment</b> (a React wrapper that does not create an extra DOM element):\n\n\`\`\`tsx\nreturn (\n  <>\n    <h1>Hello</h1>\n    <p>Welcome</p>\n  </>\n);\n\`\`\`\n\n---\n\n### 4. Conditional content\n\nYou can use JavaScript expressions to decide what to display.\n\nUsing \`&&\`:\n\n\`\`\`tsx\n{isLoggedIn && <p>Welcome back!</p>}\n\`\`\`\n\nUsing a ternary (a short if/else expression):\n\n\`\`\`tsx\n{isLoggedIn ? <p>Welcome back!</p> : <p>Please log in.</p>}\n\`\`\`\n\nKeep these simple. Complex conditions should usually be calculated before the JSX.\n\n---\n\n### 5. The modern JSX transform\n\nOlder React code often started with:\n\n\`\`\`tsx\nimport React from "react";\n\`\`\`\n\nModern React projects normally do not need that import just because JSX is being used.\n\nThe build tool (a tool that prepares your source code to run in the browser) handles the JSX transformation.\n\nYou still import React APIs when you actually use them, for example:\n\n\`\`\`tsx\nimport { useState } from "react";\n\`\`\`\n\nYou will learn hooks such as \`useState\` later.`,
      diagram: `JSX is written by you\n\n<h1>Hello, {name}</h1>\n          │\n          ↓\n     JSX transform\n     (converts JSX into JavaScript)\n          │\n          ↓\n   React element description\n          │\n          ↓\n      React rendering\n          │\n          ↓\n       Browser DOM`,
      codeExample: {
        title: "JSX basics",
        code: `const name = "Rajan";
const isLoggedIn = true;

function Welcome() {
  return (
    <>
      <h1 className="title">Hello, {name}</h1>

      <p>2 + 3 = {2 + 3}</p>

      {isLoggedIn ? (
        <p>Welcome back!</p>
      ) : (
        <p>Please log in.</p>
      )}
    </>
  );
}`,
      },
      keyTakeaways: [
        "<b>JSX</b> lets you write UI using HTML-like syntax inside JavaScript or TypeScript.",
        "JSX is <b>not HTML</b>; many attributes use JavaScript-style names such as <b>className</b> and <b>onClick</b>.",
        "Use <b>{ }</b> to place JavaScript expressions inside JSX.",
        "A JSX return needs one root element, or you can use a <b>Fragment</b>.",
        "Modern React uses the new JSX transform, so you do not import React just to write JSX.",
      ],
      commonMistakes: [
        "<b>Writing `class` instead of `className`</b> — JSX uses `className` for the CSS class attribute.",
        "<b>Putting statements inside `{ }`</b> — JSX accepts expressions, not statements such as `if` directly.",
        "<b>Forgetting to close tags</b> — JSX requires tags such as `<img />` and `<input />` to be closed.",
        "<b>Adding unnecessary wrapper `<div>` elements</b> — use a Fragment when you do not need an actual DOM element.",
      ],
      quiz: [
        {
          question: "What does `{name}` do inside JSX?",
          options: [
            "Creates a CSS class",
            "Runs a JavaScript expression and displays its value",
            "Creates a new component",
            "Imports a variable",
          ],
          correctIndex: 1,
          explanation: "Curly braces let you place JavaScript expressions inside JSX.",
        },
        {
          question: "Which attribute should you use instead of `class` in JSX?",
          options: [
            "cssClass",
            "className",
            "classNameValue",
            "styleClass",
          ],
          correctIndex: 1,
          explanation: "React uses `className` for the HTML class attribute.",
        },
        {
          question: "Why can you use `<>...</>`?",
          options: [
            "It creates a CSS class",
            "It creates a Fragment without adding a DOM element",
            "It creates a new HTML document",
            "It imports React",
          ],
          correctIndex: 1,
          explanation: "A Fragment groups multiple JSX elements without adding an extra DOM node.",
        },
      ],
    },
    {
      id: "components",
      title: "Components are JavaScript functions",
      durationMinutes: 9,
      explanation: `A <b>component</b> (a reusable piece of UI) is usually a JavaScript or TypeScript function that returns JSX.\n\nThis is one of the most important ideas in React.\n\n---\n\n### 1. Your first component\n\n\`\`\`tsx\nfunction Greeting() {\n  return <h1>Hello!</h1>;\n}\n\`\`\`\n\nThe function is a React component because React can use it to describe part of the UI.\n\nComponent names normally start with a capital letter:\n\n\`\`\`tsx\nfunction Greeting() {}\n\`\`\`\n\nNot:\n\n\`\`\`tsx\nfunction greeting() {}\n\`\`\`\n\nA lowercase JSX tag is treated like an HTML element:\n\n\`\`\`tsx\n<greeting />\n\`\`\`\n\nA capitalized tag tells React that you mean a component:\n\n\`\`\`tsx\n<Greeting />\n\`\`\`\n\n---\n\n### 2. Components can contain other components\n\nThis is called <b>composition</b> (building a larger UI by combining smaller components).\n\n\`\`\`tsx\nfunction Header() {\n  return <header>My App</header>;\n}\n\nfunction MainContent() {\n  return <main>Hello from the main content.</main>;\n}\n\nfunction App() {\n  return (\n    <>\n      <Header />\n      <MainContent />\n    </>\n  );\n}\n\`\`\`\n\nThe structure becomes:\n\n\`\`\`text\nApp\n├── Header\n└── MainContent\n\`\`\`\n\nThis is the beginning of the <b>component tree</b> (the hierarchy created when components contain other components).\n\n---\n\n### 3. A component should have a clear job\n\nGood:\n\n\`\`\`tsx\nfunction UserAvatar() {\n  return <img src="/avatar.png" alt="User avatar" />;\n}\n\`\`\`\n\nAnd:\n\n\`\`\`tsx\nfunction UserProfile() {\n  return (\n    <section>\n      <UserAvatar />\n      <h2>Rajan</h2>\n    </section>\n  );\n}\n\`\`\`\n\nYou do not need to split every single HTML tag into a component.\n\nCreate a component when it represents a meaningful piece of UI or when it needs to be reused.`,
      diagram: `Component composition\n\n              App\n               │\n        ┌──────┴──────┐\n        ↓             ↓\n     Header       MainContent\n                       │\n                 ┌─────┴─────┐\n                 ↓           ↓\n              Profile      UserList\n\nSmall components\n        ↓\nCombined together\n        ↓\nComplete page`,
      codeExample: {
        title: "Building a page from components",
        code: `function Header() {
  return <header>My App</header>;
}

function UserProfile() {
  return (
    <section>
      <h2>Rajan</h2>
      <p>Software Engineer</p>
    </section>
  );
}

function Footer() {
  return <footer>© 2026 My App</footer>;
}

function App() {
  return (
    <>
      <Header />
      <main>
        <UserProfile />
      </main>
      <Footer />
    </>
  );
}`,
      },
      keyTakeaways: [
        "A <b>component</b> is usually a JavaScript or TypeScript function that returns JSX.",
        "Component names should start with a <b>capital letter</b>.",
        "<b>Composition</b> means building a larger UI by combining smaller components.",
        "A <b>component tree</b> shows how components are nested inside one another.",
        "Do not create components for every HTML tag; create them when a piece of UI has a meaningful responsibility.",
      ],
      commonMistakes: [
        "<b>Starting component names with lowercase letters</b> — `<userProfile />` is treated like a native HTML element. Use `<UserProfile />`.",
        "<b>Making one giant component</b> — split meaningful sections into smaller components when the component becomes difficult to understand.",
        "<b>Creating hundreds of tiny components</b> — abstraction (moving code into reusable pieces) is useful only when it makes the code easier to understand or reuse.",
      ],
      quiz: [
        {
          question: "What is a React component?",
          options: [
            "Only an HTML tag",
            "Usually a function that returns JSX",
            "A database table",
            "A CSS file",
          ],
          correctIndex: 1,
          explanation: "Modern React components are commonly JavaScript or TypeScript functions that return JSX.",
        },
        {
          question: "Why does `UserProfile` start with a capital letter?",
          options: [
            "It is required by TypeScript",
            "React uses capitalization to distinguish components from HTML elements",
            "It makes the component faster",
            "CSS requires it",
          ],
          correctIndex: 1,
          explanation: "Capitalization tells JSX that `UserProfile` is a component.",
        },
        {
          question: "What is composition?",
          options: [
            "Combining smaller components to build larger UI",
            "Writing CSS",
            "Creating database tables",
            "Installing npm packages",
          ],
          correctIndex: 0,
          explanation: "React encourages building interfaces by combining smaller components.",
        },
      ],
    },
    {
      id: "lists-and-keys",
      title: "Rendering lists and understanding keys",
      durationMinutes: 9,
      explanation: `Real applications rarely display only one item. You will often have an array of users, products, tasks or messages.\n\nReact lets you turn an array into UI using JavaScript's \`map()\` method.\n\n---\n\n### 1. Basic — render a list\n\nSuppose you have:\n\n\`\`\`tsx\nconst users = [\n  { id: 101, name: "Rajan" },\n  { id: 102, name: "Sita" },\n  { id: 103, name: "Ram" },\n];\n\`\`\`\n\nYou can render them:\n\n\`\`\`tsx\nfunction UserList() {\n  return (\n    <ul>\n      {users.map((user) => (\n        <li key={user.id}>{user.name}</li>\n      ))}\n    </ul>\n  );\n}\n\`\`\`\n\nHere, \`map()\` (an array method that creates a new array by transforming each item) creates one \`<li>\` for each user.\n\n---\n\n### 2. Why does React need \`key\`?\n\nThe \`key\` tells React which list item is which.\n\nImagine this list:\n\n\`\`\`text\nBefore\n──────\n101 Rajan\n102 Sita\n103 Ram\n\`\`\`\n\nThen the first item is removed:\n\n\`\`\`text\nAfter\n─────\n102 Sita\n103 Ram\n\`\`\`\n\nReact needs a reliable way to understand that:\n\n\`\`\`text\nRajan disappeared\nSita is still Sita\nRam is still Ram\n\`\`\`\n\nThe key gives React that identity.\n\n---\n\n### 3. Use stable IDs\n\nGood:\n\n\`\`\`tsx\n<li key={user.id}>{user.name}</li>\n\`\`\`\n\nBad when the list can change:\n\n\`\`\`tsx\n<li key={index}>{user.name}</li>\n\`\`\`\n\nAn <b>index</b> is the position of an item in the array.\n\nIf the array changes, the position can change even though the actual item did not.\n\nUse a stable ID whenever your data has one.\n\n---\n\n### 4. What makes a good key?\n\nA good key should be:\n\n- Unique among the current list\n- Stable across renders\n- Connected to the identity of the item\n\nA database ID is often a good key.\n\nYou will learn more about keys and React's rendering process on Day 4.`,
      diagram: `Array data\n\n[\n  { id: 101, name: "Rajan" },\n  { id: 102, name: "Sita" },\n  { id: 103, name: "Ram" }\n]\n          │\n          │ map()\n          ↓\n┌─────────────────────────┐\n│ <li key={101}>Rajan</li> │\n│ <li key={102}>Sita</li>  │\n│ <li key={103}>Ram</li>   │\n└─────────────────────────┘\n          │\n          ↓\n       Browser`,
      codeExample: {
        title: "Rendering a list with stable keys",
        code: `const users = [
  { id: 101, name: "Rajan" },
  { id: 102, name: "Sita" },
  { id: 103, name: "Ram" },
];

function UserList() {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}

// Avoid this when items can be inserted, removed,
// sorted or filtered:
//
// users.map((user, index) => (
//   <li key={index}>{user.name}</li>
// ))`,
      },
      keyTakeaways: [
        "Use <b>map()</b> to turn an array into a list of JSX elements.",
        "Every item in a React list should normally have a <b>key</b>.",
        "A <b>key</b> gives React a stable identity for a list item.",
        "Use a stable ID from your data whenever possible.",
        "Array indexes are usually a poor key when the list can be inserted, removed, sorted or filtered.",
      ],
      commonMistakes: [
        "<b>Forgetting `key`</b> — React will warn because it cannot reliably identify list items.",
        "<b>Using `key={index}` everywhere</b> — it can cause incorrect component identity when a list changes order.",
        "<b>Using random keys</b> such as `Math.random()` — the key changes every render, which makes React treat items as new.",
        "<b>Assuming `key` is available as a normal prop</b> — `key` is used by React and is not automatically passed to your component as `props.key`.",
      ],
      quiz: [
        {
          question: "What does `map()` do when rendering a React list?",
          options: [
            "Creates a new array by transforming each item",
            "Changes the database",
            "Deletes the original array",
            "Starts the React server",
          ],
          correctIndex: 0,
          explanation: "You commonly use `map()` to turn each data item into JSX.",
        },
        {
          question: "Why does React need a key?",
          options: [
            "To style the item",
            "To identify which list item is which",
            "To send data to the server",
            "To make JavaScript faster",
          ],
          correctIndex: 1,
          explanation: "Keys help React track item identity when a list changes.",
        },
        {
          question: "Which is usually the best key?",
          options: [
            "Math.random()",
            "The array index",
            "A stable unique ID belonging to the item",
            "The item name only",
          ],
          correctIndex: 2,
          explanation: "A stable unique ID keeps the same identity even when the list changes.",
        },
      ],
    },
    {
      id: "create-vite-react-app",
      title: "Create your first React + TypeScript application",
      durationMinutes: 9,
      explanation: `Now you will create a real React project.\n\nWe will use <b>Vite</b> (a modern frontend build tool that provides a fast development server and prepares your application for production).\n\nWe will use TypeScript from the beginning because this track uses TypeScript for React applications.\n\n---\n\n### 1. Create the project\n\nRun:\n\n\`\`\`bash\nnpm create vite@latest react-learning -- --template react-ts\n\`\`\`\n\nThis creates a project called \`react-learning\` using the React + TypeScript template.\n\nThen:\n\n\`\`\`bash\ncd react-learning\nnpm install\nnpm run dev\n\`\`\`\n\n---\n\n### 2. What each command means\n\n\`npm create vite@latest\`\n\nUses npm to run the latest Vite project generator.\n\n\`--template react-ts\`\n\nTells Vite to create a React + TypeScript project.\n\n\`npm install\`\n\nInstalls the project's <b>dependencies</b> (packages that the application needs to run or build).\n\n\`npm run dev\`\n\nStarts the Vite <b>development server</b> (a local server used while you are building the application).\n\nYou will get a local address such as:\n\n\`\`\`text\nhttp://localhost:5173\n\`\`\`\n\nOpen it in your browser.\n\n---\n\n### 3. The important files\n\nA new project contains many files. Do not try to understand everything today.\n\nStart with these:\n\n\`\`\`text\nreact-learning/\n├── src/\n│   ├── App.tsx\n│   ├── main.tsx\n│   └── index.css\n├── public/\n├── package.json\n├── tsconfig.json\n└── vite.config.ts\n\`\`\`\n\n<b>App.tsx</b>\n\nYour main application component.\n\n<b>main.tsx</b>\n\nThe entry point (the file where the application starts running).\n\n<b>index.css</b>\n\nGlobal CSS (CSS that can affect the whole application).\n\n<b>package.json</b>\n\nDescribes the project and its npm dependencies and scripts.\n\n<b>vite.config.ts</b>\n\nVite's configuration file.\n\n---\n\n### 4. How the application starts\n\nThe browser loads the application's JavaScript entry point.\n\nThat entry point renders \`<App />\`.\n\nThink of it like this:\n\n\`\`\`text\nBrowser\n   ↓\nmain.tsx\n   ↓\n<App />\n   ↓\nYour components\n   ↓\nReact\n   ↓\nBrowser DOM\n\`\`\`\n\nYou do not need to understand every internal Vite step today.\n\nThe important thing is knowing where your React application starts.\n\n---\n\n### 5. Replace the starter code\n\nOpen \`src/App.tsx\` and replace the existing content with something simple:\n\n\`\`\`tsx\nfunction App() {\n  return (\n    <main>\n      <h1>My React Learning App</h1>\n      <p>Day 1 — JSX and Components</p>\n    </main>\n  );\n}\n\nexport default App;\n\`\`\`\n\nSave the file.\n\nYour browser should update automatically.\n\nThis is called <b>Hot Module Replacement</b> (updating the running development application when source code changes without requiring a full page reload).\n\nYou do not need to master how HMR works today. Just understand what it does.`,
      diagram: `Creating and running the React application\n\nnpm create vite\n       │\n       ↓\nReact + TypeScript project\n       │\n       ↓\nnpm install\n       │\n       ↓\nDependencies installed\n       │\n       ↓\nnpm run dev\n       │\n       ↓\nVite development server\n       │\n       ↓\nBrowser → main.tsx → App.tsx\n       │\n       ↓\n      React\n       │\n       ↓\nBrowser DOM`,
      codeExample: {
        title: "Create and run your first React project",
        code: `# Create the project
npm create vite@latest react-learning -- --template react-ts

# Enter the project
cd react-learning

# Install dependencies
npm install

# Start the development server
npm run dev

# Then open the local URL shown by Vite.
# Usually it looks like:
# http://localhost:5173`,
      },
      keyTakeaways: [
        "<b>Vite</b> is a frontend build tool that gives you a fast development server and production build process.",
        "`npm create vite@latest ... -- --template react-ts` creates a React + TypeScript project.",
        "`npm install` installs the project's <b>dependencies</b>.",
        "`npm run dev` starts the local <b>development server</b>.",
        "`main.tsx` is the entry point that starts the React application.",
        "`App.tsx` contains the main application component in the starter project.",
      ],
      commonMistakes: [
        "<b>Skipping `npm install`</b> — the project may not have the packages it needs.",
        "<b>Thinking `npm run dev` deploys the application</b> — it only starts a local development server.",
        "<b>Deleting files without understanding them</b> — keep the starter structure for now and change only what you need.",
        "<b>Trying to understand Vite internals on Day 1</b> — know what it does and how to run it; deeper tooling comes later.",
      ],
      quiz: [
        {
          question: "What is Vite?",
          options: [
            "A database",
            "A frontend build tool and development server",
            "A React component",
            "A CSS framework",
          ],
          correctIndex: 1,
          explanation: "Vite provides a fast development server and builds your frontend application.",
        },
        {
          question: "What does `npm install` do?",
          options: [
            "Creates a database",
            "Installs the project's dependencies",
            "Deploys the application",
            "Creates a React component",
          ],
          correctIndex: 1,
          explanation: "It installs the packages listed in the project's package configuration.",
        },
        {
          question: "What is `main.tsx`?",
          options: [
            "Usually the application's entry point",
            "A database migration",
            "A CSS file",
            "A test file",
          ],
          correctIndex: 0,
          explanation: "The Vite React template uses `main.tsx` to start the React application.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is React mainly used for?",
      options: [
        "Building user interfaces",
        "Managing PostgreSQL databases",
        "Replacing TypeScript",
        "Running operating systems",
      ],
      correctIndex: 0,
      explanation: "React is a JavaScript library for building user interfaces.",
    },
    {
      question: "What is JSX?",
      options: [
        "A database language",
        "A syntax that lets you write UI-like markup inside JavaScript or TypeScript",
        "A CSS framework",
        "A Node.js server",
      ],
      correctIndex: 1,
      explanation: "JSX lets React developers describe UI using HTML-like syntax inside JavaScript or TypeScript.",
    },
    {
      question: "Is JSX the same thing as HTML?",
      options: [
        "Yes, they are exactly the same",
        "No, JSX is JavaScript/TypeScript syntax used to describe UI",
        "Only in TypeScript",
        "Only in production",
      ],
      correctIndex: 1,
      explanation: "JSX looks similar to HTML but follows JavaScript and React rules.",
    },
    {
      question: "Which JSX attribute is used instead of `class`?",
      options: [
        "cssClass",
        "className",
        "classAttribute",
        "styleClass",
      ],
      correctIndex: 1,
      explanation: "React uses `className` for CSS classes.",
    },
    {
      question: "What is a React component?",
      options: [
        "A database table",
        "Usually a function that returns JSX",
        "A CSS selector",
        "An npm command",
      ],
      correctIndex: 1,
      explanation: "Modern React components are commonly JavaScript or TypeScript functions that return JSX.",
    },
    {
      question: "Why should a component name normally start with a capital letter?",
      options: [
        "TypeScript requires it",
        "JSX uses capitalization to distinguish components from HTML elements",
        "It improves performance",
        "CSS requires it",
      ],
      correctIndex: 1,
      explanation: "A capitalized JSX tag such as `<UserProfile />` is treated as a component.",
    },
    {
      question: "What is a Fragment?",
      options: [
        "A database record",
        "A wrapper that groups JSX without adding a DOM element",
        "A CSS class",
        "A Vite plugin",
      ],
      correctIndex: 1,
      explanation: "Fragments let you return multiple JSX elements without adding an unnecessary DOM node.",
    },
    {
      question: "Why does React need a `key` when rendering a list?",
      options: [
        "To identify list item identity",
        "To style the item",
        "To make the item clickable",
        "To send the item to the server",
      ],
      correctIndex: 0,
      explanation: "Keys help React understand which item is which when a list changes.",
    },
    {
      question: "Which is usually the best key for a list item?",
      options: [
        "Math.random()",
        "The array index",
        "A stable unique ID belonging to the item",
        "The item's position on the screen",
      ],
      correctIndex: 2,
      explanation: "A stable ID represents the item's identity even when the list changes.",
    },
    {
      question: "What does `npm run dev` normally do in a Vite React project?",
      options: [
        "Starts a local development server",
        "Deletes node_modules",
        "Creates a database",
        "Deploys the application to production",
      ],
      correctIndex: 0,
      explanation: "It starts Vite's local development server so you can develop and preview the application.",
    },
  ],
  project: {
    name: "Personal Profile Card",
    goal: "Build a reusable profile card using everything you learned on Day 1.",
    brief: "Create a small React application that displays a person's profile: image, name, short bio, location, skills, social links, and work availability. This is practice for <b>JSX, components, composition, conditional rendering, `map()` and stable keys</b>.",
    steps: [
      "Create a reusable `ProfileCard` component and render it from `App`.",
      "Give the card a profile image, name, short bio and location for Rajan Magar.",
      "Create a `skills` array with `Node.js`, `React`, `Laravel` and `PostgreSQL`, then render each skill with `map()`.",
      "Use each skill name as its stable `key`, because every skill in this fixed list is unique.",
      "Add social links such as GitHub and LinkedIn.",
      "Create an `available` boolean. Use conditional rendering to show <b>Available for work</b> when it is true, or <b>Not currently available</b> when it is false.",
      "Keep the component structure simple: `App` → `ProfileCard` → image, profile details, skill list, location and availability.",
    ],
    acceptance: [
      "The browser shows one clean profile card for Rajan Magar in Tokyo, Japan.",
      "The skill list is rendered with `map()` and has no React key warning.",
      "Changing `available` to `false` changes the availability message without changing the rest of the component.",
      "The page uses no state, effects, router, external API or advanced library.",
    ],
    stretch: [
      "Extract the skills into a separate `SkillList` component.",
      "Extract the availability message into a separate `Availability` component.",
      "Add a second profile and render two profile cards from an array.",
      "Use a Fragment where it groups JSX without adding an extra DOM element.",
    ],
  },
};
