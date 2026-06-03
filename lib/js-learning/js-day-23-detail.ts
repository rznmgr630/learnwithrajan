import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_23_DETAIL: RoadmapDayDetail = {
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
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "tv-_1er1mWI", title: "JavaScript Design Patterns" },
      ],
    },
    {
      title: { en: "Creational patterns", np: "Creational patterns", jp: "生成パターン" },
      blocks: [
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
      ],
    },
    {
      title: { en: "Structural patterns", np: "Structural patterns", jp: "構造パターン" },
      blocks: [
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
      ],
    },
    {
      title: { en: "Behavioral patterns", np: "Behavioral patterns", jp: "振る舞いパターン" },
      blocks: [
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
      ],
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
