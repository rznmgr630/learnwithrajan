import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const JS_DAY_25_DETAIL: RoadmapDayDetail = {
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
      title: { en: "Watch", np: "हेर्नुहोस्", jp: "動画" },
      blocks: [
        { type: "youtube", videoId: "p-iiEDtpy6I", title: "JavaScript V8 Engine Explained" },
      ],
    },
    {
      title: { en: "How V8 compiles and optimizes JavaScript", np: "V8 ले JavaScript कसरी compile र optimize गर्छ", jp: "V8がJavaScriptをコンパイル・最適化する仕組み" },
      blocks: [
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
      title: { en: "Garbage collector internals", np: "Garbage collector internals", jp: "ガベージコレクタの内部" },
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
      ],
    },
    {
      title: { en: "Performance profiling tools", np: "Performance profiling tools", jp: "パフォーマンスプロファイリングツール" },
      blocks: [
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
      ],
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
