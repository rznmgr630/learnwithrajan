import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_35_LESSONS = normalizePastedLessonDay({
  "day": 35,
  "title": "Auth Security and Supply-Chain Risk",
  "overview": "**Goal:** By the end of this day, you should understand how to make authentication harder to abuse, secure WebViews, evaluate dependencies before installing them, recover from leaked secrets, protect production source maps, and avoid accidentally sending sensitive information to logs or the clipboard.",
  "totalMinutes": 60,
  "difficulty": "Intermediate",
  "lessons": [
    {
      "id": "rn35-1",
      "title": "Authentication doesn't end after login",
      "durationMinutes": 2,
      "explanation": "A beginner often thinks authentication is:\n\n```text\nLogin\n |\n v\nEmail + password\n |\n v\nAccess token\n |\n v\nDone\n```\n\nReal mobile authentication is more like:\n\n```text\nLogin\n |\n v\nAccess token\n |\n v\nRefresh token\n |\n v\nToken expiration\n |\n v\nRefresh/rotate\n |\n v\nBiometric re-auth when needed\n |\n v\nLogout/revocation\n```\n\nSecurity continues throughout the session.",
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
      "id": "rn35-2",
      "title": "Token rotation",
      "durationMinutes": 2,
      "explanation": "Suppose your application has a refresh token:\n\n```text\nRefresh Token A\n```\n\nThe user requests a new access token.\n\nA secure architecture may rotate the refresh token:\n\n```text\nRefresh Token A\n      |\n      v\nrefresh\n      |\n      +--> Access Token B\n      |\n      +--> Refresh Token C\n```\n\nNow the previous refresh token may no longer be valid.\n\nThis can reduce the usefulness of a stolen old refresh token.",
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
      "id": "rn35-3",
      "title": "Why rotation helps",
      "durationMinutes": 2,
      "explanation": "Imagine an attacker somehow obtains:\n\n```text\nRefresh Token A\n```\n\nIf your system allows that token to remain valid indefinitely, the attacker may have a long-lived credential.\n\nWith rotation:\n\n```text\nA → B → C → D\n```\n\nthe system can detect abnormal reuse or invalidate previous tokens depending on the authentication architecture.\n\nThis is one reason refresh-token rotation is an important security control.",
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
      "id": "rn35-4",
      "title": "Biometric re-authentication",
      "durationMinutes": 2,
      "explanation": "Your application may need stronger confirmation for sensitive operations.\n\nFor example:\n\n```text\nUser is already logged in\n       |\n       v\nChange payment information\n       |\n       v\nRequire biometric authentication\n       |\n       v\nFace ID / Touch ID / Android biometrics\n```\n\nThis is different from simply checking:\n\n> \"Is the user logged in?\"\n\nYou are asking:\n\n> **\"Can the user prove that they are currently authorized to perform this sensitive action?\"**",
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
      "id": "rn35-5",
      "title": "Good places for re-authentication",
      "durationMinutes": 2,
      "explanation": "Depending on your application, biometric re-authentication may make sense for:\n\n```text\nviewing sensitive information\nchanging security settings\nchanging payment details\ntransferring money\nexporting private data\nchanging account credentials\n```\n\nThe exact policy depends on the application's risk.",
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
      "id": "rn35-6",
      "title": "Don't treat biometrics as your backend identity",
      "durationMinutes": 2,
      "explanation": "A common misunderstanding is:\n\n> \"Face ID is my authentication system.\"\n\nNot exactly.\n\nBiometric authentication usually helps unlock or authorize something **on the device**.\n\nYour backend still needs proper authentication and authorization.\n\nThink:\n\n```text\nBackend identity\n      +\nDevice biometric protection\n```\n\nnot:\n\n```text\nBiometric\n  =\nbackend authorization\n```",
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
      "id": "rn35-7",
      "title": "WebViews",
      "durationMinutes": 2,
      "explanation": "A **WebView** lets your mobile application display web content inside the application.\n\nConceptually:\n\n```text\nReact Native\n    |\n    v\nWebView\n    |\n    v\nWeb application\n```\n\nThis is useful for things like:\n\n```text\npayment pages\nlegacy web flows\ndocumentation\nOAuth-related flows\nembedded web applications\n```\n\nBut WebViews introduce another security boundary.",
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
      "id": "rn35-8",
      "title": "Injected JavaScript",
      "durationMinutes": 2,
      "explanation": "A WebView can sometimes execute JavaScript inside the web page.\n\nFor example:\n\n```tsx\n<WebView\n source={{ uri: \"https://example.com\" }}\n injectedJavaScript={script}\n/>\n```\n\nThis can be useful.\n\nBut if the script or page source is untrusted:\n\n```text\nNative app\n   |\n   v\nWebView\n   |\n   v\nuntrusted web content\n```\n\nyou may accidentally create a dangerous bridge between trusted application code and untrusted content.\n\nTreat injected scripts carefully.",
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
      "id": "rn35-9",
      "title": "WebView URL validation",
      "durationMinutes": 2,
      "explanation": "Imagine your application expects:\n\n```text\nhttps://payments.example.com\n```\n\nbut the WebView navigates to:\n\n```text\nhttps://evil.example.com\n```\n\nIf your application blindly allows navigation, the user may be shown a malicious page inside a trusted-looking application.\n\nValidate navigation destinations.\n\nConceptually:\n\n```text\nNavigation request\n      |\n      v\nIs host allowed?\n      |\n  +---+---+\n  |       |\n yes      no\n  |       |\n  v       v\nallow    block\n```",
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
      "id": "rn35-10",
      "title": "Cookie leakage",
      "durationMinutes": 2,
      "explanation": "WebViews can use cookies.\n\nCookies can contain sensitive session information.\n\nIf you mix:\n\n```text\nnative authentication\n+\nweb authentication\n```\n\nwithout a clear security design, you can create confusing or dangerous credential flows.\n\nYou need to understand:\n\n```text\nWhich cookies exist?\nWhich domain owns them?\nCan WebView content access them?\nAre they session cookies?\nHow are they cleared?\n```\n\nNever assume:\n\n> \"It's just a WebView, so it doesn't matter.\"",
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
      "id": "rn35-11",
      "title": "URL spoofing",
      "durationMinutes": 2,
      "explanation": "Imagine a login page that visually resembles your real login page.\n\nA malicious URL could be:\n\n```text\nhttps://secure-example.com\n```\n\ninstead of:\n\n```text\nhttps://example.com\n```\n\nA human may not notice the difference.\n\nYour application should validate expected URLs instead of trusting whatever the WebView receives.",
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
      "id": "rn35-12",
      "title": "WebView security mental model",
      "durationMinutes": 2,
      "explanation": "Think:\n\n```text\nNative App\n   |\n   | trusted\n   v\nWebView\n   |\n   | potentially untrusted\n   v\nInternet content\n```\n\nThe boundary matters.\n\nAsk:\n\n```text\nWhat page am I loading?\n\nCan it navigate somewhere else?\n\nCan it execute JavaScript?\n\nCan it communicate with native code?\n\nWhat cookies are available?\n\nWhat data can it access?\n```",
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
      "id": "rn35-13",
      "title": "Dependency security",
      "durationMinutes": 2,
      "explanation": "Your application probably has:\n\n```json\n{\n \"dependencies\": {\n   \"react-native\": \"...\",\n   \"expo\": \"...\",\n   \"some-library\": \"...\"\n }\n}\n```\n\nEvery dependency increases your application's supply chain.\n\nYou're effectively saying:\n\n> \"I trust this code to run inside my application.\"\n\nThat's a serious decision.",
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
      "id": "rn35-14",
      "title": "What is supply-chain risk?",
      "durationMinutes": 2,
      "explanation": "Imagine you install:\n\n```text\nsome-awesome-library\n```\n\nYou trust it.\n\nBut the library might:\n\n```text\ncontain a vulnerability\nhave malicious code\ndepend on another vulnerable package\nbe abandoned\nbe compromised later\n```\n\nSo:\n\n```text\nYour application\n     |\n     +-- dependency A\n     |      |\n     |      +-- dependency C\n     |\n     +-- dependency B\n            |\n            +-- dependency D\n```\n\nYour dependency tree can become surprisingly large.",
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
      "id": "rn35-15",
      "title": "Before installing a package",
      "durationMinutes": 2,
      "explanation": "Don't just ask:\n\n> \"Does it solve my problem?\"\n\nAlso ask:\n\n```text\nIs it maintained?\n\nWho publishes it?\n\nIs the repository legitimate?\n\nHow many users/projects depend on it?\n\nWhen was it last updated?\n\nDoes it request unusual permissions?\n\nDoes it contain native code?\n\nDoes it access sensitive APIs?\n\nWhat dependencies does it bring?\n```\n\nYou don't need to investigate every tiny utility for hours.\n\nBut be much more careful with packages that touch:\n\n```text\nauthentication\npayments\nstorage\ncrypto\nnative device APIs\nnetworking\nWebViews\n```",
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
      "id": "rn35-16",
      "title": "Dependency auditing",
      "durationMinutes": 2,
      "explanation": "Your package manager and security tooling can identify known vulnerabilities.\n\nFor npm projects, you can start with:\n\n```bash\nnpm audit\n```\n\nYou may find:\n\n```text\npackage\nseverity\nvulnerable version\ndependency path\nfixed version\n```\n\nDon't blindly run:\n\n```bash\nnpm audit fix --force\n```\n\nand assume everything is solved.\n\nMajor dependency changes can introduce breaking changes.\n\nUnderstand the vulnerability first.",
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
      "id": "rn35-17",
      "title": "A dependency audit workflow",
      "durationMinutes": 2,
      "explanation": "Use:\n\n```text\nnpm audit\n    |\n    v\nFind vulnerable package\n    |\n    v\nUnderstand dependency path\n    |\n    v\nCheck fixed version\n    |\n    v\nUpgrade safely\n    |\n    v\nRun tests\n    |\n    v\nBuild application\n    |\n    v\nVerify behavior\n```\n\nSecurity fixes are still software changes.\n\nTreat them like production code changes.",
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
      "id": "rn35-18",
      "title": "Malicious packages",
      "durationMinutes": 2,
      "explanation": "Sometimes the risk isn't an old vulnerability.\n\nA package itself may be malicious.\n\nWarning signs can include:\n\n```text\nsuspicious publisher\nunexpected install scripts\nobfuscated code\nunusual network requests\nrequests unrelated to package purpose\nsudden ownership changes\n```\n\nYou don't need to become a malware analyst.\n\nBut if a tiny UI helper asks for access to things completely unrelated to its purpose:\n\n> Stop and investigate.",
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
      "id": "rn35-19",
      "title": "Secrets committed to Git",
      "durationMinutes": 2,
      "explanation": "This happens more often than people think.\n\nSomeone accidentally commits:\n\n```env\nAPI_SECRET=super-secret-value\n```\n\nto Git.\n\nThen they realize:\n\n> \"I'll just delete the file.\"\n\nUnfortunately, deleting it from the latest commit doesn't necessarily mean the secret never existed.\n\nGit history can retain old versions.",
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
      "id": "rn35-20",
      "title": "Why deleting the secret isn't enough",
      "durationMinutes": 2,
      "explanation": "Imagine:\n\n```text\nCommit 1\n |\n +-- secret exists\n |\nCommit 2\n |\n +-- secret removed\n```\n\nThe secret may still exist in the repository's history.\n\nPotentially:\n\n```text\ngit history\n   |\n   v\nold commit\n   |\n   v\nsecret\n```\n\nSo you should assume the secret has been exposed.",
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
      "id": "rn35-21",
      "title": "What should you do after a secret leak?",
      "durationMinutes": 2,
      "explanation": "The most important step is:\n\n> **Rotate the secret.**\n\nFor example:\n\n```text\nOld API key\n    |\n    X\nrevoke\n    |\n    v\nNew API key\n```\n\nThen update the systems using it.\n\nDon't simply say:\n\n> \"I deleted the secret from Git.\"\n\nThe old credential may still be usable.",
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
      "id": "rn35-22",
      "title": "Secret-leak response",
      "durationMinutes": 2,
      "explanation": "A simple workflow:\n\n```text\nSecret discovered\n     |\n     v\nRevoke/rotate it\n     |\n     v\nFind where it was used\n     |\n     v\nReplace with new secret\n     |\n     v\nCheck repository/history\n     |\n     v\nCheck logs/artifacts\n     |\n     v\nInvestigate exposure\n```\n\nFor serious incidents, follow your organization's incident-response process.",
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
      "id": "rn35-23",
      "title": "Production source maps",
      "durationMinutes": 2,
      "explanation": "Source maps are extremely useful for debugging.\n\nBut they can also reveal information about your application.\n\nFor example, they may expose:\n\n```text\noriginal file names\nsource structure\nfunction names\nmodule structure\nsometimes source content\n```\n\nSo you need to think carefully about how production source maps are handled.",
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
      "id": "rn35-24",
      "title": "The trade-off",
      "durationMinutes": 2,
      "explanation": "You want:\n\n```text\nDeveloper\n   |\n   v\nUseful production stack trace\n```\n\nbut you don't necessarily want:\n\n```text\nPublic internet\n   |\n   v\nComplete source map\n   |\n   v\nOriginal application source\n```\n\nA common approach is to upload source maps privately to your error-reporting service and avoid exposing them publicly.\n\nThe exact setup depends on your build/deployment system.",
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
      "id": "rn35-25",
      "title": "Sensitive logging",
      "durationMinutes": 2,
      "explanation": "Logs are extremely useful.\n\nBut this is dangerous:\n\n```tsx\nconsole.log({\n email,\n password,\n accessToken,\n refreshToken,\n});\n```\n\nYou might think:\n\n> \"It's only development.\"\n\nBut logs can end up in:\n\n```text\nCI logs\ndevice logs\ncrash reports\nanalytics\ndebugging tools\nthird-party monitoring\n```\n\nTreat logs as potentially persistent data.",
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
      "id": "rn35-26",
      "title": "What should you avoid logging?",
      "durationMinutes": 2,
      "explanation": "Be extremely careful with:\n\n```text\npasswords\naccess tokens\nrefresh tokens\nAPI secrets\ncredit card information\nprivate messages\nsensitive personal information\nhealth information\n```\n\nInstead of:\n\n```text\nconsole.log(\"Token:\", token);\n```\n\nuse:\n\n```text\nconsole.log(\"Authentication succeeded\");\n```\n\nYou often need to know **what happened**, not the secret that made it happen.",
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
      "id": "rn35-27",
      "title": "Clipboard privacy",
      "durationMinutes": 2,
      "explanation": "The clipboard can contain sensitive information.\n\nFor example:\n\n```text\nuser copies\n   |\n   v\ncredit card number\n```\n\nYour application may not control what happens afterward.\n\nSo be careful when:\n\n```text\ncopying authentication codes\ncopying private information\ncopying payment information\n```\n\nIf your application copies sensitive data, consider whether it should be automatically cleared after a reasonable period or whether copying is necessary at all.\n\nThe exact behavior depends on the platform and the sensitivity of the data.",
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
      "id": "rn35-28",
      "title": "Screenshot privacy",
      "durationMinutes": 2,
      "explanation": "Some applications display highly sensitive information:\n\n```text\nbank balances\nmedical information\nprivate messages\nauthentication codes\n```\n\nA screenshot can capture that information.\n\nAndroid provides mechanisms that can restrict screenshots for certain activities.\n\niOS has different privacy and screen-capture considerations and does not provide an identical mechanism.\n\nThe important lesson is:\n\n> **Don't assume that a screen disappears from your application just because the user navigated away.**\n\nConsider:\n\n```text\nscreenshots\nscreen recording\napp switcher previews\n```\n\nwhen sensitive information is involved.",
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
      "id": "rn35-29",
      "title": "Sensitive information in app switchers",
      "durationMinutes": 2,
      "explanation": "Imagine:\n\n```text\nUser opens:\n\"Medical Report\"\n```\n\nThen they press the home button.\n\nThe operating system may display an application preview.\n\nIf the sensitive screen is visible:\n\n```text\nApp switcher\n   |\n   v\nSensitive information visible\n```\n\nDepending on the application's sensitivity, you may need a privacy screen or another mechanism to prevent sensitive content from appearing in previews.",
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
      "id": "rn35-30",
      "title": "Day 35 security mental model",
      "durationMinutes": 2,
      "explanation": "Keep this architecture in mind:\n\n```text\n                 Mobile App\n                      |\n       +--------------+--------------+\n       |              |              |\n       v              v              v\n     Auth          WebView       Dependencies\n       |              |              |\n       v              v              v\ntoken rotation     URL checks     vulnerability\nbiometrics         cookies        review\nsecure storage     JS injection   supply chain\n       |\n       v\nBackend authorization\n```\n\nAnd around everything:\n\n```text\n       Privacy\n         |\n         +-- Logs\n         +-- Source maps\n         +-- Clipboard\n         +-- Screenshots\n         +-- Crash reports\n```",
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
      "question": "What should happen when a refresh token is rotated?",
      "options": [
        "A. The previous token should become unusable according to the server's rotation policy",
        "B. It should stay valid forever",
        "C. It should be logged",
        "D. It should move to AsyncStorage"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is biometric re-authentication best used for?",
      "options": [
        "A. Locally unlocking an already established protected session or action",
        "B. Replacing backend identity",
        "C. Creating access tokens on the device",
        "D. Disabling authorization"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should a WebView navigation policy do?",
      "options": [
        "A. Allow only expected schemes, hosts, and destinations",
        "B. Open every URL",
        "C. Inject arbitrary scripts",
        "D. Share all cookies"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why is injected JavaScript risky in a WebView?",
      "options": [
        "A. It can access or manipulate untrusted page content in dangerous ways",
        "B. It improves signing",
        "C. It prevents phishing",
        "D. It removes cookies"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is supply-chain risk?",
      "options": [
        "A. Risk introduced through third-party packages, maintainers, build tools, or dependencies",
        "B. Only network latency",
        "C. Only source maps",
        "D. Only app icons"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should you check before installing a dependency?",
      "options": [
        "A. Maintenance, permissions, transitive dependencies, reputation, and necessity",
        "B. Only its download count",
        "C. Only its package name",
        "D. Nothing if it compiles"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should happen after a committed secret is discovered?",
      "options": [
        "A. Revoke and rotate it, then remove it from history where appropriate",
        "B. Delete the latest line only",
        "C. Rename the variable",
        "D. Move it to another branch"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why can production source maps be sensitive?",
      "options": [
        "A. They may reveal readable application source and implementation details",
        "B. They contain refresh tokens automatically",
        "C. They disable native symbols",
        "D. They publish the app"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should never be included in application logs?",
      "options": [
        "A. Tokens, passwords, and sensitive personal data",
        "B. A non-sensitive release version",
        "C. An anonymous error code",
        "D. A screen name"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "How should sensitive screens appear in the app switcher?",
      "options": [
        "A. Protected or obscured when the platform and risk require it",
        "B. Always fully visible",
        "C. Copied to the clipboard",
        "D. Uploaded as analytics"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "Security Audit Self-check",
    "goal": "Run a dependency audit on your project, find one real risk, and fix it.",
    "brief": "> **Run a dependency audit on your project, find one real risk, and fix it.**\n\nThe risk can be:\n\n```text\noutdated package\nknown vulnerability\nover-broad permission\nexposed source map\nsecret in Git\nsensitive logging\n```\n\nStart with:\n\n```bash\nnpm audit\n```\n\nThen investigate the result.\n\nFor example:\n\n```text\nPackage:\nsome-package\n\nCurrent:\n1.2.0\n\nFixed:\n1.2.4\n```\n\nDon't immediately force the upgrade.\n\nCheck:\n\n```text\nWhy is it vulnerable?\n\nWho depends on it?\n\nCan I safely upgrade?\n\nIs there a breaking change?\n\nDo tests pass?\n\nDoes the production build still work?\n```\n\nThen make the smallest safe fix.\n\nFinally verify:\n\n```text\nAudit\n ↓\nFix\n ↓\nTests\n ↓\nBuild\n ↓\nAudit again\n```\n\nThe important outcome is that you can explain:\n\n> **What security risk did I find, why did it matter, what did I change, and how did I verify that the fix actually worked?**",
    "steps": [],
    "acceptance": [
      "Run a dependency audit.",
      "Investigate one real risk and its dependency path.",
      "Apply the smallest safe fix.",
      "Run tests and the production build.",
      "Audit again and explain what changed."
    ]
  }
});

