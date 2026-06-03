import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_3_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "The **`fs`** module is how Node reads and writes files. Every operation comes in two versions: a synchronous one that blocks everything while it works, and an async one that lets your server keep handling other requests while it waits. On a server, always use the async version.",
      np: "`fs` — फाइल प्रणालीको प्रवेशद्वार। सर्भरमा सधैँ async variant प्रयोग गर्नुहोस्।",
      jp: "**`fs`** はファイルシステムへの入口。サーバでは常に非同期版を使い、イベントループを解放する。",
    },
    {
      en: "**EventEmitter** is Node's built-in way to broadcast events and react to them — like a simple publish/subscribe system. HTTP servers, streams, and timers are all built on top of it. The **`http`** module uses it too, which means you can build a basic server without installing any extra packages.",
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
          type: "youtube",
          videoId: "Z_p1yFGS0Ak",
          title: "Node.js fs Module - Reading & Writing Files",
        },
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
            en: "Reading files synchronously is fine at **startup** — your app hasn't received any traffic yet, so blocking doesn't matter. But inside a **request handler**, always use the async version so other requests don't have to wait for one request's file read to finish.",
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
          type: "youtube",
          videoId: "EcznOgzOdxI",
          title: "Node.js Streams Explained",
        },
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
            en: "When you call **`.pipe(destination)`**, Node automatically connects a readable source to a writable destination and handles the flow between them. **Backpressure** is built in — if the destination (like an HTTP response) can't keep up with the incoming data, Node pauses the source automatically so your app doesn't run out of memory trying to buffer everything.",
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
            en: "Every time you call `.emit()`, all listeners registered with **`.on()`** run immediately in the order you added them. Use **`.once()`** when you only need to react to something the first time it happens — it removes itself automatically after that. Use **`.off()`** to manually remove a listener you no longer need, especially in long-running apps where forgotten listeners can slowly leak memory.",
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
            en: "`req` and `res` are both EventEmitters under the hood. The request body comes in as chunks through `'data'` events and finishes with `'end'`. That is why **Express exists** — doing all of this by hand for every route (parsing JSON, matching URLs, handling errors) gets repetitive very quickly. Express is essentially a thin layer that handles all of that for you.",
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
        en: "Use streams when files are **larger than a few MB** or when you are sending a file directly to an HTTP response. `fs.readFile` loads the whole file into memory at once — fine for a small config file, but if 100 users each request a 500 MB file at the same time, your server runs out of RAM fast. Streams avoid this by processing the data one small chunk at a time.",
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
        en: "It works fine for **simple internal events** — like tracking download progress or notifying parts of your app when an order ships. But if you need multiple consumers, event replay, or persistence across restarts, something like **RxJS**, **Redis pub/sub**, or a message broker is a better fit. EventEmitter does not scale well across services or complex listener setups.",
        np: "साधारण in-process pub/sub मा ठीक — जटिल state का लागि RxJS वा Redis pub/sub।",
        jp: "シンプルな in-process pub/sub には有効。複雑な状態管理には RxJS や Redis pub/sub の方が拡張しやすい。",
      },
    },
  ],
};
