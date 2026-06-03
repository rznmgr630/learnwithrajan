import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_24_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Node.js has a rich set of core modules for working with the filesystem, network, processes, and binary data. Streams let you process data in chunks without loading it all into memory. `Buffer` handles raw binary data. Child processes and Worker Threads let you run code in separate processes or threads — essential for CPU-intensive tasks and shell command execution.",
      np: "Node.js सँग filesystem, network, processes, र binary data सँग काम गर्ने rich core modules छन्। Streams ले data को सबैकुरा memory मा नलोडी chunks मा process गर्दछ। `Buffer` ले raw binary data handle गर्छ। Child processes र Worker Threads ले CPU-intensive tasks र shell commands का लागि separate processes/threads मा code run गर्दछ।",
      jp: "Node.jsにはファイルシステム・ネットワーク・プロセス・バイナリデータ用の豊富なコアモジュールがある。Streamsはデータを全てメモリに読み込まずチャンクで処理。`Buffer`は生のバイナリデータを扱う。Child processesとWorker Threadsは分離したプロセス/スレッドでコードを実行。",
    },
  ],
  sections: [
    {
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "zBhM7oBuXik", title: "Node.js Streams — Everything You Need to Know" },
      ],
    },
    {
      title: { en: "Streams — the four types", np: "Streams — चार types", jp: "Streams — 4種類" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A stream is an abstract interface for working with data that flows over time — you process it in chunks rather than waiting for it all. Node.js has four stream types: **Readable** (you read from it), **Writable** (you write to it), **Duplex** (both read and write, like a TCP socket), and **Transform** (reads in, modifies, writes out, like a gzip compressor).",
            np: "Stream एउटा abstract interface हो time over data process गर्न — सबै आउनको प्रतीक्षा नगरी chunks मा process गर्नुहुन्छ। Node.js मा चार stream types छन्: **Readable**, **Writable**, **Duplex** (read + write), र **Transform** (modify गर्दै पास गर्छ)।",
            jp: "ストリームは時間をかけてデータを流れるように処理するための抽象インターフェース。全て揃うのを待たずチャンクで処理。**Readable**・**Writable**・**Duplex**（TCP等）・**Transform**（圧縮等）の4種類。",
          },
        },
        {
          type: "code",
          title: { en: "Reading, writing, and piping streams", np: "Streams read, write, र pipe गर्नु", jp: "ストリームの読み書きとパイプ" },
          code: `const fs   = require("fs");
const zlib = require("zlib");
const { pipeline, Transform } = require("stream");
const { promisify } = require("util");
const pipelineAsync = promisify(pipeline);

// ── Readable stream — read a large file in chunks ─────────────────
const readable = fs.createReadStream("large-file.csv", {
  encoding: "utf8",
  highWaterMark: 64 * 1024,  // 64KB chunks (default 16KB)
});

readable.on("data", (chunk) => console.log("Got chunk:", chunk.length, "bytes"));
readable.on("end",  ()      => console.log("Done reading"));
readable.on("error",(err)   => console.error("Error:", err));

// ── Writable stream — write to a file in chunks ───────────────────
const writable = fs.createWriteStream("output.txt");
writable.write("Hello\n");
writable.write("World\n");
writable.end();  // signal no more data

// ── Pipe — connect readable to writable (handles backpressure) ─────
// pipeline() is the modern, safe way (auto error propagation)
await pipelineAsync(
  fs.createReadStream("input.txt"),
  zlib.createGzip(),                 // Transform: compress
  fs.createWriteStream("input.txt.gz")
);

// ── Transform stream — modify data as it flows ────────────────────
const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    // Push the modified chunk downstream
    this.push(chunk.toString().toUpperCase());
    callback();  // signal chunk is processed
  }
});

await pipelineAsync(
  fs.createReadStream("input.txt"),
  upperCaseTransform,
  fs.createWriteStream("output.txt")
);

// ── Creating a custom Readable (useful for tests and generators) ───
const { Readable } = require("stream");

function createNumberStream(limit) {
  let current = 1;
  return new Readable({
    objectMode: true,  // allow objects, not just Buffers/strings
    read() {
      if (current > limit) {
        this.push(null);  // signal end of stream
      } else {
        this.push(current++);
      }
    }
  });
}

for await (const num of createNumberStream(5)) {
  console.log(num);  // 1, 2, 3, 4, 5
}`,
        },
      ],
    },
    {
      title: { en: "Buffer — working with binary data", np: "Buffer — binary data सँग काम गर्नु", jp: "Buffer — バイナリデータの操作" },
      blocks: [
        {
          type: "code",
          title: { en: "Creating, reading, and converting Buffers", np: "Buffers create, read, र convert गर्नु", jp: "Bufferの作成・読み取り・変換" },
          code: `// ── Creating Buffers ──────────────────────────────────────────────
const buf1 = Buffer.from("Hello, World!", "utf8");  // from string
const buf2 = Buffer.from([72, 101, 108, 108, 111]);  // from byte array
const buf3 = Buffer.alloc(10);                        // zero-filled, 10 bytes
const buf4 = Buffer.allocUnsafe(10);                  // uninitialized (faster but unsafe)

// ── Reading and converting ────────────────────────────────────────
buf1.toString("utf8");    // "Hello, World!"
buf1.toString("hex");     // "48656c6c6f2c20576f726c6421"
buf1.toString("base64");  // "SGVsbG8sIFdvcmxkIQ=="

buf1.length;          // 13 (bytes, not characters)
buf1[0];              // 72 (byte value of 'H')
buf1.readUInt8(0);    // 72 — same thing
buf1.readUInt16BE(0); // 18533 — two bytes as unsigned 16-bit int, big-endian

// ── Concatenating buffers ─────────────────────────────────────────
const chunk1 = Buffer.from("Hello ");
const chunk2 = Buffer.from("World");
const combined = Buffer.concat([chunk1, chunk2]);
combined.toString();  // "Hello World"

// ── Common use case: collecting stream chunks ─────────────────────
const chunks = [];
readable.on("data", (chunk) => chunks.push(chunk));
readable.on("end",  ()      => {
  const fullBuffer = Buffer.concat(chunks);
  const text = fullBuffer.toString("utf8");
  // process the complete content
});

// ── Encoding detection and conversion ─────────────────────────────
const base64Data = "SGVsbG8gV29ybGQ=";
const decoded = Buffer.from(base64Data, "base64").toString("utf8");
// "Hello World"

// Encoding a file to base64 (for email attachments, JWT, etc.)
const fileData = fs.readFileSync("image.png");
const base64 = fileData.toString("base64");`,
        },
      ],
    },
    {
      title: { en: "Child processes & Worker Threads", np: "Child processes र Worker Threads", jp: "子プロセスとWorker Threads" },
      blocks: [
        {
          type: "code",
          title: { en: "spawn, exec, fork, and worker_threads", np: "spawn, exec, fork, र worker_threads", jp: "spawn・exec・fork・worker_threads" },
          code: `const { spawn, exec, fork }   = require("child_process");
const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");

// ── exec — run a shell command, buffer the full output ─────────────
exec("ls -la", (err, stdout, stderr) => {
  if (err) return console.error(err);
  console.log(stdout);
});

// Promisified (cleaner):
const { exec: execAsync } = require("util").promisify(exec) ?? require("util");
// OR:
const { promisify } = require("util");
const execPromise = promisify(exec);
const { stdout } = await execPromise("git log --oneline -5");

// ── spawn — run a process, stream output in chunks ─────────────────
// Use for long-running commands or large output (don't buffer)
const ls = spawn("ls", ["-la", "/tmp"]);
ls.stdout.on("data", (data) => process.stdout.write(data));
ls.stderr.on("data", (data) => process.stderr.write(data));
ls.on("close", (code) => console.log("Exited with code:", code));

// ── exec vs spawn ─────────────────────────────────────────────────
// exec:  buffers all output — simple, but not for large or streaming output
// spawn: streams output — correct for large output, interactive processes

// ── fork — spawn a new Node.js process for IPC ────────────────────
// worker.js:
process.on("message", ({ numbers }) => {
  const sum = numbers.reduce((a, b) => a + b, 0);
  process.send({ sum });
  process.exit(0);
});

// main.js:
const child = fork("./worker.js");
child.send({ numbers: [1, 2, 3, 4, 5] });
child.on("message", ({ sum }) => console.log("Sum:", sum));

// ── Worker Threads — CPU work on a real separate thread ───────────
// Shares memory via SharedArrayBuffer and transferable objects
// Unlike child_process, runs in the SAME process (lower overhead)

// heavy-task.js:
if (!isMainThread) {
  const { numbers } = workerData;
  const result = numbers.reduce((a, b) => a + b, 0);
  parentPort.postMessage(result);
}

// main.js:
function runInWorker(numbers) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(__filename, {
      workerData: { numbers },
    });
    worker.on("message", resolve);
    worker.on("error",   reject);
  });
}

const sum = await runInWorker([1, 2, 3, 4, 5]);
console.log("Sum:", sum);`,
        },
        {
          type: "table",
          caption: { en: "Choosing between concurrency options in Node.js", np: "Node.js concurrency options छान्नु", jp: "Node.jsの並行処理オプションの選択" },
          headers: [
            { en: "Option", np: "Option", jp: "オプション" },
            { en: "Use for", np: "Use for", jp: "用途" },
            { en: "Communication", np: "Communication", jp: "通信" },
            { en: "Memory", np: "Memory", jp: "メモリ" },
          ],
          rows: [
            [
              { en: "Async/await", np: "Async/await", jp: "async/await" },
              { en: "I/O-bound work (DB, network, files)", np: "I/O-bound", jp: "I/Oバウンド（DB・ネットワーク）" },
              { en: "N/A — single thread", np: "Single thread", jp: "N/A（シングルスレッド）" },
              { en: "Shared — single process", np: "Shared", jp: "共有（シングルプロセス）" },
            ],
            [
              { en: "Worker Threads", np: "Worker Threads", jp: "Worker Threads" },
              { en: "CPU-bound work (heavy computation)", np: "CPU-bound", jp: "CPUバウンド（重い計算）" },
              { en: "postMessage / SharedArrayBuffer", np: "postMessage / SharedArrayBuffer", jp: "postMessage/SharedArrayBuffer" },
              { en: "Mostly shared (same process)", np: "Mostly shared", jp: "ほぼ共有（同プロセス）" },
            ],
            [
              { en: "Child process (fork)", np: "Child process", jp: "子プロセス（fork）" },
              { en: "Isolated Node.js sub-programs, IPC", np: "Isolated sub-programs", jp: "独立したNode.jsサブプログラム・IPC" },
              { en: "IPC via process.send()", np: "IPC", jp: "process.send() IPC" },
              { en: "Separate — own memory", np: "Separate", jp: "独立（独自メモリ）" },
            ],
            [
              { en: "spawn / exec", np: "spawn / exec", jp: "spawn / exec" },
              { en: "Shell commands, external programs", np: "Shell commands", jp: "シェルコマンド・外部プログラム" },
              { en: "stdin/stdout/stderr streams", np: "stdin/stdout/stderr", jp: "stdin/stdout/stderrストリーム" },
              { en: "Separate — own memory", np: "Separate", jp: "独立（独自メモリ）" },
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "When should I use streams instead of reading an entire file?", np: "Entire file read गर्नुको सट्टा streams कहिले use गर्ने?", jp: "ファイル全体の読み込みの代わりにストリームを使うべき場面は？" },
      answer: {
        en: "Use streams when the data is large enough that loading it all into memory would be a problem — typically files over a few MB, or when you are piping to a response (HTTP response, database bulk insert, file copy). `fs.readFile` loads the entire file into a Buffer at once, which is fine for config files or small assets but will exhaust memory if many requests simultaneously read a 500MB CSV file. Streams keep memory usage flat regardless of file size.",
        np: "Data memory मा load गर्नु problem हुने जति large छ भने streams — typically files over few MB, वा response मा pipe गर्दा। `fs.readFile` ले सम्पूर्ण file एकैसाथ Buffer मा load गर्छ — config files वा small assets मा ठीक तर 500MB CSV file धेरै requests एकैसाथ read गर्दा memory exhaust हुन्छ।",
        jp: "データが全てメモリに読み込むと問題になるほど大きい場合にストリームを使う。通常数MB以上のファイルやHTTPレスポンスへのパイプ時。`fs.readFile`は全ファイルを一度にBufferに読み込む。500MBのCSVを多くのリクエストが同時に読むと大変なことに。ストリームはファイルサイズに関わらずメモリ使用量を一定に保つ。",
      },
    },
    {
      question: { en: "What is the difference between Worker Threads and child_process?", np: "Worker Threads र child_process मा के फरक?", jp: "Worker Threadsとchild_processの違いは？" },
      answer: {
        en: "Worker Threads run in the same Node.js process — they share memory (via SharedArrayBuffer and transferable objects) and have lower overhead for starting up. They are ideal for CPU-heavy tasks like image processing, encryption, or complex calculations that would block the event loop. Child processes (`fork`, `spawn`, `exec`) run in a separate OS process with their own memory — they communicate via IPC messages or stdin/stdout. Use child_process when you need true process isolation, want to run a shell command, or need to spawn a completely different program.",
        np: "Worker Threads same Node.js process मा run हुन्छ — memory share गर्छन्, startup overhead कम। CPU-heavy tasks (image processing, encryption) का लागि ideal। Child processes separate OS process मा run हुन्छ — IPC वा stdin/stdout मार्फत communicate। True process isolation, shell commands, वा अर्को program spawn गर्न child_process।",
        jp: "Worker Threadsは同じNode.jsプロセスで実行 — メモリを共有し起動コストが低い。イベントループをブロックするCPU重処理（画像処理・暗号化）に最適。child_processは独立したOSプロセスで実行 — IPC/stdin/stdout通信。真のプロセス分離・シェルコマンド・別プログラムの起動はchild_process。",
      },
    },
  ],
};
