import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_6_LESSONS = normalizePastedLessonDay({
  "day": 6,
  "title": "Lists and Performance Basics",
  "overview": "Today we're going to talk about one of the most important things in a real React Native application: **lists**.\n\nAt first, rendering a list seems extremely simple:\n\n```\nitems.map(item => <Text>{item.name}</Text>)\n```\n\nAnd for 5 or 10 items, it usually is.\n\nBut imagine you have:\n\n```\n5,000 courses\n5,000 images\n5,000 titles\n5,000 buttons\n```\n\nNow the application has a lot more work to do.\n\nThis is where performance becomes important.\n\nYou'll learn how React Native handles large lists, why `FlatList` exists, what virtualization means, how `FlashList` improves large lists, how pagination works, and how to properly handle loading, empty, and error states.",
  "totalMinutes": 45,
  "difficulty": "Beginner",
  "lessons": [
    {
      "id": "rn6-flatlist-sectionlist",
      "title": "FlatList and SectionList",
      "durationMinutes": 7,
      "explanation": "Let's start with the simplest question:\n\n> Why can't we just use `.map()` for every list?\n\nSuppose we have:\n\n```\nconst courses = [\n { id: \"1\", name: \"React Native\" },\n { id: \"2\", name: \"JavaScript\" },\n { id: \"3\", name: \"TypeScript\" },\n];\n```\n\nYou could write:\n\n```\n{courses.map(course => (\n <Text key={course.id}>\n   {course.name}\n </Text>\n))}\n```\n\nThis is perfectly reasonable for a small amount of content.\n\nBut React Native provides components specifically designed for lists:\n\n```\nFlatList\nSectionList\n```\n\nThese components are designed to handle potentially large amounts of data more efficiently.\n\n---\n\n## What is FlatList?\n\n`FlatList` is a React Native component for displaying a list of items.\n\nFor example:\n\n```\nimport { FlatList, Text } from \"react-native\";\n\nconst courses = [\n { id: \"1\", name: \"React Native\" },\n { id: \"2\", name: \"JavaScript\" },\n { id: \"3\", name: \"TypeScript\" },\n];\n\nexport default function Courses() {\n return (\n   <FlatList\n     data={courses}\n     renderItem={({ item }) => (\n       <Text>{item.name}</Text>\n     )}\n   />\n );\n}\n```\n\nThere are two important pieces here:\n\n```\ndata={courses}\n```\n\nand:\n\n```\nrenderItem={({ item }) => (\n <Text>{item.name}</Text>\n)}\n```\n\n`data` tells the list **what items it has**.\n\n`renderItem` tells the list **how each item should look**.\n\n---\n\n## What is SectionList?\n\nSometimes your list isn't just one long list.\n\nImagine a contacts application:\n\n```\nA\n────────────\nAlice\nAndrew\nAnthony\n\nB\n────────────\nBob\nBrian\nBarbara\n\nC\n────────────\nCharlie\nChris\n```\n\nThis is a **sectioned list**.\n\nThat's where `SectionList` is useful.\n\nFor example:\n\n```\nconst sections = [\n {\n   title: \"Beginner\",\n   data: [\"JavaScript\", \"React Native\"],\n },\n {\n   title: \"Intermediate\",\n   data: [\"TypeScript\", \"Animations\"],\n },\n];\n```\n\nThen:\n\n```\n<SectionList\n sections={sections}\n renderItem={({ item }) => (\n   <Text>{item}</Text>\n )}\n renderSectionHeader={({ section }) => (\n   <Text>{section.title}</Text>\n )}\n/>\n```\n\n---\n\n## When should you use each?\n\n### FlatList\n\nUse `FlatList` when you have:\n\n```\nOne list\n↓\nMany items\n```\n\nExample:\n\n```\nCourses\n├── React Native\n├── JavaScript\n├── TypeScript\n├── Expo\n└── Git\n```\n\n### SectionList\n\nUse `SectionList` when your items belong to groups.\n\nExample:\n\n```\nCourses\n\nBeginner\n├── JavaScript\n├── React Native\n\nIntermediate\n├── TypeScript\n├── Navigation\n```\n\n---\n\n## Important FlatList props\n\nA **prop** is a value you pass to a React component to configure how it behaves.\n\nSome FlatList props are especially important.\n\n### `data`\n\nThe data being displayed.\n\n```\n<FlatList\n data={courses}\n/>\n```\n\n---\n\n### `renderItem`\n\nDefines how an individual item should be displayed.\n\n```\nrenderItem={({ item }) => (\n <Text>{item.name}</Text>\n)}\n```\n\n---\n\n### `keyExtractor`\n\nProvides a unique key for every item.\n\n```\nkeyExtractor={(item) => item.id}\n```\n\nA **unique key** is an identifier that allows React to understand which item is which.\n\nFor example:\n\n```\nCourse 1 → \"course-1\"\nCourse 2 → \"course-2\"\nCourse 3 → \"course-3\"\n```\n\n---\n\n## Why is `keyExtractor` important?\n\nImagine your list changes:\n\n```\nBefore:\n\nA\nB\nC\n```\n\nThen:\n\n```\nAfter:\n\nX\nA\nB\nC\n```\n\nReact needs to understand:\n\n> \"A, B, and C are still the same items. X is new.\"\n\nStable keys help React make that connection.\n\n---\n\n## `getItemLayout`\n\nThis one is slightly more advanced.\n\n`getItemLayout` tells the list the size and position of items without needing to measure them individually.\n\nFor example, if every item is exactly 60 pixels tall:\n\n```\ngetItemLayout={(_, index) => ({\n length: 60,\n offset: 60 * index,\n index,\n})}\n```\n\nHere:\n\n```\nlength\n```\n\nmeans item height.\n\n```\noffset\n```\n\nmeans where the item begins.\n\n```\nindex\n```\n\nmeans the item's position in the list.\n\n---\n\n## Why can this help?\n\nImagine 5,000 items.\n\nIf every item has a known fixed height, the list doesn't need to figure out the height of every item just to calculate where item 4,000 is.\n\nIt can calculate:\n\n```\nitem position = item height × index\n```\n\nFor example:\n\n```\n60 × 4000 = 240,000\n```\n\nSo it can quickly estimate where that item belongs.",
      "diagram": "FlatList\n                  │\n       ┌──────────┼──────────┐\n       ▼          ▼          ▼\n      data    renderItem  keyExtractor\n       │          │          │\n       ▼          ▼          ▼\n     Items      UI for      Identity\n                each item",
      "codeExample": {
        "title": "Code Example",
        "code": "A more complete list:\n\nimport { FlatList, Text, View } from \"react-native\";\n\nconst courses = [\n { id: \"1\", name: \"React Native\" },\n { id: \"2\", name: \"JavaScript\" },\n { id: \"3\", name: \"TypeScript\" },\n];\n\nexport default function CourseList() {\n return (\n   <FlatList\n     data={courses}\n     keyExtractor={(item) => item.id}\n     renderItem={({ item }) => (\n       <View style={{ padding: 20 }}>\n         <Text>{item.name}</Text>\n       </View>\n     )}\n   />\n );\n}"
      },
      "keyTakeaways": [
        "- `FlatList` is designed for lists.\n- `SectionList` is designed for grouped lists.\n- `data` contains the items.\n- `renderItem` describes how an item looks.\n- `keyExtractor` gives each item a stable identity.\n- `getItemLayout` can improve performance when item sizes are predictable."
      ],
      "commonMistakes": [
        "### ❌ Using array indexes as keys when items have IDs\n\nPrefer:\n\n```\nkeyExtractor={(item) => item.id}\n```\n\nrather than relying on changing positions.\n\n### ❌ Using `getItemLayout` with incorrect measurements\n\nIf your item is actually 80 pixels tall but you tell React Native it's 60, the list's calculations can become incorrect."
      ],
      "quiz": [
        {
          "question": "Which prop tells `FlatList` how to render each item?",
          "options": [
            "A. `renderItem`",
            "B. `renderList`",
            "C. `itemComponent`",
            "D. `drawItem`"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn6-list-rendering",
      "title": "Why Re-rendering a List Item Is Different From a Web `<li>`",
      "durationMinutes": 6,
      "explanation": "If you've worked with React on the web, you may have seen:\n\n```\n<ul>\n <li>React</li>\n <li>JavaScript</li>\n</ul>\n```\n\nA React Native list might look conceptually similar:\n\n```\nList\n├── Item\n├── Item\n├── Item\n└── Item\n```\n\nBut React Native is not rendering HTML elements in a browser.\n\nThere is no native HTML `<li>`.\n\nInstead, React Native has to communicate with native platform UI.\n\nThat makes performance particularly important for large lists.\n\n---\n\n## What is a re-render?\n\nA **re-render** means React runs the component again to determine what the UI should look like.\n\nImagine:\n\n```\nfunction CourseItem({ course }) {\n console.log(\"Course rendered\");\n\n return <Text>{course.name}</Text>;\n}\n```\n\nIf the component renders again, that function runs again.\n\nFor one item, that's not a big deal.\n\nBut imagine:\n\n```\n5,000 items\n```\n\nIf many of those items unnecessarily render again, the work can become expensive.\n\n---\n\n## A common beginner mistake\n\nImagine:\n\n```\n<FlatList\n data={courses}\n renderItem={({ item }) => (\n   <CourseItem course={item} />\n )}\n/>\n```\n\nThen some unrelated state changes:\n\n```\nsetSelectedTab(\"favorites\");\n```\n\nIf the list's props or item components aren't structured carefully, React may need to do more work than necessary.\n\nThe goal isn't:\n\n> \"Never re-render.\"\n\nThe goal is:\n\n> \"Don't make expensive unnecessary work happen repeatedly.\"\n\n---\n\n## Why list items are special\n\nA list might contain:\n\n```\nCourseItem\nCourseItem\nCourseItem\nCourseItem\n...\n```\n\nIf each item contains:\n\n```\nImage\nTitle\nDescription\nButton\nProgress bar\nIcon\nAnimation\n```\n\nthen each item isn't necessarily cheap.\n\nOne unnecessary update can become thousands of unnecessary updates.\n\n---\n\n## React.memo\n\nOne useful tool is `React.memo`.\n\n**Memoization** means remembering a previous result so that work can sometimes be skipped when the inputs haven't changed.\n\nFor example:\n\n```\nimport { memo } from \"react\";\n\nconst CourseItem = memo(function CourseItem({\n course,\n}) {\n return (\n   <Text>\n     {course.name}\n   </Text>\n );\n});\n```\n\nIf the component receives the same props, React can avoid some unnecessary rendering work.\n\nBut `memo` is not magic.\n\nIf you create new objects or functions unnecessarily, the props can still appear to have changed.\n\n---\n\n## Example\n\nThis can create a new object:\n\n```\n<CourseItem\n style={{\n   color: \"blue\",\n }}\n/>\n```\n\nEvery time the parent renders, that object may be created again.\n\nFor beginners, the important lesson is simply:\n\n> Pay attention to what causes list items to render again.\n\nDon't immediately add `memo` everywhere.\n\nFirst understand where the actual work is happening.",
      "diagram": "Parent changes\n     │\n     ▼\nList component\n     │\n     ├── Item 1\n     ├── Item 2\n     ├── Item 3\n     ├── Item 4\n     └── ...\n            │\n            ▼\n     Potential extra work\n\nWith careful component design:\n\nParent changes\n     │\n     ▼\nList\n     │\n     ├── Item 1 → unchanged\n     ├── Item 2 → unchanged\n     ├── Item 3 → changed\n     └── Item 4 → unchanged\n\nThe goal is to limit unnecessary work.",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- React Native doesn't render HTML `<li>` elements.\n- A list item is still a React component.\n- Re-rendering can become expensive when there are many items.\n- Large list items containing images and complex UI need extra care.\n- `React.memo` can sometimes prevent unnecessary rendering.\n- Don't optimize everything blindly; measure first."
      ],
      "commonMistakes": [
        "### ❌ Thinking every re-render is bad\n\nRe-renders are a normal part of React.\n\nThe problem is **unnecessary expensive work**.\n\n### ❌ Assuming `memo` fixes everything\n\nIf the props keep changing, memoization may not help."
      ],
      "quiz": [
        {
          "question": "Why can unnecessary list-item re-renders become a problem?",
          "options": [
            "A. Because one item can become thousands of repeated pieces of work",
            "B. Because React doesn't support lists",
            "C. Because text cannot be rendered",
            "D. Because FlatList removes JavaScript"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn6-flashlist",
      "title": "FlashList — A Better Default for Large Lists",
      "durationMinutes": 6,
      "explanation": "React Native's `FlatList` is useful and should absolutely be understood.\n\nBut when you're dealing with a large list, there is another option:\n\n**FlashList**, created by Shopify.\n\nThe idea is simple:\n\n> If your application needs to display a lot of items, use a list implementation designed to keep scrolling smooth.\n\nFor this learning track, we'll use **FlashList as the default when the list contains more than a screenful of items**.\n\nA **screenful** means roughly the number of items that can be visible on the device screen at one time.\n\nFor example:\n\n```\nPhone screen\n\n┌──────────────────┐\n│ Course 1         │\n│ Course 2         │\n│ Course 3         │\n│ Course 4         │\n│ Course 5         │\n│ Course 6         │\n└──────────────────┘\n```\n\nIf your data has:\n\n```\n6 items\n```\n\nyou may not need to think much about advanced list optimization.\n\nBut if you have:\n\n```\n5,000 items\n```\n\nthe choice of list implementation matters much more.\n\n---\n\n## Why FlashList?\n\nFlashList focuses on efficient rendering of large lists.\n\nInstead of treating every item as something that needs to stay mounted (actively existing in the UI) all the time, it uses virtualization and recycling techniques to reduce unnecessary work.\n\n---\n\n## Example\n\nA FlashList might look conceptually like:\n\n```\nimport { FlashList } from \"@shopify/flash-list\";\n\n<FlashList\n data={courses}\n renderItem={({ item }) => (\n   <CourseItem course={item} />\n )}\n keyExtractor={(item) => item.id}\n/>\n```\n\nThe exact API can change between library versions, so when you build a real project, check the version-specific FlashList documentation.\n\n---\n\n## FlatList vs FlashList\n\nThink about them this way:\n\n| Situation | Approach |\n| --- | --- |\n| Tiny list | Simple rendering can be enough |\n| Normal list | `FlatList` |\n| Large list | `FlashList` |\n| Very large list + images | Carefully optimized `FlashList` |\n\nThe important thing isn't:\n\n> \"FlashList is always faster.\"\n\nPerformance depends on your data, item complexity, images, device, and how the components are written.\n\nThe important lesson is:\n\n> Large lists should use a list component designed for large-list rendering.",
      "diagram": "Small data\n  │\n  ▼\nSimple list\n\nLarge data\n  │\n  ▼\nVirtualized list\n  │\n  ▼\nFlashList\n  │\n  ▼\nOnly necessary UI work",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- FlashList is a list library from Shopify.\n- It is designed for efficient large-list rendering.\n- This track uses FlashList for lists larger than a screenful.\n- FlashList doesn't automatically fix badly optimized item components.\n- Your item design still matters."
      ],
      "commonMistakes": [
        "### ❌ Thinking FlashList makes every list fast automatically\n\nIf every item contains:\n\n```\n10 huge images\ncomplex animations\nexpensive calculations\n```\n\nthe list can still perform poorly.\n\nFlashList is a tool, not magic."
      ],
      "quiz": [
        {
          "question": "For this learning track, when should you generally reach for FlashList?",
          "options": [
            "A. Any list with more than a screenful of items",
            "B. Only lists containing exactly 10 items",
            "C. Only lists containing text",
            "D. Never"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn6-virtualization",
      "title": "Virtualization — What Is Actually Mounted?",
      "durationMinutes": 6,
      "explanation": "This is one of the most important concepts in today's lesson.\n\nImagine you have:\n\n```\n5,000 items\n```\n\nbut your phone can only display:\n\n```\n8 items\n```\n\nat a time.\n\nDo you really need all 5,000 UI components actively existing at once?\n\nNo.\n\nThat would waste memory and processing power.\n\nThis is why list virtualization exists.\n\n---\n\n## What is virtualization?\n\n**Virtualization** means the list only keeps the items that are necessary for the current area of the screen actively rendered, rather than rendering every item at once.\n\nImagine:\n\n```\n5,000 items\n```\n\nbut the user currently sees:\n\n```\nItems 100–108\n```\n\nThe list can focus its resources around those items and nearby items.\n\n---\n\n## Mounted vs measured\n\nThese two ideas can be confusing.\n\n### Mounted\n\nA component is **mounted** when React has created it as part of the active UI tree.\n\nThink:\n\n> \"This component currently exists in the rendered application.\"\n\n### Measured\n\nThe list may know or estimate where an item belongs and how large it is.\n\nThink:\n\n> \"I know where this item would be.\"\n\nThese are not necessarily the same thing.\n\nA list doesn't need to keep every item mounted just because it knows that item exists.\n\n---\n\n## Example\n\nImagine:\n\n```\nItems 1 → 5000\n```\n\nThe user is currently viewing:\n\n```\n100 → 108\n```\n\nA virtualized list might actively render something around:\n\n```\n95 → 115\n```\n\nThe exact behavior depends on the list implementation and configuration.\n\nThe rest don't need to be fully mounted at the same time.\n\n---\n\n## Why does this matter?\n\nWithout virtualization:\n\n```\n5,000 items\n↓\n5,000 components\n↓\n5,000 images\n↓\nHuge amount of work\n```\n\nWith virtualization:\n\n```\n5,000 data records\n       ↓\nOnly a smaller visible window\n       ↓\nFewer active components\n       ↓\nLess work\n```",
      "diagram": "5,000 items\n──────────────────────────────────\n\n[     data exists in memory     ]\n\n         ↓ scrolling\n\n      ┌───────────────┐\n      │  Visible      │\n      │  items        │\n      │  100 - 108    │\n      └───────────────┘\n\nOnly part of the list\nneeds to be actively rendered.\n\n---\n\n## What happens while scrolling?\n\nAs the user scrolls:\n\n100–108\n  ↓\n110–118\n  ↓\n120–128\n\nThe list adjusts which items are actively rendered.\n\nThis is one of the reasons virtualization is so important for large lists.",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Virtualization prevents every list item from being actively rendered at once.\n- Mounted means the component currently exists in the UI tree.\n- A list can know about items without mounting all of them.\n- Virtualization reduces memory and rendering work.\n- This is a major reason list components perform better than a giant `.map()`."
      ],
      "commonMistakes": [
        "### ❌ Thinking virtualization deletes your data\n\nYour data can still contain:\n\n```\n5,000 items\n```\n\nVirtualization controls how much of the UI is actively rendered.\n\n### ❌ Thinking only visible items are ever rendered\n\nLists commonly render some additional nearby items to make scrolling smoother."
      ],
      "quiz": [
        {
          "question": "What is virtualization?",
          "options": [
            "A. Rendering every item at once",
            "B. Keeping only the necessary portion of a large list actively rendered",
            "C. Deleting old data",
            "D. Compressing images"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn6-pagination",
      "title": "Infinite Scroll, `onEndReached`, and Pull-to-Refresh",
      "durationMinutes": 6,
      "explanation": "Imagine your backend has:\n\n```\n100,000 courses\n```\n\nShould your application download all 100,000 at once?\n\nUsually, no.\n\nInstead, you can load data in smaller groups.\n\nFor example:\n\n```\nFirst request → 20 courses\nSecond request → 20 courses\nThird request → 20 courses\n```\n\nThis is called **pagination**.\n\n**Pagination** means dividing a large amount of data into smaller pages or batches.\n\n---\n\n## Basic pagination\n\nImagine:\n\n```\nPage 1\nCourses 1–20\n```\n\nThe user scrolls.\n\nThen:\n\n```\nPage 2\nCourses 21–40\n```\n\nThen:\n\n```\nPage 3\nCourses 41–60\n```\n\n---\n\n## Infinite scroll\n\n**Infinite scroll** means the application automatically loads more data as the user approaches the bottom of the list.\n\nFor example:\n\n```\nCourses 1–20\n     ↓\nUser scrolls\n     ↓\nLoad 21–40\n     ↓\nUser scrolls\n     ↓\nLoad 41–60\n```\n\nIt feels like the list keeps growing.\n\n---\n\n## `onEndReached`\n\nReact Native list components provide `onEndReached`.\n\nConceptually:\n\n```\n<FlatList\n data={courses}\n onEndReached={loadMore}\n/>\n```\n\nWhen the user gets close enough to the end, `loadMore` can run.\n\n---\n\n## Important: prevent duplicate requests\n\nA common beginner mistake is:\n\n```\nonEndReached={loadMore}\n```\n\nand then allowing `loadMore()` to run repeatedly.\n\nYou should track whether a request is already happening.\n\nFor example:\n\n```\nif (loadingMore) {\n return;\n}\n\nloadMore();\n```\n\nYou may also need to track whether there is actually more data.\n\nFor example:\n\n```\nif (!hasMore) {\n return;\n}\n```\n\n---\n\n## A safer mental model\n\nBefore loading more:\n\n```\nAre we already loading?\n       │\n       ├── Yes → Stop\n       │\n       └── No\n            ↓\n       Is there more?\n            │\n            ├── No → Stop\n            │\n            └── Yes\n                 ↓\n             Load more\n```\n\n---\n\n## Pull-to-refresh\n\nInfinite scroll loads **more** data.\n\nPull-to-refresh reloads the **current list**.\n\nThe user pulls downward:\n\n```\n↓\n↓ Pull\n↓\nRefresh\n```\n\nYou can use:\n\n```\n<FlatList\n refreshing={refreshing}\n onRefresh={refresh}\n/>\n```\n\nConceptually:\n\n```\nCurrent data\n    │\n    ▼\nUser pulls down\n    │\n    ▼\nRefresh request\n    │\n    ▼\nLatest data\n```\n\n---\n\n## Infinite scroll + refresh together\n\nA real application might support both:\n\n```\n                Course List\n                    │\n         ┌──────────┴──────────┐\n         ▼                     ▼\n   Pull to refresh        Scroll downward\n         │                     │\n         ▼                     ▼\n    Reload page 1          Load next page\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": "Conceptually:\n\n<FlashList\n data={courses}\n renderItem={({ item }) => (\n   <CourseItem course={item} />\n )}\n onEndReached={loadMore}\n refreshing={refreshing}\n onRefresh={refresh}\n/>\n\nYour state might include:\n\nconst [loadingMore, setLoadingMore] = useState(false);\nconst [refreshing, setRefreshing] = useState(false);\nconst [hasMore, setHasMore] = useState(true);"
      },
      "keyTakeaways": [
        "- Pagination breaks large data into smaller requests.\n- Infinite scroll loads the next page near the bottom.\n- `onEndReached` can trigger loading more data.\n- Prevent duplicate pagination requests.\n- Pull-to-refresh reloads current data.\n- Infinite scroll and pull-to-refresh solve different problems."
      ],
      "commonMistakes": [
        "### ❌ Calling the API every time without checking state\n\nYou can accidentally create:\n\n```\nRequest 1\nRequest 2\nRequest 3\nRequest 4\n...\n```\n\nfor the same page.\n\nAlways track loading state.\n\n### ❌ Forgetting `hasMore`\n\nOnce you've reached the end of the backend data, don't keep requesting more."
      ],
      "quiz": [
        {
          "question": "What is pagination?",
          "options": [
            "A. Dividing a large dataset into smaller pages",
            "B. Changing the font",
            "C. Rendering an image",
            "D. Changing navigation tabs"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn6-list-states",
      "title": "Empty, Loading, and Error States",
      "durationMinutes": 4,
      "explanation": "A list doesn't only have one state.\n\nBeginners often build this:\n\n```\nData exists → Show list\n```\n\nBut real applications have several states.\n\nFor example:\n\n```\nLoading\nEmpty\nSuccess\nError\nLoading more\nRefreshing\n```\n\nThese should be treated as real parts of your UI.\n\n---\n\n## Loading state\n\nWhen the application is requesting data:\n\n```\n┌──────────────────────┐\n│ Courses              │\n│                      │\n│      Loading...      │\n│                      │\n└──────────────────────┘\n```\n\nYou don't want the user staring at a completely blank screen.\n\n---\n\n## Empty state\n\nThe request succeeded, but there are no items.\n\n```\n┌──────────────────────┐\n│ Courses              │\n│                      │\n│   No courses yet.    │\n│                      │\n│   Explore courses →  │\n└──────────────────────┘\n```\n\nThis is different from an error.\n\nThe application worked.\n\nThere simply isn't anything to display.\n\n---\n\n## Error state\n\nThe request failed.\n\n```\n┌──────────────────────┐\n│ Courses              │\n│                      │\n│ Couldn't load data.  │\n│                      │\n│      Try again       │\n└──────────────────────┘\n```\n\nThe user should know what happened and what they can do next.\n\n---\n\n## Success state\n\nNow there is actual data:\n\n```\n┌──────────────────────┐\n│ Courses              │\n├──────────────────────┤\n│ React Native         │\n│ JavaScript           │\n│ TypeScript           │\n└──────────────────────┘\n```\n\n---\n\n## Think of the list as a state machine\n\nA **state machine** is a way of thinking about an interface as moving between clearly defined states.\n\nFor a list:\n\n```\n            ┌───────────┐\n            │  Loading  │\n            └─────┬─────┘\n                  │\n         ┌────────┴────────┐\n         ▼                 ▼\n     ┌───────┐         ┌────────┐\n     │ Empty │         │ Success│\n     └───────┘         └────────┘\n         ▲                 │\n         │                 │\n         └──── Error ◄─────┘\n```\n\nThe exact transitions depend on your application.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": "You might write:\n\nif (loading) {\n return <LoadingState />;\n}\n\nif (error) {\n return <ErrorState onRetry={loadCourses} />;\n}\n\nif (courses.length === 0) {\n return <EmptyState />;\n}\n\nreturn (\n <FlashList\n   data={courses}\n   renderItem={({ item }) => (\n     <CourseItem course={item} />\n   )}\n />\n);\n\nThis is simple, but it teaches a very important habit:\n\n> Build the different states intentionally."
      },
      "keyTakeaways": [
        "Every important list should consider:\n\n- Loading\n- Empty\n- Success\n- Error\n- Refreshing\n- Loading more\n\nDon't treat these as afterthoughts."
      ],
      "commonMistakes": [
        "### ❌ Empty and error are the same\n\nThey're not.\n\n```\nEmpty = request worked, zero results\nError = request failed\n```\n\n### ❌ Showing a spinner forever\n\nIf something fails, give the user an error state and a way to retry."
      ],
      "quiz": [
        {
          "question": "If the API succeeds but returns zero items, which state should you show?",
          "options": [
            "A. Error",
            "B. Empty",
            "C. Loading forever",
            "D. Crash"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn6-fast-row",
      "title": "Building a Fast List Item",
      "durationMinutes": 3,
      "explanation": "Choosing FlashList is only part of performance.\n\nYour individual list item matters too.\n\nImagine every item contains:\n\n```\n┌─────────────────────────────┐\n│ 🖼️ Huge image               │\n│                             │\n│ React Native                │\n│ Learn navigation...         │\n│                             │\n│ ⭐ ⭐ ⭐ ⭐ ⭐               │\n│                             │\n│ [Watch] [Save] [Share]      │\n└─────────────────────────────┘\n```\n\nNow imagine 5,000 of these.\n\nThat's a lot of UI.\n\n---\n\n## Keep list items focused\n\nInstead of putting everything into the list screen:\n\n```\nfunction CourseList() {\n // 500 lines of logic\n}\n```\n\ncreate a dedicated item:\n\n```\nfunction CourseItem({ course }) {\n return (\n   <View>\n     <Image source={{ uri: course.image }} />\n     <Text>{course.name}</Text>\n   </View>\n );\n}\n```\n\nThen:\n\n```\n<FlashList\n data={courses}\n renderItem={({ item }) => (\n   <CourseItem course={item} />\n )}\n/>\n```\n\nThis makes the code easier to reason about and optimize.\n\n---\n\n## Images are especially important\n\nImages can be expensive because they may require:\n\n```\nDownload\n↓\nDecode\n↓\nResize\n↓\nDisplay\n```\n\nIf every list item contains a large image, scrolling can become much harder.\n\nFor a production application, use appropriately sized images and a good image-loading strategy.\n\n---\n\n## Don't do expensive calculations during rendering\n\nAvoid doing heavy work directly inside:\n\n```\nrenderItem\n```\n\nFor example, be careful with expensive calculations that run for every item.\n\nInstead, prepare your data before rendering when appropriate.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- List item design matters.\n- Keep item components reasonably small.\n- Images can have a major performance impact.\n- Avoid unnecessary expensive calculations during rendering.\n- A fast list needs both a good list implementation and efficient item components."
      ],
      "commonMistakes": [],
      "quiz": [
        {
          "question": "Which part can still make a FlashList slow?",
          "options": [
            "A. Very expensive list items",
            "B. The word `FlashList`",
            "C. Having an `id`",
            "D. Using TypeScript"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn6-measurement",
      "title": "Performance Thinking: Measure Instead of Guessing",
      "durationMinutes": 6,
      "explanation": "The final lesson is about how developers actually think about performance.\n\nYou may hear:\n\n> \"This should be faster.\"\n\nBut that's a guess.\n\nGood performance work asks:\n\n> \"What is actually happening?\"\n\nThis is called **profiling**.\n\n**Profiling** means measuring an application's performance to find where time, memory, or processing power is being used.\n\n---\n\n## What should you measure?\n\nFor lists, you can pay attention to:\n\n```\nScrolling smoothness\nFrame rate\nMemory usage\nImage loading\nCPU usage\nNumber of renders\n```\n\n---\n\n## What does 60 FPS mean?\n\nYou will often hear:\n\n> \"The application should stay around 60 FPS.\"\n\n**FPS** means **frames per second**.\n\nAt 60 FPS:\n\n```\n60 frames\nper second\n```\n\nThe screen gets a new frame roughly every:\n\n```\n16.7 milliseconds\n```\n\nSo if your application takes much longer to produce a frame, the user may see:\n\n```\nstutter\njank\ndropped frames\n```\n\n**Jank** means visible stuttering or uneven movement during an animation or scroll.\n\n---\n\n## Why scrolling is a good performance test\n\nScrolling is continuous.\n\nThe application has to repeatedly update the screen:\n\n```\nFrame\n↓\nFrame\n↓\nFrame\n↓\nFrame\n↓\nFrame\n```\n\nIf your list does too much work, you may see:\n\n```\nSmooth\n████████████████████\n\nSlow\n███   ██    ███   ██\n```\n\n---\n\n## Don't test only on a powerful computer\n\nA developer's computer can be much faster than a user's phone.\n\nPerformance should be tested on realistic devices.\n\nA list that feels fine on your development machine may struggle on a lower-powered phone.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Don't guess about performance.\n- Measure it.\n- FPS means frames per second.\n- Around 60 FPS is a common smooth-scrolling target.\n- Test on realistic devices.\n- Look at the whole system: list, items, images, data, and JavaScript work."
      ],
      "commonMistakes": [],
      "quiz": []
    }
  ],
  "finalQuiz": [],
  "project": {
    "name": "Render 5,000 items",
    "goal": "Now it's time to test what you've learned.",
    "brief": "Create:\n\n```\n5,000 items\n```\n\nEach item should contain:\n\n```\nImage\nTitle\nDescription\n```\n\nFor example:\n\n```\n┌───────────────────────────┐\n│ 🖼️                        │\n│                           │\n│ React Native              │\n│ Learn mobile development  │\n└───────────────────────────┘\n```",
    "steps": [
      "Part 1 — Use FlashList\n\nCreate a list containing 5,000 items.\n\nConceptually:\n\n```\n<FlashList\n data={items}\n keyExtractor={(item) => item.id}\n renderItem={({ item }) => (\n   <CourseItem course={item} />\n )}\n/>\n```\n\nScroll quickly from:\n\n```\nItem 1\n```\n\nto:\n\n```\nItem 5000\n```\n\nWatch for:\n\n- stuttering\n- delayed images\n- blank areas\n- dropped frames\n- unusually high memory usage",
      "Part 2 — Try the `.map()` Version\n\nNow deliberately build the inefficient version.\n\nFor example:\n\n```\n<ScrollView>\n {items.map((item) => (\n   <CourseItem\n     key={item.id}\n     course={item}\n   />\n ))}\n</ScrollView>\n```\n\nYou have now asked React Native to create a huge amount of UI at once.\n\n---\n\n## What happens?\n\nConceptually:\n\n```\n5,000 items\n    │\n    ▼\n5,000 components\n    │\n    ├── Images\n    ├── Text\n    ├── Views\n    └── Other UI\n```\n\nCompare that with a virtualized list:\n\n```\n5,000 data items\n      │\n      ▼\nVirtualized list\n      │\n      ▼\nOnly necessary UI\n      │\n      ▼\nLess active rendering work\n```",
      "Part 3 — Compare the Results\n\nCreate a simple comparison.\n\n| Test | `.map()` + `ScrollView` | FlashList |\n| --- | --- | --- |\n| 5,000 items | Large amount of UI created | Virtualized |\n| Initial rendering | Can become expensive | Designed for large lists |\n| Memory pressure | Can be high | Generally reduced through virtualization |\n| Scrolling | Can become less smooth | Designed for efficient scrolling |\n| Large datasets | Poor fit | Better fit |\n| Learning goal | Understand what breaks | Learn the appropriate tool |\n\nThe exact performance difference will depend on your device, images, item complexity, and library version.\n\nThe goal isn't to fake a benchmark.\n\nThe goal is to **observe and measure the difference yourself**."
    ],
    "acceptance": [],
    "footer": "🧠 Day 6 Mental Model\n\nIf you remember only one thing from today, remember this:\n\n```\n             LARGE DATA\n                  │\n                  ▼\n             Don't render\n             everything\n                  │\n                  ▼\n            Virtualization\n                  │\n         ┌────────┴────────┐\n         ▼                 ▼\n     FlatList          FlashList\n         │                 │\n         └────────┬────────┘\n                  ▼\n             Efficient UI\n                  │\n       ┌──────────┼──────────┐\n       ▼          ▼          ▼\n    Loading     Empty       Error\n       │          │          │\n       └──────────┼──────────┘\n                  ▼\n             User experience\n```\n\nThe big lesson is:\n\n> **A list is not just a collection of items. It's a performance problem when the amount of data becomes large.**\n\nFor small data, `.map()` can be perfectly fine.\n\nFor large data, use a proper virtualized list.\n\nFor this track, when the list is larger than a screenful, reach for **FlashList**.\n\nThen pay attention to the things around it:\n\n```\nFlashList\n  +\nEfficient item component\n  +\nGood image handling\n  +\nPagination\n  +\nProper loading/empty/error states\n  =\nBetter list experience\n```\n\nThat is the foundation of list performance in React Native."
  }
});
