import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_17_DETAIL = {
  overview: [
    "A CI/CD pipeline is the automated assembly line that turns a git push into a production deployment. Continuous Integration runs your test suite on every change so bugs never accumulate; Continuous Delivery packages a release-ready artifact; Continuous Deployment pushes that artifact to production without a human gate. Mastering this pipeline means you ship faster, break less, and sleep better.",
    "Day 17 covers the GitHub Actions workflow syntax, how to structure multi-stage pipelines (lint → unit tests → integration tests → build → deploy), how to enforce coverage thresholds, and how to manage environment secrets and deployment gates safely.",
  ],
  sections: [
    {
      title: "Watch",
      blocks: [
        {
          type: "youtube",
          videoId: "0PbxpIao_EU",
          title: "GitHub Actions Tutorial – CI/CD Pipeline from Scratch (2026)",
        },
      ],
    },
    {
      title: "CI vs CD vs CD — what each stage does",
      blocks: [
        {
          type: "diagram",
          id: "devops-cicd-pipeline",
        },
        {
          type: "paragraph",
          text: "The three terms are often conflated. Continuous Integration (CI) is about merging code frequently and validating each merge automatically. Continuous Delivery (CD) extends CI by producing a deployable artifact on every successful build — a human still clicks 'deploy'. Continuous Deployment removes that human gate entirely: if tests pass, the code ships. Most teams start with CI + Continuous Delivery and graduate to full Continuous Deployment as test confidence grows.",
        },
        {
          type: "table",
          caption: "All three practices build on each other — you cannot do CD without CI.",
          headers: ["Practice", "Definition", "Goal", "When it triggers", "Common tool"],
          rows: [
            [
              "Continuous Integration (CI)",
              "Merge code to a shared branch frequently; run automated tests on every push",
              "Detect integration bugs early, keep the main branch green",
              "Every push or pull-request event",
              "GitHub Actions, GitLab CI, CircleCI",
            ],
            [
              "Continuous Delivery (CD)",
              "Every successful CI build produces a versioned, tested artifact ready to deploy",
              "Eliminate manual packaging; ensure any build is releasable",
              "After CI passes on the target branch",
              "GitHub Actions, AWS CodePipeline, ArgoCD",
            ],
            [
              "Continuous Deployment (CD)",
              "Every passing build is automatically deployed to production with no human gate",
              "Minimize lead time; ship to users within minutes of a merge",
              "After Continuous Delivery artifact is produced",
              "GitHub Actions + environment approvals disabled, Spinnaker",
            ],
          ],
        },
      ],
    },
    {
      title: "GitHub Actions anatomy",
      blocks: [
        {
          type: "paragraph",
          text: "A GitHub Actions workflow is a YAML file under .github/workflows/. It defines when the workflow runs (triggers), what machines run it (runners), and a directed acyclic graph of jobs — each job is a sequence of steps. Steps can run shell commands or reusable Actions from the Marketplace. Jobs run in parallel by default; use 'needs' to serialize them.",
        },
        {
          type: "table",
          headers: ["Concept", "What it is", "Example"],
          rows: [
            [
              "Trigger (on:)",
              "The GitHub event that starts the workflow",
              "push to main, pull_request, schedule (cron), workflow_dispatch (manual)",
            ],
            [
              "Job",
              "A set of steps that run on the same runner VM; jobs run in parallel unless linked by needs:",
              "test, build, deploy — each on ubuntu-latest",
            ],
            [
              "Step",
              "A single shell command or Action inside a job; steps share the file system of the runner",
              "run: npm ci, uses: actions/upload-artifact@v4",
            ],
            [
              "Runner",
              "The VM that executes a job; GitHub-hosted (ubuntu/windows/mac) or self-hosted",
              "runs-on: ubuntu-latest",
            ],
            [
              "Action",
              "A reusable unit of work published to the Marketplace or defined locally",
              "actions/checkout@v4, actions/cache@v4",
            ],
            [
              "Matrix",
              "Run the same job across multiple variable combinations",
              "node-version: [18, 20, 22] — tests run 3× in parallel",
            ],
          ],
        },
        {
          type: "code",
          title: ".github/workflows/ci.yml — lint + test + build with caching",
          code: `name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Lint, Test & Build
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20, 22]   # run the job twice, once per version

    steps:
      # 1. Check out source code
      - uses: actions/checkout@v4

      # 2. Set up the requested Node version
      - name: Set up Node.js \${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}

      # 3. Cache node_modules — key invalidates when package-lock.json changes
      - name: Cache node_modules
        uses: actions/cache@v4
        with:
          path: ~/.npm
          key: \${{ runner.os }}-node-\${{ matrix.node-version }}-\${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            \${{ runner.os }}-node-\${{ matrix.node-version }}-

      # 4. Install dependencies (uses cache when available)
      - run: npm ci

      # 5. Lint — fails the job if any lint errors are found
      - name: Lint
        run: npm run lint

      # 6. Type-check
      - name: Type check
        run: npm run type-check

      # 7. Run tests with coverage
      - name: Test
        run: npm test -- --coverage

      # 8. Build the production bundle
      - name: Build
        run: npm run build

      # 9. Upload the build artifact — available to downstream jobs and for 7 days
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: dist-node\${{ matrix.node-version }}
          path: dist/
          retention-days: 7`,
        },
      ],
    },
    {
      title: "Testing stages in the pipeline",
      blocks: [
        {
          type: "paragraph",
          text: "A mature pipeline runs multiple test layers at different points. Fast tests (unit) run first to give developers sub-minute feedback. Slower tests (integration, e2e) run after the build or in parallel but are not blocking the PR preview. Smoke tests run post-deploy against the real environment to verify the release is live and functional.",
        },
        {
          type: "table",
          caption: "Each layer catches a different class of bug — skip one and that class ships.",
          headers: ["Test type", "When in pipeline", "Tool example", "What it catches"],
          rows: [
            [
              "Unit",
              "First — before build, on every push",
              "Jest, Vitest, Mocha",
              "Logic bugs in individual functions/modules; regressions in pure business logic",
            ],
            [
              "Integration",
              "After unit, before build; may spin up real DB/Redis via Docker Compose",
              "Jest + Supertest, Testcontainers",
              "Broken database queries, mis-wired service dependencies, API contract mismatches",
            ],
            [
              "End-to-end (e2e)",
              "After build, against a staging environment",
              "Playwright, Cypress",
              "Full user flows, cross-service failures, rendering regressions",
            ],
            [
              "Smoke",
              "Post-deploy, against production or canary",
              "k6, Playwright, custom curl checks",
              "Bad deploy (wrong image, env var missing), catastrophic breakage in critical paths",
            ],
          ],
        },
        {
          type: "code",
          title: "Jest coverage threshold — fail the pipeline if coverage drops",
          code: `# In your package.json jest config:
# "coverageThreshold": { "global": { "lines": 80, "branches": 75 } }

# Workflow job that enforces coverage
  test-with-coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci

      - name: Run Jest with coverage
        run: |
          npm test -- \\
            --coverage \\
            --coverageReporters=text \\
            --coverageReporters=lcov \\
            --forceExit
        # Jest exits with code 1 if any threshold is not met,
        # which automatically fails the workflow step.

      # Upload the HTML report so reviewers can inspect uncovered lines
      - name: Upload coverage report
        if: always()   # upload even on test failure for debugging
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/lcov-report/
          retention-days: 7

      # Post coverage summary to the PR (optional but useful)
      - name: Comment coverage on PR
        if: github.event_name == 'pull_request'
        uses: davelosert/vitest-coverage-report-action@v2
        with:
          vite-config-path: jest.config.ts`,
        },
      ],
    },
    {
      title: "Deployment job & environments",
      blocks: [
        {
          type: "paragraph",
          text: "The deploy job runs only after all test jobs have passed and only on the main branch. GitHub Environments let you attach required reviewers, protection rules, and scoped secrets to a named target (staging, production). Secrets are masked in logs automatically — they never appear in plain text in the workflow output.",
        },
        {
          type: "code",
          title: "Deploy job — runs after tests pass, uses environment secrets",
          code: `  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [test-with-coverage]          # only runs if test job succeeded
    if: github.ref == 'refs/heads/main'  # only on the main branch

    environment:
      name: production                   # GitHub Environment (can require reviewer approval)
      url: https://api.example.com

    steps:
      - uses: actions/checkout@v4

      # Download the artifact built by the test job (same SHA, not rebuilt)
      - name: Download build artifact
        uses: actions/download-artifact@v4
        with:
          name: dist-node20
          path: dist/

      # Secrets scoped to the 'production' environment are available here
      # but NOT in jobs that run without the environment: block
      - name: Deploy to server
        env:
          DEPLOY_HOST: \${{ secrets.DEPLOY_HOST }}
          DEPLOY_KEY:  \${{ secrets.DEPLOY_SSH_KEY }}
          APP_ENV:     production
        run: |
          echo "$DEPLOY_KEY" > /tmp/deploy_key
          chmod 600 /tmp/deploy_key
          rsync -avz --delete \\
            -e "ssh -i /tmp/deploy_key -o StrictHostKeyChecking=no" \\
            dist/ deploy@$DEPLOY_HOST:/var/www/app/
          ssh -i /tmp/deploy_key deploy@$DEPLOY_HOST \\
            "cd /var/www/app && pm2 reload ecosystem.config.js"

      - name: Run smoke tests
        run: npx playwright test --project=smoke --base-url=https://api.example.com`,
        },
        {
          type: "table",
          caption: "Production deployment safety checklist — configure all five before going live.",
          headers: ["Best practice", "How to implement", "Why it matters"],
          rows: [
            [
              "Store secrets in GitHub Secrets",
              "Settings → Secrets and variables → Actions; use environment-scoped secrets for prod",
              "Secrets are encrypted at rest, masked in logs, never exposed in the YAML file",
            ],
            [
              "Branch protection rules",
              "Require PR reviews + require status checks to pass before merging to main",
              "Prevents direct pushes and ensures CI must be green before merge",
            ],
            [
              "Required status checks",
              "Add CI job names to the branch protection required checks list",
              "GitHub blocks the merge button until those specific jobs pass",
            ],
            [
              "Deployment environments with reviewers",
              "Create a 'production' environment, add required reviewers, set wait timer",
              "Gives a human a gate before prod deploy — critical for regulated environments",
            ],
            [
              "Artifact pinning (not rebuild)",
              "Download the artifact from the test job; do not re-run npm run build in deploy",
              "Guarantees what you tested is exactly what you deploy — same SHA, same bits",
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: "What is the difference between Continuous Delivery and Continuous Deployment?",
      tag: "CI/CD concepts",
      answer: [
        "Continuous Delivery means every passing build produces a deployable artifact and the pipeline is capable of releasing it — but a human still decides when to push the button. The system is always ready to ship; the release cadence is a business decision.",
        "Continuous Deployment removes that human gate entirely. As soon as all automated checks pass, the code ships to production automatically. This requires extremely high test confidence and fast rollback capability. Most teams run Continuous Delivery for production and Continuous Deployment for staging.",
      ].join("\n\n"),
      callout: "Continuous Delivery = 'we can deploy anytime'. Continuous Deployment = 'we deploy every time'.",
    },
    {
      question: "Why should tests run before the build step?",
      tag: "Pipeline design",
      answer: [
        "Running tests before build enforces fast feedback: if tests fail, the build never starts, so you don't waste minutes compiling or bundling code that is already broken. Failing fast also means the error signal is cleaner — you know the issue is in the code, not in the build tooling.",
        "Additionally, the build artifact should be a proven artifact. Separating test and build ensures that the artifact you upload and eventually deploy is the direct output of passing tests — not a speculative build that might be paired with failing tests.",
      ].join("\n\n"),
    },
    {
      question: "What is a matrix build and when should I use one?",
      tag: "GitHub Actions",
      answer: [
        "A matrix build runs the same job multiple times across a combination of variables — for example, Node.js versions [18, 20, 22] or operating systems [ubuntu, windows]. GitHub Actions creates one job instance per combination and runs them in parallel.",
        "Use matrix builds when your library or CLI must support multiple environments and you want to catch version-specific breakage before users do. For application servers (not libraries), a matrix is usually overkill — just pin a single LTS version and move on.",
      ].join("\n\n"),
    },
    {
      question: "How do you prevent secrets from being exposed in logs?",
      tag: "Security",
      answer: [
        "GitHub Actions automatically masks any value stored in a Secret — if it appears in stdout or stderr, it is replaced with '***'. Never echo a secret directly; never construct it into a URL that gets printed; never store it in an environment variable that a debug step might dump.",
        "For added safety: use environment-scoped secrets so only the deploy job can read production credentials; set 'if: github.ref == refs/heads/main' on deploy jobs so fork PRs cannot trigger them; and audit third-party Actions before using them (prefer pinning to a commit SHA rather than a mutable tag like @v4).",
      ].join("\n\n"),
      callout: "Never construct a secret into a string that gets logged — even masked secrets can be reconstructed character by character from error messages.",
    },
    {
      question: "What happens if my coverage threshold is not met?",
      tag: "Testing",
      answer: [
        "Jest exits with a non-zero exit code when any coverage threshold defined in 'coverageThreshold' is not met. GitHub Actions treats any non-zero exit code as a step failure, which fails the job and, if that job is a required status check, blocks the pull request merge.",
        "Start with conservative thresholds (lines: 70, branches: 65) and raise them incrementally as you add tests. Setting the bar unrealistically high initially leads to developers skipping tests to make the number rather than writing meaningful coverage.",
      ].join("\n\n"),
    },
    {
      question: "How do I roll back a bad deployment in a GitHub Actions pipeline?",
      tag: "Deployment",
      answer: [
        "The safest rollback strategy is to re-run the previous successful workflow run's deploy job from the GitHub Actions UI — it will re-download the previously tested artifact and redeploy it without any code changes. This avoids creating a 'revert commit' under pressure.",
        "For more robust rollback, upload each build artifact with a versioned tag (e.g., the git SHA) and keep artifacts for at least 30 days. Your deploy script can accept a version parameter so you can deploy any historical build on demand. Blue-green or canary deployments make this even safer by keeping the previous version running until the new one is validated.",
      ].join("\n\n"),
    },
  ],
  bullets: [
    "Create a .github/workflows/ci.yml that runs ESLint, TypeScript type-check, Jest with 80% line coverage threshold, and npm run build — confirm the pipeline fails when you break a test.",
    "Add a matrix build over Node.js 20 and 22 and observe both jobs running in parallel in the Actions tab.",
    "Create a 'staging' GitHub Environment with a required reviewer, add a deploy job that only runs on main after tests pass, and verify the approval gate appears in the UI.",
  ],
} satisfies RoadmapDayDetail;
