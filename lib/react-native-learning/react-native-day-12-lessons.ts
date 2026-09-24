import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_12_LESSONS = normalizePastedLessonDay({
  "day": 12,
  "title": "Push Notifications and Background Work",
  "overview": "Today we're going to work with something almost every real mobile application eventually needs:\n\n> **Notifications and work that happens when the user isn't actively looking at the app.**\n\nThink about apps you use every day:\n\n```\n\"Your order has shipped.\"\n\"You received a new message.\"\n\"Your meeting starts in 10 minutes.\"\n\"Someone liked your post.\"\n\"Your download is ready.\"\n```\n\nThese are all examples of events that can happen **outside the normal screen-rendering flow**.\n\nBy the end of today, you'll understand:\n\n- Local notifications\n- Remote push notifications\n- Push tokens\n- Notification taps\n- Deep linking from notifications\n- Background tasks\n- iOS and Android background limitations\n- What happens when the app is foregrounded, backgrounded, or completely killed\n\n---",
  "totalMinutes": 50,
  "difficulty": "Beginner → Intermediate",
  "lessons": [
    {
      "id": "rn12-1",
      "title": "Local vs Remote Push Notifications",
      "durationMinutes": 9,
      "explanation": "Let's start with the most important distinction.\n\nThere are two common types of notifications:\n\n```\nLocal notification\nRemote push notification\n```\n\nThey may look almost identical to the user, but they work differently.\n\n---\n\n## What is a local notification?\n\nA **local notification** is created by the application running on the device.\n\nThe application doesn't necessarily need your server to send it.\n\nFor example:\n\n```\nYou set a reminder:\n\n\"Drink water at 3:00 PM\"\n```\n\nYour application can schedule a notification on the device:\n\n```\nApp\n↓\nSchedule notification\n↓\nDevice\n↓\n3:00 PM\n↓\nNotification appears\n```\n\nThe server doesn't have to send anything at 3:00 PM.\n\n---\n\n## Example use cases\n\nLocal notifications are useful for things like:\n\n- Reminders\n- Timers\n- Scheduled alerts\n- Calendar reminders\n- Habit reminders\n- Local events\n\nImagine a meditation app.\n\nThe user says:\n\n```\nRemind me to meditate every day at 8 AM.\n```\n\nThe app can schedule a local notification.\n\n---\n\n# What is a remote push notification?\n\nA **remote push notification** comes from outside the device.\n\nUsually the architecture looks something like:\n\n```\nYour Server\n    ↓\nPush Service\n    ↓\nApple / Google\n    ↓\nUser's Device\n    ↓\nYour App\n```\n\nYour backend might decide:\n\n```\nOrder #123 has shipped\n```\n\nand send a push notification.\n\n---\n\n## Why can't the app simply send itself the notification?\n\nBecause the application may not be running.\n\nImagine:\n\n```\nUser closes your app\n       ↓\nApp isn't running\n       ↓\nServer has important event\n       ↓\n\"Your package shipped\"\n```\n\nYour server still needs a way to reach the device.\n\nThat's one of the main purposes of push notifications.\n\n---\n\n# Expo Notifications\n\nIn an Expo-based React Native application, one of the main tools you'll encounter is:\n\n```\nexpo-notifications\n```\n\nIt provides APIs for working with notifications.\n\nConceptually:\n\n```\nYour React Native app\n       ↓\nexpo-notifications\n       ↓\nDevice notification system\n```\n\n---\n\n# Local notification flow\n\nA simplified local notification flow looks like:\n\n```\nReact Native app\n     ↓\nexpo-notifications\n     ↓\nSchedule notification\n     ↓\niOS / Android\n     ↓\nNotification appears\n```\n\n---\n\n# Remote notification flow\n\nRemote notifications involve more pieces:\n\n```\nYour app\n  ↓\nGets push token\n  ↓\nYour backend stores token\n  ↓\nBackend decides to send notification\n  ↓\nPush notification service\n  ↓\nApple / Google infrastructure\n  ↓\nDevice\n  ↓\nNotification\n```\n\nThis distinction is important.\n\nYour application generally **doesn't directly send a push notification to another user's phone**.\n\nYour backend typically communicates with the appropriate push service.\n\n---",
      "diagram": "```\n            LOCAL NOTIFICATION\n\n       React Native App\n               │\n               ▼\n      expo-notifications\n               │\n               ▼\n            Device\n               │\n               ▼\n         Notification\n\n            REMOTE PUSH\n\n            Your Server\n                │\n                ▼\n         Push infrastructure\n                │\n                ▼\n             Device\n                │\n                ▼\n           Notification\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Local notifications are scheduled by the device/application.\n- Remote notifications originate from a remote system.\n- `expo-notifications` provides notification functionality for Expo apps.\n- Remote notifications normally involve a backend and push infrastructure.\n- The app doesn't have to be open for a remote push notification to arrive.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Thinking all notifications are remote\n\nTimers and reminders can be local.\n\n### ❌ Thinking the app must be running for push notifications\n\nOne of the purposes of push notifications is reaching the user when the app isn't actively open.\n\n### ❌ Confusing notification delivery with notification handling\n\nReceiving a notification and deciding what happens when the user taps it are separate concerns.\n\n---"
      ],
      "quiz": [
        {
          "question": "Which is an example of a local notification?",
          "options": [
            "A. A reminder scheduled on the device",
            "B. A server telling you your order shipped",
            "C. A message received from a chat server",
            "D. A backend sending breaking news"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn12-2",
      "title": "Push Tokens — How Does the Server Find Your Device?",
      "durationMinutes": 9,
      "explanation": "Here's a question that beginners often ask:\n\n> \"How does my server know which phone should receive the notification?\"\n\nThe answer involves a **push token**.\n\nA push token is an identifier used by the notification system to target a particular app installation/device for push delivery.\n\nThink of it like an address.\n\nNot your home address.\n\nMore like:\n\n```\n\"Where should this push notification be delivered?\"\n```\n\n---\n\n# The basic flow\n\nWhen your application registers for push notifications, it can obtain a token.\n\nConceptually:\n\n```\nApp\n↓\nAsk notification permission\n↓\nRegister for push notifications\n↓\nReceive push token\n```\n\nThen your application sends that token to your backend:\n\n```\nDevice\n  ↓\n\"Here is my push token\"\n  ↓\nYour Server\n```\n\nYour server stores it.\n\nLater:\n\n```\nNew event\n  ↓\nFind user's push token\n  ↓\nSend notification\n```\n\n---\n\n# Where is the token registered?\n\nThis is an important architecture question.\n\nYou usually don't want the push token to live only inside the device.\n\nYour backend needs it too.\n\nA simplified database might look like:\n\n```\nUsers\n──────────────────────\nuser_id\nname\nemail\n```\n\nand perhaps:\n\n```\nPushTokens\n──────────────────────\nuser_id\npush_token\nplatform\ncreated_at\n```\n\nSo the relationship is:\n\n```\nUser\n │\n └── Push token\n        │\n        ▼\n   Notification\n```\n\n---\n\n# Why can one user have multiple tokens?\n\nBecause a user can have multiple devices.\n\nFor example:\n\n```\nAlex\n├── iPhone\n├── iPad\n└── Android tablet\n```\n\nEach installation may have its own push registration/token.\n\nYour backend therefore needs to think about:\n\n```\nUser\n↓\nMultiple devices\n↓\nMultiple push tokens\n```\n\n---\n\n# Tokens can change\n\nDon't assume a push token is permanent forever.\n\nYour application should be prepared for token changes and should keep the backend's stored token information up to date.\n\nThis is one reason registration should be treated as an ongoing part of app setup rather than:\n\n```\nGet token once\nForget about it forever\n```\n\n---\n\n# Permission comes first\n\nOn supported platforms, notification permissions matter.\n\nThe general flow is:\n\n```\nUser\n↓\nApp explains notifications\n↓\nPermission request\n↓\nUser allows?\n├── Yes → Register for push\n└── No  → Handle disabled notifications\n```\n\nDon't treat permission as guaranteed.\n\n---\n\n# A good user experience\n\nInstead of immediately showing:\n\n```\n\"Allow notifications?\"\n```\n\nwhen the application launches, consider explaining the value first.\n\nFor example:\n\n```\nStay updated\n\nWe'll notify you when your order ships.\n\n[ Enable notifications ]\n```\n\nThen request permission.\n\nThis is called **contextual permission requesting**.\n\nIt means asking when the user understands why the permission is useful.\n\n---",
      "diagram": "```\n            App installation\n                   │\n                   ▼\n         Request notification\n             permission\n                   │\n             ┌─────┴─────┐\n             │           │\n           Allow        Deny\n             │           │\n             ▼           ▼\n       Get push token   Continue\n             │          without\n             ▼         notifications\n        Send token\n         to server\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- A push token helps identify where a push notification should be delivered.\n- Your backend generally stores the token.\n- One user may have multiple devices/tokens.\n- Tokens can change.\n- Notification permission must be handled explicitly.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Storing only one token per user\n\nA user can have multiple devices.\n\n### ❌ Assuming permission is always granted\n\nThe user controls notification permission.\n\n### ❌ Treating the token as permanent\n\nYour registration system should be able to update it.\n\n---"
      ],
      "quiz": [
        {
          "question": "Why does your backend need a push token?",
          "options": [
            "A. To know where to send a push notification",
            "B. To change the app's font",
            "C. To store the user's password",
            "D. To navigate between tabs"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn12-3",
      "title": "Handling Notification Taps in Every App State",
      "durationMinutes": 11,
      "explanation": "This is one of the most important parts of today's lesson.\n\nA notification can arrive when your application is in different states.\n\nWe need to think about at least three:\n\n```\nForeground\nBackground\nKilled / not running\n```\n\nThese states can change what your application needs to do.\n\n---\n\n# State 1 — Foreground\n\n**Foreground** means the application is currently active and visible to the user.\n\nFor example:\n\n```\nUser is looking at your app\n      ↓\nPush notification arrives\n```\n\nYour application can respond to the notification while it is active.\n\nDepending on your notification configuration and platform behavior, you may decide whether/how to present notification UI.\n\nBut the important concept is:\n\n```\nApp is already running\n```\n\nSo your JavaScript code can handle the event.\n\n---\n\n# State 2 — Background\n\n**Background** means the application isn't currently visible, but the operating system hasn't necessarily completely terminated it.\n\nFor example:\n\n```\nUser is using Instagram\n      ↓\nPresses Home\n      ↓\nYour app moves to background\n```\n\nNow a notification arrives.\n\nThe user taps it:\n\n```\nNotification\n    ↓\nUser taps\n    ↓\nApp comes to foreground\n    ↓\nApp handles notification\n```\n\nYour application needs to determine:\n\n> \"What notification did the user tap?\"\n\n---\n\n# State 3 — Killed / not running\n\nThis one is different.\n\nImagine:\n\n```\nApp\n↓\nCompletely closed\n```\n\nA push notification arrives.\n\nThe user taps:\n\n```\nNotification\n↓\nTap\n↓\nApp launches\n```\n\nNow the app has to determine:\n\n> \"Was I launched normally, or was I launched because the user tapped a notification?\"\n\nThis is an important distinction.\n\n---\n\n# Why does this matter?\n\nSuppose your notification says:\n\n```\nYou received a new message from Sarah.\n```\n\nThe user taps it.\n\nYou probably don't want to open:\n\n```\nHome screen\n```\n\nYou want:\n\n```\nChat screen\n  ↓\nSarah's conversation\n```\n\nSo the notification needs enough information to tell the application what destination to open.\n\n---\n\n# Notification data\n\nA push notification can carry additional data.\n\nConceptually:\n\n```\n{\n \"type\": \"message\",\n \"conversationId\": \"123\"\n}\n```\n\nNow your application can interpret it:\n\n```\ntype = message\nconversationId = 123\n```\n\nand navigate to:\n\n```\n/messages/123\n```\n\n---\n\n# Notification → Navigation\n\nThis is where notifications and navigation meet.\n\nThe flow becomes:\n\n```\nPush notification\n      ↓\nUser taps\n      ↓\nRead notification data\n      ↓\nDetermine destination\n      ↓\nNavigate\n      ↓\nCorrect screen\n```\n\n---\n\n# Example\n\nImagine the notification contains:\n\n```\n{\n \"type\": \"order\",\n \"orderId\": \"456\"\n}\n```\n\nYour application can interpret that as:\n\n```\nNotification\n     ↓\ntype = order\n     ↓\norderId = 456\n     ↓\nOpen order screen\n     ↓\n/orders/456\n```\n\n---\n\n# Foreground vs background vs killed\n\nThink about the three cases this way:\n\n```\n                    Notification tap\n                           │\n             ┌─────────────┼─────────────┐\n             │             │             │\n             ▼             ▼             ▼\n         Foreground     Background     Killed\n             │             │             │\n             ▼             ▼             ▼\n       Already running   Resume app    Launch app\n             │             │             │\n             └─────────────┼─────────────┘\n                           ▼\n                  Read notification\n                        data\n                           │\n                           ▼\n                     Navigate\n```\n\n---\n\n## Important beginner concept: notification receipt vs notification tap\n\nThese are not necessarily the same event.\n\n### Notification arrives\n\n```\nServer\n↓\nDevice\n↓\nNotification appears\n```\n\n### User taps notification\n\n```\nUser\n↓\nTap\n↓\nApp receives interaction\n```\n\nYou need to think about both.\n\n---",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Notifications can interact with foreground, background, and killed-app states.\n- A notification tap may need to open a specific screen.\n- Notification data can contain identifiers such as `orderId` or `conversationId`.\n- Your application needs a reliable way to interpret the notification and navigate.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Only testing while the app is open\n\nThe killed-app case can behave differently.\n\n### ❌ Assuming every notification opens the same screen\n\nDifferent notifications can represent different destinations.\n\n### ❌ Navigating before navigation is ready\n\nWhen the app is cold-started, your navigation system may need time to initialize.\n\n---"
      ],
      "quiz": [
        {
          "question": "Why might a notification contain an `orderId`?",
          "options": [
            "A. So the app knows which order screen to open",
            "B. To change the device volume",
            "C. To enable the camera",
            "D. To change the app icon"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn12-4",
      "title": "Deep Linking From Notifications",
      "durationMinutes": 8,
      "explanation": "You learned about deep linking on **Day 5**.\n\nNow we're going to connect that concept to notifications.\n\nA **deep link** is a link that points directly to a specific place inside your application.\n\nInstead of:\n\n```\nOpen app\n↓\nHome\n↓\nOrders\n↓\nOrder history\n↓\nOrder #456\n```\n\na deep link can take you directly to:\n\n```\nOrder #456\n```\n\n---\n\n# Notifications can act like deep links\n\nImagine this notification:\n\n```\nYour order has shipped!\n\n[ View order ]\n```\n\nThe notification data could point toward:\n\n```\nmyapp://orders/456\n```\n\nThe exact implementation depends on your routing architecture, but conceptually:\n\n```\nNotification\n     ↓\nDeep-link destination\n     ↓\nRouter\n     ↓\nOrder screen\n```\n\n---\n\n# Why this is powerful\n\nA notification isn't just a message.\n\nIt can be an **entry point into your application**.\n\nFor example:\n\n```\nNotification\n├── New message\n│      ↓\n│   Chat screen\n│\n├── Order shipped\n│      ↓\n│   Order screen\n│\n└── New comment\n       ↓\n    Post screen\n```\n\n---\n\n# Example routing data\n\nImagine:\n\n```\n{\n \"type\": \"chat\",\n \"conversationId\": \"abc123\"\n}\n```\n\nYour app might translate that into:\n\n```\n/chat/abc123\n```\n\nThen your router handles it.\n\n---\n\n# Cold-start complication\n\nThere's one subtle problem.\n\nSuppose the app isn't running:\n\n```\nApp = killed\n```\n\nThen:\n\n```\nNotification tap\n     ↓\nApplication launches\n     ↓\nJavaScript starts\n     ↓\nNavigation initializes\n     ↓\nNotification data becomes available\n     ↓\nNavigate\n```\n\nYou can't always assume the router is ready the instant the application starts.\n\nThat's why notification-to-navigation code should be designed carefully.\n\n---\n\n# Don't navigate blindly\n\nSuppose your app receives:\n\n```\n/order/123\n```\n\nbut the user isn't authenticated.\n\nShould you immediately open:\n\n```\nOrder #123\n```\n\nMaybe not.\n\nYou might need:\n\n```\nNotification\n↓\nCheck authentication\n↓\nUser logged in?\n├── Yes → Open order\n└── No  → Login\n            ↓\n        Open order\n```\n\nThis is an important real-world consideration.\n\n---\n\n# Visual Diagram\n\n```\nNotification\n    │\n    ▼\nNotification data\n    │\n    ▼\nDetermine destination\n    │\n    ▼\nAuthentication check\n    │\n    ▼\nRouter\n    │\n    ▼\nSpecific screen\n```\n\n---",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Notifications can be entry points into your app.\n- Deep links let you navigate directly to a specific destination.\n- Notification data can identify the destination.\n- Cold starts require careful navigation initialization.\n- Authentication and other application state may need to be checked before navigation.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Hard-coding one destination\n\nDifferent notification types may need different destinations.\n\n### ❌ Navigating before the router is ready\n\nEspecially important during cold starts.\n\n### ❌ Ignoring authentication\n\nThe target screen may require a logged-in user.\n\n---"
      ],
      "quiz": [
        {
          "question": "What is the relationship between a notification and a deep link?",
          "options": [
            "A. A notification can contain information that tells the app which deep-linked destination to open.",
            "B. They are completely unrelated.",
            "C. Deep links only work on websites.",
            "D. Notifications replace navigation."
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn12-5",
      "title": "Background Work with expo-background-task and expo-task-manager",
      "durationMinutes": 8,
      "explanation": "Now let's talk about another important mobile concept:\n\n> **What if your application needs to do something while the user isn't actively using it?**\n\nFor example:\n\n```\nSync data\nRefresh cached information\nProcess background work\nUpdate local information\n```\n\nThis is called **background work**.\n\n---\n\n# What is a background task?\n\nA background task is work that can be performed while your application isn't actively visible.\n\nFor example:\n\n```\nUser\n↓\nCloses application\n↓\nLater, OS allows background execution\n↓\nTask runs\n↓\nData is refreshed\n```\n\nThe important phrase here is:\n\n> **OS allows**\n\nYour app doesn't have unlimited control over when this happens.\n\n---\n\n# `expo-task-manager`\n\n`expo-task-manager` provides infrastructure for defining tasks that can be executed by the system.\n\nConceptually:\n\n```\nDefine task\n   ↓\nRegister task\n   ↓\nOperating system\n   ↓\nDecides when execution is allowed\n   ↓\nTask runs\n```\n\n---\n\n# `expo-background-task`\n\nExpo's background-task functionality provides a way to schedule work that the operating system may run when appropriate.\n\nThis is very different from:\n\n```\nsetInterval(() => {\n doSomething();\n}, 1000);\n```\n\nYou should **not** think of mobile background work as a permanent JavaScript loop.\n\n---\n\n# Why not just keep JavaScript running?\n\nBecause mobile operating systems care about:\n\n```\nBattery\nMemory\nCPU\nThermal usage\nUser experience\n```\n\nIf every application could run forever in the background, phones would quickly become unusable.\n\nSo the operating system controls background execution.\n\n---",
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
      "id": "rn12-6",
      "title": "iOS and Android Background Execution Limits",
      "durationMinutes": 5,
      "explanation": "This is where mobile development becomes different from traditional web development.\n\nOn a web page, you might imagine:\n\n```\nJavaScript\n  ↓\nKeep running\n  ↓\nKeep running\n  ↓\nKeep running\n```\n\nMobile operating systems don't work that way.\n\nBoth iOS and Android place restrictions on background activity.\n\n---\n\n# Why do operating systems restrict background work?\n\nBecause background work consumes resources.\n\nThe biggest concerns include:\n\n```\nBattery\nCPU\nMemory\nNetwork usage\nHeat\n```\n\nImagine 30 applications all running background loops constantly.\n\nYour battery would disappear quickly.\n\nSo the operating system decides:\n\n> \"I'll give applications opportunities to run, but I won't let them consume unlimited resources.\"\n\n---\n\n# App lifecycle matters\n\nYou learned about this on **Day 9**.\n\nThink about:\n\n```\nActive\n ↓\nBackground\n ↓\nSuspended / restricted\n ↓\nPossibly terminated\n```\n\nThe exact behavior varies by platform and situation.\n\n---\n\n# iOS\n\niOS is particularly strict about general background execution.\n\nYou shouldn't design your application around:\n\n```\n\"My JavaScript will continue running forever.\"\n```\n\nIt won't.\n\nCertain platform-approved background modes exist for specific use cases, but they come with rules.\n\n---\n\n# Android\n\nAndroid also restricts background work.\n\nModern Android versions include multiple mechanisms and restrictions around background execution, battery optimization, and scheduled work.\n\nAgain, the important beginner lesson is:\n\n```\nBackground ≠ unlimited execution\n```\n\n---\n\n# What happens if the OS kills your app?\n\nImagine:\n\n```\nApp running\n  ↓\nUser presses Home\n  ↓\nApp goes background\n  ↓\nOS needs memory\n  ↓\nOS removes your app process\n```\n\nLater:\n\n```\nUser opens app\n  ↓\nApp starts again\n```\n\nYour JavaScript process may be completely new.\n\nYou should not assume in-memory state survived.\n\n---\n\n# Persist important information\n\nIf information needs to survive a process death, don't rely only on:\n\n```\nconst [data, setData] = useState(...)\n```\n\nInstead, important data may need to be persisted using appropriate storage.\n\nYou learned about storage on **Day 10**.\n\nFor example:\n\n```\nImportant data\n     ↓\nPersistent storage\n     ↓\nApp starts again\n     ↓\nRestore data\n```\n\n---\n\n# The core rule\n\nRemember this:\n\n> **The operating system owns the lifecycle of your application.**\n\nYour application can request work.\n\nThe OS decides what is allowed.\n\n---",
      "diagram": "```\n            Your Application\n                   │\n                   │\n            \"Can I run?\"\n                   │\n                   ▼\n           Operating System\n                   │\n         ┌─────────┴─────────┐\n         │                   │\n       Allow                Delay/\n         │                 terminate\n         ▼                   │\n   Background task           ▼\n                         App resumes\n                         or restarts\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- iOS and Android limit background execution.\n- Background execution is controlled partly by the operating system.\n- You cannot safely assume JavaScript runs forever in the background.\n- Your app can be terminated while backgrounded.\n- Important state should be persisted if it needs to survive termination.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Treating background execution like a desktop application\n\nMobile operating systems are much more restrictive.\n\n### ❌ Relying on in-memory state\n\nThe app process can be terminated.\n\n### ❌ Assuming scheduled work happens exactly on time\n\nThe operating system can control execution timing.\n\n---"
      ],
      "quiz": [
        {
          "question": "Why do mobile operating systems limit background execution?",
          "options": [
            "A. To protect battery and system resources",
            "B. Because React Native cannot use JavaScript",
            "C. Because notifications don't exist",
            "D. To prevent navigation"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    }
  ],
  "finalQuiz": [
    {
      "question": "What's the difference between a local and remote notification?",
      "options": [
        "A. A local notification is scheduled on the device, while a remote push is delivered through push infrastructure.",
        "B. Local notifications only work on Android.",
        "C. Remote notifications only work when the app is open.",
        "D. They are exactly the same."
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is a push token used for?",
      "options": [
        "A. Identifying a target app installation for push delivery",
        "B. Storing a user's password",
        "C. Styling a notification",
        "D. Opening a database"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why does notification handling need to consider foreground, background, and killed states?",
      "options": [
        "A. Because the app's execution and startup behavior differs across those states.",
        "B. Because notifications have different colors.",
        "C. Because navigation doesn't work in the foreground.",
        "D. Because push notifications only work when an app is killed."
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "How can a notification open a specific screen?",
      "options": [
        "A. Notification data can identify a destination that the app turns into a navigation/deep-link action.",
        "B. Notifications automatically know every screen in the app.",
        "C. By changing the device wallpaper.",
        "D. By restarting the phone."
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Who controls background execution?",
      "options": [
        "A. The operating system, within the platform's background-execution rules",
        "B. A React component",
        "C. `setInterval()`",
        "D. The navigation router"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Which is an example of a local notification?",
      "options": [
        "A. A reminder scheduled on the device",
        "B. A server telling you your order shipped",
        "C. A message received from a chat server",
        "D. A backend sending breaking news"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why does your backend need a push token?",
      "options": [
        "A. To know where to send a push notification",
        "B. To change the app's font",
        "C. To store the user's password",
        "D. To navigate between tabs"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why might a notification contain an `orderId`?",
      "options": [
        "A. So the app knows which order screen to open",
        "B. To change the device volume",
        "C. To enable the camera",
        "D. To change the app icon"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is the relationship between a notification and a deep link?",
      "options": [
        "A. A notification can contain information that tells the app which deep-linked destination to open.",
        "B. They are completely unrelated.",
        "C. Deep links only work on websites.",
        "D. Notifications replace navigation."
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why do mobile operating systems limit background execution?",
      "options": [
        "A. To protect battery and system resources",
        "B. Because React Native cannot use JavaScript",
        "C. Because notifications don't exist",
        "D. To prevent navigation"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "🛠️ Self-Check — Notification → Correct Screen",
    "goal": "Complete the Day 12 self-check project.",
    "brief": "Now it's time to combine everything.\n\nYour task:\n\n> **Send yourself a push notification and route the tap to the correct in-app screen from all three app states.**\n\nYou need to test:\n\n```\n1. Foreground\n2. Background\n3. Killed\n```\n\n---\n\n# Step 1 — Choose a destination\n\nLet's say your application has:\n\n```\nHome\nOrders\nOrder Details\n```\n\nYou want your notification to open:\n\n```\nOrder #123\n```\n\nYour conceptual destination might be:\n\n```\n/orders/123\n```\n\n---\n\n# Step 2 — Put destination information in the notification\n\nYour notification data could conceptually contain:\n\n```\n{\n \"type\": \"order\",\n \"orderId\": \"123\"\n}\n```\n\nNow the app has enough information to determine:\n\n```\ntype = order\norderId = 123\n```\n\n---\n\n# Step 3 — Receive the notification\n\nThe notification arrives:\n\n```\n┌──────────────────────────────┐\n│ Your order has shipped!      │\n│ Order #123                   │\n└──────────────────────────────┘\n```\n\nThe user taps it.\n\nYour app needs to interpret the data.\n\n---\n\n# Step 4 — Convert notification data into navigation\n\nYour application can conceptually perform:\n\n```\nNotification data\n      ↓\ntype = order\n      ↓\norderId = 123\n      ↓\nDestination = /orders/123\n      ↓\nRouter\n      ↓\nOrder Details\n```\n\n---\n\n# Step 5 — Test foreground\n\nStart with the easiest case:\n\n```\nApp is open\n    ↓\nSend notification\n    ↓\nNotification arrives\n    ↓\nTap / handle notification\n    ↓\nCorrect order screen\n```\n\nVerify:\n\n```\nOrder #123\n```\n\nis opened.\n\n---\n\n# Step 6 — Test background\n\nNow:\n\n```\nOpen app\n  ↓\nPress Home\n  ↓\nApp is backgrounded\n  ↓\nSend notification\n  ↓\nTap notification\n  ↓\nApp returns\n  ↓\nCorrect screen opens\n```\n\nMake sure you're not always going to:\n\n```\nHome\n```\n\nThe destination should be determined from the notification.\n\n---\n\n# Step 7 — Test killed-app state\n\nThis is the most important test.\n\nCompletely terminate the app.\n\nThen:\n\n```\nApp = not running\n      ↓\nSend notification\n      ↓\nNotification appears\n      ↓\nTap notification\n      ↓\nApp launches\n      ↓\nNavigation initializes\n      ↓\nNotification data is processed\n      ↓\nCorrect screen opens\n```\n\nThis is called a **cold launch** (starting the application from a state where its process isn't already running).\n\n---\n\n# Step 8 — Test the wrong/missing data case\n\nDon't only test perfect data.\n\nTry:\n\n```\n{\n \"type\": \"order\"\n}\n```\n\nWhat happens if `orderId` is missing?\n\nYour application shouldn't crash.\n\nInstead, you could safely navigate to:\n\n```\nOrders\n```\n\nor show an appropriate fallback.\n\n---\n\n# Step 9 — Test authentication\n\nImagine the notification points to:\n\n```\n/orders/123\n```\n\nbut the user is logged out.\n\nYour flow might become:\n\n```\nNotification\n     ↓\nOrder #123\n     ↓\nUser authenticated?\n   /\n Yes        No\n  ↓          ↓\nOpen order   Login\n             ↓\n         Open order\n```\n\nThis is a real-world case worth testing.\n\n---\n\n# Final Architecture\n\nBy the end of today's lesson, you should understand this complete flow:\n\n```\n                     NOTIFICATION SYSTEM\n                             │\n             ┌───────────────┴───────────────┐\n             │                               │\n            Local                          Remote\n             │                               │\n             ▼                               ▼\n      Device schedules                  Your backend\n             │                               │\n             │                               ▼\n             │                        Push service\n             │                               │\n             └───────────────┬───────────────┘\n                             ▼\n                          Device\n                             │\n                             ▼\n                       Notification\n                             │\n                             ▼\n                        User taps\n                             │\n                             ▼\n                   Notification data\n                             │\n                             ▼\n                    Determine route\n                             │\n                             ▼\n                    Navigation system\n                             │\n                             ▼\n                     Correct screen\n```\n\nAnd background work sits alongside this:\n\n```\n                        Mobile OS\n                           │\n               ┌───────────┴───────────┐\n               │                       │\n         Notifications            Background\n               │                    execution\n               │                       │\n               ▼                       ▼\n            Device              Scheduled task\n               │                       │\n               ▼                       ▼\n             User                 Local update\n```\n\n---\n\n# 🎯 Day 12 Mental Model\n\nIf you remember only a few things today, remember these:\n\n### 1. Notifications have two major sources\n\n```\nLocal\n ↓\nScheduled by the device/app\n\nRemote\n ↓\nSent through push infrastructure\n```\n\n### 2. Push tokens connect your backend to an app installation\n\n```\nApp\n↓\nPush token\n↓\nBackend\n↓\nPush notification\n```\n\n### 3. A notification is also an entry point\n\n```\nNotification\n↓\nTap\n↓\nRead data\n↓\nDeep link\n↓\nSpecific screen\n```\n\n### 4. You must think about three app states\n\n```\nForeground\nBackground\nKilled\n```\n\n### 5. Background work isn't unlimited\n\n```\nYour app\n  ↓\nRequests background work\n  ↓\nOperating System\n  ↓\nDecides when/how it can run\n```\n\n---",
    "steps": [],
    "acceptance": [],
    "footer": "# The important mental model\n\nDon't think:\n\n```\nMy app says:\n\"Run this at 3:00 PM.\"\n\nOS:\n\"Okay, absolutely.\"\n```\n\nThink:\n\n```\nMy app:\n\"Here's background work I'd like to perform.\"\n\nOS:\n\"I'll run it when my background-execution rules\nallow me to.\"\n```\n\nThe exact timing isn't always under your control.\n\n---\n\n# Background tasks are not guaranteed timers\n\nThis is a very important beginner lesson.\n\nIf you need:\n\n```\nExactly 10:00:00 AM\n```\n\nyou should not automatically assume a generic background task can guarantee that exact execution time.\n\nThe operating system may delay execution.\n\n---\n\n# Example mental model\n\nImagine a news application.\n\nYou want to refresh news occasionally:\n\n```\nBackground task\n     ↓\nCheck for new data\n     ↓\nSave useful information locally\n     ↓\nNext time user opens app\n     ↓\nFresh/cached content available\n```\n\nThat's a reasonable background-work pattern.\n\n---\n\n## Visual Diagram\n\n```\n               Your App\n                  │\n                  ▼\n             Register task\n                  │\n                  ▼\n            Operating System\n                  │\n          Decides when allowed\n                  │\n                  ▼\n            Background task\n                  │\n                  ▼\n           Update local data\n```\n\n---\n\n## Key Takeaways\n\n- Background work allows some tasks to happen when the app isn't visible.\n- `expo-task-manager` helps define/manage background tasks.\n- `expo-background-task` provides Expo background-task functionality.\n- The operating system controls when background work can execute.\n- Background tasks are not unlimited JavaScript timers.\n\n---\n\n## Common Mistakes\n\n### ❌ Expecting background work to run continuously\n\nMobile operating systems don't allow unlimited background execution.\n\n### ❌ Assuming exact execution time\n\nBackground scheduling can be controlled by the operating system.\n\n### ❌ Using background tasks for everything\n\nUse them for work that genuinely benefits from background execution.\n\n---\n\n## Mini Quiz\n\nWho ultimately controls when background work can execute?\n\nA. The operating system\nB. Your React component\nC. Your `setInterval()`\nD. The user's button\n\n**Answer:** A\n\n---\n\n# 6. iOS and Android Background Execution Limits\n\n⏱️ **5 min**\n\n## Explanation\n\nThis is where mobile development becomes different from traditional web development.\n\nOn a web page, you might imagine:\n\n```\nJavaScript\n  ↓\nKeep running\n  ↓\nKeep running\n  ↓\nKeep running\n```\n\nMobile operating systems don't work that way.\n\nBoth iOS and Android place restrictions on background activity.\n\n---\n\n# Why do operating systems restrict background work?\n\nBecause background work consumes resources.\n\nThe biggest concerns include:\n\n```\nBattery\nCPU\nMemory\nNetwork usage\nHeat\n```\n\nImagine 30 applications all running background loops constantly.\n\nYour battery would disappear quickly.\n\nSo the operating system decides:\n\n> \"I'll give applications opportunities to run, but I won't let them consume unlimited resources.\"\n\n---\n\n# App lifecycle matters\n\nYou learned about this on **Day 9**.\n\nThink about:\n\n```\nActive\n ↓\nBackground\n ↓\nSuspended / restricted\n ↓\nPossibly terminated\n```\n\nThe exact behavior varies by platform and situation.\n\n---\n\n# iOS\n\niOS is particularly strict about general background execution.\n\nYou shouldn't design your application around:\n\n```\n\"My JavaScript will continue running forever.\"\n```\n\nIt won't.\n\nCertain platform-approved background modes exist for specific use cases, but they come with rules.\n\n---\n\n# Android\n\nAndroid also restricts background work.\n\nModern Android versions include multiple mechanisms and restrictions around background execution, battery optimization, and scheduled work.\n\nAgain, the important beginner lesson is:\n\n```\nBackground ≠ unlimited execution\n```\n\n---\n\n# What happens if the OS kills your app?\n\nImagine:\n\n```\nApp running\n  ↓\nUser presses Home\n  ↓\nApp goes background\n  ↓\nOS needs memory\n  ↓\nOS removes your app process\n```\n\nLater:\n\n```\nUser opens app\n  ↓\nApp starts again\n```\n\nYour JavaScript process may be completely new.\n\nYou should not assume in-memory state survived.\n\n---\n\n# Persist important information\n\nIf information needs to survive a process death, don't rely only on:\n\n```\nconst [data, setData] = useState(...)\n```\n\nInstead, important data may need to be persisted using appropriate storage.\n\nYou learned about storage on **Day 10**.\n\nFor example:\n\n```\nImportant data\n     ↓\nPersistent storage\n     ↓\nApp starts again\n     ↓\nRestore data\n```\n\n---\n\n# The core rule\n\nRemember this:\n\n> **The operating system owns the lifecycle of your application.**\n\nYour application can request work.\n\nThe OS decides what is allowed.\n\n---\n\n## Visual Diagram\n\n```\n            Your Application\n                   │\n                   │\n            \"Can I run?\"\n                   │\n                   ▼\n           Operating System\n                   │\n         ┌─────────┴─────────┐\n         │                   │\n       Allow                Delay/\n         │                 terminate\n         ▼                   │\n   Background task           ▼\n                         App resumes\n                         or restarts\n```\n\n---\n\n## Key Takeaways\n\n- iOS and Android limit background execution.\n- Background execution is controlled partly by the operating system.\n- You cannot safely assume JavaScript runs forever in the background.\n- Your app can be terminated while backgrounded.\n- Important state should be persisted if it needs to survive termination.\n\n---\n\n## Common Mistakes\n\n### ❌ Treating background execution like a desktop application\n\nMobile operating systems are much more restrictive.\n\n### ❌ Relying on in-memory state\n\nThe app process can be terminated.\n\n### ❌ Assuming scheduled work happens exactly on time\n\nThe operating system can control execution timing.\n\n---\n\n## Mini Quiz\n\nWhy do mobile operating systems limit background execution?\n\nA. To protect battery and system resources\nB. Because React Native cannot use JavaScript\nC. Because notifications don't exist\nD. To prevent navigation\n\n**Answer:** A\n\n---\n\n# 🛠️ Self-Check — Notification → Correct Screen\n\nNow it's time to combine everything.\n\nYour task:\n\n> **Send yourself a push notification and route the tap to the correct in-app screen from all three app states.**\n\nYou need to test:\n\n```\n1. Foreground\n2. Background\n3. Killed\n```\n\n---\n\n# Step 1 — Choose a destination\n\nLet's say your application has:\n\n```\nHome\nOrders\nOrder Details\n```\n\nYou want your notification to open:\n\n```\nOrder #123\n```\n\nYour conceptual destination might be:\n\n```\n/orders/123\n```\n\n---\n\n# Step 2 — Put destination information in the notification\n\nYour notification data could conceptually contain:\n\n```\n{\n \"type\": \"order\",\n \"orderId\": \"123\"\n}\n```\n\nNow the app has enough information to determine:\n\n```\ntype = order\norderId = 123\n```\n\n---\n\n# Step 3 — Receive the notification\n\nThe notification arrives:\n\n```\n┌──────────────────────────────┐\n│ Your order has shipped!      │\n│ Order #123                   │\n└──────────────────────────────┘\n```\n\nThe user taps it.\n\nYour app needs to interpret the data.\n\n---\n\n# Step 4 — Convert notification data into navigation\n\nYour application can conceptually perform:\n\n```\nNotification data\n      ↓\ntype = order\n      ↓\norderId = 123\n      ↓\nDestination = /orders/123\n      ↓\nRouter\n      ↓\nOrder Details\n```\n\n---\n\n# Step 5 — Test foreground\n\nStart with the easiest case:\n\n```\nApp is open\n    ↓\nSend notification\n    ↓\nNotification arrives\n    ↓\nTap / handle notification\n    ↓\nCorrect order screen\n```\n\nVerify:\n\n```\nOrder #123\n```\n\nis opened.\n\n---\n\n# Step 6 — Test background\n\nNow:\n\n```\nOpen app\n  ↓\nPress Home\n  ↓\nApp is backgrounded\n  ↓\nSend notification\n  ↓\nTap notification\n  ↓\nApp returns\n  ↓\nCorrect screen opens\n```\n\nMake sure you're not always going to:\n\n```\nHome\n```\n\nThe destination should be determined from the notification.\n\n---\n\n# Step 7 — Test killed-app state\n\nThis is the most important test.\n\nCompletely terminate the app.\n\nThen:\n\n```\nApp = not running\n      ↓\nSend notification\n      ↓\nNotification appears\n      ↓\nTap notification\n      ↓\nApp launches\n      ↓\nNavigation initializes\n      ↓\nNotification data is processed\n      ↓\nCorrect screen opens\n```\n\nThis is called a **cold launch** (starting the application from a state where its process isn't already running).\n\n---\n\n# Step 8 — Test the wrong/missing data case\n\nDon't only test perfect data.\n\nTry:\n\n```\n{\n \"type\": \"order\"\n}\n```\n\nWhat happens if `orderId` is missing?\n\nYour application shouldn't crash.\n\nInstead, you could safely navigate to:\n\n```\nOrders\n```\n\nor show an appropriate fallback.\n\n---\n\n# Step 9 — Test authentication\n\nImagine the notification points to:\n\n```\n/orders/123\n```\n\nbut the user is logged out.\n\nYour flow might become:\n\n```\nNotification\n     ↓\nOrder #123\n     ↓\nUser authenticated?\n   /\n Yes        No\n  ↓          ↓\nOpen order   Login\n             ↓\n         Open order\n```\n\nThis is a real-world case worth testing.\n\n---\n\n# Final Architecture\n\nBy the end of today's lesson, you should understand this complete flow:\n\n```\n                     NOTIFICATION SYSTEM\n                             │\n             ┌───────────────┴───────────────┐\n             │                               │\n            Local                          Remote\n             │                               │\n             ▼                               ▼\n      Device schedules                  Your backend\n             │                               │\n             │                               ▼\n             │                        Push service\n             │                               │\n             └───────────────┬───────────────┘\n                             ▼\n                          Device\n                             │\n                             ▼\n                       Notification\n                             │\n                             ▼\n                        User taps\n                             │\n                             ▼\n                   Notification data\n                             │\n                             ▼\n                    Determine route\n                             │\n                             ▼\n                    Navigation system\n                             │\n                             ▼\n                     Correct screen\n```\n\nAnd background work sits alongside this:\n\n```\n                        Mobile OS\n                           │\n               ┌───────────┴───────────┐\n               │                       │\n         Notifications            Background\n               │                    execution\n               │                       │\n               ▼                       ▼\n            Device              Scheduled task\n               │                       │\n               ▼                       ▼\n             User                 Local update\n```\n\n---\n\n# 🎯 Day 12 Mental Model\n\nIf you remember only a few things today, remember these:\n\n### 1. Notifications have two major sources\n\n```\nLocal\n ↓\nScheduled by the device/app\n\nRemote\n ↓\nSent through push infrastructure\n```\n\n### 2. Push tokens connect your backend to an app installation\n\n```\nApp\n↓\nPush token\n↓\nBackend\n↓\nPush notification\n```\n\n### 3. A notification is also an entry point\n\n```\nNotification\n↓\nTap\n↓\nRead data\n↓\nDeep link\n↓\nSpecific screen\n```\n\n### 4. You must think about three app states\n\n```\nForeground\nBackground\nKilled\n```\n\n### 5. Background work isn't unlimited\n\n```\nYour app\n  ↓\nRequests background work\n  ↓\nOperating System\n  ↓\nDecides when/how it can run\n```\n\n---\n\n# 🎯 What You Should Know After Day 12\n\nAt this point, you should be able to explain this architecture to another beginner:\n\n```\n                 MOBILE APP\n                     │\n       ┌─────────────┴──────────────┐\n       │                            │\n  Notifications                Background work\n       │                            │\n       ▼                            ▼\nexpo-notifications       expo-background-task\n       │                    / expo-task-manager\n       │                            │\n       ▼                            ▼\nPush token                    Operating System\n       │                            │\n       ▼                            ▼\n    Backend                    Runs when\n       │                       permitted\n       ▼\nPush service\n       │\n       ▼\nUser's device\n       │\n       ▼\nNotification tap\n       │\n       ▼\nNotification data\n       │\n       ▼\nDeep link / navigation\n       │\n       ▼\nCorrect screen\n```\n\nThe biggest lesson isn't actually about a specific Expo API.\n\nIt's this:\n\n> **Mobile applications don't control the entire lifecycle.**\n\nThe operating system decides when your app can run, when background work can happen, and how resources are managed."
  }
});

