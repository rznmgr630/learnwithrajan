import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_29_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Node.js has a rich set of core modules for working with the filesystem, network, processes, and binary data. Streams let you process data in chunks without loading it all into memory. `Buffer` handles raw binary data. Child processes and Worker Threads let you run code in separate processes or threads — essential for CPU-intensive tasks and shell command execution.",
      np: "Node.js सँग filesystem, network, processes, र binary data सँग काम गर्ने rich core modules छन्। Streams ले data को सबैकुरा memory मा नलोडी chunks मा process गर्दछ। `Buffer` ले raw binary data handle गर्छ। Child processes र Worker Threads ले CPU-intensive tasks र shell commands का लागि separate processes/threads मा code run गर्दछ।",
      jp: "Node.jsにはファイルシステム・ネットワーク・プロセス・バイナリデータ用の豊富なコアモジュールがある。Streamsはデータを全てメモリに読み込まずチャンクで処理。`Buffer`は生のバイナリデータを扱う。Child processesとWorker Threadsは分離したプロセス/スレッドでコードを実行。",
    },
  ],
  sections: [
    {
      title: { en: "Streams — process data in chunks", np: "Streams — data लाई टुक्रामा process गर्नु", jp: "ストリーム — データを塊で処理する" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Node is excellent at <b>I/O-bound</b> work because its event-driven design lets it start an operation and keep serving other requests while the OS or network takes its time. Advanced Node then comes down to three tools: <b>streams</b> for large or continuous data, <b>Buffer</b> for raw bytes, and <b>worker threads or child processes</b> for CPU-heavy and isolated work.",
            np: "Node <b>I/O-bound</b> काममा उत्कृष्ट छ किनकि यसको event-driven डिजाइनले operation सुरु गरेर, OS वा network ले समय लिँदा पनि अरू request सेवा गरिरहन दिन्छ। उन्नत Node तीन उपकरणमा आइपुग्छ: ठूलो वा निरन्तर data का लागि <b>stream</b>, कच्चा byte का लागि <b>Buffer</b>, र CPU-भारी तथा अलग काम का लागि <b>worker thread वा child process</b>।",
            jp: "Nodeが<b>I/Oバウンド</b>の仕事に強いのは、イベント駆動の設計により処理を開始した後もOSやネットワークを待つ間ほかの要求を捌けるから。上級のNodeは3つの道具に落ち着く。大きな・連続するデータには<b>ストリーム</b>、生のバイトには<b>Buffer</b>、CPUを食う仕事や隔離が要る仕事には<b>ワーカースレッドか子プロセス</b>。",
          },
        },
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
          title: { en: "Why a stream beats reading the whole file", np: "पूरै file पढ्नुभन्दा stream किन राम्रो", jp: "ファイル全体を読むよりストリームが勝る理由" },
          code: `// The naive version needs the whole file resident in memory
// const data = await readEntireFile();   // a 5 GB string
// process(data);

// A stream hands you a slice at a time
//   5 GB file
//      ↓
//   ┌────────┐
//   │ 64 KB  │ → process
//   ├────────┤
//   │ 64 KB  │ → process
//   ├────────┤
//   │  ...   │
//   └────────┘

const fs = require("fs");

const stream = fs.createReadStream("large-file.txt", {
  encoding: "utf8",
  highWaterMark: 64 * 1024,   // a buffering threshold, not a chunk size
});

stream.on("data", chunk => console.log("Received:", chunk.length));
stream.on("end", () => console.log("Finished"));
stream.on("error", error => console.error(error));

// Writable streams consume data; end() says "no more is coming"
const output = fs.createWriteStream("output.txt");

output.write("Hello\\n");
output.write("World\\n");
output.end();

// Connecting them is where streams earn their keep
fs.createReadStream("input.txt").pipe(output);`,
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
        { type: "youtube", videoId: "GlybFFMXXmQ", title: "Node.js Streams and Buffers — Net Ninja" },
      ],
    },
    {
      title: { en: "Backpressure and `pipeline()`", np: "Backpressure र `pipeline()`", jp: "バックプレッシャーと `pipeline()`" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>Backpressure</b> is the most important stream idea and the easiest to skip. If a producer emits at 100 MB/s into a consumer that handles 10 MB/s, the difference has to go somewhere, and without coordination it piles up in memory until the process falls over. Streams solve this by letting the consumer say \"not yet\": `writable.write(chunk)` returns `false` once its buffer is full, and a well-behaved producer pauses until the `drain` event says there is room again.",
            np: "<b>Backpressure</b> stream को सबैभन्दा महत्वपूर्ण विचार हो र छाड्न सबैभन्दा सजिलो पनि। Producer ले 100 MB/s पठाउँछ र consumer ले 10 MB/s सम्हाल्छ भने, फरक कतै जानुपर्छ, र समन्वय नभए यो memory मा थुप्रिन्छ र process ढल्छ। Stream ले consumer लाई \"अहिले होइन\" भन्न दिएर यो हल गर्छ: buffer भरिएपछि `writable.write(chunk)` ले `false` फर्काउँछ, र असल producer `drain` event ले ठाउँ छ नभनेसम्म रोकिन्छ।",
            jp: "<b>バックプレッシャー</b>はストリームで最も重要で、最も飛ばされやすい考え方。生産側が100 MB/sで送り、消費側が10 MB/sしか捌けなければ、差はどこかへ行く。調整がなければメモリに積み上がり、やがてプロセスが倒れる。ストリームは消費側に「まだ待って」と言わせて解く。バッファが満ちると `writable.write(chunk)` は `false` を返し、行儀のよい生産側は `drain` イベントで空きを知るまで止まる。",
          },
        },
        {
          type: "code",
          title: { en: "Letting the slow side set the pace", np: "ढिलो पक्षलाई गति तय गर्न दिनु", jp: "遅い側にペースを決めさせる" },
          code: `// ── The problem backpressure prevents ─────────────────────────────
// Producer  →  100 MB/s
// Consumer  →   10 MB/s
//
// memory
// ████████████████████████████████
// ████████████████████████████████   and still growing

// ── The signal ────────────────────────────────────────────────────
const canContinue = writable.write(chunk);

if (!canContinue) {
  readable.pause();                       // the buffer is full
  writable.once("drain", () => readable.resume());
}

//   Producer
//      ↓
//   "Can you accept more?"
//      ↓
//   Consumer → NO → pause / wait
//            → YES → continue

// ── pipeline() handles all of that for you ────────────────────────
const { pipeline } = require("stream/promises");
const fs = require("fs");
const zlib = require("zlib");

await pipeline(
  fs.createReadStream("input.txt"),
  zlib.createGzip(),
  fs.createWriteStream("input.txt.gz"),
);

//   input.txt → Readable → Gzip Transform → Writable → input.txt.gz

// Prefer pipeline() over a chain of .pipe() calls in production: it
// propagates the failure and destroys every stream in the chain, where
// a bare .pipe() leaks the remaining streams when one of them errors.`,
        },
        {
          type: "paragraph",
          text: {
            en: "A <b>Transform</b> stream is both readable and writable — it takes a chunk, changes it, and pushes the result on. Compression, encryption, parsing, filtering and encoding conversion are all transforms, which is why a real pipeline usually reads `Readable → Transform → Writable`. In production, prefer `await pipeline(...)` over chaining `.pipe()` by hand: it gives you one place for errors and cleans up every stream in the chain when something fails.",
            np: "<b>Transform</b> stream पढ्ने र लेख्ने दुबै हो — यसले chunk लिन्छ, बदल्छ, र नतिजा अगाडि पठाउँछ। Compression, encryption, parsing, filtering र encoding रूपान्तरण सबै transform हुन्, त्यसैले वास्तविक pipeline प्रायः `Readable → Transform → Writable` पढिन्छ। Production मा हातले `.pipe()` जोड्नुभन्दा `await pipeline(...)` रोज्नुहोस्: यसले error का लागि एउटै ठाउँ दिन्छ र केही बिग्रिँदा शृंखलाका हरेक stream सफा गर्छ।",
            jp: "<b>Transform</b> ストリームは読み書き両方を担い、塊を受け取り、変えて、先へ押し出す。圧縮・暗号化・解析・絞り込み・文字コード変換はすべて変換で、だから実際のパイプラインはたいてい `Readable → Transform → Writable` になる。本番では手で `.pipe()` を繋ぐより `await pipeline(...)` を選ぶ。エラーの窓口がひとつになり、失敗時に連鎖のすべてのストリームを後始末してくれる。",
          },
        },
      ],
    },
    {
      title: { en: "Buffer — raw binary data", np: "Buffer — कच्चा binary data", jp: "Buffer — 生のバイナリデータ" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A <b>Buffer</b> is Node's representation of raw bytes. Strings model text; buffers model the actual octets, which is what you need for files, images, video, TCP sockets, cryptography and binary protocols. The distinction that trips people up is length: `\"👍\".length` is `2` because JavaScript counts UTF-16 code units, while `Buffer.from(\"👍\").length` is `4` because that is how many UTF-8 bytes it takes. <b>Characters, code units and bytes are three different counts</b> and confusing them corrupts data at exactly the boundaries where it hurts.",
            np: "<b>Buffer</b> Node मा कच्चा byte को प्रतिनिधित्व हो। String ले text को model बनाउँछ; buffer ले वास्तविक octet को, जुन file, image, video, TCP socket, cryptography र binary protocol का लागि चाहिन्छ। अल्झाउने भिन्नता लम्बाइ हो: `\"👍\".length` `2` हुन्छ किनकि JavaScript ले UTF-16 code unit गन्छ, तर `Buffer.from(\"👍\").length` `4` हुन्छ किनकि UTF-8 मा त्यति byte लाग्छ। <b>Character, code unit र byte तीन फरक गन्ती हुन्</b> र यी अल्मल्याउँदा ठ्याक्कै दुख्ने ठाउँमा data बिग्रन्छ।",
            jp: "<b>Buffer</b> はNodeにおける生のバイト表現。文字列はテキストを、バッファは実際のオクテットを模す。ファイル・画像・動画・TCPソケット・暗号・バイナリプロトコルに必要なのは後者だ。つまずくのは長さの違い。`\"👍\".length` はUTF-16のコード単位を数えるので `2`、`Buffer.from(\"👍\").length` はUTF-8のバイト数なので `4`。<b>文字・コード単位・バイトは別々の数え方</b>で、混同すると最も痛い境界でデータが壊れる。",
          },
        },
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
        {
          type: "paragraph",
          text: {
            en: "`Buffer.concat(chunks)` is the usual way to reassemble streamed binary data, but reach for it knowingly: collecting every chunk before doing anything gives back exactly the memory problem streams were there to avoid. If the data can be processed incrementally, process it incrementally.",
            np: "Stream भएको binary data फेरि जोड्ने सामान्य तरिका `Buffer.concat(chunks)` हो, तर जानीबुझी प्रयोग गर्नुहोस्: केही गर्नुअघि हरेक chunk जम्मा गर्नु भनेको stream ले जोगाउन खोजेकै memory समस्या फिर्ता ल्याउनु हो। Data क्रमशः process गर्न सकिन्छ भने, क्रमशः नै गर्नुहोस्।",
            jp: "ストリームで届いたバイナリを組み直す定番は `Buffer.concat(chunks)` だが、承知のうえで使う。何かをする前に全チャンクを集めるのは、ストリームが避けようとしたメモリ問題をそのまま呼び戻すことだから。逐次処理できるなら逐次処理する。",
          },
        },
      ],
    },
    {
      title: { en: "Worker threads, child processes, and which to use", np: "Worker thread, child process, र कुन प्रयोग गर्ने", jp: "ワーカースレッドと子プロセス、どちらを使うか" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Node runs your JavaScript on the event-loop thread, which is ideal while it is waiting on I/O and disastrous while it is computing. A long synchronous calculation blocks the loop, and every pending request waits behind it. <b>Worker threads</b> move that computation to another thread inside the same process; <b>child processes</b> start a separate process with its own memory. Workers start faster and can share memory through `SharedArrayBuffer`; child processes give real isolation and can run programs that are not Node at all.",
            np: "Node ले तपाईंको JavaScript event-loop thread मा चलाउँछ, जुन I/O कुर्दा उत्तम र गणना गर्दा विनाशकारी हुन्छ। लामो synchronous गणनाले loop रोक्छ, र बाँकी हरेक request त्यसैको पछाडि कुर्छ। <b>Worker thread</b> ले त्यो गणना उही process भित्रको अर्को thread मा सार्छ; <b>child process</b> ले आफ्नै memory भएको छुट्टै process सुरु गर्छ। Worker छिटो सुरु हुन्छन् र `SharedArrayBuffer` मार्फत memory बाँड्न सक्छन्; child process ले साँचो अलगाव दिन्छ र Node नै नभएका program पनि चलाउन सक्छ।",
            jp: "NodeはJavaScriptをイベントループのスレッドで走らせる。I/Oを待つ間は理想的だが、計算している間は致命的だ。長い同期計算はループを塞ぎ、保留中の要求はその後ろで待たされる。<b>ワーカースレッド</b>はその計算を同じプロセス内の別スレッドへ移し、<b>子プロセス</b>は独自のメモリを持つ別プロセスを起こす。ワーカーは起動が速く `SharedArrayBuffer` でメモリを共有できる。子プロセスは本物の隔離を与え、Node以外のプログラムも動かせる。",
          },
        },
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
        {
          type: "code",
          title: { en: "exec, spawn, fork — three ways to start something else", np: "exec, spawn, fork — अरू केही सुरु गर्ने तीन तरिका", jp: "exec・spawn・fork — 別のものを起こす3つの方法" },
          code: `// ── exec() buffers the whole output ───────────────────────────────
const { exec } = require("child_process");

exec("git --version", (error, stdout) => {
  if (error) return console.error(error);
  console.log(stdout);
});
// Fine for a short result. Buffering gigabytes is not fine.

// ── spawn() streams it ────────────────────────────────────────────
const { spawn } = require("child_process");

const child = spawn("git", ["--version"]);
child.stdout.on("data", data => console.log(data.toString()));
// Right for large output, long-running processes, and stdin control.

// ── fork() starts another Node process with an IPC channel ────────
const { fork } = require("child_process");

const worker = fork("./worker.js");
worker.send({ numbers: [1, 2, 3, 4, 5] });
worker.on("message", message => console.log(message.result));

// worker.js
// process.on("message", message => {
//   const result = message.numbers.reduce((sum, n) => sum + n, 0);
//   process.send({ result });
// });

// ── Choosing, by the shape of the work ────────────────────────────
//                  WORK
//                    │
//         ┌──────────┴──────────┐
//         ↓                     ↓
//       I/O                    CPU
//         │                     │
//    ┌────┴────┐           ┌────┴────┐
//    ↓         ↓           ↓         ↓
// Database  Network     Worker     Child
// Files                 Thread    Process
//    │
//    ↓
// Streams for large data

// Database or API call        -> async/await
// Large file                  -> stream
// Binary data                 -> Buffer
// CPU-heavy JavaScript        -> worker thread
// External executable         -> spawn()
// Small shell command         -> exec()
// Another Node app over IPC   -> fork()`,
        },
        {
          type: "paragraph",
          text: {
            en: "Four mistakes account for most Node performance incidents. <b>Reading a huge file with `readFileSync`</b> when a read stream would do. <b>Ignoring backpressure</b> and calling `write()` in a loop regardless of what it returns. <b>Spawning a worker for I/O</b> — `await fetch(url)` and `await db.query(...)` are already non-blocking, so a worker adds overhead and buys nothing. And <b>using `exec()` for enormous output</b>, which buffers it all in memory when `spawn()` would have streamed it. Underneath all four sits one distinction worth keeping straight: async I/O gives you <b>concurrency</b>, while worker threads give you actual <b>parallel JavaScript execution</b>.",
            np: "Node का अधिकांश performance घटना चार गल्तीबाट आउँछन्। Read stream ले पुग्ने ठाउँमा <b>`readFileSync` ले ठूलो file पढ्नु</b>। <b>Backpressure बेवास्ता गर्दै</b> `write()` ले के फर्काउँछ नहेरी loop मा बोलाउनु। <b>I/O का लागि worker सुरु गर्नु</b> — `await fetch(url)` र `await db.query(...)` पहिले नै non-blocking छन्, त्यसैले worker ले भार मात्र थप्छ। र <b>ठूलो output का लागि `exec()` प्रयोग गर्नु</b>, जसले सबै memory मा राख्छ जब `spawn()` ले stream गर्थ्यो। यी चारै मुनि एउटा भिन्नता छ: async I/O ले <b>concurrency</b> दिन्छ, worker thread ले साँचो <b>समानान्तर JavaScript execution</b>।",
            jp: "Nodeの性能事故の大半は4つの誤りから来る。読み取りストリームで足りる場面で<b>`readFileSync` により巨大ファイルを読む</b>こと。<b>バックプレッシャーを無視して</b>戻り値を見ずにループで `write()` を呼ぶこと。<b>I/Oのためにワーカーを起こす</b>こと — `await fetch(url)` も `await db.query(...)` もすでに非ブロッキングなので、ワーカーは負荷を足すだけ。そして<b>巨大な出力に `exec()` を使う</b>こと。`spawn()` なら流せたものを丸ごとメモリに溜める。4つの底にある区別はひとつ。非同期I/Oが与えるのは<b>並行性</b>、ワーカースレッドが与えるのは本物の<b>並列なJavaScript実行</b>。",
          },
        },
      ],
    },
  ],
  quiz: [
    {
      question: { en: "What is the main advantage of a stream?", np: "Stream को मुख्य फाइदा के हो?", jp: "ストリームの主な利点は?" },
      options: [
        { en: "It makes JavaScript synchronous", np: "यसले JavaScript synchronous बनाउँछ", jp: "JavaScriptを同期にする" },
        { en: "It creates worker threads automatically", np: "यसले स्वतः worker thread बनाउँछ", jp: "自動でワーカースレッドを作る" },
        { en: "It converts strings into objects", np: "यसले string लाई object बनाउँछ", jp: "文字列をオブジェクトに変換する" },
        { en: "It processes data incrementally instead of holding it all in memory", np: "यसले सबै memory मा नराखी data क्रमशः process गर्छ", jp: "全部をメモリに置かず、データを逐次処理する" },
      ],
      correctIndex: 3,
      explanation: { en: "A 5 GB file never has to be resident all at once.", np: "5 GB को file एकैचोटि पूरै राख्नु पर्दैन।", jp: "5 GBのファイルを一度に丸ごと持つ必要がない。" },
    },
    {
      question: { en: "Which stream type reads, modifies and writes?", np: "कुन stream ले पढ्छ, बदल्छ र लेख्छ?", jp: "読み・変更・書きを行うストリームは?" },
      options: [
        { en: "Readable", np: "Readable", jp: "Readable" },
        { en: "Transform", np: "Transform", jp: "Transform" },
        { en: "Writable", np: "Writable", jp: "Writable" },
        { en: "Buffer", np: "Buffer", jp: "Buffer" },
      ],
      correctIndex: 1,
      explanation: { en: "Compression, encryption and parsing are all transforms.", np: "Compression, encryption र parsing सबै transform हुन्।", jp: "圧縮・暗号化・解析はどれも変換。" },
    },
    {
      question: { en: "Why does backpressure matter?", np: "Backpressure किन महत्वपूर्ण छ?", jp: "バックプレッシャーが重要な理由は?" },
      options: [
        { en: "It encrypts the streamed data", np: "यसले stream भएको data encrypt गर्छ", jp: "流れるデータを暗号化するから" },
        { en: "It stops a fast producer from overwhelming a slow consumer", np: "यसले छिटो producer ले ढिलो consumer लाई थिच्नबाट रोक्छ", jp: "速い生産側が遅い消費側を圧倒するのを防ぐから" },
        { en: "It creates extra CPU threads", np: "यसले थप CPU thread बनाउँछ", jp: "追加のCPUスレッドを作るから" },
        { en: "It converts Buffers to strings", np: "यसले Buffer लाई string बनाउँछ", jp: "Bufferを文字列に変換するから" },
      ],
      correctIndex: 1,
      explanation: { en: "Without it the difference in rate piles up in memory until the process falls over.", np: "यो नभए गतिको फरक memory मा थुप्रिन्छ र process ढल्छ।", jp: "無ければ速度差がメモリに積み上がり、やがてプロセスが倒れる。" },
    },
    {
      question: { en: "Why prefer `pipeline()` over chaining `.pipe()` in production?", np: "Production मा `.pipe()` जोड्नुभन्दा `pipeline()` किन रोज्ने?", jp: "本番で `.pipe()` の連結より `pipeline()` を選ぶ理由は?" },
      options: [
        { en: "It propagates the error and destroys every stream in the chain", np: "यसले error फैलाउँछ र शृंखलाका हरेक stream नष्ट गर्छ", jp: "エラーを伝播し、連鎖のすべてのストリームを破棄するから" },
        { en: "It is faster at copying bytes", np: "यो byte copy गर्न छिटो छ", jp: "バイトのコピーが速いから" },
        { en: "It compresses the output automatically", np: "यसले output स्वतः compress गर्छ", jp: "出力を自動で圧縮するから" },
      ],
      correctIndex: 0,
      explanation: { en: "A bare `.pipe()` leaks the remaining streams when one of them errors.", np: "खाली `.pipe()` मा एउटा stream मा error आए बाँकी stream leak हुन्छन्।", jp: "素の `.pipe()` は途中でエラーが出ると残りのストリームを放置する。" },
    },
    {
      question: { en: "What does a Node `Buffer` represent?", np: "Node को `Buffer` ले के जनाउँछ?", jp: "Nodeの `Buffer` は何を表すか?" },
      options: [
        { en: "JavaScript objects", np: "JavaScript object", jp: "JavaScriptのオブジェクト" },
        { en: "Promises", np: "Promise", jp: "Promise" },
        { en: "Raw binary bytes", np: "कच्चा binary byte", jp: "生のバイナリのバイト列" },
        { en: "DOM elements", np: "DOM element", jp: "DOM要素" },
      ],
      correctIndex: 2,
      explanation: { en: "`\"👍\".length` is 2 code units, `Buffer.from(\"👍\").length` is 4 bytes.", np: "`\"👍\".length` 2 code unit हो, `Buffer.from(\"👍\").length` 4 byte।", jp: "`\"👍\".length` は2コード単位、`Buffer.from(\"👍\").length` は4バイト。" },
    },
    {
      question: { en: "Which is more appropriate for a command that produces very large output?", np: "धेरै ठूलो output दिने command का लागि कुन उपयुक्त छ?", jp: "非常に大きな出力を出すコマンドに向くのは?" },
      options: [
        { en: "`exec()`", np: "`exec()`", jp: "`exec()`" },
        { en: "`JSON.parse()`", np: "`JSON.parse()`", jp: "`JSON.parse()`" },
        { en: "`spawn()`", np: "`spawn()`", jp: "`spawn()`" },
        { en: "`fork()`", np: "`fork()`", jp: "`fork()`" },
      ],
      correctIndex: 2,
      explanation: { en: "`exec()` buffers the whole output in memory; `spawn()` streams it.", np: "`exec()` ले पूरै output memory मा राख्छ; `spawn()` ले stream गर्छ।", jp: "`exec()` は出力を丸ごとバッファし、`spawn()` は流す。" },
    },
    {
      question: { en: "When are worker threads most useful?", np: "Worker thread कहिले सबैभन्दा उपयोगी हुन्छन्?", jp: "ワーカースレッドが最も役立つのは?" },
      options: [
        { en: "CPU-intensive JavaScript computation", np: "CPU-भारी JavaScript गणना", jp: "CPUを食うJavaScriptの計算" },
        { en: "Waiting for an HTTP request", np: "HTTP request कुर्दा", jp: "HTTPリクエストを待つとき" },
        { en: "Waiting for a database query", np: "Database query कुर्दा", jp: "DBクエリを待つとき" },
        { en: "Reading a small config file", np: "सानो config file पढ्दा", jp: "小さな設定ファイルを読むとき" },
      ],
      correctIndex: 0,
      explanation: { en: "The other three are I/O, which Node already handles without blocking.", np: "बाँकी तीन I/O हुन्, जुन Node ले नरोकी पहिले नै सम्हाल्छ।", jp: "他の3つはI/Oで、Nodeはすでにブロックせずに扱える。" },
    },
    {
      question: { en: "What is the key difference between a worker thread and a child process?", np: "Worker thread र child process बीचको मुख्य भिन्नता के हो?", jp: "ワーカースレッドと子プロセスの決定的な違いは?" },
      options: [
        { en: "Workers share the process; child processes are separate processes with their own memory", np: "Worker ले process बाँड्छ; child process आफ्नै memory भएका छुट्टै process हुन्", jp: "ワーカーはプロセスを共有し、子プロセスは独自メモリを持つ別プロセス" },
        { en: "Child processes run on the same thread", np: "Child process उही thread मा चल्छ", jp: "子プロセスは同じスレッドで動く" },
        { en: "Workers cannot execute JavaScript", np: "Worker ले JavaScript चलाउन सक्दैन", jp: "ワーカーはJavaScriptを実行できない" },
        { en: "They are the same thing", np: "ती एउटै हुन्", jp: "同じもの" },
      ],
      correctIndex: 0,
      explanation: { en: "That is why workers start faster but child processes isolate crashes better.", np: "त्यसैले worker छिटो सुरु हुन्छन् तर child process ले crash राम्रोसँग अलग गर्छ।", jp: "だからワーカーは起動が速く、子プロセスは障害の隔離に優れる。" },
    },
    {
      question: { en: "What is the difference between concurrency and parallelism here?", np: "यहाँ concurrency र parallelism बीच के फरक छ?", jp: "ここでの並行性と並列性の違いは?" },
      options: [
        { en: "Parallelism only applies to child processes", np: "Parallelism child process मा मात्र लागू हुन्छ", jp: "並列性は子プロセスにのみ当てはまる" },
        { en: "They mean the same thing in Node", np: "Node मा ती उही अर्थ राख्छन्", jp: "Nodeでは同じ意味" },
        { en: "Async I/O gives concurrency; worker threads give parallel JavaScript execution", np: "Async I/O ले concurrency दिन्छ; worker thread ले समानान्तर JavaScript execution", jp: "非同期I/Oは並行性を、ワーカースレッドは並列なJavaScript実行を与える" },
      ],
      correctIndex: 2,
      explanation: { en: "Node juggles many I/O operations without running JavaScript for all of them at once.", np: "Node ले धेरै I/O operation सम्हाल्छ, सबैका लागि JavaScript एकैचोटि नचलाई।", jp: "Nodeは多数のI/Oを捌くが、そのすべてでJavaScriptを同時に走らせているわけではない。" },
    },
    {
      question: { en: "You must transform every row of a 20 GB CSV and gzip the result. What shape fits?", np: "20 GB CSV को हरेक row बदलेर नतिजा gzip गर्नुपर्छ। कुन आकार मिल्छ?", jp: "20 GBのCSVの全行を変換しgzipする。どの形が合うか?" },
      options: [
        { en: "Read it all with `readFileSync`, then transform and write", np: "`readFileSync` ले सबै पढ्ने, अनि बदल्ने र लेख्ने", jp: "`readFileSync` で全部読み、変換して書く" },
        { en: "Readable stream → Transform → Gzip → Writable stream", np: "Readable stream → Transform → Gzip → Writable stream", jp: "Readableストリーム → Transform → Gzip → Writableストリーム" },
        { en: "Load it into a worker thread as one string", np: "एउटै string का रूपमा worker thread मा लोड गर्ने", jp: "1つの文字列としてワーカースレッドへ載せる" },
      ],
      correctIndex: 1,
      explanation: { en: "If the per-row transform is also CPU-heavy, add a worker pool to that stage.", np: "प्रति-row transform पनि CPU-भारी छ भने, त्यो चरणमा worker pool थप्नुहोस्।", jp: "行ごとの変換もCPUを食うなら、その段にワーカープールを足す。" },
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
