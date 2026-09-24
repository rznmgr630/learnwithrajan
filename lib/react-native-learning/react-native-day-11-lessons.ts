import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_11_LESSONS = normalizePastedLessonDay({
  "day": 11,
  "title": "Networking and Data Fetching",
  "overview": "Today we're going to connect your React Native application to the outside world.\n\nUntil now, most of the data we've worked with has lived **inside the device**. But real applications usually need data from a server:\n\n```\nReact Native App\n     ↓\n   Internet\n     ↓\n    API\n     ↓\n   Server\n     ↓\n  Database\n```\n\nYou'll learn how to fetch that data, cache it, handle unreliable mobile networks, detect whether the device is online, and work with real-time connections.\n\nThe most important idea today is:\n\n> **Server data and application data are not the same thing.**\n\nWe'll use **TanStack Query** for server state and **Zustand** for client state.\n\n---",
  "totalMinutes": 50,
  "difficulty": "Beginner → Intermediate",
  "lessons": [
    {
      "id": "rn11-1",
      "title": "fetch — Getting Data From an API",
      "durationMinutes": 8,
      "explanation": "Let's start with the most basic networking tool available to you:\n\n```\nfetch()\n```\n\n`fetch` is built into React Native and follows the same general **Web Standard API** (a browser-standard programming interface) that you may already know from web development.\n\nYou don't need to install a special networking library just to make an HTTP request.\n\n---\n\n## What is an API?\n\nBefore using `fetch`, let's understand the word **API**.\n\n**API (Application Programming Interface)** means a defined way for one piece of software to communicate with another.\n\nFor example, your mobile app might need a list of products.\n\nYour app can make a request:\n\n```\nGET /products\n```\n\nThe server might respond:\n\n```\n[\n {\n   \"id\": 1,\n   \"name\": \"Laptop\"\n },\n {\n   \"id\": 2,\n   \"name\": \"Phone\"\n }\n]\n```\n\nYour React Native application can then turn that data into UI.\n\n---\n\n## The basic flow\n\nThink about networking like ordering food:\n\n```\nYour App\n  │\n  │ \"Give me the products\"\n  ▼\nServer\n  │\n  │ \"Here they are\"\n  ▼\nYour App\n  │\n  ▼\nScreen\n```\n\nIn programming:\n\n```\nRequest\n  ↓\nServer\n  ↓\nResponse\n  ↓\nJSON\n  ↓\nJavaScript object\n  ↓\nReact UI\n```\n\n---\n\n# Making a GET request\n\nA simple example:\n\n```\nconst response = await fetch(\n \"https://example.com/api/products\"\n);\n\nconst data = await response.json();\n\nconsole.log(data);\n```\n\nThere are two important operations here.\n\nFirst:\n\n```\nconst response = await fetch(url);\n```\n\nThis sends the request.\n\nThen:\n\n```\nconst data = await response.json();\n```\n\nThis reads the response as JSON.\n\n---\n\n# What does `await` mean?\n\n`await` means:\n\n> \"Wait for this asynchronous operation to finish before continuing.\"\n\n**Asynchronous** means the operation can take time without blocking the entire application.\n\nA network request might take:\n\n```\n100 ms\n500 ms\n2 seconds\n10 seconds\n```\n\nYou don't want your entire application to freeze while waiting.\n\n---\n\n# Checking the HTTP status\n\nOne common beginner mistake is assuming that `fetch()` automatically throws an error for every HTTP failure.\n\nIt doesn't work that way.\n\nYou should inspect:\n\n```\nresponse.ok\n```\n\nFor example:\n\n```\nconst response = await fetch(url);\n\nif (!response.ok) {\n throw new Error(\n   `Request failed: ${response.status}`\n );\n}\n\nconst data = await response.json();\n```\n\n---\n\n# What is an HTTP status?\n\nAn **HTTP status code** tells you what happened with the request.\n\nCommon examples:\n\n```\n200 → Success\n201 → Created\n400 → Bad request\n401 → Not authenticated\n403 → Forbidden\n404 → Not found\n500 → Server error\n```\n\nYou don't need to memorize every status code.\n\nJust understand that:\n\n```\n2xx → generally successful\n4xx → request/client problem\n5xx → server problem\n```\n\n---\n\n# POST requests\n\nFetching data isn't limited to GET.\n\nYou may also send data.\n\nFor example:\n\n```\nconst response = await fetch(\n \"https://example.com/api/notes\",\n {\n   method: \"POST\",\n   headers: {\n     \"Content-Type\": \"application/json\",\n   },\n   body: JSON.stringify({\n     title: \"My note\",\n   }),\n }\n);\n```\n\nHere we're sending JSON to the server.\n\n---",
      "diagram": "```\n                 fetch()\n                   │\n                   ▼\n            ┌─────────────┐\n            │   Server    │\n            └──────┬──────┘\n                   │\n                Response\n                   │\n                   ▼\n             response.json()\n                   │\n                   ▼\n            JavaScript data\n                   │\n                   ▼\n               React UI\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- `fetch` is available in React Native.\n- It follows the Web Standard API model.\n- A request sends data to a server.\n- A response brings data back.\n- `response.json()` converts JSON response data into JavaScript data.\n- Always consider HTTP errors such as `404` or `500`.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Assuming `fetch()` means the request succeeded\n\nAlways consider:\n\n```\nif (!response.ok) {\n // handle error\n}\n```\n\n### ❌ Forgetting `await response.json()`\n\nThe response itself isn't automatically your final JavaScript object.\n\n### ❌ Putting networking directly into every component\n\nAs your app grows, you'll want a more organized data-fetching strategy.\n\nThat's where TanStack Query comes in.\n\n---"
      ],
      "quiz": [
        {
          "question": "What does `fetch()` primarily do?",
          "options": [
            "A. Makes network requests",
            "B. Creates React components",
            "C. Stores passwords securely",
            "D. Creates animations"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn11-2",
      "title": "TanStack Query — Managing Server State",
      "durationMinutes": 10,
      "explanation": "Now we're moving from:\n\n> \"How do I make a request?\"\n\nto:\n\n> \"How do I manage data that comes from a server?\"\n\nThis is a much bigger problem.\n\nImagine your app has:\n\n```\nProducts\nProfile\nOrders\nMessages\nNotifications\nComments\n```\n\nYou could manually manage everything:\n\n```\nloading\nerror\ndata\nretry\ncache\nrefresh\nrefetch\n```\n\nfor every screen.\n\nThat quickly becomes repetitive.\n\n**TanStack Query** is designed to handle this kind of **server state**.\n\n---\n\n# What is server state?\n\n**Server state** means data that belongs to or originates from a remote server.\n\nExamples:\n\n```\nUser profile from API\nProducts from API\nOrders from API\nComments from API\nNotifications from API\n```\n\nYour app doesn't truly own this data.\n\nThe server does.\n\nYour app is essentially saying:\n\n> \"Give me the latest version of this data.\"\n\n---\n\n# Why is server state complicated?\n\nImagine:\n\n```\nScreen opens\n   ↓\nFetch products\n   ↓\nShow products\n```\n\nEasy.\n\nBut now imagine:\n\n```\nScreen opens\n   ↓\nDo we already have products cached?\n   ↓\nIs the cached data still fresh?\n   ↓\nShould we refetch?\n   ↓\nWhat if the request fails?\n   ↓\nShould we retry?\n   ↓\nWhat if the user leaves the screen?\n   ↓\nWhat if the app goes into the background?\n   ↓\nWhat if the network disappears?\n```\n\nNow it's no longer just `fetch()`.\n\nThat's the problem TanStack Query helps solve.\n\n---\n\n# Caching\n\nA **cache** is stored data that can be reused instead of fetching it again immediately.\n\nImagine:\n\n```\nFirst visit\n  ↓\nRequest products\n  ↓\nServer\n  ↓\nProducts\n  ↓\nCache\n```\n\nLater:\n\n```\nOpen products screen\n      ↓\nCached products available\n      ↓\nShow them immediately\n      ↓\nRefetch in background if needed\n```\n\nThis makes the application feel much faster.\n\n---\n\n# Refetching\n\n**Refetching** means asking the server for the data again.\n\nFor example:\n\n```\nCached data\n    ↓\nDisplay immediately\n    ↓\nBackground request\n    ↓\nNew server data\n    ↓\nUpdate UI\n```\n\nThe user doesn't necessarily have to stare at a loading spinner every time.\n\n---\n\n# Retries\n\nMobile networks are unreliable.\n\nA request might fail temporarily:\n\n```\nRequest\n ↓\nNetwork problem\n ↓\nRetry\n ↓\nSuccess\n```\n\nTanStack Query can help manage retry behavior.\n\n---\n\n# Query example\n\nConceptually, a query might look like:\n\n```\nconst {\n data,\n isLoading,\n isError,\n error,\n} = useQuery({\n queryKey: [\"products\"],\n queryFn: fetchProducts,\n});\n```\n\nLet's break that down.\n\n### `queryKey`\n\n```\nqueryKey: [\"products\"]\n```\n\nThis identifies the data.\n\nThink of it as the label for the cached result.\n\n---\n\n### `queryFn`\n\n```\nqueryFn: fetchProducts\n```\n\nThis tells TanStack Query:\n\n> \"This is the function you should call to get the data.\"\n\n---\n\n### `data`\n\n```\ndata\n```\n\ncontains the server result when available.\n\n---\n\n### `isLoading`\n\nTells you the query is loading.\n\n---\n\n### `isError`\n\nTells you something went wrong.\n\n---",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn11-3",
      "title": "Server State vs Client State",
      "durationMinutes": 8,
      "explanation": "This distinction is extremely important.\n\nYou will often have two broad categories of application data:\n\n```\nServer state\nClient state\n```\n\nThey are not the same problem.\n\n---\n\n# Server state\n\nServer state comes from your backend.\n\nExamples:\n\n```\nProducts\nOrders\nUser profile\nComments\nNotifications\nMessages\n```\n\nThe server is the source of truth.\n\nFor this track:\n\n```\nServer state\n     ↓\nTanStack Query\n```\n\n---\n\n# Client state\n\nClient state belongs primarily to your application.\n\nExamples:\n\n```\nIs sidebar open?\nSelected tab\nDraft UI mode\nTemporary filters\nWizard step\nModal visibility\nLocal preferences\n```\n\nFor this track, we'll use:\n\n```\nClient state\n     ↓\nZustand\n```\n\n**Zustand** is a small state-management library for React applications.\n\n---\n\n# Example\n\nImagine a shopping application.\n\nThe server tells you:\n\n```\nProducts:\n- Laptop\n- Phone\n- Headphones\n```\n\nThat's server state.\n\nBut your app might also have:\n\n```\nCart drawer is open\nSelected category = Electronics\nSort menu is visible\n```\n\nThose are client state concerns.\n\n---\n\n# Why separate them?\n\nBecause they have different lifecycles.\n\nServer data can become:\n\n```\nstale\n```\n\n**Stale** means the data you currently have may no longer match the latest server data.\n\nClient UI state doesn't usually work that way.\n\nFor example:\n\n```\nisMenuOpen = true\n```\n\ndoesn't need to be synchronized with your backend.\n\n---\n\n# A useful comparison\n\n| Question | Server State | Client State |\n| --- | --- | --- |\n| Where does it originate? | Server | App/device |\n| Can it become stale? | Yes | Usually not in the same way |\n| Needs caching? | Often | Usually not |\n| Needs refetching? | Often | No |\n| Example | Products | Menu open |\n| Track default | TanStack Query | Zustand |\n\n---\n\n# Example architecture\n\n```\n                React Native App\n                       │\n            ┌──────────┴──────────┐\n            │                     │\n            ▼                     ▼\n      Server State           Client State\n            │                     │\n            ▼                     ▼\n     TanStack Query            Zustand\n            │                     │\n            ▼                     ▼\n         API/server          Local UI state\n```\n\n---\n\n# Don't put everything in Zustand\n\nA common beginner mistake is:\n\n```\nAPI data\n  ↓\nZustand\n  ↓\nEverything\n```\n\nYou can technically store server data there, but then you're responsible for things like:\n\n```\nCaching\nRefreshing\nInvalidation\nRetries\nStaleness\nSynchronization\n```\n\n**Invalidation** means marking cached data as needing to be refreshed.\n\nTanStack Query is specifically designed for this category of problem.\n\n---",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Server state and client state are different.\n- TanStack Query handles server state.\n- Zustand handles client-side application state.\n- Separating them keeps your architecture easier to reason about.\n- Don't automatically put every piece of data into a global store.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Putting API responses into Zustand by default\n\nAsk first whether the data is actually server state.\n\n### ❌ Putting UI state into TanStack Query\n\nA modal being open isn't server data.\n\n### ❌ Creating one giant global state object\n\nDifferent types of state have different responsibilities.\n\n---"
      ],
      "quiz": [
        {
          "question": "Where should a product list fetched from your API normally live?",
          "options": [
            "A. TanStack Query",
            "B. A button's local state",
            "C. A stylesheet",
            "D. SecureStore"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn11-4",
      "title": "Errors, Retries, and Flaky Mobile Networks",
      "durationMinutes": 8,
      "explanation": "Now let's talk about one of the most important realities of mobile development:\n\n> **The network will fail.**\n\nNot necessarily because your code is wrong.\n\nThe user might:\n\n```\nEnter an elevator\nLose Wi-Fi\nSwitch networks\nDrive through a tunnel\nEnable airplane mode\nHave weak cellular service\n```\n\nSo your application needs to handle failure gracefully.\n\n---\n\n# What is a network error?\n\nA network error can happen before the server responds.\n\nFor example:\n\n```\nApp\n↓\nRequest\n↓\n❌ No internet\n```\n\nThat's different from:\n\n```\nApp\n↓\nRequest\n↓\nServer\n↓\n500 Server Error\n```\n\nBoth are failures, but they happen for different reasons.\n\n---\n\n# Retry\n\nA retry means:\n\n> \"Try the request again.\"\n\nFor a temporary network problem, retrying can make sense.\n\nExample:\n\n```\nAttempt 1\n  ↓\nFailed\n  ↓\nWait\n  ↓\nAttempt 2\n  ↓\nFailed\n  ↓\nWait longer\n  ↓\nAttempt 3\n  ↓\nSuccess\n```\n\n---\n\n# What is backoff?\n\n**Backoff** means increasing the amount of time between retries.\n\nInstead of:\n\n```\nRetry immediately\nRetry immediately\nRetry immediately\n```\n\nyou might do:\n\n```\nAttempt 1\n  ↓\nWait 1 second\n  ↓\nAttempt 2\n  ↓\nWait 2 seconds\n  ↓\nAttempt 3\n  ↓\nWait 4 seconds\n```\n\nThis can be called **exponential backoff** because the delay increases rapidly.\n\n---\n\n# Why not retry forever?\n\nImagine the server is down.\n\nIf every phone does:\n\n```\nRequest\nRetry\nRetry\nRetry\nRetry\nRetry\n```\n\nyou could create even more traffic against a struggling server.\n\nSo retries should have sensible limits.\n\n---\n\n# Error UI matters\n\nDon't just do:\n\n```\nconsole.log(error);\n```\n\nThe user needs to understand what happened.\n\nA useful error screen might say:\n\n```\nCouldn't load your orders.\n\nCheck your connection and try again.\n\n[ Try again ]\n```\n\nThat's much better than:\n\n```\nError: Network request failed\n```\n\n---\n\n# Different types of errors\n\nYour UI can distinguish:\n\n### Loading\n\n```\nLoading orders...\n```\n\n### Success\n\n```\nYour orders\n────────────\nOrder #123\nOrder #124\n```\n\n### Error\n\n```\nCouldn't load orders.\n\n[ Try again ]\n```\n\n### Empty\n\n```\nYou haven't placed any orders yet.\n```\n\nThese are different states.\n\n---",
      "diagram": "```\n                 Request\n                    │\n                    ▼\n               ┌─────────┐\n               │ Network │\n               └────┬────┘\n                    │\n         ┌──────────┼──────────┐\n         │          │          │\n         ▼          ▼          ▼\n      Success     Temporary   Permanent\n                   failure      failure\n         │           │           │\n         ▼           ▼           ▼\n         UI        Retry       Show error\n                     │\n                     ▼\n                  Backoff\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Network failures are normal on mobile.\n- Retry temporary failures when appropriate.\n- Backoff spaces retries apart.\n- Don't retry forever.\n- Give users understandable error messages.\n- Loading, error, empty, and success are separate UI states.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Showing infinite spinners\n\nA request can fail.\n\n### ❌ Retrying forever\n\nRetries need limits.\n\n### ❌ Showing technical error messages\n\nUsers don't need raw networking terminology.\n\n---"
      ],
      "quiz": [
        {
          "question": "What does exponential backoff do?",
          "options": [
            "A. Increases the delay between retries",
            "B. Deletes cached data",
            "C. Makes the UI darker",
            "D. Prevents all requests"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn11-5",
      "title": "Detecting Connectivity with NetInfo",
      "durationMinutes": 7,
      "explanation": "Sometimes your app needs to know:\n\n> \"Does the device currently have network connectivity?\"\n\nFor this, React Native applications commonly use:\n\n```\n@react-native-community/netinfo\n```\n\nNetInfo helps you observe connectivity information.\n\n---\n\n# Why is connectivity detection useful?\n\nImagine your application is offline.\n\nInstead of waiting for requests to fail repeatedly, you can show:\n\n```\nYou're offline.\n\nYour changes will sync when you're connected again.\n```\n\nThat gives the user useful information.\n\n---\n\n# Connectivity isn't the same as internet access\n\nThis is an important detail.\n\nA device might be connected to Wi-Fi:\n\n```\nWi-Fi: connected\n```\n\nbut the Wi-Fi itself might not have internet access.\n\nSo don't think:\n\n```\nWi-Fi connected = server definitely reachable\n```\n\nThey're not exactly the same thing.\n\n---\n\n# Example\n\nYou can subscribe to connectivity changes.\n\nConceptually:\n\n```\nimport NetInfo from\n \"@react-native-community/netinfo\";\n\nconst unsubscribe =\n NetInfo.addEventListener(state => {\n   console.log(state.isConnected);\n });\n```\n\nThe listener can tell you when connectivity changes.\n\n---\n\n# Why use a listener?\n\nBecause connectivity can change while the application is running.\n\nFor example:\n\n```\n10:00\nOnline\n ↓\n10:05\nUser enters subway\n ↓\nOffline\n ↓\n10:20\nUser exits subway\n ↓\nOnline\n```\n\nYour application should be able to react to those changes.\n\n---\n\n# Combining NetInfo with data fetching\n\nImagine:\n\n```\nUser is offline\n     ↓\nDon't aggressively retry\n     ↓\nKeep cached data visible\n     ↓\nConnection returns\n     ↓\nRefetch\n```\n\nThat can create a much better experience.\n\n---",
      "diagram": "```\n                NetInfo\n                   │\n         ┌─────────┴─────────┐\n         │                   │\n       Online              Offline\n         │                   │\n         ▼                   ▼\n      Refetch           Keep cache\n         │                   │\n         ▼                   ▼\n     Fresh data        Wait for network\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- NetInfo helps detect connectivity changes.\n- Connectivity can change while the app is running.\n- Being connected to Wi-Fi doesn't always guarantee internet access.\n- Combine connectivity information with sensible request and retry behavior.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Assuming online means the API is healthy\n\nThe server can still be unavailable.\n\n### ❌ Treating offline as a fatal application state\n\nYour app can often continue using cached/local data.\n\n### ❌ Forgetting to unsubscribe\n\nListeners should be cleaned up when they're no longer needed.\n\n---"
      ],
      "quiz": [
        {
          "question": "What does NetInfo help you understand?",
          "options": [
            "A. Device network connectivity",
            "B. Font size",
            "C. Navigation history",
            "D. Database schema"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn11-6",
      "title": "WebSockets on Mobile",
      "durationMinutes": 9,
      "explanation": "Most of the networking we've discussed so far follows this pattern:\n\n```\nApp\n↓\nRequest\n↓\nServer\n↓\nResponse\n```\n\nThis is excellent for many situations.\n\nBut what if the server needs to send something to your app immediately?\n\nFor example:\n\n```\nChat message\nLive notification\nReal-time game update\nDelivery status\nStock price update\n```\n\nYou don't necessarily want your app constantly asking:\n\n```\n\"Anything new?\"\n\"Anything new?\"\n\"Anything new?\"\n```\n\nThat's where **WebSockets** can help.\n\n---\n\n# What is a WebSocket?\n\nA WebSocket creates a persistent communication connection between the application and server.\n\nInstead of:\n\n```\nRequest\nResponse\nConnection ends\n```\n\nyou can have:\n\n```\nApp ←────────────→ Server\n      connection\n```\n\nBoth sides can send messages over that connection.\n\n---\n\n# Chat example\n\nImagine you're in a chat.\n\nWithout a persistent connection, your app might repeatedly ask:\n\n```\nAnything new?\n```\n\nWith a WebSocket:\n\n```\nApp\n│\n│ connected\n▼\nServer\n│\n│ \"New message!\"\n▼\nApp\n```\n\nThe server can send the event when it happens.\n\n---\n\n# WebSocket lifecycle\n\nA connection can go through:\n\n```\nConnecting\n   ↓\nConnected\n   ↓\nMessages\n   ↓\nDisconnected\n```\n\nBut mobile applications introduce another challenge:\n\n> **Backgrounding.**\n\n---\n\n# What happens when the app goes into the background?\n\nImagine:\n\n```\nUser opens chat\n     ↓\nWebSocket connected\n     ↓\nUser presses Home\n     ↓\nApp goes into background\n```\n\nYou cannot assume that the WebSocket connection will remain healthy forever.\n\nMobile operating systems may suspend applications or restrict their activity.\n\nSo when the application returns:\n\n```\nBackground\n   ↓\nResume\n   ↓\nCheck connection\n   ↓\nReconnect if necessary\n```\n\n---\n\n# Reconnection\n\nA robust WebSocket client should think about:\n\n```\nConnected?\n  │\n  ├── Yes → continue\n  │\n  └── No → reconnect\n```\n\nYou may also use backoff:\n\n```\nReconnect attempt 1\n      ↓\nWait\n      ↓\nReconnect attempt 2\n      ↓\nWait longer\n      ↓\nReconnect attempt 3\n```\n\n---\n\n# What if messages were missed?\n\nThis is an important real-world problem.\n\nSuppose:\n\n```\n10:00 → connected\n10:05 → app backgrounded\n10:10 → server sends message\n10:15 → app resumes\n```\n\nThe application might need to determine whether it missed anything.\n\nA robust architecture might:\n\n```\nResume\n ↓\nReconnect\n ↓\nAsk server for changes since last known message\n ↓\nUpdate local state\n```\n\nThis is why real-time networking often works together with ordinary API fetching.\n\n---\n\n# WebSocket vs fetch\n\nThink of them like this:\n\n| `fetch` | WebSocket |\n| --- | --- |\n| Request/response | Persistent connection |\n| Great for normal API calls | Great for real-time events |\n| App asks server | Server can push messages |\n| Connection isn't normally persistent | Connection stays open |\n| Products, profiles, orders | Chat, live events |\n\nThey're not competitors.\n\nYou often use both.\n\n---",
      "diagram": "```\n                Application\n                    │\n         ┌──────────┴──────────┐\n         │                     │\n         ▼                     ▼\n       fetch                WebSocket\n         │                     │\n         ▼                     ▼\n  Request/response       Persistent link\n         │                     │\n         ▼                     ▼\n      REST API            Real-time events\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- WebSockets provide persistent two-way communication.\n- They're useful for real-time features.\n- Mobile apps can lose or suspend connections.\n- Reconnection is part of building a reliable WebSocket feature.\n- After backgrounding, you may need to reconnect and synchronize missed data.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Assuming a WebSocket stays connected forever\n\nMobile networks and app lifecycle events can interrupt it.\n\n### ❌ Reconnecting aggressively\n\nUse sensible retry and backoff behavior.\n\n### ❌ Assuming reconnecting automatically restores every missed event\n\nYour application may need a synchronization step.\n\n---"
      ],
      "quiz": [
        {
          "question": "When are WebSockets particularly useful?",
          "options": [
            "A. Real-time chat messages",
            "B. Changing text color",
            "C. Rendering a static image",
            "D. Creating a database table"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    }
  ],
  "finalQuiz": [
    {
      "question": "What is TanStack Query primarily responsible for?",
      "options": [
        "A. Server state",
        "B. Styling",
        "C. Device sensors",
        "D. Navigation"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Which is an example of client state?",
      "options": [
        "A. Whether a local menu is open",
        "B. Products returned from an API",
        "C. Orders stored on a server",
        "D. Comments from an API"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does caching allow your application to do?",
      "options": [
        "A. Reuse previously fetched data",
        "B. Delete the server",
        "C. Prevent all network requests forever",
        "D. Replace React"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why might you use NetInfo?",
      "options": [
        "A. To observe network connectivity",
        "B. To create animations",
        "C. To store passwords",
        "D. To render lists"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why do WebSockets need reconnection logic on mobile?",
      "options": [
        "A. Mobile connectivity and app lifecycle can interrupt connections",
        "B. WebSockets only work for one second",
        "C. React Native doesn't support networking",
        "D. WebSockets cannot send messages"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does `fetch()` primarily do?",
      "options": [
        "A. Makes network requests",
        "B. Creates React components",
        "C. Stores passwords securely",
        "D. Creates animations"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Where should a product list fetched from your API normally live?",
      "options": [
        "A. TanStack Query",
        "B. A button's local state",
        "C. A stylesheet",
        "D. SecureStore"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does exponential backoff do?",
      "options": [
        "A. Increases the delay between retries",
        "B. Deletes cached data",
        "C. Makes the UI darker",
        "D. Prevents all requests"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does NetInfo help you understand?",
      "options": [
        "A. Device network connectivity",
        "B. Font size",
        "C. Navigation history",
        "D. Database schema"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "When are WebSockets particularly useful?",
      "options": [
        "A. Real-time chat messages",
        "B. Changing text color",
        "C. Rendering a static image",
        "D. Creating a database table"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "🧪 Self-Check — Cached Data + Background Refetch",
    "goal": "Complete the Day 11 self-check project.",
    "brief": "Now it's time to put today's ideas together.\n\nYour goal:\n\n> **Build a screen that shows cached data instantly, refetches in the background, and displays a clear error when the network fails.**\n\nLet's break the requirement down.\n\n---\n\n# Step 1 — First request\n\nImagine your screen requests:\n\n```\nProducts\n```\n\nThe first time:\n\n```\nScreen opens\n   ↓\nNo cache\n   ↓\nShow loading state\n   ↓\nFetch products\n   ↓\nShow products\n```\n\n---\n\n# Step 2 — Cache the result\n\nTanStack Query can cache the result.\n\nNow imagine the user leaves the screen and comes back.\n\nInstead of:\n\n```\nScreen opens\n   ↓\nBlank screen\n   ↓\nLoading spinner\n   ↓\nWait for server\n```\n\nyou can have:\n\n```\nScreen opens\n   ↓\nCached products\n   ↓\nShow immediately\n   ↓\nBackground refetch\n```\n\n---\n\n# Step 3 — Background refetch\n\nThe UI can continue showing:\n\n```\nProducts\n\nLaptop\nPhone\nHeadphones\n```\n\nwhile the network request happens.\n\nYou can optionally show a subtle indicator:\n\n```\nRefreshing...\n```\n\nwithout replacing the entire screen with a spinner.\n\n---\n\n# Step 4 — Network succeeds\n\nIf the request succeeds:\n\n```\nCached data\n   ↓\nBackground request\n   ↓\nFresh server data\n   ↓\nUpdate cache\n   ↓\nUI updates\n```\n\n---\n\n# Step 5 — Simulate a network failure\n\nFor your self-check, deliberately make the request fail.\n\nFor example:\n\n```\nasync function fetchProducts() {\n throw new Error(\"Simulated network failure\");\n}\n```\n\nNow your application should not simply crash.\n\nInstead, show something understandable:\n\n```\nCouldn't refresh products.\n\nWe're showing your last saved data.\n\n[ Try again ]\n```\n\nThis is a much better mobile experience.\n\n---\n\n# Step 6 — Think about the states\n\nYour screen should handle at least these states:\n\n### First load\n\n```\nLoading products...\n```\n\n### Cached data\n\n```\nProducts\n────────────\nLaptop\nPhone\nHeadphones\n\nRefreshing...\n```\n\n### Successful refresh\n\n```\nProducts\n────────────\nLaptop\nPhone\nHeadphones\n```\n\n### Failed refresh with cached data\n\n```\nProducts\n\nLaptop\nPhone\nHeadphones\n\nCouldn't refresh.\nShowing saved data.\n\n[ Try again ]\n```\n\n### No data + network failure\n\nThis is different:\n\n```\nCouldn't load products.\n\nPlease check your connection.\n\n[ Try again ]\n```\n\nNotice the distinction.\n\nIf you have cached data, **keep showing it**.\n\nIf you have no data, you need an actual error/empty state.\n\n---\n\n# The Architecture You're Building\n\nBy the end of the exercise, your flow should look like:\n\n```\n                   Screen\n                      │\n                      ▼\n               TanStack Query\n                      │\n             ┌────────┴────────┐\n             │                 │\n             ▼                 ▼\n           Cache             API\n             │                 │\n             │             Network\n             │                 │\n             │        ┌────────┴────────┐\n             │        │                 │\n             │      Success            Error\n             │        │                 │\n             │        ▼                 ▼\n             │     Fresh data       Retry/error\n             │        │                 │\n             └────────┴─────────────────┘\n                      │\n                      ▼\n                      UI\n```\n\n---",
    "steps": [],
    "acceptance": [],
    "footer": "# 🎯 Day 11 Mental Model\n\nIf you remember only one thing from today, remember this:\n\n```\n                 NETWORKING\n                      │\n       ┌──────────────┼───────────────┐\n       │              │               │\n       ▼              ▼               ▼\n     fetch       TanStack Query     WebSocket\n       │              │               │\n       ▼              ▼               ▼\n  Make request    Server state    Real-time data\n                      │\n            ┌─────────┼─────────┐\n            │         │         │\n            ▼         ▼         ▼\n          Cache     Retry     Refetch\n```\n\nAnd separately:\n\n```\nConnectivity\n    ↓\nNetInfo\n    ↓\nOnline / Offline\n    ↓\nAdjust networking behavior\n```\n\nYour client-side state remains separate:\n\n```\nServer data\n   ↓\nTanStack Query\n\nClient/UI state\n   ↓\nZustand\n```\n\n---\n\n# 🎯 What You Should Know After Day 11\n\nYou should now be able to explain the difference between these:\n\n```\nfetch\n ↓\nMakes the actual HTTP request\n\nTanStack Query\n ↓\nManages server data\n ↓\nCache\nRefetch\nRetry\nLoading\nError\n\nZustand\n ↓\nManages client/application state\n\nNetInfo\n ↓\nHelps observe connectivity\n\nWebSocket\n ↓\nPersistent real-time communication\n```\n\nAnd when a mobile network becomes unreliable, your application shouldn't simply say:\n\n```\n❌ Network error\n```\n\nInstead, think:\n\n```\nDo I have cached data?\n       │\n  ┌────┴────┐\n Yes        No\n  │          │\n  ▼          ▼\nShow cache   Show error\n  │\n  ▼\nTry refetch\n  │\n  ▼\nNetwork available?\n  │\n┌─┴─┐\nYes  No\n│    │\n▼    ▼\nSync  Wait\n```\n\nThat's the foundation of **reliable mobile data fetching**.\n\nThe goal isn't to pretend that the network never fails."
  }
});

