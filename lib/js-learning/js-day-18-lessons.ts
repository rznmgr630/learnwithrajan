import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_18_LESSONS: JsLessonDay = {
  day: 18,
  title: { en: "Advanced promise patterns — retry, timeout & concurrency", np: "Advanced Promise patterns", jp: "Promise応用パターン" },
  totalMinutes: 27,
  difficulty: { en: "Intermediate", np: "Intermediate", jp: "中級" },
  lessons: [
    {
      id: "retry-backoff",
      title: { en: "Retry with Exponential Backoff", np: "Exponential Backoff सहित Retry", jp: "指数バックオフによるリトライ" },
      durationMinutes: 9,
      explanation: {
        en: "Sometimes a request fails because of a temporary problem, such as a network issue or a server being overloaded. In these cases, we can <b>try the request again</b>.\n\nBut simply retrying again and again is dangerous. If we retry forever, one failed request could keep hitting an already-problematic server and make things worse.\n\n## 1. Limit the number of retries\n\nThe first thing we should do is set a `maxAttempts`.\n\nFor example:\n\n• Try the request\n• If it fails, try again\n• Keep trying until we reach `maxAttempts`\n• If it still fails, throw the error\n\nThis prevents our application from retrying forever.\n\n## 2. Wait between retries\n\nWe shouldn't retry immediately after a failure.\n\nInstead, we use <b>exponential backoff</b>. This means that we wait longer after each failed attempt.\n\nFor example:\n\n```text\n1st retry → wait 1 second\n2nd retry → wait 2 seconds\n3rd retry → wait 4 seconds\n4th retry → wait 8 seconds\n```\n\nA simple formula is:\n\n```text\nbaseDelayMs * 2 ** attempt\n```\n\nWe should also set a `maxDelayMs` so the waiting time doesn't become too long.\n\n## 3. Add jitter\n\nImagine 1,000 users make requests at the same time and all of them fail.\n\nIf everyone follows exactly the same retry schedule:\n\n```text\n1 second → everyone retries\n2 seconds → everyone retries\n4 seconds → everyone retries\n```\n\nThe server could suddenly receive thousands of requests at the same time. This is called a <b>retry storm</b>.\n\nTo avoid this, we add a small random amount of time called <b>jitter</b>.\n\nFor example:\n\n```text\nClient A → waits 1.2 seconds\nClient B → waits 1.7 seconds\nClient C → waits 1.4 seconds\n```\n\nNow the requests are spread out instead of all happening at exactly the same moment.\n\n## 4. Don't retry every error\n\nSome errors are temporary, while others will fail every time.\n\nUsually, we should retry things like:\n\n• `5xx` server errors\n• Network errors\n• `429 Too Many Requests`\n\nBut we generally shouldn't retry normal `4xx` errors.\n\nFor example:\n\n```text\n400 Bad Request\n401 Unauthorized\n403 Forbidden\n404 Not Found\n```\n\nIf the request is invalid or the user isn't authorized, sending the exact same request again probably won't fix anything.\n\nThat's why we can use a function like:\n\n```javascript\nshouldRetry(error)\n```\n\nIt decides whether a particular error is worth retrying.\n\n## 5. Be careful with POST requests\n\nThere's another important problem with retries.\n\nImagine we send:\n\n```http\nPOST /users\n```\n\nThe server successfully creates the user, but the response gets lost because of a network problem.\n\nOur application doesn't know that the user was already created, so it retries the request.\n\nNow the server might create <b>another user</b>.\n\nFor operations that aren't naturally safe to repeat, such as creating a record with `POST`, we should use an <b>idempotency key</b>.\n\nThe key allows the server to recognize:\n\n> \"I've already processed this request, so don't create it again.\"",
        np: "कहिलेकाहीँ request अस्थायी समस्याको कारण fail हुन्छ, जस्तै network issue वा server धेरै load भएको। यस्तो अवस्थामा, हामी <b>request फेरि try गर्न सक्छौं</b>।\n\nतर बारम्बार retry गर्दै जानु खतरनाक हुन्छ। यदि हामी सधैंभरि retry गर्यौं भने, एउटै fail भएको request ले पहिले नै समस्यामा परेको server लाई हानिरहन्छ र स्थिति अझ बिग्रिन्छ।\n\n## 1. Retry को संख्या सीमित गर्नुहोस्\n\nपहिलो काम `maxAttempts` सेट गर्नु हो।\n\nउदाहरणका लागि:\n\n• Request try गर्नुहोस्\n• Fail भयो भने फेरि try गर्नुहोस्\n• `maxAttempts` पुग्ने बेलासम्म try गरिरहनुहोस्\n• अझै fail भयो भने error throw गर्नुहोस्\n\nयसले हाम्रो application लाई सधैंभरि retry गर्नबाट रोक्छ।\n\n## 2. Retry बीचमा wait गर्नुहोस्\n\nFail भएको लगत्तै retry गर्नु हुँदैन।\n\nबरु, हामी <b>exponential backoff</b> प्रयोग गर्छौं। यसको अर्थ हरेक fail भएको attempt पछि हामी अझ लामो समय wait गर्छौं।\n\nउदाहरणका लागि:\n\n```text\n1st retry → wait 1 second\n2nd retry → wait 2 seconds\n3rd retry → wait 4 seconds\n4th retry → wait 8 seconds\n```\n\nसरल formula यो हो:\n\n```text\nbaseDelayMs * 2 ** attempt\n```\n\nहामीले `maxDelayMs` पनि सेट गर्नुपर्छ ताकि wait गर्ने समय धेरै लामो नहोस्।\n\n## 3. Jitter थप्नुहोस्\n\nकल्पना गर्नुहोस् 1,000 users एकै समयमा request गर्छन् र सबै fail हुन्छन्।\n\nयदि सबैले ठ्याक्कै उही retry schedule पछ्याउँछन् भने:\n\n```text\n1 second → everyone retries\n2 seconds → everyone retries\n4 seconds → everyone retries\n```\n\nServer ले अचानक हजारौं request एकै समयमा पाउन सक्छ। यसलाई <b>retry storm</b> भनिन्छ।\n\nयसलाई बच्न, हामी <b>jitter</b> भनिने सानो random समय थप्छौं।\n\nउदाहरणका लागि:\n\n```text\nClient A → waits 1.2 seconds\nClient B → waits 1.7 seconds\nClient C → waits 1.4 seconds\n```\n\nअब request हरू ठ्याक्कै एउटै क्षणमा नभई फैलिएर जान्छन्।\n\n## 4. हरेक error retry नगर्नुहोस्\n\nकेही error अस्थायी हुन्छन्, केही हरेक पटक fail हुन्छन्।\n\nसामान्यतया, हामीले यस्ता चीज retry गर्नुपर्छ:\n\n• `5xx` server errors\n• Network errors\n• `429 Too Many Requests`\n\nतर सामान्य `4xx` errors लाई retry गर्नु हुँदैन।\n\nउदाहरणका लागि:\n\n```text\n400 Bad Request\n401 Unauthorized\n403 Forbidden\n404 Not Found\n```\n\nयदि request invalid छ वा user authorized छैन भने, ठ्याक्कै उही request फेरि पठाउँदा केही ठीक हुँदैन।\n\nत्यसैले हामी यस्तो function प्रयोग गर्न सक्छौं:\n\n```javascript\nshouldRetry(error)\n```\n\nयसले कुन error retry गर्न लायक छ भन्ने निर्णय गर्छ।\n\n## 5. POST request मा होसियार हुनुहोस्\n\nRetry सँग अझ एउटा महत्वपूर्ण समस्या छ।\n\nकल्पना गर्नुहोस् हामी पठाउँछौं:\n\n```http\nPOST /users\n```\n\nServer ले user सफलतापूर्वक बनाउँछ, तर network समस्याको कारण response हराउँछ।\n\nहाम्रो application लाई user पहिले नै बनिसकेको थाहा हुँदैन, त्यसैले यो request retry गर्छ।\n\nअब server ले <b>अर्को user</b> बनाउन सक्छ।\n\nदोहोर्याउन स्वभाविक रूपमा सुरक्षित नभएका operations, जस्तै `POST` ले record बनाउनु, को लागि हामीले <b>idempotency key</b> प्रयोग गर्नुपर्छ।\n\nKey ले server लाई चिन्न दिन्छ:\n\n> \"मैले यो request पहिले नै process गरिसकेको छु, त्यसैले फेरि नबनाउ।\"",
        jp: "ネットワークの問題やサーバーの過負荷など、一時的な原因でリクエストが失敗することがあります。そのような場合は<b>リクエストをもう一度試す</b>ことができます。\n\nしかし、ただ何度もリトライを繰り返すのは危険です。永遠にリトライすると、1つの失敗したリクエストがすでに問題を抱えたサーバーを叩き続け、状況をさらに悪化させます。\n\n## 1. リトライ回数を制限する\n\nまず最初にすべきことは `maxAttempts` を設定することです。\n\n例:\n\n• リクエストを試す\n• 失敗したらもう一度試す\n• `maxAttempts` に達するまで試し続ける\n• それでも失敗したらエラーをスローする\n\nこれでアプリケーションが永遠にリトライすることを防げます。\n\n## 2. リトライの間に待つ\n\n失敗した直後にすぐリトライすべきではありません。\n\n代わりに<b>指数バックオフ</b>を使います。これは失敗するたびに待ち時間を長くしていくという意味です。\n\n例:\n\n```text\n1st retry → wait 1 second\n2nd retry → wait 2 seconds\n3rd retry → wait 4 seconds\n4th retry → wait 8 seconds\n```\n\nシンプルな式は次のとおりです:\n\n```text\nbaseDelayMs * 2 ** attempt\n```\n\n待ち時間が長くなりすぎないように `maxDelayMs` も設定すべきです。\n\n## 3. ジッターを加える\n\n1,000人のユーザーが同時にリクエストして、その全部が失敗したと想像してください。\n\n全員がまったく同じリトライスケジュールに従うと:\n\n```text\n1 second → everyone retries\n2 seconds → everyone retries\n4 seconds → everyone retries\n```\n\nサーバーは突然、何千ものリクエストを同時に受け取ることになります。これを<b>リトライストーム</b>と呼びます。\n\nこれを避けるために、<b>ジッター</b>と呼ばれる少量のランダムな時間を加えます。\n\n例:\n\n```text\nClient A → waits 1.2 seconds\nClient B → waits 1.7 seconds\nClient C → waits 1.4 seconds\n```\n\nこれでリクエストはまったく同じ瞬間に集まらず、分散されます。\n\n## 4. すべてのエラーをリトライしない\n\n一時的なエラーもあれば、毎回必ず失敗するエラーもあります。\n\n通常、次のようなものはリトライすべきです:\n\n• `5xx` サーバーエラー\n• ネットワークエラー\n• `429 Too Many Requests`\n\nしかし、通常の `4xx` エラーはリトライすべきではありません。\n\n例:\n\n```text\n400 Bad Request\n401 Unauthorized\n403 Forbidden\n404 Not Found\n```\n\nリクエストが不正であったり、ユーザーに権限がない場合、まったく同じリクエストをもう一度送っても何も解決しません。\n\nそのため、次のような関数を使えます:\n\n```javascript\nshouldRetry(error)\n```\n\nこれは、そのエラーがリトライする価値があるかどうかを判断します。\n\n## 5. POSTリクエストには注意する\n\nリトライにはもう1つ重要な問題があります。\n\n次を送ると想像してください:\n\n```http\nPOST /users\n```\n\nサーバーはユーザーの作成に成功しますが、ネットワークの問題でレスポンスが失われます。\n\nアプリケーションはユーザーがすでに作成されたことを知らないため、リクエストをリトライします。\n\nその結果、サーバーは<b>もう1人のユーザー</b>を作ってしまうかもしれません。\n\n`POST` でレコードを作成するなど、繰り返しても安全とは言えない操作には<b>冪等性キー</b>を使うべきです。\n\nこのキーによってサーバーは次のように認識できます:\n\n> 「このリクエストはすでに処理済みなので、もう作らない。」",
      },
      diagram: `Request
   ↓
Did it succeed?
   ↓
 Yes → Return result
   ↓
 No
   ↓
Should we retry?
   ↓
 No → Throw error
   ↓
 Yes
   ↓
Wait using exponential backoff + jitter
   ↓
Try again
   ↓
Reached max attempts?
   ↓
 Yes → Throw error`,
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
        { en: "<b>Limited attempts</b> — cap retries with `maxAttempts` and throw the error once that limit is reached, so the app never retries forever.", np: "<b>सीमित attempts</b> — `maxAttempts` ले retries cap गर्नुहोस् र त्यो limit पुगेपछि error throw गर्नुहोस्, ताकि app सधैंभरि retry नगरोस्।", jp: "<b>回数の制限</b> — `maxAttempts` でリトライを制限し、上限に達したらエラーをスローする。こうすればアプリが永遠にリトライすることはない。" },
        { en: "<b>Exponential backoff</b> — wait longer after each failure (`baseDelayMs * 2 ** attempt`), so waits grow 1s, 2s, 4s, 8s.", np: "<b>Exponential backoff</b> — हरेक failure पछि अझ लामो wait गर्नुहोस् (`baseDelayMs * 2 ** attempt`), ताकि wait 1s, 2s, 4s, 8s गरी बढ्छ।", jp: "<b>指数バックオフ</b> — 失敗ごとに待ち時間を長くする（`baseDelayMs * 2 ** attempt`）ので、待機は1秒、2秒、4秒、8秒と増えていく。" },
        { en: "<b>Maximum delay</b> — set a `maxDelayMs` so the waiting time never becomes too long.", np: "<b>Maximum delay</b> — `maxDelayMs` सेट गर्नुहोस् ताकि wait गर्ने समय कहिल्यै धेरै लामो नहोस्।", jp: "<b>最大遅延</b> — `maxDelayMs` を設定し、待ち時間が長くなりすぎないようにする。" },
        { en: "<b>Jitter</b> — add a small random amount to each delay so thousands of clients don't retry at the exact same moment and cause a retry storm.", np: "<b>Jitter</b> — हरेक delay मा सानो random समय थप्नुहोस् ताकि हजारौं client ठ्याक्कै एउटै क्षणमा retry गरी retry storm नबनाउन्।", jp: "<b>ジッター</b> — 各遅延に少量のランダムな時間を加え、何千のクライアントがまったく同じ瞬間にリトライしてリトライストームを起こさないようにする。" },
        { en: "<b>Retry only temporary errors</b> — `5xx`, network errors and `429 Too Many Requests`. Normal `4xx` errors like `400`, `401`, `403` and `404` will fail the same way every time.", np: "<b>अस्थायी error मात्र retry गर्नुहोस्</b> — `5xx`, network errors र `429 Too Many Requests`। `400`, `401`, `403` र `404` जस्ता सामान्य `4xx` errors हरेक पटक उस्तै रूपमा fail हुन्छन्।", jp: "<b>一時的なエラーだけリトライする</b> — `5xx`、ネットワークエラー、`429 Too Many Requests`。`400`・`401`・`403`・`404` のような通常の `4xx` エラーは毎回同じように失敗する。" },
        { en: "<b>Idempotency</b> — for operations that aren't safe to repeat, such as creating a record with `POST`, send an idempotency key so a retry can't create a duplicate.", np: "<b>Idempotency</b> — दोहोर्याउन सुरक्षित नभएका operations, जस्तै `POST` ले record बनाउनु, को लागि idempotency key पठाउनुहोस् ताकि retry ले duplicate नबनाउन सकोस्।", jp: "<b>冪等性</b> — `POST` でレコードを作成するなど繰り返しても安全でない操作には冪等性キーを送り、リトライが重複を作れないようにする。" },
        { en: "The goal isn't to retry as much as possible. The goal is to give a temporary failure a chance to recover without making the problem worse.", np: "लक्ष्य जति सक्दो धेरै retry गर्नु होइन। लक्ष्य अस्थायी failure लाई समस्या अझ बिगार्न नदिई recover हुने मौका दिनु हो।", jp: "目標はできるだけ多くリトライすることではない。目標は一時的な失敗に、問題を悪化させずに回復するチャンスを与えることだ。" },
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
        en: "When our app calls another server, we shouldn't wait forever if that server doesn't respond.\n\nThere are three useful ideas:\n\n1. <b>Timeout</b> — stop waiting after a certain amount of time.\n2. <b>`Promise.race()`</b> — choose whichever promise finishes first.\n3. <b>Circuit breaker</b> — stop calling a service that keeps failing.\n\n---\n\n## 1. Timeout\n\nImagine this:\n\n```javascript\nconst response = await fetch(url);\n```\n\nWhat if the server never responds?\n\nOur code could wait for a very long time.\n\nA <b>timeout</b> gives the request a deadline.\n\nFor example:\n\n```text\nWait up to 5 seconds\n↓\nServer responds → continue\nServer doesn't respond → stop waiting\n```\n\nThis prevents our application from getting stuck waiting forever.\n\n---\n\n## 2. `Promise.race()`\n\n`Promise.race()` waits for multiple promises and uses whichever one finishes first.\n\nFor example:\n\n```javascript\nawait Promise.race([\n  fetch(url),\n  timeout(5000)\n]);\n```\n\nHere we have two things happening:\n\n```text\nfetch(url)     → waiting for the server\ntimeout(5000)  → waiting for 5 seconds\n```\n\nWhichever finishes first wins.\n\n### If the server responds first:\n\n```text\nfetch → wins\ntimeout → ignored\n```\n\n### If 5 seconds pass first:\n\n```text\ntimeout → wins\nfetch → ignored\n```\n\nThis is one way to create a manual timeout.\n\n---\n\n## 3. Better timeout for `fetch()`: `AbortController`\n\nFor `fetch()`, JavaScript provides a better solution called <b>`AbortController`</b>.\n\nIt allows us to actually <b>cancel</b> the request.\n\nExample:\n\n```javascript\nconst controller = new AbortController();\n\nconst timer = setTimeout(() => {\n  controller.abort();\n}, 5000);\n\ntry {\n  const response = await fetch(url, {\n    signal: controller.signal\n  });\n\n  return response;\n} finally {\n  clearTimeout(timer);\n}\n```\n\nThe important part is:\n\n```javascript\ncontroller.abort();\n```\n\nIt tells `fetch()`:\n\n> Stop this request.\n\n### Why `clearTimeout()`?\n\nIf the request finishes quickly, the timer is still running.\n\nSo we use:\n\n```javascript\nclearTimeout(timer);\n```\n\ninside `finally` so the timer is always cleaned up.\n\n---\n\n## 4. What is a Circuit Breaker?\n\nA timeout protects <b>one request</b>.\n\nBut imagine a service is completely down.\n\nOur app might do this:\n\n```text\nRequest → wait 5 seconds → timeout\nRequest → wait 5 seconds → timeout\nRequest → wait 5 seconds → timeout\nRequest → wait 5 seconds → timeout\n```\n\nThat's bad because we're wasting time and continuing to send requests to a broken service.\n\nA <b>circuit breaker</b> stops this.\n\nThink of it like an electrical circuit breaker in a house:\n\n> Too many problems → switch off → wait → test again.\n\n---\n\n## 5. Three Circuit Breaker States\n\nA circuit breaker has three simple states.\n\n### 🟢 Closed\n\nEverything is normal.\n\n```text\nRequest → Service\n```\n\nRequests are allowed.\n\n---\n\n### 🔴 Open\n\nThere have been too many failures.\n\nThe circuit opens and stops sending requests.\n\n```text\nRequest\n  ↓\nCircuit Breaker\n  ↓\nFail immediately\n```\n\nWe don't even call the broken service.\n\nThis saves time and reduces pressure on the service.\n\n---\n\n### 🟡 Half-Open\n\nAfter waiting for a while, the circuit gives the service <b>one test request</b>.\n\nIf it works:\n\n```text\nSuccess → Closed\n```\n\nThe service seems healthy again, so normal requests continue.\n\nIf it fails:\n\n```text\nFailure → Open\n```\n\nThe circuit stops requests again.",
        np: "हाम्रो app ले अर्को server call गर्दा, त्यो server ले response नदिए हामीले सधैंभरि wait गर्नु हुँदैन।\n\nतीन उपयोगी विचार छन्:\n\n1. <b>Timeout</b> — निश्चित समय पछि wait गर्न छोड्नु।\n2. <b>`Promise.race()`</b> — जो promise पहिले सक्किन्छ, त्यसै लिनु।\n3. <b>Circuit breaker</b> — बारम्बार fail हुने service लाई call गर्न छोड्नु।\n\n---\n\n## 1. Timeout\n\nयसो कल्पना गर्नुहोस्:\n\n```javascript\nconst response = await fetch(url);\n```\n\nयदि server ले कहिल्यै response नदिए के हुन्छ?\n\nहाम्रो code धेरै लामो समय wait गर्न सक्छ।\n\n<b>Timeout</b> ले request लाई एउटा deadline दिन्छ।\n\nउदाहरणका लागि:\n\n```text\nWait up to 5 seconds\n↓\nServer responds → continue\nServer doesn't respond → stop waiting\n```\n\nयसले हाम्रो application लाई सधैंभरि wait गर्दै अड्किनबाट बचाउँछ।\n\n---\n\n## 2. `Promise.race()`\n\n`Promise.race()` ले धेरै promise कुर्छ र जो पहिले सक्किन्छ त्यसलाई प्रयोग गर्छ।\n\nउदाहरणका लागि:\n\n```javascript\nawait Promise.race([\n  fetch(url),\n  timeout(5000)\n]);\n```\n\nयहाँ दुई चीज भइरहेका छन्:\n\n```text\nfetch(url)     → waiting for the server\ntimeout(5000)  → waiting for 5 seconds\n```\n\nजो पहिले सक्किन्छ, त्यही जित्छ।\n\n### यदि server पहिले response दिए:\n\n```text\nfetch → wins\ntimeout → ignored\n```\n\n### यदि 5 seconds पहिले बित्यो:\n\n```text\ntimeout → wins\nfetch → ignored\n```\n\nयो manual timeout बनाउने एउटा तरिका हो।\n\n---\n\n## 3. `fetch()` का लागि राम्रो timeout: `AbortController`\n\n`fetch()` का लागि JavaScript ले <b>`AbortController`</b> भनिने राम्रो समाधान दिन्छ।\n\nयसले हामीलाई request साँच्चै <b>cancel</b> गर्न दिन्छ।\n\nउदाहरण:\n\n```javascript\nconst controller = new AbortController();\n\nconst timer = setTimeout(() => {\n  controller.abort();\n}, 5000);\n\ntry {\n  const response = await fetch(url, {\n    signal: controller.signal\n  });\n\n  return response;\n} finally {\n  clearTimeout(timer);\n}\n```\n\nमहत्वपूर्ण भाग यो हो:\n\n```javascript\ncontroller.abort();\n```\n\nयसले `fetch()` लाई भन्छ:\n\n> यो request रोक।\n\n### `clearTimeout()` किन?\n\nयदि request छिटो सक्किए, timer अझै चलिरहेको हुन्छ।\n\nत्यसैले हामी प्रयोग गर्छौं:\n\n```javascript\nclearTimeout(timer);\n```\n\n`finally` भित्र, ताकि timer सधैं सफा होस्।\n\n---\n\n## 4. Circuit Breaker के हो?\n\nTimeout ले <b>एउटा request</b> लाई मात्र बचाउँछ।\n\nतर कल्पना गर्नुहोस् एउटा service पूरै down छ।\n\nहाम्रो app यसो गर्न सक्छ:\n\n```text\nRequest → wait 5 seconds → timeout\nRequest → wait 5 seconds → timeout\nRequest → wait 5 seconds → timeout\nRequest → wait 5 seconds → timeout\n```\n\nयो नराम्रो हो किनकि हामी समय खेर फाल्दै छौं र भाँचिएको service लाई request पठाइरहेका छौं।\n\n<b>Circuit breaker</b> ले यसलाई रोक्छ।\n\nयसलाई घरको बिजुलीको circuit breaker जस्तै सोच्नुहोस्:\n\n> धेरै समस्या → बन्द गर → कुर → फेरि जाँच गर।\n\n---\n\n## 5. Circuit Breaker का तीन States\n\nCircuit breaker का तीन सरल states हुन्छन्।\n\n### 🟢 Closed\n\nसबै सामान्य छ।\n\n```text\nRequest → Service\n```\n\nRequest हरू अनुमति पाउँछन्।\n\n---\n\n### 🔴 Open\n\nधेरै failures भइसकेका छन्।\n\nCircuit खुल्छ र request पठाउन बन्द गर्छ।\n\n```text\nRequest\n  ↓\nCircuit Breaker\n  ↓\nFail immediately\n```\n\nहामी भाँचिएको service लाई call पनि गर्दैनौं।\n\nयसले समय बचाउँछ र service माथिको pressure घटाउँछ।\n\n---\n\n### 🟡 Half-Open\n\nकेही बेर कुरेपछि, circuit ले service लाई <b>एउटा test request</b> दिन्छ।\n\nयदि काम गर्यो:\n\n```text\nSuccess → Closed\n```\n\nService फेरि स्वस्थ देखिन्छ, त्यसैले सामान्य request हरू जारी रहन्छन्।\n\nयदि fail भयो:\n\n```text\nFailure → Open\n```\n\nCircuit ले फेरि request रोक्छ।",
        jp: "アプリが別のサーバーを呼ぶとき、そのサーバーが応答しないなら永遠に待つべきではありません。\n\n役に立つ考え方が3つあります:\n\n1. <b>タイムアウト</b> — 一定時間が過ぎたら待つのをやめる。\n2. <b>`Promise.race()`</b> — 最初に終わったPromiseを採用する。\n3. <b>サーキットブレーカー</b> — 失敗し続けるサービスの呼び出しをやめる。\n\n---\n\n## 1. タイムアウト\n\nこう想像してください:\n\n```javascript\nconst response = await fetch(url);\n```\n\nサーバーが一度も応答しなかったら?\n\nコードは非常に長い時間待つことになります。\n\n<b>タイムアウト</b>はリクエストに期限を与えます。\n\n例:\n\n```text\nWait up to 5 seconds\n↓\nServer responds → continue\nServer doesn't respond → stop waiting\n```\n\nこれでアプリケーションが永遠に待ったまま止まることを防げます。\n\n---\n\n## 2. `Promise.race()`\n\n`Promise.race()` は複数のPromiseを待ち、最初に終わったものを使います。\n\n例:\n\n```javascript\nawait Promise.race([\n  fetch(url),\n  timeout(5000)\n]);\n```\n\nここでは2つのことが同時に起きています:\n\n```text\nfetch(url)     → waiting for the server\ntimeout(5000)  → waiting for 5 seconds\n```\n\n先に終わった方が勝ちます。\n\n### サーバーが先に応答した場合:\n\n```text\nfetch → wins\ntimeout → ignored\n```\n\n### 5秒が先に過ぎた場合:\n\n```text\ntimeout → wins\nfetch → ignored\n```\n\nこれは手動でタイムアウトを作る1つの方法です。\n\n---\n\n## 3. `fetch()` により良いタイムアウト: `AbortController`\n\n`fetch()` にはJavaScriptが<b>`AbortController`</b>というより良い方法を用意しています。\n\nこれを使うとリクエストを実際に<b>キャンセル</b>できます。\n\n例:\n\n```javascript\nconst controller = new AbortController();\n\nconst timer = setTimeout(() => {\n  controller.abort();\n}, 5000);\n\ntry {\n  const response = await fetch(url, {\n    signal: controller.signal\n  });\n\n  return response;\n} finally {\n  clearTimeout(timer);\n}\n```\n\n重要な部分はここです:\n\n```javascript\ncontroller.abort();\n```\n\nこれは `fetch()` にこう伝えます:\n\n> このリクエストを止めて。\n\n### なぜ `clearTimeout()` が必要か?\n\nリクエストが早く終わっても、タイマーはまだ動いています。\n\nそこで次を使います:\n\n```javascript\nclearTimeout(timer);\n```\n\n`finally` の中で呼ぶことで、タイマーは必ず片付けられます。\n\n---\n\n## 4. サーキットブレーカーとは?\n\nタイムアウトが守るのは<b>1つのリクエスト</b>だけです。\n\nしかし、あるサービスが完全に停止していると想像してください。\n\nアプリはこうなるかもしれません:\n\n```text\nRequest → wait 5 seconds → timeout\nRequest → wait 5 seconds → timeout\nRequest → wait 5 seconds → timeout\nRequest → wait 5 seconds → timeout\n```\n\n時間を無駄にし、壊れたサービスにリクエストを送り続けているので、これは良くありません。\n\n<b>サーキットブレーカー</b>がこれを止めます。\n\n家のブレーカーのように考えてください:\n\n> 問題が多すぎる → 遮断する → 待つ → もう一度試す。\n\n---\n\n## 5. サーキットブレーカーの3つの状態\n\nサーキットブレーカーには3つのシンプルな状態があります。\n\n### 🟢 Closed（閉）\n\nすべて正常です。\n\n```text\nRequest → Service\n```\n\nリクエストは許可されます。\n\n---\n\n### 🔴 Open（開）\n\n失敗が多すぎました。\n\n回路が開き、リクエストの送信を止めます。\n\n```text\nRequest\n  ↓\nCircuit Breaker\n  ↓\nFail immediately\n```\n\n壊れたサービスを呼び出しさえしません。\n\nこれで時間を節約し、サービスへの負荷を減らせます。\n\n---\n\n### 🟡 Half-Open（半開）\n\nしばらく待った後、回路はサービスに<b>1回だけテストのリクエスト</b>を送ります。\n\nうまくいけば:\n\n```text\nSuccess → Closed\n```\n\nサービスは回復したように見えるので、通常のリクエストが続きます。\n\n失敗すれば:\n\n```text\nFailure → Open\n```\n\n回路は再びリクエストを止めます。",
      },
      diagram: `        Request
           ↓
     Circuit Closed
           ↓
       Call service
        ↙       ↘
    Success     Failure
       ↓           ↓
    Continue   More failures?
                   ↓
                  Yes
                   ↓
            Circuit Opens
                   ↓
               Wait
                   ↓
           Half-Open
              ↙     ↘
          Success   Failure
             ↓         ↓
           Closed     Open`,
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
        { en: "<b>Timeout</b> → \"Don't wait forever.\" Give every call to another server a deadline so your app can't get stuck.", np: "<b>Timeout</b> → \"सधैंभरि wait नगर।\" अर्को server लाई गर्ने हरेक call लाई deadline दिनुहोस् ताकि तपाईंको app अड्किन नसकोस्।", jp: "<b>タイムアウト</b> → \"永遠に待たない。\" 他のサーバーへの呼び出しには必ず期限を与え、アプリが止まらないようにする。" },
        { en: "<b>`Promise.race()`</b> → \"Whichever finishes first wins.\" Race the real work against a timer to build a manual timeout.", np: "<b>`Promise.race()`</b> → \"जो पहिले सक्किन्छ, त्यही जित्छ।\" वास्तविक काम लाई timer सँग race गराई manual timeout बनाउनुहोस्।", jp: "<b>`Promise.race()`</b> → \"先に終わった方が勝つ。\" 実際の処理をタイマーと競わせて手動のタイムアウトを作る。" },
        { en: "<b>`AbortController`</b> → \"Actually cancel the request.\" `Promise.race()` only ignores the loser; `controller.abort()` really stops the `fetch()`. Always `clearTimeout()` in `finally`.", np: "<b>`AbortController`</b> → \"Request साँच्चै cancel गर।\" `Promise.race()` ले हारेको लाई बेवास्ता मात्र गर्छ; `controller.abort()` ले `fetch()` साँच्चै रोक्छ। `finally` मा सधैं `clearTimeout()` गर्नुहोस्।", jp: "<b>`AbortController`</b> → \"リクエストを実際にキャンセルする。\" `Promise.race()` は負けた方を無視するだけ。`controller.abort()` は `fetch()` を本当に止める。`finally` では必ず `clearTimeout()` する。" },
        { en: "<b>Circuit breaker</b> → \"Stop calling a service that keeps failing.\" Too many failures → switch off → wait → test again.", np: "<b>Circuit breaker</b> → \"बारम्बार fail हुने service लाई call गर्न छोड।\" धेरै failures → बन्द गर → कुर → फेरि जाँच गर।", jp: "<b>サーキットブレーカー</b> → \"失敗し続けるサービスの呼び出しをやめる。\" 失敗が多すぎる → 遮断する → 待つ → もう一度試す。" },
        { en: "Three states: <b>Closed</b> (requests flow normally), <b>Open</b> (fail immediately without calling the service), <b>Half-Open</b> (one test request decides whether to close or open again).", np: "तीन states: <b>Closed</b> (request सामान्य रूपमा जान्छन्), <b>Open</b> (service call नगरी तुरुन्तै fail), <b>Half-Open</b> (एउटा test request ले फेरि close गर्ने वा open राख्ने निर्णय गर्छ)।", jp: "3つの状態: <b>Closed</b>（リクエストは通常どおり流れる）、<b>Open</b>（サービスを呼ばず即座に失敗）、<b>Half-Open</b>（1回のテストリクエストで再び閉じるか開くかを決める）。" },
        { en: "Together, these make your application faster, safer and more reliable when other services have problems.", np: "मिलेर, यिनले अरू service मा समस्या हुँदा तपाईंको application लाई छिटो, सुरक्षित र भरपर्दो बनाउँछन्।", jp: "これらを組み合わせることで、他のサービスに問題があるときでもアプリケーションはより速く、より安全で、より信頼できるものになる。" },
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
        en: "When working with many requests, two common problems can happen:\n\n1. <b>Too many requests at once</b>\n2. <b>The same request being made multiple times</b>\n\nTwo useful solutions are <b>concurrency limiting</b> and <b>request deduplication/memoization</b>.\n\n---\n\n## 1. The Problem with `Promise.all()`\n\nYou might write:\n\n```javascript\nconst results = await Promise.all(\n  urls.map(url => fetch(url))\n);\n```\n\nThis looks simple.\n\nBut imagine you have <b>1,000 URLs</b>.\n\n```text\n1,000 URLs\n    ↓\n1,000 requests at once 😨\n```\n\nThis can:\n\n• Overload your server\n• Hit an API's rate limit\n• Use too many connections\n• Make your application slower\n\nInstead, we can limit how many requests run at the same time.\n\n---\n\n## 2. Concurrency Limiting\n\n<b>Concurrency</b> means how many tasks are running at the same time.\n\nFor example, if our limit is `5`:\n\n```text\n5 requests running\n↓\nOne finishes\n↓\nStart another request\n↓\nOne finishes\n↓\nStart another request\n```\n\nSo we never have more than <b>5 requests running at once</b>.\n\n### Simple idea\n\n```text\n100 URLs\n   ↓\nLimit = 5\n   ↓\n5 requests start\n   ↓\n1 finishes\n   ↓\n1 new request starts\n   ↓\nRepeat until everything is done\n```\n\nThis is called <b>bounded concurrency</b> (a fixed limit on how many tasks can run together).\n\n---\n\n## 3. How does `Promise.race()` help?\n\nWe can keep track of the requests currently running.\n\nFor example:\n\n```javascript\nconst executing = new Set();\n```\n\nWhen we start a request, we add its promise to the set.\n\nIf we reach our limit:\n\n```javascript\nawait Promise.race(executing);\n```\n\n`Promise.race()` waits until <b>any one</b> of the running requests finishes.\n\nThen we can start another request.\n\nSo:\n\n```text\nLimit = 3\n\nRequest A ───────────✓\nRequest B ───────✓\nRequest C ───────────────✓\n             ↑\n       wait for one\n             ↓\n        Start Request D\n```\n\nThe important idea is:\n\n> <b>Don't start a new task until there is room.</b>\n\n---\n\n## 4. Duplicate Requests\n\nNow imagine five components on a page all need the same user:\n\n```javascript\nfetchUser(1)\n```\n\nWithout any protection:\n\n```text\nComponent 1 → fetchUser(1)\nComponent 2 → fetchUser(1)\nComponent 3 → fetchUser(1)\nComponent 4 → fetchUser(1)\nComponent 5 → fetchUser(1)\n```\n\nThat's <b>5 identical network requests</b>.\n\nBut we only need one.\n\n---\n\n## 5. Request Deduplication\n\n<b>Deduplication</b> (removing duplicates) means:\n\n> If the same request is already running, reuse it instead of starting another one.\n\nWe can store running requests in a `Map`.\n\n```javascript\nconst inFlight = new Map();\n```\n\n<b>In-flight</b> means a request that has started but hasn't finished yet.\n\nThe idea is:\n\n```text\nRequest for user 1\n       ↓\nIs it already running?\n   ↙           ↘\n Yes            No\n ↓               ↓\nReturn same    Start request\n Promise           ↓\n                Store it\n```\n\nSo if five components ask for the same user:\n\n```text\nComponent 1 ─┐\nComponent 2 ─┤\nComponent 3 ─┼──→ One network request\nComponent 4 ─┤\nComponent 5 ─┘\n```\n\nAll five callers get the <b>same Promise</b>.\n\nAfter the request finishes, we remove it from the `Map`.\n\n```javascript\npromise.finally(() => {\n  inFlight.delete(key);\n});\n```\n\n`finally()` means <b>run this code whether the request succeeds or fails</b>.\n\n---\n\n## 6. Memoization\n\nMemoization is similar, but it solves a slightly different problem.\n\n<b>Memoization</b> means:\n\n> Save a previous result and reuse it later.\n\nFor example:\n\n```text\nFirst call\n↓\nFetch user\n↓\nSave result\n\nLater call\n↓\nReturn saved result\n```\n\nThis means we don't need to make another network request.\n\n---\n\n## 7. Memoization with Expiration\n\nWe usually don't want to keep data forever.\n\nFor example, user data might be cached for <b>60 seconds</b>.\n\nThis is called a <b>TTL</b> (Time To Live), which simply means:\n\n> How long the cached data should be used.\n\nWe can store:\n\n```javascript\n{\n  value: user,\n  expiresAt: Date.now() + 60000\n}\n```\n\nThen:\n\n```text\nRequest\n   ↓\nIs cached data available?\n   ↓\nIs it still valid?\n ↙             ↘\nYes             No\n ↓               ↓\nReturn cache   Fetch again\n                 ↓\n              Save result\n```\n\nAfter 60 seconds, the cache expires and we fetch fresh data.\n\n---\n\n## 8. Deduplication vs Memoization\n\nThese two concepts are easy to confuse.\n\n### Request Deduplication\n\nDeals with requests happening <b>at the same time</b>.\n\n```text\nRequest A ────────┐\nRequest B ────────┼──→ One network request\nRequest C ────────┘\n```\n\nIt only cares about requests that are currently running.\n\n### Memoization\n\nDeals with requests happening <b>later</b>.\n\n```text\n10:00 → Fetch data → Save result\n10:01 → Use saved result\n10:02 → Use saved result\n```\n\nThe result is reused until it expires.\n\n---\n\n## 9. They Can Work Together\n\nIn real applications, you can use both.\n\nSo:\n\n<b>Deduplication</b> prevents duplicate requests happening at the same time.\n\n<b>Memoization</b> prevents unnecessary requests happening later.",
        np: "धेरै request सँग काम गर्दा, दुई सामान्य समस्या आउन सक्छन्:\n\n1. <b>एकैचोटि धेरै request</b>\n2. <b>उही request धेरै पटक बनाइनु</b>\n\nदुई उपयोगी समाधान हुन्: <b>concurrency limiting</b> र <b>request deduplication/memoization</b>।\n\n---\n\n## 1. `Promise.all()` को समस्या\n\nतपाईं यसो लेख्न सक्नुहुन्छ:\n\n```javascript\nconst results = await Promise.all(\n  urls.map(url => fetch(url))\n);\n```\n\nयो सजिलो देखिन्छ।\n\nतर कल्पना गर्नुहोस् तपाईंसँग <b>1,000 URLs</b> छन्।\n\n```text\n1,000 URLs\n    ↓\n1,000 requests at once 😨\n```\n\nयसले सक्छ:\n\n• तपाईंको server लाई overload गर्न\n• API को rate limit नाघ्न\n• धेरै connection प्रयोग गर्न\n• तपाईंको application लाई ढिलो बनाउन\n\nबरु, हामी एकै समयमा कति request चल्ने हो त्यो सीमित गर्न सक्छौं।\n\n---\n\n## 2. Concurrency Limiting\n\n<b>Concurrency</b> को अर्थ एकै समयमा कति task चलिरहेका छन् भन्ने हो।\n\nउदाहरणका लागि, हाम्रो limit `5` छ भने:\n\n```text\n5 requests running\n↓\nOne finishes\n↓\nStart another request\n↓\nOne finishes\n↓\nStart another request\n```\n\nत्यसैले हामीसँग कहिल्यै <b>एकैचोटि 5 भन्दा धेरै request</b> हुँदैनन्।\n\n### सरल विचार\n\n```text\n100 URLs\n   ↓\nLimit = 5\n   ↓\n5 requests start\n   ↓\n1 finishes\n   ↓\n1 new request starts\n   ↓\nRepeat until everything is done\n```\n\nयसलाई <b>bounded concurrency</b> भनिन्छ (एकसाथ कति task चल्न सक्छन् भन्ने निश्चित limit)।\n\n---\n\n## 3. `Promise.race()` ले कसरी मद्दत गर्छ?\n\nहामी अहिले चलिरहेका request को हिसाब राख्न सक्छौं।\n\nउदाहरणका लागि:\n\n```javascript\nconst executing = new Set();\n```\n\nRequest सुरु गर्दा, हामी त्यसको promise set मा थप्छौं।\n\nLimit पुगेपछि:\n\n```javascript\nawait Promise.race(executing);\n```\n\n`Promise.race()` ले चलिरहेका request मध्ये <b>कुनै एक</b> सक्किने बेलासम्म कुर्छ।\n\nत्यसपछि हामी अर्को request सुरु गर्न सक्छौं।\n\nत्यसैले:\n\n```text\nLimit = 3\n\nRequest A ───────────✓\nRequest B ───────✓\nRequest C ───────────────✓\n             ↑\n       wait for one\n             ↓\n        Start Request D\n```\n\nमहत्वपूर्ण विचार यो हो:\n\n> <b>ठाउँ नहुँदासम्म नयाँ task सुरु नगर्नु।</b>\n\n---\n\n## 4. Duplicate Requests\n\nअब कल्पना गर्नुहोस् page मा पाँच component लाई उही user चाहिन्छ:\n\n```javascript\nfetchUser(1)\n```\n\nकुनै सुरक्षा बिना:\n\n```text\nComponent 1 → fetchUser(1)\nComponent 2 → fetchUser(1)\nComponent 3 → fetchUser(1)\nComponent 4 → fetchUser(1)\nComponent 5 → fetchUser(1)\n```\n\nत्यो <b>5 उस्तै network request</b> हो।\n\nतर हामीलाई एउटा मात्र चाहिन्छ।\n\n---\n\n## 5. Request Deduplication\n\n<b>Deduplication</b> (duplicate हटाउनु) को अर्थ:\n\n> उही request पहिले नै चलिरहेको छ भने, अर्को सुरु गर्नुको साटो त्यसै लाई पुनः प्रयोग गर्नु।\n\nहामी चलिरहेका request लाई `Map` मा राख्न सक्छौं।\n\n```javascript\nconst inFlight = new Map();\n```\n\n<b>In-flight</b> को अर्थ सुरु भइसकेको तर अझै सकिएको छैन भन्ने request हो।\n\nविचार यो हो:\n\n```text\nRequest for user 1\n       ↓\nIs it already running?\n   ↙           ↘\n Yes            No\n ↓               ↓\nReturn same    Start request\n Promise           ↓\n                Store it\n```\n\nत्यसैले पाँच component ले उही user मागे भने:\n\n```text\nComponent 1 ─┐\nComponent 2 ─┤\nComponent 3 ─┼──→ One network request\nComponent 4 ─┤\nComponent 5 ─┘\n```\n\nपाँचै caller ले <b>उही Promise</b> पाउँछन्।\n\nRequest सकिएपछि, हामी त्यसलाई `Map` बाट हटाउँछौं।\n\n```javascript\npromise.finally(() => {\n  inFlight.delete(key);\n});\n```\n\n`finally()` को अर्थ <b>request सफल होस् वा fail, यो code चलाउनु</b> भन्ने हो।\n\n---\n\n## 6. Memoization\n\nMemoization मिल्दो छ, तर यो अलिकति फरक समस्या समाधान गर्छ।\n\n<b>Memoization</b> को अर्थ:\n\n> अघिल्लो result सेभ गर्नु र पछि पुनः प्रयोग गर्नु।\n\nउदाहरणका लागि:\n\n```text\nFirst call\n↓\nFetch user\n↓\nSave result\n\nLater call\n↓\nReturn saved result\n```\n\nयसको अर्थ हामीले अर्को network request गर्नु पर्दैन।\n\n---\n\n## 7. Expiration सहितको Memoization\n\nहामी सामान्यतया data सधैंभरि राख्न चाहँदैनौं।\n\nउदाहरणका लागि, user data <b>60 seconds</b> सम्म cache हुन सक्छ।\n\nयसलाई <b>TTL</b> (Time To Live) भनिन्छ, जसको सरल अर्थ:\n\n> Cache गरिएको data कति बेरसम्म प्रयोग गर्ने।\n\nहामी यो राख्न सक्छौं:\n\n```javascript\n{\n  value: user,\n  expiresAt: Date.now() + 60000\n}\n```\n\nत्यसपछि:\n\n```text\nRequest\n   ↓\nIs cached data available?\n   ↓\nIs it still valid?\n ↙             ↘\nYes             No\n ↓               ↓\nReturn cache   Fetch again\n                 ↓\n              Save result\n```\n\n60 seconds पछि, cache expire हुन्छ र हामी ताजा data fetch गर्छौं।\n\n---\n\n## 8. Deduplication vs Memoization\n\nयी दुई concept सजिलै भ्रममा पार्छन्।\n\n### Request Deduplication\n\n<b>एकै समयमा</b> हुने request सँग सम्बन्धित छ।\n\n```text\nRequest A ────────┐\nRequest B ────────┼──→ One network request\nRequest C ────────┘\n```\n\nयसलाई अहिले चलिरहेका request सँग मात्र मतलब छ।\n\n### Memoization\n\n<b>पछि</b> हुने request सँग सम्बन्धित छ।\n\n```text\n10:00 → Fetch data → Save result\n10:01 → Use saved result\n10:02 → Use saved result\n```\n\nResult expire नहुँदासम्म पुनः प्रयोग हुन्छ।\n\n---\n\n## 9. यी सँगै काम गर्न सक्छन्\n\nवास्तविक application मा, तपाईं दुबै प्रयोग गर्न सक्नुहुन्छ।\n\nत्यसैले:\n\n<b>Deduplication</b> ले एकै समयमा हुने duplicate request रोक्छ।\n\n<b>Memoization</b> ले पछि हुने अनावश्यक request रोक्छ।",
        jp: "多くのリクエストを扱うとき、よくある問題が2つ起こります:\n\n1. <b>一度にリクエストが多すぎる</b>\n2. <b>同じリクエストが何度も行われる</b>\n\n役に立つ解決策が2つあります: <b>並行数の制限</b>と<b>リクエストの重複排除／メモ化</b>です。\n\n---\n\n## 1. `Promise.all()` の問題\n\nこう書くかもしれません:\n\n```javascript\nconst results = await Promise.all(\n  urls.map(url => fetch(url))\n);\n```\n\nシンプルに見えます。\n\nしかし<b>1,000個のURL</b>があると想像してください。\n\n```text\n1,000 URLs\n    ↓\n1,000 requests at once 😨\n```\n\nこれは次のようなことを招きます:\n\n• サーバーに過負荷をかける\n• APIのレート制限に達する\n• 接続を使いすぎる\n• アプリケーションを遅くする\n\n代わりに、同時に走るリクエスト数を制限できます。\n\n---\n\n## 2. 並行数の制限\n\n<b>並行数（Concurrency）</b>とは、同時に走っているタスクの数のことです。\n\nたとえば制限が `5` の場合:\n\n```text\n5 requests running\n↓\nOne finishes\n↓\nStart another request\n↓\nOne finishes\n↓\nStart another request\n```\n\nつまり<b>同時に5件を超えるリクエスト</b>は決して走りません。\n\n### シンプルな考え方\n\n```text\n100 URLs\n   ↓\nLimit = 5\n   ↓\n5 requests start\n   ↓\n1 finishes\n   ↓\n1 new request starts\n   ↓\nRepeat until everything is done\n```\n\nこれを<b>境界付き並行性（bounded concurrency）</b>と呼びます（同時に走れるタスク数の固定の上限）。\n\n---\n\n## 3. `Promise.race()` はどう役立つのか?\n\nいま走っているリクエストを記録しておけます。\n\nたとえば:\n\n```javascript\nconst executing = new Set();\n```\n\nリクエストを開始したら、そのPromiseをセットに追加します。\n\n制限に達したら:\n\n```javascript\nawait Promise.race(executing);\n```\n\n`Promise.race()` は走っているリクエストの<b>どれか1つ</b>が終わるまで待ちます。\n\nそうすれば次のリクエストを開始できます。\n\nつまり:\n\n```text\nLimit = 3\n\nRequest A ───────────✓\nRequest B ───────✓\nRequest C ───────────────✓\n             ↑\n       wait for one\n             ↓\n        Start Request D\n```\n\n大事な考え方はこうです:\n\n> <b>空きができるまで新しいタスクを始めない。</b>\n\n---\n\n## 4. 重複したリクエスト\n\nページ上の5つのコンポーネントが同じユーザーを必要としていると想像してください:\n\n```javascript\nfetchUser(1)\n```\n\n何の対策もないと:\n\n```text\nComponent 1 → fetchUser(1)\nComponent 2 → fetchUser(1)\nComponent 3 → fetchUser(1)\nComponent 4 → fetchUser(1)\nComponent 5 → fetchUser(1)\n```\n\nこれは<b>まったく同じネットワークリクエストが5件</b>です。\n\nしかし必要なのは1件だけです。\n\n---\n\n## 5. リクエストの重複排除\n\n<b>重複排除（Deduplication）</b>とは:\n\n> 同じリクエストがすでに走っているなら、もう1つ始めずにそれを再利用する。\n\n走っているリクエストは `Map` に保存できます。\n\n```javascript\nconst inFlight = new Map();\n```\n\n<b>In-flight</b>とは、開始したがまだ終わっていないリクエストのことです。\n\n考え方はこうです:\n\n```text\nRequest for user 1\n       ↓\nIs it already running?\n   ↙           ↘\n Yes            No\n ↓               ↓\nReturn same    Start request\n Promise           ↓\n                Store it\n```\n\n5つのコンポーネントが同じユーザーを求めた場合:\n\n```text\nComponent 1 ─┐\nComponent 2 ─┤\nComponent 3 ─┼──→ One network request\nComponent 4 ─┤\nComponent 5 ─┘\n```\n\n5つの呼び出し元すべてが<b>同じPromise</b>を受け取ります。\n\nリクエストが終わったら、`Map` から削除します。\n\n```javascript\npromise.finally(() => {\n  inFlight.delete(key);\n});\n```\n\n`finally()` は<b>リクエストが成功しても失敗してもこのコードを実行する</b>という意味です。\n\n---\n\n## 6. メモ化\n\nメモ化は似ていますが、少し違う問題を解決します。\n\n<b>メモ化（Memoization）</b>とは:\n\n> 前回の結果を保存して、後で再利用する。\n\nたとえば:\n\n```text\nFirst call\n↓\nFetch user\n↓\nSave result\n\nLater call\n↓\nReturn saved result\n```\n\nつまり、もう一度ネットワークリクエストをする必要がなくなります。\n\n---\n\n## 7. 有効期限付きのメモ化\n\n通常、データを永遠に保持したいわけではありません。\n\nたとえば、ユーザーデータは<b>60秒</b>だけキャッシュするかもしれません。\n\nこれを<b>TTL</b>（Time To Live）と呼び、単純に次を意味します:\n\n> キャッシュしたデータをどれくらいの間使うか。\n\nこう保存できます:\n\n```javascript\n{\n  value: user,\n  expiresAt: Date.now() + 60000\n}\n```\n\nそして:\n\n```text\nRequest\n   ↓\nIs cached data available?\n   ↓\nIs it still valid?\n ↙             ↘\nYes             No\n ↓               ↓\nReturn cache   Fetch again\n                 ↓\n              Save result\n```\n\n60秒後にキャッシュは期限切れになり、新しいデータを取得します。\n\n---\n\n## 8. 重複排除とメモ化の違い\n\nこの2つの概念は混同しやすいです。\n\n### リクエストの重複排除\n\n<b>同時に</b>起きるリクエストを扱います。\n\n```text\nRequest A ────────┐\nRequest B ────────┼──→ One network request\nRequest C ────────┘\n```\n\nいま走っているリクエストのことだけを気にします。\n\n### メモ化\n\n<b>後で</b>起きるリクエストを扱います。\n\n```text\n10:00 → Fetch data → Save result\n10:01 → Use saved result\n10:02 → Use saved result\n```\n\n結果は期限が切れるまで再利用されます。\n\n---\n\n## 9. 組み合わせて使える\n\n実際のアプリケーションでは、両方使えます。\n\nつまり:\n\n<b>重複排除</b>は同時に起きる重複リクエストを防ぎます。\n\n<b>メモ化</b>は後で起きる不要なリクエストを防ぎます。",
      },
      diagram: `                 Request
                    ↓
             Is result cached?
              ↙          ↘
            Yes           No
             ↓             ↓
       Return result   Is request running?
                         ↙        ↘
                       Yes         No
                        ↓           ↓
                 Return same     Start fetch
                   Promise          ↓
                                Save result
                                   ↓
                              Return result`,
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
        { en: "<b>Concurrency limiting</b> → \"Don't run too many tasks at once.\" `Promise.all()` over 1,000 URLs fires 1,000 requests at once; a limit keeps only a few running and starts a new one each time another finishes.", np: "<b>Concurrency limiting</b> → \"एकैचोटि धेरै task नचलाउ।\" 1,000 URLs माथि `Promise.all()` ले एकैचोटि 1,000 request पठाउँछ; limit ले केही मात्र चलाइराख्छ र एउटा सक्किएपछि नयाँ सुरु गर्छ।", jp: "<b>並行数の制限</b> → \"一度に多くのタスクを走らせない。\" 1,000件のURLに `Promise.all()` を使うと1,000件のリクエストが同時に飛ぶ。制限をかければ数件だけが走り、1件終わるごとに次を始める。" },
        { en: "<b>`Promise.race()` on the running set</b> — keep in-flight promises in a `Set` and `await Promise.race(executing)` when you hit the limit. Don't start a new task until there is room.", np: "<b>चलिरहेको set माथि `Promise.race()`</b> — in-flight promise लाई `Set` मा राख्नुहोस् र limit पुग्दा `await Promise.race(executing)` गर्नुहोस्। ठाउँ नहुँदासम्म नयाँ task सुरु नगर्नुहोस्।", jp: "<b>実行中のセットに対する `Promise.race()`</b> — 実行中のPromiseを `Set` に保持し、上限に達したら `await Promise.race(executing)` する。空きができるまで新しいタスクを始めない。" },
        { en: "<b>Request deduplication</b> → \"Don't make the same request twice at the same time.\" Store in-flight promises in a `Map` so five callers share one network request, and delete the entry in `finally()`.", np: "<b>Request deduplication</b> → \"उही request एकै समयमा दुई पटक नगर।\" In-flight promise लाई `Map` मा राख्नुहोस् ताकि पाँच caller ले एउटै network request बाँडिन्, र `finally()` मा entry हटाउनुहोस्।", jp: "<b>リクエストの重複排除</b> → \"同じリクエストを同時に2回行わない。\" 実行中のPromiseを `Map` に保存して5人の呼び出し元が1回のネットワークリクエストを共有し、`finally()` でエントリを削除する。" },
        { en: "<b>Memoization</b> → \"Reuse a result we already have.\" Save the result and return it on later calls instead of fetching again.", np: "<b>Memoization</b> → \"हामीसँग पहिले नै भएको result पुनः प्रयोग गर।\" Result सेभ गर्नुहोस् र फेरि fetch गर्नुको साटो पछिका call मा त्यही फर्काउनुहोस्।", jp: "<b>メモ化</b> → \"すでにある結果を再利用する。\" 結果を保存し、再取得せずに後の呼び出しで返す。" },
        { en: "<b>TTL</b> → \"How long should we keep using the cached result?\" Store `{ value, expiresAt }` so the cache expires (say after 60 seconds) and fresh data is fetched again.", np: "<b>TTL</b> → \"Cache गरिएको result कति बेरसम्म प्रयोग गर्ने?\" `{ value, expiresAt }` राख्नुहोस् ताकि cache expire होस् (जस्तै 60 seconds पछि) र ताजा data फेरि fetch होस्।", jp: "<b>TTL</b> → \"キャッシュした結果をどれくらい使い続けるか?\" `{ value, expiresAt }` を保存し、（たとえば60秒後に）キャッシュが期限切れになって新しいデータを取り直すようにする。" },
        { en: "Deduplication is about requests happening <b>at the same time</b>; memoization is about requests happening <b>later</b>. Real applications use both together.", np: "Deduplication <b>एकै समयमा</b> हुने request बारे हो; memoization <b>पछि</b> हुने request बारे हो। वास्तविक application मा दुबै सँगै प्रयोग हुन्छन्।", jp: "重複排除は<b>同時に</b>起きるリクエストの話、メモ化は<b>後で</b>起きるリクエストの話。実際のアプリケーションでは両方を組み合わせて使う。" },
        { en: "The main goal is simple: use fewer requests, avoid unnecessary work, and prevent your application from being overwhelmed.", np: "मुख्य लक्ष्य सरल छ: कम request प्रयोग गर्नु, अनावश्यक काम बचाउनु, र तपाईंको application लाई overwhelm हुनबाट रोक्नु।", jp: "主な目標はシンプルだ: リクエストを減らし、不要な処理を避け、アプリケーションが過負荷にならないようにする。" },
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
