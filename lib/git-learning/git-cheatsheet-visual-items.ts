import type { LocalizedString } from "@/lib/i18n/types";

export type GitCheatsheetVisualId =
  | "init"
  | "clone"
  | "add"
  | "commit"
  | "branch"
  | "branchList"
  | "remoteSync"
  | "stash"
  | "log"
  | "merge"
  | "diff"
  | "reset"
  | "rebase"
  | "worktree";

export type GitRoadmapCheatsheetItem = {
  cmd: string;
  description: LocalizedString;
  visual: GitCheatsheetVisualId;
  /** When true, skip the before/after strip (e.g. bidirectional sync). */
  hideBeforeAfterLabels?: boolean;
};

/** Visual cheatsheet entries (shown on Git roadmap after Advanced week). */
export const GIT_ROADMAP_CHEATSHEET_ITEMS: GitRoadmapCheatsheetItem[] = [
  {
    cmd: "git init",
    description: {
      en: "Creates an empty `.git` directory in your project folder — that folder becomes the object database and metadata for the new repository.",
      np: "परियोजना फोल्डरमा खाली `.git` निर्देशिका बनाउँछ — त्यो नयाँ रेपोको वस्तु भण्डार र मेटाडेटा हो।",
      jp: "プロジェクト直下に空の `.git` を作り、その中にオブジェクトDBとメタデータを置いてリポジトリ化します。",
    },
    visual: "init",
  },
  {
    cmd: "git clone <url>",
    description: {
      en: "Copies the remote repository into a new directory, including full history, branches, and a default `origin` remote pointing back to the server.",
      np: "रिमोट रेपो नयाँ फोल्डरमा पूर्ण इतिहास र ब्रान्चसहित प्रतिलिपि; पूर्वनिर्धारित `origin`।",
      jp: "リモートを丸ごと新しいフォルダに複製し、履歴・ブランチに加え `origin` を設定します。",
    },
    visual: "clone",
  },
  {
    cmd: "git add",
    description: {
      en: "Copies changes from your working tree into the staging area (index) so the next `git commit` can snapshot exactly what you selected.",
      np: "कार्य ट्रीबाट परिवर्तन स्टेजिङ (index) मा प्रतिलिपि गर्छ; अर्को `git commit` ले त्यही स्न्यापसट लिन्छ।",
      jp: "作業ツリーの変更をステージング（index）に載せ、次の `git commit` でその内容をまとめて記録します。",
    },
    visual: "add",
  },
  {
    cmd: "git commit",
    description: {
      en: "Freezes the staged tree into a new commit object on the current branch; your working tree is unchanged except staged files become clean for those paths.",
      np: "स्टेज गरिएको ट्रीलाई हालको ब्रान्चमा नयाँ commit मा स्थिर गर्छ।",
      jp: "ステージされた内容を現在のブランチに新しいコミットとして確定します。",
    },
    visual: "commit",
  },
  {
    cmd: "git log --oneline --graph",
    description: {
      en: "Prints a compact one-line-per-commit history with an ASCII branch graph. Add `-n 20` to limit depth. Use `git show <hash>` to inspect any single commit fully.",
      np: "प्रति commit एक लाइन र ASCII ग्राफ। `-n 20` ले सीमित। एक commit विस्तार हेर्न `git show <hash>`।",
      jp: "1行/コミットの要約と ASCII グラフを表示。`-n 20` で件数制限、詳細は `git show <hash>`。",
    },
    visual: "log",
    hideBeforeAfterLabels: true,
  },
  {
    cmd: "git diff [--staged]",
    description: {
      en: "`git diff` shows unstaged changes (working tree vs index). `git diff --staged` shows what's queued for the next commit (index vs last commit). Run both before every `git commit`.",
      np: "`git diff` ले अनस्टेज परिवर्तन; `--staged` ले index बनाम अन्तिम commit। `git commit` अघि दुवै चलाउनुहोस्।",
      jp: "`git diff` は未ステージ差分、`--staged` はインデックスと直前コミットの差分。毎回両方確認を。",
    },
    visual: "diff",
    hideBeforeAfterLabels: true,
  },
  {
    cmd: "git switch -c <branch>",
    description: {
      en: "Creates a new branch at the current commit and moves HEAD there. Name it to describe the work — `feature/login`, `fix/null-crash`, `chore/upgrade-deps`. When done, merge it back and delete it with `git branch -d`.",
      np: "हालको commit मा नयाँ ब्रान्च बनाउँछ र HEAD सार्छ। नाम कामको विवरण दिनुहोस् — `feature/login`, `fix/null-crash`। काम सकिएपछि merge गरी `git branch -d` ले मेटाउनुहोस्।",
      jp: "現在のコミットから新しいブランチを作り HEAD を移します。作業内容がわかる名前を付けましょう（`feature/login`、`fix/null-crash` など）。完了後は merge して `git branch -d` で削除。",
    },
    visual: "branch",
  },
  {
    cmd: "git branch",
    description: {
      en: "Lists local branch names; the line with `*` is your current checkout. Use `git branch -a` to include remote-tracking branches (for example `remotes/origin/main`) after a fetch.",
      np: "स्थानीय ब्रान्च नामहरू सूची; `*` भएको हालको checkout हो। `git branch -a` ले remote-tracking ब्रान्च पनि देखाउँछ।",
      jp: "ローカルブランチ名を一覧表示します。先頭の `*` が現在のチェックアウトです。`git branch -a` でリモート追跡（例: `remotes/origin/main`）も表示できます。",
    },
    visual: "branchList",
    hideBeforeAfterLabels: true,
  },
  {
    cmd: "git merge <branch>",
    description: {
      en: "Joins two branch histories into a merge commit (unless fast-forward is possible). Use `--no-ff` to always record a merge commit even when FF is possible.",
      np: "दुई ब्रान्च इतिहास मर्ज commit मा जोड्छ (FF सम्भव नभए)। `--no-ff` ले सधैं मर्ज commit बनाउँछ।",
      jp: "2つのブランチを統合するマージコミットを作ります（早送り可能でなければ）。`--no-ff` で常にマージコミットを残せます。",
    },
    visual: "merge",
    hideBeforeAfterLabels: true,
  },
  {
    cmd: "git push / git pull",
    description: {
      en: "`git push` uploads your new commits to the remote; `git pull` fetches remote commits and merges (or rebases) them into your current branch.",
      np: "`git push` ले नयाँ commit रिमोटमा पठाउँछ; `git pull` ले तानेर हालको ब्रान्चमा मिलाउँछ।",
      jp: "`git push` でローカルのコミットを送り、`git pull` でリモートの更新を取り込みます。",
    },
    visual: "remoteSync",
    hideBeforeAfterLabels: true,
  },
  {
    cmd: "git rebase <upstream>",
    description: {
      en: "Replays your commits on top of another branch tip, producing a straight-line history. Use `git rebase -i HEAD~n` to interactively squash, reorder, or drop commits before a PR.",
      np: "commit हरू अर्को ब्रान्च टिप माथि पुन: चलाउँछ। `git rebase -i HEAD~n` ले interactive squash/reorder/drop।",
      jp: "コミットを別のブランチ先端の上に積み直し、直線履歴にします。`git rebase -i HEAD~n` で squash・並び替え・削除が対話的に可能。",
    },
    visual: "rebase",
    hideBeforeAfterLabels: true,
  },
  {
    cmd: "git reset --soft|mixed|hard",
    description: {
      en: "Moves HEAD (and branch pointer) to a target commit. `--soft` keeps index; `--mixed` (default) unstages; `--hard` also resets the working tree — destructive. Recover with `git reflog`.",
      np: "HEAD र ब्रान्च सूचक लक्षित commit मा सार्छ। `--soft` ले index जोगाउँछ; `--mixed` अनस्टेज; `--hard` विनाशकारी। `git reflog` ले पुनर्प्राप्ति।",
      jp: "HEAD とブランチポインタを指定コミットへ移動。`--soft` は index 保持、`--mixed` は unstage、`--hard` は作業ツリーも巻き戻す（破壊的）。`git reflog` で復旧可能。",
    },
    visual: "reset",
    hideBeforeAfterLabels: true,
  },
  {
    cmd: "git stash",
    description: {
      en: "Temporarily shelves uncommitted changes so you can switch branches or pull with a clean tree; `stash pop` reapplies them later.",
      np: "अस्थायी रूपमा अनcommit परिवर्तन राख्छ; `stash pop` ले पछि फर्काउँछ।",
      jp: "未コミットの変更を一時退避し、きれいな作業ツリーでブランチ切替や pull ができます。",
    },
    visual: "stash",
  },
  {
    cmd: "git worktree add <path> -b <branch>",
    description: {
      en: "Creates a second working directory in a sibling folder, checked out on a new branch — both folders share the same `.git` object store. Use it when you need to fix a hotfix on `main` while a long refactor is in progress on your current branch, without stashing or cloning.",
      np: "अर्को फोल्डरमा दोस्रो कार्य निर्देशिका बनाउँछ, नयाँ ब्रान्चमा checkout गरिएको — दुवै फोल्डरले एउटै `.git` साझा गर्छन्। लामो refactor बीचमा `main` मा hotfix गर्न — stash वा clone बिना।",
      jp: "隣のフォルダに別の作業ディレクトリを作り、新しいブランチでチェックアウトします。2つのフォルダは同じ `.git` を共有します。長いリファクタ中に `main` の緊急修正が必要なとき、stash や clone 不要で対応できます。",
    },
    visual: "worktree",
    hideBeforeAfterLabels: true,
  },
];
