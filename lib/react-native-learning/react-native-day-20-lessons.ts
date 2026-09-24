import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_20_LESSONS = normalizePastedLessonDay({
  "day": 20,
  "title": "Offline-first and Sync",
  "overview": "📖 **5 lessons**\n\nToday we're going to tackle one of the hardest parts of mobile development: **what happens when the internet disappears**.\n\nA mobile app cannot assume that the network is always available. Your user can enter a subway, drive through an area with poor coverage, switch to airplane mode, or simply have a flaky connection.\n\nA good offline-first app doesn't just show an error when that happens. Instead, it continues to be useful, stores changes locally, and synchronizes those changes when the network becomes available again.",
  "totalMinutes": 60,
  "difficulty": "Intermediate",
  "lessons": [
    {
      "id": "rn20-1",
      "title": "Detecting and reacting to connectivity changes",
      "durationMinutes": 12,
      "explanation": "⏱ **12 min**\n\n### Explanation\n\nBefore we can build an offline-first application, we need to know whether the device currently has a network connection.\n\nIn React Native, a common library for this is **NetInfo**.\n\nNetInfo can tell us things such as:\n\n- Whether the device is connected.\n- Whether the connection is Wi-Fi or cellular.\n- Whether the device appears to have internet access.\n- When the connection changes.\n\nThe important idea is that **connectivity is a changing condition**.\n\nYou shouldn't check:\n\n```\n\"Is the user online?\"\n```\n\nonce and assume the answer will remain the same.\n\nInstead, your application should react to changes:\n\n```\nOnline\n↓\nUser loses connection\n↓\nOffline\n↓\nUser reconnects\n↓\nOnline\n↓\nStart synchronization\n```\n\n### What does \"offline-first\" mean?\n\n**Offline-first** means designing the application so that local data is useful even when the network isn't available.\n\nThe network becomes something that **synchronizes your local data**, rather than something your entire UI depends on.\n\nFor example, imagine a notes application.\n\nA user writes:\n\n```\nBuy milk\n```\n\nIf you're building a network-dependent application, you might do:\n\n```\nUser types note\n    ↓\nSend to server\n    ↓\nWait\n    ↓\nSave/display note\n```\n\nThat becomes a problem when there is no internet.\n\nAn offline-first application can do this instead:\n\n```\nUser types note\n    ↓\nSave locally\n    ↓\nShow note immediately\n    ↓\nInternet available?\n    ↓\nYes → synchronize with server\nNo  → keep waiting\n```\n\nThe user doesn't have to stop working just because the network disappeared.\n\n### Connectivity is not the same as internet access\n\nThis is an important beginner concept.\n\nA device can be connected to Wi-Fi but still have no working internet connection.\n\nFor example:\n\n```\nPhone\n↓\nWi-Fi router\n↓\nInternet ❌\n```\n\nSo your application should avoid treating:\n\n```\nWi-Fi = definitely online\n```\n\nas a guarantee.\n\n**Connectivity** means the device has some network connection.\n\n**Reachability** means the application can actually communicate with the service it needs.\n\nThese are related, but they aren't identical.\n\n### Reacting to changes\n\nConceptually, your application can subscribe to connectivity changes:\n\n```\nNetInfo.addEventListener(state => {\nif (state.isConnected) {\n  // Network may be available\n} else {\n  // Device is offline\n}\n});\n```\n\nThe important part isn't memorizing the API.\n\nThe important part is understanding the architecture:\n\n```\nConnectivity changes\n      ↓\nApplication detects change\n      ↓\nUpdate sync state\n      ↓\nIf connection returned\n      ↓\nAttempt synchronization\n```\n\n### What should the UI do?\n\nDon't necessarily block the entire application when the user is offline.\n\nInstead, show useful information.\n\nFor example:\n\n```\nMy Notes\n\n✓ All changes saved\n\n[Note 1]\n[Note 2]\n```\n\nWhen offline:\n\n```\nMy Notes\n\n⚠ You're offline\nChanges will sync when you're back online.\n\n[Note 1]\n[Note 2]\n```\n\nWhen synchronization starts:\n\n```\nMy Notes\n\n↻ Syncing changes...\n\n[Note 1]\n[Note 2]\n```\n\nThe user can still use the application.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "Connectivity should influence **synchronization**, not necessarily the entire user interface.\n\n---\n\n### Visual Diagram\n\n```\n               ┌───────────────┐\n               │  User edits   │\n               │     data      │\n               └───────┬───────┘\n                       ↓\n               ┌───────────────┐\n               │ Save locally  │\n               └───────┬───────┘\n                       ↓\n              Is network available?\n                  ↙          ↘\n                NO            YES\n                ↓              ↓\n        Keep local change   Sync\n                ↓              ↓\n        Wait for network   Server\n                ↓\n        Connection returns\n                ↓\n            Sync changes\n```"
      ],
      "commonMistakes": [
        "**Mistake 1: Assuming Wi-Fi means internet works**\n\nWi-Fi can be connected while the internet is unavailable.\n\n**Mistake 2: Blocking the UI when offline**\n\nYour app can often remain useful without a connection.\n\n**Mistake 3: Automatically retrying forever**\n\nRepeated requests can waste battery and network data.\n\nUse deliberate retry rules.\n\n**Mistake 4: Treating connectivity as permanent**\n\nThe network can disappear at any moment.\n\n---\n\n### Mini Quiz\n\n**Ques"
      ],
      "quiz": [
        {
          "question": "**Question 1:** What should an offline-first application do when the network disappears?",
          "options": [
            "A. Immediately close the application",
            "B. Continue using local data and synchronize later",
            "C. Delete unsynchronized data",
            "D. Force the user to reconnect"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn20-2",
      "title": "Optimistic updates and rolling them back on failure",
      "durationMinutes": 14,
      "explanation": "⏱ **14 min**\n\n### Explanation\n\nNow let's talk about **optimistic updates**.\n\nAn optimistic update means:\n\n> \"We will update the UI immediately because we expect the server operation to succeed.\"\n\nThis makes applications feel much faster.\n\nImagine a user likes a post.\n\nWithout an optimistic update:\n\n```\nUser taps ❤️\n     ↓\nRequest server\n     ↓\nWait 500ms\n     ↓\nServer says success\n     ↓\nShow ❤️\n```\n\nThe user sees a delay.\n\nWith an optimistic update:\n\n```\nUser taps ❤️\n     ↓\nImmediately show ❤️\n     ↓\nSend request\n     ↓\nServer succeeds\n     ↓\nEverything is fine\n```\n\nBut what happens if the request fails?\n\nWe need to **roll back** the optimistic change.\n\n### What is rollback?\n\n**Rollback** means returning the application to the previous state after an operation fails.\n\nFor example:\n\n```\nBefore:\n\n♡ Like\n```\n\nUser taps it:\n\n```\n❤️ Like\n```\n\nRequest fails:\n\n```\n♡ Like\n```\n\nThe application reverses the temporary change.\n\n### Why use optimistic updates?\n\nThey make applications feel responsive.\n\nThe user doesn't have to wait for the server before seeing the expected result.\n\nThis is particularly useful for:\n\n- Likes\n- Follows\n- Checkboxes\n- Toggling settings\n- Editing small pieces of data\n- Adding items\n- Removing items\n\n### But optimistic updates have a cost\n\nThe application is temporarily showing something that the server has **not confirmed yet**.\n\nThat's why you need a recovery strategy.\n\nA useful mental model is:\n\n```\nLocal state\n  ↓\nAssume success\n  ↓\nUpdate UI\n  ↓\nSend server request\n  ↓\n┌───────────────┐\n│               │\nSuccess       Failure\n│               │\n↓               ↓\nKeep change    Rollback\n```\n\n### Example\n\nSuppose a user changes:\n\n```\nTask:\nComplete tutorial\n\nStatus:\nIncomplete\n```\n\nThey tap the checkbox.\n\nImmediately:\n\n```\nStatus:\nComplete\n```\n\nThe request is sent.\n\nIf the server responds successfully:\n\n```\nComplete ✓\n```\n\nIf it fails:\n\n```\nIncomplete\n```\n\nYou can also tell the user:\n\n```\nCouldn't save the change.\nWe'll try again when you're online.\n```\n\n### Offline optimistic updates\n\nThis becomes more interesting when combined with offline-first architecture.\n\nThe user changes something while offline:\n\n```\nUser edits note\n    ↓\nSave locally\n    ↓\nMark as pending\n    ↓\nNo network\n    ↓\nWait\n```\n\nWhen the network returns:\n\n```\nNetwork returns\n    ↓\nSend pending change\n    ↓\nServer accepts\n    ↓\nMark as synced\n```\n\n### Sync states\n\nA local item can have a state such as:\n\n```\nsynced\nsyncing\nfailed\n```\n\nYou might also internally use:\n\n```\npending\n```\n\nFor example:\n\n```\nNote\n------------------\nBuy groceries\nStatus: Pending\n```\n\nLater:\n\n```\nNote\n------------------\nBuy groceries\nStatus: Synced ✓\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Optimistic updates make UI feel immediate.\n- The server request still needs to happen.\n- Failed operations need rollback or another recovery strategy.\n- Offline changes can remain pending until connectivity returns."
      ],
      "commonMistakes": [
        "**Mistake 1: Optimistically changing the UI without a rollback plan**\n\nAlways know what happens if the request fails.\n\n**Mistake 2: Assuming every operation should be optimistic**\n\nSome operations are too risky.\n\nFor example, permanently deleting important data may deserve stronger confirmation.\n\n**Mistake 3: Losing pending changes**\n\nIf the application closes while a change is waiting for synchronization, the pending operation needs to survive.\n\n---\n\n### Mini Quiz\n\nA user"
      ],
      "quiz": [
        {
          "question": "A user changes a setting. Your app immediately updates the screen before the server responds. The server then rejects the change.\n\nWhat should happen?",
          "options": [
            "A. Keep showing the successful state forever",
            "B. Roll back or otherwise reconcile the failed change",
            "C. Delete the account",
            "D. Restart the application"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn20-3",
      "title": "Conflict resolution when two devices edit the same data",
      "durationMinutes": 14,
      "explanation": "⏱ **14 min**\n\n### Explanation\n\nThis is where offline-first applications become much more interesting.\n\nImagine you have the same account logged into:\n\n```\nPhone A\nPhone B\n```\n\nBoth devices go offline.\n\nThe user edits the same note on both devices.\n\n### Example\n\nOriginal note:\n\n```\nMeeting at 10 AM\n```\n\nPhone A changes it to:\n\n```\nMeeting at 11 AM\n```\n\nPhone B changes it to:\n\n```\nMeeting at 2 PM\n```\n\nBoth devices were offline.\n\nNow both reconnect.\n\nWhich value should the server keep?\n\nThere isn't always an obvious answer.\n\nThis situation is called a **conflict**.\n\n### What is conflict resolution?\n\n**Conflict resolution** means deciding what happens when multiple versions of the same data disagree.\n\nThe application needs a predictable rule.\n\n### Strategy 1: Last write wins\n\nOne simple strategy is:\n\n> The newest accepted update replaces the older update.\n\nFor example:\n\n```\nPhone A → 11 AM\nPhone B → 2 PM\n```\n\nIf B's update is considered later:\n\n```\nFinal:\n2 PM\n```\n\nThis is easy to understand, but it can lose information.\n\n### Strategy 2: Server-authoritative state\n\nThe server decides which version is valid.\n\nThe client sends its update:\n\n```\nClient → Server\n```\n\nThe server checks:\n\n```\nDoes this version still match?\n```\n\nIf not:\n\n```\nConflict detected\n```\n\nThe client can then refresh and ask the user what to do.\n\n### Strategy 3: Merge changes\n\nSometimes changes can be combined.\n\nFor example:\n\nOriginal:\n\n```\nShopping list:\nMilk\n```\n\nPhone A adds:\n\n```\nBread\n```\n\nPhone B adds:\n\n```\nEggs\n```\n\nA merge could produce:\n\n```\nMilk\nBread\nEggs\n```\n\nThis works well for some data types, but not everything can be merged safely.\n\n### Version numbers\n\nA common way to detect conflicts is to store a version.\n\nFor example:\n\n```\nNote version: 5\n```\n\nPhone A reads version 5.\n\nPhone B also reads version 5.\n\nPhone A updates:\n\n```\nVersion 5 → Version 6\n```\n\nPhone B later tries to update version 5.\n\nThe server sees:\n\n```\nCurrent version: 6\nIncoming version: 5\n```\n\nNow it knows the client is working with an older version.\n\n### Why this matters\n\nWithout conflict detection, you can accidentally overwrite newer user data.\n\nThat's one of the most dangerous bugs in offline applications because the user may not realize their changes disappeared.\n\n### Conflict resolution should be predictable\n\nYour users don't need to know every technical detail.\n\nBut your application should have a clear rule.\n\nFor example:\n\n```\nNo conflict\n  ↓\nAutomatically sync\n\nConflict detected\n  ↓\nTry safe merge\n\nCannot merge\n  ↓\nAsk user\n```",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "A conflict happens when two versions of the same data are changed independently.\n\nCommon approaches include:\n\n- Last-write-wins\n- Server-authoritative updates\n- Version checking\n- Merging changes\n- Asking the user to resolve important conflicts\n\nThere is no single conflict strategy that works for every application."
      ],
      "commonMistakes": [
        "**Mistake 1: Silently overwriting important data**\n\nThe user may lose work.\n\n**Mistake 2: Assuming only one device edits the data**\n\nModern applications commonly run on multiple devices.\n\n**Mistake 3: Using timestamps without thinking about them**\n\nDevice clocks can be inaccurate or different.\n\n**Mistake 4: Trying to automatically merge everything**\n\nSome data simply cannot be safely merged.\n\n---\n\n### Mini Quiz\n\nTwo de"
      ],
      "quiz": [
        {
          "question": "Two devices edit the same record while offline. When they reconnect, the two versions are different.\n\nWhat is this called?",
          "options": [
            "A. Rendering",
            "B. Conflict",
            "C. Hydration",
            "D. Virtualization"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn20-4",
      "title": "Background sync when connectivity returns",
      "durationMinutes": 10,
      "explanation": "⏱ **10 min**\n\n### Explanation\n\nNow we can connect the pieces together.\n\nSuppose the user makes five changes while offline.\n\nYou might have:\n\n```\nChange 1 → pending\nChange 2 → pending\nChange 3 → pending\nChange 4 → pending\nChange 5 → pending\n```\n\nThen the network comes back.\n\nYour application should recognize:\n\n```\nOffline → Online\n```\n\nand start synchronization.\n\n### What is synchronization?\n\n**Synchronization**, often shortened to **sync**, means making sure the local data and server data agree.\n\nFor example:\n\n```\nLocal:\nNote A\nNote B\nNote C\n```\n\nServer:\n\n```\nNote A\nNote B\n```\n\nThe application may need to send:\n\n```\nNote C\n```\n\nAfter synchronization:\n\n```\nLocal:\nNote A\nNote B\nNote C\n\nServer:\nNote A\nNote B\nNote C\n```\n\nNow both sides agree.\n\n### A simple sync pipeline\n\n```\nConnection returns\n      ↓\nFind pending changes\n      ↓\nSend changes to server\n      ↓\nServer accepts?\n   ↙       ↘\n YES        NO\n  ↓          ↓\nMark synced  Handle failure\n  ↓          ↓\nContinue     Retry/conflict\n```\n\n### Don't synchronize everything blindly\n\nImagine the user has 1,000 local records.\n\nYou don't necessarily want to upload all 1,000 every time the network returns.\n\nInstead, track what changed.\n\nFor example:\n\n```\npendingChanges = [\nupdate note 10,\ndelete note 25,\ncreate note 42\n]\n```\n\nThen synchronize those changes.\n\nThis is sometimes called a **sync queue**.\n\nA **queue** is a collection of tasks waiting to be processed.\n\n### What happens if synchronization fails?\n\nMaybe the network disappeared again.\n\nYou shouldn't immediately declare the data lost.\n\nInstead:\n\n```\nSyncing\n ↓\nRequest fails\n ↓\nKeep change pending\n ↓\nWait\n ↓\nTry again later\n```\n\nBut retries should be controlled.\n\n### Retry with backoff\n\n**Backoff** means waiting progressively longer between retry attempts.\n\nFor example:\n\n```\nAttempt 1 → immediately\nAttempt 2 → wait 2 seconds\nAttempt 3 → wait 5 seconds\nAttempt 4 → wait 15 seconds\n```\n\nThis prevents the app from aggressively hitting a server that may already be unavailable.\n\n### Background sync isn't magic\n\nMobile operating systems control when applications can run in the background.\n\nYour app cannot simply assume:\n\n```\n\"I'll keep running forever in the background.\"\n```\n\nThe operating system may suspend or stop background work.\n\nTherefore, design synchronization so it can safely:\n\n- Start.\n- Pause.\n- Stop.\n- Resume.\n- Retry.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "When connectivity returns:\n\n1. Detect the connection.\n2. Find pending changes.\n3. Send them.\n4. Handle failures.\n5. Detect conflicts.\n6. Mark successful changes as synchronized.\n7. Fetch newer server data when necessary."
      ],
      "commonMistakes": [
        "- Assuming background execution is unlimited.\n- Removing a pending change before the server confirms it.\n- Retrying continuously.\n- Sending duplicate mutations.\n- Not making operations safe to retry.\n\n### What's an idempotent operation?\n\nAn **idempotent operation** is an operation that can safely be performed more than once without producing an incorrect additional effect.\n\nFor example, setting:\n\n```\nstatus = \"complete\"\n```\n\nmultiple times should still result in:\n\n```\nstatus = \"complete\"\n```\n\nThis becomes very useful when network requests are retried.\n\n---\n\n### Mini Quiz\n\nWhat s"
      ],
      "quiz": [
        {
          "question": "What should happen to a pending offline change if synchronization fails?",
          "options": [
            "A. Delete it immediately",
            "B. Keep it pending and handle the failure according to your retry/conflict strategy",
            "C. Shut down the app",
            "D. Ignore the user"
          ],
          "correctIndex": 1,
          "explanation": "**Answer:** B"
        }
      ]
    },
    {
      "id": "rn20-5",
      "title": "Designing UI that's honest about sync state",
      "durationMinutes": 10,
      "explanation": "⏱ **10 min**\n\n### Explanation\n\nThe final piece is the user interface.\n\nYour application needs to tell users what's happening.\n\nBut there's an important rule:\n\n> Don't claim that data is synchronized when it isn't.\n\nImagine the user creates an important note while offline.\n\nIf your UI says:\n\n```\nSaved ✓\n```\n\nthe user may reasonably assume that the server has the data.\n\nBut perhaps the note only exists locally.\n\nA better message might be:\n\n```\nSaved on this device\nWaiting for connection\n```\n\n### Three important states\n\nA simple application can start with three visible states:\n\n#### Synced\n\n```\n✓ Synced\n```\n\nMeaning:\n\n> The local data has successfully synchronized with the server.\n\n#### Syncing\n\n```\n↻ Syncing...\n```\n\nMeaning:\n\n> The application is currently trying to synchronize changes.\n\n#### Failed\n\n```\n⚠ Sync failed\n```\n\nMeaning:\n\n> The application attempted synchronization but couldn't complete it.\n\nYou might provide:\n\n```\nTry again\n```\n\n### Offline state\n\nYou can also communicate connectivity separately:\n\n```\nYou're offline.\nChanges will sync when you're back online.\n```\n\nThis is useful because:\n\n```\nOffline\n```\n\nand:\n\n```\nSync failed\n```\n\nare not exactly the same thing.\n\nThe user could be online but synchronization could fail because the server returned an error.\n\n### Don't overload the user with technical details\n\nYou don't need to display:\n\n```\nHTTP 503\nretryCount: 4\nmutationQueueLength: 7\n```\n\nto a beginner user.\n\nInstead:\n\n```\nCouldn't sync your changes.\nWe'll try again automatically.\n```\n\nFor advanced troubleshooting, you can provide more detail elsewhere.\n\n### A useful state model\n\nYour application might internally think in terms of:\n\n```\nonline\noffline\nsyncing\nsynced\nfailed\nconflict\n```\n\nFor example:\n\n```\n               ┌─────────┐\n               │ Offline │\n               └────┬────┘\n                    │\n             Connection returns\n                    ↓\n               ┌─────────┐\n               │ Syncing │\n               └────┬────┘\n                  ↙   ↘\n            Success   Failure\n              ↓         ↓\n           Synced     Failed\n                        │\n                     Retry\n                        │\n                        ↓\n                     Syncing\n```\n\nIf a conflict is discovered:\n\n```\nSyncing\n ↓\nConflict\n ↓\nResolve automatically\n     OR\nAsk user\n```\n\n### Honest UI is important\n\nConsider these two messages.\n\nBad:\n\n```\nSaved successfully!\n```\n\nwhen the server has never received the data.\n\nBetter:\n\n```\nSaved locally.\nWill sync when you're online.\n```\n\nThe second message accurately describes what happened.",
      "diagram": "",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "Your UI should distinguish between:\n\n- Data saved locally.\n- Data currently syncing.\n- Data successfully synchronized.\n- Synchronization failure.\n- Conflicts that require attention.\n\nUsers should never have to guess whether their work was actually synchronized."
      ],
      "commonMistakes": [
        "### Mistake 1: Showing \"Saved\" when only local storage succeeded\n\nUse wording that matches what actually happened.\n\n### Mistake 2: Hiding synchronization failures\n\nIf something failed, the user should have a way to understand or recover from it.\n\n### Mistake 3: Showing a permanent offline banner\n\nIf the connection returns, the UI should update.\n\n### Mistake 4: Making users manually refresh everything\n\nA good sync system can react to connectivity changes automatically.\n\n### Mistake 5: Treating synchronization as a single request\n\nReal synchronization can involve:\n\n```\nuploads\ndownloads\nconflicts\nretries\ndeletions\nupdates\n```\n\nIt is a process, not necessarily one HTTP request.\n\n---\n\n## Mini Quiz\n\nYour a"
      ],
      "quiz": [
        {
          "question": "Your app shows:\n\n```\n✓ Synced\n```\n\nWhat should this normally communicate?",
          "options": [
            "A. The user has entered some data",
            "B. The data is only stored in memory",
            "C. The local changes have successfully synchronized with the server",
            "D. The device has Wi-Fi"
          ],
          "correctIndex": 2,
          "explanation": "**Answer:** C"
        }
      ]
    }
  ],
  "finalQuiz": [
    {
      "question": "**Question 1:** What should an offline-first application do when the network disappears?",
      "options": [
        "A. Immediately close the application",
        "B. Continue using local data and synchronize later",
        "C. Delete unsynchronized data",
        "D. Force the user to reconnect"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "A user changes a setting. Your app immediately updates the screen before the server responds. The server then rejects the change.\n\nWhat should happen?",
      "options": [
        "A. Keep showing the successful state forever",
        "B. Roll back or otherwise reconcile the failed change",
        "C. Delete the account",
        "D. Restart the application"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "Two devices edit the same record while offline. When they reconnect, the two versions are different.\n\nWhat is this called?",
      "options": [
        "A. Rendering",
        "B. Conflict",
        "C. Hydration",
        "D. Virtualization"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "What should happen to a pending offline change if synchronization fails?",
      "options": [
        "A. Delete it immediately",
        "B. Keep it pending and handle the failure according to your retry/conflict strategy",
        "C. Shut down the app",
        "D. Ignore the user"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "Your app shows:\n\n```\n✓ Synced\n```\n\nWhat should this normally communicate?",
      "options": [
        "A. The user has entered some data",
        "B. The data is only stored in memory",
        "C. The local changes have successfully synchronized with the server",
        "D. The device has Wi-Fi"
      ],
      "correctIndex": 2,
      "explanation": "**Answer:** C"
    },
    {
      "question": "What is the main idea behind offline-first design?",
      "options": [
        "A. The app should never communicate with a server",
        "B. The app should remain useful using local data even when the network is unavailable",
        "C. The app should only work on Wi-Fi",
        "D. The app should download everything on launch"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "What is an optimistic update?",
      "options": [
        "A. Waiting for the server before changing the UI",
        "B. Updating the UI immediately while expecting the server operation to succeed",
        "C. Deleting local data",
        "D. Disabling the network"
      ],
      "correctIndex": 1,
      "explanation": "**Answer:** B"
    },
    {
      "question": "Two devices modify the same record while offline. Their changes disagree when they reconnect. What is this situation called?",
      "options": [
        "A. Virtualization",
        "B. Hydration",
        "C. Conflict",
        "D. Rendering"
      ],
      "correctIndex": 2,
      "explanation": "**Answer:** C"
    },
    {
      "question": "Why should an offline change remain pending if synchronization fails?",
      "options": [
        "A. So it can potentially be retried or resolved later",
        "B. Because failed data should never be removed",
        "C. Because React requires it",
        "D. Because NetInfo requires it"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What should an offline-first application do when connectivity returns?",
      "options": [
        "A. Synchronize pending operations safely",
        "B. Delete local data",
        "C. Hide every sync failure",
        "D. Assume every request succeeded"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "footer": "# 🔗 How Everything Fits Together\n\nAt this point, you should be able to see how the pieces from previous days connect.\n\n```\n             ┌────────────────────┐\n             │ User changes data  │\n             └─────────┬──────────┘\n                       ↓\n             ┌────────────────────┐\n             │ Save locally       │\n             └─────────┬──────────┘\n                       ↓\n             ┌────────────────────┐\n             │ Update UI          │\n             │ optimistically     │\n             └─────────┬──────────┘\n                       ↓\n               Is device online?\n                  ↙          ↘\n                NO            YES\n                ↓              ↓\n       Keep change pending    Sync\n                ↓              ↓\n       Wait for connection   Server\n                ↓              ↓\n         Connection returns\n                ↓\n             Sync queue\n                ↓\n       ┌────────┴─────────┐\n       ↓                  ↓\n   Success              Conflict\n       ↓                  ↓\n   Synced            Resolve/ask\n```\n\nThis is the basic architecture behind many offline-capable applications.\n\n---\n\n# 🧠 Final Mental Model\n\nWhen building an offline-first application, think about **three places**:\n\n### 1\\. The UI\n\nWhat does the user currently see?\n\n```\nSaved\nSyncing\nOffline\nFailed\n```\n\n### 2\\. Local storage\n\nWhat does the device know?\n\n```\nLocal data\nPending changes\nSync status\nVersions\n```\n\n### 3\\. The server\n\nWhat does the backend know?\n\n```\nAuthoritative data\nVersions\nOther users' changes\n```\n\nYour job is to keep these three pieces coordinated.\n\n```\n      UI\n       ↕\nLocal storage\n       ↕\nSynchronization\n       ↕\n    Server\n```\n\nThe network can disappear at any point, so the architecture must tolerate that.",
  "project": {
    "name": "Self-check: Build an offline conflict simulator",
    "goal": "Build an offline conflict simulator.",
    "brief": "Now let's turn everything into a practical exercise.\n\nYour goal is to **edit data offline on two simulated devices, reconnect both, and resolve the conflict predictably.**\n\n## What you're building\n\nCreate a small notes application that simulates:\n\n```\nDevice A\nDevice B\nServer\n```\n\nEach device should have its own local copy of the data.\n\nFor example:\n\n```\nServer\n└── Note\n   ├── id: 1\n   ├── text: \"Meeting at 10 AM\"\n   └── version: 1\n```\n\nBoth devices initially download that note.\n\n```\nDevice A\nMeeting at 10 AM\nversion 1\n\nDevice B\nMeeting at 10 AM\nversion 1\n```\n\n---\n\n## Step 1 — Take both devices offline\n\nSimulate the network being unavailable.\n\nYour UI should clearly show:\n\n```\nDevice A\nOffline\n\nDevice B\nOffline\n```\n\n---\n\n## Step 2 — Edit the note on Device A\n\nChange:\n\n```\nMeeting at 10 AM\n```\n\nto:\n\n```\nMeeting at 11 AM\n```\n\nThe local device should immediately show:\n\n```\nMeeting at 11 AM\nPending sync\n```\n\n---\n\n## Step 3 — Edit the same note on Device B\n\nChange it to:\n\n```\nMeeting at 2 PM\n```\n\nDevice B should show:\n\n```\nMeeting at 2 PM\nPending sync\n```\n\nNow you have two different local versions.\n\n```\nDevice A → 11 AM\nDevice B → 2 PM\n```\n\n---\n\n## Step 4 — Reconnect Device A\n\nSimulate the network returning.\n\nDevice A sends:\n\n```\n11 AM\nversion 1\n```\n\nThe server accepts it.\n\nThe server becomes:\n\n```\n11 AM\nversion 2\n```\n\nDevice A should now display:\n\n```\n✓ Synced\n```\n\n---\n\n## Step 5 — Reconnect Device B\n\nDevice B still has:\n\n```\n2 PM\nversion 1\n```\n\nBut the server now has:\n\n```\n11 AM\nversion 2\n```\n\nDevice B should detect:\n\n```\nLocal version: 1\nServer version: 2\n```\n\nThat means a conflict exists.\n\nDo **not** silently overwrite the server value.\n\nInstead, display something such as:\n\n```\nConflict detected\n\nYour version:\nMeeting at 2 PM\n\nServer version:\nMeeting at 11 AM\n\n[Keep mine]\n[Use server version]\n```\n\n---\n\n## Step 6 — Resolve the conflict\n\nChoose a predictable strategy.\n\nFor this exercise, let the user decide.\n\nIf they select:\n\n```\nKeep mine\n```\n\nthe server could become:\n\n```\nMeeting at 2 PM\nversion 3\n```\n\nIf they select:\n\n```\nUse server version\n```\n\nDevice B should become:\n\n```\nMeeting at 11 AM\nversion 2\n```",
    "steps": [],
    "acceptance": [
      "Device A can work without a network.",
      "Device B can work without a network.",
      "Changes are stored locally.",
      "Changes are marked as pending.",
      "Connectivity changes trigger synchronization.",
      "Successful changes become synced.",
      "Two devices can create a conflict.",
      "The conflict is detected instead of silently overwritten.",
      "The conflict has a predictable resolution.",
      "The UI clearly communicates `offline`, `syncing`, `synced`, and `failed`.",
      "A failed synchronization does not silently destroy the user's local change."
    ],
    "stretch": [
      "A real sync queue.",
      "Automatic retry with backoff.",
      "A version number for every record.",
      "Multiple pending changes.",
      "Conflict resolution for multiple fields.",
      "A \"Last synced\" timestamp.",
      "A manual \"Sync now\" button.",
      "Persistence of pending operations across an app restart.",
      "A network simulator with **Online**, **Offline**, and **Flaky** modes.",
      "Logging so you can see every synchronization operation."
    ],
    "footer": "The most important lesson from Day 20 is this:\n\n> **The network is not your application's source of existence. Your application should remain useful locally, then synchronize with the server when it can.**"
  }
});
