import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_28_LESSONS: JsLessonDay = {
  day: 28,
  title: { en: "JavaScript design patterns — creational, structural & behavioral", np: "JavaScript design pattern — creational, structural र behavioral", jp: "JavaScriptのデザインパターン — 生成・構造・振る舞い" },
  totalMinutes: 27,
  difficulty: { en: "Advanced", np: "उन्नत", jp: "上級" },
  lessons: [
    {
      id: "creational-patterns",
      title: { en: "Creational — Factory, Builder, Singleton", np: "Creational — Factory, Builder, Singleton", jp: "生成 — Factory・Builder・Singleton" },
      durationMinutes: 9,
      explanation: {
        en: "A <b>design pattern</b> is a reusable way of arranging code to solve a problem that keeps coming back. It is not a library or a snippet you copy. It is a shape you recognise.\n\nJavaScript is flexible enough that most classic patterns come out as plain <b>functions, closures and objects</b> rather than the class hierarchies the original catalogue described. So the useful skill is not memorising twenty names — it is spotting the <b>problem</b> and knowing which shape makes the code simpler.\n\nThey come in three families:\n\n```text\n                 DESIGN PATTERNS\n                       │\n        ┌──────────────┼──────────────┐\n        ↓              ↓              ↓\n   CREATIONAL      STRUCTURAL     BEHAVIORAL\n        │              │              │\n        ↓              ↓              ↓\n     Factory        Adapter        Observer\n     Builder        Facade         Strategy\n     Singleton      Decorator      Command\n```\n\n---\nCreational patterns answer one question: <b>where should object creation happen?</b>\n\n---\n\n### 1. Basic — Factory\n\nA <b>Factory</b> is a function that decides which object to build, so the caller does not have to know:\n\n```javascript\nfunction createUser(name, role) {\n  return { name, role };\n}\n```\n\nThat is already a factory. It earns its keep when creation involves a choice:\n\n```javascript\nclass EmailNotification {\n  send(message) { console.log(`Email: ${message}`); }\n}\n\nclass SMSNotification {\n  send(message) { console.log(`SMS: ${message}`); }\n}\n\nfunction createNotification(type) {\n  if (type === \"email\") return new EmailNotification();\n  if (type === \"sms\") return new SMSNotification();\n  throw new Error(\"Unknown notification type\");\n}\n```\n\nThe rest of the app calls `notification.send(...)` and never learns which class it got. Once there are more than two, a lookup table reads better than a growing `if` chain:\n\n```javascript\nconst factories = {\n  email: () => new EmailNotification(),\n  sms: () => new SMSNotification()\n};\n\nfunction createNotification(type) {\n  const factory = factories[type];\n  if (!factory) throw new Error(`Unsupported: ${type}`);\n  return factory();\n}\n```\n\nAdding a third type is now one line.\n\n---\n\n### 2. Intermediate — Builder\n\nA <b>Builder</b> assembles an object step by step. It rescues a constructor nobody can read:\n\n```javascript\nconst user = new User(\"Alice\", \"alice@example.com\", 30, \"admin\", true, \"US\", \"English\");\n```\n\nWhat is `true`? What is `\"US\"`? Compare:\n\n```javascript\nclass UserBuilder {\n  constructor() { this.user = {}; }\n\n  name(name)   { this.user.name = name;   return this; }\n  email(email) { this.user.email = email; return this; }\n  role(role)   { this.user.role = role;   return this; }\n\n  build() { return this.user; }\n}\n\nconst user = new UserBuilder()\n  .name(\"Alice\")\n  .email(\"alice@example.com\")\n  .role(\"admin\")\n  .build();\n```\n\nEach method returns `this`, which is what lets the calls chain. Use a builder when an object has many <b>optional</b> settings; for `{ name }` it is pure ceremony.\n\n---\n\n### 3. Advanced — Singleton, and why to hesitate\n\nA <b>Singleton</b> guarantees one shared instance:\n\n```javascript\nclass Logger {\n  static instance;\n\n  constructor() {\n    if (Logger.instance) return Logger.instance;\n    Logger.instance = this;\n  }\n}\n\nnew Logger() === new Logger();   // true\n```\n\nIn modern JavaScript you rarely need that machinery. A module-level export gives you the same thing, because a module runs once and every importer shares the result:\n\n```javascript\n// logger.js\nexport const logger = new Logger();\n```\n\nThe real caution is design, not syntax. A singleton is shared <b>global state</b> wearing a pattern name. It hides dependencies: `Database.getInstance()` is far harder to test than `createUserService(database)`, where the dependency is right there in the signature. Prefer passing the thing in.",
        np: "<b>Design pattern</b> भनेको बारम्बार आइरहने समस्या हल गर्न code मिलाउने पुनःप्रयोग्य तरिका हो। यो library वा नक्कल गर्ने snippet होइन। यो चिन्न सकिने आकार हो।\n\nJavaScript यति लचिलो छ कि धेरैजसो classic pattern मूल सूचीका class hierarchy होइन, सादा <b>function, closure र object</b> बनेर आउँछन्। त्यसैले उपयोगी सीप बीसवटा नाम रट्नु होइन — <b>समस्या</b> चिन्नु र कुन आकारले code सरल बनाउँछ जान्नु हो।\n\nयी तीन परिवारमा आउँछन्:\n\n```text\n                 DESIGN PATTERNS\n                       │\n        ┌──────────────┼──────────────┐\n        ↓              ↓              ↓\n   CREATIONAL      STRUCTURAL     BEHAVIORAL\n        │              │              │\n        ↓              ↓              ↓\n     Factory        Adapter        Observer\n     Builder        Facade         Strategy\n     Singleton      Decorator      Command\n```\n\n---\nCreational pattern एउटै प्रश्नको जवाफ दिन्छन्: <b>object कहाँ बन्नुपर्छ?</b>\n\n---\n\n### 1. आधारभूत — Factory\n\n<b>Factory</b> त्यस्तो function हो जसले कुन object बनाउने तय गर्छ, ताकि caller लाई थाहा हुनु नपरोस्:\n\n```javascript\nfunction createUser(name, role) {\n  return { name, role };\n}\n```\n\nयो पहिले नै factory हो। बनाउनुमा छनोट हुँदा यसले ठाउँ कमाउँछ:\n\n```javascript\nclass EmailNotification {\n  send(message) { console.log(`Email: ${message}`); }\n}\n\nclass SMSNotification {\n  send(message) { console.log(`SMS: ${message}`); }\n}\n\nfunction createNotification(type) {\n  if (type === \"email\") return new EmailNotification();\n  if (type === \"sms\") return new SMSNotification();\n  throw new Error(\"Unknown notification type\");\n}\n```\n\nबाँकी app ले `notification.send(...)` बोलाउँछ र कुन class पायो कहिल्यै जान्दैन। दुईभन्दा बढी भएपछि, बढ्दो `if` शृंखला भन्दा lookup table राम्रो पढिन्छ:\n\n```javascript\nconst factories = {\n  email: () => new EmailNotification(),\n  sms: () => new SMSNotification()\n};\n\nfunction createNotification(type) {\n  const factory = factories[type];\n  if (!factory) throw new Error(`Unsupported: ${type}`);\n  return factory();\n}\n```\n\nअब तेस्रो किसिम थप्नु एक लाइनको काम हो।\n\n---\n\n### 2. मध्यम — Builder\n\n<b>Builder</b> ले object क्रमैसँग जोड्छ। यसले कसैले पढ्न नसक्ने constructor बचाउँछ:\n\n```javascript\nconst user = new User(\"Alice\", \"alice@example.com\", 30, \"admin\", true, \"US\", \"English\");\n```\n\n`true` के हो? `\"US\"` के हो? तुलना गर्नुहोस्:\n\n```javascript\nclass UserBuilder {\n  constructor() { this.user = {}; }\n\n  name(name)   { this.user.name = name;   return this; }\n  email(email) { this.user.email = email; return this; }\n  role(role)   { this.user.role = role;   return this; }\n\n  build() { return this.user; }\n}\n\nconst user = new UserBuilder()\n  .name(\"Alice\")\n  .email(\"alice@example.com\")\n  .role(\"admin\")\n  .build();\n```\n\nहरेक method ले `this` फर्काउँछ, त्यसैले call जोडिन्छन्। Object मा धेरै <b>वैकल्पिक</b> setting हुँदा builder प्रयोग गर्नुहोस्; `{ name }` का लागि यो निरर्थक तामझाम हो।\n\n---\n\n### 3. उन्नत — Singleton, र किन अलमलिने\n\n<b>Singleton</b> ले एउटै साझा instance को ग्यारेन्टी गर्छ:\n\n```javascript\nclass Logger {\n  static instance;\n\n  constructor() {\n    if (Logger.instance) return Logger.instance;\n    Logger.instance = this;\n  }\n}\n\nnew Logger() === new Logger();   // true\n```\n\nआधुनिक JavaScript मा यो संयन्त्र विरलै चाहिन्छ। Module-स्तरको export ले उही दिन्छ, किनकि module एक पटक चल्छ र हरेक import गर्नेले नतिजा बाँड्छ:\n\n```javascript\n// logger.js\nexport const logger = new Logger();\n```\n\nवास्तविक सावधानी design को हो, syntax को होइन। Singleton pattern को नाम लगाएको साझा <b>global state</b> हो। यसले dependency लुकाउँछ: `Database.getInstance()` लाई `createUserService(database)` भन्दा परीक्षण गर्न धेरै गाह्रो हुन्छ, जहाँ dependency signature मै छ। भित्र पठाउने तरिका रोज्नुहोस्।",
        jp: "<b>デザインパターン</b>とは、繰り返し現れる問題を解くためのコードの組み立て方の再利用可能な形。ライブラリでも、貼り付ける断片でもない。見て分かる「形」だ。\n\nJavaScriptは柔軟なので、多くの古典的パターンは元のカタログのクラス階層ではなく、素の<b>関数・クロージャ・オブジェクト</b>として現れる。だから役立つ技量は20個の名前を覚えることではなく、<b>問題</b>を見抜き、どの形がコードを簡単にするかを知ることだ。\n\nパターンは3つの系統に分かれる:\n\n```text\n                 DESIGN PATTERNS\n                       │\n        ┌──────────────┼──────────────┐\n        ↓              ↓              ↓\n   CREATIONAL      STRUCTURAL     BEHAVIORAL\n        │              │              │\n        ↓              ↓              ↓\n     Factory        Adapter        Observer\n     Builder        Facade         Strategy\n     Singleton      Decorator      Command\n```\n\n---\n生成パターンが答えるのはひとつの問いだ。<b>オブジェクト生成はどこで行うべきか。</b>\n\n---\n\n### 1. 基本 — Factory\n\n<b>Factory</b> はどのオブジェクトを作るかを決める関数で、呼び出し側は知らなくて済む:\n\n```javascript\nfunction createUser(name, role) {\n  return { name, role };\n}\n```\n\nこれでもう factory だ。生成に選択が絡むとき、その値打ちが出る:\n\n```javascript\nclass EmailNotification {\n  send(message) { console.log(`Email: ${message}`); }\n}\n\nclass SMSNotification {\n  send(message) { console.log(`SMS: ${message}`); }\n}\n\nfunction createNotification(type) {\n  if (type === \"email\") return new EmailNotification();\n  if (type === \"sms\") return new SMSNotification();\n  throw new Error(\"Unknown notification type\");\n}\n```\n\nアプリの残りは `notification.send(...)` を呼ぶだけで、どのクラスを受け取ったか知らない。3種類を超えたら、伸びる `if` の連鎖より参照テーブルが読みやすい:\n\n```javascript\nconst factories = {\n  email: () => new EmailNotification(),\n  sms: () => new SMSNotification()\n};\n\nfunction createNotification(type) {\n  const factory = factories[type];\n  if (!factory) throw new Error(`Unsupported: ${type}`);\n  return factory();\n}\n```\n\n種類の追加が1行で済む。\n\n---\n\n### 2. 中級 — Builder\n\n<b>Builder</b> はオブジェクトを段階的に組み立てる。誰も読めないコンストラクタを救う:\n\n```javascript\nconst user = new User(\"Alice\", \"alice@example.com\", 30, \"admin\", true, \"US\", \"English\");\n```\n\n`true` は何で、`\"US\"` は何か。比べてみる:\n\n```javascript\nclass UserBuilder {\n  constructor() { this.user = {}; }\n\n  name(name)   { this.user.name = name;   return this; }\n  email(email) { this.user.email = email; return this; }\n  role(role)   { this.user.role = role;   return this; }\n\n  build() { return this.user; }\n}\n\nconst user = new UserBuilder()\n  .name(\"Alice\")\n  .email(\"alice@example.com\")\n  .role(\"admin\")\n  .build();\n```\n\n各メソッドが `this` を返すからこそ、呼び出しが繋がる。<b>任意の</b>設定が多いオブジェクトに使う。`{ name }` に使えば儀式にすぎない。\n\n---\n\n### 3. 上級 — Singleton、そしてためらう理由\n\n<b>Singleton</b> は共有インスタンスをひとつに保つ:\n\n```javascript\nclass Logger {\n  static instance;\n\n  constructor() {\n    if (Logger.instance) return Logger.instance;\n    Logger.instance = this;\n  }\n}\n\nnew Logger() === new Logger();   // true\n```\n\n現代のJavaScriptでこの仕掛けが要ることは少ない。モジュールは一度だけ実行され、取り込む側は同じ結果を共有するので、モジュールレベルのエクスポートで同じことができる:\n\n```javascript\n// logger.js\nexport const logger = new Logger();\n```\n\n本当の注意は構文ではなく設計にある。Singletonはパターン名をまとった共有の<b>グローバル状態</b>で、依存を隠す。`Database.getInstance()` は、依存がシグネチャに書かれた `createUserService(database)` よりずっとテストしにくい。渡せるなら渡す。",
      },
      diagram: `Factory: the caller asks for a result, not a class

createNotification("email")
        │
        ▼
   ┌─────────────┐
   │  factory    │  decides which class
   └─────────────┘
        │
        ▼
 EmailNotification   the caller never named it


Builder: each method returns this, so the calls chain

new UserBuilder()
   .name("Alice")     → this
   .email("a@b.com")  → this
   .role("admin")     → this
   .build()           → the finished object


Singleton: one instance, but also hidden global state

Database.getInstance()        createUserService(database)
        │                                │
        ▼                                ▼
 dependency is invisible        dependency is in the signature
 hard to test                   easy to test`,
      codeExample: {
        title: { en: "Factory, Builder and Singleton in practice", np: "Factory, Builder र Singleton व्यवहारमा", jp: "Factory・Builder・Singletonの実際" },
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
      keyTakeaways: [
        { en: "Creational patterns decide <b>where object creation happens</b>.", np: "Creational pattern ले <b>object कहाँ बन्छ</b> तय गर्छन्।", jp: "生成パターンは<b>オブジェクト生成の場所</b>を決める。" },
        { en: "A <b>Factory</b> hides which class is instantiated, so callers depend on the result.", np: "<b>Factory</b> ले कुन class बन्दैछ लुकाउँछ, त्यसैले caller नतिजामा निर्भर हुन्छ।", jp: "<b>Factory</b> はどのクラスを作るかを隠し、呼び出し側は結果に依存する。" },
        { en: "Past two options, a <b>lookup table</b> beats a growing `if/else` chain.", np: "दुई विकल्पभन्दा बढी भएपछि, बढ्दो `if/else` भन्दा <b>lookup table</b> राम्रो।", jp: "選択肢が2つを超えたら、伸びる `if/else` より<b>参照テーブル</b>。" },
        { en: "A <b>Builder</b> assembles step by step; each method returns `this` so calls chain.", np: "<b>Builder</b> ले क्रमैसँग जोड्छ; हरेक method ले `this` फर्काउँछ त्यसैले call जोडिन्छन्।", jp: "<b>Builder</b> は段階的に組み立てる。各メソッドが `this` を返すので呼び出しが繋がる。" },
        { en: "Builders pay off for <b>many optional settings</b>, not for a two-field object.", np: "Builder <b>धेरै वैकल्पिक setting</b> मा काम लाग्छ, दुई field को object मा होइन।", jp: "Builderが効くのは<b>任意の設定が多い</b>とき。2項目のオブジェクトには不要。" },
        { en: "A module-level export usually replaces a hand-written <b>Singleton</b>.", np: "Module-स्तरको export ले प्रायः हातले लेखिएको <b>Singleton</b> प्रतिस्थापन गर्छ।", jp: "手書きの<b>Singleton</b>は、たいていモジュールレベルのエクスポートで置き換わる。" },
        { en: "A singleton is shared <b>global state</b> — it hides dependencies and makes testing harder.", np: "Singleton साझा <b>global state</b> हो — यसले dependency लुकाउँछ र परीक्षण गाह्रो पार्छ।", jp: "Singletonは共有の<b>グローバル状態</b>で、依存を隠しテストを難しくする。" },
      ],
      commonMistakes: [
        { en: "<b>Forgetting `return this` in a builder method</b> — the chain breaks immediately, because the next call runs on `undefined`.", np: "<b>Builder method मा `return this` बिर्सनु</b> — chain तुरुन्तै भाँचिन्छ, किनकि अर्को call `undefined` मा चल्छ।", jp: "<b>Builderのメソッドで `return this` を忘れる</b> — 次の呼び出しが `undefined` に対して走るので、連鎖はすぐ壊れる。" },
        { en: "<b>Reaching for a Builder on a small object</b> — `createUser(name)` needs a function, not a class with five chained setters.", np: "<b>सानो object मा Builder प्रयोग गर्नु</b> — `createUser(name)` लाई पाँच chained setter भएको class होइन, function चाहिन्छ।", jp: "<b>小さなオブジェクトにBuilderを持ち出す</b> — `createUser(name)` に必要なのは関数で、5つのセッターを持つクラスではない。" },
        { en: "<b>Using a Singleton as a shortcut to shared state</b> — it works until you try to test it, or need two configurations at once.", np: "<b>साझा अवस्थाको सजिलो बाटो का रूपमा Singleton प्रयोग गर्नु</b> — परीक्षण गर्न खोज्दा, वा एकैचोटि दुई configuration चाहिँदासम्म चल्छ।", jp: "<b>共有状態への近道としてSingletonを使う</b> — テストしようとするまで、あるいは設定が2つ要るまでは動く。" },
        { en: "<b>Naming a factory after the class it returns</b> — `createEmailNotification()` re-exposes the choice the factory existed to hide.", np: "<b>Factory लाई फर्काउने class कै नाम दिनु</b> — `createEmailNotification()` ले factory ले लुकाउन खोजेको छनोट फेरि देखाउँछ।", jp: "<b>返すクラス名でファクトリを名付ける</b> — `createEmailNotification()` は、ファクトリが隠すはずだった選択をまた露わにする。" },
      ],
      quiz: [
        {
          question: { en: "Which pattern hides object creation logic behind one call?", np: "कुन pattern ले object creation को logic एउटै call पछाडि लुकाउँछ?", jp: "オブジェクト生成のロジックを1つの呼び出しの裏に隠すのはどれか?" },
          options: [
            { en: "Factory", np: "Factory", jp: "Factory" },
            { en: "Observer", np: "Observer", jp: "Observer" },
            { en: "Adapter", np: "Adapter", jp: "Adapter" },
            { en: "Command", np: "Command", jp: "Command" },
          ],
          correctIndex: 0,
          explanation: { en: "Callers depend on the result rather than on a concrete constructor.", np: "Caller concrete constructor होइन, नतिजामा निर्भर हुन्छ।", jp: "呼び出し側は具象コンストラクタではなく結果に依存する。" },
        },
        {
          question: { en: "An object has 15 optional configuration values. Which pattern helps?", np: "Object मा 15 वैकल्पिक configuration मान छन्। कुन pattern ले मद्दत गर्छ?", jp: "任意の設定値が15個あるオブジェクト。どのパターンが助けになるか?" },
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
          question: { en: "Why does each builder method end with `return this`?", np: "हरेक builder method `return this` ले किन टुंगिन्छ?", jp: "Builderの各メソッドが `return this` で終わるのはなぜか?" },
          options: [
            { en: "So the next method can be called on the same builder", np: "अर्को method उही builder मा बोलाउन सकियोस् भनेर", jp: "次のメソッドを同じビルダーに対して呼べるようにするため" },
            { en: "To copy the object", np: "Object copy गर्न", jp: "オブジェクトを複製するため" },
            { en: "To validate the value", np: "मान validate गर्न", jp: "値を検証するため" },
          ],
          correctIndex: 0,
          explanation: { en: "Without it the chain breaks, because the next call runs on `undefined`.", np: "यसबिना chain भाँचिन्छ, किनकि अर्को call `undefined` मा चल्छ।", jp: "無ければ次の呼び出しが `undefined` に対して走り、連鎖が壊れる。" },
        },
        {
          question: { en: "What usually replaces a hand-written Singleton in modern JavaScript?", np: "आधुनिक JavaScript मा हातले लेखिएको Singleton लाई प्रायः केले प्रतिस्थापन गर्छ?", jp: "現代のJavaScriptで手書きのSingletonを置き換えるのは何か?" },
          options: [
            { en: "A module-level export, since a module runs once", np: "Module-स्तरको export, किनकि module एक पटक चल्छ", jp: "モジュールは一度だけ実行されるので、モジュールレベルのエクスポート" },
            { en: "A global variable", np: "एउटा global variable", jp: "グローバル変数" },
            { en: "A class with only static methods", np: "static method मात्र भएको class", jp: "静的メソッドだけのクラス" },
          ],
          correctIndex: 0,
          explanation: { en: "Every importer shares the same evaluated result.", np: "हरेक import गर्नेले उही मूल्यांकित नतिजा बाँड्छ।", jp: "取り込む側はすべて、同じ評価結果を共有する。" },
        },
        {
          question: { en: "What is the strongest argument against a Singleton?", np: "Singleton विरुद्धको सबैभन्दा बलियो तर्क के हो?", jp: "Singletonに反対する最も強い理由は?" },
          options: [
            { en: "It is slower than a plain object", np: "यो सादा object भन्दा ढिलो छ", jp: "素のオブジェクトより遅い" },
            { en: "It cannot be used with classes", np: "यो class सँग प्रयोग गर्न मिल्दैन", jp: "クラスと使えないから" },
            { en: "It is shared global state that hides dependencies and makes testing harder", np: "यो साझा global state हो जसले dependency लुकाउँछ र परीक्षण गाह्रो पार्छ", jp: "依存を隠しテストを難しくする共有のグローバル状態だから" },
          ],
          correctIndex: 2,
          explanation: { en: "`createUserService(database)` states the dependency; `getInstance()` hides it.", np: "`createUserService(database)` ले dependency भन्छ; `getInstance()` ले लुकाउँछ।", jp: "`createUserService(database)` は依存を明示し、`getInstance()` は隠す。" },
        },
      ],
      youtubeIds: ["tv-_1er1mWI"],
    },
    {
      id: "structural-patterns",
      title: { en: "Structural — Adapter, Facade, Decorator", np: "Structural — Adapter, Facade, Decorator", jp: "構造 — Adapter・Facade・Decorator" },
      durationMinutes: 9,
      explanation: {
        en: "Structural patterns are about <b>combining things you already have</b>, without rewriting either side.\n\n---\n\n### 1. Basic — Adapter\n\nAn <b>Adapter</b> translates one interface into another. Your code wants:\n\n```javascript\npayment.pay(order);\n```\n\nbut an old library only offers:\n\n```javascript\nlegacy.makePayment(amount, currency, card);\n```\n\nRather than change your app or fork the library, put a thin translator between them:\n\n```javascript\nclass PaymentAdapter {\n  constructor(legacyPayment) {\n    this.legacyPayment = legacyPayment;\n  }\n\n  pay(order) {\n    this.legacyPayment.makePayment(order.amount, order.currency, order.card);\n  }\n}\n\nconst payment = new PaymentAdapter(new LegacyPayment());\n\npayment.pay({ amount: 100, currency: \"USD\", card: \"****1234\" });\n```\n\n```text\nYour application\n       ↓\nPaymentAdapter\n       ↓\nLegacyPayment\n```\n\nThis is the pattern you reach for with legacy systems, third-party APIs, and two payment providers that disagree about argument order.\n\n---\n\n### 2. Intermediate — Facade\n\nA <b>Facade</b> puts a simple front door on a complicated subsystem. Registration might really involve six steps in a specific order:\n\n```javascript\nawait validate();\nawait hashPassword();\nawait createUser();\nawait sendEmail();\nawait trackEvent();\nawait log();\n```\n\nEvery caller getting that order right is a problem waiting to happen. So hide it:\n\n```javascript\nclass AuthFacade {\n  async register(email, password) {\n    const hash = await hashPassword(password);\n    const user = await createUser({ email, password: hash });\n\n    await sendWelcomeEmail(user);\n    await trackRegistration(user);\n\n    return user;\n  }\n}\n\nawait auth.register(\"alice@example.com\", \"secret\");\n```\n\nA facade does not make the subsystem simpler. It simplifies <b>how other code has to interact with it</b> — the steps are all still there, just no longer everyone's problem.\n\n---\n\n### 3. Advanced — Decorator\n\nA <b>Decorator</b> adds behaviour around something without editing it. In JavaScript this is just a function that takes a function and returns a new one:\n\n```javascript\nfunction withLogging(fn) {\n  return function (...args) {\n    console.log(\"Calling function\");\n    const result = fn(...args);\n    console.log(\"Result:\", result);\n    return result;\n  };\n}\n\nconst loggedGreet = withLogging(greet);\n```\n\n`greet` is untouched. The same shape covers timing:\n\n```javascript\nfunction withTiming(fn) {\n  return function (...args) {\n    const start = performance.now();\n    const result = fn(...args);\n    console.log(`Took ${performance.now() - start}ms`);\n    return result;\n  };\n}\n```\n\nand asynchronous work, where you `await` inside and catch failures:\n\n```javascript\nfunction withLogging(fn) {\n  return async function (...args) {\n    try {\n      const result = await fn(...args);\n      console.log(\"Succeeded\");\n      return result;\n    } catch (error) {\n      console.error(\"Failed:\", error);\n      throw error;\n    }\n  };\n}\n```\n\nThis is the pattern you will use most in JavaScript, because logging, caching, authorisation, retries, metrics and validation are all the same move: wrap it, do something around it, hand the result back unchanged.",
        np: "Structural pattern <b>पहिले नै भएका कुरा जोड्ने</b> बारेमा हुन्, कुनै पक्ष नलेखी।\n\n---\n\n### 1. आधारभूत — Adapter\n\n<b>Adapter</b> ले एउटा interface लाई अर्कोमा अनुवाद गर्छ। तपाईंको code चाहन्छ:\n\n```javascript\npayment.pay(order);\n```\n\nतर पुरानो library ले मात्र दिन्छ:\n\n```javascript\nlegacy.makePayment(amount, currency, card);\n```\n\nApp बदल्नु वा library fork गर्नुको सट्टा, बीचमा पातलो अनुवादक राख्नुहोस्:\n\n```javascript\nclass PaymentAdapter {\n  constructor(legacyPayment) {\n    this.legacyPayment = legacyPayment;\n  }\n\n  pay(order) {\n    this.legacyPayment.makePayment(order.amount, order.currency, order.card);\n  }\n}\n\nconst payment = new PaymentAdapter(new LegacyPayment());\n\npayment.pay({ amount: 100, currency: \"USD\", card: \"****1234\" });\n```\n\n```text\nYour application\n       ↓\nPaymentAdapter\n       ↓\nLegacyPayment\n```\n\nपुराना system, तेस्रो पक्षका API, र argument क्रममा असहमत दुई payment provider सँग यही pattern प्रयोग हुन्छ।\n\n---\n\n### 2. मध्यम — Facade\n\n<b>Facade</b> ले जटिल subsystem मा सरल ढोका राख्छ। Registration मा वास्तवमा निश्चित क्रमका छ चरण हुन सक्छन्:\n\n```javascript\nawait validate();\nawait hashPassword();\nawait createUser();\nawait sendEmail();\nawait trackEvent();\nawait log();\n```\n\nहरेक caller ले त्यो क्रम सही पार्नु आउँदै गरेको समस्या हो। त्यसैले लुकाउनुहोस्:\n\n```javascript\nclass AuthFacade {\n  async register(email, password) {\n    const hash = await hashPassword(password);\n    const user = await createUser({ email, password: hash });\n\n    await sendWelcomeEmail(user);\n    await trackRegistration(user);\n\n    return user;\n  }\n}\n\nawait auth.register(\"alice@example.com\", \"secret\");\n```\n\nFacade ले subsystem सरल बनाउँदैन। यसले <b>अरू code ले त्यससँग कसरी अन्तरक्रिया गर्नुपर्छ</b> भन्ने सरल बनाउँछ — चरण सबै त्यहीँ छन्, बस अब सबैको टाउको दुखाइ होइनन्।\n\n---\n\n### 3. उन्नत — Decorator\n\n<b>Decorator</b> ले कुनै कुरा नसम्पादन गरी त्यसको वरिपरि व्यवहार थप्छ। JavaScript मा यो function लिएर नयाँ function फर्काउने function मात्र हो:\n\n```javascript\nfunction withLogging(fn) {\n  return function (...args) {\n    console.log(\"Calling function\");\n    const result = fn(...args);\n    console.log(\"Result:\", result);\n    return result;\n  };\n}\n\nconst loggedGreet = withLogging(greet);\n```\n\n`greet` अछुतो छ। उही आकारले timing समेट्छ:\n\n```javascript\nfunction withTiming(fn) {\n  return function (...args) {\n    const start = performance.now();\n    const result = fn(...args);\n    console.log(`Took ${performance.now() - start}ms`);\n    return result;\n  };\n}\n```\n\nर asynchronous काम, जहाँ भित्र `await` गरी असफलता समात्नुहुन्छ:\n\n```javascript\nfunction withLogging(fn) {\n  return async function (...args) {\n    try {\n      const result = await fn(...args);\n      console.log(\"Succeeded\");\n      return result;\n    } catch (error) {\n      console.error(\"Failed:\", error);\n      throw error;\n    }\n  };\n}\n```\n\nJavaScript मा सबैभन्दा धेरै प्रयोग हुने pattern यही हो, किनकि logging, caching, authorisation, retry, metrics र validation सबै उही चाल हुन्: बेर्नुहोस्, वरिपरि केही गर्नुहोस्, नतिजा जस्ताको तस्तै फर्काउनुहोस्।",
        jp: "構造パターンは<b>すでにあるものを組み合わせる</b>話で、どちらの側も書き直さない。\n\n---\n\n### 1. 基本 — Adapter\n\n<b>Adapter</b> はインターフェースを翻訳する。こちらのコードが求めるのは:\n\n```javascript\npayment.pay(order);\n```\n\nだが古いライブラリが提供するのは:\n\n```javascript\nlegacy.makePayment(amount, currency, card);\n```\n\nアプリを変えたりライブラリを分岐させたりせず、あいだに薄い翻訳役を置く:\n\n```javascript\nclass PaymentAdapter {\n  constructor(legacyPayment) {\n    this.legacyPayment = legacyPayment;\n  }\n\n  pay(order) {\n    this.legacyPayment.makePayment(order.amount, order.currency, order.card);\n  }\n}\n\nconst payment = new PaymentAdapter(new LegacyPayment());\n\npayment.pay({ amount: 100, currency: \"USD\", card: \"****1234\" });\n```\n\n```text\nYour application\n       ↓\nPaymentAdapter\n       ↓\nLegacyPayment\n```\n\nレガシーシステム、外部API、引数の順序が食い違う2つの決済プロバイダ。こうした場面で出番になる。\n\n---\n\n### 2. 中級 — Facade\n\n<b>Facade</b> は複雑な下位systemに簡単な入口を付ける。登録処理は実際には順序の決まった6手順かもしれない:\n\n```javascript\nawait validate();\nawait hashPassword();\nawait createUser();\nawait sendEmail();\nawait trackEvent();\nawait log();\n```\n\n各呼び出し側がこの順序を守るというのは、事故の予約に等しい。だから隠す:\n\n```javascript\nclass AuthFacade {\n  async register(email, password) {\n    const hash = await hashPassword(password);\n    const user = await createUser({ email, password: hash });\n\n    await sendWelcomeEmail(user);\n    await trackRegistration(user);\n\n    return user;\n  }\n}\n\nawait auth.register(\"alice@example.com\", \"secret\");\n```\n\nFacadeは下位systemを簡単にはしない。簡単にするのは<b>他のコードとの付き合い方</b>だ。手順はすべて残るが、もう全員の責任ではない。\n\n---\n\n### 3. 上級 — Decorator\n\n<b>Decorator</b> は対象を編集せず、その周りに振る舞いを足す。JavaScriptでは、関数を受け取って新しい関数を返す関数にすぎない:\n\n```javascript\nfunction withLogging(fn) {\n  return function (...args) {\n    console.log(\"Calling function\");\n    const result = fn(...args);\n    console.log(\"Result:\", result);\n    return result;\n  };\n}\n\nconst loggedGreet = withLogging(greet);\n```\n\n`greet` には手を触れていない。同じ形が計測にも使える:\n\n```javascript\nfunction withTiming(fn) {\n  return function (...args) {\n    const start = performance.now();\n    const result = fn(...args);\n    console.log(`Took ${performance.now() - start}ms`);\n    return result;\n  };\n}\n```\n\n非同期処理でも、中で `await` して失敗を捕まえる:\n\n```javascript\nfunction withLogging(fn) {\n  return async function (...args) {\n    try {\n      const result = await fn(...args);\n      console.log(\"Succeeded\");\n      return result;\n    } catch (error) {\n      console.error(\"Failed:\", error);\n      throw error;\n    }\n  };\n}\n```\n\nJavaScriptで最も使うのがこれだ。ログ・キャッシュ・認可・リトライ・メトリクス・検証はどれも同じ動き。包み、周りで何かをし、結果はそのまま返す。",
      },
      diagram: `Adapter: a translator between two shapes

your app                 adapter                legacy library
   │                        │                        │
   │ pay(order) ───────────►│                        │
   │                        │ makePayment(a, c, card)│
   │                        ├───────────────────────►│
   │                        │                        │
neither side changed


Facade: the steps stay, the burden moves

before                          after

caller                          caller
  ├── validate()                  └── auth.register(email, password)
  ├── hashPassword()                        │
  ├── createUser()                          ▼
  ├── sendEmail()                    the six steps, in order,
  ├── trackEvent()                   in one place
  └── log()


Decorator: the original is untouched

greet                    withLogging(greet)
  │                              │
  │                       ┌──────┴──────┐
  │                       │ log before  │
  └──────────────────────►│ call greet  │
                          │ log after   │
                          └─────────────┘

logging, timing, caching, retries, metrics — all this same shape`,
      codeExample: {
        title: { en: "Adapter, Facade and Decorator in practice", np: "Adapter, Facade र Decorator व्यवहारमा", jp: "Adapter・Facade・Decoratorの実際" },
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
      keyTakeaways: [
        { en: "Structural patterns <b>combine existing parts</b> rather than creating new ones.", np: "Structural pattern ले नयाँ बनाउनुभन्दा <b>भएका भाग जोड्छन्</b>।", jp: "構造パターンは新しく作るのではなく<b>既存の部品を組み合わせる</b>。" },
        { en: "An <b>Adapter</b> translates one interface into another, leaving both sides untouched.", np: "<b>Adapter</b> ले एउटा interface अर्कोमा अनुवाद गर्छ, दुबै पक्ष नछोई।", jp: "<b>Adapter</b> はインターフェースを翻訳し、双方には触れない。" },
        { en: "A <b>Facade</b> gives a subsystem one simple entry point; the steps still all happen.", np: "<b>Facade</b> ले subsystem लाई एउटै सरल प्रवेश दिन्छ; चरण सबै अझै हुन्छन्।", jp: "<b>Facade</b> は下位systemに単一の入口を与える。手順自体はすべて残る。" },
        { en: "A facade simplifies <b>how other code calls the system</b>, not the system itself.", np: "Facade ले <b>अरू code ले system कसरी बोलाउँछ</b> सरल बनाउँछ, system आफैं होइन।", jp: "Facadeが簡単にするのは<b>他コードからの呼び方</b>で、system自体ではない。" },
        { en: "A <b>Decorator</b> wraps a function and returns a new one; the original is unchanged.", np: "<b>Decorator</b> ले function बेरेर नयाँ फर्काउँछ; मूल अपरिवर्तित रहन्छ।", jp: "<b>Decorator</b> は関数を包んで新しい関数を返す。元は変わらない。" },
        { en: "Logging, timing, caching, authorisation, retries and metrics are <b>all the same decorator shape</b>.", np: "Logging, timing, caching, authorisation, retry र metrics <b>सबै उही decorator आकार</b> हुन्।", jp: "ログ・計測・キャッシュ・認可・リトライ・メトリクスは<b>すべて同じDecoratorの形</b>。" },
      ],
      commonMistakes: [
        { en: "<b>Forgetting to return the result from a decorator</b> — the wrapper logs correctly and hands back `undefined`, breaking every caller.", np: "<b>Decorator बाट नतिजा फर्काउन बिर्सनु</b> — wrapper ले log त सही गर्छ र `undefined` फर्काउँछ, हरेक caller भाँच्दै।", jp: "<b>Decoratorで結果を返し忘れる</b> — ラッパーはログを正しく出しつつ `undefined` を返し、すべての呼び出し側を壊す。" },
        { en: "<b>Writing a synchronous decorator around an async function</b> — without `async`/`await` inside, you time how long it took to return a promise, not to do the work.", np: "<b>Async function वरिपरि synchronous decorator लेख्नु</b> — भित्र `async`/`await` नभए, काम गर्न होइन, promise फर्काउन कति लाग्यो नाप्नुहुन्छ।", jp: "<b>async関数を同期のDecoratorで包む</b> — 中に `async`/`await` がなければ、計るのは処理時間ではなくPromiseを返すまでの時間。" },
        { en: "<b>Confusing an Adapter with a Facade</b> — an adapter changes the <b>shape</b> of one interface; a facade hides the <b>number of steps</b>.", np: "<b>Adapter र Facade अल्मल्याउनु</b> — adapter ले एउटा interface को <b>आकार</b> बदल्छ; facade ले <b>चरणको संख्या</b> लुकाउँछ।", jp: "<b>AdapterとFacadeを混同する</b> — Adapterはインターフェースの<b>形</b>を変え、Facadeは<b>手順の数</b>を隠す。" },
        { en: "<b>Swallowing the error in an async decorator</b> — catching to log it and then not re-throwing turns every failure into a silent success.", np: "<b>Async decorator मा error निल्नु</b> — log गर्न समातेर फेरि नथ्रो गर्दा हरेक असफलता मौन सफलता बन्छ।", jp: "<b>非同期Decoratorでエラーを飲み込む</b> — ログのために捕まえて再throwしなければ、失敗がすべて静かな成功に化ける。" },
      ],
      quiz: [
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
            { en: "Factory", np: "Factory", jp: "Factory" },
            { en: "Decorator", np: "Decorator", jp: "Decorator" },
            { en: "Singleton", np: "Singleton", jp: "Singleton" },
            { en: "Observer", np: "Observer", jp: "Observer" },
          ],
          correctIndex: 1,
          explanation: { en: "Wrap it, do something before and after, return the result untouched.", np: "बेर्नुहोस्, अघि र पछि केही गर्नुहोस्, नतिजा जस्ताको तस्तै फर्काउनुहोस्।", jp: "包んで前後に処理を挟み、結果はそのまま返す。" },
        },
        {
          question: { en: "What does a Facade actually simplify?", np: "Facade ले वास्तवमा के सरल बनाउँछ?", jp: "Facadeが実際に簡単にするものは?" },
          options: [
            { en: "The subsystem itself", np: "Subsystem आफैं", jp: "下位system自体" },
            { en: "How other code has to interact with the subsystem", np: "अरू code ले subsystem सँग कसरी अन्तरक्रिया गर्नुपर्छ", jp: "他のコードが下位systemとどう関わるか" },
            { en: "The number of network calls", np: "Network call को संख्या", jp: "ネットワーク呼び出しの回数" },
          ],
          correctIndex: 1,
          explanation: { en: "All the steps still run; they are just no longer every caller's problem.", np: "चरण सबै अझै चल्छन्; ती बस अब हरेक caller को टाउको दुखाइ होइनन्।", jp: "手順はすべて実行される。ただ、もう各呼び出し側の責任ではない。" },
        },
        {
          question: { en: "What is missing from `function withLogging(fn) { return (...args) => { console.log(\"called\"); fn(...args); }; }`?", np: "`function withLogging(fn) { return (...args) => { console.log(\"called\"); fn(...args); }; }` मा के छुट्यो?", jp: "`function withLogging(fn) { return (...args) => { console.log(\"called\"); fn(...args); }; }` に足りないものは?" },
          options: [
            { en: "It never returns the result, so callers get `undefined`", np: "यसले नतिजा कहिल्यै फर्काउँदैन, त्यसैले caller ले `undefined` पाउँछ", jp: "結果を返さないので、呼び出し側は `undefined` を受け取る" },
            { en: "A `try/catch`", np: "एउटा `try/catch`", jp: "`try/catch`" },
            { en: "The `new` keyword", np: "`new` keyword", jp: "`new` キーワード" },
          ],
          correctIndex: 0,
          explanation: { en: "A decorator must hand the wrapped function's result back.", np: "Decorator ले बेरिएको function को नतिजा फर्काउनैपर्छ।", jp: "Decoratorは包んだ関数の結果を返さねばならない。" },
        },
        {
          question: { en: "What is the difference between an Adapter and a Facade?", np: "Adapter र Facade बीच के फरक छ?", jp: "AdapterとFacadeの違いは?" },
          options: [
            { en: "They are two names for the same pattern", np: "ती एउटै pattern का दुई नाम हुन्", jp: "同じパターンの別名" },
            { en: "An adapter changes the shape of an interface; a facade hides a sequence of steps", np: "Adapter ले interface को आकार बदल्छ; facade ले चरणको क्रम लुकाउँछ", jp: "Adapterはインターフェースの形を変え、Facadeは手順の連なりを隠す" },
            { en: "An adapter is async and a facade is sync", np: "Adapter async र facade sync हो", jp: "Adapterは非同期、Facadeは同期" },
          ],
          correctIndex: 1,
          explanation: { en: "One reconciles two vocabularies; the other reduces a checklist to one call.", np: "एउटाले दुई शब्दावली मिलाउँछ; अर्कोले checklist लाई एउटै call बनाउँछ।", jp: "一方は2つの語彙を突き合わせ、もう一方は手順表を1つの呼び出しに縮める。" },
        },
      ],
    },
    {
      id: "behavioral-patterns",
      title: { en: "Behavioral — Observer, Strategy, Command", np: "Behavioral — Observer, Strategy, Command", jp: "振る舞い — Observer・Strategy・Command" },
      durationMinutes: 9,
      explanation: {
        en: "Behavioral patterns are about <b>how parts talk to each other and how behaviour changes</b>.\n\n---\n\n### 1. Basic — Observer\n\nThe <b>Observer</b> pattern answers: \"who should be told when this happens?\" Listeners register, an event fires, everyone interested reacts, and the publisher never learns who is listening.\n\n```javascript\nconst listeners = [];\n\nfunction subscribe(fn) { listeners.push(fn); }\nfunction notify(data)  { listeners.forEach(fn => fn(data)); }\n\nsubscribe(data => console.log(\"Listener 1:\", data));\nsubscribe(data => console.log(\"Listener 2:\", data));\n\nnotify(\"User logged in\");   // both run\n```\n\nA real implementation keys listeners by event name and hands back an unsubscribe function:\n\n```javascript\nclass EventEmitter {\n  #listeners = new Map();\n\n  on(event, callback) {\n    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());\n    this.#listeners.get(event).add(callback);\n\n    return () => this.#listeners.get(event)?.delete(callback);\n  }\n\n  emit(event, data) {\n    this.#listeners.get(event)?.forEach(callback => callback(data));\n  }\n}\n```\n\nReturning the unsubscribe function is the detail that matters: without it, a listener has no way to detach and the emitter keeps it alive forever. You have used this shape already — DOM events, Node's `EventEmitter` and every state store work this way.\n\n---\n\n### 2. Intermediate — Strategy\n\nThe <b>Strategy</b> pattern answers a different question: \"which algorithm should run?\" Instead of branching:\n\n```javascript\nif (method === \"card\") { /* ... */ }\nelse if (method === \"paypal\") { /* ... */ }\nelse if (method === \"bank\") { /* ... */ }\n```\n\nput the interchangeable pieces in a lookup:\n\n```javascript\nconst paymentStrategies = {\n  card:   amount => console.log(`Charging card: ${amount}`),\n  paypal: amount => console.log(`Charging PayPal: ${amount}`),\n  bank:   amount => console.log(`Bank transfer: ${amount}`)\n};\n\nfunction checkout(amount, method) {\n  const strategy = paymentStrategies[method];\n  if (!strategy) throw new Error(\"Unsupported payment method\");\n  return strategy(amount);\n}\n```\n\nAdding a fourth method now leaves `checkout()` completely untouched. The same shape fits sorting, pricing, validation, compression and authentication.\n\n---\n\n### 3. Advanced — Command\n\nThe <b>Command</b> pattern turns an action into a value. Instead of a statement that already ran, you get an object you can store, pass around, queue, log or reverse:\n\n```javascript\nfunction insertText(text) {\n  return {\n    execute(current) { return current + text; },\n    undo(current)    { return current.slice(0, -text.length); }\n  };\n}\n```\n\nBecause the action is now data, a history stack is trivial:\n\n```javascript\nclass TextEditor {\n  #text = \"\";\n  #history = [];\n\n  execute(command) {\n    this.#text = command.execute(this.#text);\n    this.#history.push(command);\n  }\n\n  undo() {\n    const command = this.#history.pop();\n    if (command) this.#text = command.undo(this.#text);\n  }\n\n  get text() { return this.#text; }\n}\n```\n\n```javascript\neditor.execute(insertText(\"Hello\"));\neditor.execute(insertText(\" World\"));\neditor.text;   // \"Hello World\"\n\neditor.undo();\neditor.text;   // \"Hello\"\n```\n\nThat single change — action as object rather than statement — is what makes undo/redo, job queues, transactions and keyboard command maps possible. The action outlives the moment it was invoked.\n\n---\n\n### Do not confuse Observer with Strategy\n\n```text\nObserver                     Strategy\nevent → listener 1           operation → algorithm A\n      → listener 2                     → algorithm B\n      → listener 3                     → algorithm C\n\n\"who gets told?\"             \"which one runs?\"\n```",
        np: "Behavioral pattern <b>भागहरू एकअर्कासँग कसरी कुरा गर्छन् र व्यवहार कसरी बदलिन्छ</b> भन्नेबारे हुन्।\n\n---\n\n### 1. आधारभूत — Observer\n\n<b>Observer</b> pattern ले जवाफ दिन्छ: \"यो हुँदा कसलाई भन्ने?\" Listener दर्ता हुन्छन्, event बज्छ, चासो राख्ने सबैले प्रतिक्रिया दिन्छन्, र publisher ले कसले सुन्दैछ कहिल्यै जान्दैन।\n\n```javascript\nconst listeners = [];\n\nfunction subscribe(fn) { listeners.push(fn); }\nfunction notify(data)  { listeners.forEach(fn => fn(data)); }\n\nsubscribe(data => console.log(\"Listener 1:\", data));\nsubscribe(data => console.log(\"Listener 2:\", data));\n\nnotify(\"User logged in\");   // दुबै चल्छन्\n```\n\nवास्तविक implementation ले listener लाई event नामले राख्छ र unsubscribe function फर्काउँछ:\n\n```javascript\nclass EventEmitter {\n  #listeners = new Map();\n\n  on(event, callback) {\n    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());\n    this.#listeners.get(event).add(callback);\n\n    return () => this.#listeners.get(event)?.delete(callback);\n  }\n\n  emit(event, data) {\n    this.#listeners.get(event)?.forEach(callback => callback(data));\n  }\n}\n```\n\nUnsubscribe function फर्काउनु महत्वपूर्ण विवरण हो: यसबिना listener सँग छुट्ने उपाय हुँदैन र emitter ले यसलाई सधैंका लागि जीवित राख्छ। तपाईंले यो आकार प्रयोग गरिसक्नुभएको छ — DOM event, Node को `EventEmitter` र हरेक state store यसै गरी काम गर्छन्।\n\n---\n\n### 2. मध्यम — Strategy\n\n<b>Strategy</b> pattern ले फरक प्रश्नको जवाफ दिन्छ: \"कुन algorithm चलाउने?\" शाखा बनाउनुको सट्टा:\n\n```javascript\nif (method === \"card\") { /* ... */ }\nelse if (method === \"paypal\") { /* ... */ }\nelse if (method === \"bank\") { /* ... */ }\n```\n\nसाटासाट गर्न मिल्ने टुक्रा lookup मा राख्नुहोस्:\n\n```javascript\nconst paymentStrategies = {\n  card:   amount => console.log(`Charging card: ${amount}`),\n  paypal: amount => console.log(`Charging PayPal: ${amount}`),\n  bank:   amount => console.log(`Bank transfer: ${amount}`)\n};\n\nfunction checkout(amount, method) {\n  const strategy = paymentStrategies[method];\n  if (!strategy) throw new Error(\"Unsupported payment method\");\n  return strategy(amount);\n}\n```\n\nअब चौथो method थप्दा `checkout()` पूरै अछुतो रहन्छ। उही आकार sorting, pricing, validation, compression र authentication मा मिल्छ।\n\n---\n\n### 3. उन्नत — Command\n\n<b>Command</b> pattern ले कामलाई मानमा बदल्छ। चलिसकेको statement होइन, तपाईंले राख्न, पठाउन, queue गर्न, log गर्न वा उल्ट्याउन मिल्ने object पाउनुहुन्छ:\n\n```javascript\nfunction insertText(text) {\n  return {\n    execute(current) { return current + text; },\n    undo(current)    { return current.slice(0, -text.length); }\n  };\n}\n```\n\nकाम अब data भएकाले, history stack सजिलो हुन्छ:\n\n```javascript\nclass TextEditor {\n  #text = \"\";\n  #history = [];\n\n  execute(command) {\n    this.#text = command.execute(this.#text);\n    this.#history.push(command);\n  }\n\n  undo() {\n    const command = this.#history.pop();\n    if (command) this.#text = command.undo(this.#text);\n  }\n\n  get text() { return this.#text; }\n}\n```\n\n```javascript\neditor.execute(insertText(\"Hello\"));\neditor.execute(insertText(\" World\"));\neditor.text;   // \"Hello World\"\n\neditor.undo();\neditor.text;   // \"Hello\"\n```\n\nत्यही एउटा परिवर्तन — statement होइन object का रूपमा काम — ले undo/redo, job queue, transaction र keyboard command map सम्भव बनाउँछ। काम आफू बोलाइएको क्षणभन्दा बढी टिक्छ।\n\n---\n\n### Observer र Strategy नअल्मल्याउनुहोस्\n\n```text\nObserver                     Strategy\nevent → listener 1           operation → algorithm A\n      → listener 2                     → algorithm B\n      → listener 3                     → algorithm C\n\n\"कसलाई भन्ने?\"                \"कुन चलाउने?\"\n```",
        jp: "振る舞いパターンは<b>部品どうしの会話と、振る舞いの変え方</b>の話だ。\n\n---\n\n### 1. 基本 — Observer\n\n<b>Observer</b> が答えるのは「これが起きたとき誰に知らせるか」。リスナーが登録し、イベントが発火し、関心のある者が反応する。発行側は誰が聞いているかを知らない。\n\n```javascript\nconst listeners = [];\n\nfunction subscribe(fn) { listeners.push(fn); }\nfunction notify(data)  { listeners.forEach(fn => fn(data)); }\n\nsubscribe(data => console.log(\"Listener 1:\", data));\nsubscribe(data => console.log(\"Listener 2:\", data));\n\nnotify(\"User logged in\");   // 両方走る\n```\n\n実装ではイベント名でリスナーを分け、解除用の関数を返す:\n\n```javascript\nclass EventEmitter {\n  #listeners = new Map();\n\n  on(event, callback) {\n    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());\n    this.#listeners.get(event).add(callback);\n\n    return () => this.#listeners.get(event)?.delete(callback);\n  }\n\n  emit(event, data) {\n    this.#listeners.get(event)?.forEach(callback => callback(data));\n  }\n}\n```\n\n解除関数を返すのが肝心な点だ。無ければリスナーは外れる手段を持たず、エミッタが永久に生かし続ける。この形はすでに使ったことがあるはずで、DOMイベントもNodeの `EventEmitter` も状態ストアもこう動く。\n\n---\n\n### 2. 中級 — Strategy\n\n<b>Strategy</b> が答えるのは別の問い、「どのアルゴリズムを走らせるか」。分岐する代わりに:\n\n```javascript\nif (method === \"card\") { /* ... */ }\nelse if (method === \"paypal\") { /* ... */ }\nelse if (method === \"bank\") { /* ... */ }\n```\n\n差し替え可能な部品を表に置く:\n\n```javascript\nconst paymentStrategies = {\n  card:   amount => console.log(`Charging card: ${amount}`),\n  paypal: amount => console.log(`Charging PayPal: ${amount}`),\n  bank:   amount => console.log(`Bank transfer: ${amount}`)\n};\n\nfunction checkout(amount, method) {\n  const strategy = paymentStrategies[method];\n  if (!strategy) throw new Error(\"Unsupported payment method\");\n  return strategy(amount);\n}\n```\n\n4つ目を足しても `checkout()` にはまったく触れない。並べ替え・価格計算・検証・圧縮・認証も同じ形に収まる。\n\n---\n\n### 3. 上級 — Command\n\n<b>Command</b> は動作を値に変える。すでに実行された文ではなく、保存・受け渡し・キュー・記録・巻き戻しができるオブジェクトが手に入る:\n\n```javascript\nfunction insertText(text) {\n  return {\n    execute(current) { return current + text; },\n    undo(current)    { return current.slice(0, -text.length); }\n  };\n}\n```\n\n動作がデータになったので、履歴スタックは容易だ:\n\n```javascript\nclass TextEditor {\n  #text = \"\";\n  #history = [];\n\n  execute(command) {\n    this.#text = command.execute(this.#text);\n    this.#history.push(command);\n  }\n\n  undo() {\n    const command = this.#history.pop();\n    if (command) this.#text = command.undo(this.#text);\n  }\n\n  get text() { return this.#text; }\n}\n```\n\n```javascript\neditor.execute(insertText(\"Hello\"));\neditor.execute(insertText(\" World\"));\neditor.text;   // \"Hello World\"\n\neditor.undo();\neditor.text;   // \"Hello\"\n```\n\nこの一手、つまり動作を文ではなくオブジェクトにすることが、undo/redo・ジョブキュー・トランザクション・キーボードのコマンド割り当てを可能にする。動作が、呼ばれた瞬間より長く生きるからだ。\n\n---\n\n### ObserverとStrategyを混同しない\n\n```text\nObserver                     Strategy\nevent → listener 1           operation → algorithm A\n      → listener 2                     → algorithm B\n      → listener 3                     → algorithm C\n\n「誰に知らせる?」              「どれを走らせる?」",
      },
      diagram: `Observer: one event, many reactions

               emit("orderCreated")
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
    send email     update stock    log analytics

the publisher never learns who subscribed


Strategy: many algorithms, one call site

checkout(amount, "paypal")
        │
        ▼
  paymentStrategies
        │
   ┌────┼────┐
   ▼    ▼    ▼
 card paypal bank

adding a fourth leaves checkout() untouched


Command: the action outlives the call

insertText("Hello")
        │
        ▼
  { execute, undo }        ← now a value
        │
   ┌────┴────┐
   ▼         ▼
 run it   push to history
              │
              ▼
           undo, redo, queue, log


Two questions, two patterns

Observer  →  who gets told?
Strategy  →  which one runs?`,
      codeExample: {
        title: { en: "Observer, Strategy and Command in practice", np: "Observer, Strategy र Command व्यवहारमा", jp: "Observer・Strategy・Commandの実際" },
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
      keyTakeaways: [
        { en: "<b>Observer</b> broadcasts an event to everyone who registered interest.", np: "<b>Observer</b> ले चासो दर्ता गरेका सबैलाई event प्रसारण गर्छ।", jp: "<b>Observer</b> は関心を登録した全員へイベントを配信する。" },
        { en: "The publisher <b>never learns who subscribed</b>, which is what keeps the two sides independent.", np: "Publisher ले <b>कसले subscribe गर्‍यो कहिल्यै जान्दैन</b>, यसैले दुबै पक्ष स्वतन्त्र रहन्छन्।", jp: "発行側は<b>誰が購読したかを知らない</b>。だから両者が独立を保てる。" },
        { en: "Returning an <b>unsubscribe function</b> from `on()` is what lets a listener detach.", np: "`on()` बाट <b>unsubscribe function</b> फर्काउनुले नै listener लाई छुट्न दिन्छ।", jp: "`on()` が<b>解除用の関数</b>を返すことで、リスナーは外れられる。" },
        { en: "<b>Strategy</b> replaces an `if/else` chain with a lookup of interchangeable functions.", np: "<b>Strategy</b> ले `if/else` शृंखलालाई साटासाट गर्न मिल्ने function को lookup ले बदल्छ।", jp: "<b>Strategy</b> は `if/else` の連鎖を、差し替え可能な関数の表に置き換える。" },
        { en: "With a strategy table, adding an option leaves the calling function untouched.", np: "Strategy table सँग, विकल्प थप्दा बोलाउने function अछुतो रहन्छ।", jp: "戦略の表があれば、選択肢を足しても呼び出し側の関数は変わらない。" },
        { en: "<b>Command</b> turns an action into an object, so it can be stored, queued, logged or reversed.", np: "<b>Command</b> ले काम लाई object बनाउँछ, त्यसैले राख्न, queue गर्न, log गर्न वा उल्ट्याउन सकिन्छ।", jp: "<b>Command</b> は動作をオブジェクトにするので、保存・キュー・記録・巻き戻しができる。" },
        { en: "Observer answers <b>\"who gets told\"</b>; Strategy answers <b>\"which one runs\"</b>.", np: "Observer ले <b>\"कसलाई भन्ने\"</b> को जवाफ दिन्छ; Strategy ले <b>\"कुन चलाउने\"</b>।", jp: "Observerは<b>「誰に知らせるか」</b>、Strategyは<b>「どれを走らせるか」</b>に答える。" },
      ],
      commonMistakes: [
        { en: "<b>Subscribing without a way to unsubscribe</b> — the emitter holds the callback forever, and everything the callback closes over stays alive with it.", np: "<b>Unsubscribe को उपायबिना subscribe गर्नु</b> — emitter ले callback सधैं समात्छ, र callback ले समेटेको सबै त्यससँगै जीवित रहन्छ।", jp: "<b>解除手段なしに購読する</b> — エミッタがコールバックを永久に保持し、そのクロージャが抱えるものもすべて生き残る。" },
        { en: "<b>Confusing Observer with Strategy</b> — one broadcasts to many listeners, the other picks one behaviour out of several.", np: "<b>Observer र Strategy अल्मल्याउनु</b> — एउटाले धेरै listener लाई प्रसारण गर्छ, अर्कोले धेरैमध्ये एउटा व्यवहार छान्छ।", jp: "<b>ObserverとStrategyを混同する</b> — 一方は多数へ配信し、もう一方は複数から1つの振る舞いを選ぶ。" },
        { en: "<b>Leaving a strategy lookup unguarded</b> — `strategies[method](amount)` with an unknown method throws \"not a function\" instead of a message anyone can act on.", np: "<b>Strategy lookup असुरक्षित छाड्नु</b> — अपरिचित method सँग `strategies[method](amount)` ले काम लाग्ने सन्देशको सट्टा \"not a function\" दिन्छ।", jp: "<b>戦略の表を無防備にする</b> — 未知の手段に対する `strategies[method](amount)` は、対処できるメッセージではなく「not a function」を投げる。" },
        { en: "<b>Writing a command without an `undo`</b> — it still works as a queued job, but the history stack that makes Command worth using is no longer possible.", np: "<b>`undo` बिना command लेख्नु</b> — queue गरिएको job का रूपमा चल्छ, तर Command प्रयोग गर्न लायक बनाउने history stack सम्भव रहँदैन।", jp: "<b>`undo` のないCommandを書く</b> — キューのジョブとしては動くが、Commandを使う価値を生む履歴スタックは成り立たない。" },
      ],
      quiz: [
        {
          question: { en: "Several parts of the app must react when `\"orderCreated\"` happens. Which pattern?", np: "`\"orderCreated\"` हुँदा app का धेरै भागले प्रतिक्रिया दिनुपर्छ। कुन pattern?", jp: "`\"orderCreated\"` が起きたとき、アプリの複数箇所が反応する必要がある。どのパターンか?" },
          options: [
            { en: "Observer", np: "Observer", jp: "Observer" },
            { en: "Command", np: "Command", jp: "Command" },
            { en: "Factory", np: "Factory", jp: "Factory" },
            { en: "Builder", np: "Builder", jp: "Builder" },
          ],
          correctIndex: 0,
          explanation: { en: "The publisher never needs to know who subscribed.", np: "Publisher ले कसले subscribe गर्‍यो जान्नै पर्दैन।", jp: "発行側は誰が購読したかを知る必要がない。" },
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
          question: { en: "Why does `on()` return a function?", np: "`on()` ले function किन फर्काउँछ?", jp: "`on()` が関数を返すのはなぜか?" },
          options: [
            { en: "To allow chaining", np: "Chaining दिन", jp: "チェーンできるようにするため" },
            { en: "To return the event data", np: "Event को data फर्काउन", jp: "イベントのデータを返すため" },
            { en: "So the caller can unsubscribe later", np: "Caller ले पछि unsubscribe गर्न सकोस् भनेर", jp: "呼び出し側が後で購読を解除できるようにするため" },
          ],
          correctIndex: 2,
          explanation: { en: "Without it the emitter holds the callback, and its closure, forever.", np: "यसबिना emitter ले callback र यसको closure सधैं समात्छ।", jp: "無ければエミッタがコールバックとそのクロージャを永久に保持する。" },
        },
        {
          question: { en: "Why does Command suit an undo system?", np: "Undo system लाई Command किन सुहाउँछ?", jp: "CommandがUndoに向くのはなぜか?" },
          options: [
            { en: "It creates objects automatically", np: "यसले स्वतः object बनाउँछ", jp: "自動でオブジェクトを作るから" },
            { en: "It makes every method static", np: "यसले हरेक method static बनाउँछ", jp: "すべてのメソッドを静的にするから" },
            { en: "It prevents inheritance", np: "यसले inheritance रोक्छ", jp: "継承を防ぐから" },
            { en: "It represents an action as an object that can be stored and reversed", np: "यसले काम लाई राख्न र उल्ट्याउन मिल्ने object का रूपमा जनाउँछ", jp: "動作を、保存も巻き戻しもできるオブジェクトとして表すから" },
          ],
          correctIndex: 3,
          explanation: { en: "The action outlives the moment it was invoked, so a history stack works.", np: "काम बोलाइएको क्षणभन्दा बढी टिक्छ, त्यसैले history stack चल्छ।", jp: "動作が呼ばれた瞬間より長く生きるので、履歴スタックが成り立つ。" },
        },
        {
          question: { en: "What is the difference between Observer and Strategy?", np: "Observer र Strategy बीचको भिन्नता के हो?", jp: "ObserverとStrategyの違いは?" },
          options: [
            { en: "Observer is synchronous and Strategy is asynchronous", np: "Observer synchronous र Strategy asynchronous हो", jp: "Observerは同期、Strategyは非同期" },
            { en: "Observer decides who is notified; Strategy decides which algorithm runs", np: "Observer ले कसलाई खबर गर्ने तय गर्छ; Strategy ले कुन algorithm चल्ने", jp: "Observerは誰に知らせるかを、Strategyはどのアルゴリズムを走らせるかを決める" },
            { en: "They are two names for the same pattern", np: "ती एउटै pattern का दुई नाम हुन्", jp: "同じパターンの別名" },
          ],
          correctIndex: 1,
          explanation: { en: "One is about broadcast, the other about interchangeable behaviour.", np: "एउटा प्रसारणबारे हो, अर्को साटासाट गर्न मिल्ने व्यवहारबारे।", jp: "一方は配信、もう一方は差し替え可能な振る舞いの話。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "Which pattern hides object creation logic behind one call?", np: "कुन pattern ले object creation को logic एउटै call पछाडि लुकाउँछ?", jp: "オブジェクト生成のロジックを1つの呼び出しの裏に隠すのはどれか?" },
      options: [
        { en: "Observer", np: "Observer", jp: "Observer" },
        { en: "Command", np: "Command", jp: "Command" },
        { en: "Adapter", np: "Adapter", jp: "Adapter" },
        { en: "Factory", np: "Factory", jp: "Factory" },
      ],
      correctIndex: 3,
      explanation: { en: "Callers depend on the result rather than a concrete constructor.", np: "Caller concrete constructor होइन, नतिजामा निर्भर हुन्छ।", jp: "呼び出し側は具象コンストラクタではなく結果に依存する。" },
    },
    {
      question: { en: "An object has 15 optional configuration values. Which pattern helps?", np: "Object मा 15 वैकल्पिक configuration मान छन्। कुन pattern ले मद्दत गर्छ?", jp: "任意の設定値が15個ある。どのパターンが助けになるか?" },
      options: [
        { en: "Observer", np: "Observer", jp: "Observer" },
        { en: "Builder", np: "Builder", jp: "Builder" },
        { en: "Adapter", np: "Adapter", jp: "Adapter" },
        { en: "Singleton", np: "Singleton", jp: "Singleton" },
      ],
      correctIndex: 1,
      explanation: { en: "Step-by-step assembly reads far better than 15 positional arguments.", np: "15 positional argument भन्दा क्रमैसँग जोड्नु धेरै राम्रो पढिन्छ।", jp: "15個の位置引数より段階的な組み立ての方が読みやすい。" },
    },
    {
      question: { en: "You must make a legacy API fit your application's interface. Which pattern?", np: "पुरानो API लाई आफ्नो application को interface मा मिलाउनुपर्छ। कुन pattern?", jp: "レガシーAPIを自分のアプリのインターフェースに合わせたい。どれか?" },
      options: [
        { en: "Adapter", np: "Adapter", jp: "Adapter" },
        { en: "Facade", np: "Facade", jp: "Facade" },
        { en: "Strategy", np: "Strategy", jp: "Strategy" },
        { en: "Command", np: "Command", jp: "Command" },
      ],
      correctIndex: 0,
      explanation: { en: "A thin wrapper translates without changing either side.", np: "पातलो wrapper ले दुबै पक्ष नबदली अनुवाद गर्छ।", jp: "薄いラッパーが双方を変えずに翻訳する。" },
    },
    {
      question: { en: "You want to add logging to a function without editing it. Which pattern?", np: "Function नसम्पादन गरी logging थप्न चाहनुहुन्छ। कुन pattern?", jp: "関数を編集せずログを足したい。どれか?" },
      options: [
        { en: "Factory", np: "Factory", jp: "Factory" },
        { en: "Decorator", np: "Decorator", jp: "Decorator" },
        { en: "Singleton", np: "Singleton", jp: "Singleton" },
        { en: "Observer", np: "Observer", jp: "Observer" },
      ],
      correctIndex: 1,
      explanation: { en: "Wrap it, do something before and after, return the result untouched.", np: "बेर्नुहोस्, अघि र पछि केही गर्नुहोस्, नतिजा जस्ताको तस्तै फर्काउनुहोस्।", jp: "包んで前後に処理を挟み、結果はそのまま返す。" },
    },
    {
      question: { en: "Three algorithms compute shipping cost and one is chosen at runtime. Which pattern?", np: "तीन algorithm ले shipping cost निकाल्छन् र एउटा runtime मा छानिन्छ। कुन pattern?", jp: "配送料の計算が3通りあり、実行時に選ぶ。どれか?" },
      options: [
        { en: "Facade", np: "Facade", jp: "Facade" },
        { en: "Builder", np: "Builder", jp: "Builder" },
        { en: "Strategy", np: "Strategy", jp: "Strategy" },
        { en: "Adapter", np: "Adapter", jp: "Adapter" },
      ],
      correctIndex: 2,
      explanation: { en: "Look the algorithm up instead of branching inside the caller.", np: "Caller भित्र शाखा बनाउनुको सट्टा algorithm खोज्नुहोस्।", jp: "呼び出し側で分岐せずアルゴリズムを引く。" },
    },
    {
      question: { en: "Several parts of the app must react when `\"orderCreated\"` happens. Which pattern?", np: "`\"orderCreated\"` हुँदा app का धेरै भागले प्रतिक्रिया दिनुपर्छ। कुन pattern?", jp: "`\"orderCreated\"` に複数箇所が反応する必要がある。どれか?" },
      options: [
        { en: "Observer", np: "Observer", jp: "Observer" },
        { en: "Command", np: "Command", jp: "Command" },
        { en: "Factory", np: "Factory", jp: "Factory" },
        { en: "Builder", np: "Builder", jp: "Builder" },
      ],
      correctIndex: 0,
      explanation: { en: "The publisher never needs to know who subscribed.", np: "Publisher ले कसले subscribe गर्‍यो जान्नै पर्दैन।", jp: "発行側は誰が購読したかを知る必要がない。" },
    },
    {
      question: { en: "Why does Command suit an undo system?", np: "Undo system लाई Command किन सुहाउँछ?", jp: "CommandがUndoに向くのはなぜか?" },
      options: [
        { en: "It creates objects automatically", np: "यसले स्वतः object बनाउँछ", jp: "自動でオブジェクトを作るから" },
        { en: "It prevents inheritance", np: "यसले inheritance रोक्छ", jp: "継承を防ぐから" },
        { en: "It represents an action as an object that can be stored and reversed", np: "यसले काम लाई राख्न र उल्ट्याउन मिल्ने object का रूपमा जनाउँछ", jp: "動作を保存も巻き戻しもできるオブジェクトとして表すから" },
        { en: "It makes every method static", np: "यसले हरेक method static बनाउँछ", jp: "すべてのメソッドを静的にするから" },
      ],
      correctIndex: 2,
      explanation: { en: "The action outlives the moment it was invoked.", np: "काम बोलाइएको क्षणभन्दा बढी टिक्छ।", jp: "動作が呼ばれた瞬間より長く生きる。" },
    },
    {
      question: { en: "What is the difference between Observer and Strategy?", np: "Observer र Strategy बीचको भिन्नता के हो?", jp: "ObserverとStrategyの違いは?" },
      options: [
        { en: "Observer decides who is notified; Strategy decides which algorithm runs", np: "Observer ले कसलाई खबर गर्ने; Strategy ले कुन algorithm चल्ने तय गर्छ", jp: "Observerは誰に知らせるか、Strategyはどれを走らせるかを決める" },
        { en: "Observer is synchronous and Strategy is asynchronous", np: "Observer synchronous, Strategy asynchronous", jp: "Observerは同期、Strategyは非同期" },
        { en: "They are the same pattern", np: "ती एउटै pattern हुन्", jp: "同じパターン" },
      ],
      correctIndex: 0,
      explanation: { en: "One is about broadcast, the other about interchangeable behaviour.", np: "एउटा प्रसारणबारे, अर्को साटासाट गर्न मिल्ने व्यवहारबारे।", jp: "一方は配信、もう一方は差し替え可能な振る舞い。" },
    },
    {
      question: { en: "What is the strongest argument against a Singleton?", np: "Singleton विरुद्धको सबैभन्दा बलियो तर्क के हो?", jp: "Singletonに反対する最も強い理由は?" },
      options: [
        { en: "It is slower than a plain object", np: "यो सादा object भन्दा ढिलो छ", jp: "素のオブジェクトより遅い" },
        { en: "It cannot be used with classes", np: "यो class सँग प्रयोग गर्न मिल्दैन", jp: "クラスと使えないから" },
        { en: "It is shared global state that hides dependencies and makes testing harder", np: "यो साझा global state हो जसले dependency लुकाउँछ र परीक्षण गाह्रो पार्छ", jp: "依存を隠しテストを難しくする共有のグローバル状態だから" },
      ],
      correctIndex: 2,
      explanation: { en: "`createUserService(database)` states the dependency; `getInstance()` hides it.", np: "`createUserService(database)` ले dependency भन्छ; `getInstance()` ले लुकाउँछ।", jp: "`createUserService(database)` は依存を明示し、`getInstance()` は隠す。" },
    },
    {
      question: { en: "What question should come before introducing any pattern?", np: "कुनै पनि pattern प्रयोग गर्नुअघि कुन प्रश्न आउनुपर्छ?", jp: "パターンを導入する前に立てるべき問いは?" },
      options: [
        { en: "Which pattern is most advanced?", np: "कुन pattern सबैभन्दा उन्नत छ?", jp: "どれが最も高度か" },
        { en: "What complexity am I removing by adding this abstraction?", np: "यो abstraction थपेर म कुन जटिलता हटाउँदैछु?", jp: "この抽象を足して、どの複雑さを取り除いているのか" },
        { en: "Which pattern will reviewers recognise?", np: "Reviewer ले कुन चिन्लान्?", jp: "レビュアーが分かるのはどれか" },
      ],
      correctIndex: 1,
      explanation: { en: "If the honest answer is none, the pattern is decoration, not design.", np: "इमान्दार जवाफ \"केही होइन\" हो भने, त्यो सजावट हो, design होइन।", jp: "正直な答えが「何も」なら、それは設計ではなく装飾。" },
    },
  ],
};
