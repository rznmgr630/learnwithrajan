import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_22_LESSONS: LessonDay = {
  day: 22,
  title: "React Performance and Optimization",
  totalMinutes: 60,
  difficulty: "Beginner",
  lessons: [
    {
      id: "react-day-22-lesson-1",
      title: "Measure React Performance",
      durationMinutes: 12,
      explanation: `Performance work should begin with measurement rather than guesses. React DevTools Profiler can show which components rendered and how long rendering took. Browser Performance tools can reveal scripting, layout, painting, network, and long tasks. First identify a real bottleneck, then make one targeted change and measure again.`,
      diagram: `User action
  ↓
Profile
  ↓
Find expensive work
  ↓
Optimize one thing
  ↓
Profile again`,
      codeExample: {
        title: "Profile before optimizing",
        code: `function ProductList({ products }: { products: Product[] }) {
  return products.map(product => (
    <ProductRow key={product.id} product={product} />
  ));
}

// Profile the interaction before deciding to optimize it.`,
      },
      keyTakeaways: ["Measure before optimizing.", "Profile the interaction that feels slow.", "Compare before and after measurements."],
      commonMistakes: ["Adding memoization everywhere.", "Optimizing code that is not a bottleneck.", "Using a single benchmark for every performance question."],
      quiz: [
        {
          question: "What should you do before optimizing a React component?",
          options: ["Measure/profile it", "Add memo to everything", "Rewrite the app", "Remove TypeScript"],
          correctIndex: 0,
          explanation: "Measurement helps identify actual bottlenecks.",
        },
      ],
    },
    {
      id: "react-day-22-lesson-2",
      title: "Memoization",
      durationMinutes: 12,
      explanation: `Memoization can avoid repeated work when its inputs have not changed. React.memo can skip a component render when props are equal. useMemo can cache an expensive calculation, while useCallback can preserve a function reference. These tools are useful when profiling shows a real benefit.`,
      diagram: `Parent render
   ↓
props unchanged?
 ┌─yes→ memoized child can skip
 └─no → child renders`,
      codeExample: {
        title: "Memoizing an expensive calculation",
        code: `import { useMemo } from "react";

const visibleProducts = useMemo(
  () => products.filter(product => product.price >= minimumPrice),
  [products, minimumPrice]
);`,
      },
      keyTakeaways: ["memo can skip unnecessary child renders.", "useMemo caches calculated values.", "useCallback preserves function references.", "Dependencies must describe values used by the calculation."],
      commonMistakes: ["Memoizing every component by default.", "Using incorrect dependency arrays.", "Assuming useMemo makes network requests faster."],
      quiz: [
        {
          question: "What does useMemo return?",
          options: ["A memoized calculation result", "A DOM node", "A server response", "A CSS class"],
          correctIndex: 0,
          explanation: "useMemo caches the result of a calculation.",
        },
      ],
    },
    {
      id: "react-day-22-lesson-3",
      title: "Large Lists and Virtualization",
      durationMinutes: 12,
      explanation: `Rendering thousands of DOM nodes can be expensive. Virtualization renders only the rows currently visible, plus a small buffer. As the user scrolls, the rendered window changes. Libraries can handle measurement, scrolling, variable row heights, and accessibility details.`,
      diagram: `10,000 rows
   ↓ virtualization
viewport
[101][102][103][104][105]
only visible rows in DOM`,
      codeExample: {
        title: "Virtualized-list concept",
        code: `// Conceptual API; use a virtualization library for production lists.
function Row({ index }: { index: number }) {
  return <div>{items[index].name}</div>;
}

// The virtualization library decides which Row components are mounted.`,
      },
      keyTakeaways: ["Virtualization reduces mounted DOM nodes.", "It matters most for genuinely large lists.", "Production virtualization often needs a specialized library."],
      commonMistakes: ["Virtualizing tiny lists unnecessarily.", "Using unstable keys for reorderable data.", "Ignoring keyboard navigation and accessibility."],
      quiz: [
        {
          question: "What does virtualization reduce?",
          options: ["The number of DOM rows rendered at once", "The number of database tables", "TypeScript types", "HTTP methods"],
          correctIndex: 0,
          explanation: "Virtualization keeps only a visible window mounted.",
        },
      ],
    },
    {
      id: "react-day-22-lesson-4",
      title: "Code Splitting and Lazy Loading",
      durationMinutes: 12,
      explanation: `Code splitting divides JavaScript into smaller chunks that can be loaded when needed. React.lazy can defer loading a component until it is rendered, and Suspense provides the loading fallback. This is useful for large routes or features that most users do not need immediately.`,
      diagram: `Initial bundle
├── Home
├── common code
└── later chunk → Reports
                 ↓
             loaded on demand`,
      codeExample: {
        title: "Lazy-loading a feature",
        code: `import { lazy, Suspense } from "react";

const Reports = lazy(() => import("./Reports"));

function App() {
  return (
    <Suspense fallback={<p>Loading reports…</p>}>
      <Reports />
    </Suspense>
  );
}`,
      },
      keyTakeaways: ["Code splitting reduces initial JavaScript.", "React.lazy loads a component dynamically.", "Suspense provides fallback UI while the chunk loads."],
      commonMistakes: ["Lazy-loading every tiny component.", "Forgetting a Suspense boundary.", "Assuming code splitting automatically improves every page."],
      quiz: [
        {
          question: "What does React.lazy help with?",
          options: ["Loading a component dynamically", "Caching database rows", "Validating forms", "Handling CSS"],
          correctIndex: 0,
          explanation: "React.lazy uses dynamic import to load a component when needed.",
        },
      ],
    },
    {
      id: "react-day-22-lesson-5",
      title: "Web Vitals",
      durationMinutes: 12,
      explanation: `Web performance also needs user-centered metrics. LCP (Largest Contentful Paint) measures when the main visible content becomes available. INP (Interaction to Next Paint) measures interaction responsiveness. CLS (Cumulative Layout Shift) measures unexpected visual movement. These metrics connect technical changes to user experience.`,
      diagram: `Page load → LCP
User interaction → INP
Unexpected movement → CLS`,
      codeExample: {
        title: "Reserve image space",
        code: `<img
  src="/hero.webp"
  alt="Dashboard preview"
  width={1200}
  height={700}
/>`,
      },
      keyTakeaways: ["LCP relates to loading.", "INP relates to interaction responsiveness.", "CLS relates to unexpected layout movement.", "Reserve space for media to reduce layout shift."],
      commonMistakes: ["Treating one metric as the entire performance story.", "Ignoring real-user measurements.", "Loading huge images without appropriate sizing."],
      quiz: [
        {
          question: "Which metric focuses on interaction responsiveness?",
          options: ["LCP", "INP", "CLS", "HTML"],
          correctIndex: 1,
          explanation: "INP measures interaction responsiveness.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is the first step in performance optimization?",
      options: ["Measure", "Memoize everything", "Rewrite", "Remove dependencies"],
      correctIndex: 0,
      explanation: "Measurement identifies real bottlenecks.",
    },
    {
      question: "What can useMemo cache?",
      options: ["A calculation result", "A browser tab", "A database connection", "A route"],
      correctIndex: 0,
      explanation: "useMemo caches a calculated value.",
    },
    {
      question: "Why use virtualization?",
      options: ["To reduce simultaneously rendered rows", "To remove React", "To replace CSS", "To encrypt data"],
      correctIndex: 0,
      explanation: "Virtualization keeps a smaller DOM window.",
    },
    {
      question: "What does code splitting do?",
      options: ["Splits JavaScript into loadable chunks", "Splits database tables", "Splits CSS selectors", "Splits HTTP headers"],
      correctIndex: 0,
      explanation: "Code splitting lets code load when needed.",
    },
  ],
  project: {
    name: "Performance Lab",
    goal: "Measure and improve a deliberately slow React dashboard.",
    brief: "Build a dashboard with a large list, an expensive calculation, a lazy Reports feature, and images. Use profiling and targeted optimization rather than adding performance APIs blindly.",
    steps: [
      "Render thousands of rows in a test dataset.",
      "Profile a slow list interaction with React DevTools.",
      "Virtualize the large list.",
      "Profile an expensive calculation and optimize it only if measurement justifies it.",
      "Use memoization where it prevents a demonstrated unnecessary render.",
      "Lazy-load the Reports feature with Suspense.",
      "Give images dimensions so the layout reserves space.",
      "Record a before-and-after observation for each meaningful optimization.",
    ],
    acceptance: [
      "The large list uses virtualization.",
      "Memoization choices have a measured reason.",
      "Reports loads on demand.",
      "Images reserve layout space.",
      "Before-and-after performance observations are recorded.",
    ],
    stretch: [
      "Analyze the production bundle.",
      "Measure Web Vitals.",
      "Add a lightweight performance regression check.",
    ],
  },
};
