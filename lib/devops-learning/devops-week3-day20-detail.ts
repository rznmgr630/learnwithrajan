import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Merge conflicts are inevitable in any team that moves fast. The engineers who handle them quickly and confidently are the ones who understand what Git is actually doing when it merges — not just the commands, but the three-way merge algorithm that drives them. And code review is not about finding bugs alone; it is the primary mechanism teams use to transfer knowledge, enforce standards, and catch architectural mistakes before they become technical debt.",
    np: "Merge conflict छिटो move गर्ने कुनै पनि team मा inevitable छ। तिनीहरूलाई छिटो र confidently handle गर्ने engineer तिनीहरू हुन् जसले Git ले merge गर्दा वास्तवमा के गर्छ बुझ्छन् — केवल command होइन, तिनीहरूलाई drive गर्ने three-way merge algorithm पनि। Code review केवल bug खोज्ने बारे होइन; यो team ले knowledge transfer, standard enforce, र architectural mistake technical debt हुनु अघि catch गर्न प्रयोग गर्ने primary mechanism हो।",
    jp: "マージコンフリクトは速く動くチームでは避けられません。それらを迅速かつ自信を持って処理するエンジニアは、Git がマージする際に実際に何をしているかを理解している人たちです — コマンドだけでなく、それらを駆動する 3 方向マージアルゴリズムも。そしてコードレビューはバグを見つけるだけではありません；チームが知識を移転し、標準を強制し、技術的負債になる前にアーキテクチャ上のミスを捉えるために使う主要なメカニズムです。",
  } as const,
  o2: {
    en: "Today you learn exactly how conflicts happen, how to resolve them manually and with tools, when to rebase vs merge to minimize conflicts, and the code review practices that high-performing engineering teams use.",
    np: "आज तपाईंले exactly conflict कसरी हुन्छ, manually र tool ले कसरी resolve गर्ने, conflict minimize गर्न कहिले rebase vs merge, र high-performing engineering team ले प्रयोग गर्ने code review practice सिक्नुहुनेछ।",
    jp: "本日はコンフリクトがどのように発生するか・手動およびツールでの解決方法・コンフリクトを最小化するためのリベース対マージの使い分け・高パフォーマンスのエンジニアリングチームが使うコードレビューの実践を学びます。",
  } as const,
};

export const DEVOPS_DAY_20_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "How merge conflicts happen — the three-way merge",
        np: "Merge conflict कसरी हुन्छ — three-way merge",
        jp: "マージコンフリクトが発生する仕組み — 3 方向マージ",
      },
      blocks: [
        { type: "diagram", id: "devops-merge-conflict" },
        {
          type: "paragraph",
          text: {
            en: "Git's three-way merge compares three versions of a file: the **common ancestor** (the commit where both branches diverged), your branch's version, and the other branch's version. If only one side changed a region, Git auto-merges. If both sides changed the same region differently, Git cannot decide — it marks the file with conflict markers and asks you to resolve. Understanding this means you can predict when conflicts will occur and structure your work to avoid them.",
            np: "Git को three-way merge ले file को तीन version compare गर्छ: **common ancestor** (दुवै branch diverge भएको commit), तपाईंको branch को version, र अर्को branch को version। यदि एक मात्र side ले region change गर्यो भने, Git auto-merge गर्छ। दुवै side ले same region फरक तरिकाले change गर्यो भने, Git decide गर्न सक्दैन — conflict marker ले file mark गर्छ र resolve गर्न भन्छ।",
            jp: "Git の 3 方向マージは、ファイルの 3 つのバージョンを比較します：**共通祖先**（両ブランチが分岐したコミット）・あなたのブランチのバージョン・もう一方のブランチのバージョン。一方だけが領域を変更した場合、Git は自動マージします。両方が同じ領域を異なる方法で変更した場合、Git は決定できません — 競合マーカーでファイルをマークし、解決を求めます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Reading conflict markers — what Git is telling you",
            np: "Conflict marker पढ्नुहोस् — Git ले के भन्दैछ",
            jp: "競合マーカーを読む — Git が何を言っているか",
          },
          code: `# After a conflicting merge, conflicted files look like this:
# <<<<<<< HEAD                   ← your changes (current branch)
# function fetchUser(id) {
#   return db.users.findOne(id);  ← your version
# }
# =======                        ← separator
# function fetchUser(id, opts) {
#   return db.users.findOne(id, opts);  ← their version (incoming)
# }
# >>>>>>> feature/add-user-options  ← their branch name

# How to read it:
# Everything between <<<< HEAD and ==== is YOUR current branch version
# Everything between ==== and >>>> their-branch is THE INCOMING version
# You must decide: keep mine, keep theirs, or write something new

# Diff3 style (shows common ancestor — more context):
git config --global merge.conflictstyle diff3
# Shows:
# <<<<<<< HEAD
# (your changes)
# ||||||| common ancestor
# (original content before either change)
# =======
# (their changes)
# >>>>>>> feature/branch

# List all files with conflicts
git status                        # shows 'both modified: path/file.py'
git diff --name-only --diff-filter=U  # unmerged files only`,
        },
      ],
    },
    {
      title: {
        en: "Resolving conflicts — manual and tool-assisted",
        np: "Conflict resolve गर्नुहोस् — manual र tool-assisted",
        jp: "コンフリクトの解決 — 手動とツールサポート",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Step-by-step conflict resolution workflow",
            np: "Step-by-step conflict resolution workflow",
            jp: "段階的なコンフリクト解決ワークフロー",
          },
          code: `# Scenario: merging feature/payment into main causes conflict

# Step 1: Start the merge
git switch main
git merge feature/payment
# CONFLICT (content): Merge conflict in src/checkout.ts
# Automatic merge failed; fix conflicts and then commit the result.

# Step 2: See what's conflicted
git status
git diff                          # shows conflict markers in diff format

# Step 3a: Manual resolution — edit the file
# Open src/checkout.ts in your editor
# Remove the conflict markers (<<<<, ====, >>>>)
# Write the correct merged version (may require understanding both changes)
# Save the file

# Step 3b: Use a merge tool (visual 3-pane diff)
git mergetool                     # opens your configured mergetool
git config --global merge.tool vimdiff   # or: vscode, meld, kdiff3, opendiff

# VS Code as merge tool:
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'
git mergetool                     # opens VS Code with merge editor

# Step 4: After resolving each file, stage it
git add src/checkout.ts
git add src/payment.ts            # resolve and stage each conflicted file

# Step 5: Check nothing is still conflicted
git status                        # no 'both modified' entries? good

# Step 6: Complete the merge
git commit                        # uses auto-generated merge commit message
# Or abort the whole merge to go back to before:
git merge --abort                 # only works before the commit step

# Theirs / ours shortcuts (for cases where one side is clearly right)
git checkout --ours src/lockfile.json    # take your version
git checkout --theirs src/lockfile.json  # take their version
git add src/lockfile.json`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Prevent conflicts before they happen**: keep branches short-lived (merge within 2 days), communicate with teammates when you are working on the same file, and structure code so modules are loosely coupled (changes are localized). The best conflict is one that never happens.",
              np: "**Conflict हुनु अघि prevent गर्नुहोस्**: branch short-lived राख्नुहोस् (2 दिन भित्र merge), same file मा काम गर्दा teammate सँग communicate गर्नुहोस्, र module loosely coupled हुने गरी code structure गर्नुहोस्। सबभन्दा राम्रो conflict त्यो हो जुन कहिल्यै हुँदैन।",
              jp: "**コンフリクトが起こる前に防ぐ**: ブランチを短命に保ち（2 日以内にマージ）、同じファイルで作業するときはチームメートとコミュニケーションを取り、変更が局所化されるようにモジュールを疎結合で構造化する。最良のコンフリクトは決して起こらないものです。",
            },
            {
              en: "**Rebase before merging** — if you rebase your feature branch on top of main before opening a PR, you incorporate the latest changes from main early. Conflicts surface immediately (and are smaller), rather than all at once during the merge. The reviewer also gets a clean diff against the actual current state of main.",
              np: "**Merge गर्नु अघि rebase गर्नुहोस्** — PR open गर्नु अघि feature branch लाई main माथि rebase गर्यो भने, early मा main को latest change incorporate गर्नुहुन्छ। Conflict तुरुन्त देखिन्छ (र साना हुन्छन्), merge को समयमा एकैचोटि होइन।",
              jp: "**マージ前にリベース** — PR を開く前にフィーチャーブランチを main の上にリベースすると、main の最新変更を早期に取り込みます。コンフリクトはマージ時に一度にではなく、すぐに表面化します（そして小さくなります）。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "git bisect — finding regressions automatically",
        np: "git bisect — automatically regression खोज्नुहोस्",
        jp: "git bisect — 自動的にリグレッションを見つける",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Binary search through commit history",
            np: "Commit history मा binary search",
            jp: "コミット履歴の二分探索",
          },
          code: `# Scenario: "the tests were passing 3 weeks ago, now they fail"
# git bisect uses binary search to find the first bad commit

# Start bisect
git bisect start
git bisect bad                    # current HEAD is broken
git bisect good v1.3.0            # this tag/commit was working

# Git checks out a commit halfway between good and bad
# Test it: does the bug exist?
# If yes → mark as bad
git bisect bad
# If no → mark as good
git bisect good
# Repeat until Git says: "abc1234 is the first bad commit"

# Automate with a test script (runs the script at each step)
git bisect run ./test.sh
# test.sh should exit 0 if good, non-zero if bad

# Example test script:
cat > /tmp/test.sh << 'EOF'
#!/bin/bash
npm test -- --testPathPattern="checkout" 2>&1 | grep -q "PASS"
EOF
chmod +x /tmp/test.sh
git bisect run /tmp/test.sh

# When done, return to the branch tip
git bisect reset

# View the bisect log
git bisect log`,
        },
      ],
    },
    {
      title: {
        en: "Code review — practices that high-performing teams use",
        np: "Code review — high-performing team ले प्रयोग गर्ने practice",
        jp: "コードレビュー — 高パフォーマンスチームが使う実践",
      },
      blocks: [
        {
          type: "table",
          caption: {
            en: "Code review best practices — author and reviewer responsibilities",
            np: "Code review best practice — author र reviewer को responsibility",
            jp: "コードレビューのベストプラクティス — 作者とレビュアーの責任",
          },
          headers: [
            { en: "Role", np: "Role", jp: "役割" },
            { en: "Best practice", np: "Best practice", jp: "ベストプラクティス" },
            { en: "Why it matters", np: "Why it matters", jp: "なぜ重要か" },
          ],
          rows: [
            [
              { en: "Author", np: "Author", jp: "作者" },
              { en: "Keep PRs small (< 400 lines changed)", np: "PR सानो राख्नुहोस् (< 400 lines)", jp: "PR を小さく保つ（変更 400 行未満）" },
              { en: "Large PRs get rubber-stamped; small PRs get real review", np: "Large PR rubber-stamp हुन्छ; small PR ले real review पाउँछ", jp: "大きな PR はスタンプされるだけ；小さな PR は本物のレビューを受ける" },
            ],
            [
              { en: "Author", np: "Author", jp: "作者" },
              { en: "Write a clear PR description: what changed, why, how to test", np: "Clear PR description: के बदलियो, किन, कसरी test गर्ने", jp: "明確な PR の説明：何が変わったか・なぜ・どのようにテストするか" },
              { en: "Saves reviewer time, reduces back-and-forth", np: "Reviewer को समय बचाउँछ, back-and-forth कम गर्छ", jp: "レビュアーの時間を節約し、やり取りを減らす" },
            ],
            [
              { en: "Author", np: "Author", jp: "作者" },
              { en: "Self-review the diff before requesting review", np: "Review request गर्नु अघि self-review diff", jp: "レビューをリクエストする前に差分を自分でレビューする" },
              { en: "Catches obvious mistakes before wasting reviewer time", np: "Reviewer को समय waste गर्नु अघि obvious mistake catch गर्छ", jp: "レビュアーの時間を無駄にする前に明らかなミスを捕捉する" },
            ],
            [
              { en: "Reviewer", np: "Reviewer", jp: "レビュアー" },
              { en: "Review within 24 hours (or set team SLA)", np: "24 घण्टा भित्र review (वा team SLA set)", jp: "24 時間以内にレビュー（またはチームの SLA を設定）" },
              { en: "PRs stuck in review become the bottleneck; velocity drops", np: "Review मा stuck PR bottleneck बन्छ; velocity घट्छ", jp: "レビュー待ちの PR がボトルネックになる；速度が低下する" },
            ],
            [
              { en: "Reviewer", np: "Reviewer", jp: "レビュアー" },
              { en: "Distinguish blocking vs non-blocking comments explicitly", np: "Blocking vs non-blocking comment explicitly distinguish गर्नुहोस्", jp: "ブロッキングとノンブロッキングのコメントを明示的に区別する" },
              { en: "Author knows which comments must be addressed vs are optional", np: "Author लाई थाहा हुन्छ कुन comment address गर्नुपर्छ vs optional", jp: "作者はどのコメントに対処する必要があるか・任意かを知ることができる" },
            ],
            [
              { en: "Reviewer", np: "Reviewer", jp: "レビュアー" },
              { en: "Ask questions instead of issuing commands", np: "Command issue गर्नु भन्दा question सोध्नुहोस्", jp: "命令を下すのではなく質問をする" },
              { en: "Respectful tone; author may have a reason you don't see yet", np: "Respectful tone; author सँग reason हुन सक्छ जो तपाईंले देख्नुभएको छैन", jp: "丁重なトーン；作者にはまだ見えていない理由があるかもしれない" },
            ],
            [
              { en: "Both", np: "Both", jp: "両方" },
              { en: "Automate what can be automated (lint, format, tests in CI)", np: "Automate गर्न सकिने automate गर्नुहोस् (lint, format, CI test)", jp: "自動化できるものは自動化する（リント・フォーマット・CI のテスト）" },
              { en: "Humans review logic and architecture; machines review style", np: "Human ले logic र architecture review; machine ले style", jp: "人間がロジックとアーキテクチャをレビュー；機械がスタイルをレビュー" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "GitHub PR workflow — from push to merge",
            np: "GitHub PR workflow — push बाट merge सम्म",
            jp: "GitHub PR ワークフロー — プッシュからマージまで",
          },
          code: `# Create a well-structured PR with gh CLI
gh pr create \
  --title "feat(checkout): add Stripe payment integration" \
  --body "$(cat <<'EOF'
## Summary
- Integrates Stripe Checkout for one-time payments
- Adds webhook handler for payment confirmation events
- Stores payment intent ID in orders table

## Testing
1. Set STRIPE_SECRET_KEY in .env.local
2. Run: npm run dev
3. Add item to cart and complete checkout with test card: 4242 4242 4242 4242

## Checklist
- [x] Unit tests added
- [x] Integration test against Stripe test mode
- [x] CHANGELOG.md updated
- [x] No hardcoded secrets
EOF
)"

# View PR status
gh pr status                      # all your open PRs
gh pr checks                      # CI status on current branch PR

# Review a PR (as a reviewer)
gh pr checkout 142                # check out the PR branch locally
gh pr diff 142                    # see the diff without checking out

# Add a review
gh pr review 142 --comment --body "nit: rename \`amt\` to \`amount\` for clarity"
gh pr review 142 --request-changes --body "The webhook handler doesn't verify the Stripe signature — this is a security issue. See: stripe.com/docs/webhooks/signatures"
gh pr review 142 --approve --body "LGTM after the signature verification is added. Nice work!"

# Merge strategies
gh pr merge 142 --squash          # squash all commits into one
gh pr merge 142 --merge           # preserve all commits with merge commit
gh pr merge 142 --rebase          # rebase and fast-forward

# Auto-merge when CI passes
gh pr merge 142 --auto --squash   # merge automatically when CI + approvals done`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: Create, conflict, resolve, and review",
        np: "Hands-on: Create, conflict, resolve, र review गर्नुहोस्",
        jp: "ハンズオン: 作成・コンフリクト・解決・レビュー",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Simulate and resolve a real merge conflict",
            np: "Real merge conflict simulate र resolve गर्नुहोस्",
            jp: "実際のマージコンフリクトをシミュレートして解決する",
          },
          code: `# Setup
mkdir conflict-demo && cd conflict-demo
git init
echo 'TIMEOUT=30\nRETRIES=3\nLOG_LEVEL=info' > config.txt
git add config.txt
git commit -m "feat: initial config"

# Branch A: changes TIMEOUT and LOG_LEVEL
git switch -c branch-a
sed -i 's/TIMEOUT=30/TIMEOUT=60/' config.txt
sed -i 's/LOG_LEVEL=info/LOG_LEVEL=debug/' config.txt
git add config.txt
git commit -m "fix: increase timeout and enable debug logging"

# Branch B: also changes TIMEOUT (conflict!) and adds a new key
git switch main
git switch -c branch-b
sed -i 's/TIMEOUT=30/TIMEOUT=45/' config.txt      # conflicts with branch-a!
echo 'MAX_CONNECTIONS=100' >> config.txt            # no conflict
git add config.txt
git commit -m "feat: set conservative timeout and add connection limit"

# Now merge branch-a into main
git switch main
git merge branch-a           # fast-forward, no conflict

# Try to merge branch-b — CONFLICT on TIMEOUT line
git merge branch-b
# CONFLICT (content): Merge conflict in config.txt

# Inspect the conflict
cat config.txt
# <<<<<<< HEAD
# TIMEOUT=60
# =======
# TIMEOUT=45
# >>>>>>> branch-b

# Resolve: choose 60 (production needs the longer timeout)
cat > config.txt << 'EOF'
TIMEOUT=60
RETRIES=3
LOG_LEVEL=debug
MAX_CONNECTIONS=100
EOF

git add config.txt
git commit -m "merge: resolve TIMEOUT conflict, keep 60s for production"

# Verify clean history
git log --oneline --graph --all

# Try git bisect to find which commit changed RETRIES
git bisect start
git bisect good HEAD~3
git bisect bad HEAD
# Follow the prompts...
git bisect reset`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When I rebase instead of merge, do I lose the record that a feature branch existed?",
        np: "Merge को सट्टा rebase गर्दा, feature branch थियो भन्ने record हराउँछ?",
        jp: "マージの代わりにリベースすると、フィーチャーブランチが存在したという記録が失われるか？",
      },
      answer: {
        en: "Yes — with a rebase or squash merge, the branch topology is lost from `git log`. You get a cleaner linear history but no merge commit to mark 'here is where feature X was integrated.' If you need that record (GitFlow requires it), use `--no-ff` merge. If you care more about a readable linear history (GitHub Flow), use squash or rebase. GitHub preserves the PR record separately, so even after a squash merge you can find the original commits via the PR link.",
        np: "हो — rebase वा squash merge ले `git log` बाट branch topology हराउँछ। Cleaner linear history पाउनुहुन्छ तर 'यहाँ feature X integrate भयो' भन्ने mark गर्न merge commit हुँदैन। त्यो record चाहिन्छ (GitFlow ले require गर्छ) भने `--no-ff` merge प्रयोग गर्नुहोस्। Readable linear history more important (GitHub Flow) भने squash वा rebase प्रयोग गर्नुहोस्।",
        jp: "はい — リベースまたはスカッシュマージでは、ブランチのトポロジーが `git log` から失われます。クリーンな線形履歴が得られますが、「ここでフィーチャー X が統合された」とマークするマージコミットはありません。そのレコードが必要な場合（GitFlow はそれを要求します）、`--no-ff` マージを使います。より読みやすい線形履歴を重視する場合（GitHub Flow）、スカッシュまたはリベースを使います。",
      },
      tag: { en: "git", np: "git", jp: "Git" },
    },
    {
      question: {
        en: "How do I undo a merge that has already been pushed?",
        np: "Already push भएको merge undo कसरी गर्ने?",
        jp: "すでにプッシュされたマージを元に戻す方法は？",
      },
      answer: {
        en: "Use `git revert -m 1 <merge-commit-hash>`. The `-m 1` flag tells Git which parent is the 'mainline' (usually parent 1, which is the branch you merged into). This creates a new commit that reverses the changes without rewriting history — safe to push to shared branches. Never use `git reset --hard` on a merge commit that others have already pulled, because resetting rewrites history and forces everyone else to deal with diverged branches.",
        np: "`git revert -m 1 <merge-commit-hash>` प्रयोग गर्नुहोस्। `-m 1` flag ले Git लाई कुन parent 'mainline' हो बताउँछ (सामान्यतया parent 1, जुन तपाईंले merge गरेको branch हो)। यसले history rewrite नगरी changes reverse गर्ने नयाँ commit create गर्छ — shared branch मा push गर्न safe। Others ले already pull गरेको merge commit मा कहिल्यै `git reset --hard` प्रयोग नगर्नुहोस्।",
        jp: "`git revert -m 1 <マージコミットハッシュ>` を使います。`-m 1` フラグは Git にどの親が「メインライン」かを伝えます（通常は親 1、マージ先のブランチ）。これは履歴を書き換えずに変更を逆転する新しいコミットを作成します — 共有ブランチへのプッシュに安全。他の人がすでにプルしたマージコミットには絶対に `git reset --hard` を使わないでください。リセットは履歴を書き換え、他の全員が分岐したブランチに対処することを強います。",
      },
      tag: { en: "git", np: "git", jp: "Git" },
      callout: {
        en: "Safe undo of a pushed merge: `git revert -m 1 <hash>` then `git push`. Never reset --hard on shared history.",
        np: "Pushed merge को safe undo: `git revert -m 1 <hash>` त्यसपछि `git push`। Shared history मा कहिल्यै reset --hard नगर्नुहोस्।",
        jp: "プッシュされたマージの安全な取り消し：`git revert -m 1 <hash>` の後 `git push`。共有履歴には絶対に reset --hard しない。",
      },
    },
    {
      question: {
        en: "How many approvals should a PR require?",
        np: "PR लाई कति approval चाहिन्छ?",
        jp: "PR には何件の承認が必要か？",
      },
      answer: {
        en: "For most teams: 1 required approval with required CI passing is the pragmatic default. Two approvals slow teams down significantly without proportional quality gains. Exceptions: security-sensitive code (auth, payments, secrets management) should require 2 approvals, and infrastructure changes should always require review from someone who owns the infra. Use CODEOWNERS to automatically request the right reviewer based on what files were changed.",
        np: "अधिकांश team का लागि: 1 required approval र required CI passing pragmatic default हो। दुई approval ले team लाई proportional quality gain बिना significantly slow गर्छ। Exception: security-sensitive code (auth, payment, secrets management) ले 2 approval require गर्नुपर्छ, र infrastructure change ले सधैं infra own गर्ने कसैको review require गर्नुपर्छ।",
        jp: "ほとんどのチームにとって：1 つの必須承認と必須 CI の通過が実用的なデフォルトです。2 つの承認は比例する品質向上なしにチームを大幅に遅らせます。例外：セキュリティに敏感なコード（認証・決済・シークレット管理）は 2 つの承認が必要で、インフラの変更は常にインフラを所有する人のレビューが必要です。CODEOWNERS を使って、変更されたファイルに基づいて適切なレビュアーを自動的にリクエストします。",
      },
      tag: { en: "git", np: "git", jp: "Git" },
    },
  ],
};
