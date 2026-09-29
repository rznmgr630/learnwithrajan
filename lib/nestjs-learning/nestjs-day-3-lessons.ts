import type { LessonDay } from "@/lib/learn/lesson-types";

export const TYPESCRIPT_DAY_3_LESSONS: LessonDay = {
  day: 3,
  title: "Advanced TypeScript",
  totalMinutes: 120,
  difficulty: "Beginner",
  lessons: [
    {
      id: "generic-constraints-keyof-typeof",
      title: "Generic constraints, keyof, typeof, and indexed access types",
      durationMinutes: 26,
      explanation: `Advanced TypeScript becomes much easier when you stop thinking of types as simple labels and start thinking of them as a system for describing <b>relationships between values and types</b>.

A <b>generic</b> allows a function, class, or type to work with different types while preserving information about the specific type being used. However, an unrestricted generic does not let you safely access properties because TypeScript does not know what properties exist on T.

A <b>generic constraint</b> solves this problem. Using \`extends\`, you can require a generic type to have a particular shape. For example, \`T extends { id: string }\` means that whatever type is supplied for T must contain an id property whose type is string. The word extends here means "must satisfy this constraint"; it does not necessarily mean class inheritance.

The <b>keyof</b> operator creates a union of the property keys of a type. If a User type contains \`id\`, \`name\`, and \`email\`, then \`keyof User\` becomes \`"id" | "name" | "email"\`. This is extremely useful when building reusable functions that need to work with arbitrary properties.

An <b>indexed access type</b> lets you ask TypeScript for the type of a particular property. The syntax \`T[K]\` means "the type of property K on T". When K is constrained with \`keyof T\`, TypeScript can understand that the property access is valid.

The <b>typeof</b> operator has two different meanings in TypeScript. At runtime, \`typeof value\` is a JavaScript operator that checks the runtime category of a value. In a type position, \`typeof value\` derives a TypeScript type from an existing value. The type-level form is useful when a configuration object or constant should be the source of truth for its type.

Together, generic constraints, keyof, indexed access, and type-level typeof allow you to create reusable APIs that remain strongly typed instead of falling back to \`any\`.`,
      diagram: `Generic function
      |
      v
     <T>
      |
      +--> constraint
      |      T extends Base
      |
      +--> keyof T
      |      |
      |      +--> valid property names
      |
      +--> K extends keyof T
      |      |
      |      +--> T[K]
      |             |
      |             +--> property value type
      |
      +--> typeof value
             |
             +--> derive a type from value`,
      codeExample: {
        title: "A reusable and type-safe property accessor",
        code: `interface User {
  id: string;
  name: string;
  email: string;
}

function getProperty<T, K extends keyof T>(
  object: T,
  key: K,
): T[K] {
  return object[key];
}

const user: User = {
  id: "u1",
  name: "Alice",
  email: "alice@example.com",
};

const name = getProperty(user, "name");
// string

const email = getProperty(user, "email");
// string

// TypeScript error:
// getProperty(user, "password");

const config = {
  port: 3000,
  environment: "development",
  debug: true,
} as const;

type Config = typeof config;

// Config becomes:
// {
//   readonly port: 3000;
//   readonly environment: "development";
//   readonly debug: true;
// }`,
      },
      keyTakeaways: [
        "Generic constraints use `extends` to require a minimum type shape.",
        "`keyof T` produces a union of valid property keys.",
        "`K extends keyof T` restricts a generic key to properties that actually exist.",
        "`T[K]` retrieves the type of a property from a generic object.",
        "Type-level `typeof` can derive a type directly from an existing value.",
        "These features are useful for reusable repositories, configuration helpers, and API utilities.",
      ],
      commonMistakes: [
        "<b>Using `keyof` as if it returns property values.</b> `keyof User` produces property names, not the values stored in those properties.",
        "<b>Confusing `extends` in generics with inheritance.</b> A generic constraint says the supplied type must satisfy a requirement.",
        "<b>Using `T[K]` without constraining K.</b> TypeScript needs to know that K is a valid key of T.",
        "<b>Confusing runtime `typeof` with type-level `typeof`.</b> Runtime `typeof` produces values such as `\"string\"`; type-level `typeof` derives a TypeScript type.",
        "<b>Using `as any` to silence property errors.</b> This removes the safety that the generic relationship was designed to provide.",
      ],
      quiz: [
        {
          question: "What does `keyof User` produce?",
          options: [
            "The values stored in User",
            "A union of User's property keys",
            "A new User object",
            "A Promise of User",
          ],
          correctIndex: 1,
          explanation: "`keyof` creates a union containing the known property keys of a type.",
        },
        {
          question: "What does `K extends keyof T` guarantee?",
          options: [
            "K is a valid key of T",
            "K is always a number",
            "T is always a class",
            "T must be a string",
          ],
          correctIndex: 0,
          explanation: "The constraint restricts K to keys that exist on T.",
        },
        {
          question: "What does `T[K]` represent?",
          options: [
            "The class constructor",
            "The value type of property K on T",
            "All keys of T",
            "A runtime object",
          ],
          correctIndex: 1,
          explanation: "Indexed access types use T[K] to retrieve the type associated with property K.",
        },
      ],
    },

    {
      id: "conditional-types-infer",
      title: "Conditional types, infer, and distributive behavior",
      durationMinutes: 25,
      explanation: `A <b>conditional type</b> allows TypeScript to make a type-level decision. Its basic structure is \`T extends U ? X : Y\`. It can be read as: "If T is assignable to U, use X; otherwise use Y."

Conditional types do not execute at runtime. They are evaluated by the TypeScript type system while the program is being checked. This makes them useful for creating reusable type transformations.

The <b>infer</b> keyword becomes useful when you want TypeScript to extract part of a type. Inside a conditional type, \`infer\` introduces a temporary type variable. For example, \`T extends Promise<infer R> ? R : T\` tells TypeScript to inspect T. If T is a Promise, capture the value inside that Promise as R. Otherwise, return T unchanged.

This pattern appears throughout TypeScript's utility types and many library definitions. Once you understand conditional types and infer, complex library types become much easier to read.

Conditional types can also distribute over unions. If a naked type parameter is checked against a union, TypeScript can evaluate the condition separately for each member. This behavior is powerful but can initially feel surprising.

For application development, the goal is not to create complicated type puzzles. The useful skill is recognizing when a type relationship can be expressed once and reused safely.`,
      diagram: `T
|
v
T extends U ?
   /       \\
 yes        no
 |           |
 X           Y


infer pattern:

Promise<User>
     |
     v
Promise<infer R>
     |
     +--> R = User


Union:

A | B
 |
 +--> condition for A
 |
 +--> condition for B`,
      codeExample: {
        title: "Extracting values from Promise and array types",
        code: `type UnwrapPromise<T> =
  T extends Promise<infer R>
    ? R
    : T;

type A = UnwrapPromise<Promise<string>>;
// string

type B = UnwrapPromise<Promise<User>>;
// User

type C = UnwrapPromise<number>;
// number

type ElementOf<T> =
  T extends (infer U)[]
    ? U
    : T;

type Names = ElementOf<string[]>;
// string

type UserItem = ElementOf<User[]>;
// User`,
      },
      keyTakeaways: [
        "Conditional types are compile-time if/else logic.",
        "The basic syntax is `T extends U ? X : Y`.",
        "`infer` lets TypeScript extract a type from a matched structure.",
        "Conditional types can inspect Promises, arrays, functions, and other structures.",
        "Conditional types can distribute over unions.",
        "Use advanced conditional types when they describe a useful reusable relationship.",
      ],
      commonMistakes: [
        "<b>Thinking conditional types run in JavaScript.</b> They exist only in the TypeScript type system.",
        "<b>Thinking `infer` creates a runtime variable.</b> It creates a type variable during type evaluation.",
        "<b>Making conditional types unnecessarily nested.</b> Start with one simple condition and build only when the relationship is genuinely useful.",
        "<b>Forgetting about union distribution.</b> Conditional types can behave differently when given a union.",
      ],
      quiz: [
        {
          question: "What does a conditional type resemble?",
          options: [
            "A type-level if/else",
            "A database transaction",
            "A runtime loop",
            "A class constructor",
          ],
          correctIndex: 0,
          explanation: "Conditional types select one type branch based on a type relationship.",
        },
        {
          question: "What is `infer` commonly used for?",
          options: [
            "Extracting a type from a matched structure",
            "Creating a runtime variable",
            "Starting a server",
            "Creating a database",
          ],
          correctIndex: 0,
          explanation: "`infer` allows a conditional type to capture part of a matched type.",
        },
        {
          question: "Where do conditional types operate?",
          options: [
            "At runtime",
            "Inside the TypeScript type system",
            "Inside PostgreSQL",
            "Inside the browser DOM",
          ],
          correctIndex: 1,
          explanation: "Conditional types are evaluated by TypeScript during type checking.",
        },
      ],
    },

    {
      id: "mapped-types-template-literals",
      title: "Mapped types, key remapping, and template literal types",
      durationMinutes: 25,
      explanation: `A <b>mapped type</b> creates a new type by iterating over the keys of another type. The syntax looks somewhat like a JavaScript loop, but nothing is executed at runtime. Instead, TypeScript transforms the shape of a type during compilation.

For example, given a User type, you can create a UserFlags type where every property becomes a boolean. You can also make properties optional, readonly, nullable, or transform their values into another type.

Mapped types become even more powerful when combined with <b>key remapping</b>. The \`as\` clause can change the names of generated properties. This allows you to create types such as \`getName\`, \`getEmail\`, and \`getId\` from the original keys of a User type.

<b>Template literal types</b> provide a similar idea for strings. They allow string literal types to be constructed from other literal types. When unions are interpolated, TypeScript generates combinations of the possible values.

This is useful for event names, permission names, cache keys, route names, and other structured strings. Instead of accepting every string, your API can accept only strings that follow a known pattern.

These features are especially useful in libraries and infrastructure code. They should be used carefully in application code because overly complex generated types can become difficult for a team to understand.`,
      diagram: `Original type
     |
     +------------------+
     |                  |
     v                  v
Mapped type       Template literal
     |                  |
     v                  v
transform keys     combine literals
     |                  |
     v                  v
new object type     string union


User
 |
 +--> id
 +--> name
 +--> email
        |
        v
getId | getName | getEmail`,
      codeExample: {
        title: "Mapped types and typed event names",
        code: `interface User {
  id: string;
  name: string;
  email: string;
}

type Flags<T> = {
  [K in keyof T]: boolean;
};

type UserFlags = Flags<User>;

// {
//   id: boolean;
//   name: boolean;
//   email: boolean;
// }

type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]:
    () => T[K];
};

type UserGetters = Getters<User>;

// {
//   getId: () => string;
//   getName: () => string;
//   getEmail: () => string;
// }

type Entity = "user" | "order";
type Action = "created" | "updated" | "deleted";

type EventName = \`\${Entity}:\${Action}\`;

// "user:created"
// "user:updated"
// "user:deleted"
// "order:created"
// "order:updated"
// "order:deleted"`,
      },
      keyTakeaways: [
        "Mapped types transform properties of an existing type.",
        "Mapped types commonly use `keyof` and `in`.",
        "Key remapping with `as` can generate new property names.",
        "Template literal types create constrained string patterns.",
        "Unions inside template literals generate combinations of allowed strings.",
        "These features are useful for events, permissions, configuration, and typed APIs.",
      ],
      commonMistakes: [
        "<b>Confusing mapped types with Array.map().</b> Mapped types transform compile-time types; they do not iterate over runtime objects.",
        "<b>Assuming template literal types create strings at runtime.</b> They describe which strings are valid to TypeScript.",
        "<b>Generating enormous combinations.</b> Large unions can make types difficult to understand and slow compilation.",
        "<b>Using advanced mapped types when a simple interface would be clearer.</b> Type-level power should serve readability rather than replace it.",
      ],
      quiz: [
        {
          question: "What does a mapped type do?",
          options: [
            "Transforms properties of another type",
            "Executes JavaScript",
            "Starts a server",
            "Creates a database table",
          ],
          correctIndex: 0,
          explanation: "Mapped types iterate over the keys of a type and construct a transformed type.",
        },
        {
          question: "What can template literal types create?",
          options: [
            "Constrained string combinations",
            "Runtime HTTP requests",
            "Database tables",
            "Classes automatically",
          ],
          correctIndex: 0,
          explanation: "Template literal types can build unions such as `user:created` from literal unions.",
        },
        {
          question: "What does key remapping allow?",
          options: [
            "Changing generated property names",
            "Changing JavaScript variable values",
            "Changing database columns",
            "Changing HTTP methods",
          ],
          correctIndex: 0,
          explanation: "Mapped types can use `as` to transform the names of generated keys.",
        },
      ],
    },

    {
      id: "function-overloads-type-guards",
      title: "Function overloads and type guards",
      durationMinutes: 22,
      explanation: `A <b>function overload</b> gives a function multiple public call signatures while keeping one runtime implementation. Overloads are useful when the relationship between input and output depends on which form of input the caller provides.

For example, a function could accept either a numeric ID or a string ID. If the output type is different for each input, overloads can communicate that relationship more precisely than a broad union.

The overload signatures are visible to callers. The implementation signature is used internally and must be broad enough to handle every declared overload. The implementation signature itself is not normally callable as an additional public overload.

Overloads are closely related to <b>type narrowing</b>. Inside the implementation, TypeScript needs a way to determine which input it received. JavaScript checks such as \`typeof\`, \`Array.isArray()\`, and property checks can narrow a union.

You can also create custom <b>type guards</b>. A function returning \`value is User\` tells TypeScript that when the function returns true, the value can be treated as a User.

These techniques are useful when building APIs that accept several valid input forms, but they should not be used merely to make code appear advanced. A simple union is often clearer when all input forms have the same output behavior.`,
      diagram: `Caller
  |
  +--> overload A
  |       |
  |       +--> result A
  |
  +--> overload B
          |
          +--> result B

              |
              v
       one implementation
              |
              v
       type narrowing
       /           \\
    case A        case B`,
      codeExample: {
        title: "Overloads with runtime narrowing",
        code: `function findUser(id: number): User | undefined;
function findUser(email: string): User | undefined;
function findUser(value: number | string): User | undefined {
  if (typeof value === "number") {
    console.log("Searching by numeric id");
  } else {
    console.log("Searching by email");
  }

  return undefined;
}

const byId = findUser(42);
const byEmail = findUser("alice@example.com");

function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return "id" in value &&
    "name" in value &&
    "email" in value;
}

const value: unknown = {
  id: "u1",
  name: "Alice",
  email: "alice@example.com",
};

if (isUser(value)) {
  console.log(value.email);
}`,
      },
      keyTakeaways: [
        "Overloads provide multiple public call signatures for one runtime function.",
        "There is only one implementation at runtime.",
        "The implementation must be able to handle every overload.",
        "Type guards help TypeScript narrow values safely.",
        "`unknown` is safer than `any` when the actual type is not known yet.",
        "Use overloads when different call patterns have meaningful type relationships.",
      ],
      commonMistakes: [
        "<b>Thinking overloads create multiple runtime functions.</b> They create multiple type signatures for one implementation.",
        "<b>Making the implementation too narrow.</b> It must be capable of handling every declared overload.",
        "<b>Using `any` instead of narrowing `unknown`.</b> `unknown` forces you to prove what the value is before using it.",
        "<b>Adding overloads when a union is simpler.</b> Prefer the simplest API that accurately represents the relationship.",
      ],
      quiz: [
        {
          question: "How many runtime implementations does an overloaded function have?",
          options: [
            "One",
            "One per overload",
            "One per parameter",
            "None",
          ],
          correctIndex: 0,
          explanation: "Overloads are type signatures. JavaScript still executes one function implementation.",
        },
        {
          question: "What does a custom type guard return?",
          options: [
            "A database record",
            "A type predicate such as `value is User`",
            "A Promise only",
            "A decorator",
          ],
          correctIndex: 1,
          explanation: "A type predicate tells TypeScript which type a value has when the guard returns true.",
        },
      ],
    },

    {
      id: "declaration-files-module-augmentation",
      title: "Declaration files and module augmentation",
      durationMinutes: 22,
      explanation: `A <b>declaration file</b> is a TypeScript file with the \`.d.ts\` extension that describes types without providing the normal runtime implementation. Declaration files allow TypeScript to understand JavaScript libraries and other code whose implementation is located somewhere else.

When you install a typed npm package, the package may include declaration files that describe its exported functions, classes, interfaces, and other types. This is one reason TypeScript can provide autocomplete and compile-time checking even though the package's actual implementation is JavaScript.

A declaration file can describe an existing JavaScript library. It can also describe global variables, modules, interfaces, and other type-level structures.

<b>Module augmentation</b> is a mechanism for adding declarations to an existing module. Instead of replacing the original declaration, TypeScript merges your additional declarations with it.

This is useful when a library intentionally provides extension points. For example, an authentication library might expose a Request type while your application adds a \`user\` property to that request. Module augmentation can tell TypeScript about that property.

An important distinction is that augmentation changes TypeScript's understanding of the program. It does <b>not</b> automatically add the property at runtime. Your authentication middleware still needs to assign the user property.

This distinction is particularly important in NestJS and Express applications, where developers often extend request objects. The type declaration and runtime assignment are two separate responsibilities.`,
      diagram: `JavaScript package
       |
       +--> runtime implementation
       |
       +--> index.d.ts
              |
              v
        TypeScript understands
        the public API


Module augmentation
       |
       v
Existing module
       |
       +--> original declarations
       |
       +--> application declarations
                |
                v
          merged type view

Important:
type declaration != runtime behavior`,
      codeExample: {
        title: "Extending a request type",
        code: `// auth.d.ts
import "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      email: string;
    };
  }
}

// auth.middleware.ts
import type { Request, Response, NextFunction } from "express";

export function attachUser(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  req.user = {
    id: "u1",
    email: "alice@example.com",
  };

  next();
}

// controller.ts
function getCurrentUser(req: Request) {
  return req.user?.email;
}`,
      },
      keyTakeaways: [
        "A `.d.ts` file describes types without normal executable implementation.",
        "Declaration files allow TypeScript to understand JavaScript libraries.",
        "Module augmentation extends the declarations of an existing module.",
        "Augmentation changes compile-time type information, not runtime behavior.",
        "When extending request objects, the middleware must still create the runtime property.",
        "Keep augmentation files discoverable and included by the TypeScript configuration.",
      ],
      commonMistakes: [
        "<b>Putting normal runtime implementation inside a declaration file.</b> `.d.ts` files are primarily for declarations.",
        "<b>Assuming augmentation creates runtime properties.</b> Your actual middleware or application code must assign the property.",
        "<b>Augmenting the wrong module.</b> The declaration must target the module that actually owns the type being extended.",
        "<b>Forgetting TypeScript configuration.</b> The compiler must include the declaration file for the augmentation to take effect.",
        "<b>Scattering augmentations across the project.</b> Keep them organized so developers can discover where a type was extended.",
      ],
      quiz: [
        {
          question: "What is a `.d.ts` file mainly used for?",
          options: [
            "Type declarations",
            "Database migrations",
            "CSS styles",
            "Runtime configuration",
          ],
          correctIndex: 0,
          explanation: "Declaration files provide type information for code whose runtime implementation exists elsewhere.",
        },
        {
          question: "What does module augmentation do?",
          options: [
            "Automatically changes JavaScript runtime behavior",
            "Adds declarations to an existing module",
            "Deletes the original module",
            "Creates a new Node.js process",
          ],
          correctIndex: 1,
          explanation: "Module augmentation merges additional declarations into an existing module's type information.",
        },
        {
          question: "If augmentation adds `req.user`, what must still happen at runtime?",
          options: [
            "Nothing",
            "The application must actually assign `req.user`",
            "TypeScript automatically creates it",
            "The browser creates it",
          ],
          correctIndex: 1,
          explanation: "Type declarations do not create runtime values. Middleware or other runtime code must assign the property.",
        },
      ],
    },
  ],

  finalQuiz: [
    {
      question: "What does `K extends keyof T` enforce?",
      options: [
        "K is a valid key of T",
        "K is always a class",
        "T is always a string",
        "T must be null",
      ],
      correctIndex: 0,
      explanation: "The constraint restricts K to the keys of T.",
    },
    {
      question: "What does `T[K]` represent?",
      options: [
        "All properties of T",
        "The type of property K on T",
        "The runtime value of T",
        "A Promise",
      ],
      correctIndex: 1,
      explanation: "Indexed access types retrieve the type associated with a property key.",
    },
    {
      question: "What does type-level `typeof config` do?",
      options: [
        "Runs config at runtime",
        "Derives a type from the value config",
        "Deletes config",
        "Converts config to JSON",
      ],
      correctIndex: 1,
      explanation: "In a type position, typeof can derive a type from an existing value.",
    },
    {
      question: "What is a conditional type?",
      options: [
        "A type-level if/else expression",
        "A database condition",
        "A runtime loop",
        "A decorator",
      ],
      correctIndex: 0,
      explanation: "Conditional types choose a type branch based on a type relationship.",
    },
    {
      question: "What is `infer` useful for?",
      options: [
        "Extracting a type from a matched structure",
        "Starting an HTTP server",
        "Creating an interface at runtime",
        "Compiling JavaScript manually",
      ],
      correctIndex: 0,
      explanation: "infer introduces a type variable that can capture part of a matched type.",
    },
    {
      question: "What do mapped types do?",
      options: [
        "Transform properties of an existing type",
        "Send network packets",
        "Create classes at runtime",
        "Replace decorators",
      ],
      correctIndex: 0,
      explanation: "Mapped types iterate over keys and create a transformed type.",
    },
    {
      question: "What are template literal types useful for?",
      options: [
        "Building constrained string combinations",
        "Opening files",
        "Connecting to PostgreSQL",
        "Creating browser DOM nodes",
      ],
      correctIndex: 0,
      explanation: "Template literal types can construct unions of allowed string patterns.",
    },
    {
      question: "How many runtime implementations does an overloaded function have?",
      options: [
        "One",
        "One per overload",
        "Two automatically",
        "None",
      ],
      correctIndex: 0,
      explanation: "Overloads are type signatures; there is one implementation at runtime.",
    },
    {
      question: "What is a declaration file?",
      options: [
        "A file containing type declarations such as `.d.ts`",
        "A database dump",
        "A JavaScript bundle",
        "An HTTP response",
      ],
      correctIndex: 0,
      explanation: "Declaration files describe types for code whose implementation is elsewhere.",
    },
    {
      question: "What does module augmentation do?",
      options: [
        "Adds declarations to an existing module",
        "Deletes a package",
        "Changes runtime behavior automatically",
        "Creates an operating-system process",
      ],
      correctIndex: 0,
      explanation: "Module augmentation extends an existing module's type declarations.",
    },
    {
      question: "Why is `unknown` often safer than `any`?",
      options: [
        "unknown requires narrowing before unsafe operations",
        "unknown disables TypeScript",
        "unknown always becomes string",
        "unknown is only for classes",
      ],
      correctIndex: 0,
      explanation: "unknown forces code to establish the value's type before using it in type-specific ways.",
    },
  ],

  project: {
    name: "Type-safe API helper library",
    goal: "Build a small TypeScript utility layer that demonstrates advanced type relationships while keeping the implementation understandable and useful for backend development.",
    brief: "Create reusable helpers for object property access, Promise extraction, event names, type transformations, overloads, and module augmentation. The project should demonstrate how advanced TypeScript features can improve an API without turning the code into an unreadable type puzzle.",
    steps: [
      "Create a User interface with id, name, email, and status.",
      "Create a generic getProperty<T, K extends keyof T>() helper.",
      "Use indexed access T[K] so the return type matches the selected property.",
      "Create a configuration object and derive its type using typeof.",
      "Create an UnwrapPromise<T> conditional type using infer.",
      "Create an ElementOf<T> conditional type that extracts array element types.",
      "Create a mapped type that converts all properties to boolean flags.",
      "Create a mapped type that generates getter method names using key remapping.",
      "Create Entity and Action unions and combine them with a template literal type.",
      "Create a type-safe event name such as 'user:created' or 'order:deleted'.",
      "Create one overloaded helper where different call signatures provide useful type information.",
      "Use unknown and a custom type guard for one external or untrusted value.",
      "Create a .d.ts declaration for a small JavaScript-style library.",
      "Use module augmentation to add an application-specific property to a library type.",
      "Add comments identifying which parts exist only in the TypeScript type system and which parts execute at runtime.",
    ],
    acceptance: [
      "A generic constraint is used meaningfully.",
      "keyof is used to restrict valid property keys.",
      "Indexed access types are used to preserve property value types.",
      "typeof is used to derive a type from a value.",
      "A conditional type uses infer.",
      "A mapped type transforms another type.",
      "Key remapping is demonstrated.",
      "A template literal type generates allowed string patterns.",
      "At least one function uses overloads.",
      "A custom type guard is demonstrated.",
      "A declaration file is included.",
      "Module augmentation is demonstrated and documented.",
      "The project clearly distinguishes compile-time type behavior from runtime JavaScript behavior.",
    ],
    stretch: [
      "Create a strongly typed event emitter where event names and payloads are connected through a mapped type.",
      "Create a DeepPartial<T> utility type.",
      "Create a generic function that returns the property value type using indexed access.",
      "Create a type that converts an object into getter and setter method signatures.",
      "Create a Result<T, E> type using discriminated unions.",
      "Create a type-safe API response helper that unwraps nested Promise types.",
      "Document why each advanced type exists instead of using it only to make the code look clever.",
    ],
  },
};
