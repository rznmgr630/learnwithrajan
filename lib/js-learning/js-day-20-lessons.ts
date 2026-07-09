import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_20_LESSONS: JsLessonDay = {
  day: 20,
  title: { en: "Performance — debounce, throttle, memoization & workers", np: "Performance — debounce, throttle, memoization", jp: "パフォーマンス最適化" },
  totalMinutes: 27,
  difficulty: { en: "Intermediate", np: "Intermediate", jp: "中級" },
  lessons: [
    {
      id: "debounce-throttle",
      title: { en: "Debounce & Throttle", np: "Debounce र Throttle", jp: "デバウンスとスロットル" },
      durationMinutes: 9,
      explanation: {
        en: "A <b>debounce</b> wraps a function so it only runs after a period of inactivity: every call to the debounced function does `clearTimeout(timerId)` on any pending timer and starts a new `setTimeout(() => fn(...args), delayMs)` — so as long as calls keep arriving faster than `delayMs` apart, the timer keeps getting reset and `fn` never actually runs. Only once nobody has called it for a full `delayMs` does the timer finally fire, running `fn` exactly once with the most recent arguments. A <b>leading-edge</b> variant flips this: it calls `fn` <b>immediately</b> on the very first call, then starts a timer that simply blocks (ignores) any further calls until `delayMs` has passed, after which the next call is treated as a fresh \"first call\" again.\n\nA <b>throttle</b> takes a different approach: instead of waiting for quiet, it tracks a `lastCallTime` and only lets `fn` run if `now - lastCallTime >= intervalMs`; if not enough time has elapsed it silently ignores the call. This means throttle fires immediately on the first call, then at most once per `intervalMs` window for as long as calls keep coming — unlike debounce, which might never run at all while calls keep arriving. Picture a user scrolling continuously for 5 seconds: `debounce(300ms)` runs exactly <b>once</b>, 300ms after they finally stop scrolling; `throttle(300ms)` runs roughly <b>17 times</b>, about every 300ms, throughout the whole 5 seconds they're scrolling. Use debounce when only the final state matters — search-as-you-type, form autosave, recalculating layout after a window resize. Use throttle when you need steady, periodic updates during continuous activity — tracking scroll position, `mousemove`/drag handlers, or rate-limiting how often you poll an API.",
        np: "<b>Debounce</b> ले function लाई यसरी wrap गर्छ कि यो केही समय inactivity पछि मात्र run हुन्छ: debounced function मा हरेक call ले pending timer माथि `clearTimeout(timerId)` गर्छ र नयाँ `setTimeout(() => fn(...args), delayMs)` सुरु गर्छ — त्यसैले `delayMs` भन्दा छोटो gap मा calls आइरहेसम्म timer reset हुँदै रहन्छ र `fn` कहिल्यै run हुँदैन। पूरा `delayMs` सम्म कोहीले call नगरेपछि मात्र timer अन्ततः fire हुन्छ, `fn` लाई सबैभन्दा हालको arguments सँग ठीक एक पटक run गर्छ। <b>Leading-edge</b> variant यसलाई उल्टो गर्छ: यो पहिलो call मा नै `fn` लाई <b>तुरन्त</b> call गर्छ, त्यसपछि `delayMs` नबितेसम्म थप calls लाई block (ignore) गर्ने timer सुरु गर्छ, त्यसपछिको call लाई फेरि नयाँ \"पहिलो call\" को रूपमा treat गरिन्छ।\n\n<b>Throttle</b> ले फरक approach लिन्छ: quiet period को लागि wait नगरी, यो `lastCallTime` track गर्छ र `now - lastCallTime >= intervalMs` भएमा मात्र `fn` लाई run हुन दिन्छ; पर्याप्त समय नबितेको भए call लाई silently ignore गर्छ। यसको मतलब throttle पहिलो call मा तुरन्त fire हुन्छ, त्यसपछि calls आइरहेसम्म `intervalMs` window मा अधिकतम एक पटक — debounce भन्दा फरक, जो calls आइरहेसम्म कहिल्यै run नहुन पनि सक्छ। कल्पना गर्नुहोस् user 5 seconds लगातार scroll गर्दैछ: `debounce(300ms)` ठीक <b>एक पटक</b> run हुन्छ, उनीहरू scroll रोकेको 300ms पछि; `throttle(300ms)` लगभग <b>17 पटक</b> run हुन्छ, लगभग हर 300ms मा, पूरै 5 seconds scroll गर्दा। Final state मात्र चासोको विषय भएमा debounce प्रयोग गर्नुहोस् — search-as-you-type, form autosave, window resize पछि layout recalculate गर्नु। Continuous activity मा steady, periodic updates चाहिएमा throttle प्रयोग गर्नुहोस् — scroll position track गर्नु, `mousemove`/drag handlers, वा API poll गर्ने frequency rate-limit गर्नु।",
        jp: "<b>デバウンス</b>は、一定の無操作期間が経過した後にのみ実行されるよう関数をラップする — デバウンスされた関数が呼ばれるたびに、保留中のタイマーに対して`clearTimeout(timerId)`を行い、新しい`setTimeout(() => fn(...args), delayMs)`を開始する。つまり`delayMs`より短い間隔で呼び出しが続く限りタイマーはリセットされ続け、`fn`は一度も実行されない。誰も`delayMs`の間まるごと呼ばなかった時にだけタイマーが最終的に発火し、最新の引数で`fn`をちょうど一度実行する。<b>リーディングエッジ</b>版はこれを反転させる — 最初の呼び出しで<b>即座に</b>`fn`を呼び、その後`delayMs`が経過するまでさらなる呼び出しをブロック（無視）するタイマーを開始する。その後の呼び出しは再び新しい「最初の呼び出し」として扱われる。\n\n<b>スロットル</b>は異なるアプローチを取る — 静止を待つのではなく`lastCallTime`を記録し、`now - lastCallTime >= intervalMs`の場合にのみ`fn`を実行させる。十分な時間が経過していなければその呼び出しは黙って無視される。つまりスロットルは最初の呼び出しで即座に発火し、その後呼び出しが続く限り`intervalMs`ウィンドウごとに最大一度実行される — 呼び出しが続く間ずっと一度も実行されないこともあるデバウンスとは異なる。ユーザーが5秒間連続でスクロールしている場面を想像してほしい — `debounce(300ms)`はスクロールを止めた300ms後に<b>一度だけ</b>実行され、`throttle(300ms)`はスクロールしている5秒間、約300msごとに<b>約17回</b>実行される。最終的な状態だけが重要な場合はデバウンスを使う — 検索入力・フォームの自動保存・ウィンドウリサイズ後のレイアウト再計算。継続的な操作中に一定間隔の更新が必要な場合はスロットルを使う — スクロール位置の追跡・`mousemove`/ドラッグハンドラ・APIをポーリングする頻度のレート制限。",
      },
      diagram: `User scrolls continuously for 5 seconds
──────────────────────────────────────────────────────►  time
scroll events:  █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █

debounce(300ms)
  (timer keeps resetting on every event, fires once at the end)
  ─────────────────────────────────────────────────── fn() ×1

throttle(300ms)
  (fires immediately, then at most once per 300ms window)
  fn()   fn()   fn()   fn()   fn()   fn()  ...          fn() ×~17

DEBOUNCE — wait for quiet          THROTTLE — steady drip
──────────────────────             ──────────────────────
search-as-you-type                 scroll position tracking
form autosave                      mousemove / drag
window resize                      rate-limited API polling`,
      codeExample: {
        title: { en: "Debounce and throttle implementations, side by side", np: "Debounce र throttle implementations, side by side", jp: "デバウンスとスロットルの実装を並べて比較" },
        code: `// ── Debounce — waits for a quiet period, then runs ONCE ────────────
function debounce(fn, delayMs) {
  let timerId;

  return function (...args) {
    clearTimeout(timerId);               // cancel any pending run
    timerId = setTimeout(() => {
      fn.apply(this, args);              // run only after delayMs of silence
    }, delayMs);
  };
}

const search = document.querySelector("#search");
const debouncedSearch = debounce((query) => {
  console.log("fetching results for:", query);
}, 300);

search.addEventListener("input", (e) => debouncedSearch(e.target.value));
// Typing "hello" fast → only ONE fetch, 300ms after the last keystroke

// ── Leading-edge debounce — fires immediately, then cools down ─────
function debounceLeading(fn, delayMs) {
  let onCooldown = false;

  return function (...args) {
    if (onCooldown) return;              // ignore calls during the cooldown window
    fn.apply(this, args);                // run immediately on the first call
    onCooldown = true;
    setTimeout(() => { onCooldown = false; }, delayMs);
  };
}

const submitOrder = debounceLeading(() => placeOrder(), 2000);
button.addEventListener("click", submitOrder);
// First click places the order right away; rapid extra clicks in the next 2s are ignored

// ── Throttle — allows periodic runs during continuous activity ─────
function throttle(fn, intervalMs) {
  let lastCallTime = 0;

  return function (...args) {
    const now = Date.now();
    if (now - lastCallTime >= intervalMs) {
      lastCallTime = now;
      fn.apply(this, args);              // enough time has passed — run it
    }
    // otherwise: too soon, silently drop this call
  };
}

const throttledScroll = throttle(() => {
  console.log("scrollY:", window.scrollY);
}, 300);

window.addEventListener("scroll", throttledScroll);
// Scroll fires 60x/second, but this logs at most ~3-4x/second

// ── Choosing between them ───────────────────────────────────────────
// debounce(saveDraft, 500)    → autosave: only save the FINAL text
// debounce(recalcLayout, 200) → resize: only recalc once resizing stops
// throttle(onScroll, 100)     → scroll: keep updating a progress bar smoothly
// throttle(onDrag, 50)        → drag: update position often, but not on every pixel`,
      },
      keyTakeaways: [
        { en: "Debounce resets its timer on every call and only runs `fn` once calls stop for a full `delayMs`; throttle runs immediately and then at most once per `intervalMs`, no matter how many calls keep coming.", np: "Debounce ले हरेक call मा आफ्नो timer reset गर्छ र calls पूरा `delayMs` सम्म नरोकिएसम्म `fn` run गर्दैन; throttle तुरुन्तै run हुन्छ र त्यसपछि जति calls आए पनि `intervalMs` मा अधिकतम एक पटक मात्र run हुन्छ।", jp: "デバウンスは呼び出しごとにタイマーをリセットし、`delayMs`分呼び出しが完全に止まるまで`fn`を実行しない。スロットルは即座に実行され、その後は呼び出しがいくら続いても`intervalMs`ごとに最大一度しか実行されない。" },
        { en: "A leading-edge debounce fires on the very first call and then ignores calls during a cooldown window, the opposite of the default trailing debounce which only fires after things go quiet.", np: "Leading-edge debounce पहिलो call मा नै fire हुन्छ र त्यसपछि cooldown window भर calls लाई ignore गर्छ, जो default trailing debounce (शान्त भएपछि मात्र fire हुने) को विपरीत हो।", jp: "リーディングエッジのデバウンスは最初の呼び出しで発火し、その後クールダウン期間中の呼び出しを無視する。これは静止後にのみ発火するデフォルトの「トレーリング」デバウンスとは逆の動きだ。" },
        { en: "Use debounce when only the final value matters — search-as-you-type, autosave, window resize; use throttle when you need steady updates during continuous activity — scroll tracking, drag, rate-limited polling.", np: "Final value मात्र चासोको विषय भएमा debounce प्रयोग गर्नुहोस् — search-as-you-type, autosave, window resize; continuous activity मा steady updates चाहिएमा throttle प्रयोग गर्नुहोस् — scroll tracking, drag, rate-limited polling।", jp: "最終的な値だけが重要な場合はデバウンスを使う — 検索入力・自動保存・ウィンドウリサイズ。継続的な操作中に安定した更新が必要な場合はスロットルを使う — スクロール追跡・ドラッグ・レート制限付きポーリング。" },
      ],
      commonMistakes: [
        { en: "Using debounce for a scroll or drag handler and being surprised it never fires while the user keeps moving — that continuous-update need is what throttle is for.", np: "Scroll वा drag handler का लागि debounce प्रयोग गर्नु र user चलिरहेसम्म यो कहिल्यै fire नहुँदा अचम्मित हुनु — त्यो continuous-update आवश्यकता throttle को लागि हो।", jp: "スクロールやドラッグのハンドラにデバウンスを使い、ユーザーが動き続ける間ずっと発火しないことに驚くこと — その継続的な更新のニーズこそスロットルの役割。" },
        { en: "Forgetting `clearTimeout` inside a debounce implementation, so every call's timer fires independently instead of resetting the previous one.", np: "Debounce implementation भित्र `clearTimeout` बिर्सनु, जसले गर्दा हरेक call को timer अघिल्लोलाई reset नगरी independently fire हुन्छ।", jp: "デバウンス実装内で`clearTimeout`を忘れ、各呼び出しのタイマーが前のものをリセットせず独立して発火してしまうこと。" },
        { en: "Assuming throttle waits for quiet like debounce — it actually fires on the very first call, then periodically, even while calls keep arriving.", np: "Throttle ले debounce जस्तै quiet को लागि wait गर्छ भन्ने ठान्नु — वास्तवमा यो पहिलो call मा नै fire हुन्छ, त्यसपछि calls आइरहेसम्म periodically fire हुन्छ।", jp: "スロットルがデバウンスのように静止を待つと思い込むこと — 実際には最初の呼び出しで発火し、その後も呼び出しが続く限り周期的に発火する。" },
      ],
      quiz: [
        {
          question: { en: "What does calling a debounced function again before its delay has elapsed do?", np: "Delay बित्नु अगाडि debounced function लाई फेरि call गर्दा के हुन्छ?", jp: "遅延時間が経過する前にデバウンスされた関数を再度呼び出すと何が起こる？" },
          options: [
            { en: "Resets the timer, so fn runs later than originally scheduled", np: "Timer reset हुन्छ, त्यसैले fn मूल रूपमा scheduled भन्दा पछि run हुन्छ", jp: "タイマーがリセットされ、fnは元の予定より後に実行される" },
            { en: "Runs fn immediately a second time", np: "fn लाई तुरुन्तै दोस्रो पटक run गराउँछ", jp: "fnを即座に2回目実行する" },
          ],
          correctIndex: 0,
          explanation: { en: "clearTimeout + setTimeout means every new call pushes the fire time further out; fn only runs once calls stop for a full delayMs.", np: "clearTimeout + setTimeout को मतलब हरेक नयाँ call ले fire हुने समय अझ पर सार्छ; calls पूरा delayMs सम्म नरोकिएसम्म fn run हुँदैन।", jp: "clearTimeoutとsetTimeoutにより、新しい呼び出しごとに発火時刻がさらに後ろに延びる。fnはdelayMs分呼び出しが完全に止まった時にのみ実行される。" },
        },
        {
          question: { en: "How does throttle decide whether to run fn on a given call?", np: "Throttle ले कुनै call मा fn run गर्ने कि नगर्ने कसरी निर्णय गर्छ?", jp: "スロットルは、ある呼び出しでfnを実行するかどうかをどう判断する？" },
          options: [
            { en: "It checks whether enough time has passed since fn last actually ran", np: "fn अन्तिम पटक वास्तवमा कहिले run भएको थियो त्यो देखि पर्याप्त समय बितेको छ कि जाँच गर्छ", jp: "fnが最後に実際に実行された時から十分な時間が経過したかを確認する" },
            { en: "It always waits for a fixed number of calls before running", np: "यो सधैं run हुनु अगाडि निश्चित संख्याका calls पर्खिन्छ", jp: "実行前に常に決まった数の呼び出しを待つ" },
          ],
          correctIndex: 0,
          explanation: { en: "throttle compares now - lastCallTime to intervalMs, ignoring calls until that much time has elapsed.", np: "Throttle ले now - lastCallTime लाई intervalMs सँग compare गर्छ, त्यति समय नबितेसम्म calls ignore गर्छ।", jp: "スロットルはnow - lastCallTimeをintervalMsと比較し、その時間が経過するまで呼び出しを無視する。" },
        },
        {
          question: { en: "Which is the better fit for a window resize handler that recalculates a complex layout?", np: "Complex layout recalculate गर्ने window resize handler का लागि कुन बेस्ट फिट हो?", jp: "複雑なレイアウトを再計算するウィンドウリサイズハンドラに適しているのはどちら？" },
          options: [
            { en: "Debounce — only recalculate once resizing has actually stopped", np: "Debounce — resizing वास्तवमा रोकिएपछि मात्र recalculate गर्नु", jp: "デバウンス — リサイズが実際に止まってから再計算する" },
            { en: "Throttle — recalculate every fixed interval regardless of whether resizing stopped", np: "Throttle — resizing रोकियो कि रोकिएन नहेरी हर निश्चित interval मा recalculate गर्नु", jp: "スロットル — リサイズが止まったかどうかに関わらず一定間隔ごとに再計算する" },
          ],
          correctIndex: 0,
          explanation: { en: "Recalculating layout is expensive and only the final size matters, so debounce — run once, after quiet — fits best.", np: "Layout recalculate गर्नु expensive छ र final size मात्र चासोको विषय हो, त्यसैले debounce — शान्त भएपछि एक पटक run हुने — बेस्ट फिट हो।", jp: "レイアウトの再計算はコストが高く、最終的なサイズだけが重要なので、静止後に一度だけ実行するデバウンスが最も適している。" },
        },
      ],
    },
    {
      id: "memoization",
      title: { en: "Memoization", np: "Memoization", jp: "メモ化" },
      durationMinutes: 9,
      explanation: {
        en: "A generic `memoize(fn)` higher-order function wraps any function with a cache: it keeps a `Map` keyed by `JSON.stringify(args)`, and on each call it checks whether that key already exists — if so it returns the cached result instantly, and if not it calls the real `fn`, stores the result under that key, and returns it. The classic demonstration is recursive Fibonacci: naive `fibonacci(40)` re-computes the same sub-values millions of times (exponential time), but wrapping the recursive calls in a memoized cache means each distinct `n` is computed exactly once, turning it into a fast, effectively linear operation.\n\nMemoization is only safe for <b>pure</b> functions — ones where the same inputs always produce the same output and there are no side effects. It's the wrong tool for a function that reads `Date.now()`, `Math.random()`, or any other changing external state, because the cache would keep returning a stale value forever; it's also wrong for functions with side effects (like writing to a database), since caching would silently skip running them on repeat calls. This is exactly what React's `useMemo` and `useCallback` do under the hood — `useMemo(() => expensiveCalc(a, b), [a, b])` memoizes a computed value so it isn't redone on every render unless `a` or `b` actually changes, and `useCallback` does the same for a function's <b>identity</b> so children don't re-render just because a new function reference was created. When the cache key is an object rather than a primitive, a plain `Map` would keep that object alive forever (a memory leak); using a `WeakMap` instead lets the cached entry be garbage-collected automatically once nothing else references that object.",
        np: "सामान्य `memoize(fn)` higher-order function ले कुनै पनि function लाई cache सँग wrap गर्छ: यसले `JSON.stringify(args)` द्वारा keyed `Map` राख्छ, र हरेक call मा त्यो key पहिले नै existing छ कि जाँच गर्छ — भए तुरुन्तै cached result फर्काउँछ, नभए actual `fn` call गर्छ, result त्यो key मा store गर्छ, र फर्काउँछ। Classic उदाहरण recursive Fibonacci हो: naive `fibonacci(40)` ले same sub-values लाई लाखौं पटक re-compute गर्छ (exponential time), तर recursive calls लाई memoized cache मा wrap गर्दा प्रत्येक फरक `n` ठीक एक पटक मात्र compute हुन्छ, यसलाई fast, effectively linear operation बनाउँछ।\n\nMemoization <b>pure</b> functions का लागि मात्र safe छ — जहाँ same inputs ले सधैं same output दिन्छ र कुनै side effects हुँदैन। `Date.now()`, `Math.random()`, वा अन्य कुनै changing external state पढ्ने function का लागि यो गलत tool हो, किनकि cache ले सधैं stale value फर्काउँदै रहन्छ; side effects भएका functions (जस्तै database मा लेख्ने) का लागि पनि गलत हो, किनकि caching ले repeat calls मा silently run हुनबाट skip गराउँछ। यही नै React को `useMemo` र `useCallback` ले internally गर्छन् — `useMemo(() => expensiveCalc(a, b), [a, b])` ले computed value लाई memoize गर्छ ताकि `a` वा `b` वास्तवमा नबदलेसम्म हरेक render मा फेरि नगरिने; र `useCallback` ले function को <b>identity</b> का लागि उही गर्छ ताकि नयाँ function reference बनेकै कारणले मात्र children re-render नहोस्। Cache key primitive नभई object भएमा, साधारण `Map` ले त्यो object लाई सधैं alive राख्छ (memory leak); त्यसको सट्टा `WeakMap` प्रयोग गर्दा त्यो object अन्त कतै reference नरहेपछि cached entry automatically garbage-collected हुन सक्छ।",
        jp: "汎用的な`memoize(fn)`高階関数は、任意の関数をキャッシュでラップする — `JSON.stringify(args)`をキーとした`Map`を保持し、呼び出しごとにそのキーが既に存在するか確認する。存在すればキャッシュされた結果を即座に返し、存在しなければ実際の`fn`を呼び出して結果をそのキーで保存し、返す。典型的な例は再帰的なフィボナッチだ — 素朴な`fibonacci(40)`は同じ部分値を何百万回も再計算する（指数時間）が、再帰呼び出しをメモ化キャッシュでラップすると、各異なる`n`はちょうど一度だけ計算され、高速で実質的に線形の処理になる。\n\nメモ化は<b>純粋</b>な関数にのみ安全である — 同じ入力が常に同じ出力を生み、副作用がない関数のこと。`Date.now()`・`Math.random()`、あるいは変化する外部状態を読む関数には向かない。キャッシュが永遠に古い値を返し続けてしまうからだ。副作用のある関数（データベースへの書き込みなど）にも向かない — キャッシュにより繰り返し呼び出しで実行が黙ってスキップされてしまう。これはまさにReactの`useMemo`と`useCallback`が内部で行っていることだ — `useMemo(() => expensiveCalc(a, b), [a, b])`は計算値をメモ化し、`a`や`b`が実際に変わらない限り毎回の再レンダーで再計算されない。`useCallback`は関数の<b>アイデンティティ</b>に対して同じことを行い、新しい関数の参照が作られただけで子コンポーネントが再レンダーされないようにする。キャッシュキーがプリミティブでなくオブジェクトの場合、通常の`Map`はそのオブジェクトを永遠に生かし続ける（メモリリーク）。代わりに`WeakMap`を使うと、他に誰もそのオブジェクトを参照しなくなった時点でキャッシュエントリが自動的にガベージコレクションされる。",
      },
      diagram: `memoize(fn)
  cache = Map { }

call 1: fib(10) ──► key "[10]" not in cache ──► compute ──► store ──► return 55
call 2: fib(10) ──► key "[10]" IS in cache  ──► skip compute ──► return 55 (instant)

Naive recursive fibonacci(40):        Memoized fibonacci(40):
        fib(40)                              fib(40)
       /       \\                             /       \\
   fib(39)   fib(38)                     fib(39)   fib(38) ← cached, instant
   /    \\     /    \\                      /
fib(38) fib(37) ...                    fib(38) ← cached, instant
  (millions of repeated calls)          (each n computed exactly ONCE)

Object keys:  Map      → keeps object alive forever    → memory leak risk
              WeakMap  → entry GC'd once object unused  → safe for object args`,
      codeExample: {
        title: { en: "Memoize, Fibonacci speed-up, and WeakMap caching", np: "Memoize, Fibonacci speed-up, र WeakMap caching", jp: "メモ化・フィボナッチの高速化・WeakMapキャッシュ" },
        code: `// ── Generic memoize wrapper ─────────────────────────────────────────
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);   // serialize args into a cache key

    if (cache.has(key)) {
      return cache.get(key);            // cache hit — skip recomputation entirely
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// ── Classic example: recursive Fibonacci ────────────────────────────
function fibonacciSlow(n) {
  if (n <= 1) return n;
  return fibonacciSlow(n - 1) + fibonacciSlow(n - 2);
}
// fibonacciSlow(40) does ~330 million redundant calls — noticeably slow

const fibonacciFast = memoize(function fib(n) {
  if (n <= 1) return n;
  return fibonacciFast(n - 1) + fibonacciFast(n - 2);  // recurse through the memoized version
});
// fibonacciFast(40) computes each distinct n exactly once — near-instant

// ── When memoization is safe vs unsafe ──────────────────────────────
const safeToMemoize = memoize((a, b) => a * b);          // pure — same inputs, same output

// NEVER memoize functions like these — they break silently:
// const badIdea1 = memoize(() => Date.now());            // always returns the FIRST timestamp
// const badIdea2 = memoize(() => Math.random());         // always returns the FIRST random value
// const badIdea3 = memoize((id) => { saveToDb(id); });   // second call SKIPS the actual save

// ── React's useMemo / useCallback are the same idea ─────────────────
// const total = useMemo(() => expensiveSum(items), [items]); // recompute only if items changes
// const onClick = useCallback(() => doSomething(id), [id]);  // stable reference until id changes

// ── Memoizing by object identity, without leaking memory ────────────
function memoizeByObject(fn) {
  const cache = new WeakMap();          // WeakMap keys don't prevent garbage collection

  return function (obj) {
    if (cache.has(obj)) return cache.get(obj);
    const result = fn(obj);
    cache.set(obj, result);
    return result;
  };
}

const getExpensiveSummary = memoizeByObject((report) => summarize(report));
// Once "report" has no other references anywhere in the app, its cache entry
// is automatically cleaned up — a plain Map would hold it forever.`,
      },
      keyTakeaways: [
        { en: "memoize(fn) caches results in a Map keyed by the serialized arguments, turning repeated expensive calls — like naive recursive Fibonacci — into near-instant cache hits.", np: "memoize(fn) ले serialized arguments द्वारा keyed Map मा results cache गर्छ, repeated expensive calls — जस्तै naive recursive Fibonacci — लाई near-instant cache hits मा बदल्छ।", jp: "memoize(fn)はシリアライズされた引数をキーとした`Map`に結果をキャッシュし、素朴な再帰フィボナッチのような繰り返される高コストな呼び出しを、ほぼ即時のキャッシュヒットに変える。" },
        { en: "Memoization is only safe for pure functions with no side effects; memoizing something that reads Date.now(), Math.random(), or writes to a database produces silently wrong behavior.", np: "Memoization side effects नभएका pure functions का लागि मात्र safe छ; `Date.now()`, `Math.random()` पढ्ने वा database मा लेख्ने कुरा memoize गर्दा silently गलत behavior आउँछ।", jp: "メモ化は副作用のない純粋な関数にのみ安全である。`Date.now()`・`Math.random()`を読む、あるいはデータベースに書き込む処理をメモ化すると、黙って誤った動作を生む。" },
        { en: "React's useMemo and useCallback are memoization applied to computed values and function identity; a WeakMap lets you memoize by object without leaking memory the way a plain Map would.", np: "React को useMemo र useCallback computed values र function identity मा applied memoization नै हुन्; WeakMap ले plain Map जसरी memory leak नगरी object द्वारा memoize गर्न दिन्छ।", jp: "Reactの`useMemo`と`useCallback`は、計算値と関数のアイデンティティに適用されたメモ化である。`WeakMap`を使えば、通常の`Map`のようにメモリをリークさせずにオブジェクトによるメモ化ができる。" },
      ],
      commonMistakes: [
        { en: "Memoizing a function that depends on changing external state (current time, random numbers) and being confused why it always returns the same stale result.", np: "बदलिरहने external state (current time, random numbers) मा depend हुने function memoize गर्नु र यो सधैं same stale result किन फर्काउँछ भन्ने भ्रम हुनु।", jp: "変化する外部状態（現在時刻・乱数）に依存する関数をメモ化し、なぜ常に同じ古い結果を返すのか混乱すること。" },
        { en: "Memoizing a function that has side effects, not realizing that cached calls silently skip re-running that side effect.", np: "Side effects भएको function memoize गर्नु, cached calls ले त्यो side effect पुन: run गर्न silently skip गर्छ भन्ने महसुस नगर्नु।", jp: "副作用のある関数をメモ化し、キャッシュされた呼び出しがその副作用の再実行を黙ってスキップすることに気づかないこと。" },
        { en: "Using a plain Map to cache by object reference instead of a WeakMap, keeping objects alive forever and leaking memory.", np: "Object reference द्वारा cache गर्न WeakMap को सट्टा plain Map प्रयोग गर्नु, objects लाई सधैंभरि alive राखी memory leak गराउनु।", jp: "オブジェクト参照によるキャッシュに`WeakMap`ではなく通常の`Map`を使い、オブジェクトを永遠に生かし続けてメモリをリークさせること。" },
      ],
      quiz: [
        {
          question: { en: "Why is recursive fibonacci dramatically faster once wrapped in memoize?", np: "Recursive fibonacci लाई memoize मा wrap गरेपछि यो किन ठूलो मात्रामा फास्ट हुन्छ?", jp: "再帰的なフィボナッチをmemoizeでラップすると、なぜ劇的に速くなる？" },
          options: [
            { en: "Each distinct n is computed once and reused instead of recomputed exponentially", np: "प्रत्येक फरक n exponentially recompute हुनुको सट्टा एक पटक मात्र compute भई reuse हुन्छ", jp: "各異なるnが指数的に再計算されるのではなく、一度だけ計算され再利用される" },
            { en: "memoize rewrites the algorithm to be iterative instead of recursive", np: "memoize ले algorithm लाई recursive को सट्टा iterative मा rewrite गर्छ", jp: "memoizeはアルゴリズムを再帰的ではなく反復的に書き換える" },
          ],
          correctIndex: 0,
          explanation: { en: "memoize doesn't change the algorithm's shape, it just caches each n's result so repeated sub-calls become instant lookups.", np: "memoize ले algorithm को shape बदल्दैन, यो प्रत्येक n को result cache मात्र गर्छ ताकि repeated sub-calls instant lookups बन्छन्।", jp: "memoizeはアルゴリズムの形を変えるのではなく、各nの結果をキャッシュするだけで、繰り返されるサブ呼び出しが即時のルックアップになる。" },
        },
        {
          question: { en: "Which function is safe to memoize?", np: "कुन function memoize गर्न safe छ?", jp: "メモ化しても安全な関数はどれ？" },
          options: [
            { en: "A pure function like (a, b) => a * b", np: "(a, b) => a * b जस्तो pure function", jp: "(a, b) => a * bのような純粋な関数" },
            { en: "A function that returns Math.random()", np: "Math.random() फर्काउने function", jp: "Math.random()を返す関数" },
          ],
          correctIndex: 0,
          explanation: { en: "Memoization assumes identical inputs always produce identical outputs; a function based on Math.random() breaks that assumption.", np: "Memoization ले identical inputs ले सधैं identical outputs दिन्छ भन्ने assume गर्छ; Math.random() मा आधारित function ले त्यो assumption तोड्छ।", jp: "メモ化は同一の入力が常に同一の出力を生むことを前提とする。Math.random()に基づく関数はその前提を破る。" },
        },
        {
          question: { en: "Why use a WeakMap instead of a Map when memoizing by an object argument?", np: "Object argument द्वारा memoize गर्दा Map को सट्टा WeakMap किन प्रयोग गर्ने?", jp: "オブジェクト引数でメモ化する際、Mapの代わりにWeakMapを使う理由は？" },
          options: [
            { en: "WeakMap lets cached entries be garbage-collected once the object is no longer referenced elsewhere", np: "Object अन्त कतै reference नरहेपछि WeakMap ले cached entries लाई garbage-collected हुन दिन्छ", jp: "WeakMapは、オブジェクトが他で参照されなくなった時点でキャッシュエントリをガベージコレクションさせる" },
            { en: "WeakMap looks up cached values faster than Map", np: "WeakMap ले Map भन्दा छिटो cached values lookup गर्छ", jp: "WeakMapはMapよりキャッシュ値の検索が速い" },
          ],
          correctIndex: 0,
          explanation: { en: "A plain Map holds a strong reference to its keys forever, preventing garbage collection; WeakMap keys don't keep the object alive.", np: "Plain Map ले आफ्ना keys लाई सधैंभरि strong reference मा राख्छ, garbage collection रोक्छ; WeakMap keys ले object लाई alive राख्दैनन्।", jp: "通常の`Map`はキーへの強い参照を永遠に保持し、ガベージコレクションを妨げる。`WeakMap`のキーはオブジェクトを生かし続けない。" },
        },
      ],
    },
    {
      id: "web-workers",
      title: { en: "Web Workers — Off the Main Thread", np: "Web Workers — Main Thread बाट बाहिर", jp: "Web Workers — メインスレッドから外へ" },
      durationMinutes: 9,
      explanation: {
        en: "JavaScript in the browser normally runs on a single <b>main thread</b> that also handles rendering, layout, and responding to clicks — so a long synchronous computation, like sorting an array of a million numbers, blocks that thread completely: the UI freezes, clicks don't register, and animations stall until the computation finishes. A `Worker` solves this by running JavaScript on a genuinely separate thread: `new Worker('worker.js')` loads a script file into a background thread that executes independently of the page.\n\nThe main thread and the worker can only talk to each other through `postMessage()` and an `onmessage`/`addEventListener('message', ...)` handler on each side — there is no shared memory or direct function calls between them. Data passed to `postMessage()` is <b>structured-cloned</b> (deep-copied), not shared by reference, so mutating an object on one side never affects the other side's copy. Workers deliberately have <b>no access</b> to the DOM, `document`, or `window` — they can't read or change page content directly, because letting two threads touch the DOM at once would require complex synchronization; workers exist purely for computation like sorting, parsing, or number crunching. Once a worker's job is done, call `worker.terminate()` to free its thread and memory. For very large data like a 100MB `ArrayBuffer`, the default structured-clone copy is expensive — passing it as a <b>transferable object</b> (a second argument array to `postMessage`) moves ownership to the worker with zero copying instead, though the original buffer becomes unusable on the sending side afterward. If you don't want a separate `.js` file, you can build an <b>inline worker</b> by putting the worker's code in a string, wrapping it in a `Blob`, and passing `URL.createObjectURL(blob)` to `new Worker()`.",
        np: "Browser मा JavaScript सामान्यतया एउटै <b>main thread</b> मा चल्छ जसले rendering, layout, र clicks respond गर्ने काम पनि गर्छ — त्यसैले लम्बा synchronous computation, जस्तै एक million numbers को array sort गर्नु, त्यो thread लाई पूरै block गर्छ: UI freeze हुन्छ, clicks register हुँदैनन्, र computation नसकिएसम्म animations रोकिन्छ। `Worker` ले JavaScript लाई साँच्चै फरक thread मा run गराई यो solve गर्छ: `new Worker('worker.js')` ले script file लाई background thread मा load गर्छ जो page बाट independent रूपमा execute हुन्छ।\n\nMain thread र worker ले `postMessage()` र प्रत्येक तर्फको `onmessage`/`addEventListener('message', ...)` handler मार्फत मात्र कुराकानी गर्न सक्छन् — तिनीहरू बीच shared memory वा direct function calls हुँदैन। `postMessage()` मा pass गरिएको data <b>structured-clone</b> (deep-copy) हुन्छ, reference मार्फत share हुँदैन, त्यसैले एक तर्फ object mutate गर्दा अर्को तर्फको copy मा कहिल्यै असर पर्दैन। Workers लाई DOM, `document`, वा `window` मा <b>access छैन</b> — यो intentional हो, किनकि दुई threads ले एकैसाथ DOM छोए भने complex synchronization चाहिन्छ; workers pure computation जस्तै sorting, parsing, वा number crunching का लागि मात्र हुन्छन्। Worker को काम सकिएपछि, `worker.terminate()` call गरी thread र memory free गर्नुहोस्। 100MB `ArrayBuffer` जस्तो ठूलो data का लागि, default structured-clone copy expensive हुन्छ — यसलाई <b>transferable object</b> को रूपमा pass गर्दा (`postMessage` को दोस्रो argument array) zero-copy मार्फत ownership worker मा सरिन्छ, तर त्यसपछि original buffer sending side मा unusable हुन्छ। छुट्टै `.js` file नचाहिएमा, worker को code लाई string मा राखी, `Blob` मा wrap गरी, `URL.createObjectURL(blob)` लाई `new Worker()` मा pass गरेर <b>inline worker</b> बनाउन सकिन्छ।",
        jp: "ブラウザ内のJavaScriptは通常、レンダリング・レイアウト・クリックへの応答も担う単一の<b>メインスレッド</b>で実行される — そのため100万個の数値を含む配列をソートするような長い同期処理は、そのスレッドを完全にブロックする。UIが固まり、クリックが反応せず、計算が終わるまでアニメーションも止まる。`Worker`は本当に別のスレッドでJavaScriptを実行することでこれを解決する — `new Worker('worker.js')`はスクリプトファイルをバックグラウンドスレッドに読み込み、ページとは独立して実行させる。\n\nメインスレッドとワーカーは、それぞれの側で`postMessage()`と`onmessage`/`addEventListener('message', ...)`ハンドラを通じてのみやり取りできる — 共有メモリや直接の関数呼び出しは存在しない。`postMessage()`に渡されたデータは<b>構造化クローン</b>（深いコピー）され、参照で共有されるわけではない。そのため片方でオブジェクトを変更しても、もう片方のコピーには決して影響しない。ワーカーには意図的にDOM・`document`・`window`への<b>アクセスがない</b> — 2つのスレッドが同時にDOMに触れるとなると複雑な同期が必要になるためだ。ワーカーはソート・パース・数値計算のような純粋な計算のために存在する。ワーカーの作業が終わったら、`worker.terminate()`を呼んでスレッドとメモリを解放する。100MBの`ArrayBuffer`のような非常に大きなデータでは、デフォルトの構造化クローンコピーはコストが高い — <b>転送可能オブジェクト</b>として渡す（`postMessage`の第2引数の配列）ことで、コピーではなくゼロコピーで所有権をワーカーに移せる。ただしその後、送信側の元のバッファは使用不可になる。別の`.js`ファイルを用意したくない場合は、ワーカーのコードを文字列にして`Blob`でラップし、`URL.createObjectURL(blob)`を`new Worker()`に渡すことで<b>インラインワーカー</b>を作れる。",
      },
      diagram: `MAIN THREAD                              WORKER THREAD (worker.js)
────────────                             ─────────────────────────
UI, DOM, clicks, rendering                NO document, NO window, NO DOM

const worker = new Worker("worker.js");
worker.postMessage(bigArray) ──────────►  self.onmessage = (e) => {
                                             const sorted = e.data.sort(...);
                                  ┌────────  self.postMessage(sorted);
                                  │          }
worker.onmessage = (e) => { ◄────┘
  render(e.data);                          (main thread stays responsive
}                                           the whole time this runs)

worker.terminate();  ← free the thread + memory once done

Data passing:
  postMessage(obj)         → structured-clone (deep copy, safe but costs time/memory)
  postMessage(buf, [buf])  → TRANSFER (zero-copy, buf becomes unusable on sender side)

Inline worker without a separate file:
  Blob([code string]) → URL.createObjectURL(blob) → new Worker(url)`,
      codeExample: {
        title: { en: "Offloading a heavy sort to a Web Worker", np: "Heavy sort लाई Web Worker मा offload गर्नु", jp: "重いソート処理をWeb Workerへオフロード" },
        code: `// ── The problem: this freezes the UI for hundreds of milliseconds ──
function sortHugeArrayOnMainThread() {
  const numbers = Array.from({ length: 2_000_000 }, () => Math.random());
  return numbers.sort((a, b) => a - b);   // blocks clicks, scrolling, animations
}

// ── worker.js — runs on a separate thread, has NO dom access ───────
// (this code lives in its own file, e.g. "sort-worker.js")
self.addEventListener("message", (event) => {
  const { type, payload } = event.data;

  if (type === "sort") {
    const sorted = payload.sort((a, b) => a - b);   // heavy work, off the main thread
    self.postMessage({ type: "sorted", payload: sorted });
  }
  // self.document        // undefined — workers cannot touch the DOM
  // self.window           // undefined — no window object either
});

// ── main.js — the UI thread, stays responsive the whole time ───────
const sortWorker = new Worker("sort-worker.js");

const numbers = Array.from({ length: 2_000_000 }, () => Math.random());
sortWorker.postMessage({ type: "sort", payload: numbers });   // structured-clone copy sent

sortWorker.onmessage = (event) => {
  if (event.data.type === "sorted") {
    console.log("sorted!", event.data.payload.length, "items");
    renderChart(event.data.payload);
  }
};

sortWorker.onerror = (err) => console.error("worker crashed:", err);

// Done with it — free the thread and its memory:
sortWorker.terminate();

// ── Transferable objects — move a big buffer with ZERO copying ─────
const buffer = new ArrayBuffer(1024 * 1024 * 100);        // 100MB
sortWorker.postMessage({ buffer }, [buffer]);
// \`buffer\` is now empty/unusable on the main thread — ownership moved, not copied

// ── Inline worker — no separate file needed ─────────────────────────
const workerSource = \`
  self.onmessage = ({ data }) => {
    const total = data.reduce((sum, n) => sum + n, 0);
    self.postMessage(total);
  };
\`;
const blob         = new Blob([workerSource], { type: "application/javascript" });
const workerUrl     = URL.createObjectURL(blob);
const inlineWorker  = new Worker(workerUrl);`,
      },
      keyTakeaways: [
        { en: "A long synchronous computation on the main thread freezes the UI entirely; a Worker runs that computation on a genuinely separate thread so clicks and rendering keep working.", np: "Main thread मा लम्बा synchronous computation ले UI लाई पूरै freeze गर्छ; Worker ले त्यो computation लाई साँच्चै फरक thread मा run गर्छ ताकि clicks र rendering चलिरहन्छ।", jp: "メインスレッド上の長い同期処理はUIを完全に固まらせる。Workerはその計算を本当に別のスレッドで実行するため、クリックやレンダリングが機能し続ける。" },
        { en: "Workers communicate only through postMessage()/onmessage with structured-cloned (deep-copied) data — there is no shared memory and no direct function calls between the two sides.", np: "Workers ले structured-cloned (deep-copied) data सँग postMessage()/onmessage मार्फत मात्र communicate गर्छन् — दुई तर्फ बीच shared memory वा direct function calls हुँदैन।", jp: "Workerは構造化クローン（深いコピー）されたデータを伴うpostMessage()/onmessageのみで通信する — 両者間に共有メモリや直接の関数呼び出しはない。" },
        { en: "Workers intentionally have no access to the DOM, document, or window; call worker.terminate() when done, and use transferable objects to move large buffers with zero copying.", np: "Workers लाई intentionally DOM, document, वा window मा access छैन; काम सकिएपछि worker.terminate() call गर्नुहोस्, र ठूला buffers लाई zero-copy मार्फत सार्न transferable objects प्रयोग गर्नुहोस्।", jp: "WorkerはDOM・document・windowへのアクセスを意図的に持たない。作業が終わったらworker.terminate()を呼び、大きなバッファをゼロコピーで移動するには転送可能オブジェクトを使う。" },
      ],
      commonMistakes: [
        { en: "Trying to access document or window from inside a worker script and being confused why it's undefined — workers are deliberately DOM-less.", np: "Worker script भित्रबाट document वा window access गर्ने प्रयास गर्नु र यो undefined किन छ भन्ने भ्रम हुनु — workers जानाजान DOM-less हुन्छन्।", jp: "Workerスクリプト内からdocumentやwindowにアクセスしようとし、なぜundefinedなのか混乱すること — Workerは意図的にDOMを持たない。" },
        { en: "Assuming postMessage() shares the object by reference, then being surprised that mutating it on one side doesn't affect the other side's copy.", np: "postMessage() ले object लाई reference मार्फत share गर्छ भन्ने ठान्नु, त्यसपछि एक तर्फ mutate गर्दा अर्को तर्फको copy मा असर नपरेको देखी अचम्मित हुनु।", jp: "postMessage()がオブジェクトを参照で共有すると思い込み、片方で変更してももう片方のコピーに影響しないことに驚くこと。" },
        { en: "Forgetting to call worker.terminate() when a worker is no longer needed, leaving its thread and memory running indefinitely.", np: "Worker आवश्यक नरहेपछि worker.terminate() call गर्न बिर्सनु, यसको thread र memory अनिश्चित काल सम्म चलिरहनु।", jp: "Workerが不要になった時にworker.terminate()を呼び忘れ、そのスレッドとメモリを無期限に動かし続けてしまうこと。" },
      ],
      quiz: [
        {
          question: { en: "Why does sorting a huge array directly on the main thread freeze the UI?", np: "Main thread मा directly huge array sort गर्दा UI किन freeze हुन्छ?", jp: "メインスレッドで直接巨大な配列をソートすると、なぜUIが固まる？" },
          options: [
            { en: "The main thread also handles rendering and clicks, so a long synchronous task blocks all of it", np: "Main thread ले rendering र clicks पनि handle गर्छ, त्यसैले लम्बा synchronous task ले यी सबैलाई block गर्छ", jp: "メインスレッドはレンダリングとクリックも処理するため、長い同期タスクがそのすべてをブロックする" },
            { en: "Sorting always requires DOM access, which is slow", np: "Sorting लाई सधैं DOM access चाहिन्छ, जो slow छ", jp: "ソートは常にDOMアクセスを必要とし、それが遅い" },
          ],
          correctIndex: 0,
          explanation: { en: "The main thread is single and shared between computation and UI responsiveness; a long synchronous task monopolizes it until finished.", np: "Main thread एउटै हो र computation र UI responsiveness बीच shared छ; लम्बा synchronous task नसकिएसम्म यसलाई monopolize गर्छ।", jp: "メインスレッドは単一であり、計算とUIの応答性の間で共有される。長い同期タスクは終わるまでそれを独占する。" },
        },
        {
          question: { en: "How do the main thread and a Web Worker exchange data?", np: "Main thread र Web Worker ले data कसरी exchange गर्छन्?", jp: "メインスレッドとWeb Workerはどのようにデータを交換する？" },
          options: [
            { en: "Only via postMessage()/onmessage, with the data structured-cloned", np: "केवल postMessage()/onmessage मार्फत, data structured-cloned हुन्छ", jp: "postMessage()/onmessageのみを通じて、データは構造化クローンされる" },
            { en: "Through shared variables both threads can read and write directly", np: "दुवै threads ले directly read/write गर्न सक्ने shared variables मार्फत", jp: "両スレッドが直接読み書きできる共有変数を通じて" },
          ],
          correctIndex: 0,
          explanation: { en: "There is no shared memory between a worker and the main thread; all communication goes through postMessage, and the data is deep-copied, not shared by reference.", np: "Worker र main thread बीच shared memory हुँदैन; सबै communication postMessage मार्फत हुन्छ, र data reference मार्फत होइन deep-copied हुन्छ।", jp: "Workerとメインスレッドの間に共有メモリはない。すべての通信はpostMessageを通じて行われ、データは参照ではなく深くコピーされる。" },
        },
        {
          question: { en: "Why can't a Web Worker directly modify the page's DOM?", np: "Web Worker ले page को DOM directly किन modify गर्न सक्दैन?", jp: "Web Workerがページのdomを直接変更できないのはなぜ？" },
          options: [
            { en: "Workers intentionally have no access to document/window, avoiding the need to synchronize DOM access across threads", np: "Workers लाई intentionally document/window मा access छैन, threads बीच DOM access synchronize गर्ने आवश्यकता हटाउनको लागि", jp: "Workerは意図的にdocument/windowへのアクセスを持たず、スレッド間でDOMアクセスを同期する必要を避けている" },
            { en: "The DOM API only works inside setTimeout callbacks", np: "DOM API केवल setTimeout callbacks भित्र मात्र काम गर्छ", jp: "DOM APIはsetTimeoutコールバック内でのみ動作する" },
          ],
          correctIndex: 0,
          explanation: { en: "Giving workers direct DOM access would require complex cross-thread synchronization, so workers are restricted to pure computation and communicate results back via messages.", np: "Workers लाई direct DOM access दिनु भनेको complex cross-thread synchronization चाहिने हुन्थ्यो, त्यसैले workers pure computation मा सीमित छन् र results messages मार्फत फर्काउँछन्।", jp: "Workerに直接DOMアクセスを与えると複雑なスレッド間同期が必要になるため、Workerは純粋な計算に限定され、結果はメッセージ経由で返される。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "What's the key difference in when debounce vs throttle actually run fn, given continuous calls?", np: "लगातार calls आउँदा debounce र throttle ले fn वास्तवमा कहिले run गर्छन् भन्ने मुख्य फरक के हो?", jp: "継続的な呼び出しがある場合、デバウンスとスロットルが実際にfnを実行するタイミングの主な違いは何？" },
      options: [
        { en: "Debounce runs once after calls stop; throttle runs periodically while calls keep coming", np: "Debounce calls रोकिएपछि एक पटक run हुन्छ; throttle calls आइरहेसम्म periodically run हुन्छ", jp: "デバウンスは呼び出しが止まった後に一度実行され、スロットルは呼び出しが続く間周期的に実行される" },
        { en: "They are functionally identical, just named differently", np: "यी functionally उस्तै हुन्, नाम मात्र फरक हो", jp: "機能的には同一で、名前が違うだけ" },
      ],
      correctIndex: 0,
      explanation: { en: "Debounce waits for quiet and fires once; throttle fires immediately and then at most once per interval as long as calls keep arriving — the two solve different timing problems.", np: "Debounce शान्तताको लागि wait गरी एक पटक fire हुन्छ; throttle तुरुन्तै fire भई calls आइरहेसम्म हर interval मा अधिकतम एक पटक fire हुन्छ — यी दुईले फरक timing समस्या solve गर्छन्।", jp: "デバウンスは静止を待って一度発火し、スロットルは即座に発火してから呼び出しが続く限りインターバルごとに最大一度発火する — この2つは異なるタイミングの問題を解決する。" },
    },
    {
      question: { en: "Which is the better fit for a search-as-you-type input?", np: "Search-as-you-type input का लागि कुन बेस्ट फिट हो?", jp: "検索入力（入力中に検索する機能）に適しているのはどちら？" },
      options: [
        { en: "Debounce — only fetch once the user stops typing", np: "Debounce — user typing रोकेपछि मात्र fetch गर्नु", jp: "デバウンス — ユーザーが入力を止めた時だけフェッチする" },
        { en: "Throttle — fetch on a fixed interval regardless of typing", np: "Throttle — typing भइरहोस् वा नहोस् निश्चित interval मा fetch गर्नु", jp: "スロットル — 入力に関わらず一定間隔でフェッチする" },
      ],
      correctIndex: 0,
      explanation: { en: "Only the final search query matters, so debouncing avoids firing a request on every keystroke.", np: "अन्तिम search query मात्र चासोको विषय हो, त्यसैले debouncing ले हरेक keystroke मा request fire हुनबाट जोगाउँछ।", jp: "最終的な検索クエリだけが重要なので、デバウンスすることで各キー入力ごとのリクエスト発生を避けられる。" },
    },
    {
      question: { en: "In a throttle implementation using lastCallTime, what happens to a call that arrives before intervalMs has elapsed?", np: "lastCallTime प्रयोग गर्ने throttle implementation मा, intervalMs नबितिकनै आउने call को के हुन्छ?", jp: "lastCallTimeを使うスロットル実装において、intervalMsが経過する前に来た呼び出しはどうなる？" },
      options: [
        { en: "It's silently ignored", np: "यो silently ignore हुन्छ", jp: "黙って無視される" },
        { en: "It's queued and run right after the interval ends", np: "यो queue मा राखिन्छ र interval सकिएपछि तुरुन्तै run हुन्छ", jp: "キューに入れられ、インターバル終了直後に実行される" },
      ],
      correctIndex: 0,
      explanation: { en: "The basic throttle shown just drops calls that arrive too soon; it doesn't queue them for later — only the timing check on the next call decides whether that one runs.", np: "देखाइएको basic throttle ले चाँडो आउने calls लाई सिधै drop गर्छ; ती लाई पछिको लागि queue गर्दैन — अर्को call को समय जाँचले मात्र त्यो run हुने कि नहुने निर्णय गर्छ।", jp: "示された基本的なスロットルは、早く来すぎた呼び出しを単に捨てる。後で実行するためにキューに入れることはない — 次の呼び出しのタイミングチェックだけがそれを実行するかどうかを決める。" },
    },
    {
      question: { en: "What does memoize(fn) use as the cache key by default?", np: "memoize(fn) ले default रूपमा cache key को रूपमा के प्रयोग गर्छ?", jp: "memoize(fn)はデフォルトで何をキャッシュキーとして使う？" },
      options: [
        { en: "The JSON.stringify of the arguments", np: "Arguments को JSON.stringify", jp: "引数のJSON.stringify" },
        { en: "The function's name", np: "Function को नाम", jp: "関数の名前" },
      ],
      correctIndex: 0,
      explanation: { en: "Serializing the arguments with JSON.stringify produces a unique string key per distinct set of inputs, which is how the cache tells calls apart.", np: "JSON.stringify ले arguments लाई serialize गरी प्रत्येक फरक inputs सेट को लागि unique string key बनाउँछ, यसैले cache ले calls छुट्याउन सक्छ।", jp: "JSON.stringifyで引数をシリアライズすることで、異なる入力の組み合わせごとに一意の文字列キーが生成され、これによりキャッシュが呼び出しを区別できる。" },
    },
    {
      question: { en: "Why is it wrong to memoize a function that calls Math.random()?", np: "Math.random() call गर्ने function memoize गर्नु किन गलत हो?", jp: "Math.random()を呼ぶ関数をメモ化するのが間違っている理由は？" },
      options: [
        { en: "It would always return the same first random value for a given set of arguments", np: "यसले दिइएको arguments सेट का लागि सधैं पहिलो random value नै फर्काउँछ", jp: "与えられた引数の組み合わせに対して、常に最初の乱数値を返してしまう" },
        { en: "Math.random() cannot be called inside memoized functions at all", np: "Math.random() लाई memoized functions भित्र call नै गर्न सकिँदैन", jp: "Math.random()はメモ化された関数の中では全く呼び出せない" },
      ],
      correctIndex: 0,
      explanation: { en: "The cache stores whatever the first call returned and replays it forever after, so the \"randomness\" freezes at the first computed value.", np: "Cache ले पहिलो call ले फर्काएको जुनसुकै कुरा store गरी सधैंभरि त्यही replay गर्छ, त्यसैले \"randomness\" पहिलो computed value मा freeze हुन्छ।", jp: "キャッシュは最初の呼び出しが返した値を保存し、それ以降永久に再生する。そのため「ランダム性」は最初に計算された値で固定される。" },
    },
    {
      question: { en: "What's the benefit of using a WeakMap instead of a Map when the cache key is an object?", np: "Cache key object हुँदा Map को सट्टा WeakMap प्रयोग गर्नुको फायदा के हो?", jp: "キャッシュキーがオブジェクトの場合、Mapの代わりにWeakMapを使う利点は？" },
      options: [
        { en: "Cached entries can be garbage-collected once nothing else references that object", np: "त्यो object अन्त कतै reference नरहेपछि cached entries garbage-collected हुन सक्छ", jp: "他にそのオブジェクトを参照するものがなくなった時点で、キャッシュエントリをガベージコレクションできる" },
        { en: "WeakMap supports more data types as keys than Map", np: "WeakMap ले Map भन्दा बढी data types लाई keys को रूपमा support गर्छ", jp: "WeakMapはMapよりも多くのデータ型をキーとしてサポートする" },
      ],
      correctIndex: 0,
      explanation: { en: "A WeakMap holds its keys weakly, so the cache doesn't prevent the object from being freed once nothing else in the app references it — avoiding a memory leak a plain Map would cause.", np: "WeakMap ले आफ्ना keys लाई weakly राख्छ, त्यसैले app मा अन्त कतै reference नरहेपछि cache ले object free हुनबाट रोक्दैन — plain Map ले हुने memory leak बाट जोगिन्छ।", jp: "WeakMapはキーを弱く保持するため、アプリの他の場所からそのオブジェクトへの参照がなくなった時点で、キャッシュがそれの解放を妨げない — 通常のMapが引き起こすメモリリークを避けられる。" },
    },
    {
      question: { en: "What must a script running inside a Web Worker communicate with the main thread through?", np: "Web Worker भित्र चलिरहेको script ले main thread सँग केमार्फत communicate गर्नुपर्छ?", jp: "Web Worker内で実行されるスクリプトは、メインスレッドと何を通じて通信しなければならない？" },
      options: [
        { en: "postMessage() and onmessage — there's no shared memory", np: "postMessage() र onmessage — shared memory हुँदैन", jp: "postMessage()とonmessage — 共有メモリは存在しない" },
        { en: "Directly reading and writing to document", np: "Document मा directly read/write गर्दै", jp: "documentを直接読み書きする" },
      ],
      correctIndex: 0,
      explanation: { en: "Workers and the main thread run in separate contexts with no shared memory, so postMessage()/onmessage is the only channel between them.", np: "Workers र main thread अलग-अलग contexts मा shared memory बिना चल्छन्, त्यसैले postMessage()/onmessage मात्र तिनीहरू बीचको channel हो।", jp: "Workerとメインスレッドは共有メモリのない別々のコンテキストで実行されるため、postMessage()/onmessageが両者間の唯一の経路となる。" },
    },
    {
      question: { en: "What does passing an ArrayBuffer as a transferable object to postMessage() achieve?", np: "postMessage() मा ArrayBuffer लाई transferable object को रूपमा pass गर्दा के achieve हुन्छ?", jp: "postMessage()にArrayBufferを転送可能オブジェクトとして渡すと何が実現される？" },
      options: [
        { en: "Moves ownership to the worker with zero-copy instead of cloning the whole buffer", np: "पूरै buffer clone गर्नुको सट्टा zero-copy मार्फत ownership worker मा सार्छ", jp: "バッファ全体をクローンする代わりに、ゼロコピーで所有権をワーカーに移す" },
        { en: "Makes the buffer readable by both threads simultaneously", np: "Buffer लाई दुवै threads ले एकैसाथ readable बनाउँछ", jp: "バッファを両スレッドが同時に読み取れるようにする" },
      ],
      correctIndex: 0,
      explanation: { en: "Transferring moves ownership of the underlying memory to the worker without copying it, which is much cheaper for large buffers than the default structured-clone copy — but the sending side loses access to it afterward.", np: "Transfer गर्दा underlying memory को ownership copy नगरी worker मा सर्छ, जो ठूला buffers का लागि default structured-clone copy भन्दा धेरै सस्तो हुन्छ — तर त्यसपछि sending side ले त्यसमा access गुमाउँछ।", jp: "転送することで基盤となるメモリの所有権がコピーなしでワーカーに移る。大きなバッファに対しては、デフォルトの構造化クローンコピーよりずっと安価だが、送信側はその後アクセスを失う。" },
    },
  ],
};
