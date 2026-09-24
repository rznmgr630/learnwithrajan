import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_2_LESSONS = normalizePastedLessonDay({
  "day": 2,
  "title": "React Native Internals: From State Update to Native UI",
  "overview": "",
  "totalMinutes": 60,
  "difficulty": "Intermediate",
  "lessons": [
    {
      "id": "render-pipeline",
      "title": "The Full Path From State Update to Pixels",
      "durationMinutes": 15,
      "explanation": "Let's begin with the most important question of today's lesson:\n\n> **What happens when React state changes?**\n\nImagine we have a simple counter:\n\n```\nfunction Counter() {\n const [count, setCount] = useState(0);\n\n return (\n   <View>\n     <Text>{count}</Text>\n\n     <Button\n       title=\"Increase\"\n       onPress={() => setCount(count + 1)}\n     />\n   </View>\n );\n}\n```\n\nInitially:\n\n```\ncount = 0\n```\n\nThe screen displays:\n\n```\n0\n```\n\nThe user presses the button.\n\nThen:\n\n```\nsetCount(count + 1);\n```\n\nNow what?\n\nLet's follow the journey.\n\n---\n\n## Step 1 — The state update happens\n\nThe first thing is simple:\n\n```\nsetCount(count + 1);\n```\n\nReact knows that the component's state has changed.\n\nThe important thing to understand is:\n\n> Calling `setState` does not mean React immediately changes the pixels on the screen.\n\nThere are several steps between the state update and the final screen.\n\n---\n\n## Step 2 — React schedules an update\n\nReact receives the state update.\n\nIt needs to figure out:\n\n> \"What does the UI look like now?\"\n\nReact may schedule work rather than immediately performing every operation.\n\n**Scheduling** (deciding when a piece of work should be performed) is an important part of modern UI systems.\n\nConceptually:\n\n```\nsetCount()\n   ↓\nReact receives update\n   ↓\nReact schedules work\n```\n\n---\n\n## Step 3 — The component renders again\n\nReact runs the component to determine what the new UI description should be.\n\nFor example:\n\n```\n<Text>{count}</Text>\n```\n\nBefore:\n\n```\n<Text>0</Text>\n```\n\nAfter:\n\n```\n<Text>1</Text>\n```\n\nBut remember:\n\n> React isn't drawing the number itself.\n\nReact creates a description of what the UI should look like.\n\n---\n\n## Virtual UI representation\n\nYou can think of React's output as a tree:\n\n```\nCounter\n │\n └── View\n      ├── Text \"1\"\n      └── Button\n```\n\nReact compares the new result with the previous result.\n\nThis comparison is often called **reconciliation** (the process React uses to determine what changed between UI descriptions).\n\n---\n\n## Step 4 — React identifies what changed\n\nBefore:\n\n```\nView\n├── Text \"0\"\n└── Button\n```\n\nAfter:\n\n```\nView\n├── Text \"1\"\n└── Button\n```\n\nOnly the text changed.\n\nReact doesn't need to rebuild everything.\n\nConceptually:\n\n```\nOld UI\n ↓\nNew UI\n ↓\nCompare\n ↓\nOnly Text changed\n```\n\nThis is one of the important ideas behind declarative UI.\n\nYou describe:\n\n> \"I want the screen to look like this.\"\n\nReact figures out what needs to change.\n\n---\n\n## Step 5 — React Native sends the update toward native UI\n\nNow we cross an important boundary.\n\nReact is working with JavaScript objects and React components.\n\nBut the actual screen is rendered using the platform's native UI system.\n\nOn iOS, that ultimately involves Apple's native UI technologies.\n\nOn Android, that ultimately involves Android's native UI and rendering systems.\n\nSo conceptually:\n\n```\nJavaScript / React\n      ↓\nReact Native rendering system\n      ↓\nNative UI\n      ↓\nGPU / display system\n      ↓\nPixels\n```\n\n---\n\n## What does \"native UI\" mean?\n\n**Native UI** means UI elements and rendering systems provided by the operating system.\n\nFor example:\n\n```\niOS\n↓\nApple's native UI/rendering system\n\nAndroid\n↓\nAndroid's native UI/rendering system\n```\n\nReact Native allows you to write JavaScript/TypeScript while ultimately displaying UI through native platform mechanisms.\n\n---\n\n## Step 6 — Native UI updates\n\nThe native side receives the necessary update.\n\nFor our example:\n\n```\nText\n\"0\"\n↓\n\"1\"\n```\n\nThe native view representing that text is updated.\n\nThen the operating system handles the actual drawing.\n\n---\n\n## Step 7 — The screen becomes pixels\n\nAt the end of the process:\n\n```\nState\n↓\nReact update\n↓\nReact rendering\n↓\nNative UI update\n↓\nPlatform rendering\n↓\nGPU/display\n↓\nPixels\n```\n\nThe user sees:\n\n```\n1\n```\n\n---\n\n## The complete mental model\n\nHere's the simplified version you should remember:\n\n```\nUser interaction\n      ↓\nJavaScript event\n      ↓\nState update\n      ↓\nReact schedules update\n      ↓\nComponent renders\n      ↓\nReact determines what changed\n      ↓\nReact Native rendering system\n      ↓\nNative UI update\n      ↓\nPlatform rendering\n      ↓\nGPU\n      ↓\nPixels on screen\n```\n\nThis isn't meant to be a literal one-function-at-a-time pipeline.\n\nIt's a **mental model** (a simplified way of understanding a complicated system).\n\nThe real implementation is more sophisticated.\n\n---\n\n## Why doesn't React Native just redraw everything?\n\nImagine a screen containing:\n\n```\nHeader\n├── Logo\n├── Search\n└── Profile\n\nContent\n├── Card\n├── Card\n├── Card\n└── Card\n\nFooter\n```\n\nIf you change one piece of text, rebuilding every part would be wasteful.\n\nReact tries to determine what actually changed.\n\nFor example:\n\n```\nChanged:\nCard 3 title\n\nDidn't change:\nHeader\nSearch\nProfile\nCard 1\nCard 2\nCard 4\nFooter\n```\n\nThis helps avoid unnecessary work.\n\n---\n\n## But there's an important detail\n\nReact deciding that only one component changed doesn't mean:\n\n> \"Only one CPU instruction runs.\"\n\nThere are still costs involved in:\n\n- JavaScript execution\n- React rendering\n- reconciliation\n- scheduling\n- native communication\n- layout\n- drawing\n- GPU work\n\nThat's why performance requires understanding the entire system.\n\n---\n\n## A useful analogy\n\nImagine you're running a restaurant.\n\nA customer says:\n\n> \"I want one more glass of water.\"\n\nYou don't rebuild the entire restaurant.\n\nInstead:\n\n```\nCustomer request\n     ↓\nWaiter receives request\n     ↓\nKitchen/service system processes it\n     ↓\nOnly required action happens\n     ↓\nCustomer gets water\n```\n\nReact Native works with a similar high-level idea:\n\n```\nState change\n     ↓\nReact processes change\n     ↓\nOnly required UI work\n     ↓\nNative system updates\n     ↓\nScreen changes\n```",
      "diagram": "┌──────────────────────┐\n│      User action     │\n└──────────┬───────────┘\n          ↓\n┌──────────────────────┐\n│    setState / event  │\n└──────────┬───────────┘\n          ↓\n┌──────────────────────┐\n│   React scheduling   │\n└──────────┬───────────┘\n          ↓\n┌──────────────────────┐\n│ Component rendering  │\n└──────────┬───────────┘\n          ↓\n┌──────────────────────┐\n│   Reconciliation     │\n└──────────┬───────────┘\n          ↓\n┌──────────────────────┐\n│ React Native render  │\n│      system          │\n└──────────┬───────────┘\n          ↓\n┌──────────────────────┐\n│      Native UI       │\n└──────────┬───────────┘\n          ↓\n┌──────────────────────┐\n│ Platform rendering   │\n└──────────┬───────────┘\n          ↓\n┌──────────────────────┐\n│       Pixels         │\n└──────────────────────┘",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- `setState` starts a process; it doesn't directly draw pixels.\n- React determines what the updated UI should look like.\n- React compares the new UI description with the previous one.\n- React Native connects React's UI model to native platform UI.\n- The operating system and rendering system ultimately produce the pixels.\n- Understanding this pipeline helps you understand React Native performance."
      ],
      "commonMistakes": [
        "### ❌ \"setState immediately changes the screen\"\n\nNot directly.\n\nIt starts an update that eventually results in the screen changing.\n\n### ❌ \"React Native draws everything using JavaScript\"\n\nJavaScript describes application behavior and UI.\n\nThe final native rendering is handled through platform rendering systems.\n\n### ❌ \"If only one component changed, nothing else happens\"\n\nEven a small update can involve multiple parts of the rendering pipeline."
      ],
      "quiz": [
        {
          "question": "What is the correct high-level flow?",
          "options": [
            "A. `setState → React update → native UI → pixels`",
            "B. `setState → GPU directly`",
            "C. `setState → database → pixels`",
            "D. `setState → CSS → browser`"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "threads",
      "title": "The JS Thread, UI Thread, and Native/Background Threads",
      "durationMinutes": 12,
      "explanation": "Now we need to understand where all this work happens.\n\nOne of the most important React Native concepts is that your application isn't just one giant stream of work.\n\nThere can be multiple threads.\n\nA **thread** (an independent path where computer instructions can execute) allows different types of work to happen separately.\n\nFor today's lesson, we'll focus on three broad categories:\n\n```\nJavaScript thread\nUI/main thread\nNative/background threads\n```\n\nThe exact implementation varies by platform and architecture, so treat this as a useful mental model rather than a literal list of every thread in the app.\n\n---\n\n## The JavaScript thread\n\nThe JavaScript thread is where your JavaScript application code executes.\n\nFor example:\n\n```\nconst handlePress = () => {\n setCount(count + 1);\n};\n```\n\nThings commonly associated with JavaScript execution include:\n\n```\nReact logic\nState updates\nApplication logic\nEvent handlers\nData processing\nSome API handling\n```\n\n---\n\n## Why does the JS thread matter?\n\nImagine you run an expensive calculation:\n\n```\nfor (let i = 0; i < 1000000000; i++) {\n // expensive work\n}\n```\n\nWhile that JavaScript work is running, other JavaScript work may have to wait.\n\nThat can cause:\n\n```\nButton feels delayed\nScrolling feels less responsive\nAnimations can stutter\nInteractions feel slow\n```\n\nThis is why you should avoid unnecessary heavy work on the JavaScript thread.\n\n---\n\n## The UI thread\n\nThe UI thread is commonly responsible for UI-related work on the platform.\n\nYou may also hear it called the **main thread**.\n\nFor example:\n\n```\nTouch processing\nUI updates\nLayout-related work\nDrawing coordination\n```\n\nAgain, the exact division of responsibilities varies by platform and React Native architecture.\n\n---\n\n## Why does the UI thread matter?\n\nImagine the user is scrolling:\n\n```\nFinger\n↓\nScroll\n↓\nScreen movement\n```\n\nThe screen needs to update quickly.\n\nIf UI-related work is blocked for too long, the user may see:\n\n```\nSmooth\n████████████████████\n\nBlocked\n████  █  ███ █\n```\n\nThat's what users experience as stuttering.\n\n---\n\n## Native/background threads\n\nNative code can also use additional threads for work that doesn't need to happen directly on the UI thread.\n\nExamples can include:\n\n```\nNetworking\nFile operations\nDatabase work\nImage processing\nNative SDK work\nOther background operations\n```\n\n**Background work** means work that can happen away from the immediate UI rendering path.\n\n---\n\n## A simple mental model\n\nThink about your application as a team.\n\n### JavaScript thread\n\n```\n\"Application logic\"\n```\n\n### UI thread\n\n```\n\"Keep the interface responsive\"\n```\n\n### Background/native work\n\n```\n\"Handle work that doesn't need to block UI interaction\"\n```\n\nThis isn't perfectly literal, but it gives you a useful starting point.\n\n---\n\n## Example: pressing a button\n\nSuppose you press:\n\n```\nDownload\n```\n\nYour JavaScript code might:\n\n```\nReceive press\n   ↓\nStart download\n   ↓\nUpdate state\n```\n\nThe network operation shouldn't require your UI to freeze until the entire file downloads.\n\nConceptually:\n\n```\nJS\n│\n├── Start work\n│\n└──────────────→ Background/native work\n                        │\n                        ↓\n                     Download\n                        │\n                        ↓\nJS ←──────────────── Result\n│\n↓\nUpdate UI\n```\n\n---\n\n## Why JavaScript performance matters\n\nLet's say you're rendering a list of 10,000 items and performing expensive calculations for every item.\n\nYour JavaScript thread may become overloaded.\n\nThen:\n\n```\nJS thread\n████████████████████████\n      VERY BUSY\n```\n\nUser:\n\n```\n\"Why is the app lagging?\"\n```\n\nThe solution isn't automatically:\n\n> \"Add more native code.\"\n\nYou first need to identify what is actually blocking the application.\n\n---\n\n## Frame budget\n\nA screen often targets smooth frame rates such as **60 FPS** (frames per second).\n\nAt 60 FPS, you have approximately:\n\n```\n1000 ms ÷ 60 ≈ 16.7 ms\n```\n\nper frame.\n\nThat doesn't mean you have exactly 16.7 ms for JavaScript.\n\nIt's the approximate frame interval for the display.\n\nSeveral systems have work to perform during that time.\n\n---\n\n## What happens when work takes too long?\n\nImagine the UI needs to keep producing frames:\n\n```\nFrame 1\nFrame 2\nFrame 3\nFrame 4\nFrame 5\n```\n\nBut some work blocks progress:\n\n```\nFrame 1\nFrame 2\n    ↓\n Heavy work\n    ↓\nFrame 3 delayed\n```\n\nThe user can perceive that as a dropped frame or stutter.",
      "diagram": "React Native App\n                   │\n       ┌───────────┼────────────┐\n       ▼           ▼            ▼\n  JS Thread    UI Thread    Native/Other\n       │           │            │\n       │           │            │\n  React logic   UI work      Background\n  State         Touch        operations\n  Handlers      Rendering    Native work\n       │           │            │\n       └───────────┼────────────┘\n                   ▼\n                 Device",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- React Native applications involve different kinds of execution work.\n- The JavaScript thread runs JavaScript application logic.\n- The UI/main thread handles important UI-related work.\n- Native/background work can happen separately.\n- Heavy JavaScript work can make interactions less responsive.\n- Smooth apps require keeping important work from blocking the wrong part of the system."
      ],
      "commonMistakes": [
        "### ❌ \"The JS thread is the only thread\"\n\nNo.\n\nReact Native applications interact with native platform systems that have their own execution model.\n\n### ❌ \"Moving everything to another thread makes it fast\"\n\nNot automatically.\n\nWork still costs CPU, memory, synchronization, and communication.\n\n### ❌ \"60 FPS means JavaScript gets 16.7 ms\"\n\nNot exactly.\n\nThe entire rendering pipeline has to fit within the frame interval, not just your JavaScript code."
      ],
      "quiz": [
        {
          "question": "Why can expensive JavaScript work hurt app responsiveness?",
          "options": [
            "A. It can block other JavaScript work and delay updates/events",
            "B. It permanently deletes native UI",
            "C. It disables the GPU",
            "D. It removes React"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "bridgeless-jsi",
      "title": "Bridgeless Architecture and JSI Communication",
      "durationMinutes": 10,
      "explanation": "Now we're getting into one of the biggest changes in modern React Native:\n\n**Bridgeless architecture.**\n\nTo understand why this matters, we first need to understand the older communication model.\n\n---\n\n## The old mental model: the Bridge\n\nHistorically, React Native used something commonly called the **Bridge** to communicate between JavaScript and native code.\n\nThink of it like a communication channel:\n\n```\nJavaScript\n   │\n   │ messages\n   ▼\n Bridge\n   │\n   │ messages\n   ▼\nNative\n```\n\nFor example:\n\n```\nJavaScript:\n\"Update this view.\"\n\n       ↓\n\nBridge\n\n       ↓\n\nNative:\n\"Okay, update the view.\"\n```\n\n---\n\n## What was the problem?\n\nThe Bridge relied heavily on asynchronous message passing.\n\n**Asynchronous** means the sender can send work without waiting for the receiver to finish immediately.\n\nThat approach worked, but communication could become expensive when large amounts of data or many messages crossed the boundary.\n\nImagine sending:\n\n```\n1000 messages\n```\n\nback and forth.\n\nThere can be overhead from:\n\n- creating messages\n- converting data\n- scheduling work\n- transferring data\n- processing messages\n\n---\n\n## A simple analogy\n\nImagine you have two offices:\n\n```\nOffice A: JavaScript\nOffice B: Native\n```\n\nThe old Bridge is like a receptionist:\n\n```\nJavaScript\n   ↓\nReceptionist\n   ↓\nMessage\n   ↓\nNative\n```\n\nEvery message has to go through that communication system.\n\nFor a few messages, that's fine.\n\nFor thousands of messages, the communication process itself can become expensive.\n\n---\n\n# What is JSI?\n\n**JSI** stands for **JavaScript Interface**.\n\nIt provides a lower-level way for JavaScript and native/C++ code to interact.\n\nInstead of thinking:\n\n```\nJavaScript\n   ↓\nMessage Bridge\n   ↓\nNative\n```\n\nyou can think:\n\n```\nJavaScript\n   ↕\n  JSI\n   ↕\nNative / C++\n```\n\nJSI allows native functionality to be exposed to JavaScript without depending on the old serialized Bridge model.\n\n---\n\n## What does \"serialized\" mean?\n\n**Serialization** means converting data into a form that can be transferred or stored.\n\nFor example, conceptually:\n\n```\nJavaScript object\n\n{\n name: \"Alex\",\n age: 20\n}\n```\n\nmight need to be transformed into a transferable representation.\n\nThen the other side reads it and reconstructs the data.\n\nThat conversion can have a cost.\n\nJSI enables more direct interaction in many cases.\n\n---\n\n# What is Bridgeless React Native?\n\nModern React Native can run without the legacy Bridge.\n\nThat's what **Bridgeless mode** means at a high level.\n\nInstead of:\n\n```\nReact\n↓\nLegacy Bridge\n↓\nNative\n```\n\nthe modern architecture uses systems built around:\n\n```\nReact\n↓\nJSI / modern native interfaces\n↓\nNative\n```\n\nThis is part of React Native's newer architecture.\n\n---\n\n## Why does this matter?\n\nIt can simplify communication between JavaScript and native code and removes dependency on the old Bridge infrastructure.\n\nThis is especially important for newer React Native systems such as:\n\n```\nTurboModules\nFabric\nCodegen\nJSI\n```\n\nThese pieces are designed to work together.\n\n---\n\n## Is Bridgeless the same as \"no communication\"?\n\nNo.\n\nThis is a common misunderstanding.\n\nBridgeless does **not** mean:\n\n```\nJavaScript magically controls native UI directly\n```\n\nThere is still communication and coordination between JavaScript and native systems.\n\nThe difference is **how that communication is implemented**.",
      "diagram": "JavaScript\n   │\n   ▼\n┌───────────┐\n│   Bridge  │\n└─────┬─────┘\n     │\n     ▼\n  Native",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- The legacy Bridge was an older JavaScript-to-native communication mechanism.\n- JSI means JavaScript Interface.\n- JSI provides lower-level interaction between JavaScript and native/C++ systems.\n- Bridgeless architecture removes the dependency on the legacy Bridge.\n- Bridgeless does not mean JavaScript and native code stop communicating.\n- Modern React Native architecture is built around newer communication and rendering systems."
      ],
      "commonMistakes": [
        "### ❌ \"Bridgeless means there is no boundary\"\n\nThere is still a boundary between JavaScript and native systems.\n\nThe communication mechanism has changed.\n\n### ❌ \"JSI is a replacement UI renderer\"\n\nJSI is an interface mechanism.\n\nIt isn't itself the UI renderer.\n\n### ❌ \"Bridge and JSI are exactly the same thing\"\n\nThey solve related communication problems but use different approaches."
      ],
      "quiz": [
        {
          "question": "What does JSI stand for?",
          "options": [
            "A. JavaScript Interface",
            "B. JavaScript Internet",
            "C. JavaScript Input",
            "D. JavaScript Integration Server"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "turbomodules-fabric",
      "title": "TurboModules and Fabric",
      "durationMinutes": 10,
      "explanation": "Now we're going to connect two important pieces of the modern React Native architecture:\n\n```\nTurboModules\nFabric\n```\n\nThe easiest way to remember them is:\n\n```\nTurboModules → Native functionality\n\nFabric → Rendering/UI\n```\n\nThis is simplified, but it's an excellent beginner mental model.\n\n---\n\n# TurboModules\n\n## What is a native module?\n\nA **native module** is functionality implemented on the native side of the application.\n\nFor example:\n\n```\nCamera\nBluetooth\nBiometrics\nDevice information\nFile system\nNative SDK\n```\n\nJavaScript may want to call these capabilities.\n\n---\n\n## Traditional native module communication\n\nConceptually:\n\n```\nJavaScript\n   ↓\nNative module\n   ↓\nPlatform API\n```\n\nFor example:\n\n```\nJavaScript\n   ↓\nCamera module\n   ↓\niOS/Android camera APIs\n```\n\n---\n\n## What are TurboModules?\n\n**TurboModules** are part of React Native's modern native module architecture.\n\nThey improve how JavaScript accesses native functionality.\n\nOne important idea is **lazy loading**.\n\n**Lazy loading** means something is loaded only when it is actually needed.\n\nImagine your app has:\n\n```\nCamera\nMaps\nPayments\nBluetooth\nAnalytics\n```\n\nYou don't necessarily need every native module immediately when the application starts.\n\nA modern module system can avoid loading everything unnecessarily.\n\n---\n\n## Example mental model\n\nWithout lazy loading:\n\n```\nApp starts\n↓\nLoad everything\n↓\nCamera\nMaps\nPayments\nBluetooth\nAnalytics\n```\n\nWith lazy loading:\n\n```\nApp starts\n↓\nLoad what is needed\n↓\nUser opens camera\n↓\nCamera module loads\n```\n\nThis can help startup and resource usage.\n\n---\n\n# Fabric\n\nNow let's talk about the rendering side.\n\n**Fabric** is React Native's modern rendering system.\n\nRemember our earlier pipeline:\n\n```\nReact\n↓\nReact Native rendering\n↓\nNative UI\n```\n\nFabric is a major part of that rendering architecture.\n\n---\n\n## Why was Fabric introduced?\n\nReact Native's original rendering system had limitations as React and React Native evolved.\n\nFabric was designed to provide a more modern rendering architecture with better integration with React's newer capabilities.\n\n---\n\n## Fabric mental model\n\nThink:\n\n```\nReact components\n      ↓\nReact Native renderer\n      ↓\n    Fabric\n      ↓\nNative UI\n```\n\nFabric handles the modern rendering side of React Native.\n\n---\n\n## TurboModules vs Fabric\n\nThis is one of the most important comparisons from today's lesson.\n\n| System | Main responsibility |\n| --- | --- |\n| TurboModules | Native functionality/modules |\n| Fabric | UI rendering |\n| JSI | JavaScript ↔ native/C++ interface |\n| Codegen | Generates native integration code |\n\nA simple memory trick:\n\n```\nTurboModules\n    ↓\n\"Use native functionality\"\n\nFabric\n    ↓\n\"Render native UI\"\n\nJSI\n    ↓\n\"Communicate efficiently\"\n\nCodegen\n    ↓\n\"Generate integration code\"\n```\n\n---\n\n## How they work together\n\nImagine you have a camera screen.\n\nYou might have:\n\n```\nReact component\n      │\n      ├──────────────┐\n      │              │\n      ▼              ▼\n   Fabric       TurboModule\n      │              │\n      ▼              ▼\n   UI view       Camera API\n      │              │\n      └──────┬───────┘\n             ▼\n           Device\n```\n\nJSI and Codegen help support the modern integration architecture.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- TurboModules modernize access to native functionality.\n- Fabric is the modern React Native rendering system.\n- JSI provides a lower-level JavaScript/native interface.\n- Codegen generates integration code from defined interfaces.\n- These technologies are pieces of the same modern React Native architecture."
      ],
      "commonMistakes": [
        "### ❌ \"Fabric is a replacement for React\"\n\nNo.\n\nReact still manages the component model.\n\nFabric is part of React Native's rendering architecture.\n\n### ❌ \"TurboModules render the UI\"\n\nThat's not their primary responsibility.\n\nThink:\n\n```\nTurboModules → native capabilities\n\nFabric → UI rendering\n```"
      ],
      "quiz": [
        {
          "question": "Which system is primarily responsible for modern React Native rendering?",
          "options": [
            "A. Fabric",
            "B. TurboModules",
            "C. npm",
            "D. Metro"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "events-codegen-performance",
      "title": "Native Events, Codegen, and JS-Thread Performance",
      "durationMinutes": 13,
      "explanation": "Our final lesson brings several ideas together.\n\nWe're going to look at:\n\n```\nNative events\nCodegen\nJavaScript performance\n```\n\nThese concepts matter because your application isn't just sending information from JavaScript to native.\n\nInformation also needs to travel **from native back to JavaScript**.\n\n---\n\n# Native Events\n\nImagine the user touches the screen.\n\nThe operating system knows:\n\n```\nFinger touched screen\n```\n\nBut your JavaScript application might need to know:\n\n```\nonPress\n```\n\nSo information needs to move from native systems toward JavaScript.\n\nConceptually:\n\n```\nUser\n↓\nOperating system\n↓\nNative event\n↓\nReact Native\n↓\nJavaScript handler\n```\n\n---\n\n## Example\n\nYou write:\n\n```\n<Button\n title=\"Buy\"\n onPress={() => {\n   console.log(\"Buy pressed\");\n }}\n/>\n```\n\nThe user doesn't directly execute:\n\n```\nconsole.log(\"Buy pressed\");\n```\n\nTheir finger interacts with the native/platform input system.\n\nThat event is processed and eventually reaches your JavaScript callback.\n\n---\n\n## Another example: scrolling\n\nImagine:\n\n```\n<ScrollView\n onScroll={(event) => {\n   // ...\n }}\n/>\n```\n\nThe native side knows that scrolling is happening.\n\nIt can generate scroll events containing information such as:\n\n```\nCurrent position\nVelocity\nContent offset\n```\n\nThat information may be delivered to JavaScript depending on how the component and event are configured.\n\n---\n\n# Why too many events can be expensive\n\nImagine a gesture generates:\n\n```\nEvent 1\nEvent 2\nEvent 3\nEvent 4\n...\nEvent 1000\n```\n\nIf every event requires significant JavaScript work:\n\n```\nNative\n↓\nJS\n↓\nNative\n↓\nJS\n↓\nNative\n↓\nJS\n```\n\nyou can create a lot of overhead.\n\nThis is why high-frequency interactions need careful design.\n\n---\n\n# Example: scroll event\n\nSuppose you do:\n\n```\nonScroll={() => {\n expensiveFunction();\n}}\n```\n\nIf scrolling generates many events, you're repeatedly running:\n\n```\nexpensiveFunction()\n```\n\nwhile the user is trying to scroll.\n\nThat can hurt responsiveness.\n\n---\n\n# This is why UI-thread animation matters\n\nConsider a gesture-driven animation.\n\nInstead of:\n\n```\nGesture\n↓\nJavaScript\n↓\nCalculate\n↓\nNative\n↓\nScreen\n```\n\na modern animation system can keep the animation logic closer to the UI execution environment:\n\n```\nGesture\n↓\nUI-side animation logic\n↓\nAnimated value\n↓\nScreen\n```\n\nThis is one reason Reanimated, which you learned about on Day 7, can be useful.\n\n---\n\n# Codegen\n\nNow let's introduce **Codegen**.\n\nCodegen means **code generation** (automatically creating source code from a defined description or specification).\n\nInstead of manually writing every piece of native integration code, React Native can generate some of that code from typed definitions.\n\n---\n\n## Why generate code?\n\nImagine you define an interface:\n\n```\nJavaScript API\n     ↓\nTyped specification\n     ↓\nCodegen\n     ↓\nGenerated native code\n```\n\nThis reduces the amount of repetitive integration code developers need to write manually.\n\n---\n\n## Why is typing important here?\n\nImagine you have:\n\n```\ntype User = {\n id: string;\n name: string;\n};\n```\n\nA typed interface gives tools more information about:\n\n```\nWhat data exists\nWhat type it has\nWhat functions exist\nWhat arguments are expected\nWhat values can be returned\n```\n\nCodegen can use this information when generating native integration code.\n\n---\n\n## Why Codegen matters for React Native architecture\n\nCodegen works alongside modern systems such as:\n\n```\nTurboModules\nFabric\nJSI\n```\n\nIt helps keep the JavaScript and native sides aligned.\n\n---\n\n## A simplified example\n\nImagine you describe a native module like:\n\n```\ngetDeviceName()\n```\n\nand specify:\n\n```\nReturns: string\n```\n\nThe tooling can use that specification to generate appropriate native-side integration code.\n\nInstead of manually keeping several layers synchronized:\n\n```\nJavaScript declaration\nNative declaration\nType conversion\nGlue code\n```\n\nsome of that work can be generated.\n\n**Glue code** means code whose main job is connecting two different systems.\n\n---\n\n# JS-Thread Performance\n\nNow let's bring everything together.\n\nOne of the biggest lessons from today's class is:\n\n> **Your JavaScript code is part of a larger system, and heavy JavaScript work can affect responsiveness.**\n\n---\n\n## Example: expensive rendering\n\nImagine this:\n\n```\nfunction ProductList({ products }) {\n return (\n   <ScrollView>\n     {products.map(product => {\n       return (\n         <ExpensiveProductCard\n           key={product.id}\n           product={product}\n         />\n       );\n     })}\n   </ScrollView>\n );\n}\n```\n\nIf there are thousands of products and every render performs expensive work, JavaScript can become overloaded.\n\n---\n\n## Example: unnecessary calculations\n\nInstead of:\n\n```\nfunction Product({ price }) {\n const finalPrice = expensiveCalculation(price);\n\n return <Text>{finalPrice}</Text>;\n}\n```\n\nyou may need to think carefully about:\n\n```\nDoes this calculation need to happen every render?\n```\n\nDepending on the situation, techniques such as memoization may help.\n\n**Memoization** means remembering a previous calculation so you don't have to repeat it unnecessarily when the inputs haven't changed.\n\n---\n\n## Example: unnecessary re-renders\n\nSuppose you have:\n\n```\nScreen\n├── Header\n├── Search\n├── ProductList\n└── Footer\n```\n\nIf changing one small piece of state causes expensive components to render repeatedly, the application can waste JavaScript time.\n\nThat's why you need to understand:\n\n```\nState\n↓\nRendering\n↓\nRe-rendering\n↓\nPerformance\n```\n\n---\n\n# What should you do when the app feels slow?\n\nDon't immediately guess.\n\nMeasure first.\n\nAsk:\n\n```\nIs JavaScript busy?\n\nIs the UI thread busy?\n\nAre there too many renders?\n\nAre there too many events?\n\nIs the list too large?\n\nIs layout expensive?\n\nIs image processing expensive?\n\nIs a native module doing heavy work?\n```\n\nPerformance optimization should start with identifying the actual bottleneck.\n\nA **bottleneck** is the part of a system that limits overall performance.",
      "diagram": "User\n                 │\n                 ▼\n         Native input system\n                 │\n                 ▼\n           Native event\n                 │\n                 ▼\n         React Native / JSI\n                 │\n                 ▼\n           JavaScript\n                 │\n         ┌───────┴────────┐\n         ▼                ▼\n     React logic      State update\n         │                │\n         └───────┬────────┘\n                 ▼\n              Render\n                 │\n                 ▼\n              Fabric\n                 │\n                 ▼\n             Native UI\n                 │\n                 ▼\n               Screen",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Native events allow information to travel from the device/native system toward your JavaScript code.\n- High-frequency events can create performance problems if they trigger expensive JavaScript work.\n- Codegen means automatically generating integration code from definitions/specifications.\n- TurboModules and Fabric use modern native integration mechanisms.\n- Heavy JavaScript work can cause responsiveness problems.\n- Don't optimize blindly—identify the bottleneck first.\n- Reanimated can keep appropriate animation and gesture work away from a busy JavaScript path."
      ],
      "commonMistakes": [
        "### ❌ Doing expensive work inside high-frequency event handlers\n\nFor example:\n\n```\nonScroll={() => {\n veryExpensiveFunction();\n}}\n```\n\nThis can become costly when called repeatedly.\n\n---\n\n### ❌ Assuming native automatically means fast\n\nNative code can also be expensive.\n\nA badly designed native operation can still consume lots of CPU or memory.\n\n---\n\n### ❌ Optimizing before measuring\n\nDon't randomly add:\n\n```\nmemo()\nuseMemo()\nuseCallback()\n```\n\neverywhere.\n\nUnderstand the actual problem first.\n\n---\n\n### ❌ Thinking Codegen makes everything faster\n\nCodegen's primary purpose is to generate and maintain integration code and types.\n\nIt isn't a magic performance switch."
      ],
      "quiz": []
    }
  ],
  "finalQuiz": [
    {
      "question": "What happens after a React state update?",
      "options": [
        "React determines the updated UI and React Native eventually updates the native UI",
        "The GPU directly receives the JavaScript state",
        "The database renders the screen",
        "CSS draws the component"
      ],
      "correctIndex": 0,
      "explanation": "React determines the updated UI and React Native eventually updates the native UI"
    },
    {
      "question": "What is the main reason JavaScript-thread performance matters?",
      "options": [
        "Heavy JavaScript work can delay JavaScript events, rendering-related work, and interactions",
        "JavaScript controls the device's battery directly",
        "JavaScript permanently disables native UI",
        "JavaScript replaces the GPU"
      ],
      "correctIndex": 0,
      "explanation": "Heavy JavaScript work can delay JavaScript events, rendering-related work, and interactions"
    },
    {
      "question": "What is JSI?",
      "options": [
        "JavaScript Interface",
        "JavaScript Internet",
        "JavaScript Inspector",
        "JavaScript Input"
      ],
      "correctIndex": 0,
      "explanation": "JavaScript Interface"
    },
    {
      "question": "What is Fabric primarily associated with?",
      "options": [
        "React Native's modern rendering system",
        "Database queries",
        "HTTP requests",
        "Image compression"
      ],
      "correctIndex": 0,
      "explanation": "React Native's modern rendering system"
    },
    {
      "question": "What are TurboModules primarily used for?",
      "options": [
        "Accessing native functionality through React Native's modern native module architecture",
        "Drawing every pixel directly",
        "Replacing React components",
        "Managing CSS files"
      ],
      "correctIndex": 0,
      "explanation": "Accessing native functionality through React Native's modern native module architecture"
    },
    {
      "question": "What does Codegen mean?",
      "options": [
        "Automatically generating code from defined specifications/interfaces",
        "Compressing JavaScript",
        "Generating random IDs",
        "Creating database tables"
      ],
      "correctIndex": 0,
      "explanation": "Automatically generating code from defined specifications/interfaces"
    },
    {
      "question": "Which thread runs most React Native JavaScript application logic?",
      "options": [
        "Database thread",
        "GPU thread",
        "JavaScript thread",
        "File-system thread"
      ],
      "correctIndex": 2,
      "explanation": "The JavaScript thread runs JavaScript application logic and React-related work."
    },
    {
      "question": "What does React reconciliation determine?",
      "options": [
        "Which UI description changed",
        "Which database to install",
        "Which font file to delete",
        "Which app store to use"
      ],
      "correctIndex": 0,
      "explanation": "Reconciliation compares UI descriptions and determines what needs to change."
    },
    {
      "question": "Why can high-frequency native events affect performance?",
      "options": [
        "They disable Fabric",
        "They remove native views",
        "They stop Codegen",
        "They can create repeated JavaScript work"
      ],
      "correctIndex": 3,
      "explanation": "High-frequency events can create repeated work, especially when handlers perform expensive JavaScript operations."
    },
    {
      "question": "What should you do first when a React Native screen feels slow?",
      "options": [
        "Add memoization everywhere",
        "Measure and identify the actual bottleneck",
        "Rewrite every component",
        "Disable native events"
      ],
      "correctIndex": 1,
      "explanation": "Performance work should begin with measurement so the real bottleneck is understood."
    }
  ],
  "footer": "# 🧠 Day 2 Mental Model\n\nIf you remember only one diagram from today, remember this:\n\n```\n                USER\n                  │\n                  ▼\n            Native Input\n                  │\n                  ▼\n           Native Events\n                  │\n                  ▼\n         ┌─────────────────┐\n         │ React Native    │\n         │ Architecture    │\n         └────────┬────────┘\n                  │\n            ┌─────┴─────┐\n            ▼           ▼\n      JavaScript       Native\n         / React        systems\n            │             │\n            │          TurboModules\n            │             │\n            │          Native APIs\n            │\n            ▼\n         Rendering\n            │\n            ▼\n          Fabric\n            │\n            ▼\n         Native UI\n            │\n            ▼\n         GPU/display\n            │\n            ▼\n          PIXELS\n```\n\nAnd underneath that architecture:\n\n```\nJSI\n↓\nModern JavaScript ↔ Native interface\n\nCodegen\n↓\nGenerated integration code\n\nTurboModules\n↓\nNative functionality\n\nFabric\n↓\nUI rendering\n```\n\n---\n\n# 🎯 What You Should Understand After Day 2\n\nYou don't need to memorize the internals yet.\n\nYou should be able to explain this conversation:\n\n**Someone:**\n\"Why doesn't `setState()` directly change the pixels?\"\n\n**You:**\n\"Because `setState()` triggers a React update. React figures out what the UI should look like, React Native's rendering system coordinates the native update, and the platform eventually renders that UI to the screen.\"\n\n**Someone:**\n\"What's the JS thread?\"\n\n**You:**\n\"It's where JavaScript application code runs. If I make it do too much work, JavaScript events and other work can become delayed.\"\n\n**Someone:**\n\"What's Fabric?\"\n\n**You:**\n\"It's React Native's modern rendering system.\"\n\n**Someone:**\n\"What are TurboModules?\"\n\n**You:**\n\"They're part of React Native's modern architecture for accessing native functionality.\"\n\n**Someone:**\n\"What is JSI?\"\n\n**You:**\n\"It's a JavaScript Interface that provides a lower-level way for JavaScript and native/C++ code to interact.\"\n\n**Someone:**\n\"And Codegen?\"\n\n**You:**\n\"It generates integration code from defined specifications, helping connect the JavaScript and native sides.\"\n\nThat's the mental model you want to leave Day 2 with:\n\n> **A React Native app isn't just JavaScript drawing a screen. React manages the UI model, JavaScript executes application logic, the modern React Native architecture connects JavaScript with native systems, Fabric handles rendering, TurboModules provide native capabilities, and the platform ultimately turns that work into pixels.**"
});
