import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_18_LESSONS: JsLessonDay = {
  day: 18,
  title: { en: "Generators, iterators & async generators", np: "Generators, iterators र async generators", jp: "ジェネレータ・イテレータ" },
  totalMinutes: 27,
  difficulty: { en: "Advanced", np: "Advanced", jp: "上級" },
  lessons: [
    {
      id: "generator-functions",
      title: { en: "Generator Functions", np: "Generator Functions", jp: "ジェネレータ関数" },
      durationMinutes: 9,
      explanation: {
        en: "A generator function is declared with `function*` (a `*` right after `function`), and calling it does not run any code inside — it immediately returns a <b>generator object</b>, which is both an iterator and an iterable. Only when you call `.next()` on that generator object does execution begin, running until it hits a `yield` expression, at which point it pauses and hands back `{ value, done: false }` — the function's local state (variables, position) is frozen in place. Calling `.next()` again resumes execution exactly where it left off, continuing until the next `yield` or until the function returns, which produces a final `{ value: returnValue, done: true }`. This pause-and-resume ability is unique to generators; ordinary functions always run to completion in one go.\n\nBecause a generator produces values one at a time on demand, it's perfect for representing sequences that are lazy — computed only as far as someone actually asks. `for...of` and the spread operator (`[...gen()]`) both drive a generator automatically, calling `.next()` repeatedly until `done` is `true`. This lets you write an infinite generator like `naturals()` with a `while (true)` loop inside — it never actually finishes, but that's fine, because nothing forces it to run further than requested; a helper like `take(n, iterable)` can pull just the first `n` values and stop. Generators also support two-way communication: whatever value you pass into `next(value)` becomes the result of the `yield` expression that was paused, letting a caller feed data back into the generator's own logic (useful for interactive step-by-step computations like a `calculator()` generator).",
        np: "Generator function लाई `function*` (function पछि नै `*`) ले declare गरिन्छ, र यसलाई call गर्दा भित्रको कुनै code चल्दैन — बरु immediately एउटा <b>generator object</b> फर्काउँछ, जो iterator र iterable दुवै हो। त्यो generator object मा `.next()` call गरेपछि मात्र execution सुरु हुन्छ, जो `yield` expression भेट्टाउँदासम्म चल्छ, त्यसपछि pause भई `{ value, done: false }` फर्काउँछ — function को local state (variables, position) त्यहीँ freeze हुन्छ। फेरि `.next()` call गर्दा execution छोडेकै ठाउँबाट resume हुन्छ, अर्को `yield` सम्म वा function return नभएसम्म चल्छ, जसले final `{ value: returnValue, done: true }` produce गर्छ। यो pause-and-resume क्षमता generators मा मात्र हुन्छ; normal functions सधैं एकै पटकमा पूरा चल्छन्।\n\nGenerator ले values एक-एक गरी demand मा produce गर्ने भएकाले, यो lazy sequences (जति चाहियो त्यति मात्र compute हुने) represent गर्न उत्तम हुन्छ। `for...of` र spread operator (`[...gen()]`) दुवैले generator लाई automatic रूपमा drive गर्छन्, `done` `true` नभएसम्म repeatedly `.next()` call गर्छन्। यसैले `naturals()` जस्तो infinite generator भित्र `while (true)` loop राखी लेख्न सकिन्छ — यो कहिल्यै पूरा हुँदैन, तर त्यो ठीकै छ, किनकि माग नभएसम्म यो अगाडि चल्न बाध्य हुँदैन; `take(n, iterable)` जस्तो helper ले पहिलो `n` values मात्र लिएर रोकिन सक्छ। Generators ले two-way communication पनि support गर्छन्: `next(value)` मा pass गरेको जुनसुकै value रोकिएको `yield` expression को result बन्छ, जसले caller लाई generator को आफ्नै logic मा data फिर्ता feed गर्न दिन्छ (interactive step-by-step computations जस्तै `calculator()` generator का लागि उपयोगी)।",
        jp: "ジェネレータ関数は`function*`（functionの直後に`*`）で宣言し、これを呼び出しても内部のコードはすぐには実行されない — 代わりに即座に<b>ジェネレータオブジェクト</b>を返す。これはイテレータでありイテラブルでもある。そのジェネレータオブジェクトで`.next()`を呼んで初めて実行が始まり、`yield`式に達するまで進み、そこで一時停止して`{ value, done: false }`を返す — 関数のローカルな状態（変数、位置）はその場で凍結される。再度`.next()`を呼ぶと、止まった場所から実行が再開され、次の`yield`か関数がreturnするまで続き、最終的に`{ value: returnValue, done: true }`を生成する。この一時停止・再開できる能力はジェネレータ特有であり、通常の関数は常に一度で完了まで実行される。\n\nジェネレータは値を一つずつオンデマンドで生成するため、遅延シーケンス（実際に要求された分だけ計算される）を表現するのに最適。`for...of`とスプレッド演算子（`[...gen()]`）はどちらもジェネレータを自動的に駆動し、`done`が`true`になるまで`.next()`を繰り返し呼ぶ。これにより`naturals()`のような無限ジェネレータを内部に`while (true)`ループで書くことができる — 決して完了しないが、要求された分しか実行されないので問題ない。`take(n, iterable)`のようなヘルパーで最初の`n`個だけを取り出して止めることができる。ジェネレータは双方向通信もサポートする — `next(value)`に渡した値が、一時停止していた`yield`式の結果になり、呼び出し側がジェネレータ自身のロジックにデータを戻すことができる（`calculator()`ジェネレータのような対話的な段階的計算に便利）。",
      },
      diagram: `function* counter() {
  yield 1;    ┐
  yield 2;    │ paused here between calls
  yield 3;    ┘
  return "done";
}

const gen = counter();       ← creates generator object, NO code runs yet

gen.next()  → { value: 1, done: false }   ─┐
gen.next()  → { value: 2, done: false }    │ resumes exactly where it paused
gen.next()  → { value: 3, done: false }   ─┘
gen.next()  → { value: "done", done: true }  ← final return, done flips to true
gen.next()  → { value: undefined, done: true } ← nothing left

Infinite + lazy:
naturals()  while(true){ yield n++ }  →  1, 2, 3, 4, 5, ...  (never runs ahead of demand)
take(3, naturals())                   →  [1, 2, 3]            (pulls only what's needed)`,
      codeExample: {
        title: { en: "Generator functions, lazy infinite sequences and two-way values", np: "Generator functions, lazy infinite sequences र two-way values", jp: "ジェネレータ関数・遅延無限シーケンス・双方向の値" },
        code: `// ── Defining and running a generator ──────────────────────────────
function* countdown(from) {
  console.log("generator created, but nothing runs until .next()");
  while (from > 0) {
    yield from;   // pause here, hand back the current count
    from--;
  }
  return "liftoff!";
}

const gen = countdown(3);   // no console.log yet — just creates the generator object

gen.next();  // logs the setup message, then { value: 3, done: false }
gen.next();  // { value: 2, done: false }
gen.next();  // { value: 1, done: false }
gen.next();  // { value: "liftoff!", done: true }
gen.next();  // { value: undefined, done: true } — nothing left to give

// ── for...of and spread drive a generator automatically ───────────
for (const n of countdown(3)) {
  console.log(n);          // 3, 2, 1 (the "liftoff!" return value is ignored)
}

const steps = [...countdown(3)];   // [3, 2, 1]

// ── Infinite generators are safe because they're lazy ──────────────
function* naturals(start = 1) {
  let n = start;
  while (true) {           // looks dangerous, but it's fine — nothing forces it forward
    yield n++;
  }
}

function take(count, iterable) {
  const result = [];
  for (const value of iterable) {
    result.push(value);
    if (result.length === count) break;   // stop pulling — the generator just pauses forever
  }
  return result;
}

take(5, naturals());        // [1, 2, 3, 4, 5] — only 5 values were ever computed
take(3, naturals(100));     // [100, 101, 102]

// ── Two-way communication: next(value) feeds data back in ──────────
function* calculator() {
  const a = Number(yield "Enter first number:");
  const b = Number(yield "Enter second number:");
  return a + b;
}

const calc = calculator();
calc.next();        // { value: "Enter first number:", done: false }
calc.next("10");     // a = "10" — the yield expression resolves to "10"
calc.next("20");     // b = "20" — { value: 30, done: true }`,
      },
      keyTakeaways: [
        { en: "Calling a generator function doesn't run any code — it returns a generator object, and execution only begins (and pauses at each `yield`) once `.next()` is called.", np: "Generator function call गर्दा कुनै code चल्दैन — यसले generator object फर्काउँछ, र `.next()` call भएपछि मात्र execution सुरु हुन्छ (र हरेक `yield` मा pause हुन्छ)।", jp: "ジェネレータ関数を呼び出してもコードは実行されない — ジェネレータオブジェクトを返し、`.next()`が呼ばれて初めて実行が始まる（各`yield`で一時停止する）。" },
        { en: "Generators are lazy, so an infinite generator like `naturals()` is safe to write — it only ever computes as many values as something like `for...of`, spread, or a `take()` helper actually pulls.", np: "Generators lazy हुने भएकाले, `naturals()` जस्तो infinite generator लेख्नु safe छ — `for...of`, spread, वा `take()` जस्तो helper ले जति values actually pull गर्छ त्यति मात्र compute हुन्छ।", jp: "ジェネレータは遅延評価されるため、`naturals()`のような無限ジェネレータを書いても安全 — `for...of`・スプレッド・`take()`のようなヘルパーが実際に取り出した分だけ計算される。" },
        { en: "Passing a value into `next(value)` becomes the result of the paused `yield` expression, giving two-way communication between the caller and the generator's own code.", np: "`next(value)` मा pass गरेको value रोकिएको `yield` expression को result बन्छ, जसले caller र generator को आफ्नै code बीच two-way communication दिन्छ।", jp: "`next(value)`に渡した値は一時停止していた`yield`式の結果になり、呼び出し側とジェネレータ自身のコードの間で双方向通信ができる。" },
      ],
      commonMistakes: [
        { en: "Expecting a generator function call like `counter()` to run its body immediately, forgetting that nothing executes until the first `.next()` call.", np: "`counter()` जस्तो generator function call ले immediately body चलाउँछ भन्ने आशा गर्नु, पहिलो `.next()` call नभएसम्म केही execute नहुने कुरा बिर्सनु।", jp: "`counter()`のようなジェネレータ関数呼び出しがすぐに本体を実行すると思い込み、最初の`.next()`呼び出しまで何も実行されないことを忘れること。" },
        { en: "Writing an infinite generator with `while (true)` but consuming it with a plain `for...of` loop and no `break`, causing the loop to run forever instead of using `take()` or an explicit exit condition.", np: "`while (true)` सँग infinite generator लेखेर plain `for...of` loop ले (कुनै `break` बिना) consume गर्नु, जसले loop लाई `take()` वा explicit exit condition प्रयोग नगरी सधैंभरि चलाउँछ।", jp: "`while (true)`で無限ジェネレータを書いたのに、`break`なしの通常の`for...of`ループで消費し、`take()`や明示的な終了条件を使わずループを永遠に走らせてしまうこと。" },
        { en: "Forgetting that the value returned by a generator's `return` statement shows up once, alongside `done: true`, and is silently ignored by `for...of` and spread — only explicit `.next()` calls see it.", np: "Generator को `return` statement ले फर्काउने value एक पटक मात्र `done: true` सँगै देखिन्छ, र `for...of`/spread ले silently ignore गर्छ भन्ने बिर्सनु — explicit `.next()` calls ले मात्र त्यो देख्छन्।", jp: "ジェネレータの`return`文が返す値は`done: true`と共に一度だけ現れ、`for...of`やスプレッドには黙って無視されることを忘れること — 明示的な`.next()`呼び出しだけがそれを見られる。" },
      ],
      quiz: [
        {
          question: { en: "What does calling a generator function (e.g. `counter()`) do?", np: "`counter()` जस्तो generator function call गर्दा के हुन्छ?", jp: "`counter()`のようなジェネレータ関数を呼び出すと何が起きる？" },
          options: [
            { en: "Returns a generator object immediately, without running any code inside", np: "भित्रको कुनै code नचलाई immediately generator object फर्काउँछ", jp: "内部のコードを何も実行せず、即座にジェネレータオブジェクトを返す" },
            { en: "Runs the function body immediately, like a normal function call", np: "normal function call जस्तै immediately function body चलाउँछ", jp: "通常の関数呼び出しのように、すぐに関数本体を実行する" },
          ],
          correctIndex: 0,
          explanation: { en: "Calling a generator function only creates the generator object; the body doesn't start executing until `.next()` is called for the first time.", np: "Generator function call गर्दा केवल generator object बन्छ; पहिलो पटक `.next()` call नभएसम्म body execute हुन थाल्दैन।", jp: "ジェネレータ関数を呼び出すとジェネレータオブジェクトが作られるだけ。最初に`.next()`が呼ばれるまで本体の実行は始まらない。" },
        },
        {
          question: { en: "Why is it safe to write an infinite generator like `naturals()` with a `while (true)` loop inside?", np: "`naturals()` जस्तो infinite generator भित्र `while (true)` loop राखेर लेख्नु किन safe छ?", jp: "`naturals()`のような無限ジェネレータを`while (true)`ループで書いても安全なのはなぜ？" },
          options: [
            { en: "Because it only computes a new value each time `.next()` is actually called", np: "किनकि यसले actual `.next()` call हुँदा मात्र नयाँ value compute गर्छ", jp: "実際に`.next()`が呼ばれたときだけ新しい値を計算するから" },
            { en: "Because JavaScript automatically limits generators to a fixed number of iterations", np: "किनकि JavaScript ले generators लाई fixed number of iterations मा automatic रूपमा limit गर्छ", jp: "JavaScriptがジェネレータの反復回数を自動的に制限するから" },
          ],
          correctIndex: 0,
          explanation: { en: "A generator pauses at each `yield`; nothing runs further until something (for...of, spread, take()) asks for the next value, so an infinite loop never actually blocks anything.", np: "Generator हरेक `yield` मा pause हुन्छ; कोहीले (for...of, spread, take()) अर्को value नमागेसम्म अगाडि चल्दैन, त्यसैले infinite loop ले कहिल्यै वास्तवमा block गर्दैन।", jp: "ジェネレータは各`yield`で一時停止する。for...of・スプレッド・take()などが次の値を要求するまで先へは進まないため、無限ループが実際に何かをブロックすることはない。" },
        },
        {
          question: { en: "In the `calculator()` generator, what does the value passed to `calc.next(10)` become?", np: "`calculator()` generator मा, `calc.next(10)` मा pass गरेको value के बन्छ?", jp: "`calculator()`ジェネレータで、`calc.next(10)`に渡した値は何になる？" },
          options: [
            { en: "The result of the `yield` expression that was paused, waiting to be assigned", np: "assign हुन कुर्दै रोकिएको `yield` expression को result", jp: "代入されるのを待って一時停止していた`yield`式の結果" },
            { en: "The next value that will be yielded back out immediately", np: "तुरुन्तै फेरि yield भई बाहिर आउने अर्को value", jp: "すぐに再度yieldされて外に出る次の値" },
          ],
          correctIndex: 0,
          explanation: { en: "next(value) resumes the paused yield expression with that value as its result — it flows INTO the generator's own code, it isn't yielded back out.", np: "next(value) ले रोकिएको yield expression लाई त्यो value लाई result को रूपमा दिएर resume गर्छ — यो generator को आफ्नै code भित्र जान्छ, फेरि बाहिर yield हुँदैन।", jp: "next(value)は一時停止していたyield式をその値を結果として再開させる — ジェネレータ自身のコードの中に流れ込むのであり、再びyieldされて外に出るわけではない。" },
        },
      ],
    },
    {
      id: "iterators-protocol",
      title: { en: "Iterators & the Iterator Protocol", np: "Iterators र Iterator Protocol", jp: "イテレータとイテレータプロトコル" },
      durationMinutes: 9,
      explanation: {
        en: "An object is <b>iterable</b> if it has a method named `[Symbol.iterator]()` that returns an <b>iterator</b> — and an iterator, in turn, is simply any object with a `next()` method that returns `{ value, done }` on every call. That's the entire protocol: two small, well-defined shapes that any object can implement, with no inheritance or special base class required. `for...of`, the spread operator, array/object destructuring, and `Promise.all` all rely on this same protocol internally — they call `[Symbol.iterator]()` once to get an iterator, then call `.next()` repeatedly until `done` is `true`, using each `value` along the way.\n\nArrays, strings, `Map`s, `Set`s, and generator objects are all built-in iterables — each already has a working `[Symbol.iterator]()`, which is why `for...of` works on all of them without any setup. You can make your own class iterable in two ways. The manual way is to implement `[Symbol.iterator]()` yourself, returning a plain object literal with its own `next()` method that tracks state via closures — verbose, but it works in any environment. The much shorter way is to make `[Symbol.iterator]()` itself a <b>generator method</b> (written as `*[Symbol.iterator]() { ... }`), since a generator object already satisfies the iterator shape automatically — you just `yield` the values you want and the protocol is handled for you.",
        np: "कुनै object <b>iterable</b> हुन्छ यदि यसमा `[Symbol.iterator]()` नाम को method छ जसले <b>iterator</b> फर्काउँछ — र iterator भनेको सिधै हरेक call मा `{ value, done }` फर्काउने `next()` method भएको कुनै पनि object हो। यही नै पूरा protocol हो: दुई सानो, राम्रोसँग-defined shapes जुन कुनै पनि object ले implement गर्न सक्छ, कुनै inheritance वा special base class चाहिँदैन। `for...of`, spread operator, array/object destructuring, र `Promise.all` सबैले भित्रभित्रै यही protocol मा भर पर्छन् — तिनले `[Symbol.iterator]()` एक पटक call गरी iterator लिन्छन्, त्यसपछि `done` `true` नभएसम्म repeatedly `.next()` call गर्छन्, बाटोमा हरेक `value` प्रयोग गर्छन्।\n\nArrays, strings, `Map`s, `Set`s, र generator objects सबै built-in iterables हुन् — हरेकमा पहिले नै काम गर्ने `[Symbol.iterator]()` हुन्छ, त्यसैले `for...of` तिनी सबैमा कुनै setup बिना काम गर्छ। तपाईंले आफ्नै class लाई दुई तरिकाले iterable बनाउन सक्नुहुन्छ। Manual तरिका भनेको `[Symbol.iterator]()` आफैं implement गर्नु, closures मार्फत state track गर्ने आफ्नै `next()` method भएको plain object literal फर्काउनु — verbose, तर जुनसुकै environment मा काम गर्छ। धेरै छोटो तरिका भनेको `[Symbol.iterator]()` लाई नै एउटा <b>generator method</b> बनाउनु (`*[Symbol.iterator]() { ... }` को रूपमा लेखिने), किनकि generator object पहिले नै automatically iterator shape पूरा गर्छ — तपाईंले चाहिने values `yield` गर्नुपर्छ मात्र र protocol आफैं handle हुन्छ।",
        jp: "オブジェクトが<b>イテラブル</b>であるとは、`[Symbol.iterator]()`という名前のメソッドを持ち、それが<b>イテレータ</b>を返すことを意味する — そしてイテレータとは、単に呼び出しごとに`{ value, done }`を返す`next()`メソッドを持つオブジェクトである。これがプロトコル全体であり、継承や特別な基底クラスを必要とせず、どのオブジェクトでも実装できる2つの小さく明確に定義された形だけ。`for...of`・スプレッド演算子・配列/オブジェクトの分割代入・`Promise.all`はすべて内部でこの同じプロトコルに依存している — 一度`[Symbol.iterator]()`を呼んでイテレータを取得し、`done`が`true`になるまで`.next()`を繰り返し呼び、その都度の`value`を使う。\n\n配列・文字列・`Map`・`Set`・ジェネレータオブジェクトはすべて組み込みのイテラブル — それぞれすでに動作する`[Symbol.iterator]()`を持っているため、`for...of`はセットアップなしにすべてで動作する。独自のクラスをイテラブルにする方法は2つある。手動の方法は`[Symbol.iterator]()`を自分で実装し、クロージャで状態を追跡する独自の`next()`メソッドを持つプレーンなオブジェクトリテラルを返すこと — 冗長だが、どの環境でも動作する。もっと短い方法は`[Symbol.iterator]()`自体を<b>ジェネレータメソッド</b>にすること（`*[Symbol.iterator]() { ... }`と書く）。ジェネレータオブジェクトはすでに自動的にイテレータの形を満たしているため、欲しい値を`yield`するだけでプロトコルは自動的に処理される。",
      },
      diagram: `Iterable                              Iterator
┌───────────────────────┐            ┌──────────────────────────┐
│ [Symbol.iterator]()   ─┼──returns──►│ next() → { value, done } │
└───────────────────────┘            └──────────────────────────┘

Built-in iterables:  Array, String, Map, Set, generator objects

for...of / [...x] / { ...destructure } all do this under the hood:
  const it = x[Symbol.iterator]();
  let step = it.next();
  while (!step.done) {
    use(step.value);
    step = it.next();
  }

Custom class — two ways to plug into the protocol:

  [Symbol.iterator]() {              *[Symbol.iterator]() {
    let i = start;                     for (let i = start; i <= end; i++) {
    return { next() { ... } };           yield i;
  }                                     }
  ← manual object + next()           }  ← generator does it automatically`,
      codeExample: {
        title: { en: "The iterator protocol and two ways to implement it", np: "Iterator protocol र यसलाई implement गर्ने दुई तरिका", jp: "イテレータプロトコルとその2つの実装方法" },
        code: `// ── The protocol itself ─────────────────────────────────────────────
// iterable:  has [Symbol.iterator]() that returns an iterator
// iterator:  has next() that returns { value, done }

const arr = ["a", "b", "c"];
const it = arr[Symbol.iterator]();   // get the iterator manually
it.next();  // { value: "a", done: false }
it.next();  // { value: "b", done: false }
it.next();  // { value: "c", done: false }
it.next();  // { value: undefined, done: true }

// for...of, spread, and destructuring all call [Symbol.iterator]() for you
for (const letter of "abc") console.log(letter);   // a, b, c
const [firstEntry] = new Map([["x", 1], ["y", 2]]); // ["x", 1]

// ── Manual way: implement [Symbol.iterator]() yourself ──────────────
class Countdown {
  constructor(from) {
    this.from = from;
  }

  [Symbol.iterator]() {
    let current = this.from;         // closure keeps track of position

    return {
      next() {
        if (current > 0) {
          return { value: current--, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  }
}

[...new Countdown(3)];                        // [3, 2, 1]
for (const n of new Countdown(3)) console.log(n);  // 3, 2, 1

// ── Shortcut: make [Symbol.iterator]() itself a generator ───────────
class Countdown2 {
  constructor(from) {
    this.from = from;
  }

  *[Symbol.iterator]() {             // note the * — this method IS the iterator
    for (let n = this.from; n > 0; n--) {
      yield n;
    }
  }
}

[...new Countdown2(3)];              // [3, 2, 1] — same result, far less code`,
      },
      keyTakeaways: [
        { en: "The iterator protocol is just two shapes: an iterable has `[Symbol.iterator]()` that returns an iterator, and an iterator has `next()` returning `{ value, done }`.", np: "Iterator protocol भनेको दुई मात्र shapes हो: iterable मा `[Symbol.iterator]()` हुन्छ जो iterator फर्काउँछ, र iterator मा `next()` हुन्छ जो `{ value, done }` फर्काउँछ।", jp: "イテレータプロトコルはたった2つの形だけ — イテラブルはイテレータを返す`[Symbol.iterator]()`を持ち、イテレータは`{ value, done }`を返す`next()`を持つ。" },
        { en: "`for...of`, spread, and destructuring don't have any special knowledge of arrays — they just call `[Symbol.iterator]()` and drive `.next()` until `done` is `true`, so they work on any conforming object.", np: "`for...of`, spread, र destructuring लाई arrays को कुनै special ज्ञान हुँदैन — तिनले केवल `[Symbol.iterator]()` call गर्छन् र `done` `true` नभएसम्म `.next()` drive गर्छन्, त्यसैले यी protocol पूरा गर्ने कुनै पनि object मा काम गर्छन्।", jp: "`for...of`・スプレッド・分割代入は配列について特別な知識を持っているわけではない — 単に`[Symbol.iterator]()`を呼び、`done`が`true`になるまで`.next()`を駆動するだけなので、このプロトコルに従う任意のオブジェクトで動作する。" },
        { en: "Making `[Symbol.iterator]()` itself a generator method (`*[Symbol.iterator]() { ... }`) is far shorter than manually returning an object with your own `next()`, because the generator already satisfies the iterator shape.", np: "`[Symbol.iterator]()` लाई नै generator method (`*[Symbol.iterator]() { ... }`) बनाउनु आफैं `next()` भएको object manually फर्काउनु भन्दा धेरै छोटो हुन्छ, किनकि generator ले पहिले नै iterator shape पूरा गर्छ।", jp: "`[Symbol.iterator]()`自体をジェネレータメソッド（`*[Symbol.iterator]() { ... }`）にする方が、独自の`next()`を持つオブジェクトを手動で返すより遥かに短い。ジェネレータはすでにイテレータの形を満たしているから。" },
      ],
      commonMistakes: [
        { en: "Implementing `[Symbol.iterator]()` to return `this` when the object itself doesn't have a `next()` method, instead of returning a proper iterator object (or delegating to a generator).", np: "Object आफैंमा `next()` method नभएको बेला `[Symbol.iterator]()` ले `this` फर्काउने implement गर्नु, त्यसको सट्टा सही iterator object फर्काउनु (वा generator मा delegate गर्नु) पर्ने।", jp: "オブジェクト自身に`next()`メソッドがないのに`[Symbol.iterator]()`が`this`を返すよう実装すること — 適切なイテレータオブジェクトを返す（またはジェネレータに委譲する）べき。" },
        { en: "Forgetting the `*` when trying to use a generator as `[Symbol.iterator]()`, which silently makes the method a regular function that returns `undefined` instead of an iterator.", np: "Generator लाई `[Symbol.iterator]()` को रूपमा प्रयोग गर्दा `*` बिर्सनु, जसले method लाई silently एउटा normal function बनाउँछ जो iterator को सट्टा `undefined` फर्काउँछ।", jp: "ジェネレータを`[Symbol.iterator]()`として使う際に`*`を忘れること。これによりメソッドは黙って通常の関数になり、イテレータではなく`undefined`を返す。" },
        { en: "Assuming every array-like object (such as a plain `{ length, 0: ..., 1: ... }` object) is automatically iterable — it isn't, unless it also implements `[Symbol.iterator]()`.", np: "हरेक array-like object (जस्तै plain `{ length, 0: ..., 1: ... }` object) automatic रूपमा iterable हुन्छ भन्ने ठान्नु — यसले `[Symbol.iterator]()` पनि implement नगरेसम्म त्यो होइन।", jp: "すべての配列風オブジェクト（`{ length, 0: ..., 1: ... }`のようなプレーンオブジェクト）が自動的にイテラブルだと思い込むこと — `[Symbol.iterator]()`も実装しない限りそうではない。" },
      ],
      quiz: [
        {
          question: { en: "What two things does an object need to be considered an \"iterator\" (not iterable, the iterator itself)?", np: "Object लाई \"iterator\" (iterable होइन, iterator आफैं) मानिनको लागि के चाहिन्छ?", jp: "オブジェクトが「イテレータ」（イテラブルではなくイテレータ自体）とみなされるために必要なものは？" },
          options: [
            { en: "A `next()` method that returns `{ value, done }`", np: "`{ value, done }` फर्काउने `next()` method", jp: "`{ value, done }`を返す`next()`メソッド" },
            { en: "A `length` property and numeric indices", np: "`length` property र numeric indices", jp: "`length`プロパティと数値インデックス" },
          ],
          correctIndex: 0,
          explanation: { en: "The iterator shape is defined purely by having a next() method with that return shape — nothing about length or indices is required.", np: "Iterator को shape त्यो return shape भएको next() method ले मात्र defined हुन्छ — length वा indices चाहिँदैन।", jp: "イテレータの形は、その戻り値の形を持つnext()メソッドがあることだけで定義される — lengthやインデックスは不要。" },
        },
        {
          question: { en: "What do `for...of`, spread, and destructuring have in common, protocol-wise?", np: "Protocol हिसाबले `for...of`, spread, र destructuring मा के common छ?", jp: "プロトコル的に`for...of`・スプレッド・分割代入に共通するものは？" },
          options: [
            { en: "They all call `[Symbol.iterator]()` internally and drive `.next()` until done", np: "तिनीहरू सबैले भित्रभित्रै `[Symbol.iterator]()` call गर्छन् र done नभएसम्म `.next()` drive गर्छन्", jp: "すべて内部で`[Symbol.iterator]()`を呼び、doneになるまで`.next()`を駆動する" },
            { en: "They only work on native Arrays, never on custom classes", np: "तिनीहरू केवल native Arrays मा मात्र काम गर्छन्, custom classes मा कहिल्यै गर्दैनन्", jp: "ネイティブの配列でしか動作せず、カスタムクラスでは決して動作しない" },
          ],
          correctIndex: 0,
          explanation: { en: "All three rely on the same iterator protocol rather than having special-cased knowledge of arrays, so any conforming object works with all of them.", np: "यी तीनैले arrays को special knowledge राख्नुको सट्टा उही iterator protocol मा भर पर्छन्, त्यसैले protocol पूरा गर्ने कुनै पनि object मा यी सबैले काम गर्छन्।", jp: "この3つは配列についての特別な知識を持つのではなく、同じイテレータプロトコルに依存しているため、プロトコルに従う任意のオブジェクトで動作する。" },
        },
        {
          question: { en: "What is the shorter way to make a custom class iterable, compared to manually implementing `[Symbol.iterator]()` with your own `next()`?", np: "आफ्नै `next()` सँग manually `[Symbol.iterator]()` implement गर्नुको तुलनामा custom class लाई iterable बनाउने छोटो तरिका के हो?", jp: "独自の`next()`で手動で`[Symbol.iterator]()`を実装するのに比べ、カスタムクラスをイテラブルにする短い方法は？" },
          options: [
            { en: "Make `[Symbol.iterator]()` itself a generator method with `*[Symbol.iterator]() { ... }`", np: "`[Symbol.iterator]()` लाई नै `*[Symbol.iterator]() { ... }` सँग generator method बनाउनु", jp: "`[Symbol.iterator]()`自体を`*[Symbol.iterator]() { ... }`というジェネレータメソッドにする" },
            { en: "Add a `length` property so JavaScript infers iteration automatically", np: "`length` property थप्नु ताकि JavaScript ले automatic रूपमा iteration infer गरोस्", jp: "`length`プロパティを追加してJavaScriptが自動的にイテレーションを推測するようにする" },
          ],
          correctIndex: 0,
          explanation: { en: "A generator method already returns an object satisfying the iterator shape, so you only need to yield values instead of writing your own next() by hand.", np: "Generator method ले पहिले नै iterator shape पूरा गर्ने object फर्काउँछ, त्यसैले आफ्नै next() हातले लेख्नुको सट्टा values yield गर्नु मात्र पर्छ।", jp: "ジェネレータメソッドはすでにイテレータの形に一致するものを返すため、自分でnext()を書く代わりに値をyieldするだけでよい。" },
        },
      ],
    },
    {
      id: "async-generators",
      title: { en: "Async Generators — Lazy Async Sequences", np: "Async Generators — Lazy Async Sequences", jp: "非同期ジェネレータ — 遅延非同期シーケンス" },
      durationMinutes: 9,
      explanation: {
        en: "An <b>async generator</b> is declared with `async function*`, combining the two capabilities you've just learned: like a regular generator, it can `yield` multiple values over time and pause between them; like an `async` function, its body can `await` Promises before producing each value. Calling one still just creates an async generator object without running any code, but now each step of iteration itself returns a Promise instead of a plain `{ value, done }` object — which is why you consume it with `for await...of` instead of a plain `for...of`. This makes async generators the natural fit for pagination: a `paginate(url)` generator can `await fetch(nextUrl)`, `yield` that page's items, then loop around and fetch the next page only once the caller has asked for more.\n\nInside an async generator, `yield*` delegates to another (async) generator's values one at a time, which is useful for flattening a generator-of-pages into a generator-of-individual-items without manually looping — a `flatPaginate()` generator can `yield*` each page it receives from `paginate()`. Because `for await...of` is a normal loop, `break` works exactly as you'd expect and stops pulling further pages, which means an async generator never fetches data the caller didn't end up needing. The bigger idea tying all of this together: generators solve \"produce values over time,\" Promises solve \"this value requires waiting,\" and async generators are simply both problems solved by the same mechanism — ideal for streaming or paginated data you don't want to load into memory all at once.",
        np: "<b>Async generator</b> लाई `async function*` ले declare गरिन्छ, जसले तपाईंले भर्खरै सिकेका दुई क्षमता combine गर्छ: regular generator जस्तै, यसले समयसँगै multiple values `yield` गर्न सक्छ र बीचमा pause हुन्छ; `async` function जस्तै, यसको body ले हरेक value produce गर्नु अघि Promises `await` गर्न सक्छ। Call गर्दा अझै पनि कुनै code नचलाई एउटा async generator object मात्र बन्छ, तर अब iteration को हरेक step आफैंले plain `{ value, done }` object को सट्टा एउटा Promise फर्काउँछ — त्यसैले यसलाई plain `for...of` को सट्टा `for await...of` ले consume गरिन्छ। यसले async generators लाई pagination का लागि natural fit बनाउँछ: `paginate(url)` generator ले `await fetch(nextUrl)` गर्न सक्छ, त्यो page का items `yield` गर्न सक्छ, त्यसपछि caller ले थप माग्दा मात्र अर्को page fetch गर्न loop गर्न सक्छ।\n\nAsync generator भित्र, `yield*` ले अर्को (async) generator को values एक-एक गरी delegate गर्छ, जो pages-को-generator लाई manually loop नगरी individual-items-को-generator मा flatten गर्न उपयोगी हुन्छ — `flatPaginate()` generator ले `paginate()` बाट पाएको हरेक page `yield*` गर्न सक्छ। `for await...of` एक normal loop भएकोले, `break` ठीक तपाईंले सोचेजस्तै काम गर्छ र थप pages pull हुनबाट रोक्छ, जसको अर्थ async generator ले caller लाई अन्तिममा नचाहिने data कहिल्यै fetch गर्दैन। यी सबैलाई जोड्ने ठूलो idea यही हो: generators ले \"समयसँगै values produce गर्ने\" समस्या solve गर्छन्, Promises ले \"यो value कुर्नुपर्छ\" समस्या solve गर्छन्, र async generators ले दुवै समस्या एउटै mechanism ले solve गर्छन् — streaming वा paginated data का लागि उत्तम जो एकैसाथ memory मा load गर्न मन नपराइने हो।",
        jp: "<b>async generator</b>は`async function*`で宣言され、これまで学んだ2つの能力を組み合わせる — 通常のジェネレータのように、時間をかけて複数の値を`yield`し、その間で一時停止できる。`async`関数のように、本体は各値を生成する前にPromiseを`await`できる。呼び出してもまだコードは実行されず、async generatorオブジェクトが作られるだけだが、今度はイテレーションの各ステップ自体が単なる`{ value, done }`オブジェクトではなくPromiseを返す — そのため通常の`for...of`ではなく`for await...of`で消費する。これによりasync generatorはページングに自然に適合する — `paginate(url)`ジェネレータは`await fetch(nextUrl)`を行い、そのページのアイテムを`yield`し、呼び出し側がさらに要求したときだけループして次のページを取得できる。\n\nasync generatorの内部では、`yield*`が別の（async）ジェネレータの値を一つずつ委譲する。これはページのジェネレータを手動でループせずに個々のアイテムのジェネレータへフラット化するのに便利 — `flatPaginate()`ジェネレータは`paginate()`から受け取った各ページを`yield*`できる。`for await...of`は通常のループなので、`break`は期待通りに動作し、それ以上のページの取得を止める。つまりasync generatorは、呼び出し側が結局必要としなかったデータを決して取得しない。これら全てをつなぐ大きな考え方はこうだ — ジェネレータは「時間をかけて値を生成する」問題を解決し、Promiseは「この値は待つ必要がある」問題を解決する。async generatorは単に両方の問題を同じ仕組みで解決するものであり、一度にメモリへロードしたくないストリーミングやページングされたデータに最適。",
      },
      diagram: `async function* paginate(url) {
  while (url) {
    const page = await fetch(url);   ← WAITS (Promise)
    yield page.items;                ← PAUSES (generator)
    url = page.nextUrl;
  }
}

for await (const items of paginate(url)) {
  ...                    ← each step: await the Promise, THEN get { value, done }
  break;                 ← stops early, next page is never fetched
}

yield* delegation:
  flatPaginate()  →  for await (page of paginate(url)) { yield* page; }
                      pages: [A,B] [C,D] [E]   →   items: A, B, C, D, E  (one at a time)

Generators          →  "produce values over time"
Promises            →  "this value requires waiting"
Async generators    →  both, combined`,
      codeExample: {
        title: { en: "Async generators for lazy, paginated data streams", np: "Lazy, paginated data streams का लागि async generators", jp: "遅延ページングデータストリームのためのasync generator" },
        code: `// ── Async generator — fetch one page at a time ─────────────────────
async function* paginate(url) {
  let nextUrl = url;

  while (nextUrl) {
    const response = await fetch(nextUrl);   // await works fine inside a generator
    const page     = await response.json();

    yield page.items;                        // hand back this page, then pause

    nextUrl = page.nextUrl ?? null;          // resumes here on the next .next() call
  }
}

// ── Consuming with for await...of ───────────────────────────────────
for await (const items of paginate("/api/products?page=1")) {
  console.log("Got a page with", items.length, "items");
  // The next page is only fetched once this loop asks for more
}

// ── yield* delegates into another (async) generator ─────────────────
async function* flatPaginate(url) {
  for await (const page of paginate(url)) {
    yield* page;          // yield every item in this page individually
  }
}

for await (const product of flatPaginate("/api/products")) {
  console.log(product.name);   // one product at a time, across all pages
}

// ── break stops pulling further pages entirely ──────────────────────
async function firstNProducts(n) {
  const results = [];

  for await (const product of flatPaginate("/api/products")) {
    results.push(product);
    if (results.length === n) break;   // later pages are simply never fetched
  }

  return results;
}

const firstFive = await firstNProducts(5);`,
      },
      keyTakeaways: [
        { en: "`async function*` combines generators and Promises: the function can `yield` values over time, and can `await` before producing each one, which is why it's consumed with `for await...of` instead of `for...of`.", np: "`async function*` ले generators र Promises combine गर्छ: function ले समयसँगै values `yield` गर्न सक्छ, र हरेक produce गर्नु अघि `await` गर्न सक्छ, त्यसैले यसलाई `for...of` को सट्टा `for await...of` ले consume गरिन्छ।", jp: "`async function*`はジェネレータとPromiseを組み合わせる — 関数は時間をかけて値を`yield`でき、各値を生成する前に`await`できるため、`for...of`ではなく`for await...of`で消費する。" },
        { en: "`yield*` delegates into another (async) generator's values one at a time, letting you flatten a generator-of-pages into a generator-of-individual-items without a manual nested loop.", np: "`yield*` ले अर्को (async) generator को values एक-एक गरी delegate गर्छ, जसले manual nested loop बिना pages-को-generator लाई individual-items-को-generator मा flatten गर्न दिन्छ।", jp: "`yield*`は別の（async）ジェネレータの値を一つずつ委譲し、手動のネストループなしにページのジェネレータを個々のアイテムのジェネレータへフラット化できる。" },
        { en: "Because `for await...of` supports `break` like any loop, an async generator like a paginated `fetch()` stream never fetches pages the caller didn't end up asking for.", np: "`for await...of` ले कुनै पनि loop जस्तै `break` support गर्ने भएकाले, paginated `fetch()` stream जस्तो async generator ले caller ले अन्तिममा नमागेका pages कहिल्यै fetch गर्दैन।", jp: "`for await...of`は他のループと同様に`break`をサポートするため、ページングされた`fetch()`ストリームのようなasync generatorは、呼び出し側が結局要求しなかったページを決して取得しない。" },
      ],
      commonMistakes: [
        { en: "Trying to consume an async generator with a plain `for...of` loop instead of `for await...of`, which fails because each step now resolves to a Promise rather than a plain `{ value, done }` object.", np: "Async generator लाई `for await...of` को सट्टा plain `for...of` loop ले consume गर्न खोज्नु, जो fail हुन्छ किनकि अब हरेक step plain `{ value, done }` object को सट्टा Promise मा resolve हुन्छ।", jp: "async generatorを`for await...of`ではなく通常の`for...of`ループで消費しようとすること — 各ステップが今は単なる`{ value, done }`オブジェクトではなくPromiseに解決されるため失敗する。" },
        { en: "Using `yield` instead of `yield*` when delegating into another generator's values, which yields the entire inner iterable as one value instead of each item individually.", np: "अर्को generator को values मा delegate गर्दा `yield*` को सट्टा `yield` प्रयोग गर्नु, जसले हरेक item individually को सट्टा भित्री सम्पूर्ण iterable लाई एउटै value को रूपमा yield गर्छ।", jp: "別のジェネレータの値に委譲する際に`yield*`ではなく`yield`を使うこと — これは各アイテムを個別にではなく、内側のイテラブル全体を1つの値としてyieldしてしまう。" },
        { en: "Assuming an async generator eagerly fetches every page up front — it doesn't; each page is only requested when the consuming loop actually asks for the next value.", np: "Async generator ले सुरुमै सबै pages eagerly fetch गर्छ भन्ने ठान्नु — यसले गर्दैन; consuming loop ले actual रूपमा अर्को value नमागेसम्म हरेक page request गरिँदैन।", jp: "async generatorが最初にすべてのページを積極的に取得すると思い込むこと — そうではない。消費側のループが実際に次の値を要求したときだけ各ページがリクエストされる。" },
      ],
      quiz: [
        {
          question: { en: "Why must you use `for await...of` instead of `for...of` to consume an async generator?", np: "Async generator consume गर्न `for...of` को सट्टा `for await...of` किन प्रयोग गर्नुपर्छ?", jp: "async generatorを消費するのに`for...of`ではなく`for await...of`を使わなければならないのはなぜ？" },
          options: [
            { en: "Because each step of iteration resolves to a Promise instead of a plain `{ value, done }` object", np: "किनकि iteration को हरेक step plain `{ value, done }` object को सट्टा Promise मा resolve हुन्छ", jp: "イテレーションの各ステップが単なる`{ value, done }`オブジェクトではなくPromiseに解決されるため" },
            { en: "Because async generators don't support the spread operator", np: "किनकि async generators ले spread operator support गर्दैनन्", jp: "async generatorがスプレッド演算子をサポートしていないため" },
          ],
          correctIndex: 0,
          explanation: { en: "An async generator's iteration steps are Promises, so the loop needs to await each one before reading value/done — that's exactly what for await...of does.", np: "Async generator को iteration steps Promises हुन्, त्यसैले loop ले value/done पढ्नु अघि हरेक await गर्नुपर्छ — for await...of ले ठीक त्यही गर्छ।", jp: "async generatorのイテレーションステップはPromiseなので、ループはvalue/doneを読む前に各Promiseをawaitする必要がある — for await...ofはまさにそれを行う。" },
        },
        {
          question: { en: "What does `yield*` do when used inside one generator to delegate into another?", np: "एक generator भित्र अर्कोलाई delegate गर्न प्रयोग गर्दा `yield*` ले के गर्छ?", jp: "あるジェネレータの内部で別のジェネレータに委譲するために使われる`yield*`は何をする？" },
          options: [
            { en: "Yields each value from the inner generator individually, one at a time", np: "भित्री generator बाट हरेक value व्यक्तिगत रूपमा एक-एक गरी yield गर्छ", jp: "内側のジェネレータの各値を個別に一つずつyieldする" },
            { en: "Yields the entire inner generator as a single combined value", np: "सम्पूर्ण भित्री generator लाई एउटै combined value को रूपमा yield गर्छ", jp: "内側のジェネレータ全体を1つの結合された値としてyieldする" },
          ],
          correctIndex: 0,
          explanation: { en: "yield* forwards each value the inner generator produces one by one, as if the outer generator had yielded them directly itself.", np: "yield* ले भित्री generator ले produce गर्ने हरेक value एक-एक गरी forward गर्छ, जस्तो कि बाहिरी generator आफैंले तिनीहरूलाई directly yield गरेको हो।", jp: "yield*は内側のジェネレータが生成する各値を一つずつ転送する。まるで外側のジェネレータが直接それらをyieldしたかのように。" },
        },
        {
          question: { en: "If you `break` out of a `for await...of` loop over a paginated async generator early, what happens to later pages?", np: "Paginated async generator मा `for await...of` loop बाट early `break` गरेमा, पछिका pages लाई के हुन्छ?", jp: "ページングされたasync generatorに対する`for await...of`ループを早めに`break`した場合、後のページはどうなる？" },
          options: [
            { en: "They are never fetched, since the generator only fetches a page when asked for the next value", np: "ती कहिल्यै fetch हुँदैनन्, किनकि generator ले अर्को value मागिएमा मात्र page fetch गर्छ", jp: "ジェネレータは次の値が要求されたときだけページを取得するため、決して取得されない" },
            { en: "They were already fetched in the background before the break", np: "ती break हुनु अघि नै background मा fetch भइसकेका हुन्छन्", jp: "breakする前にすでにバックグラウンドで取得されていた" },
          ],
          correctIndex: 0,
          explanation: { en: "An async generator is lazy just like a synchronous one — breaking the consuming loop simply stops the generator from resuming, so no further fetch() calls happen.", np: "Async generator पनि synchronous जस्तै lazy हुन्छ — consuming loop break गर्नाले generator लाई resume हुनबाट रोक्छ, त्यसैले थप fetch() calls हुँदैनन्।", jp: "async generatorも同期的なものと同様に遅延評価される — 消費側のループをbreakすると単にジェネレータの再開が止まるだけなので、それ以上のfetch()呼び出しは発生しない。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "When you call a generator function like `naturals()`, what happens right away?", np: "`naturals()` जस्तो generator function call गर्दा तुरुन्तै के हुन्छ?", jp: "`naturals()`のようなジェネレータ関数を呼び出すと、すぐに何が起きる？" },
      options: [{ en: "A generator object is created, but no code inside runs yet", np: "generator object बन्छ, तर भित्रको कुनै code अझै चलेको हुँदैन", jp: "ジェネレータオブジェクトが作られるが、内部のコードはまだ実行されない" }, { en: "The function runs until it hits the first `return` statement", np: "function पहिलो `return` statement सम्म चल्छ", jp: "関数は最初の`return`文まで実行される" }],
      correctIndex: 0,
      explanation: { en: "Calling a generator function never executes its body immediately; it only creates the generator object, which starts running from .next().", np: "Generator function call ले भित्रको body तुरुन्तै कहिल्यै execute गर्दैन; यसले केवल generator object बनाउँछ, जो .next() बाट मात्र चल्न थाल्छ।", jp: "ジェネレータ関数の呼び出しは本体をすぐには実行しない。ジェネレータオブジェクトを作るだけで、.next()から実行が始まる。" },
    },
    {
      question: { en: "What is the shape of the value returned by every call to `.next()` on a plain (non-async) generator?", np: "Plain (non-async) generator मा हरेक `.next()` call ले फर्काउने value को shape के हो?", jp: "プレーンな（非async）ジェネレータの`.next()`呼び出しごとに返される値の形は？" },
      options: [{ en: "`{ value, done }`", np: "`{ value, done }`", jp: "`{ value, done }`" }, { en: "A Promise that eventually resolves to the yielded value", np: "eventually yielded value मा resolve हुने Promise", jp: "最終的にyieldされた値に解決されるPromise" }],
      correctIndex: 0,
      explanation: { en: "Plain generators return {value, done} synchronously — only async generators return a Promise from each step.", np: "Plain generators ले synchronously {value, done} फर्काउँछन् — async generators ले मात्र हरेक step बाट Promise फर्काउँछन्।", jp: "プレーンなジェネレータは同期的に{value, done}を返す — 各ステップからPromiseを返すのはasync generatorだけ。" },
    },
    {
      question: { en: "In the `calculator()` generator example, how does a caller send a value INTO the generator's paused code?", np: "`calculator()` generator उदाहरणमा, caller ले generator को paused code भित्र value कसरी पठाउँछ?", jp: "`calculator()`ジェネレータの例で、呼び出し側はジェネレータの一時停止しているコードにどのように値を送る？" },
      options: [{ en: "By passing it as an argument to `.next(value)`", np: "`.next(value)` मा argument को रूपमा pass गरेर", jp: "`.next(value)`に引数として渡す" }, { en: "By setting a property directly on the generator object", np: "generator object मा directly property set गरेर", jp: "ジェネレータオブジェクトに直接プロパティを設定する" }],
      correctIndex: 0,
      explanation: { en: "Whatever is passed to next(value) becomes the result of the yield expression that was paused, giving two-way communication.", np: "`next(value)` मा pass गरेको जुनसुकै value रोकिएको yield expression को result बन्छ, जसले two-way communication दिन्छ।", jp: "`next(value)`に渡された値は一時停止していたyield式の結果になり、双方向通信が可能になる。" },
    },
    {
      question: { en: "What two things define the iterator protocol?", np: "Iterator protocol लाई कुन दुई कुराले define गर्छ?", jp: "イテレータプロトコルを定義する2つの要素は？" },
      options: [{ en: "An iterable has `[Symbol.iterator]()` returning an iterator; an iterator has `next()` returning `{ value, done }`", np: "Iterable मा `[Symbol.iterator]()` हुन्छ जो iterator फर्काउँछ; iterator मा `next()` हुन्छ जो `{ value, done }` फर्काउँछ", jp: "イテラブルはイテレータを返す`[Symbol.iterator]()`を持ち、イテレータは`{ value, done }`を返す`next()`を持つ" }, { en: "An iterable has a `length` property; an iterator has an `index` property", np: "Iterable मा `length` property हुन्छ; iterator मा `index` property हुन्छ", jp: "イテラブルは`length`プロパティを持ち、イテレータは`index`プロパティを持つ" }],
      correctIndex: 0,
      explanation: { en: "The protocol is defined purely by those two method shapes, with no requirement for length or index properties.", np: "Protocol ती दुई method shapes ले मात्र defined हुन्छ, length वा index properties आवश्यक पर्दैन।", jp: "プロトコルはこの2つのメソッドの形だけで定義され、lengthやindexプロパティは不要。" },
    },
    {
      question: { en: "Which of these already implement the iterator protocol out of the box?", np: "यीमध्ये कुनले पहिले नै out of the box iterator protocol implement गर्छ?", jp: "これらのうち、すでに標準でイテレータプロトコルを実装しているのはどれ？" },
      options: [{ en: "Arrays, strings, Maps, Sets, and generator objects", np: "Arrays, strings, Maps, Sets, र generator objects", jp: "配列・文字列・Map・Set・ジェネレータオブジェクト" }, { en: "Only Arrays — everything else must be manually made iterable", np: "केवल Arrays — बाँकी सबैलाई manually iterable बनाउनुपर्छ", jp: "配列だけ — 他はすべて手動でイテラブルにする必要がある" }],
      correctIndex: 0,
      explanation: { en: "Arrays, strings, Maps, Sets, and generators are all built-in iterables with working [Symbol.iterator]() methods already.", np: "Arrays, strings, Maps, Sets, र generators सबैमा पहिले नै काम गर्ने [Symbol.iterator]() भएका built-in iterables हुन्।", jp: "配列・文字列・Map・Set・ジェネレータはすべて、すでに動作する[Symbol.iterator]()を持つ組み込みのイテラブル。" },
    },
    {
      question: { en: "What is the shortcut for making a custom class iterable, instead of manually writing an object with your own `next()`?", np: "आफ्नै `next()` भएको object manually लेख्नुको सट्टा custom class लाई iterable बनाउने shortcut के हो?", jp: "独自の`next()`を持つオブジェクトを手動で書く代わりに、カスタムクラスをイテラブルにするショートカットは？" },
      options: [{ en: "Define `[Symbol.iterator]()` as a generator method: `*[Symbol.iterator]() { ... }`", np: "`[Symbol.iterator]()` लाई generator method को रूपमा define गर्नु: `*[Symbol.iterator]() { ... }`", jp: "`[Symbol.iterator]()`をジェネレータメソッドとして定義する: `*[Symbol.iterator]() { ... }`" }, { en: "Extend the built-in `Array` class", np: "built-in `Array` class extend गर्नु", jp: "組み込みの`Array`クラスを拡張する" }],
      correctIndex: 0,
      explanation: { en: "A generator method already returns something matching the iterator shape, so yield replaces writing a manual next() method.", np: "Generator method ले पहिले नै iterator shape मिल्ने चीज फर्काउँछ, त्यसैले yield ले manual next() method लेख्ने काम replace गर्छ।", jp: "ジェネレータメソッドはすでにイテレータの形に一致するものを返すため、yieldが手動でnext()メソッドを書く作業を置き換える。" },
    },
    {
      question: { en: "Why is `for await...of` required to consume an async generator, instead of plain `for...of`?", np: "Async generator consume गर्न plain `for...of` को सट्टा `for await...of` किन आवश्यक पर्छ?", jp: "async generatorを消費するのに、通常の`for...of`ではなく`for await...of`が必要なのはなぜ？" },
      options: [{ en: "Because each iteration step resolves to a Promise, which needs to be awaited before reading `value`/`done`", np: "किनकि हरेक iteration step Promise मा resolve हुन्छ, जसलाई `value`/`done` पढ्नु अघि await गर्नुपर्छ", jp: "各イテレーションステップがPromiseに解決されるため、`value`/`done`を読む前にawaitする必要があるから" }, { en: "Because async generators don't produce a `done` flag", np: "किनकि async generators ले `done` flag produce गर्दैनन्", jp: "async generatorが`done`フラグを生成しないから" }],
      correctIndex: 0,
      explanation: { en: "for await...of automatically awaits each step's Promise; plain for...of has no way to do that and would receive an unresolved Promise instead of the value.", np: "`for await...of` ले हरेक step को Promise automatic रूपमा await गर्छ; plain `for...of` सँग त्यो गर्ने कुनै तरिका छैन र value को सट्टा unresolved Promise पाउँछ।", jp: "`for await...of`は各ステップのPromiseを自動的にawaitする。通常の`for...of`にはその方法がなく、値の代わりに未解決のPromiseを受け取ってしまう。" },
    },
    {
      question: { en: "If you `break` out of a `for await...of` loop midway through a paginated async generator, what happens to the remaining pages?", np: "Paginated async generator मध्ये `for await...of` loop बाट `break` गरेमा, बाँकी pages लाई के हुन्छ?", jp: "ページングされたasync generatorの途中で`for await...of`ループを`break`した場合、残りのページはどうなる？" },
      options: [{ en: "They are never fetched — the generator only fetches when the next value is actually requested", np: "ती कहिल्यै fetch हुँदैनन् — generator ले अर्को value actually माग्दा मात्र fetch गर्छ", jp: "決して取得されない — ジェネレータは次の値が実際に要求されたときだけ取得する" }, { en: "They are fetched anyway because the network request had already started", np: "network request पहिले नै सुरु भइसकेकाले जसरी पनि fetch हुन्छन्", jp: "ネットワークリクエストがすでに始まっていたため、いずれにせよ取得される" }],
      correctIndex: 0,
      explanation: { en: "Async generators stay lazy: breaking the consuming loop simply stops it from resuming, so no further fetch() calls are triggered.", np: "Async generators lazy नै रहन्छन्: consuming loop break गर्नाले generator resume हुनबाट रोकिन्छ, त्यसैले थप fetch() calls trigger हुँदैनन्।", jp: "async generatorは遅延評価を保つ — 消費側のループをbreakすると単に再開が止まるだけなので、それ以上のfetch()呼び出しはトリガーされない。" },
    },
  ],
};
