import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_43_LESSONS = normalizePastedLessonDay({
  "day": 43,
  "title": "Architecture at Scale",
  "overview": "### Goal\n\nBy the end of this day, you should be able to take a growing React Native feature and organize it so that:\n\n```text\nUI\n↓\nbusiness logic\n↓\ndata access\n```\n\nhave clear responsibilities.\n\nYou should also understand how to prevent one feature from becoming tightly coupled to another.",
  "totalMinutes": 60,
  "difficulty": "Advanced",
  "lessons": [
    {
      "id": "rn43-1",
      "title": "Why architecture becomes important",
      "durationMinutes": 4,
      "explanation": "A small application might look like:\n\n```text\nsrc/\n├── components/\n├── screens/\n├── hooks/\n└── utils/\n```\n\nThis can work initially.\n\nBut after a few years:\n\n```text\ncomponents/\n   187 files\n\nhooks/\n   94 files\n\nutils/\n   143 files\n\nservices/\n   78 files\n```\n\nNow you're asking:\n\n> \"Which files actually belong to the checkout feature?\"\n\nThat's where feature-based architecture becomes useful.",
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
      "id": "rn43-2",
      "title": "Layer-based structure",
      "durationMinutes": 4,
      "explanation": "A layer-based structure organizes code by technical type:\n\n```text\nsrc/\n├── components/\n├── hooks/\n├── services/\n├── utils/\n├── screens/\n└── types/\n```\n\nThis is easy to understand at first.\n\nBut a single feature becomes scattered:\n\n```text\nCheckout screen\n  ↓\nscreens/\n\nCheckout hook\n  ↓\nhooks/\n\nCheckout API\n  ↓\nservices/\n\nCheckout types\n  ↓\ntypes/\n```\n\nThe feature is spread across the entire project.",
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
      "id": "rn43-3",
      "title": "Feature-based structure",
      "durationMinutes": 4,
      "explanation": "Instead, organize around business features:\n\n```text\nsrc/\n├── features/\n│   ├── auth/\n│   ├── checkout/\n│   ├── profile/\n│   └── notifications/\n│\n├── shared/\n│   ├── components/\n│   ├── hooks/\n│   └── utils/\n│\n└── app/\n```\n\nNow:\n\n```text\nfeatures/checkout/\n```\n\ncontains the code related to checkout.\n\nFor example:\n\n```text\ncheckout/\n├── components/\n├── hooks/\n├── services/\n├── types/\n├── utils/\n└── screens/\n```",
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
      "id": "rn43-4",
      "title": "Feature boundaries",
      "durationMinutes": 3,
      "explanation": "A feature boundary means:\n\n> **Other parts of the application shouldn't randomly reach inside another feature's private implementation.**\n\nFor example:\n\n```text\nprofile/\n internal/\n components/\n service.ts\n index.ts\n```\n\nOther features should ideally consume the public API:\n\n```ts\nimport { getProfile } from \"@/features/profile\";\n```\n\nrather than:\n\n```ts\nimport { parseProfileResponse } from \"@/features/profile/internal/parsers\";\n```\n\nThe second approach creates coupling (one module becoming dependent on another module's internal details).",
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
      "id": "rn43-5",
      "title": "Public API of a feature",
      "durationMinutes": 3,
      "explanation": "You can use an `index.ts` as the feature's public boundary.\n\nFor example:\n\n```ts\n// features/cart/index.ts\n\nexport {\n useCart,\n calculateCartTotal,\n} from \"./public\";\n```\n\nThen:\n\n```ts\nimport {\n useCart,\n calculateCartTotal,\n} from \"@/features/cart\";\n```\n\nInstead of allowing every internal file to become public.",
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
      "id": "rn43-6",
      "title": "Dependency direction",
      "durationMinutes": 3,
      "explanation": "A healthy architecture often looks like:\n\n```text\nUI\n↓\nApplication logic\n↓\nDomain/business logic\n↓\nInfrastructure\n```\n\nFor example:\n\n```text\nCheckoutScreen\n     ↓\nuseCheckout()\n     ↓\nCheckoutService\n     ↓\nPayment API\n```\n\nThe screen shouldn't contain the entire payment system.",
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
      "id": "rn43-7",
      "title": "Dependency injection without a framework",
      "durationMinutes": 3,
      "explanation": "**Dependency injection** means:\n\n> Instead of creating a dependency inside a function, give the function the dependency it needs.\n\nFor example, this is tightly coupled:\n\n```ts\nfunction createOrder(order: Order) {\n const api = new ApiClient();\n\n return api.post(\"/orders\", order);\n}\n```\n\nThe function decides which API client to use.\n\nInstead:\n\n```ts\nfunction createOrder(\n api: ApiClient,\n order: Order,\n) {\n return api.post(\"/orders\", order);\n}\n```\n\nNow the dependency is injected.\n\n```text\ncreateOrder\n   ↑\n   │\nApiClient\n```",
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
      "id": "rn43-8",
      "title": "Why dependency injection helps testing",
      "durationMinutes": 3,
      "explanation": "Suppose you have:\n\n```ts\ncreateOrder(api, order)\n```\n\nIn production:\n\n```ts\ncreateOrder(realApi, order)\n```\n\nIn a test:\n\n```ts\ncreateOrder(fakeApi, order)\n```\n\nYou don't need:\n\n```text\nreal network\nreal server\nreal authentication\n```\n\nYour test can simply provide a fake dependency.",
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
      "id": "rn43-9",
      "title": "Dependency injection doesn't require a huge framework",
      "durationMinutes": 3,
      "explanation": "You don't need a massive dependency-injection container.\n\nOften this is enough:\n\n```ts\nexport function createCheckoutService(\n paymentClient: PaymentClient,\n) {\n return {\n   async checkout(cart: Cart) {\n     return paymentClient.charge(cart.total);\n   },\n };\n}\n```\n\nProduction:\n\n```ts\nconst service = createCheckoutService(realPaymentClient);\n```\n\nTest:\n\n```ts\nconst service = createCheckoutService(fakePaymentClient);\n```\n\nSimple.\n\nExplicit.\n\nEasy to understand.",
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
      "id": "rn43-10",
      "title": "Module boundaries in a monorepo",
      "durationMinutes": 3,
      "explanation": "Now combine Day 42 and Day 43.\n\nSuppose your monorepo contains:\n\n```text\napps/\n mobile/\n web/\n\npackages/\n auth/\n payments/\n design-system/\n api/\n```\n\nYou don't want:\n\n```text\npayments\n  ↓\nrandomly imports\n  ↓\nmobile UI\n```\n\nbecause now your supposedly shared package depends on a specific application.\n\nA better dependency direction might be:\n\n```text\napps\n↓\nfeatures\n↓\nshared packages\n↓\nplatform adapters\n```\n\nThe exact architecture can differ, but the key principle is:\n\n> **Dependencies should have an intentional direction.**",
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
      "id": "rn43-11",
      "title": "Business logic should not live inside components",
      "durationMinutes": 3,
      "explanation": "This is one of the most important lessons in this day.\n\nBad:\n\n```tsx\nfunction CheckoutScreen() {\n const [loading, setLoading] = useState(false);\n\n async function handleCheckout() {\n   setLoading(true);\n\n   // validate cart\n\n   // calculate discount\n\n   // call payment API\n\n   // handle response\n\n   // save order\n\n   // navigate\n\n   setLoading(false);\n }\n\n return (...);\n}\n```\n\nNow testing checkout logic requires rendering the screen.\n\nThat's unnecessary.",
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
      "id": "rn43-12",
      "title": "Extract the core logic",
      "durationMinutes": 3,
      "explanation": "Instead:\n\n```ts\nexport async function checkout(\n dependencies: CheckoutDependencies,\n cart: Cart,\n) {\n validateCart(cart);\n\n const total = calculateTotal(cart);\n\n const payment = await dependencies.payment.charge(total);\n\n return dependencies.orders.create({\n   cart,\n   paymentId: payment.id,\n });\n}\n```\n\nNow the function doesn't care about:\n\n```text\nReact\nView\nText\nnavigation\nrendering\n```\n\nIt only cares about business logic.",
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
      "id": "rn43-13",
      "title": "Testing without React rendering",
      "durationMinutes": 3,
      "explanation": "Now you can write:\n\n```ts\ntest(\"calculates the checkout total\", () => {\n const total = calculateTotal([\n   { price: 20, quantity: 2 },\n   { price: 10, quantity: 1 },\n ]);\n\n expect(total).toBe(50);\n});\n```\n\nNo:\n\n```text\nrender()\nscreen\nfireEvent()\n```\n\nrequired.\n\nThat's a **unit test** (a test of one isolated piece of logic).",
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
      "id": "rn43-14",
      "title": "Components become thinner",
      "durationMinutes": 3,
      "explanation": "After extracting business logic:\n\n```tsx\nfunction CheckoutScreen() {\n const checkout = useCheckout();\n\n return (\n   <CheckoutView\n     loading={checkout.loading}\n     onSubmit={checkout.submit}\n   />\n );\n}\n```\n\nNow the component mostly handles:\n\n```text\nrendering\nuser interaction\ndisplay state\n```\n\nwhile the business layer handles:\n\n```text\nvalidation\ncalculations\nAPI calls\nbusiness rules\n```",
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
      "id": "rn43-15",
      "title": "Multi-environment builds",
      "durationMinutes": 3,
      "explanation": "You've already learned:\n\n```text\ndev\nstaging\nproduction\n```\n\nNow treat these as **build configurations**, not just runtime flags.\n\nA weak approach is:\n\n```ts\nif (ENV === \"production\") {\n // production behavior\n}\n```\n\neverywhere.\n\nThis spreads environment knowledge throughout your application.\n\nInstead, define environment-specific configuration at the boundary.\n\nConceptually:\n\n```text\nDevelopment build\n     ↓\nDevelopment configuration\n     ↓\nDevelopment API\n\nStaging build\n     ↓\nStaging configuration\n     ↓\nStaging API\n\nProduction build\n     ↓\nProduction configuration\n     ↓\nProduction API\n```",
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
      "id": "rn43-16",
      "title": "Why build variants matter",
      "durationMinutes": 3,
      "explanation": "Suppose you accidentally install a staging application and it looks exactly like production.\n\nYou might think:\n\n```text\n\"I am using production.\"\n```\n\nbut it actually points to:\n\n```text\nstaging-api\n```\n\nA useful strategy is to make environments visually and technically distinguishable.\n\nFor example:\n\n```text\nDevelopment\nApp name: MyApp Dev\n\nStaging\nApp name: MyApp Staging\n\nProduction\nApp name: MyApp\n```\n\nYou can also use:\n\n```text\ndifferent bundle/application identifiers\ndifferent icons\ndifferent API endpoints\ndifferent logging configuration\n```\n\ndepending on your release setup.",
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
      "id": "rn43-17",
      "title": "Runtime flags vs build configuration",
      "durationMinutes": 3,
      "explanation": "Runtime configuration can still be useful.\n\nBut don't make your application carry every possible environment configuration and decide everything dynamically.\n\nPrefer:\n\n```text\nBuild\n↓\nEnvironment-specific configuration\n↓\nApplication\n```\n\nrather than:\n\n```text\nOne giant build\n↓\n20 runtime switches\n↓\n\"Hopefully we selected production.\"\n```\n\nThis reduces accidental configuration mistakes.",
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
      "id": "rn43-18",
      "title": "Architecture at scale mental model",
      "durationMinutes": 3,
      "explanation": "A feature should ideally look something like:\n\n```text\nfeatures/checkout/\n│\n├── components/\n│      ↓\n│    UI\n│\n├── hooks/\n│      ↓\n│    React integration\n│\n├── domain/\n│      ↓\n│    Business rules\n│\n├── services/\n│      ↓\n│    External operations\n│\n├── types/\n│      ↓\n│    Feature types\n│\n└── index.ts\n      ↓\n  public API\n```\n\nThen:\n\n```text\nCheckoutScreen\n     ↓\nuseCheckout()\n     ↓\ncheckout business logic\n     ↓\nPaymentClient\n     ↓\nAPI\n```\n\nThe exact folder names are less important than the **separation of responsibilities**.",
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
      "id": "rn43-19",
      "title": "What you should avoid",
      "durationMinutes": 3,
      "explanation": "Don't create architecture just to make the repository look sophisticated.\n\nFor example:\n\n```text\ndomain/\napplication/\ninfrastructure/\nports/\nadapters/\nfactories/\nproviders/\nrepositories/\nmappers/\nfacades/\n```\n\nfor a tiny feature can make the code harder to understand.\n\nArchitecture should solve an actual problem:\n\n```text\nlarge feature\nmultiple platforms\nmultiple teams\ntesting difficulty\ndependency coupling\nmultiple environments\n```\n\nnot exist because \"senior developers use this.\"",
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
      "question": "Why does architecture become more important as an application grows?",
      "options": [
        "A. More features, teams, dependencies, and environments increase coupling and change risk",
        "B. React stops rendering",
        "C. TypeScript no longer works",
        "D. Native builds disappear"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is a limitation of a purely layer-based structure?",
      "options": [
        "A. One feature can be scattered across many distant folders",
        "B. It cannot contain API files",
        "C. It prevents tests",
        "D. It removes navigation"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does feature-based structure group together?",
      "options": [
        "A. The UI, logic, data access, and tests belonging to one feature",
        "B. All hooks globally",
        "C. All screens only",
        "D. All platform files"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is a feature boundary?",
      "options": [
        "A. A clear limit around what a feature owns and exposes",
        "B. A store submission step",
        "C. A device permission",
        "D. A build number"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should a feature's public API expose?",
      "options": [
        "A. Only the supported entry points other modules need",
        "B. Every internal file",
        "C. Private implementation details",
        "D. All dependencies"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does dependency direction describe?",
      "options": [
        "A. Which modules are allowed to depend on which other modules",
        "B. The navigation animation",
        "C. The release channel",
        "D. The screen-reader order"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is dependency injection?",
      "options": [
        "A. Providing required dependencies from outside the core logic",
        "B. Importing every service globally",
        "C. Creating native views",
        "D. Publishing packages"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why does dependency injection improve testing?",
      "options": [
        "A. Tests can provide controlled fake dependencies",
        "B. It removes assertions",
        "C. It requires real APIs",
        "D. It disables TypeScript"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Where should important business rules live?",
      "options": [
        "A. In testable core logic outside React components",
        "B. Inside JSX event handlers only",
        "C. Inside route strings",
        "D. Inside build profiles"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What are runtime flags best suited for?",
      "options": [
        "A. Behavior that can change safely without producing a different binary",
        "B. Native capabilities missing from the binary",
        "C. Signing identities",
        "D. Package names"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "Architecture at Scale Self-check",
    "goal": "\"If I removed React from this file, how much of the actual business logic would still exist?\"",
    "brief": "Choose one real feature from your application.\n\nFor example:\n\n```text\nAuthentication\nCheckout\nProfile\nNotifications\n```\n\nStart with something like:\n\n```text\nFeature screen\n    ↓\n300 lines of code\n    ↓\nAPI\n    ↓\nvalidation\n    ↓\nbusiness rules\n```\n\nRefactor it so the core logic can be tested without React.\n\nYour final architecture should look roughly like:\n\n```text\n                Feature\n                   │\n         ┌─────────┴─────────┐\n         ↓                   ↓\n       React              Core logic\n         ↓                   ↓\n      UI/hooks          business rules\n                             ↓\n                        dependencies\n                             ↓\n                            API\n```\n\nThen write a unit test that runs:\n\n```text\nwithout:\n❌ React rendering\n❌ React Native components\n❌ navigation\n❌ real API\n❌ real device\n```\n\nbut still tests the important business behavior.\n\n### The real milestone for Day 43\n\nYou should be able to look at a component and ask:\n\n> **\"If I removed React from this file, how much of the actual business logic would still exist?\"**\n\nIf the answer is **almost none**, the feature probably has too much business logic inside the UI.\n\nIf the answer is:\n\n```text\n\"Most of the important rules are already independent.\"\n```\n\nyou are moving toward the architecture expected in a large production application.",
    "steps": [],
    "acceptance": [
      "Choose one real application feature.",
      "Separate React UI from business rules.",
      "Inject external dependencies into the core logic.",
      "Test the important behavior without React, navigation, a real API, or a device.",
      "Explain the feature boundary and dependency direction."
    ]
  }
});

