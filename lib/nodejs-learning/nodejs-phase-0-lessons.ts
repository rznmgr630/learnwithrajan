import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_PHASE_0_LESSONS: LessonDay = {
  day: 0,
  title: "Phase 0 — Before You Start",
  totalMinutes: 92,
  difficulty: "Preparation",
  lessons: [
    {
      id: "js-variables-scope",
      title: "JavaScript you must know — let, const, scope and this",
      durationMinutes: 10,
      explanation:
        "### Why this phase exists\n\nNode.js lets you run JavaScript <b>outside the browser</b>: APIs, CLIs, background workers, real-time servers.\n\nBut Node.js does not teach you JavaScript. It only runs it.\n\n```text\nJavaScript\n    ↓\nLanguage fundamentals\n    ↓\nNode.js\n    ↓\nBackend programming\n    ↓\nAPIs → Databases → Auth → Caching → Queues → Scaling\n```\n\n<b>This phase is not part of the Node.js course.</b> It is a preparation checklist. You do not need to be a JavaScript expert. You need enough JavaScript that the language stops being the thing blocking you.\n\n---\n\n## `let` and `const`\n\nUse `let` when the value will change:\n\n```javascript\nlet count = 0;\n\ncount = 1;\n```\n\nUse `const` when the variable should not be reassigned:\n\n```javascript\nconst name = \"Rajan\";\n\n// name = \"John\";   // TypeError: Assignment to constant variable\n```\n\nOne detail that trips people up: `const` locks the <b>binding</b> (the connection between the name and the value), not the contents. You can still change what is inside an object:\n\n```javascript\nconst user = { name: \"Rajan\" };\n\nuser.name = \"John\";   // fine\n// user = {};         // error\n```\n\nDefault to `const`. Reach for `let` only when you actually reassign.\n\n---\n\n## Scope\n\n<b>Scope</b> (the region of code where a variable can be reached).\n\n```javascript\nfunction test() {\n  const message = \"Hello\";\n\n  console.log(message);   // Hello\n}\n\ntest();\n\n// console.log(message);  // ReferenceError: message is not defined\n```\n\n`message` only exists inside the function.\n\nThe three scopes you will meet constantly:\n\n```text\nGlobal scope     visible everywhere in the program\nFunction scope   visible inside one function\nBlock scope      visible inside one { } block\n```\n\n`let` and `const` are block scoped, so they disappear at the closing brace:\n\n```javascript\nif (true) {\n  const inside = \"only here\";\n}\n\n// console.log(inside);   // ReferenceError\n```\n\n<b>Shadowing</b> (an inner variable reusing an outer name) is legal but worth spotting when you debug:\n\n```javascript\nconst name = \"outer\";\n\nfunction show() {\n  const name = \"inner\";\n\n  console.log(name);   // inner\n}\n```\n\n---\n\n## Arrow functions\n\n```javascript\nconst add = (a, b) => {\n  return a + b;\n};\n```\n\nWith a single expression you can drop the braces and the `return`:\n\n```javascript\nconst add = (a, b) => a + b;\n```\n\nNode code is full of both forms. Route handlers, callbacks and array methods almost always use arrows.\n\n---\n\n## `this`\n\n<b>`this`</b> (the object the current function was called on).\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  sayHello() {\n    console.log(this.name);   // Rajan\n  },\n};\n\nuser.sayHello();\n```\n\nArrow functions do not get their own `this`. They borrow it from where they were written:\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n\n  sayHello: () => {\n    console.log(this.name);   // undefined\n  },\n};\n```\n\nIf `this` still feels slippery, that is fine. For now just know the rule of thumb: <b>a method that needs `this` should be a normal function, not an arrow</b>.",
      diagram: `Scope, from the outside in

    Global scope
    ┌──────────────────────────────────┐
    │  const appName = "api"           │
    │                                  │
    │   Function scope                 │
    │   ┌──────────────────────────┐   │
    │   │  const message = "Hello" │   │
    │   │                          │   │
    │   │   Block scope            │   │
    │   │   ┌──────────────────┐   │   │
    │   │   │ const temp = 1   │   │   │
    │   │   └──────────────────┘   │   │
    │   └──────────────────────────┘   │
    └──────────────────────────────────┘

    Inner code can read outward.
    Outer code cannot read inward.


this, in two function styles

    method()  ──►  this = the object it was called on
                   user.sayHello()  →  this = user

    () => {}  ──►  this = whatever this was where it was written
                   inside an object literal  →  not the object`,
      codeExample: {
        title: "Variables, scope and this",
        code: `// ── const by default, let only when you reassign ──────────────
const appName = "learning-api";
let requestCount = 0;

requestCount = requestCount + 1;      // fine
// appName = "other";                 // TypeError

// const locks the name, not the contents
const config = { port: 3000 };
config.port = 4000;                   // fine
// config = { port: 5000 };           // TypeError

// ── scope ─────────────────────────────────────────────────────
function handle() {
  const message = "Hello";            // function scope

  if (requestCount > 0) {
    const seen = true;                // block scope
    console.log(message, seen);
  }

  // console.log(seen);               // ReferenceError
}

handle();

// ── arrow functions ──────────────────────────────────────────
const add = (a, b) => a + b;          // short form
const double = (n) => n * 2;

console.log(add(2, 3), double(4));    // 5 8

// ── this ─────────────────────────────────────────────────────
const user = {
  name: "Rajan",

  sayHello() {                        // normal method: this = user
    console.log(\`Hello \${this.name}\`);
  },

  brokenHello: () => {                // arrow: this is not user
    console.log(\`Hello \${this?.name}\`);
  },
};

user.sayHello();                      // Hello Rajan
user.brokenHello();                   // Hello undefined`,
      },
      keyTakeaways: [
        "Default to `const`. Use `let` only when the value is genuinely reassigned.",
        "`const` locks the binding, not the contents. Object properties can still change.",
        "`let` and `const` are <b>block scoped</b>, so they vanish at the closing brace.",
        "Inner scopes can read outward. Outer scopes cannot read inward.",
        "Arrow functions are the short form you will see everywhere in Node code.",
        "An object method that needs `this` should be a normal function, not an arrow.",
      ],
      commonMistakes: [
        "<b>Thinking `const` makes an object immutable</b> — it does not. `config.port = 4000` works fine, only reassigning `config` fails.",
        "<b>Using an arrow function as an object method that needs `this`</b> — it will not point at the object, and `this.name` comes back `undefined`.",
        "<b>Reaching for a variable declared inside a block</b> — a `const` inside `if { }` does not exist after the closing brace.",
        "<b>Using `var` out of habit</b> — it is function scoped and hoisted, which makes bugs harder to see. Stick to `let` and `const`.",
      ],
      quiz: [
        {
          question: "What happens when you run `const user = { name: \"Rajan\" }; user.name = \"John\";`?",
          options: [
            "A TypeError, because `user` is a constant",
            "Nothing changes, the assignment is silently ignored",
            "It works, and `user.name` is now \"John\"",
            "It works only in non-strict mode",
          ],
          correctIndex: 2,
          explanation:
            "`const` locks the binding between the name `user` and that object. The object's own properties are still writable, so `user.name = \"John\"` succeeds. Only `user = {}` would throw.",
        },
        {
          question: "Why does `this.name` print `undefined` when `sayHello` is written as an arrow function inside an object literal?",
          options: [
            "Arrow functions cannot read object properties",
            "Arrow functions have no `this` of their own, so they use the surrounding one",
            "The object must be created with `new` first",
            "`name` has to be declared with `let` for arrows to see it",
          ],
          correctIndex: 1,
          explanation:
            "An arrow function inherits `this` from where it was written. Inside an object literal that is not the object, so `this.name` is not the property you wanted. Use a normal method instead.",
        },
        {
          question: "Which declaration is block scoped?",
          options: ["`var` only", "`let` and `const`", "`var` and `let`", "None, JavaScript has function scope only"],
          correctIndex: 1,
          explanation: "`let` and `const` are block scoped: they exist only inside the nearest `{ }`. `var` is function scoped, which is one reason to avoid it.",
        },
      ],
    },
    {
      id: "js-destructuring-strings",
      title: "Destructuring, spread, rest and template literals",
      durationMinutes: 10,
      explanation:
        "These four show up in almost every line of a real Node.js project, so it is worth being fluent rather than just familiar.\n\n---\n\n## Destructuring\n\n<b>Destructuring</b> (pulling values out of an object or array into their own variables).\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30,\n};\n\nconst { name, age } = user;\n\nconsole.log(name);   // Rajan\nconsole.log(age);    // 30\n```\n\nArrays destructure by position, not by name:\n\n```javascript\nconst numbers = [10, 20, 30];\n\nconst [first, second] = numbers;\n\nconsole.log(first, second);   // 10 20\n```\n\nYou can rename and give defaults at the same time:\n\n```javascript\nconst { name: username, role = \"user\" } = user;\n```\n\nIn Node you will see this constantly when reading request data and config:\n\n```javascript\nconst { id } = req.params;\nconst { email, password } = req.body;\nconst { PORT = 3000 } = process.env;\n```\n\n---\n\n## Spread\n\n<b>Spread</b> (`...` used to expand the contents of something into a new one).\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30,\n};\n\nconst updatedUser = {\n  ...user,\n  age: 31,\n};\n\nconsole.log(updatedUser);   // { name: \"Rajan\", age: 31 }\n```\n\nOrder matters. Later keys win, which is how you write \"copy this, then override one field\".\n\nArrays work the same way:\n\n```javascript\nconst more = [...numbers, 40];\n```\n\n---\n\n## Rest\n\n<b>Rest</b> (`...` used to collect whatever is left into one variable).\n\n```javascript\nfunction add(...numbers) {\n  return numbers.reduce((sum, number) => sum + number, 0);\n}\n\nadd(1, 2, 3, 4);   // 10\n```\n\nIt also works when destructuring, which is a neat way to drop a field:\n\n```javascript\nconst { password, ...safeUser } = userRecord;\n```\n\nThat single line is how you avoid leaking a password hash in an API response.\n\nThe difference in one place:\n\n```text\nSpread → expands\nRest   → collects\n```\n\nSame three dots. Which one it is depends on whether it sits on the <b>left</b> of an assignment (collecting) or the <b>right</b> (expanding).\n\n---\n\n## Template literals\n\n<b>Template literals</b> (strings written with backticks that can hold expressions).\n\n```javascript\nconst name = \"Rajan\";\nconst age = 30;\n\nconsole.log(`My name is ${name} and I am ${age} years old.`);\n```\n\nPrefer this:\n\n```javascript\n`Hello ${name}`\n```\n\nover this:\n\n```javascript\n\"Hello \" + name\n```\n\nThey also span multiple lines without `\\n`, which is handy for SQL and log output.\n\nYou will reach for template literals when building:\n\n• URLs and endpoint paths\n• SQL queries\n• Error messages\n• Log lines\n• API responses",
      diagram: `Destructuring

    { name: "Rajan", age: 30 }
        │        │
        ↓        ↓
    const { name, age } = user      by key

    [ 10, 20, 30 ]
      │   │
      ↓   ↓
    const [first, second] = numbers  by position


Spread vs rest: same dots, opposite jobs

    SPREAD                        expands
    const copy = { ...user, age: 31 }
                   └─ pours user's keys in, then overrides age

    REST                          collects
    function add(...numbers) { }
                  └─ gathers every argument into one array

    const { password, ...safeUser } = record
                       └─ everything except password


Template literal

    \`Hello \${name}, you are \${age}\`
       │      │              │
     text   value          value`,
      codeExample: {
        title: "Destructuring, spread, rest and template literals",
        code: `// ── 1. Destructuring: objects by key, arrays by position ──────
const user = { id: 7, name: "Rajan", age: 30 };

const { name, age } = user;
console.log(name, age);                 // Rajan 30

const numbers = [10, 20, 30];
const [first, second] = numbers;
console.log(first, second);             // 10 20

// rename + default in one go
const { name: username, role = "user" } = user;
console.log(username, role);            // Rajan user

// what this looks like in real Node code
// const { id } = req.params;
// const { email, password } = req.body;
// const { PORT = 3000 } = process.env;

// ── 2. Spread: copy, then override ───────────────────────────
const updatedUser = { ...user, age: 31 };
console.log(updatedUser);               // { id: 7, name: "Rajan", age: 31 }

const moreNumbers = [...numbers, 40];   // [10, 20, 30, 40]

// ── 3. Rest: collect the leftovers ───────────────────────────
function add(...values) {
  return values.reduce((sum, value) => sum + value, 0);
}

console.log(add(1, 2, 3, 4));           // 10

// dropping a field before sending a response
const record = { id: 7, name: "Rajan", password: "hashed-secret" };
const { password: _hidden, ...safeUser } = record;
console.log(safeUser);                  // { id: 7, name: "Rajan" }

// ── 4. Template literals ─────────────────────────────────────
console.log(\`My name is \${name} and I am \${age} years old.\`);

const endpoint = \`/api/users/\${user.id}/orders\`;
console.log(endpoint);                  // /api/users/7/orders`,
      },
      keyTakeaways: [
        "Objects destructure <b>by key</b>, arrays destructure <b>by position</b>.",
        "You can rename and set a default in the same destructure: `const { role = \"user\" } = user`.",
        "Spread expands. In an object literal, later keys win, so `{ ...user, age: 31 }` is copy-then-override.",
        "Rest collects. `function add(...values)` gathers every argument into an array.",
        "`const { password, ...safeUser } = record` is the standard way to strip a field before responding.",
        "Use template literals for URLs, queries, logs and error messages instead of `+` concatenation.",
      ],
      commonMistakes: [
        "<b>Putting the override before the spread</b> — `{ age: 31, ...user }` puts the old age back, because later keys win.",
        "<b>Expecting array destructuring to match by name</b> — `const [second] = numbers` gives you the <i>first</i> item. Position is all that counts.",
        "<b>Thinking spread copies deeply</b> — it is a shallow copy. Nested objects are still shared between the original and the copy.",
        "<b>Building strings with `+` when values are involved</b> — it is harder to read and easy to lose a space. Use a template literal.",
      ],
      quiz: [
        {
          question: "What does `{ age: 31, ...user }` produce when `user` is `{ name: \"Rajan\", age: 30 }`?",
          options: [
            "`{ age: 31, name: \"Rajan\" }`",
            "`{ name: \"Rajan\", age: 30 }`",
            "A syntax error",
            "`{ age: 31, name: \"Rajan\", age: 31 }`",
          ],
          correctIndex: 1,
          explanation:
            "Later keys win. Because the spread comes after `age: 31`, the spread's `age: 30` overwrites it. Put the override <i>after</i> the spread instead.",
        },
        {
          question: "In `const { password, ...safeUser } = record`, what are the three dots doing?",
          options: [
            "Spreading, expanding `record` into `safeUser`",
            "Rest, collecting every property except `password`",
            "Nothing, they are optional syntax",
            "Deep-cloning `record`",
          ],
          correctIndex: 1,
          explanation:
            "On the left of an assignment the dots collect, so this is rest. `safeUser` gets every property except `password`, which is why it is the standard way to strip a field before sending a response.",
        },
      ],
    },
    {
      id: "js-arrays-objects",
      title: "Array methods and objects",
      durationMinutes: 12,
      explanation:
        "Backend work is mostly shaping data: rows from a database, items from an API, records to validate. That means array methods and objects.\n\n---\n\n## `map()`\n\n<b>`map()`</b> (builds a new array by transforming every item).\n\n```javascript\nconst numbers = [1, 2, 3];\n\nconst doubled = numbers.map(number => number * 2);\n\nconsole.log(doubled);   // [2, 4, 6]\n```\n\nThe original array is untouched. Every one of these methods returns something new instead of editing in place.\n\n---\n\n## `filter()`\n\n<b>`filter()`</b> (builds a new array with only the items that pass a test).\n\n```javascript\nconst numbers = [1, 2, 3, 4];\n\nconst even = numbers.filter(number => number % 2 === 0);\n\nconsole.log(even);   // [2, 4]\n```\n\n---\n\n## `reduce()`\n\n<b>`reduce()`</b> (combines every item into one result).\n\n```javascript\nconst numbers = [1, 2, 3, 4];\n\nconst total = numbers.reduce(\n  (sum, number) => sum + number,\n  0,\n);\n\nconsole.log(total);   // 10\n```\n\nThat `0` is the starting value. Leave it out and the first item becomes the start, which breaks on an empty array.\n\n---\n\n## `find()`\n\n<b>`find()`</b> (returns the first item that matches, or `undefined`).\n\n```javascript\nconst users = [\n  { id: 1, name: \"Rajan\" },\n  { id: 2, name: \"John\" },\n];\n\nconst user = users.find(user => user.id === 2);\n\nconsole.log(user);   // { id: 2, name: \"John\" }\n```\n\nNote what it gives back: <b>the item itself</b>, not an array. `filter` always hands you an array, even when only one thing matched.\n\n---\n\n## `some()` and `every()`\n\n<b>`some()`</b> (is at least one item a match?).\n\n```javascript\nconst numbers = [1, 3, 5, 6];\n\nconsole.log(numbers.some(number => number % 2 === 0));   // true\n```\n\n<b>`every()`</b> (are all items a match?).\n\n```javascript\nconst numbers = [2, 4, 6];\n\nconsole.log(numbers.every(number => number % 2 === 0));   // true\n```\n\nThe whole family in one place:\n\n```text\nmap     → transform\nfilter  → select\nreduce  → combine\nfind    → find one\nsome    → at least one?\nevery   → all?\n```\n\n---\n\n## Objects\n\nNode.js applications pass objects around all day: config, request bodies, database documents, API responses.\n\n```javascript\nconst user = {\n  id: 1,\n  name: \"Rajan\",\n  email: \"rajan@example.com\",\n};\n\nconsole.log(user.name);\nconsole.log(user[\"email\"]);   // same thing, useful when the key is in a variable\n```\n\nYou should be comfortable with properties, methods, nested objects, destructuring, spread and computed keys:\n\n```javascript\nconst field = \"email\";\n\nconst patch = {\n  [field]: \"new@example.com\",   // computed key\n};\n```\n\nAnd the three inspection helpers:\n\n```javascript\nconst user = { name: \"Rajan\", age: 30 };\n\nconsole.log(Object.keys(user));     // [\"name\", \"age\"]\nconsole.log(Object.values(user));   // [\"Rajan\", 30]\nconsole.log(Object.entries(user));  // [[\"name\", \"Rajan\"], [\"age\", 30]]\n```\n\n`Object.entries()` is the one you will use most, because it lets you loop over an object with array methods.",
      diagram: `The six array methods, by what they hand back

    [1, 2, 3, 4]

    map      →  [2, 4, 6, 8]      a new array, same length
    filter   →  [2, 4]            a new array, shorter
    reduce   →  10                one value
    find     →  2                 one item (or undefined)
    some     →  true              a boolean
    every    →  false             a boolean


reduce, step by step

    numbers.reduce((sum, n) => sum + n, 0)

    sum = 0   n = 1   →  1
    sum = 1   n = 2   →  3
    sum = 3   n = 3   →  6
    sum = 6   n = 4   →  10
                          └─ the result


find vs filter

    users.find(u => u.id === 2)     →  { id: 2, name: "John" }
    users.filter(u => u.id === 2)   →  [ { id: 2, name: "John" } ]
                                         └─ still an array


Object inspection

    { name: "Rajan", age: 30 }

    Object.keys     →  ["name", "age"]
    Object.values   →  ["Rajan", 30]
    Object.entries  →  [["name", "Rajan"], ["age", 30]]`,
      codeExample: {
        title: "Shaping data with array methods and objects",
        code: `const users = [
  { id: 1, name: "Rajan", age: 30, active: true },
  { id: 2, name: "John", age: 24, active: false },
  { id: 3, name: "Sita", age: 35, active: true },
];

// ── map: transform every item ────────────────────────────────
const names = users.map((user) => user.name);
console.log(names);                       // ["Rajan", "John", "Sita"]

// ── filter: keep the ones that pass ──────────────────────────
const activeUsers = users.filter((user) => user.active);
console.log(activeUsers.length);          // 2

// ── reduce: collapse into one value ──────────────────────────
const totalAge = users.reduce((sum, user) => sum + user.age, 0);
console.log(totalAge);                    // 89

// reduce can also build an object: id → user lookup
const byId = users.reduce((acc, user) => {
  acc[user.id] = user;
  return acc;
}, {});
console.log(byId[2].name);                // John

// ── find: one item, or undefined ─────────────────────────────
const found = users.find((user) => user.id === 2);
console.log(found);                       // { id: 2, name: "John", ... }

const missing = users.find((user) => user.id === 99);
console.log(missing);                     // undefined

// ── some / every: questions, not lists ───────────────────────
console.log(users.some((user) => user.age > 32));    // true
console.log(users.every((user) => user.active));     // false

// ── chaining is where this gets useful ───────────────────────
const activeNames = users
  .filter((user) => user.active)
  .map((user) => user.name);
console.log(activeNames);                 // ["Rajan", "Sita"]

// ── objects: access, computed keys, inspection ───────────────
const user = { id: 1, name: "Rajan", email: "rajan@example.com" };

const field = "email";
const patch = { [field]: "new@example.com" };   // computed key

console.log(Object.keys(user));           // ["id", "name", "email"]
console.log(Object.entries(patch));       // [["email", "new@example.com"]]

// entries lets you loop an object with array methods
Object.entries(user).forEach(([key, value]) => {
  console.log(\`\${key} = \${value}\`);
});`,
      },
      keyTakeaways: [
        "`map`, `filter`, `find`, `some` and `every` all leave the original array alone and return something new.",
        "`find` returns <b>the item</b> or `undefined`. `filter` always returns an array.",
        "Always pass `reduce` a starting value. Without it, an empty array throws.",
        "`reduce` is not just for sums. Building an id-to-record lookup object is a very common backend use.",
        "Chaining `filter().map()` reads far better than a `for` loop with an `if` inside.",
        "`Object.entries()` is the bridge that lets you use array methods on an object.",
      ],
      commonMistakes: [
        "<b>Using `map` when you meant `forEach`</b> — `map` builds a new array. If you are not using the result, `forEach` says what you mean.",
        "<b>Expecting `find` to return an array</b> — it returns the item itself, so `found[0]` is `undefined`. Use `filter` when you want a list.",
        "<b>Forgetting `reduce`'s initial value</b> — `[].reduce((a, b) => a + b)` throws a TypeError on an empty array.",
        "<b>Forgetting to `return` inside `reduce`</b> — the accumulator becomes `undefined` on the next pass and the whole thing collapses.",
        "<b>Assuming `find` always finds something</b> — check for `undefined` before reading a property, or you get the classic \"cannot read properties of undefined\".",
      ],
      quiz: [
        {
          question: "What does `users.find(user => user.id === 2)` return?",
          options: [
            "An array containing the matching user",
            "The matching user object itself",
            "The index of the matching user",
            "`true` if a match exists",
          ],
          correctIndex: 1,
          explanation:
            "`find` hands back the item itself, or `undefined` when nothing matches. `filter` is the one that returns an array, even for a single match.",
        },
        {
          question: "Why does `[].reduce((sum, n) => sum + n)` throw?",
          options: [
            "`reduce` does not work on numbers",
            "The callback is missing a `return`",
            "There is no initial value and no first item to fall back on",
            "Empty arrays are not iterable",
          ],
          correctIndex: 2,
          explanation:
            "Without an initial value, `reduce` uses the first item as the starting point. An empty array has none, so it throws. Passing `0` as the second argument fixes it.",
        },
        {
          question: "Which one answers \"are all of these items valid?\"",
          options: ["`some()`", "`every()`", "`filter()`", "`find()`"],
          correctIndex: 1,
          explanation: "`every()` returns `true` only when all items pass the test. `some()` returns `true` when at least one does.",
        },
      ],
    },
    {
      id: "js-safe-access",
      title: "Optional chaining and nullish coalescing",
      durationMinutes: 8,
      explanation:
        "Two small operators that remove a whole category of backend crashes. You will use both in every Node project you write.\n\n---\n\n## Optional chaining `?.`\n\n<b>Optional chaining</b> (`?.` reads a property only if the thing before it exists).\n\nWithout it:\n\n```javascript\nconst city = user.address.city;\n```\n\nIf `address` is missing, that line throws:\n\n```text\nTypeError: Cannot read properties of undefined (reading 'city')\n```\n\nWith it:\n\n```javascript\nconst city = user.address?.city;\n```\n\nIf `address` does not exist, you get `undefined` instead of a crash.\n\nIt works on function calls and array indexes too:\n\n```javascript\nuser.getName?.();      // only calls it if getName exists\nusers?.[0]?.name;      // safe through both steps\n```\n\nYou will lean on this whenever data comes from somewhere you do not control:\n\n• API responses\n• Database results\n• Configuration objects\n• Deeply nested JSON\n\nOne caution: `?.` is for values that are <b>genuinely optional</b>. If a field should always be there, a crash is better than silently continuing with `undefined`, because it tells you the real bug straight away.\n\n---\n\n## Nullish coalescing `??`\n\n<b>Nullish coalescing</b> (`??` supplies a fallback when the left side is `null` or `undefined`).\n\n```javascript\nconst name = user.name ?? \"Unknown\";\n```\n\nIf `user.name` is `\"Rajan\"`:\n\n```text\nRajan\n```\n\nIf `user.name` is `null`:\n\n```text\nUnknown\n```\n\n---\n\n## `??` is not `||`\n\nThis difference causes real bugs, so it is worth committing to memory.\n\n`||` falls back on any <b>falsy</b> value: `0`, `\"\"`, `false`, `NaN`, `null`, `undefined`.\n\n`??` falls back on only these two:\n\n```text\nnull\nundefined\n```\n\nWatch what happens with a legitimate zero:\n\n```javascript\nconst count = 0;\n\nconsole.log(count || 10);   // 10   ← wrong, 0 was a real value\nconsole.log(count ?? 10);   // 0    ← right\n```\n\nSame story with an empty string, or a `false` that was set deliberately:\n\n```javascript\nconst options = { retries: 0, verbose: false, prefix: \"\" };\n\nconsole.log(options.retries || 3);    // 3      ← lost the 0\nconsole.log(options.retries ?? 3);    // 0\n\nconsole.log(options.verbose || true); // true   ← lost the false\nconsole.log(options.verbose ?? true); // false\n```\n\nRule of thumb: when the value is a <b>number, a boolean or a string that could legitimately be empty</b>, use `??`. Reading config and query parameters is exactly that situation, which is why `??` is the safer default in backend code.\n\nThe two operators pair up nicely:\n\n```javascript\nconst port = config.server?.port ?? 3000;\n```\n\nRead it left to right: look up `port` if `server` exists, and fall back to `3000` if the result is missing.",
      diagram: `Optional chaining: stop instead of crash

    user.address.city
         └─ address is undefined
            └─ TypeError: Cannot read properties of undefined

    user.address?.city
         └─ address is undefined
            └─ short-circuits, whole expression is undefined


?? vs ||  — what counts as "missing"

    value        || falls back?     ?? falls back?
    ─────────────────────────────────────────────
    undefined         yes                yes
    null              yes                yes
    0                 yes                NO
    ""                yes                NO
    false             yes                NO
    NaN               yes                NO

    ||  triggers on any falsy value
    ??  triggers on null and undefined only


The two together

    const port = config.server?.port ?? 3000
                              │         │
                  only if server      only if the
                  exists              result is missing`,
      codeExample: {
        title: "Reading data that might not be there",
        code: `const user = {
  id: 1,
  name: "Rajan",
  profile: {
    city: "Kathmandu",
  },
};

const emptyUser = { id: 2 };

// ── optional chaining ────────────────────────────────────────
console.log(user.profile?.city);          // Kathmandu
console.log(emptyUser.profile?.city);     // undefined  (no crash)

// console.log(emptyUser.profile.city);   // TypeError

// works on calls and indexes too
console.log(user.getName?.());            // undefined, never called
console.log([user]?.[0]?.name);           // Rajan

// ── nullish coalescing ───────────────────────────────────────
console.log(user.nickname ?? "Unknown");  // Unknown

// ── why ?? and || are not interchangeable ────────────────────
const options = { retries: 0, verbose: false, prefix: "" };

console.log(options.retries || 3);        // 3       wrong: 0 was real
console.log(options.retries ?? 3);        // 0       right

console.log(options.verbose || true);     // true    wrong
console.log(options.verbose ?? true);     // false   right

console.log(options.prefix || "api");     // "api"   wrong
console.log(options.prefix ?? "api");     // ""      right

// ── the pattern you will actually write ──────────────────────
const config = { server: { port: 0 } };

const port = config.server?.port ?? 3000;
console.log(port);                        // 0, because 0 was set on purpose

const host = config.server?.host ?? "localhost";
console.log(host);                        // localhost`,
      },
      keyTakeaways: [
        "`?.` short-circuits to `undefined` instead of throwing when something in the chain is missing.",
        "`?.` also guards calls (`fn?.()`) and indexes (`arr?.[0]`).",
        "`??` falls back only on `null` and `undefined`.",
        "`||` falls back on every falsy value, so it quietly eats `0`, `\"\"` and `false`.",
        "For numbers, booleans and possibly-empty strings, `??` is the correct choice.",
        "`config.server?.port ?? 3000` is the everyday pairing: safe lookup, then a default.",
      ],
      commonMistakes: [
        "<b>Using `||` for a numeric default</b> — `port || 3000` throws away a deliberate `0`. Use `??`.",
        "<b>Using `||` for a boolean flag</b> — `verbose || true` can never be `false`. Use `??`.",
        "<b>Sprinkling `?.` over everything</b> — on a field that should always exist, it hides the real bug and pushes `undefined` further downstream.",
        "<b>Expecting `?.` to create anything</b> — it only reads safely. `user.profile?.city = \"X\"` is not valid assignment.",
        "<b>Mixing `??` and `||` without parentheses</b> — JavaScript rejects it as a syntax error, on purpose.",
      ],
      quiz: [
        {
          question: "What does `console.log(0 || 10)` print, and what does `console.log(0 ?? 10)` print?",
          options: ["`10` and `10`", "`0` and `0`", "`10` and `0`", "`0` and `10`"],
          correctIndex: 2,
          explanation:
            "`||` treats `0` as falsy and falls back to `10`. `??` only falls back on `null` or `undefined`, so it keeps the `0`. This is exactly why `??` is safer for numeric config.",
        },
        {
          question: "`emptyUser.profile?.city` where `emptyUser` has no `profile`. What happens?",
          options: [
            "A TypeError is thrown",
            "The expression is `undefined`",
            "The expression is `null`",
            "It creates an empty `profile` object",
          ],
          correctIndex: 1,
          explanation:
            "Optional chaining short-circuits as soon as it hits `null` or `undefined`, so the whole expression evaluates to `undefined` rather than throwing.",
        },
      ],
    },
    {
      id: "js-classes",
      title: "Classes, extends and private fields",
      durationMinutes: 10,
      explanation:
        "You do not need deep object-oriented theory for Node. You do need to read class syntax without stopping, because services, models, custom errors and most Node libraries use it.\n\n---\n\n## A class\n\nA <b>class</b> (a blueprint for creating objects).\n\n```javascript\nclass User {\n  constructor(name) {\n    this.name = name;\n  }\n\n  sayHello() {\n    console.log(`Hello ${this.name}`);\n  }\n}\n\nconst user = new User(\"Rajan\");\n\nuser.sayHello();   // Hello Rajan\n```\n\nThe <b>constructor</b> (the method that runs when you call `new`) is where you set up the object. Everything else is a method shared by every instance.\n\n---\n\n## `extends`\n\n<b>`extends`</b> (builds a class on top of another one).\n\n```javascript\nclass Admin extends User {\n  deleteUser() {\n    console.log(\"User deleted\");\n  }\n}\n\nconst admin = new Admin(\"Rajan\");\n\nadmin.sayHello();    // inherited from User\nadmin.deleteUser();  // its own\n```\n\nIf the child needs its own constructor, it must call <b>`super()`</b> (the parent's constructor) first:\n\n```javascript\nclass Admin extends User {\n  constructor(name, level) {\n    super(name);       // must come before touching this\n    this.level = level;\n  }\n}\n```\n\nForget `super()` and you get a `ReferenceError` the moment you touch `this`.\n\nThe piece you will actually use in Node: custom errors extend the built-in `Error`.\n\n```javascript\nclass NotFoundError extends Error {\n  constructor(message) {\n    super(message);\n    this.name = \"NotFoundError\";\n    this.statusCode = 404;\n  }\n}\n```\n\nThat pattern is the backbone of clean API error handling, and it shows up on day one of real Express work.\n\n---\n\n## Private fields `#`\n\n<b>Private fields</b> (`#` marks a field only code inside the class can touch).\n\n```javascript\nclass User {\n  #password;\n\n  constructor(password) {\n    this.#password = password;\n  }\n\n  checkPassword(password) {\n    return this.#password === password;\n  }\n}\n```\n\nThis works:\n\n```javascript\nuser.checkPassword(\"1234\");   // true or false\n```\n\nThis does not even compile:\n\n```javascript\nuser.#password;   // SyntaxError: Private field must be declared in an enclosing class\n```\n\nThe field must be declared at the top of the class body. This is real privacy, not a naming convention like the older `_password`.\n\nThat is <b>encapsulation</b> (keeping internal details inside, exposing only what callers need). It matters more as an application grows: a password hash, a database handle or a cache should not be reachable from outside the class that owns it.\n\n---\n\n## The vocabulary\n\n```text\nclass         the blueprint\nconstructor   runs on new\nnew           creates an instance\nmethod        shared behaviour\nextends       builds on a parent\nsuper         calls the parent\n#field        private to the class\n```",
      diagram: `Class to object

    class User                          new User("Rajan")
    ┌────────────────────┐             ┌────────────────────┐
    │ constructor(name)  │  ─────────► │ name: "Rajan"      │
    │ sayHello()         │             │ sayHello()         │
    └────────────────────┘             └────────────────────┘
         blueprint                          instance


extends and super

              Error  (built in)
                │
                │  extends
                ↓
         NotFoundError
                │  constructor(message) {
                │    super(message)   ← parent runs first
                │    this.statusCode = 404
                │  }
                ↓
      new NotFoundError("No such user")


Private fields

    class User {
      #password         ← declared inside the class

      checkPassword()   ← can read #password
    }

    user.checkPassword("1234")    ✓ allowed
    user.#password                ✗ SyntaxError`,
      codeExample: {
        title: "Classes, inheritance and private fields",
        code: `// ── 1. A class is a blueprint ────────────────────────────────
class User {
  #password;                        // private: only this class can read it

  constructor(name, password) {
    this.name = name;
    this.#password = password;
  }

  sayHello() {
    console.log(\`Hello \${this.name}\`);
  }

  checkPassword(candidate) {
    return this.#password === candidate;
  }
}

const user = new User("Rajan", "1234");

user.sayHello();                    // Hello Rajan
console.log(user.checkPassword("1234"));   // true
console.log(user.checkPassword("wrong"));  // false
// console.log(user.#password);     // SyntaxError

// ── 2. extends and super ─────────────────────────────────────
class Admin extends User {
  constructor(name, password, level) {
    super(name, password);          // parent first, before touching this
    this.level = level;
  }

  deleteUser(target) {
    console.log(\`\${this.name} deleted \${target}\`);
  }
}

const admin = new Admin("Rajan", "1234", "root");

admin.sayHello();                   // inherited
admin.deleteUser("John");           // its own

// ── 3. The pattern you will use in Node: custom errors ───────
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

try {
  throw new NotFoundError("User 99 does not exist");
} catch (error) {
  console.log(error.name);          // NotFoundError
  console.log(error.message);       // User 99 does not exist
  console.log(error.statusCode);    // 404
  console.log(error instanceof Error);   // true
}`,
      },
      keyTakeaways: [
        "The `constructor` runs when you call `new`. It is where instance fields get set.",
        "`extends` inherits every method from the parent class.",
        "A child constructor must call `super()` before it touches `this`.",
        "`#field` is genuinely private. Reading it from outside is a syntax error, not a convention.",
        "Custom errors extending `Error` are the pattern behind clean API error handling in Node.",
        "You mostly need to <b>read</b> class syntax fluently. Writing deep hierarchies is rarely the right call.",
      ],
      commonMistakes: [
        "<b>Touching `this` before `super()` in a child constructor</b> — that is a `ReferenceError` every time.",
        "<b>Using a `#` field without declaring it in the class body</b> — it must appear at the top, not just inside the constructor.",
        "<b>Thinking `_password` is private</b> — the underscore is only a hint. `#password` is the enforced version.",
        "<b>Forgetting `new`</b> — calling `User(\"Rajan\")` without `new` throws a TypeError.",
        "<b>Forgetting `super(message)` in a custom error</b> — `error.message` comes back empty and the stack trace is less useful.",
      ],
      quiz: [
        {
          question: "What happens if a child constructor sets `this.level = level` before calling `super()`?",
          options: [
            "It works, order does not matter",
            "A ReferenceError is thrown",
            "`level` is silently ignored",
            "The parent constructor runs automatically first",
          ],
          correctIndex: 1,
          explanation:
            "`this` does not exist in a derived constructor until `super()` has run. Touching it first throws a ReferenceError, so `super()` always goes on the first line.",
        },
        {
          question: "Why do custom error classes call `super(message)`?",
          options: [
            "To register the error with Node",
            "To pass the message up to `Error`, so `error.message` and the stack trace work",
            "It is only needed in TypeScript",
            "To make the error catchable",
          ],
          correctIndex: 1,
          explanation:
            "`Error`'s own constructor is what sets `message` and captures the stack. Skip `super(message)` and `error.message` comes back empty.",
        },
      ],
    },
    {
      id: "js-errors-async",
      title: "try/catch, Promises, async/await and JSON",
      durationMinutes: 14,
      explanation:
        "This is the most important lesson in Phase 0. Almost everything a Node server does is asynchronous, and almost everything it sends over the wire is JSON.\n\n---\n\n## `try/catch` and the `Error` object\n\n```javascript\ntry {\n  throw new Error(\"Something went wrong\");\n} catch (error) {\n  console.log(error.message);   // Something went wrong\n}\n```\n\nAn <b>`Error`</b> (an object that describes what went wrong) carries three things you will read constantly:\n\n```javascript\nerror.message   // the human-readable description\nerror.name      // \"Error\", \"TypeError\", \"NotFoundError\", ...\nerror.stack     // where it happened, line by line\n```\n\n```javascript\ntry {\n  throw new Error(\"Database connection failed\");\n} catch (error) {\n  console.log(error.name);      // Error\n  console.log(error.message);   // Database connection failed\n}\n```\n\nThrow `new Error(...)`, not a string. A bare `throw \"oops\"` gives you no stack trace, and every piece of error-handling middleware you will ever write expects an `Error`.\n\nBackend code deals with errors all day: API failures, database timeouts, bad credentials, validation problems, missing files.\n\n---\n\n## Promises\n\nA <b>Promise</b> (an object standing in for a result that has not arrived yet).\n\n```javascript\nconst promise = new Promise((resolve, reject) => {\n  resolve(\"Success\");\n});\n```\n\nA Promise is always in one of three states:\n\n```text\npending     still working\nfulfilled   finished with a value\nrejected    failed with a reason\n```\n\nOnce it leaves `pending` it never changes again.\n\nThe three handlers:\n\n```javascript\nfetchData()\n  .then(data => {\n    console.log(data);\n  })\n  .catch(error => {\n    console.log(error);\n  })\n  .finally(() => {\n    console.log(\"done either way\");\n  });\n```\n\nYou will mostly <b>consume</b> promises rather than construct them. Nearly every modern Node API already returns one.\n\n---\n\n## `async/await`\n\n<b>`async`</b> (marks a function as asynchronous, so it always returns a Promise).\n\n<b>`await`</b> (pauses inside that function until a Promise settles).\n\n```javascript\nasync function getUser() {\n  const user = await fetchUser();\n\n  return user;\n}\n```\n\nThis is the same thing as `.then()` chaining, just written top to bottom. Handle errors with the `try/catch` you already know:\n\n```javascript\nasync function getUser() {\n  try {\n    const user = await fetchUser();\n\n    return user;\n  } catch (error) {\n    console.log(error.message);\n  }\n}\n```\n\nOne point that matters enormously later:\n\n> `await` does <b>not</b> freeze the whole Node.js application.\n\nIt pauses <b>that one function</b>. While it waits, Node goes off and handles other requests, timers and callbacks. That is the entire reason a single Node process can serve thousands of connections at once, and it is what the <b>event loop</b> lessons in the course are about.\n\nOne more thing worth knowing now: an `async` function always returns a Promise, so calling it without `await` gives you a Promise, not the value.\n\n```javascript\nconst result = getUser();          // Promise { <pending> }\nconst user = await getUser();      // the actual user\n```\n\n---\n\n## JSON\n\n<b>JSON</b> (JavaScript Object Notation) is a text format for moving data between systems.\n\n```text\n{\n  \"name\": \"Rajan\",\n  \"age\": 30\n}\n```\n\nIt looks like a JavaScript object but it is a <b>string</b>. Two functions cross that line.\n\n### `JSON.stringify()`\n\nJavaScript data → JSON string.\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30,\n};\n\nconst json = JSON.stringify(user);\n// '{\"name\":\"Rajan\",\"age\":30}'\n```\n\n### `JSON.parse()`\n\nJSON string → JavaScript data.\n\n```javascript\nconst user = JSON.parse(json);\n\nconsole.log(user.name);   // Rajan\n```\n\nJSON has no dates, no functions and no `undefined`. A `Date` comes back as a string after a round trip, which surprises people once and then never again.\n\nThis is fundamental for APIs: a request body arrives as JSON and a response goes out as JSON.",
      diagram: `A Promise has three states, and settles once

              new Promise
                   │
                pending
                   │
         ┌─────────┴─────────┐
         ↓                   ↓
     fulfilled            rejected
     .then(value)         .catch(error)
         └─────────┬─────────┘
                   ↓
              .finally()


.then chaining vs async/await  — same thing, two shapes

    fetchUser()                  async function getUser() {
      .then(u => use(u))    ≡      try {
      .catch(e => log(e))            const u = await fetchUser()
                                     use(u)
                                   } catch (e) { log(e) }
                                 }


await pauses ONE function, not the process

    request A ──── await db.find() ─ ─ ─ ─ ─► respond
                        │
                        │  while A waits, Node keeps working
                        ↓
    request B ──── await db.find() ─ ─ ─ ─ ─► respond

    One thread. Nothing frozen.


JSON crosses the wire as text

    JavaScript object          JSON string
    { name: "Rajan" }   ──────►  '{"name":"Rajan"}'
                       stringify

    { name: "Rajan" }   ◄──────  '{"name":"Rajan"}'
                          parse`,
      codeExample: {
        title: "Errors, promises, await and JSON",
        code: `// ── 1. try/catch and the Error object ────────────────────────
try {
  throw new Error("Database connection failed");
} catch (error) {
  console.log(error.name);        // Error
  console.log(error.message);     // Database connection failed
  // console.log(error.stack);    // where it happened
}

// throw an Error, never a string
// throw "oops";                 // no stack, no error.message

// ── 2. A promise, and the three handlers ─────────────────────
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 1) resolve({ id: 1, name: "Rajan" });
      else reject(new Error(\`No user with id \${id}\`));
    }, 50);
  });
}

fetchUser(1)
  .then((user) => console.log("then:", user.name))
  .catch((error) => console.log("catch:", error.message))
  .finally(() => console.log("finally: runs either way"));

// ── 3. The same thing with async/await ───────────────────────
async function getUser(id) {
  try {
    const user = await fetchUser(id);
    return user;
  } catch (error) {
    console.log("await catch:", error.message);
    return null;
  }
}

// an async function always returns a promise
const pending = getUser(1);       // Promise { <pending> }
const user = await getUser(1);    // { id: 1, name: "Rajan" }

console.log(await getUser(99));   // logs the error, returns null

// ── 4. JSON: the two functions that cross the wire ───────────
const record = { id: 1, name: "Rajan", age: 30 };

const json = JSON.stringify(record);
console.log(json);                // {"id":1,"name":"Rajan","age":30}

const parsed = JSON.parse(json);
console.log(parsed.name);         // Rajan

// what JSON cannot carry
const tricky = { when: new Date(), run: () => {}, missing: undefined };
console.log(JSON.stringify(tricky));
// {"when":"2026-01-01T00:00:00.000Z"}   ← function and undefined dropped,
//                                          Date became a string`,
      },
      keyTakeaways: [
        "Throw `new Error(...)`, never a bare string. You need `message`, `name` and `stack`.",
        "A Promise is `pending`, then either `fulfilled` or `rejected`. It settles exactly once.",
        "`async/await` is `.then()` chaining written top to bottom. Use `try/catch` for its errors.",
        "`await` pauses one function, not the process. Node keeps serving other work meanwhile.",
        "An `async` function always returns a Promise, so forgetting `await` gives you the Promise, not the value.",
        "`JSON.stringify()` goes out to the wire, `JSON.parse()` comes back in.",
        "JSON has no dates, functions or `undefined`. A `Date` survives a round trip only as a string.",
      ],
      commonMistakes: [
        "<b>Forgetting `await`</b> — you get `Promise { <pending> }` instead of the value, and the error usually surfaces somewhere far away.",
        "<b>Using `await` outside an `async` function</b> — a syntax error in most places. Wrap the code in an async function.",
        "<b>Rejecting with a string</b> — `reject(\"failed\")` gives your catch block no stack trace. Reject with an `Error`.",
        "<b>Awaiting in a loop when the calls are independent</b> — that runs them one after another. `Promise.all` runs them together.",
        "<b>Assuming `await` blocks the server</b> — it does not. That misunderstanding leads people to avoid async code for the wrong reason.",
        "<b>Calling `JSON.parse` on untrusted input without a `try/catch`</b> — malformed JSON throws and takes the request down with it.",
      ],
      quiz: [
        {
          question: "What does `await` actually pause?",
          options: [
            "The entire Node.js process",
            "Only the async function it is written in",
            "Every request currently in flight",
            "The event loop, until the promise settles",
          ],
          correctIndex: 1,
          explanation:
            "`await` suspends just that function. Node carries on with other requests, timers and callbacks, which is why one process can handle thousands of connections.",
        },
        {
          question: "You write `const user = getUser(1);` where `getUser` is `async`. What is in `user`?",
          options: [
            "The user object",
            "`undefined`",
            "A Promise",
            "A TypeError is thrown",
          ],
          correctIndex: 2,
          explanation:
            "An `async` function always returns a Promise. Without `await` you get the Promise itself, which is why `user.name` would be `undefined`.",
        },
        {
          question: "What happens to a `Date` when you `JSON.stringify` it and then `JSON.parse` it back?",
          options: [
            "It comes back as a `Date`",
            "It comes back as an ISO string",
            "It is dropped from the object",
            "It becomes a timestamp number",
          ],
          correctIndex: 1,
          explanation:
            "JSON has no date type. `stringify` converts a `Date` to an ISO string, and `parse` has no way of knowing it was ever a date, so you get a string back.",
        },
      ],
    },
    {
      id: "web-basics",
      title: "How the web works — requests, verbs, status codes, headers, cookies",
      durationMinutes: 12,
      explanation:
        "Node.js is mostly used to build servers, so you need a working picture of what a server actually receives and sends.\n\n---\n\n## The request/response cycle\n\n<b>HTTP</b> (the protocol clients and servers use to talk to each other).\n\nThe shape never changes: the client asks, the server answers, the connection is done.\n\n```text\nClient\n   ↓\nHTTP Request\n   ↓\nServer\n   ↓\nProcess request\n   ↓\nHTTP Response\n   ↓\nClient\n```\n\nWith a real database behind it:\n\n```text\nBrowser\n   ↓\nGET /users\n   ↓\nNode.js server\n   ↓\nDatabase\n   ↓\nNode.js server\n   ↓\nJSON response\n   ↓\nBrowser\n```\n\nThe key property: HTTP is <b>stateless</b>. The server does not remember the previous request. Anything it needs to know has to arrive with the request, in a cookie, a header or the body. That single fact is why sessions, tokens and cookies exist at all.\n\nYou do not need every HTTP detail yet. You need this cycle.\n\n---\n\n## HTTP verbs\n\n<b>HTTP verbs</b> (methods that say what the client wants to do).\n\n```text\nGET       Read data\nPOST      Create data\nPUT       Replace / update data\nPATCH     Partially update data\nDELETE    Delete data\n```\n\nA typical REST resource looks like this:\n\n```text\nGET    /users          list them\nPOST   /users          create one\nGET    /users/123      read one\nPATCH  /users/123      change some fields\nDELETE /users/123      remove one\n```\n\n`PUT` replaces the whole record. `PATCH` changes only the fields you send. In practice `PATCH` is what most APIs want.\n\n---\n\n## Status codes\n\n<b>Status codes</b> (numbers telling the client how the request went).\n\n### `2xx` success\n\n```text\n200 OK\n201 Created\n204 No Content\n```\n\n### `3xx` redirection\n\n```text\n301 Moved Permanently\n302 Found\n304 Not Modified\n```\n\n### `4xx` client error\n\n```text\n400 Bad Request\n401 Unauthorized\n403 Forbidden\n404 Not Found\n409 Conflict\n422 Unprocessable Content\n```\n\n### `5xx` server error\n\n```text\n500 Internal Server Error\n502 Bad Gateway\n503 Service Unavailable\n```\n\nThe split that matters: <b>`4xx` means the caller made a mistake, `5xx` means you did</b>.\n\nThe short list worth memorising:\n\n```text\n200 → success\n201 → created\n400 → bad request\n401 → not authenticated\n403 → authenticated, not allowed\n404 → not found\n500 → server error\n```\n\nThe `401` versus `403` distinction catches people out. `401` means \"I do not know who you are\". `403` means \"I know who you are, and you cannot do this\".\n\n---\n\n## Headers\n\n<b>Headers</b> (metadata travelling alongside a request or response).\n\n```http\nContent-Type: application/json\nAuthorization: Bearer token\n```\n\nThe ones you will meet immediately:\n\n```text\nContent-Type      what format the body is in\nAuthorization     who is making the request\nAccept            what format the client wants back\nCookie            data the browser is sending back\nCache-Control     how long this may be cached\nUser-Agent        what client is calling\n```\n\nThe body is just bytes. `Content-Type` is what tells the server to read those bytes as JSON.\n\n---\n\n## Cookies\n\n<b>Cookies</b> (small pieces of data the browser stores and sends back automatically).\n\n```text\nServer\n  ↓\nSet-Cookie\n  ↓\nBrowser stores cookie\n  ↓\nBrowser sends cookie on every later request\n  ↓\nServer\n```\n\nThey are how a stateless protocol manages to feel like it remembers you. Typical uses:\n\n• Login sessions\n• Authentication\n• Preferences\n• Tracking\n\nYou do not need to master cookies before starting Node. Just know what they are and the problem they solve.\n\n---\n\n## Client vs server\n\nThis distinction matters more than it sounds.\n\nThe <b>client</b> (whatever makes the request):\n\n```text\nBrowser\nMobile app\nReact application\nCLI tool\nAnother server\n```\n\nThe <b>server</b> (whatever receives and processes it):\n\n```text\nReact\n   ↓\nHTTP request\n   ↓\nNode.js\n   ↓\nDatabase\n```\n\nNode.js is what you use to build the <b>server side</b>. Anything you put there, including secrets and database credentials, stays private. Anything you put in the client is visible to anyone who opens developer tools.",
      diagram: `The cycle, every single time

    Browser                          Node.js server        Database
       │                                    │                  │
       │  GET /users                        │                  │
       │  Authorization: Bearer …           │                  │
       │ ─────────────────────────────────► │                  │
       │                                    │  find users      │
       │                                    │ ───────────────► │
       │                                    │ ◄─────────────── │
       │  200 OK                            │                  │
       │  Content-Type: application/json    │                  │
       │ ◄───────────────────────────────── │                  │

    HTTP is stateless. The next request starts from nothing.


Verbs on one resource

    GET    /users          list
    POST   /users          create        → 201 Created
    GET    /users/123      read one      → 200 or 404
    PUT    /users/123      replace all
    PATCH  /users/123      change some
    DELETE /users/123      remove        → 204 No Content


Status codes at a glance

    2xx   it worked
    3xx   look somewhere else
    4xx   the caller's fault      ← their bug
    5xx   the server's fault      ← your bug

    401  I don't know who you are
    403  I know, and you still can't


Cookies: how stateless feels stateful

    Server  ── Set-Cookie: session=abc ──►  Browser stores it
    Browser ── Cookie: session=abc ──────►  Server recognises you`,
      codeExample: {
        title: "What a request and response actually look like",
        code: `// ── A raw HTTP request, as the server receives it ────────────
//
// POST /users HTTP/1.1
// Host: api.example.com
// Content-Type: application/json
// Authorization: Bearer eyJhbGciOi...
// Content-Length: 52
//
// {"name":"Rajan","email":"rajan@example.com"}

// ── And the response it sends back ───────────────────────────
//
// HTTP/1.1 201 Created
// Content-Type: application/json
// Location: /users/123
//
// {"id":123,"name":"Rajan","email":"rajan@example.com"}

// ── The same conversation from the client side ───────────────
const response = await fetch("https://api.example.com/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",     // how to read my body
    Authorization: "Bearer eyJhbGciOi...",  // who I am
  },
  body: JSON.stringify({
    name: "Rajan",
    email: "rajan@example.com",
  }),
});

console.log(response.status);         // 201
console.log(response.ok);             // true for any 2xx

const created = await response.json();
console.log(created.id);              // 123

// ── Reading the status is how you decide what went wrong ─────
if (response.status === 401) {
  console.log("Not logged in");
} else if (response.status === 403) {
  console.log("Logged in, but not allowed");
} else if (response.status === 404) {
  console.log("No such resource");
} else if (response.status >= 500) {
  console.log("The server broke, not the request");
}

// ── Verbs, mapped to what they mean ──────────────────────────
// GET    /users        list
// POST   /users        create   → 201
// GET    /users/123    read     → 200 or 404
// PATCH  /users/123    update   → 200
// DELETE /users/123    remove   → 204`,
      },
      keyTakeaways: [
        "Client asks, server answers, connection closes. That cycle never changes.",
        "HTTP is <b>stateless</b>. Everything the server needs must arrive with the request.",
        "`GET` reads, `POST` creates, `PUT` replaces, `PATCH` changes some fields, `DELETE` removes.",
        "`4xx` is the caller's mistake, `5xx` is yours. That split drives how you handle errors.",
        "`401` is \"I do not know you\". `403` is \"I know you, and no\".",
        "`Content-Type` is what makes a body of bytes readable as JSON.",
        "Cookies are how a stateless protocol manages to remember a logged-in user.",
        "Server-side code and its secrets stay private. Anything in the client is public.",
      ],
      commonMistakes: [
        "<b>Returning `200` for everything</b> — clients rely on the status code. A created record should be `201`, a missing one `404`.",
        "<b>Mixing up `401` and `403`</b> — sending `403` to someone who never logged in leaves them with no idea they should sign in.",
        "<b>Using `GET` with a body</b> — most tools and proxies will drop it. Anything that changes data should be `POST`, `PATCH`, `PUT` or `DELETE`.",
        "<b>Sending JSON without `Content-Type: application/json`</b> — the server reads the body as plain text and your parsing fails.",
        "<b>Returning `500` for a validation problem</b> — that tells the caller your server is broken when their input was simply wrong. Use `400` or `422`.",
        "<b>Putting an API key in client-side code</b> — anyone can read it in developer tools. Secrets belong on the server.",
      ],
      quiz: [
        {
          question: "A logged-in user with a `viewer` role tries to delete another user. Which status code fits?",
          options: ["`400 Bad Request`", "`401 Unauthorized`", "`403 Forbidden`", "`500 Internal Server Error`"],
          correctIndex: 2,
          explanation:
            "`403` means the server knows who you are and is refusing anyway. `401` would be wrong here, because that says the caller has not identified themselves at all.",
        },
        {
          question: "What does it mean that HTTP is stateless?",
          options: [
            "The server cannot store data in a database",
            "Each request arrives with no memory of previous ones",
            "Responses cannot be cached",
            "Cookies are not allowed",
          ],
          correctIndex: 1,
          explanation:
            "The server starts fresh on every request. Anything it needs to know has to travel with that request, in a cookie, header or body. That is the whole reason sessions and tokens exist.",
        },
        {
          question: "Your endpoint creates a new user successfully. Which status code should it return?",
          options: ["`200 OK`", "`201 Created`", "`204 No Content`", "`302 Found`"],
          correctIndex: 1,
          explanation:
            "`201 Created` says a new resource now exists, usually alongside a `Location` header pointing at it. `200` is not wrong enough to break anything, but it tells the client less.",
        },
      ],
    },
    {
      id: "tools-terminal-git-sql",
      title: "Terminal, Git and SQL basics",
      durationMinutes: 10,
      explanation:
        "You do not need to be a DevOps expert before learning Node.js. You do need to be comfortable in a terminal, able to use Git without panic, and able to read a SQL query.\n\n---\n\n## Terminal\n\nEverything in Node happens here: running files, installing packages, starting servers, reading logs.\n\nThe navigation set:\n\n```bash\npwd          # where am I\nls           # what is here\ncd           # go somewhere\nmkdir        # make a folder\ntouch        # make an empty file\nrm           # delete\ncp           # copy\nmv           # move or rename\n```\n\nAnd running things:\n\n```bash\nnode app.js\n```\n\nEventually:\n\n```bash\nnpm install\nnpm run dev\n```\n\nTwo habits worth picking up early: `Ctrl` + `C` stops whatever is running, and the up arrow gets your last command back. You do not need to memorise every flag. You need to stop feeling lost in a shell.\n\n---\n\n## Git\n\n<b>Git</b> (a tool that records the history of your code so you can go back).\n\nThe everyday commands:\n\n```bash\ngit clone\ngit status\ngit add\ngit commit\ngit pull\ngit push\ngit branch\ngit merge\n```\n\nAnd the vocabulary behind them:\n\n```text\nRepository   the project and its whole history\nBranch       a separate line of work\nCommit       one saved snapshot, with a message\nMerge        bringing a branch back into another\nRemote       the copy that lives on GitHub\n```\n\n```text\nmain\n  │\n  ├── feature/users\n  │\n  └── feature/auth\n```\n\nA normal loop looks like: `git status` to see what changed, `git add` to stage it, `git commit` to save it, `git push` to send it. If you only learn one, learn `git status`. It tells you where you are whenever you get lost.\n\nAdvanced Git can wait.\n\n---\n\n## SQL basics\n\nThis Node course uses MongoDB, but SQL is worth reading anyway. The querying ideas are the same in both, and most backend jobs touch a relational database at some point.\n\n### `SELECT`\n\n```sql\nSELECT *\nFROM users;\n```\n\n`SELECT *` is fine while exploring. In real code, name the columns you actually need.\n\n### `WHERE`\n\n```sql\nSELECT *\nFROM users\nWHERE id = 10;\n```\n\n### `JOIN`\n\n```sql\nSELECT users.name, orders.id\nFROM users\nJOIN orders\n    ON orders.user_id = users.id;\n```\n\nA <b>join</b> stitches two tables together on a shared value. Here it is `orders.user_id` matching `users.id`.\n\n### Indexes\n\nAn <b>index</b> (a lookup structure that helps the database find rows without reading them all).\n\n```sql\nCREATE INDEX users_email_index\nON users(email);\n```\n\nThe idea in two lines:\n\n```text\nWithout an index\nDatabase → potentially scans every row\n\nWith an index\nDatabase → jumps almost straight to the matching rows\n```\n\nIt is the same trick as an index at the back of a book. And it is not free: every write has to update the index too, so you add them where you actually query, not everywhere.\n\nYou will go much deeper into databases during the course.",
      diagram: `The Git loop you will run every day

    working directory
          │  git add
          ↓
      staging area
          │  git commit
          ↓
     local history
          │  git push
          ↓
     remote (GitHub)

    Lost? git status tells you which step you are on.


Branches

    main ──●────●────────────●────►
            \\             /
             ●───●───●───●        feature/auth
              a branch, merged back in


A JOIN links two tables on a shared value

    users                     orders
    ┌────┬─────────┐          ┌────┬─────────┬────────┐
    │ id │ name    │          │ id │ user_id │ total  │
    ├────┼─────────┤          ├────┼─────────┼────────┤
    │ 1  │ Rajan   │◄────┐    │ 11 │    1    │  250   │
    │ 2  │ John    │     └────│ 12 │    1    │  120   │
    └────┴─────────┘          └────┴─────────┴────────┘
                   ON orders.user_id = users.id


Index: the book analogy

    no index    ──►  read page 1, 2, 3, 4 … until you find it
    index       ──►  look up "email" in the back, jump straight there

    Faster reads. Slightly slower writes. Add them where you query.`,
      codeExample: {
        title: "The commands and queries you should already recognise",
        code: `# ── Terminal: get around and run things ──────────────────────
pwd                      # where am I
ls -la                   # what is here, including dotfiles
cd my-api                # go into the project
mkdir src && touch src/app.js

node src/app.js          # run one file
npm install express      # add a dependency
npm run dev              # run a script from package.json

# Ctrl + C stops a running server. The up arrow recalls commands.


# ── Git: the everyday loop ───────────────────────────────────
git clone git@github.com:you/my-api.git
cd my-api

git status                       # what changed
git checkout -b feature/users    # new branch
git add src/users.js             # stage
git commit -m "Add users route"  # save a snapshot
git push -u origin feature/users # send it up

git pull                         # bring down others' work
git merge main                   # fold main into your branch


# ── SQL: read these without stopping ─────────────────────────
-- everything (fine for exploring, name columns in real code)
SELECT * FROM users;

-- one row, by id
SELECT id, name, email
FROM users
WHERE id = 10;

-- two tables, linked on a shared value
SELECT users.name, orders.id, orders.total
FROM users
JOIN orders ON orders.user_id = users.id
WHERE users.id = 10;

-- make lookups by email fast
CREATE INDEX users_email_index ON users(email);`,
      },
      keyTakeaways: [
        "You need to be comfortable in a terminal, not fluent in every flag.",
        "`Ctrl` + `C` stops a running process. The up arrow recalls your last command.",
        "The Git loop is `status` → `add` → `commit` → `push`. When lost, run `git status`.",
        "A branch is a separate line of work that you merge back when it is ready.",
        "A `JOIN` links two tables on a shared value, usually a foreign key matching an id.",
        "An index makes reads fast and writes slightly slower. Add them where you actually query.",
        "This course uses MongoDB, but the querying ideas carry straight over from SQL.",
      ],
      commonMistakes: [
        "<b>Running `npm install` in the wrong folder</b> — check `pwd` first. A stray `node_modules` in your home directory is a classic.",
        "<b>Committing `node_modules` or a `.env` file</b> — add both to `.gitignore` before your first commit.",
        "<b>Committing straight to `main` for everything</b> — branch per piece of work, even when you are the only person on the repo.",
        "<b>Writing vague commit messages</b> — \"fix\" tells future you nothing. Say what changed.",
        "<b>Shipping `SELECT *` in application code</b> — you pull columns you do not need and break silently when the schema changes.",
        "<b>Adding an index to every column</b> — each one slows writes down. Index what you query.",
      ],
      quiz: [
        {
          question: "In `JOIN orders ON orders.user_id = users.id`, what is the `ON` clause doing?",
          options: [
            "Filtering out rows with no orders",
            "Saying which columns connect the two tables",
            "Sorting the combined result",
            "Creating an index on `user_id`",
          ],
          correctIndex: 1,
          explanation:
            "`ON` names the shared value that links the rows: each order's `user_id` matches a user's `id`. Without it the database has no idea which rows belong together.",
        },
        {
          question: "What is the trade-off when you add a database index?",
          options: [
            "Reads get faster, writes get a little slower",
            "Writes get faster, reads get slower",
            "There is no trade-off, always index everything",
            "It only affects disk space",
          ],
          correctIndex: 0,
          explanation:
            "An index lets the database jump to matching rows instead of scanning, but every insert and update has to keep that index current. Add them where you actually query.",
        },
      ],
    },
    {
      id: "readiness-check",
      title: "Readiness check — can you read this code?",
      durationMinutes: 6,
      explanation:
        "## The check\n\nYou do not need to be perfect. You need to be able to look at this and follow what is happening:\n\n```javascript\nclass User {\n  #password;\n\n  constructor(name, password) {\n    this.name = name;\n    this.#password = password;\n  }\n\n  async getProfile() {\n    try {\n      const response = await fetch(\n        `/api/users/${this.name}`,\n      );\n\n      const data = await response.json();\n\n      return {\n        ...data,\n        name: this.name,\n      };\n    } catch (error) {\n      console.log(error.message);\n    }\n  }\n}\n```\n\nIf you can point at each piece and say roughly what it does, you are ready:\n\n```text\nclass                a blueprint for objects\nconstructor          runs on new\n#password            private to the class\nasync / await        asynchronous work, written top to bottom\ntry / catch          handling a failure\nfetch → Promise      a result that has not arrived yet\nresponse.json()      JSON string → JavaScript object\n{ ...data }          object spread\n`/api/users/${...}`  template literal\n```\n\nNotice you do not need to know a single Node.js API to read that. It is all JavaScript. That is the point of this phase.\n\n---\n\n## One important rule\n\n> If your JavaScript is shaky, do JavaScript first.\n\nNode.js is a <b>runtime for JavaScript</b>, not a replacement for it. Every confusing Node error you will hit is easier to read when the language underneath is solid.\n\nWhere this phase sits in the bigger picture:\n\n```text\nJavaScript\n    ↓\nLanguage fundamentals\n    ↓\nNode.js\n    ↓\nBackend programming\n    ↓\nAPIs\n    ↓\nDatabases\n    ↓\nAuthentication\n    ↓\nCaching\n    ↓\nQueues\n    ↓\nScaling\n    ↓\nProduction systems\n```\n\n---\n\n## What this phase was not\n\nIt was not meant to make you an expert. The goal was narrower:\n\n> Make sure JavaScript is no longer the thing stopping you from understanding Node.js.\n\nIf a topic here felt genuinely unfamiliar rather than just rusty, spend a day on it before Day 1. If it all read as \"yes, I know that\", start the course.\n\nYou do not need to know Node.js yet. That is what the rest of the track is for.",
      diagram: `Everything in the readiness snippet, labelled

    class User {
      #password                  ← private field
      constructor(name, pw) {    ← runs on new
        this.name = name
      }

      async getProfile() {       ← returns a Promise
        try {                    ← handle failure
          const res = await fetch(\`/api/users/\${this.name}\`)
                      │          │       └─ template literal
                      │          └─ returns a Promise
                      └─ pause THIS function only

          const data = await res.json()   ← JSON text → object

          return { ...data, name: this.name }
                   └─ spread, then override
        } catch (error) {
          console.log(error.message)      ← the Error object
        }
      }
    }

    Not one Node.js API in sight. It is all JavaScript.


Where you are

    JavaScript ──► Node.js ──► APIs ──► Databases ──► Auth
        ▲
        └─ you are finishing here
                    ▲
                    └─ Day 1 starts here`,
      codeExample: {
        title: "The readiness snippet, annotated",
        code: `class User {
  #password;                          // private: only this class can read it

  constructor(name, password) {       // runs when you call new User(...)
    this.name = name;
    this.#password = password;
  }

  async getProfile() {                // async → always returns a Promise
    try {                             // catch a failure instead of crashing
      const response = await fetch(   // await pauses THIS function only
        \`/api/users/\${this.name}\`,     // template literal builds the URL
      );

      const data = await response.json();   // JSON text → JS object

      return {
        ...data,                      // spread everything the API sent
        name: this.name,              // then override one field
      };
    } catch (error) {
      console.log(error.message);     // the Error object's description
    }
  }
}

// Using it
const user = new User("Rajan", "1234");
const profile = await user.getProfile();   // await, or you get a Promise

console.log(profile?.name ?? "unknown");   // safe read, then a fallback

// Nine JavaScript features, zero Node.js APIs:
//   class · constructor · #private · async/await · try/catch
//   Promise · JSON · object spread · template literal`,
      },
      keyTakeaways: [
        "If you can read the snippet above and name each piece, you are ready for Day 1.",
        "That whole example uses no Node.js APIs. It is pure JavaScript, which is exactly the point.",
        "Node.js is a <b>runtime</b> for JavaScript, not a different language and not a framework.",
        "Confusing Node errors get much easier to read once the language underneath is solid.",
        "If something here felt genuinely new rather than rusty, spend a day on it before starting.",
        "This phase is not part of the course and does not count toward your day progress.",
      ],
      commonMistakes: [
        "<b>Skipping this phase because Node looks like \"just JavaScript\"</b> — it is, which is exactly why shaky JavaScript shows up as confusing Node errors.",
        "<b>Trying to learn JavaScript and Node at the same time</b> — you end up unable to tell which layer a problem came from.",
        "<b>Waiting until you feel expert</b> — comfortable is enough. You will keep learning the language while you build.",
        "<b>Treating Node as a framework</b> — it is a runtime. Express is the framework, and it comes later in the track.",
      ],
      quiz: [
        {
          question: "In the readiness snippet, how many Node.js-specific APIs are used?",
          options: ["None, it is all JavaScript", "One, `fetch`", "Two, `fetch` and `JSON`", "Three or more"],
          correctIndex: 0,
          explanation:
            "Classes, private fields, async/await, try/catch, Promises, JSON, spread and template literals are all plain JavaScript. That is the whole message of Phase 0.",
        },
        {
          question: "What is the most accurate description of Node.js?",
          options: [
            "A JavaScript framework for building APIs",
            "A runtime that executes JavaScript outside the browser",
            "A different language with JavaScript-like syntax",
            "A replacement for JavaScript on the server",
          ],
          correctIndex: 1,
          explanation:
            "Node.js is a runtime. It runs the same JavaScript you already know, with APIs for files, networking and processes instead of the DOM. Express is the framework, and it comes later.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Which pair correctly describes what the three dots are doing?",
      options: [
        "`{ ...user }` collects, `function f(...args)` expands",
        "`{ ...user }` expands, `function f(...args)` collects",
        "Both expand",
        "Both collect",
      ],
      correctIndex: 1,
      explanation:
        "On the right of an assignment the dots expand (spread). On the left, or in a parameter list, they collect (rest). Same syntax, opposite jobs.",
    },
    {
      question: "`const port = config.port ?? 3000` where `config.port` is `0`. What is `port`?",
      options: ["`3000`", "`0`", "`undefined`", "A TypeError"],
      correctIndex: 1,
      explanation:
        "`??` only falls back on `null` and `undefined`, so a deliberate `0` survives. Writing `||` there would have thrown the `0` away and given you `3000`.",
    },
    {
      question: "A client sends a request with no credentials at all. Which status code should the server return?",
      options: ["`400 Bad Request`", "`401 Unauthorized`", "`403 Forbidden`", "`404 Not Found`"],
      correctIndex: 1,
      explanation:
        "`401` means the server does not know who the caller is. `403` is for a caller it does recognise but is refusing anyway.",
    },
    {
      question: "While one request is sitting at `await db.findUser()`, what is the Node process doing?",
      options: [
        "Blocking, until the database answers",
        "Spawning a new thread for the next request",
        "Handling other requests, timers and callbacks",
        "Queueing every other request until this one finishes",
      ],
      correctIndex: 2,
      explanation:
        "`await` suspends only that function. Node carries on with everything else on one thread, which is why a single process can serve thousands of connections.",
    },
    {
      question: "Which of these is <b>not</b> something Phase 0 asks you to be comfortable with?",
      options: [
        "Reading a SQL `JOIN`",
        "`async/await` and `try/catch`",
        "The Node.js event loop phases",
        "`git status`, `git add`, `git commit`",
      ],
      correctIndex: 2,
      explanation:
        "The event loop is taught inside the course, starting on Day 1. Phase 0 only covers the JavaScript, web and tooling you need before that.",
    },
  ],
};
