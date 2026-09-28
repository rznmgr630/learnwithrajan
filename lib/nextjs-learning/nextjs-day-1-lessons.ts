import type { LessonDay } from "@/lib/learn/lesson-types";

export const NEXTJS_DAY_1_LESSONS: LessonDay = {
  day: 1,
  title: "What Next.js Actually Is",
  totalMinutes: 75,
  difficulty: "Beginner",

  lessons: [
    {
      id: "nextjs-day1-react-vs-nextjs",
      title: "React vs Next.js",
      durationMinutes: 15,

      explanation: `
React is a JavaScript library for building user interfaces. Its main job is to help you create reusable UI components such as buttons, forms, navigation bars, cards, dashboards, and complete pages. React gives you the component model, JSX, state management primitives, hooks, and the rendering system, but it intentionally does not try to solve every problem involved in building a complete web application.

For example, React does not by itself define one standard way to organize application routes, create a backend API, render pages on the server, optimize images, handle metadata, or structure a production web application. You can add separate libraries and tools for these problems, but then you are responsible for connecting and configuring those pieces.

Next.js is a React framework. A framework provides a larger application structure around React and gives you conventions and built-in capabilities for common web-development problems. Next.js can handle routing, server rendering, static generation, server-side code, API endpoints and other backend capabilities, asset optimization, and production-oriented application tooling.

A useful way to think about the relationship is: React helps you build the UI, while Next.js provides a framework for building an entire web application with React.

### React as a UI library

With React alone, you might start with components such as:

\`\`\`text
App
├── Header
├── Navigation
├── HomePage
│   ├── Hero
│   └── ProductList
└── Footer
\`\`\`

You then choose additional tools for routing, data fetching, server communication, and other application concerns.

### Next.js as an application framework

Next.js keeps React at the center but adds an application structure around it:

\`\`\`text
                    Next.js Application
                           |
             +-------------+-------------+
             |             |             |
          Routing      Rendering      Server Code
             |             |             |
          App Router   Server/Client   APIs / DB
                       Components
             |
          React UI
\`\`\`

This does not mean that React and Next.js are competing technologies. Next.js is built on top of React and uses React components as the primary way to create the user interface.

### Why Next.js exists

As an application grows, several concerns appear at the same time:

- How should URLs map to pages?
- Which code should run in the browser?
- Which code should run on the server?
- How should data be fetched?
- How can a page be rendered efficiently?
- How should metadata and assets be handled?
- How should the application be built for production?

Next.js provides conventions and built-in features for many of these concerns so developers do not have to assemble everything from unrelated tools.

The important idea for a beginner is not that Next.js replaces React. Instead, Next.js gives React a complete application environment.
`,

      diagram: `
React:

Browser
  |
  v
React Application
  |
  +--> Components
  +--> State
  +--> Hooks
  +--> UI rendering

Next.js:

Browser
  |
  v
Next.js Application
  |
  +--> App Router
  +--> React Components
  +--> Server Components
  +--> Client Components
  +--> Server-side code
  +--> Data fetching
  +--> Build system
  +--> Production tooling
`,

      codeExample: {
        title: "A React component works inside a Next.js application",
        code: `// app/page.tsx

export default function HomePage() {
  return (
    <main>
      <h1>Welcome to my portfolio</h1>
      <p>I am a software engineer.</p>
    </main>
  );
}

// This is a React component.
// Next.js provides the application structure
// around this component.`,
      },

      keyTakeaways: [
        "React is a JavaScript library focused primarily on building user interfaces.",
        "Next.js is a React framework for building complete web applications.",
        "Next.js does not replace React; it uses React as its UI foundation.",
        "React applications often need additional libraries for routing and other application concerns.",
        "Next.js provides conventions and built-in capabilities for many common web application requirements.",
      ],

      commonMistakes: [
        "Thinking that React and Next.js are completely different technologies.",
        "Thinking that Next.js means you no longer need to understand React.",
        "Assuming every React application must use Next.js.",
        "Assuming Next.js is only a backend framework because it can execute server-side code.",
      ],

      quiz: [
        {
          question: "What is React primarily used for?",
          options: [
            "Managing databases",
            "Building user interfaces",
            "Configuring web servers",
            "Managing operating systems",
          ],
          correctIndex: 1,
          explanation:
            "React is primarily a library for building user interfaces using reusable components.",
        },
        {
          question: "What is Next.js?",
          options: [
            "A database",
            "A CSS framework",
            "A React framework for building web applications",
            "A replacement for JavaScript",
          ],
          correctIndex: 2,
          explanation:
            "Next.js is a framework built around React that provides application-level features and conventions.",
        },
      ],
    },

    {
      id: "nextjs-day1-full-stack-architecture",
      title: "Full-Stack React and Next.js Architecture",
      durationMinutes: 17,

      explanation: `
When people say that Next.js enables "full-stack React," they mean that one Next.js project can contain both the user interface and server-side application code. You can build the frontend with React components while also running trusted server-side logic inside the same application.

In a traditional architecture, you might have a React frontend and a separate backend:

\`\`\`text
React Frontend
      |
      | HTTP
      v
Backend API
      |
      v
Database
\`\`\`

That architecture is still completely valid. However, it means that you maintain two applications and decide how they communicate.

With Next.js, the application can contain both frontend and server-side parts:

\`\`\`text
                 Next.js Application
                        |
             +----------+----------+
             |                     |
        React UI              Server Code
             |                     |
             |                     v
             |                  Database
             |
          Browser
\`\`\`

This is especially useful when the frontend and server-side logic belong to the same product.

### Browser code vs server code

One of the most important ideas in modern Next.js is that not every piece of code needs to run in the browser.

Browser-side code can interact with things such as:

- User clicks
- Input fields
- Browser APIs
- Local browser state

Server-side code can safely perform tasks such as:

- Database queries
- Reading server environment variables
- Calling private backend services
- Performing trusted business logic

Keeping server-only operations on the server can reduce the amount of JavaScript sent to the browser and helps prevent sensitive server-side values from being exposed.

### A request flow

Suppose a portfolio contains a page showing projects stored in a database.

A simplified flow can look like this:

\`\`\`text
User opens /projects
        |
        v
      Browser
        |
        | HTTP request
        v
   Next.js Server
        |
        v
   Server Component
        |
        v
    Database
        |
        v
   Project data
        |
        v
    Rendered UI
        |
        v
      Browser
\`\`\`

This architecture is one reason Next.js is useful for applications that need both rich interfaces and server-side functionality.

### Next.js is not only "SSR"

A common beginner misunderstanding is to describe Next.js as simply a server-side rendering framework. Next.js supports several rendering and execution patterns. Some pages can be statically generated, some can depend on request-time information, and some UI can run interactively in the browser.

The important concept at this stage is that Next.js gives you multiple ways to decide where and when application work should happen.
`,

      diagram: `
                    User
                     |
                     v
                  Browser
                     |
                     | HTTP request
                     v
              Next.js Application
                     |
          +----------+----------+
          |                     |
          v                     v
    React UI              Server Logic
                                |
                                v
                           Database/API
                                |
                                v
                         Data / Result
                                |
                                v
                           Render UI
`,

      codeExample: {
        title: "Server-side data access with a component",
        code: `// app/projects/page.tsx

type Project = {
  id: number;
  name: string;
};

async function getProjects(): Promise<Project[]> {
  const response = await fetch("https://example.com/api/projects");

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main>
      <h1>My Projects</h1>

      {projects.map((project) => (
        <article key={project.id}>
          <h2>{project.name}</h2>
        </article>
      ))}
    </main>
  );
}`,
      },

      keyTakeaways: [
        "A Next.js application can contain both UI code and server-side code.",
        "Not all application code needs to run in the browser.",
        "Server-side code is appropriate for private data access and trusted operations.",
        "A full-stack Next.js application can communicate with databases and external services.",
        "Next.js supports multiple rendering strategies rather than only one rendering model.",
      ],

      commonMistakes: [
        "Thinking all Next.js code runs in the browser.",
        "Putting database credentials into client-side code.",
        "Assuming full-stack Next.js means a separate backend is never needed.",
        "Thinking Next.js is only useful for server-side rendering.",
      ],

      quiz: [
        {
          question:
            "Where should a database password normally be kept?",
          options: [
            "Inside a browser component",
            "Inside client-side JavaScript",
            "On the server",
            "Inside the page HTML",
          ],
          correctIndex: 2,
          explanation:
            "Sensitive credentials should remain on the server and should not be exposed to browser code.",
        },
        {
          question: "What does full-stack React commonly mean in Next.js?",
          options: [
            "Using React without JavaScript",
            "Using React for UI while also having server-side application capabilities",
            "Using only a database",
            "Using React only for CSS",
          ],
          correctIndex: 1,
          explanation:
            "Next.js allows React UI and server-side application logic to exist within the same project.",
        },
      ],
    },

    {
      id: "nextjs-day1-app-router-structure",
      title: "App Router and Project Structure",
      durationMinutes: 18,

      explanation: `
The App Router is the routing system used by modern Next.js applications. It is based on the app directory and uses the filesystem to define routes. This means the folders and files inside app/ are not just ordinary organizational folders; they can define the URL structure of your application.

For example, if you have:

\`\`\`text
app/
├── page.tsx
├── about/
│   └── page.tsx
└── projects/
    └── page.tsx
\`\`\`

the pages correspond conceptually to:

\`\`\`text
/          -> app/page.tsx
/about     -> app/about/page.tsx
/projects  -> app/projects/page.tsx
\`\`\`

The file named page.tsx has a special meaning. It defines the UI for a route.

The file named layout.tsx is another special file. Layouts allow you to create shared UI around pages. For example, a root layout can contain the HTML structure, navigation, and other shared elements.

### Important project directories and files

A typical project can look like:

\`\`\`text
my-portfolio/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── about/
│   │   └── page.tsx
│   └── projects/
│       └── page.tsx
├── public/
├── package.json
├── tsconfig.json
├── next.config.ts
└── eslint.config.mjs
\`\`\`

### app/

Contains the application's routes and special route files.

### public/

Contains static assets that can be referenced by a public URL, such as images, icons, and other files.

### package.json

Describes the project and its dependencies. It also contains scripts such as dev, build, and start.

### tsconfig.json

Configures TypeScript for the project.

### next.config.ts

Contains Next.js-specific configuration.

### eslint.config.mjs

Contains ESLint configuration for checking code quality and common problems.

### File-system routing

The App Router makes routing easier to understand because the URL structure is visible in the directory structure.

For example:

\`\`\`text
app/
└── blog/
    ├── page.tsx
    └── posts/
        └── page.tsx
\`\`\`

creates:

\`\`\`text
/blog
/blog/posts
\`\`\`

The folder names become route segments. A route segment is one part of a URL path.
`,

      diagram: `
Project files:

app/
├── page.tsx
├── about/
│   └── page.tsx
└── projects/
    └── page.tsx

        |
        v

URL structure:

/             -> Home
/about        -> About
/projects     -> Projects
`,

      codeExample: {
        title: "Creating routes with the App Router",
        code: `// app/page.tsx
export default function HomePage() {
  return <h1>Home</h1>;
}

// app/about/page.tsx
export default function AboutPage() {
  return <h1>About Me</h1>;
}

// app/projects/page.tsx
export default function ProjectsPage() {
  return <h1>My Projects</h1>;
}

// The resulting routes are:
//
// /
// /about
// /projects`,
      },

      keyTakeaways: [
        "The App Router uses the app directory to define application routes.",
        "A page.tsx file represents the UI for a route.",
        "Folder names become route segments.",
        "layout.tsx is used for shared UI and layouts.",
        "public/ is commonly used for static assets.",
        "tsconfig.json configures TypeScript.",
        "next.config.ts contains Next.js-specific configuration.",
        "package.json contains project dependencies and scripts.",
      ],

      commonMistakes: [
        "Putting a normal component in app/ and expecting it automatically to become a route.",
        "Forgetting that a route needs a special file such as page.tsx.",
        "Confusing public/ with app/.",
        "Thinking every file inside app/ automatically becomes a URL.",
      ],

      quiz: [
        {
          question: "Which file defines the UI for a route in the App Router?",
          options: ["route.tsx", "page.tsx", "screen.tsx", "index.js"],
          correctIndex: 1,
          explanation:
            "In the App Router, page.tsx is the special file used to define the UI for a route.",
        },
        {
          question: "What URL does app/about/page.tsx represent?",
          options: ["/page/about", "/app/about", "/about", "/about/page"],
          correctIndex: 2,
          explanation:
            "The about folder creates the /about route segment.",
        },
      ],
    },

    {
      id: "nextjs-day1-create-run",
      title: "Creating and Running a Next.js Application",
      durationMinutes: 12,

      explanation: `
The easiest way to start a new Next.js application is to use create-next-app. This command creates a project with the basic files and configuration needed to begin development.

A typical command is:

\`\`\`bash
npx create-next-app@latest my-portfolio
\`\`\`

The CLI asks several questions, such as whether you want TypeScript, ESLint, and other project options. For this learning path, use TypeScript and the App Router.

After creating the project, move into the directory and install/start the development server if necessary:

\`\`\`bash
cd my-portfolio
npm run dev
\`\`\`

The development server lets you work on the application while Next.js watches your source files and rebuilds the application as you make changes.

### next dev

\`next dev\` starts the development server. Development mode is designed for local development and provides useful feedback while you work.

Usually you will run:

\`\`\`bash
npm run dev
\`\`\`

The npm script normally maps to the Next.js command.

### next build

\`next build\` creates a production build of your application.

\`\`\`bash
npm run build
\`\`\`

A production build checks and prepares the application for deployment.

### next start

\`next start\` starts the production server after a successful production build.

\`\`\`bash
npm run start
\`\`\`

A simplified development-to-production flow is:

\`\`\`text
Write code
   |
   v
npm run dev
   |
   v
Test locally
   |
   v
npm run build
   |
   v
Production build
   |
   v
npm run start
\`\`\`

### Why development and production are different

Development mode prioritizes a fast developer experience and useful debugging information. Production mode uses the built application and is intended to serve the optimized application to users.

Do not confuse \`npm run start\` with \`npm run dev\`. In a normal Next.js workflow, \`start\` expects a production build to already exist.
`,

      diagram: `
Development:

Source Code
    |
    v
next dev
    |
    v
Local Development Server
    |
    v
Browser


Production:

Source Code
    |
    v
next build
    |
    v
Production Build
    |
    v
next start
    |
    v
Users
`,

      codeExample: {
        title: "Create and run a Next.js application",
        code: `# Create a new application
npx create-next-app@latest my-portfolio

# Enter the project
cd my-portfolio

# Start development
npm run dev

# Create a production build
npm run build

# Start the production application
npm run start`,
      },

      keyTakeaways: [
        "create-next-app is the standard starting point for a new Next.js application.",
        "npm run dev starts the development server.",
        "npm run build creates the production build.",
        "npm run start starts the production application after building.",
        "Development mode and production mode have different purposes.",
      ],

      commonMistakes: [
        "Running npm start before creating a production build.",
        "Assuming npm run dev is how the application should normally be run in production.",
        "Forgetting to enter the project directory before running npm commands.",
        "Changing generated configuration without understanding what it controls.",
      ],

      quiz: [
        {
          question: "Which command is normally used during development?",
          options: [
            "npm run start",
            "npm run dev",
            "npm run production",
            "npm run serve-build",
          ],
          correctIndex: 1,
          explanation:
            "npm run dev normally starts the Next.js development server.",
        },
        {
          question: "What does npm run build do?",
          options: [
            "Creates the production build",
            "Deletes the project",
            "Starts a database",
            "Creates a Git repository",
          ],
          correctIndex: 0,
          explanation:
            "The build command prepares the application for production.",
        },
      ],
    },

    {
      id: "nextjs-day1-typescript-eslint-config-project",
      title: "TypeScript, ESLint, Configuration, and Your First Portfolio",
      durationMinutes: 13,

      explanation: `
Next.js works very well with TypeScript. TypeScript adds static type checking to JavaScript. Static type checking means that many incorrect assumptions about values can be detected while you are writing or building the application instead of discovering them only after the code runs.

The tsconfig.json file controls TypeScript behavior. You do not need to memorize every option on the first day. The important thing is to understand that this file tells TypeScript how the project should be checked and interpreted.

For example, TypeScript can help catch an incorrect value:

\`\`\`ts
function greet(name: string) {
  return \\\`Hello, \\\${name}\\\`;
}

greet("Rajan");

// TypeScript knows that name must be a string.
\`\`\`

### ESLint

ESLint is a tool that analyzes JavaScript and TypeScript code to identify potential problems and enforce coding rules. It can catch issues that are easy to miss during normal development.

For example, a linter can warn about problematic patterns, unused variables, and other code-quality issues depending on the configured rules.

ESLint is not a replacement for TypeScript. They solve different problems:

\`\`\`text
TypeScript
    |
    +--> Type correctness
    |
    +--> Value/type relationships

ESLint
    |
    +--> Code quality
    |
    +--> Coding rules
    |
    +--> Problematic patterns
\`\`\`

### next.config.ts

next.config.ts is the configuration file for Next.js. It allows you to customize supported Next.js behavior.

You should avoid changing configuration just because an option exists. Configuration is powerful, but unnecessary configuration makes a project harder to understand.

A minimal configuration can look like:

\`\`\`ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
\`\`\`

As you learn Next.js, you will encounter configuration options for things such as image handling, redirects, headers, experimental features, and other framework behavior.

### Building your first portfolio

Now combine everything you learned today into a small developer portfolio.

The first version does not need authentication, a database, or a complex design. The goal is to understand how a Next.js project is organized.

A simple portfolio can contain:

\`\`\`text
/
├── Home
├── About
├── Projects
└── Contact
\`\`\`

You should create these routes:

\`\`\`text
app/
├── page.tsx
├── about/
│   └── page.tsx
├── projects/
│   └── page.tsx
└── contact/
    └── page.tsx
\`\`\`

For the first version, use static information. Later days will introduce more advanced routing, data fetching, server components, databases, forms, authentication, and other features.

The goal today is to become comfortable looking at a Next.js project and understanding what each major part is responsible for.
`,

      diagram: `
Developer Portfolio

                    Next.js App
                        |
        +---------------+---------------+
        |               |               |
       Home            About          Projects
        |               |               |
        +---------------+---------------+
                        |
                     Contact


Project structure:

app/
├── layout.tsx
├── page.tsx
├── about/page.tsx
├── projects/page.tsx
└── contact/page.tsx
`,

      codeExample: {
        title: "Portfolio home page",
        code: `// app/page.tsx

export default function HomePage() {
  return (
    <main>
      <section>
        <p>Hi, I'm Rajan.</p>

        <h1>
          Software Engineer
        </h1>

        <p>
          I build backend and full-stack web applications
          using Node.js, Laravel, React, and Next.js.
        </p>
      </section>

      <section>
        <h2>What I do</h2>

        <ul>
          <li>Backend development</li>
          <li>Full-stack development</li>
          <li>API development</li>
          <li>Database design</li>
        </ul>
      </section>
    </main>
  );
}

// app/about/page.tsx

export default function AboutPage() {
  return (
    <main>
      <h1>About Me</h1>
      <p>
        I am a software engineer interested in backend
        systems and modern web development.
      </p>
    </main>
  );
}`,
      },

      keyTakeaways: [
        "TypeScript provides static type checking for JavaScript code.",
        "tsconfig.json controls TypeScript project behavior.",
        "ESLint checks code for potential problems and coding-rule violations.",
        "TypeScript and ESLint solve different problems and can be used together.",
        "next.config.ts is the main Next.js configuration file.",
        "Your first portfolio should focus on understanding project structure and routing rather than complex features.",
      ],

      commonMistakes: [
        "Thinking TypeScript automatically prevents every runtime error.",
        "Treating ESLint errors as the same thing as TypeScript errors.",
        "Adding many Next.js configuration options without understanding them.",
        "Trying to build a complete production portfolio on the first day instead of focusing on the framework fundamentals.",
      ],

      quiz: [
        {
          question: "What is the main purpose of tsconfig.json?",
          options: [
            "Configure TypeScript",
            "Configure PostgreSQL",
            "Configure Git",
            "Configure CSS",
          ],
          correctIndex: 0,
          explanation:
            "tsconfig.json defines TypeScript compiler and project settings.",
        },
        {
          question: "What is ESLint mainly used for?",
          options: [
            "Hosting the application",
            "Checking code quality and potential problems",
            "Creating database tables",
            "Rendering HTML",
          ],
          correctIndex: 1,
          explanation:
            "ESLint analyzes code for problematic patterns and configured coding rules.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "Which statement best describes Next.js?",
      options: [
        "It is a database system",
        "It is a CSS-only framework",
        "It is a React framework for building web applications",
        "It is a replacement for TypeScript",
      ],
      correctIndex: 2,
      explanation:
        "Next.js is a React framework that provides application-level capabilities and conventions.",
    },
    {
      question: "Which directory is the foundation of the App Router?",
      options: ["components/", "app/", "assets/", "server/"],
      correctIndex: 1,
      explanation:
        "The App Router uses the app directory to define routes and special route files.",
    },
    {
      question: "What does app/projects/page.tsx represent?",
      options: [
        "/page/projects",
        "/projects",
        "/app/projects",
        "/projects/page",
      ],
      correctIndex: 1,
      explanation:
        "The projects folder becomes the /projects route segment.",
    },
    {
      question: "Which command starts the Next.js development server?",
      options: [
        "npm run build",
        "npm run start",
        "npm run dev",
        "npm run production",
      ],
      correctIndex: 2,
      explanation:
        "npm run dev normally starts the development server.",
    },
    {
      question: "Which file contains TypeScript configuration?",
      options: ["package.json", "next.config.ts", "tsconfig.json", "eslint.config.mjs"],
      correctIndex: 2,
      explanation:
        "tsconfig.json contains TypeScript configuration for the project.",
    },
    {
      question:
        "Why can server-side code be useful in a full-stack Next.js application?",
      options: [
        "It makes JavaScript unnecessary",
        "It allows trusted operations such as private data access to stay on the server",
        "It replaces the browser",
        "It removes the need for React",
      ],
      correctIndex: 1,
      explanation:
        "Server-side code can safely perform trusted operations and access private resources without exposing them directly to the browser.",
    },
  ],

  project: {
    name: "Developer Portfolio",
    goal:
      "Build a small multi-page developer portfolio that demonstrates the basic structure of a Next.js App Router application.",

    brief: `
Create a beginner-friendly developer portfolio using Next.js and TypeScript.

The portfolio should contain a home page, about page, projects page, and contact page. Use the App Router and organize each page using the appropriate app directory structure.

Do not add a database, authentication, or complicated backend functionality yet. The purpose of this project is to practice the fundamentals from Day 1: understanding Next.js, creating a project, working with the App Router, understanding the project structure, and running development and production builds.
`,

    steps: [
      "Create a new Next.js application using create-next-app.",
      "Choose TypeScript and the App Router.",
      "Start the application with npm run dev.",
      "Create the home page at app/page.tsx.",
      "Create the about page at app/about/page.tsx.",
      "Create the projects page at app/projects/page.tsx.",
      "Create the contact page at app/contact/page.tsx.",
      "Add basic portfolio information to each page.",
      "Add a shared layout using app/layout.tsx.",
      "Review tsconfig.json, package.json, eslint configuration, and next.config.ts.",
      "Run npm run build to verify that the application can be built for production.",
      "Run npm run start after the production build and verify the application works.",
    ],

    acceptance: [
      "The project starts successfully with npm run dev.",
      "The home page is available at /.",
      "The about page is available at /about.",
      "The projects page is available at /projects.",
      "The contact page is available at /contact.",
      "The pages use TypeScript and valid React components.",
      "A shared root layout is present.",
      "The project can successfully complete npm run build.",
      "The production application can be started with npm run start.",
      "The developer can explain the purpose of app/, public/, package.json, tsconfig.json, and next.config.ts.",
    ],

    stretch: [
      "Add a navigation component shared by the portfolio pages.",
      "Add a profile image from the public/ directory.",
      "Create a reusable ProjectCard React component.",
      "Add a skills section to the home page.",
      "Add basic responsive styling.",
      "Add project links to GitHub or live deployments.",
    ],
  },
};
