import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_10_LESSONS = normalizePastedLessonDay({
  "day": 10,
  "title": "Storage",
  "overview": "Today we're going to talk about **storage**.\n\nSo far, you've learned that React state is useful for keeping data while your app is running. But there's a problem:\n\n> What happens when the app is closed or the operating system kills it?\n\nYour React state doesn't automatically survive that.\n\nThat's where **local storage** comes in.\n\nBy the end of today, you should understand which storage tool to use for:\n\n- Small settings\n- Fast local data\n- Authentication tokens\n- Secrets\n- Structured databases\n- Large local datasets\n- Offline applications\n\nWe'll also build toward an important mobile concept:\n\n> **Offline-first** applications.\n\n**Offline-first** means the application is designed to keep working with local data even when the network isn't available.\n\n---",
  "totalMinutes": 50,
  "difficulty": "Beginner → Intermediate",
  "lessons": [
    {
      "id": "rn10-1",
      "title": "AsyncStorage — Small Key-Value Data",
      "durationMinutes": 6,
      "explanation": "Let's start with one of the simplest storage solutions:\n\n**AsyncStorage**\n\nThe easiest way to understand AsyncStorage is:\n\n> It's like a small persistent dictionary for your application.\n\nA **key-value store** is a storage system where you save information using a unique key.\n\nFor example:\n\n```\ntheme → dark\nlanguage → english\nonboardingComplete → true\n```\n\nYou give the storage a key:\n\n```\n\"theme\"\n```\n\nand store a value:\n\n```\n\"dark\"\n```\n\nLater, you can ask:\n\n```\n\"What value belongs to theme?\"\n```\n\nand get:\n\n```\n\"dark\"\n```\n\n---\n\n## Why do we need it?\n\nImagine your application has a theme selector:\n\n```\nTheme\n\n○ Light\n● Dark\n```\n\nThe user chooses:\n\n```\nDark\n```\n\nIf you only use:\n\n```\nconst [theme, setTheme] = useState(\"light\");\n```\n\nthe value exists only while the application is running.\n\nIf the app is completely restarted:\n\n```\nuseState\n  ↓\ninitial value\n  ↓\n\"light\"\n```\n\nThe user's choice disappears.\n\nWith persistent storage:\n\n```\nUser selects dark\n      ↓\nSave \"dark\"\n      ↓\nApp closes\n      ↓\nApp opens\n      ↓\nRead \"dark\"\n      ↓\nUse dark theme\n```\n\n---\n\n# Installing AsyncStorage\n\nWith an Expo application, you can install it with:\n\n```\nnpx expo install @react-native-async-storage/async-storage\n```\n\nThen:\n\n```\nimport AsyncStorage from \"@react-native-async-storage/async-storage\";\n```\n\n---\n\n# Saving data\n\nFor example:\n\n```\nawait AsyncStorage.setItem(\n \"theme\",\n \"dark\"\n);\n```\n\nThis means:\n\n```\nkey   = theme\nvalue = dark\n```\n\n---\n\n# Reading data\n\n```\nconst theme =\n await AsyncStorage.getItem(\"theme\");\n```\n\nIf the value exists:\n\n```\n\"dark\"\n```\n\nIf it doesn't exist, you may get:\n\n```\nnull\n```\n\n---\n\n# Removing data\n\n```\nawait AsyncStorage.removeItem(\"theme\");\n```\n\nNow:\n\n```\ntheme\n ↓\ndoesn't exist\n```\n\n---\n\n# Storing objects\n\nHere's an important detail.\n\nAsyncStorage works with strings.\n\nSo this won't work the way you might expect:\n\n```\nawait AsyncStorage.setItem(\n \"user\",\n {\n   name: \"Alex\"\n }\n);\n```\n\nInstead, convert the object into JSON.\n\n**JSON (JavaScript Object Notation)** is a common text format for representing structured data.\n\n```\nconst user = {\n name: \"Alex\",\n age: 25,\n};\n\nawait AsyncStorage.setItem(\n \"user\",\n JSON.stringify(user)\n);\n```\n\nThen read it:\n\n```\nconst value =\n await AsyncStorage.getItem(\"user\");\n\nconst user = value\n ? JSON.parse(value)\n : null;\n```\n\n---\n\n# What is AsyncStorage good for?\n\nGood examples include:\n\n```\nTheme preference\nLanguage preference\nOnboarding completed\nSmall app settings\nSimple flags\nSmall cached values\n```\n\n---\n\n# What is AsyncStorage bad at?\n\nThis is very important.\n\nAsyncStorage isn't designed to be your application's giant database.\n\nIt can become a poor choice when you have:\n\n```\nLarge datasets\nThousands of records\nComplex queries\nVery frequent reads/writes\nPerformance-sensitive local data\n```\n\nA **query** is a request asking a database to find or manipulate specific data.\n\nFor example:\n\n```\nSELECT * FROM users\nWHERE age > 18;\n```\n\nThat's the kind of work a real database is designed to handle.\n\n---\n\n# Why not store everything in AsyncStorage?\n\nImagine:\n\n```\n10,000 users\n50,000 messages\n100,000 products\n```\n\nTrying to treat all of that as simple key-value data becomes difficult.\n\nYou may end up doing something like:\n\n```\n\"allUsers\" → huge JSON string\n```\n\nThen every time you need one user, you may have to:\n\n```\nRead huge string\n     ↓\nParse huge JSON\n     ↓\nFind user\n```\n\nThat's not what you want for large datasets.\n\n---",
      "diagram": "```\n             AsyncStorage\n\n      ┌───────────────────────┐\n      │ theme → \"dark\"        │\n      │ language → \"en\"       │\n      │ loggedIn → \"true\"     │\n      │ onboarding → \"done\"   │\n      └───────────────────────┘\n\n       Small simple values\n                │\n                ▼\n             Good fit\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- AsyncStorage is a persistent key-value store.\n- It's useful for small pieces of application data.\n- Values are stored as strings.\n- Objects can be converted using `JSON.stringify()` and `JSON.parse()`.\n- It isn't the ideal choice for large or highly performance-sensitive datasets.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Storing passwords in AsyncStorage\n\nSensitive information needs stronger protection.\n\n### ❌ Using it as a full database\n\nLarge structured datasets deserve database technology.\n\n### ❌ Forgetting JSON conversion\n\nObjects need to be serialized (converted into a storable format).\n\n---"
      ],
      "quiz": [
        {
          "question": "Which is a good AsyncStorage use case?",
          "options": [
            "A. Saving a user's theme preference",
            "B. Storing a 500,000-row database",
            "C. Running complex relational queries",
            "D. Replacing a server database"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn10-2",
      "title": "MMKV — Fast Local Key-Value Storage",
      "durationMinutes": 7,
      "explanation": "Now let's look at:\n\n**react-native-mmkv**\n\nYou can think of MMKV as another key-value storage solution, but one designed for **very fast local storage**.\n\nThe basic idea remains:\n\n```\nkey → value\n```\n\nFor example:\n\n```\ntheme → dark\nuserId → 123\ndraft → \"Hello...\"\n```\n\nBut MMKV is designed around high-performance local storage.\n\n---\n\n# Why do we need something faster?\n\nImagine your application reads local data constantly.\n\nFor example:\n\n```\nApp starts\n↓\nRead settings\n↓\nRead preferences\n↓\nRead cached state\n↓\nRead draft\n↓\nRead user configuration\n```\n\nIf storage operations happen frequently, performance starts to matter.\n\n**Performance** means how efficiently something performs its work, such as how quickly it reads or writes data.\n\n---\n\n# MMKV's role in this learning track\n\nFor this track, we're treating:\n\n> **MMKV as the default choice for fast local key-value storage.**\n\nThat doesn't mean it should be used for every possible type of data.\n\nIt means:\n\n```\nSmall + frequent + fast local data\n            ↓\n          MMKV\n```\n\n---\n\n# Example use cases\n\nMMKV can be useful for:\n\n```\nDraft state\nFeature flags\nUser preferences\nSmall caches\nApp settings\nFast local state\n```\n\nA **feature flag** is a setting that turns a feature on or off.\n\nFor example:\n\n```\nnewProfileScreen → true\n```\n\n---\n\n# MMKV vs AsyncStorage\n\nA simple mental model:\n\n| Requirement | AsyncStorage | MMKV |\n| --- | --- | --- |\n| Simple key-value data | ✅ | ✅ |\n| Persistent data | ✅ | ✅ |\n| Small settings | ✅ | ✅ |\n| High-frequency access | Less ideal | Better suited |\n| Fast local storage | Not its main strength | Strong use case |\n| Large relational data | ❌ | ❌ |\n\nThe important point is not:\n\n> \"MMKV replaces every storage solution.\"\n\nInstead:\n\n> \"Choose storage based on the shape and requirements of your data.\"\n\n---\n\n# What does \"shape of data\" mean?\n\nIt means what your data looks like and how you need to use it.\n\nFor example:\n\n```\ntheme = \"dark\"\n```\n\nis simple key-value data.\n\nBut:\n\n```\nUsers\nOrders\nProducts\nOrderItems\n```\n\nwith relationships between them is structured relational data.\n\nThose are different problems.\n\n---",
      "diagram": "```\n              Local Data\n\n     ┌─────────────────────────┐\n     │ Small + simple          │\n     │ key → value             │\n     └────────────┬────────────┘\n                  │\n                  ▼\n                MMKV\n\n     ┌─────────────────────────┐\n     │ Large + structured      │\n     │ relationships + queries │\n     └────────────┬────────────┘\n                  │\n                  ▼\n             SQLite / DB\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- MMKV is designed for fast local key-value storage.\n- It's a strong choice for frequently accessed small local data.\n- It isn't a relational database.\n- The storage choice should match your data's needs.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Putting an entire database into one MMKV value\n\nThat's usually a sign that you need a database.\n\n### ❌ Assuming faster always means better\n\nA tool can be fast but still be the wrong fit for your data.\n\n---"
      ],
      "quiz": [
        {
          "question": "What is MMKV mainly useful for?",
          "options": [
            "A. Fast local key-value storage",
            "B. Building navigation stacks",
            "C. Rendering animations",
            "D. Sending push notifications"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn10-3",
      "title": "SecureStore — Tokens and Secrets",
      "durationMinutes": 7,
      "explanation": "Now we're getting into something more sensitive:\n\n> **Authentication tokens and secrets.**\n\nImagine your user logs into your application.\n\nThe server might give your application an authentication token.\n\nAn **authentication token** is a piece of data that helps the server recognize that the user has successfully authenticated.\n\nFor example:\n\n```\nLogin\n ↓\nServer verifies credentials\n ↓\nServer returns token\n ↓\nApp stores token\n```\n\nYour application may use that token for future API requests.\n\n---\n\n# Where should the token go?\n\nThis is where:\n\n**expo-secure-store**\n\nbecomes useful.\n\nSecureStore provides secure local storage for sensitive values.\n\nOn supported platforms, it uses platform-provided secure storage mechanisms such as:\n\n```\niOS\n ↓\nKeychain\n\nAndroid\n ↓\nKeystore-backed secure storage\n```\n\nA **Keychain** is Apple's secure system for storing sensitive credentials.\n\nA **Keystore** is Android's system for securely protecting cryptographic keys and related sensitive data.\n\n---\n\n# Why not AsyncStorage?\n\nThis is an important distinction.\n\nAsyncStorage is designed for general application data.\n\nA token is sensitive.\n\nSo we don't want to treat:\n\n```\ntheme = dark\n```\n\nthe same way as:\n\n```\nauthToken = SECRET_VALUE\n```\n\nThink:\n\n```\nNormal preference\n     ↓\nGeneral storage\n\nSensitive credential\n     ↓\nSecure storage\n```\n\n---\n\n# Installing SecureStore\n\nWith Expo:\n\n```\nnpx expo install expo-secure-store\n```\n\nThen:\n\n```\nimport * as SecureStore\n from \"expo-secure-store\";\n```\n\n---\n\n# Saving a token\n\nConceptually:\n\n```\nawait SecureStore.setItemAsync(\n \"authToken\",\n token\n);\n```\n\nReading:\n\n```\nconst token =\n await SecureStore.getItemAsync(\n   \"authToken\"\n );\n```\n\nRemoving:\n\n```\nawait SecureStore.deleteItemAsync(\n \"authToken\"\n);\n```\n\n---\n\n# Important security lesson\n\nSecureStore is not a magic security shield.\n\nYou still need to think about:\n\n```\nWhat am I storing?\nWho can access it?\nHow long should it live?\nWhen should it be deleted?\nWhat happens after logout?\n```\n\nFor example, after logout:\n\n```\nUser logs out\n    ↓\nDelete authentication token\n    ↓\nClear sensitive session data\n```\n\n---\n\n# What should go into SecureStore?\n\nGood examples:\n\n```\nAuthentication tokens\nRefresh tokens\nSmall secrets\nSensitive credentials\n```\n\nNot everything.\n\nFor example:\n\n```\ntheme = dark\n```\n\ndoesn't need secure storage.\n\n---",
      "diagram": "```\n               Application Data\n                      │\n         ┌────────────┴────────────┐\n         │                         │\n         ▼                         ▼\n    Normal data              Sensitive data\n         │                         │\n         ▼                         ▼\n    MMKV / SQLite             SecureStore\n                                   │\n                         ┌─────────┴─────────┐\n                         ▼                   ▼\n                      Keychain            Keystore\n                        iOS                Android\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- SecureStore is designed for sensitive local values.\n- Authentication tokens are a common example.\n- iOS uses Keychain-based secure storage.\n- Android uses Keystore-backed mechanisms.\n- Don't use secure storage for every piece of data.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Putting authentication tokens in ordinary storage\n\nUse a secure storage mechanism for sensitive credentials.\n\n### ❌ Keeping tokens forever\n\nTokens should have appropriate expiration and logout handling.\n\n### ❌ Assuming SecureStore can hold your entire database\n\nIt's intended for small sensitive values.\n\n---"
      ],
      "quiz": [
        {
          "question": "Where would an authentication token generally belong?",
          "options": [
            "A. SecureStore",
            "B. A UI component's temporary state",
            "C. A stylesheet",
            "D. A `FlatList`"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn10-4",
      "title": "SQLite — A Real Database on the Device",
      "durationMinutes": 7,
      "explanation": "Now let's move from:\n\n```\nkey → value\n```\n\nto:\n\n```\nstructured data\n```\n\nThis is where **SQLite** comes in.\n\nSQLite is a small relational database that can run directly on the device.\n\nA **relational database** stores data in tables and allows relationships between those tables.\n\n---\n\n# Think in tables\n\nImagine you're building a shopping app.\n\nYou could have:\n\n```\nUsers\n────────────────\nid\nname\nemail\n```\n\nThen:\n\n```\nProducts\n────────────────\nid\nname\nprice\n```\n\nAnd:\n\n```\nOrders\n────────────────\nid\nuser_id\ntotal\n```\n\nThe tables can be related.\n\nFor example:\n\n```\nUsers\n │\n │ user_id\n ▼\nOrders\n```\n\n---\n\n# Why is this useful?\n\nImagine you have:\n\n```\n20,000 products\n```\n\nYou don't want to store all of them as:\n\n```\nproducts → gigantic JSON string\n```\n\nInstead, a database lets you ask specific questions.\n\nFor example:\n\n```\nSELECT *\nFROM products\nWHERE price < 50;\n```\n\nNow the database can return only what you need.\n\n---\n\n# Expo SQLite\n\nExpo provides:\n\n```\nexpo-sqlite\n```\n\nwhich allows an Expo application to work with SQLite databases.\n\nYou can use it for things such as:\n\n```\nOffline data\nLocal records\nStructured application data\nCaches\nLarge datasets\n```\n\n---\n\n# Example database structure\n\nImagine a notes application.\n\n```\nnotes\n────────────────────\nid\ntitle\nbody\ncreated_at\nupdated_at\n```\n\nThen:\n\n```\nNote #1\nNote #2\nNote #3\n...\nNote #10,000\n```\n\nA database is much more appropriate for this kind of structured data.\n\n---\n\n# Database operations\n\nYou'll commonly hear:\n\n```\nCREATE\nREAD\nUPDATE\nDELETE\n```\n\nTogether these are often called **CRUD**.\n\nCRUD means:\n\n```\nCreate\nRead\nUpdate\nDelete\n```\n\nFor example:\n\n```\nCreate a note\nRead notes\nUpdate a note\nDelete a note\n```\n\n---",
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
      "id": "rn10-5",
      "title": "WatermelonDB — Large Reactive Local Data",
      "durationMinutes": 6,
      "explanation": "Now imagine a much larger application.\n\nFor example:\n\n```\nMessaging app\n```\n\nIt could have:\n\n```\n100,000 messages\n10,000 conversations\nThousands of contacts\nAttachments\nRead states\nTimestamps\n```\n\nA basic storage approach can become difficult.\n\nThis is where libraries such as **WatermelonDB** can be useful.\n\n---\n\n# What makes WatermelonDB interesting?\n\nWatermelonDB is designed for working with large local datasets, particularly in applications where local data is an important part of the user experience.\n\nOne important idea is **reactive data**.\n\n**Reactive** means that when the underlying data changes, parts of your UI can respond to those changes automatically through the library's data-observation mechanisms.\n\nImagine:\n\n```\nDatabase\n  │\n  ▼\nMessage changes\n  │\n  ▼\nObserved data changes\n  │\n  ▼\nUI updates\n```\n\n---\n\n# Why would this matter?\n\nImagine a chat application.\n\nYou have:\n\n```\nMessages\n────────────────\nHello\nHow are you?\nI'm good!\n```\n\nA new message arrives:\n\n```\n\"See you tomorrow\"\n```\n\nThe local database changes.\n\nA reactive system can make it easier for the relevant UI to respond to that change.\n\n---\n\n# WatermelonDB vs SQLite\n\nA useful beginner mental model:\n\n```\nSQLite\n ↓\nDatabase engine\n\nWatermelonDB\n ↓\nHigher-level database library\n ↓\nBuilt around local data workflows\n ↓\nReactive patterns\n```\n\nWatermelonDB uses SQLite as part of its underlying local storage approach on supported platforms, while providing a higher-level API and architecture for application data.\n\n---\n\n# When might you consider it?\n\nThink about:\n\n```\nLarge local dataset\n+\nComplex application\n+\nReactive local data\n+\nOffline functionality\n```\n\nThat's where this kind of database layer becomes interesting.\n\n---\n\n# Don't use it just because it's powerful\n\nIf your app only needs:\n\n```\ntheme = dark\n```\n\nWatermelonDB would be massive overkill.\n\n**Overkill** means using something much more complicated than the problem requires.\n\nFor simple data:\n\n```\nMMKV\n```\n\nmay be enough.\n\nFor sensitive data:\n\n```\nSecureStore\n```\n\nFor structured local records:\n\n```\nSQLite\n```\n\nFor large reactive local datasets:\n\n```\nWatermelonDB\n```\n\n---",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- WatermelonDB is designed for larger local datasets.\n- It supports reactive data patterns.\n- It's useful when local data is a major part of the application.\n- It's more complex than simple key-value storage.\n- Don't introduce a large database framework for tiny amounts of data.\n\n---"
      ],
      "commonMistakes": [],
      "quiz": [
        {
          "question": "What kind of application might benefit from WatermelonDB?",
          "options": [
            "A. A large offline-capable application with lots of local data",
            "B. An app that only stores dark/light mode",
            "C. A static screen with no data",
            "D. A simple button counter"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn10-6",
      "title": "Offline-First Applications",
      "durationMinutes": 7,
      "explanation": "Now let's put everything together.\n\nOne of the most important concepts in modern mobile development is:\n\n> **Don't assume the internet is always available.**\n\nPhones move between:\n\n```\nWi-Fi\n4G\n5G\nNo connection\nWeak connection\nAirplane mode\n```\n\nIf your app only works when the network is perfect, users can have a frustrating experience.\n\nThat's where **offline-first** architecture comes in.\n\n---\n\n# What does offline-first mean?\n\nOffline-first means:\n\n> The application treats local data as an important source of truth and is designed to remain useful even when the network is unavailable.\n\nInstead of:\n\n```\nUser action\n  ↓\nNetwork\n  ↓\nServer\n  ↓\nResponse\n  ↓\nUI\n```\n\nyou can design:\n\n```\nUser action\n  ↓\nLocal data\n  ↓\nUI updates immediately\n  ↓\nBackground synchronization\n  ↓\nServer\n```\n\n---\n\n# Local-first writes\n\nA **write** means changing or creating data.\n\nFor example:\n\n```\nUser creates note\n```\n\nA network-first approach might do:\n\n```\nCreate note\n   ↓\nSend to server\n   ↓\nWait\n   ↓\nServer responds\n   ↓\nShow note\n```\n\nIf the internet is unavailable:\n\n```\n❌ Can't create note\n```\n\n---\n\n# Local-first approach\n\nInstead:\n\n```\nCreate note\n   ↓\nSave locally\n   ↓\nShow note immediately\n   ↓\nSync with server later\n```\n\nNow:\n\n```\nInternet available?\n     │\n┌────┴────┐\n│         │\nYes        No\n│         │\n▼         ▼\nSync      Keep locally\n```\n\nThis often produces a much better mobile experience.\n\n---\n\n# What is synchronization?\n\n**Synchronization**, often shortened to **sync**, means making sure data in different places becomes consistent.\n\nFor example:\n\n```\nPhone\n ↓\nNote: \"Buy milk\"\n\nServer\n ↓\nNote: \"Buy milk\"\n```\n\nThe goal is for both sides to eventually agree.\n\n---\n\n# Background sync\n\n**Background sync** means the app synchronizes local changes with the server when appropriate, without requiring the user to manually press a button every time.\n\nFor example:\n\n```\nUser creates note\n     ↓\nSave locally\n     ↓\nInternet unavailable\n     ↓\nKeep pending change\n     ↓\nInternet returns\n     ↓\nSync\n     ↓\nServer updated\n```\n\nWe'll go much deeper into this architecture on **Day 20**.\n\n---\n\n# What happens when there are conflicts?\n\nThis is where offline systems become more complicated.\n\nImagine:\n\n```\nPhone:\nTitle = \"My Notes\"\n\nServer:\nTitle = \"Important Notes\"\n```\n\nBoth changed while disconnected.\n\nNow:\n\n```\nWhich version wins?\n```\n\nThat's called a **conflict**.\n\nConflict resolution means deciding how competing changes should be handled.\n\nWe'll keep this simple for Day 10.\n\nJust remember:\n\n> Offline-first isn't just \"save everything locally.\"\n\nIt also requires a strategy for synchronization and conflicts.\n\n---",
      "diagram": "```\n                   USER\n                    │\n                    ▼\n              Local Database\n                    │\n                    ▼\n                 UI updates\n                    │\n                    ▼\n            ┌───────────────┐\n            │ Network check │\n            └───────┬───────┘\n                    │\n             Internet available?\n                ┌───┴───┐\n                │       │\n               YES      NO\n                │       │\n                ▼       ▼\n              Sync    Wait\n                │       │\n                ▼       │\n              Server   │\n                │       │\n                └───┬───┘\n                    │\n                    ▼\n              Eventually synced\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Mobile applications shouldn't assume constant connectivity.\n- Offline-first means local data is an important part of the architecture.\n- Local-first writes can make the UI feel faster.\n- Background sync can send local changes to the server later.\n- Offline synchronization introduces conflict-handling problems.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Treating offline support as an afterthought\n\nOffline behavior should influence your data architecture.\n\n### ❌ Assuming every local change immediately reaches the server\n\nThe network can disappear.\n\n### ❌ Ignoring conflicts\n\nTwo different versions of data can exist.\n\n---"
      ],
      "quiz": [
        {
          "question": "What does local-first writing mean?",
          "options": [
            "A. Save locally first and synchronize later when appropriate",
            "B. Never save data",
            "C. Only save data on the server",
            "D. Delete local data immediately"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    }
  ],
  "finalQuiz": [
    {
      "question": "What is AsyncStorage mainly designed for?",
      "options": [
        "A. Small persistent key-value data",
        "B. Relational database queries",
        "C. Secure token storage",
        "D. Animation state"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Where should an authentication token generally be stored?",
      "options": [
        "A. SecureStore",
        "B. StyleSheet",
        "C. FlatList",
        "D. Component props"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is SQLite?",
      "options": [
        "A. A relational database",
        "B. A navigation library",
        "C. A styling library",
        "D. A permission API"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is MMKV primarily useful for in this track?",
      "options": [
        "A. Fast local key-value storage",
        "B. Building screens",
        "C. Sending notifications",
        "D. Creating animations"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does offline-first mean?",
      "options": [
        "A. The app is designed to remain useful with local data even when the network isn't available",
        "B. The app never communicates with a server",
        "C. The app deletes data when offline",
        "D. The app only works on Wi-Fi"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is synchronization?",
      "options": [
        "A. Making data between systems become consistent",
        "B. Changing a screen's color",
        "C. Rendering a component",
        "D. Creating a navigation route"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Which is a good AsyncStorage use case?",
      "options": [
        "A. Saving a user's theme preference",
        "B. Storing a 500,000-row database",
        "C. Running complex relational queries",
        "D. Replacing a server database"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is MMKV mainly useful for?",
      "options": [
        "A. Fast local key-value storage",
        "B. Building navigation stacks",
        "C. Rendering animations",
        "D. Sending push notifications"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Where would an authentication token generally belong?",
      "options": [
        "A. SecureStore",
        "B. A UI component's temporary state",
        "C. A stylesheet",
        "D. A `FlatList`"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What kind of application might benefit from WatermelonDB?",
      "options": [
        "A. A large offline-capable application with lots of local data",
        "B. An app that only stores dark/light mode",
        "C. A static screen with no data",
        "D. A simple button counter"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "🧪 Self-Check — Secure Token + Draft Notes",
    "goal": "Complete the Day 10 self-check project.",
    "brief": "Now you're going to use what you've learned.\n\nYour task:\n\n> **Store an authentication token in SecureStore and a user's draft notes in MMKV. Then explain why you didn't use AsyncStorage for either one.**\n\n---\n\n# Part 1 — Store an authentication token\n\nStart with:\n\n```\nimport * as SecureStore\n from \"expo-secure-store\";\n```\n\nSuppose your login API gives you:\n\n```\nconst token = \"some-auth-token\";\n```\n\nStore it:\n\n```\nawait SecureStore.setItemAsync(\n \"authToken\",\n token\n);\n```\n\nLater:\n\n```\nconst token =\n await SecureStore.getItemAsync(\n   \"authToken\"\n );\n```\n\nYour architecture becomes:\n\n```\nLogin\n ↓\nServer\n ↓\nAuthentication token\n ↓\nSecureStore\n ↓\nFuture API requests\n```\n\n---\n\n# Part 2 — Store draft notes in MMKV\n\nNow imagine the user is writing:\n\n```\nMy shopping list\n\n- Milk\n- Eggs\n- Bread\n```\n\nThis is temporary but useful data.\n\nYou want it to survive:\n\n```\nScreen change\nApp restart\n```\n\nYou can store the draft in MMKV.\n\nConceptually:\n\n```\ndraftNotes\n   ↓\n\"My shopping list...\"\n```\n\nThe exact MMKV API depends on the MMKV version/package setup you're using, but the conceptual operation is:\n\n```\nset(key, value)\nget(key)\n```\n\nFor example:\n\n```\nset(\"draftNotes\", draft)\n```\n\nThen:\n\n```\nget(\"draftNotes\")\n```\n\n---\n\n# Part 3 — Why not AsyncStorage?\n\nThis is the important part of the exercise.\n\nYou should be able to explain:\n\n### Authentication token\n\n```\nToken\n↓\nSensitive credential\n↓\nSecureStore\n```\n\nWhy?\n\nBecause authentication tokens should use a secure storage mechanism designed for sensitive data.\n\n---\n\n### Draft notes\n\n```\nDraft\n↓\nFrequently accessed local data\n↓\nMMKV\n```\n\nWhy?\n\nBecause this track uses MMKV as the default for fast local key-value storage.\n\n---\n\n### Why not AsyncStorage?\n\nThe answer isn't:\n\n> \"AsyncStorage is bad.\"\n\nThat's incorrect.\n\nInstead:\n\n> **AsyncStorage is useful, but these two cases have better-fitting storage choices.**\n\nFor the token:\n\n```\nAsyncStorage\n  ↓\nGeneral-purpose storage\n\nSecureStore\n  ↓\nSensitive credentials\n```\n\nFor the draft:\n\n```\nAsyncStorage\n  ↓\nGeneral key-value storage\n\nMMKV\n  ↓\nFast local key-value storage\n```\n\n---",
    "steps": [],
    "acceptance": [],
    "footer": "# 🧠 Storage Decision Tree\n\nWhen you're unsure what to use, start with this:\n\n```\n                What are you storing?\n                        │\n         ┌──────────────┼───────────────┐\n         │              │               │\n         ▼              ▼               ▼\n      Secret?       Simple value?   Structured data?\n         │              │               │\n         ▼              ▼               ▼\n    SecureStore     MMKV / Async     SQLite\n                        Storage          │\n                                         ▼\n                                 Large + reactive?\n                                         │\n                                         ▼\n                                    WatermelonDB\n```\n\nAnd remember:\n\n```\nAsyncStorage\n   ↓\nSimple general persistent data\n\nMMKV\n   ↓\nFast local key-value data\n\nSecureStore\n   ↓\nSensitive values\n\nSQLite\n   ↓\nStructured relational data\n\nWatermelonDB\n   ↓\nLarge reactive local datasets\n```\n\n---\n\n# 🎯 What You Should Know After Day 10\n\nBy the end of today, you should be able to look at a piece of data and ask:\n\n> **\"What kind of data is this, and what storage tool fits it?\"**\n\nFor example:\n\n```\nTheme preference\n     ↓\nMMKV / AsyncStorage\n\nAuthentication token\n     ↓\nSecureStore\n\n10,000 local products\n     ↓\nSQLite\n\nLarge reactive message database\n     ↓\nWatermelonDB\n\nOffline changes\n     ↓\nLocal database\n     ↓\nBackground synchronization\n     ↓\nServer\n```\n\nThe biggest lesson is:\n\n> **Don't choose storage based on habit. Choose it based on the data's sensitivity, size, access pattern, performance needs, and relationship to other data.**\n\nAnd one final mental model to remember:\n\n```\n                   STORAGE\n                      │\n      ┌───────────────┼────────────────┐\n      │               │                │\n      ▼               ▼                ▼\n   Simple          Sensitive       Structured\n   values            data            data\n      │               │                │\n      ▼               ▼                ▼\nAsyncStorage       SecureStore      SQLite\n      │\n      ▼\n  Fast access\n      │\n      ▼\n     MMKV\n                      │\n                      ▼\n            Large reactive data\n                      │\n                      ▼\n                 WatermelonDB\n                      │\n                      ▼\n               Offline-first\n                      │\n                      ▼\n                Local data\n                      │\n                      ▼\n                Background sync\n```"
  }
});

