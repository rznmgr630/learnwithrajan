import type { LessonDay } from "@/lib/learn/lesson-types";

export const REACT_DAY_18_LESSONS: LessonDay = {
  day: 18,
  title: "Advanced Forms and Validation",
  totalMinutes: 60,
  difficulty: "Beginner",
  lessons: [
    {
      id: "day1",
      title: "React Hook Form Fundamentals",
      durationMinutes: 12,
      explanation: "React Hook Form manages form values and validation without requiring every field change to pass through React component state. You register inputs with the form instance, then handle submission through the form API. This can reduce unnecessary re-renders in large forms.",
      diagram: "Input → register → React Hook Form\n                  ├─ values\n                  ├─ errors\n                  └─ submit",
      codeExample: {
        title: "Basic registration",
        code: "type Values = { name: string; email: string };\n\nconst { register, handleSubmit } = useForm<Values>();\n\nconst onSubmit = (values: Values) => console.log(values);\n\n<form onSubmit={handleSubmit(onSubmit)}>\n  <input {...register(\"name\")} />\n  <input {...register(\"email\")} />\n  <button>Save</button>\n</form>"
      },
      keyTakeaways: [
        "RHF manages registration and submission.",
        "Type form values with TypeScript.",
        "It can reduce per-keystroke React state updates."
      ],
      commonMistakes: [
        "Mixing controlled and uncontrolled patterns without a reason.",
        "Leaving form values untyped.",
        "Putting business logic in every onChange handler."
      ],
      quiz: [
        {
          question: "What does register do?",
          options: [
            "Connects an input to the form",
            "Creates a route",
            "Fetches data",
            "Styles input"
          ],
          correctIndex: 0,
          explanation: "register connects an input to RHF."
        }
      ]
    },
    {
      id: "day2",
      title: "Zod and Schema-Driven Validation",
      durationMinutes: 12,
      explanation: "Zod defines runtime validation schemas and can infer TypeScript types from those schemas. zodResolver connects a Zod schema to React Hook Form and converts validation failures into form errors. Client validation improves UX, but the server must validate again because client code can be bypassed.",
      diagram: "Form values → Zod schema → valid / invalid\n                          ├─ valid → submit\n                          └─ invalid → errors",
      codeExample: {
        title: "Zod resolver",
        code: "const schema = z.object({\n  username: z.string().min(3),\n  age: z.coerce.number().int().min(18),\n});\n\ntype Values = z.infer<typeof schema>;\n\nconst form = useForm<Values>({\n  resolver: zodResolver(schema),\n});"
      },
      keyTakeaways: [
        "Schemas provide explicit runtime rules.",
        "z.infer derives TypeScript types.",
        "Server validation remains necessary."
      ],
      commonMistakes: [
        "Trusting only client validation.",
        "Duplicating incompatible validation rules.",
        "Forgetting HTML inputs often start as strings."
      ],
      quiz: [
        {
          question: "What does z.infer provide?",
          options: [
            "A TypeScript type from a Zod schema",
            "CSS",
            "API route",
            "Migration"
          ],
          correctIndex: 0,
          explanation: "z.infer derives the TypeScript type represented by the schema."
        }
      ]
    },
    {
      id: "day3",
      title: "Field Arrays, Async Validation, and Multi-Step Forms",
      durationMinutes: 12,
      explanation: "Field arrays handle repeated values such as team members. Async validation can check a username against an API, but it should be triggered at a sensible time and often debounced. Multi-step forms should preserve values across steps and validate the fields relevant to the current step.",
      diagram: "Step 1 → validate → Step 2 → validate → Review → submit",
      codeExample: {
        title: "Dynamic field array",
        code: "const { control, register } = useForm<FormValues>();\nconst { fields, append, remove } = useFieldArray({\n  control,\n  name: \"members\",\n});\n\nreturn fields.map((field, index) => (\n  <div key={field.id}>\n    <input {...register(`members.${index}.name`)} />\n    <button type=\"button\" onClick={() => remove(index)}>Remove</button>\n  </div>\n));"
      },
      keyTakeaways: [
        "useFieldArray handles repeated fields.",
        "Async validation should avoid unnecessary requests.",
        "Multi-step forms preserve accumulated values."
      ],
      commonMistakes: [
        "Using array indexes as keys for dynamic rows.",
        "Calling an API on every keystroke.",
        "Clearing earlier step data."
      ],
      quiz: [
        {
          question: "What is useFieldArray for?",
          options: [
            "Dynamic repeated fields",
            "Routing",
            "Caching",
            "Animations"
          ],
          correctIndex: 0,
          explanation: "It manages arrays of fields."
        }
      ]
    },
    {
      id: "day4",
      title: "File Uploads and Accessible Errors",
      durationMinutes: 12,
      explanation: "File uploads need validation for type and size, useful previews when appropriate, and progress for larger uploads. Accessible form errors should be associated with controls using aria-invalid and aria-describedby. After a failed submission, focus should move to a useful error summary or first invalid field.",
      diagram: "Input\n├─ valid → preview/upload\n└─ invalid → error\n             ├─ aria-invalid\n             └─ aria-describedby",
      codeExample: {
        title: "Accessible field error",
        code: "<input\n  {...register(\"email\")}\n  aria-invalid={Boolean(errors.email)}\n  aria-describedby={errors.email ? \"email-error\" : undefined}\n/>\n\n{errors.email && (\n  <p id=\"email-error\" role=\"alert\">{errors.email.message}</p>\n)}"
      },
      keyTakeaways: [
        "Validate file type and size.",
        "Connect errors programmatically to fields.",
        "Focus management matters after failure."
      ],
      commonMistakes: [
        "Showing errors only by color.",
        "Accepting uploads without server validation.",
        "Leaving keyboard users at the top of a long form after an error."
      ],
      quiz: [
        {
          question: "What does aria-describedby help with?",
          options: [
            "Associating a control with descriptive/error text",
            "Submitting",
            "Fetching files",
            "Routing"
          ],
          correctIndex: 0,
          explanation: "It references an element that provides additional description."
        }
      ]
    },
    {
      id: "day5",
      title: "React Hook Form vs Actions and Testing Forms",
      durationMinutes: 12,
      explanation: "React Hook Form is useful for complex client-side forms with field arrays and detailed validation. React's Actions model is useful for async submission, pending state, and optimistic behavior. Test forms through user behavior: fill fields, submit, mock the network, and verify the result rather than testing private implementation details.",
      diagram: "User fills → submit → async request → success/error UI",
      codeExample: {
        title: "User-focused form test",
        code: "const user = userEvent.setup();\n\nawait user.type(\n  screen.getByRole(\"textbox\", { name: /email/i }),\n  \"rajan@example.com\"\n);\nawait user.click(screen.getByRole(\"button\", { name: /save/i }));\n\nexpect(\n  await screen.findByText(/saved successfully/i)\n).toBeInTheDocument();"
      },
      keyTakeaways: [
        "Choose RHF for complex form management.",
        "Actions fit suitable async submissions.",
        "Test what users do and see."
      ],
      commonMistakes: [
        "Using RHF automatically for every tiny form.",
        "Testing private hook state instead of behavior.",
        "Skipping accessibility assertions."
      ],
      quiz: [
        {
          question: "When is React Hook Form especially useful?",
          options: [
            "Complex forms",
            "Only static text",
            "Only routing",
            "Only CSS"
          ],
          correctIndex: 0,
          explanation: "RHF is designed for sophisticated form state and validation."
        }
      ]
    }
  ],
  finalQuiz: [
    {
      question: "What does React Hook Form manage?",
      options: [
        "Form state and registration",
        "Routing",
        "Server cache",
        "CSS"
      ],
      correctIndex: 0,
      explanation: "It manages form values, registration, validation, and submission."
    },
    {
      question: "What does zodResolver connect?",
      options: [
        "Zod to React Hook Form",
        "Router to CSS",
        "Redux to HTTP",
        "React to Git"
      ],
      correctIndex: 0,
      explanation: "It adapts Zod validation to RHF."
    },
    {
      question: "Why validate on the server too?",
      options: [
        "Client code can be bypassed",
        "React cannot validate",
        "Zod is CSS",
        "Forms cannot submit"
      ],
      correctIndex: 0,
      explanation: "Server validation protects data integrity."
    },
    {
      question: "What does useFieldArray manage?",
      options: [
        "Dynamic repeated fields",
        "API cache",
        "Routes",
        "Animations"
      ],
      correctIndex: 0,
      explanation: "It manages arrays of fields."
    },
    {
      question: "Why debounce async validation?",
      options: [
        "Avoid unnecessary API calls",
        "Disable validation",
        "Remove errors",
        "Create route"
      ],
      correctIndex: 0,
      explanation: "Debouncing limits rapid requests."
    },
    {
      question: "What does aria-invalid communicate?",
      options: [
        "The control is invalid",
        "Page is loading",
        "Route is active",
        "File is large"
      ],
      correctIndex: 0,
      explanation: "It exposes invalid state."
    },
    {
      question: "What should accessible form errors have?",
      options: [
        "A programmatic relationship to the field",
        "Only red text",
        "Only tooltip",
        "Only console.log"
      ],
      correctIndex: 0,
      explanation: "Errors should be associated with controls."
    },
    {
      question: "When can Actions be preferable?",
      options: [
        "Simple async form submission",
        "Only CSS",
        "Only routing",
        "Only static forms"
      ],
      correctIndex: 0,
      explanation: "Actions provide a natural async submission model."
    }
  ],
  project: {
    name: "Multi-Step Signup Form",
    goal: "Build a robust accessible multi-step form with schema validation and dynamic fields.",
    brief: "Create a three-step signup form with React Hook Form, Zod, dynamic team members, async username checking, file upload, accessible errors, and final review.",
    steps: [
      "Define a Zod schema and infer TypeScript values.",
      "Build Step 1 and validate before advancing.",
      "Build Step 2 with useFieldArray.",
      "Add a debounced async username check.",
      "Add a profile image upload with type/size validation and preview.",
      "Use aria-invalid and aria-describedby.",
      "Preserve values between steps and submit all values.",
      "Test validation and successful submission."
    ],
    acceptance: [
      "Invalid data prevents advancing.",
      "Dynamic members can be added/removed.",
      "Username validation is not fired uncontrollably.",
      "File type and size are validated.",
      "Errors are associated with fields.",
      "Earlier step values remain at final submission.",
      "Tests cover failure and success."
    ],
    stretch: [
      "Persist an unfinished draft.",
      "Show upload progress.",
      "Focus the first invalid field.",
      "Display server field errors."
    ]
  }
};
