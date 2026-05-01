import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_3_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Before Express, Node’s **built-in modules** teach you how HTTP actually works: **`http`** sends and receives messages, **`fs`** reads and writes files (often via streams), and **`events`** wires publishers and listeners together—the same pattern timers and sockets use under the hood.",
      np: "http, fs, events — एक्सप्रेस अघि कच्चा बुझ्नुहोस्।",
      jp: "Express の前に **`http`・`fs`・`events`** で動きの素を押さえる。",
    },
    {
      en: "Keep one rule in mind on servers: **never use synchronous `fs.*Sync` in request handlers** unless you truly know traffic is tiny—they block the event loop and stall every concurrent user.",
      np: "सर्भरमा `fsSync` जोखिम — लूप रोक्छ।",
      jp: "リクエスト処理内では **`fs` の同期 API を避ける**（例外はごく小規模のみ）。",
    },
  ],
  sections: [
    {
      title: { en: "File system (fs) — async first", np: "फाइल प्रणाली", jp: "fs — 非同期優先" },
      blocks: [
        {
          type: "code",
          title: { en: "Read a file without blocking the server", np: "async फाइल पढ्नु", jp: "非同期で読む" },
          code: `const fs = require('fs').promises;

async function readConfig() {
  const raw = await fs.readFile('./config.json', 'utf8');
  return JSON.parse(raw);
}

// In request handlers prefer this — avoid fs.readFileSync except at startup.`,
        },
        {
          type: "paragraph",
          text: {
            en: "For reading configuration at **startup**, sync reads are sometimes acceptable because no traffic exists yet. For **every request**, use **`fs.promises.readFile`**, callbacks, or **streams** (`createReadStream`) so large files do not load entirely into RAM at once.",
            np: "सुरुवातमा मात्र sync; अनुरोधमा async वा stream।",
            jp: "起動時だけ同期でも可。リクエスト処理では Promise かストリーム。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Streams** — when copying or serving big files, pipe a read stream to a write stream or HTTP response. Backpressure (slow consumer) is handled for you when you pipe correctly.",
              np: "ठूलो फाइलमा stream र pipe — मेमोरी बचत।",
              jp: "**ストリーム** — 大きいファイルは `pipe`。バックプレッシャに強い。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Events & EventEmitter", np: "इभेन्ट र EventEmitter", jp: "イベントと EventEmitter" },
      blocks: [
        {
          type: "code",
          title: { en: "Minimal EventEmitter", np: "सानो EventEmitter", jp: "最小の例" },
          code: `const EventEmitter = require('events');
const bus = new EventEmitter();

bus.on('order:placed', (id) => console.log('notify warehouse', id));
bus.emit('order:placed', 'ord_123');`,
        },
        {
          type: "paragraph",
          text: {
            en: "**EventEmitter** is Node’s publish/subscribe primitive: `.on(event, handler)`, `.once`, `.emit(event, ...args)`. HTTP responses, sockets, and many APIs inherit from it—you already depend on this pattern when you listen for `'data'` or `'error'` on streams.",
            np: "`on` / `emit` — स्ट्रिम र सर्भरको जडान यही ढाँचा।",
            jp: "**EventEmitter** — `.on` と `.emit`。ストリームもこのパターン。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Event arguments** — `emit('notify', userId, payload)` passes arguments positionally; document the contract so listeners do not guess argument order.",
              np: "`emit` का तर्क क्रममा — सम्झौता लेख्नुहोस्।",
              jp: "**引数** — `emit` の順番をドキュメント化。",
            },
            {
              en: "**Extending EventEmitter** — subclass `EventEmitter` for domain objects (e.g. a download queue) so behavior stays in one place instead of scattering callbacks.",
              np: "डोमेन क्लासले EventEmitter विस्तार गर्न सक्छ।",
              jp: "**継承** — ドメインオブジェクトが EventEmitter を継承するパターン。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "HTTP module & recap", np: "HTTP र पुनरावलोकन", jp: "http とまとめ" },
      blocks: [
        {
          type: "code",
          title: { en: "Bare http server (Express builds on this)", np: "कच्चा http सर्भर", jp: "素の http" },
          code: `const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(\`method=\${req.method} url=\${req.url}\\n\`);
});

server.listen(3000, () => console.log('listening on :3000'));`,
        },
        {
          type: "paragraph",
          text: {
            en: "**`http.createServer`** gives you `IncomingMessage` (`req`) and `ServerResponse` (`res`). You set **`statusCode`**, **`setHeader`**, and **`res.end(body)`**. Frameworks hide this, but seeing raw handlers helps you read network traces and Postman responses.",
            np: "`req` र `res` — स्थिति, हेडर, `end()` सेट गर्नुहोस्।",
            jp: "**http** — `req` / `res` とステータス・ヘッダ・ボディをそのまま触る。",
          },
        },
        {
          type: "diagram",
          id: "request-response",
        },
        {
          type: "paragraph",
          text: {
            en: "The diagram is the mental model for **one round trip**: method + path + headers from client, status + headers + body from server. Express adds routing and middleware **on top** of this—nothing magical replaces TCP or HTTP.",
            np: "एक अनुरोध–प्रतिक्रिया चक्र — एक्सप्रेसले यहीँ माथि रूटिङ थप्छ।",
            jp: "図は 1 往復のイメージ。Express はこの上にルーティングを載せるだけ。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Core recap** — you now connect **globals**, **CommonJS**, **path/os**, **fs/events/http**. Next comes **npm** (sharing packages) and **Express** (structuring HTTP servers).",
              np: "अब npm र Express मा जान सजिलो छ।",
              jp: "**まとめ** — ここまでが npm・Express の土台。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When do I use try/catch with fs?",
        np: "try/catch कहिले?",
        jp: "try/catch はいつ？",
      },
      answer: {
        en: "**Sync** `fs` methods throw—you catch or crash. **Promise-based** APIs reject—use `try/catch` with `async/await` or `.catch`. **Streams** emit `'error'` events—you **must** attach `stream.on('error', …)` or unhandled errors can tear down the process.",
        np: "sync ले throw; promise ले reject; stream ले `error` इभेन्ट।",
        jp: "同期は throw、Promise は reject、ストリームは `error` イベント。",
      },
    },
  ],
};
