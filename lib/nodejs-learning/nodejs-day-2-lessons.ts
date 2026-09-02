import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_2_LESSONS: LessonDay = {
  day: 2,
  title: "Modules — ESM vs CommonJS",
  totalMinutes: 88,
  difficulty: "Beginner",
  lessons: [
    {
      id: "what-is-a-module",
      title: "What a module is, and why Node has two systems",
      durationMinutes: 8,
      explanation:
        "Modules are how you split a large application into smaller, reusable files. The confusing part is that Node.js supports <b>two module systems</b>:\n\n```text\nESM (modern JavaScript)\nCommonJS (older Node.js system)\n```\n\nIf that feels muddy at first, that is normal. The goal of today is to make the difference obvious, and to make you able to look at any Node file and know instantly which system it is using.\n\n---\n\n## What is a module?\n\n<b>Module</b> (a file containing code that another file can import and reuse).\n\nInstead of everything living in one place:\n\n```text\napp.js\n```\n\nyou split it up:\n\n```text\nproject/\n├── app.js\n├── user.js\n├── database.js\n└── utils.js\n```\n\n```javascript\n// user.js\n\nexport function getUser() {\n  return {\n    id: 1,\n    name: \"Rajan\",\n  };\n}\n```\n\n```javascript\n// app.js\n\nimport { getUser } from \"./user.js\";\n\nconst user = getUser();\n\nconsole.log(user);\n```\n\nThis makes an application easier to understand, test, maintain, reuse and scale.\n\nOne detail that matters later: in Node, <b>every file is its own scope</b>. A `const` in `user.js` is not visible in `app.js` unless you export it. That is different from dropping two `<script>` tags on a web page, where everything lands in one shared global.\n\n---\n\n## Two systems\n\n```text\nESM\n↓\nimport / export\n\nCommonJS\n↓\nrequire() / module.exports\n```\n\n<b>ESM (ECMAScript Modules)</b> is the module system built into the JavaScript language itself.\n\n```javascript\nimport { add } from \"./math.js\";\n\nexport function multiply(a, b) {\n  return a * b;\n}\n```\n\n<b>CommonJS</b> is the older system Node invented for itself, years before JavaScript had one of its own.\n\n```javascript\nconst { add } = require(\"./math\");\n\nmodule.exports = {\n  multiply,\n};\n```\n\nThe comparison in one place:\n\n```text\nESM                          CommonJS\n─────────────────────────────────────────────────────\nimport                       require()\nexport                       module.exports\nlanguage standard            Node's own older system\nstatic, analysed up front    resolved as it runs\nloads asynchronously         loads synchronously\ntop-level await works        top-level await does not\nbrowsers understand it       browsers do not\n```\n\nWhy does the split exist at all? Node.js launched in 2009, and JavaScript had no module system. Node built CommonJS to fill the gap. ESM was standardised in 2015 and Node had to support it without breaking the millions of packages already written the old way. Hence two systems, living side by side.\n\nThat history is also why the two behave differently rather than just looking different, and most of today is about that difference.",
      diagram: `One file becomes several

    everything in one place        split into modules
    ┌──────────────────┐          ┌─────────────────────┐
    │                  │          │ app.js              │
    │     app.js       │          ├─────────────────────┤
    │                  │   ───►   │ user.js             │
    │   500 lines      │          ├─────────────────────┤
    │                  │          │ database.js         │
    │                  │          ├─────────────────────┤
    │                  │          │ utils.js            │
    └──────────────────┘          └─────────────────────┘

    Every file is its own scope. Nothing leaks
    between them unless you export it.


Two systems, and why

    2009  Node.js launches
            │  JavaScript has no module system
            ↓
          CommonJS invented for Node
          require() / module.exports
            │
    2015  ES modules standardised in the language
            │  millions of CommonJS packages already exist
            ↓
          Node supports BOTH
            │
            ├── ESM        import / export     ← use this for new code
            └── CommonJS   require / exports   ← still everywhere


The split in one line each

    ESM        static, async, part of the language
    CommonJS   dynamic, sync, Node's own invention

    That difference in loading is the root of
    almost every interop problem you will meet.`,
      codeExample: {
        title: "The same module, written both ways",
        code: `// ═══ ESM ════════════════════════════════════════════════════

// math.js
export function add(a, b) {
  return a + b;
}

// app.js
import { add } from "./math.js";
console.log(add(10, 20));               // 30


// ═══ CommonJS ═══════════════════════════════════════════════

// math.js
function add(a, b) {
  return a + b;
}
module.exports = { add };

// app.js
const { add } = require("./math");
console.log(add(10, 20));               // 30


// ═══ Every file is its own scope ════════════════════════════

// secret.js
const apiKey = "abc123";                // not exported
export const publicName = "my-api";

// app.js
import { publicName } from "./secret.js";
console.log(publicName);                // "my-api"
// console.log(apiKey);                 // ReferenceError
//
// Unlike two <script> tags in a browser, module files do not
// share a global scope. Nothing escapes without an export.`,
      },
      keyTakeaways: [
        "A <b>module</b> is a file whose code another file can import.",
        "In Node, every file is its own scope. Nothing is shared unless you export it.",
        "<b>ESM</b> uses `import` / `export` and is part of the JavaScript language.",
        "<b>CommonJS</b> uses `require()` / `module.exports` and is Node's own older system.",
        "Both exist because Node predates ES modules by six years and cannot break existing packages.",
        "ESM is static and loads asynchronously. CommonJS is dynamic and loads synchronously.",
        "That loading difference, not the syntax, is what causes the interop problems later in this day.",
      ],
      commonMistakes: [
        "<b>Expecting a `const` in one file to be visible in another</b> — module files do not share a global scope. Export it.",
        "<b>Thinking CommonJS is deprecated</b> — it is older, not dead. A huge share of npm is still CommonJS, and you will read it constantly.",
        "<b>Mixing `import` and `require` in the same file</b> — pick one system per file. Node will reject the combination.",
        "<b>Assuming the difference is only syntax</b> — the loading model differs too, which is why some conversions are not a simple find-and-replace.",
      ],
      quiz: [
        {
          question: "Why does Node.js support two module systems instead of one?",
          options: [
            "ESM is only for browsers, CommonJS only for servers",
            "Node predates ES modules, and cannot break the packages already written for CommonJS",
            "CommonJS is faster, so it was kept for performance",
            "ESM cannot load npm packages",
          ],
          correctIndex: 1,
          explanation:
            "Node launched in 2009 with no language module system available, so it built CommonJS. ESM arrived in 2015, and dropping CommonJS would have broken most of npm.",
        },
        {
          question: "In `secret.js` you write `const apiKey = \"abc123\"` without exporting it. What can `app.js` see?",
          options: [
            "`apiKey`, because both files run in the same process",
            "Nothing, because every module file has its own scope",
            "`apiKey`, but only in CommonJS",
            "`apiKey` as `undefined`",
          ],
          correctIndex: 1,
          explanation:
            "Module files do not share a global scope the way two `<script>` tags on a page do. Only what you export crosses the file boundary.",
        },
      ],
    },
    {
      id: "esm-syntax",
      title: "ESM — export, import and default export",
      durationMinutes: 12,
      explanation:
        "The modern syntax, and the one to use for new projects.\n\n---\n\n## `export`\n\nCreate `math.js`:\n\n```javascript\nexport function add(a, b) {\n  return a + b;\n}\n\nexport function subtract(a, b) {\n  return a - b;\n}\n```\n\nThose are <b>named exports</b>. Anything with `export` in front of it is available to other files.\n\nYou can also list them at the bottom instead, which some people find easier to scan:\n\n```javascript\nfunction add(a, b) {\n  return a + b;\n}\n\nfunction subtract(a, b) {\n  return a - b;\n}\n\nexport { add, subtract };\n```\n\nBoth forms are identical in effect.\n\n---\n\n## `import`\n\n<b>`import`</b> (loads something another module exported).\n\n```javascript\nimport { add, subtract } from \"./math.js\";\n\nconsole.log(add(10, 20));\nconsole.log(subtract(20, 10));\n```\n\nThe names in the braces must <b>match the exported names exactly</b>. This is not destructuring, even though it looks like it. Get a name wrong and Node fails before your code runs a single line, because ESM imports are checked up front.\n\nRename with `as` when a name collides:\n\n```javascript\nimport { add as addNumbers } from \"./math.js\";\n```\n\nOr grab everything as one object:\n\n```javascript\nimport * as math from \"./math.js\";\n\nconsole.log(math.add(10, 20));\n```\n\nThat object is called the <b>module namespace</b>, and it is read-only. `math.add = ...` throws.\n\n---\n\n## Default export\n\nA module can have one <b>default export</b>, its single main thing:\n\n```javascript\nexport default function greet(name) {\n  return `Hello, ${name}`;\n}\n```\n\nImported without braces, and you may call it whatever you like:\n\n```javascript\nimport greet from \"./greet.js\";\n\nconsole.log(greet(\"Rajan\"));\n```\n\nThe distinction:\n\n```text\nNamed export\n↓\nimport { greet }        name must match\n\nDefault export\n↓\nimport greet            name is yours to choose\n```\n\nA module can have both:\n\n```javascript\n// logger.js\nexport default function log(message) { /* ... */ }\nexport function warn(message) { /* ... */ }\n```\n\n```javascript\nimport log, { warn } from \"./logger.js\";\n```\n\nWhich should you use? For application code, prefer <b>named exports</b>. They are self-documenting, they survive renaming and refactoring tools better, and a typo in the name fails immediately rather than handing you `undefined`. Reach for a default when a file genuinely exports one thing, such as a single Express router or a class.",
      diagram: `Named vs default

    math.js                          app.js
    ┌──────────────────────┐        ┌──────────────────────────┐
    │ export function add  │ ─────► │ import { add }           │
    │ export function sub  │ ─────► │ import { sub }           │
    └──────────────────────┘        │                          │
      names must match  ────────────┤ import { adr }  ✗ fails  │
                                    └──────────────────────────┘

    greet.js                         app.js
    ┌──────────────────────┐        ┌──────────────────────────┐
    │ export default fn    │ ─────► │ import greet             │
    └──────────────────────┘        │ import hello   also fine │
      one per module                │ import anything          │
      you pick the name             └──────────────────────────┘


Three ways to import

    import { add, sub } from "./math.js"      pick specific names
    import { add as plus } from "./math.js"   rename on the way in
    import * as math from "./math.js"         the whole namespace
                                              (read-only object)


import is NOT destructuring

    const { add } = someObject      runtime, forgiving
                                    wrong name → undefined

    import { add } from "./m.js"    checked before running
                                    wrong name → the file
                                    will not start at all`,
      codeExample: {
        title: "Every ESM export and import form",
        code: `// ═══ math.js — named exports ════════════════════════════════
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export const PI = 3.14159;

// or list them at the bottom, identical in effect:
// function add(a, b) { return a + b; }
// export { add, subtract };


// ═══ greet.js — a default export ════════════════════════════
export default function greet(name) {
  return \`Hello, \${name}\`;
}


// ═══ logger.js — both at once ═══════════════════════════════
export default function log(message) {
  console.log(message);
}

export function warn(message) {
  console.error(message);
}


// ═══ app.js — importing all of it ═══════════════════════════

// named: the braces, and the names must match exactly
import { add, subtract, PI } from "./math.js";
console.log(add(10, 20), subtract(20, 10), PI);

// renamed, when a name would collide
import { add as addNumbers } from "./math.js";
console.log(addNumbers(1, 2));

// the whole namespace as one read-only object
import * as math from "./math.js";
console.log(math.add(10, 20));
// math.add = () => {};              // TypeError: read only

// default: no braces, and you choose the name
import greet from "./greet.js";
import sayHi from "./greet.js";      // same function, different name
console.log(greet("Rajan"), sayHi("Rajan"));

// default and named together
import log, { warn } from "./logger.js";
log("started");
warn("careful");

// ── A typo fails before anything runs ──────────────────────
// import { adr } from "./math.js";
//   SyntaxError: The requested module './math.js' does not
//   provide an export named 'adr'
//
// Not undefined. Not a runtime crash later. The file does
// not start, because ESM checks imports up front.`,
      },
      keyTakeaways: [
        "Anything with `export` in front of it is a <b>named export</b>, available to other files.",
        "`import { add }` requires the name to match the export exactly. It is not destructuring.",
        "A wrong name fails <b>before your code runs</b>, because ESM checks imports up front.",
        "`import { add as plus }` renames on the way in, for collisions.",
        "`import * as math` gives you the read-only <b>module namespace</b> object.",
        "A module has at most one `export default`, imported without braces under any name you like.",
        "Prefer named exports in application code. They are self-documenting and fail loudly on typos.",
        "Use a default when the file genuinely exports one thing, like a single router or class.",
      ],
      commonMistakes: [
        "<b>Treating `import { x }` as destructuring</b> — the name must match an actual export, and a mismatch is a startup error, not `undefined`.",
        "<b>Putting braces around a default import</b> — `import { greet } from \"./greet.js\"` fails when `greet` was the default export.",
        "<b>Leaving braces off a named import</b> — `import add from \"./math.js\"` looks for a default that does not exist.",
        "<b>Two default exports in one file</b> — only one is allowed. You get a syntax error.",
        "<b>Assigning to an imported binding</b> — imports are read-only. `add = somethingElse` throws.",
        "<b>Defaulting everything out of habit</b> — named exports rename cleanly and catch typos at startup.",
      ],
      quiz: [
        {
          question: "You write `import { adr } from \"./math.js\"` but the export is named `add`. What happens?",
          options: [
            "`adr` is `undefined` and fails when you call it",
            "Node throws before running any of your code",
            "Node guesses the closest matching name",
            "It works, because `import` destructures the module",
          ],
          correctIndex: 1,
          explanation:
            "ESM imports are checked up front, so you get a SyntaxError about the missing export and the file never runs. That early failure is one of the advantages of named exports.",
        },
        {
          question: "`greet.js` has `export default function greet(name) { ... }`. Which import works?",
          options: [
            "`import { greet } from \"./greet.js\"`",
            "`import greet from \"./greet.js\"`",
            "`import * from \"./greet.js\"`",
            "`import default greet from \"./greet.js\"`",
          ],
          correctIndex: 1,
          explanation:
            "A default export is imported without braces, and the local name is yours to choose. `import hello from \"./greet.js\"` would give you the same function.",
        },
        {
          question: "Why prefer named exports over default exports in application code?",
          options: [
            "They load faster",
            "Default exports do not work in Node",
            "The name is self-documenting and a typo fails at startup instead of becoming `undefined`",
            "You can only have one named export per file",
          ],
          correctIndex: 2,
          explanation:
            "Named exports carry their name across files, so tooling can rename them and a mismatch is caught before anything runs. Defaults are best for files that genuinely export one thing.",
        },
      ],
    },
    {
      id: "commonjs-syntax",
      title: "CommonJS — module.exports and require",
      durationMinutes: 8,
      explanation:
        "You will not write much new CommonJS, but you will read a lot of it. Most tutorials, most Stack Overflow answers and a large share of npm are still CommonJS.\n\n---\n\n## `module.exports`\n\nCommonJS exports through a single object:\n\n```javascript\nfunction add(a, b) {\n  return a + b;\n}\n\nfunction subtract(a, b) {\n  return a - b;\n}\n\nmodule.exports = {\n  add,\n  subtract,\n};\n```\n\nAnd loads it with `require`:\n\n```javascript\nconst { add, subtract } = require(\"./math\");\n\nconsole.log(add(10, 20));\n```\n\nHere the braces <b>are</b> destructuring, on an ordinary object. That is the deep difference: CommonJS hands you a value at runtime, so a wrong name gives you `undefined` and a crash later, while ESM checks the names before anything runs.\n\nYou can also export one thing directly:\n\n```javascript\nmodule.exports = function greet(name) {\n  return `Hello, ${name}`;\n};\n```\n\n```javascript\nconst greet = require(\"./greet\");\n```\n\nThat is CommonJS's rough equivalent of a default export.\n\n---\n\n## Side by side\n\n### ESM\n\n```javascript\n// math.js\n\nexport function add(a, b) {\n  return a + b;\n}\n```\n\n```javascript\n// app.js\n\nimport { add } from \"./math.js\";\n```\n\n### CommonJS\n\n```javascript\n// math.js\n\nfunction add(a, b) {\n  return a + b;\n}\n\nmodule.exports = { add };\n```\n\n```javascript\n// app.js\n\nconst { add } = require(\"./math\");\n```\n\nThe shape to remember:\n\n```text\nESM\nexport → import\n\nCommonJS\nmodule.exports → require\n```\n\nNotice the file extension. ESM needs `\"./math.js\"`. CommonJS is happy with `\"./math\"` and will work out the rest. Lesson 4 explains why.\n\n---\n\n## Two traps worth knowing\n\n`require` is <b>synchronous</b>. It stops and loads the file right there, which is exactly why `require` cannot easily load an ES module, and why top-level `await` never worked in CommonJS. Keep that in mind, because it explains most of what comes later today.\n\nAnd `exports` is not `module.exports`. This works:\n\n```javascript\nexports.add = add;        // adds a property to the same object\n```\n\nThis quietly does nothing:\n\n```javascript\nexports = { add };        // reassigns a local variable\n```\n\nThe caller receives `module.exports`, so replacing the whole thing has to be written as `module.exports = { add }`. That one catches everybody once.",
      diagram: `The two systems, mirrored

    ESM                            CommonJS
    ─────────────────────────────────────────────────────
    export function add       │    module.exports = { add }
    import { add } from       │    const { add } = require(
      "./math.js"             │      "./math")
                              │
    extension required        │    extension optional
    names checked up front    │    plain object at runtime
    loads asynchronously      │    loads synchronously


Why the braces mean different things

    CommonJS
      const { add } = require("./math")
            └─ real destructuring of a real object
               wrong name → undefined → crash later

    ESM
      import { add } from "./math.js"
             └─ a binding request, verified first
                wrong name → nothing runs at all


exports vs module.exports

    exports.add = add          ✓  same object the caller gets
    module.exports = { add }   ✓  replaces it properly
    exports = { add }          ✗  reassigns a local variable,
                                  caller sees {} and you get
                                  no error at all`,
      codeExample: {
        title: "CommonJS, and the exports trap",
        code: `// ═══ math.js — the object form ══════════════════════════════
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = { add, subtract };


// ═══ greet.js — exporting one thing ═════════════════════════
module.exports = function greet(name) {
  return \`Hello, \${name}\`;
};


// ═══ app.js — require ══════════════════════════════════════
const { add, subtract } = require("./math");    // no extension needed
const greet = require("./greet");

console.log(add(10, 20));                       // 30
console.log(greet("Rajan"));                    // Hello, Rajan

// these braces ARE destructuring, on a plain object
const { adr } = require("./math");
console.log(adr);                               // undefined
// adr(1, 2);                                   // TypeError, later,
//                                                 far from the typo


// ═══ The exports trap ══════════════════════════════════════

// ✓ adding properties to the object the caller receives
exports.add = add;
exports.subtract = subtract;

// ✓ replacing it wholesale
module.exports = { add, subtract };

// ✗ silently does nothing
exports = { add, subtract };
//   This only reassigns a local variable inside the module
//   wrapper. The caller still gets the original object, and
//   there is no error to tell you.


// ═══ require is synchronous ════════════════════════════════
console.log("before");
const fs = require("node:fs");     // stops here, loads, continues
console.log("after");
//
// This is why require cannot easily load ESM, and why
// top-level await never worked in CommonJS.`,
      },
      keyTakeaways: [
        "CommonJS exports through the `module.exports` object and loads with `require()`.",
        "`const { add } = require(\"./math\")` is real destructuring, so a wrong name gives `undefined`, not an error.",
        "`module.exports = fn` is CommonJS's rough equivalent of a default export.",
        "CommonJS does not need the file extension. `require(\"./math\")` works.",
        "`require` is <b>synchronous</b>: it stops and loads the file right there.",
        "That synchronous model is why `require` struggles with ESM and why top-level `await` never worked.",
        "`exports.add = add` works, `module.exports = { add }` works, `exports = { add }` silently does nothing.",
        "You will read far more CommonJS than you write. Most of npm and most tutorials still use it.",
      ],
      commonMistakes: [
        "<b>Writing `exports = { add }`</b> — it reassigns a local variable and the caller gets nothing, with no error to explain it.",
        "<b>Mistyping a required name</b> — you get `undefined` and a TypeError much later, somewhere unrelated to the typo.",
        "<b>Mixing `require` and `import` in one file</b> — pick one system per file. Node rejects the mix.",
        "<b>Assuming `require` is cached per call</b> — it caches per resolved path, so requiring the same file twice gives you the same object, side effects included.",
        "<b>Expecting `require` to load an async ES module</b> — it is synchronous. Lesson 6 covers what does and does not work.",
      ],
      quiz: [
        {
          question: "You write `exports = { add }` in a CommonJS module. What does the caller get?",
          options: [
            "`{ add }`, exactly as intended",
            "An empty object, with no error raised",
            "A TypeError at require time",
            "`undefined`",
          ],
          correctIndex: 1,
          explanation:
            "`exports` starts out pointing at `module.exports`, and reassigning it only changes the local variable. The caller still receives the original object. Use `module.exports = { add }` to replace it.",
        },
        {
          question: "Why does a mistyped name behave so differently in the two systems?",
          options: [
            "CommonJS is stricter about names",
            "ESM verifies imports before running, while `require` returns a plain object at runtime",
            "ESM ignores the name entirely",
            "They behave identically",
          ],
          correctIndex: 1,
          explanation:
            "`require` hands back an ordinary object, so a wrong key is just `undefined` and blows up later. ESM checks the export names up front, so the file refuses to start.",
        },
      ],
    },
    {
      id: "which-system",
      title: "Choosing a system — type: module, .mjs, .cjs and extensions",
      durationMinutes: 12,
      explanation:
        "Node has to decide, for every file, whether to treat it as ESM or CommonJS. This lesson is how that decision gets made, and it is the single most practical thing in Day 2.\n\n---\n\n## `\"type\": \"module\"`\n\nYou tell Node through `package.json`:\n\n```javascript\n{\n  \"type\": \"module\"\n}\n```\n\nNow:\n\n```text\n.js\n↓\nESM\n```\n\nand this works normally:\n\n```javascript\nimport { add } from \"./math.js\";\n```\n\n---\n\n## Without it\n\nWith no `\"type\"` field, Node treats `.js` as CommonJS, which is the historical default:\n\n```javascript\nconst fs = require(\"node:fs\");\n```\n\nrather than:\n\n```javascript\nimport fs from \"node:fs\";\n```\n\nThis is the error that catches everyone:\n\n```text\nSyntaxError: Cannot use import statement outside a module\n```\n\nIt almost always means one thing: you wrote `import` in a `.js` file and `package.json` has no `\"type\": \"module\"`.\n\n---\n\n## `.mjs`\n\n<b>`.mjs`</b> (an extension that says \"this file is ESM\", whatever `package.json` says).\n\n```text\napp.mjs\n```\n\n```javascript\nimport fs from \"node:fs\";\n```\n\nNo `\"type\"` field needed.\n\n---\n\n## `.cjs`\n\n<b>`.cjs`</b> (an extension that says \"this file is CommonJS\", whatever `package.json` says).\n\n```text\napp.cjs\n```\n\n```javascript\nconst fs = require(\"node:fs\");\n```\n\nThis works even when `package.json` says `\"type\": \"module\"`.\n\nSo the whole rule:\n\n```text\n.mjs → Always ESM\n.cjs → Always CommonJS\n.js  → Depends on package.json\n```\n\nThe two explicit extensions are your escape hatch. They let one odd file out of a project's default, which is exactly what you need during a migration or for a single config file a tool insists on loading with `require`.\n\n---\n\n## The simple rule\n\nA modern Node project looks like this:\n\n```text\npackage.json\n\n{\n  \"type\": \"module\"\n}\n```\n\n```text\n.js\n↓\nESM\n```\n\nSet it once, write `import` and `export` everywhere, and reach for `.cjs` only when something forces you to.\n\n---\n\n## Why does ESM need file extensions?\n\nThis one confuses everybody.\n\n```text\nsrc/\n├── app.js\n└── utils.js\n```\n\nWrite this:\n\n```javascript\nimport { add } from \"./utils.js\";\n```\n\nNot this:\n\n```javascript\nimport { add } from \"./utils\";\n```\n\nBecause CommonJS guesses, and ESM does not. When `require` sees `\"./utils\"` it tries a list of possibilities:\n\n```text\n./utils\n\nCould mean:\n\n./utils.js\n./utils.json\n./utils/index.js\n...\n```\n\nESM refuses to guess. You name the file:\n\n```javascript\n\"./utils.js\"\n```\n\nThat is a deliberate trade. Guessing means a filesystem check for every candidate on every import, and it means the same specifier can resolve differently depending on what files happen to exist. Being explicit makes resolution predictable and lets tools work out the module graph without touching the disk. It also matches how browsers work, where guessing would mean extra network round trips.\n\nThe rule in practice: relative and absolute ESM imports always carry the extension. Package imports never do.\n\n```javascript\nimport { add } from \"./utils.js\";     // extension required\nimport express from \"express\";        // never an extension\nimport fs from \"node:fs\";             // never an extension\n```",
      diagram: `How Node decides, per file

    file extension?
         │
         ├── .mjs  ──────────────────────────►  ESM
         │
         ├── .cjs  ──────────────────────────►  CommonJS
         │
         └── .js
              │
              └── nearest package.json
                        │
                        ├── "type": "module"  ──►  ESM
                        │
                        └── missing, or
                            "type": "commonjs" ──►  CommonJS


The error you will definitely hit

    SyntaxError: Cannot use import statement outside a module

    means: import in a .js file, and package.json has no
           "type": "module"

    two fixes:
      add "type": "module" to package.json
      or rename the file to .mjs


Why ESM insists on the extension

    CommonJS: require("./utils")
        try ./utils
        try ./utils.js          ← four filesystem checks
        try ./utils.json           for one import
        try ./utils/index.js

    ESM: import "./utils.js"
        open ./utils.js         ← one, and it is exactly
                                   what you wrote

    predictable, analysable without touching disk,
    and it matches how browsers load modules


Extension rules

    "./utils.js"      relative   ✓ extension required
    "../lib/db.js"    relative   ✓ extension required
    "express"         package    ✗ never an extension
    "node:fs"         built-in   ✗ never an extension`,
      codeExample: {
        title: "Every combination that decides ESM or CommonJS",
        code: `// ═══ Project A: modern, ESM by default ══════════════════════
//
// package.json
// {
//   "name": "modern-api",
//   "type": "module"
// }
//
// src/app.js        → ESM        import { add } from "./math.js";
// src/math.js       → ESM        export function add(a, b) {...}
// scripts/old.cjs   → CommonJS   const fs = require("node:fs");
//                                  ← the escape hatch


// ═══ Project B: no "type" field, CommonJS by default ════════
//
// package.json
// {
//   "name": "legacy-api"
// }
//
// app.js            → CommonJS   const { add } = require("./math");
// math.js           → CommonJS   module.exports = { add };
// modern.mjs        → ESM        import fs from "node:fs";
//                                  ← the other escape hatch


// ═══ The error, and the two fixes ═══════════════════════════
//
// app.js:1
// import fs from "node:fs";
// ^^^^^^
// SyntaxError: Cannot use import statement outside a module
//
// fix 1:  add "type": "module" to package.json
// fix 2:  rename app.js → app.mjs


// ═══ Extensions in ESM ══════════════════════════════════════
import { add } from "./math.js";        // ✓ relative, extension
import config from "../config.js";      // ✓ relative, extension
import express from "express";          // ✓ package, no extension
import fs from "node:fs";               // ✓ built-in, no extension

// import { add } from "./math";        // ✗ ERR_MODULE_NOT_FOUND
//   ESM will not try ./math.js for you. Name the file.


// ═══ Same import in CommonJS ═══════════════════════════════
const { add: cjsAdd } = require("./math");     // extension optional
//   require tries ./math, ./math.js, ./math.json,
//   ./math/index.js — four disk checks for one import`,
      },
      keyTakeaways: [
        "`\"type\": \"module\"` in `package.json` makes every `.js` file in the project ESM.",
        "With no `\"type\"` field, `.js` is CommonJS. That is the historical default.",
        "`.mjs` is always ESM and `.cjs` is always CommonJS, whatever `package.json` says.",
        "`.js` is the only extension whose meaning depends on `package.json`.",
        "\"Cannot use import statement outside a module\" means `import` in a `.js` file with no `\"type\": \"module\"`.",
        "ESM requires the file extension on relative imports. CommonJS guesses for you.",
        "Explicit extensions make resolution predictable and analysable without touching the disk.",
        "Package and built-in specifiers never take an extension: `\"express\"`, `\"node:fs\"`.",
        "For a new project: set `\"type\": \"module\"` and use `.cjs` only where something forces you to.",
      ],
      commonMistakes: [
        "<b>Writing `import` in a `.js` file with no `\"type\": \"module\"`</b> — the single most common Node module error. Add the field or rename to `.mjs`.",
        "<b>Dropping the extension in an ESM relative import</b> — `\"./math\"` gives `ERR_MODULE_NOT_FOUND`. ESM does not guess.",
        "<b>Adding an extension to a package import</b> — `import express from \"express.js\"` is wrong. Packages never take one.",
        "<b>Adding `\"type\": \"module\"` to an existing CommonJS project</b> — every `.js` file flips at once. Rename the stragglers to `.cjs` first.",
        "<b>Assuming `.mjs` is only for old Node</b> — it still works and is the clearest way to mark one ESM file in a CommonJS project.",
        "<b>Copying an import path from a TypeScript project</b> — TS often lets you omit extensions. Plain Node ESM does not.",
      ],
      quiz: [
        {
          question: "`package.json` has no `\"type\"` field. What is `app.js` treated as, and what is `app.mjs`?",
          options: [
            "Both ESM",
            "Both CommonJS",
            "`app.js` is CommonJS, `app.mjs` is ESM",
            "`app.js` is ESM, `app.mjs` is CommonJS",
          ],
          correctIndex: 2,
          explanation:
            "`.js` falls back to CommonJS without a `\"type\"` field, while `.mjs` is always ESM regardless. The two explicit extensions ignore `package.json` entirely.",
        },
        {
          question: "Why does ESM require `\"./utils.js\"` rather than accepting `\"./utils\"`?",
          options: [
            "Because ESM cannot read directories",
            "So resolution is predictable and needs no guessing across several candidate files",
            "Because `.js` files load faster than extensionless ones",
            "It is a temporary limitation Node plans to remove",
          ],
          correctIndex: 1,
          explanation:
            "`require` tries `./utils`, `./utils.js`, `./utils.json` and `./utils/index.js` in turn. ESM opens exactly what you named, which makes resolution predictable, analysable without disk access, and consistent with browsers.",
        },
        {
          question: "Your project has `\"type\": \"module\"`, but one config file must be loaded with `require`. What do you do?",
          options: [
            "Remove `\"type\": \"module\"` from the whole project",
            "Name that one file with a `.cjs` extension",
            "Wrap the `require` call in a try/catch",
            "It is not possible in an ESM project",
          ],
          correctIndex: 1,
          explanation:
            "`.cjs` is always CommonJS regardless of `package.json`, so it lets a single file opt out of the project default. `.mjs` does the same in the opposite direction.",
        },
      ],
    },
    {
      id: "esm-globals",
      title: "import.meta — and what happened to __dirname",
      durationMinutes: 8,
      explanation:
        "CommonJS gave you a few magic globals. ESM does not, and replaces them with something better.\n\n---\n\n## `import.meta.url`\n\n<b>`import.meta`</b> (an object holding information about the current ES module).\n\n```javascript\nconsole.log(import.meta.url);\n```\n\n```text\nfile:///Users/rajan/project/app.js\n```\n\nNote it is a <b>URL</b>, not a path. That is deliberate: the same ESM code has to work in a browser, where modules arrive over HTTP. Useful when you need to locate something relative to this file:\n\n```javascript\nconst dataUrl = new URL(\"./data.json\", import.meta.url);\n```\n\n---\n\n## `import.meta.dirname`\n\n<b>`import.meta.dirname`</b> (the directory containing the current ESM file).\n\n```javascript\nconsole.log(import.meta.dirname);\n```\n\n```text\n/Users/rajan/project\n```\n\nThis is the modern replacement for CommonJS's `__dirname`:\n\n```text\nCommonJS\n↓\n__dirname\n\nESM\n↓\nimport.meta.dirname\n```\n\nThere is a matching `import.meta.filename` for the full path of the file itself. Both are plain paths, not URLs, so they drop straight into `path.join`.\n\n---\n\n## What happened to `__dirname`?\n\nIn CommonJS, Node handed you these for free:\n\n```javascript\nconsole.log(__dirname);\nconsole.log(__filename);\n```\n\nESM does not provide them, because they are not part of the language and would mean nothing in a browser. Instead:\n\n```javascript\nconsole.log(import.meta.dirname);\n```\n\nThis is one reason older Node code and modern Node code look different. If you search for this problem you will find the old workaround everywhere:\n\n```javascript\nimport { fileURLToPath } from \"node:url\";\nimport { dirname } from \"node:path\";\n\nconst __dirname = dirname(fileURLToPath(import.meta.url));\n```\n\nThat was the only option before `import.meta.dirname` existed. On a current Node you do not need it, and seeing it is a good sign the code or the tutorial predates Node 20.11.\n\n---\n\n## Why relative paths need this at all\n\nA subtle trap that costs people an afternoon. This looks relative to your file, but is not:\n\n```javascript\nimport { readFileSync } from \"node:fs\";\n\nconst data = readFileSync(\"./data.json\", \"utf8\");\n```\n\nFilesystem calls resolve against the <b>current working directory</b>, meaning wherever the terminal was when you typed `node`. Run the script from a different folder and it breaks. `import` paths resolve against the file, but `fs` paths do not.\n\nThe fix is to build the path from the module's own location:\n\n```javascript\nimport { join } from \"node:path\";\n\nconst data = readFileSync(join(import.meta.dirname, \"data.json\"), \"utf8\");\n```\n\nThat works no matter where the process was started from.\n\n---\n\n## The other globals\n\nAlso absent in ESM: `require`, `module`, `exports` and `__filename`. Everything else you know is still there, because it belongs to the runtime rather than the module system:\n\n```text\nprocess      ✓ available\nconsole      ✓ available\nglobalThis   ✓ available\nBuffer       ✓ available\nsetTimeout   ✓ available\n\nrequire      ✗ ESM uses import\nmodule       ✗ ESM uses export\nexports      ✗ ESM uses export\n__dirname    ✗ use import.meta.dirname\n__filename   ✗ use import.meta.filename\n```",
      diagram: `CommonJS globals and their ESM replacements

    CommonJS                    ESM
    ─────────────────────────────────────────────────────
    __dirname          ──►      import.meta.dirname
    __filename         ──►      import.meta.filename
    (no equivalent)    ──►      import.meta.url
    require            ──►      import
    module.exports     ──►      export

    process, console, Buffer, setTimeout, globalThis
    are unchanged: they belong to the runtime, not
    to the module system.


import.meta.url is a URL, on purpose

    import.meta.url        file:///Users/rajan/app.js
    import.meta.dirname    /Users/rajan
    import.meta.filename   /Users/rajan/app.js
        │                       │
      a URL                 plain paths, ready
      works in a browser    for path.join


The trap: two kinds of "relative"

    import "./data.js"                relative to THIS FILE
    readFileSync("./data.json")       relative to the CWD
                                      (wherever you ran node)

    cd project && node src/app.js     → looks in project/
    cd project/src && node app.js     → looks in project/src/
                                        same code, different file

    fix:
    readFileSync(join(import.meta.dirname, "data.json"))
                      └─ anchored to the file, not the terminal`,
      codeExample: {
        title: "import.meta, and the path trap it solves",
        code: `import { readFileSync } from "node:fs";
import { join } from "node:path";

// ── What import.meta gives you ──────────────────────────────
console.log(import.meta.url);        // file:///Users/rajan/project/app.js
console.log(import.meta.dirname);    // /Users/rajan/project
console.log(import.meta.filename);   // /Users/rajan/project/app.js

// url is a URL because ESM also runs in browsers;
// dirname and filename are plain paths, ready for path.join


// ── The trap ────────────────────────────────────────────────
// const data = readFileSync("./data.json", "utf8");
//
// "./data.json" resolves against the CURRENT WORKING DIRECTORY,
// not against this file. So:
//
//   cd project      && node src/app.js   → project/data.json
//   cd project/src  && node app.js       → project/src/data.json
//
// Same code, two different files, and one of them does not exist.


// ── The fix ─────────────────────────────────────────────────
const data = readFileSync(join(import.meta.dirname, "data.json"), "utf8");
console.log(JSON.parse(data));
// anchored to the module, so it works from anywhere

// the URL form does the same job
const dataUrl = new URL("./data.json", import.meta.url);
console.log(readFileSync(dataUrl, "utf8"));


// ── The old workaround you will still see ───────────────────
// import { fileURLToPath } from "node:url";
// import { dirname } from "node:path";
// const __dirname = dirname(fileURLToPath(import.meta.url));
//
// Needed before Node 20.11. Seeing it today means the code
// predates import.meta.dirname.


// ── What is gone, and what is not ───────────────────────────
console.log(typeof process);         // "object"     still here
console.log(typeof console);         // "object"     still here
console.log(typeof globalThis);      // "object"     still here
// console.log(__dirname);           // ReferenceError
// console.log(require);             // ReferenceError`,
      },
      keyTakeaways: [
        "`import.meta` holds information about the current ES module.",
        "`import.meta.url` is a <b>URL</b>, because ESM also has to work in browsers.",
        "`import.meta.dirname` and `import.meta.filename` are plain paths, ready for `path.join`.",
        "`__dirname` and `__filename` do not exist in ESM. Use the `import.meta` versions.",
        "`require`, `module` and `exports` are also absent in ESM.",
        "`process`, `console`, `Buffer` and `setTimeout` are unaffected. They belong to the runtime, not the module system.",
        "`import` paths resolve against the file. `fs` paths resolve against the <b>current working directory</b>.",
        "Anchor file reads with `join(import.meta.dirname, \"data.json\")` so they work from any folder.",
        "The `fileURLToPath(import.meta.url)` dance was the pre-Node-20.11 workaround. You no longer need it.",
      ],
      commonMistakes: [
        "<b>Reaching for `__dirname` in an ESM file</b> — a ReferenceError. `import.meta.dirname` is the replacement.",
        "<b>Passing a bare `\"./data.json\"` to `fs`</b> — it resolves against the terminal's directory, so the script breaks when run from elsewhere.",
        "<b>Treating `import.meta.url` as a path</b> — it starts with `file://`. Use `import.meta.dirname`, or convert with `fileURLToPath`.",
        "<b>Copying the `fileURLToPath` workaround into new code</b> — it was only needed before `import.meta.dirname` existed.",
        "<b>Assuming `process` is gone too</b> — only the module-system globals disappear. The runtime ones stay.",
      ],
      quiz: [
        {
          question: "What is the ESM replacement for `__dirname`?",
          options: ["`import.meta.url`", "`import.meta.dirname`", "`process.cwd()`", "`module.path`"],
          correctIndex: 1,
          explanation:
            "`import.meta.dirname` gives the directory of the current file as a plain path. `import.meta.url` is a `file://` URL, and `process.cwd()` is where the terminal was, which is a different thing entirely.",
        },
        {
          question: "`readFileSync(\"./data.json\")` works when you run `node app.js` from the project root but fails from elsewhere. Why?",
          options: [
            "The file is missing an extension",
            "`fs` paths resolve against the current working directory, not the module's location",
            "ESM cannot read JSON files",
            "`readFileSync` needs an absolute path always",
          ],
          correctIndex: 1,
          explanation:
            "`import` resolves relative to the file, but filesystem calls resolve relative to wherever the process was started. Anchor it with `join(import.meta.dirname, \"data.json\")`.",
        },
        {
          question: "Which of these still works in an ESM file?",
          options: ["`__filename`", "`require()`", "`process.env`", "`module.exports`"],
          correctIndex: 2,
          explanation:
            "`process` belongs to the runtime, so it is unaffected. `__filename`, `require` and `module.exports` are CommonJS module-system features and are not available in ESM.",
        },
      ],
    },
    {
      id: "interop-and-dynamic",
      title: "Interop, dynamic import and top-level await",
      durationMinutes: 12,
      explanation:
        "Now the part that actually explains the two systems, rather than just describing them. Every difference below comes from one fact: <b>ESM loads asynchronously, CommonJS loads synchronously</b>.\n\n---\n\n## `require(esm)`\n\nHistorically this was the hard direction:\n\n```text\nCommonJS\n   ↓\nrequire()\n   ↓\nESM\n```\n\nModern Node has improved it a lot. CommonJS can now do:\n\n```javascript\nrequire(\"./module.mjs\");\n```\n\nfor compatible ES modules:\n\n```javascript\n// app.cjs\n\nconst math = require(\"./math.mjs\");\n\nconsole.log(math.add(10, 20));\n```\n\nUseful when you are migrating an old CommonJS application to ESM a file at a time.\n\nThe word doing the work is <b>compatible</b>. `require` is synchronous, so it can only load an ES module that finishes loading synchronously. A module using top-level `await`, anywhere in its graph, cannot be `require`d and throws instead. That is the whole historical difficulty in one sentence: you cannot wait for an asynchronous thing from inside a synchronous call.\n\nThe other direction was always easy:\n\n```javascript\n// ESM importing CommonJS: this has always worked\nimport math from \"./math.cjs\";\n```\n\nBecause `import` is asynchronous, it has no trouble accommodating something synchronous. Note it arrives as the <b>default</b> import: `module.exports` becomes the default export. Node can often detect named exports too, but the default import is the form that always works.\n\n### But do not overread it\n\nThis does not mean:\n\n> \"ESM and CommonJS are now the same.\"\n\nThey are not. Differences remain in:\n\n• Loading behaviour\n• Module evaluation\n• Interoperability\n• Default exports\n• Cyclic dependencies\n• Asynchronous loading\n\nFor a new application, pick one system and stay consistent.\n\n---\n\n## Dynamic `import()`\n\nNormally imports sit at the top of the file:\n\n```javascript\nimport { add } from \"./math.js\";\n```\n\n<b>Dynamic `import()`</b> (function-like syntax that loads a module asynchronously at runtime).\n\n```javascript\nconst math = await import(\"./math.js\");\n\nconsole.log(math.add(10, 20));\n```\n\nThe difference is <b>when</b>. A static `import` is hoisted and resolved before your file runs. A dynamic `import()` happens at the moment execution reaches it, returns a Promise, and can take a computed path.\n\n---\n\n## Why use it?\n\n```text\napp\n├── normal code\n└── expensive-feature\n```\n\nLoad the expensive part only if it is needed:\n\n```javascript\nif (userWantsFeature) {\n  const feature = await import(\"./expensive-feature.js\");\n\n  feature.run();\n}\n```\n\nGood for optional functionality, plugins, large modules, conditional loading and lazy loading. Two more things static `import` cannot do at all: a path built at runtime, such as `await import(`./commands/${name}.js`)`, and this is also how a CommonJS file loads an ES module that uses top-level `await`, since `import()` returns a Promise rather than blocking.\n\n---\n\n## Top-level `await`\n\nNormally `await` has to sit inside an `async` function. ESM lifts that restriction.\n\n<b>Top-level await</b> (using `await` directly at the top level of an ES module).\n\n```javascript\nconst response = await fetch(\"https://example.com\");\n\nconst data = await response.text();\n\nconsole.log(data);\n```\n\nNo wrapper function. This works in ESM.\n\n---\n\n## Not in CommonJS\n\nThis does not work in a normal CommonJS file:\n\n```javascript\nconst data = await fetchSomething();\n```\n\nYou write the wrapper instead:\n\n```javascript\nasync function main() {\n  const data = await fetchSomething();\n\n  console.log(data);\n}\n\nmain();\n```\n\n```text\nESM\n↓\nTop-level await ✅\n\nCommonJS\n↓\nTop-level await ❌\n```\n\nAnd the reason is the same one as before: `require` must return a finished value immediately, so nothing in CommonJS is allowed to pause.\n\nOne caution about top-level `await`. It delays every module that imports yours, because they cannot finish loading until it resolves. Fine for reading a config file at startup. Not fine for a slow network call in a module that half your application imports.",
      diagram: `Everything follows from one fact

    ESM        loads asynchronously   ──►  can pause and wait
    CommonJS   loads synchronously    ──►  must finish now

    that single difference explains:

      import CJS from ESM     easy      async accommodating sync
      require ESM from CJS    limited   sync cannot wait for async
      top-level await in ESM  works     pausing is allowed
      top-level await in CJS  never     require must return now


The two directions

    ESM  ──── import math from "./math.cjs" ────►  CommonJS
                    always worked
                    module.exports arrives as the default import

    CJS  ──── require("./math.mjs") ────────────►  ESM
                    modern Node, but only if that module
                    (and its whole graph) has no top-level await

    CJS  ──── await import("./math.mjs") ───────►  ESM
                    always works, returns a Promise


Static vs dynamic import

    import { add } from "./math.js"
      resolved BEFORE your file runs
      path must be a literal
      always loaded

    const m = await import("./math.js")
      resolved WHEN execution reaches it
      path can be computed at runtime
      loaded only if that line runs

    if (needed) {
      const feature = await import("./heavy.js")   ← never loaded
      feature.run()                                  when not needed
    }`,
      codeExample: {
        title: "Interop in both directions, and loading on demand",
        code: `// ═══ ESM → CommonJS: always worked ══════════════════════════
//
// math.cjs
//   module.exports = { add: (a, b) => a + b };
//
// app.mjs
import math from "./math.cjs";          // module.exports → default
console.log(math.add(10, 20));          // 30
//
// import is async, so accommodating something sync is easy.


// ═══ CommonJS → ESM: modern, and conditional ════════════════
//
// math.mjs
//   export const add = (a, b) => a + b;
//
// app.cjs
const mathEsm = require("./math.mjs");  // works on modern Node
console.log(mathEsm.add(10, 20));       // 30
//
// BUT if math.mjs contains top-level await anywhere in its
// graph, this throws. require must return now, and it cannot
// wait for something asynchronous.
//
// The escape hatch works in every case:
// (async () => {
//   const m = await import("./math.mjs");   // returns a Promise
//   console.log(m.add(10, 20));
// })();


// ═══ Dynamic import: load only when needed ══════════════════
const userWantsFeature = process.argv.includes("--report");

if (userWantsFeature) {
  const feature = await import("./expensive-feature.js");
  feature.run();
}
// Not requested? The file is never read, parsed or evaluated.


// ═══ Dynamic import: a path decided at runtime ══════════════
const commandName = process.argv[2] ?? "help";

const command = await import(\`./commands/\${commandName}.js\`);
await command.run();
//
// Static import cannot do this. The path must be a literal.


// ═══ Top-level await: ESM only ══════════════════════════════
// app.mjs — no wrapper function needed
const response = await fetch("https://example.com");
const body = await response.text();
console.log(body.length);


// ═══ The CommonJS equivalent ════════════════════════════════
// app.cjs
// const data = await fetchSomething();     // SyntaxError
//
// async function main() {
//   const data = await fetchSomething();
//   console.log(data);
// }
// main();
//
// Note main() is not awaited, so errors inside it need
// their own catch. That is the ergonomic cost.`,
      },
      keyTakeaways: [
        "Every ESM/CommonJS difference traces back to one fact: <b>ESM loads asynchronously, CommonJS synchronously</b>.",
        "`import` from ESM into CommonJS has always worked. `module.exports` arrives as the <b>default</b> export.",
        "Modern Node lets CommonJS `require()` an ES module, but only if nothing in its graph uses top-level `await`.",
        "`await import(...)` from CommonJS always works, because it returns a Promise instead of blocking.",
        "Interop improving does not make the systems equivalent. Pick one per project and stay consistent.",
        "<b>Dynamic `import()`</b> loads at runtime, returns a Promise, and accepts a computed path.",
        "Use it for optional features, plugins, large modules and paths decided at runtime.",
        "<b>Top-level `await`</b> works in ESM and never in CommonJS, for the same synchronous-loading reason.",
        "Top-level `await` delays every module that imports yours. Fine for startup config, risky for slow network calls.",
      ],
      commonMistakes: [
        "<b>Expecting `require(\"./thing.mjs\")` to always work</b> — top-level `await` anywhere in that module's graph makes it throw. Use `await import()` instead.",
        "<b>Reaching for named imports from a CommonJS module</b> — the default import always works. Named detection is best-effort.",
        "<b>Using `await` at the top level of a `.cjs` file</b> — a syntax error. Wrap it in an `async function main()`.",
        "<b>Calling `main()` without catching</b> — an unawaited async call leaves rejections unhandled. Add `.catch()`.",
        "<b>Putting a slow network call in a top-level `await`</b> — every importer waits for it before it can finish loading.",
        "<b>Using dynamic `import()` everywhere</b> — static imports are analysable and clearer. Reach for dynamic when the loading is genuinely conditional.",
        "<b>Reading \"require(esm) now works\" as \"the systems are the same\"</b> — loading, evaluation, defaults and cycles all still differ.",
      ],
      quiz: [
        {
          question: "Why was `require()`-ing an ES module historically so difficult?",
          options: [
            "ESM files use a different syntax",
            "`require` is synchronous and must return now, while ESM loading is asynchronous",
            "ESM modules are always larger",
            "`require` cannot read `.mjs` files",
          ],
          correctIndex: 1,
          explanation:
            "A synchronous call cannot wait for an asynchronous load. That is why modern `require(esm)` still refuses any module whose graph contains top-level `await`, and why `await import()` works in every case.",
        },
        {
          question: "Which of these can a static `import` not do?",
          options: [
            "Import a default export",
            "Import from a CommonJS file",
            "Load a module from a path built at runtime",
            "Import several named exports at once",
          ],
          correctIndex: 2,
          explanation:
            "Static import paths must be literals, because they are resolved before your code runs. A computed path such as `./commands/${name}.js` needs dynamic `import()`.",
        },
        {
          question: "What is the cost of using top-level `await` for a slow network call in a widely imported module?",
          options: [
            "None, it only affects that file",
            "Every module importing it waits for the call before it can finish loading",
            "Node falls back to CommonJS",
            "The call runs twice",
          ],
          correctIndex: 1,
          explanation:
            "Top-level `await` pauses the whole module's evaluation, and importers cannot complete until it resolves. Fine for reading startup config, risky for a slow request in a shared module.",
        },
      ],
    },
    {
      id: "builtins-and-resolution",
      title: "Built-in modules, the node: prefix and module resolution",
      durationMinutes: 10,
      explanation:
        "How Node works out what an import string actually refers to.\n\n---\n\n## Built-in modules\n\nNode ships a lot without any install:\n\n```javascript\nimport fs from \"node:fs\";\n```\n\nThe `node:` prefix says explicitly that this is a Node built-in.\n\n```javascript\nimport fs from \"node:fs\";\nimport path from \"node:path\";\nimport http from \"node:http\";\nimport crypto from \"node:crypto\";\nimport util from \"node:util\";\n```\n\n---\n\n## Always use the `node:` prefix\n\nPrefer:\n\n```javascript\nimport fs from \"node:fs\";\n```\n\nover:\n\n```javascript\nimport fs from \"fs\";\n```\n\nAnd:\n\n```javascript\nconst fs = require(\"node:fs\");\n```\n\nover:\n\n```javascript\nconst fs = require(\"fs\");\n```\n\nBecause it removes all doubt:\n\n```text\nnode:fs\n   ↓\nNode.js built-in module\n```\n\nrather than something installed from npm.\n\nThere is a security angle too. Without the prefix, an import of `\"fs\"` is ambiguous, and packages exist on npm with names that shadow built-ins. `node:fs` can only ever mean the built-in, and it skips the `node_modules` lookup entirely. Some newer built-ins, like `node:test`, are <b>only</b> available with the prefix.\n\nThis course uses:\n\n```text\nnode:fs\nnode:path\nnode:http\nnode:util\nnode:crypto\n```\n\n---\n\n## Module resolution\n\n<b>Module resolution</b> (how Node decides which file or package an import refers to).\n\nWhen you write:\n\n```javascript\nimport something from \"...\";\n```\n\nNode has to work out what the string means. Three cases matter.\n\n---\n\n## Relative specifier\n\nA <b>relative specifier</b> (an import path starting with `./` or `../`).\n\n```javascript\nimport { add } from \"./math.js\";\n```\n\n```text\nCurrent directory\n      ↓\nmath.js\n```\n\n```javascript\nimport config from \"../config.js\";\n```\n\n```text\nGo up one directory\n        ↓\nconfig.js\n```\n\nThese always point at a real file, and in ESM they always carry the extension.\n\n---\n\n## Bare specifier\n\nA <b>bare specifier</b> (an import that does not start with `./`, `../` or `/`).\n\n```javascript\nimport express from \"express\";\n```\n\nNode reads `express` as a package name and looks it up through its resolution rules, which normally means:\n\n```text\nnode_modules/\n```\n\n---\n\n## The `node_modules` lookup\n\n```text\nproject/\n├── package.json\n├── node_modules/\n│   └── express/\n└── src/\n    └── server.js\n```\n\n```javascript\nimport express from \"express\";\n```\n\n```text\nserver.js\n   ↓\nFind \"express\"\n   ↓\nnode_modules/express\n   ↓\nLoad package\n```\n\nThe part worth knowing: the search <b>walks up the directory tree</b>. From `src/server.js` Node checks `src/node_modules`, then `project/node_modules`, then the parent's, all the way to the filesystem root. That is why a dependency installed at the top of a monorepo is visible from a package nested deep inside it.\n\nOnce it finds the folder, `package.json` decides which file loads. `exports` if present, otherwise `main`. That is the subject of the next lesson.\n\nAnd note the contrast:\n\n```javascript\nimport { add } from \"./math.js\";     // a file, right here\nimport express from \"express\";       // a package, found by searching\nimport fs from \"node:fs\";            // a built-in, no search at all\n```\n\nThree different kinds of lookup, and you can tell which is which from the first character of the string.",
      diagram: `Read the first characters, know the lookup

    "./math.js"    ──►  relative     a file next to this one
    "../config.js" ──►  relative     a file one level up
    "/opt/app.js"  ──►  absolute     a file at that exact path
    "express"      ──►  bare         a package in node_modules
    "node:fs"      ──►  built-in     shipped with Node, no search
    "#utils"       ──►  subpath      your own alias (next lesson)


The node_modules search walks upward

    /Users/rajan/project/src/server.js
        import express from "express"
              │
              ├── /Users/rajan/project/src/node_modules/express ?
              ├── /Users/rajan/project/node_modules/express     ✓ found
              ├── /Users/rajan/node_modules/express
              ├── /Users/node_modules/express
              └── /node_modules/express

    This is why a dependency hoisted to the root of a
    monorepo is visible from a deeply nested package.


Then package.json picks the file

    node_modules/express/
    ├── package.json     "exports" if present, else "main"
    ├── index.js         ←  what actually loads
    └── lib/


Why the node: prefix

    "fs"        could be the built-in, or a package
                named fs that someone published
    "node:fs"   can only be the built-in, and skips
                the node_modules search entirely

    Some newer built-ins (node:test) require the prefix.`,
      codeExample: {
        title: "The three kinds of specifier",
        code: `// ═══ Built-in modules: always use the node: prefix ══════════
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import crypto from "node:crypto";
import util from "node:util";

// CommonJS form, same rule
// const fs = require("node:fs");

// Why the prefix:
//   "fs"       ambiguous, and npm has lookalike packages
//   "node:fs"  can only be the built-in, skips node_modules
//   "node:test" newer built-ins REQUIRE the prefix


// ═══ Relative: a specific file, extension included ══════════
import { add } from "./math.js";           // next to this file
import config from "../config.js";         // one level up
import { log } from "./utils/logger.js";   // in a subfolder

// import { add } from "./math";            // ✗ ERR_MODULE_NOT_FOUND


// ═══ Bare: a package, found by searching upward ═════════════
import express from "express";
import { z } from "zod";

// from  /project/src/server.js  Node checks, in order:
//   /project/src/node_modules/express
//   /project/node_modules/express        ← found
//   /node_modules/express
//
// then express/package.json decides which file loads:
//   "exports" if present, otherwise "main"


// ═══ A package's own subpath ════════════════════════════════
import { pipeline } from "node:stream/promises";
import { render } from "some-lib/server";
// the package's "exports" field decides whether the
// subpath is allowed at all — next lesson


// ═══ Tell them apart from the first character ═══════════════
// "./"     "../"    →  relative, a file
// "/"               →  absolute, a file
// "node:"           →  built-in, no lookup
// "#"               →  your own internal alias
// anything else     →  a package name`,
      },
      keyTakeaways: [
        "Node's built-in modules need no install. `node:fs`, `node:path`, `node:http`, `node:crypto`, `node:util`.",
        "Always write the `node:` prefix. It removes ambiguity and skips the `node_modules` lookup.",
        "Some newer built-ins, such as `node:test`, only work <b>with</b> the prefix.",
        "A <b>relative specifier</b> starts with `./` or `../` and names a file. In ESM it carries the extension.",
        "A <b>bare specifier</b> is a package name, resolved through `node_modules`.",
        "The `node_modules` search <b>walks up</b> the directory tree to the filesystem root.",
        "That upward walk is why a dependency at a monorepo's root is visible from a nested package.",
        "Once found, the package's `exports` field, or `main` as a fallback, decides which file loads.",
        "The first characters of the string tell you which kind of lookup you are getting.",
      ],
      commonMistakes: [
        "<b>Writing `import fs from \"fs\"`</b> — it works, but it is ambiguous, slower to resolve, and npm has lookalike package names.",
        "<b>Trying `require(\"test\")` for the test runner</b> — `node:test` is prefix-only. Without it you get a module-not-found error.",
        "<b>Adding an extension to a bare specifier</b> — `import express from \"express.js\"` is wrong.",
        "<b>Assuming a package resolves from the current working directory</b> — it resolves relative to the importing <b>file</b>, walking up from there.",
        "<b>Reaching into a package's internals</b> — `import x from \"some-lib/src/internal.js\"` may be blocked by its `exports` field, and can break on any release.",
        "<b>Committing `node_modules`</b> — it is rebuilt from `package.json` and the lockfile. Keep it in `.gitignore`.",
      ],
      quiz: [
        {
          question: "Why prefer `import fs from \"node:fs\"` over `import fs from \"fs\"`?",
          options: [
            "`\"fs\"` no longer works in modern Node",
            "The prefix is unambiguous, skips the `node_modules` lookup, and is required by some newer built-ins",
            "The prefix enables ESM syntax",
            "It makes the module load lazily",
          ],
          correctIndex: 1,
          explanation:
            "`node:fs` can only be the built-in, so there is no ambiguity with an npm package of the same name and no directory search. Newer built-ins like `node:test` accept only the prefixed form.",
        },
        {
          question: "You `import express from \"express\"` in `/project/src/server.js`. Where does Node look?",
          options: [
            "Only `/project/node_modules`",
            "Only in the current working directory",
            "`/project/src/node_modules`, then `/project/node_modules`, then upward to the filesystem root",
            "In a global Node installation folder",
          ],
          correctIndex: 2,
          explanation:
            "The search starts beside the importing file and walks up the directory tree. That upward walk is what lets a dependency hoisted to a monorepo root serve a deeply nested package.",
        },
        {
          question: "Which specifier does NOT trigger a filesystem lookup?",
          options: ["`\"./math.js\"`", "`\"express\"`", "`\"node:fs\"`", "`\"../config.js\"`"],
          correctIndex: 2,
          explanation:
            "A `node:` specifier is resolved internally as a built-in, with no directory search at all. Relative paths open a file, and bare specifiers walk the tree looking for a package.",
        },
      ],
    },
    {
      id: "subpath-and-exports",
      title: "Subpath imports with # and the exports field",
      durationMinutes: 10,
      explanation:
        "Two `package.json` fields that look similar and do opposite things.\n\n---\n\n## Subpath imports with `#`\n\n<b>Subpath imports</b> (custom internal import aliases beginning with `#`).\n\n```text\nproject/\n├── package.json\n└── src/\n    ├── app.js\n    └── utils/\n        └── logger.js\n```\n\nIn `package.json`:\n\n```javascript\n{\n  \"type\": \"module\",\n  \"imports\": {\n    \"#utils/*\": \"./src/utils/*.js\"\n  }\n}\n```\n\nNow you can write:\n\n```javascript\nimport { log } from \"#utils/logger\";\n```\n\ninstead of:\n\n```javascript\nimport { log } from \"./utils/logger.js\";\n```\n\n---\n\n## Why bother?\n\nAs a project grows, relative paths get ugly:\n\n```javascript\nimport something from \"../../../utils/something.js\";\n```\n\nThat is miserable to maintain, and it breaks the moment you move the file. An alias gives you:\n\n```javascript\nimport something from \"#utils/something\";\n```\n\nwhich reads the same from anywhere in the project.\n\nThe `#` matters: it is how Node tells your internal aliases apart from real package names. Without it, `utils` would be looked up in `node_modules`.\n\nTwo practical notes. This is a Node feature, not a bundler config, so it needs no build step and no path plugin. And it only works <b>inside</b> your own package. Nobody importing your package can use your `#` aliases, which is exactly the point.\n\n---\n\n## The `imports` field\n\n```javascript\n{\n  \"type\": \"module\",\n  \"imports\": {\n    \"#utils/*\": \"./src/utils/*.js\",\n    \"#config\": \"./src/config.js\"\n  }\n}\n```\n\n```javascript\nimport config from \"#config\";\n```\n\nresolves to:\n\n```text\nsrc/config.js\n```\n\n```text\npackage.json\n     │\n     ↓\n \"imports\"\n     │\n     ↓\n#config → ./src/config.js\n```\n\nNote the `*` in the pattern is a wildcard, and it appears on both sides. `\"#utils/*\": \"./src/utils/*.js\"` maps `#utils/logger` to `./src/utils/logger.js`, one entry covering the whole folder.\n\n---\n\n## The `exports` field\n\n<b>`exports`</b> (a `package.json` field defining a package's public entry points).\n\nSuppose you publish:\n\n```text\nmy-package/\n├── package.json\n├── src/\n│   ├── index.js\n│   ├── database.js\n│   └── internal.js\n```\n\n```javascript\n{\n  \"type\": \"module\",\n  \"exports\": {\n    \".\": \"./src/index.js\"\n  }\n}\n```\n\nConsumers can now do:\n\n```javascript\nimport something from \"my-package\";\n```\n\nbut they are not meant to reach inside:\n\n```javascript\nimport something from \"my-package/src/internal.js\";\n```\n\nThat second line does not merely break convention, it fails outright. `exports` is <b>enforced</b>: anything not listed is unreachable from outside the package. That is what makes it useful. Before `exports` existed, every file in a published package was public whether you liked it or not, and users would import internals that you then could not change without breaking them.\n\nYou can list more than one entry point:\n\n```javascript\n{\n  \"exports\": {\n    \".\": \"./src/index.js\",\n    \"./database\": \"./src/database.js\"\n  }\n}\n```\n\nNow `import db from \"my-package/database\"` works, and `internal.js` still does not.\n\n---\n\n## `imports` vs `exports`\n\n```text\nimports\n   ↓\nYour package → your internal modules\n\nexports\n   ↓\nOther packages → your public modules\n```\n\n```text\nYour application\n       │\n       ├── #utils\n       ├── #config\n       └── #database\n\n       imports\n          ↓\n  Internal structure\n```\n\nversus:\n\n```text\nAnother application\n       │\n       ↓\n   my-package\n       │\n       ↓\n    exports\n       │\n       ↓\n   Public API\n```\n\nOne sentence each. `imports` is for <b>you</b>, pointing inward, and never visible outside. `exports` is for <b>everyone else</b>, pointing outward, and it hides everything you did not list.\n\nBuilding an application? You want `imports`. Publishing a library? You want both.",
      diagram: `Two fields, opposite directions

                    your package
                    ┌──────────────────────────┐
    other code      │                          │
    ───────────────►│  exports                 │
    "my-package"    │  what outsiders may      │
                    │  reach: the public API   │
                    │                          │
                    │  ┌────────────────────┐  │
                    │  │  imports           │  │
                    │  │  #utils  #config   │  │
                    │  │  your own aliases, │  │
                    │  │  never visible     │  │
                    │  │  outside           │  │
                    │  └────────────────────┘  │
                    └──────────────────────────┘

    imports  →  inward, for you
    exports  →  outward, for everyone else


The problem # solves

    src/features/reports/monthly/index.js
      import x from "../../../utils/format.js"
                     └─ counting dots, breaks when
                        you move the file

      import x from "#utils/format"
                     └─ same everywhere, survives moves

    No bundler, no build step. Node does this itself.


exports is enforced, not advisory

    {
      "exports": {
        ".":          "./src/index.js",
        "./database": "./src/database.js"
      }
    }

    import x from "my-package"                    ✓
    import x from "my-package/database"           ✓
    import x from "my-package/src/internal.js"    ✗ blocked

    Before exports existed, every file was public,
    and users imported internals you could then
    never change.`,
      codeExample: {
        title: "imports for yourself, exports for everyone else",
        code: `// ═══ An application: use "imports" ══════════════════════════
//
// package.json
// {
//   "name": "my-api",
//   "type": "module",
//   "imports": {
//     "#utils/*":  "./src/utils/*.js",     ← wildcard, both sides
//     "#config":   "./src/config.js",
//     "#db":       "./src/database.js"
//   }
// }

// src/features/reports/monthly/index.js
import { format } from "#utils/format";     // → src/utils/format.js
import config from "#config";               // → src/config.js
import db from "#db";                       // → src/database.js

// instead of:
// import { format } from "../../../utils/format.js";
//   ← counting dots, and it breaks the moment you move this file


// ═══ A published library: use "exports" ═════════════════════
//
// my-package/
// ├── package.json
// └── src/
//     ├── index.js        public
//     ├── database.js     public, on request
//     └── internal.js     private
//
// package.json
// {
//   "name": "my-package",
//   "type": "module",
//   "exports": {
//     ".":          "./src/index.js",
//     "./database": "./src/database.js"
//   }
// }

// ── What a consumer can do ─────────────────────────────────
// import something from "my-package";            ✓ → src/index.js
// import db from "my-package/database";          ✓ → src/database.js
// import x from "my-package/src/internal.js";    ✗ ERR_PACKAGE_PATH_NOT_EXPORTED
//
// Not a convention. Node refuses to resolve it, which is
// what lets you refactor internal.js freely.


// ═══ The distinction in one line each ═══════════════════════
// imports  →  inward, for your own code, invisible outside
// exports  →  outward, for consumers, hides everything unlisted
//
// application  →  you want imports
// library      →  you want both`,
      },
      keyTakeaways: [
        "<b>Subpath imports</b> are internal aliases starting with `#`, declared in `package.json`'s `imports` field.",
        "The `#` is how Node distinguishes your aliases from real package names.",
        "`\"#utils/*\": \"./src/utils/*.js\"` uses a wildcard on both sides, so one entry covers a whole folder.",
        "They replace `\"../../../utils/x.js\"` with `\"#utils/x\"`, which survives moving the file.",
        "This is a Node feature, not a bundler config. No build step, no path plugin.",
        "`imports` only works <b>inside</b> your own package. Consumers cannot use your aliases.",
        "<b>`exports`</b> defines a package's public entry points, and it is <b>enforced</b>: unlisted paths fail to resolve.",
        "Before `exports`, every file in a published package was public, so users imported internals you could never change.",
        "`imports` points inward for you. `exports` points outward for everyone else. Applications want the first, libraries want both.",
      ],
      commonMistakes: [
        "<b>Leaving the `#` off an alias</b> — `import x from \"utils\"` is a bare specifier and gets looked up in `node_modules`.",
        "<b>Expecting consumers to use your `#` aliases</b> — they are private to your package by design.",
        "<b>Mismatching the wildcard</b> — the `*` must appear on both sides of the mapping, and the target usually needs the `.js`.",
        "<b>Deep-importing another package's files</b> — `some-lib/src/internal.js` is likely blocked by its `exports`, and unsafe even when it is not.",
        "<b>Adding `exports` to a published package without listing existing entry points</b> — every path you leave out becomes an instant breaking change.",
        "<b>Confusing the two fields</b> — `imports` is inward and private, `exports` is outward and public. The names read backwards until you fix the direction in your head.",
      ],
      quiz: [
        {
          question: "What is the difference between `imports` and `exports` in `package.json`?",
          options: [
            "`imports` is for ESM, `exports` is for CommonJS",
            "`imports` defines private aliases for your own code, `exports` defines what outsiders may import",
            "They are aliases for the same thing",
            "`imports` lists dependencies, `exports` lists entry points",
          ],
          correctIndex: 1,
          explanation:
            "`imports` points inward: `#`-prefixed aliases usable only inside your own package. `exports` points outward, naming the public entry points and blocking everything else.",
        },
        {
          question: "A package declares `\"exports\": { \".\": \"./src/index.js\" }`. What happens on `import x from \"my-package/src/internal.js\"`?",
          options: [
            "It works, but is bad practice",
            "It works only in CommonJS",
            "It fails to resolve, because the path is not exported",
            "It resolves to `./src/index.js` instead",
          ],
          correctIndex: 2,
          explanation:
            "`exports` is enforced by Node, not advisory. Anything unlisted gives `ERR_PACKAGE_PATH_NOT_EXPORTED`, which is what lets the author change internal files freely.",
        },
        {
          question: "Why do subpath aliases have to start with `#`?",
          options: [
            "To mark them as private in your editor",
            "So Node can tell an internal alias from a package name",
            "Because `#` is required by the ESM specification",
            "To make them load faster",
          ],
          correctIndex: 1,
          explanation:
            "Without the `#`, `\"utils\"` would be an ordinary bare specifier and Node would go looking for it in `node_modules`. The prefix marks it as an internal alias instead.",
        },
      ],
    },
    {
      id: "circular-deps",
      title: "Circular dependencies and the module mental model",
      durationMinutes: 8,
      explanation:
        "One failure mode worth recognising before it costs you an afternoon, and then the whole day in one picture.\n\n---\n\n## Circular dependencies\n\nA <b>circular dependency</b> (module A depends on module B, while module B depends on module A).\n\n```text\nA\n↓\nB\n↓\nA\n```\n\n```javascript\n// a.js\n\nimport { b } from \"./b.js\";\n\nexport const a = \"A\";\n```\n\n```javascript\n// b.js\n\nimport { a } from \"./a.js\";\n\nexport const b = \"B\";\n```\n\n```text\na.js\n ↓\nb.js\n ↓\na.js\n```\n\nThat is a cycle.\n\n---\n\n## Why they are dangerous\n\nCircular dependencies cause:\n\n• Unexpected initialization order\n• `undefined` values\n• Errors accessing variables before initialization\n• Behaviour that is hard to reason about\n\nNode does not hang or crash on a cycle. It does something more awkward: it hands one of the modules a <b>partially initialised</b> version of the other. Whichever file happened to load first gets an incomplete picture of the second.\n\nESM has <b>live bindings</b> (an import refers to the exported binding itself, not a copy of its value at import time), so what you see depends on <b>when</b> you look. Read the value at the top of the file, during the cycle, and you may get a crash or `undefined`. Read the same value later, inside a function, and it is there. That timing dependence is what makes these bugs so slippery: the code looks correct, and it works until someone changes an import order somewhere else.\n\nCommonJS behaves differently again. `require` returns whatever `module.exports` holds at that moment, so you get a snapshot of a half-built object and it never fills in.\n\nThe lesson:\n\n> <b>Avoid circular dependencies whenever possible.</b>\n\nIf you find:\n\n```text\nA → B → C → A\n```\n\nrestructure. Usually the fix is to pull the shared piece out:\n\n```text\nA ──┐\n    ↓\n shared\n    ↑\nB ──┘\n```\n\ninstead of:\n\n```text\nA ↔ B\n```\n\nA cycle is nearly always a design signal. Two modules that each need the other are usually one concept split in the wrong place, or two concepts with a third hiding between them. In practice the shared piece is often a type, a constant or a small helper, and moving it out fixes the cycle and makes both files easier to read.\n\n---\n\n## The complete mental model\n\nYou do not need every rule memorised. You need this:\n\n```text\n                    Node.js Modules\n                           │\n              ┌────────────┴────────────┐\n              ↓                         ↓\n             ESM                    CommonJS\n              │                         │\n       import / export          require / module.exports\n              │                         │\n       Modern standard           Older Node system\n              │\n       .js with type:module\n              │\n          .mjs always ESM\n\nCommonJS\n   │\n.cjs always CommonJS\n```\n\nAnd for resolution:\n\n```text\n./file.js\n   ↓\nRelative import\n\nexpress\n   ↓\nPackage / bare specifier\n\n#utils\n   ↓\nInternal subpath import\n```\n\n---\n\n## Day 2 goal\n\nYou should be able to open any Node.js project and answer, straight away:\n\n```text\nIs this ESM or CommonJS?\n        ↓\nHow does this file import something?\n        ↓\nWhere will Node look for that module?\n        ↓\nIs this a built-in, local file, package, or alias?\n```\n\nAnd the one rule to keep:\n\n> <b>For new Node.js projects, prefer ESM and use `\"type\": \"module\"` unless you have a specific reason to use CommonJS.</b>",
      diagram: `A cycle, and what Node actually does

    a.js  ──── imports ────►  b.js
      ▲                        │
      └──────── imports ───────┘

    Node does not crash. It hands whichever module
    loaded second a HALF-BUILT version of the first.

    a.js starts loading
      │  needs b.js
      ↓
    b.js starts loading
      │  needs a.js — already in progress!
      ↓
    b.js gets a PARTIAL a.js
      │  export not evaluated yet
      ↓
    undefined, or "cannot access before initialization"


Why the timing matters

    // b.js
    import { a } from "./a.js"

    console.log(a)              ✗ during the cycle → may fail
    export function show() {
      console.log(a)            ✓ called later → fine
    }

    ESM imports are LIVE BINDINGS: they point at the
    binding, not a copy. So the answer depends on WHEN
    you look, which is why these bugs come and go.


The fix: extract the shared piece

    before                  after
    A ◄──────► B            A ──┐
                                ↓
    each needs the        shared / types / constants
    other to finish             ↑
                            B ──┘

    A cycle is a design signal, not a Node quirk.`,
      codeExample: {
        title: "A cycle, why it bites, and how to break it",
        code: `// ═══ The cycle ══════════════════════════════════════════════

// user.js
import { formatOrder } from "./order.js";

export const userLabel = "User";

export function describeUser(user) {
  return \`\${userLabel}: \${formatOrder(user.lastOrder)}\`;
}

// order.js
import { userLabel } from "./user.js";

// ✗ read at module top level, during the cycle
console.log(userLabel);            // undefined, or a ReferenceError

export function formatOrder(order) {
  // ✓ read later, when everything has finished loading
  return \`\${userLabel} ordered \${order.item}\`;
}

// Whichever file loads first gets a half-built view of the
// other. Node does not warn you. The code looks fine.


// ═══ Why it is so slippery ══════════════════════════════════
//
// ESM imports are live bindings: they point at the binding,
// not at a copy of its value. So:
//
//   top-level read     during the cycle    → may fail
//   read in a function called later        → works
//
// The same import behaves differently depending on WHEN it
// is read, which is why the bug appears only after someone
// changes an unrelated import order.
//
// CommonJS fails differently: require() returns whatever
// module.exports holds right now, so you get a snapshot of
// a half-built object that never fills in.


// ═══ The fix: pull the shared piece out ═════════════════════

// labels.js          ← the new shared module
export const userLabel = "User";

// user.js
import { userLabel } from "./labels.js";
import { formatOrder } from "./order.js";

export function describeUser(user) {
  return \`\${userLabel}: \${formatOrder(user.lastOrder)}\`;
}

// order.js
import { userLabel } from "./labels.js";      // no longer imports user.js

export function formatOrder(order) {
  return \`\${userLabel} ordered \${order.item}\`;
}

// user.js → order.js → labels.js
// No cycle. Both files also read better than before.`,
      },
      keyTakeaways: [
        "A <b>circular dependency</b> is two modules that each import the other, directly or through a chain.",
        "Node does not crash on a cycle. It hands one module a <b>partially initialised</b> version of the other.",
        "ESM imports are <b>live bindings</b>: they point at the binding, not a copy of its value.",
        "So a value read at the top of a file during a cycle may fail, while the same value read later inside a function is fine.",
        "That timing dependence is why cycle bugs appear and disappear when unrelated import orders change.",
        "CommonJS fails differently: `require` returns a snapshot of a half-built `module.exports` that never fills in.",
        "The fix is almost always to extract the shared piece into a third module, turning `A ↔ B` into `A → shared ← B`.",
        "A cycle is a design signal, not a Node quirk.",
        "The rule to keep: for new projects, prefer ESM with `\"type\": \"module\"` unless something specific forces CommonJS.",
      ],
      commonMistakes: [
        "<b>Assuming a cycle would throw if it were a real problem</b> — Node loads it happily and gives you `undefined` instead.",
        "<b>\"Fixing\" a cycle by moving the read inside a function</b> — that hides the symptom. The cycle is still there and will bite differently later.",
        "<b>Blaming the bundler or Node</b> — cycles behave the way the spec says. The structure is the problem.",
        "<b>Letting two modules import each other for \"just one constant\"</b> — that constant is exactly what belongs in a third module.",
        "<b>Expecting CommonJS and ESM to fail a cycle the same way</b> — one gives you a stale snapshot, the other a live binding read too early.",
      ],
      quiz: [
        {
          question: "What does Node do when it hits a circular dependency?",
          options: [
            "Throws a \"circular dependency detected\" error",
            "Hangs in an infinite loop",
            "Hands one module a partially initialised version of the other",
            "Silently skips the second import",
          ],
          correctIndex: 2,
          explanation:
            "Node loads the cycle without complaint, but whichever module loaded second sees the first before its exports finished evaluating. That is where the `undefined` values come from.",
        },
        {
          question: "Why does the same import sometimes work and sometimes fail in a cycle?",
          options: [
            "Node caches modules inconsistently",
            "ESM imports are live bindings, so the result depends on when you read them",
            "The file extension changes the behaviour",
            "It depends on whether the export is default or named",
          ],
          correctIndex: 1,
          explanation:
            "A live binding points at the binding, not a copy. Reading it at the top of a file during the cycle can fail, while reading it later inside a function is fine, which makes the bug depend on import order.",
        },
        {
          question: "`A → B → C → A`. What is the usual fix?",
          options: [
            "Use dynamic `import()` for one of the edges",
            "Switch that part of the project to CommonJS",
            "Extract the shared piece into a fourth module the others depend on",
            "Merge all three files into one",
          ],
          correctIndex: 2,
          explanation:
            "Turning `A ↔ B` into `A → shared ← B` removes the cycle and usually improves the design, because the shared constant, type or helper was in the wrong place to begin with.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Which single fact explains why `require` struggles with ESM, and why top-level `await` never worked in CommonJS?",
      options: [
        "ESM files are larger",
        "ESM loads asynchronously, CommonJS synchronously",
        "CommonJS does not support Promises",
        "ESM requires file extensions",
      ],
      correctIndex: 1,
      explanation:
        "A synchronous `require` must return a finished value immediately, so it cannot wait for an asynchronous load and nothing inside CommonJS may pause. Every interop limitation on this day traces back to that.",
    },
    {
      question: "`package.json` has `\"type\": \"module\"`. Which file is treated as CommonJS?",
      options: ["`app.js`", "`app.mjs`", "`app.cjs`", "None of them"],
      correctIndex: 2,
      explanation:
        "`.cjs` is always CommonJS and `.mjs` is always ESM, regardless of `package.json`. Only `.js` follows the `\"type\"` field, which makes it ESM here.",
    },
    {
      question: "In ESM, which import needs a file extension?",
      options: ["`\"express\"`", "`\"node:fs\"`", "`\"./math.js\"`", "`\"#utils/logger\"`"],
      correctIndex: 2,
      explanation:
        "Relative and absolute paths always carry the extension in ESM, because it refuses to guess between `./math.js`, `./math.json` and `./math/index.js`. Packages, built-ins and aliases never take one.",
    },
    {
      question: "What is `import.meta.dirname` for?",
      options: [
        "The directory the terminal was in when you ran `node`",
        "The directory containing the current ESM file, replacing `__dirname`",
        "The project root",
        "The `node_modules` location",
      ],
      correctIndex: 1,
      explanation:
        "It is the ESM replacement for `__dirname`. `process.cwd()` is the terminal's directory, which is a different thing and the reason bare `fs` paths break when you run a script from elsewhere.",
    },
    {
      question: "A library declares `\"exports\": { \".\": \"./src/index.js\" }`. What can consumers import?",
      options: [
        "Any file in the package",
        "Only the package root, everything else fails to resolve",
        "Only files under `src/`",
        "Nothing until `main` is also set",
      ],
      correctIndex: 1,
      explanation:
        "`exports` is enforced. Unlisted paths give `ERR_PACKAGE_PATH_NOT_EXPORTED`, which is what lets the author refactor internal files without breaking anyone.",
    },
    {
      question: "Two modules import each other and one gets `undefined`. What is the right fix?",
      options: [
        "Move the read inside a function so it runs later",
        "Extract the shared piece into a third module",
        "Convert both files to CommonJS",
        "Use dynamic `import()` for one of them",
      ],
      correctIndex: 1,
      explanation:
        "Moving the read later hides the symptom while the cycle remains. Turning `A ↔ B` into `A → shared ← B` removes it, and the shared constant or helper was usually in the wrong file anyway.",
    },
    {
      question: "What is the one rule to take away from Day 2?",
      options: [
        "Always use CommonJS, since most of npm does",
        "Use `.mjs` for every file to be safe",
        "For new projects, prefer ESM with `\"type\": \"module\"` unless something specific forces CommonJS",
        "Mix both systems freely, since modern Node handles it",
      ],
      correctIndex: 2,
      explanation:
        "ESM is the language standard, works in browsers, supports top-level `await`, and catches import typos before your code runs. Reach for `.cjs` only where a tool insists on it.",
    },
  ],
  project: {
    name: "node-modules-practice",
    goal: "Make a CommonJS module and an ES module talk to each other in both directions, then be able to explain why one direction is easier than the other.",
    brief:
      "This one is deliberately about understanding rather than output. Getting the files to run is the easy half. The valuable half is being able to say why `ESM → CommonJS` has always worked while `CommonJS → ESM` was hard for years, because that single answer explains most of what you met today. Do not skip the questions in the acceptance list.",
    steps: [
      "Create `node-modules-practice/` with `package.json`, `common.cjs`, `esm.mjs` and `app.cjs`.",
      "In `common.cjs`, export an object: `module.exports = { message: \"Hello from CommonJS\" }`.",
      "In `esm.mjs`, export a named constant: `export const message = \"Hello from ESM\"`.",
      "Make the ESM file import from the CommonJS one and print both messages. Note which import form you needed.",
      "Make `app.cjs` load `esm.mjs` and print its message. Try `require` first, then `await import()`.",
      "Add a top-level `await` to `esm.mjs`, re-run the `require` version, and read the error you get.",
      "Remove the top-level `await` again and confirm the `require` version starts working.",
    ],
    acceptance: [
      "Running the ESM entry point prints both messages, proving `ESM → CommonJS` works.",
      "Running `app.cjs` prints the ESM message, proving `CommonJS → ESM` works.",
      "You can explain why `ESM → CommonJS` works naturally. (Hint: which side is asynchronous?)",
      "You can explain why `CommonJS → ESM` was historically hard, and what still breaks it today.",
      "You can say when to use `.mjs`, when to use `.cjs`, and when to use `\"type\": \"module\"`.",
      "You can explain the difference between `import { x } from \"./x.js\"` and `const x = require(\"./x\")`, including what happens on a typo.",
      "You can explain `./utils.js`, `express` and `#utils` in terms of module resolution: which one searches, which one does not, and where each looks.",
    ],
    stretch: [
      "Add `\"imports\": { \"#utils\": \"./utils.js\" }` to `package.json` and import it as `import something from \"#utils\"`.",
      "Extend the alias to a wildcard, `\"#utils/*\": \"./src/utils/*.js\"`, and import two files through it.",
      "Build a deliberate circular dependency between two files, read the value at the top level, and watch it come back `undefined`. Then fix it by extracting a third module.",
      "Add a dynamic `import()` behind a command-line flag, so the module only loads when the flag is passed.",
    ],
  },
};
