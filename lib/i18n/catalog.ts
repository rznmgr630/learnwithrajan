import type { Locale } from "@/lib/i18n/types";

/** Flat UI dictionary: English · Nepali · Japanese (UI chrome). */
export const UI_STRINGS = {
  "nav.learningHub": {
    en: "Learning hub",
    np: "सिकाइ केन्द्र",
    jp: "学習ハブ",
  },
  "nav.language": {
    en: "Language",
    np: "भाषा",
    jp: "言語",
  },
  "site.title": {
    en: "Learn with Rajan",
    np: "राजनसँग सिकौँ",
    jp: "Learn with Rajan",
  },
  "footer.creditBeforeHeart": {
    en: "Made with ",
    np: "मायासँग ",
    jp: "",
  },
  "footer.creditAfterHeart": {
    en: "by ",
    np: "बनाइएको ",
    jp: "を込めて作成 · ",
  },
  "footer.authorName": {
    en: "Rajan",
    np: "राजन",
    jp: "Rajan",
  },
  "footer.creditAria": {
    en: "Made with love by Rajan",
    np: "मायासँग बनाइएको राजन",
    jp: "想いを込めて作成 Rajan",
  },
  "learn.title": {
    en: "My learning",
    np: "मेरो सिकाइ",
    jp: "学習一覧",
  },
  "learn.subtitle": {
    en: "Choose Programming or Language, then open a track for the full syllabus. More topics will appear as they go live.",
    np: "प्रोग्रामिङ वा भाषा छान्नुहोस्, अनि पूरा पाठ्यक्रमका लागि ट्र्याक खोल्नुहोस्। नयाँ विषयहरू थपिँदै जाँदा यहाँ थप देखिनेछ।",
    jp: "プログラミングか言語を選び、トラックで全体のシラバスを開きます。新しいトピックは順次追加します。",
  },
  "hub.backend.title": {
    en: "Backend in 30 days",
    np: "३० दिनमा ब्याकएन्ड",
    jp: "30日でバックエンド",
  },
  "hub.backend.subtitle": {
    en: "Advanced roadmap · weeks & day cards",
    np: "उन्नत रोडम्याप · हप्ता र दिन कार्ड",
    jp: "発展向けロードマップ · 週と日のカード",
  },
  "hub.backend.progress": {
    en: "Progress",
    np: "प्रगति",
    jp: "進捗",
  },
  "hub.backend.days": {
    en: "days",
    np: "दिन",
    jp: "日",
  },
  "hub.backend.cta": {
    en: "Open roadmap →",
    np: "रोडम्याप खोल्नुहोस् →",
    jp: "ロードマップを開く →",
  },
  "hub.git.title": {
    en: "Git in 7 days",
    np: "७ दिनमा Git",
    jp: "7日でGit",
  },
  "hub.git.subtitle": {
    en: "Basics in 2 days · branching, remotes, worktrees & team flow · diagrams in each lesson",
    np: "२ दिन आधार · ब्रान्च, रिमोट, worktree, टोली प्रवाह · प्रत्येक पाठमा चित्र",
    jp: "2日で基礎 · ブランチ・リモート・worktree・チーム運用 · 各日に図解",
  },
  "hub.sectionProgramming": {
    en: "Programming",
    np: "प्रोग्रामिङ",
    jp: "プログラミング",
  },
  "hub.sectionProgrammingHint": {
    en: "Engineering roadmaps",
    np: "इन्जिनियरिङ रोडम्याप",
    jp: "エンジニア向けロードマップ",
  },
  "hub.sectionLanguage": {
    en: "Language",
    np: "भाषा",
    jp: "言語",
  },
  "hub.sectionLanguageHint": {
    en: "Japanese JLPT tracks",
    np: "जापानी JLPT ट्र्याक",
    jp: "日本語・JLPTトラック",
  },
  "hub.category.cta": {
    en: "Browse →",
    np: "हेर्नुहोस् →",
    jp: "見る →",
  },
  "hub.japanese.title": {
    en: "Japanese · JLPT N5",
    np: "जापानी · JLPT N5",
    jp: "日本語 · JLPT N5",
  },
  "hub.japanese.subtitle": {
    en: "Minna no Nihongo I · 30-day syllabus · JLPT N4 later",
    np: "みんなの日本語 I · ३०-दिने पाठ्यक्रम · पछि JLPT N4",
    jp: "みんなの日本語 初級I · 30日シラバス · 将来的に N4",
  },
  "learn.back": {
    en: "← Learning hub",
    np: "← सिकाइ केन्द्र",
    jp: "← 学習ハブ",
  },
  "learn.backProgramming": {
    en: "← Programming",
    np: "← प्रोग्रामिङ",
    jp: "← プログラミング",
  },
  "learn.backLanguage": {
    en: "← Language",
    np: "← भाषा",
    jp: "← 言語",
  },
  "backendRoadmap.title": {
    en: "Backend in 30 days",
    np: "३० दिनमा ब्याकएन्ड",
    jp: "30日でバックエンド",
  },
  "backendRoadmap.subtitle": {
    en: "Advanced backend engineering roadmap",
    np: "उन्नत ब्याकएन्ड इन्जिनियरिङ रोडम्याप",
    jp: "発展向けバックエンド工学ロードマップ",
  },
  "backendRoadmap.overallProgress": {
    en: "Overall progress",
    np: "समग्र प्रगति",
    jp: "全体の進捗",
  },
  "backendRoadmap.percentComplete": {
    en: "% complete",
    np: "% पूरा",
    jp: "% 完了",
  },
  "backendRoadmap.bottomBlurb": {
    en: "Here's your full 30-day advanced backend engineering roadmap — fully interactive. Tick days as you finish them; progress syncs in this browser. Tweak the default seed via CURRENT_DAY in lib/challenge-data.ts. Click a day card (not the checkbox) to read the detail panel.",
    np: "यहाँ तपाईंको पूरा ३०-दिने उन्नत ब्याकएन्ड इन्जिनियरिङ रोडम्याप छ — पूर्ण इन्टरएक्टिभ। दिन सकिएजस्तै टिक लगाउनुहोस्; प्रगति यस ब्राउजरमा बचत हुन्छ। पूर्वनिर्धारित सिड समायोजन गर्न lib/challenge-data.ts मा CURRENT_DAY बदल्नुहोस्। विवरण प्यानल पढ्न दिन कार्ड क्लिक गर्नुहोस् (चेकबक्स होइन)।",
    jp: "30日分の発展向けバックエンド工学ロードマップです（インタラクティブ）。終わった日にチェックを入れると進捗がこのブラウザに保存されます。既定のシードは lib/challenge-data.ts の CURRENT_DAY で調整できます。詳細パネルはチェックボックスではなく日カードをクリックしてください。",
  },
  "backendRoadmap.doneSlash": {
    en: "done",
    np: "पूरा",
    jp: "完了",
  },
  "gitRoadmap.title": {
    en: "Git in 7 days",
    np: "७ दिनमा Git",
    jp: "7日でGit",
  },
  "gitRoadmap.subtitle": {
    en: "From first commit to pull requests — local basics, then advanced workflows",
    np: "पहिलो commit देखि PR सम्म — स्थानिक आधार, अनि उन्नत कार्यप्रवाह",
    jp: "最初のコミットからPRまで — ローカル基礎から応用の流れへ",
  },
  "gitRoadmap.overallProgress": {
    en: "Overall progress",
    np: "समग्र प्रगति",
    jp: "全体の進捗",
  },
  "gitRoadmap.percentComplete": {
    en: "% complete",
    np: "% पूरा",
    jp: "% 完了",
  },
  "gitRoadmap.bottomBlurb": {
    en: "Seven focused days: days 1–2 cover the three-state model and reading history; days 3–7 add branching, remotes, rebase vs merge, stash/reset safety, `git worktree` for parallel checkouts, and team PR flow. Tick days as you finish; progress saves in this browser. Open a day card for localized notes, commands, tables, and SVG diagrams. Below the Advanced week you will find a visual cheatsheet with before/after pictures for common commands (e.g. `git init` adding `.git`). Adjust the seeded progress via GIT_CURRENT_DAY in lib/git-learning/git-challenge-data.ts.",
    np: "सात केन्द्रित दिन: १–२ मा तीन अवस्था र इतिहास; ३–७ मा ब्रान्च, रिमोट, rebase/merge, stash/reset, `git worktree`, र PR। उन्नत हप्ता मुनि दृश्य चिटशीट छ — सामान्य आदेशका अघि/पछि चित्र (जस्तै `git init` ले `.git` थप्छ)।",
    jp: "7日構成: 1〜2日目は3状態と履歴、3〜7日目はブランチ・リモート・rebase/merge・stash/reset・`git worktree`・PR運用。応用週の下に、よく使うコマンドの「前→後」イラスト付きビジュアルチートシートがあります（例: `git init` で `.git` ができる）。シードは lib/git-learning/git-challenge-data.ts の GIT_CURRENT_DAY で変更できます。",
  },
  "jpRoadmap.title": {
    en: "Japanese · JLPT N5 in 30 days",
    np: "३० दिनमा जापानी · JLPT N5",
    jp: "30日で日本語 · JLPT N5",
  },
  "jpRoadmap.subtitle": {
    en: "Built around Minna no Nihongo I Lessons 1–25 · conversation · particles · grammar · kanji · MCQ · listening cues",
    np: "みんなの日本語 初級I को पाठ १–२५ वरिपरि · संवाद · जुड्ने शब्द · व्याकरण · कांजी · बहुविकल्प · सुन्ने संकेत",
    jp: "『みんなの日本語 初級I』第1–25課を軸に · 会話 · 助詞 · 文法 · 漢字 · MCQ · 聴解のヒント",
  },
  "jpRoadmap.overallProgress": {
    en: "Overall progress",
    np: "समग्र प्रगति",
    jp: "全体の進捗",
  },
  "jpRoadmap.days": {
    en: "days",
    np: "दिन",
    jp: "日",
  },
  "jpRoadmap.doneSlash": {
    en: "done",
    np: "पूरा",
    jp: "完了",
  },
  "jpRoadmap.percentComplete": {
    en: "% complete",
    np: "% पूरा",
    jp: "% 完了",
  },
  "jpRoadmap.weeklyTestsProgress": {
    en: "Weekly tests + full mock:",
    np: "साप्ताहिक परीक्षा र पूर्ण मॉक:",
    jp: "ウィークリーテストと総合模試:",
  },
  "jpRoadmap.markedDone": {
    en: "marked done",
    np: "पूरा चिनो भएको",
    jp: "完了として記録",
  },
  "jpRoadmap.dayPrefix": {
    en: "Day",
    np: "दिन",
    jp: "Day",
  },
  "jpRoadmap.weeklyRecapLabel": {
    en: "Weekly recap · JLPT-style unit test",
    np: "साप्ताहिक पुनरावलोकन · JLPT-शैलीको युनिट टेस्ट",
    jp: "週の復習 · JLPT形式のユニットテスト",
  },
  "jpRoadmap.fivePapersBlurb": {
    en: "Five papers (Test 1–5), 20 MCQs each · vocab · kanji · grammar · reading · listening (embedded clip + links) · submit to score",
    np: "पाँच वटा पेपर (टेस्ट १–५), प्रत्येकमा २० बहुविकल्प · शब्दभण्डार · कांजी · व्याकरण · पढाइ · सुन्ने (इम्बेड क्लिप + लिंक) · स्कोरका लागि पेश गर्नुहोस्",
    jp: "5枚のペーパー（テスト1〜5）、各20問のMCQ · 語彙 · 漢字 · 文法 · 読解 · 聴解（埋め込み＋リンク） · 採点は提出後",
  },
  "jpRoadmap.singlePaperBlurb": {
    en: "Covers Days {from}–{to} · vocab · grammar · reading · listening · submit to score",
    np: "दिन {from}–{to} समेट्छ · शब्द · व्याकरण · पढाइ · सुन्ने · स्कोरका लागि पेश गर्नुहोस्",
    jp: "Day {from}–{to} をカバー · 語彙 · 文法 · 読解 · 聴解 · 採点は提出後",
  },
  "jpRoadmap.done": {
    en: "Done",
    np: "पूरा",
    jp: "完了",
  },
  "jpRoadmap.openUnitTest": {
    en: "Open unit test",
    np: "युनिट टेस्ट खोल्नुहोस्",
    jp: "ユニットテストを開く",
  },
  "jpRoadmap.courseFinale": {
    en: "Course finale · JLPT format",
    np: "पाठ्यक्रम अन्त्य · JLPT ढाँचा",
    jp: "総仕上げ · JLPT形式",
  },
  "jpRoadmap.fullMockBlurb": {
    en: "One paper covering Days {from}–{to} · language knowledge (script/vocab) · grammar · reading · listening · embedded listening clip · submit to score",
    np: "दिन {from}–{to} समेट्ने एक पेपर · भाषा ज्ञान · व्याकरण · पढाइ · सुन्ने · इम्बेड सुन्ने क्लिप · स्कोरका लागि पेश गर्नुहोस्",
    jp: "Day {from}–{to} の一枚 · 言語知識 · 文法 · 読解 · 聴解 · 埋め込み聴解 · 採点は提出後",
  },
  "jpRoadmap.openFullMock": {
    en: "Open full mock exam",
    np: "पूर्ण मॉक परीक्षा खोल्नुहोस्",
    jp: "総合模試を開く",
  },
  "jpRoadmap.bottomBlurb": {
    en: 'Tick days as you finish them — progress stays in this browser. Each lesson mirrors "みんなの日本語" chapter order with conversation, particle drills, grammar tables, kanji cards, MCQs, and listening tasks (pair with your textbook audio). After each week, use the weekly JLPT-style unit test; at the end of the course, open the full mock exam (same submit-to-score flow). Coming later: JLPT N4 track using the same layout.',
    np: "दिनहरू सकिएजस्तै टिक लगाउनुहोस् — प्रगति यस ब्राउजरमै रहन्छ। प्रत्येक पाठले मिन्नाको अध्याय क्रम अनुसार संवाद, जुड्ने शब्द अभ्यास, व्याकरण तालिका, कांजी कार्ड, बहुविकल्प र सुन्ने कार्य समेट्छ (पाठ्यपुस्तक अडियोसँग जोड्नुहोस्)। प्रत्येक हप्तापछि JLPT-शैलीको साप्ताहिक टेस्ट प्रयोग गर्नुहोस्; अन्त्यमा पूर्ण मॉक खोल्नुहोस् (उही पेश-स्कोर प्रवाह)। आउँदै: उही लेआउटमा JLPT N4 ट्र्याक।",
    jp: "終わった日にチェックを入れると進捗がこのブラウザに保存されます。各レッスンは『みんなの日本語』の順に沿って会話・助詞ドリル・文法表・漢字・MCQ・聴解タスクを含みます（教科書の音声とセットで）。各週末は JLPT 形式のウィークリーテスト、最後は総合模試（同じ提出→採点の流れ）。今後同じレイアウトで N4 トラックも予定です。",
  },
  "weeklyPanel.tagWeekly": {
    en: " · Weekly unit test",
    np: " · साप्ताहिक युनिट टेस्ट",
    jp: " · ウィークリーユニットテスト",
  },
  "weeklyPanel.tagFullMock": {
    en: " · JLPT N5 full mock",
    np: " · JLPT N5 पूर्ण मॉक",
    jp: " · JLPT N5 総合模試",
  },
  "weeklyPanel.skillsLine": {
    en: "JLPT N5-style · vocab · grammar · reading · listening",
    np: "JLPT N5 शैली · शब्द · व्याकरण · पढाइ · सुन्ने",
    jp: "JLPT N5形式 · 語彙 · 文法 · 読解 · 聴解",
  },
  "weeklyPanel.daysRange": {
    en: "Days",
    np: "दिन",
    jp: "Day",
  },
  "weeklyPanel.paperProgress": {
    en: "· Paper",
    np: "· पेपर",
    jp: "· ペーパー",
  },
  "weeklyPanel.result": {
    en: "Result ·",
    np: "नतिजा ·",
    jp: "結果 ·",
  },
  "weeklyPanel.correct": {
    en: "correct",
    np: "सही",
    jp: "正解",
  },
  "weeklyPanel.scoreNote": {
    en: "Score counts multiple-choice items only. Short answers are for practice — compare with the model.",
    np: "स्कोरमा मात्र बहुविकल्प गणना हुन्छ। छोटो उत्तर अभ्यासका लागि हो — नमूना उत्तरसँग तुलना गर्नुहोस्।",
    jp: "採点は選択式のみです。記述は練習用で、モデル解答と見比べてください。",
  },
  "weeklyPanel.introHint": {
    en: "Choose an option for each question, then submit. Correct answers and explanations appear only after you submit.",
    np: "प्रत्येक प्रश्नमा विकल्प छानेर पेश गर्नुहोस्। सही उत्तर र व्याख्या पेश गरेपछि मात्र देखिन्छ।",
    jp: "各問で選択してから提出してください。正答と解説は提出後にのみ表示されます。",
  },
  "weeklyPanel.noteHeading": {
    en: "Note",
    np: "टिप्पणी",
    jp: "メモ",
  },
  "weeklyPanel.submit": {
    en: "Submit answers",
    np: "उत्तर पेश गर्नुहोस्",
    jp: "回答を提出",
  },
  "weeklyPanel.repeat": {
    en: "Repeat this paper",
    np: "यो पेपर दोहोर्याउनुहोस्",
    jp: "このペーパーをやり直す",
  },
  "weeklyPanel.markDone": {
    en: "Mark weekly test as completed",
    np: "साप्ताहिक टेस्ट पूरा भएको चिनो लगाउनुहोस्",
    jp: "ウィークリーテストを完了にする",
  },
  "weeklyPanel.markNotDone": {
    en: "Mark weekly test as not completed",
    np: "साप्ताहिक टेस्ट पूरा नभएको चिनो लगाउनुहोस्",
    jp: "ウィークリーテストの完了を外す",
  },
  "weeklyPanel.markMockDone": {
    en: "Mark full mock as completed",
    np: "पूर्ण मॉक पूरा भएको चिनो लगाउनुहोस्",
    jp: "総合模試を完了にする",
  },
  "weeklyPanel.markMockNotDone": {
    en: "Mark full mock as not completed",
    np: "पूर्ण मॉक पूरा नभएको चिनो लगाउनुहोस्",
    jp: "総合模試の完了を外す",
  },
  "weeklyPanel.close": {
    en: "Close",
    np: "बन्द गर्नुहोस्",
    jp: "閉じる",
  },
  "weeklyPanel.listeningPrep": {
    en: "Listening · prep",
    np: "सुन्ने · तयारी",
    jp: "聴解 · 準備",
  },
  "weeklyPanel.task": {
    en: "Task",
    np: "कार्य",
    jp: "タスク",
  },
  "weeklyPanel.embedClip": {
    en: "Short clip (embedded)",
    np: "छोटो क्लिप (इम्बेड)",
    jp: "短いクリップ（埋め込み）",
  },
  "weeklyPanel.moreListening": {
    en: "More listening (links)",
    np: "थप सुन्ने (लिंकहरू)",
    jp: "追加の聴解（リンク）",
  },
  "weeklyPanel.yourAnswer": {
    en: "Your answer",
    np: "तपाईंको उत्तर",
    jp: "あなたの答え",
  },
  "weeklyPanel.emptyAnswer": {
    en: "— (empty)",
    np: "— (खाली)",
    jp: "—（未入力）",
  },
  "weeklyPanel.modelAnswer": {
    en: "Model answer",
    np: "नमूना उत्तर",
    jp: "模範解答",
  },
  "weeklyPanel.placeholderShort": {
    en: "Write your answer here…",
    np: "यहाँ उत्तर लेख्नुहोस्…",
    jp: "ここに答えを書く…",
  },
  "weeklyPanel.noOption": {
    en: "No option selected — counted as incorrect.",
    np: "कुनै विकल्प छानिएन — गलत गणना हुन्छ।",
    jp: "未選択は不正解として計算されます。",
  },
  "weeklyPanel.correctShort": {
    en: "Correct.",
    np: "सही।",
    jp: "正解です。",
  },
  "weeklyPanel.incorrectShort": {
    en: "Incorrect — your choice was {yours}; correct is {correct}.",
    np: "गलत — तपाईंको छनोट {yours}; सही {correct}।",
    jp: "不正解 — 選択は{yours}、正解は{correct}。",
  },
  "hero.badge": {
    en: "Public learning log",
    np: "सार्वजनिक सिकाइ लग",
    jp: "公開ラーニングログ",
  },
  "hero.title": {
    en: "I'm sharing what I build as I learn backend engineering.",
    np: "म ब्याकएन्ड इन्जिनियरिङ सिक्दै जाँदा के बनाउँछु त्यो साझा गर्दैछु।",
    jp: "バックエンドを学びながら作っているものを共有しています。",
  },
  "hero.body": {
    en: "Right now: a structured",
    np: "अहिले: संरचित",
    jp: "現在：体系的な",
  },
  "hero.bodyMid": {
    en: "30-day backend challenge",
    np: "३०-दिने ब्याकएन्ड चुनौती",
    jp: "30日間のバックエンドチャレンジ",
  },
  "hero.bodyEnd": {
    en: "— open the hub for the full interactive roadmap.",
    np: "— पूर्ण इन्टरएक्टिभ रोडम्यापका लागि हब खोल्नुहोस्।",
    jp: "— ハブからインタラクティブなロードマップ全体を開けます。",
  },
  "hero.challengeDay": {
    en: "Challenge day",
    np: "चुनौतीको दिन",
    jp: "チャレンジ日",
  },
  "hero.progressSeed": {
    en: "Progress (from code seed)",
    np: "प्रगति (कोड सिडबाट)",
    jp: "進捗（コード上のシード）",
  },
  "hero.todayTheme": {
    en: "Today's theme",
    np: "आजको विषय",
    jp: "今日のテーマ",
  },
  "hero.cta": {
    en: "View the full syllabus",
    np: "पूरा पाठ्यक्रम हेर्नुहोस्",
    jp: "シラバス全体を見る",
  },
  "japaneseDay.trackLabel": {
    en: "JLPT N5 · Minna no Nihongo I track",
    np: "JLPT N5 · मिन्ना नो निहोन्गो I ट्र्याक",
    jp: "JLPT N5 · 『みんなの日本語』初級Iトラック",
  },
  "backendDetail.selfCheckHeading": {
    en: "Self-check questions",
    np: "आत्मजाँच प्रश्नहरू",
    jp: "セルフチェック問題",
  },
  "backendDetail.selfCheckHint": {
    en: "All collapsed by default — click a question to reveal its answer; click again to hide it. You can keep several open at once.",
    np: "पूर्वनिर्धारित रूपमा सबै संक्षिप्त छन् — जवाफ देखाउन प्रश्नमा क्लिक गर्नुहोस्; लुकाउन फेरि क्लिक गर्नुहोस्। एकैचोटि धेरै खोलिराख्न सक्नुहुन्छ।",
    jp: "初期状態ではすべて閉じています。質問をクリックすると答えが開き、もう一度クリックで閉じます。複数開いたままにできます。",
  },
  "gitRoadmap.cheatsheetHeading": {
    en: "Visual cheatsheet",
    np: "दृश्य चिटशीट",
    jp: "ビジュアルチートシート",
  },
  "gitRoadmap.cheatsheetIntro": {
    en: "Each card shows a before → after sketch for one command (for example `git init`: a normal project folder, then the same folder with a hidden `.git` directory that stores your repository). Command names stay in English; explanations follow your UI language.",
    np: "प्रत्येक कार्डले एउटा आदेशको अघि → पछि रेखाचित्र देखाउँछ (उदाहरण `git init`: साधारण फोल्डर, अनि लुकेको `.git` सहित)। आदेश अङ्ग्रेजीमा; व्याख्या UI भाषामा।",
    jp: "各カードは「変更前 → 変更後」のイラストです（例: `git init` は普通のフォルダの次に、隠れた `.git` が付いてリポジトリになる）。コマンド表記は英語、説明は UI 言語です。",
  },
  "gitRoadmap.cheatsheetLegend": {
    en: "Figures are schematic — your real filenames, branches, and remotes will differ.",
    np: "चित्रहरू स्किमेटिक हुन् — वास्तविक नाम फरक हुन सक्छ।",
    jp: "図は模式図です。実際のファイル名やブランチは環境によります。",
  },
  "gitRoadmap.cheatsheetBefore": {
    en: "Before",
    np: "अघि",
    jp: "前",
  },
  "gitRoadmap.cheatsheetAfter": {
    en: "After",
    np: "पछि",
    jp: "後",
  },
  "gitDetail.selfCheckHint": {
    en: "All collapsed by default — click a question to reveal its answer; click again to hide it. You can keep several open at once. Prompts match the Git day you opened (command names stay in English).",
    np: "पूर्वनिर्धारित रूपमा सबै संक्षिप्त — प्रश्नमा क्लिक गर्दा जवाफ खुल्छ; फेरि क्लिक गर्दा बन्द हुन्छ। धेरै एकैचोटि खोल्न मिल्छ। प्रश्नहरू खुलेको Git दिनसँग मेल खान्छन् (आदेश अङ्ग्रेजीमा)।",
    jp: "初期状態ではすべて閉じています。クリックで答えが開き、もう一度で閉じます。複数開いたままにできます。内容は開いた Git の日に対応しています（コマンド表記は英語のまま）。",
  },
  "jpDetail.overviewHeading": {
    en: "Overview",
    np: "अवलोकन",
    jp: "概要",
  },
  "jpDetail.practiceChecklist": {
    en: "Practice checklist",
    np: "अभ्यास सूची",
    jp: "練習チェックリスト",
  },
  "jpDetail.markDayDone": {
    en: "Mark day as done",
    np: "दिन पूरा भएको चिनो लगाउनुहोस्",
    jp: "この日を完了にする",
  },
  "jpDetail.markDayNotDone": {
    en: "Mark as not done",
    np: "पूरा नभएको चिनो लगाउनुहोस्",
    jp: "完了を外す",
  },
  "jpDetail.mcqCorrectLabel": {
    en: "Correct:",
    np: "सही:",
    jp: "正解:",
  },
  "jpDetail.listeningYoutubeHeading": {
    en: "YouTube (chapter-aligned)",
    np: "YouTube (अध्याय अनुकूल)",
    jp: "YouTube（章に対応）",
  },
  "jpDetail.listeningKeyPhrases": {
    en: "Key phrases",
    np: "मुख्य वाक्यांशहरू",
    jp: "重要フレーズ",
  },
  "jpDetail.listeningTipPrefix": {
    en: "Tip:",
    np: "टिप:",
    jp: "ヒント:",
  },
  "jpDetail.kanjiStrokesLabel": {
    en: "Strokes",
    np: "रेखाहरू",
    jp: "画数",
  },
  "jpDetail.kanjiOpenSvg": {
    en: "Open stroke SVG",
    np: "रेखा SVG खोल्नुहोस्",
    jp: "筆順SVGを開く",
  },
  "jpDetail.tag.jlptN5": {
    en: "JLPT N5",
    np: "JLPT N5",
    jp: "JLPT N5",
  },
  "jpDetail.tag.minna": {
    en: "Minna no Nihongo I",
    np: "मिन्ना नो निहोन्गो I",
    jp: "みんなの日本語 初級I",
  },
  "jpDetail.tag.sprint": {
    en: "Exam sprint",
    np: "परीक्षा स्प्रिन्ट",
    jp: "試験スプリント",
  },
  "jpDetail.tag.listening": {
    en: "Listening",
    np: "सुन्ने",
    jp: "聴解",
  },
  "jpDetail.tag.grammar": {
    en: "Grammar",
    np: "व्याकरण",
    jp: "文法",
  },
  "jpDetail.tag.particles": {
    en: "Particles",
    np: "जुड्ने शब्द",
    jp: "助詞",
  },
  "jpDetail.tag.kanji": {
    en: "Kanji",
    np: "कांजी",
    jp: "漢字",
  },
  "jpDetail.tag.jlptN4": {
    en: "JLPT N4",
    np: "JLPT N4",
    jp: "JLPT N4",
  },
  "jpDetail.tag.minnaII": {
    en: "Minna no Nihongo II",
    np: "मिन्ना नो निहोन्गो II",
    jp: "みんなの日本語 中級I",
  },
  "japaneseN4Day.trackLabel": {
    en: "JLPT N4 · Minna no Nihongo II track",
    np: "JLPT N4 · मिन्ना नो निहोन्गो II ट्र्याक",
    jp: "JLPT N4 · 『みんなの日本語』中級Iトラック",
  },
  "hub.japaneseN4.title": {
    en: "Japanese · JLPT N4",
    np: "जापानी · JLPT N4",
    jp: "日本語 · JLPT N4",
  },
  "hub.japaneseN4.subtitle": {
    en: "Minna no Nihongo II · 28-day syllabus · passive, causative & conditionals",
    np: "みんなの日本語 II · २८-दिने पाठ्यक्रम · passive, causative र सर्त",
    jp: "みんなの日本語 中級I · 28日シラバス · 受け身・使役・条件",
  },
  "jpN4Roadmap.title": {
    en: "Japanese · JLPT N4 in 28 days",
    np: "२८ दिनमा जापानी · JLPT N4",
    jp: "28日で日本語 · JLPT N4",
  },
  "jpN4Roadmap.subtitle": {
    en: "Built around Minna no Nihongo II Lessons 26–50 · passive · causative · conditionals · grammar · kanji · MCQ · listening cues",
    np: "みんなの日本語 II को पाठ २६–५० वरिपरि · passive · causative · सर्त · व्याकरण · कांजी · बहुविकल्प · सुन्ने संकेत",
    jp: "『みんなの日本語 中級I』第26–50課を軸に · 受け身 · 使役 · 条件 · 文法 · 漢字 · MCQ · 聴解のヒント",
  },
  "jpN4Roadmap.overallProgress": {
    en: "Overall progress",
    np: "समग्र प्रगति",
    jp: "全体の進捗",
  },
  "jpN4Roadmap.days": {
    en: "days",
    np: "दिन",
    jp: "日",
  },
  "jpN4Roadmap.doneSlash": {
    en: "done",
    np: "पूरा",
    jp: "完了",
  },
  "jpN4Roadmap.percentComplete": {
    en: "% complete",
    np: "% पूरा",
    jp: "% 完了",
  },
  "jpN4Roadmap.weeklyTestsProgress": {
    en: "Weekly tests + full mock:",
    np: "साप्ताहिक परीक्षा र पूर्ण मॉक:",
    jp: "ウィークリーテストと総合模試:",
  },
  "jpN4Roadmap.markedDone": {
    en: "marked done",
    np: "पूरा चिनो भएको",
    jp: "完了として記録",
  },
  "jpN4Roadmap.dayPrefix": {
    en: "Day",
    np: "दिन",
    jp: "Day",
  },
  "jpN4Roadmap.weeklyRecapLabel": {
    en: "Weekly recap · JLPT-style unit test",
    np: "साप्ताहिक पुनरावलोकन · JLPT-शैलीको युनिट टेस्ट",
    jp: "週の復習 · JLPT形式のユニットテスト",
  },
  "jpN4Roadmap.fivePapersBlurb": {
    en: "Five papers (Test 1–5), 20 MCQs each · vocab · kanji · grammar · reading · listening (embedded clip + links) · submit to score",
    np: "पाँच वटा पेपर (टेस्ट १–५), प्रत्येकमा २० बहुविकल्प · शब्दभण्डार · कांजी · व्याकरण · पढाइ · सुन्ने (इम्बेड क्लिप + लिंक) · स्कोरका लागि पेश गर्नुहोस्",
    jp: "5枚のペーパー（テスト1〜5）、各20問のMCQ · 語彙 · 漢字 · 文法 · 読解 · 聴解（埋め込み＋リンク） · 採点は提出後",
  },
  "jpN4Roadmap.singlePaperBlurb": {
    en: "Covers Days {from}–{to} · vocab · grammar · reading · listening · submit to score",
    np: "दिन {from}–{to} समेट्छ · शब्द · व्याकरण · पढाइ · सुन्ने · स्कोरका लागि पेश गर्नुहोस्",
    jp: "Day {from}–{to} をカバー · 語彙 · 文法 · 読解 · 聴解 · 採点は提出後",
  },
  "jpN4Roadmap.done": {
    en: "Done",
    np: "पूरा",
    jp: "完了",
  },
  "jpN4Roadmap.openUnitTest": {
    en: "Open unit test",
    np: "युनिट टेस्ट खोल्नुहोस्",
    jp: "ユニットテストを開く",
  },
  "jpN4Roadmap.courseFinale": {
    en: "Course finale · JLPT N4 format",
    np: "पाठ्यक्रम अन्त्य · JLPT N4 ढाँचा",
    jp: "総仕上げ · JLPT N4形式",
  },
  "jpN4Roadmap.fullMockBlurb": {
    en: "One paper covering Days {from}–{to} · language knowledge · grammar · reading · listening · embedded listening clip · submit to score",
    np: "दिन {from}–{to} समेट्ने एक पेपर · भाषा ज्ञान · व्याकरण · पढाइ · सुन्ने · इम्बेड सुन्ने क्लिप · स्कोरका लागि पेश गर्नुहोस्",
    jp: "Day {from}–{to} の一枚 · 言語知識 · 文法 · 読解 · 聴解 · 埋め込み聴解 · 採点は提出後",
  },
  "jpN4Roadmap.openFullMock": {
    en: "Open full mock exam",
    np: "पूर्ण मॉक परीक्षा खोल्नुहोस्",
    jp: "総合模試を開く",
  },
  "jpN4Roadmap.bottomBlurb": {
    en: "Tick days as you finish them — progress stays in this browser. Each lesson mirrors Minna no Nihongo II chapter order with conversation, verb drills, grammar tables, kanji cards, MCQs, and listening tasks (pair with your textbook audio). After each week, use the weekly JLPT-style unit test; at the end of the course, open the full mock exam. Passive, causative, and causative-passive verb forms are the heart of N4 — keep a dedicated conjugation table open while studying.",
    np: "दिनहरू सकिएजस्तै टिक लगाउनुहोस् — प्रगति यस ब्राउजरमै रहन्छ। प्रत्येक पाठले मिन्ना II को अध्याय क्रम अनुसार संवाद, क्रिया अभ्यास, व्याकरण तालिका, कांजी कार्ड, बहुविकल्प र सुन्ने कार्य समेट्छ। प्रत्येक हप्तापछि JLPT-शैलीको साप्ताहिक टेस्ट; अन्त्यमा पूर्ण मॉक। Passive, causative र causative-passive N4 को मुटु हुन् — अध्ययन गर्दा क्रिया संयोग तालिका खुला राख्नुहोस्।",
    jp: "終わった日にチェックを入れると進捗がこのブラウザに保存されます。各レッスンはみんなの日本語IIの順に沿って会話・動詞ドリル・文法表・漢字カード・MCQ・聴解タスクを含みます（教科書CDとセットで）。各週末はJLPT形式のウィークリーテスト、最後は総合模試。受け身・使役・使役受け身はN4の核心なので、学習中は動詞活用表を常に開いておきましょう。",
  },
} as const satisfies Record<string, Record<Locale, string>>;

export type UiStringKey = keyof typeof UI_STRINGS;

export function translateUi(key: UiStringKey, locale: Locale): string {
  const row = UI_STRINGS[key];
  return row[locale] ?? row.en;
}

/** Replace `{name}` placeholders in translated strings. */
export function translateUiParams(key: UiStringKey, locale: Locale, params: Record<string, string | number>): string {
  let s = translateUi(key, locale);
  for (const [k, v] of Object.entries(params)) {
    s = s.replaceAll(`{${k}}`, String(v));
  }
  return s;
}
