import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_4_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**npm** is how you install and manage packages in a Node project. Your **`package.json`** is the list of what your project needs and which version ranges are acceptable. The **lockfile** records the exact versions that were actually installed, so every developer and CI machine gets the same result.",
      np: "npm — package.json र lockfile ले एउटै रूख दोहोर्याउँछ।",
      jp: "**npm** と **package.json**・ロックファイルで依存を再現可能にする。",
    },
    {
      en: "**Semver** (semantic versioning) is a numbering system that tells you how much risk a version bump carries. A patch update is usually safe, a minor update adds features without breaking anything, and a major update may break your code. Use **`npm audit`** to check if any installed packages have known security issues.",
      np: "semver ले अपग्रेड जोखिम देखाउँछ — `npm audit` सँग मिलाउनुहोस्।",
      jp: "**semver** で更新のリスクを読む。**npm audit** で脆弱性も確認。",
    },
  ],
  sections: [
    {
      title: { en: "Introduction & package.json — project manifest", np: "परिचय र package.json", jp: "はじめにと package.json" },
      blocks: [
        {
          type: "youtube",
          videoId: "jHDhaSSKmB0",
          title: "npm Crash Course",
        },
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
            en: "Running **`npm install lodash`** downloads the package into `node_modules/` and records it in both `package.json` and `package-lock.json`. **`npx`** lets you run a package's command without installing it globally — useful for one-off tools like `npx create-next-app`. Always commit your **`package-lock.json`** so everyone on your team installs the exact same version tree.",
            np: "`npm install` र lock commit गर्नुहोस्; `npx` ले अस्थायी CLI चलाउँछ।",
            jp: "`npm install` で依存を記録。**package-lock.json** はコミット。**npx** は一回だけの CLI に便利。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Scripts** — add a `start` entry that runs your app (like `node index.js`) so `npm start` works from any machine. Put your lint, test, and build commands here too so your CI and your teammates all use the same commands without needing to remember extra flags.",
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
            en: "Adding `--save-dev` (or `-D`) puts a package under **`devDependencies`** — tools like ESLint and Jest that are only needed during development. When deploying, you can skip them with `npm install --omit=dev` to keep your production image smaller. Never commit `node_modules/` to git — it is massive and anyone can regenerate it from the lockfile.",
            np: "devDependencies उत्पादनमा छोड्न सकिन्छ; `node_modules` commit नगर्नु।",
            jp: "**devDependencies** は本番ビルドで省略可能。**node_modules** はコミットしない。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Using a package** — just `require('name')` or `import` it. For modern packages, check the `exports` field on the npm page — some packages expose specific subpaths like `pkg/utils` rather than exposing everything from the top level.",
              np: "`require` वा `import` — प्याकेजको `exports` हेर्नुहोस्।",
              jp: "**利用** — README と `exports` でエントリを確認。",
            },
            {
              en: "**Transitive dependencies** — when you install something like `express`, it pulls in dozens of other packages behind the scenes. This is why `npm audit` and lockfiles matter — a security issue might be in a package you have never heard of, buried three levels deep.",
              np: "अप्रत्यक्ष निर्भरता — `npm audit`।",
              jp: "**間接依存** — 見えないパッケージまでついてくる。",
            },
            {
              en: "**Secrets** — never put API keys or passwords in `package.json` or in a `.env` file that gets committed to git. Use environment variables and your hosting platform's secret manager instead.",
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
          type: "youtube",
          videoId: "jHDhaSSKmB0",
          title: "Semantic Versioning Explained",
        },
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
            en: "**`npm list`** shows everything installed in your project. Adding `--depth=0` limits the output to only your direct dependencies. **`npm view lodash version`** checks the latest version in the registry without downloading anything. Use **`@1.2.3`** to pin an exact version, **`npm update`** to bump within the ranges in your `package.json`, and **`npm uninstall`** to cleanly remove a package and its entry.",
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
            en: "Use **`npm ci`** instead of `npm install` in your CI pipeline. It does a clean install directly from the lockfile, ignores `package.json` ranges, and fails if the lockfile is out of date — so every build is predictable and matches exactly what you tested locally.",
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
        en: "Without the lockfile, two developers running `npm install` at different times might get slightly different versions of indirect dependencies, which can cause bugs that only happen on one machine. The lockfile records the exact version of every package in the tree so everyone gets the same result.",
        np: "यसले रूख फिक्स गर्छ — देव र CI मिल्छ।",
        jp: "同じ ranges でも間接依存の解決がズレるのを防ぐ。",
      },
    },
  ],
};
