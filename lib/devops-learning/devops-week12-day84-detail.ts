import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "**Production Terraform requires discipline beyond just writing working HCL.** Code organisation is the first foundation: split your configuration into `main.tf` (resource blocks), `variables.tf` (input variable declarations), `outputs.tf` (output value declarations), `versions.tf` (the `terraform {}` block with `required_version` and `required_providers`), `data.tf` (data source lookups), and `locals.tf` (computed local values). This separation makes large configurations navigable and keeps each file focused on a single concern. Use consistent naming for resources: `resource_type-purpose-environment` (e.g. `aws_instance-web-prod`, `aws_s3_bucket-assets-staging`). **Formatting and validation** are non-negotiable before every commit. `terraform fmt -recursive` rewrites your HCL to the canonical HashiCorp style — consistent indentation, aligned equals signs, sorted meta-arguments. Always run it (or configure your editor to run it on save) and commit only formatted code. `terraform validate` checks syntax correctness and internal consistency (e.g. a variable referenced but never declared), but it does not call the provider API and cannot catch provider-specific mistakes. `tflint` fills that gap: it understands provider schemas and catches deprecated resource arguments, invalid instance types, missing required tags, and other provider-specific errors that `validate` misses. `checkov` and `tfsec` are static security scanners: they detect open S3 buckets, publicly accessible RDS instances, overly permissive IAM policies, missing encryption, and hundreds of other security misconfigurations — returning findings with severity ratings and remediation links. **State hygiene** is equally critical: never commit `terraform.tfstate` or `terraform.tfstate.backup` to git (add both to `.gitignore`). Always use a remote backend with locking. Use `terraform state` subcommands to surgically fix state rather than destroying and recreating live resources.",
    np: "**Production Terraform मा सिर्फ काम गर्ने HCL लेख्नुभन्दा बाहिर discipline चाहिन्छ।** Code organization पहिलो foundation हो: configuration लाई `main.tf` (resource block), `variables.tf` (input variable declaration), `outputs.tf` (output value declaration), `versions.tf` (`required_version` र `required_providers` सहित `terraform {}` block), `data.tf` (data source lookup), र `locals.tf` (computed local value) मा विभाजन गर्नुहोस्। यो separation ले ठूलो configuration navigable बनाउँछ र प्रत्येक file लाई single concern मा केन्द्रित राख्छ। Resource को लागि consistent naming प्रयोग गर्नुहोस्: `resource_type-purpose-environment` (जस्तै `aws_instance-web-prod`, `aws_s3_bucket-assets-staging`)। **Formatting र validation** प्रत्येक commit अघि non-negotiable छ। `terraform fmt -recursive` ले तपाईंको HCL लाई canonical HashiCorp style मा rewrite गर्छ — consistent indentation, aligned equals sign, sorted meta-argument। यसलाई सधैं run गर्नुहोस् (वा save मा run गर्न editor configure गर्नुहोस्) र formatted code मात्र commit गर्नुहोस्। `terraform validate` ले syntax correctness र internal consistency check गर्छ (जस्तै declared नगरेको variable reference), तर यसले provider API call गर्दैन र provider-specific mistake catch गर्न सक्दैन। `tflint` ले त्यो gap fill गर्छ: यसले provider schema बुझ्छ र deprecated resource argument, invalid instance type, missing required tag, र `validate` ले miss गर्ने अन्य provider-specific error catch गर्छ। `checkov` र `tfsec` static security scanner हुन्: तिनीहरूले open S3 bucket, publicly accessible RDS instance, अत्यधिक permissive IAM policy, missing encryption, र अरू सयौं security misconfiguration detect गर्छन् — severity rating र remediation link सहित finding return गर्दै। **State hygiene** समान रूपमा critical छ: `terraform.tfstate` वा `terraform.tfstate.backup` git मा कहिल्यै commit नगर्नुहोस् (दुवैलाई `.gitignore` मा add गर्नुहोस्)। सधैं locking सहित remote backend प्रयोग गर्नुहोस्। Live resource destroy र recreate गर्नुभन्दा state surgically fix गर्न `terraform state` subcommand प्रयोग गर्नुहोस्।",
    jp: "**本番 Terraform には動くだけの HCL を書く以上の規律が必要です。** コード整理が最初の基盤です：設定を `main.tf`（リソースブロック）・`variables.tf`（入力変数宣言）・`outputs.tf`（出力値宣言）・`versions.tf`（`required_version` と `required_providers` を含む `terraform {}` ブロック）・`data.tf`（データソース参照）・`locals.tf`（計算済みローカル値）に分割します。この分離により大きな設定をナビゲートしやすくなり、各ファイルが単一の関心事に集中できます。リソースには一貫した命名を使用します：`resource_type-purpose-environment`（例：`aws_instance-web-prod`・`aws_s3_bucket-assets-staging`）。**フォーマットとバリデーション**はコミット前に必須です。`terraform fmt -recursive` は HCL を HashiCorp の標準スタイルに書き直します — 一貫したインデント・揃ったイコール記号・ソートされたメタ引数。常に実行し（または保存時に実行するようエディタを設定し）、フォーマット済みコードのみをコミットします。`terraform validate` は構文の正確さと内部一貫性をチェックしますが（例：宣言されていない変数の参照）、プロバイダー API を呼び出さないためプロバイダー固有のミスを捉えられません。`tflint` がそのギャップを埋めます：プロバイダースキーマを理解し、非推奨のリソース引数・無効なインスタンスタイプ・欠落した必須タグ・`validate` が見逃すその他のプロバイダー固有エラーを検出します。`checkov` と `tfsec` は静的セキュリティスキャナーです：オープンな S3 バケット・公開アクセス可能な RDS インスタンス・過度に許可的な IAM ポリシー・暗号化の欠如・その他数百のセキュリティ設定ミスを検出します。**状態の衛生管理**も同様に重要です：`terraform.tfstate` や `terraform.tfstate.backup` を git にコミットしてはなりません（両方を `.gitignore` に追加する）。常にロック付きのリモートバックエンドを使用します。ライブリソースを破棄・再作成するのではなく、状態を外科的に修正するために `terraform state` サブコマンドを使用します。",
  } as const,
  o2: {
    en: "**CI/CD integration** automates the plan/apply lifecycle so that infrastructure changes go through the same review process as application code. The standard pipeline pattern is: PR opened → CI runs `terraform fmt --check` (fails fast if formatting is wrong) + `terraform validate` + `tflint` → `terraform plan` is executed and the output is posted as a PR comment (so reviewers can see exactly what will change) → PR approved and merged to main → CI runs `terraform apply -auto-approve` on the main branch. There are three dominant tools for this workflow. **Atlantis** is a self-hosted GitOps bot: engineers trigger runs by commenting `atlantis plan` or `atlantis apply` directly on GitHub/GitLab PRs. Atlantis handles locking, posts plan output as PR comments, and requires approvals before applying. It integrates tightly with your VCS and runs in your own infrastructure. **Terraform Cloud / HCP Terraform** (HashiCorp's managed platform) provides built-in VCS integration: connect your repo and every PR automatically triggers a speculative plan; merging to main triggers an apply that requires a UI approval step. It also provides policy-as-code via Sentinel (e.g. deny any instance larger than `t3.large` in dev workspaces) and a centrally managed private module registry. **GitHub Actions** is the most flexible and widely adopted option: you manage the workflow YAML, handle state backend credentials as GitHub secrets, and compose steps however you need. Key CI/CD practices regardless of tool: use `-lock-timeout=300s` so the pipeline waits up to 5 minutes for a lock release rather than failing immediately on a locked state; use `-compact-warnings` to reduce output noise; always pin `required_version = \"~> 1.7\"` in `versions.tf` and install exactly that version in CI using `tfenv` or the official `hashicorp/setup-terraform` GitHub Action to ensure plan output matches what engineers see locally. Always separate the plan and apply into distinct CI stages: plan runs on every PR commit, apply runs only on the main branch after human approval — this prevents accidental apply from a non-reviewed branch.",
    np: "**CI/CD integration** ले plan/apply lifecycle automate गर्छ ताकि infrastructure change application code जस्तै review process बाट जाओस्। Standard pipeline pattern यो हो: PR opened → CI ले `terraform fmt --check` (formatting गलत भएमा fast fail) + `terraform validate` + `tflint` run गर्छ → `terraform plan` execute हुन्छ र output PR comment को रूपमा post हुन्छ (ताकि reviewer ले ठ्याक्कै के change हुन्छ देख्न सकून्) → PR approved र main मा merge → CI ले main branch मा `terraform apply -auto-approve` run गर्छ। यो workflow को लागि तीनवटा dominant tool छन्। **Atlantis** self-hosted GitOps bot हो: engineer ले GitHub/GitLab PR मा सिधै `atlantis plan` वा `atlantis apply` comment गरेर run trigger गर्छन्। Atlantis ले locking handle गर्छ, plan output PR comment को रूपमा post गर्छ, र apply अघि approval require गर्छ। यसले तपाईंको VCS सँग closely integrate हुन्छ र तपाईंकै infrastructure मा run हुन्छ। **Terraform Cloud / HCP Terraform** (HashiCorp को managed platform) ले built-in VCS integration provide गर्छ: आफ्नो repo connect गर्नुहोस् र प्रत्येक PR ले automatically speculative plan trigger गर्छ; main मा merge ले UI approval step require गर्ने apply trigger गर्छ। यसले Sentinel मार्फत policy-as-code पनि provide गर्छ (जस्तै dev workspace मा `t3.large` भन्दा ठूलो instance deny गर्नुहोस्) र centrally managed private module registry। **GitHub Actions** सबैभन्दा flexible र widely adopted option हो: तपाईं workflow YAML manage गर्नुहुन्छ, state backend credential GitHub secret को रूपमा handle गर्नुहुन्छ, र आवश्यकता अनुसार step compose गर्नुहुन्छ। Tool जे भए पनि key CI/CD practice: locked state मा तुरुन्त fail हुनुभन्दा pipeline लाई lock release को लागि ५ मिनेटसम्म पर्खन `-lock-timeout=300s` प्रयोग गर्नुहोस्; output noise कम गर्न `-compact-warnings` प्रयोग गर्नुहोस्; `versions.tf` मा `required_version = \"~> 1.7\"` pin गर्नुहोस् र plan output engineer ले locally देख्नेसँग match गर्न `tfenv` वा official `hashicorp/setup-terraform` GitHub Action प्रयोग गरेर CI मा exactly त्यही version install गर्नुहोस्। Plan र apply लाई distinct CI stage मा सधैं अलग गर्नुहोस्: plan प्रत्येक PR commit मा run हुन्छ, apply human approval पछि main branch मा मात्र run हुन्छ — यसले non-reviewed branch बाट accidental apply रोक्छ।",
    jp: "**CI/CD 統合**はプラン/適用ライフサイクルを自動化し、インフラの変更がアプリケーションコードと同じレビュープロセスを経るようにします。標準的なパイプラインパターンは：PR 開設 → CI が `terraform fmt --check`（フォーマットが間違っていると即時失敗）+ `terraform validate` + `tflint` を実行 → `terraform plan` が実行されて出力が PR コメントとして投稿される（レビュアーが正確に何が変わるかを確認できる）→ PR 承認とメインへのマージ → CI がメインブランチで `terraform apply -auto-approve` を実行。このワークフロー用の 3 つの主要なツールがあります。**Atlantis** は自己ホスト型の GitOps ボットです：エンジニアが GitHub/GitLab PR に直接 `atlantis plan` または `atlantis apply` とコメントすることで実行をトリガーします。Atlantis はロック処理・プラン出力の PR コメント投稿・適用前の承認要求を行います。VCS と緊密に統合し、独自のインフラで動作します。**Terraform Cloud / HCP Terraform**（HashiCorp のマネージドプラットフォーム）は組み込み VCS 統合を提供します：リポジトリを接続すると各 PR が自動的に投機的プランをトリガーし、メインへのマージが UI 承認ステップを必要とする適用をトリガーします。Sentinel によるポリシーアズコード（例：dev ワークスペースで `t3.large` より大きいインスタンスを拒否）とプライベートモジュールレジストリも提供します。**GitHub Actions** は最も柔軟で広く採用されているオプションです：ワークフロー YAML を管理し、状態バックエンドの認証情報を GitHub シークレットとして処理し、必要に応じてステップを組み合わせます。ツールに関係なく重要な CI/CD プラクティス：ロックされた状態で即時失敗するのではなくパイプラインが最大 5 分間ロック解放を待つように `-lock-timeout=300s` を使用する；`-compact-warnings` で出力ノイズを削減する；`versions.tf` に `required_version = \"~> 1.7\"` をピン留めし、`tfenv` または公式の `hashicorp/setup-terraform` GitHub Action を使用して CI に正確に同じバージョンをインストールしてプラン出力がエンジニアがローカルで見るものと一致することを確認する。プランと適用を常に別々の CI ステージに分離する：プランはすべての PR コミットで実行し、適用は人間の承認後にメインブランチのみで実行する — これにより未レビューのブランチからの偶発的な適用を防ぎます。",
  } as const,
};

export const DEVOPS_DAY_84_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Code quality, security scanning & state hygiene",
        np: "Code quality, security scanning र state hygiene",
        jp: "コード品質・セキュリティスキャン・状態衛生管理",
      },
      blocks: [
        { type: "diagram", id: "devops-terraform-cicd" },
        {
          type: "table",
          caption: {
            en: "Terraform CI/CD toolchain — tool, purpose, when to run",
            np: "Terraform CI/CD toolchain — tool, purpose, कहिले run गर्ने",
            jp: "Terraform CI/CD ツールチェーン — ツール・目的・実行タイミング",
          },
          headers: [
            { en: "Tool", np: "Tool", jp: "ツール" },
            { en: "Purpose", np: "Purpose", jp: "目的" },
            { en: "Stage", np: "Stage", jp: "ステージ" },
            { en: "Command", np: "Command", jp: "コマンド" },
          ],
          rows: [
            [
              { en: "terraform fmt", np: "terraform fmt", jp: "terraform fmt" },
              {
                en: "Enforce canonical HCL formatting style",
                np: "Canonical HCL formatting style enforce गर्ने",
                jp: "標準 HCL フォーマットスタイルの適用",
              },
              {
                en: "Pre-commit hook + CI lint step",
                np: "Pre-commit hook + CI lint step",
                jp: "プリコミットフック + CI lint ステップ",
              },
              {
                en: "`terraform fmt -recursive` (fix) / `--check` (CI gate)",
                np: "`terraform fmt -recursive` (fix) / `--check` (CI gate)",
                jp: "`terraform fmt -recursive`（修正）/ `--check`（CI ゲート）",
              },
            ],
            [
              {
                en: "terraform validate",
                np: "terraform validate",
                jp: "terraform validate",
              },
              {
                en: "Check syntax & internal consistency (no API calls)",
                np: "Syntax र internal consistency check (API call छैन)",
                jp: "構文と内部一貫性のチェック（API 呼び出しなし）",
              },
              {
                en: "CI lint step (after fmt)",
                np: "CI lint step (fmt पछि)",
                jp: "CI lint ステップ（fmt の後）",
              },
              {
                en: "`terraform validate`",
                np: "`terraform validate`",
                jp: "`terraform validate`",
              },
            ],
            [
              { en: "tflint", np: "tflint", jp: "tflint" },
              {
                en: "Provider-aware linting — catches invalid instance types, deprecated args, missing required tags",
                np: "Provider-aware linting — invalid instance type, deprecated arg, missing required tag catch गर्ने",
                jp: "プロバイダー対応の lint — 無効なインスタンスタイプ・非推奨引数・欠落した必須タグを検出",
              },
              {
                en: "CI lint step (after validate)",
                np: "CI lint step (validate पछि)",
                jp: "CI lint ステップ（validate の後）",
              },
              {
                en: "`tflint --recursive`",
                np: "`tflint --recursive`",
                jp: "`tflint --recursive`",
              },
            ],
            [
              {
                en: "tfsec / checkov",
                np: "tfsec / checkov",
                jp: "tfsec / checkov",
              },
              {
                en: "Static security scan — open S3 buckets, permissive IAM, missing encryption",
                np: "Static security scan — open S3 bucket, permissive IAM, missing encryption",
                jp: "静的セキュリティスキャン — オープン S3 バケット・許可的な IAM・暗号化の欠如",
              },
              {
                en: "CI security step (before plan)",
                np: "CI security step (plan अघि)",
                jp: "CI セキュリティステップ（プランの前）",
              },
              {
                en: "`tfsec .` / `checkov -d .`",
                np: "`tfsec .` / `checkov -d .`",
                jp: "`tfsec .` / `checkov -d .`",
              },
            ],
            [
              {
                en: "terraform plan",
                np: "terraform plan",
                jp: "terraform plan",
              },
              {
                en: "Show exact diff of what will change; output posted as PR comment",
                np: "के change हुन्छ exact diff देखाउने; output PR comment को रूपमा post हुन्छ",
                jp: "何が変わるかの正確な差分を表示；出力が PR コメントとして投稿される",
              },
              {
                en: "PR opened / every commit to PR branch",
                np: "PR opened / PR branch मा हरेक commit",
                jp: "PR 開設 / PR ブランチへの各コミット",
              },
              {
                en: "`terraform plan -out=tfplan`",
                np: "`terraform plan -out=tfplan`",
                jp: "`terraform plan -out=tfplan`",
              },
            ],
            [
              {
                en: "terraform apply",
                np: "terraform apply",
                jp: "terraform apply",
              },
              {
                en: "Apply the saved plan to real infrastructure after human approval",
                np: "Human approval पछि saved plan real infrastructure मा apply गर्ने",
                jp: "人間の承認後に保存済みプランを実際のインフラに適用する",
              },
              {
                en: "Merge to main branch only",
                np: "Main branch मा merge भएपछि मात्र",
                jp: "メインブランチへのマージ時のみ",
              },
              {
                en: "`terraform apply tfplan`",
                np: "`terraform apply tfplan`",
                jp: "`terraform apply tfplan`",
              },
            ],
            [
              {
                en: "Atlantis / TFC",
                np: "Atlantis / TFC",
                jp: "Atlantis / TFC",
              },
              {
                en: "GitOps automation — trigger plan/apply via PR comments or VCS webhooks",
                np: "GitOps automation — PR comment वा VCS webhook मार्फत plan/apply trigger गर्ने",
                jp: "GitOps 自動化 — PR コメントまたは VCS ウェブフック経由でプラン/適用をトリガー",
              },
              {
                en: "Full pipeline orchestration layer",
                np: "Full pipeline orchestration layer",
                jp: "フルパイプラインオーケストレーション層",
              },
              {
                en: "PR comment `atlantis plan` / `atlantis apply`",
                np: "PR comment `atlantis plan` / `atlantis apply`",
                jp: "PR コメント `atlantis plan` / `atlantis apply`",
              },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "GitHub Actions CI/CD pipeline for Terraform",
        np: "Terraform को लागि GitHub Actions CI/CD pipeline",
        jp: "Terraform 用の GitHub Actions CI/CD パイプライン",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Complete GitHub Actions workflow: plan on PR, apply on main, with fmt/validate/tflint gates",
            np: "पूर्ण GitHub Actions workflow: PR मा plan, main मा apply, fmt/validate/tflint gate सहित",
            jp: "完全な GitHub Actions ワークフロー：PR でプラン・メインで適用・fmt/validate/tflint ゲート付き",
          },
          code: `# ── .gitignore (add to repo root) ────────────────────────────────────
# Never commit local state or override files
# terraform.tfstate
# terraform.tfstate.backup
# .terraform/
# .terraform.lock.hcl   <- commit this one! (provider version lock)
# *.tfvars              <- may contain secrets; use CI env vars instead
# crash.log

# ── versions.tf ──────────────────────────────────────────────────────
terraform {
  # Pin to a minor version range — allows patch updates, blocks major
  required_version = "~> 1.7"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# ── backend.tf ───────────────────────────────────────────────────────
# Remote S3 backend with DynamoDB locking (used in CI via env vars)
terraform {
  backend "s3" {
    bucket         = "my-org-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
    # CI authenticates via AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY
    # env vars — no static credentials in code
  }
}

# ── .github/workflows/terraform.yml ──────────────────────────────────
name: Terraform CI/CD

on:
  pull_request:
    branches: [main]        # plan runs on every PR targeting main
  push:
    branches: [main]        # apply runs only when code lands on main

env:
  TF_VERSION: "1.7.5"       # must match required_version in versions.tf
  AWS_REGION:  "us-east-1"

jobs:
  # ── JOB 1: Lint + Plan (runs on every PR commit) ─────────────────
  plan:
    name: "Lint & Plan"
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'

    permissions:
      contents: read
      pull-requests: write   # needed to post plan output as PR comment

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Install Terraform \${{ env.TF_VERSION }}
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: \${{ env.TF_VERSION }}

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id:     \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region:            \${{ env.AWS_REGION }}

      - name: terraform fmt --check
        run: terraform fmt -recursive --check
        # Fails the pipeline immediately if any file is not formatted

      - name: terraform init
        run: terraform init -input=false

      - name: terraform validate
        run: terraform validate

      - name: Install tflint
        run: |
          curl -s https://raw.githubusercontent.com/terraform-linters/tflint/master/install_linux.sh | bash
          tflint --init

      - name: tflint
        run: tflint --recursive --compact

      - name: terraform plan (save to file)
        id: plan
        run: |
          terraform plan \
            -lock-timeout=300s \
            -compact-warnings \
            -input=false \
            -out=tfplan \
            2>&1 | tee plan_output.txt
        continue-on-error: true   # post comment even if plan fails

      - name: Post plan as PR comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs    = require('fs');
            const plan  = fs.readFileSync('plan_output.txt', 'utf8');
            const body  = \`## Terraform Plan\n\`\`\`hcl\n\${plan.slice(0, 60000)}\n\`\`\`\`;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo:  context.repo.repo,
              body
            });

      - name: Upload plan artifact (for apply job)
        uses: actions/upload-artifact@v4
        with:
          name: tfplan
          path: tfplan

  # ── JOB 2: Apply (runs only on merge to main) ────────────────────
  apply:
    name: "Apply"
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    environment: production    # requires manual approval in GitHub UI

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Install Terraform \${{ env.TF_VERSION }}
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: \${{ env.TF_VERSION }}

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id:     \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region:            \${{ env.AWS_REGION }}

      - name: terraform init
        run: terraform init -input=false

      - name: terraform apply
        run: |
          terraform apply \
            -auto-approve \
            -lock-timeout=300s \
            -compact-warnings \
            -input=false`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Set up the full pre-commit quality gate locally. Install `tflint` (`brew install tflint` on macOS or the install script on Linux) and the `tflint-ruleset-aws` plugin by creating `.tflint.hcl` in your repo root with `plugin \"aws\" { enabled = true; version = \"0.31.0\"; source = \"github.com/terraform-linters/tflint-ruleset-aws\" }` and running `tflint --init`. Then install `pre-commit` (`pip install pre-commit`) and create `.pre-commit-config.yaml` with hooks for `terraform fmt` and `tflint`. Run `pre-commit install` to register the hooks. Now stage a `.tf` file that has incorrect formatting (mis-indented block) and a deprecated argument (`aws_instance` with `associate_public_ip_address` set incorrectly). Run `git commit` and observe: the fmt hook rewrites the file (commit fails — re-stage and retry), then tflint catches the deprecated argument. Fix all issues until the commit succeeds. This workflow is the local equivalent of the CI gates in the GitHub Actions pipeline.",
              np: "Locally full pre-commit quality gate set up गर्नुहोस्। `tflint` install गर्नुहोस् (macOS मा `brew install tflint` वा Linux मा install script) र `.tflint.hcl` मा `plugin \"aws\" { enabled = true; version = \"0.31.0\"; source = \"github.com/terraform-linters/tflint-ruleset-aws\" }` सहित repo root मा `.tflint.hcl` create गरेर र `tflint --init` run गरेर `tflint-ruleset-aws` plugin install गर्नुहोस्। त्यसपछि `pre-commit` install गर्नुहोस् (`pip install pre-commit`) र `terraform fmt` र `tflint` को hook सहित `.pre-commit-config.yaml` create गर्नुहोस्। Hook register गर्न `pre-commit install` run गर्नुहोस्। अब गलत formatting (mis-indented block) र deprecated argument भएको `.tf` file stage गर्नुहोस्। `git commit` run गर्नुहोस् र observe गर्नुहोस्: fmt hook ले file rewrite गर्छ (commit fail हुन्छ — re-stage गर्नुहोस् र retry गर्नुहोस्), त्यसपछि tflint ले deprecated argument catch गर्छ। Commit सफल नहुन्जेल सबै issue fix गर्नुहोस्। यो workflow GitHub Actions pipeline मा CI gate को local equivalent हो।",
              jp: "ローカルで完全なプリコミット品質ゲートをセットアップする。`tflint` をインストールし（macOS では `brew install tflint`、Linux ではインストールスクリプト）、repo ルートに `.tflint.hcl` を作成して `plugin \"aws\" { enabled = true; version = \"0.31.0\"; source = \"github.com/terraform-linters/tflint-ruleset-aws\" }` を記述し `tflint --init` を実行して `tflint-ruleset-aws` プラグインをインストールする。次に `pre-commit` をインストールし（`pip install pre-commit`）、`terraform fmt` と `tflint` のフックを含む `.pre-commit-config.yaml` を作成する。`pre-commit install` でフックを登録する。次に不正なフォーマット（インデントがずれたブロック）と非推奨引数を持つ `.tf` ファイルをステージングする。`git commit` を実行して観察する：fmt フックがファイルを書き直す（コミット失敗 — 再ステージして再試行）、次に tflint が非推奨引数を検出する。コミットが成功するまですべての問題を修正する。このワークフローは GitHub Actions パイプラインの CI ゲートのローカル版です。",
            },
            {
              en: "Build and test the full two-job GitHub Actions pipeline (plan-on-PR, apply-on-main) against a real AWS account. First, create your S3 backend bucket and DynamoDB lock table (from Day 80 exercises). Set up four GitHub repository secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and optionally `AWS_ROLE_ARN` if using OIDC. Create a `production` environment in GitHub repo Settings → Environments and enable \"Required reviewers\" (add yourself). Push a simple Terraform config (an `aws_s3_bucket` resource) on a feature branch and open a PR — verify the plan job runs, posts plan output as a PR comment, and the apply job is skipped. Approve and merge the PR, then navigate to Actions → the apply workflow run → you should see it is waiting for your approval in the `production` environment gate. Approve the deployment and watch the apply run. Confirm the bucket exists with `aws s3 ls`.",
              np: "Real AWS account मा full two-job GitHub Actions pipeline (plan-on-PR, apply-on-main) build र test गर्नुहोस्। पहिले, S3 backend bucket र DynamoDB lock table create गर्नुहोस् (Day 80 exercise बाट)। चारवटा GitHub repository secret set up गर्नुहोस्: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, र OIDC प्रयोग गर्दा optional `AWS_ROLE_ARN`। GitHub repo Settings → Environments मा `production` environment create गर्नुहोस् र \"Required reviewers\" enable गर्नुहोस् (आफूलाई add गर्नुहोस्)। Feature branch मा simple Terraform config (`aws_s3_bucket` resource) push गर्नुहोस् र PR open गर्नुहोस् — plan job run हुन्छ, plan output PR comment को रूपमा post हुन्छ, र apply job skip हुन्छ verify गर्नुहोस्। PR approve र merge गर्नुहोस्, त्यसपछि Actions → apply workflow run मा navigate गर्नुहोस् → तपाईंले `production` environment gate मा तपाईंको approval को प्रतीक्षा गरिरहेको देख्नुपर्छ। Deployment approve गर्नुहोस् र apply run हुन्छ हेर्नुहोस्। `aws s3 ls` सँग bucket exist गर्छ confirm गर्नुहोस्।",
              jp: "実際の AWS アカウントに対して完全な 2 ジョブ GitHub Actions パイプライン（PR でプラン・メインで適用）を構築してテストする。まず、S3 バックエンドバケットと DynamoDB ロックテーブルを作成する（Day 80 の演習から）。4 つの GitHub リポジトリシークレットを設定する：`AWS_ACCESS_KEY_ID`・`AWS_SECRET_ACCESS_KEY`・OIDC を使用する場合はオプションの `AWS_ROLE_ARN`。GitHub リポジトリの Settings → Environments で `production` 環境を作成し「Required reviewers」を有効にする（自分自身を追加）。機能ブランチにシンプルな Terraform 設定（`aws_s3_bucket` リソース）をプッシュして PR を開く — プランジョブが実行され、プラン出力が PR コメントとして投稿され、適用ジョブがスキップされることを確認する。PR を承認してマージし、Actions → apply ワークフロー実行に移動する → `production` 環境ゲートで承認待ちになっているはずです。デプロイを承認して適用が実行されるのを見る。`aws s3 ls` でバケットが存在することを確認する。",
            },
            {
              en: "Practice safe CI apply patterns using `terraform plan -out=tfplan` and artifact passing between jobs. Modify your GitHub Actions workflow so the plan job saves the binary plan file with `terraform plan -out=tfplan` and uploads it as a workflow artifact. The apply job must download the same artifact and run `terraform apply tfplan` (without `-auto-approve` flags for the plan regeneration — it uses the saved plan). This guarantees that what was reviewed in the PR comment is exactly what gets applied — no drift from a re-run plan. To verify this guarantee: after the plan runs and posts its comment, manually create an S3 bucket in the AWS console with a name that would conflict with your Terraform config. When the apply runs using the saved plan, observe that it attempts to create the bucket (as planned) and either fails with a conflict error or succeeds depending on your config. Compare this with re-running plan-then-apply live: the new plan would detect the conflict and the PR comment would be stale. Document the difference between the two approaches in a code comment in your workflow YAML.",
              np: "`terraform plan -out=tfplan` र job बीच artifact passing प्रयोग गरेर safe CI apply pattern practice गर्नुहोस्। GitHub Actions workflow modify गर्नुहोस् ताकि plan job ले `terraform plan -out=tfplan` सँग binary plan file save गरोस् र workflow artifact को रूपमा upload गरोस्। Apply job ले same artifact download गरेर `terraform apply tfplan` run गर्नुपर्छ। यसले PR comment मा review भएको exactly त्यही apply हुन्छ guarantee गर्छ — re-run plan बाट कुनै drift छैन। यो guarantee verify गर्न: plan run भएर comment post गरेपछि, manually AWS console मा तपाईंको Terraform config सँग conflict हुने नाम भएको S3 bucket create गर्नुहोस्। Saved plan प्रयोग गरेर apply run हुँदा, observe गर्नुहोस् कि यसले bucket create गर्ने attempt गर्छ (planned अनुसार) र config अनुसार conflict error सहित fail हुन्छ वा succeed हुन्छ। यसलाई live plan-then-apply re-running सँग compare गर्नुहोस्: नयाँ plan ले conflict detect गर्थ्यो र PR comment stale हुन्थ्यो। Workflow YAML मा code comment मा दुई approach बीचको difference document गर्नुहोस्।",
              jp: "`terraform plan -out=tfplan` とジョブ間でのアーティファクト受け渡しを使って安全な CI 適用パターンを練習する。プランジョブが `terraform plan -out=tfplan` でバイナリプランファイルを保存してワークフローアーティファクトとしてアップロードするように GitHub Actions ワークフローを変更する。適用ジョブは同じアーティファクトをダウンロードして `terraform apply tfplan` を実行する必要があります。これにより PR コメントでレビューされた内容が正確に適用されることが保証されます — 再実行されたプランからのドリフトはありません。この保証を検証するために：プランが実行されコメントが投稿された後、Terraform 設定と競合する名前の S3 バケットを AWS コンソールで手動作成する。保存されたプランを使って適用が実行される際、バケットの作成を試みる（計画通りに）が設定によっては競合エラーで失敗または成功するかを観察する。これをライブでプランを再実行してから適用する方法と比較する：新しいプランは競合を検出し PR コメントは古くなっているはずです。ワークフロー YAML のコードコメントに 2 つのアプローチの違いをドキュメント化する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "How do you safely run `terraform apply` in CI without accidentally destroying production resources?",
        np: "CI मा production resource accidentally destroy नगरी `terraform apply` safely कसरी run गर्ने?",
        jp: "本番リソースを誤って破棄せずに CI で `terraform apply` を安全に実行するにはどうすればよいか？",
      },
      answer: {
        en: "Running `terraform apply` in CI safely requires a combination of workflow gates, plan review, environment protection rules, and targeted apply flags — no single technique is sufficient alone. **Workflow gates**: separate the plan and apply into distinct CI jobs. The plan job runs on every PR commit, generates the plan, and posts it as a PR comment. The apply job runs only when code merges to the main branch — not on feature branches, not on PRs. This means no one can trigger an apply without a code review. In GitHub Actions, use `if: github.event_name == 'push' && github.ref == 'refs/heads/main'` on the apply job. **Environment protection rules**: in GitHub, create a `production` environment (Settings → Environments) and configure \"Required reviewers\" — one or more engineers must explicitly approve the deployment in the GitHub UI before the apply job is allowed to start. This is a human gate even after the PR merge. **Saved plan**: always use `terraform plan -out=tfplan` in the plan job and upload the binary plan as a CI artifact. The apply job downloads the artifact and runs `terraform apply tfplan`. This is critical: without a saved plan, the apply job would run `terraform plan` again at the time of apply — and infrastructure may have changed between when the PR was reviewed and when the merge happened, meaning you apply a different plan than what was reviewed. The saved plan guarantees bit-for-bit that you apply exactly what was reviewed. **Targeted apply** (`-target=resource.address`) lets you apply changes to specific resources only, avoiding accidental modification of unrelated resources. Use this in emergencies or for surgical rollouts. However, avoid using `-target` as a standard workflow — it leaves your state partially applied and creates drift. **Lifecycle rules**: use `lifecycle { prevent_destroy = true }` on critical resources like RDS instances, S3 buckets with data, VPCs. This causes `terraform plan` itself to error if any plan step would destroy these resources — it fails before apply even starts. For existing resources that should never be modified in-place (only replaced), use `lifecycle { create_before_destroy = true }` to ensure the replacement is created and verified before the original is deleted. **`-auto-approve` caution**: while necessary in CI (no interactive terminal), never combine `-auto-approve` with `terraform apply` when running ad-hoc locally for production. Always review the plan output before confirming. In CI, the human review happens at the PR comment stage and the environment approval gate — by the time `apply -auto-approve` runs, the approval has already been given through the governance workflow.",
        np: "CI मा `terraform apply` safely run गर्न workflow gate, plan review, environment protection rule, र targeted apply flag को combination चाहिन्छ — कुनै एउटा technique मात्र पर्याप्त छैन। **Workflow gate**: plan र apply लाई distinct CI job मा अलग गर्नुहोस्। Plan job प्रत्येक PR commit मा run हुन्छ, plan generate गर्छ, र PR comment को रूपमा post गर्छ। Apply job code main branch मा merge भएपछि मात्र run हुन्छ — feature branch मा होइन, PR मा होइन। यसको अर्थ कोही पनि code review बिना apply trigger गर्न सक्दैन। GitHub Actions मा apply job मा `if: github.event_name == 'push' && github.ref == 'refs/heads/main'` प्रयोग गर्नुहोस्। **Environment protection rule**: GitHub मा `production` environment create गर्नुहोस् (Settings → Environments) र \"Required reviewers\" configure गर्नुहोस् — apply job start हुन अनुमति दिनु अघि एक वा बढी engineer ले GitHub UI मा explicitly deployment approve गर्नुपर्छ। यो PR merge पछि पनि human gate हो। **Saved plan**: plan job मा सधैं `terraform plan -out=tfplan` प्रयोग गर्नुहोस् र binary plan CI artifact को रूपमा upload गर्नुहोस्। Apply job ले artifact download गर्छ र `terraform apply tfplan` run गर्छ। यो critical छ: saved plan बिना, apply job ले apply को समयमा फेरि `terraform plan` run गर्थ्यो — PR review भएको बेला र merge भएको बेला बीचमा infrastructure change भएको हुन सक्छ, जसको अर्थ review भएकोभन्दा different plan apply हुन्छ। Saved plan ले bit-for-bit guarantee गर्छ कि review भएको exactly त्यही apply हुन्छ। **Targeted apply** (`-target=resource.address`) ले specific resource मा मात्र change apply गर्न दिन्छ, unrelated resource को accidental modification बाट बच्दै। Emergency वा surgical rollout मा यो प्रयोग गर्नुहोस्। तर, standard workflow को रूपमा `-target` प्रयोग नगर्नुहोस् — यसले state partially applied छाड्छ र drift create गर्छ। **Lifecycle rule**: RDS instance, data भएको S3 bucket, VPC जस्तो critical resource मा `lifecycle { prevent_destroy = true }` प्रयोग गर्नुहोस्। यसले कुनै plan step ले यी resource destroy गर्छ भने `terraform plan` आफैं error गर्छ — apply start हुनु अघि नै fail हुन्छ। **`-auto-approve` सावधानी**: CI मा आवश्यक भए पनि (interactive terminal छैन), production को लागि locally ad-hoc run गर्दा `terraform apply` सँग `-auto-approve` कहिल्यै combine नगर्नुहोस्। Confirm गर्नुअघि सधैं plan output review गर्नुहोस्।",
        jp: "CI で `terraform apply` を安全に実行するには、ワークフローゲート・プランレビュー・環境保護ルール・ターゲット適用フラグの組み合わせが必要です — 単一のテクニックだけでは不十分です。**ワークフローゲート**：プランと適用を別々の CI ジョブに分離する。プランジョブはすべての PR コミットで実行され、プランを生成して PR コメントとして投稿します。適用ジョブはコードがメインブランチにマージされた時のみ実行されます — 機能ブランチでも PR でもなく。つまり、コードレビューなしに誰も適用をトリガーできません。GitHub Actions では適用ジョブに `if: github.event_name == 'push' && github.ref == 'refs/heads/main'` を使用します。**環境保護ルール**：GitHub で `production` 環境を作成し（Settings → Environments）「Required reviewers」を設定する — 適用ジョブの開始が許可される前に 1 人以上のエンジニアが GitHub UI でデプロイを明示的に承認する必要があります。これは PR マージ後でも人間によるゲートです。**保存済みプラン**：プランジョブで常に `terraform plan -out=tfplan` を使用し、バイナリプランを CI アーティファクトとしてアップロードする。適用ジョブがアーティファクトをダウンロードして `terraform apply tfplan` を実行します。これは重要です：保存済みプランなしでは、適用ジョブは適用時に再び `terraform plan` を実行します — PR がレビューされた時とマージが発生した時の間でインフラが変わっている可能性があり、レビューされたものと異なるプランが適用されることを意味します。保存済みプランは、レビューされた内容が正確にビット単位で適用されることを保証します。**ターゲット適用**（`-target=resource.address`）は特定のリソースのみに変更を適用し、無関係のリソースの偶発的な変更を避けます。緊急時や外科的なロールアウトに使用します。ただし `-target` を標準ワークフローとして使用しないでください — 状態が部分的に適用されたままになり、ドリフトが発生します。**ライフサイクルルール**：RDS インスタンス・データを含む S3 バケット・VPC などの重要なリソースに `lifecycle { prevent_destroy = true }` を使用する。これにより、プランステップがこれらのリソースを破棄しようとする場合、`terraform plan` 自体がエラーになります — 適用が開始する前に失敗します。",
      },
      tag: {
        en: "safe CI apply & production protection",
        np: "safe CI apply र production protection",
        jp: "安全な CI 適用と本番保護",
      },
    },
    {
      question: {
        en: "What is `terraform plan -out=tfplan` and why is it the recommended way to plan+apply in CI?",
        np: "`terraform plan -out=tfplan` के हो र CI मा plan+apply गर्ने recommended तरिका यो किन हो?",
        jp: "`terraform plan -out=tfplan` とは何か、そしてなぜ CI でのプラン+適用の推奨方法なのか？",
      },
      answer: {
        en: "When you run `terraform plan` without the `-out` flag, Terraform computes the diff and prints it to stdout — but the plan is ephemeral, computed at that moment and immediately discarded. If you later run `terraform apply` in a separate step (as CI pipelines do), Terraform recomputes the plan from scratch using the current state and current provider APIs. Between your plan run and your apply run, time passes — and things can change: another engineer merges a different PR and applies first, changing the state; an AWS API returns a different value for a data source; a security group rule is manually modified in the console. The result is that you apply a different plan than the one you reviewed. This is called **plan drift** and it is the #1 source of unexpected infrastructure changes in CI pipelines. `terraform plan -out=tfplan` writes the binary plan representation to a file (`tfplan` by convention). This file encodes the exact set of API calls Terraform will make — the resource addresses, the before/after attribute values, the dependencies, the provider versions. When you then run `terraform apply tfplan`, Terraform reads the binary plan and executes exactly those calls with no re-planning. The infrastructure change is deterministic: it is impossible for the apply to diverge from the reviewed plan as long as the same tfplan file is used. In a GitHub Actions workflow, the plan job saves `tfplan` as a workflow artifact (encrypted at rest in GitHub's artifact storage). The apply job downloads the same artifact and passes it to `terraform apply`. The PR comment shows the human-readable output of the same plan that will be applied — the reviewer is approving exactly what they see. Two important notes: (1) `tfplan` files are not portable across Terraform versions — the apply job must use the exact same Terraform binary version as the plan job, which is why pinning `TF_VERSION` in your CI environment is essential; (2) `tfplan` may contain sensitive values (passwords, keys) because it encodes the full attribute diff — treat it as a secret, use encrypted artifact storage, and do not log it to stdout in CI. In Terraform Cloud and Atlantis, the plan file is handled internally and never exposed to CI logs — one more reason managed platforms add security value beyond just convenience.",
        np: "`-out` flag बिना `terraform plan` run गर्दा, Terraform ले diff compute गर्छ र stdout मा print गर्छ — तर plan ephemeral हो, त्यस क्षणमा computed र तुरुन्त discard हुन्छ। यदि पछि छुट्टै step मा `terraform apply` run गर्नुभयो (CI pipeline जस्तै), Terraform ले current state र current provider API प्रयोग गरेर scratch बाट plan recompute गर्छ। Plan run र apply run बीचमा समय बित्छ — र कुरा change हुन सक्छ: अर्को engineer ले different PR merge गरेर पहिले apply गर्छ, state change हुन्छ; AWS API ले data source को लागि different value return गर्छ; console मा manually security group rule modify हुन्छ। परिणाम यो हो कि review भएकोभन्दा different plan apply हुन्छ। यसलाई **plan drift** भनिन्छ र यो CI pipeline मा unexpected infrastructure change को #1 कारण हो। `terraform plan -out=tfplan` ले binary plan representation file मा write गर्छ (`tfplan` convention अनुसार)। यो file ले Terraform ले गर्ने exact set of API call encode गर्छ — resource address, before/after attribute value, dependency, provider version। `terraform apply tfplan` run गर्दा, Terraform ले binary plan read गर्छ र re-planning बिना exactly ती call execute गर्छ। Infrastructure change deterministic छ: जबसम्म same tfplan file प्रयोग गरिन्छ apply review भएको plan बाट diverge हुन impossible छ। GitHub Actions workflow मा, plan job ले `tfplan` workflow artifact को रूपमा save गर्छ (GitHub को artifact storage मा encrypted)। Apply job ले same artifact download गर्छ र `terraform apply` मा pass गर्छ। PR comment ले apply हुने same plan को human-readable output देखाउँछ — reviewer ले exactly आफूले देखेको approve गर्दैछन्। दुईवटा important note: (१) `tfplan` file Terraform version पार portable छैन — apply job ले plan job जस्तै exact Terraform binary version प्रयोग गर्नुपर्छ, यसैले CI environment मा `TF_VERSION` pin गर्नु essential हो; (२) `tfplan` मा sensitive value हुन सक्छ (password, key) किनभने यसले full attribute diff encode गर्छ — यसलाई secret मान्नुहोस्, encrypted artifact storage प्रयोग गर्नुहोस्, र CI मा stdout मा log नगर्नुहोस्।",
        jp: "`-out` フラグなしで `terraform plan` を実行すると、Terraform は差分を計算して stdout に出力します — しかしプランは一時的なもので、その瞬間に計算されてすぐに破棄されます。後で別のステップで `terraform apply` を実行すると（CI パイプラインのように）、Terraform は現在の状態と現在のプロバイダー API を使ってゼロからプランを再計算します。プランの実行と適用の実行の間に時間が経過し、物事が変わる可能性があります：別のエンジニアが別の PR をマージして先に適用し状態が変わる；AWS API がデータソースに対して異なる値を返す；コンソールでセキュリティグループルールが手動変更される。結果として、レビューされたものと異なるプランが適用されます。これは**プランドリフト**と呼ばれ、CI パイプラインで予期しないインフラ変更の第 1 の原因です。`terraform plan -out=tfplan` はバイナリプラン表現をファイルに書き込みます（慣例として `tfplan`）。このファイルは Terraform が行う正確な API 呼び出しのセットをエンコードします — リソースアドレス・変更前後の属性値・依存関係・プロバイダーバージョン。`terraform apply tfplan` を実行すると、Terraform はバイナリプランを読み込み、再計画なしに正確にそれらの呼び出しを実行します。インフラの変更は決定論的です：同じ tfplan ファイルが使用される限り、適用がレビュー済みのプランから逸脱することは不可能です。GitHub Actions ワークフローでは、プランジョブが `tfplan` をワークフローアーティファクトとして保存します（GitHub のアーティファクトストレージで暗号化）。適用ジョブは同じアーティファクトをダウンロードして `terraform apply` に渡します。PR コメントには適用される同じプランの人間が読める出力が表示されます — レビュアーは自分が見ているものを正確に承認しています。2 つの重要な注意点：(1) `tfplan` ファイルは Terraform バージョン間でポータブルではありません — 適用ジョブはプランジョブと同じ正確な Terraform バイナリバージョンを使用する必要があり、CI 環境で `TF_VERSION` をピン留めすることが不可欠な理由です；(2) `tfplan` は完全な属性差分をエンコードするため機密値（パスワード・キー）を含む可能性があります — シークレットとして扱い、暗号化されたアーティファクトストレージを使用し、CI で stdout にログしないでください。",
      },
      tag: {
        en: "plan -out & deterministic apply",
        np: "plan -out र deterministic apply",
        jp: "plan -out と決定論的な適用",
      },
    },
  ],
};
