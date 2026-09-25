import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_ELECTIVE_B_LESSONS = normalizePastedLessonDay({
  "day": 47,
  "label": {
    "en": "Elective B",
    "np": "Elective B",
    "jp": "選択科目 B"
  },
  "title": "Advanced Skia and Custom Rendering",
  "overview": "Understand how to build visual experiences that go beyond normal React Native views.\n\nYou should finish this elective understanding:\n\n```text\nReact Native View\n       vs\nSkia Canvas\n       vs\nNative graphics API\n```\n\nand know when each one makes sense.",
  "totalMinutes": 60,
  "difficulty": "Advanced",
  "lessons": [
    {
      "id": "rn-elective-b-1",
      "title": "Why custom rendering?",
      "durationMinutes": 3,
      "explanation": "Normal React Native UI is excellent for:\n\n```text\nButtons\nForms\nCards\nLists\nMenus\nNavigation\nText\nImages\n```\n\nBut imagine you want:\n\n```text\nFinancial chart\nDrawing application\nInteractive graph\nWaveform\nParticle effect\nCustom visual editor\nGame-like UI\n```\n\nCreating thousands of normal React Native views may not be the right approach.\n\nThis is where custom rendering becomes useful.",
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
      "id": "rn-elective-b-2",
      "title": "What is Skia?",
      "durationMinutes": 3,
      "explanation": "React Native Skia provides a drawing system based on Skia, the graphics library used by major platforms such as Android and Chrome.\n\nInstead of:\n\n```text\nReact\n ↓\nView\n ↓\nText\n ↓\nImage\n```\n\nyou can think:\n\n```text\nReact\n ↓\nSkia Canvas\n ↓\nGraphics primitives\n ↓\nGPU / rendering pipeline\n```",
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
      "id": "rn-elective-b-3",
      "title": "Canvas mental model",
      "durationMinutes": 3,
      "explanation": "A canvas is a drawing surface.\n\nYou can draw:\n\n```text\nLines\nCircles\nPaths\nRectangles\nImages\nText\nGradients\nEffects\n```\n\nFor example:\n\n```tsx\n<Canvas style={{ flex: 1 }}>\n  <Circle cx={100} cy={100} r={50} color=\"blue\" />\n</Canvas>\n```\n\nInstead of creating a React Native `<View>` for the circle, you're asking the graphics engine to draw it.",
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
      "id": "rn-elective-b-4",
      "title": "Drawing paths",
      "durationMinutes": 3,
      "explanation": "A **path** describes a shape using drawing commands.\n\nConceptually:\n\n```text\nMove\n ↓\nLine\n ↓\nCurve\n ↓\nClose\n```\n\nFor example:\n\n```text\nM 10,100\nL 50,20\nL 100,100\nZ\n```\n\nThis could describe a triangle.\n\nPaths are extremely useful for:\n\n```text\nCharts\nDrawing tools\nIcons\nCustom shapes\nGraphs\n```",
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
      "id": "rn-elective-b-5",
      "title": "Why charts are a good Skia project",
      "durationMinutes": 3,
      "explanation": "A line chart may contain:\n\n```text\n10\n20\n40\n30\n60\n80\n```\n\nYou can transform those values into coordinates:\n\n```text\ndata\n ↓\nnormalization\n ↓\nx/y coordinates\n ↓\npath\n ↓\nSkia\n```\n\nFor example:\n\n```text\nData:\n\n10  20  40  30  60\n\n        ●\n     ●     ●\n  ●\n              ●\n```\n\nThe chart is generated from mathematical coordinates rather than dozens of UI components.",
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
      "id": "rn-elective-b-6",
      "title": "Build a chart from scratch",
      "durationMinutes": 3,
      "explanation": "Start with:\n\n```text\nChart\n ├── background\n ├── axes\n ├── grid\n ├── line\n └── points\n```\n\nThen add:\n\n```text\nTouch\n ↓\nFind nearest point\n ↓\nShow tooltip\n```\n\nNow you've created a real interactive graphics system.",
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
      "id": "rn-elective-b-7",
      "title": "Coordinate transformation",
      "durationMinutes": 3,
      "explanation": "Suppose:\n\n```text\nchart width = 300\nchart height = 200\n```\n\nand:\n\n```text\nvalues = [10, 20, 50, 30, 80]\n```\n\nYou need to convert:\n\n```text\ndata coordinates\n```\n\ninto:\n\n```text\nscreen coordinates\n```\n\nConceptually:\n\n```text\nx = index / (count - 1) * width\n\ny = height - normalizedValue * height\n```\n\nThe Y-axis is inverted because screen coordinates usually start at the top.\n\n```text\n0 ────────────────→ X\n│\n│\n│\n↓\nY\n```",
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
      "id": "rn-elective-b-8",
      "title": "Animating custom graphics",
      "durationMinutes": 3,
      "explanation": "Now combine Skia with Reanimated.\n\nFor example:\n\n```text\nData changes\n    ↓\nShared value\n    ↓\nAnimated path\n    ↓\nSkia rendering\n```\n\nThis can create:\n\n```text\nChart transitions\nAnimated progress\nGraph movement\nDrawing effects\n```",
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
      "id": "rn-elective-b-9",
      "title": "Shaders",
      "durationMinutes": 3,
      "explanation": "A **shader** is a program that calculates how pixels should be rendered.\n\nInstead of saying:\n\n> \"Draw this rectangle.\"\n\nyou can say:\n\n> \"For every pixel, calculate its visual appearance using this mathematical function.\"\n\nThat allows effects such as:\n\n```text\nGradients\nNoise\nDistortion\nGlow\nWave effects\nColor transformations\nProcedural backgrounds\n```\n\nThis is a much lower-level graphics concept.",
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
      "id": "rn-elective-b-10",
      "title": "Shader mental model",
      "durationMinutes": 3,
      "explanation": "Think:\n\n```text\nShape\n  ↓\nShader\n  ↓\nPixel calculation\n  ↓\nRendered image\n```\n\nFor example:\n\n```text\nNormal gradient\n\n████████████\n████████████\n████████████\n```\n\ncan become a dynamic shader effect:\n\n```text\n~~~~████~~~~\n~~~██████~~~\n~~████████~~\n```\n\nwhere the pixels are calculated dynamically.",
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
      "id": "rn-elective-b-11",
      "title": "Why shaders are powerful",
      "durationMinutes": 3,
      "explanation": "A normal approach might require:\n\n```text\n100 views\n+\n100 animations\n+\n100 calculations\n```\n\nA shader can sometimes express the same visual effect as:\n\n```text\nOne rendering operation\n+\nGPU calculations\n```\n\nThat doesn't mean shaders are automatically faster.\n\nIt means they give you a different computational model.",
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
      "id": "rn-elective-b-12",
      "title": "Shaders are not normal JavaScript",
      "durationMinutes": 3,
      "explanation": "Don't approach shader programming as:\n\n```ts\nconst pixels = pixels.map(...)\n```\n\nA shader executes in a graphics environment.\n\nYou need to think about:\n\n```text\nCoordinates\nPixels\nVectors\nColors\nTime\nTextures\nGPU execution\n```\n\nThis is why shaders are considered advanced graphics programming.",
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
      "id": "rn-elective-b-13",
      "title": "Build a drawing application",
      "durationMinutes": 3,
      "explanation": "A good project is a simple drawing tool.\n\nArchitecture:\n\n```text\nTouch gesture\n      ↓\nCoordinates\n      ↓\nPath\n      ↓\nSkia Canvas\n      ↓\nRendered stroke\n```\n\nThe user can:\n\n```text\nDraw\nUndo\nRedo\nClear\nChange stroke width\nChange color\n```\n\nNow you're combining:\n\n```text\nGesture handling\n+\nstate\n+\ngeometry\n+\ncustom rendering\n```",
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
      "id": "rn-elective-b-14",
      "title": "Gesture → graphics pipeline",
      "durationMinutes": 3,
      "explanation": "The complete flow looks like:\n\n```text\nFinger movement\n      ↓\nGesture Handler\n      ↓\nx/y coordinates\n      ↓\nPath construction\n      ↓\nSkia\n      ↓\nCanvas\n```\n\nFor a drawing application, this is much more natural than creating a React component for every point.",
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
      "id": "rn-elective-b-15",
      "title": "Performance and frame budgets",
      "durationMinutes": 3,
      "explanation": "Now comes the most important part.\n\nA mobile screen commonly targets:\n\n```text\n60 FPS\n```\n\nAt 60 FPS, you have approximately:\n\n```text\n16.67 ms\n```\n\nper frame.\n\nAt 120 FPS:\n\n```text\n8.33 ms\n```\n\nper frame.\n\nThat means:\n\n```text\n60 FPS\n≈ 16.67 ms/frame\n\n120 FPS\n≈ 8.33 ms/frame\n```\n\nYour rendering work must fit into that budget if you want smooth animation.",
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
      "id": "rn-elective-b-16",
      "title": "What happens when you miss the budget?",
      "durationMinutes": 3,
      "explanation": "Suppose you need:\n\n```text\n20 ms\n```\n\nto produce a frame on a 60 FPS target.\n\nYour frame budget is:\n\n```text\n16.67 ms\n```\n\nSo you miss the deadline.\n\nThe user may see:\n\n```text\nstutter\njank\ndropped frames\n```\n\nThis is why graphics performance matters.",
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
      "id": "rn-elective-b-17",
      "title": "Native views vs Skia",
      "durationMinutes": 2,
      "explanation": "Consider a normal card:\n\n```tsx\n<View>\n  <Text />\n  <Image />\n  <Button />\n</View>\n```\n\nUse normal React Native components.\n\nThere is no reason to build the card using Skia.\n\nFor a complex chart:\n\n```text\n10,000 data points\ncustom paths\ninteractive zoom\nanimated rendering\n```\n\nSkia may be much more appropriate.",
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
      "id": "rn-elective-b-18",
      "title": "The wrong reason to use Skia",
      "durationMinutes": 2,
      "explanation": "Don't think:\n\n> \"Skia is faster, therefore everything should use Skia.\"\n\nThat's not a good engineering decision.\n\nSkia introduces:\n\n```text\nNew API\nGraphics concepts\nDifferent debugging model\nMore complexity\nMore specialized code\n```\n\nFor:\n\n```text\nLogin screen\nProfile screen\nSettings\nForm\nButton\n```\n\nnormal React Native views are usually the simpler abstraction.",
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
      "id": "rn-elective-b-19",
      "title": "Frame-budget thinking",
      "durationMinutes": 2,
      "explanation": "When you have a slow animation, ask:\n\n```text\nIs JavaScript busy?\n\nIs the UI/rendering side busy?\n\nIs the GPU overloaded?\n\nAre too many objects being drawn?\n\nAre paths unnecessarily complex?\n\nAre images too large?\n\nAre we recalculating everything every frame?\n```\n\nDon't immediately rewrite the feature.\n\nMeasure first.",
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
      "id": "rn-elective-b-20",
      "title": "Optimize the right thing",
      "durationMinutes": 2,
      "explanation": "Bad approach:\n\n```text\nAnimation feels slow\n ↓\nRewrite everything in Skia\n```\n\nBetter:\n\n```text\nAnimation feels slow\n ↓\nProfile\n ↓\nIdentify bottleneck\n ↓\nDetermine JS/UI/GPU problem\n ↓\nChange smallest necessary part\n ↓\nMeasure again\n```\n\nThis is the same performance workflow you learned earlier.",
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
      "id": "rn-elective-b-21",
      "title": "Skia vs normal views",
      "durationMinutes": 2,
      "explanation": "| Use case               | Normal RN views | Skia                |\n| ---------------------- | --------------- | ------------------- |\n| Forms                  | Excellent fit   | Poor fit            |\n| Buttons                | Excellent fit   | Poor fit            |\n| Lists                  | Excellent fit   | Usually unnecessary |\n| Cards                  | Excellent fit   | Usually unnecessary |\n| Custom charts          | Possible        | Strong fit          |\n| Drawing                | Difficult       | Strong fit          |\n| Custom graphics        | Limited         | Strong fit          |\n| Complex visual effects | Possible        | Strong fit          |\n| Standard accessibility | Strong          | Requires extra care |\n\nThe important word is **fit**.\n\nYou're choosing an abstraction, not a winner.",
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
      "id": "rn-elective-b-22",
      "title": "Accessibility consideration",
      "durationMinutes": 2,
      "explanation": "A canvas does not automatically give you the same accessibility semantics as:\n\n```tsx\n<Button />\n<TextInput />\n```\n\nIf you draw something visually:\n\n```text\nCanvas\n ↓\nVisual representation\n```\n\nyou may need to separately expose meaningful accessibility information.\n\nFor example, a chart should not become:\n\n> \"A picture.\"\n\nif the user needs to understand the data.\n\nYou may need:\n\n```text\nAccessible summary\nData values\nInteractive controls\nAlternative representation\n```\n\nCustom rendering increases your accessibility responsibility.",
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
      "question": "When is custom rendering a better fit than normal React Native views?",
      "options": [
        "When the UI needs dense, highly custom graphics or drawing",
        "For every form",
        "For all navigation",
        "For plain text pages"
      ],
      "correctIndex": 0,
      "explanation": "Custom rendering is useful when graphics need direct drawing control."
    },
    {
      "question": "What is the main role of a Skia Canvas?",
      "options": [
        "It stores authentication tokens",
        "It provides a surface for drawing graphics primitives",
        "It replaces Metro",
        "It creates native builds"
      ],
      "correctIndex": 1,
      "explanation": "A Canvas is the drawing surface for Skia shapes, paths, images, and effects."
    },
    {
      "question": "What does a path represent?",
      "options": [
        "A navigation route",
        "A database query",
        "A sequence of drawing commands",
        "A React context"
      ],
      "correctIndex": 2,
      "explanation": "A path describes connected drawing commands such as moves, lines, and curves."
    },
    {
      "question": "Why must chart data be transformed into coordinates?",
      "options": [
        "The Canvas draws positions, not domain values",
        "It makes API calls faster",
        "It enables routing",
        "It signs the app"
      ],
      "correctIndex": 0,
      "explanation": "Application values must be mapped into the Canvas coordinate system."
    },
    {
      "question": "What is a shader used for?",
      "options": [
        "Navigation state",
        "Pixel-level visual effects and color calculations",
        "Form validation",
        "File storage"
      ],
      "correctIndex": 1,
      "explanation": "Shaders calculate visual output in the graphics pipeline."
    },
    {
      "question": "How should gestures update custom graphics?",
      "options": [
        "Through a clear gesture-to-state-to-render pipeline",
        "By remounting the app",
        "By adding many Views",
        "By rebuilding the native binary"
      ],
      "correctIndex": 0,
      "explanation": "A predictable pipeline keeps interaction and rendering synchronized."
    },
    {
      "question": "What does a 60 FPS frame budget allow approximately?",
      "options": [
        "100 ms",
        "33 ms",
        "16.7 ms",
        "1 ms"
      ],
      "correctIndex": 2,
      "explanation": "At 60 FPS, each frame has about 16.7 milliseconds."
    },
    {
      "question": "What should happen before optimizing a Skia scene?",
      "options": [
        "Measure where frame time is spent",
        "Remove accessibility",
        "Rewrite every component",
        "Assume the GPU is slow"
      ],
      "correctIndex": 0,
      "explanation": "Measurement identifies the real bottleneck before changes are made."
    },
    {
      "question": "When are normal React Native views usually the better choice?",
      "options": [
        "For standard accessible controls, forms, and text",
        "For particle systems",
        "For freehand drawing",
        "For complex shader effects"
      ],
      "correctIndex": 0,
      "explanation": "Standard UI benefits from built-in layout, interaction, and accessibility semantics."
    },
    {
      "question": "What accessibility concern comes with Canvas content?",
      "options": [
        "Drawn elements do not automatically expose normal semantic controls",
        "Canvas cannot use color",
        "Canvas disables gestures",
        "Canvas only works on web"
      ],
      "correctIndex": 0,
      "explanation": "Custom-drawn content needs an intentional accessibility strategy."
    }
  ],
  "project": {
    "name": "Advanced Skia Project",
    "goal": "Build an interactive custom-rendered feature and explain why Skia is the right tool for it.",
    "brief": "Choose one:\n\n### Option A — Custom chart\n\nBuild:\n\n```text\nInteractive line chart\n```\n\nRequirements:\n\n```text\nAxes\nGrid\nData path\nTouch interaction\nSelected point\nTooltip\nAnimated update\n```\n\n### Option B — Drawing application\n\nBuild:\n\n```text\nDrawing canvas\n```\n\nRequirements:\n\n```text\nDraw\nUndo\nRedo\nClear\nStroke width\nColor\n```\n\n### Stretch\n\nAdd:\n\n```text\nShader effect\n```\n\nsuch as a custom animated background or visual effect.\n\n---\n\n# Self-check\n\nYou should be able to answer:\n\n### Question 1\n\nWhy would you choose Skia over normal React Native views?\n\n### Question 2\n\nWhat is a frame budget?\n\n### Question 3\n\nHow long is a 60 FPS frame budget?\n\n**Answer:** approximately 16.67 ms.\n\n### Question 4\n\nHow long is a 120 FPS frame budget?\n\n**Answer:** approximately 8.33 ms.\n\n### Question 5\n\nWhat is a shader?\n\nA program that performs calculations used to determine how pixels are rendered.\n\n### Question 6\n\nShould every React Native screen use Skia?\n\nNo.\n\nUse it when custom rendering provides a meaningful advantage for the problem you're solving.\n\n---\n\n# Elective B Final Acceptance Criteria\n\n```text\n[ ] Built a custom rendering feature\n[ ] Used Skia Canvas\n[ ] Created paths/shapes\n[ ] Converted application data into coordinates\n[ ] Added interaction\n[ ] Added animation\n[ ] Measured performance\n[ ] Considered 60 FPS frame budget\n[ ] Considered 120 FPS behavior\n[ ] Compared Skia with normal RN views\n[ ] Considered accessibility\n[ ] Documented why Skia was chosen\n```\n\n### Final mental model\n\n```text\n             UI problem\n                 │\n        ┌────────┴────────┐\n        ▼                 ▼\n Standard UI          Custom graphics\n        │                 │\n        ▼                 ▼\n React Native           Skia\n Views                   │\n        │                ├── Paths\n        │                ├── Canvas\n        │                ├── Shaders\n        │                └── Effects\n        │\n        └────────┬────────┘\n                 ▼\n            Performance\n                 │\n                 ▼\n           Measure first\n                 │\n                 ▼\n          Stay within the\n          frame budget\n```\n\nThese electives fit nicely after Day 45 because **Elective A deepens application architecture**, while **Elective B deepens native rendering and performance engineering**. Together they take the learner beyond \"I can build a React Native app\" toward \"I understand the major architectural choices available when the normal abstractions stop being enough.\"",
    "steps": [],
    "acceptance": [
      "Build a custom rendering feature with Skia Canvas.",
      "Convert application data into paths or coordinates.",
      "Add gesture-driven interaction and animation.",
      "Measure performance against the frame budget.",
      "Document the accessibility approach and why Skia was chosen."
    ]
  }
});

