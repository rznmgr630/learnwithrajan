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
        en: "Sometimes a request fails because of a temporary problem, such as a network issue or a server being overloaded. In these cases, we can <b>try the request again</b>.\n\nBut simply retrying again and again is dangerous. If we retry forever, one failed request could keep hitting an already-problematic server and make things worse.\n\n## 1. Limit the number of retries\n\nThe first thing we should do is set a `maxAttempts`.\n\nFor example:\n\n• Try the request\n• If it fails, try again\n• Keep trying until we reach `maxAttempts`\n• If it still fails, throw the error\n\nThis prevents our application from retrying forever.\n\n## 2. Wait between retries\n\nWe shouldn't retry immediately after a failure.\n\nInstead, we use <b>exponential backoff</b>. This means that we wait longer after each failed attempt.\n\nFor example:\n\n```text\n1st retry → wait 1 second\n2nd retry → wait 2 seconds\n3rd retry → wait 4 seconds\n4th retry → wait 8 seconds\n```\n\nA simple formula is:\n\n```text\nbaseDelayMs * 2 ** attempt\n```\n\nWe should also set a `maxDelayMs` so the waiting time doesn't become too long.\n\n## 3. Add jitter\n\nImagine 1,000 users make requests at the same time and all of them fail.\n\nIf everyone follows exactly the same retry schedule:\n\n```text\n1 second → everyone retries\n2 seconds → everyone retries\n4 seconds → everyone retries\n```\n\nThe server could suddenly receive thousands of requests at the same time. This is called a <b>retry storm</b>.\n\nTo avoid this, we add a small random amount of time called <b>jitter</b>.\n\nFor example:\n\n```text\nClient A → waits 1.2 seconds\nClient B → waits 1.7 seconds\nClient C → waits 1.4 seconds\n```\n\nNow the requests are spread out instead of all happening at exactly the same moment.\n\n## 4. Don't retry every error\n\nSome errors are temporary, while others will fail every time.\n\nUsually, we should retry things like:\n\n• `5xx` server errors\n• Network errors\n• `429 Too Many Requests`\n\nBut we generally shouldn't retry normal `4xx` errors.\n\nFor example:\n\n```text\n400 Bad Request\n401 Unauthorized\n403 Forbidden\n404 Not Found\n```\n\nIf the request is invalid or the user isn't authorized, sending the exact same request again probably won't fix anything.\n\nThat's why we can use a function like:\n\n```javascript\nshouldRetry(error)\n```\n\nIt decides whether a particular error is worth retrying.\n\n## 5. Be careful with POST requests\n\nThere's another important problem with retries.\n\nImagine we send:\n\n```http\nPOST /users\n```\n\nThe server successfully creates the user, but the response gets lost because of a network problem.\n\nOur application doesn't know that the user was already created, so it retries the request.\n\nNow the server might create <b>another user</b>.\n\nFor operations that aren't naturally safe to repeat, such as creating a record with `POST`, we should use an <b>idempotency key</b>.\n\nThe key allows the server to recognize:\n\n> \"I've already processed this request, so don't create it again.\"\n\n## The basic idea\n\nA good retry system looks like this:\n\n```text\nRequest\n   ↓\nDid it succeed?\n   ↓\n Yes → Return result\n   ↓\n No\n   ↓\nShould we retry?\n   ↓\n No → Throw error\n   ↓\n Yes\n   ↓\nWait using exponential backoff + jitter\n   ↓\nTry again\n   ↓\nReached max attempts?\n   ↓\n Yes → Throw error\n```\n\n### Key takeaway\n\n<b>Good retry logic =</b>\n\n```text\nLimited attempts\n+ Exponential backoff\n+ Maximum delay\n+ Jitter\n+ Retry only temporary errors\n+ Idempotency for operations that aren't safe to repeat\n```\n\nThe goal isn't to <b>retry as much as possible</b>. The goal is to <b>give a temporary failure a chance to recover without making the problem worse</b>.",
        np: "कहिलेकाहीँ request अस्थायी समस्याको कारण fail हुन्छ, जस्तै network issue वा server धेरै load भएको। यस्तो अवस्थामा, हामी <b>request फेरि try गर्न सक्छौं</b>।\n\nतर बारम्बार retry गर्दै जानु खतरनाक हुन्छ। यदि हामी सधैंभरि retry गर्यौं भने, एउटै fail भएको request ले पहिले नै समस्यामा परेको server लाई हानिरहन्छ र स्थिति अझ बिग्रिन्छ।\n\n## 1. Retry को संख्या सीमित गर्नुहोस्\n\nपहिलो काम `maxAttempts` सेट गर्नु हो।\n\nउदाहरणका लागि:\n\n• Request try गर्नुहोस्\n• Fail भयो भने फेरि try गर्नुहोस्\n• `maxAttempts` पुग्ने बेलासम्म try गरिरहनुहोस्\n• अझै fail भयो भने error throw गर्नुहोस्\n\nयसले हाम्रो application लाई सधैंभरि retry गर्नबाट रोक्छ।\n\n## 2. Retry बीचमा wait गर्नुहोस्\n\nFail भएको लगत्तै retry गर्नु हुँदैन।\n\nबरु, हामी <b>exponential backoff</b> प्रयोग गर्छौं। यसको अर्थ हरेक fail भएको attempt पछि हामी अझ लामो समय wait गर्छौं।\n\nउदाहरणका लागि:\n\n```text\n1st retry → wait 1 second\n2nd retry → wait 2 seconds\n3rd retry → wait 4 seconds\n4th retry → wait 8 seconds\n```\n\nसरल formula यो हो:\n\n```text\nbaseDelayMs * 2 ** attempt\n```\n\nहामीले `maxDelayMs` पनि सेट गर्नुपर्छ ताकि wait गर्ने समय धेरै लामो नहोस्।\n\n## 3. Jitter थप्नुहोस्\n\nकल्पना गर्नुहोस् 1,000 users एकै समयमा request गर्छन् र सबै fail हुन्छन्।\n\nयदि सबैले ठ्याक्कै उही retry schedule पछ्याउँछन् भने:\n\n```text\n1 second → everyone retries\n2 seconds → everyone retries\n4 seconds → everyone retries\n```\n\nServer ले अचानक हजारौं request एकै समयमा पाउन सक्छ। यसलाई <b>retry storm</b> भनिन्छ।\n\nयसलाई बच्न, हामी <b>jitter</b> भनिने सानो random समय थप्छौं।\n\nउदाहरणका लागि:\n\n```text\nClient A → waits 1.2 seconds\nClient B → waits 1.7 seconds\nClient C → waits 1.4 seconds\n```\n\nअब request हरू ठ्याक्कै एउटै क्षणमा नभई फैलिएर जान्छन्।\n\n## 4. हरेक error retry नगर्नुहोस्\n\nकेही error अस्थायी हुन्छन्, केही हरेक पटक fail हुन्छन्।\n\nसामान्यतया, हामीले यस्ता चीज retry गर्नुपर्छ:\n\n• `5xx` server errors\n• Network errors\n• `429 Too Many Requests`\n\nतर सामान्य `4xx` errors लाई retry गर्नु हुँदैन।\n\nउदाहरणका लागि:\n\n```text\n400 Bad Request\n401 Unauthorized\n403 Forbidden\n404 Not Found\n```\n\nयदि request invalid छ वा user authorized छैन भने, ठ्याक्कै उही request फेरि पठाउँदा केही ठीक हुँदैन।\n\nत्यसैले हामी यस्तो function प्रयोग गर्न सक्छौं:\n\n```javascript\nshouldRetry(error)\n```\n\nयसले कुन error retry गर्न लायक छ भन्ने निर्णय गर्छ।\n\n## 5. POST request मा होसियार हुनुहोस्\n\nRetry सँग अझ एउटा महत्वपूर्ण समस्या छ।\n\nकल्पना गर्नुहोस् हामी पठाउँछौं:\n\n```http\nPOST /users\n```\n\nServer ले user सफलतापूर्वक बनाउँछ, तर network समस्याको कारण response हराउँछ।\n\nहाम्रो application लाई user पहिले नै बनिसकेको थाहा हुँदैन, त्यसैले यो request retry गर्छ।\n\nअब server ले <b>अर्को user</b> बनाउन सक्छ।\n\nदोहोर्याउन स्वभाविक रूपमा सुरक्षित नभएका operations, जस्तै `POST` ले record बनाउनु, को लागि हामीले <b>idempotency key</b> प्रयोग गर्नुपर्छ।\n\nKey ले server लाई चिन्न दिन्छ:\n\n> \"मैले यो request पहिले नै process गरिसकेको छु, त्यसैले फेरि नबनाउ।\"\n\n## आधारभूत विचार\n\nराम्रो retry system यस्तो देखिन्छ:\n\n```text\nRequest\n   ↓\nDid it succeed?\n   ↓\n Yes → Return result\n   ↓\n No\n   ↓\nShould we retry?\n   ↓\n No → Throw error\n   ↓\n Yes\n   ↓\nWait using exponential backoff + jitter\n   ↓\nTry again\n   ↓\nReached max attempts?\n   ↓\n Yes → Throw error\n```\n\n### मुख्य सार\n\n<b>राम्रो retry logic =</b>\n\n```text\nLimited attempts\n+ Exponential backoff\n+ Maximum delay\n+ Jitter\n+ Retry only temporary errors\n+ Idempotency for operations that aren't safe to repeat\n```\n\nलक्ष्य <b>जति सक्दो धेरै retry गर्नु</b> होइन। लक्ष्य <b>अस्थायी failure लाई समस्या अझ बिगार्न नदिई recover हुने मौका दिनु</b> हो।",
        jp: "ネットワークの問題やサーバーの過負荷など、一時的な原因でリクエストが失敗することがあります。そのような場合は<b>リクエストをもう一度試す</b>ことができます。\n\nしかし、ただ何度もリトライを繰り返すのは危険です。永遠にリトライすると、1つの失敗したリクエストがすでに問題を抱えたサーバーを叩き続け、状況をさらに悪化させます。\n\n## 1. リトライ回数を制限する\n\nまず最初にすべきことは `maxAttempts` を設定することです。\n\n例:\n\n• リクエストを試す\n• 失敗したらもう一度試す\n• `maxAttempts` に達するまで試し続ける\n• それでも失敗したらエラーをスローする\n\nこれでアプリケーションが永遠にリトライすることを防げます。\n\n## 2. リトライの間に待つ\n\n失敗した直後にすぐリトライすべきではありません。\n\n代わりに<b>指数バックオフ</b>を使います。これは失敗するたびに待ち時間を長くしていくという意味です。\n\n例:\n\n```text\n1st retry → wait 1 second\n2nd retry → wait 2 seconds\n3rd retry → wait 4 seconds\n4th retry → wait 8 seconds\n```\n\nシンプルな式は次のとおりです:\n\n```text\nbaseDelayMs * 2 ** attempt\n```\n\n待ち時間が長くなりすぎないように `maxDelayMs` も設定すべきです。\n\n## 3. ジッターを加える\n\n1,000人のユーザーが同時にリクエストして、その全部が失敗したと想像してください。\n\n全員がまったく同じリトライスケジュールに従うと:\n\n```text\n1 second → everyone retries\n2 seconds → everyone retries\n4 seconds → everyone retries\n```\n\nサーバーは突然、何千ものリクエストを同時に受け取ることになります。これを<b>リトライストーム</b>と呼びます。\n\nこれを避けるために、<b>ジッター</b>と呼ばれる少量のランダムな時間を加えます。\n\n例:\n\n```text\nClient A → waits 1.2 seconds\nClient B → waits 1.7 seconds\nClient C → waits 1.4 seconds\n```\n\nこれでリクエストはまったく同じ瞬間に集まらず、分散されます。\n\n## 4. すべてのエラーをリトライしない\n\n一時的なエラーもあれば、毎回必ず失敗するエラーもあります。\n\n通常、次のようなものはリトライすべきです:\n\n• `5xx` サーバーエラー\n• ネットワークエラー\n• `429 Too Many Requests`\n\nしかし、通常の `4xx` エラーはリトライすべきではありません。\n\n例:\n\n```text\n400 Bad Request\n401 Unauthorized\n403 Forbidden\n404 Not Found\n```\n\nリクエストが不正であったり、ユーザーに権限がない場合、まったく同じリクエストをもう一度送っても何も解決しません。\n\nそのため、次のような関数を使えます:\n\n```javascript\nshouldRetry(error)\n```\n\nこれは、そのエラーがリトライする価値があるかどうかを判断します。\n\n## 5. POSTリクエストには注意する\n\nリトライにはもう1つ重要な問題があります。\n\n次を送ると想像してください:\n\n```http\nPOST /users\n```\n\nサーバーはユーザーの作成に成功しますが、ネットワークの問題でレスポンスが失われます。\n\nアプリケーションはユーザーがすでに作成されたことを知らないため、リクエストをリトライします。\n\nその結果、サーバーは<b>もう1人のユーザー</b>を作ってしまうかもしれません。\n\n`POST` でレコードを作成するなど、繰り返しても安全とは言えない操作には<b>冪等性キー</b>を使うべきです。\n\nこのキーによってサーバーは次のように認識できます:\n\n> 「このリクエストはすでに処理済みなので、もう作らない。」\n\n## 基本的な考え方\n\nよいリトライの仕組みは次のようになります:\n\n```text\nRequest\n   ↓\nDid it succeed?\n   ↓\n Yes → Return result\n   ↓\n No\n   ↓\nShould we retry?\n   ↓\n No → Throw error\n   ↓\n Yes\n   ↓\nWait using exponential backoff + jitter\n   ↓\nTry again\n   ↓\nReached max attempts?\n   ↓\n Yes → Throw error\n```\n\n### 重要なポイント\n\n<b>よいリトライロジック =</b>\n\n```text\nLimited attempts\n+ Exponential backoff\n+ Maximum delay\n+ Jitter\n+ Retry only temporary errors\n+ Idempotency for operations that aren't safe to repeat\n```\n\n目標は<b>できるだけ多くリトライすること</b>ではありません。目標は<b>一時的な失敗に、問題を悪化させずに回復するチャンスを与えること</b>です。",
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
        en: "When our app calls another server, we shouldn't wait forever if that server doesn't respond.\n\nThere are three useful ideas:\n\n1. <b>Timeout</b> — stop waiting after a certain amount of time.\n2. <b>`Promise.race()`</b> — choose whichever promise finishes first.\n3. <b>Circuit breaker</b> — stop calling a service that keeps failing.\n\n---\n\n## 1. Timeout\n\nImagine this:\n\n```javascript\nconst response = await fetch(url);\n```\n\nWhat if the server never responds?\n\nOur code could wait for a very long time.\n\nA <b>timeout</b> gives the request a deadline.\n\nFor example:\n\n```text\nWait up to 5 seconds\n↓\nServer responds → continue\nServer doesn't respond → stop waiting\n```\n\nThis prevents our application from getting stuck waiting forever.\n\n---\n\n## 2. `Promise.race()`\n\n`Promise.race()` waits for multiple promises and uses whichever one finishes first.\n\nFor example:\n\n```javascript\nawait Promise.race([\n  fetch(url),\n  timeout(5000)\n]);\n```\n\nHere we have two things happening:\n\n```text\nfetch(url)     → waiting for the server\ntimeout(5000)  → waiting for 5 seconds\n```\n\nWhichever finishes first wins.\n\n### If the server responds first:\n\n```text\nfetch → wins\ntimeout → ignored\n```\n\n### If 5 seconds pass first:\n\n```text\ntimeout → wins\nfetch → ignored\n```\n\nThis is one way to create a manual timeout.\n\n---\n\n## 3. Better timeout for `fetch()`: `AbortController`\n\nFor `fetch()`, JavaScript provides a better solution called <b>`AbortController`</b>.\n\nIt allows us to actually <b>cancel</b> the request.\n\nExample:\n\n```javascript\nconst controller = new AbortController();\n\nconst timer = setTimeout(() => {\n  controller.abort();\n}, 5000);\n\ntry {\n  const response = await fetch(url, {\n    signal: controller.signal\n  });\n\n  return response;\n} finally {\n  clearTimeout(timer);\n}\n```\n\nThe important part is:\n\n```javascript\ncontroller.abort();\n```\n\nIt tells `fetch()`:\n\n> Stop this request.\n\n### Why `clearTimeout()`?\n\nIf the request finishes quickly, the timer is still running.\n\nSo we use:\n\n```javascript\nclearTimeout(timer);\n```\n\ninside `finally` so the timer is always cleaned up.\n\n---\n\n## 4. What is a Circuit Breaker?\n\nA timeout protects <b>one request</b>.\n\nBut imagine a service is completely down.\n\nOur app might do this:\n\n```text\nRequest → wait 5 seconds → timeout\nRequest → wait 5 seconds → timeout\nRequest → wait 5 seconds → timeout\nRequest → wait 5 seconds → timeout\n```\n\nThat's bad because we're wasting time and continuing to send requests to a broken service.\n\nA <b>circuit breaker</b> stops this.\n\nThink of it like an electrical circuit breaker in a house:\n\n> Too many problems → switch off → wait → test again.\n\n---\n\n## 5. Three Circuit Breaker States\n\nA circuit breaker has three simple states.\n\n### 🟢 Closed\n\nEverything is normal.\n\n```text\nRequest → Service\n```\n\nRequests are allowed.\n\n---\n\n### 🔴 Open\n\nThere have been too many failures.\n\nThe circuit opens and stops sending requests.\n\n```text\nRequest\n  ↓\nCircuit Breaker\n  ↓\nFail immediately\n```\n\nWe don't even call the broken service.\n\nThis saves time and reduces pressure on the service.\n\n---\n\n### 🟡 Half-Open\n\nAfter waiting for a while, the circuit gives the service <b>one test request</b>.\n\nIf it works:\n\n```text\nSuccess → Closed\n```\n\nThe service seems healthy again, so normal requests continue.\n\nIf it fails:\n\n```text\nFailure → Open\n```\n\nThe circuit stops requests again.\n\n---\n\n## Simple Flow\n\n```text\n        Request\n           ↓\n     Circuit Closed\n           ↓\n       Call service\n        ↙       ↘\n    Success     Failure\n       ↓           ↓\n    Continue   More failures?\n                   ↓\n                  Yes\n                   ↓\n            Circuit Opens\n                   ↓\n               Wait\n                   ↓\n           Half-Open\n              ↙     ↘\n          Success   Failure\n             ↓         ↓\n           Closed     Open\n```\n\n## Key Takeaway\n\nThink of them like this:\n\n```text\nTimeout\n→ \"Don't wait forever.\"\n\nPromise.race()\n→ \"Whichever finishes first wins.\"\n\nAbortController\n→ \"Actually cancel the request.\"\n\nCircuit Breaker\n→ \"Stop calling a service that keeps failing.\"\n```\n\nTogether, these make your application <b>faster, safer, and more reliable</b> when other services have problems.",
        np: "हाम्रो app ले अर्को server call गर्दा, त्यो server ले response नदिए हामीले सधैंभरि wait गर्नु हुँदैन।\n\nतीन उपयोगी विचार छन्:\n\n1. <b>Timeout</b> — निश्चित समय पछि wait गर्न छोड्नु।\n2. <b>`Promise.race()`</b> — जो promise पहिले सक्किन्छ, त्यसै लिनु।\n3. <b>Circuit breaker</b> — बारम्बार fail हुने service लाई call गर्न छोड्नु।\n\n---\n\n## 1. Timeout\n\nयसो कल्पना गर्नुहोस्:\n\n```javascript\nconst response = await fetch(url);\n```\n\nयदि server ले कहिल्यै response नदिए के हुन्छ?\n\nहाम्रो code धेरै लामो समय wait गर्न सक्छ।\n\n<b>Timeout</b> ले request लाई एउटा deadline दिन्छ।\n\nउदाहरणका लागि:\n\n```text\nWait up to 5 seconds\n↓\nServer responds → continue\nServer doesn't respond → stop waiting\n```\n\nयसले हाम्रो application लाई सधैंभरि wait गर्दै अड्किनबाट बचाउँछ।\n\n---\n\n## 2. `Promise.race()`\n\n`Promise.race()` ले धेरै promise कुर्छ र जो पहिले सक्किन्छ त्यसलाई प्रयोग गर्छ।\n\nउदाहरणका लागि:\n\n```javascript\nawait Promise.race([\n  fetch(url),\n  timeout(5000)\n]);\n```\n\nयहाँ दुई चीज भइरहेका छन्:\n\n```text\nfetch(url)     → waiting for the server\ntimeout(5000)  → waiting for 5 seconds\n```\n\nजो पहिले सक्किन्छ, त्यही जित्छ।\n\n### यदि server पहिले response दिए:\n\n```text\nfetch → wins\ntimeout → ignored\n```\n\n### यदि 5 seconds पहिले बित्यो:\n\n```text\ntimeout → wins\nfetch → ignored\n```\n\nयो manual timeout बनाउने एउटा तरिका हो।\n\n---\n\n## 3. `fetch()` का लागि राम्रो timeout: `AbortController`\n\n`fetch()` का लागि JavaScript ले <b>`AbortController`</b> भनिने राम्रो समाधान दिन्छ।\n\nयसले हामीलाई request साँच्चै <b>cancel</b> गर्न दिन्छ।\n\nउदाहरण:\n\n```javascript\nconst controller = new AbortController();\n\nconst timer = setTimeout(() => {\n  controller.abort();\n}, 5000);\n\ntry {\n  const response = await fetch(url, {\n    signal: controller.signal\n  });\n\n  return response;\n} finally {\n  clearTimeout(timer);\n}\n```\n\nमहत्वपूर्ण भाग यो हो:\n\n```javascript\ncontroller.abort();\n```\n\nयसले `fetch()` लाई भन्छ:\n\n> यो request रोक।\n\n### `clearTimeout()` किन?\n\nयदि request छिटो सक्किए, timer अझै चलिरहेको हुन्छ।\n\nत्यसैले हामी प्रयोग गर्छौं:\n\n```javascript\nclearTimeout(timer);\n```\n\n`finally` भित्र, ताकि timer सधैं सफा होस्।\n\n---\n\n## 4. Circuit Breaker के हो?\n\nTimeout ले <b>एउटा request</b> लाई मात्र बचाउँछ।\n\nतर कल्पना गर्नुहोस् एउटा service पूरै down छ।\n\nहाम्रो app यसो गर्न सक्छ:\n\n```text\nRequest → wait 5 seconds → timeout\nRequest → wait 5 seconds → timeout\nRequest → wait 5 seconds → timeout\nRequest → wait 5 seconds → timeout\n```\n\nयो नराम्रो हो किनकि हामी समय खेर फाल्दै छौं र भाँचिएको service लाई request पठाइरहेका छौं।\n\n<b>Circuit breaker</b> ले यसलाई रोक्छ।\n\nयसलाई घरको बिजुलीको circuit breaker जस्तै सोच्नुहोस्:\n\n> धेरै समस्या → बन्द गर → कुर → फेरि जाँच गर।\n\n---\n\n## 5. Circuit Breaker का तीन States\n\nCircuit breaker का तीन सरल states हुन्छन्।\n\n### 🟢 Closed\n\nसबै सामान्य छ।\n\n```text\nRequest → Service\n```\n\nRequest हरू अनुमति पाउँछन्।\n\n---\n\n### 🔴 Open\n\nधेरै failures भइसकेका छन्।\n\nCircuit खुल्छ र request पठाउन बन्द गर्छ।\n\n```text\nRequest\n  ↓\nCircuit Breaker\n  ↓\nFail immediately\n```\n\nहामी भाँचिएको service लाई call पनि गर्दैनौं।\n\nयसले समय बचाउँछ र service माथिको pressure घटाउँछ।\n\n---\n\n### 🟡 Half-Open\n\nकेही बेर कुरेपछि, circuit ले service लाई <b>एउटा test request</b> दिन्छ।\n\nयदि काम गर्यो:\n\n```text\nSuccess → Closed\n```\n\nService फेरि स्वस्थ देखिन्छ, त्यसैले सामान्य request हरू जारी रहन्छन्।\n\nयदि fail भयो:\n\n```text\nFailure → Open\n```\n\nCircuit ले फेरि request रोक्छ।\n\n---\n\n## सरल Flow\n\n```text\n        Request\n           ↓\n     Circuit Closed\n           ↓\n       Call service\n        ↙       ↘\n    Success     Failure\n       ↓           ↓\n    Continue   More failures?\n                   ↓\n                  Yes\n                   ↓\n            Circuit Opens\n                   ↓\n               Wait\n                   ↓\n           Half-Open\n              ↙     ↘\n          Success   Failure\n             ↓         ↓\n           Closed     Open\n```\n\n## मुख्य सार\n\nयसलाई यसरी सोच्नुहोस्:\n\n```text\nTimeout\n→ \"Don't wait forever.\"\n\nPromise.race()\n→ \"Whichever finishes first wins.\"\n\nAbortController\n→ \"Actually cancel the request.\"\n\nCircuit Breaker\n→ \"Stop calling a service that keeps failing.\"\n```\n\nमिलेर, यिनले अरू service मा समस्या हुँदा तपाईंको application लाई <b>छिटो, सुरक्षित र भरपर्दो</b> बनाउँछन्।",
        jp: "アプリが別のサーバーを呼ぶとき、そのサーバーが応答しないなら永遠に待つべきではありません。\n\n役に立つ考え方が3つあります:\n\n1. <b>タイムアウト</b> — 一定時間が過ぎたら待つのをやめる。\n2. <b>`Promise.race()`</b> — 最初に終わったPromiseを採用する。\n3. <b>サーキットブレーカー</b> — 失敗し続けるサービスの呼び出しをやめる。\n\n---\n\n## 1. タイムアウト\n\nこう想像してください:\n\n```javascript\nconst response = await fetch(url);\n```\n\nサーバーが一度も応答しなかったら?\n\nコードは非常に長い時間待つことになります。\n\n<b>タイムアウト</b>はリクエストに期限を与えます。\n\n例:\n\n```text\nWait up to 5 seconds\n↓\nServer responds → continue\nServer doesn't respond → stop waiting\n```\n\nこれでアプリケーションが永遠に待ったまま止まることを防げます。\n\n---\n\n## 2. `Promise.race()`\n\n`Promise.race()` は複数のPromiseを待ち、最初に終わったものを使います。\n\n例:\n\n```javascript\nawait Promise.race([\n  fetch(url),\n  timeout(5000)\n]);\n```\n\nここでは2つのことが同時に起きています:\n\n```text\nfetch(url)     → waiting for the server\ntimeout(5000)  → waiting for 5 seconds\n```\n\n先に終わった方が勝ちます。\n\n### サーバーが先に応答した場合:\n\n```text\nfetch → wins\ntimeout → ignored\n```\n\n### 5秒が先に過ぎた場合:\n\n```text\ntimeout → wins\nfetch → ignored\n```\n\nこれは手動でタイムアウトを作る1つの方法です。\n\n---\n\n## 3. `fetch()` により良いタイムアウト: `AbortController`\n\n`fetch()` にはJavaScriptが<b>`AbortController`</b>というより良い方法を用意しています。\n\nこれを使うとリクエストを実際に<b>キャンセル</b>できます。\n\n例:\n\n```javascript\nconst controller = new AbortController();\n\nconst timer = setTimeout(() => {\n  controller.abort();\n}, 5000);\n\ntry {\n  const response = await fetch(url, {\n    signal: controller.signal\n  });\n\n  return response;\n} finally {\n  clearTimeout(timer);\n}\n```\n\n重要な部分はここです:\n\n```javascript\ncontroller.abort();\n```\n\nこれは `fetch()` にこう伝えます:\n\n> このリクエストを止めて。\n\n### なぜ `clearTimeout()` が必要か?\n\nリクエストが早く終わっても、タイマーはまだ動いています。\n\nそこで次を使います:\n\n```javascript\nclearTimeout(timer);\n```\n\n`finally` の中で呼ぶことで、タイマーは必ず片付けられます。\n\n---\n\n## 4. サーキットブレーカーとは?\n\nタイムアウトが守るのは<b>1つのリクエスト</b>だけです。\n\nしかし、あるサービスが完全に停止していると想像してください。\n\nアプリはこうなるかもしれません:\n\n```text\nRequest → wait 5 seconds → timeout\nRequest → wait 5 seconds → timeout\nRequest → wait 5 seconds → timeout\nRequest → wait 5 seconds → timeout\n```\n\n時間を無駄にし、壊れたサービスにリクエストを送り続けているので、これは良くありません。\n\n<b>サーキットブレーカー</b>がこれを止めます。\n\n家のブレーカーのように考えてください:\n\n> 問題が多すぎる → 遮断する → 待つ → もう一度試す。\n\n---\n\n## 5. サーキットブレーカーの3つの状態\n\nサーキットブレーカーには3つのシンプルな状態があります。\n\n### 🟢 Closed（閉）\n\nすべて正常です。\n\n```text\nRequest → Service\n```\n\nリクエストは許可されます。\n\n---\n\n### 🔴 Open（開）\n\n失敗が多すぎました。\n\n回路が開き、リクエストの送信を止めます。\n\n```text\nRequest\n  ↓\nCircuit Breaker\n  ↓\nFail immediately\n```\n\n壊れたサービスを呼び出しさえしません。\n\nこれで時間を節約し、サービスへの負荷を減らせます。\n\n---\n\n### 🟡 Half-Open（半開）\n\nしばらく待った後、回路はサービスに<b>1回だけテストのリクエスト</b>を送ります。\n\nうまくいけば:\n\n```text\nSuccess → Closed\n```\n\nサービスは回復したように見えるので、通常のリクエストが続きます。\n\n失敗すれば:\n\n```text\nFailure → Open\n```\n\n回路は再びリクエストを止めます。\n\n---\n\n## シンプルな流れ\n\n```text\n        Request\n           ↓\n     Circuit Closed\n           ↓\n       Call service\n        ↙       ↘\n    Success     Failure\n       ↓           ↓\n    Continue   More failures?\n                   ↓\n                  Yes\n                   ↓\n            Circuit Opens\n                   ↓\n               Wait\n                   ↓\n           Half-Open\n              ↙     ↘\n          Success   Failure\n             ↓         ↓\n           Closed     Open\n```\n\n## 重要なポイント\n\nこう考えてください:\n\n```text\nTimeout\n→ \"Don't wait forever.\"\n\nPromise.race()\n→ \"Whichever finishes first wins.\"\n\nAbortController\n→ \"Actually cancel the request.\"\n\nCircuit Breaker\n→ \"Stop calling a service that keeps failing.\"\n```\n\nこれらを組み合わせることで、他のサービスに問題があるときでもアプリケーションは<b>より速く、より安全で、より信頼できる</b>ものになります。",
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
