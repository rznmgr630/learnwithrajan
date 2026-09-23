import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_26_LESSONS: LessonDay = {
  day: 26,
  title: "Browser Performance and React Rendering",
  totalMinutes: 65,
  difficulty: "Beginner",
  lessons: [
    {
      id: "react-day-26-lesson-1",
      title: "How Browser Rendering Affects React",
      durationMinutes: 13,
      explanation: `React does not draw pixels directly onto the screen. React produces and updates the DOM, and the browser then performs work such as style calculation, layout, painting, and compositing. Understanding this pipeline helps you recognize why a component can be logically correct but still produce a slow interaction.

A useful mental model is JavaScript → DOM updates → style calculation → layout → paint → compositing. Layout (calculating where elements belong) can become expensive when many elements change size or position. Paint (turning elements into pixels) can also become expensive when large or visually complex areas need to be redrawn.

For example, changing a small text node usually affects much less work than repeatedly changing the size of a large container containing thousands of descendants. React performance and browser performance therefore overlap, but they are not exactly the same problem.`,
      diagram: `React state change
      ↓
React render
      ↓
DOM commit
      ↓
Browser
├── Style
├── Layout
├── Paint
└── Composite
      ↓
    Screen`,
      codeExample: {
        title: "Avoid unnecessary layout-changing work",
        code: `function Progress({ value }: { value: number }) {
  return (
    <div className="progress">
      <div
        className="progressBar"
        style={{ width: \`\${value}%\` }}
      />
    </div>
  );
}

// Keep expensive visual work isolated to the element that needs it.`,
      },
      keyTakeaways: [
        "React rendering and browser rendering are related but different stages.",
        "Large DOM trees and repeated layout or paint work can become expensive.",
        "Performance debugging should consider both JavaScript and browser work.",
      ],
      commonMistakes: [
        "Assuming every slow interaction is caused by React.",
        "Optimizing JavaScript while ignoring layout and paint.",
        "Changing many DOM elements when only one visual region needs updating.",
      ],
      quiz: [
        {
          question: "What happens after React commits DOM changes?",
          options: [
            "The browser performs rendering work such as style, layout, and paint",
            "The database automatically updates",
            "TypeScript runs again",
            "React sends an HTTP request"
          ],
          correctIndex: 0,
          explanation: "The browser takes the committed DOM and performs its own rendering pipeline.",
        },
      ],
    },
    {
      id: "react-day-26-lesson-2",
      title: "React Render, Commit, and Re-rendering",
      durationMinutes: 13,
      explanation: `A React update can be understood in two important phases: render and commit. During render, React calculates what the UI should look like. During commit, React applies the necessary changes to the DOM. A render does not automatically mean that every DOM node was changed.

A component can render again because its state changes, its parent renders, or its consumed context changes. React then compares the new result with the previous result and determines what actually needs to change. This distinction is important because "the component rendered" and "the browser changed everything" are not the same thing.

For example, a parent may render because its counter changes while a child receives the same props. Depending on the component structure and memoization, the child may still be evaluated. Measure this behavior before deciding that it is a real performance problem.`,
      diagram: `State/props/context change
          ↓
       Render phase
          ↓
   React calculates UI
          ↓
      Commit phase
          ↓
   Necessary DOM updates`,
      codeExample: {
        title: "Parent and child renders",
        code: `function Parent() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        {count}
      </button>
      <Child />
    </>
  );
}

function Child() {
  console.log("Child rendered");
  return <p>Static child</p>;
}`,
      },
      keyTakeaways: [
        "Render means React calculates UI; commit applies DOM changes.",
        "A component render does not mean every DOM node changed.",
        "Profile actual rendering behavior before optimizing.",
      ],
      commonMistakes: [
        "Thinking every render is automatically a bug.",
        "Adding memo everywhere without measuring.",
        "Confusing React renders with browser paints.",
      ],
      quiz: [
        {
          question: "What is the commit phase responsible for?",
          options: [
            "Applying necessary changes to the host environment such as the DOM",
            "Writing TypeScript types",
            "Creating database indexes",
            "Sending every API request"
          ],
          correctIndex: 0,
          explanation: "The commit phase applies the calculated changes.",
        },
      ],
    },
    {
      id: "react-day-26-lesson-3",
      title: "Chrome DevTools Performance Workflow",
      durationMinutes: 13,
      explanation: `Chrome DevTools Performance records what the browser is doing while you interact with the page. You can record an interaction such as opening a menu, typing into a search field, or scrolling a large list. The timeline can then show JavaScript tasks, rendering work, layout, paint, and other activity.

The important skill is not memorizing every DevTools panel. Instead, learn a repeatable workflow: reproduce the problem, record a short trace, find the expensive period, identify the type of work taking time, change one thing, and record again. Short traces are usually easier to understand than recordings containing an entire session.

For example, if typing into a search box causes a long JavaScript task after every keystroke, investigate the filtering or rendering work. If JavaScript is cheap but layout dominates, changing React code alone may not solve the problem.`,
      diagram: `Reproduce
   ↓
Record trace
   ↓
Find long task
   ↓
Identify JS / Layout / Paint
   ↓
Change one thing
   ↓
Record again`,
      codeExample: {
        title: "Create a realistic performance interaction",
        code: `function SearchResults({
  query,
  items,
}: {
  query: string;
  items: string[];
}) {
  const filtered = items.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <ul>
      {filtered.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

// Profile typing with a realistic number of items before optimizing.`,
      },
      keyTakeaways: [
        "Use short, reproducible performance traces.",
        "Identify whether the cost is JavaScript, layout, paint, or another browser task.",
        "Compare traces after one targeted change.",
      ],
      commonMistakes: [
        "Recording an entire application session and trying to understand everything.",
        "Optimizing before reproducing the slow interaction.",
        "Assuming a React profiler result explains all browser work.",
      ],
      quiz: [
        {
          question: "What should a useful performance trace contain?",
          options: [
            "A short reproducible interaction",
            "An entire day of browser activity",
            "Only TypeScript errors",
            "Only network requests"
          ],
          correctIndex: 0,
          explanation: "A focused trace makes the expensive work easier to identify.",
        },
      ],
    },
    {
      id: "react-day-26-lesson-4",
      title: "Avoiding Layout Shift and Expensive Visual Work",
      durationMinutes: 13,
      explanation: `A layout shift happens when visible content unexpectedly moves after the page has already been displayed. Images without reserved dimensions, late-loading banners, and content inserted above existing content can all cause movement. Besides being frustrating for users, layout movement can make pages feel unstable.

You can reduce unnecessary visual work by reserving space for media, avoiding large synchronous DOM changes, and choosing animation properties that browsers can handle efficiently. CSS transforms and opacity are often useful for animations because they can avoid repeatedly recalculating layout for surrounding elements.

For example, a card image should reserve its expected space before the image finishes loading. This prevents text below the image from jumping downward when the image appears.`,
      diagram: `Without reserved space
Image loads
   ↓
content moves ↓
layout shift

With reserved space
[image area]
   ↓
image appears
   ↓
content stays`,
      codeExample: {
        title: "Reserve image dimensions",
        code: `<img
  src="/profile.webp"
  alt="Profile"
  width={320}
  height={240}
/>`,
      },
      keyTakeaways: [
        "Reserve space for media and dynamic content.",
        "Layout changes can be more expensive than isolated visual updates.",
        "Choose animation techniques with browser rendering costs in mind.",
      ],
      commonMistakes: [
        "Adding images without dimensions.",
        "Animating width and height for every interaction.",
        "Inserting content above the user without reserving space.",
      ],
      quiz: [
        {
          question: "Why should images usually have known dimensions?",
          options: [
            "To reserve layout space and reduce unexpected movement",
            "To make TypeScript compile",
            "To prevent all network requests",
            "To disable CSS"
          ],
          correctIndex: 0,
          explanation: "Known dimensions help the browser reserve the correct space.",
        },
      ],
    },
    {
      id: "react-day-26-lesson-5",
      title: "Performance Budgets and Real-User Thinking",
      durationMinutes: 13,
      explanation: `A performance budget is a practical limit you set for things such as JavaScript size, page loading time, or interaction latency. Budgets turn performance from an occasional cleanup task into an engineering constraint. The exact budget depends on the application, users, devices, and network conditions.

Lab measurements are useful, but real users can have slower phones, slower networks, and different usage patterns. Real-user monitoring (RUM) collects performance information from actual sessions. Even without a monitoring platform, testing with CPU and network throttling can reveal problems that are invisible on a powerful development machine.

For example, a dashboard that feels instant on a developer's MacBook may still be slow on a low-end mobile device. Performance work should therefore consider the actual environment where the product is used.`,
      diagram: `Code change
   ↓
Performance budget
   ↓
Lab test + throttling
   ↓
Real-user data
   ↓
Regression check`,
      codeExample: {
        title: "A simple project budget",
        code: `const performanceBudget = {
  initialJavaScriptKb: 250,
  largestContentfulPaintMs: 2500,
  interactionResponseMs: 200,
};`,
      },
      keyTakeaways: [
        "Performance budgets create explicit constraints.",
        "Test under realistic CPU and network conditions.",
        "Real-user data can reveal problems laboratory testing misses.",
      ],
      commonMistakes: [
        "Using one budget for every application.",
        "Measuring only on a powerful development machine.",
        "Treating a budget as a one-time audit instead of a regression guard.",
      ],
      quiz: [
        {
          question: "What is a performance budget?",
          options: [
            "An agreed limit for important performance characteristics",
            "A JavaScript package manager",
            "A React component",
            "A browser cookie"
          ],
          correctIndex: 0,
          explanation: "A budget gives the team measurable performance constraints.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Which stage applies React's calculated DOM changes?",
      options: ["Commit", "Typecheck", "Bundle", "Deploy"],
      correctIndex: 0,
      explanation: "React applies necessary host changes during commit.",
    },
    {
      question: "What should you do before a performance optimization?",
      options: ["Measure the real bottleneck", "Add useMemo everywhere", "Rewrite the component", "Disable linting"],
      correctIndex: 0,
      explanation: "Measurement prevents unnecessary optimization.",
    },
    {
      question: "What does layout shift describe?",
      options: ["Unexpected movement of visible content", "A TypeScript error", "A network retry", "A component prop"],
      correctIndex: 0,
      explanation: "Layout shift occurs when visible content unexpectedly changes position.",
    },
    {
      question: "Why use throttling during performance testing?",
      options: ["To approximate slower devices or networks", "To remove React", "To disable CSS", "To make tests random"],
      correctIndex: 0,
      explanation: "Throttling can expose issues hidden by powerful development hardware.",
    },
  ],
  project: {
    name: "Browser Performance Lab",
    goal: "Diagnose and improve a deliberately slow React page using browser and React performance tools.",
    brief: "Build a dashboard with a large list, expensive filtering, images, and a visually heavy section. Record the baseline, identify bottlenecks, apply targeted changes, and compare the results.",
    steps: [
      "Create a dashboard containing at least 2,000 list items.",
      "Add a search interaction that performs noticeable filtering work.",
      "Add images without reserved dimensions to create a measurable layout problem.",
      "Record the initial interaction with Chrome DevTools Performance.",
      "Identify whether the main cost comes from JavaScript, layout, or paint.",
      "Apply one optimization at a time and record the interaction again.",
      "Add image dimensions and verify that layout movement is reduced.",
      "Write a small performance budget for the page.",
    ],
    acceptance: [
      "A baseline performance trace is recorded.",
      "At least one real bottleneck is identified from measurement.",
      "Optimizations are based on measured evidence.",
      "Images reserve layout space.",
      "A simple performance budget is documented.",
    ],
    stretch: [
      "Test with CPU and network throttling.",
      "Measure Web Vitals.",
      "Add an automated performance regression check.",
    ],
  },
};
