import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_17_LESSONS: JsLessonDay = {
  day: 17,
  title: { en: "Advanced promise patterns — retry, timeout & concurrency", np: "Advanced Promise patterns", jp: "Promise応用パターン" },
  totalMinutes: 27,
  difficulty: { en: "Intermediate", np: "Intermediate", jp: "中級" },
  lessons: [
    {
      id: "retry-backoff",
      title: { en: "Retry with Exponential Backoff", np: "Exponential Backoff सहित Retry", jp: "指数バックオフによるリトライ" },
      durationMinutes: 9,
      explanation: {
        en: "A naive retry loop that keeps retrying forever on any failure is dangerous — one broken request can turn into an infinite hammering loop that never gives up, making an already-struggling server (or network) even worse. The first fix is simple: only retry up to a `maxAttempts` count, and rethrow the error once that limit is hit so the caller can react instead of waiting forever.\n\nRetrying too quickly stacks the odds against a recovering service, so real retry logic uses <b>exponential backoff</b> — each retry waits roughly double the previous delay (`baseDelayMs * 2 ** attempt`), so waits spread out as 1s, 2s, 4s, 8s... That growth is capped at a `maxDelayMs` so a flaky call never ends up waiting minutes between tries. On top of that, add <b>jitter</b> — a small random amount added to the delay — because if every client backs off using the exact same formula, they all retry at the exact same instant, creating a synchronized \"retry storm\" that re-overwhelms the service the moment it starts to recover.\n\nNot every failure deserves a retry. A `shouldRetry` predicate should only allow retries for genuinely transient failures: `5xx` server errors, network failures (the request never reached the server), and `429 Too Many Requests`. Client errors in the `4xx` range (bad input, missing auth, not found) fail identically every time, so retrying them just wastes time. And you should never blindly retry a non-idempotent operation (like a `POST` that creates a new record) without an <b>idempotency key</b> — if the first request actually succeeded but its response was lost, a retry could create a duplicate record.",
        np: "कुनै पनि failure मा सधैं retry गर्ने naive retry loop खतरनाक हुन्छ — एउटा broken request ले कहिल्यै नरोकिने infinite hammering loop बन्न सक्छ, जसले पहिले नै struggle गरिरहेको server (वा network) लाई अझ खराब बनाउँछ। पहिलो fix सजिलो छ: `maxAttempts` count सम्म मात्र retry गर्नु, र त्यो limit पुगेपछि error rethrow गर्नु ताकि caller ले सधैं wait नगरी react गर्न सकोस्।\n\nधेरै छिटो retry गर्दा recover हुँदै गरेको service माथि थप pressure पर्छ, त्यसैले real retry logic ले <b>exponential backoff</b> प्रयोग गर्छ — हरेक retry ले अघिल्लो delay भन्दा लगभग दोब्बर wait गर्छ (`baseDelayMs * 2 ** attempt`), त्यसैले waits 1s, 2s, 4s, 8s... गरी फैलिन्छन्। यो growth लाई `maxDelayMs` मा cap गरिन्छ ताकि flaky call ले कहिल्यै मिनेटौं wait नगरोस्। यसमाथि, <b>jitter</b> थप्नुहोस् — delay मा थपिने सानो random amount — किनकि हरेक client ले उही exact formula प्रयोग गरी backoff गरे भने, सबैले उही exact instant मा retry गर्छन्, जसले service recover हुन थाल्ने बित्तिकै फेरि overwhelm गर्ने synchronized \"retry storm\" सिर्जना गर्छ।\n\nहरेक failure ले retry पाउनु पर्दैन। `shouldRetry` predicate ले साँच्चै transient failures लाई मात्र retry गर्न दिनुपर्छ: `5xx` server errors, network failures (request server सम्म पुगेकै थिएन), र `429 Too Many Requests`। `4xx` range का client errors (गलत input, auth छैन, फेला परेन) हरेक पटक उस्तै रूपमा fail हुन्छन्, त्यसैले तिनलाई retry गर्नु समय खेर फाल्नु मात्र हो। र non-idempotent operation (जस्तै नयाँ record बनाउने `POST`) लाई <b>idempotency key</b> बिना कहिल्यै blindly retry नगर्नुहोस् — पहिलो request वास्तवमा सफल भइसकेको तर response हराएको भए, retry ले duplicate record बनाउन सक्छ।",
        jp: "どんな失敗でも永遠にリトライを続けるナイーブなリトライループは危険 — 1つの壊れたリクエストが決して止まらない無限のハンマリングループになり、すでに苦しんでいるサーバー（またはネットワーク）をさらに悪化させる。最初の対策は単純: `maxAttempts`回までしかリトライせず、その上限に達したらエラーを再スローし、呼び出し側が永遠に待つ代わりに対応できるようにする。\n\nリトライが速すぎると回復中のサービスに不利になるため、実際のリトライロジックは<b>指数バックオフ</b>を使う — 各リトライは前回の待機時間のおおよそ2倍待つ（`baseDelayMs * 2 ** attempt`）ため、待機は1秒、2秒、4秒、8秒…と広がっていく。この増加は`maxDelayMs`で上限が設けられ、不安定な呼び出しが何分も待つことにはならない。さらに<b>ジッター</b>を加える — 遅延に加えるわずかなランダム量 — なぜなら全クライアントが全く同じ式でバックオフすれば、全員が全く同じ瞬間にリトライし、サービスが回復し始めた瞬間に再び過負荷にする同期的な「リトライストーム」を生み出すからだ。\n\nすべての失敗がリトライに値するわけではない。`shouldRetry`述語は本当に一時的な失敗だけをリトライすべき: `5xx`サーバーエラー、ネットワーク障害（リクエストがサーバーに届かなかった）、`429 Too Many Requests`。`4xx`系のクライアントエラー（入力ミス・認証なし・見つからない）は毎回同じように失敗するため、リトライは時間の無駄になる。そして冪等でない操作（新しいレコードを作る`POST`など）を<b>冪等性キー</b>なしで盲目的にリトライしてはならない — 最初のリクエストが実際には成功していたがレスポンスが失われた場合、リトライは重複レコードを作ってしまう可能性がある。",
      },
      diagram: `retryWithBackoff(fn, { maxAttempts: 4 })

attempt 1 ──fails──► wait ~1s + jitter  ┐
attempt 2 ──fails──► wait ~2s + jitter  │  exponential backoff
attempt 3 ──fails──► wait ~4s + jitter  │  (capped at maxDelayMs)
attempt 4 ──fails──► throw (last attempt, no more waiting)

shouldRetry(err) gate checked on every failure:
  5xx / network error / 429 Too Many Requests  → retry
  4xx client error (400, 401, 403, 404)        → throw immediately, never retry
  non-idempotent write, no idempotency key     → never retry blindly`,
      codeExample: {
        title: { en: "Retrying transient failures with exponential backoff + jitter", np: "Exponential backoff + jitter सहित transient failures retry गर्नु", jp: "指数バックオフ+ジッターで一時的な失敗をリトライ" },
        code: `// ── Attempt limit — stop eventually, don't hammer forever ──────────
async function retry(fn, maxAttempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      console.log(\`Attempt \${attempt}/\${maxAttempts} failed: \${err.message}\`);
    }
  }
  throw lastError; // every attempt failed — let the caller handle it
}

// ── Exponential backoff + jitter + a "should I even retry?" gate ───
function isTransient(err) {
  if (err.name === "TypeError") return true;   // network failure, fetch never landed
  if (err.status === 429) return true;          // rate limited — back off and try again
  if (err.status >= 500) return true;           // server-side, may be temporary
  return false;                                  // 4xx client errors — retrying won't help
}

async function retryWithBackoff(fn, {
  maxAttempts = 4,
  baseDelayMs = 1000,
  maxDelayMs  = 30_000,
  shouldRetry = isTransient,
} = {}) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isLastAttempt = attempt === maxAttempts;
      if (isLastAttempt || !shouldRetry(err)) throw err;

      const exponential = baseDelayMs * 2 ** (attempt - 1);   // 1s, 2s, 4s, 8s...
      const jitter       = Math.random() * baseDelayMs;        // avoid a synchronized retry storm
      const delay        = Math.min(exponential + jitter, maxDelayMs);

      console.log(\`Attempt \${attempt} failed (\${err.status ?? err.name}). Retrying in \${Math.round(delay)}ms\`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// ── Usage — fetch that throws a shaped error on non-2xx responses ──
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw Object.assign(new Error(\`HTTP \${res.status}\`), { status: res.status });
  return res.json();
}

const order = await retryWithBackoff(() => fetchJson("/api/orders/42"), {
  maxAttempts: 5,
  baseDelayMs: 500,
});

// Creating a resource? Never retry blindly — pass an idempotency key so the
// server can recognize and safely ignore a duplicate retried request.
await retryWithBackoff(() =>
  fetch("/api/orders", {
    method: "POST",
    headers: { "Idempotency-Key": orderRequestId },
    body: JSON.stringify(orderPayload),
  })
);`,
      },
      keyTakeaways: [
        { en: "Always cap retries with a `maxAttempts` limit and rethrow on the final failure — a retry loop with no limit can hammer a struggling service forever.", np: "सधैं `maxAttempts` limit ले retries cap गर्नुहोस् र final failure मा rethrow गर्नुहोस् — कुनै limit नभएको retry loop ले struggle गरिरहेको service लाई सधैंभरि हान्न सक्छ।", jp: "常に`maxAttempts`の上限でリトライを制限し、最後の失敗で再スローする — 上限のないリトライループは苦しんでいるサービスを永遠に叩き続けてしまう。" },
        { en: "Exponential backoff (`baseDelayMs * 2 ** attempt`) spaces out retries so they don't pile pressure on a recovering service, capped by `maxDelayMs`; random jitter on top prevents many clients from retrying at the exact same synchronized instant.", np: "Exponential backoff (`baseDelayMs * 2 ** attempt`) ले retries लाई फैलाउँछ ताकि recover हुँदै गरेको service माथि pressure नथपिन्, `maxDelayMs` ले cap गरिन्छ; माथि थपिने random jitter ले धेरै clients लाई एउटै exact synchronized instant मा retry हुनबाट रोक्छ।", jp: "指数バックオフ（`baseDelayMs * 2 ** attempt`）はリトライを分散させ、回復中のサービスに圧力を積み重ねないようにし、`maxDelayMs`で上限を設ける。さらに加えるランダムなジッターは、多数のクライアントが全く同じ同期した瞬間にリトライすることを防ぐ。" },
        { en: "A `shouldRetry` predicate should only retry transient failures (5xx, network errors, 429) — never retry 4xx client errors, and never retry a non-idempotent write without an idempotency key.", np: "`shouldRetry` predicate ले transient failures (5xx, network errors, 429) मात्र retry गर्नुपर्छ — 4xx client errors कहिल्यै retry नगर्नुहोस्, र idempotency key बिना non-idempotent write कहिल्यै retry नगर्नुहोस्।", jp: "`shouldRetry`述語は一時的な失敗（5xx・ネットワークエラー・429）だけをリトライすべき — 4xxクライアントエラーは絶対にリトライせず、冪等性キーのない冪等でない書き込みも絶対にリトライしない。" },
      ],
      commonMistakes: [
        { en: "Writing a retry loop with no attempt limit and no jitter, which under load turns one flaky endpoint into a synchronized storm of simultaneous retries.", np: "कुनै attempt limit र jitter नभएको retry loop लेख्नु, जसले load मा एउटा flaky endpoint लाई simultaneous retries को synchronized storm मा बदलिदिन्छ।", jp: "試行回数の上限もジッターもないリトライループを書くこと。負荷がかかると1つの不安定なエンドポイントが同期した一斉リトライの嵐に変わってしまう。" },
        { en: "Retrying every error indiscriminately, including 4xx client errors that will fail identically on every attempt and just waste time.", np: "हरेक error लाई विना विचार retry गर्नु, 4xx client errors समेत जो हरेक attempt मा उस्तै रूपमा fail हुन्छन् र समय मात्र खेर फाल्छन्।", jp: "4xxクライアントエラーを含め、すべてのエラーを無差別にリトライすること。これは毎回同じように失敗し、時間を無駄にするだけ。" },
        { en: "Retrying a POST/create request after a timeout without an idempotency key, risking a duplicate record if the original request actually succeeded.", np: "Timeout पछि idempotency key बिना POST/create request retry गर्नु, original request वास्तवमा सफल भएको भए duplicate record बनाउने जोखिम बढाउनु।", jp: "冪等性キーなしでタイムアウト後にPOST/作成リクエストをリトライすること。元のリクエストが実際に成功していた場合、重複レコードのリスクがある。" },
      ],
      quiz: [
        {
          question: { en: "What does exponential backoff do to the delay between retry attempts?", np: "Exponential backoff ले retry attempts बीचको delay लाई के गर्छ?", jp: "指数バックオフはリトライ試行間の遅延に対して何をする？" },
          options: [
            { en: "Roughly doubles it after each failure, capped at a maximum delay", np: "हरेक failure पछि लगभग दोब्बर बनाउँछ, maximum delay मा cap गरिएको", jp: "各失敗ごとにおおよそ2倍にし、最大遅延で上限を設ける" },
            { en: "Keeps it exactly the same fixed value every time", np: "हरेक पटक ठ्याक्कै उही fixed value राख्छ", jp: "毎回全く同じ固定値のままにする" },
          ],
          correctIndex: 0,
          explanation: { en: "Each retry waits roughly double the previous delay (baseDelayMs * 2 ** attempt), capped at maxDelayMs so the wait never grows unbounded.", np: "हरेक retry ले अघिल्लो delay भन्दा लगभग दोब्बर wait गर्छ (baseDelayMs * 2 ** attempt), maxDelayMs मा cap गरिएको ताकि wait असीमित रूपमा नबढ्न।", jp: "各リトライは前回の遅延のおおよそ2倍待つ（baseDelayMs * 2 ** attempt）。maxDelayMsで上限が設けられ、待機が無限に増えることはない。" },
        },
        {
          question: { en: "Why add random jitter to a retry's backoff delay?", np: "Retry को backoff delay मा random jitter किन थपिन्छ?", jp: "リトライのバックオフ遅延にランダムなジッターを加える理由は？" },
          options: [
            { en: "To prevent many clients from retrying at the exact same synchronized instant", np: "धेरै clients लाई एउटै exact synchronized instant मा retry हुनबाट रोक्न", jp: "多数のクライアントが全く同じ同期した瞬間にリトライするのを防ぐため" },
            { en: "To make the retry function run faster", np: "Retry function लाई छिटो चलाउन", jp: "リトライ関数をより速く実行するため" },
          ],
          correctIndex: 0,
          explanation: { en: "If every client backs off with the exact same formula, they all retry in lockstep; jitter randomizes the delay so retries spread out instead of storming the service together.", np: "हरेक client ले उही formula प्रयोग गरी backoff गरे भने, सबैले lockstep मा retry गर्छन्; jitter ले delay लाई random बनाई retries एकसाथ storm नगरी फैलिन्छ।", jp: "全クライアントが全く同じ式でバックオフすると、全員が同期してリトライしてしまう。ジッターは遅延をランダム化し、リトライが一斉に押し寄せるのではなく分散するようにする。" },
        },
        {
          question: { en: "Should a `shouldRetry` predicate allow retrying a `404 Not Found` response?", np: "`shouldRetry` predicate ले `404 Not Found` response लाई retry गर्न दिनुपर्छ?", jp: "`shouldRetry`述語は`404 Not Found`レスポンスのリトライを許可すべきか？" },
          options: [
            { en: "No — 4xx client errors will fail identically on every retry", np: "होइन — 4xx client errors हरेक retry मा उस्तै रूपमा fail हुन्छन्", jp: "いいえ — 4xxクライアントエラーは毎回同じように失敗する" },
            { en: "Yes — retry it exactly like a transient 5xx error", np: "हो — यसलाई transient 5xx error जस्तै retry गर्नुपर्छ", jp: "はい — 一時的な5xxエラーと同様にリトライすべき" },
          ],
          correctIndex: 0,
          explanation: { en: "404 means the resource genuinely doesn't exist — retrying won't change that outcome, unlike a transient 5xx or network failure.", np: "404 को अर्थ resource साँच्चै अवस्थित छैन — retry ले त्यो outcome बदल्दैन, transient 5xx वा network failure भन्दा फरक।", jp: "404はリソースが本当に存在しないことを意味する — 一時的な5xxやネットワーク障害と異なり、リトライしてもその結果は変わらない。" },
        },
      ],
    },
    {
      id: "timeout-race",
      title: { en: "Timeout, Promise.race & Circuit Breakers", np: "Timeout, Promise.race र Circuit Breakers", jp: "タイムアウト・Promise.race・サーキットブレーカー" },
      durationMinutes: 9,
      explanation: {
        en: "A promise with no deadline can hang forever — if a server never responds, `await fetch(url)` simply waits, and your app freezes on it. `Promise.race([...])` settles as soon as the <b>first</b> of its input promises settles, so you can build a manual timeout by racing the real operation against a promise that does nothing but `reject` after N milliseconds — whichever finishes first (the real result, or the timeout rejection) wins, and the loser is simply ignored, its result discarded.\n\nFor `fetch()` specifically, the browser gives you a cleaner tool: `AbortController`. You create a controller, pass its `signal` into `fetch`, and call `controller.abort()` after a `setTimeout` — this doesn't just reject your promise, it actually cancels the underlying network request, freeing up the connection. Because the timer keeps running even after a successful response, you must clear it with `clearTimeout()` inside a `finally` block — otherwise a fast response still leaves a stray timer sitting in memory.\n\nTimeouts protect a single call, but if a downstream service is completely down, timing out on every single call still wastes time and keeps hammering it. A <b>circuit breaker</b> tracks failures and switches between states: <b>closed</b> (normal — calls go through), <b>open</b> (too many recent failures — calls fail immediately without even trying, for a cooldown period), and <b>half-open</b> (cooldown elapsed — let exactly one call through as a test; success closes the circuit again, failure re-opens it). This protects both the failing service (no traffic while it recovers) and your own app (instant failures instead of every caller waiting out a timeout).",
        np: "कुनै deadline नभएको promise कहिल्यै hang हुन सक्छ — server ले कहिल्यै response नदिए, `await fetch(url)` ले सजिलै wait गर्छ, र तपाईंको app त्यसैमा freeze हुन्छ। `Promise.race([...])` ले आफ्ना input promises मध्ये <b>पहिलो</b> settle हुने बित्तिकै settle हुन्छ, त्यसैले वास्तविक operation लाई N milliseconds पछि मात्र `reject` गर्ने promise सँग race गराई manual timeout बनाउन सकिन्छ — जो पहिले पुग्छ (वास्तविक result, वा timeout rejection) त्यही जित्छ, र हार्ने चाहिं simply ignore हुन्छ, यसको result discard हुन्छ।\n\nखास गरी `fetch()` का लागि, browser ले cleaner tool दिन्छ: `AbortController`। तपाईं controller बनाउनुहोस्, यसको `signal` लाई `fetch` मा pass गर्नुहोस्, र `setTimeout` पछि `controller.abort()` call गर्नुहोस् — यसले तपाईंको promise लाई reject मात्र गर्दैन, यसले वास्तवमा underlying network request cancel गरी connection free गर्छ। Timer सफल response पछि पनि चलिरहन्छ, त्यसैले `finally` block भित्र `clearTimeout()` ले यसलाई clear गर्नुपर्छ — नत्र छिटो response आए पनि memory मा एउटा stray timer बाँकी रहन्छ।\n\nTimeout ले एउटै call लाई protect गर्छ, तर downstream service पूर्ण रूपमा down भएमा, हरेक single call मा timeout हुनु अझै समय खेर फाल्नु र त्यसलाई hammer गर्नु नै हो। <b>Circuit breaker</b> ले failures track गर्छ र states बीच switch गर्छ: <b>closed</b> (normal — calls जान्छन्), <b>open</b> (धेरै recent failures भएमा — calls प्रयास नगरी तुरुन्तै fail हुन्छन्, cooldown period का लागि), र <b>half-open</b> (cooldown सकिएपछि — test को रूपमा ठ्याक्कै एउटा call जान दिनुहोस्; सफल भए circuit फेरि close हुन्छ, fail भए फेरि open हुन्छ)। यसले failing service (recover हुँदा traffic नहुने) र तपाईंको आफ्नै app (हरेक caller ले पूरा timeout wait गर्नुको सट्टा instant failures) दुवैलाई protect गर्छ।",
        jp: "期限のないPromiseは永遠にハングすることがある — サーバーが決して応答しなければ、`await fetch(url)`は単に待ち続け、アプリはそこで固まる。`Promise.race([...])`は入力されたPromiseのうち<b>最初に</b>確定したもので確定するため、実際の操作をNミリ秒後に`reject`するだけのPromiseと競争させることで手動タイムアウトを作れる — どちらが先に終わるか（本来の結果か、タイムアウトの拒否か）が勝ち、負けた方は単に無視され結果は捨てられる。\n\n特に`fetch()`については、ブラウザがより洗練された手段`AbortController`を提供する。コントローラーを作成し、その`signal`を`fetch`に渡し、`setTimeout`の後に`controller.abort()`を呼ぶ — これはPromiseを拒否するだけでなく、実際に基盤のネットワークリクエストをキャンセルし、接続を解放する。タイマーは成功したレスポンスの後も動き続けるため、`finally`ブロック内で`clearTimeout()`によりクリアする必要がある — そうしなければ速いレスポンスでもメモリ上に迷子のタイマーが残ってしまう。\n\nタイムアウトは1回の呼び出しを保護するが、下流のサービスが完全にダウンしている場合、毎回タイムアウトするだけでも時間を無駄にし、叩き続けることになる。<b>サーキットブレーカー</b>は失敗を追跡し状態を切り替える: <b>closed</b>（通常 — 呼び出しが通る）、<b>open</b>（最近の失敗が多すぎる — クールダウン期間中、試すことなく即座に失敗する）、<b>half-open</b>（クールダウン終了 — テストとして1回だけ呼び出しを通す。成功すればサーキットは再びcloseし、失敗すれば再びopenになる）。これは失敗しているサービス（回復中はトラフィックがない）と自分のアプリ（すべての呼び出し元がタイムアウトを待つ代わりに即座に失敗する）の両方を保護する。",
      },
      diagram: `Promise.race([ realOperation(), timeout(5000) ])
  realOperation() ──slow...────────X   (still pending, ignored — NOT cancelled)
  timeout(5000)   ──5000ms──► rejects  ← wins the race, race() rejects too

AbortController (preferred for fetch):
  controller = new AbortController()
  setTimeout(() => controller.abort(), 5000)
  fetch(url, { signal: controller.signal })   ← actually cancels the request
  finally { clearTimeout(timer) }             ← always clean up, success or fail

Circuit breaker states:
  CLOSED ──(failures >= threshold)──► OPEN ──(cooldown elapses)──► HALF-OPEN
    ▲                                                                  │
    └───────────────────(test call succeeds)─────────────────────────┘
                          (test call fails) ───────────────────────► OPEN`,
      codeExample: {
        title: { en: "Timing out slow calls and breaking the circuit on a failing service", np: "Slow calls लाई timeout गर्नु र failing service मा circuit break गर्नु", jp: "遅い呼び出しのタイムアウトと失敗するサービスのサーキットブレーク" },
        code: `// ── Manual timeout with Promise.race ────────────────────────────────
function timeout(ms, message = \`Timed out after \${ms}ms\`) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));
}

async function withTimeout(promise, ms) {
  return Promise.race([promise, timeout(ms)]);
  // whichever settles first wins — the loser's result is just discarded
}

const user = await withTimeout(fetchUser(id), 5000);

// ── Preferred: AbortController actually cancels the network request ─
async function fetchWithTimeout(url, ms = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.json();
  } finally {
    clearTimeout(timer);   // clear it whether we succeeded, failed, or aborted
  }
}

// ── Circuit breaker — stop calling a service that's clearly down ────
class CircuitBreaker {
  #failureCount = 0;
  #state = "closed";       // "closed" | "open" | "half-open"
  #nextAttemptAt = 0;

  constructor(fn, { threshold = 3, cooldownMs = 10_000 } = {}) {
    this.fn = fn;
    this.threshold = threshold;
    this.cooldownMs = cooldownMs;
  }

  async call(...args) {
    if (this.#state === "open") {
      if (Date.now() < this.#nextAttemptAt) {
        throw new Error("Circuit open — service assumed down, failing fast");
      }
      this.#state = "half-open";   // cooldown over, let one test call through
    }

    try {
      const result = await this.fn(...args);
      this.#failureCount = 0;      // success resets everything
      this.#state = "closed";
      return result;
    } catch (err) {
      this.#failureCount++;
      if (this.#state === "half-open" || this.#failureCount >= this.threshold) {
        this.#state = "open";
        this.#nextAttemptAt = Date.now() + this.cooldownMs;
      }
      throw err;
    }
  }
}

const breaker = new CircuitBreaker(() => fetchWithTimeout("/api/payments"), {
  threshold: 3,
  cooldownMs: 15_000,
});

await breaker.call();   // after 3 failures, every call fails instantly for 15s`,
      },
      keyTakeaways: [
        { en: "`Promise.race([operation, timeout])` settles with whichever promise finishes first — a workable manual timeout, but the loser keeps running unseen in the background since race can't actually cancel it.", np: "`Promise.race([operation, timeout])` जो promise पहिले पुग्छ त्यसैसँग settle हुन्छ — काम लाग्ने manual timeout हो, तर race ले वास्तवमा cancel गर्न नसक्ने भएकाले हार्ने चाहिं background मा अदृश्य रूपमा चलिरहन्छ।", jp: "`Promise.race([operation, timeout])`はどちらか先に終わったPromiseで確定する — 有効な手動タイムアウトだが、raceは実際にはキャンセルできないため、負けた方は見えないままバックグラウンドで動き続ける。" },
        { en: "`AbortController` is the preferred way to time out `fetch()` — its `signal` actually cancels the network request, and the timer must be cleared with `clearTimeout()` inside a `finally` block to avoid leaking a stray timer.", np: "`fetch()` लाई timeout गर्ने preferred तरिका `AbortController` हो — यसको `signal` ले वास्तवमा network request cancel गर्छ, र stray timer leak हुन नदिन `finally` block भित्र `clearTimeout()` ले timer clear गर्नुपर्छ।", jp: "`fetch()`をタイムアウトさせる推奨方法は`AbortController` — その`signal`は実際にネットワークリクエストをキャンセルし、迷子のタイマーが漏れないよう`finally`ブロック内で`clearTimeout()`でクリアする必要がある。" },
        { en: "A circuit breaker moves between `closed` (normal), `open` (fail fast, no calls sent) and `half-open` (one test call after cooldown) states, protecting both a struggling service and callers who'd otherwise wait out a timeout on every request.", np: "Circuit breaker `closed` (normal), `open` (fail fast, कुनै call नजाने) र `half-open` (cooldown पछि एउटा test call) states बीच घुम्छ, जसले struggle गरिरहेको service र नत्र हरेक request मा timeout wait गर्नुपर्ने callers दुवैलाई protect गर्छ।", jp: "サーキットブレーカーは`closed`（通常）、`open`（即座に失敗、呼び出し送信なし）、`half-open`（クールダウン後の1回のテスト呼び出し）の状態間を移動し、苦しんでいるサービスと、そうでなければ毎回のリクエストでタイムアウトを待つ羽目になる呼び出し元の両方を保護する。" },
      ],
      commonMistakes: [
        { en: "Using `Promise.race` for a timeout but forgetting the original operation is still running in the background — it isn't actually cancelled, just ignored.", np: "Timeout का लागि `Promise.race` प्रयोग गर्नु तर original operation अझै background मा चलिरहेको बिर्सनु — यो वास्तवमा cancel हुँदैन, केवल ignore हुन्छ।", jp: "タイムアウトに`Promise.race`を使うが、元の操作がまだバックグラウンドで動いていることを忘れること — 実際にはキャンセルされておらず、無視されているだけ。" },
        { en: "Forgetting to `clearTimeout()` the abort timer in a `finally` block, leaving a stray timer running after a fast, successful response.", np: "`finally` block मा abort timer लाई `clearTimeout()` गर्न बिर्सनु, छिटो सफल response पछि पनि stray timer चलिरहनु।", jp: "`finally`ブロックでアボートタイマーを`clearTimeout()`し忘れ、速く成功したレスポンスの後も迷子のタイマーが動き続けること。" },
        { en: "Retrying or timing out on every single call to a completely dead service instead of using a circuit breaker, which keeps hammering it and makes every caller wait out the full timeout.", np: "पूर्ण रूपमा dead service मा circuit breaker प्रयोग नगरी हरेक single call मा retry वा timeout गर्नु, जसले त्यसलाई hammer गरिरहन्छ र हरेक caller लाई पूरा timeout wait गराउँछ।", jp: "完全に死んでいるサービスに対してサーキットブレーカーを使わず、毎回の呼び出しでリトライやタイムアウトを繰り返すこと。これはサービスを叩き続け、すべての呼び出し元にフルのタイムアウトを待たせる。" },
      ],
      quiz: [
        {
          question: { en: "What does `Promise.race([a, b])` settle with?", np: "`Promise.race([a, b])` कुनसँग settle हुन्छ?", jp: "`Promise.race([a, b])`は何で確定する？" },
          options: [
            { en: "Whichever of a or b settles first", np: "a वा b मध्ये जो पहिले settle हुन्छ", jp: "aかbのうち先に確定した方" },
            { en: "Always the result of a, ignoring b entirely", np: "सधैं a को result, b लाई पूर्ण रूपमा ignore गरी", jp: "常にaの結果で、bは完全に無視する" },
          ],
          correctIndex: 0,
          explanation: { en: "race() settles as soon as the first input promise settles, whether it resolves or rejects — the other is simply left running and ignored.", np: "race() पहिलो input promise settle हुने बित्तिकै settle हुन्छ, resolve वा reject जुनसुकै होस्; अर्को त simply चलिरहन्छ र ignore हुन्छ।", jp: "race()は最初のPromiseが確定した瞬間に確定する。resolveかrejectかは問わない — もう一方は単に動き続け無視される。" },
        },
        {
          question: { en: "Why is `AbortController` preferred over `Promise.race` for timing out a `fetch()` call?", np: "`fetch()` call timeout गर्न `Promise.race` भन्दा `AbortController` किन preferred छ?", jp: "`fetch()`呼び出しのタイムアウトに`Promise.race`より`AbortController`が好まれる理由は？" },
          options: [
            { en: "It actually cancels the underlying network request instead of just ignoring it", np: "यसले network request लाई केवल ignore गर्नुको सट्टा वास्तवमा cancel गर्छ", jp: "単に無視するのではなく、実際にネットワークリクエストをキャンセルする" },
            { en: "It makes the fetch resolve faster than normal", np: "यसले fetch लाई normal भन्दा छिटो resolve गराउँछ", jp: "fetchを通常より速く解決させる" },
          ],
          correctIndex: 0,
          explanation: { en: "Promise.race just ignores the loser; AbortController's signal actually tells the browser to abort the in-flight network request, freeing the connection.", np: "Promise.race ले हार्नेलाई केवल ignore गर्छ; AbortController को signal ले browser लाई in-flight network request abort गर्न वास्तवमा भन्छ, connection free गर्छ।", jp: "Promise.raceは負けた方を単に無視する。AbortControllerのsignalは実際にブラウザに進行中のネットワークリクエストをアボートさせ、接続を解放する。" },
        },
        {
          question: { en: "In the circuit breaker pattern, what happens while the circuit is in the `open` state?", np: "Circuit breaker pattern मा, circuit `open` state मा हुँदा के हुन्छ?", jp: "サーキットブレーカーパターンで、サーキットが`open`状態にある間何が起こる？" },
          options: [
            { en: "Calls fail immediately without being attempted, until a cooldown passes", np: "Cooldown नबितेसम्म calls प्रयास नगरी तुरुन्तै fail हुन्छन्", jp: "クールダウンが経過するまで、呼び出しは試みられることなく即座に失敗する" },
            { en: "Calls are retried immediately, faster than normal", np: "Calls तुरुन्तै, normal भन्दा छिटो retry हुन्छन्", jp: "呼び出しは通常より速く即座にリトライされる" },
          ],
          correctIndex: 0,
          explanation: { en: "The open state fails fast on purpose — no calls are even attempted until the cooldown elapses and the breaker moves to half-open to test recovery.", np: "Open state ले जानाजानी fail fast गर्छ — cooldown नबितेसम्म कुनै call प्रयास पनि हुँदैन, त्यसपछि breaker recovery test गर्न half-open मा जान्छ।", jp: "open状態は意図的に即座に失敗する — クールダウンが経過し、ブレーカーが回復をテストするためhalf-openに移るまで、呼び出しは試みられることさえない。" },
        },
      ],
    },
    {
      id: "concurrency-memoization",
      title: { en: "Concurrency Limiting & Async Memoization", np: "Concurrency Limiting र Async Memoization", jp: "同時実行数制限と非同期メモ化" },
      durationMinutes: 9,
      explanation: {
        en: "`Promise.all(urls.map(fetch))` looks convenient, but if `urls` has a thousand entries, it fires all thousand requests at the exact same instant — that can overwhelm your own server, trip a third-party API's rate limit, or exhaust the browser's per-host connection limit. What you actually want is bounded concurrency: run at most `N` tasks at a time, starting a new one only when an earlier one finishes. A common approach keeps a `Set` of currently in-flight promises; after starting a task, if the set has reached the limit, `await Promise.race(executing)` pauses until at least one finishes (removing itself from the set), and the loop keeps issuing new tasks until the input is exhausted.\n\nA related but different problem is <b>duplicate</b> requests: if five components on a page all independently call `fetchUser(1)` around the same time, without coordination that's five identical network requests for the same data. <b>Request deduplication</b> fixes this with an in-flight `Map` keyed by the request (e.g. the URL): before starting a fetch, check whether that key is already in the map; if so, return the <b>same</b> pending `Promise` to the new caller instead of starting another request, and remove the entry once it settles (typically in a `.finally()`).\n\n<b>Memoization</b> solves a related but distinct problem — caching results <b>across time</b>, not just for calls that overlap. An async memoizer wraps a function in a `Map` keyed by `JSON.stringify(args)`, storing both the resolved `value` and an `expiresAt` timestamp; a call first checks whether a fresh (non-expired) entry exists and returns it instantly, and only calls the real function — then stores a new entry — on a cache miss or after the TTL (time-to-live) has passed. Deduplication and memoization are often combined: dedup collapses concurrent identical calls into one in-flight request, while the TTL cache lets a later call reuse a result that already finished.",
        np: "`Promise.all(urls.map(fetch))` सुविधाजनक देखिन्छ, तर `urls` मा हजार entries भए, यो सबै हजार requests लाई एकैचोटि exact same instant मा fire गर्छ — यसले तपाईंको आफ्नै server overwhelm गर्न सक्छ, third-party API को rate limit trip गराउन सक्छ, वा browser को per-host connection limit exhaust गर्न सक्छ। तपाईंलाई वास्तवमा चाहिने bounded concurrency हो: एकैसाथ maximum `N` tasks मात्र run गर्नु, अघिल्लो एउटा सकिएपछि मात्र नयाँ एउटा सुरु गर्नु। सामान्य approach ले currently in-flight promises को `Set` राख्छ; task सुरु गरेपछि, set limit मा पुगेको भए, `await Promise.race(executing)` ले कम्तिमा एउटा नसकिएसम्म pause गर्छ (जो सकिन्छ त्यो set बाट आफैं हट्छ), र input नसकिएसम्म loop नयाँ tasks issue गरिरहन्छ।\n\nएउटा सम्बन्धित तर फरक समस्या <b>duplicate</b> requests हो: कुनै page मा पाँच components ले लगभग उही समयमा independently `fetchUser(1)` call गरे भने, coordination बिना त्यो उही data का लागि पाँच identical network requests हुन्छन्। <b>Request deduplication</b> ले यसलाई request द्वारा keyed (जस्तै URL) in-flight `Map` ले fix गर्छ: fetch सुरु गर्नु अघि, त्यो key map मा पहिले नै छ कि छैन जाँच गर्नुहोस्; भएमा, नयाँ request सुरु गर्नुको सट्टा नयाँ caller लाई <b>उही</b> pending `Promise` फर्काउनुहोस्, र settle भएपछि entry हटाउनुहोस् (सामान्यतया `.finally()` मा)।\n\n<b>Memoization</b> ले सम्बन्धित तर फरक समस्या solve गर्छ — overlap हुने calls का लागि मात्र होइन, <b>समयभरि</b> results cache गर्नु। Async memoizer ले function लाई `JSON.stringify(args)` द्वारा keyed `Map` मा wrap गर्छ, resolved `value` र `expiresAt` timestamp दुवै store गर्छ; call ले पहिले fresh (expire नभएको) entry छ कि छैन जाँच गर्छ र भए तुरुन्तै फर्काउँछ, र cache miss वा TTL (time-to-live) बितेपछि मात्र real function call गरी नयाँ entry store गर्छ। Deduplication र memoization प्राय: सँगै combine हुन्छन्: dedup ले concurrent identical calls लाई एउटा in-flight request मा collapse गर्छ, जबकि TTL cache ले later call लाई पहिले नै सकिएको result reuse गर्न दिन्छ।",
        jp: "`Promise.all(urls.map(fetch))`は便利に見えるが、`urls`が1000件あると、1000個のリクエストを全く同じ瞬間に一斉発火する — これは自分のサーバーを過負荷にしたり、サードパーティAPIのレート制限に引っかかったり、ブラウザのホストごとの接続数制限を使い果たしたりする。本当に必要なのは有界の同時実行数だ: 最大`N`個のタスクだけを同時に実行し、以前のものが終わったときだけ新しいものを開始する。一般的な方法は現在進行中のPromiseの`Set`を保持する。タスクを開始した後、setが上限に達していれば`await Promise.race(executing)`が少なくとも1つ終わるまで一時停止する（終わったものは自分でsetから外れる）。ループは入力が尽きるまで新しいタスクを発行し続ける。\n\n関連するが別の問題は<b>重複</b>リクエストだ: ページ上の5つのコンポーネントが同じ頃に独立して`fetchUser(1)`を呼び出せば、調整なしでは同じデータに対して5つの同一のネットワークリクエストになる。<b>リクエスト重複排除</b>はリクエスト（例えばURL）をキーとする進行中の`Map`でこれを解決する: fetchを開始する前に、そのキーがすでにmapにあるか確認する。あれば、新しいリクエストを開始する代わりに新しい呼び出し元に<b>同じ</b>保留中の`Promise`を返し、確定したら（通常は`.finally()`で）エントリを削除する。\n\n<b>メモ化</b>は関連するが異なる問題を解決する — 重複する呼び出しだけでなく、<b>時間をまたいで</b>結果をキャッシュすることだ。非同期メモイザーは関数を`JSON.stringify(args)`をキーとする`Map`でラップし、解決した`value`と`expiresAt`タイムスタンプの両方を保存する。呼び出しはまず新鮮な（期限切れでない）エントリがあるか確認し、あれば即座に返し、キャッシュミスまたはTTL（有効期限）が過ぎた後にのみ実際の関数を呼び出して新しいエントリを保存する。重複排除とメモ化はよく組み合わされる: 重複排除は同時の同一呼び出しを1つの進行中リクエストに集約し、TTLキャッシュは後の呼び出しがすでに終わった結果を再利用できるようにする。",
      },
      diagram: `Promise.all(1000 fetches) → all 1000 fire AT ONCE  ✘ overwhelms server / rate limits

runWithConcurrency(items, fn, limit = 5):
  executing = Set{ }
  ┌─ start task ──► add to executing ──► size >= limit? ──► await Promise.race(executing)
  │                                                                 │
  └───────────────────── loop until all items started ◄────────────┘
  (a task finishes → removes itself from executing → frees a slot)

Request dedup (same instant):          Memoization (across time, with TTL):
  inFlight = Map<url, Promise>            cache = Map<key, { value, expiresAt }>
  5 callers → fetchUser(1) at once        call 1        → miss    → fetch → store entry
  → all 5 share ONE Promise               call 2 (later) → hit, fresh → instant return
  → only 1 network request                call 3 (after TTL) → expired → fetch again`,
      codeExample: {
        title: { en: "Bounded concurrency, request dedup & TTL memoization", np: "Bounded concurrency, request dedup र TTL memoization", jp: "有界の同時実行・リクエスト重複排除・TTLメモ化" },
        code: `// ── The problem: Promise.all fires everything at once ───────────────
const urls = Array.from({ length: 1000 }, (_, i) => \`/api/items/\${i}\`);
// await Promise.all(urls.map(url => fetch(url)));   // ❌ 1000 simultaneous requests

// ── Concurrency limiter — at most \`limit\` tasks in flight at once ───
async function runWithConcurrency(items, fn, limit) {
  const results = [];
  const executing = new Set();

  for (const [index, item] of items.entries()) {
    const task = fn(item, index).then((result) => {
      results[index] = result;
      executing.delete(task);   // free up a slot when this task finishes
    });
    executing.add(task);

    if (executing.size >= limit) {
      await Promise.race(executing);   // wait for at least one slot to free up
    }
  }

  await Promise.all(executing);   // drain whatever's still running
  return results;
}

const items = await runWithConcurrency(
  urls,
  (url) => fetch(url).then((r) => r.json()),
  5   // only 5 requests in flight at any moment
);

// ── Request deduplication — collapse identical concurrent calls ─────
const inFlight = new Map();

function dedupedFetch(url) {
  if (inFlight.has(url)) return inFlight.get(url);   // share the pending Promise

  const promise = fetch(url)
    .then((res) => res.json())
    .finally(() => inFlight.delete(url));             // clean up once it settles

  inFlight.set(url, promise);
  return promise;
}

// Five simultaneous calls, ONE network request:
await Promise.all([
  dedupedFetch("/api/users/1"),
  dedupedFetch("/api/users/1"),
  dedupedFetch("/api/users/1"),
]);

// ── Async memoization with a TTL cache ───────────────────────────────
function memoizeAsync(fn, ttlMs = 60_000) {
  const cache = new Map();

  return async function (...args) {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached && Date.now() < cached.expiresAt) {
      return cached.value;   // fresh cache hit — no network call at all
    }

    const value = await fn(...args);
    cache.set(key, { value, expiresAt: Date.now() + ttlMs });
    return value;
  };
}

const cachedFetchUser = memoizeAsync((id) => dedupedFetch(\`/api/users/\${id}\`), 5 * 60_000);

await cachedFetchUser(1);   // network request, then cached for 5 minutes
await cachedFetchUser(1);   // instant — served from cache`,
      },
      keyTakeaways: [
        { en: "`Promise.all` fires every promise at once; for large batches, a concurrency limiter (a `Set` of in-flight tasks plus `Promise.race` to wait for a free slot) caps how many run simultaneously.", np: "`Promise.all` ले हरेक promise एकैचोटि fire गर्छ; ठूला batches का लागि, concurrency limiter (in-flight tasks को `Set` र free slot का लागि wait गर्ने `Promise.race`) ले कति एकैसाथ चल्छन् cap गर्छ।", jp: "`Promise.all`はすべてのPromiseを一斉に発火する。大きなバッチには、同時実行数リミッター（進行中タスクの`Set`と空きスロットを待つ`Promise.race`）が同時実行数の上限を設ける。" },
        { en: "Request deduplication uses an in-flight `Map` keyed by the request so that concurrent identical calls share one `Promise` instead of firing duplicate network requests.", np: "Request deduplication ले request द्वारा keyed in-flight `Map` प्रयोग गर्छ ताकि concurrent identical calls ले duplicate network requests fire नगरी एउटै `Promise` share गरून्।", jp: "リクエスト重複排除はリクエストをキーとする進行中の`Map`を使い、同時の同一呼び出しが重複ネットワークリクエストを発火する代わりに1つの`Promise`を共有するようにする。" },
        { en: "Async memoization caches a function's resolved results in a `Map` keyed by `JSON.stringify(args)`, storing an `expiresAt` timestamp so entries are only reused while still within their TTL.", np: "Async memoization ले function को resolved results लाई `JSON.stringify(args)` द्वारा keyed `Map` मा cache गर्छ, `expiresAt` timestamp store गरी entries आफ्नो TTL भित्र मात्र reuse हुने बनाउँछ।", jp: "非同期メモ化は関数の解決済み結果を`JSON.stringify(args)`をキーとする`Map`にキャッシュし、`expiresAt`タイムスタンプを保存してエントリがTTL内にある間だけ再利用されるようにする。" },
      ],
      commonMistakes: [
        { en: "Using `Promise.all` on a huge array of requests with no concurrency cap, overwhelming the server or hitting a rate limit.", np: "कुनै concurrency cap नराखी requests को ठूलो array मा `Promise.all` प्रयोग गर्नु, server overwhelm गर्नु वा rate limit hit गर्नु।", jp: "同時実行数の上限なしに巨大なリクエスト配列に`Promise.all`を使い、サーバーを過負荷にしたりレート制限に引っかかったりすること。" },
        { en: "Not deduplicating concurrent identical requests, so multiple components calling the same endpoint at the same time each fire their own network request.", np: "Concurrent identical requests deduplicate नगर्नु, जसले गर्दा same endpoint लाई same समयमा call गर्ने multiple components ले आफ्नै-आफ्नै network request fire गर्छन्।", jp: "同時の同一リクエストを重複排除しないこと。同じエンドポイントを同時に呼び出す複数のコンポーネントがそれぞれ自分のネットワークリクエストを発火してしまう。" },
        { en: "Memoizing an async function with no TTL or cache invalidation at all, so it keeps returning stale data forever after the underlying value changes.", np: "कुनै TTL वा cache invalidation बिना async function memoize गर्नु, जसले underlying value बदलिएपछि पनि सधैंभरि stale data फर्काइरहन्छ।", jp: "TTLもキャッシュ無効化もなしに非同期関数をメモ化すること。基となる値が変わった後も永遠に古いデータを返し続けてしまう。" },
      ],
      quiz: [
        {
          question: { en: "What problem does a concurrency limiter solve that `Promise.all` alone doesn't?", np: "`Promise.all` एक्लैले solve नगर्ने कुन समस्या concurrency limiter ले solve गर्छ?", jp: "`Promise.all`単体では解決しない、同時実行数リミッターが解決する問題は何？" },
          options: [
            { en: "It caps how many async tasks run at the same time instead of firing them all at once", np: "यसले सबैलाई एकैचोटि fire नगरी कति async tasks एकैसाथ चल्छन् cap गर्छ", jp: "すべてを一斉発火する代わりに、同時に実行される非同期タスクの数を制限する" },
            { en: "It makes each individual request resolve faster", np: "यसले हरेक individual request लाई छिटो resolve गराउँछ", jp: "個々のリクエストをより速く解決させる" },
          ],
          correctIndex: 0,
          explanation: { en: "Promise.all fires everything simultaneously; a concurrency limiter starts a new task only when an earlier one finishes, keeping at most N in flight.", np: "Promise.all ले सबैलाई एकैचोटि fire गर्छ; concurrency limiter ले अघिल्लो सकिएपछि मात्र नयाँ task सुरु गर्छ, maximum N मात्र in flight राख्छ।", jp: "Promise.allはすべてを同時に発火する。同時実行数リミッターは前のタスクが終わったときだけ新しいタスクを開始し、最大N個だけを進行中に保つ。" },
        },
        {
          question: { en: "When five components call `dedupedFetch(url)` for the same URL at the same time, what happens?", np: "पाँच components ले same URL का लागि same समयमा `dedupedFetch(url)` call गर्दा के हुन्छ?", jp: "5つのコンポーネントが同じURLに対して同時に`dedupedFetch(url)`を呼ぶとどうなる？" },
          options: [
            { en: "All five share the same in-flight Promise, and only one network request is made", np: "पाँचैले उही in-flight Promise share गर्छन्, र केवल एउटा network request मात्र हुन्छ", jp: "5つすべてが同じ進行中のPromiseを共有し、ネットワークリクエストは1つだけ発生する" },
            { en: "Each call fires its own separate network request", np: "हरेक call ले आफ्नो छुट्टै network request fire गर्छ", jp: "各呼び出しがそれぞれ独自のネットワークリクエストを発火する" },
          ],
          correctIndex: 0,
          explanation: { en: "The in-flight Map returns the same pending Promise to every caller with a matching key, so duplicate simultaneous requests collapse into one.", np: "In-flight Map ले matching key भएका हरेक caller लाई उही pending Promise फर्काउँछ, त्यसैले duplicate simultaneous requests एउटामा collapse हुन्छन्।", jp: "進行中のMapは一致するキーを持つすべての呼び出し元に同じ保留中のPromiseを返すため、重複する同時リクエストは1つに集約される。" },
        },
        {
          question: { en: "Why does a TTL-based memoization cache store an `expiresAt` timestamp alongside the cached value?", np: "TTL-based memoization cache ले cached value सँगै `expiresAt` timestamp किन store गर्छ?", jp: "TTLベースのメモ化キャッシュがキャッシュされた値とともに`expiresAt`タイムスタンプを保存する理由は？" },
          options: [
            { en: "So a cached entry is only reused while still fresh, and re-fetched once it's stale", np: "ताकि cached entry fresh रहुन्जेल मात्र reuse होस्, र stale भएपछि फेरि fetch होस्", jp: "キャッシュされたエントリが新鮮な間だけ再利用され、古くなったら再取得されるように" },
            { en: "So the cache never needs to be checked before returning a value", np: "ताकि value फर्काउनु अघि cache जाँच गर्नैपर्दैन", jp: "値を返す前にキャッシュを確認する必要がなくなるように" },
          ],
          correctIndex: 0,
          explanation: { en: "The expiresAt check lets the cache tell fresh entries from stale ones, so it only returns a cached value when the TTL hasn't passed yet.", np: "expiresAt check ले cache लाई fresh र stale entries छुट्याउन दिन्छ, त्यसैले TTL नबितेसम्म मात्र cached value फर्काउँछ।", jp: "expiresAtのチェックによりキャッシュは新鮮なエントリと古いエントリを区別できる。TTLがまだ過ぎていないときだけキャッシュされた値を返す。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "Why must a retry loop have a `maxAttempts` limit?", np: "Retry loop मा `maxAttempts` limit किन हुनुपर्छ?", jp: "リトライループに`maxAttempts`の上限が必要な理由は？" },
      options: [{ en: "Without one, a broken request could retry forever and keep hammering a struggling service", np: "नभएमा, broken request ले सधैंभरि retry गरी struggle गरिरहेको service लाई हान्न सक्छ", jp: "上限がなければ、壊れたリクエストが永遠にリトライを続け、苦しんでいるサービスを叩き続けてしまう" }, { en: "Without one, JavaScript throws a syntax error", np: "नभएमा, JavaScript ले syntax error throw गर्छ", jp: "上限がなければ、JavaScriptが構文エラーをスローする" }],
      correctIndex: 0,
      explanation: { en: "A retry loop with no cap can turn one failure into an infinite hammering loop; capping attempts and rethrowing on the last one lets the caller react instead.", np: "कुनै cap नभएको retry loop ले एउटा failure लाई infinite hammering loop मा बदल्न सक्छ; attempts cap गरी अन्तिममा rethrow गर्दा caller ले react गर्न सक्छ।", jp: "上限のないリトライループは1つの失敗を無限のハンマリングループに変えてしまう。試行回数を制限し最後に再スローすることで、呼び出し側が対応できるようになる。" },
    },
    {
      question: { en: "In exponential backoff, roughly how does the delay change between successive retries?", np: "Exponential backoff मा, क्रमिक retries बीच delay लगभग कसरी बदलिन्छ?", jp: "指数バックオフでは、連続するリトライ間の遅延はおおよそどのように変化する？" },
      options: [{ en: "It roughly doubles each time, up to a capped maximum", np: "हरेक पटक लगभग दोब्बर हुन्छ, cap गरिएको maximum सम्म", jp: "上限まで、毎回おおよそ2倍になる" }, { en: "It stays exactly the same every time", np: "हरेक पटक ठ्याक्कै उही रहन्छ", jp: "毎回全く同じままである" }],
      correctIndex: 0,
      explanation: { en: "baseDelayMs * 2 ** attempt roughly doubles the wait each retry, capped by maxDelayMs so it never grows unbounded.", np: "baseDelayMs * 2 ** attempt ले हरेक retry मा wait लाई लगभग दोब्बर बनाउँछ, maxDelayMs ले cap गरिएको ताकि असीमित नबढ्न।", jp: "baseDelayMs * 2 ** attemptは各リトライで待機時間をおおよそ2倍にし、maxDelayMsで上限が設けられ無限に増えることはない。" },
    },
    {
      question: { en: "Should a `shouldRetry` predicate retry a `400 Bad Request` error?", np: "`shouldRetry` predicate ले `400 Bad Request` error retry गर्नुपर्छ?", jp: "`shouldRetry`述語は`400 Bad Request`エラーをリトライすべきか？" },
      options: [{ en: "No — it's a client error that will fail identically every time", np: "होइन — यो client error हो जो हरेक पटक उस्तै रूपमा fail हुन्छ", jp: "いいえ — これは毎回同じように失敗するクライアントエラーだ" }, { en: "Yes — treat it the same as a transient 5xx failure", np: "हो — यसलाई transient 5xx failure जस्तै treat गर्नुपर्छ", jp: "はい — 一時的な5xx失敗と同じように扱うべき" }],
      correctIndex: 0,
      explanation: { en: "4xx errors mean something is wrong with the request itself, so retrying gets the same failure every time; only transient 5xx/network/429 failures deserve a retry.", np: "4xx errors को अर्थ request आफैंमा केही गलत छ, त्यसैले retry गर्दा हरेक पटक उही failure आउँछ; transient 5xx/network/429 failures मात्र retry पाउनुपर्छ।", jp: "4xxエラーはリクエスト自体に問題があることを意味するため、リトライしても毎回同じ失敗になる。一時的な5xx/ネットワーク/429の失敗だけがリトライに値する。" },
    },
    {
      question: { en: "What does `Promise.race([operation, timeoutPromise])` settle with if the operation is too slow?", np: "Operation धेरै slow भएमा `Promise.race([operation, timeoutPromise])` कुनसँग settle हुन्छ?", jp: "操作が遅すぎる場合、`Promise.race([operation, timeoutPromise])`は何で確定する？" },
      options: [{ en: "The timeout promise's rejection, since it settles first", np: "Timeout promise को rejection, किनकि यो पहिले settle हुन्छ", jp: "先に確定するため、タイムアウトPromiseの拒否" }, { en: "The operation's eventual result, once it finally arrives", np: "Operation को eventual result, जब यो अन्तमा आउँछ", jp: "最終的に到着した操作の結果" }],
      correctIndex: 0,
      explanation: { en: "race() settles with whichever promise finishes first; a slow operation loses to a timeout that rejects sooner, and the slow operation's eventual result is simply discarded.", np: "race() जो promise पहिले पुग्छ त्यसैसँग settle हुन्छ; slow operation छिटो reject हुने timeout सँग हार्छ, र यसको eventual result simply discard हुन्छ।", jp: "race()はどちらか先に終わったPromiseで確定する。遅い操作はより早く拒否するタイムアウトに負け、その最終的な結果は単に捨てられる。" },
    },
    {
      question: { en: "What is the key advantage of `AbortController` over a plain `Promise.race` timeout for `fetch()`?", np: "`fetch()` का लागि plain `Promise.race` timeout भन्दा `AbortController` को key advantage के हो?", jp: "`fetch()`に対して、単純な`Promise.race`タイムアウトより`AbortController`が持つ主な利点は？" },
      options: [{ en: "It actually cancels the underlying network request instead of leaving it running", np: "यसले underlying network request लाई चलिरहन दिनुको सट्टा वास्तवमा cancel गर्छ", jp: "実行を続けさせるのではなく、実際に基盤のネットワークリクエストをキャンセルする" }, { en: "It skips the need for a try/catch block", np: "यसले try/catch block को आवश्यकता हटाउँछ", jp: "try/catchブロックの必要性をなくす" }],
      correctIndex: 0,
      explanation: { en: "Promise.race just ignores the slower promise; AbortController's signal tells the browser to actually stop the network request, freeing the connection.", np: "Promise.race ले slower promise लाई केवल ignore गर्छ; AbortController को signal ले browser लाई network request वास्तवमा रोक्न भन्छ, connection free गर्छ।", jp: "Promise.raceは遅い方のPromiseを単に無視する。AbortControllerのsignalは実際にブラウザに進行中のネットワークリクエストを停止させ、接続を解放する。" },
    },
    {
      question: { en: "In a circuit breaker, what triggers the move from `closed` to `open`?", np: "Circuit breaker मा, `closed` बाट `open` मा जाने trigger के हो?", jp: "サーキットブレーカーで、`closed`から`open`への移行を引き起こすものは？" },
      options: [{ en: "The failure count reaching a configured threshold", np: "Failure count configured threshold मा पुग्नु", jp: "失敗回数が設定された閾値に達すること" }, { en: "A cooldown period elapsing", np: "Cooldown period बित्नु", jp: "クールダウン期間が経過すること" }],
      correctIndex: 0,
      explanation: { en: "The circuit opens once accumulated failures hit the threshold; the cooldown elapsing is instead what moves it from open to half-open.", np: "Accumulated failures threshold मा पुगेपछि circuit open हुन्छ; cooldown बितेपछि त open बाट half-open मा जान्छ।", jp: "累積した失敗が閾値に達すると、サーキットはopenになる。クールダウンの経過はopenからhalf-openへの移行を引き起こす。" },
    },
    {
      question: { en: "Why does firing `Promise.all` over 1000 URLs risk overwhelming a server, compared to a concurrency limiter?", np: "1000 URLs मा `Promise.all` fire गर्दा concurrency limiter को तुलनामा server overwhelm हुने जोखिम किन हुन्छ?", jp: "1000個のURLに`Promise.all`を発火することが、同時実行数リミッターと比べてサーバーを過負荷にするリスクがある理由は？" },
      options: [{ en: "Promise.all starts every request at the exact same instant with no cap", np: "Promise.all ले कुनै cap बिना हरेक request लाई exact same instant मा सुरु गर्छ", jp: "Promise.allは上限なしにすべてのリクエストを全く同じ瞬間に開始する" }, { en: "Promise.all only supports up to 100 promises at a time", np: "Promise.all ले एकैसाथ maximum 100 promises मात्र support गर्छ", jp: "Promise.allは同時に最大100個のPromiseしかサポートしない" }],
      correctIndex: 0,
      explanation: { en: "Promise.all has no built-in concurrency cap — it fires every promise immediately, while a limiter deliberately caps how many run at once.", np: "Promise.all मा built-in concurrency cap छैन — यो हरेक promise तुरुन्तै fire गर्छ, जबकि limiter ले जानाजानी कति एकैसाथ चल्छन् cap गर्छ।", jp: "Promise.allには組み込みの同時実行数上限がない — すべてのPromiseを即座に発火する。一方リミッターは意図的に同時実行数を制限する。" },
    },
    {
      question: { en: "What is the core difference between request deduplication and async memoization?", np: "Request deduplication र async memoization बीचको core फरक के हो?", jp: "リクエスト重複排除と非同期メモ化の核心的な違いは？" },
      options: [{ en: "Dedup shares one in-flight Promise among concurrent calls; memoization caches results across time with a TTL", np: "Dedup ले concurrent calls बीच एउटै in-flight Promise share गर्छ; memoization ले TTL सहित समयभरि results cache गर्छ", jp: "重複排除は同時呼び出し間で1つの進行中Promiseを共有し、メモ化はTTLで時間をまたいで結果をキャッシュする" }, { en: "They are two names for the exact same technique", np: "यी उही technique का दुई नाम हुन्", jp: "これらは全く同じ手法の2つの名前である" }],
      correctIndex: 0,
      explanation: { en: "Dedup solves overlapping calls happening at the same moment; memoization solves reusing a result for a later, non-overlapping call within a TTL window — they're often combined.", np: "Dedup ले उही moment मा overlap हुने calls solve गर्छ; memoization ले TTL window भित्र later, non-overlapping call का लागि result reuse गर्ने समस्या solve गर्छ — यी दुई प्राय: सँगै combine हुन्छन्।", jp: "重複排除は同じ瞬間に重なる呼び出しを解決し、メモ化はTTLウィンドウ内で後の重ならない呼び出しに結果を再利用する問題を解決する — この2つはよく組み合わされる。" },
    },
  ],
};
