import type { RoadmapDayFaqItem } from "@/lib/challenge-data";

/** Ten self-check accordion items per Git day (shown in the day detail panel). */

export const GIT_DAY_1_FAQ: RoadmapDayFaqItem[] = [
  {
    question: {
      en: "Why stage instead of committing everything at once?",
      np: "एकै पटक commit नगरी किन स्टेज गर्ने?",
      jp: "いっぺんにコミットせずステージする理由は？",
    },
    answer: {
      en: "Staging lets you split one editing session into multiple coherent commits with clear messages — reviewers can follow your intent.",
      np: "स्टेजिङले एउटा सत्रलाई स्पष्ट सन्देशसहित धेरै commit मा बाँड्न दिन्छ।",
      jp: "ステージングで編集セッションを意味のある小さなコミットに分けられ、レビューしやすくなります。",
    },
  },
  {
    question: {
      en: "What does `git init` actually create?",
      np: "`git init` ले वास्तवमा के बनाउँछ?",
      jp: "`git init` は具体的に何を作りますか？",
    },
    answer: {
      en: "It creates a `.git` directory in the current folder — that metadata store is your repository. Until you add and commit, you only have an empty repo with no snapshots.",
      np: "हालको फोल्डरमा `.git` थप्छ — त्यो मेटाडेटा नै रेपो हो। add/commit नगरेसम्म खाली रेपो मात्र।",
      jp: "現在のフォルダに `.git` を作り、そこがリポジトリ本体です。add/commit するまでスナップショットはありません。",
    },
  },
  {
    question: {
      en: "What is the difference between the working tree and the staging area?",
      np: "कार्य ट्री र स्टेजिङ क्षेत्रमा के फरक छ?",
      jp: "作業ツリーとステージングエリアの違いは？",
    },
    answer: {
      en: "The working tree is every file you see and edit on disk. The staging area is Git's draft queue: only what you `git add` will be included in the next `git commit`.",
      np: "कार्य ट्री तपाईंले सम्पादन गर्ने फाइलहरू हुन्। स्टेजिङ मस्यौदा हो: `git add` गरेको मात्र अर्को `git commit` मा जान्छ।",
      jp: "作業ツリーはディスク上の編集可能なファイル全体。ステージは下書きで、`git add` したものだけが次の `git commit` に入ります。",
    },
  },
  {
    question: {
      en: "What does `git status` show?",
      np: "`git status` ले के देखाउँछ?",
      jp: "`git status` は何を表示しますか？",
    },
    answer: {
      en: "Which branch you are on, which files are untracked, which are modified but unstaged, and which are staged and ready to commit — run it constantly.",
      np: "कुन ब्रान्च, कुन फाइल ट्र्याक नभएका, कुन परिमार्जित तर unstaged, कुन staged — सधैं चलाउनुहोस्।",
      jp: "現在のブランチ、未追跡、変更済みだが未ステージ、ステージ済みで次のコミット候補になるファイルを示します。常に確認しましょう。",
    },
  },
  {
    question: {
      en: "What is `git add -p` for?",
      np: "`git add -p` किन प्रयोग गर्ने?",
      jp: "`git add -p` は何のため？",
    },
    answer: {
      en: "It interactively stages hunks (chunks) inside a file so you can commit one logical change at a time instead of the whole file.",
      np: "फाइलभित्र hunk अन्तरक्रियात्मक रूपमा stage गर्छ — तार्किक परिवर्तन छुट्याउन।",
      jp: "ファイル内の hunk を対話的にステージし、論理単位でコミットを分けられます。",
    },
  },
  {
    question: {
      en: "Can you make a commit with an empty staging area?",
      np: "खाली स्टेजिङले commit गर्न सकिन्छ?",
      jp: "ステージが空のままコミットできますか？",
    },
    answer: {
      en: "No — Git refuses `git commit` if there is nothing staged (unless you pass flags like `--allow-empty` for special cases).",
      np: "होइन — स्टेज खाली भए `git commit` अस्वीकार हुन्छ (`--allow-empty` जस्ता विशेष अपवाद बाहेक)।",
      jp: "いいえ — ステージに何もなければ通常 `git commit` は拒否されます（`--allow-empty` など例外あり）。",
    },
  },
  {
    question: {
      en: "Where are commits stored before you add a remote?",
      np: "रिमोट थप्नुअघि commit कहाँ बस्छन्?",
      jp: "リモートを設定する前、コミットはどこにありますか？",
    },
    answer: {
      en: "Only on your machine inside `.git/objects` and the commit graph — nothing is uploaded until you configure a remote and `git push`.",
      np: "तपाईंको मेसिनको `.git/objects` र commit ग्राफमा मात्र — रिमोट र `git push` नभएसम्म अपलोड हुँदैन।",
      jp: "ローカルの `.git/objects` とコミットグラフ内だけです。リモートと `git push` がなければ送信されません。",
    },
  },
  {
    question: {
      en: "Why use short, imperative commit messages?",
      np: "छोटा, आदेशात्मक commit सन्देश किन?",
      jp: "短く命令形のコミットメッセージにする理由は？",
    },
    answer: {
      en: "They read well in `git log --oneline`, match common team conventions (for example Conventional Commits), and make bisect and changelog generation easier.",
      np: "`git log --oneline` मा राम्रो देखिन्छ, टोली ढाँचासँग मेल खान्छ, bisect र changelog सजिलो।",
      jp: "`git log --oneline` で読みやすく、チーム規約（例: Conventional Commits）に合い、bisect やチェンジログ生成にも向きます。",
    },
  },
  {
    question: {
      en: "What happens to unstaged edits when you commit?",
      np: "commit गर्दा unstaged सम्पादन के हुन्छ?",
      jp: "コミットしたとき、未ステージの編集はどうなる？",
    },
    answer: {
      en: "They stay in the working tree untouched — only staged content becomes the new commit. Your other edits remain modified but uncommitted.",
      np: "कार्य ट्रीमै untouched रहन्छ — स्टेज गरिएको मात्र नयाँ commit बन्छ।",
      jp: "作業ツリーにそのまま残ります。ステージした内容だけが新コミットになり、他の変更は未コミットのままです。",
    },
  },
  {
    question: {
      en: "What is the index?",
      np: "index के हो?",
      jp: "インデックス（index）とは？",
    },
    answer: {
      en: "Another name for the staging area — the snapshot Git will record when you run `git commit`. Some commands use `--cached` to mean staged changes.",
      np: "स्टेजिङ क्षेत्रको अर्को नाम — `git commit` ले रेकर्ड गर्ने snapshot। `--cached` = स्टेज गरिएको।",
      jp: "ステージングエリアの別名で、`git commit` で記録されるスナップショットです。`--cached` はステージ済みを指します。",
    },
  },
];

export const GIT_DAY_2_FAQ: RoadmapDayFaqItem[] = [
  {
    question: {
      en: "What is the difference between `git diff` and `git diff --staged`?",
      np: "`git diff` र `git diff --staged` मा के फरक छ?",
      jp: "`git diff` と `git diff --staged` の違いは？",
    },
    answer: {
      en: "`git diff` shows changes in the working tree that have NOT been staged yet. `git diff --staged` (alias: `--cached`) shows changes already queued in the index against the last commit. Run both before every commit to make sure you're capturing exactly what you intend.",
      np: "`git diff` ले unstaged कार्य ट्री परिवर्तन देखाउँछ। `git diff --staged` ले index र अन्तिम commit बीच। commit अघि दुवै चलाउनुहोस्।",
      jp: "`git diff` は未ステージの作業ツリーの変更、`git diff --staged`（`--cached`）はインデックスと直前コミットの差分です。コミット前に両方確認しましょう。",
    },
  },
  {
    question: {
      en: "When should I use `git show` vs `git log`?",
      np: "`git show` र `git log` कहिले प्रयोग गर्ने?",
      jp: "`git show` と `git log` の使い分けは？",
    },
    answer: {
      en: "`git log` lists commits (metadata only by default). `git show <hash>` dumps the full diff of one commit. Use `git log --oneline --graph` to navigate history, then `git show` when you want to inspect a specific snapshot.",
      np: "`git log` ले सूची दिन्छ। `git show <hash>` ले एउटा commit को पूर्ण diff। नेभिगेट `log`, विस्तृत `show`।",
      jp: "`git log` は一覧、`git show <hash>` は1コミットの全差分。流れは `log`、中身の確認は `show` で。",
    },
  },
  {
    question: {
      en: "What does `git blame` tell you?",
      np: "`git blame` ले के बताउँछ?",
      jp: "`git blame` は何がわかる？",
    },
    answer: {
      en: "For each line of a file, which commit last modified it and who authored that commit — essential for tracing when a bug line was introduced.",
      np: "प्रत्येक लाइन अन्तिम पटक कुन commit ले बदल्यो र लेखक को — bug लाइन खोज्न अनिवार्य।",
      jp: "各行を最後に変えたコミットと作者。バグ行がいつ入ったか追うのに必須です。",
    },
  },
  {
    question: {
      en: "When is `git commit --amend` safe?",
      np: "`git commit --amend` कहिले सुरक्षित छ?",
      jp: "`git commit --amend` はいつ安全？",
    },
    answer: {
      en: "Before anyone else has pulled your commit — amending rewrites the tip commit's hash. After push, amending needs coordination (often force-push) and breaks teammates who already based work on the old hash.",
      np: "अरूले तपाईंको commit pull नगरेसम्म — amend ले hash बदल्छ। push पछि समन्वय वा force-push चाहिन्छ।",
      jp: "他者がそのコミットを取り込む前まで。amend は先端コミットのハッシュを変えます。push 後は調整か force-push が必要になりがちです。",
    },
  },
  {
    question: {
      en: "What does `git log --oneline --graph` help with?",
      np: "`git log --oneline --graph` ले के सजिलो बनाउँछ?",
      jp: "`git log --oneline --graph` の用途は？",
    },
    answer: {
      en: "A compact visual of branches and merges over recent history so you can orient quickly in an unfamiliar repository.",
      np: "हालको इतिहासमा ब्रान्च र merge को संक्षिप्त दृश्य — अपरिचित रेपोमा छिटो अभिमुखीकरण।",
      jp: "直近のブランチ・マージの流れをコンパクトに可視化し、見慣れないリポでも素早く状況把握できます。",
    },
  },
  {
    question: {
      en: "What is `HEAD` in simple terms?",
      np: "सरल शब्दमा `HEAD` के हो?",
      jp: "ざっくり `HEAD` とは？",
    },
    answer: {
      en: "A pointer to the commit your repository currently has checked out — usually the tip of a branch, unless you are in detached HEAD state.",
      np: "हाल checkout गरिएको commit लाई औंला गर्ने सूचक — सामान्यतः ब्रान्चको टिप, detached बाहेक।",
      jp: "現在チェックアウトしているコミットを指すポインタ。通常はブランチ先端、detached HEAD 時は別です。",
    },
  },
  {
    question: {
      en: "How do you inspect only the most recent commit?",
      np: "सबैभन्दा भर्खरको commit मात्र कसरी हेर्ने?",
      jp: "直近のコミットだけ見るには？",
    },
    answer: {
      en: "`git show` with no arguments defaults to `HEAD` — it prints the message, author, date, and full patch for that commit.",
      np: "तर्क बिना `git show` ले `HEAD` देखाउँछ — सन्देश, लेखक, मिति र patch।",
      jp: "引数なしの `git show` は `HEAD` を表示し、メタ情報とパッチ一式を出します。",
    },
  },
  {
    question: {
      en: "What does `git diff HEAD` compare?",
      np: "`git diff HEAD` ले के तुलना गर्छ?",
      jp: "`git diff HEAD` は何と何を比べる？",
    },
    answer: {
      en: "Your working tree (including unstaged changes) against the `HEAD` commit — useful to see everything that would differ if you committed staged-only vs all edits.",
      np: "कार्य ट्री (unstaged सहित) र `HEAD` commit — सबै भिन्नता एकैचोटि हेर्न।",
      jp: "作業ツリー全体（未ステージ含む）と `HEAD` の差分です。ステージだけでなく手元の全変更との差を把握するのに使います。",
    },
  },
  {
    question: {
      en: "Why avoid `git commit --amend` after `git push`?",
      np: "`git push` पछि `git commit --amend` किन टाढा रहने?",
      jp: "`git push` 後に amend を避ける理由は？",
    },
    answer: {
      en: "Because the remote and teammates still reference the old commit object; rewriting forces them to rebase or reset and can lose work if mishandled.",
      np: "रिमोट र साथी पुरानो commit object समात्छन्; पुनर्लेखनले rebase/reset बाध्य बनाउँछ, गलत ह्यान्डलमा काम गुम्न सक्छ।",
      jp: "リモートや他者が古いオブジェクトを参照しているからです。書き換えは相手側の再同期を強い、誤操作で作業が失われ得ます。",
    },
  },
  {
    question: {
      en: "What is the difference between `git diff` and `git show` for one revision?",
      np: "एउटा संशोधनका लागि `git diff` र `git show` मा के फरक?",
      jp: "1リビジョンについて `git diff` と `git show` の違いは？",
    },
    answer: {
      en: "`git show <commit>` is purpose-built: metadata plus patch for that commit. `git diff <commit>` compares that tree to your working tree unless you add a second commit or pathspec.",
      np: "`git show <commit>` मेटाडेटा + patch। `git diff <commit>` ले सामान्यतः त्यो र कार्य ट्री तुलना गर्छ (दोस्रो commit वा path नभएसम्म)।",
      jp: "`git show <commit>` はそのコミットのメタ＋差分をまとめて表示。`git diff <commit>` は第2引数なしだと主に作業ツリーとの比較になりがちです。",
    },
  },
];

export const GIT_DAY_3_FAQ: RoadmapDayFaqItem[] = [
  {
    question: {
      en: "What is a merge commit?",
      np: "मर्ज commit के हो?",
      jp: "マージコミットとは？",
    },
    answer: {
      en: "A commit with two parents that records that two branches came together. Fast-forward merges avoid creating one.",
      np: "दुई अभिभावक भएको commit जसले दुई ब्रान्च मिलेको देखाउँछ। Fast-forward मा यो बन्दैन।",
      jp: "親が2つあり、2ブランチが合流したことを表すコミットです。早送りマージでは作られません。",
    },
  },
  {
    question: {
      en: "What is a fast-forward merge?",
      np: "Fast-forward merge के हो?",
      jp: "早送りマージとは？",
    },
    answer: {
      en: "When your branch tip can move straight along the other branch's commits with no divergent work — Git simply moves the pointer; no merge commit is needed.",
      np: "जब तपाईंको टिप अर्को ब्रान्चको commit माथि सिधै सर्न सक्छ — Git ले सूचक मात्र सार्छ, merge commit हुँदैन।",
      jp: "分岐した作業がなく、単にポインタを進められるとき。マージコミットは作られずポインタだけ進みます。",
    },
  },
  {
    question: {
      en: "When do merge conflicts appear?",
      np: "merge द्वन्द्व कहिले देखा पर्छ?",
      jp: "マージコンフリクトはいつ起きる？",
    },
    answer: {
      en: "When the same lines (or binary hunks) were changed differently on both branches — Git cannot pick a winner automatically and leaves conflict markers for you to resolve.",
      np: "उही लाइन दुवै ब्रान्चमा फरक तरिकाले बदलिएमा — Git स्वतः छान्न सक्दैन, marker छोड्छ।",
      jp: "両ブランチで同じ行などが別々に変更されたとき。Git が自動統合できず、マーカーを残して人が解消します。",
    },
  },
  {
    question: {
      en: "What does `git merge --abort` do?",
      np: "`git merge --abort` ले के गर्छ?",
      jp: "`git merge --abort` は何をする？",
    },
    answer: {
      en: "Stops an in-progress merge and returns your branch to the state before you ran `git merge` — use it when conflicts feel too messy to salvage quickly.",
      np: "चलिरहेको merge रोक्छ र `git merge` अघिको अवस्थामा फर्काउँछ — conflict धेरै गडबड भएमा।",
      jp: "進行中のマージを中止し、`git merge` 実行前の状態に戻します。コンフリクトが複雑なときの切り戻しに。",
    },
  },
  {
    question: {
      en: "After fixing conflict markers, what must you do before `git commit`?",
      np: "conflict marker ठीक गरेपछि `git commit` अघि के गर्नुपर्छ?",
      jp: "コンフリクト解消後、`git commit` の前に必須なのは？",
    },
    answer: {
      en: "`git add` on each resolved file to mark it staged — until then Git considers the merge unresolved.",
      np: "सुल्झाइएका फाइलमा `git add` — नभएसम्म Git ले merge अधूरो मान्छ।",
      jp: "解消したファイルを `git add` でステージし、マージ完了として印を付けます。",
    },
  },
  {
    question: {
      en: "`git switch -c feature/x` vs `git branch feature/x` — what is the practical difference?",
      np: "`git switch -c` बनाम `git branch` — व्यवहारिक फरक?",
      jp: "`git switch -c` と `git branch` の実務上の違いは？",
    },
    answer: {
      en: "`git switch -c` creates the branch and checks it out immediately. `git branch feature/x` only creates the branch pointer; you remain on your current branch until you switch.",
      np: "`git switch -c` ले बनाउँछ र तुरुन्त checkout गर्छ। `git branch` ले सूचक मात्र — अझै हालको ब्रान्चमा।",
      jp: "`git switch -c` は作成と同時にチェックアウト。`git branch` はブランチを作るだけで、切り替えは別コマンドです。",
    },
  },
  {
    question: {
      en: "Why delete remote feature branches after merge?",
      np: "मर्ज पछि रिमोट feature ब्रान्च किन मेटाउने?",
      jp: "マージ後にリモートの feature ブランチを消す理由は？",
    },
    answer: {
      en: "Keeps the branch list readable, avoids someone accidentally reusing stale names, and signals the work is integrated — most hosts offer delete-on-merge buttons.",
      np: "सूची सफा रहन्छ, पुरानो नाम दुर्घटनावश पुन: प्रयोग कम हुन्छ, काम मिलिसकेको संकेत — host मा delete-on-merge।",
      jp: "一覧が整理され、古い名前の再利用ミスを減らし、取り込み済みが明確になります。ホストのマージ後削除が便利です。",
    },
  },
  {
    question: {
      en: "What is `MERGE_HEAD` while a merge runs?",
      np: "merge चल्दा `MERGE_HEAD` के हो?",
      jp: "マージ中の `MERGE_HEAD` とは？",
    },
    answer: {
      en: "A ref Git writes pointing at the commit you are merging in — together with `HEAD` it lets Git know a merge is in progress until you commit or abort.",
      np: "Git ले लेख्ने ref जसले मर्ज गरिने commit औंला गर्छ — `HEAD` सँग मिलेर merge चलिरहेको संकेत गर्छ।",
      jp: "取り込み先のコミットを指す参照で、`HEAD` と組み合わせてマージ進行中であることを表します。",
    },
  },
  {
    question: {
      en: "What is `git mergetool` for?",
      np: "`git mergetool` किन?",
      jp: "`git mergetool` の役割は？",
    },
    answer: {
      en: "Launches a configured visual or side-by-side editor to resolve conflicts faster than hand-editing markers in a plain buffer.",
      np: "कन्फिगर गरिएको भिजुअल editor खोल्छ — plain buffer मा marker सम्पादनभन्दा छिटो।",
      jp: "設定したマージ用エディタを起動し、素のテキストより早くコンフリクトを解消できます。",
    },
  },
  {
    question: {
      en: "Can you merge the wrong branch into `main` by accident?",
      np: "गल्तीले गलत ब्रान्च `main` मा मर्ज हुन सक्छ?",
      jp: "誤って違うブランチを `main` にマージしうる？",
    },
    answer: {
      en: "Yes — always `git status` and `git branch` before merging, and use PRs on shared repos so integration is visible before the merge lands.",
      np: "हो — merge अघि `git status` र `git branch`, साझा रेपोमा PR ले दृश्यता दिन्छ।",
      jp: "はい。マージ前に `git status` / `git branch` を確認し、共有リポでは PR で可視化してから取り込むのが安全です。",
    },
  },
];

export const GIT_DAY_4_FAQ: RoadmapDayFaqItem[] = [
  {
    question: {
      en: "What does `git fetch` change by default?",
      np: "पूर्वनिर्धारित रूपमा `git fetch` ले के बदल्छ?",
      jp: "既定の `git fetch` は何を変える？",
    },
    answer: {
      en: "Remote-tracking refs (for example `origin/main`) and objects in `.git` — not your current local branch tip or working files until you merge or rebase.",
      np: "रिमोट-ट्र्याकिङ ref र `.git` भित्रका वस्तु — merge/rebase नगरेसम्म स्थानीय ब्रान्च र कार्य फाइल अछुतो।",
      jp: "リモート追跡参照とオブジェクトを更新しますが、ローカルブランチ先端や作業ツリーは merge/rebase するまで変えません。",
    },
  },
  {
    question: {
      en: "How is `git pull` different from `git fetch`?",
      np: "`git pull` र `git fetch` मा के फरक?",
      jp: "`git pull` と `git fetch` の違いは？",
    },
    answer: {
      en: "`pull` is fetch plus an integration step (merge by default, or rebase if configured) that updates your checked-out branch. `fetch` alone is always safe and transparent.",
      np: "`pull` = fetch + एकीकरण (डिफल्ट merge)। `fetch` मात्र सधैं सुरक्षित र पारदर्शी।",
      jp: "`pull` は fetch に続けて統合（既定は merge）まで行います。`fetch` 単体は作業ブランチを動かさず安全です。",
    },
  },
  {
    question: {
      en: "What is `origin`?",
      np: "`origin` के हो?",
      jp: "`origin` とは？",
    },
    answer: {
      en: "The default nickname for the primary remote repository URL — it is just a label; you can have multiple remotes with other names.",
      np: "मुख्य रिमोट URL को पूर्वनिर्धारित उपनाम — यो मात्र लेबल; अरू नामका धेरै remotes हुन सक्छन्।",
      jp: "主リモートのデフォルト名（ラベル）に過ぎません。複数リモートを別名で持てます。",
    },
  },
  {
    question: {
      en: "Why might `git push` be rejected?",
      np: "`git push` किन अस्वीकृत हुन सक्छ?",
      jp: "`git push` が拒否される典型は？",
    },
    answer: {
      en: "The remote branch moved ahead with commits you do not have locally — pull or rebase onto the updated remote, then push again (never force on shared branches without agreement).",
      np: "रिमोट अगाडि बढ्यो — स्थानीयमा नभएका commit। pull/rebase पछि फेरि push (साझा ब्रान्चमा force नगर्नुहोस्)।",
      jp: "リモートが先に進んでいるためです。取り込んでから再度 push。共有ブランチの force は合意がなければ避けます。",
    },
  },
  {
    question: {
      en: "What is a remote-tracking branch?",
      np: "रिमोट-ट्र्याकिङ ब्रान्च के हो?",
      jp: "リモート追跡ブランチとは？",
    },
    answer: {
      en: "A read-only-ish local ref like `origin/main` that remembers where the remote branch pointed the last time you fetched — compare it to your local `main` with `git log main..origin/main`.",
      np: "`origin/main` जस्तो स्थानीय ref जसले पछिल्लो fetch मा रिमोट कहाँ थियो सम्झिन्छ — `git log main..origin/main` ले तुलना।",
      jp: "`origin/main` のように、最後の fetch 時点のリモート先端を覚えるローカル側の参照です。",
    },
  },
  {
    question: {
      en: "Why use `git pull --rebase`?",
      np: "`git pull --rebase` किन प्रयोग गर्ने?",
      jp: "`git pull --rebase` を使う理由は？",
    },
    answer: {
      en: "To replay your local commits on top of the updated remote tip, keeping history linear instead of adding a merge bubble every time you sync.",
      np: "अद्यावधिक रिमोट टिपमाथि स्थानीय commit फेरि चलाउन — हरेक sync मा merge bubble नथप्न।",
      jp: "リモート更新の上に自分のコミットを積み直し、同期のたびにマージコミットを増やさず履歴を直線に保てます。",
    },
  },
  {
    question: {
      en: "What does `git remote -v` show?",
      np: "`git remote -v` ले के देखाउँछ?",
      jp: "`git remote -v` は何を表示？",
    },
    answer: {
      en: "Each remote name paired with its fetch and push URLs — quick sanity check that you push to the server you think you do.",
      np: "प्रत्येक रिमोट नाम र fetch/push URL — गलत सर्भरमा push नभएको जाँच।",
      jp: "リモート名と fetch/push 用 URL の対応。誤ったサーバへ送っていないかの確認に便利です。",
    },
  },
  {
    question: {
      en: "Clone vs `git init` plus `git remote add` — when prefer each?",
      np: "clone बनाम `git init` + `remote add` — कहिले कुन?",
      jp: "clone と init+remote add の使い分けは？",
    },
    answer: {
      en: "Clone when a remote already exists and you want full history copied locally. Init+remote when you are creating a brand-new repo you will push for the first time.",
      np: "रिमोट पहिले छ र पूर्ण इतिहास चाहिँदा clone। नयाँ रेपो पहिलो push अघि init+remote।",
      jp: "既存リポを手元に複製するなら clone。ゼロから作って初めて push するなら init+remote が自然です。",
    },
  },
  {
    question: {
      en: "What is upstream tracking for a local branch?",
      np: "स्थानीय ब्रान्चको upstream tracking के हो?",
      jp: "ローカルブランチの upstream 追跡とは？",
    },
    answer: {
      en: "A configuration that ties your local branch to a remote branch so plain `git pull` and `git push` know which ref to integrate with by default.",
      np: "स्थानीय ब्रान्चलाई रिमोट ब्रान्चसँग जोड्ने कन्फिग — सादा `git pull`/`git push` लाई डिफल्ट ref थाहा।",
      jp: "ローカルブランチとリモートの対応を記録し、引数なしの `pull`/`push` の相手を決めます。",
    },
  },
  {
    question: {
      en: "Is it safe to run `git fetch` often?",
      np: "`git fetch` बारम्बार चलाउन सुरक्षित छ?",
      jp: "`git fetch` を頻繁にしてよい？",
    },
    answer: {
      en: "Yes — fetch only downloads objects and updates remote-tracking refs; it does not modify your working tree or move your branch until you integrate explicitly.",
      np: "हो — fetch ले वस्तु डाउनलोड र ref मात्र अद्यावधिक गर्छ; स्पष्ट एकीकरण नगरेसम्म कार्य ट्री र ब्रान्च सार्दैन।",
      jp: "はい。作業ツリーやチェックアウト中ブランチを勝手に動かさず、取得と追跡参照の更新に留まります。",
    },
  },
];

export const GIT_DAY_5_FAQ: RoadmapDayFaqItem[] = [
  {
    question: {
      en: "Why rebase to keep history linear?",
      np: "इतिहास रेखीय राख्न rebase किन?",
      jp: "履歴を直線にするためにリベースする理由は？",
    },
    answer: {
      en: "Linear logs are easier to read, bisect, and reason about in large teams; merge bubbles from tiny sync merges add noise.",
      np: "रेखीय log पढ्न र bisect गर्न सजिलो; साना sync merge को बबल शोर हुन्छ।",
      jp: "大人数では直線的なログが読みやすく bisect しやすい。小さな同期マージのバブルはノイズになりがちです。",
    },
  },
  {
    question: {
      en: "What is the golden rule of rebasing?",
      np: "rebase को सुनौलो नियम के हो?",
      jp: "リベースの黄金律は？",
    },
    answer: {
      en: "Never rewrite commits that other people have already based work on — communicate before force-pushing rewritten history.",
      np: "अरूले आधार लिएका commit कहिल्यै नफेराउनु — force-push अघि कुरा गर्नुहोस्।",
      jp: "他者が既に作業の土台にしたコミットは書き換えない。履歴を書き換えて force-push する前に必ず相談。",
    },
  },
  {
    question: {
      en: "What does `git rebase --abort` do?",
      np: "`git rebase --abort` ले के गर्छ?",
      jp: "`git rebase --abort` は？",
    },
    answer: {
      en: "Cancels the in-progress rebase and restores your branch to how it looked before the rebase started — same idea as merge abort.",
      np: "चलिरहेको rebase रद्द गर्छ र rebase सुरु हुनुअघिको अवस्थामा फर्काउँछ।",
      jp: "進行中のリベースを中止し、開始前のブランチ状態に戻します。",
    },
  },
  {
    question: {
      en: "`squash` vs `fixup` in interactive rebase?",
      np: "interactive rebase मा `squash` बनाम `fixup`?",
      jp: "インタラクティブリベースの squash と fixup？",
    },
    answer: {
      en: "`squash` combines the commit into the previous one and opens an editor to craft a new message. `fixup` melds changes but keeps the previous commit message without prompting.",
      np: "`squash` ले माथिको सँग मिलाउँछ र नयाँ सन्देश सोध्छ। `fixup` ले चुपचाप मिलाउँछ, माथिको सन्देश राख्छ।",
      jp: "`squash` は統合後にメッセージ編集、`fixup` は上のコミットメッセージをそのまま使って黙って統合します。",
    },
  },
  {
    question: {
      en: "You hit a conflict mid-rebase — what is the sequence?",
      np: "rebase बीचमा conflict — क्रम के हो?",
      jp: "リベース途中でコンフリクトしたら順序は？",
    },
    answer: {
      en: "Fix files → `git add` each resolved path → `git rebase --continue`. Use `git rebase --abort` if you want to bail out entirely.",
      np: "फाइल ठीक → `git add` → `git rebase --continue`। पूर्ण रद्द `git rebase --abort`।",
      jp: "解消 → `git add` → `git rebase --continue`。全体をやめるなら `git rebase --abort`。",
    },
  },
  {
    question: {
      en: "When is merge preferred over rebase for integrating shared branches?",
      np: "साझा ब्रान्च मिलाउँदा rebase भन्दा merge कहिले रोज्ने?",
      jp: "共有ブランチの取り込みでリベースよりマージが向くのは？",
    },
    answer: {
      en: "When you want to preserve the exact moment two lines of development joined — audit trails and release branches often keep merge commits on purpose.",
      np: "दुई विकास रेखा कहिले मिले भन्ने ठ्याक्कै जोगाउनु छ — audit र release मा merge जानाजानी राखिन्छ।",
      jp: "分岐がいつ合流したかの記録を残したいとき。監査やリリースブランチではマージコミットを意図的に残すことがあります。",
    },
  },
  {
    question: {
      en: "Why never rebase `main` that others pull from daily?",
      np: "दैनिक pull गरिने `main` किन rebase नगर्ने?",
      jp: "毎日 pull する `main` をリベースしてはいけない理由は？",
    },
    answer: {
      en: "Everyone's local `main` would diverge from the rewritten remote; they must reset or re-fetch awkwardly and may lose unpushed commits.",
      np: "सबैको स्थानीय `main` पुनर्लेखित रिमोटबाट बिच्छिन्छ — reset/re-fetch गाह्रो, unpushed commit गुम्न सक्छ।",
      jp: "各自の `main` が書き換え後のリモートと食い違い、再同期が面倒で作業損失のリスクが出ます。",
    },
  },
  {
    question: {
      en: "What does `git pull --rebase` do in one sentence?",
      np: "एक वाक्यमा `git pull --rebase` के गर्छ?",
      jp: "一文で `git pull --rebase` は？",
    },
    answer: {
      en: "Fetches remote updates, then replays your unpushed commits on top of the updated upstream branch instead of adding a merge commit.",
      np: "रिमोट अद्यावधिक ल्याउँछ, अनि तपाईंका unpushed commit माथि replay गर्छ — merge commit नथपी।",
      jp: "取得後、未プッシュの自分のコミットを更新済み上流の上に積み直し、マージコミットを増やしません。",
    },
  },
  {
    question: {
      en: "If you rewrote local commits, how might you recover the old tips?",
      np: "स्थानीय commit पुनर्लेखन पछि पुरानो टिप कसरी फर्काउने?",
      jp: "ローカルコミットを書き換えたあと、以前の先端を？",
    },
    answer: {
      en: "`git reflog` lists where `HEAD` has been recently — you can recreate a branch pointer at an older reflog entry until those objects are garbage-collected.",
      np: "`git reflog` ले `HEAD` कहाँ थियो देखाउँछ — पुरानो entry मा सूचक फर्काउन मिल्छ।",
      jp: "`git reflog` で直近の HEAD の移動が追え、古いエントリからブランチを復元できます（GC 前まで）。",
    },
  },
  {
    question: {
      en: "Interactive rebase `drop` vs `fixup` for a noisy WIP commit?",
      np: "गन्दा WIP commit का लागि `drop` बनाम `fixup`?",
      jp: "ノイズな WIP コミットには drop と fixupどちら？",
    },
    answer: {
      en: "Use `drop` to remove a commit entirely when its changes should never land. Use `fixup` when the changes belong to an earlier commit but you do not want a separate message.",
      np: "परिवर्तन कहिल्यै नचाहिँदा `drop`। अघिल्लो commit मा मिसाउन चाहिँदा तर छुट्टै सन्देश नचाहिँदा `fixup`।",
      jp: "変更ごと消すなら `drop`。前のコミットに吸収しメッセージも要らないなら `fixup`。",
    },
  },
];

export const GIT_DAY_6_FAQ: RoadmapDayFaqItem[] = [
  {
    question: {
      en: "I ran `reset --hard` by mistake. Can I recover?",
      np: "`reset --hard` गल्तीले चलाएँ। पुनर्प्राप्ति?",
      jp: "`reset --hard` を誤って実行したら？",
    },
    answer: {
      en: "Often yes via `git reflog` — Git keeps unreachable commits for a while. Practice reflog on a dummy repo before you need it in production.",
      np: "प्रायः `git reflog` ले। अभ्यास पहिले गर्नुहोस्।",
      jp: "多くの場合 `git reflog` で取り戻せます。本番前にダミーで慣れておくと安心です。",
    },
  },
  {
    question: {
      en: "Worktree vs `git clone` a second copy?",
      np: "Worktree बनाम दोस्रो `git clone`?",
      jp: "worktree とリポジトリをもう一度 clone する違いは？",
    },
    answer: {
      en: "Worktrees share one object database — less disk, one `fetch` updates all checkouts, and branches stay in one repo. A second clone is fully isolated (useful for totally different remotes or experiments you might delete wholesale).",
      np: "Worktree ले एउटै वस्तु भण्डार साझा गर्छ — कम डिस्क, एउटै fetch। दोस्रो clone पूर्ण अलग हुन्छ।",
      jp: "worktree はオブジェクト DB を共有するのでディスク節約・`fetch` 一度で済みます。別 clone は完全に独立したいとき向きです。",
    },
  },
  {
    question: {
      en: "`git stash pop` vs `git stash apply`?",
      np: "`git stash pop` बनाम `git stash apply`?",
      jp: "`git stash pop` と `git stash apply`？",
    },
    answer: {
      en: "`pop` restores the stash and removes it from the list by default. `apply` leaves the stash entry so you can re-apply or compare — safer when you are unsure conflicts will appear.",
      np: "`pop` ले पुनर्स्थापित गरी सूचीबाट हटाउँछ। `apply` ले सूचीमा राख्छ — conflict अनिश्चित भए सुरक्षित।",
      jp: "`pop` は復元後にスタッシュを消します。`apply` は残すのでコンフリクトが心配なときに安全です。",
    },
  },
  {
    question: {
      en: "What does `git reset --soft HEAD~1` leave behind?",
      np: "`git reset --soft HEAD~1` ले के छोड्छ?",
      jp: "`git reset --soft HEAD~1` の後に残るのは？",
    },
    answer: {
      en: "It moves `HEAD` back one commit but keeps both the index and working tree exactly as they were — your changes stay staged, ready to recommit with a new message.",
      np: "`HEAD` एक commit पछाडि सार्छ तर index र कार्य ट्री जस्ताको तस्तै — सबै staged रहन्छ।",
      jp: "`HEAD` だけを1つ戻し、インデックスと作業ツリーはそのままなので変更はステージ済みのままです。",
    },
  },
  {
    question: {
      en: "`git reset --mixed` (default) vs `--hard`?",
      np: "`git reset --mixed` बनाम `--hard`?",
      jp: "`git reset --mixed` と `--hard`？",
    },
    answer: {
      en: "`mixed` moves `HEAD` and unstages changes but keeps file contents in the working tree. `--hard` also discards working-tree edits — destructive.",
      np: "`mixed` ले `HEAD` सार्छ र unstage गर्छ तर फाइल सामग्री कार्य ट्रीमा राख्छ। `--hard` ले कार्य ट्री पनि मेटाउँछ — विनाशकारी।",
      jp: "`mixed` は HEAD を戻してアンステージするが作業ツリーの内容は残します。`--hard` は作業ツリーも捨てます。",
    },
  },
  {
    question: {
      en: "When is `git cherry-pick` the right tool?",
      np: "`git cherry-pick` कहिले सही औजार हो?",
      jp: "`git cherry-pick` が向くのは？",
    },
    answer: {
      en: "When you need exactly one commit (or a small ordered set) from another branch without merging the whole branch — hotfixes and backports are classic cases.",
      np: "अर्को ब्रान्चबाट एउटा (वा थोरै) commit मात्र चाहिँदा — hotfix र backport।",
      jp: "別ブランチの特定の1コミットだけを取り込みたいとき。ホットフィックスやバックポートに典型です。",
    },
  },
  {
    question: {
      en: "When prefer `git worktree` over a long-lived stash?",
      np: "लामो stash भन्दा `git worktree` कहिले रोज्ने?",
      jp: "長期の stash より worktree を選ぶのは？",
    },
    answer: {
      en: "When you need two full checkouts (different branches, separate build artifacts, separate terminals) without cloning twice — especially urgent fixes while a big refactor stays open.",
      np: "दुई पूर्ण checkout चाहिँदा — फरक ब्रान्च, अलग build, clone दुई पटक बिना। ठूलो refactor बीचमा तत्काल fix।",
      jp: "clone を増やさず二つの作業ディレクトリが要るとき。大規模リファクタを開いたまま緊急修正に切り替える場面に有効です。",
    },
  },
  {
    question: {
      en: "What does `git stash list` show?",
      np: "`git stash list` ले के देखाउँछ?",
      jp: "`git stash list` は？",
    },
    answer: {
      en: "Stacked stash entries newest-first with refs like `stash@{0}` — use these names with `git stash apply stash@{2}` to restore a specific snapshot.",
      np: "नयाँ पहिले, `stash@{0}` जस्ता ref — `git stash apply stash@{2}` ले विशेष।",
      jp: "新しい順のスタッシュ一覧。`stash@{n}` を指定して特定のものを適用できます。",
    },
  },
  {
    question: {
      en: "Do stashes include untracked files by default?",
      np: "stash ले पूर्वनिर्धारित रूपमा untracked फाइल समेट्छ?",
      jp: "スタッシュは未追跡ファイルも含む？",
    },
    answer: {
      en: "No — use `git stash push -u` (or `--include-untracked`) when you need new files shelved too; otherwise they remain in the working tree and may block checkout.",
      np: "होइन — untracked पनि चाहिँदा `git stash push -u`; नभए checkout रोक्न सक्छन्।",
      jp: "いいえ。未追跡も退避するなら `git stash push -u` 等が必要です。",
    },
  },
  {
    question: {
      en: "When should you run `git worktree remove`?",
      np: "`git worktree remove` कहिले चलाउने?",
      jp: "`git worktree remove` はいつ？",
    },
    answer: {
      en: "After you finish the side task and no longer need that checkout — it unregisters the path so Git stops tracking it; pair with deleting the folder if you have not already.",
      np: "छेउको काम सकिएपछि — बाटो unregister गर्छ; फोल्डर मेटाउनु परे मेटाउनुहोस्।",
      jp: "副作業が終わり、そのチェックアウトが不要になったとき。パスを登録解除し、フォルダは手で削除済みなら整理のみでも可です。",
    },
  },
];

export const GIT_DAY_7_FAQ: RoadmapDayFaqItem[] = [
  {
    question: {
      en: "Why use pull requests instead of pushing straight to `main`?",
      np: "सिधै `main` push भन्दा pull request किन?",
      jp: "`main` に直 push せず PR を使う理由は？",
    },
    answer: {
      en: "PRs bundle review, CI, and discussion before integration — `main` stays deployable and mistakes are caught before they land.",
      np: "PR ले समीक्षा, CI, छलफल एकीकृत गर्छ — `main` deployable रहन्छ, गल्ती अघि समातिन्छ।",
      jp: "レビュー・CI・議論をマージ前にまとめ、`main` を常にデプロイ可能に保てます。",
    },
  },
  {
    question: {
      en: "Squash merge vs merge commit on a hosting provider?",
      np: "host मा squash merge बनाम merge commit?",
      jp: "ホスト上の squash merge とマージコミット？",
    },
    answer: {
      en: "Squash collapses the whole PR into one commit on `main` — clean history, loses per-commit detail. Merge commit preserves the branch topology and every commit message from the PR.",
      np: "Squash ले PR लाई एउटा commit मा — सफा तर विस्तृत हराउँछ। Merge commit ले टोपोलोजी र प्रत्येक सन्देश जोगाउँछ।",
      jp: "squash は PR を1コミットに畳み履歴は簡潔だが中身の粒度は失われます。merge commit はブランチ形状と各コミットを残します。",
    },
  },
  {
    question: {
      en: "What is the difference between a pre-commit hook and CI on the server?",
      np: "pre-commit hook र सर्भर CI मा के फरक?",
      jp: "pre-commit フックとサーバ側 CI の違いは？",
    },
    answer: {
      en: "Hooks run locally in milliseconds before the commit even exists remotely — they catch cheap mistakes early. CI runs in a clean environment everyone trusts, but minutes later.",
      np: "Hook स्थानीयमा छिटो — सस्तो गल्ती अघि नै। CI सफा वातावरणमा, केही मिनेटपछि।",
      jp: "フックはローカルで即時、安いチェックに強い。CI は信頼できる共通環境で数分後に本番に近い検証をします。",
    },
  },
  {
    question: {
      en: "Where do client-side Git hooks live by default?",
      np: "client-side Git hook पूर्वनिर्धारित कहाँ बस्छन्?",
      jp: "クライアント側フックの既定の場所は？",
    },
    answer: {
      en: "In `.git/hooks/` inside your repository — scripts must be executable; they are not cloned to teammates unless you adopt a hook manager.",
      np: "रेपोभित्र `.git/hooks/` — executable हुनुपर्छ; hook manager बिना clone मा जाँदैनन्।",
      jp: "リポジトリ内の `.git/hooks/` です。実行権が必要で、フック管理ツールなしでは clone で共有されません。",
    },
  },
  {
    question: {
      en: "What might a `commit-msg` hook validate?",
      np: "`commit-msg` hook ले के जाँच गर्न सक्छ?",
      jp: "`commit-msg` フックで検証しがちなのは？",
    },
    answer: {
      en: "Message format (ticket IDs, Conventional Commits prefixes), length limits, or forbidden words — rejects the commit before it is finalized.",
      np: "सन्देश ढाँचा (ticket ID, Conventional Commits), लम्बाइ, वा निषेधित शब्द — commit अन्तिम हुनुअघि अस्वीकार।",
      jp: "チケットIDや Conventional Commits 形式、長さ、禁止語など。コミット確定前に弾けます。",
    },
  },
  {
    question: {
      en: "After `git bisect start`, what do `bad` and `good` mean?",
      np: "`git bisect start` पछि `bad` र `good` को अर्थ?",
      jp: "`bisect start` のあと `bad` / `good` の意味は？",
    },
    answer: {
      en: "They label whether the checked-out revision reproduces the bug (`bad`) or is known healthy (`good`) — Git uses that to binary-search toward the first bad commit.",
      np: "`bad` = bug देखिने संशोधन, `good` = स्वस्थ थाहा भएको — Git ले binary search गर्छ।",
      jp: "`bad` は不具合あり、`good` は正常と分かっている版です。二分探索で最初の bad を絞ります。",
    },
  },
  {
    question: {
      en: "Why run `git bisect reset` when finished?",
      np: "सकिएपछि `git bisect reset` किन?",
      jp: "終わったら `git bisect reset` はなぜ？",
    },
    answer: {
      en: "Bisect leaves you on a detached mid-history commit — reset returns `HEAD` to the branch you started from so you can keep working normally.",
      np: "Bisect ले detached मध्य-इतिहासमा छोड्छ — reset ले सुरु गरेको ब्रान्चमा `HEAD` फर्काउँछ।",
      jp: "bisect 中は detached になりがちです。reset で元のブランチ先端に戻し通常作業に復帰します。",
    },
  },
  {
    question: {
      en: "Why is code review in a PR valuable even with passing CI?",
      np: "CI पास भएपछि पनि PR मा code review किन मूल्यवान्?",
      jp: "CI が通っても PR でのレビューに価値があるのは？",
    },
    answer: {
      en: "Humans catch design mistakes, missing edge cases, and readability issues that tests never assert — knowledge spreads across the team.",
      np: "मानवले डिजाइन, edge case, पढ्ने सजिलो समात्छन् — ज्ञान टोलीमा फैलिन्छ।",
      jp: "設計ミスやテストがカバーしない境界、可読性は人が拾います。知識共有にもなります。",
    },
  },
  {
    question: {
      en: "When is force-with-lease safer than `--force`?",
      np: "`--force` भन्दा force-with-lease कहिले सुरक्षित?",
      jp: "`--force` より `--force-with-lease` が安全なのは？",
    },
    answer: {
      en: "When you must overwrite a remote branch but want Git to refuse if someone else pushed in the meantime — prevents silently dropping their commits.",
      np: "रिमोट ब्रान्च मेटाउनु पर्दा तर अरूले बीचमा push गरे अस्वीकार गर्न — उनीहरूको commit चुपचाप नगुमाउन।",
      jp: "リモートを上書きしたいが、他者が先に push していたら失敗させたいとき。知らぬ間に他人のコミットを消すのを防げます。",
    },
  },
  {
    question: {
      en: "Name two server-side hook events and what they guard?",
      np: "दुईटा server-side hook घटना र के जोगाउँछन्?",
      jp: "サーバ側フックの例を2つと役割は？",
    },
    answer: {
      en: "`pre-receive` / `update` can reject pushes that break policy (unsigned commits, forbidden paths). `post-receive` often triggers deploys or notifications after the push is accepted.",
      np: "`pre-receive`/`update` ले नीति उल्लङ्घन push अस्वीकार गर्न सक्छन्। `post-receive` ले स्वीकृत पछि deploy/सूचना।",
      jp: "`pre-receive` / `update` はポリシー違反の push を拒否できます。`post-receive` は受理後のデプロイや通知に使われます。",
    },
  },
];
