import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_3_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "The **`fs`** module is Node's gateway to the file system — every method has a synchronous variant (`readFileSync`) and an async variant (`readFile` callback or `fs.promises.readFile`). On a server, the async variants keep the event loop free so concurrent requests never stall waiting for disk.",
      np: "`fs` — फाइल प्रणालीको प्रवेशद्वार। सर्भरमा सधैँ async variant प्रयोग गर्नुहोस्।",
      jp: "**`fs`** はファイルシステムへの入口。サーバでは常に非同期版を使い、イベントループを解放する。",
    },
    {
      en: "**EventEmitter** is Node's built-in pub/sub primitive — HTTP servers, streams, and timers all inherit from it. The **`http`** module builds on EventEmitter directly, letting you create a raw server before you ever install Express.",
      np: "EventEmitter — Node को प्रकाशन/सदस्यता आधार। http सर्भर यसैमा बनेको छ।",
      jp: "**EventEmitter** は Node 内蔵の pub/sub 基盤。http モジュールはこれを継承したサーバを提供する。",
    },
  ],
  sections: [
    {
      title: {
        en: "fs — reading and writing files",
        np: "fs — फाइल पढ्नु र लेख्नु",
        jp: "fs — ファイルの読み書き",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Three ways to read a file",
            np: "फाइल पढ्ने तीन तरिका",
            jp: "ファイルを読む 3 通り",
          },
          code: `const fs = require('fs');
const fsp = require('fs').promises;

// 1. Callback — old-style but universal
fs.readFile('./config.json', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(JSON.parse(data));
});

// 2. async/await with fs.promises (Node 10+)
async function readConfig() {
  const raw = await fsp.readFile('./config.json', 'utf8');
  return JSON.parse(raw);
}

// 3. Synchronous — ONLY safe at startup, never in request handlers
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

// Writing a file
await fsp.writeFile('./output.json', JSON.stringify({ ok: true }, null, 2));`,
        },
        {
          type: "paragraph",
          text: {
            en: "Synchronous reads are acceptable at **startup** — no traffic yet, so blocking is harmless. Inside **request handlers** always use the async form (`fs.promises.*` or callbacks) so thousands of concurrent requests can proceed while one waits for disk.",
            np: "सुरुवातमा sync ठीक; अनुरोध handler मा async चाहिन्छ ताकि अन्य अनुरोधहरू पर्खनु नपरोस्।",
            jp: "起動時は同期も可。**リクエスト処理内**では必ず非同期を使い、他のリクエストをブロックしない。",
          },
        },
        {
          type: "table",
          caption: {
            en: "fs.readFile vs fs.promises.readFile vs fs.readFileSync",
            np: "तीन तरिका तुलना",
            jp: "3 つの API 比較",
          },
          headers: [
            { en: "Method", np: "विधि", jp: "メソッド" },
            { en: "Returns", np: "फर्काउँछ", jp: "戻り値" },
            { en: "When to use", np: "कहिले प्रयोग", jp: "使いどき" },
          ],
          rows: [
            [
              { en: "`fs.readFile(path, cb)`", np: "callback", jp: "`fs.readFile`" },
              { en: "void — result in callback", np: "callback मा नतिजा", jp: "コールバックで受け取る" },
              { en: "Legacy code; interop with older Node APIs", np: "पुरानो कोड", jp: "既存コードとの互換" },
            ],
            [
              { en: "`fs.promises.readFile(path)`", np: "Promise", jp: "`fsp.readFile`" },
              { en: "Promise<Buffer|string>", np: "Promise<Buffer|string>", jp: "Promise<Buffer|string>" },
              { en: "Modern servers — works with async/await", np: "आधुनिक सर्भर", jp: "現代のサーバコード" },
            ],
            [
              { en: "`fs.readFileSync(path)`", np: "sync", jp: "`readFileSync`" },
              { en: "Buffer | string (blocks)", np: "Buffer — ब्लक गर्छ", jp: "Buffer（ブロックする）" },
              { en: "App startup scripts only — not in HTTP handlers", np: "सुरुवात मात्र", jp: "起動スクリプトのみ" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Streams — pipe large data",
        np: "Streams — ठूलो डाटा पाइप गर्नुहोस्",
        jp: "ストリーム — 大量データをパイプ",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Stream a file directly to an HTTP response",
            np: "फाइल HTTP response मा stream गर्नुहोस्",
            jp: "ファイルを HTTP レスポンスにストリーミング",
          },
          code: `const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.url === '/download') {
    res.setHeader('Content-Type', 'text/csv');
    // Chunk the file to res — never loads all into RAM
    fs.createReadStream('./big.csv').pipe(res);
    return;
  }
  res.end('ok');
});

server.listen(3000);`,
        },
        {
          type: "diagram",
          id: "nodejs-stream-pipe",
        },
        {
          type: "paragraph",
          text: {
            en: "When you call **`.pipe(destination)`**, Node connects the readable's `data` events to the writable's `write` calls automatically. **Backpressure** is built in: if `res` (the writable) is slower than the disk read, the readable pauses until the buffer drains — preventing your process from buffering gigabytes in RAM.",
            np: "`.pipe()` ले backpressure स्वतः सम्हाल्छ — RAM मा सम्पूर्ण फाइल लोड हुँदैन।",
            jp: "**`.pipe()`** はバックプレッシャを自動処理。書き込み側が遅くても RAM に全データを溜めない。",
          },
        },
      ],
    },
    {
      title: {
        en: "EventEmitter — pub/sub inside Node",
        np: "EventEmitter — Node भित्र pub/sub",
        jp: "EventEmitter — Node 内部の pub/sub",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Subclass EventEmitter for a domain object",
            np: "EventEmitter विस्तार गर्ने उदाहरण",
            jp: "EventEmitter を継承したドメインオブジェクト",
          },
          code: `const EventEmitter = require('events');

class OrderProcessor extends EventEmitter {
  process(order) {
    // ... business logic ...
    this.emit('shipped', { orderId: order.id, trackingCode: 'TRK123' });
    this.emit('invoice:ready', order);
  }
}

const processor = new OrderProcessor();

// Register listeners
processor.on('shipped', ({ orderId }) => {
  console.log('Notify warehouse for order', orderId);
});

// once() fires only on first emission, then removes itself
processor.once('shipped', () => console.log('First shipment this session'));

processor.process({ id: 'ORD-99' });
// Output: "Notify warehouse for order ORD-99"
//         "First shipment this session"`,
        },
        {
          type: "diagram",
          id: "nodejs-event-emitter",
        },
        {
          type: "paragraph",
          text: {
            en: "Listeners registered with **`.on()`** are called **synchronously** in the order they were registered every time `.emit()` is called. Use **`.once()`** when you only need to react to the first occurrence. **`.removeListener(event, fn)`** (or `.off()`) removes a specific handler — important to avoid memory leaks in long-running processes.",
            np: "`.on()` listener क्रममा synchronous — `.once()` पहिलो पटक मात्र — `.off()` हटाउन।",
            jp: "**`.on()`** は登録順に同期実行。**`.once()`** は初回のみ。**`.off()`** でリスナーを解除しリーク防止。",
          },
        },
      ],
    },
    {
      title: {
        en: "http module — a server from scratch",
        np: "http module — शुरुदेखि सर्भर बनाउनु",
        jp: "http モジュール — 素のサーバを作る",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Routing and reading the request body manually",
            np: "रूटिङ र body पढ्नु",
            jp: "ルーティングとリクエストボディの読み取り",
          },
          code: `const http = require('http');

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Simple routing
  if (method === 'GET' && url === '/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ pong: true }));
  }

  if (method === 'POST' && url === '/echo') {
    let body = '';
    // req is a Readable stream — collect chunks
    req.on('data', (chunk) => { body += chunk.toString(); });
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(body); // echo back
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(3000, () => console.log('http://localhost:3000'));`,
        },
        {
          type: "paragraph",
          text: {
            en: "**`req`** (`IncomingMessage`) and **`res`** (`ServerResponse`) both extend EventEmitter. `req` is a Readable stream — you read its body by listening for `'data'` and `'end'` events. **Express exists** because doing this manually for every route (parsing JSON, routing, error handling) becomes tedious fast. Express is 100 lines of glue over exactly this API.",
            np: "`req` र `res` EventEmitter — Express यहीँ माथि routing र parsing थप्छ।",
            jp: "`req`/`res` は EventEmitter。Express はこの API にルーティングと JSON 解析を追加したラッパー。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When should I use streams instead of readFile?",
        np: "streams कहिले प्रयोग गर्ने?",
        jp: "ストリームをいつ使うべきか？",
      },
      answer: {
        en: "Use streams for files **larger than a few MB** or whenever you are piping data to an HTTP response. `fs.readFile` loads the entire file into a `Buffer` in memory — fine for a 10 KB config, dangerous for a 500 MB CSV that 100 concurrent users might request simultaneously. Streams keep memory flat by processing one chunk at a time.",
        np: "कुछ MB भन्दा ठूला फाइल वा HTTP response मा pipe गर्दा stream — readFile ले सम्पूर्ण RAM मा राख्छ।",
        jp: "数 MB 以上のファイルや HTTP にパイプする場合はストリーム。readFile は全データを RAM に展開するため大ファイルに危険。",
      },
    },
    {
      question: {
        en: "Can I use EventEmitter as a state manager?",
        np: "EventEmitter state manager बन्न सक्छ?",
        jp: "EventEmitter をステート管理に使えるか？",
      },
      answer: {
        en: "It works for **simple in-process pub/sub** — e.g., a download progress tracker or order status notifier within one service. For **complex shared state** (multiple consumers, replay, persistence), dedicated libraries like **RxJS**, **Redis pub/sub**, or a proper message broker scale better and avoid hard-to-debug listener ordering issues.",
        np: "साधारण in-process pub/sub मा ठीक — जटिल state का लागि RxJS वा Redis pub/sub।",
        jp: "シンプルな in-process pub/sub には有効。複雑な状態管理には RxJS や Redis pub/sub の方が拡張しやすい。",
      },
    },
  ],
};
