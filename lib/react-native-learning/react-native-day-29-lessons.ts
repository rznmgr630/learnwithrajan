import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_29_LESSONS = normalizePastedLessonDay({
  "day": 29,
  "title": "Testing",
  "overview": "**Goal:** By the end of this day, you should be able to write a basic component test, test a screen with navigation, mock native/Expo dependencies, and create a real-device E2E flow with Maestro.",
  "totalMinutes": 60,
  "difficulty": "Beginner → Intermediate",
  "lessons": [
    {
      "id": "rn29-1",
      "title": "Why do we test a React Native app?",
      "durationMinutes": 3,
      "explanation": "Before learning Jest or Maestro, let's understand why testing exists.\n\nImagine you have a login screen:\n\n```text\nEmail\n[________________]\n\nPassword\n[________________]\n\n[ Login ]\n```\n\nA user enters:\n\n```text\nemail = rajan@example.com\npassword = secret123\n```\n\nand presses **Login**.\n\nYour application should:\n\n1. Validate the input.\n2. Call the login API.\n3. Show a loading state.\n4. Handle success.\n5. Navigate to Home.\n6. Handle an error correctly.\n\nYou could manually test all of this every time you change the code.\n\nBut that becomes painful.\n\nTesting lets your computer repeatedly check these behaviors for you.\n\n```text\nYou change code\n     |\n     v\nRun tests\n     |\n     +---- pass ----> behavior still works\n     |\n     +---- fail ----> investigate regression\n```\n\nA **regression** means something that used to work has stopped working after a change.\n\n### The important idea\n\nDon't think:\n\n> \"I need tests because testing is required.\"\n\nThink:\n\n> \"I need tests so that I can change my code without being afraid that I broke something.\"",
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
      "id": "rn29-2",
      "title": "Jest — the default test runner",
      "durationMinutes": 3,
      "explanation": "**Jest** is the test runner we use to execute JavaScript and TypeScript tests.\n\nIt gives us things like:\n\n```text\ntest()\nexpect()\ndescribe()\nbeforeEach()\nafterEach()\nmock functions\n```\n\nA very simple test looks like this:\n\n```tsx\ntest(\"2 + 2 equals 4\", () => {\n expect(2 + 2).toBe(4);\n});\n```\n\nRun:\n\n```bash\nnpm test\n```\n\nor whatever test script your project defines.\n\nThe important thing is that Jest runs your test and tells you whether it passed or failed.",
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
      "id": "rn29-3",
      "title": "`expect()` and matchers",
      "durationMinutes": 3,
      "explanation": "Jest uses **matchers** to describe what you expect.\n\nFor example:\n\n```tsx\nexpect(2 + 2).toBe(4);\n```\n\nSome useful matchers are:\n\n```tsx\nexpect(value).toBe(expected);\n\nexpect(value).toEqual(expected);\n\nexpect(value).toBeTruthy();\n\nexpect(value).toBeFalsy();\n\nexpect(value).toBeNull();\n\nexpect(array).toContain(\"React\");\n\nexpect(text).toMatch(/hello/i);\n```\n\nFor example:\n\n```tsx\ntest(\"user has the correct name\", () => {\n const user = {\n   name: \"Rajan\",\n   role: \"Software Engineer\",\n };\n\n expect(user.name).toBe(\"Rajan\");\n expect(user).toEqual({\n   name: \"Rajan\",\n   role: \"Software Engineer\",\n });\n});\n```\n\n### `toBe()` vs `toEqual()`\n\nThis is something beginners often find confusing.\n\n```tsx\nexpect(10).toBe(10);\n```\n\nworks because primitive values can be compared directly.\n\nFor objects:\n\n```tsx\nexpect({ name: \"Rajan\" }).toEqual({\n name: \"Rajan\",\n});\n```\n\n`toEqual()` checks the object's contents.",
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
      "id": "rn29-4",
      "title": "Testing a React Native component",
      "durationMinutes": 3,
      "explanation": "Now let's test an actual component.\n\nSuppose we have:\n\n```tsx\nfunction Welcome({ name }: { name: string }) {\n return <Text>Welcome, {name}!</Text>;\n}\n```\n\nWe want to check what the user actually sees.\n\nThis is where **React Native Testing Library** comes in.",
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
      "id": "rn29-5",
      "title": "React Native Testing Library",
      "durationMinutes": 2,
      "explanation": "React Native Testing Library, usually called **RNTL**, helps us render React Native components in tests and interact with them like a user would.\n\nThe important philosophy is:\n\n> Test what the user can see and do, not how your component is internally implemented.\n\nFor example, don't write a test that depends on:\n\n```text\ninternal state variable = true\n```\n\nInstead, test:\n\n```text\nbutton appears\nuser presses button\nmessage appears\n```\n\nThat's much closer to how a real user interacts with the application.",
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
      "id": "rn29-6",
      "title": "Your first component test",
      "durationMinutes": 2,
      "explanation": "Component:\n\n```tsx\nimport { Text } from \"react-native\";\n\nexport function Welcome({ name }: { name: string }) {\n return <Text>Welcome, {name}!</Text>;\n}\n```\n\nTest:\n\n```tsx\nimport { render, screen } from \"@testing-library/react-native\";\nimport { Welcome } from \"./Welcome\";\n\ntest(\"shows the user's name\", () => {\n render(<Welcome name=\"Rajan\" />);\n\n expect(\n   screen.getByText(\"Welcome, Rajan!\")\n ).toBeTruthy();\n});\n```\n\nLet's break this down.\n\n### `render()`\n\n```tsx\nrender(<Welcome name=\"Rajan\" />);\n```\n\nThis renders the component in the test environment.\n\n### `screen`\n\n```tsx\nscreen.getByText(...)\n```\n\nlets us search for something the user can see.\n\n### `getByText()`\n\n```tsx\nscreen.getByText(\"Welcome, Rajan!\");\n```\n\nmeans:\n\n> Find the text the user should see.",
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
      "id": "rn29-7",
      "title": "Testing user interactions",
      "durationMinutes": 2,
      "explanation": "Testing becomes more useful when we test interaction.\n\nSuppose we have:\n\n```tsx\nfunction Counter() {\n const [count, setCount] = useState(0);\n\n return (\n   <>\n     <Text>Count: {count}</Text>\n\n     <Pressable\n       onPress={() => setCount((value) => value + 1)}\n     >\n       <Text>Increase</Text>\n     </Pressable>\n   </>\n );\n}\n```\n\nTest:\n\n```tsx\nimport {\n render,\n screen,\n fireEvent,\n} from \"@testing-library/react-native\";\n\ntest(\"increases the count\", () => {\n render(<Counter />);\n\n expect(screen.getByText(\"Count: 0\")).toBeTruthy();\n\n fireEvent.press(\n   screen.getByText(\"Increase\")\n );\n\n expect(screen.getByText(\"Count: 1\")).toBeTruthy();\n});\n```\n\nNotice what we **didn't** test.\n\nWe didn't test:\n\n```text\nsetCount()\nuseState()\ninternal state variable\n```\n\nWe tested:\n\n```text\nUser sees Count: 0\n       |\nUser presses Increase\n       |\nUser sees Count: 1\n```\n\nThat's the testing philosophy you should remember.",
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
      "id": "rn29-8",
      "title": "Queries — finding elements",
      "durationMinutes": 2,
      "explanation": "RNTL provides different ways to find elements.\n\nCommon ones include:\n\n```tsx\nscreen.getByText()\n\nscreen.getByRole()\n\nscreen.getByLabelText()\n\nscreen.getByTestId()\n\nscreen.queryByText()\n\nscreen.findByText()\n```\n\nThe important difference is when they are useful.\n\n### `getBy...`\n\nUse when the element should already exist.\n\n```tsx\nscreen.getByText(\"Login\");\n```\n\nIf it doesn't exist, the test fails.\n\n### `queryBy...`\n\nUseful when checking that something does **not** exist.\n\n```tsx\nexpect(\n screen.queryByText(\"Error\")\n).toBeNull();\n```\n\n### `findBy...`\n\nUseful for asynchronous UI.\n\n```tsx\nexpect(\n await screen.findByText(\"Welcome\")\n).toBeTruthy();\n```\n\nThe important beginner rule:\n\n> Prefer queries that represent how the user identifies something.\n\nFor example, a button with an accessible role is generally better to test by its role/name than by an implementation-specific test ID.",
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
      "id": "rn29-9",
      "title": "`userEvent` vs `fireEvent`",
      "durationMinutes": 2,
      "explanation": "You will see both.\n\n`fireEvent` lets you trigger an event directly:\n\n```tsx\nfireEvent.press(button);\n```\n\n`userEvent` provides higher-level user interactions.\n\nConceptually:\n\n```text\nfireEvent\n  |\n  +-- directly fires an event\n\nuserEvent\n  |\n  +-- models a more realistic user interaction\n```\n\nFor example:\n\n```tsx\nconst user = userEvent.setup();\n\nawait user.press(\n screen.getByRole(\"button\", {\n   name: \"Login\",\n })\n);\n```\n\nFor modern tests, prefer user-oriented interactions when the library supports the interaction you need.",
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
      "id": "rn29-10",
      "title": "Testing forms",
      "durationMinutes": 2,
      "explanation": "Imagine:\n\n```tsx\n<TextInput\n placeholder=\"Email\"\n value={email}\n onChangeText={setEmail}\n/>\n\n<Pressable onPress={handleLogin}>\n <Text>Login</Text>\n</Pressable>\n```\n\nA useful test checks the behavior:\n\n```tsx\ntest(\"allows the user to enter an email\", async () => {\n const user = userEvent.setup();\n\n render(<LoginForm />);\n\n const input = screen.getByPlaceholderText(\"Email\");\n\n await user.type(input, \"rajan@example.com\");\n\n expect(input).toHaveDisplayValue(\n   \"rajan@example.com\"\n );\n});\n```\n\nThe exact matcher/API can vary with the RNTL version, so always check the version used by your project.",
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
      "id": "rn29-11",
      "title": "Mocking — why do we need it?",
      "durationMinutes": 2,
      "explanation": "This is one of the most important testing concepts.\n\nImagine your component uses:\n\n```tsx\nimport * as SecureStore from \"expo-secure-store\";\n```\n\nand does:\n\n```tsx\nawait SecureStore.getItemAsync(\"token\");\n```\n\nDuring a unit/component test, you may not want to access the actual device secure-storage implementation.\n\nInstead, you can replace it with a **mock**.\n\nA mock is a fake implementation used during testing.\n\n```text\nReal application\n\nComponent\n   |\n   v\nSecureStore\n   |\n   v\nDevice storage\n\n\nTest\n\nComponent\n   |\n   v\nMock SecureStore\n   |\n   v\nFake result\n```\n\nThis makes the test predictable.",
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
      "id": "rn29-12",
      "title": "Jest mocks",
      "durationMinutes": 2,
      "explanation": "A simple mock function:\n\n```tsx\nconst login = jest.fn();\n```\n\nNow we can check whether it was called:\n\n```tsx\nexpect(login).toHaveBeenCalled();\n```\n\nWe can also provide a fake result:\n\n```tsx\nconst getToken = jest\n .fn()\n .mockResolvedValue(\"fake-token\");\n```\n\nOr an error:\n\n```tsx\nconst getToken = jest\n .fn()\n .mockRejectedValue(\n   new Error(\"Storage failed\")\n );\n```\n\nThis allows us to test different situations without depending on the real external system.",
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
      "id": "rn29-13",
      "title": "Mocking Expo modules and native modules",
      "durationMinutes": 2,
      "explanation": "React Native applications often use things that don't behave like normal JavaScript functions:\n\n```text\nCamera\nNotifications\nSecureStore\nLocation\nBiometrics\nClipboard\nNative modules\nDevice APIs\n```\n\nTesting these directly can be difficult.\n\nSo we mock them.\n\nFor example:\n\n```tsx\njest.mock(\"expo-secure-store\", () => ({\n getItemAsync: jest.fn(),\n setItemAsync: jest.fn(),\n deleteItemAsync: jest.fn(),\n}));\n```\n\nThen:\n\n```tsx\nimport * as SecureStore from \"expo-secure-store\";\n\nconst mockedGetItem =\n jest.mocked(SecureStore.getItemAsync);\n\nmockedGetItem.mockResolvedValue(\"fake-token\");\n```\n\nNow your test controls the result.\n\n### Important rule\n\nDon't mock everything.\n\nIf you mock every function in your application, you may end up testing your mocks instead of your application.\n\nMock external boundaries when necessary.",
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
      "id": "rn29-14",
      "title": "Testing API calls",
      "durationMinutes": 2,
      "explanation": "Suppose:\n\n```tsx\nasync function login(email: string) {\n return api.post(\"/login\", {\n   email,\n });\n}\n```\n\nYou don't want every component test to call the real production API.\n\nInstead:\n\n```text\nComponent\n   |\n   v\nAPI client\n   |\n   X\nreal network\n\n      instead\n\nAPI mock\n   |\n   v\ncontrolled response\n```\n\nYou can test:\n\n```text\nsuccessful request\nfailed request\nloading state\nempty response\nserver error\ntimeout\n```\n\nThis is much more valuable than simply testing that `fetch()` exists.",
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
      "id": "rn29-15",
      "title": "Component tests vs integration tests",
      "durationMinutes": 2,
      "explanation": "These are different levels.\n\n### Component test\n\nUsually focuses on one component.\n\n```text\nButton\n  |\n  v\npress\n  |\n  v\ncallback\n```\n\n### Integration test\n\nCombines multiple parts.\n\nFor example:\n\n```text\nLogin Screen\n    |\n    +-- TextInput\n    +-- Button\n    +-- API mock\n    +-- navigation\n    |\n    v\nHome Screen\n```\n\nThe test checks that the pieces work together.\n\nThis is closer to a real application flow.",
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
      "id": "rn29-16",
      "title": "Testing navigation",
      "durationMinutes": 2,
      "explanation": "Suppose:\n\n```text\nLogin\n |\n | press Login\n v\nHome\n```\n\nA useful integration test should check the behavior.\n\n```tsx\ntest(\"navigates to home after login\", async () => {\n const user = userEvent.setup();\n\n render(<LoginScreen />);\n\n await user.type(\n   screen.getByPlaceholderText(\"Email\"),\n   \"rajan@example.com\"\n );\n\n await user.type(\n   screen.getByPlaceholderText(\"Password\"),\n   \"password\"\n );\n\n await user.press(\n   screen.getByRole(\"button\", {\n     name: \"Login\",\n   })\n );\n\n expect(\n   await screen.findByText(\"Home\")\n ).toBeTruthy();\n});\n```\n\nThe exact navigation setup depends on whether the project uses Expo Router or direct React Navigation.\n\nThe important thing is to test:\n\n```text\nuser action\n     |\n     v\napplication behavior\n     |\n     v\nnew screen\n```\n\nrather than checking internal navigation function calls.",
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
      "id": "rn29-17",
      "title": "Testing navigation with Expo Router",
      "durationMinutes": 2,
      "explanation": "If the project uses Expo Router, your tests need to account for the router environment.\n\nConceptually:\n\n```text\nTest\n|\n+-- Router environment\n|\n+-- Login screen\n|\n+-- mocked API\n|\nv\nNavigation\n|\nv\nHome screen\n```\n\nYou should learn how your project's Expo Router version exposes its testing helpers and use those rather than inventing a custom navigation mock for every test.\n\nThe key idea is:\n\n> Test the route behavior, not the internal router implementation.",
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
      "id": "rn29-18",
      "title": "Detox vs Maestro",
      "durationMinutes": 2,
      "explanation": "Component and integration tests are not enough.\n\nSometimes you want to test the actual application running on a simulator or device.\n\nThat's where **end-to-end testing** comes in.\n\nTwo important tools are:\n\n```text\nDetox\nMaestro\n```\n\n### Detox\n\nDetox is designed for React Native end-to-end testing and integrates closely with the application and native build process.\n\nConceptually:\n\n```text\nTest\n|\nv\nDetox\n|\nv\nRN application\n|\nv\niOS / Android simulator\n```\n\n### Maestro\n\nMaestro lets you describe user flows in YAML.\n\nFor example:\n\n```yaml\nappId: com.example.app\n\n---\n- launchApp\n- tapOn: \"Login\"\n- tapOn: \"Email\"\n- inputText: \"rajan@example.com\"\n- tapOn: \"Password\"\n- inputText: \"password\"\n- tapOn: \"Login\"\n- assertVisible: \"Home\"\n```\n\nThis is very readable.\n\nYou can almost read it like a manual test:\n\n```text\nLaunch app\n↓\nTap Login\n↓\nEnter email\n↓\nEnter password\n↓\nTap Login\n↓\nCheck Home is visible\n```",
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
      "id": "rn29-19",
      "title": "Detox vs Maestro — when would you use each?",
      "durationMinutes": 2,
      "explanation": "Don't think:\n\n> \"Which one is universally better?\"\n\nInstead understand the difference.\n\n|                | Detox                         | Maestro                           |\n| -------------- | ----------------------------- | --------------------------------- |\n| Main idea      | Programmatic E2E testing      | Flow-based E2E testing            |\n| Tests          | JavaScript/TypeScript         | YAML flows                        |\n| RN integration | Deep                          | More black-box/user-flow oriented |\n| Readability    | Developer-focused             | Very readable                     |\n| Setup          | Can be more involved          | Generally simple flow authoring   |\n| Good for       | Complex automated test suites | User journeys and smoke tests     |\n\nFor this learning track, learning **Maestro first** gives you a very approachable way to understand real-device E2E flows.\n\nYou should still understand Detox because many React Native teams use it.",
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
      "id": "rn29-20",
      "title": "Testing on simulators and real devices",
      "durationMinutes": 2,
      "explanation": "An E2E test is much closer to the real application:\n\n```text\nTest\n|\nv\nApplication\n|\nv\nNative platform\n|\nv\nSimulator/device\n```\n\nThis means it can catch problems that component tests cannot.\n\nFor example:\n\n```text\npermissions\ndeep links\nkeyboard behavior\nnative navigation\ndevice APIs\nactual startup\nnative rendering\n```\n\nBut E2E tests are slower.\n\nThat's why we don't replace every unit/component test with E2E tests.",
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
      "id": "rn29-21",
      "title": "The testing pyramid",
      "durationMinutes": 2,
      "explanation": "A useful mental model is:\n\n```text\n            /\\\n           /  \\\n          / E2E\\\n         /------\\\n        /        \\\n       /Integration\\\n      /------------\\\n     /              \\\n    / Component/Unit \\\n   /------------------\\\n```\n\nYou generally want:\n\n```text\nmany\n |\n v\nunit/component tests\n\nfewer\n |\n v\nintegration tests\n\nsmall number\n |\n v\nE2E tests\n```\n\nWhy?\n\nBecause E2E tests are usually slower and more expensive to maintain.",
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
      "id": "rn29-22",
      "title": "Snapshot testing",
      "durationMinutes": 2,
      "explanation": "A snapshot captures the rendered output and stores it as a file.\n\nLater, Jest compares the new output against the saved snapshot.\n\nConceptually:\n\n```text\nFirst run\n\nComponent\n  |\n  v\nSnapshot\n  |\n  v\nsaved file\n\n\nLater\n\nComponent\n  |\n  v\nNew snapshot\n  |\n  v\ncompare\n  |\n+---+---+\n|       |\nsame   changed\n```\n\nA snapshot test might look like:\n\n```tsx\ntest(\"matches snapshot\", () => {\n const tree = renderer\n   .create(<Welcome name=\"Rajan\" />)\n   .toJSON();\n\n expect(tree).toMatchSnapshot();\n});\n```",
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
      "id": "rn29-23",
      "title": "When snapshots help",
      "durationMinutes": 2,
      "explanation": "Snapshots can be useful when:\n\n* a component has a stable, meaningful output\n* you intentionally want to review structural UI changes\n* the snapshot is small enough to understand\n\nBut don't snapshot huge screens blindly.\n\nA massive snapshot can become:\n\n```text\n500 lines changed\n      |\n      v\n\"Update snapshot?\"\n      |\n      v\ndeveloper clicks yes\n      |\n      v\ntest passes\n```\n\nThat doesn't provide much confidence.\n\n### Good rule\n\nDon't ask:\n\n> \"Can I snapshot this?\"\n\nAsk:\n\n> \"Will this snapshot help me notice an important UI change?\"\n\nIf not, a behavior-based test is usually more useful.",
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
      "id": "rn29-24",
      "title": "What should we actually test?",
      "durationMinutes": 2,
      "explanation": "Imagine this login screen:\n\n```text\nEmail\nPassword\n\n[ Login ]\n\nError message\n```\n\nGood tests:\n\n```text\n✓ Login button exists\n✓ Invalid input shows validation error\n✓ Login shows loading state\n✓ Successful login navigates to Home\n✓ Failed login shows error\n✓ User can retry\n```\n\nLess useful tests:\n\n```text\n✗ useState was called\n✗ function has exactly 4 lines\n✗ component uses a specific internal variable\n✗ implementation-specific CSS structure\n```\n\nThe principle is:\n\n> Test behavior that matters to the user.",
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
      "id": "rn29-25",
      "title": "A practical testing strategy",
      "durationMinutes": 2,
      "explanation": "For a production React Native application:\n\n### Unit/component level\n\nTest:\n\n```text\nvalidation\nformatters\nsmall components\nhooks\nutility functions\n```\n\n### Integration level\n\nTest:\n\n```text\nscreen behavior\nAPI + UI\nnavigation flows\nloading/error states\nforms\nauthentication flows\n```\n\n### E2E level\n\nTest the most important user journeys:\n\n```text\nLogin\nSignup\nPurchase\nCheckout\nCritical CRUD flow\nDeep link\nLogout\n```\n\nYou don't need to E2E-test every button in the application.",
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
      "id": "rn29-26",
      "title": "Test organization",
      "durationMinutes": 2,
      "explanation": "A simple structure:\n\n```text\nsrc/\n components/\n   Button.tsx\n   Button.test.tsx\n\n screens/\n   LoginScreen.tsx\n   LoginScreen.test.tsx\n\n hooks/\n   useAuth.ts\n   useAuth.test.ts\n\n utils/\n   formatDate.ts\n   formatDate.test.ts\n\ne2e/\n login.yaml\n navigation.yaml\n```\n\nKeep tests close to the code when that makes the project easier to navigate.\n\nKeep E2E flows separate because they operate at a different level.",
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
      "id": "rn29-27",
      "title": "Avoid flaky tests",
      "durationMinutes": 2,
      "explanation": "A **flaky test** sometimes passes and sometimes fails without a meaningful code change.\n\nFor example:\n\n```text\nRun 1 → PASS\nRun 2 → PASS\nRun 3 → FAIL\nRun 4 → PASS\n```\n\nCommon causes:\n\n* arbitrary timeouts\n* race conditions\n* real network requests\n* shared test state\n* unreliable selectors\n* animations\n* asynchronous operations not awaited\n\nPrefer:\n\n```tsx\nawait screen.findByText(\"Home\");\n```\n\nover:\n\n```tsx\nawait new Promise(\n (resolve) => setTimeout(resolve, 3000)\n);\n```\n\nDon't tell the test:\n\n> \"Wait three seconds and hope the screen is ready.\"\n\nTell it:\n\n> \"Wait until the expected behavior actually happens.\"",
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
      "id": "rn29-28",
      "title": "The complete testing flow",
      "durationMinutes": 2,
      "explanation": "By the end of this lesson, think about testing like this:\n\n```text\n               React Native App\n                      |\n         +------------+------------+\n         |            |            |\n         v            v            v\n       Unit      Component     Integration\n         |            |            |\n         +------------+------------+\n                      |\n                      v\n                   E2E\n                      |\n                      v\n             Simulator / Device\n```\n\nAnd each layer answers a different question:\n\n```text\nUnit:\n\"Does this piece of logic work?\"\n\nComponent:\n\"Does this UI behave correctly?\"\n\nIntegration:\n\"Do these pieces work together?\"\n\nE2E:\n\"Can a real user complete this important flow?\"\n```",
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
      "question": "What is the main reason to test an application?",
      "options": [
        "A. To change code with confidence",
        "B. To remove all manual testing",
        "C. To replace TypeScript",
        "D. To avoid writing components"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What role does Jest play?",
      "options": [
        "A. It runs tests and provides assertions and mocks",
        "B. It renders native screens in production",
        "C. It signs mobile builds",
        "D. It manages navigation"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Which matcher checks whether an element is visible in the rendered output?",
      "options": [
        "A. toBeOnTheScreen()",
        "B. toNavigate()",
        "C. toCompile()",
        "D. toBuild()"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Which React Native Testing Library query waits for an element to appear?",
      "options": [
        "A. findBy...",
        "B. getBy...",
        "C. queryBy...",
        "D. removeBy..."
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should a component test focus on?",
      "options": [
        "A. Behavior visible to the user",
        "B. Private implementation details",
        "C. Exact internal state names",
        "D. The device signing certificate"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why are mocks useful?",
      "options": [
        "A. They replace difficult external dependencies with controlled behavior",
        "B. They make every test an E2E test",
        "C. They publish the application",
        "D. They remove assertions"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does an integration test verify?",
      "options": [
        "A. Multiple parts working together",
        "B. One arithmetic expression only",
        "C. Store submission",
        "D. Native signing"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Which tool uses readable YAML flows for mobile E2E testing?",
      "options": [
        "A. Maestro",
        "B. Jest",
        "C. TypeScript",
        "D. Metro"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Where should most tests sit in the testing pyramid?",
      "options": [
        "A. Unit and component level",
        "B. E2E level only",
        "C. Manual testing only",
        "D. Store review"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is a flaky test?",
      "options": [
        "A. A test that sometimes passes and sometimes fails without a meaningful code change",
        "B. A test with several assertions",
        "C. A test for navigation",
        "D. A snapshot test"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "Testing Self-check",
    "goal": "Complete the component, integration, and Maestro testing tasks.",
    "brief": "By the end of Day 29, you should be able to do all three:\n\n### 1. Component test\n\nCreate a component:\n\n```text\nCounter\n |\n +-- displays count\n |\n +-- button increments count\n```\n\nWrite an RNTL test that:\n\n```text\nrenders Counter\n↓\nfinds Increase button\n↓\npresses it\n↓\nchecks count changed\n```\n\n### 2. Integration test\n\nCreate:\n\n```text\nLogin Screen\n     |\n     v\nmock API\n     |\n     v\nsuccessful login\n     |\n     v\nHome Screen\n```\n\nTest the complete behavior.\n\n### 3. Maestro E2E flow\n\nCreate a Maestro flow:\n\n```yaml\nappId: com.example.app\n\n---\n- launchApp\n- tapOn: \"Login\"\n- tapOn: \"Email\"\n- inputText: \"rajan@example.com\"\n- tapOn: \"Password\"\n- inputText: \"password\"\n- tapOn: \"Login\"\n- assertVisible: \"Home\"\n```\n\nThe important thing is that you understand **why you are using three different testing levels**, not just how to copy the commands.",
    "steps": [],
    "acceptance": [
      "Component test",
      "Integration test",
      "Maestro E2E flow"
    ]
  }
});

