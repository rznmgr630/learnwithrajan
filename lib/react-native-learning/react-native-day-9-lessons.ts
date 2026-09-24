import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_9_LESSONS = normalizePastedLessonDay({
  "day": 9,
  "title": "App Lifecycle",
  "overview": "Today we're going to learn about something that every mobile app deals with, even if you don't write any special code for it:\n\n> **Your app does not stay running forever.**\n\nOn a web page, you might think about:\n\n```\nPage opened\n  ↓\nPage running\n  ↓\nPage closed\n```\n\nMobile apps are different.\n\nA user can:\n\n- Open your app\n- Switch to another app\n- Lock their phone\n- Receive a phone call\n- Come back later\n- Open your app from a notification\n- Open your app from a deep link (a link that opens a specific location inside your app)\n- Leave the app for several hours\n- Have the operating system kill the app while it's in the background\n- Open it again\n\nYour app needs to handle all of these situations.\n\nThat's what **app lifecycle** means.\n\n**Lifecycle** means the different states an application goes through during its lifetime.\n\n---",
  "totalMinutes": 50,
  "difficulty": "Beginner → Intermediate",
  "lessons": [
    {
      "id": "rn9-1",
      "title": "AppState — Understanding active, background, and inactive",
      "durationMinutes": 7,
      "explanation": "React Native provides something called `AppState`.\n\n`AppState` tells you about the current state of your application.\n\nThe most important states are:\n\n```\nactive\nbackground\ninactive\n```\n\nA simple mental model is:\n\n```\n            ┌───────────┐\n            │  ACTIVE   │\n            └─────┬─────┘\n                  │\n            User leaves app\n                  │\n                  ▼\n         ┌─────────────────┐\n         │ BACKGROUND /    │\n         │ INACTIVE        │\n         └────────┬────────┘\n                  │\n            User returns\n                  │\n                  ▼\n            ┌─────────┐\n            │ ACTIVE  │\n            └─────────┘\n```\n\nBut there's an important detail:\n\n> **The exact meaning and transitions can differ between iOS and Android.**\n\nSo don't think of these states as a perfect universal diagram.\n\n---\n\n# What does `active` mean?\n\n`active` generally means:\n\n> The application is currently in use and is in the foreground.\n\nFor example:\n\n```\nUser opens app\n     ↓\nApp is visible\n     ↓\nAppState = active\n```\n\nThis is the normal state where your UI is being actively used.\n\n---\n\n# What does `background` mean?\n\n`background` generally means your app is no longer the foreground application.\n\nFor example:\n\n```\nYour app\n  ↓\nUser presses Home\n  ↓\nUser opens YouTube\n  ↓\nYour app → background\n```\n\nYour JavaScript application may not continue running normally.\n\nThe operating system is now managing your app's resources.\n\n---\n\n# What does `inactive` mean?\n\n`inactive` is particularly important on iOS.\n\nIt generally represents a temporary state where your application isn't actively receiving normal interaction.\n\nFor example, a transition or system event might temporarily move the application through an inactive state.\n\nThink of it as:\n\n```\nACTIVE\n ↓\nTemporary interruption/transition\n ↓\nINACTIVE\n ↓\nACTIVE\n```\n\nor:\n\n```\nACTIVE\n ↓\nINACTIVE\n ↓\nBACKGROUND\n```\n\nThe exact behavior depends on the platform and system event.\n\n---\n\n# Why do we care?\n\nBecause your application might need to react differently.\n\nFor example:\n\n```\nApp becomes active\n      ↓\nRefresh stale data\n```\n\nBut:\n\n```\nApp goes background\n      ↓\nStop expensive work\n```\n\nYou don't want to blindly run expensive operations while your app isn't being used.\n\n---\n\n# Listening to AppState\n\nYou can listen for changes using React Native's `AppState`.\n\nFor example:\n\n```\nimport { AppState } from \"react-native\";\n```\n\nThen:\n\n```\nconst subscription = AppState.addEventListener(\n \"change\",\n nextState => {\n   console.log(\"App state:\", nextState);\n }\n);\n```\n\nThe important idea is:\n\n```\nAppState\n  ↓\n\"Tell me when the app changes state.\"\n```\n\n---\n\n# Cleaning up the listener\n\nRemember that event listeners should usually be cleaned up.\n\nFor example:\n\n```\nuseEffect(() => {\n const subscription = AppState.addEventListener(\n   \"change\",\n   nextState => {\n     console.log(nextState);\n   }\n );\n\n return () => {\n   subscription.remove();\n };\n}, []);\n```\n\nWhy?\n\nBecause otherwise you can accidentally create multiple listeners.\n\nThen one lifecycle event might produce:\n\n```\nApp state: active\nApp state: active\nApp state: active\n```\n\neven though only one transition happened.\n\n---",
      "diagram": "```\n                USER INTERACTION\n                       │\n       ┌───────────────┼────────────────┐\n       ▼               ▼                ▼\n    Open app       Leave app        System event\n       │               │                │\n       ▼               ▼                ▼\n    ACTIVE         BACKGROUND        INACTIVE\n       │               │                │\n       └───────────────┴────────────────┘\n                       │\n                       ▼\n                 AppState event\n                       │\n                       ▼\n                 Your React code\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- `AppState` tells you about the app's current lifecycle state.\n- `active` generally means the app is being actively used.\n- `background` means the app isn't the foreground application.\n- `inactive` is especially relevant to iOS temporary transitions/interruption states.\n- Platform behavior isn't identical.\n- Lifecycle listeners should be cleaned up.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Assuming `background` means the app is dead\n\nIt doesn't necessarily.\n\nThe app may still exist in memory.\n\n### ❌ Assuming background JavaScript always keeps running\n\nThe operating system can restrict or stop background execution.\n\n### ❌ Forgetting to remove listeners\n\nThis can create duplicate callbacks.\n\n---"
      ],
      "quiz": [
        {
          "question": "Which API can you use to observe React Native app lifecycle changes?",
          "options": [
            "A. `AppState`",
            "B. `StyleSheet`",
            "C. `FlatList`",
            "D. `ViewState`"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn9-2",
      "title": "Cold Start, Warm Start, and Resume",
      "durationMinutes": 6,
      "explanation": "Not every time a user opens your app is the same.\n\nThere are several different launch situations.\n\nThe three terms you should understand are:\n\n```\nCold start\nWarm start\nResume\n```\n\n---\n\n# Cold start\n\nA **cold start** means the application process wasn't already running.\n\nThe operating system has to start your application from scratch.\n\nFor example:\n\n```\nApp isn't running\n      ↓\nUser taps app icon\n      ↓\nOperating system starts app\n      ↓\nJavaScript starts\n      ↓\nReact tree is created\n      ↓\nApp appears\n```\n\nThis is a full application startup.\n\n---\n\n# Warm start\n\nA **warm start** generally means the application already has some existing state/resources available and can return more quickly than a completely fresh process start.\n\nThe exact terminology can vary between platforms and tooling.\n\nThe important idea is:\n\n> The app doesn't necessarily have to rebuild everything from absolute zero.\n\n---\n\n# Resume from suspension\n\nThis is another important case.\n\nImagine:\n\n```\nOpen app\n  ↓\nUse app\n  ↓\nSwitch to another app\n  ↓\nYour app becomes inactive/backgrounded\n  ↓\nOS keeps it in memory\n  ↓\nUser comes back\n```\n\nIf the operating system kept the process alive, your app can resume.\n\nThis can feel almost instant.\n\n---\n\n# But here's the important part\n\nYou cannot assume that:\n\n```\nBackground\n  ↓\nForeground\n```\n\nmeans:\n\n```\nEverything is exactly as it was.\n```\n\nThe app could have been suspended.\n\nOr the operating system could have killed it.\n\n---\n\n# Three scenarios\n\n### Scenario A — Resume\n\n```\nApp running\n   ↓\nBackground\n   ↓\nStill in memory\n   ↓\nUser returns\n   ↓\nResume\n```\n\n### Scenario B — App killed in background\n\n```\nApp running\n   ↓\nBackground\n   ↓\nOS needs memory\n   ↓\nApp process killed\n```\n\nThen:\n\n```\nUser returns\n   ↓\nApp starts again\n```\n\nThat's effectively a new launch.\n\n### Scenario C — User explicitly kills the app\n\nDepending on the platform, if the user force-quits the application, some background behaviors may be restricted until the user manually launches it again.\n\n---\n\n## Why does this matter?\n\nImagine you have:\n\n```\nconst [selectedProduct, setSelectedProduct] =\n useState(product);\n```\n\nIf the process survives, this state may still exist.\n\nIf the process is killed:\n\n```\nJavaScript memory\n    ↓\ngone\n```\n\nThen:\n\n```\nselectedProduct\n    ↓\ngone\n```\n\nThat's why important state shouldn't exist only in React memory.\n\n---",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Cold start = application process starts from scratch.\n- Resume = an existing application process returns to the foreground.\n- Backgrounded apps can remain in memory, but this isn't guaranteed.\n- OS memory pressure can cause your app to be killed.\n- Important data should have an appropriate persistence strategy.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Treating every app opening as a cold start\n\nIt's not.\n\n### ❌ Assuming React state always survives\n\nIt only survives while the relevant application process/state remains alive.\n\n### ❌ Assuming background means safe storage\n\nBackground memory isn't permanent storage.\n\n---"
      ],
      "quiz": [
        {
          "question": "What happens during a cold start?",
          "options": [
            "A. The application starts from scratch",
            "B. Only the current screen changes color",
            "C. The app skips initialization",
            "D. Only a list item is rendered"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn9-3",
      "title": "What Survives Backgrounding?",
      "durationMinutes": 7,
      "explanation": "This is where mobile development gets interesting.\n\nSuppose your app has:\n\n```\nconst [count, setCount] = useState(10);\n```\n\nThe user leaves the app.\n\nWhat happens to `count`?\n\nThe answer is:\n\n> **It depends on whether your application process remains alive.**\n\n---\n\n# If the app remains in memory\n\nImagine:\n\n```\nReact state\n   │\n   ▼\nApp goes background\n   │\n   ▼\nProcess remains alive\n   │\n   ▼\nUser returns\n   │\n   ▼\nReact state still exists\n```\n\nSo your:\n\n```\ncount = 10\n```\n\nmay still be:\n\n```\ncount = 10\n```\n\n---\n\n# If the OS kills the app\n\nNow imagine:\n\n```\nReact state\n   │\n   ▼\nApp goes background\n   │\n   ▼\nOS needs memory\n   │\n   ▼\nApp process killed\n```\n\nYour JavaScript memory is gone.\n\nWhen the user opens the app again:\n\n```\nNew process\n   ↓\nNew JavaScript runtime\n   ↓\nNew React tree\n```\n\nYour old `useState()` values aren't automatically restored.\n\n---\n\n# Memory vs persistence\n\nThis distinction is extremely important.\n\n### Memory\n\nThings currently stored in your running JavaScript application.\n\nExamples:\n\n```\nuseState\nuseReducer\ncomponent state\nin-memory cache\n```\n\n### Persistence\n\nData stored somewhere that survives process termination.\n\nExamples:\n\n```\nAsync storage\nSQLite\nSecure storage\nServer/database\nFile system\n```\n\nThe correct persistence method depends on the data.\n\n---\n\n# Example\n\nSuppose your app has a shopping cart.\n\nYou might have:\n\n```\nCart:\n- Shoes\n- Shirt\n- Backpack\n```\n\nIf you store the cart only in:\n\n```\nuseState(...)\n```\n\nyou risk losing it if the process is killed.\n\nInstead, important cart information may need to be persisted.\n\n---\n\n# What about navigation?\n\nSuppose the user is here:\n\n```\nHome\n ↓\nProducts\n ↓\nShoes\n ↓\nNike Air\n```\n\nIf the process survives, the navigation state may remain.\n\nIf the process is killed, you need a strategy for restoring it.\n\nThis is why navigation state persistence matters.\n\n---\n\n## Scroll position\n\nThe same concept applies to scroll position.\n\nImagine:\n\n```\nFeed\n────────────────\nPost 1\nPost 2\nPost 3\n...\nPost 500\n────────────────\n```\n\nThe user scrolls to:\n\n```\nPost 327\n```\n\nThen the app gets killed.\n\nIf you want to restore their position, you need to deliberately save enough information to do so.\n\nYou cannot assume the `ScrollView` or `FlatList` will magically remember it after a complete process restart.\n\n---\n\n## A useful mental model\n\n```\n┌─────────────────────────┐\n│       App Memory        │\n│                         │\n│ useState                │\n│ React tree              │\n│ in-memory cache         │\n└────────────┬────────────┘\n            │\n       Process killed\n            │\n            ▼\n         GONE ❌\n\n┌─────────────────────────┐\n│      Persistent Data    │\n│                         │\n│ Storage / Database      │\n│ Server                  │\n└────────────┬────────────┘\n            │\n       Process killed\n            │\n            ▼\n       Still available ✅\n```\n\n---",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Backgrounding doesn't automatically destroy your React state.\n- But backgrounded apps can be killed.\n- React memory is temporary.\n- Persistent storage is designed to survive process termination.\n- Navigation and scroll restoration require deliberate design.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Saving everything to persistent storage\n\nNot everything needs persistence.\n\nTemporary UI state usually doesn't.\n\n### ❌ Saving nothing\n\nImportant user data can disappear after process termination.\n\n### ❌ Assuming navigation automatically survives every restart\n\nIt depends on how you've configured persistence/restoration.\n\n---"
      ],
      "quiz": [
        {
          "question": "Which is more likely to survive an operating-system process kill?",
          "options": [
            "A. `useState()`",
            "B. A persistent database",
            "C. A local React variable",
            "D. A component's temporary state"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn9-4",
      "title": "Memory Pressure and the OS Killing Your App",
      "durationMinutes": 6,
      "explanation": "Your phone has limited memory.\n\nMemory is used by:\n\n```\nYour app\nOther apps\nOperating system\nImages\nVideos\nBrowser tabs\nGames\nBackground services\n```\n\nImagine the phone has limited space available:\n\n```\nAvailable memory\n████████████████████\n```\n\nThen several large applications start running:\n\n```\nApp A ███████\nApp B ███████\nApp C ███████\nYour App ███████\n```\n\nEventually the operating system may need to reclaim memory.\n\nThis situation is called **memory pressure**.\n\n**Memory pressure** means the device is running low on available memory and the operating system needs to free resources.\n\n---\n\n# Why background apps are vulnerable\n\nImagine:\n\n```\nYour app\n  ↓\nBackground\n  ↓\nUser opens a huge game\n  ↓\nPhone needs memory\n  ↓\nOS evaluates background apps\n  ↓\nYour app may be terminated\n```\n\nThe exact behavior is platform-dependent.\n\nBut the important lesson is:\n\n> **Don't assume a backgrounded app will stay alive forever.**\n\n---\n\n# Why this matters for developers\n\nSuppose your app has:\n\n```\nCurrent screen:\nProduct #428\n\nScroll:\nPosition 8432\n\nDraft:\n\"Call me tomorrow\"\n\nNetwork data:\nLoaded\n```\n\nIf everything exists only in memory and the OS kills your process, you may lose it.\n\nThat's why you need to decide:\n\n```\nWhat must survive?\nWhat can be recreated?\nWhat can be fetched again?\nWhat should be persisted?\n```\n\n---\n\n# Memory management also affects performance\n\nImagine loading 5,000 giant images into memory.\n\nYour app may become:\n\n```\nSlow\n  ↓\nMemory usage increases\n  ↓\nMore pressure\n  ↓\nPotential crashes/termination\n```\n\nThis connects directly to what you learned on **Day 6 about lists and virtualization**.\n\nGood list architecture isn't just about smooth scrolling.\n\nIt can also reduce unnecessary memory usage.\n\n---\n\n# Key Takeaways\n\n- Phones have limited memory.\n- Background applications can be terminated when resources are needed.\n- You cannot depend on a background process staying alive forever.\n- Decide which data must be persisted.\n- Efficient rendering and memory usage are important on mobile.\n\n---",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": [
        {
          "question": "What is memory pressure?",
          "options": [
            "A. The user forgetting their password",
            "B. The device running low on available memory",
            "C. A navigation error",
            "D. A network timeout"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn9-5",
      "title": "Restoring Navigation and Scroll Position",
      "durationMinutes": 6,
      "explanation": "Now let's solve a common real-world problem.\n\nImagine your user is reading an article.\n\nThey're here:\n\n```\nHome\n↓\nArticles\n↓\nReact Native Performance\n```\n\nAnd they've scrolled to:\n\n```\n70%\n```\n\nThen the app gets interrupted.\n\nWhen they come back, you don't necessarily want them to start from the beginning.\n\n---\n\n# Navigation state\n\nNavigation state describes things such as:\n\n```\nCurrent route\nNavigation stack\nTabs\nParameters\nNested routes\n```\n\nFor example:\n\n```\nTabs\n├── Home\n├── Search\n└── Profile\n\nSearch\n└── Results\n     └── Product\n```\n\nThe navigation state tells the navigation system where the user currently is.\n\n---\n\n# Scroll state\n\nScroll state is simpler:\n\n```\nscrollOffset = 4200\n```\n\nAn **offset** is the current position within a scrollable area.\n\nFor example:\n\n```\nTop\n │\n │\n ▼\n──────────────\nPost 1\nPost 2\nPost 3\n...\nPost 100\n──────────────\n       ▲\n       │\n  Current offset\n```\n\n---\n\n# Do you always need restoration?\n\nNo.\n\nAsk:\n\n> \"Would restoring this state improve the user's experience?\"\n\nFor example:\n\n### Good candidates\n\n```\nLong article\nLarge feed\nForm draft\nNavigation location\nSearch query\n```\n\n### Sometimes unnecessary\n\n```\nTemporary animation\nHover-like UI\nOne-time tooltip\nTemporary loading spinner\n```\n\n---\n\n# Restoring scroll position\n\nA common approach is to save an offset.\n\nConceptually:\n\n```\nconst [scrollOffset, setScrollOffset] =\n useState(0);\n```\n\nThen track scrolling:\n\n```\nonScroll={event => {\n const offset =\n   event.nativeEvent.contentOffset.y;\n\n // Save offset when appropriate.\n}}\n```\n\nWhen the screen returns, you can restore the offset using the appropriate scroll API.\n\nThe exact implementation depends on whether you're using `ScrollView`, `FlatList`, or another list implementation.\n\n---\n\n# Be careful with lists\n\nSuppose the user was at:\n\n```\nItem 500\n```\n\nWhen the app comes back, your data may have changed.\n\nMaybe new items were inserted.\n\nSo blindly restoring:\n\n```\noffset = 8000\n```\n\nmay not put the user in the same logical place.\n\nThis is why restoration should sometimes use a stable identifier rather than only a pixel offset.\n\nFor example:\n\n```\n\"I was viewing item ID 500.\"\n```\n\nis often more meaningful than:\n\n```\n\"I was 8,000 pixels down.\"\n```\n\n---",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Navigation state tells you where the user is in your navigation hierarchy.\n- Scroll state tells you where the user is in a scrollable area.\n- Both can be restored deliberately.\n- Pixel offsets aren't always enough when content changes.\n- Consider stable IDs for important restoration.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Restoring everything\n\nOnly restore state that improves the experience.\n\n### ❌ Restoring stale offsets\n\nThe content may have changed.\n\n### ❌ Assuming navigation state is permanent\n\nA process restart can remove in-memory navigation state unless you've persisted it.\n\n---"
      ],
      "quiz": [
        {
          "question": "Why might restoring an item's ID be better than restoring only a pixel offset?",
          "options": [
            "A. The content may have changed",
            "B. IDs make the screen colorful",
            "C. IDs remove permissions",
            "D. Pixel offsets don't exist"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn9-6",
      "title": "Notification Launch vs Deep-Link Launch vs Normal Launch",
      "durationMinutes": 7,
      "explanation": "Your app can be opened in different ways.\n\nThis matters because:\n\n> **How the user entered the app can determine what screen they should see.**\n\nThere are three important cases:\n\n```\nNormal launch\nNotification launch\nDeep-link launch\n```\n\n---\n\n# Normal launch\n\nThe user taps your app icon.\n\n```\nPhone\n ↓\nApp icon\n ↓\nApp starts\n ↓\nHome screen\n```\n\nThis is the simplest case.\n\n---\n\n# Deep-link launch\n\nA **deep link** is a link that opens a specific destination inside an app.\n\nFor example:\n\n```\nmyapp://products/123\n```\n\nInstead of:\n\n```\nApp\n↓\nHome\n```\n\nyou might get:\n\n```\nApp\n↓\nProduct #123\n```\n\n---\n\n# Notification launch\n\nImagine the user receives:\n\n```\n🔔 Your order has shipped\n```\n\nThey tap the notification.\n\nYour app opens.\n\nInstead of sending them to:\n\n```\nHome\n```\n\nyou might want:\n\n```\nOrders\n ↓\nOrder #123\n```\n\n---\n\n# Why does this matter?\n\nSuppose you have:\n\n```\nHome\nOrders\nMessages\nProfile\n```\n\nA normal launch might go:\n\n```\nHome\n```\n\nA notification might go:\n\n```\nMessages\n ↓\nMessage #42\n```\n\nA deep link might go:\n\n```\nProducts\n ↓\nProduct #123\n```\n\nThe app needs to know what caused the launch.\n\n---\n\n# Think of launch as an entry point\n\n```\n                  App\n                   ▲\n                   │\n      ┌────────────┼────────────┐\n      │            │            │\n      │            │            │\n   App icon    Notification   Deep link\n      │            │            │\n      ▼            ▼            ▼\n    Home       Message #42   Product #123\n```\n\n---\n\n# How do we detect it?\n\nThe exact APIs depend on the libraries you're using.\n\nFor example, with Expo-based applications, you may use APIs from:\n\n```\nexpo-notifications\nexpo-linking\nExpo Router\n```\n\nThe important architecture is:\n\n```\nApp starts\n  ↓\nCheck launch context\n  ↓\nWas there a notification?\n  │\n  ├── Yes → navigate accordingly\n  │\n  └── No\n       ↓\n  Was there a deep link?\n       │\n       ├── Yes → navigate accordingly\n       │\n       └── No → normal startup\n```\n\n---\n\n# Important edge case\n\nWhat if your app is already open?\n\nSuppose:\n\n```\nApp already running\n```\n\nThen a notification arrives.\n\nThe app wasn't \"launched\" from scratch.\n\nInstead, the notification caused an event while the app was already running.\n\nSo you need to distinguish:\n\n```\nLaunch event\n```\n\nfrom:\n\n```\nRuntime event\n```\n\nThis is a very important mobile concept.\n\n---",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Apps can be entered through different paths.\n- Normal launch usually starts at your normal entry screen.\n- Deep links can open specific destinations.\n- Notifications can open specific content.\n- A notification can arrive when the app is already running.\n- Your app should distinguish launch-time data from runtime events.\n\n---"
      ],
      "commonMistakes": [],
      "quiz": [
        {
          "question": "A user taps a notification saying \"Your package arrived.\" What might the app reasonably do?",
          "options": [
            "A. Open the relevant order screen",
            "B. Always open the camera",
            "C. Delete the notification system",
            "D. Open an unrelated profile page"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn9-7",
      "title": "Cancelling and Restarting Network Requests",
      "durationMinutes": 6,
      "explanation": "Now let's connect lifecycle with networking.\n\nImagine your app starts:\n\n```\nGET /products\n```\n\nThe request begins.\n\nThen:\n\n```\nUser leaves app\n```\n\nWhat should happen to the request?\n\nThere isn't one universal answer.\n\nIt depends on what the request is doing.\n\n---\n\n# Example\n\nImagine:\n\n```\nUser opens search\n     ↓\nRequest products\n     ↓\nUser switches apps\n     ↓\nRequest still running\n```\n\nMaybe you don't care.\n\nBut sometimes continuing the request is wasteful.\n\nFor example:\n\n```\nTemporary search\n```\n\nThe user may no longer care about the result.\n\n---\n\n# Cancellation\n\n**Cancellation** means deliberately stopping an in-flight operation before it finishes.\n\nAn **in-flight request** means a network request that has started but hasn't finished yet.\n\nWith `fetch`, you can use `AbortController`.\n\nConceptually:\n\n```\nconst controller = new AbortController();\n\nfetch(url, {\n signal: controller.signal,\n});\n```\n\nThen:\n\n```\ncontroller.abort();\n```\n\nThe request is cancelled.\n\n---\n\n# Why is this useful?\n\nImagine:\n\n```\nStart request\n   ↓\nUser leaves screen\n   ↓\nRequest no longer useful\n   ↓\nCancel request\n```\n\nThis can prevent unnecessary work.\n\n---\n\n# But don't cancel everything\n\nSuppose you're uploading a user's important document.\n\nYou may not want to cancel it simply because the user switched screens.\n\nThis is where product requirements matter.\n\nAsk:\n\n> \"Does this request still matter if the app goes into the background?\"\n\n---\n\n# Restarting after resume\n\nAnother approach is:\n\n```\nApp background\n     ↓\nPause / cancel request\n     ↓\nApp becomes active\n     ↓\nCheck whether request is still needed\n     ↓\nStart a fresh request\n```\n\nThis can be useful for temporary data.\n\n---\n\n# Example\n\nSuppose you're loading stock information:\n\n```\nGET /market-data\n```\n\nThe user leaves for 30 minutes.\n\nWhen they return, the old request result might not be useful anymore.\n\nInstead:\n\n```\nApp resumes\n  ↓\nCheck freshness\n  ↓\nFetch current data\n```\n\n---\n\n## Important: Don't create duplicate requests\n\nA common bug looks like:\n\n```\nApp becomes active\n     ↓\nfetch()\n     ↓\nApp becomes active again\n     ↓\nfetch()\n     ↓\nAnother fetch()\n```\n\nNow you have several requests running.\n\nYour lifecycle code should be designed so that requests are:\n\n```\nStarted deliberately\nCancelled when appropriate\nRestarted deliberately\n```\n\n---",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Network requests can continue while lifecycle state changes, depending on platform/runtime behavior.\n- Some requests should be cancelled when they are no longer useful.\n- Some important operations should continue or be resumed differently.\n- `AbortController` can cancel compatible `fetch` requests.\n- Avoid accidentally starting duplicate requests on every lifecycle event.\n\n---"
      ],
      "commonMistakes": [],
      "quiz": [
        {
          "question": "What does `AbortController` help you do with `fetch`?",
          "options": [
            "A. Cancel a request",
            "B. Create a navigation stack",
            "C. Change text color",
            "D. Request camera permission"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn9-8",
      "title": "Is Cached Data Stale After Resume?",
      "durationMinutes": 5,
      "explanation": "This is one of the most useful lifecycle questions:\n\n> **When the user comes back to the app, can I trust the data I already have?**\n\nMaybe.\n\nMaybe not.\n\n---\n\n# What does stale mean?\n\n**Stale** means the data may no longer represent the current state of the source.\n\nFor example:\n\n```\nYour app:\nPrice = $100\n```\n\nThe user leaves for:\n\n```\n2 hours\n```\n\nWhen they return:\n\n```\nCurrent price = $115\n```\n\nYour cached value is now stale.\n\n---\n\n# Don't automatically refetch everything\n\nA beginner might write:\n\n```\nApp becomes active\n     ↓\nFetch everything\n     ↓\nFetch everything again\n     ↓\nFetch everything again\n```\n\nThat's wasteful.\n\nInstead, decide which data needs refreshing.\n\n---\n\n# Freshness policy\n\nA **freshness policy** is a rule that determines when cached data should be considered too old.\n\nFor example:\n\n```\nProfile\n→ Refresh every few minutes\n\nNews\n→ Refresh when app resumes\n\nStatic settings\n→ Rarely refresh\n\nStock prices\n→ Refresh aggressively\n```\n\nThese are examples, not universal rules.\n\n---\n\n# Timestamp-based approach\n\nYou can store:\n\n```\nlastFetchedAt\n```\n\nFor example:\n\n```\nlastFetchedAt = 10:00\n```\n\nWhen the app resumes at:\n\n```\n10:45\n```\n\nyou calculate:\n\n```\n45 minutes have passed\n```\n\nThen ask:\n\n```\nIs 45 minutes acceptable for this data?\n```\n\nIf not:\n\n```\nRefetch\n```\n\n---",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    }
  ],
  "finalQuiz": [
    {
      "question": "What does `AppState` help you monitor?",
      "options": [
        "A. Application lifecycle state",
        "B. Database tables",
        "C. Font size",
        "D. List item height"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is a cold start?",
      "options": [
        "A. The app starts from a new application process",
        "B. The user changes the screen theme",
        "C. A network request fails",
        "D. A list becomes empty"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What can happen to a backgrounded application under memory pressure?",
      "options": [
        "A. The operating system may terminate its process",
        "B. It gets unlimited memory",
        "C. It automatically becomes a server",
        "D. Nothing can happen"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why might cached data need to be refreshed when the app resumes?",
      "options": [
        "A. It may have become stale",
        "B. React automatically deletes it",
        "C. Navigation requires it",
        "D. CSS requires it"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is a deep link?",
      "options": [
        "A. A link that can open a specific destination inside an application",
        "B. A database connection",
        "C. A camera permission",
        "D. A type of animation"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why might you cancel an in-flight network request?",
      "options": [
        "A. The request may no longer be useful",
        "B. To change the app's font",
        "C. To enable navigation",
        "D. To create a new component"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Which API can you use to observe React Native app lifecycle changes?",
      "options": [
        "A. `AppState`",
        "B. `StyleSheet`",
        "C. `FlatList`",
        "D. `ViewState`"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What happens during a cold start?",
      "options": [
        "A. The application starts from scratch",
        "B. Only the current screen changes color",
        "C. The app skips initialization",
        "D. Only a list item is rendered"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Which is more likely to survive an operating-system process kill?",
      "options": [
        "A. `useState()`",
        "B. A persistent database",
        "C. A local React variable",
        "D. A component's temporary state"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "What is memory pressure?",
      "options": [
        "A. The user forgetting their password",
        "B. The device running low on available memory",
        "C. A navigation error",
        "D. A network timeout"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    }
  ],
  "project": {
    "name": "🛠️ Self-Check — Instrument Your App's Lifecycle",
    "goal": "Complete the Day 9 self-check project.",
    "brief": "Now it's time to combine everything.\n\nYour task:\n\n> **Log every lifecycle transition and verify that a network request started before backgrounding is handled correctly when the app resumes.**\n\n---\n\n# Part 1 — Create a lifecycle logger\n\nCreate a small component:\n\n```\nimport { useEffect } from \"react\";\nimport { AppState } from \"react-native\";\n\nexport function LifecycleLogger() {\n useEffect(() => {\n   const subscription = AppState.addEventListener(\n     \"change\",\n     nextState => {\n       console.log(\n         `[Lifecycle] AppState → ${nextState}`\n       );\n     }\n   );\n\n   return () => {\n     subscription.remove();\n   };\n }, []);\n\n return null;\n}\n```\n\nNow your development console might show:\n\n```\n[Lifecycle] AppState → background\n[Lifecycle] AppState → active\n```\n\n---\n\n# Part 2 — Track the previous state\n\nInstead of only knowing the next state, it's useful to know:\n\n```\nPrevious → Next\n```\n\nFor example:\n\n```\nactive → background\nbackground → active\n```\n\nYou can use a ref:\n\n```\nconst previousState =\n useRef(AppState.currentState);\n\nuseEffect(() => {\n const subscription = AppState.addEventListener(\n   \"change\",\n   nextState => {\n     console.log(\n       `[Lifecycle] ${previousState.current} → ${nextState}`\n     );\n\n     previousState.current = nextState;\n   }\n );\n\n return () => {\n   subscription.remove();\n };\n}, []);\n```\n\nNow your log becomes much more useful.\n\n---\n\n# Part 3 — Start a network request\n\nImagine:\n\n```\nconst controller =\n new AbortController();\n\nfetch(\"https://example.com/api/data\", {\n signal: controller.signal,\n});\n```\n\nFor the exercise, add logs:\n\n```\n[Network] Request started\n[Network] Request completed\n```\n\n---\n\n# Part 4 — Background the app\n\nStart your request.\n\nThen immediately:\n\n```\nHome button\n```\n\nor switch to another application.\n\nYour logs might look like:\n\n```\n[Network] Request started\n\n[Lifecycle] active → background\n```\n\nNow ask:\n\n> Is this request still useful?\n\nThat's the decision you need to make.\n\n---\n\n# Part 5 — Resume\n\nReturn to your app.\n\nYou might see:\n\n```\n[Lifecycle] background → active\n```\n\nNow your app can decide:\n\n```\nWas the old request completed?\nWas it cancelled?\nIs the data stale?\nShould I start a new request?\n```\n\n---\n\n# A good lifecycle flow\n\nFor temporary data, your implementation might conceptually behave like this:\n\n```\nRequest starts\n    │\n    ▼\nApp goes background\n    │\n    ▼\nRequest cancelled\n    │\n    ▼\nApp becomes active\n    │\n    ▼\nCheck cache/data\n    │\n    ▼\nStart fresh request if needed\n```\n\nFor an important operation, you might choose a different strategy.\n\nThe important thing is that the behavior is **intentional**.\n\n---\n\n# What you should test\n\n## Test 1 — Normal launch\n\n```\nOpen app\n```\n\nExpected:\n\n```\nApp becomes active\n```\n\n---\n\n## Test 2 — Background\n\n```\nApp open\n  ↓\nSwitch app\n```\n\nExpected:\n\n```\nactive → background\n```\n\nor an appropriate platform-specific transition sequence.\n\n---\n\n## Test 3 — Resume\n\n```\nBackground\n  ↓\nReturn\n```\n\nExpected:\n\n```\nbackground → active\n```\n\n---\n\n## Test 4 — Request before background\n\n```\nStart request\n  ↓\nBackground app\n  ↓\nObserve request\n  ↓\nResume\n```\n\nYou should be able to answer:\n\n> What happened to the request?\n\n---\n\n## Test 5 — Long background period\n\nLeave your app in the background for a while.\n\nThen return.\n\nAsk:\n\n```\nIs my data still fresh?\n```\n\nIf not:\n\n```\nRefetch\n```\n\n---\n\n## Test 6 — Simulate a process restart\n\nTest what happens when the application process is no longer available and the app starts again.\n\nAsk:\n\n```\nDid my navigation state survive?\n\nDid my important data survive?\n\nDid my temporary UI state disappear?\n\nDid the app recover correctly?\n```\n\n---",
    "steps": [],
    "acceptance": [],
    "footer": "# 🧠 Day 9 Mental Model\n\nHere's the entire lesson in one picture:\n\n```\n                        APP LIFECYCLE\n                             │\n            ┌────────────────┼────────────────┐\n            │                │                │\n            ▼                ▼                ▼\n         Launch           Running          Background\n            │                │                │\n            │                │                │\n            ▼                ▼                ▼\n         Cold /          ACTIVE         May remain in\n         warm start                       memory\n                                             │\n                                             ▼\n                                     OS may terminate\n                                             │\n                                             ▼\n                                     Process disappears\n                                             │\n                                             ▼\n                                     New launch needed\n```\n\nAnd when the app returns:\n\n```\n                 App becomes active\n                        │\n                        ▼\n                 Check application state\n                        │\n         ┌──────────────┼───────────────┐\n         ▼              ▼               ▼\n    Navigation       Network          Cached data\n      state           requests          freshness\n         │              │               │\n         ▼              ▼               ▼\n      Restore?       Cancel?          Refresh?\n                      Restart?\n```\n\n---\n\n# 🧩 Day 9 — The Big Picture\n\nLet's connect everything you've learned.\n\nA mobile app isn't just:\n\n```\nScreen\n↓\nButton\n↓\nAPI\n```\n\nIt's more like:\n\n```\n                   ┌───────────────┐\n                   │   User opens  │\n                   │      app      │\n                   └───────┬───────┘\n                           │\n                           ▼\n                   ┌───────────────┐\n                   │ App lifecycle │\n                   │    ACTIVE     │\n                   └───────┬───────┘\n                           │\n               User leaves app\n                           │\n                           ▼\n                   ┌───────────────┐\n                   │   BACKGROUND  │\n                   └───────┬───────┘\n                           │\n                  ┌────────┴────────┐\n                  │                 │\n                  ▼                 ▼\n             Process lives      Process killed\n                  │                 │\n                  ▼                 ▼\n               Resume          New launch\n                  │                 │\n                  └────────┬────────┘\n                           ▼\n                   Check application\n                        state\n                           │\n            ┌──────────────┼──────────────┐\n            ▼              ▼              ▼\n       Navigation       Network         Cache\n       restoration      handling       freshness\n            │              │              │\n            └──────────────┼──────────────┘\n                           ▼\n                      ACTIVE AGAIN\n```\n\n---\n\n# 🎯 What You Should Know After Day 9\n\nBy the end of today, you should understand this sentence:\n\n> **\"A mobile app's process and UI are not guaranteed to stay alive forever, so I need to deliberately handle lifecycle transitions, persistence, network requests, navigation restoration, and stale data.\"**\n\nYour mental model should now be:\n\n```\nApp running\n   │\n   ├── User leaves\n   │       ↓\n   │   Background\n   │       ↓\n   │   Maybe still alive\n   │       ↓\n   │   Maybe terminated\n   │\n   └── User returns\n           ↓\n       Active again\n           ↓\n     Check everything\n           │\n     ┌─────┼──────┐\n     ▼     ▼      ▼\n   State  Data   Network\n     │     │      │\n  Restore Refresh Restart/\n                 Cancel\n```\n\nAnd the most important rule for Day 9 is:"
  }
});

