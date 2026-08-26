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
            { en: "A `Promise` that resolves to a `Response`", np: "`Response` मा resolve हुने `Promise`", jp: "`Response` に解決される `Promise`" },
            { en: "A `Response`", np: "एउटा `Response`", jp: "`Response`" },
            { en: "A JSON object", np: "एउटा JSON object", jp: "JSONオブジェクト" },
            { en: "A string", np: "एउटा string", jp: "文字列" },
          ],
          correctIndex: 0,
          explanation: { en: "That is why `fetch()` pairs naturally with `await`.", np: "त्यसैले `fetch()` `await` सँग स्वाभाविक रूपमा मिल्छ।", jp: "だから `fetch()` は `await` と自然に組み合わさる。" },
        },
        {
          question: { en: "What happens when the server returns `404`?", np: "Server ले `404` फर्काउँदा के हुन्छ?", jp: "サーバーが `404` を返すとどうなるか?" },
          options: [
            { en: "`fetch()` always rejects", np: "`fetch()` सधैं reject हुन्छ", jp: "`fetch()` は必ず拒否される" },
            { en: "`fetch()` resolves with `response.ok === false`", np: "`response.ok === false` सहित `fetch()` resolve हुन्छ", jp: "`response.ok === false` で解決される" },
            { en: "The browser crashes", np: "Browser crash हुन्छ", jp: "ブラウザがクラッシュする" },
            { en: "`fetch()` retries automatically", np: "`fetch()` आफैं फेरि प्रयास गर्छ", jp: "`fetch()` が自動で再試行する" },
          ],
          correctIndex: 1,
          explanation: { en: "Only network-level failures reject the promise.", np: "Network-स्तरका असफलताले मात्र promise reject गर्छन्।", jp: "Promiseを拒否するのはネットワークレベルの失敗だけ。" },
        },
        {
          question: { en: "How do you parse a JSON response?", np: "JSON response कसरी parse गर्ने?", jp: "JSONレスポンスはどう解析するか?" },
          options: [
            { en: "`response.parse()`", np: "`response.parse()`", jp: "`response.parse()`" },
            { en: "`JSON.parse(response)`", np: "`JSON.parse(response)`", jp: "`JSON.parse(response)`" },
            { en: "`response.json()`", np: "`response.json()`", jp: "`response.json()`" },
            { en: "`response.data()`", np: "`response.data()`", jp: "`response.data()`" },
          ],
          correctIndex: 2,
          explanation: { en: "It returns a promise, so it needs its own `await`.", np: "यसले promise फर्काउँछ, त्यसैले छुट्टै `await` चाहिन्छ।", jp: "Promiseを返すので、それ自体に `await` が要る。" },
        },
        {
          question: { en: "Why use `JSON.stringify()` when sending JSON?", np: "JSON पठाउँदा `JSON.stringify()` किन प्रयोग गर्ने?", jp: "JSONを送るとき `JSON.stringify()` を使う理由は?" },
          options: [
            { en: "To encrypt the request", np: "Request encrypt गर्न", jp: "リクエストを暗号化するため" },
            { en: "To create a Promise", np: "Promise बनाउन", jp: "Promiseを作るため" },
            { en: "To parse the response", np: "Response parse गर्न", jp: "レスポンスを解析するため" },
            { en: "To convert a JavaScript object into a JSON string", np: "JavaScript object लाई JSON string बनाउन", jp: "JavaScriptオブジェクトをJSON文字列に変換するため" },
          ],
          correctIndex: 3,
          explanation: { en: "`fetch()` does not serialize the body for you.", np: "`fetch()` ले तपाईंका लागि body serialize गर्दैन।", jp: "`fetch()` は本文を代わりに直列化してくれない。" },
        },
        {
          question: { en: "What happens when `response.json()` is called twice on the same response?", np: "एउटै response मा `response.json()` दुई पटक बोलाउँदा के हुन्छ?", jp: "同じレスポンスで `response.json()` を2回呼ぶとどうなるか?" },
          options: [
            { en: "The second consumption fails", np: "दोस्रो खपत असफल हुन्छ", jp: "2回目の消費が失敗する" },
            { en: "The second returns the same data", np: "दोस्रोले उही data फर्काउँछ", jp: "2回目も同じデータを返す" },
            { en: "Both calls work", np: "दुबै call काम गर्छन्", jp: "両方とも動く" },
            { en: "The request runs twice", np: "Request दुई पटक चल्छ", jp: "リクエストが2回走る" },
          ],
          correctIndex: 0,
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
            { en: "`controller.abort()`", np: "`controller.abort()`", jp: "`controller.abort()`" },
            { en: "`signal.cancel()`", np: "`signal.cancel()`", jp: "`signal.cancel()`" },
            { en: "`fetch.cancel()`", np: "`fetch.cancel()`", jp: "`fetch.cancel()`" },
          ],
          correctIndex: 1,
          explanation: { en: "The signal only reports the state; the controller triggers it.", np: "Signal ले अवस्था मात्र बताउँछ; controller ले सुरु गर्छ।", jp: "シグナルは状態を伝えるだけで、起こすのはコントローラー。" },
        },
        {
          question: { en: "What must be passed to `fetch()` to connect it to an `AbortController`?", np: "`fetch()` लाई `AbortController` सँग जोड्न के पास गर्नुपर्छ?", jp: "`fetch()` を `AbortController` につなぐには何を渡すか?" },
          options: [
            { en: "`controller`", np: "`controller`", jp: "`controller`" },
            { en: "`controller.abort`", np: "`controller.abort`", jp: "`controller.abort`" },
            { en: "`controller.signal`", np: "`controller.signal`", jp: "`controller.signal`" },
            { en: "`AbortController.signal`", np: "`AbortController.signal`", jp: "`AbortController.signal`" },
          ],
          correctIndex: 2,
          explanation: { en: "Without the signal, `abort()` has nothing to cancel.", np: "Signal नभए, `abort()` सँग रद्द गर्ने केही हुँदैन।", jp: "シグナルがなければ `abort()` に中止する対象がない。" },
        },
        {
          question: { en: "What does a cancelled `fetch()` normally reject with?", np: "रद्द भएको `fetch()` सामान्यतया केसँग reject हुन्छ?", jp: "中止された `fetch()` は通常どれで拒否されるか?" },
          options: [
            { en: "`TimeoutError`", np: "`TimeoutError`", jp: "`TimeoutError`" },
            { en: "`NetworkError`", np: "`NetworkError`", jp: "`NetworkError`" },
            { en: "`CancelError`", np: "`CancelError`", jp: "`CancelError`" },
            { en: "`AbortError`", np: "`AbortError`", jp: "`AbortError`" },
          ],
          correctIndex: 3,
          explanation: { en: "Check `error.name` to tell cancellation from a real failure.", np: "वास्तविक असफलता र cancellation छुट्याउन `error.name` जाँच्नुहोस्।", jp: "本当の失敗と区別するには `error.name` を確認する。" },
        },
        {
          question: { en: "Why is cancellation useful for a search box?", np: "Search box का लागि cancellation किन उपयोगी छ?", jp: "検索ボックスでキャンセルが役立つ理由は?" },
          options: [
            { en: "It prevents older requests from overwriting newer results", np: "यसले पुराना request ले नयाँ नतिजा मेट्नबाट रोक्छ", jp: "古いリクエストが新しい結果を上書きするのを防ぐから" },
            { en: "It makes HTTP requests synchronous", np: "यसले HTTP request synchronous बनाउँछ", jp: "HTTPリクエストが同期になるから" },
            { en: "It makes the server respond faster", np: "यसले server लाई छिटो जवाफ दिन लगाउँछ", jp: "サーバーの応答が速くなるから" },
            { en: "It caches results automatically", np: "यसले नतिजा स्वतः cache गर्छ", jp: "結果を自動でキャッシュするから" },
          ],
          correctIndex: 0,
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
        en: "<b>Web Storage</b> provides two browser APIs for storing small amounts of client-side data:\n\n• <b>`localStorage`</b> — data survives page reloads, tab closes and browser restarts.\n• <b>`sessionStorage`</b> — data lasts only for the current browser tab session.\n\nBoth use the same simple key-value API:\n\n```javascript\nlocalStorage.setItem(\"theme\", \"dark\");\n\nconst theme = localStorage.getItem(\"theme\");\n\nlocalStorage.removeItem(\"theme\");\n\nlocalStorage.clear();\n```\n\nThe most important rule:\n\n> <b>Web Storage stores strings only.</b>\n\nIf you store an object directly, JavaScript converts it to a string, which is almost never what you want.\n\n---\n\n### 1. Basic — store and retrieve values\n\n```javascript\nlocalStorage.setItem(\"username\", \"Rajan\");\n\nconst username = localStorage.getItem(\"username\");\n\nconsole.log(username); // \"Rajan\"\n```\n\nEverything comes back as a string:\n\n```javascript\nlocalStorage.setItem(\"age\", 30);\n\nconst age = localStorage.getItem(\"age\");\n\nconsole.log(age);        // \"30\"\nconsole.log(typeof age); // \"string\"\n```\n\nA missing key returns `null`:\n\n```javascript\nconsole.log(localStorage.getItem(\"missing\")); // null\n```\n\n---\n\n### 2. Intermediate — storing objects with JSON\n\nYou cannot store an object and expect it back as an object:\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n\nlocalStorage.setItem(\"user\", user);\n\nconsole.log(localStorage.getItem(\"user\")); // \"[object Object]\"\n```\n\nSerialize when saving and parse when reading:\n\n```javascript\nlocalStorage.setItem(\"user\", JSON.stringify(user));\n\nconst storedUser = localStorage.getItem(\"user\");\n\nconst parsed = JSON.parse(storedUser);\n\nconsole.log(parsed.name); // \"Rajan\"\n```\n\nThe complete round trip:\n\n```text\nJavaScript object\n      │\n      ↓ JSON.stringify()\n    String\n      │\n      ↓ setItem()\n localStorage\n      │\n      ↓ getItem()\n    String\n      │\n      ↓ JSON.parse()\nJavaScript object\n```\n\n---\n\n### 3. Advanced — safely reading stored JSON\n\nStored data can be missing or corrupted, so production code should not call `JSON.parse()` blindly.\n\n```javascript\nfunction getUser() {\n  const stored = localStorage.getItem(\"user\");\n\n  if (!stored) {\n    return null;\n  }\n\n  try {\n    return JSON.parse(stored);\n  } catch {\n    localStorage.removeItem(\"user\");\n    return null;\n  }\n}\n\nconst user = getUser();\n```\n\nThis stops malformed storage data from crashing the application.\n\n---\n\n### `localStorage` vs `sessionStorage`\n\nThe APIs are almost identical; the difference is lifetime and scope.\n\n```text\n                      localStorage       sessionStorage\nPage reload           persists           persists\nClose the tab         persists           removed\nBrowser restart       persists           removed\nScope                 origin             origin + tab\nAPI                   same               same\nGood for              preferences        temporary tab state\n```\n\n```javascript\nlocalStorage.setItem(\"theme\", \"dark\");           // a user preference\n\nsessionStorage.setItem(\"checkoutStep\", \"payment\"); // only for this tab\n```\n\n---\n\n### Key methods\n\nBoth APIs share the same methods:\n\n```javascript\nstorage.setItem(key, value); // stores a string\nstorage.getItem(key);        // returns the string, or null\nstorage.removeItem(key);     // removes one key\nstorage.clear();             // removes everything for that origin\nstorage.length;              // number of stored keys\nstorage.key(index);          // the key at an index\n```\n\n```javascript\nlocalStorage.setItem(\"name\", \"Rajan\");\nlocalStorage.setItem(\"theme\", \"dark\");\n\nconsole.log(localStorage.length); // 2\nconsole.log(localStorage.key(0)); // \"name\" — ordering is not guaranteed\n```\n\n---\n\n### The `storage` event\n\nThe browser fires a `storage` event that can synchronise state between tabs of the same origin.\n\n```javascript\nwindow.addEventListener(\"storage\", event => {\n  console.log(\"Key:\", event.key);\n  console.log(\"Old value:\", event.oldValue);\n  console.log(\"New value:\", event.newValue);\n});\n```\n\n```text\nTab A                         Tab B\n  │                             │\n  │ localStorage.setItem()      │\n  │                             │\n  └────────────────────────────→│\n                                │\n                         storage event\n```\n\n> <b>The tab that makes the change does not receive its own `storage` event.</b>\n\nThat is exactly what makes it useful for cross-tab work. Logging out in one tab can push another tab to the login page:\n\n```javascript\nwindow.addEventListener(\"storage\", event => {\n  if (event.key === \"loggedIn\" && event.newValue === \"false\") {\n    window.location.href = \"/login\";\n  }\n});\n```\n\n---\n\n### Web Storage vs cookies vs IndexedDB\n\n```text\n                        Web Storage    Cookies         IndexedDB\nStorage size            ~5-10 MB       ~4 KB each      much larger\nData type               strings        strings         structured data\nSent to the server      no             yes             no\nAsync API               no             no              yes\nComplex queries         no             no              yes\nGood for                small UI state server state    large offline data\n```\n\nUse Web Storage for small pieces of client-side state, and IndexedDB when you need a real client-side database or substantial offline storage. Cookies differ because matching cookies are attached to HTTP requests automatically.\n\n---\n\n### Security — do not treat storage as a vault\n\nJavaScript on the page can read `localStorage.getItem(\"token\")`. So if an attacker gets JavaScript to run through an <b>XSS vulnerability</b>, that code can read your storage too.\n\nThat is why <b>long-lived sensitive credentials such as refresh tokens generally should not live in `localStorage`</b>. An `HttpOnly` cookie has a property storage cannot match:\n\n```text\nJavaScript\n    │\n    ├── localStorage → can read\n    │\n    └── HttpOnly cookie → cannot read\n```\n\nThe browser still sends an `HttpOnly` cookie with the right requests, but `document.cookie` cannot see its value. A common split:\n\n```text\nNon-sensitive UI state\n        ↓\nlocalStorage / sessionStorage\n\nLong-lived sensitive credential\n        ↓\nSecure + HttpOnly cookie\n```\n\nReal decisions also involve `Secure`, `SameSite`, CSRF protection and your authentication architecture.\n\n---\n\n### Storage can fail\n\nStorage has browser-enforced quotas, and exceeding one throws:\n\n```javascript\ntry {\n  localStorage.setItem(\"largeData\", hugeString);\n} catch (error) {\n  if (error.name === \"QuotaExceededError\") {\n    console.log(\"Storage quota exceeded\");\n  }\n}\n```\n\nProduction code that writes large values should handle this.",
        np: "<b>Web Storage</b> ले client-side मा सानो मात्रामा data राख्ने दुई browser API दिन्छ:\n\n• <b>`localStorage`</b> — data page reload, tab बन्द र browser restart पछि पनि रहन्छ।\n• <b>`sessionStorage`</b> — data हालको browser tab session सम्म मात्र रहन्छ।\n\nदुबैले उही सरल key-value API प्रयोग गर्छन्:\n\n```javascript\nlocalStorage.setItem(\"theme\", \"dark\");\n\nconst theme = localStorage.getItem(\"theme\");\n\nlocalStorage.removeItem(\"theme\");\n\nlocalStorage.clear();\n```\n\nसबैभन्दा महत्वपूर्ण नियम:\n\n> <b>Web Storage ले string मात्र राख्छ।</b>\n\nObject सिधै राख्दा JavaScript ले त्यसलाई string बनाइदिन्छ, जुन प्रायः तपाईंले चाहेको हुँदैन।\n\n---\n\n### 1. आधारभूत — मान राख्नु र झिक्नु\n\n```javascript\nlocalStorage.setItem(\"username\", \"Rajan\");\n\nconst username = localStorage.getItem(\"username\");\n\nconsole.log(username); // \"Rajan\"\n```\n\nसबै कुरा string भएर फर्किन्छ:\n\n```javascript\nlocalStorage.setItem(\"age\", 30);\n\nconst age = localStorage.getItem(\"age\");\n\nconsole.log(age);        // \"30\"\nconsole.log(typeof age); // \"string\"\n```\n\nनभएको key ले `null` फर्काउँछ:\n\n```javascript\nconsole.log(localStorage.getItem(\"missing\")); // null\n```\n\n---\n\n### 2. मध्यम — JSON सँग object राख्नु\n\nObject राखेर object नै फर्कने अपेक्षा गर्न मिल्दैन:\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n\nlocalStorage.setItem(\"user\", user);\n\nconsole.log(localStorage.getItem(\"user\")); // \"[object Object]\"\n```\n\nराख्दा serialize गर्नुहोस्, पढ्दा parse:\n\n```javascript\nlocalStorage.setItem(\"user\", JSON.stringify(user));\n\nconst storedUser = localStorage.getItem(\"user\");\n\nconst parsed = JSON.parse(storedUser);\n\nconsole.log(parsed.name); // \"Rajan\"\n```\n\nपूरा चक्र:\n\n```text\nJavaScript object\n      │\n      ↓ JSON.stringify()\n    String\n      │\n      ↓ setItem()\n localStorage\n      │\n      ↓ getItem()\n    String\n      │\n      ↓ JSON.parse()\nJavaScript object\n```\n\n---\n\n### 3. उन्नत — राखिएको JSON सुरक्षित रूपमा पढ्नु\n\nData हराउन वा बिग्रिन सक्छ, त्यसैले production code ले आँखा चिम्लेर `JSON.parse()` बोलाउनु हुँदैन।\n\n```javascript\nfunction getUser() {\n  const stored = localStorage.getItem(\"user\");\n\n  if (!stored) {\n    return null;\n  }\n\n  try {\n    return JSON.parse(stored);\n  } catch {\n    localStorage.removeItem(\"user\");\n    return null;\n  }\n}\n\nconst user = getUser();\n```\n\nयसले बिग्रिएको storage data ले application crash गर्नबाट रोक्छ।\n\n---\n\n### `localStorage` vs `sessionStorage`\n\nAPI झन्डै उस्तै छन्; भिन्नता आयु र दायरामा छ।\n\n```text\n                      localStorage       sessionStorage\nPage reload           रहन्छ              रहन्छ\nTab बन्द              रहन्छ              हट्छ\nBrowser restart       रहन्छ              हट्छ\nदायरा                 origin             origin + tab\nAPI                   उही                उही\nउपयुक्त               preference         अस्थायी tab state\n```\n\n```javascript\nlocalStorage.setItem(\"theme\", \"dark\");           // user को रुचि\n\nsessionStorage.setItem(\"checkoutStep\", \"payment\"); // यही tab का लागि मात्र\n```\n\n---\n\n### मुख्य method\n\nदुबै API मा उही method छन्:\n\n```javascript\nstorage.setItem(key, value); // string राख्छ\nstorage.getItem(key);        // string, वा null फर्काउँछ\nstorage.removeItem(key);     // एउटा key हटाउँछ\nstorage.clear();             // त्यो origin को सबै हटाउँछ\nstorage.length;              // राखिएका key को संख्या\nstorage.key(index);          // index मा भएको key\n```\n\n```javascript\nlocalStorage.setItem(\"name\", \"Rajan\");\nlocalStorage.setItem(\"theme\", \"dark\");\n\nconsole.log(localStorage.length); // 2\nconsole.log(localStorage.key(0)); // \"name\" — क्रमको ग्यारेन्टी छैन\n```\n\n---\n\n### `storage` event\n\nBrowser ले `storage` event पठाउँछ जसले एउटै origin का tab बीच state मिलाउन सक्छ।\n\n```javascript\nwindow.addEventListener(\"storage\", event => {\n  console.log(\"Key:\", event.key);\n  console.log(\"Old value:\", event.oldValue);\n  console.log(\"New value:\", event.newValue);\n});\n```\n\n```text\nTab A                         Tab B\n  │                             │\n  │ localStorage.setItem()      │\n  │                             │\n  └────────────────────────────→│\n                                │\n                         storage event\n```\n\n> <b>परिवर्तन गर्ने tab ले आफ्नै `storage` event पाउँदैन।</b>\n\nत्यसैले यो cross-tab काममा उपयोगी छ। एउटा tab मा logout गर्दा अर्को tab लाई login page मा पठाउन सकिन्छ:\n\n```javascript\nwindow.addEventListener(\"storage\", event => {\n  if (event.key === \"loggedIn\" && event.newValue === \"false\") {\n    window.location.href = \"/login\";\n  }\n});\n```\n\n---\n\n### Web Storage vs cookie vs IndexedDB\n\n```text\n                        Web Storage    Cookie          IndexedDB\nआकार                    ~5-10 MB       प्रति ~4 KB      धेरै ठूलो\nData प्रकार             string         string          संरचित data\nServer मा पठाइन्छ?      पठाइँदैन       पठाइन्छ         पठाइँदैन\nAsync API               छैन            छैन             छ\nजटिल query              छैन            छैन             छ\nउपयुक्त                 सानो UI state  server state    ठूलो offline data\n```\n\nसानो client-side state का लागि Web Storage, र साँच्चै client-side database वा ठूलो offline भण्डारण चाहिँदा IndexedDB प्रयोग गर्नुहोस्। Cookie फरक छ किनकि मिल्ने cookie HTTP request सँग स्वतः जान्छन्।\n\n---\n\n### सुरक्षा — storage लाई तिजोरी नठान्नुहोस्\n\nPage को JavaScript ले `localStorage.getItem(\"token\")` पढ्न सक्छ। त्यसैले <b>XSS भेद्यता</b> मार्फत हमलावरले JavaScript चलाउन पाए, त्यो code ले तपाईंको storage पनि पढ्न सक्छ।\n\nत्यसैले <b>refresh token जस्ता दीर्घकालीन संवेदनशील credential सामान्यतया `localStorage` मा राख्नु हुँदैन</b>। `HttpOnly` cookie सँग storage ले दिन नसक्ने गुण छ:\n\n```text\nJavaScript\n    │\n    ├── localStorage → पढ्न सक्छ\n    │\n    └── HttpOnly cookie → पढ्न सक्दैन\n```\n\nBrowser ले `HttpOnly` cookie उपयुक्त request सँग पठाइरहन्छ, तर `document.cookie` ले यसको मान देख्दैन। सामान्य विभाजन:\n\n```text\nसंवेदनशील नभएको UI state\n        ↓\nlocalStorage / sessionStorage\n\nदीर्घकालीन संवेदनशील credential\n        ↓\nSecure + HttpOnly cookie\n```\n\nवास्तविक निर्णयमा `Secure`, `SameSite`, CSRF सुरक्षा र तपाईंको authentication संरचना पनि जोडिन्छ।\n\n---\n\n### Storage असफल हुन सक्छ\n\nStorage मा browser ले तोकेको quota हुन्छ, र नाघ्दा error आउँछ:\n\n```javascript\ntry {\n  localStorage.setItem(\"largeData\", hugeString);\n} catch (error) {\n  if (error.name === \"QuotaExceededError\") {\n    console.log(\"Storage quota exceeded\");\n  }\n}\n```\n\nठूलो मान लेख्ने production code ले यो सम्हाल्नुपर्छ।",
        jp: "<b>Web Storage</b> は、少量のクライアント側データを保存する2つのブラウザAPIです:\n\n• <b>`localStorage`</b> — 再読み込み・タブを閉じる・ブラウザ再起動をまたいで残る。\n• <b>`sessionStorage`</b> — 現在のタブのセッションの間だけ残る。\n\nどちらも同じ単純なキーと値のAPIです:\n\n```javascript\nlocalStorage.setItem(\"theme\", \"dark\");\n\nconst theme = localStorage.getItem(\"theme\");\n\nlocalStorage.removeItem(\"theme\");\n\nlocalStorage.clear();\n```\n\n最も重要な規則:\n\n> <b>Web Storageが保存できるのは文字列だけ。</b>\n\nオブジェクトをそのまま入れるとJavaScriptが文字列に変換してしまい、ほぼ望んだ結果になりません。\n\n---\n\n### 1. 基本 — 保存と取得\n\n```javascript\nlocalStorage.setItem(\"username\", \"Rajan\");\n\nconst username = localStorage.getItem(\"username\");\n\nconsole.log(username); // \"Rajan\"\n```\n\nすべて文字列で戻ります:\n\n```javascript\nlocalStorage.setItem(\"age\", 30);\n\nconst age = localStorage.getItem(\"age\");\n\nconsole.log(age);        // \"30\"\nconsole.log(typeof age); // \"string\"\n```\n\n存在しないキーは `null` です:\n\n```javascript\nconsole.log(localStorage.getItem(\"missing\")); // null\n```\n\n---\n\n### 2. 中級 — JSONでオブジェクトを保存する\n\nオブジェクトを入れてオブジェクトのまま戻ることは期待できません:\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n\nlocalStorage.setItem(\"user\", user);\n\nconsole.log(localStorage.getItem(\"user\")); // \"[object Object]\"\n```\n\n保存時に直列化し、読み取り時に解析します:\n\n```javascript\nlocalStorage.setItem(\"user\", JSON.stringify(user));\n\nconst storedUser = localStorage.getItem(\"user\");\n\nconst parsed = JSON.parse(storedUser);\n\nconsole.log(parsed.name); // \"Rajan\"\n```\n\n往復の全体像:\n\n```text\nJavaScript object\n      │\n      ↓ JSON.stringify()\n    String\n      │\n      ↓ setItem()\n localStorage\n      │\n      ↓ getItem()\n    String\n      │\n      ↓ JSON.parse()\nJavaScript object\n```\n\n---\n\n### 3. 上級 — 保存済みJSONを安全に読む\n\nデータは欠けたり壊れたりします。本番のコードは無条件に `JSON.parse()` を呼ぶべきではありません。\n\n```javascript\nfunction getUser() {\n  const stored = localStorage.getItem(\"user\");\n\n  if (!stored) {\n    return null;\n  }\n\n  try {\n    return JSON.parse(stored);\n  } catch {\n    localStorage.removeItem(\"user\");\n    return null;\n  }\n}\n\nconst user = getUser();\n```\n\n壊れた保存データでアプリが落ちるのを防げます。\n\n---\n\n### `localStorage` と `sessionStorage`\n\nAPIはほぼ同じで、違うのは寿命と範囲です。\n\n```text\n                      localStorage       sessionStorage\n再読み込み            残る               残る\nタブを閉じる          残る               消える\nブラウザ再起動        残る               消える\n範囲                  オリジン           オリジン + タブ\nAPI                   同じ               同じ\n向いている用途        設定               一時的なタブの状態\n```\n\n```javascript\nlocalStorage.setItem(\"theme\", \"dark\");           // ユーザーの好み\n\nsessionStorage.setItem(\"checkoutStep\", \"payment\"); // このタブだけ\n```\n\n---\n\n### 主なメソッド\n\n両者は同じメソッドを持ちます:\n\n```javascript\nstorage.setItem(key, value); // 文字列を保存\nstorage.getItem(key);        // 文字列、なければnull\nstorage.removeItem(key);     // キーを1つ削除\nstorage.clear();             // そのオリジンの全件を削除\nstorage.length;              // 保存されたキーの数\nstorage.key(index);          // その位置のキー\n```\n\n```javascript\nlocalStorage.setItem(\"name\", \"Rajan\");\nlocalStorage.setItem(\"theme\", \"dark\");\n\nconsole.log(localStorage.length); // 2\nconsole.log(localStorage.key(0)); // \"name\" — 順序は保証されない\n```\n\n---\n\n### `storage` イベント\n\nブラウザは `storage` イベントを発火し、同じオリジンのタブ間で状態を同期できます。\n\n```javascript\nwindow.addEventListener(\"storage\", event => {\n  console.log(\"Key:\", event.key);\n  console.log(\"Old value:\", event.oldValue);\n  console.log(\"New value:\", event.newValue);\n});\n```\n\n```text\nTab A                         Tab B\n  │                             │\n  │ localStorage.setItem()      │\n  │                             │\n  └────────────────────────────→│\n                                │\n                         storage event\n```\n\n> <b>変更を行ったタブ自身は `storage` イベントを受け取らない。</b>\n\nだからこそタブ間の同期に使えます。片方のタブでログアウトすると、もう一方をログイン画面へ送れます:\n\n```javascript\nwindow.addEventListener(\"storage\", event => {\n  if (event.key === \"loggedIn\" && event.newValue === \"false\") {\n    window.location.href = \"/login\";\n  }\n});\n```\n\n---\n\n### Web Storage・クッキー・IndexedDB\n\n```text\n                        Web Storage    クッキー        IndexedDB\n容量                    ~5-10 MB       1つ~4 KB        はるかに大きい\nデータ型                文字列         文字列          構造化データ\nサーバーへ自動送信      されない       される          されない\n非同期API               ない           ない            ある\n複雑なクエリ            不可           不可            可能\n向いている用途          小さなUI状態   サーバー状態    大きなオフラインデータ\n```\n\n小さなクライアント状態にはWeb Storage、本格的なクライアントDBや大きなオフライン保存にはIndexedDBを使います。クッキーは、条件に合うものがHTTPリクエストへ自動的に付く点で異なります。\n\n---\n\n### セキュリティ — 保管庫ではない\n\nページ上のJavaScriptは `localStorage.getItem(\"token\")` を読めます。つまり<b>XSSの脆弱性</b>で攻撃者のJavaScriptが動けば、その保存内容も読まれます。\n\nだから<b>リフレッシュトークンのような長命で機微な資格情報は、原則 `localStorage` に置かない</b>べきです。`HttpOnly` クッキーにはストレージにない性質があります:\n\n```text\nJavaScript\n    │\n    ├── localStorage → 読める\n    │\n    └── HttpOnly cookie → 読めない\n```\n\nブラウザは `HttpOnly` クッキーを適切なリクエストに付けて送りますが、`document.cookie` からは値が見えません。よくある切り分け:\n\n```text\n機微でないUIの状態\n        ↓\nlocalStorage / sessionStorage\n\n長命で機微な資格情報\n        ↓\nSecure + HttpOnly cookie\n```\n\n実際の判断には `Secure`・`SameSite`・CSRF対策・認証設計も関わります。\n\n---\n\n### 保存は失敗しうる\n\nストレージにはブラウザの割当があり、超えると例外になります:\n\n```javascript\ntry {\n  localStorage.setItem(\"largeData\", hugeString);\n} catch (error) {\n  if (error.name === \"QuotaExceededError\") {\n    console.log(\"Storage quota exceeded\");\n  }\n}\n```\n\n大きな値を書く本番コードはこれを扱うべきです。",
      },
      diagram: `                    Web Storage
                         │
             ┌───────────┴───────────┐
             ↓                       ↓
       localStorage            sessionStorage
             │                       │
       survives reloads         survives reloads
       survives tab close       until tab closes
       survives restart         tab-specific
             │                       │
             └───────────┬───────────┘
                         ↓
                    String values


Objects need a round trip through JSON

JavaScript object
      │
      ↓ JSON.stringify()
    String
      │
      ↓ setItem()
 localStorage
      │
      ↓ getItem()
    String
      │
      ↓ JSON.parse()
JavaScript object


Cross-tab sync, and who does not get the event

Tab A                         Tab B
  │                             │
  │ localStorage.setItem()      │
  │                             │
  └────────────────────────────→│
                                │
                         storage event


What JavaScript can and cannot read

JavaScript
    │
    ├── localStorage → can read
    │
    └── HttpOnly cookie → cannot read`,
      codeExample: {
        title: { en: "Strings in, strings out", np: "String भित्र, string बाहिर", jp: "入るのも出るのも文字列" },
        code: `// ── 1. Basic — everything comes back as a string ──────────────────
localStorage.setItem("username", "Rajan");
console.log(localStorage.getItem("username")); // "Rajan"

localStorage.setItem("age", 30);
console.log(typeof localStorage.getItem("age")); // "string", not "number"
console.log(Number(localStorage.getItem("age")) + 1); // 31

console.log(localStorage.getItem("missing")); // null

// ── 2. Intermediate — objects need JSON on both sides ─────────────
const user = { name: "Rajan", age: 30 };

localStorage.setItem("user", user);                 // "[object Object]"
localStorage.setItem("user", JSON.stringify(user)); // correct

const parsed = JSON.parse(localStorage.getItem("user"));

// ── 3. Advanced — read defensively, storage can be corrupted ──────
function getUser() {
  const stored = localStorage.getItem("user");
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    localStorage.removeItem("user"); // drop the bad value instead of crashing
    return null;
  }
}

// ── Choosing the right lifetime ───────────────────────────────────
localStorage.setItem("theme", "dark");             // outlives the tab
sessionStorage.setItem("checkoutStep", "payment"); // dies with the tab

// ── Cross-tab sync: the writing tab never hears its own event ─────
window.addEventListener("storage", event => {
  if (event.key === "loggedIn" && event.newValue === "false") {
    window.location.href = "/login";
  }
});

// ── Writing can fail on quota ─────────────────────────────────────
try {
  localStorage.setItem("largeData", hugeString);
} catch (error) {
  if (error.name === "QuotaExceededError") console.log("Storage quota exceeded");
}`,
      },
      keyTakeaways: [
        { en: "Web Storage stores <b>strings only</b> — every value comes back as a string.", np: "Web Storage ले <b>string मात्र</b> राख्छ — हरेक मान string भएर फर्किन्छ।", jp: "Web Storageが保存するのは<b>文字列だけ</b>。取り出す値も必ず文字列。" },
        { en: "`localStorage` survives tab closes and browser restarts; `sessionStorage` dies with the tab.", np: "`localStorage` tab बन्द र browser restart पछि पनि रहन्छ; `sessionStorage` tab सँगै जान्छ।", jp: "`localStorage` はタブを閉じても再起動しても残り、`sessionStorage` はタブとともに消える。" },
        { en: "Store objects with <b>`JSON.stringify()`</b> and read them back with <b>`JSON.parse()`</b>.", np: "Object <b>`JSON.stringify()`</b> ले राख्नुहोस् र <b>`JSON.parse()`</b> ले पढ्नुहोस्।", jp: "オブジェクトは<b>`JSON.stringify()`</b> で保存し、<b>`JSON.parse()`</b> で読み戻す。" },
        { en: "`getItem()` returns <b>`null`</b> for a missing key — guard before parsing.", np: "नभएको key का लागि `getItem()` ले <b>`null`</b> फर्काउँछ — parse गर्नुअघि जाँच्नुहोस्।", jp: "存在しないキーで `getItem()` は<b>`null`</b> を返す。解析前に確認する。" },
        { en: "Each tab has its <b>own</b> `sessionStorage`; it is never shared between tabs.", np: "हरेक tab को <b>आफ्नै</b> `sessionStorage` हुन्छ; यो tab बीच बाँडिँदैन।", jp: "`sessionStorage` はタブごとに<b>独立</b>しており、タブ間で共有されない。" },
        { en: "The <b>`storage`</b> event syncs changes across tabs, but the writing tab does not receive it.", np: "<b>`storage`</b> event ले tab बीच परिवर्तन मिलाउँछ, तर लेख्ने tab ले यो पाउँदैन।", jp: "<b>`storage`</b> イベントはタブ間で変更を同期するが、書き込んだタブ自身には届かない。" },
        { en: "Any script on the page can read storage, so keep long-lived credentials in a <b>`Secure` + `HttpOnly` cookie</b> instead.", np: "Page को कुनै पनि script ले storage पढ्न सक्छ, त्यसैले दीर्घकालीन credential बरु <b>`Secure` + `HttpOnly` cookie</b> मा राख्नुहोस्।", jp: "ページ上のどのスクリプトもストレージを読めるので、長命の資格情報は<b>`Secure` + `HttpOnly` クッキー</b>に置く。" },
        { en: "`setItem()` can throw <b>`QuotaExceededError`</b> — handle it when writing large values.", np: "`setItem()` ले <b>`QuotaExceededError`</b> दिन सक्छ — ठूलो मान लेख्दा सम्हाल्नुहोस्।", jp: "`setItem()` は<b>`QuotaExceededError`</b> を投げうる。大きな値を書くときは扱う。" },
      ],
      commonMistakes: [
        { en: "<b>Assuming storage preserves types</b> — after `localStorage.setItem(\"age\", 30)`, `localStorage.getItem(\"age\") + 1` is `\"301\"`. Convert with `Number(...)` first.", np: "<b>Storage ले type जोगाउँछ भन्ने ठान्नु</b> — `localStorage.setItem(\"age\", 30)` पछि `localStorage.getItem(\"age\") + 1` `\"301\"` हुन्छ। पहिले `Number(...)` ले बदल्नुहोस्।", jp: "<b>型が保たれると思う</b> — `localStorage.setItem(\"age\", 30)` の後、`localStorage.getItem(\"age\") + 1` は `\"301\"`。先に `Number(...)` で変換する。" },
        { en: "<b>Storing objects directly</b> — `localStorage.setItem(\"user\", { name: \"Rajan\" })` saves the string `\"[object Object]\"`. Serialize with `JSON.stringify()`.", np: "<b>Object सिधै राख्नु</b> — `localStorage.setItem(\"user\", { name: \"Rajan\" })` ले `\"[object Object]\"` string राख्छ। `JSON.stringify()` ले serialize गर्नुहोस्।", jp: "<b>オブジェクトをそのまま入れる</b> — `localStorage.setItem(\"user\", { name: \"Rajan\" })` は `\"[object Object]\"` を保存する。`JSON.stringify()` で直列化する。" },
        { en: "<b>Assuming `sessionStorage` is shared between tabs</b> — each tab has its own. Use `localStorage` or the `storage` event when state must cross tabs.", np: "<b>`sessionStorage` tab बीच बाँडिन्छ भन्ने ठान्नु</b> — हरेक tab को आफ्नै हुन्छ। State tab पार गर्नुपर्दा `localStorage` वा `storage` event प्रयोग गर्नुहोस्।", jp: "<b>`sessionStorage` がタブ間で共有されると思う</b> — 各タブが独自に持つ。タブをまたぐ状態には `localStorage` か `storage` イベントを使う。" },
        { en: "<b>Treating `localStorage` as secure</b> — `localStorage.setItem(\"refreshToken\", token)` is readable by any script on the page, including injected XSS payloads.", np: "<b>`localStorage` लाई सुरक्षित ठान्नु</b> — `localStorage.setItem(\"refreshToken\", token)` page को कुनै पनि script ले पढ्न सक्छ, XSS मार्फत घुसाइएको समेत।", jp: "<b>`localStorage` を安全だと思う</b> — `localStorage.setItem(\"refreshToken\", token)` はXSSで注入されたものを含め、ページ上のどのスクリプトからも読める。" },
        { en: "<b>Assuming `setItem()` never fails</b> — exceeding the browser quota throws `QuotaExceededError`. Wrap large writes in `try/catch`.", np: "<b>`setItem()` कहिल्यै असफल हुँदैन भन्ने ठान्नु</b> — browser को quota नाघ्दा `QuotaExceededError` आउँछ। ठूलो लेखन `try/catch` मा राख्नुहोस्।", jp: "<b>`setItem()` は失敗しないと思う</b> — 割当を超えると `QuotaExceededError` になる。大きな書き込みは `try/catch` で包む。" },
      ],
      quiz: [
        {
          question: { en: "What type of values does Web Storage actually store?", np: "Web Storage ले वास्तवमा कस्तो प्रकारका मान राख्छ?", jp: "Web Storageが実際に保存する値の型は?" },
          options: [
            { en: "Objects", np: "Object", jp: "オブジェクト" },
            { en: "Numbers", np: "Number", jp: "数値" },
            { en: "Strings", np: "String", jp: "文字列" },
            { en: "Any JavaScript value", np: "कुनै पनि JavaScript मान", jp: "任意のJavaScriptの値" },
          ],
          correctIndex: 2,
          explanation: { en: "Anything else is converted, which is why objects need `JSON.stringify()`.", np: "अरू सबै बदलिन्छन्, त्यसैले object लाई `JSON.stringify()` चाहिन्छ।", jp: "他は変換されるため、オブジェクトには `JSON.stringify()` が要る。" },
        },
        {
          question: { en: "What happens to `sessionStorage` when its browser tab closes?", np: "Browser tab बन्द हुँदा `sessionStorage` को के हुन्छ?", jp: "タブを閉じると `sessionStorage` はどうなるか?" },
          options: [
            { en: "It persists forever", np: "यो सधैंका लागि रहन्छ", jp: "永久に残る" },
            { en: "It moves to `localStorage`", np: "यो `localStorage` मा सर्छ", jp: "`localStorage` へ移る" },
            { en: "It is uploaded to the server", np: "यो server मा upload हुन्छ", jp: "サーバーへ送られる" },
            { en: "It is removed", np: "यो हट्छ", jp: "削除される" },
          ],
          correctIndex: 3,
          explanation: { en: "Use `localStorage` when the value must outlive the tab.", np: "मान tab भन्दा बढी टिक्नुपर्ने भए `localStorage` प्रयोग गर्नुहोस्।", jp: "タブより長く残す必要があるなら `localStorage` を使う。" },
        },
        {
          question: { en: "What should you normally use to store an object?", np: "Object राख्न सामान्यतया के प्रयोग गर्नुपर्छ?", jp: "オブジェクトの保存に通常使うのは?" },
          options: [
            { en: "`JSON.stringify()`", np: "`JSON.stringify()`", jp: "`JSON.stringify()`" },
            { en: "`String.object()`", np: "`String.object()`", jp: "`String.object()`" },
            { en: "`Object.stringify()`", np: "`Object.stringify()`", jp: "`Object.stringify()`" },
            { en: "`JSON.convert()`", np: "`JSON.convert()`", jp: "`JSON.convert()`" },
          ],
          correctIndex: 0,
          explanation: { en: "Read it back with `JSON.parse()`, guarding against corrupted values.", np: "बिग्रिएको मानबाट जोगिँदै `JSON.parse()` ले पढ्नुहोस्।", jp: "壊れた値に備えつつ `JSON.parse()` で読み戻す。" },
        },
        {
          question: { en: "Which storage is readable by JavaScript running on the page?", np: "Page मा चलिरहेको JavaScript ले कुन storage पढ्न सक्छ?", jp: "ページ上で動くJavaScriptが読めるストレージは?" },
          options: [
            { en: "`localStorage` only", np: "`localStorage` मात्र", jp: "`localStorage` だけ" },
            { en: "Both", np: "दुबै", jp: "両方" },
            { en: "`sessionStorage` only", np: "`sessionStorage` मात्र", jp: "`sessionStorage` だけ" },
            { en: "Neither", np: "कुनै पनि होइन", jp: "どちらも読めない" },
          ],
          correctIndex: 1,
          explanation: { en: "That is why an `HttpOnly` cookie suits long-lived credentials better.", np: "त्यसैले दीर्घकालीन credential का लागि `HttpOnly` cookie बढी उपयुक्त छ।", jp: "だから長命の資格情報には `HttpOnly` クッキーが向く。" },
        },
        {
          question: { en: "Which option suits large structured offline datasets?", np: "ठूलो संरचित offline dataset का लागि कुन उपयुक्त छ?", jp: "大きな構造化オフラインデータに向くのは?" },
          options: [
            { en: "Cookies", np: "Cookie", jp: "クッキー" },
            { en: "`localStorage`", np: "`localStorage`", jp: "`localStorage`" },
            { en: "IndexedDB", np: "IndexedDB", jp: "IndexedDB" },
            { en: "`sessionStorage`", np: "`sessionStorage`", jp: "`sessionStorage`" },
          ],
          correctIndex: 2,
          explanation: { en: "Web Storage tops out at a few megabytes of strings.", np: "Web Storage केही megabyte का string सम्म मात्र सीमित छ।", jp: "Web Storageは数MBの文字列が上限。" },
        },
        {
          question: { en: "Which event helps synchronise `localStorage` changes across tabs?", np: "Tab बीच `localStorage` परिवर्तन मिलाउन कुन event ले मद्दत गर्छ?", jp: "タブ間で `localStorage` の変更を同期できるイベントは?" },
          options: [
            { en: "`sync`", np: "`sync`", jp: "`sync`" },
            { en: "`localstoragechange`", np: "`localstoragechange`", jp: "`localstoragechange`" },
            { en: "`tabchange`", np: "`tabchange`", jp: "`tabchange`" },
            { en: "`storage`", np: "`storage`", jp: "`storage`" },
          ],
          correctIndex: 3,
          explanation: { en: "The tab that wrote the value does not receive the event itself.", np: "मान लेख्ने tab ले आफैं event पाउँदैन।", jp: "値を書き込んだタブ自身にはイベントは届かない。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "What does `fetch()` return?", np: "`fetch()` ले के फर्काउँछ?", jp: "`fetch()` は何を返すか?" },
      options: [
        { en: "A `Promise` that resolves to a `Response`", np: "`Response` मा resolve हुने `Promise`", jp: "`Response` に解決される `Promise`" },
        { en: "The parsed JSON data", np: "Parse भएको JSON data", jp: "解析済みのJSONデータ" },
        { en: "A `Response` object directly", np: "सिधै `Response` object", jp: "`Response` オブジェクトそのもの" },
      ],
      correctIndex: 0,
      explanation: { en: "Reading the body is a second asynchronous step.", np: "Body पढ्नु दोस्रो asynchronous चरण हो।", jp: "本文の読み取りは2つ目の非同期処理。" },
    },
    {
      question: { en: "A server replies with `500`. What does `fetch()` do?", np: "Server ले `500` फर्कायो। `fetch()` ले के गर्छ?", jp: "サーバーが `500` を返したとき `fetch()` はどうするか?" },
      options: [
        { en: "Rejects the promise", np: "Promise reject गर्छ", jp: "Promiseを拒否する" },
        { en: "Resolves with `response.ok === false`", np: "`response.ok === false` सहित resolve हुन्छ", jp: "`response.ok === false` で解決する" },
        { en: "Retries the request", np: "Request फेरि प्रयास गर्छ", jp: "リクエストを再試行する" },
      ],
      correctIndex: 1,
      explanation: { en: "Only network-level failures reject; check the status yourself.", np: "Network-स्तरका असफलताले मात्र reject गर्छन्; status आफैं जाँच्नुहोस्।", jp: "拒否されるのはネットワークレベルの失敗だけ。ステータスは自分で確認する。" },
    },
    {
      question: { en: "Why must you call `JSON.stringify()` when POSTing an object?", np: "Object POST गर्दा `JSON.stringify()` किन बोलाउनुपर्छ?", jp: "オブジェクトをPOSTするとき `JSON.stringify()` が必要な理由は?" },
      options: [
        { en: "It sets the `Content-Type` header", np: "यसले `Content-Type` header सेट गर्छ", jp: "`Content-Type` ヘッダーを設定するから" },
        { en: "It encrypts the payload", np: "यसले payload encrypt गर्छ", jp: "ペイロードを暗号化するから" },
        { en: "`fetch()` does not serialize the body for you", np: "`fetch()` ले तपाईंका लागि body serialize गर्दैन", jp: "`fetch()` は本文を代わりに直列化しないから" },
      ],
      correctIndex: 2,
      explanation: { en: "Set `Content-Type: application/json` separately in the headers.", np: "`Content-Type: application/json` header मा छुट्टै सेट गर्नुहोस्।", jp: "`Content-Type: application/json` はヘッダーで別途設定する。" },
    },
    {
      question: { en: "What happens when you call `response.json()` twice on one response?", np: "एउटै response मा `response.json()` दुई पटक बोलाउँदा के हुन्छ?", jp: "1つのレスポンスで `response.json()` を2回呼ぶとどうなるか?" },
      options: [
        { en: "The second call fails, the body is already consumed", np: "दोस्रो call असफल हुन्छ, body पहिले नै खपत भइसक्यो", jp: "2回目は失敗する。本文はすでに消費済み" },
        { en: "Both calls return the same data", np: "दुबै call ले उही data फर्काउँछन्", jp: "どちらも同じデータを返す" },
        { en: "The request is sent again", np: "Request फेरि पठाइन्छ", jp: "リクエストが再送される" },
      ],
      correctIndex: 0,
      explanation: { en: "Call `response.clone()` first if you genuinely need two reads.", np: "साँच्चै दुई पटक पढ्नुपर्ने भए पहिले `response.clone()` बोलाउनुहोस्।", jp: "本当に2回読むなら先に `response.clone()` を呼ぶ。" },
    },
    {
      question: { en: "What connects an `AbortController` to a `fetch()` call?", np: "`AbortController` लाई `fetch()` सँग के ले जोड्छ?", jp: "`AbortController` と `fetch()` をつなぐものは?" },
      options: [
        { en: "Passing `controller` as the second argument", np: "दोस्रो argument मा `controller` दिनु", jp: "第2引数に `controller` を渡すこと" },
        { en: "Passing `signal: controller.signal` in the options", np: "Option मा `signal: controller.signal` दिनु", jp: "オプションに `signal: controller.signal` を渡すこと" },
        { en: "Calling `fetch.abort()`", np: "`fetch.abort()` बोलाउनु", jp: "`fetch.abort()` を呼ぶこと" },
      ],
      correctIndex: 1,
      explanation: { en: "Without the signal, `abort()` has nothing to cancel.", np: "Signal नभए `abort()` सँग रद्द गर्ने केही हुँदैन।", jp: "シグナルがなければ `abort()` に中止する対象がない。" },
    },
    {
      question: { en: "What error name does a cancelled `fetch()` reject with?", np: "रद्द भएको `fetch()` कुन नामको error सँग reject हुन्छ?", jp: "中止された `fetch()` はどの名前のエラーで拒否されるか?" },
      options: [
        { en: "`CancelError`", np: "`CancelError`", jp: "`CancelError`" },
        { en: "`NetworkError`", np: "`NetworkError`", jp: "`NetworkError`" },
        { en: "`AbortError`", np: "`AbortError`", jp: "`AbortError`" },
      ],
      correctIndex: 2,
      explanation: { en: "Check `error.name` so cancellation is not reported as a failure.", np: "Cancellation लाई असफलता नठानियोस् भनेर `error.name` जाँच्नुहोस्।", jp: "キャンセルを失敗として報告しないよう `error.name` を確認する。" },
    },
    {
      question: { en: "How do you give `fetch()` a five-second timeout?", np: "`fetch()` लाई पाँच सेकेन्डको timeout कसरी दिने?", jp: "`fetch()` に5秒のタイムアウトを付けるには?" },
      options: [
        { en: "Abort a controller from a `setTimeout`, or use `AbortSignal.timeout(5000)`", np: "`setTimeout` बाट controller abort गर्ने, वा `AbortSignal.timeout(5000)` प्रयोग गर्ने", jp: "`setTimeout` からコントローラーを中止するか `AbortSignal.timeout(5000)` を使う" },
        { en: "Pass `timeout: 5000` in the options", np: "Option मा `timeout: 5000` दिने", jp: "オプションに `timeout: 5000` を渡す" },
        { en: "Wrap the call in `Promise.race` with `setInterval`", np: "`setInterval` सँग `Promise.race` मा बेर्ने", jp: "`setInterval` と `Promise.race` で包む" },
      ],
      correctIndex: 0,
      explanation: { en: "`fetch()` has no timeout option of its own.", np: "`fetch()` सँग आफ्नै timeout option छैन।", jp: "`fetch()` 自体にタイムアウトのオプションはない。" },
    },
    {
      question: { en: "What type does Web Storage actually store?", np: "Web Storage ले वास्तवमा कुन प्रकार राख्छ?", jp: "Web Storageが実際に保存する型は?" },
      options: [
        { en: "Any JavaScript value", np: "कुनै पनि JavaScript मान", jp: "任意のJavaScriptの値" },
        { en: "Strings", np: "String", jp: "文字列" },
        { en: "Only JSON objects", np: "JSON object मात्र", jp: "JSONオブジェクトのみ" },
      ],
      correctIndex: 1,
      explanation: { en: "`localStorage.setItem(\"age\", 30)` comes back as `\"30\"`.", np: "`localStorage.setItem(\"age\", 30)` `\"30\"` भएर फर्किन्छ।", jp: "`localStorage.setItem(\"age\", 30)` は `\"30\"` として戻る。" },
    },
    {
      question: { en: "What happens to `sessionStorage` when the tab closes?", np: "Tab बन्द हुँदा `sessionStorage` को के हुन्छ?", jp: "タブを閉じると `sessionStorage` はどうなるか?" },
      options: [
        { en: "It persists like `localStorage`", np: "`localStorage` जस्तै रहन्छ", jp: "`localStorage` のように残る" },
        { en: "It is shared with other tabs", np: "यो अरू tab सँग बाँडिन्छ", jp: "他のタブと共有される" },
        { en: "It is removed", np: "यो हट्छ", jp: "削除される" },
      ],
      correctIndex: 2,
      explanation: { en: "Each tab also has its own separate `sessionStorage`.", np: "हरेक tab को छुट्टै `sessionStorage` पनि हुन्छ।", jp: "各タブは独自の `sessionStorage` も持つ。" },
    },
    {
      question: { en: "Why should a refresh token generally not live in `localStorage`?", np: "Refresh token सामान्यतया `localStorage` मा किन राख्नु हुँदैन?", jp: "リフレッシュトークンを原則 `localStorage` に置かない理由は?" },
      options: [
        { en: "Any script on the page, including an XSS payload, can read it", np: "Page को कुनै पनि script, XSS payload समेत, ले यो पढ्न सक्छ", jp: "XSSのペイロードを含め、ページ上のどのスクリプトも読めるから" },
        { en: "Storage is wiped on every reload", np: "हरेक reload मा storage मेटिन्छ", jp: "再読み込みのたびに消えるから" },
        { en: "It is automatically sent to every server", np: "यो स्वतः हरेक server मा पठाइन्छ", jp: "すべてのサーバーへ自動送信されるから" },
      ],
      correctIndex: 0,
      explanation: { en: "A `Secure` + `HttpOnly` cookie cannot be read from JavaScript.", np: "`Secure` + `HttpOnly` cookie JavaScript बाट पढ्न सकिँदैन।", jp: "`Secure` + `HttpOnly` クッキーはJavaScriptから読めない。" },
    },
    {
      question: { en: "Which event lets one tab react to a `localStorage` change made in another?", np: "अर्को tab मा भएको `localStorage` परिवर्तनमा एउटा tab ले प्रतिक्रिया दिन कुन event ले दिन्छ?", jp: "別のタブでの `localStorage` の変更に反応できるイベントは?" },
      options: [
        { en: "`change`", np: "`change`", jp: "`change`" },
        { en: "`storage`", np: "`storage`", jp: "`storage`" },
        { en: "`sync`", np: "`sync`", jp: "`sync`" },
      ],
      correctIndex: 1,
      explanation: { en: "The tab that made the change does not receive the event.", np: "परिवर्तन गर्ने tab ले event पाउँदैन।", jp: "変更したタブ自身にはイベントは届かない。" },
    },
    {
      question: { en: "What can `localStorage.setItem()` throw when a large value exceeds the browser limit?", np: "ठूलो मानले browser को सीमा नाघ्दा `localStorage.setItem()` ले के दिन सक्छ?", jp: "大きな値がブラウザの上限を超えると `localStorage.setItem()` は何を投げうるか?" },
      options: [
        { en: "`RangeError`", np: "`RangeError`", jp: "`RangeError`" },
        { en: "Nothing, it fails silently", np: "केही होइन, चुपचाप असफल हुन्छ", jp: "何も投げず静かに失敗する" },
        { en: "`QuotaExceededError`", np: "`QuotaExceededError`", jp: "`QuotaExceededError`" },
      ],
      correctIndex: 2,
      explanation: { en: "Wrap large writes in `try/catch` and degrade gracefully.", np: "ठूलो लेखन `try/catch` मा राखेर सहजै सम्हाल्नुहोस्।", jp: "大きな書き込みは `try/catch` で包み、穏やかに縮退させる。" },
    },
  ],
};
