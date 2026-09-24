import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_14_LESSONS = normalizePastedLessonDay({
  "day": 14,
  "title": "WebView and Web/Native Boundaries",
  "overview": "Today we're going to talk about one of the most useful — and most misunderstood — tools in React Native:\n\n> **WebView**\n\nA WebView lets you display a web page **inside your native mobile application**.\n\nThat sounds simple, but there is an important question:\n\n> **When should you use a WebView instead of building the screen natively?**\n\nWe'll answer that throughout today's lessons.\n\n---",
  "totalMinutes": 50,
  "difficulty": "Beginner → Intermediate",
  "lessons": [
    {
      "id": "rn14-1",
      "title": "react-native-webview — When Should You Use a WebView?",
      "durationMinutes": 8,
      "explanation": "A normal React Native application renders native UI.\n\nFor example:\n\n```\nReact Native\n    ↓\nNative Button\n    ↓\niOS / Android UI\n```\n\nA WebView works differently.\n\nIt creates an area inside your app where a web page can run:\n\n```\nReact Native App\n┌──────────────────────────────┐\n│                              │\n│       Native UI              │\n│                              │\n│  ┌────────────────────────┐  │\n│  │       WebView          │  │\n│  │                        │  │\n│  │     HTML / CSS / JS    │  │\n│  │                        │  │\n│  └────────────────────────┘  │\n│                              │\n└──────────────────────────────┘\n```\n\nThe WebView is essentially a browser-like environment embedded inside your application.\n\n---\n\n## What is a WebView?\n\nA **WebView** is a component that displays web content inside a native application.\n\nFor example, you could have:\n\n```\nYour React Native App\n       ↓\n   WebView\n       ↓\nhttps://example.com\n       ↓\nHTML + CSS + JavaScript\n```\n\nThe user sees the website without necessarily leaving your application.\n\n---\n\n# Why would we want this?\n\nImagine your company already has a website for:\n\n```\nTerms and Conditions\nPrivacy Policy\nHelp Center\nCheckout\nDocumentation\nAccount management\n```\n\nBuilding all of those screens again using React Native could take a lot of time.\n\nSometimes embedding the existing web experience is reasonable.\n\n---\n\n# Example\n\nSuppose your app has:\n\n```\nProduct Details\n     ↓\n  Buy Now\n     ↓\nCheckout\n```\n\nInstead of rebuilding an entire checkout system natively, you might load:\n\n```\nhttps://shop.example.com/checkout\n```\n\ninside a WebView.\n\n```\nReact Native\n     │\n     ▼\n  WebView\n     │\n     ▼\nWeb checkout\n     │\n     ▼\nPayment complete\n     │\n     ▼\nReact Native\n```\n\n---\n\n# But a WebView is not automatically the right answer\n\nHere's an important rule:\n\n> **Don't use a WebView simply because building the native screen is difficult.**\n\nThat can become a **cop-out**.\n\nA **cop-out** means choosing an easy-looking solution to avoid solving the underlying problem properly.\n\nFor example, suppose you're building:\n\n```\nInstagram-style feed\n```\n\nPutting the entire feed inside a WebView might technically work.\n\nBut now you lose many advantages of native React Native UI:\n\n```\nNative gestures\nNative navigation\nNative performance characteristics\nNative accessibility\nNative platform behavior\n```\n\nSo the question isn't:\n\n> \"Can I put this in a WebView?\"\n\nThe answer to that is often **yes**.\n\nThe better question is:\n\n> \"Should this particular part of the product be web content?\"\n\n---\n\n# Good WebView use cases\n\nWebViews can make sense for:\n\n- Existing web pages you don't want to rebuild\n- Checkout flows\n- Help/documentation pages\n- Terms and legal content\n- Content-heavy web experiences\n- Third-party web experiences\n- A web product that must be reused inside a mobile application\n\n---\n\n# Poor WebView use cases\n\nBe careful using WebViews for:\n\n- Main application navigation\n- Highly interactive native experiences\n- Gesture-heavy screens\n- Core application UI\n- Screens requiring deep native integration\n- UI where platform-specific behavior is important\n\n---",
      "diagram": "```\n                Mobile App\n                    │\n         ┌──────────┴──────────┐\n         │                     │\n         ▼                     ▼\n    Native Screen           WebView\n         │                     │\n         ▼                     ▼\nReact Native UI         HTML/CSS/JS\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- A WebView displays web content inside a native application.\n- `react-native-webview` is a common solution for this.\n- WebViews can save development time when you already have a good web experience.\n- A WebView shouldn't automatically replace native UI.\n- Think carefully about whether the screen is fundamentally web content or native application UI.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ \"WebView can display anything, so let's use it everywhere.\"\n\nTechnically possible doesn't mean architecturally good.\n\n### ❌ Putting core native interactions inside a website\n\nYou may lose native capabilities and create unnecessary communication complexity.\n\n### ❌ Forgetting that you're now managing two environments\n\nYou have:\n\n```\nNative React Native\n+\nWeb HTML/CSS/JavaScript\n```\n\nThat boundary matters.\n\n---"
      ],
      "quiz": [
        {
          "question": "What is a WebView?",
          "options": [
            "A. A browser-like environment embedded inside an app",
            "B. A database",
            "C. A navigation library",
            "D. A native storage system"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn14-2",
      "title": "JavaScript ↔ Native Messaging",
      "durationMinutes": 8,
      "explanation": "Now we get to one of the most important concepts of today's lesson.\n\nYou have:\n\n```\nNative React Native\n```\n\nand inside it:\n\n```\nWebView\n```\n\nBut these two worlds sometimes need to communicate.\n\nFor example:\n\n```\nWeb page\n   ↓\n\"Payment succeeded!\"\n   ↓\nReact Native\n   ↓\nShow success screen\n```\n\nThis is called **communication across the WebView boundary**.\n\n---\n\n# The two sides\n\nThink of the system like this:\n\n```\n┌──────────────────────────────┐\n│       React Native           │\n│                              │\n│          Native              │\n│                              │\n│      ┌──────────────┐        │\n│      │   WebView    │        │\n│      │              │        │\n│      │ Web JavaScript│       │\n│      └──────────────┘        │\n│                              │\n└──────────────────────────────┘\n```\n\nThere are effectively two JavaScript environments involved.\n\nOne belongs to your React Native application.\n\nThe other belongs to the webpage inside the WebView.\n\n---\n\n# `postMessage`\n\nA web page can send a message to the React Native side.\n\nConceptually:\n\n```\nWeb page\n  ↓\npostMessage(...)\n  ↓\nWebView\n  ↓\nReact Native\n```\n\nFor example, the web page might send:\n\n```\nwindow.ReactNativeWebView.postMessage(\n JSON.stringify({\n   type: \"PAYMENT_SUCCESS\",\n   orderId: \"123\"\n })\n);\n```\n\nThe exact implementation can vary, but the important idea is:\n\n> The webpage sends a message to the native application.\n\n---\n\n# `onMessage`\n\nOn the React Native side, you can listen for messages.\n\nConceptually:\n\n```\n<WebView\n source={{ uri: checkoutUrl }}\n onMessage={(event) => {\n   const message = event.nativeEvent.data;\n\n   console.log(message);\n }}\n/>\n```\n\nThe WebView sends the message.\n\nReact Native receives it.\n\n---\n\n# What is `injectedJavaScript`?\n\nSometimes the native application needs to inject JavaScript into the webpage.\n\n**Injected JavaScript** means:\n\n> JavaScript supplied by the native application that is executed inside the WebView page.\n\nConceptually:\n\n```\nReact Native\n     │\n     │ Inject JavaScript\n     ▼\n  WebView\n     │\n     ▼\nWeb page executes it\n```\n\nFor example, you might use this when you control the web page and need to coordinate behavior between the two sides.\n\n---\n\n# Why is this powerful?\n\nImagine your web checkout sends:\n\n```\n{\n \"type\": \"PAYMENT_SUCCESS\",\n \"orderId\": \"12345\"\n}\n```\n\nYour native application receives it:\n\n```\nPAYMENT_SUCCESS\n      ↓\nReact Native\n      ↓\nClose WebView\n      ↓\nShow confirmation\n```\n\nThat's a very useful pattern.\n\n---\n\n# Message types\n\nDon't just send random strings like:\n\n```\n\"done\"\n```\n\nA better approach is to define message types.\n\nFor example:\n\n```\n{\n \"type\": \"PAYMENT_SUCCESS\",\n \"orderId\": \"12345\"\n}\n```\n\nor:\n\n```\n{\n \"type\": \"PAYMENT_CANCELLED\"\n}\n```\n\nNow the native application knows what happened.\n\n---\n\n# Treat messages as an API\n\nAn **API (Application Programming Interface)** is a defined way for two pieces of software to communicate.\n\nThink of your WebView messages as a tiny API:\n\n```\nWeb → Native\n\nPAYMENT_SUCCESS\nPAYMENT_CANCELLED\nLOGIN_COMPLETE\nOPEN_SUPPORT\n```\n\nThis is much easier to reason about than arbitrary strings.\n\n---",
      "diagram": "```\n                WebView Boundary\n                      │\n       ┌──────────────┼──────────────┐\n       │                             │\n       ▼                             ▼\n   React Native                  Web Page\n       │                             │\n       │     postMessage             │\n       │◄────────────────────────────│\n       │                             │\n       │     injectedJavaScript      │\n       │────────────────────────────►│\n       │                             │\n       ▼                             ▼\n     Native                       Web JS\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- The native side and WebView page need a communication mechanism.\n- `postMessage` can send data from the webpage to React Native.\n- `onMessage` lets React Native receive messages.\n- `injectedJavaScript` lets the native side inject JavaScript into the WebView.\n- Structured message types are easier to maintain than random strings.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Sending arbitrary strings\n\nPrefer structured messages.\n\n### ❌ Trusting every message automatically\n\nValidate what you receive.\n\n### ❌ Injecting uncontrolled JavaScript\n\nInjected code is powerful and should be treated carefully.\n\n---"
      ],
      "quiz": [
        {
          "question": "What does `onMessage` help you do?",
          "options": [
            "A. Receive messages from the WebView",
            "B. Create a database",
            "C. Navigate between native tabs",
            "D. Resize an image"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn14-3",
      "title": "Navigation Interception Inside a WebView",
      "durationMinutes": 7,
      "explanation": "A WebView can navigate to different URLs just like a browser.\n\nFor example:\n\n```\ncheckout.com\n    ↓\ncheckout.com/payment\n    ↓\ncheckout.com/success\n```\n\nBut sometimes you don't want the WebView to continue navigating.\n\nYou may want React Native to take control.\n\n---\n\n# Why intercept navigation?\n\nImagine this:\n\n```\nWebView\n  ↓\nhttps://shop.com/success\n```\n\nYour application recognizes:\n\n```\n/success\n```\n\nand says:\n\n> \"The checkout is finished. I don't need to show this web page. I'll handle this natively.\"\n\nSo:\n\n```\nWebView\n  ↓\nSuccess URL\n  ↓\nReact Native intercepts\n  ↓\nClose WebView\n  ↓\nNative success screen\n```\n\n---\n\n# Navigation interception\n\n`react-native-webview` provides navigation-related callbacks that let you inspect navigation requests.\n\nConceptually:\n\n```\nNavigation request\n      ↓\nShould WebView load it?\n      ↓\n  ┌───┴───┐\n  │       │\n Yes      No\n  │       │\n  ▼       ▼\nLoad    Native handling\n```\n\n---\n\n# Example\n\nSuppose you expect:\n\n```\nhttps://example.com/checkout\n```\n\nand success is:\n\n```\nhttps://example.com/checkout/success\n```\n\nYour application can recognize the success URL.\n\nConceptually:\n\n```\nonShouldStartLoadWithRequest={(request) => {\n if (request.url.includes(\"/checkout/success\")) {\n   // Handle success\n   return false;\n }\n\n return true;\n}}\n```\n\nThe exact production implementation should be stricter than this example.\n\n---\n\n# Don't use loose URL matching\n\nThis is dangerous:\n\n```\nrequest.url.includes(\"success\")\n```\n\nWhy?\n\nBecause an attacker might create:\n\n```\nhttps://evil.com/success\n```\n\nYour code could mistakenly treat it as your legitimate success page.\n\nInstead, validate:\n\n```\nScheme\nHost\nPath\nExpected parameters\n```\n\nFor example:\n\n```\nhttps://example.com/checkout/success\n```\n\nis very different from:\n\n```\nhttps://evil.com/checkout/success\n```\n\n---",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- WebViews can navigate between URLs.\n- Your native application can inspect and intercept navigation.\n- Interception is useful for checkout completion and deep links.\n- Always validate the full URL carefully.\n- Don't use loose string matching for security-sensitive URLs.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Trusting any URL containing `/success`\n\nCheck the expected host and path.\n\n### ❌ Allowing arbitrary navigation\n\nDecide which domains the WebView is allowed to load.\n\n### ❌ Forgetting external links\n\nSome links may need to open in the system browser instead.\n\n---"
      ],
      "quiz": [
        {
          "question": "Why might you intercept WebView navigation?",
          "options": [
            "A. To let native code take control of specific URLs",
            "B. To make images larger",
            "C. To create database tables",
            "D. To change the app icon"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn14-4",
      "title": "Authentication Inside a WebView",
      "durationMinutes": 8,
      "explanation": "Authentication becomes interesting when your application contains both:\n\n```\nNative screens\n```\n\nand:\n\n```\nWeb screens\n```\n\nYou need to think about:\n\n```\nWho is the user?\nHow does the website know?\nHow does the native app know?\nHow are sessions maintained?\n```\n\n---\n\n# What is a session?\n\nA **session** is information that allows a server to recognize that multiple requests belong to the same logged-in user.\n\nFor example:\n\n```\nUser logs in\n    ↓\nServer creates session\n    ↓\nBrowser/WebView stores session information\n    ↓\nLater request\n    ↓\nServer recognizes user\n```\n\n---\n\n# Cookies\n\nWeb authentication commonly uses **cookies**.\n\nA cookie is a small piece of data associated with a website that the browser/WebView can send back to the server.\n\nConceptually:\n\n```\nLogin\n ↓\nServer\n ↓\nSet session cookie\n ↓\nWebView stores cookie\n ↓\nFuture requests include cookie\n```\n\n---\n\n# The native app and WebView may have different auth systems\n\nThis is important.\n\nYour native app might use:\n\n```\nNative authentication token\n```\n\nwhile the website uses:\n\n```\nWeb session cookie\n```\n\nYou shouldn't assume they automatically understand each other.\n\n---\n\n# Example\n\nImagine:\n\n```\nNative App\n   ↓\nUser logs in\n   ↓\nNative session\n```\n\nThen the user opens:\n\n```\nWebView\n   ↓\nAccount page\n```\n\nThe website may not know that the native user is already authenticated.\n\nYou need a deliberate handoff.\n\n---\n\n# Authentication handoff\n\nOne possible architecture is:\n\n```\nNative app\n   ↓\nAuthenticated user\n   ↓\nSecure handoff mechanism\n   ↓\nWebView\n   ↓\nWeb session established\n```\n\nThe exact mechanism depends on your authentication architecture.\n\nThe key lesson:\n\n> **Don't casually copy sensitive native credentials into webpage JavaScript.**\n\n---\n\n# Why this matters\n\nImagine exposing a long-lived authentication token to arbitrary webpage JavaScript.\n\nIf malicious content gets access to it:\n\n```\nToken\n ↓\nAttacker\n ↓\nPotential account access\n```\n\nThat's a serious security problem.\n\n---\n\n# Handing control back to native\n\nSuppose authentication inside the WebView finishes.\n\nThe webpage might send:\n\n```\n{\n \"type\": \"LOGIN_COMPLETE\"\n}\n```\n\nReact Native receives it:\n\n```\nWebView\n  ↓\nLOGIN_COMPLETE\n  ↓\nNative\n  ↓\nClose WebView\n  ↓\nShow native account screen\n```\n\nThis is a common boundary pattern.\n\n---",
      "diagram": "```\n            Authentication\n                   │\n       ┌───────────┴───────────┐\n       │                       │\n       ▼                       ▼\n    Native                   Web\n       │                       │\n   Native auth            Web session\n       │                       │\n       └───────────┬───────────┘\n                   │\n            Controlled handoff\n                   │\n                   ▼\n              User session\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Web authentication often relies on cookies and sessions.\n- Native authentication and WebView authentication are not automatically the same.\n- Authentication handoffs should be deliberately designed.\n- Don't expose sensitive native credentials to arbitrary webpage JavaScript.\n- Use the WebView/native messaging boundary carefully.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Putting an access token into a URL\n\nURLs can end up in logs, browser history, analytics, or other places.\n\n### ❌ Injecting secrets into arbitrary pages\n\nOnly inject trusted content.\n\n### ❌ Assuming native login automatically logs the WebView in\n\nAuthentication systems need an explicit integration.\n\n---"
      ],
      "quiz": [
        {
          "question": "What is a cookie commonly used for in web authentication?",
          "options": [
            "A. Helping a website maintain a user's session",
            "B. Rendering images",
            "C. Creating native buttons",
            "D. Measuring screen dimensions"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn14-5",
      "title": "Deep Links From Inside a WebView",
      "durationMinutes": 6,
      "explanation": "Now let's connect today's topic with what we learned on Day 5.\n\nA **deep link** is a link that opens a particular location inside an application.\n\nFor example:\n\n```\nmyapp://orders/123\n```\n\ncould mean:\n\n```\nOpen order 123\n```\n\nBut what happens if that link originates inside a WebView?\n\n---\n\n# Example\n\nImagine a WebView displaying:\n\n```\nhttps://example.com/account\n```\n\nThe user taps:\n\n```\nOpen in app\n```\n\nThe website might trigger:\n\n```\nmyapp://profile\n```\n\nNow the native application needs to recognize that URL.\n\n---\n\n# The flow\n\n```\nWeb page\n  ↓\nDeep link\n  ↓\nOperating system / WebView\n  ↓\nReact Native\n  ↓\nNavigation\n  ↓\nNative screen\n```\n\n---\n\n# Why is this useful?\n\nImagine your web content has a button:\n\n```\n┌─────────────────────────┐\n│  Continue in App        │\n└─────────────────────────┘\n```\n\nThe user taps it.\n\nThe web experience hands control back to the native application.\n\n---\n\n# Web-to-native transition\n\nYou can think of this as:\n\n```\nWeb\n↓\nDeep link\n↓\nNative Router\n↓\nNative Screen\n```\n\nThis creates a boundary between the two environments.\n\n---\n\n# Security matters here too\n\nDon't automatically trust every URL.\n\nYou need to distinguish:\n\n```\nmyapp://profile\n```\n\nfrom something unexpected.\n\nFor web URLs, validate:\n\n```\nAllowed scheme\nAllowed host\nAllowed path\nExpected parameters\n```\n\n---",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Web pages can trigger links intended to open native screens.\n- Deep links can act as a bridge from web content to native navigation.\n- The native app should validate incoming links.\n- This is particularly useful for \"Open in app\" experiences.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Accepting arbitrary deep-link parameters\n\nValidate them.\n\n### ❌ Assuming every link should open native UI\n\nOnly recognized routes should be handled.\n\n### ❌ Forgetting that WebView content may be untrusted\n\nTreat external content carefully.\n\n---"
      ],
      "quiz": [
        {
          "question": "What can a deep link from a WebView do?",
          "options": [
            "A. Help hand navigation from web content to a native screen",
            "B. Increase image resolution",
            "C. Create a SQLite database",
            "D. Change the device's wallpaper"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn14-6",
      "title": "WebView Security",
      "durationMinutes": 8,
      "explanation": "This is one of the most important sections today.\n\nA WebView is powerful because it can execute web content.\n\nThat also means:\n\n> **You need to be very careful about what content you allow it to load.**\n\n---\n\n# Risk 1 — Arbitrary content execution\n\nSuppose your application loads:\n\n```\nhttps://example.com\n```\n\nThat's one thing.\n\nBut imagine it can also load:\n\n```\nhttps://random-site.com\n```\n\nNow your application is allowing an external website to run inside your app.\n\nYou need to ask:\n\n> \"Do I trust this content?\"\n\n---\n\n# Why JavaScript matters\n\nWeb pages can execute JavaScript.\n\nFor example:\n\n```\nHTML\n↓\nCSS\n↓\nJavaScript\n↓\nInteractive webpage\n```\n\nIf you load content you don't trust, that content may be able to execute code inside the WebView's web environment.\n\nThat's why arbitrary navigation can be dangerous.\n\n---\n\n# Risk 2 — URL spoofing\n\nImagine your app expects:\n\n```\nhttps://payments.example.com/success\n```\n\nBut an attacker creates:\n\n```\nhttps://payments.example.com.attacker.com/success\n```\n\nThese strings look similar to a beginner.\n\nBut they're completely different hosts.\n\nThe legitimate domain is:\n\n```\npayments.example.com\n```\n\nThe malicious domain is:\n\n```\npayments.example.com.attacker.com\n```\n\nThe second domain belongs to `attacker.com`.\n\nThis is why URL parsing and exact validation matter.\n\n---\n\n# Risk 3 — Cookie leakage\n\nCookies can contain session information.\n\nIf you accidentally expose session cookies to the wrong website, you could create a serious security issue.\n\nFor example:\n\n```\nTrusted website\n     ↓\nSession cookie\n     ↓\nUnexpected website\n```\n\nYou don't want sensitive authentication information crossing trust boundaries unnecessarily.\n\n---\n\n# Risk 4 — Unsafe message handling\n\nSuppose your WebView sends:\n\n```\n{\n \"type\": \"OPEN_SCREEN\",\n \"screen\": \"settings\"\n}\n```\n\nYour app shouldn't blindly execute whatever it receives.\n\nInstead:\n\n```\nReceive message\n     ↓\nValidate message\n     ↓\nRecognize type?\n     ↓\nValidate parameters\n     ↓\nPerform allowed action\n```\n\n---\n\n# A safer message model\n\nInstead of:\n\n```\nmessage = \"do whatever this says\"\n```\n\nuse a small set of known operations:\n\n```\nPAYMENT_SUCCESS\nPAYMENT_CANCELLED\nCLOSE_WEBVIEW\n```\n\nThen validate each one.\n\n---\n\n# Trust boundaries\n\nA **trust boundary** is the point where data moves between systems with different levels of trust.\n\nYour architecture might look like:\n\n```\n         TRUST BOUNDARY\n               │\n               ▼\n┌─────────────────────────────┐\n│ React Native application    │\n└─────────────────────────────┘\n               │\n               │\n               ▼\n┌─────────────────────────────┐\n│ WebView                     │\n│                             │\n│ Potentially external web    │\n│ content                     │\n└─────────────────────────────┘\n```\n\nAnything crossing that boundary should be treated carefully.\n\n---\n\n# Security checklist\n\nBefore shipping a WebView feature, ask:\n\n```\n✓ Which domains can it load?\n✓ Can users navigate elsewhere?\n✓ Do we need JavaScript?\n✓ What messages can the web page send?\n✓ Are incoming messages validated?\n✓ Are URLs validated?\n✓ Are cookies protected?\n✓ Are authentication credentials protected?\n✓ Can external links escape to the system browser?\n✓ What happens if the web page is compromised?\n```\n\n---",
      "diagram": "```\n                 WebView\n                    │\n         ┌──────────┼──────────┐\n         │          │          │\n         ▼          ▼          ▼\n       URLs      Messages    Cookies\n         │          │          │\n         ▼          ▼          ▼\n      Validate   Validate   Protect\n         │          │          │\n         └──────────┼──────────┘\n                    ▼\n              Native App\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Don't treat WebView content as automatically trustworthy.\n- Restrict allowed domains when appropriate.\n- Validate URLs.\n- Validate WebView messages.\n- Protect authentication cookies and credentials.\n- Be careful with injected JavaScript.\n- Understand your trust boundaries.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Allowing every URL\n\nLimit navigation when your use case permits.\n\n### ❌ Trusting every WebView message\n\nValidate the message type and data.\n\n### ❌ Putting secrets in URLs\n\nSensitive information should not casually travel through URLs.\n\n### ❌ Injecting arbitrary JavaScript\n\nOnly execute code you intentionally control.\n\n---"
      ],
      "quiz": [
        {
          "question": "Why should WebView URLs be validated?",
          "options": [
            "A. To prevent unexpected or malicious destinations from being treated as trusted",
            "B. To make images sharper",
            "C. To increase battery capacity",
            "D. To create navigation tabs"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn14-7",
      "title": "WebView vs Native Screen — Decision Framework",
      "durationMinutes": 5,
      "explanation": "Now we can answer the biggest question:\n\n> **Should this screen be WebView-based or native?**\n\nDon't make the decision based only on development speed.\n\nThink about the role of the screen.\n\n---\n\n# Question 1 — Do you already have a good web experience?\n\nIf yes:\n\n```\nExisting web experience\n       ↓\nCan it safely live inside the app?\n       ↓\nPotential WebView candidate\n```\n\nIf no:\n\n```\nNo existing web experience\n       ↓\nWhy build a web page just to put it inside the app?\n```\n\nA native screen may make more sense.\n\n---\n\n# Question 2 — How native does the experience need to feel?\n\nIf the screen depends heavily on:\n\n```\nGestures\nNative animations\nDevice APIs\nNative navigation\nPlatform-specific UI\n```\n\na native implementation may be more appropriate.\n\n---\n\n# Question 3 — Who owns the experience?\n\nSuppose the checkout is managed by:\n\n```\nPayment provider\n```\n\nand they already provide a secure web checkout.\n\nA WebView may be useful.\n\nBut if it's your application's core dashboard:\n\n```\nHome\nMessages\nProfile\nNotifications\n```\n\nyou should think carefully before putting the entire experience into a WebView.\n\n---\n\n# Question 4 — How much native integration is needed?\n\nImagine the screen needs:\n\n```\nCamera\nGPS\nBluetooth\nPush notifications\nNative gestures\nContacts\nBiometrics\n```\n\nThe more native integration you need, the more carefully you should evaluate a WebView.\n\n---\n\n# Simple decision framework\n\n| Question | WebView may make sense | Native may make sense |\n| --- | --- | --- |\n| Existing web page? | Yes | Not necessary |\n| Third-party web flow? | Often | Sometimes |\n| Checkout? | Often possible | Depends |\n| Core app UI? | Usually carefully consider | Often appropriate |\n| Heavy native interaction? | More difficult | Often appropriate |\n| Existing web team/content? | Potential advantage | More duplication |\n| Deep device integration? | More complex | Often easier |\n\nThis isn't a strict rule.\n\nIt's a way to structure the conversation.\n\n---\n\n# The real question\n\nDon't ask:\n\n> \"Can I build this with WebView?\"\n\nAsk:\n\n> **\"Which parts of this experience belong to the web, and which belong to the native application?\"**\n\nThat's the WebView mindset.\n\n---\n\n## Visual Decision Tree\n\n```\n                New Screen\n                    │\n                    ▼\n         Is there an existing\n           web experience?\n               /\n             Yes        No\n              │          │\n              ▼          ▼\n       Can it safely     Consider\n       live in WebView?  native first\n            /\n          Yes     No\n           │       │\n           ▼       ▼\n        WebView   Native\n```\n\n---",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- WebView isn't automatically good or bad.\n- Existing web experiences are strong candidates.\n- Core native interactions often deserve native UI.\n- Third-party web flows can be useful WebView candidates.\n- Security and authentication requirements can change the decision.\n- Choose based on the product's needs, not just implementation convenience.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Choosing WebView because native development feels harder\n\nShort-term simplicity can create long-term complexity.\n\n### ❌ Rebuilding an existing website unnecessarily\n\nIf a strong web experience already exists, reuse may be sensible.\n\n### ❌ Ignoring security during the architecture decision\n\nSecurity should be considered before implementation, not after.\n\n---"
      ],
      "quiz": [
        {
          "question": "Which question is most useful when deciding between WebView and native?",
          "options": [
            "A. \"Does this experience belong to the web or to the native app?\"",
            "B. \"Which option has fewer lines of code?\"",
            "C. \"Can I avoid learning React Native?\"",
            "D. \"Can I put everything into one WebView?\""
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    }
  ],
  "finalQuiz": [
    {
      "question": "What is a WebView?",
      "options": [
        "A. A browser-like environment embedded inside an app",
        "B. A database",
        "C. A navigation library",
        "D. A native storage system"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does `onMessage` help you do?",
      "options": [
        "A. Receive messages from the WebView",
        "B. Create a database",
        "C. Navigate between native tabs",
        "D. Resize an image"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why might you intercept WebView navigation?",
      "options": [
        "A. To let native code take control of specific URLs",
        "B. To make images larger",
        "C. To create database tables",
        "D. To change the app icon"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is a cookie commonly used for in web authentication?",
      "options": [
        "A. Helping a website maintain a user's session",
        "B. Rendering images",
        "C. Creating native buttons",
        "D. Measuring screen dimensions"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What can a deep link from a WebView do?",
      "options": [
        "A. Help hand navigation from web content to a native screen",
        "B. Increase image resolution",
        "C. Create a SQLite database",
        "D. Change the device's wallpaper"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why should WebView URLs be validated?",
      "options": [
        "A. To prevent unexpected or malicious destinations from being treated as trusted",
        "B. To make images sharper",
        "C. To increase battery capacity",
        "D. To create navigation tabs"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Which question is most useful when deciding between WebView and native?",
      "options": [
        "A. \"Does this experience belong to the web or to the native app?\"",
        "B. \"Which option has fewer lines of code?\"",
        "C. \"Can I avoid learning React Native?\"",
        "D. \"Can I put everything into one WebView?\""
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should WebView navigation interception validate?",
      "options": [
        "A. The destination URL and origin",
        "B. Only the screen color",
        "C. The device battery level",
        "D. The list item count"
      ],
      "correctIndex": 0,
      "explanation": "Validate every destination before allowing navigation."
    },
    {
      "question": "What information should cross from a WebView into native code?",
      "options": [
        "A. Only the minimum validated data needed",
        "B. Every cookie and page variable",
        "C. Untrusted executable code",
        "D. The entire browser history"
      ],
      "correctIndex": 0,
      "explanation": "Keep the WebView-to-native boundary narrow and validate its data."
    },
    {
      "question": "When is a native screen usually better than a WebView?",
      "options": [
        "A. When the experience needs deep native integration and performance",
        "B. Whenever HTML exists",
        "C. Only when the app is offline",
        "D. Only on Android"
      ],
      "correctIndex": 0,
      "explanation": "Native screens fit experiences that need strong platform integration, performance, and native behavior."
    }
  ],
  "project": {
    "name": "🛠️ Self-Check — Secure WebView Checkout",
    "goal": "Complete the Day 14 self-check project.",
    "brief": "Now let's put everything together.\n\nYour challenge:\n\n> **Embed a checkout flow in a WebView, intercept the success URL, and safely hand the result back to native code.**\n\n---\n\n# Step 1 — Create the checkout screen\n\nYour native application should have something like:\n\n```\nCheckoutScreen\n     │\n     ▼\n  WebView\n     │\n     ▼\nhttps://example.com/checkout\n```\n\nThe WebView displays the existing checkout experience.\n\n---\n\n# Step 2 — Restrict navigation\n\nDon't automatically allow the WebView to navigate anywhere.\n\nThink about your allowed domains:\n\n```\nAllowed:\n\nhttps://checkout.example.com\nhttps://payments.example.com\n```\n\nPotentially blocked:\n\n```\nhttps://random-site.com\n```\n\nThe exact list depends on your application.\n\n---\n\n# Step 3 — Define your success URL\n\nFor example:\n\n```\nhttps://checkout.example.com/success\n```\n\nYour native application should recognize this specific destination.\n\nBut don't simply do:\n\n```\nurl.includes(\"success\")\n```\n\nInstead, parse the URL and verify the expected:\n\n```\nscheme\nhost\npath\nparameters\n```\n\n---\n\n# Step 4 — Intercept the success navigation\n\nThe flow should look like:\n\n```\nWebView\n  │\n  ▼\nUser completes payment\n  │\n  ▼\nSuccess URL\n  │\n  ▼\nNative checks URL\n  │\n  ├── Expected → Stop WebView navigation\n  │\n  └── Unexpected → Don't treat as success\n```\n\n---\n\n# Step 5 — Extract only safe information\n\nSuppose the URL contains:\n\n```\nhttps://checkout.example.com/success?orderId=12345\n```\n\nYour native app might extract:\n\n```\norderId = 12345\n```\n\nBut don't blindly trust arbitrary parameters.\n\nValidate:\n\n```\nIs orderId present?\nIs it the expected format?\nDoes it correspond to a valid order?\n```\n\nFor important payment systems, the client should not treat a success URL alone as final proof of payment. The backend should verify the transaction with the payment provider or its own trusted records.\n\nThis distinction is extremely important.\n\n```\nWebView says:\n\"Payment successful\"\n\n       ↓\n\nNative app\n       ↓\n\nBackend verifies payment\n       ↓\n\nTrusted order state\n```\n\n---\n\n# Step 6 — Return to native UI\n\nOnce the flow is complete:\n\n```\nWebView\n  ↓\nSuccess detected\n  ↓\nClose WebView\n  ↓\nNative screen\n  ↓\nCheck order status\n  ↓\nShow confirmation\n```\n\nFor example:\n\n```\n┌─────────────────────────────┐\n│                             │\n│       Payment Complete ✓    │\n│                             │\n│       Order #12345          │\n│                             │\n│       [ Continue ]          │\n│                             │\n└─────────────────────────────┘\n```\n\n---\n\n# Step 7 — Test failure paths\n\nDon't test only:\n\n```\nSuccess ✓\n```\n\nAlso test:\n\n```\nUser cancels\nNetwork fails\nWebView crashes\nUnexpected URL\nInvalid success parameters\nPayment fails\nUser closes the screen\nApp is backgrounded\nApp is reopened\n```\n\nA production WebView feature needs to handle more than the happy path.\n\nThe **happy path** means the normal scenario where everything works exactly as expected.\n\n---",
    "steps": [],
    "acceptance": [],
    "footer": "# 🧠 Final Day 14 Mental Model\n\nBy the end of today, you should understand WebView as a **boundary between two worlds**:\n\n```\n            React Native\n                 │\n                 │\n         ┌───────▼────────┐\n         │    WebView     │\n         │                │\n         │ HTML           │\n         │ CSS            │\n         │ JavaScript     │\n         └───────┬────────┘\n                 │\n       ┌─────────┼─────────┐\n       │         │         │\n       ▼         ▼         ▼\n     URLs     Messages   Sessions\n       │         │         │\n       ▼         ▼         ▼\n   Validate   Validate   Protect\n```\n\nAnd communication looks like:\n\n```\nWeb\n│\n│ postMessage\n▼\nNative\n│\n│ injectedJavaScript\n▼\nWeb\n```\n\nNavigation can look like:\n\n```\nWeb\n↓\nSuccess URL\n↓\nNative intercepts\n↓\nNative verifies result\n↓\nNative screen\n```\n\nAnd your architectural decision should look like:\n\n```\n             New Feature\n                 │\n                 ▼\n       Existing web experience?\n            /\n          Yes           No\n           │             │\n           ▼             ▼\n    WebView candidate   Native\n           │\n           ▼\n     Needs deep native\n        integration?\n        /\n      Yes         No\n       │           │\n       ▼           ▼\n  Consider native  WebView\n```\n\n## 🎯 The Big Lesson\n\nA WebView isn't simply:\n\n> \"A website inside a mobile app.\"\n\nIt's a **boundary**.\n\nOn one side:\n\n```\nReact Native\nNative navigation\nNative APIs\nNative state\n```\n\nOn the other:\n\n```\nHTML\nCSS\nWeb JavaScript\nCookies\nWeb sessions\n```\n\nYour job as a React Native developer is to make that boundary **intentional, secure, and predictable**.\n\nWhen the web and native sides need to communicate, define exactly **what can cross the boundary, in which direction, and how it is validated**."
  }
});

