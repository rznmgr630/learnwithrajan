import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_21_LESSONS: JsLessonDay = {
  day: 21,
  title: { en: "Modern web APIs — Fetch, Storage & AbortController", np: "Modern Web APIs — Fetch, Storage", jp: "Fetch・Storage・AbortController" },
  totalMinutes: 27,
  difficulty: { en: "Intermediate", np: "Intermediate", jp: "中級" },
  lessons: [
    {
      id: "fetch-api",
      title: { en: "The Fetch API", np: "Fetch API", jp: "Fetch API" },
      durationMinutes: 9,
      explanation: {
        en: "The <b>Fetch API</b> is the modern JavaScript API for making HTTP requests from the browser and other JavaScript environments.\n\n```javascript\nconst response = await fetch(\"https://api.example.com/users\");\n```\n\nThe important thing to understand is that `fetch()` does <b>not</b> immediately give you the response data. It returns a <b>Promise</b>:\n\n```text\nfetch(url)\n   │\n   ▼\nPromise\n   │\n   │ server responds\n   ▼\nResponse object\n   │\n   ▼\nresponse.json()\n   │\n   ▼\nPromise\n   │\n   ▼\nJavaScript data\n```\n\nThis is why `fetch()` works naturally with `async`/`await`.\n\n---\n\n### 1. Basic — a GET request\n\n```javascript\nconst response = await fetch(\n  \"https://api.example.com/users\"\n);\n\nconst users = await response.json();\n\nconsole.log(users);\n```\n\nThere are actually <b>two asynchronous operations</b> here. `await fetch(url)` waits for the HTTP response, and `await response.json()` reads and parses the response body.\n\n---\n\n### 2. Intermediate — always check `response.ok`\n\nOne of the biggest `fetch()` mistakes is assuming that a `404` or `500` automatically causes `fetch()` to reject. It does not.\n\n```javascript\nconst response = await fetch(\n  \"https://api.example.com/users/999\"\n);\n\nconsole.log(response.ok);     // false\nconsole.log(response.status); // 404\n```\n\n```text\n404 Not Found\n\nfetch()\n   │\n   ▼\nPromise resolves\n   │\n   ▼\nResponse\n   │\n   ├── ok: false\n   └── status: 404\n```\n\nSo handle HTTP errors yourself:\n\n```javascript\nasync function getUser(id) {\n  const response = await fetch(\n    `https://api.example.com/users/${id}`\n  );\n\n  if (!response.ok) {\n    throw new Error(\n      `Request failed: ${response.status}`\n    );\n  }\n\n  return response.json();\n}\n```\n\n```javascript\ntry {\n  const user = await getUser(10);\n  console.log(user);\n} catch (error) {\n  console.error(error);\n}\n```\n\n<b>The distinction that matters:</b>\n\n```text\nNetwork-level failure\n       │\n       ▼\nfetch rejects\n\n\nHTTP error: 404 / 500\n       │\n       ▼\nfetch resolves\n       │\n       ▼\nresponse.ok === false\n```\n\nA dropped connection or DNS failure rejects the promise. A server that answers with an error status still counts as a completed HTTP transaction.\n\n---\n\n### 3. Advanced — POST JSON data\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n\nconst response = await fetch(\n  \"https://api.example.com/users\",\n  {\n    method: \"POST\",\n\n    headers: {\n      \"Content-Type\": \"application/json\"\n    },\n\n    body: JSON.stringify(user)\n  }\n);\n\nif (!response.ok) {\n  throw new Error(`HTTP ${response.status}`);\n}\n\nconst createdUser = await response.json();\n```\n\nNotice `body: JSON.stringify(user)`. `fetch()` does <b>not</b> automatically turn a JavaScript object into JSON — you serialize it explicitly:\n\n```text\nJavaScript object\n      │\n      │ JSON.stringify()\n      ▼\nJSON string\n      │\n      │ HTTP request\n      ▼\nServer\n```\n\nAnd the server's JSON response travels the opposite direction:\n\n```text\nJSON response\n      │\n      │ response.json()\n      ▼\nJavaScript object\n```\n\n---\n\n### Reading the response body\n\nA `Response` offers several ways to consume its body:\n\n```javascript\nconst data = await response.json();       // parsed JavaScript data\nconst text = await response.text();       // plain text, HTML, XML\nconst blob = await response.blob();       // binary data such as images\nconst buffer = await response.arrayBuffer(); // raw bytes\n```\n\nA blob is handy for files and images:\n\n```javascript\nconst imageResponse = await fetch(\"/image.png\");\nconst imageBlob = await imageResponse.blob();\n\nconst imageUrl = URL.createObjectURL(imageBlob);\n\ndocument.querySelector(\"img\").src = imageUrl;\n```\n\n---\n\n### The body can only be consumed once\n\n```javascript\nconst response = await fetch(url);\n\nconst data = await response.json();\nconst again = await response.json(); // error\n```\n\nThe body is a <b>stream</b> that has already been consumed:\n\n```text\nResponse body\n     │\n     ▼\n response.json()\n     │\n     ▼\n   consumed\n     │\n     ▼\n cannot consume again\n```\n\nIf you genuinely need two independent reads, clone the response first:\n\n```javascript\nconst response = await fetch(url);\n\nconst copy = response.clone();\n\nconst data = await response.json();\nconst raw = await copy.text();\n```\n\n---\n\n### Request configuration\n\n`fetch()` accepts a second argument with request options:\n\n```javascript\nfetch(url, {\n  method: \"POST\",\n\n  headers: {\n    \"Content-Type\": \"application/json\",\n    \"Authorization\": \"Bearer token\"\n  },\n\n  body: JSON.stringify({ name: \"Rajan\" })\n});\n```\n\n```text\nmethod       GET, POST, PUT, PATCH, DELETE...\nheaders      HTTP headers\nbody         data sent to the server\ncredentials  cookie handling\nmode         CORS behaviour\ncache        browser HTTP cache behaviour\n```\n\n<b>`credentials`</b> controls cookies:\n\n```javascript\nfetch(\"/api/profile\", { credentials: \"include\" });\n```\n\nThe common values are `\"omit\"`, `\"same-origin\"` and `\"include\"`. Including credentials is still subject to the browser's security rules and the server's CORS configuration.\n\n<b>`headers`</b> carry metadata about the request:\n\n```javascript\nconst response = await fetch(\"/api/users\", {\n  headers: {\n    \"Authorization\": \"Bearer abc123\",\n    \"Accept\": \"application/json\"\n  }\n});\n```\n\n---\n\n### GET vs POST\n\n```text\nGET\n────\nClient ───────────────► Server\n       \"Give me users\"\n\n\nPOST\n─────\nClient ───────────────► Server\n       \"Create this user\"\n       { name: \"Rajan\" }\n```\n\n---\n\n### Production error handling\n\nA production-ready request distinguishes <b>network errors</b> from <b>HTTP errors</b>:\n\n```javascript\nasync function fetchUsers() {\n  try {\n    const response = await fetch(\"/api/users\");\n\n    if (!response.ok) {\n      throw new Error(\n        `HTTP error: ${response.status}`\n      );\n    }\n\n    return await response.json();\n  } catch (error) {\n    console.error(\"Request failed:\", error);\n    throw error;\n  }\n}\n```\n\nThe `try/catch` handles a rejected `fetch()` as well as the error you explicitly throw for a non-2xx response.\n\n---\n\n### The five rules\n\n1. `fetch()` returns a Promise.\n2. `fetch()` does not reject just because the server returns 404 or 500.\n3. Always check `response.ok` or `response.status`.\n4. Reading the response body is another asynchronous operation.\n5. A response body can normally be consumed only once.\n\n> <b>`fetch()` handles the HTTP transaction; `Response` gives you the result; body methods such as `json()` actually consume and decode the data.</b>",
        np: "<b>Fetch API</b> browser र अन्य JavaScript वातावरणबाट HTTP request गर्ने आधुनिक JavaScript API हो।\n\n```javascript\nconst response = await fetch(\"https://api.example.com/users\");\n```\n\nबुझ्नुपर्ने मुख्य कुरा — `fetch()` ले तुरुन्तै response को data दिँदैन। यसले <b>Promise</b> फर्काउँछ:\n\n```text\nfetch(url)\n   │\n   ▼\nPromise\n   │\n   │ server responds\n   ▼\nResponse object\n   │\n   ▼\nresponse.json()\n   │\n   ▼\nPromise\n   │\n   ▼\nJavaScript data\n```\n\nत्यसैले `fetch()` `async`/`await` सँग स्वाभाविक रूपमा मिल्छ।\n\n---\n\n### 1. आधारभूत — GET request\n\n```javascript\nconst response = await fetch(\n  \"https://api.example.com/users\"\n);\n\nconst users = await response.json();\n\nconsole.log(users);\n```\n\nयहाँ वास्तवमा <b>दुई asynchronous operation</b> छन्। `await fetch(url)` ले HTTP response कुर्छ, र `await response.json()` ले response body पढेर parse गर्छ।\n\n---\n\n### 2. मध्यम — सधैं `response.ok` जाँच्नुहोस्\n\n`fetch()` को सबैभन्दा ठूलो भ्रम — `404` वा `500` आउँदा `fetch()` आफैं reject हुन्छ भन्ने ठान्नु। हुँदैन।\n\n```javascript\nconst response = await fetch(\n  \"https://api.example.com/users/999\"\n);\n\nconsole.log(response.ok);     // false\nconsole.log(response.status); // 404\n```\n\n```text\n404 Not Found\n\nfetch()\n   │\n   ▼\nPromise resolves\n   │\n   ▼\nResponse\n   │\n   ├── ok: false\n   └── status: 404\n```\n\nत्यसैले HTTP error आफैं सम्हाल्नुहोस्:\n\n```javascript\nasync function getUser(id) {\n  const response = await fetch(\n    `https://api.example.com/users/${id}`\n  );\n\n  if (!response.ok) {\n    throw new Error(\n      `Request failed: ${response.status}`\n    );\n  }\n\n  return response.json();\n}\n```\n\n```javascript\ntry {\n  const user = await getUser(10);\n  console.log(user);\n} catch (error) {\n  console.error(error);\n}\n```\n\n<b>महत्वपूर्ण भिन्नता:</b>\n\n```text\nNetwork-level failure\n       │\n       ▼\nfetch rejects\n\n\nHTTP error: 404 / 500\n       │\n       ▼\nfetch resolves\n       │\n       ▼\nresponse.ok === false\n```\n\nConnection टुट्नु वा DNS असफल हुनुले promise reject गर्छ। Error status दिने server ले भने HTTP transaction पूरा गरेकै मानिन्छ।\n\n---\n\n### 3. उन्नत — JSON data POST गर्नु\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n\nconst response = await fetch(\n  \"https://api.example.com/users\",\n  {\n    method: \"POST\",\n\n    headers: {\n      \"Content-Type\": \"application/json\"\n    },\n\n    body: JSON.stringify(user)\n  }\n);\n\nif (!response.ok) {\n  throw new Error(`HTTP ${response.status}`);\n}\n\nconst createdUser = await response.json();\n```\n\n`body: JSON.stringify(user)` मा ध्यान दिनुहोस्। `fetch()` ले JavaScript object लाई स्वतः JSON बनाउँदैन — तपाईंले स्पष्ट रूपमा serialize गर्नुपर्छ:\n\n```text\nJavaScript object\n      │\n      │ JSON.stringify()\n      ▼\nJSON string\n      │\n      │ HTTP request\n      ▼\nServer\n```\n\nServer को JSON response उल्टो दिशामा आउँछ:\n\n```text\nJSON response\n      │\n      │ response.json()\n      ▼\nJavaScript object\n```\n\n---\n\n### Response body पढ्नु\n\n`Response` ले body खपत गर्ने धेरै तरिका दिन्छ:\n\n```javascript\nconst data = await response.json();       // parse भएको JavaScript data\nconst text = await response.text();       // सादा text, HTML, XML\nconst blob = await response.blob();       // image जस्तो binary data\nconst buffer = await response.arrayBuffer(); // कच्चा byte\n```\n\nFile र image का लागि blob उपयोगी छ:\n\n```javascript\nconst imageResponse = await fetch(\"/image.png\");\nconst imageBlob = await imageResponse.blob();\n\nconst imageUrl = URL.createObjectURL(imageBlob);\n\ndocument.querySelector(\"img\").src = imageUrl;\n```\n\n---\n\n### Body एक पटक मात्र खपत हुन्छ\n\n```javascript\nconst response = await fetch(url);\n\nconst data = await response.json();\nconst again = await response.json(); // error\n```\n\nBody एउटा <b>stream</b> हो जुन पहिले नै खपत भइसक्यो:\n\n```text\nResponse body\n     │\n     ▼\n response.json()\n     │\n     ▼\n   consumed\n     │\n     ▼\n cannot consume again\n```\n\nसाँच्चै दुई पटक पढ्नुपर्ने भए, पहिले response clone गर्नुहोस्:\n\n```javascript\nconst response = await fetch(url);\n\nconst copy = response.clone();\n\nconst data = await response.json();\nconst raw = await copy.text();\n```\n\n---\n\n### Request configuration\n\n`fetch()` ले request option भएको दोस्रो argument लिन्छ:\n\n```javascript\nfetch(url, {\n  method: \"POST\",\n\n  headers: {\n    \"Content-Type\": \"application/json\",\n    \"Authorization\": \"Bearer token\"\n  },\n\n  body: JSON.stringify({ name: \"Rajan\" })\n});\n```\n\n```text\nmethod       GET, POST, PUT, PATCH, DELETE...\nheaders      HTTP header\nbody         server लाई पठाइने data\ncredentials  cookie व्यवस्थापन\nmode         CORS व्यवहार\ncache        browser HTTP cache व्यवहार\n```\n\n<b>`credentials`</b> ले cookie नियन्त्रण गर्छ:\n\n```javascript\nfetch(\"/api/profile\", { credentials: \"include\" });\n```\n\nसामान्य मान `\"omit\"`, `\"same-origin\"` र `\"include\"` हुन्। Credential पठाउँदा पनि browser को सुरक्षा नियम र server को CORS विन्यास लागू हुन्छ।\n\n<b>`headers`</b> ले request बारे metadata बोक्छ:\n\n```javascript\nconst response = await fetch(\"/api/users\", {\n  headers: {\n    \"Authorization\": \"Bearer abc123\",\n    \"Accept\": \"application/json\"\n  }\n});\n```\n\n---\n\n### GET vs POST\n\n```text\nGET\n────\nClient ───────────────► Server\n       \"Give me users\"\n\n\nPOST\n─────\nClient ───────────────► Server\n       \"Create this user\"\n       { name: \"Rajan\" }\n```\n\n---\n\n### Production मा error handling\n\nProduction-योग्य request ले <b>network error</b> र <b>HTTP error</b> छुट्याउँछ:\n\n```javascript\nasync function fetchUsers() {\n  try {\n    const response = await fetch(\"/api/users\");\n\n    if (!response.ok) {\n      throw new Error(\n        `HTTP error: ${response.status}`\n      );\n    }\n\n    return await response.json();\n  } catch (error) {\n    console.error(\"Request failed:\", error);\n    throw error;\n  }\n}\n```\n\n`try/catch` ले reject भएको `fetch()` र non-2xx का लागि तपाईंले throw गरेको error दुबै सम्हाल्छ।\n\n---\n\n### पाँच नियम\n\n1. `fetch()` ले Promise फर्काउँछ।\n2. Server ले 404 वा 500 दिँदैमा `fetch()` reject हुँदैन।\n3. सधैं `response.ok` वा `response.status` जाँच्नुहोस्।\n4. Response body पढ्नु अर्को asynchronous operation हो।\n5. Response body सामान्यतया एक पटक मात्र खपत हुन्छ।\n\n> <b>`fetch()` ले HTTP transaction सम्हाल्छ; `Response` ले नतिजा दिन्छ; `json()` जस्ता body method ले वास्तवमा data खपत गरी decode गर्छन्।</b>",
        jp: "<b>Fetch API</b> は、ブラウザなどのJavaScript環境からHTTPリクエストを送るための最新のAPIです。\n\n```javascript\nconst response = await fetch(\"https://api.example.com/users\");\n```\n\n大切なのは、`fetch()` がレスポンスのデータをすぐには返さないことです。返すのは<b>Promise</b>です:\n\n```text\nfetch(url)\n   │\n   ▼\nPromise\n   │\n   │ server responds\n   ▼\nResponse object\n   │\n   ▼\nresponse.json()\n   │\n   ▼\nPromise\n   │\n   ▼\nJavaScript data\n```\n\nだから `fetch()` は `async`/`await` と自然に噛み合います。\n\n---\n\n### 1. 基本 — GETリクエスト\n\n```javascript\nconst response = await fetch(\n  \"https://api.example.com/users\"\n);\n\nconst users = await response.json();\n\nconsole.log(users);\n```\n\nここには実は<b>2つの非同期処理</b>があります。`await fetch(url)` はHTTPレスポンスを待ち、`await response.json()` は本文を読み取って解析します。\n\n---\n\n### 2. 中級 — 必ず `response.ok` を確認する\n\n`fetch()` の最大の誤解は、`404` や `500` なら自動的に拒否されると思うことです。そうはなりません。\n\n```javascript\nconst response = await fetch(\n  \"https://api.example.com/users/999\"\n);\n\nconsole.log(response.ok);     // false\nconsole.log(response.status); // 404\n```\n\n```text\n404 Not Found\n\nfetch()\n   │\n   ▼\nPromise resolves\n   │\n   ▼\nResponse\n   │\n   ├── ok: false\n   └── status: 404\n```\n\nしたがってHTTPエラーは自分で扱います:\n\n```javascript\nasync function getUser(id) {\n  const response = await fetch(\n    `https://api.example.com/users/${id}`\n  );\n\n  if (!response.ok) {\n    throw new Error(\n      `Request failed: ${response.status}`\n    );\n  }\n\n  return response.json();\n}\n```\n\n```javascript\ntry {\n  const user = await getUser(10);\n  console.log(user);\n} catch (error) {\n  console.error(error);\n}\n```\n\n<b>重要な区別:</b>\n\n```text\nNetwork-level failure\n       │\n       ▼\nfetch rejects\n\n\nHTTP error: 404 / 500\n       │\n       ▼\nfetch resolves\n       │\n       ▼\nresponse.ok === false\n```\n\n接続断やDNSの失敗はPromiseを拒否します。エラーステータスを返すサーバーは、HTTPのやり取り自体は完了しています。\n\n---\n\n### 3. 上級 — JSONをPOSTする\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n\nconst response = await fetch(\n  \"https://api.example.com/users\",\n  {\n    method: \"POST\",\n\n    headers: {\n      \"Content-Type\": \"application/json\"\n    },\n\n    body: JSON.stringify(user)\n  }\n);\n\nif (!response.ok) {\n  throw new Error(`HTTP ${response.status}`);\n}\n\nconst createdUser = await response.json();\n```\n\n`body: JSON.stringify(user)` に注目してください。`fetch()` はJavaScriptオブジェクトを自動でJSONにはしません。明示的に直列化します:\n\n```text\nJavaScript object\n      │\n      │ JSON.stringify()\n      ▼\nJSON string\n      │\n      │ HTTP request\n      ▼\nServer\n```\n\nサーバーからのJSONは逆向きに流れます:\n\n```text\nJSON response\n      │\n      │ response.json()\n      ▼\nJavaScript object\n```\n\n---\n\n### レスポンス本文の読み方\n\n`Response` は本文を消費する方法をいくつか提供します:\n\n```javascript\nconst data = await response.json();       // 解析済みのデータ\nconst text = await response.text();       // テキスト・HTML・XML\nconst blob = await response.blob();       // 画像などのバイナリ\nconst buffer = await response.arrayBuffer(); // 生のバイト列\n```\n\nファイルや画像にはblobが便利です:\n\n```javascript\nconst imageResponse = await fetch(\"/image.png\");\nconst imageBlob = await imageResponse.blob();\n\nconst imageUrl = URL.createObjectURL(imageBlob);\n\ndocument.querySelector(\"img\").src = imageUrl;\n```\n\n---\n\n### 本文は一度しか消費できない\n\n```javascript\nconst response = await fetch(url);\n\nconst data = await response.json();\nconst again = await response.json(); // エラー\n```\n\n本文はすでに消費された<b>ストリーム</b>だからです:\n\n```text\nResponse body\n     │\n     ▼\n response.json()\n     │\n     ▼\n   consumed\n     │\n     ▼\n cannot consume again\n```\n\n本当に2回読む必要があるなら、先にレスポンスを複製します:\n\n```javascript\nconst response = await fetch(url);\n\nconst copy = response.clone();\n\nconst data = await response.json();\nconst raw = await copy.text();\n```\n\n---\n\n### リクエストの設定\n\n`fetch()` は第2引数にオプションを受け取ります:\n\n```javascript\nfetch(url, {\n  method: \"POST\",\n\n  headers: {\n    \"Content-Type\": \"application/json\",\n    \"Authorization\": \"Bearer token\"\n  },\n\n  body: JSON.stringify({ name: \"Rajan\" })\n});\n```\n\n```text\nmethod       GET, POST, PUT, PATCH, DELETE...\nheaders      HTTPヘッダー\nbody         サーバーへ送るデータ\ncredentials  クッキーの扱い\nmode         CORSの挙動\ncache        ブラウザHTTPキャッシュの挙動\n```\n\n<b>`credentials`</b> はクッキーを制御します:\n\n```javascript\nfetch(\"/api/profile\", { credentials: \"include\" });\n```\n\nよく使う値は `\"omit\"`・`\"same-origin\"`・`\"include\"` です。資格情報を含める場合も、ブラウザの安全規則とサーバーのCORS設定に従います。\n\n<b>`headers`</b> はリクエストのメタ情報を運びます:\n\n```javascript\nconst response = await fetch(\"/api/users\", {\n  headers: {\n    \"Authorization\": \"Bearer abc123\",\n    \"Accept\": \"application/json\"\n  }\n});\n```\n\n---\n\n### GETとPOST\n\n```text\nGET\n────\nClient ───────────────► Server\n       \"Give me users\"\n\n\nPOST\n─────\nClient ───────────────► Server\n       \"Create this user\"\n       { name: \"Rajan\" }\n```\n\n---\n\n### 本番向けのエラー処理\n\n本番のリクエストは<b>ネットワークエラー</b>と<b>HTTPエラー</b>を区別します:\n\n```javascript\nasync function fetchUsers() {\n  try {\n    const response = await fetch(\"/api/users\");\n\n    if (!response.ok) {\n      throw new Error(\n        `HTTP error: ${response.status}`\n      );\n    }\n\n    return await response.json();\n  } catch (error) {\n    console.error(\"Request failed:\", error);\n    throw error;\n  }\n}\n```\n\n`try/catch` は拒否された `fetch()` も、2xx以外に対して自分でthrowしたエラーも受け止めます。\n\n---\n\n### 5つの規則\n\n1. `fetch()` はPromiseを返す。\n2. サーバーが404や500を返しても `fetch()` は拒否しない。\n3. 必ず `response.ok` か `response.status` を確認する。\n4. 本文の読み取りはもう1つの非同期処理。\n5. レスポンス本文は通常1回しか消費できない。\n\n> <b>`fetch()` はHTTPのやり取りを担い、`Response` は結果を渡し、`json()` などの本文メソッドが実際にデータを消費して復号する。</b>",
      },
      diagram: `Your JavaScript
      │
      │ fetch()
      ▼
HTTP Request
      │
      ├── GET
      ├── POST
      ├── PUT
      └── DELETE
      │
      ▼
     Server
      │
      ▼
HTTP Response
      │
      ▼
Response object
      │
      ├── status
      ├── headers
      ├── ok
      └── body
             │
             ▼
       response.json()
             │
             ▼
        JavaScript data


Two different failures, two different paths

Network-level failure          HTTP error: 404 / 500
       │                              │
       ▼                              ▼
 fetch rejects                  fetch resolves
       │                              │
       ▼                              ▼
   catch block                 response.ok === false


The body is a one-shot stream

Response body
     │
     ▼
 response.json()
     │
     ▼
   consumed
     │
     ▼
 cannot consume again`,
      codeExample: {
        title: { en: "From request to parsed data", np: "Request देखि parse भएको data सम्म", jp: "リクエストから解析済みデータまで" },
        code: `// ── 1. Basic — two awaits, not one ────────────────────────────────
const response = await fetch("https://api.example.com/users");
const users = await response.json(); // reading the body is async too

// ── 2. Intermediate — a 404 still resolves ────────────────────────
async function getUser(id) {
  const response = await fetch(\`https://api.example.com/users/\${id}\`);

  if (!response.ok) {
    // fetch never threw here; the status has to be checked by hand
    throw new Error(\`Request failed: \${response.status}\`);
  }

  return response.json();
}

// ── 3. Advanced — POST JSON with the right headers ────────────────
const created = await fetch("https://api.example.com/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Rajan", age: 30 }), // not automatic
});

// ── Other ways to read the body ───────────────────────────────────
// await response.text();        plain text, HTML, XML
// await response.blob();        images and files
// await response.arrayBuffer(); raw bytes

// ── The body is consumed once, so clone for a second read ─────────
const res = await fetch(url);
const copy = res.clone();

const data = await res.json();
const raw = await copy.text();

// ── Production shape: network errors and HTTP errors together ─────
async function fetchUsers() {
  try {
    const response = await fetch("/api/users");
    if (!response.ok) throw new Error(\`HTTP error: \${response.status}\`);
    return await response.json();
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
}`,
      },
      keyTakeaways: [
        { en: "`fetch()` returns a <b>`Promise<Response>`</b>, not the data itself.", np: "`fetch()` ले data होइन, <b>`Promise<Response>`</b> फर्काउँछ।", jp: "`fetch()` が返すのはデータではなく<b>`Promise<Response>`</b>。" },
        { en: "Reading the body with `json()`, `text()` or `blob()` is a <b>second asynchronous step</b>.", np: "`json()`, `text()` वा `blob()` ले body पढ्नु <b>दोस्रो asynchronous चरण</b> हो।", jp: "`json()`・`text()`・`blob()` による本文の読み取りは<b>2つ目の非同期処理</b>。" },
        { en: "`fetch()` <b>does not reject</b> on 404 or 500 — only network-level failures reject.", np: "404 वा 500 मा `fetch()` <b>reject हुँदैन</b> — network-स्तरका असफलतामा मात्र reject हुन्छ।", jp: "404や500で `fetch()` は<b>拒否されない</b>。拒否されるのはネットワークレベルの失敗だけ。" },
        { en: "Always check <b>`response.ok`</b> or `response.status` before using the data.", np: "Data प्रयोग गर्नुअघि सधैं <b>`response.ok`</b> वा `response.status` जाँच्नुहोस्।", jp: "データを使う前に必ず<b>`response.ok`</b> か `response.status` を確認する。" },
        { en: "`fetch()` does not serialize automatically — send objects with <b>`JSON.stringify()`</b> and a `Content-Type` header.", np: "`fetch()` ले स्वतः serialize गर्दैन — object पठाउँदा <b>`JSON.stringify()`</b> र `Content-Type` header दिनुहोस्।", jp: "`fetch()` は自動で直列化しない。オブジェクトは<b>`JSON.stringify()`</b> と `Content-Type` ヘッダーで送る。" },
        { en: "A response body is a stream that can normally be <b>consumed only once</b>; use `response.clone()` for a second read.", np: "Response body एउटा stream हो जुन सामान्यतया <b>एक पटक मात्र खपत</b> हुन्छ; दोस्रो पटक पढ्न `response.clone()` प्रयोग गर्नुहोस्।", jp: "レスポンス本文は通常<b>1回しか消費できない</b>ストリーム。2回読むには `response.clone()`。" },
        { en: "The second `fetch()` argument carries `method`, `headers`, `body`, `credentials`, `mode` and `cache`.", np: "`fetch()` को दोस्रो argument ले `method`, `headers`, `body`, `credentials`, `mode` र `cache` बोक्छ।", jp: "`fetch()` の第2引数が `method`・`headers`・`body`・`credentials`・`mode`・`cache` を運ぶ。" },
      ],
      commonMistakes: [
        { en: "<b>Assuming `fetch()` rejects on 404</b> — a `try/catch` around `fetch(\"/missing\")` still reaches the success branch, because the HTTP request itself completed. Check `response.ok` and throw yourself.", np: "<b>404 मा `fetch()` reject हुन्छ भन्ने ठान्नु</b> — `fetch(\"/missing\")` वरिपरिको `try/catch` अझै success शाखामै पुग्छ, किनकि HTTP request आफैं पूरा भयो। `response.ok` जाँचेर आफैं throw गर्नुहोस्।", jp: "<b>404で `fetch()` が拒否されると思う</b> — `fetch(\"/missing\")` を `try/catch` で囲んでも成功側に進む。HTTPのやり取り自体は完了しているため。`response.ok` を確認して自分でthrowする。" },
        { en: "<b>Forgetting to parse the response</b> — `console.log(response)` prints a `Response` object, not your users. You still need `await response.json()`.", np: "<b>Response parse गर्न बिर्सनु</b> — `console.log(response)` ले तपाईंको user होइन, `Response` object देखाउँछ। `await response.json()` अझै चाहिन्छ।", jp: "<b>レスポンスの解析を忘れる</b> — `console.log(response)` はユーザーではなく `Response` オブジェクトを出す。`await response.json()` が必要。" },
        { en: "<b>Forgetting `JSON.stringify()`</b> — passing `body: { name: \"Rajan\" }` does not send JSON. Serialize the object and set `Content-Type: application/json`.", np: "<b>`JSON.stringify()` बिर्सनु</b> — `body: { name: \"Rajan\" }` दिँदा JSON पठाइँदैन। Object serialize गरी `Content-Type: application/json` सेट गर्नुहोस्।", jp: "<b>`JSON.stringify()` を忘れる</b> — `body: { name: \"Rajan\" }` ではJSONは送られない。直列化し `Content-Type: application/json` を設定する。" },
        { en: "<b>Reading the body twice</b> — calling `response.json()` and then `response.text()` on the same response throws, because the stream is already consumed. Call `response.clone()` first.", np: "<b>Body दुई पटक पढ्नु</b> — एउटै response मा `response.json()` अनि `response.text()` बोलाउँदा error आउँछ, किनकि stream पहिले नै खपत भइसक्यो। पहिले `response.clone()` बोलाउनुहोस्।", jp: "<b>本文を2回読む</b> — 同じレスポンスで `response.json()` の後に `response.text()` を呼ぶと例外になる。先に `response.clone()` を呼ぶ。" },
      ],
      quiz: [
        {
          question: { en: "What does `fetch()` return?", np: "`fetch()` ले के फर्काउँछ?", jp: "`fetch()` は何を返すか?" },
          options: [
            { en: "A `Response`", np: "एउटा `Response`", jp: "`Response`" },
            { en: "A `Promise` that resolves to a `Response`", np: "`Response` मा resolve हुने `Promise`", jp: "`Response` に解決される `Promise`" },
            { en: "A JSON object", np: "एउटा JSON object", jp: "JSONオブジェクト" },
            { en: "A string", np: "एउटा string", jp: "文字列" },
          ],
          correctIndex: 1,
          explanation: { en: "That is why `fetch()` pairs naturally with `await`.", np: "त्यसैले `fetch()` `await` सँग स्वाभाविक रूपमा मिल्छ।", jp: "だから `fetch()` は `await` と自然に組み合わさる。" },
        },
        {
          question: { en: "What happens when the server returns `404`?", np: "Server ले `404` फर्काउँदा के हुन्छ?", jp: "サーバーが `404` を返すとどうなるか?" },
          options: [
            { en: "`fetch()` always rejects", np: "`fetch()` सधैं reject हुन्छ", jp: "`fetch()` は必ず拒否される" },
            { en: "The browser crashes", np: "Browser crash हुन्छ", jp: "ブラウザがクラッシュする" },
            { en: "`fetch()` resolves with `response.ok === false`", np: "`response.ok === false` सहित `fetch()` resolve हुन्छ", jp: "`response.ok === false` で解決される" },
            { en: "`fetch()` retries automatically", np: "`fetch()` आफैं फेरि प्रयास गर्छ", jp: "`fetch()` が自動で再試行する" },
          ],
          correctIndex: 2,
          explanation: { en: "Only network-level failures reject the promise.", np: "Network-स्तरका असफलताले मात्र promise reject गर्छन्।", jp: "Promiseを拒否するのはネットワークレベルの失敗だけ。" },
        },
        {
          question: { en: "How do you parse a JSON response?", np: "JSON response कसरी parse गर्ने?", jp: "JSONレスポンスはどう解析するか?" },
          options: [
            { en: "`response.parse()`", np: "`response.parse()`", jp: "`response.parse()`" },
            { en: "`response.json()`", np: "`response.json()`", jp: "`response.json()`" },
            { en: "`JSON.parse(response)`", np: "`JSON.parse(response)`", jp: "`JSON.parse(response)`" },
            { en: "`response.data()`", np: "`response.data()`", jp: "`response.data()`" },
          ],
          correctIndex: 1,
          explanation: { en: "It returns a promise, so it needs its own `await`.", np: "यसले promise फर्काउँछ, त्यसैले छुट्टै `await` चाहिन्छ।", jp: "Promiseを返すので、それ自体に `await` が要る。" },
        },
        {
          question: { en: "Why use `JSON.stringify()` when sending JSON?", np: "JSON पठाउँदा `JSON.stringify()` किन प्रयोग गर्ने?", jp: "JSONを送るとき `JSON.stringify()` を使う理由は?" },
          options: [
            { en: "To encrypt the request", np: "Request encrypt गर्न", jp: "リクエストを暗号化するため" },
            { en: "To convert a JavaScript object into a JSON string", np: "JavaScript object लाई JSON string बनाउन", jp: "JavaScriptオブジェクトをJSON文字列に変換するため" },
            { en: "To parse the response", np: "Response parse गर्न", jp: "レスポンスを解析するため" },
            { en: "To create a Promise", np: "Promise बनाउन", jp: "Promiseを作るため" },
          ],
          correctIndex: 1,
          explanation: { en: "`fetch()` does not serialize the body for you.", np: "`fetch()` ले तपाईंका लागि body serialize गर्दैन।", jp: "`fetch()` は本文を代わりに直列化してくれない。" },
        },
        {
          question: { en: "What happens when `response.json()` is called twice on the same response?", np: "एउटै response मा `response.json()` दुई पटक बोलाउँदा के हुन्छ?", jp: "同じレスポンスで `response.json()` を2回呼ぶとどうなるか?" },
          options: [
            { en: "Both calls work", np: "दुबै call काम गर्छन्", jp: "両方とも動く" },
            { en: "The second returns the same data", np: "दोस्रोले उही data फर्काउँछ", jp: "2回目も同じデータを返す" },
            { en: "The second consumption fails", np: "दोस्रो खपत असफल हुन्छ", jp: "2回目の消費が失敗する" },
            { en: "The request runs twice", np: "Request दुई पटक चल्छ", jp: "リクエストが2回走る" },
          ],
          correctIndex: 2,
          explanation: { en: "Clone the response first when you genuinely need two reads.", np: "साँच्चै दुई पटक पढ्नुपर्ने भए पहिले response clone गर्नुहोस्।", jp: "本当に2回読むなら、先にレスポンスを複製する。" },
        },
      ],
    },
    {
      id: "abortcontroller",
      title: { en: "AbortController — Cancelling Requests", np: "AbortController — Requests Cancel गर्नु", jp: "AbortController — リクエストのキャンセル" },
      durationMinutes: 9,
      explanation: {
        en: "An <b>`AbortController`</b> gives you a standard way to <b>cancel an asynchronous operation</b> that supports cancellation, especially `fetch()` requests.\n\nThink of it as a remote control:\n\n```text\nAbortController\n      │\n      ├── signal ──────→ fetch()\n      │\n      └── abort() ─────→ CANCEL\n```\n\nYou create the controller, give its `signal` to `fetch()`, and later call `abort()` when the request should no longer continue.\n\n```javascript\nconst controller = new AbortController();\n\nfetch(\"/api/users\", {\n  signal: controller.signal\n});\n\ncontroller.abort();\n```\n\nOnce `abort()` is called, the fetch rejects with an error whose name is usually `\"AbortError\"`.\n\n---\n\n### 1. Basic — cancel a fetch\n\n```javascript\nconst controller = new AbortController();\n\nfetch(\"https://api.example.com/users\", {\n  signal: controller.signal\n})\n  .then(response => response.json())\n  .then(users => console.log(users))\n  .catch(error => {\n    console.log(error.name); // \"AbortError\"\n  });\n\ncontroller.abort();\n```\n\nThe request is cancelled, so the `fetch()` promise rejects.\n\n---\n\n### 2. Intermediate — handle cancellation separately\n\nCancellation is not necessarily a real application error. The user may have intentionally cancelled the request or navigated away.\n\n```javascript\nconst controller = new AbortController();\n\nasync function loadUsers() {\n  try {\n    const response = await fetch(\"/api/users\", {\n      signal: controller.signal\n    });\n\n    const users = await response.json();\n\n    console.log(users);\n  } catch (error) {\n    if (error.name === \"AbortError\") {\n      console.log(\"Request was cancelled\");\n      return;\n    }\n\n    console.error(\"Request failed:\", error);\n  }\n}\n\nloadUsers();\n\ncontroller.abort();\n```\n\n```text\nNetwork failure\n      ↓\nActual error\n\nAbortError\n      ↓\nIntentional cancellation\n```\n\nYou generally do not want to show \"Something went wrong\" to a user who simply navigated away.\n\n---\n\n### 3. Advanced — implement a fetch timeout\n\n`fetch()` does not give you a general request timeout on its own. Combine `AbortController` with `setTimeout()`:\n\n```javascript\nconst controller = new AbortController();\n\nconst timeout = setTimeout(() => {\n  controller.abort();\n}, 5000);\n\ntry {\n  const response = await fetch(\"/api/users\", {\n    signal: controller.signal\n  });\n\n  const users = await response.json();\n\n  console.log(users);\n} catch (error) {\n  if (error.name === \"AbortError\") {\n    console.log(\"Request timed out\");\n  } else {\n    console.error(error);\n  }\n} finally {\n  clearTimeout(timeout);\n}\n```\n\n```text\nStart fetch\n    │\n    ├──────────────→ Response arrives\n    │                     │\n    │                     ↓\n    │               clear timeout\n    │\n    └── 5 seconds ──→ controller.abort()\n                            │\n                            ↓\n                     Request cancelled\n```\n\nModern JavaScript also provides a built-in shortcut:\n\n```javascript\nfetch(\"/api/users\", {\n  signal: AbortSignal.timeout(5000)\n});\n```\n\n---\n\n### React cleanup\n\nA particularly important use case is cancelling a request when a component no longer cares about the result.\n\n```javascript\nuseEffect(() => {\n  const controller = new AbortController();\n\n  async function loadUser() {\n    try {\n      const response = await fetch(\"/api/user\", {\n        signal: controller.signal\n      });\n\n      const user = await response.json();\n\n      setUser(user);\n    } catch (error) {\n      if (error.name !== \"AbortError\") {\n        console.error(error);\n      }\n    }\n  }\n\n  loadUser();\n\n  return () => {\n    controller.abort();\n  };\n}, []);\n```\n\n```text\nComponent mounts\n      │\n      ↓\nCreate controller\n      │\n      ↓\nStart fetch\n      │\n      ├──── Response arrives\n      │          ↓\n      │       setState()\n      │\n      └──── Component unmounts\n                 ↓\n          controller.abort()\n                 ↓\n          Cancel stale request\n```\n\nThis prevents an old request from resolving into a component that is gone.\n\n---\n\n### Debounced search and stale results\n\nImagine the user types `r`, `re`, `rea`, `reac`, `react`. Without cancellation, several requests run at once:\n\n```text\n\"r\"       ───────────────→\n\"re\"         ────────────→\n\"rea\"           ─────────→\n\"reac\"             ──────→\n\"react\"              ────→\n```\n\nA slower old request can finish <b>after</b> the newer one and overwrite the correct results. With an `AbortController`:\n\n```javascript\nlet controller;\n\nasync function search(query) {\n  controller?.abort();\n\n  controller = new AbortController();\n\n  try {\n    const response = await fetch(\n      `/api/search?q=${encodeURIComponent(query)}`,\n      {\n        signal: controller.signal\n      }\n    );\n\n    return await response.json();\n  } catch (error) {\n    if (error.name === \"AbortError\") {\n      return;\n    }\n\n    throw error;\n  }\n}\n```\n\n```text\nSearch \"rea\"\n      │\n      ↓\nRequest A ──────────────X\n\n\nSearch \"react\"\n      │\n      ↓\nRequest B ─────────────────→ Results\n```\n\nThe old request is cancelled before it can interfere.\n\n---\n\n### `AbortController` vs `AbortSignal`\n\nThese are two separate objects:\n\n• <b>`AbortController`</b> controls the cancellation — you call `controller.abort()`.\n• <b>`AbortSignal`</b> represents the cancellation state and is what you pass to the operation, as `controller.signal`.\n\n```text\nController\n    │\n    │ owns\n    ↓\n Signal\n    │\n    │ passed to\n    ↓\n fetch()\n```\n\nThe operation does not call `abort()` itself. It watches the signal.\n\n---\n\n### Where cancellation pays off\n\nUse controllers for <b>timeouts</b>, <b>React cleanup</b>, <b>search cancellation</b> and <b>stale-request prevention</b>. One controller can drive several operations when they genuinely share a cancellation lifecycle.",
        np: "<b>`AbortController`</b> ले cancellation समर्थन गर्ने <b>asynchronous operation रद्द गर्ने</b> मानक तरिका दिन्छ, विशेष गरी `fetch()` request।\n\nयसलाई remote control जस्तो ठान्नुहोस्:\n\n```text\nAbortController\n      │\n      ├── signal ──────→ fetch()\n      │\n      └── abort() ─────→ CANCEL\n```\n\nतपाईं controller बनाउनुहुन्छ, यसको `signal` `fetch()` लाई दिनुहुन्छ, र request अगाडि बढ्नु नपर्दा `abort()` बोलाउनुहुन्छ।\n\n```javascript\nconst controller = new AbortController();\n\nfetch(\"/api/users\", {\n  signal: controller.signal\n});\n\ncontroller.abort();\n```\n\n`abort()` बोलाएपछि, fetch त्यस्तो error सँग reject हुन्छ जसको नाम प्रायः `\"AbortError\"` हुन्छ।\n\n---\n\n### 1. आधारभूत — fetch रद्द गर्नु\n\n```javascript\nconst controller = new AbortController();\n\nfetch(\"https://api.example.com/users\", {\n  signal: controller.signal\n})\n  .then(response => response.json())\n  .then(users => console.log(users))\n  .catch(error => {\n    console.log(error.name); // \"AbortError\"\n  });\n\ncontroller.abort();\n```\n\nRequest रद्द हुन्छ, त्यसैले `fetch()` को promise reject हुन्छ।\n\n---\n\n### 2. मध्यम — cancellation छुट्टै सम्हाल्नु\n\nCancellation आवश्यक रूपमा वास्तविक application error होइन। User ले जानाजान रद्द गरेको वा अन्तै गएको हुन सक्छ।\n\n```javascript\nconst controller = new AbortController();\n\nasync function loadUsers() {\n  try {\n    const response = await fetch(\"/api/users\", {\n      signal: controller.signal\n    });\n\n    const users = await response.json();\n\n    console.log(users);\n  } catch (error) {\n    if (error.name === \"AbortError\") {\n      console.log(\"Request was cancelled\");\n      return;\n    }\n\n    console.error(\"Request failed:\", error);\n  }\n}\n\nloadUsers();\n\ncontroller.abort();\n```\n\n```text\nNetwork failure\n      ↓\nActual error\n\nAbortError\n      ↓\nIntentional cancellation\n```\n\nअन्तै गएको user लाई \"Something went wrong\" देखाउनु उचित हुँदैन।\n\n---\n\n### 3. उन्नत — fetch timeout बनाउनु\n\n`fetch()` ले आफैं सामान्य request timeout दिँदैन। `AbortController` लाई `setTimeout()` सँग जोड्नुहोस्:\n\n```javascript\nconst controller = new AbortController();\n\nconst timeout = setTimeout(() => {\n  controller.abort();\n}, 5000);\n\ntry {\n  const response = await fetch(\"/api/users\", {\n    signal: controller.signal\n  });\n\n  const users = await response.json();\n\n  console.log(users);\n} catch (error) {\n  if (error.name === \"AbortError\") {\n    console.log(\"Request timed out\");\n  } else {\n    console.error(error);\n  }\n} finally {\n  clearTimeout(timeout);\n}\n```\n\n```text\nStart fetch\n    │\n    ├──────────────→ Response arrives\n    │                     │\n    │                     ↓\n    │               clear timeout\n    │\n    └── 5 seconds ──→ controller.abort()\n                            │\n                            ↓\n                     Request cancelled\n```\n\nआधुनिक JavaScript ले भित्रैको छोटो बाटो पनि दिन्छ:\n\n```javascript\nfetch(\"/api/users\", {\n  signal: AbortSignal.timeout(5000)\n});\n```\n\n---\n\n### React cleanup\n\nComponent लाई नतिजाको मतलब नरहँदा request रद्द गर्नु विशेष महत्वपूर्ण प्रयोग हो।\n\n```javascript\nuseEffect(() => {\n  const controller = new AbortController();\n\n  async function loadUser() {\n    try {\n      const response = await fetch(\"/api/user\", {\n        signal: controller.signal\n      });\n\n      const user = await response.json();\n\n      setUser(user);\n    } catch (error) {\n      if (error.name !== \"AbortError\") {\n        console.error(error);\n      }\n    }\n  }\n\n  loadUser();\n\n  return () => {\n    controller.abort();\n  };\n}, []);\n```\n\n```text\nComponent mounts\n      │\n      ↓\nCreate controller\n      │\n      ↓\nStart fetch\n      │\n      ├──── Response arrives\n      │          ↓\n      │       setState()\n      │\n      └──── Component unmounts\n                 ↓\n          controller.abort()\n                 ↓\n          Cancel stale request\n```\n\nयसले हराइसकेको component मा पुरानो request resolve हुनबाट जोगाउँछ।\n\n---\n\n### Debounced search र बासी नतिजा\n\nUser ले `r`, `re`, `rea`, `reac`, `react` type गरेको कल्पना गर्नुहोस्। Cancellation नभए धेरै request सँगै चल्छन्:\n\n```text\n\"r\"       ───────────────→\n\"re\"         ────────────→\n\"rea\"           ─────────→\n\"reac\"             ──────→\n\"react\"              ────→\n```\n\nढिलो पुरानो request नयाँ भन्दा <b>पछि</b> सकिएर सही नतिजा मेट्न सक्छ। `AbortController` सँग:\n\n```javascript\nlet controller;\n\nasync function search(query) {\n  controller?.abort();\n\n  controller = new AbortController();\n\n  try {\n    const response = await fetch(\n      `/api/search?q=${encodeURIComponent(query)}`,\n      {\n        signal: controller.signal\n      }\n    );\n\n    return await response.json();\n  } catch (error) {\n    if (error.name === \"AbortError\") {\n      return;\n    }\n\n    throw error;\n  }\n}\n```\n\n```text\nSearch \"rea\"\n      │\n      ↓\nRequest A ──────────────X\n\n\nSearch \"react\"\n      │\n      ↓\nRequest B ─────────────────→ Results\n```\n\nपुरानो request बाधा पुर्‍याउनुअघि नै रद्द हुन्छ।\n\n---\n\n### `AbortController` vs `AbortSignal`\n\nयी दुई छुट्टै object हुन्:\n\n• <b>`AbortController`</b> ले cancellation नियन्त्रण गर्छ — तपाईं `controller.abort()` बोलाउनुहुन्छ।\n• <b>`AbortSignal`</b> ले cancellation अवस्था जनाउँछ र `controller.signal` का रूपमा operation लाई दिइन्छ।\n\n```text\nController\n    │\n    │ owns\n    ↓\n Signal\n    │\n    │ passed to\n    ↓\n fetch()\n```\n\nOperation आफैंले `abort()` बोलाउँदैन। यसले signal हेर्छ।\n\n---\n\n### Cancellation कहाँ काम लाग्छ\n\n<b>Timeout</b>, <b>React cleanup</b>, <b>search cancellation</b> र <b>बासी request रोक्न</b> controller प्रयोग गर्नुहोस्। एउटै cancellation जीवनचक्र बाँड्ने भए एउटा controller ले धेरै operation चलाउन सक्छ।",
        jp: "<b>`AbortController`</b> は、キャンセルに対応した<b>非同期処理を中止する</b>標準的な方法を提供します。とくに `fetch()` でよく使われます。\n\nリモコンのようなものだと考えてください:\n\n```text\nAbortController\n      │\n      ├── signal ──────→ fetch()\n      │\n      └── abort() ─────→ CANCEL\n```\n\nコントローラーを作り、その `signal` を `fetch()` に渡し、続ける必要がなくなったら `abort()` を呼びます。\n\n```javascript\nconst controller = new AbortController();\n\nfetch(\"/api/users\", {\n  signal: controller.signal\n});\n\ncontroller.abort();\n```\n\n`abort()` を呼ぶと、fetchは通常 `\"AbortError\"` という名前のエラーで拒否されます。\n\n---\n\n### 1. 基本 — fetchを中止する\n\n```javascript\nconst controller = new AbortController();\n\nfetch(\"https://api.example.com/users\", {\n  signal: controller.signal\n})\n  .then(response => response.json())\n  .then(users => console.log(users))\n  .catch(error => {\n    console.log(error.name); // \"AbortError\"\n  });\n\ncontroller.abort();\n```\n\nリクエストが中止されるので、`fetch()` のPromiseは拒否されます。\n\n---\n\n### 2. 中級 — キャンセルは別扱いにする\n\nキャンセルは必ずしも本当のエラーではありません。ユーザーが意図的に中止したり、別のページへ移動したのかもしれません。\n\n```javascript\nconst controller = new AbortController();\n\nasync function loadUsers() {\n  try {\n    const response = await fetch(\"/api/users\", {\n      signal: controller.signal\n    });\n\n    const users = await response.json();\n\n    console.log(users);\n  } catch (error) {\n    if (error.name === \"AbortError\") {\n      console.log(\"Request was cancelled\");\n      return;\n    }\n\n    console.error(\"Request failed:\", error);\n  }\n}\n\nloadUsers();\n\ncontroller.abort();\n```\n\n```text\nNetwork failure\n      ↓\nActual error\n\nAbortError\n      ↓\nIntentional cancellation\n```\n\n離脱しただけのユーザーに「問題が発生しました」と出すべきではありません。\n\n---\n\n### 3. 上級 — fetchにタイムアウトを付ける\n\n`fetch()` 単体に汎用のタイムアウトはありません。`AbortController` と `setTimeout()` を組み合わせます:\n\n```javascript\nconst controller = new AbortController();\n\nconst timeout = setTimeout(() => {\n  controller.abort();\n}, 5000);\n\ntry {\n  const response = await fetch(\"/api/users\", {\n    signal: controller.signal\n  });\n\n  const users = await response.json();\n\n  console.log(users);\n} catch (error) {\n  if (error.name === \"AbortError\") {\n    console.log(\"Request timed out\");\n  } else {\n    console.error(error);\n  }\n} finally {\n  clearTimeout(timeout);\n}\n```\n\n```text\nStart fetch\n    │\n    ├──────────────→ Response arrives\n    │                     │\n    │                     ↓\n    │               clear timeout\n    │\n    └── 5 seconds ──→ controller.abort()\n                            │\n                            ↓\n                     Request cancelled\n```\n\n最近のJavaScriptには組み込みの近道もあります:\n\n```javascript\nfetch(\"/api/users\", {\n  signal: AbortSignal.timeout(5000)\n});\n```\n\n---\n\n### Reactのクリーンアップ\n\nコンポーネントが結果を必要としなくなったときに中止するのは、とくに重要な用途です。\n\n```javascript\nuseEffect(() => {\n  const controller = new AbortController();\n\n  async function loadUser() {\n    try {\n      const response = await fetch(\"/api/user\", {\n        signal: controller.signal\n      });\n\n      const user = await response.json();\n\n      setUser(user);\n    } catch (error) {\n      if (error.name !== \"AbortError\") {\n        console.error(error);\n      }\n    }\n  }\n\n  loadUser();\n\n  return () => {\n    controller.abort();\n  };\n}, []);\n```\n\n```text\nComponent mounts\n      │\n      ↓\nCreate controller\n      │\n      ↓\nStart fetch\n      │\n      ├──── Response arrives\n      │          ↓\n      │       setState()\n      │\n      └──── Component unmounts\n                 ↓\n          controller.abort()\n                 ↓\n          Cancel stale request\n```\n\nすでに消えたコンポーネントへ古いリクエストが返ってくるのを防げます。\n\n---\n\n### 検索と古い結果\n\nユーザーが `r`・`re`・`rea`・`reac`・`react` と打つ場面を想像してください。中止しなければ複数のリクエストが同時に走ります:\n\n```text\n\"r\"       ───────────────→\n\"re\"         ────────────→\n\"rea\"           ─────────→\n\"reac\"             ──────→\n\"react\"              ────→\n```\n\n遅い古いリクエストが新しいものより<b>後に</b>終わり、正しい結果を上書きしかねません。`AbortController` を使うと:\n\n```javascript\nlet controller;\n\nasync function search(query) {\n  controller?.abort();\n\n  controller = new AbortController();\n\n  try {\n    const response = await fetch(\n      `/api/search?q=${encodeURIComponent(query)}`,\n      {\n        signal: controller.signal\n      }\n    );\n\n    return await response.json();\n  } catch (error) {\n    if (error.name === \"AbortError\") {\n      return;\n    }\n\n    throw error;\n  }\n}\n```\n\n```text\nSearch \"rea\"\n      │\n      ↓\nRequest A ──────────────X\n\n\nSearch \"react\"\n      │\n      ↓\nRequest B ─────────────────→ Results\n```\n\n古いリクエストは邪魔をする前に中止されます。\n\n---\n\n### `AbortController` と `AbortSignal`\n\nこれは別々のオブジェクトです:\n\n• <b>`AbortController`</b> がキャンセルを制御します。`controller.abort()` を呼ぶのはこちら。\n• <b>`AbortSignal`</b> はキャンセルの状態を表し、`controller.signal` として処理に渡します。\n\n```text\nController\n    │\n    │ owns\n    ↓\n Signal\n    │\n    │ passed to\n    ↓\n fetch()\n```\n\n処理側が `abort()` を呼ぶのではなく、シグナルを見張ります。\n\n---\n\n### 効いてくる場面\n\n<b>タイムアウト</b>・<b>Reactのクリーンアップ</b>・<b>検索の中止</b>・<b>古いリクエストの排除</b>に使います。キャンセルの寿命を本当に共有するなら、1つのコントローラーで複数の処理を束ねられます。",
      },
      diagram: `1. Create controller

const controller = new AbortController();


2. Start request

fetch("/api/users", {
  signal: controller.signal
});


3. Request is running

Browser
   │
   ├── Request ─────────────→ Server
   │
   └── controller.signal


4. Cancel request

controller.abort()
        │
        ↓
   Request cancelled
        │
        ↓
fetch() rejects with AbortError


Controller owns the signal, the operation watches it

Controller
    │
    │ owns
    ↓
 Signal
    │
    │ passed to
    ↓
 fetch()


Timeout, built from the same two pieces

Start fetch
    │
    ├──────────────→ Response arrives
    │                     │
    │                     ↓
    │               clear timeout
    │
    └── 5 seconds ──→ controller.abort()
                            │
                            ↓
                     Request cancelled`,
      codeExample: {
        title: { en: "Cancelling work that no longer matters", np: "अब चाहिँदैन भन्ने काम रद्द गर्नु", jp: "もう不要になった処理を中止する" },
        code: `// ── 1. Basic — cancel a request in flight ─────────────────────────
const controller = new AbortController();

fetch("https://api.example.com/users", { signal: controller.signal })
  .then(response => response.json())
  .catch(error => console.log(error.name)); // "AbortError"

controller.abort();

// ── 2. Intermediate — cancellation is not a failure ───────────────
try {
  const response = await fetch("/api/users", { signal: controller.signal });
  console.log(await response.json());
} catch (error) {
  if (error.name === "AbortError") return; // the user moved on, stay quiet
  console.error("Request failed:", error);
}

// ── 3. Advanced — build a timeout from a controller and a timer ───
const timeoutController = new AbortController();
const timer = setTimeout(() => timeoutController.abort(), 5000);

try {
  const response = await fetch("/api/users", {
    signal: timeoutController.signal,
  });
  console.log(await response.json());
} catch (error) {
  if (error.name === "AbortError") console.log("Request timed out");
} finally {
  clearTimeout(timer); // always clear it, success or failure
}

// Or use the built-in shortcut
fetch("/api/users", { signal: AbortSignal.timeout(5000) });

// ── React cleanup: cancel when the component goes away ────────────
useEffect(() => {
  const controller = new AbortController();

  fetch("/api/user", { signal: controller.signal })
    .then(response => response.json())
    .then(setUser)
    .catch(error => {
      if (error.name !== "AbortError") console.error(error);
    });

  return () => controller.abort();
}, []);

// ── Search: cancel the previous keystroke's request ───────────────
let searchController;

async function search(query) {
  searchController?.abort(); // an old, slower reply can no longer win
  searchController = new AbortController();

  const response = await fetch(\`/api/search?q=\${encodeURIComponent(query)}\`, {
    signal: searchController.signal,
  });

  return response.json();
}`,
      },
      keyTakeaways: [
        { en: "`AbortController` provides cancellation control for operations that support it.", np: "`AbortController` ले समर्थन गर्ने operation का लागि cancellation नियन्त्रण दिन्छ।", jp: "`AbortController` は対応する処理にキャンセルの制御を与える。" },
        { en: "<b>`controller.signal`</b> is what connects the controller to `fetch()`.", np: "<b>`controller.signal`</b> ले नै controller लाई `fetch()` सँग जोड्छ।", jp: "コントローラーと `fetch()` をつなぐのが<b>`controller.signal`</b>。" },
        { en: "<b>`controller.abort()`</b> triggers the cancellation; the operation itself never calls it.", np: "<b>`controller.abort()`</b> ले cancellation सुरु गर्छ; operation आफैंले यो कहिल्यै बोलाउँदैन।", jp: "キャンセルを起こすのは<b>`controller.abort()`</b>。処理側が呼ぶことはない。" },
        { en: "A cancelled `fetch()` rejects with an error whose `name` is <b>`\"AbortError\"`</b>.", np: "रद्द भएको `fetch()` त्यस्तो error सँग reject हुन्छ जसको `name` <b>`\"AbortError\"`</b> हुन्छ।", jp: "中止された `fetch()` は `name` が<b>`\"AbortError\"`</b> のエラーで拒否される。" },
        { en: "Handle `AbortError` <b>separately</b> from genuine failures so cancelled work does not look broken.", np: "रद्द भएको काम बिग्रिएको नदेखियोस् भनेर `AbortError` लाई वास्तविक असफलताभन्दा <b>छुट्टै</b> सम्हाल्नुहोस्।", jp: "中止した処理が壊れて見えないよう、`AbortError` は本当の失敗と<b>別に</b>扱う。" },
        { en: "`fetch()` has no built-in timeout — build one with `setTimeout()` plus `abort()`, or use `AbortSignal.timeout()`.", np: "`fetch()` मा भित्रैको timeout छैन — `setTimeout()` र `abort()` ले बनाउनुहोस्, वा `AbortSignal.timeout()` प्रयोग गर्नुहोस्।", jp: "`fetch()` に組み込みのタイムアウトはない。`setTimeout()` と `abort()` で作るか `AbortSignal.timeout()` を使う。" },
        { en: "Cancellation prevents <b>stale requests</b> from overwriting newer results, and stops React state updates after unmount.", np: "Cancellation ले <b>बासी request</b> ले नयाँ नतिजा मेट्नबाट जोगाउँछ, र unmount पछिको React state update रोक्छ।", jp: "キャンセルは<b>古いリクエスト</b>が新しい結果を上書きするのを防ぎ、アンマウント後のReactの状態更新も止める。" },
      ],
      commonMistakes: [
        { en: "<b>Forgetting to pass the signal</b> — calling `fetch(\"/api/users\")` and then `controller.abort()` cancels nothing, because the request was never connected to the controller.", np: "<b>Signal पास गर्न बिर्सनु</b> — `fetch(\"/api/users\")` अनि `controller.abort()` गर्दा केही रद्द हुँदैन, किनकि request controller सँग जोडिएकै थिएन।", jp: "<b>signalを渡し忘れる</b> — `fetch(\"/api/users\")` の後に `controller.abort()` しても何も中止されない。リクエストがコントローラーとつながっていないため。" },
        { en: "<b>Treating cancellation as an application error</b> — a bare `catch` that calls `showError(\"Failed to load users\")` shows a message to a user who simply navigated away. Return early on `AbortError`.", np: "<b>Cancellation लाई application error ठान्नु</b> — `showError(\"Failed to load users\")` बोलाउने खाली `catch` ले अन्तै गएको user लाई सन्देश देखाउँछ। `AbortError` मा अघि नै फर्किनुहोस्।", jp: "<b>キャンセルをアプリのエラー扱いする</b> — `showError(\"Failed to load users\")` を呼ぶだけの `catch` は、離脱しただけのユーザーにメッセージを出す。`AbortError` なら早期に戻る。" },
        { en: "<b>Sharing one controller across unrelated requests</b> — giving the same signal to `/api/users` and `/api/posts` means one `abort()` cancels both. Use separate controllers when the operations are independent.", np: "<b>असम्बन्धित request मा एउटै controller बाँड्नु</b> — `/api/users` र `/api/posts` लाई उही signal दिँदा एउटै `abort()` ले दुबै रद्द गर्छ। Operation स्वतन्त्र भए छुट्टाछुट्टै controller प्रयोग गर्नुहोस्।", jp: "<b>無関係なリクエストで1つのコントローラーを共有する</b> — `/api/users` と `/api/posts` に同じシグナルを渡すと、1回の `abort()` で両方止まる。独立した処理には別々のコントローラーを使う。" },
        { en: "<b>Forgetting to clear the timeout</b> — without `clearTimeout(timer)` in a `finally` block, a pending timer can abort a controller you no longer use.", np: "<b>Timeout clear गर्न बिर्सनु</b> — `finally` मा `clearTimeout(timer)` नभए, बाँकी timer ले अब प्रयोग नगरिने controller abort गर्न सक्छ।", jp: "<b>タイマーの解除を忘れる</b> — `finally` に `clearTimeout(timer)` がないと、残ったタイマーがもう使わないコントローラーを中止しうる。" },
      ],
      quiz: [
        {
          question: { en: "What actually cancels a request?", np: "Request वास्तवमा कसले रद्द गर्छ?", jp: "実際にリクエストを中止するのはどれか?" },
          options: [
            { en: "`controller.cancel()`", np: "`controller.cancel()`", jp: "`controller.cancel()`" },
            { en: "`signal.cancel()`", np: "`signal.cancel()`", jp: "`signal.cancel()`" },
            { en: "`controller.abort()`", np: "`controller.abort()`", jp: "`controller.abort()`" },
            { en: "`fetch.cancel()`", np: "`fetch.cancel()`", jp: "`fetch.cancel()`" },
          ],
          correctIndex: 2,
          explanation: { en: "The signal only reports the state; the controller triggers it.", np: "Signal ले अवस्था मात्र बताउँछ; controller ले सुरु गर्छ।", jp: "シグナルは状態を伝えるだけで、起こすのはコントローラー。" },
        },
        {
          question: { en: "What must be passed to `fetch()` to connect it to an `AbortController`?", np: "`fetch()` लाई `AbortController` सँग जोड्न के पास गर्नुपर्छ?", jp: "`fetch()` を `AbortController` につなぐには何を渡すか?" },
          options: [
            { en: "`controller`", np: "`controller`", jp: "`controller`" },
            { en: "`controller.signal`", np: "`controller.signal`", jp: "`controller.signal`" },
            { en: "`controller.abort`", np: "`controller.abort`", jp: "`controller.abort`" },
            { en: "`AbortController.signal`", np: "`AbortController.signal`", jp: "`AbortController.signal`" },
          ],
          correctIndex: 1,
          explanation: { en: "Without the signal, `abort()` has nothing to cancel.", np: "Signal नभए, `abort()` सँग रद्द गर्ने केही हुँदैन।", jp: "シグナルがなければ `abort()` に中止する対象がない。" },
        },
        {
          question: { en: "What does a cancelled `fetch()` normally reject with?", np: "रद्द भएको `fetch()` सामान्यतया केसँग reject हुन्छ?", jp: "中止された `fetch()` は通常どれで拒否されるか?" },
          options: [
            { en: "`TimeoutError`", np: "`TimeoutError`", jp: "`TimeoutError`" },
            { en: "`NetworkError`", np: "`NetworkError`", jp: "`NetworkError`" },
            { en: "`AbortError`", np: "`AbortError`", jp: "`AbortError`" },
            { en: "`CancelError`", np: "`CancelError`", jp: "`CancelError`" },
          ],
          correctIndex: 2,
          explanation: { en: "Check `error.name` to tell cancellation from a real failure.", np: "वास्तविक असफलता र cancellation छुट्याउन `error.name` जाँच्नुहोस्।", jp: "本当の失敗と区別するには `error.name` を確認する。" },
        },
        {
          question: { en: "Why is cancellation useful for a search box?", np: "Search box का लागि cancellation किन उपयोगी छ?", jp: "検索ボックスでキャンセルが役立つ理由は?" },
          options: [
            { en: "It makes HTTP requests synchronous", np: "यसले HTTP request synchronous बनाउँछ", jp: "HTTPリクエストが同期になるから" },
            { en: "It prevents older requests from overwriting newer results", np: "यसले पुराना request ले नयाँ नतिजा मेट्नबाट रोक्छ", jp: "古いリクエストが新しい結果を上書きするのを防ぐから" },
            { en: "It makes the server respond faster", np: "यसले server लाई छिटो जवाफ दिन लगाउँछ", jp: "サーバーの応答が速くなるから" },
            { en: "It caches results automatically", np: "यसले नतिजा स्वतः cache गर्छ", jp: "結果を自動でキャッシュするから" },
          ],
          correctIndex: 1,
          explanation: { en: "A slow reply to an earlier keystroke can otherwise land last.", np: "नत्र अघिल्लो keystroke को ढिलो जवाफ अन्तिममा आइपुग्न सक्छ।", jp: "そうしないと、前のキー入力への遅い応答が最後に届きうる。" },
        },
        {
          question: { en: "What happens when `controller.abort()` is called right after a `fetch()` that received `controller.signal`?", np: "`controller.signal` पाएको `fetch()` पछि तुरुन्तै `controller.abort()` बोलाउँदा के हुन्छ?", jp: "`controller.signal` を受け取った `fetch()` の直後に `controller.abort()` を呼ぶとどうなるか?" },
          options: [
            { en: "The request continues normally", np: "Request सामान्य रूपमा जारी रहन्छ", jp: "リクエストはそのまま続く" },
            { en: "The request is cancelled", np: "Request रद्द हुन्छ", jp: "リクエストは中止される" },
            { en: "The response is cached", np: "Response cache हुन्छ", jp: "レスポンスがキャッシュされる" },
            { en: "The request is retried", np: "Request फेरि प्रयास हुन्छ", jp: "リクエストが再試行される" },
          ],
          correctIndex: 1,
          explanation: { en: "The promise rejects with an `AbortError` instead of resolving.", np: "Promise resolve नभई `AbortError` सँग reject हुन्छ।", jp: "Promiseは解決せず `AbortError` で拒否される。" },
        },
      ],
    },
    {
      id: "web-storage",
      title: { en: "Web Storage — localStorage & sessionStorage", np: "Web Storage — localStorage र sessionStorage", jp: "Web Storage — localStorageとsessionStorage" },
      durationMinutes: 9,
      explanation: {
        en: "`localStorage` and `sessionStorage` share the exact same simple API: `setItem(key, value)` saves a value, `getItem(key)` reads it back (or returns `null` if the key doesn't exist), `removeItem(key)` deletes one entry, and `clear()` wipes everything for that origin. The one rule that trips people up: <b>every key and value is always a string</b>. If you save a number or object directly, it gets silently coerced with `String()` — so the standard pattern is to `JSON.stringify()` an object before `setItem`, and `JSON.parse()` the result after `getItem`, wrapped in a `try/catch` in case the stored data is ever corrupted or missing.\n\nBoth storages share a browser-enforced quota of roughly <b>5-10 MB per origin</b> — try to exceed it and `setItem` throws a `QuotaExceededError`, which real code should catch rather than let crash the page. The difference between the two is lifetime and scope: `localStorage` persists indefinitely until code or the user explicitly clears it (surviving tab closes and browser restarts), while `sessionStorage` is scoped to a single tab and is wiped the moment that tab closes — even a duplicate tab of the same page starts with empty `sessionStorage`. A subtle detail about the `storage` event: it fires on `window` whenever `localStorage` changes, but only in <b>other</b> tabs/windows of the same origin — the tab that made the change never receives its own event, which makes it useful for syncing state (like a logout) across open tabs.\n\nWeb Storage isn't the only browser persistence option. Cookies hold far less data (~4KB) but are automatically sent to the server with every matching request, which is exactly why session/auth data historically lived there. `IndexedDB` sits at the other end — a full transactional database capable of storing hundreds of megabytes with structured querying, suited for offline apps and large datasets that Web Storage's flat string API can't handle well. On security: because any JavaScript running on your page — including an injected `XSS` payload — can freely read `localStorage`, it is <b>not</b> a safe place for sensitive, long-lived credentials like refresh tokens. The safer pattern is an `httpOnly` cookie for anything long-lived and sensitive (JavaScript cannot read `httpOnly` cookies at all), reserving `localStorage`/`sessionStorage` for non-sensitive UI state like theme, form drafts, or short-lived access tokens.",
        np: "`localStorage` र `sessionStorage` ले ठ्याक्कै उही simple API share गर्छन्: `setItem(key, value)` ले value save गर्छ, `getItem(key)` ले फेरि read गर्छ (key नभएमा `null` फर्काउँछ), `removeItem(key)` ले एउटा entry delete गर्छ, र `clear()` ले त्यो origin को सबै कुरा हटाउँछ। मानिसहरू सबैभन्दा बिर्सने नियम: <b>हरेक key र value सधैं string हुन्छ</b>। Number वा object directly save गरेमा, यो silently `String()` ले coerce हुन्छ — त्यसैले standard pattern भनेको object लाई `setItem` अघि `JSON.stringify()` गर्ने, र `getItem` पछि result लाई `JSON.parse()` गर्ने हो, र stored data कहिलेकाहीं corrupted वा missing हुनसक्ने भएकोले `try/catch` मा wrap गर्ने हो।\n\nदुवै storages ले browser-enforced roughly <b>5-10 MB per origin</b> quota share गर्छन् — यो exceed गर्ने प्रयास गर्दा `setItem` ले `QuotaExceededError` throw गर्छ, जसलाई real code मा page crash हुन नदिन catch गर्नुपर्छ। दुई बीचको फरक भनेको lifetime र scope हो: `localStorage` code वा user ले explicitly clear नगरेसम्म (tab बन्द र browser restart पछि पनि बाँचेर) forever persist हुन्छ, जबकि `sessionStorage` एउटै tab मा scoped हुन्छ र त्यो tab बन्द भएको क्षणमै wipe हुन्छ — same page को duplicate tab पनि empty `sessionStorage` सँग सुरु हुन्छ। `storage` event को एउटा subtle detail: `localStorage` change हुनासाथ यो `window` मा fire हुन्छ, तर same origin को <b>अन्य</b> tabs/windows मा मात्र — change गर्ने tab ले आफ्नै event कहिल्यै पाउँदैन, जसले खुला tabs हरूमा state sync गर्न (जस्तै logout) उपयोगी बनाउँछ।\n\nWeb Storage मात्र browser persistence option होइन। Cookies ले धेरै कम data (~4KB) राख्छन् तर हरेक matching request सँग automatic रूपमा server मा पठाइन्छन्, जो नै session/auth data historically त्यहाँ राख्ने कारण हो। `IndexedDB` अर्को छेउमा छ — सयौं megabytes structured querying सहित store गर्न सक्ने full transactional database, offline apps र Web Storage को flat string API ले राम्ररी handle नगर्ने large datasets का लागि उपयुक्त। Security बारेमा: तपाईंको page मा चल्ने जुनसुकै JavaScript — injected `XSS` payload समावेश गरी — ले `localStorage` freely read गर्न सक्ने भएकोले, यो refresh tokens जस्ता sensitive, long-lived credentials का लागि <b>safe छैन</b>। सुरक्षित pattern भनेको long-lived र sensitive जुनसुकै कुरा का लागि `httpOnly` cookie हो (JavaScript ले `httpOnly` cookies बिल्कुल read गर्न सक्दैन), र `localStorage`/`sessionStorage` लाई theme, form drafts, वा short-lived access tokens जस्ता non-sensitive UI state का लागि छोड्ने हो।",
        jp: "`localStorage`と`sessionStorage`はまったく同じシンプルなAPIを共有する: `setItem(key, value)`は値を保存し、`getItem(key)`は読み戻す（キーが存在しない場合は`null`を返す）、`removeItem(key)`は1つのエントリを削除し、`clear()`はそのオリジンのすべてを消す。多くの人が引っかかる唯一のルール: <b>キーと値は常に文字列</b>である。数値やオブジェクトを直接保存すると`String()`で暗黙に変換されてしまう — そのため標準的なパターンは、`setItem`の前にオブジェクトを`JSON.stringify()`し、`getItem`の後に結果を`JSON.parse()`することで、保存データが壊れていたり存在しない場合に備えて`try/catch`で囲む。\n\n両ストレージともブラウザが強制するオリジンあたり約<b>5-10 MB</b>のクォータを共有する — これを超えようとすると`setItem`は`QuotaExceededError`をスローするので、実際のコードはページをクラッシュさせず捕捉すべき。2つの違いは有効期間とスコープ: `localStorage`はコードやユーザーが明示的にクリアしない限り無期限に持続する（タブを閉じてもブラウザを再起動しても残る）。一方`sessionStorage`は単一タブにスコープされ、そのタブが閉じた瞬間に消える — 同じページの複製タブでも空の`sessionStorage`から始まる。`storage`イベントの微妙な点: `localStorage`が変更されると`window`上で発火するが、これは同一オリジンの<b>他の</b>タブ/ウィンドウのみである — 変更を行ったタブ自身は自分のイベントを受け取らない。これは開いているタブ間で状態（ログアウトなど）を同期させるのに便利。\n\nWeb Storageはブラウザの永続化オプションの唯一の手段ではない。Cookieはずっと少ないデータ（約4KB）しか保持できないが、一致するすべてのリクエストと共に自動的にサーバーへ送信される — これこそセッション/認証データが歴史的にそこに置かれてきた理由。`IndexedDB`はその対極にある — 数百メガバイトを構造化クエリ付きで保存できる完全なトランザクションデータベースで、オフラインアプリやWeb Storageのフラットな文字列APIではうまく扱えない大規模データに適している。セキュリティについて: ページ上で動く任意のJavaScript — 注入された`XSS`ペイロードも含む — が`localStorage`を自由に読めるため、リフレッシュトークンのような重要で長期的な認証情報を置くのに<b>安全ではない</b>。より安全なパターンは、長期的で重要なものには`httpOnly`Cookie（JavaScriptは`httpOnly`Cookieを一切読めない）を使い、`localStorage`/`sessionStorage`はテーマ・フォームの下書き・短命なアクセストークンなど非機密なUI状態に限定することである。",
      },
      diagram: `                 localStorage              sessionStorage
lifetime          forever (until cleared)   until TAB closes
scope             same origin, ALL tabs     current tab ONLY
capacity          ~5-10 MB                  ~5-10 MB

API (identical for both):
  setItem(key, value)   → value coerced to STRING
  getItem(key)          → string | null
  removeItem(key)
  clear()

Objects need JSON:
  setItem("user", JSON.stringify({ name: "Alice" }))
  JSON.parse(getItem("user"))          → { name: "Alice" }

storage event:
  Tab A: localStorage.setItem("theme","dark")
  Tab A window ─── does NOT get "storage" event
  Tab B window ─── DOES get "storage" event   ← fires in OTHER tabs only

localStorage   ── XSS script CAN read it ──►  NOT safe for long-lived secrets
httpOnly cookie ── JS cannot read it at all ──► safer for refresh tokens`,
      codeExample: {
        title: { en: "Reading, writing and choosing the right storage", np: "सहि storage read, write र choose गर्नु", jp: "適切なストレージの読み書きと選択" },
        code: `// ── Basic API — identical for localStorage and sessionStorage ──────
localStorage.setItem("theme", "dark");
localStorage.getItem("theme");        // "dark"
localStorage.getItem("missingKey");   // null — not an error
localStorage.removeItem("theme");
localStorage.clear();                 // wipes EVERY key for this origin

// ── Values are always strings — JSON for anything else ──────────────
const settings = { theme: "dark", fontSize: 16 };
localStorage.setItem("settings", JSON.stringify(settings));

const stored = JSON.parse(localStorage.getItem("settings") ?? "null");
console.log(stored?.fontSize);   // 16

// ── Safe read/write helpers that survive corrupted/missing data ─────
function readStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;   // JSON.parse blew up — treat it as if it wasn't there
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // storage is full — roughly a 5-10MB ceiling per origin
    console.error("QuotaExceededError:", err);
  }
}

// ── sessionStorage — same API, scoped to this tab only ──────────────
sessionStorage.setItem("wizardStep", "2");    // cleared automatically when the tab closes
// a duplicate of this tab in a new window starts with an EMPTY sessionStorage

// ── Reacting to changes made in OTHER tabs ──────────────────────────
window.addEventListener("storage", (event) => {
  // Only fires here if a DIFFERENT tab changed localStorage — never this tab's own writes
  if (event.key === "authToken" && event.newValue === null) {
    // another tab logged out — mirror it here too
    window.location.reload();
  }
});

// ── Security: don't put long-lived secrets in localStorage ──────────
// localStorage.setItem("refreshToken", token);  // readable by any injected XSS script
// Better: keep the refresh token in an httpOnly cookie (set by the server,
// completely invisible to JavaScript) and hold only a short-lived access
// token in memory (a plain JS variable, gone on page reload).`,
      },
      keyTakeaways: [
        { en: "`localStorage`/`sessionStorage` share the same `setItem`/`getItem`/`removeItem`/`clear` API but differ in lifetime (forever vs per-tab); values are always strings, so objects need `JSON.stringify`/`JSON.parse`.", np: "`localStorage`/`sessionStorage` ले उही `setItem`/`getItem`/`removeItem`/`clear` API share गर्छन् तर lifetime (forever vs per-tab) मा फरक हुन्छन्; values सधैं strings हुन्छन्, त्यसैले objects लाई `JSON.stringify`/`JSON.parse` चाहिन्छ।", jp: "`localStorage`/`sessionStorage`は同じ`setItem`/`getItem`/`removeItem`/`clear`APIを共有するが、有効期間（永続 vs タブ単位）が異なる。値は常に文字列なので、オブジェクトには`JSON.stringify`/`JSON.parse`が必要。" },
        { en: "Both have a roughly 5-10MB per-origin quota (`QuotaExceededError` if exceeded); the `storage` event only fires in other tabs, never the tab that made the change.", np: "दुवैको roughly 5-10MB per-origin quota हुन्छ (exceed भएमा `QuotaExceededError`); `storage` event अन्य tabs मा मात्र fire हुन्छ, change गर्ने tab मा कहिल्यै फायर हुँदैन।", jp: "両方ともオリジンあたり約5-10MBのクォータがある（超えると`QuotaExceededError`）。`storage`イベントは他のタブでのみ発火し、変更したタブ自身では発火しない。" },
        { en: "Cookies are smaller but auto-sent with every request, `IndexedDB` handles large structured data; avoid storing long-lived sensitive tokens in `localStorage` (XSS risk) — prefer `httpOnly` cookies.", np: "Cookies साना हुन्छन् तर हरेक request सँग auto-sent हुन्छन्, `IndexedDB` ले large structured data handle गर्छ; `localStorage` (XSS risk) मा long-lived sensitive tokens राख्नबाट जोगिनुहोस् — `httpOnly` cookies prefer गर्नुहोस्।", jp: "Cookieは小さいが全リクエストで自動送信され、`IndexedDB`は大きな構造化データを扱う。`localStorage`（XSSリスク）に長期的な機密トークンを保存するのは避け、`httpOnly`Cookieを優先する。" },
      ],
      commonMistakes: [
        { en: "Storing an object or number directly without `JSON.stringify`, then getting back a coerced/broken string like `\"[object Object]\"`.", np: "`JSON.stringify` बिना object वा number directly store गर्नु, त्यसपछि `\"[object Object]\"` जस्तो coerced/broken string फर्किनु।", jp: "`JSON.stringify`せずにオブジェクトや数値を直接保存し、`\"[object Object]\"`のような変換された壊れた文字列が返ってくること。" },
        { en: "Expecting the `storage` event to fire in the same tab/window that made the change, when it only fires in other tabs of the same origin.", np: "`storage` event change गर्ने same tab/window मा नै fire हुनेछ भनी आशा गर्नु, जब यो same origin को अन्य tabs मा मात्र fire हुन्छ।", jp: "`storage`イベントが変更を行った同じタブ/ウィンドウで発火すると期待するが、実際は同一オリジンの他のタブでのみ発火すること。" },
        { en: "Storing a long-lived auth/refresh token in `localStorage`, exposing it to any injected XSS script instead of using an `httpOnly` cookie.", np: "`httpOnly` cookie प्रयोग गर्नुको सट्टा long-lived auth/refresh token `localStorage` मा store गर्नु, यसलाई injected XSS script मा exposed बनाउनु।", jp: "`httpOnly`Cookieを使う代わりに長期的な認証/リフレッシュトークンを`localStorage`に保存し、注入されたXSSスクリプトに晒すこと。" },
      ],
      quiz: [
        {
          question: { en: "What type are all `localStorage` keys and values, no matter what you originally pass in?", np: "मूलतः जुनसुकै type pass गरे पनि सबै `localStorage` keys र values कुन type हुन्छन्?", jp: "元々何を渡したかにかかわらず、すべての`localStorage`のキーと値はどの型になる？" },
          options: [
            { en: "Always strings", np: "सधैं strings", jp: "常に文字列" },
            { en: "Whatever type was originally passed in", np: "मूलतः जुन type pass गरिएको थियो त्यही", jp: "元々渡した型のまま" },
          ],
          correctIndex: 0,
          explanation: { en: "localStorage/sessionStorage coerce every key and value to a string; objects must be JSON.stringify'd first to survive round-tripping.", np: "localStorage/sessionStorage ले हरेक key र value लाई string मा coerce गर्छन्; objects बचाउन पहिले JSON.stringify गर्नुपर्छ।", jp: "localStorage/sessionStorageはすべてのキーと値を文字列に変換する。オブジェクトを正しく保存するには先にJSON.stringifyする必要がある。" },
        },
        {
          question: { en: "When is `sessionStorage` automatically cleared?", np: "`sessionStorage` automatic रूपमा कहिले clear हुन्छ?", jp: "`sessionStorage`はいつ自動的にクリアされる？" },
          options: [
            { en: "When the tab it belongs to is closed", np: "यो belong भएको tab बन्द हुँदा", jp: "それが属するタブが閉じられたとき" },
            { en: "Only when `clear()` is called manually", np: "`clear()` manually call गरेमा मात्र", jp: "手動で`clear()`が呼ばれたときのみ" },
          ],
          correctIndex: 0,
          explanation: { en: "sessionStorage is scoped to a single tab's session and is wiped automatically the moment that tab closes, unlike localStorage.", np: "sessionStorage एउटै tab को session मा scoped हुन्छ र त्यो tab बन्द भएको क्षणमै automatic रूपमा wipe हुन्छ, localStorage भन्दा फरक।", jp: "sessionStorageは単一タブのセッションにスコープされ、そのタブが閉じた瞬間に自動的にクリアされる。localStorageとは異なる。" },
        },
        {
          question: { en: "Which tab(s) receive the `window` `\"storage\"` event when `localStorage` is changed?", np: "`localStorage` change हुँदा `window` को `\"storage\"` event कुन tab(s) मा पाइन्छ?", jp: "`localStorage`が変更されたとき、`window`の`\"storage\"`イベントはどのタブで受け取られる？" },
          options: [
            { en: "Only other tabs of the same origin — never the tab that made the change", np: "Same origin को अन्य tabs मा मात्र — change गर्ने tab मा कहिल्यै होइन", jp: "同一オリジンの他のタブのみ — 変更を行ったタブでは決して発火しない" },
            { en: "Every tab, including the one that made the change", np: "सबै tabs, change गर्ने tab सहित", jp: "変更を行ったタブも含むすべてのタブ" },
          ],
          correctIndex: 0,
          explanation: { en: "The storage event deliberately excludes the originating tab, which is why it's used to sync state like a logout across other open tabs.", np: "Storage event ले originating tab लाई जानाजानी exclude गर्छ, त्यसैले यो अन्य खुला tabs मा logout जस्तो state sync गर्न प्रयोग हुन्छ।", jp: "storageイベントは意図的に発生元のタブを除外する。これが他の開いているタブでログアウトのような状態を同期するために使われる理由。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "Does `fetch` reject its promise for a `404` or `500` response?", np: "`fetch` ले `404` वा `500` response का लागि आफ्नो promise reject गर्छ?", jp: "`fetch`は`404`や`500`レスポンスに対してPromiseをrejectする？" },
      options: [{ en: "No — it resolves normally; check `response.ok`", np: "होइन — यो normally resolve हुन्छ; `response.ok` check गर्नुहोस्", jp: "しない — 正常にresolveする。`response.ok`を確認する" }, { en: "Yes — fetch always throws on 4xx/5xx status codes", np: "हो — fetch ले सधैं 4xx/5xx status codes मा throw गर्छ", jp: "する — fetchは常に4xx/5xxステータスコードでスローする" }],
      correctIndex: 0,
      explanation: { en: "fetch only rejects on network-level failures; any completed HTTP response, including error statuses, resolves the promise, so you must check response.ok yourself.", np: "fetch ले network-level failure मा मात्र reject गर्छ; error statuses सहित कुनै पनि completed HTTP response ले promise resolve गर्छ, त्यसैले आफैं response.ok check गर्नुपर्छ।", jp: "fetchはネットワークレベルの失敗でのみrejectする。エラーステータスを含むあらゆる完了したHTTPレスポンスはPromiseを解決するため、自分でresponse.okを確認する必要がある。" },
    },
    {
      question: { en: "How many times can a `Response` body be read without calling `clone()` first?", np: "पहिले `clone()` call नगरी `Response` body कति पटक read गर्न सकिन्छ?", jp: "先に`clone()`を呼ばずに`Response`のボディは何回読める？" },
      options: [{ en: "Once", np: "एकपटक", jp: "1回" }, { en: "Unlimited times", np: "असीमित पटक", jp: "無制限" }],
      correctIndex: 0,
      explanation: { en: "The response body is a stream that can only be consumed once; a second read without clone() throws an error.", np: "Response body एउटा stream हो जो एकपटक मात्र consume हुन सक्छ; clone() बिना दोस्रो पटक read गर्दा error आउँछ।", jp: "レスポンスボディは一度しか消費できないストリームであり、clone()なしで2回目に読むとエラーになる。" },
    },
    {
      question: { en: "What must a `POST` request set so the server knows the body is JSON?", np: "Server ले body JSON हो भनेर थाहा पाउन `POST` request मा के set गर्नुपर्छ?", jp: "サーバーがボディがJSONであると認識するために`POST`リクエストで何を設定する必要がある？" },
      options: [{ en: "A `Content-Type: application/json` header", np: "`Content-Type: application/json` header", jp: "`Content-Type: application/json`ヘッダー" }, { en: "Nothing — fetch detects it automatically", np: "केही छैन — fetch ले automatic रूपमा detect गर्छ", jp: "何もない — fetchが自動で検出する" }],
      correctIndex: 0,
      explanation: { en: "fetch never inspects or serializes the body for you; the Content-Type header plus a JSON.stringify'd body is required.", np: "fetch ले body कहिल्यै आफैं inspect वा serialize गर्दैन; Content-Type header र JSON.stringify गरिएको body दुवै चाहिन्छ।", jp: "fetchはボディを自動で検査・シリアライズすることはない。Content-TypeヘッダーとJSON.stringifyされたボディの両方が必要。" },
    },
    {
      question: { en: "What is the `.name` of the error a `fetch` promise rejects with after `controller.abort()` is called?", np: "`controller.abort()` call गरेपछि `fetch` promise कुन `.name` भएको error सँग reject हुन्छ?", jp: "`controller.abort()`が呼ばれた後、`fetch`のPromiseはどの`.name`のエラーでrejectする？" },
      options: [{ en: "`\"AbortError\"`", np: "`\"AbortError\"`", jp: "`\"AbortError\"`" }, { en: "`\"TypeError\"`", np: "`\"TypeError\"`", jp: "`\"TypeError\"`" }],
      correctIndex: 0,
      explanation: { en: "Aborting a fetch always produces an error named AbortError, letting you distinguish an intentional cancellation from a real failure.", np: "Fetch abort गर्दा सधैं AbortError नाम भएको error उत्पन्न हुन्छ, जसले जानाजानी गरेको cancellation लाई real failure बाट छुट्याउन दिन्छ।", jp: "fetchをabortすると常にAbortErrorという名前のエラーが生成され、意図的なキャンセルと本当の失敗を区別できる。" },
    },
    {
      question: { en: "Where should `controller.abort()` be called to stop a React component from setting state after it unmounts?", np: "Component unmount भएपछि state set हुनबाट रोक्न `controller.abort()` कहाँ call गर्नुपर्छ?", jp: "コンポーネントがアンマウントされた後にstateが設定されるのを止めるには、`controller.abort()`をどこで呼ぶべき？" },
      options: [{ en: "In the cleanup function returned from `useEffect`", np: "`useEffect` बाट return हुने cleanup function मा", jp: "`useEffect`から返されるクリーンアップ関数の中" }, { en: "In the `.then()` success callback", np: "`.then()` success callback मा", jp: "`.then()`の成功コールバックの中" }],
      correctIndex: 0,
      explanation: { en: "React runs the effect's cleanup automatically on unmount or before the next run, making it the right place to cancel a pending request.", np: "React ले effect को cleanup unmount मा वा अर्को run अघि automatic रूपमा चलाउँछ, जसले pending request cancel गर्ने सहि ठाउँ बनाउँछ।", jp: "Reactはアンマウント時または次の実行前にエフェクトのクリーンアップを自動実行するため、保留中のリクエストをキャンセルする正しい場所となる。" },
    },
    {
      question: { en: "What type are all `localStorage` values stored as, regardless of what you pass to `setItem`?", np: "`setItem` मा जे pass गरे पनि सबै `localStorage` values कुन type मा store हुन्छन्?", jp: "`setItem`に何を渡しても、すべての`localStorage`の値はどの型で保存される？" },
      options: [{ en: "Strings", np: "Strings", jp: "文字列" }, { en: "Whatever type was originally passed in", np: "मूलतः जुन type pass गरिएको थियो त्यही", jp: "元々渡した型のまま" }],
      correctIndex: 0,
      explanation: { en: "localStorage coerces every value to a string; objects must be JSON.stringify'd before storing and JSON.parse'd after reading.", np: "localStorage ले हरेक value लाई string मा coerce गर्छ; objects store गर्नु अघि JSON.stringify र read गरेपछि JSON.parse गर्नुपर्छ।", jp: "localStorageはすべての値を文字列に変換する。オブジェクトは保存前にJSON.stringify、読み取り後にJSON.parseする必要がある。" },
    },
    {
      question: { en: "Which tab(s) receive the `window` `\"storage\"` event when `localStorage` changes?", np: "`localStorage` change हुँदा `window` को `\"storage\"` event कुन tab(s) मा पाइन्छ?", jp: "`localStorage`が変更されたとき、`window`の`\"storage\"`イベントはどのタブで受け取られる？" },
      options: [{ en: "Only other tabs of the same origin", np: "Same origin को अन्य tabs मा मात्र", jp: "同一オリジンの他のタブのみ" }, { en: "All tabs, including the one that made the change", np: "सबै tabs, change गर्ने tab सहित", jp: "変更を行ったタブも含むすべてのタブ" }],
      correctIndex: 0,
      explanation: { en: "The storage event deliberately never fires in the tab that made the change, which is why it's used to sync state like a logout across other open tabs.", np: "Storage event change गर्ने tab मा जानाजानी कहिल्यै fire हुँदैन, त्यसैले यो अन्य खुला tabs मा logout जस्तो state sync गर्न प्रयोग हुन्छ।", jp: "storageイベントは変更を行ったタブでは意図的に発火しない。これが他の開いているタブでログアウトのような状態を同期するために使われる理由。" },
    },
    {
      question: { en: "Why should a long-lived refresh token generally NOT be stored in `localStorage`?", np: "Long-lived refresh token लाई सामान्यतया `localStorage` मा किन store गर्नु हुँदैन?", jp: "長期的なリフレッシュトークンを一般的に`localStorage`に保存すべきでない理由は？" },
      options: [{ en: "Any injected XSS script can freely read localStorage", np: "जुनसुकै injected XSS script ले localStorage freely read गर्न सक्छ", jp: "注入されたXSSスクリプトがlocalStorageを自由に読めるため" }, { en: "localStorage values get cleared too frequently", np: "localStorage values धेरै बारम्बार clear हुन्छन्", jp: "localStorageの値が頻繁にクリアされすぎるため" }],
      correctIndex: 0,
      explanation: { en: "Because localStorage is readable by any JavaScript on the page, an XSS vulnerability exposes long-lived tokens; httpOnly cookies are safer since JavaScript cannot read them at all.", np: "localStorage page मा चल्ने जुनसुकै JavaScript ले read गर्न सक्ने भएकोले, XSS vulnerability ले long-lived tokens expose गर्छ; httpOnly cookies बढी सुरक्षित छन् किनकि JavaScript ले तिनलाई बिल्कुल read गर्न सक्दैन।", jp: "localStorageはページ上の任意のJavaScriptから読めるため、XSS脆弱性が長期的なトークンを晒してしまう。httpOnly CookieはJavaScriptが一切読めないためより安全。" },
    },
  ],
};
