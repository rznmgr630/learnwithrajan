import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_5_LESSONS = normalizePastedLessonDay({
  "day": 5,
  "title": "Navigation",
  "overview": "Navigation is what allows a user to move around your application.\n\nWhen you tap Home, Courses, Settings, or a course and arrive at its detail page, you're navigating between routes (different destinations/screens in your application).\n\nToday we'll start with the mental model first, then gradually build toward nested navigation, typed parameters, modals, deep links, and persisted navigation state.",
  "totalMinutes": 45,
  "difficulty": "Beginner",
  "lessons": [
    {
      "id": "rn5-expo-router",
      "title": "Expo Router and File-Based Routing",
      "durationMinutes": 7,
      "explanation": "Let's imagine your learning application has these screens:\n\nHome\nCourses\nCourse Details\nSettings\nProfile\n\nA beginner might initially think:\n\n\"I need to manually tell React Native which screen should open when I click something.\"\n\nThat's partly true with traditional navigation systems.\n\nBut with Expo Router, the structure of your files helps define your application's routes.\n\nThis is called file-based routing.\n\nFile-based routing means that your files and folders determine the URLs/routes of your application.\n\nInstead of creating one huge navigation configuration, you organize your application like this:\n\napp/\n├── index.tsx\n├── courses.tsx\n├── settings.tsx\n└── profile.tsx\n\nThe router uses this structure to understand your routes.\n\nFor example:\n\napp/index.tsx\n\ncan represent:\n\n/\n\nAnd:\n\napp/courses.tsx\n\ncan represent:\n\n/courses\n\nAnd:\n\napp/settings.tsx\n\ncan represent:\n\n/settings\n\nThat's the basic idea.\n\nWhy is this useful?\n\nImagine an application with 50 screens.\n\nWithout a clear structure, it can become difficult to answer:\n\n\"Where is the code for the Settings screen?\"\n\nWith file-based routing, you can look at your app directory.\n\napp/\n├── index.tsx\n├── courses.tsx\n├── settings.tsx\n└── profile.tsx\n\nYou immediately have a visual representation of your routes.\n\nYour folder structure becomes part of your navigation structure.\n\nDynamic routes\n\nNow suppose you have many courses.\n\nYou don't want to create:\n\ncourse-1.tsx\ncourse-2.tsx\ncourse-3.tsx\ncourse-4.tsx\n\nThat wouldn't scale.\n\nInstead, you can use a dynamic route.\n\nFor example:\n\napp/\n└── courses/\n├── index.tsx\n└── [id].tsx\n\nThe [id].tsx file means:\n\n\"This route contains a dynamic value called id.\"\n\nSo you could have:\n\n/courses/101\n/courses/102\n/courses/103\n\nAll of those can use:\n\n[id].tsx\n\nThe id changes.",
      "diagram": "app/\n│\n┌──────────┼───────────┐\n│ │ │\n▼ ▼ ▼\nindex.tsx courses.tsx settings.tsx\n│ │ │\n▼ ▼ ▼\n/ /courses /settings\n\nFor dynamic routes:\n\napp/\n└── courses/\n├── index.tsx\n└── [id].tsx\n│\n├── /courses/101\n├── /courses/102\n└── /courses/103",
      "codeExample": {
        "title": "Code Example",
        "code": "A simple route structure:\n\napp/\n├── _layout.tsx\n├── index.tsx\n├── courses.tsx\n└── settings.tsx\n\nindex.tsx:\n\nimport { View, Text } from \"react-native\";\n\nexport default function HomeScreen() {\nreturn (\n<View>\n<Text>Home</Text>\n</View>\n);\n}\n\ncourses.tsx:\n\nimport { View, Text } from \"react-native\";\n\nexport default function CoursesScreen() {\nreturn (\n<View>\n<Text>Courses</Text>\n</View>\n);\n}\n\nThen you can navigate using Expo Router's Link:\n\nimport { Link } from \"expo-router\";\n\n<Link href=\"/courses\"> Courses </Link>",
        "details": "The important idea is:\n\nFile\n↓\nRoute\n↓\nScreen"
      },
      "keyTakeaways": [
        "Expo Router uses file-based routing.\n\nFiles and folders help define your routes.\n\nindex.tsx commonly represents the route for its directory.\n\n[id].tsx represents a dynamic route parameter.\n\nYour folder structure becomes an important part of your navigation architecture."
      ],
      "commonMistakes": [
        "❌ Thinking [id].tsx means the route is literally /id\n\nIt means id is dynamic.\n\nFor example:\n\ncourses/[id]\n\ncan represent:\n\ncourses/1\ncourses/2\ncourses/42\n\n❌ Putting everything into one screen\n\nDon't create one enormous file containing every possible screen.\n\nA good route structure makes your application easier to understand."
      ],
      "quiz": [
        {
          "question": "What routing model does Expo Router use?",
          "options": [
            "A. Database-based routing",
            "B. File-based routing",
            "C. CSS-based routing",
            "D. Server-only routing"
          ],
          "correctIndex": 1,
          "explanation": "Answer: B"
        }
      ]
    },
    {
      "id": "rn5-react-navigation",
      "title": "React Navigation Underneath Expo Router",
      "durationMinutes": 5,
      "explanation": "You might hear two names while learning React Native navigation:\n\nExpo Router\n\nReact Navigation\n\nA beginner may wonder:\n\n\"Which one am I supposed to use?\"\n\nThe important relationship is that Expo Router is built on top of React Navigation.\n\nThink about it like this:\n\nYour Application\n│\n▼\nExpo Router\n│\n▼\nReact Navigation\n│\n▼\nNative Platform\n\nExpo Router gives you a file-based routing experience.\n\nReact Navigation provides the underlying navigation system.\n\nWhat does React Navigation do?\n\nReact Navigation provides navigators and navigation primitives (the basic building blocks used to move between screens).\n\nFor example:\n\nStack navigation\n\nTab navigation\n\nDrawer navigation\n\nExpo Router gives you a file-system-oriented way of defining these structures.\n\nWhy should a beginner care?\n\nYou don't need to learn every React Navigation API before using Expo Router.\n\nBut understanding the relationship helps when you encounter documentation or errors.\n\nFor example, you might see something like:\n\nStack\nTabs\nDrawer\nnavigation\nroute\nparams\n\nThese concepts still matter because Expo Router uses the navigation system underneath.",
      "diagram": "Expo Router\n│\nFile-based routing\n│\n▼\nReact Navigation\n│\n┌───────────┼───────────┐\n▼ ▼ ▼\nStack Tabs Drawer\n│ │ │\n└───────────┼───────────┘\n▼\nNative screens",
      "codeExample": {
        "title": "Code Example",
        "code": "With Expo Router, you might define a stack in _layout.tsx:\n\nimport { Stack } from \"expo-router\";\n\nexport default function Layout() {\nreturn (\n<Stack>\n<Stack.Screen\nname=\"index\"\noptions={{\ntitle: \"Home\",\n}}\n/>\n\n <Stack.Screen\n   name=\"details\"\n   options={{\n     title: \"Details\",\n   }}\n />\n</Stack>\n\n);\n}",
        "details": "Notice that you're importing:\n\nimport { Stack } from \"expo-router\";\n\nExpo Router provides the interface you're working with, while React Navigation provides the underlying navigation machinery."
      },
      "keyTakeaways": [
        "Expo Router is built on React Navigation.\n\nExpo Router focuses heavily on file-based routing.\n\nReact Navigation provides the underlying navigation concepts.\n\nLearning both concepts will make you much more comfortable with React Native navigation."
      ],
      "commonMistakes": [
        "Don't think:\n\n\"Expo Router and React Navigation are completely unrelated libraries.\"\n\nThey are closely connected."
      ],
      "quiz": [
        {
          "question": "What library is underneath Expo Router?",
          "options": [
            "A. Express",
            "B. React Navigation",
            "C. Redux",
            "D. Next.js"
          ],
          "correctIndex": 1,
          "explanation": "Answer: B"
        }
      ]
    },
    {
      "id": "rn5-navigators",
      "title": "Stack, Tabs, Drawers, and Nesting",
      "durationMinutes": 7,
      "explanation": "Now we're going to learn the four navigation ideas you'll use constantly.\n\nStack navigation\n\nImagine your user does this:\n\nHome\n↓\nCourse\n↓\nLesson\n↓\nQuiz\n\nEach screen is placed on top of the previous one.\n\nThis is a stack.\n\nThink about a stack of books.\n\n┌─────────┐\n│ Quiz │ ← top\n├─────────┤\n│ Lesson │\n├─────────┤\n│ Course │\n├─────────┤\n│ Home │ ← bottom\n└─────────┘\n\nWhen the user presses Back, the top screen is removed.\n\nQuiz\n↓\nLesson\n↓\nCourse\n\nThat's why stack navigation is perfect for hierarchical screen history.\n\nTabs\n\nTabs are useful when you have major areas of an application.\n\nFor example:\n\n┌────────────────────────────┐\n│ │\n│ Screen Content │\n│ │\n├────────────────────────────┤\n│ Home │ Courses │ Settings │\n└────────────────────────────┘\n\nThe user can switch between major sections.\n\nDrawer\n\nA drawer is a panel that slides in from the side.\n\nFor example:\n\n┌──────────────────────┐\n│ Menu │\n│ │\n│ Home │\n│ Courses │\n│ Profile │\n│ Settings │\n│ │\n└──────────────────────┘\n\nDrawers are useful when you have many destinations that don't need to permanently occupy the bottom navigation area.\n\nNesting\n\nHere's where navigation becomes more powerful.\n\nYou can put a stack inside a tab.\n\nFor example:\n\nTabs\n│\n├── Home\n│\n├── Courses\n│ │\n│ └── Stack\n│ ├── Course List\n│ ├── Course Details\n│ └── Lesson\n│\n└── Settings\n\nThis is called nested navigation.\n\nThe Courses tab has its own navigation history.",
      "diagram": "App\n│\nTabs\n│\n┌─────────┼─────────┐\n▼ ▼ ▼\nHome Courses Settings\n│\n▼\nStack\n│\n┌─────────┼─────────┐\n▼ ▼ ▼\nList Detail Lesson\n\nThis is an extremely common application architecture.",
      "codeExample": {
        "title": "Code Example",
        "code": "A possible Expo Router structure:\n\napp/\n├── _layout.tsx\n├── (tabs)/\n│ ├── _layout.tsx\n│ ├── index.tsx\n│ ├── courses/\n│ │ ├── index.tsx\n│ │ └── [id].tsx\n│ └── settings.tsx\n\nThe (tabs) folder is a route group (a folder used to organize routes without necessarily becoming part of the URL).\n\nYou can then create tabs in its layout:\n\nimport { Tabs } from \"expo-router\";\n\nexport default function TabLayout() {\nreturn (\n<Tabs>\n<Tabs.Screen\nname=\"index\"\noptions={{\ntitle: \"Home\",\n}}\n/>\n\n <Tabs.Screen\n   name=\"courses\"\n   options={{\n     title: \"Courses\",\n   }}\n />\n\n <Tabs.Screen\n   name=\"settings\"\n   options={{\n     title: \"Settings\",\n   }}\n />\n</Tabs>\n\n);\n}",
        "details": ""
      },
      "keyTakeaways": [
        "Stack = hierarchical screen history.\n\nTabs = major sections of an application.\n\nDrawer = side navigation menu.\n\nNesting = putting one navigator inside another.\n\nA tab can contain its own stack."
      ],
      "commonMistakes": [
        "Don't put every screen directly into tabs.\n\nFor example, if your app has:\n\nHome\nCourses\nCourse Details\nLesson\nQuiz\nSettings\n\nyou probably don't want six permanent tabs.\n\nInstead:\n\nTabs\n├── Home\n├── Courses\n│ └── Stack\n│ ├── Details\n│ ├── Lesson\n│ └── Quiz\n└── Settings"
      ],
      "quiz": [
        {
          "question": "Which navigator models hierarchical screen history?",
          "options": [
            "A. Tabs",
            "B. Stack",
            "C. Drawer",
            "D. Modal"
          ],
          "correctIndex": 1,
          "explanation": "Answer: B"
        }
      ]
    },
    {
      "id": "rn5-typed-routes",
      "title": "Typed Routes and Safe Parameters",
      "durationMinutes": 6,
      "explanation": "Let's say the user taps a course.\n\nYou need to tell the details screen:\n\n\"Show me course 42.\"\n\nOne way to represent this is with a route parameter:\n\n/courses/42\n\nHere:\n\n42\n\nis a parameter.\n\nA route parameter is a value included in a route that identifies which piece of data or destination should be displayed.\n\nFor example:\n\n/courses/101\n/courses/102\n/courses/103\n\nThe screen is the same.\n\nThe id changes.\n\nWhy type the parameter?\n\nJavaScript allows a lot of flexibility.\n\nThat can sometimes cause bugs.\n\nYou might expect:\n\nid = \"42\"\n\nbut accidentally receive:\n\nid = undefined\n\nor use the wrong parameter name.\n\nType safety means using TypeScript to describe what values your code expects.\n\nThis lets your editor and TypeScript catch many mistakes before you run the application.",
      "diagram": "User taps Course\n│\n▼\n/courses/42\n│\n▼\nDynamic route\n│\n▼\n[id].tsx\n│\n▼\nid = \"42\"\n│\n▼\nLoad course 42",
      "codeExample": {
        "title": "Code Example",
        "code": "Route:\n\napp/\n└── courses/\n└── [id].tsx\n\nThen:\n\nimport { useLocalSearchParams } from \"expo-router\";\nimport { Text } from \"react-native\";\n\nexport default function CourseDetails() {\nconst { id } = useLocalSearchParams<{\nid: string;\n}>();\n\nreturn (\n<Text>\nCourse ID: {id}\n</Text>\n);\n}",
        "details": "The type:\n\n{\nid: string;\n}\n\ntells TypeScript:\n\n\"I expect this route to contain an id, and I expect it to be a string.\"\n\nNavigation\n\nYou can navigate to:\n\n<Link href=\"/courses/42\"> Open Course </Link> Or use router navigation:\n\nrouter.push(\"/courses/42\");\n\nFor typed routes, Expo Router can integrate with TypeScript so that invalid routes and parameters can be caught earlier."
      },
      "keyTakeaways": [
        "Route parameters carry information through navigation.\n\nDynamic routes can use [id].\n\nTypeScript can describe expected route parameters.\n\nTyped routes reduce navigation-related mistakes.\n\nParameters should still be validated before using them to load data."
      ],
      "commonMistakes": [
        "Don't assume that because TypeScript says:\n\nid: string\n\nthe value is automatically a valid course ID.\n\nType safety doesn't mean data validation.\n\nYou may still receive:\n\n\"banana\"\n\nwhich is a string but probably isn't a valid course ID.\n\nValidation means checking whether a value is actually acceptable."
      ],
      "quiz": [
        {
          "question": "If your route is:\n\ncourses/[id]\n\nwhat does [id] represent?",
          "options": [
            "A. A fixed screen name",
            "B. A dynamic route parameter",
            "C. A CSS class",
            "D. A database table"
          ],
          "correctIndex": 1,
          "explanation": "Answer: B"
        }
      ]
    },
    {
      "id": "rn5-route-modals",
      "title": "Route-Based Modals vs Modal Components",
      "durationMinutes": 5,
      "explanation": "A modal is a temporary interface that appears above the current content.\n\nFor example:\n\n┌─────────────────────────┐\n│ │\n│ Course Details │\n│ │\n│ ┌─────────────────┐ │\n│ │ Edit Course │ │\n│ │ │ │\n│ │ Name: ________ │ │\n│ │ │ │\n│ │ Cancel Save │ │\n│ └─────────────────┘ │\n│ │\n└─────────────────────────┘\n\nThere are two important concepts.\n\nModal component\n\nYou can use React Native's Modal component.\n\nIt's a UI component.\n\nYou control whether it is visible:\n\n<Modal visible={isVisible}> ... </Modal> Route-based modal\n\nWith Expo Router, you can also make the modal a navigation destination.\n\nFor example:\n\napp/\n├── index.tsx\n└── edit.tsx\n\nYou configure edit to present as a modal.\n\nNow navigation can move to:\n\n/edit\n\nThe modal becomes part of navigation history.\n\nThis is useful when the modal represents a meaningful destination that you may want to open through navigation or a deep link.",
      "diagram": "Modal Component\n\nScreen\n│\n└── Modal\n│\n└── controlled by state\n\n        Route Modal\n\nNavigation\n│\n▼\n/edit\n│\n▼\nModal presentation",
      "codeExample": {
        "title": "Code Example",
        "code": "Conceptually, your stack can configure a screen as a modal:\n\n<Stack.Screen\nname=\"edit\"\noptions={{\npresentation: \"modal\",\n}}\n/>",
        "details": "Then navigate:\n\nrouter.push(\"/edit\");\n\nNow the edit screen is represented as a navigation destination."
      },
      "keyTakeaways": [
        "A modal is an interface displayed above another screen.\n\nReact Native provides a Modal component.\n\nExpo Router can represent a modal as a route.\n\nRoute-based modals are useful when the modal is part of navigation."
      ],
      "commonMistakes": [
        "Don't use a route modal simply because it looks like a modal.\n\nAsk:\n\n\"Does this interface make sense as a navigation destination?\"\n\nIf yes, a route-based modal may be appropriate."
      ],
      "quiz": [
        {
          "question": "Which approach represents a modal as a navigation destination?",
          "options": [
            "A. Route-based modal",
            "B. CSS animation",
            "C. StyleSheet",
            "D. Text component"
          ],
          "correctIndex": 0,
          "explanation": "Answer: A"
        }
      ]
    },
    {
      "id": "rn5-deep-linking",
      "title": "Deep Linking and Universal Links",
      "durationMinutes": 7,
      "explanation": "This is one of the most useful navigation concepts.\n\nImagine someone sends you:\n\nmyapp://courses/42/lesson/5\n\nWhen you tap it, you want your application to open directly to that lesson.\n\nThat's deep linking.\n\nA deep link is a link that takes a user directly to a specific location inside an application rather than simply opening the application's home screen.\n\nWithout deep linking:\n\nLink\n↓\nApp\n↓\nHome\n↓\nCourses\n↓\nCourse\n↓\nLesson\n\nWith deep linking:\n\nLink\n↓\nApp\n↓\nLesson\n\nThat's much more convenient.\n\nWhat is a URL scheme?\n\nA URL scheme identifies the type of link.\n\nFor example:\n\nmyapp://courses/42\n\nHere:\n\nmyapp://\n\nis a custom scheme.\n\nWhat are universal links?\n\nOn Apple platforms, Universal Links allow regular HTTPS links to open the corresponding app when it's installed.\n\nFor example:\n\nhttps://example.com/courses/42\n\nThe same link can work on the web and potentially open the application.\n\nAndroid has a similar concept called App Links.\n\nWhy is this important?\n\nDeep links are useful for:\n\nnotifications\n\nemails\n\nmarketing links\n\nshared content\n\nsearch results\n\ninvitation links\n\nFor example:\n\nNotification\n│\n▼\n\"Your lesson is ready!\"\n│\n▼\nDeep link\n│\n▼\nCourse → Lesson",
      "diagram": "External Link\n│\n▼\nDeep Link\n│\n▼\nExpo Router\n│\n▼\nRoute\n│\n▼\nSpecific Screen",
      "codeExample": {
        "title": "Code Example",
        "code": "Suppose your route structure is:\n\napp/\n└── courses/\n└── [courseId]/\n└── lessons/\n└── [lessonId].tsx\n\nA deep link could conceptually point to:\n\nmyapp://courses/42/lessons/5\n\nThe router can use the URL to determine:\n\ncourseId = 42\nlessonId = 5\n\nThen the application can open the corresponding screen.",
        "details": "Cold launch vs running application\n\nYou need to test both situations.\n\nCold launch\n\nThe application isn't running.\n\nLink\n↓\nStart application\n↓\nProcess link\n↓\nOpen destination\n\nAlready running\n\nThe application is already open.\n\nApplication running\n↓\nLink\n↓\nReceive link\n↓\nNavigate\n\nBoth cases matter."
      },
      "keyTakeaways": [
        "Deep linking opens a specific location inside an application.\n\nCustom URL schemes can be used for app links.\n\nUniversal Links use regular HTTPS links on supported platforms.\n\nDeep links are useful for notifications and shared content.\n\nTest both cold launches and already-running applications."
      ],
      "commonMistakes": [
        "A common mistake is testing only:\n\nApp already running\n\nYour application might work there but fail when the operating system has to launch it from scratch.\n\nAlways test both."
      ],
      "quiz": [
        {
          "question": "A deep link is:",
          "options": [
            "A. A link that opens only the home screen",
            "B. A link that opens a specific destination inside an app",
            "C. A CSS property",
            "D. A database query"
          ],
          "correctIndex": 1,
          "explanation": "Answer: B"
        }
      ]
    },
    {
      "id": "rn5-state-persistence",
      "title": "Navigation State Persistence",
      "durationMinutes": 5,
      "explanation": "Imagine a user is here:\n\nCourses\n↓\nReact Native\n↓\nStyling\n↓\nLesson 5\n\nThen they close the application.\n\nWhen they reopen it, what should happen?\n\nShould they return to:\n\nHome\n\nor:\n\nLesson 5\n\nIf you want to restore their previous navigation position, you need navigation state persistence.\n\nNavigation state is information describing where the user currently is in the navigation system.\n\nFor example:\n\nCurrent tab: Courses\n\nStack:\nCourses\nReact Native\nStyling\nLesson 5\n\nYou can persist this information.\n\nPersistence means saving information so that it remains available after the application closes.",
      "diagram": "Navigation State\n│\n▼\nSerialize\n(convert to storable data)\n│\n▼\nPersistent Storage\n│\n│ app closes\n▼\nApp starts\n│\n▼\nRead saved state\n│\n▼\nValidate state\n│\n▼\nRestore navigation\n\nWhy validation matters\n\nThis is extremely important.\n\nImagine you saved:\n\n/current-old-screen\n\nThen you release a new version of your application.\n\nThat screen no longer exists.\n\nIf you blindly restore the old state, your application could break.\n\nTherefore:\n\nNever assume persisted navigation state is still valid.\n\nYou should verify that it matches the current application's available routes and expected data.",
      "codeExample": {
        "title": "Code Example",
        "code": "The exact persistence implementation depends on your architecture and storage solution, but conceptually:\n\nconst savedState = await loadNavigationState();\n\nif (savedState && isValidNavigationState(savedState)) {\nrestoreNavigationState(savedState);\n} else {\nstartFromDefaultRoute();\n}",
        "details": "The important idea is:\n\nLoad\n↓\nValidate\n↓\nRestore\n\nnot:\n\nLoad\n↓\nTrust blindly"
      },
      "keyTakeaways": [
        "Navigation state describes where the user is.\n\nPersistence allows state to survive app restarts.\n\nSaved navigation state can become outdated.\n\nAlways validate persisted state before restoring it."
      ],
      "commonMistakes": [
        "❌ Blindly restoring old navigation state\n\nA new application version may have different routes.\n\n❌ Assuming persisted data can never become invalid\n\nRoutes, permissions, user accounts, and content can all change."
      ],
      "quiz": [
        {
          "question": "When restoring persisted navigation state, what should you verify?",
          "options": [
            "A. The screen color",
            "B. That the stored state is still valid for the current application",
            "C. The font size",
            "D. The device wallpaper"
          ],
          "correctIndex": 1,
          "explanation": "Answer: B"
        }
      ]
    },
    {
      "id": "rn5-headers",
      "title": "Headers and Platform-Specific Behavior",
      "durationMinutes": 3,
      "explanation": "A navigation header is the area at the top of many screens.\n\nFor example:\n\n┌──────────────────────────┐\n│ ← Course Details │\n├──────────────────────────┤\n│ │\n│ Content │\n│ │\n└──────────────────────────┘\n\nThe header might contain:\n\nback button\n\ntitle\n\naction buttons\n\nicons\n\nYou can configure headers through your navigator.\n\nPlatform-specific behavior\n\niOS and Android don't always behave exactly the same.\n\nFor example:\n\niOS\n← Course Details\n\nAndroid\n← Course Details\n\nmay look similar, but system navigation, gestures, status bars, fonts, spacing, and transition behavior can differ.\n\nPlatform-specific behavior means behavior that changes depending on whether the application is running on iOS or Android.\n\nReact Native gives you tools for handling these differences.",
      "diagram": "Header\n│\n┌────────┴────────┐\n▼ ▼\niOS Android\n│ │\n▼ ▼\nDifferent platform-specific\nbehavior",
      "codeExample": {
        "title": "Code Example",
        "code": "With Expo Router:\n\n<Stack.Screen\noptions={{\ntitle: \"Course Details\",\n}}\n/>",
        "details": "You can also configure platform-specific options when necessary.\n\nFor example, you might decide that an Android-specific behavior should be different from the iOS version.\n\nThe important principle is:\n\nDon't assume that one visual or interaction behavior will automatically be identical on every platform."
      },
      "keyTakeaways": [
        "Navigation headers provide common screen controls.\n\nHeaders can be configured through navigator options.\n\niOS and Android have platform-specific behavior.\n\nTest important navigation interactions on both platforms."
      ],
      "commonMistakes": [
        "Don't try to force every platform to behave exactly the same.\n\nYour goal is usually:\n\nConsistent experience, platform-appropriate behavior."
      ],
      "quiz": [
        {
          "question": "What is a navigation header commonly used for?",
          "options": [
            "A. Database storage",
            "B. Screen title and navigation actions",
            "C. Font loading",
            "D. Image compression"
          ],
          "correctIndex": 1,
          "explanation": "Answer: B"
        }
      ]
    }
  ],
  "finalQuiz": [
    {
      "question": "What routing model does Expo Router use?",
      "options": [
        "A. File-based routing",
        "B. Database-based routing"
      ],
      "correctIndex": 0,
      "explanation": "Answer: A"
    },
    {
      "question": "What library is underneath Expo Router?",
      "options": [
        "A. React Navigation",
        "B. Express"
      ],
      "correctIndex": 0,
      "explanation": "Answer: A"
    },
    {
      "question": "Which navigator models hierarchical screen history?",
      "options": [
        "A. Stack",
        "B. Tab"
      ],
      "correctIndex": 0,
      "explanation": "Answer: A"
    },
    {
      "question": "What should be validated when restoring persisted navigation state?",
      "options": [
        "A. The stored state is still valid for the current app",
        "B. Only the screen color"
      ],
      "correctIndex": 0,
      "explanation": "Answer: A"
    }
  ],
  "project": {
    "name": "Deep-Linkable Tab Application",
    "goal": "Now let's put everything together.",
    "brief": "You're going to build a small application that combines:\n\nTabs\n\nNested stacks\n\nDynamic routes\n\nTyped parameters\n\nRoute-based modals\n\nDeep links\n\nNavigation state\n\nPlatform-specific configuration\n\nThe goal isn't simply to make screens.\n\nThe goal is to make the navigation architecture work.\n\nProject Goal\n\nBuild an application like this:\n\n```\n                    App\n                     │\n                   Tabs\n                     │\n     ┌───────────────┼───────────────┐\n     ▼               ▼               ▼\n   Home            Courses         Settings\n                     │\n                     ▼\n                   Stack\n                     │\n             ┌───────┼────────┐\n             ▼       ▼        ▼\n           List    Detail   Sub-detail\n                     │\n                     ▼\n                  Edit Modal\n```",
    "steps": [
      "Step 1 — Create the Root Navigation Structure\n\nStart with tabs.\n\nYour application might look like:\n\napp/\n├── _layout.tsx\n├── (tabs)/\n│ ├── _layout.tsx\n│ ├── index.tsx\n│ ├── courses/\n│ │ ├── index.tsx\n│ │ └── [id].tsx\n│ └── settings.tsx\n\nThe (tabs) directory groups your tab routes.",
      "Step 2 — Give Courses Its Own Stack\n\nYour Courses area should have its own navigation history.\n\nCourses\n│\n▼\nCourse List\n│\n▼\nCourse Details\n│\n▼\nLesson Details\n\nThis means the user can navigate:\n\nCourses\n↓\nReact Native\n↓\nStyling\n\nand then use Back to move backward through that history.",
      "Step 3 — Add the List Screen\n\nCreate:\n\ncourses/index.tsx\n\nDisplay a list of courses:\n\n┌────────────────────────────┐\n│ Courses │\n├────────────────────────────┤\n│ React Native │\n│ │\n│ JavaScript │\n│ │\n│ TypeScript │\n└────────────────────────────┘\n\nEach course should navigate to its detail screen.",
      "Step 4 — Add a Typed Detail Route\n\nCreate:\n\ncourses/[id].tsx\n\nNow:\n\n/courses/1\n/courses/2\n/courses/3\n\ncan all use the same screen.\n\nThe route should receive:\n\nid\n\nand TypeScript should know that id is a string.\n\nConceptually:\n\nconst { id } =\nuseLocalSearchParams<{\nid: string;\n}>();",
      "Step 5 — Add the Nested Sub-Detail Screen\n\nNow go one level deeper.\n\nFor example:\n\ncourses/\n├── index.tsx\n└── [id]/\n├── index.tsx\n└── lessons/\n└── [lessonId].tsx\n\nNow your navigation can represent:\n\nCourses\n↓\nCourse 42\n↓\nLesson 5\n\nThat's your three-level navigation path.",
      "Step 6 — Add a Route-Based Modal\n\nCreate an edit destination.\n\nFor example:\n\ncourses/\n├── [id].tsx\n└── edit.tsx\n\nConfigure the edit screen to use modal presentation.\n\nConceptually:\n\n<Stack.Screen\nname=\"edit\"\noptions={{\npresentation: \"modal\",\n}}\n/>\n\nNow:\n\nCourse Details\n│\n▼\nEdit\n│\n▼\nModal",
      "Step 7 — Configure a Deep Link\n\nNow create a deep link that goes directly to your nested screen.\n\nFor example:\n\nmyapp://courses/42/lessons/5\n\nThe goal is:\n\nDeep Link\n↓\nCourse 42\n↓\nLesson 5\n\nThe user shouldn't have to manually navigate through the previous screens.",
      "Step 8 — Test a Cold Launch\n\nCompletely close the application.\n\nThen open the deep link.\n\nYou should get:\n\nDeep Link\n↓\nApplication starts\n↓\nRouter processes link\n↓\nCourses\n↓\nCourse 42\n↓\nLesson 5\n\nThis verifies that your deep link works when the application isn't already running.",
      "Step 9 — Test While the App Is Running\n\nNow open the application normally.\n\nNavigate somewhere else.\n\nThen trigger the same deep link.\n\nVerify that the application navigates to:\n\nCourse 42\n↓\nLesson 5\n\nThis tests a different navigation situation."
    ],
    "acceptance": [
      "Your project is complete when:",
      "The application has tabs.",
      "One tab contains a nested stack.",
      "The Courses area has a list screen.",
      "Courses have dynamic detail routes.",
      "Route parameters are typed.",
      "There is a nested sub-detail screen.",
      "The edit screen is represented as a route-based modal.",
      "A deep link can open the nested screen.",
      "The deep link works from a cold application launch.",
      "The deep link works while the application is already running.",
      "Navigation behavior makes sense when pressing Back."
    ],
    "stretch": [
      "1. Persist navigation state\n\nSave the user's navigation position and restore it after restarting the app.\n\nRemember:\n\nLoad\n↓\nValidate\n↓\nRestore\n\nDon't blindly trust old navigation state.",
      "2. Platform-specific headers\n\nMake your navigation headers behave appropriately on iOS and Android.\n\nFor example:\n\niOS\n← Course Details\n\nAndroid\n← Course Details\n\nExperiment with titles, buttons, and platform-specific options.",
      "3. Notification-like entry point\n\nCreate a fake notification:\n\n┌─────────────────────────────┐\n│ 📚 Learning App │\n│ │\n│ Your lesson is ready! │\n│ Tap to continue learning. │\n└─────────────────────────────┘\n\nWhen the user taps it, navigate directly to:\n\nCourses\n↓\nCourse 42\n↓\nLesson 5\n\nThis teaches you an important real-world pattern:\n\nNotification\n↓\nDeep Link\n↓\nRouter\n↓\nNested Destination",
      "🧠 Day 5 Mental Model\n\nIf you remember only one thing from today, remember this:\n\n```\n             Navigation\n                 │\n  ┌──────────────┼──────────────┐\n  ▼              ▼              ▼\nRoutes       Navigators       Links\n  │              │              │\n  ▼              ▼              ▼\nScreens      Stack / Tabs     Deep Links\n  │              │              │\n  └──────────────┼──────────────┘\n                 ▼\n           User's journey\n```\n\nExpo Router gives your application a file-based routing structure.\n\nReact Navigation provides the underlying navigation system.\n\nStacks manage history.\n\nTabs manage major sections.\n\nNested navigators let you build more complex application structures.\n\nTyped parameters make navigation information safer.\n\nRoute-based modals make certain temporary screens part of navigation.\n\nDeep links let something outside your app jump directly into a specific destination.\n\nAnd persisted navigation state can remember where the user was—but only if you verify that the saved state is still valid."
    ]
  }
});
