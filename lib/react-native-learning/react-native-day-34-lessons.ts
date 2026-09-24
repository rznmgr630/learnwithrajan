import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_34_LESSONS = normalizePastedLessonDay({
  "day": 34,
  "title": "Mobile Security Fundamentals",
  "overview": "**Goal:** By the end of this day, you should understand where secrets and tokens can safely live on a mobile device, what certificate pinning and root/jailbreak detection actually protect against, why client-side code can never contain a truly secret value, and how to validate deep links safely.",
  "totalMinutes": 60,
  "difficulty": "Intermediate",
  "lessons": [
    {
      "id": "rn34-1",
      "title": "What makes mobile security different?",
      "durationMinutes": 3,
      "explanation": "A React Native application is not running in a trusted environment.\n\nThis is important.\n\nWhen your backend runs on your server:\n\n```text\nYour server\n  |\n  v\nYou control the machine\n```\n\nBut when your mobile app runs:\n\n```text\nYour application\n     |\n     v\nUser's phone\n     |\n     v\nYou don't fully control the device\n```\n\nA determined attacker can potentially:\n\n```text\ninspect the app\ninspect network traffic\nmodify the application\nextract bundled values\nreverse engineer native code\ninspect local storage\nhook runtime behavior\n```\n\nSo your mobile app should **never be treated as a trusted environment**.\n\nThis leads to one of the most important rules:\n\n> **The backend must enforce security. The mobile app is a client, not a security boundary.**",
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
      "id": "rn34-2",
      "title": "Secure storage for tokens",
      "durationMinutes": 3,
      "explanation": "You learned authentication earlier.\n\nA typical mobile application might receive:\n\n```text\nAccess token\nRefresh token\n```\n\nYou need somewhere to store them.\n\nA beginner might think:\n\n```tsx\nAsyncStorage.setItem(\n \"accessToken\",\n token\n);\n```\n\nThis is generally not appropriate for sensitive authentication credentials.\n\nWhy?\n\nBecause `AsyncStorage` is designed as general persistent application storage, not as a secure credential vault.\n\nThink:\n\n```text\nAsyncStorage\n   |\n   +-- preferences\n   +-- cached data\n   +-- non-sensitive state\n```\n\nnot:\n\n```text\nAsyncStorage\n   |\n   +-- access token\n   +-- refresh token\n   +-- private credential\n```",
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
      "id": "rn34-3",
      "title": "What should you use instead?",
      "durationMinutes": 3,
      "explanation": "For sensitive credentials, use platform-backed secure storage.\n\nOn iOS, the underlying concept is:\n\n```text\nKeychain\n```\n\nOn Android:\n\n```text\nAndroid Keystore-backed security mechanisms\n```\n\nLibraries such as Expo SecureStore provide a higher-level React Native/Expo interface.\n\nConceptually:\n\n```text\nReact Native\n    |\n    v\nSecure storage API\n    |\n    +--------+\n    |        |\n    v        v\n  iOS      Android\nKeychain   Keystore-backed storage\n```\n\nThe exact implementation depends on your library and platform.",
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
      "id": "rn34-4",
      "title": "Secure storage doesn't make a token magically safe",
      "durationMinutes": 3,
      "explanation": "This is important.\n\nSuppose you store:\n\n```text\nrefreshToken\n```\n\nin secure storage.\n\nThat's much better than putting it in plain application storage.\n\nBut it doesn't mean:\n\n> \"Nobody can ever access this token.\"\n\nA compromised device or instrumented application can potentially expose sensitive information.\n\nSo think in layers:\n\n```text\nSecure storage\n     +\nShort-lived access tokens\n     +\nRefresh-token rotation\n     +\nServer-side authorization\n     +\nRevocation\n```\n\nSecurity is usually a system, not one magic API.",
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
      "id": "rn34-5",
      "title": "Never trust the client",
      "durationMinutes": 3,
      "explanation": "Imagine your app sends:\n\n```http\nPOST /api/admin/delete-user\n```\n\nwith:\n\n```json\n{\n \"userId\": 123\n}\n```\n\nYou should **not** assume:\n\n> \"The mobile app only shows this button to admins.\"\n\nAn attacker can modify the client and call the endpoint directly.\n\nYour server must check:\n\n```text\nWho is this user?\n       |\n       v\nAre they authenticated?\n       |\n       v\nAre they authorized?\n       |\n       v\nAre they allowed to delete this user?\n```\n\nThe UI can hide functionality.\n\nThe backend must enforce authorization.",
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
      "id": "rn34-6",
      "title": "Certificate pinning",
      "durationMinutes": 3,
      "explanation": "Normally, HTTPS works roughly like:\n\n```text\nMobile app\n   |\n   | HTTPS\n   v\nServer\n```\n\nTLS certificates help the client verify that it is communicating with the expected server.\n\n**Certificate pinning** adds another layer of verification.\n\nThe application can be configured to expect a particular certificate or public-key identity.\n\nConceptually:\n\n```text\nApp\n|\n| \"I expect this server identity\"\n|\nv\nHTTPS server\n```\n\nIf the connection doesn't match the expected identity, the app can reject it.",
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
      "id": "rn34-7",
      "title": "Why would you use certificate pinning?",
      "durationMinutes": 3,
      "explanation": "Imagine an attacker somehow gets into a position to intercept network traffic.\n\nWithout additional pinning:\n\n```text\nApp\n  |\n  v\nattacker/intermediary\n  |\n  v\nServer\n```\n\nWith correctly implemented pinning:\n\n```text\nApp\n  |\n  | expected certificate/public key\n  X\nunexpected certificate\n```\n\nThe connection can be rejected.\n\nThis can be valuable for particularly sensitive applications and APIs.",
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
      "id": "rn34-8",
      "title": "Certificate pinning has real-world limitations",
      "durationMinutes": 3,
      "explanation": "This is where security tutorials often become too simplistic.\n\nPinning isn't:\n\n> \"Always enable it and you're secure.\"\n\nIt creates operational complexity.\n\nFor example:\n\n```text\nYour server certificate changes\n       |\n       v\nApp still expects old identity\n       |\n       v\nRequests fail\n       |\n       v\nUsers can't connect\n```\n\nYou need a safe certificate/key rotation strategy.\n\nYou also need to consider:\n\n```text\nbackup pins\ncertificate rotation\napp updates\nincident response\ndebugging\nthird-party infrastructure\n```\n\nSo pinning should be treated as a deliberate security/operations decision, not just a checkbox.",
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
      "id": "rn34-9",
      "title": "Jailbreak and root detection",
      "durationMinutes": 2,
      "explanation": "You may hear about:\n\n```text\nJailbreak detection\nRoot detection\n```\n\nThe basic idea is to detect whether the operating system has been modified in ways that weaken normal security boundaries.\n\nConceptually:\n\n```text\nApplication\n   |\n   v\nCheck device environment\n   |\n   +--> appears normal\n   |\n   +--> potentially compromised\n```",
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
      "id": "rn34-10",
      "title": "What can root/jailbreak detection do?",
      "durationMinutes": 2,
      "explanation": "It can provide a signal that:\n\n> \"This device may not have the normal security guarantees.\"\n\nYour application could then choose to:\n\n```text\nwarn the user\nrestrict a sensitive feature\nrequire additional authentication\nreduce trust\n```\n\ndepending on the application's risk model.",
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
      "id": "rn34-11",
      "title": "What can't root/jailbreak detection do?",
      "durationMinutes": 2,
      "explanation": "This is more important.\n\nIt cannot guarantee:\n\n> \"This device is secure.\"\n\nDetection mechanisms can be bypassed.\n\nAn attacker may:\n\n```text\nmodify the detection logic\nhook APIs\nhide indicators\npatch the application\n```\n\nSo:\n\n```text\nRoot detection\n    ≠\nRoot prevention\n```\n\nand:\n\n```text\nJailbreak detection\n    ≠\nSecurity guarantee\n```\n\nTreat it as one signal in a layered security model.",
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
      "id": "rn34-12",
      "title": "Obfuscation",
      "durationMinutes": 2,
      "explanation": "You may think:\n\n> \"I'll hide my sensitive logic by obfuscating the JavaScript.\"\n\nObfuscation makes code harder to understand.\n\nFor example:\n\n```text\nReadable:\n\nfunction calculatePrice() {\n ...\n}\n\n\nObfuscated:\n\nfunction a(b){...}\n```\n\nIt can increase the effort required to reverse engineer your application.\n\nBut:\n\n> **Obfuscation is not encryption.**\n\nAnd it does not turn client-side code into a secret.",
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
      "id": "rn34-13",
      "title": "JavaScript in a mobile app isn't truly secret",
      "durationMinutes": 2,
      "explanation": "Imagine:\n\n```tsx\nconst API_KEY = \"abc123\";\n```\n\nYou might think:\n\n> \"It's inside the application, so users can't see it.\"\n\nThat's not a safe assumption.\n\nYour application is ultimately distributed to users.\n\nA determined attacker can inspect it.\n\nTherefore:\n\n```text\nClient code\n   |\n   v\nPotentially inspectable\n```\n\nAnything that must remain secret should generally stay on a trusted backend.",
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
      "id": "rn34-14",
      "title": "API keys: what's safe to ship?",
      "durationMinutes": 2,
      "explanation": "This is one of the most confusing topics for beginners.\n\nNot every API key is equally sensitive.\n\nSome client applications legitimately contain identifiers that are intended to be public.\n\nFor example:\n\n```text\npublic application identifier\n```\n\nmay be safe to include.\n\nBut a powerful server credential such as:\n\n```text\nprivate API secret\ndatabase password\nserver signing key\ncloud secret\n```\n\nshould **not** be bundled into the mobile app.\n\nAsk:\n\n> **If someone extracts this value from my APK/IPA, can they use it to perform privileged operations or spend my money?**\n\nIf yes, it probably belongs on the server.",
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
      "id": "rn34-15",
      "title": "Bad architecture",
      "durationMinutes": 2,
      "explanation": "Imagine:\n\n```text\nMobile App\n  |\n  | private OpenAI/cloud/payment secret\n  v\nThird-party API\n```\n\nAn attacker can potentially extract the secret.",
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
      "id": "rn34-16",
      "title": "Better architecture",
      "durationMinutes": 2,
      "explanation": "Instead:\n\n```text\nMobile App\n  |\n  v\nYour Backend\n  |\n  | private secret\n  v\nThird-party API\n```\n\nNow the sensitive credential stays on infrastructure you control.\n\nThe mobile app only receives the result it needs.",
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
      "id": "rn34-17",
      "title": "Environment variables don't automatically make secrets safe",
      "durationMinutes": 2,
      "explanation": "You may write:\n\n```env\nAPI_SECRET=super-secret-value\n```\n\nand then reference it in your mobile build.\n\nBut if that value is bundled into the client application:\n\n```text\n.env\n |\n v\nbuild\n |\n v\nmobile application\n```\n\nthe value is now part of the client.\n\nThe fact that you called it an environment variable doesn't make it secret.\n\nImportant distinction:\n\n```text\nServer environment variable\n       |\n       v\nUsually stays on server\n\n\nClient build environment variable\n       |\n       v\nMay become part of the app\n```",
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
      "id": "rn34-18",
      "title": "Deep links",
      "durationMinutes": 2,
      "explanation": "Deep links allow links to open your application.\n\nFor example:\n\n```text\nmyapp://profile/123\n```\n\nor a universal/app link such as:\n\n```text\nhttps://example.com/profile/123\n```\n\nThis is useful for:\n\n```text\nemail links\nnotifications\nsharing\npassword reset\ninvites\nOAuth flows\n```\n\nBut deep links are input from outside your application.\n\nTherefore:\n\n> **Treat deep-link URLs as untrusted input.**",
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
      "id": "rn34-19",
      "title": "Deep-link validation",
      "durationMinutes": 2,
      "explanation": "Imagine your app receives:\n\n```text\nmyapp://payment?redirect=https://evil.example\n```\n\nIf your application blindly trusts the URL:\n\n```text\nDeep link\n  |\n  v\nread redirect\n  |\n  v\nopen URL\n```\n\nyou could create an unwanted redirect.\n\nInstead validate:\n\n```text\nDeep link\n  |\n  v\nParse URL\n  |\n  v\nValidate scheme\n  |\n  v\nValidate host\n  |\n  v\nValidate path\n  |\n  v\nValidate parameters\n  |\n  v\nPerform allowed action\n```",
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
      "id": "rn34-20",
      "title": "Never blindly trust redirect URLs",
      "durationMinutes": 2,
      "explanation": "This is especially important for authentication flows.\n\nSuppose your app receives:\n\n```text\nredirect_uri\n```\n\nDon't automatically do:\n\n```tsx\nLinking.openURL(redirectUri);\n```\n\nInstead ask:\n\n```text\nIs this an allowed scheme?\nIs this an allowed host?\nIs this an expected path?\nIs this parameter valid?\n```\n\nUse an allowlist where appropriate.",
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
      "id": "rn34-21",
      "title": "Deep-link security example",
      "durationMinutes": 2,
      "explanation": "Suppose your application only expects:\n\n```text\nhttps://myapp.example.com/auth/callback\n```\n\nThen:\n\n```text\nhttps://myapp.example.com/auth/callback\n```\n\ncan be accepted.\n\nBut:\n\n```text\nhttps://evil.example.com/auth/callback\n```\n\nshould not automatically be trusted.\n\nThe rule is:\n\n> **Validate the destination, not just the fact that a URL exists.**",
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
      "id": "rn34-22",
      "title": "Day 34 security mental model",
      "durationMinutes": 2,
      "explanation": "Keep this picture:\n\n```text\n                Mobile App\n                    |\n      +-------------+-------------+\n      |             |             |\n      v             v             v\n   Storage        Network      Input\n      |             |             |\n      v             v             v\nSecure storage   TLS/pinning   Deep-link validation\n      |\n      v\nToken protection\n\n\n      Client code\n           |\n           v\n  Never truly secret\n           |\n           v\nSensitive secrets stay server-side\n```",
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
      "question": "Where should refresh tokens be stored on a mobile device?",
      "options": [
        "A. Platform-backed secure storage",
        "B. Plain AsyncStorage",
        "C. A route parameter",
        "D. A console log"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why must the server never trust the client?",
      "options": [
        "A. Client code and requests can be modified by an attacker",
        "B. React Native has no types",
        "C. Mobile apps cannot use HTTPS",
        "D. Native code never validates data"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does certificate pinning add?",
      "options": [
        "A. An additional check that the server certificate or public key matches an expected value",
        "B. Automatic token rotation",
        "C. Code obfuscation",
        "D. Database encryption"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is a limitation of root or jailbreak detection?",
      "options": [
        "A. It can raise risk signals but cannot guarantee a device is trustworthy",
        "B. It prevents all attacks",
        "C. It replaces backend authorization",
        "D. It hides API keys"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does obfuscation provide?",
      "options": [
        "A. It makes reverse engineering harder but does not create perfect secrecy",
        "B. Server-side storage",
        "C. Automatic certificate renewal",
        "D. Secure token rotation"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Which secret is unsafe to ship inside a mobile application?",
      "options": [
        "A. A privileged private API secret",
        "B. A public analytics identifier designed for clients",
        "C. A route name",
        "D. A component test ID"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why do .env files not make mobile secrets safe?",
      "options": [
        "A. Values included in the build can still be extracted",
        "B. They disable HTTPS",
        "C. They remove source maps",
        "D. They block native modules"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should happen to an incoming deep link?",
      "options": [
        "A. Validate its scheme, host, path, and parameters before acting",
        "B. Trust every URL",
        "C. Log every token",
        "D. Open it in a WebView automatically"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why should redirect URLs be allowlisted?",
      "options": [
        "A. To prevent navigation to attacker-controlled destinations",
        "B. To improve image loading",
        "C. To reduce test time",
        "D. To create build variants"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is the safest place for sensitive business secrets?",
      "options": [
        "A. A trusted backend",
        "B. The JavaScript bundle",
        "C. AsyncStorage",
        "D. A deep-link query"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "Mobile Security Self-check",
    "goal": "Audit your own app for one place a secret or token is stored or logged insecurely, and fix it.",
    "brief": "> **Audit your own app for one place a secret or token is stored or logged insecurely, and fix it.**\n\nLook for things such as:\n\n```text\nAsyncStorage\nconsole.log()\nnetwork logs\nerror reports\nsource code\n.env files\ndeep-link parameters\n```\n\nFor example, you might discover:\n\n```text\nAsyncStorage\n   |\n   v\nrefreshToken\n```\n\nChange the architecture to:\n\n```text\nSecure storage\n   |\n   v\nrefreshToken\n```\n\nOr perhaps you find:\n\n```tsx\nconsole.log(\"access token:\", token);\n```\n\nRemove it.\n\nThen verify that:\n\n```text\ntoken is stored securely\ntoken is not logged\ntoken isn't included in error reports\ntoken isn't exposed in analytics\n```\n\nThe goal is not just to find a problem.\n\nThe goal is to understand **how that sensitive value could have escaped and how to prevent it from happening again.**",
    "steps": [],
    "acceptance": [
      "Find one insecurely stored or logged sensitive value.",
      "Apply the smallest safe architectural fix.",
      "Verify the value is not exposed through logs, error reports, analytics, or deep links.",
      "Explain how the value could have escaped and how the fix prevents it."
    ]
  }
});

