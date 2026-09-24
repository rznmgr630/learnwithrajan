import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_16_LESSONS = normalizePastedLessonDay({
  "day": 16,
  "title": "Forms",
  "overview": "Forms look simple:\n\n```\nName\nEmail\nPassword\n[ Submit ]\n```\n\nBut real mobile forms introduce several problems:\n\n```\nValidation\nKeyboard\nFocus\nScrolling\nAccessibility\nAutofill\nMultiple steps\nLoading\nErrors\nPlatform differences\n```\n\nToday we'll build a mental model that lets you handle those problems without turning your form into a giant component.\n\n---",
  "totalMinutes": 50,
  "difficulty": "Beginner → Intermediate",
  "lessons": [
    {
      "id": "rn16-1",
      "title": "React Hook Form — Managing Form State Efficiently",
      "durationMinutes": 10,
      "explanation": "Let's start with a basic form.\n\nYou might have:\n\n```\nName\nEmail\nPassword\n```\n\nA beginner implementation might use:\n\n```\nconst [name, setName] = useState(\"\");\nconst [email, setEmail] = useState(\"\");\nconst [password, setPassword] = useState(\"\");\n```\n\nThis works.\n\nBut imagine a form with 20 fields.\n\nNow you have a lot of state and a lot of updates.\n\n---\n\n# What React Hook Form does\n\n**React Hook Form** is a library for managing form state and validation.\n\nOne of its important ideas is:\n\n> Don't force the entire form to re-render every time one field changes.\n\nA **re-render** means React runs a component again to determine what UI should be displayed.\n\n---\n\n# Why does this matter?\n\nImagine:\n\n```\nSignup Form\n├── Name\n├── Email\n├── Password\n├── Address\n├── City\n├── State\n├── Zip\n├── Phone\n└── Birthday\n```\n\nIf typing one character into:\n\n```\nEmail\n```\n\ncauses a huge form tree to update unnecessarily, the application is doing more work than needed.\n\nReact Hook Form is designed to minimize this kind of unnecessary form work.\n\n---\n\n# Basic mental model\n\n```\nUser types\n   ↓\nForm library tracks value\n   ↓\nValidation\n   ↓\nOnly necessary UI updates\n```\n\n---\n\n# `useForm`\n\nA common starting point is:\n\n```\nconst {\n control,\n handleSubmit,\n formState: { errors },\n} = useForm();\n```\n\nYou can then connect inputs to the form.\n\n---\n\n# Controlled inputs\n\nA **controlled input** is an input whose value is controlled by application state.\n\nConceptually:\n\n```\nReact State\n   ↓\nInput value\n\nInput change\n   ↓\nReact State\n```\n\nThis gives you control, but can create more rendering work if the form is large.\n\nReact Hook Form provides patterns that help manage form values efficiently.\n\n---\n\n# `Controller`\n\nReact Native inputs often need to be connected using React Hook Form's `Controller`.\n\nConceptually:\n\n```\n<Controller\n control={control}\n name=\"email\"\n render={({ field: { onChange, onBlur, value } }) => (\n   <TextInput\n     value={value}\n     onChangeText={onChange}\n     onBlur={onBlur}\n   />\n )}\n/>\n```\n\nNow React Hook Form knows about:\n\n```\nemail\nvalue\nchange\nblur\nvalidation\n```\n\n---\n\n# Form submission\n\nInstead of manually collecting every value:\n\n```\nname\nemail\npassword\n...\n```\n\nyou can submit through the form:\n\n```\nhandleSubmit(onSubmit)\n```\n\nConceptually:\n\n```\nUser taps Submit\n      ↓\nReact Hook Form\n      ↓\nValidate\n      ↓\nValid?\n┌─────┴─────┐\nYes          No\n│            │\n▼            ▼\nSubmit      Errors\n```\n\n---",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- React Hook Form manages form values and validation.\n- It is designed to reduce unnecessary re-renders.\n- `Controller` is useful for connecting React Native inputs.\n- Forms should have a clear submission and validation flow.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Creating dozens of unrelated `useState` values without a plan\n\nThis can become difficult to maintain.\n\n### ❌ Validating only when the user presses Submit\n\nField-level feedback is often much nicer.\n\n### ❌ Showing generic \"Invalid form\" messages\n\nTell users which field needs attention.\n\n---"
      ],
      "quiz": [
        {
          "question": "What is one reason React Hook Form is useful?",
          "options": [
            "A. It helps manage forms while reducing unnecessary re-renders",
            "B. It replaces React Native navigation",
            "C. It creates databases",
            "D. It loads images"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn16-2",
      "title": "Zod — Schema-Based Validation",
      "durationMinutes": 9,
      "explanation": "React Hook Form helps manage the form.\n\nBut we also need to answer:\n\n> **Is the data valid?**\n\nThat's where Zod can help.\n\n---\n\n# What is validation?\n\n**Validation** means checking whether data follows the rules you expect.\n\nFor example:\n\n```\nEmail\n→ Must look like an email\n\nPassword\n→ Must have at least 8 characters\n\nAge\n→ Must be a number\n\nUsername\n→ Must not be empty\n```\n\n---\n\n# Without a schema\n\nYou might write:\n\n```\nif email is empty\nif email is invalid\nif password is short\nif password doesn't match\n```\n\nAs forms grow, this can become messy.\n\n---\n\n# What is a schema?\n\nA **schema** is a description of what valid data should look like.\n\nFor example:\n\n```\nconst signupSchema = z.object({\n name: z.string().min(2),\n email: z.string().email(),\n password: z.string().min(8),\n});\n```\n\nThis describes:\n\n```\nname\n→ string\n→ minimum 2 characters\n\nemail\n→ string\n→ valid email format\n\npassword\n→ string\n→ minimum 8 characters\n```\n\n---\n\n# Why schemas are useful\n\nInstead of spreading validation rules across many components:\n\n```\nInput\n↓\nValidation\n↓\nSubmit\n↓\nAPI\n```\n\nyou can centralize the rules.\n\n**Centralize** means keeping related logic in one well-defined place.\n\n---\n\n# Field-level errors\n\nSuppose the user enters:\n\n```\nEmail:\nhello\n```\n\nThe schema can detect:\n\n```\nInvalid email\n```\n\nYour UI can show:\n\n```\nEmail\n┌──────────────────────────────┐\n│ hello                        │\n└──────────────────────────────┘\n⚠ Please enter a valid email.\n```\n\nThis is much better than:\n\n```\n⚠ Something went wrong.\n```\n\n---\n\n# Shared validation with a backend\n\nOne powerful idea is sharing schemas between your mobile application and backend when your project architecture allows it.\n\nFor example:\n\n```\n                Shared Schema\n                     │\n            ┌────────┴────────┐\n            │                 │\n            ▼                 ▼\n       React Native        Backend\n            │                 │\n            ▼                 ▼\n       Form validation    API validation\n```\n\nThis reduces the chance that the mobile app and backend disagree about the rules.\n\nBut remember:\n\n> Client-side validation improves user experience. It does not replace server-side validation.\n\nThe backend must still validate incoming data.\n\n---\n\n# React Hook Form + Zod\n\nThese tools work nicely together:\n\n```\nReact Hook Form\n     │\n     ▼\nForm values\n     │\n     ▼\nZod schema\n     │\n     ├── Valid → Submit\n     │\n     └── Invalid → Field errors\n```\n\n---",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Zod lets you describe valid data with schemas.\n- Schemas make validation rules easier to organize.\n- Field-level errors provide better feedback.\n- Schemas can sometimes be shared with your backend.\n- Server-side validation is still required.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Trusting client validation\n\nA malicious client can bypass it.\n\n### ❌ Having different validation rules everywhere\n\nCentralize rules when practical.\n\n### ❌ Showing errors that don't explain the problem\n\nTell the user what needs to change.\n\n---"
      ],
      "quiz": [
        {
          "question": "What is a Zod schema?",
          "options": [
            "A. A description of what valid data should look like",
            "B. A navigation stack",
            "C. A database",
            "D. A keyboard controller"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn16-3",
      "title": "Keyboard Handling",
      "durationMinutes": 9,
      "explanation": "Mobile forms have a problem that web developers sometimes don't think about:\n\n> **The keyboard takes up part of the screen.**\n\nImagine:\n\n```\n┌───────────────────────┐\n│ Email                 │\n│                       │\n│ Password              │\n│                       │\n│                       │\n├───────────────────────┤\n│       Keyboard        │\n│                       │\n└───────────────────────┘\n```\n\nYour submit button may disappear behind the keyboard.\n\n---\n\n# `KeyboardAvoidingView`\n\nReact Native provides:\n\n```\nKeyboardAvoidingView\n```\n\nIt helps adjust your layout when the keyboard appears.\n\nConceptually:\n\n```\nKeyboard hidden:\n\n┌───────────────┐\n│ Form          │\n│               │\n│ Submit        │\n└───────────────┘\n\nKeyboard shown:\n\n┌───────────────┐\n│ Form          │\n│ Submit        │\n├───────────────┤\n│ Keyboard      │\n└───────────────┘\n```\n\n---\n\n# Why keyboard behavior is tricky\n\niOS and Android don't always behave exactly the same.\n\nThere are differences in:\n\n```\nKeyboard resizing\nInsets\nWindow behavior\nFocus\nScrolling\n```\n\n**Insets** are the amounts of space reserved around the edges of the screen for things like the keyboard or system bars.\n\n---\n\n# `react-native-keyboard-controller`\n\nFor more complicated forms, you may use:\n\n```\nreact-native-keyboard-controller\n```\n\nIt provides more advanced keyboard-related behavior.\n\nThis can be useful when you need:\n\n```\nSmooth keyboard transitions\nPrecise keyboard tracking\nComplex scrolling\nBetter control over focused inputs\n```\n\n---\n\n# The ideal form experience\n\nImagine:\n\n```\nUser taps Email\n      ↓\nKeyboard opens\n      ↓\nEmail stays visible\n      ↓\nUser taps Password\n      ↓\nScreen scrolls automatically\n      ↓\nPassword stays visible\n      ↓\nUser taps Submit\n```\n\nThat's what we're aiming for.\n\n---\n\n# Don't only test with the keyboard hidden\n\nAlways test:\n\n```\nKeyboard closed\nKeyboard open\nFirst field focused\nMiddle field focused\nLast field focused\nLong validation error\nSmall screen\nLarge screen\niOS\nAndroid\n```\n\n---",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Mobile keyboards can cover form fields.\n- `KeyboardAvoidingView` handles common keyboard-layout cases.\n- `react-native-keyboard-controller` provides more advanced control.\n- Keyboard behavior differs between platforms.\n- Always test forms while the keyboard is visible.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Testing only on a large device\n\nSmall screens expose keyboard problems quickly.\n\n### ❌ Assuming iOS and Android behave identically\n\nThey don't.\n\n### ❌ Forgetting the last input\n\nThe submit button should remain reachable.\n\n---"
      ],
      "quiz": [
        {
          "question": "Why do forms need special keyboard handling on mobile?",
          "options": [
            "A. The keyboard can cover inputs and buttons",
            "B. The keyboard changes the database",
            "C. The keyboard deletes state",
            "D. The keyboard disables navigation"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn16-4",
      "title": "Native Pickers",
      "durationMinutes": 7,
      "explanation": "Not every form field should be a text input.\n\nFor example:\n\n```\nBirthday\nCountry\nAppointment time\nDate\n```\n\nYou might want a picker instead.\n\nA **picker** is a UI control that lets the user select a value rather than typing it manually.\n\n---\n\n# Date picker\n\nInstead of:\n\n```\nBirthday:\n[ 01/01/1995 ]\n```\n\nwhere the user manually types a date, you can provide a native date selection interface.\n\nOn one platform it might look like:\n\n```\nJanuary\n 1\n 2\n 3\n 4\n```\n\nAnother platform may use:\n\n```\n┌───────────────────┐\n│ January 1, 1995   │\n└───────────────────┘\n```\n\n---\n\n# Platform differences\n\nNative controls can look different on:\n\n```\niOS\nAndroid\n```\n\nThat's not necessarily a problem.\n\nOne of React Native's strengths is allowing your application to use platform-appropriate behavior.\n\n---\n\n# Time picker\n\nFor example:\n\n```\nAppointment Time\n\n[ 10:30 AM ]\n```\n\nThe user gets a native time-selection experience.\n\n---\n\n# Dropdowns\n\nA dropdown lets the user select from a list:\n\n```\nCountry\n──────────────\nUnited States\nCanada\nMexico\nBrazil\n...\n```\n\nOn mobile, you should consider whether a native picker, bottom sheet, or another selection UI provides the best experience.\n\n---\n\n# Don't make users type everything\n\nCompare:\n\n```\nEnter date manually:\nMM/DD/YYYY\n```\n\nwith:\n\n```\nChoose date\n     ↓\nNative date picker\n```\n\nThe second option reduces typing errors.\n\n---",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Use pickers for values that have structured choices.\n- Date and time controls can differ between iOS and Android.\n- Don't force users to type values that can be selected naturally.\n- Test native picker behavior on both platforms.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Assuming every picker looks the same\n\nPlatform UI differs.\n\n### ❌ Using a text field for everything\n\nStructured data often deserves structured controls.\n\n---"
      ],
      "quiz": [
        {
          "question": "When is a date picker useful?",
          "options": [
            "A. Selecting a birthday or appointment date",
            "B. Writing a paragraph",
            "C. Entering a password",
            "D. Displaying an image"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn16-5",
      "title": "Multi-Step Forms",
      "durationMinutes": 6,
      "explanation": "Some forms are too large to show on one screen.\n\nFor example, a signup process might be:\n\n```\nStep 1\nPersonal Information\n\n     ↓\n\nStep 2\nAccount Information\n\n     ↓\n\nStep 3\nPreferences\n\n     ↓\n\nStep 4\nConfirmation\n```\n\nThis is a **multi-step form**.\n\n---\n\n# Why use multiple steps?\n\nInstead of showing:\n\n```\n20 fields\n```\n\nat once, you can group related information.\n\nFor example:\n\n```\nStep 1\nName\nBirthday\n\nStep 2\nEmail\nPassword\n\nStep 3\nPreferences\nNotifications\n```\n\nThis can make the experience easier to understand.\n\n---\n\n# The important problem: preserving state\n\nImagine:\n\n```\nStep 1\nName = Alex\n```\n\nThe user taps:\n\n```\nNext\n```\n\nThen goes to Step 2.\n\nIf you accidentally destroy the Step 1 component, the data might disappear.\n\nYou need a state structure that survives moving between steps.\n\n---\n\n# Form state\n\nConceptually:\n\n```\n                Form State\n                    │\n         ┌──────────┼──────────┐\n         ▼          ▼          ▼\n       Step 1     Step 2     Step 3\n         │          │          │\n         ▼          ▼          ▼\n       Name       Email      Preferences\n```\n\nThe steps use the same underlying form state.\n\n---\n\n# Don't create separate unrelated forms unless necessary\n\nA common approach is:\n\n```\nOne form\n├── Step 1\n├── Step 2\n└── Step 3\n```\n\nrather than:\n\n```\nForm 1\nForm 2\nForm 3\n```\n\nThis makes it easier to submit everything together.\n\n---\n\n# Back button behavior\n\nThe user should be able to:\n\n```\nStep 1\n↓\nStep 2\n↓\nStep 3\n```\n\nand then:\n\n```\nBack\n↓\nStep 2\n```\n\nwithout losing their data.\n\n---",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Multi-step forms break large forms into smaller stages.\n- Preserve the form's data while moving between steps.\n- Users should be able to go backward without losing input.\n- Keep the form state separate from the current step.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Clearing the form when changing steps\n\nUsers hate losing entered information.\n\n### ❌ Treating each step as completely unrelated\n\nThe steps usually represent one larger form.\n\n---"
      ],
      "quiz": [
        {
          "question": "What should happen when a user goes back from Step 3 to Step 2?",
          "options": [
            "A. Their previously entered Step 2 values should still be there",
            "B. The entire form should reset",
            "C. The app should close",
            "D. The user should have to start again"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn16-6",
      "title": "Autofill and Accessibility Labels",
      "durationMinutes": 6,
      "explanation": "A good form shouldn't just work.\n\nIt should also be:\n\n```\nEasy to fill\nEasy to understand\nAccessible\n```\n\n---\n\n# Autofill\n\n**Autofill** lets the operating system help the user fill information.\n\nFor example:\n\n```\nEmail\nPassword\nPhone\nName\nAddress\n```\n\nThe device may already know some of this information.\n\nInstead of forcing the user to type:\n\n```\nalex@example.com\n```\n\nagain, the system can suggest it.\n\n---\n\n# Why autofill matters\n\nMobile typing is slower than desktop typing.\n\nIf the operating system can safely help:\n\n```\nUser taps field\n     ↓\nKeyboard/system suggests value\n     ↓\nUser selects it\n     ↓\nForm filled\n```\n\nthat's a much nicer experience.\n\n---\n\n# Accessibility\n\nNow imagine a user who relies on a screen reader.\n\nA **screen reader** is software that reads interface information aloud or presents it through an accessibility interface.\n\nA visual form might show:\n\n```\nEmail\n[________________]\n```\n\nBut an accessibility system needs to understand:\n\n```\nThis is an email input.\n```\n\n---\n\n# Accessibility labels\n\nGive inputs meaningful labels.\n\nFor example:\n\n```\nEmail address\nPassword\nPhone number\nDate of birth\n```\n\nAvoid vague labels like:\n\n```\nInput 1\nField\nBox\n```\n\n---\n\n# Good form semantics\n\nYour form should communicate:\n\n```\nWhat is this field?\nWhat type of information belongs here?\nIs it required?\nIs there an error?\nWhat should the user do next?\n```\n\n---\n\n# Error accessibility\n\nSuppose the user enters an invalid email.\n\nDon't rely only on:\n\n```\nRed border\n```\n\nbecause not every user can see that visual change.\n\nProvide a meaningful message:\n\n```\nEmail address\n\nPlease enter a valid email address.\n```\n\nThe important information should be available to accessibility technologies too.\n\n---",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Autofill reduces unnecessary typing.\n- Accessibility labels help users understand inputs.\n- Don't rely only on color to communicate errors.\n- Forms should communicate what each field means.\n- Test forms with accessibility tools.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Using placeholder text as the only label\n\nA placeholder can disappear when the user starts typing.\n\n### ❌ Communicating errors only through red borders\n\nNot every user can see color differences.\n\n### ❌ Ignoring autofill\n\nGood input configuration can save users a lot of typing.\n\n---"
      ],
      "quiz": [
        {
          "question": "Why are accessibility labels important?",
          "options": [
            "A. They help accessibility technologies understand what an input represents",
            "B. They make the database faster",
            "C. They replace validation",
            "D. They create animations"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    }
  ],
  "finalQuiz": [
    {
      "question": "What is one reason React Hook Form is useful?",
      "options": [
        "A. It helps manage forms while reducing unnecessary re-renders",
        "B. It replaces React Native navigation",
        "C. It creates databases",
        "D. It loads images"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is a Zod schema?",
      "options": [
        "A. A description of what valid data should look like",
        "B. A navigation stack",
        "C. A database",
        "D. A keyboard controller"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why do forms need special keyboard handling on mobile?",
      "options": [
        "A. The keyboard can cover inputs and buttons",
        "B. The keyboard changes the database",
        "C. The keyboard deletes state",
        "D. The keyboard disables navigation"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "When is a date picker useful?",
      "options": [
        "A. Selecting a birthday or appointment date",
        "B. Writing a paragraph",
        "C. Entering a password",
        "D. Displaying an image"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should happen when a user goes back from Step 3 to Step 2?",
      "options": [
        "A. Their previously entered Step 2 values should still be there",
        "B. The entire form should reset",
        "C. The app should close",
        "D. The user should have to start again"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why are accessibility labels important?",
      "options": [
        "A. They help accessibility technologies understand what an input represents",
        "B. They make the database faster",
        "C. They replace validation",
        "D. They create animations"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does React Hook Form help manage?",
      "options": [
        "A. Form values, validation state, and submission",
        "B. Native navigation stacks",
        "C. Image caching",
        "D. Push tokens"
      ],
      "correctIndex": 0,
      "explanation": "React Hook Form organizes form input state and submission with fewer unnecessary renders."
    },
    {
      "question": "What is Zod used for?",
      "options": [
        "A. Schema-based validation",
        "B. Gesture recognition",
        "C. Local file storage",
        "D. Background notifications"
      ],
      "correctIndex": 0,
      "explanation": "Zod defines schemas that validate the shape and rules of form data."
    },
    {
      "question": "Why must mobile forms handle the keyboard deliberately?",
      "options": [
        "A. It can cover focused inputs and actions",
        "B. It deletes form values",
        "C. It disables validation",
        "D. It changes API responses"
      ],
      "correctIndex": 0,
      "explanation": "The on-screen keyboard can hide fields and submit controls unless the layout responds."
    },
    {
      "question": "Why are autofill and accessibility labels important?",
      "options": [
        "A. They help users complete and understand fields",
        "B. They make network requests faster",
        "C. They replace validation",
        "D. They create database tables"
      ],
      "correctIndex": 0,
      "explanation": "Correct labels and autofill metadata improve usability and accessibility."
    }
  ],
  "project": {
    "name": "🛠️ Self-Check — Build a Signup Form",
    "goal": "Complete the Day 16 self-check project.",
    "brief": "Your challenge today:\n\n> **Build a signup form with Zod validation that shows field-level errors and doesn't jump when the keyboard opens.**\n\n---\n\n# Step 1 — Create the fields\n\nStart with:\n\n```\nName\nEmail\nPassword\nConfirm Password\n```\n\nYour screen might look like:\n\n```\n┌─────────────────────────────┐\n│ Create Account              │\n│                             │\n│ Name                        │\n│ [_______________________]   │\n│                             │\n│ Email                       │\n│ [_______________________]   │\n│                             │\n│ Password                    │\n│ [_______________________]   │\n│                             │\n│ Confirm Password            │\n│ [_______________________]   │\n│                             │\n│ [ Create Account ]          │\n└─────────────────────────────┘\n```\n\n---\n\n# Step 2 — Create a Zod schema\n\nYour rules could be:\n\n```\nName\n→ at least 2 characters\n\nEmail\n→ valid email\n\nPassword\n→ at least 8 characters\n\nConfirm Password\n→ must match password\n```\n\nConceptually:\n\n```\nSignup Data\n    │\n    ▼\nZod Schema\n    │\n┌───┴────┐\n│        │\nValid    Invalid\n│        │\n▼        ▼\nSubmit   Errors\n```\n\n---\n\n# Step 3 — Show field-level errors\n\nDon't show:\n\n```\nSomething went wrong.\n```\n\nShow:\n\n```\nEmail\n[hello]\n\n⚠ Please enter a valid email address.\n```\n\nAnd:\n\n```\nPassword\n[123]\n\n⚠ Password must contain at least 8 characters.\n```\n\nThis immediately tells the user what needs fixing.\n\n---\n\n# Step 4 — Connect React Hook Form\n\nYour architecture should look like:\n\n```\nReact Hook Form\n      │\n      ├── Name\n      ├── Email\n      ├── Password\n      └── Confirm Password\n               │\n               ▼\n           Zod Schema\n               │\n       ┌───────┴───────┐\n       ▼               ▼\n     Valid           Invalid\n       │               │\n       ▼               ▼\n     Submit          Show errors\n```\n\n---\n\n# Step 5 — Handle the keyboard\n\nTest this exact scenario:\n\n```\nTap Email\n  ↓\nKeyboard opens\n  ↓\nTap Password\n  ↓\nKeyboard remains open\n  ↓\nTap Confirm Password\n  ↓\nConfirm Password remains visible\n  ↓\nSubmit button remains reachable\n```\n\nIf the keyboard covers the current field, fix the layout.\n\n---\n\n# Step 6 — Test errors while the keyboard is open\n\nThis is important.\n\nTry:\n\n```\nEmail = invalid\nPassword = too short\n```\n\nThen submit.\n\nThe screen should:\n\n```\nShow errors\n+\nKeep the form usable\n+\nAvoid strange jumps\n```\n\n---\n\n# Step 7 — Test accessibility\n\nCheck that each input communicates:\n\n```\nName\nEmail address\nPassword\nConfirm password\n```\n\nAnd that validation errors are understandable without relying only on color.\n\n---\n\n# 🎯 Done When\n\nYour signup form should have:\n\n- React Hook Form managing the fields.\n- Zod validating the form.\n- Field-level error messages.\n- Password confirmation validation.\n- Keyboard-safe layout.\n- Inputs that remain visible while typing.\n- Meaningful accessibility labels.\n- Appropriate autofill configuration.\n- A clear loading state during submission.\n- A clear success/error state after submission.\n\n---",
    "steps": [],
    "acceptance": [],
    "footer": "# 🧠 Day 16 Mental Model\n\nThink about a form as several separate responsibilities:\n\n```\n                      FORM\n                        │\n      ┌─────────────────┼─────────────────┐\n      │                 │                 │\n      ▼                 ▼                 ▼\n   Form State       Validation         Keyboard\n      │                 │                 │\n      ▼                 ▼                 ▼\nReact Hook Form        Zod       Keyboard Controller\n      │                 │                 │\n      └─────────────────┼─────────────────┘\n                        │\n                        ▼\n                       UI\n                        │\n             ┌──────────┴──────────┐\n             ▼                     ▼\n       Accessibility            Autofill\n```\n\nThe big lesson is:\n\n> **A form isn't just a collection of text inputs.**\n\nA good mobile form needs to handle:\n\n```\nState\nValidation\nKeyboard\nNavigation\nAccessibility\nAutofill\nLoading\nErrors\nPlatform behavior\n```"
  }
});

