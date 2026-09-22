export type ReactPrerequisiteTopic = {
  title: string;
  definition: string;
  examples: string[];
};

export type ReactPrerequisiteSection = {
  id: string;
  title: string;
  explanation: string;
  topics: ReactPrerequisiteTopic[];
  keyTakeaways: string[];
  commonMistakes: string[];
  checklist: string[];
};

export const REACT_PHASE_0 = {
  title: "Before You Start",
  description: "This phase is not part of the 27 days. Use it to make sure your JavaScript, browser, HTML/CSS and development-tool fundamentals are strong enough that React does not become a substitute for learning JavaScript.",
  sections: [
    {
      id: "javascript-prerequisites",
      title: "JavaScript prerequisites",
      explanation: "You do not need every advanced JavaScript feature, but you should be comfortable reading and writing normal JavaScript without needing React to explain the language.",
      topics: [
        { title: "Variables and scope", definition: "Variables store values. Scope determines where a variable is available.", examples: ["let", "const", "function scope", "block scope"] },
        { title: "Functions", definition: "A function is reusable code that can receive input and return a result.", examples: ["function declaration", "parameters", "return values", "function calls"] },
        { title: "Arrow functions", definition: "Arrow functions are a shorter function syntax commonly used in React code.", examples: ["const add = (a, b) => a + b", "array callbacks"] },
        { title: "Objects and arrays", definition: "Objects store related properties; arrays store ordered collections.", examples: ["user objects", "arrays of items", "nested objects", "arrays of objects"] },
        { title: "Destructuring", definition: "Destructuring takes values from objects or arrays and assigns them to variables.", examples: ["const { name } = user", "const [first, second] = items"] },
        { title: "Spread and rest syntax", definition: "Spread expands values; rest collects several values into one variable.", examples: ["{ ...user }", "[...oldItems, newItem]", "function fn(...args) {}"] },
        { title: "Array methods", definition: "Array methods work with arrays without manually writing every loop.", examples: ["map()", "filter()", "find()", "some()", "every()", "reduce()"] },
        { title: "Closures", definition: "A closure lets a function remember variables from the scope where it was created.", examples: ["callbacks", "factory functions", "private values"] },
        { title: "Modules", definition: "Modules split JavaScript into files and share values between them.", examples: ["export", "import", "default export", "named export"] },
        { title: "Promises", definition: "A Promise represents the eventual result of asynchronous work.", examples: ["pending", "fulfilled", "rejected", "then()", "catch()"] },
        { title: "async/await", definition: "async/await makes Promise-based code easier to read.", examples: ["async function", "await fetch()", "try/catch"] },
        { title: "Error handling", definition: "Error handling detects and responds to problems instead of letting failures break the application.", examples: ["try/catch", "throw", "Promise rejection"] },
        { title: "Classes at a basic level", definition: "A class creates objects with shared structure and behavior. You only need the basics for React.", examples: ["class", "constructor", "methods", "new"] },
        { title: "JSON", definition: "JSON is a text format commonly used to exchange structured application data.", examples: ["JSON.stringify()", "JSON.parse()", "API responses"] },
        { title: "fetch", definition: "fetch is a browser API for making HTTP requests.", examples: ["GET requests", "POST requests", "response.json()"] },
        { title: "ES modules", definition: "ES modules are JavaScript's standard import and export system.", examples: ["import", "export", "named exports", "default exports"] },
      ],
      keyTakeaways: ["React is a JavaScript library, so JavaScript fundamentals come first.", "Be comfortable with functions, objects, arrays, destructuring, spread/rest and array methods.", "Understand asynchronous JavaScript with Promises and async/await.", "React should build interfaces, not replace learning JavaScript."],
      commonMistakes: ["Learning JSX before normal JavaScript expressions.", "Memorizing React syntax without understanding functions and objects.", "Using React-specific solutions for basic JavaScript problems."],
      checklist: ["I can write and call functions without looking up syntax.", "I can work comfortably with objects and arrays.", "I understand map(), filter(), find() and common array methods.", "I understand destructuring and spread/rest syntax.", "I understand closures at a basic level.", "I can split code into modules using import/export.", "I understand Promises and can use async/await.", "I can handle errors with try/catch.", "I can parse and create JSON.", "I can make a basic HTTP request using fetch()."],
    },
    {
      id: "browser-fundamentals",
      title: "Browser fundamentals",
      explanation: "React runs inside the browser. Understand the basics underneath React so you know what React is doing for you.",
      topics: [
        { title: "DOM", definition: "The Document Object Model is the browser's tree-like representation of an HTML document.", examples: ["document", "elements", "querySelector()", "textContent"] },
        { title: "Events", definition: "An event is something that happens in the browser, such as a click or form submission.", examples: ["click", "submit", "input", "keydown"] },
        { title: "Event bubbling and capturing", definition: "Events travel through the DOM in capturing and bubbling phases.", examples: ["parent/child events", "event bubbling", "event capturing"] },
        { title: "Browser rendering", definition: "The browser turns HTML, CSS and other information into pixels on screen.", examples: ["DOM", "CSS", "layout", "paint"] },
        { title: "HTTP request/response", definition: "HTTP is the protocol browsers and servers use to communicate.", examples: ["request", "response", "GET", "POST"] },
        { title: "Request headers", definition: "Request headers are metadata sent with an HTTP request.", examples: ["Authorization", "Content-Type", "Accept"] },
        { title: "Response headers", definition: "Response headers are metadata sent back by the server.", examples: ["Content-Type", "Cache-Control", "Set-Cookie"] },
        { title: "Status codes", definition: "HTTP status codes describe the result of a request.", examples: ["200 OK", "201 Created", "400 Bad Request", "401 Unauthorized", "404 Not Found", "500 Server Error"] },
        { title: "Cookies", definition: "Cookies are small pieces of data stored in the browser and sent with requests under appropriate rules.", examples: ["session cookies", "authentication cookies"] },
        { title: "CORS", definition: "Cross-Origin Resource Sharing is browser security that controls requests to another origin.", examples: ["origin", "Access-Control-Allow-Origin", "preflight request"] },
        { title: "localStorage", definition: "localStorage persists string data across browser sessions.", examples: ["setItem()", "getItem()", "removeItem()"] },
        { title: "sessionStorage", definition: "sessionStorage persists string data for a browser tab or session.", examples: ["setItem()", "getItem()", "removeItem()"] },
        { title: "AbortController", definition: "AbortController cancels asynchronous browser operations, including fetch requests.", examples: ["controller.abort()", "signal"] },
        { title: "DevTools Network tab", definition: "The Network tab lets you inspect a page's requests and responses.", examples: ["URL", "method", "status", "headers", "request payload", "response"] },
      ],
      keyTakeaways: ["React works with the browser DOM.", "Know requests, responses, headers, status codes and CORS.", "Use the Network tab when debugging browser requests."],
      commonMistakes: ["Thinking React replaces the DOM.", "Thinking CORS is caused by React.", "Debugging an API request only from React code.", "Ignoring HTTP status codes."],
      checklist: ["I can explain the DOM and browser events.", "I understand event bubbling at a basic level.", "I can explain an HTTP request and response.", "I understand request and response headers.", "I recognize common HTTP status codes.", "I understand cookies and CORS at a basic level.", "I know the difference between localStorage and sessionStorage.", "I know why AbortController exists.", "I can inspect a request in the DevTools Network tab."],
    },
    {
      id: "html-css",
      title: "HTML and CSS",
      explanation: "React creates interfaces, but it does not replace HTML and CSS. Build a reasonable page with normal HTML and CSS before relying heavily on a styling framework or component library.",
      topics: [
        { title: "Semantic HTML", definition: "Semantic HTML uses elements according to their meaning and purpose.", examples: ["<header>", "<nav>", "<main>", "<section>", "<article>", "<button>"] },
        { title: "Forms", definition: "HTML forms collect user input and provide standard browser submission behavior.", examples: ["form", "input", "label", "select", "textarea", "button"] },
        { title: "Accessibility basics", definition: "Accessibility makes interfaces usable by people with different abilities and assistive technologies.", examples: ["labels", "button elements", "alt text", "keyboard access", "semantic HTML"] },
        { title: "Box model", definition: "The CSS box model is content surrounded by padding, border and margin.", examples: ["content", "padding", "border", "margin"] },
        { title: "Flexbox", definition: "Flexbox arranges elements along one or two main dimensions.", examples: ["display: flex", "justify-content", "align-items", "gap"] },
        { title: "Grid", definition: "CSS Grid arranges elements in rows and columns.", examples: ["display: grid", "grid-template-columns", "gap"] },
        { title: "Responsive design", definition: "Responsive design adapts interfaces to different screens and devices.", examples: ["mobile layouts", "fluid widths", "media queries"] },
        { title: "CSS specificity", definition: "Specificity decides which selector wins when rules target the same element.", examples: ["element selectors", "class selectors", "ID selectors"] },
        { title: "CSS selectors", definition: "Selectors identify the HTML elements a CSS rule applies to.", examples: [".card", "#app", "button", "[type='text']"] },
        { title: "Media queries", definition: "Media queries apply CSS rules when conditions such as viewport size are true.", examples: ["@media", "mobile breakpoints", "responsive layouts"] },
      ],
      keyTakeaways: ["React does not replace HTML semantics.", "Understand forms and basic accessibility before React forms.", "Be comfortable with the box model, Flexbox, Grid and responsive design.", "Understand specificity enough to debug conflicting styles."],
      commonMistakes: ["Using div elements for everything.", "Using a clickable div instead of a button.", "Adding a CSS framework before understanding layout.", "Ignoring responsive behavior until the end.", "Adding selectors without understanding specificity."],
      checklist: ["I can build a semantic HTML page.", "I can build a basic form with labels and inputs.", "I understand basic accessibility requirements.", "I understand the CSS box model.", "I can create layouts with Flexbox and Grid.", "I can make a page responsive.", "I understand specificity and can write CSS selectors.", "I can use media queries."],
    },
    {
      id: "tools",
      title: "Tools",
      explanation: "React development also requires tools to create, run, inspect, version and share frontend applications.",
      topics: [
        { title: "Terminal", definition: "A terminal is a text-based interface for running commands.", examples: ["cd", "ls", "mkdir", "npm commands", "Git commands"] },
        { title: "npm", definition: "npm is a package manager commonly used with JavaScript and Node.js projects.", examples: ["npm install", "npm run dev", "npm run build"] },
        { title: "Git", definition: "Git records changes to your code over time.", examples: ["git init", "git add", "git commit", "git branch"] },
        { title: "GitHub", definition: "GitHub hosts Git repositories and supports software collaboration.", examples: ["repositories", "pull requests", "issues"] },
        { title: "Chrome/Firefox DevTools", definition: "Browser DevTools inspect HTML, CSS, JavaScript, network requests, storage and performance.", examples: ["Elements", "Console", "Network", "Application", "Sources"] },
        { title: "VS Code or your preferred editor", definition: "A code editor is where you write and manage source code.", examples: ["VS Code", "WebStorm", "Neovim", "other editors"] },
      ],
      keyTakeaways: ["Navigate projects from the terminal.", "Understand the basic npm workflow.", "Know how to commit with Git and push to GitHub.", "Be comfortable using browser DevTools."],
      commonMistakes: ["Copying terminal commands without knowing the current directory.", "Running npm commands without knowing whether they install, run a script or execute a package.", "Treating GitHub as Git itself.", "Ignoring the Console and Network tabs while debugging."],
      checklist: ["I can navigate folders from the terminal.", "I can create and run an npm project.", "I can install dependencies.", "I can create a Git repository, commit changes and push to GitHub.", "I can use Elements, Console and Network tabs.", "I can use my code editor comfortably."],
    },
  ] satisfies ReactPrerequisiteSection[],
  finalChecklist: ["JavaScript fundamentals are comfortable enough that I do not need React to explain basic JavaScript.", "I understand the DOM, browser events, HTTP requests, responses, headers, status codes and CORS.", "I can use browser DevTools, especially the Network tab.", "I can build semantic HTML with forms and basic accessibility.", "I can use Flexbox, Grid, responsive design and media queries.", "I can use the terminal, npm, Git, GitHub and a code editor."],
  readinessProject: {
    name: "Build a Vanilla JavaScript User Directory",
    goal: "Prove you can build a small browser application without React before starting Day 1.",
    brief: "Build a user directory using only HTML, CSS and JavaScript. Fetch users from an API, render them into the DOM, handle loading and error states, and let people search the displayed users. Do not use React, Vue, Tailwind or another frontend framework.",
    steps: ["Create a semantic HTML page with header, main, section, form, input and button.", "Create a responsive layout with normal CSS, Flexbox or Grid.", "Use fetch() to request users from an API.", "Show a loading message while the request runs.", "Show a visible error when the request fails.", "Render users into the DOM with JavaScript.", "Add a search input that filters users with filter().", "Use addEventListener() for interaction.", "Inspect the request in DevTools Network.", "Store a compact/comfortable preference in localStorage."],
    acceptance: ["The page uses semantic HTML and works on desktop and mobile.", "It fetches and renders data without a frontend framework.", "Loading and useful error states are visible.", "The search field filters displayed users.", "The Network tab shows the request and response.", "It uses normal JavaScript modules and no frontend framework."],
    stretch: ["Add pagination or Load More.", "Add sorting with array methods.", "Use AbortController to cancel a request.", "Add a dark/light preference with localStorage.", "Verify keyboard-friendly interactions."],
  },
} as const;

const REACT_PHASE_0_PROJECT: LessonProject = {
  ...REACT_PHASE_0.readinessProject,
  steps: [...REACT_PHASE_0.readinessProject.steps],
  acceptance: [...REACT_PHASE_0.readinessProject.acceptance],
  stretch: [...REACT_PHASE_0.readinessProject.stretch],
};

export const REACT_PHASE_0_LESSONS: LessonDay = {
  day: 0,
  title: REACT_PHASE_0.title,
  totalMinutes: 0,
  difficulty: "Prerequisite",
  lessons: REACT_PHASE_0.sections.map((section) => ({
    id: section.id,
    title: section.title,
    durationMinutes: 0,
    explanation: `${section.explanation}\n\n---\n\n${section.topics
      .map((topic) => `<b>${topic.title}</b>\n${topic.definition}\n\nExamples: ${topic.examples.map((example) => `\`${example}\``).join(", ")}`)
      .join("\n\n")}\n\n---\n\n${section.checklist.map((item) => `• ${item}`).join("\n")}`,
    diagram: `Phase 0\n  ↓\n${section.title}\n  ↓\nComplete the readiness checks\n  ↓\nStart React Day 1`,
    codeExample: {
      title: "Topics to practice",
      code: section.topics.map((topic) => `• ${topic.title}: ${topic.examples.join(", ")}`).join("\n"),
    },
    keyTakeaways: [...section.keyTakeaways],
    commonMistakes: [...section.commonMistakes],
    quiz: [],
  })),
  finalQuiz: [],
  project: REACT_PHASE_0_PROJECT,
};
import type { LessonDay, LessonProject } from "@/lib/learn/lesson-types";
