import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_6_LESSONS = normalizePastedLessonDay({
  day: 6,
  title: "Lists and performance basics",
  totalMinutes: 45,
  difficulty: "Beginner",
  lessons: [
    {
      id: "rn6-flatlist-sectionlist",
      title: "FlatList and SectionList",
      durationMinutes: 9,
      explanation: `<b>FlatList</b> is React Native's standard component for rendering long one-dimensional lists. It supports virtualization (rendering only the items needed around the visible area).

<code>SectionList</code> builds on the same idea for grouped data.

Important FlatList props include <code>keyExtractor</code> for stable item identity, <code>renderItem</code> for rendering an item, and <code>getItemLayout</code> when item dimensions can be calculated without measuring each row.`,
      diagram: `Large data set
     |
     v
   FlatList
     |
     +--> visible items
     +--> nearby items
     |
     v
virtualized native views

SectionList:
sections -> headers + items -> virtualization`,
      codeExample: `import { FlatList, Text } from "react-native";

const users = [
  { id: "1", name: "Rajan" },
  { id: "2", name: "Mina" },
];

export function UserList() {
  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Text>{item.name}</Text>
      )}
    />
  );
}`,
      keyTakeaways: [
        "FlatList is designed for scrollable collections.",
        "Stable keys help React track item identity.",
        "SectionList is useful for grouped lists.",
        "getItemLayout can avoid measurement work for fixed-size rows.",
      ],
      commonMistakes: [
        "Rendering thousands of rows with a simple map inside ScrollView.",
        "Using array indexes as keys when stable IDs exist.",
      ],
      quiz: [
        {
          question: "Which prop provides a stable key for each FlatList item?",
          options: ["keyExtractor", "onEndReached"],
          answer: "keyExtractor",
        },
      ],
    },
    {
      id: "rn6-list-rendering",
      title: "Why list item rendering differs from web <li>",
      durationMinutes: 5,
      explanation: `A browser's <code>&lt;li&gt;</code> participates in the browser DOM and layout engine. React Native list items are native-backed views managed through React Native's rendering architecture.

This matters because mobile memory, layout, measurement, and native view creation have different costs. A list that seems acceptable in a browser can become expensive on a phone when it creates too many native views or performs too much JavaScript work.`,
      diagram: `Web
React -> DOM -> browser layout/paint

React Native
React -> reconciler -> native rendering
                    |
                    +--> native views/layout

Therefore:
large lists need mobile-aware virtualization`,
      codeExample: `// Avoid for large data sets:
<ScrollView>
  {items.map((item) => (
    <Row key={item.id} item={item} />
  ))}
</ScrollView>

// Prefer a virtualized list:
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <Row item={item} />}
/>`,
      keyTakeaways: [
        "React Native list rendering has native-view and mobile-memory costs.",
        "Virtualization prevents the entire data set from becoming mounted UI.",
        "The same list strategy should not be copied blindly from the web.",
      ],
      commonMistakes: [
        "Assuming mobile list performance behaves exactly like browser DOM performance.",
      ],
      quiz: [
        {
          question: "Why can large ScrollView + map lists become expensive?",
          options: ["They can create too many mounted views", "They disable JavaScript"],
          answer: "They can create too many mounted views",
        },
      ],
    },
    {
      id: "rn6-flashlist",
      title: "FlashList and the track default",
      durationMinutes: 5,
      explanation: `<b>FlashList</b> from Shopify is a high-performance list implementation designed to improve list rendering efficiency.

For this track, FlashList is the default choice when a list contains more than roughly a screenful of content. The important lesson is not to use a third-party list blindly: understand the workload, measure performance, and choose the list implementation that fits the application.`,
      diagram: `Small/simple list
       |
       v
    FlatList

More than a screenful
       |
       v
   FlashList
       |
       v
virtualized high-performance rendering`,
      codeExample: `import { FlashList } from "@shopify/flash-list";

export function ProductList({ products }) {
  return (
    <FlashList
      data={products}
      estimatedItemSize={72}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProductRow product={item} />
      )}
    />
  );
}`,
      keyTakeaways: [
        "FlashList is the default high-volume list choice in this track.",
        "estimatedItemSize gives the list useful sizing information.",
        "Measure real workloads rather than assuming a list is fast.",
      ],
      commonMistakes: [
        "Using FlashList without following its version-specific API requirements.",
        "Assuming a different list implementation automatically fixes expensive row components.",
      ],
      quiz: [
        {
          question: "What is the track default for lists containing more than a screenful?",
          options: ["FlashList", "ScrollView + map"],
          answer: "FlashList",
        },
      ],
    },
    {
      id: "rn6-virtualization",
      title: "Virtualization: mounted vs measured",
      durationMinutes: 5,
      explanation: `<b>Virtualization</b> means the list avoids keeping every item fully mounted at once. Instead, it maintains a window around the visible content and reuses or creates views as needed.

<b>Mounted</b> means the item currently exists in the rendered component/view tree. <b>Measured</b> refers to knowing an item's layout dimensions and position. These are related but not identical concerns.`,
      diagram: `5,000 items
   |
   v
virtualized window
   |
   +-- mounted nearby items
   +-- measured/layout information
   +-- unmounted far-away items`,
      codeExample: `// Conceptual list window
Visible:
[ 120 ][ 121 ][ 122 ][ 123 ][ 124 ]

Nearby:
[ 118 ] ... [ 126 ]

Far away:
[ 0 ... 117 ] -> not fully mounted`,
      keyTakeaways: [
        "Virtualization limits how much UI is active at once.",
        "Mounted and measured are different concepts.",
        "Efficient lists manage both rendering and layout information.",
      ],
      commonMistakes: [
        "Thinking virtualization means the list only knows about visible data.",
        "Confusing item measurement with component mounting.",
      ],
      quiz: [
        {
          question: "What is virtualization mainly trying to limit?",
          options: ["The amount of active rendered UI", "The number of API endpoints"],
          answer: "The amount of active rendered UI",
        },
      ],
    },
    {
      id: "rn6-pagination",
      title: "Infinite scrolling and pull-to-refresh",
      durationMinutes: 7,
      explanation: `<code>onEndReached</code> can trigger loading another page when the user approaches the end of a list.

A production pagination flow needs guards against duplicate requests, loading indicators, errors, and stale responses. <b>Pull-to-refresh</b> is different: it normally resets or refreshes the first page rather than appending another page.`,
      diagram: `Page 1
  |
  v
user scrolls
  |
  v
near end
  |
  +--> onEndReached
          |
          v
       fetch page 2
          |
          v
       append items

Pull to refresh
  |
  v
fetch latest page 1
  |
  v
replace/reset list`,
      codeExample: `const [page, setPage] = useState(1);
const [loadingMore, setLoadingMore] = useState(false);

async function loadMore() {
  if (loadingMore) return;

  setLoadingMore(true);
  try {
    const next = page + 1;
    const result = await fetchPage(next);
    setItems((current) => [...current, ...result.items]);
    setPage(next);
  } finally {
    setLoadingMore(false);
  }
}

<FlatList
  data={items}
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
/>`,
      keyTakeaways: [
        "onEndReached is a trigger, not a complete pagination architecture.",
        "Guard against duplicate page requests.",
        "Refresh and pagination have different state transitions.",
      ],
      commonMistakes: [
        "Appending the same page multiple times.",
        "Ignoring errors during load-more requests.",
        "Using pull-to-refresh as if it were just another pagination request.",
      ],
      quiz: [
        {
          question: "What should happen on pull-to-refresh in a typical paginated list?",
          options: ["Refresh the newest first page", "Always append page 99"],
          answer: "Refresh the newest first page",
        },
      ],
    },
    {
      id: "rn6-list-states",
      title: "Loading, empty, error, and content states",
      durationMinutes: 5,
      explanation: `A production list has more than one visual state. Treat <b>loading</b>, <b>empty</b>, <b>error</b>, and <b>content</b> as first-class states.

This makes list behavior predictable and prevents awkward UI such as a spinner that never disappears, an empty screen that looks broken, or an error that leaves stale loading indicators visible.`,
      diagram: `List state machine

idle/loading
     |
     v
fetch
  / | \
 /  |  \
v   v   v
error empty content
 |      |
retry   refresh/load more`,
      codeExample: `if (loading && items.length === 0) {
  return <LoadingState />;
}

if (error && items.length === 0) {
  return <ErrorState onRetry={reload} />;
}

if (!loading && items.length === 0) {
  return <EmptyState />;
}

return <ProductList items={items} />;`,
      keyTakeaways: [
        "Loading, empty, error, and content are distinct states.",
        "An error during pagination may coexist with already-loaded content.",
        "Good state modeling improves both UX and debugging.",
      ],
      commonMistakes: [
        "Showing an error screen even when useful cached items are already visible.",
        "Treating empty data and loading data as the same state.",
      ],
      quiz: [
        {
          question: "Is an empty list the same state as a loading list?",
          options: ["Yes", "No"],
          answer: "No",
        },
      ],
    },
    {
      id: "rn6-performance",
      title: "List performance: prove it, don't guess",
      durationMinutes: 4,
      explanation: `List performance should be measured. A useful test is to render a large data set containing realistic row complexity, including images, and observe scrolling behavior.

A simple <code>ScrollView</code> with <code>map()</code> can mount thousands of items at once. A virtualized list keeps the active rendering window much smaller. The goal is smooth scrolling under realistic device conditions, not merely a good result in a simulator.`,
      diagram: `5,000 rows
   |
   +--> ScrollView + map
   |       |
   |       +--> thousands mounted
   |
   +--> FlashList
           |
           +--> virtualized window
           |
           v
       measure + profile`,
      codeExample: `// Benchmark both approaches with the same data.
// Test on a physical device when possible.

// Look for:
// - dropped frames
// - JS thread work
// - image decode cost
// - excessive re-renders
// - memory growth`,
      keyTakeaways: [
        "Performance claims should be measured.",
        "Physical devices can expose issues that simulators hide.",
        "Optimize the row component as well as the list implementation.",
      ],
      commonMistakes: [
        "Calling a list fast without profiling it.",
        "Testing only a tiny data set.",
        "Ignoring image and row-rendering costs.",
      ],
      quiz: [
        {
          question: "What should you do before claiming a list stays at 60fps?",
          options: ["Measure it with a realistic workload", "Assume virtualization guarantees it"],
          answer: "Measure it with a realistic workload",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Which component is designed for virtualized one-dimensional lists?",
      options: ["FlatList", "View"],
      answer: "FlatList",
    },
    {
      question: "Which prop provides stable item keys?",
      options: ["keyExtractor", "refreshing"],
      answer: "keyExtractor",
    },
    {
      question: "What is virtualization?",
      options: ["Limiting active rendered items to a useful window", "Encrypting list data"],
      answer: "Limiting active rendered items to a useful window",
    },
    {
      question: "What is onEndReached commonly used for?",
      options: ["Loading another page", "Changing the app theme"],
      answer: "Loading another page",
    },
    {
      question: "Should list performance be measured with realistic data?",
      options: ["Yes", "No"],
      answer: "Yes",
    },
  ],
  project: {
    name: "5,000-item product list benchmark",
    goal: "Build and profile a realistic large list, then compare virtualized rendering with a plain ScrollView implementation.",
    brief: "Create 5,000 product records with images and realistic row content. Implement one version with ScrollView + map and another with FlashList. Add loading, empty, error, pagination, and pull-to-refresh states.",
    steps: [
      "Generate or load 5,000 stable product records.",
      "Create a reusable ProductRow component with an image and multiple text fields.",
      "Implement the baseline using ScrollView + map.",
      "Implement the optimized version using FlashList.",
      "Add keyExtractor and estimated item size.",
      "Add paginated loading with onEndReached.",
      "Add pull-to-refresh.",
      "Add loading, empty, error, and content states.",
      "Profile scrolling and rendering on a physical device if possible.",
    ],
    acceptance: [
      "The application can render 5,000 records.",
      "Each item has a stable key.",
      "FlashList is used for the optimized implementation.",
      "Pagination does not duplicate pages.",
      "Pull-to-refresh refreshes the first page.",
      "Loading, empty, and error states are visibly distinct.",
      "The project documents what was measured and what differed between implementations.",
    ],
    stretch: [
      "Add image caching and compare image-related performance.",
      "Memoize an expensive row and measure whether it changes performance.",
      "Use getItemLayout where row height is genuinely fixed and compare the result.",
      "Capture a short performance profile showing the difference between the two implementations.",
    ],
  },
});
