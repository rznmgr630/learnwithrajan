import { normalizePastedLessonDay } from "@/lib/learn/normalize-pasted-lesson-day";

export const REACT_NATIVE_DAY_13_LESSONS = normalizePastedLessonDay({
  "day": 13,
  "title": "Media and Files",
  "overview": "Today we're working with something you'll find in almost every real mobile application:\n\n> **Images, videos, documents, and files.**\n\nThink about apps like Instagram, WhatsApp, Google Drive, YouTube, or a shopping app.\n\nThey all need to answer questions like:\n\n- How do I display a remote image?\n- How do I make images load smoothly?\n- How do I play a video?\n- How do I let the user choose a photo?\n- Where is a downloaded file stored?\n- How do I upload a 200 MB video?\n- What happens if the user backgrounds the app during an upload?\n- How do I avoid downloading the same image over and over?\n\nToday we'll build the mental model behind all of these problems.\n\n---",
  "totalMinutes": 50,
  "difficulty": "Beginner → Intermediate",
  "lessons": [
    {
      "id": "rn13-1",
      "title": "expo-image — Displaying Images the Right Way",
      "durationMinutes": 9,
      "explanation": "You've probably already seen React Native's:\n\n```\n<Image />\n```\n\nBut modern Expo applications often use:\n\n```\nimport { Image } from \"expo-image\";\n```\n\nfrom **`expo-image`**.\n\nIt is designed to provide a more capable image component, especially for applications that display lots of remote images.\n\n---\n\n## Why do images need special treatment?\n\nAt first, displaying an image sounds simple:\n\n```\n<Image\n source={{ uri: imageUrl }}\n/>\n```\n\nBut imagine a social media feed with:\n\n```\n100 images\n200 images\n500 images\n```\n\nNow you have several problems:\n\n```\nDownload images\nCache images\nShow placeholders\nHandle failures\nResize images\nAvoid unnecessary downloads\nKeep scrolling smooth\n```\n\nA good image component helps you deal with these concerns.\n\n---\n\n# What is image caching?\n\nA **cache** is a place where previously downloaded data can be stored so it can be reused.\n\nImagine this:\n\n```\nFirst time:\n\nRemote image\n   ↓\nInternet\n   ↓\nDownload\n   ↓\nCache\n   ↓\nDisplay\n```\n\nLater:\n\n```\nOpen screen again\n     ↓\nImage already cached?\n     ↓\n    Yes\n     ↓\nUse cached image\n```\n\nYou don't necessarily need to download the same image again.\n\n---\n\n# Why caching matters\n\nImagine your feed contains:\n\n```\nProfile picture\nProfile picture\nProfile picture\nProfile picture\n```\n\nWithout sensible caching, the application might repeatedly request the same resource.\n\nThat wastes:\n\n- Network bandwidth (the amount of data transferred)\n- Battery\n- Time\n- User data\n- Server resources\n\nCaching helps reduce unnecessary work.\n\n---\n\n# Basic `expo-image` example\n\n```\nimport { Image } from \"expo-image\";\n\nexport default function ProfileImage() {\n return (\n   <Image\n     source=\"https://example.com/profile.jpg\"\n     style={{\n       width: 100,\n       height: 100,\n     }}\n     contentFit=\"cover\"\n   />\n );\n}\n```\n\nHere:\n\n```\ncontentFit=\"cover\"\n```\n\nmeans the image should fill the available area while maintaining its proportions.\n\n---\n\n# What is a placeholder?\n\nA **placeholder** is something shown while the real image is loading.\n\nInstead of:\n\n```\n┌─────────────────┐\n│                 │\n│   Empty space   │\n│                 │\n└─────────────────┘\n```\n\nyou can show:\n\n```\n┌─────────────────┐\n│ ░░░░░░░░░░░░░░ │\n│ ░░ Loading ░░░ │\n│ ░░░░░░░░░░░░░░ │\n└─────────────────┘\n```\n\nThis makes the application feel more responsive.\n\n---\n\n# Blur placeholders\n\nA common design is to show a low-quality or blurred version while the full image loads.\n\nConceptually:\n\n```\nSmall image\n   ↓\nBlurred placeholder\n   ↓\nFull-quality image\n```\n\nThis is particularly useful in feeds.\n\nThe user immediately sees something instead of waiting for the complete image.\n\n---\n\n# Image sizing\n\nOne of the most important things in a scrolling feed is avoiding unnecessarily huge images.\n\nSuppose the phone displays:\n\n```\n400 × 400 pixels\n```\n\nbut your server sends:\n\n```\n4000 × 4000 pixels\n```\n\nYou're downloading much more data than necessary.\n\nA good image architecture often asks the server/CDN (**Content Delivery Network — a system of servers that delivers content closer to users**) for an appropriately sized version.\n\nFor example:\n\n```\nOriginal\n4000 × 4000\n     ↓\nFeed version\n600 × 600\n     ↓\nPhone\n```\n\n---",
      "diagram": "```\n                Remote Image\n                     │\n                     ▼\n                 Download\n                     │\n            ┌────────┴────────┐\n            │                 │\n            ▼                 ▼\n         Placeholder        Cache\n            │                 │\n            └────────┬────────┘\n                     ▼\n                  Display\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- `expo-image` is designed for modern image-heavy applications.\n- Images can be cached.\n- Placeholders improve the loading experience.\n- Avoid downloading unnecessarily large images.\n- Remote images and local images are different resources.\n- Image caching becomes especially important in scrolling feeds.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Loading huge original images everywhere\n\nUse appropriately sized versions when possible.\n\n### ❌ Ignoring loading states\n\nA blank area can make an app feel broken.\n\n### ❌ Forgetting image caching\n\nRepeated downloads can waste bandwidth.\n\n### ❌ Giving every image unlimited dimensions\n\nAlways think about the size the UI actually needs.\n\n---"
      ],
      "quiz": [
        {
          "question": "Why is image caching useful?",
          "options": [
            "A. It can reduce repeated downloads",
            "B. It makes images larger",
            "C. It deletes images",
            "D. It disables networking"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn13-2",
      "title": "Video and Audio Playback",
      "durationMinutes": 8,
      "explanation": "Images are relatively straightforward.\n\nVideo is more complicated.\n\nA video contains a lot more data:\n\n```\nImage:\n████████\n\nVideo:\n████████████████████████████████████████\n████████████████████████████████████████\n████████████████████████████████████████\n...\n```\n\nA video is essentially a sequence of visual frames combined with audio.\n\nThat's why video playback requires more specialized handling.\n\n---\n\n# `expo-av` and `expo-video`\n\nThe Expo ecosystem has provided media functionality through `expo-av`, while newer Expo projects use more focused packages such as:\n\n```\nexpo-video\n```\n\nfor video playback.\n\nThe important beginner concept isn't just memorizing package names.\n\nIt's understanding:\n\n> **Media playback is different from simply displaying a file.**\n\n---\n\n# Image vs video\n\nAn image might be:\n\n```\nURL\n↓\nDownload\n↓\nDisplay\n```\n\nA video player has to deal with:\n\n```\nVideo URL\n  ↓\nLoad media\n  ↓\nBuffer\n  ↓\nDecode\n  ↓\nDisplay frames\n  ↓\nPlay audio\n  ↓\nHandle pause/play\n  ↓\nHandle seeking\n```\n\n**Buffering** means loading enough media data ahead of playback so the video can continue playing smoothly.\n\n**Seeking** means jumping to a different point in the media.\n\nFor example:\n\n```\n0:00 ─────── 0:30 ─────── 1:00\n            ↑\n         seek here\n```\n\n---",
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
      "id": "rn13-3",
      "title": "Files on the Device with expo-file-system",
      "durationMinutes": 8,
      "explanation": "So far we've talked about displaying media.\n\nBut sometimes you need to actually work with files on the device.\n\nFor example:\n\n```\nDownload a PDF\nSave an image\nCreate a local file\nRead a downloaded document\nDelete an old file\nStore a temporary upload\n```\n\nThis is where:\n\n```\nexpo-file-system\n```\n\ncomes into the picture.\n\n---\n\n# What is a file?\n\nA file is simply a piece of data stored somewhere.\n\nExamples:\n\n```\nphoto.jpg\nvideo.mp4\ndocument.pdf\nvoice.m4a\n```\n\nYour application can interact with files stored in locations it has access to.\n\n---\n\n# Why would an app need files?\n\nImagine a document application.\n\nThe user taps:\n\n```\nDownload PDF\n```\n\nYour app could:\n\n```\nServer\n  ↓\nDownload\n  ↓\nDevice storage\n  ↓\nOpen later\n```\n\nNow the file exists locally.\n\n---\n\n# Local vs remote\n\nThis distinction is important.\n\n### Remote file\n\nThe file exists somewhere on the internet:\n\n```\nhttps://example.com/photo.jpg\n```\n\n### Local file\n\nThe file exists on the device:\n\n```\nDevice\n ↓\nApp-accessible storage\n ↓\nphoto.jpg\n```\n\n---\n\n# Reading a file\n\nConceptually:\n\n```\nLocal file\n   ↓\nRead\n   ↓\nData\n   ↓\nUse in application\n```\n\nYou might read a file to:\n\n- Upload it\n- Display it\n- Process it\n- Share it\n- Inspect its contents\n\n---\n\n# Temporary files\n\nSometimes you don't need to keep a file forever.\n\nFor example:\n\n```\nUser selects image\n     ↓\nTemporary file\n     ↓\nUpload\n     ↓\nUpload complete\n     ↓\nDelete temporary file\n```\n\nThis is a useful pattern because unnecessary files can consume storage.\n\n---\n\n# File size matters\n\nA 5 KB file is very different from:\n\n```\n500 MB video\n```\n\nWhen working with large files, you have to think about:\n\n```\nStorage\nMemory\nNetwork\nUpload time\nBattery\nBackground behavior\n```\n\n---",
      "diagram": "```\n               Remote File\n                   │\n                   ▼\n                Download\n                   │\n                   ▼\n             Device Storage\n                   │\n         ┌─────────┼─────────┐\n         │         │         │\n         ▼         ▼         ▼\n       Read      Upload     Delete\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- `expo-file-system` helps your app work with files on the device.\n- Remote files live somewhere else.\n- Local files live on the device.\n- Temporary files should often be removed when they're no longer needed.\n- Large files require special consideration.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Keeping every downloaded file forever\n\nStorage is limited.\n\n### ❌ Treating a 500 MB video like a tiny JSON response\n\nLarge files require different strategies.\n\n### ❌ Assuming every file path is permanent\n\nTemporary locations can have different lifecycles.\n\n---"
      ],
      "quiz": [
        {
          "question": "What is `expo-file-system` mainly useful for?",
          "options": [
            "A. Working with files stored on the device",
            "B. Creating navigation stacks",
            "C. Managing React state",
            "D. Drawing UI"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn13-4",
      "title": "Picking Images and Documents",
      "durationMinutes": 8,
      "explanation": "Most applications don't want users to manually type file paths.\n\nInstead, you give them a button:\n\n```\n┌──────────────────────────┐\n│     Choose a photo       │\n└──────────────────────────┘\n```\n\nThe user taps it.\n\nThe operating system opens a picker.\n\nThe user selects a file.\n\nYour application receives information about that file.\n\n---\n\n# `expo-image-picker`\n\n`expo-image-picker` is useful when you want users to select media such as:\n\n```\nPhotos\nVideos\nCamera images\n```\n\nA typical flow is:\n\n```\nTap \"Choose photo\"\n      ↓\nOpen picker\n      ↓\nUser chooses photo\n      ↓\nApp receives asset\n      ↓\nShow preview\n      ↓\nUpload\n```\n\n---\n\n# What is an asset?\n\nAn **asset** is a piece of media selected or referenced by your application.\n\nThe result may contain information such as:\n\n```\nURI\nWidth\nHeight\nFile type\nFile size\n```\n\nA **URI (Uniform Resource Identifier)** is a string that identifies a resource, such as the location of a file.\n\n---\n\n# `expo-document-picker`\n\nFor general files, you can use:\n\n```\nexpo-document-picker\n```\n\nFor example:\n\n```\nChoose document\n      ↓\nPDF\nDOCX\nTXT\nZIP\netc.\n```\n\nThis is different from an image picker because you're selecting general documents rather than specifically photos or media.\n\n---\n\n# Image picker vs document picker\n\n| Tool | Typical use |\n| --- | --- |\n| `expo-image-picker` | Photos and videos |\n| `expo-document-picker` | General files/documents |\n\n---\n\n# Example application flow\n\nImagine a profile screen:\n\n```\n┌──────────────────────────┐\n│       Profile            │\n│                          │\n│        [ Photo ]         │\n│                          │\n│    Change profile photo  │\n└──────────────────────────┘\n```\n\nThe user taps:\n\n```\nChange profile photo\n```\n\nThen:\n\n```\nImage Picker\n   ↓\nSelect photo\n   ↓\nPreview\n   ↓\nUpload\n   ↓\nServer\n```\n\n---\n\n# Don't upload immediately without thinking\n\nYou might want to validate the selected file first.\n\nFor example:\n\n```\nIs it actually an image?\nIs it too large?\nIs the format supported?\nDo we need to resize it?\n```\n\nThis prevents unnecessary uploads.\n\n---",
      "diagram": "```\n             User\n               │\n               ▼\n       \"Choose a file\"\n               │\n       ┌───────┴────────┐\n       │                │\n       ▼                ▼\nImage Picker      Document Picker\n       │                │\n       ▼                ▼\n    Photo            Document\n       │                │\n       └───────┬────────┘\n               ▼\n            Preview\n               │\n               ▼\n            Upload\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- `expo-image-picker` is useful for photos and videos.\n- `expo-document-picker` is useful for general documents.\n- A picker returns information about the selected asset/file.\n- Validate files before uploading them.\n- A good flow gives the user a preview before a potentially large upload.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Uploading files without checking size\n\nLarge uploads can be slow or expensive.\n\n### ❌ Assuming the selected file is always valid\n\nValidate type and size.\n\n### ❌ Forgetting the user can cancel\n\nThe user might open the picker and press **Cancel**.\n\n---"
      ],
      "quiz": [
        {
          "question": "Which tool would you normally use for selecting a PDF?",
          "options": [
            "A. `expo-document-picker`",
            "B. `expo-image-picker` only",
            "C. `expo-video`",
            "D. `expo-image`"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn13-5",
      "title": "Uploading Large Files",
      "durationMinutes": 10,
      "explanation": "Now we get to one of the more challenging parts of media development:\n\n> **Uploading large files reliably.**\n\nUploading this:\n\n```\nprofile.jpg\n2 MB\n```\n\nis relatively simple.\n\nUploading this:\n\n```\nvideo.mp4\n800 MB\n```\n\nis a very different problem.\n\n---\n\n# The basic upload\n\nThe simplest mental model is:\n\n```\nDevice\n  │\n  │ Upload file\n  ▼\nServer\n```\n\nBut what if the connection fails at 95%?\n\nYou don't want to necessarily start from zero.\n\nThat's where more advanced upload strategies become useful.\n\n---\n\n# Upload progress\n\nUsers want to know what's happening.\n\nInstead of:\n\n```\nUploading...\n```\n\nyou can show:\n\n```\nUploading video...\n\n████████████░░░░░░░░\n\n62%\n```\n\nThis is called **upload progress**.\n\n---\n\n# Why progress matters\n\nSuppose the upload takes:\n\n```\n2 minutes\n```\n\nWithout progress:\n\n```\nUploading...\n```\n\nThe user may think:\n\n> \"Is the app frozen?\"\n\nWith progress:\n\n```\n62%\n```\n\nthe user understands that the operation is continuing.\n\n---\n\n# Chunking\n\nOne technique for large uploads is **chunking**.\n\nChunking means splitting a large file into smaller pieces.\n\nInstead of:\n\n```\n800 MB\n```\n\nyou might conceptually upload:\n\n```\nChunk 1 → 10 MB\nChunk 2 → 10 MB\nChunk 3 → 10 MB\n...\nChunk 80 → 10 MB\n```\n\nThe server can then reconstruct the file.\n\n---\n\n# Why chunking helps\n\nImagine:\n\n```\n800 MB upload\n      ↓\nFails at 790 MB\n```\n\nWithout resumable upload support, you might have to restart.\n\nWith chunks:\n\n```\nChunk 1 ✓\nChunk 2 ✓\nChunk 3 ✓\n...\nChunk 79 ✓\nChunk 80 ✗\n```\n\nYou may only need to retry the failed chunk.\n\n---\n\n# Resumable uploads\n\nA **resumable upload** means an interrupted upload can continue rather than starting completely over.\n\nThink:\n\n```\nStart\n ↓\n30%\n ↓\nNetwork lost\n ↓\nApp reconnects\n ↓\nContinue from 30%\n```\n\nThis is especially valuable for large videos.\n\n---\n\n# Background uploads\n\nNow imagine:\n\n```\nUser starts upload\n     ↓\nUpload reaches 40%\n     ↓\nUser presses Home\n```\n\nWhat happens?\n\nMobile applications may be suspended or restricted while in the background.\n\nSo a normal JavaScript loop should not be treated as guaranteed to continue indefinitely.\n\nFor important uploads, you need a background-capable upload strategy supported by the platform and the APIs you're using.\n\n---\n\n# Background upload mental model\n\n```\n                Upload\n                  │\n                  ▼\n               40%\n                  │\n             App background\n                  │\n                  ▼\n          Background-capable\n             upload system\n                  │\n                  ▼\n               100%\n                  │\n                  ▼\n              Completed\n```\n\nThe exact implementation depends on the platform, Expo capabilities, and upload service.\n\nThe important lesson is:\n\n> **An upload that must survive backgrounding needs more than a normal in-memory JavaScript function.**\n\n---\n\n# Upload states\n\nYour upload should have explicit states.\n\nFor example:\n\n```\nidle\nuploading\npaused\nfailed\ncompleted\ncancelled\n```\n\nLet's imagine:\n\n```\nidle\n↓\nuploading\n↓\nbackgrounded\n↓\nuploading\n↓\ncompleted\n```\n\nOr:\n\n```\nidle\n↓\nuploading\n↓\nnetwork failure\n↓\nfailed\n↓\nretry\n↓\nuploading\n↓\ncompleted\n```\n\n---\n\n# Progress is not just UI\n\nThe progress value can also help your application understand where the upload is.\n\nFor example:\n\n```\nprogress = 0.45\n```\n\nmeans roughly:\n\n```\n45% complete\n```\n\nYou can use this to update:\n\n```\nProgress bar\nPercentage text\nCancel button\nStatus message\n```\n\n---",
      "diagram": "```\n             Large File\n                 │\n                 ▼\n              Chunking\n                 │\n       ┌─────────┼─────────┐\n       ▼         ▼         ▼\n    Chunk 1   Chunk 2   Chunk 3\n       │         │         │\n       └─────────┼─────────┘\n                 ▼\n               Server\n                 │\n                 ▼\n            File complete\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Large uploads need more planning than small uploads.\n- Progress helps users understand what's happening.\n- Chunking splits a large file into smaller pieces.\n- Resumable uploads can continue after interruptions.\n- Background uploads require platform-aware handling.\n- Upload state should be explicit.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Showing only \"Uploading...\"\n\nFor long uploads, show progress.\n\n### ❌ Assuming a JavaScript timer guarantees background execution\n\nThe operating system controls background execution.\n\n### ❌ Restarting an 800 MB upload after a tiny network failure\n\nConsider resumable or chunked uploads.\n\n### ❌ Keeping the entire large file in JavaScript memory\n\nWork with files through appropriate file APIs instead of unnecessarily loading huge binary data into memory.\n\n---"
      ],
      "quiz": [
        {
          "question": "Why is chunking useful?",
          "options": [
            "A. It can allow large uploads to be transferred in smaller pieces",
            "B. It makes the file disappear",
            "C. It prevents users from seeing progress",
            "D. It only works for text"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    },
    {
      "id": "rn13-6",
      "title": "Caching Images in a Scrolling Feed",
      "durationMinutes": 7,
      "explanation": "Now let's combine what we've learned.\n\nImagine a social media feed:\n\n```\n┌──────────────────────┐\n│ User A               │\n│ [        IMAGE     ] │\n│                      │\n│ Nice day!            │\n└──────────────────────┘\n\n┌──────────────────────┐\n│ User B               │\n│ [        IMAGE     ] │\n│                      │\n│ Amazing!             │\n└──────────────────────┘\n```\n\nThe user scrolls.\n\nMore images enter the screen.\n\nThis creates a media-loading problem.\n\n---\n\n# What shouldn't happen\n\nYou don't want:\n\n```\nScroll down\n  ↓\nDownload image\n\nScroll up\n  ↓\nDownload same image again\n\nScroll down\n  ↓\nDownload same image again\n```\n\nThat's wasteful.\n\n---\n\n# Better strategy\n\nUse multiple layers of optimization.\n\n```\nRemote image\n    ↓\nAppropriate image size\n    ↓\nImage cache\n    ↓\nPlaceholder\n    ↓\nDisplay\n```\n\n---\n\n# Cache repeated images\n\nSuppose:\n\n```\nProfile image URL:\nhttps://example.com/user123.jpg\n```\n\nThe first time:\n\n```\nNetwork\n↓\nDownload\n↓\nCache\n↓\nDisplay\n```\n\nLater:\n\n```\nCache\n↓\nDisplay\n```\n\nMuch faster.\n\n---\n\n# Don't cache forever\n\nCaching doesn't mean:\n\n> \"Keep every image forever.\"\n\nYou need to think about:\n\n```\nStorage size\nCache expiration\nImage updates\nAvailable disk space\n```\n\nA server may also provide caching information that your image-loading system can use.\n\n---\n\n# Feed image sizes\n\nA common mistake is loading the original image.\n\nSuppose:\n\n```\nOriginal:\n5000 × 5000\n```\n\nbut the feed only needs:\n\n```\n400 × 400\n```\n\nThe better architecture is:\n\n```\nOriginal image\n     ↓\nServer/CDN resizing\n     ↓\nFeed-sized image\n     ↓\nDevice cache\n     ↓\nScreen\n```\n\nThis reduces the amount of data transferred.\n\n---\n\n# Placeholder strategy\n\nYou can combine:\n\n```\nCached image\n```\n\nwith:\n\n```\nPlaceholder\n```\n\nSo the user experience becomes:\n\n```\nNo cache\n ↓\nPlaceholder\n ↓\nDownload\n ↓\nDisplay\n ↓\nCache\n```\n\nNext time:\n\n```\nCache\n ↓\nDisplay almost immediately\n```\n\n---\n\n# Image caching and lists\n\nThis is where Day 6 connects with Day 13.\n\nRemember list virtualization?\n\nA scrolling list doesn't need every item mounted at once.\n\nCombine that with image caching:\n\n```\nVirtualized List\n      +\nEfficient Image Loading\n      +\nImage Cache\n      =\nBetter Scrolling Feed\n```\n\n---",
      "diagram": "```\n                   Feed\n                    │\n                    ▼\n             Virtualized List\n                    │\n         ┌──────────┼──────────┐\n         │          │          │\n         ▼          ▼          ▼\n      Image A     Image B    Image C\n         │          │          │\n         └──────────┼──────────┘\n                    ▼\n               Image Cache\n                    │\n                    ▼\n                 Network\n```\n\n---",
      "codeExample": {
        "title": "Code Example",
        "code": ""
      },
      "keyTakeaways": [
        "- Image caching is extremely useful for scrolling feeds.\n- Don't repeatedly download the same image.\n- Request appropriately sized images.\n- Use placeholders while images load.\n- Combine efficient lists with efficient image loading.\n- Don't assume a cache should grow forever.\n\n---"
      ],
      "commonMistakes": [
        "### ❌ Downloading original-resolution images\n\nThe feed may only need a small version.\n\n### ❌ Ignoring caching\n\nThis can create unnecessary network traffic.\n\n### ❌ Loading every feed image immediately\n\nLet the list and image system load what is actually needed.\n\n---"
      ],
      "quiz": [
        {
          "question": "What's a good strategy for images in a scrolling feed?",
          "options": [
            "A. Proper sizing + caching + placeholders",
            "B. Download every original image immediately",
            "C. Disable all caching",
            "D. Load every image at full resolution"
          ],
          "correctIndex": 0,
          "explanation": "**Answer:** A"
        }
      ]
    }
  ],
  "finalQuiz": [
    {
      "question": "Why is `expo-image` useful?",
      "options": [
        "A. It provides more advanced image loading and caching capabilities",
        "B. It creates navigation routes",
        "C. It stores authentication tokens",
        "D. It manages WebSockets"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is a placeholder?",
      "options": [
        "A. Temporary content shown while the real content loads",
        "B. A database",
        "C. A server",
        "D. A navigation route"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What does `expo-file-system` help you work with?",
      "options": [
        "A. Files on the device",
        "B. React navigation",
        "C. CSS styles",
        "D. WebSocket messages"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Which package is commonly used to let a user select photos or videos?",
      "options": [
        "A. `expo-image-picker`",
        "B. `expo-video`",
        "C. `expo-file-system`",
        "D. `expo-router`"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why is chunking useful for large uploads?",
      "options": [
        "A. It breaks a large file into smaller pieces that can be uploaded separately",
        "B. It deletes the file",
        "C. It prevents uploads",
        "D. It makes the file invisible"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why should a large upload consider background behavior?",
      "options": [
        "A. The operating system can restrict or suspend app activity when backgrounded",
        "B. Backgrounding always deletes the file",
        "C. Uploads only work in dark mode",
        "D. Images cannot be uploaded from mobile devices"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why is image caching useful?",
      "options": [
        "A. It can reduce repeated downloads",
        "B. It makes images larger",
        "C. It deletes images",
        "D. It disables networking"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "What is `expo-file-system` mainly useful for?",
      "options": [
        "A. Working with files stored on the device",
        "B. Creating navigation stacks",
        "C. Managing React state",
        "D. Drawing UI"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Which tool would you normally use for selecting a PDF?",
      "options": [
        "A. `expo-document-picker`",
        "B. `expo-image-picker` only",
        "C. `expo-video`",
        "D. `expo-image`"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    },
    {
      "question": "Why is chunking useful?",
      "options": [
        "A. It can allow large uploads to be transferred in smaller pieces",
        "B. It makes the file disappear",
        "C. It prevents users from seeing progress",
        "D. It only works for text"
      ],
      "correctIndex": 0,
      "explanation": "**Answer:** A"
    }
  ],
  "project": {
    "name": "🧠 Self-Check — Image Upload That Survives Backgrounding",
    "goal": "Complete the Day 13 self-check project.",
    "brief": "Now let's build the feature that brings today's lesson together.\n\nYour challenge:\n\n> **Build an image upload flow with a progress bar that survives the app being backgrounded during the upload.**\n\n---\n\n# Step 1 — Pick an image\n\nStart with:\n\n```\n┌────────────────────────────┐\n│                            │\n│     Choose an image        │\n│                            │\n└────────────────────────────┘\n```\n\nThe user taps the button.\n\nUse:\n\n```\nexpo-image-picker\n```\n\nThe picker returns information about the selected image.\n\n---\n\n# Step 2 — Show a preview\n\nDon't immediately upload without showing the user what they selected.\n\nFor example:\n\n```\n┌────────────────────────────┐\n│                            │\n│       Selected Photo       │\n│                            │\n└────────────────────────────┘\n\n      [ Upload ]\n```\n\nThis also gives you a chance to validate the file.\n\n---\n\n# Step 3 — Validate\n\nBefore uploading, check things such as:\n\n```\nIs there a file?\nIs it an image?\nIs the size acceptable?\nIs the format supported?\n```\n\nFor example:\n\n```\nImage\n2.4 MB\nJPEG\n✓ Supported\n```\n\n---\n\n# Step 4 — Start the upload\n\nNow:\n\n```\nTap Upload\n    ↓\nUpload begins\n    ↓\nProgress = 0%\n```\n\nThen:\n\n```\nUploading...\n\n████░░░░░░░░░░░░░░\n20%\n```\n\nThen:\n\n```\n██████████░░░░░░░░\n55%\n```\n\nThen:\n\n```\n██████████████████\n100%\n```\n\n---\n\n# Step 5 — Background the application\n\nThis is the important part.\n\nAt:\n\n```\n62%\n```\n\npress the Home button or otherwise background the application.\n\nYour goal is for the upload workflow to remain correct rather than simply disappearing.\n\nThink about:\n\n```\nUpload state\n   ↓\nBackground\n   ↓\nOperating system may suspend app\n   ↓\nBackground-capable upload mechanism\n   ↓\nUpload continues or resumes\n   ↓\nApp returns\n   ↓\nShow correct progress/state\n```\n\n---\n\n# Step 6 — Return to the application\n\nWhen the user returns, the UI should not incorrectly say:\n\n```\n0%\n```\n\nif the upload actually continued.\n\nInstead, the app should recover the upload's current state.\n\nFor example:\n\n```\nUploading...\n\n██████████████░░░░\n76%\n```\n\nOr:\n\n```\nUpload complete ✓\n```\n\n---\n\n# Step 7 — Handle failure\n\nNow test:\n\n```\nStart upload\n    ↓\nDisable network\n    ↓\nUpload fails\n```\n\nYour UI should communicate the situation.\n\nFor example:\n\n```\nUpload interrupted.\n\n[ Retry ]\n```\n\nIf the upload mechanism supports resuming:\n\n```\nUpload interrupted at 62%.\n\n[ Resume ]\n```\n\n---\n\n# Step 8 — Handle success\n\nFinally:\n\n```\nUpload complete ✓\n```\n\nYou can then show:\n\n```\nPhoto uploaded successfully.\n```\n\n---\n\n# Your Expected State Machine\n\nYour upload can be thought of as:\n\n```\n                ┌─────────────┐\n                │     Idle    │\n                └──────┬──────┘\n                       │\n                    Select\n                       │\n                       ▼\n                ┌─────────────┐\n                │   Uploading │\n                └──────┬──────┘\n                       │\n            ┌──────────┼──────────┐\n            │          │          │\n            ▼          ▼          ▼\n        Background   Failure    Success\n            │          │          │\n            │          ▼          ▼\n            │        Retry      Complete\n            │          │\n            └──────────┘\n```\n\nThe important thing is that **backgrounding is not necessarily the same as failure**.\n\n---",
    "steps": [],
    "acceptance": [],
    "footer": "# 🏆 Day 13 Final Mental Model\n\nBy the end of today, you should understand the complete media pipeline:\n\n```\n                    MEDIA\n                      │\n      ┌───────────────┼────────────────┐\n      │               │                │\n      ▼               ▼                ▼\n    Images          Video             Files\n      │               │                │\n      ▼               ▼                ▼\nexpo-image        expo-video     expo-file-system\n      │\n      ▼\n   Caching\n      │\n      ▼\n  Scrolling feed\n```\n\nFor user-selected files:\n\n```\nUser\n↓\nPicker\n↓\nImage/document\n↓\nValidate\n↓\nPreview\n↓\nUpload\n↓\nProgress\n↓\nBackground/resume\n↓\nComplete\n```\n\nAnd for large files:\n\n```\nLarge file\n   ↓\nChunking\n   ↓\nUpload\n   ↓\nProgress\n   ↓\nPossible interruption\n   ↓\nResume/retry\n   ↓\nComplete\n```\n\n---\n\n# 🎯 What You Should Be Able to Explain After Day 13\n\nYou should now be comfortable explaining these relationships:\n\n```\nexpo-image\n   ↓\nEfficient image display\n   ↓\nCaching + placeholders\n```\n\n```\nexpo-video\n   ↓\nVideo playback\n   ↓\nLoading + buffering + controls\n```\n\n```\nexpo-file-system\n   ↓\nLocal files\n   ↓\nRead + write + manage\n```\n\n```\nexpo-image-picker\n   ↓\nPhotos/videos selected by user\n```\n\n```\nexpo-document-picker\n   ↓\nGeneral documents/files\n```\n\nAnd most importantly:\n\n```\nLarge upload\n    ↓\nProgress\n    ↓\nPossible network interruption\n    ↓\nBackground handling\n    ↓\nResume/retry\n    ↓\nCompletion\n```\n\nThe big lesson from today is that **media is not just about displaying an image**.\n\nA production mobile app has to think about the entire lifecycle:"
  }
});

