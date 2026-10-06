import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "CI/CD Explained with GitHub Actions | Learn with Rajan", description: "A beginner-friendly guide to CI/CD, GitHub Actions, automated checks, and safe deployments." };

function Flow({ children }: { children: string }) {
  return <pre className="my-6 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-5 font-mono text-sm leading-6 text-slate-100 shadow-sm">{children}</pre>;
}

function Code({ children }: { children: string }) {
  return <pre className="my-5 overflow-x-auto rounded-xl bg-slate-950 p-5 font-mono text-sm leading-6 text-slate-100"><code>{children}</code></pre>;
}

export default function CicdBlogPost() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <Link href="/blog" className="text-sm text-[var(--muted)] hover:text-[var(--text)]">← Back to blog</Link>
      <p className="mt-8 text-sm font-medium text-[var(--accent)]">DEVOPS · 12 MIN READ</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">CI/CD Explained: A Beginner-Friendly Guide with GitHub Actions</h1>
      <p className="mt-5 text-lg leading-8 text-[var(--muted)]">CI/CD is a safety net that automatically checks your code before it reaches your users. This guide explains the idea, the workflow, and a practical GitHub Actions setup.</p>
      <Image src="/images/blog/cicd-github-actions-cover.png" alt="An illustrated CI/CD pipeline" width={1200} height={675} priority className="mt-8 rounded-2xl border border-[var(--border)]" />

      <div className="prose mt-10 max-w-none prose-headings:tracking-tight prose-p:text-[var(--muted)] prose-p:leading-8 prose-li:text-[var(--muted)] dark:prose-invert">
        <h2 className="mt-12 text-2xl font-bold tracking-tight text-[var(--text)]">What is CI/CD?</h2>
        <p>When you push code, someone needs to check whether it has TypeScript errors, whether tests pass, and whether the app can build. Doing that manually every time is slow. CI/CD automates those checks.</p>
        <p><strong>CI</strong> means Continuous Integration. Developers add code to a shared project, and automated checks run before the code is merged. <strong>Continuous Delivery</strong> means the app is always ready to release, but a person approves production. <strong>Continuous Deployment</strong> deploys automatically after every successful check.</p>
        <Flow>{"Write code\n    ↓\nPush to GitHub\n    ↓\nOpen a pull request\n    ↓\nType check → Tests → Build\n    ↓\nPASS ✅ → Merge → Deploy\nFAIL ❌ → Fix the code"}</Flow>

        <h2 className="mt-12 text-2xl font-bold tracking-tight text-[var(--text)]">CI/CD is the process. GitHub Actions is the tool.</h2>
        <p>GitHub Actions is one way to create a CI/CD pipeline. Jenkins, CircleCI, GitLab CI/CD, and other tools can do the same job. GitHub Actions is a friendly starting point when your code already lives on GitHub.</p>
        <p>It runs a <strong>workflow</strong>, which is a small YAML file saved in your repository. GitHub gives that workflow a temporary cloud computer called a <strong>runner</strong>.</p>
        <Flow>{".github/\n└── workflows/\n    └── ci.yml\n\nYour repository → temporary runner → install → test → build → runner removed"}</Flow>

        <h2 className="mt-12 text-2xl font-bold tracking-tight text-[var(--text)]">Use one command to verify your app</h2>
        <p>Before writing the workflow, decide what “safe to merge” means. For a TypeScript app, start with a type check, tests, and a build. Put them behind one command so your computer and CI run exactly the same checks.</p>
        <Code>{'{\n  "scripts": {\n    "type-check": "tsc --noEmit",\n    "test": "node --test",\n    "build": "tsc",\n    "verify": "npm run type-check && npm test && npm run build"\n  }\n}'}</Code>
        <p>Use <code>npm ci</code> in CI. It installs the exact versions from <code>package-lock.json</code>, giving every runner the same starting point.</p>

        <h2 className="mt-12 text-2xl font-bold tracking-tight text-[var(--text)]">Create your first GitHub Actions workflow</h2>
        <p>Create <code>.github/workflows/ci.yml</code>. This workflow runs whenever someone pushes to <code>main</code> or opens or updates a pull request for <code>main</code>.</p>
        <Code>{"name: CI\n\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\npermissions:\n  contents: read\n\njobs:\n  verify:\n    runs-on: ubuntu-latest\n    timeout-minutes: 10\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 24\n      - run: npm ci\n      - run: npm run verify"}</Code>
        <p><code>uses</code> runs a ready-made GitHub Action, such as checking out your repository. <code>run</code> runs a normal terminal command on the runner.</p>
        <Flow>{"Pull request\n    ↓\nGitHub creates an Ubuntu runner\n    ↓\nCheckout code → Setup Node.js → npm ci → npm run verify\n    ↓\n┌───────────────┴───────────────┐\n│                               │\nFAIL ❌                         PASS ✅\n│                               │\nFix the code                   Ready to merge"}</Flow>

        <h2 className="mt-12 text-2xl font-bold tracking-tight text-[var(--text)]">Make passing checks a guardrail</h2>
        <p>A pipeline helps only if a failed result prevents a merge. In GitHub branch rules or rulesets, require a pull request and require the <code>verify</code> check to pass for <code>main</code>.</p>
        <Flow>{"Pull request\n    ↓\nCI runs\n    ↓\nFAIL ❌ → GitHub blocks the merge\nPASS ✅ → GitHub allows the merge"}</Flow>
        <p>This catches the classic “works on my machine” problem. The runner starts clean, with no globally installed packages or personal environment settings hiding mistakes.</p>

        <h2 className="mt-12 text-2xl font-bold tracking-tight text-[var(--text)]">Deployment comes after CI</h2>
        <p>Your host should deploy code only after the checks succeed. Services such as Vercel, Render, and others can also make preview environments: temporary URLs where a teammate can test a pull request without touching production.</p>
        <Flow>{"Create pull request\n    ↓\nCI passes\n    ↓\nPreview URL for testing\n    ↓\nMerge to main\n    ↓\nDeploy to production"}</Flow>

        <h2 className="mt-12 text-2xl font-bold tracking-tight text-[var(--text)]">Why this matters even more with AI coding tools</h2>
        <p>AI can help you write a lot of code quickly, but generated code still needs review and proof that it works. CI/CD does not replace understanding the code. It gives you repeatable checks that catch common mistakes before users find them.</p>
        <Flow>{"AI-assisted code\n    ↓\nDeveloper review\n    ↓\nType check → Tests → Build → Security checks\n    ↓\nCI/CD safety net\n    ↓\nProduction"}</Flow>

        <h2 className="mt-12 text-2xl font-bold tracking-tight text-[var(--text)]">Start small</h2>
        <p>A green pipeline does not mean there are no bugs. It only means the checks you chose passed. Start with dependency installation, type checking, tests, and a build. Add linting, integration tests, security scanning, and rollback plans as your project grows.</p>
        <Flow>{"Code → Check → Test → Build → Review → Deploy\n\nThat is the real value of CI/CD:\na safer path from an idea to your users."}</Flow>
      </div>
    </article>
  );
}
