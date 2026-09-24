import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_23_LESSONS = normalizePastedLessonDay({
  "day": 23,
  "title": "Fabric Native Components",
  "overview": "📖 **4 lessons**\n\nToday we're moving from **native modules** to **native UI components**.\n\nOn Day 22, we learned how JavaScript can call native functionality:\n\n```\nJavaScript\n   ↓\nNative Module\n   ↓\niOS / Android API\n```\n\nToday we're going one step further.\n\nInstead of JavaScript simply asking native code to **do something**, we're going to let native code **render something on the screen**.\n\nFor example:\n\n```\nJavaScript\n   ↓\nCustom Fabric Component\n   ↓\nNative UI\n   ↓\nPixels on the screen\n```\n\nThis is useful when the UI itself requires native behavior that ordinary React Native components cannot express efficiently or accurately.",
  "totalMinutes": 60,
  "difficulty": "Intermediate",
  "lessons": [
    {
      "id": "rn23-1",
      "title": "Writing a custom Fabric native component",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nLet's start with the basic question:\n\n### What is a Fabric native component?\n\nA **Fabric native component** is a React Native component whose actual UI is implemented using native platform code.\n\nFor example, you could create:\n\n```\n<Gauge\nvalue={75}\nmaximum={100}\n/>\n```\n\nFrom JavaScript, this looks like a normal React component.\n\nBut underneath:\n\n```\nReact Native\n  ↓\n<Gauge />\n  ↓\nFabric\n  ↓\nNative implementation\n  ↓\niOS / Android UI\n```\n\nThe important idea is that **JavaScript controls the component, while the native platform renders and manages the actual native UI**.\n\n---\n\n## Why do we need native components?\n\nReact Native already gives us many components:\n\n```\n<View />\n<Text />\n<Image />\n<ScrollView />\n<TextInput />\n<Pressable />\n```\n\nFor most applications, these are enough.\n\nYou should not create a Fabric component simply because you want something that looks different.\n\nFor example, don't create a native component for:\n\n```\n<View style={{ backgroundColor: \"red\" }} />\n```\n\nThat's unnecessary.\n\nReact Native can already handle it.\n\n---\n\n## When might a native component be useful?\n\nImagine you need a specialized gauge.\n\nYou could build it from:\n\n```\nView\n+\nborderRadius\n+\ntransform\n+\nmultiple layers\n```\n\nBut suppose the gauge needs:\n\n- Highly specialized drawing\n- Native animation\n- Platform-specific rendering\n- Hardware-backed rendering\n- A native SDK's UI\n- Complex interaction that existing React Native components cannot express\n\nA native component may make sense.\n\n---\n\n## Example: Native gauge\n\nImagine our application needs this:\n\n```\n     75%\n  ┌───────┐\n╱           ╲\n│    █████    │\n│   ███████   │\n╲           ╱\n  └───────┘\n```\n\nFrom JavaScript:\n\n```\n<Gauge value={75} />\n```\n\nThe JavaScript doesn't need to know how the gauge is drawn.\n\nIt only needs to provide the value.\n\nThe native implementation handles the rendering.\n\n---\n\n## The component has two sides\n\nA Fabric component has two major sides:\n\n### JavaScript side\n\nThis is what your React Native application sees.\n\nFor example:\n\n```\n<Gauge\nvalue={75}\ncolor=\"green\"\nonValueReached={handleReached}\n/>\n```\n\n### Native side\n\nThis is where the actual native UI is implemented.\n\nConceptually:\n\n```\niOS\n↓\nNative Gauge View\n\nAndroid\n↓\nNative Gauge View\n```\n\nSo we have:\n\n```\n              Gauge\n                │\n        ┌───────┴───────┐\n        ↓               ↓\n  JavaScript API    Native UI\n        │               │\n        ↓               ↓\n     props/events   iOS/Android\n```\n\n---\n\n## What is Fabric?\n\n**Fabric** is React Native's modern rendering system.\n\nA **renderer** is the part of a UI framework responsible for taking your component tree and turning it into something that can actually be displayed and updated on the device.\n\nConceptually:\n\n```\nReact components\n    ↓\nReact Native\n    ↓\nFabric\n    ↓\nNative UI\n    ↓\nScreen\n```\n\nFabric is part of React Native's New Architecture.\n\nIt works together with other modern React Native technologies such as:\n\n- JSI\n- TurboModules\n- Codegen\n\nYou've already seen these concepts on previous days.\n\n---\n\n## Fabric vs a native module\n\nThis distinction is extremely important.\n\nA **native module** usually exposes functionality:\n\n```\nBatteryModule.getLevel()\n```\n\nA **native component** exposes UI:\n\n```\n<BatteryIndicator />\n```\n\nThink:\n\n```\nNative Module\n  ↓\n\"Do something\"\n\nNative Component\n  ↓\n\"Render something\"\n```\n\nFor example:\n\n```\nBatteryModule\n  ↓\ngetBatteryLevel()\n```\n\nversus:\n\n```\n<BatteryIndicator\nlevel={0.75}\n/>\n```\n\nThe second one actually represents something on the screen.\n\n---\n\n## Why Fabric instead of the old architecture?\n\nFabric was designed as part of React Native's New Architecture to provide a more modern rendering system.\n\nYou don't need to memorize every internal detail.\n\nFor now, remember:\n\n```\nOld architecture\n     ↓\nOlder native UI communication patterns\n\nNew Architecture\n     ↓\nFabric\n     ↓\nModern native rendering\n```\n\nFabric is designed to work more closely with React's rendering model and the rest of the New Architecture.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- A Fabric native component is a React Native component backed by native UI.\n- JavaScript controls it through props and events.\n- Native iOS/Android code implements the actual UI behavior.\n- Fabric is React Native's modern renderer.\n- Native modules expose functionality; native components expose UI.\n- Don't build a native component unless normal React Native components aren't enough."
      ],
      "commonMistakes": [
        "### Mistake 1: Creating native components for simple UI\n\nIf a `View` can solve the problem, use `View`.\n\n### Mistake 2: Confusing modules and components\n\nRemember:\n\n```\nModule → functionality\n\nComponent → UI\n```\n\n### Mistake 3: Assuming every custom design needs native code\n\nMost custom designs can be built using existing React Native components.\n\n### Mistake 4: Forgetting Android\n\nA component that works on iOS isn't automatically an Android implementation."
      ],
      "quiz": [
        {
          "question": "What is the main purpose of a Fabric native component?",
          "options": [
            "A. Store data",
            "B. Render native UI that can be controlled from React Native",
            "C. Replace TypeScript",
            "D. Manage authentication"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn23-2",
      "title": "Native side vs JavaScript-facing props and events",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nNow let's look at the most important design problem:\n\n> **How does JavaScript communicate with the native component?**\n\nImagine:\n\n```\n<Gauge\nvalue={75}\ncolor=\"green\"\nonValueReached={handleReached}\n/>\n```\n\nThere are three important pieces here:\n\n```\nvalue\ncolor\nonValueReached\n```\n\nThe first two are **props**.\n\nThe last one is an **event**.\n\n---\n\n# What are props?\n\n**Props** are values that a parent component gives to a child component.\n\nYou've already used props with normal React components:\n\n```\nfunction Greeting({ name }) {\nreturn <Text>Hello {name}</Text>;\n}\n```\n\nYou might use your native component like this:\n\n```\n<Gauge value={75} />\n```\n\nHere:\n\n```\nvalue = 75\n```\n\nis a prop.\n\n---\n\n## Native component props\n\nA Fabric component can have props such as:\n\n```\nvalue\ncolor\nminimum\nmaximum\nenabled\n```\n\nFor example:\n\n```\n<Gauge\nvalue={75}\nminimum={0}\nmaximum={100}\ncolor=\"blue\"\nenabled={true}\n/>\n```\n\nThe JavaScript side describes **what the component should be like**.\n\nThe native side decides **how to make that happen**.\n\n---\n\n## Think of props as instructions\n\nFor example:\n\n```\n<Gauge value={75} color=\"blue\" />\n```\n\nmeans something like:\n\n```\nJavaScript says:\n\n\"Show a gauge with a value of 75\nand use blue as its color.\"\n```\n\nNative code receives that information and updates the native view.\n\n---\n\n# What are events?\n\nNow imagine the native gauge detects something interesting.\n\nFor example:\n\n```\nGauge reaches 100\n```\n\nNative code needs a way to tell JavaScript.\n\nThat's an **event**.\n\nFor example:\n\n```\n<Gauge\nvalue={75}\nonValueReached={(event) => {\n  console.log(\"Reached:\", event.value);\n}}\n/>\n```\n\nThe direction is now reversed:\n\n```\nJavaScript\n   ↓\n  props\n   ↓\nNative component\n   ↓\n  event\n   ↓\nJavaScript\n```\n\n---\n\n## Props and events work in opposite directions\n\nThis is one of the most important concepts to understand.\n\n### Props\n\n```\nJavaScript\n   ↓\nNative\n```\n\n### Events\n\n```\nNative\n   ↓\nJavaScript\n```\n\nTogether:\n\n```\n           JavaScript\n            ↕      ↕\n         props    events\n            ↕      ↕\n         Native Component\n```\n\n---\n\n# Example: Volume control\n\nImagine a native volume slider.\n\nJavaScript might provide:\n\n```\n<NativeVolumeSlider\nvalue={0.5}\n/>\n```\n\nThe native component displays the slider at 50%.\n\nNow the user moves the slider.\n\nNative code detects:\n\n```\nUser moved slider\n     ↓\nNew value = 0.72\n```\n\nIt sends an event:\n\n```\nonValueChange\n```\n\nJavaScript receives:\n\n```\nfunction handleChange(event) {\nconsole.log(event.value);\n}\n```\n\nThe complete flow is:\n\n```\nJS\n↓\nvalue={0.5}\n↓\nNative slider\n↓\nUser interaction\n↓\nNative detects 0.72\n↓\nonValueChange\n↓\nJS receives 0.72\n```\n\n---\n\n# What crosses the JSI boundary?\n\nYou heard about **JSI** on Day 2.\n\nJSI stands for **JavaScript Interface**.\n\nIt provides a lower-level way for JavaScript to communicate with native/C++ functionality.\n\nFor a native component, information needs to move between the JavaScript world and native world.\n\nFor example:\n\n```\nJavaScript\n  ↓\nvalue = 75\n  ↓\nNative component\n```\n\nand:\n\n```\nNative component\n  ↓\nevent: value = 80\n  ↓\nJavaScript\n```\n\nThe exact internal implementation is more complicated than this diagram, but this is the mental model you should keep.\n\n---\n\n# Why types matter\n\nNative boundaries are a place where mistakes can become difficult.\n\nSuppose JavaScript says:\n\n```\nvalue: number\n```\n\nbut native code expects:\n\n```\nstring\n```\n\nYou now have a mismatch.\n\nA strong component contract should define:\n\n```\nvalue → number\ncolor → string\nenabled → boolean\n```\n\nFor example:\n\n```\ntype GaugeProps = {\nvalue: number;\ncolor?: string;\nenabled?: boolean;\n};\n```\n\nThis gives JavaScript developers a clear contract.\n\n---\n\n# What makes a good native component API?\n\nA good API is:\n\n### Small\n\nExpose only what JavaScript needs.\n\n### Predictable\n\nUse familiar prop and event names.\n\n### Typed\n\nClearly define the expected types.\n\n### Platform-independent when possible\n\nPrefer:\n\n```\n<Gauge value={75} />\n```\n\nover:\n\n```\n<AndroidGaugeNativeProgressThing />\n```\n\nunless platform-specific behavior is genuinely required.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Props send information from JavaScript to native.\n- Events send information from native back to JavaScript.\n- JSI is part of the communication infrastructure in the New Architecture.\n- A good native component should expose a simple, typed API.\n- The native implementation can be complicated while the JavaScript API stays simple."
      ],
      "commonMistakes": [
        "### Mistake 1: Using events for values that should simply be props\n\nIf JavaScript controls the value, use a prop.\n\n### Mistake 2: Forgetting to expose user interaction events\n\nIf the user interacts with your native control, JavaScript usually needs to know about important changes.\n\n### Mistake 3: Sending huge amounts of data unnecessarily\n\nKeep the JS/native communication focused.\n\n### Mistake 4: Making the JavaScript API platform-specific\n\nHide platform differences whenever practical."
      ],
      "quiz": [
        {
          "question": "Which direction do props normally travel?",
          "options": [
            "A. Native → JavaScript",
            "B. JavaScript → Native",
            "C. Database → Native",
            "D. Server → JavaScript"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn23-3",
      "title": "Props and events across the JSI boundary",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nLet's go one level deeper.\n\nYou don't need to become a C++ expert to understand Fabric, but you should understand what happens conceptually when data crosses between JavaScript and native code.\n\nImagine:\n\n```\n<Gauge value={80} />\n```\n\nReact knows:\n\n```\nGauge\nvalue = 80\n```\n\nFabric needs to ensure the native component receives that value.\n\nConceptually:\n\n```\nReact\n↓\nFabric\n↓\nNative component\n↓\nNative property updated\n```\n\n---\n\n# Updating a prop\n\nSuppose the value changes:\n\n```\n<Gauge value={50} />\n```\n\nbecomes:\n\n```\n<Gauge value={80} />\n```\n\nReact recognizes that the component needs an update.\n\nConceptually:\n\n```\nOld props\nvalue = 50\n\n      ↓\n\nNew props\nvalue = 80\n\n      ↓\n\nFabric update\n\n      ↓\n\nNative gauge\nvalue = 80\n```\n\nThe native UI can then redraw or update itself.\n\n---\n\n# Events work in reverse\n\nNow suppose the native component is interactive.\n\nThe user touches it.\n\n```\nUser\n↓\nNative component\n↓\nNative event\n↓\nReact Native event system\n↓\nJavaScript callback\n```\n\nFor example:\n\n```\n<NativeSlider\nonValueChange={(event) => {\n  setValue(event.nativeEvent.value);\n}}\n/>\n```\n\nThe native component generates the event.\n\nReact Native delivers it to JavaScript.\n\n---\n\n# Why not send everything across the boundary?\n\nCommunication between JavaScript and native code isn't free.\n\nImagine a native component generating thousands of events every second:\n\n```\nNative\n↓\nevent\n↓\nJS\n↓\nevent\n↓\nJS\n↓\nevent\n↓\nJS\n...\n```\n\nThat could create unnecessary work.\n\nA good native component should think carefully about:\n\n- How often events are emitted\n- How much data each event contains\n- Whether JavaScript actually needs every event\n- Whether some work can remain native\n\n---\n\n# Example: Gesture tracking\n\nImagine a native component tracking a finger.\n\nIt could potentially generate:\n\n```\nx = 1\nx = 2\nx = 3\nx = 4\nx = 5\n...\n```\n\nhundreds of times per second.\n\nYou don't automatically want every tiny movement to become a JavaScript update.\n\nThis is especially important for smooth interactions.\n\nThis connects directly to what you learned on Day 7 about UI-thread animations and gestures.\n\n---\n\n# Native work vs JavaScript work\n\nA useful question is:\n\n> **Does JavaScript really need to know about this?**\n\nSuppose a native component has an animation:\n\n```\nNative\n↓\nAnimation runs\n↓\nNative\n↓\nNative\n↓\nNative\n```\n\nIf JavaScript doesn't need the intermediate values, don't constantly send them to JavaScript.\n\nInstead:\n\n```\nNative\n↓\nAnimation\n↓\nFinal important event\n↓\nJavaScript\n```\n\nThis can reduce unnecessary communication.\n\n---\n\n# Example: Native gauge\n\nSuppose the gauge animates from:\n\n```\n50 → 75\n```\n\nYou don't necessarily need:\n\n```\n51\n52\n53\n54\n55\n...\n74\n75\n```\n\nto travel to JavaScript.\n\nThe native component can perform the visual animation itself.\n\nJavaScript might only care when:\n\n```\nAnimation finished\n```\n\nSo:\n\n```\nJS\n↓\nvalue = 75\n↓\nNative animation\n↓\nAnimation completes\n↓\nonAnimationComplete\n↓\nJS\n```\n\nThis is a much cleaner design.\n\n---\n\n# What is the component contract?\n\nThe **component contract** is the agreement between JavaScript and native code.\n\nFor example:\n\n```\nGaugeProps\n\nvalue:\nnumber\n\nminimum:\nnumber\n\nmaximum:\nnumber\n\ncolor:\nstring\n```\n\nAnd events:\n\n```\nonValueChange:\nevent containing value\n\nonReachedMaximum:\nevent containing final value\n```\n\nThis contract needs to stay consistent.\n\nIf JavaScript expects:\n\n```\nvalue: number\n```\n\nthe native side must understand that.\n\n---\n\n# Why Codegen matters here\n\nThis connects directly to Day 22.\n\nCodegen can help generate the native pieces based on the component's declared interface.\n\nConceptually:\n\n```\nComponent specification\n      ↓\n    Codegen\n      ↓\nGenerated native interfaces\n      ↓\nYour native implementation\n```\n\nSo instead of manually keeping every part synchronized, the specification becomes the source of truth for the component's interface.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Props flow from JavaScript toward the native component.\n- Events flow from the native component toward JavaScript.\n- Fabric manages the modern rendering side of native components.\n- Avoid sending unnecessary high-frequency data to JavaScript.\n- Let native code handle work that doesn't need JavaScript.\n- A clear component contract is extremely important."
      ],
      "commonMistakes": [
        "### Mistake 1: Sending every animation frame to JavaScript\n\nUsually unnecessary.\n\n### Mistake 2: Making events contain huge objects\n\nSend only the information JavaScript needs.\n\n### Mistake 3: Having different contracts on iOS and Android\n\nTry to keep the JS-facing API consistent.\n\n### Mistake 4: Forgetting that native UI has its own lifecycle\n\nThe native component can be created, updated, attached, detached, and destroyed."
      ],
      "quiz": [
        {
          "question": "Why shouldn't a native component send every tiny animation update to JavaScript?",
          "options": [
            "A. JavaScript cannot receive numbers",
            "B. It can create unnecessary communication and JS work",
            "C. Events don't work in Fabric",
            "D. Props cannot contain numbers"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn23-4",
      "title": "When is a Fabric component actually worth it?",
      "durationMinutes": 15,
      "explanation": "⏱ **15 min**\n\n## Explanation\n\nThis is probably the most important practical lesson of Day 23.\n\nYou now know how Fabric components work.\n\nBut should you actually build one?\n\nUsually:\n\n> **No.**\n\nMost applications don't need custom Fabric components.\n\nYou should first ask whether you can compose existing React Native components.\n\n---\n\n# What is composition?\n\n**Composition** means building something complicated by combining smaller existing pieces.\n\nFor example:\n\n```\n<View>\n<Text>75%</Text>\n<View />\n<Pressable />\n</View>\n```\n\nYou are composing existing components into a new UI.\n\nThis is one of React's biggest strengths.\n\n---\n\n# Example: Custom card\n\nSuppose you want:\n\n```\n┌─────────────────┐\n│ Product         │\n│ $49             │\n│                 │\n│ [ Buy ]         │\n└─────────────────┘\n```\n\nYou don't need a native component.\n\nUse:\n\n```\nView\nText\nPressable\nImage\n```\n\nThat's composition.\n\n---\n\n# When composition is better\n\nPrefer normal React Native components when:\n\n- The UI is mostly visual.\n- Standard views can represent it.\n- JavaScript controls the behavior.\n- You don't need a specialized native SDK.\n- Performance is acceptable.\n- Platform differences are small.\n\nFor example:\n\n```\nCards\nButtons\nForms\nMenus\nLists\nProfile screens\nSettings screens\nDashboards\n```\n\nThese generally don't require custom Fabric components.\n\n---\n\n# When a Fabric component might make sense\n\nConsider a native component when the UI requires something that ordinary React Native components cannot reasonably provide.\n\nExamples could include:\n\n### Specialized native controls\n\nA platform-specific control that doesn't have a good React Native equivalent.\n\n### Existing native SDK UI\n\nA third-party SDK might provide a native view that needs to be embedded into React Native.\n\n### Highly specialized rendering\n\nFor example, a complex visualization that benefits from native rendering.\n\n### Platform-specific functionality\n\nSometimes iOS and Android provide native UI that you need to expose to JavaScript.\n\n### Performance-sensitive native UI\n\nIf the component must perform work close to the native rendering system and JavaScript composition isn't appropriate.\n\n---\n\n# A decision framework\n\nBefore writing a Fabric component, ask these questions.\n\n## Question 1: Can normal React Native components solve this?\n\nIf yes:\n\n```\nUse React Native\n```\n\n---\n\n## Question 2: Can an existing library solve it?\n\nIf yes:\n\n```\nUse the library\n```\n\n---\n\n## Question 3: Is the problem actually about functionality rather than UI?\n\nIf yes, maybe you need a:\n\n```\nNative Module\n```\n\nrather than a Fabric component.\n\n---\n\n## Question 4: Does the actual UI need to be native?\n\nIf yes:\n\n```\nConsider Fabric\n```\n\n---\n\n## Question 5: Is the performance or platform requirement strong enough to justify native complexity?\n\nIf no:\n\n```\nStay with React Native\n```\n\nIf yes:\n\n```\nBuild the native component\n```\n\n---\n\n# Native module vs Fabric component\n\nThis comparison is worth memorizing.\n\n| Problem | Usually use |\n| --- | --- |\n| Get battery level | Native Module |\n| Access a native API | Native Module |\n| Perform native operation | Native Module |\n| Display a custom native control | Fabric Component |\n| Embed a native UI control | Fabric Component |\n| Receive user interaction from native UI | Fabric Component |\n| Render specialized native UI | Fabric Component |\n\nThe distinction is:\n\n```\nNative Module\n→ \"Give me functionality.\"\n\nFabric Component\n→ \"Give me UI.\"\n```\n\n---\n\n# Composition vs Fabric\n\nImagine you need a circular progress indicator.\n\n### Option A — Composition\n\n```\n<View>\n<View />\n<Text>75%</Text>\n</View>\n```\n\nYou can style and animate it using React Native.\n\n### Option B — Fabric\n\n```\n<NativeCircularProgress\nvalue={75}\n/>\n```\n\nThe native implementation handles the rendering.\n\nWhich should you choose?\n\nDon't decide based on:\n\n> \"Native sounds faster.\"\n\nInstead ask:\n\n```\nCan React Native meet the actual requirements?\n```\n\nIf yes, composition is usually simpler.\n\n---\n\n# Why simplicity matters\n\nA native component can introduce:\n\n```\nTypeScript\n+\nNative component specification\n+\nCodegen\n+\niOS implementation\n+\nAndroid implementation\n+\nBuild configuration\n+\nTesting\n+\nPlatform differences\n```\n\nThat's a lot of moving parts.\n\nA normal React Native component might only require:\n\n```\nTypeScript\n+\nReact Native components\n```\n\nSo native code needs a real justification.\n\n---\n\n# Key Takeaways\n\n- Prefer composition when existing React Native components can solve the problem.\n- A Fabric component is justified when you genuinely need specialized native UI.\n- Don't confuse \"possible\" with \"necessary.\"\n- Native components increase development and maintenance costs.\n- Use native modules for functionality and Fabric components for UI.\n- Keep the JavaScript API small and platform-independent when possible.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [
        "### Mistake 1: \"Native must be faster\"\n\nNot automatically.\n\nNative complexity doesn't guarantee a better result.\n\n### Mistake 2: Building native UI for ordinary screens\n\nA settings screen doesn't need a Fabric component.\n\n### Mistake 3: Ignoring maintenance\n\nRemember that you may need:\n\n```\niOS\n+\nAndroid\n+\nJavaScript\n```\n\n### Mistake 4: Designing different JavaScript APIs for each platform\n\nTry to hide platform differences behind one API."
      ],
      "quiz": [
        {
          "question": "You need to build a normal profile card using `View`, `Text`, `Image`, and `Pressable`. What should you use?",
          "options": [
            "A. A custom Fabric component",
            "B. Normal React Native components",
            "C. A TurboModule",
            "D. C++ directly"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    }
  ],
  "finalQuiz": [
    {
      "question": "What is the main purpose of a Fabric native component?",
      "options": [
        "A. Store data",
        "B. Render native UI that can be controlled from React Native",
        "C. Replace TypeScript",
        "D. Manage authentication"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "Which direction do props normally travel?",
      "options": [
        "A. Native → JavaScript",
        "B. JavaScript → Native",
        "C. Database → Native",
        "D. Server → JavaScript"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "Why shouldn't a native component send every tiny animation update to JavaScript?",
      "options": [
        "A. JavaScript cannot receive numbers",
        "B. It can create unnecessary communication and JS work",
        "C. Events don't work in Fabric",
        "D. Props cannot contain numbers"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "You need to build a normal profile card using `View`, `Text`, `Image`, and `Pressable`. What should you use?",
      "options": [
        "A. A custom Fabric component",
        "B. Normal React Native components",
        "C. A TurboModule",
        "D. C++ directly"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "What does a Fabric component expose to React Native?",
      "options": [
        "A. Typed props, events, and native rendering behavior",
        "B. Only JavaScript state",
        "C. A database schema",
        "D. An HTTP cache"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why should Fabric props be kept small and explicit?",
      "options": [
        "A. They form a cross-language contract",
        "B. They replace native views",
        "C. They disable Codegen",
        "D. They avoid all rendering"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should carry a native interaction back to JavaScript?",
      "options": [
        "A. A typed event",
        "B. A global variable",
        "C. A CSS class",
        "D. A route string"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "When is a custom Fabric component worthwhile?",
      "options": [
        "A. When a feature requires specialized native UI behavior",
        "B. For ordinary text labels",
        "C. For every screen",
        "D. Only for API fetching"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What helps keep the JSI boundary safe?",
      "options": [
        "A. Codegen-generated types",
        "B. Untyped dictionaries everywhere",
        "C. Deep imports",
        "D. Manual string parsing"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Where should platform-specific rendering logic live?",
      "options": [
        "A. On the native side behind a stable component contract",
        "B. Inside every screen",
        "C. In route parameters",
        "D. In AsyncStorage"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "Self-Check — Build a Custom Fabric Component",
    "goal": "Build a Custom Fabric Component",
    "brief": "Now let's put everything together.\n\nYour goal is to build a simple native UI component.\n\nWe'll use a **native gauge** as the example.\n\nThe final JavaScript API should look something like:\n\n```\n<Gauge\n value={75}\n maximum={100}\n color=\"blue\"\n/>\n```\n\nAnd the screen might look like:\n\n```\n┌──────────────────────────┐\n│                          │\n│          75%             │\n│      ╭────────╮          │\n│    ╱            ╲        │\n│   │    Gauge     │       │\n│    ╲            ╱        │\n│      ╰────────╯          │\n│                          │\n└──────────────────────────┘\n```\n\n---\n\n# Step 1 — Define the JavaScript API\n\nStart with the interface.\n\nYou might define:\n\n```\nGauge\n\nProps:\n- value: number\n- maximum: number\n- color: string\n```\n\nThe important thing is that you decide the API before worrying about native implementation.\n\n---\n\n# Step 2 — Define the behavior\n\nSuppose:\n\n```\nvalue = 75\nmaximum = 100\n```\n\nThe native component should understand:\n\n```\n75 / 100 = 75%\n```\n\nThen render the gauge accordingly.\n\nYou could also define an event:\n\n```\nonValueChange\n```\n\nif the gauge is interactive.\n\n---\n\n# Step 3 — Define the component contract\n\nYour contract could conceptually be:\n\n```\nGaugeProps\n\nvalue:\nnumber\n\nmaximum:\nnumber\n\ncolor:\nstring\n\nonValueChange:\nevent\n```\n\nThis contract should be shared between the JavaScript and native sides.\n\n---\n\n# Step 4 — Create the native implementation\n\nNow implement the actual UI separately for each platform where required.\n\nConceptually:\n\n```\nGauge\n├── iOS native implementation\n└── Android native implementation\n```\n\nThe implementations don't have to be internally identical.\n\nThey only need to honor the same JavaScript-facing contract.\n\n---\n\n# Step 5 — Connect the component through Fabric\n\nFabric connects the React Native component representation to the native UI.\n\nConceptually:\n\n```\n<Gauge value={75} />\n       ↓\nReact\n       ↓\nFabric\n       ↓\nNative Gauge\n       ↓\nScreen\n```\n\n---\n\n# Step 6 — Test prop updates\n\nStart with:\n\n```\n<Gauge value={25} />\n```\n\nThen change it:\n\n```\n<Gauge value={75} />\n```\n\nVerify that the native component updates.\n\nYou should see:\n\n```\n25%\n↓\n75%\n```\n\nwithout recreating the entire application.\n\n---\n\n# Step 7 — Add an event\n\nIf your gauge is interactive, let the native component send an event.\n\nFor example:\n\n```\n<Gauge\n value={value}\n onValueChange={(event) => {\n   setValue(event.nativeEvent.value);\n }}\n/>\n```\n\nNow the complete loop becomes:\n\n```\nJavaScript\n  ↓\nvalue prop\n  ↓\nNative Gauge\n  ↓\nUser interaction\n  ↓\nNative event\n  ↓\nJavaScript\n  ↓\nsetValue()\n  ↓\nNew prop\n  ↓\nNative Gauge\n```\n\nThis is a real two-way interaction.\n\n---\n\n# Step 8 — Test both platforms\n\nTest the component on:\n\n```\niOS\n```\n\nand:\n\n```\nAndroid\n```\n\nCheck:\n\n- Initial rendering\n- Prop updates\n- Events\n- Layout\n- Colors\n- Accessibility\n- Rotation\n- Different screen sizes\n- Component mounting/unmounting\n\n---\n\n# Step 9 — Test unmounting\n\nThis is easy to forget.\n\nTry:\n\n```\n{showGauge && <Gauge value={75} />}\n```\n\nThen:\n\n```\nsetShowGauge(false);\n```\n\nThe native component should clean itself up correctly.\n\nYou don't want:\n\n```\nReact component disappears\n       ↓\nNative object remains forever\n       ↓\nMemory/resource leak\n```\n\nA **memory leak** is when a program keeps resources it no longer needs, causing memory usage to grow unnecessarily.\n\n---\n\n# Step 10 — Think about accessibility\n\nA native UI component isn't finished just because it looks correct.\n\nAsk:\n\n- Can a screen reader understand it?\n- Does it have an accessible label?\n- Does it expose its current value?\n- Can users interact with it using accessibility tools?\n- Is the meaning understandable without relying only on color?\n\nFor example, don't communicate:\n\n```\nGreen = good\nRed = bad\n```\n\nwithout providing another way for users to understand the state.",
    "steps": [],
    "acceptance": [
      "You have a custom native UI component.",
      "JavaScript can render it.",
      "Props can be passed from JavaScript to native.",
      "The native component responds to prop changes.",
      "Native events can reach JavaScript if needed.",
      "The component works on your target platform(s).",
      "The component can mount and unmount correctly.",
      "You have considered accessibility.",
      "You understand the difference between a Fabric component and a native module.",
      "You can explain why this component needed to be native instead of being composed from ordinary React Native views."
    ],
    "stretch": [],
    "footer": "Once your gauge works, try adding:\n\n### 1\\. Animation\n\nAnimate:\n\n```\n25 → 75\n```\n\ninstead of immediately jumping.\n\n### 2\\. Multiple props\n\nAdd:\n\n```\nminimum\nmaximum\ntrackColor\nprogressColor\nstrokeWidth\n```\n\n### 3\\. Events\n\nAdd:\n\n```\nonValueChange\nonReachedMaximum\nonAnimationComplete\n```\n\n### 4\\. Accessibility\n\nExpose:\n\n```\nCurrent value: 75 percent\n```\n\nto accessibility services.\n\n### 5\\. Platform-specific behavior\n\nMake the iOS and Android implementations look slightly different while keeping the same JavaScript API.\n\nFor example:\n\n```\n<Gauge value={75} />\n```\n\nremains identical on both platforms.\n\n---\n\n# 🧠 Final Mental Model\n\nDay 22 taught you:\n\n```\nJavaScript\n  ↓\nNative Module\n  ↓\nNative functionality\n```\n\nDay 23 adds:\n\n```\nJavaScript\n  ↓\nFabric Component\n  ↓\nNative UI\n```\n\nTogether:\n\n```\n                  React Native\n                       │\n           ┌───────────┴───────────┐\n           ↓                       ↓\n     Native Module          Fabric Component\n           ↓                       ↓\n     Native behavior          Native UI\n           ↓                       ↓\n     OS functionality        Screen rendering\n```\n\nAnd the communication model is:\n\n```\n           JavaScript\n            ↕     ↕\n         props   events\n            ↕     ↕\n        Fabric Component\n               ↓\n         Native UI\n```\n\nThe most important rule to remember is:\n\n> **Use a Fabric native component when you genuinely need native UI. If existing React Native components can express the UI, composition is usually the simpler choice.**"
  }
});

