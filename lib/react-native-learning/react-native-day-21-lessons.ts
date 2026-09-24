import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_21_LESSONS = normalizePastedLessonDay({
  "day": 21,
  "title": "Authentication Architecture",
  "overview": "📖 **6 lessons**\n\nAuthentication is the part of your app that answers:\n\n> **\"Who is this user, and how can the app prove it to the server?\"**\n\nOn a beginner project, authentication can look like:\n\n```\nLogin screen\n   ↓\nEmail + password\n   ↓\nLogged in\n```\n\nIn a real mobile application, there is much more happening:\n\n```\nLogin\n ↓\nAccess token\n ↓\nRefresh token\n ↓\nSecure storage\n ↓\nAPI requests\n ↓\nToken expiration\n ↓\nRefresh\n ↓\nLogout\n```\n\nAnd because this is a mobile app, we also need to think about:\n\n- The application going into the background.\n- The user returning after several hours.\n- Tokens being stored securely.\n- Biometric authentication.\n- Session expiration.\n- Social login.\n- OAuth/OIDC.\n- Clearing cached private data during logout.\n\nLet's break it all down.",
  "totalMinutes": 60,
  "difficulty": "Intermediate",
  "lessons": [
    {
      "id": "rn21-1",
      "title": "Access tokens vs refresh tokens",
      "durationMinutes": 12,
      "explanation": "⏱ **12 min**\n\n## Explanation\n\nThe first important concept is understanding the difference between an **access token** and a **refresh token**.\n\nA **token** is a piece of data that the application can present to a server to prove something about the user's authenticated session.\n\nThink of it like a temporary digital pass.\n\nFor example, after logging in:\n\n```\nUser\n↓\nEmail + password\n↓\nServer\n↓\nAuthentication successful\n↓\nAccess token + Refresh token\n```\n\nThe server might return something conceptually like:\n\n```\n{\n\"accessToken\": \"...\",\n\"refreshToken\": \"...\"\n}\n```\n\nDon't think of these as ordinary passwords.\n\nThey are credentials used by the application to manage the user's session.\n\n---\n\n## What is an access token?\n\nAn **access token** is the credential your application normally sends when calling protected APIs.\n\nFor example:\n\n```\nMobile app\n  ↓\nGET /profile\n  ↓\nAuthorization: Bearer <access-token>\n  ↓\nServer\n```\n\nThe server receives the access token and checks whether it is valid.\n\nIf it is valid:\n\n```\nServer\n↓\nHere is the user's profile\n```\n\nIf it isn't valid:\n\n```\nServer\n↓\n401 Unauthorized\n```\n\n### What does 401 Unauthorized mean?\n\n**401 Unauthorized** is an HTTP response meaning:\n\n> The server did not accept the authentication credentials for this request.\n\nIt doesn't necessarily mean the user has no account.\n\nIt usually means the current authentication credential cannot be accepted.\n\n---\n\n## Why shouldn't an access token live forever?\n\nBecause a long-lived credential increases the amount of time a stolen credential could potentially be useful.\n\nInstead, many authentication systems make access tokens relatively short-lived.\n\nFor example:\n\n```\nAccess token\n  ↓\nValid for a limited period\n  ↓\nExpires\n```\n\nThe exact lifetime depends on the authentication system.\n\nDon't hard-code an assumption such as \"access tokens always expire after exactly X minutes.\"\n\nThe server's authentication policy determines that.\n\n---\n\n# What is a refresh token?\n\nA **refresh token** is a longer-lived credential used to obtain a new access token without requiring the user to enter their password again.\n\nConceptually:\n\n```\nAccess token expires\n      ↓\nApp sends refresh token\n      ↓\nAuthentication server\n      ↓\nNew access token\n```\n\nThis gives the user a much better experience.\n\nImagine a user logs in on Monday.\n\nYou don't want them to enter their password every time the short-lived access token expires.\n\nInstead:\n\n```\nMonday\nLogin\n↓\nAccess token + refresh token\n\nLater\nAccess token expires\n↓\nRefresh\n↓\nNew access token\n```\n\nThe user can continue using the application.\n\n---\n\n## Access token vs refresh token\n\nThink of them this way:\n\n| Token | Main purpose | Typical lifetime |\n| --- | --- | --- |\n| Access token | Access protected APIs | Shorter |\n| Refresh token | Obtain a new access token | Longer |\n\nThe exact lifetimes are determined by your authentication system.\n\n---\n\n# Where should tokens be stored?\n\nThis is especially important on mobile.\n\nYou generally don't want sensitive authentication credentials sitting in ordinary, unprotected application storage.\n\nFor the architecture in this course, use **SecureStore** for sensitive tokens.\n\nOn supported platforms, secure storage uses platform security mechanisms such as:\n\n- iOS Keychain\n- Android Keystore-backed storage\n\nThe important idea is:\n\n```\nSensitive authentication data\n          ↓\n     Secure storage\n```\n\nrather than treating tokens like ordinary application preferences.\n\n---\n\n## Why not use AsyncStorage for tokens?\n\nAsyncStorage is useful for ordinary small key-value data.\n\nFor example:\n\n```\ntheme = \"dark\"\nonboardingComplete = true\n```\n\nBut authentication tokens are sensitive credentials.\n\nSo you should use a security-focused storage mechanism designed for secrets.\n\nThat is why the architecture from Day 10 matters here.\n\n---\n\n## A typical authentication flow\n\n```\n            ┌─────────────┐\n            │ Login screen│\n            └──────┬──────┘\n                   ↓\n            Send credentials\n                   ↓\n              Auth server\n                   ↓\n        ┌──────────┴──────────┐\n        ↓                     ↓\n    Access token        Refresh token\n        ↓                     ↓\n    API requests          SecureStore\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- An access token is normally used to access protected APIs.\n- A refresh token is used to obtain a new access token.\n- Access tokens are commonly shorter-lived.\n- Refresh tokens are commonly longer-lived.\n- Sensitive tokens should be stored using secure storage.\n- Token lifetime and behavior should ultimately come from the authentication system and server."
      ],
      "commonMistakes": [
        "### Mistake 1: Treating an access token like a password\n\nA token is a credential, but it isn't the same thing as the user's original password.\n\n### Mistake 2: Putting sensitive tokens in ordinary storage\n\nUse a secure storage mechanism intended for credentials.\n\n### Mistake 3: Assuming the access token never expires\n\nYour app needs to handle expiration.\n\n### Mistake 4: Putting authentication logic directly into every screen\n\nAuthentication should be centralized rather than duplicated across the application."
      ],
      "quiz": [
        {
          "question": "What is the main purpose of a refresh token?",
          "options": [
            "A. Display the user's profile",
            "B. Get a new access token without requiring the user to log in again",
            "C. Store the user's theme",
            "D. Replace the user's password"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn21-2",
      "title": "Token rotation and silent refresh",
      "durationMinutes": 10,
      "explanation": "⏱ **10 min**\n\n## Explanation\n\nNow let's make the previous lesson more realistic.\n\nSuppose your access token expires.\n\nYour application should ideally refresh the session without interrupting the user.\n\nThis is called **silent refresh**.\n\n**Silent refresh** means obtaining a new access token in the background without asking the user to manually log in again.\n\n---\n\n## The basic flow\n\nImagine:\n\n```\nUser is using app\n     ↓\nAccess token expires\n     ↓\nApp detects expiration\n     ↓\nUse refresh token\n     ↓\nAuthentication server\n     ↓\nNew access token\n     ↓\nContinue request\n```\n\nThe user might never notice this happened.\n\nThat's the goal.\n\n---\n\n## What is token rotation?\n\n**Token rotation** means the server issues a new refresh token when the existing refresh token is used, rather than allowing the same refresh token to be reused indefinitely.\n\nConceptually:\n\n```\nOld refresh token\n     ↓\nUsed to refresh\n     ↓\nServer\n     ↓\nNew access token\n+\nNew refresh token\n```\n\nThe old refresh token may then become invalid.\n\nThis can reduce the usefulness of a stolen refresh token.\n\n---\n\n## Why is rotation useful?\n\nImagine someone somehow obtains an old refresh token.\n\nWith a non-rotating system, that token might continue to work for a long time depending on the server's policy.\n\nWith rotation:\n\n```\nRefresh Token A\n     ↓\nUsed\n     ↓\nRefresh Token B\n     ↓\nA becomes invalid\n```\n\nNow the system can detect suspicious reuse patterns more effectively.\n\n---\n\n## Refresh token reuse detection\n\nA properly designed authentication server can keep track of token relationships.\n\nFor example:\n\n```\nToken A\n ↓\nToken B\n ↓\nToken C\n```\n\nIf an old token suddenly gets used again:\n\n```\nToken A used again\n```\n\nthe server may treat that as suspicious and invalidate the relevant session or token family according to its security policy.\n\nThe exact behavior depends on your authentication provider.\n\n---\n\n## Don't refresh endlessly\n\nA common beginner mistake is:\n\n```\nRequest fails\n ↓\nRefresh\n ↓\nRequest fails\n ↓\nRefresh\n ↓\nRequest fails\n ↓\nRefresh\n```\n\nThis can create an infinite loop.\n\nInstead, authentication logic needs a clear boundary.\n\nFor example:\n\n```\nAPI request\n ↓\n401\n ↓\nTry refresh once\n ↓\nRefresh successful?\n↙       ↘\nYES        NO\n↓          ↓\nRetry      Logout\nrequest    / re-auth\n```\n\n---\n\n## What if refresh fails?\n\nA refresh can fail because:\n\n- The refresh token expired.\n- The session was revoked.\n- The user logged out somewhere else.\n- The server rejected the token.\n- The account was disabled.\n- The token was detected as invalid or reused.\n- The network is unavailable.\n\nYour app should distinguish between temporary network problems and authentication failure where possible.\n\nFor example:\n\n```\nNetwork unavailable\n  ↓\nDon't immediately log user out\n```\n\nversus:\n\n```\nRefresh token rejected\n  ↓\nSession is no longer valid\n  ↓\nRequire login again\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Silent refresh keeps users logged in without repeatedly asking for credentials.\n- Refresh token rotation replaces old refresh tokens with new ones.\n- Refresh logic needs protection against infinite retry loops.\n- A failed refresh doesn't always mean the same thing as a network failure."
      ],
      "commonMistakes": [
        "- Refreshing repeatedly forever.\n- Treating every network error as a logout.\n- Storing refresh tokens in ordinary storage.\n- Retrying an invalid refresh token indefinitely.\n- Failing to handle token rotation."
      ],
      "quiz": [
        {
          "question": "What is the main idea behind silent refresh?",
          "options": [
            "A. Automatically changing the user's password",
            "B. Obtaining a new access token without requiring visible user interaction",
            "C. Deleting the refresh token",
            "D. Refreshing the application's UI"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn21-3",
      "title": "Biometric authentication as a local unlock",
      "durationMinutes": 10,
      "explanation": "⏱ **10 min**\n\n## Explanation\n\nModern phones can authenticate the person holding the device using:\n\n- Face ID\n- Touch ID\n- Fingerprint\n- Other platform-supported biometric methods\n\nThis can make your application feel much more secure and convenient.\n\nBut there is an important distinction:\n\n> **Biometric authentication on the device is not the same thing as server authentication.**\n\nThis distinction is extremely important.\n\n---\n\n## Imagine a banking application\n\nThe server needs to know:\n\n```\nWho is this account?\n```\n\nThat's server authentication.\n\nThe device may then ask:\n\n```\nIs the person currently holding this phone allowed to unlock this locally stored session?\n```\n\nThat's local biometric authentication.\n\nThey solve different problems.\n\n---\n\n## The relationship\n\nA useful mental model is:\n\n```\n               Server\n                 ↑\n                 │\n          Account authentication\n                 │\n            Access/refresh\n               tokens\n                 │\n                 ↓\n              Device\n                 │\n        Local biometric unlock\n                 │\n            Face / Finger\n```\n\nThe biometric check can protect access to the locally stored session.\n\nIt doesn't replace the server's authentication system.\n\n---\n\n## Example flow\n\nA user logs in normally:\n\n```\nEmail + password\n     ↓\nServer authentication\n     ↓\nSession established\n```\n\nLater, the user opens the app:\n\n```\nOpen app\n ↓\nAsk for Face ID\n ↓\nBiometric succeeds\n ↓\nUnlock local session\n```\n\nIf biometric authentication fails:\n\n```\nBiometric failed\n ↓\nDon't unlock protected local content\n```\n\nDepending on your security design, you may offer another authentication path.\n\n---\n\n## Why call it a \"local unlock\"?\n\nBecause the biometric check is performed by the device's operating system.\n\nThe server generally isn't receiving:\n\n```\n\"User's face matched.\"\n```\n\nInstead, your application asks the platform to authenticate the local user.\n\nThe application gets a success/failure result.\n\n---\n\n## Biometric authentication should not become your only authentication mechanism\n\nWhat if:\n\n- The user changes their biometric configuration?\n- Biometrics aren't available?\n- The user gets a new device?\n- The secure session expires?\n- The server revokes the session?\n\nYour app still needs proper server authentication.\n\nThink:\n\n```\nServer authentication\n      +\nLocal biometric unlock\n```\n\nnot:\n\n```\nBiometric = server authentication\n```\n\n---\n\n## Re-authentication on resume\n\nThis becomes especially useful when combined with Day 9.\n\nImagine:\n\n```\nApp active\n ↓\nUser authenticates\n ↓\nApp goes to background\n ↓\nSeveral minutes pass\n ↓\nApp returns\n```\n\nYou may decide that certain screens should require local biometric re-authentication.\n\nFor example:\n\n```\nApp resumes\n  ↓\nSensitive area?\n  ↓\nYes\n  ↓\nRequest biometric authentication\n  ↓\nSuccess → continue\nFailure → keep protected\n```\n\nThe exact timeout and behavior should be part of your security design.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Biometrics provide local device-level authentication.\n- They don't replace server authentication.\n- They can protect access to a locally stored authenticated session.\n- The operating system handles the biometric comparison.\n- Sensitive applications may require re-authentication after backgrounding."
      ],
      "commonMistakes": [
        "### Mistake 1: Calling Face ID your server authentication\n\nIt isn't.\n\n### Mistake 2: Assuming biometric authentication works on every device\n\nDevices and platform configurations differ.\n\n### Mistake 3: Locking the entire account permanently after one failed biometric attempt\n\nFollow the platform's biometric behavior and provide an appropriate fallback.\n\n### Mistake 4: Forgetting about session expiration\n\nBiometric success doesn't make an expired server session valid again."
      ],
      "quiz": [
        {
          "question": "What is biometric authentication primarily doing in this architecture?",
          "options": [
            "A. Replacing the backend authentication system",
            "B. Acting as a local unlock for the device/session",
            "C. Generating API responses",
            "D. Replacing HTTPS"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn21-4",
      "title": "Secure logout",
      "durationMinutes": 10,
      "explanation": "⏱ **10 min**\n\n## Explanation\n\nLogout sounds simple:\n\n```\nUser taps Logout\n     ↓\nGo to login screen\n```\n\nBut that's not enough.\n\nA secure logout needs to consider several places where authenticated state may exist.\n\nThink about:\n\n```\nSecure tokens\nCached server data\nNavigation state\nLocal user data\nIn-memory authentication state\nServer session\n```\n\nAll of these may need attention.\n\n---\n\n## Step 1 — Stop using the authenticated session\n\nYour application should immediately consider the user logged out locally.\n\nFor example:\n\n```\nauthenticated = false\n```\n\nThis should cause protected screens to become inaccessible.\n\n---\n\n## Step 2 — Clear secure credentials\n\nRemove stored authentication credentials from secure storage according to your application's token strategy.\n\nFor example:\n\n```\nSecureStore\n ↓\nAccess credentials\nRefresh credentials\n ↓\nClear\n```\n\nDon't leave an old refresh token sitting around after logout unless your architecture has a specific reason to retain something.\n\n---\n\n## Step 3 — Invalidate the server session\n\nThis is an important distinction.\n\nDeleting a token from the phone doesn't necessarily invalidate a server-side session.\n\nA secure architecture may provide a server-side logout/revocation operation.\n\nConceptually:\n\n```\nApp\n↓\nLogout request\n↓\nServer\n↓\nInvalidate session/refresh token\n```\n\nThe exact implementation depends on your authentication provider.\n\n---\n\n## Step 4 — Clear cached private data\n\nRemember Day 11 and Day 19.\n\nYou may have cached server data:\n\n```\nProfile\nMessages\nOrders\nPrivate posts\nAccount settings\n```\n\nIf User A logs out and User B logs into the same device, User B shouldn't accidentally see User A's cached private information.\n\nTherefore:\n\n```\nLogout\n↓\nClear authentication\n↓\nClear/invalidate user-specific cached queries\n↓\nReset user-specific local state\n```\n\n---\n\n## Step 5 — Reset application state\n\nSuppose Zustand contains:\n\n```\ncurrentUser\nselectedWorkspace\nprivateSettings\n```\n\nThese should not remain after logout if they're user-specific.\n\nOtherwise you can get bugs like:\n\n```\nUser A logs out\n     ↓\nUser B logs in\n     ↓\nUser A's old workspace still appears\n```\n\nThat's both a correctness problem and potentially a privacy problem.\n\n---\n\n## A complete logout flow\n\n```\nUser taps Logout\n     ↓\nStop protected operations\n     ↓\nInvalidate/revoke server session\n     ↓\nClear secure credentials\n     ↓\nClear private server cache\n     ↓\nClear user-specific client state\n     ↓\nReset navigation\n     ↓\nShow login screen\n```\n\nThe exact ordering can vary depending on your architecture, especially if the network is unavailable.\n\n---\n\n## What if the user is offline?\n\nThis is an interesting case.\n\nSuppose the user taps logout with no network connection.\n\nYou can still clear local credentials and local private state.\n\nBut you may not be able to contact the server immediately.\n\nYour architecture needs to decide how server-side session invalidation is handled in that situation.\n\nFor example:\n\n```\nOffline logout\n ↓\nClear local session\n ↓\nUser is logged out locally\n ↓\nServer-side revocation handled according to backend policy\n```\n\nDon't pretend the server was contacted when it wasn't.\n\nThis connects directly to the honest-state principles from Day 20.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "A proper logout should consider:\n\n- Local authentication state.\n- Securely stored credentials.\n- Server-side session state.\n- Cached private data.\n- Global client state.\n- Navigation state.\n\nLogout isn't just navigating to the login screen."
      ],
      "commonMistakes": [
        "### Mistake 1: Only navigating to `/login`\n\nThe old authentication credentials may still exist.\n\n### Mistake 2: Keeping private TanStack Query cache\n\nAnother user could potentially see stale private data.\n\n### Mistake 3: Forgetting global client state\n\nZustand or another state store can retain user information.\n\n### Mistake 4: Assuming server logout always happened\n\nIf the device is offline, the server may not have received the request."
      ],
      "quiz": [
        {
          "question": "Why should private cached server data be cleared during logout?",
          "options": [
            "A. To make the app's animations faster",
            "B. To prevent another user from seeing the previous user's private data",
            "C. Because React requires it",
            "D. To change the app theme"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn21-5",
      "title": "Session expiry and the app lifecycle",
      "durationMinutes": 8,
      "explanation": "⏱ **8 min**\n\n## Explanation\n\nNow we're going to connect authentication to **Day 9 — App Lifecycle**.\n\nA mobile application isn't continuously active.\n\nIt can move through states such as:\n\n```\nActive\n↓\nBackground\n↓\nActive\n```\n\nIt can also be terminated and launched again.\n\nAuthentication needs to survive these transitions correctly.\n\n---\n\n## Example\n\nImagine:\n\n```\n9:00 AM\nUser logs in\n```\n\nThe app receives authentication credentials.\n\nThen:\n\n```\n9:15 AM\nUser locks phone\n```\n\nThe app moves into the background.\n\nLater:\n\n```\n12:30 PM\nUser opens app\n```\n\nA lot may have happened during those three hours.\n\nThe access token could have expired.\n\nThe server session could have changed.\n\nThe refresh token could have become invalid.\n\nThe app needs to check the session rather than blindly assuming:\n\n```\n\"I was logged in three hours ago, so I'm definitely still logged in.\"\n```\n\n---\n\n## Resume flow\n\nA useful mental model is:\n\n```\nApp resumes\n   ↓\nCheck authentication state\n   ↓\nIs access token valid?\n ↙          ↘\nYES           NO\n↓             ↓\nContinue     Try refresh\n             ↓\n        Refresh success?\n           ↙       ↘\n         YES        NO\n          ↓          ↓\n      Continue    Require login\n```\n\n---\n\n## Don't refresh every time blindly\n\nYou don't necessarily need to send a refresh request every time the application becomes active.\n\nYou can use information such as:\n\n- Token expiration time.\n- Time since last authentication check.\n- Current session state.\n- Whether a request actually received an authentication error.\n\nThe exact strategy depends on your backend and security requirements.\n\n---\n\n## What if the app is killed?\n\nThis is different from simply moving into the background.\n\nIf the app is completely terminated:\n\n```\nMemory\n ↓\nGone\n```\n\nIn-memory state disappears.\n\nBut securely persisted authentication information may still exist.\n\nWhen the app launches again:\n\n```\nCold start\n ↓\nRead secure credentials\n ↓\nDetermine session state\n ↓\nRefresh if necessary\n ↓\nShow appropriate screen\n```\n\n---\n\n## What if the refresh token is invalid?\n\nThen the user may need to authenticate again.\n\nFor example:\n\n```\nApp launches\n ↓\nStored refresh token found\n ↓\nRefresh attempted\n ↓\nServer rejects token\n ↓\nSession invalid\n ↓\nClear credentials\n ↓\nShow login\n```\n\nThe user shouldn't remain stuck on a loading screen forever.\n\n---\n\n## Authentication loading state\n\nWhen your app launches, there may be a short period where you don't yet know whether the user is authenticated.\n\nFor example:\n\n```\nApp starts\n ↓\nChecking stored session...\n```\n\nDuring this time, don't immediately show:\n\n```\nLogin screen\n```\n\nbecause you might briefly show login and then switch to the home screen.\n\nInstead, have an explicit authentication-loading state:\n\n```\nunknown\n ↓\nchecking session\n ↓\nauthenticated OR unauthenticated\n```\n\nFor example:\n\n```\nAuth state:\n\nloading\nauthenticated\nunauthenticated\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Backgrounding doesn't automatically mean the user is logged out.\n- Returning to the foreground may require session validation.\n- A killed application loses in-memory state.\n- Securely persisted credentials can survive application restarts.\n- An expired or invalid session should eventually send the user through the appropriate login flow.\n- Authentication initialization should have a loading state."
      ],
      "commonMistakes": [
        "- Assuming background and terminated mean the same thing.\n- Showing the login screen before checking persisted authentication.\n- Treating every resume as a full login.\n- Ignoring expired tokens.\n- Leaving the user stuck on an authentication loading screen."
      ],
      "quiz": [
        {
          "question": "Why do apps usually need an authentication-loading state during startup?",
          "options": [
            "A. To make the splash screen colorful",
            "B. Because the app needs time to determine whether a stored session is still valid",
            "C. Because navigation cannot work",
            "D. Because SecureStore only works on Android"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn21-6",
      "title": "Social login and OAuth/OIDC on mobile",
      "durationMinutes": 10,
      "explanation": "⏱ **10 min**\n\n## Explanation\n\nYou've probably seen buttons such as:\n\n```\nContinue with Google\nContinue with Apple\nContinue with Microsoft\n```\n\nThis is **social login**.\n\nInstead of creating and managing a separate password directly with your application, the user authenticates through an identity provider.\n\nAn **identity provider** is a service responsible for authenticating the user and providing information about that authenticated identity.\n\n---\n\n## What is OAuth?\n\n**OAuth** is an authorization framework.\n\nIt allows an application to obtain authorization to access resources without giving the application the user's password.\n\nThe important point is:\n\n> OAuth is primarily about authorization (what an application is allowed to access), not simply \"logging in.\"\n\n---\n\n## What is OIDC?\n\n**OpenID Connect (OIDC)** is an identity layer built on top of OAuth 2.0.\n\nOIDC adds standardized ways to communicate information about the authenticated user.\n\nA simple mental model:\n\n```\nOAuth\n= Authorization\n\nOIDC\n= Authentication/identity built using OAuth 2.0\n```\n\nIn modern login systems, you'll often encounter OAuth 2.0 and OIDC together.\n\n---\n\n## Mobile login flow\n\nA simplified flow looks like this:\n\n```\nMobile app\n  ↓\nOpen authentication provider\n  ↓\nUser authenticates\n  ↓\nProvider redirects back to app\n  ↓\nApp/backend exchanges authorization result\n  ↓\nApplication gets authenticated session\n```\n\nThe exact architecture depends on your backend and identity provider.\n\n---\n\n## Why not put the user's password directly into your app's custom OAuth implementation?\n\nMobile OAuth/OIDC flows have important security requirements.\n\nModern mobile applications commonly use an **authorization code flow with PKCE**.\n\n### What is PKCE?\n\n**PKCE** stands for **Proof Key for Code Exchange**.\n\nIt's a security mechanism designed to protect authorization-code flows, especially for public clients such as mobile applications.\n\nThe simplified idea is:\n\n```\nApp creates secret verifier\n      ↓\nCreates challenge from verifier\n      ↓\nStarts authorization\n      ↓\nUser authenticates\n      ↓\nAuthorization server returns code\n      ↓\nApp sends code + verifier\n      ↓\nServer verifies relationship\n      ↓\nTokens issued\n```\n\nThe application doesn't simply receive a long-lived token from an arbitrary URL and trust it.\n\n---\n\n## Why are redirects important?\n\nAfter authentication, the identity provider needs a way to return the user to your application.\n\nFor example:\n\n```\nBrowser\n ↓\nAuthentication\n ↓\nRedirect\n ↓\nMy mobile app\n```\n\nThis can use deep linking or universal/app links depending on the platform and architecture.\n\nThis connects directly to your Day 5 navigation lessons.\n\n---\n\n## Social login doesn't remove your backend\n\nA common misunderstanding is:\n\n```\nGoogle login\n ↓\nNo backend required\n```\n\nNot necessarily.\n\nYour application may still need a backend to:\n\n- Create an application user.\n- Associate the external identity with your account.\n- Manage application-specific permissions.\n- Create your application's session.\n- Store application data.\n\nThink of the identity provider as helping establish identity.\n\nYour backend still needs to manage your application's authorization and data.\n\n---\n\n## Authentication vs authorization\n\nThese words sound similar but mean different things.\n\n**Authentication** means:\n\n> Who are you?\n\nExample:\n\n```\nThis is Alice.\n```\n\n**Authorization** means:\n\n> What are you allowed to do?\n\nExample:\n\n```\nAlice can edit this document.\nAlice cannot delete the organization.\n```\n\nA user can be authenticated but not authorized to perform a particular action.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Social login uses an external identity provider.\n- OAuth is primarily an authorization framework.\n- OIDC adds an identity layer on top of OAuth 2.0.\n- Mobile applications commonly use authorization code + PKCE.\n- Redirects connect the authentication provider back to the mobile application.\n- Authentication and authorization are different concepts."
      ],
      "commonMistakes": [
        "### Mistake 1: Calling OAuth simply \"a login protocol\"\n\nOAuth is primarily about authorization.\n\n### Mistake 2: Handling authentication entirely inside a WebView\n\nModern authentication flows should use appropriate platform/browser-based mechanisms rather than blindly embedding arbitrary login pages.\n\n### Mistake 3: Trusting arbitrary redirect data\n\nAuthentication callbacks need careful validation.\n\n### Mistake 4: Thinking social login means you don't need a backend\n\nYour application may still need its own account and authorization system."
      ],
      "quiz": [
        {
          "question": "What does authentication answer?",
          "options": [
            "A. What color should the button be?",
            "B. Who is the user?",
            "C. How many screens are in the app?",
            "D. How fast is the network?"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    }
  ],
  "finalQuiz": [
    {
      "question": "What is the main purpose of a refresh token?",
      "options": [
        "A. Display the user's profile",
        "B. Get a new access token without requiring the user to log in again",
        "C. Store the user's theme",
        "D. Replace the user's password"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "What is the main idea behind silent refresh?",
      "options": [
        "A. Automatically changing the user's password",
        "B. Obtaining a new access token without requiring visible user interaction",
        "C. Deleting the refresh token",
        "D. Refreshing the application's UI"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "What is biometric authentication primarily doing in this architecture?",
      "options": [
        "A. Replacing the backend authentication system",
        "B. Acting as a local unlock for the device/session",
        "C. Generating API responses",
        "D. Replacing HTTPS"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "Why should private cached server data be cleared during logout?",
      "options": [
        "A. To make the app's animations faster",
        "B. To prevent another user from seeing the previous user's private data",
        "C. Because React requires it",
        "D. To change the app theme"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "Why do apps usually need an authentication-loading state during startup?",
      "options": [
        "A. To make the splash screen colorful",
        "B. Because the app needs time to determine whether a stored session is still valid",
        "C. Because navigation cannot work",
        "D. Because SecureStore only works on Android"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "What does authentication answer?",
      "options": [
        "A. What color should the button be?",
        "B. Who is the user?",
        "C. How many screens are in the app?",
        "D. How fast is the network?"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "Where should sensitive refresh tokens be stored on a mobile device?",
      "options": [
        "A. Secure platform-backed storage",
        "B. Plain AsyncStorage",
        "C. A UI component",
        "D. A route parameter"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should happen when silent refresh permanently fails?",
      "options": [
        "A. End the authenticated session safely",
        "B. Retry forever",
        "C. Ignore expiration",
        "D. Expose the refresh token"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What must logout clear besides token values?",
      "options": [
        "A. User-specific cached and client state",
        "B. Every installed application",
        "C. Public static assets",
        "D. Device settings"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Which mobile OAuth flow protects the authorization code exchange?",
      "options": [
        "A. Authorization Code with PKCE",
        "B. Password in a deep link",
        "C. Token in source code",
        "D. Implicit trust"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "footer": "# 🔗 The Complete Authentication Architecture\n\nNow let's connect everything.\n\nA typical authenticated mobile application can look like this:\n\n```\n                        ┌─────────────────┐\n                        │   Login screen  │\n                        └────────┬────────┘\n                                 ↓\n                        Authentication\n                                 ↓\n                   ┌─────────────┴─────────────┐\n                   ↓                           ↓\n            Access token                Refresh token\n                   ↓                           ↓\n            API requests                 SecureStore\n                   ↓                           ↓\n                Server              Silent refresh\n                   │                           │\n                   └─────────────┬─────────────┘\n                                 ↓\n                           Authenticated\n                               session\n                                 ↓\n                    ┌────────────┴────────────┐\n                    ↓                         ↓\n             App foreground              App background\n                    ↓                         ↓\n             Check session              Wait/resume\n                    ↓                         ↓\n                Continue              Validate/refresh\n```\n\nAnd for local security:\n\n```\nAuthenticated session\n       ↓\nUser leaves app\n       ↓\nApp backgrounded\n       ↓\nUser returns\n       ↓\nBiometric required?\n     ↙       ↘\n   YES        NO\n    ↓          ↓\nAuthenticate  Continue\n    ↓\nUnlock\n```\n\n---\n\n# 🧠 The Authentication State Machine\n\nInstead of thinking only in terms of:\n\n```\nloggedIn = true\n```\n\na real application benefits from thinking about several states.\n\nFor example:\n\n```\nchecking\n  ↓\nunauthenticated\n  ↓\nauthenticating\n  ↓\nauthenticated\n  ↓\nrefreshing\n  ↓\nauthenticated\n```\n\nOr:\n\n```\nauthenticated\n     ↓\naccess token expired\n     ↓\nrefreshing\n   ↙       ↘\nsuccess     failure\n ↓           ↓\nauthenticated unauthenticated\n```\n\nThis makes your application's behavior easier to reason about.",
  "project": {
    "name": "Self-check: Build a complete authentication flow",
    "goal": "Build a complete authentication flow.",
    "brief": "Now it's time to combine the entire lesson.\n\nBuild a small React Native application with:\n\n```\nLogin\nHome\nProfile\nLogout\n```\n\nYour application should have a simulated authentication backend or a real authentication backend if you already have one.\n\n---\n\n## Step 1 — Implement login\n\nCreate:\n\n```\nEmail\nPassword\n[Log in]\n```\n\nAfter successful authentication:\n\n```\nLogin\n ↓\nAccess token\nRefresh token\n ↓\nAuthenticated state\n ↓\nHome\n```\n\n---\n\n## Step 2 — Store the refresh credential securely\n\nUse secure storage for the sensitive authentication credential according to your token architecture.\n\nDo not put sensitive authentication credentials into ordinary application storage simply because it is convenient.\n\n---\n\n## Step 3 — Protect authenticated screens\n\nA user who isn't authenticated shouldn't be able to navigate directly into:\n\n```\n/home\n/profile\n/settings\n```\n\nYour navigation structure should respect authentication state.\n\nConceptually:\n\n```\n             App\n              ↓\n       Is session known?\n         ↙          ↘\n      No/Loading    Known\n         ↓            ↓\n      Loading     Authenticated?\n                    ↙       ↘\n                  YES        NO\n                   ↓          ↓\n              App screens   Login\n```\n\n---\n\n## Step 4 — Implement access-token expiration\n\nMake your test environment simulate an expired access token.\n\nThen implement:\n\n```\nAPI request\n   ↓\nAccess token expired\n   ↓\nRefresh\n   ↓\nNew access token\n   ↓\nRetry original request\n```\n\nThe retry should not create an infinite refresh loop.\n\n---\n\n## Step 5 — Simulate refresh failure\n\nNow make the refresh token invalid.\n\nYour application should eventually transition to:\n\n```\nAuthenticated\n     ↓\nRefresh fails\n     ↓\nSession invalid\n     ↓\nClear local authentication\n     ↓\nLogin\n```\n\nDon't leave the application showing a protected screen forever.\n\n---\n\n## Step 6 — Add biometric unlock\n\nAfter the user has an authenticated session, add an optional local biometric lock.\n\nFor example:\n\n```\nOpen app\n  ↓\nExisting session\n  ↓\nBiometric enabled?\n  ↓\nYes\n  ↓\nFace ID / fingerprint\n  ↓\nSuccess\n  ↓\nHome\n```\n\nRemember:\n\n**Biometric authentication is a local unlock, not a replacement for server authentication.**\n\n---\n\n## Step 7 — Implement secure logout\n\nWhen the user taps:\n\n```\nLogout\n```\n\nmake sure you consider:\n\n```\nServer session\nSecure credentials\nTanStack Query cache\nZustand/client state\nNavigation state\n```\n\nAfter logout, the application should return to the unauthenticated state.\n\n---\n\n## Step 8 — Test the lifecycle\n\nTest these situations deliberately.\n\n### Test A — Normal login\n\n```\nLaunch\n→ Login\n→ Home\n```\n\n### Test B — App background\n\n```\nHome\n→ Background\n→ Resume\n```\n\nVerify the session behaves correctly.\n\n### Test C — Expired access token\n\n```\nHome\n→ Token expires\n→ API request\n→ Refresh\n→ Continue\n```\n\n### Test D — Invalid refresh token\n\n```\nHome\n→ Access token expires\n→ Refresh fails\n→ Login\n```\n\n### Test E — App restart\n\n```\nAuthenticated\n→ Kill app\n→ Launch again\n→ Restore/check session\n```\n\n### Test F — Biometric failure\n\n```\nLaunch\n→ Biometric prompt\n→ Authentication fails\n→ Protected content remains protected\n```\n\n### Test G — Logout\n\n```\nAuthenticated\n→ Logout\n→ Clear credentials\n→ Clear private cache\n→ Login\n```",
    "steps": [],
    "acceptance": [
      "Access and refresh tokens have clearly different purposes.",
      "Sensitive authentication credentials are stored securely.",
      "Access-token expiration is handled.",
      "Silent refresh works.",
      "Refresh failures eventually end the authenticated session.",
      "Refresh logic cannot loop forever.",
      "Biometric authentication is treated as a local unlock.",
      "Logout clears local authentication state.",
      "Private cached server data is cleared or invalidated appropriately.",
      "User-specific client state is reset appropriately.",
      "Authentication state survives normal app restarts according to your design.",
      "App lifecycle transitions are handled.",
      "Social/OAuth/OIDC architecture is understood conceptually.",
      "Authentication and authorization are treated as separate concepts."
    ],
    "stretch": [
      "Refresh-token rotation.",
      "Multiple-device sessions.",
      "\"Log out all devices.\"",
      "Session/device management.",
      "Biometric re-authentication after a configurable period.",
      "Account deletion flow.",
      "Password reset flow.",
      "Email verification.",
      "Social login with OAuth/OIDC.",
      "PKCE-based authorization code flow.",
      "Automatic handling of `401` responses.",
      "A centralized authentication service.",
      "Authentication event logging for development.",
      "A dedicated session-expiration screen instead of abruptly returning to login."
    ],
    "footer": "The most important lesson from Day 21 is:"
  }
});

