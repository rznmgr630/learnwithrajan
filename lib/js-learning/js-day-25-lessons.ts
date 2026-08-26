import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

export const JS_DAY_25_LESSONS: JsLessonDay = {
  day: 25,
  title: { en: "Performance — debounce, throttle, memoization & workers", np: "Performance — debounce, throttle, memoization", jp: "パフォーマンス最適化" },
  totalMinutes: 27,
  difficulty: { en: "Intermediate", np: "Intermediate", jp: "中級" },
  lessons: [
    {
      id: "debounce-throttle",
      title: { en: "Debounce & Throttle", np: "Debounce र Throttle", jp: "デバウンスとスロットル" },
      durationMinutes: 9,
      explanation: {
        en: "<b>Debounce</b> and <b>throttle</b> control how often a function runs when events fire repeatedly in a short period.\n\nThe key difference:\n\n• <b>Debounce</b> — wait until the activity <b>stops</b>, then run.\n• <b>Throttle</b> — while activity continues, run <b>at most once per interval</b>.\n\n```text\nUser:  H → He → Hel → Hell → Hello\n       ↓    ↓    ↓     ↓      ↓\nDebounce:              wait → run(\"Hello\")\nThrottle:  run → wait → run → wait → run\n```\n\nDebounce is about <b>quiet periods</b>. Throttle is about <b>rate limiting</b>.\n\n```text\nDEBOUNCE — \"Wait until they stop\"\n\nCalls:\n●──●──●──●────────────●\n                    300ms\n                       ↓\n                    RUN\n\n\nTHROTTLE — \"Run at most once per interval\"\n\nCalls:\n●──●──●──●──●──●──●──●\n↓        ↓        ↓\nRUN      RUN      RUN\n│<--300ms-->|<--300ms-->|\n```\n\n---\n\n### 1. Basic — debounce\n\nA basic debounce resets the timer on every call:\n\n```javascript\nfunction debounce(fn, delay) {\n  let timer;\n\n  return function (...args) {\n    clearTimeout(timer);\n\n    timer = setTimeout(() => {\n      fn(...args);\n    }, delay);\n  };\n}\n\nconst search = debounce((query) => {\n  console.log(\"Searching:\", query);\n}, 300);\n\nsearch(\"r\");\nsearch(\"re\");\nsearch(\"rea\");\nsearch(\"reac\");\nsearch(\"react\");\n```\n\nOnly the final call runs:\n\n```text\nSearching: react\n```\n\n```text\nsearch(\"r\")\n    ↓\nstart timer ───────────┐\n\nsearch(\"re\")           │\n    ↓                  │\nclear timer            │\nstart new timer ───────┤\n\nsearch(\"react\")        │\n    ↓                  │\nclear timer            │\nstart new timer ───────┤\n                       ↓\n                  300ms passes\n                       ↓\n                     fn()\n```\n\n---\n\n### 2. Intermediate — throttle\n\nThrottle lets a function run at most once per interval:\n\n```javascript\nfunction throttle(fn, interval) {\n  let lastCall = 0;\n\n  return function (...args) {\n    const now = Date.now();\n\n    if (now - lastCall >= interval) {\n      lastCall = now;\n      fn(...args);\n    }\n  };\n}\n\nconst handleScroll = throttle(() => {\n  console.log(\"Scrolling...\");\n}, 300);\n\nwindow.addEventListener(\"scroll\", handleScroll);\n```\n\nEven if the browser fires hundreds of `scroll` events, the work runs at most once every 300ms:\n\n```text\nEvents:\n\n● ● ● ● ● ● ● ● ● ● ● ● ● ●\n↓         ↓         ↓\nRUN       RUN       RUN\n\n     300ms     300ms\n```\n\n---\n\n### 3. Advanced — debounced search\n\nDebouncing is what a search box wants:\n\n```javascript\nconst searchUsers = debounce(async (query) => {\n  if (!query.trim()) return;\n\n  const response = await fetch(\n    `/api/users?search=${encodeURIComponent(query)}`\n  );\n\n  const users = await response.json();\n\n  console.log(users);\n}, 400);\n\ninput.addEventListener(\"input\", (event) => {\n  searchUsers(event.target.value);\n});\n```\n\nWithout debounce, five keystrokes send five requests:\n\n```text\nr       → API request\nre      → API request\nrea     → API request\nreac    → API request\nreact   → API request\n```\n\nWith debounce:\n\n```text\nr       ─┐\nre      ─┤\nrea     ─┤\nreac    ─┤\nreact   ─┘\n          ↓\n       wait 400ms\n          ↓\n     ONE API request\n```\n\n---\n\n### 4. Advanced — leading-edge debounce\n\nSometimes you want the first call to run <b>immediately</b>, then ignore the rest for a while:\n\n```javascript\nfunction debounceLeading(fn, delay) {\n  let timer = null;\n\n  return function (...args) {\n    if (timer) return;\n\n    fn(...args);\n\n    timer = setTimeout(() => {\n      timer = null;\n    }, delay);\n  };\n}\n\nconst save = debounceLeading(() => {\n  console.log(\"Saved\");\n}, 1000);\n\nsave(); // Saved\nsave(); // ignored\nsave(); // ignored\n```\n\nThis suits an action that should feel instant but must not repeat.\n\n---\n\n### 5. Advanced — throttle that keeps the latest arguments\n\nA production throttle schedules the trailing call instead of discarding everything inside the interval:\n\n```javascript\nfunction throttle(fn, interval) {\n  let lastRun = 0;\n  let timer = null;\n\n  return function (...args) {\n    const now = Date.now();\n    const remaining = interval - (now - lastRun);\n\n    if (remaining <= 0) {\n      clearTimeout(timer);\n      timer = null;\n\n      lastRun = now;\n      fn(...args);\n    } else if (!timer) {\n      timer = setTimeout(() => {\n        lastRun = Date.now();\n        timer = null;\n        fn(...args);\n      }, remaining);\n    }\n  };\n}\n```\n\nNow continuous events do not lose the final state — useful for scroll position, drag position, mouse movement and resize calculations.\n\n---\n\n### Debounce vs throttle\n\n```text\n                            Debounce                  Throttle\nMain idea                   wait for silence          limit the rate\nRuns during activity?       usually no                yes\nFrequency                   once after it stops       at most once per interval\nSearch input                excellent                 usually unnecessary\nAutosave                    excellent                 sometimes\nScroll tracking             usually no                excellent\nMouse movement              usually no                excellent\nResize handling             often useful              also useful\n```\n\n```text\nDEBOUNCE\n\n\"Tell me when you're DONE.\"\n\nTyping:\n████████████████──────\n                    ↑\n                  RUN\n\n\nTHROTTLE\n\n\"Tell me periodically while you're doing it.\"\n\nActivity:\n████████████████████████\n↓       ↓       ↓       ↓\nRUN     RUN     RUN     RUN\n```\n\n---\n\n### Debounce can starve\n\nIf calls keep arriving faster than the delay, each one resets the timer:\n\n```text\n●──●──●──●──●──●──●──●──→\n│  │  │  │  │  │  │  │\n└──timer keeps resetting─┘\n```\n\nThe function may <b>never run</b> until the events stop. That is exactly why throttle is the right tool when you need continuous updates.\n\n---\n\n### When to use which\n\nUse <b>debounce</b> when only the final state matters: search-as-you-type, form autosave, validation after typing, resize calculations, filtering expensive datasets.\n\nUse <b>throttle</b> when you need periodic updates while activity continues: scroll position, `mousemove`, dragging, resize monitoring, rate-limiting API calls.",
        np: "<b>Debounce</b> र <b>throttle</b> ले छोटो समयमा बारम्बार event आउँदा function कति पटक चल्छ भन्ने नियन्त्रण गर्छन्।\n\nमुख्य भिन्नता:\n\n• <b>Debounce</b> — गतिविधि <b>रोकिने</b> कुर्नुहोस्, अनि चलाउनुहोस्।\n• <b>Throttle</b> — गतिविधि चलिरहँदा, <b>प्रति अन्तराल बढीमा एक पटक</b> चलाउनुहोस्।\n\n```text\nUser:  H → He → Hel → Hell → Hello\n       ↓    ↓    ↓     ↓      ↓\nDebounce:              wait → run(\"Hello\")\nThrottle:  run → wait → run → wait → run\n```\n\nDebounce <b>शान्त अवधि</b> बारे हो। Throttle <b>दर सीमित गर्ने</b> बारे।\n\n```text\nDEBOUNCE — \"Wait until they stop\"\n\nCalls:\n●──●──●──●────────────●\n                    300ms\n                       ↓\n                    RUN\n\n\nTHROTTLE — \"Run at most once per interval\"\n\nCalls:\n●──●──●──●──●──●──●──●\n↓        ↓        ↓\nRUN      RUN      RUN\n│<--300ms-->|<--300ms-->|\n```\n\n---\n\n### 1. आधारभूत — debounce\n\nआधारभूत debounce ले हरेक call मा timer रिसेट गर्छ:\n\n```javascript\nfunction debounce(fn, delay) {\n  let timer;\n\n  return function (...args) {\n    clearTimeout(timer);\n\n    timer = setTimeout(() => {\n      fn(...args);\n    }, delay);\n  };\n}\n\nconst search = debounce((query) => {\n  console.log(\"Searching:\", query);\n}, 300);\n\nsearch(\"r\");\nsearch(\"re\");\nsearch(\"rea\");\nsearch(\"reac\");\nsearch(\"react\");\n```\n\nअन्तिम call मात्र चल्छ:\n\n```text\nSearching: react\n```\n\n```text\nsearch(\"r\")\n    ↓\nstart timer ───────────┐\n\nsearch(\"re\")           │\n    ↓                  │\nclear timer            │\nstart new timer ───────┤\n\nsearch(\"react\")        │\n    ↓                  │\nclear timer            │\nstart new timer ───────┤\n                       ↓\n                  300ms passes\n                       ↓\n                     fn()\n```\n\n---\n\n### 2. मध्यम — throttle\n\nThrottle ले function लाई प्रति अन्तराल बढीमा एक पटक चल्न दिन्छ:\n\n```javascript\nfunction throttle(fn, interval) {\n  let lastCall = 0;\n\n  return function (...args) {\n    const now = Date.now();\n\n    if (now - lastCall >= interval) {\n      lastCall = now;\n      fn(...args);\n    }\n  };\n}\n\nconst handleScroll = throttle(() => {\n  console.log(\"Scrolling...\");\n}, 300);\n\nwindow.addEventListener(\"scroll\", handleScroll);\n```\n\nBrowser ले सयौं `scroll` event पठाए पनि, काम प्रति 300ms बढीमा एक पटक चल्छ:\n\n```text\nEvents:\n\n● ● ● ● ● ● ● ● ● ● ● ● ● ●\n↓         ↓         ↓\nRUN       RUN       RUN\n\n     300ms     300ms\n```\n\n---\n\n### 3. उन्नत — debounce गरिएको search\n\nSearch box लाई चाहिने यही हो:\n\n```javascript\nconst searchUsers = debounce(async (query) => {\n  if (!query.trim()) return;\n\n  const response = await fetch(\n    `/api/users?search=${encodeURIComponent(query)}`\n  );\n\n  const users = await response.json();\n\n  console.log(users);\n}, 400);\n\ninput.addEventListener(\"input\", (event) => {\n  searchUsers(event.target.value);\n});\n```\n\nDebounce नभए, पाँच keystroke ले पाँच request पठाउँछ:\n\n```text\nr       → API request\nre      → API request\nrea     → API request\nreac    → API request\nreact   → API request\n```\n\nDebounce सँग:\n\n```text\nr       ─┐\nre      ─┤\nrea     ─┤\nreac    ─┤\nreact   ─┘\n          ↓\n       wait 400ms\n          ↓\n     ONE API request\n```\n\n---\n\n### 4. उन्नत — leading-edge debounce\n\nकहिलेकाहीं पहिलो call <b>तुरुन्तै</b> चलोस्, अनि केही बेर बाँकी बेवास्ता होऊन् भन्ने चाहिन्छ:\n\n```javascript\nfunction debounceLeading(fn, delay) {\n  let timer = null;\n\n  return function (...args) {\n    if (timer) return;\n\n    fn(...args);\n\n    timer = setTimeout(() => {\n      timer = null;\n    }, delay);\n  };\n}\n\nconst save = debounceLeading(() => {\n  console.log(\"Saved\");\n}, 1000);\n\nsave(); // Saved\nsave(); // बेवास्ता\nsave(); // बेवास्ता\n```\n\nतुरुन्तै लाग्नुपर्ने तर नदोहोरिनुपर्ने कामका लागि यो उपयुक्त छ।\n\n---\n\n### 5. उन्नत — पछिल्लो argument राख्ने throttle\n\nProduction को throttle ले अन्तराल भित्रका सबै फाल्नुको सट्टा trailing call schedule गर्छ:\n\n```javascript\nfunction throttle(fn, interval) {\n  let lastRun = 0;\n  let timer = null;\n\n  return function (...args) {\n    const now = Date.now();\n    const remaining = interval - (now - lastRun);\n\n    if (remaining <= 0) {\n      clearTimeout(timer);\n      timer = null;\n\n      lastRun = now;\n      fn(...args);\n    } else if (!timer) {\n      timer = setTimeout(() => {\n        lastRun = Date.now();\n        timer = null;\n        fn(...args);\n      }, remaining);\n    }\n  };\n}\n```\n\nअब लगातारका event ले अन्तिम अवस्था गुमाउँदैनन् — scroll position, drag position, mouse movement र resize गणनाका लागि उपयोगी।\n\n---\n\n### Debounce vs throttle\n\n```text\n                            Debounce                  Throttle\nमुख्य विचार                 शान्ति कुर्ने             दर सीमित गर्ने\nगतिविधिमा चल्छ?             प्रायः चल्दैन             चल्छ\nआवृत्ति                     रोकिएपछि एक पटक           प्रति अन्तराल बढीमा एक\nSearch input                उत्कृष्ट                  प्रायः आवश्यक छैन\nAutosave                    उत्कृष्ट                  कहिलेकाहीं\nScroll tracking             प्रायः होइन               उत्कृष्ट\nMouse movement              प्रायः होइन               उत्कृष्ट\nResize handling             प्रायः उपयोगी             पनि उपयोगी\n```\n\n```text\nDEBOUNCE\n\n\"Tell me when you're DONE.\"\n\nTyping:\n████████████████──────\n                    ↑\n                  RUN\n\n\nTHROTTLE\n\n\"Tell me periodically while you're doing it.\"\n\nActivity:\n████████████████████████\n↓       ↓       ↓       ↓\nRUN     RUN     RUN     RUN\n```\n\n---\n\n### Debounce ले भोकाउन सक्छ\n\nDelay भन्दा छिटो call आइरहे, हरेकले timer रिसेट गर्छ:\n\n```text\n●──●──●──●──●──●──●──●──→\n│  │  │  │  │  │  │  │\n└──timer keeps resetting─┘\n```\n\nEvent नरोकिएसम्म function <b>कहिल्यै नचल्न</b> सक्छ। त्यसैले लगातार अद्यावधिक चाहिँदा throttle नै सही उपकरण हो।\n\n---\n\n### कहिले कुन\n\nअन्तिम अवस्था मात्र महत्वपूर्ण हुँदा <b>debounce</b> प्रयोग गर्नुहोस्: search-as-you-type, form autosave, type गरेपछिको validation, resize गणना, महँगो dataset filter गर्नु।\n\nगतिविधि चलिरहँदा आवधिक अद्यावधिक चाहिँदा <b>throttle</b> प्रयोग गर्नुहोस्: scroll position, `mousemove`, dragging, resize अनुगमन, API दर सीमित गर्नु।",
        jp: "<b>デバウンス</b>と<b>スロットル</b>は、短時間にイベントが繰り返し発火するとき、関数が走る頻度を制御します。\n\n決定的な違い:\n\n• <b>デバウンス</b> — 動きが<b>止まる</b>まで待ってから実行する。\n• <b>スロットル</b> — 動いている間、<b>一定間隔に最大1回</b>だけ実行する。\n\n```text\nUser:  H → He → Hel → Hell → Hello\n       ↓    ↓    ↓     ↓      ↓\nDebounce:              wait → run(\"Hello\")\nThrottle:  run → wait → run → wait → run\n```\n\nデバウンスは<b>静かな時間</b>の話、スロットルは<b>レート制限</b>の話です。\n\n```text\nDEBOUNCE — \"Wait until they stop\"\n\nCalls:\n●──●──●──●────────────●\n                    300ms\n                       ↓\n                    RUN\n\n\nTHROTTLE — \"Run at most once per interval\"\n\nCalls:\n●──●──●──●──●──●──●──●\n↓        ↓        ↓\nRUN      RUN      RUN\n│<--300ms-->|<--300ms-->|\n```\n\n---\n\n### 1. 基本 — デバウンス\n\n基本のデバウンスは、呼ばれるたびにタイマーを張り直します:\n\n```javascript\nfunction debounce(fn, delay) {\n  let timer;\n\n  return function (...args) {\n    clearTimeout(timer);\n\n    timer = setTimeout(() => {\n      fn(...args);\n    }, delay);\n  };\n}\n\nconst search = debounce((query) => {\n  console.log(\"Searching:\", query);\n}, 300);\n\nsearch(\"r\");\nsearch(\"re\");\nsearch(\"rea\");\nsearch(\"reac\");\nsearch(\"react\");\n```\n\n走るのは最後の呼び出しだけです:\n\n```text\nSearching: react\n```\n\n```text\nsearch(\"r\")\n    ↓\nstart timer ───────────┐\n\nsearch(\"re\")           │\n    ↓                  │\nclear timer            │\nstart new timer ───────┤\n\nsearch(\"react\")        │\n    ↓                  │\nclear timer            │\nstart new timer ───────┤\n                       ↓\n                  300ms passes\n                       ↓\n                     fn()\n```\n\n---\n\n### 2. 中級 — スロットル\n\nスロットルは、一定間隔に最大1回だけ実行を許します:\n\n```javascript\nfunction throttle(fn, interval) {\n  let lastCall = 0;\n\n  return function (...args) {\n    const now = Date.now();\n\n    if (now - lastCall >= interval) {\n      lastCall = now;\n      fn(...args);\n    }\n  };\n}\n\nconst handleScroll = throttle(() => {\n  console.log(\"Scrolling...\");\n}, 300);\n\nwindow.addEventListener(\"scroll\", handleScroll);\n```\n\nブラウザが `scroll` を何百回発火しても、処理は300msに最大1回です:\n\n```text\nEvents:\n\n● ● ● ● ● ● ● ● ● ● ● ● ● ●\n↓         ↓         ↓\nRUN       RUN       RUN\n\n     300ms     300ms\n```\n\n---\n\n### 3. 上級 — デバウンスした検索\n\n検索ボックスが欲しいのはこれです:\n\n```javascript\nconst searchUsers = debounce(async (query) => {\n  if (!query.trim()) return;\n\n  const response = await fetch(\n    `/api/users?search=${encodeURIComponent(query)}`\n  );\n\n  const users = await response.json();\n\n  console.log(users);\n}, 400);\n\ninput.addEventListener(\"input\", (event) => {\n  searchUsers(event.target.value);\n});\n```\n\nデバウンスがなければ、5打鍵で5リクエストです:\n\n```text\nr       → API request\nre      → API request\nrea     → API request\nreac    → API request\nreact   → API request\n```\n\nデバウンスありなら:\n\n```text\nr       ─┐\nre      ─┤\nrea     ─┤\nreac    ─┤\nreact   ─┘\n          ↓\n       wait 400ms\n          ↓\n     ONE API request\n```\n\n---\n\n### 4. 上級 — 先頭で走るデバウンス\n\n最初の呼び出しは<b>即座に</b>走らせ、しばらく後続を無視したいこともあります:\n\n```javascript\nfunction debounceLeading(fn, delay) {\n  let timer = null;\n\n  return function (...args) {\n    if (timer) return;\n\n    fn(...args);\n\n    timer = setTimeout(() => {\n      timer = null;\n    }, delay);\n  };\n}\n\nconst save = debounceLeading(() => {\n  console.log(\"Saved\");\n}, 1000);\n\nsave(); // Saved\nsave(); // 無視\nsave(); // 無視\n```\n\n即応に見せたいが繰り返してはいけない操作に向きます。\n\n---\n\n### 5. 上級 — 最後の引数を残すスロットル\n\n実務向けのスロットルは、間隔内の呼び出しを捨てずに末尾の1回を予約します:\n\n```javascript\nfunction throttle(fn, interval) {\n  let lastRun = 0;\n  let timer = null;\n\n  return function (...args) {\n    const now = Date.now();\n    const remaining = interval - (now - lastRun);\n\n    if (remaining <= 0) {\n      clearTimeout(timer);\n      timer = null;\n\n      lastRun = now;\n      fn(...args);\n    } else if (!timer) {\n      timer = setTimeout(() => {\n        lastRun = Date.now();\n        timer = null;\n        fn(...args);\n      }, remaining);\n    }\n  };\n}\n```\n\nこれで連続イベントでも最終状態を取りこぼしません。スクロール位置・ドラッグ位置・マウス移動・リサイズ計算に有効です。\n\n---\n\n### デバウンスとスロットル\n\n```text\n                            デバウンス                スロットル\n主な考え                    静けさを待つ              レートを制限する\n動作中に走る?               ふつう走らない            走る\n頻度                        止まった後に1回           間隔ごとに最大1回\n検索入力                    最適                      ふつう不要\n自動保存                    最適                      場合による\nスクロール追跡              ふつう不向き              最適\nマウス移動                  ふつう不向き              最適\nリサイズ処理                しばしば有効              こちらも有効\n```\n\n```text\nDEBOUNCE\n\n\"Tell me when you're DONE.\"\n\nTyping:\n████████████████──────\n                    ↑\n                  RUN\n\n\nTHROTTLE\n\n\"Tell me periodically while you're doing it.\"\n\nActivity:\n████████████████████████\n↓       ↓       ↓       ↓\nRUN     RUN     RUN     RUN\n```\n\n---\n\n### デバウンスは飢える\n\n遅延より速く呼び出しが続くと、そのたびにタイマーが張り直されます:\n\n```text\n●──●──●──●──●──●──●──●──→\n│  │  │  │  │  │  │  │\n└──timer keeps resetting─┘\n```\n\nイベントが止まるまで関数が<b>一度も走らない</b>ことがあります。連続的な更新が要るならスロットルが正解です。\n\n---\n\n### 使い分け\n\n最終状態だけが重要なら<b>デバウンス</b>: 逐次検索・フォームの自動保存・入力後の検証・リサイズ計算・重いデータの絞り込み。\n\n動作中も定期的な更新が要るなら<b>スロットル</b>: スクロール位置・`mousemove`・ドラッグ・リサイズ監視・APIのレート制限。",
      },
      diagram: `DEBOUNCE — "Wait until they stop"

Calls:
●──●──●──●────────────●
                    300ms
                       ↓
                    RUN


THROTTLE — "Run at most once per interval"

Calls:
●──●──●──●──●──●──●──●
↓        ↓        ↓
RUN      RUN      RUN
│<--300ms-->|<--300ms-->|


Every call restarts the debounce timer

search("r")
    ↓
start timer ───────────┐
search("re")           │
    ↓                  │
clear timer            │
start new timer ───────┤
search("react")        │
    ↓                  │
clear timer            │
start new timer ───────┤
                       ↓
                  300ms passes
                       ↓
                     fn()


Which one, and why

DEBOUNCE                      THROTTLE
"Tell me when you're DONE."   "Tell me while you're doing it."

████████████████──────        ████████████████████████
                    ↑         ↓       ↓       ↓       ↓
                  RUN         RUN     RUN     RUN     RUN


Debounce can starve

●──●──●──●──●──●──●──●──→
│  │  │  │  │  │  │  │
└──timer keeps resetting─┘
        never runs until the events stop`,
      codeExample: {
        title: { en: "Waiting for silence, or capping the rate", np: "शान्ति कुर्ने, कि दर सीमित गर्ने", jp: "静けさを待つか、頻度を抑えるか" },
        code: `// ── 1. Basic — debounce: only the last call survives ──────────────
function debounce(fn, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);                 // every call restarts the wait
    timer = setTimeout(() => fn(...args), delay);
  };
}

const search = debounce(query => console.log("Searching:", query), 300);

search("r");
search("re");
search("react"); // only this one runs, 300ms later

// ── 2. Intermediate — throttle: at most once per interval ─────────
function throttle(fn, interval) {
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastCall >= interval) {
      lastCall = now;
      fn(...args);
    }
  };
}

window.addEventListener("scroll", throttle(() => console.log("Scrolling"), 300));

// ── 3. Advanced — one request instead of one per keystroke ────────
const searchUsers = debounce(async query => {
  if (!query.trim()) return;

  const response = await fetch(\`/api/users?search=\${encodeURIComponent(query)}\`);
  console.log(await response.json());
}, 400);

input.addEventListener("input", event => searchUsers(event.target.value));

// ── 4. Advanced — leading edge: run now, then go quiet ────────────
function debounceLeading(fn, delay) {
  let timer = null;

  return function (...args) {
    if (timer) return;                   // inside the quiet window
    fn(...args);
    timer = setTimeout(() => { timer = null; }, delay);
  };
}

// ── 5. Advanced — throttle that keeps the trailing call ───────────
function throttleTrailing(fn, interval) {
  let lastRun = 0;
  let timer = null;

  return function (...args) {
    const remaining = interval - (Date.now() - lastRun);

    if (remaining <= 0) {
      clearTimeout(timer);
      timer = null;
      lastRun = Date.now();
      fn(...args);
    } else if (!timer) {
      timer = setTimeout(() => {         // the final state is not lost
        lastRun = Date.now();
        timer = null;
        fn(...args);
      }, remaining);
    }
  };
}

// ── Create it once, outside the handler ───────────────────────────
const debouncedSearch = debounce(search, 300); // not inside the listener
input.addEventListener("input", e => debouncedSearch(e.target.value));`,
      },
      keyTakeaways: [
        { en: "<b>Debounce waits for inactivity</b> before running the function.", np: "<b>Debounce ले निष्क्रियता कुर्छ</b>, अनि मात्र function चलाउँछ।", jp: "<b>デバウンスは動きが止まるのを待って</b>から関数を走らせる。" },
        { en: "<b>Throttle limits how often</b> the function runs during continuous activity.", np: "<b>Throttle ले लगातारको गतिविधिमा</b> function कति पटक चल्छ सीमित गर्छ।", jp: "<b>スロットルは連続動作中の実行頻度</b>を制限する。" },
        { en: "Debounce fits cases where <b>only the final state matters</b> — search, autosave, validation.", np: "<b>अन्तिम अवस्था मात्र महत्वपूर्ण</b> हुने अवस्थामा debounce मिल्छ — search, autosave, validation।", jp: "<b>最終状態だけが重要</b>な場面にデバウンスが向く。検索・自動保存・検証など。" },
        { en: "Throttle fits cases needing <b>regular updates while activity continues</b> — scroll, drag, `mousemove`.", np: "गतिविधि चलिरहँदा <b>नियमित अद्यावधिक</b> चाहिने अवस्थामा throttle मिल्छ — scroll, drag, `mousemove`।", jp: "動作中も<b>定期的な更新</b>が要る場面にスロットルが向く。スクロール・ドラッグ・`mousemove` など。" },
        { en: "Both are built from <b>closures plus timers</b> — the returned function owns the state.", np: "दुबै <b>closure र timer</b> ले बनेका हुन् — फर्केको function ले अवस्था राख्छ।", jp: "どちらも<b>クロージャとタイマー</b>で作られる。状態を持つのは返された関数。" },
        { en: "Creating the wrapper <b>inside</b> the handler destroys its state — build it once.", np: "Handler <b>भित्र</b> wrapper बनाउँदा यसको अवस्था नष्ट हुन्छ — एक पटक मात्र बनाउनुहोस्।", jp: "ハンドラーの<b>中</b>でラッパーを作ると状態が消える。1回だけ作る。" },
        { en: "Debounce can <b>never run</b> if calls keep arriving faster than the delay.", np: "Delay भन्दा छिटो call आइरहे debounce <b>कहिल्यै नचल्न</b> सक्छ।", jp: "遅延より速く呼び出しが続くと、デバウンスは<b>一度も走らない</b>ことがある。" },
        { en: "A production throttle should keep the <b>latest arguments</b> so the final state is not lost.", np: "Production को throttle ले <b>पछिल्ला argument</b> राख्नुपर्छ ताकि अन्तिम अवस्था नगुमोस्।", jp: "実務のスロットルは<b>最後の引数</b>を保持し、最終状態を失わないようにする。" },
      ],
      commonMistakes: [
        { en: "<b>Creating a new debounce on every event</b> — `debounce(search, 300)(value)` inside the listener builds fresh timer state each time, so nothing is ever debounced. Build it once outside.", np: "<b>हरेक event मा नयाँ debounce बनाउनु</b> — listener भित्र `debounce(search, 300)(value)` ले हरेक पटक नयाँ timer अवस्था बनाउँछ, त्यसैले केही पनि debounce हुँदैन। बाहिर एक पटक बनाउनुहोस्।", jp: "<b>イベントごとに新しいデバウンスを作る</b> — リスナー内の `debounce(search, 300)(value)` は毎回タイマー状態を作り直すので、何もデバウンスされない。外で1回作る。" },
        { en: "<b>Forgetting that debounce delays execution</b> — `save(); console.log(\"Done\");` prints `Done` first. `save()` schedules; it does not run now.", np: "<b>Debounce ले execution ढिलो पार्छ भनी बिर्सनु</b> — `save(); console.log(\"Done\");` ले पहिले `Done` देखाउँछ। `save()` ले schedule गर्छ; अहिले चलाउँदैन।", jp: "<b>デバウンスが実行を遅らせることを忘れる</b> — `save(); console.log(\"Done\");` は先に `Done` を出す。`save()` は予約であって即実行ではない。" },
        { en: "<b>Reading throttle as \"exactly once every N ms\"</b> — it means <b>at most</b> once. If the events stop, there may be no further run at all.", np: "<b>Throttle लाई \"ठ्याक्कै प्रति N ms एक पटक\" भनी बुझ्नु</b> — यसको अर्थ <b>बढीमा</b> एक पटक हो। Event रोकिए, थप कुनै run नहुन सक्छ।", jp: "<b>スロットルを「N msごとにちょうど1回」と読む</b> — 意味は<b>最大</b>1回。イベントが止まれば、その後の実行はないかもしれない。" },
        { en: "<b>Debouncing something that needs continuous updates</b> — with events every 100ms and a 300ms delay, the timer resets forever and the handler never fires. Use throttle there.", np: "<b>लगातार अद्यावधिक चाहिने कुरा debounce गर्नु</b> — प्रति 100ms event र 300ms delay भए, timer सधैं रिसेट भइरहन्छ र handler कहिल्यै चल्दैन। त्यहाँ throttle प्रयोग गर्नुहोस्।", jp: "<b>連続更新が要るものをデバウンスする</b> — 100msごとのイベントに300msの遅延だと、タイマーが延々と張り直されハンドラーは一度も走らない。そこはスロットル。" },
      ],
      quiz: [
        {
          question: { en: "What does debounce primarily do?", np: "Debounce ले मुख्यतः के गर्छ?", jp: "デバウンスの主な働きは?" },
          options: [
            { en: "Runs a function continuously", np: "Function लगातार चलाउँछ", jp: "関数を走らせ続ける" },
            { en: "Runs a function after activity stops", np: "गतिविधि रोकिएपछि function चलाउँछ", jp: "動きが止まってから関数を走らせる" },
            { en: "Runs a function every second", np: "हरेक सेकेन्ड function चलाउँछ", jp: "毎秒関数を走らせる" },
            { en: "Runs a function in parallel", np: "Function समानान्तर चलाउँछ", jp: "関数を並列に走らせる" },
          ],
          correctIndex: 1,
          explanation: { en: "Every new call restarts the waiting period.", np: "हरेक नयाँ call ले कुर्ने अवधि पुनः सुरु गर्छ।", jp: "呼ばれるたびに待ち時間が振り出しに戻る。" },
        },
        {
          question: { en: "What does throttle primarily control?", np: "Throttle ले मुख्यतः केको नियन्त्रण गर्छ?", jp: "スロットルが主に制御するものは?" },
          options: [
            { en: "How often the function runs", np: "Function कति पटक चल्छ", jp: "関数が走る頻度" },
            { en: "Promise resolution", np: "Promise को resolution", jp: "Promiseの解決" },
            { en: "Memory usage", np: "Memory प्रयोग", jp: "メモリ使用量" },
            { en: "Function scope", np: "Function को scope", jp: "関数のスコープ" },
          ],
          correctIndex: 0,
          explanation: { en: "It caps the rate: at most one run per interval.", np: "यसले दर सीमित गर्छ: प्रति अन्तराल बढीमा एक पटक।", jp: "レートに上限をかける。間隔ごとに最大1回。" },
        },
        {
          question: { en: "What happens for `const search = debounce(fn, 500); search(); search(); search();`?", np: "`const search = debounce(fn, 500); search(); search(); search();` मा के हुन्छ?", jp: "`const search = debounce(fn, 500); search(); search(); search();` はどうなるか?" },
          options: [
            { en: "It runs three times immediately", np: "यो तुरुन्तै तीन पटक चल्छ", jp: "すぐに3回走る" },
            { en: "It runs once, 500ms after the first call", np: "पहिलो call को 500ms पछि एक पटक चल्छ", jp: "最初の呼び出しから500ms後に1回走る" },
            { en: "Nothing runs", np: "केही चल्दैन", jp: "何も走らない" },
            { en: "It runs once, 500ms after the last call", np: "अन्तिम call को 500ms पछि एक पटक चल्छ", jp: "最後の呼び出しから500ms後に1回走る" },
          ],
          correctIndex: 3,
          explanation: { en: "Each call clears the previous timer and starts a new one.", np: "हरेक call ले अघिल्लो timer मेटाएर नयाँ सुरु गर्छ।", jp: "各呼び出しが前のタイマーを消して新しく張る。" },
        },
        {
          question: { en: "Which is generally better for search-as-you-type?", np: "Search-as-you-type का लागि सामान्यतया कुन राम्रो छ?", jp: "逐次検索に一般に向くのは?" },
          options: [
            { en: "`debounce`", np: "`debounce`", jp: "`debounce`" },
            { en: "`throttle`", np: "`throttle`", jp: "`throttle`" },
            { en: "`setInterval`", np: "`setInterval`", jp: "`setInterval`" },
            { en: "`requestAnimationFrame`", np: "`requestAnimationFrame`", jp: "`requestAnimationFrame`" },
          ],
          correctIndex: 0,
          explanation: { en: "Only the final query matters, so wait for the typing to stop.", np: "अन्तिम query मात्र महत्वपूर्ण छ, त्यसैले type रोकिने कुर्नुहोस्।", jp: "重要なのは最後の入力だけなので、打鍵が止まるのを待つ。" },
        },
        {
          question: { en: "Which is generally better for continuously tracking scroll position?", np: "Scroll position लगातार पछ्याउन सामान्यतया कुन राम्रो छ?", jp: "スクロール位置を継続的に追うのに一般に向くのは?" },
          options: [
            { en: "`debounce`", np: "`debounce`", jp: "`debounce`" },
            { en: "`Promise.all`", np: "`Promise.all`", jp: "`Promise.all`" },
            { en: "`throttle`", np: "`throttle`", jp: "`throttle`" },
            { en: "`queueMicrotask`", np: "`queueMicrotask`", jp: "`queueMicrotask`" },
          ],
          correctIndex: 2,
          explanation: { en: "Debounce would never fire while the user keeps scrolling.", np: "User scroll गरिरहँदा debounce कहिल्यै चल्ने थिएन।", jp: "スクロールし続けている間、デバウンスは一度も走らない。" },
        },
      ],
      youtubeIds: ["Zo-6_qx8uxg", "81NGEXAaa3Y", "tJhA0DrH5co"],
    },
    {
      id: "memoization",
      title: { en: "Memoization", np: "Memoization", jp: "メモ化" },
      durationMinutes: 9,
      explanation: {
        en: "<b>Memoization</b> is an optimization where a function remembers the results of previous calls so it does not repeat the same work.\n\n```text\nInput\n  ↓\nHave we calculated this before?\n  ├── YES → return cached result\n  └── NO  → run function → save result → return result\n```\n\nA generic `memoize(fn)` is a <b>higher-order function</b>: it takes a function and returns a new one that adds caching.\n\n```javascript\nfunction memoize(fn) {\n  const cache = new Map();\n\n  return function (...args) {\n    const key = JSON.stringify(args);\n\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n\n    const result = fn(...args);\n\n    cache.set(key, result);\n\n    return result;\n  };\n}\n```\n\nThe returned function closes over `cache`, so the cache survives between calls.\n\n---\n\n### 1. Basic — cache an expensive calculation\n\n```javascript\nfunction square(n) {\n  console.log(\"Calculating...\");\n  return n * n;\n}\n\nconst memoizedSquare = memoize(square);\n\nconsole.log(memoizedSquare(5));\n// Calculating...\n// 25\n\nconsole.log(memoizedSquare(5));\n// 25\n```\n\n```text\nFirst call:\n5 → calculate → 25 → cache\n\nSecond call:\n5 → cache hit → 25\n```\n\n---\n\n### 2. Intermediate — multiple arguments\n\n```javascript\nfunction add(a, b) {\n  console.log(\"Calculating...\");\n  return a + b;\n}\n\nconst memoizedAdd = memoize(add);\n\nconsole.log(memoizedAdd(10, 20)); // Calculating... 30\nconsole.log(memoizedAdd(10, 20)); // 30\nconsole.log(memoizedAdd(20, 10)); // Calculating... 30\n```\n\nThe arguments are part of the key, so `[10, 20]` and `[20, 10]` are different entries even though both produce `30`.\n\n---\n\n### 3. Advanced — Fibonacci\n\nMemoization pays off most when a function keeps re-solving the same subproblems.\n\n```javascript\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n```\n\n```text\nfibonacci(5)\n       │\n   ┌───┴───┐\n   4       3\n  / \\     / \\\n 3   2   2   1\n/ \\ / \\\n2  1 1  0\n```\n\nThe repeated work grows explosively. With a cache, each value is computed once:\n\n```javascript\nfunction fibonacci(n, cache = new Map()) {\n  if (n <= 1) return n;\n\n  if (cache.has(n)) {\n    return cache.get(n);\n  }\n\n  const result =\n    fibonacci(n - 1, cache) +\n    fibonacci(n - 2, cache);\n\n  cache.set(n, result);\n\n  return result;\n}\n\nconsole.log(fibonacci(40));\n```\n\n```text\nWithout memoization:        With memoization:\n\nfib(40)                     fib(40)\n ├─ fib(39)                  ├─ fib(39)\n │   ├─ fib(38)              │   └─ ...\n │   └─ fib(37)              └─ fib(38) → CACHE HIT\n └─ fib(38) ← again\n```\n\n---\n\n### Memoization needs pure functions\n\nMemoization is safe when the function is <b>pure</b>: the same input always gives the same output, it does not depend on changing external state, and it performs no important side effects.\n\n```javascript\nfunction multiply(a, b) {\n  return a * b;\n}\n```\n\nThat is a good candidate — the result never changes.\n\n<b>Do not memoize `Date.now()`.</b> The output depends on external changing state, so the cache returns a stale value forever.\n\n<b>Do not memoize `Math.random()`.</b> After memoization the second call returns the first random number, which is no longer the function's behaviour.\n\n<b>Do not memoize side effects.</b>\n\n```javascript\nfunction saveUser(user) {\n  database.save(user);\n}\n```\n\nThe point of that function <b>is</b> the side effect. Memoizing it silently skips the save on repeated calls.\n\n---\n\n### Memoization and closures\n\nMemoization works because of closures. `memoize()` returns, but the returned function still reaches its `cache`:\n\n```text\nmemoize()\n   │\n   ├── fn\n   │\n   └── cache ──────────┐\n                       │\n                       ▼\n                 returned function\n                       │\n                 called later\n                       │\n                       ▼\n                 still accesses\n                    cache\n```\n\nThis is closures used to hold private state.\n\n---\n\n### Object arguments and `WeakMap`\n\n`JSON.stringify(args)` is convenient for simple cases, but object arguments raise a memory question. A normal `Map` strongly references its keys:\n\n```javascript\nconst cache = new Map();\n\nconst user = { id: 1 };\n\ncache.set(user, \"result\");\n```\n\nEven after `user = null`, the `Map` keeps the object alive. For object-keyed caching a `WeakMap` lets the collector reclaim it:\n\n```javascript\nconst cache = new WeakMap();\n\nfunction getCachedUser(user) {\n  if (cache.has(user)) {\n    return cache.get(user);\n  }\n\n  const result = expensiveOperation(user);\n\n  cache.set(user, result);\n\n  return result;\n}\n```\n\n---\n\n### Memoization in React\n\n<b>`useMemo`</b> caches a computed <b>value</b>:\n\n```javascript\nconst total = useMemo(() => {\n  return calculateTotal(items);\n}, [items]);\n```\n\n```text\nitems unchanged\n     ↓\nreuse previous result\n\n\nitems changed\n     ↓\ncalculate again\n     ↓\ncache new result\n```\n\n<b>`useCallback`</b> caches a <b>function reference</b>:\n\n```javascript\nconst handleClick = useCallback(() => {\n  saveUser(userId);\n}, [userId]);\n```\n\nThe goal is not to make the function faster. It preserves the function's <b>identity</b> between renders while the dependencies are unchanged.\n\n```text\nuseMemo\n   ↓\nmemoize a VALUE\n\nuseCallback\n   ↓\nmemoize a FUNCTION REFERENCE\n```\n\n---\n\n### Memoization vs caching\n\n<b>Caching</b> is the broad idea of storing data for reuse. <b>Memoization</b> is the specific case where what you cache is `function input → function output`.\n\n---\n\n### Costs to plan for\n\nMemoization is not automatically faster. For a trivial operation, maintaining the cache costs more than redoing the work.\n\nA `Map` cache also grows forever if inputs keep changing:\n\n```text\ncall 1 → cache entry\ncall 2 → cache entry\n...\ncall 1,000,000 → cache entry\n```\n\nProduction memoization usually needs a maximum size, LRU eviction, expiration, manual invalidation, or a `WeakMap` for object keys.\n\nAnd `JSON.stringify()` is not a perfect key. `{ a: 1, b: 2 }` and `{ b: 2, a: 1 }` produce different strings, and it handles `undefined`, functions, symbols and circular references poorly. A production strategy needs a more deliberate keying approach.",
        np: "<b>Memoization</b> त्यस्तो अनुकूलन हो जहाँ function ले अघिल्ला call का नतिजा सम्झन्छ ताकि उही काम नदोहोर्‍याओस्।\n\n```text\nInput\n  ↓\nHave we calculated this before?\n  ├── YES → return cached result\n  └── NO  → run function → save result → return result\n```\n\nसामान्य `memoize(fn)` एउटा <b>higher-order function</b> हो: यसले function लिन्छ र caching थपिएको नयाँ function फर्काउँछ।\n\n```javascript\nfunction memoize(fn) {\n  const cache = new Map();\n\n  return function (...args) {\n    const key = JSON.stringify(args);\n\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n\n    const result = fn(...args);\n\n    cache.set(key, result);\n\n    return result;\n  };\n}\n```\n\nफर्केको function ले `cache` लाई समेट्छ, त्यसैले cache call बीच बाँचिरहन्छ।\n\n---\n\n### 1. आधारभूत — महँगो गणना cache गर्नु\n\n```javascript\nfunction square(n) {\n  console.log(\"Calculating...\");\n  return n * n;\n}\n\nconst memoizedSquare = memoize(square);\n\nconsole.log(memoizedSquare(5));\n// Calculating...\n// 25\n\nconsole.log(memoizedSquare(5));\n// 25\n```\n\n```text\nFirst call:\n5 → calculate → 25 → cache\n\nSecond call:\n5 → cache hit → 25\n```\n\n---\n\n### 2. मध्यम — धेरै argument\n\n```javascript\nfunction add(a, b) {\n  console.log(\"Calculating...\");\n  return a + b;\n}\n\nconst memoizedAdd = memoize(add);\n\nconsole.log(memoizedAdd(10, 20)); // Calculating... 30\nconsole.log(memoizedAdd(10, 20)); // 30\nconsole.log(memoizedAdd(20, 10)); // Calculating... 30\n```\n\nArgument key का भाग हुन्, त्यसैले दुबैले `30` दिए पनि `[10, 20]` र `[20, 10]` फरक entry हुन्।\n\n---\n\n### 3. उन्नत — Fibonacci\n\nFunction ले उही उप-समस्या पटक-पटक हल गर्दा memoization सबैभन्दा बढी काम लाग्छ।\n\n```javascript\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n```\n\n```text\nfibonacci(5)\n       │\n   ┌───┴───┐\n   4       3\n  / \\     / \\\n 3   2   2   1\n/ \\ / \\\n2  1 1  0\n```\n\nदोहोरिने काम विस्फोटक रूपमा बढ्छ। Cache सँग, हरेक मान एक पटक मात्र गणना हुन्छ:\n\n```javascript\nfunction fibonacci(n, cache = new Map()) {\n  if (n <= 1) return n;\n\n  if (cache.has(n)) {\n    return cache.get(n);\n  }\n\n  const result =\n    fibonacci(n - 1, cache) +\n    fibonacci(n - 2, cache);\n\n  cache.set(n, result);\n\n  return result;\n}\n\nconsole.log(fibonacci(40));\n```\n\n```text\nWithout memoization:        With memoization:\n\nfib(40)                     fib(40)\n ├─ fib(39)                  ├─ fib(39)\n │   ├─ fib(38)              │   └─ ...\n │   └─ fib(37)              └─ fib(38) → CACHE HIT\n └─ fib(38) ← again\n```\n\n---\n\n### Memoization लाई pure function चाहिन्छ\n\nFunction <b>pure</b> हुँदा memoization सुरक्षित हुन्छ: उही input ले सधैं उही output दिन्छ, यो बदलिने बाह्य अवस्थामा निर्भर हुँदैन, र यसले महत्वपूर्ण side effect गर्दैन।\n\n```javascript\nfunction multiply(a, b) {\n  return a * b;\n}\n```\n\nयो राम्रो उम्मेदवार हो — नतिजा कहिल्यै बदलिँदैन।\n\n<b>`Date.now()` memoize नगर्नुहोस्।</b> Output बदलिने बाह्य अवस्थामा निर्भर छ, त्यसैले cache ले सधैं बासी मान फर्काउँछ।\n\n<b>`Math.random()` memoize नगर्नुहोस्।</b> Memoize गरेपछि दोस्रो call ले पहिलो random संख्या फर्काउँछ, जुन अब function को व्यवहार होइन।\n\n<b>Side effect memoize नगर्नुहोस्।</b>\n\n```javascript\nfunction saveUser(user) {\n  database.save(user);\n}\n```\n\nत्यो function को सार <b>side effect नै</b> हो। Memoize गर्दा दोहोरिएका call मा save चुपचाप छुट्छ।\n\n---\n\n### Memoization र closure\n\nMemoization closure ले गर्दा काम गर्छ। `memoize()` return हुन्छ, तर फर्केको function ले अझै आफ्नो `cache` सम्म पुग्छ:\n\n```text\nmemoize()\n   │\n   ├── fn\n   │\n   └── cache ──────────┐\n                       │\n                       ▼\n                 returned function\n                       │\n                 called later\n                       │\n                       ▼\n                 still accesses\n                    cache\n```\n\nयो private अवस्था राख्न closure प्रयोग गरिएको उदाहरण हो।\n\n---\n\n### Object argument र `WeakMap`\n\nसरल अवस्थामा `JSON.stringify(args)` सुविधाजनक छ, तर object argument ले memory को प्रश्न उठाउँछ। सामान्य `Map` ले आफ्ना key बलियो गरी जनाउँछ:\n\n```javascript\nconst cache = new Map();\n\nconst user = { id: 1 };\n\ncache.set(user, \"result\");\n```\n\n`user = null` पछि पनि `Map` ले object जीवित राख्छ। Object-key भएको caching मा `WeakMap` ले collector लाई फिर्ता लिन दिन्छ:\n\n```javascript\nconst cache = new WeakMap();\n\nfunction getCachedUser(user) {\n  if (cache.has(user)) {\n    return cache.get(user);\n  }\n\n  const result = expensiveOperation(user);\n\n  cache.set(user, result);\n\n  return result;\n}\n```\n\n---\n\n### React मा memoization\n\n<b>`useMemo`</b> ले गणना गरिएको <b>मान</b> cache गर्छ:\n\n```javascript\nconst total = useMemo(() => {\n  return calculateTotal(items);\n}, [items]);\n```\n\n```text\nitems unchanged\n     ↓\nreuse previous result\n\n\nitems changed\n     ↓\ncalculate again\n     ↓\ncache new result\n```\n\n<b>`useCallback`</b> ले <b>function reference</b> cache गर्छ:\n\n```javascript\nconst handleClick = useCallback(() => {\n  saveUser(userId);\n}, [userId]);\n```\n\nलक्ष्य function छिटो बनाउनु होइन। Dependency नबदलिँदासम्म यसले render बीच function को <b>पहिचान</b> जोगाउँछ।\n\n```text\nuseMemo\n   ↓\nmemoize a VALUE\n\nuseCallback\n   ↓\nmemoize a FUNCTION REFERENCE\n```\n\n---\n\n### Memoization vs caching\n\n<b>Caching</b> पुनःप्रयोगका लागि data राख्ने फराकिलो विचार हो। <b>Memoization</b> त्यो विशेष अवस्था हो जहाँ `function input → function output` cache गरिन्छ।\n\n---\n\n### हिसाब गर्नुपर्ने लागत\n\nMemoization स्वतः छिटो हुँदैन। सामान्य operation का लागि cache चलाउनु काम दोहोर्‍याउनुभन्दा महँगो पर्छ।\n\nInput बदलिइरहे `Map` cache सधैं बढ्छ:\n\n```text\ncall 1 → cache entry\ncall 2 → cache entry\n...\ncall 1,000,000 → cache entry\n```\n\nProduction को memoization लाई प्रायः अधिकतम आकार, LRU eviction, म्याद, हाते invalidation, वा object key का लागि `WeakMap` चाहिन्छ।\n\nअनि `JSON.stringify()` पूर्ण key होइन। `{ a: 1, b: 2 }` र `{ b: 2, a: 1 }` ले फरक string दिन्छन्, र यसले `undefined`, function, symbol र circular reference राम्रोसँग सम्हाल्दैन। Production रणनीतिलाई अझ सोचविचार गरिएको keying चाहिन्छ।",
        jp: "<b>メモ化</b>は、関数が過去の呼び出し結果を覚えておき、同じ計算を繰り返さないようにする最適化です。\n\n```text\nInput\n  ↓\nHave we calculated this before?\n  ├── YES → return cached result\n  └── NO  → run function → save result → return result\n```\n\n汎用の `memoize(fn)` は<b>高階関数</b>です。関数を受け取り、キャッシュを足した新しい関数を返します。\n\n```javascript\nfunction memoize(fn) {\n  const cache = new Map();\n\n  return function (...args) {\n    const key = JSON.stringify(args);\n\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n\n    const result = fn(...args);\n\n    cache.set(key, result);\n\n    return result;\n  };\n}\n```\n\n返された関数が `cache` を閉じ込めるので、キャッシュは呼び出しをまたいで生き続けます。\n\n---\n\n### 1. 基本 — 高価な計算をキャッシュする\n\n```javascript\nfunction square(n) {\n  console.log(\"Calculating...\");\n  return n * n;\n}\n\nconst memoizedSquare = memoize(square);\n\nconsole.log(memoizedSquare(5));\n// Calculating...\n// 25\n\nconsole.log(memoizedSquare(5));\n// 25\n```\n\n```text\nFirst call:\n5 → calculate → 25 → cache\n\nSecond call:\n5 → cache hit → 25\n```\n\n---\n\n### 2. 中級 — 複数の引数\n\n```javascript\nfunction add(a, b) {\n  console.log(\"Calculating...\");\n  return a + b;\n}\n\nconst memoizedAdd = memoize(add);\n\nconsole.log(memoizedAdd(10, 20)); // Calculating... 30\nconsole.log(memoizedAdd(10, 20)); // 30\nconsole.log(memoizedAdd(20, 10)); // Calculating... 30\n```\n\n引数はキーの一部なので、どちらも `30` になっても `[10, 20]` と `[20, 10]` は別の項目です。\n\n---\n\n### 3. 上級 — フィボナッチ\n\n同じ部分問題を何度も解き直す関数で、メモ化は最も効きます。\n\n```javascript\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n```\n\n```text\nfibonacci(5)\n       │\n   ┌───┴───┐\n   4       3\n  / \\     / \\\n 3   2   2   1\n/ \\ / \\\n2  1 1  0\n```\n\n重複する計算は爆発的に増えます。キャッシュがあれば各値は一度だけ計算されます:\n\n```javascript\nfunction fibonacci(n, cache = new Map()) {\n  if (n <= 1) return n;\n\n  if (cache.has(n)) {\n    return cache.get(n);\n  }\n\n  const result =\n    fibonacci(n - 1, cache) +\n    fibonacci(n - 2, cache);\n\n  cache.set(n, result);\n\n  return result;\n}\n\nconsole.log(fibonacci(40));\n```\n\n```text\nWithout memoization:        With memoization:\n\nfib(40)                     fib(40)\n ├─ fib(39)                  ├─ fib(39)\n │   ├─ fib(38)              │   └─ ...\n │   └─ fib(37)              └─ fib(38) → CACHE HIT\n └─ fib(38) ← again\n```\n\n---\n\n### メモ化には純粋関数が要る\n\n関数が<b>純粋</b>なとき、メモ化は安全です。同じ入力なら常に同じ出力で、変化する外部状態に依存せず、重要な副作用を持ちません。\n\n```javascript\nfunction multiply(a, b) {\n  return a * b;\n}\n```\n\nこれは良い候補です。結果は決して変わりません。\n\n<b>`Date.now()` をメモ化しない。</b> 出力が変化する外部状態に依存するので、キャッシュは古い値を返し続けます。\n\n<b>`Math.random()` をメモ化しない。</b> メモ化すると2回目も最初の乱数を返し、もはや元の関数の振る舞いではありません。\n\n<b>副作用をメモ化しない。</b>\n\n```javascript\nfunction saveUser(user) {\n  database.save(user);\n}\n```\n\nこの関数の目的は<b>副作用そのもの</b>です。メモ化すると2回目以降の保存が黙って飛ばされます。\n\n---\n\n### メモ化とクロージャ\n\nメモ化が成り立つのはクロージャのおかげです。`memoize()` は戻りますが、返された関数は今も `cache` に届きます:\n\n```text\nmemoize()\n   │\n   ├── fn\n   │\n   └── cache ──────────┐\n                       │\n                       ▼\n                 returned function\n                       │\n                 called later\n                       │\n                       ▼\n                 still accesses\n                    cache\n```\n\n私的な状態を保つためにクロージャを使う実例です。\n\n---\n\n### オブジェクト引数と `WeakMap`\n\n単純な例なら `JSON.stringify(args)` で足りますが、オブジェクト引数はメモリの問題を生みます。通常の `Map` はキーを強く参照します:\n\n```javascript\nconst cache = new Map();\n\nconst user = { id: 1 };\n\ncache.set(user, \"result\");\n```\n\n`user = null` の後も `Map` がオブジェクトを生かします。オブジェクトをキーにするなら `WeakMap` が回収を許します:\n\n```javascript\nconst cache = new WeakMap();\n\nfunction getCachedUser(user) {\n  if (cache.has(user)) {\n    return cache.get(user);\n  }\n\n  const result = expensiveOperation(user);\n\n  cache.set(user, result);\n\n  return result;\n}\n```\n\n---\n\n### Reactでのメモ化\n\n<b>`useMemo`</b> は計算された<b>値</b>をキャッシュします:\n\n```javascript\nconst total = useMemo(() => {\n  return calculateTotal(items);\n}, [items]);\n```\n\n```text\nitems unchanged\n     ↓\nreuse previous result\n\n\nitems changed\n     ↓\ncalculate again\n     ↓\ncache new result\n```\n\n<b>`useCallback`</b> は<b>関数の参照</b>をキャッシュします:\n\n```javascript\nconst handleClick = useCallback(() => {\n  saveUser(userId);\n}, [userId]);\n```\n\n狙いは関数を速くすることではありません。依存が変わらない間、再レンダー間で関数の<b>同一性</b>を保つことです。\n\n```text\nuseMemo\n   ↓\nmemoize a VALUE\n\nuseCallback\n   ↓\nmemoize a FUNCTION REFERENCE\n```\n\n---\n\n### メモ化とキャッシュ\n\n<b>キャッシュ</b>は再利用のためにデータを保存する広い概念です。<b>メモ化</b>はその中で、`関数の入力 → 関数の出力` を保存する特定のケースです。\n\n---\n\n### 見込んでおくコスト\n\nメモ化は自動的に速くなるものではありません。ごく軽い処理では、キャッシュの維持のほうが計算し直すより高くつきます。\n\n入力が変わり続ければ `Map` のキャッシュは際限なく育ちます:\n\n```text\ncall 1 → cache entry\ncall 2 → cache entry\n...\ncall 1,000,000 → cache entry\n```\n\n実務のメモ化には、上限・LRUの追い出し・期限・手動の無効化、あるいはオブジェクトキー向けの `WeakMap` が要ります。\n\nさらに `JSON.stringify()` は完璧なキーではありません。`{ a: 1, b: 2 }` と `{ b: 2, a: 1 }` は別の文字列になり、`undefined`・関数・シンボル・循環参照の扱いも弱いです。本番ではもっと意図的なキー設計が必要です。",
      },
      diagram: `                memoizedFn(5)
                     │
                     ▼
              JSON.stringify
                  ([5])
                     │
                     ▼
                " [5] "
                     │
              ┌──────┴──────┐
              │             │
          Cache HIT      Cache MISS
              │             │
              ▼             ▼
       return cached      fn(5)
          result            │
                            ▼
                       cache.set()
                            │
                            ▼
                       return result


The cache survives because of a closure

memoize()
   │
   ├── fn
   │
   └── cache ──────────┐
                       │
                       ▼
                 returned function
                       │
                 called later
                       │
                       ▼
                 still accesses cache


Where it pays off

Without memoization         With memoization

fib(40)                     fib(40)
 ├─ fib(39)                  ├─ fib(39)
 │   ├─ fib(38)              │   └─ ...
 │   └─ fib(37)              └─ fib(38) → CACHE HIT
 └─ fib(38) ← again


Two different React hooks

useMemo      →  memoize a VALUE
useCallback  →  memoize a FUNCTION REFERENCE`,
      codeExample: {
        title: { en: "Remembering what you already worked out", np: "पहिले नै निकालेको कुरा सम्झनु", jp: "すでに出した答えを覚えておく" },
        code: `// ── The wrapper: a higher-order function over a closed-over cache ─
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) return cache.get(key);

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// ── 1. Basic — the second call never reaches the function ─────────
const memoizedSquare = memoize(n => {
  console.log("Calculating...");
  return n * n;
});

memoizedSquare(5); // Calculating... 25
memoizedSquare(5); // 25, no log

// ── 2. Intermediate — the arguments are the key ───────────────────
const memoizedAdd = memoize((a, b) => a + b);

memoizedAdd(10, 20); // computed
memoizedAdd(20, 10); // computed again — different key, same result

// ── 3. Advanced — each Fibonacci value computed once ──────────────
function fibonacci(n, cache = new Map()) {
  if (n <= 1) return n;
  if (cache.has(n)) return cache.get(n);

  const result = fibonacci(n - 1, cache) + fibonacci(n - 2, cache);
  cache.set(n, result);
  return result;
}

fibonacci(40); // fast; the naive version re-solves the same subtrees

// ── Poor candidates: the output is supposed to change ─────────────
// memoize(() => Date.now());     // returns the same timestamp forever
// memoize(() => Math.random());  // returns the same number forever
// memoize(user => db.save(user)); // the side effect is the point

// ── Object keys: a WeakMap lets the key be collected ──────────────
const objectCache = new WeakMap();

function getCachedUser(user) {
  if (objectCache.has(user)) return objectCache.get(user);

  const result = expensiveOperation(user);
  objectCache.set(user, result);
  return result;
}

// ── JSON.stringify is a convenient key, not a correct one ─────────
JSON.stringify({ a: 1, b: 2 }); // '{"a":1,"b":2}'
JSON.stringify({ b: 2, a: 1 }); // '{"b":2,"a":1}' — same data, different key`,
      },
      keyTakeaways: [
        { en: "<b>Memoization caches function results</b> so the same input never gets recomputed.", np: "<b>Memoization ले function का नतिजा cache गर्छ</b> ताकि उही input फेरि गणना नहोस्।", jp: "<b>メモ化は関数の結果をキャッシュする</b>ので、同じ入力が再計算されない。" },
        { en: "A `memoize(fn)` wrapper is a <b>higher-order function</b> — it takes a function and returns a new one.", np: "`memoize(fn)` wrapper एउटा <b>higher-order function</b> हो — यसले function लिन्छ र नयाँ फर्काउँछ।", jp: "`memoize(fn)` は<b>高階関数</b>。関数を受け取り、新しい関数を返す。" },
        { en: "It relies on a <b>closure</b> to keep the cache alive between calls.", np: "Call बीच cache जीवित राख्न यो <b>closure</b> मा भर पर्छ।", jp: "呼び出しをまたいでキャッシュを生かすのは<b>クロージャ</b>。" },
        { en: "It is only safe for <b>pure</b> functions — same input, same output, no important side effects.", np: "यो <b>pure</b> function का लागि मात्र सुरक्षित छ — उही input, उही output, महत्वपूर्ण side effect नभएको।", jp: "安全なのは<b>純粋</b>な関数だけ。同じ入力なら同じ出力で、重要な副作用がないもの。" },
        { en: "`Date.now()` and `Math.random()` are poor candidates because their results are meant to change.", np: "`Date.now()` र `Math.random()` राम्रा उम्मेदवार होइनन् किनकि तिनका नतिजा बदलिनुपर्ने हो।", jp: "`Date.now()` や `Math.random()` は結果が変わるべきものなので不適。" },
        { en: "Recursive algorithms such as Fibonacci gain the most, because they re-solve the same subproblems.", np: "Fibonacci जस्ता recursive algorithm ले सबैभन्दा बढी फाइदा पाउँछन्, किनकि तिनले उही उप-समस्या फेरि हल गर्छन्।", jp: "フィボナッチのような再帰は同じ部分問題を解き直すので、最も得をする。" },
        { en: "A `Map` cache keeps object keys alive; use a <b>`WeakMap`</b> for object-keyed caches.", np: "`Map` cache ले object key जीवित राख्छ; object-key भएका cache मा <b>`WeakMap`</b> प्रयोग गर्नुहोस्।", jp: "`Map` はオブジェクトのキーを生かす。オブジェクトをキーにするなら<b>`WeakMap`</b>。" },
        { en: "React's <b>`useMemo`</b> caches a value; <b>`useCallback`</b> caches a function reference.", np: "React को <b>`useMemo`</b> ले मान cache गर्छ; <b>`useCallback`</b> ले function reference।", jp: "Reactの<b>`useMemo`</b> は値を、<b>`useCallback`</b> は関数の参照をキャッシュする。" },
      ],
      commonMistakes: [
        { en: "<b>Memoizing everything</b> — for a trivial calculation, building the key and checking the cache costs more than just redoing the work.", np: "<b>सबै कुरा memoize गर्नु</b> — सामान्य गणनाका लागि key बनाउनु र cache जाँच्नु काम दोहोर्‍याउनुभन्दा महँगो पर्छ।", jp: "<b>何でもメモ化する</b> — 軽い計算では、キーを作ってキャッシュを調べるほうが計算し直すより高くつく。" },
        { en: "<b>Ignoring cache growth</b> — a `Map` with continuously changing inputs never releases anything. Add a size limit, LRU eviction or expiry.", np: "<b>Cache को वृद्धि बेवास्ता गर्नु</b> — लगातार बदलिने input भएको `Map` ले कहिल्यै केही छाड्दैन। आकार सीमा, LRU eviction वा म्याद थप्नुहोस्।", jp: "<b>キャッシュの増大を無視する</b> — 入力が変わり続ける `Map` は何も解放しない。上限・LRU・期限を加える。" },
        { en: "<b>Memoizing changing data</b> — `getUser()` reading from a database returns a stale value forever once cached. Memoization needs a way to know when an entry is still valid.", np: "<b>बदलिने data memoize गर्नु</b> — database बाट पढ्ने `getUser()` एक पटक cache भएपछि सधैं बासी मान फर्काउँछ। Memoization लाई entry अझै मान्य छ कि छैन थाहा पाउने तरिका चाहिन्छ।", jp: "<b>変化するデータをメモ化する</b> — DBを読む `getUser()` は一度キャッシュされると古い値を返し続ける。項目がまだ有効か知る手段が要る。" },
        { en: "<b>Trusting `JSON.stringify()` as a cache key</b> — `{ a: 1, b: 2 }` and `{ b: 2, a: 1 }` stringify differently, and it mishandles `undefined`, functions, symbols and circular references.", np: "<b>`JSON.stringify()` लाई cache key मानी भरोसा गर्नु</b> — `{ a: 1, b: 2 }` र `{ b: 2, a: 1 }` फरक string बन्छन्, र यसले `undefined`, function, symbol र circular reference बिगार्छ।", jp: "<b>`JSON.stringify()` をキーとして信頼する</b> — `{ a: 1, b: 2 }` と `{ b: 2, a: 1 }` は別の文字列になり、`undefined`・関数・シンボル・循環参照の扱いも誤る。" },
      ],
      quiz: [
        {
          question: { en: "What does memoization primarily do?", np: "Memoization ले मुख्यतः के गर्छ?", jp: "メモ化の主な働きは?" },
          options: [
            { en: "Makes a function asynchronous", np: "Function लाई asynchronous बनाउँछ", jp: "関数を非同期にする" },
            { en: "Converts a function into a Promise", np: "Function लाई Promise बनाउँछ", jp: "関数をPromiseに変換する" },
            { en: "Stores previous function results for reuse", np: "अघिल्ला नतिजा पुनःप्रयोगका लागि राख्छ", jp: "過去の結果を保存して再利用する" },
            { en: "Prevents a function from being called", np: "Function बोलाइनबाट रोक्छ", jp: "関数が呼ばれるのを防ぐ" },
          ],
          correctIndex: 2,
          explanation: { en: "The same input then never has to be recomputed.", np: "अनि उही input फेरि गणना गर्नु पर्दैन।", jp: "同じ入力を再計算する必要がなくなる。" },
        },
        {
          question: { en: "Which function is the best candidate for memoization?", np: "Memoization का लागि कुन function उत्तम उम्मेदवार हो?", jp: "メモ化に最も適した関数は?" },
          options: [
            { en: "`() => Math.random()`", np: "`() => Math.random()`", jp: "`() => Math.random()`" },
            { en: "`() => Date.now()`", np: "`() => Date.now()`", jp: "`() => Date.now()`" },
            { en: "`() => database.save()`", np: "`() => database.save()`", jp: "`() => database.save()`" },
            { en: "`(a, b) => a * b`", np: "`(a, b) => a * b`", jp: "`(a, b) => a * b`" },
          ],
          correctIndex: 3,
          explanation: { en: "It is pure: the same arguments always give the same result.", np: "यो pure छ: उही argument ले सधैं उही नतिजा दिन्छ।", jp: "純粋関数で、同じ引数なら常に同じ結果になる。" },
        },
        {
          question: { en: "Why does `memoize()` need a closure?", np: "`memoize()` लाई closure किन चाहिन्छ?", jp: "`memoize()` にクロージャが必要な理由は?" },
          options: [
            { en: "To make the function asynchronous", np: "Function लाई asynchronous बनाउन", jp: "関数を非同期にするため" },
            { en: "To keep the cache alive between calls", np: "Call बीच cache जीवित राख्न", jp: "呼び出しをまたいでキャッシュを生かすため" },
            { en: "To create a Promise", np: "Promise बनाउन", jp: "Promiseを作るため" },
            { en: "To prevent garbage collection", np: "Garbage collection रोक्न", jp: "GCを防ぐため" },
          ],
          correctIndex: 1,
          explanation: { en: "`memoize()` has already returned, but the returned function still reaches its `cache`.", np: "`memoize()` return भइसक्यो, तर फर्केको function ले अझै आफ्नो `cache` सम्म पुग्छ।", jp: "`memoize()` は戻っているが、返された関数は今も `cache` に届く。" },
        },
        {
          question: { en: "For `const fn = memoize(x => x * 2); fn(5); fn(5);`, how many times does the original function run?", np: "`const fn = memoize(x => x * 2); fn(5); fn(5);` मा मूल function कति पटक चल्छ?", jp: "`const fn = memoize(x => x * 2); fn(5); fn(5);` で元の関数は何回走るか?" },
          options: [
            { en: "0", np: "0", jp: "0" },
            { en: "2", np: "2", jp: "2" },
            { en: "1", np: "1", jp: "1" },
            { en: "5", np: "5", jp: "5" },
          ],
          correctIndex: 2,
          explanation: { en: "The second call is served from the cache.", np: "दोस्रो call cache बाट पूरा हुन्छ।", jp: "2回目はキャッシュから返る。" },
        },
        {
          question: { en: "What does React's `useMemo` primarily memoize?", np: "React को `useMemo` ले मुख्यतः के memoize गर्छ?", jp: "Reactの `useMemo` が主にメモ化するものは?" },
          options: [
            { en: "A computed value", np: "गणना गरिएको मान", jp: "計算された値" },
            { en: "A Promise", np: "एउटा Promise", jp: "Promise" },
            { en: "A DOM element", np: "एउटा DOM element", jp: "DOM要素" },
            { en: "An event listener", np: "एउटा event listener", jp: "イベントリスナー" },
          ],
          correctIndex: 0,
          explanation: { en: "`useCallback` is the one that memoizes a function reference.", np: "Function reference memoize गर्ने चाहिँ `useCallback` हो।", jp: "関数の参照をメモ化するのは `useCallback`。" },
        },
      ],
    },
    {
      id: "web-workers",
      title: { en: "Web Workers — Off the Main Thread", np: "Web Workers — Main Thread बाट बाहिर", jp: "Web Workers — メインスレッドから外へ" },
      durationMinutes: 9,
      explanation: {
        en: "JavaScript in the browser runs on a single <b>main thread</b>. That same thread runs your JavaScript, handles user interactions, and does layout, painting and rendering. So one CPU-heavy synchronous task freezes the whole page.\n\n```javascript\nconst numbers = Array.from({ length: 1_000_000 }, () => Math.random());\n\nnumbers.sort((a, b) => a - b);\n```\n\nWhile that runs:\n\n```text\nMain Thread\n\nJavaScript\n    ↓\nHeavy computation\n    ↓\n████████████████████\n    ↓\nNo clicks\nNo rendering\nNo animations\n```\n\nA <b>Web Worker</b> moves JavaScript execution to a separate background thread:\n\n```text\n┌──────────────────────┐\n│      Main Thread     │\n│                      │\n│ UI / DOM / Rendering │\n│                      │\n│  postMessage() ──────┼────────┐\n└──────────────────────┘        │\n                                ▼\n                        ┌────────────────┐\n                        │  Web Worker    │\n                        │                │\n                        │ Heavy compute  │\n                        │ Parsing        │\n                        │ Sorting        │\n                        └────────────────┘\n                                │\n                         postMessage()\n                                │\n                                ▼\n                         Main Thread\n```\n\n> <b>Workers run JavaScript away from the main UI thread, so expensive computation does not block the page.</b>\n\n---\n\n### 1. Basic — create a worker\n\n```javascript\n// worker.js\n\nself.onmessage = (event) => {\n  const result = event.data * 2;\n\n  self.postMessage(result);\n};\n```\n\n```javascript\nconst worker = new Worker(\"worker.js\");\n\nworker.onmessage = (event) => {\n  console.log(\"Result:\", event.data); // Result: 20\n};\n\nworker.postMessage(10);\n```\n\n```text\nMain Thread\n    │\n    │ postMessage(10)\n    ▼\nWorker\n    │\n    │ calculates 10 × 2\n    ▼\n    │ postMessage(20)\n    ▼\nMain Thread\n```\n\nThe worker does <b>not</b> call a function on the main thread. All communication happens through messages.\n\n---\n\n### 2. Intermediate — heavy computation\n\n```javascript\n// worker.js\n\nself.onmessage = (event) => {\n  const numbers = event.data;\n\n  numbers.sort((a, b) => a - b);\n\n  self.postMessage(numbers);\n};\n```\n\n```javascript\nconst worker = new Worker(\"worker.js\");\n\nworker.onmessage = (event) => {\n  console.log(\"Sorted:\", event.data);\n};\n\nworker.postMessage([50, 10, 40, 20, 30]);\n\nconsole.log(\"UI is still responsive\");\n```\n\n```text\nMain Thread                    Worker\n    │                             │\n    │ ─── numbers ──────────────► │\n    │                             │\n    │       UI continues          │ sort()\n    │       rendering             │\n    │       handling clicks       │\n    │                             │\n    │ ◄──── sorted numbers ────── │\n    │                             │\n```\n\n---\n\n### 3. Advanced — transferable objects\n\nData sent through `postMessage()` is normally <b>structured-cloned</b>, which means a copy is made:\n\n```javascript\nworker.postMessage({ name: \"Rajan\", numbers: [1, 2, 3] });\n```\n\n```text\nMain Thread                 Worker\n\ndata ──────── copy ────────► data\n   │                            │\nDifferent objects         Different objects\n```\n\nFor very large binary data, copying is expensive. A second argument makes the buffer <b>transferable</b>:\n\n```javascript\nconst buffer = new ArrayBuffer(100 * 1024 * 1024);\n\nworker.postMessage(buffer, [buffer]);\n```\n\nOwnership moves instead of the bytes being duplicated:\n\n```text\nBefore\n\nMain Thread\n┌──────────────┐\n│ 100 MB       │\n└──────────────┘\n       │\n       │ transfer ownership\n       ▼\nWorker\n┌──────────────┐\n│ 100 MB       │\n└──────────────┘\n```\n\nThe original buffer on the main thread is then <b>detached</b> and can no longer be used.\n\n---\n\n### 4. Advanced — inline worker\n\nYou do not always need a separate file. A worker can be built from a `Blob`:\n\n```javascript\nconst code = `\n  self.onmessage = (event) => {\n    const result = event.data * 2;\n    self.postMessage(result);\n  };\n`;\n\nconst blob = new Blob([code], {\n  type: \"application/javascript\"\n});\n\nconst worker = new Worker(URL.createObjectURL(blob));\n\nworker.onmessage = (event) => {\n  console.log(event.data); // 42\n};\n\nworker.postMessage(21);\n```\n\nUseful when the worker is small and belongs next to the code that creates it.\n\n---\n\n### What a worker can and cannot do\n\nA worker has its own JavaScript environment.\n\n```text\nA worker CAN                    A worker CANNOT directly\n\nrun JavaScript                  access document\nperform calculations            manipulate the DOM\nparse large data                access window\nsort large arrays               change page elements\nprocess files\nuse postMessage()\n```\n\nSo this fails inside `worker.js`:\n\n```javascript\ndocument.querySelector(\"#app\"); // no DOM in a worker\n```\n\nInstead the worker computes and sends the result back:\n\n```text\nWorker\n   │\n   │ \"here is the result\"\n   ▼\nMain Thread\n   │\n   ▼\nDOM\n```\n\n---\n\n### Structured clone vs transfer\n\n```text\nStructured clone                Transferable\n\nworker.postMessage(data)        worker.postMessage(buffer, [buffer])\n\nMain Thread                     Main Thread              Worker\n    │                                │                      │\n    ├── original object              │──── ownership ──────►│\n    │                                │                      │\n    └──── copy ────► Worker          X                      ok\n                                 no longer owns         owns buffer\n```\n\nMutating the worker's copy never affects the original. Transferables are for large `ArrayBuffer` data where copying would be the bottleneck.\n\n---\n\n### Terminating a worker\n\nA worker consumes resources even when idle. Stop it when the work is done:\n\n```javascript\nconst worker = new Worker(\"worker.js\");\n\nworker.onmessage = (event) => {\n  console.log(event.data);\n\n  worker.terminate();\n};\n\nworker.postMessage(100);\n```\n\nTreat a worker like a resource you explicitly start and explicitly clean up.\n\n---\n\n### Main thread vs worker\n\n```text\nTask                      Main Thread        Web Worker\nDOM manipulation          yes                no\nUI rendering              yes                no\nHandling clicks           yes                no\nHeavy calculations        blocks the UI      yes\nParsing large data        blocks the UI      yes\nDirect document access    yes                no\nCommunication             direct             postMessage()\n```\n\n---\n\n### When to reach for one\n\nDo not put every piece of JavaScript in a worker. They pay off when the computation is CPU-intensive enough to noticeably block the main thread:\n\n```text\nLarge JSON parsing\nImage processing\nAudio and video processing\nCryptographic calculations\nLarge data transformations\nComplex mathematics\nSorting huge datasets\n```\n\nThe goal is not \"put JavaScript on another thread\". The goal is <b>\"move expensive CPU work away from the thread responsible for keeping the UI responsive\"</b>.",
        np: "Browser को JavaScript एउटै <b>main thread</b> मा चल्छ। त्यही thread ले तपाईंको JavaScript चलाउँछ, user अन्तरक्रिया सम्हाल्छ, र layout, paint तथा rendering गर्छ। त्यसैले एउटा CPU-भारी synchronous काले पूरै page जमाइदिन्छ।\n\n```javascript\nconst numbers = Array.from({ length: 1_000_000 }, () => Math.random());\n\nnumbers.sort((a, b) => a - b);\n```\n\nयो चल्दा:\n\n```text\nMain Thread\n\nJavaScript\n    ↓\nHeavy computation\n    ↓\n████████████████████\n    ↓\nNo clicks\nNo rendering\nNo animations\n```\n\n<b>Web Worker</b> ले JavaScript execution छुट्टै background thread मा सार्छ:\n\n```text\n┌──────────────────────┐\n│      Main Thread     │\n│                      │\n│ UI / DOM / Rendering │\n│                      │\n│  postMessage() ──────┼────────┐\n└──────────────────────┘        │\n                                ▼\n                        ┌────────────────┐\n                        │  Web Worker    │\n                        │                │\n                        │ Heavy compute  │\n                        │ Parsing        │\n                        │ Sorting        │\n                        └────────────────┘\n                                │\n                         postMessage()\n                                │\n                                ▼\n                         Main Thread\n```\n\n> <b>Worker ले JavaScript लाई मुख्य UI thread बाहिर चलाउँछ, त्यसैले महँगो गणनाले page रोक्दैन।</b>\n\n---\n\n### 1. आधारभूत — worker बनाउनु\n\n```javascript\n// worker.js\n\nself.onmessage = (event) => {\n  const result = event.data * 2;\n\n  self.postMessage(result);\n};\n```\n\n```javascript\nconst worker = new Worker(\"worker.js\");\n\nworker.onmessage = (event) => {\n  console.log(\"Result:\", event.data); // Result: 20\n};\n\nworker.postMessage(10);\n```\n\n```text\nMain Thread\n    │\n    │ postMessage(10)\n    ▼\nWorker\n    │\n    │ calculates 10 × 2\n    ▼\n    │ postMessage(20)\n    ▼\nMain Thread\n```\n\nWorker ले main thread को function <b>बोलाउँदैन</b>। सबै सञ्चार message मार्फत हुन्छ।\n\n---\n\n### 2. मध्यम — भारी गणना\n\n```javascript\n// worker.js\n\nself.onmessage = (event) => {\n  const numbers = event.data;\n\n  numbers.sort((a, b) => a - b);\n\n  self.postMessage(numbers);\n};\n```\n\n```javascript\nconst worker = new Worker(\"worker.js\");\n\nworker.onmessage = (event) => {\n  console.log(\"Sorted:\", event.data);\n};\n\nworker.postMessage([50, 10, 40, 20, 30]);\n\nconsole.log(\"UI is still responsive\");\n```\n\n```text\nMain Thread                    Worker\n    │                             │\n    │ ─── numbers ──────────────► │\n    │                             │\n    │       UI continues          │ sort()\n    │       rendering             │\n    │       handling clicks       │\n    │                             │\n    │ ◄──── sorted numbers ────── │\n    │                             │\n```\n\n---\n\n### 3. उन्नत — transferable object\n\n`postMessage()` बाट पठाइएको data सामान्यतया <b>structured-clone</b> हुन्छ, अर्थात् copy बन्छ:\n\n```javascript\nworker.postMessage({ name: \"Rajan\", numbers: [1, 2, 3] });\n```\n\n```text\nMain Thread                 Worker\n\ndata ──────── copy ────────► data\n   │                            │\nDifferent objects         Different objects\n```\n\nधेरै ठूलो binary data मा copy गर्नु महँगो हुन्छ। दोस्रो argument ले buffer लाई <b>transferable</b> बनाउँछ:\n\n```javascript\nconst buffer = new ArrayBuffer(100 * 1024 * 1024);\n\nworker.postMessage(buffer, [buffer]);\n```\n\nByte नक्कल हुनुको सट्टा स्वामित्व सर्छ:\n\n```text\nBefore\n\nMain Thread\n┌──────────────┐\n│ 100 MB       │\n└──────────────┘\n       │\n       │ transfer ownership\n       ▼\nWorker\n┌──────────────┐\n│ 100 MB       │\n└──────────────┘\n```\n\nअनि main thread को मूल buffer <b>detach</b> हुन्छ र प्रयोग गर्न मिल्दैन।\n\n---\n\n### 4. उन्नत — inline worker\n\nसधैं छुट्टै file चाहिँदैन। `Blob` बाट worker बनाउन सकिन्छ:\n\n```javascript\nconst code = `\n  self.onmessage = (event) => {\n    const result = event.data * 2;\n    self.postMessage(result);\n  };\n`;\n\nconst blob = new Blob([code], {\n  type: \"application/javascript\"\n});\n\nconst worker = new Worker(URL.createObjectURL(blob));\n\nworker.onmessage = (event) => {\n  console.log(event.data); // 42\n};\n\nworker.postMessage(21);\n```\n\nWorker सानो छ र यसलाई बनाउने code कै छेउमा राख्नुपर्दा उपयोगी।\n\n---\n\n### Worker ले के गर्न सक्छ, के सक्दैन\n\nWorker सँग आफ्नै JavaScript वातावरण हुन्छ।\n\n```text\nWorker ले सक्छ                  Worker ले सिधै सक्दैन\n\nJavaScript चलाउन                document पहुँच गर्न\nगणना गर्न                       DOM बदल्न\nठूलो data parse गर्न            window पहुँच गर्न\nठूलो array sort गर्न            page का element बदल्न\nFile process गर्न\npostMessage() प्रयोग गर्न\n```\n\nत्यसैले `worker.js` भित्र यो असफल हुन्छ:\n\n```javascript\ndocument.querySelector(\"#app\"); // worker मा DOM छैन\n```\n\nबरु worker ले गणना गरेर नतिजा फर्काउँछ:\n\n```text\nWorker\n   │\n   │ \"here is the result\"\n   ▼\nMain Thread\n   │\n   ▼\nDOM\n```\n\n---\n\n### Structured clone vs transfer\n\n```text\nStructured clone                Transferable\n\nworker.postMessage(data)        worker.postMessage(buffer, [buffer])\n\nMain Thread                     Main Thread              Worker\n    │                                │                      │\n    ├── original object              │──── ownership ──────►│\n    │                                │                      │\n    └──── copy ────► Worker          X                      ok\n                                 अब स्वामित्व छैन        buffer को स्वामी\n```\n\nWorker को copy बदल्दा मूललाई असर पर्दैन। Transferable ठूलो `ArrayBuffer` का लागि हो, जहाँ copy नै अवरोध बन्थ्यो।\n\n---\n\n### Worker रोक्नु\n\nWorker निष्क्रिय हुँदा पनि संसाधन खान्छ। काम सकिएपछि रोक्नुहोस्:\n\n```javascript\nconst worker = new Worker(\"worker.js\");\n\nworker.onmessage = (event) => {\n  console.log(event.data);\n\n  worker.terminate();\n};\n\nworker.postMessage(100);\n```\n\nWorker लाई स्पष्ट रूपमा सुरु गरी स्पष्ट रूपमा सफा गर्नुपर्ने संसाधन ठान्नुहोस्।\n\n---\n\n### Main thread vs worker\n\n```text\nकाम                       Main Thread        Web Worker\nDOM बदल्नु                सक्छ               सक्दैन\nUI rendering              सक्छ               सक्दैन\nClick सम्हाल्नु           सक्छ               सक्दैन\nभारी गणना                 UI रोक्छ           सक्छ\nठूलो data parse           UI रोक्छ           सक्छ\nसिधै document पहुँच       सक्छ               सक्दैन\nसञ्चार                    सिधै               postMessage()\n```\n\n---\n\n### कहिले प्रयोग गर्ने\n\nहरेक JavaScript worker मा नहाल्नुहोस्। गणना यति CPU-भारी हुँदा मात्र फाइदा हुन्छ कि यसले main thread लाई देखिने गरी रोक्छ:\n\n```text\nठूलो JSON parsing\nImage processing\nAudio र video processing\nCryptographic गणना\nठूलो data रूपान्तरण\nजटिल गणित\nविशाल dataset sort गर्नु\n```\n\nलक्ष्य \"JavaScript अर्को thread मा हाल्नु\" होइन। लक्ष्य <b>\"UI लाई प्रतिक्रियाशील राख्ने thread बाट महँगो CPU काम पर सार्नु\"</b> हो।",
        jp: "ブラウザのJavaScriptは単一の<b>メインスレッド</b>で動きます。同じスレッドがJavaScriptの実行、ユーザー操作、レイアウト・描画・レンダリングを担います。だからCPUを食う同期処理が1つあるだけでページ全体が固まります。\n\n```javascript\nconst numbers = Array.from({ length: 1_000_000 }, () => Math.random());\n\nnumbers.sort((a, b) => a - b);\n```\n\nこれが動いている間:\n\n```text\nMain Thread\n\nJavaScript\n    ↓\nHeavy computation\n    ↓\n████████████████████\n    ↓\nNo clicks\nNo rendering\nNo animations\n```\n\n<b>Web Worker</b> はJavaScriptの実行を別のバックグラウンドスレッドへ移します:\n\n```text\n┌──────────────────────┐\n│      Main Thread     │\n│                      │\n│ UI / DOM / Rendering │\n│                      │\n│  postMessage() ──────┼────────┐\n└──────────────────────┘        │\n                                ▼\n                        ┌────────────────┐\n                        │  Web Worker    │\n                        │                │\n                        │ Heavy compute  │\n                        │ Parsing        │\n                        │ Sorting        │\n                        └────────────────┘\n                                │\n                         postMessage()\n                                │\n                                ▼\n                         Main Thread\n```\n\n> <b>ワーカーはUIのメインスレッドから離れてJavaScriptを走らせるので、重い計算がページを止めない。</b>\n\n---\n\n### 1. 基本 — ワーカーを作る\n\n```javascript\n// worker.js\n\nself.onmessage = (event) => {\n  const result = event.data * 2;\n\n  self.postMessage(result);\n};\n```\n\n```javascript\nconst worker = new Worker(\"worker.js\");\n\nworker.onmessage = (event) => {\n  console.log(\"Result:\", event.data); // Result: 20\n};\n\nworker.postMessage(10);\n```\n\n```text\nMain Thread\n    │\n    │ postMessage(10)\n    ▼\nWorker\n    │\n    │ calculates 10 × 2\n    ▼\n    │ postMessage(20)\n    ▼\nMain Thread\n```\n\nワーカーがメインスレッドの関数を<b>呼ぶことはありません</b>。やり取りはすべてメッセージ経由です。\n\n---\n\n### 2. 中級 — 重い計算\n\n```javascript\n// worker.js\n\nself.onmessage = (event) => {\n  const numbers = event.data;\n\n  numbers.sort((a, b) => a - b);\n\n  self.postMessage(numbers);\n};\n```\n\n```javascript\nconst worker = new Worker(\"worker.js\");\n\nworker.onmessage = (event) => {\n  console.log(\"Sorted:\", event.data);\n};\n\nworker.postMessage([50, 10, 40, 20, 30]);\n\nconsole.log(\"UI is still responsive\");\n```\n\n```text\nMain Thread                    Worker\n    │                             │\n    │ ─── numbers ──────────────► │\n    │                             │\n    │       UI continues          │ sort()\n    │       rendering             │\n    │       handling clicks       │\n    │                             │\n    │ ◄──── sorted numbers ────── │\n    │                             │\n```\n\n---\n\n### 3. 上級 — 転送可能オブジェクト\n\n`postMessage()` で送るデータは通常<b>構造化複製</b>されます。つまりコピーが作られます:\n\n```javascript\nworker.postMessage({ name: \"Rajan\", numbers: [1, 2, 3] });\n```\n\n```text\nMain Thread                 Worker\n\ndata ──────── copy ────────► data\n   │                            │\nDifferent objects         Different objects\n```\n\n巨大なバイナリではコピーが高くつきます。第2引数でバッファを<b>転送可能</b>にできます:\n\n```javascript\nconst buffer = new ArrayBuffer(100 * 1024 * 1024);\n\nworker.postMessage(buffer, [buffer]);\n```\n\nバイト列を複製せず、所有権が移ります:\n\n```text\nBefore\n\nMain Thread\n┌──────────────┐\n│ 100 MB       │\n└──────────────┘\n       │\n       │ transfer ownership\n       ▼\nWorker\n┌──────────────┐\n│ 100 MB       │\n└──────────────┘\n```\n\nメインスレッド側の元のバッファは<b>切り離され</b>、以後は使えません。\n\n---\n\n### 4. 上級 — インラインワーカー\n\n別ファイルが常に必要なわけではありません。`Blob` からも作れます:\n\n```javascript\nconst code = `\n  self.onmessage = (event) => {\n    const result = event.data * 2;\n    self.postMessage(result);\n  };\n`;\n\nconst blob = new Blob([code], {\n  type: \"application/javascript\"\n});\n\nconst worker = new Worker(URL.createObjectURL(blob));\n\nworker.onmessage = (event) => {\n  console.log(event.data); // 42\n};\n\nworker.postMessage(21);\n```\n\nワーカーが小さく、生成側のコードのそばに置きたいときに便利です。\n\n---\n\n### ワーカーにできること、できないこと\n\nワーカーは独自のJavaScript環境を持ちます。\n\n```text\nできる                          直接はできない\n\nJavaScriptの実行                documentへのアクセス\n計算                            DOMの操作\n大きなデータの解析              windowへのアクセス\n大きな配列のソート              ページ要素の変更\nファイルの処理\npostMessage()の利用\n```\n\nなので `worker.js` の中でこれは失敗します:\n\n```javascript\ndocument.querySelector(\"#app\"); // ワーカーにDOMはない\n```\n\n代わりにワーカーは計算し、結果を返します:\n\n```text\nWorker\n   │\n   │ \"here is the result\"\n   ▼\nMain Thread\n   │\n   ▼\nDOM\n```\n\n---\n\n### 構造化複製と転送\n\n```text\nStructured clone                Transferable\n\nworker.postMessage(data)        worker.postMessage(buffer, [buffer])\n\nMain Thread                     Main Thread              Worker\n    │                                │                      │\n    ├── original object              │──── ownership ──────►│\n    │                                │                      │\n    └──── copy ────► Worker          X                      ok\n                                 所有権を失う           バッファを所有\n```\n\nワーカー側のコピーを書き換えても元には影響しません。転送はコピーが律速になるような巨大な `ArrayBuffer` のためのものです。\n\n---\n\n### ワーカーを止める\n\nワーカーは待機中も資源を使います。仕事が終わったら止めます:\n\n```javascript\nconst worker = new Worker(\"worker.js\");\n\nworker.onmessage = (event) => {\n  console.log(event.data);\n\n  worker.terminate();\n};\n\nworker.postMessage(100);\n```\n\n明示的に起動し、明示的に片付ける資源として扱います。\n\n---\n\n### メインスレッドとワーカー\n\n```text\n作業                      メインスレッド      Web Worker\nDOM操作                   できる              できない\nUIの描画                  できる              できない\nクリックの処理            できる              できない\n重い計算                  UIを止める          できる\n大きなデータの解析        UIを止める          できる\ndocumentへの直接アクセス  できる              できない\nやり取り                  直接                postMessage()\n```\n\n---\n\n### いつ使うか\n\nすべてのJavaScriptをワーカーに入れる必要はありません。メインスレッドを目に見えて止めるほどCPUを使うときに効きます:\n\n```text\n大きなJSONの解析\n画像処理\n音声・動画処理\n暗号計算\n大規模なデータ変換\n複雑な数学\n巨大データのソート\n```\n\n目的は「JavaScriptを別スレッドに置くこと」ではありません。目的は<b>「UIの応答性を保つスレッドから、重いCPU作業を追い出すこと」</b>です。",
      },
      diagram: `┌──────────────────────┐
│      Main Thread     │
│                      │
│ UI / DOM / Rendering │
│                      │
│  postMessage() ──────┼────────┐
└──────────────────────┘        │
                                ▼
                        ┌────────────────┐
                        │  Web Worker    │
                        │ Heavy compute  │
                        │ Parsing        │
                        │ Sorting        │
                        └────────────────┘
                                │
                         postMessage()
                                │
                                ▼
                         Main Thread


The UI keeps running while the worker works

Main Thread                    Worker
    │                             │
    │ ─── numbers ──────────────► │
    │                             │
    │       UI continues          │ sort()
    │       rendering             │
    │       handling clicks       │
    │                             │
    │ ◄──── sorted numbers ────── │


Copy, or hand over

Structured clone              Transferable

Main Thread                   Main Thread          Worker
    │                              │                  │
    ├── original                   │─── ownership ───►│
    │                              │                  │
    └── copy ────► Worker          X                 ok
                              no longer owns    owns the buffer


A worker computes, the main thread paints

Worker
   │
   │ "here is the result"
   ▼
Main Thread
   │
   ▼
DOM`,
      codeExample: {
        title: { en: "Handing the heavy work to another thread", np: "भारी काम अर्को thread लाई सुम्पनु", jp: "重い仕事を別スレッドへ渡す" },
        code: `// ── 1. Basic — a worker file talks only in messages ───────────────
// worker.js
self.onmessage = (event) => {
  self.postMessage(event.data * 2);
};

// main thread
const worker = new Worker("worker.js");

worker.onmessage = (event) => console.log("Result:", event.data); // 20
worker.postMessage(10);

// ── 2. Intermediate — the sort no longer freezes the page ─────────
// worker.js
self.onmessage = (event) => {
  const numbers = event.data;
  numbers.sort((a, b) => a - b); // heavy work, off the main thread
  self.postMessage(numbers);
};

worker.postMessage([50, 10, 40, 20, 30]);
console.log("UI is still responsive");

// ── 3. Advanced — transfer instead of copying 100 MB ──────────────
const buffer = new ArrayBuffer(100 * 1024 * 1024);

worker.postMessage(buffer, [buffer]); // ownership moves
// buffer is now detached on this side and cannot be used

// ── 4. Advanced — an inline worker from a Blob ────────────────────
const code = \`
  self.onmessage = (event) => {
    self.postMessage(event.data * 2);
  };
\`;

const blob = new Blob([code], { type: "application/javascript" });
const inline = new Worker(URL.createObjectURL(blob));

// ── No DOM inside a worker: send the result back instead ──────────
// worker.js
// document.querySelector("#app"); // fails, there is no document here

worker.onmessage = (event) => {
  document.querySelector("#app").textContent = event.data; // main thread
};

// ── Terminate when the work is done ───────────────────────────────
worker.terminate();`,
      },
      keyTakeaways: [
        { en: "A <b>Web Worker</b> runs JavaScript on a separate thread, so CPU-heavy work does not block the UI.", np: "<b>Web Worker</b> ले JavaScript छुट्टै thread मा चलाउँछ, त्यसैले CPU-भारी काले UI रोक्दैन।", jp: "<b>Web Worker</b> は別スレッドでJavaScriptを走らせるので、重い処理がUIを止めない。" },
        { en: "The main thread and a worker communicate only through <b>`postMessage()`</b> and message events.", np: "Main thread र worker <b>`postMessage()`</b> तथा message event मार्फत मात्र कुरा गर्छन्।", jp: "メインスレッドとワーカーは<b>`postMessage()`</b> とメッセージイベントだけでやり取りする。" },
        { en: "Data is normally copied using the <b>structured clone</b> algorithm, so the worker gets its own object.", np: "Data सामान्यतया <b>structured clone</b> ले copy हुन्छ, त्यसैले worker ले आफ्नै object पाउँछ।", jp: "データは通常<b>構造化複製</b>でコピーされ、ワーカーは自分のオブジェクトを受け取る。" },
        { en: "A large `ArrayBuffer` can be sent as a <b>transferable</b> — ownership moves and the sender's buffer is detached.", np: "ठूलो `ArrayBuffer` <b>transferable</b> का रूपमा पठाउन सकिन्छ — स्वामित्व सर्छ र पठाउनेको buffer detach हुन्छ।", jp: "大きな `ArrayBuffer` は<b>転送可能</b>として送れる。所有権が移り、送信側のバッファは切り離される。" },
        { en: "Workers <b>cannot touch the DOM</b>, `document` or `window` — they compute and send results back.", np: "Worker ले <b>DOM छुन सक्दैन</b>, न `document`, न `window` — तिनी गणना गरी नतिजा फर्काउँछन्।", jp: "ワーカーは<b>DOM</b>・`document`・`window` に触れない。計算して結果を返すだけ。" },
        { en: "Call <b>`worker.terminate()`</b> when the work is done; an idle worker still holds resources.", np: "काम सकिएपछि <b>`worker.terminate()`</b> बोलाउनुहोस्; निष्क्रिय worker ले पनि संसाधन ओगट्छ।", jp: "作業が終わったら<b>`worker.terminate()`</b> を呼ぶ。待機中のワーカーも資源を持つ。" },
        { en: "Use workers for <b>CPU-heavy work</b> — parsing, image and audio processing, crypto, sorting huge datasets — not for ordinary logic.", np: "<b>CPU-भारी काम</b> का लागि worker प्रयोग गर्नुहोस् — parsing, image र audio processing, crypto, विशाल dataset sort — सामान्य logic का लागि होइन।", jp: "ワーカーは<b>CPUを食う作業</b>に使う。解析・画像や音声の処理・暗号・巨大データのソートなど。通常のロジックには不要。" },
      ],
      commonMistakes: [
        { en: "<b>Trying to touch the DOM from a worker</b> — `document.querySelector(\"#app\")` inside `worker.js` fails. Send the result back and let the main thread update the page.", np: "<b>Worker बाट DOM छुन खोज्नु</b> — `worker.js` भित्र `document.querySelector(\"#app\")` असफल हुन्छ। नतिजा फर्काउनुहोस् र page main thread ले अद्यावधिक गरोस्।", jp: "<b>ワーカーからDOMを触ろうとする</b> — `worker.js` 内の `document.querySelector(\"#app\")` は失敗する。結果を返し、更新はメインスレッドに任せる。" },
        { en: "<b>Assuming objects are shared</b> — the worker receives a structured-cloned copy, not a reference. Mutating it never affects the original.", np: "<b>Object बाँडिन्छ भन्ने ठान्नु</b> — worker ले reference होइन, structured-clone गरिएको copy पाउँछ। यसलाई बदल्दा मूललाई असर पर्दैन।", jp: "<b>オブジェクトが共有されると思う</b> — ワーカーが受け取るのは参照ではなく構造化複製のコピー。書き換えても元には影響しない。" },
        { en: "<b>Forgetting to terminate workers</b> — creating them repeatedly without `worker.terminate()` leaves idle threads holding resources.", np: "<b>Worker रोक्न बिर्सनु</b> — `worker.terminate()` नगरी बारम्बार बनाउँदा निष्क्रिय thread ले संसाधन ओगटिरहन्छन्।", jp: "<b>ワーカーを終了し忘れる</b> — `worker.terminate()` せずに作り続けると、待機中のスレッドが資源を抱え込む。" },
        { en: "<b>Copying huge buffers unnecessarily</b> — `worker.postMessage(hugeBuffer)` clones every byte. Pass it as a transferable and remember the sender loses access.", np: "<b>अनावश्यक रूपमा ठूलो buffer copy गर्नु</b> — `worker.postMessage(hugeBuffer)` ले हरेक byte नक्कल गर्छ। Transferable बनाएर पठाउनुहोस् र पठाउनेले पहुँच गुमाउँछ भनी सम्झनुहोस्।", jp: "<b>巨大なバッファを無駄にコピーする</b> — `worker.postMessage(hugeBuffer)` は全バイトを複製する。転送可能として渡し、送信側は使えなくなる点に注意する。" },
      ],
      quiz: [
        {
          question: { en: "What problem do Web Workers primarily solve?", np: "Web Worker ले मुख्यतः कुन समस्या हल गर्छ?", jp: "Web Workerが主に解決する問題は?" },
          options: [
            { en: "They make HTTP requests faster", np: "तिनले HTTP request छिटो बनाउँछन्", jp: "HTTPリクエストを速くする" },
            { en: "They let JavaScript run without blocking the main UI thread", np: "तिनले मुख्य UI thread नरोकी JavaScript चलाउन दिन्छन्", jp: "UIのメインスレッドを止めずにJavaScriptを走らせる" },
            { en: "They replace Promises", np: "तिनले Promise प्रतिस्थापन गर्छन्", jp: "Promiseを置き換える" },
            { en: "They provide direct DOM access", np: "तिनले सिधै DOM पहुँच दिन्छन्", jp: "DOMへの直接アクセスを提供する" },
          ],
          correctIndex: 1,
          explanation: { en: "The main thread stays free for clicks, layout and painting.", np: "Main thread click, layout र paint का लागि खाली रहन्छ।", jp: "メインスレッドはクリック・レイアウト・描画のために空く。" },
        },
        {
          question: { en: "How does the main thread communicate with a worker?", np: "Main thread ले worker सँग कसरी कुरा गर्छ?", jp: "メインスレッドはワーカーとどう通信するか?" },
          options: [
            { en: "`postMessage()`", np: "`postMessage()`", jp: "`postMessage()`" },
            { en: "`invoke()`", np: "`invoke()`", jp: "`invoke()`" },
            { en: "`call()`", np: "`call()`", jp: "`call()`" },
            { en: "`sendToWorker()`", np: "`sendToWorker()`", jp: "`sendToWorker()`" },
          ],
          correctIndex: 0,
          explanation: { en: "A worker never calls a function on the main thread directly.", np: "Worker ले main thread को function कहिल्यै सिधै बोलाउँदैन।", jp: "ワーカーがメインスレッドの関数を直接呼ぶことはない。" },
        },
        {
          question: { en: "Can a Web Worker directly access the DOM?", np: "के Web Worker ले सिधै DOM पहुँच गर्न सक्छ?", jp: "Web WorkerはDOMに直接アクセスできるか?" },
          options: [
            { en: "Yes", np: "सक्छ", jp: "できる" },
            { en: "No", np: "सक्दैन", jp: "できない" },
            { en: "Only when using `async`", np: "`async` प्रयोग गर्दा मात्र", jp: "`async` を使うときだけ" },
            { en: "Only through `document.worker`", np: "`document.worker` मार्फत मात्र", jp: "`document.worker` 経由でのみ" },
          ],
          correctIndex: 1,
          explanation: { en: "It computes and posts the result back for the main thread to apply.", np: "यसले गणना गरी नतिजा फर्काउँछ, र main thread ले लागू गर्छ।", jp: "計算して結果を返し、反映はメインスレッドが行う。" },
        },
        {
          question: { en: "What happens to an object sent through `postMessage()` normally?", np: "`postMessage()` बाट पठाइएको object लाई सामान्यतया के हुन्छ?", jp: "`postMessage()` で送ったオブジェクトは通常どうなるか?" },
          options: [
            { en: "Both threads share the same reference", np: "दुबै thread ले उही reference बाँड्छन्", jp: "両スレッドが同じ参照を共有する" },
            { en: "It is converted to JSON", np: "यो JSON मा बदलिन्छ", jp: "JSONに変換される" },
            { en: "It is structured-cloned", np: "यो structured-clone हुन्छ", jp: "構造化複製される" },
            { en: "It becomes immutable", np: "यो अपरिवर्तनीय बन्छ", jp: "変更不可になる" },
          ],
          correctIndex: 2,
          explanation: { en: "The worker gets its own copy, so mutating it is invisible to the sender.", np: "Worker ले आफ्नै copy पाउँछ, त्यसैले यसलाई बदल्दा पठाउनेले देख्दैन।", jp: "ワーカーは自分のコピーを持つので、書き換えても送信側には見えない。" },
        },
        {
          question: { en: "Why would you send an `ArrayBuffer` as a transferable?", np: "`ArrayBuffer` लाई transferable बनाएर किन पठाउने?", jp: "`ArrayBuffer` を転送可能として送る理由は?" },
          options: [
            { en: "To make it immutable", np: "यसलाई अपरिवर्तनीय बनाउन", jp: "変更不可にするため" },
            { en: "To allow DOM access", np: "DOM पहुँच दिन", jp: "DOMアクセスを許すため" },
            { en: "To convert it into a string", np: "यसलाई string बनाउन", jp: "文字列に変換するため" },
            { en: "To move ownership without copying the data", np: "Data copy नगरी स्वामित्व सार्न", jp: "データを複製せず所有権を移すため" },
          ],
          correctIndex: 3,
          explanation: { en: "The sender's buffer is detached afterwards and cannot be used.", np: "त्यसपछि पठाउनेको buffer detach हुन्छ र प्रयोग गर्न मिल्दैन।", jp: "その後、送信側のバッファは切り離されて使えなくなる。" },
        },
        {
          question: { en: "What does `worker.terminate()` do?", np: "`worker.terminate()` ले के गर्छ?", jp: "`worker.terminate()` は何をするか?" },
          options: [
            { en: "Pauses the worker", np: "Worker रोक्छ (अस्थायी)", jp: "ワーカーを一時停止する" },
            { en: "Restarts the worker", np: "Worker फेरि सुरु गर्छ", jp: "ワーカーを再起動する" },
            { en: "Sends a message to the worker", np: "Worker लाई message पठाउँछ", jp: "ワーカーへメッセージを送る" },
            { en: "Stops the worker and releases its resources", np: "Worker रोक्छ र यसका संसाधन छाड्छ", jp: "ワーカーを停止し資源を解放する" },
          ],
          correctIndex: 3,
          explanation: { en: "An idle worker still holds resources, so terminate it when done.", np: "निष्क्रिय worker ले पनि संसाधन ओगट्छ, त्यसैले सकिएपछि रोक्नुहोस्।", jp: "待機中でも資源を持つので、終わったら停止する。" },
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: { en: "What does debounce do?", np: "Debounce ले के गर्छ?", jp: "デバウンスは何をするか?" },
      options: [
        { en: "Runs the function after activity stops", np: "गतिविधि रोकिएपछि function चलाउँछ", jp: "動きが止まってから関数を走らせる" },
        { en: "Runs the function on a fixed schedule", np: "निश्चित तालिकामा function चलाउँछ", jp: "決まった間隔で関数を走らせる" },
        { en: "Runs the function on every event", np: "हरेक event मा function चलाउँछ", jp: "イベントのたびに関数を走らせる" },
      ],
      correctIndex: 0,
      explanation: { en: "Every new call restarts the waiting period.", np: "हरेक नयाँ call ले कुर्ने अवधि पुनः सुरु गर्छ।", jp: "呼ばれるたびに待ち時間が振り出しに戻る。" },
    },
    {
      question: { en: "What does throttle guarantee?", np: "Throttle ले केको ग्यारेन्टी गर्छ?", jp: "スロットルが保証するものは?" },
      options: [
        { en: "Exactly one run per interval", np: "प्रति अन्तराल ठ्याक्कै एक पटक", jp: "間隔ごとにちょうど1回" },
        { en: "At most one run per interval", np: "प्रति अन्तराल बढीमा एक पटक", jp: "間隔ごとに最大1回" },
        { en: "That the function never runs twice", np: "Function दुई पटक कहिल्यै नचल्ने", jp: "関数が2回走らないこと" },
      ],
      correctIndex: 1,
      explanation: { en: "If the events stop, there may be no further run at all.", np: "Event रोकिए, थप कुनै run नहुन सक्छ।", jp: "イベントが止まれば、その後の実行はないかもしれない。" },
    },
    {
      question: { en: "Which is right for search-as-you-type, and which for scroll tracking?", np: "Search-as-you-type लाई कुन, र scroll tracking लाई कुन?", jp: "逐次検索とスクロール追跡には、それぞれどちらが向くか?" },
      options: [
        { en: "Debounce for search, throttle for scroll", np: "Search लाई debounce, scroll लाई throttle", jp: "検索にデバウンス、スクロールにスロットル" },
        { en: "Throttle for search, debounce for scroll", np: "Search लाई throttle, scroll लाई debounce", jp: "検索にスロットル、スクロールにデバウンス" },
        { en: "Debounce for both", np: "दुबैका लागि debounce", jp: "どちらもデバウンス" },
      ],
      correctIndex: 0,
      explanation: { en: "Search wants the final query; scrolling wants regular updates.", np: "Search लाई अन्तिम query चाहिन्छ; scroll लाई नियमित अद्यावधिक।", jp: "検索は最後の入力を、スクロールは定期的な更新を求める。" },
    },
    {
      question: { en: "Why must a debounced function be created outside the event handler?", np: "Debounce गरिएको function event handler बाहिर किन बनाउनुपर्छ?", jp: "デバウンスした関数をハンドラーの外で作るべき理由は?" },
      options: [
        { en: "It would run synchronously", np: "यो synchronously चल्ने थियो", jp: "同期的に走ってしまうから" },
        { en: "Handlers cannot call closures", np: "Handler ले closure बोलाउन सक्दैन", jp: "ハンドラーはクロージャを呼べないから" },
        { en: "Creating it inside builds fresh timer state on every event", np: "भित्र बनाउँदा हरेक event मा नयाँ timer अवस्था बन्छ", jp: "中で作るとイベントごとにタイマー状態が作り直されるから" },
      ],
      correctIndex: 2,
      explanation: { en: "With no shared timer, nothing is ever actually debounced.", np: "साझा timer नभएपछि, वास्तवमा केही पनि debounce हुँदैन।", jp: "共有のタイマーがなければ、実際には何もデバウンスされない。" },
    },
    {
      question: { en: "When can a debounced function never run at all?", np: "Debounce गरिएको function कहिले कहिल्यै नचल्न सक्छ?", jp: "デバウンスした関数が一度も走らないのはどんなときか?" },
      options: [
        { en: "When calls keep arriving faster than the delay", np: "Delay भन्दा छिटो call आइरहँदा", jp: "遅延より速く呼び出しが続くとき" },
        { en: "When the delay is under 100ms", np: "Delay 100ms भन्दा कम हुँदा", jp: "遅延が100ms未満のとき" },
        { en: "When it is used with `async` functions", np: "यसलाई `async` function सँग प्रयोग गर्दा", jp: "`async` 関数と使うとき" },
      ],
      correctIndex: 0,
      explanation: { en: "Each call resets the timer, so throttle fits continuous activity better.", np: "हरेक call ले timer रिसेट गर्छ, त्यसैले लगातारको गतिविधिमा throttle बढी मिल्छ।", jp: "呼び出しごとにタイマーが戻るので、連続動作にはスロットルが合う。" },
    },
    {
      question: { en: "What does memoization cache?", np: "Memoization ले के cache गर्छ?", jp: "メモ化が保存するものは?" },
      options: [
        { en: "The call stack frames", np: "Call stack का frame", jp: "コールスタックのフレーム" },
        { en: "The function's source code", np: "Function को source code", jp: "関数のソースコード" },
        { en: "The mapping from function input to function output", np: "Function input देखि output सम्मको सम्बन्ध", jp: "関数の入力から出力への対応" },
      ],
      correctIndex: 2,
      explanation: { en: "It is a specific kind of caching, keyed by the arguments.", np: "यो caching को एक विशेष रूप हो, argument ले key बनाइएको।", jp: "引数をキーにした、キャッシュの特定の形。" },
    },
    {
      question: { en: "Which function should you <b>not</b> memoize?", np: "कुन function memoize <b>नगर्नुपर्ने</b> हो?", jp: "メモ化<b>すべきでない</b>関数は?" },
      options: [
        { en: "`(a, b) => a * b`", np: "`(a, b) => a * b`", jp: "`(a, b) => a * b`" },
        { en: "`n => n * n`", np: "`n => n * n`", jp: "`n => n * n`" },
        { en: "`() => Math.random()`", np: "`() => Math.random()`", jp: "`() => Math.random()`" },
      ],
      correctIndex: 2,
      explanation: { en: "Its output is meant to change; the cache would freeze the first value.", np: "यसको output बदलिनुपर्ने हो; cache ले पहिलो मान नै जमाइदिन्छ।", jp: "出力は変わるべきもの。キャッシュが最初の値を固定してしまう。" },
    },
    {
      question: { en: "Why does a `memoize()` wrapper need a closure?", np: "`memoize()` wrapper लाई closure किन चाहिन्छ?", jp: "`memoize()` にクロージャが要るのはなぜか?" },
      options: [
        { en: "To make the wrapped function asynchronous", np: "बेरिएको function asynchronous बनाउन", jp: "包んだ関数を非同期にするため" },
        { en: "To keep the cache reachable between calls", np: "Call बीच cache पुग्न सकिने राख्न", jp: "呼び出しをまたいでキャッシュを到達可能に保つため" },
        { en: "To bind `this` correctly", np: "`this` सही गरी bind गर्न", jp: "`this` を正しく束縛するため" },
      ],
      correctIndex: 1,
      explanation: { en: "`memoize()` has returned, but its `cache` is still reachable.", np: "`memoize()` return भइसक्यो, तर यसको `cache` अझै पुग्न सकिने छ।", jp: "`memoize()` は戻っているが、その `cache` にはまだ到達できる。" },
    },
    {
      question: { en: "What is the difference between React's `useMemo` and `useCallback`?", np: "React को `useMemo` र `useCallback` बीचको भिन्नता के हो?", jp: "Reactの `useMemo` と `useCallback` の違いは?" },
      options: [
        { en: "`useMemo` is for async work, `useCallback` for sync work", np: "`useMemo` async काम का लागि, `useCallback` sync का लागि", jp: "`useMemo` は非同期、`useCallback` は同期のため" },
        { en: "`useMemo` caches a value, `useCallback` caches a function reference", np: "`useMemo` ले मान cache गर्छ, `useCallback` ले function reference", jp: "`useMemo` は値を、`useCallback` は関数の参照をキャッシュする" },
        { en: "They are interchangeable", np: "ती साटासाट गर्न मिल्छ", jp: "互いに置き換え可能" },
      ],
      correctIndex: 1,
      explanation: { en: "`useCallback` preserves identity between renders, not speed.", np: "`useCallback` ले render बीच पहिचान जोगाउँछ, गति होइन।", jp: "`useCallback` が守るのは速度ではなく再レンダー間の同一性。" },
    },
    {
      question: { en: "Why is an unbounded memoization cache a risk?", np: "सीमारहित memoization cache किन जोखिम हो?", jp: "上限のないメモ化キャッシュが危険なのはなぜか?" },
      options: [
        { en: "It breaks pure functions", np: "यसले pure function बिगार्छ", jp: "純粋関数を壊すから" },
        { en: "It makes every call slower", np: "यसले हरेक call ढिलो बनाउँछ", jp: "すべての呼び出しが遅くなるから" },
        { en: "It grows forever when the inputs keep changing", np: "Input बदलिइरहँदा यो सधैं बढ्छ", jp: "入力が変わり続けると際限なく育つから" },
      ],
      correctIndex: 2,
      explanation: { en: "Add a size limit, LRU eviction or expiry before shipping it.", np: "पठाउनुअघि आकार सीमा, LRU eviction वा म्याद थप्नुहोस्।", jp: "出す前に上限・LRU・期限を加える。" },
    },
    {
      question: { en: "What problem does a Web Worker solve?", np: "Web Worker ले कुन समस्या हल गर्छ?", jp: "Web Workerが解決する問題は?" },
      options: [
        { en: "Large bundle sizes", np: "ठूलो bundle आकार", jp: "大きなバンドルサイズ" },
        { en: "Slow network requests", np: "ढिलो network request", jp: "遅いネットワーク要求" },
        { en: "CPU-heavy JavaScript blocking the UI thread", np: "CPU-भारी JavaScript ले UI thread रोक्नु", jp: "CPUを食うJavaScriptがUIスレッドを止めること" },
      ],
      correctIndex: 2,
      explanation: { en: "The main thread stays free for clicks, layout and painting.", np: "Main thread click, layout र paint का लागि खाली रहन्छ।", jp: "メインスレッドはクリック・レイアウト・描画のために空く。" },
    },
    {
      question: { en: "What can a worker <b>not</b> do?", np: "Worker ले के गर्न <b>सक्दैन</b>?", jp: "ワーカーに<b>できない</b>ことは?" },
      options: [
        { en: "Touch the DOM directly", np: "सिधै DOM छुन", jp: "DOMに直接触れる" },
        { en: "Sort a large array", np: "ठूलो array sort गर्न", jp: "大きな配列をソートする" },
        { en: "Send messages to the main thread", np: "Main thread लाई message पठाउन", jp: "メインスレッドへメッセージを送る" },
      ],
      correctIndex: 0,
      explanation: { en: "It posts the result back and the main thread updates the page.", np: "यसले नतिजा फर्काउँछ र main thread ले page अद्यावधिक गर्छ।", jp: "結果を返し、ページの更新はメインスレッドが行う。" },
    },
    {
      question: { en: "How is data normally passed to a worker?", np: "Worker लाई data सामान्यतया कसरी पठाइन्छ?", jp: "ワーカーへのデータは通常どう渡されるか?" },
      options: [
        { en: "By reference, so both threads share the object", np: "Reference ले, त्यसैले दुबै thread ले object बाँड्छन्", jp: "参照渡しで、両スレッドが共有する" },
        { en: "By structured clone, so the worker gets a copy", np: "Structured clone ले, त्यसैले worker ले copy पाउँछ", jp: "構造化複製で、ワーカーはコピーを受け取る" },
        { en: "As a JSON string only", np: "JSON string का रूपमा मात्र", jp: "JSON文字列としてのみ" },
      ],
      correctIndex: 1,
      explanation: { en: "A large `ArrayBuffer` can instead be transferred to avoid the copy.", np: "ठूलो `ArrayBuffer` बरु transfer गरेर copy जोगाउन सकिन्छ।", jp: "大きな `ArrayBuffer` は転送してコピーを避けられる。" },
    },
    {
      question: { en: "What happens to an `ArrayBuffer` after it is transferred?", np: "Transfer भएपछि `ArrayBuffer` लाई के हुन्छ?", jp: "転送された後の `ArrayBuffer` はどうなるか?" },
      options: [
        { en: "Both sides can use it", np: "दुबै पक्षले प्रयोग गर्न सक्छन्", jp: "両側が使える" },
        { en: "The sender's buffer is detached and unusable", np: "पठाउनेको buffer detach हुन्छ र प्रयोग गर्न मिल्दैन", jp: "送信側のバッファは切り離され使えない" },
        { en: "It is automatically copied back", np: "यो स्वतः फिर्ता copy हुन्छ", jp: "自動的にコピーが戻る" },
      ],
      correctIndex: 1,
      explanation: { en: "That is the trade for not copying the bytes.", np: "Byte नक्कल नगर्नुको बदला यही हो।", jp: "バイト列を複製しない代わりの取引。" },
    },
    {
      question: { en: "What should you do when a worker's job is finished?", np: "Worker को काम सकिएपछि के गर्नुपर्छ?", jp: "ワーカーの仕事が終わったら何をすべきか?" },
      options: [
        { en: "Call `worker.terminate()`", np: "`worker.terminate()` बोलाउनु", jp: "`worker.terminate()` を呼ぶ" },
        { en: "Set the worker to `null`", np: "Worker लाई `null` बनाउनु", jp: "ワーカーに `null` を代入する" },
        { en: "Nothing, it stops on its own", np: "केही होइन, यो आफैं रोकिन्छ", jp: "何もしない。自然に止まる" },
      ],
      correctIndex: 0,
      explanation: { en: "An idle worker still holds a thread and its resources.", np: "निष्क्रिय worker ले पनि thread र यसका संसाधन ओगट्छ।", jp: "待機中のワーカーもスレッドと資源を抱えている。" },
    },
  ],
};
