import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_28_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Design patterns are reusable solutions to recurring software design problems. They are not algorithms or specific code — they are templates for how to structure code. Knowing them lets you recognize patterns in codebases you did not write, communicate with other engineers using shared vocabulary, and avoid reinventing solutions to common problems.",
      np: "Design patterns recurring software design problems को reusable solutions हुन्। ये algorithms वा specific code होइनन् — code structure गर्ने templates हुन्। यिनीहरू थाहा भएमा अरूको codebases मा patterns recognize गर्न, shared vocabulary सँग communicate गर्न, र common problems को solutions reinvent गर्नबाट जोगिन सकिन्छ।",
      jp: "デザインパターンは繰り返し発生するソフトウェア設計問題への再利用可能な解決策。アルゴリズムや具体的なコードではなく、構造のテンプレート。コードベースでパターンを認識し、共通語彙でコミュニケーションし、一般的な問題の再発明を避けられる。",
    },
    {
      en: "Today covers the most commonly asked-about patterns in JavaScript interviews: Singleton, Factory, Observer, Strategy, and a few more. The key insight for each is not the implementation — it is **why** you would reach for it and **what problem** it solves.",
      np: "आज JavaScript interviews मा सबैभन्दा बढी सोधिने patterns cover गरिन्छ: Singleton, Factory, Observer, Strategy, र अरू केही। हरेकको key insight implementation होइन — **किन** use गर्ने र **कुन problem** solve गर्छ।",
      jp: "今日はJS面接でよく聞かれるパターンをカバー: Singleton・Factory・Observer・Strategy他。重要なのは実装ではなく、**なぜ**使うか・**どの問題**を解決するか。",
    },
  ],
  sections: [
    {
      title: { en: "What a pattern actually is", np: "Pattern वास्तवमा के हो", jp: "パターンとは何か" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A <b>design pattern</b> is a reusable way of structuring code to solve a problem that keeps coming back. It is not a library, a framework, or a snippet you memorise and paste. It is a design idea that helps you answer questions like: where should object creation happen, how should components talk to each other, how can behaviour change without rewriting what already works, and how can a complicated system expose a simple front door.",
            np: "<b>Design pattern</b> भनेको बारम्बार आइरहने समस्या हल गर्न code संरचना गर्ने पुनःप्रयोग्य तरिका हो। यो library, framework वा रटेर टाँस्ने snippet होइन। यो त्यस्तो design विचार हो जसले यी प्रश्नको जवाफ दिन मद्दत गर्छ: object कहाँ बन्नुपर्छ, component बीच कसरी कुरा हुनुपर्छ, चलिरहेको कुरा नलेखी व्यवहार कसरी बदल्ने, र जटिल system ले सरल ढोका कसरी देखाउने।",
            jp: "<b>デザインパターン</b>とは、繰り返し現れる問題を解くためのコードの組み立て方の再利用可能な形。ライブラリでもフレームワークでも、暗記して貼る断片でもない。オブジェクト生成をどこで行うか、部品同士がどう会話するか、動いているものを書き直さずに振る舞いをどう変えるか、複雑な仕組みがどう簡単な入口を示すか — こうした問いに答えるための設計上の考え方。",
          },
        },
        {
          type: "paragraph",
          text: {
            en: "JavaScript's flexibility means many classic patterns collapse into <b>functions, closures, objects, modules or higher-order functions</b> rather than the class hierarchies the original catalogue described. So the goal is not to memorise twenty names. It is to recognise the <b>problem</b> a pattern solves, and to notice when reaching for it makes the code simpler rather than more elaborate.",
            np: "JavaScript को लचकताले धेरै classic pattern लाई मूल सूचीका class hierarchy होइन, <b>function, closure, object, module वा higher-order function</b> मा खुम्च्याइदिन्छ। त्यसैले लक्ष्य बीसवटा नाम रट्नु होइन। Pattern ले हल गर्ने <b>समस्या</b> चिन्नु हो, र त्यो प्रयोग गर्दा code झन् जटिल नभई सरल हुन्छ कि भनी देख्नु हो।",
            jp: "JavaScriptの柔軟さのおかげで、多くの古典的パターンは元のカタログにあるクラス階層ではなく、<b>関数・クロージャ・オブジェクト・モジュール・高階関数</b>に収まる。だから目的は20個の名前を覚えることではない。パターンが解く<b>問題</b>を見抜き、それを持ち出すとコードが複雑にならず簡単になるかを見極めること。",
          },
        },
        {
          type: "code",
          title: { en: "The three families, and how they fit together", np: "तीन परिवार, र ती कसरी मिल्छन्", jp: "3つの系統とその関係" },
          code: `                 DESIGN PATTERNS
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
   CREATIONAL      STRUCTURAL     BEHAVIORAL
        │              │              │
        ↓              ↓              ↓
     Factory        Adapter        Observer
     Builder        Facade         Strategy
     Singleton      Decorator      Command


In a real feature they stack rather than compete

Factory
   ↓  creates a payment Strategy
Adapter
   ↓  connects the third-party API
Decorator
   ↓  adds logging around the call
Observer
   ↓  publishes the payment event`,
        },
        { type: "youtube", videoId: "tv-_1er1mWI", title: "JavaScript Design Patterns" },
      ],
    },
    {
      title: { en: "Creational — Factory, Builder, Singleton", np: "Creational — Factory, Builder, Singleton", jp: "生成 — Factory・Builder・Singleton" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Creational patterns are about <b>where object creation happens</b>. A <b>Factory</b> hides which concrete class is being instantiated behind a function, so callers depend on the result rather than the constructor; once you have more than two kinds, a lookup table beats a growing `if/else` chain. A <b>Builder</b> assembles an object step by step, which is what rescues a constructor that has grown seven positional arguments nobody can read. A <b>Singleton</b> guarantees one shared instance — though in modern JavaScript an exported module-level instance usually gets you there with no ceremony at all.",
            np: "Creational pattern <b>object कहाँ बन्छ</b> भन्नेबारे हुन्। <b>Factory</b> ले कुन concrete class बन्दैछ भन्ने function पछाडि लुकाउँछ, त्यसैले caller constructor होइन नतिजामा निर्भर हुन्छ; दुईभन्दा बढी किसिम भएपछि बढ्दो `if/else` भन्दा lookup table राम्रो। <b>Builder</b> ले object क्रमैसँग जोड्छ, जसले सात positional argument भएको अपठनीय constructor बचाउँछ। <b>Singleton</b> ले एउटै साझा instance को ग्यारेन्टी गर्छ — तर आधुनिक JavaScript मा export गरिएको module-स्तरको instance ले प्रायः बिनाझन्झट त्यही दिन्छ।",
            jp: "生成パターンは<b>オブジェクトをどこで作るか</b>の話。<b>Factory</b> はどの具象クラスを作るかを関数の裏に隠すので、呼び出し側はコンストラクタではなく結果に依存する。種類が3つを超えたら、伸びる `if/else` より参照テーブルが勝る。<b>Builder</b> はオブジェクトを段階的に組み立て、誰も読めない7つの位置引数に育ったコンストラクタを救う。<b>Singleton</b> は共有インスタンスをひとつに保つが、現代のJavaScriptではモジュールレベルでエクスポートしたインスタンスで事足りることが多い。",
          },
        },
        {
          type: "code",
          title: { en: "Singleton, Factory, and Builder", np: "Singleton, Factory, र Builder", jp: "Singleton・Factory・Builder" },
          code: `// ══ SINGLETON — ensure only one instance exists ══════════════════
// Problem: you need exactly one instance of something (config, logger, connection pool)
// Anti-pattern in many cases — but valid for shared mutable state

class Database {
  static #instance = null;
  #connection;

  constructor(url) {
    if (Database.#instance) return Database.#instance;
    this.#connection = createConnection(url);
    Database.#instance = this;
  }

  static getInstance(url) {
    if (!Database.#instance) new Database(url);
    return Database.#instance;
  }
}

// Both calls return the same instance
const db1 = Database.getInstance("mongodb://localhost");
const db2 = Database.getInstance("mongodb://localhost");
db1 === db2;  // true

// Module singleton — simpler in ESM (modules are cached after first import)
// db.js:  export const db = new Database(process.env.DB_URL);
// Any file that imports db gets the same instance

// ══ FACTORY — create objects without knowing the exact class ══════
// Problem: you need to create different types of objects based on input

class Logger {
  log(msg) { console.log(msg); }
}
class FileLogger extends Logger {
  log(msg) { fs.appendFileSync("app.log", msg + "\n"); }
}
class RemoteLogger extends Logger {
  log(msg) { fetch("/logs", { method: "POST", body: msg }); }
}

function createLogger(type) {
  const loggers = {
    console: () => new Logger(),
    file:    () => new FileLogger(),
    remote:  () => new RemoteLogger(),
  };
  const factory = loggers[type];
  if (!factory) throw new Error(\`Unknown logger type: \${type}\`);
  return factory();
}

const logger = createLogger(process.env.LOG_TARGET ?? "console");
logger.log("Server started");

// ══ BUILDER — construct complex objects step by step ══════════════
// Problem: a constructor with too many parameters becomes hard to use

class QueryBuilder {
  #table = "";
  #conditions = [];
  #columns = ["*"];
  #limit;

  from(table)    { this.#table = table;             return this; }
  select(...cols){ this.#columns = cols;             return this; }
  where(cond)    { this.#conditions.push(cond);      return this; }
  limitTo(n)     { this.#limit = n;                  return this; }

  build() {
    let sql = \`SELECT \${this.#columns.join(", ")} FROM \${this.#table}\`;
    if (this.#conditions.length) sql += \` WHERE \${this.#conditions.join(" AND ")}\`;
    if (this.#limit) sql += \` LIMIT \${this.#limit}\`;
    return sql;
  }
}

const query = new QueryBuilder()
  .from("users")
  .select("id", "name", "email")
  .where("age > 18")
  .where("active = true")
  .limitTo(20)
  .build();
// SELECT id, name, email FROM users WHERE age > 18 AND active = true LIMIT 20`,
        },
        {
          type: "paragraph",
          text: {
            en: "Two cautions. A Builder earns its keep when an object has many <b>optional</b> settings; for `{ name }` it is pure ceremony. And a Singleton is shared <b>global state</b> wearing a pattern name — it makes dependencies invisible, so `Database.getInstance()` is far harder to test than `createUserService(database)`, where the dependency is stated in the signature. Prefer passing the thing in when you can.",
            np: "दुई सावधानी। Object मा धेरै <b>वैकल्पिक</b> setting हुँदा Builder ले ठाउँ कमाउँछ; `{ name }` का लागि यो निरर्थक तामझाम हो। र Singleton pattern को नाम लगाएको साझा <b>global state</b> हो — यसले dependency अदृश्य बनाउँछ, त्यसैले `Database.getInstance()` लाई `createUserService(database)` भन्दा परीक्षण गर्न धेरै गाह्रो हुन्छ, जहाँ dependency signature मै भनिएको छ। सकेसम्म भित्र पठाउने तरिका रोज्नुहोस्।",
            jp: "注意が2つ。Builderが値打ちを持つのは、オブジェクトに<b>任意の</b>設定が多いとき。`{ name }` に使えば儀式にすぎない。そしてSingletonはパターン名をまとった共有の<b>グローバル状態</b>で、依存を見えなくする。だから `Database.getInstance()` は、依存がシグネチャに書かれた `createUserService(database)` よりずっとテストしにくい。渡せるなら渡す方を選ぶ。",
          },
        },
      ],
    },
    {
      title: { en: "Structural — Adapter, Facade, Decorator", np: "Structural — Adapter, Facade, Decorator", jp: "構造 — Adapter・Facade・Decorator" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Structural patterns are about <b>combining things you already have</b>. An <b>Adapter</b> translates one interface into another: your code wants `payment.pay(order)`, the old library offers `makePayment(amount, currency, card)`, and a thin wrapper reconciles them without touching either side. A <b>Facade</b> puts a simple front door on a complicated subsystem — `auth.register(email, password)` instead of six ordered calls the caller must not get wrong. A <b>Decorator</b> wraps existing behaviour to add something around it, which in JavaScript is just a function returning a function.",
            np: "Structural pattern <b>पहिले नै भएका कुरा जोड्ने</b> बारेमा हुन्। <b>Adapter</b> ले एउटा interface लाई अर्कोमा अनुवाद गर्छ: तपाईंको code ले `payment.pay(order)` चाहन्छ, पुरानो library ले `makePayment(amount, currency, card)` दिन्छ, र पातलो wrapper ले दुबै नछोई मिलाइदिन्छ। <b>Facade</b> ले जटिल subsystem मा सरल ढोका राख्छ — caller ले क्रम नबिगारी गर्नुपर्ने छ वटा call को सट्टा `auth.register(email, password)`। <b>Decorator</b> ले भएको व्यवहार बेरेर वरिपरि केही थप्छ, जुन JavaScript मा function फर्काउने function मात्र हो।",
            jp: "構造パターンは<b>すでにあるものを組み合わせる</b>話。<b>Adapter</b> はインターフェースを翻訳する。こちらは `payment.pay(order)` を求め、古いライブラリは `makePayment(amount, currency, card)` を出す。薄いラッパーが双方に触れずに橋を渡す。<b>Facade</b> は複雑な下位system に簡単な入口を付ける。順番を間違えられない6つの呼び出しの代わりに `auth.register(email, password)`。<b>Decorator</b> は既存の振る舞いを包んで周りに何かを足す。JavaScriptでは関数を返す関数にすぎない。",
          },
        },
        {
          type: "code",
          title: { en: "Adapter, Facade, and Decorator", np: "Adapter, Facade, र Decorator", jp: "Adapter・Facade・Decorator" },
          code: `// ══ ADAPTER — make incompatible interfaces work together ═════════
// Problem: you are integrating a library whose API doesn't match what you need

// Old payment library (legacy API you cannot change)
class LegacyPaymentAPI {
  makePayment(amount, currencyCode, cardDetails) { /* ... */ }
}

// Your app expects this interface
class PaymentService {
  pay(order) { /* order: { total, currency, card } */ }
}

// Adapter — wraps the legacy API to match the expected interface
class PaymentAdapter extends PaymentService {
  #legacy;
  constructor() { super(); this.#legacy = new LegacyPaymentAPI(); }
  pay(order) {
    this.#legacy.makePayment(order.total, order.currency, order.card);
  }
}

// ══ FACADE — provide a simple interface over a complex subsystem ════
// Problem: a complex system (authentication, logging, DB) has too many steps

// Without Facade — 5 steps for every user registration
const hash = await bcrypt.hash(password, 10);
const user = await db.insert("users", { email, passwordHash: hash });
await emailService.sendVerification(user.email, user.id);
await logger.info("User registered", { userId: user.id });
analytics.track("user_registered", { userId: user.id });

// With Facade — one call, complexity hidden
class AuthFacade {
  async register(email, password) {
    const hash = await bcrypt.hash(password, 10);
    const user = await db.insert("users", { email, passwordHash: hash });
    await emailService.sendVerification(user.email, user.id);
    logger.info("User registered", { userId: user.id });
    analytics.track("user_registered", { userId: user.id });
    return user;
  }
}

// ══ DECORATOR — add behaviour without modifying the original ════════
// Problem: you want to add logging, caching, or validation without changing the class

// Function decorator
function withLogging(fn) {
  return async function (...args) {
    console.log(\`Calling \${fn.name} with\`, args);
    const result = await fn(...args);
    console.log(\`\${fn.name} returned\`, result);
    return result;
  };
}

const loggedFetchUser = withLogging(fetchUser);
await loggedFetchUser(42);  // logs before and after

// JavaScript's @decorator proposal (Stage 3 at time of writing):
@log
@validate
class UserService {
  async createUser(data) { /* ... */ }
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "A Facade does not make the underlying system simpler — it simplifies <b>how other code interacts with it</b>. The steps are all still there, just no longer every caller's problem. The Decorator is the one you will reach for most in JavaScript, because logging, timing, caching, authorisation, retries and metrics are all the same move: wrap the function, do something before and after, return the result untouched.",
            np: "Facade ले तलको system सरल बनाउँदैन — यसले <b>अरू code ले त्यससँग कसरी अन्तरक्रिया गर्छ</b> भन्ने सरल बनाउँछ। चरणहरू सबै त्यहीँ छन्, बस अब हरेक caller को टाउको दुखाइ होइनन्। JavaScript मा सबैभन्दा धेरै काम लाग्ने Decorator नै हो, किनकि logging, timing, caching, authorisation, retry र metrics सबै उही चाल हुन्: function बेर्नुहोस्, अघि र पछि केही गर्नुहोस्, नतिजा जस्ताको तस्तै फर्काउनुहोस्।",
            jp: "Facadeは下の仕組みを簡単にはしない。簡単にするのは<b>他のコードとの付き合い方</b>。手順はすべて残るが、もう各呼び出し側の責任ではない。JavaScriptで最も出番が多いのはDecoratorだ。ログ・計測・キャッシュ・認可・リトライ・メトリクスはどれも同じ動き。関数を包み、前後で何かをして、結果はそのまま返す。",
          },
        },
      ],
    },
    {
      title: { en: "Behavioral — Observer, Strategy, Command", np: "Behavioral — Observer, Strategy, Command", jp: "振る舞い — Observer・Strategy・Command" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Behavioral patterns are about <b>how parts communicate and how behaviour changes</b>. <b>Observer</b> answers \"who should be told when this happens\" — subscribers register, an event fires, everyone interested reacts, and the publisher never learns who is listening. It is the shape behind DOM events, Node's `EventEmitter`, state stores and WebSocket layers. <b>Strategy</b> answers a different question: \"which algorithm should run\" — swap the branching `if (method === \"card\")` chain for a lookup of interchangeable functions, and adding a payment method stops touching `checkout()` at all.",
            np: "Behavioral pattern <b>भागहरू कसरी कुरा गर्छन् र व्यवहार कसरी बदलिन्छ</b> भन्नेबारे हुन्। <b>Observer</b> ले \"यो हुँदा कसलाई भन्ने\" को जवाफ दिन्छ — subscriber दर्ता हुन्छन्, event बज्छ, चासो राख्ने सबैले प्रतिक्रिया दिन्छन्, र publisher ले कसले सुन्दैछ कहिल्यै जान्दैन। DOM event, Node को `EventEmitter`, state store र WebSocket तह यसै आकारका हुन्। <b>Strategy</b> ले फरक प्रश्नको जवाफ दिन्छ: \"कुन algorithm चलाउने\" — `if (method === \"card\")` को शृंखलालाई साटासाट गर्न मिल्ने function को lookup बनाउनुहोस्, अनि payment method थप्दा `checkout()` छुनै पर्दैन।",
            jp: "振る舞いパターンは<b>部品どうしの会話と、振る舞いの変え方</b>の話。<b>Observer</b> は「これが起きたとき誰に知らせるか」に答える。購読者が登録し、イベントが発火し、関心のある者が反応する。発行側は誰が聞いているかを知らない。DOMイベント・Nodeの `EventEmitter`・状態ストア・WebSocket層はこの形。<b>Strategy</b> は別の問いに答える。「どのアルゴリズムを走らせるか」。`if (method === \"card\")` の連鎖を差し替え可能な関数の表に変えれば、支払い手段を足しても `checkout()` に触れずに済む。",
          },
        },
        {
          type: "code",
          title: { en: "Observer, Strategy, and Command", np: "Observer, Strategy, र Command", jp: "Observer・Strategy・Command" },
          code: `// ══ OBSERVER — notify multiple objects when something changes ════
// Problem: many parts of the system need to react to an event
// (Also called Pub/Sub or EventEmitter pattern)

class EventEmitter {
  #listeners = new Map();

  on(event, fn) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
    this.#listeners.get(event).add(fn);
    return () => this.off(event, fn);  // return unsubscribe function
  }

  off(event, fn) {
    this.#listeners.get(event)?.delete(fn);
  }

  emit(event, ...args) {
    this.#listeners.get(event)?.forEach(fn => fn(...args));
  }
}

const store = new EventEmitter();
const unsubscribe = store.on("userUpdated", (user) => {
  renderHeader(user);
  updateCache(user);
});

store.emit("userUpdated", { id: 1, name: "Alice" });  // both listeners fire
unsubscribe();  // remove the listener when no longer needed

// ══ STRATEGY — swap algorithms at runtime ═════════════════════════
// Problem: you have multiple ways to do the same thing (sort, pay, auth)

const sortStrategies = {
  name:   (items) => [...items].sort((a, b) => a.name.localeCompare(b.name)),
  price:  (items) => [...items].sort((a, b) => a.price - b.price),
  date:   (items) => [...items].sort((a, b) => new Date(b.date) - new Date(a.date)),
};

class ProductList {
  #items;
  #strategy = sortStrategies.name;

  constructor(items)    { this.#items = items; }
  setSortStrategy(name) { this.#strategy = sortStrategies[name]; }
  getSorted()           { return this.#strategy(this.#items); }
}

const list = new ProductList(products);
list.setSortStrategy("price");
list.getSorted();  // sorted by price

// ══ COMMAND — encapsulate an action as an object (enables undo) ════
class TextEditor {
  #text = "";
  #history = [];

  execute(command) {
    this.#text = command.execute(this.#text);
    this.#history.push(command);
  }

  undo() {
    const command = this.#history.pop();
    if (command) this.#text = command.undo(this.#text);
  }

  get text() { return this.#text; }
}

const insertCommand = (text) => ({
  execute: (current) => current + text,
  undo:    (current) => current.slice(0, -text.length),
});

const editor = new TextEditor();
editor.execute(insertCommand("Hello"));
editor.execute(insertCommand(" World"));
editor.text;   // "Hello World"
editor.undo();
editor.text;   // "Hello"`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Command</b> turns an action into a value. Once \"insert this text\" is an object with `execute()` and `undo()` rather than a statement that already ran, you can push it onto a history stack, replay it, queue it, log it or reverse it. That single change is what makes undo/redo, job queues, transactions and keyboard command maps possible — the action outlives the moment it was invoked.",
            np: "<b>Command</b> ले कामलाई मानमा बदल्छ। \"यो text हाल\" चलिसकेको statement होइन, `execute()` र `undo()` भएको object भएपछि, तपाईं यसलाई history stack मा राख्न, फेरि चलाउन, queue गर्न, log गर्न वा उल्ट्याउन सक्नुहुन्छ। त्यही एउटा परिवर्तनले undo/redo, job queue, transaction र keyboard command map सम्भव बनाउँछ — काम आफू बोलाइएको क्षणभन्दा बढी टिक्छ।",
            jp: "<b>Command</b> は動作を値に変える。「このテキストを挿入する」が、すでに実行された文ではなく `execute()` と `undo()` を持つオブジェクトになれば、履歴スタックに積み、再生し、キューに入れ、記録し、巻き戻せる。この一手がundo/redo・ジョブキュー・トランザクション・キーボードのコマンド割り当てを可能にする。動作が、呼ばれた瞬間より長く生きるからだ。",
          },
        },
      ],
    },
    {
      title: { en: "Which pattern solves which problem", np: "कुन pattern ले कुन समस्या हल गर्छ", jp: "どのパターンがどの問題を解くか" },
      blocks: [
        {
          type: "table",
          caption: { en: "Pick by the problem, not by the name", np: "नाम होइन, समस्या हेरेर छान्नुहोस्", jp: "名前ではなく問題で選ぶ" },
          headers: [{ en: "Pattern", np: "Pattern", jp: "パターン" }, { en: "The problem", np: "समस्या", jp: "問題" }, { en: "The core move", np: "मुख्य चाल", jp: "核心の一手" }],
          rows: [
            [{ en: "Factory", np: "Factory", jp: "Factory" }, { en: "Creation has logic or several implementations", np: "बनाउनुमा logic वा धेरै implementation छ", jp: "生成にロジックや複数の実装がある" }, { en: "Centralise creation behind one call", np: "एउटै call पछाडि creation केन्द्रित गर्नु", jp: "生成を1つの呼び出しの裏にまとめる" }],
            [{ en: "Builder", np: "Builder", jp: "Builder" }, { en: "An object has many optional settings", np: "Object मा धेरै वैकल्पिक setting छन्", jp: "オブジェクトに任意の設定が多い" }, { en: "Assemble it step by step, readably", np: "पढ्न मिल्ने गरी क्रमैसँग जोड्नु", jp: "読める形で段階的に組み立てる" }],
            [{ en: "Singleton", np: "Singleton", jp: "Singleton" }, { en: "One shared instance is genuinely needed", np: "एउटै साझा instance साँच्चै चाहिन्छ", jp: "共有インスタンスが本当に1つ必要" }, { en: "Reuse one instance, ideally a module export", np: "एउटै instance पुनःप्रयोग, module export भए उत्तम", jp: "1つを再利用。できればモジュールのエクスポート" }],
            [{ en: "Adapter", np: "Adapter", jp: "Adapter" }, { en: "Two interfaces do not line up", np: "दुई interface मिल्दैनन्", jp: "2つのインターフェースが噛み合わない" }, { en: "Translate one into the other", np: "एउटालाई अर्कोमा अनुवाद गर्नु", jp: "一方をもう一方に翻訳する" }],
            [{ en: "Facade", np: "Facade", jp: "Facade" }, { en: "A subsystem is complicated to call", np: "Subsystem बोलाउन जटिल छ", jp: "下位systemの呼び出しが複雑" }, { en: "Put one simple front door on it", np: "यसमा एउटै सरल ढोका राख्नु", jp: "簡単な入口をひとつ付ける" }],
            [{ en: "Decorator", np: "Decorator", jp: "Decorator" }, { en: "Behaviour must be added without editing the original", np: "मूल नबदली व्यवहार थप्नुपर्छ", jp: "元を書き換えずに振る舞いを足したい" }, { en: "Wrap the function and return a new one", np: "Function बेरेर नयाँ फर्काउनु", jp: "関数を包んで新しい関数を返す" }],
            [{ en: "Observer", np: "Observer", jp: "Observer" }, { en: "Many parts must react to one event", np: "एउटै event मा धेरै भागले प्रतिक्रिया दिनुपर्छ", jp: "1つの出来事に多くが反応する必要がある" }, { en: "Notify registered subscribers", np: "दर्ता भएका subscriber लाई खबर गर्नु", jp: "登録済みの購読者に通知する" }],
            [{ en: "Strategy", np: "Strategy", jp: "Strategy" }, { en: "Several algorithms do the same job", np: "उही कामका धेरै algorithm छन्", jp: "同じ仕事に複数のアルゴリズムがある" }, { en: "Look the algorithm up and call it", np: "Algorithm खोजेर बोलाउनु", jp: "アルゴリズムを引いて呼ぶ" }],
            [{ en: "Command", np: "Command", jp: "Command" }, { en: "Actions must be stored, queued or undone", np: "काम राख्नु, queue गर्नु वा उल्ट्याउनुपर्छ", jp: "動作を保存・キュー・取り消ししたい" }, { en: "Turn the action into an object", np: "काम लाई object बनाउनु", jp: "動作をオブジェクトにする" }],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "Before introducing any of them, ask one question: <b>what complexity am I removing by adding this abstraction?</b> If the honest answer is none, skip the pattern. Two confusions are worth naming as well. <b>Observer is not Strategy</b> — one answers \"who gets told\", the other answers \"which algorithm runs\". And a deep inheritance chain is rarely the answer in JavaScript; composing small behaviours into an object usually beats `Animal → Mammal → Dog → SpecialDog`. The real skill is not knowing the names. It is looking at tangled code and saying: these two responsibilities change for different reasons, so let us separate them.",
            np: "कुनै पनि प्रयोग गर्नुअघि एउटा प्रश्न सोध्नुहोस्: <b>यो abstraction थपेर म कुन जटिलता हटाउँदैछु?</b> इमान्दार जवाफ \"केही होइन\" हो भने, pattern छाड्नुहोस्। दुई अलमल पनि नाम लिन लायक छन्। <b>Observer र Strategy फरक हुन्</b> — एउटाले \"कसलाई भन्ने\", अर्कोले \"कुन algorithm चलाउने\" को जवाफ दिन्छ। र JavaScript मा गहिरो inheritance शृंखला विरलै जवाफ हुन्छ; साना व्यवहार object मा जोड्नु प्रायः `Animal → Mammal → Dog → SpecialDog` भन्दा राम्रो हुन्छ। वास्तविक सीप नाम जान्नु होइन। अल्झिएको code हेरेर भन्न सक्नु हो: यी दुई जिम्मेवारी फरक कारणले बदलिन्छन्, त्यसैले छुट्याऔं।",
            jp: "どれを持ち出す前にも、問いはひとつ。<b>この抽象を足して、私はどの複雑さを取り除いているのか。</b>正直な答えが「何も」なら、そのパターンは使わない。混同しやすい点も2つ。<b>ObserverとStrategyは別物</b>で、片方は「誰に知らせるか」、もう片方は「どのアルゴリズムを走らせるか」に答える。そしてJavaScriptで深い継承の連鎖が答えになることはまれで、小さな振る舞いをオブジェクトに合成する方が `Animal → Mammal → Dog → SpecialDog` に勝る。本当の技量は名前を知ることではない。絡んだコードを見て「この2つの責務は別の理由で変わるから分けよう」と言えることだ。",
          },
        },
      ],
    },
  ],
  quiz: [
    {
      question: { en: "Which pattern hides object creation logic behind one call?", np: "कुन pattern ले object creation को logic एउटै call पछाडि लुकाउँछ?", jp: "オブジェクト生成のロジックを1つの呼び出しの裏に隠すのはどれか?" },
      options: [
        { en: "Observer", np: "Observer", jp: "Observer" },
        { en: "Command", np: "Command", jp: "Command" },
        { en: "Adapter", np: "Adapter", jp: "Adapter" },
        { en: "Factory", np: "Factory", jp: "Factory" },
      ],
      correctIndex: 3,
      explanation: { en: "Callers depend on the result rather than on a concrete constructor.", np: "Caller concrete constructor होइन, नतिजामा निर्भर हुन्छ।", jp: "呼び出し側は具象コンストラクタではなく結果に依存する。" },
    },
    {
      question: { en: "An object has 15 optional configuration values. Which pattern helps?", np: "Object मा 15 वटा वैकल्पिक configuration मान छन्। कुन pattern ले मद्दत गर्छ?", jp: "オブジェクトに任意の設定値が15個ある。どのパターンが助けになるか?" },
      options: [
        { en: "Adapter", np: "Adapter", jp: "Adapter" },
        { en: "Observer", np: "Observer", jp: "Observer" },
        { en: "Builder", np: "Builder", jp: "Builder" },
        { en: "Singleton", np: "Singleton", jp: "Singleton" },
      ],
      correctIndex: 2,
      explanation: { en: "Step-by-step assembly reads far better than 15 positional arguments.", np: "15 positional argument भन्दा क्रमैसँग जोड्नु धेरै राम्रो पढिन्छ।", jp: "15個の位置引数より、段階的な組み立ての方がずっと読みやすい。" },
    },
    {
      question: { en: "You must make a legacy API fit your application's interface. Which pattern?", np: "पुरानो API लाई आफ्नो application को interface मा मिलाउनुपर्छ। कुन pattern?", jp: "レガシーAPIを自分のアプリのインターフェースに合わせたい。どのパターンか?" },
      options: [
        { en: "Strategy", np: "Strategy", jp: "Strategy" },
        { en: "Facade", np: "Facade", jp: "Facade" },
        { en: "Adapter", np: "Adapter", jp: "Adapter" },
        { en: "Command", np: "Command", jp: "Command" },
      ],
      correctIndex: 2,
      explanation: { en: "A thin wrapper translates without changing either side.", np: "पातलो wrapper ले दुबै पक्ष नबदली अनुवाद गर्छ।", jp: "薄いラッパーが双方を変えずに翻訳する。" },
    },
    {
      question: { en: "You want to add logging to a function without editing it. Which pattern?", np: "Function नसम्पादन गरी logging थप्न चाहनुहुन्छ। कुन pattern?", jp: "関数を編集せずログを足したい。どのパターンか?" },
      options: [
        { en: "Decorator", np: "Decorator", jp: "Decorator" },
        { en: "Factory", np: "Factory", jp: "Factory" },
        { en: "Singleton", np: "Singleton", jp: "Singleton" },
        { en: "Observer", np: "Observer", jp: "Observer" },
      ],
      correctIndex: 0,
      explanation: { en: "Wrap it, do something before and after, return the result untouched.", np: "बेर्नुहोस्, अघि र पछि केही गर्नुहोस्, नतिजा जस्ताको तस्तै फर्काउनुहोस्।", jp: "包んで前後に処理を挟み、結果はそのまま返す。" },
    },
    {
      question: { en: "Three algorithms compute shipping cost and one is chosen at runtime. Which pattern?", np: "तीन algorithm ले shipping cost निकाल्छन् र एउटा runtime मा छानिन्छ। कुन pattern?", jp: "配送料の計算が3通りあり、実行時に選ぶ。どのパターンか?" },
      options: [
        { en: "Builder", np: "Builder", jp: "Builder" },
        { en: "Strategy", np: "Strategy", jp: "Strategy" },
        { en: "Facade", np: "Facade", jp: "Facade" },
        { en: "Adapter", np: "Adapter", jp: "Adapter" },
      ],
      correctIndex: 1,
      explanation: { en: "Look the algorithm up instead of branching inside the caller.", np: "Caller भित्र शाखा बनाउनुको सट्टा algorithm खोज्नुहोस्।", jp: "呼び出し側で分岐せず、アルゴリズムを引く。" },
    },
    {
      question: { en: "Several parts of the app must react when `\"orderCreated\"` happens. Which pattern?", np: "`\"orderCreated\"` हुँदा app का धेरै भागले प्रतिक्रिया दिनुपर्छ। कुन pattern?", jp: "`\"orderCreated\"` が起きたとき、アプリの複数箇所が反応する必要がある。どのパターンか?" },
      options: [
        { en: "Factory", np: "Factory", jp: "Factory" },
        { en: "Observer", np: "Observer", jp: "Observer" },
        { en: "Command", np: "Command", jp: "Command" },
        { en: "Builder", np: "Builder", jp: "Builder" },
      ],
      correctIndex: 1,
      explanation: { en: "The publisher never needs to know who subscribed.", np: "Publisher ले कसले subscribe गर्‍यो जान्नै पर्दैन।", jp: "発行側は誰が購読したかを知る必要がない。" },
    },
    {
      question: { en: "Why does Command suit an undo system?", np: "Undo system लाई Command किन सुहाउँछ?", jp: "CommandがUndoに向くのはなぜか?" },
      options: [
        { en: "It represents an action as an object that can be stored and reversed", np: "यसले काम लाई राख्न र उल्ट्याउन मिल्ने object का रूपमा जनाउँछ", jp: "動作を、保存も巻き戻しもできるオブジェクトとして表すから" },
        { en: "It creates objects automatically", np: "यसले स्वतः object बनाउँछ", jp: "自動でオブジェクトを作るから" },
        { en: "It prevents inheritance", np: "यसले inheritance रोक्छ", jp: "継承を防ぐから" },
        { en: "It makes every method static", np: "यसले हरेक method static बनाउँछ", jp: "すべてのメソッドを静的にするから" },
      ],
      correctIndex: 0,
      explanation: { en: "The action outlives the moment it was invoked, so history becomes possible.", np: "काम बोलाइएको क्षणभन्दा बढी टिक्छ, त्यसैले history सम्भव हुन्छ।", jp: "動作が呼ばれた瞬間より長く生きるので、履歴が成り立つ。" },
    },
    {
      question: { en: "What is the difference between Observer and Strategy?", np: "Observer र Strategy बीचको भिन्नता के हो?", jp: "ObserverとStrategyの違いは?" },
      options: [
        { en: "Observer decides who is notified; Strategy decides which algorithm runs", np: "Observer ले कसलाई खबर गर्ने तय गर्छ; Strategy ले कुन algorithm चल्ने", jp: "Observerは誰に知らせるかを、Strategyはどのアルゴリズムを走らせるかを決める" },
        { en: "Observer is synchronous and Strategy is asynchronous", np: "Observer synchronous र Strategy asynchronous हो", jp: "Observerは同期、Strategyは非同期" },
        { en: "They are two names for the same pattern", np: "ती एउटै pattern का दुई नाम हुन्", jp: "同じパターンの別名" },
      ],
      correctIndex: 0,
      explanation: { en: "One is about broadcast, the other about interchangeable behaviour.", np: "एउटा प्रसारणबारे हो, अर्को साटासाट गर्न मिल्ने व्यवहारबारे।", jp: "一方は配信の話、もう一方は差し替え可能な振る舞いの話。" },
    },
    {
      question: { en: "What is the strongest argument against reaching for Singleton?", np: "Singleton प्रयोग नगर्ने सबैभन्दा बलियो तर्क के हो?", jp: "Singletonを避ける最も強い理由は?" },
      options: [
        { en: "It is slower than a plain object", np: "यो सादा object भन्दा ढिलो छ", jp: "素のオブジェクトより遅いから" },
        { en: "It is shared global state that makes dependencies invisible and testing harder", np: "यो साझा global state हो जसले dependency अदृश्य बनाउँछ र परीक्षण गाह्रो पार्छ", jp: "依存を見えなくしテストを難しくする、共有のグローバル状態だから" },
        { en: "It cannot be used with classes", np: "यो class सँग प्रयोग गर्न मिल्दैन", jp: "クラスと使えないから" },
      ],
      correctIndex: 1,
      explanation: { en: "`createUserService(database)` states the dependency; `getInstance()` hides it.", np: "`createUserService(database)` ले dependency भन्छ; `getInstance()` ले लुकाउँछ।", jp: "`createUserService(database)` は依存を明示し、`getInstance()` は隠す。" },
    },
    {
      question: { en: "What question should come before introducing any pattern?", np: "कुनै पनि pattern प्रयोग गर्नुअघि कुन प्रश्न आउनुपर्छ?", jp: "パターンを導入する前に立てるべき問いは?" },
      options: [
        { en: "Which pattern is most advanced?", np: "कुन pattern सबैभन्दा उन्नत छ?", jp: "どのパターンが最も高度か" },
        { en: "Which pattern will reviewers recognise?", np: "Reviewer ले कुन pattern चिन्लान्?", jp: "レビュアーが分かるのはどれか" },
        { en: "What complexity am I removing by adding this abstraction?", np: "यो abstraction थपेर म कुन जटिलता हटाउँदैछु?", jp: "この抽象を足して、どの複雑さを取り除いているのか" },
      ],
      correctIndex: 2,
      explanation: { en: "If the honest answer is none, the pattern is decoration, not design.", np: "इमान्दार जवाफ \"केही होइन\" हो भने, त्यो pattern सजावट हो, design होइन।", jp: "正直な答えが「何も」なら、それは設計ではなく装飾。" },
    },
  ],
  faq: [
    {
      question: { en: "Should I memorize design pattern names for interviews?", np: "Interviews का लागि design pattern names memorize गर्नु पर्छ?", jp: "面接でデザインパターン名を暗記すべきか？" },
      answer: {
        en: "Know the most common ones by name and use case: Singleton (one instance), Factory (create objects without knowing the class), Observer/Pub-Sub (notify listeners), Strategy (swap algorithms), Decorator (add behaviour). More important than memorizing names is being able to explain the **problem each pattern solves** and recognize them in code you encounter. Interviewers care more about 'why would you use this' than 'can you recite the GoF definition'.",
        np: "Most common patterns नाम र use case थाहा गर्नुहोस्: Singleton, Factory, Observer, Strategy, Decorator। Names memorize गर्नुभन्दा **हर pattern कुन problem solve गर्छ** explain गर्न र code मा recognize गर्न सक्नु बढी important। Interviewers लाई 'why would you use this' बढी care हुन्छ।",
        jp: "よく使われるパターンの名前と用途を知っておく: Singleton・Factory・Observer・Strategy・Decorator。名前の暗記より**各パターンが解決する問題**を説明でき、コードで認識できることが重要。面接官は「なぜ使うか」を重視する。",
      },
    },
    {
      question: { en: "What is the difference between Observer and Pub/Sub?", np: "Observer र Pub/Sub मा के फरक?", jp: "ObserverとPub/Subの違いは？" },
      answer: {
        en: "In the classic Observer pattern, subjects and observers know about each other directly — the subject holds references to its observers. In Pub/Sub (Publish/Subscribe), publishers and subscribers are decoupled through a message broker or event bus — they do not know about each other at all. Node.js's EventEmitter is Observer (event emitter holds listeners). Redis Pub/Sub, RabbitMQ, and Kafka are Pub/Sub (message broker sits in between). In JavaScript, the terms are used interchangeably in practice.",
        np: "Classic Observer pattern मा subjects र observers एकअर्कालाई directly जान्छन्। Pub/Sub मा publishers र subscribers message broker मार्फत decoupled हुन्छन् — एकअर्कालाई जान्दैनन्। Node.js EventEmitter = Observer। Redis Pub/Sub, Kafka = Pub/Sub। JS practice मा terms interchangeably use हुन्छन्।",
        jp: "古典的なObserverではsubjectとobserverが直接知り合う。Pub/Subではメッセージブローカーを介して完全に分離。Node.jsのEventEmitter=Observer。Redis Pub/Sub・Kafka=Pub/Sub。実際のJS開発では同義として使われることが多い。",
      },
    },
  ],
};
