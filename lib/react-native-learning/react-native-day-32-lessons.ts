import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_32_LESSONS = normalizePastedLessonDay({
  "day": 32,
  "title": "Accessibility",
  "overview": "**Goal:** By the end of this day, you should be able to make your React Native app usable with VoiceOver and TalkBack, build accessible custom components and modals, support larger text sizes, and avoid accessibility problems caused by color or touch targets.",
  "totalMinutes": 60,
  "difficulty": "Intermediate",
  "lessons": [
    {
      "id": "rn32-1",
      "title": "What does accessibility mean?",
      "durationMinutes": 3,
      "explanation": "Accessibility means making your application usable by people with different abilities.\n\nFor example, a user might:\n\n* use a screen reader\n* have limited vision\n* need larger text\n* have difficulty distinguishing colors\n* navigate without relying on precise touch\n* use assistive technologies\n\nA common mistake is thinking:\n\n> \"Accessibility means adding `accessibilityLabel`.\"\n\nThat's only one small part of it.\n\nThink about accessibility as:\n\n```text\nAccessibility\n     |\n     +-- Screen readers\n     |\n     +-- Focus\n     |\n     +-- Text scaling\n     |\n     +-- Color contrast\n     |\n     +-- Touch interaction\n     |\n     +-- Meaningful controls\n     |\n     +-- Keyboard/assistive navigation\n```\n\nYour goal is not just to make the UI look correct.\n\nYour goal is to make the **information and actions understandable and usable**.",
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
      "id": "rn32-2",
      "title": "`accessibilityLabel`",
      "durationMinutes": 3,
      "explanation": "The first property you'll commonly use is:\n\n```tsx\naccessibilityLabel\n```\n\nIt tells a screen reader what an element should be called.\n\nFor example:\n\n```tsx\n<Pressable\n accessibilityLabel=\"Open profile\"\n onPress={openProfile}\n>\n <Image source={profileImage} />\n</Pressable>\n```\n\nA sighted user sees the profile image.\n\nA screen-reader user might hear:\n\n```text\n\"Open profile, button\"\n```\n\nWithout a useful label, the screen reader may announce something unclear, such as:\n\n```text\n\"Image\"\n```\n\nor nothing useful at all.",
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
      "id": "rn32-3",
      "title": "Don't describe the UI unnecessarily",
      "durationMinutes": 3,
      "explanation": "Suppose you have:\n\n```tsx\n<Pressable accessibilityLabel=\"Open profile\">\n <Image source={profileImage} />\n</Pressable>\n```\n\nThat's useful.\n\nYou usually don't need:\n\n```text\n\"Round profile image of Rajan used as a button to open Rajan's profile\"\n```\n\nThe label should communicate the **purpose of the control**.\n\nThink:\n\n```text\nWhat does this control do?\n```\n\nrather than:\n\n```text\nWhat does this control look like?\n```",
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
      "id": "rn32-4",
      "title": "`accessibilityRole`",
      "durationMinutes": 3,
      "explanation": "The label tells the user **what the element is called**.\n\nThe role tells the screen reader **what kind of thing it is**.\n\nFor example:\n\n```tsx\n<Pressable\n accessibilityRole=\"button\"\n accessibilityLabel=\"Save profile\"\n onPress={saveProfile}\n>\n <Text>Save</Text>\n</Pressable>\n```\n\nThe user can hear something similar to:\n\n```text\n\"Save profile, button\"\n```\n\nThe role gives assistive technology useful semantic information.\n\nCommon roles include things such as:\n\n```text\nbutton\nlink\nimage\nheader\ncheckbox\nradio\nswitch\ntext\nsearch\n```\n\nThe exact supported roles and behavior depend on the platform and React Native version, so use the current React Native documentation when you need the complete list.",
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
      "id": "rn32-5",
      "title": "Why roles matter",
      "durationMinutes": 3,
      "explanation": "Imagine this UI:\n\n```text\n       Save\n```\n\nA sighted user can immediately understand:\n\n> \"That's probably a button.\"\n\nA screen-reader user doesn't necessarily get that visual information.\n\nIf you expose the correct role:\n\n```tsx\naccessibilityRole=\"button\"\n```\n\nyou give the accessibility system that information explicitly.\n\nSo accessibility often means:\n\n> **Give assistive technology the information that sighted users get visually.**",
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
      "id": "rn32-6",
      "title": "`accessibilityHint`",
      "durationMinutes": 3,
      "explanation": "Sometimes the label tells you what something is, but not what happens when you use it.\n\nThat's where:\n\n```tsx\naccessibilityHint\n```\n\ncan help.\n\nExample:\n\n```tsx\n<Pressable\n accessibilityRole=\"button\"\n accessibilityLabel=\"Delete account\"\n accessibilityHint=\"Permanently deletes your account\"\n onPress={deleteAccount}\n>\n <Text>Delete</Text>\n</Pressable>\n```\n\nConceptually:\n\n```text\nLabel\n ↓\n\"What is this?\"\n\nHint\n ↓\n\"What happens when I use it?\"\n```\n\nDon't add hints to every control just because the property exists.\n\nIf the action is already obvious, a hint may add unnecessary verbosity.",
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
      "id": "rn32-7",
      "title": "Putting the three together",
      "durationMinutes": 3,
      "explanation": "A useful mental model:\n\n```text\naccessibilityLabel\n       |\n       v\n     Name\n\naccessibilityRole\n       |\n       v\n     Type\n\naccessibilityHint\n       |\n       v\n     Result/action\n```\n\nExample:\n\n```tsx\n<Pressable\n accessibilityRole=\"button\"\n accessibilityLabel=\"Continue\"\n accessibilityHint=\"Moves to the payment screen\"\n onPress={continueToPayment}\n>\n <Text>Continue</Text>\n</Pressable>\n```",
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
      "id": "rn32-8",
      "title": "Test with VoiceOver — don't just read the docs",
      "durationMinutes": 3,
      "explanation": "This is one of the most important parts of the day.\n\nYou can read:\n\n```tsx\naccessibilityLabel=\"Continue\"\n```\n\nand assume:\n\n> \"Accessibility is done.\"\n\nYou haven't actually tested it.\n\nTurn on **VoiceOver** on an iPhone and use the application.\n\nNow you experience the application differently.\n\nYou need to ask:\n\n```text\nCan I find the control?\nCan I understand what it does?\nCan I activate it?\nCan I tell where I am?\nCan I navigate back?\nCan I understand errors?\n```\n\nThat's real accessibility testing.",
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
      "id": "rn32-9",
      "title": "VoiceOver mental model",
      "durationMinutes": 2,
      "explanation": "A screen-reader user doesn't necessarily experience your UI in the same visual order that you see it.\n\nInstead, they navigate through accessibility elements.\n\nConceptually:\n\n```text\nVisual UI\n\n[Logo]\n\nEmail\n[________]\n\nPassword\n[________]\n\n[Login]\n\n\nVoiceOver experience\n\n\"Login screen\"\n\"Email, text field\"\n\"Password, secure text field\"\n\"Login, button\"\n```\n\nYour responsibility is to make that experience understandable.",
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
      "id": "rn32-10",
      "title": "TalkBack on Android",
      "durationMinutes": 2,
      "explanation": "Android has a similar screen reader called **TalkBack**.\n\nSo your testing should include both:\n\n```text\niOS\n↓\nVoiceOver\n\nAndroid\n↓\nTalkBack\n```\n\nDon't assume:\n\n> \"It works with VoiceOver, so Android is automatically fine.\"\n\niOS and Android expose accessibility behavior differently.\n\nA component may need testing on both platforms.",
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
      "id": "rn32-11",
      "title": "Test real flows, not isolated buttons",
      "durationMinutes": 2,
      "explanation": "Suppose you have:\n\n```text\nLogin\n ↓\nHome\n ↓\nProfile\n ↓\nEdit Profile\n ↓\nSave\n```\n\nDon't only test:\n\n```text\n\"Save\" button\n```\n\nTest the entire journey.\n\n```text\nLogin\n↓\nNavigate\n↓\nRead content\n↓\nOpen profile\n↓\nEdit\n↓\nEnter text\n↓\nSave\n↓\nConfirm result\n```\n\nAsk:\n\n> Can someone complete the task without seeing the screen?\n\nThat's a much better accessibility test.",
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
      "id": "rn32-12",
      "title": "Focus management",
      "durationMinutes": 2,
      "explanation": "**Focus** means which accessibility element currently has the user's attention.\n\nThis becomes especially important with:\n\n```text\nmodals\ndialogs\ncustom components\nforms\nerrors\nnavigation changes\n```\n\nImagine opening a modal:\n\n```text\nHome screen\n   |\n   v\nOpen Delete Account modal\n   |\n   v\nModal appears\n```\n\nA sighted user immediately sees:\n\n```text\nDelete Account\nAre you sure?\nCancel\nDelete\n```\n\nBut a screen-reader user may still be focused on the button that opened the modal.\n\nThat creates a confusing experience.",
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
      "id": "rn32-13",
      "title": "What should happen when a modal opens?",
      "durationMinutes": 2,
      "explanation": "Ideally, the user's accessibility focus should move into the newly relevant content.\n\nConceptually:\n\n```text\nBefore:\n\nHome\n |\n v\n\"Delete account\" button ← focus\n\n\nAfter modal opens:\n\nDelete Account\n |\n v\n\"Are you sure?\" / dialog content\n |\n v\nCancel\nDelete\n```\n\nThe user should immediately understand:\n\n> \"Something new appeared, and here's what I need to do.\"",
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
      "id": "rn32-14",
      "title": "Custom components need accessibility too",
      "durationMinutes": 2,
      "explanation": "Imagine you create:\n\n```tsx\nfunction IconButton() {\n return (\n   <Pressable>\n     <Image source={settingsIcon} />\n   </Pressable>\n );\n}\n```\n\nVisually, it's obvious.\n\nFor a screen reader:\n\n```text\nImage\n```\n\ndoesn't tell the user much.\n\nInstead:\n\n```tsx\nfunction IconButton() {\n return (\n   <Pressable\n     accessibilityRole=\"button\"\n     accessibilityLabel=\"Open settings\"\n   >\n     <Image source={settingsIcon} />\n   </Pressable>\n );\n}\n```\n\nNow the reusable component exposes meaningful semantics.",
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
      "id": "rn32-15",
      "title": "Don't accidentally create multiple accessibility elements",
      "durationMinutes": 2,
      "explanation": "Suppose:\n\n```tsx\n<Pressable accessibilityRole=\"button\">\n <Image />\n <Text>Settings</Text>\n</Pressable>\n```\n\nYou need to think about how the accessibility system exposes the children.\n\nYou usually want the user to experience this as one meaningful action:\n\n```text\n\"Settings, button\"\n```\n\nrather than something confusing like:\n\n```text\nImage\nSettings\nButton\n```\n\nThis is where accessibility grouping and the platform's accessibility behavior become important.\n\nThe general principle is:\n\n> **Expose the semantic unit the user actually interacts with.**",
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
      "id": "rn32-16",
      "title": "Dynamic Type and font scaling",
      "durationMinutes": 2,
      "explanation": "Users may increase their system font size.\n\nFor example:\n\n```text\nNormal:\n\nWelcome back\n[ Login ]\n\n\nLarge text:\n\nWelcome back\n[ Login ]\n```\n\nYour layout must survive the larger text.\n\nReact Native provides text scaling behavior through properties such as:\n\n```tsx\nallowFontScaling\nmaxFontSizeMultiplier\n```\n\nYou should understand that:\n\n> **Text size is not guaranteed to stay at the size you designed in Figma.**\n\nThe user's accessibility settings can change it.",
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
      "id": "rn32-17",
      "title": "A layout that breaks with large text",
      "durationMinutes": 2,
      "explanation": "Imagine:\n\n```tsx\n<View style={{ height: 50 }}>\n <Text>\n   This is a very long account name\n </Text>\n</View>\n```\n\nAt normal font size:\n\n```text\n+------------------------+\n| This is my account     |\n+------------------------+\n```\n\nAt large font size:\n\n```text\n+------------------------+\n| This is my account     |\n| name                   |  ← overflow\n+------------------------+\n```\n\nThe fixed height becomes the problem.",
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
      "id": "rn32-18",
      "title": "Better approach",
      "durationMinutes": 2,
      "explanation": "Prefer layouts that can grow.\n\nInstead of:\n\n```tsx\nheight: 50\n```\n\nconsider:\n\n```tsx\nminHeight: 50\npaddingVertical: 12\n```\n\nThen the component can grow with the text.\n\n```text\nNormal text\n+--------------------+\n| Hello              |\n+--------------------+\n\n\nLarge text\n+--------------------+\n| Hello              |\n|                    |\n+--------------------+\n```\n\nThe exact styling depends on the design, but the principle is:\n\n> **Let content drive the layout whenever possible.**",
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
      "id": "rn32-19",
      "title": "Test large text yourself",
      "durationMinutes": 2,
      "explanation": "Don't assume your layout supports dynamic type.\n\nGo into the device's accessibility settings and increase the text size.\n\nThen test:\n\n```text\nbuttons\nforms\nheaders\ncards\nnavigation\ndialogs\nlists\nerror messages\n```\n\nLook for:\n\n```text\nclipping\noverlapping\ntruncation\nhidden buttons\nbroken alignment\nhorizontal overflow\n```\n\nThis is especially important for production apps.",
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
      "id": "rn32-20",
      "title": "Don't solve everything with `numberOfLines={1}`",
      "durationMinutes": 2,
      "explanation": "A common shortcut:\n\n```tsx\n<Text numberOfLines={1}>\n Very long text...\n</Text>\n```\n\nThis might keep the UI visually tidy.\n\nBut it can also hide important information from the user.\n\nBefore truncating text, ask:\n\n> Is this information safe to shorten?\n\nFor example:\n\n```text\n\"Rajan Midun Magar\"\n```\n\nmight be okay in a compact UI.\n\nBut:\n\n```text\n\"Your payment was declined because...\"\n```\n\nshouldn't casually become:\n\n```text\n\"Your payment was...\"\n```",
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
      "id": "rn32-21",
      "title": "Color contrast",
      "durationMinutes": 2,
      "explanation": "Another major accessibility issue is color contrast.\n\nFor example:\n\n```text\nlight gray text\non\nwhite background\n```\n\nmay look acceptable to you.\n\nBut it can be difficult to read for users with visual impairments.\n\nThink:\n\n```text\nBad:\n\n████████████\nlow contrast\n\n\nBetter:\n\n████████████\nclear contrast\n```\n\nThe exact contrast requirements depend on the content and applicable accessibility standard, but the practical rule is:\n\n> **Make important text and controls clearly distinguishable from their background.**",
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
      "id": "rn32-22",
      "title": "Don't rely on color alone",
      "durationMinutes": 2,
      "explanation": "This is a very common mistake.\n\nImagine:\n\n```text\nGreen = success\nRed = error\n```\n\nand your form shows:\n\n```text\nEmail field → red\n```\n\nA user who has difficulty distinguishing red and green may not understand what happened.\n\nInstead use multiple signals:\n\n```text\nRed border\n+\nError icon\n+\n\"Email address is required\"\n```\n\nNow the information isn't dependent on color.",
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
      "id": "rn32-23",
      "title": "Another example",
      "durationMinutes": 2,
      "explanation": "Bad:\n\n```text\n● Available\n● Unavailable\n```\n\nwhere:\n\n```text\ngreen = available\nred = unavailable\n```\n\nBetter:\n\n```text\n✓ Available\n\n✕ Unavailable\n```\n\nColor can still be used.\n\nThe important point is:\n\n> **Color should reinforce meaning, not be the only source of meaning.**",
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
      "id": "rn32-24",
      "title": "Accessibility and touch targets",
      "durationMinutes": 2,
      "explanation": "Accessibility isn't only about screen readers.\n\nIf a button is extremely small:\n\n```text\n[×]\n```\n\nit may be difficult to tap accurately.\n\nGive interactive controls a reasonable touch area.\n\nFor example, an icon might visually be:\n\n```text\n  ×\n```\n\nwhile the actual tappable area is:\n\n```text\n+---------+\n|         |\n|    ×    |\n|         |\n+---------+\n```\n\nThis is especially important for:\n\n```text\nclose buttons\nback buttons\nicon buttons\ncheckboxes\nsmall controls\n```",
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
      "id": "rn32-25",
      "title": "Accessibility is part of component design",
      "durationMinutes": 2,
      "explanation": "When building a reusable component, don't think only about:\n\n```tsx\ntype ButtonProps = {\n title: string;\n onPress: () => void;\n};\n```\n\nThink about:\n\n```tsx\ntype ButtonProps = {\n title: string;\n onPress: () => void;\n\n accessibilityLabel?: string;\n accessibilityHint?: string;\n disabled?: boolean;\n};\n```\n\nYour component should make accessibility easy for the rest of the application.",
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
      "id": "rn32-26",
      "title": "Day 32 mental model",
      "durationMinutes": 2,
      "explanation": "Remember:\n\n```text\n                   Accessibility\n                        |\n      +-----------------+-----------------+\n      |                 |                 |\n      v                 v                 v\nScreen readers      Visual access      Interaction\n      |                 |                 |\nVoiceOver          Dynamic type       Focus\nTalkBack           Contrast           Touch targets\nLabels             No color-only      Modals\nRoles\nHints\n```\n\nThe goal isn't:\n\n> \"I added accessibility props.\"\n\nThe goal is:\n\n> **A person using assistive technology can complete the same important tasks as another user.**",
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
      "question": "What does accessibility aim to provide?",
      "options": [
        "A. Equivalent access to important tasks for people with different abilities",
        "B. A separate application for every user",
        "C. Only larger buttons",
        "D. Only screen-reader labels"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should accessibilityLabel communicate?",
      "options": [
        "A. A clear name for the element",
        "B. The component file path",
        "C. Its CSS classes",
        "D. The developer's name"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does accessibilityRole describe?",
      "options": [
        "A. The semantic purpose of an element",
        "B. Its network request",
        "C. Its screen coordinates",
        "D. Its build variant"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "When is accessibilityHint useful?",
      "options": [
        "A. When the result of activating a control is not obvious",
        "B. For repeating the label",
        "C. For hiding errors",
        "D. For storing state"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "How should VoiceOver and TalkBack testing be performed?",
      "options": [
        "A. By navigating real user flows with the screen reader enabled",
        "B. By reading documentation only",
        "C. By checking TypeScript",
        "D. By using snapshots only"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should happen to accessibility focus when a modal opens?",
      "options": [
        "A. It should move into the modal intentionally",
        "B. It should disappear",
        "C. It should stay behind the modal",
        "D. It should reset the app"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why should custom components receive accessibility properties?",
      "options": [
        "A. Their behavior and purpose may not be understood automatically",
        "B. They cannot render text",
        "C. They always use native modules",
        "D. They replace navigation"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does Dynamic Type test?",
      "options": [
        "A. Whether layouts remain usable with larger system text",
        "B. Network speed",
        "C. Native crash symbols",
        "D. Build signing"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why should color not be the only status indicator?",
      "options": [
        "A. Some users cannot reliably distinguish the colors",
        "B. Colors are unsupported on mobile",
        "C. It increases bundle size",
        "D. It disables screen readers"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What makes a touch target accessible?",
      "options": [
        "A. Enough size and spacing to activate reliably",
        "B. A hidden label only",
        "C. A network request",
        "D. A fixed font size"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "Accessibility Self-check",
    "goal": "Navigate your entire app's core flow using only VoiceOver or TalkBack.",
    "brief": "> **Navigate your entire app's core flow using only VoiceOver or TalkBack.**\n\nPick your main flow.\n\nFor example:\n\n```text\nLogin\n↓\nHome\n↓\nSearch\n↓\nOpen item\n↓\nEdit\n↓\nSave\n```\n\nThen enable VoiceOver or TalkBack.\n\nDon't look at the screen while testing.\n\nAsk yourself:\n\n```text\nCan I tell where I am?\n\nCan I identify every important control?\n\nCan I understand what each button does?\n\nCan I enter text?\n\nCan I understand validation errors?\n\nCan I open and close modals?\n\nDoes focus move somewhere sensible?\n\nCan I complete the entire task?\n```\n\nThen increase the system font size and repeat the most important screens.",
    "steps": [],
    "acceptance": [
      "Complete the core flow with VoiceOver or TalkBack.",
      "Identify and operate every important control.",
      "Understand validation errors and modal focus.",
      "Repeat important screens with a larger system font size."
    ]
  }
});

