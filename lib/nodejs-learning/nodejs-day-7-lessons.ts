import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_7_LESSONS: LessonDay = {
  day: 7,
  title: "Buffers, binary data and encodings",
  totalMinutes: 88,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "what-is-a-buffer",
      title: "What a Buffer is, and why Node needs one",
      durationMinutes: 10,
      explanation:
        "So far we have mostly worked with <b>text</b>:\n\n```text\n\"Hello Rajan\"\n```\n\nBut backend applications constantly handle data that is not plain text:\n\n• Images\n• PDFs\n• Audio\n• Video\n• Network packets\n• Encryption\n• Compressed files\n• File uploads\n\nFor all of that, Node uses <b>`Buffer`</b>.\n\nThe mental model for the whole day:\n\n```text\nText\n ↓\nEncoding\n ↓\nBytes\n ↓\nBuffer\n```\n\n---\n\n## What is a Buffer?\n\n<b>`Buffer`</b> (a Node object for working with raw binary bytes).\n\n```javascript\nconst buffer = Buffer.from(\"Hello\");\n\nconsole.log(buffer);\n```\n\n```text\n<Buffer 48 65 6c 6c 6f>\n```\n\nThose are the bytes in hexadecimal:\n\n```text\n\"Hello\"\n\nH    e    l    l    o\n↓    ↓    ↓    ↓    ↓\n48   65   6c   6c   6f\n```\n\nA Buffer is a convenient way to work with those bytes.\n\n---\n\n## Why does Node need this?\n\nJavaScript grew up around text and objects. But servers talk to things that deal in bytes:\n\n```text\nHTTP\nTCP\nFiles\nSockets\nImages\nEncryption\nCompression\n```\n\nAn image is not:\n\n```text\n\"hello world\"\n```\n\nIt is something like:\n\n```text\n89 50 4E 47 0D 0A 1A 0A ...\n```\n\nNode needs an efficient way to hold those bytes, and `Buffer` is it.\n\nThere is a second reason worth knowing, which explains why `Buffer` exists as its own thing rather than reusing an array. Buffer memory lives <b>outside the V8 heap</b>. That means a 500MB Buffer does not count against your heap limit, and it can be handed to the operating system for a file write or a socket send without copying it first. A regular JavaScript array of numbers could do neither.\n\nIt also means Buffer memory does not show up in `heapUsed`. Day 4's point about watching `rss` against a container limit applies directly: a leak of Buffers is invisible in heap metrics and very visible to the kernel that kills your process.\n\n---\n\n## A Buffer contains bytes\n\nEach byte holds:\n\n```text\n0 → 255\n```\n\n```javascript\nconst buffer = Buffer.from([\n  72,\n  101,\n  108,\n  108,\n  111\n]);\n\nconsole.log(buffer.toString());\n```\n\n```text\nHello\n```\n\nSo:\n\n```text\n72   → H\n101  → e\n108  → l\n108  → l\n111  → o\n```\n\nOne consequence of that 0 to 255 range: writing anything outside it does not throw, it <b>wraps</b>. `Buffer.from([256])` gives you a zero byte, and `[-1]` gives you 255. Silent truncation, which is worth remembering when you are computing byte values rather than typing them.\n\n---\n\n## A Buffer is a fixed-size window on bytes\n\nTwo things follow from that, and both surprise people who treat a Buffer like a string.\n\nIts <b>length cannot change</b>. There is no push or append. Growing means allocating a new one and copying, which is what `Buffer.concat` does for you.\n\nAnd <b>`buffer.length` is bytes, not characters</b>. For ASCII those happen to match, which is exactly why the difference stays hidden until some real text turns up. The next lessons come back to this.",
      diagram: `The whole day, in four lines

    Text        "Hello"
     ↓
    Encoding    utf8 / base64 / hex / latin1
     ↓
    Bytes       48 65 6c 6c 6f
     ↓
    Buffer      <Buffer 48 65 6c 6c 6f>


Why Buffer and not a normal array

    JS array of numbers          Buffer
    ┌───────────────────────┐    ┌───────────────────────┐
    │ lives on the V8 heap  │    │ lives OUTSIDE the heap│
    │ counts against your   │    │ no heap limit         │
    │ heap limit            │    │                       │
    │ must be copied before │    │ handed straight to    │
    │ the OS can use it     │    │ the OS: file writes,  │
    │                       │    │ socket sends          │
    └───────────────────────┘    └───────────────────────┘

    consequence for Day 4's monitoring:
      Buffer memory does NOT appear in heapUsed
        └─ a Buffer leak is invisible in heap metrics
           and very visible to the kernel that OOM-kills you
           watch rss


Bytes wrap, they do not throw

    Buffer.from([256])   →  <Buffer 00>      not an error
    Buffer.from([-1])    →  <Buffer ff>      not an error

    silent truncation. matters when you compute byte
    values rather than type them.


A Buffer is a FIXED window on bytes

    no push, no append. length cannot change.
      growing = allocate a new one and copy
      which is what Buffer.concat does for you

    buffer.length is BYTES, not characters
      for ASCII they match, which is why the
      difference stays hidden until real text arrives`,
      codeExample: {
        title: "Bytes, and where they live",
        code: `// ── Text in, bytes out ──────────────────────────────────────
const buffer = Buffer.from("Hello");

console.log(buffer);                  // <Buffer 48 65 6c 6c 6f>
console.log(buffer.length);           // 5
console.log([...buffer]);             // [ 72, 101, 108, 108, 111 ]
console.log(buffer.toString());       // Hello


// ── Bytes in, text out ──────────────────────────────────────
const fromBytes = Buffer.from([72, 101, 108, 108, 111]);
console.log(fromBytes.toString());    // Hello


// ── Values outside 0..255 wrap silently ─────────────────────
console.log(Buffer.from([256]));      // <Buffer 00>   not an error
console.log(Buffer.from([-1]));       // <Buffer ff>   not an error
console.log(Buffer.from([300]));      // <Buffer 2c>   300 - 256
//
// Worth remembering when byte values are computed rather
// than typed.


// ── A Buffer is a fixed window ──────────────────────────────
const fixed = Buffer.from("abc");
// fixed.push("d");                   ✗ not a method
// fixed.length = 10;                 ✗ has no effect

// growing means a new allocation:
const grown = Buffer.concat([fixed, Buffer.from("d")]);
console.log(grown.toString());        // abcd
console.log(fixed.length, grown.length);   // 3 4


// ── Buffer memory is off-heap ───────────────────────────────
const mb = (b) => Math.round(b / 1024 / 1024);
const before = process.memoryUsage();

const big = Buffer.alloc(200 * 1024 * 1024);      // 200MB

const after = process.memoryUsage();
console.log("heapUsed delta:", mb(after.heapUsed - before.heapUsed), "MB");
console.log("rss delta:     ", mb(after.rss - before.rss), "MB");
//
// heapUsed barely moves. rss jumps by ~200MB.
//
// So a Buffer leak is invisible in heap metrics and entirely
// visible to the kernel. Day 4: watch rss against your
// container limit.

console.log(big.length > 0);`,
      },
      keyTakeaways: [
        "A <b>`Buffer`</b> holds raw bytes, which is what files, sockets, images and crypto actually deal in.",
        "The model for the day: text, then an encoding, then bytes, then a Buffer.",
        "Each byte holds 0 to 255. Values outside that <b>wrap silently</b> rather than throwing.",
        "Buffer memory lives <b>outside the V8 heap</b>, so a large Buffer does not count against your heap limit.",
        "That also means it can go straight to the OS for a write or a socket send, with no copy.",
        "And it means Buffer memory does not show up in `heapUsed`. Watch `rss`.",
        "A Buffer leak is therefore invisible in heap metrics and very visible to whatever OOM-kills you.",
        "A Buffer has a <b>fixed length</b>. Growing means allocating and copying, which is `Buffer.concat`.",
        "`buffer.length` is <b>bytes</b>, not characters. For ASCII they match, which hides the difference.",
      ],
      commonMistakes: [
        "<b>Treating a Buffer like a string</b> — no push, no append, and the length is fixed.",
        "<b>Reading `buffer.length` as a character count</b> — it is bytes, and they differ the moment text is not ASCII.",
        "<b>Expecting a byte over 255 to throw</b> — it wraps. `Buffer.from([256])` is a zero byte.",
        "<b>Watching only `heapUsed` when you handle Buffers</b> — that memory is off-heap and will not appear there.",
        "<b>Building a Buffer up in a loop with `concat`</b> — every call allocates and copies. Collect the pieces and concat once.",
      ],
      quiz: [
        {
          question: "You allocate a 200MB Buffer. What happens to `heapUsed` and `rss`?",
          options: [
            "Both jump by about 200MB",
            "`heapUsed` barely moves, `rss` jumps by about 200MB",
            "Both stay the same",
            "`heapUsed` jumps, `rss` stays flat",
          ],
          correctIndex: 1,
          explanation:
            "Buffer memory lives outside the V8 heap. That is why a Buffer leak is invisible in heap metrics but perfectly visible to the kernel that eventually kills the process.",
        },
        {
          question: "What does `Buffer.from([256])` produce?",
          options: ["A RangeError", "`<Buffer 00>`", "`<Buffer ff>`", "`<Buffer 01 00>`"],
          correctIndex: 1,
          explanation:
            "A byte holds 0 to 255, and values outside that wrap rather than throwing. Silent truncation, which matters when byte values are computed rather than typed.",
        },
        {
          question: "Why can a Buffer be handed to the OS without copying, when a JavaScript array cannot?",
          options: [
            "Buffers are smaller",
            "Buffer memory is allocated outside the V8 heap, in a form the OS can read directly",
            "Arrays are immutable",
            "The OS understands JavaScript objects",
          ],
          correctIndex: 1,
          explanation:
            "That off-heap allocation is the point of the type. A file write or socket send can use the memory as it stands, which is why Buffers are what every I/O API in Node speaks.",
        },
      ],
    },
    {
      id: "creating-buffers",
      title: "from, alloc and allocUnsafe",
      durationMinutes: 10,
      explanation:
        "Three ways to get a Buffer, and one of them has a security edge.\n\n---\n\n## `Buffer.from()`\n\n<b>`Buffer.from()`</b> (creates a Buffer from existing data).\n\nMost common:\n\n```javascript\nconst buffer = Buffer.from(\"Hello\");\n```\n\nFrom an array:\n\n```javascript\nconst buffer = Buffer.from([\n  72,\n  101,\n  108,\n  108,\n  111\n]);\n```\n\nOr from another typed array.\n\nOne detail: `Buffer.from(typedArray)` <b>copies</b>, while `Buffer.from(arrayBuffer)` <b>shares</b> the same memory. So writing through one view changes what the other sees. That is occasionally what you want and usually a surprise.\n\n---\n\n## `Buffer.alloc()`\n\n<b>`Buffer.alloc()`</b> (creates a Buffer of a given size with every byte set to zero).\n\n```javascript\nconst buffer = Buffer.alloc(10);\n\nconsole.log(buffer);\n```\n\n```text\n<Buffer 00 00 00 00 00 00 00 00 00 00>\n```\n\nSafe, because the memory starts initialised.\n\n```text\nBuffer.alloc(5)\n\n↓\n00 00 00 00 00\n```\n\n---\n\n## `Buffer.allocUnsafe()`\n\n<b>`Buffer.allocUnsafe()`</b> (creates a Buffer without initialising its memory).\n\n```javascript\nconst buffer = Buffer.allocUnsafe(10);\n```\n\nThe contents are not guaranteed to be zero. The values are whatever was already there.\n\n---\n\n## Why that is dangerous\n\nBecause the memory may hold old data:\n\n```text\nPrevious data\n    ↓\nMemory\n    ↓\nallocUnsafe()\n    ↓\nYour Buffer\n```\n\nSend that Buffer to a user before writing every byte and you can leak whatever was previously in that memory. In a server process, that previous data is other requests: another user's session token, part of a password, a decrypted payload.\n\nSo:\n\n```javascript\nBuffer.alloc(100);\n```\n\nis safer than:\n\n```javascript\nBuffer.allocUnsafe(100);\n```\n\nA warning about testing this: on a freshly started process the memory has often never been used, so `allocUnsafe` returns all zeros and looks perfectly safe. It is not. It looks safe exactly when you check it and fails later under real load, which is the worst possible failure shape.\n\n---\n\n## When is it useful?\n\nIt can be faster, because Node skips zeroing every byte. But you must overwrite the whole buffer before anything reads it:\n\n```javascript\nconst buffer = Buffer.allocUnsafe(10);\n\nbuffer.fill(0);\n```\n\nNow you have initialised it yourself, which of course costs the same as `alloc` would have.\n\nThe honest use is a buffer you are about to fill completely anyway, such as one you immediately read a fixed number of bytes into. Even then the win is small, so:\n\n### The rule\n\n```text\nNeed a new empty Buffer?\n        ↓\nBuffer.alloc()\n\nNeed performance and understand memory?\n        ↓\nBuffer.allocUnsafe()\n```\n\n> <b>Prefer `Buffer.alloc()` unless you have a specific reason not to.</b>\n\nOne related trap: `Buffer.alloc(n)` where `n` comes from user input is a way to let someone allocate a lot of memory very cheaply. A `Content-Length` header you trust becomes a memory exhaustion attack. Cap the size before you allocate.\n\nAnd for completeness, the old `new Buffer(...)` constructor is deprecated. It behaved differently depending on whether you passed a number or a string, which meant `new Buffer(userInput)` sometimes allocated uninitialised memory and sometimes copied text. Use the named methods.",
      diagram: `The three constructors

    Buffer.from(data)      copy existing data in
    Buffer.alloc(n)        n zeroed bytes          ← default
    Buffer.allocUnsafe(n)  n bytes of whatever
                           was already there


Why allocUnsafe leaks

    memory previously used by
    another request
        │
        │  freed, but NOT cleared
        ↓
    Buffer.allocUnsafe(1024)
        │
        ↓
    your buffer, holding someone else's
    session token / password fragment /
    decrypted payload
        │
        ↓
    you send it before filling it


The reason it is hard to catch

    fresh process   memory never used  →  all zeros
                                          looks SAFE

    under load      memory recycled    →  real data
                                          leaks

    it looks correct exactly when you test it.
    the worst failure shape there is.


from() copies, or shares, depending on the input

    Buffer.from(typedArray)    COPIES
    Buffer.from(arrayBuffer)   SHARES the same memory
                                 └─ writing through one view
                                    changes the other


alloc(n) with a user-controlled n

    Content-Length: 999999999
        ↓
    Buffer.alloc(contentLength)
        ↓
    a cheap memory exhaustion attack

    cap the size BEFORE you allocate`,
      codeExample: {
        title: "Which constructor, and why",
        code: `// ── from: copy existing data ────────────────────────────────
console.log(Buffer.from("Hello"));            // <Buffer 48 65 ...>
console.log(Buffer.from([72, 105]));          // <Buffer 48 69>
console.log(Buffer.from("SGVsbG8=", "base64").toString());   // Hello


// ── alloc: zeroed, and the default choice ───────────────────
const safe = Buffer.alloc(10);
console.log(safe);                  // <Buffer 00 00 00 ... 00>
console.log(safe.every((b) => b === 0));      // true

// alloc takes a fill value too
console.log(Buffer.alloc(4, 0xff));           // <Buffer ff ff ff ff>


// ── allocUnsafe: whatever was there ─────────────────────────
const unsafe = Buffer.allocUnsafe(32);
console.log("all zero?", unsafe.every((b) => b === 0));
//
// On a freshly started process this often prints true, because
// the memory has never been used. That is exactly what makes
// it dangerous: it looks safe when you test it and leaks
// later under real load.


// ── The leak, in shape ──────────────────────────────────────
// function buildResponse(size) {
//   const out = Buffer.allocUnsafe(size);
//   out.write("OK");                 // wrote 2 bytes
//   return out;                      // sent all size bytes
// }
//
// Everything after byte 2 is whatever the process had in that
// memory before: another request's token, a password fragment,
// a decrypted payload.


// ── If you use it, fill it ──────────────────────────────────
const filled = Buffer.allocUnsafe(10);
filled.fill(0);
console.log(filled.every((b) => b === 0));    // true
//   which costs the same as alloc would have, so the honest
//   use is a buffer you overwrite completely anyway


// ── from(arrayBuffer) SHARES memory ─────────────────────────
const ab = new ArrayBuffer(4);
const shared = Buffer.from(ab);
const view = new Uint8Array(ab);

view[0] = 65;
console.log(shared[0]);             // 65   ← same memory

const copied = Buffer.from(new Uint8Array([65, 66]));
console.log(copied[0]);             // 65, but a copy


// ── alloc with a user-controlled size ───────────────────────
function readBody(contentLength) {
  const MAX = 10 * 1024 * 1024;               // cap FIRST
  if (contentLength > MAX) throw new Error("payload too large");
  return Buffer.alloc(contentLength);
}
// Buffer.alloc(Number(headers["content-length"]))
//   is a cheap way to let someone exhaust your memory.


// ── new Buffer() is deprecated, and for a reason ────────────
// new Buffer(10)        → uninitialised memory
// new Buffer("10")      → the text "10"
//   the same call site behaving differently on user input
//   is why the named methods replaced it.`,
      },
      keyTakeaways: [
        "`Buffer.from()` copies existing data in: a string, an array, another typed array.",
        "`Buffer.from(typedArray)` copies. `Buffer.from(arrayBuffer)` <b>shares</b> the same memory.",
        "`Buffer.alloc(n)` gives you `n` zeroed bytes. This is the default choice.",
        "`Buffer.allocUnsafe(n)` skips the zeroing, so the contents are whatever was there before.",
        "In a server, \"whatever was there\" means other requests: tokens, password fragments, decrypted payloads.",
        "It <b>looks safe when you test it</b>, because fresh memory is often already zero. It fails later under load.",
        "If you do use it, `fill(0)` first, which costs what `alloc` would have.",
        "`Buffer.alloc(n)` with a user-controlled `n` is a cheap memory exhaustion attack. Cap the size first.",
        "`new Buffer(...)` is deprecated because it allocated or copied depending on the argument type.",
      ],
      commonMistakes: [
        "<b>Reaching for `allocUnsafe` for speed</b> — the win is small and the failure mode is leaking other requests' memory.",
        "<b>Concluding `allocUnsafe` is fine because it returned zeros</b> — fresh memory is often clean. That proves nothing about production.",
        "<b>Returning an `allocUnsafe` buffer you only partially wrote</b> — everything past your write is old process memory.",
        "<b>Allocating from `Content-Length` without a cap</b> — one request can ask for all your memory.",
        "<b>Assuming `Buffer.from(arrayBuffer)` copies</b> — it shares, so writes through either view are visible in both.",
        "<b>Using `new Buffer()`</b> — deprecated, and its behaviour depended on the argument type.",
      ],
      quiz: [
        {
          question: "You test `Buffer.allocUnsafe(32)` and every byte is zero. What has that told you?",
          options: [
            "It is safe to use",
            "Almost nothing. Fresh process memory is often already zero, and it will contain real data under load",
            "The allocation failed",
            "Node zeroes it anyway",
          ],
          correctIndex: 1,
          explanation:
            "That is exactly what makes it dangerous. It looks correct when you check it and leaks recycled memory later, which is the worst possible failure shape.",
        },
        {
          question: "Why is `Buffer.alloc(Number(req.headers[\"content-length\"]))` a problem?",
          options: [
            "`content-length` is always a string",
            "A single request can ask you to allocate an enormous amount of memory",
            "`alloc` does not accept a variable",
            "It leaks other requests' data",
          ],
          correctIndex: 1,
          explanation:
            "Allocation is cheap for the attacker and expensive for you. Cap the value before it reaches `alloc`, the same way you would validate any other user-controlled number.",
        },
        {
          question: "What is the difference between `Buffer.from(typedArray)` and `Buffer.from(arrayBuffer)`?",
          options: [
            "No difference",
            "The first copies, the second shares the same underlying memory",
            "The first shares, the second copies",
            "The second throws",
          ],
          correctIndex: 1,
          explanation:
            "Sharing means a write through either view is visible in both. Occasionally that is what you want, and usually it is a surprise.",
        },
      ],
    },
    {
      id: "utf8-and-multibyte",
      title: "UTF-8 and multi-byte characters",
      durationMinutes: 10,
      explanation:
        "An <b>encoding</b> (a rule for converting between bytes and text).\n\nThe ones Node knows:\n\n```text\nutf8\nbase64\nhex\nlatin1\n```\n\n---\n\n## UTF-8\n\n<b>UTF-8</b> (a variable-length encoding representing Unicode text as bytes).\n\n```javascript\nconst buffer = Buffer.from(\"Hello\", \"utf8\");\n\nconsole.log(buffer);\n```\n\n```javascript\nconsole.log(buffer.toString(\"utf8\"));\n```\n\n```text\nHello\n```\n\nFor ASCII, UTF-8 uses one byte per character. It is also Node's default, so `Buffer.from(str)` and `buf.toString()` both mean UTF-8 unless you say otherwise.\n\nBut not every character is one byte, and that word <b>variable-length</b> is the whole lesson.\n\n---\n\n## Multi-byte characters\n\n```javascript\nconst buffer = Buffer.from(\"😀\");\n```\n\nThe emoji takes several bytes:\n\n```javascript\nconsole.log(buffer);\n```\n\nFour bytes for this one, `f0 9f 98 80`.\n\n```text\nCharacter\n   ↓\n😀\n   ↓\nMultiple bytes\n```\n\nThis is why you must be careful processing UTF-8 in chunks. We come back to it later.\n\n---\n\n## How many bytes\n\nUTF-8 uses one to four bytes per character, by range:\n\n```text\nASCII  (a, 1, ?)        1 byte\nLatin, Greek (é, ü)     2 bytes\nMost of Asia (नमस्ते, 日)  3 bytes\nEmoji, rare scripts     4 bytes\n```\n\nSo `\"नमस्ते\"` is 6 characters and 18 bytes. `\"é\"` is one character and 2 bytes.\n\nThat asymmetry is where the bugs live, because ASCII-only test data makes bytes and characters look like the same number.\n\n---\n\n## Three different lengths\n\nFor the same emoji you can get three different answers, and each is correct about something different:\n\n```javascript\n\"😀\".length              // 2   UTF-16 code units, JS strings\nBuffer.byteLength(\"😀\")  // 4   UTF-8 bytes\n[...\"😀\"].length         // 1   actual characters\n```\n\nSo a JavaScript string is not counted in characters either. `\"😀\".length` is 2 because JS strings are UTF-16 internally and this emoji needs a surrogate pair.\n\nThat is why a 280-character limit checked with `.length` rejects text that is well under the limit, and why `str.slice()` at an arbitrary index can cut a character in half. Spreading into an array iterates by character, which is what you usually meant.\n\n---\n\n## Slicing bytes cuts characters\n\nThe practical consequence:\n\n```javascript\nconst buf = Buffer.from(\"😀\");\n\nbuf.subarray(0, 2).toString(\"utf8\");   // \"\\ufffd\"\n```\n\nYou get the replacement character, because two bytes is not a complete UTF-8 sequence. Nothing throws. You just get corrupted text.\n\nAnd `Buffer.byteLength(str)` is what you want before allocating for text. Using `str.length` under-allocates for anything non-ASCII, which is a truncation bug that only shows up when someone types an accent.",
      diagram: `UTF-8 is variable length. That is the whole lesson.

    "a"        1 byte     61
    "é"        2 bytes    c3 a9
    "日"       3 bytes    e6 97 a5
    "😀"       4 bytes    f0 9f 98 80

    "नमस्ते"  =  6 characters,  18 bytes

    ASCII-only test data makes bytes and characters look
    like the same number. They are not.


Three lengths, all correct about different things

    "😀".length              →  2    UTF-16 code units
                                     (JS strings are UTF-16)
    Buffer.byteLength("😀")  →  4    UTF-8 bytes
    [..."😀"].length         →  1    actual characters

    so a 280-character limit checked with .length rejects
    text well under the limit

    and str.slice(0, 140) can cut a character in half


Cutting bytes corrupts characters, silently

    Buffer.from("😀")     f0 9f 98 80
                          └──┬──┘ └─┬─┘
                        first 2   last 2

    subarray(0, 2).toString("utf8")   →  "\\ufffd"  ✗
                                          the replacement
                                          character

    nothing throws. you just get corrupted text.
    this is the streaming bug, three lessons from now.


Allocate with byteLength, not .length

    Buffer.alloc(str.length)             ✗ under-allocates
    Buffer.alloc(Buffer.byteLength(str)) ✓

    a truncation bug that appears the first time
    someone types an accent`,
      codeExample: {
        title: "Bytes are not characters",
        code: `// ── ASCII: bytes and characters match, which hides it ───────
console.log(Buffer.from("Hello").length);        // 5
console.log("Hello".length);                     // 5   ← same


// ── Real text: they diverge ─────────────────────────────────
const cases = ["a", "é", "日", "😀", "नमस्ते"];

for (const s of cases) {
  console.log(
    JSON.stringify(s).padEnd(10),
    "bytes:", String(Buffer.byteLength(s)).padEnd(3),
    "| .length:", String(s.length).padEnd(3),
    "| chars:", [...s].length,
  );
}
// "a"        bytes: 1   | .length: 1   | chars: 1
// "é"        bytes: 2   | .length: 1   | chars: 1
// "日"       bytes: 3   | .length: 1   | chars: 1
// "😀"       bytes: 4   | .length: 2   | chars: 1    ← .length is 2!
// "नमस्ते"  bytes: 18  | .length: 6   | chars: 6


// ── Why .length is 2 for one emoji ──────────────────────────
console.log([..."😀"].length);         // 1   actual characters
console.log("😀".length);              // 2   UTF-16 code units
//
// JS strings are UTF-16 internally, and this emoji needs a
// surrogate pair. So a 280-character limit checked with
// .length rejects text that is well under the limit.


// ── Slicing bytes corrupts characters, silently ─────────────
const emoji = Buffer.from("😀");
console.log(emoji);                    // <Buffer f0 9f 98 80>

const firstHalf = emoji.subarray(0, 2);
const secondHalf = emoji.subarray(2);

console.log(JSON.stringify(firstHalf.toString("utf8")));   // "\\ufffd"
console.log(JSON.stringify(
  firstHalf.toString("utf8") + secondHalf.toString("utf8")
));
// "\\ufffd\\ufffd\\ufffd"     ← corrupted, and nothing threw
//
// This is the streaming bug, three lessons from now.


// ── Allocate with byteLength, not .length ───────────────────
const text = "café";
console.log(text.length);                        // 4
console.log(Buffer.byteLength(text));            // 5   ← é is 2 bytes

const wrong = Buffer.alloc(text.length);
wrong.write(text);
console.log(JSON.stringify(wrong.toString()));   // "caf\\ufffd"  truncated

const right = Buffer.alloc(Buffer.byteLength(text));
right.write(text);
console.log(JSON.stringify(right.toString()));   // "café"


// ── utf8 is the default, both directions ────────────────────
console.log(Buffer.from("Hello").equals(Buffer.from("Hello", "utf8")));
console.log(Buffer.from("Hello").toString() === Buffer.from("Hello").toString("utf8"));`,
      },
      keyTakeaways: [
        "An <b>encoding</b> is a rule for turning bytes into text and back.",
        "UTF-8 is <b>variable length</b>: one to four bytes per character.",
        "ASCII is one byte, accented Latin two, most Asian scripts three, emoji four.",
        "UTF-8 is Node's default, so `Buffer.from(str)` and `buf.toString()` both assume it.",
        "ASCII-only test data makes bytes and characters look like the same number.",
        "Three different lengths, all correct: `str.length` is UTF-16 units, `Buffer.byteLength` is bytes, `[...str].length` is characters.",
        "`\"😀\".length` is <b>2</b>, because JS strings are UTF-16 and it needs a surrogate pair.",
        "So a character limit checked with `.length` rejects text well under it, and `slice` can cut a character in half.",
        "Cutting a Buffer mid-character gives you the replacement character. <b>Nothing throws.</b>",
        "Allocate with `Buffer.byteLength(str)`, never `str.length`, or you truncate non-ASCII text.",
      ],
      commonMistakes: [
        "<b>Assuming one character is one byte</b> — true only for ASCII, which is exactly what your test data is.",
        "<b>Using `str.length` for a character limit</b> — an emoji counts as 2, so valid input gets rejected.",
        "<b>`Buffer.alloc(str.length)` before writing text</b> — under-allocates for anything non-ASCII and truncates it.",
        "<b>Slicing a Buffer at an arbitrary byte offset and decoding it</b> — you get replacement characters, with no error.",
        "<b>`str.slice(0, 140)` on user text</b> — the cut can land inside a surrogate pair and produce a broken character.",
        "<b>Testing only with English text</b> — every bug in this lesson is invisible until real input arrives.",
      ],
      quiz: [
        {
          question: "What is `\"😀\".length` in JavaScript?",
          options: ["1", "2", "4", "It throws"],
          correctIndex: 1,
          explanation:
            "JS strings are UTF-16 internally and this emoji needs a surrogate pair, so `.length` is 2. `Buffer.byteLength` gives 4 UTF-8 bytes, and `[...str].length` gives 1 actual character.",
        },
        {
          question: "You decode the first two bytes of a four-byte emoji with `toString(\"utf8\")`. What happens?",
          options: [
            "A RangeError",
            "You get the replacement character, and nothing throws",
            "You get the first half of the emoji",
            "Node buffers the incomplete sequence",
          ],
          correctIndex: 1,
          explanation:
            "Two bytes is not a valid UTF-8 sequence, so the decoder substitutes the replacement character. Silent corruption is exactly why streaming UTF-8 needs care.",
        },
        {
          question: "You write `\"café\"` into `Buffer.alloc(\"café\".length)`. What do you get back?",
          options: [
            "`\"café\"`",
            "Truncated text, because `é` needs two bytes and the buffer is one short",
            "A RangeError",
            "`\"caf\"`",
          ],
          correctIndex: 1,
          explanation:
            "`.length` is 4 but the UTF-8 encoding needs 5 bytes. Use `Buffer.byteLength(str)` when sizing a buffer for text.",
        },
      ],
    },
    {
      id: "base64-hex-latin1",
      title: "Base64, hex and latin1",
      durationMinutes: 10,
      explanation:
        "Three more encodings, and one very common misunderstanding.\n\n---\n\n## Base64\n\n<b>Base64</b> (an encoding that represents binary data using text characters).\n\n```javascript\nconst buffer = Buffer.from(\"Hello\");\n\nconst encoded = buffer.toString(\"base64\");\n\nconsole.log(encoded);\n```\n\n```text\nSGVsbG8=\n```\n\nAnd back:\n\n```javascript\nconst decoded = Buffer.from(\n  \"SGVsbG8=\",\n  \"base64\"\n);\n\nconsole.log(decoded.toString(\"utf8\"));\n```\n\n```text\nHello\n```\n\n---\n\n## Base64 is not encryption\n\nImportant.\n\n```text\n\"Hello\"\n    ↓\n\"SGVsbG8=\"\n```\n\nAnyone can decode it. So:\n\n```text\nBase64\n ≠\nEncryption\n```\n\nIt is a format, not a secret. Common uses:\n\n```text\nBinary → text\nEmbedding binary in JSON\nEmail attachments\nData URLs\nAPIs\n```\n\nThe reason it exists is worth knowing, because it explains why it is everywhere. Plenty of channels only carry text safely: JSON has no byte type, HTTP headers are text, email was built for text. Base64 lets you push arbitrary bytes through them by using only characters that survive the trip.\n\nWhich is also why a `Basic` auth header is base64. That is not security, it is transport, and it is exactly why Basic auth requires HTTPS to mean anything.\n\nThe cost is size. Base64 turns every 3 bytes into 4 characters, so encoded data is about <b>33% larger</b>. Storing images in a database as base64 costs you a third more space and a decode on every read.\n\n---\n\n## Hex\n\n<b>Hexadecimal encoding</b> (each byte as two hex characters).\n\n```javascript\nconst buffer = Buffer.from(\"Hello\");\n\nconsole.log(buffer.toString(\"hex\"));\n```\n\n```text\n48656c6c6f\n```\n\nEach byte:\n\n```text\n48\n65\n6c\n6c\n6f\n```\n\nSo:\n\n```text\n1 byte\n ↓\n2 hex characters\n```\n\nThat doubles the size, which is worse than base64, so hex is not for transport. It is for <b>reading</b>. One byte maps to exactly two characters at a fixed position, so you can count offsets by eye. That is why file signatures, hashes and protocol dumps are always shown in hex.\n\n```javascript\nconsole.log(buf.subarray(0, 8).toString(\"hex\"));\n// 89504e470d0a1a0a   ← a PNG, and you can see it\n```\n\nThe day's project uses exactly that.\n\n---\n\n## Latin-1\n\n<b>Latin-1</b> (maps each byte directly to one of the first 256 Unicode code points).\n\n```javascript\nconst buffer = Buffer.from(\n  [65, 66, 67]\n);\n\nconsole.log(\n  buffer.toString(\"latin1\")\n);\n```\n\n```text\nABC\n```\n\nUseful in specific binary and protocol situations, but:\n\n> <b>Do not use Latin-1 instead of UTF-8 for normal text.</b>\n\nWhat makes it occasionally handy is that it is the one encoding that <b>never fails</b>. Every byte 0 to 255 maps to exactly one character, so a round trip through latin1 is lossless for arbitrary binary. That is why you see it for reading ASCII tags out of a binary format, like the `IHDR` marker in a PNG.\n\nAnd it is why using it for text is a trap: decoding UTF-8 bytes as latin1 does not error, it gives you mojibake. `\"café\"` comes back as `\"cafÃ©\"`, because the two UTF-8 bytes became two separate latin1 characters. A silent corruption that looks like a font problem.\n\n---\n\n## Converting between them\n\nDecode base64 to bytes:\n\n```javascript\nconst image = Buffer.from(\n  base64Data,\n  \"base64\"\n);\n```\n\nThen write those bytes straight to a file:\n\n```javascript\nawait fs.writeFile(\n  \"image.png\",\n  image\n);\n```\n\nNo string conversion needed. That is the point of Buffer: the bytes are the same bytes whichever encoding you name on the way in or out. An encoding is just how you <b>look</b> at them.",
      diagram: `Same bytes, three ways of looking at them

    bytes         48    65    6c    6c    6f
                   │     │     │     │     │
    utf8          "H"   "e"   "l"   "l"   "o"      →  "Hello"
    hex           48    65    6c    6c    6f       →  "48656c6c6f"
    base64        ─────── SGVsbG8= ───────         →  4 chars per 3 bytes
    latin1        "H"   "e"   "l"   "l"   "o"      →  "Hello"

    an encoding is how you LOOK at the bytes,
    not a change to them


base64 is transport, not secrecy

    why it exists: some channels only carry text
      JSON has no byte type
      HTTP headers are text
      email was built for text

    Authorization: Basic cmFqYW46c2VjcmV0
                         └─ decodes in one line

    that is why Basic auth needs HTTPS to mean anything

    cost: 3 bytes → 4 characters, about +33%
      storing images as base64 costs a third more space
      and a decode on every read


hex is for READING, never transport

    +100% size, worse than base64
    but: 1 byte = 2 characters at a FIXED position
         so you can count offsets by eye

    buf.subarray(0, 8).toString("hex")
      → 89504e470d0a1a0a        a PNG, visibly

    which is why signatures, hashes and protocol
    dumps are always shown in hex


latin1 never fails, which is the trap

    every byte 0..255 → exactly one character
      lossless round trip for arbitrary binary
      handy for ASCII tags inside a binary format
      ("IHDR" in a PNG)

    but decoding UTF-8 as latin1 does not ERROR:
      "café"  →  "cafÃ©"
                  └─ the 2 UTF-8 bytes became 2 latin1
                     characters. mojibake that looks
                     like a font problem.`,
      codeExample: {
        title: "Choosing an encoding for the job",
        code: `const buffer = Buffer.from("Hello");

// ── The same bytes, four views ──────────────────────────────
console.log(buffer.toString("utf8"));      // Hello
console.log(buffer.toString("hex"));       // 48656c6c6f
console.log(buffer.toString("base64"));    // SGVsbG8=
console.log(buffer.toString("latin1"));    // Hello


// ── base64: for pushing bytes through a text channel ────────
const encoded = buffer.toString("base64");
console.log(Buffer.from(encoded, "base64").toString());     // Hello

// it is NOT a secret
const authHeader = Buffer.from("rajan:secret123").toString("base64");
console.log(authHeader);                            // cmFqYW46c2VjcmV0MTIz
console.log(Buffer.from(authHeader, "base64").toString());  // rajan:secret123
//   one line to reverse. That is why Basic auth needs HTTPS.

// and the size cost
const bytes = Buffer.alloc(3000);
console.log(bytes.length, bytes.toString("base64").length);
// 3000 4000        ← about +33%


// ── hex: for reading offsets by eye ─────────────────────────
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUg", "base64");
console.log(png.subarray(0, 8).toString("hex"));
// 89504e470d0a1a0a       ← the PNG signature, visibly
//
// 1 byte = 2 characters at a fixed position, which is why
// signatures, hashes and protocol dumps use hex. It is +100%
// size, so never for transport.

console.log(Buffer.from("48656c6c6f", "hex").toString());   // Hello


// ── latin1: never fails, which is the trap ──────────────────
console.log(Buffer.from([65, 66, 67]).toString("latin1"));   // ABC

// handy for ASCII tags inside binary
console.log(png.subarray(12, 16).toString("latin1"));        // IHDR

// but wrong for text, and it does not tell you
const cafe = Buffer.from("café");                 // utf8 bytes
console.log(cafe.toString("latin1"));             // cafÃ©   ← mojibake
console.log(cafe.toString("utf8"));               // café
//
// No error either way. The corruption just looks like a
// font problem to whoever reports it.


// ── Bytes stay bytes: no string in the middle ───────────────
// const image = Buffer.from(base64Data, "base64");
// await fs.writeFile("image.png", image);
//
// Never .toString() a binary payload on the way through.
// That is the whole point of Buffer.`,
      },
      keyTakeaways: [
        "An encoding is how you <b>look</b> at bytes. The bytes themselves do not change.",
        "<b>Base64 is not encryption.</b> It reverses in one line.",
        "It exists because some channels only carry text: JSON has no byte type, headers are text, email was built for text.",
        "That is why `Basic` auth is base64, and why Basic auth needs HTTPS to mean anything.",
        "Base64 costs about <b>+33% size</b>: every 3 bytes become 4 characters.",
        "<b>Hex is for reading</b>, not transport. It doubles the size but puts one byte at exactly two fixed characters.",
        "That is why file signatures, hashes and protocol dumps are always shown in hex.",
        "<b>Latin-1 never fails</b>: every byte maps to one character, so it round-trips arbitrary binary losslessly.",
        "Which is the trap: decoding UTF-8 as latin1 gives you `\"cafÃ©\"` with no error at all.",
        "Never `.toString()` a binary payload on the way through. Keep it as a Buffer.",
      ],
      commonMistakes: [
        "<b>Treating base64 as a way to hide something</b> — it is a format. Anyone can decode it instantly.",
        "<b>Storing images as base64 in a database</b> — a third more space and a decode on every read.",
        "<b>Using hex for transport</b> — double the size, for a benefit only a human reader gets.",
        "<b>Decoding UTF-8 bytes as latin1</b> — no error, just mojibake that gets reported as a font bug.",
        "<b>Using latin1 as a general text encoding</b> — it cannot represent anything past code point 255.",
        "<b>Converting a binary payload to a string on the way to disk</b> — pass the Buffer, or you corrupt it.",
        "<b>Forgetting base64 padding</b> — hand-trimming the `=` can break decoders that expect it.",
      ],
      quiz: [
        {
          question: "Why is HTTP Basic auth's base64 header not a security measure?",
          options: [
            "It uses a weak key",
            "Base64 is a format, not encryption. The header decodes back to the credentials in one line",
            "It only encodes the username",
            "It is a security measure",
          ],
          correctIndex: 1,
          explanation:
            "Base64 exists to push bytes through text-only channels. Nothing about it is secret, which is exactly why Basic auth is meaningless without HTTPS underneath.",
        },
        {
          question: "Why do file signatures and hashes get shown in hex rather than base64, despite hex being larger?",
          options: [
            "Hex compresses better",
            "One byte is exactly two characters at a fixed position, so a human can count offsets by eye",
            "Base64 cannot represent binary",
            "Hex is faster to decode",
          ],
          correctIndex: 1,
          explanation:
            "Hex is a reading format. The fixed two-characters-per-byte mapping is what lets you look at `89504e47` and see four specific bytes, which base64 cannot give you.",
        },
        {
          question: "You decode UTF-8 bytes for `\"café\"` using `toString(\"latin1\")`. What happens?",
          options: [
            "A decoding error",
            "You get `\"cafÃ©\"`, with no error at all",
            "You get `\"caf\"`",
            "You get the same string back",
          ],
          correctIndex: 1,
          explanation:
            "Latin-1 maps every byte to a character, so the two UTF-8 bytes for `é` become two separate characters. It cannot fail, which is why the corruption is silent and gets reported as a font problem.",
        },
      ],
    },
    {
      id: "integers-and-endianness",
      title: "Reading integers, offsets and endianness",
      durationMinutes: 10,
      explanation:
        "Buffers are not just text. They hold structured binary data.\n\n```javascript\nconst buffer = Buffer.alloc(4);\n\nbuffer.writeUInt32BE(123456, 0);\n\nconsole.log(\n  buffer.readUInt32BE(0)\n);\n```\n\n```text\n123456\n```\n\n---\n\n## What is an offset?\n\nAn <b>offset</b> (the byte position where reading or writing begins).\n\n```text\nBuffer:\n\nbyte 0\nbyte 1\nbyte 2\nbyte 3\nbyte 4\n```\n\nSo:\n\n```javascript\nbuffer.readUInt16BE(2);\n```\n\nmeans:\n\n```text\nStart at byte 2\n ↓\nRead 2 bytes\n```\n\nThe method name tells you how many bytes it consumes, which is the part to internalise: `UInt8` is 1, `UInt16` is 2, `UInt32` is 4, `BigUInt64` is 8. So reading a sequence of fields means advancing the offset by each field's width, and getting one wrong shifts everything after it into nonsense.\n\nReading past the end throws `ERR_OUT_OF_RANGE` rather than returning garbage, which is genuinely helpful. Untrusted binary input is exactly where you want a loud failure.\n\n---\n\n## Big-endian vs little-endian\n\n<b>Big-endian</b> (most significant byte first).\n\n<b>Little-endian</b> (least significant byte first).\n\nFor:\n\n```text\n0x12345678\n```\n\nBig-endian:\n\n```text\n12 34 56 78\n```\n\nLittle-endian:\n\n```text\n78 56 34 12\n```\n\nNode gives you both:\n\n```javascript\nbuffer.readUInt32BE(offset);\nbuffer.readUInt32LE(offset);\n```\n\nand:\n\n```javascript\nbuffer.writeUInt32BE(value, offset);\nbuffer.writeUInt32LE(value, offset);\n```\n\nWhen reading a file format, follow that format's spec.\n\nThe reason both exist is not arbitrary. Big-endian is the order humans write numbers in, and it became the convention for anything sent over a network, which is why it is also called network byte order. Little-endian is what x86 and ARM processors use internally, so it is what most file formats written by a program on your machine will use.\n\nSo a rough guide: <b>network protocols and older formats tend to be big-endian, formats written by native code tend to be little-endian</b>. PNG is big-endian, which is why the day's project uses `readUInt32BE`.\n\nThe practical point: guessing wrong does not throw. It gives you a plausible-looking wrong number. Reading a PNG's width with `readUInt32LE` on an 800-pixel image returns 553,648,128, and you have to notice that yourself.\n\n---\n\n## Signed and unsigned\n\nThe `U` matters too. `readUInt8` treats a byte as 0 to 255, `readInt8` treats it as -128 to 127. Same byte, different number: `0xFF` is 255 unsigned and -1 signed.\n\nSo a format that stores a value which can be negative needs the signed reader, and picking wrong turns small negatives into very large positives. Another silently wrong answer rather than an error.",
      diagram: `The method name tells you the width

    readUInt8(offset)        1 byte    0..255
    readUInt16BE(offset)     2 bytes   0..65535
    readUInt32BE(offset)     4 bytes   0..4294967295
    readBigUInt64BE(offset)  8 bytes

    reading fields in sequence means advancing the
    offset by each width. get one wrong and every
    field after it is nonsense.

    reading past the end THROWS ERR_OUT_OF_RANGE
      └─ which you want, for untrusted binary


Endianness: the same number, two orders

    0x12345678

    big-endian     12 34 56 78     most significant first
    little-endian  78 56 34 12     least significant first


    why both exist

    big-endian     the order humans write numbers
                   became the convention for the network
                   ("network byte order")
                     → protocols, older formats, PNG

    little-endian  what x86 and ARM use internally
                     → formats written by native code


Guessing wrong gives a plausible WRONG number

    an 800-pixel-wide PNG

    readUInt32BE(16)  →  800            ✓
    readUInt32LE(16)  →  553,648,128    ✗ no error

    you have to notice that yourself


Signed vs unsigned: same byte, different number

    byte 0xFF

    readUInt8   →   255
    readInt8    →   -1

    pick wrong on a format that stores negatives and
    small negative numbers become very large positives`,
      codeExample: {
        title: "Structured binary, and the two ways to get it wrong",
        code: `// ── Write and read an integer ───────────────────────────────
const buffer = Buffer.alloc(4);

buffer.writeUInt32BE(123456, 0);
console.log(buffer);                        // <Buffer 00 01 e2 40>
console.log(buffer.readUInt32BE(0));        // 123456


// ── Endianness: same bytes, two answers ─────────────────────
const num = Buffer.alloc(4);
num.writeUInt32BE(0x12345678, 0);

console.log(num.toString("hex"));           // 12345678   BE order
console.log(num.readUInt32BE(0).toString(16));   // 12345678
console.log(num.readUInt32LE(0).toString(16));   // 78563412  ← wrong,
//                                                  and no error

// the realistic version of that mistake
const png = Buffer.alloc(8);
png.writeUInt32BE(800, 0);                  // width, PNG is BE
png.writeUInt32BE(600, 4);                  // height

console.log("BE:", png.readUInt32BE(0), png.readUInt32BE(4));  // 800 600
console.log("LE:", png.readUInt32LE(0), png.readUInt32LE(4));
// LE: 553648128 1409286144
//   plausible-looking numbers. you have to notice yourself.


// ── Offsets advance by the field width ──────────────────────
const header = Buffer.alloc(16);
header.writeUInt8(1, 0);            // version   1 byte  → next: 1
header.writeUInt16BE(4096, 1);      // pageSize  2 bytes → next: 3
header.writeUInt32BE(999, 3);       // recordId  4 bytes → next: 7
header.writeBigUInt64BE(1n, 7);     // sequence  8 bytes → next: 15

console.log({
  version: header.readUInt8(0),
  pageSize: header.readUInt16BE(1),
  recordId: header.readUInt32BE(3),
  sequence: header.readBigUInt64BE(7),
});
// { version: 1, pageSize: 4096, recordId: 999, sequence: 1n }
//
// Get one width wrong and every field after it is nonsense.


// ── Reading past the end throws, usefully ───────────────────
try {
  header.readUInt32BE(14);
} catch (error) {
  console.log(error.code);                  // ERR_OUT_OF_RANGE
}
//   a loud failure is what you want for untrusted binary


// ── Signed vs unsigned: same byte ───────────────────────────
const b = Buffer.from([0xff]);
console.log(b.readUInt8(0));                // 255
console.log(b.readInt8(0));                 // -1
//
// A format storing values that can go negative needs the
// signed reader. Pick wrong and -1 becomes 255.`,
      },
      keyTakeaways: [
        "An <b>offset</b> is the byte position where a read or write starts.",
        "The method name gives the width: `UInt8` 1 byte, `UInt16` 2, `UInt32` 4, `BigUInt64` 8.",
        "Reading fields in sequence means advancing the offset by each width. One wrong width corrupts everything after it.",
        "Reading past the end throws `ERR_OUT_OF_RANGE`, which is what you want for untrusted binary.",
        "<b>Big-endian</b> puts the most significant byte first. <b>Little-endian</b> puts it last.",
        "Big-endian became the network convention, so protocols and older formats use it. PNG is big-endian.",
        "Little-endian is what x86 and ARM use, so formats written by native code tend to use it.",
        "<b>Guessing endianness wrong does not throw.</b> You get a plausible wrong number.",
        "An 800-pixel width read as little-endian comes back as 553,648,128.",
        "Signed and unsigned matter too: byte `0xFF` is 255 unsigned and -1 signed.",
      ],
      commonMistakes: [
        "<b>Guessing the endianness</b> — you get a wrong number rather than an error. Read the format's spec.",
        "<b>Advancing an offset by the wrong width</b> — every field after it decodes into nonsense.",
        "<b>Using an unsigned reader for a value that can be negative</b> — `-1` silently becomes `255`.",
        "<b>Assuming a wrong read will throw</b> — only going past the end does. Wrong order and wrong signedness are silent.",
        "<b>Reading a `UInt32` at an offset near the end without a length check</b> — `ERR_OUT_OF_RANGE` on untrusted input.",
        "<b>Using a plain `Number` for a 64-bit field</b> — those readers return `BigInt`, and mixing the two throws.",
      ],
      quiz: [
        {
          question: "You read a PNG's width with `readUInt32LE(16)` instead of `readUInt32BE(16)`. On an 800-pixel image, what do you get?",
          options: [
            "800",
            "An `ERR_OUT_OF_RANGE` error",
            "553,648,128, with no error at all",
            "0",
          ],
          correctIndex: 2,
          explanation:
            "Endianness mistakes are silent. The bytes are read in the wrong order and produce a plausible-looking wrong number, which you have to notice yourself. PNG is big-endian.",
        },
        {
          question: "Byte `0xFF`. What do `readUInt8` and `readInt8` return?",
          options: ["255 and 255", "255 and -1", "-1 and 255", "Both throw"],
          correctIndex: 1,
          explanation:
            "The `U` decides whether the top bit is part of the magnitude or a sign. A format storing possibly-negative values needs the signed reader.",
        },
        {
          question: "Which mistake in this lesson actually produces an error rather than a wrong answer?",
          options: [
            "Wrong endianness",
            "Wrong signedness",
            "Reading past the end of the buffer",
            "Wrong offset within the buffer",
          ],
          correctIndex: 2,
          explanation:
            "Only going out of bounds throws, with `ERR_OUT_OF_RANGE`. Everything else gives you a number that looks reasonable and is wrong.",
        },
      ],
    },
    {
      id: "buffer-vs-typed-arrays",
      title: "Buffer, Uint8Array and ArrayBuffer",
      durationMinutes: 8,
      explanation:
        "Three related things that confuse a lot of people.\n\n```text\nArrayBuffer\n    ↓\nRaw block of memory\n\nUint8Array\n    ↓\nView of bytes in that memory\n\nBuffer\n    ↓\nNode-enhanced Uint8Array\n```\n\n---\n\n## `ArrayBuffer`\n\n<b>`ArrayBuffer`</b> (a fixed-length block of raw binary memory).\n\n```javascript\nconst arrayBuffer = new ArrayBuffer(8);\n\nconsole.log(arrayBuffer.byteLength);\n```\n\n```text\n8\n```\n\nIt is memory, with no convenient way to touch the bytes. You cannot index into it. It exists to be viewed by something else.\n\n---\n\n## `Uint8Array`\n\n<b>`Uint8Array`</b> (a typed array where each element is one unsigned 8-bit integer).\n\n```javascript\nconst bytes = new Uint8Array([\n  72,\n  101,\n  108,\n  108,\n  111\n]);\n\nconsole.log(bytes);\n```\n\nEach element is:\n\n```text\n0 → 255\n```\n\nThis is the <b>view</b>. Several views can look at the same `ArrayBuffer` in different ways, which is the point of separating them: a `Uint8Array` and a `Float32Array` over the same memory read the same bytes as different types.\n\n---\n\n## `Buffer`\n\nNode's `Buffer` is built on the typed-array machinery and adds Node-specific features.\n\n```javascript\nconst buffer = Buffer.from(\"Hello\");\n\nconsole.log(buffer.toString());\n```\n\nMethods for:\n\n```text\nFiles\nSockets\nEncoding\nBinary protocols\nCrypto\n```\n\nThe relationship is literal, not a metaphor: <b>`Buffer` extends `Uint8Array`</b>. So `buffer instanceof Uint8Array` is true, and anywhere a `Uint8Array` is accepted, a Buffer works. `Buffer` adds the encoding methods (`toString(\"base64\")`), the integer readers, and the off-heap allocation.\n\nThat inheritance runs one way. Every Buffer is a `Uint8Array`, but a `Uint8Array` has no `toString(\"hex\")` and no `readUInt32BE`. Passing one to code expecting a Buffer fails on the method it reaches for.\n\n---\n\n## The trap in `subarray` and `slice`\n\nWorth knowing because it is a real source of bugs. `buffer.subarray()` returns a <b>view sharing the same memory</b>, not a copy:\n\n```javascript\nconst full = Buffer.from(\"Hello\");\nconst part = full.subarray(0, 2);\n\npart[0] = 74;\nconsole.log(full.toString());   // \"Jello\"\n```\n\nThat is efficient, and surprising if you expected a copy. It also means holding a small `subarray` of a huge Buffer keeps the whole allocation alive, which is a quiet way to leak memory.\n\nUse `Buffer.copyBytesFrom` or `Buffer.from(part)` when you want an independent copy.\n\nThe practical rule: use `Buffer` for anything touching Node's I/O, and `Uint8Array` when you are writing code that should also work in a browser or with Web APIs.",
      diagram: `Memory, and views onto it

    ArrayBuffer                 8 bytes of raw memory
    ┌──┬──┬──┬──┬──┬──┬──┬──┐   no indexing, no methods
    │  │  │  │  │  │  │  │  │   exists to be VIEWED
    └──┴──┴──┴──┴──┴──┴──┴──┘
      ▲           ▲
      │           │
    Uint8Array  Float32Array     different views, SAME bytes
    8 elements  2 elements        read as different types


Buffer literally extends Uint8Array

              Uint8Array
                  │  extends
                  ↓
                Buffer
                  │
        adds: toString("base64" | "hex" | ...)
              readUInt32BE and friends
              off-heap allocation
              equals, concat

    buffer instanceof Uint8Array   →  true

    one way only:
      every Buffer IS a Uint8Array          ✓
      a Uint8Array has no toString("hex")   ✗
      and no readUInt32BE                   ✗


subarray SHARES memory. it is not a copy.

    const full = Buffer.from("Hello")
    const part = full.subarray(0, 2)

    part[0] = 74
    full.toString()      →  "Jello"      ← full changed!

    efficient, and surprising.

    and a small subarray of a HUGE buffer keeps the
    whole allocation alive: a quiet memory leak

    want a copy?
      Buffer.from(part)  or  Buffer.copyBytesFrom(part)


Which one to use

    Buffer       anything touching Node I/O
    Uint8Array   code that should also run in a browser
                 or against Web APIs`,
      codeExample: {
        title: "The three types, and the sharing trap",
        code: `// ── ArrayBuffer: memory with no handles ─────────────────────
const ab = new ArrayBuffer(8);
console.log(ab.byteLength);          // 8
// console.log(ab[0]);               // undefined, not indexable


// ── Uint8Array: a view onto bytes ───────────────────────────
const bytes = new Uint8Array([72, 101, 108, 108, 111]);
console.log(bytes);                  // Uint8Array(5) [72, 101, ...]
console.log(bytes[0]);               // 72


// ── Two views, same memory ──────────────────────────────────
const shared = new ArrayBuffer(8);
const asBytes = new Uint8Array(shared);
const asFloats = new Float32Array(shared);

asFloats[0] = 1;
console.log([...asBytes].slice(0, 4));   // [ 0, 0, 128, 63 ]
//   the same bytes, read as a different type


// ── Buffer extends Uint8Array, literally ────────────────────
const buffer = Buffer.from("Hello");

console.log(buffer instanceof Uint8Array);    // true
console.log(buffer instanceof Buffer);        // true

// so a Buffer works anywhere a Uint8Array is wanted
console.log(new Uint8Array(buffer).length);   // 5

// but not the other way round
const plain = new Uint8Array([72, 105]);
console.log(typeof plain.toString);           // "function"
console.log(plain.toString());                // "72,105"  ← array-ish!
// console.log(plain.toString("hex"));        // ignores the arg
// console.log(plain.readUInt32BE);           // undefined
//
// Passing a Uint8Array to code expecting a Buffer fails on
// whichever Buffer method it reaches for.

console.log(Buffer.from(plain).toString("hex"));   // 4869   ← works


// ── subarray SHARES memory ──────────────────────────────────
const full = Buffer.from("Hello");
const part = full.subarray(0, 2);

part[0] = 74;                        // 'J'
console.log(full.toString());        // Jello    ← full changed
console.log(part.toString());        // Je

// an independent copy
const copy = Buffer.from(full.subarray(0, 2));
copy[0] = 88;                        // 'X'
console.log(full.toString());        // Jello    ← untouched


// ── Why sharing can leak ────────────────────────────────────
// function firstBytes(hugeBuffer) {
//   return hugeBuffer.subarray(0, 16);
// }
//
// Keeping those 16 bytes keeps the ENTIRE original
// allocation alive. Copy when you intend to hold on to
// a small piece of something large.`,
      },
      keyTakeaways: [
        "`ArrayBuffer` is raw memory. It is not indexable and has no methods. It exists to be viewed.",
        "`Uint8Array` is a <b>view</b>: each element is one byte, 0 to 255.",
        "Several views can read the same `ArrayBuffer` as different types.",
        "<b>`Buffer` extends `Uint8Array`</b> literally, so `buffer instanceof Uint8Array` is true.",
        "`Buffer` adds the encoding methods, the integer readers, and off-heap allocation.",
        "The inheritance runs one way: a `Uint8Array` has no `toString(\"hex\")` and no `readUInt32BE`.",
        "`buffer.subarray()` returns a <b>view sharing the same memory</b>, not a copy.",
        "So writing to a subarray changes the original, which is efficient and surprising.",
        "Holding a small subarray of a huge Buffer keeps the whole allocation alive. A quiet leak.",
        "Use `Buffer` for Node I/O, and `Uint8Array` for code that should also work in a browser.",
      ],
      commonMistakes: [
        "<b>Expecting `subarray` to copy</b> — it shares memory, so a write through either one is visible in both.",
        "<b>Holding a small subarray of a large Buffer</b> — the entire original allocation stays alive.",
        "<b>Passing a `Uint8Array` where a Buffer is expected</b> — it fails on whichever Buffer method the code calls.",
        "<b>Calling `toString(\"hex\")` on a `Uint8Array`</b> — it ignores the argument and gives you comma-separated numbers.",
        "<b>Trying to index an `ArrayBuffer`</b> — you need a view over it.",
        "<b>Assuming `Buffer` and `Uint8Array` are unrelated</b> — one extends the other, which is why they interoperate at all.",
      ],
      quiz: [
        {
          question: "`const part = full.subarray(0, 2); part[0] = 74;`. What happens to `full`?",
          options: [
            "Nothing, `subarray` copies",
            "`full` changes too, because `subarray` returns a view onto the same memory",
            "A TypeError, views are read-only",
            "`full` is truncated to 2 bytes",
          ],
          correctIndex: 1,
          explanation:
            "Sharing is the point: no copy, no allocation. It also means holding a small subarray of a huge Buffer keeps the whole allocation alive.",
        },
        {
          question: "What does `buffer instanceof Uint8Array` return?",
          options: ["`false`, they are unrelated", "`true`, `Buffer` extends `Uint8Array`", "It throws", "`true` only in CommonJS"],
          correctIndex: 1,
          explanation:
            "That inheritance is why a Buffer works anywhere a `Uint8Array` is accepted. It runs one way: a plain `Uint8Array` has none of the Buffer methods.",
        },
        {
          question: "You call `toString(\"hex\")` on a plain `Uint8Array`. What do you get?",
          options: [
            "The hex string",
            "The argument is ignored and you get comma-separated numbers",
            "A TypeError",
            "An empty string",
          ],
          correctIndex: 1,
          explanation:
            "`toString` on a typed array is the ordinary array version, which knows nothing about encodings. Wrap it with `Buffer.from()` first.",
        },
      ],
    },
    {
      id: "text-encoder-decoder",
      title: "TextEncoder and TextDecoder",
      durationMinutes: 8,
      explanation:
        "The Web-standard way to do the same conversion.\n\n---\n\n## `TextEncoder`\n\n<b>`TextEncoder`</b> (a Web-standard API converting a string into UTF-8 bytes).\n\n```javascript\nconst encoder = new TextEncoder();\n\nconst bytes = encoder.encode(\"Hello\");\n\nconsole.log(bytes);\n```\n\nYou get a:\n\n```text\nUint8Array\n```\n\n---\n\n## `TextDecoder`\n\n<b>`TextDecoder`</b> (converts bytes back into text).\n\n```javascript\nconst decoder = new TextDecoder();\n\nconst text = decoder.decode(bytes);\n\nconsole.log(text);\n```\n\n```text\nHello\n```\n\nSo:\n\n```text\nTextEncoder\nstring\n  ↓\nUTF-8 bytes\n\nTextDecoder\nbytes\n  ↓\nstring\n```\n\n---\n\n## Alongside Buffer\n\nYou will see both:\n\n```javascript\nBuffer.from(\"Hello\");\n```\n\nand:\n\n```javascript\nnew TextEncoder().encode(\"Hello\");\n```\n\nBoth give UTF-8 bytes. The results differ in type:\n\n```text\nBuffer.from()\n    ↓\nBuffer\n\nTextEncoder\n    ↓\nUint8Array\n```\n\nFor Node APIs, `Buffer` is the natural choice. For portable JavaScript, `TextEncoder` and `TextDecoder` are useful.\n\n---\n\n## Where they genuinely differ\n\nThree things worth knowing, because \"just use Buffer\" is not always right.\n\n<b>`TextEncoder` only does UTF-8.</b> There is no option. `Buffer.from(str, \"latin1\")` has no equivalent, so anything non-UTF-8 needs Buffer.\n\n<b>`TextDecoder` can decode much more</b> than Buffer can, and can be strict about it. `new TextDecoder(\"utf8\", { fatal: true })` <b>throws</b> on invalid bytes instead of quietly inserting a replacement character. Buffer's `toString(\"utf8\")` always substitutes. For validating input that claims to be UTF-8, the strict decoder is the better tool, because silent corruption is the failure you cannot see.\n\n<b>`TextDecoder` handles streaming.</b> `decoder.decode(chunk, { stream: true })` remembers an incomplete character across calls, which is the problem the next lesson is about. It is the Web-standard answer to the same thing `StringDecoder` solves.\n\nAnd they work in browsers, which Buffer does not. If you are writing something meant to run in both places, that decides it.",
      diagram: `Same conversion, different return type

    "Hello"
       ├── Buffer.from("Hello")            →  Buffer
       └── new TextEncoder().encode(...)   →  Uint8Array

    both are UTF-8 bytes. only the wrapper differs.


Where they actually differ

    TextEncoder     UTF-8 ONLY, no options
                      └─ Buffer.from(s, "latin1") has
                         no equivalent

    TextDecoder     decodes far MORE encodings
                    and can be STRICT:

      new TextDecoder("utf8", { fatal: true })
        invalid bytes  →  THROWS

      buf.toString("utf8")
        invalid bytes  →  "\\ufffd" silently

      for validating input that claims to be UTF-8,
      throwing is what you want. silent corruption
      is the failure you cannot see.

    TextDecoder     handles STREAMING:
      decode(chunk, { stream: true })
        remembers an incomplete character across calls
        └─ the Web answer to the next lesson's problem


Which to reach for

    Node I/O, encodings other than UTF-8   →  Buffer
    validating UTF-8 strictly              →  TextDecoder
                                              { fatal: true }
    code that must run in a browser too    →  TextEncoder /
                                              TextDecoder`,
      codeExample: {
        title: "The Web APIs, and what they add",
        code: `// ── The basics ──────────────────────────────────────────────
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const bytes = encoder.encode("Hello");
console.log(bytes);                       // Uint8Array(5) [72, 101, ...]
console.log(decoder.decode(bytes));       // Hello


// ── Same bytes as Buffer, different wrapper ─────────────────
const viaBuffer = Buffer.from("Hello");
const viaEncoder = encoder.encode("Hello");

console.log(Buffer.from(viaEncoder).equals(viaBuffer));   // true
console.log(viaBuffer.constructor.name);      // Buffer
console.log(viaEncoder.constructor.name);     // Uint8Array


// ── TextEncoder is UTF-8 only ───────────────────────────────
// new TextEncoder("latin1")        ← the argument is ignored
console.log(encoder.encoding);                // "utf-8"
//
// So anything non-UTF-8 needs Buffer:
console.log(Buffer.from("café", "latin1"));   // <Buffer 63 61 66 e9>


// ── TextDecoder can be STRICT, and Buffer cannot ────────────
const broken = Buffer.from([0xf0, 0x9f]);     // half an emoji

console.log(JSON.stringify(broken.toString("utf8")));
// "\\ufffd"          ← Buffer substitutes, silently

console.log(JSON.stringify(new TextDecoder().decode(broken)));
// "\\ufffd"          ← same by default

try {
  new TextDecoder("utf8", { fatal: true }).decode(broken);
} catch (error) {
  console.log("strict decoder threw:", error.name);   // TypeError
}
//
// For input that CLAIMS to be UTF-8, throwing is what you
// want. Silent corruption is the failure you cannot see.


// ── TextDecoder handles streaming ───────────────────────────
const emoji = Buffer.from("😀");
const streaming = new TextDecoder("utf8");

const a = streaming.decode(emoji.subarray(0, 2), { stream: true });
const b = streaming.decode(emoji.subarray(2), { stream: true });

console.log(JSON.stringify(a));           // ""      nothing yet
console.log(JSON.stringify(b));           // "😀"    completed
//
// It remembered the incomplete character. That is the next
// lesson's problem, solved the Web-standard way.


// ── And it decodes more than Buffer ─────────────────────────
console.log(new TextDecoder("iso-8859-2").encoding);   // iso-8859-2
console.log(new TextDecoder("shift_jis").encoding);    // shift_jis`,
      },
      keyTakeaways: [
        "`TextEncoder` turns a string into UTF-8 bytes, as a `Uint8Array`.",
        "`TextDecoder` turns bytes back into a string.",
        "`Buffer.from(str)` produces the same bytes, wrapped in a `Buffer` instead.",
        "<b>`TextEncoder` only does UTF-8.</b> Anything else needs Buffer.",
        "<b>`TextDecoder` can be strict</b>: `{ fatal: true }` throws on invalid bytes.",
        "`buf.toString(\"utf8\")` always substitutes a replacement character instead.",
        "For validating input that claims to be UTF-8, throwing is the better behaviour.",
        "`TextDecoder` also handles streaming with `{ stream: true }`, remembering incomplete characters.",
        "That is the Web-standard answer to the problem `StringDecoder` solves.",
        "These work in browsers. `Buffer` does not, which settles it for portable code.",
      ],
      commonMistakes: [
        "<b>Passing an encoding to `new TextEncoder(...)`</b> — the argument is ignored. It is UTF-8 only.",
        "<b>Relying on `toString(\"utf8\")` to validate input</b> — it silently substitutes. Use a fatal `TextDecoder`.",
        "<b>Calling a Buffer method on the `Uint8Array` from `encode()`</b> — wrap it in `Buffer.from()` first.",
        "<b>Creating a new `TextDecoder` per chunk while streaming</b> — the whole point is that one instance carries state.",
        "<b>Using `Buffer` in code meant to run in a browser</b> — it does not exist there.",
      ],
      quiz: [
        {
          question: "You need to reject input that is not valid UTF-8. Which tool does that?",
          options: [
            "`buf.toString(\"utf8\")`",
            "`new TextDecoder(\"utf8\", { fatal: true }).decode(buf)`",
            "`Buffer.from(str, \"utf8\")`",
            "`new TextEncoder().encode(str)`",
          ],
          correctIndex: 1,
          explanation:
            "Buffer's `toString` always substitutes a replacement character, so invalid input passes silently. The fatal decoder throws, which is what validation needs.",
        },
        {
          question: "What happens if you write `new TextEncoder(\"latin1\")`?",
          options: [
            "It encodes as latin1",
            "The argument is ignored. `TextEncoder` is UTF-8 only",
            "It throws",
            "It returns a Buffer instead",
          ],
          correctIndex: 1,
          explanation:
            "There is no option, by design. Anything other than UTF-8 needs `Buffer.from(str, encoding)`.",
        },
      ],
    },
    {
      id: "string-decoder",
      title: "StringDecoder, and the chunk-boundary bug",
      durationMinutes: 10,
      explanation:
        "Now the real-world problem the whole day has been pointing at.\n\nSuppose you receive UTF-8 data in chunks:\n\n```text\nChunk 1\nChunk 2\nChunk 3\n```\n\nA character can be split across them.\n\n```javascript\nimport { StringDecoder } from \"node:string_decoder\";\n```\n\n<b>`StringDecoder`</b> (converts streamed byte chunks into text without breaking multi-byte UTF-8 characters).\n\n---\n\n## The bug\n\n```text\n😀\n```\n\nis four bytes:\n\n```text\nbyte1 byte2 byte3 byte4\n```\n\nBut the network hands you:\n\n```text\nChunk 1:\nbyte1 byte2\n\nChunk 2:\nbyte3 byte4\n```\n\nIf you decode each independently:\n\n```javascript\nchunk1.toString(\"utf8\");\nchunk2.toString(\"utf8\");\n```\n\nyou corrupt the character. Neither chunk holds a complete sequence.\n\n---\n\n## Bad chunk processing\n\n```javascript\nfor (const chunk of chunks) {\n  console.log(chunk.toString(\"utf8\"));\n}\n```\n\nThis breaks whenever a UTF-8 character crosses a chunk boundary. A very common streaming bug.\n\nWhat you actually get is three replacement characters where one emoji should be. Two from the first chunk's incomplete sequence, one from the second. So the corruption also changes the <b>length</b>, which is how it goes on to break anything counting characters downstream.\n\n---\n\n## `StringDecoder`\n\n```javascript\nimport { StringDecoder } from \"node:string_decoder\";\n\nconst decoder = new StringDecoder(\"utf8\");\n\nconsole.log(decoder.write(chunk1));\nconsole.log(decoder.write(chunk2));\n\nconsole.log(decoder.end());\n```\n\nIt remembers incomplete sequences:\n\n```text\nChunk 1\n ↓\nIncomplete character\n ↓\nRemember it\n\nChunk 2\n ↓\nRemaining bytes\n ↓\nCombine\n ↓\nCorrect character\n```\n\nSo `decoder.write(chunk1)` returns the text up to the split and <b>holds back</b> the two orphan bytes. The next `write` prepends them and the emoji comes out whole.\n\n`end()` matters too. It flushes anything still held, and if the stream finished mid-character you get the replacement there, which is correct: the data really was truncated. Skip `end()` and you silently drop the last character.\n\n---\n\n## Why this is not a rare edge case\n\nIt is easy to dismiss, so it is worth being clear about how ordinary it is.\n\nChunk boundaries are decided by the <b>filesystem and the network</b>, not by your data. `createReadStream` gives you 64KB at a time, and a TCP packet is around 1500 bytes. Neither knows or cares where your characters end.\n\nSo for any non-ASCII text of reasonable size, a character landing on a boundary is not unlucky, it is <b>expected</b>. A 64KB read of Nepali or Japanese text has a boundary every 64KB and three-byte characters throughout.\n\nAnd it is invisible in testing. Small English test files arrive in one chunk, so there is no boundary to hit and no non-ASCII character to break. The bug appears in production, on real user text, as a single mangled character in the middle of a document.\n\n---\n\n## When you do not need it\n\nTwo cases, so you are not adding it everywhere.\n\nSet an encoding on the stream and Node uses a `StringDecoder` internally: `createReadStream(path, { encoding: \"utf8\" })` hands you correctly-decoded strings. Same for `stream.setEncoding(\"utf8\")`.\n\nAnd if you are concatenating all the chunks anyway, `Buffer.concat(chunks).toString(\"utf8\")` is fine, because there are no boundaries left by the time you decode. That only works when the whole thing fits in memory, which is the trade Day 8 is about.\n\nYou need `StringDecoder` when you are handling raw Buffer chunks and want text out of <b>each one</b> as it arrives.",
      diagram: `Boundaries are chosen by the OS, not by your data

    createReadStream    64KB chunks
    TCP packet          ~1500 bytes

    neither knows where your characters end.

    so for non-ASCII text of any size, a character
    landing on a boundary is EXPECTED, not unlucky


The bug

    "😀"  =  f0 9f 98 80

    chunk 1: f0 9f          chunk 2: 98 80
        │                       │
    toString("utf8")        toString("utf8")
        │                       │
      "\\ufffd"               "\\ufffd\\ufffd"
        └───────────┬───────────┘
                    ↓
              3 replacement characters
              where 1 emoji should be

    the LENGTH changed too, which is how it goes on
    to break anything counting characters downstream


StringDecoder holds the orphans back

    decoder.write(chunk 1)
      f0 9f  →  incomplete. return "".
                HOLD f0 9f
    decoder.write(chunk 2)
      f0 9f + 98 80  →  complete. return "😀"
    decoder.end()
      flush anything still held
        └─ skip this and you silently drop
           the last character


Why it never shows up in testing

    small English test file
      → arrives in ONE chunk
      → no boundary to hit
      → no multi-byte character to break

    production, real user text
      → one mangled character in the middle
        of a document


When you do NOT need it

    createReadStream(path, { encoding: "utf8" })
    stream.setEncoding("utf8")
      └─ Node uses a StringDecoder internally

    Buffer.concat(chunks).toString("utf8")
      └─ no boundaries left by the time you decode
         (but the whole thing is in memory)

    you need it for RAW Buffer chunks when you want
    text out of EACH one as it arrives`,
      codeExample: {
        title: "The bug, and the fix",
        code: `import { StringDecoder } from "node:string_decoder";

const emoji = Buffer.from("😀");
console.log(emoji);                     // <Buffer f0 9f 98 80>

// the OS split it here, not you
const chunk1 = emoji.subarray(0, 2);    // f0 9f
const chunk2 = emoji.subarray(2);       // 98 80


// ── The bug ─────────────────────────────────────────────────
const broken = chunk1.toString("utf8") + chunk2.toString("utf8");

console.log(JSON.stringify(broken));    // "\\ufffd\\ufffd\\ufffd"
console.log(broken.length);             // 3   ← was 2, now 3
//
// Three replacement characters where one emoji should be.
// The length changed too, which breaks anything counting
// characters further downstream.


// ── The fix ─────────────────────────────────────────────────
const decoder = new StringDecoder("utf8");

const a = decoder.write(chunk1);
const b = decoder.write(chunk2);
const tail = decoder.end();

console.log(JSON.stringify(a));         // ""       held the orphans
console.log(JSON.stringify(b));         // "😀"     completed
console.log(JSON.stringify(tail));      // ""       nothing left
console.log(JSON.stringify(a + b + tail));   // "😀"


// ── end() is not optional ───────────────────────────────────
const truncated = new StringDecoder("utf8");
console.log(JSON.stringify(truncated.write(chunk1)));   // ""
console.log(JSON.stringify(truncated.end()));           // "\\ufffd"
//
// The stream really did end mid-character, so the
// replacement is correct here. Skip end() and you silently
// drop the last character instead.


// ── Realistic shape ────────────────────────────────────────
// import fs from "node:fs";
//
// const decoder = new StringDecoder("utf8");
// const stream = fs.createReadStream("users.csv");   // raw Buffers
//
// for await (const chunk of stream) {
//   process(decoder.write(chunk));      // safe per chunk
// }
// process(decoder.end());               // flush


// ── When you do not need it at all ─────────────────────────
// 1. let the stream decode for you
// fs.createReadStream("f.txt", { encoding: "utf8" })
//   → Node uses a StringDecoder internally
//
// 2. concatenate first, decode once
// Buffer.concat(chunks).toString("utf8")
//   → no boundaries left, but the whole thing is in memory
//
// StringDecoder is for raw Buffer chunks when you want text
// out of EACH one as it arrives.`,
      },
      keyTakeaways: [
        "Chunk boundaries are chosen by the <b>filesystem and the network</b>, never by your data.",
        "`createReadStream` gives 64KB at a time, a TCP packet is around 1500 bytes. Neither knows where your characters end.",
        "So for non-ASCII text of any size, a character landing on a boundary is <b>expected</b>, not unlucky.",
        "Decoding two halves of an emoji separately gives you <b>three</b> replacement characters, not one broken one.",
        "The length changes too, which breaks anything counting characters downstream.",
        "`StringDecoder` holds incomplete sequences back and prepends them to the next chunk.",
        "`decoder.end()` flushes what is still held. Skip it and you silently drop the last character.",
        "The bug is invisible in testing: small English files arrive in one chunk with nothing to break.",
        "You do <b>not</b> need it when the stream has an encoding set, or when you concatenate before decoding.",
        "You do need it for raw Buffer chunks when you want text out of each one as it arrives.",
      ],
      commonMistakes: [
        "<b>Calling `chunk.toString(\"utf8\")` per chunk</b> — the classic streaming bug, and it only shows up on real text.",
        "<b>Forgetting `decoder.end()`</b> — anything still held is dropped without a word.",
        "<b>Creating a new `StringDecoder` per chunk</b> — the whole point is one instance carrying state across calls.",
        "<b>Concluding it is fine because the tests pass</b> — English test data arrives in one chunk with no multi-byte characters.",
        "<b>Adding `StringDecoder` when the stream already has an encoding set</b> — Node is already doing it for you.",
        "<b>Splitting on a delimiter before decoding</b> — a byte-level split can land inside a character just as easily.",
      ],
      quiz: [
        {
          question: "You decode the two halves of a four-byte emoji separately and join the results. What do you get?",
          options: [
            "The emoji, correctly",
            "Three replacement characters, and a different string length",
            "An empty string",
            "A decoding error",
          ],
          correctIndex: 1,
          explanation:
            "Neither half is a valid sequence, so each produces replacements: two from the first chunk and one from the second. The length change is what goes on to break code counting characters.",
        },
        {
          question: "Why does this bug almost never show up in testing?",
          options: [
            "Tests run with a larger chunk size",
            "Small English test files arrive in one chunk, with no boundary to hit and no multi-byte characters",
            "Node disables chunking in tests",
            "It only affects Windows",
          ],
          correctIndex: 1,
          explanation:
            "You need both conditions to see it: a chunk boundary and a multi-byte character. Typical test data has neither, so the bug waits for real user text in production.",
        },
        {
          question: "When do you NOT need a `StringDecoder`?",
          options: [
            "When the data is short",
            "When the stream has an encoding set, or when you concatenate all chunks before decoding once",
            "When the data is base64",
            "Never, always use one",
          ],
          correctIndex: 1,
          explanation:
            "Setting an encoding makes Node use one internally, and concatenating first leaves no boundaries to decode across. It is for raw Buffer chunks you want text from as they arrive.",
        },
      ],
    },
    {
      id: "compare-concat-timing",
      title: "Comparing, concatenating and timingSafeEqual",
      durationMinutes: 12,
      explanation:
        "Three operations, and a security concept.\n\n---\n\n## Comparing Buffers\n\n```javascript\nconst a = Buffer.from(\"hello\");\nconst b = Buffer.from(\"hello\");\n\nconsole.log(a.equals(b));\n```\n\n```text\ntrue\n```\n\n<b>`buffer.equals()`</b> (checks whether two Buffers hold the same bytes).\n\nWorth knowing why you need it: `a === b` compares references and is always `false` for two separate Buffers, and `==` does not help either. There is also `Buffer.compare` for sorting, which returns -1, 0 or 1.\n\n---\n\n## Concatenating\n\n<b>`Buffer.concat()`</b> (combines several Buffers into one).\n\n```javascript\nconst first = Buffer.from(\"Hello \");\nconst second = Buffer.from(\"Rajan\");\n\nconst result = Buffer.concat([\n  first,\n  second\n]);\n\nconsole.log(result.toString());\n```\n\n```text\nHello Rajan\n```\n\nEspecially useful for chunks:\n\n```text\nChunk 1\nChunk 2\nChunk 3\n   ↓\nBuffer.concat()\n   ↓\nComplete data\n```\n\nOne performance note that matters. Because a Buffer has a fixed length, `concat` allocates a new one and copies everything in. So concatenating inside a loop is quadratic: collect the chunks in an array and call `concat` <b>once</b> at the end.\n\nAnd it is the right way to solve the previous lesson when memory allows: concatenate first, decode once, no boundaries to worry about.\n\n---\n\n## `crypto.timingSafeEqual()`\n\nNow the security concept.\n\nComparing secrets:\n\n```javascript\nif (providedToken === expectedToken) {\n  // ...\n}\n```\n\nFor ordinary strings this is fine. For secrets it can leak, depending on the comparison.\n\nA <b>timing attack</b> (an attack that learns information by measuring how long operations take).\n\n```javascript\nimport { timingSafeEqual } from \"node:crypto\";\n```\n\n```javascript\nconst a = Buffer.from(\"secret123\");\nconst b = Buffer.from(\"secret123\");\n\nconst same = timingSafeEqual(a, b);\n\nconsole.log(same);\n```\n\n```text\ntrue\n```\n\n---\n\n## Why timing leaks anything\n\nThis sounds exotic, so here is the mechanism. A normal comparison <b>stops at the first difference</b>. So comparing against `\"secret\"`:\n\n```text\n\"xxxxxx\"   fails at position 0   fastest\n\"sxxxxx\"   fails at position 1   slightly slower\n\"sexxxx\"   fails at position 2   slightly slower again\n```\n\nAn attacker who can measure that tries every first character, keeps the slowest, then moves to the second. That turns guessing a 32-character token from impossible into a few thousand requests.\n\n`timingSafeEqual` compares <b>every byte regardless</b>, so the time does not depend on where the difference is.\n\nHonesty about scope: over a network this is hard, because latency noise swamps a few nanoseconds. It is a real concern for local comparisons, repeated measurements, and anywhere an attacker can be precise. And it costs nothing to use, which is the actual argument.\n\nWhere it matters: API tokens, webhook signatures, password reset tokens, session ids, HMAC verification. Where it does not: a username, a numeric id, anything already public.\n\n---\n\n## The same-length requirement\n\n`timingSafeEqual()` needs both Buffers to be the same length.\n\n```javascript\ntimingSafeEqual(\n  Buffer.from(\"abc\"),\n  Buffer.from(\"abcd\")\n);\n```\n\nthrows. Specifically `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH`, with \"Input buffers must have the same byte length\". So handle length first:\n\n```javascript\nif (a.length !== b.length) {\n  return false;\n}\n\nreturn timingSafeEqual(a, b);\n```\n\nThat length check does leak the length, and that is accepted: knowing a token is 32 characters helps an attacker essentially not at all, whereas knowing its first character helps enormously.\n\nWhat is not fine is letting the throw escape. An unhandled `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` turns a wrong-length token into a 500 instead of a 401, which both tells the attacker something and looks like a bug in your logs.\n\n---\n\n## A real token check\n\n```text\nExpected token\n      ↓\nserver secret\n\nReceived token\n      ↓\nrequest header\n```\n\n```javascript\nconst expected = Buffer.from(\n  process.env.API_TOKEN\n);\n\nconst received = Buffer.from(\n  providedToken\n);\n```\n\n```javascript\nif (\n  expected.length !== received.length ||\n  !timingSafeEqual(expected, received)\n) {\n  throw new Error(\"Invalid token\");\n}\n```\n\nNow the comparison is built for secret material.\n\nOne more thing: `Buffer.from(providedToken)` on a missing header is `Buffer.from(undefined)`, which throws. Check the header exists before you get here, or that becomes a 500 too.\n\nThe stronger version of the whole pattern is to hash both sides first. Comparing two SHA-256 digests means the lengths always match, so the length check disappears and the comparison is fixed-width by construction.",
      diagram: `Why a normal comparison leaks

    comparing against "secret", stopping at the
    first difference:

    "xxxxxx"   fail at 0     ▏          fastest
    "sxxxxx"   fail at 1     ▏▏
    "sexxxx"   fail at 2     ▏▏▏
    "secxxx"   fail at 3     ▏▏▏▏
    "secret"   full match    ▏▏▏▏▏▏     slowest

    an attacker measuring this tries every first
    character, keeps the slowest, moves to the second

    → guessing a 32-char token goes from impossible
      to a few thousand requests


    timingSafeEqual compares EVERY byte regardless

    "xxxxxx"   ▏▏▏▏▏▏
    "sxxxxx"   ▏▏▏▏▏▏      same time
    "secret"   ▏▏▏▏▏▏      no signal


Honest scope

    over a network    hard. latency noise swamps
                      a few nanoseconds
    locally, or with  a real concern
    repeated measures

    it costs nothing to use. that is the argument.

    use it for   API tokens, webhook signatures,
                 reset tokens, session ids, HMACs
    skip it for  usernames, numeric ids, public data


The length requirement, and the trap

    timingSafeEqual(Buffer.from("abc"),
                    Buffer.from("abcd"))
      → ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH
        "Input buffers must have the same byte length"

    so check length first:
      if (a.length !== b.length) return false
      return timingSafeEqual(a, b)

    yes, that leaks the LENGTH. accepted: knowing a
    token is 32 chars helps almost nothing. knowing
    its first character helps enormously.

    what is NOT fine: letting the throw escape.
    a wrong-length token then returns 500 instead
    of 401, which tells the attacker something AND
    looks like a bug in your logs.


    the stronger version: hash both sides first
      two SHA-256 digests are always the same length
      → the length check disappears`,
      codeExample: {
        title: "Comparing bytes, and comparing secrets",
        code: `import { timingSafeEqual, createHash } from "node:crypto";

// ── equals, not === ─────────────────────────────────────────
const a = Buffer.from("hello");
const b = Buffer.from("hello");

console.log(a === b);                 // false   ← references
console.log(a == b);                  // false
console.log(a.equals(b));             // true    ← bytes

console.log(Buffer.compare(a, b));    // 0, for sorting


// ── concat: allocate once, not per iteration ────────────────
console.log(Buffer.concat([Buffer.from("Hello "), Buffer.from("Rajan")])
  .toString());                       // Hello Rajan

// ✗ quadratic: a new allocation and full copy every time
// let acc = Buffer.alloc(0);
// for (const chunk of chunks) acc = Buffer.concat([acc, chunk]);

// ✓ collect, then concat once
const chunks = [];
for (const piece of ["Hello ", "Rajan", "!"]) chunks.push(Buffer.from(piece));
console.log(Buffer.concat(chunks).toString());        // Hello Rajan!


// ── The length requirement is a real throw ──────────────────
try {
  timingSafeEqual(Buffer.from("abc"), Buffer.from("abcd"));
} catch (error) {
  console.log(error.code);
  // ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH
  console.log(error.message);
  // Input buffers must have the same byte length
}
//
// Let that escape and a wrong-length token returns 500
// instead of 401.


// ── A token check that handles both ─────────────────────────
function checkToken(provided, expected) {
  if (typeof provided !== "string" || provided.length === 0) return false;
  //   Buffer.from(undefined) throws, so guard the header first

  const p = Buffer.from(provided);
  const e = Buffer.from(expected);

  if (p.length !== e.length) return false;    // leaks length, fine
  return timingSafeEqual(p, e);
}

console.log(checkToken("secret123", "secret123"));   // true
console.log(checkToken("secret124", "secret123"));   // false
console.log(checkToken("short", "secret123"));       // false
console.log(checkToken(undefined, "secret123"));     // false, no throw


// ── The stronger version: hash first ────────────────────────
function checkTokenHashed(provided, expected) {
  if (typeof provided !== "string") return false;

  const sha = (s) => createHash("sha256").update(s).digest();

  return timingSafeEqual(sha(provided), sha(expected));
  //   two SHA-256 digests are always 32 bytes, so the length
  //   check disappears and the comparison is fixed-width
  //   by construction
}

console.log(checkTokenHashed("secret123", "secret123"));   // true
console.log(checkTokenHashed("x", "secret123"));           // false


// ── Where it matters, and where it does not ─────────────────
// use it       API tokens, webhook signatures, reset tokens,
//              session ids, HMAC verification
// skip it      usernames, numeric ids, anything public`,
      },
      keyTakeaways: [
        "`buffer.equals()` compares bytes. `===` compares references and is always false for two Buffers.",
        "`Buffer.compare()` returns -1, 0 or 1, for sorting.",
        "`Buffer.concat()` allocates a new Buffer and copies, because a Buffer's length is fixed.",
        "So concatenating in a loop is quadratic. Collect the chunks and concat <b>once</b>.",
        "A normal comparison <b>stops at the first difference</b>, so how long it takes reveals how much matched.",
        "That turns guessing a long token from impossible into a few thousand measured requests.",
        "`timingSafeEqual` compares every byte regardless, so the timing carries no signal.",
        "Honestly: over a network latency noise mostly swamps it. It costs nothing, which is the argument.",
        "It <b>throws</b> `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` on a length mismatch. Check length first.",
        "The length check leaks the length, which is accepted. Letting the throw escape is not: you get a 500 instead of a 401.",
        "`Buffer.from(undefined)` throws, so guard a missing header before building the Buffer.",
        "Hashing both sides first makes the lengths always match, so the length check disappears.",
      ],
      commonMistakes: [
        "<b>Using `===` on two Buffers</b> — always false. Use `.equals()`.",
        "<b>`acc = Buffer.concat([acc, chunk])` in a loop</b> — a full allocation and copy every iteration.",
        "<b>Calling `timingSafeEqual` without a length check</b> — it throws, and an unhandled throw becomes a 500.",
        "<b>Returning 500 for a wrong-length token</b> — it tells the attacker something and looks like a bug in your logs.",
        "<b>`Buffer.from(req.headers.authorization)` on a missing header</b> — `Buffer.from(undefined)` throws.",
        "<b>Reaching for `timingSafeEqual` on usernames or ids</b> — it is for secret material, not everything.",
        "<b>Assuming `===` on secrets is fine because network noise hides it</b> — it might be, and the safe version is free.",
      ],
      quiz: [
        {
          question: "Why does a normal string comparison leak information about a secret?",
          options: [
            "It logs the comparison",
            "It stops at the first differing byte, so the time taken reveals how many leading bytes matched",
            "It converts the secret to a Buffer",
            "It caches the result",
          ],
          correctIndex: 1,
          explanation:
            "An attacker measures which guess took longest, keeps that character, and moves on. That reduces guessing a 32-character token to a few thousand requests instead of an impossible search.",
        },
        {
          question: "`timingSafeEqual(Buffer.from(\"abc\"), Buffer.from(\"abcd\"))`. What happens?",
          options: [
            "Returns `false`",
            "Throws `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH`",
            "Compares the first 3 bytes",
            "Returns `true`",
          ],
          correctIndex: 1,
          explanation:
            "Same byte length is required. Check it yourself and return false, because letting the throw escape turns a wrong-length token into a 500 instead of a 401.",
        },
        {
          question: "Why does hashing both values before comparing remove the need for a length check?",
          options: [
            "Hashing is faster",
            "Two digests from the same algorithm are always the same length, so the comparison is fixed-width by construction",
            "Hashes cannot be compared unsafely",
            "It encrypts the values",
          ],
          correctIndex: 1,
          explanation:
            "Two SHA-256 digests are both 32 bytes whatever the inputs were, so the mismatch case disappears and nothing leaks the original length either.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "You allocate a 200MB Buffer. Which metric moves?",
      options: [
        "`heapUsed`, by about 200MB",
        "`rss`, by about 200MB, while `heapUsed` barely changes",
        "Both, by about 200MB",
        "Neither",
      ],
      correctIndex: 1,
      explanation:
        "Buffer memory is off-heap, which is what lets the OS use it without a copy. It also means a Buffer leak is invisible in heap metrics and perfectly visible to whatever OOM-kills you.",
    },
    {
      question: "You test `Buffer.allocUnsafe(32)` and it is all zeros. What have you learned?",
      options: [
        "It is safe",
        "Almost nothing. Fresh memory is often already zero, and it will hold recycled data under load",
        "Node zeroes it anyway",
        "The allocation failed",
      ],
      correctIndex: 1,
      explanation:
        "It looks correct exactly when you check it and leaks other requests' memory later. That failure shape is why `alloc` should be the default.",
    },
    {
      question: "What is `\"😀\".length` in JavaScript?",
      options: ["1", "2", "4", "It throws"],
      correctIndex: 1,
      explanation:
        "JS strings are UTF-16, so this emoji is a surrogate pair. `Buffer.byteLength` gives 4 UTF-8 bytes and `[...str].length` gives 1 character. Three answers, all correct about different things.",
    },
    {
      question: "Why is HTTP Basic auth's base64 not a security measure?",
      options: [
        "It uses a short key",
        "Base64 is a transport format, not encryption. It reverses in one line",
        "It only encodes the password",
        "It is a security measure",
      ],
      correctIndex: 1,
      explanation:
        "Base64 exists so bytes can travel through text-only channels. Nothing is secret, which is exactly why Basic auth means nothing without HTTPS underneath.",
    },
    {
      question: "You read a PNG width with `readUInt32LE` instead of `readUInt32BE`. What happens?",
      options: [
        "An `ERR_OUT_OF_RANGE` error",
        "A plausible-looking wrong number, with no error",
        "The correct value",
        "`undefined`",
      ],
      correctIndex: 1,
      explanation:
        "Endianness mistakes are silent. Only going past the end of the buffer throws. PNG is big-endian, like most network-facing formats.",
    },
    {
      question: "`const part = full.subarray(0, 2); part[0] = 74;`. What happens to `full`?",
      options: [
        "Nothing, `subarray` copies",
        "`full` changes too, because they share the same memory",
        "A TypeError",
        "`full` is truncated",
      ],
      correctIndex: 1,
      explanation:
        "Sharing avoids an allocation, and it means holding a small subarray of a huge Buffer keeps the entire original alive. Copy with `Buffer.from(part)` when you mean to keep it.",
    },
    {
      question: "You decode the two halves of a split emoji separately. What do you get?",
      options: [
        "The emoji",
        "Three replacement characters, and a changed string length",
        "An error",
        "Half the emoji",
      ],
      correctIndex: 1,
      explanation:
        "Neither half is a valid sequence. The length change is what goes on to break downstream code, and `StringDecoder` exists to hold the orphan bytes until the next chunk arrives.",
    },
    {
      question: "Why does a normal `===` on a secret token leak information?",
      options: [
        "It logs the value",
        "It stops at the first difference, so the time reveals how many leading bytes matched",
        "It coerces the types",
        "It caches results",
      ],
      correctIndex: 1,
      explanation:
        "Measure which guess took longest, keep that character, move on. `timingSafeEqual` compares every byte regardless, so there is no signal to measure.",
    },
    {
      question: "`timingSafeEqual` with two different-length Buffers does what?",
      options: [
        "Returns `false`",
        "Throws, which becomes a 500 instead of a 401 if you do not handle it",
        "Pads the shorter one",
        "Compares the overlap",
      ],
      correctIndex: 1,
      explanation:
        "Check the length yourself and return false. Hashing both sides first is the stronger fix, since two digests are always the same length.",
    },
  ],
  project: {
    name: "day-07",
    goal: "Decode a base64 PNG, write it to disk, and read its dimensions straight out of the bytes with no image library.",
    brief:
      "This is the day in one program: base64 in, bytes out, a signature check, and integer reads at fixed offsets. The dimensions are the interesting part, because you have to find where they live and which byte order they use. PNG is big-endian, which is the convention for network-facing formats, so getting it wrong gives you a plausible wrong number rather than an error.",
    steps: [
      "Create `day-07/` with `package.json` containing `\"type\": \"module\"`, an `index.js`, and an `image.txt` holding a base64-encoded PNG.",
      "Read `image.txt` as utf8 and decode it with `Buffer.from(data, \"base64\")`.",
      "Write those bytes straight to `image.png` with `writeFile`. Do not convert to a string on the way.",
      "Check the first 8 bytes against the PNG signature `89 50 4e 47 0d 0a 1a 0a`. Print the hex with `subarray(0, 8).toString(\"hex\")` so you can see it.",
      "Find the width and height in the IHDR chunk and read them with `readUInt32BE`. Work out the offsets yourself from the PNG layout.",
      "Print the format, the dimensions, and the file size from `buffer.length`.",
      "Try the same reads with `readUInt32LE` and note what you get, so the endianness point lands.",
    ],
    acceptance: [
      "`node index.js` writes a valid `image.png` that opens in an image viewer.",
      "The signature check passes on a real PNG and prints `Invalid PNG` on anything else, rather than throwing.",
      "Width and height are correct, read with `readUInt32BE` from the right offsets.",
      "Output reads like `Image format: PNG` / `Width: 800` / `Height: 600` / `File size: 245 KB`.",
      "The file size is derived from `buffer.length` and formatted yourself, since that value is in bytes.",
      "A truncated file shorter than the header produces a clear message, not an `ERR_OUT_OF_RANGE` stack trace.",
      "You can say what `readUInt32LE` returned instead, and why nothing errored.",
    ],
    stretch: [
      "Add JPEG detection from its `ff d8 ff` signature, so file type comes from the bytes rather than the filename.",
      "Read the bit depth and colour type out of IHDR too, and print what they mean.",
      "Walk the PNG chunk list: each chunk is a 4-byte big-endian length, a 4-byte ASCII type readable with `latin1`, the data, then a 4-byte CRC. Print every chunk type until you reach IEND.",
      "Verify the IHDR CRC with `zlib.crc32` and report whether the header is intact.",
      "Compare `Buffer.byteLength(base64String)` against `decoded.length` and confirm the roughly 33% base64 overhead from the encodings lesson.",
    ],
  },
};
