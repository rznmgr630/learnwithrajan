import type { RoadmapDayDetail } from "@/lib/challenge-data";
import {
  GIT_DAY_1_FAQ,
  GIT_DAY_2_FAQ,
  GIT_DAY_3_FAQ,
  GIT_DAY_4_FAQ,
  GIT_DAY_5_FAQ,
  GIT_DAY_6_FAQ,
  GIT_DAY_7_FAQ,
} from "@/lib/git-learning/git-day-faqs";

const L = {
  d1o1: {
    en: "Git tracks snapshots of your project over time. Every engineer touches the same three places: the working directory where you edit files, the staging area (index) where you queue the next snapshot, and the repository (.git) where commits live.",
    np: "Git ले तपाईंको परियोजनाको समयसँगै स्न्यापसट ट्र्याक गर्छ। तीन ठाउँ: कार्य निर्देशिका, स्टेजिङ (index), र रेपो (.git) जहाँ commit हुन्छन्।",
    jp: "Git はプロジェクトのスナップショットを時系列で記録します。作業ツリー・ステージング（index）・リポジトリ（.git）の3つを押さえましょう。",
  } as const,
  d1o2: {
    en: "Days 1–2 focus on local fundamentals; days 3–7 add branching, remotes, history rewriting, and team workflows.",
    np: "दिन १–२ स्थानीय आधार; दिन ३–७ मा ब्रान्च, रिमोट, इतिहास, र टोली कार्यप्रवाह।",
    jp: "1〜2日目はローカル基礎、3〜7日目でブランチ・リモート・履歴整理・チーム運用へ進みます。",
  } as const,
};

export const GIT_DAY_1_DETAIL: RoadmapDayDetail = {
  overview: [L.d1o1, L.d1o2],
  sections: [
    {
      title: {
        en: "Why does Git have three states?",
        np: "Git मा तीन अवस्था किन छ?",
        jp: "なぜ Git は3つの状態を持つのか",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Imagine you spent an afternoon fixing two unrelated bugs in the same file. Without staging, your only choice is 'commit everything' or 'commit nothing'. Staging lets you group related changes into one clean commit and leave the rest for the next one — reviewers see your intent, not your session.",
            np: "कल्पना गर्नुहोस् तपाईंले एउटै फाइलमा दुईटा असम्बन्धित bug ठीक गर्नुभयो। Staging बिना 'सबै commit' वा 'केही commit नगर्ने' मात्र विकल्प हुन्छ। Staging ले सम्बन्धित परिवर्तनहरू एउटा सफा commit मा राख्न दिन्छ।",
            jp: "1つのファイルで無関係なバグを2つ直した場合、ステージングがなければ「全部コミット」か「何もコミットしない」しか選べません。ステージングで関連する変更だけをまとめて綺麗なコミットにできます。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Working directory — where you freely edit files without Git caring yet.",
              np: "कार्य निर्देशिका — जहाँ तपाईं स्वतन्त्र रूपमा फाइल सम्पादन गर्नुहुन्छ।",
              jp: "作業ツリー — Git が気にせず自由に編集できる場所。",
            },
            {
              en: "Staging area (index) — a draft of your next commit; you control exactly what goes in.",
              np: "Staging क्षेत्र — अर्को commit को मस्यौदा; के जाने भन्ने तपाईंले नियन्त्रण गर्नुहुन्छ।",
              jp: "ステージングエリア — 次のコミットの下書き。何を含めるかを正確に制御できます。",
            },
            {
              en: "Repository (.git) — the permanent record. Once committed, changes are safe and traceable.",
              np: "भण्डार (.git) — स्थायी अभिलेख। एकपटक commit भएपछि परिवर्तन सुरक्षित र ट्रेसयोग्य हुन्छन्।",
              jp: "リポジトリ（.git） — 永続的な記録。コミット後は安全で追跡可能になります。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Three states — one mental model",
        np: "तीन अवस्था — एउटा मानसिक मोडेल",
        jp: "3つの状態",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Files move working directory → staging → commit. Nothing is permanent until you commit (and even then you have tools to fix mistakes later in the week).",
            np: "फाइलहरू कार्य → स्टेजिङ → commit मा जान्छन्। commit नभएसम्म स्थायी हुँदैन।",
            jp: "変更は 作業ツリー → ステージ → コミット の順で記録されます。",
          },
        },
        { type: "diagram", id: "git-workdir-staging-repo" },
        {
          type: "paragraph",
          text: {
            en: "The diagram below matches the classic \"local vs remote\" classroom map: three local stops (working tree → staging → local repo), then the shared remote (usually `origin`). Rose arrows are the verbs that move work between them — the same layout as common tutorial posters.",
            np: "तलको चित्र कक्षामा प्रयोग हुने \"स्थानीय बनाम रिमोट\" नक्सासँग मेल खान्छ: तीन स्थानीय चरण, अनि साझा रिमोट (`origin`)। गुलाबी तीर काम सार्ने क्रियाहरू हुन् — प्रायः ट्युटोरियल पोस्टर जस्तै।",
            jp: "下の図は教材でよく見る「ローカル vs リモート」の整理と同じです。作業ツリー→ステージ→ローカルリポジトリの3つに加え、共有リモート（多くは `origin`）。矢印の色と流れは定番のチュートリアル図と同じ考え方です。",
          },
        },
        { type: "diagram", id: "git-local-remote-workflow" },
        {
          type: "code",
          title: {
            en: "Your first repository — step by step",
            np: "तपाईंको पहिलो रेपो — चरण-दर-चरण",
            jp: "最初のリポジトリ — ステップごとに",
          },
          code: `# Create a folder and tell Git to track it
git init demo
cd demo

# Create a file — it lives in the working directory only
echo "# Demo" > README.md

# Move the file to staging — queue it for the next snapshot
git add README.md

# Commit — takes a permanent snapshot of what is staged
git commit -m "chore: initial commit"

# Confirm the snapshot was saved
git log --oneline`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "`git status` — always run it before committing; it shows exactly which state each file is in.",
              np: "`git status` — commit अघि सधैं चलाउनुहोस्; प्रत्येक फाइलको अवस्था देखाउँछ।",
              jp: "`git status` はコミット前の定番チェック。各ファイルの状態が一目でわかります。",
            },
            {
              en: "`git add -p` — stage only part of a file (a 'hunk') instead of the whole thing — great for separating unrelated changes.",
              np: "`git add -p` — सम्पूर्ण फाइलको सट्टा एक 'hunk' मात्र stage गर्नुहोस् — असम्बन्धित परिवर्तन छुट्याउन उपयोगी।",
              jp: "`git add -p` でファイル全体でなく一部（hunk）だけステージできます。無関係な変更を分けるのに便利です。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "First-time setup — git config",
        np: "पहिलो सेटअप — git config",
        jp: "初期設定 — git config",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Git records your name and email inside every commit. If you skip this step, commits look like they came from nobody and code-review tools cannot link them to your account. Run these two commands once after installing Git.",
            np: "Git ले तपाईंले गर्ने हरेक commit भित्र नाम र इमेल रेकर्ड गर्छ। यदि यो छोड्नुभयो भने commit बिना नामको देखिन्छ। Git इन्स्टल गरेपछि एकपटक यी दुई आदेश चलाउनुहोस्।",
            jp: "Git はすべてのコミットに名前とメールを記録します。設定しないと「誰でもない人」のコミットになりレビューツールとの連携が壊れます。Git インストール後に一度だけ実行してください。",
          },
        },
        {
          type: "code",
          title: {
            en: "One-time global setup",
            np: "एकपटक ग्लोबल सेटअप",
            jp: "一度だけ行うグローバル設定",
          },
          code: `# Tell Git who you are — stored in ~/.gitconfig (applies to all repos)
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# Set your preferred editor for commit messages (optional but recommended)
git config --global core.editor "code --wait"   # VS Code
# git config --global core.editor "vim"         # Vim

# Make git pull rebase by default — avoids noisy merge commits on pull
git config --global pull.rebase true

# Confirm everything was saved
git config --list --global`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Use `--local` instead of `--global` to scope config to one repo — useful when you use different emails for work and personal projects.",
              np: "`--global` को सट्टा `--local` थप्नुहोस् एउटा repo मात्रका लागि — काम र व्यक्तिगत परियोजनामा फरक इमेल हुँदा उपयोगी।",
              jp: "`--global` の代わりに `--local` を使うと、そのリポジトリだけに設定が適用されます。仕事と個人でメールを使い分けるときに便利です。",
            },
            {
              en: "`git config --list` shows the effective config for the current repo — local settings override global, global overrides system.",
              np: "`git config --list` ले हालको repo को प्रभावी config देखाउँछ — local > global > system।",
              jp: "`git config --list` で現在のリポジトリに適用される設定を確認できます（local > global > system の順で上書き）。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: ".gitignore — keeping junk out of Git",
        np: ".gitignore — Git बाट अनावश्यक फाइल बाहिर राख्ने",
        jp: ".gitignore — 不要ファイルを Git の外に置く",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Git tracks every file it can see unless you tell it not to. That means `node_modules/`, `.env` secrets, OS files like `.DS_Store`, and build output all pile up in your repository. A `.gitignore` file lists patterns; Git ignores any path that matches. Create it in the root of your project before the first commit.",
            np: "Git ले तपाईंले नभन्नेसम्म देख्ने हरेक फाइल ट्र्याक गर्छ। `node_modules/`, `.env` रहस्य, `.DS_Store`, र build आउटपुट रेपोमा थुप्रिन्छन्। `.gitignore` फाइलले pattern सूची राख्छ; path मिलेको फाइल Git ले बेवास्ता गर्छ।",
            jp: "Git は指示がなければ見えるすべてのファイルを追跡します。`node_modules/`・`.env` の秘密情報・`.DS_Store`・ビルド成果物が放置するとリポジトリに溜まります。`.gitignore` にパターンを書くとマッチしたファイルを Git が無視します。最初のコミット前にプロジェクトルートに作成してください。",
          },
        },
        {
          type: "code",
          title: {
            en: "Typical .gitignore for a Node project",
            np: "Node परियोजनाको सामान्य .gitignore",
            jp: "Node プロジェクトの典型的な .gitignore",
          },
          code: `# Dependencies — reinstallable from package.json, never commit these
node_modules/

# Environment variables — contains secrets (API keys, DB passwords)
.env
.env.local
.env.*.local

# Build output — generated, not authored
dist/
build/
.next/

# OS junk
.DS_Store       # macOS Finder metadata
Thumbs.db       # Windows thumbnail cache

# Editor files
.vscode/settings.json
*.swp           # Vim swap files`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Already tracked a file by accident? `git rm --cached <file>` removes it from Git without deleting it from disk. Then add the path to `.gitignore`.",
              np: "फाइल गल्तीले track भयो? `git rm --cached <file>` ले disk बाट नमेटी Git बाट हटाउँछ। अनि `.gitignore` मा थप्नुहोस्।",
              jp: "うっかり追跡してしまったファイルは `git rm --cached <file>` でディスクを消さずに Git から外せます。その後 `.gitignore` に追記してください。",
            },
            {
              en: "GitHub provides starter `.gitignore` templates for most languages — search `github/gitignore` on GitHub to find a template for your stack.",
              np: "GitHub ले अधिकांश भाषाका `.gitignore` template प्रदान गर्छ — आफ्नो stack को लागि GitHub मा `github/gitignore` खोज्नुहोस्।",
              jp: "GitHub は多くの言語向けの `.gitignore` テンプレートを提供しています。スタックに合ったものを GitHub で `github/gitignore` を検索して見つけてください。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Git basics cheatsheet", np: "Git आधारभूत चिटसिट", jp: "Git 基礎コマンド早見表" },
      blocks: [
        {
          type: "table",
          headers: [
            { en: "Command", np: "आदेश", jp: "コマンド" },
            { en: "What it does", np: "के गर्छ", jp: "作用" },
            { en: "When to use it", np: "कहिले प्रयोग गर्ने", jp: "使うタイミング" },
          ],
          rows: [
            [
              { en: "`git init`", np: "`git init`", jp: "`git init`" },
              { en: "Create a new empty repository in the current folder", np: "हालको फोल्डरमा नयाँ खाली रेपो बनाउँछ", jp: "現在のフォルダに新しいリポジトリを作成" },
              { en: "Starting a brand-new project from scratch", np: "नयाँ परियोजना सुरु गर्दा", jp: "新しいプロジェクトをゼロから始めるとき" },
            ],
            [
              { en: "`git status`", np: "`git status`", jp: "`git status`" },
              { en: "Show which files are modified, staged, or untracked", np: "कुन फाइल modified, staged, वा untracked छन् देखाउँछ", jp: "変更・ステージ・未追跡ファイルを一覧表示" },
              { en: "Before every `git add` and `git commit` — always run it first", np: "हरेक `git add` र `git commit` अघि — सधैं पहिले चलाउनुहोस्", jp: "`git add` と `git commit` の前に必ず確認" },
            ],
            [
              { en: "`git add <file>`", np: "`git add <file>`", jp: "`git add <file>`" },
              { en: "Stage a specific file for the next commit", np: "अर्को commit को लागि विशेष फाइल stage गर्छ", jp: "特定のファイルを次のコミットにステージ" },
              { en: "When you want to include one file in the next commit", np: "एउटा फाइल अर्को commit मा समावेश गर्दा", jp: "1つのファイルをコミットに含めたいとき" },
            ],
            [
              { en: "`git add -p`", np: "`git add -p`", jp: "`git add -p`" },
              { en: "Stage changes hunk by hunk interactively", np: "hunk अनुसार अन्तरक्रियात्मक रूपमा stage गर्छ", jp: "変更をひとかたまりずつ対話的にステージ" },
              { en: "When a file has multiple unrelated changes and you only want some", np: "फाइलमा असम्बन्धित परिवर्तन छन् र केही मात्र commit गर्दा", jp: "無関係な変更が混在し、一部だけコミットしたいとき" },
            ],
            [
              { en: "`git commit -m \"...\"`", np: "`git commit -m \"...\"`", jp: "`git commit -m \"...\"`" },
              { en: "Snapshot staged changes into a permanent commit", np: "staged परिवर्तन स्थायी commit मा स्न्यापसट गर्छ", jp: "ステージ済みの変更を永続的なコミットとして記録" },
              { en: "When staged changes form one logical unit of work", np: "staged परिवर्तनहरू एउटा तार्किक कामको एकाइ बनाउँदा", jp: "ステージ内容がひとつの論理的な作業単位になったとき" },
            ],
            [
              { en: "`git commit --amend`", np: "`git commit --amend`", jp: "`git commit --amend`" },
              { en: "Replace the last commit with a new one", np: "अन्तिम commit नयाँले बदल्छ", jp: "直近のコミットを新しいものに置き換え" },
              { en: "Fixing a typo or adding a forgotten file — before pushing only", np: "टाइपो ठीक गर्दा वा फाइल थप्दा — push अघि मात्र", jp: "誤字修正・忘れたファイル追加 — push 前限定" },
            ],
            [
              { en: "`git log --oneline`", np: "`git log --oneline`", jp: "`git log --oneline`" },
              { en: "Show a compact one-line summary of every commit", np: "हरेक commit को एक-लाइन संक्षेप देखाउँछ", jp: "全コミットを1行で要約表示" },
              { en: "Getting a quick overview of recent history", np: "हालिएको इतिहासको छिटो अवलोकन गर्दा", jp: "最近の履歴をざっと把握したいとき" },
            ],
            [
              { en: "`git config --global user.name`", np: "`git config --global user.name`", jp: "`git config --global user.name`" },
              { en: "Set your name and email stored inside every commit", np: "हरेक commit भित्र राखिने नाम र इमेल सेट गर्छ", jp: "全コミットに記録される名前とメールを設定" },
              { en: "Once after installing Git — before making any commits", np: "Git इन्स्टल गरेपछि एकपटक — कुनै commit अघि", jp: "Git インストール直後に一度だけ — 最初のコミット前" },
            ],
            [
              { en: "`git rm --cached <file>`", np: "`git rm --cached <file>`", jp: "`git rm --cached <file>`" },
              { en: "Stop tracking a file without deleting it from disk", np: "disk बाट नमेटी Git ले ट्र्याक गर्न बन्द गर्छ", jp: "ディスクからは消さずに Git の追跡を外す" },
              { en: "After accidentally committing a file that should be in `.gitignore`", np: "`.gitignore` मा हुनुपर्ने फाइल गल्तीले commit गरेपछि", jp: "`.gitignore` に入れるべきファイルを誤って追跡してしまったとき" },
            ],
          ],
        },
      ],
    },
  ],
  faq: GIT_DAY_1_FAQ,
  bullets: [
    {
      en: "Create a throwaway repo and run init → add → commit twice.",
      np: "अभ्यास रेपो बनाउनुहोस् र init → add → commit दुई पटक गर्नुहोस्।",
      jp: "練習用リポジトリで init → add → commit を2回試す。",
    },
    {
      en: "Sketch the three-state diagram from memory on paper.",
      np: "कागजमा तीन-अवस्था चित्र सम्झेर कोर्नुहोस्।",
      jp: "3状態図を紙に手書きで再現する。",
    },
  ],
};

export const GIT_DAY_2_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Day 2 is about reading history safely: compare trees, see who changed a line, and fix the last commit when you have not pushed yet.",
      np: "दिन २: इतिहास सुरक्षित पढ्नु, तुलना गर्नु, र push नगरेसम्म अन्तिम commit सच्याउनु।",
      jp: "2日目は履歴の読み方: 差分の見方、行単位の追跡、未 push の直近コミットの修正。",
    },
  ],
  sections: [
    {
      title: {
        en: "Why do you need to read history?",
        np: "इतिहास किन पढ्नु पर्छ?",
        jp: "なぜ履歴を読む必要があるのか",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A bug appears in production. You need to answer: what changed, when, and who changed it? Without history-reading skills you would be guessing. Git's diff and log tools let you answer those questions in seconds — even on a codebase you have never seen before.",
            np: "production मा bug देखियो। के, कहिले, र कसले बदल्यो जान्नु छ? इतिहास पढ्ने सिप बिना अनुमान मात्र गर्नु पर्छ। Git का diff र log उपकरणले सेकेन्डमा जवाफ दिन्छन्।",
            jp: "本番でバグが出た。何が、いつ、誰によって変わったかを知りたい。履歴の読み方を知らないと推測するしかありません。Git の diff・log ツールなら見知らぬコードでも数秒で答えが出ます。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "`git diff` — what changed in your working tree that has not been staged yet.",
              np: "`git diff` — अझै stage नभएको कार्य ट्रीमा के बदलियो।",
              jp: "`git diff` — まだステージしていない作業ツリーの変更。",
            },
            {
              en: "`git diff --staged` — what is queued in the index and will go into the next commit.",
              np: "`git diff --staged` — index मा राखिएको र अर्को commit मा जाने।",
              jp: "`git diff --staged` — インデックスにある次のコミット候補の変更。",
            },
            {
              en: "`git log` — the full timeline of commits; `--oneline --graph` gives a compact visual.",
              np: "`git log` — commit को पूर्ण समयरेखा; `--oneline --graph` संक्षिप्त दृश्य दिन्छ।",
              jp: "`git log` — コミットの全タイムライン。`--oneline --graph` でコンパクトな可視化。",
            },
            {
              en: "`git blame` — shows which commit last touched each line — vital for tracking down the author of a specific change.",
              np: "`git blame` — कुन commit ले कुन लाइन अन्तिम पटक छोयो — परिवर्तनको लेखक खोज्न महत्वपूर्ण।",
              jp: "`git blame` — 各行を最後に変更したコミットを表示。特定の変更の担当者を追うのに必須。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "From working tree to commit (timeline)",
        np: "कार्य ट्री देखि commit (समयरेखा)",
        jp: "作業ツリーからコミットまで（タイムライン）",
      },
      blocks: [
        { type: "diagram", id: "git-first-commit-flow" },
        {
          type: "code",
          title: {
            en: "Reading history — the commands you will use every day",
            np: "इतिहास पढ्ने — दैनिक प्रयोग हुने आदेशहरू",
            jp: "履歴を読む — 毎日使うコマンド",
          },
          code: `# See a compact graph of recent commits
# Useful when you join a repo and want a quick overview
git log --oneline --graph -n 12

# See what you changed but have NOT staged yet
# Run this before git add to double-check your edits
git diff

# See what IS staged and will go into the next commit
# Run this right before git commit to verify the snapshot
git diff --staged

# Inspect the full diff of the most recent commit
# Useful to confirm what your last commit actually captured
git show HEAD`,
        },
        {
          type: "paragraph",
          text: {
            en: "`git commit --amend` replaces the tip commit — use it to fix a typo in the last message or add a forgotten file. Only use it before you push; amending a published commit rewrites public history and forces teammates to reconcile.",
            np: "`git commit --amend` ले tip commit बदल्छ — अन्तिम सन्देशको टाइपो ठीक गर्न वा भुलिएको फाइल थप्न प्रयोग गर्नुहोस्। push अघि मात्र; प्रकाशित commit amend गर्दा सार्वजनिक इतिहास पुनर्लेखन हुन्छ।",
            jp: "`git commit --amend` で直近のコミットを置き換えます。メッセージの誤字修正や忘れたファイルの追加に使います。push 前限定です。公開後に使うと他者のリポとの不整合が生じます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Fixing the last commit before pushing",
            np: "push अघि अन्तिम commit सच्याउने",
            jp: "push 前に直近コミットを修正する",
          },
          code: `# You just committed but noticed a typo in the message
git commit --amend -m "fix: correct spelling in error message"

# You forgot to include a file in the last commit
git add src/forgot-this-file.ts
git commit --amend --no-edit   # keeps the existing message

# WARNING: only amend if you have NOT pushed yet
# If you already pushed, coordinate with your team before amending`,
        },
      ],
    },
    {
      title: { en: "History cheatsheet", np: "इतिहास चिटसिट", jp: "履歴コマンド早見表" },
      blocks: [
        {
          type: "table",
          headers: [
            { en: "Command", np: "आदेश", jp: "コマンド" },
            { en: "What it does", np: "के गर्छ", jp: "作用" },
            { en: "When to use it", np: "कहिले प्रयोग गर्ने", jp: "使うタイミング" },
          ],
          rows: [
            [
              { en: "`git diff`", np: "`git diff`", jp: "`git diff`" },
              { en: "Show changes in working tree that are NOT staged yet", np: "अझै stage नभएको कार्य ट्री परिवर्तन देखाउँछ", jp: "まだステージしていない作業ツリーの変更を表示" },
              { en: "Before `git add`, to review what you actually changed", np: "`git add` अघि, के बदल्नुभयो जाँच्न", jp: "`git add` 前に変更内容を確認するとき" },
            ],
            [
              { en: "`git diff --staged`", np: "`git diff --staged`", jp: "`git diff --staged`" },
              { en: "Show changes queued in the index vs the last commit", np: "index मा राखिएको र अन्तिम commit बीच अन्तर देखाउँछ", jp: "インデックスと直前コミットの差分を表示" },
              { en: "Right before `git commit`, to verify the snapshot", np: "`git commit` ठीक अघि, snapshot प्रमाणित गर्न", jp: "`git commit` 直前にコミット内容を確認するとき" },
            ],
            [
              { en: "`git log --oneline --graph`", np: "`git log --oneline --graph`", jp: "`git log --oneline --graph`" },
              { en: "Show compact history with an ASCII branch graph", np: "ASCII ब्रान्च ग्राफसहित संक्षिप्त इतिहास देखाउँछ", jp: "ASCII グラフ付きでコンパクトな履歴を表示" },
              { en: "Navigating history at a glance or checking branch topology", np: "इतिहास हेर्दा वा ब्रान्च ट्रोपोलोजी जाँच्दा", jp: "履歴をざっと確認したり、ブランチの形を把握するとき" },
            ],
            [
              { en: "`git show <hash>`", np: "`git show <hash>`", jp: "`git show <hash>`" },
              { en: "Show the full diff of one specific commit", np: "एउटा विशेष commit को पूर्ण diff देखाउँछ", jp: "特定のコミットの全差分を表示" },
              { en: "Inspecting exactly what a commit changed after spotting it in `git log`", np: "`git log` मा देखेपछि commit ले के बदल्यो जाँच्दा", jp: "`git log` でコミットを見つけた後、内容を詳しく確認するとき" },
            ],
            [
              { en: "`git blame <file>`", np: "`git blame <file>`", jp: "`git blame <file>`" },
              { en: "Show which commit last touched each line of a file", np: "फाइलको प्रत्येक लाइन कुन commit ले अन्तिम पटक छोयो देखाउँछ", jp: "ファイルの各行を最後に変更したコミットを表示" },
              { en: "Tracking down who introduced a specific line or bug", np: "विशेष लाइन वा bug कसले ल्यायो पत्ता लगाउँदा", jp: "特定の行やバグを誰が導入したかを追うとき" },
            ],
            [
              { en: "`git commit --amend --no-edit`", np: "`git commit --amend --no-edit`", jp: "`git commit --amend --no-edit`" },
              { en: "Add a forgotten file to the last commit without changing the message", np: "सन्देश नबदली अन्तिम commit मा भुलिएको फाइल थप्छ", jp: "メッセージを変えずに忘れたファイルを直前コミットに追加" },
              { en: "After realising you forgot to stage one file — before pushing", np: "एउटा फाइल stage गर्न भुल्दा — push अघि मात्र", jp: "ファイルのステージ忘れに気づいたとき — push 前限定" },
            ],
          ],
        },
      ],
    },
  ],
  faq: GIT_DAY_2_FAQ,
  bullets: [
    {
      en: "Run `git blame` on a file you know and interpret one hunk.",
      np: "चिनिएको फाइलमा `git blame` चलाउनुहोस्।",
      jp: "既知のファイルで `git blame` を試す。",
    },
    {
      en: "Practice amending a message without changing files.",
      np: "फाइल नबदली सन्देश amend गर्न अभ्यास गर्नुहोस्।",
      jp: "内容を変えずにコミットメッセージだけ amend する。",
    },
  ],
};

export const GIT_DAY_3_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Branches let multiple people (or your future self) work on separate things at the same time without breaking each other's work. A branch is just a cheap pointer to a commit — creating one is instant and uses almost no disk space.",
      np: "ब्रान्चले एकै समयमा धेरै काम अलग-अलग गर्न दिन्छ — अर्काको काम नबिगारी। एउटा ब्रान्च केवल commit तर्फ सूचक हो, बनाउन तत्काल र निःशुल्क छ।",
      jp: "ブランチを使えば、複数の作業を互いに影響なく並行して進められます。ブランチはコミットへの軽量ポインタで、作成は瞬時かつほぼコスト無しです。",
    },
    {
      en: "Merging integrates two lines of development back together. A fast-forward merge simply moves the pointer forward when no divergent commits exist; otherwise Git creates a merge commit with two parents.",
      np: "मर्जले दुई विकास रेखाहरू एकै ठाउँमा मिलाउँछ। फास्ट-फर्वार्डले सूचक अगाडि सार्छ जब कुनै divergent commit छैन; नत्र Git दुई अभिभावकसहित मर्ज commit बनाउँछ।",
      jp: "マージで2つの開発ラインを統合します。分岐がなければ早送りでポインタを進め、あればマージコミット（親2つ）を作ります。",
    },
  ],
  sections: [
    {
      title: {
        en: "Why do you need a branch?",
        np: "ब्रान्च किन चाहिन्छ?",
        jp: "なぜブランチが必要か",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Imagine you are fixing a bug and a teammate starts a new feature — both touching the same files on `main`. You would constantly overwrite each other's work. A branch gives each piece of work its own isolated timeline so changes stay separate until they are ready to be combined.",
            np: "कल्पना गर्नुहोस् तपाईं bug ठीक गर्दै हुनुहुन्छ र टीममेट नयाँ सुविधा थाल्छ — दुवैले `main` मा एउटै फाइल छुँदै। ब्रान्चले प्रत्येक कामलाई आफ्नै अलग timeline दिन्छ — मर्ज नभएसम्म छुट्टै।",
            jp: "バグ修正と新機能開発が同じ `main` のファイルを同時に触ると上書きが起きます。ブランチを使えばそれぞれが独立したタイムラインを持ち、準備が整ったときだけ統合できます。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Isolation — your half-finished feature cannot break `main` for the rest of the team.",
              np: "अलगाव — अधूरो सुविधाले बाँकी टोलीको `main` बिगार्दैन।",
              jp: "分離 — 未完の機能が `main` を壊す心配がありません。",
            },
            {
              en: "Parallel work — five engineers can have five branches in flight simultaneously.",
              np: "समानान्तर काम — पाँच इन्जिनियर एकै समयमा पाँच ब्रान्चमा काम गर्न सक्छन्।",
              jp: "並行作業 — 5人のエンジニアが同時に別々のブランチで作業できます。",
            },
            {
              en: "Safe experimentation — try a risky refactor on a branch; if it fails, just delete it.",
              np: "सुरक्षित प्रयोग — जोखिमपूर्ण refactor ब्रान्चमा गर्नुहोस्; असफल भए मेटाउनुहोस्।",
              jp: "安全な実験 — 失敗しても削除するだけでリスクなし。",
            },
            {
              en: "Clean history — each branch maps to one feature, bug fix, or task — easier to review and revert.",
              np: "सफा इतिहास — प्रत्येक ब्रान्च एउटा काम — review र revert सजिलो।",
              jp: "履歴の整理 — ブランチ1つ＝タスク1つで、レビューと切り戻しが容易。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Branch + merge diagram",
        np: "ब्रान्च + मर्ज चित्र",
        jp: "ブランチとマージ",
      },
      blocks: [
        { type: "diagram", id: "git-branch-merge" },
        {
          type: "code",
          title: { en: "Creating a branch with a clear purpose", np: "उद्देश्यसहित ब्रान्च बनाउने", jp: "目的を明確にしてブランチを作る" },
          code: `# You're about to add a login feature.
# Branching keeps this work isolated from main
# until it is reviewed and ready to ship.
git switch -c feature/add-login-page

# Make changes, then stage and commit as normal
git add src/pages/Login.tsx
git commit -m "feat: add login page with email + password"

git add src/api/auth.ts
git commit -m "feat: wire login form to /api/auth endpoint"

# When the feature is done and reviewed, merge it back
git switch main
git merge --no-ff feature/add-login-page

# Clean up — the branch is no longer needed
git branch -d feature/add-login-page`,
        },
        {
          type: "paragraph",
          text: {
            en: "The branch name acts as a short description of the work (`feature/`, `fix/`, `chore/` are common prefixes). Anyone reading `git branch` immediately knows what each line of work is about.",
            np: "ब्रान्च नाम कामको छोटो विवरण हो (`feature/`, `fix/`, `chore/` सामान्य prefix हुन्)। `git branch` पढ्दा तुरुन्त थाहा हुन्छ कुन ब्रान्च कस्तो काम हो।",
            jp: "ブランチ名は作業の短い説明文です（`feature/`・`fix/`・`chore/` が一般的）。`git branch` を見れば各作業の内容がすぐわかります。",
          },
        },
      ],
    },
    {
      title: {
        en: "Resolving merge conflicts",
        np: "मर्ज विरोध समाधान",
        jp: "マージコンフリクトの解消",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "When Git cannot auto-merge, it writes conflict markers into the file (`<<<<<<<`, `=======`, `>>>>>>>`). Edit the file to the correct final state, then stage and commit. Use `git merge --abort` to cancel and go back to the pre-merge state.",
            np: "Git ले स्वतः मर्ज गर्न नसक्दा conflict marker (`<<<<<<<`, `=======`, `>>>>>>>`) लेख्छ। फाइल सच्याउनुहोस्, अनि स्टेज गरी commit गर्नुहोस्। रद्द गर्न `git merge --abort`।",
            jp: "自動マージ不能なとき、Git は `<<<<<<<` `=======` `>>>>>>>` を挿入します。ファイルを正しい状態に編集してステージし直してコミット。取り消すなら `git merge --abort`。",
          },
        },
        {
          type: "code",
          title: {
            en: "Conflict resolution flow",
            np: "Conflict समाधान प्रवाह",
            jp: "コンフリクト解消の手順",
          },
          code: `# 1. See which files conflict
git status

# 2. Open the file — find and fix <<<<< markers

# 3. Stage the resolved file
git add <file>

# 4. Finish the merge
git commit

# Cancel instead? Undo the whole merge:
git merge --abort`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "`git mergetool` launches a visual diff editor (e.g. VS Code, vimdiff) — set it with `git config merge.tool`.",
              np: "`git mergetool` ले भिजुअल diff editor खोल्छ — `git config merge.tool` ले सेट गर्नुहोस्।",
              jp: "`git mergetool` でビジュアルエディタを起動できます。`git config merge.tool` で設定。",
            },
            {
              en: "Always re-run tests after resolving conflicts — you may have introduced logic errors while editing.",
              np: "conflict सुल्झाएपछि सधैं परीक्षण दोबार चलाउनुहोस् — सम्पादनमा तर्क त्रुटि थपिन सक्छ।",
              jp: "解消後は必ずテストを再実行してください。編集中にロジックエラーが紛れ込む可能性があります。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Detached HEAD — what it is and how to escape",
        np: "Detached HEAD — के हो र कसरी बाहिर निस्कने",
        jp: "detached HEAD — 正体と抜け出し方",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "HEAD normally points to a branch name like `main`. When you run `git checkout <hash>` or `git switch --detach`, HEAD points directly to a commit — that is called \"detached HEAD\". New commits work fine here, but the moment you switch to another branch those commits become unreachable (no branch label refers to them) and are eventually garbage-collected. This is a common source of panic for beginners who just wanted to look at an old commit.",
            np: "HEAD सामान्यतः `main` जस्ता ब्रान्च नाम देखाउँछ। `git checkout <hash>` वा `git switch --detach` चलाउँदा HEAD सोझै commit लाई देखाउँछ — यसलाई \"detached HEAD\" भनिन्छ। यहाँ नयाँ commit काम गर्छ, तर ब्रान्चमा switch गर्दा ती commit unreachable हुन्छन् र अन्ततः garbage-collect हुन्छन्।",
            jp: "HEAD は通常 `main` などブランチ名を指します。`git checkout <hash>` や `git switch --detach` を実行すると HEAD がコミットを直接指す「detached HEAD」状態になります。ここでも新しいコミットは作れますが、別ブランチに切り替えた瞬間、それらのコミットは参照されなくなり最終的に GC で消えます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Enter, commit, and safely escape detached HEAD",
            np: "Detached HEAD प्रवेश, commit, र सुरक्षित बाहिर निस्कने",
            jp: "detached HEAD への入り方・コミット・安全な脱出",
          },
          code: `# Scenario: look at last week's state without creating a branch
git checkout abc1234        # or: git switch --detach abc1234
# HEAD is now detached at abc1234 — Git will tell you this

# If you accidentally make commits here and want to keep them:
# → create a branch BEFORE switching away — this saves those commits
git switch -c recovery/my-experiment

# If you made no commits and just want to return:
git switch main             # or: git switch -  (returns to previous branch)

# Check whether you are in detached HEAD
git log --oneline -1
# → abc1234 (HEAD)     ← no branch name = detached
# → abc1234 (HEAD -> main)  ← normal, HEAD on a branch`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "`git switch -` returns to the previous branch — exactly like `cd -` in the shell.",
              np: "`git switch -` ले अघिल्लो ब्रान्चमा फर्काउँछ — shell मा `cd -` जस्तै।",
              jp: "`git switch -` で直前のブランチに戻れます。シェルの `cd -` と同じ感覚です。",
            },
            {
              en: "Already switched away and lost your detached commits? Run `git reflog` to find their hashes — they remain in the object database until garbage collection runs.",
              np: "Switch गरेर detached commit गुमाउनुभयो? `git reflog` ले hash खोज्नुहोस् — GC नचल्नेसम्म object database मा छन्।",
              jp: "別ブランチに切り替えて detached コミットを失った場合、`git reflog` でハッシュを探してください。GC が走るまでオブジェクト DB に残っています。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Branching cheatsheet",
        np: "ब्रान्चिङ चिटसिट",
        jp: "ブランチ コマンド早見表",
      },
      blocks: [
        {
          type: "table",
          headers: [
            { en: "Command", np: "आदेश", jp: "コマンド" },
            { en: "What it does", np: "के गर्छ", jp: "作用" },
            { en: "When to use it", np: "कहिले प्रयोग गर्ने", jp: "使うタイミング" },
          ],
          rows: [
            [
              { en: "`git switch -c <name>`", np: "`git switch -c <name>`", jp: "`git switch -c <name>`" },
              { en: "Create a new branch and move HEAD there", np: "नयाँ ब्रान्च बनाउँछ र HEAD सार्छ", jp: "ブランチを作り HEAD を移動" },
              { en: "Starting any new feature, fix, or experiment", np: "नयाँ feature, fix, वा प्रयोग थाल्दा", jp: "新しい機能・修正・実験を始めるとき" },
            ],
            [
              { en: "`git switch <name>`", np: "`git switch <name>`", jp: "`git switch <name>`" },
              { en: "Move HEAD to an existing branch", np: "अवस्थित ब्रान्चमा HEAD सार्छ", jp: "既存ブランチへ HEAD を移動" },
              { en: "Switching between branches you already have", np: "पहिले नै भएका ब्रान्चबीच बदल्दा", jp: "既存ブランチを切り替えるとき" },
            ],
            [
              { en: "`git branch`", np: "`git branch`", jp: "`git branch`" },
              { en: "List all local branches; `*` marks current", np: "सबै स्थानीय ब्रान्च सूची; `*` ले हालको देखाउँछ", jp: "ローカルブランチ一覧。`*` が現在のブランチ" },
              { en: "Checking what branches exist before switching", np: "switch गर्नुअघि कुन ब्रान्च छन् जाँच्दा", jp: "切り替え前に既存ブランチを確認するとき" },
            ],
            [
              { en: "`git merge --no-ff <name>`", np: "`git merge --no-ff <name>`", jp: "`git merge --no-ff <name>`" },
              { en: "Merge a branch and always create a merge commit", np: "ब्रान्च merge गर्छ र सधैं merge commit बनाउँछ", jp: "マージコミットを必ず作りながらブランチを統合" },
              { en: "Merging a finished feature back into `main`", np: "सकिएको feature `main` मा merge गर्दा", jp: "完成した feature を `main` に取り込むとき" },
            ],
            [
              { en: "`git branch -d <name>`", np: "`git branch -d <name>`", jp: "`git branch -d <name>`" },
              { en: "Delete a branch that has already been merged", np: "पहिले नै merge भएको ब्रान्च मेटाउँछ", jp: "マージ済みのブランチを削除" },
              { en: "Cleaning up after a feature is merged", np: "feature merge भएपछि सफाई गर्दा", jp: "マージ後のブランチを掃除するとき" },
            ],
            [
              { en: "`git branch -m <old> <new>`", np: "`git branch -m <old> <new>`", jp: "`git branch -m <old> <new>`" },
              { en: "Rename a branch", np: "ब्रान्चको नाम बदल्छ", jp: "ブランチ名を変更" },
              { en: "Fixing a typo or clarifying the purpose of a branch", np: "नाममा टाइपो ठीक गर्दा वा उद्देश्य स्पष्ट पार्दा", jp: "タイポ修正や目的をより明確な名前にするとき" },
            ],
            [
              { en: "`git branch -a`", np: "`git branch -a`", jp: "`git branch -a`" },
              { en: "List local and remote-tracking branches", np: "स्थानीय र रिमोट-ट्र्याकिङ ब्रान्च दुवै सूची", jp: "ローカルとリモート追跡ブランチの両方を一覧" },
              { en: "Checking what branches exist on the remote after a `fetch`", np: "`fetch` पछि रिमोटमा कुन ब्रान्च छन् जाँच्दा", jp: "`fetch` 後にリモートのブランチを確認するとき" },
            ],
            [
              { en: "`git switch --detach <hash>`", np: "`git switch --detach <hash>`", jp: "`git switch --detach <hash>`" },
              { en: "Put HEAD in detached mode pointing at a specific commit", np: "HEAD लाई विशेष commit मा detached mode मा राख्छ", jp: "HEAD を特定コミットに向けた detached 状態にする" },
              { en: "Inspecting an old state without creating a branch — create a branch before switching away if you commit anything", np: "ब्रान्च नबनाई पुरानो अवस्था हेर्दा — commit गरे भने switch गर्नुअघि ब्रान्च बनाउनुहोस्", jp: "ブランチを作らずに旧状態を確認するとき — コミットしたら切り替え前にブランチを作ること" },
            ],
            [
              { en: "`git switch -`", np: "`git switch -`", jp: "`git switch -`" },
              { en: "Return to the previous branch (like `cd -` in the shell)", np: "अघिल्लो ब्रान्चमा फर्काउँछ (shell मा `cd -` जस्तै)", jp: "直前のブランチに戻る（シェルの `cd -` と同じ）" },
              { en: "Quickly toggling back after checking another branch or detached HEAD", np: "अर्को ब्रान्च वा detached HEAD हेरेपछि छिटो फर्कदा", jp: "別ブランチや detached HEAD を確認した後にすぐ戻るとき" },
            ],
          ],
        },
      ],
    },
  ],
  faq: GIT_DAY_3_FAQ,
  bullets: [
    {
      en: "Create two branches from main and merge one with --no-ff to see the merge bubble.",
      np: "main बाट दुई ब्रान्च बनाउनुहोस् र एउटा --no-ff सहित मर्ज गर्नुहोस्।",
      jp: "`--no-ff` でマージコミットの形を確認する。",
    },
  ],
};

export const GIT_DAY_4_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Remotes link your local repository to shared servers (GitHub, GitLab, etc.). `fetch` downloads objects without touching your work; `merge` or `rebase` integrates them; `push` publishes your commits for others to see.",
      np: "रिमोटले स्थानीय रेपो सर्भरसँग जोड्छ। `fetch` ले तपाईंको काम नछोई वस्तु डाउनलोड गर्छ; `merge`/`rebase` ले मिलाउँछ; `push` ले तपाईंको commit प्रकाशित गर्छ।",
      jp: "リモートでローカルリポジトリを共有サーバに接続します。`fetch` は作業に触れずダウンロードし、`merge`/`rebase` で統合し、`push` で公開します。",
    },
  ],
  sections: [
    {
      title: {
        en: "Why do you need remotes?",
        np: "रिमोट किन चाहिन्छ?",
        jp: "なぜリモートが必要か",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Your local repo lives only on your machine — if your laptop dies, all your commits are gone. Remotes solve two problems at once: backup (your history is stored on a server) and collaboration (teammates can pull your changes and push theirs). Without a remote, every code share would require copying files manually.",
            np: "तपाईंको स्थानीय रेपो केवल तपाईंको मेसिनमा छ — ल्यापटप बिग्रियो भने सबै commit गुम्छन्। रिमोटले दुई समस्या एकैपटक समाधान गर्छ: ब्याकअप र सहकार्य। रिमोट बिना कोड साझेदारी हातैले फाइल कपी गर्नु पर्थ्यो।",
            jp: "ローカルリポはあなたのマシンにしかありません。PCが壊れたら全コミットが消えます。リモートはバックアップと共同作業の2つを同時に解決します。リモートなしでは手動でファイルをやり取りするしかありません。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "`git fetch` — download new commits from the remote but do NOT change your working branch. Safe to run at any time.",
              np: "`git fetch` — रिमोटबाट नयाँ commit डाउनलोड गर्नुहोस् तर कार्यशील ब्रान्च परिवर्तन नगर्नुहोस्। जुनसुकै बेला चलाउन सुरक्षित।",
              jp: "`git fetch` — リモートから新しいコミットをダウンロードしますが、作業ブランチは変更しません。いつでも安全に実行できます。",
            },
            {
              en: "`git pull` — `fetch` + integrate (merge by default). Shorthand but less transparent — prefer `fetch` then `rebase` when you want control.",
              np: "`git pull` — `fetch` + एकीकरण (डिफल्टमा merge)। छोटो तर कम पारदर्शी — नियन्त्रण चाहिँदा `fetch` फिर `rebase` रोज्नुहोस्।",
              jp: "`git pull` — `fetch` ＋ 統合（既定は merge）。手軽だが不透明。制御したいなら `fetch` → `rebase` が明示的です。",
            },
            {
              en: "`git push` — publish your local commits to the remote so others can see and pull them.",
              np: "`git push` — तपाईंको स्थानीय commit रिमोटमा प्रकाशित गर्नुहोस् ताकि अरूले देख्न र pull गर्न सकून्।",
              jp: "`git push` — ローカルのコミットをリモートに公開し、他者が取り込めるようにします。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Fetch vs pull vs push",
        np: "Fetch बनाम pull बनाम push",
        jp: "fetch / pull / push",
      },
      blocks: [
        { type: "diagram", id: "git-fetch-pull-push" },
        {
          type: "table",
          caption: {
            en: "Quick reference",
            np: "छिटो सन्दर्भ",
            jp: "早見表",
          },
          headers: [
            { en: "Command", np: "आदेश", jp: "コマンド" },
            { en: "Effect", np: "प्रभाव", jp: "作用" },
          ],
          rows: [
            [
              { en: "`git fetch origin`", np: "`git fetch origin`", jp: "`git fetch origin`" },
              {
                en: "Updates remote-tracking branches only — your local branch is untouched",
                np: "रिमोट-ट्र्याकिङ ब्रान्च मात्र अद्यावधिक — स्थानीय ब्रान्च अछुतो",
                jp: "リモート追跡ブランチのみ更新 — ローカルブランチは変わらない",
              },
            ],
            [
              { en: "`git pull`", np: "`git pull`", jp: "`git pull`" },
              {
                en: "`fetch` + merge (default) or rebase (config) — updates your local branch",
                np: "`fetch` + merge वा rebase — स्थानीय ब्रान्च अद्यावधिक गर्छ",
                jp: "fetch に続き merge（既定）または rebase — ローカルブランチが変わる",
              },
            ],
            [
              { en: "`git push origin main`", np: "`git push origin main`", jp: "`git push origin main`" },
              {
                en: "Publishes local commits to remote so teammates can fetch them",
                np: "स्थानीय commit रिमोटमा पठाउँछ ताकि टीममेटले fetch गर्न सकून्",
                jp: "ローカルコミットをリモートへ送り、チームメンバーが取り込めるようにする",
              },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "A typical daily sync with the remote",
            np: "रिमोटसँग सामान्य दैनिक sync",
            jp: "リモートとの典型的な日次同期",
          },
          code: `# Connect a local repo to a remote for the first time
# (skip this if you cloned — origin is already set)
git remote add origin https://github.com/you/my-project.git

# Download what teammates pushed — safe, doesn't touch your work
git fetch origin

# See if main moved ahead of your local branch
git log --oneline main..origin/main

# Integrate the remote changes into your local branch
# --rebase keeps history linear instead of adding a merge commit
git pull --rebase origin main

# Share your new commits with the team
git push origin main`,
        },
      ],
    },
    {
      title: { en: "Remotes cheatsheet", np: "रिमोट चिटसिट", jp: "リモートコマンド早見表" },
      blocks: [
        {
          type: "table",
          headers: [
            { en: "Command", np: "आदेश", jp: "コマンド" },
            { en: "What it does", np: "के गर्छ", jp: "作用" },
            { en: "When to use it", np: "कहिले प्रयोग गर्ने", jp: "使うタイミング" },
          ],
          rows: [
            [
              { en: "`git clone <url>`", np: "`git clone <url>`", jp: "`git clone <url>`" },
              { en: "Copy a remote repo locally with full history and `origin` set", np: "पूर्ण इतिहास र `origin` सहित रिमोट रेपो स्थानीय रूपमा प्रतिलिपि गर्छ", jp: "全履歴と `origin` 付きでリモートリポをローカルに複製" },
              { en: "Starting work on an existing project", np: "अवस्थित परियोजनामा काम थाल्दा", jp: "既存プロジェクトの作業を始めるとき" },
            ],
            [
              { en: "`git remote add origin <url>`", np: "`git remote add origin <url>`", jp: "`git remote add origin <url>`" },
              { en: "Link a local repo to a remote for the first time", np: "पहिलो पटक स्थानीय रेपोलाई रिमोटसँग जोड्छ", jp: "ローカルリポを初めてリモートに接続" },
              { en: "After `git init` when you want to push to GitHub/GitLab", np: "`git init` पछि GitHub/GitLab मा push गर्दा", jp: "`git init` 後に GitHub/GitLab へ push したいとき" },
            ],
            [
              { en: "`git remote -v`", np: "`git remote -v`", jp: "`git remote -v`" },
              { en: "List all remotes and their URLs", np: "सबै remote र तिनका URL सूची देखाउँछ", jp: "全リモートとその URL を一覧表示" },
              { en: "Checking what remotes are configured before a push or fetch", np: "push वा fetch अघि कुन remote छन् जाँच्दा", jp: "push や fetch の前に設定済みリモートを確認するとき" },
            ],
            [
              { en: "`git fetch origin`", np: "`git fetch origin`", jp: "`git fetch origin`" },
              { en: "Download remote changes without touching your local branch", np: "स्थानीय ब्रान्च नछोई रिमोट परिवर्तन डाउनलोड गर्छ", jp: "ローカルブランチを変えずにリモートの更新をダウンロード" },
              { en: "Safely checking what teammates pushed before you integrate", np: "integrate गर्नुअघि टीममेटले के push गरे सुरक्षित रूपमा जाँच्दा", jp: "統合前にチームメンバーの変更を安全に確認するとき" },
            ],
            [
              { en: "`git pull --rebase origin main`", np: "`git pull --rebase origin main`", jp: "`git pull --rebase origin main`" },
              { en: "Fetch + replay your commits on top of updated main", np: "fetch गरी अद्यावधिक main माथि commit पुन: चलाउँछ", jp: "fetch して更新された main の上に自分のコミットを積み直す" },
              { en: "Keeping your branch up to date without a merge commit", np: "merge commit बिना ब्रान्च अद्यावधिक राख्दा", jp: "マージコミットなしでブランチを最新に保つとき" },
            ],
            [
              { en: "`git push origin <branch>`", np: "`git push origin <branch>`", jp: "`git push origin <branch>`" },
              { en: "Publish local commits to the remote branch", np: "स्थानीय commit रिमोट ब्रान्चमा प्रकाशित गर्छ", jp: "ローカルのコミットをリモートブランチに公開" },
              { en: "Sharing your work with the team or opening a pull request", np: "टोलीसँग काम साझा गर्दा वा PR खोल्दा", jp: "チームと作業を共有したり PR を開くとき" },
            ],
            [
              { en: "`git push -u origin <branch>`", np: "`git push -u origin <branch>`", jp: "`git push -u origin <branch>`" },
              { en: "Push and set the upstream so future `git push` needs no arguments", np: "push गरी upstream सेट गर्छ — भविष्यमा `git push` ले argument चाहिँदैन", jp: "push して upstream を設定 — 以後 `git push` だけで OK" },
              { en: "First push of a brand-new branch", np: "नयाँ ब्रान्चको पहिलो push", jp: "新しいブランチを初めて push するとき" },
            ],
          ],
        },
      ],
    },
  ],
  faq: GIT_DAY_4_FAQ,
  bullets: [
    {
      en: "Clone a repo with `git clone --depth 1` and inspect `git remote -v`.",
      np: "`git clone --depth 1` प्रयोग गर्नुहोस्।",
      jp: "浅い clone で `git remote -v` を確認する。",
    },
  ],
};

export const GIT_DAY_5_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Rebase replays your commits on top of another branch tip to keep history linear and easy to read. Merge preserves the exact branch topology. Both are valid — teams pick one rule and stick to it.",
      np: "Rebase ले तपाईंको commit अर्को ब्रान्चको टिपमाथि फेरि चलाउँछ — इतिहास रेखीय र पढ्न सजिलो। मर्जले टोपोलोजी जोगाउँछ। दुवै वैध।",
      jp: "リベースはコミットを別ブランチの先端に積み直し、履歴を直線化します。マージは分岐の形を残します。どちらも有効 — チームで方針を決めて統一します。",
    },
  ],
  sections: [
    {
      title: {
        en: "Why rebase instead of always merging?",
        np: "सधैं merge नगरी rebase किन?",
        jp: "なぜマージだけでなくリベースするのか",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A project with many contributors and always-merge policy ends up with a history that looks like spaghetti — dozens of merge commits crisscrossing the graph. Rebase keeps the story linear: every commit reads like a clean chapter in sequence. It also means `git bisect` and `git log` stay fast and readable on a large project.",
            np: "धेरै योगदानकर्ता भएको परियोजनामा सधैं merge गर्दा इतिहास स्प्याघेटी जस्तो देखिन्छ — धेरै merge commit अनर्गल। Rebase ले कथा रेखीय राख्छ: हरेक commit क्रमिक अध्याय जस्तो। `git bisect` र `git log` पनि सजिलो।",
            jp: "merge だけ使うと、多くの貢献者がいるプロジェクトの履歴はスパゲッティになります。リベースなら全コミットが一直線に並び、`git bisect` や `git log` が大規模プロジェクトでも速く読みやすいままです。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Use rebase when you want a clean, linear history that is easy to read and bisect.",
              np: "Rebase प्रयोग गर्नुहोस् जब तपाईंलाई सफा, रेखीय इतिहास चाहिन्छ।",
              jp: "リベースを使う — 直線的で読みやすい履歴が欲しいとき。",
            },
            {
              en: "Use merge when you want the historical record of when branches diverged and converged.",
              np: "Merge प्रयोग गर्नुहोस् जब ब्रान्च कहिले छुट्टियो र मिल्यो भन्ने ऐतिहासिक अभिलेख चाहिन्छ।",
              jp: "マージを使う — ブランチがいつ分岐・合流したかの歴史的記録を残したいとき。",
            },
            {
              en: "Golden rule — never rebase commits that are already on someone else's machine unless you have a team recovery plan. Rewriting shared history forces everyone to reconcile.",
              np: "सुनौलो नियम — अरूको मेसिनमा पुगेको commit rebase नगर्नुहोस्। साझा इतिहास पुनर्लेखनले सबैलाई समस्या गर्छ।",
              jp: "黄金律 — 他者が既に持つコミットは勝手にリベースしない。共有履歴の書き換えは全員に影響します。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Linearizing with rebase",
        np: "Rebase सँग रेखीय बनाउने",
        jp: "リベースで直線化",
      },
      blocks: [
        { type: "diagram", id: "git-rebase-linearize" },
        {
          type: "code",
          title: {
            en: "Keeping a feature branch up to date with main",
            np: "feature ब्रान्चलाई main सँग अद्यावधिक राख्ने",
            jp: "feature ブランチを main に追随させる",
          },
          code: `# You are on feature/payment and main has moved ahead.
# Instead of a merge commit, replay your work on top of main.

git switch main
git pull origin main         # get the latest main first

git switch feature/payment
git rebase main              # replay your commits on top of updated main

# If a conflict appears mid-rebase:
# 1. Fix the conflict markers in the file
# 2. Stage the resolved file
git add src/payment.ts
# 3. Continue replaying the remaining commits
git rebase --continue

# Changed your mind? Abort and go back to before rebase started
git rebase --abort`,
        },
      ],
    },
    {
      title: {
        en: "Interactive rebase — rewriting local history",
        np: "Interactive rebase — स्थानीय इतिहास पुनर्लेखन",
        jp: "インタラクティブリベース — ローカル履歴の書き換え",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Before opening a PR your branch might have 'wip' commits, duplicate fixes, or debug logs you saved as commits. Interactive rebase lets you tidy the branch into a clean story before anyone else sees it — squashing noise into meaningful commits, dropping experiments, and rewording vague messages.",
            np: "PR खोल्नुअघि तपाईंको ब्रान्चमा 'wip' commit, duplicate fix, वा debug log हुन सक्छन्। Interactive rebase ले अरूले देख्नुअघि ब्रान्चलाई सफा कथामा परिणत गर्न दिन्छ।",
            jp: "PR を開く前、ブランチに 'wip' コミットや重複修正、デバッグログが混じっていることがあります。インタラクティブリベースで他者が見る前に整理し、意味のあるコミットにまとめられます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Interactive rebase example",
            np: "Interactive rebase उदाहरण",
            jp: "インタラクティブリベースの例",
          },
          code: `# You have 3 commits on your branch that you want to clean up
# before opening a pull request
git rebase -i HEAD~3

# An editor opens showing your commits oldest-first:
# pick a1b2c3 fix typo in README
# pick d4e5f6 add login route
# pick 7890ab wip: debugging — do not merge

# Edit the file to clean up the history:
# pick a1b2c3 fix typo in README
# squash d4e5f6 add login route    <- combine with commit above
# drop 7890ab wip: debugging       <- remove entirely

# Save and close → Git replays and opens a commit message editor
# for the squashed commit so you can write a clean final message`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "`squash` merges a commit into the one above it and asks you to edit the combined message; `fixup` does the same silently (uses the top message).",
              np: "`squash` ले माथिको commit सँग मिलाउँछ र सन्देश सोध्छ; `fixup` ले चुपचाप मिलाउँछ।",
              jp: "`squash` は上のコミットに統合してメッセージ編集を求め、`fixup` は黙って統合（上のメッセージを使用）します。",
            },
            {
              en: "If a conflict arises mid-rebase, resolve it, `git add` the file, then run `git rebase --continue`. Use `git rebase --abort` to cancel.",
              np: "rebase बीचमा conflict आए, सुल्झाउनुहोस्, `git add` गर्नुहोस्, अनि `git rebase --continue`। रद्द गर्न `git rebase --abort`।",
              jp: "途中でコンフリクトが起きたら解消して `git add` → `git rebase --continue`。中止は `git rebase --abort`。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Rebase cheatsheet", np: "Rebase चिटसिट", jp: "リベースコマンド早見表" },
      blocks: [
        {
          type: "table",
          headers: [
            { en: "Command", np: "आदेश", jp: "コマンド" },
            { en: "What it does", np: "के गर्छ", jp: "作用" },
            { en: "When to use it", np: "कहिले प्रयोग गर्ने", jp: "使うタイミング" },
          ],
          rows: [
            [
              { en: "`git rebase <branch>`", np: "`git rebase <branch>`", jp: "`git rebase <branch>`" },
              { en: "Replay your commits on top of another branch tip", np: "तपाईंको commit अर्को ब्रान्चको टिपमाथि पुन: चलाउँछ", jp: "自分のコミットを別ブランチの先端に積み直す" },
              { en: "Updating a feature branch with new commits from main without a merge commit", np: "merge commit बिना main को नयाँ commit सहित feature branch अद्यावधिक गर्दा", jp: "マージコミットなしで feature ブランチを main の最新に追随させるとき" },
            ],
            [
              { en: "`git rebase -i HEAD~n`", np: "`git rebase -i HEAD~n`", jp: "`git rebase -i HEAD~n`" },
              { en: "Interactively rewrite the last n commits (squash, drop, reword, reorder)", np: "अन्तिम n commit अन्तरक्रियात्मक रूपमा पुनर्लेखन — squash, drop, reword, reorder", jp: "最新 n コミットを対話的に書き換え（squash・drop・reword・並べ替え）" },
              { en: "Cleaning up messy WIP commits before opening a PR", np: "PR खोल्नुअघि गन्दा WIP commit सफा गर्दा", jp: "PR を開く前に汚れた WIP コミットを整理するとき" },
            ],
            [
              { en: "`git rebase --continue`", np: "`git rebase --continue`", jp: "`git rebase --continue`" },
              { en: "Resume replaying commits after resolving a conflict", np: "conflict समाधान गरेपछि commit पुन: चलाउन जारी राख्छ", jp: "コンフリクト解消後にコミットの積み直しを再開" },
              { en: "After fixing a conflict that stopped the rebase mid-way", np: "rebase बीचमा रोकिएको conflict ठीक गरेपछि", jp: "途中で止まったコンフリクトを解消した後" },
            ],
            [
              { en: "`git rebase --abort`", np: "`git rebase --abort`", jp: "`git rebase --abort`" },
              { en: "Cancel the rebase and restore the branch to its state before it started", np: "rebase रद्द गर्छ र ब्रान्च सुरु हुनुअघिको अवस्थामा फर्काउँछ", jp: "リベースをキャンセルし、開始前の状態に戻す" },
              { en: "When conflicts are too complex or you changed your mind", np: "conflict जटिल भयो वा विचार बदल्दा", jp: "コンフリクトが複雑すぎるとき、または方針を変えたとき" },
            ],
            [
              { en: "`git pull --rebase`", np: "`git pull --rebase`", jp: "`git pull --rebase`" },
              { en: "Pull remote changes and replay your local commits on top instead of merging", np: "रिमोट परिवर्तन pull गरी merge को सट्टा माथि commit पुन: चलाउँछ", jp: "リモートの変更を取り込みつつ、マージではなくリベースで履歴を直線化" },
              { en: "Syncing with the remote while keeping a linear history", np: "रेखीय इतिहास राख्दै रिमोटसँग sync गर्दा", jp: "直線的な履歴を保ちながらリモートと同期するとき" },
            ],
          ],
        },
      ],
    },
  ],
  faq: GIT_DAY_5_FAQ,
  bullets: [
    {
      en: "Try `git pull --rebase` on a toy branch and compare the graph to merge.",
      np: "खेलौना ब्रान्चमा `git pull --rebase` प्रयास गर्नुहोस्।",
      jp: "練習ブランチで `git pull --rebase` とマージのログを比較する。",
    },
  ],
};

export const GIT_DAY_6_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Stash shelves dirty work so you can switch context without committing half-finished changes. Cherry-pick copies a single commit by hash. Reset moves HEAD — soft keeps your changes staged, mixed unstages them, hard discards them entirely.",
      np: "Stash ले अधूरो काम अलग राख्छ ताकि अधूरो commit बिना सन्दर्भ बदल्न सकिन्छ। Cherry-pick ले एउटा commit कपी गर्छ। Reset ले HEAD सार्छ — soft staged राख्छ, mixed unstage गर्छ, hard पूर्ण मेटाउँछ।",
      jp: "stash で未完の変更を棚上げし、commit なしにコンテキストを切り替えます。cherry-pick は1コミットをコピー。reset は HEAD を移動し、soft はステージ済みを保持、mixed はアンステージ、hard は全破棄します。",
    },
    {
      en: "`git worktree` adds another working directory that shares the same `.git` database — switch contexts without cloning twice or constantly stashing.",
      np: "`git worktree` ले अर्को कार्य निर्देशिका थप्छ जसले एउटै `.git` साझा गर्छ — दुई पटक clone वा सधैं stash बिना सन्दर्भ बदल्नुहोस्।",
      jp: "`git worktree` で同じ `.git` を共有する別の作業ディレクトリを追加できます。clone を増やさず、stash 地獄も避けられます。",
    },
  ],
  sections: [
    {
      title: {
        en: "Why stash — and when to use reset",
        np: "Stash किन — र reset कहिले प्रयोग गर्ने",
        jp: "なぜ stash するのか、reset はいつ使うのか",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "You are mid-feature when your manager asks for an urgent hotfix on `main`. Your changes are not ready to commit. Without stash you have two bad options: commit messy WIP or lose your changes. Stash saves everything cleanly so you can switch branches and come back exactly where you left off.",
            np: "तपाईं feature बीचमा हुनुहुन्छ र manager ले `main` मा तत्काल hotfix माग्नुहुन्छ। तपाईंका परिवर्तन commit को लागि तयार छैनन्। Stash बिना दुईटा खराब विकल्प: गन्दा WIP commit वा परिवर्तन गुमाउने। Stash ले सफासँग सबै बचाउँछ।",
            jp: "feature の途中でマネージャーから `main` の緊急修正を頼まれました。変更はまだコミットできる状態ではありません。stash なしでは「汚い WIP をコミット」か「変更を捨てる」しかありません。stash で綺麗に保存し、そのまま戻れます。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "`git stash push` — saves dirty working tree and index, leaving a clean checkout.",
              np: "`git stash push` — गन्दो कार्य ट्री र index बचाउँछ, सफा checkout छोड्छ।",
              jp: "`git stash push` — 汚れた作業ツリーとインデックスを保存してクリーンな状態にします。",
            },
            {
              en: "`git stash pop` — restores the most recent stash and removes it from the stash list.",
              np: "`git stash pop` — हालिएको stash पुनर्स्थापित गर्छ र सूचीबाट हटाउँछ।",
              jp: "`git stash pop` — 最新の stash を復元してリストから削除します。",
            },
            {
              en: "`git stash list` — see all stashes with their index; `git stash pop stash@{2}` to restore a specific one.",
              np: "`git stash list` — index सहित सबै stash हेर्नुहोस्।",
              jp: "`git stash list` で全 stash とインデックスを確認し、`git stash pop stash@{2}` で特定のものを復元。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Stash workflow",
        np: "Stash कार्यप्रवाह",
        jp: "stash の流れ",
      },
      blocks: [
        { type: "diagram", id: "git-stash-pop" },
        {
          type: "code",
          title: {
            en: "Stash, fix a hotfix, return to your work",
            np: "Stash, hotfix गर्नुहोस्, काममा फर्कनुहोस्",
            jp: "stash して hotfix し、作業に戻る",
          },
          code: `# You're mid-feature — save your work-in-progress with a label
git stash push -m "wip: half-done payment form"

# Switch to main and create a hotfix branch
git switch main
git switch -c fix/login-crash

# Fix the bug and ship it
git add src/auth.ts
git commit -m "fix: prevent crash when token is null"
git switch main
git merge --no-ff fix/login-crash
git push origin main

# Come back to your feature exactly where you left off
git switch feature/payment
git stash pop`,
        },
        {
          type: "paragraph",
          text: {
            en: "`git reset` moves HEAD to a different commit — the mode controls what happens to your changes. Use `--soft` to undo a commit but keep your work staged, `--mixed` to unstage it, and `--hard` only when you truly want to erase everything.",
            np: "`git reset` ले HEAD अर्को commit मा सार्छ — mode ले तपाईंका परिवर्तनमा के हुन्छ भन्ने नियन्त्रण गर्छ। `--soft` ले commit पूर्वावस्थामा ल्याउँछ तर काम staged राख्छ, `--mixed` ले unstage गर्छ, `--hard` ले सबै मेटाउँछ।",
            jp: "`git reset` は HEAD を別のコミットに移動します。モードが変更の扱いを決めます。`--soft` はコミットを取り消しつつステージ済みを保持、`--mixed` はアンステージ、`--hard` は本当に全部消したいときだけ使います。",
          },
        },
        {
          type: "code",
          title: { en: "Reset modes — when to use each", np: "Reset मोड — कहिले कुन प्रयोग गर्ने", jp: "reset のモード — 使い分け" },
          code: `# --soft: undo the last commit but keep changes staged
# Use when: you want to rewrite the commit message or split it
git reset --soft HEAD~1

# --mixed (default): undo the commit AND unstage the changes
# Use when: you want to re-examine what you staged before re-committing
git reset --mixed HEAD~1

# --hard: undo the commit AND discard all changes in the file
# Use when: you want to completely throw away the last commit
# WARNING: this cannot be undone easily
git reset --hard HEAD~1

# Accidentally ran --hard? Recover via reflog (fast — before GC runs)
git reflog                    # find the lost commit hash
git checkout <lost-hash>      # inspect it
git switch -c recovery/branch # save it on a new branch`,
        },
      ],
    },
    {
      title: {
        en: "git reflog — your safety net",
        np: "git reflog — तपाईंको सुरक्षा जाल",
        jp: "git reflog — セーフティネット",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The reflog is a local journal that records every time HEAD moved — branch switches, resets, rebases, merges, and commits all appear here. It is the primary way to recover commits after `git reset --hard` or an accidental branch delete, as long as Git's garbage collection has not run yet (default 90-day window).",
            np: "Reflog एउटा स्थानीय जर्नल हो जसले HEAD सरेको हरेक पटक रेकर्ड गर्छ — branch switch, reset, rebase, merge, र commit सबै। `git reset --hard` वा ब्रान्च हटाएपछि commit पुनः प्राप्त गर्ने मुख्य तरिका हो, जबसम्म GC नचल्ला (सामान्यतः ९० दिन)।",
            jp: "reflog は HEAD が動くたびに記録するローカルの日誌です。ブランチ切り替え・reset・rebase・マージ・コミットすべてが残ります。`git reset --hard` や誤ったブランチ削除後にコミットを救う主な手段ですが、GC（デフォルト90日）が走ると消えます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Recover a commit after git reset --hard",
            np: "git reset --hard पछि commit पुनर्प्राप्ति",
            jp: "git reset --hard 後にコミットを救出する",
          },
          code: `# You ran this by accident:
git reset --hard HEAD~3   # oops — 3 commits gone from branch pointer

# Step 1: open the reflog — every HEAD movement is listed with a timestamp
git reflog
# → a1b2c3d HEAD@{0}: reset: moving to HEAD~3
# → d4e5f6a HEAD@{1}: commit: feat: add payment form    ← the lost commit
# → 7g8h9i0 HEAD@{2}: commit: fix: handle null response
# → ...

# Step 2: verify the lost commit is what you expect
git show d4e5f6a

# Step 3a: restore by creating a new branch at the recovered hash
git switch -c recovery/rescued d4e5f6a

# Step 3b: or move the current branch pointer back to that point
git reset --hard d4e5f6a`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "The reflog is local only — it is not shared with remotes and does not survive a fresh clone. On a shared server the reflog belongs to the server's own `.git`.",
              np: "Reflog केवल स्थानीय हो — रिमोटसँग साझा हुँदैन र नयाँ clone मा जीवित रहँदैन।",
              jp: "reflog はローカルのみです。リモートとは共有されず、新しい clone には含まれません。",
            },
            {
              en: "`git reflog show <branch>` shows the history for a specific branch, not just HEAD — useful if you deleted a branch and want to find its last commit.",
              np: "`git reflog show <branch>` ले HEAD मात्र नभई विशेष ब्रान्चको इतिहास देखाउँछ — ब्रान्च मेटाएर अन्तिम commit खोज्दा उपयोगी।",
              jp: "`git reflog show <branch>` で HEAD だけでなく特定ブランチの履歴を確認できます。削除したブランチの最終コミットを探すときに便利です。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Cherry-pick — copying one commit",
        np: "Cherry-pick — एउटा commit कपी गर्ने",
        jp: "Cherry-pick — 1コミットのコピー",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Imagine your team has a `release/v2` branch and `main`. A critical bug is fixed on `main` with one commit, but the full `main` is not ready to ship yet. Cherry-pick lets you copy just that one fix onto `release/v2` without pulling in any of the other unfinished work on `main`.",
            np: "कल्पना गर्नुहोस् `release/v2` र `main` ब्रान्च छन्। `main` मा एउटा commit ले critical bug ठीक गरियो, तर पूरै `main` अझ ship गर्न तयार छैन। Cherry-pick ले `main` का अन्य अधूरो काम नतानी त्यो एउटा fix मात्र `release/v2` मा कपी गर्न दिन्छ।",
            jp: "`release/v2` と `main` の2つのブランチがある状況を考えます。`main` の1つのコミットで重大なバグを修正したが、`main` 全体はまだリリースできません。cherry-pick を使えば、`main` の未完成な作業を引き込まずに、その修正コミットだけを `release/v2` にコピーできます。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Use it sparingly — cherry-picking the same fix across many branches creates duplicate commits that diverge over time and are hard to track.",
              np: "सावधानीपूर्वक प्रयोग गर्नुहोस् — धेरै ब्रान्चमा एउटै fix cherry-pick गर्दा duplicate commit बन्छन् जो समयसँगै diverge हुन्छन्।",
              jp: "多用は避ける — 同じ修正を複数ブランチに cherry-pick すると、時間とともに diverge する重複コミットが生じ追跡が困難になります。",
            },
            {
              en: "Find the hash first — run `git log --oneline` on the source branch to locate the exact commit hash you want to copy.",
              np: "पहिले hash खोज्नुहोस् — कपी गर्न चाहिएको commit hash खोज्न source ब्रान्चमा `git log --oneline` चलाउनुहोस्।",
              jp: "先にハッシュを探す — コピーしたいコミットのハッシュを調べるには、ソースブランチで `git log --oneline` を実行します。",
            },
            {
              en: "Conflicts can occur — if the target branch diverged significantly, cherry-pick may need manual conflict resolution just like a merge.",
              np: "conflict हुन सक्छ — target ब्रान्च धेरै diverge भएको छ भने cherry-pick मा merge जस्तै conflict समाधान गर्नुपर्न सक्छ।",
              jp: "コンフリクトが起きることもある — ターゲットブランチが大きく diverge していると、マージと同様に手動でコンフリクトを解消する必要があります。",
            },
          ],
        },
        {
          type: "code",
          title: {
            en: "Cherry-picking a hotfix onto a release branch",
            np: "Release branch मा hotfix cherry-pick गर्ने",
            jp: "リリースブランチにホットフィックスを cherry-pick する",
          },
          code: `# The bug fix was committed on main — find its hash
git switch main
git log --oneline -n 10
# → a3f9d12 fix: prevent null pointer crash in payment parser
# → 89c2e01 feat: add experimental checkout redesign   ← not ready
# → ...

# Switch to the release branch — you only want the fix, not the feature
git switch release/v2

# Copy exactly that one commit by its hash
git cherry-pick a3f9d12

# Git applies the diff and creates a new commit on release/v2
# The new commit has a different hash but the same changes

# If a conflict occurs mid-cherry-pick:
# 1. Fix the conflict markers in the file
git add src/payment.ts
# 2. Finish the cherry-pick
git cherry-pick --continue

# Changed your mind? Abort and go back to before cherry-pick started
git cherry-pick --abort

# Push the release branch with the fix applied
git push origin release/v2`,
        },
      ],
    },
    {
      title: {
        en: "Git worktree — parallel checkouts",
        np: "Git worktree — समानान्तर checkout",
        jp: "Git worktree — 並行チェックアウト",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Use worktrees when you must fix `main` while your feature branch is mid-refactor: each directory has its own HEAD, index, and untracked files, but blobs and commits are deduplicated in one object store.",
            np: "feature माझै हुँदा `main` मर्मत गर्नुपर्दा worktree प्रयोग गर्नुहोस्: प्रत्येक फोल्डरमा आफ्नो HEAD र index, वस्तु एउटै भण्डारमा।",
            jp: "feature の大規模変更の最中に main の緊急修正が要るときに有効です。各ディレクトリは独自の HEAD／index を持ち、オブジェクトは共有されます。",
          },
        },
        { type: "diagram", id: "git-worktree" },
        {
          type: "code",
          title: {
            en: "Add a worktree for a hotfix without touching your feature",
            np: "feature नछोई hotfix को लागि worktree थप्नुहोस्",
            jp: "feature に触れずに hotfix 用の worktree を追加する",
          },
          code: `# You are deep in a refactor on feature/dashboard.
# A critical bug just appeared on main.
# Instead of stashing everything, open main in a sibling folder.

# Create a new folder ../myapp-hotfix checked out on a new branch
git worktree add ../myapp-hotfix -b hotfix/null-pointer

# Go fix the bug in the separate folder — your feature stays untouched
cd ../myapp-hotfix
git add src/utils.ts
git commit -m "fix: guard against null pointer in parser"
git push origin hotfix/null-pointer

# See all active worktrees
git worktree list
# → /Users/you/myapp            main
# → /Users/you/myapp-hotfix     hotfix/null-pointer

# Remove the hotfix folder and unregister the worktree
git worktree remove ../myapp-hotfix`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "You cannot check out the same branch in two active worktrees — pick a new branch name or detach HEAD intentionally.",
              np: "एउटै ब्रान्च दुई सक्रिय worktree मा checkout गर्न मिल्दैन — नयाँ ब्रान्च वा जानाजानी detached HEAD।",
              jp: "同じブランチを2つの worktree で同時に checkout できません。別ブランチか意図的な detached HEAD にします。",
            },
            {
              en: "Prune stale metadata after manual folder deletes: `git worktree prune`.",
              np: "फोल्डर मेटाएपछि: `git worktree prune`।",
              jp: "手でフォルダを消したあとは `git worktree prune` でメタデータを整理。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Stash / Reset / Worktree cheatsheet", np: "Stash / Reset / Worktree चिटसिट", jp: "stash / reset / worktree コマンド早見表" },
      blocks: [
        {
          type: "table",
          headers: [
            { en: "Command", np: "आदेश", jp: "コマンド" },
            { en: "What it does", np: "के गर्छ", jp: "作用" },
            { en: "When to use it", np: "कहिले प्रयोग गर्ने", jp: "使うタイミング" },
          ],
          rows: [
            [
              { en: "`git stash push -m \"...\"`", np: "`git stash push -m \"...\"`", jp: "`git stash push -m \"...\"`" },
              { en: "Save WIP with a descriptive label and clean the working tree", np: "WIP लेबलसहित बचाउँछ र कार्य ट्री सफा गर्छ", jp: "説明ラベル付きで WIP を保存し、作業ツリーをクリーンにする" },
              { en: "Switching context without committing half-finished work", np: "अधूरो काम commit नगरी सन्दर्भ बदल्दा", jp: "未完の作業をコミットせずにコンテキストを切り替えるとき" },
            ],
            [
              { en: "`git stash pop`", np: "`git stash pop`", jp: "`git stash pop`" },
              { en: "Restore the most recent stash and remove it from the list", np: "हालिएको stash पुनर्स्थापित गर्छ र सूचीबाट हटाउँछ", jp: "最新の stash を復元してリストから削除" },
              { en: "Returning to your work after the context switch is done", np: "सन्दर्भ बदलेपछि आफ्नो कामतिर फर्कदा", jp: "コンテキスト切り替え後に作業に戻るとき" },
            ],
            [
              { en: "`git stash list`", np: "`git stash list`", jp: "`git stash list`" },
              { en: "Show all saved stashes with their index numbers", np: "सबै saved stash index नम्बरसहित देखाउँछ", jp: "保存済みの全 stash をインデックス番号付きで表示" },
              { en: "Checking what you have stashed before restoring a specific one", np: "विशेष stash पुनर्स्थापित गर्नुअघि जाँच्दा", jp: "特定の stash を復元する前に一覧を確認するとき" },
            ],
            [
              { en: "`git cherry-pick <hash>`", np: "`git cherry-pick <hash>`", jp: "`git cherry-pick <hash>`" },
              { en: "Copy one specific commit onto the current branch", np: "एउटा विशेष commit हालको ब्रान्चमा कपी गर्छ", jp: "特定の1コミットを現在のブランチにコピー" },
              { en: "Applying a hotfix from another branch without merging everything", np: "सबै merge नगरी अर्को ब्रान्चबाट hotfix लगाउँदा", jp: "全部マージせずに別ブランチの修正だけ取り込むとき" },
            ],
            [
              { en: "`git reset --soft HEAD~1`", np: "`git reset --soft HEAD~1`", jp: "`git reset --soft HEAD~1`" },
              { en: "Undo the last commit but keep changes staged", np: "अन्तिम commit पूर्वावस्थामा ल्याउँछ तर परिवर्तन staged राख्छ", jp: "直近コミットを取り消しつつ変更をステージ済みのまま保持" },
              { en: "Rewriting the commit message or splitting one commit into two", np: "commit सन्देश पुनर्लेखन वा एउटा commit दुईमा बाँड्दा", jp: "コミットメッセージの書き直しや1つのコミットを2つに分けるとき" },
            ],
            [
              { en: "`git reset --mixed HEAD~1`", np: "`git reset --mixed HEAD~1`", jp: "`git reset --mixed HEAD~1`" },
              { en: "Undo the last commit and unstage the changes", np: "अन्तिम commit पूर्वावस्थामा ल्याउँछ र परिवर्तन unstage गर्छ", jp: "直近コミットを取り消して変更をアンステージ" },
              { en: "Re-examining and re-staging changes before committing again", np: "फेरि commit गर्नुअघि परिवर्तन पुनः जाँच्दा", jp: "再度ステージし直してコミットし直したいとき" },
            ],
            [
              { en: "`git reset --hard HEAD~1`", np: "`git reset --hard HEAD~1`", jp: "`git reset --hard HEAD~1`" },
              { en: "Undo the last commit AND discard all changes permanently", np: "अन्तिम commit पूर्वावस्थामा ल्याउँछ र सबै परिवर्तन स्थायी रूपमा मेटाउँछ", jp: "直近コミットを取り消してすべての変更を完全に破棄" },
              { en: "Throwing away a bad commit entirely — destructive, use with care", np: "खराब commit पूर्ण रूपमा फाल्दा — विनाशकारी, सावधानी", jp: "不要なコミットを完全に捨てるとき — 破壊的。慎重に" },
            ],
            [
              { en: "`git worktree add <path> -b <branch>`", np: "`git worktree add <path> -b <branch>`", jp: "`git worktree add <path> -b <branch>`" },
              { en: "Create a second working directory on a new branch, sharing `.git`", np: "नयाँ ब्रान्चमा दोस्रो कार्य निर्देशिका बनाउँछ, `.git` साझा गर्दै", jp: "`.git` を共有しながら新しいブランチで別の作業ディレクトリを作成" },
              { en: "Working on a hotfix while a long refactor is in progress", np: "लामो refactor बीचमा hotfix गर्दा", jp: "長いリファクタ中に別の修正を並行して進めるとき" },
            ],
            [
              { en: "`git worktree list`", np: "`git worktree list`", jp: "`git worktree list`" },
              { en: "Show all active worktrees with their paths and branches", np: "सबै सक्रिय worktree path र ब्रान्चसहित देखाउँछ", jp: "全アクティブ worktree のパスとブランチを一覧表示" },
              { en: "Checking what parallel checkouts are currently open", np: "हाल कुन समानान्तर checkout खुला छ जाँच्दा", jp: "現在開いている並行チェックアウトを確認するとき" },
            ],
            [
              { en: "`git worktree remove <path>`", np: "`git worktree remove <path>`", jp: "`git worktree remove <path>`" },
              { en: "Remove a worktree folder and unregister it from Git", np: "worktree फोल्डर हटाउँछ र Git बाट unregister गर्छ", jp: "worktree フォルダを削除して Git の登録を解除" },
              { en: "Cleaning up after the parallel work is done", np: "समानान्तर काम सकिएपछि सफाई गर्दा", jp: "並行作業が完了した後の後片付け" },
            ],
            [
              { en: "`git stash apply stash@{n}`", np: "`git stash apply stash@{n}`", jp: "`git stash apply stash@{n}`" },
              { en: "Restore a specific stash but keep it in the stash list", np: "विशेष stash पुनर्स्थापित गर्छ तर सूचीमा राख्छ", jp: "特定の stash を復元するがリストには残す" },
              { en: "When you want to apply the same stash to multiple branches or keep it as a backup", np: "एउटै stash धेरै ब्रान्चमा लगाउन वा backup राख्दा", jp: "同じ stash を複数ブランチに適用したいとき、またはバックアップとして残したいとき" },
            ],
            [
              { en: "`git reflog`", np: "`git reflog`", jp: "`git reflog`" },
              { en: "Show a journal of every HEAD movement — resets, rebases, branch switches, commits", np: "HEAD सरेको हरेक घटना देखाउँछ — reset, rebase, switch, commit", jp: "HEAD が動いたすべての記録を表示 — reset・rebase・切り替え・コミット" },
              { en: "After `git reset --hard` or branch delete — to find and recover the lost commit hash", np: "`git reset --hard` वा ब्रान्च मेटाएपछि — गुमेको commit hash खोज्दा", jp: "`git reset --hard` やブランチ削除後に失ったコミットのハッシュを探すとき" },
            ],
          ],
        },
      ],
    },
  ],
  faq: GIT_DAY_6_FAQ,
  bullets: [
    {
      en: "Use `git stash push -m \"wip\"` then pop and resolve any conflicts deliberately.",
      np: "`git stash push -m` प्रयोग गर्नुहोस्।",
      jp: "メッセージ付き stash → pop でコンフリクト解消を練習。",
    },
    {
      en: "Add a sibling worktree on `-b hotfix/demo`, commit once, then `git worktree remove` that path.",
      np: "`-b hotfix/demo` सहित sibling worktree थप्नुहोस्, commit गर्नुहोस्, अनि `git worktree remove`।",
      jp: "`-b hotfix/demo` で隣に worktree を追加し、1コミットしてから `git worktree remove` で片付ける。",
    },
  ],
};

export const GIT_DAY_7_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Pull requests are the gateway between your branch and `main` — they bundle code review, automated CI checks, and team discussion into one place before anything merges. Hooks automate repetitive checks so problems are caught before they reach the PR. `git bisect` binary-searches history to pinpoint exactly which commit introduced a bug.",
      np: "Pull request ले तपाईंको ब्रान्च र `main` बीचको द्वार हो — code review, CI, र छलफल एकै ठाउँमा। Hooks ले दोहोरिने जाँच स्वचालित गर्छन्। `git bisect` ले bug भित्र्याएको commit ठ्याक्कै पत्ता लगाउँछ।",
      jp: "PRはブランチと `main` の間の関門 — コードレビュー・CI・議論を1か所に集約します。フックで繰り返しチェックを自動化し、問題を PR 前に捕捉します。`git bisect` でバグを導入したコミットを二分探索で特定します。",
    },
  ],
  sections: [
    {
      title: {
        en: "Why use pull requests?",
        np: "Pull request किन प्रयोग गर्ने?",
        jp: "なぜプルリクエストを使うのか",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Without a PR workflow, anyone can push directly to `main` at any time — a typo, a half-finished feature, or a breaking change can go live instantly. A PR creates a checkpoint: your code must be reviewed by a human and pass automated tests before it can merge. This catches bugs, shares knowledge across the team, and keeps `main` always deployable.",
            np: "PR workflow बिना जो-कोहीले जुनसुकै बेला `main` मा सिधै push गर्न सक्छन् — टाइपो, अधूरो सुविधा, वा breaking change तत्काल live हुन सक्छ। PR ले checkpoint बनाउँछ: code मानवीय review र स्वचालित परीक्षण पास गर्नुपर्छ।",
            jp: "PR ワークフローがなければ誰でも `main` に直接 push できます。タイポ・未完機能・破壊的変更がすぐ本番に出てしまいます。PR はチェックポイント — 人によるレビューと自動テストを通過しないとマージできません。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Code review — a second pair of eyes catches bugs and logic errors before they reach production.",
              np: "Code review — दोस्रो नजर production अघि bug र logic त्रुटि समात्छ।",
              jp: "コードレビュー — 2人目の目で本番前にバグ・ロジックエラーを発見。",
            },
            {
              en: "CI gate — automated tests, type checks, and linting run on every PR so regressions cannot merge.",
              np: "CI gate — स्वचालित परीक्षण, type check, linting हरेक PR मा चल्छन् ताकि regression merge हुन नसकोस्।",
              jp: "CI ゲート — 自動テスト・型チェック・Lint を PR ごとに実行し、リグレッションのマージを防ぎます。",
            },
            {
              en: "Knowledge sharing — reviewing PRs is how the whole team stays aware of what is changing and why.",
              np: "ज्ञान साझेदारी — PR review गर्नु नै टोलीले के र किन बदलिँदैछ भनेर जानकार रहने तरिका हो।",
              jp: "知識共有 — PR レビューで何がなぜ変わるかをチーム全員が把握できます。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "PR review → merge to main",
        np: "PR समीक्षा → main मा मर्ज",
        jp: "PR レビューから main へ",
      },
      blocks: [
        { type: "diagram", id: "git-pr-review-merge" },
        {
          type: "code",
          title: {
            en: "Opening and merging a pull request",
            np: "Pull request खोल्ने र मर्ज गर्ने",
            jp: "PR を開いてマージする",
          },
          code: `# 1. Push your feature branch to the remote
git push origin feature/add-payment

# 2. Open a PR on GitHub/GitLab (via web UI or CLI)
#    Give it a clear title and description:
#    - What does this change?
#    - Why is it needed?
#    - How was it tested?

# 3. Wait for CI to pass (tests, lint, type check)

# 4. Address reviewer feedback — push new commits to the same branch
git add src/payment.ts
git commit -m "fix: handle declined card edge case"
git push origin feature/add-payment

# 5. Once approved, merge using your team's policy:
#    - Squash merge: collapses all commits into one clean commit on main
#    - Merge commit: preserves the full branch history
#    - Rebase merge: replays commits on main with no merge bubble`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Push branch → open PR → CI runs → reviewers approve → squash/merge or merge commit per policy.",
              np: "ब्रान्च push → PR → CI → स्वीकृति → मर्ज।",
              jp: "ブランチを push → PR 作成 → CI → 承認 → 方針に従いマージ。",
            },
            {
              en: "Install a pre-commit hook locally (e.g. format + lint) so cheap checks never wait for CI.",
              np: "स्थानीय pre-commit hook राख्नुहोस्।",
              jp: "手元の pre-commit で整形・Lint を先に回す。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Conventional Commits — writing messages that scale",
        np: "Conventional Commits — scale हुने सन्देश लेख्ने",
        jp: "Conventional Commits — スケールするメッセージの書き方",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "\"fix stuff\" and \"update\" are useless commit messages six months later. Conventional Commits is a lightweight convention where every message follows the form `<type>(<scope>): <summary>`. The type machine-categorises your change — tools like semantic-release can read these to automatically bump version numbers and generate changelogs, and humans can grep the log instantly.",
            np: "\"fix stuff\" र \"update\" ६ महिना पछि बेकार commit सन्देश हुन्। Conventional Commits एउटा सरल नियम हो जहाँ हरेक सन्देश `<type>(<scope>): <summary>` ढाँचामा हुन्छ। Type ले परिवर्तनलाई वर्गीकृत गर्छ — semantic-release जस्ता tool ले स्वतः version bump र changelog बनाउन पढ्छन्।",
            jp: "「fix stuff」や「update」は6ヶ月後には役に立たないコミットメッセージです。Conventional Commits はすべてのメッセージを `<type>(<scope>): <summary>` の形にする軽量な規約です。型を使ってマシンが変更を分類でき、semantic-release などのツールが自動でバージョンを上げてチェンジログを生成できます。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "`feat` — a new feature visible to users. Triggers a MINOR version bump in semver (e.g. 1.2.0 → 1.3.0).",
              np: "`feat` — प्रयोगकर्तालाई देखिने नयाँ सुविधा। semver मा MINOR version bump (जस्तै 1.2.0 → 1.3.0)।",
              jp: "`feat` — ユーザーに見える新機能。semver の MINOR バージョンを上げます（例：1.2.0 → 1.3.0）。",
            },
            {
              en: "`fix` — a bug fix visible to users. Triggers a PATCH bump (e.g. 1.2.0 → 1.2.1).",
              np: "`fix` — प्रयोगकर्तालाई देखिने bug fix। PATCH bump (जस्तै 1.2.0 → 1.2.1)।",
              jp: "`fix` — ユーザーに見えるバグ修正。PATCH バージョンを上げます（例：1.2.0 → 1.2.1）。",
            },
            {
              en: "`chore` / `refactor` / `docs` / `test` / `ci` — internal changes that do not affect the public API. No version bump.",
              np: "`chore` / `refactor` / `docs` / `test` / `ci` — public API नप्रभावित आन्तरिक परिवर्तन। Version bump हुँदैन।",
              jp: "`chore` / `refactor` / `docs` / `test` / `ci` — パブリック API に影響しない内部変更。バージョンは上がりません。",
            },
            {
              en: "Add `BREAKING CHANGE:` in the commit footer (or `!` after the type: `feat!:`) to signal a MAJOR version bump.",
              np: "MAJOR version bump को लागि footer मा `BREAKING CHANGE:` थप्नुहोस् (वा type पछि `!`: `feat!:`)।",
              jp: "MAJOR バージョンを上げるにはフッターに `BREAKING CHANGE:` を書くか、型に `!` を付けます（例：`feat!:`）。",
            },
          ],
        },
        {
          type: "code",
          title: {
            en: "Real commit messages — good vs bad",
            np: "वास्तविक commit सन्देश — राम्रो बनाम खराब",
            jp: "実際のコミットメッセージ — 良い例と悪い例",
          },
          code: `# Bad — tells reviewers nothing useful
git commit -m "fix stuff"
git commit -m "update"
git commit -m "wip"

# Good — type, optional scope, and a clear one-line summary
git commit -m "feat(auth): add OAuth2 login via GitHub"
git commit -m "fix(payment): prevent null pointer crash in parser"
git commit -m "chore(deps): upgrade typescript to 5.4"
git commit -m "docs(readme): add local development setup guide"
git commit -m "test(cart): add edge case for empty cart checkout"

# Breaking change — triggers a MAJOR version bump
git commit -m "feat!: replace REST API with GraphQL
BREAKING CHANGE: all /api/v1 endpoints removed; use /graphql"`,
        },
      ],
    },
    {
      title: {
        en: "Git hooks — automating the workflow",
        np: "Git hooks — कार्यप्रवाह स्वचालन",
        jp: "Git フック — ワークフローの自動化",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Every time you commit or push, Git can run a script automatically — these are hooks. A pre-commit hook can run the linter so broken code never even gets committed. A commit-msg hook can reject messages that do not follow your team's format. This means problems are caught on your machine in milliseconds rather than waiting minutes for CI.",
            np: "हरेक commit वा push मा Git स्वचालित रूपमा script चलाउन सक्छ — यी hook हुन्। pre-commit hook ले linter चलाउन सक्छ ताकि बिगारिएको code commit नहोस्। commit-msg hook ले format नमिलेको सन्देश अस्वीकार गर्न सक्छ।",
            jp: "コミットやプッシュのたびに Git はスクリプトを自動実行できます。これがフックです。pre-commit でリンターを走らせれば壊れたコードはコミットされません。commit-msg で規約外のメッセージを弾けます。CI を待つ前にミリ秒で問題を検出できます。",
          },
        },
        {
          type: "paragraph",
          text: {
            en: "Hooks are executable scripts in `.git/hooks/`. Client-side hooks run on your machine (pre-commit, commit-msg, pre-push). Server-side hooks run on the remote (pre-receive, update, post-receive). They cannot be shared via clone by default — use a tool like Husky or lefthook to version and install them.",
            np: "Hooks `.git/hooks/` मा निष्पादनयोग्य स्क्रिप्ट हुन्। Client-side: pre-commit, commit-msg, pre-push। Server-side: pre-receive, post-receive। clone ले साझा गर्दैन — Husky वा lefthook प्रयोग गर्नुहोस्।",
            jp: "フックは `.git/hooks/` の実行スクリプトです。クライアント側（pre-commit・commit-msg・pre-push）はローカルで、サーバ側（pre-receive・post-receive）はリモートで動きます。clone では共有されないので Husky や lefthook で管理します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Minimal pre-commit hook (shell)",
            np: "सरल pre-commit hook (shell)",
            jp: "最小の pre-commit フック（シェル）",
          },
          code: `#!/bin/sh
# .git/hooks/pre-commit   (make it executable: chmod +x)
# This runs automatically every time you run "git commit".
# If any command exits with a non-zero code, the commit is rejected.

# Run linter — reject commit if it fails
npm run lint --if-present || exit 1

# Run type-check — reject commit if types are broken
npm run typecheck --if-present || exit 1

echo "pre-commit checks passed"`,
        },
        {
          type: "code",
          title: {
            en: "commit-msg hook — enforce format",
            np: "commit-msg hook — ढाँचा लागू",
            jp: "commit-msg フック — フォーマット強制",
          },
          code: `#!/bin/sh
# .git/hooks/commit-msg
# Git passes the path to the commit message file as $1.
# Reject any message that does not follow Conventional Commits.
# This runs before the commit is saved — the author sees the error immediately.

MSG=$(cat "$1")
PATTERN="^(feat|fix|chore|docs|style|refactor|perf|test|build|ci)(\\(.+\\))?: .{1,72}$"

if ! echo "$MSG" | grep -qE "$PATTERN"; then
  echo "Error: commit message must match Conventional Commits format."
  echo "  e.g. feat(auth): add OAuth2 login"
  exit 1
fi`,
        },
        {
          type: "paragraph",
          text: {
            en: "`git bisect` runs a binary search over commit history. Mark the current broken state as `bad` and a known-good older commit as `good`. Git checks out the midpoint; you test and mark it bad or good. Repeat until Git identifies the first bad commit.",
            np: "`git bisect` ले commit इतिहासमा binary खोज गर्छ। हालको अवस्था `bad`, ज्ञात-राम्रो commit `good` भन्नुहोस्। Git midpoint checkout गर्छ; परीक्षण गरी bad/good भन्नुहोस्। पहिलो bad commit पत्ता लाग्छ।",
            jp: "`git bisect` は履歴を二分探索します。壊れた今を `bad`、正常だった昔のコミットを `good` と教えると、Git が中間点をチェックアウトします。テスト結果を bad/good で答え続けると最初の不具合コミットが特定されます。",
          },
        },
        {
          type: "code",
          title: {
            en: "git bisect workflow",
            np: "git bisect कार्यप्रवाह",
            jp: "git bisect の流れ",
          },
          code: `# A feature stopped working. You know it worked at v2.1.0.
# Instead of reading every commit manually, let Git binary-search for you.

git bisect start

# Tell Git the current state is broken
git bisect bad

# Tell Git the last known-good state (tag, hash, or branch)
git bisect good v2.1.0

# Git checks out the commit halfway between bad and good — run your test
npm test

# Did the test fail? The bug was introduced before this commit
git bisect bad

# Did the test pass? The bug was introduced after this commit
git bisect good

# Keep answering bad/good — Git needs ~log2(N) rounds for N commits
# Git prints when done:
# abc1234 is the first bad commit

# Return to original HEAD when finished
git bisect reset`,
        },
      ],
    },
    {
      title: {
        en: "git bisect run — automated bisection",
        np: "git bisect run — स्वचालित bisection",
        jp: "git bisect run — 自動二分探索",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "When you have an automated test that reliably reproduces the bug, hand the entire bisection to Git. `git bisect run <script>` runs your script at every midpoint — exit code 0 means good (bug absent), non-zero means bad (bug present). Git finishes in log₂(N) steps without you touching the keyboard.",
            np: "Bug पुन: उत्पादन गर्ने automated test छ भने सम्पूर्ण bisection Git लाई सुम्पन सक्नुहुन्छ। `git bisect run <script>` ले हरेक midpoint मा script चलाउँछ — exit code 0 मतलब good (bug छैन), non-zero मतलब bad (bug छ)। keyboard नछोई log₂(N) steps मा सकिन्छ।",
            jp: "バグを確実に再現する自動テストがあれば bisection 全体を Git に委ねられます。`git bisect run <script>` が各中間点でスクリプトを実行します。終了コード 0 が good（バグなし）、非ゼロが bad（バグあり）。キーボードに触れず log₂(N) ステップで完了します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Automated bisect with a test script",
            np: "Test script सहित स्वचालित bisect",
            jp: "テストスクリプトで自動 bisect",
          },
          code: `# Write a script that exits 0 on pass and non-zero on failure
# scripts/check-bug.sh
#!/bin/sh
npm test -- --testNamePattern="payment parser"

# Start bisect as normal
git bisect start
git bisect bad                    # HEAD is broken
git bisect good v2.1.0            # this tag was working

# Hand the entire search to Git — no keyboard input needed
git bisect run sh scripts/check-bug.sh
# → Git checks out each midpoint, runs the script automatically
# → Prints: "abc1234 is the first bad commit" when done

# Reset back to original HEAD
git bisect reset

# Exit code 125 is special: it tells bisect to SKIP the current commit
# Use it when a commit doesn't compile and you can't test it:
# exit 125   # in your script`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "The script must be deterministic — if it flickers between pass/fail on the same commit, bisect will produce a wrong answer. Run it manually a few times first.",
              np: "Script deterministic हुनुपर्छ — एउटै commit मा pass/fail बीच flickering छ भने bisect गलत जवाफ दिन्छ। पहिले हातले केही पटक चलाएर जाँच्नुहोस्।",
              jp: "スクリプトは決定的である必要があります。同じコミットで pass/fail が揺れると bisect が誤った答えを出します。まず手動で数回実行して確認してください。",
            },
            {
              en: "Exit code `125` signals `bisect run` to skip that commit (e.g. it does not compile) and continue searching around it.",
              np: "Exit code `125` ले `bisect run` लाई त्यो commit skip गर्न संकेत गर्छ (जस्तै compile नहुने) र वरपर खोज जारी राख्छ।",
              jp: "終了コード `125` は `bisect run` にそのコミットをスキップさせるシグナルです（例：コンパイル不能）。その周辺の探索は続きます。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "PRs / Hooks / Bisect cheatsheet", np: "PR / Hooks / Bisect चिटसिट", jp: "PR・フック・bisect コマンド早見表" },
      blocks: [
        {
          type: "table",
          headers: [
            { en: "Command", np: "आदेश", jp: "コマンド" },
            { en: "What it does", np: "के गर्छ", jp: "作用" },
            { en: "When to use it", np: "कहिले प्रयोग गर्ने", jp: "使うタイミング" },
          ],
          rows: [
            [
              { en: "`git push -u origin <branch>`", np: "`git push -u origin <branch>`", jp: "`git push -u origin <branch>`" },
              { en: "Publish the branch and set its upstream — ready to open a PR", np: "ब्रान्च प्रकाशित गर्छ र upstream सेट गर्छ — PR खोल्न तयार", jp: "ブランチを公開して upstream を設定 — PR を開く準備完了" },
              { en: "First step before opening any pull request", np: "PR खोल्नुअघिको पहिलो चरण", jp: "プルリクエストを開く前の最初のステップ" },
            ],
            [
              { en: "`git push origin <branch>`", np: "`git push origin <branch>`", jp: "`git push origin <branch>`" },
              { en: "Push additional commits to an already-open PR branch", np: "पहिले नै खुला PR ब्रान्चमा थप commit push गर्छ", jp: "既に開いている PR ブランチに追加コミットを push" },
              { en: "Addressing reviewer feedback by pushing new commits", np: "reviewer को प्रतिक्रिया नयाँ commit push गरी सम्बोधन गर्दा", jp: "レビューフィードバックに対応する新しいコミットを push するとき" },
            ],
            [
              { en: "`chmod +x .git/hooks/pre-commit`", np: "`chmod +x .git/hooks/pre-commit`", jp: "`chmod +x .git/hooks/pre-commit`" },
              { en: "Make a hook script executable so Git will run it", np: "hook script निष्पादनयोग्य बनाउँछ ताकि Git चलाउन सकोस्", jp: "フックスクリプトを実行可能にして Git が実行できるようにする" },
              { en: "After writing a new hook — Git ignores non-executable hook files", np: "नयाँ hook लेखेपछि — Git non-executable hook फाइल बेवास्ता गर्छ", jp: "新しいフックを書いた後 — 実行権限がないとGitは無視します" },
            ],
            [
              { en: "`git bisect start`", np: "`git bisect start`", jp: "`git bisect start`" },
              { en: "Begin a binary search through commit history to find a bug", np: "bug खोज्न commit इतिहासमा binary खोज सुरु गर्छ", jp: "バグを探すためにコミット履歴の二分探索を開始" },
              { en: "A bug appeared and you don't know which commit caused it", np: "bug देखियो तर कुन commit ले गर्यो थाहा छैन", jp: "バグが現れたが、どのコミットが原因かわからないとき" },
            ],
            [
              { en: "`git bisect bad`", np: "`git bisect bad`", jp: "`git bisect bad`" },
              { en: "Mark the current commit as broken", np: "हालको commit बिग्रिएको भनी चिन्ह लगाउँछ", jp: "現在のコミットを「壊れている」とマーク" },
              { en: "After testing the current checkout and confirming the bug exists", np: "हालको checkout परीक्षण गरी bug छ भनी पुष्टि गरेपछि", jp: "現在のチェックアウトをテストしてバグの存在を確認した後" },
            ],
            [
              { en: "`git bisect good <ref>`", np: "`git bisect good <ref>`", jp: "`git bisect good <ref>`" },
              { en: "Mark a commit (tag, hash, or branch) as working correctly", np: "commit (tag, hash, वा branch) लाई ठीकसँग काम गर्ने भनी चिन्ह लगाउँछ", jp: "コミット（タグ・ハッシュ・ブランチ）を「正常動作」とマーク" },
              { en: "Telling Git the last known-good state to bound the search", np: "खोज सीमित गर्न Git लाई अन्तिम ज्ञात-राम्रो अवस्था बताउँदा", jp: "探索範囲を絞るために最後に正常だった状態を Git に伝えるとき" },
            ],
            [
              { en: "`git bisect reset`", np: "`git bisect reset`", jp: "`git bisect reset`" },
              { en: "End bisect and return HEAD to its original position", np: "bisect समाप्त गर्छ र HEAD मूल स्थितिमा फर्काउँछ", jp: "bisect を終了して HEAD を元の位置に戻す" },
              { en: "After the first bad commit has been identified", np: "पहिलो bad commit पहिचान भएपछि", jp: "最初の不具合コミットが特定された後" },
            ],
            [
              { en: "`git bisect run <script>`", np: "`git bisect run <script>`", jp: "`git bisect run <script>`" },
              { en: "Run a script at every midpoint — exit 0 = good, non-zero = bad — and finish automatically", np: "हरेक midpoint मा script चलाउँछ — exit 0 = good, non-zero = bad — र स्वतः सकाउँछ", jp: "各中間点でスクリプトを実行 — exit 0 = good、非ゼロ = bad — で自動完了" },
              { en: "When you have a reliable automated test that reproduces the bug", np: "bug पुन: उत्पादन गर्ने भरपर्दो automated test हुँदा", jp: "バグを確実に再現する自動テストがあるとき" },
            ],
            [
              { en: "`feat(scope): summary`", np: "`feat(scope): summary`", jp: "`feat(scope): summary`" },
              { en: "Conventional Commits message format — type categorises the change for changelogs and semver tools", np: "Conventional Commits सन्देश ढाँचा — type ले changelog र semver tool का लागि परिवर्तन वर्गीकृत गर्छ", jp: "Conventional Commits のメッセージ形式 — type で changelog と semver ツール用に変更を分類" },
              { en: "Every commit — especially in team repos where CI reads commit types to bump versions", np: "हरेक commit — विशेष गरी CI ले version bump को लागि commit type पढ्ने team रेपोमा", jp: "すべてのコミット — 特に CI がコミット型を読んでバージョンを上げるチームリポジトリで" },
            ],
          ],
        },
      ],
    },
  ],
  faq: GIT_DAY_7_FAQ,
  bullets: [
    {
      en: "Walk through `git bisect start` → mark bad/good on a repo with a known regression.",
      np: "ज्ञात regression भएको रेपोमा bisect अभ्यास गर्नुहोस्।",
      jp: "既知の退行があるリポで bisect の一連を試す。",
    },
    {
      en: "Write a one-page team rule: merge vs rebase on shared main.",
      np: "टोली नियम: main मा merge वा rebase एक पृष्ठ।",
      jp: "共有 main での merge / rebase 方針を1枚にまとめる。",
    },
  ],
};
