import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_20_LESSONS: LessonDay = {
  day: 20,
  title: "Choosing a React Framework",
  totalMinutes: 60,
  difficulty: "Beginner",
  lessons: [
    {
      id: "day1",
      title: "Why Use a React Framework?",
      durationMinutes: 12,
      explanation: "Vite plus React Router is enough for many pure client-side applications. A framework becomes useful when the application needs server rendering, server-side data access, integrated routing, metadata, server functions, or deployment conventions. The key question is which requirements justify that infrastructure.",
      diagram: "Vite + React Router → browser-focused SPA\nFramework → routing + rendering + data + server + deployment conventions",
      codeExample: {
        title: "SPA vs framework",
        code: "// Pure SPA:\nReact + Vite + React Router\n\n// Framework:\nSSR/SSG + server data + integrated routing + deployment conventions"
      },
      keyTakeaways: [
        "Frameworks add conventions and integrated capabilities.",
        "A raw SPA remains valid for many internal products.",
        "Choose based on requirements."
      ],
      commonMistakes: [
        "Assuming every React project needs Next.js.",
        "Assuming a framework automatically improves every app.",
        "Ignoring deployment when choosing architecture."
      ],
      quiz: [
        {
          question: "What does a framework commonly add?",
          options: [
            "Integrated routing, rendering, data, and deployment conventions",
            "Only CSS",
            "Only JSX",
            "Only state"
          ],
          correctIndex: 0,
          explanation: "Frameworks integrate multiple application concerns."
        }
      ]
    },
    {
      id: "day2",
      title: "Next.js, TanStack Start, React Router Framework Mode, and Astro",
      durationMinutes: 12,
      explanation: "Next.js uses the App Router and is the default framework direction in this curriculum. TanStack Start is a full-stack framework built around the TanStack ecosystem. React Router also has framework capabilities with SSR and progressive enhancement. Astro is content-first and uses islands, where interactive components are added to otherwise mostly static pages.",
      diagram: "Framework choices\n├─ Next.js → App Router + Server Components\n├─ TanStack Start → TanStack full-stack\n├─ React Router → framework mode + SSR\n└─ Astro → content-first + islands",
      codeExample: {
        title: "Choosing by application type",
        code: "const needs = {\n  marketingSite: \"SEO + content + fast first load\",\n  adminDashboard: \"client-heavy interactions\",\n  realtimeApp: \"frequent client/server updates\",\n};\n\n// Map requirements to capabilities."
      },
      keyTakeaways: [
        "Next.js is this track's default.",
        "Astro is content-first with islands.",
        "TanStack and React Router also provide framework options."
      ],
      commonMistakes: [
        "Treating all frameworks as interchangeable.",
        "Choosing without considering deployment/team knowledge.",
        "Assuming islands means zero JavaScript everywhere."
      ],
      quiz: [
        {
          question: "What is Astro especially focused on?",
          options: [
            "Content-first sites with islands",
            "Only databases",
            "Only server actions",
            "Only mobile"
          ],
          correctIndex: 0,
          explanation: "Astro emphasizes content-first sites with islands."
        }
      ]
    },
    {
      id: "day3",
      title: "CSR, SSR, SSG, and ISR",
      durationMinutes: 12,
      explanation: "CSR (Client-Side Rendering) builds the UI primarily in the browser. SSR (Server-Side Rendering) produces HTML on the server for a request. SSG (Static Site Generation) produces HTML ahead of time. ISR (Incremental Static Regeneration) lets generated content be refreshed according to a revalidation strategy. Different routes can use different strategies.",
      diagram: "CSR → browser renders\nSSR → request → server renders\nSSG → build → static HTML\nISR → static output → regenerate when needed",
      codeExample: {
        title: "Rendering strategy comparison",
        code: "// CSR: browser renders UI.\n// SSR: server renders HTML for a request.\n// SSG: HTML generated during build.\n// ISR: generated output is refreshed according to a strategy."
      },
      keyTakeaways: [
        "CSR, SSR, SSG, and ISR describe different rendering strategies.",
        "A single app can use different strategies.",
        "Rendering affects first load, freshness, and infrastructure."
      ],
      commonMistakes: [
        "Treating SSR as automatically faster.",
        "Assuming SSG can never change.",
        "Using ISR without defining freshness expectations."
      ],
      quiz: [
        {
          question: "When is SSG especially useful?",
          options: [
            "Content that can be generated ahead of time",
            "Highly personalized requests",
            "Only live chat",
            "Only local state"
          ],
          correctIndex: 0,
          explanation: "Static generation suits content that can be generated ahead of requests."
        }
      ]
    },
    {
      id: "day4",
      title: "Hydration and the Server/Client Boundary",
      durationMinutes: 12,
      explanation: "Hydration is when browser React attaches behavior to HTML that was already rendered on the server. The browser can display server-rendered HTML before all client JavaScript becomes interactive. Server/client boundaries matter because server-only code cannot automatically use browser APIs or client hooks. Frameworks such as Next.js make this boundary explicit.",
      diagram: "Server → HTML → browser displays → hydration → interactive UI",
      codeExample: {
        title: "Hydration concept",
        code: "// Server-rendered HTML arrives first.\n// Client React hydrates interactive behavior.\n\n\"use client\";\n\nexport function ThemeButton() {\n  return <button onClick={() => console.log(\"toggle\")}>Theme</button>;\n}"
      },
      keyTakeaways: [
        "Hydration makes server-rendered HTML interactive.",
        "Server/client boundaries determine where code can run.",
        "Browser APIs belong on the client."
      ],
      commonMistakes: [
        "Thinking hydration means the server sends a fully interactive app.",
        "Using window/document in server-only code.",
        "Making an entire app client-only unnecessarily."
      ],
      quiz: [
        {
          question: "What is hydration?",
          options: [
            "Attaching client React behavior to existing HTML",
            "Generating CSS",
            "Migrating a database",
            "Creating a route"
          ],
          correctIndex: 0,
          explanation: "Hydration connects client React behavior to server-rendered markup."
        }
      ]
    },
    {
      id: "day5",
      title: "Choosing the Right Architecture",
      durationMinutes: 12,
      explanation: "Architecture should follow product requirements. A pure internal dashboard with no SEO need can be a Vite SPA. A content-heavy site may benefit from static generation. A product needing server rendering and server data access may benefit from a full-stack React framework.\n\nWrite down SEO, personalization, data freshness, interactivity, authentication, deployment, server work, team familiarity, and expected scale before choosing.",
      diagram: "Requirements → SEO / personalization / freshness / interactivity / server work / deployment → architecture",
      codeExample: {
        title: "Architecture decision",
        code: "type Requirements = {\n  seo: boolean;\n  serverRendering: boolean;\n  clientHeavy: boolean;\n  contentFirst: boolean;\n};\n\n// Start with requirements, then choose architecture."
      },
      keyTakeaways: [
        "Architecture starts with requirements.",
        "No framework is universally correct.",
        "The simplest architecture satisfying the requirements is often easier to maintain."
      ],
      commonMistakes: [
        "Choosing a framework first.",
        "Ignoring team deployment knowledge.",
        "Adding server infrastructure without a real need."
      ],
      quiz: [
        {
          question: "What should come before framework selection?",
          options: [
            "Application requirements",
            "Popularity",
            "CSS preference",
            "Component count only"
          ],
          correctIndex: 0,
          explanation: "Requirements should drive architecture."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "What is a framework's architectural benefit?",
      options: [
        "Integrated conventions and capabilities",
        "Only JSX",
        "Only CSS",
        "Only state"
      ],
      correctIndex: 0,
      explanation: "Frameworks integrate routing, rendering, data, server features, and deployment."
    },
    {
      question: "Which is this track's default framework?",
      options: [
        "Next.js",
        "jQuery",
        "Angular",
        "Astro only"
      ],
      correctIndex: 0,
      explanation: "Next.js is the default framework direction."
    },
    {
      question: "What is Astro known for?",
      options: [
        "Content-first islands",
        "Redux integration",
        "Only server actions",
        "Only mobile"
      ],
      correctIndex: 0,
      explanation: "Astro is content-first and uses islands."
    },
    {
      question: "What does SSR mean?",
      options: [
        "Server-Side Rendering",
        "Static State Routing",
        "Shared Server React",
        "Screen State Rendering"
      ],
      correctIndex: 0,
      explanation: "SSR means HTML is rendered on the server for a request."
    },
    {
      question: "What does SSG mean?",
      options: [
        "Static Site Generation",
        "Server State Graph",
        "Shared Style Generation",
        "Static Server Gateway"
      ],
      correctIndex: 0,
      explanation: "SSG generates pages ahead of requests."
    },
    {
      question: "What is hydration?",
      options: [
        "Attaching client behavior to server-rendered HTML",
        "Generating CSS",
        "Creating database tables",
        "Creating a route"
      ],
      correctIndex: 0,
      explanation: "Hydration makes server-rendered HTML interactive."
    },
    {
      question: "Why can routes use different rendering strategies?",
      options: [
        "They have different requirements",
        "React forbids one strategy",
        "CSS decides",
        "Only databases decide"
      ],
      correctIndex: 0,
      explanation: "Different routes can have different rendering needs."
    },
    {
      question: "What should drive framework selection?",
      options: [
        "Product and technical requirements",
        "Popularity alone",
        "Downloads only",
        "Preference alone"
      ],
      correctIndex: 0,
      explanation: "Architecture should satisfy actual requirements."
    }
  ],
  project: {
    name: "Framework Architecture Decision Lab",
    goal: "Learn to choose a React architecture by evaluating application requirements.",
    brief: "Compare a Vite SPA, Next.js, TanStack Start, React Router framework mode, and Astro for several scenarios, then prototype one architecture.",
    steps: [
      "Define requirements for a marketing site, internal admin dashboard, and personalized product app.",
      "Record SEO, rendering, data, interactivity, authentication, and deployment needs.",
      "Compare CSR, SSR, SSG, and ISR.",
      "Explain hydration and server/client boundaries.",
      "Choose one architecture and explain trade-offs.",
      "Build a minimal prototype with one route and one interactive client component."
    ],
    acceptance: [
      "The decision starts from requirements.",
      "CSR, SSR, SSG, and ISR are correctly distinguished.",
      "Hydration is explained practically.",
      "The prototype has a working route and interactive UI.",
      "Trade-offs are documented."
    ],
    stretch: [
      "Build the same page as a Vite SPA and Next.js route.",
      "Compare initial HTML and JS payloads.",
      "Add server-rendered data.",
      "Compare the concept with Astro islands."
    ]
  }
};
