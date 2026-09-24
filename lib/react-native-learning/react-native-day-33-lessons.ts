import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_33_LESSONS = normalizePastedLessonDay({
  "day": 33,
  "title": "Production Observability",
  "overview": "**Goal:** By the end of this day, you should understand how production applications tell you that something is broken, distinguish JavaScript errors from native crashes, investigate ANRs, read symbolicated crash reports, and attach enough release/environment context to know exactly what users are running.",
  "totalMinutes": 60,
  "difficulty": "Intermediate",
  "lessons": [
    {
      "id": "rn33-1",
      "title": "What is observability?",
      "durationMinutes": 3,
      "explanation": "When you're developing locally, you can see:\n\n```text\nterminal\nMetro\nReact Native DevTools\nXcode\nadb logcat\n```\n\nBut imagine your application is being used by:\n\n```text\n10,000 users\n```\n\nYou can't sit next to every user's computer and watch their terminal.\n\nYou need the application to report useful information back to you.\n\nThat's **observability**.\n\nConceptually:\n\n```text\n                   Production app\n                        |\n         +--------------+--------------+\n         |              |              |\n         v              v              v\n       Errors        Performance     Events\n         |              |              |\n         +--------------+--------------+\n                        |\n                        v\n               Observability system\n                        |\n                        v\n                 Engineering team\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-2",
      "title": "Why production debugging is different",
      "durationMinutes": 3,
      "explanation": "Development:\n\n```text\nSomething crashes\n     |\n     v\nLook at terminal\n```\n\nProduction:\n\n```text\nUser's phone\n     |\n     v\nSomething crashes\n     |\n     v\nYou are not there\n```\n\nSo you need:\n\n```text\ncrash reports\nstack traces\nrelease information\ndevice information\nbreadcrumbs\nperformance data\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-3",
      "title": "Crash reporting",
      "durationMinutes": 2,
      "explanation": "Tools such as:\n\n* Sentry\n* Bugsnag\n\ncan collect information about application failures.\n\nThe important concept isn't the specific vendor.\n\nIt's this:\n\n```text\nApp\n|\n| error occurs\nv\nCrash/error SDK\n|\nv\nBackend\n|\nv\nDashboard\n|\nv\nDeveloper\n```\n\nThis gives you visibility into failures that happen outside your development machine.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-4",
      "title": "JavaScript errors vs native crashes",
      "durationMinutes": 2,
      "explanation": "This distinction is extremely important.\n\n### JavaScript error\n\nExample:\n\n```tsx\nconst user = undefined;\n\nreturn <Text>{user.name}</Text>;\n```\n\nYou might get:\n\n```text\nTypeError:\nCannot read properties of undefined\n```\n\nThat's a JavaScript runtime error.\n\n---\n\n### Native crash\n\nA native module might crash the application below the JavaScript layer.\n\nFor example:\n\n```text\nReact Native\n   |\n   v\nNative module\n   |\n   v\niOS / Android\n   |\n   X\nCrash\n```\n\nJavaScript may never get an opportunity to handle it.\n\nSo:\n\n```text\nJS error\n   ≠\nnative crash\n```\n\nYour observability system needs to handle both.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-5",
      "title": "Why this distinction matters",
      "durationMinutes": 2,
      "explanation": "Suppose your dashboard shows:\n\n```text\nCrash count: 100\n```\n\nYou shouldn't immediately treat all 100 crashes as the same problem.\n\nYou need to know:\n\n```text\n100\n|\n+-- 60 JS errors\n|\n+-- 40 native crashes\n```\n\nThen investigate each failure mode appropriately.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-6",
      "title": "Breadcrumbs",
      "durationMinutes": 2,
      "explanation": "A crash stack tells you **where something failed**.\n\nA breadcrumb can help tell you:\n\n> **What happened before it failed?**\n\nImagine:\n\n```text\nUser opened Profile\n       ↓\nTapped Edit\n       ↓\nSelected Avatar\n       ↓\nOpened Camera\n       ↓\nCamera permission requested\n       ↓\nCrash\n```\n\nThose previous events can be recorded as breadcrumbs.\n\nConceptually:\n\n```text\nBreadcrumbs\n\n09:41:02 Open Profile\n09:41:05 Tap Edit\n09:41:08 Open Avatar picker\n09:41:10 Open Camera\n09:41:10 Permission request\n09:41:11 Crash\n```\n\nNow the crash has context.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-7",
      "title": "Why breadcrumbs are useful",
      "durationMinutes": 2,
      "explanation": "Without breadcrumbs:\n\n```text\nCrash:\nCameraModule.swift:142\n```\n\nWith breadcrumbs:\n\n```text\nCrash:\nCameraModule.swift:142\n\nPrevious actions:\nProfile\nEdit Profile\nAvatar\nCamera\nPermission request\n```\n\nYou have a much better starting point for reproduction.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-8",
      "title": "Don't record everything",
      "durationMinutes": 2,
      "explanation": "More observability data isn't automatically better.\n\nImagine recording:\n\n```text\nevery tap\nevery keystroke\nevery API response\nevery screen\nevery piece of user data\n```\n\nYou could create:\n\n```text\nprivacy problems\nhuge data volume\nnoisy dashboards\nhigher costs\n```\n\nInstead, capture useful context.\n\nFor example:\n\n```text\nscreen: Profile\naction: open_avatar_picker\noperation: camera_permission\n```\n\nrather than:\n\n```text\npassword: \"...\"\n```\n\nNever treat sensitive user information as harmless debugging data.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-9",
      "title": "Release health",
      "durationMinutes": 2,
      "explanation": "A crash count by itself isn't enough.\n\nImagine:\n\n```text\nVersion 1.0\n100,000 sessions\n20 crashes\n\nVersion 1.1\n5,000 sessions\n50 crashes\n```\n\nThe raw crash count doesn't tell the whole story.\n\nYou want release-health information such as:\n\n```text\ncrash-free users\ncrash-free sessions\naffected users\nerror frequency\nversion distribution\n```\n\nThis helps you understand whether a newly released version introduced a problem.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-10",
      "title": "Release health mental model",
      "durationMinutes": 2,
      "explanation": "Think:\n\n```text\nRelease 1.4.0\n      |\n      +-- sessions\n      +-- users\n      +-- crashes\n      +-- errors\n      +-- performance\n```\n\nThen compare it with:\n\n```text\nRelease 1.3.2\n```\n\nThis helps answer questions such as:\n\n> Did this problem start after the latest release?\n\nThat's much more useful than:\n\n> How many crashes happened today?",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-11",
      "title": "Performance monitoring",
      "durationMinutes": 2,
      "explanation": "Errors aren't the only production problem.\n\nYour app might never crash but still feel terrible.\n\nFor example:\n\n```text\nstartup = 5 seconds\n```\n\nThe application technically works.\n\nUsers may still hate the experience.\n\nSo observability should also include performance.\n\nUseful measurements include:\n\n```text\nstartup time\nscreen rendering\nnavigation performance\nnetwork requests\nAPI latency\nslow operations\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-12",
      "title": "Startup performance",
      "durationMinutes": 2,
      "explanation": "You learned about cold starts on Day 31.\n\nIn production, you want actual measurements.\n\nFor example:\n\n```text\nApp startup\n\np50 → 1.4s\np90 → 2.8s\np99 → 5.7s\n```\n\n**p50** means the median.\n\n**p90** means 90% of measurements are at or below that value.\n\n**p99** means 99% are at or below that value.\n\nThe exact metrics available depend on the monitoring system.\n\nThe important lesson:\n\n> Don't only measure the average.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-13",
      "title": "Network performance",
      "durationMinutes": 2,
      "explanation": "Imagine users report:\n\n> \"The profile screen is slow.\"\n\nYou might discover:\n\n```text\nUI rendering: 100ms\nAPI request: 2.8s\n```\n\nThe React UI isn't the problem.\n\nThe network request is.\n\nObservability can help expose this.\n\n```text\nProfile screen\n     |\n     +-- render: 100ms\n     |\n     +-- GET /profile: 2.8s\n```\n\nNow you know where to investigate.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-14",
      "title": "Per-screen performance",
      "durationMinutes": 2,
      "explanation": "Instead of saying:\n\n```text\nApp performance = slow\n```\n\nyou want more specific information:\n\n```text\nHome: 420ms\nSearch: 180ms\nProfile: 1.8s\nCheckout: 600ms\n```\n\nThen you can investigate the actual problematic area.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-15",
      "title": "ANR on Android",
      "durationMinutes": 2,
      "explanation": "**ANR** means **Application Not Responding**.\n\nIt happens when Android detects that the application isn't responding appropriately for long enough.\n\nConceptually:\n\n```text\nUser interaction\n     |\n     v\nApplication should respond\n     |\n     X\nToo much blocking work\n     |\n     v\nAndroid detects unresponsiveness\n     |\n     v\nANR\n```\n\nAn ANR is not necessarily the same thing as a crash.\n\n```text\nCrash:\nApplication terminates unexpectedly.\n\n\nANR:\nApplication becomes unresponsive.\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-16",
      "title": "What can cause ANRs?",
      "durationMinutes": 2,
      "explanation": "Potential causes include:\n\n```text\nblocking native work\nheavy synchronous operations\ndatabase work on the wrong thread\nexpensive startup work\nnative module problems\ndeadlocks\n```\n\nThe exact cause depends on the application and Android stack.\n\nThe important debugging question is:\n\n> **What was blocking the application when Android decided it wasn't responding?**",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-17",
      "title": "Why ANRs matter",
      "durationMinutes": 2,
      "explanation": "Imagine:\n\n```text\nApp doesn't crash\n```\n\nYou might think:\n\n> \"Everything is fine.\"\n\nBut users experience:\n\n```text\nTap\n↓\nnothing happens\n↓\nwait\n↓\nwait\n↓\nAndroid says app isn't responding\n```\n\nFrom the user's perspective, that's still a serious production problem.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-18",
      "title": "Native crash symbolication in production",
      "durationMinutes": 2,
      "explanation": "You saw symbolication on Day 30.\n\nNow apply it to production.\n\nA production crash might initially look like:\n\n```text\n0x0000000108AC21\n0x0000000108AC44\n0x0000000108AC92\n```\n\nYou need the appropriate symbols to translate those addresses into useful information.\n\n```text\nRaw crash\n   |\n   v\nSymbols\n   |\n   v\nSymbolicated stack\n   |\n   v\nNative file/function\n```\n\nFor iOS and Android, the exact symbol files and workflow differ.\n\nThe important production requirement is:\n\n> **Keep the symbols needed to understand the binaries you shipped.**",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-19",
      "title": "JavaScript source maps in production",
      "durationMinutes": 2,
      "explanation": "You also need source maps for JavaScript errors.\n\nWithout them:\n\n```text\nbundle.js\nline 1\ncolumn 38291\n```\n\nWith correct source maps:\n\n```text\nProfileScreen.tsx\nline 84\n```\n\nConceptually:\n\n```text\nProduction JS error\n       |\n       v\nminified/bundled stack\n       |\n       v\nsource map\n       |\n       v\noriginal source\n```\n\nThis is why source-map management is part of your release process.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-20",
      "title": "Release tagging",
      "durationMinutes": 2,
      "explanation": "Imagine you receive:\n\n```text\nTypeError in ProfileScreen.tsx:84\n```\n\nGood.\n\nBut you also need to know:\n\n```text\nWhich version?\n```\n\nFor example:\n\n```text\nversion: 2.4.1\nbuild: 184\n```\n\nThis tells you what users were actually running.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-21",
      "title": "Environment tagging",
      "durationMinutes": 2,
      "explanation": "Now imagine you have:\n\n```text\ndevelopment\nstaging\nproduction\n```\n\nAn error occurring in staging shouldn't necessarily be treated the same as one affecting production users.\n\nInclude environment information:\n\n```text\nenvironment: production\nversion: 2.4.1\nbuild: 184\nplatform: iOS\n```\n\nNow the error becomes much more useful.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-22",
      "title": "A useful production error",
      "durationMinutes": 2,
      "explanation": "Instead of:\n\n```text\nTypeError\n```\n\nyou ideally want something closer to:\n\n```text\nError:\nCannot read properties of undefined\n\nFile:\nProfileScreen.tsx\n\nLine:\n84\n\nVersion:\n2.4.1\n\nBuild:\n184\n\nEnvironment:\nproduction\n\nPlatform:\niOS\n\nOS:\niOS 19.x\n\nDevice:\niPhone ...\n\n```\n\nThe exact fields depend on your observability setup.\n\nThe principle is:\n\n> **An error should tell you what the user was running when it happened.**",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-23",
      "title": "User/session context",
      "durationMinutes": 2,
      "explanation": "Sometimes the same error happens for many users.\n\nYou may want safe context such as:\n\n```text\nuser/session identifier\nscreen\nenvironment\nversion\ndevice\nplatform\n```\n\nBut this needs to be **privacy-aware**.\n\nDon't blindly attach:\n\n```text\npassword\naccess token\ncredit card\nmedical information\nprivate messages\n```\n\nto crash reports.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-24",
      "title": "Use identifiers, not sensitive data",
      "durationMinutes": 2,
      "explanation": "Instead of:\n\n```text\nemail: rajan@example.com\n```\n\nyou may be able to use an internal identifier such as:\n\n```text\nuserId: 18392\n```\n\ndepending on your application's privacy requirements.\n\nThe goal is:\n\n```text\nUseful for debugging\n       +\nMinimal necessary personal information\n```\n\nYou should also understand your organization's privacy policy and applicable legal requirements before deciding what context to collect.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-25",
      "title": "A production observability pipeline",
      "durationMinutes": 2,
      "explanation": "Think of your app like this:\n\n```text\n                   Mobile App\n                      |\n       +--------------+--------------+\n       |              |              |\n       v              v              v\n     JS errors     Native crashes   Performance\n       |              |              |\n       +--------------+--------------+\n                      |\n                      v\n             Observability SDK\n                      |\n                      v\n                   Backend\n                      |\n       +--------------+--------------+\n       |              |              |\n       v              v              v\n    Errors        Performance     Release health\n       |\n       v\n   Developer\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-26",
      "title": "What happens when a production crash occurs?",
      "durationMinutes": 2,
      "explanation": "A useful workflow is:\n\n```text\nUser experiences crash\n       |\n       v\nCrash report arrives\n       |\n       v\nIdentify:\nversion\nbuild\nenvironment\nplatform\ndevice\n       |\n       v\nRead stack trace\n       |\n       v\nSymbolicate native stack\nor\nresolve JS source map\n       |\n       v\nCheck breadcrumbs\n       |\n       v\nReproduce\n       |\n       v\nFix\n       |\n       v\nRelease\n       |\n       v\nVerify crash rate\n```\n\nThat is production debugging.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-27",
      "title": "JS crash vs native crash example",
      "durationMinutes": 2,
      "explanation": "### JavaScript crash\n\n```text\nUser opens Profile\n       ↓\nProfile API returns unexpected data\n       ↓\nProfileScreen.tsx:84\n       ↓\nTypeError\n```\n\nYou investigate:\n\n```text\nJS stack\n+\nsource map\n+\nbreadcrumbs\n+\nAPI context\n```\n\n---\n\n### Native crash\n\n```text\nUser opens camera\n       ↓\nNative camera module\n       ↓\niOS native crash\n```\n\nYou investigate:\n\n```text\nnative crash report\n+\nsymbolicated stack\n+\ndevice/OS\n+\nbreadcrumbs\n+\nrelease/build\n```\n\nDifferent failure layer.\n\nDifferent debugging evidence.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-28",
      "title": "Why release information is critical",
      "durationMinutes": 2,
      "explanation": "Imagine your production dashboard says:\n\n```text\nProfileScreen crashed.\n```\n\nYou fix it.\n\nBut then you discover:\n\n```text\nThe crash only exists in version 4.2.0.\n```\n\nIf you don't know which version generated the report, you waste time investigating code that isn't even running for the affected user.\n\nSo every production error should have useful release metadata.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    },
    {
      "id": "rn33-29",
      "title": "Day 33 mental model",
      "durationMinutes": 2,
      "explanation": "Remember this:\n\n```text\n                 Production\n                    |\n         +----------+----------+\n         |          |          |\n         v          v          v\n       Errors   Performance   ANRs\n         |          |          |\n         v          v          v\n      Context    Metrics     Native data\n         |          |          |\n         +----------+----------+\n                    |\n                    v\n            Release metadata\n                    |\n         +----------+----------+\n         |                     |\n         v                     v\n     JS source maps       Native symbols\n         |                     |\n         +----------+----------+\n                    |\n                    v\n               Root cause\n```\n\nThe goal isn't simply:\n\n> \"Collect lots of logs.\"\n\nThe goal is:\n\n> **When something goes wrong in production, have enough trustworthy context to reproduce and fix it.**",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [],
      "commonMistakes": [],
      "quiz": []
    }
  ],
  "finalQuiz": [
    {
      "question": "What is observability?",
      "options": [
        "A. The ability to understand application behavior from production signals",
        "B. Only collecting console logs",
        "C. Only counting downloads",
        "D. Only running unit tests"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why is production debugging different from local debugging?",
      "options": [
        "A. You need trustworthy context from devices and releases you cannot inspect directly",
        "B. Production has no errors",
        "C. Source maps are unnecessary",
        "D. Native crashes cannot occur"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does crash reporting capture?",
      "options": [
        "A. Errors, stacks, device context, and release information",
        "B. Only UI colors",
        "C. Only build commands",
        "D. Only route names"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why distinguish JavaScript errors from native crashes?",
      "options": [
        "A. They require different stacks, symbols, and debugging paths",
        "B. They use different button colors",
        "C. JavaScript cannot fail",
        "D. Native code has no versions"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What are breadcrumbs?",
      "options": [
        "A. A short trail of meaningful events before an error",
        "B. Every user keystroke",
        "C. Build certificates",
        "D. Database backups"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does release health help answer?",
      "options": [
        "A. Whether a specific release introduced crashes or regressions",
        "B. Which editor was used",
        "C. How many components exist",
        "D. Which font is active"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is an Android ANR?",
      "options": [
        "A. An Application Not Responding event",
        "B. An authentication token",
        "C. A native route",
        "D. An npm registry"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is needed to understand compiled native crash addresses?",
      "options": [
        "A. Debug symbols and symbolication",
        "B. A Jest snapshot",
        "C. A route map",
        "D. A query key"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What maps production JavaScript stacks to original source?",
      "options": [
        "A. Uploaded source maps",
        "B. Android permissions",
        "C. CocoaPods",
        "D. Refresh tokens"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why attach release and environment tags to errors?",
      "options": [
        "A. To connect failures to the exact build and deployment context",
        "B. To increase image quality",
        "C. To avoid tests",
        "D. To hide the stack trace"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "Production Observability Self-check",
    "goal": "Ship a build with crash reporting wired up, trigger a native crash and a JavaScript crash, and trace both back to the exact line.",
    "brief": "> **Ship a build with crash reporting wired up, trigger a native crash and a JavaScript crash, and trace both back to the exact line.**\n\nYour exercise should look like this:\n\n### Part 1 — JS crash\n\nCreate an intentional JavaScript failure:\n\n```text\nProduction/staging build\n       |\n       v\nTrigger JS error\n       |\n       v\nCrash reporting system\n       |\n       v\nFind event\n       |\n       v\nCheck version/environment\n       |\n       v\nRead JS stack\n       |\n       v\nApply source map\n       |\n       v\nFind original file + line\n```\n\nYou should be able to say:\n\n```text\nThe JS crash happened in:\n\nProfileScreen.tsx\nline 84\n\nbecause ______.\n```\n\n---\n\n### Part 2 — Native crash\n\nTrigger a controlled native-side failure in a safe test environment.\n\nThen:\n\n```text\nNative crash\n   |\n   v\nCrash reporting\n   |\n   v\nFind event\n   |\n   v\nCheck:\nversion\nbuild\nplatform\ndevice\nOS\n   |\n   v\nRead native stack\n   |\n   v\nSymbolicate\n   |\n   v\nFind native file/function\n```\n\nYou should be able to explain:\n\n```text\nThe native crash happened in:\n\nSomeNativeModule.swift\nfunction ______\nline ______\n```\n\n---\n\n### Part 3 — Explain the difference\n\nFinally, explain these two sentences in your own words:\n\n```text\n\"JavaScript source maps help me understand bundled JavaScript.\"\n\n\"Native symbols help me understand compiled native crashes.\"\n```\n\nIf you can explain **why those are different**, you have understood the core of Day 33.",
    "steps": [],
    "acceptance": [
      "Trace the JavaScript crash to its original file and line.",
      "Symbolicate the native crash and identify its native source.",
      "Explain the difference between JavaScript source maps and native symbols."
    ]
  }
});

