import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_29_LESSONS: JsLessonDay = {
  day: 29,
  title: { en: "Node.js advanced — streams, Buffer & worker threads", np: "Node.js उन्नत — stream, Buffer र worker thread", jp: "Node.js応用 — ストリーム・Buffer・ワーカースレッド" },
  totalMinutes: 34,
  difficulty: { en: "Advanced", np: "उन्नत", jp: "上級" },
  lessons: [
    {
      id: "streams",
      title: { en: "Streams — process data in chunks", np: "Streams — data लाई टुक्रामा process गर्नु", jp: "ストリーム — データを塊で処理する" },
      durationMinutes: 9,
      explanation: {
        en: "Node is good at <b>I/O-bound</b> work — work that spends its time waiting on a disk, a database or a network rather than on the CPU. Its event-driven design lets it start an operation and keep serving other requests while the wait happens.\n\nAdvanced Node then comes down to three tools:\n\n```text\nLarge data      →  Streams        →  process chunk by chunk\nBinary data     →  Buffer         →  work with raw bytes\nHeavy CPU work  →  Worker Thread  →  compute off the main thread\n```\n\n---\n\n### 1. Basic — why a stream\n\nImagine a 5 GB file. The naive version needs all of it in memory at once:\n\n```javascript\nconst data = await readEntireFile();   // a 5 GB string\nprocess(data);\n```\n\nA <b>stream</b> hands you a slice at a time instead:\n\n```text\n5 GB file\n   ↓\n┌────────┐\n│ 64 KB  │ → process\n├────────┤\n│ 64 KB  │ → process\n├────────┤\n│  ...   │\n└────────┘\n```\n\n```javascript\nconst fs = require(\"fs\");\n\nconst stream = fs.createReadStream(\"large-file.txt\", {\n  encoding: \"utf8\",\n  highWaterMark: 64 * 1024\n});\n\nstream.on(\"data\", chunk => console.log(\"Received:\", chunk.length));\nstream.on(\"end\", () => console.log(\"Finished\"));\nstream.on(\"error\", error => console.error(error));\n```\n\n`highWaterMark` is a <i>buffering threshold</i> — roughly how much the stream will hold before it stops reading ahead. It is <b>not</b> a promise that every chunk is exactly that size.\n\n---\n\n### 2. Intermediate — the four types\n\n```text\nReadable    produces data      a file read stream\nWritable    consumes data      a file write stream\nDuplex      both               a TCP socket\nTransform   in → change → out  gzip\n```\n\nA <b>Writable</b> takes data and `end()` tells it no more is coming:\n\n```javascript\nconst output = fs.createWriteStream(\"output.txt\");\n\noutput.write(\"Hello\\n\");\noutput.write(\"World\\n\");\noutput.end();\n```\n\nThe power comes from connecting them with `pipe()`:\n\n```javascript\nfs.createReadStream(\"input.txt\").pipe(output);\n```\n\n```text\ninput.txt → Readable → Writable → output.txt\n```\n\nYou never hold the whole file.\n\n---\n\n### 3. Advanced — Transform\n\nA <b>Transform</b> stream is readable and writable at once: data goes in, gets changed, comes out.\n\n```javascript\nconst { Transform } = require(\"stream\");\n\nconst upperCase = new Transform({\n  transform(chunk, encoding, callback) {\n    callback(null, chunk.toString().toUpperCase());\n  }\n});\n\ninput.pipe(upperCase).pipe(output);\n```\n\n```text\ninput → \"hello\" → Transform → \"HELLO\" → output\n```\n\nCompression, encryption, parsing, filtering and encoding conversion are all transforms, which is why a real pipeline reads `Readable → Transform → Writable`.",
        np: "Node <b>I/O-bound</b> काममा राम्रो छ — CPU मा होइन, disk, database वा network कुर्दै समय बिताउने काम। यसको event-driven डिजाइनले operation सुरु गरेर, कुर्दै गर्दा पनि अरू request सेवा गरिरहन दिन्छ।\n\nउन्नत Node तीन उपकरणमा आइपुग्छ:\n\n```text\nठूलो data       →  Stream         →  टुक्रा-टुक्रा process\nBinary data     →  Buffer         →  कच्चा byte सँग काम\nभारी CPU काम    →  Worker Thread  →  मुख्य thread बाहिर गणना\n```\n\n---\n\n### 1. आधारभूत — stream किन\n\n5 GB को file कल्पना गर्नुहोस्। सिधा तरिकालाई एकैचोटि सबै memory मा चाहिन्छ:\n\n```javascript\nconst data = await readEntireFile();   // 5 GB को string\nprocess(data);\n```\n\n<b>Stream</b> ले बरु एक पटकमा एक टुक्रा दिन्छ:\n\n```text\n5 GB file\n   ↓\n┌────────┐\n│ 64 KB  │ → process\n├────────┤\n│ 64 KB  │ → process\n├────────┤\n│  ...   │\n└────────┘\n```\n\n```javascript\nconst fs = require(\"fs\");\n\nconst stream = fs.createReadStream(\"large-file.txt\", {\n  encoding: \"utf8\",\n  highWaterMark: 64 * 1024\n});\n\nstream.on(\"data\", chunk => console.log(\"Received:\", chunk.length));\nstream.on(\"end\", () => console.log(\"Finished\"));\nstream.on(\"error\", error => console.error(error));\n```\n\n`highWaterMark` <i>buffering threshold</i> हो — stream ले अगाडि पढ्न रोक्नुअघि करिब कति राख्छ। हरेक chunk ठ्याक्कै त्यति आकारको हुन्छ भन्ने वाचा <b>होइन</b>।\n\n---\n\n### 2. मध्यम — चार प्रकार\n\n```text\nReadable    data बनाउँछ         file read stream\nWritable    data खपत गर्छ       file write stream\nDuplex      दुबै                 TCP socket\nTransform   भित्र → बदल → बाहिर  gzip\n```\n\n<b>Writable</b> ले data लिन्छ र `end()` ले अब थप आउँदैन भन्छ:\n\n```javascript\nconst output = fs.createWriteStream(\"output.txt\");\n\noutput.write(\"Hello\\n\");\noutput.write(\"World\\n\");\noutput.end();\n```\n\nशक्ति `pipe()` ले जोड्दा आउँछ:\n\n```javascript\nfs.createReadStream(\"input.txt\").pipe(output);\n```\n\n```text\ninput.txt → Readable → Writable → output.txt\n```\n\nतपाईंले पूरै file कहिल्यै राख्नुहुन्न।\n\n---\n\n### 3. उन्नत — Transform\n\n<b>Transform</b> stream एकैचोटि पढ्ने र लेख्ने दुबै हो: data भित्र जान्छ, बदलिन्छ, बाहिर आउँछ।\n\n```javascript\nconst { Transform } = require(\"stream\");\n\nconst upperCase = new Transform({\n  transform(chunk, encoding, callback) {\n    callback(null, chunk.toString().toUpperCase());\n  }\n});\n\ninput.pipe(upperCase).pipe(output);\n```\n\n```text\ninput → \"hello\" → Transform → \"HELLO\" → output\n```\n\nCompression, encryption, parsing, filtering र encoding रूपान्तरण सबै transform हुन्, त्यसैले वास्तविक pipeline `Readable → Transform → Writable` पढिन्छ।",
        jp: "Nodeは<b>I/Oバウンド</b>の仕事、つまりCPUではなくディスク・データベース・ネットワークを待つ仕事に強い。イベント駆動の設計により、処理を始めた後も待つあいだ他の要求を捌ける。\n\n上級のNodeは3つの道具に落ち着く:\n\n```text\n大きなデータ    →  ストリーム      →  塊ごとに処理する\nバイナリ        →  Buffer          →  生のバイトを扱う\n重いCPU処理     →  ワーカースレッド →  メインスレッドの外で計算する\n```\n\n---\n\n### 1. 基本 — なぜストリームか\n\n5 GBのファイルを思い浮かべる。素朴なやり方は全部を一度にメモリへ載せる:\n\n```javascript\nconst data = await readEntireFile();   // 5 GBの文字列\nprocess(data);\n```\n\n<b>ストリーム</b>は代わりに一度にひと切れを渡す:\n\n```text\n5 GB file\n   ↓\n┌────────┐\n│ 64 KB  │ → process\n├────────┤\n│ 64 KB  │ → process\n├────────┤\n│  ...   │\n└────────┘\n```\n\n```javascript\nconst fs = require(\"fs\");\n\nconst stream = fs.createReadStream(\"large-file.txt\", {\n  encoding: \"utf8\",\n  highWaterMark: 64 * 1024\n});\n\nstream.on(\"data\", chunk => console.log(\"Received:\", chunk.length));\nstream.on(\"end\", () => console.log(\"Finished\"));\nstream.on(\"error\", error => console.error(error));\n```\n\n`highWaterMark` は<i>バッファのしきい値</i>で、先読みを止めるまでにおよそどれだけ保持するかを表す。各チャンクがちょうどそのサイズになるという保証では<b>ない</b>。\n\n---\n\n### 2. 中級 — 4つの型\n\n```text\nReadable    データを生む         ファイル読み込み\nWritable    データを受ける       ファイル書き込み\nDuplex      両方                 TCPソケット\nTransform   入→変換→出          gzip\n```\n\n<b>Writable</b> はデータを受け取り、`end()` がもう来ないことを伝える:\n\n```javascript\nconst output = fs.createWriteStream(\"output.txt\");\n\noutput.write(\"Hello\\n\");\noutput.write(\"World\\n\");\noutput.end();\n```\n\n真価は `pipe()` で繋いだときに出る:\n\n```javascript\nfs.createReadStream(\"input.txt\").pipe(output);\n```\n\n```text\ninput.txt → Readable → Writable → output.txt\n```\n\nファイル全体を抱えることは一度もない。\n\n---\n\n### 3. 上級 — Transform\n\n<b>Transform</b> は読みと書きを兼ねる。データが入り、変わり、出ていく。\n\n```javascript\nconst { Transform } = require(\"stream\");\n\nconst upperCase = new Transform({\n  transform(chunk, encoding, callback) {\n    callback(null, chunk.toString().toUpperCase());\n  }\n});\n\ninput.pipe(upperCase).pipe(output);\n```\n\n```text\ninput → \"hello\" → Transform → \"HELLO\" → output\n```\n\n圧縮・暗号化・解析・絞り込み・文字コード変換はすべて変換なので、実際のパイプラインは `Readable → Transform → Writable` になる。",
      },
      diagram: `Whole file versus a stream

readFileSync                      createReadStream
      │                                 │
      ▼                                 ▼
┌─────────────┐                   ┌────────┐
│             │                   │ 64 KB  │ → process
│    5 GB     │  all resident     ├────────┤
│             │                   │ 64 KB  │ → process
└─────────────┘                   ├────────┤
                                  │  ...   │
                                  └────────┘


The four types

Readable    produces          file read stream
Writable    consumes          file write stream
Duplex      both              TCP socket
Transform   in → change → out gzip


A real pipeline

input.txt → Readable → Transform → Writable → output.txt
                          │
                     gzip, encrypt,
                     parse, filter`,
      codeExample: {
        title: { en: "Reading, writing and transforming a stream", np: "Stream पढ्नु, लेख्नु र बदल्नु", jp: "ストリームの読み・書き・変換" },
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
      keyTakeaways: [
        { en: "A <b>stream</b> processes data incrementally instead of holding all of it in memory.", np: "<b>Stream</b> ले सबै memory मा नराखी data क्रमशः process गर्छ।", jp: "<b>ストリーム</b>は全部をメモリに置かず、データを逐次処理する。" },
        { en: "The four types are <b>Readable, Writable, Duplex and Transform</b>.", np: "चार प्रकार हुन् <b>Readable, Writable, Duplex र Transform</b>।", jp: "4つの型は<b>Readable・Writable・Duplex・Transform</b>。" },
        { en: "`highWaterMark` is a <b>buffering threshold</b>, not a guaranteed chunk size.", np: "`highWaterMark` <b>buffering threshold</b> हो, ग्यारेन्टी गरिएको chunk आकार होइन।", jp: "`highWaterMark` は<b>バッファのしきい値</b>で、チャンクサイズの保証ではない。" },
        { en: "`end()` tells a writable stream that no more data is coming.", np: "`end()` ले writable stream लाई अब थप data आउँदैन भन्छ।", jp: "`end()` はwritableへ、もうデータが来ないことを伝える。" },
        { en: "A <b>Transform</b> is readable and writable at once — compression, encryption and parsing all are.", np: "<b>Transform</b> एकैचोटि पढ्ने र लेख्ने हो — compression, encryption र parsing सबै यही हुन्।", jp: "<b>Transform</b> は読みと書きを兼ねる。圧縮・暗号化・解析はすべてこれ。" },
        { en: "Connecting streams with `pipe()` means the whole file is never resident.", np: "`pipe()` ले stream जोड्दा पूरै file कहिल्यै memory मा रहँदैन।", jp: "`pipe()` で繋げば、ファイル全体がメモリに載ることはない。" },
      ],
      commonMistakes: [
        { en: "<b>Reading a huge file with `readFileSync`</b> — it blocks the event loop and needs the whole file in memory. Use `createReadStream` instead.", np: "<b>`readFileSync` ले ठूलो file पढ्नु</b> — यसले event loop रोक्छ र पूरै file memory मा चाहिन्छ। बरु `createReadStream` प्रयोग गर्नुहोस्।", jp: "<b>`readFileSync` で巨大ファイルを読む</b> — イベントループを塞ぎ、全体をメモリに要求する。`createReadStream` を使う。" },
        { en: "<b>Expecting every chunk to be exactly `highWaterMark` bytes</b> — it is a threshold, so chunk sizes vary and your parser must handle a record split across two chunks.", np: "<b>हरेक chunk ठ्याक्कै `highWaterMark` byte हुन्छ भन्ने आशा</b> — यो threshold हो, त्यसैले आकार फरक पर्छ र दुई chunk मा बाँडिएको record तपाईंको parser ले सम्हाल्नुपर्छ।", jp: "<b>各チャンクがちょうど `highWaterMark` だと思う</b> — しきい値なのでサイズは変わる。2つのチャンクにまたがるレコードを扱えるパーサが要る。" },
        { en: "<b>Forgetting `end()`</b> — the writable never finishes, so the `finish` event never fires and the file may stay incomplete.", np: "<b>`end()` बिर्सनु</b> — writable कहिल्यै टुंगिँदैन, त्यसैले `finish` event बज्दैन र file अधूरो रहन सक्छ।", jp: "<b>`end()` を忘れる</b> — writableが完了せず `finish` が発火しないので、ファイルが不完全なままになりうる。" },
        { en: "<b>Ignoring the `error` event</b> — an unhandled stream error becomes an uncaught exception and takes the process down.", np: "<b>`error` event बेवास्ता गर्नु</b> — नसम्हालिएको stream error uncaught exception बन्छ र process ढाल्छ।", jp: "<b>`error` イベントを無視する</b> — 未処理のストリームエラーは未捕捉例外になり、プロセスを落とす。" },
      ],
      quiz: [
        {
          question: { en: "What is the main advantage of a stream?", np: "Stream को मुख्य फाइदा के हो?", jp: "ストリームの主な利点は?" },
          options: [
            { en: "It makes JavaScript synchronous", np: "यसले JavaScript synchronous बनाउँछ", jp: "JavaScriptを同期にする" },
            { en: "It creates worker threads automatically", np: "यसले स्वतः worker thread बनाउँछ", jp: "自動でワーカースレッドを作る" },
            { en: "It converts strings into objects", np: "यसले string लाई object बनाउँछ", jp: "文字列をオブジェクトに変換する" },
            { en: "It processes data incrementally instead of holding it all in memory", np: "यसले सबै memory मा नराखी data क्रमशः process गर्छ", jp: "全部をメモリに置かず、逐次処理する" },
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
          question: { en: "What does `highWaterMark` actually control?", np: "`highWaterMark` ले वास्तवमा के नियन्त्रण गर्छ?", jp: "`highWaterMark` が実際に制御するものは?" },
          options: [
            { en: "How much the stream buffers before it stops reading ahead", np: "Stream ले अगाडि पढ्न रोक्नुअघि कति buffer गर्छ", jp: "先読みを止めるまでにどれだけバッファするか" },
            { en: "The exact size of every chunk", np: "हरेक chunk को ठ्याक्कै आकार", jp: "各チャンクの正確なサイズ" },
            { en: "The number of chunks", np: "Chunk को संख्या", jp: "チャンクの個数" },
          ],
          correctIndex: 0,
          explanation: { en: "Chunk sizes vary, so a parser must handle records split across chunks.", np: "Chunk आकार फरक पर्छ, त्यसैले parser ले बाँडिएको record सम्हाल्नुपर्छ।", jp: "サイズは変わるので、パーサはチャンクをまたぐレコードを扱う必要がある。" },
        },
        {
          question: { en: "What does `end()` do on a writable stream?", np: "Writable stream मा `end()` ले के गर्छ?", jp: "writableストリームで `end()` は何をするか?" },
          options: [
            { en: "Signals that no more data will be written", np: "अब थप data लेखिँदैन भन्ने संकेत गर्छ", jp: "もうデータを書かないことを伝える" },
            { en: "Deletes the file", np: "File मेटाउँछ", jp: "ファイルを削除する" },
            { en: "Pauses the stream", np: "Stream रोक्छ", jp: "ストリームを一時停止する" },
          ],
          correctIndex: 0,
          explanation: { en: "Without it the `finish` event never fires.", np: "यसबिना `finish` event कहिल्यै बज्दैन।", jp: "無ければ `finish` イベントは発火しない。" },
        },
        {
          question: { en: "What does `input.pipe(upperCase).pipe(output)` describe?", np: "`input.pipe(upperCase).pipe(output)` ले के वर्णन गर्छ?", jp: "`input.pipe(upperCase).pipe(output)` は何を表すか?" },
          options: [
            { en: "Three separate file copies", np: "तीन छुट्टै file copy", jp: "3つの別々のファイルコピー" },
            { en: "A Readable feeding a Transform feeding a Writable", np: "Readable ले Transform, Transform ले Writable लाई खुवाउने", jp: "ReadableがTransformへ、TransformがWritableへ流す" },
            { en: "A retry loop", np: "एउटा retry loop", jp: "リトライのループ" },
          ],
          correctIndex: 1,
          explanation: { en: "That is the shape of every real stream pipeline.", np: "हरेक वास्तविक stream pipeline को आकार यही हो।", jp: "実際のストリームパイプラインはすべてこの形。" },
        },
      ],
      youtubeIds: ["GlybFFMXXmQ"],
    },
    {
      id: "backpressure",
      title: { en: "Backpressure and `pipeline()`", np: "Backpressure र `pipeline()`", jp: "バックプレッシャーと `pipeline()`" },
      durationMinutes: 8,
      explanation: {
        en: "<b>Backpressure</b> is the most important stream idea and the easiest one to skip past.\n\nSuppose a producer emits at 100 MB/s into a consumer that handles 10 MB/s. The extra 90 MB every second has to go somewhere, and without coordination it piles up in memory until the process falls over:\n\n```text\nProducer\n  ↓\n100 MB/s\n  ↓\nConsumer\n  ↓\n10 MB/s\n\n\nmemory\n████████████████████████████████\n████████████████████████████████   and still growing\n```\n\n---\n\n### 1. Basic — the signal\n\nStreams solve this by letting the consumer say \"not yet\". `write()` returns `false` once its internal buffer is full:\n\n```javascript\nconst canContinue = writable.write(chunk);\n\nif (!canContinue) {\n  readable.pause();\n  writable.once(\"drain\", () => readable.resume());\n}\n```\n\n`drain` is the event that fires when the buffer has emptied enough to accept more.\n\n```text\nProducer\n   ↓\n\"Can you accept more?\"\n   ↓\nConsumer\n   ↓\nNO  → pause / wait\nYES → continue\n```\n\n---\n\n### 2. Intermediate — `pipe()` already does it\n\nYou rarely write that by hand, because `pipe()` handles the pause-and-resume dance for you. What `pipe()` does <b>not</b> handle well is failure: if one stream in the chain errors, the others are left dangling, still open and still holding memory.\n\n---\n\n### 3. Advanced — `pipeline()`\n\nFor production, use `pipeline()`. It composes the same chain but propagates errors and destroys every stream when one of them fails:\n\n```javascript\nconst { pipeline } = require(\"stream/promises\");\nconst fs = require(\"fs\");\nconst zlib = require(\"zlib\");\n\nawait pipeline(\n  fs.createReadStream(\"input.txt\"),\n  zlib.createGzip(),\n  fs.createWriteStream(\"input.txt.gz\")\n);\n```\n\n```text\ninput.txt → Readable → Gzip Transform → Writable → input.txt.gz\n```\n\nThe promise version means a failure anywhere becomes a normal `try/catch`, instead of an error listener on each stream. That is the whole reason to prefer it:\n\n```text\n.pipe() chain          one stream errors → the rest leak\npipeline()             one stream errors → all are destroyed\n```\n\nThis is also why streams scale better than buffering everything: the slow side is allowed to set the pace.",
        np: "<b>Backpressure</b> stream को सबैभन्दा महत्वपूर्ण विचार हो र छाड्न सबैभन्दा सजिलो पनि।\n\nमानौं producer ले 100 MB/s पठाउँछ र consumer ले 10 MB/s सम्हाल्छ। हरेक सेकेन्ड थपिने 90 MB कतै जानुपर्छ, र समन्वय नभए यो memory मा थुप्रिन्छ र process ढल्छ:\n\n```text\nProducer\n  ↓\n100 MB/s\n  ↓\nConsumer\n  ↓\n10 MB/s\n\n\nmemory\n████████████████████████████████\n████████████████████████████████   अझै बढ्दै\n```\n\n---\n\n### 1. आधारभूत — संकेत\n\nStream ले consumer लाई \"अहिले होइन\" भन्न दिएर यो हल गर्छ। भित्री buffer भरिएपछि `write()` ले `false` फर्काउँछ:\n\n```javascript\nconst canContinue = writable.write(chunk);\n\nif (!canContinue) {\n  readable.pause();\n  writable.once(\"drain\", () => readable.resume());\n}\n```\n\n`drain` त्यो event हो जुन buffer थप लिन पुग्ने गरी खाली भएपछि बज्छ।\n\n```text\nProducer\n   ↓\n\"थप लिन सक्नुहुन्छ?\"\n   ↓\nConsumer\n   ↓\nसक्दिनँ  → रोक्नुहोस् / कुर्नुहोस्\nसक्छु    → जारी राख्नुहोस्\n```\n\n---\n\n### 2. मध्यम — `pipe()` ले पहिले नै गर्छ\n\nतपाईंले यो हातले विरलै लेख्नुहुन्छ, किनकि `pipe()` ले रोक्ने-चलाउने नाच आफैं सम्हाल्छ। `pipe()` ले राम्रोसँग <b>नसम्हाल्ने</b> कुरा असफलता हो: शृंखलाको एउटा stream मा error आए, अरू झुन्डिएकै रहन्छन्, खुला र memory ओगटेर।\n\n---\n\n### 3. उन्नत — `pipeline()`\n\nProduction का लागि `pipeline()` प्रयोग गर्नुहोस्। यसले उही शृंखला बनाउँछ तर error फैलाउँछ र एउटा असफल हुँदा हरेक stream नष्ट गर्छ:\n\n```javascript\nconst { pipeline } = require(\"stream/promises\");\nconst fs = require(\"fs\");\nconst zlib = require(\"zlib\");\n\nawait pipeline(\n  fs.createReadStream(\"input.txt\"),\n  zlib.createGzip(),\n  fs.createWriteStream(\"input.txt.gz\")\n);\n```\n\n```text\ninput.txt → Readable → Gzip Transform → Writable → input.txt.gz\n```\n\nPromise संस्करणले जहाँको असफलता पनि सामान्य `try/catch` बनाइदिन्छ, हरेक stream मा error listener राख्नुको सट्टा। यही नै यसलाई रोज्ने पूरा कारण हो:\n\n```text\n.pipe() शृंखला       एउटा stream मा error → बाँकी leak\npipeline()           एउटा stream मा error → सबै नष्ट\n```\n\nत्यसैले सबै buffer गर्नुभन्दा stream राम्रोसँग scale हुन्छन्: ढिलो पक्षलाई गति तय गर्न दिइन्छ।",
        jp: "<b>バックプレッシャー</b>はストリームで最も重要で、最も見過ごされやすい考え方だ。\n\n生産側が100 MB/sで送り、消費側が10 MB/sしか捌けないとする。毎秒あふれる90 MBはどこかへ行くしかなく、調整がなければメモリに積み上がり、やがてプロセスが倒れる:\n\n```text\nProducer\n  ↓\n100 MB/s\n  ↓\nConsumer\n  ↓\n10 MB/s\n\n\nmemory\n████████████████████████████████\n████████████████████████████████   まだ増える\n```\n\n---\n\n### 1. 基本 — 合図\n\nストリームは消費側に「まだ待って」と言わせて解く。内部バッファが満ちると `write()` は `false` を返す:\n\n```javascript\nconst canContinue = writable.write(chunk);\n\nif (!canContinue) {\n  readable.pause();\n  writable.once(\"drain\", () => readable.resume());\n}\n```\n\n`drain` は、また受け取れるだけバッファが空いたときに発火するイベントだ。\n\n```text\nProducer\n   ↓\n「まだ受け取れる?」\n   ↓\nConsumer\n   ↓\n無理 → 一時停止して待つ\n可   → 続ける\n```\n\n---\n\n### 2. 中級 — `pipe()` はすでにやっている\n\nこれを手で書くことはまずない。`pipe()` が一時停止と再開のやり取りを引き受けるからだ。`pipe()` がうまく<b>扱えない</b>のは失敗のほうで、連鎖の1つがエラーになると残りは宙ぶらりんのまま開き続け、メモリを抱える。\n\n---\n\n### 3. 上級 — `pipeline()`\n\n本番では `pipeline()` を使う。同じ連鎖を組みつつ、エラーを伝播させ、どれかが失敗すればすべてのストリームを破棄する:\n\n```javascript\nconst { pipeline } = require(\"stream/promises\");\nconst fs = require(\"fs\");\nconst zlib = require(\"zlib\");\n\nawait pipeline(\n  fs.createReadStream(\"input.txt\"),\n  zlib.createGzip(),\n  fs.createWriteStream(\"input.txt.gz\")\n);\n```\n\n```text\ninput.txt → Readable → Gzip Transform → Writable → input.txt.gz\n```\n\nPromise版なら、どこで失敗しても普通の `try/catch` で受けられる。各ストリームにエラーリスナーを付ける必要はない。これを選ぶ理由はそれに尽きる:\n\n```text\n.pipe() の連鎖    1つがエラー → 残りが漏れる\npipeline()        1つがエラー → すべて破棄される\n```\n\nすべてをバッファするよりストリームが良く伸びるのも、遅い側にペースを決めさせるからだ。",
      },
      diagram: `Without backpressure, the difference becomes memory

Producer  100 MB/s
Consumer   10 MB/s

memory
████████████████████████████████
████████████████████████████████   90 MB every second


With it, the slow side sets the pace

Producer
   ↓
"Can you accept more?"
   ↓
Consumer
   │
   ├── NO  → write() returns false → pause
   │                                   │
   │                          wait for "drain"
   │                                   │
   └── YES ────────────────────────► resume


Why pipeline() over a .pipe() chain

.pipe()                        pipeline()

read → gzip → write            read → gzip → write
        │                              │
     errors                         errors
        │                              │
        ▼                              ▼
 the other two stay open        all three destroyed
 and hold memory                and the error surfaces once`,
      codeExample: {
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
      keyTakeaways: [
        { en: "<b>Backpressure</b> stops a fast producer from overwhelming a slow consumer.", np: "<b>Backpressure</b> ले छिटो producer ले ढिलो consumer थिच्नबाट रोक्छ।", jp: "<b>バックプレッシャー</b>は速い生産側が遅い消費側を圧倒するのを防ぐ。" },
        { en: "`write()` returns <b>`false`</b> when the internal buffer is full.", np: "भित्री buffer भरिँदा `write()` ले <b>`false`</b> फर्काउँछ।", jp: "内部バッファが満ちると `write()` は<b>`false`</b> を返す。" },
        { en: "The <b>`drain`</b> event says the buffer has room again.", np: "<b>`drain`</b> event ले buffer मा फेरि ठाउँ छ भन्छ।", jp: "<b>`drain`</b> イベントはバッファに再び空きがあることを伝える。" },
        { en: "`pipe()` handles the pause-and-resume for you, but leaks the other streams on error.", np: "`pipe()` ले रोक्ने-चलाउने काम गर्छ, तर error मा अरू stream leak गर्छ।", jp: "`pipe()` は一時停止と再開を担うが、エラー時に他のストリームを漏らす。" },
        { en: "<b>`pipeline()`</b> propagates the error and destroys every stream in the chain.", np: "<b>`pipeline()`</b> ले error फैलाउँछ र शृंखलाका हरेक stream नष्ट गर्छ।", jp: "<b>`pipeline()`</b> はエラーを伝播し、連鎖のすべてを破棄する。" },
        { en: "The promise form turns a failure anywhere into an ordinary `try/catch`.", np: "Promise रूपले जहाँको असफलतालाई पनि सामान्य `try/catch` बनाउँछ।", jp: "Promise版は、どこでの失敗も普通の `try/catch` にする。" },
      ],
      commonMistakes: [
        { en: "<b>Calling `write()` in a loop without checking the result</b> — the buffer grows without limit and the memory graph climbs until the process dies.", np: "<b>नतिजा नजाँची loop मा `write()` बोलाउनु</b> — buffer असीमित बढ्छ र process नमरेसम्म memory चढ्छ।", jp: "<b>戻り値を見ずにループで `write()` を呼ぶ</b> — バッファは際限なく育ち、プロセスが死ぬまでメモリが増え続ける。" },
        { en: "<b>Chaining `.pipe()` in production</b> — it handles backpressure but not failure; one error leaves the remaining streams open.", np: "<b>Production मा `.pipe()` जोड्नु</b> — यसले backpressure सम्हाल्छ तर असफलता होइन; एउटा error ले बाँकी stream खुला छाड्छ।", jp: "<b>本番で `.pipe()` を繋ぐ</b> — バックプレッシャーは扱うが失敗は扱わない。1つのエラーで残りが開いたままになる。" },
        { en: "<b>Attaching an error listener to only the first stream</b> — a gzip or write failure is a separate event, and an unhandled one crashes the process.", np: "<b>पहिलो stream मा मात्र error listener राख्नु</b> — gzip वा write को असफलता छुट्टै event हो, र नसम्हालिएकोले process crash गर्छ।", jp: "<b>最初のストリームにだけエラーリスナーを付ける</b> — gzipや書き込みの失敗は別のイベントで、未処理ならプロセスが落ちる。" },
        { en: "<b>Assuming `pipeline()` retries</b> — it does not. It cleans up correctly and rejects; retrying is your job.", np: "<b>`pipeline()` ले फेरि प्रयास गर्छ भन्ने ठान्नु</b> — गर्दैन। यसले सही सफा गर्छ र reject गर्छ; फेरि प्रयास तपाईंको काम हो।", jp: "<b>`pipeline()` が再試行すると思う</b> — しない。正しく後始末して拒否するだけで、再試行は自分の仕事。" },
      ],
      quiz: [
        {
          question: { en: "Why does backpressure matter?", np: "Backpressure किन महत्वपूर्ण छ?", jp: "バックプレッシャーが重要な理由は?" },
          options: [
            { en: "It stops a fast producer from overwhelming a slow consumer", np: "यसले छिटो producer ले ढिलो consumer थिच्नबाट रोक्छ", jp: "速い生産側が遅い消費側を圧倒するのを防ぐから" },
            { en: "It encrypts the streamed data", np: "यसले stream भएको data encrypt गर्छ", jp: "流れるデータを暗号化するから" },
            { en: "It creates extra CPU threads", np: "यसले थप CPU thread बनाउँछ", jp: "追加のCPUスレッドを作るから" },
            { en: "It converts Buffers to strings", np: "यसले Buffer लाई string बनाउँछ", jp: "Bufferを文字列に変換するから" },
          ],
          correctIndex: 0,
          explanation: { en: "Without it the difference in rate piles up in memory until the process falls over.", np: "यो नभए गतिको फरक memory मा थुप्रिन्छ र process ढल्छ।", jp: "無ければ速度差がメモリに積み上がり、プロセスが倒れる。" },
        },
        {
          question: { en: "What does `writable.write(chunk)` return when the buffer is full?", np: "Buffer भरिँदा `writable.write(chunk)` ले के फर्काउँछ?", jp: "バッファが満ちているとき `writable.write(chunk)` は何を返すか?" },
          options: [
            { en: "`true`", np: "`true`", jp: "`true`" },
            { en: "`false`", np: "`false`", jp: "`false`" },
            { en: "The number of bytes written", np: "लेखिएको byte संख्या", jp: "書き込んだバイト数" },
          ],
          correctIndex: 1,
          explanation: { en: "Pause the readable and wait for the `drain` event.", np: "Readable रोक्नुहोस् र `drain` event कुर्नुहोस्।", jp: "readableを止め、`drain` イベントを待つ。" },
        },
        {
          question: { en: "What does the `drain` event mean?", np: "`drain` event को अर्थ के हो?", jp: "`drain` イベントの意味は?" },
          options: [
            { en: "The stream has finished", np: "Stream सकियो", jp: "ストリームが終わった" },
            { en: "An error occurred", np: "Error भयो", jp: "エラーが起きた" },
            { en: "The buffer has emptied enough to accept more data", np: "Buffer थप data लिन पुग्ने गरी खाली भयो", jp: "バッファがまた受け取れるだけ空いた" },
          ],
          correctIndex: 2,
          explanation: { en: "That is the cue to resume the readable side.", np: "यो readable पक्ष फेरि चलाउने संकेत हो।", jp: "それがreadable側を再開させる合図。" },
        },
        {
          question: { en: "Why prefer `pipeline()` over chaining `.pipe()`?", np: "`.pipe()` जोड्नुभन्दा `pipeline()` किन रोज्ने?", jp: "`.pipe()` の連結より `pipeline()` を選ぶ理由は?" },
          options: [
            { en: "It is faster at copying bytes", np: "यो byte copy गर्न छिटो छ", jp: "バイトのコピーが速いから" },
            { en: "It compresses the output automatically", np: "यसले output स्वतः compress गर्छ", jp: "出力を自動で圧縮するから" },
            { en: "It propagates the error and destroys every stream in the chain", np: "यसले error फैलाउँछ र शृंखलाका हरेक stream नष्ट गर्छ", jp: "エラーを伝播し、連鎖のすべてを破棄するから" },
          ],
          correctIndex: 2,
          explanation: { en: "A bare `.pipe()` leaves the remaining streams open when one errors.", np: "खाली `.pipe()` मा एउटामा error आए बाँकी stream खुला रहन्छन्।", jp: "素の `.pipe()` は、1つがエラーになると残りを開いたままにする。" },
        },
        {
          question: { en: "What does the promise form of `pipeline()` let you use?", np: "`pipeline()` को promise रूपले के प्रयोग गर्न दिन्छ?", jp: "`pipeline()` のPromise版で使えるようになるのは?" },
          options: [
            { en: "Automatic retries", np: "स्वतः retry", jp: "自動リトライ" },
            { en: "An ordinary `try/catch` around the whole chain", np: "पूरै शृंखला वरिपरि सामान्य `try/catch`", jp: "連鎖全体を囲む普通の `try/catch`" },
            { en: "Parallel execution of every stream", np: "हरेक stream समानान्तर execution", jp: "全ストリームの並列実行" },
          ],
          correctIndex: 1,
          explanation: { en: "One place for failures, instead of a listener on each stream.", np: "हरेक stream मा listener राख्नुको सट्टा असफलताको एउटै ठाउँ।", jp: "各ストリームにリスナーを置く代わりに、失敗の窓口がひとつになる。" },
        },
      ],
    },
    {
      id: "buffers",
      title: { en: "Buffer — raw binary data", np: "Buffer — कच्चा binary data", jp: "Buffer — 生のバイナリデータ" },
      durationMinutes: 8,
      explanation: {
        en: "A <b>Buffer</b> is Node's way of holding raw bytes. Strings model text; buffers model the actual octets — the individual 8-bit values that make up a file on disk or a packet on the wire.\n\n```javascript\nconst buffer = Buffer.from(\"Hello\");\n\nconsole.log(buffer);      // <Buffer 48 65 6c 6c 6f>\nconsole.log(buffer[0]);   // 72, the UTF-8 byte for \"H\"\n```\n\nYou need them for files, images, video, TCP sockets, cryptography and any binary protocol.\n\n---\n\n### 1. Basic — creating one\n\n```javascript\nBuffer.from(\"Hello\", \"utf8\");           // from a string\nBuffer.from([72, 101, 108, 108, 111]);  // from bytes\nBuffer.alloc(10);                        // 10 zeroed bytes\n```\n\n`Buffer.alloc()` fills the memory with zeros, which matters: the older `allocUnsafe()` hands back whatever was in that memory before.\n\n---\n\n### 2. Intermediate — encodings\n\nThe same bytes can be read several ways:\n\n```javascript\nconst buffer = Buffer.from(\"Hello\");\n\nbuffer.toString(\"utf8\");     // \"Hello\"\nbuffer.toString(\"hex\");      // \"48656c6c6f\"\nbuffer.toString(\"base64\");   // \"SGVsbG8=\"\n```\n\nand decoded back:\n\n```javascript\nBuffer.from(\"SGVsbG8=\", \"base64\").toString(\"utf8\");   // \"Hello\"\n```\n\n---\n\n### 3. Advanced — the length trap\n\nThis is where buffers bite:\n\n```javascript\n\"👍\".length;                  // 2\nBuffer.from(\"👍\").length;     // 4\n```\n\nA JavaScript string counts <b>UTF-16 code units</b>. A buffer counts <b>UTF-8 bytes</b>. Those are two different numbers, and neither one is the number of characters a person would count.\n\n```text\nJavaScript String  →  UTF-16 code units\nBuffer             →  raw bytes\n\ncharacters ≠ code units ≠ bytes\n```\n\nGet this wrong when slicing and you cut a multi-byte character in half, producing corruption that only shows up for non-ASCII input.\n\n---\n\n### Reassembling chunks\n\nCollecting streamed binary data usually ends with:\n\n```javascript\nconst result = Buffer.concat([Buffer.from(\"Hello \"), Buffer.from(\"World\")]);\n\nresult.toString();   // \"Hello World\"\n```\n\nUse it knowingly, though. Buffering every chunk before doing anything recreates exactly the memory problem streams existed to avoid. If the data can be processed incrementally, process it incrementally.",
        np: "<b>Buffer</b> Node मा कच्चा byte राख्ने तरिका हो। String ले text को model बनाउँछ; buffer ले वास्तविक octet — disk मा file वा तारमा packet बनाउने अलग-अलग 8-bit मान।\n\n```javascript\nconst buffer = Buffer.from(\"Hello\");\n\nconsole.log(buffer);      // <Buffer 48 65 6c 6c 6f>\nconsole.log(buffer[0]);   // 72, \"H\" को UTF-8 byte\n```\n\nFile, image, video, TCP socket, cryptography र कुनै पनि binary protocol का लागि यी चाहिन्छन्।\n\n---\n\n### 1. आधारभूत — बनाउनु\n\n```javascript\nBuffer.from(\"Hello\", \"utf8\");           // string बाट\nBuffer.from([72, 101, 108, 108, 111]);  // byte बाट\nBuffer.alloc(10);                        // 10 शून्य byte\n```\n\n`Buffer.alloc()` ले memory शून्यले भर्छ, जुन महत्वपूर्ण छ: पुरानो `allocUnsafe()` ले त्यो memory मा पहिले जे थियो त्यही दिन्छ।\n\n---\n\n### 2. मध्यम — encoding\n\nउही byte धेरै तरिकाले पढ्न सकिन्छ:\n\n```javascript\nconst buffer = Buffer.from(\"Hello\");\n\nbuffer.toString(\"utf8\");     // \"Hello\"\nbuffer.toString(\"hex\");      // \"48656c6c6f\"\nbuffer.toString(\"base64\");   // \"SGVsbG8=\"\n```\n\nर फिर्ता decode:\n\n```javascript\nBuffer.from(\"SGVsbG8=\", \"base64\").toString(\"utf8\");   // \"Hello\"\n```\n\n---\n\n### 3. उन्नत — लम्बाइको जाल\n\nBuffer ले यहीँ टोक्छ:\n\n```javascript\n\"👍\".length;                  // 2\nBuffer.from(\"👍\").length;     // 4\n```\n\nJavaScript string ले <b>UTF-16 code unit</b> गन्छ। Buffer ले <b>UTF-8 byte</b>। यी दुई फरक संख्या हुन्, र कुनै पनि मान्छेले गन्ने character संख्या होइन।\n\n```text\nJavaScript String  →  UTF-16 code unit\nBuffer             →  कच्चा byte\n\ncharacter ≠ code unit ≠ byte\n```\n\nSlice गर्दा यो बिगारे, बहु-byte character आधामा काटिन्छ, र non-ASCII input मा मात्र देखिने corruption बन्छ।\n\n---\n\n### Chunk फेरि जोड्नु\n\nStream भएको binary data जम्मा गर्ने काम प्रायः यसरी टुंगिन्छ:\n\n```javascript\nconst result = Buffer.concat([Buffer.from(\"Hello \"), Buffer.from(\"World\")]);\n\nresult.toString();   // \"Hello World\"\n```\n\nतर जानीबुझी प्रयोग गर्नुहोस्। केही गर्नुअघि हरेक chunk buffer गर्नु भनेको stream ले जोगाउन खोजेकै memory समस्या फेरि ल्याउनु हो। Data क्रमशः process गर्न सकिन्छ भने, क्रमशः नै गर्नुहोस्।",
        jp: "<b>Buffer</b> はNodeが生のバイトを保持する手段だ。文字列はテキストを模し、バッファは実際のオクテット、つまりディスク上のファイルや回線上のパケットを構成する8ビットの値そのものを模す。\n\n```javascript\nconst buffer = Buffer.from(\"Hello\");\n\nconsole.log(buffer);      // <Buffer 48 65 6c 6c 6f>\nconsole.log(buffer[0]);   // 72、\"H\" のUTF-8バイト\n```\n\nファイル・画像・動画・TCPソケット・暗号・あらゆるバイナリプロトコルで必要になる。\n\n---\n\n### 1. 基本 — 作る\n\n```javascript\nBuffer.from(\"Hello\", \"utf8\");           // 文字列から\nBuffer.from([72, 101, 108, 108, 111]);  // バイト列から\nBuffer.alloc(10);                        // ゼロで埋めた10バイト\n```\n\n`Buffer.alloc()` はメモリをゼロで埋める。これは重要で、古い `allocUnsafe()` はそのメモリに以前あった内容をそのまま返す。\n\n---\n\n### 2. 中級 — エンコーディング\n\n同じバイト列は何通りにも読める:\n\n```javascript\nconst buffer = Buffer.from(\"Hello\");\n\nbuffer.toString(\"utf8\");     // \"Hello\"\nbuffer.toString(\"hex\");      // \"48656c6c6f\"\nbuffer.toString(\"base64\");   // \"SGVsbG8=\"\n```\n\n復号も同様:\n\n```javascript\nBuffer.from(\"SGVsbG8=\", \"base64\").toString(\"utf8\");   // \"Hello\"\n```\n\n---\n\n### 3. 上級 — 長さの罠\n\nバッファが噛みつくのはここだ:\n\n```javascript\n\"👍\".length;                  // 2\nBuffer.from(\"👍\").length;     // 4\n```\n\nJavaScriptの文字列は<b>UTF-16のコード単位</b>を数え、バッファは<b>UTF-8のバイト</b>を数える。これは別々の数であり、どちらも人が数える文字数ではない。\n\n```text\nJavaScript String  →  UTF-16のコード単位\nBuffer             →  生のバイト\n\n文字 ≠ コード単位 ≠ バイト\n```\n\nスライスでこれを誤ると、複数バイトの文字が半分に切られ、非ASCIIの入力でだけ現れる破損になる。\n\n---\n\n### チャンクを組み直す\n\nストリームで届いたバイナリの収集は、たいていこう終わる:\n\n```javascript\nconst result = Buffer.concat([Buffer.from(\"Hello \"), Buffer.from(\"World\")]);\n\nresult.toString();   // \"Hello World\"\n```\n\nただし承知のうえで使うこと。何かをする前に全チャンクをためるのは、ストリームが避けようとしたメモリ問題を呼び戻すのと同じだ。逐次処理できるなら逐次処理する。",
      },
      diagram: `A string and a buffer count different things

"👍"
 │
 ├── as a JavaScript string   .length = 2   (UTF-16 code units)
 └── as a Buffer              .length = 4   (UTF-8 bytes)

characters  ≠  code units  ≠  bytes


One buffer, several readings

Buffer.from("Hello")
        │
   ┌────┼────────┬──────────┐
   ▼    ▼        ▼          ▼
 utf8  hex     base64    raw bytes
"Hello" "48656c6c6f" "SGVsbG8=" 48 65 6c 6c 6f


Concat undoes the streaming

chunk + chunk + chunk
        │
        ▼
  Buffer.concat()
        │
        ▼
 the whole thing in memory again

fine for a small result, self-defeating for a large one`,
      codeExample: {
        title: { en: "Creating, encoding and slicing bytes", np: "Byte बनाउनु, encode गर्नु र काट्नु", jp: "バイトの生成・符号化・切り出し" },
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
      keyTakeaways: [
        { en: "A <b>Buffer</b> holds raw bytes, which is what files, sockets and binary protocols actually contain.", np: "<b>Buffer</b> ले कच्चा byte राख्छ, जुन file, socket र binary protocol मा वास्तवमा हुन्छ।", jp: "<b>Buffer</b> は生のバイトを保持する。ファイル・ソケット・バイナリプロトコルの中身そのもの。" },
        { en: "`Buffer.from()` builds one from a string or a byte array; `Buffer.alloc()` gives zeroed memory.", np: "`Buffer.from()` ले string वा byte array बाट बनाउँछ; `Buffer.alloc()` ले शून्य भरिएको memory दिन्छ।", jp: "`Buffer.from()` は文字列やバイト配列から作り、`Buffer.alloc()` はゼロ埋めのメモリを返す。" },
        { en: "The same bytes read as `utf8`, `hex` or `base64` depending on what you ask for.", np: "उही byte तपाईंले मागेअनुसार `utf8`, `hex` वा `base64` भएर पढिन्छ।", jp: "同じバイト列は、求め方次第で `utf8`・`hex`・`base64` として読める。" },
        { en: "Buffer length is measured in <b>bytes</b>, string length in <b>UTF-16 code units</b>.", np: "Buffer को लम्बाइ <b>byte</b> मा, string को <b>UTF-16 code unit</b> मा नापिन्छ।", jp: "バッファの長さは<b>バイト</b>、文字列の長さは<b>UTF-16のコード単位</b>で測る。" },
        { en: "`\"👍\".length` is 2 and `Buffer.from(\"👍\").length` is 4 — neither is the character count.", np: "`\"👍\".length` 2 हो र `Buffer.from(\"👍\").length` 4 — कुनै पनि character गन्ती होइन।", jp: "`\"👍\".length` は2、`Buffer.from(\"👍\").length` は4。どちらも文字数ではない。" },
        { en: "`Buffer.concat()` rebuilds the whole value, which undoes the benefit of streaming it.", np: "`Buffer.concat()` ले पूरै मान फेरि बनाउँछ, जसले stream गर्नुको फाइदा खेर फाल्छ।", jp: "`Buffer.concat()` は値全体を組み直すので、ストリームにした利点を打ち消す。" },
      ],
      commonMistakes: [
        { en: "<b>Slicing a buffer at a character count</b> — cutting at a byte offset that falls inside a multi-byte character corrupts it, and only for non-ASCII input.", np: "<b>Character गन्तीमा buffer काट्नु</b> — बहु-byte character भित्र पर्ने byte offset मा काट्दा त्यो बिग्रन्छ, र non-ASCII input मा मात्र।", jp: "<b>文字数でバッファを切る</b> — 複数バイト文字の内側のバイト位置で切ると壊れる。しかも非ASCIIのときだけ。" },
        { en: "<b>Assuming `.length` means characters</b> — a string gives code units and a buffer gives bytes; neither answers \"how many characters\".", np: "<b>`.length` को अर्थ character हो भन्ने ठान्नु</b> — string ले code unit र buffer ले byte दिन्छ; कुनैले पनि \"कति character\" को जवाफ दिँदैन।", jp: "<b>`.length` を文字数だと思う</b> — 文字列はコード単位、バッファはバイトを返す。どちらも「何文字か」には答えない。" },
        { en: "<b>Collecting every chunk with `Buffer.concat()`</b> — for a large payload it puts the whole thing back in memory, which is what the stream was avoiding.", np: "<b>`Buffer.concat()` ले हरेक chunk जम्मा गर्नु</b> — ठूलो payload मा यसले पूरै फेरि memory मा राख्छ, जुन stream ले जोगाउँदै थियो।", jp: "<b>`Buffer.concat()` で全チャンクを集める</b> — 大きなペイロードでは全体をメモリに戻す。ストリームが避けていたことそのもの。" },
        { en: "<b>Using `allocUnsafe()` without overwriting it</b> — the returned memory can still contain whatever was there before, which may be another request's data.", np: "<b>`allocUnsafe()` प्रयोग गरी नलेख्नु</b> — फर्केको memory मा पहिले जे थियो त्यही हुन सक्छ, जुन अर्को request को data पनि हुन सक्छ।", jp: "<b>`allocUnsafe()` を上書きせずに使う</b> — 返るメモリには以前の内容が残りうる。別のリクエストのデータかもしれない。" },
      ],
      quiz: [
        {
          question: { en: "What does a Node `Buffer` represent?", np: "Node को `Buffer` ले के जनाउँछ?", jp: "Nodeの `Buffer` は何を表すか?" },
          options: [
            { en: "JavaScript objects", np: "JavaScript object", jp: "JavaScriptのオブジェクト" },
            { en: "Raw binary bytes", np: "कच्चा binary byte", jp: "生のバイナリのバイト列" },
            { en: "Promises", np: "Promise", jp: "Promise" },
            { en: "DOM elements", np: "DOM element", jp: "DOM要素" },
          ],
          correctIndex: 1,
          explanation: { en: "That is what files, sockets and binary protocols actually contain.", np: "File, socket र binary protocol मा वास्तवमा त्यही हुन्छ।", jp: "ファイル・ソケット・バイナリプロトコルの中身がそれ。" },
        },
        {
          question: { en: "What are `\"👍\".length` and `Buffer.from(\"👍\").length`?", np: "`\"👍\".length` र `Buffer.from(\"👍\").length` के हुन्?", jp: "`\"👍\".length` と `Buffer.from(\"👍\").length` はいくつか?" },
          options: [
            { en: "2 and 4", np: "2 र 4", jp: "2と4" },
            { en: "1 and 1", np: "1 र 1", jp: "1と1" },
            { en: "4 and 2", np: "4 र 2", jp: "4と2" },
          ],
          correctIndex: 0,
          explanation: { en: "The string counts UTF-16 code units; the buffer counts UTF-8 bytes.", np: "String ले UTF-16 code unit गन्छ; buffer ले UTF-8 byte।", jp: "文字列はUTF-16のコード単位、バッファはUTF-8のバイトを数える。" },
        },
        {
          question: { en: "Which produces `\"48656c6c6f\"` from `Buffer.from(\"Hello\")`?", np: "`Buffer.from(\"Hello\")` बाट `\"48656c6c6f\"` कुनले दिन्छ?", jp: "`Buffer.from(\"Hello\")` から `\"48656c6c6f\"` を得るのは?" },
          options: [
            { en: "`buffer.toString(\"utf8\")`", np: "`buffer.toString(\"utf8\")`", jp: "`buffer.toString(\"utf8\")`" },
            { en: "`buffer.toString(\"base64\")`", np: "`buffer.toString(\"base64\")`", jp: "`buffer.toString(\"base64\")`" },
            { en: "`buffer.toString(\"hex\")`", np: "`buffer.toString(\"hex\")`", jp: "`buffer.toString(\"hex\")`" },
          ],
          correctIndex: 2,
          explanation: { en: "`base64` gives `\"SGVsbG8=\"` and `utf8` gives back `\"Hello\"`.", np: "`base64` ले `\"SGVsbG8=\"` र `utf8` ले `\"Hello\"` दिन्छ।", jp: "`base64` は `\"SGVsbG8=\"`、`utf8` は `\"Hello\"` を返す。" },
        },
        {
          question: { en: "Why is `Buffer.alloc(10)` safer than `Buffer.allocUnsafe(10)`?", np: "`Buffer.allocUnsafe(10)` भन्दा `Buffer.alloc(10)` किन सुरक्षित छ?", jp: "`Buffer.allocUnsafe(10)` より `Buffer.alloc(10)` が安全なのはなぜか?" },
          options: [
            { en: "It zeroes the memory, so old contents cannot leak through", np: "यसले memory शून्य पार्छ, त्यसैले पुरानो सामग्री चुहिन सक्दैन", jp: "メモリをゼロで埋めるので、以前の内容が漏れないから" },
            { en: "It is faster", np: "यो छिटो छ", jp: "速いから" },
            { en: "It allocates less memory", np: "यसले कम memory छुट्याउँछ", jp: "確保するメモリが少ないから" },
          ],
          correctIndex: 0,
          explanation: { en: "Unsafe allocation can hand back whatever was in that memory before.", np: "Unsafe allocation ले त्यो memory मा पहिले जे थियो त्यही दिन सक्छ।", jp: "unsafeな確保は、そのメモリに以前あった内容を返しうる。" },
        },
        {
          question: { en: "When is `Buffer.concat()` a bad idea?", np: "`Buffer.concat()` कहिले नराम्रो विचार हो?", jp: "`Buffer.concat()` が良くないのはどんなときか?" },
          options: [
            { en: "When the data is small", np: "Data सानो हुँदा", jp: "データが小さいとき" },
            { en: "When the payload is large, because it puts the whole thing back in memory", np: "Payload ठूलो हुँदा, किनकि यसले पूरै फेरि memory मा राख्छ", jp: "ペイロードが大きいとき。全体をメモリに戻してしまうから" },
            { en: "When the chunks are the same length", np: "Chunk उही लम्बाइका हुँदा", jp: "チャンクの長さが同じとき" },
          ],
          correctIndex: 1,
          explanation: { en: "That recreates exactly the problem streaming was there to avoid.", np: "यसले stream ले जोगाउन खोजेकै समस्या फेरि ल्याउँछ।", jp: "ストリームが避けていた問題をそのまま呼び戻す。" },
        },
      ],
    },
    {
      id: "workers-and-processes",
      title: { en: "Worker threads and child processes", np: "Worker thread र child process", jp: "ワーカースレッドと子プロセス" },
      durationMinutes: 9,
      explanation: {
        en: "Node runs your JavaScript on the <b>event-loop thread</b>. That is ideal while it waits on I/O and disastrous while it computes: a long synchronous calculation blocks the loop, and every pending request queues behind it.\n\n```javascript\nwhile (true) {\n  // the event loop is now stuck here\n}\n```\n\nTwo escapes exist, and they are not interchangeable.\n\n---\n\n### 1. Basic — worker threads\n\nA <b>worker thread</b> runs JavaScript on another thread inside the <b>same process</b>:\n\n```javascript\n// worker.js\nconst { parentPort, workerData } = require(\"worker_threads\");\n\nconst result = workerData.numbers.reduce((sum, n) => sum + n, 0);\n\nparentPort.postMessage(result);\n```\n\n```javascript\nconst { Worker } = require(\"worker_threads\");\n\nconst worker = new Worker(\"./worker.js\", {\n  workerData: { numbers: [1, 2, 3, 4, 5] }\n});\n\nworker.on(\"message\", result => console.log(result));\nworker.on(\"error\", error => console.error(error));\n```\n\n```text\nMain Thread\n     │ workerData\n     ▼\nWorker Thread\n     │ postMessage()\n     ▼\nMain Thread\n```\n\n---\n\n### 2. Intermediate — child processes\n\nA <b>child process</b> is a separate operating-system process with its own memory. `fork()` starts another Node process with a built-in message channel:\n\n```javascript\nconst { fork } = require(\"child_process\");\n\nconst child = fork(\"./worker.js\");\n\nchild.send({ numbers: [1, 2, 3, 4, 5] });\nchild.on(\"message\", message => console.log(message.result));\n```\n\nTwo more ways to start something external:\n\n```text\nexec()    buffers the whole output    fine for `git --version`\nspawn()   streams the output          right for large or long-running output\n```\n\n`exec()` collecting gigabytes into memory is a classic production incident. If the output is big, `spawn()` and read the stream.\n\n---\n\n### 3. Advanced — choosing\n\n```text\n                 WORK\n                   │\n        ┌──────────┴──────────┐\n        ↓                     ↓\n      I/O                    CPU\n        │                     │\n   ┌────┴────┐           ┌────┴────┐\n   ↓         ↓           ↓         ↓\nDatabase   Network     Worker    Child\nFiles                  Thread   Process\n   │\n   ↓\nStreams for large data\n```\n\n```text\nDatabase or API call        →  async/await\nLarge file                  →  stream\nBinary data                 →  Buffer\nCPU-heavy JavaScript        →  worker thread\nExternal executable         →  spawn()\nSmall shell command         →  exec()\nAnother Node app over IPC   →  fork()\n```\n\n<b>Do not spawn a worker for I/O.</b> `await fetch(url)` and `await db.query(...)` are already non-blocking; a worker adds startup cost and message-passing overhead for nothing.\n\n---\n\n### Concurrency is not parallelism\n\n```text\nAsync I/O        →  concurrency\n                    many operations in flight, one JavaScript thread\n\nWorker threads   →  parallelism\n                    JavaScript genuinely running on several threads\n```\n\nNode handles thousands of concurrent connections without running JavaScript for all of them at once. Workers are what you reach for when the <b>JavaScript itself</b> is the bottleneck.",
        np: "Node ले तपाईंको JavaScript <b>event-loop thread</b> मा चलाउँछ। I/O कुर्दा यो उत्तम र गणना गर्दा विनाशकारी हुन्छ: लामो synchronous गणनाले loop रोक्छ, र बाँकी हरेक request त्यसैको पछाडि लाइनमा बस्छ।\n\n```javascript\nwhile (true) {\n  // event loop अब यहीँ अड्कियो\n}\n```\n\nदुई उपाय छन्, र ती साटासाट गर्न मिल्दैनन्।\n\n---\n\n### 1. आधारभूत — worker thread\n\n<b>Worker thread</b> ले <b>उही process</b> भित्रको अर्को thread मा JavaScript चलाउँछ:\n\n```javascript\n// worker.js\nconst { parentPort, workerData } = require(\"worker_threads\");\n\nconst result = workerData.numbers.reduce((sum, n) => sum + n, 0);\n\nparentPort.postMessage(result);\n```\n\n```javascript\nconst { Worker } = require(\"worker_threads\");\n\nconst worker = new Worker(\"./worker.js\", {\n  workerData: { numbers: [1, 2, 3, 4, 5] }\n});\n\nworker.on(\"message\", result => console.log(result));\nworker.on(\"error\", error => console.error(error));\n```\n\n```text\nMain Thread\n     │ workerData\n     ▼\nWorker Thread\n     │ postMessage()\n     ▼\nMain Thread\n```\n\n---\n\n### 2. मध्यम — child process\n\n<b>Child process</b> आफ्नै memory भएको छुट्टै operating-system process हो। `fork()` ले भित्रैको message channel सहित अर्को Node process सुरु गर्छ:\n\n```javascript\nconst { fork } = require(\"child_process\");\n\nconst child = fork(\"./worker.js\");\n\nchild.send({ numbers: [1, 2, 3, 4, 5] });\nchild.on(\"message\", message => console.log(message.result));\n```\n\nबाहिरी केही सुरु गर्ने थप दुई तरिका:\n\n```text\nexec()    पूरै output buffer गर्छ    `git --version` लाई ठीकै\nspawn()   output stream गर्छ         ठूलो वा लामो output लाई सही\n```\n\n`exec()` ले gigabyte memory मा जम्मा गर्नु classic production घटना हो। Output ठूलो छ भने, `spawn()` गरी stream पढ्नुहोस्।\n\n---\n\n### 3. उन्नत — छनोट\n\n```text\n                 WORK\n                   │\n        ┌──────────┴──────────┐\n        ↓                     ↓\n      I/O                    CPU\n        │                     │\n   ┌────┴────┐           ┌────┴────┐\n   ↓         ↓           ↓         ↓\nDatabase   Network     Worker    Child\nFiles                  Thread   Process\n   │\n   ↓\nठूलो data लाई stream\n```\n\n```text\nDatabase वा API call        →  async/await\nठूलो file                   →  stream\nBinary data                 →  Buffer\nCPU-भारी JavaScript         →  worker thread\nबाहिरी executable           →  spawn()\nसानो shell command          →  exec()\nIPC मार्फत अर्को Node app    →  fork()\n```\n\n<b>I/O का लागि worker नचलाउनुहोस्।</b> `await fetch(url)` र `await db.query(...)` पहिले नै non-blocking छन्; worker ले बेकारमा सुरुवाती लागत र message-passing भार थप्छ।\n\n---\n\n### Concurrency parallelism होइन\n\n```text\nAsync I/O        →  concurrency\n                    धेरै operation चलिरहेका, एउटै JavaScript thread\n\nWorker thread    →  parallelism\n                    JavaScript साँच्चै धेरै thread मा चलिरहेको\n```\n\nNode ले हजारौं समानान्तर connection सम्हाल्छ, सबैका लागि JavaScript एकैचोटि नचलाई। <b>JavaScript आफैं</b> अवरोध हुँदा worker तिर हात बढाउनुहोस्।",
        jp: "NodeはJavaScriptを<b>イベントループのスレッド</b>で走らせる。I/Oを待つ間は理想的だが、計算している間は致命的だ。長い同期計算はループを塞ぎ、保留中の要求はその後ろに並ぶ。\n\n```javascript\nwhile (true) {\n  // イベントループはここで止まる\n}\n```\n\n逃げ道は2つあり、互いに置き換えは効かない。\n\n---\n\n### 1. 基本 — ワーカースレッド\n\n<b>ワーカースレッド</b>は<b>同じプロセス</b>内の別スレッドでJavaScriptを走らせる:\n\n```javascript\n// worker.js\nconst { parentPort, workerData } = require(\"worker_threads\");\n\nconst result = workerData.numbers.reduce((sum, n) => sum + n, 0);\n\nparentPort.postMessage(result);\n```\n\n```javascript\nconst { Worker } = require(\"worker_threads\");\n\nconst worker = new Worker(\"./worker.js\", {\n  workerData: { numbers: [1, 2, 3, 4, 5] }\n});\n\nworker.on(\"message\", result => console.log(result));\nworker.on(\"error\", error => console.error(error));\n```\n\n```text\nMain Thread\n     │ workerData\n     ▼\nWorker Thread\n     │ postMessage()\n     ▼\nMain Thread\n```\n\n---\n\n### 2. 中級 — 子プロセス\n\n<b>子プロセス</b>は独自メモリを持つ別のOSプロセスだ。`fork()` はメッセージ経路を備えた別のNodeプロセスを起こす:\n\n```javascript\nconst { fork } = require(\"child_process\");\n\nconst child = fork(\"./worker.js\");\n\nchild.send({ numbers: [1, 2, 3, 4, 5] });\nchild.on(\"message\", message => console.log(message.result));\n```\n\n外部のものを起こす手段はほかに2つ:\n\n```text\nexec()    出力を丸ごとバッファ    `git --version` には十分\nspawn()   出力を流す              大きい・長い出力に適する\n```\n\n`exec()` がギガバイトをメモリに溜めるのは、古典的な本番事故だ。出力が大きいなら `spawn()` してストリームを読む。\n\n---\n\n### 3. 上級 — 選び方\n\n```text\n                 WORK\n                   │\n        ┌──────────┴──────────┐\n        ↓                     ↓\n      I/O                    CPU\n        │                     │\n   ┌────┴────┐           ┌────┴────┐\n   ↓         ↓           ↓         ↓\nDatabase   Network     Worker    Child\nFiles                  Thread   Process\n   │\n   ↓\n大きなデータにはストリーム\n```\n\n```text\nDBやAPIの呼び出し           →  async/await\n大きなファイル              →  ストリーム\nバイナリ                    →  Buffer\nCPUを食うJavaScript         →  ワーカースレッド\n外部の実行ファイル          →  spawn()\n小さなシェルコマンド        →  exec()\nIPC経由の別Nodeアプリ       →  fork()\n```\n\n<b>I/Oのためにワーカーを起こさないこと。</b>`await fetch(url)` も `await db.query(...)` もすでに非ブロッキングで、ワーカーは起動コストとメッセージ受け渡しの負荷を無駄に足すだけだ。\n\n---\n\n### 並行性は並列性ではない\n\n```text\n非同期I/O        →  並行性\n                    多数の処理が進行中、JavaScriptは1スレッド\n\nワーカースレッド →  並列性\n                    JavaScriptが本当に複数スレッドで動く\n```\n\nNodeは数千の同時接続を捌くが、そのすべてでJavaScriptを同時に走らせているわけではない。ワーカーに手を伸ばすのは、<b>JavaScript自体</b>がボトルネックのときだ。",
      },
      diagram: `Same process, or a separate one

Worker Threads                   Child Processes

  Node process                    Process A      Process B
   ┌────┴────┐                        │              │
   ↓         ↓                     Memory A       Memory B
 Main     Worker                      │              │
 Thread   Thread                      └──── IPC ─────┘
   │         │
   └ shared memory possible       strong isolation
     via SharedArrayBuffer        a crash stays contained


exec versus spawn

exec("git --version")            spawn("some-huge-output")
      │                                 │
      ▼                                 ▼
 output buffered                  output streamed
 fine when small                  right when large


Picking by the shape of the work

I/O    →  async/await, streams for large data
CPU    →  worker thread
binary →  Buffer
external program  →  spawn()
another Node app  →  fork()`,
      codeExample: {
        title: { en: "Workers, forks and external processes", np: "Worker, fork र बाहिरी process", jp: "ワーカー・fork・外部プロセス" },
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
      keyTakeaways: [
        { en: "Node runs JavaScript on the <b>event-loop thread</b>; a long computation blocks every pending request.", np: "Node ले JavaScript <b>event-loop thread</b> मा चलाउँछ; लामो गणनाले बाँकी हरेक request रोक्छ।", jp: "NodeはJavaScriptを<b>イベントループのスレッド</b>で走らせる。長い計算は保留中の全要求を塞ぐ。" },
        { en: "A <b>worker thread</b> runs JavaScript on another thread inside the same process.", np: "<b>Worker thread</b> ले उही process भित्रको अर्को thread मा JavaScript चलाउँछ।", jp: "<b>ワーカースレッド</b>は同じプロセス内の別スレッドでJavaScriptを走らせる。" },
        { en: "A <b>child process</b> is a separate OS process with its own memory and stronger isolation.", np: "<b>Child process</b> आफ्नै memory र बलियो अलगाव भएको छुट्टै OS process हो।", jp: "<b>子プロセス</b>は独自メモリを持つ別のOSプロセスで、隔離が強い。" },
        { en: "`exec()` <b>buffers</b> the output; `spawn()` <b>streams</b> it, which is what large output needs.", np: "`exec()` ले output <b>buffer</b> गर्छ; `spawn()` ले <b>stream</b>, जुन ठूलो output लाई चाहिन्छ।", jp: "`exec()` は出力を<b>バッファ</b>し、`spawn()` は<b>流す</b>。大きな出力には後者。" },
        { en: "`fork()` starts another Node process with a built-in message channel.", np: "`fork()` ले भित्रैको message channel सहित अर्को Node process सुरु गर्छ।", jp: "`fork()` はメッセージ経路を備えた別のNodeプロセスを起こす。" },
        { en: "Workers are for <b>CPU-bound</b> JavaScript; I/O is already non-blocking without them.", np: "Worker <b>CPU-bound</b> JavaScript का लागि हुन्; I/O तिनीबिना नै non-blocking छ।", jp: "ワーカーは<b>CPUバウンド</b>のJavaScript向け。I/Oは無しでも非ブロッキング。" },
        { en: "Async I/O gives <b>concurrency</b>; worker threads give actual <b>parallel</b> JavaScript execution.", np: "Async I/O ले <b>concurrency</b> दिन्छ; worker thread ले साँचो <b>समानान्तर</b> JavaScript execution।", jp: "非同期I/Oは<b>並行性</b>を、ワーカースレッドは本当の<b>並列</b>実行を与える。" },
      ],
      commonMistakes: [
        { en: "<b>Spawning a worker to `await fetch(url)`</b> — that call is already non-blocking, so the worker buys nothing and costs startup plus message passing.", np: "<b>`await fetch(url)` का लागि worker चलाउनु</b> — त्यो call पहिले नै non-blocking छ, त्यसैले worker ले केही दिँदैन र सुरुवात तथा message passing को लागत थप्छ।", jp: "<b>`await fetch(url)` のためにワーカーを起こす</b> — もともと非ブロッキングなので、得るものはなく起動とメッセージ受け渡しの費用だけ増える。" },
        { en: "<b>Using `exec()` for a command with huge output</b> — it buffers everything in memory, where `spawn()` would have streamed it.", np: "<b>ठूलो output भएको command मा `exec()` प्रयोग गर्नु</b> — यसले सबै memory मा राख्छ, जहाँ `spawn()` ले stream गर्थ्यो।", jp: "<b>巨大な出力のコマンドに `exec()` を使う</b> — すべてメモリに溜める。`spawn()` なら流せた。" },
        { en: "<b>Expecting a worker to share ordinary objects</b> — messages are copied, so mutating the copy in the worker changes nothing on the main thread.", np: "<b>Worker ले सामान्य object बाँड्छ भन्ने आशा</b> — message copy हुन्छन्, त्यसैले worker मा copy बदल्दा main thread मा केही बदलिँदैन।", jp: "<b>ワーカーが普通のオブジェクトを共有すると思う</b> — メッセージは複製されるので、ワーカー側で書き換えてもメインには影響しない。" },
        { en: "<b>Forgetting the `error` listener on a worker</b> — a throw inside the worker otherwise disappears, and the main thread waits for a message that never comes.", np: "<b>Worker मा `error` listener बिर्सनु</b> — नत्र worker भित्रको throw हराउँछ, र main thread कहिल्यै नआउने message कुर्छ।", jp: "<b>ワーカーの `error` リスナーを忘れる</b> — ワーカー内のthrowは消え、メインは決して来ないメッセージを待ち続ける。" },
      ],
      quiz: [
        {
          question: { en: "When are worker threads most useful?", np: "Worker thread कहिले सबैभन्दा उपयोगी हुन्छन्?", jp: "ワーカースレッドが最も役立つのは?" },
          options: [
            { en: "Waiting for a database query", np: "Database query कुर्दा", jp: "DBクエリを待つとき" },
            { en: "Waiting for an HTTP request", np: "HTTP request कुर्दा", jp: "HTTPリクエストを待つとき" },
            { en: "CPU-intensive JavaScript computation", np: "CPU-भारी JavaScript गणना", jp: "CPUを食うJavaScriptの計算" },
            { en: "Reading a small config file", np: "सानो config file पढ्दा", jp: "小さな設定ファイルを読むとき" },
          ],
          correctIndex: 2,
          explanation: { en: "The other three are I/O, which Node already handles without blocking.", np: "बाँकी तीन I/O हुन्, जुन Node ले नरोकी पहिले नै सम्हाल्छ।", jp: "他の3つはI/Oで、Nodeはすでにブロックせず扱える。" },
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
          question: { en: "Which is more appropriate for a command producing very large output?", np: "धेरै ठूलो output दिने command का लागि कुन उपयुक्त छ?", jp: "非常に大きな出力を出すコマンドに向くのは?" },
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
          question: { en: "What does `fork()` give you that `spawn()` does not?", np: "`spawn()` ले नदिने के `fork()` ले दिन्छ?", jp: "`spawn()` にはなく `fork()` にあるものは?" },
          options: [
            { en: "Shared memory", np: "साझा memory", jp: "共有メモリ" },
            { en: "Automatic restarts", np: "स्वतः restart", jp: "自動再起動" },
            { en: "A built-in message channel to another Node process", np: "अर्को Node process सँग भित्रैको message channel", jp: "別のNodeプロセスへの組み込みメッセージ経路" },
          ],
          correctIndex: 2,
          explanation: { en: "`child.send()` and `process.send()` are the two ends of it.", np: "`child.send()` र `process.send()` यसका दुई छेउ हुन्।", jp: "`child.send()` と `process.send()` がその両端。" },
        },
        {
          question: { en: "What is the difference between concurrency and parallelism here?", np: "यहाँ concurrency र parallelism बीच के फरक छ?", jp: "ここでの並行性と並列性の違いは?" },
          options: [
            { en: "Async I/O gives concurrency; worker threads give parallel JavaScript execution", np: "Async I/O ले concurrency दिन्छ; worker thread ले समानान्तर JavaScript execution", jp: "非同期I/Oは並行性を、ワーカースレッドは並列なJavaScript実行を与える" },
            { en: "They mean the same thing in Node", np: "Node मा ती उही अर्थ राख्छन्", jp: "Nodeでは同じ意味" },
            { en: "Parallelism only applies to child processes", np: "Parallelism child process मा मात्र लागू हुन्छ", jp: "並列性は子プロセスにのみ当てはまる" },
          ],
          correctIndex: 0,
          explanation: { en: "Node juggles many I/O operations without running JavaScript for all of them at once.", np: "Node ले धेरै I/O operation सम्हाल्छ, सबैका लागि JavaScript एकैचोटि नचलाई।", jp: "Nodeは多数のI/Oを捌くが、そのすべてでJavaScriptを同時に走らせてはいない。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "What is the main advantage of a stream?", np: "Stream को मुख्य फाइदा के हो?", jp: "ストリームの主な利点は?" },
      options: [
        { en: "It processes data incrementally instead of holding it all in memory", np: "यसले सबै memory मा नराखी data क्रमशः process गर्छ", jp: "全部をメモリに置かず逐次処理する" },
        { en: "It makes JavaScript synchronous", np: "यसले JavaScript synchronous बनाउँछ", jp: "JavaScriptを同期にする" },
        { en: "It converts strings into objects", np: "यसले string लाई object बनाउँछ", jp: "文字列をオブジェクトに変換する" },
        { en: "It creates worker threads automatically", np: "यसले स्वतः worker thread बनाउँछ", jp: "自動でワーカースレッドを作る" },
      ],
      correctIndex: 0,
      explanation: { en: "A 5 GB file never has to be resident all at once.", np: "5 GB को file एकैचोटि पूरै राख्नु पर्दैन।", jp: "5 GBのファイルを一度に丸ごと持つ必要がない。" },
    },
    {
      question: { en: "Which stream type reads, modifies and writes?", np: "कुन stream ले पढ्छ, बदल्छ र लेख्छ?", jp: "読み・変更・書きを行うストリームは?" },
      options: [
        { en: "Readable", np: "Readable", jp: "Readable" },
        { en: "Writable", np: "Writable", jp: "Writable" },
        { en: "Transform", np: "Transform", jp: "Transform" },
        { en: "Buffer", np: "Buffer", jp: "Buffer" },
      ],
      correctIndex: 2,
      explanation: { en: "Compression, encryption and parsing are all transforms.", np: "Compression, encryption र parsing सबै transform हुन्।", jp: "圧縮・暗号化・解析はどれも変換。" },
    },
    {
      question: { en: "Why does backpressure matter?", np: "Backpressure किन महत्वपूर्ण छ?", jp: "バックプレッシャーが重要な理由は?" },
      options: [
        { en: "It stops a fast producer from overwhelming a slow consumer", np: "यसले छिटो producer ले ढिलो consumer थिच्नबाट रोक्छ", jp: "速い生産側が遅い消費側を圧倒するのを防ぐから" },
        { en: "It encrypts the streamed data", np: "यसले data encrypt गर्छ", jp: "データを暗号化するから" },
        { en: "It creates extra CPU threads", np: "यसले थप CPU thread बनाउँछ", jp: "追加のCPUスレッドを作るから" },
        { en: "It converts Buffers to strings", np: "यसले Buffer लाई string बनाउँछ", jp: "Bufferを文字列に変換するから" },
      ],
      correctIndex: 0,
      explanation: { en: "Without it the difference in rate piles up in memory until the process falls over.", np: "यो नभए गतिको फरक memory मा थुप्रिन्छ र process ढल्छ।", jp: "無ければ速度差がメモリに積み上がり、プロセスが倒れる。" },
    },
    {
      question: { en: "Why prefer `pipeline()` over chaining `.pipe()`?", np: "`.pipe()` जोड्नुभन्दा `pipeline()` किन रोज्ने?", jp: "`.pipe()` の連結より `pipeline()` を選ぶ理由は?" },
      options: [
        { en: "It is faster at copying bytes", np: "यो byte copy गर्न छिटो छ", jp: "バイトのコピーが速いから" },
        { en: "It compresses the output automatically", np: "यसले output स्वतः compress गर्छ", jp: "出力を自動で圧縮するから" },
        { en: "It propagates the error and destroys every stream in the chain", np: "यसले error फैलाउँछ र शृंखलाका हरेक stream नष्ट गर्छ", jp: "エラーを伝播し連鎖のすべてを破棄するから" },
      ],
      correctIndex: 2,
      explanation: { en: "A bare `.pipe()` leaves the remaining streams open when one errors.", np: "खाली `.pipe()` मा एउटामा error आए बाँकी stream खुला रहन्छन्।", jp: "素の `.pipe()` は1つがエラーになると残りを開いたままにする。" },
    },
    {
      question: { en: "What does a Node `Buffer` represent?", np: "Node को `Buffer` ले के जनाउँछ?", jp: "Nodeの `Buffer` は何を表すか?" },
      options: [
        { en: "JavaScript objects", np: "JavaScript object", jp: "JavaScriptのオブジェクト" },
        { en: "Raw binary bytes", np: "कच्चा binary byte", jp: "生のバイナリのバイト列" },
        { en: "Promises", np: "Promise", jp: "Promise" },
        { en: "DOM elements", np: "DOM element", jp: "DOM要素" },
      ],
      correctIndex: 1,
      explanation: { en: "`\"👍\".length` is 2 code units, `Buffer.from(\"👍\").length` is 4 bytes.", np: "`\"👍\".length` 2 code unit, `Buffer.from(\"👍\").length` 4 byte।", jp: "`\"👍\".length` は2コード単位、`Buffer.from(\"👍\").length` は4バイト。" },
    },
    {
      question: { en: "Which is more appropriate for very large command output?", np: "धेरै ठूलो command output का लागि कुन उपयुक्त छ?", jp: "非常に大きなコマンド出力に向くのは?" },
      options: [
        { en: "`exec()`", np: "`exec()`", jp: "`exec()`" },
        { en: "`spawn()`", np: "`spawn()`", jp: "`spawn()`" },
        { en: "`JSON.parse()`", np: "`JSON.parse()`", jp: "`JSON.parse()`" },
        { en: "`fork()`", np: "`fork()`", jp: "`fork()`" },
      ],
      correctIndex: 1,
      explanation: { en: "`exec()` buffers the whole output in memory; `spawn()` streams it.", np: "`exec()` ले पूरै output memory मा राख्छ; `spawn()` ले stream गर्छ।", jp: "`exec()` は丸ごとバッファし、`spawn()` は流す。" },
    },
    {
      question: { en: "When are worker threads most useful?", np: "Worker thread कहिले सबैभन्दा उपयोगी हुन्छन्?", jp: "ワーカースレッドが最も役立つのは?" },
      options: [
        { en: "Waiting for a database query", np: "Database query कुर्दा", jp: "DBクエリを待つとき" },
        { en: "Waiting for an HTTP request", np: "HTTP request कुर्दा", jp: "HTTPリクエストを待つとき" },
        { en: "CPU-intensive JavaScript computation", np: "CPU-भारी JavaScript गणना", jp: "CPUを食うJavaScriptの計算" },
        { en: "Reading a small config file", np: "सानो config file पढ्दा", jp: "小さな設定ファイルを読むとき" },
      ],
      correctIndex: 2,
      explanation: { en: "The other three are I/O, which Node already handles without blocking.", np: "बाँकी तीन I/O हुन्, जुन Node ले नरोकी सम्हाल्छ।", jp: "他の3つはI/Oで、Nodeはブロックせず扱える。" },
    },
    {
      question: { en: "What is the key difference between a worker thread and a child process?", np: "Worker thread र child process बीचको मुख्य भिन्नता के हो?", jp: "ワーカースレッドと子プロセスの決定的な違いは?" },
      options: [
        { en: "Workers cannot execute JavaScript", np: "Worker ले JavaScript चलाउन सक्दैन", jp: "ワーカーはJavaScriptを実行できない" },
        { en: "Child processes run on the same thread", np: "Child process उही thread मा चल्छ", jp: "子プロセスは同じスレッドで動く" },
        { en: "They are the same thing", np: "ती एउटै हुन्", jp: "同じもの" },
        { en: "Workers share the process; child processes have their own memory", np: "Worker ले process बाँड्छ; child process को आफ्नै memory हुन्छ", jp: "ワーカーはプロセスを共有し、子プロセスは独自メモリを持つ" },
      ],
      correctIndex: 3,
      explanation: { en: "Workers start faster; child processes isolate crashes better.", np: "Worker छिटो सुरु हुन्छन्; child process ले crash राम्रोसँग अलग गर्छ।", jp: "ワーカーは起動が速く、子プロセスは障害の隔離に優れる。" },
    },
    {
      question: { en: "What is the difference between concurrency and parallelism?", np: "Concurrency र parallelism बीच के फरक छ?", jp: "並行性と並列性の違いは?" },
      options: [
        { en: "They mean the same thing in Node", np: "Node मा ती उही हुन्", jp: "Nodeでは同じ意味" },
        { en: "Async I/O gives concurrency; worker threads give parallel JavaScript execution", np: "Async I/O ले concurrency; worker thread ले समानान्तर JavaScript execution दिन्छ", jp: "非同期I/Oは並行性を、ワーカースレッドは並列実行を与える" },
        { en: "Parallelism only applies to child processes", np: "Parallelism child process मा मात्र", jp: "並列性は子プロセスのみ" },
      ],
      correctIndex: 1,
      explanation: { en: "Node juggles many I/O operations without running JavaScript for all at once.", np: "Node ले धेरै I/O सम्हाल्छ, सबैका लागि JavaScript एकैचोटि नचलाई।", jp: "Nodeは多数のI/Oを捌くが、すべてで同時にJavaScriptを走らせてはいない。" },
    },
    {
      question: { en: "You must transform every row of a 20 GB CSV and gzip the result. What fits?", np: "20 GB CSV को हरेक row बदलेर नतिजा gzip गर्नुपर्छ। कुन मिल्छ?", jp: "20 GBのCSVの全行を変換しgzipする。合うのは?" },
      options: [
        { en: "Readable stream → Transform → Gzip → Writable stream", np: "Readable stream → Transform → Gzip → Writable stream", jp: "Readable → Transform → Gzip → Writable" },
        { en: "Read it all with `readFileSync`, then transform and write", np: "`readFileSync` ले सबै पढ्ने, अनि बदल्ने र लेख्ने", jp: "`readFileSync` で全部読み、変換して書く" },
        { en: "Load it into a worker thread as one string", np: "एउटै string का रूपमा worker मा लोड गर्ने", jp: "1つの文字列としてワーカーへ載せる" },
      ],
      correctIndex: 0,
      explanation: { en: "If the per-row transform is also CPU-heavy, add a worker pool to that stage.", np: "प्रति-row transform पनि CPU-भारी छ भने, त्यो चरणमा worker pool थप्नुहोस्।", jp: "行ごとの変換もCPUを食うなら、その段にワーカープールを足す。" },
    },
  ],
};
