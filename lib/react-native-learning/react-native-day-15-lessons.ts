import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_15_LESSONS = normalizePastedLessonDay({
  "day": 15,
  "title": "State Management",
  "overview": "Today we're going to answer one of the biggest questions you'll face as a React Native application grows:\n\n> **Where should my data live?**\n\nAt the beginning, `useState` feels like it can handle everything.\n\nThen your application grows:\n\n```\nScreen\n├── User\n├── Cart\n├── Settings\n├── Notifications\n├── API data\n└── Form data\n```\n\nSuddenly, you have state being passed through several components.\n\nToday you'll learn how to decide:\n\n- What should stay local?\n- What should be shared?\n- What belongs in global state?\n- What belongs in server state?\n- When should you use Zustand?\n- When are Context, Redux Toolkit, or Jotai useful?\n\n---",
  "totalMinutes": 50,
  "difficulty": "Beginner → Intermediate",
  "lessons": [
    {
      "id": "rn15-1",
      "title": "useState, useReducer, and Context",
      "durationMinutes": 9,
      "explanation": "Let's start with the tools React already gives you.\n\nYou don't need a state-management library for every application.\n\nReact already gives you:\n\n```\nuseState\nuseReducer\nContext\n```\n\nUnderstanding these first is important because libraries like Zustand solve problems that appear when these basic tools become inconvenient.\n\n---\n\n## `useState`\n\n`useState` is the simplest form of state.\n\nFor example:\n\n```\nconst [count, setCount] = useState(0);\n```\n\nYou can update it:\n\n```\nsetCount(count + 1);\n```\n\nOr, when the new value depends on the previous value:\n\n```\nsetCount(current => current + 1);\n```\n\nThink of it as:\n\n```\nComponent\n  │\n  └── Local state\n       │\n       ├── count\n       ├── isLoading\n       └── isOpen\n```\n\n---\n\n## When `useState` is perfect\n\nSuppose you have a login screen:\n\n```\nLoginScreen\n├── email\n├── password\n└── showPassword\n```\n\nThese values probably belong directly to the screen.\n\nYou don't need a global store for:\n\n```\nisPasswordVisible\n```\n\nThere is no reason for your entire application to know whether this particular input is currently visible.\n\nSo:\n\n```\nconst [showPassword, setShowPassword] = useState(false);\n```\n\nis completely reasonable.\n\n---\n\n# Local state\n\n**Local state** means state owned by a particular component or screen.\n\nFor example:\n\n```\nProfileScreen\n   │\n   ├── isEditing\n   ├── draftName\n   └── selectedTab\n```\n\nAnother screen doesn't necessarily need access to these values.\n\nThat's a good situation for `useState`.\n\n---\n\n# Where `useState` starts becoming uncomfortable\n\nImagine this:\n\n```\nApp\n│\n├── Home\n│    └── ProductList\n│         └── ProductCard\n│              └── AddButton\n│\n└── Cart\n```\n\nThe cart state needs to be accessed by:\n\n```\nProductCard\nCartScreen\nHeader\nCheckoutScreen\n```\n\nYou might start passing:\n\n```\ncart\nsetCart\naddToCart\nremoveFromCart\n```\n\nthrough many components.\n\nThis is called **prop drilling**.\n\n---\n\n# What is prop drilling?\n\n**Prop drilling** means passing data through components that don't actually need the data, just so a deeper component can receive it.\n\nFor example:\n\n```\nApp\n↓\nHome\n↓\nProductList\n↓\nProductCard\n↓\nAddButton\n```\n\nMaybe only `AddButton` needs:\n\n```\naddToCart()\n```\n\nBut every component in between has to receive and forward it.\n\n```\nApp\n↓ addToCart\nHome\n↓ addToCart\nProductList\n↓ addToCart\nProductCard\n↓ addToCart\nAddButton\n```\n\nThat's prop drilling.\n\n---\n\n# `useReducer`\n\n`useReducer` is useful when state has more complicated transitions.\n\nInstead of:\n\n```\nsetName(...)\nsetEmail(...)\nsetPassword(...)\nsetError(...)\n```\n\nyou can describe actions:\n\n```\nSET_NAME\nSET_EMAIL\nSET_PASSWORD\nSUBMIT\nRESET\n```\n\nFor example:\n\n```\nconst [state, dispatch] = useReducer(reducer, initialState);\n```\n\nThen:\n\n```\ndispatch({\n type: \"SET_EMAIL\",\n email: \"hello@example.com\"\n});\n```\n\n---\n\n# What is a reducer?\n\nA **reducer** is a function that receives:\n\n```\ncurrent state\n+\naction\n```\n\nand returns:\n\n```\nnew state\n```\n\nConceptually:\n\n```\nCurrent State\n     +\n   Action\n     ↓\n  Reducer\n     ↓\nNew State\n```\n\nFor example:\n\n```\nfunction reducer(state, action) {\n switch (action.type) {\n   case \"INCREMENT\":\n     return {\n       ...state,\n       count: state.count + 1\n     };\n\n   default:\n     return state;\n }\n}\n```\n\n---\n\n# When is `useReducer` useful?\n\nIt can be useful when:\n\n- Many values change together\n- State transitions are complicated\n- You want explicit actions\n- You want state-update logic in one place\n\nBut `useReducer` doesn't automatically solve global state.\n\nIt's still normally tied to the component tree where the reducer is used.\n\n---\n\n# Context\n\nContext allows data to be made available to components further down the React tree without passing it manually through every component.\n\nFor example:\n\n```\nThemeProvider\n     │\n     ├── Home\n     ├── Profile\n     └── Settings\n```\n\nEvery child can access the theme.\n\n---\n\n# A simple Context example\n\n```\nconst ThemeContext = createContext(null);\n```\n\nThen:\n\n```\n<ThemeContext.Provider value={theme}>\n <App />\n</ThemeContext.Provider>\n```\n\nA child can access it:\n\n```\nconst theme = useContext(ThemeContext);\n```\n\n---\n\n# Context is useful, but it isn't automatically a state-management solution\n\nThis is an important distinction.\n\nContext answers:\n\n> \"How can I make this value available to many components?\"\n\nIt doesn't automatically answer:\n\n> \"How should I structure all of my application's state?\"\n\nYou can combine Context with state:\n\n```\nconst [user, setUser] = useState(null);\n\n<UserContext.Provider value={{ user, setUser }}>\n```\n\nBut as the application becomes large, this pattern can become difficult to organize.\n\n---",
      "diagram": "```\n            React State\n                │\n      ┌─────────┼─────────┐\n      │         │         │\n      ▼         ▼         ▼\n  useState   useReducer  Context\n      │         │         │\n      ▼         ▼         ▼\n   Simple     Complex    Shared\n    local     local      values\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- `useState` is great for local state.\n- `useReducer` helps organize complicated state transitions.\n- Context helps share values through the component tree.\n- None of these should automatically become your global-state solution.\n- Keep state local when only one screen or component needs it.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Making everything global\n\nA value isn't global just because it exists in your application.\n\n### ❌ Using Context for every piece of state\n\nContext is useful, but it can become difficult to manage when heavily used.\n\n### ❌ Reaching for a library too early\n\nStart by understanding the actual state-sharing problem.\n\n---"
      ],
      "quiz": [
        {
          "question": "Which is usually a good candidate for `useState`?",
          "options": [
            "A. Whether a password field is currently visible",
            "B. Every user's shopping cart in a large application",
            "C. All server data",
            "D. Every screen's state"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn15-2",
      "title": "Zustand — Simple Client State",
      "durationMinutes": 9,
      "explanation": "As applications grow, you often want a dedicated store for **client state**.\n\nOur track uses **Zustand** as the default choice for this.\n\nZustand is a small state-management library that lets you create a shared store without a lot of setup.\n\n---\n\n# What is client state?\n\n**Client state** is data that primarily belongs to your application.\n\nExamples:\n\n```\nSelected theme\nCurrent shopping cart\nUI preferences\nSelected filters\nDraft settings\nCurrently selected item\nAuthentication UI state\n```\n\nFor example:\n\n```\nCart\n├── items\n└── total\n```\n\nThat's application state.\n\n---\n\n# Creating a Zustand store\n\nA simple store might look like:\n\n```\nimport { create } from \"zustand\";\n\nconst useCartStore = create((set) => ({\n items: [],\n\n addItem: (item) =>\n   set((state) => ({\n     items: [...state.items, item],\n   })),\n\n removeItem: (id) =>\n   set((state) => ({\n     items: state.items.filter(item => item.id !== id),\n   })),\n}));\n```\n\nNow components can use it directly.\n\n```\nconst items = useCartStore(state => state.items);\n```\n\nAnother component can use:\n\n```\nconst addItem = useCartStore(state => state.addItem);\n```\n\nNo prop drilling is required.\n\n---\n\n# Before Zustand\n\nYou might have:\n\n```\nApp\n↓\nHome\n↓\nProducts\n↓\nProductCard\n↓\nAddButton\n```\n\nAnd:\n\n```\ncart\naddToCart\nremoveFromCart\n```\n\nbeing passed through everything.\n\n---\n\n# With Zustand\n\nYou can have:\n\n```\n            Zustand Store\n                 │\n       ┌─────────┼─────────┐\n       ▼         ▼         ▼\n    Header     Product     Cart\n                  │\n                  ▼\n               Button\n```\n\nEach component accesses the state it actually needs.\n\n---\n\n# Why Zustand is convenient\n\nOne reason developers like Zustand is that it has relatively little boilerplate.\n\n**Boilerplate** means repetitive code you have to write even though it doesn't contain much application logic.\n\nFor example, some state-management systems may require:\n\n```\nActions\nReducers\nProviders\nDispatchers\nSelectors\nStore configuration\n```\n\nZustand can often express the same idea more directly.\n\n---\n\n# Zustand can work outside React\n\nAnother useful feature is that the store isn't fundamentally tied to a React component.\n\nThat can be useful when non-component code needs to interact with shared client state.\n\nFor example:\n\n```\nNative event\n     ↓\nApplication logic\n     ↓\nZustand store\n     ↓\nReact UI\n```\n\n---\n\n# But don't put everything into Zustand\n\nThis is extremely important.\n\nSuppose your server gives you:\n\n```\n{\n \"id\": 123,\n \"name\": \"Laptop\",\n \"price\": 1000\n}\n```\n\nThat is generally **server state**.\n\nYou shouldn't automatically copy all server data into Zustand.\n\nInstead:\n\n```\nServer data\n    ↓\nTanStack Query\n```\n\nwhile:\n\n```\nApplication-owned state\n    ↓\nZustand\n```\n\n---\n\n# Client state vs server state\n\nThink about ownership.\n\n### Client state\n\nYour application owns it.\n\n```\nTheme\nCart\nModal state\nSelected filters\nDraft UI state\n```\n\n### Server state\n\nThe server owns it.\n\n```\nProducts\nUser profile\nOrders\nMessages\nNotifications\n```\n\nThe distinction is about **where the source of truth lives**.\n\nThe **source of truth** means the place that ultimately determines what the correct value is.\n\n---",
      "diagram": "```\n                Application Data\n                      │\n             ┌────────┴────────┐\n             │                 │\n             ▼                 ▼\n       Client State       Server State\n             │                 │\n             ▼                 ▼\n          Zustand        TanStack Query\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Zustand is useful for shared client state.\n- It reduces prop drilling.\n- It has relatively little boilerplate.\n- Components can subscribe to the state they need.\n- Don't use Zustand as a dumping ground for server data.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Putting API responses into Zustand automatically\n\nUse TanStack Query for server state.\n\n### ❌ Making every small piece of state global\n\nKeep truly local state local.\n\n### ❌ Creating one giant store\n\nOrganize state around meaningful application domains.\n\n---"
      ],
      "quiz": [
        {
          "question": "Which is a good example of client state?",
          "options": [
            "A. Whether a filter is currently selected",
            "B. A server's list of products",
            "C. A server's notification history",
            "D. A database table"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn15-3",
      "title": "Jotai and Redux Toolkit",
      "durationMinutes": 7,
      "explanation": "Zustand isn't the only state-management option.\n\nTwo other names you'll commonly encounter are:\n\n```\nJotai\nRedux Toolkit\n```\n\nYou don't need to use all of them.\n\nThe important thing is understanding why they exist.\n\n---\n\n# Jotai\n\nJotai uses an **atomic state model**.\n\nAn **atom** is a small independent piece of state.\n\nImagine your application has:\n\n```\nuserAtom\nthemeAtom\ncartAtom\nlanguageAtom\n```\n\nEach atom represents a small piece of state.\n\n```\n       Application\n            │\n    ┌───────┼────────┐\n    ▼       ▼        ▼\n  Atom    Atom      Atom\n  User    Theme     Cart\n```\n\nComponents can subscribe to the atoms they need.\n\n---\n\n# Why use atoms?\n\nImagine a large application with many independent pieces of state.\n\nInstead of thinking:\n\n```\nOne giant state object\n```\n\nyou can think:\n\n```\nMany small state units\n```\n\nThis can make certain state relationships easier to model.\n\n---\n\n# Redux Toolkit\n\nRedux has been widely used in large React applications.\n\n**Redux Toolkit (RTK)** is the recommended modern way of writing Redux.\n\nRedux provides a structured state-management architecture.\n\nA simplified model looks like:\n\n```\nComponent\n   ↓\nDispatch Action\n   ↓\nReducer\n   ↓\nStore\n   ↓\nComponent\n```\n\n---\n\n# Why would a large team choose Redux Toolkit?\n\nLarge teams sometimes value strong conventions.\n\n**Convention** means an agreed way of doing something across a project.\n\nFor example:\n\n```\nThis is how we create state\nThis is how we update state\nThis is where reducers go\nThis is how actions are named\n```\n\nThat structure can be valuable when many developers work on the same codebase.\n\n---\n\n# Zustand vs Jotai vs Redux Toolkit\n\nDon't think:\n\n> \"Which one is universally best?\"\n\nThink:\n\n> \"What problem does this application have?\"\n\nA simplified mental model:\n\n| Tool | Mental model |\n| --- | --- |\n| Zustand | Simple shared store |\n| Jotai | Small independent atoms |\n| Redux Toolkit | Structured large-scale state architecture |\n\nFor this learning track:\n\n```\nDefault client state → Zustand\n```\n\nBut you should recognize the other approaches when working on existing projects.\n\n---",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Jotai uses small atomic pieces of state.\n- Redux Toolkit provides a more structured state architecture.\n- Zustand is the default for this course.\n- Different teams can make different choices for valid reasons.\n- Learn the concepts rather than memorizing one library.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Thinking one library replaces all others\n\nDifferent applications have different requirements.\n\n### ❌ Choosing Redux just because the application is \"big\"\n\nSize isn't the only factor.\n\n### ❌ Choosing a library without understanding the state problem\n\nFirst identify the state problem.\n\n---"
      ],
      "quiz": [
        {
          "question": "What is an atom in Jotai?",
          "options": [
            "A. A small independent piece of state",
            "B. A database table",
            "C. A native UI component",
            "D. A network request"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn15-4",
      "title": "Server State vs Client State",
      "durationMinutes": 9,
      "explanation": "This is one of the most important concepts of Day 15.\n\nImagine your application displays:\n\n```\nProducts\n```\n\nWhere do those products come from?\n\nProbably:\n\n```\nYour backend server\n```\n\nThat means your server is the source of truth.\n\nThis is **server state**.\n\n---\n\n# Why server state is different\n\nServer data has problems that ordinary UI state doesn't.\n\nFor example:\n\n```\nIs the data loading?\nIs it stale?\nDid the request fail?\nShould we retry?\nWhen should we refetch?\nIs cached data available?\n```\n\nThese are server-state problems.\n\n---\n\n# Example\n\nSuppose:\n\n```\nProduct API\n   ↓\nGET /products\n   ↓\nReact Native\n```\n\nThe data might be:\n\n```\n[\n {\n   \"id\": 1,\n   \"name\": \"Laptop\"\n }\n]\n```\n\nYou could put this into Zustand.\n\nBut then you would need to build logic for:\n\n```\nLoading\nCaching\nRetries\nRefetching\nStale data\nError state\nBackground refresh\n```\n\nThat's a lot of infrastructure.\n\nTanStack Query is designed specifically for this problem.\n\n---\n\n# TanStack Query\n\nA simplified model is:\n\n```\n               Server\n                 │\n                 ▼\n          TanStack Query\n                 │\n       ┌─────────┼─────────┐\n       ▼         ▼         ▼\n     Cache    Loading     Error\n       │\n       ▼\n      UI\n```\n\n---\n\n# Hard separation\n\nFor this track, treat this separation deliberately:\n\n```\nClient state\n    ↓\nZustand\n```\n\nand:\n\n```\nServer state\n    ↓\nTanStack Query\n```\n\nThis isn't just a style preference.\n\nThese two kinds of state have different problems.\n\n---\n\n# Example: shopping app\n\nSuppose the user has:\n\n```\nCart\n```\n\nThe cart may be local application state.\n\n```\nZustand\n```\n\nThe available products:\n\n```\nProducts\n```\n\ncome from your backend.\n\n```\nTanStack Query\n```\n\nThe user's selected sort order:\n\n```\nSort: Price Low → High\n```\n\ncould be client state.\n\n```\nZustand or local state\n```\n\n---\n\n# What about authentication?\n\nAuthentication can contain multiple kinds of state.\n\nFor example:\n\n```\nAuthentication token\n    ↓\nSecure storage\n```\n\nwhile:\n\n```\nCurrent user profile\n    ↓\nServer state\n```\n\nand:\n\n```\nIs login modal open?\n    ↓\nClient/UI state\n```\n\nOne feature can therefore involve multiple state categories.\n\n---\n\n# Don't copy server data unnecessarily\n\nA common beginner pattern is:\n\n```\nAPI\n↓\nuseEffect\n↓\nsetState\n↓\nZustand\n```\n\nNow you've created another copy of server data.\n\nThat can lead to synchronization problems.\n\n**Synchronization** means keeping multiple copies of the same information consistent.\n\nFor example:\n\n```\nServer says:\nprice = 100\n\nZustand says:\nprice = 90\n```\n\nWhich one is correct?\n\nNow your application has a problem.\n\n---",
      "diagram": "```\n                   State\n                     │\n         ┌───────────┴───────────┐\n         │                       │\n         ▼                       ▼\n    Client State            Server State\n         │                       │\n         ▼                       ▼\n      Zustand              TanStack Query\n         │                       │\n         ▼                       ▼\n  UI preferences             API data\n  cart                       products\n  filters                    profile\n  UI state                   orders\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Server state and client state are different categories.\n- Server state belongs to a backend system.\n- Client state belongs to the application.\n- TanStack Query handles server-state problems.\n- Zustand handles shared client state.\n- Avoid unnecessary copies of server data.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Putting every API response into Zustand\n\nThis duplicates server state.\n\n### ❌ Treating server data like local UI state\n\nServer data needs caching and synchronization behavior.\n\n### ❌ Keeping two competing copies\n\nTry to maintain a clear source of truth.\n\n---"
      ],
      "quiz": [
        {
          "question": "Where should a product list fetched from your backend normally live?",
          "options": [
            "A. TanStack Query",
            "B. A modal's local state",
            "C. Theme state",
            "D. A random global variable"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn15-5",
      "title": "Global State vs Screen-Local State",
      "durationMinutes": 7,
      "explanation": "Not every shared-looking value needs to be global.\n\nThis is one of the most common mistakes beginners make.\n\nImagine a profile editing screen:\n\n```\nProfileEditScreen\n├── name\n├── bio\n├── avatar\n└── selectedTab\n```\n\nShould all of this go into Zustand?\n\nProbably not.\n\nIf the user leaves the screen without saving, the data may simply disappear.\n\nThat's perfectly fine.\n\n---\n\n# Local state\n\nUse local state when:\n\n```\nOnly one screen needs it\n```\n\nExamples:\n\n```\nisEditing\nisDropdownOpen\ntemporary search text\nselected local tab\ndraft form values\nanimation state\n```\n\n---\n\n# Global state\n\nGlobal state makes more sense when:\n\n```\nMultiple unrelated parts of the application need the same value\n```\n\nExamples:\n\n```\nShopping cart\nTheme preference\nGlobal UI preference\nSelected account\nApplication-wide settings\n```\n\n---\n\n# Ask one simple question\n\nBefore making state global, ask:\n\n> **\"Who actually needs this data?\"**\n\nIf the answer is:\n\n```\nOnly this component\n```\n\nkeep it local.\n\nIf:\n\n```\nSeveral screens\n```\n\nconsider shared state.\n\nIf:\n\n```\nThe server owns it\n```\n\nconsider TanStack Query.\n\n---\n\n# Example\n\nSuppose:\n\n```\nCheckoutScreen\n```\n\nhas:\n\n```\nisCouponInputOpen\n```\n\nThis probably belongs locally.\n\nBut:\n\n```\nCart items\n```\n\nmight be needed by:\n\n```\nHome\nCart\nCheckout\nHeader\n```\n\nThat could belong in Zustand.\n\nAnd:\n\n```\nAvailable coupons\n```\n\nmight come from your backend.\n\nThat belongs in server state.\n\n---",
      "diagram": "```\n               Where should state live?\n                        │\n            ┌───────────┼────────────┐\n            │           │            │\n            ▼           ▼            ▼\n       One screen    Many screens   Server\n            │           │            │\n            ▼           ▼            ▼\n         Local       Zustand      TanStack\n          state                     Query\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Start local.\n- Move state upward only when necessary.\n- Use shared state when multiple parts of the application genuinely need it.\n- Use server-state tools for server-owned data.\n- Global state should be intentional.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Making every state value global\n\nThis creates unnecessary complexity.\n\n### ❌ Passing state through ten components\n\nThat's a sign shared state might help.\n\n### ❌ Using global state to avoid thinking about architecture\n\nGlobal state is a tool, not a replacement for good structure.\n\n---"
      ],
      "quiz": [
        {
          "question": "Where should a dropdown's open/closed state usually live?",
          "options": [
            "A. Locally in the component using the dropdown",
            "B. In the global application store",
            "C. In the backend",
            "D. In TanStack Query"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    }
  ],
  "finalQuiz": [
    {
      "question": "Which is usually a good candidate for `useState`?",
      "options": [
        "A. Whether a password field is currently visible",
        "B. Every user's shopping cart in a large application",
        "C. All server data",
        "D. Every screen's state"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Which is a good example of client state?",
      "options": [
        "A. Whether a filter is currently selected",
        "B. A server's list of products",
        "C. A server's notification history",
        "D. A database table"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is an atom in Jotai?",
      "options": [
        "A. A small independent piece of state",
        "B. A database table",
        "C. A native UI component",
        "D. A network request"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Where should a product list fetched from your backend normally live?",
      "options": [
        "A. TanStack Query",
        "B. A modal's local state",
        "C. Theme state",
        "D. A random global variable"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Where should a dropdown's open/closed state usually live?",
      "options": [
        "A. Locally in the component using the dropdown",
        "B. In the global application store",
        "C. In the backend",
        "D. In TanStack Query"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Where should state used by only one screen usually live?",
      "options": [
        "A. In local screen state",
        "B. In every global store",
        "C. On the server only",
        "D. In navigation history"
      ],
      "correctIndex": 0,
      "explanation": "State needed by one screen should usually stay local to that screen."
    },
    {
      "question": "What problem does prop drilling describe?",
      "options": [
        "A. Passing data through components that do not need it",
        "B. Fetching server data",
        "C. Validating a form",
        "D. Rendering a FlatList"
      ],
      "correctIndex": 0,
      "explanation": "Prop drilling passes values through intermediate components only to reach a deeper consumer."
    },
    {
      "question": "What is Zustand mainly used for?",
      "options": [
        "A. Shared client state",
        "B. Server-side SQL",
        "C. Native animations",
        "D. File uploads"
      ],
      "correctIndex": 0,
      "explanation": "Zustand is a small state-management library for shared client state."
    },
    {
      "question": "Which tool is a better fit for cached API data?",
      "options": [
        "A. TanStack Query",
        "B. useState in every component",
        "C. StyleSheet",
        "D. Expo Router"
      ],
      "correctIndex": 0,
      "explanation": "TanStack Query manages server state, caching, refetching, and request status."
    },
    {
      "question": "What should you decide before choosing a state library?",
      "options": [
        "A. Who owns the state and who needs it",
        "B. The app icon color",
        "C. The Android package name",
        "D. The animation duration"
      ],
      "correctIndex": 0,
      "explanation": "State ownership and lifetime determine the appropriate state tool."
    }
  ],
  "project": {
    "name": "🛠️ Self-Check — Refactor Prop-Drilled State",
    "goal": "Complete the Day 15 self-check project.",
    "brief": "Your challenge today:\n\n> **Take a screen that passes `useState` through multiple components and refactor it so shared client state uses Zustand and server data uses TanStack Query.**\n\n---\n\n# Starting Point\n\nImagine you have:\n\n```\nApp\n↓\nHome\n↓\nProductList\n↓\nProductCard\n↓\nAddToCartButton\n```\n\nAnd the application does this:\n\n```\n<Home\n cart={cart}\n setCart={setCart}\n/>\n```\n\nThen:\n\n```\n<ProductList\n cart={cart}\n setCart={setCart}\n/>\n```\n\nThen:\n\n```\n<ProductCard\n cart={cart}\n setCart={setCart}\n/>\n```\n\nEventually:\n\n```\n<AddToCartButton\n cart={cart}\n setCart={setCart}\n/>\n```\n\nThis is prop drilling.\n\n---\n\n# Step 1 — Identify the state\n\nSeparate the data.\n\nAsk:\n\n```\nWhat does the client own?\nWhat does the server own?\nWhat only belongs to this screen?\n```\n\nFor example:\n\n```\nCart items\n→ Client state\n\nProducts\n→ Server state\n\nIs product details modal open?\n→ Local state\n```\n\n---\n\n# Step 2 — Move cart state to Zustand\n\nCreate:\n\n```\ncartStore\n```\n\nIt might contain:\n\n```\nitems\naddItem()\nremoveItem()\nclearCart()\n```\n\nNow your product button can access:\n\n```\nconst addItem = useCartStore(state => state.addItem);\n```\n\nNo prop drilling.\n\n---\n\n# Step 3 — Move products to TanStack Query\n\nInstead of:\n\n```\nfetch\n↓\nuseState\n↓\nuseEffect\n```\n\nuse a query:\n\n```\nuseQuery\n   ↓\nproducts\n   ↓\nUI\n```\n\nNow TanStack Query manages:\n\n```\nLoading\nCaching\nRefetching\nErrors\n```\n\n---\n\n# Step 4 — Keep local state local\n\nSuppose the product screen has:\n\n```\nisFilterOpen\n```\n\nDon't move it into Zustand just because you're already using Zustand.\n\nKeep:\n\n```\nconst [isFilterOpen, setIsFilterOpen] = useState(false);\n```\n\n---\n\n# Final Architecture\n\nYour application should look conceptually like this:\n\n```\n                   Application\n                        │\n         ┌──────────────┼──────────────┐\n         │              │              │\n         ▼              ▼              ▼\n     Local State    Client State    Server State\n         │              │              │\n         ▼              ▼              ▼\n     useState        Zustand       TanStack Query\n         │              │              │\n         ▼              ▼              ▼\n   Modal open       Cart items      Products\n   Filter open      Preferences     User profile\n   Draft UI         UI settings     Orders\n```\n\n---\n\n# 🎯 Done When\n\nYou should be able to explain:\n\n- Why `useState` is still useful.\n- What prop drilling means.\n- When `useReducer` makes sense.\n- What Context actually solves.\n- Why Zustand is useful for client state.\n- What Jotai's atom model means.\n- Why Redux Toolkit is useful in some large teams.\n- The difference between client state and server state.\n- Why TanStack Query should handle server state.\n- Why not every value belongs in global state.\n- Why screen-local state should stay local when possible.\n\n---",
    "steps": [],
    "acceptance": [],
    "footer": "# 🧠 Day 15 Mental Model\n\nWhen you see a piece of data, don't immediately ask:\n\n> \"Which state library should I use?\"\n\nAsk these questions instead:\n\n```\n            What kind of data is this?\n                      │\n         ┌────────────┼────────────┐\n         │            │            │\n         ▼            ▼            ▼\n      Local        Client       Server\n         │            │            │\n         ▼            ▼            ▼\n     useState       Zustand    TanStack Query\n         │\n         ▼\n  Only this screen?\n```\n\nThe most important lesson today is not Zustand.\n\nIt's **state ownership**.\n\nIf you know **who owns the data, who needs the data, and how long the data should live**, choosing the right state-management tool becomes much easier.\n\n---"
  }
});

