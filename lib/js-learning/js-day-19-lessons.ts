import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_19_LESSONS: JsLessonDay = {
  day: 19,
  title: { en: "Memory management — stack, heap, GC & leak detection", np: "Memory management", jp: "メモリ管理・GC・リーク検出" },
  totalMinutes: 27,
  difficulty: { en: "Advanced", np: "Advanced", jp: "上級" },
  lessons: [
    {
      id: "stack-heap-gc",
      title: { en: "Stack vs Heap & Garbage Collection", np: "Stack vs Heap र Garbage Collection", jp: "スタックとヒープ・ガベージコレクション" },
      durationMinutes: 9,
      explanation: {
        en: "JavaScript splits memory into two regions with very different rules. The <b>stack</b> is small and fast — it stores primitive values (`number`, `string`, `boolean`, `undefined`, `null`) and the call frames created every time a function runs, and it is automatically popped clean the moment a function returns. Primitives use <b>copy semantics</b>: when you write `let b = a`, `b` gets its own independent copy of the value, so changing `b` afterwards never affects `a`. The <b>heap</b> is large and slower — it stores objects, arrays, functions, and closures, and it is managed by the garbage collector rather than being cleaned up automatically when a function returns. Objects use <b>reference semantics</b>: a variable holding an object doesn't hold the object itself, it holds a pointer to where that object lives on the heap, so `let obj2 = obj1` copies the pointer, not the data — both variables now point at the exact same heap object, and mutating through one is visible through the other.\n\nThis distinction matters most once closures enter the picture: a closure that references a variable from its outer function keeps that variable's heap memory alive for as long as the closure itself is reachable, even long after the outer function has finished running and its stack frame has been popped. JavaScript engines decide what to free using an algorithm called <b>mark-and-sweep</b>. The GC starts from a set of 'roots' — global variables, everything currently on the call stack, and anything captured by a live closure — and walks every reference it can follow from there, marking each object it reaches. Anything left <b>unmarked</b> after that walk is unreachable, meaning no running code could ever get to it again, so its memory is freed. This is also why circular references are not a problem in modern engines: if object A references object B and B references A, but neither is reachable from any root, mark-and-sweep marks neither of them and both get collected — a naive reference-counting collector would keep them alive forever.",
        np: "JavaScript ले memory लाई फरक-फरक rules भएका दुई regions मा बाँड्छ। <b>Stack</b> सानो र fast हुन्छ — यसले primitive values (`number`, `string`, `boolean`, `undefined`, `null`) र function चल्दा बन्ने call frames store गर्छ, र function return हुने बित्तिकै automatically clean हुन्छ। Primitives ले <b>copy semantics</b> प्रयोग गर्छन्: `let b = a` लेख्दा, `b` ले value को आफ्नै independent copy पाउँछ, त्यसैले पछि `b` बदल्दा `a` लाई कहिल्यै असर पर्दैन। <b>Heap</b> ठूलो र slower हुन्छ — यसले objects, arrays, functions, र closures store गर्छ, र यो function return हुँदा automatically clean हुनुको सट्टा garbage collector ले manage गर्छ। Objects ले <b>reference semantics</b> प्रयोग गर्छन्: object राखेको variable ले object आफैं होइन, त्यो heap मा कहाँ छ भन्ने pointer मात्र राख्छ, त्यसैले `let obj2 = obj1` ले pointer copy गर्छ, data होइन — अब दुवै variables ले उही heap object लाई point गर्छन्, र एकबाट mutate गर्दा अर्कोमा पनि देखिन्छ।\n\nयो फरक closures आउँदा सबैभन्दा महत्त्वपूर्ण हुन्छ: outer function को variable लाई refer गर्ने closure ले, outer function चलिसकेर त्यसको stack frame pop भइसके पछि पनि, closure आफैं reachable रहेसम्म त्यो variable को heap memory alive राख्छ। JavaScript engines ले के free गर्ने भन्ने <b>mark-and-sweep</b> नामक algorithm ले decide गर्छन्। GC ले 'roots' — global variables, अहिले call stack मा भएका सबै कुरा, र कुनै live closure ले capture गरेको जुनसुकै कुरा — बाट सुरु गरी, त्यहाँबाट follow गर्न सकिने हरेक reference walk गर्छ, र reach भएको हरेक object mark गर्छ। त्यो walk पछि <b>unmark</b> भइरहेको जुनसुकै कुरा unreachable हो, अर्थात् चलिरहेको कुनै पनि code ले त्यहाँ फेरि पुग्न सक्दैन, त्यसैले त्यसको memory free हुन्छ। यही कारणले modern engines मा circular references समस्या होइनन्: object A ले object B लाई र B ले A लाई refer गरे पनि, कुनै root बाट दुवै मध्ये कुनै पनि reachable छैन भने, mark-and-sweep ले दुवैलाई mark गर्दैन र दुवै collect हुन्छन् — naive reference-counting collector ले भने तिनीहरूलाई सदाको लागि alive राख्थ्यो।",
        jp: "JavaScriptはメモリを規則の異なる2つの領域に分ける。<b>スタック</b>は小さく高速 — プリミティブ値（`number`・`string`・`boolean`・`undefined`・`null`）と、関数が実行されるたびに作られる呼び出しフレームを格納し、関数がreturnした瞬間に自動的にきれいに取り除かれる。プリミティブは<b>コピーセマンティクス</b>を使う：`let b = a`と書くと、`b`は値の独立したコピーを得るため、後で`b`を変更しても`a`には決して影響しない。<b>ヒープ</b>は大きく低速 — オブジェクト・配列・関数・クロージャを格納し、関数がreturnした際に自動的にクリーンアップされるのではなく、ガベージコレクタによって管理される。オブジェクトは<b>参照セマンティクス</b>を使う：オブジェクトを保持する変数はオブジェクト自体を保持するのではなく、そのオブジェクトがヒープ上のどこにあるかを示すポインタを保持する。そのため`let obj2 = obj1`はポインタをコピーするだけでデータはコピーしない — 両方の変数が全く同じヒープ上のオブジェクトを指すようになり、一方を通じて変更すればもう一方からも見える。\n\nこの違いが最も重要になるのはクロージャが関わる場面だ。外側の関数の変数を参照するクロージャは、外側の関数が実行を終えてそのスタックフレームがポップされた後も、クロージャ自身がreachableである限りその変数のヒープメモリを生かし続ける。JavaScriptエンジンは<b>マークアンドスイープ</b>と呼ばれるアルゴリズムで何を解放するか決める。GCは「ルート」（グローバル変数・現在コールスタック上にあるすべて・生きているクロージャが捕捉しているものすべて）から始め、そこから辿れるすべての参照をたどり、到達した各オブジェクトをマークする。そのたどりの後で<b>マークされなかった</b>ものはすべて到達不能、つまり実行中のどのコードも二度とそこに到達できないことを意味し、そのメモリは解放される。これが循環参照が現代のエンジンで問題にならない理由でもある：オブジェクトAがオブジェクトBを参照し、BがAを参照していても、どちらもどのルートからも到達不能なら、マークアンドスイープはどちらもマークせず両方とも回収される — 単純な参照カウント方式のコレクタなら両者を永遠に生かし続けてしまう。",
      },
      diagram: `STACK (fast, small)                    HEAP (large, slower)
┌─────────────────────┐                ┌───────────────────────────┐
│ a = 42               │                │  { x: 1 }  ←── obj1, obj2 │
│ b = 42 (own copy)     │                │  (same object, shared)    │
│ obj1 = 0x01 ──────────┼───────────────►│  0x01                     │
│ obj2 = 0x01 ──────────┼───────────────►│                           │
└─────────────────────┘                └───────────────────────────┘

Mark-and-sweep GC:
  ROOTS (globals, call stack, closures)
        │  follow every reference
        ▼
   [mark reachable]     A ──► B ──► C     (all marked, kept alive)
                         D ◄──► E          (D and E reference each other,
                                            but NOT reachable from any root)
   [sweep unmarked]      D, E → freed, even though they reference each other`,
      codeExample: {
        title: { en: "Stack vs heap in practice, and what keeps memory alive", np: "व्यवहारमा stack vs heap, र memory लाई के alive राख्छ", jp: "実践でのスタックとヒープ、そして何がメモリを生かし続けるか" },
        code: `// ── Stack: primitives copy by value ──────────────────────────────
let a = 42;
let b = a;          // b gets its OWN copy, not a link to a
b = 100;
console.log(a, b);  // 42 100 — changing b never touches a

// ── Heap: objects copy by reference ───────────────────────────────
let obj1 = { score: 1 };
let obj2 = obj1;    // obj2 copies the REFERENCE (pointer), not the object
obj2.score = 99;
console.log(obj1.score); // 99 — obj1 and obj2 point at the same heap object

function sameObject(x, y) {
  return x === y;   // === compares references for objects, not contents
}
console.log(sameObject(obj1, obj2));         // true  — same pointer
console.log(sameObject({ a: 1 }, { a: 1 })); // false — two different heap objects

// ── Closures keep heap memory alive past the function that made it ──
function createCounter() {
  let count = 0;               // lives on the heap because a closure captures it
  return {
    increment() { return ++count; },
    reset() { count = 0; },
  };
}

const counter = createCounter();  // createCounter's stack frame is long gone...
counter.increment();               // ...but count is still alive, held by the closure
counter.increment();
console.log(counter.increment());  // 3

// ── Mark-and-sweep: unreachable objects get freed, even circular ones ──
function makePair() {
  const nodeA = { name: "A" };
  const nodeB = { name: "B" };
  nodeA.friend = nodeB;   // A references B
  nodeB.friend = nodeA;   // B references A — a circular reference
  return "pair created, but never returned to the caller";
}

makePair();
// nodeA and nodeB reference EACH OTHER, but nothing outside makePair() can
// reach either of them once the function returns — mark-and-sweep frees both,
// unlike a naive reference-counting GC which would see count > 0 and leak them`,
      },
      keyTakeaways: [
        { en: "Stack stores primitives with copy semantics and clears automatically when a function returns; heap stores objects, arrays, and closures with reference semantics and is cleaned up by the garbage collector instead.", np: "Stack ले primitives लाई copy semantics सहित store गर्छ र function return हुँदा automatically clear हुन्छ; heap ले objects, arrays, र closures लाई reference semantics सहित store गर्छ र यसको सट्टा garbage collector ले clean गर्छ।", jp: "スタックはプリミティブをコピーセマンティクスで格納し、関数がreturnすると自動的にクリアされる。ヒープはオブジェクト・配列・クロージャを参照セマンティクスで格納し、代わりにガベージコレクタがクリーンアップする。" },
        { en: "A closure keeps every variable it references alive on the heap for as long as the closure itself is reachable, even long after the outer function that created it has returned.", np: "Closure ले reference गर्ने हरेक variable लाई, त्यसलाई बनाउने outer function फर्किसकेको धेरै पछिसम्म पनि, closure आफैं reachable रहेसम्म heap मा alive राख्छ।", jp: "クロージャは、それを作った外側の関数がreturnしてからずっと後になっても、クロージャ自身がreachableである限り、参照するすべての変数をヒープ上で生かし続ける。" },
        { en: "Mark-and-sweep starts from roots (globals, the call stack, live closures) and frees anything it can't reach by following references — including circular references between two otherwise-unreachable objects.", np: "Mark-and-sweep roots (globals, call stack, live closures) बाट सुरु हुन्छ र references follow गरी नपुगिने जुनसुकै कुरा free गर्छ — अन्यथा unreachable दुई objects बीचको circular references सहित।", jp: "マークアンドスイープはルート（グローバル変数・コールスタック・生きているクロージャ）から始まり、参照をたどって到達できないものはすべて解放する — 他に到達不能な2つのオブジェクト間の循環参照も含めて。" },
      ],
      commonMistakes: [
        { en: "Assuming that assigning an object to a new variable copies the object itself, when it actually copies the reference — both variables end up pointing at the same heap object.", np: "Object लाई नयाँ variable मा assign गर्दा object आफैं copy हुन्छ भनी ठान्नु, जबकि वास्तवमा reference मात्र copy हुन्छ — दुवै variables उही heap object लाई point गर्छन्।", jp: "オブジェクトを新しい変数に代入するとオブジェクト自体がコピーされると思い込むこと。実際には参照だけがコピーされ、両方の変数が同じヒープ上のオブジェクトを指すことになる。" },
        { en: "Thinking a closure returned from a function has no ongoing memory cost just because the outer function already returned — the closure keeps its captured heap data alive.", np: "Outer function फर्किसकेको भन्ने कारणले मात्र function बाट return भएको closure को कुनै ongoing memory cost हुँदैन भन्ने सोच्नु — closure ले आफूले capture गरेको heap data alive राखिरहन्छ।", jp: "外側の関数が既にreturnしたからというだけで、関数から返されたクロージャに継続的なメモリコストがないと考えること — クロージャは捕捉したヒープデータを生かし続ける。" },
        { en: "Believing circular references between two objects will leak memory in JavaScript the way they might in a naive reference-counting system — mark-and-sweep still frees both if neither is reachable from a root.", np: "दुई objects बीचको circular references ले naive reference-counting system जस्तै JavaScript मा पनि memory leak गराउँछ भनी विश्वास गर्नु — कुनै root बाट दुवै मध्ये कुनै पनि reachable नभएमा mark-and-sweep ले अझै दुवैलाई free गर्छ।", jp: "2つのオブジェクト間の循環参照が、単純な参照カウント方式のシステムのようにJavaScriptでもメモリリークを起こすと思い込むこと — どちらもルートから到達不能であれば、マークアンドスイープは両方とも解放する。" },
      ],
      quiz: [
        {
          question: { en: "When you do `let b = a` where `a` is a primitive number, what happens if you then change `b`?", np: "`a` एउटा primitive number भएको अवस्थामा `let b = a` गरेपछि, त्यसपछि `b` बदल्दा के हुन्छ?", jp: "`a`がプリミティブな数値のとき`let b = a`とした後、`b`を変更すると何が起きる？" },
          options: [
            { en: "`a` is unaffected — `b` holds an independent copy", np: "`a` मा कुनै असर पर्दैन — `b` ले independent copy राख्छ", jp: "`a`には影響しない — `b`は独立したコピーを持つ" },
            { en: "`a` changes too — they share the same value", np: "`a` पनि बदलिन्छ — दुवैले उही value share गर्छन्", jp: "`a`も変わる — 同じ値を共有している" },
          ],
          correctIndex: 0,
          explanation: { en: "Primitives copy by value, so `b` gets its own independent copy and changing it never touches `a`.", np: "Primitives value ले copy हुन्छन्, त्यसैले `b` ले आफ्नै independent copy पाउँछ र त्यो बदल्दा `a` लाई कहिल्यै touch गर्दैन।", jp: "プリミティブは値でコピーされるため、`b`は独立したコピーを持ち、それを変更しても`a`には決して影響しない。" },
        },
        {
          question: { en: "When you do `let obj2 = obj1` where `obj1` is an object, what does `obj2` actually get?", np: "`obj1` एउटा object भएको अवस्थामा `let obj2 = obj1` गर्दा, `obj2` ले वास्तवमा के पाउँछ?", jp: "`obj1`がオブジェクトのとき`let obj2 = obj1`とすると、`obj2`は実際に何を得る？" },
          options: [
            { en: "A copy of the reference — both point to the same heap object", np: "Reference को copy — दुवैले उही heap object लाई point गर्छन्", jp: "参照のコピー — 両方が同じヒープオブジェクトを指す" },
            { en: "A brand new copy of the object's contents", np: "Object को contents को एउटा नयाँ छुट्टै copy", jp: "オブジェクトの内容の全く新しいコピー" },
          ],
          correctIndex: 0,
          explanation: { en: "Objects use reference semantics — the variable holds a pointer to the heap, and copying the variable only copies that pointer.", np: "Objects ले reference semantics प्रयोग गर्छन् — variable ले heap को pointer राख्छ, र variable copy गर्दा त्यो pointer मात्र copy हुन्छ।", jp: "オブジェクトは参照セマンティクスを使う — 変数はヒープへのポインタを保持し、変数をコピーするとそのポインタだけがコピーされる。" },
        },
        {
          question: { en: "Why are circular references between two otherwise-unreachable objects still collected by a modern JS engine?", np: "अन्यथा unreachable दुई objects बीचको circular references लाई modern JS engine ले अझै किन collect गर्छ?", jp: "他に到達不能な2つのオブジェクト間の循環参照が、モダンなJSエンジンでもなお回収されるのはなぜ？" },
          options: [
            { en: "Mark-and-sweep starts from roots, not reference counts — unreachable objects are freed regardless of pointing at each other", np: "Mark-and-sweep reference counts बाट होइन roots बाट सुरु हुन्छ — एकअर्कालाई point गरे पनि unreachable objects free हुन्छन्", jp: "マークアンドスイープは参照カウントではなくルートから始まる — 互いを指していても到達不能なオブジェクトは解放される" },
            { en: "JS engines special-case circular references and delete them immediately", np: "JS engines ले circular references लाई special-case गरी तुरुन्तै delete गर्छन्", jp: "JSエンジンは循環参照を特別扱いして即座に削除する" },
          ],
          correctIndex: 0,
          explanation: { en: "Reachability, not reference count, decides what's freed — since neither object is reachable from a root, both get marked as garbage regardless of referencing each other.", np: "के free हुने भन्ने reachability ले decide गर्छ, reference count ले होइन — कुनै root बाट दुवै मध्ये कुनै पनि reachable नभएकाले, एकअर्कालाई refer गरे पनि दुवै garbage को रूपमा mark हुन्छन्।", jp: "何が解放されるかは到達可能性で決まり、参照カウントではない — どちらもルートから到達不能なため、互いを参照していても両方ともガベージとしてマークされる。" },
        },
      ],
    },
    {
      id: "memory-leaks",
      title: { en: "The Four Classic Memory Leak Patterns", np: "चार Classic Memory Leak Patterns", jp: "4つの典型的なメモリリークパターン" },
      durationMinutes: 9,
      explanation: {
        en: "The first classic leak is a <b>forgotten event listener</b>: if you attach a listener to a DOM element with `addEventListener` and later remove that element from the page without also calling `removeEventListener`, the element cannot be garbage collected, because the browser's event system still holds a live reference to it through the listener. The fix is always the same shape — whatever adds a listener should also expose a way to remove it, and that removal should run whenever the element is torn down. The second classic leak is a <b>timer that never gets cleared</b>: `setInterval` and `setTimeout` callbacks are closures, and as long as the timer keeps running, its closure — and everything that closure captured, however large — stays reachable from the timer itself, which counts as a root. Calling `startPolling()` a second time without ever clearing the first timer doesn't replace it, it just adds a second one running in parallel, each holding its own captured data alive forever. The fix is to store the id `setInterval`/`setTimeout` returns and call `clearInterval`/`clearTimeout` with it once the timer is no longer needed.\n\nThe third classic leak is an <b>unbounded cache</b>: a plain object or `Map` used to memoize results looks harmless, but if keys are never removed, it grows for the lifetime of the page, and every value it holds stays reachable forever, no matter how obsolete. The fix is to cap the cache at a maximum size and evict the oldest entry once that size is exceeded (an 'LRU' policy), or to use a `WeakMap` when the keys are objects that should be allowed to disappear naturally. The fourth classic leak is a <b>closure that captures more than it needs</b>: if a function receives a huge array but a callback inside it only ever uses one small piece of that array, the closure still keeps a reference to the <b>whole</b> array for as long as the callback exists, because JavaScript captures variables, not values — the entire enclosing scope stays reachable. The fix is to pull out only the specific value you need into its own variable before the closure is created, so the closure captures that small value instead of the large structure it came from.",
        np: "पहिलो classic leak हो <b>बिर्सिएको event listener</b>: `addEventListener` ले DOM element मा listener attach गरेपछि, त्यो element लाई page बाट हटाउँदा `removeEventListener` पनि call नगरे, त्यो element garbage collect हुन सक्दैन, किनकि browser को event system ले listener मार्फत त्यसको live reference अझै राखिरहेको हुन्छ। समाधान सधैं एउटै आकारको हुन्छ — जसले listener थप्छ, त्यसैले हटाउने तरिका पनि दिनुपर्छ, र element हटाउँदा त्यो removal चलाइनुपर्छ। दोस्रो classic leak हो <b>कहिल्यै clear नभएको timer</b>: `setInterval` र `setTimeout` को callbacks closures हुन्, र timer चलिरहेसम्म, त्यसको closure — र त्यो closure ले जति ठूलो data भए पनि capture गरेको सबै — timer आफैं root भएकाले reachable रहन्छ। पहिलो timer कहिल्यै clear नगरी `startPolling()` दोस्रो पटक call गर्दा त्यो replace हुँदैन, बरु parallel मा चलिरहेको दोस्रो timer थपिन्छ, हरेकले आफ्नै captured data सधैं alive राख्छ। समाधान हो `setInterval`/`setTimeout` ले फर्काउने id store गरी, timer आवश्यक नभएपछि त्यो id सँग `clearInterval`/`clearTimeout` call गर्नु।\n\nतेस्रो classic leak हो <b>unbounded cache</b>: results memoize गर्न प्रयोग हुने plain object वा `Map` हानिरहित देखिन्छ, तर keys कहिल्यै हटाइँदैन भने, यो page को जीवनभर बढ्दै जान्छ, र यसले राखेको हरेक value जति नै पुरानो भए पनि सधैं reachable रहन्छ। समाधान हो cache लाई maximum size मा सीमित गरी त्यो size नाघेपछि सबैभन्दा पुरानो entry हटाउने ('LRU' policy), वा keys objects हुन् भने प्राकृतिक रूपमा disappear हुन दिन `WeakMap` प्रयोग गर्ने। चौथो classic leak हो <b>आवश्यकता भन्दा बढी capture गर्ने closure</b>: कुनै function ले ठूलो array पाउँछ तर त्यसभित्रको callback ले त्यो array को एउटा सानो टुक्रा मात्र प्रयोग गर्छ भने, closure ले callback अस्तित्वमा रहेसम्म <b>पूरै</b> array को reference राखिरहन्छ, किनकि JavaScript ले variables capture गर्छ, values होइन — enclosing scope पूरै reachable रहन्छ। समाधान हो closure बन्नु अघि तपाईंलाई चाहिने specific value मात्र छुट्टै variable मा निकाल्ने, ताकि closure त्यो सानो value मात्र capture गरोस्, त्यो आएको ठूलो structure होइन।",
        jp: "最初の典型的なリークは<b>忘れられたイベントリスナー</b>だ：`addEventListener`でDOM要素にリスナーをアタッチした後、`removeEventListener`も呼ばずにその要素をページから削除すると、その要素はガベージコレクトされない。ブラウザのイベントシステムがリスナーを通じてその生きた参照を保持し続けるためだ。修正は常に同じ形をとる — リスナーを追加するものは、それを削除する手段も提供すべきで、その削除は要素が破棄されるときに実行されるべきだ。2番目の典型的なリークは<b>クリアされないタイマー</b>だ：`setInterval`と`setTimeout`のコールバックはクロージャであり、タイマーが動き続ける限り、そのクロージャ — とそれがどれだけ大きなものを捕捉していても — はタイマー自身がルートとして扱われるため到達可能な状態を保つ。最初のタイマーをクリアせずに`startPolling()`を2回目呼んでも、それは置き換わらず、並行して動く2番目のタイマーが追加されるだけで、それぞれが自分の捕捉データを永遠に生かし続ける。修正は`setInterval`/`setTimeout`が返すidを保存し、タイマーが不要になったらそのidで`clearInterval`/`clearTimeout`を呼ぶことだ。\n\n3番目の典型的なリークは<b>無制限に増えるキャッシュ</b>だ：結果をメモ化するためのプレーンオブジェクトや`Map`は無害に見えるが、キーが決して削除されなければページの生存期間中ずっと増え続け、保持している値はどれだけ古くなっても永遠に到達可能なままだ。修正はキャッシュを最大サイズで制限し、そのサイズを超えたら最も古いエントリを退避させること（「LRU」方式）、またはキーがオブジェクトで自然に消えてよい場合は`WeakMap`を使うことだ。4番目の典型的なリークは<b>必要以上に捕捉するクロージャ</b>だ：関数が巨大な配列を受け取り、その中のコールバックがその配列の小さな一部分しか使わない場合でも、クロージャはコールバックが存在する限り<b>配列全体</b>への参照を保持し続ける。JavaScriptは値ではなく変数を捕捉するため、囲んでいるスコープ全体が到達可能なままになるからだ。修正はクロージャが作られる前に必要な特定の値だけを別の変数に取り出し、クロージャがその小さな値だけを捕捉するようにすることだ。",
      },
      diagram: `LEAK PATTERN            SYMPTOM                          FIX
────────────────────────────────────────────────────────────────────────
1. Event listener   btn removed from DOM but         removeEventListener()
   forgotten            listener still references it    before/on cleanup

2. Timer never       setInterval closure holds        clearInterval(id) /
   cleared              captured data forever            clearTimeout(id)

3. Unbounded cache   Map/object grows forever,        cap size + evict oldest
                        nothing ever evicted             (LRU) or use WeakMap

4. Over-capturing    closure keeps whole struct       extract only the value
   closure              alive for one small field       you need BEFORE closing

Root ──reference──► [timer / listener / cache / closure] ──reference──► DATA
                     (still reachable → DATA can never be GC'd)`,
      codeExample: {
        title: { en: "Fixing the four classic memory leak patterns", np: "चार classic memory leak patterns fix गर्नु", jp: "4つの典型的なメモリリークパターンを修正する" },
        code: `// ── Leak 1: event listener outlives the element ───────────────────
function renderWidget() {
  const closeBtn = document.querySelector("#close");
  function onClose() { closeBtn.parentElement.remove(); }
  closeBtn.addEventListener("click", onClose);

  // if this widget is torn down elsewhere, onClose (and closeBtn) leak
  // unless the caller runs the cleanup below when the widget goes away
  return function destroy() {
    closeBtn.removeEventListener("click", onClose);
  };
}

const destroyWidget = renderWidget();
// later, when the widget is actually removed from the page:
destroyWidget();

// ── Leak 2: a timer nobody ever stops ─────────────────────────────
function watchTemperature(sensor) {
  const readings = [];               // grows forever inside the closure below
  const id = setInterval(() => {
    readings.push(sensor.read());    // readings is captured — never released
  }, 1000);
  return id;                          // caller MUST keep this id to stop it later
}

const timerId = watchTemperature(mySensor);
// ... eventually:
clearInterval(timerId);              // without this, the closure (and readings) live forever

// ── Leak 3: cache with no eviction ────────────────────────────────
class BoundedCache {
  #store = new Map();
  #max;
  constructor(max = 500) { this.#max = max; }

  set(key, value) {
    this.#store.set(key, value);
    if (this.#store.size > this.#max) {
      this.#store.delete(this.#store.keys().next().value); // evict oldest
    }
  }
  get(key) { return this.#store.get(key); }
}

const responseCache = new BoundedCache(200); // can never grow past 200 entries

// ── Leak 4: closure captures more than it needs ───────────────────
function attachHandler(hugeReport) {
  // handler closing over the ENTIRE hugeReport just to read one field
  // would keep hugeReport alive for as long as the listener exists:
  // document.addEventListener("click", () => console.log(hugeReport.summary));

  // instead, pull out only the small piece the closure actually needs
  const summary = hugeReport.summary;
  document.addEventListener("click", () => console.log(summary));
  // hugeReport itself can now be garbage collected once this function returns
}`,
      },
      keyTakeaways: [
        { en: "Forgotten listeners and uncleared timers both leak because something still reachable — the event system, the running timer — keeps holding a reference; always pair `addEventListener`/`setInterval` with a matching `removeEventListener`/`clearInterval`.", np: "बिर्सिएका listeners र clear नभएका timers दुवैले leak गर्छन् किनकि अझै reachable रहेको कुनै कुरा — event system, चलिरहेको timer — ले reference राखिरहेको हुन्छ; `addEventListener`/`setInterval` लाई सधैं मिल्दो `removeEventListener`/`clearInterval` सँग pair गर्नुहोस्।", jp: "忘れられたリスナーとクリアされないタイマーはどちらも、まだ到達可能な何か — イベントシステム、実行中のタイマー — が参照を保持し続けるためリークする。常に`addEventListener`/`setInterval`には対応する`removeEventListener`/`clearInterval`を対にすること。" },
        { en: "An unbounded cache leaks by design; cap its size with an eviction policy (like LRU) or switch to a `WeakMap` when the keys are objects that should be allowed to disappear naturally.", np: "Unbounded cache ले design अनुसार नै leak गर्छ; eviction policy (LRU जस्तै) सहित यसको size सीमित गर्नुहोस् वा keys objects हुन् र प्राकृतिक रूपमा disappear हुन दिनुपर्ने भएमा `WeakMap` मा switch गर्नुहोस्।", jp: "無制限のキャッシュは設計上リークする。LRUのような退避方式でサイズを制限するか、キーが自然に消えてよいオブジェクトの場合は`WeakMap`に切り替える。" },
        { en: "Closures capture variables, not values — extract only the specific piece of data a closure actually needs before creating it, or it will keep the entire enclosing structure alive.", np: "Closures ले variables capture गर्छन्, values होइन — closure बनाउनु अघि त्यसलाई वास्तवमा चाहिने specific data मात्र निकाल्नुहोस्, नत्र यसले पूरै enclosing structure alive राखिरहन्छ।", jp: "クロージャは値ではなく変数を捕捉する — クロージャを作る前に、それが実際に必要とする特定のデータだけを取り出すこと。そうしなければ囲んでいる構造全体を生かし続けてしまう。" },
      ],
      commonMistakes: [
        { en: "Removing an element from the DOM but forgetting to also remove its event listener, so the element can never be garbage collected.", np: "DOM बाट element हटाउँदा त्यसको event listener पनि हटाउन बिर्सनु, जसले गर्दा त्यो element कहिल्यै garbage collect हुन सक्दैन।", jp: "DOMから要素を削除する際にそのイベントリスナーも削除するのを忘れること。それによりその要素は決してガベージコレクトされない。" },
        { en: "Calling a 'start' function repeatedly without ever clearing the previous timer, silently stacking up parallel timers instead of replacing one.", np: "अघिल्लो timer कहिल्यै clear नगरी 'start' function लाई दोहोर्याएर call गर्नु, replace हुनुको सट्टा silently parallel timers थपिँदै जाने।", jp: "前のタイマーを一度もクリアせずに「start」関数を繰り返し呼ぶこと。置き換わるのではなく、並行するタイマーが静かに積み重なっていく。" },
        { en: "Letting a memoization cache grow with no size limit or eviction policy, assuming in practice it will stay small.", np: "Memoization cache लाई कुनै size limit वा eviction policy बिना बढ्न दिनु, यो practically सानै रहन्छ भनी ठान्नु।", jp: "サイズ制限や退避方式なしでメモ化キャッシュを増やし続けさせること。実際には小さいままだろうと思い込んで。" },
      ],
      quiz: [
        {
          question: { en: "Why does removing a DOM element from the page not free its memory if a listener is still attached?", np: "Listener अझै attach भएको अवस्थामा page बाट DOM element हटाउँदा त्यसको memory किन free हुँदैन?", jp: "リスナーがまだアタッチされている場合、ページからDOM要素を削除してもメモリが解放されないのはなぜ？" },
          options: [
            { en: "The event system still holds a live reference to the element through the listener", np: "Event system ले listener मार्फत त्यो element को live reference अझै राखिरहेको हुन्छ", jp: "イベントシステムがリスナーを通じてその要素への生きた参照をまだ保持しているため" },
            { en: "DOM elements are never garbage collected", np: "DOM elements कहिल्यै garbage collect हुँदैनन्", jp: "DOM要素は決してガベージコレクトされないため" },
          ],
          correctIndex: 0,
          explanation: { en: "The listener callback still references the element, and the browser's event system keeps that reference alive until removeEventListener is called.", np: "Listener callback ले अझै त्यो element लाई reference गर्छ, र browser को event system ले removeEventListener call नभएसम्म त्यो reference alive राखिरहन्छ।", jp: "リスナーのコールバックはまだその要素を参照しており、ブラウザのイベントシステムはremoveEventListenerが呼ばれるまでその参照を生かし続ける。" },
        },
        {
          question: { en: "What's the correct fix for a setInterval that leaks memory?", np: "Memory leak गराउने setInterval को सही fix के हो?", jp: "メモリリークを起こすsetIntervalの正しい修正方法は？" },
          options: [
            { en: "Store its id and call clearInterval once it's no longer needed", np: "यसको id store गर्ने र आवश्यक नभएपछि clearInterval call गर्ने", jp: "そのidを保存し、不要になったらclearIntervalを呼ぶ" },
            { en: "Call setInterval again to overwrite the previous one", np: "अघिल्लोलाई overwrite गर्न setInterval फेरि call गर्ने", jp: "前のものを上書きするために再びsetIntervalを呼ぶ" },
          ],
          correctIndex: 0,
          explanation: { en: "Calling setInterval again doesn't replace the earlier timer, it adds a second one running in parallel; only clearInterval with the stored id actually stops it.", np: "setInterval फेरि call गर्दा पहिलेको timer replace हुँदैन, बरु parallel मा चलिरहेको दोस्रो थपिन्छ; store गरेको id सँग clearInterval ले मात्र यसलाई वास्तवमा रोक्छ।", jp: "setIntervalを再度呼んでも前のタイマーは置き換わらず、並行して動く2つ目が追加されるだけ。保存したidでclearIntervalを呼ぶことだけが実際に停止させる。" },
        },
        {
          question: { en: "How should an unbounded in-memory cache be fixed?", np: "Unbounded in-memory cache लाई कसरी fix गर्नुपर्छ?", jp: "無制限のインメモリキャッシュはどう修正すべき？" },
          options: [
            { en: "Cap its size and evict old entries, or use a WeakMap for object keys", np: "यसको size सीमित गर्ने र पुराना entries evict गर्ने, वा object keys का लागि WeakMap प्रयोग गर्ने", jp: "サイズを制限して古いエントリを退避させる、またはオブジェクトキーにWeakMapを使う" },
            { en: "Convert it to an array instead of a Map or object", np: "यसलाई Map वा object को सट्टा array मा convert गर्ने", jp: "MapやオブジェクトではなくArrayに変換する" },
          ],
          correctIndex: 0,
          explanation: { en: "The leak comes from unbounded growth, not the data structure choice — capping size with eviction (or WeakMap for object keys) is what actually fixes it.", np: "Leak data structure को choice बाट होइन, unbounded growth बाट आउँछ — eviction सहित size सीमित गर्नु (वा object keys का लागि WeakMap) ले नै वास्तवमा यसलाई fix गर्छ।", jp: "リークはデータ構造の選択からではなく、無制限の増加から生じる。退避方式でサイズを制限すること（またはオブジェクトキーにWeakMapを使うこと）が実際の修正方法。" },
        },
      ],
    },
    {
      id: "weakmap-weakset",
      title: { en: "WeakMap, WeakSet & WeakRef", np: "WeakMap, WeakSet र WeakRef", jp: "WeakMap・WeakSet・WeakRef" },
      durationMinutes: 9,
      explanation: {
        en: "A regular `Map` holds a <b>strong reference</b> to every key it stores: as long as the `Map` itself is reachable, every object used as a key is kept alive too, even if nothing else in the program references it anymore — the `Map` alone is enough to keep it out of the garbage collector's reach. A `WeakMap` looks similar on the surface but holds a <b>weak reference</b> to its keys instead: if a key object has no other reachable reference pointing at it, the garbage collector is free to collect it, and when that happens the corresponding entry silently disappears from the `WeakMap` on its own — you never have to remove it manually, and the collection itself doesn't fire any event or callback you can observe.\n\nThis makes `WeakMap` the right tool whenever you want to attach extra data to an object <b>without</b> that data becoming a reason the object can't be freed — attaching cached metadata or click counts to DOM elements so it disappears automatically when the element is removed, or implementing private per-instance state for a class before JavaScript had real private fields (`#field`). The trade-off is that `WeakMap` is deliberately limited: its keys must be objects, never primitives; it is not iterable, so there is no `forEach` or `.keys()`; and it has no `.size`, because the number of live entries can change at any moment as the GC runs. `WeakSet` is the same idea applied to a `Set` — a collection of objects held weakly, useful for marking 'already seen/processed' without leaking whatever you're tracking. `WeakRef` goes one level lower: it's a single weak reference to one object that you can call `.deref()` on to get the object back (or `undefined` if it was already collected), handy for building your own small GC-friendly caches, though `WeakMap`/`WeakSet` cover the common cases and should be reached for first.",
        np: "Regular `Map` ले store गर्ने हरेक key मा <b>strong reference</b> राख्छ: `Map` आफैं reachable रहेसम्म, त्यो key को रूपमा प्रयोग भएको हरेक object पनि alive रहन्छ, program मा अरू कुनैले पनि त्यसलाई refer नगरे पनि — त्यो object लाई garbage collector को पहुँचबाट बाहिर राख्न `Map` एक्लै पुग्छ। `WeakMap` सतही रूपमा उस्तै देखिन्छ तर त्यसको keys मा <b>weak reference</b> राख्छ: कुनै key object लाई point गर्ने अरू कुनै reachable reference नभएमा, garbage collector ले त्यसलाई collect गर्न स्वतन्त्र हुन्छ, र त्यसो हुँदा सम्बन्धित entry `WeakMap` बाट आफैं silently disappear हुन्छ — manually हटाउनु पर्दैन, र त्यो collection ले तपाईंले observe गर्न सक्ने कुनै event वा callback पनि fire गर्दैन।\n\nयसैले `WeakMap` सही tool हो जब तपाईं कुनै object मा extra data attach गर्न चाहनुहुन्छ <b>तर</b> त्यो data नै object free हुन नसक्नु को कारण नबनोस् भन्ने चाहनुहुन्छ — DOM elements मा cached metadata वा click counts attach गर्ने ताकि element हटाइँदा automatically disappear होस्, वा JavaScript मा real private fields (`#field`) आउनु अघि class को private per-instance state implement गर्ने। Trade-off के हो भने `WeakMap` जानाजानी limited छ: यसका keys objects नै हुनुपर्छ, primitives कहिल्यै हुँदैनन्; यो iterable छैन, त्यसैले `forEach` वा `.keys()` छैन; र यसमा `.size` छैन, किनकि GC चल्दा live entries को संख्या जुनसुकै बेला बदलिन सक्छ। `WeakSet` उही idea हो तर `Set` मा लागू गरिएको — objects लाई weakly hold गर्ने collection, 'already seen/processed' mark गर्न प्रयोगी, tracking गरिरहेको जुनसुकै कुरा leak नगरी। `WeakRef` अझ एक level तल जान्छ: यो एउटा object मा single weak reference हो जसमा `.deref()` call गरेर object फेरि पाउन सकिन्छ (वा पहिले नै collect भइसकेको भए `undefined`), आफ्नै सानो GC-friendly caches बनाउन उपयोगी, यद्यपि `WeakMap`/`WeakSet` ले common cases cover गर्छन् र पहिले तिनैलाई नै रोज्नुपर्छ।",
        jp: "通常の`Map`は格納するすべてのキーに<b>強参照</b>を持つ：`Map`自体が到達可能である限り、キーとして使われているオブジェクトも生かされ続ける。プログラム内の他の何もそれを参照していなくても — `Map`だけでガベージコレクタの手が届かない状態を保てる。`WeakMap`は表面上は似ているが、キーに<b>弱参照</b>を持つ：キーオブジェクトを指す他の到達可能な参照がなければ、ガベージコレクタは自由にそれを回収できる。回収されると対応するエントリは`WeakMap`から静かに自動的に消える — 手動で削除する必要はなく、その回収自体は観測できるイベントやコールバックを発火しない。\n\nこれにより`WeakMap`は、オブジェクトに追加データを付与しつつ<b>そのデータがオブジェクトの解放を妨げる理由にならないようにしたい</b>場合に適したツールとなる — DOM要素にキャッシュされたメタデータやクリック数を付与し、要素が削除されたときに自動的に消えるようにする、あるいはJavaScriptに本物のプライベートフィールド（`#field`）が存在する前にクラスのインスタンスごとのプライベート状態を実装する、といった用途だ。トレードオフは`WeakMap`が意図的に制限されていることだ：キーは必ずオブジェクトでなければならずプリミティブは不可、イテレート不可なので`forEach`や`.keys()`はない、そして`.size`もない（GCが動くたびに生きているエントリ数がいつでも変わり得るため）。`WeakSet`は同じ考え方を`Set`に適用したもので、オブジェクトを弱く保持するコレクションであり、追跡対象をリークさせずに「すでに見た/処理済み」をマークするのに便利だ。`WeakRef`はさらに一段低いレベルの機能で、1つのオブジェクトへの単一の弱参照であり、`.deref()`を呼ぶことでそのオブジェクトを取り戻せる（すでに回収されていれば`undefined`）。自分自身の小さなGCフレンドリーなキャッシュを構築するのに便利だが、一般的なケースは`WeakMap`/`WeakSet`でカバーされるため、まずそちらを検討すべきだ。",
      },
      diagram: `Map (strong reference)              WeakMap (weak reference)
┌─────────────────────┐             ┌─────────────────────┐
│ key: {name:"Alice"} │◄── kept      │ key: {name:"Bob"}   │◄╌╌ NOT kept alive
│ value: {clicks:5}    │    alive    │ value: {clicks:3}   │    by the WeakMap
└─────────────────────┘             └─────────────────────┘
user = null   → {name:"Alice"} STILL alive (Map holds it)
user2 = null  → {name:"Bob"} CAN be GC'd → WeakMap entry vanishes automatically

WeakMap use cases:            WeakMap limits:            WeakSet:
 • DOM element metadata        • keys must be objects      • like Set, weak refs
 • private instance data       • not iterable              • "have I seen this?"
                                • no .size                    without leaking it

WeakRef: const ref = new WeakRef(obj);  ref.deref() → obj OR undefined (if GC'd)`,
      codeExample: {
        title: { en: "WeakMap, WeakSet and WeakRef in practice", np: "व्यवहारमा WeakMap, WeakSet र WeakRef", jp: "実践におけるWeakMap・WeakSet・WeakRef" },
        code: `// ── Map vs WeakMap: who keeps the key alive? ──────────────────────
const strongMap = new Map();
let alice = { name: "Alice" };
strongMap.set(alice, { clicks: 5 });
alice = null;
// { name: "Alice" } is STILL alive — strongMap holds a strong reference to it

const weakMap = new WeakMap();
let bob = { name: "Bob" };
weakMap.set(bob, { clicks: 3 });
bob = null;
// { name: "Bob" } CAN now be garbage collected — weakMap doesn't prevent it,
// and once collected, weakMap's entry for it disappears with no event fired

// ── Use case 1: DOM metadata that cleans itself up ────────────────
const elementStats = new WeakMap();

function trackClicks(element) {
  if (!elementStats.has(element)) {
    elementStats.set(element, { clicks: 0 });
  }
  const stats = elementStats.get(element);
  stats.clicks++;
  return stats.clicks;
}

const row = document.querySelector(".row");
row.addEventListener("click", () => trackClicks(row));
// when row is later removed from the DOM and has no other references,
// its entry in elementStats is freed automatically — no manual cleanup needed

// ── Use case 2: private instance data without # fields ────────────
const privateState = new WeakMap();

class BankAccount {
  constructor(openingBalance) {
    privateState.set(this, { balance: openingBalance });
  }
  deposit(amount) {
    privateState.get(this).balance += amount;
  }
  get balance() {
    return privateState.get(this).balance;
  }
}

// ── WeakSet: mark objects as "seen" without leaking them ──────────
const alreadyProcessed = new WeakSet();

function processTask(task) {
  if (alreadyProcessed.has(task)) return;
  alreadyProcessed.add(task);
  runExpensiveWork(task);
  // once task is discarded elsewhere, its WeakSet entry frees itself
}

// ── WeakRef: a manual weak reference with .deref() ────────────────
const imageCache = new Map();

function cacheImage(url, imageObject) {
  imageCache.set(url, new WeakRef(imageObject));
}

function getCachedImage(url) {
  const ref = imageCache.get(url);
  return ref?.deref(); // the image object, or undefined if it was already GC'd
}`,
      },
      keyTakeaways: [
        { en: "`Map` holds strong references to its keys so they can never be garbage collected while stored; `WeakMap` holds weak references, letting keys be collected and disappear from the map automatically.", np: "`Map` ले आफ्ना keys मा strong references राख्छ त्यसैले store भएसम्म ती कहिल्यै garbage collect हुन सक्दैनन्; `WeakMap` ले weak references राख्छ, keys collect हुन र map बाट automatically disappear हुन दिन्छ।", jp: "`Map`はキーに強参照を持つため、格納されている限りそれらは決してガベージコレクトされない。`WeakMap`は弱参照を持ち、キーが回収されてマップから自動的に消えることを可能にする。" },
        { en: "`WeakMap` is ideal for attaching metadata, cache, or private state to an object without that attachment becoming a memory leak, but its keys must be objects and it's neither iterable nor has a `.size`.", np: "`WeakMap` object मा metadata, cache, वा private state attach गर्नका लागि उत्तम हो जुन त्यो attachment नै memory leak नबनोस् भन्ने चाहिँदा, तर यसका keys objects नै हुनुपर्छ र यो iterable पनि होइन न `.size` छ।", jp: "`WeakMap`はオブジェクトにメタデータ・キャッシュ・プライベート状態を、それがメモリリークにならないように付与するのに理想的だが、キーは必ずオブジェクトでなければならず、イテレート不可で`.size`もない。" },
        { en: "`WeakSet` applies the same weak-reference idea to a `Set` (e.g. 'already processed' tracking), and `WeakRef` gives you a single manual weak reference you call `.deref()` on.", np: "`WeakSet` ले उही weak-reference idea `Set` मा लागू गर्छ (जस्तै 'already processed' tracking), र `WeakRef` ले तपाईंलाई `.deref()` call गर्न सकिने एउटा single manual weak reference दिन्छ।", jp: "`WeakSet`は同じ弱参照の考え方を`Set`に適用する（「処理済み」の追跡など）。`WeakRef`は`.deref()`を呼べる単一の手動の弱参照を提供する。" },
      ],
      commonMistakes: [
        { en: "Using a regular Map to cache data keyed by DOM elements or objects, not realizing it keeps every one of those keys alive forever.", np: "DOM elements वा objects लाई key बनाई data cache गर्न regular Map प्रयोग गर्नु, यसले ती हरेक keys लाई सदाको लागि alive राख्छ भन्ने नबुझी।", jp: "DOM要素やオブジェクトをキーにしてデータをキャッシュするのに通常のMapを使うこと。それがそれらのキーすべてを永遠に生かし続けることに気づかずに。" },
        { en: "Trying to iterate a WeakMap with forEach or check its .size, forgetting it deliberately supports neither.", np: "WeakMap लाई forEach ले iterate गर्ने वा यसको .size जाँच गर्ने प्रयास गर्नु, यसले जानाजानी दुवै support गर्दैन भन्ने बिर्सी।", jp: "WeakMapをforEachでイテレートしようとしたり.sizeを確認しようとすること。それが意図的にどちらもサポートしていないことを忘れて。" },
        { en: "Assuming WeakRef.deref() always returns the object — it can return undefined at any time once the GC has collected it, so code must handle that case.", np: "WeakRef.deref() ले सधैं object फर्काउँछ भनी ठान्नु — GC ले collect गरिसकेपछि यो जुनसुकै बेला undefined फर्काउन सक्छ, त्यसैले code ले त्यो case handle गर्नुपर्छ।", jp: "WeakRef.deref()が常にオブジェクトを返すと思い込むこと — GCが回収した後はいつでもundefinedを返す可能性があるため、コードはそのケースを処理する必要がある。" },
      ],
      quiz: [
        {
          question: { en: "What's the key difference between Map and WeakMap regarding their keys?", np: "Map र WeakMap बीच तिनका keys सम्बन्धी मुख्य फरक के हो?", jp: "MapとWeakMapのキーに関する主な違いは？" },
          options: [
            { en: "Map holds strong references to keys (never GC'd); WeakMap holds weak references (keys can be GC'd)", np: "Map ले keys मा strong references राख्छ (कहिल्यै GC हुँदैनन्); WeakMap ले weak references राख्छ (keys GC हुन सक्छन्)", jp: "Mapはキーに強参照を持つ（GCされない）。WeakMapは弱参照を持つ（キーはGCされ得る）" },
            { en: "WeakMap is just a faster version of Map with no other differences", np: "WeakMap Map को अन्य कुनै फरक नभएको केवल छिटो version मात्र हो", jp: "WeakMapは他に違いのない、単にMapの高速版に過ぎない" },
          ],
          correctIndex: 0,
          explanation: { en: "The whole point of WeakMap is weak references to keys, letting them be collected when nothing else references them — it's not about speed.", np: "WeakMap को पूरै point हो keys मा weak references राख्ने, अरू कुनैले reference नगरेमा ती collect हुन दिने — यो speed को कुरा होइन।", jp: "WeakMapの主眼はキーへの弱参照であり、他に何も参照していなければ回収されることを可能にする点にある — 速度の問題ではない。" },
        },
        {
          question: { en: "Why is WeakMap a good fit for attaching metadata to DOM elements?", np: "DOM elements मा metadata attach गर्न WeakMap किन उपयुक्त हुन्छ?", jp: "DOM要素にメタデータを付与するのにWeakMapが適している理由は？" },
          options: [
            { en: "The metadata entry disappears automatically once the element itself is garbage collected", np: "Element आफैं garbage collect भएपछि metadata entry automatically disappear हुन्छ", jp: "要素自体がガベージコレクトされると、メタデータのエントリも自動的に消える" },
            { en: "WeakMap makes DOM lookups faster than Map", np: "WeakMap ले DOM lookups लाई Map भन्दा छिटो बनाउँछ", jp: "WeakMapはMapよりDOMのルックアップを高速にする" },
          ],
          correctIndex: 0,
          explanation: { en: "Because WeakMap holds the element weakly, removing the element from the page and losing all other references lets both the element and its metadata be freed together.", np: "WeakMap ले element लाई weakly hold गर्ने भएकाले, page बाट element हटाई अरू सबै references हराउँदा element र त्यसको metadata दुवै एकैसाथ free हुन सक्छन्।", jp: "WeakMapが要素を弱く保持しているため、ページから要素を削除し他のすべての参照を失うと、要素とそのメタデータの両方が一緒に解放される。" },
        },
        {
          question: { en: "Which of these can you do with a WeakMap?", np: "यीमध्ये कुन कुरा WeakMap सँग गर्न सकिन्छ?", jp: "WeakMapでできることはどれ？" },
          options: [
            { en: "Use an object as a key", np: "Object लाई key को रूपमा प्रयोग गर्ने", jp: "オブジェクトをキーとして使う" },
            { en: "Call .forEach() to iterate its entries", np: "यसका entries iterate गर्न .forEach() call गर्ने", jp: "エントリをイテレートするために.forEach()を呼ぶ" },
          ],
          correctIndex: 0,
          explanation: { en: "WeakMap keys must be objects, which is exactly what it supports; it deliberately has no forEach or other iteration methods.", np: "WeakMap का keys objects नै हुनुपर्छ, जो यसले ठ्याक्कै support गर्छ; यसमा जानाजानी forEach वा अन्य iteration methods छैनन्।", jp: "WeakMapのキーはオブジェクトでなければならず、まさにそれをサポートしている。forEachや他のイテレーションメソッドは意図的に存在しない。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "Where are primitive values like numbers and strings stored, and what semantics do they use?", np: "Numbers र strings जस्ता primitive values कहाँ store हुन्छन्, र तिनले कुन semantics प्रयोग गर्छन्?", jp: "数値や文字列のようなプリミティブ値はどこに格納され、どのようなセマンティクスを使う？" },
      options: [{ en: "Stack, copy semantics", np: "Stack, copy semantics", jp: "スタック、コピーセマンティクス" }, { en: "Heap, reference semantics", np: "Heap, reference semantics", jp: "ヒープ、参照セマンティクス" }],
      correctIndex: 0,
      explanation: { en: "Primitives live on the stack and are copied by value whenever assigned to a new variable.", np: "Primitives stack मा रहन्छन् र नयाँ variable मा assign हुँदा value ले copy हुन्छन्।", jp: "プリミティブはスタック上に存在し、新しい変数に代入されるたびに値でコピーされる。" },
    },
    {
      question: { en: "What does mark-and-sweep use as its starting point to decide what's reachable?", np: "के reachable छ भन्ने decide गर्न mark-and-sweep ले सुरुवात बिन्दुको रूपमा के प्रयोग गर्छ?", jp: "マークアンドスイープは何が到達可能かを判断する出発点として何を使う？" },
      options: [{ en: "Roots — globals, the call stack, and live closures", np: "Roots — globals, call stack, र live closures", jp: "ルート — グローバル変数・コールスタック・生きているクロージャ" }, { en: "A reference count on each object", np: "हरेक object मा reference count", jp: "各オブジェクトの参照カウント" }],
      correctIndex: 0,
      explanation: { en: "Mark-and-sweep follows references outward from roots rather than counting references, which is how it correctly handles circular references.", np: "Mark-and-sweep ले reference count गर्नुको सट्टा roots बाट बाहिर references follow गर्छ, यसैले यसले circular references सहि रूपमा handle गर्छ।", jp: "マークアンドスイープは参照を数えるのではなく、ルートから外側へ参照をたどる。これが循環参照を正しく処理できる理由。" },
    },
    {
      question: { en: "Why does a closure keep its captured variables alive even after the outer function returns?", np: "Outer function return भइसकेपछि पनि closure ले आफूले capture गरेका variables किन alive राख्छ?", jp: "外側の関数がreturnした後でも、クロージャが捕捉した変数を生かし続けるのはなぜ？" },
      options: [{ en: "Because the closure itself is reachable and mark-and-sweep follows references from it", np: "किनकि closure आफैं reachable हुन्छ र mark-and-sweep ले त्यसबाट references follow गर्छ", jp: "クロージャ自身が到達可能であり、マークアンドスイープがそこから参照をたどるため" }, { en: "Because JavaScript automatically copies captured variables onto the stack", np: "किनकि JavaScript ले capture भएका variables लाई automatically stack मा copy गर्छ", jp: "JavaScriptが捕捉した変数を自動的にスタックにコピーするため" }],
      correctIndex: 0,
      explanation: { en: "As long as something reachable (like a returned closure) references those variables, the GC keeps them marked and alive on the heap.", np: "Reachable कुनै कुरा (जस्तै return भएको closure) ले ती variables लाई reference गरेसम्म, GC ले तिनलाई heap मा marked र alive राख्छ।", jp: "到達可能な何か（返されたクロージャなど）がそれらの変数を参照している限り、GCはそれらをマーク済みとしてヒープ上で生かし続ける。" },
    },
    {
      question: { en: "What keeps a DOM element in memory even after it's removed from the page?", np: "Page बाट हटाइसकेपछि पनि DOM element लाई memory मा के राखिरहन्छ?", jp: "ページから削除された後でもDOM要素をメモリに残しておくものは何？" },
      options: [{ en: "An event listener still attached to it that the event system references", np: "यसमा अझै attach भएको र event system ले reference गरेको event listener", jp: "まだアタッチされていて、イベントシステムが参照しているイベントリスナー" }, { en: "The browser always keeps removed elements for one page load", np: "Browser ले हटाइएका elements लाई एक page load का लागि सधैं राख्छ", jp: "ブラウザは削除された要素を1回のページ読み込みの間は常に保持する" }],
      correctIndex: 0,
      explanation: { en: "The listener's reference to the element, held alive by the event system, is what prevents garbage collection — not any browser retention policy.", np: "Event system ले alive राखेको listener को element प्रतिको reference नै garbage collection रोक्ने कारण हो — कुनै browser retention policy होइन।", jp: "イベントシステムによって生かされているリスナーの要素への参照がガベージコレクションを妨げるものであり、ブラウザの保持ポリシーではない。" },
    },
    {
      question: { en: "What's the correct fix for a setInterval that leaks memory?", np: "Memory leak गराउने setInterval को सही fix के हो?", jp: "メモリリークを起こすsetIntervalの正しい修正方法は？" },
      options: [{ en: "Store its id and call clearInterval once it's no longer needed", np: "यसको id store गर्ने र आवश्यक नभएपछि clearInterval call गर्ने", jp: "そのidを保存し、不要になったらclearIntervalを呼ぶ" }, { en: "Call setInterval again to overwrite the previous one", np: "अघिल्लोलाई overwrite गर्न setInterval फेरि call गर्ने", jp: "前のものを上書きするために再びsetIntervalを呼ぶ" }],
      correctIndex: 0,
      explanation: { en: "Only clearInterval with the stored id actually stops the timer; calling setInterval again just adds a second one running in parallel.", np: "Store गरेको id सँग clearInterval ले मात्र timer वास्तवमा रोक्छ; setInterval फेरि call गर्दा parallel मा चलिरहेको दोस्रो थपिन्छ मात्र।", jp: "保存したidでclearIntervalを呼ぶことだけが実際にタイマーを停止させる。setIntervalを再度呼んでも並行して動く2つ目が追加されるだけ。" },
    },
    {
      question: { en: "How should an unbounded in-memory cache be fixed?", np: "Unbounded in-memory cache लाई कसरी fix गर्नुपर्छ?", jp: "無制限のインメモリキャッシュはどう修正すべき？" },
      options: [{ en: "Cap its size and evict old entries, or use a WeakMap for object keys", np: "यसको size सीमित गर्ने र पुराना entries evict गर्ने, वा object keys का लागि WeakMap प्रयोग गर्ने", jp: "サイズを制限して古いエントリを退避させる、またはオブジェクトキーにWeakMapを使う" }, { en: "Convert it to an array instead of a Map or object", np: "यसलाई Map वा object को सट्टा array मा convert गर्ने", jp: "MapやオブジェクトではなくArrayに変換する" }],
      correctIndex: 0,
      explanation: { en: "The leak is caused by unbounded growth, not by the data structure — capping size with eviction (or WeakMap for object keys) is the real fix.", np: "Leak data structure ले होइन, unbounded growth ले हुन्छ — eviction सहित size सीमित गर्नु (वा object keys का लागि WeakMap) नै वास्तविक fix हो।", jp: "リークはデータ構造ではなく無制限の増加によって引き起こされる。退避方式でサイズを制限すること（またはオブジェクトキーにWeakMapを使うこと）が本当の修正方法。" },
    },
    {
      question: { en: "What happens to a WeakMap entry when its key object becomes unreachable elsewhere?", np: "WeakMap को key object अन्यत्र unreachable हुँदा त्यसको entry लाई के हुन्छ?", jp: "WeakMapのキーオブジェクトが他の場所で到達不能になると、そのエントリに何が起きる？" },
      options: [{ en: "It's collected and the WeakMap entry disappears automatically", np: "यो collect हुन्छ र WeakMap entry automatically disappear हुन्छ", jp: "回収され、WeakMapのエントリは自動的に消える" }, { en: "The WeakMap throws an error on the next access", np: "WeakMap ले अर्को access मा error throw गर्छ", jp: "WeakMapは次のアクセスでエラーをスローする" }],
      correctIndex: 0,
      explanation: { en: "WeakMap holds a weak reference, so once nothing else references the key, both the key and its entry can be garbage collected silently.", np: "WeakMap ले weak reference राख्ने भएकाले, key लाई अरू कुनैले reference नगरेपछि, key र त्यसको entry दुवै silently garbage collect हुन सक्छन्।", jp: "WeakMapは弱参照を持つため、他に何もキーを参照していなくなると、キーとそのエントリの両方が静かにガベージコレクトされ得る。" },
    },
    {
      question: { en: "What is a key limitation of WeakMap compared to Map?", np: "Map को तुलनामा WeakMap को मुख्य limitation के हो?", jp: "MapとWeakMapを比較したとき、WeakMapの主な制限は何？" },
      options: [{ en: "It's not iterable and has no .size property", np: "यो iterable छैन र यसमा .size property छैन", jp: "イテレート不可で.sizeプロパティもない" }, { en: "It can only store string keys", np: "यसले केवल string keys मात्र store गर्न सक्छ", jp: "文字列のキーしか格納できない" }],
      correctIndex: 0,
      explanation: { en: "WeakMap deliberately drops iteration and .size because the set of live entries can change at any time as the GC runs; its keys must be objects, not strings.", np: "GC चल्दा live entries को set जुनसुकै बेला बदलिन सक्ने भएकाले WeakMap ले जानाजानी iteration र .size हटाएको हो; यसका keys objects नै हुनुपर्छ, strings होइन।", jp: "GCが動くたびに生きているエントリの集合がいつでも変わり得るため、WeakMapは意図的にイテレーションと.sizeを省いている。そのキーはオブジェクトでなければならず、文字列ではない。" },
    },
  ],
};
