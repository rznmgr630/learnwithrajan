import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_30_LESSONS: JsLessonDay = {
  day: 30,
  title: { en: "Senior JavaScript internals — V8, hidden classes, GC & profiling", np: "Senior JavaScript internals — V8, hidden class, GC र profiling", jp: "上級JavaScriptの内部 — V8・隠しクラス・GC・プロファイリング" },
  totalMinutes: 34,
  difficulty: { en: "Advanced", np: "उन्नत", jp: "上級" },
  lessons: [
    {
      id: "v8-pipeline",
      title: { en: "How V8 runs your JavaScript", np: "V8 ले तपाईंको JavaScript कसरी चलाउँछ", jp: "V8はJavaScriptをどう動かすか" },
      durationMinutes: 9,
      explanation: {
        en: "At senior level, performance work is less about memorising tricks and more about knowing <b>what the engine is doing underneath your code</b>.\n\nV8 does not interpret every statement forever. It runs a pipeline:\n\n```text\nJavaScript source\n       ↓\n     Parser\n       ↓\n   Bytecode  (Ignition)\n       ↓\n  Execute + collect type feedback\n       ↓\n  Hot code detected\n       ↓\n    TurboFan\n       ↓\n Optimized machine code\n```\n\n---\n\n### 1. Basic — Ignition\n\n<b>Ignition</b> is V8's interpreter. It turns your source into <i>bytecode</i> — a compact instruction set the engine executes directly — and starts running immediately, without spending time optimising anything.\n\nThat is deliberate: most code runs once. Optimising it would cost more than it saves.\n\n---\n\n### 2. Intermediate — TurboFan\n\nWhile Ignition runs, V8 watches. When a function is called often enough it is marked <b>hot</b>, and <b>TurboFan</b> recompiles it into optimised machine code using what was actually observed at runtime.\n\n```javascript\nfunction add(a, b) {\n  return a + b;\n}\n\nadd(10, 20);\nadd(5, 15);\nadd(100, 200);\n```\n\nV8 sees two numbers every time, so it can generate a version specialised for numbers — no type checks, no generic addition, just the machine instruction.\n\n---\n\n### 3. Advanced — deoptimization\n\nOptimised code rests on an assumption. When the assumption stops holding, the optimised version has to be thrown away:\n\n```javascript\nadd(\"Hello\", \" World\");\n```\n\nThat is <b>deoptimization</b>: V8 discards the specialised code and falls back to the slower general path.\n\n```text\n Optimized machine code\n       ↓\n Assumption becomes invalid\n       ↓\n   Deoptimization\n       ↓\n Less specialized execution\n```\n\n> <b>Deoptimization is not a bug.</b> It is the mechanism that keeps optimised code correct when reality changes. It only becomes a problem when a hot function deoptimises repeatedly, thrashing between the two paths.\n\n---\n\n### The idea to carry away\n\nDo not think \"JavaScript is slow because it is interpreted\". Think:\n\n<b>V8 interprets, profiles, compiles and deoptimises, continuously, based on what your code actually does.</b>\n\nWhich is why the same function can be fast in one program and slow in another.",
        np: "Senior स्तरमा performance को काम जुक्ति रट्नुभन्दा <b>engine ले तपाईंको code मुनि के गर्दैछ</b> जान्नुमा बढी हुन्छ।\n\nV8 ले हरेक statement सधैं interpret गर्दैन। यसले एउटा pipeline चलाउँछ:\n\n```text\nJavaScript source\n       ↓\n     Parser\n       ↓\n   Bytecode  (Ignition)\n       ↓\n  Execute + type feedback जम्मा\n       ↓\n  Hot code पत्ता लाग्यो\n       ↓\n    TurboFan\n       ↓\n Optimized machine code\n```\n\n---\n\n### 1. आधारभूत — Ignition\n\n<b>Ignition</b> V8 को interpreter हो। यसले source लाई <i>bytecode</i> — engine ले सिधै चलाउने सङ्क्षिप्त instruction set — मा बदल्छ र केही optimize गर्न समय नबिताई तुरुन्तै चलाउन थाल्छ।\n\nयो जानाजान हो: धेरैजसो code एक पटक चल्छ। त्यसलाई optimize गर्दा बचत भन्दा लागत बढी हुन्थ्यो।\n\n---\n\n### 2. मध्यम — TurboFan\n\nIgnition चल्दै गर्दा, V8 हेरिरहन्छ। Function पर्याप्त पटक बोलाइएपछि यसलाई <b>hot</b> चिन्ह लगाइन्छ, र <b>TurboFan</b> ले runtime मा वास्तवमा देखिएको कुरा प्रयोग गरी त्यसलाई optimize गरिएको machine code मा recompile गर्छ।\n\n```javascript\nfunction add(a, b) {\n  return a + b;\n}\n\nadd(10, 20);\nadd(5, 15);\nadd(100, 200);\n```\n\nV8 ले हरेक पटक दुई number देख्छ, त्यसैले number का लागि विशेषीकृत संस्करण बनाउन सक्छ — type जाँच छैन, सामान्य जोड छैन, बस machine instruction।\n\n---\n\n### 3. उन्नत — deoptimization\n\nOptimize भएको code एउटा मान्यतामा अडेको हुन्छ। मान्यता नरहँदा, त्यो संस्करण फाल्नुपर्छ:\n\n```javascript\nadd(\"Hello\", \" World\");\n```\n\nयही <b>deoptimization</b> हो: V8 ले विशेषीकृत code छाड्छ र ढिलो सामान्य बाटोमा फर्किन्छ।\n\n```text\n Optimized machine code\n       ↓\n मान्यता अमान्य भयो\n       ↓\n   Deoptimization\n       ↓\n कम विशेषीकृत execution\n```\n\n> <b>Deoptimization bug होइन।</b> यो त वास्तविकता बदलिँदा optimize भएको code सही राख्ने संयन्त्र हो। Hot function बारम्बार deoptimise भई दुई बाटोबीच धकेलिँदा मात्र यो समस्या बन्छ।\n\n---\n\n### सम्झेर लैजाने विचार\n\n\"JavaScript ढिलो छ किनकि यो interpret हुन्छ\" नसोच्नुहोस्। सोच्नुहोस्:\n\n<b>V8 ले तपाईंको code ले वास्तवमा के गर्छ त्यसकै आधारमा निरन्तर interpret, profile, compile र deoptimise गर्छ।</b>\n\nत्यसैले उही function एउटा program मा छिटो र अर्कोमा ढिलो हुन सक्छ।",
        jp: "上級での性能改善は、小技を覚えることより<b>エンジンがコードの下で何をしているか</b>を知ることに寄る。\n\nV8はすべての文をいつまでも解釈するわけではない。パイプラインを回す:\n\n```text\nJavaScript source\n       ↓\n     Parser\n       ↓\n   Bytecode  (Ignition)\n       ↓\n  実行しつつ型のフィードバックを収集\n       ↓\n  ホットなコードを検出\n       ↓\n    TurboFan\n       ↓\n Optimized machine code\n```\n\n---\n\n### 1. 基本 — Ignition\n\n<b>Ignition</b> はV8のインタプリタだ。ソースを<i>バイトコード</i>、つまりエンジンが直接実行できる簡潔な命令列に変え、最適化に時間をかけずすぐ動き出す。\n\nこれは意図的で、たいていのコードは一度しか走らない。最適化すれば節約より費用が上回る。\n\n---\n\n### 2. 中級 — TurboFan\n\nIgnitionが走るあいだ、V8は観察している。ある関数が十分な回数呼ばれると<b>ホット</b>と印が付き、<b>TurboFan</b> が実行時に実際に見た情報をもとに、最適化された機械語へ再コンパイルする。\n\n```javascript\nfunction add(a, b) {\n  return a + b;\n}\n\nadd(10, 20);\nadd(5, 15);\nadd(100, 200);\n```\n\nV8は毎回2つの数値を見るので、数値に特化した版を作れる。型チェックも汎用の加算もなく、機械語の命令だけになる。\n\n---\n\n### 3. 上級 — 最適化解除\n\n最適化されたコードは前提の上に立つ。前提が崩れれば、その版は捨てるしかない:\n\n```javascript\nadd(\"Hello\", \" World\");\n```\n\nこれが<b>最適化解除</b>だ。V8は特化コードを捨て、遅い汎用の道へ戻る。\n\n```text\n Optimized machine code\n       ↓\n 前提が成り立たなくなる\n       ↓\n   Deoptimization\n       ↓\n 特化度の低い実行\n```\n\n> <b>最適化解除はバグではない。</b>現実が変わったときに最適化コードの正しさを守る仕組みだ。問題になるのは、ホットな関数が何度も解除され、2つの道の間で往復するときだけ。\n\n---\n\n### 持ち帰る考え\n\n「JavaScriptは解釈実行だから遅い」と考えない。こう考える:\n\n<b>V8は、コードが実際に何をするかに基づいて、解釈し、観測し、コンパイルし、解除することを続けている。</b>\n\nだから同じ関数が、あるプログラムでは速く、別のプログラムでは遅くなる。",
      },
      diagram: `The pipeline, and the way back

JavaScript source
       ↓
     Parser
       ↓
   Bytecode  (Ignition)          starts immediately,
       ↓                         optimises nothing
  Execute + collect
   type feedback
       ↓
  Hot code detected
       ↓
    TurboFan                     recompiles using what
       ↓                         was actually observed
 Optimized machine code
       ↓
 Assumption becomes invalid
       ↓
   Deoptimization                back to the general path
       ↓
 Less specialized execution


Why the same function can be fast or slow

add(10, 20)         numbers every time  → specialised, fast
add("a", "b")       the assumption broke → deoptimised

nothing about add() changed. what it was fed did.`,
      codeExample: {
        title: { en: "Optimisation, and the assumption it rests on", np: "Optimisation, र यो अडेको मान्यता", jp: "最適化と、その前提" },
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
      keyTakeaways: [
        { en: "<b>Ignition</b> turns source into bytecode and starts running immediately, optimising nothing.", np: "<b>Ignition</b> ले source लाई bytecode बनाई तुरुन्तै चलाउन थाल्छ, केही optimize नगरी।", jp: "<b>Ignition</b> はソースをバイトコードにして即座に走り出し、最適化はしない。" },
        { en: "Starting fast is deliberate — most code runs once, so optimising it would cost more than it saves.", np: "छिटो सुरु गर्नु जानाजान हो — धेरैजसो code एक पटक चल्छ, optimize गर्दा बचत भन्दा लागत बढी हुन्थ्यो।", jp: "速く始めるのは意図的。多くのコードは一度しか走らず、最適化は割に合わない。" },
        { en: "V8 collects <b>type feedback</b> while running, which is what makes later optimisation possible.", np: "V8 ले चल्दै गर्दा <b>type feedback</b> जम्मा गर्छ, जसले पछिको optimisation सम्भव बनाउँछ।", jp: "V8は実行しながら<b>型のフィードバック</b>を集め、それが後の最適化を可能にする。" },
        { en: "A function called often enough becomes <b>hot</b>, and <b>TurboFan</b> recompiles it into machine code.", np: "पर्याप्त पटक बोलाइएको function <b>hot</b> बन्छ, र <b>TurboFan</b> ले machine code मा recompile गर्छ।", jp: "十分に呼ばれた関数は<b>ホット</b>になり、<b>TurboFan</b> が機械語へ再コンパイルする。" },
        { en: "<b>Deoptimization</b> happens when the assumption behind optimised code stops holding.", np: "Optimize भएको code पछाडिको मान्यता नरहँदा <b>deoptimization</b> हुन्छ।", jp: "最適化コードの前提が崩れると<b>最適化解除</b>が起きる。" },
        { en: "Deoptimization is <b>correctness machinery, not a bug</b> — it only hurts when a hot function thrashes.", np: "Deoptimization <b>शुद्धताको संयन्त्र हो, bug होइन</b> — hot function धकेलिँदा मात्र दुख्छ।", jp: "最適化解除は<b>正しさのための仕組みでバグではない</b>。害になるのはホットな関数が往復するときだけ。" },
      ],
      commonMistakes: [
        { en: "<b>Saying JavaScript is slow because it is interpreted</b> — V8 interprets, profiles, compiles and deoptimises continuously.", np: "<b>JavaScript interpret हुने भएकाले ढिलो छ भन्नु</b> — V8 ले निरन्तर interpret, profile, compile र deoptimise गर्छ।", jp: "<b>JavaScriptは解釈実行だから遅いと言う</b> — V8は解釈・観測・コンパイル・解除を絶えず続けている。" },
        { en: "<b>Treating deoptimization as a defect</b> — it is how the engine stays correct when the types it specialised for change.", np: "<b>Deoptimization लाई त्रुटि ठान्नु</b> — यो त विशेषीकृत type बदलिँदा engine सही रहने तरिका हो。", jp: "<b>最適化解除を欠陥扱いする</b> — 特化した型が変わったとき、エンジンが正しさを保つ手段。" },
        { en: "<b>Benchmarking a function once</b> — the first call runs interpreted bytecode, so a single measurement tells you nothing about the optimised path.", np: "<b>Function एक पटक benchmark गर्नु</b> — पहिलो call ले interpret भएको bytecode चलाउँछ, त्यसैले एउटै मापनले optimize भएको बाटोबारे केही भन्दैन।", jp: "<b>関数を1回だけ計測する</b> — 最初の呼び出しは解釈実行なので、最適化後の姿は何も分からない。" },
      ],
      quiz: [
        {
          question: { en: "What is TurboFan's role in V8?", np: "V8 मा TurboFan को भूमिका के हो?", jp: "V8におけるTurboFanの役割は?" },
          options: [
            { en: "Parsing HTML", np: "HTML parse गर्नु", jp: "HTMLを解析する" },
            { en: "Optimizing hot JavaScript into machine code", np: "Hot JavaScript लाई machine code मा optimize गर्नु", jp: "ホットなJavaScriptを機械語へ最適化する" },
            { en: "Managing HTTP requests", np: "HTTP request व्यवस्थापन", jp: "HTTPリクエストを管理する" },
            { en: "Storing objects permanently", np: "Object सधैंका लागि राख्नु", jp: "オブジェクトを永久に保存する" },
          ],
          correctIndex: 1,
          explanation: { en: "Ignition runs the bytecode first and collects the type feedback TurboFan uses.", np: "पहिले Ignition ले bytecode चलाउँछ र TurboFan ले प्रयोग गर्ने type feedback जम्मा गर्छ।", jp: "先にIgnitionがバイトコードを走らせ、TurboFanが使う型フィードバックを集める。" },
        },
        {
          question: { en: "Why does V8 start by interpreting rather than optimising?", np: "V8 ले optimize गर्नुको सट्टा interpret गरेर किन सुरु गर्छ?", jp: "V8が最適化ではなく解釈から始めるのはなぜか?" },
          options: [
            { en: "Most code runs once, so optimising it would cost more than it saves", np: "धेरैजसो code एक पटक चल्छ, optimize गर्दा बचत भन्दा लागत बढी हुन्थ्यो", jp: "多くのコードは一度しか走らず、最適化は割に合わないから" },
            { en: "Optimising is not possible until the program ends", np: "Program नसकिएसम्म optimize गर्न सकिँदैन", jp: "プログラムが終わるまで最適化できないから" },
            { en: "Bytecode is faster than machine code", np: "Bytecode machine code भन्दा छिटो छ", jp: "バイトコードの方が機械語より速いから" },
          ],
          correctIndex: 0,
          explanation: { en: "Starting fast matters more than optimising code that never repeats.", np: "कहिल्यै नदोहोरिने code optimize गर्नुभन्दा छिटो सुरु गर्नु महत्वपूर्ण छ।", jp: "繰り返さないコードを最適化するより、速く始める方が大事。" },
        },
        {
          question: { en: "What is deoptimization?", np: "Deoptimization के हो?", jp: "最適化解除とは何か?" },
          options: [
            { en: "Deleting source code", np: "Source code मेटाउनु", jp: "ソースコードを削除すること" },
            { en: "Converting JavaScript to TypeScript", np: "JavaScript लाई TypeScript बनाउनु", jp: "JavaScriptをTypeScriptに変換すること" },
            { en: "Freeing every object in memory", np: "Memory का हरेक object मुक्त गर्नु", jp: "メモリ上の全オブジェクトを解放すること" },
            { en: "Abandoning an optimization because its assumptions no longer hold", np: "मान्यता नरहेकाले optimisation छाड्नु", jp: "前提が成り立たなくなり最適化を捨てること" },
          ],
          correctIndex: 3,
          explanation: { en: "It is how the engine stays correct, not a sign that something broke.", np: "यो engine सही रहने तरिका हो, केही बिग्रेको संकेत होइन।", jp: "壊れた印ではなく、エンジンが正しさを保つ仕組み。" },
        },
        {
          question: { en: "What causes `add(a, b)` to deoptimise after many numeric calls?", np: "धेरै संख्यात्मक call पछि `add(a, b)` किन deoptimise हुन्छ?", jp: "数値の呼び出しを重ねた後 `add(a, b)` が最適化解除されるのはなぜか?" },
          options: [
            { en: "Passing strings, which breaks the assumption it was specialised for", np: "String पठाउँदा, जसले यो विशेषीकृत भएको मान्यता भाँच्छ", jp: "文字列を渡し、特化の前提が崩れるから" },
            { en: "Calling it too many times", np: "यसलाई धेरै पटक बोलाउँदा", jp: "呼びすぎたから" },
            { en: "Declaring it with `function` instead of an arrow", np: "Arrow होइन `function` ले घोषणा गर्दा", jp: "アローではなく `function` で宣言したから" },
          ],
          correctIndex: 0,
          explanation: { en: "Nothing about the function changed; what it was fed did.", np: "Function मा केही बदलिएन; यसलाई दिइएको कुरा बदलियो।", jp: "関数は変わっていない。与えられたものが変わった。" },
        },
      ],
      youtubeIds: ["p-iiEDtpy6I"],
    },
    {
      id: "hidden-classes",
      title: { en: "Hidden classes and inline caches", np: "Hidden class र inline cache", jp: "隠しクラスとインラインキャッシュ" },
      durationMinutes: 8,
      explanation: {
        en: "JavaScript objects are dynamic — you can add a property whenever you like. V8 still optimises property access, by tracking each object's <b>hidden class</b>: an internal record of its shape, meaning which properties it has and in what order they were added.\n\n---\n\n### 1. Basic — same constructor, same shape\n\n```javascript\nfunction User(name, email, role) {\n  this.name = name;\n  this.email = email;\n  this.role = role;\n}\n\nconst a = new User(\"Alice\", \"a@test.com\", \"admin\");\nconst b = new User(\"Bob\", \"b@test.com\", \"user\");\n```\n\nBoth objects were built the same way in the same order, so they share a hidden class. V8 knows where `name` lives without searching for it.\n\n---\n\n### 2. Intermediate — order matters\n\n```javascript\nconst one = {};\none.name = \"Alice\";\none.age = 30;\n\nconst two = {};\ntwo.age = 30;\ntwo.name = \"Bob\";\n```\n\nBoth end up with `{ name, age }`, but they arrived through different <i>transitions</i> — the chain of shapes an object passes through as properties are added. So they do not share a hidden class.\n\n---\n\n### 3. Advanced — inline caches\n\nShapes matter because of <b>inline caches</b>. Consider a call site — a specific place in the code where an operation happens:\n\n```javascript\nfunction getName(user) {\n  return user.name;\n}\n```\n\nIf every object reaching that line has the same shape, the site stays <b>monomorphic</b> (one shape) and the lookup collapses to a fixed memory offset. Feed it several shapes:\n\n```javascript\ngetName({ name: \"Alice\" });\ngetName({ name: \"Bob\", age: 30 });\ngetName({ name: \"Charlie\", email: \"c@x\" });\n```\n\nand it becomes <b>polymorphic</b> (several shapes), so the engine must check which one it got before reading.\n\n---\n\n### The practical lesson\n\nThis is narrower than it sounds:\n\n> <b>Prefer predictable object construction in hot code paths. Do not contort ordinary application code for an optimisation you have not measured.</b>\n\nBuilding objects consistently is good style anyway. Rewriting readable code to chase hypothetical hidden-class behaviour is not.",
        np: "JavaScript object गतिशील छन् — तपाईंले जुनसुकै बेला property थप्न सक्नुहुन्छ। V8 ले तैपनि हरेक object को <b>hidden class</b> पछ्याएर property पहुँच optimize गर्छ: यसको आकारको भित्री अभिलेख, अर्थात् कुन property छन् र कुन क्रममा थपिए।\n\n---\n\n### 1. आधारभूत — उही constructor, उही आकार\n\n```javascript\nfunction User(name, email, role) {\n  this.name = name;\n  this.email = email;\n  this.role = role;\n}\n\nconst a = new User(\"Alice\", \"a@test.com\", \"admin\");\nconst b = new User(\"Bob\", \"b@test.com\", \"user\");\n```\n\nदुबै object उही तरिकाले उही क्रममा बने, त्यसैले तिनले hidden class बाँड्छन्। V8 ले नखोजी `name` कहाँ छ थाहा पाउँछ।\n\n---\n\n### 2. मध्यम — क्रमले फरक पार्छ\n\n```javascript\nconst one = {};\none.name = \"Alice\";\none.age = 30;\n\nconst two = {};\ntwo.age = 30;\ntwo.name = \"Bob\";\n```\n\nदुबै `{ name, age }` मा पुग्छन्, तर फरक <i>transition</i> — property थपिँदै जाँदा object ले पार गर्ने आकारको शृंखला — हुँदै आए। त्यसैले तिनले hidden class बाँड्दैनन्।\n\n---\n\n### 3. उन्नत — inline cache\n\nआकार महत्वपूर्ण हुनुको कारण <b>inline cache</b> हो। Call site — code मा operation हुने निश्चित ठाउँ — विचार गर्नुहोस्:\n\n```javascript\nfunction getName(user) {\n  return user.name;\n}\n```\n\nत्यो line मा पुग्ने हरेक object को उही आकार छ भने, site <b>monomorphic</b> (एउटै आकार) रहन्छ र lookup निश्चित memory offset मा खुम्चिन्छ। धेरै आकार दिनुहोस्:\n\n```javascript\ngetName({ name: \"Alice\" });\ngetName({ name: \"Bob\", age: 30 });\ngetName({ name: \"Charlie\", email: \"c@x\" });\n```\n\nअनि यो <b>polymorphic</b> (धेरै आकार) बन्छ, त्यसैले engine ले पढ्नुअघि कुन आयो जाँच्नुपर्छ।\n\n---\n\n### व्यावहारिक पाठ\n\nयो सुनिएभन्दा साँघुरो छ:\n\n> <b>Hot code path मा पूर्वानुमानयोग्य object निर्माण रोज्नुहोस्। नमापेको optimisation का लागि सामान्य application code नबिगार्नुहोस्।</b>\n\nObject एकनास बनाउनु जसै पनि राम्रो शैली हो। काल्पनिक hidden-class व्यवहार पछ्याउन पठनीय code पुनर्लेखन गर्नु होइन।",
        jp: "JavaScriptのオブジェクトは動的で、いつでもプロパティを足せる。それでもV8は各オブジェクトの<b>隠しクラス</b>、つまりどのプロパティをどの順で持つかという形の内部記録を追い、プロパティ参照を最適化する。\n\n---\n\n### 1. 基本 — 同じコンストラクタ、同じ形\n\n```javascript\nfunction User(name, email, role) {\n  this.name = name;\n  this.email = email;\n  this.role = role;\n}\n\nconst a = new User(\"Alice\", \"a@test.com\", \"admin\");\nconst b = new User(\"Bob\", \"b@test.com\", \"user\");\n```\n\n同じ手順・同じ順で作られたので、2つは隠しクラスを共有する。V8は探索せずに `name` の位置を知る。\n\n---\n\n### 2. 中級 — 順序が効く\n\n```javascript\nconst one = {};\none.name = \"Alice\";\none.age = 30;\n\nconst two = {};\ntwo.age = 30;\ntwo.name = \"Bob\";\n```\n\nどちらも `{ name, age }` に落ち着くが、通ってきた<i>遷移</i>、つまりプロパティ追加に伴って辿る形の連なりが違う。だから隠しクラスは共有されない。\n\n---\n\n### 3. 上級 — インラインキャッシュ\n\n形が効くのは<b>インラインキャッシュ</b>のためだ。呼び出し地点、つまりコード中で操作が起きる特定の場所を考える:\n\n```javascript\nfunction getName(user) {\n  return user.name;\n}\n```\n\nその行に届くオブジェクトの形が常に同じなら、その地点は<b>単形</b>（1つの形）のままで、参照は固定のメモリオフセットに畳まれる。複数の形を与えると:\n\n```javascript\ngetName({ name: \"Alice\" });\ngetName({ name: \"Bob\", age: 30 });\ngetName({ name: \"Charlie\", email: \"c@x\" });\n```\n\n<b>多形</b>（複数の形）になり、エンジンは読む前にどれが来たかを確かめねばならない。\n\n---\n\n### 実務上の教訓\n\n聞こえるより狭い話だ:\n\n> <b>ホットパスでは予測しやすいオブジェクト生成を選ぶ。測っていない最適化のために普通のコードを歪めない。</b>\n\n一貫した生成はそもそも良い書き方だ。仮説上の隠しクラスの挙動を追って読めるコードを書き換えるのは、そうではない。",
      },
      diagram: `Same end state, different shapes

const one = {}          const two = {}
one.name = "Alice"      two.age = 30
one.age = 30            two.name = "Bob"

  {} → {name} → {name, age}     {} → {age} → {age, name}
        different transitions, so different hidden classes


A call site starts fast and degrades

function getName(user) { return user.name; }
                             │
             ┌───────────────┴───────────────┐
             ▼                               ▼
       one shape only                  several shapes
             │                               │
        monomorphic                    polymorphic
             │                               │
    read at a fixed offset       check which shape first


Where this actually matters

hot path, millions of calls   →   worth keeping shapes stable
ordinary application code     →   write it readably and move on`,
      codeExample: {
        title: { en: "Shapes, call sites and what they cost", np: "आकार, call site र तिनको लागत", jp: "形・呼び出し地点・その代償" },
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
      keyTakeaways: [
        { en: "V8 tracks each object's <b>hidden class</b> — an internal record of its shape.", np: "V8 ले हरेक object को <b>hidden class</b> पछ्याउँछ — यसको आकारको भित्री अभिलेख।", jp: "V8は各オブジェクトの<b>隠しクラス</b>、つまり形の内部記録を追う。" },
        { en: "Objects built the same way in the <b>same order</b> share a shape.", np: "उही तरिकाले <b>उही क्रम</b> मा बनेका object ले आकार बाँड्छन्।", jp: "同じ手順・<b>同じ順</b>で作られたオブジェクトは形を共有する。" },
        { en: "The same final properties in a <b>different order</b> produce a different hidden class.", np: "<b>फरक क्रम</b> मा उही अन्तिम property ले फरक hidden class बनाउँछ।", jp: "最終的なプロパティが同じでも<b>順序が違えば</b>別の隠しクラスになる。" },
        { en: "A call site seeing one shape stays <b>monomorphic</b> and reads at a fixed offset.", np: "एउटै आकार देख्ने call site <b>monomorphic</b> रहन्छ र निश्चित offset मा पढ्छ।", jp: "1つの形しか見ない呼び出し地点は<b>単形</b>のままで、固定オフセットから読む。" },
        { en: "Several shapes make it <b>polymorphic</b>, so the engine must check before reading.", np: "धेरै आकारले यसलाई <b>polymorphic</b> बनाउँछ, त्यसैले engine ले पढ्नुअघि जाँच्नुपर्छ।", jp: "形が増えると<b>多形</b>になり、読む前に確認が要る。" },
        { en: "This matters in <b>hot paths only</b> — do not reshape readable code for an unmeasured gain.", np: "यो <b>hot path मा मात्र</b> महत्वपूर्ण छ — नमापेको फाइदाका लागि पठनीय code नबदल्नुहोस्।", jp: "効くのは<b>ホットパスだけ</b>。測っていない利得のために読めるコードを崩さない。" },
      ],
      commonMistakes: [
        { en: "<b>Believing every object must have an identical shape</b> — it only pays in hot paths, and ordinary code should stay readable.", np: "<b>हरेक object को आकार उस्तै हुनुपर्छ भन्ने विश्वास</b> — यो hot path मा मात्र फाइदाजनक छ, र सामान्य code पठनीय रहनुपर्छ।", jp: "<b>すべてのオブジェクトが同一の形であるべきと思う</b> — 効くのはホットパスだけで、普通のコードは読みやすさを保つ。" },
        { en: "<b>Adding properties conditionally in a hot constructor</b> — each branch creates a different shape, which is what turns a call site polymorphic.", np: "<b>Hot constructor मा सर्तअनुसार property थप्नु</b> — हरेक शाखाले फरक आकार बनाउँछ, जसले call site polymorphic बनाउँछ।", jp: "<b>ホットなコンストラクタで条件付きにプロパティを足す</b> — 分岐ごとに別の形ができ、呼び出し地点が多形になる。" },
        { en: "<b>Optimising shapes before profiling</b> — you will usually find the real cost is a database call, not a property lookup.", np: "<b>Profile नगरी आकार optimize गर्नु</b> — वास्तविक लागत property lookup होइन, database call भेट्टाउनुहुनेछ।", jp: "<b>プロファイル前に形を最適化する</b> — 本当の費用はプロパティ参照ではなくDB呼び出しであることがほとんど。" },
      ],
      quiz: [
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
          question: { en: "Do `{}` then `.name` then `.age`, and `{}` then `.age` then `.name`, share a hidden class?", np: "`{}` अनि `.name` अनि `.age`, र `{}` अनि `.age` अनि `.name` ले hidden class बाँड्छन्?", jp: "`{}` の後 `.name`・`.age` と、`{}` の後 `.age`・`.name` は隠しクラスを共有するか?" },
          options: [
            { en: "Yes, the final properties are the same", np: "हो, अन्तिम property उही छन्", jp: "はい、最終的なプロパティは同じ" },
            { en: "Only if both are frozen", np: "दुबै frozen भएमा मात्र", jp: "両方が凍結されている場合のみ" },
            { en: "No, they arrived through different transitions", np: "होइन, ती फरक transition हुँदै आए", jp: "いいえ、通ってきた遷移が違う" },
          ],
          correctIndex: 2,
          explanation: { en: "The order in which properties are added is part of the shape.", np: "Property कुन क्रममा थपिए त्यो आकारको भाग हो।", jp: "プロパティを足した順序も形の一部。" },
        },
        {
          question: { en: "What makes a call site polymorphic?", np: "Call site लाई polymorphic केले बनाउँछ?", jp: "呼び出し地点が多形になる原因は?" },
          options: [
            { en: "Being called more than 100 times", np: "100 भन्दा बढी पटक बोलाइनु", jp: "100回を超えて呼ばれること" },
            { en: "Receiving objects of several different shapes", np: "धेरै फरक आकारका object पाउनु", jp: "複数の異なる形のオブジェクトを受け取ること" },
            { en: "Returning more than one type", np: "एकभन्दा बढी type फर्काउनु", jp: "複数の型を返すこと" },
          ],
          correctIndex: 1,
          explanation: { en: "The engine must then check which shape it got before reading.", np: "अनि engine ले पढ्नुअघि कुन आकार आयो जाँच्नुपर्छ।", jp: "エンジンは読む前にどの形かを確かめねばならない。" },
        },
        {
          question: { en: "What is the correct practical takeaway about hidden classes?", np: "Hidden class बारे सही व्यावहारिक निष्कर्ष के हो?", jp: "隠しクラスについての実務的な結論は?" },
          options: [
            { en: "Rewrite all code so every object has the same shape", np: "हरेक object को आकार उही हुने गरी सबै code पुनर्लेखन गर्नुहोस्", jp: "すべてのオブジェクトが同じ形になるよう全コードを書き直す" },
            { en: "Hidden classes can be disabled with a flag", np: "Hidden class flag ले निष्क्रिय पार्न सकिन्छ", jp: "フラグで隠しクラスを無効にできる" },
            { en: "Keep construction predictable in hot paths, and leave ordinary code readable", np: "Hot path मा निर्माण पूर्वानुमानयोग्य राख्नुहोस्, र सामान्य code पठनीय छाड्नुहोस्", jp: "ホットパスでは生成を予測しやすく保ち、普通のコードは読みやすいままにする" },
          ],
          correctIndex: 2,
          explanation: { en: "Consistent construction is good style anyway; contorting readable code is not.", np: "एकनास निर्माण जसै पनि राम्रो शैली हो; पठनीय code बिगार्नु होइन।", jp: "一貫した生成はもともと良い書き方。読めるコードを歪めるのは違う。" },
        },
      ],
    },
    {
      id: "garbage-collection",
      title: { en: "Garbage collection and allocation pressure", np: "Garbage collection र allocation चाप", jp: "ガベージコレクションと確保の圧力" },
      durationMinutes: 8,
      explanation: {
        en: "JavaScript manages memory for you. When an object can no longer be reached by running code, the <b>garbage collector</b> can reclaim it. You never free anything by hand.\n\nV8's collector is <b>generational</b>, built on one observation: most objects die young.\n\n```text\nNew objects\n    ↓\nYoung Generation      collected often, cheaply\n    ↓\nObject survives\n    ↓\nOld Generation        collected rarely, expensively\n```\n\n---\n\n### 1. Basic — short-lived objects are fine\n\n```javascript\nfunction calculate() {\n  return { value: Math.random() };\n}\n\ncalculate();\ncalculate();\n```\n\nEach call allocates an object that becomes unreachable almost immediately. That is not a problem — it is exactly the pattern the young generation is designed for, and collecting there is cheap.\n\n---\n\n### 2. Intermediate — when allocation becomes pressure\n\n```javascript\nfunction processItems(items) {\n  for (const item of items) {\n    const result = { id: item.id, value: item.value * 2 };\n    sendToAPI(result);\n  }\n}\n```\n\nOne object per iteration is fine at a thousand iterations. At ten million, inside a hot path, the allocations and the collector work they cause start to matter. Note the wording: they <b>start to matter</b>, which is a reason to measure, not a reason to rewrite.\n\nFor large numeric datasets, a <b>typed array</b> avoids per-element objects entirely by storing raw numbers in one contiguous block:\n\n```javascript\nconst scores = new Float64Array(1000);\n\nfor (let i = 0; i < scores.length; i++) {\n  scores[i] = Math.random();\n}\n```\n\nThe family includes `Int8Array`, `Int32Array`, `Uint8Array`, `Float32Array` and `Float64Array`.\n\n---\n\n### 3. Advanced — resist object pooling\n\nYou will find advice saying to reuse objects rather than allocate new ones. Treat it with suspicion:\n\n```javascript\n// \"Reuse objects to avoid allocations\"\n```\n\nPooling complicates the code, keeps objects alive that would otherwise be collected cheaply, and on a modern engine frequently makes things <b>slower</b>. The young generation is already very good at exactly this.\n\n> <b>Measure the allocation and collector behaviour before introducing pooling.</b> If a heap snapshot does not show the pressure, the pool is complexity with no payoff.",
        np: "JavaScript ले तपाईंका लागि memory व्यवस्थापन गर्छ। चलिरहेको code ले object सम्म पुग्न नसक्ने भएपछि, <b>garbage collector</b> ले यसलाई फिर्ता लिन सक्छ। तपाईंले हातले केही मुक्त गर्नुपर्दैन।\n\nV8 को collector <b>generational</b> छ, एउटै अवलोकनमा बनेको: धेरैजसो object छिट्टै मर्छन्।\n\n```text\nनयाँ object\n    ↓\nYoung Generation      बारम्बार, सस्तोमा संकलन\n    ↓\nObject बाँच्यो\n    ↓\nOld Generation        विरलै, महँगोमा संकलन\n```\n\n---\n\n### 1. आधारभूत — छोटो आयुका object ठीकै छन्\n\n```javascript\nfunction calculate() {\n  return { value: Math.random() };\n}\n\ncalculate();\ncalculate();\n```\n\nहरेक call ले लगभग तुरुन्तै पुग्न नसकिने object बनाउँछ। यो समस्या होइन — young generation ठ्याक्कै यही ढाँचाका लागि बनेको हो, र त्यहाँ संकलन सस्तो छ।\n\n---\n\n### 2. मध्यम — allocation कहिले चाप बन्छ\n\n```javascript\nfunction processItems(items) {\n  for (const item of items) {\n    const result = { id: item.id, value: item.value * 2 };\n    sendToAPI(result);\n  }\n}\n```\n\nप्रति iteration एउटा object हजार iteration मा ठीकै छ। एक करोडमा, hot path भित्र, allocation र तिनले ल्याउने collector को काम महत्वपूर्ण हुन थाल्छ। शब्द ख्याल गर्नुहोस्: <b>हुन थाल्छ</b>, जुन माप्ने कारण हो, पुनर्लेखनको होइन।\n\nठूलो संख्यात्मक dataset का लागि, <b>typed array</b> ले कच्चा संख्या एउटै लगातार block मा राखेर प्रति-element object पूरै हटाउँछ:\n\n```javascript\nconst scores = new Float64Array(1000);\n\nfor (let i = 0; i < scores.length; i++) {\n  scores[i] = Math.random();\n}\n```\n\nपरिवारमा `Int8Array`, `Int32Array`, `Uint8Array`, `Float32Array` र `Float64Array` पर्छन्।\n\n---\n\n### 3. उन्नत — object pooling बाट जोगिनुहोस्\n\nनयाँ बनाउनुको सट्टा object पुनःप्रयोग गर्ने सल्लाह भेट्नुहुनेछ। शंकाका साथ लिनुहोस्:\n\n```javascript\n// \"Allocation जोगाउन object पुनःप्रयोग गर्नुहोस्\"\n```\n\nPooling ले code जटिल बनाउँछ, नत्र सस्तोमा संकलन हुने object जीवित राख्छ, र आधुनिक engine मा प्रायः झन् <b>ढिलो</b> पार्छ। Young generation ठ्याक्कै यसैमा पहिले नै धेरै राम्रो छ।\n\n> <b>Pooling ल्याउनुअघि allocation र collector को व्यवहार माप्नुहोस्।</b> Heap snapshot ले चाप देखाउँदैन भने, pool फाइदाबिनाको जटिलता हो।",
        jp: "JavaScriptはメモリを自動で管理する。実行中のコードから到達できなくなれば、<b>ガベージコレクタ</b>が回収できる。手で解放することはない。\n\nV8のコレクタは<b>世代別</b>で、ひとつの観察に基づく。多くのオブジェクトは若くして死ぬ。\n\n```text\n新しいオブジェクト\n    ↓\n若い世代          頻繁に、安く回収\n    ↓\n生き延びた\n    ↓\n古い世代          稀に、高くつく回収\n```\n\n---\n\n### 1. 基本 — 短命なオブジェクトは問題ない\n\n```javascript\nfunction calculate() {\n  return { value: Math.random() };\n}\n\ncalculate();\ncalculate();\n```\n\n各呼び出しがほぼ即座に到達不能になるオブジェクトを作る。これは問題ではない。若い世代はまさにこの形のために設計されており、そこでの回収は安い。\n\n---\n\n### 2. 中級 — 確保が圧力になるとき\n\n```javascript\nfunction processItems(items) {\n  for (const item of items) {\n    const result = { id: item.id, value: item.value * 2 };\n    sendToAPI(result);\n  }\n}\n```\n\n反復ごとに1つは、1000回なら問題ない。1000万回、しかもホットパスの中なら、確保とそれが招く回収の作業が効いてくる。言い方に注意。<b>効いてくる</b>のであって、書き直す理由ではなく測る理由だ。\n\n大きな数値データには、<b>型付き配列</b>が生の数値を連続した1ブロックに置き、要素ごとのオブジェクトを丸ごと不要にする:\n\n```javascript\nconst scores = new Float64Array(1000);\n\nfor (let i = 0; i < scores.length; i++) {\n  scores[i] = Math.random();\n}\n```\n\n仲間には `Int8Array`・`Int32Array`・`Uint8Array`・`Float32Array`・`Float64Array` がある。\n\n---\n\n### 3. 上級 — オブジェクトプールに飛びつかない\n\n新しく作らず再利用せよ、という助言を見かける。疑ってかかること:\n\n```javascript\n// 「確保を避けるためにオブジェクトを再利用する」\n```\n\nプールはコードを複雑にし、本来安く回収されるはずのオブジェクトを生かし続け、現代のエンジンではしばしば<b>遅く</b>なる。若い世代はまさにこの用途にすでに長けている。\n\n> <b>プールを導入する前に、確保とコレクタの挙動を測ること。</b>ヒープスナップショットに圧力が出ていないなら、そのプールは見返りのない複雑さだ。",
      },
      diagram: `Generational collection, built on one observation

New objects
    ↓
Young Generation      most die here, collected often and cheaply
    ↓
Object survives
    ↓
Old Generation        collected rarely, and expensively


A per-iteration object: when to care

1,000 iterations        fine, ignore it
10,000,000 in a
hot path                measure it
heap snapshot shows
allocation pressure     now change something


Objects versus a typed array

[{v:1}, {v:2}, {v:3}]        Float64Array(3)
   │                              │
   ▼                              ▼
three objects,               one contiguous block
each with a header           of raw numbers


Advice worth ignoring by default

"reuse objects to avoid allocations"
        │
        ▼
 complicates the code
 keeps objects alive past the cheap collection
 often slower on a modern engine`,
      codeExample: {
        title: { en: "Allocation, typed arrays and measuring first", np: "Allocation, typed array र पहिले माप्नु", jp: "確保・型付き配列・まず測る" },
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
      keyTakeaways: [
        { en: "V8's collector is <b>generational</b>: most objects die young, so collection there is cheap.", np: "V8 को collector <b>generational</b> छ: धेरैजसो object छिट्टै मर्छन्, त्यसैले त्यहाँ संकलन सस्तो छ।", jp: "V8のコレクタは<b>世代別</b>。多くは若くして死ぬので、そこでの回収は安い。" },
        { en: "Objects that survive are promoted to the <b>old generation</b>, collected rarely and expensively.", np: "बाँचेका object <b>old generation</b> मा बढुवा हुन्छन्, विरलै र महँगोमा संकलन हुने।", jp: "生き延びたものは<b>古い世代</b>へ昇格し、回収は稀で高くつく。" },
        { en: "A short-lived temporary object is <b>not a problem</b> — it is what the young generation is for.", np: "छोटो आयुको अस्थायी object <b>समस्या होइन</b> — young generation यसैका लागि हो।", jp: "短命な一時オブジェクトは<b>問題ではない</b>。若い世代はそのためにある。" },
        { en: "Allocation becomes <b>pressure</b> only at scale, inside a hot path — a reason to measure.", np: "Allocation ठूलो मात्रामा, hot path भित्र मात्र <b>चाप</b> बन्छ — माप्ने कारण।", jp: "確保が<b>圧力</b>になるのは規模とホットパスの中だけ。測る理由になる。" },
        { en: "A <b>typed array</b> such as `Float64Array` stores raw numbers contiguously, with no per-element object.", np: "`Float64Array` जस्तो <b>typed array</b> ले कच्चा संख्या लगातार राख्छ, प्रति-element object बिना।", jp: "`Float64Array` のような<b>型付き配列</b>は生の数値を連続して置き、要素ごとのオブジェクトを持たない。" },
        { en: "<b>Object pooling is poor default advice</b> — measure first; it often makes modern engines slower.", np: "<b>Object pooling राम्रो पूर्वनिर्धारित सल्लाह होइन</b> — पहिले माप्नुहोस्; यसले आधुनिक engine प्रायः ढिलो पार्छ।", jp: "<b>オブジェクトプールは既定の助言として不適</b>。まず測る。現代のエンジンではむしろ遅くなることが多い。" },
      ],
      commonMistakes: [
        { en: "<b>Treating every allocation as a cost</b> — modern engines handle short-lived objects extremely well; the young generation exists for exactly this.", np: "<b>हरेक allocation लाई लागत ठान्नु</b> — आधुनिक engine ले छोटो आयुका object धेरै राम्रोसँग सम्हाल्छन्; young generation ठ्याक्कै यसैका लागि छ।", jp: "<b>あらゆる確保を費用とみなす</b> — 現代のエンジンは短命なオブジェクトが得意で、若い世代はまさにそのためにある。" },
        { en: "<b>Introducing an object pool on instinct</b> — it adds complexity, keeps objects alive longer, and frequently runs slower than allocating.", np: "<b>बानीले object pool ल्याउनु</b> — यसले जटिलता थप्छ, object लामो समय जीवित राख्छ, र प्रायः allocate गर्नुभन्दा ढिलो चल्छ।", jp: "<b>反射でオブジェクトプールを導入する</b> — 複雑さが増し、オブジェクトを長く生かし、確保よりも遅くなることが多い。" },
        { en: "<b>Reaching for a typed array for a small list</b> — the benefit is for large numeric datasets, not for twenty values.", np: "<b>सानो list मा typed array प्रयोग गर्नु</b> — फाइदा ठूलो संख्यात्मक dataset मा हो, बीसवटा मानमा होइन।", jp: "<b>小さなリストに型付き配列を持ち出す</b> — 利点は大きな数値データにあり、20件には関係ない。" },
        { en: "<b>Assuming GC runs the moment an object becomes unreachable</b> — it becomes <b>eligible</b>; the engine decides when to actually reclaim it.", np: "<b>Object पुग्न नसकिने हुनासाथ GC चल्छ भन्ने ठान्नु</b> — यो <b>योग्य</b> बन्छ; कहिले साँच्चै फिर्ता लिने engine ले तय गर्छ।", jp: "<b>到達不能になった瞬間にGCが走ると思う</b> — <b>対象になる</b>だけで、実際に回収する時期はエンジンが決める。" },
      ],
      quiz: [
        {
          question: { en: "Which generation do most new objects die in?", np: "धेरैजसो नयाँ object कुन generation मा मर्छन्?", jp: "多くの新しいオブジェクトが死ぬのはどの世代か?" },
          options: [
            { en: "The young generation", np: "Young generation", jp: "若い世代" },
            { en: "The old generation", np: "Old generation", jp: "古い世代" },
            { en: "Neither, objects are freed manually", np: "कुनै पनि होइन, हातले मुक्त गरिन्छ", jp: "どちらでもない。手動で解放する" },
          ],
          correctIndex: 0,
          explanation: { en: "Generational collection is built on exactly that observation.", np: "Generational संकलन ठ्याक्कै यही अवलोकनमा बनेको छ।", jp: "世代別回収はまさにその観察の上に成り立つ。" },
        },
        {
          question: { en: "Is a function that returns a fresh object on every call a performance problem?", np: "हरेक call मा नयाँ object फर्काउने function performance समस्या हो?", jp: "呼び出しごとに新しいオブジェクトを返す関数は性能問題か?" },
          options: [
            { en: "Yes, always avoid allocation", np: "हो, allocation सधैं जोगाउनुहोस्", jp: "はい、確保は常に避ける" },
            { en: "Only in Node, not the browser", np: "Node मा मात्र, browser मा होइन", jp: "Nodeだけ。ブラウザでは違う" },
            { en: "Not by itself — that is exactly what the young generation handles cheaply", np: "आफैंमा होइन — young generation ले ठ्याक्कै यही सस्तोमा सम्हाल्छ", jp: "それ自体は違う。若い世代がまさにそれを安く扱う" },
          ],
          correctIndex: 2,
          explanation: { en: "It becomes worth measuring at scale inside a hot path, not before.", np: "Hot path भित्र ठूलो मात्रामा माप्न लायक बन्छ, त्यसअघि होइन।", jp: "測る価値が出るのはホットパスで規模が出たときで、それ以前ではない。" },
        },
        {
          question: { en: "When is a typed array such as `Float64Array` worth using?", np: "`Float64Array` जस्तो typed array कहिले प्रयोग गर्न लायक छ?", jp: "`Float64Array` のような型付き配列が有効なのはいつか?" },
          options: [
            { en: "For any array of more than ten items", np: "दस भन्दा बढी item भएको जुनसुकै array", jp: "10件を超える配列すべて" },
            { en: "For large numeric datasets, where it avoids per-element objects", np: "ठूलो संख्यात्मक dataset मा, जहाँ प्रति-element object हट्छ", jp: "大きな数値データで、要素ごとのオブジェクトを避けたいとき" },
            { en: "Whenever the array should be immutable", np: "Array अपरिवर्तनीय चाहिँदा", jp: "配列を不変にしたいとき" },
          ],
          correctIndex: 1,
          explanation: { en: "It stores raw numbers in one contiguous block instead of boxed values.", np: "यसले box गरिएका मानको सट्टा कच्चा संख्या एउटै लगातार block मा राख्छ।", jp: "ボックス化された値ではなく、生の数値を連続した1ブロックに置く。" },
        },
        {
          question: { en: "Why is object pooling poor default advice?", np: "Object pooling किन राम्रो पूर्वनिर्धारित सल्लाह होइन?", jp: "オブジェクトプールが既定の助言として不適なのはなぜか?" },
          options: [
            { en: "It complicates the code and often runs slower on modern engines", np: "यसले code जटिल बनाउँछ र आधुनिक engine मा प्रायः ढिलो चल्छ", jp: "コードを複雑にし、現代のエンジンではむしろ遅くなることが多いから" },
            { en: "It is not supported outside Node", np: "Node बाहिर समर्थित छैन", jp: "Node以外では使えないから" },
            { en: "It prevents garbage collection entirely", np: "यसले garbage collection पूरै रोक्छ", jp: "GCを完全に止めてしまうから" },
          ],
          correctIndex: 0,
          explanation: { en: "It also keeps objects alive that the young generation would have collected cheaply.", np: "यसले young generation ले सस्तोमा संकलन गर्ने object पनि जीवित राख्छ।", jp: "若い世代が安く回収したはずのオブジェクトを生かし続けもする。" },
        },
        {
          question: { en: "What does making an object unreachable actually guarantee?", np: "Object लाई पुग्न नसकिने बनाउँदा वास्तवमा केको ग्यारेन्टी हुन्छ?", jp: "オブジェクトを到達不能にすると、実際に何が保証されるか?" },
          options: [
            { en: "The memory is freed immediately", np: "Memory तुरुन्तै मुक्त हुन्छ", jp: "メモリが即座に解放される" },
            { en: "It becomes eligible for collection; the engine decides when", np: "यो संकलनयोग्य बन्छ; कहिले भन्ने engine ले तय गर्छ", jp: "回収の対象になるだけで、時期はエンジンが決める" },
            { en: "Nothing, unreachable objects are never collected", np: "केही होइन, पुग्न नसकिने object कहिल्यै संकलन हुँदैनन्", jp: "何も。到達不能なオブジェクトは回収されない" },
          ],
          correctIndex: 1,
          explanation: { en: "Collection timing is not something your code can observe or rely on.", np: "Collection कहिले हुन्छ भन्ने तपाईंको code ले देख्न वा भर पर्न सक्दैन।", jp: "回収の時期はコードから観測も依存もできない。" },
        },
      ],
    },
    {
      id: "profiling",
      title: { en: "Profiling — measure before you optimize", np: "Profiling — optimize गर्नुअघि माप्नुहोस्", jp: "プロファイリング — 最適化の前に測る" },
      durationMinutes: 9,
      explanation: {
        en: "Never optimise on intuition. The whole discipline reduces to one habit: <b>find out where the time actually goes before changing anything</b>.\n\n---\n\n### 1. Basic — timing a block\n\n```javascript\nconst start = performance.now();\n\ndoExpensiveWork();\n\nconsole.log(`Took ${(performance.now() - start).toFixed(2)}ms`);\n```\n\n`performance.now()` gives high-resolution elapsed time. For a quick bracket, `console.time()` is less typing:\n\n```javascript\nconsole.time(\"database-query\");\nawait db.query(\"SELECT * FROM users\");\nconsole.timeEnd(\"database-query\");   // database-query: 42.31ms\n```\n\n---\n\n### 2. Intermediate — naming spans\n\nFor anything bigger, name the measurement so you can compare across runs:\n\n```javascript\nperformance.mark(\"fetchStart\");\nawait fetchUser(42);\nperformance.mark(\"fetchEnd\");\n\nperformance.measure(\"fetchUser\", \"fetchStart\", \"fetchEnd\");\n\nconst [entry] = performance.getEntriesByName(\"fetchUser\");\nconsole.log(entry.duration);\n```\n\nIn the browser, a DevTools performance recording shows <b>long tasks</b> — anything blocking the main thread beyond roughly <b>50 ms</b>, past which input and rendering visibly stall. In Node, `node --prof`, the inspector, heap snapshots and `process.memoryUsage()` cover the same ground:\n\n```text\nrss         total memory held by the process\nheapUsed    JavaScript heap currently in use\nheapTotal   JavaScript heap V8 has allocated\nexternal    memory tied to native resources\n```\n\n---\n\n### 3. Advanced — optimise what the profile shows\n\nAn endpoint takes 500 ms. Before rewriting a loop that \"looks slow\", measure:\n\n```text\nDatabase query        380ms\nExternal API           90ms\nJavaScript processing  20ms\nJSON serialization     10ms\n------------------------------\nTotal                 500ms\n```\n\nMaking the JavaScript four times faster saves 15 ms. Halving the database query saves 190 ms. The loop was never the problem.\n\n```text\n\"This code looks inefficient\"   →  where is the bottleneck?\n\"I should optimize this loop\"   →  what does the profiler show?\n\"This should be faster\"         →  I measured it before and after\n```\n\n---\n\n### Keeping context across an `await`\n\nOne Node tool worth knowing while you are here. `AsyncLocalStorage` keeps a value available across asynchronous boundaries, so a request id survives every `await` without being passed through each function:\n\n```javascript\nimport { AsyncLocalStorage } from \"node:async_hooks\";\n\nconst storage = new AsyncLocalStorage();\n\nfunction log(message) {\n  const context = storage.getStore();\n  console.log(`[request:${context?.requestId}] ${message}`);\n}\n\nstorage.run({ requestId: \"req-123\" }, async () => {\n  log(\"Request started\");\n  await new Promise(resolve => setTimeout(resolve, 100));\n  log(\"Request finished\");   // the request id is still here\n});\n```\n\nThis is how request ids, tracing and logging context propagate in real backends.",
        np: "कहिल्यै अनुमानमा optimize नगर्नुहोस्। पूरै अनुशासन एउटै बानीमा खुम्चिन्छ: <b>केही बदल्नुअघि समय वास्तवमा कहाँ जान्छ पत्ता लगाउनुहोस्</b>।\n\n---\n\n### 1. आधारभूत — खण्डको समय\n\n```javascript\nconst start = performance.now();\n\ndoExpensiveWork();\n\nconsole.log(`Took ${(performance.now() - start).toFixed(2)}ms`);\n```\n\n`performance.now()` ले उच्च-रिजोल्युसन बितेको समय दिन्छ। छिटो घेर्न, `console.time()` कम टाइप गर्नुपर्ने हुन्छ:\n\n```javascript\nconsole.time(\"database-query\");\nawait db.query(\"SELECT * FROM users\");\nconsole.timeEnd(\"database-query\");   // database-query: 42.31ms\n```\n\n---\n\n### 2. मध्यम — अवधिलाई नाम दिनु\n\nठूलो कुरामा, मापनलाई नाम दिनुहोस् ताकि run बीच तुलना गर्न सकियोस्:\n\n```javascript\nperformance.mark(\"fetchStart\");\nawait fetchUser(42);\nperformance.mark(\"fetchEnd\");\n\nperformance.measure(\"fetchUser\", \"fetchStart\", \"fetchEnd\");\n\nconst [entry] = performance.getEntriesByName(\"fetchUser\");\nconsole.log(entry.duration);\n```\n\nBrowser मा, DevTools को performance recording ले <b>long task</b> देखाउँछ — मुख्य thread लाई करिब <b>50 ms</b> भन्दा बढी रोक्ने जुनसुकै, जसपछि input र rendering देखिने गरी अड्किन्छ। Node मा `node --prof`, inspector, heap snapshot र `process.memoryUsage()` ले उही काम गर्छन्:\n\n```text\nrss         process ले ओगटेको कुल memory\nheapUsed    अहिले प्रयोगमा रहेको JavaScript heap\nheapTotal   V8 ले छुट्याएको JavaScript heap\nexternal    native संसाधनसँग जोडिएको memory\n```\n\n---\n\n### 3. उन्नत — profile ले देखाएको optimize गर्नुहोस्\n\nEndpoint ले 500 ms लिन्छ। \"ढिलो देखिने\" loop पुनर्लेखन गर्नुअघि, माप्नुहोस्:\n\n```text\nDatabase query        380ms\nExternal API           90ms\nJavaScript processing  20ms\nJSON serialization     10ms\n------------------------------\nजम्मा                 500ms\n```\n\nJavaScript चार गुणा छिटो बनाउँदा 15 ms बच्छ। Database query आधा गर्दा 190 ms। Loop कहिल्यै समस्या थिएन।\n\n```text\n\"यो code अकुशल देखिन्छ\"        →  bottleneck कहाँ छ?\n\"यो loop optimize गर्नुपर्छ\"    →  profiler ले के देखाउँछ?\n\"यो छिटो हुनुपर्ने\"             →  मैले अघि र पछि मापें\n```\n\n---\n\n### `await` पार context राख्नु\n\nयहाँ हुँदा जान्न लायक एउटा Node उपकरण। `AsyncLocalStorage` ले asynchronous सीमा पार मान उपलब्ध राख्छ, त्यसैले request id हरेक function मा नपठाई हरेक `await` पार बाँच्छ:\n\n```javascript\nimport { AsyncLocalStorage } from \"node:async_hooks\";\n\nconst storage = new AsyncLocalStorage();\n\nfunction log(message) {\n  const context = storage.getStore();\n  console.log(`[request:${context?.requestId}] ${message}`);\n}\n\nstorage.run({ requestId: \"req-123\" }, async () => {\n  log(\"Request started\");\n  await new Promise(resolve => setTimeout(resolve, 100));\n  log(\"Request finished\");   // request id अझै यहीँ छ\n});\n```\n\nवास्तविक backend मा request id, tracing र logging context यसै गरी फैलिन्छन्।",
        jp: "直感で最適化しない。この規律はひとつの習慣に尽きる。<b>何かを変える前に、時間が実際どこへ行っているかを突き止める。</b>\n\n---\n\n### 1. 基本 — 区間を計る\n\n```javascript\nconst start = performance.now();\n\ndoExpensiveWork();\n\nconsole.log(`Took ${(performance.now() - start).toFixed(2)}ms`);\n```\n\n`performance.now()` は高分解能の経過時間を返す。手早く挟むなら `console.time()` の方が短い:\n\n```javascript\nconsole.time(\"database-query\");\nawait db.query(\"SELECT * FROM users\");\nconsole.timeEnd(\"database-query\");   // database-query: 42.31ms\n```\n\n---\n\n### 2. 中級 — 区間に名前を付ける\n\n規模が大きくなったら、測定に名前を付けて実行間で比較できるようにする:\n\n```javascript\nperformance.mark(\"fetchStart\");\nawait fetchUser(42);\nperformance.mark(\"fetchEnd\");\n\nperformance.measure(\"fetchUser\", \"fetchStart\", \"fetchEnd\");\n\nconst [entry] = performance.getEntriesByName(\"fetchUser\");\nconsole.log(entry.duration);\n```\n\nブラウザではDevToolsの記録が<b>ロングタスク</b>、つまりメインスレッドを概ね<b>50 ms</b>以上塞ぐものを示す。そこを超えると入力と描画が目に見えて滞る。Nodeでは `node --prof`・インスペクタ・ヒープスナップショット・`process.memoryUsage()` が同じ役割を担う:\n\n```text\nrss         プロセスが保持する総メモリ\nheapUsed    現在使用中のJavaScriptヒープ\nheapTotal   V8が確保済みのJavaScriptヒープ\nexternal    ネイティブ資源に結び付くメモリ\n```\n\n---\n\n### 3. 上級 — プロファイルが示すものを直す\n\nあるエンドポイントが500 msかかる。「遅そうな」ループを書き直す前に測る:\n\n```text\nDatabase query        380ms\nExternal API           90ms\nJavaScript processing  20ms\nJSON serialization     10ms\n------------------------------\n合計                  500ms\n```\n\nJavaScriptを4倍速くしても15 ms。DBクエリを半分にすれば190 ms。ループは最初から問題ではなかった。\n\n```text\n「このコードは非効率に見える」   →  ボトルネックはどこか\n「このループを最適化しよう」     →  プロファイラは何と言っているか\n「もっと速いはずだ」             →  前後で測った\n```\n\n---\n\n### `await` をまたいで文脈を保つ\n\nここで知っておきたいNodeの道具がひとつ。`AsyncLocalStorage` は非同期の境界をまたいで値を保つので、リクエストIDを各関数へ引き回さずとも、すべての `await` を越えて生き残る:\n\n```javascript\nimport { AsyncLocalStorage } from \"node:async_hooks\";\n\nconst storage = new AsyncLocalStorage();\n\nfunction log(message) {\n  const context = storage.getStore();\n  console.log(`[request:${context?.requestId}] ${message}`);\n}\n\nstorage.run({ requestId: \"req-123\" }, async () => {\n  log(\"Request started\");\n  await new Promise(resolve => setTimeout(resolve, 100));\n  log(\"Request finished\");   // リクエストIDはまだここにある\n});\n```\n\n実際のバックエンドで、リクエストID・トレース・ログの文脈はこうして伝わる。",
      },
      diagram: `The 500ms endpoint, measured rather than guessed

Database query        ████████████████████████  380ms
External API          ██████                     90ms
JavaScript processing █                          20ms
JSON serialization    ▌                          10ms
                      ─────────────────────────────────
Total                                           500ms

4x faster JavaScript  saves  15ms
halving the query     saves 190ms


Three tools, three sizes of question

performance.now()     how long did this block take
console.time()        quick bracket around one operation
performance.mark()    named spans, comparable across runs
  + measure()


The habit

"this looks inefficient"  →  where is the bottleneck?
"optimize this loop"      →  what does the profiler show?
"this should be faster"   →  I measured before and after`,
      codeExample: {
        title: { en: "Measuring, and reading what you measured", np: "माप्नु, र मापेको पढ्नु", jp: "測ることと、測った結果を読むこと" },
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
      keyTakeaways: [
        { en: "<b>Measure before optimising</b> — intuition about where time goes is usually wrong.", np: "<b>Optimize गर्नुअघि माप्नुहोस्</b> — समय कहाँ जान्छ भन्ने अनुमान प्रायः गलत हुन्छ।", jp: "<b>最適化の前に測る</b>。時間の行き先についての直感はたいてい外れる。" },
        { en: "`performance.now()` gives high-resolution elapsed time; `console.time()` is the quick version.", np: "`performance.now()` ले उच्च-रिजोल्युसन समय दिन्छ; `console.time()` छिटो संस्करण हो।", jp: "`performance.now()` は高分解能の経過時間、`console.time()` は簡易版。" },
        { en: "`performance.mark()` and `measure()` name spans so runs can be compared.", np: "`performance.mark()` र `measure()` ले अवधिलाई नाम दिन्छन् ताकि run तुलना गर्न सकियोस्।", jp: "`performance.mark()` と `measure()` は区間に名前を付け、実行間の比較を可能にする。" },
        { en: "A <b>long task</b> blocks the main thread beyond about 50 ms, past which input visibly stalls.", np: "<b>Long task</b> ले मुख्य thread करिब 50 ms भन्दा बढी रोक्छ, जसपछि input देखिने गरी अड्किन्छ।", jp: "<b>ロングタスク</b>はメインスレッドを約50 ms以上塞ぎ、そこを超えると入力が目に見えて滞る。" },
        { en: "`process.memoryUsage()` reports `rss`, `heapUsed`, `heapTotal` and `external`.", np: "`process.memoryUsage()` ले `rss`, `heapUsed`, `heapTotal` र `external` बताउँछ।", jp: "`process.memoryUsage()` は `rss`・`heapUsed`・`heapTotal`・`external` を報告する。" },
        { en: "Optimise the <b>largest</b> measured cost — a 4x faster 20 ms step saves less than trimming a 380 ms query.", np: "<b>सबैभन्दा ठूलो</b> मापिएको लागत optimize गर्नुहोस् — 20 ms को चरण 4 गुणा छिटो बनाउँदा 380 ms को query घटाउनु भन्दा कम बच्छ।", jp: "<b>最大の</b>実測コストを直す。20 msを4倍速くするより、380 msのクエリを削る方が効く。" },
        { en: "`AsyncLocalStorage` keeps a request id available across every `await` without threading a parameter.", np: "`AsyncLocalStorage` ले parameter नपठाई हरेक `await` पार request id उपलब्ध राख्छ।", jp: "`AsyncLocalStorage` は引数を引き回さずに、すべての `await` を越えてリクエストIDを保つ。" },
      ],
      commonMistakes: [
        { en: "<b>Optimising the code that looks slow</b> — in a 500 ms endpoint spending 380 ms in the database, the JavaScript was never the bottleneck.", np: "<b>ढिलो देखिने code optimize गर्नु</b> — 500 ms को endpoint ले 380 ms database मा बिताउँछ भने, JavaScript कहिल्यै bottleneck थिएन।", jp: "<b>遅そうに見えるコードを直す</b> — 500 msのうち380 msがDBなら、JavaScriptは最初からボトルネックではない。" },
        { en: "<b>Chasing micro-optimisations</b> — making a 1 ms operation ten times faster saves 0.9 ms; cutting a 500 ms one to 200 ms saves 300.", np: "<b>Micro-optimisation पछ्याउनु</b> — 1 ms को काम दस गुणा छिटो बनाउँदा 0.9 ms बच्छ; 500 ms लाई 200 ms बनाउँदा 300।", jp: "<b>細かな最適化を追う</b> — 1 msを10倍速くしても0.9 ms。500 msを200 msにすれば300 ms浮く。" },
        { en: "<b>Measuring once</b> — the first run is interpreted and un-optimised, so a single number says nothing about steady-state performance.", np: "<b>एक पटक माप्नु</b> — पहिलो run interpret भएको र optimize नभएको हुन्छ, त्यसैले एउटै संख्याले स्थिर अवस्थाको performance बारे केही भन्दैन।", jp: "<b>1回だけ測る</b> — 最初の実行は解釈実行で未最適化。1つの数値では定常状態の性能は分からない。" },
        { en: "<b>Reporting an improvement without a before number</b> — without the baseline there is no way to tell whether the change helped at all.", np: "<b>अघिको संख्याबिना सुधार बताउनु</b> — baseline नभए परिवर्तनले केही मद्दत गर्‍यो कि भनी भन्ने उपाय छैन।", jp: "<b>前の数値なしに改善を報告する</b> — 基準がなければ、その変更が効いたかどうか判断できない。" },
      ],
      quiz: [
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
          explanation: { en: "`console.time()` is the quick version; `performance.mark()` names spans.", np: "`console.time()` छिटो संस्करण हो; `performance.mark()` ले अवधिलाई नाम दिन्छ।", jp: "`console.time()` は簡易版、`performance.mark()` は区間に名前を付ける。" },
        },
        {
          question: { en: "What is a \"long task\" in the browser?", np: "Browser मा \"long task\" के हो?", jp: "ブラウザでの「ロングタスク」とは?" },
          options: [
            { en: "Any task taking more than one second", np: "एक सेकेन्डभन्दा बढी लाग्ने task", jp: "1秒を超えるタスク" },
            { en: "Any asynchronous operation", np: "कुनै पनि asynchronous operation", jp: "あらゆる非同期処理" },
            { en: "A task blocking the main thread beyond about 50 ms", np: "मुख्य thread करिब 50 ms भन्दा बढी रोक्ने task", jp: "メインスレッドを約50 ms以上塞ぐタスク" },
          ],
          correctIndex: 2,
          explanation: { en: "Past that, input and rendering start visibly stalling.", np: "त्यसभन्दा पर, input र rendering देखिने गरी अड्किन थाल्छन्।", jp: "それを超えると、入力と描画が目に見えて滞り始める。" },
        },
        {
          question: { en: "An endpoint spends 380ms in the database and 20ms in JavaScript. What helps most?", np: "Endpoint ले 380ms database मा र 20ms JavaScript मा बिताउँछ। के सबैभन्दा बढी मद्दत गर्छ?", jp: "エンドポイントがDBに380ms、JavaScriptに20ms使う。最も効くのは?" },
          options: [
            { en: "Halving the database query", np: "Database query आधा गर्नु", jp: "DBクエリを半分にする" },
            { en: "Making the JavaScript four times faster", np: "JavaScript चार गुणा छिटो बनाउनु", jp: "JavaScriptを4倍速くする" },
            { en: "Rewriting the loop as `reduce()`", np: "Loop लाई `reduce()` मा लेख्नु", jp: "ループを `reduce()` で書き直す" },
          ],
          correctIndex: 0,
          explanation: { en: "That saves 190ms; the JavaScript change saves 15ms.", np: "त्यसले 190ms बचाउँछ; JavaScript को परिवर्तनले 15ms।", jp: "そちらは190ms、JavaScriptの変更は15ms。" },
        },
        {
          question: { en: "What problem does `AsyncLocalStorage` solve?", np: "`AsyncLocalStorage` ले कुन समस्या हल गर्छ?", jp: "`AsyncLocalStorage` はどんな問題を解くか?" },
          options: [
            { en: "It speeds up asynchronous code", np: "यसले asynchronous code छिटो बनाउँछ", jp: "非同期コードを速くする" },
            { en: "It keeps context such as a request id available across awaits", np: "यसले request id जस्तो context await पार उपलब्ध राख्छ", jp: "リクエストIDのような文脈をawaitをまたいで保つ" },
            { en: "It stores data in localStorage on the server", np: "यसले server मा localStorage मा data राख्छ", jp: "サーバー側のlocalStorageに保存する" },
          ],
          correctIndex: 1,
          explanation: { en: "Without it you thread the request id through every function by hand.", np: "यो नभए request id हरेक function मा हातले पठाउनुपर्छ।", jp: "無ければリクエストIDを全関数へ手で引き回すことになる。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "What is TurboFan's role in V8?", np: "V8 मा TurboFan को भूमिका के हो?", jp: "V8におけるTurboFanの役割は?" },
      options: [
        { en: "Optimizing hot JavaScript into machine code", np: "Hot JavaScript लाई machine code मा optimize गर्नु", jp: "ホットなJavaScriptを機械語へ最適化する" },
        { en: "Parsing HTML", np: "HTML parse गर्नु", jp: "HTMLを解析する" },
        { en: "Managing HTTP requests", np: "HTTP request व्यवस्थापन", jp: "HTTPリクエストを管理する" },
        { en: "Storing objects permanently", np: "Object सधैंका लागि राख्नु", jp: "オブジェクトを永久に保存する" },
      ],
      correctIndex: 0,
      explanation: { en: "Ignition runs the bytecode first and collects the type feedback TurboFan uses.", np: "पहिले Ignition ले bytecode चलाउँछ र TurboFan ले प्रयोग गर्ने type feedback जम्मा गर्छ।", jp: "先にIgnitionがバイトコードを走らせ、TurboFanが使う型フィードバックを集める。" },
    },
    {
      question: { en: "What is deoptimization?", np: "Deoptimization के हो?", jp: "最適化解除とは何か?" },
      options: [
        { en: "Abandoning an optimization because its assumptions no longer hold", np: "मान्यता नरहेकाले optimisation छाड्नु", jp: "前提が成り立たなくなり最適化を捨てること" },
        { en: "Converting JavaScript to TypeScript", np: "JavaScript लाई TypeScript बनाउनु", jp: "JavaScriptをTypeScriptに変換すること" },
        { en: "Deleting source code", np: "Source code मेटाउनु", jp: "ソースコードを削除すること" },
        { en: "Freeing every object in memory", np: "हरेक object मुक्त गर्नु", jp: "全オブジェクトを解放すること" },
      ],
      correctIndex: 0,
      explanation: { en: "It is how the engine stays correct, not a sign that something broke.", np: "यो engine सही रहने तरिका हो, केही बिग्रेको संकेत होइन।", jp: "壊れた印ではなく、エンジンが正しさを保つ仕組み。" },
    },
    {
      question: { en: "Why can objects with consistent shapes be faster?", np: "एउटै आकार भएका object किन छिटो हुन सक्छन्?", jp: "形が一貫したオブジェクトが速くなりうるのはなぜか?" },
      options: [
        { en: "They use less syntax", np: "तिनले कम syntax प्रयोग गर्छन्", jp: "構文が少ないから" },
        { en: "They become immutable automatically", np: "तिनी स्वतः अपरिवर्तनीय बन्छन्", jp: "自動的に不変になるから" },
        { en: "V8 can optimize property access through a predictable hidden class", np: "V8 ले पूर्वानुमानयोग्य hidden class मार्फत property पहुँच optimize गर्न सक्छ", jp: "予測できる隠しクラスによりプロパティ参照を最適化できるから" },
        { en: "They skip garbage collection", np: "तिनले garbage collection छल्छन्", jp: "GCを回避するから" },
      ],
      correctIndex: 2,
      explanation: { en: "A monomorphic call site collapses the lookup to a fixed offset.", np: "Monomorphic call site ले lookup लाई निश्चित offset मा खुम्च्याउँछ।", jp: "単形の呼び出し地点では参照が固定オフセットに畳まれる。" },
    },
    {
      question: { en: "What makes a call site polymorphic?", np: "Call site लाई polymorphic केले बनाउँछ?", jp: "呼び出し地点が多形になる原因は?" },
      options: [
        { en: "Being called very often", np: "धेरै पटक बोलाइनु", jp: "頻繁に呼ばれること" },
        { en: "Receiving objects of several different shapes", np: "धेरै फरक आकारका object पाउनु", jp: "複数の異なる形を受け取ること" },
        { en: "Returning more than one type", np: "एकभन्दा बढी type फर्काउनु", jp: "複数の型を返すこと" },
      ],
      correctIndex: 1,
      explanation: { en: "The engine must then check which shape it got before reading.", np: "अनि engine ले पढ्नुअघि कुन आकार आयो जाँच्नुपर्छ।", jp: "エンジンは読む前にどの形かを確かめねばならない。" },
    },
    {
      question: { en: "Which generation do most new objects die in?", np: "धेरैजसो नयाँ object कुन generation मा मर्छन्?", jp: "多くの新しいオブジェクトが死ぬのはどの世代か?" },
      options: [
        { en: "The young generation", np: "Young generation", jp: "若い世代" },
        { en: "The old generation", np: "Old generation", jp: "古い世代" },
        { en: "Neither, objects are freed manually", np: "कुनै पनि होइन, हातले मुक्त गरिन्छ", jp: "どちらでもない。手動で解放する" },
      ],
      correctIndex: 0,
      explanation: { en: "Generational collection is built on exactly that observation.", np: "Generational संकलन ठ्याक्कै यही अवलोकनमा बनेको छ।", jp: "世代別回収はまさにその観察の上に成り立つ。" },
    },
    {
      question: { en: "Why is object pooling poor default advice?", np: "Object pooling किन राम्रो पूर्वनिर्धारित सल्लाह होइन?", jp: "オブジェクトプールが既定の助言として不適なのは?" },
      options: [
        { en: "It is not supported outside Node", np: "Node बाहिर समर्थित छैन", jp: "Node以外では使えないから" },
        { en: "It complicates the code and often runs slower on modern engines", np: "यसले code जटिल बनाउँछ र आधुनिक engine मा प्रायः ढिलो चल्छ", jp: "コードを複雑にし、現代のエンジンではむしろ遅くなることが多いから" },
        { en: "It prevents garbage collection entirely", np: "यसले garbage collection पूरै रोक्छ", jp: "GCを完全に止めるから" },
      ],
      correctIndex: 1,
      explanation: { en: "Measure the allocation and collector behaviour before introducing it.", np: "यो ल्याउनुअघि allocation र collector को व्यवहार माप्नुहोस्।", jp: "導入前に確保とコレクタの挙動を測る。" },
    },
    {
      question: { en: "What should you do before optimizing a suspected bottleneck?", np: "शंकास्पद bottleneck optimize गर्नुअघि के गर्नुपर्छ?", jp: "ボトルネックらしき箇所を最適化する前に?" },
      options: [
        { en: "Rewrite it in another language", np: "अर्को भाषामा लेख्नु", jp: "別の言語で書き直す" },
        { en: "Add caching immediately", np: "तुरुन्तै caching थप्नु", jp: "すぐキャッシュを足す" },
        { en: "Use `delete` less often", np: "`delete` कम प्रयोग गर्नु", jp: "`delete` の使用を減らす" },
        { en: "Measure and profile it", np: "माप्नु र profile गर्नु", jp: "測ってプロファイルする" },
      ],
      correctIndex: 3,
      explanation: { en: "A 500ms endpoint spending 380ms in the database will not be fixed in JavaScript.", np: "500ms को endpoint ले 380ms database मा बिताउँछ भने JavaScript मा समाधान हुँदैन।", jp: "500msのうち380msがDBなら、JavaScript側では直らない。" },
    },
    {
      question: { en: "Which API gives high-resolution elapsed time?", np: "कुन API ले उच्च-रिजोल्युसन बितेको समय दिन्छ?", jp: "高分解能な経過時間を返すAPIは?" },
      options: [
        { en: "`Date.parse()`", np: "`Date.parse()`", jp: "`Date.parse()`" },
        { en: "`performance.now()`", np: "`performance.now()`", jp: "`performance.now()`" },
        { en: "`Object.time()`", np: "`Object.time()`", jp: "`Object.time()`" },
        { en: "`process.clock()`", np: "`process.clock()`", jp: "`process.clock()`" },
      ],
      correctIndex: 1,
      explanation: { en: "`console.time()` is the quick version; `performance.mark()` names spans.", np: "`console.time()` छिटो संस्करण हो; `performance.mark()` ले अवधिलाई नाम दिन्छ।", jp: "`console.time()` は簡易版、`performance.mark()` は区間に名前を付ける。" },
    },
    {
      question: { en: "What is a \"long task\" in the browser?", np: "Browser मा \"long task\" के हो?", jp: "ブラウザでの「ロングタスク」とは?" },
      options: [
        { en: "A task blocking the main thread beyond about 50 ms", np: "मुख्य thread करिब 50 ms भन्दा बढी रोक्ने task", jp: "メインスレッドを約50 ms以上塞ぐタスク" },
        { en: "Any task taking more than one second", np: "एक सेकेन्डभन्दा बढी लाग्ने task", jp: "1秒を超えるタスク" },
        { en: "Any asynchronous operation", np: "कुनै पनि asynchronous operation", jp: "あらゆる非同期処理" },
      ],
      correctIndex: 0,
      explanation: { en: "Past that, input and rendering start visibly stalling.", np: "त्यसभन्दा पर, input र rendering देखिने गरी अड्किन थाल्छन्।", jp: "それを超えると入力と描画が目に見えて滞る。" },
    },
    {
      question: { en: "What problem does `AsyncLocalStorage` solve?", np: "`AsyncLocalStorage` ले कुन समस्या हल गर्छ?", jp: "`AsyncLocalStorage` はどんな問題を解くか?" },
      options: [
        { en: "It speeds up asynchronous code", np: "यसले asynchronous code छिटो बनाउँछ", jp: "非同期コードを速くする" },
        { en: "It stores data in localStorage on the server", np: "यसले server मा localStorage मा राख्छ", jp: "サーバー側のlocalStorageに保存する" },
        { en: "It keeps context such as a request id available across awaits", np: "यसले request id जस्तो context await पार उपलब्ध राख्छ", jp: "リクエストIDのような文脈をawaitをまたいで保つ" },
      ],
      correctIndex: 2,
      explanation: { en: "Without it you thread the request id through every function by hand.", np: "यो नभए request id हरेक function मा हातले पठाउनुपर्छ।", jp: "無ければリクエストIDを全関数へ手で引き回すことになる。" },
    },
  ],
};
