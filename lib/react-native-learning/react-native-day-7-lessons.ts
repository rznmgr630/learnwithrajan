import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";
import { REACT_NATIVE_DAY_7_FINAL_QUIZ } from "@/lib/react-native-learning/react-native-final-quizzes";

export const REACT_NATIVE_DAY_7_LESSONS = normalizePastedLessonDay({
  "day": 7,
  "title": "Gestures and Animation",
  "overview": "Today we're moving from static UI to UI that responds to movement.\n\nSo far, you've learned how to:\n\nbuild screens\n\nstyle components\n\nnavigate between screens\n\nrender lists efficiently\n\nNow we're going to make those screens move.\n\nYou'll learn how React Native animations work, why the UI thread matters, how gestures such as swiping and pinching work, and how libraries like Reanimated and Gesture Handler make these interactions much smoother.\n\nBy the end, you'll build a swipe-to-dismiss card that continues to animate smoothly even when the JavaScript thread is busy.",
  "totalMinutes": 45,
  "difficulty": "Beginner",
  "lessons": [
    {
      "id": "rn7-reanimated-ui-thread",
      "title": "Reanimated — Animations on the UI Thread",
      "durationMinutes": 7,
      "explanation": "Let's start with the main library we'll use today:\n\nReact Native Reanimated.\n\nReanimated is a library for creating animations and interactions in React Native.\n\nThe important idea is that many Reanimated animations can run on the UI thread instead of depending on the JavaScript thread for every frame.\n\nThat distinction is extremely important.\n\nWhat is the JavaScript thread?\n\nYour React Native application contains JavaScript code.\n\nFor example:\n\nconst handlePress = () => {\nconsole.log(\"Button pressed\");\n};\n\nThat code runs through the JavaScript side of your application.\n\nThe JavaScript thread is responsible for a lot of application logic:\n\nAPI requests\nState updates\nBusiness logic\nEvent handling\nRendering decisions\nJavaScript calculations\n\nWhat is the UI thread?\n\nThe UI thread is responsible for work related to displaying and updating the user interface.\n\nThink of it as the part of the application that needs to keep the screen moving smoothly.\n\nFor example:\n\nUser drags finger\n↓\nScreen moves\n↓\nNext frame\n↓\nScreen moves\n↓\nNext frame\n\nFor a smooth gesture or animation, these updates need to happen quickly.\n\nWhy can the JavaScript thread become a problem?\n\nImagine your application is doing something expensive:\n\nJavaScript thread\n│\n├── Large calculation\n├── Processing data\n├── API response\n├── State updates\n└── Other JavaScript work\n\nNow the user starts dragging a card.\n\nIf every movement depends on JavaScript being available, the animation can become less responsive.\n\nYou might see:\n\nSmooth\n████████████████████\n\nBusy JS thread\n███ ██ █ ██ ███\n\nThat visible stuttering is often called jank (uneven or stuttering movement).\n\nReanimated's approach\n\nReanimated allows animation logic to run closer to the UI side.\n\nConceptually:\n\nTraditional approach\n\nFinger\n↓\nJavaScript\n↓\nUI\n↓\nScreen\n\nReanimated\n\nFinger\n↓\nUI thread\n↓\nScreen\n\nThis can reduce the dependency on JavaScript for every animation frame.\n\nReanimated v3 and v4\n\nYou'll see both Reanimated 3 and Reanimated 4 in React Native resources.\n\nThe exact installation and configuration can depend on your React Native and Expo version.\n\nThe core concepts we're learning remain important:\n\nShared values\nAnimated styles\nWorklets\nDerived values\nGestures\nLayout animations",
      "diagram": "Reanimated\n│\n┌─────────┴─────────┐\n▼ ▼\nShared Values Worklets\n│ │\n└─────────┬─────────┘\n▼\nUI Thread\n│\n▼\nAnimation\n│\n▼\nScreen",
      "codeExample": {
        "title": "Code Example",
        "code": "A very small Reanimated animation might look like:\n\nimport Animated, {\nuseAnimatedStyle,\nuseSharedValue,\nwithTiming,\n} from \"react-native-reanimated\";\n\nconst opacity = useSharedValue(1);\n\nconst animatedStyle = useAnimatedStyle(() => {\nreturn {\nopacity: opacity.value,\n};\n});\n\nThen:\n\n<Animated.View style={animatedStyle} />\n\nIf you later change:\n\nopacity.value = 0;\n\nyou can animate that value:\n\nopacity.value = withTiming(0);\n\nwithTiming creates a timing-based animation."
      },
      "keyTakeaways": [
        "Reanimated is the main animation library for this track.\n\nIt can run animation logic on the UI thread.\n\nThis helps animations remain responsive when JavaScript is busy.\n\nReanimated provides shared values, animated styles, worklets, and more.\n\nYou don't need to understand everything at once."
      ],
      "commonMistakes": [
        "❌ Thinking every JavaScript operation is bad\n\nJavaScript is still extremely important.\n\nReanimated isn't replacing JavaScript.\n\nIt's giving animations a way to run independently from some JavaScript work.\n\n❌ Assuming an animation is automatically smooth\n\nA badly designed animation can still perform poorly.\n\nThe rest of today's lessons explain how to build animations correctly."
      ],
      "quiz": [
        {
          "question": "Why is running animation work on the UI thread useful?",
          "options": [
            "A. It can reduce dependence on a busy JavaScript thread",
            "B. It removes JavaScript from the application",
            "C. It makes API requests faster",
            "D. It replaces React"
          ],
          "correctIndex": 0,
          "explanation": "Answer: A"
        }
      ]
    },
    {
      "id": "rn7-worklets",
      "title": "Worklets — Functions That Run on the UI Thread",
      "durationMinutes": 5,
      "explanation": "Now we're going to learn one of Reanimated's most important concepts:\n\nWorklets.\n\nA worklet is a special function that Reanimated can execute in its UI-side environment.\n\nThink of a worklet as:\n\n\"This function is safe and prepared to run outside the normal JavaScript execution flow.\"\n\nYou may see code like:\n\nconst animatedStyle = useAnimatedStyle(() => {\n\"worklet\";\n\nreturn {\ntransform: [\n{\ntranslateX: 100,\n},\n],\n};\n});\n\nThe important part is:\n\n\"worklet\";\n\nWhat does \"worklet\" mean?\n\nThe string:\n\n\"worklet\";\n\nis called a directive (a special instruction written inside a function).\n\nIt tells Reanimated that the function is intended to execute as a worklet.\n\nIn many modern Reanimated APIs, tooling can automatically recognize certain callback functions as worklets, so you won't always manually write the directive.\n\nBut understanding what it means is important.\n\nWhy can't every JavaScript function become a worklet?\n\nBecause the UI-side environment doesn't automatically have access to everything available in normal JavaScript.\n\nFor example, imagine:\n\nconst secretData = someHugeApplicationObject;\n\nA worklet can't simply assume it can access every object, library, or API from the JavaScript environment.\n\nThis is why Reanimated has rules around what worklets can access.\n\nThink of worklets like a small independent workspace\n\nImagine your normal JavaScript:\n\nJavaScript world\n─────────────────────\nAPI\nState\nNavigation\nDatabase\nBusiness logic\nLibraries\n\nAnd your worklet:\n\nUI worklet world\n─────────────────────\nAnimation values\nGesture values\nSimple calculations\nAnimated styles\n\nYou can pass appropriate values between these worlds, but they aren't identical environments.\n\nExample\nconst x = useSharedValue(0);\n\nconst style = useAnimatedStyle(() => {\nreturn {\ntransform: [\n{\ntranslateX: x.value,\n},\n],\n};\n});\n\nThe function passed to useAnimatedStyle is designed to execute in Reanimated's animation environment.\n\nWhy this matters for gestures\n\nImagine the user moves their finger:\n\nFinger\n↓\nGesture position\n↓\nWorklet\n↓\nShared value\n↓\nAnimated style\n↓\nScreen moves\n\nThis can happen without requiring JavaScript to calculate every movement.\n\nThat's one of the major strengths of Reanimated.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "A worklet is a function that can execute in Reanimated's UI-side environment.\n\n\"worklet\" is a directive associated with worklet functions.\n\nModern Reanimated APIs can automatically recognize many worklet callbacks.\n\nWorklets have a different execution environment from normal JavaScript.\n\nWorklets are especially useful for gestures and animations."
      ],
      "commonMistakes": [
        "❌ Treating a worklet like a normal JavaScript function\n\nA worklet has restrictions.\n\nDon't assume you can freely access every JavaScript object or API from inside it."
      ],
      "quiz": [
        {
          "question": "What is a worklet?",
          "options": [
            "A. A special function that can run in Reanimated's UI-side environment",
            "B. A navigation screen",
            "C. A database",
            "D. An image format"
          ],
          "correctIndex": 0,
          "explanation": "Answer: A"
        }
      ]
    },
    {
      "id": "rn7-shared-values",
      "title": "Shared Values and Animated Styles",
      "durationMinutes": 7,
      "explanation": "Now we get to the heart of Reanimated.\n\nThree concepts are especially important:\n\nShared values\nAnimated styles\nDerived values\n\nLet's start with shared values.\n\nWhat is a shared value?\n\nA shared value is a value that Reanimated can update and use in its animation system.\n\nYou create one using:\n\nconst x = useSharedValue(0);\n\nInitially:\n\nx = 0\n\nThen you can update:\n\nx.value = 100;\n\nNotice:\n\nx.value\n\nnot:\n\nx\n\nThe .value property contains the current value.\n\nWhy not use useState?\n\nYou might ask:\n\n\"Why don't we just use React state?\"\n\nYou could use React state for many normal UI changes.\n\nBut animation values can change many times per second.\n\nFor example:\n\n0\n1\n2\n3\n4\n5\n6\n...\n100\n\nYou don't want every tiny animation update to behave like a normal React state update.\n\nShared values are designed specifically for this type of animation work.\n\nExample\nconst translateX = useSharedValue(0);\n\nThen:\n\ntranslateX.value = 100;\n\nThe value now represents:\n\nHorizontal position = 100\n\nuseAnimatedStyle\n\nNow we need to tell a component what to do with that value.\n\nThat's where:\n\nuseAnimatedStyle\n\ncomes in.\n\nExample:\n\nconst animatedStyle = useAnimatedStyle(() => {\nreturn {\ntransform: [\n{\ntranslateX: translateX.value,\n},\n],\n};\n});\n\nThen:\n\n<Animated.View style={animatedStyle}>\n<Text>Hello</Text>\n</Animated.View>\n\nNow the view's horizontal position is connected to the shared value.\n\nThe relationship\n\nThink of it like this:\n\nShared Value\n│\n│ translateX.value\n▼\nAnimated Style\n│\n▼\nAnimated.View\n│\n▼\nScreen\n\nIf the shared value changes:\n\n0 → 50 → 100 → 150\n\nthe animated style updates accordingly.\n\nwithTiming\n\nWe don't always want to jump immediately.\n\nWithout animation:\n\ntranslateX.value = 300;\n\nThe value changes directly.\n\nWith timing:\n\ntranslateX.value = withTiming(300);\n\nthe value gradually changes:\n\n0\n↓\n30\n↓\n60\n↓\n90\n↓\n...\n↓\n300\n\nThis creates movement.\n\nuseDerivedValue\n\nSometimes you don't want to store every value separately.\n\nYou can calculate one value from another.\n\nFor example:\n\nconst opacity = useDerivedValue(() => {\nreturn 1 - Math.abs(translateX.value) / 300;\n});\n\nHere:\n\ntranslateX\n↓\ncalculation\n↓\nopacity\n\nA derived value is a value calculated from another reactive value.\n\nExample\n\nIf:\n\ntranslateX = 0\n\nthen:\n\nopacity ≈ 1\n\nIf:\n\ntranslateX = 150\n\nthen:\n\nopacity ≈ 0.5\n\nIf:\n\ntranslateX = 300\n\nthen:\n\nopacity ≈ 0\n\nThis can create a nice swipe effect where the card becomes more transparent as it moves away.",
      "diagram": "translateX\n│\n▼\n┌──────────────┐\n│ Shared Value │\n└──────┬───────┘\n│\n┌─────────┴─────────┐\n▼ ▼\nAnimated Style Derived Value\n│ │\n▼ ▼\nPosition Opacity\n│ │\n└─────────┬─────────┘\n▼\nCard",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "useSharedValue creates animation-friendly values.\n\n.value contains the current value.\n\nuseAnimatedStyle connects values to component styles.\n\nwithTiming creates smooth timing-based transitions.\n\nuseDerivedValue calculates a value from another animated value.\n\nThese concepts form the foundation of Reanimated."
      ],
      "commonMistakes": [
        "❌ Forgetting .value\n\nWrong:\n\ntranslateX\n\nCorrect:\n\ntranslateX.value\n\nwhen reading the shared value inside the relevant Reanimated context.\n\n❌ Trying to use normal React state for every animation frame\n\nShared values are designed for high-frequency animation updates."
      ],
      "quiz": [
        {
          "question": "What does useSharedValue create?",
          "options": [
            "A. An animation-friendly value",
            "B. A navigation route",
            "C. A React component",
            "D. A database record"
          ],
          "correctIndex": 0,
          "explanation": "Answer: A"
        }
      ]
    },
    {
      "id": "rn7-gesture-handler",
      "title": "Gesture Handler — Turning Touch Into Interaction",
      "durationMinutes": 7,
      "explanation": "Animation becomes much more interesting when the user controls it.\n\nFor example:\n\nUser touches card\n↓\nUser moves finger\n↓\nCard follows finger\n↓\nUser releases\n↓\nCard returns or disappears\n\nThis is where react-native-gesture-handler comes in.\n\nIt provides gesture APIs for interactions such as:\n\npan\n\npinch\n\nlong press\n\ntap\n\nrotation\n\ncomposed gestures\n\nWhat is a gesture?\n\nA gesture is a recognizable movement or interaction made by the user.\n\nExamples:\n\nPan\n\nThe user drags something.\n\n←────────────→\nfinger\n\nPinch\n\nThe user uses two fingers to zoom.\n\n↘ ↙\nimage\n↗ ↖\n\nLong press\n\nThe user keeps their finger pressed.\n\nPress\n↓\nHold\n↓\nAction\n\nPan gesture\n\nA pan gesture is perfect for:\n\nSwipe cards\nDrag sliders\nMove panels\nDrag objects\n\nConceptually:\n\nconst pan = Gesture.Pan()\n.onChange((event) => {\ntranslateX.value = event.translationX;\n});\n\nThe exact API can vary with the installed Gesture Handler version, but the concept is:\n\nFinger movement\n↓\nGesture event\n↓\ntranslationX\n↓\nshared value\n↓\nanimated style\n↓\nUI\n\nPinch gesture\n\nA pinch gesture gives you information about how the user's fingers are moving relative to each other.\n\nThis is useful for:\n\nImage zoom\nMap zoom\nDocument zoom\nPhoto viewer\n\nConceptually:\n\nPinch\n↓\nScale value\n↓\nShared value\n↓\nAnimated transform\n↓\nZoom\n\nLong press\n\nA long press is useful when an action should happen only after the user holds something.\n\nFor example:\n\nHold course\n↓\nShow menu\n\nor:\n\nHold message\n↓\nShow actions\n\nComposing gestures\n\nSometimes you want more than one gesture.\n\nFor example:\n\nImage\n├── Pinch → zoom\n├── Pan → move\n└── Rotation → rotate\n\nGesture Handler allows gestures to be composed.\n\nComposing means combining multiple interactions so they can work together.",
      "diagram": "User\n│\n┌────────┼─────────┐\n▼ ▼ ▼\nPan Pinch Long Press\n│ │ │\n▼ ▼ ▼\nPosition Scale Action\n│ │\n└────┬───┘\n▼\nReanimated\n│\n▼\nScreen",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "Gesture Handler turns touch interactions into useful gesture events.\n\nPan is useful for dragging.\n\nPinch is useful for zooming.\n\nLong press is useful for hold-based actions.\n\nGestures can be combined.\n\nReanimated and Gesture Handler work especially well together."
      ],
      "commonMistakes": [
        "❌ Mixing gesture logic with lots of normal JavaScript work\n\nFor highly interactive gestures, keep the fast interaction path inside the gesture/Reanimated system where possible.\n\n❌ Forgetting boundaries\n\nA draggable object may need limits.\n\nFor example:\n\nMinimum X = -300\nMaximum X = 300\n\nYou don't always want the user to drag it infinitely far away."
      ],
      "quiz": [
        {
          "question": "Which gesture would you normally use for dragging a card?",
          "options": [
            "A. Pan",
            "B. Pinch",
            "C. Long press",
            "D. Rotation"
          ],
          "correctIndex": 0,
          "explanation": "Answer: A"
        }
      ]
    },
    {
      "id": "rn7-layout-animations",
      "title": "Layout Animations — Entering, Exiting, and LinearTransition",
      "durationMinutes": 5,
      "explanation": "So far, we've animated values ourselves.\n\nBut sometimes we simply want:\n\n\"When this component appears, animate it.\"\n\nor:\n\n\"When this component disappears, animate it.\"\n\nThat's where layout animations become useful.\n\nWhat are layout animations?\n\nA layout animation automatically animates changes to the position, size, or presence of UI elements.\n\nFor example:\n\nBefore:\n\nCard A\nCard B\nCard C\n\nRemove Card B:\n\nCard A\nCard C\n\nInstead of Card C instantly jumping upward:\n\nCard C\n↑\n\nwe can animate the movement.\n\nEntering animations\n\nAn entering animation runs when a component appears.\n\nFor example:\n\nComponent doesn't exist\n↓\nComponent appears\n↓\nFade / slide / scale\n↓\nNormal state\n\nConceptually:\n\n<Animated.View entering={FadeIn}>\n...\n</Animated.View>\n\nExiting animations\n\nAn exiting animation runs when a component is removed.\n\nFor example:\n\nComponent exists\n↓\nRemove requested\n↓\nFade out\n↓\nComponent disappears\n\nConceptually:\n\n<Animated.View exiting={FadeOut}>\n...\n</Animated.View>\n\nLinearTransition\n\nLinearTransition is useful when layout changes and you want the movement between the old and new layouts to animate.\n\nImagine:\n\nBefore\n\nA\nB\nC\n\nAfter removing B:\n\nA\nC\n\nInstead of:\n\nA\nC\n\ninstantly changing, C can smoothly move upward.\n\nWhy are layout animations useful?\n\nThey are especially useful for:\n\nAdding list items\nRemoving list items\nExpanding sections\nCollapsing sections\nReordering content\nShowing/hiding UI",
      "diagram": "Layout change\n│\n┌──────────┼──────────┐\n▼ ▼ ▼\nEntering Exiting Position\n│ │ │\n▼ ▼ ▼\nAppear Remove Move\n│ │ │\n└──────────┼──────────┘\n▼\nAnimation",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "Layout animations animate changes to the UI layout.\n\nEntering animations happen when elements appear.\n\nExiting animations happen when elements disappear.\n\nLinearTransition can animate movement caused by layout changes.\n\nThey can save you from manually calculating every animation."
      ],
      "commonMistakes": [],
      "quiz": [
        {
          "question": "What is an entering animation?",
          "options": [
            "A. An animation that runs when a component appears",
            "B. An animation that runs only on navigation",
            "C. An animation for API requests",
            "D. An animation that runs when JavaScript stops"
          ],
          "correctIndex": 0,
          "explanation": "Answer: A"
        }
      ]
    },
    {
      "id": "rn7-moti",
      "title": "Moti — A Higher-Level Animation API",
      "durationMinutes": 4,
      "explanation": "Reanimated is powerful.\n\nBut sometimes powerful means:\n\n\"There are a lot of concepts to understand.\"\n\nThat's where Moti can be useful.\n\nMoti is a higher-level animation library built around Reanimated.\n\nA higher-level API means an API that gives you simpler tools on top of more detailed lower-level functionality.\n\nThink:\n\nReanimated\n↓\nPowerful building blocks\n\nMoti\n↓\nSimpler animation interface\n\nWhy use Moti?\n\nImagine you want:\n\nFade in\nSlide in\nScale in\nAnimate when a value changes\n\nMoti can provide a more declarative (you describe what you want rather than manually controlling every step) way to express these animations.\n\nConceptual example\n\nYou might see something like:\n\n<MotiView\nfrom={{ opacity: 0 }}\nanimate={{ opacity: 1 }}\n\n>\n\n<Text>Hello</Text>\n</MotiView>\n\nThe idea is easy to understand:\n\nStart:\nopacity = 0\n\nAnimate to:\nopacity = 1\n\nMoti vs Reanimated\n\nThink of them as different levels:\n\n```\n               Your App\n                  │\n                  ▼\n                Moti\n         Simple animations\n                  │\n                  ▼\n             Reanimated\n        Animation engine/tools\n                  │\n                  ▼\n               UI Thread\n```\n\nMoti doesn't replace the ideas behind Reanimated.\n\nIt makes some common animation tasks easier.\n\nWhen should you use which?\n\nUse Reanimated when you need:\n\nComplex gestures\nAdvanced animations\nPrecise control\nDerived values\nCustom interaction logic\n\nMoti can be convenient when you want:\n\nSimple enter animations\nSimple transitions\nQuick UI animations\nLess animation boilerplate",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "Moti provides a higher-level API around Reanimated.\n\nIt can make common animations easier to write.\n\nReanimated gives you more direct control.\n\nYou should understand Reanimated concepts even if you use Moti."
      ],
      "commonMistakes": [],
      "quiz": [
        {
          "question": "What is Moti?",
          "options": [
            "A. A higher-level animation API built around Reanimated",
            "B. A database library",
            "C. A navigation library",
            "D. A networking library"
          ],
          "correctIndex": 0,
          "explanation": "Answer: A"
        }
      ]
    },
    {
      "id": "rn7-animated-api",
      "title": "Why the Old Animated API Still Exists",
      "durationMinutes": 4,
      "explanation": "React Native also has an older animation system called:\n\nAnimated\n\nYou may see code like:\n\nconst fadeAnim = new Animated.Value(0);\n\nand:\n\nAnimated.timing(fadeAnim, {\ntoValue: 1,\nduration: 500,\nuseNativeDriver: true,\n}).start();\n\nSo you might ask:\n\n\"If Reanimated exists, why does Animated still exist?\"\n\nBecause it is part of React Native's established API and many applications still use it.\n\nWhy isn't it always the first choice for this track?\n\nModern applications often need complex interactions:\n\nDrag\nSwipe\nPinch\nScroll\nGesture combinations\nShared animation values\nLayout transitions\n\nReanimated is particularly strong for these use cases.\n\nAnimated isn't useless\n\nThis is important.\n\nDon't think:\n\nAnimated = bad\nReanimated = good\n\nThat's too simplistic.\n\nThe better mental model is:\n\nAnimated\n↓\nEstablished React Native animation API\n\nReanimated\n↓\nModern animation + gesture-oriented system\n\nThere are applications where the old Animated API is completely reasonable.\n\nExample use case\n\nA simple fade animation might not require a complicated system.\n\nBut imagine:\n\nSwipe card\n+\nGesture\n+\nVelocity\n+\nSpring\n+\nOpacity\n+\nRotation\n+\nDismiss threshold\n\nNow Reanimated becomes especially useful.\n\nWhat is a spring?\n\nA spring animation tries to imitate physical spring-like movement.\n\nInstead of:\n\n0 → 100\n\nwith a fixed timing curve, the object can move more naturally:\n\n0\n↓\n80\n↓\n110\n↓\n98\n↓\n101\n↓\n100\n\nThis can create a physical-feeling interaction.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "React Native's old Animated API still exists.\n\nIt can still be useful.\n\nReanimated is often a better fit for complex gestures and modern interactive animations.\n\nDon't treat older APIs as automatically useless.\n\nChoose the simplest tool that satisfies your requirements."
      ],
      "commonMistakes": [
        "❌ Saying \"Animated is deprecated\"\n\nThat is not the right mental model.\n\nIt's an existing React Native API.\n\n❌ Using Reanimated for absolutely everything\n\nMore power also means more concepts.\n\nFor simple requirements, simple tools can sometimes be enough."
      ],
      "quiz": [
        {
          "question": "Why does the old Animated API still exist?",
          "options": [
            "A. It is an established React Native API that remains useful",
            "B. Reanimated cannot animate anything",
            "C. React Native doesn't support animation",
            "D. Animated is required for navigation"
          ],
          "correctIndex": 0,
          "explanation": "Answer: A"
        }
      ]
    },
    {
      "id": "rn7-swipe-dismiss",
      "title": "Putting Everything Together — Swipe-to-Dismiss",
      "durationMinutes": 5,
      "explanation": "Now we're going to combine everything.\n\nOur goal:\n\nBuild a card that follows the user's finger and disappears when the user swipes far enough.\n\nImagine:\n\n┌────────────────────┐\n│ │\n│ Course Card │\n│ │\n│ React Native │\n│ │\n└────────────────────┘\n\nThe user swipes right:\n\n┌────────────────────┐\n│ Course Card │ ─────────→\n└────────────────────┘\n\nIf the swipe is large enough:\n\nCard\n↓\nDismiss\n↓\nGone\n\nIf the swipe isn't large enough:\n\nCard\n↓\nSwipe\n↓\nRelease\n↓\nSpring back\n\nStep 1 — Create a shared value\n\nWe need to track horizontal movement:\n\nconst translateX = useSharedValue(0);\n\nThink:\n\ntranslateX = card's horizontal position\n\nStep 2 — Create the animated style\nconst animatedStyle = useAnimatedStyle(() => {\nreturn {\ntransform: [\n{\ntranslateX: translateX.value,\n},\n],\n};\n});\n\nNow the card's position is connected to the shared value.\n\nStep 3 — Add a pan gesture\n\nConceptually:\n\nconst panGesture = Gesture.Pan()\n.onChange((event) => {\ntranslateX.value = event.translationX;\n});\n\nNow:\n\nFinger moves\n↓\ntranslationX changes\n↓\ntranslateX changes\n↓\nCard moves\n\nStep 4 — Add a release action\n\nWhen the user releases their finger, we need to decide:\n\nWas the swipe far enough?\n\nFor example:\n\nthreshold = 150\n\nIf:\n\ntranslationX > 150\n\nwe can dismiss the card.\n\nOtherwise:\n\nspring back to 0\n\nStep 5 — Add rotation\n\nA swipe can feel more natural if the card rotates slightly.\n\nFor example:\n\nconst animatedStyle = useAnimatedStyle(() => {\nconst rotate = `${translateX.value / 20}deg`;\n\nreturn {\ntransform: [\n{\ntranslateX: translateX.value,\n},\n{\nrotate,\n},\n],\n};\n});\n\nNow:\n\nSwipe right\n↓\nMove right\n+\nRotate clockwise\n\nStep 6 — Add opacity\n\nWe can also calculate opacity from position.\n\nconst opacity = useDerivedValue(() => {\nreturn Math.max(\n0,\n1 - Math.abs(translateX.value) / 300\n);\n});\n\nMath.abs means absolute value (the distance from zero without considering whether the number is positive or negative).\n\nSo:\n\ntranslateX = 100\n\nand:\n\ntranslateX = -100\n\nhave the same distance:\n\n100\n\nStep 7 — Final mental model\n\nThe whole interaction becomes:\n\n```\n            User\n             │\n             ▼\n         Pan Gesture\n             │\n             ▼\n       translationX\n             │\n             ▼\n       Shared Value\n             │\n     ┌───────┴────────┐\n     ▼                ▼\n```\n\nAnimated Style Derived Value\n│ │\n▼ ▼\nPosition Opacity\n│ │\n└───────┬────────┘\n▼\nCard\n│\n┌───────┴────────┐\n▼ ▼\nSmall swipe Large swipe\n│ │\n▼ ▼\nSpring back Dismiss",
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
  "finalQuiz": REACT_NATIVE_DAY_7_FINAL_QUIZ,
  "project": {
    "name": "Build a Swipe-to-Dismiss Card",
    "goal": "Create a screen containing several cards.",
    "brief": "Create a screen containing several cards.\n\nFor example:\n\n┌─────────────────────────────┐\n│ │\n│ React Native │\n│ │\n│ Beginner Course │\n│ │\n│ Swipe me → │\n│ │\n└─────────────────────────────┘",
    "steps": [
      "Step 1 — Create the card\n\nStart with:\n\n<Animated.View style={animatedStyle}>\n<Text>React Native Course</Text>\n</Animated.View>",
      "Step 2 — Track movement\n\nCreate:\n\nconst translateX = useSharedValue(0);\n\nThen connect it to your gesture.",
      "Step 3 — Make the card follow the finger\n\nYour gesture should update:\n\ntranslationX\n↓\ntranslateX.value\n↓\nanimatedStyle\n\nThe card should feel attached to the user's finger.",
      "Step 4 — Add a dismiss threshold\n\nFor example:\n\n150 pixels\n\nIf the user releases after moving beyond that threshold:\n\nDismiss\n\nOtherwise:\n\nSpring back",
      "Step 5 — Add polish\n\nAdd:\n\nRotation\nOpacity\nSpring animation\nEntering animation\nExiting animation\n\nDon't add everything immediately.\n\nBuild it in small steps.",
      "🧪 The Important Performance Test\n\nNow comes the interesting part.\n\nWhile the card is being dragged, deliberately make the JavaScript thread busy.\n\nFor example, you could perform some intentionally expensive JavaScript work during a test.\n\nThe goal is not to make your production application slow.\n\nThe goal is to demonstrate this:\n\nJavaScript thread\n████████████████████\nBUSY\n\nUI thread\n████████████████████\nGesture\nAnimation\n↓\nSmooth\n\nYour card should continue responding smoothly because the gesture and animation are designed to run through Reanimated's UI-side execution model."
    ],
    "acceptance": [
      "Your card should:",
      "respond to a pan gesture",
      "follow the user's finger horizontally",
      "rotate slightly while moving",
      "become slightly transparent as it moves away",
      "return to its original position if the swipe is too small",
      "dismiss itself if the swipe crosses a threshold",
      "use Reanimated shared values",
      "use an animated style",
      "keep the animation on the UI side",
      "remain smooth while JavaScript is doing additional work"
    ],
    "footer": "🧠 Day 7 Mental Model\n\nIf today's lesson feels like a lot, remember this simple chain:\n\nUSER\n│\n│ touches / drags\n▼\nGESTURE HANDLER\n│\n│ gesture data\n▼\nSHARED VALUE\n│\n│ animation value\n▼\nREANIMATED\n│\n├── useAnimatedStyle\n├── useDerivedValue\n└── Worklets\n│\n▼\nUI THREAD\n│\n▼\nSMOOTH SCREEN UPDATE\n\nAnd when you need simpler animations:\n\nMoti\n↓\nHigher-level API\n↓\nReanimated\n\nThe most important concepts from Day 7 are:\n\nReanimated → animation system designed for smooth UI interactions.\n\nUI thread → where UI-related work can happen independently from normal JavaScript work.\n\nWorklet → a function that Reanimated can execute in its UI-side environment.\n\nShared value → animation-friendly value managed by Reanimated.\n\nuseAnimatedStyle → connects animation values to styles.\n\nuseDerivedValue → calculates one animated value from another.\n\nGesture Handler → turns touch movements into gestures.\n\nLayout animations → animate UI entering, exiting, and layout changes.\n\nMoti → simpler, higher-level animation API built around Reanimated.\n\nAnimated API → older React Native animation system that still has valid use cases.\n\nThe big idea is:\n\nAnimations describe movement. Gestures provide user input. Reanimated connects the two in a way that can keep the interaction smooth even when JavaScript is busy."
  }
});

