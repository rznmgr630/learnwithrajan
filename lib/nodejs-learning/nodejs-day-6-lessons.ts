import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_6_LESSONS: LessonDay = {
  day: 6,
  title: "Files and paths",
  totalMinutes: 92,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "fs-promises",
      title: "node:fs/promises, and the three API forms",
      durationMinutes: 10,
      explanation:
        "Node is often used for work that touches the filesystem:\n\n• Read configuration files\n• Upload and download files\n• Generate reports\n• Process CSV and JSON files\n• Create directories\n• Copy or delete files\n• Watch files for changes\n• Work with temporary files\n\nThe rule for modern Node:\n\n> <b>Prefer the promise-based filesystem API, `node:fs/promises`.</b>\n\n---\n\n## Importing it\n\n```javascript\nimport fs from \"node:fs/promises\";\n```\n\nor:\n\n```javascript\nimport { readFile, writeFile } from \"node:fs/promises\";\n```\n\nWhy this one? Because filesystem operations take time, and Node should not sit still while they happen:\n\n```text\nNode.js\n   ↓\nAsk operating system for file\n   ↓\nContinue doing other work\n   ↓\nPromise resolves when file is ready\n```\n\nThat is Day 3's whole point applied to disk. Waiting overlaps, so a server can serve other requests while the OS fetches your file.\n\n---\n\n## Three versions of the same operation\n\nMost filesystem calls exist in three forms:\n\n```text\nSynchronous\nCallback\nPromise\n```\n\n```text\nreadFileSync()\nreadFile(callback)\nawait readFile()\n```\n\nWorth knowing because they live in <b>different modules</b>, which is the part that catches people. `node:fs` has the sync and callback forms. `node:fs/promises` has the promise form. Same function name, different import.\n\n### Synchronous\n\n```javascript\nimport fs from \"node:fs\";\n\nconst data = fs.readFileSync(\"config.json\");\n\nconsole.log(data);\n```\n\nThe application waits:\n\n```text\nreadFileSync()\n      ↓\nWait\n      ↓\nFile loaded\n      ↓\nContinue\n```\n\nThe JavaScript thread is blocked for the whole read.\n\n### Callback\n\n```javascript\nimport fs from \"node:fs\";\n\nfs.readFile(\"config.json\", (error, data) => {\n  if (error) {\n    console.error(error);\n    return;\n  }\n\n  console.log(data);\n});\n```\n\nThis does not block, but callbacks are awkward to compose once you have more than one.\n\n### Promise\n\n```javascript\nimport fs from \"node:fs/promises\";\n\nconst data = await fs.readFile(\"config.json\");\n\nconsole.log(data);\n```\n\nThis is the one to reach for.\n\n```text\nfs/promises\n    ↓\nPromise\n    ↓\nawait\n    ↓\nSimple async code\n```\n\n---\n\n## When is sync acceptable?\n\nSynchronous calls are not always wrong. They are fine where nothing else is waiting:\n\n```text\nSmall startup scripts\nCLI tools\nOne-time scripts\nBuild scripts\nApplication startup\n```\n\nSo this at startup is perfectly reasonable:\n\n```javascript\nconst config = fs.readFileSync(\"config.json\");\n```\n\nBut not inside request handling:\n\n```javascript\napp.get(\"/users\", () => {\n  fs.readFileSync(\"huge-file.json\");\n});\n```\n\n```text\nHTTP request\n     ↓\nreadFileSync()\n     ↓\nEvent loop blocked\n     ↓\nOther requests wait\n```\n\nThat is Day 4's blocking lesson with a concrete cause. The test is not \"is sync bad\", it is <b>is anything else waiting on this thread</b>. At startup, nothing is. Once you are serving traffic, everything is.",
      diagram: `Same function, three forms, two modules

    node:fs                    node:fs/promises
    ├── readFileSync()         └── readFile()      ← use this
    └── readFile(callback)

    the module you import decides which form you get


Why promises, in one picture

    SYNC                      PROMISE
    ██ read ████████ done     ██ start ─ ─ ─ ─ ██ done
       thread held               thread free while
       for the whole read        the OS does the work
                                 │
    other requests wait          other requests served


The test for whether sync is OK

    "Is anything else waiting on this thread?"
                    │
         ┌──────────┴──────────┐
        NO                    YES
         │                      │
    startup, CLI,          request handler,
    build script,          anything serving
    one-off script         traffic
         │                      │
    sync is fine           sync blocks EVERY
                           queued request`,
      codeExample: {
        title: "The three forms, and where each belongs",
        code: `// ── SYNC: node:fs. fine at startup, never in a handler ──────
import fsSync from "node:fs";

const config = fsSync.readFileSync("package.json", "utf8");
console.log(JSON.parse(config).name);
//
// Nothing else is waiting during startup, so blocking costs
// nothing. Put this inside a route handler and every queued
// request pays for the read.


// ── CALLBACK: node:fs. older code, still everywhere ─────────
fsSync.readFile("package.json", "utf8", (error, data) => {
  if (error) {
    console.error(error.message);
    return;                        // ← Day 4: without this,
  }                                //   data is undefined below
  console.log(JSON.parse(data).name);
});


// ── PROMISE: node:fs/promises. the default choice ───────────
import fs from "node:fs/promises";

const data = await fs.readFile("package.json", "utf8");
console.log(JSON.parse(data).name);

// or import just what you need
import { readFile } from "node:fs/promises";
console.log((await readFile("package.json", "utf8")).length);


// ── The module split is the thing people trip on ────────────
// import fs from "node:fs";
// await fs.readFile("x.txt");        ✗ this is the callback
//                                      form. It returns
//                                      undefined and never
//                                      resolves.
//
// import fs from "node:fs/promises";
// await fs.readFile("x.txt");        ✓
//
// Same name, different module. If an await on a fs call
// hangs or gives you undefined, check the import first.


// ── Reading many files: waiting overlaps ────────────────────
const [a, b, c] = await Promise.all([
  readFile("package.json", "utf8"),
  readFile("tsconfig.json", "utf8").catch(() => "{}"),
  readFile("README.md", "utf8").catch(() => ""),
]);
console.log(a.length, b.length, c.length);
// three reads in flight at once, not one after another`,
      },
      keyTakeaways: [
        "Prefer `node:fs/promises` for anything in a running application.",
        "Filesystem work is waiting, and waiting overlaps. Day 3's rule applied to disk.",
        "Every operation has three forms: sync, callback, promise.",
        "They live in <b>different modules</b>. `node:fs` has sync and callback, `node:fs/promises` has the promise form.",
        "Same function name in both, so `await` on a `node:fs` call gives you `undefined` and never resolves.",
        "Sync is fine where nothing else waits: startup, CLI tools, build scripts, one-off scripts.",
        "Sync in a request handler blocks every queued request, not just its own.",
        "The test is not \"is sync bad\", it is <b>is anything else waiting on this thread</b>.",
      ],
      commonMistakes: [
        "<b>Awaiting a `node:fs` call</b> — that is the callback form. You get `undefined` and the await never resolves. Check the import.",
        "<b>Using a `*Sync` call inside a route handler</b> — it holds the thread for every queued request too.",
        "<b>Awaiting file reads one at a time when they are independent</b> — `Promise.all` overlaps the waiting.",
        "<b>Assuming sync is always wrong</b> — at startup nothing is waiting, so it is simpler and costs nothing.",
        "<b>Importing both `node:fs` and `node:fs/promises` as `fs`</b> — pick distinct names, or you will call the wrong one.",
      ],
      quiz: [
        {
          question: "You write `import fs from \"node:fs\"` then `await fs.readFile(\"x.txt\")`. What happens?",
          options: [
            "It works, both modules return promises",
            "You get `undefined` and the await never resolves, because that is the callback form",
            "A TypeError about a missing callback",
            "It reads the file synchronously",
          ],
          correctIndex: 1,
          explanation:
            "The promise version lives in `node:fs/promises`. The `node:fs` one expects a callback and returns nothing, so awaiting it gives `undefined`. If an await on a fs call hangs, check the import first.",
        },
        {
          question: "What is the right test for whether a synchronous filesystem call is acceptable?",
          options: [
            "Whether the file is small",
            "Whether anything else is waiting on the thread",
            "Whether you are in production",
            "Whether the call is inside a try/catch",
          ],
          correctIndex: 1,
          explanation:
            "At startup or in a CLI script nothing is queued, so blocking costs nothing. Once you are serving traffic, a sync read adds its full duration to every request waiting behind it.",
        },
      ],
    },
    {
      id: "read-write-append",
      title: "readFile, writeFile and appendFile",
      durationMinutes: 10,
      explanation:
        "The three operations you will use most.\n\n---\n\n## `readFile()`\n\n<b>`readFile()`</b> (reads the contents of a file).\n\n```javascript\nimport { readFile } from \"node:fs/promises\";\n\nconst data = await readFile(\"hello.txt\", \"utf8\");\n\nconsole.log(data);\n```\n\nWithout the encoding:\n\n```javascript\nconst data = await readFile(\"hello.txt\");\n```\n\nyou get a:\n\n```text\nBuffer\n```\n\nWith `\"utf8\"` you get a:\n\n```text\nstring\n```\n\nThat difference bites in a specific way. A `Buffer` logs as `<Buffer 48 65 6c 6c 6f>` rather than your text, and `JSON.parse` on one happens to work because it coerces to a string first, so the mistake hides until you try something like `data.trim()` or `data.split(\"\\n\")` and get a confusing error. Pass the encoding whenever you want text.\n\nA `Buffer` is the right choice for binary: images, PDFs, anything you are just moving from one place to another.\n\nAnd the size point: `readFile` loads the <b>whole file into memory</b>. Fine for a config file, a bad idea for a 2GB log. Streams are the answer there, and they come later in the track.\n\n---\n\n## `writeFile()`\n\n<b>`writeFile()`</b> (creates or replaces a file with the given contents).\n\n```javascript\nimport { writeFile } from \"node:fs/promises\";\n\nawait writeFile(\n  \"hello.txt\",\n  \"Hello Rajan!\"\n);\n```\n\nIf the file does not exist:\n\n```text\nCreate it\n```\n\nIf it does:\n\n```text\nReplace its contents\n```\n\nRead that second line again, because it is a truncating write with no warning and no confirmation. There is no \"only if it does not exist\" by default. If you want that, pass a flag:\n\n```javascript\nawait writeFile(\"hello.txt\", \"content\", { flag: \"wx\" });\n```\n\n`wx` fails with `EEXIST` instead of overwriting.\n\nOne more thing that surprises people: `writeFile` will not create missing directories. Writing to `data/out/report.json` when `data/out` does not exist fails with `ENOENT`, which reads oddly for a write. You have to `mkdir` first.\n\n---\n\n## `appendFile()`\n\n<b>`appendFile()`</b> (adds data to the end of a file).\n\n```javascript\nimport { appendFile } from \"node:fs/promises\";\n\nawait appendFile(\n  \"app.log\",\n  \"Server started\\n\"\n);\n```\n\nSo if `app.log` holds:\n\n```text\nServer started\n```\n\nafter another append it holds:\n\n```text\nServer started\nServer started\n```\n\nUseful for simple logs and text files. Note the `\\n` is yours to add. `appendFile` writes exactly the bytes you give it, so forget the newline and your log becomes one very long line.\n\nIt also creates the file if it is missing, which makes it the safer default when you are not sure whether something exists yet.",
      diagram: `The encoding argument changes the type

    readFile("hello.txt")            →  Buffer
                                        <Buffer 48 65 6c 6c 6f>
    readFile("hello.txt", "utf8")    →  string
                                        "Hello"

    the Buffer mistake hides:
      JSON.parse(buffer)    works    (coerces to string)
      buffer.trim()         fails    confusing error, far
                                     from the missing arg

    Buffer is right for binary: images, PDFs, pass-through


writeFile REPLACES, silently

    file exists                      file missing
    ┌──────────────────┐             ┌──────────────────┐
    │ 5000 lines       │  writeFile  │ (nothing)        │
    │ of data          │  ─────────► │                  │
    └──────────────────┘   "hi"      └──────────────────┘
              │                               │
         all gone, no warning            created
              │
    want "only if new"?
      { flag: "wx" }  →  EEXIST instead of overwriting


writeFile does not create directories

    writeFile("data/out/report.json", body)
                    └─ missing
      ENOENT: no such file or directory

    reads oddly for a WRITE. mkdir first.


write vs append

    writeFile   replace everything      config, generated output
    appendFile  add to the end          logs, accumulating text
                creates if missing      the safer default`,
      codeExample: {
        title: "Reading and writing, with the traps",
        code: `import { readFile, writeFile, appendFile, mkdir } from "node:fs/promises";

// ── Encoding decides the type ───────────────────────────────
await writeFile("hello.txt", "Hello Rajan!");

const buf = await readFile("hello.txt");
const str = await readFile("hello.txt", "utf8");

console.log(buf);                      // <Buffer 48 65 6c ...>
console.log(str);                      // Hello Rajan!
console.log(typeof buf, typeof str);   // object string

// the mistake that hides:
console.log(JSON.parse('{"a":1}'));    // works on a string
// JSON.parse(bufferOfJson)            // ALSO works (coerces)
// bufferOfJson.trim()                 // ✗ not a function
//   → the missing encoding surfaces far from where it happened


// ── writeFile replaces, with no warning ─────────────────────
await writeFile("notes.txt", "line one\\nline two\\n");
await writeFile("notes.txt", "replaced");
console.log(await readFile("notes.txt", "utf8"));   // "replaced"
//   the first two lines are gone

// want "only if it does not exist"?
try {
  await writeFile("notes.txt", "again", { flag: "wx" });
} catch (error) {
  console.log(error.code);             // EEXIST
}


// ── writeFile does not create directories ───────────────────
try {
  await writeFile("data/out/report.json", "{}");
} catch (error) {
  console.log(error.code);             // ENOENT, on a WRITE
}

await mkdir("data/out", { recursive: true });
await writeFile("data/out/report.json", JSON.stringify({ ok: true }));


// ── appendFile: the newline is yours ────────────────────────
await appendFile("app.log", "Server started\\n");
await appendFile("app.log", "Request handled\\n");
console.log(await readFile("app.log", "utf8"));
// Server started
// Request handled
//
// drop the \\n and it becomes one very long line.
// appendFile also creates the file if missing, which makes
// it the safer default when you are not sure.


// ── readFile loads the WHOLE file into memory ───────────────
// const log = await readFile("access-2gb.log", "utf8");
//   fine for a config file. a bad idea here.
//   large files want streams, later in the track.`,
      },
      keyTakeaways: [
        "`readFile(path)` gives a `Buffer`. `readFile(path, \"utf8\")` gives a string.",
        "The missing-encoding bug hides: `JSON.parse` works on a Buffer, but `.trim()` and `.split()` do not.",
        "`Buffer` is the right choice for binary you are only moving around.",
        "`readFile` loads the <b>entire file into memory</b>. Fine for config, wrong for a 2GB log.",
        "`writeFile` <b>replaces</b> an existing file silently. No warning, no confirmation.",
        "`{ flag: \"wx\" }` makes it fail with `EEXIST` instead of overwriting.",
        "`writeFile` does not create missing directories. You get `ENOENT` on a write, which reads oddly.",
        "`appendFile` adds to the end and creates the file if missing.",
        "The newline in an append is yours to add. Forget it and the log becomes one line.",
      ],
      commonMistakes: [
        "<b>Forgetting `\"utf8\"` when you wanted text</b> — you get a Buffer, and the failure shows up somewhere unrelated.",
        "<b>Using `writeFile` when you meant `appendFile`</b> — the previous contents are gone, silently.",
        "<b>Writing into a directory that does not exist</b> — `ENOENT`. `mkdir` with `recursive: true` first.",
        "<b>Forgetting the newline in `appendFile`</b> — every log entry runs together.",
        "<b>`readFile` on a very large file</b> — the whole thing goes into memory. Use a stream.",
        "<b>Assuming `writeFile` refuses to overwrite</b> — it truncates by default. Pass `flag: \"wx\"` if you need otherwise.",
      ],
      quiz: [
        {
          question: "You call `readFile(\"data.json\")` without an encoding and `JSON.parse` works fine, but `data.trim()` throws. Why?",
          options: [
            "The file has trailing whitespace",
            "You have a Buffer. `JSON.parse` coerces it to a string, but `trim` is not a Buffer method",
            "`trim` needs an argument",
            "The JSON was invalid",
          ],
          correctIndex: 1,
          explanation:
            "Without an encoding you get a Buffer. `JSON.parse` happens to work because it stringifies its input first, which hides the mistake until you call a string method.",
        },
        {
          question: "`writeFile(\"notes.txt\", \"hi\")` on a file that already holds 5000 lines. What happens?",
          options: [
            "The text is appended",
            "An EEXIST error",
            "The file is replaced with `hi`, silently",
            "Node prompts before overwriting",
          ],
          correctIndex: 2,
          explanation:
            "`writeFile` truncates by default, with no warning. `appendFile` adds to the end, and `{ flag: \"wx\" }` makes the write fail rather than overwrite.",
        },
        {
          question: "`writeFile(\"data/out/report.json\", body)` fails with `ENOENT`. Why does a write give a not-found error?",
          options: [
            "The file must exist before you can write it",
            "The `data/out` directory does not exist, and `writeFile` will not create it",
            "The path needs to be absolute",
            "`ENOENT` means the disk is full",
          ],
          correctIndex: 1,
          explanation:
            "The missing thing is the directory, not the file. `mkdir` with `recursive: true` first, then write.",
        },
      ],
    },
    {
      id: "directories",
      title: "mkdir and readdir",
      durationMinutes: 10,
      explanation:
        "Creating directories, and looking inside them.\n\n---\n\n## `mkdir()`\n\n<b>`mkdir()`</b> (creates a directory).\n\n```javascript\nimport { mkdir } from \"node:fs/promises\";\n\nawait mkdir(\"uploads\");\n```\n\nIf parents might be missing:\n\n```javascript\nawait mkdir(\"data/uploads/images\", {\n  recursive: true\n});\n```\n\n`recursive: true` means the whole chain gets created:\n\n```text\ndata/\n  ↓\nuploads/\n  ↓\nimages/\n```\n\nThere is a second reason to reach for `recursive: true` almost always, and it is the useful one: <b>it does not fail if the directory already exists</b>. Without it you get `EEXIST` and have to wrap every `mkdir` in a try/catch just to ignore an error you do not care about. With it, `mkdir` becomes \"make sure this directory exists\", which is what you wanted.\n\n---\n\n## `readdir()`\n\n<b>`readdir()`</b> (reads the contents of a directory).\n\n```javascript\nconst files = await readdir(\"uploads\");\n\nconsole.log(files);\n```\n\n```javascript\n[\n  \"photo.jpg\",\n  \"resume.pdf\",\n  \"avatar.png\"\n]\n```\n\nStrings, and only names. Not paths. That trips people constantly: to do anything with an entry you have to rebuild the path yourself with `path.join(dir, name)`, which the next lessons cover.\n\n---\n\n## `withFileTypes`\n\nYou can ask Node to tell you what each entry is:\n\n```javascript\nconst entries = await readdir(\"uploads\", {\n  withFileTypes: true\n});\n```\n\n```javascript\nfor (const entry of entries) {\n  if (entry.isDirectory()) {\n    console.log(\"Directory:\", entry.name);\n  }\n\n  if (entry.isFile()) {\n    console.log(\"File:\", entry.name);\n  }\n}\n```\n\nVery useful for walking directories recursively.\n\nThe reason it matters is efficiency. The alternative is calling `stat` on every single entry to find out whether it is a directory, which is one filesystem round trip per item. `withFileTypes` gets the same information from the directory read you were already doing. On a large tree that is the difference between fast and noticeably slow.\n\nYou get a `Dirent`, which has `name`, `isFile()`, `isDirectory()` and `isSymbolicLink()`. On recent Node it also has `parentPath`, so you can build the full path without tracking it yourself.\n\n---\n\n## Walking a tree\n\nThe pattern you will write over and over:\n\n```javascript\nasync function walk(dir) {\n  const entries = await readdir(dir, { withFileTypes: true });\n\n  for (const entry of entries) {\n    const full = path.join(dir, entry.name);\n\n    if (entry.isDirectory()) {\n      await walk(full);\n    } else {\n      console.log(full);\n    }\n  }\n}\n```\n\nTwo things about that. It recurses, so a deeply nested tree could in principle blow the stack, though in practice you hit directory-depth limits first. And it follows whatever the filesystem gives you, so a <b>symlink loop</b> is a real way to hang forever. Check `isSymbolicLink()` and skip if you are walking anything you do not control.\n\n`readdir` also takes `recursive: true`, which does the walking for you and returns relative paths. Convenient, but you lose the chance to skip `node_modules` on the way down, so a hand-written walk is usually better for real work.",
      diagram: `readdir gives NAMES, not paths

    readdir("uploads")
      → ["photo.jpg", "resume.pdf", "avatar.png"]
              │
              └─ just the name. to use it:
                 path.join("uploads", "photo.jpg")


withFileTypes saves a round trip per entry

    WITHOUT                          WITH
    readdir(dir)                     readdir(dir, {
      → names                          withFileTypes: true })
          │                              → Dirent objects
    for each name:                           │
      stat(join(dir, name))          entry.isDirectory()
          │                                  │
    one filesystem call              already known, no extra
    PER ENTRY                        call at all

    on a large tree that is the difference between
    fast and noticeably slow


recursive: true means two useful things

    mkdir("a/b/c", { recursive: true })

    1. creates the whole chain      a/ → b/ → c/
    2. does NOT fail if it exists   no EEXIST to catch

    so mkdir becomes "make sure this exists",
    which is what you actually wanted


Walking a tree, and the two hazards

    walk(dir)
      readdir(dir, { withFileTypes: true })
        for each entry
          isDirectory() → walk(join(dir, entry.name))
          else          → handle the file

    hazard 1  deep recursion, in theory
    hazard 2  a SYMLINK LOOP hangs forever
              check isSymbolicLink() on anything
              you do not control`,
      codeExample: {
        title: "Creating directories and walking a tree",
        code: `import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

// ── mkdir: recursive means two useful things ────────────────
await mkdir("demo/src/utils", { recursive: true });
await mkdir("demo/src/utils", { recursive: true });   // no error
//
// 1. creates the whole chain
// 2. does not fail if it already exists
//
// without it:
// await mkdir("demo/src/utils");     ✗ EEXIST second time,
//                                       and ENOENT the first
//                                       if demo/src is missing

await writeFile("demo/index.js", "a");
await writeFile("demo/src/app.js", "bb");
await writeFile("demo/src/utils/help.js", "ccc");


// ── readdir gives names, not paths ──────────────────────────
console.log(await readdir("demo"));
// [ 'index.js', 'src' ]
//   just names. "src" alone is not a usable path.


// ── withFileTypes: no stat call per entry ───────────────────
const entries = await readdir("demo", { withFileTypes: true });

for (const entry of entries) {
  if (entry.isDirectory()) console.log("dir :", entry.name);
  if (entry.isFile()) console.log("file:", entry.name);
}
// dir : src
// file: index.js
//
// the alternative is stat() on every entry, which is one
// filesystem round trip each. On a big tree that is slow.


// ── The walk you will write over and over ───────────────────
const SKIP = new Set(["node_modules", ".git", "dist"]);

async function walk(dir, onFile) {
  const items = await readdir(dir, { withFileTypes: true });

  for (const item of items) {
    if (SKIP.has(item.name)) continue;
    if (item.isSymbolicLink()) continue;     // a loop hangs forever

    const full = path.join(dir, item.name);

    if (item.isDirectory()) await walk(full, onFile);
    else if (item.isFile()) await onFile(full);
  }
}

await walk("demo", (file) => console.log("found:", file));
// found: demo/index.js
// found: demo/src/app.js
// found: demo/src/utils/help.js


// ── readdir can recurse for you ─────────────────────────────
console.log(await readdir("demo", { recursive: true }));
// [ 'index.js', 'src', 'src/app.js', 'src/utils', ... ]
//
// convenient, but you cannot skip node_modules on the way
// down. For real work the hand-written walk is usually better.`,
      },
      keyTakeaways: [
        "`mkdir(path, { recursive: true })` creates the whole chain of parents.",
        "It also <b>does not fail when the directory exists</b>, which turns `mkdir` into \"make sure this exists\".",
        "Without `recursive`, you get `EEXIST` and end up catching an error you do not care about.",
        "`readdir` returns <b>names, not paths</b>. Rebuild with `path.join(dir, name)`.",
        "`withFileTypes: true` gives `Dirent` objects with `isFile()`, `isDirectory()` and `isSymbolicLink()`.",
        "It saves a `stat` call per entry, which is one filesystem round trip each. That matters on a large tree.",
        "The recursive walk pattern is: readdir with file types, join the path, recurse on directories.",
        "A <b>symlink loop will hang your walk forever</b>. Skip symlinks in anything you do not control.",
        "`readdir(dir, { recursive: true })` walks for you, but you lose the chance to skip `node_modules`.",
      ],
      commonMistakes: [
        "<b>Treating a `readdir` result as a path</b> — it is a bare name. `readFile(\"photo.jpg\")` looks in the working directory, not the folder you listed.",
        "<b>Omitting `recursive: true` on `mkdir`</b> — `EEXIST` on a directory that already exists, which you then have to catch and ignore.",
        "<b>Calling `stat` on every entry to check if it is a directory</b> — `withFileTypes` already told you, for free.",
        "<b>Walking a tree without skipping symlinks</b> — one loop and your program never finishes.",
        "<b>Walking into `node_modules`</b> — thousands of files nobody asked about. Skip it explicitly.",
        "<b>Assuming `readdir` order means anything</b> — it is filesystem order, not sorted. Sort it yourself if you care.",
      ],
      quiz: [
        {
          question: "Why is `withFileTypes: true` worth using on a large directory tree?",
          options: [
            "It sorts the entries",
            "It avoids a separate `stat` call per entry, which is one filesystem round trip each",
            "It returns absolute paths",
            "It skips hidden files",
          ],
          correctIndex: 1,
          explanation:
            "The directory read already knows what each entry is, so asking for `Dirent` objects gets you `isDirectory()` for nothing. The alternative costs one round trip per item.",
        },
        {
          question: "Besides creating parent directories, what does `{ recursive: true }` do for `mkdir`?",
          options: [
            "It sets permissions",
            "It does not fail when the directory already exists",
            "It creates the file too",
            "It follows symlinks",
          ],
          correctIndex: 1,
          explanation:
            "That is often the real reason to pass it. Without it you get `EEXIST` and have to wrap the call in a try/catch to ignore an error that does not matter.",
        },
        {
          question: "What is the practical hazard of a recursive directory walk on a tree you do not control?",
          options: [
            "It is slower than `readdir` with `recursive: true`",
            "A symlink loop makes it run forever",
            "It cannot read hidden files",
            "It returns names in the wrong order",
          ],
          correctIndex: 1,
          explanation:
            "A symlink pointing back up the tree gives you an infinite descent. Checking `isSymbolicLink()` and skipping is the cheap guard.",
        },
      ],
    },
    {
      id: "rm-cp-stat",
      title: "rm, cp and stat",
      durationMinutes: 10,
      explanation:
        "Deleting, copying, and asking about a file.\n\n---\n\n## `rm()`\n\n<b>`rm()`</b> (removes files or directories).\n\n```javascript\nawait rm(\"old-file.txt\");\n```\n\nFor a directory with contents:\n\n```javascript\nawait rm(\"old-folder\", {\n  recursive: true,\n  force: true\n});\n```\n\nBe careful with this one. You are deleting data, and there is no undo.\n\nWorth knowing exactly what those two options do, because they are easy to reach for together without thinking:\n\n`recursive: true` allows deleting a non-empty directory. Without it you get `ERR_FS_EISDIR`.\n\n`force: true` ignores a missing path. Without it a nonexistent file is `ENOENT`.\n\nSo `{ recursive: true, force: true }` is `rm -rf`, and it deserves the same caution. The specific danger is a path built from a variable that turns out empty or unexpected, which is how people delete more than they meant to. Resolve the path, check it is inside where you expect, and only then delete. The traversal lesson later covers exactly that check.\n\n`force` on its own is genuinely useful though: \"delete this if it is there\" without a try/catch around a missing file.\n\n---\n\n## `cp()`\n\n<b>`cp()`</b> (copies a file or directory).\n\n```javascript\nawait cp(\n  \"original.txt\",\n  \"backup.txt\"\n);\n```\n\nDirectories too:\n\n```javascript\nawait cp(\n  \"source\",\n  \"backup\",\n  { recursive: true }\n);\n```\n\n```text\nsource\n  ↓\ncp()\n  ↓\ndestination\n```\n\nIt overwrites by default, same as `writeFile`. `{ force: false }` makes it skip existing files instead, and `{ errorOnExist: true }` makes it fail.\n\n---\n\n## `stat()`\n\n<b>`stat()`</b> (gets information about a filesystem entry).\n\n```javascript\nconst stats = await fs.stat(\"photo.jpg\");\n\nconsole.log(stats.size);\n```\n\nWhat you can ask:\n\n```javascript\nconsole.log(stats.isFile());\nconsole.log(stats.isDirectory());\nconsole.log(stats.size);\nconsole.log(stats.mtime);\n```\n\n```text\nisFile()\n    ↓\ntrue\n\nsize\n    ↓\n245678 bytes\n\nmtime\n    ↓\nlast modification time\n```\n\nTwo notes. `size` is in <b>bytes</b>, always, so any human-readable output is your job. And `stat` <b>follows symlinks</b>, reporting on the target. If you want the link itself, that is `lstat`, which is the same reason a tree walk needs `isSymbolicLink()`.\n\nThe timestamps are worth knowing apart: `mtime` is when the contents last changed, `ctime` is when the metadata last changed, and `birthtime` is when the file was created. For \"has this changed since I last looked\", `mtime` is the one, though it is a weak signal because it has second-level granularity on some filesystems and can be set by hand.",
      diagram: `rm: what each option actually allows

    rm("file.txt")                  a file. that is all.

    recursive: true    allows a NON-EMPTY directory
                       without it: ERR_FS_EISDIR

    force: true        ignores a MISSING path
                       without it: ENOENT

    { recursive: true, force: true }  =  rm -rf
                                         same caution

    the real danger is a path from a variable:

      const dir = userInput          ""  or  ".."  or  "/"
      await rm(dir, { recursive: true, force: true })
                │
                └─ resolve it, check it is where you
                   expect, THEN delete


stat follows symlinks. lstat does not.

    link.txt ──► target.txt (500 bytes)

    stat("link.txt").size    →  500    the TARGET
    lstat("link.txt").size   →  12     the LINK itself

    same reason a tree walk needs isSymbolicLink()


The three timestamps

    mtime       contents last changed     ← "has it changed?"
    ctime       metadata last changed
    birthtime   file created

    mtime is a weak signal: second-level granularity on
    some filesystems, and it can be set by hand


size is always bytes

    stats.size  →  245678
                   │
                   formatting is your job`,
      codeExample: {
        title: "Delete, copy, inspect",
        code: `import { rm, cp, stat, mkdir, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

await mkdir("demo/src", { recursive: true });
await writeFile("demo/a.txt", "hello");
await writeFile("demo/src/b.txt", "world!");


// ── rm: the two options, and what each allows ───────────────
await rm("demo/a.txt");                       // a plain file

// a non-empty directory needs recursive
try {
  await rm("demo/src");
} catch (error) {
  console.log(error.code);                    // ERR_FS_EISDIR
}

// a missing path needs force, or you catch ENOENT
try {
  await rm("demo/not-there.txt");
} catch (error) {
  console.log(error.code);                    // ENOENT
}
await rm("demo/not-there.txt", { force: true });   // fine
//   "delete this if it is there", no try/catch needed


// ── The dangerous combination, guarded ──────────────────────
const ROOT = path.resolve("demo");

async function removeInside(userPath) {
  const target = path.resolve(ROOT, userPath);

  if (target !== ROOT && !target.startsWith(ROOT + path.sep)) {
    throw new Error("outside the allowed directory");
  }
  await rm(target, { recursive: true, force: true });
}

// await removeInside("../../..");             ✗ refused
//
// { recursive: true, force: true } is rm -rf. An empty or
// unexpected variable is how people delete more than they
// meant to.


// ── cp: overwrites by default ───────────────────────────────
await writeFile("demo/original.txt", "v1");
await cp("demo/original.txt", "demo/backup.txt");

await writeFile("demo/original.txt", "v2");
await cp("demo/original.txt", "demo/backup.txt");        // replaced

// skip instead of overwrite
await cp("demo/original.txt", "demo/backup.txt", { force: false });

// directories need recursive, same as rm
await cp("demo/src", "demo/src-copy", { recursive: true });
console.log(await readdir("demo/src-copy"));   // [ 'b.txt' ]


// ── stat: size, type, times ─────────────────────────────────
const stats = await stat("demo/src/b.txt");

console.log(stats.isFile());          // true
console.log(stats.isDirectory());     // false
console.log(stats.size);              // 6   ← BYTES, always
console.log(stats.mtime);             // last content change

// formatting is your job
const kb = (bytes) => \`\${(bytes / 1024).toFixed(1)} KB\`;
console.log(kb(stats.size));          // 0.0 KB

await rm("demo", { recursive: true, force: true });`,
      },
      keyTakeaways: [
        "`rm` deletes, with no undo. Treat it accordingly.",
        "`recursive: true` allows a non-empty directory. Without it, `ERR_FS_EISDIR`.",
        "`force: true` ignores a missing path. Without it, `ENOENT`.",
        "`{ recursive: true, force: true }` is `rm -rf` and deserves the same caution.",
        "The real danger is a path built from a variable that turns out empty or unexpected.",
        "Resolve the path and check it is inside where you expect before deleting.",
        "`force` alone is genuinely useful: \"delete this if it is there\", no try/catch.",
        "`cp` overwrites by default. `{ force: false }` skips, `{ errorOnExist: true }` fails.",
        "`stats.size` is always <b>bytes</b>. Human-readable formatting is your job.",
        "`stat` <b>follows symlinks</b> and reports the target. `lstat` reports the link.",
        "`mtime` is contents changed, `ctime` is metadata changed, `birthtime` is created.",
      ],
      commonMistakes: [
        "<b>Reaching for `{ recursive: true, force: true }` by reflex</b> — that is `rm -rf`. Know why you need each option.",
        "<b>Deleting a path built from an unvalidated variable</b> — an empty string or a `..` deletes far more than intended.",
        "<b>Expecting `cp` to refuse an existing destination</b> — it overwrites. Pass `force: false` or `errorOnExist`.",
        "<b>Treating `stats.size` as kilobytes</b> — it is bytes, always.",
        "<b>Using `stat` when you care about a symlink</b> — it reports the target. Use `lstat`.",
        "<b>Trusting `mtime` for change detection</b> — coarse granularity on some filesystems, and settable by hand.",
      ],
      quiz: [
        {
          question: "`await rm(\"logs\")` on a directory containing files. What happens?",
          options: [
            "The directory and its contents are deleted",
            "`ERR_FS_EISDIR`, because a non-empty directory needs `recursive: true`",
            "Only the empty subdirectories are removed",
            "`ENOENT`",
          ],
          correctIndex: 1,
          explanation:
            "`recursive: true` is what permits deleting a directory with contents. `force: true` is a different thing: it ignores a path that is not there at all.",
        },
        {
          question: "You have a symlink pointing at a 500-byte file. What does `stat(link).size` report?",
          options: ["The link's own size", "500, the target's size", "0", "It throws"],
          correctIndex: 1,
          explanation:
            "`stat` follows the link and reports the target. `lstat` is the one that describes the link itself, which is the same distinction a tree walk needs.",
        },
        {
          question: "What makes `{ recursive: true, force: true }` risky in practice?",
          options: [
            "It is slower than deleting files one by one",
            "It is `rm -rf`, so a path from an empty or unexpected variable deletes far more than intended",
            "It does not work on symlinks",
            "It requires elevated permissions",
          ],
          correctIndex: 1,
          explanation:
            "The options themselves are fine. The danger is the path. Resolve it, confirm it sits inside the directory you expect, and only then delete.",
        },
      ],
    },
    {
      id: "access-and-races",
      title: "access, and the check-then-use race",
      durationMinutes: 10,
      explanation:
        "One API, and the reason you should mostly not use it.\n\n---\n\n## `access()`\n\n<b>`access()`</b> (checks whether a file can be accessed with given permissions).\n\n```javascript\ntry {\n  await fs.access(\"config.json\");\n\n  console.log(\"File exists\");\n} catch {\n  console.log(\"File doesn't exist\");\n}\n```\n\nLooks useful. There is an important trap.\n\n---\n\n## The check-then-use race\n\n```javascript\nif (await fileExists(\"data.txt\")) {\n  await readFile(\"data.txt\");\n}\n```\n\nYou expect:\n\n```text\nCheck\n ↓\nFile exists\n ↓\nRead\n```\n\nBut another process can delete the file between the two calls:\n\n```text\nYour process                Another process\n\naccess()\n   ↓\nFile exists\n                           ↓\n                     delete file\n                           ↓\nreadFile()\n   ↓\nERROR\n```\n\n> <b>Race condition</b> (when the result depends on the timing between operations).\n\nThe gap is not hypothetical, and it is bigger than it looks. Between those two awaits your function yields to the event loop, so on a busy server the window is however long other work takes. Deploys, log rotation, cleanup jobs and other requests all live in that gap.\n\n---\n\n## The better pattern\n\nInstead of:\n\n```javascript\nawait fs.access(\"data.txt\");\n\nconst data = await fs.readFile(\"data.txt\");\n```\n\njust try:\n\n```javascript\ntry {\n  const data = await fs.readFile(\"data.txt\", \"utf8\");\n\n  console.log(data);\n} catch (error) {\n  console.error(error);\n}\n```\n\nLet the operation tell you whether it worked.\n\n> <b>Do not check whether you can do something and then do it. Try to do it and handle failure.</b>\n\nThere are two other reasons this is better, beyond the race.\n\nIt is <b>one filesystem call instead of two</b>. On a hot path that is half the work for a strictly better answer.\n\nAnd `access` answers a weaker question than you think. It says the check passed <b>at that instant, for this process</b>. Permissions can change, and a file that exists can still fail to open for a dozen other reasons. The read is the only thing that actually establishes you can read.\n\n---\n\n## Handling the failure properly\n\nA bare catch is not enough, because you need to distinguish \"not there\" from real trouble:\n\n```javascript\ntry {\n  return await readFile(path, \"utf8\");\n} catch (error) {\n  if (error.code === \"ENOENT\") return null;\n  throw error;\n}\n```\n\nCheck <b>`error.code`, not `error.message`</b>. The codes are stable strings you can branch on, and message text is not. The ones you will meet:\n\n```text\nENOENT     no such file or directory\nEACCES     permission denied\nEISDIR     it is a directory, not a file\nENOTDIR    a path segment is not a directory\nEEXIST     it already exists\nEMFILE     too many open files\nENOSPC     no space left on device\n```\n\nNote `error.name` is just `\"Error\"`, so the code is the only useful discriminator. And re-throw anything you did not expect. Turning `EACCES` into \"file not found\" sends whoever debugs it in the wrong direction entirely.\n\n`access` does still have honest uses: a startup check that tells the operator their config is unreadable before the app tries to serve traffic. That is a diagnostic, not a guard.",
      diagram: `The gap is bigger than it looks

    your process                    the world
    ─────────────────────────────────────────────────────
    await access("data.txt")
      exists ✓
         │
         │  ◄── you YIELD to the event loop here
         │      other requests, log rotation, a deploy,
         │      a cleanup job all get a turn
         │
    await readFile("data.txt")      file deleted
         │
      ENOENT ✗

    on a busy server the window is however long
    other work takes


Try, do not check

    CHECK THEN USE                  JUST TRY
    access()      ─┐                readFile()
      │            │  two calls       │        one call
    readFile()    ─┘                catch
      │                               │
    a gap to lose the race          no gap
      │                               │
    and access answers a            the read is what
    WEAKER question:                actually establishes
    "passed at that instant,        you can read
     for this process"


Branch on error.code, never the message

    error.name     "Error"          ← useless
    error.message  "ENOENT: no such file..."  ← not stable
    error.code     "ENOENT"         ← branch on THIS

    ENOENT   no such file or directory
    EACCES   permission denied
    EISDIR   it is a directory, not a file
    EEXIST   it already exists
    EMFILE   too many open files
    ENOSPC   no space left on device


    try {
      return await readFile(p, "utf8")
    } catch (error) {
      if (error.code === "ENOENT") return null
      throw error                    ← re-throw the rest
    }

    turning EACCES into "not found" sends the next
    person debugging entirely the wrong way`,
      codeExample: {
        title: "Try and handle, instead of check and hope",
        code: `import fs from "node:fs/promises";

// ── The pattern to avoid ────────────────────────────────────
// try {
//   await fs.access("data.txt");
//   const data = await fs.readFile("data.txt", "utf8");
// } catch { }
//
// Two problems beyond the race:
//   two filesystem calls where one would do
//   access answers "passed at that instant, for this
//   process", which is weaker than "I can read this"


// ── The pattern to use ──────────────────────────────────────
async function readConfig(file) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;      // not there
    throw error;                                    // anything else
  }
}

console.log(await readConfig("package.json") !== null);   // true
console.log(await readConfig("nope.json"));               // null


// ── Why error.code and not the message ──────────────────────
try {
  await fs.readFile("nope.txt", "utf8");
} catch (error) {
  console.log(error.name);      // "Error"        ← useless
  console.log(error.code);      // "ENOENT"       ← branch on this
  console.log(error.syscall);   // "open"
  console.log(error.message);   // "ENOENT: no such file or
                                //  directory, open 'nope.txt'"
                                //  ← not a stable string
}


// ── Distinguishing the failures that matter ─────────────────
async function loadOrDefault(file, fallback) {
  try {
    return await fs.readFile(file, "utf8");
  } catch (error) {
    switch (error.code) {
      case "ENOENT":
        return fallback;                    // fine, use the default
      case "EACCES":
        throw new Error(\`Cannot read \${file}: permission denied\`, {
          cause: error,                     // Day 4: keep the cause
        });
      case "EISDIR":
        throw new Error(\`\${file} is a directory\`, { cause: error });
      default:
        throw error;                        // do not swallow
    }
  }
}

console.log((await loadOrDefault("missing.txt", "default")).length);


// ── Where access is still honest ────────────────────────────
// at startup, as a DIAGNOSTIC rather than a guard:
try {
  await fs.access("package.json", fs.constants.R_OK);
} catch {
  console.error("config is unreadable, check permissions");
  // process.exit(1);
}
//
// Telling the operator early is a different job from
// guarding a read you are about to attempt anyway.`,
      },
      keyTakeaways: [
        "`access()` checks whether a path can be reached with given permissions.",
        "Checking then using is a <b>race condition</b>: the file can vanish between the two calls.",
        "The gap is real. Between two awaits you yield, so the window is however long other work takes.",
        "<b>Do not check then do. Do it and handle failure.</b>",
        "Trying is also one filesystem call instead of two.",
        "And `access` answers a weaker question: it passed at that instant, for this process.",
        "The read is the only thing that actually establishes you can read.",
        "Branch on <b>`error.code`</b>, never `error.message`. Codes are stable, message text is not.",
        "`error.name` is just `\"Error\"`, so the code is your only discriminator.",
        "Know the common codes: `ENOENT`, `EACCES`, `EISDIR`, `EEXIST`, `EMFILE`, `ENOSPC`.",
        "Re-throw what you did not expect. Turning `EACCES` into \"not found\" misleads whoever debugs it.",
        "`access` is still fine as a <b>startup diagnostic</b>, telling an operator their config is unreadable.",
      ],
      commonMistakes: [
        "<b>Checking existence before reading</b> — a race, two calls, and a weaker answer than the read itself gives.",
        "<b>Branching on `error.message`</b> — the wording is not a stable interface. Use `error.code`.",
        "<b>A bare `catch` that returns null</b> — a permission error becomes \"not found\", and the real problem is invisible.",
        "<b>Checking `error.name`</b> — it is `\"Error\"` for every filesystem failure.",
        "<b>Assuming `access` guarantees the later operation</b> — permissions change, and a file can exist and still fail to open.",
        "<b>Writing a `fileExists()` helper</b> — it invites exactly the pattern you want to avoid.",
      ],
      quiz: [
        {
          question: "Why is `if (await exists(f)) await readFile(f)` worse than just reading and catching?",
          options: [
            "It is only a style preference",
            "The file can vanish in the gap, it costs two calls instead of one, and the check answers a weaker question than the read",
            "`access` does not work on relative paths",
            "`readFile` cannot throw",
          ],
          correctIndex: 1,
          explanation:
            "All three reasons point the same way. Between the two awaits you yield to the event loop, so on a busy server the window is however long other work takes.",
        },
        {
          question: "Which property should you branch on when handling a filesystem error?",
          options: ["`error.name`", "`error.message`", "`error.code`", "`error.syscall`"],
          correctIndex: 2,
          explanation:
            "`code` is a stable string like `ENOENT` or `EACCES`. `name` is just `\"Error\"` for all of them, and message wording is not an interface you can rely on.",
        },
        {
          question: "Your loader catches everything and returns `null`. What does that hide?",
          options: [
            "Nothing, missing files are the only failure",
            "A permission error or a directory-instead-of-file error looks identical to \"not found\"",
            "It hides successful reads",
            "It slows down the read",
          ],
          correctIndex: 1,
          explanation:
            "`EACCES` reported as \"not found\" sends the next person looking for a missing file instead of a permissions problem. Handle the codes you expect and re-throw the rest.",
        },
      ],
    },
    {
      id: "handles-and-watch",
      title: "File handles and fs.watch",
      durationMinutes: 8,
      explanation:
        "Two things you will use less often, but should recognise.\n\n---\n\n## File handles\n\nSometimes you want more control over a file:\n\n```javascript\nconst file = await fs.open(\"data.txt\");\n```\n\nThat gives you a:\n\n```text\nFileHandle\n```\n\n<b>`FileHandle`</b> (an object representing an opened file, with operations on that file).\n\n```javascript\nconst file = await fs.open(\"data.txt\");\n\ntry {\n  const data = await file.readFile(\"utf8\");\n\n  console.log(data);\n} finally {\n  await file.close();\n}\n```\n\n```text\nopen()\n  ↓\nuse\n  ↓\nclose()\n```\n\nAlways close the handle. The `finally` is the whole point: without it, an error between open and close leaks the handle.\n\n### Why bother?\n\nFor more involved work:\n\n```text\nOpen once\n   ↓\nRead multiple times\n   ↓\nWrite\n   ↓\nGet metadata\n   ↓\nClose\n```\n\ninstead of reopening the same file each time.\n\n### Why the close matters\n\nA leaked handle is not harmless. Every process has a limit on open file descriptors, and hitting it gives you:\n\n```text\nEMFILE: too many open files\n```\n\nThat error is nasty because it appears far from the leak, and it breaks things that have nothing to do with files. Sockets are file descriptors too, so a handle leak eventually stops your server accepting connections. The symptom looks like a network problem.\n\nRecent Node has `using` for automatic cleanup, and `FileHandle` supports it:\n\n```javascript\nawait using file = await fs.open(\"data.txt\");\n```\n\nThe handle closes when the block ends, however it ends. Until you are on a version that supports it, `try`/`finally` is the pattern.\n\n---\n\n## `fs.watch()`\n\n<b>`fs.watch()`</b> (watches a file or directory for changes).\n\n```javascript\nimport fs from \"node:fs\";\n\nfs.watch(\"config.json\", eventType => {\n  console.log(\"Changed:\", eventType);\n});\n```\n\nUseful for:\n\n```text\nDevelopment tools\nConfiguration reloads\nFile processors\nWatching generated files\n```\n\n---\n\n## Do not treat it as a clean event stream\n\nBehaviour varies across:\n\n```text\nOperating systems\nFilesystem implementations\nEditors\nContainers\nNetwork filesystems\n```\n\nYou may get multiple events, or slightly different ones. So never assume:\n\n```text\nOne save\n ↓\nExactly one event\n```\n\nThe reason is worth knowing, because it explains the mess. Most editors do not write your file in place. They write a temporary file and rename it over the original, so a single save can look like a create, a change, a rename and a delete. On some platforms you also get one event for the file and another for its directory.\n\nThe practical fix is <b>debouncing</b>: collect events for a hundred milliseconds or so and act once. That is what every file watcher you have used does internally, and it is why the naive version feels broken.\n\nOn network filesystems and some container mounts, watching may not work at all, because there is no OS notification to receive. Tools fall back to polling for that reason.\n\nFor real file-processing systems, treat a watch event as \"something might have changed, go look\", not as a description of what happened.",
      diagram: `open, use, close. the finally is the point.

    const file = await fs.open("data.txt")
    try {
      ... use it ...
    } finally {
      await file.close()      ← without this, an error
    }                           between open and close
                                LEAKS the handle


Why a leaked handle is nasty

    every leak
        ↓
    file descriptors accumulate
        ↓
    EMFILE: too many open files
        ↓
    sockets are file descriptors too
        ↓
    the server stops accepting connections
        ↓
    looks like a NETWORK problem, nowhere
    near the code that leaked


One save is not one event

    what you think happens        what an editor does
    save                          write file.tmp
      ↓                             ↓
    one "change" event            rename file.tmp → file
                                    ↓
                                  create + change + rename
                                  + sometimes a delete
                                    ↓
                                  plus a separate event for
                                  the DIRECTORY on some
                                  platforms

    the fix: debounce. collect for ~100ms, act once.
    that is what every watcher you have used does.


Where watch does not work at all

    network filesystems      no OS notification to receive
    some container mounts    tools fall back to polling

    treat an event as "something might have changed,
    go look", never as a description of what happened`,
      codeExample: {
        title: "Handles that always close, and a watcher that debounces",
        code: `import fs from "node:fs/promises";
import { watch } from "node:fs";
import { writeFile, mkdir, rm } from "node:fs/promises";

await mkdir("demo", { recursive: true });
await writeFile("demo/data.txt", "line one\\nline two\\n");


// ── A handle, closed no matter what ─────────────────────────
const file = await fs.open("demo/data.txt");

try {
  const text = await file.readFile("utf8");
  const stats = await file.stat();          // same open handle

  console.log(text.split("\\n").length - 1, "lines");
  console.log(stats.size, "bytes");
} finally {
  await file.close();                       // ← the whole point
}
//
// Open once, read and stat and write, close once. Without
// the finally, a throw in the middle leaks the descriptor.


// ── Why the leak matters ────────────────────────────────────
// const handles = [];
// for (let i = 0; i < 20_000; i += 1) {
//   handles.push(await fs.open("demo/data.txt"));   // never closed
// }
//   EMFILE: too many open files
//
// And sockets are descriptors too, so the server stops
// accepting connections. The symptom looks like a network
// problem, nowhere near the code that leaked.


// ── Newer Node: automatic cleanup ───────────────────────────
// {
//   await using f = await fs.open("demo/data.txt");
//   console.log((await f.readFile("utf8")).length);
// }   ← closes here, however the block ends


// ── A watcher, debounced ────────────────────────────────────
let timer;
const watcher = watch("demo/data.txt", (eventType, filename) => {
  console.log("raw event:", eventType, filename);

  clearTimeout(timer);
  timer = setTimeout(() => {
    console.log("settled, reloading");      // fires ONCE per save
  }, 100);
});

// Save once in an editor and the raw events might be:
//   raw event: rename data.txt
//   raw event: change data.txt
//   raw event: change data.txt
//   settled, reloading            ← one action
//
// Editors write a temp file and rename it over the original,
// so a single save looks like several things happening.

await writeFile("demo/data.txt", "changed");

setTimeout(async () => {
  watcher.close();                          // watchers leak too
  clearTimeout(timer);
  await rm("demo", { recursive: true, force: true });
}, 500);`,
      },
      keyTakeaways: [
        "`fs.open()` returns a `FileHandle` for doing several operations on one open file.",
        "Always close it, in a `finally`, so an error in between cannot leak the handle.",
        "A leaked handle ends in `EMFILE: too many open files`.",
        "Sockets are file descriptors too, so a handle leak eventually stops the server accepting connections.",
        "That makes `EMFILE` appear as a network problem, far from the code that leaked.",
        "Newer Node supports `await using` on a `FileHandle` for automatic cleanup.",
        "`fs.watch()` reports filesystem changes, and is not a clean event stream.",
        "One save often produces several events, because editors write a temp file and rename it over the original.",
        "<b>Debounce</b>: collect events for around 100ms and act once. Every watcher you have used does this.",
        "Watching may not work at all on network filesystems or some container mounts, which is why tools fall back to polling.",
        "Treat an event as \"something might have changed, go look\", not as a description of what happened.",
      ],
      commonMistakes: [
        "<b>Opening a handle without a `finally` close</b> — one throw and the descriptor leaks.",
        "<b>Acting on every watch event</b> — a single save fires several, so your reload runs three or four times.",
        "<b>Assuming the event type is meaningful</b> — `rename` shows up for an ordinary save, because of how editors write files.",
        "<b>Never closing the watcher</b> — it keeps the process alive and leaks a descriptor of its own.",
        "<b>Relying on `fs.watch` inside a container or on a network mount</b> — there may be no notification to receive.",
        "<b>Using a handle when `readFile` would do</b> — one read does not need open and close around it.",
      ],
      quiz: [
        {
          question: "Why does a leaked `FileHandle` eventually break things that have nothing to do with files?",
          options: [
            "It corrupts the file",
            "Sockets are file descriptors too, so hitting the limit stops the server accepting connections",
            "It fills the disk",
            "It blocks the event loop",
          ],
          correctIndex: 1,
          explanation:
            "`EMFILE` is a per-process descriptor limit, and network connections consume the same pool. The symptom looks like a network problem, nowhere near the code that leaked.",
        },
        {
          question: "You save a file once in your editor and `fs.watch` fires three events. Why?",
          options: [
            "A bug in Node",
            "Editors usually write a temp file and rename it over the original, so one save looks like several operations",
            "The file was saved three times",
            "The watcher was registered three times",
          ],
          correctIndex: 1,
          explanation:
            "Write-then-rename is the normal safe-save pattern, and it surfaces as create, change and rename. Debouncing for around 100ms turns it back into one action.",
        },
        {
          question: "What is the right mental model for a watch event?",
          options: [
            "An exact description of what changed",
            "\"Something might have changed, go look\"",
            "A guarantee the file now exists",
            "One event per save, always",
          ],
          correctIndex: 1,
          explanation:
            "The event type and count vary by platform, filesystem, editor and mount. Re-reading the file when things settle is reliable; interpreting the event is not.",
        },
      ],
    },
    {
      id: "glob",
      title: "fs.glob",
      durationMinutes: 8,
      explanation:
        "Modern Node has built-in glob matching, so you often do not need a package for it.\n\n<b>glob</b> (a pattern used to match filenames).\n\n```text\n*.js\n```\n\nmeans:\n\n```text\nAll JavaScript files in a directory\n```\n\n```javascript\nfor await (const file of fs.glob(\"src/**/*.js\")) {\n  console.log(file);\n}\n```\n\nwhich finds:\n\n```text\nsrc/index.js\nsrc/utils/helper.js\nsrc/api/users.js\n```\n\nThe pattern:\n\n```text\n**\n```\n\nmeans recursively through directories.\n\n---\n\n## It is an async iterator, not an array\n\nThis is the thing to get right, because the obvious guess is wrong:\n\n```javascript\nconst files = await fs.glob(\"src/**/*.js\");\n\nconsole.log(files);\n```\n\nThat prints:\n\n```text\nObject [AsyncGenerator] {}\n```\n\nNot a list. `fs.glob` returns an async iterator, and awaiting an iterator just gives you the iterator. You have to consume it:\n\n```javascript\n// one at a time\nfor await (const file of fs.glob(\"src/**/*.js\")) {\n  console.log(file);\n}\n\n// or collect them all\nconst files = await Array.fromAsync(fs.glob(\"src/**/*.js\"));\n```\n\nAnd the design makes sense once you see why. A glob over a big tree can match a great many files, and streaming them means you can start work on the first result before the walk has finished, without holding the whole list in memory. `Array.fromAsync` is there when you genuinely want the array.\n\n---\n\n## The patterns\n\n```text\n*        anything except a path separator\n**       anything, across directories\n?        a single character\n{a,b}    either alternative\n[abc]    one of these characters\n```\n\nSo `src/**/*.test.js` finds test files at any depth, and `*.{js,ts}` matches both extensions.\n\nOne detail that catches people: `*` does not cross a directory boundary. `src/*.js` finds only the files directly in `src`, not in `src/utils`. That is what `**` is for.\n\n---\n\n## Excluding\n\nYou will almost always want to skip something:\n\n```javascript\nconst files = await Array.fromAsync(\n  fs.glob(\"**/*.js\", {\n    exclude: (path) => path.includes(\"node_modules\"),\n  })\n);\n```\n\nWithout that, a glob from your project root walks every dependency you have installed, which is slow and returns thousands of files nobody asked about.\n\n---\n\n## When to hand-write the walk instead\n\nGlob is the right tool when you know the shape of what you want. The recursive `readdir` walk from earlier is better when you need to decide as you go: skipping a directory before descending into it, reading metadata while you are there, or stopping early. Glob gives you paths; the walk gives you control.",
      diagram: `The mistake the docs make easy

    const files = await fs.glob("src/**/*.js")
    console.log(files)
      → Object [AsyncGenerator] {}       ✗ not a list

    awaiting an iterator gives you the iterator.


    consume it instead

    for await (const f of fs.glob("src/**/*.js")) { ... }
      └─ one at a time, start work on the first result
         before the walk has finished

    await Array.fromAsync(fs.glob("src/**/*.js"))
      └─ when you genuinely want the array


    why streaming is the default:
      a glob over a big tree can match a great many files.
      holding them all in memory is the exception, not
      the rule.


The patterns

    *        anything except a path separator
    **       anything, across directories
    ?        a single character
    {a,b}    either alternative
    [abc]    one of these characters

    src/*.js       only files directly in src
    src/**/*.js    any depth              ← * does not
                                            cross a /


Always exclude something

    fs.glob("**/*.js")
      └─ walks every installed dependency.
         thousands of files, slowly.

    fs.glob("**/*.js", {
      exclude: (p) => p.includes("node_modules"),
    })


glob or a hand-written walk?

    glob    you know the SHAPE of what you want
            gives you paths

    walk    you need to decide as you go: skip a
            directory before descending, read
            metadata while you are there, stop early
            gives you control`,
      codeExample: {
        title: "Consuming a glob, and excluding what you do not want",
        code: `import fs from "node:fs/promises";
import { mkdir, writeFile, rm } from "node:fs/promises";

await mkdir("demo/src/utils", { recursive: true });
await writeFile("demo/src/app.js", "a");
await writeFile("demo/src/app.test.js", "t");
await writeFile("demo/src/utils/help.js", "h");
await writeFile("demo/src/types.ts", "y");


// ── The mistake ─────────────────────────────────────────────
console.log(await fs.glob("demo/src/**/*.js"));
// Object [AsyncGenerator] {}
//   awaiting an iterator gives you the iterator


// ── Streaming, one at a time ────────────────────────────────
for await (const file of fs.glob("demo/src/**/*.js")) {
  console.log("found:", file);
}
// found: demo/src/app.js
// found: demo/src/app.test.js
// found: demo/src/utils/help.js
//
// You can act on the first result before the walk finishes,
// without holding the whole list in memory.


// ── Collecting, when you want the array ─────────────────────
const all = await Array.fromAsync(fs.glob("demo/src/**/*.js"));
console.log(all.length);                      // 3


// ── * does not cross a directory boundary ───────────────────
console.log(await Array.fromAsync(fs.glob("demo/src/*.js")));
// [ 'demo/src/app.js', 'demo/src/app.test.js' ]
//   utils/help.js is NOT here. that is what ** is for.


// ── Alternatives and character classes ──────────────────────
console.log(await Array.fromAsync(fs.glob("demo/src/**/*.{js,ts}")));
// includes types.ts

console.log(await Array.fromAsync(fs.glob("demo/src/**/*.test.js")));
// [ 'demo/src/app.test.js' ]


// ── Excluding: you will always need this ────────────────────
const source = await Array.fromAsync(
  fs.glob("demo/**/*.js", {
    exclude: (p) => p.includes("node_modules") || p.includes(".test."),
  })
);
console.log(source);
// [ 'demo/src/app.js', 'demo/src/utils/help.js' ]
//
// Without exclude, a glob from a project root walks every
// installed dependency: thousands of files, slowly.

await rm("demo", { recursive: true, force: true });`,
      },
      keyTakeaways: [
        "`fs.glob` is built in, so you often do not need a package for pattern matching.",
        "<b>It returns an async iterator, not an array.</b> `await fs.glob(...)` gives you the iterator itself.",
        "Consume it with `for await`, or collect it with `Array.fromAsync`.",
        "Streaming is the default because a glob over a big tree can match a great many files.",
        "`*` matches within one directory. `**` crosses directories.",
        "So `src/*.js` misses `src/utils/help.js`. That is what `**` is for.",
        "`{js,ts}` matches either alternative, `?` a single character, `[abc]` one of a set.",
        "Pass `exclude` or a glob from your project root walks every installed dependency.",
        "Glob is for when you know the shape of what you want. A hand-written walk is for when you need control.",
      ],
      commonMistakes: [
        "<b>`const files = await fs.glob(...)`</b> — you get `AsyncGenerator`, not a list. Use `for await` or `Array.fromAsync`.",
        "<b>Expecting `*` to recurse</b> — it stops at the directory boundary. Use `**`.",
        "<b>Globbing from a project root without `exclude`</b> — you walk all of `node_modules`.",
        "<b>Collecting a huge glob into an array</b> — that defeats the streaming design. Iterate instead.",
        "<b>Installing a glob package by reflex</b> — the built-in covers the common cases now.",
        "<b>Using glob when you need to skip directories as you descend</b> — it gives you paths, not control. Write the walk.",
      ],
      quiz: [
        {
          question: "What does `console.log(await fs.glob(\"src/**/*.js\"))` print?",
          options: [
            "An array of matching paths",
            "`Object [AsyncGenerator] {}`",
            "The first matching path",
            "A promise",
          ],
          correctIndex: 1,
          explanation:
            "`fs.glob` returns an async iterator, and awaiting one just hands it back. Iterate with `for await`, or collect with `Array.fromAsync`.",
        },
        {
          question: "Why does `fs.glob` stream results instead of returning an array?",
          options: [
            "Arrays cannot hold paths",
            "A glob over a large tree can match a great many files, so you can start work on the first result without holding them all in memory",
            "It is faster to type",
            "To support Windows paths",
          ],
          correctIndex: 1,
          explanation:
            "Streaming is the sensible default for something that might match thousands of files. `Array.fromAsync` is there for when you genuinely want the whole list.",
        },
        {
          question: "`fs.glob(\"src/*.js\")` misses `src/utils/helper.js`. Why?",
          options: [
            "The file is excluded by default",
            "`*` does not cross a directory boundary. `**` does",
            "Nested files need `withFileTypes`",
            "The extension must be listed twice",
          ],
          correctIndex: 1,
          explanation:
            "A single `*` matches within one directory only. `src/**/*.js` is the pattern that descends.",
        },
      ],
    },
    {
      id: "node-path",
      title: "node:path, and why not to build paths by hand",
      durationMinutes: 12,
      explanation:
        "Now the paths themselves.\n\n```javascript\nimport path from \"node:path\";\n```\n\n`path` gives you utilities for working with filesystem paths safely.\n\n---\n\n## `path.join()`\n\n<b>`path.join()`</b> (combines segments into a valid path).\n\n```javascript\nconst filePath = path.join(\n  \"uploads\",\n  \"images\",\n  \"photo.jpg\"\n);\n\nconsole.log(filePath);\n```\n\n```text\n\"uploads\"\n+\n\"images\"\n+\n\"photo.jpg\"\n       ↓\npath.join()\n       ↓\nuploads/images/photo.jpg\n```\n\n---\n\n## `path.resolve()`\n\n<b>`path.resolve()`</b> (turns segments into an absolute path).\n\n```javascript\nconst filePath = path.resolve(\n  \"uploads\",\n  \"photo.jpg\"\n);\n\nconsole.log(filePath);\n```\n\n```text\n/Users/rajan/project/uploads/photo.jpg\n```\n\nThe difference:\n\n```text\njoin()\n ↓\ncombine paths\n\nresolve()\n ↓\nproduce absolute path\n```\n\nOne detail with real consequences: when `resolve` meets an <b>absolute segment, it throws away everything before it</b>.\n\n```javascript\npath.resolve(\"/app/uploads\", \"/etc/passwd\");\n// \"/etc/passwd\"\n```\n\nThe base is simply gone. That matters in the next lesson, because it is a way user input escapes a directory that has nothing to do with `..`.\n\nAlso note `resolve` with no absolute segment builds from `process.cwd()`, which is wherever the process was started. Day 1's distinction: use `import.meta.dirname` when you mean \"next to this file\".\n\n---\n\n## `path.basename()`\n\n<b>`path.basename()`</b> (the last part of a path).\n\n```javascript\nconst file = path.basename(\n  \"/uploads/images/photo.jpg\"\n);\n\nconsole.log(file);\n```\n\n```text\nphoto.jpg\n```\n\n---\n\n## `path.extname()`\n\n<b>`path.extname()`</b> (the file extension).\n\n```javascript\nconst extension = path.extname(\n  \"photo.jpg\"\n);\n\nconsole.log(extension);\n```\n\n```text\n.jpg\n```\n\nand:\n\n```javascript\npath.extname(\"report.pdf\");\n```\n\n```text\n.pdf\n```\n\nIt includes the dot, which is easy to forget when you compare against `\"jpg\"`. And it returns `\"\"` for `Dockerfile` or `LICENSE`, which the day's project has to handle. A dotfile like `.gitignore` also gives `\"\"`, since the whole name is treated as the name rather than an extension.\n\n---\n\n## `path.relative()`\n\n<b>`path.relative()`</b> (the path from one location to another).\n\n```javascript\nconst result = path.relative(\n  \"/app/src\",\n  \"/app/src/utils/helper.js\"\n);\n\nconsole.log(result);\n```\n\n```text\nutils/helper.js\n```\n\nUseful for answering:\n\n```text\nWhere is B relative to A?\n```\n\nMostly for display. Printing `src/utils/helper.js` instead of a long absolute path makes output much easier to read.\n\n---\n\n## `path.sep`\n\n<b>`path.sep`</b> (the platform's path separator).\n\nUnix-like:\n\n```text\n/\n```\n\nWindows:\n\n```text\n\\\n```\n\n```javascript\nconsole.log(path.sep);\n```\n\n---\n\n## Do not concatenate paths\n\nDo not do this:\n\n```javascript\nconst filePath = \"uploads/\" + filename;\n```\n\nIt may look fine on Linux and macOS, but Windows uses:\n\n```text\n\\\n```\n\nMore importantly, hand-built paths go wrong:\n\n```javascript\nconst filePath =\n  directory + \"/\" + subdirectory + \"/\" + filename;\n```\n\nYou end up with:\n\n```text\nuploads//images/file.jpg\nuploadsimages/file.jpg\n```\n\nUse:\n\n```javascript\npath.join(\n  directory,\n  subdirectory,\n  filename\n);\n```\n\nThe portability argument is the one usually given, and it is the weaker one. Windows accepts forward slashes in most places anyway.\n\nThe real reason is that <b>`join` normalises</b>. It collapses duplicate separators, resolves `.` and `..`, and gives you one canonical string. Concatenation gives you whatever you happened to build, and two paths pointing at the same file can compare as different, which quietly breaks any cache or lookup keyed on the path.\n\nAnd there is a security edge to that normalising, which is the next lesson: `join` resolving `..` is exactly what lets user input climb out of your directory.",
      diagram: `join vs resolve

    path.join("uploads", "images", "photo.jpg")
      → "uploads/images/photo.jpg"          relative, combined

    path.resolve("uploads", "photo.jpg")
      → "/Users/rajan/project/uploads/photo.jpg"
                                            absolute, from cwd


    resolve THROWS AWAY everything before an absolute segment

    path.resolve("/app/uploads", "/etc/passwd")
      → "/etc/passwd"
                │
                └─ the base is simply gone.
                   an escape route with no ".." in it.


extname includes the dot, and is often empty

    "photo.jpg"     →  ".jpg"      ← the dot is included
    "report.pdf"    →  ".pdf"
    "Dockerfile"    →  ""
    "LICENSE"       →  ""
    ".gitignore"    →  ""          ← whole name, not an ext

    comparing against "jpg" without the dot never matches


Why not to concatenate: normalising, not Windows

    "uploads/" + "images/" + "file.jpg"
      → "uploads/images//file.jpg"       oops
    directory + subdirectory + filename
      → "uploadsimagesfile.jpg"          oops

    path.join(directory, subdirectory, filename)
      → one canonical string, separators collapsed,
        "." and ".." resolved

    the portability argument is the weaker one. Windows
    takes forward slashes anyway.

    the real cost: two strings pointing at the same file
    compare as DIFFERENT, which quietly breaks any cache
    or lookup keyed on the path.

    and join resolving ".." is exactly how user input
    climbs out of your directory  →  next lesson`,
      codeExample: {
        title: "Building paths properly",
        code: `import path from "node:path";

// ── join: combine, relative ─────────────────────────────────
console.log(path.join("uploads", "images", "photo.jpg"));
// uploads/images/photo.jpg

// it normalises, which is the real reason to use it
console.log(path.join("uploads/", "/images/", "photo.jpg"));
// uploads/images/photo.jpg        ← duplicate separators gone
console.log(path.join("uploads", "images", "..", "photo.jpg"));
// uploads/photo.jpg               ← ".." resolved


// ── resolve: absolute ───────────────────────────────────────
console.log(path.resolve("uploads", "photo.jpg"));
// /Users/rajan/project/uploads/photo.jpg      ← from cwd

// ⚠ an absolute segment discards everything before it
console.log(path.resolve("/app/uploads", "/etc/passwd"));
// /etc/passwd
//   the base is gone. An escape with no ".." in it at all.

// Day 1: cwd is where node was run, not where this file is
// path.resolve(import.meta.dirname, "data.json")   ← usually
//                                                     what you want


// ── basename, extname, relative ─────────────────────────────
console.log(path.basename("/uploads/images/photo.jpg"));  // photo.jpg
console.log(path.basename("/uploads/images/photo.jpg", ".jpg"));
// photo                                    ← strip a known suffix

console.log(path.extname("photo.jpg"));     // ".jpg"  ← with the dot
console.log(path.extname("report.pdf"));    // ".pdf"
console.log(path.extname("Dockerfile"));    // ""
console.log(path.extname("LICENSE"));       // ""
console.log(path.extname(".gitignore"));    // ""      ← surprising

// if (path.extname(f) === "jpg")           ✗ never matches
// if (path.extname(f) === ".jpg")          ✓

console.log(path.relative("/app/src", "/app/src/utils/helper.js"));
// utils/helper.js                          ← mostly for display

console.log(path.sep);                      // "/" or "\\\\"


// ── parse gives you everything at once ──────────────────────
console.log(path.parse("/uploads/images/photo.jpg"));
// { root: '/', dir: '/uploads/images', base: 'photo.jpg',
//   ext: '.jpg', name: 'photo' }


// ── Why concatenation bites ─────────────────────────────────
const dir = "uploads/";
const sub = "/images/";
const name = "file.jpg";

console.log(dir + sub + name);              // uploads//images/file.jpg
console.log(dir + name);                    // uploads/file.jpg  (lucky)
console.log("uploads" + name);              // uploadsfile.jpg   (wrong)

console.log(path.join(dir, sub, name));     // uploads/images/file.jpg

// The cost is not just ugly strings. Two paths pointing at
// the same file compare as different:
console.log("uploads//images/file.jpg" === "uploads/images/file.jpg");
// false
//   any cache or lookup keyed on the path now has two
//   entries for one file.`,
      },
      keyTakeaways: [
        "`path.join()` combines segments. `path.resolve()` produces an absolute path.",
        "`resolve` <b>discards everything before an absolute segment</b>, so a base directory can vanish.",
        "That is an escape route with no `..` in it, which matters in the next lesson.",
        "`resolve` with no absolute segment builds from `process.cwd()`. Use `import.meta.dirname` for \"next to this file\".",
        "`basename` is the last segment, and takes a suffix to strip.",
        "`extname` <b>includes the dot</b>, so compare against `\".jpg\"` and not `\"jpg\"`.",
        "`extname` returns `\"\"` for `Dockerfile`, `LICENSE` and even `.gitignore`.",
        "`relative` answers \"where is B relative to A\", mostly for readable output.",
        "`path.sep` is the platform separator.",
        "The real reason not to concatenate is that <b>`join` normalises</b>: collapsed separators, resolved `.` and `..`, one canonical string.",
        "Two hand-built strings for the same file compare as different, which breaks any cache keyed on the path.",
        "Portability is the weaker argument. Windows accepts forward slashes in most places.",
      ],
      commonMistakes: [
        "<b>Building paths with `+`</b> — you get doubled or missing separators, and non-canonical strings that break path-keyed caches.",
        "<b>Comparing `extname(f)` against `\"jpg\"`</b> — it returns `\".jpg\"`, with the dot.",
        "<b>Assuming every file has an extension</b> — `Dockerfile` and `LICENSE` give `\"\"`, and so does `.gitignore`.",
        "<b>Forgetting `resolve` drops the base on an absolute segment</b> — `resolve(base, \"/etc/passwd\")` is just `/etc/passwd`.",
        "<b>Using `resolve` when you meant relative to the current file</b> — it builds from `cwd`. Anchor with `import.meta.dirname`.",
        "<b>Hardcoding `/` as a separator</b> — use `path.join`, or `path.sep` when you genuinely need the character.",
      ],
      quiz: [
        {
          question: "What is `path.resolve(\"/app/uploads\", \"/etc/passwd\")`?",
          options: [
            "`/app/uploads/etc/passwd`",
            "`/etc/passwd`, because an absolute segment discards everything before it",
            "An error",
            "`/app/uploads`",
          ],
          correctIndex: 1,
          explanation:
            "An absolute segment resets the resolution, so the base is gone. That is a way user input escapes a directory without using `..` at all.",
        },
        {
          question: "What is the strongest reason to use `path.join` rather than string concatenation?",
          options: [
            "Windows uses backslashes",
            "`join` normalises the result, so you get one canonical string instead of whatever you happened to build",
            "It is faster",
            "Concatenation does not compile in TypeScript",
          ],
          correctIndex: 1,
          explanation:
            "Portability is the usual argument and the weaker one. Non-canonical strings are the real cost: two paths for the same file compare as different and quietly break anything keyed on the path.",
        },
        {
          question: "`path.extname(\".gitignore\")` returns what?",
          options: ["`\".gitignore\"`", "`\"gitignore\"`", "`\"\"`", "`\".\"`"],
          correctIndex: 2,
          explanation:
            "A leading dot makes the whole thing a name rather than an extension, so you get an empty string, same as for `Dockerfile` or `LICENSE`.",
        },
      ],
    },
    {
      id: "traversal-and-os",
      title: "Path traversal, and node:os",
      durationMinutes: 14,
      explanation:
        "The security lesson, and then a small module.\n\n---\n\n## Path traversal\n\n<b>Path traversal</b> (an attack where a user manipulates a path to reach files outside the intended directory).\n\nYour server has:\n\n```text\n/uploads\n```\n\nA user asks for:\n\n```text\nphoto.jpg\n```\n\nSo you build:\n\n```javascript\nconst filePath = path.join(\n  \"/uploads\",\n  filename\n);\n```\n\nLooks fine. But what if they send:\n\n```text\n../../etc/passwd\n```\n\n---\n\n## Why it works\n\n```javascript\nconst filePath = path.join(\n  \"/app/uploads\",\n  userInput\n);\n\nawait fs.readFile(filePath);\n```\n\nWith `userInput = \"../../secret.txt\"`, the path escapes the uploads directory.\n\nThe uncomfortable part is that this is <b>`path.join` working correctly</b>. Its job is to normalise, and normalising means resolving `..`:\n\n```javascript\npath.join(\"/app/uploads\", \"../../etc/passwd\");\n// \"/etc/passwd\"\n```\n\nNo warning, no error. The last lesson praised `join` for normalising, and this is the same behaviour with a user supplying one of the segments. Using `path.join` is not the safety measure. People assume it is, which is exactly why this bug is so common.\n\nThere is a second route with no `..` in it. From the last lesson, an absolute segment discards the base:\n\n```javascript\npath.resolve(\"/app/uploads\", \"/etc/passwd\");\n// \"/etc/passwd\"\n```\n\nSo blocking `..` is not enough on its own.\n\n---\n\n## Preventing it\n\nThe shape:\n\n```text\nTrusted base directory\n       ↓\nResolve requested path\n       ↓\nCheck that result stays inside base\n       ↓\nOnly then access file\n```\n\n```javascript\nconst base = path.resolve(\"/app/uploads\");\n\nconst requested = path.resolve(\n  base,\n  userInput\n);\n\nif (\n  requested !== base &&\n  !requested.startsWith(base + path.sep)\n) {\n  throw new Error(\"Invalid path\");\n}\n```\n\nThen:\n\n```javascript\nconst data = await fs.readFile(requested);\n```\n\nThe idea matters more than the code:\n\n> <b>Never trust a user-provided path.</b>\n\nTwo details in that check are doing real work.\n\nYou resolve <b>first</b> and check <b>after</b>. Inspecting the raw input for `..` is a losing game against encodings and separators. Resolving collapses everything to one canonical absolute path, and then a single comparison settles it.\n\nAnd the `+ path.sep` is not cosmetic. `startsWith(base)` alone would accept `/app/uploads-evil/x`, because that string does begin with `/app/uploads`. Adding the separator forces a real directory boundary.\n\nOne remaining gap: a symlink inside your uploads directory pointing somewhere else passes this check, because it happens after resolving the path but before the filesystem follows the link. If users can create symlinks in there, you need `fs.realpath` and the same comparison again.\n\n---\n\n## Better: do not accept paths at all\n\nIf you can, do not let users supply:\n\n```text\n../../something\n```\n\nUse an identifier instead:\n\n```text\nGET /files/12345\n```\n\nand look it up:\n\n```text\n12345\n ↓\nDatabase\n ↓\nActual stored filename\n```\n\n```text\nUser\n ↓\nfileId = 12345\n ↓\nDatabase\n ↓\nstored filename = a8f91c.jpg\n ↓\n/uploads/a8f91c.jpg\n```\n\nMuch safer than allowing arbitrary paths.\n\nAnd notice why: this is not a better filter, it is <b>removing the filter</b>. The user's input is now an id you look up, so no string they send ever reaches the filesystem. A validation bug in the previous approach is a file disclosure. Here there is nothing to get wrong, and you get access control for free, because the lookup can check whether this user owns that file.\n\nA generated stored name also stops the other problems that come with user-supplied filenames: collisions, absurd lengths, and characters your filesystem or shell treats specially.\n\n---\n\n## `node:os`\n\n```javascript\nimport os from \"node:os\";\n```\n\nInformation about the machine.\n\n### Temporary directory\n\n<b>`os.tmpdir()`</b> (the OS default temporary directory).\n\n```javascript\nconsole.log(os.tmpdir());\n```\n\n```text\n/tmp\n```\n\nor a Windows temp directory. Do not hardcode:\n\n```javascript\n\"/tmp\"\n```\n\nUse `os.tmpdir()`.\n\nAnd pair it with `fs.mkdtemp` rather than picking your own name. Two requests choosing `/tmp/upload.tmp` at the same time will corrupt each other, and a predictable name in a shared directory is its own small security problem.\n\n### CPU count\n\n```javascript\nconst cpus = os.cpus();\n\nconsole.log(cpus.length);\n```\n\nThat is the number of logical CPU entries Node reports. Modern Node also has:\n\n```javascript\nos.availableParallelism()\n```\n\nwhich is usually the better one for deciding how much parallel work to schedule.\n\nThe difference matters in a container. `os.cpus().length` reports the <b>host</b> machine's CPUs, so a pod limited to one core on a 64-core node still sees 64. Sizing a worker pool from that number is how you end up with 64 workers fighting over one core.\n\n### Platform\n\n```javascript\nconsole.log(os.platform());\n```\n\n```text\nlinux\ndarwin\nwin32\n```\n\nTry not to build around OS-specific behaviour. Prefer the cross-platform APIs:\n\n```text\npath\nos\nfs\n```",
      diagram: `path.join is not the safety measure

    path.join("/app/uploads", "../../etc/passwd")
      → "/etc/passwd"

    no warning, no error. join is working CORRECTLY:
    its job is to normalise, and normalising resolves ".."

    people assume join protects them, which is exactly
    why this bug is so common


    and blocking ".." is not enough either

    path.resolve("/app/uploads", "/etc/passwd")
      → "/etc/passwd"
                │
                └─ an absolute segment discards the base.
                   no ".." anywhere in it.


The check, and why each half matters

    const base      = path.resolve("/app/uploads")
    const requested = path.resolve(base, userInput)

    if (requested !== base &&
        !requested.startsWith(base + path.sep)) reject
                                        └──┬──┘
                                    NOT cosmetic

    resolve FIRST, check AFTER
      inspecting raw input for ".." loses to encodings
      and separators. resolving gives one canonical
      string, then one comparison settles it.

    the + path.sep
      startsWith(base) alone accepts
        /app/uploads-evil/x        ← begins with the base!
      the separator forces a real directory boundary

    remaining gap
      a symlink inside uploads passes this check.
      if users can create them, use fs.realpath and
      compare again.


Better: remove the filter, do not improve it

    ACCEPT A PATH                   ACCEPT AN ID
    GET /files/../../etc/passwd     GET /files/12345
         │                                │
    validate it                      look it up
         │                                │
    a validation bug is a           nothing the user sent
    FILE DISCLOSURE                 reaches the filesystem
         │                                │
    and you still have to           and the lookup gives
    handle collisions, long         you access control
    names, odd characters           for free


os.cpus() lies in a container

    pod limited to 1 core, on a 64-core node

    os.cpus().length            →  64    the HOST
    os.availableParallelism()   →  1     usable

    sizing a worker pool from the first number gives you
    64 workers fighting over one core`,
      codeExample: {
        title: "Guarding a path, and the better alternative",
        code: `import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";

// ══ The vulnerability ═══════════════════════════════════════
const base = path.resolve("/app/uploads");

// join does not protect you. It normalises, and that
// resolves "..":
console.log(path.join(base, "../../etc/passwd"));   // /etc/passwd

// and an absolute segment drops the base entirely:
console.log(path.resolve(base, "/etc/passwd"));     // /etc/passwd


// ══ The guard ═══════════════════════════════════════════════
function safePath(userInput) {
  const requested = path.resolve(base, userInput);   // resolve FIRST

  if (requested !== base && !requested.startsWith(base + path.sep)) {
    throw new Error("Invalid path");                 // check AFTER
  }
  return requested;
}

for (const input of ["photo.jpg", "sub/ok.png", "../../etc/passwd",
                     "/etc/passwd", "..", "../uploads-evil/x"]) {
  try {
    console.log("allow", input, "->", safePath(input));
  } catch {
    console.log("BLOCK", input);
  }
}
// allow photo.jpg          -> /app/uploads/photo.jpg
// allow sub/ok.png         -> /app/uploads/sub/ok.png
// BLOCK ../../etc/passwd
// BLOCK /etc/passwd
// BLOCK ..
// BLOCK ../uploads-evil/x     ← this is why "+ path.sep" is there.
//                                startsWith(base) alone would
//                                have allowed it.

// remaining gap: a symlink inside uploads passes this check.
// if users can create them:
//   const real = await fs.realpath(requested);
//   then compare again.


// ══ Better: never let a path reach the filesystem ═══════════
const files = new Map([
  [12345, { owner: 7, stored: "a8f91c.jpg" }],
]);

async function download(fileId, userId) {
  const record = files.get(Number(fileId));
  if (!record) throw new Error("not found");
  if (record.owner !== userId) throw new Error("forbidden");

  return path.join(base, record.stored);
}

console.log(await download("12345", 7));   // /app/uploads/a8f91c.jpg
// await download("../../etc/passwd", 7);  // "not found"
//
// Nothing the user sent reaches the filesystem, and the
// lookup gives you access control for free. This is not a
// better filter, it is removing the filter. A generated
// stored name also kills collisions, absurd lengths and
// awkward characters.


// ══ node:os ═════════════════════════════════════════════════
console.log(os.platform());                 // darwin | linux | win32
console.log(os.tmpdir());                   // /var/folders/... or /tmp

// do not pick your own temp name
const dir = await fs.mkdtemp(path.join(os.tmpdir(), "upload-"));
console.log(dir);                           // .../upload-a8Fk2p
await fs.rm(dir, { recursive: true, force: true });
//
// two requests both choosing /tmp/upload.tmp corrupt each
// other, and a predictable name in a shared directory is
// its own small problem.

console.log(os.cpus().length);              // the HOST's CPUs
console.log(os.availableParallelism());     // what you can use
//
// in a container the first number is the whole node. Size
// worker pools from the second.`,
      },
      keyTakeaways: [
        "<b>Path traversal</b> is a user manipulating a path to reach files outside the intended directory.",
        "<b>`path.join` is not a safety measure.</b> It normalises, and normalising resolves `..`.",
        "So `join(\"/app/uploads\", \"../../etc/passwd\")` is `/etc/passwd`, with no warning.",
        "Blocking `..` is not enough: an absolute segment makes `resolve` discard the base.",
        "The guard is: resolve against a trusted base <b>first</b>, then check the result is inside it.",
        "Resolving first beats inspecting raw input, which loses to encodings and separators.",
        "The `+ path.sep` matters: `startsWith(base)` alone accepts `/app/uploads-evil/x`.",
        "A symlink inside the directory still passes. Use `fs.realpath` if users can create them.",
        "Better still: accept an <b>id</b>, look up the stored filename, and let nothing the user sent reach the filesystem.",
        "That is not a better filter, it is removing the filter, and the lookup gives you access control for free.",
        "`os.tmpdir()` instead of a hardcoded `/tmp`, and `fs.mkdtemp` instead of your own temp name.",
        "`os.cpus().length` reports the <b>host</b> CPUs in a container. `os.availableParallelism()` is what you can use.",
      ],
      commonMistakes: [
        "<b>Believing `path.join` sanitises user input</b> — it resolves `..` for you, which is the vulnerability.",
        "<b>Blocking `..` in the raw string</b> — encodings and separators get around it, and an absolute path needs no `..` at all.",
        "<b>`requested.startsWith(base)` without the separator</b> — `/app/uploads-evil` passes.",
        "<b>Accepting a filename from a user when an id would do</b> — a validation bug then becomes a file disclosure.",
        "<b>Storing files under user-supplied names</b> — collisions, absurd lengths, and characters the filesystem treats specially.",
        "<b>Hardcoding `/tmp`</b> — use `os.tmpdir()`, and `fs.mkdtemp` for a unique directory.",
        "<b>Sizing a worker pool from `os.cpus().length` in a container</b> — you get the host's core count, not your limit.",
      ],
      quiz: [
        {
          question: "Why does `path.join(\"/app/uploads\", userInput)` not protect you from traversal?",
          options: [
            "It only works on absolute paths",
            "Normalising is its job, and normalising resolves `..`, so the result can be outside the base",
            "It fails on Windows",
            "It needs `path.resolve` first",
          ],
          correctIndex: 1,
          explanation:
            "`join` is working correctly. The last lesson praised it for collapsing `..`, and this is the same behaviour with a user supplying a segment. People assume it sanitises, which is why the bug is so common.",
        },
        {
          question: "Why does the guard use `startsWith(base + path.sep)` rather than `startsWith(base)`?",
          options: [
            "For Windows compatibility",
            "Without the separator, a sibling directory like `/app/uploads-evil` also matches the prefix",
            "`startsWith` needs two arguments",
            "It makes the comparison faster",
          ],
          correctIndex: 1,
          explanation:
            "`/app/uploads-evil/x` genuinely begins with `/app/uploads`. Adding the separator forces the match to land on a real directory boundary.",
        },
        {
          question: "Why is `GET /files/12345` safer than accepting a filename, beyond being easier to validate?",
          options: [
            "Numbers are faster to parse",
            "Nothing the user sent ever reaches the filesystem, and the lookup can also check ownership",
            "It avoids using `node:path`",
            "It compresses better",
          ],
          correctIndex: 1,
          explanation:
            "It removes the filter rather than improving it. With a path, a validation bug is a file disclosure. With an id there is nothing to get wrong, and you get access control for free.",
        },
        {
          question: "Your pod is limited to one core on a 64-core node. What does `os.cpus().length` report?",
          options: ["1", "64, the host's CPUs", "0", "It throws in a container"],
          correctIndex: 1,
          explanation:
            "It describes the machine, not your limit. Sizing a worker pool from it gives you 64 workers fighting over one core. `os.availableParallelism()` is the one to use.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "`import fs from \"node:fs\"` then `await fs.readFile(\"x.txt\")`. What do you get?",
      options: [
        "The file contents",
        "`undefined`, and the await never resolves, because that is the callback form",
        "A Buffer",
        "An ENOENT error",
      ],
      correctIndex: 1,
      explanation:
        "The promise version lives in `node:fs/promises`. Same function name, different module. If an await on a fs call hangs, check the import first.",
    },
    {
      question: "`readFile(\"data.json\")` with no encoding. `JSON.parse` works but `.trim()` throws. Why?",
      options: [
        "The JSON was malformed",
        "You have a Buffer. `JSON.parse` coerces it to a string, `trim` is not a Buffer method",
        "`trim` needs an argument",
        "The file was empty",
      ],
      correctIndex: 1,
      explanation:
        "That coercion is what makes the missing encoding hide. The failure then surfaces somewhere unrelated to the call that caused it.",
    },
    {
      question: "Besides creating parents, what does `{ recursive: true }` give you on `mkdir`?",
      options: [
        "It sets permissions",
        "It does not fail when the directory already exists",
        "It creates the file too",
        "It resolves symlinks",
      ],
      correctIndex: 1,
      explanation:
        "That is usually the real reason to pass it. Without it you get `EEXIST` and end up catching an error you do not care about.",
    },
    {
      question: "Why prefer reading and catching over checking existence first?",
      options: [
        "It is only a style preference",
        "The file can vanish in the gap, it is one call instead of two, and the check answers a weaker question than the read",
        "`access` is deprecated",
        "`readFile` cannot fail",
      ],
      correctIndex: 1,
      explanation:
        "Between two awaits you yield to the event loop, so the window is however long other work takes. And `access` only tells you the check passed at that instant, for that process.",
    },
    {
      question: "Which property do you branch on for a filesystem error?",
      options: ["`error.name`", "`error.code`", "`error.message`", "`error.stack`"],
      correctIndex: 1,
      explanation:
        "`code` is a stable string like `ENOENT` or `EACCES`. `name` is `\"Error\"` for all of them, and message wording is not an interface.",
    },
    {
      question: "`console.log(await fs.glob(\"src/**/*.js\"))` prints what?",
      options: ["An array of paths", "`Object [AsyncGenerator] {}`", "The first match", "A Buffer"],
      correctIndex: 1,
      explanation:
        "`fs.glob` returns an async iterator, so awaiting it hands the iterator back. Use `for await`, or `Array.fromAsync` when you want the array.",
    },
    {
      question: "What is the strongest argument for `path.join` over string concatenation?",
      options: [
        "Windows uses backslashes",
        "`join` normalises, so you get one canonical string rather than whatever you happened to build",
        "It is faster",
        "It validates the path exists",
      ],
      correctIndex: 1,
      explanation:
        "Portability is the weaker argument, since Windows takes forward slashes. Non-canonical strings are the real cost: two paths for one file compare as different and break anything keyed on the path.",
    },
    {
      question: "Why is `path.join(\"/app/uploads\", userInput)` not a defence against traversal?",
      options: [
        "It only handles relative paths",
        "Normalising is its job, and that resolves `..`, so the result can land outside the base",
        "It throws on suspicious input",
        "It needs `resolve` first",
      ],
      correctIndex: 1,
      explanation:
        "The same normalising that makes `join` worth using is what lets a user climb out. Resolve against a trusted base and then check the result is inside it.",
    },
    {
      question: "Your pod has a one-core limit on a 64-core node. What does `os.cpus().length` report?",
      options: ["1", "64", "0", "It throws"],
      correctIndex: 1,
      explanation:
        "It describes the host machine, not your limit. `os.availableParallelism()` is the number to size a worker pool from.",
    },
  ],
  project: {
    name: "day-06",
    goal: "Build a directory size analyser that walks a tree recursively and totals file sizes by extension.",
    brief:
      "A small program that exercises most of the day: recursive readdir with file types, stat for sizes, extname for grouping, and CLI input from process.argv. The interesting parts are the edge cases. Files with no extension need a bucket of their own, node_modules will dwarf everything if you do not skip it, and a symlink loop will hang the walk forever.",
    steps: [
      "Create `day-06/` with `package.json` containing `\"type\": \"module\"`, and an `index.js`.",
      "Read the target directory from `process.argv[2]`, defaulting to `.` if nothing was passed.",
      "Write a recursive `walk(dir)` using `readdir(dir, { withFileTypes: true })`.",
      "Recurse when `entry.isDirectory()`, and handle the file when `entry.isFile()`.",
      "Build each full path with `path.join(dir, entry.name)`, since readdir gives you names only.",
      "For every file, `stat()` it and add `stats.size` to a Map keyed by `path.extname(file)`.",
      "Print each extension with a human-readable size, converting bytes to KB or MB yourself.",
      "Run it against a real project and check the numbers look sane.",
    ],
    acceptance: [
      "`node index.js ./some-dir` prints a total per extension, in a readable unit rather than raw bytes.",
      "Extensions are sorted largest first.",
      "`node_modules`, `.git` and `dist` are skipped, and skipping happens before descending rather than after.",
      "Files with no extension, like `Dockerfile`, `LICENSE` and `Makefile`, are grouped under `(no extension)`.",
      "`node index.js` with no argument analyses the current directory.",
      "A directory that does not exist prints `Error: directory not found` rather than an unexplained stack trace.",
      "That error handling branches on `error.code === \"ENOENT\"` and re-throws anything else.",
      "The walk skips symlinks, so a loop cannot hang it.",
    ],
    stretch: [
      "Print a file count alongside each total, so you can tell one huge file from a thousand small ones.",
      "Add a `--top N` flag that shows only the largest N extensions.",
      "Report the single largest file and its path.",
      "Replace the hand-written walk with `fs.glob` and an `exclude` callback, then say which version you prefer and why.",
      "Time both versions with `performance.now()` on a large tree, and check whether `withFileTypes` is doing what the lesson claims.",
    ],
  },
};
