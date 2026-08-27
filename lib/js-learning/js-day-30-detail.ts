import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_30_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Understanding what happens inside the JavaScript engine takes you from writing code that works to writing code that performs. V8 (Chrome and Node.js) uses hidden classes and inline caching to make property access fast — but only if your code follows predictable patterns. Profiling tools reveal exactly where your program spends its time.",
      np: "JavaScript engine भित्र के हुन्छ बुझ्नाले तपाईंलाई 'works' हुने code बाट 'performs' हुने code तिर लैजान्छ। V8 ले hidden classes र inline caching प्रयोग गरेर property access fast बनाउँछ — तर code predictable patterns follow गर्दा मात्र। Profiling tools ले program कहाँ time spend गर्छ exactly reveal गर्छ।",
      jp: "JavaScriptエンジン内部を理解することで「動く」コードから「速い」コードへ進化できる。V8は隠れクラスとインラインキャッシュでプロパティアクセスを高速化するが、コードが予測可能なパターンに従う必要がある。プロファイリングツールは時間を費やしている場所を正確に明らかにする。",
    },
    {
      en: "This is senior-level material — most developers work effectively without knowing it. But it makes you better at debugging performance issues, reading profiler output, and understanding why certain JavaScript patterns are recommended (or avoided) in high-performance codebases.",
      np: "यो senior-level material हो — अधिकांश developers यो थाहा नभई पनि effectively काम गर्छन्। तर यसले performance issues debug गर्न, profiler output read गर्न, र certain JavaScript patterns किन recommended (वा avoid) छन् बुझ्न बढी capable बनाउँछ।",
      jp: "これはシニアレベルの内容 — 多くの開発者はこれを知らなくても有効に働ける。しかしパフォーマンス問題のデバッグ・プロファイラ出力の読み方・特定のJSパターンが推奨される理由の理解が深まる。",
    },
  ],
  sections: [
    {
      title: { en: "How V8 compiles and optimizes JavaScript", np: "V8 ले JavaScript कसरी compile र optimize गर्छ", jp: "V8はJavaScriptをどうコンパイル・最適化するか" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "At senior level, performance work is less about memorising micro-optimisations and more about knowing <b>what the engine is doing underneath your code</b>. V8 does not interpret every statement forever: <b>Ignition</b> turns your source into bytecode and runs it immediately, collecting type feedback as it goes. When a function turns out to be <b>hot</b>, <b>TurboFan</b> recompiles it into optimised machine code using what was observed at runtime.",
            np: "Senior स्तरमा performance को काम micro-optimisation रट्नुभन्दा <b>engine ले तपाईंको code मुनि के गर्दैछ</b> जान्नुमा बढी हुन्छ। V8 ले हरेक statement सधैं interpret गर्दैन: <b>Ignition</b> ले source लाई bytecode बनाएर तुरुन्तै चलाउँछ, र चल्दै जाँदा type feedback जम्मा गर्छ। कुनै function <b>hot</b> देखिएपछि, <b>TurboFan</b> ले runtime मा देखिएको कुरा प्रयोग गरी त्यसलाई optimize गरिएको machine code मा recompile गर्छ।",
            jp: "上級での性能改善は、細かな最適化を暗記することより<b>エンジンがコードの下で何をしているか</b>を知ることに寄る。V8はすべての文をいつまでも解釈するわけではない。<b>Ignition</b> がソースをバイトコードにして即座に実行し、その間に型のフィードバックを集める。ある関数が<b>ホット</b>だと分かると、<b>TurboFan</b> が実行時の観測をもとに最適化された機械語へ再コンパイルする。",
          },
        },
        {
          type: "paragraph",
          text: {
            en: "V8 does not interpret JavaScript line by line — it compiles it. When V8 sees code for the first time, it uses a fast but non-optimizing compiler called **Ignition** to quickly generate bytecode. As code runs repeatedly, V8's profiler marks 'hot' functions. **TurboFan**, the optimizing compiler, then generates highly optimized machine code for those hot functions based on type feedback — assumptions about what types the function has actually seen.",
            np: "V8 ले JavaScript line by line interpret गर्दैन — compile गर्छ। Code पहिलो पटक देख्दा fast तर non-optimizing compiler **Ignition** प्रयोग गरेर bytecode generate गर्छ। Code बारम्बार run हुँदा V8 को profiler ले 'hot' functions mark गर्छ। **TurboFan** ले type feedback मा based optimized machine code generate गर्छ।",
            jp: "V8はJavaScriptを行ごとに解釈せずコンパイルする。初回は高速だが非最適化のコンパイラ**Ignition**がバイトコードを生成。繰り返し実行されるとV8のプロファイラが「ホット」関数をマーク。**TurboFan**が型フィードバックに基づいて高度に最適化されたマシンコードを生成する。",
          },
        },
        {
          type: "code",
          title: { en: "From source to optimised code, and back again", np: "Source देखि optimize भएको code, र फेरि फर्किँदा", jp: "ソースから最適化コードへ、そして戻る道" },
          code: `JavaScript source
       ↓
     Parser
       ↓
   Bytecode  (Ignition)
       ↓
  Execute + collect type feedback
       ↓
  Hot code detected
       ↓
    TurboFan
       ↓
 Optimized machine code
       ↓
  Assumption becomes invalid
       ↓
   Deoptimization
       ↓
 Less specialized execution


// V8 watches this and sees two numbers, every time
function add(a, b) {
  return a + b;
}

add(10, 20);
add(5, 15);
add(100, 200);

// Then the assumption stops holding
add("Hello", " World");   // the optimized version no longer fits

// Deoptimization is not a bug. It is how the engine stays correct when
// the assumptions behind an optimization stop being true.`,
        },
        { type: "youtube", videoId: "p-iiEDtpy6I", title: "JavaScript V8 Engine Explained" },
        {
          type: "code",
          title: { en: "Hidden classes — why object shape consistency matters", np: "Hidden classes — object shape consistency किन important", jp: "隠れクラス — オブジェクト形状の一貫性が重要な理由" },
          code: `// ── Hidden classes (also called Maps or Shapes) ───────────────────
// V8 assigns a hidden class to every object based on its property shape.
// Objects with the same shape share the same hidden class → fast lookups.

// ✅ Same hidden class — fast property access
function Point(x, y) {
  this.x = x;  // both properties added in same order
  this.y = y;
}
const p1 = new Point(1, 2);
const p2 = new Point(3, 4);
// p1 and p2 share the same hidden class → V8 can use inline caching

// ❌ Different hidden classes — degrades to slow lookup
const a = {};
a.x = 1;  // hidden class A (no properties)
a.y = 2;  // hidden class B (has x)
           // Each assignment transitions to a new hidden class

const b = {};
b.y = 1;  // different order! — different hidden class transition
b.x = 2;  // b gets a DIFFERENT hidden class than a

// V8 now has two different hidden classes for what looks like the same shape
// → inline cache misses → slower

// ── Best practices to avoid hidden class pollution ────────────────
// 1. Always initialize all properties in the constructor
function UserGood(name, email, role) {
  this.name  = name;   // always add properties in the same order
  this.email = email;
  this.role  = role;
}

// 2. Don't add properties after construction
function UserBad(name) {
  this.name = name;
}
const u = new UserBad("Alice");
u.email = "alice@test.com";  // adds a property after creation — new hidden class

// 3. Don't delete properties
delete u.email;  // deletes property — hidden class changes again

// ── Monomorphic vs polymorphic inline caches ──────────────────────
function getX(point) {
  return point.x;
}

// Monomorphic — always called with same hidden class → V8 inlines lookup
getX(new Point(1, 2));  // fast
getX(new Point(3, 4));  // fast

// Polymorphic — called with different hidden classes → slower
getX({ x: 1 });         // different shape
getX(new Point(1, 2));  // different shape
// V8 must check which hidden class at each call`,
        },
      ],
    },
    {
      title: { en: "Hidden classes, inline caches and deoptimization", np: "Hidden class, inline cache र deoptimization", jp: "隠しクラス・インラインキャッシュ・最適化解除" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "JavaScript objects are dynamic, but V8 still optimises property access by tracking each object's <b>hidden class</b> — its internal shape. Two objects built by the same constructor in the same order share a shape, so the engine knows where `name` lives without looking it up. Build them differently and you get different shapes even when the final properties match: `a.name` then `a.age` transitions through different states than `b.age` then `b.name`.",
            np: "JavaScript object गतिशील छन्, तर V8 ले हरेक object को <b>hidden class</b> — यसको भित्री आकार — पछ्याएर property पहुँच optimize गर्छ। उही constructor ले उही क्रममा बनाएका दुई object ले आकार बाँड्छन्, त्यसैले engine ले `name` कहाँ छ नखोजी थाहा पाउँछ। फरक तरिकाले बनाए, अन्तिम property मिले पनि आकार फरक हुन्छ: `a.name` अनि `a.age` ले `b.age` अनि `b.name` भन्दा फरक अवस्थाबाट यात्रा गर्छ।",
            jp: "JavaScriptのオブジェクトは動的だが、V8は各オブジェクトの<b>隠しクラス</b>、つまり内部の形を追ってプロパティ参照を最適化する。同じコンストラクタが同じ順で作った2つは形を共有するので、エンジンは探索せずに `name` の位置を知る。作り方が違えば、最終的なプロパティが同じでも形は異なる。`a.name` の次に `a.age` と、`b.age` の次に `b.name` は別の遷移をたどる。",
          },
        },
        {
          type: "paragraph",
          text: {
            en: "Shapes matter because of <b>inline caches</b>. A call site like `return user.name` that only ever sees one shape stays <b>monomorphic</b> and the lookup collapses to a fixed offset. Feed it three different shapes and it becomes <b>polymorphic</b>, and the engine has to check which one it got. The practical lesson is narrow: <b>prefer predictable object construction in hot paths</b>, and do not contort ordinary application code for optimisations you have not measured.",
            np: "आकार महत्वपूर्ण हुनुको कारण <b>inline cache</b> हो। `return user.name` जस्तो call site ले सधैं एउटै आकार देख्यो भने <b>monomorphic</b> रहन्छ र lookup निश्चित offset मा खुम्चिन्छ। तीन फरक आकार दिनुहोस्, यो <b>polymorphic</b> बन्छ र engine ले कुन आयो भनी जाँच्नुपर्छ। व्यावहारिक पाठ साँघुरो छ: <b>hot path मा पूर्वानुमानयोग्य object निर्माण रोज्नुहोस्</b>, र नमापेका optimisation का लागि सामान्य application code नबिगार्नुहोस्।",
            jp: "形が効くのは<b>インラインキャッシュ</b>のため。`return user.name` のような呼び出し地点が常に1つの形しか見なければ<b>単形</b>のままで、参照は固定オフセットに畳まれる。3つの異なる形を与えれば<b>多形</b>になり、エンジンはどれが来たかを確かめねばならない。実務上の教訓は狭い。<b>ホットパスでは予測しやすいオブジェクト生成を選ぶ</b>。測っていない最適化のために普通のコードを歪めない。",
          },
        },
        {
          type: "code",
          title: { en: "Shapes, call sites and why optimizations get thrown away", np: "आकार, call site र optimisation किन फालिन्छ", jp: "形・呼び出し地点・最適化が捨てられる理由" },
          code: `// ── Same constructor, same order, same shape ──────────────────────
function User(name, email, role) {
  this.name = name;
  this.email = email;
  this.role = role;
}

const a = new User("Alice", "a@test.com", "admin");
const b = new User("Bob", "b@test.com", "user");
// V8 can treat these identically when reading properties.

// ── Same end state, different transitions ─────────────────────────
const one = {};
one.name = "Alice";
one.age = 30;

const two = {};
two.age = 30;
two.name = "Bob";
// Both end up { name, age } but arrive through different shapes.

// ── Inline caches: monomorphic beats polymorphic ──────────────────
function getName(user) {
  return user.name;     // one shape here -> a fixed offset
}

getName({ name: "Alice" });
getName({ name: "Bob", age: 30 });          // a second shape
getName({ name: "Charlie", email: "c@x" }); // a third: now polymorphic

// ── Deoptimization, in one function ───────────────────────────────
function multiply(a, b) {
  return a * b;
}

multiply(10, 20);
multiply(5, 4);        // V8 specializes for numbers
multiply("10", 20);    // still 200, but the assumption no longer holds

// The rule worth keeping: predictable shapes in hot code, and nowhere
// else. Do not rewrite readable code for a hypothetical optimization.`,
        },
      ],
    },
    {
      title: { en: "Garbage collection and allocation pressure", np: "Garbage collection र allocation चाप", jp: "ガベージコレクションと確保の圧力" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "V8's GC is generational — it is based on the observation that most objects die young (short-lived variables, loop temporaries). New objects are allocated in the **young generation** (small, GC'd frequently). Objects that survive a few collections are promoted to the **old generation** (larger, GC'd less often with a more expensive algorithm). This is why allocating many short-lived objects in a hot loop has a real cost — each one goes through the young generation GC.",
            np: "V8 का GC generational छ — अधिकांश objects early मर्छन् (short-lived variables, loop temporaries)। नयाँ objects **young generation** मा allocate हुन्छन् (small, frequently GC'd)। केही collections survive गरेका objects **old generation** मा promote हुन्छन्। त्यसैले hot loop मा धेरै short-lived objects allocate गर्दा real cost छ।",
            jp: "V8のGCは世代別 — ほとんどのオブジェクトは早期に死ぬという観察に基づく（短命な変数・ループの一時変数）。新しいオブジェクトは**若い世代**（小さく頻繁にGC）に割り当てられる。数回のコレクションを生き残ったオブジェクトは**古い世代**へ昇格。ホットループでの多数の短命オブジェクト生成がコストになる理由。",
          },
        },
        {
          type: "paragraph",
          text: {
            en: "V8's collector is <b>generational</b>, built on the observation that most objects die young. New objects land in the <b>young generation</b>, where collection is cheap and frequent; whatever survives long enough is promoted to the <b>old generation</b>, collected less often and more expensively. That is why a function returning a short-lived temporary object is not automatically a problem — the collector is built for exactly that pattern.",
            np: "V8 को collector <b>generational</b> छ, धेरैजसो object छिट्टै मर्छन् भन्ने अवलोकनमा आधारित। नयाँ object <b>young generation</b> मा पर्छन्, जहाँ संकलन सस्तो र बारम्बार हुन्छ; पर्याप्त बाँचेकालाई <b>old generation</b> मा बढुवा गरिन्छ, जहाँ संकलन कम पटक र महँगो हुन्छ। त्यसैले छोटो आयुको अस्थायी object फर्काउने function आफैंमा समस्या होइन — collector ठ्याक्कै यही ढाँचाका लागि बनेको हो।",
            jp: "V8のコレクタは<b>世代別</b>で、多くのオブジェクトは若くして死ぬという観察に基づく。新しいオブジェクトは<b>若い世代</b>に置かれ、そこでの回収は安く頻繁。十分に生き延びたものは<b>古い世代</b>へ昇格し、回収は稀で高くつく。だから短命な一時オブジェクトを返す関数がそれだけで問題になることはない。コレクタはまさにその形のために作られている。",
          },
        },
        {
          type: "code",
          title: { en: "Avoiding GC pressure in hot code paths", np: "Hot code paths मा GC pressure avoid गर्नु", jp: "ホットコードパスでのGCプレッシャーの回避" },
          code: `// ── GC-friendly patterns ─────────────────────────────────────────

// ❌ Allocating objects inside a hot loop — triggers GC
function processItems(items) {
  for (const item of items) {
    const result = {         // new object every iteration
      id:    item.id,
      value: item.value * 2,
    };
    sendToAPI(result);
  }
}

// ✅ Object pooling — reuse a single object
function processItemsFast(items) {
  const result = { id: 0, value: 0 };  // allocate ONCE
  for (const item of items) {
    result.id    = item.id;             // reuse the same object
    result.value = item.value * 2;
    sendToAPI(result);
  }
}

// ✅ Using typed arrays for numeric data — no object overhead
const scores = new Float64Array(1000);  // contiguous memory, no GC pressure
for (let i = 0; i < scores.length; i++) {
  scores[i] = Math.random();
}

// ── Typed arrays — V8 uses unboxed representation ─────────────────
// Regular arrays of mixed types → boxed (each element is a JS object)
// Typed arrays (Int32Array, Float64Array) → unboxed (raw C numbers)

const mixed = [1, 2, 3, "four", {}];  // boxed — slow for math
const nums  = new Float64Array([1, 2, 3, 4, 5]);  // unboxed — fast for math`,
        },
        {
          type: "paragraph",
          text: {
            en: "Pressure is a different matter. A loop that allocates a fresh object per iteration is fine at a thousand iterations and worth measuring at ten million. For large numeric datasets a <b>typed array</b> such as `Float64Array` gives a compact, uniform representation that avoids per-element objects entirely. What you should <b>not</b> do is reach for object pooling on instinct: it complicates the code, and on a modern engine it often makes things slower. Measure the allocation and GC behaviour first, then decide.",
            np: "चाप भने फरक कुरा हो। प्रति iteration नयाँ object बनाउने loop हजार iteration मा ठीकै छ र एक करोडमा माप्न लायक। ठूलो संख्यात्मक dataset का लागि `Float64Array` जस्तो <b>typed array</b> ले सघन, एकनास प्रतिनिधित्व दिन्छ र प्रति-element object पूरै हटाउँछ। जे <b>गर्नु हुँदैन</b> त्यो हो — बानीले object pooling तिर हात बढाउनु: यसले code जटिल बनाउँछ, र आधुनिक engine मा प्रायः झन् ढिलो पार्छ। पहिले allocation र GC व्यवहार माप्नुहोस्, अनि निर्णय गर्नुहोस्।",
            jp: "圧力は別の話。反復ごとにオブジェクトを作るループは、1000回なら問題なく、1000万回なら測る価値がある。大きな数値データには `Float64Array` のような<b>型付き配列</b>が、要素ごとのオブジェクトを丸ごと不要にする密で一様な表現を与える。<b>やってはいけない</b>のは、反射でオブジェクトプールに手を伸ばすこと。コードは複雑になり、現代のエンジンではむしろ遅くなることが多い。まず確保とGCの挙動を測り、それから決める。",
          },
        },
      ],
    },
    {
      title: { en: "Profiling — measure before you optimize", np: "Profiling — optimize गर्नुअघि माप्नुहोस्", jp: "プロファイリング — 最適化の前に測る" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Never optimise on intuition. `performance.now()` gives high-resolution timing around a suspect block, `console.time()` is the quickest way to bracket an operation, and `performance.mark()` plus `performance.measure()` name specific spans so you can compare them across runs. In the browser, a DevTools performance recording shows long tasks — anything blocking the main thread beyond about <b>50 ms</b>. In Node, `node --prof`, the inspector, heap snapshots and `process.memoryUsage()` cover the same ground.",
            np: "कहिल्यै अनुमानमा optimize नगर्नुहोस्। `performance.now()` ले शंकास्पद खण्ड वरिपरि उच्च-रिजोल्युसन समय दिन्छ, `console.time()` operation घेर्ने सबैभन्दा छिटो तरिका हो, र `performance.mark()` सँगै `performance.measure()` ले निश्चित अवधिलाई नाम दिन्छ ताकि run बीच तुलना गर्न सकियोस्। Browser मा DevTools को performance recording ले long task देखाउँछ — मुख्य thread लाई करिब <b>50 ms</b> भन्दा बढी रोक्ने जुनसुकै। Node मा `node --prof`, inspector, heap snapshot र `process.memoryUsage()` ले उही काम गर्छन्।",
            jp: "直感で最適化しない。`performance.now()` は疑わしい区間の高分解能な計測を与え、`console.time()` は処理を挟む最速の手段、`performance.mark()` と `performance.measure()` は特定の区間に名前を付けて実行間で比較できるようにする。ブラウザではDevToolsの記録がロングタスク、つまりメインスレッドを約<b>50 ms</b>以上塞ぐものを示す。Nodeでは `node --prof`・インスペクタ・ヒープスナップショット・`process.memoryUsage()` が同じ役割を担う。",
          },
        },
        {
          type: "code",
          title: { en: "Profiling with Chrome DevTools and Node.js --prof", np: "Chrome DevTools र Node.js --prof सँग profiling", jp: "Chrome DevToolsとNode.js --profによるプロファイリング" },
          code: `// ── Performance.now() — high-resolution timer ────────────────────
const start = performance.now();
doExpensiveWork();
const elapsed = performance.now() - start;
console.log(\`Took \${elapsed.toFixed(2)}ms\`);

// ── console.time / timeEnd — simple labelled timing ───────────────
console.time("database-query");
await db.query("SELECT * FROM products");
console.timeEnd("database-query");  // logs "database-query: 45.2ms"

// ── Node.js CPU profiling ────────────────────────────────────────
// Run with --prof to generate a V8 profiling log:
//   node --prof app.js
// Process the log into human-readable form:
//   node --prof-process isolate-*.log > profile.txt
// Look for functions taking the most time in "Summary" and "[Bottom up]"

// ── Performance API — measuring named sections ────────────────────
performance.mark("fetchStart");
await fetchUser(id);
performance.mark("fetchEnd");
performance.measure("fetchUser", "fetchStart", "fetchEnd");

const [entry] = performance.getEntriesByName("fetchUser");
console.log(\`fetchUser: \${entry.duration.toFixed(2)}ms\`);

// ── Memory usage ──────────────────────────────────────────────────
const mem = process.memoryUsage();
console.log({
  rss:      \`\${Math.round(mem.rss / 1024 / 1024)}MB\`,        // total memory
  heapUsed: \`\${Math.round(mem.heapUsed / 1024 / 1024)}MB\`,   // JS objects
  heapTotal:\`\${Math.round(mem.heapTotal / 1024 / 1024)}MB\`,  // allocated heap
  external: \`\${Math.round(mem.external / 1024 / 1024)}MB\`,   // C++ objects (Buffers)
});

// ── Clinic.js — easy Node.js performance diagnosis ────────────────
// npm install -g clinic
// clinic doctor -- node app.js   → detect event loop lag, memory leaks, I/O issues
// clinic flame  -- node app.js   → interactive flame graph of CPU usage`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            { en: "**Use Chrome DevTools Performance tab** to record and analyse the flame graph of your frontend JavaScript. Look for long tasks (tasks > 50ms that block the main thread).", np: "**Chrome DevTools Performance tab** प्रयोग गर्नुहोस् frontend JS को flame graph analyse गर्न। Long tasks (main thread block गर्ने >50ms tasks) हेर्नुहोस्।", jp: "**Chrome DevTools Performanceタブ**でフロントエンドJSのフレームグラフを記録・分析。長いタスク（メインスレッドをブロックする50ms超のタスク）を探す。" },
            { en: "**Measure before you optimize** — premature optimization is the root of all evil (Knuth). Profile first, find the actual bottleneck, then fix it. A 10× speedup in code that takes 1ms saves you 9ms. A 1.1× speedup in code that takes 500ms saves you 45ms.", np: "**Optimize गर्नु अघि measure गर्नुहोस्** — profile गर्नुहोस्, actual bottleneck find गर्नुहोस्, अनि fix गर्नुहोस्। 1ms लिने code मा 10× speedup भन्दा 500ms लिने code मा 1.1× speedup बढी valuable।", jp: "**最適化前に計測する** — まずプロファイルして実際のボトルネックを特定してから修正。1msのコードを10倍速くしても9ms節約。500msのコードを1.1倍速くすれば45ms節約。" },
            { en: "**Async context tracking** — Node.js 16+ has `AsyncLocalStorage` for propagating context (like a request ID or user session) through async call chains without passing it explicitly through every function.", np: "**AsyncLocalStorage** (Node.js 16+) ले async call chains मार्फत context (request ID, user session) हर function मा explicitly pass नगरी propagate गर्छ।", jp: "**AsyncLocalStorage** (Node.js 16+)は非同期呼び出しチェーン全体でコンテキスト（リクエストIDやセッション）を明示的に渡さずに伝播させる。" },
          ],
        },
        {
          type: "code",
          title: { en: "Where the time actually goes, and keeping context across awaits", np: "समय वास्तवमा कहाँ जान्छ, र await पार context राख्नु", jp: "時間の実際の行き先と、await をまたぐ文脈の保持" },
          code: `// ── A 500ms endpoint, measured rather than guessed ────────────────
// Database query        380ms
// External API           90ms
// JavaScript processing  20ms
// JSON serialization     10ms
// ------------------------------
// Total                 500ms
//
// Making the JavaScript 4x faster saves 15ms.
// Halving the database query saves 190ms.
// Optimize what the profile shows, not what looks inefficient.

// ── Naming spans so you can compare runs ──────────────────────────
performance.mark("fetchStart");
await fetchUser(42);
performance.mark("fetchEnd");

performance.measure("fetchUser", "fetchStart", "fetchEnd");

const [entry] = performance.getEntriesByName("fetchUser");
console.log(entry.duration);

// ── Node memory, four numbers worth knowing ───────────────────────
const memory = process.memoryUsage();
// rss        total memory held by the process
// heapUsed   JavaScript heap currently in use
// heapTotal  JavaScript heap V8 has allocated
// external   memory tied to native resources

// ── AsyncLocalStorage — context that survives an await ────────────
import { AsyncLocalStorage } from "node:async_hooks";

const storage = new AsyncLocalStorage();

function log(message) {
  const context = storage.getStore();
  console.log(\`[request:\${context?.requestId}] \${message}\`);
}

storage.run({ requestId: "req-123" }, async () => {
  log("Request started");
  await new Promise(resolve => setTimeout(resolve, 100));
  log("Request finished");   // the request id is still here
});
// This is how request ids, tracing and logging context propagate
// without threading a parameter through every function.`,
        },
        {
          type: "paragraph",
          text: {
            en: "Five beliefs are worth dropping. <b>\"JavaScript is slow because it is interpreted\"</b> — V8 interprets, profiles, compiles and deoptimises. <b>\"Every object must have the same shape\"</b> — that matters in hot paths, not in ordinary code. <b>\"Creating an object is slow\"</b> — modern engines are very good at it; optimise allocation when a profile shows GC pressure. <b>\"Deoptimization means something is broken\"</b> — it is the mechanism that keeps optimised code correct. And <b>\"micro-optimisations always pay\"</b> — making a 1 ms operation ten times faster saves 0.9 ms, while cutting a 500 ms one to 200 ms saves 300.",
            np: "पाँच विश्वास छाड्न लायक छन्। <b>\"JavaScript ढिलो छ किनकि यो interpret हुन्छ\"</b> — V8 ले interpret, profile, compile र deoptimise गर्छ। <b>\"हरेक object को आकार उही हुनुपर्छ\"</b> — यो hot path मा महत्वपूर्ण छ, सामान्य code मा होइन। <b>\"Object बनाउनु ढिलो छ\"</b> — आधुनिक engine यसमा धेरै राम्रा छन्; profile ले GC चाप देखाए मात्र allocation optimize गर्नुहोस्। <b>\"Deoptimization भनेको केही बिग्रियो\"</b> — यो त optimize भएको code सही राख्ने संयन्त्र हो। र <b>\"micro-optimisation सधैं फाइदाजनक हुन्छ\"</b> — 1 ms को काम दस गुणा छिटो बनाउँदा 0.9 ms बच्छ, 500 ms लाई 200 ms बनाउँदा 300 बच्छ।",
            jp: "手放してよい思い込みが5つ。<b>「JavaScriptは解釈実行だから遅い」</b> — V8は解釈し、観測し、コンパイルし、最適化を解除する。<b>「すべてのオブジェクトは同じ形であるべき」</b> — 効くのはホットパスで、普通のコードではない。<b>「オブジェクト生成は遅い」</b> — 現代のエンジンは得意。GCの圧力がプロファイルに出たときだけ確保を減らす。<b>「最適化解除は壊れた印」</b> — むしろ最適化されたコードの正しさを守る仕組み。そして<b>「細かな最適化は常に得」</b> — 1 msを10倍速くしても0.9 msしか浮かないが、500 msを200 msにすれば300 ms浮く。",
          },
        },
      ],
    },
  ],
  quiz: [
    {
      question: { en: "What is TurboFan's role in V8?", np: "V8 मा TurboFan को भूमिका के हो?", jp: "V8におけるTurboFanの役割は?" },
      options: [
        { en: "Parsing HTML", np: "HTML parse गर्नु", jp: "HTMLを解析する" },
        { en: "Optimizing hot JavaScript into machine code", np: "Hot JavaScript लाई machine code मा optimize गर्नु", jp: "ホットなJavaScriptを機械語へ最適化する" },
        { en: "Managing HTTP requests", np: "HTTP request व्यवस्थापन गर्नु", jp: "HTTPリクエストを管理する" },
        { en: "Storing objects permanently", np: "Object सधैंका लागि राख्नु", jp: "オブジェクトを永久に保存する" },
      ],
      correctIndex: 1,
      explanation: { en: "Ignition runs the bytecode first and collects the type feedback TurboFan uses.", np: "पहिले Ignition ले bytecode चलाउँछ र TurboFan ले प्रयोग गर्ने type feedback जम्मा गर्छ।", jp: "先にIgnitionがバイトコードを走らせ、TurboFanが使う型フィードバックを集める。" },
    },
    {
      question: { en: "Why can objects with consistent shapes be faster?", np: "एउटै आकार भएका object किन छिटो हुन सक्छन्?", jp: "形が一貫したオブジェクトが速くなりうるのはなぜか?" },
      options: [
        { en: "V8 can optimize property access through a predictable hidden class", np: "V8 ले पूर्वानुमानयोग्य hidden class मार्फत property पहुँच optimize गर्न सक्छ", jp: "予測できる隠しクラスによりプロパティ参照を最適化できるから" },
        { en: "They use less syntax", np: "तिनले कम syntax प्रयोग गर्छन्", jp: "構文が少ないから" },
        { en: "They become immutable automatically", np: "तिनी स्वतः अपरिवर्तनीय बन्छन्", jp: "自動的に不変になるから" },
        { en: "They skip garbage collection", np: "तिनले garbage collection छल्छन्", jp: "GCを回避するから" },
      ],
      correctIndex: 0,
      explanation: { en: "A monomorphic call site collapses the lookup to a fixed offset.", np: "Monomorphic call site ले lookup लाई निश्चित offset मा खुम्च्याउँछ।", jp: "単形の呼び出し地点では、参照が固定オフセットに畳まれる。" },
    },
    {
      question: { en: "What is deoptimization?", np: "Deoptimization के हो?", jp: "最適化解除とは何か?" },
      options: [
        { en: "Deleting source code", np: "Source code मेटाउनु", jp: "ソースコードを削除すること" },
        { en: "Converting JavaScript to TypeScript", np: "JavaScript लाई TypeScript बनाउनु", jp: "JavaScriptをTypeScriptに変換すること" },
        { en: "Freeing every object in memory", np: "Memory का हरेक object मुक्त गर्नु", jp: "メモリ上の全オブジェクトを解放すること" },
        { en: "Abandoning an optimization because its assumptions no longer hold", np: "मान्यता नरहेकाले optimisation छाड्नु", jp: "前提が成り立たなくなったため最適化を捨てること" },
      ],
      correctIndex: 3,
      explanation: { en: "It is how the engine stays correct, not a sign that something broke.", np: "यो engine सही रहने तरिका हो, केही बिग्रेको संकेत होइन।", jp: "壊れた印ではなく、エンジンが正しさを保つ仕組み。" },
    },
    {
      question: { en: "What should you do before optimizing a suspected bottleneck?", np: "शंकास्पद bottleneck optimize गर्नुअघि के गर्नुपर्छ?", jp: "ボトルネックらしき箇所を最適化する前に何をすべきか?" },
      options: [
        { en: "Rewrite it in another language", np: "अर्को भाषामा लेख्नु", jp: "別の言語で書き直す" },
        { en: "Add caching immediately", np: "तुरुन्तै caching थप्नु", jp: "すぐキャッシュを足す" },
        { en: "Measure and profile it", np: "माप्नु र profile गर्नु", jp: "測ってプロファイルする" },
        { en: "Use `delete` less often", np: "`delete` कम प्रयोग गर्नु", jp: "`delete` の使用を減らす" },
      ],
      correctIndex: 2,
      explanation: { en: "A 500ms endpoint spending 380ms in the database will not be fixed in JavaScript.", np: "500ms को endpoint ले 380ms database मा बिताउँछ भने JavaScript मा समाधान हुँदैन।", jp: "500msのうち380msがDBなら、JavaScript側では直らない。" },
    },
    {
      question: { en: "Which API gives high-resolution elapsed time?", np: "कुन API ले उच्च-रिजोल्युसन बितेको समय दिन्छ?", jp: "高分解能な経過時間を返すAPIは?" },
      options: [
        { en: "`performance.now()`", np: "`performance.now()`", jp: "`performance.now()`" },
        { en: "`Date.parse()`", np: "`Date.parse()`", jp: "`Date.parse()`" },
        { en: "`Object.time()`", np: "`Object.time()`", jp: "`Object.time()`" },
        { en: "`process.clock()`", np: "`process.clock()`", jp: "`process.clock()`" },
      ],
      correctIndex: 0,
      explanation: { en: "`console.time()` is the quick version; `performance.mark()` names spans.", np: "`console.time()` छिटो संस्करण हो; `performance.mark()` ले अवधिलाई नाम दिन्छ।", jp: "`console.time()` は簡易版で、`performance.mark()` は区間に名前を付ける。" },
    },
    {
      question: { en: "What is a \"long task\" in the browser?", np: "Browser मा \"long task\" के हो?", jp: "ブラウザでの「ロングタスク」とは?" },
      options: [
        { en: "Any task taking more than one second", np: "एक सेकेन्डभन्दा बढी लाग्ने जुनसुकै task", jp: "1秒を超えるタスク" },
        { en: "Any asynchronous operation", np: "कुनै पनि asynchronous operation", jp: "あらゆる非同期処理" },
        { en: "A task blocking the main thread beyond about 50 ms", np: "मुख्य thread लाई करिब 50 ms भन्दा बढी रोक्ने task", jp: "メインスレッドを約50 ms以上塞ぐタスク" },
      ],
      correctIndex: 2,
      explanation: { en: "Past that, input and rendering start visibly stalling.", np: "त्यसभन्दा पर, input र rendering देखिने गरी अड्किन थाल्छन्।", jp: "それを超えると、入力と描画が目に見えて滞り始める。" },
    },
    {
      question: { en: "Which generation do most new objects die in?", np: "धेरैजसो नयाँ object कुन generation मा मर्छन्?", jp: "多くの新しいオブジェクトが死ぬのはどの世代か?" },
      options: [
        { en: "The young generation", np: "Young generation", jp: "若い世代" },
        { en: "The old generation", np: "Old generation", jp: "古い世代" },
        { en: "Neither, objects are freed manually", np: "कुनै पनि होइन, object हातले मुक्त गरिन्छ", jp: "どちらでもない。手動で解放する" },
      ],
      correctIndex: 0,
      explanation: { en: "Generational collection is built on exactly that observation.", np: "Generational संकलन ठ्याक्कै यही अवलोकनमा बनेको छ।", jp: "世代別回収はまさにその観察の上に成り立つ。" },
    },
    {
      question: { en: "When is a typed array such as `Float64Array` worth reaching for?", np: "`Float64Array` जस्तो typed array कहिले काम लाग्छ?", jp: "`Float64Array` のような型付き配列が有効なのはいつか?" },
      options: [
        { en: "For large numeric datasets, where it avoids per-element objects", np: "ठूलो संख्यात्मक dataset मा, जहाँ यसले प्रति-element object हटाउँछ", jp: "大きな数値データで、要素ごとのオブジェクトを避けたいとき" },
        { en: "For any array of more than ten items", np: "दस भन्दा बढी item भएको जुनसुकै array मा", jp: "10件を超える配列すべて" },
        { en: "Whenever you want the array to be immutable", np: "Array अपरिवर्तनीय चाहिँदा", jp: "配列を不変にしたいとき" },
      ],
      correctIndex: 0,
      explanation: { en: "It gives a compact, uniform representation instead of boxed values.", np: "यसले box गरिएका मानको सट्टा सघन, एकनास प्रतिनिधित्व दिन्छ।", jp: "ボックス化された値の代わりに、密で一様な表現を与える。" },
    },
    {
      question: { en: "Why is object pooling poor default advice?", np: "Object pooling किन राम्रो पूर्वनिर्धारित सल्लाह होइन?", jp: "オブジェクトプールが既定の助言として不適なのはなぜか?" },
      options: [
        { en: "It is not supported outside Node", np: "Node बाहिर यो समर्थित छैन", jp: "Node以外では使えないから" },
        { en: "It complicates the code and often runs slower on modern engines", np: "यसले code जटिल बनाउँछ र आधुनिक engine मा प्रायः ढिलो चल्छ", jp: "コードを複雑にし、現代のエンジンではむしろ遅くなることが多いから" },
        { en: "It prevents garbage collection entirely", np: "यसले garbage collection पूरै रोक्छ", jp: "GCを完全に止めてしまうから" },
      ],
      correctIndex: 1,
      explanation: { en: "Measure the allocation and GC behaviour before introducing it.", np: "यो ल्याउनुअघि allocation र GC व्यवहार माप्नुहोस्।", jp: "導入する前に確保とGCの挙動を測る。" },
    },
    {
      question: { en: "What problem does `AsyncLocalStorage` solve?", np: "`AsyncLocalStorage` ले कुन समस्या हल गर्छ?", jp: "`AsyncLocalStorage` はどんな問題を解くか?" },
      options: [
        { en: "It speeds up asynchronous code", np: "यसले asynchronous code छिटो बनाउँछ", jp: "非同期コードを速くする" },
        { en: "It keeps context such as a request id available across awaits", np: "यसले request id जस्तो context await पार उपलब्ध राख्छ", jp: "リクエストIDのような文脈をawaitをまたいで保つ" },
        { en: "It stores data in localStorage on the server", np: "यसले server मा localStorage मा data राख्छ", jp: "サーバー側のlocalStorageにデータを保存する" },
      ],
      correctIndex: 1,
      explanation: { en: "Without it you thread the request id through every function by hand.", np: "यो नभए request id हरेक function मा हातले पठाउनुपर्छ।", jp: "無ければ、リクエストIDを全関数へ手で引き回すことになる。" },
    },
  ],
  faq: [
    {
      question: { en: "What are hidden classes and why do they matter?", np: "Hidden classes के हुन् र किन matter गर्छन्?", jp: "隠れクラスとは何か、なぜ重要か？" },
      answer: {
        en: "Hidden classes (also called Shapes or Maps in V8 documentation) are an internal optimization V8 uses to make property access fast. V8 assigns a hidden class to every object based on its current set of properties and their order. Objects that share the same hidden class can use the same optimized property lookup path (inline cache). Every time you add or delete a property, or add properties in a different order, V8 must create a new hidden class and potentially de-optimize code that assumed the previous shape. This is why object pooling, consistent constructor property ordering, and avoiding `delete` improve performance in hot paths.",
        np: "Hidden classes V8 ले property access fast बनाउन use गर्ने internal optimization हो। हरेक object लाई current properties र तिनीहरूको order मा based hidden class assign गरिन्छ। Same hidden class share गर्ने objects ले same optimized property lookup path use गर्न सक्छन्। Property add/delete गर्दा वा फरक order मा add गर्दा V8 ले new hidden class create गर्छ।",
        jp: "隠れクラス（V8ドキュメントではShapesまたはMaps）はプロパティアクセスを高速化するV8内部の最適化。各オブジェクトには現在のプロパティセットと順序に基づいて隠れクラスが割り当てられる。同じ隠れクラスを共有するオブジェクトは同じ最適化されたルックアップパスを使用できる。プロパティの追加・削除・異なる順序での追加で新しい隠れクラスが作成される。",
      },
    },
    {
      question: { en: "What does 'deoptimization' mean in V8?", np: "'Deoptimization' भनेको V8 मा के हो?", jp: "V8での「非最適化」とは何か？" },
      answer: {
        en: "V8's TurboFan makes assumptions when optimizing a function — for example, that a parameter is always a number, or that an object always has a certain shape. If those assumptions turn out to be wrong (a string is passed where a number was expected), V8 deoptimizes — it throws away the optimized machine code and falls back to slower bytecode interpretation. You can see deoptimizations in Chrome DevTools by enabling 'V8 runtime call stats'. Frequent deoptimizations in hot code are a signal to make your types more consistent.",
        np: "TurboFan ले function optimize गर्दा assumptions बनाउँछ — parameter हमेशा number हुन्छ, object हमेशा certain shape हुन्छ। Assumptions गलत भए V8 deoptimizes — optimized machine code throw away गर्छ र slower bytecode मा fall back गर्छ। Chrome DevTools मा 'V8 runtime call stats' enable गरेर deoptimizations देख्न सकिन्छ।",
        jp: "TurboFanは最適化時に仮定を立てる（パラメータは常に数値、オブジェクトは常に特定の形状など）。仮定が外れると非最適化 — 最適化されたマシンコードを破棄してより遅いバイトコード解釈に戻る。Chrome DevToolsで「V8 runtime call stats」を有効にすると確認できる。ホットコードでの頻繁な非最適化は型の一貫性を高めるサイン。",
      },
    },
    {
      question: { en: "How do I find the actual performance bottleneck in my Node.js app?", np: "Node.js app मा actual performance bottleneck कसरी find गर्ने?", jp: "Node.jsアプリの実際のパフォーマンスボトルネックを見つけるには？" },
      answer: {
        en: "Start with `clinic doctor` (easiest) — it runs your app under load, detects event loop lag, memory leaks, and I/O issues, and gives a clear diagnosis. For CPU profiling, run `node --prof app.js` and process the output with `node --prof-process`. For memory profiling, take heap snapshots in Chrome DevTools (connect to Node.js with `node --inspect`). For production, use APM tools like Datadog, New Relic, or OpenTelemetry to continuously profile and track performance regressions over time.",
        np: "`clinic doctor` बाट start गर्नुहोस् — event loop lag, memory leaks, I/O issues detect गर्छ। CPU profiling: `node --prof app.js` चलाएर `node --prof-process` सँग process। Memory: Chrome DevTools मा heap snapshots। Production: Datadog, New Relic, वा OpenTelemetry।",
        jp: "まず`clinic doctor`（最も簡単） — イベントループ遅延・メモリリーク・I/O問題を検出して診断。CPUプロファイル: `node --prof`で実行して`node --prof-process`で処理。メモリ: Chrome DevToolsでヒープスナップショット。本番: Datadog・New Relic・OpenTelemetryで継続的なプロファイリング。",
      },
    },
  ],
};
