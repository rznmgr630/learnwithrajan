import type { LessonDay, LessonProject } from "@/lib/learn/lesson-types";

/**
 * React — Phase 0: Before You Start
 *
 * This phase is NOT part of the 30-day React course.
 * Complete it before starting Day 1.
 */

export const REACT_PHASE_0 = {
  phase: 0,
  title: "Before You Start",
  description:
    "This phase is not part of the 30 days. Use it to make sure your JavaScript, browser, HTML/CSS, and development-tool fundamentals are strong enough that React does not become a substitute for learning JavaScript.",

  sections: [
    {
      id: "javascript-prerequisites",
      title: "JavaScript prerequisites",
      explanation:
        "You should already understand the following JavaScript concepts before starting React. You do not need to know every advanced JavaScript feature, but you should be comfortable reading and writing normal JavaScript without needing React to explain the language.",
      topics: [
        {
          title: "Variables and scope",
          definition:
            "Variables store values. Scope (the area of code where a variable can be accessed) determines where a variable is available.",
          examples: ["let", "const", "function scope", "block scope"],
        },
        {
          title: "Functions",
          definition:
            "A function is a reusable block of code that can receive input and return a result.",
          examples: ["function declaration", "parameters", "return values", "function calls"],
        },
        {
          title: "Arrow functions",
          definition:
            "An arrow function is a shorter syntax for writing functions and is commonly used in React code.",
          examples: ["const add = (a, b) => a + b", "array callbacks"],
        },
        {
          title: "Objects and arrays",
          definition:
            "Objects store related values using properties, while arrays store ordered collections of values.",
          examples: ["user objects", "arrays of items", "nested objects", "arrays of objects"],
        },
        {
          title: "Destructuring",
          definition:
            "Destructuring lets you take values out of objects or arrays and assign them to variables.",
          examples: [
            "const { name } = user",
            "const [first, second] = items",
          ],
        },
        {
          title: "Spread and rest syntax",
          definition:
            "Spread syntax expands values, while rest syntax collects multiple values into one variable.",
          examples: [
            "const copy = { ...user }",
            "const items = [ ...oldItems, newItem ]",
            "function fn(...args) {}",
          ],
        },
        {
          title: "Array methods",
          definition:
            "Array methods are built-in functions used to work with arrays without manually writing every loop.",
          examples: ["map()", "filter()", "find()", "some()", "every()", "reduce()"],
        },
        {
          title: "Closures",
          definition:
            "A closure happens when a function remembers variables from the scope where the function was created, even after that outer function has finished.",
          examples: ["callbacks", "factory functions", "private values"],
        },
        {
          title: "Modules",
          definition:
            "Modules let you split JavaScript code into separate files and share values between those files.",
          examples: ["export", "import", "default export", "named export"],
        },
        {
          title: "Promises",
          definition:
            "A Promise represents the eventual result of an asynchronous operation (work that finishes later).",
          examples: ["pending", "fulfilled", "rejected", "then()", "catch()"],
        },
        {
          title: "async/await",
          definition:
            "async/await is syntax that makes Promise-based asynchronous code easier to read.",
          examples: ["async function", "await fetch()", "try/catch"],
        },
        {
          title: "Error handling",
          definition:
            "Error handling means detecting and responding to problems instead of allowing unexpected failures to break the application.",
          examples: ["try/catch", "throw", "Promise rejection"],
        },
        {
          title: "Classes at a basic level",
          definition:
            "A class is a syntax for creating objects with shared structure and behavior. You only need the basics for React.",
          examples: ["class", "constructor", "methods", "new"],
        },
        {
          title: "JSON",
          definition:
            "JSON (JavaScript Object Notation) is a text format commonly used to exchange structured data between applications.",
          examples: ["JSON.stringify()", "JSON.parse()", "API responses"],
        },
        {
          title: "fetch",
          definition:
            "fetch is a browser API (a feature provided by the browser) used to make HTTP requests.",
          examples: ["GET requests", "POST requests", "response.json()"],
        },
        {
          title: "ES modules",
          definition:
            "ES modules are JavaScript's standard module system for importing and exporting code between files.",
          examples: ["import", "export", "named exports", "default exports"],
        },
      ],
      keyTakeaways: [
        "React is a JavaScript library, so JavaScript fundamentals come first.",
        "You should be comfortable with functions, objects, arrays, destructuring, spread/rest, and array methods.",
        "You should understand asynchronous JavaScript with Promises and async/await.",
        "You should understand modules, JSON, fetch, and basic error handling.",
        "React should help you build user interfaces, not become a replacement for learning JavaScript.",
      ],
      commonMistakes: [
        "Learning JSX before understanding normal JavaScript expressions.",
        "Memorizing React syntax without understanding functions and objects.",
        "Using React-specific solutions for problems that are actually basic JavaScript problems.",
      ],
      checklist: [
        "I can write and call functions without looking up the syntax.",
        "I can work comfortably with objects and arrays.",
        "I understand map(), filter(), find(), and the other common array methods.",
        "I understand destructuring and spread/rest syntax.",
        "I understand closures at a basic level.",
        "I can split code into modules using import/export.",
        "I understand Promises and can use async/await.",
        "I can handle errors with try/catch.",
        "I can parse and create JSON.",
        "I can make a basic HTTP request using fetch().",
      ],
    },

    {
      id: "browser-fundamentals",
      title: "Browser fundamentals",
      explanation:
        "React runs inside an environment provided by the browser. You should understand the basic browser concepts underneath React so that you know what React is actually doing for you.",
      topics: [
        {
          title: "DOM",
          definition:
            "DOM (Document Object Model) is the browser's tree-like representation of the HTML document. JavaScript can read and change this tree.",
          examples: ["document", "elements", "querySelector()", "textContent"],
        },
        {
          title: "Events",
          definition:
            "An event is something that happens in the browser, such as a click, keyboard input, form submission, or mouse movement.",
          examples: ["click", "submit", "input", "keydown"],
        },
        {
          title: "Event bubbling and capturing",
          definition:
            "Event propagation (the process by which an event travels through the DOM) has capturing and bubbling phases.",
          examples: ["parent/child events", "event bubbling", "event capturing"],
        },
        {
          title: "Browser rendering",
          definition:
            "Browser rendering is the process through which the browser turns HTML, CSS, and other information into pixels on the screen.",
          examples: ["DOM", "CSS", "layout", "paint"],
        },
        {
          title: "HTTP request/response",
          definition:
            "HTTP (Hypertext Transfer Protocol) is the communication protocol commonly used between browsers and web servers.",
          examples: ["request", "response", "GET", "POST"],
        },
        {
          title: "Request headers",
          definition:
            "Request headers are metadata sent with an HTTP request.",
          examples: ["Authorization", "Content-Type", "Accept"],
        },
        {
          title: "Response headers",
          definition:
            "Response headers are metadata sent back by the server with an HTTP response.",
          examples: ["Content-Type", "Cache-Control", "Set-Cookie"],
        },
        {
          title: "Status codes",
          definition:
            "HTTP status codes describe the result of an HTTP request.",
          examples: ["200 OK", "201 Created", "400 Bad Request", "401 Unauthorized", "404 Not Found", "500 Server Error"],
        },
        {
          title: "Cookies",
          definition:
            "Cookies are small pieces of data that a website can store in the browser and send with requests under appropriate rules.",
          examples: ["session cookies", "authentication cookies"],
        },
        {
          title: "CORS",
          definition:
            "CORS (Cross-Origin Resource Sharing) is a browser security mechanism that controls whether a web page can make requests to a different origin.",
          examples: ["origin", "Access-Control-Allow-Origin", "preflight request"],
        },
        {
          title: "localStorage",
          definition:
            "localStorage is browser storage that lets a website persist string data across browser sessions.",
          examples: ["setItem()", "getItem()", "removeItem()"],
        },
        {
          title: "sessionStorage",
          definition:
            "sessionStorage stores string data for the lifetime of a browser tab or session.",
          examples: ["setItem()", "getItem()", "removeItem()"],
        },
        {
          title: "AbortController",
          definition:
            "AbortController is a browser API that lets JavaScript cancel certain asynchronous operations, including fetch requests.",
          examples: ["controller.abort()", "signal"],
        },
        {
          title: "DevTools Network tab",
          definition:
            "The Network tab in browser DevTools lets you inspect HTTP requests and responses made by a web page.",
          examples: ["URL", "method", "status", "headers", "request payload", "response"],
        },
      ],
      diagram: `Basic browser execution model

JavaScript
    ↓
Browser APIs
    ↓
DOM
    ↓
Layout
    ↓
Paint
    ↓
Screen


A browser request

React application
      ↓
fetch()
      ↓
HTTP request
      ↓
Web server / API
      ↓
HTTP response
      ↓
JavaScript
      ↓
UI update`,
      keyTakeaways: [
        "The DOM is the browser's representation of the page.",
        "Events allow the browser and your application to communicate user actions.",
        "HTTP requests and responses are the foundation of browser-to-server communication.",
        "Headers and status codes provide important information about HTTP communication.",
        "CORS is a browser security mechanism, not a React feature.",
        "localStorage and sessionStorage are browser storage mechanisms with different lifetimes.",
        "The DevTools Network tab is one of the most important tools for debugging frontend applications.",
      ],
      commonMistakes: [
        "Thinking React replaces the DOM. React works with the browser's DOM rather than replacing the browser itself.",
        "Thinking CORS is caused by React. CORS is enforced by the browser.",
        "Debugging an API request only from React code instead of checking the Network tab.",
        "Ignoring HTTP status codes and only looking at the response body.",
      ],
      checklist: [
        "I can explain what the DOM is.",
        "I understand what a browser event is.",
        "I understand event bubbling at a basic level.",
        "I understand the basic path from JavaScript to pixels on the screen.",
        "I can explain an HTTP request and response.",
        "I understand request and response headers.",
        "I can recognize common HTTP status codes.",
        "I understand cookies at a basic level.",
        "I understand what CORS is.",
        "I know the difference between localStorage and sessionStorage.",
        "I know why AbortController exists.",
        "I can inspect a request in the DevTools Network tab.",
      ],
    },

    {
      id: "html-css",
      title: "HTML and CSS",
      explanation:
        "React creates user interfaces, but React does not replace HTML and CSS. You should be able to build a reasonable page with normal HTML and CSS before adding a styling framework or depending heavily on component libraries.",
      topics: [
        {
          title: "Semantic HTML",
          definition:
            "Semantic HTML uses HTML elements according to their meaning and purpose, such as header, nav, main, section, article, and button.",
          examples: ["<header>", "<nav>", "<main>", "<section>", "<article>", "<button>"],
        },
        {
          title: "Forms",
          definition:
            "HTML forms collect user input and provide standard browser behavior for submitting that input.",
          examples: ["form", "input", "label", "select", "textarea", "button"],
        },
        {
          title: "Accessibility basics",
          definition:
            "Accessibility means making an interface usable by people with different abilities and by different assistive technologies.",
          examples: ["labels", "button elements", "alt text", "keyboard access", "semantic HTML"],
        },
        {
          title: "Box model",
          definition:
            "The CSS box model describes an element as content surrounded by padding, border, and margin.",
          examples: ["content", "padding", "border", "margin"],
        },
        {
          title: "Flexbox",
          definition:
            "Flexbox is a CSS layout system designed for arranging elements along one or two main dimensions.",
          examples: ["display: flex", "justify-content", "align-items", "gap"],
        },
        {
          title: "Grid",
          definition:
            "CSS Grid is a layout system for arranging elements in rows and columns.",
          examples: ["display: grid", "grid-template-columns", "gap"],
        },
        {
          title: "Responsive design",
          definition:
            "Responsive design means creating interfaces that adapt to different screen sizes and devices.",
          examples: ["mobile layouts", "fluid widths", "media queries"],
        },
        {
          title: "CSS specificity",
          definition:
            "Specificity is the rule browsers use to determine which CSS selector wins when multiple rules target the same element.",
          examples: ["element selectors", "class selectors", "ID selectors"],
        },
        {
          title: "CSS selectors",
          definition:
            "Selectors identify which HTML elements a CSS rule should apply to.",
          examples: [".card", "#app", "button", "[type='text']"],
        },
        {
          title: "Media queries",
          definition:
            "Media queries apply CSS rules when certain conditions are true, commonly based on viewport size.",
          examples: ["@media", "mobile breakpoints", "responsive layouts"],
        },
      ],
      keyTakeaways: [
        "React does not replace HTML semantics.",
        "You should understand forms and basic accessibility before learning React forms.",
        "You should understand the CSS box model.",
        "You should be comfortable with Flexbox and Grid.",
        "You should understand responsive design and media queries.",
        "You should understand CSS specificity well enough to debug conflicting styles.",
        "Build a reasonable page with normal CSS before depending on Tailwind or another styling framework.",
      ],
      commonMistakes: [
        "Using div elements for everything instead of choosing semantic HTML elements.",
        "Using a clickable div instead of a button for button behavior.",
        "Adding a CSS framework before understanding basic CSS layout.",
        "Ignoring responsive behavior until the end of a project.",
        "Trying to fix a CSS problem by adding more selectors without understanding specificity.",
      ],
      checklist: [
        "I can build a semantic HTML page.",
        "I can build a basic form with labels and inputs.",
        "I understand basic accessibility requirements.",
        "I understand the CSS box model.",
        "I can create common layouts with Flexbox.",
        "I can create common layouts with Grid.",
        "I can make a page responsive.",
        "I understand CSS specificity at a basic level.",
        "I can write and understand CSS selectors.",
        "I can use media queries.",
      ],
    },

    {
      id: "tools",
      title: "Tools",
      explanation:
        "React development involves more than React itself. You should be comfortable with the basic tools used to create, run, inspect, version, and share frontend applications.",
      topics: [
        {
          title: "Terminal",
          definition:
            "A terminal is a text-based interface for running commands on your computer.",
          examples: ["cd", "ls", "mkdir", "npm commands", "Git commands"],
        },
        {
          title: "npm",
          definition:
            "npm is a package manager commonly used with JavaScript and Node.js projects.",
          examples: ["npm install", "npm run dev", "npm run build"],
        },
        {
          title: "Git",
          definition:
            "Git is a version control system that records changes to your code over time.",
          examples: ["git init", "git add", "git commit", "git branch"],
        },
        {
          title: "GitHub",
          definition:
            "GitHub is a platform for hosting Git repositories and collaborating on software projects.",
          examples: ["repositories", "pull requests", "issues"],
        },
        {
          title: "Chrome/Firefox DevTools",
          definition:
            "Browser DevTools are built-in browser tools for inspecting HTML, CSS, JavaScript, network requests, storage, and performance.",
          examples: ["Elements", "Console", "Network", "Application", "Sources"],
        },
        {
          title: "VS Code or your preferred editor",
          definition:
            "A code editor is the application you use to write and manage your source code.",
          examples: ["VS Code", "WebStorm", "Neovim", "other editors"],
        },
      ],
      keyTakeaways: [
        "You should be able to navigate your project from the terminal.",
        "You should understand the basic npm workflow.",
        "You should know how to commit code with Git.",
        "You should know how to push a repository to GitHub.",
        "You should be comfortable using browser DevTools.",
        "Use VS Code or another editor that you can work efficiently in.",
      ],
      commonMistakes: [
        "Copying terminal commands without understanding what directory you are currently in.",
        "Using npm commands without understanding whether you are installing dependencies, running a script, or executing a package.",
        "Treating GitHub as Git itself. Git is the version control system; GitHub is a hosting and collaboration platform.",
        "Ignoring the browser Console and Network tabs when debugging frontend problems.",
      ],
      checklist: [
        "I can navigate folders from the terminal.",
        "I can create and run an npm project.",
        "I can install npm dependencies.",
        "I can create a Git repository.",
        "I can commit changes.",
        "I can push a project to GitHub.",
        "I can use the browser Elements and Console tabs.",
        "I can inspect HTTP requests using the Network tab.",
        "I can use VS Code or my preferred editor comfortably.",
      ],
    },
  ],

  finalChecklist: [
    "JavaScript fundamentals are comfortable enough that I do not need React to explain basic JavaScript.",
    "I understand the DOM and basic browser events.",
    "I understand HTTP requests, responses, headers, status codes, and CORS.",
    "I can use browser DevTools, especially the Network tab.",
    "I can build a semantic HTML page.",
    "I understand forms and basic accessibility.",
    "I can use Flexbox and Grid.",
    "I understand responsive design and media queries.",
    "I can use the terminal.",
    "I can use npm.",
    "I can use Git and GitHub.",
    "I can use Chrome or Firefox DevTools.",
    "I am comfortable using VS Code or another code editor.",
  ],

  readinessProject: {
    name: "Build a Vanilla JavaScript User Directory",
    goal: "Prove that you can build a small browser application without React before starting Day 1.",
    brief:
      "Build a small user directory using only HTML, CSS, and JavaScript. The application should fetch users from an API, render them into the DOM, handle loading and error states, and allow the user to search the displayed users. Do not use React, Vue, Tailwind, or another frontend framework.",
    steps: [
      "Create a basic HTML page with semantic elements such as header, main, section, form, input, and button.",
      "Create a responsive layout using normal CSS, Flexbox, or Grid.",
      "Use fetch() to request user data from an API.",
      "Show a loading message while the request is running.",
      "Handle a failed request with a visible error message.",
      "Render the returned users into the DOM using JavaScript.",
      "Add a search input that filters the users using array methods such as filter().",
      "Use addEventListener() to handle user interaction.",
      "Inspect the API request in the browser DevTools Network tab.",
      "Store a small UI preference in localStorage, such as whether the user prefers a compact or comfortable list view.",
    ],
    acceptance: [
      "The page uses semantic HTML.",
      "The layout works on both desktop and mobile widths.",
      "The application fetches data without a frontend framework.",
      "A loading state is visible while the request is running.",
      "A useful error message appears when the request fails.",
      "Users are rendered dynamically into the DOM.",
      "The search field filters the displayed users.",
      "The Network tab shows the HTTP request and its response.",
      "The application uses normal JavaScript modules.",
      "No React or other frontend framework is used.",
    ],
    stretch: [
      "Add pagination or a Load More button.",
      "Add a sort control using array methods.",
      "Use AbortController to cancel an in-progress request when a new search request is started.",
      "Add a dark/light preference using localStorage.",
      "Add keyboard-friendly interactions and verify the page using only the keyboard.",
    ],
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
