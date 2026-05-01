import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_4_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**npm** (Node Package Manager) is how almost everyone installs libraries and tools: your **`package.json`** is the contract (“these packages at these version ranges”), and the **lockfile** makes installs repeatable on every laptop and CI machine.",
      np: "npm — package.json र lockfile ले एउटै रूख दोहोर्याउँछ।",
      jp: "**npm** と **package.json**・ロックファイルで依存を再現可能にする。",
    },
    {
      en: "Think of **semver** as traffic lights for upgrades: patch vs minor vs major tells you how risky an automatic update might be—combined with **`npm audit`**, you balance freshness against supply-chain safety.",
      np: "semver ले अपग्रेड जोखिम देखाउँछ — `npm audit` सँग मिलाउनुहोस्।",
      jp: "**semver** で更新のリスクを読む。**npm audit** で脆弱性も確認。",
    },
  ],
  sections: [
    {
      title: { en: "Introduction & package.json — project manifest", np: "परिचय र package.json", jp: "はじめにと package.json" },
      blocks: [
        {
          type: "code",
          title: { en: "Manifest + everyday commands", np: "package.json र आदेश", jp: "マニフェストとコマンド" },
          code: `// Run once in an empty folder:
//   npm init -y

{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {},
  "scripts": {
    "start": "node index.js"
  }
}

// Terminal:
//   npm install lodash
//   npm install --save-dev eslint
//   npx eslint --version`,
        },
        {
          type: "paragraph",
          text: {
            en: "**`npm install lodash`** downloads the package into **`node_modules/`** and records it in **`package.json`** + **`package-lock.json`** (default npm behavior). **`npx`** runs a package binary without installing it globally—ideal for one-off CLIs (`npx create-next-app`). Commit **`package-lock.json`** so teammates and CI install the **exact** same tree.",
            np: "`npm install` र lock commit गर्नुहोस्; `npx` ले अस्थायी CLI चलाउँछ।",
            jp: "`npm install` で依存を記録。**package-lock.json** はコミット。**npx** は一回だけの CLI に便利。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Scripts** — add a **start** command (for example running **`node index.js`**) so **`npm start`** works everywhere. Put lint/test/build commands there so CI and humans share one vocabulary.",
              np: "`npm run` ले टोलीको एउटै शब्दकोश।",
              jp: "**scripts** — `npm start` / `npm test` でコマンドを共有。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Installing, using packages & working with Git",
        np: "स्थापना, प्रयोग र Git",
        jp: "インストール・利用・Git",
      },
      blocks: [
        {
          type: "code",
          title: { en: "Install production vs dev-only packages", np: "स्थापना उदाहरण", jp: "依存の入れ方" },
          code: `# App dependency (recorded in "dependencies")
npm install express

# Tooling only — tests, linters (recorded in "devDependencies")
npm install --save-dev jest eslint

// In code:
const express = require('express');`,
        },
        {
          type: "paragraph",
          text: {
            en: "**`npm install pkg --save-dev`** (or `-D`) puts tools like ESLint and Jest under **`devDependencies`**—production installs can skip them with **`npm install --omit=dev`** to shrink deploy images. Never commit **`node_modules/`**; it is huge and reproducible from the lockfile.",
            np: "devDependencies उत्पादनमा छोड्न सकिन्छ; `node_modules` commit नगर्नु।",
            jp: "**devDependencies** は本番ビルドで省略可能。**node_modules** はコミットしない。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Using a package** — `const pkg = require('name')` or ESM `import`. Read the package **`exports`** field in **npm**—modern packages expose subpaths (`pkg/sub`) intentionally.",
              np: "`require` वा `import` — प्याकेजको `exports` हेर्नुहोस्।",
              jp: "**利用** — README と `exports` でエントリを確認。",
            },
            {
              en: "**Transitive dependencies** — when you install `express`, you pull dozens of indirect packages. That is why audits and lockfiles matter—your code might not mention a vulnerable package directly.",
              np: "अप्रत्यक्ष निर्भरता — `npm audit`।",
              jp: "**間接依存** — 見えないパッケージまでついてくる。",
            },
            {
              en: "**Secrets** — never put API keys in `package.json` or committed `.env`. Use environment variables and your host’s secret manager.",
              np: "गोप्य कुञ्जी commit नगर्नुहोस्।",
              jp: "**秘密情報** — package.json に書かない。",
            },
          ],
        },
      ],
    },
    {
      title: { en: "Semantic versioning & day-to-day npm commands", np: "Semver र आदेश", jp: "セマバとコマンド" },
      blocks: [
        {
          type: "code",
          title: { en: "Inspect versions before you bump", np: "संस्करण हेर्नु", jp: "バージョンを調べる" },
          code: `npm list --depth=0
npm view lodash version
npm install lodash@4.17.21
npm update lodash
npm uninstall lodash`,
        },
        {
          type: "table",
          caption: {
            en: "Quick semver cheat sheet — what changes when the left digit bumps",
            np: "Semver संक्षिप्त तालिका",
            jp: "セマバ早見",
          },
          headers: [
            { en: "Bump", np: "परिवर्तन", jp: "桁" },
            { en: "Meaning (typical)", np: "अर्थ", jp: "意味（目安）" },
            { en: "npm range hint", np: "रेञ्ज", jp: "範囲の例" },
          ],
          rows: [
            [
              { en: "**PATCH** (third number)", np: "PATCH", jp: "**PATCH**" },
              { en: "Bug fixes, no API change", np: "बग फिक्स", jp: "バグ修正のみ" },
              { en: "`~1.2.3` allows patch bumps", np: "`~`", jp: "`~` はパッチまで" },
            ],
            [
              { en: "**MINOR** (middle)", np: "MINOR", jp: "**MINOR**" },
              { en: "New features, backward compatible", np: "नयाँ, मिल्दो", jp: "後方互換の追加" },
              { en: "`^1.2.3` allows minor + patch", np: "`^`", jp: "`^` は minor まで" },
            ],
            [
              { en: "**MAJOR** (first)", np: "MAJOR", jp: "**MAJOR**" },
              { en: "Breaking changes — read changelog", np: "ब्रेकिङ", jp: "**破壊的変更**" },
              { en: "Pin exact version or migrate code", np: "जाँच गर्नुहोस्", jp: "固定か移行作業" },
            ],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "**`npm list`** shows what is installed; **`npm list --depth=0`** lists only top-level packages. **`npm view lodash version`** queries the registry without installing. **`npm install pkg@1.2.3`** pins an exact release; **`npm update`** bumps within the ranges written in **package.json**. **`npm uninstall pkg`** removes dependency entries cleanly.",
            np: "`npm list`, `npm view`, `@संस्करण`, `npm update`।",
            jp: "**一覧** — `npm list`。**確認** — `npm view`。**特定版** — `@x.y.z`。",
          },
        },
        {
          type: "diagram",
          id: "queue-backpressure",
        },
        {
          type: "paragraph",
          text: {
            en: "The diagram illustrates **backpressure**—when installs or builds fetch many packages, slow disk or network must not overwhelm memory; npm and Node streams use similar ideas. Practically: run **`npm ci`** in CI (clean install from lockfile) instead of **`npm install`** so builds stay deterministic.",
            np: "CI मा `npm ci` — lock बाट सफा स्थापना।",
            jp: "CI では **`npm ci`** でロックファイルどおりに再現する。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: { en: "Why commit package-lock.json?", np: "package-lock किन commit?", jp: "lock をコミットする理由？" },
      answer: {
        en: "Without it, two developers—or dev vs CI—might resolve different transitive versions from the same **package.json** ranges, causing “works on my machine” bugs. The lockfile pins the **resolved graph**.",
        np: "यसले रूख फिक्स गर्छ — देव र CI मिल्छ।",
        jp: "同じ ranges でも間接依存の解決がズレるのを防ぐ。",
      },
    },
  ],
};
