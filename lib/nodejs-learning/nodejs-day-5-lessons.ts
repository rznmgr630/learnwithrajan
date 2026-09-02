import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_5_LESSONS: LessonDay = {
  day: 5,
  title: "TypeScript in Node.js",
  totalMinutes: 84,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "why-typescript",
      title: "Why TypeScript, and what it does not do",
      durationMinutes: 8,
      explanation:
        "If you are building a modern Node.js backend, TypeScript is one of the most useful things you can add to what you already know.\n\nThe key idea to hold onto all day is that TypeScript has <b>two separate jobs</b>:\n\n```text\n1. Type checking    → finding mistakes\n2. Transforming     → turning TypeScript into runnable JavaScript\n```\n\nModern Node can handle some TypeScript directly, so you do not always need a build step. Understanding which job is which is what stops the confusion.\n\n---\n\n## Why it is common in Node backends\n\nJavaScript is dynamically typed:\n\n```javascript\nfunction getUser(user) {\n  return user.name;\n}\n```\n\nNothing here says what `user` is supposed to contain. With TypeScript:\n\n```typescript\ntype User = {\n  id: number;\n  name: string;\n};\n\nfunction getUser(user: User) {\n  return user.name;\n}\n```\n\nNow mistakes are caught before the application runs:\n\n```typescript\ngetUser({\n  id: \"123\",\n  name: \"Rajan\",\n});\n```\n\n```text\nid\n↓\nexpected number\n↓\nreceived string\n```\n\nBackends benefit more than most code from this, because so much of the work is shaping data: a request body, a database row, an API response. Those shapes are exactly what types describe, and getting one wrong is the most common kind of backend bug.\n\nThe other benefit is less obvious and bigger: <b>refactoring</b>. Renaming a field across forty files is a five-minute job with types and a genuinely risky one without them.\n\n---\n\n## TypeScript does not make JavaScript faster\n\nA common misunderstanding:\n\n> \"TypeScript makes Node.js faster.\"\n\nNo. What you get is:\n\n```text\nBetter development experience\n        ↓\nType safety\n        ↓\nBetter autocomplete\n        ↓\nEarlier error detection\n        ↓\nEasier refactoring\n```\n\nProduction still runs JavaScript. Every type you wrote is gone by the time the code executes.\n\nThat last point is worth being precise about, because it explains something people find surprising. Types exist only at <b>compile time</b>. At runtime there is no `User` type to check against, so this does not work:\n\n```typescript\nif (typeof input === \"User\") { }   // meaningless\n```\n\nWhich means TypeScript cannot validate data arriving from outside your program. A request body typed as `User` is a <b>promise you made to the compiler</b>, not a check on the incoming JSON. Validating real input needs a runtime validator, which is what Day 13 covers.\n\nSo: types catch <b>your</b> mistakes, not your users'.",
      diagram: `Two jobs, kept separate all day

                 TypeScript
                     │
          ┌──────────┴──────────┐
          ↓                     ↓
     Type checking          Running code
          │                     │
         tsc                   Node
          │                     │
     Find mistakes        Execute application


What types are for, and what they are not

    catches YOUR mistakes              does NOT check YOUR USERS' data
    ┌──────────────────────┐          ┌──────────────────────────────┐
    │ getUser({ id: "1" }) │          │ app.post("/users", (req) => {│
    │        ↑             │          │   const u: User = req.body   │
    │  caught by tsc       │          │        ↑                     │
    │  before it runs      │          │   a PROMISE to the compiler, │
    └──────────────────────┘          │   not a check on the JSON    │
                                      └──────────────────────────────┘
                                        real input needs a runtime
                                        validator (Day 13)


Types vanish before the code runs

    what you write                what actually executes
    ┌──────────────────────┐      ┌──────────────────────┐
    │ const n: number = 1  │      │ const n = 1          │
    │ interface User {...} │  ──► │                      │
    │ type Id = string     │      │                      │
    └──────────────────────┘      └──────────────────────┘

    so at runtime there is no User to check against:
      typeof input === "User"      meaningless


The underrated benefit

    rename a field across 40 files
      without types   grep, hope, deploy, find out
      with types      the compiler lists every site`,
      codeExample: {
        title: "What types catch, and what they cannot",
        code: `// ── Without types: nothing says what user contains ──────────
// function getUser(user) {
//   return user.name;          // name? username? fullName?
// }


// ── With types: the shape is documented and enforced ────────
type User = {
  id: number;
  name: string;
};

function getUser(user: User) {
  return user.name;
}

getUser({ id: 1, name: "Rajan" });          // ✓

// getUser({ id: "123", name: "Rajan" });
//   Type 'string' is not assignable to type 'number'
//   ← caught by tsc, before anything runs


// ── Types are gone at runtime ───────────────────────────────
const age: number = 42;
console.log(typeof age);                    // "number"

// There is no User at runtime:
// if (typeof input === "User") { }         // meaningless
// if (input instanceof User) { }           // User is not a value


// ── Which is why this is a PROMISE, not a check ─────────────
// app.post("/users", (req, res) => {
//   const user: User = req.body;           // you asserted this
//   res.json(getUser(user));               // nothing verified it
// });
//
// Send { "id": "not-a-number" } and TypeScript is fine with
// it, because the annotation was a compile-time claim. Real
// input needs a runtime validator — Day 13.


// ── What types genuinely buy you ────────────────────────────
type Order = {
  id: number;
  userId: number;
  total: number;
};

function summarise(order: Order) {
  return \`Order \${order.id}: \${order.total}\`;
  // rename Order.total → Order.amountCents and the compiler
  // lists every site that needs updating. That is the part
  // that pays for itself.
}

console.log(summarise({ id: 11, userId: 1, total: 250 }));`,
      },
      keyTakeaways: [
        "TypeScript has <b>two separate jobs</b>: type checking, and transforming code so it can run.",
        "Keeping those two apart is what makes the rest of this day make sense.",
        "Backends benefit especially, because most backend work is shaping data and types describe shapes.",
        "The underrated benefit is <b>refactoring</b>: the compiler lists every site a rename affects.",
        "TypeScript does <b>not</b> make Node faster. Production runs plain JavaScript.",
        "Types exist only at compile time and are gone before the code executes.",
        "So `typeof input === \"User\"` is meaningless, and an interface is not a runtime value.",
        "A typed `req.body` is a <b>promise you made to the compiler</b>, not a check on the incoming JSON.",
        "Types catch <b>your</b> mistakes, not your users'. Real input needs a runtime validator.",
      ],
      commonMistakes: [
        "<b>Expecting TypeScript to improve runtime performance</b> — it changes nothing about execution. The benefit is entirely at development time.",
        "<b>Trusting a typed `req.body`</b> — the annotation is an assertion, not validation. Malformed JSON passes straight through.",
        "<b>Trying to check a type at runtime</b> — `instanceof MyInterface` does not compile, because an interface is not a value.",
        "<b>Adding types without turning on strict checking</b> — you get the syntax and very little of the safety. Next lessons cover this.",
        "<b>Reaching for `any` when a type is inconvenient</b> — it switches checking off for that value and everything it touches.",
      ],
      quiz: [
        {
          question: "You annotate an Express handler's body as `const user: User = req.body`. What does TypeScript verify at runtime?",
          options: [
            "That the JSON matches the User shape",
            "Nothing, the annotation is a compile-time claim only",
            "That `id` is a number, but not the other fields",
            "It throws if the shape is wrong",
          ],
          correctIndex: 1,
          explanation:
            "Types are erased before the code runs, so there is nothing left to check against. The annotation tells the compiler what you believe. Validating real input needs a runtime validator.",
        },
        {
          question: "Which of these is the strongest practical argument for TypeScript in a backend?",
          options: [
            "It makes the application faster",
            "It validates incoming requests",
            "Most backend work is shaping data, and refactoring becomes safe because the compiler finds every affected site",
            "It removes the need for tests",
          ],
          correctIndex: 2,
          explanation:
            "Backends move data between shapes, which is exactly what types describe. The refactoring benefit compounds: renaming a field across forty files becomes a listed set of edits rather than a grep and a hope.",
        },
      ],
    },
    {
      id: "type-stripping",
      title: "Type stripping — running .ts directly",
      durationMinutes: 12,
      explanation:
        "Modern Node has built-in support for <b>type stripping</b>.\n\n<b>Type stripping</b> (removing TypeScript-only syntax so the remaining code can run as JavaScript).\n\n```typescript\nconst name: string = \"Rajan\";\n\nconsole.log(name);\n```\n\nNode turns that into:\n\n```javascript\nconst name = \"Rajan\";\n\nconsole.log(name);\n```\n\nThe important point:\n\n> Node is not fully compiling TypeScript. It is removing erasable type syntax.\n\n---\n\n## What stripping means\n\n```typescript\nfunction add(a: number, b: number): number {\n  return a + b;\n}\n```\n\nThe annotations:\n\n```text\n: number\n: number\n: number\n```\n\nhave no JavaScript equivalent, so Node removes them:\n\n```javascript\nfunction add(a, b) {\n  return a + b;\n}\n```\n\nThat is type stripping.\n\nOne neat detail: Node replaces the removed syntax with <b>whitespace</b> rather than deleting it. Every line and column stays where it was, so stack traces point at the right place in your `.ts` file with no source map needed. That is a large part of why this approach feels so much lighter than a build step.\n\n---\n\n## Stripping is NOT type checking\n\nThis distinction is the whole lesson.\n\n```typescript\nconst age: number = \"hello\";\n```\n\nNode does not tell you this is wrong. It removes:\n\n```typescript\n: number\n```\n\nand leaves:\n\n```javascript\nconst age = \"hello\";\n```\n\nwhich runs happily and prints `hello`.\n\n```text\nNode\n ↓\nRuns TypeScript syntax\n ↓\nDoesn't replace TypeScript's type checker\n```\n\nYou still need a checker:\n\n```text\ntsc\n```\n\nThis surprises people, so it is worth saying bluntly: <b>running `node file.ts` successfully tells you nothing about whether your types are correct</b>. Node deletes the types without reading them. A file full of type errors runs exactly as well as a correct one.\n\n---\n\n## Two separate jobs\n\n```text\n                 TypeScript\n                     │\n          ┌──────────┴──────────┐\n          ↓                     ↓\n     Type checking          Running code\n          │                     │\n         tsc                   Node\n          │                     │\n     Find mistakes        Execute application\n```\n\nA very important mental model, and the reason a project needs <b>both</b> commands rather than one.\n\n---\n\n## The gotcha you will hit first\n\nStripping is purely syntactic, file by file. Node has no idea what other files export, and that causes one specific failure.\n\n```typescript\nimport { User, createUser } from \"./user.ts\";\n\nconst u: User = createUser(1, \"Rajan\");\n```\n\nThat crashes:\n\n```text\nSyntaxError: The requested module './user.ts'\ndoes not provide an export named 'User'\n```\n\nBecause `User` is an interface. It vanished when `user.ts` was stripped, but the <b>import</b> stayed, since Node cannot tell a type import from a value import by looking at one file.\n\nThe fix is `import type`, which says explicitly that this import is erasable:\n\n```typescript\nimport type { User } from \"./user.ts\";\nimport { createUser } from \"./user.ts\";\n```\n\nGet into this habit now, and set `\"verbatimModuleSyntax\": true` in your `tsconfig.json` so the compiler makes you do it. Without that, everything type-checks fine and then fails at runtime, which is the most annoying class of error there is.",
      diagram: `Stripping replaces types with whitespace

    function add(a: number, b: number): number {
                  └──┬───┘  └──┬───┘ └──┬───┘
    function add(a        , b        )         {
                  ▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒▒ ▒▒▒▒▒▒▒▒

    every line and column stays put
        └─► stack traces point at the right place
            in your .ts file, no source map needed


Running successfully proves NOTHING about types

    const age: number = "hello"

    node file.ts   →   prints "hello"      ✓ runs
    tsc --noEmit   →   Type 'string' is not assignable
                       to type 'number'    ✗ wrong

    Node deletes the types without reading them.
    A file full of type errors runs exactly as well
    as a correct one.


The first gotcha: one file at a time

    user.ts                        index.ts
    export interface User {}       import { User, createUser }
    export function createUser()          from "./user.ts"
              │                              │
    stripped: User is GONE         kept: Node cannot tell
    createUser remains             a type import from a
                                   value import
                                       │
                                       ↓
    SyntaxError: does not provide an export named 'User'


    the fix, and the habit to form now

    import type { User } from "./user.ts"    ← erasable,
    import { createUser } from "./user.ts"     removed too

    tsconfig: "verbatimModuleSyntax": true
      └─ makes the compiler require it, so you find
         out at check time instead of at runtime`,
      codeExample: {
        title: "Type stripping, and the import type trap",
        code: `// ── Run it directly, no build step ──────────────────────────
// $ node src/index.ts

const userName: string = "Rajan";
console.log(userName);
//
// Node removes ": string" and runs the rest.


// ── Stripping is not checking ───────────────────────────────
// const age: number = "hello";
// console.log(age, typeof age);
//
// $ node bad.ts
// hello string          ← runs fine!
//
// $ npx tsc --noEmit
// Type 'string' is not assignable to type 'number'.
//
// Running successfully tells you NOTHING about your types.


// ══ The import type trap ════════════════════════════════════

// ── user.ts ─────────────────────────────────────────────────
// export interface User {
//   id: number;
//   name: string;
// }
//
// export function createUser(id: number, name: string): User {
//   return { id, name };
// }


// ── index.ts, the version that breaks ───────────────────────
// import { User, createUser } from "./user.ts";
// const u: User = createUser(1, "Rajan");
//
// $ node src/index.ts
// SyntaxError: The requested module './user.ts' does not
// provide an export named 'User'
//
// Why: stripping is per-file. user.ts lost its interface,
// but index.ts kept the import, because Node cannot tell
// from one file whether User is a type or a value.


// ── index.ts, the version that works ────────────────────────
import type { User } from "./user.ts";      // erasable: removed
import { createUser } from "./user.ts";     // a real value

const user: User = createUser(1, "Rajan");
console.log(user);                          // { id: 1, name: 'Rajan' }


// ── Make the compiler enforce it ────────────────────────────
// tsconfig.json
// {
//   "compilerOptions": {
//     "verbatimModuleSyntax": true
//   }
// }
//
// Now tsc requires "import type" for type-only imports, so
// you find this at check time rather than at runtime — the
// most annoying class of error there is.`,
      },
      keyTakeaways: [
        "<b>Type stripping</b> removes TypeScript-only syntax so the rest can run as JavaScript.",
        "Node is not compiling TypeScript. It is deleting the parts that have no JavaScript equivalent.",
        "Removed syntax is replaced with <b>whitespace</b>, so line and column numbers survive and stack traces stay accurate.",
        "That is why the no-build approach needs no source maps.",
        "<b>Stripping is not type checking.</b> `const age: number = \"hello\"` runs fine and prints `hello`.",
        "So `node file.ts` succeeding tells you nothing about whether your types are correct.",
        "You need both commands: Node to run, `tsc` to check.",
        "Stripping is per-file, so Node cannot tell a type import from a value import.",
        "Importing an interface without `import type` fails at runtime with \"does not provide an export named\".",
        "Set `\"verbatimModuleSyntax\": true` so the compiler requires `import type` and you catch it at check time.",
      ],
      commonMistakes: [
        "<b>Assuming a successful `node file.ts` means the types are fine</b> — Node never read them. Only `tsc` checks.",
        "<b>Importing an interface with a plain `import`</b> — it type-checks, then fails at runtime with a confusing SyntaxError.",
        "<b>Not enabling `verbatimModuleSyntax`</b> — the one setting that turns that runtime failure into a compile-time one.",
        "<b>Expecting Node to catch a type error in CI</b> — your pipeline needs a separate `tsc --noEmit` step.",
        "<b>Assuming you need source maps</b> — stripping preserves positions, so stack traces already point at your `.ts`.",
      ],
      quiz: [
        {
          question: "`const age: number = \"hello\"` in a file you run with `node file.ts`. What happens?",
          options: [
            "Node reports a type error and exits",
            "It runs and prints `hello`, because stripping does not check types",
            "Node coerces the value to a number",
            "A SyntaxError at startup",
          ],
          correctIndex: 1,
          explanation:
            "Node deletes `: number` without reading it, leaving valid JavaScript. Only `tsc` would tell you the assignment is wrong, which is why a project needs both commands.",
        },
        {
          question: "`import { User, createUser } from \"./user.ts\"` where `User` is an interface. Why does this fail at runtime?",
          options: [
            "Interfaces cannot be exported",
            "The extension should be `.js`",
            "Stripping is per-file, so Node keeps the import but the interface no longer exists in the other file",
            "`createUser` must be a default export",
          ],
          correctIndex: 2,
          explanation:
            "Node strips each file independently and cannot tell a type import from a value import. `user.ts` lost its interface while `index.ts` kept asking for it. `import type` fixes it, and `verbatimModuleSyntax` makes the compiler require it.",
        },
        {
          question: "Why does the no-build approach not need source maps?",
          options: [
            "Node generates them automatically",
            "Removed type syntax is replaced with whitespace, so every line and column stays in place",
            "Stack traces are disabled for `.ts` files",
            "TypeScript embeds positions in the annotations",
          ],
          correctIndex: 1,
          explanation:
            "Stripping blanks the types out rather than deleting them, so the stripped file has exactly the same layout as your source and traces already point at the right line.",
        },
      ],
    },
    {
      id: "non-erasable",
      title: "What stripping cannot do — enums, namespaces, decorators",
      durationMinutes: 10,
      explanation:
        "Native type stripping is deliberately limited. It is not a TypeScript compiler.\n\nIt does not transform TypeScript features such as:\n\n```text\nEnums\nNamespaces\nDecorators\nOther non-erasable syntax\n```\n\nAnd it does not:\n\n```text\nGenerate JavaScript files\nGenerate declaration files\nPerform type checking\nBundle your application\n```\n\n---\n\n## Enums\n\n```typescript\nenum UserRole {\n  Admin,\n  User\n}\n```\n\nThis needs JavaScript to be <b>generated</b>. It is not removable syntax:\n\n```text\nType annotation\n     ↓\nCan remove it\n\nenum\n     ↓\nNeeds transformation\n```\n\nNode says so explicitly:\n\n```text\nSyntaxError [ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX]:\nTypeScript enum is not supported in strip-only mode\n```\n\nA clear error rather than a mystery, which is helpful. And the reason is easy to see: an enum is a real object at runtime, mapping names to values <b>and</b> values back to names. There is nothing to delete, so something has to write that object for you.\n\nThe practical answer in a stripping project is not to fight this. A union of literals does the same job and erases completely:\n\n```typescript\ntype UserRole = \"admin\" | \"user\";\n```\n\nThat is better anyway: the values are readable in logs and JSON, rather than `0` and `1`.\n\n---\n\n## Namespaces\n\n```typescript\nnamespace Users {\n  export function getUser() {}\n}\n```\n\nNamespaces need transformation too, so they do not fit:\n\n```text\nTypeScript\n ↓\nRemove types\n ↓\nJavaScript\n```\n\nModern Node projects prefer modules anyway:\n\n```typescript\nexport function getUser() {}\n```\n\nA namespace is a pre-modules solution to a problem ES modules already solved. Day 2's module system is the replacement, and you will not miss them.\n\n---\n\n## Decorators\n\n```typescript\nclass User {\n  @someDecorator\n  name: string;\n}\n```\n\nIf your application relies on decorator transformation, stripping is not enough. This matters most for frameworks built around them, NestJS and TypeORM being the obvious examples. If you are using one of those, the no-build path is not available to you, and that is fine. It is a straightforward trade-off rather than a problem.\n\n```text\nTypeScript\n    ↓\nTransformation\n    ↓\nJavaScript\n```\n\n---\n\n## The flag you may read about\n\nOlder tutorials mention:\n\n```bash\n--experimental-transform-types\n```\n\nIt does handle enums and namespaces. But it is experimental, and it is being removed, so it is not something to build a project on.\n\nThe practical rule:\n\n> <b>If your TypeScript needs transformation rather than simple stripping, use a real compiler.</b>\n\n```text\ntsc\ntsx\nSWC\n```\n\n---\n\n## The test to apply\n\nThe question for any piece of TypeScript is:\n\n> Does this exist at runtime?\n\n```text\ntype, interface, annotations,   nothing at runtime\nimport type, generics,          → erasable → node file.ts\nas, satisfies, non-null !\n\nenum, namespace, decorators,    a runtime value\nparameter properties,           → needs generating → tsc / SWC\nconst enum\n```\n\nThe one that catches people is <b>parameter properties</b>, because they look like an annotation:\n\n```typescript\nclass Service {\n  constructor(private db: Database) {}   // not erasable\n}\n```\n\nThat `private` is doing real work, assigning `this.db = db`. Delete it and the class breaks, so it has to be generated. The erasable version is the boring one:\n\n```typescript\nclass Service {\n  private db: Database;\n  constructor(db: Database) {\n    this.db = db;\n  }\n}\n```",
      diagram: `The only question that matters

    "Does this exist at runtime?"
                │
      ┌─────────┴─────────┐
     NO                  YES
      │                    │
   ERASABLE           NON-ERASABLE
   just delete it     must be GENERATED
      │                    │
   type              enum
   interface         namespace
   : annotations     decorators
   import type       parameter properties
   generics          const enum
   as / satisfies
   non-null !
      │                    │
   node file.ts       tsc / SWC / tsx


Why an enum cannot be deleted

    enum UserRole { Admin, User }

    becomes a real object at runtime:
      { 0: "Admin", 1: "User", Admin: 0, User: 1 }
                    └─ names → values AND values → names

    nothing to delete, so something must WRITE it

    Node's answer is an honest error:
      ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX
      TypeScript enum is not supported in strip-only mode

    the stripping-friendly replacement, and it is better:
      type UserRole = "admin" | "user"
        └─ readable in logs and JSON, not 0 and 1


The one that looks erasable but is not

    class Service {
      constructor(private db: Database) {}
                  └─ this is DOING something:
                     this.db = db
    }

    delete "private" and the class breaks.

    the boring, erasable version:
      class Service {
        private db: Database
        constructor(db: Database) { this.db = db }
      }


If your framework needs decorators

    NestJS, TypeORM        →  no-build is not available
                              use tsc or SWC

    a trade-off, not a problem`,
      codeExample: {
        title: "Erasable and non-erasable, side by side",
        code: `// ══ ERASABLE: node file.ts runs these ═══════════════════════

type UserId = string;                       // gone
type UserRole = "admin" | "user";           // gone

interface User {                            // gone
  id: number;
  name: string;
  role: UserRole;
}

function findUser<T extends { id: number }>(items: T[], id: number) {
  return items.find((item) => item.id === id);      // generics: gone
}

const raw = { id: 1, name: "Rajan", role: "admin" } as User;   // gone
const definitely = raw!;                                        // gone

console.log(findUser([raw], 1));


// ══ NON-ERASABLE: these need a compiler ════════════════════

// ── enum ────────────────────────────────────────────────────
// enum Status { Active, Inactive }
// console.log(Status.Active);
//
// $ node file.ts
// SyntaxError [ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX]:
// TypeScript enum is not supported in strip-only mode
//
// Because an enum IS an object at runtime:
//   { 0: "Active", 1: "Inactive", Active: 0, Inactive: 1 }

// the stripping-friendly replacement, and it is better anyway
type Status = "active" | "inactive";
const status: Status = "active";
console.log(status);                        // "active", not 0


// ── namespace ───────────────────────────────────────────────
// namespace Users {
//   export function getUser() {}
// }
//
// A pre-modules solution to a problem ES modules solved.
// Use a module:
//   export function getUser() {}


// ── decorators ──────────────────────────────────────────────
// class UserService {
//   @Injectable()
//   constructor() {}
// }
//
// NestJS and TypeORM are built on these, so those projects
// need tsc or SWC. A trade-off, not a problem.


// ── parameter properties: the sneaky one ────────────────────
// class Service {
//   constructor(private db: Database) {}
//                 ↑ NOT an annotation. It generates
//                   this.db = db
// }

// the erasable version
class Service {
  private db: string;
  constructor(db: string) {
    this.db = db;                           // written out by hand
  }
  get name() { return this.db; }
}
console.log(new Service("postgres").name);


// ── The flag you may read about ─────────────────────────────
// node --experimental-transform-types file.ts
//
// It does handle enums and namespaces, but it is
// experimental and is being removed. Do not build on it.
// If you need transformation, use tsc or SWC.`,
      },
      keyTakeaways: [
        "Type stripping is deliberately limited. It is not a TypeScript compiler.",
        "The only question that matters: <b>does this syntax exist at runtime?</b>",
        "Erasable: `type`, `interface`, annotations, `import type`, generics, `as`, `satisfies`, non-null `!`.",
        "Non-erasable: `enum`, `namespace`, decorators, parameter properties, `const enum`.",
        "An enum <b>is</b> an object at runtime, mapping names to values and back, so it must be generated.",
        "Node gives a clear error: `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX ... not supported in strip-only mode`.",
        "Replace enums with a union of literals. They erase cleanly and read better in logs and JSON.",
        "Namespaces are a pre-modules solution. ES modules replaced them.",
        "<b>Parameter properties</b> look erasable but are not: `constructor(private db: X)` generates `this.db = db`.",
        "Decorator-based frameworks like NestJS and TypeORM rule out the no-build path. A trade-off, not a problem.",
        "`--experimental-transform-types` handles enums, but it is experimental and being removed. Do not build on it.",
      ],
      commonMistakes: [
        "<b>Using an enum in a stripping project</b> — you get `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX` at startup. Use a literal union.",
        "<b>Assuming `constructor(private db: X)` is just an annotation</b> — the `private` generates an assignment, so it cannot be stripped.",
        "<b>Reaching for a namespace</b> — modules do the job, and namespaces need transformation.",
        "<b>Building on `--experimental-transform-types`</b> — it is experimental and going away.",
        "<b>Choosing the no-build path for a NestJS project</b> — decorators are non-negotiable there. Use a compiler.",
        "<b>Preferring numeric enums over string unions generally</b> — the numbers turn up in logs and API payloads as `0` and `1`, which nobody can read.",
      ],
      quiz: [
        {
          question: "Why can an `enum` not be stripped away like a type annotation?",
          options: [
            "Enums are only supported in CommonJS",
            "An enum becomes a real runtime object mapping names to values and values back to names, so it has to be generated",
            "Enums require a type checker to resolve",
            "Node has not implemented them yet",
          ],
          correctIndex: 1,
          explanation:
            "There is nothing to delete: the enum needs an actual object to exist at runtime. Node reports `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX` rather than guessing. A literal union is the erasable replacement.",
        },
        {
          question: "Which of these is NOT erasable?",
          options: [
            "`function f<T>(x: T): T`",
            "`import type { User } from \"./user.ts\"`",
            "`constructor(private db: Database) {}`",
            "`const x = y as User`",
          ],
          correctIndex: 2,
          explanation:
            "A parameter property generates `this.db = db`, so removing `private` would break the class. Generics, `import type` and `as` all disappear with no runtime trace.",
        },
        {
          question: "Your project uses NestJS. Can you use Node's native type stripping?",
          options: [
            "Yes, decorators are erasable",
            "No, NestJS is built on decorators, which need transformation",
            "Yes, but only with `verbatimModuleSyntax`",
            "Only for files without classes",
          ],
          correctIndex: 1,
          explanation:
            "Decorators produce runtime behaviour, so they cannot be stripped. A decorator-heavy framework means a real compiler, which is a straightforward trade-off rather than a problem.",
        },
      ],
    },
    {
      id: "the-tools",
      title: "tsc, tsx, SWC — and picking one approach",
      durationMinutes: 10,
      explanation:
        "Three tools with overlapping names and different jobs.\n\n---\n\n## `tsc`\n\n<b>`tsc`</b> (the TypeScript compiler and type checker).\n\nUse it when you need:\n\n```text\nType checking\nJavaScript output\nDeclaration files\nTypeScript transformations\nA traditional build pipeline\n```\n\n```bash\nnpx tsc\n```\n\nThe key thing: `tsc` is the <b>only</b> one of the three that actually checks types. Even in a no-build project you will still run it, just with `--noEmit`.\n\n---\n\n## `tsx`\n\n<b>`tsx`</b> (a tool for running TypeScript directly during development).\n\n```bash\nnpx tsx src/index.ts\n```\n\n```text\nDevelopment\n     ↓\n    tsx\n     ↓\nRun TypeScript\n```\n\nIt does what Node's native stripping does, plus the transformations stripping cannot handle. Historically that was the whole reason it existed. Now that Node runs `.ts` itself, `tsx` is for when you need enums, decorators or CommonJS interop that stripping refuses. It does not type-check either.\n\n---\n\n## SWC\n\n<b>SWC</b> (a very fast compiler written in Rust that transforms JavaScript and TypeScript).\n\nUseful when you need:\n\n```text\nFast compilation\nTypeScript transformation\nJSX transformation\nBuild pipelines\n```\n\n```text\nTypeScript\n    ↓\n   SWC\n    ↓\nJavaScript\n    ↓\nProduction\n```\n\nYou do not need SWC just because you use TypeScript. Reach for it when `tsc`'s speed is genuinely a problem, which happens on large codebases and not on small ones. It does not type-check either, which is the pattern here: <b>only `tsc` checks types</b>. Everything else just transforms.\n\n---\n\n## Two approaches\n\n### Approach A — native Node TypeScript\n\n```text\n.ts files\n   ↓\n  Node\n   ↓\nType stripping\n   ↓\n  Run\n```\n\nNo build step.\n\n### Approach B — compile TypeScript\n\n```text\n.ts files\n   ↓\ntsc / SWC\n   ↓\n.js files\n   ↓\n  Node\n```\n\nBuild step required.\n\nBoth are valid.\n\n---\n\n## The important rule\n\nDo not accidentally mix them.\n\n```text\nDevelopment\n ↓\nNode runs .ts directly\n\nProduction\n ↓\nSome random build process\n\nCI\n ↓\nAnother TypeScript configuration\n```\n\nThat produces:\n\n```text\n\"It worked locally.\"\n\nbut\n\n\"It doesn't work in production.\"\n```\n\n> <b>Choose a strategy and use it consistently.</b>\n\nThere is a concrete reason this bites harder than it sounds, and it is the thing to remember from this lesson: <b>the two approaches need different import extensions</b>.\n\n```typescript\n// Approach A, running .ts directly\nimport { createUser } from \"./user.ts\";\n\n// Approach B, running compiled .js\nimport { createUser } from \"./user.js\";\n```\n\nIn Approach A the file really is `user.ts`, and Node does <b>not</b> rewrite `.js` to `.ts` for you. Try it and you get:\n\n```text\nError [ERR_MODULE_NOT_FOUND]: Cannot find module '.../user.js'\nimported from .../index.ts\n```\n\nIn Approach B, `tsc` has emitted `user.js`, so `./user.js` is exactly right and `./user.ts` would be wrong.\n\nSo the import extension is not a style choice. It is a consequence of which approach you picked, which is why mixing them fails immediately and confusingly. Pick one, write the matching extension everywhere, and configure TypeScript to agree:\n\n```text\nApproach A   \"allowImportingTsExtensions\": true\n             (plus \"noEmit\": true, since you never emit)\n\nApproach B   write \"./user.js\", the default behaviour\n```",
      diagram: `Only one of the three checks types

              checks types?   transforms?   runs code?
    tsc            YES            yes           no
    tsx            no             yes          yes
    SWC            no             yes           no
    node           no          strips only     yes

    so every project needs tsc, even a no-build one:
      tsc --noEmit


Two approaches, and the extension follows from the choice

    APPROACH A  no build            APPROACH B  build
    ─────────────────────────────────────────────────────────
    src/index.ts                    src/index.ts
    src/user.ts                     src/user.ts
         │                               │  tsc
         │                               ↓
         │                          dist/index.js
         │                          dist/user.js
         ↓                               ↓
    node src/index.ts               node dist/index.js

    import "./user.ts"              import "./user.js"
             └─ the file IS .ts              └─ the file IS .js


Get it wrong and it fails at once

    Approach A with "./user.js"
      ERR_MODULE_NOT_FOUND: Cannot find module '.../user.js'
      imported from .../index.ts

    Node does NOT rewrite .js → .ts for you.

    tsconfig to match:
      A   "allowImportingTsExtensions": true + "noEmit": true
      B   write "./user.js" — the default


Mixing approaches, in one picture

    dev   node src/index.ts        ./user.ts
    prod  node dist/index.js       ./user.js
              │
              └─ the SAME source cannot satisfy both
                 "it worked locally"`,
      codeExample: {
        title: "The two approaches, and why extensions differ",
        code: `// ══ APPROACH A — no build step ══════════════════════════════
//
// package.json
// {
//   "type": "module",
//   "scripts": {
//     "dev":       "node --watch src/index.ts",
//     "start":     "node src/index.ts",
//     "typecheck": "tsc --noEmit"
//   }
// }
//
// tsconfig.json
// {
//   "compilerOptions": {
//     "noEmit": true,                        // never emitting
//     "allowImportingTsExtensions": true,    // so ./user.ts is legal
//     "verbatimModuleSyntax": true
//   }
// }
//
// src/index.ts
import type { User } from "./user.ts";       // ← .ts, the real file
import { createUser } from "./user.ts";
//
// $ node src/index.ts        runs
// $ npx tsc --noEmit         checks


// ══ APPROACH B — compile first ══════════════════════════════
//
// package.json
// {
//   "type": "module",
//   "scripts": {
//     "build": "tsc",
//     "start": "node dist/index.js",
//     "typecheck": "tsc --noEmit"
//   }
// }
//
// tsconfig.json
// {
//   "compilerOptions": {
//     "outDir": "dist",
//     "module": "NodeNext",
//     "moduleResolution": "NodeNext"
//   }
// }
//
// src/index.ts
// import { createUser } from "./user.js";   // ← .js, what tsc emits
//
// $ npx tsc                  src/*.ts → dist/*.js
// $ node dist/index.js       runs the output


// ══ What happens if you mix them ════════════════════════════
//
// Approach A source, Approach B extension:
//
// import { createUser } from "./user.js";
// $ node src/index.ts
//
// Error [ERR_MODULE_NOT_FOUND]: Cannot find module
// '.../src/user.js' imported from '.../src/index.ts'
//
// Node does not rewrite .js → .ts. The extension is a
// consequence of the approach, not a style choice.


// ── Which tool for what ─────────────────────────────────────
// tsc         the only type checker. always in your scripts.
// node        runs .ts via stripping. erasable syntax only.
// tsx         runs .ts including non-erasable syntax.
//             no type checking.
// SWC         fast transformation for large builds.
//             no type checking.

const user: User = createUser(1, "Rajan");
console.log(user);`,
      },
      keyTakeaways: [
        "<b>Only `tsc` checks types.</b> `tsx`, SWC and Node all just transform or strip.",
        "So every project runs `tsc`, even a no-build one, as `tsc --noEmit`.",
        "`tsx` runs `.ts` including the non-erasable syntax Node refuses. Useful when stripping is not enough.",
        "SWC is for when `tsc`'s speed is genuinely a problem, which is a large-codebase concern.",
        "<b>Approach A</b>: run `.ts` directly, no build step.",
        "<b>Approach B</b>: compile to `.js` with `tsc` or SWC, then run the output.",
        "Pick one and be consistent, in development, CI and production.",
        "<b>The two approaches need different import extensions</b>, which is why mixing them fails immediately.",
        "Approach A imports `./user.ts`, because that is the real file. Node does <b>not</b> rewrite `.js` to `.ts`.",
        "Approach B imports `./user.js`, because that is what `tsc` emitted.",
        "Approach A needs `\"allowImportingTsExtensions\": true` plus `\"noEmit\": true` in `tsconfig.json`.",
      ],
      commonMistakes: [
        "<b>Writing `./user.js` while running `node src/index.ts`</b> — `ERR_MODULE_NOT_FOUND`. Node does not rewrite the extension for you.",
        "<b>Writing `./user.ts` in a project you compile</b> — the emitted file is `user.js`, so the import breaks after building.",
        "<b>Running `.ts` in development and compiled `.js` in production</b> — the same source cannot satisfy both extension rules.",
        "<b>Expecting `tsx` or SWC to catch type errors</b> — neither checks. Only `tsc` does.",
        "<b>Adding SWC to a small project for speed</b> — `tsc` is not the bottleneck until the codebase is large.",
        "<b>Omitting `allowImportingTsExtensions` in a no-build project</b> — `tsc` rejects the very imports Node requires.",
      ],
      quiz: [
        {
          question: "Which of `tsc`, `tsx`, SWC and `node` actually reports type errors?",
          options: ["All of them", "`tsc` and `tsx`", "Only `tsc`", "`tsc` and SWC"],
          correctIndex: 2,
          explanation:
            "The other three transform or strip and then run. That is why `tsc --noEmit` belongs in every TypeScript project's scripts, including one with no build step.",
        },
        {
          question: "You run `node src/index.ts` and it imports `./user.js`, but the file on disk is `user.ts`. What happens?",
          options: [
            "Node resolves it to `user.ts` automatically",
            "`ERR_MODULE_NOT_FOUND`, because Node does not rewrite the extension",
            "It works, with a warning",
            "A type error from `tsc`",
          ],
          correctIndex: 1,
          explanation:
            "Node looks for exactly what you wrote. Running `.ts` directly means importing `./user.ts`, which also needs `allowImportingTsExtensions` so `tsc` accepts it.",
        },
        {
          question: "Why does mixing the two approaches fail so quickly?",
          options: [
            "The tools have different tsconfig formats",
            "The required import extension differs, so the same source cannot satisfy both",
            "`tsc` refuses to run alongside Node",
            "Type checking is skipped in one of them",
          ],
          correctIndex: 1,
          explanation:
            "Running `.ts` needs `./user.ts`; running compiled output needs `./user.js`. One codebase cannot have both, so a project split across approaches breaks on the first import.",
        },
      ],
    },
    {
      id: "tsconfig",
      title: "tsconfig.json — the options that matter",
      durationMinutes: 12,
      explanation:
        "A Node TypeScript project normally has a `tsconfig.json`, telling TypeScript how to check and, if relevant, compile your project.\n\n```javascript\n{\n  \"compilerOptions\": {\n    \"target\": \"ES2024\",\n    \"module\": \"NodeNext\",\n    \"moduleResolution\": \"NodeNext\",\n    \"strict\": true\n  }\n}\n```\n\n---\n\n## `target`\n\n<b>`target`</b> (the JavaScript language version TypeScript targets when it emits).\n\n```javascript\n{\n  \"compilerOptions\": {\n    \"target\": \"ES2024\"\n  }\n}\n```\n\nModern Node supports modern JavaScript, so do not target something ancient:\n\n```javascript\n{\n  \"target\": \"ES5\"\n}\n```\n\nThat is a browser-era setting. On a backend it means TypeScript rewrites `async/await` into generator state machines and classes into functions, for no benefit at all, producing output that is slower and much harder to debug. Set it to match the Node version you actually run.\n\n---\n\n## `module`\n\n<b>`module`</b> (how TypeScript interprets and emits modules).\n\n```javascript\n{\n  \"compilerOptions\": {\n    \"module\": \"NodeNext\"\n  }\n}\n```\n\nThis lets TypeScript understand Node's ESM and CommonJS rules, including everything from Day 2: `\"type\": \"module\"`, `.mjs`, `.cjs`, and which one a `.ts` file counts as.\n\n---\n\n## `moduleResolution`\n\n<b>`moduleResolution`</b> (how TypeScript finds imported modules).\n\n```javascript\n{\n  \"compilerOptions\": {\n    \"moduleResolution\": \"NodeNext\"\n  }\n}\n```\n\nThis makes TypeScript follow Node's modern resolution, which matters for:\n\n```text\nESM\npackage.json\nexports\nimports\nnode_modules\nfile extensions\n```\n\nThose are Day 2's topics exactly. `NodeNext` is what makes TypeScript respect a package's `exports` field and require the file extensions ESM needs, so the compiler agrees with what Node will actually do at runtime. Get this wrong and TypeScript happily accepts imports that fail when you run them.\n\n---\n\n## `strict`\n\n<b>`strict`</b> (enables TypeScript's strictest checks).\n\n```javascript\n{\n  \"compilerOptions\": {\n    \"strict\": true\n  }\n}\n```\n\nHighly recommended. Without it TypeScript is much less useful:\n\n```text\nstrict: true\n     ↓\nMore mistakes caught\n     ↓\nSafer code\n```\n\nIt is worth knowing what you are actually turning on, because one sub-option does most of the work. `strictNullChecks` is what makes `null` and `undefined` separate from every other type:\n\n```typescript\n// strict: false\nfunction getName(user: User) {\n  return user.name.toUpperCase();   // fine, apparently\n}\ngetName(undefined);                 // also fine. crashes at runtime.\n\n// strict: true\ngetName(undefined);\n//   Argument of type 'undefined' is not assignable\n//   to parameter of type 'User'\n```\n\nWithout it, `null` and `undefined` are assignable to everything, which means TypeScript cannot catch the single most common runtime error in JavaScript. Turning `strict` off to avoid errors is turning off the reason you added TypeScript.\n\nStart every new project with `strict: true`. Adding it later means fixing hundreds of errors at once.\n\n---\n\n## A no-build config, in full\n\nFor Approach A, this is the whole file:\n\n```javascript\n{\n  \"compilerOptions\": {\n    \"target\": \"ES2024\",\n    \"module\": \"NodeNext\",\n    \"moduleResolution\": \"NodeNext\",\n    \"strict\": true,\n    \"noEmit\": true,\n    \"allowImportingTsExtensions\": true,\n    \"verbatimModuleSyntax\": true,\n    \"erasableSyntaxOnly\": true,\n    \"types\": [\"node\"]\n  },\n  \"include\": [\"src\"]\n}\n```\n\nThe last four are the ones specific to running `.ts` directly, and the next lesson covers them.",
      diagram: `The four core options

    target              which JavaScript to emit
      ES2024            ✓ modern Node
      ES5               ✗ browser-era. rewrites async/await
                          into generators for no benefit

    module              how modules are interpreted
      NodeNext          ✓ understands "type": "module",
                          .mjs, .cjs — all of Day 2

    moduleResolution    how imports are found
      NodeNext          ✓ respects exports, imports,
                          required file extensions
                          → the compiler agrees with Node

    strict              the checks that make it worth it
      true              ✓ always


strictNullChecks does most of the work

    strict: false
      function getName(user: User) {
        return user.name.toUpperCase()
      }
      getName(undefined)          ← accepted!
                                    crashes at runtime

    strict: true
      getName(undefined)
        Argument of type 'undefined' is not assignable
        to parameter of type 'User'        ← caught

    without it, null and undefined are assignable to
    EVERYTHING, so TypeScript cannot catch the most
    common runtime error in JavaScript


    turning strict off to avoid errors
      = turning off the reason you added TypeScript


Start strict, or pay later

    day 1 with strict: true     errors as you write them
    strict added at month 6     hundreds of errors at once`,
      codeExample: {
        title: "A complete no-build tsconfig, option by option",
        code: `// tsconfig.json — Approach A, running .ts directly
// {
//   "compilerOptions": {
//     // ── the four core options ─────────────────────────────
//     "target": "ES2024",              // match the Node you run
//     "module": "NodeNext",            // understands Node's
//     "moduleResolution": "NodeNext",  //   ESM / CJS rules
//     "strict": true,                  // always
//
//     // ── specific to the no-build approach ────────────────
//     "noEmit": true,                  // tsc only checks
//     "allowImportingTsExtensions": true,   // so ./user.ts is legal
//     "verbatimModuleSyntax": true,    // requires import type
//     "erasableSyntaxOnly": true,      // rejects enums etc.
//
//     "types": ["node"],               // @types/node
//     "skipLibCheck": true             // do not check .d.ts files
//   },
//   "include": ["src"]
// }


// ══ What strict actually buys you ═══════════════════════════

type User = { id: number; name: string };

function getName(user: User) {
  return user.name.toUpperCase();
}

// ── strict: false ───────────────────────────────────────────
// getName(undefined);        accepted at compile time
//                            TypeError at runtime
//
// null and undefined are assignable to every type, so the
// most common JavaScript crash is invisible to the checker.

// ── strict: true ────────────────────────────────────────────
// getName(undefined);
//   Argument of type 'undefined' is not assignable to
//   parameter of type 'User'

// and you have to handle the maybe-missing case
function getNameSafely(user: User | undefined) {
  return user?.name.toUpperCase() ?? "unknown";
}

console.log(getNameSafely({ id: 1, name: "Rajan" }));   // RAJAN
console.log(getNameSafely(undefined));                  // unknown


// ══ Why target matters on a backend ═════════════════════════
//
// "target": "ES5"
//   async function f() { await g(); }
//     ↓ rewritten into a generator state machine with
//       __awaiter and __generator helpers
//     ↓ slower, and the stack traces are unreadable
//
// "target": "ES2024"
//   async function f() { await g(); }
//     ↓ emitted as written. Node supports it natively.


// ══ Why moduleResolution matters ════════════════════════════
//
// "moduleResolution": "NodeNext"
//   respects a package's "exports" field, and requires the
//   file extensions ESM needs
//     → TypeScript accepts exactly what Node will resolve
//
// anything older
//   accepts imports that fail at runtime, which is the
//   worst combination: green check, broken app

const user: User = { id: 1, name: "Rajan" };
console.log(getName(user));`,
      },
      keyTakeaways: [
        "`target` is the JavaScript version to emit. Match the Node you actually run, not `ES5`.",
        "An `ES5` target rewrites `async/await` into generator state machines: slower, and unreadable in a stack trace.",
        "`module: \"NodeNext\"` makes TypeScript understand Node's ESM and CommonJS rules from Day 2.",
        "`moduleResolution: \"NodeNext\"` makes it resolve imports the way Node does, honouring `exports` and extensions.",
        "Get resolution wrong and TypeScript accepts imports that fail at runtime. Green check, broken app.",
        "`strict: true` is what makes TypeScript worth having.",
        "<b>`strictNullChecks` does most of the work</b>: without it, `null` and `undefined` are assignable to everything.",
        "That means a non-strict project cannot catch the most common runtime error in JavaScript.",
        "Turning `strict` off to avoid errors is turning off the reason you added TypeScript.",
        "Start strict on day one. Adding it at month six means hundreds of errors at once.",
      ],
      commonMistakes: [
        "<b>Targeting `ES5` on a backend</b> — a browser-era setting that produces slower, harder-to-debug output for no benefit.",
        "<b>Leaving `strict` off, or turning it off to silence errors</b> — you keep the syntax and lose the safety.",
        "<b>Using an old `moduleResolution`</b> — TypeScript then accepts imports that Node cannot resolve at runtime.",
        "<b>Adding `strict` to a mature codebase all at once</b> — enable the sub-options one at a time instead.",
        "<b>Forgetting `\"include\": [\"src\"]`</b> — `tsc` picks up stray files, including anything in `dist`.",
        "<b>Omitting `skipLibCheck`</b> — you spend time on type errors inside your dependencies' declaration files.",
      ],
      quiz: [
        {
          question: "Which single strict sub-option does most of the work?",
          options: [
            "`noImplicitAny`",
            "`strictNullChecks`",
            "`strictFunctionTypes`",
            "`alwaysStrict`",
          ],
          correctIndex: 1,
          explanation:
            "Without it, `null` and `undefined` are assignable to every type, so TypeScript cannot catch reading a property of something missing, which is the most common JavaScript runtime error.",
        },
        {
          question: "Why is `\"target\": \"ES5\"` a bad choice for a Node backend?",
          options: [
            "It is not supported by `tsc`",
            "It rewrites modern syntax like `async/await` into generator state machines, which is slower and harder to debug, for no benefit",
            "It disables type checking",
            "It forces CommonJS",
          ],
          correctIndex: 1,
          explanation:
            "`ES5` exists for old browsers. Node already supports modern JavaScript, so downlevelling only costs you performance and readable stack traces.",
        },
        {
          question: "What goes wrong with an outdated `moduleResolution` setting?",
          options: [
            "Compilation is slower",
            "TypeScript accepts imports that Node cannot actually resolve at runtime",
            "Types are stripped incorrectly",
            "Declaration files are not generated",
          ],
          correctIndex: 1,
          explanation:
            "`NodeNext` makes the compiler follow Node's own rules, including `exports` fields and required extensions. An older setting gives you a passing type check and a broken application.",
        },
      ],
    },
    {
      id: "types-node-and-erasable",
      title: "@types/node and erasableSyntaxOnly",
      durationMinutes: 10,
      explanation:
        "Two things a Node TypeScript project needs that are easy to miss.\n\n---\n\n## `@types/node`\n\nTypeScript does not know Node's APIs on its own. These are Node-specific:\n\n```typescript\nprocess.env\n```\n\n```typescript\nprocess.argv\n```\n\nSo install:\n\n```bash\nnpm install -D @types/node\n```\n\n<b>`@types/node`</b> (TypeScript type definitions for Node's APIs).\n\nNow TypeScript understands:\n\n```text\nprocess\nBuffer\nfs\nhttp\npath\ntimers\nNode.js built-ins\n```\n\n---\n\n## What changes\n\nWithout it:\n\n```typescript\nconsole.log(process.env.PORT);\n```\n\nTypeScript does not know what `process` is:\n\n```text\nCannot find name 'process'.\nDo you need to install type definitions for node?\n```\n\nWith it, you get autocomplete, checking and documentation hints.\n\nOne detail worth knowing: install the version matching the Node you run. `@types/node` is versioned to track Node releases, so `@types/node@24` describes Node 24's APIs. Install an older one and you get errors on APIs that exist perfectly well in your runtime.\n\nAnd a genuinely useful thing it tells you: `process.env.PORT` is typed `string | undefined`. Under `strict` that forces you to handle the missing case, which is exactly the bug from Day 1 where an environment variable is not set and everything downstream gets `undefined`.\n\n---\n\n## `erasableSyntaxOnly`\n\nParticularly useful with native type stripping:\n\n```javascript\n{\n  \"compilerOptions\": {\n    \"erasableSyntaxOnly\": true\n  }\n}\n```\n\n<b>`erasableSyntaxOnly`</b> (reports syntax that cannot be handled by simply removing types).\n\nThis keeps your code compatible with the stripping approach. For example:\n\n```typescript\ninterface User {\n  name: string;\n}\n```\n\nis erasable. Node can remove `interface User` entirely, because it has no runtime behaviour.\n\nThis option is the point of the whole lesson, so it is worth being clear about what it buys you. Without it, you write an enum, `tsc --noEmit` passes cheerfully, and the failure only appears when someone runs the app:\n\n```text\nSyntaxError [ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX]:\nTypeScript enum is not supported in strip-only mode\n```\n\nWith it, `tsc` refuses at check time:\n\n```text\nThis syntax is not allowed when 'erasableSyntaxOnly' is enabled.\n```\n\nThat converts a runtime crash into a compile error, which is the trade you want every time. Any no-build project should have it on.\n\n---\n\n## Erasable TypeScript\n\nSyntax that can be erased:\n\n```typescript\ntype UserId = string;\n\ninterface User {\n  id: number;\n  name: string;\n}\n\nfunction getUser(id: number): User {\n  // ...\n}\n```\n\nAt runtime:\n\n```text\ntype\ninterface\ntype annotations\n```\n\ndo not need to exist.\n\n---\n\n## Non-erasable TypeScript\n\nThings needing generated JavaScript are different:\n\n```typescript\nenum Status {\n  Active,\n  Inactive\n}\n```\n\nThis is not \"remove syntax\", it needs generated behaviour.\n\n```text\nerasable TypeScript\n        ↓\nNode can strip\n\nnon-erasable TypeScript\n        ↓\nUse a compiler/transformation step\n```\n\n---\n\n## The three settings that hold Approach A together\n\nThese work as a set, and each one converts a runtime failure into a compile-time one:\n\n```text\nerasableSyntaxOnly          catches enums, namespaces,\n                            decorators, parameter properties\n\nverbatimModuleSyntax        catches a missing import type\n\nallowImportingTsExtensions  lets you write ./user.ts,\n                            which Node requires\n```\n\nWithout the first two you get failures at startup. Without the third, `tsc` rejects the imports Node needs. Together they make `tsc --noEmit` a genuine guarantee that `node src/index.ts` will run.",
      diagram: `@types/node: what TypeScript learns

    without                        with
    process.env.PORT               process.env.PORT
      Cannot find name 'process'     string | undefined
                                          │
                                     under strict, you MUST
                                     handle the missing case
                                          │
                                     Number(process.env.PORT) ?? 3000

    match the version to your runtime:
      node 24  →  @types/node@24
      older types → errors on APIs that work fine


erasableSyntaxOnly moves the failure earlier

    WITHOUT it
      write an enum
          ↓
      tsc --noEmit    ✓ passes, cheerfully
          ↓
      deploy
          ↓
      node app.ts     ✗ ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX
                        at startup, in production

    WITH it
      write an enum
          ↓
      tsc --noEmit    ✗ "This syntax is not allowed when
                         'erasableSyntaxOnly' is enabled"
          ↓
      fixed before it ever runs


The three settings that make Approach A safe

    erasableSyntaxOnly          ──┐
      catches enum, namespace,    │  each turns a
      decorator, param property   │  RUNTIME crash
                                  ├─ into a
    verbatimModuleSyntax          │  COMPILE error
      catches a missing           │
      import type                 │
                                  │
    allowImportingTsExtensions  ──┘
      lets you write ./user.ts,
      which Node requires

    together: tsc --noEmit becomes a real guarantee
              that node src/index.ts will run`,
      codeExample: {
        title: "The settings that make a no-build project safe",
        code: `// $ npm install -D @types/node@24        match your runtime

// ── What @types/node gives you ──────────────────────────────
console.log(process.env.PORT);        // string | undefined
console.log(process.argv[2]);         // string | undefined
console.log(process.uptime());        // number

// Under strict, "string | undefined" forces the missing case:
const port = Number(process.env.PORT) || 3000;
console.log(port);
//
// That is exactly the Day 1 bug: an env var that is not set,
// silently becoming undefined further downstream.

// const bad: number = process.env.PORT;
//   Type 'string | undefined' is not assignable to 'number'


// ══ erasableSyntaxOnly: the failure moves earlier ═══════════

// ── WITHOUT it ──────────────────────────────────────────────
// enum Status { Active, Inactive }
//
// $ npx tsc --noEmit      ✓ passes
// $ node src/app.ts       ✗ SyntaxError
//   ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX: TypeScript enum is
//   not supported in strip-only mode
//
// Green check, then a crash at startup in production.

// ── WITH it ─────────────────────────────────────────────────
// {
//   "compilerOptions": { "erasableSyntaxOnly": true }
// }
//
// $ npx tsc --noEmit
//   This syntax is not allowed when 'erasableSyntaxOnly'
//   is enabled.
//
// Caught before it ever runs.


// ══ Erasable, and the replacements ══════════════════════════

// ✓ all erasable
type UserId = string;
type Status = "active" | "inactive";        // instead of enum

interface User {
  id: UserId;
  name: string;
  status: Status;
}

function describe(user: User): string {
  return \`\${user.name} (\${user.status})\`;
}

// ✗ non-erasable, all caught by erasableSyntaxOnly
// enum Status { Active, Inactive }
// namespace Users { export function get() {} }
// class S { constructor(private db: string) {} }
// class C { @dec() method() {} }


// ══ The three settings, as a set ════════════════════════════
// {
//   "compilerOptions": {
//     "erasableSyntaxOnly": true,          // no enums etc.
//     "verbatimModuleSyntax": true,        // require import type
//     "allowImportingTsExtensions": true,  // permit ./user.ts
//     "noEmit": true,
//     "strict": true,
//     "types": ["node"]
//   }
// }
//
// Each converts a runtime failure into a compile error.
// Together, "tsc --noEmit" passing genuinely means
// "node src/index.ts" will start.

console.log(describe({ id: "u1", name: "Rajan", status: "active" }));`,
      },
      keyTakeaways: [
        "`@types/node` teaches TypeScript about `process`, `Buffer`, `fs`, `http`, `path` and the rest.",
        "Without it you get \"Cannot find name 'process'\".",
        "Install the version matching your runtime. An older `@types/node` errors on APIs that work fine.",
        "It types `process.env.PORT` as `string | undefined`, which under `strict` forces you to handle the missing case.",
        "That is exactly the Day 1 environment-variable bug, caught by the compiler.",
        "<b>`erasableSyntaxOnly`</b> reports syntax that stripping cannot handle.",
        "Without it, an enum passes `tsc` and then crashes at startup with `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`.",
        "With it, `tsc` refuses at check time. A compile error instead of a production crash.",
        "Three settings hold Approach A together: `erasableSyntaxOnly`, `verbatimModuleSyntax`, `allowImportingTsExtensions`.",
        "Together they make `tsc --noEmit` passing a real guarantee that `node src/index.ts` will start.",
      ],
      commonMistakes: [
        "<b>Forgetting `@types/node`</b> — every `process`, `Buffer` and `__dirname` reference errors out.",
        "<b>An `@types/node` version older than your Node</b> — the compiler rejects APIs your runtime supports perfectly.",
        "<b>Skipping `erasableSyntaxOnly` in a no-build project</b> — non-erasable syntax passes the check and fails at startup.",
        "<b>Asserting away `string | undefined` on an env var</b> — `process.env.PORT!` silences the one warning that was right.",
        "<b>Assuming `tsc --noEmit` guarantees the app runs</b> — it only does once those three settings are on.",
        "<b>Turning `erasableSyntaxOnly` on in a project that compiles</b> — you do not need it there, and it bans syntax `tsc` handles fine.",
      ],
      quiz: [
        {
          question: "Without `erasableSyntaxOnly`, you add an enum to a no-build project. When do you find out?",
          options: [
            "Immediately, from `tsc --noEmit`",
            "At startup, when Node throws `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`",
            "Never, Node handles enums",
            "At install time",
          ],
          correctIndex: 1,
          explanation:
            "`tsc` has no idea you intend to run the file unstripped, so the check passes. The option exists precisely to move that failure from runtime to compile time.",
        },
        {
          question: "`@types/node` types `process.env.PORT` as `string | undefined`. Why does that matter under `strict`?",
          options: [
            "It makes the value faster to read",
            "It forces you to handle the case where the variable is not set",
            "It converts the value to a number",
            "It prevents reading environment variables",
          ],
          correctIndex: 1,
          explanation:
            "An unset variable really is `undefined`, and the type says so. Strict mode then makes you deal with it, catching the classic bug where a missing env var flows silently downstream.",
        },
        {
          question: "Which three options make `tsc --noEmit` a real guarantee that `node src/index.ts` will start?",
          options: [
            "`strict`, `target`, `module`",
            "`erasableSyntaxOnly`, `verbatimModuleSyntax`, `allowImportingTsExtensions`",
            "`noEmit`, `outDir`, `skipLibCheck`",
            "`types`, `include`, `moduleResolution`",
          ],
          correctIndex: 1,
          explanation:
            "Those three catch the exact things stripping fails on: non-erasable syntax, a missing `import type`, and the `.ts` extension Node requires. Each turns a startup crash into a compile error.",
        },
      ],
    },
    {
      id: "a-real-project",
      title: "A real no-build project, end to end",
      durationMinutes: 12,
      explanation:
        "Putting it together.\n\n```text\nnode-ts-app/\n│\n├── package.json\n├── tsconfig.json\n└── src/\n    └── index.ts\n```\n\n---\n\n## `package.json`\n\nBecause we are using ESM:\n\n```javascript\n{\n  \"type\": \"module\"\n}\n```\n\nThat tells Node to treat `.js` as ES modules, and your `.ts` files follow the same rules. Day 2's decision, applying here too.\n\n---\n\n## `src/index.ts`\n\n```typescript\ninterface User {\n  id: number;\n  name: string;\n}\n\nfunction greet(user: User): string {\n  return `Hello ${user.name}`;\n}\n\nconst user: User = {\n  id: 1,\n  name: \"Rajan\",\n};\n\nconsole.log(greet(user));\n```\n\nRun it:\n\n```bash\nnode src/index.ts\n```\n\n```text\nNo compilation step\nNo generated JS file\nNode executes the .ts source using type stripping\n```\n\n---\n\n## But Node does not check it\n\n```typescript\nconst user: User = {\n  id: \"wrong\",\n  name: \"Rajan\",\n};\n```\n\nNode's job is not type checking. So run:\n\n```bash\nnpx tsc --noEmit\n```\n\n<b>`--noEmit`</b> (type-check without generating JavaScript).\n\n```text\nType 'string' is not assignable to type 'number'\n```\n\n---\n\n## A very clean setup\n\n```text\nDevelopment\n     ↓\nnode src/index.ts\n     ↓\nRun directly\n\nType checking\n     ↓\ntsc --noEmit\n     ↓\nFind errors\n```\n\nNo build directory:\n\n```text\nsrc/\n   index.ts\n\nNo:\ndist/\n   index.js\n```\n\nAnd worth appreciating what that removes: no `outDir` to configure, no source maps, no stale build to debug, no \"did you rebuild?\" question, and stack traces that point straight at the file you edited. On a small to medium backend that is a real simplification.\n\n---\n\n## Splitting into files\n\nThe moment you add a second file, Day 2's rules apply:\n\n```typescript\n// src/user.ts\nexport interface User {\n  id: number;\n  name: string;\n}\n\nexport function createUser(id: number, name: string): User {\n  return { id, name };\n}\n```\n\n```typescript\n// src/index.ts\nimport type { User } from \"./user.ts\";\nimport { createUser } from \"./user.ts\";\n\nconst user: User = createUser(1, \"Rajan\");\n\nconsole.log(user);\n```\n\nTwo things there, both established earlier and both required:\n\n<b>The extension is `.ts`</b>, because that is the real file and Node does not rewrite `.js` to `.ts`.\n\n<b>`import type` for the interface</b>, because a plain import of an erased type fails at runtime.\n\n---\n\n## Type checking in CI\n\nYour pipeline should type-check:\n\n```javascript\n{\n  \"scripts\": {\n    \"typecheck\": \"tsc --noEmit\"\n  }\n}\n```\n\n```bash\nnpm run typecheck\n```\n\n```text\nnpm install\n     ↓\nnpm run typecheck\n     ↓\nTests\n     ↓\nDeploy\n```\n\n```text\ntypecheck\n   ↓\nFAIL\n   ↓\nDeployment stops\n```\n\nThis step is not optional in a no-build project, and it is worth being explicit about why. In Approach B, a broken type stops the build, so a bad deploy is impossible. In Approach A <b>there is no build</b>, so nothing stands between a type error and production except this one CI step.\n\nThat is the honest trade for skipping the build: you gain simplicity and you take on the responsibility of running the checker yourself. Put it in CI on day one, before there is anything to fix.",
      diagram: `The whole project

    node-ts-app/
    ├── package.json      { "type": "module" }
    ├── tsconfig.json     noEmit + the three settings
    └── src/
        ├── index.ts
        └── user.ts

    two commands, two jobs

    node src/index.ts     runs it
    npx tsc --noEmit      checks it

    no dist/, no outDir, no source maps,
    no stale build, no "did you rebuild?"


The two rules when you split files

    src/user.ts                    src/index.ts
    export interface User          import type { User }
    export function createUser            from "./user.ts"
                                   import { createUser }
                                          from "./user.ts"
                                            │        │
                            ┌───────────────┘        │
                            ↓                        ↓
                    import type,              .ts, because that
                    because the               IS the file. Node
                    interface is erased       does not rewrite
                    at runtime                .js → .ts


What replaces the build step: CI

    APPROACH B                     APPROACH A
    tsc                            (no build)
      │                                 │
    type error → build FAILS       type error → nothing
      │                            stops it
    a bad deploy is impossible          │
                                   except ONE CI step:
                                     npm run typecheck

    install → typecheck → test → deploy
                  │
                FAIL → deployment stops

    the honest trade: you gain simplicity and take on
    the responsibility of running the checker yourself`,
      codeExample: {
        title: "node-ts-app, complete",
        code: `// ── package.json ────────────────────────────────────────────
// {
//   "name": "node-ts-app",
//   "type": "module",
//   "scripts": {
//     "dev":       "node --watch src/index.ts",
//     "start":     "node src/index.ts",
//     "typecheck": "tsc --noEmit"
//   },
//   "devDependencies": {
//     "@types/node": "^24",
//     "typescript": "^5"
//   }
// }


// ── tsconfig.json ───────────────────────────────────────────
// {
//   "compilerOptions": {
//     "target": "ES2024",
//     "module": "NodeNext",
//     "moduleResolution": "NodeNext",
//     "strict": true,
//     "noEmit": true,
//     "allowImportingTsExtensions": true,
//     "verbatimModuleSyntax": true,
//     "erasableSyntaxOnly": true,
//     "types": ["node"],
//     "skipLibCheck": true
//   },
//   "include": ["src"]
// }


// ── src/user.ts ─────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
}

export function createUser(id: number, name: string): User {
  return { id, name };
}


// ── src/index.ts ────────────────────────────────────────────
// import type { User } from "./user.ts";    ← type, so erasable
// import { createUser } from "./user.ts";   ← value
//
// const user: User = createUser(1, "Rajan");
// console.log(user);
//
// Both details are required:
//   .ts        because that is the real file
//   import type because the interface is erased


// ── Two commands, two jobs ──────────────────────────────────
// $ node src/index.ts
// { id: 1, name: 'Rajan' }
//
// $ npx tsc --noEmit
// (silence = no type errors)


// ── Prove they are separate ─────────────────────────────────
// change index.ts to:
//   const user: User = createUser("1", "Rajan");
//
// $ node src/index.ts
// { id: '1', name: 'Rajan' }        ← runs anyway!
//
// $ npx tsc --noEmit
// src/index.ts(4,34): error TS2345: Argument of type
// 'string' is not assignable to parameter of type 'number'.
//
// Node stripped the types without reading them. Only tsc
// knows anything is wrong.


// ── Which is why CI is not optional here ────────────────────
// .github/workflows/ci.yml
//   - run: npm ci
//   - run: npm run typecheck      ← the only thing standing
//   - run: npm test                 between a type error
//                                   and production
//
// In Approach B a type error breaks the build. In Approach A
// there is no build, so this step is the guard. Add it on
// day one, before there is anything to fix.`,
      },
      keyTakeaways: [
        "A no-build project is `package.json`, `tsconfig.json` and `src/`. No `dist`, no `outDir`, no source maps.",
        "`\"type\": \"module\"` applies to `.ts` files too. Day 2's decision carries over.",
        "Two commands, two jobs: `node src/index.ts` runs it, `tsc --noEmit` checks it.",
        "`--noEmit` type-checks without producing any files.",
        "When you split into files, import with the <b>`.ts` extension</b>, because that is the real file.",
        "Use <b>`import type`</b> for interfaces and types, or the import fails at runtime.",
        "Skipping the build removes stale output, source maps and \"did you rebuild?\" entirely.",
        "It also removes the safety net: in Approach B a type error breaks the build.",
        "In Approach A, <b>the CI typecheck step is the only thing between a type error and production</b>.",
        "Add `\"typecheck\": \"tsc --noEmit\"` and wire it into CI on day one.",
      ],
      commonMistakes: [
        "<b>Assuming a working `node src/index.ts` means the project is sound</b> — it proves only that the syntax was strippable.",
        "<b>No typecheck step in CI</b> — in a no-build project, nothing else catches a type error before production.",
        "<b>Importing `./user.js` when the file is `user.ts`</b> — `ERR_MODULE_NOT_FOUND`.",
        "<b>A plain `import` for an interface</b> — \"does not provide an export named\" at runtime.",
        "<b>Leaving out `\"type\": \"module\"`</b> — your `.ts` files are treated as CommonJS and `import` fails.",
        "<b>Adding a `build` script to a no-build project</b> — now you have two ways to run it and they need different extensions.",
      ],
      quiz: [
        {
          question: "In a no-build TypeScript project, what stops a type error from reaching production?",
          options: [
            "Node refuses to run files with type errors",
            "Nothing except a CI step that runs `tsc --noEmit`",
            "The `erasableSyntaxOnly` option",
            "`@types/node` validates at startup",
          ],
          correctIndex: 1,
          explanation:
            "There is no build to fail. Node strips types without reading them, so the CI typecheck is the only guard. That is the trade you accept for skipping the build.",
        },
        {
          question: "You split `index.ts` and `user.ts` in a no-build project. Which import line is correct?",
          options: [
            "`import { User, createUser } from \"./user.js\"`",
            "`import { User, createUser } from \"./user.ts\"`",
            "`import type { User } from \"./user.ts\"` plus `import { createUser } from \"./user.ts\"`",
            "`import { User, createUser } from \"./user\"`",
          ],
          correctIndex: 2,
          explanation:
            "Both details are needed: the `.ts` extension because that is the real file, and `import type` for the interface because a plain import of an erased type fails at runtime.",
        },
        {
          question: "`node src/index.ts` prints `{ id: '1', name: 'Rajan' }` even though `id` is typed as `number`. Why?",
          options: [
            "Node coerced the value",
            "Node stripped the types without reading them, so nothing checked the assignment",
            "The interface was declared incorrectly",
            "`strict` was not enabled",
          ],
          correctIndex: 1,
          explanation:
            "Stripping deletes annotations without evaluating them. The mismatch is real and `tsc --noEmit` reports it, but Node was never going to.",
        },
      ],
    },
    {
      id: "build-or-no-build",
      title: "Build step or no build step — choosing",
      durationMinutes: 10,
      explanation:
        "You now have two valid architectures. This is how to pick.\n\n---\n\n## No build step\n\n```text\nTypeScript\n    ↓\n   Node\n    ↓\nProduction\n```\n\nAdvantages:\n\n```text\nSimple\nFewer build artifacts\nLess configuration\nFast development\n```\n\nBut your TypeScript has to stay within syntax Node can strip.\n\n---\n\n## Build step\n\n```text\nTypeScript\n    ↓\ntsc / SWC\n    ↓\nJavaScript\n    ↓\n   Node\n```\n\nAdvantages:\n\n```text\nMore transformation options\nMore control\nCan generate declaration files\nCan support non-erasable syntax\n```\n\nBut:\n\n```text\nMore configuration\nBuild required\nMore artifacts\n```\n\n---\n\n## Which should you choose?\n\nFor a simple modern Node backend:\n\n```text\nNative Node TypeScript\n+\ntsc --noEmit\n```\n\nis very clean, <b>if your code only uses syntax Node can strip</b>.\n\nIf your project needs:\n\n```text\nDecorators\nEnums requiring transformation\nCustom compilation\nBundling\nJSX\nComplex build transformations\n```\n\nthen use `tsc`, or SWC.\n\n---\n\n## The decision, in one question\n\nThe list above collapses to something simpler. Ask:\n\n> Am I <b>publishing</b> this, or <b>running</b> it?\n\n<b>Running it</b>, as a service you deploy: nobody outside consumes your types, so declaration files are pointless and no build is the better default. A container runs `node src/index.ts` and there is nothing to go stale.\n\n<b>Publishing it</b>, as a library on npm: you need a build, no question. Consumers need real `.js` and `.d.ts` files, because you cannot expect them to strip your TypeScript for you. Day 7's `exports` field points at compiled output.\n\nAnd one thing that overrides both: <b>a decorator-based framework</b>. NestJS or TypeORM means a build, whatever else you would have preferred.\n\n---\n\n## The mental model\n\n```text\n                    TypeScript\n                        │\n             ┌──────────┴──────────┐\n             ↓                     ↓\n        Type checking          Runtime code\n             │                     │\n       tsc --noEmit              Node\n             │                     │\n       Find mistakes          Type stripping\n                                   │\n                                   ↓\n                              JavaScript\n```\n\nAnd:\n\n```text\nErasable syntax\n      ↓\nNode can strip\n      ↓\nRun .ts directly\n```\n\nwhile:\n\n```text\nNon-erasable syntax\n      ↓\nNeeds transformation\n      ↓\nUse compiler/transpiler\n```\n\n---\n\n## Day 5 goal\n\nYou should be able to explain:\n\n> <b>\"Modern Node.js can run TypeScript directly by stripping erasable type syntax, but it doesn't replace TypeScript's type checker. I can use Node for execution and `tsc --noEmit` for type checking. If my project needs TypeScript transformations such as non-erasable syntax, I need a real compiler or transpiler.\"</b>\n\nAnd this rule:\n\n```text\nCan Node erase it?\n        │\n       YES\n        ↓\nnode file.ts\n\n       NO\n        ↓\nUse tsc / SWC / another transformer\n```\n\nThat distinction saves a <b>lot</b> of confusion.\n\nOne last reassurance: this is not a one-way door. Moving from no-build to a build later means adding `outDir`, dropping `allowImportingTsExtensions`, and changing your import extensions from `.ts` to `.js`. A single find-and-replace and a config edit. So start with the simpler option, and switch if a real need turns up.",
      diagram: `The decision, in one question

    "Am I publishing this, or running it?"
                    │
        ┌───────────┴───────────┐
      RUNNING                PUBLISHING
      a service              a library on npm
        │                        │
    nobody consumes         consumers need real
    your types              .js and .d.ts files
        │                        │
    NO BUILD                 BUILD, no question
        │                        │
    node src/index.ts        tsc → dist/
    tsc --noEmit             exports points at dist


    overriding both:
      decorator framework (NestJS, TypeORM) → BUILD


Side by side

    NO BUILD                      BUILD
    ─────────────────────────────────────────────────
    simple                        more control
    no artifacts                  .d.ts files
    no stale output               non-erasable syntax
    no source maps                bundling, JSX
    no "did you rebuild?"         faster startup
                                    (nothing to strip)

    must stay erasable            more configuration
    CI typecheck is the           a build to run
      only guard                  artifacts to manage


Not a one-way door

    no build  ──────────────────────────►  build
                add "outDir"
                drop allowImportingTsExtensions
                ./user.ts  →  ./user.js

    one find-and-replace and a config edit.
    start simple, switch if a real need appears.`,
      codeExample: {
        title: "The same project, both ways",
        code: `// ══ NO BUILD — a service you deploy ═════════════════════════
//
// package.json
// {
//   "type": "module",
//   "scripts": {
//     "dev":       "node --watch src/index.ts",
//     "start":     "node src/index.ts",
//     "typecheck": "tsc --noEmit"
//   }
// }
//
// tsconfig.json
// {
//   "compilerOptions": {
//     "noEmit": true,
//     "allowImportingTsExtensions": true,
//     "erasableSyntaxOnly": true,
//     "verbatimModuleSyntax": true,
//     "strict": true, "module": "NodeNext",
//     "moduleResolution": "NodeNext", "target": "ES2024"
//   },
//   "include": ["src"]
// }
//
// imports:  import { createUser } from "./user.ts";
//
// Dockerfile
//   CMD ["node", "src/index.ts"]
//   ← nothing to build, nothing to go stale


// ══ BUILD — a library you publish ═══════════════════════════
//
// package.json
// {
//   "type": "module",
//   "main": "./dist/index.js",
//   "types": "./dist/index.d.ts",
//   "exports": {
//     ".": {
//       "types": "./dist/index.d.ts",
//       "import": "./dist/index.js"
//     }
//   },
//   "files": ["dist"],
//   "scripts": {
//     "build": "tsc",
//     "prepublishOnly": "npm run build",
//     "typecheck": "tsc --noEmit"
//   }
// }
//
// tsconfig.json
// {
//   "compilerOptions": {
//     "outDir": "dist",
//     "declaration": true,          // the .d.ts consumers need
//     "declarationMap": true,
//     "sourceMap": true,
//     "strict": true, "module": "NodeNext",
//     "moduleResolution": "NodeNext", "target": "ES2024"
//   },
//   "include": ["src"]
// }
//
// imports:  import { createUser } from "./user.js";
//           ← .js, because that is what tsc emits
//
// A consumer cannot strip your TypeScript for them, so a
// published package needs real .js and .d.ts. Day 7's
// exports field points at dist.


// ══ Migrating between them ══════════════════════════════════
//
// no build → build
//   1. add    "outDir": "dist"
//   2. remove "noEmit", "allowImportingTsExtensions",
//             "erasableSyntaxOnly"
//   3. rewrite ./user.ts  →  ./user.js   (find and replace)
//   4. start  node dist/index.js
//
// Not a one-way door. Start simple.


// ══ The rule ════════════════════════════════════════════════
//   Can Node erase it?
//     YES  →  node file.ts
//     NO   →  tsc / SWC
//
//   Publishing?          →  build
//   Decorator framework? →  build
//   Otherwise            →  no build`,
      },
      keyTakeaways: [
        "Both architectures are valid. No build is simpler, a build gives more control.",
        "No build means fewer artifacts, no stale output, no source maps and no \"did you rebuild?\".",
        "A build supports non-erasable syntax, declaration files, bundling and JSX.",
        "The decision collapses to one question: <b>am I publishing this, or running it?</b>",
        "<b>Running a service</b>: nobody consumes your types, so no build is the better default.",
        "<b>Publishing a library</b>: a build, no question. Consumers need real `.js` and `.d.ts`.",
        "A decorator-based framework (NestJS, TypeORM) overrides both and requires a build.",
        "The rule: can Node erase it? Yes means `node file.ts`. No means `tsc` or SWC.",
        "Whichever you pick, `tsc --noEmit` still runs. Node never checks types.",
        "It is <b>not a one-way door</b>: switching means a config edit and changing `.ts` imports to `.js`.",
      ],
      commonMistakes: [
        "<b>Adding a build step by default</b> — for a service you deploy, it is configuration and artifacts for no gain.",
        "<b>Publishing a library without a build</b> — consumers cannot strip your TypeScript, and they need `.d.ts` files.",
        "<b>Choosing no build for a NestJS project</b> — decorators make it impossible, whatever else you would prefer.",
        "<b>Skipping `tsc --noEmit` because there is a build</b> — a build without `noEmit` still checks, but keep the script so CI is explicit.",
        "<b>Treating the choice as permanent</b> — migrating is a config edit and a find-and-replace on import extensions.",
        "<b>Running `.ts` in development and `.js` in production</b> — the extensions differ, so this breaks. Pick one for both.",
      ],
      quiz: [
        {
          question: "You are building a service you deploy in a container. Which approach is the better default?",
          options: [
            "A build step, for production safety",
            "No build step, since nobody outside consumes your types",
            "Both, one per environment",
            "It depends on the database",
          ],
          correctIndex: 1,
          explanation:
            "Declaration files only matter to external consumers, and a service has none. No build means nothing to go stale and `node src/index.ts` in the Dockerfile.",
        },
        {
          question: "You are publishing a package to npm. Why is a build non-negotiable?",
          options: [
            "npm rejects TypeScript files",
            "Consumers need real `.js` and `.d.ts` files, since you cannot expect them to strip your TypeScript",
            "TypeScript cannot be minified otherwise",
            "The `exports` field requires it",
          ],
          correctIndex: 1,
          explanation:
            "A consumer's toolchain is not yours. They need runnable JavaScript and declaration files for their own type checking, which is exactly what `tsc` emits.",
        },
        {
          question: "What does switching from no-build to a build step actually involve?",
          options: [
            "A rewrite of the source",
            "Adding `outDir`, dropping the no-build options, and changing `.ts` import extensions to `.js`",
            "Nothing, both work simultaneously",
            "Migrating to CommonJS",
          ],
          correctIndex: 1,
          explanation:
            "It is a config edit plus one find-and-replace on import extensions, which is why starting with the simpler option is safe. It is not a one-way door.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What are TypeScript's two separate jobs?",
      options: [
        "Compiling and minifying",
        "Type checking, and transforming code so it can run",
        "Linting and formatting",
        "Bundling and tree-shaking",
      ],
      correctIndex: 1,
      explanation:
        "Keeping those apart is the whole day. Node handles a limited form of the second job by stripping types, and does none of the first.",
    },
    {
      question: "`const age: number = \"hello\"`. What does `node file.ts` do?",
      options: [
        "Reports a type error",
        "Runs and prints `hello`, because stripping does not read the types",
        "Coerces the value to `0`",
        "Throws at startup",
      ],
      correctIndex: 1,
      explanation:
        "Node deletes `: number` without evaluating it. A file full of type errors runs exactly as well as a correct one, which is why `tsc --noEmit` is a separate step.",
    },
    {
      question: "Why does `import { User } from \"./user.ts\"` fail at runtime when `User` is an interface?",
      options: [
        "Interfaces cannot be exported",
        "Stripping is per-file, so the interface is erased in `user.ts` while the import in `index.ts` remains",
        "The extension is wrong",
        "`User` needs a default export",
      ],
      correctIndex: 1,
      explanation:
        "Node cannot tell a type import from a value import by looking at one file. `import type` marks it erasable, and `verbatimModuleSyntax` makes the compiler require it.",
    },
    {
      question: "Why can an `enum` not be stripped?",
      options: [
        "It requires a type checker",
        "It becomes a real runtime object mapping names to values and back, so it has to be generated",
        "Enums are deprecated",
        "It needs CommonJS",
      ],
      correctIndex: 1,
      explanation:
        "There is nothing to delete. Node reports `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX` rather than guessing, and a union of string literals is the erasable replacement.",
    },
    {
      question: "You run `node src/index.ts` and it imports `./user.js`, but the file is `user.ts`. What happens?",
      options: [
        "Node resolves it to `user.ts`",
        "`ERR_MODULE_NOT_FOUND`, because Node does not rewrite the extension",
        "It works with a warning",
        "`tsc` fixes it at check time",
      ],
      correctIndex: 1,
      explanation:
        "The extension is a consequence of which approach you chose. Running `.ts` directly means importing `./user.ts`, which also needs `allowImportingTsExtensions`.",
    },
    {
      question: "Which strict sub-option does most of the work?",
      options: ["`noImplicitAny`", "`strictNullChecks`", "`strictBindCallApply`", "`useUnknownInCatchVariables`"],
      correctIndex: 1,
      explanation:
        "Without it, `null` and `undefined` are assignable to every type, so TypeScript cannot catch reading a property of something missing. That is the most common JavaScript runtime error.",
    },
    {
      question: "What does `erasableSyntaxOnly` buy a no-build project?",
      options: [
        "Faster type checking",
        "It turns a startup crash on non-erasable syntax into a compile-time error",
        "It strips types more aggressively",
        "It generates declaration files",
      ],
      correctIndex: 1,
      explanation:
        "Without it, an enum passes `tsc` and then fails when Node runs the file. With it, the checker refuses first, which is the trade you want every time.",
    },
    {
      question: "Which single question best decides build versus no build?",
      options: [
        "How large is the codebase?",
        "Am I publishing this, or running it?",
        "Which Node version am I on?",
        "Do I use ESM or CommonJS?",
      ],
      correctIndex: 1,
      explanation:
        "A published library needs real `.js` and `.d.ts` for its consumers. A service you deploy has no external consumers, so no build is the simpler default. A decorator framework overrides both.",
    },
  ],
  project: {
    name: "node-ts-demo",
    goal: "Build a two-file TypeScript project that runs with no build step, and prove that running it and type-checking it are separate jobs.",
    brief:
      "The point is the proof, not the program. You are demonstrating that `node src/index.ts` succeeding tells you nothing about your types, and that `tsc --noEmit` is what actually checks them. Two details will bite if you get them wrong, and both are the lesson: the import extension must be `.ts` because that is the real file, and the interface needs `import type` because it is erased at runtime.",
    steps: [
      "Create `node-ts-demo/` with `package.json` containing `\"type\": \"module\"`, a `tsconfig.json`, and `src/`.",
      "Install the tooling: `npm install -D typescript @types/node`.",
      "In `tsconfig.json` set `strict`, `noEmit`, `module` and `moduleResolution` to `NodeNext`, plus `allowImportingTsExtensions`, `verbatimModuleSyntax` and `erasableSyntaxOnly`.",
      "Write `src/user.ts` exporting a `User` interface and a `createUser(id: number, name: string): User` function.",
      "Write `src/index.ts` that imports both and logs the result. Use `import type` for `User` and the `.ts` extension on both imports.",
      "Run it with `node src/index.ts` and confirm you get the user object, with no build step and no generated files.",
      "Run `npx tsc --noEmit` and confirm it reports nothing.",
      "Now break it: change the call to `createUser(\"1\", \"Rajan\")`. Run both commands again and compare what each one says.",
      "Add `\"typecheck\": \"tsc --noEmit\"` to your scripts and confirm `npm run typecheck` fails while the code still runs.",
    ],
    acceptance: [
      "`node src/index.ts` prints the user object, with no `dist/` directory anywhere.",
      "`npx tsc --noEmit` passes on the correct version and generates no files.",
      "With `createUser(\"1\", \"Rajan\")`, `node src/index.ts` still runs and prints `{ id: '1', ... }`.",
      "With that same error, `npm run typecheck` fails with \"Argument of type 'string' is not assignable to parameter of type 'number'\".",
      "You can explain why those two commands disagree, in terms of stripping versus checking.",
      "Changing the import to `./user.js` produces `ERR_MODULE_NOT_FOUND`, and you can say why Node does not rewrite it.",
      "Changing `import type { User }` to a plain `import` produces \"does not provide an export named 'User'\", and you can say why.",
    ],
    stretch: [
      "Add an `enum Status { Active, Inactive }` and watch `tsc` reject it because of `erasableSyntaxOnly`. Remove the option and watch the failure move to runtime instead.",
      "Replace that enum with `type Status = \"active\" | \"inactive\"` and confirm both commands are happy.",
      "Read `process.env.PORT` and let `strict` force you to handle the `string | undefined` case.",
      "Convert the project to Approach B: add `outDir`, drop the three no-build options, change the imports to `./user.js`, and run `node dist/index.js`.",
      "Add a GitHub Actions workflow that runs `npm ci` then `npm run typecheck`, so a type error stops a deploy.",
    ],
  },
};
