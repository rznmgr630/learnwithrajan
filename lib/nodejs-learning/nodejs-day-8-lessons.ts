import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_8_LESSONS: LessonDay = {
  day: 8,
  title: "Streams",
  totalMinutes: 96,
  difficulty: "Advanced",
  lessons: [
    {
      id: "why-streams",
      title: "Why streams exist",
      durationMinutes: 10,
      explanation:
        "<b>Streams are one of the most important Node concepts to understand properly.</b>\n\nProcess a 1GB file with `readFile()` and Node loads a huge amount of data into memory at once. A stream lets you process it <b>piece by piece</b>.\n\n```text\nWithout streams:\n\n1 GB file\n   ↓\nreadFile()\n   ↓\n1 GB in memory\n   ↓\nProcess\n\n\nWith streams:\n\n1 GB file\n   ↓\nsmall chunk\n   ↓\nprocess\n   ↓\nsmall chunk\n   ↓\nprocess\n   ↓\n...\n```\n\n---\n\n## The memory argument\n\nYour server receives a:\n\n```text\n1 GB CSV file\n```\n\nYou could do:\n\n```javascript\nconst data = await fs.readFile(\"users.csv\");\n```\n\nNow you have a very large amount of data in memory. And if 100 users upload 1GB files at once:\n\n```text\n100 × 1 GB\n     ↓\n100 GB\n     ↓\n💥 Memory problem\n```\n\nWith a stream:\n\n```text\n1 GB file\n     ↓\nchunk\n     ↓\nprocess\n     ↓\ndiscard/use chunk\n     ↓\nnext chunk\n```\n\nMemory stays small.\n\n---\n\n## It is worse than the file size suggests\n\nHere is the part that surprises people, measured rather than guessed. An 88MB CSV, read with `readFile` and split into lines:\n\n```text\nreadFile + split\n  initial rss:  45 MB\n  peak rss:    354 MB      ← 4x the file\n\nstream + transform\n  initial rss:  46 MB\n  peak rss:    118 MB\n```\n\nFour times the file size, not one. Because you do not end up with one copy, you end up with three:\n\n```text\nFile on disk        88 MB\n  ↓ readFile\nBuffer              88 MB\n  ↓ toString()\nString             ~88 MB   (a second copy)\n  ↓ split(\"\\n\")\nArray of 3M strings ~180 MB (a third, plus per-string overhead)\n```\n\nSo a 1GB file is not a 1GB problem. It is a 4GB problem, and Node's default heap limit is smaller than that. You do not get a slow program, you get a crash.\n\n---\n\n## What a stream is\n\n<b>Stream</b> (an interface for processing data incrementally instead of needing all of it at once).\n\nThink of a pipe:\n\n```text\nSource\n  │\n  │ data\n  ↓\n┌──────────┐\n│  PIPE     │\n└──────────┘\n  ↓\nDestination\n```\n\nData keeps moving through.\n\n```text\nFile → HTTP response\nHTTP request → File\nFile → CSV parser → Database\nVideo → Browser\nCompression → File\n```\n\n---\n\n## The second reason, which matters more than memory\n\nMemory is the argument everyone gives. The one that matters in a real server is <b>latency</b>.\n\nWith `readFile`, nothing happens until everything has been read. The user waits for the whole file, then gets a response. With a stream, the first bytes reach them immediately and the rest follows.\n\nThat is why video plays before it has downloaded, and why a streamed HTTP response feels fast even when the total time is identical. Same total work, completely different experience.\n\nIt also means a stream can process input <b>larger than your memory</b>, and can start work on data that has not finished arriving. Neither is possible with the read-it-all approach.",
      diagram: `The measured cost, on an 88MB CSV

    readFile + split          stream + transform
    ┌────────────────────┐    ┌────────────────────┐
    │ initial   45 MB    │    │ initial   46 MB    │
    │ peak     354 MB    │    │ peak     118 MB    │
    └────────────────────┘    └────────────────────┘
              │
              └─ FOUR TIMES the file size


Why 4x, not 1x

    file on disk            88 MB
        ↓  readFile
    Buffer                  88 MB
        ↓  .toString()
    String                 ~88 MB    a second copy
        ↓  .split("\\n")
    Array of 3M strings   ~180 MB    a third, plus
                                     per-string overhead

    so a 1 GB file is a 4 GB problem, and Node's
    default heap is smaller than that

    you do not get a slow program. you get a crash.


The reason that matters more: latency

    readFile                stream
    ████████████ read       ██─►██─►██─►██─►
                 │            │
                 └─ respond   └─ first bytes reach the user
                               immediately, rest follows

    same total work. completely different experience.

    it is why video plays before it has downloaded.


And two things only a stream can do

    process input LARGER than your memory
    start work on data that has not finished arriving`,
      codeExample: {
        title: "The same job, both ways, with real numbers",
        code: `import fs from "node:fs";
import { readFile } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { Transform } from "node:stream";

const mb = (b) => Math.round(b / 1024 / 1024);

// ══ readFile: three copies in memory ════════════════════════
// console.log("initial rss:", mb(process.memoryUsage().rss));
//
// const data = await readFile("big.csv", "utf8");   // copy 2
// const rows = data.split("\\n");                    // copy 3
//
// console.log("rows:", rows.length);
// console.log("peak rss:", mb(process.memoryUsage().rss));
//
// On an 88MB file:
//   initial rss: 45 MB
//   peak rss:   354 MB          ← 4x the file


// ══ stream: one chunk at a time ═════════════════════════════
let peak = 0;
const sampler = setInterval(() => {
  peak = Math.max(peak, process.memoryUsage().rss);
}, 20);

let leftover = "";
let seen = 0;
let kept = 0;

const filter = new Transform({
  transform(chunk, _encoding, callback) {
    const lines = (leftover + chunk).split("\\n");
    leftover = lines.pop();                 // hold the partial line

    for (const line of lines) {
      seen += 1;
      if (line.endsWith(",true")) {
        kept += 1;
        this.push(line + "\\n");
      }
    }
    callback();
  },

  flush(callback) {
    if (leftover) this.push(leftover + "\\n");
    callback();
  },
});

await pipeline(
  fs.createReadStream("big.csv"),
  filter,
  fs.createWriteStream("out.csv"),
);

clearInterval(sampler);
console.log("seen:", seen, "kept:", kept, "peak rss:", mb(peak), "MB");
//
// On the same 88MB file:
//   seen: 3000001  kept: 1500000  peak rss: 118 MB
//
// Three times less memory, and it would work identically on
// a 100GB file.


// ══ The latency difference ══════════════════════════════════
// app.get("/report", async (req, res) => {
//   const data = await readFile("huge.csv");   // user waits for ALL
//   res.end(data);
// });
//
// app.get("/report", (req, res) => {
//   fs.createReadStream("huge.csv").pipe(res);  // first bytes go
// });                                            // out immediately
//
// Same total work. The second one feels fast.`,
      },
      keyTakeaways: [
        "A <b>stream</b> processes data incrementally instead of needing all of it at once.",
        "`readFile` on a large file costs far more than the file size: measured at <b>4x</b> on an 88MB CSV.",
        "Because you get three copies: the Buffer, the string, and the array of split lines.",
        "So a 1GB file is a 4GB problem, and Node's default heap is smaller than that. It crashes, not slows.",
        "The same work streamed peaked at 118MB instead of 354MB, and would work on a 100GB file.",
        "Memory is the usual argument. <b>Latency is the one that matters more in a server.</b>",
        "With `readFile` the user waits for everything. With a stream the first bytes go out immediately.",
        "That is why video plays before it finishes downloading. Same total work, different experience.",
        "Only a stream can process input larger than your memory, or start work on data still arriving.",
      ],
      commonMistakes: [
        "<b>Estimating memory from the file size</b> — `readFile` plus `toString` plus `split` is roughly four copies.",
        "<b>Assuming a big file just makes things slow</b> — past the heap limit the process dies instead.",
        "<b>Reading a whole file to send it in a response</b> — the user waits for all of it before receiving anything.",
        "<b>Testing with a small file</b> — every problem in this lesson only appears at size.",
        "<b>Thinking streams are only about memory</b> — being able to start before the input has finished is often the bigger win.",
      ],
      quiz: [
        {
          question: "You `readFile` an 88MB CSV, call `toString()`, then `split(\"\\n\")`. Roughly what peak memory should you expect?",
          options: ["About 88MB", "About 180MB", "About 350MB, roughly 4x the file", "About 1GB"],
          correctIndex: 2,
          explanation:
            "You end up holding three copies: the Buffer, the string, and the array of split lines with its per-string overhead. Measured at 354MB against a 45MB baseline.",
        },
        {
          question: "Beyond memory, what is the argument for streaming a large HTTP response?",
          options: [
            "It compresses better",
            "The first bytes reach the user immediately instead of after the whole file is read",
            "It uses fewer sockets",
            "It avoids the event loop",
          ],
          correctIndex: 1,
          explanation:
            "Total work is the same, but perceived speed is completely different. It is why video plays before it has finished downloading.",
        },
        {
          question: "What can a stream do that reading the whole input cannot?",
          options: [
            "Read faster from disk",
            "Process input larger than available memory, and start work before the input has finished arriving",
            "Avoid errors",
            "Skip encoding conversions",
          ],
          correctIndex: 1,
          explanation:
            "Both follow from never holding the whole thing. A 100GB file is fine, and a network source can be processed as it arrives.",
        },
      ],
    },
    {
      id: "four-stream-types",
      title: "The four types of stream",
      durationMinutes: 10,
      explanation:
        "Node has four:\n\n```text\nReadable\nWritable\nDuplex\nTransform\n```\n\n---\n\n## Readable\n\n<b>Readable</b> (a stream that produces data).\n\n```text\nFile\nHTTP request\nReadable custom source\n```\n\n```javascript\nimport fs from \"node:fs\";\n\nconst stream = fs.createReadStream(\"large.csv\");\n```\n\n```text\nlarge.csv\n   ↓\nReadable Stream\n   ↓\nchunk 1\nchunk 2\nchunk 3\n...\n```\n\n---\n\n## Writable\n\n<b>Writable</b> (a stream that receives data).\n\n```javascript\nconst stream = fs.createWriteStream(\"output.txt\");\n```\n\n```text\nchunk 1\nchunk 2\nchunk 3\n   ↓\nWritable Stream\n   ↓\noutput.txt\n```\n\n---\n\n## Duplex\n\n<b>Duplex</b> (both readable and writable).\n\n```text\nreceive data\n     ↓\nprocess/communicate\n     ↓\nproduce data\n```\n\nA network socket is the usual example.\n\n```text\nClient\n  ↕\nSocket\n  ↕\nServer\n```\n\nThe two directions are <b>independent</b>, which is the defining feature. What you read from a socket has no particular relationship to what you write to it. You can finish writing while still reading.\n\n---\n\n## Transform\n\n<b>Transform</b> (a Duplex stream where the output is derived from the input).\n\n```text\nInput\n ↓\nTransform\n ↓\nOutput\n```\n\n```text\n\"hello\"\n\"world\"\n```\n\nthrough an uppercase transform:\n\n```text\n\"HELLO\"\n\"WORLD\"\n```\n\nUseful for:\n\n```text\nCompression\nEncryption\nCSV processing\nFiltering\nParsing\nFormatting\n```\n\nSo the difference from a plain Duplex is the <b>connection</b> between the sides: in a Transform, what comes out is what went in, changed. In a Duplex, the two halves are unrelated.\n\n---\n\n## Together\n\n```text\nReadable\n   ↓\nTransform\n   ↓\nWritable\n```\n\nand:\n\n```text\nDuplex\n ↕\nRead + Write\n```\n\nA real example:\n\n```text\nlarge.csv\n   ↓\nReadable\n   ↓\nCSV Transform\n   ↓\nFilter Transform\n   ↓\nWritable\n   ↓\ndatabase/file\n```\n\n---\n\n## Where you have already met them\n\nWorth noticing, because it reframes a lot of Node you have already used:\n\n```text\nprocess.stdin           Readable\nprocess.stdout          Writable\nprocess.stderr          Writable\n\nfs.createReadStream     Readable\nfs.createWriteStream    Writable\n\nreq  (http server)      Readable\nres  (http server)      Writable\n\nnet.Socket              Duplex\n\nzlib.createGzip         Transform\ncrypto.createCipheriv   Transform\n```\n\nThat last group is the point. Gzip and encryption are Transforms, which is why you can compress a file on its way to a response without ever holding it: `file → gzip → response` is three streams and no buffer.\n\nAnd `req` being a Readable is why a request body arrives in chunks, and why Day 7's `StringDecoder` lesson mattered.",
      diagram: `The four, and how they relate

    Readable    produces        file, request, stdin
        │
        ↓
    Transform   in → out        gzip, cipher, your parser
        │       (a Duplex whose sides are CONNECTED)
        ↓
    Writable    receives        file, response, stdout


    Duplex      both, INDEPENDENTLY      socket
      ↕
    what you read has no relationship to what you write.
    you can finish writing while still reading.

    that independence is the whole difference from a
    Transform, where output IS the input, changed.


You have been using these all along

    process.stdin          Readable
    process.stdout         Writable
    process.stderr         Writable

    fs.createReadStream    Readable
    fs.createWriteStream   Writable

    req  (http)            Readable    ← why bodies arrive
    res  (http)            Writable       in chunks

    net.Socket             Duplex

    zlib.createGzip        Transform   ← this is the
    crypto.createCipheriv  Transform      interesting one


Which is why this works with no buffer at all

    file  ──►  gzip  ──►  response
      │         │            │
    Readable  Transform    Writable

    a compressed file served without ever holding it`,
      codeExample: {
        title: "All four, and the ones you already knew",
        code: `import fs from "node:fs";
import { pipeline } from "node:stream/promises";
import { Transform, Readable, Writable, Duplex } from "node:stream";
import { createGzip } from "node:zlib";

// ── Readable: produces ──────────────────────────────────────
const input = fs.createReadStream("package.json");
console.log(input instanceof Readable);          // true

// ── Writable: receives ──────────────────────────────────────
const output = fs.createWriteStream("copy.json");
console.log(output instanceof Writable);         // true

// ── Transform: output derived from input ────────────────────
const upper = new Transform({
  transform(chunk, _encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});
console.log(upper instanceof Duplex);            // true, a Transform
console.log(upper instanceof Transform);         // IS a Duplex


// ── The ones you have used without noticing ─────────────────
console.log(process.stdin instanceof Readable);   // true
console.log(process.stdout instanceof Writable);  // true
console.log(createGzip() instanceof Transform);   // true
//
// gzip being a Transform is the interesting one. It means:


// ── A compressed file, served without holding it ────────────
await pipeline(
  fs.createReadStream("package.json"),   // Readable
  createGzip(),                          // Transform
  fs.createWriteStream("package.json.gz"),  // Writable
);
console.log("gzipped:", fs.statSync("package.json.gz").size, "bytes");
//
// Three streams, no buffer. The same shape works for
// file → gzip → HTTP response.


// ── A chain of transforms ───────────────────────────────────
const stripBlank = new Transform({
  transform(chunk, _e, cb) {
    cb(null, chunk.toString().split("\\n").filter(Boolean).join("\\n"));
  },
});

await pipeline(
  fs.createReadStream("package.json"),
  stripBlank,
  upper,
  fs.createWriteStream("out.txt"),
);
console.log("chained two transforms");


// ── Duplex: the two sides are unrelated ─────────────────────
// const socket = net.connect(3000);
//
// socket.write("request");                 the write side
// for await (const chunk of socket) { }    the read side
//
// What you read has no particular relationship to what you
// wrote, and you can end() the write side while still
// reading. That independence is what separates a Duplex
// from a Transform.

fs.rmSync("copy.json", { force: true });
fs.rmSync("out.txt", { force: true });
fs.rmSync("package.json.gz", { force: true });`,
      },
      keyTakeaways: [
        "<b>Readable</b> produces data: files, requests, `process.stdin`.",
        "<b>Writable</b> receives it: files, responses, `process.stdout`.",
        "<b>Duplex</b> is both, and the two directions are <b>independent</b>. A socket is the example.",
        "<b>Transform</b> is a Duplex whose output is the input, changed.",
        "That connection between the sides is the whole difference between Transform and Duplex.",
        "You have already been using streams: `stdin`, `stdout`, `createReadStream`, `req`, `res`.",
        "`req` being a Readable is why request bodies arrive in chunks.",
        "<b>gzip and encryption are Transforms</b>, which is the useful realisation.",
        "So `file → gzip → response` is three streams and no buffer at all.",
      ],
      commonMistakes: [
        "<b>Thinking a Transform and a Duplex are the same</b> — in a Duplex the two sides are unrelated.",
        "<b>Not recognising `req` and `res` as streams</b> — that is why you can pipe a file straight to a response.",
        "<b>Buffering a file to compress it</b> — gzip is a Transform, so it belongs in the pipeline.",
        "<b>Writing a Transform when a `map` over an array would do</b> — streams are for data you cannot hold.",
        "<b>Assuming `process.stdout.write` is asynchronous everywhere</b> — to a terminal it is synchronous, to a pipe it is not.",
      ],
      quiz: [
        {
          question: "What distinguishes a Transform from a plain Duplex?",
          options: [
            "A Transform is faster",
            "In a Transform the output is derived from the input; in a Duplex the two directions are independent",
            "A Duplex cannot be piped",
            "A Transform is not a Duplex",
          ],
          correctIndex: 1,
          explanation:
            "A socket's read side has no relationship to its write side. A Transform's output is exactly its input, changed, which is what makes it fit in the middle of a pipeline.",
        },
        {
          question: "Why does knowing gzip is a Transform matter?",
          options: [
            "It compresses better as a stream",
            "It means you can put compression in the middle of a pipeline and serve a compressed file without ever holding it",
            "It avoids the event loop",
            "It removes the need for a Writable",
          ],
          correctIndex: 1,
          explanation:
            "`file → gzip → response` becomes three streams and no buffer. Encryption works the same way, since `createCipheriv` is also a Transform.",
        },
        {
          question: "Why do HTTP request bodies arrive in chunks?",
          options: [
            "Express splits them",
            "`req` is a Readable stream",
            "Node limits body size",
            "The client sends them that way deliberately",
          ],
          correctIndex: 1,
          explanation:
            "The request object is a stream, which is exactly why Day 7's `StringDecoder` lesson applies to reading a body.",
        },
      ],
    },
    {
      id: "modes-and-backpressure",
      title: "Paused mode, flowing mode and backpressure",
      durationMinutes: 12,
      explanation:
        "## Paused mode\n\n<b>Paused mode</b> (the stream waits until your code asks for more data).\n\n```javascript\nconst stream = fs.createReadStream(\"large.txt\");\n\nstream.on(\"readable\", () => {\n  let chunk;\n\n  while ((chunk = stream.read()) !== null) {\n    console.log(chunk);\n  }\n});\n```\n\nYou control when data is read.\n\n---\n\n## Flowing mode\n\n<b>Flowing mode</b> (chunks arrive automatically through `'data'` events).\n\n```javascript\nstream.on(\"data\", chunk => {\n  console.log(chunk);\n});\n```\n\n```text\nStream\n  ↓\nchunk\n  ↓\ndata event\n  ↓\nyour callback\n```\n\nThe stream keeps producing.\n\nThe detail that matters: a stream <b>starts paused</b> and switches to flowing the moment you attach a `'data'` handler. And once it is flowing, it does not wait for you. That is where the next problem comes from.\n\n---\n\n## Backpressure\n\nOne of the most important stream concepts.\n\n```text\nReadable\n   ↓\nproduces 100 MB/s\n\nWritable\n   ↓\ncan only process 10 MB/s\n```\n\nWhat happens?\n\n```text\nProducer: 100 MB/s\nConsumer: 10 MB/s\n```\n\nThe producer is faster. Keep accepting everything and:\n\n```text\n10 MB\n20 MB\n30 MB\n40 MB\n...\n1 GB\n...\n10 GB\n```\n\nMemory grows. Eventually:\n\n```text\nRAM\n ↓\nfull\n ↓\n💥 server crashes\n```\n\n> <b>Backpressure</b> (when a producer is faster than the consumer, requiring the producer to slow down).\n\n---\n\n## The pipe analogy\n\n```text\nHuge pipe\n   ↓\nsmall pipe\n```\n\nThe big pipe delivers faster than the small one accepts. You have to reduce the flow.\n\n```text\nProducer\n   ↓\nBackpressure\n   ↓\nSlow down\n   ↓\nConsumer catches up\n```\n\n---\n\n## Why it matters in real servers\n\nAn HTTP server sending a huge file. Without flow control:\n\n```text\nDisk\n ↓\nFast\n ↓\nMemory\n ↓\nNetwork\n ↓\nSlow\n```\n\nData accumulates in memory. With backpressure:\n\n```text\nDisk\n ↓\nchunk\n ↓\nNetwork\n ↓\nslow\n ↓\nTell producer to slow down\n```\n\nThis is why streams are essential for scalable Node applications.\n\n---\n\n## The mechanism, and how to lose it\n\nWorth knowing concretely, because backpressure is not magic and it is easy to switch off by accident.\n\n`writable.write()` returns a <b>boolean</b>. `true` means keep going, `false` means the internal buffer is full and you should wait for the `'drain'` event. The `highWaterMark` is that buffer's size, 64KB by default for byte streams.\n\nSo honouring backpressure manually looks like:\n\n```javascript\nif (!dest.write(chunk)) {\n  source.pause();\n  dest.once(\"drain\", () => source.resume());\n}\n```\n\nAnd here is the trap. This looks reasonable and is broken:\n\n```javascript\nsource.on(\"data\", (chunk) => {\n  dest.write(chunk);        // return value ignored\n});\n```\n\nIgnoring that return value means the writable's buffer grows without limit while `'data'` keeps firing. You have re-created the memory problem streams were supposed to solve, and it will look fine on a small file.\n\nThe worst version is an `async` handler:\n\n```javascript\nsource.on(\"data\", async (chunk) => {\n  await slowThing(chunk);   // nothing waits for this\n});\n```\n\nThe event emitter does not await your callback, so every chunk starts a new unfinished operation. Memory climbs and the ordering is gone too.\n\nThe practical answer is not to write this code at all. `pipe()` and `pipeline()` handle the whole dance, and `for await` gets it right automatically because the loop body genuinely blocks the iteration. That is the real reason to prefer them.",
      diagram: `A stream starts paused and flows when you listen

    created                 paused
        │
        │  .on("data", fn)
        ↓
    flowing                 chunks arrive automatically
        │                   and it does NOT wait for you
        └─► which is where backpressure comes from


Backpressure: the mechanism, not the metaphor

    dest.write(chunk)  →  true    buffer has room, keep going
                       →  false   buffer FULL, wait for "drain"

    highWaterMark = that buffer's size, 64KB by default

    honouring it:
      if (!dest.write(chunk)) {
        source.pause()
        dest.once("drain", () => source.resume())
      }


How to switch it off by accident

    ✗ source.on("data", (chunk) => {
        dest.write(chunk)          ← return value IGNORED
      })

      "data" keeps firing, the buffer grows without limit.
      you have re-created the memory problem streams
      were meant to solve. and it looks fine on a
      small file.

    ✗✗ source.on("data", async (chunk) => {
          await slowThing(chunk)   ← nothing waits for this
        })

      the emitter does not await your callback. every
      chunk starts another unfinished operation, memory
      climbs, and the ordering is gone too.


Which is why you should not write it

    pipe()       handles the whole dance
    pipeline()   handles it and the errors
    for await    gets it right automatically, because the
                 loop body really does block the iteration

    that is the actual reason to prefer them.`,
      codeExample: {
        title: "Backpressure, honoured and ignored",
        code: `import fs from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable, Writable } from "node:stream";

// ── A fast producer and a slow consumer ─────────────────────
function fastSource(chunks) {
  let n = 0;
  return new Readable({
    read() {
      this.push(n++ < chunks ? Buffer.alloc(64 * 1024, "x") : null);
    },
  });
}

function slowSink(delayMs) {
  let written = 0;
  return new Writable({
    write(chunk, _encoding, callback) {
      written += chunk.length;
      setTimeout(callback, delayMs);      // slow on purpose
    },
    final(callback) {
      console.log("  wrote", Math.round(written / 1024), "KB");
      callback();
    },
  });
}


// ── The broken version: return value ignored ────────────────
const src = fastSource(200);
const dst = slowSink(5);

src.on("data", (chunk) => {
  dst.write(chunk);            // ✗ ignoring the boolean
});

setTimeout(() => {
  console.log("ignored backpressure, buffered:", dst.writableLength, "bytes");
  src.destroy();
  dst.destroy();
}, 100);
//
// writableLength keeps climbing. "data" fires as fast as the
// source can go, and nothing tells it to stop. On a small
// file this looks completely fine.


// ── Honouring it manually ───────────────────────────────────
// const src2 = fastSource(200);
// const dst2 = slowSink(5);
//
// src2.on("data", (chunk) => {
//   if (!dst2.write(chunk)) {          // false = buffer full
//     src2.pause();
//     dst2.once("drain", () => src2.resume());
//   }
// });
//
// Correct, and nobody should write this by hand.


// ── The worst version: an async handler ─────────────────────
// src.on("data", async (chunk) => {
//   await slowThing(chunk);
// });
//
// The emitter does not await your callback. Every chunk
// starts another unfinished operation: memory climbs and
// the ordering is lost too.


// ── What to actually write ──────────────────────────────────
await pipeline(fastSource(200), slowSink(1));
//   handles pause, drain, resume, errors and cleanup

// or, when you need the chunks yourself
const file = fs.createReadStream("package.json");
let bytes = 0;
for await (const chunk of file) {
  bytes += chunk.length;              // the loop body really
}                                     // blocks the iteration,
console.log("read", bytes, "bytes");  // so backpressure is
//                                       honoured for free`,
      },
      keyTakeaways: [
        "A stream starts <b>paused</b> and switches to <b>flowing</b> the moment you attach a `'data'` handler.",
        "Once flowing, it does not wait for you. That is where backpressure comes from.",
        "<b>Backpressure</b> is a producer outpacing its consumer, so the producer must slow down.",
        "Without it, the difference accumulates in memory until the process dies.",
        "The mechanism: `writable.write()` returns `false` when its buffer is full, and you wait for `'drain'`.",
        "`highWaterMark` is that buffer's size, 64KB by default for byte streams.",
        "<b>Ignoring the return value of `write()` switches backpressure off</b>, and it looks fine on a small file.",
        "An `async` `'data'` handler is worse: the emitter never awaits it, so chunks pile up and ordering is lost.",
        "The answer is not to write that code. `pipe`, `pipeline` and `for await` all handle it correctly.",
        "`for await` gets it right because the loop body genuinely blocks the iteration.",
      ],
      commonMistakes: [
        "<b>`stream.on(\"data\", c => dest.write(c))`</b> — ignores the boolean, so the buffer grows without limit.",
        "<b>An `async` `'data'` handler</b> — nothing awaits it, so every chunk starts another unfinished operation.",
        "<b>Concluding it works because a small file was fine</b> — the buffer never filled, so backpressure never mattered.",
        "<b>Raising `highWaterMark` to fix a memory problem</b> — that increases the buffer rather than slowing the producer.",
        "<b>Writing the pause/drain/resume dance by hand</b> — `pipeline` already does it, correctly.",
        "<b>Assuming backpressure is automatic everywhere</b> — it is automatic in `pipe` and `for await`, and absent if you wire it up yourself.",
      ],
      quiz: [
        {
          question: "What does `writable.write(chunk)` returning `false` mean?",
          options: [
            "The write failed",
            "The internal buffer is full: stop writing and wait for the `'drain'` event",
            "The stream is closed",
            "The chunk was too large",
          ],
          correctIndex: 1,
          explanation:
            "The write is still accepted, but the buffer is now over its `highWaterMark`. Ignoring the `false` is exactly how backpressure gets switched off.",
        },
        {
          question: "Why is `source.on(\"data\", async (chunk) => { await slow(chunk); })` particularly bad?",
          options: [
            "`async` handlers are not allowed",
            "The emitter does not await the callback, so every chunk starts another unfinished operation and ordering is lost",
            "It blocks the event loop",
            "It only processes the first chunk",
          ],
          correctIndex: 1,
          explanation:
            "The returned promise is discarded. Chunks keep arriving at full speed while your operations pile up, which is a memory problem and a correctness one at the same time.",
        },
        {
          question: "Why does `for await (const chunk of stream)` honour backpressure automatically?",
          options: [
            "It sets a smaller `highWaterMark`",
            "The loop body genuinely blocks the iteration, so the stream is not asked for more until you are done",
            "It uses paused mode events",
            "It buffers everything first",
          ],
          correctIndex: 1,
          explanation:
            "That is the difference from a `'data'` handler. An emitter cannot wait for your callback, but the async iterator protocol does, which is what makes the loop safe.",
        },
      ],
    },
    {
      id: "pipe-and-pipeline",
      title: "pipe, pipeline, and why the second one",
      durationMinutes: 12,
      explanation:
        "## `pipe()`\n\n```javascript\nreadable.pipe(writable);\n```\n\n```javascript\nimport fs from \"node:fs\";\n\nconst input = fs.createReadStream(\"large.txt\");\nconst output = fs.createWriteStream(\"copy.txt\");\n\ninput.pipe(output);\n```\n\n```text\nlarge.txt\n   ↓\nReadable\n   ↓\npipe()\n   ↓\nWritable\n   ↓\ncopy.txt\n```\n\n`pipe()` handles data flow and backpressure.\n\n---\n\n## Why `pipeline()` is better\n\nModern code should prefer `pipeline()` over chained `pipe()` calls, because it handles:\n\n```text\nErrors\nBackpressure\nCleanup\nStream destruction\nCompletion\n```\n\n```text\nReadable\n   ↓\nTransform A\n   ↓\nTransform B\n   ↓\nWritable\n```\n\nWith `pipe()` you have to think about what happens when:\n\n```text\nTransform B\n    ↓\nERROR\n```\n\n`pipeline()` coordinates the whole chain.\n\n---\n\n## How bad is it, actually\n\nWorth being concrete, because \"handles errors\" undersells it.\n\nWith `pipe()`, an error in a transform becomes an <b>unhandled `'error'` event</b>, which crashes the process:\n\n```text\nnode:events:486\n      throw er; // Unhandled 'error' event\n      ^\nError: transform failed\n```\n\nNot a rejected promise. Not a callback with an error. The process dies. That is because `pipe()` does not forward errors along the chain, and a stream with no `'error'` listener throws.\n\nThe same failure through `pipeline()`:\n\n```javascript\ntry {\n  await pipeline(source, transform, dest);\n} catch (error) {\n  console.log(error.message);   // \"transform failed\"\n}\nconsole.log(dest.destroyed);    // true\n```\n\nCaught, and the destination is destroyed for you.\n\nThat second part matters as much as the first. With `pipe()`, even if you attach `'error'` handlers everywhere, a failure mid-chain leaves the other streams open. The write stream keeps its file descriptor, and Day 6's `EMFILE` waits for you a few thousand requests later.\n\nSo the honest summary is: <b>`pipe()` handles backpressure and nothing else</b>. Errors and cleanup are entirely yours, and getting them right by hand across four streams is more code than using `pipeline`.\n\n---\n\n## `pipeline()`\n\n```javascript\nimport { pipeline } from \"node:stream/promises\";\n```\n\n```javascript\nawait pipeline(\n  input,\n  transform,\n  output\n);\n```\n\n```javascript\nimport fs from \"node:fs\";\nimport { pipeline } from \"node:stream/promises\";\n\nconst input = fs.createReadStream(\"large.txt\");\nconst output = fs.createWriteStream(\"copy.txt\");\n\nawait pipeline(\n  input,\n  output\n);\n```\n\n---\n\n## Why the promise version\n\nThe callback form:\n\n```javascript\npipeline(\n  input,\n  output,\n  error => {\n    if (error) {\n      console.error(error);\n    }\n  }\n);\n```\n\nThe modern form:\n\n```javascript\nawait pipeline(\n  input,\n  output\n);\n```\n\nSo ordinary `try/catch` works:\n\n```javascript\ntry {\n  await pipeline(input, output);\n} catch (error) {\n  console.error(error);\n}\n```\n\nWhich also means the `await` tells you <b>when it finished</b>. With `pipe()` there is no completion signal at all: you listen for `'finish'` on the destination and hope. That is why `pipeline` composes with everything else you have written, and `pipe` does not.\n\n---\n\n## Multiple transforms\n\n```text\nlarge.csv\n   ↓\nRead\n   ↓\nParse\n   ↓\nFilter\n   ↓\nTransform\n   ↓\nWrite\n```\n\n```javascript\nawait pipeline(\n  input,\n  parser,\n  filter,\n  transform,\n  output\n);\n```\n\nNo part of the CSV is ever fully in memory.\n\nAnd `pipeline` accepts more than streams. An async generator works as a stage, which is often the clearest way to write a transform:\n\n```javascript\nawait pipeline(\n  input,\n  async function* (source) {\n    for await (const chunk of source) {\n      yield chunk.toString().toUpperCase();\n    }\n  },\n  output\n);\n```\n\nNo `Transform` class, no `callback`, and errors propagate normally.",
      diagram: `What pipe() actually handles

    backpressure     ✓
    errors           ✗
    cleanup          ✗
    completion       ✗

    that is the honest list.


The failure, measured

    source ──► transform (throws) ──► dest

    with pipe()
      node:events:486
            throw er; // Unhandled 'error' event
            ^
      Error: transform failed
              │
              └─ the PROCESS DIES. not a rejection,
                 not a callback. pipe() does not
                 forward errors, and a stream with
                 no "error" listener throws.

    with pipeline()
      caught: transform failed
      dest.destroyed → true
              │
              └─ and the destination is closed for you


And even with error handlers everywhere

    pipe() leaves the OTHER streams open on a failure
        ↓
    the write stream keeps its file descriptor
        ↓
    Day 6's EMFILE, a few thousand requests later


pipeline also tells you WHEN it finished

    pipe()      no completion signal. listen for
                "finish" on the destination and hope.
    pipeline()  await. it resolves.

    which is why pipeline composes with the rest of
    your async code and pipe does not.


An async generator is a valid stage

    await pipeline(
      input,
      async function* (source) {
        for await (const chunk of source) {
          yield chunk.toString().toUpperCase()
        }
      },
      output,
    )

    no Transform class, no callback, errors propagate
    normally. often the clearest way to write one.`,
      codeExample: {
        title: "The same failure, both ways",
        code: `import fs from "node:fs";
import { pipeline } from "node:stream/promises";
import { Transform, Readable } from "node:stream";

const boom = () =>
  new Transform({
    transform(_chunk, _encoding, callback) {
      callback(new Error("transform failed"));
    },
  });


// ══ pipe(): the process dies ════════════════════════════════
// const dest = fs.createWriteStream("p1.txt");
// Readable.from(["a", "b"]).pipe(boom()).pipe(dest);
//
// node:events:486
//       throw er; // Unhandled 'error' event
//       ^
// Error: transform failed
//     at Transform.transform ...
//
// Not a rejected promise. Not a callback. The process exits.
// pipe() does not forward errors, and a stream with no
// "error" listener throws.


// ══ pipeline(): caught, and cleaned up ══════════════════════
const dest = fs.createWriteStream("p2.txt");

try {
  await pipeline(Readable.from(["a", "b"]), boom(), dest);
} catch (error) {
  console.log("caught:", error.message);      // transform failed
}

console.log("dest destroyed?", dest.destroyed);   // true
//
// The destination is closed for you. With pipe(), even with
// "error" handlers on every stream, the others stay open and
// their descriptors leak.


// ══ Multiple stages ════════════════════════════════════════
const upper = new Transform({
  transform(chunk, _e, cb) {
    cb(null, chunk.toString().toUpperCase());
  },
});

const prefix = new Transform({
  transform(chunk, _e, cb) {
    cb(null, "> " + chunk.toString());
  },
});

await pipeline(
  fs.createReadStream("package.json"),
  upper,
  prefix,
  fs.createWriteStream("out.txt"),
);
console.log("four stages, nothing fully in memory");


// ══ An async generator as a stage ══════════════════════════
await pipeline(
  fs.createReadStream("package.json"),

  async function* (source) {
    for await (const chunk of source) {
      yield chunk.toString().split("\\n").filter(Boolean).join("\\n");
    }
  },

  fs.createWriteStream("out2.txt"),
);
console.log("no Transform class needed");
//
// No callback to remember, errors propagate normally, and it
// reads like the loop it is.


// ══ And it tells you when it finished ══════════════════════
// pipe()      no completion signal. listen for "finish".
// pipeline()  the await resolves.

fs.rmSync("p2.txt", { force: true });
fs.rmSync("out.txt", { force: true });
fs.rmSync("out2.txt", { force: true });`,
      },
      keyTakeaways: [
        "`pipe()` handles <b>backpressure and nothing else</b>. That is the honest list.",
        "With `pipe()`, an error in a transform becomes an unhandled `'error'` event and <b>crashes the process</b>.",
        "Not a rejection, not a callback. `pipe()` does not forward errors, and a stream with no listener throws.",
        "`pipeline()` rejects instead, so ordinary `try/catch` works.",
        "It also <b>destroys the other streams</b> for you, which `pipe()` never does even with error handlers attached.",
        "Leaked write streams keep their file descriptors, and Day 6's `EMFILE` follows.",
        "`pipeline` also tells you <b>when it finished</b>. `pipe` gives no completion signal at all.",
        "That is why `pipeline` composes with the rest of your async code and `pipe` does not.",
        "`pipeline` takes any number of stages, and nothing is ever fully in memory.",
        "An <b>async generator</b> is a valid stage, often clearer than a `Transform` class.",
      ],
      commonMistakes: [
        "<b>Chaining `pipe()` in production code</b> — one transform error takes the whole process down.",
        "<b>Assuming `pipe()` forwards errors</b> — it does not, in either direction.",
        "<b>Attaching `'error'` handlers and thinking you are done</b> — the other streams still leak on failure.",
        "<b>Waiting on `'finish'` to know a pipe completed</b> — `pipeline`'s await is the same thing, done properly.",
        "<b>Using the callback form of `pipeline`</b> — the `node:stream/promises` version fits `try/catch`.",
        "<b>Writing a `Transform` class for something simple</b> — an async generator stage is usually shorter and clearer.",
      ],
      quiz: [
        {
          question: "A transform in a `pipe()` chain calls back with an error and no `'error'` handlers are attached. What happens?",
          options: [
            "The chain stops quietly",
            "An unhandled `'error'` event crashes the process",
            "The error reaches the destination's callback",
            "The chunk is skipped",
          ],
          correctIndex: 1,
          explanation:
            "`pipe()` does not forward errors, and an EventEmitter with no `'error'` listener throws. That is a much stronger argument for `pipeline` than \"it handles errors\".",
        },
        {
          question: "Beyond catching the error, what does `pipeline()` do that manual `pipe()` plus error handlers still does not?",
          options: [
            "It retries the failed stage",
            "It destroys the other streams, so their file descriptors are not leaked",
            "It compresses the data",
            "It slows the producer down",
          ],
          correctIndex: 1,
          explanation:
            "Cleanup is the part people miss. A leaked write stream keeps its descriptor, and enough of those gives you `EMFILE` far away from the code that caused it.",
        },
        {
          question: "What can you pass to `pipeline` besides streams?",
          options: [
            "Nothing, streams only",
            "An async generator function, which acts as a stage",
            "A plain array",
            "A callback",
          ],
          correctIndex: 1,
          explanation:
            "An async generator stage needs no `Transform` class and no `callback`, and errors propagate normally. It is usually the clearest way to express a transformation.",
        },
      ],
    },
    {
      id: "for-await-and-consumers",
      title: "for await, and stream/consumers",
      durationMinutes: 10,
      explanation:
        "## Reading a stream with `for await...of`\n\nStreams are async iterables:\n\n```javascript\nfor await (const chunk of stream) {\n  console.log(chunk);\n}\n```\n\nOne of the cleanest ways to consume a stream manually.\n\n```javascript\nimport fs from \"node:fs\";\n\nconst stream = fs.createReadStream(\"large.txt\");\n\nfor await (const chunk of stream) {\n  console.log(chunk);\n}\n```\n\n```text\nchunk 1\n   ↓\nawait\n   ↓\nchunk 2\n   ↓\nawait\n   ↓\nchunk 3\n```\n\n---\n\n## Why it is useful\n\n```javascript\nfor await (const chunk of stream) {\n  processChunk(chunk);\n}\n```\n\ninstead of:\n\n```javascript\nstream.on(\"data\", ...);\nstream.on(\"end\", ...);\nstream.on(\"error\", ...);\n```\n\nAnd normal `try/catch` works.\n\nThree specific wins over the event version. Backpressure is automatic, for the reason from two lessons ago: the loop body blocks the iteration. Errors land in `catch` rather than needing their own listener. And `break` or `return` <b>destroys the stream</b>, so leaving early cleans up.\n\nOne caveat: it is for consuming a stream at the <b>end</b> of a chain. If you are transforming data on its way somewhere else, `pipeline` with an async generator stage is the better fit, because you keep the backpressure all the way through to the destination.\n\n---\n\n## `stream/consumers`\n\n```javascript\nimport {\n  text,\n  json,\n  buffer,\n  arrayBuffer\n} from \"node:stream/consumers\";\n```\n\nThese consume the <b>entire stream into memory</b>. That is important.\n\n---\n\n## `text()`\n\n<b>`text()`</b> (consumes a stream and returns a string).\n\n```javascript\nconst result = await text(stream);\n\nconsole.log(result);\n```\n\n```text\nstream\n  ↓\nconsume everything\n  ↓\nstring\n```\n\nFine for reasonably small text. Not for:\n\n```text\n1 GB file\n```\n\nIt also handles the multi-byte decoding correctly, which is the reason to use it over collecting chunks and calling `toString` yourself. Day 7's chunk-boundary bug, avoided for free.\n\n---\n\n## `json()`\n\n<b>`json()`</b> (consumes a stream and parses it all as JSON).\n\n```javascript\nconst data = await json(stream);\n\nconsole.log(data);\n```\n\nFor:\n\n```json\n{\"name\":\"Rajan\"}\n```\n\nyou get:\n\n```javascript\n{\n  name: \"Rajan\"\n}\n```\n\n> Not a replacement for streaming a huge JSON dataset.\n\nIt loads everything before parsing. It cannot be otherwise: `JSON.parse` needs the closing brace before it can return anything, which is why there is no such thing as a streaming `JSON.parse` in the standard library. Huge JSON needs a line-delimited format or a dedicated streaming parser.\n\n---\n\n## `buffer()`\n\n<b>`buffer()`</b> (consumes a stream into one Buffer).\n\n```javascript\nconst data = await buffer(stream);\n```\n\nGood for:\n\n```text\nsmall image\nsmall PDF\nsmall API response\n```\n\nBut not:\n\n```javascript\nawait buffer(hugeStream);\n```\n\n---\n\n## `arrayBuffer()`\n\n<b>`arrayBuffer()`</b> (consumes a stream into an `ArrayBuffer`).\n\n```javascript\nconst data = await arrayBuffer(stream);\n```\n\nFor APIs expecting Web-standard binary.\n\n```text\nstream/consumers\n      ↓\nconsume everything\n      ↓\nmemory usage grows with input size\n```\n\n---\n\n## The point of having both\n\nThese helpers exist because <b>not everything should be streamed</b>. A webhook body, a small config file, a JSON API response: reading it all is simpler and the size is bounded.\n\nThe question is whether the size is <b>bounded and small</b>. A request body with a size limit is fine. A user-uploaded file is not, and that is exactly where the read-it-all habit turns into an outage.\n\nSo: `stream/consumers` when you know it is small, `pipeline` when you do not.",
      diagram: `for await, and what it gives you for free

    for await (const chunk of stream) { ... }

    backpressure    automatic. the loop body blocks
                    the iteration.
    errors          land in catch. no "error" listener.
    early exit      break or return DESTROYS the stream,
                    so leaving early cleans up.

    versus
      stream.on("data",  ...)
      stream.on("end",   ...)
      stream.on("error", ...)


    caveat: it is for consuming at the END of a chain.
    transforming on the way somewhere else? use pipeline
    with an async generator, so backpressure reaches
    the destination.


stream/consumers loads EVERYTHING

    text(stream)         →  string
    json(stream)         →  parsed object
    buffer(stream)       →  Buffer
    arrayBuffer(stream)  →  ArrayBuffer

    memory grows with the input. that is the whole
    trade-off, and it is sometimes the right one.


Why there is no streaming JSON.parse

    JSON.parse needs the closing brace before it can
    return anything at all.

    { "users": [ {...}, {...}, {...}    ← still nothing
                                     ]
    }                                   ← now it can parse

    huge JSON needs a line-delimited format (NDJSON)
    or a dedicated streaming parser.


The actual decision

    "Is the size bounded AND small?"
                │
        ┌───────┴───────┐
       YES             NO
        │               │
    consumers       pipeline
        │               │
    webhook body,   user upload,
    config file,    a file of unknown
    JSON response   size, a database
    with a limit    export

    the read-it-all habit turns into an outage
    exactly at that boundary`,
      codeExample: {
        title: "Iterate it, or consume it",
        code: `import fs from "node:fs";
import { text, json, buffer } from "node:stream/consumers";
import { pipeline } from "node:stream/promises";

// ── for await: backpressure and errors for free ─────────────
let bytes = 0;
for await (const chunk of fs.createReadStream("package.json")) {
  bytes += chunk.length;
}
console.log("read", bytes, "bytes");

// errors land in catch
try {
  for await (const chunk of fs.createReadStream("missing.txt")) {
    console.log(chunk.length);
  }
} catch (error) {
  console.log("caught:", error.code);          // ENOENT
}

// break destroys the stream, so leaving early cleans up
const early = fs.createReadStream("package.json");
for await (const chunk of early) {
  console.log("first chunk:", chunk.length, "bytes");
  break;
}
console.log("destroyed on break?", early.destroyed);   // true


// ── stream/consumers: the whole thing, in memory ────────────
console.log((await text(fs.createReadStream("package.json"))).length);
//   also decodes multi-byte characters correctly, which
//   collecting chunks and calling toString() yourself does
//   not. Day 7's boundary bug, avoided for free.

const pkg = await json(fs.createReadStream("package.json"));
console.log(pkg.name);

const bin = await buffer(fs.createReadStream("package.json"));
console.log(bin.length, bin.constructor.name);   // Buffer


// ── Where the habit becomes an outage ───────────────────────
// ✓ bounded and small
// app.post("/webhook", async (req, res) => {
//   const body = await json(req);              // with a size limit
//   res.end();
// });
//
// ✗ unbounded
// app.post("/upload", async (req, res) => {
//   const data = await buffer(req);            // a 4GB upload
//   await writeFile("out.bin", data);          // is now 4GB of RAM
// });
//
// ✓ the streaming version
// app.post("/upload", async (req, res) => {
//   await pipeline(req, fs.createWriteStream("out.bin"));
//   res.end();
// });


// ── Why huge JSON cannot stream ─────────────────────────────
// JSON.parse needs the closing brace before it returns
// anything, so there is no streaming parser in the standard
// library. For large datasets use NDJSON:
//
// for await (const line of readLines(stream)) {
//   const record = JSON.parse(line);      // one object per line
// }`,
      },
      keyTakeaways: [
        "Streams are async iterables, so `for await (const chunk of stream)` works.",
        "It gives you <b>backpressure for free</b>, because the loop body blocks the iteration.",
        "Errors land in `catch`, with no `'error'` listener needed.",
        "`break` or `return` <b>destroys the stream</b>, so leaving early cleans up.",
        "Use it to consume at the end of a chain. To transform on the way somewhere, use `pipeline` with a generator stage.",
        "`stream/consumers` gives `text()`, `json()`, `buffer()` and `arrayBuffer()`.",
        "All four load the <b>entire stream into memory</b>.",
        "`text()` decodes multi-byte characters correctly, which collecting chunks yourself does not.",
        "There is no streaming `JSON.parse`, because it needs the closing brace before it can return anything.",
        "Huge JSON needs a line-delimited format like NDJSON, or a dedicated parser.",
        "The decision: <b>is the size bounded and small?</b> Consumers if yes, `pipeline` if no.",
      ],
      commonMistakes: [
        "<b>`await buffer(req)` on a file upload</b> — a 4GB upload becomes 4GB of memory.",
        "<b>Collecting chunks and calling `toString()`</b> — you reintroduce Day 7's boundary bug. `text()` handles it.",
        "<b>Expecting `json()` to stream</b> — it cannot. `JSON.parse` needs the whole document.",
        "<b>Using `for await` mid-chain</b> — you break the backpressure link to the destination. Use a generator stage.",
        "<b>Adding an `'error'` handler alongside `for await`</b> — the loop already surfaces it in `catch`.",
        "<b>Assuming consumers are always the wrong choice</b> — for a bounded, small body they are simpler and correct.",
      ],
      quiz: [
        {
          question: "Why does `for await` handle backpressure while a `'data'` handler does not?",
          options: [
            "It uses a smaller buffer",
            "The loop body blocks the iteration, so the stream is not asked for more until you are done",
            "It reads in paused mode",
            "It buffers everything first",
          ],
          correctIndex: 1,
          explanation:
            "An EventEmitter cannot wait for your callback. The async iterator protocol does, which is what makes the loop safe by default.",
        },
        {
          question: "Why is there no streaming version of `JSON.parse`?",
          options: [
            "Nobody has implemented one",
            "It needs the closing brace before it can return anything, so a partial document yields nothing",
            "JSON is a binary format",
            "It would be too slow",
          ],
          correctIndex: 1,
          explanation:
            "That is why large datasets use NDJSON, one object per line, so each line can be parsed the moment it arrives.",
        },
        {
          question: "You `break` out of a `for await` loop over a file stream. What happens to the stream?",
          options: [
            "It keeps reading in the background",
            "It is destroyed, so the file descriptor is released",
            "It pauses indefinitely",
            "It throws",
          ],
          correctIndex: 1,
          explanation:
            "Early exit cleans up, which is one more thing the event-based version leaves to you.",
        },
      ],
    },
    {
      id: "custom-streams",
      title: "Writing your own streams",
      durationMinutes: 12,
      explanation:
        "## Custom Readable\n\n```javascript\nimport { Readable } from \"node:stream\";\n```\n\n```javascript\nconst numbers = new Readable({\n  read() {\n    this.push(\"1\\n\");\n    this.push(\"2\\n\");\n    this.push(\"3\\n\");\n    this.push(null);\n  }\n});\n```\n\n`null` means:\n\n```text\nNo more data\n```\n\n---\n\n## `push()`\n\n<b>`push()`</b> (adds data to a Readable).\n\n```javascript\nthis.push(\"hello\");\n```\n\nand:\n\n```javascript\nthis.push(null);\n```\n\nmeans:\n\n```text\nStream finished\n```\n\nOne detail: `push()` returns a boolean, and `read()` is called again when the consumer wants more. Pushing everything in one `read()` works for a small fixed set, but for a real source you should push until `push()` returns `false` and then stop. Ignoring that is how a custom Readable ends up buffering its entire source in memory, which defeats the point.\n\n---\n\n## Custom Writable\n\n```javascript\nimport { Writable } from \"node:stream\";\n\nconst output = new Writable({\n  write(chunk, encoding, callback) {\n    console.log(chunk.toString());\n\n    callback();\n  }\n});\n```\n\n<b>`write()`</b> (receives chunks).\n\nYou must eventually call:\n\n```javascript\ncallback();\n```\n\nor:\n\n```javascript\ncallback(error);\n```\n\n<b>That callback is the backpressure mechanism.</b> Node does not call `write` again until you call it, so a slow consumer slows the whole pipeline down automatically. Forget to call it and the stream stalls forever with no error, which is the most confusing way a pipeline can fail.\n\nCall it twice and you get `ERR_MULTIPLE_CALLBACK`. The usual cause is calling it in both a `try` and a `catch`.\n\n---\n\n## Custom Transform\n\n```javascript\nimport { Transform } from \"node:stream\";\n\nconst upperCase = new Transform({\n  transform(chunk, encoding, callback) {\n    const result =\n      chunk.toString().toUpperCase();\n\n    callback(null, result);\n  }\n});\n```\n\n```text\nhello\n ↓\nTransform\n ↓\nHELLO\n```\n\n`callback(null, result)` is shorthand for `this.push(result)` then `callback()`. Use `push` directly when one chunk produces several outputs, which is what line splitting needs.\n\nAnd the piece most people miss: <b>`flush`</b>. It runs once when the input ends, and it is where you emit anything you were holding. A line-splitting transform keeps a partial last line in a `leftover` variable, and without `flush` that final line is silently dropped. Same shape as Day 7's `decoder.end()`.\n\n---\n\n## Object mode\n\nNormally streams handle:\n\n```text\nbytes\nBuffers\nstrings\n```\n\nSometimes you want objects.\n\n> <b>Object mode</b> (chunks can be arbitrary JavaScript values instead of only bytes or strings).\n\n```javascript\nconst stream = new Transform({\n  objectMode: true,\n\n  transform(user, encoding, callback) {\n    user.active = true;\n\n    callback(null, user);\n  }\n});\n```\n\nNow a chunk can be:\n\n```javascript\n{\n  id: 1,\n  name: \"Rajan\"\n}\n```\n\ninstead of a Buffer.\n\nOne thing that changes with it: `highWaterMark` switches from <b>bytes to a count of objects</b>, and the default drops to 16. That is usually what you want, since Node cannot know how big your objects are, but it means a pipeline of 16 huge objects can use far more memory than a byte stream's 64KB buffer.\n\nAlso, in object mode `null` still means end-of-stream, so you cannot push a `null` value through. Use a sentinel if you need one.\n\n---\n\n## Object mode is still not unlimited\n\n```text\nAnything\n ↓\nInfinite memory\n```\n\nNo. Backpressure still applies.\n\n```text\nProducer\n ↓\n100,000 objects/sec\n\nConsumer\n ↓\n1,000 objects/sec\n```\n\nYou can still create a memory problem.\n\n---\n\n## Or skip the classes\n\nFor most transforms, an async generator in a `pipeline` is shorter and clearer than a `Transform` subclass. No `callback` to remember, no `flush` to forget, and errors propagate normally. Reach for the class when you need the lifecycle hooks or object mode with a specific watermark.",
      diagram: `The callback IS the backpressure

    write(chunk, encoding, callback) {
      ...
      callback()        ← Node does not call write again
    }                     until you do

    so a slow consumer slows the pipeline automatically

    forget it       the stream stalls FOREVER, no error
                    the most confusing failure there is
    call it twice   ERR_MULTIPLE_CALLBACK
                    usually from a try AND a catch


flush is the piece everyone misses

    a line-splitting transform:

      transform()   leftover + chunk → split → push lines
                    keep the partial LAST line in leftover
      flush()       push the leftover              ← or it is
                                                      silently
                                                      DROPPED

    same shape as Day 7's decoder.end()


Object mode changes the watermark units

    byte stream     highWaterMark = 64KB     of bytes
    object mode     highWaterMark = 16       of OBJECTS

    Node cannot know how big your objects are, so it
    counts them instead.

    16 huge objects can use far more memory than a
    byte stream's 64KB buffer.

    and null still means end-of-stream, so you cannot
    push a null value. use a sentinel.


push() returns a boolean too

    read() {
      while (this.push(next())) { }    push until false
    }                                  then stop

    pushing your whole source in one read() buffers all
    of it in memory, which defeats the point


Or write no class at all

    pipeline(input, async function* (src) {
      for await (const chunk of src) yield f(chunk)
    }, output)

    no callback to forget, no flush to miss, errors
    propagate normally.

    use the class when you need lifecycle hooks or a
    specific object-mode watermark.`,
      codeExample: {
        title: "A line splitter, and the flush that makes it correct",
        code: `import { Readable, Writable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

// ── Custom Readable ─────────────────────────────────────────
const numbers = new Readable({
  read() {
    this.push("1\\n");
    this.push("2\\n");
    this.push("3\\n");
    this.push(null);                  // no more data
  },
});
//
// Fine for a small fixed set. For a real source, push until
// push() returns false and then stop, or you buffer the
// whole thing in memory.


// ── Custom Writable: the callback is the backpressure ───────
const collected = [];
const sink = new Writable({
  objectMode: true,
  write(chunk, _encoding, callback) {
    collected.push(chunk);
    callback();                       // ← Node waits for this
  },
});
//
// Forget it and the stream stalls forever with no error.
// Call it twice and you get ERR_MULTIPLE_CALLBACK.


// ── A line splitter: transform + flush ──────────────────────
function splitLines() {
  let leftover = "";

  return new Transform({
    readableObjectMode: true,

    transform(chunk, _encoding, callback) {
      const lines = (leftover + chunk).split("\\n");
      leftover = lines.pop();         // keep the partial last line

      for (const line of lines) this.push(line);
      callback();
    },

    flush(callback) {
      if (leftover) this.push(leftover);   // ← without this the
      callback();                          //   last line is
    },                                     //   silently dropped
  });
}

await pipeline(Readable.from(["a\\nb\\nc", "d\\ne"]), splitLines(), sink);
console.log(collected);               // [ 'a', 'b', 'cd', 'e' ]
//
// Note 'cd': the chunk boundary fell mid-line and the
// leftover joined it back up. And 'e' only appears because
// of flush.


// ── Object mode: the watermark counts objects ───────────────
const activate = new Transform({
  objectMode: true,
  transform(user, _encoding, callback) {
    callback(null, { ...user, active: true });
  },
});

console.log(activate.writableHighWaterMark);   // 16, not 65536
//
// Node cannot know how big your objects are, so it counts
// them. 16 huge objects can use far more than 64KB.

const users = [];
await pipeline(
  Readable.from([{ id: 1, name: "Rajan" }, { id: 2, name: "Sita" }]),
  activate,
  new Writable({
    objectMode: true,
    write(u, _e, cb) { users.push(u); cb(); },
  }),
);
console.log(users);
// [ { id: 1, name: 'Rajan', active: true },
//   { id: 2, name: 'Sita', active: true } ]


// ── The same transform, without the class ───────────────────
const out = [];
await pipeline(
  Readable.from([{ id: 3 }]),
  async function* (source) {
    for await (const user of source) yield { ...user, active: true };
  },
  new Writable({ objectMode: true, write(u, _e, cb) { out.push(u); cb(); } }),
);
console.log(out);                     // [ { id: 3, active: true } ]
//
// No callback to forget, no flush to miss.`,
      },
      keyTakeaways: [
        "A custom `Readable` implements `read()` and calls `this.push(data)`, then `this.push(null)` to end.",
        "`push()` returns a boolean. Push until it returns `false`, or you buffer your whole source.",
        "A custom `Writable` implements `write(chunk, encoding, callback)`.",
        "<b>That callback is the backpressure mechanism</b>: Node does not call `write` again until you call it.",
        "Forget the callback and the stream <b>stalls forever with no error</b>. Call it twice and you get `ERR_MULTIPLE_CALLBACK`.",
        "A `Transform` implements `transform`, and `callback(null, result)` is shorthand for push-then-callback.",
        "<b>`flush` is the piece people miss.</b> It runs when the input ends and emits whatever you were holding.",
        "Without `flush`, a line splitter silently drops the final partial line. Same shape as Day 7's `decoder.end()`.",
        "<b>Object mode</b> lets chunks be arbitrary values, and switches `highWaterMark` from bytes to a count of 16 objects.",
        "So 16 large objects can use far more memory than a byte stream's 64KB buffer.",
        "`null` still means end-of-stream in object mode, so you cannot push a `null` value.",
        "For most transforms, an async generator stage is shorter and has fewer things to forget.",
      ],
      commonMistakes: [
        "<b>Forgetting to call the `write` callback</b> — the pipeline stalls silently, which is the hardest failure to diagnose.",
        "<b>Calling the callback twice</b> — `ERR_MULTIPLE_CALLBACK`, usually from a `try` and a `catch` both calling it.",
        "<b>Omitting `flush`</b> — anything held between chunks, like a partial last line, disappears without a word.",
        "<b>Pushing your entire source in one `read()`</b> — you buffer everything and lose the point of streaming.",
        "<b>Assuming object mode removes backpressure</b> — it just counts objects instead of bytes.",
        "<b>Trying to push a `null` value in object mode</b> — that ends the stream.",
        "<b>Writing a `Transform` class for a one-line mapping</b> — an async generator stage does it with less to get wrong.",
      ],
      quiz: [
        {
          question: "You forget to call `callback()` in a custom Writable's `write`. What happens?",
          options: [
            "An error is thrown",
            "The stream stalls forever with no error at all",
            "Node calls `write` again anyway",
            "The chunk is dropped and processing continues",
          ],
          correctIndex: 1,
          explanation:
            "The callback is how you signal readiness for the next chunk, so nothing happens and nothing complains. It is the hardest stream failure to diagnose.",
        },
        {
          question: "Why does a line-splitting Transform need `flush`?",
          options: [
            "To free memory",
            "The final partial line is held in a leftover variable and would otherwise be silently dropped",
            "To close the destination",
            "To reset the encoding",
          ],
          correctIndex: 1,
          explanation:
            "`transform` can only emit complete lines, so the last fragment waits for more input that never comes. `flush` runs when the input ends, which is the same role as Day 7's `decoder.end()`.",
        },
        {
          question: "What does `objectMode: true` change about `highWaterMark`?",
          options: [
            "Nothing",
            "It switches from a byte count to a count of objects, defaulting to 16",
            "It removes the limit",
            "It doubles the default",
          ],
          correctIndex: 1,
          explanation:
            "Node cannot know how large your objects are, so it counts them. That means 16 big objects can hold far more memory than a byte stream's 64KB buffer.",
        },
      ],
    },
    {
      id: "errors-and-web-streams",
      title: "Errors, cleanup and Web Streams",
      durationMinutes: 10,
      explanation:
        "## Stream errors must be handled\n\nStreams fail:\n\n```text\nFile doesn't exist\nDisk becomes unavailable\nNetwork connection closes\nTransform throws\nDestination fails\n```\n\nWith `pipeline()`:\n\n```javascript\ntry {\n  await pipeline(\n    input,\n    transform,\n    output\n  );\n} catch (error) {\n  console.error(\"Pipeline failed:\", error);\n}\n```\n\nOne reason `pipeline()` is so useful.\n\n---\n\n## Cleanup\n\nWhen a pipeline fails you do not want half your streams left open. A good implementation should:\n\n```text\nStop\nDestroy\nClose\nCleanup\n```\n\n`pipeline()` coordinates this.\n\n> <b>Streams are resources. Errors must clean up the whole pipeline.</b>\n\nThat word <b>resources</b> is exact: each stream holds a file descriptor or a socket. Day 6's `EMFILE` is what a leak looks like a few thousand requests later, and sockets share the same pool, so the symptom is a server that stops accepting connections.\n\nOne extra case worth knowing, because it is the most common one in a real server. A client disconnecting mid-download is not an error in your code, it is `EPIPE` or `ERR_STREAM_PREMATURE_CLOSE` on the destination. `pipeline` surfaces it and tears down the file read for you. Without that, a user who closes a tab leaves you reading a large file to nowhere.\n\nSo an aborted download is expected traffic, not a bug. Log it at debug, not error, or your logs fill with something entirely normal.\n\n---\n\n## Web Streams\n\nNode also supports the Web Streams API:\n\n```text\nReadableStream\nWritableStream\nTransformStream\n```\n\nCommon in:\n\n```text\nBrowsers\nWeb APIs\nModern JavaScript\n```\n\nNode supports them too.\n\n---\n\n## Node streams vs Web Streams\n\n```text\nNode.js streams\n       ↓\nReadable\nWritable\nTransform\n```\n\nand:\n\n```text\nWeb Streams\n       ↓\nReadableStream\nWritableStream\nTransformStream\n```\n\nDifferent APIs, with interoperability:\n\n```text\nNode Stream\n    ↕\nAdapter\n    ↕\nWeb Stream\n```\n\nThis matters when combining Node APIs with modern Web APIs.\n\n---\n\n## Converting\n\n```javascript\nReadable.toWeb(nodeStream);\n```\n\n```text\nNode Readable\n     ↓\nReadable.toWeb()\n     ↓\nWeb ReadableStream\n```\n\nand back:\n\n```javascript\nReadable.fromWeb(webStream);\n```\n\n```text\nWeb ReadableStream\n       ↓\nReadable.fromWeb()\n       ↓\nNode Readable\n```\n\nWhere this actually comes up: `fetch()`. A `fetch` response body is a <b>Web</b> `ReadableStream`, so streaming a download to disk needs the adapter:\n\n```javascript\nconst response = await fetch(url);\n\nawait pipeline(\n  Readable.fromWeb(response.body),\n  createWriteStream(\"out.bin\"),\n);\n```\n\nThat is the single most common reason to know these exist. Without it, the obvious move is `await response.arrayBuffer()`, which puts the whole download in memory.\n\n---\n\n## `Readable.from()`\n\n<b>`Readable.from()`</b> (creates a Readable from an iterable or async iterable).\n\n```javascript\nconst stream = Readable.from([\n  \"one\",\n  \"two\",\n  \"three\"\n]);\n```\n\nOr an async generator:\n\n```javascript\nasync function* users() {\n  yield { id: 1 };\n  yield { id: 2 };\n  yield { id: 3 };\n}\n\nconst stream = Readable.from(users());\n```\n\nExtremely useful, and note it turns on object mode automatically. It is also the easiest way to test a pipeline: no temporary files, just `Readable.from([...])` as the source.\n\n---\n\n## Streams vs generators vs async iterators\n\nRelated, not identical.\n\nA <b>Generator</b> (a function producing values one at a time with `yield`).\n\n```javascript\nfunction* numbers() {\n  yield 1;\n  yield 2;\n  yield 3;\n}\n```\n\nAn <b>Async generator</b> (a generator producing values asynchronously).\n\n```javascript\nasync function* numbers() {\n  yield 1;\n  yield 2;\n  yield 3;\n}\n```\n\nAn <b>Async iterator</b> (an object producing values asynchronously via `next()`), consumed with:\n\n```javascript\nfor await (const value of iterable) {\n  console.log(value);\n}\n```\n\nA <b>Stream</b> (an abstraction for incremental processing with flow control and piping).\n\nThe difference:\n\n```text\nGenerator\n    ↓\nProduces values\n\nAsync iterator\n    ↓\nAsync sequence\n\nStream\n    ↓\nData processing + backpressure + piping\n```\n\nThe useful way to hold it: a generator is <b>pull-only</b>, and a stream adds <b>a destination, buffering, error propagation and cleanup</b>. Which is why `pipeline` accepts a generator as a stage: you write the pull-only part and it supplies everything else.\n\n---\n\n## `pipeline()` as your default\n\nWhen you see:\n\n```text\nReadable\n ↓\nTransform\n ↓\nTransform\n ↓\nWritable\n```\n\nthink:\n\n```javascript\nawait pipeline(\n  readable,\n  transform1,\n  transform2,\n  writable\n);\n```\n\nnot:\n\n```javascript\nreadable\n  .pipe(transform1)\n  .pipe(transform2)\n  .pipe(writable);\n```\n\n`pipe()` is not useless. But for production, `pipeline()` gives you a much stronger error and cleanup model.",
      diagram: `Streams are resources, and leaks compound

    each stream holds a file descriptor or a socket
        ↓
    a failed pipe() leaves the others open
        ↓
    EMFILE, a few thousand requests later
        ↓
    sockets share the pool, so the symptom is
    "the server stopped accepting connections"


The most common failure in a real server

    client closes the tab mid-download
        ↓
    EPIPE / ERR_STREAM_PREMATURE_CLOSE on the destination
        ↓
    pipeline surfaces it AND tears down the file read
        ↓
    without that: you keep reading a large file to nowhere

    this is expected traffic, not a bug.
    log it at debug, or your logs fill with normal.


Node streams and Web Streams

    Readable   ◄── Readable.fromWeb ──   ReadableStream
               ──  Readable.toWeb   ─►

    where it actually comes up: fetch()

    const response = await fetch(url)
    response.body        ← a WEB ReadableStream

    await pipeline(
      Readable.fromWeb(response.body),
      createWriteStream("out.bin"),
    )

    without the adapter the obvious move is
    await response.arrayBuffer(), which puts the
    whole download in memory


Generator vs stream, precisely

    generator      pull-only. you ask, it yields.
    stream         + a destination
                   + buffering and a watermark
                   + backpressure
                   + error propagation
                   + cleanup

    which is why pipeline accepts a generator as a stage:
    you write the pull-only part, it supplies the rest.`,
      codeExample: {
        title: "Cleanup, and crossing between the two APIs",
        code: `import fs from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

// ── Errors and cleanup together ─────────────────────────────
try {
  await pipeline(
    fs.createReadStream("missing.txt"),
    fs.createWriteStream("out.txt"),
  );
} catch (error) {
  console.log("pipeline failed:", error.code);      // ENOENT
}
//   and the write stream was destroyed for you


// ── The common one: the client hangs up ─────────────────────
// app.get("/download", async (req, res) => {
//   try {
//     await pipeline(fs.createReadStream("big.zip"), res);
//   } catch (error) {
//     if (error.code === "ERR_STREAM_PREMATURE_CLOSE" ||
//         error.code === "EPIPE") {
//       logger.debug("client disconnected");     // expected traffic
//       return;
//     }
//     throw error;
//   }
// });
//
// pipeline also tore down the file read, so you are not
// reading a large file to nobody. Log this at debug or your
// logs fill with something entirely normal.


// ── Readable.from: the easiest test source ──────────────────
const fromArray = Readable.from(["one", "two", "three"]);
for await (const value of fromArray) console.log(value);

async function* users() {
  yield { id: 1 };
  yield { id: 2 };
}
const fromGenerator = Readable.from(users());
console.log(fromGenerator.readableObjectMode);      // true, automatically
//
// No temp files needed to test a pipeline.


// ── Crossing to Web Streams: the fetch case ─────────────────
// const response = await fetch("https://example.com/big.bin");
// console.log(response.body.constructor.name);     // ReadableStream
//
// ✗ the obvious move, and it holds the whole download
// const all = await response.arrayBuffer();
// await writeFile("out.bin", Buffer.from(all));
//
// ✓ streamed to disk
// await pipeline(
//   Readable.fromWeb(response.body),
//   fs.createWriteStream("out.bin"),
// );
//
// This is the single most common reason to know the
// adapters exist.


// ── And the other direction ─────────────────────────────────
const webStream = Readable.toWeb(Readable.from(["a", "b"]));
console.log(webStream.constructor.name);            // ReadableStream

const reader = webStream.getReader();
console.log(await reader.read());                   // { value: 'a', done: false }
await reader.cancel();


// ── The default to reach for ────────────────────────────────
// ✗ readable.pipe(t1).pipe(t2).pipe(writable)
// ✓ await pipeline(readable, t1, t2, writable)

fs.rmSync("out.txt", { force: true });`,
      },
      keyTakeaways: [
        "Streams are <b>resources</b>: each holds a file descriptor or a socket.",
        "A failed `pipe()` leaves the others open, and Day 6's `EMFILE` follows a few thousand requests later.",
        "Sockets share that pool, so the symptom is a server that stops accepting connections.",
        "A client disconnecting mid-download gives `EPIPE` or `ERR_STREAM_PREMATURE_CLOSE`.",
        "`pipeline` surfaces it and tears down the file read, so you are not reading to nobody.",
        "That is <b>expected traffic, not a bug</b>. Log it at debug or your logs fill with normal behaviour.",
        "Web Streams are a different API: `ReadableStream`, `WritableStream`, `TransformStream`.",
        "`Readable.fromWeb()` and `Readable.toWeb()` convert between them.",
        "The main reason to care: <b>a `fetch` response body is a Web stream</b>, so streaming a download needs the adapter.",
        "Without it the obvious move is `arrayBuffer()`, which holds the entire download in memory.",
        "`Readable.from()` builds a stream from an iterable, turns on object mode, and is the easiest way to test a pipeline.",
        "A generator is <b>pull-only</b>. A stream adds a destination, buffering, backpressure, error propagation and cleanup.",
      ],
      commonMistakes: [
        "<b>Not handling errors on a stream chain</b> — with `pipe()` that means an unhandled `'error'` event and a dead process.",
        "<b>Logging a client disconnect as an error</b> — aborted downloads are normal traffic.",
        "<b>`await response.arrayBuffer()` on a large download</b> — the whole thing goes into memory. Use `Readable.fromWeb`.",
        "<b>Piping a `fetch` body directly into a Node stream</b> — different APIs. Convert first.",
        "<b>Creating temp files to test a pipeline</b> — `Readable.from([...])` is the source you want.",
        "<b>Treating a generator as interchangeable with a stream</b> — it has no destination, buffering, or cleanup.",
      ],
      quiz: [
        {
          question: "A user closes their browser tab mid-download. What should your handler do?",
          options: [
            "Log an error and alert",
            "Recognise `EPIPE` or `ERR_STREAM_PREMATURE_CLOSE` as expected, log at debug, and return",
            "Retry the download",
            "Nothing, it cannot be detected",
          ],
          correctIndex: 1,
          explanation:
            "Aborted downloads are ordinary traffic. `pipeline` also tears down the file read for you, so you are not left reading a large file to nobody.",
        },
        {
          question: "You want to stream a `fetch` download straight to disk. What do you need?",
          options: [
            "Nothing, pipe the body directly",
            "`Readable.fromWeb(response.body)`, because a fetch body is a Web ReadableStream",
            "`response.arrayBuffer()` first",
            "`Readable.toWeb` on the write stream",
          ],
          correctIndex: 1,
          explanation:
            "The two APIs are different. Without the adapter the obvious move is `arrayBuffer()`, which defeats the point by holding the whole download in memory.",
        },
        {
          question: "What does a stream add over an async generator?",
          options: [
            "Nothing, they are equivalent",
            "A destination, buffering with a watermark, backpressure, error propagation and cleanup",
            "The ability to yield values",
            "Synchronous iteration",
          ],
          correctIndex: 1,
          explanation:
            "A generator is pull-only. That division is exactly why `pipeline` accepts a generator as a stage: you write the pull-only part and it supplies the rest.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "You `readFile` an 88MB CSV, stringify it and split it into lines. Peak memory?",
      options: ["About 88MB", "About 350MB, roughly 4x the file", "About 120MB", "Unchanged"],
      correctIndex: 1,
      explanation:
        "Three copies: the Buffer, the string, and the array of split lines. Measured at 354MB from a 45MB baseline, against 118MB for the streamed version.",
    },
    {
      question: "Beyond memory, what is the stronger argument for streaming a response?",
      options: [
        "Better compression",
        "The first bytes reach the user immediately rather than after the whole file is read",
        "Fewer file descriptors",
        "It avoids the event loop",
      ],
      correctIndex: 1,
      explanation:
        "Same total work, completely different experience. It is why video plays before it has finished downloading.",
    },
    {
      question: "What does `writable.write()` returning `false` mean?",
      options: [
        "The write failed",
        "The buffer is over its highWaterMark: stop and wait for `'drain'`",
        "The stream is closed",
        "The chunk was rejected",
      ],
      correctIndex: 1,
      explanation:
        "Ignoring that boolean is exactly how backpressure gets switched off, and it looks fine until the file is large enough to fill the buffer.",
    },
    {
      question: "A transform in a `pipe()` chain errors, with no `'error'` handlers attached. What happens?",
      options: [
        "The chain stops quietly",
        "An unhandled `'error'` event crashes the process",
        "The destination's callback receives it",
        "The chunk is skipped",
      ],
      correctIndex: 1,
      explanation:
        "`pipe()` does not forward errors, and an emitter with no listener throws. That is a much stronger reason to use `pipeline` than \"it handles errors\".",
    },
    {
      question: "Why does `for await` honour backpressure while a `'data'` handler does not?",
      options: [
        "It uses a smaller buffer",
        "The loop body blocks the iteration, so the stream is not asked for more until you finish",
        "It reads in paused mode",
        "It buffers first",
      ],
      correctIndex: 1,
      explanation:
        "An EventEmitter cannot wait for your callback. The async iterator protocol does, which is what makes the loop safe by default.",
    },
    {
      question: "Why is there no streaming `JSON.parse`?",
      options: [
        "Nobody built one",
        "It needs the closing brace before it can return anything",
        "JSON is binary",
        "It would be too slow",
      ],
      correctIndex: 1,
      explanation:
        "Which is why large datasets use NDJSON: one object per line, so each line parses as it arrives.",
    },
    {
      question: "You forget to call `callback()` in a custom Writable's `write`. What happens?",
      options: [
        "An error is thrown",
        "The pipeline stalls forever, with no error",
        "Node calls `write` again anyway",
        "The chunk is dropped",
      ],
      correctIndex: 1,
      explanation:
        "The callback is how you signal readiness for the next chunk. Nothing happens and nothing complains, which makes it the hardest stream failure to diagnose.",
    },
    {
      question: "Why does a line-splitting Transform need `flush`?",
      options: [
        "To free memory",
        "The final partial line is held between chunks and would otherwise be silently dropped",
        "To close the destination",
        "To reset encoding",
      ],
      correctIndex: 1,
      explanation:
        "`transform` can only emit complete lines, so the last fragment waits for input that never comes. Same role as Day 7's `decoder.end()`.",
    },
    {
      question: "You want to stream a `fetch` download to disk. What is needed?",
      options: [
        "Pipe `response.body` directly",
        "`Readable.fromWeb(response.body)`, since a fetch body is a Web ReadableStream",
        "`response.text()` first",
        "Nothing special",
      ],
      correctIndex: 1,
      explanation:
        "The two stream APIs are different. Without the adapter the obvious move is `arrayBuffer()`, which holds the entire download in memory.",
    },
  ],
  project: {
    name: "day-08",
    goal: "Stream a very large CSV through a filter and prove, with measurements, that memory does not track the input size.",
    brief:
      "The point is the proof, not the filter. Anyone can write a Transform. What this exercise gives you is the number: run the same job with readFile and with a stream, and watch peak RSS differ by several times. Expect the readFile version to peak around four times the file size, because you end up holding the Buffer, the string and the array of lines all at once. The genuinely tricky part is that a chunk does not contain whole lines, so you need a leftover between chunks and a flush at the end, exactly like Day 7's StringDecoder.",
    steps: [
      "Create `day-08/` with `package.json` containing `\"type\": \"module\"`, and an `index.js`.",
      "Generate a large `users.csv` with a header `id,name,country,active` and a few million rows, half of them `active=true`.",
      "First write the naive version: `readFile`, `toString()`, `split(\"\\n\")`, filter, join, write. Record peak RSS.",
      "Now write the streaming version with `createReadStream`, a `Transform`, and `createWriteStream`, joined by `pipeline` from `node:stream/promises`.",
      "In the transform, prepend a `leftover` string to each chunk, split on newline, and `pop()` the last element back into `leftover` because it is probably incomplete.",
      "Add a `flush` that emits the final `leftover`, or you will silently lose the last row.",
      "Sample `process.memoryUsage().rss` on an interval to capture the peak, since a single reading after the fact will miss it.",
      "Print initial, peak and final RSS for both versions and compare them.",
    ],
    acceptance: [
      "The streaming version produces the same output as the naive one, byte for byte, including the header row.",
      "Peak RSS for the streaming version is a small multiple of the baseline, nowhere near the input file size.",
      "Peak RSS for the `readFile` version is noticeably larger, and you can say why it is roughly 4x the file rather than 1x.",
      "Rows are counted correctly: processed, kept and rejected, with kept plus rejected equal to processed.",
      "The last row of the file appears in the output, which proves `flush` is doing its job.",
      "A row split across a chunk boundary is reassembled rather than dropped or truncated.",
      "The peak is captured by sampling on an interval, not by reading `memoryUsage()` once at the end.",
      "A missing input file gives a caught error from `pipeline`, not an unhandled `'error'` event.",
    ],
    stretch: [
      "Add a second transform that uppercases the name column, so the pipeline has two stages.",
      "Print processing time with `performance.now()` and rows per second.",
      "Replace the `Transform` class with an async generator stage and confirm the output is identical.",
      "Try the naive version on a file large enough to exhaust the heap, and note that you get a crash rather than slow behaviour.",
      "Add `createGzip()` before the write stream so the output is compressed, and confirm memory does not change.",
      "Deliberately break it: use `input.on(\"data\", c => output.write(c))` instead of `pipeline`, and watch `output.writableLength` climb as backpressure is ignored.",
    ],
  },
};
